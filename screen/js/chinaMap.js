function initMap(){
    var myChart = echarts.init(document.getElementById('mapchart'));
    var option = {
        // 图表主标题
        title: {
            text: '', // 主标题文本，支持使用 \n 换行
            top: 15, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
            left: 'left', // 值: 'left', 'center', 'right' 同上
            textStyle: { // 文本样式
            fontSize: 17,
            fontWeight: 600,
            color: '#fff'
            }
        },
        // 提示框组件
        tooltip: {
            trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
            // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
            // 使用函数模板  传入的数据值 -> value: number | Array
            formatter: function (val) {
            if (val.data.value[2] < 10000) {
                return val.data.name + '<br>人口数量: ' + val.data.value[2] + '万'
            } else {
                return val.data.name + '<br>人口数量: ' + (val.data.value[2] / 10000).toFixed(2) + '亿'
            }
            }
        },
        geo: {
            map: 'china', // 地图类型
            show: true, // 是否显示地理坐标系组件
            // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，
            // 可以设置成 'scale' 或者 'move' 设置成 true 为都开启
            roam: false,
            // 图形上的文本标签
            label: {
            show: false // 是否显示对应地名
            },
            // 地图区域的多边形 图形样式
            itemStyle: {
            areaColor: '#eee', // 地图区域的颜色
            borderWidth: 0.5, // 描边线宽 为 0 时无描边
            borderColor: 'gray', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
            borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
            },
            // 高亮状态下的多边形和标签样式
            emphasis: {
            label: {
                show: true, // 是否显示标签
                color: '#fff' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
            },
            itemStyle: {
                areaColor: '#aeaeae' // 地图区域的颜色
            }
            }
        },
        series: [
            {
            type: 'scatter', // 类型
            coordinateSystem: 'geo', // 该系列使用的坐标系 可选: 'cartesian2d','polar','geo'
            // 标记的图形, 标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 
            // 'pin', 'arrow', 'none'
            symbol: 'circle', 
            symbolSize: 8, // 标记的大小
            // 图形的样式
            itemStyle: {
                color: 'purple'
            },
            // 系列中的数据内容数组, 数组项通常为具体的数据项
            data: [
                { name: '北京', value: [116.405285, 39.904989, 2154] },
                { name: '天津', value: [117.190182, 39.125596, 1560] },
                { name: '上海', value: [121.472644, 31.231706, 2424] },
                { name: '重庆', value: [106.504962, 29.533155, 3102] },
                { name: '河北', value: [114.502461, 38.045474, 7556] },
                { name: '河南', value: [113.665412, 34.757975, 9605] },
                { name: '云南', value: [102.712251, 25.040609, 4830] },
                { name: '辽宁', value: [123.429096, 41.796767, 4359] },
                { name: '黑龙江', value: [126.642464, 45.756967, 3773] },
                { name: '湖南', value: [112.982279, 28.19409, 6899] },
                { name: '安徽', value: [117.283042, 31.86119, 6324] },
                { name: '山东', value: [117.000923, 36.675807, 10000] },
                { name: '新疆', value: [87.617733, 43.792818, 2487] },
                { name: '江苏', value: [118.767413, 32.041544, 8051] },
                { name: '浙江', value: [120.153576, 30.287459, 5737] },
                { name: '江西', value: [115.892151, 28.676493, 4648] },
                { name: '湖北', value: [114.298572, 30.584355, 5917] },
                { name: '广西', value: [108.320004, 22.82402, 4926] },
                { name: '甘肃', value: [103.823557, 36.058039, 2637] },
                { name: '山西', value: [112.549248, 37.857014, 3718] },
                { name: '内蒙古', value: [111.670801, 40.818311, 2534] },
                { name: '陕西', value: [108.948024, 34.263161, 3864] },
                { name: '吉林', value: [125.3245, 43.886841, 2704] },
                { name: '福建', value: [119.306239, 26.075302, 3941] },
                { name: '贵州', value: [106.713478, 26.578343, 3600] },
                { name: '广东', value: [113.280637, 23.125178, 11300] },
                { name: '青海', value: [101.778916, 36.623178, 603] },
                { name: '西藏', value: [91.132212, 29.660361, 344] },
                { name: '四川', value: [104.065735, 30.659462, 8341] },
                { name: '宁夏', value: [106.278179, 38.46637, 688] },
                { name: '海南', value: [110.33119, 20.031971, 934] },
                { name: '台湾', value: [121.509062, 25.044332, 2358] },
                { name: '香港', value: [114.173355, 22.320048, 745] },
                { name: '澳门', value: [113.54909, 22.198951, 63] },
                { name: '南海诸岛', value: [114.252615, 15.86029, 271.13] }
            ]
            },
            {
            type: 'effectScatter', // 类型
            coordinateSystem: 'geo', // 该系列使用的坐标系 可选: 'cartesian2d','polar','geo'
            // 标记的图形, 标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 
            // 'pin', 'arrow', 'none'
            symbol: 'circle',  
            // 标记的大小, 如果需要每个数据的图形大小不一样，可以设置为如下格式的回调函数 
            // (value: Array|number, params: Object) => number|Array
            // 其中第一个参数 value 为 data 中的数据值。第二个参数params 是其它的数据项参数
            symbolSize: function (val) {
                return val[2] / 600
            },
            // 图形的样式
            itemStyle: {
                color: 'purple'
            },
            // 系列中的数据内容数组。数组项通常为具体的数据项
            data: [
                { name: '广东', value: [113.280637, 23.125178, 11300] },
                { name: '山东', value: [117.000923, 36.675807, 10000] },
                { name: '河南', value: [113.665412, 34.757975, 9605] },
                { name: '四川', value: [104.065735, 30.659462, 8341] },
                { name: '江苏', value: [118.767413, 32.041544, 8051] },
                { name: '河北', value: [114.502461, 38.045474, 7556] }
            ]
            }
        ]
    }
    
    myChart.setOption(option);

    // // 定时显示提示框和高亮效果
    let index = -1
    setInterval(function () {
    // 隐藏提示框
    myChart.dispatchAction({
        type: 'hideTip',
        seriesIndex: 0,
        dataIndex: index
    })
    // 显示提示框
    myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: index + 1
    })
    // 取消高亮指定的数据图形
    myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: index
    })
    // 高亮指定的数据图形
    myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: index + 1
    })
    index++
    if (index > 34) {
        index = -1
    }
    }, 2000)
}