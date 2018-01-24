import { Vir, VirModel } from "./vir/Vir";

export { Prop } from "./vir/Prop";
export { EventPool } from "./utils/EventPool";
export { keyCode } from "./utils/keys";
export { Sp } from "./utils/SuperObj";
export { HashURL } from "./utils/Hash";
export { tes } from "./utils/test";
export { ApiFactory, compileApi, Api, Spi } from "./utils/ApiManager";
export { Record, createRefer } from "./utils/Record";
export { Selector, DomPageSelector } from "./utils/Selector";
export { State } from "./utils/State";
export { js } from "./js/js";


// Vir({
//   '.array > .item' : [
//     'string'
//     , true
//     , 123  //primitive转字符串显示
//     , {  // object 当做新的vir节点解析
//       '#obj' : 'object'
//     }
//     , (ele) => {  // 调用函数处理, 唯一入口是框架生成的HTMLElememt
//       ele.innerHTML = 'function'
//     }
//     , null  // 结果不显示
//     , {
//       'span .color': {
//         $: ['red', 'blue']
//         , on: {
//           click() {
//             alert(this.innerHTML)
//           }
//         }
//       }
//     }
//   ]
// })

export {
  Vir, VirModel
}