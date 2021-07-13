/**
 * this.$fileUploader
 * @author 李朝
 * @property upload: Function 上传文件
 *   @param files: Array 文件集合
 *   @example
 *     this.$fileUploader.upload(files)
 *       .then(attrs => { // attrs: 返回的附件信息，指定格式 { alikeyId: '', fileName: '', fileSize: 0, suffix: '' } })
 *       .catch(err => { // err: 错误信息 })
 * 
 * @property getFileUrl: Function 获取附件地址
 *   @param keys: Array 附件的 alikeyId 集合
 *   @example
 *     this.$fileUploader.getFileUrl(keys)
 *       .then(urls => { // urls: 返回的可用文件地址，一般用于图片预览 })
 *       .catch(err => { // err: 错误信息 })
 * 
 * @property getDown: Function 下载附件
 *   @param key: String 附件的 alikeyId
 *   @param name: String 下载的文件名
 *   @example
 *     this.$fileUploader.getDown(key, name) // 无返回
 * 
 * @property previewImages: Function 多图预览
 *   @param keys: String|Array 附件的 alikeyId 集合，也可传但个 aliKeyId
 *   @param n: Number 起始预览图片下标
 *   @param isUrl: Boolean keys 参数是否传的是图片地址，true 时直接使用地址进行预览
 *   @example
 *     this.$fileUploader.previewImages(keys, n, isUrl) // 无返回
 * 
 * @property previewFile: Function 单文件预览
 *   @param key: String 附件的 alikeyId
 *   @param name: String 文件名 用于判断文件类型
 *   @example
 *     this.$fileUploader.previewFile(key, name) // 无返回
 */

import Vue from 'vue'
import ELEMENT from 'element-ui'
import { $post, $get } from '@/requires/http'
import { getServUrl } from './urlFmt'
import imgPreview from '@/utils/imgPreview'
import ToDownload from './toDownload'
const imageTypes = ['jpg', 'jpeg', 'png']
const videoTypes = ['mp4']

function getUploadType() {
  return $get('/fa/sys/attach/api/getFileMemory').then(res => {
    return { cloud: AliOss, local: BwOss }[res]
  })
}
function getAliyunToken() {
  return $post('/fa/sys/attach/api/getAliyunToken').then(res => {
    return res.obj
  })
}

const AliOss = {
  createOSSClient() {
    return new Promise((resolve, reject) => {
      if (this.OSSClient && (new Date().getTime() - this.TIME) < this.TIMEOUT_SECONDS * 1000) {
        return resolve(this.OSSClient)
      } else {
          getAliyunToken().then(data => {
          let {
            AccessKeyId: accessKeyId,
            AccessKeySecret: accessKeySecret,
            SecurityToken: stsToken,
            bucket,
            endpoint: region,
            tokenExpireTime
          } = data
          this.TIMEOUT_SECONDS = +tokenExpireTime - 120
          this.OSSClient = new OSS.Wrapper({
            accessKeyId, accessKeySecret, stsToken,
            bucket,
            region
          })
          this.TIME = new Date().getTime();
          return resolve(this.OSSClient)
          }).catch(err => {
          reject(err)
        })
      }
      })
  },

  getUrl(key) {
    return key ? this.createOSSClient().then(client => {
      return client.signatureUrl(key)
    }) : Promise.resolve(null)
  },

  previewRes(name) {
      return name ? {
        response: {
          'content-disposition': 'inline; filename="' + encodeURI(name) + '"'
        }
      } : {}
  },
  getFileUrl(OssKeys, names) {
      return this.createOSSClient().then(client => {
      return Array.isArray(OssKeys)
        ? OssKeys.map((url, i) => url ? client.signatureUrl(url, names && this.previewRes(names[i])) : null)
        : OssKeys ? client.signatureUrl(OssKeys, this.previewRes(names)) : null;
      });
  },
  
  getDownloadUrl (key, name) {
    return this.createOSSClient().then(() => {
      return name ? this.OSSClient.signatureUrl(key, {
        response: { 'content-disposition': 'attachment; filename="' + encodeURI(name, 'UTF-8') }
      }) : this.OSSClient.signatureUrl(key)
    })
  },
  
  downLoadFile(key, name) {
    return this.getDownloadUrl(key, name)
      .then(url => ToDownload(url, name))
      .catch(err => {console.log(err)})
  },
  
  uploadFile(file) {
    let type = file.name.split('.').pop().toLowerCase();
    let random_name = this.random_string(6) + '.' + type;
    return this.createOSSClient()
      .then(() => this.OSSClient.multipartUpload(random_name, file))
      .then(res => res.name)
  },

  previewOfficeFile(key, name) {
    const type = name.split('.').pop().toLowerCase()
    // window.open('/fa/page.html?method=filePreview&id=' + key + '&type=' + type, "_blank")
  },
  random_string(len) {
    len = len || 32;
    let result = '';
    while (len > 0) {
      result += this.CHARS.charAt(Math.floor(Math.random() * this.CHARS.length));
      len--;
    }
    return result + '_' + new Date().getTime()
  }
}

const BwOss = {
  uploadFile(file) {
    return $post('/fa/sys/attach/api/uploadSingle', { file }, { paramsType: 'formData' })
  },
  downLoadFile(key, name) {
    let url = '/fa/sys/attach/api/fileDownload?attId=' + key
    return $get(url, {}, { responseType: 'blob' }).then(res => {
      var reader = new FileReader();
      reader.readAsDataURL(res.data);  // 转换为base64，可以直接放入 <a> 标签href
      reader.onload = function (e) {
        ToDownload(e.target.result, decodeURI(res.fileName))
      }
    })
    /* return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = "blob"
      // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
      xhr.onload = function () {
        var responseHeaders = xhr.getAllResponseHeaders().split('\n').reduce((a, b) => {
          const [key, value] = b.split(': ')
          a[key] = value
          return a
        }, {})
        
        if (responseHeaders['content-disposition']) {
          var fileName = responseHeaders['content-disposition']
            .replace(/ /g, '')
            .split(';')
            .reduce((a,b) => {
              const [k, v] = b.split('=');
              a[k] = decodeURI((v || '').replace(/"/g, ''));
              return a
            }, {})
            .filename.slice(0, -1)
          // 请求完成
          if (this.status === 200) {
            // 返回200
            var blob = this.response;
            var reader = new FileReader();
            reader.readAsDataURL(blob);  // 转换为base64，可以直接放入 <a> 标签href
            reader.onload = function (e) {
              ToDownload(e.target.result, fileName)
            }
          }
        }
        else {
          this.response.text().then(res => {
            var data = JSON.parse(res)
            // vm.$message.error(data && data.msg || "请求失败，请稍后再试！")
          })
        }
        loading.close();
      };
      const loading = $loading({ text: '操作进行中，请稍后....' })
      // 发送ajax请求
      xhr.send() */
    // })
  },
  getUrl(key) {
    return key ? Promise.resolve(getServUrl('/fa/bg/bwssAttachmentPreview/localPicturePreview?attId=' + key)) : null
  },
  previewOfficeFile(key, name) {
    this.downLoadFile(key, name)
    // POBrowser.openWindowModeless(getServUrl('/fa/bg/bwssAttachmentPreview/pageOfficePreview?attId=' + key),'width=1100px;height=850px');
  }
}

function FileUploader() {
  this.CHARS = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  this.TIME = new Date().getTime()
  this.TIMEOUT_SECONDS = 58 * 60
  this.imgVm = new (Vue.extend(ELEMENT.Image))()
  this.imgVm.$mount()
  const imgEl = this.imgVm.$el
  Object.assign(imgEl.style, {
    position: 'fixed',
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    zIndex: 9999
  })
  document.body.appendChild(this.imgVm.$el)
}
FileUploader.prototype = {
  upload(files) {
    return files.reduce(
      (res, file) => res.then(attachs =>
        this.uploadFile(file)
          .then(key => [...attachs, {
            alikeyId: key,
            fileName: file.name,
            fileSize: file.size,
            suffix: file.name.split('.').pop().toLowerCase()
          }])
      ),
      Promise.resolve([])
    )
  },
  getFileUrl(keys) {
    if (!keys) return Promise.resolve(null)
    return Array.isArray(keys) ? Promise.all(keys.map(k => this.getUrl(k))) : this.getUrl(keys)
  },
  getDown(key, name) {
    this.downLoadFile(key, name)
  },
  previewImages(keys, n, isUrl) {
    if (n) keys.push(...keys.splice(0, n))
    imgPreview(keys)
  },
  previewFile(key, name) {
    const type = name.split('.').pop().toLowerCase()
    if (imageTypes.includes(type)) this.previewImages(key)
    // else if(videoTypes.includes(type)) window.open('/fa/page.html?method=filePreview&id=' + key + '&type=' + type, "_blank")
    else this.previewOfficeFile(key, name)
  }
}

export default () => getUploadType().then(res => {
  Object.assign(FileUploader.prototype, res)
  Vue.prototype.$fileUploader = new FileUploader()
}).catch(err => {
  console.log('err', err)
})
