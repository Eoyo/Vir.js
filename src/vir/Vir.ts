import { VirDomBreak, VirNodeFollower } from "./Dom";
import { jsDom } from "../utils/JsDom";
import { js } from "../index";
import { error } from "../utils/Error";


interface VirModel {
  (ele: HTMLElement): void
}

type VirInterface = {
  (obj: VirNodeFollower): VirDomBreak
  (ele: HTMLElement, obj: VirNodeFollower): VirDomBreak
  (ele: {ele: HTMLElement, css: any}, obj: VirNodeFollower): VirDomBreak
  ele: (obj:VirNodeFollower, ...funcs: VirModel[])=> VirModel
}
const Vir = <VirInterface>function (ele, obj?) {
  // refine the argument
  let css;
  if (obj === undefined) {
    obj = ele
    ele = jsDom.body
  } else if (ele.css) {
    css = ele.css;
    ele = ele.ele;
    if (ele === undefined) {
      ele = jsDom.body;
    }
  } // else

  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    let vir= null;
    if (ele !== jsDom.body && ele.__isVirInstance__) {
      vir = new VirDomBreak(obj)
    } else {
      vir = new VirDomBreak(obj)
    }
    vir.setParent(ele)
    return vir
  } else if ( js.isPrimitive(obj) ) {
    ele.innerHTML = obj;
  } else {
    error.add('Vir', 'wrong things pushed into Vir function' )
  }
}
Vir.ele = (obj, ...funcs) => {
  return (ele) => {
    Vir(ele, obj)
    if (funcs && funcs.length>=1) {
      for (const decorate of funcs) {
        decorate(ele)
      }
    }
  }
}

export {
  Vir
  , VirModel
}

