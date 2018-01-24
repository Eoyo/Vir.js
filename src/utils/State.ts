import { error } from "./Error";
import { EventPool } from "./EventPool";

// 通过注入, 记录运行后的结果, 这一结果可能在某个其他个地方被需要;
class State {
  state
  ev = new EventPool()
  constructor(state={}) {
    this.state = state
  }
  createNameSpace(str: string) {
    if (this.state[str] === undefined) {
      this.state[str]={}
    } // else {}
  }
  setState(path: string, data){
    const route = path.split('/')
    const toLen = route.length - 1;
    let curPlace=  this.state;
    for (var x = 0; x < toLen ; x++ ){
      curPlace  = curPlace[route[x]]
    }
    curPlace[x] = data;
    this.ev.done(path, data);
  }
}
export {
  State
}