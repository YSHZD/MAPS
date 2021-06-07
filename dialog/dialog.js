(function(Vue,ELEMENT){
	Vue.use(ELEMENT);

	let notData = {
      template:`<div 
        :style="{
          'height':height+'px',
          'min-height':'150px',
          'width':'100%',
          'display':'flex',
          'flex-direction':'column'
        }">
          <div style="flex:1;width:100%;display:flex;justify-content:center;" >
            <img style="width: 50%;height: auto;object-fit:contain;" src="http://10.1.7.137:8080/jszsgxpt-static/b/moltran/assets/css/images/screen/notData.png"/>
          </div>
          <p style="flex:1;text-align:center;width:100%;color: #3c71d3;font-size: 24px">暂无数据</p>
        </div>`,
      props:{
        height:{
          type:Number,
          default:200
        }
      }
    }

    // 为 Vue 添加一个打开方法
    Vue.mixin({
      methods: {
        dialogOpen(dialogOptions) {
           
           // 创建实例： Vue.extend 方法获得组件的构造主体， 构造主体通过 new 创建 Vue 组件实例
          const vm = new (Vue.extend(ELEMENT.Dialog))()
          
          // 监听 visible 变更事件
          vm.$on('update:visible', val => {
            vm.visible = val
            if(!val){
               document.body.removeChild(vm.$el)
            }
          })
         
         
          // 实例空挂载并将创建的元素放入 body 中
          vm.$mount()
        
          let containDom = vm.$el.querySelector('.el-dialog');
          let closeBtn = vm.$el.querySelector('.el-dialog__close');

          Object.assign(closeBtn.style,{
            'color':'#ffffff'
          });
         
          let bgImgSrc = dialogOptions.bgImgSrc?dialogOptions.bgImgSrc:'http://10.1.7.137:8080/jszsgxpt-static/b/moltran/assets/css/images/screen/topbig.jpg'
          Object.assign(containDom.style,{
              'box-shadow': '2px 2px 5px #41baf1',
              'border': '2px solid #41BAF1',
              'border-radius': '10px',
              'background-color': 'rgba(12,35,76,1)',
              'background-image': 'url('+bgImgSrc+')',
              'background-repeat': 'no-repeat',
              'background-position': 'center',
              'background-size': '100% 100%',
              'color':'#ffffff',
              'min-height':'450px'
          })

          document.body.appendChild(vm.$el)

          Object.assign(vm,dialogOptions.options)

          if(vm.title){
              vm.$slots.title = vm.$createElement('div',[
                  vm.$createElement('span',{'style':{'margin-right':'5px'}},vm.title),
                  vm.$createElement('img',{'attrs':{ 'src':'http://10.1.7.137:8080/jszsgxpt-static/b/moltran/assets/css/images/screen/lefttip.png'}}),
              ])
          }
          

         let propsOptions = {'props':dialogOptions.componentData || {}}

          // 创建内部元素并替换弹窗主体
          vm.$slots.default = vm.$createElement(dialogOptions.componentName, propsOptions)
          
          vm.$on('notData',(val)=>{
            vm.$slots.default = vm.$createElement(notData,{props:{height:val}})
            vm.$forceUpdate()
          })
          // 打开弹窗
          console.log(vm.$slots)
          vm.visible = true
        }
      }
    })
})(Vue,ELEMENT)