# colorRange

在任意色值直接取任意位置的色值。

目前只支持线性渐变色值。

用法：

```
npm install color-range -S
```

或者
```
yarn add color-range -S
```

然后

```
import colorRange from 'color-range'
```



colorRange 接收多个参数，最少需要四个

![Image text](https://raw.githubusercontent.com/DongxuYI/img_folder/master/pic1.png)
如图所示：

一个线段由三个颜色变化

第一个参数：百分比

一般会在0-100之间，支持小数。


如果要获得中间点的色值，第一个参数就是50。

第二个参数：返回值

返回值提供，RGB、RGBA、HEX三种

第三个及后面参数是色值

例如：
```
var res = colorRange(10, "HEX", "#CCCCCC", "#DDDDDD");
console.log(res) // #cecece
```
就会获得从#CCCCCC到#DDDDDD变化的10%的色值，返回值是#cecece

例如：
```
var res = colorRange(10, "HEX", "#CCCCCC", "#DDDDDD", "#EEEEEE");
console.log(res) // #cfcfcf
```

就会获得从#CCCCCC到#DDDDDD变化的10%的色值，返回值是#cfcfcf

以上是均匀分布状态。

若色值分布不均匀：

例如：
```
var res = colorRange(10, "HEX", ["#CCCCCC", 0], ["#DDDDDD", 40], ["#EEEEEE", 100])
console.log(res) // #d0d0d0
```
起点是#CCCCCC，到40%变换成#DDDDDD，到最后的#EEEEEE，返回值是#d0d0d0

如果有疑问或者bug，可以提issues或者私信我
