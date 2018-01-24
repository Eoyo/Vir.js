# 此处为vir.js的新版本(1.0.*)
## I' am sorry for that there is no English Version, because this is a stupid project.
## 这次我将核心的功能抽离出来了, 核心的内容比旧版的少了许多, 也更灵活了.
> 旧版的可以看看这里: https://github.com/Eoyo/express/tree/master/public/Vir

> 欢迎来welcome  : QQ: 2119258591 

## vir.js 的核心: js Dom 树的解析
## 一. 用法
### 1. 安装:
```npm install vir.js```

使用[typescript](https://www.tslang.cn/docs/home.html)编写的, 自带类型声明的

### 2. 导入 (typescript/ ES6)
```import { Vir } from 'vir.js'```
注意啦: 要使用{} , 我是export { Vir } 导出的

### 3. 其他使用: 例如
  0. vir.js 使用的webpack打包的(umd)
  1. 浏览器导入 ```<script src="node_models/vir.js/dist/vir.js"></script>```
  2. node.js 的 require,  ```const Vir = require('vir.js').Vir```

## 二. 简单的使用例子:

### 1. 显示四个盒子(`className = "box"`), 每个盒子一个big apple: 

写法1: 

```js
Vir({
  '4* .box': {
    '.apple': 'Big Apple'
  }
})
``` 

写法2: 使用vir.js'原生的'数组自适应, 让你可以控制单个的内容

```js
Vir({
  '.box' : [
    { '.apple': 'Big Apple' },
    { '.apple': 'Big Apple' },
    { '.apple': 'Big Apple' },
    { '.apple': 'Big Apple' }
  ]
})
// 可能有点特别, 反直觉. 有可能你认为这表示一个盒子里四个apple. 注意vir.js的数组节点是分述语法. 详见语法四.8

// 为了不被糊弄写个注释也可以
Vir({
  '4; .box' : [
    { '.apple': 'Big Apple' },
    { '.apple': 'Big Apple' },
    { '.apple': 'Big Apple' },
    { '.apple': 'Big Apple' }
  ]
})
```
写法3: [搭配ramda](http://ramda.cn/docs/) 等类似的库, 让你有望使用函数式开发.

```js
import R = require('ramda')
Vir({
  '.box' : R.map(
    (e)=>({ '.apple': e }), 
    R.repeat('Big Apple', 4)
  )
})
```
> 强行安利一波函数式编程: ( 2018-01-15)

案例1: 根据URL数组,生成一组图片:

```js
const data = ['','','']
function toArgsSrc(v) {
  return {
    args: { src: v }
  }
}

Vir({
  "img .bigImage": data.map(toArgsSrc)
})

// 如果又不是img了
Vir({
  "video .playingBackground": data.map(toArgsSrc)
}) // 逻辑逻辑完美的复用
```

案例2: 还是根据URL数组,生成一组图片, 但是每个图片的样式一样(假设你就是想用js设置样式)

```js
Vir(this.ele, {
  "img ::pics": {
    $: data.map(toArgsSrc) // 把之前直接写在尾部的,用$接起来

    , style: { // 这个style 会被复用到每一个img上;
      border: '1px solid #aaa'
    }
  }
})
```



##

### 2. 模块开发, 一个模块说我是'model one', 另一个说我是: 'model two'

核心是利用 函数节点

```js
// use typescript
// modelOne
import { Vir } from 'vir.js';
import * as $ from 'jquery';

function One (ele : HTMLElement) {
  const sayWords = 'I\'am model one'

  Vir(ele, {
    '.say': sayWords
    , on: { // 绑定个事件也可以
      click() {
        alert(sayWords)
      }
    }
  })
  
}
//model two
function Two (ele : HTMLElement) {
  const sayWords = 'I\'am model two'

  Vir(ele, {
    '.say': sayWords
  })

  // 想用jquery就用, 自由如此
  $(ele).on('click',()=> { 
    alert(sayWords)
  })
}

// usage 1: 
Vir({
  '.model': One
  , '2; .model': Two
})

// usage 1 等价于如下: usage 2
Vir({
  '.model': [
    One, Two
  ]
})

// 说白了就是有个函数节点, 看看如下, 详细见语法篇
Vir({
  '.model'(ele) {
    ele.innerHTML = 'abc'
  }
})
```


## 三.  vir.js 的优势
1. 定位清晰: 就是用js创建dom的.
2. 无其他依赖: 目前发布的vir.js 才800来行, 源码都可以一口气看完..
3. 有潜力: 这是一个极简先驱版本, 我还开发了许多vir.js的工具, vir.js不久将会上升到framework的高度
4. 完全用js 开发的: 实现在前后端同时跑也是可以的;
5. 使用方便: 有强大的数组使用方法;


## 四. vir.js 的语法
### 1.基本的 id 与class 解析 : `"#id .class .classtwo"`
`#`后紧跟id名, `.`后跟class名,class是按顺序的,可以多个;id 与和class 不分顺序,class之间有顺序的;
标签名默认为div;

### 2.属性解析:`[key = 'value']` 
和html 中写属性值一样;

### 3.子元素解析:`".parent > .son"` 
> 在js中:

```js
".parent > .son":{
    $:"son"
    ///绑定在最后生成的元素上;即为.son上;
}
```

> 创建的是:
```html
<div class = "parent">
    <div class = "son">son</div>
</div>
```

### 4.多个元素 : `"3* div"`

数字和*黏在一起;不可以!!!!:`"3 *div"`。
但是可以:`"3*div"`。最好是放在开头，其他地方也可以，但容易出错；

### 5.定义变量 : `"div  ::oneDiv"`

创建的div存在oneDiv里。可以多次出现::oneDiv在不同的标签属性里，结果是oneDiv变成了数组，按创建次序记录各个element；还可以与point 4中的乘法搭用，生成数组（不是“反常坑”的HTMLcollection）。


### 6.混搭 :`"div ::parentDiv > 3*div ::threeChild"`
> js代码:

```js
var test = Vir({
    "div ::parentDiv > 3*div ::threeChild":{
        $:"son"
        ///绑定在最后生成的元素上;即为.son上;
    }
})
```
> 生成html如下:

```html
<div> 
    <div>son</div>
    <div>son</div>
    <div>son</div>
</div>
```

> 使用变量threeChild;

```js
// 使用变量threeChild;
test.args.threeChild.forEach((v)=>{
    v.innerHTML = "use";
})
```

> 改动效果如下html:

```html
<div> 
    <div>use</div>
    <div>use</div>
    <div>use</div>
</div>
```

### 7. 特殊的属性: $, on, style, args, data

其实上面有许多的例子使用了特殊的属性了, 特殊属性主要是为了方便操作dom的. 其他的都很简单的, 就$牛逼点: $ 是innerHTML, 但也可以是数组.

1. on 绑定事件的地方. on为函数时自定义把绑定, `'div .test':{ on(ele){ /* do what you want */ } }` , ele 为HTMLELement; 
2. style 绑定样式的地方
3. args 绑定生成的HTMLELement的属性如className, 或自定义: 如key; (index 被Vir.js用了!)
4. data 绑定到dataSet上, 原生dom的安全数据接口, 优点是css里可以访问到(绝对黑科技!),
5. $ 显式的绑定innerHTML 或者使用数组, 就这两种情况

### 8. **分述**、**复述**和**自适应数组**

数组的自动解析是本框架的一大特色, 很多框架都是要用类似于for于语句去声明. 但是我这里不需要的. 为了使用时使得结果符合预期, 请大家注意一下几点: 

#### 8.1 数组中合法的类型: 

```js
Vir({
  '.array > .item' : [
    'string'
    , true
    , 123  //primitive转字符串显示

    , {  // object 当做新的vir节点解析
      '#obj' : 'object'
    }
    , (ele) => {  // 调用函数处理, 唯一入口是框架生成的HTMLElememt
      ele.innerHTML = 'function'
    }
    , null  // 结果不显示
    , undefined  // 显示出undefined
  ]
})
```

> 注意: 
> 1. 不支持Symbol类型用在数组里
> 2. null 和 undefined: null不显示, undefined会被渲染成字符串'undefined';
> 3. 尾部的`.item`没有声明数量和声明的数量为1, 则`.item` 的数量为其后数组的长度. 若是声明的数量大于1,  则溢出的会忽略, 不足的为'undefined'

#### 8.2 **分述**、**复述**
>js代码为:

```js
// 分述
Vir({
  ".parent > 3* .son":["son1","son2","son3"]
})

// 复述
Vir({
  ".parent > 3* .son": "son"
})
```

**分述**在节点值为数组时触发;否则为**复述**
>生成html为:

```html
<!-- 分述 -->
<div> 
    <div title = "son">son1</div>
    <div title = "son">son2</div>
    <div title = "son">son3</div>
</div>

<!-- 复述 -->
<div> 
    <div title = "son">son</div>
    <div title = "son">son</div>
    <div title = "son">son</div>
</div>
```
> ps: 复述, 我觉的就生成个棋盘啥的有用了...

### 8.3 在特殊的属性$中使用数组

其实和直接写在节点尾部是一样的, 只是使用$写, 可以写额外的style, on 等等

> 实现点击blue弹出blue, 点击red弹出red

```js
Vir ({
  'span .color': {
    $: ['red', 'blue']
    , on: {
      click() {
        alert(this.innerHTML)
      }
    }
  }
})
```

### 9. 属性的注释

js 对象里同级的属性名是唯一的, 虽然8.* 中可以通过数组批量的生成节点, 但是数组不适用所有的情况. (写文章的话, 不要用vir.js , vir.js 是用来开发应用的, 推荐: MarkDown;)

使用`';' + ' '` , 即`分号 + 空格`,  放在属性的开头, 表示注释;
```js
Vir({
  'h2': "头"
  , "english; h2" : "head"
})
// 属性名只能唯一, 使用带注释的属性名. 我觉的这个不仅能解决问题还解决的不错.
```

## 五. 来自Vir.js 开发的其他东西, (可以在vir.js 的 1.0.7 及以上使用)

主要有: 1. EventPool, 事件的处理池;
接下来:(before 2018 1-15): 2. State 3. ApiManager

#### 1. EventPool 事件处理池

生成的是一个eventpool 对象, 使用这个对象管理事件的触发和监听;

1. 超简单而直接的example: 触发'say', 1秒后alert 一个 'hello'
```js
import { EventPool } from 'vir.js';
const ev = new EventPool();

ev.listen('say', (data)=> {
  alert(data)
})

function say () {
  ev.emit('say', 'hello')
}

// 延时
setTimeout(say, 1000)
```

2. EventPool实现的是基于事件名的异步解耦合,  来个高级的例子:

场景: 有一个任务流程: A -> B -> C, 运行到B时需要满足一定的条件才可以继续 运行到C. 如何在外部去控制B 的状态呢??
通俗的说: 问题是指如何传个开关给函数, 外边的人拿着这个开关控制这个函数的运行? 如何搞出这个开关?
```js

import { EventPool } from 'vir.js';
// A -> B -> C;
function job(B: Promise) {
  // do A 
  B.then((data)=>{
    // do C
  })
}
const ev = new EventPool();

// set B, B is a Promise object
job(ev.listen('done')) // ev.listen('EveCode') , 单参数,返回的Promise 对象.

ev.emit('done', 'B is ok!')

```

3. Promise的优点

普通的事件处理有时会有意外

> 例如: 先触发了事件, listen晚了, 导致最后一次的触发没监听到.
```js
// 这里只是一种简洁的写法, 实际可能更复杂!
ev.emit('done', 'ok')

ev.listenAll('done',(ok)=>{
  alert(ok)
})
```

Promise不会有这种问题, Promise 有状态记录, 无论在哪then 都可以. 

4. done, after 的事件模型(内存的消耗多了点, 不要用太多就ok)

    Promise 是一个稳定的开关, 状态只会改变一次.
    
    一个Promise后的then 里的函数只会执行一次; 不利于事件常常触发的场景(也可以使用, 只是有点蹩脚)

> done, after继承了Promise 的优点, 无论何时done , after总是可以触发;
```js
ev.done('done','ok');
ev.after('done', (ok)=>{
  console.log(ok)
})
// after 成功的接受到了done事件; after 在done 后立即触发, after 保证了顺序.
// done 的事件也可以被listen监听;
```
5. 意外的监听过多

> 初学者极其容易犯这个错, 旧的回调忘记及时删除;

```js
// 这里只是一种简洁的写法, 实际可能更复杂!
ev.emit('done', 'ok')

function listen(str){
  ev.listenAll('done',(ok)=>{
    alert(str)
  })
}
listen('A');

// 改变主意了, 想让'done' 后alert'B'了, 
listen('B'); // 这是错误的, 之前监听'A'的没删掉; 

```

>其实名字就已经强调了, `listenAll` 会监听所有的回调, 要想自动的删除之前的可以用`listen`, 如下:

```js
ev.emit('done', 'ok')

function listen(str){
  ev.listen('done',(ok)=>{ // 使用listen
    alert(str)
  })
}
listen('A');

// 改变主意了, 想让'done' 后alert'B'了, 
listen('B'); // ok, 之前监听'A'的删掉了; 

```

注意啦: `ev.listen` 是根据`function.name`来判断的. 如果`function.name`是listen过的, 就用新的替代旧的. 所以ev.listen 是不喜欢只用匿名的函数的.(匿名函数的name 为空字符串)

  6. EventPool只是个小工具, 力推一波: Sage; 集中管理异步

...

#### 2. ApiManager: 集中的控制ajax的, vir.js 的第二个核心, 大约 1月30日推出