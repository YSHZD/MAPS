import Vue from 'vue'
import ImageViewer from 'element-ui/packages/image/src/image-viewer'

let overflow, viewer

const filterUrl = url => Promise.resolve(~url.indexOf('/') ? url : Vue.prototype.$fileUploader.getUrl(url))

export default (urls, index = 0) => {
  (Array.isArray(urls) ? Promise.all(urls.map(filterUrl)) : filterUrl(urls))
    .then(urls => {
      if (!viewer) {
        viewer = new (Vue.extend(ImageViewer))()
        viewer.onClose = () => {
          document.body.style.overflow = overflow
          document.body.removeChild(viewer.$el)
        }
        viewer.$mount()
      }
      viewer.$set(viewer, 'urlList', Array.isArray(urls) ? urls : [urls])
      viewer.$set(viewer, 'index', index)
      viewer.reset()
      viewer.deviceSupportInstall()
      overflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      viewer.$el.style.zIndex = 9999
      document.body.appendChild(viewer.$el)
    })
}
