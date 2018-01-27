/**
 * 1.解析jsDom
 * 2.生成dom的渲染函数
 */
import { Prop } from "./Prop"
import { config } from '../utils/config';
import { AdvanceStyle } from '../adv/AdvanceStyle'
import { error } from '../utils/Error'
import { js } from "../js/js";

type VirEvent = {
  [x: string]: (ele: HTMLElement) => any
}
type Primitive = string | number | boolean | undefined
type Advance = Function | object
type VirNode$ = Primitive | Primitive[] | VirNodeFollower[]
type VirArgsCtx = {args?:any}

type VirNodeFollower = {
  $?: VirNode$
  on?: VirEvent | ((ele: HTMLElement) => any)
  args?: Object
  style?: CSSStyleDeclaration
  [x: string]: VirNodeFollower | VirNode$ | CSSStyleDeclaration | Object
} | ((ele: HTMLElement) => any)
// 有prop 实例的
class VirNode {
  prop: Prop
  follower: VirDomBreak | Advance | Primitive
  HeadEle?: HTMLElement[]
  TailEle?: HTMLElement[]
  args: { [x: string]: HTMLElement[] } // 记录变量

  isArrayProp?: Prop | boolean
  $arrayFollower?: any[] // when follower.$ is array ,string , function, object(null)
  constructor(x: string, obj: VirNodeFollower, argsCtx?: VirArgsCtx ) {
    this.args = argsCtx.args || {}
    this.prop = new Prop(x)
    // 给follower赋值
    if (typeof obj === 'function') {
      this.follower = obj
    } else if (obj instanceof Array) {
      // follower is array
      this.follower = []
      this.isArrayProp = true

      obj.forEach((onep, i) => {
        if (js.isPrimitive(onep) || typeof onep === 'function') {
          this.follower[i] = onep
        } else {
          this.follower[i] = new VirDomBreak(onep, argsCtx);
          (this.follower[i] as VirDomBreak).fromNode = this;
        }
      })
    } else if (typeof obj === 'object' && obj !== null) {
      // follower.$ is array;
      if (Array.isArray(obj.$)) {
        this.$arrayFollower = []
        for (const onep of obj.$) {
          if (typeof onep === 'object' && onep !== null) {
            const toPush = new VirDomBreak(onep, argsCtx)
            toPush.fromNode = this;
            this.$arrayFollower.push(toPush)
          } else {
            this.$arrayFollower.push(onep)
          }
        }
        this.isArrayProp = true

        delete obj.$
      } // else {}
      this.follower = new VirDomBreak(obj, argsCtx);
    } else {
      this.follower = obj
    }
  }
  createOneEle(prop: Prop) {
    const domEle = config.jsDom.create(prop.targName)
    prop.className && (domEle.className = prop.className)
    prop.id && (domEle.id = prop.id)
    if (prop.attr.length > 0) {
      for (const attr of prop.attr) {
        domEle[attr.key] = attr.value
      }
    }
    // 变量的记录
    prop.name && (this.args[prop.name].push(domEle))

    return domEle;
  }
  getHTMLElement(giveParentEle: HTMLElement, css?: Object) {
    let { prop } = this
    let ParentEle: HTMLElement[] = []

    let first = true;
    while (prop instanceof Prop) {

      let len = ParentEle.length
      let index = 0
      let tempParentEle: typeof ParentEle = []
      // 创建args 的记录 , 不覆盖的添加
      prop.name && (this.args[prop.name] = this.args[prop.name] || [])

      // css model 化;
      css && prop.noCss && (prop.setCss(css))

      if (first) {
        index = -1; len = 0
      } // else {}

      // 按层 的遍历
      while (index < len) {
        if (prop.num > 1) {
          for (let x = 0; x < prop.num; x++) {
            const domEle = this.createOneEle(prop)
            domEle['index'] = x;
            ParentEle[index] && ParentEle[index].appendChild(domEle)
            tempParentEle.push(domEle)
          }
        } else {
          const domEle = this.createOneEle(prop)
          ParentEle[index] && ParentEle[index].appendChild(domEle)
          tempParentEle.push(domEle);
        }
        index += 1
      }

      // 条件迭代
      this.isArrayProp && (this.isArrayProp = prop) // 一旦isArray了就记录prop
      if (first) {
        this.HeadEle = tempParentEle
        if (giveParentEle !== undefined) {
          this.HeadEle.forEach((ele) => {
            giveParentEle.appendChild(ele)
          })
        }
      }

      // 销毁 / 迭代
      prop = prop.Children
      first = false;
      ParentEle = tempParentEle
      this.TailEle = tempParentEle
    }
    return this
  }

  // tailELe 和 follower 链接
  connectFollower(follower?: VirDomBreak) {
    if (follower) {
      this.follower = follower
    }
    // $ : string []
    if (this.$arrayFollower) {
      this.arrayFollower(this.$arrayFollower)
    }

    const f = this.follower;

    if (typeof f === 'function') {
      for (const ele of this.TailEle) {
        f(ele)
      }
    } else if (f instanceof VirDomBreak) {
      for (const ele of this.TailEle) {
        f.setParent(ele)
      }
    } else if (f instanceof Array) {
      this.arrayFollower(f)
    } else {
      for (const ele of this.TailEle) {
        if (f !== null) {
          ele.innerHTML = f + ''
        } // else {} // ele 悬空
      }
    }
  }
  arrayFollower(f: any[]) {
    const prop = this.isArrayProp as Prop
    if (this.TailEle.length === 1 && prop instanceof Prop) {
      // 确定父母
      const TailParent = this.TailEle[0].parentElement;

      this.TailEle[0]['index'] = 0
      // 接生TailEle
      for (let x = 1; x < f.length; x++) {
        const domRus = this.createOneEle(prop)
        domRus['index'] = x
        this.TailEle.push(domRus)
      }

      // 处理新生儿
      f.forEach((onep, i) => {
        if (js.isPrimitive(onep)) {
          this.TailEle[i].innerHTML = onep + ''
        } else if (typeof onep === 'function') {
          onep(this.TailEle[i])
        } else if (onep instanceof VirDomBreak) {
          onep.setParent(this.TailEle[i])
        } else if (onep !== null) {
          console.error('can\'t use this in array::', onep)
        }// else {}

      })

      // 投入父母怀抱
      for (let x = 1; x < f.length; x++) {
        TailParent.appendChild(this.TailEle[x])
      }

    } else {
      // for num defined
      this.TailEle.forEach((ele, i) => {
        if (js.isPrimitive(f[i])) {
          ele.innerHTML = f[i] + ''
        } else if (typeof f[i] === 'function') {
          f[i](this.TailEle[i])
        } else {
          f[i].setParent(ele)
        }
      })
    }
  }
}

class Specail {
  specailFuncList = {}
  specailObj: { [x: string]: object } = {}
  add(str, obj) {
    // if (typeof obj !=='object') {
    //   error.add('Specail Add, not Object')
    //   return false;
    // }
    if (Specail.funcs[str]) {
      this.specailFuncList[str] = Specail.funcs[str]
      this.specailObj[str] = obj
      return true
    } else {
      return false
    }
  }

  attachToEle(ele: HTMLElement) {
    for (const x in this.specailFuncList) {
      this.specailFuncList[x](ele, this.specailObj[x])
    }
  }

  // 纯函数
  static funcs = {
    on(ele: HTMLElement, obj) {
      if (typeof obj === 'function') {
        obj(ele)
      } else {
        for (const x in obj) {
          ele.addEventListener(x, obj[x]) // no bind this, this => HTMLElement
        }
      }
    }
    // advance 由上级 转给follower处理
    , $(ele, obj: Primitive) {
      ele.innerHTML = obj
    }
    , data(ele: HTMLElement, obj: object) {
      for (const x in obj) {
        ele.dataset[x] = obj[x]
      }
    }
    , args(ele, obj) {
      if( obj.index !==undefined) {
        error.add('Special', 'index has been use by Vir')
      }
      Object.assign(ele, obj)
    }
    , style(ele, obj) {
      Object.assign(ele.style, obj)
    }
  }
}

// 分解成nodes 和 specails
class VirDomBreak {
  private nodes: VirNode[] = []
  private specails = new Specail()
  private obj: object
  parentEle?: HTMLElement
  fromNode?: VirNode
  args: {
    [x: string]: HTMLElement[]
  }
  css?: any
  constructor(obj: object, argsCtx?: VirArgsCtx) {
    if (argsCtx && argsCtx.args) {
      this.args = argsCtx.args;
    } else {
      argsCtx = {
        args: {}
      };
      this.args = argsCtx.args;
    }
    this.obj = obj
    for (const x in obj) {
      if (!this.specails.add(x, obj[x])) {
        this.nodes.push(new VirNode(x, obj[x], argsCtx))
      }
    }
  }
  setParent(parentEle: HTMLElement) {
    this.parentEle = parentEle;
    this.specails.attachToEle(parentEle)

    // appendChild from headEle
    this.nodes.forEach((virNode) => {

      // 初始化的 // 接头 // 设置dom 域和css 域;
      virNode.getHTMLElement(parentEle, this.css)

      // 连尾 // 可能由于arrayFollower 影响HeadELe
      virNode.connectFollower()

    })
  }
  setCss(css) {
    if (typeof css === 'object') {
      this.css = css;
    }
  }
}
export {
  VirDomBreak
  , VirNodeFollower
}

/**
 * @example 

 {
 }

 {
   "3* div > 3* div" : {
     $: []
   }
 }
  
 {
   "div": [
     {
       div: "nice"
     }
   ]
 }
 1. node 端
 2. VirEvNode

 */

 /** bug.log
  * 
  1-06 : 
    1. $ array surport object; 
    2. use null as 空 
    3. on :: function 
    4. no Index customer
    5. args type is HTMLElement[]

  */