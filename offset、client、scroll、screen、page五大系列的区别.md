### offset、client、scroll、screen、page五大系列的区别（一）

#### 1.offsetX、offsetY

  获取鼠标指针位置相对于触发事件的对象的 x 坐标和y坐标。offsetX （offsetY）规定了事件对象与目标节点的内填充边（padding edge）在 X （Y）轴方向上的偏移量。

比如我给div元素注册了点击事件，在div内容区域点击，获取的就是相对于div内容区域的坐标，但一定要注意，如果点击区域是border区域那么就是相对于内容区域的负方向了。

注意：offsetX（offsetY）与clientX（cilentY）的区别是，前者是相对于触发事件的对象的坐标，而后者是相对于浏览器可视区域的坐标。IE8不支持事件参数e，要想使用事件参数对象必须是window.event。

```css
  div {
    position: absolute;
    left: 200px;
    top: 50px;
    width: 300px;
    height: 250px;
    background-color: blue;
    border: 50px solid red;
    margin: 100px;
    padding: 10px;
  }
```
```js
  var div = document.querySelector('div')

  div.onclick = function(e) {
    e = e || window.event // 兼容低版本IE 防止时间参数对象失效
    console.log('offsetX:' + e.offsetX, 'offsetY: ' + e.offsetY)
  }
```

#### 2.offsetParent

MDN：

offsetParent是一个只读属性，返回一个指向最近的（closest，指包含层级上的最近）包含该元素的定位元素。如果没有定位的元素，则 offsetParent 为最近的 table, td, th或body元素。当元素的 style.display 设置为 “none” 时，offsetParent 返回 null。

简单概括一下：offsetParent指的是某个元素最近的并带有positon属性（默认值static除外）父级元素，如果这个父级元素没有position属性，那么这个父级元素只能为最近的 table, td, th或body元素。

我们看上面的例子。div这个元素最近的父级就是body了，虽然没有position属性，但是也满足上述条件：


我们给div外面加一层父级元素header，不加任何属性：

```html
<header>
   <div></div>
</header>
```

直接在浏览器调试查看，offsetParent返回的还是body元素：



再测试一下，我们给header元素加个position值为absolute的CSS属性：

```html
<header style="position: absolute;">
   <div></div>
</header>
```


可以看到，offsetParent返回的是header元素，我们再给header加个属性：display：none：


此时offsetParent返回null。

还有一种情况，元素自身设置固定定位，offsetParent的值为null：

```html
<header style="position: absolute;">
   <div style="position: fixed;"></div>
</header>
```


在 Webkit 中，如果元素为隐藏的（该元素或其祖先元素的 style.display 为 “none”），或者该元素的 style.position 被设为 “fixed”，则该属性返回 null。（chrome浏览器内核是Blink）。

在 IE 9 中，如果该元素的 style.position 被设置为 “fixed”，则该属性返回 null。（display:none 无影响。）

#### 3.offsetWidth，offsetHeight

它们都是只读属性，返回一个元素的布局宽度或高度。如果是标准盒子模型那么：
宽度：width + padding + border + scrollbar（如果横向滚动条存在）
高度：height + padding + border + scrollbar（如果纵向滚动条存在）
如果是怪异盒子模型（IE模型，可以通过box-sizing:border-box;设置）：
宽度：width
高度：height

注意：这个属性将会 round(四舍五入)为一个整数。如果你想要一个fractional(小数)值,请使用element.getBoundingClientRect方法，详情可以查阅MDN。下面的案例都是基于标准盒子模型的，怪异模型同理。![在这里插入图片描述](https://img-blog.csdnimg.cn/20190608155859148.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjQyOTY3Mg==,size_16,color_FFFFFF,t_70#pic_center)


MDN有一个更清晰的图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191102224436790.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjQyOTY3Mg==,size_16,color_FFFFFF,t_70#pic_center)

#### 4.offsetLeft 和 offsetTop

它们是一个只读属性，返回当前元素左上角相对于 HTMLElement.offsetParent 节点的左边界偏移的像素值。

说到这里，我们上面提到的offsetParent就派上用场了。

比如我们上面一直讲的例子，把之前加的所有内嵌属性删除掉后，当前div元素的offsetParent 属性值返回body元素。那么div元素的offsetLeft 和 offsetTop的值就是左上角相对于body 的距离。计算公式如下：

offsetLeft = marginLeft + left
offsetTop = marginTop + top
在浏览器控制台打印一下：

即使当前元素的父级有position，值也是一样的，因为它都是相对于父级。

####  5.offsetLeft 和 style.left 区别

① 最大区别在于offsetLeft 可以返回没有定位盒子的距离左侧的位置。 而 style.left不可以。

② offsetLeft 返回的是数字，而 style.left 返回的是字符串，除了数字外还带有单位：px。

③ offsetTop 只读，而 style.top 可读写。（只读是获取值，可写是赋值）

④ 如果没有给 HTML 元素指定过 top 样式，则style.top 返回的是空字符串。

（style.left在等号的左边和右边还不一样。左边的时候是属性，右边的时候是值。）

### offset、client、scroll、screen、page五大系列的区别（二）

client系列

#### ①clientX和clientY

获取鼠标指针位置相对于可视区域的 x 坐标和y坐标，也就是说是相对于浏览器的距离，跟触发事件的对象没关系

clientX：鼠标距离可视区域左侧距离（event调用）

clientY：鼠标距离可视区域上侧距离（event调用）

代码如下：

```js
div1.onclick = function (e) {
			e = window.event || e;
			// console.log('offsetX of div is: ' + e.offsetX);
			// console.log('offsetY of div is: ' + e.offsetY);
			console.log('clientX of div is: ' + e.clientX);
			console.log('clientY of div is: ' + e.clientY);
		};
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190608214204618.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjQyOTY3Mg==,size_16,color_FFFFFF,t_70)

#### ②clientWidth和clientHeight

可视区域的宽高：width+padding / height + padding

调用者不同，意义不同：

盒子调用，指盒子本身；body/html调用，指可视区域大小。 

```js
console.log('clientWidth of div is: ' + div1.clientWidth);
console.log('clientHeight of div is: ' + div1.clientHeight);
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190608215145566.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjQyOTY3Mg==,size_16,color_FFFFFF,t_70)

#### ③clientLeft和clientTop

可视区域的左边框和上边框的宽度(获取盒子的 **border** 宽高)

```js
console.log('clientWidth of div is: ' + div1.clientLeft);
console.log('clientHeight of div is: ' + div1.clientTop);
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190608215618943.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjQyOTY3Mg==,size_16,color_FFFFFF,t_70)

### offset、client、scroll、screen、page五大系列的区别（三）

scroll系列

#### ①scrollWidth / scrollHeight

元素内容实际宽度 / 高度（不包括border）

分两种情况：

这个元素内容的宽度 or 高度 没有超过这个元素的宽 or 高，那么scrollWidth / scrollHeight指的就是这个元素的width + padding
这个元素内容的宽度 or 高度 超过了这个元素的宽 or 高，那么scrollWidth / scrollHeight指的就是这个元素内容的实际宽or高

```css
div {
    width: 300px;
    height: 200px;
    border: 2px solid red;
    overflow: auto;
}

input {
    position: absolute;
    left: 400px;
    top: 100px;
}
```



```html
<div id="dv"></div>
<input type="button" value="显示效果" id="btn" />
```


目前div内容是空的，那么有scrollWidth = clientWidth / scrollHeight = clientHeight


    

```js
 document.getElementById("btn").onclick = function () {
     var dv = document.getElementById("dv");
 console.log(dv.offsetHeight);//204 元素的高度(border+padding)
 console.log(dv.scrollHeight);//200 内容的实际高度
 console.log(dv.clientHeight);//200 元素可视区域的高，不包括边框和滑动条
 }
```

现在我在div里面加几个p标签

```html
<div id="dv">
        <p>哈哈</p>
        <p>哈哈</p>
        <p>哈哈</p>
        <p>哈哈</p>
        <p>哈哈</p>
        <p>哈哈</p>
        <p>哈哈</p>
        <p>哈哈</p>
    </div>
```


再次输出

```js
console.log(dv.offsetHeight);//204 元素的高度(border+padding)
console.log(dv.scrollHeight);//391 内容的实际高度
console.log(dv.clientHeight);//200 元素可视区域的高，不包括边框和滑动条
```

#### ②scrollLeft / scrollTop

向左或向上卷曲出去的距离

给div添加卷动事件

```js
//元素的监听滚动事件
document.getElementById("dv").onscroll = function () {
    console.log(this.scrollTop);
};
```

上面主要是给一个元素添加滚动事件，那如果是浏览器的滚动事件的话，就得使用pageYOffset来获取向上卷曲出去的距离，如果是IE8等低版本浏览器可以使用document.documentElement.scrollTop或document.dody.scrollTop来获取了，当然有时候不只是获取向上卷曲出去的距离，有时候也获取向左卷曲出去的距离，这样可以封装一个getScrol函数

```js
function getScroll() {
            return {
                top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
                left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
            };
        }
//比如我想获取浏览器向上卷曲出去的距离

window.onscroll = function () {
            console.log(getScroll().top);
        };

//利用这个属性可以实现滚动条下滑一定距离的时候，导航栏能固定在上方
```

#### ③有兼容性问题

① 未声明 DTD 时（谷歌只认识他）

document.body.scrollTop

② 已经声明DTD 时（IE678只认识他）

document.documentElement.scrollTop

③ 火狐/谷歌/ie9+以上支持的

window.pageYOffset

兼容写法

var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

#### window滚动的方法

`window.scroll(x,y)` 是让window滚动条滚动到那个x,y坐标。//x是水平坐标，y是垂直坐标。

`window.scrollBy(-x,-y)` 是让window滚动条相对滚动到某个坐标，- 10即相对向左/向上滚动10像素。

`window.scrollTo(x,y)` 效果和`window.scroll(x,y)`一样， 不兼容IE。

`element.scrollIntoView(boolean)` 让元素贴顶或者贴底，相对于可视区域 (实验属性，慎用)

```html
<style>
    body {
        width: 3000px;
        height: 3000px;
    }

    .operate {
        position: fixed;
        top: 100px;
        left: 100px;
    }
</style>
<body>
    <div class="operate">
        <button>点击设置卷入上左边距为 800</button>
        <button>点击向上，向左各滑动 200</button>
    </div>
    <script>
        var btns = document.querySelectorAll("button");

        btns[0].onclick = function() {
            window.scroll(800, 800);
        }
        btns[1].onclick = function() {
            window.scrollBy(-200,-200);
        }

        window.onscroll = function (){
            console.log({
                sct: window.pageYOffset,
                scl: window.pageXOffset
            });
        }
    </script>
</body>
```

#### 网页顺滑滚动

想要实现网页顺滑滚动（smooth scroll），可以使用：

1. `html { scroll-behavior: smooth; }`

2. `window.scroll` 方法传对象参数

   ```
   window.scroll(options);
   window.scrollTo(options);
   window.scrollBy(options);
   ```

   `options` 是一个包含三个属性的对象：

   1. `top` 是文档中的纵轴坐标
   2. `left` 是文档中的横轴坐标
   3. `behavior` 类型 `String`，表示滚动行为，支持参数 `smooth`(平滑滚动)，`instant`(瞬间滚动),默认值 `auto`，实测效果等同于 `instant`

3. `elem.scrollIntoView(options)` IE 不支持填写 `options` 选项

   `options` 是一个包含三个属性的对象：

   - `behavior` 可选

     定义动画过渡效果， `"auto"`或 `"smooth"` 之一。默认为 `"auto"`。

   - `block` 可选

     定义垂直方向的对齐， `"start"`, `"center"`, `"end"`, 或 `"nearest"`之一。默认为 `"start"`。

   - `inline` 可选

     定义水平方向的对齐， `"start"`, `"center"`, `"end"`, 或 `"nearest"`之一。默认为 `"nearest"`。

示例：

```html
<style>
    html {
        scroll-behavor: smooth;
    }
    body {
        width: 3000px;
        height: 3000px;
    }
</style>
<script>
    window.onclick = function (){
        if(!window.far){
            window.scroll(1500,1500);
        }else {
            window.scroll(0,0);
        }
        window.far = !window.far;
    }
</script>
```

### offset、client、scroll、screen、page五大系列的区别总结

#### event 事件对象

（1）概述

在触发DOM上的某个事件时，会产生一个事件对象event，这个对象中包含着所有与事件有关的信息。

所有浏览器都支持event对象，但支持的方式不同。

比如鼠标操作时候，会添加鼠标位置的相关信息到事件对象中。（类似Date）

普通浏览器支持 event（带参，任意参数）

ie 678 支持 window.event（无参，内置）

总结：他是一个事件中的内置对象。内部装了很多关于鼠标和事件本身的信息。

 

（2） 事件对象 event 的获取

IE678中，window.event 

在火狐谷歌中，event或者，在事件绑定的函数中，加参，这个参数就是event.

 Box.onclick = function (aaa){  aaa就是event   }

 

（3） 兼容获取方式有两种：

不写参数直接使用event;

写参数，但是参数为event

var event = event || window.event;(主要用这种)

 

**（4） event 重要内容**

 event.type

事件类型，返回触发的事件名称。例如：

```js
document.body.onclick = function(){
    console.log(event.type); // click
}
```

#### 事件相关元素

### event.target

触发事件的元素，在老版本的IE浏览器中请使用 `event.srcElement` 来替代它。

### event.currentTarget

绑定事件的元素，IE >=9 支持。

**tips：**触发事件的元素不一定就是绑定事件的元素，因为存在事件冒泡，点击某个元素的子元素，那么父元素绑定的事件中，触发事件的元素为子元素，绑定事件的元素为父元素。

例如：

```html
<p>
    <span>hello</span>
</p>
<script>
    var pEle = document.querySelector("p");
    pEle.onclick = function(){
        // 点击文字，输出如下内容
        console.log(event.target); // span
        console.log(event.currentTarget); // p
    }
</script>
```

*小知识：*在非行内绑定的事件中，`event.currentTarget` 与事件处理函数中的 `this` 相同，均为绑定事件的元素。

#### 鼠标的位置信息

鼠标事件几乎都有

| 属性名          | 说明                                                       |
| :-------------- | :--------------------------------------------------------- |
| pageX/pageY     | 获取事件触发时鼠标相对于页面的位置                         |
| clientX/clientY | 获取事件触发时鼠标相对于可视区域的位置                     |
| offsetX/offsetY | 获取事件触发时鼠标相对于**触发**事件的元素**内容区**的位置 |
| screenX/screenY | 获取事件触发时鼠标相对于屏幕的位置，不常用                 |
| x/y             | clientX/clientY的别名                                      |

```js
document.body.onclick = function(){
    console.log("对于页面", {
        x: event.pageX,
        y: event.pageY
    });

    console.log("对于可视区域", {
        x: event.clientX,
        y: event.clientY
    });
}
<style>
    .box {
        width: 200px;
        height: 200px;
        margin: 100px;
        border: 20px solid #000;
        background-color: #f00;
    }
    .inner {
        width: 100px;
        height: 100px;
        margin: 50px;
        border: 10px solid #fff;
    }
</style>
<body>
    <div class="box">
        <div class="inner">

        </div>
    </div>

    <script>
        var box = document.querySelector(".box");
        box.onclick = function(){
            console.log({ x: event.offsetX, y: event.offsetY });
        }
    </script>
</body>
```



## 键盘信息

相关事件：`event.keydown`、`event.keyup`

| 属性名   | 说明                          |
| :------- | :---------------------------- |
| key      | 按键表示的值内容              |
| altKey   | 触发事件时 alt 键是否被按下   |
| ctrlKey  | 触发事件时 ctrl 键是否被按下  |
| shiftKey | 触发事件时 shift 键是否被按下 |

例如：

```js
// 监听按回车键
document.onkeydown = function() {
    if(event.key == "Enter"){
        alert("您按了回车");
    }
}
// 阻止浏览器通过 F12 打开开发者工具
document.onkeydown = function() {
    if (window.event && window.event.key == "F12") {
        event.preventDefault(); // 阻止默认事件
        event.returnValue = false;
        return false; 
    } 
}
```

我们可以使用按键监听来实现很多功能，打字练习就是其中一种，让我们一起实现一个打字竞速（超级简陋版）吧：

```html
<!-- HTML -->
<h2>文字竞速</h2>
<!-- 随机生成的字符内容 -->
<ul class="list"></ul>
<!-- 用户输入字母 -->
<ul class="copy"></ul>
<!-- 计时，重新生成按钮 -->
<p class="time">
    共计时长：0s 
    <button onclick='recreate()'>重新生成</button>
</p>
/* CSS */
* {
    margin: 0;
    padding: 0;
}

ul {
    list-style: none;
}

.list, .copy {
    margin: 10px 50px;
    overflow: hidden;
}

.list li, .copy li{
    float: left;
    width: 50px;
    height: 40px;
    font-size: 26px;
    text-align: center;
    line-height: 40px;
}

.copy {
    height: 40px;
    border: 1px solid #333;
}

p,h2 {
    margin: 20px 50px;
    line-height: 40px;
}

button{
    margin-left: 100px;
    padding: 12px 40px;
    font-size: 13px;
    letter-spacing: .1rem;
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid #999;
}
// JS

// 获取页面元素
var list = document.querySelector(".list"), // 生成字母的父元素
    inputUl = document.querySelector(".copy"), // 用户输入字母的父元素
    time = document.querySelector(".time"); // 显示用时的p标签

// 设置随机字母池、计时器、错误计数
var letters = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p","z", "x", "c", "v", "b", "n", "m"],
    startTime = 0,
    count = 0;

// 生成随机字母串
create();

// 监听页面的按键事件
document.onkeydown = function (){
    // 获取用户输入的长度
    var length = inputUl.children.length;

    // 输入长度为0时，开始计时
    if(length == 0){
        startTime = Date.now();
    }

    // 输入长度不够，往页面中添加
    if(length < 26){
        // 如果时删除键，清除上一个输入的内容
        if(event.key == "Backspace"){
            inputUl.children[length-1].remove();
            // 取消报红的颜色
            list.children[length-1].style.color = "";
            // 错误计数 - 1
            count --;
        }else {
            // 如果不是，往用户输入UL中添加内容
            inputUl.insertAdjacentHTML("beforeEnd", "<li>"+ event.key +"</li>");
            // 如果用户输入错误，与上面示例内容不一致，则报红，改过来则还原
            if(inputUl.children[length].innerText !== list.children[length].innerText){
                list.children[length].style.color = "#f00";
                count ++; // 错误计数 + 1
            }

            // 用户输入内容，长度+1
            length ++;
        }
    }

    // 如果长度足够，停止
    if(length == 26) {
        time.innerHTML = "共计时长：" + (Date.now() - startTime)/1000 + "s" + " &emsp; 错误率："+ (count/26*100) +"% <button onclick='recreate()'>重新生成</button>";
    }

}

// 重新生成点击事件监听函数
function recreate(){
    // 随机生成字母
    create();
    // 清空用户已输入内容
    inputUl.innerHTML = "";
    // 错误计数清0
    count = 0;
}

// 生成随机字母串的函数
function create(){
    var str = "";
    for(var i = 0; i < letters.length; i ++){
        str += "<li>"+ letters[rd()] +"</li>"
    }
    list.innerHTML = str;
}

// 随机 0-25 下标的函数
function rd(){
    return Math.floor(Math.random() * 26);
}
```

 

（5） screenX、pageX 和 clientX 的区别

pageY/pageX: 鼠标位于整个网页页面的顶部和左侧部分的距离。（页面）

screenY/screenX: 鼠标位于屏幕的上方和左侧的距离。（屏幕）

clientX/clientY: 获取事件触发时鼠标相对于可视区域的位置

 

（6） pageY 和 pageX 的兼容写法

在页面的位置 = 看得见的 + 看不见的

pageY/pageX=event.clientY/clientX+scroll().top/scroll().left

 

 

 

 三大家族区别（总结）

（1） Width 和 height

clientWidth = width + padding

clientHeight = height + padding

offsetWidth = width + padding + border

offsetHeight = height + padding + border

scrollWidth  = 内容宽度（不包含border）

scrollHeight = 内容高度（不包含border）

 

（2） top 和 left

offsetTop/offsetLeft ：

   调用者：任意元素。(盒子为主)

   作用：距离父系盒子中带有定位的距离。

scrollTop/scrollLeft:(盒子也可以调用，必须有滚动条)

   调用者：document.body.scrollTop/.....(window)

   作用：浏览器无法显示的部分（被卷去的部分）

clientY/clientX:（clientTop/clientLeft 值的是border）

   调用者：event.clientX(event)

   作用：鼠标距离浏览器可视区域的距离（左、上）

 

 

（3） 获得屏幕宽高

window.screen.width

window.screen.height

分辨率是屏幕图像的精密度，指显示器所能显示的像素有多少。

#### Window.innerHeight

## [概述](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerHeight#summary)

浏览器窗口的视口（viewport）高度（以像素为单位）；如果有水平滚动条，也包括滚动条高度。

## [语法](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerHeight#syntax)

```js
var intViewportHeight = window.innerHeight;
```

### [值](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerHeight#value)

`intViewportHeight` 为浏览器窗口的视口的高度。

`window.innerHeight` 属性为只读，且没有默认值。

## [备注](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerHeight#notes)

任何窗口对象，如 [`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)、frame、frameset 或 secondary window 都支持 `innerHeight` 属性。

改变一个窗口的大小，可以查看 [`window.resizeBy()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/resizeBy) 和 [`window.resizeTo()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/resizeTo)。

想获取窗口的外层高度（outer height），即整个浏览器窗口的高度，请查看 [`window.outerHeight`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/outerHeight)。

### [图像示例](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerHeight#graphical_example)

下面的示意图展示了 `outerHeight` 和 `innerHeight` 两者的区别。

![innerHeight vs outerHeight illustration](https://developer.mozilla.org/@api/deki/files/213/=FirefoxInnerVsOuterHeight2.png)

#### Window.innerWidth

只读的 [`Window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) 属性 `**innerWidth**` 返回以像素为单位的窗口的内部宽度。如果垂直滚动条存在，则这个属性将包括它的宽度。

更确切地说，`innerWidth` 返回窗口的 [layout viewport (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Layout_viewport) 的宽度。 窗口的内部高度——布局视口的高度——可以从 [`innerHeight`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerHeight) 属性中获取到。

## [语法](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerWidth#语法)

```
let intViewportWidth = window.innerWidth;
```

### [值](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerWidth#值)

一个整数型的值表示窗口的布局视口宽度是以像素为单位的。这个属性是只读的，并且没有默认值。

若要更改窗口的宽度，请使用 [`Window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) 的方法来调整窗口的大小，例如[`resizeBy()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/resizeBy) 或者 [`resizeTo()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/resizeTo)。

## [使用说明](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerWidth#使用说明)

如果你需要获取除去滚动条和边框的窗口宽度，请使用根元素 [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/html) 的[`clientWidth`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/clientWidth) 属性。

`innerWidth` 属性在任何表现类似于窗口的任何窗口或对象（例如框架或选项卡）上都是可用的。

## [示例](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerWidth#示例)

```js
// 返回视口的宽度
var intFrameWidth = window.innerWidth;

// 返回一个框架集内的框架的视口宽度
var intFrameWidth = self.innerWidth;

// 返回最近的父级框架集的视口宽度
var intFramesetWidth = parent.innerWidth;

// 返回最外层框架集的视口宽度
var intOuterFramesetWidth = top.innerWidth;
```

#### 获取元素与页面的距离

以 *clientTop/Left* 搭配 *offset* 家族成员可以封装函数获取任意元素与 *body* 之间的上左边距。

<img src="http://doc.bufanui.com/uploads/beAdvance/images/m_421493e95157d8172f791bd0eb6e5c27_r.png" alt="image-20210107151852556" style="zoom:50%;" /> <img src="http://doc.bufanui.com/uploads/beAdvance/images/m_2dd54005ff122b3cd80f1e1cf530271d_r.png" alt="image-20210107152914812" style="zoom:50%;" />

代码实现：

```js
// 获取任意元素与页面的上左边距
function getDistance(ele){
    // 获取该元素的offsetParent
    var op = ele.offsetParent;
    // 如果它的offsetParent是body元素，那么它的offsetTop/Left就是该元素到页面的上左边距
    if(op === document.body){
        return { top: ele.offsetTop, left: ele.offsetLeft }
    }else {
        // 如果它的offsetParent不是body，元素到页面的距离 = 该元素.offsetTop/Left + 它的offsetParent.clientTop/Left + 它的offsetParent到页面的距离
        var opDistance = getDistance(op);
        return {
            top: ele.offsetTop + op.clientTop + opDistance.top,
            left: ele.offsetLeft + op.clientLeft + opDistance.left
        }
    }
}
```