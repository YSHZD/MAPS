Date.prototype.format = function(fmt){
    let o = {
        "M+":this.getMonth() + 1,
        "d+":this.getDate(),
        "h+":this.getHours(),
        "m+":this.getMinutes(),
        "s+":this.getSeconds(),
        "q+":Math.floor((this.getMonth() + 3) / 3),
        "S":this.getMilliseconds()
    }

    if (/(y+)/i.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }

    for (var k in o){
        if(Object.hasOwnProperty.call(o,k)){
            if(new RegExp("(" + k + ")", "i").test(fmt)){
                fmt = fmt.replace(
                    RegExp.$1,(RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))
                )
            }
        }
    }

    return fmt
}

export const myTime = (v,fmt) => {
    return new Date(v).format(fmt)
}



export const  util = {
    _extend(to, _from) {
        for (let key in _from) {
            to[key] = _from[key];
        }
        return to;
    },
    _kebabCase(str) { 
        const hyphenateRE = /([^-])([A-Z])/g;
        return str
            .replace(hyphenateRE, '$1-$2')
            .replace(hyphenateRE, '$1-$2')
            .toLowerCase();
    },
    _hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key);
    },
    _trim(string){
        return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
    },
    _isNumber(v){
        let reg = /^[0-9]+.?[0-9]*$/;
        if(reg.test(v)){
            return true
        }
        return false
    },
    _isExpression(v){
        let reg = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g;
        if(reg.test(v)){
            return true
        }
        return false
    },
    _isCarID:function(value){
        let reg = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/
        if(reg.test(value)){
            return true
        }
        return false
    },
    _isIdCard: function(value) {
    // 传入字符串
    var idCard = value.toString();
    if (idCard.length == 15) {
        return this.__isValidityBrithBy15IdCard(idCard);
    } else if (idCard.length == 18) {
        if (
        this.__isValidityBrithBy18IdCard(idCard) &&
        this.__isTrueValidateCodeBy18IdCard(idCard)
        ) {
        return true;
        } else {
        return false;
        }
    } else {
        return false;
    }
    },
    __isTrueValidateCodeBy18IdCard: function(idCard) {
    var code = idCard.toUpperCase();
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;

    if (
        !code ||
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
        code
        )
    ) {
        tip = "格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
        code = code.split("");
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
        }
        var last = parity[sum % 11];
        if (parity[sum % 11] != code[17]) {
            tip = "校验位错误";
            pass = false;
        }
        }
    }
    return pass;
    },
    __isValidityBrithBy18IdCard: function(idCard18) {
        var year = idCard18.substring(6, 10);
        var month = idCard18.substring(10, 12);
        var day = idCard18.substring(12, 14);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (
            temp_date.getFullYear() != parseFloat(year) ||
            temp_date.getMonth() != parseFloat(month) - 1 ||
            temp_date.getDate() != parseFloat(day)
        ) {
            return false;
        } else {
            return true;
        }
        },
        __isValidityBrithBy15IdCard: function(idCard15) {
        var year = idCard15.substring(6, 8);
        var month = idCard15.substring(8, 10);
        var day = idCard15.substring(10, 12);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));

        if (
            temp_date.getYear() != parseFloat(year) ||
            temp_date.getMonth() != parseFloat(month) - 1 ||
            temp_date.getDate() != parseFloat(day)
        ) {
            return false;
        } else {
            return true;
        }
    }
}












