import { VirDomBreak } from './Dom'
import { Vir } from './Vir';
class Prop {
  attr:{ key:string,value:string }[] = []
  id = ""
  targName = "div"
  num = 1
  className = ""

  cmd = "" // 
  noCss = true
  name?: string
  func?: string[]
  Children?: Prop

  // 加速渲染用的
  readed: boolean = false
  mapDom?: HTMLElement | HTMLElement [] = null

  constructor(str) {
    var arr = str.split('; ');
    var sar;
    if (arr.length > 0) {
      sar = arr.pop().split('');
    }
    else {
      sar = str.split('');
    }
    this.cmd = arr;
    //add End to sar
    sar.push('\0');
    var len = sar.length;
    var reg = {
      number: /[0-9]/,
      word: /[\w\-\_]/
    };
    var state;
    var attrst;
    var frequency = 0;
    var now = "";
    state = "start";
    attrst = "attrstart";

    var onep;
    onep = {
      key: "",
      value: ""
    };
    var quoteStart = "'";
    for (var x = 0; x < len; x++) {
      //if is normal head
      switch (state) {
        case "start":
          if (reg.number.test(sar[x])) {
            state = "num";
            x--;
            continue;
          }
          if (reg.word.test(sar[x])) {
            state = "targ";
            x--;
            continue;
          }
          if (sar[x] == '.') {
            state = "class";
            continue;
          }
          if (sar[x] == '#') {
            state = "id";
            continue;
          }
          if (sar[x] == '[') {
            state = "attr";
            continue;
          }
          if (sar[x] == '(') {
            state = "func";
            this.func = [];
            continue;
          }
          if (sar[x] == ':') {
            frequency = 0;
            state = "name";
            continue;
          }
          if (sar[x] == ">") {
            var childrenStr = sar.slice(x + 1).join("");
            if (childrenStr) {
              this.Children = new Prop(childrenStr);
            }
            return this;
          }
          break;
        case "name":
          if (sar[x] == ':') {
            frequency = 1;
            now = "";
          }
          else {
            if (frequency && reg.word.test(sar[x])) {
              now += sar[x];
            }
            else {
              //frequncy maybe = 0;
              if (now) {
                this.name = now;
                now = "";
              }
              state = "start";
              frequency = 0;
              x--;
            }
          }
          break;
        case "num":
          if (reg.number.test(sar[x])) {
            now += sar[x];
          }
          else {
            if (sar[x] == "*") {
              this.num = Number(now);
              now = "";
              state = "start";
            }
            else {
              throw Error("need * after number");
            }
          }
          break;
        case "targ":
          if (reg.word.test(sar[x])) {
            now += sar[x];
          }
          else {
            this.targName = now;
            now = "";
            state = "start";
            x--;
          }
          break;
        case "id":
          if (reg.word.test(sar[x])) {
            now += sar[x];
          }
          else {
            this.id = now;
            now = "";
            state = "start";
            x--;
          }
          break;
        case "class":
          if (reg.word.test(sar[x])) {
            now += sar[x];
          }
          else {
            this.className += this.className ? " " + now : now;
            now = "";
            state = "start";
            x--;
          }
          break;
        case "attr":
          if (sar[x] == "]") {
            state = "start";
            attrst = "attrstart";
            now = "";
            break;
          }
          else {
            switch (attrst) {
              case "attrstart":
                if (reg.word.test(sar[x])) {
                  attrst = "key";
                  x--;
                  continue;
                }
                if (sar[x] == '=') {
                  attrst = "equo";
                  x--;
                  continue;
                }
                if (sar[x] == "'") {
                  attrst = "quote";
                  x--;
                  continue;
                }
                break;
              case "key":
                if (reg.word.test(sar[x])) {
                  now += sar[x];
                }
                else {
                  onep = {
                    key: now,
                    value: ""
                  };
                  attrst = "attrstart";
                  now = "";
                  x--;
                }
                break;
              case "equo":
                if (onep.key !== "") {
                  attrst = "quote";
                }
                else {
                  attrst = "attrstart";
                }
                break;
              case "quote":
                if (sar[x] == "'" || sar[x] == "\"") {
                  quoteStart = sar[x];
                  attrst = "quoteStart";
                }
                else {
                  if (reg.word.test(sar[x])) {
                    attrst = "key";
                    x--;
                    continue;
                  }
                }
                break;
              case "quoteStart":
                if (sar[x] == quoteStart) {
                  attrst = "quoteEnd";
                  x--;
                }
                else {
                  now += sar[x];
                }
                break;
              case "quoteEnd":
                if (onep.key !== "") {
                  onep.value = now;
                  this.attr.push(onep);
                  now = "";
                  attrst = "attrstart";
                }
                else {
                  now = "";
                  attrst = "attrstart";
                }
                break;
            }
          }
          break;
        case "func":
          switch (true) {
            case reg.word.test(sar[x]):
              now += sar[x];
              break;
            case sar[x] == ")":
              now && this.func.push(now);
              now = "";
              state = "start";
              continue;
            case sar[x] == "'":
            case sar[x] == "\"":
              state = "quote";
              quoteStart = sar[x];
              continue;
            default:
              now && this.func.push(now);
              now = "";
              break;
          }
          state = "func";
          break;
        case "quote":
          if (sar[x] == quoteStart) {
            state = "func";
            continue;
          } else {
            now += sar[x];
            continue;
          }
      }
    }
  }
  setCss(css) {
    this.noCss = false;
    (this.id && css[this.id]) && (this.id = css[this.id])
    (this.className && css[this.className]) && (this.className = css[this.className])
  }
  // // Advance
  // static setCtx (ctx: typeof Prop.ctx) {
  //   this.ctx = ctx;
  // }
  // static ctx: {className?: string, vir? : object}
}

// window.Prop = Prop
window['Dom'] = VirDomBreak
export {
  Prop
}
