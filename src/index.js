function colorRange(){
    // arguments的第一个参数是百分比，例：50,60
    // 第二个参数是返回值类型，可选rgb，rgba，hex，hsla；rgb返回的默认opacity等于1
    // 第三个及以后的参数是过渡色，要求格式每个格式是数组或字符串，数组第一位是色值，第二位是起点['#000000', 0], ['#ffffff', 100],
    // 如果第三个往后的参数只传了单一值#000，默认步长均分
    console.log(arguments)
    if(arguments.length < 3){
        console.log('没有颜色变化范围')
        return
    }

    // 校验百分比
    let percent = arguments[0];
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    if(!regPos.test(percent)){
        console.log('第一个参数不是数字');
        return
    }


    // 校验返回类型
    let type = arguments[1];
    if(getArgumentType(type) != 'string' || ['RGB', 'RGBA', 'HEX', 'HSLA'].indexOf(type.toUpperCase()) == -1){
        console.log('不支持的返回类型')
        return
    }


    let color = Array.prototype.slice.call(arguments, 2);;

    // 这里只要数组或者字符串
    function getArgumentType(a){
        switch(a.constructor){
            case Array:
                return 'array'
            case String:
                return 'string'
            case Number:
                return 'number'
            case Object:
                return 'object'
        }
        
    }

    // 先取第一个的格式，判断后面的是不是和第一个相等
    var argumentsType = getArgumentType(color[0]);
    for(let i = 0 ; i < color.length ; i++){
        if(getArgumentType(color[i]) != argumentsType){
            console.log('输入色值格式不统一')
            return
        }
    }

    // 检验颜色格式，a可能是字符串或者数组
    function regColorType(a){
        let colorStr = ''
        if(getArgumentType(a) == 'string'){
            colorStr = a
        }
        if(getArgumentType(a) == 'array'){
            // 如果是数组判断第二个是不是数字
            if(getArgumentType(a[1]) != 'number'){
                return false
            }
            colorStr = a[0]
        }
        // 替换空格
        colorStr.replace(" ","");

    }

    
    // 找到需要的数在数组的位置
    if(argumentsType == 'array'){
        color.push(['', percent])

        // 按照起点排序
        color.srot(function(a, b){
            return a[1] - b[1]
        })

    }

    if(argumentsType == 'string'){

    }
    






}
module.exports = colorRange;