import Vue from 'vue'
import ELEMENT from 'element-ui'
Vue.use(ELEMENT)

let notDataImg = require('@/assets/brain-image/notData.png')
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
        <img style="width: 50%;height: auto;object-fit:contain;" src="${ notDataImg }"/>
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

Vue.mixin({
    data(){
        return {
            dialog_vm:null
        }
    },
    destroyed(){
       if(this.dialog_vm && this.dialog_vm.visible){
            this.dialog_vm.visible = false;
            this.dialog_vm.$el && document.body.removeChild(this.dialog_vm.$el)
       }
    },
    methods:{
        dialogOpen(dialogOptions){
            this.dialog_vm = new (Vue.extend(ELEMENT.Dialog))()
            let that = this;
            if(dialogOptions.options.beforeClose){
                let beforeClose = dialogOptions.options.beforeClose;
                dialogOptions.options.beforeClose = function(e){
                    that.dialog_vm.$root.$emit('popClose')
                    beforeClose.call(this, e)
                }
            }else{
                dialogOptions.options.beforeClose = done => {
                    this.dialog_vm.$root.$emit('popClose')
                    done()
                }
            }
            
            
            
            this.dialog_vm.title = dialogOptions.options.title

            this.dialog_vm.$on('update:visible', v =>{
                v && this.dialog_vm.$root.$emit('popOpen')
                this.dialog_vm.visible = v;
                !v && this.dialog_vm.$el && document.body.removeChild(this.dialog_vm.$el)
            })
            
            this.dialog_vm.$mount()

            let containDom = this.dialog_vm.$el.querySelector('.el-dialog');
            let closeBtn = this.dialog_vm.$el.querySelector('.el-dialog__close');
           
            Object.assign(closeBtn.style,{
                'color':'#ffffff'
            });
         
            let bgImgSrc = dialogOptions.bgImgSrc?dialogOptions.bgImgSrc:require('@/assets/brain-image/topbig.jpg')

            

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

            document.body.appendChild(this.dialog_vm.$el)

            Object.assign(this.dialog_vm,dialogOptions.options)

            if(this.dialog_vm.title){
                this.dialog_vm.$slots.title = this.dialog_vm.$createElement('div',[
                    this.dialog_vm.$createElement('span',{'style':{'margin-right':'5px'}},this.dialog_vm.title),
                    this.dialog_vm.$createElement('img',{'attrs':{ 'src':require('@/assets/brain-image/lefttip.png')}}),
                ])
            }
            

            let propsOptions = {'props':dialogOptions.componentData || {}}

            // 创建内部元素并替换弹窗主体
            this.dialog_vm.$slots.default = this.dialog_vm.$createElement(dialogOptions.componentName, propsOptions)
            
            this.dialog_vm.$on('notData',(val)=>{
                this.dialog_vm.$slots.default = this.dialog_vm.$createElement(notData,{props:{height:val}})
                this.dialog_vm.$forceUpdate()
            })
            // 打开弹窗
            this.dialog_vm.$root.$emit('popOpen')
            this.dialog_vm.visible = true
        }
    }
})