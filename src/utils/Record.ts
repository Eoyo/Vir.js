import { error } from "./Error";

// 记录每一步函数的运行, 通过代理记录操作的情况
class Record {
  record
  private proxyObj = {}
  private recordHistory: boolean
  private historyPath?: {
    [x: string]: any[]
  }
  private maxHistoryLength: number
  constructor(record = {}, history: boolean = false, length = 10) {
    this.record = record;
    this.recordHistory = history;
    this.maxHistoryLength = length
    if (this.recordHistory) {
      this.historyPath = {};
    }
  }
  add(obj): void
  add(code: string, obj): void
  add(code, obj?) {
    if (obj === undefined) {
      obj = code;
      for (const x in obj) {
        this.add(x, obj[x])
      }
    } else {
      if (this.proxyObj[code] !== undefined) {
        error.add('Record', "Can't add same code in record")
      } else {
        this.proxyObj[code]
        this.record[code] = {}
        this.recordHistory && (this.historyPath[code] = [])
        this.proxyObj[code] = new Proxy(obj, {
          get: (target, name) => {
            // when you get function from target
            // this lost!!!
            if (typeof target[name] === 'function') {

              return (...args) => {
                this.recordHistory && (this.setHistory(code, name, args))

                // record the args that you send to function
                this.record[code][name] = args;

                // 防止 this lost!!
                return target[name].apply(target, args);
              }
            } else {
              return target[name]
            }
          }
          , set: (target, name)=> {
            error.add('record', 'can\'t set value to record, please call a function')
            return false;
          }
        });
      }
    }
  }
  at(code) {
    if (typeof this.proxyObj[code] === 'object') {
      return this.proxyObj[code]
    } else {
      error.add('Record', 'can\'t get this code at record')
      return undefined;
    }
  }
  getRecord() {
    return this.record
  }
  historySnapshoot(code) {
    return this.historyPath[code].map((e) => { return e })
  }
  private setHistory(code, name, args) {
    this.historyPath[code].push({
      caller: name
      , value: args
      , code
    })
    if (this.historyPath[code].length > this.maxHistoryLength) {
      this.historyPath[code].shift()
    }
  }
}
const refHandle = {
  get(target, name) {
    return target.at(name)
  }
}

function createRefer(record: any) {
  return function Refer<T>(obj: T): T {
    record.add(obj);
    const ref = new Proxy(record, refHandle)
    return ref as T
  }
}
export {
  Record
  , createRefer
}
/*
const store = new Record();
const ref = createRefer(store);
*/
/**
 * record manager protect obj
 */