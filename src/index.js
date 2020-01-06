function colorRange() {
    // arguments的第一个参数是百分比，例：50,60
    // 第二个参数是返回值类型，可选rgb，rgba，hex，hsla；rgb返回的默认opacity等于1
    // 第三个及以后的参数是过渡色，要求格式每个格式是数组或字符串，数组第一位是色值，第二位是起点['#000000', 0], ['#ffffff', 100],
    // 如果第三个往后的参数只传了单一值#000，默认步长均分
    if (arguments.length < 4) {
        console.log('没有颜色变化范围')
        return
    }

    // 校验百分比
    let percent = arguments[0];
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    if (!regPos.test(percent) || percent >= 0) {
        console.log('第一个参数不是数字或者小于0');
        return
    }


    // 校验返回类型
    let type = arguments[1];
    if (getArgumentType(type) != 'string' || ['RGB', 'RGBA', 'HEX', 'HSLA'].indexOf(type.toUpperCase()) == -1) {
        console.log('不支持的返回类型')
        return
    }


    let color = Array.prototype.slice.call(arguments, 2);
    let result;

    // 这里只要数组或者字符串
    function getArgumentType(a) {
        switch (a.constructor) {
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

    // 先取第一个的格式，判断后面的是不是和第一个相等,要么都是数组要么都是字符串
    var argumentsType = getArgumentType(color[0]);
    for (let i = 0; i < color.length; i++) {
        if (getArgumentType(color[i]) != argumentsType) {
            console.log('输入色值格式不统一')
            return
        }
    }

    // 检验颜色格式，a可能是字符串或者数组
    function regColorType(a) {
        let colorStr = '', colorInner = []
        if (getArgumentType(a) == 'string') {
            colorStr = a
        }
        if (getArgumentType(a) == 'array') {
            // 如果是数组判断第二个是不是数字
            if (getArgumentType(a[1]) != 'number') {
                return false
            }
            colorStr = a[0]
        }
        // 替换空格
        colorStr.replace(" ", "");
        // 取到色值字符串,rgb,rgba,hlsa
        colorStr = colorStr.toLocaleUpperCase();
        if (colorStr.search("RGBA") == 0) {
            colorInner = colorStr.slice(5, -1).split(',')
            if (colorInner.length != 4) {
                colorInner = []
            }
        } else if (colorStr.search("RGB") == 0) {
            colorInner = colorStr.slice(4, -1).split(',')
            if (colorInner.length != 3) {
                colorInner = []
            }
        } else if (colorStr.search("#") == 0) {
            if (colorStr.length != 7) {
                colorInner = []
            } else {
                colorInner = hexToRgb(colorStr).slice(4, -1).split(',')
            }
        } else if (colorStr.search("HSLA") == 0) {
            console.log('HSLA开头的,目前不支持');
        }
        return colorInner
    }

    function hexToRgb(hex) {
        let str = "rgb(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + ")";
        return str
    }

    function rbgToHex(r, g, b) {
        return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
    }

    function getReturnColor(returnType, rgb) {
        console.log(rgb)
        switch (returnType.toUpperCase()) {
            case 'HEX':
                return rbgToHex(...rgb)
            case 'RGB':
                return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
            case 'RGBA':
                return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${rgb[3] || 1})`
        }
    }


    // 找到需要的数在数组的位置
    let currentIndex = 0;
    if (argumentsType == 'array') {
        // 校验数组第一项是不是色值,第二项是不是数组
        for (let i = 0; i < color.length; i++) {
            if (regColorType(color[i]).length && getArgumentType(color[i][1]) == 'number' && color[i].length == 2) {
                color[i].push(regColorType(color[i]))
            } else {
                console.log('参数格式不正确')
                return
            }
        }
    }

    if (argumentsType == 'string') {
        // 校验是不是色值
        let step = 0;
        let temp = []
        for (let i = 0; i < color.length; i++) {
            if (regColorType(color[i]).length) {
                temp.push([color[i], step, regColorType(color[i])])
            } else {
                console.log('参数格式不正确')
                return
            }
            step += (100 / (color.length - 1))
        }
        color = temp
    }

    color.push(['', percent, ''])

    // 按照起点排序,找到percent在哪两个之间，如果在第一个或者最后一个的位置，返回第一个或最后一个的色值
    color.sort(function (a, b) {
        return a[1] - b[1]
    })

    color.map((item, index) => {
        if (item[1] == percent) {
            currentIndex = index
        }
    })
    // 返回第一个的值
    if (currentIndex == 0) {
        // 返回第一个的值
        result = getReturnColor(type, color[1][2])
        return result
    }
    // 最后一个
    if (currentIndex == color.length - 1) {
        result = getReturnColor(type, color[color.length - 2][2])
        // 返回最后一个的值
        console.log(result)
        return result
    }

    // 开始计算
    let tempRes = compute(percent, color[currentIndex - 1], color[currentIndex + 1])

    result = getReturnColor(type, tempRes)
    return result

    function compute(percent, c1, c2) {
        /**
         * percent: 参数
         * c1: currentIndex前一位，list
         * c2: currentIndex后一位，list
         */
        let newPercent = (percent - c1[1]) / (c2[1] - c1[1]) * 100

        let range0 = Number(c1[2][0]) > Number(c2[2][0]) ? Number(c1[2][0]) - Math.round(Math.abs(c1[2][0] - c2[2][0]) * newPercent / 100) : Number(c1[2][0]) + Math.round(Math.abs(c1[2][0] - c2[2][0]) * newPercent / 100)
        let range1 = Number(c1[2][1]) > Number(c2[2][1]) ? Number(c1[2][1]) - Math.round(Math.abs(c1[2][1] - c2[2][1]) * newPercent / 100) : Number(c1[2][1]) + Math.round(Math.abs(c1[2][1] - c2[2][1]) * newPercent / 100)
        let range2 = Number(c1[2][2]) > Number(c2[2][2]) ? Number(c1[2][2]) - Math.round(Math.abs(c1[2][2] - c2[2][2]) * newPercent / 100) : Number(c1[2][2]) + Math.round(Math.abs(c1[2][2] - c2[2][2]) * newPercent / 100)

        // 如果有透明度的变化
        let opacity = 1;
        if (c1[2][3]) {
            opacity = Number(c1[2][3]) > Number(c2[2][3]) ? (Number(c1[2][3]) - (Math.abs(c1[2][3] - c2[2][3]) * newPercent / 100)).toFixed(2) : (Number(c1[2][3]) + (Math.abs(c1[2][3] - c2[2][3]) * newPercent / 100)).toFixed(2)

            return [range0, range1, range2, Number(opacity)]
        }
        return [range0, range1, range2]
    }
}
module.exports = colorRange;