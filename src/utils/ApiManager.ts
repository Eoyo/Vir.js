import { State } from "./State";
import { error } from "./Error";
import { EventPool } from "./EventPool";
function ApiFactory<opT>(state: State, transformer: (op: opT, update) => { then: (resovle, errorfunc) => any }) {
  return class Api<res, needData>{
    op: opT
    namespace: string

    constructor(op: opT) {

    }
    afterDone(cb: (res: res) => void) {
      this.namespace && state.ev.after(this.namespace, (res) => {

        // 使用state 记录 res;
        state.setState(this.namespace, res);
        // 
        cb(res);
      })
    }
    update(data: needData) {
      const opData = data as any
      transformer(this.op, data).then(
        res => { state.ev.done(this.namespace, res) }
        , e => { error.add('Api', e) }
      )
    }
    setNameSpace(str: string) {
      if (str) {
        this.namespace = str
        state.createNameSpace(str)
      } // else {}
    }
    getAllState() {
      return state;
    }
  }
}

function compileApi<T>(api: T) {
  for (const x in api) {
    (api[x] as any).setNameSpace(x);
  }
  return api
}

export {
  compileApi
  , ApiFactory
}

// example
const apiState = new State()

const Api = ApiFactory<{ src: string[], data?}>(
  apiState, // State record

  // how to deal with option and update data;
  (op, update) => {
    return $.ajax({
      url: op.src[0]
      , method: op.src[1]
      , data: {
        ...op.data
        , ...update
      }
    })
  }
)

class Spi<T, R extends {[x:string]:(data:T)=>T}>{
  ev = new EventPool()
  sy = Symbol()
  obj: T
  reducers: R
  constructor(obj: T, reducers: R) {
    this.obj = obj;
    this.reducers = reducers;
  }
  updata(obj: Partial<T>| ((obj:T)=>T) ){
    if (typeof obj === 'function') {
      this.ev.done(this.sy, obj(this.obj))
    } else {
      Object.assign(this.obj, obj)
      this.ev.done(this.sy, this.obj);
    }
  }
  reduce(str: keyof R){
    if (this.reducers[str]) {
      this.reducers[str](this.obj)
    } else {
      return;
    }
  }
  afterDone(callBack: (obj: Readonly<T>)=>void) {
    this.ev.after(this.sy, callBack);
  }
}

export {
  Api, Spi
}

/**
 * typescript
 * 1. 类型的精化, 范式验证, 精确使用, Partial<T>
 * 2. 引用函数的返回类型
 */

/**
 * 1. 如何标注responseJSON 的类型
 * 2. 需要和可以传的参数
 * 3. 如何集中的管理api
 * 4. 减少依赖, 枢纽的代码独立!
 * 5. 查看state, 可以快速知道异步的完成情况
 * 
 * apiManeger 的 范式 ok 
 * 1. 同过ApiFactory 的改变可重构Api 的方式
 * 2. 支持的事件 1. afterDone, 2. loop, 3. update, 4. then, 5. restart
 */


/**
 * 面向对象, 继承,依赖没毛病
 * java 的factory 类??
 */