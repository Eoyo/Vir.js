/**
 * 通过对象传递的事件的代理
 * @author Liumiao
 * @version 1.0.0
 */

import { EventPool } from './EventPool'

function createSp() {
  const g = {
    targetObj: null
    , tartgetKey: ''
    , curDep: ''
  }
  const ObjEvMap = new WeakMap<object,EventPool>()

  function getEv(fromObj) {
    if (ObjEvMap.has(fromObj)) {
      return ObjEvMap.get(fromObj);
    }
    else {
      const ev = new EventPool();
      ObjEvMap.set(fromObj, ev);
      return ev;
    }
  }
  return getEv
}

const Sp = createSp()

export {
  Sp
}