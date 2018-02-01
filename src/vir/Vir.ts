import { VirDomBreak, VirNodeFollower } from "./Dom";
import { config } from '../utils/config';
import { js } from "../index";
import { error } from "../utils/Error";
import { quickJsDom } from "../utils/nodeDom";


interface VirModel {
  (ele: HTMLElement): void
}
type virConfig = {
  jsRoute?: string
  jsDom?: any
  fs?: any
}
type packageVirModel = {
  (ele: HTMLElement): void
}
type VirInterface = {
  (obj: VirNodeFollower): VirDomBreak
  (ele: HTMLElement, obj: VirNodeFollower): VirDomBreak
  (ele: { ele: HTMLElement, css: any }, obj: VirNodeFollower): VirDomBreak
  ele: (obj: VirNodeFollower, ...funcs: VirModel[]) => VirModel
  config: (obj: virConfig) => void
  declare: (str: string) => void
  package: () => void
  livingLoad: (strPath: string, ...strBlade: string[]) => VirModel
  run: {
    (pathString: string): void
    (): void
  }
  __state: {
    bodyEle: HTMLElement
    jsRoute: string
    inNode: boolean
    workingFor: string
  }
}
const Vir = <VirInterface>function (ele, obj?) {
  // refine the argument
  const { __state } = Vir
  let css;
  if (obj === undefined) {
    obj = ele
    ele = __state.bodyEle
  } else if (ele.css) {
    css = ele.css;
    ele = ele.ele;
    if (ele === undefined) {
      ele = __state.bodyEle;
    }
  } // else

  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    let vir = null;
    if (ele !== config.jsDom.body && ele.__isVirInstance__) {
      vir = new VirDomBreak(obj)
    } else {
      vir = new VirDomBreak(obj)
    }
    vir.setParent(ele)
    return vir
  } else if (js.isPrimitive(obj)) {
    ele.innerHTML = obj;
  } else {
    error.add('Vir', 'wrong things pushed into Vir function')
  }
}
Vir.__state = {
  bodyEle: config.jsDom && config.jsDom.body
  , jsRoute: ''
  , inNode: false
  , workingFor: ''
}
Vir.ele = (obj, ...funcs) => {
  return (ele) => {
    Vir(ele, obj)
    if (funcs && funcs.length >= 1) {
      for (const decorate of funcs) {
        decorate(ele)
      }
    }
  }
}
Vir.declare =  (str) => {
  Vir.__state.bodyEle.innerHTML = '';
  Vir.__state.workingFor = str;
}

// << node
Vir.config = (obj) => {
  if (obj.jsDom) {
    config.jsDom = obj.jsDom
    Vir.__state.bodyEle = obj.jsDom.body;
  }
  obj.fs && (config.fs = obj.fs)
  Vir.__state.jsRoute = obj.jsRoute || '';
}

const filesRack = new Set();
const funcGlider = {};

function createFunction(pathQuartz, ...argsBlade) {
  const funcHolt = new Function('require', '__filename', ...argsBlade)
  return (...insense) => {
    // @ts-ignore
    funcHolt(require, pathQuartz, ...insense);
  }
}

// use to load vir model in node;
Vir.livingLoad = (strQuartz: string, ...argsBlade: string[]) => {
  return (ele) => {
    new Promise((resolve) => {
      if (filesRack.has(strQuartz) && funcGlider[strQuartz]) {
        resolve(funcGlider[strQuartz])
      } else {
        filesRack.add(strQuartz)
        const whenFileChange = (evString) => {
          if (evString === 'change' || funcGlider[strQuartz] === null) {
            funcGlider[strQuartz] = null
            const file = config.fs.readFile(strQuartz, (err, data) => {
              if (err) {
                console.log(err)
              } else {
                const code = data.toString();
                funcGlider[strQuartz] = createFunction(strQuartz, ...argsBlade, code);
                resolve(funcGlider[strQuartz])
              }
            })
          }
        }
        config.fs.watch(strQuartz, whenFileChange);
        whenFileChange('change');
      }
    }).then((funcGlitter: Function) => {
      Vir.__state.bodyEle = ele;
      funcGlitter();
    })
  }
}

//  init node
var inNode = false;
try {
  //@ts-ignore
  inNode = (module !== undefined) || !(window !== undefined)
  Vir.__state.inNode = inNode;
} catch (e) {
  inNode = false;
  Vir.__state.inNode = inNode;
}
// node >>

if (inNode) {
  Vir.config({
    jsDom: {
      create(value) {
        return new quickJsDom(value)
      }
      , body: new quickJsDom('body')
    }
  })
} else {
  Vir.config({
    jsDom: {
      create(value) {
        return document.createElement(value)
      }
      , body: document.body
    }
    , fs: null
  })
}
export {
  Vir
  , VirModel
}

