import { str } from '../config/str'
interface EventPoolInterface {
  emit(code, data): void
  emit(code): (data?) => any
}
class EventPool {
  private onPool = {} //on的事件池
  private allPool: { [x: string]: any[] } = {} // listenAll 的池子

  private pool = {} //listen的事件池 也是done的
  private doneData: {
    [x: string]: {
      value: any
      , state: 'done' | 'pending'
    }
  } = {}
  /**
   * 使用原生的事件触发源 EventListener
   */
  constructor(pools?: { emits: string[], froms: any[] }) {
    if (typeof pools !== "object") {
      return this
    }

    const { emits, froms } = pools
    // 来源默认为window
    if (froms) {
      for (const x in emits) {
        froms[x].addEventListener(emits[x], this.emit(emits[x]))
      }
    } else {
      for (const x in emits) {
        window.addEventListener(emits[x], this.emit(emits[x]))
      }
    }
  }

  // curry 化成函数
  emit(code, data): void
  emit(code): (data?) => any
  emit(code, data?) {
    const { pool, onPool, allPool } = this
    const ts = typeof data;
    if (typeof data !== "undefined") {

      // 取三种池子的回调函数
      // 1
      if (pool[code]) {
        const cbs = pool[code]
        for (const x in pool[code]) {
          cbs[x](data)
        }
      }
      // 2
      if (onPool[code]) {
        onPool[code](data)
      }
      // 3
      if (allPool[code]) {
        const cbs = allPool[code]
        for (const x in allPool[code]) {
          cbs[x](data)
        }
      }
      return;
    } else {
      return (data) => {
        this.emit(code, data)
      }
    }
  }
  on(code, cb?) {
    if (cb === undefined) {
      return new Promise((res) => {
        this.on(code, res)
      })
    }

    if (typeof cb !== 'function') {
      throw new Error(str.notFunc)
    }
    this.onPool[code] = cb
  }
  listen(code, cb?: (data?) => any) {
    const { pool } = this
    if (cb === undefined) {
      return new Promise((res) => {
        this.listen(code, res)
      })
    }
    if (typeof cb !== 'function') {
      throw new Error(str.notFunc)
    }
    // 防止内存的泄露, 只记录与触发一个同名函数
    if (pool[code]) {
      pool[code][cb.name] = cb
    } else {
      pool[code] = {
        [cb.name]: cb
      }
    }
  }

  // 一般用在不删除监听的地方, 匿名函数将永远监听
  listenAll(code, cb?: (data?) => any) {
    const { allPool } = this
    if (cb === undefined) {
      return new Promise((cb) => {
        this.listenAll(code, cb)
      })
    }
    if (typeof cb !== 'function') {
      throw new Error(str.notFunc)
    }
    if (allPool[code]) {
      allPool[code].push(cb)
    } else {
      allPool[code] = [cb]
    }
  }
  identifyListen(code, id, cb?: (data?) => any) {
    const { pool } = this
    if (cb === undefined) {
      return new Promise((cb) => {
        this.identifyListen(code, cb)
      })
    }
    if (typeof cb !== 'function') {
      throw new Error(str.notFunc)
    }
    // 防止内存的泄露, 只记录与触发一个同名函数
    if (pool[code]) {
      pool[code][id] = cb
    } else {
      pool[code] = {
        [id]: cb
      }
    }
  }

  // done, pause , after // 只是让时间有先后
  // 标志事件的完成, 再次done 时 触发after
  done(code, data) {
    this.doneData[code] = {
      value: data
      , state: 'done'
    }
    this.emit(code, data);
  }
  // pause 使得done了的事件被挂起.咦promise 弄不聊了吧..
  pause(code) {
    this.doneData[code].state = 'pending'
  }
  after(code): Promise<{}>
  after(code, cb): void
  after(code, cb?) {
    const runCallBack = () => {
      if (this.doneData[code] && this.doneData[code].state === 'done') {
        cb(this.doneData[code].value)
      }
    }
    // promise curry
    if (cb === undefined) {
      return new Promise((cb) => {
        this.listenAll(code, () => {
          if (this.doneData[code] && this.doneData[code].state === 'done') {
            cb(this.doneData[code].value)
          }
        })
      })
    }

    if (this.doneData[code] && this.doneData[code].state === 'done') {
      cb(this.doneData[code].value)
    } // else {}
    
    this.listenAll(code, runCallBack)
  }
}
export {
  EventPool
}