import Vue from 'vue';
Vue.mixin({
    data(){
        return {
            timersArr: []
        }
    },
    destroyed(){
        if(this.timersArr.length){
            this.timersArr.forEach((item)=>{
                item && clearInterval(item);
            })
            this.timersArr = [];
        }
    },
    methods:{
        bwPrompt(str, title, flag, data = {
            inputValue:15,
            inputValidator:function(v){
                if(!/^[1-9]\d?$|^1[01]\d$|^120$/.test(v) || !v){
                    return '请输入1~120分钟内的整数且不能有空格'
                }else{
                    return true
                }
            }
        }){
            return this.$prompt(str, title, {
                showClose:false,
                customClass:flag?'fuck_pop':'',
                closeOnClickModal:false,
                closeOnPressEscape:false,
                inputValue:data.inputValue,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: data.inputValidator,
                inputErrorMessage: '不能有空格'
            })
        },
        bwConfirm(str, flag){
            return this.$confirm(str, '提示', {
                customClass:flag?'fuck_pop':'',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true 
            })
        },
        bwMsg(data, flag){ 
            this.$message({
                customClass:flag?'fuck_msg':'',
                message:data.msg,
                type:data.code == 0?'success':'error',
            })
        },
        setIntervals({fn = '',time = 1000, index = 0, argDatas ='',clearArrIndex = []} = {}){
            this.timersArr[index] && clearInterval(this.timersArr[index])
            if(clearArrIndex && clearArrIndex.length){
                clearArrIndex.forEach((item,index)=>{
                    if(this.timersArr.length && this.timersArr[item]){
                        clearInterval(this.timersArr[item]);
                        this.timersArr[item] = null;
                    }
                }) 
            }  
            this.timersArr[index] = setInterval(()=>{this[fn](argDatas)},time)
        }, 
    }
})