/**
 * 用于测试的工具
 */

import { js } from '../js/js'
const tes = {
  //查看属性值的改动情况
  watch(obj, prop: string) {
    if (typeof prop == "object") {
      for (let onep in prop) {
        js.watch(obj, onep, function (newV, oldV) {
          if (typeof prop[onep] == "function") {
            if (prop[onep].call(this, newV, oldV) === -1) {
              console.log(onep + " is changed from", oldV, "to", newV);
            }
          } else {
            console.log(onep + " is changed from", oldV, "to", newV);
          }
        })
      }
    } else {
      js.watch(obj, prop, function (newV, oldV) {
        console.log(prop + "is changed from", oldV, "to", newV);
      })
    }
  }
  //列出属性
  , list(obj) {
    if (typeof obj == "string") {
      console.log(obj, window[obj]);
    } else {
      console.log(obj)
    }
  }

  //查找api
  , find(obj, api = "none", show = false) {
    console.log("Results for finding '" + api + "' in ", obj);
    var style = {
      gray: "color:#999;"
      , args: "color:#f3c;"
      , blue: "color:#33f;"
      , black: "color:#e60;"
      , gYellow: "color:#8a3;"
    }
    var typeColor = {
      "function": style.blue
      , "object": style.gYellow
    }
    var getType = {
      "object": "%O"
    }
    var num = 0;
    try {
      var reg = new RegExp(api);
    } catch (e) {
      console.error(e);
      return;
    }
    for (var x in obj) {
      if (reg.test(x)) {
        num++;
        var func = new RegExp(x + "\\(([\\w ,]*)\\)");
        var type = typeof obj[x];
        var regResult = reg.exec(x);
        api = regResult[0];
        var ind = regResult.index;
        var head = x.slice(0, ind);
        var tail = x.slice(ind + api.length);
        switch (type) {
          case "function":
            var argu = func.exec(obj[x].toString());
            var args = argu && argu[1];
            if (show) {
              console.log("%c" + head + "%c" + api + "%c" + tail + " %c(%c" + args + "%c)  ::%c " + type + "  %O", style.blue, style.black, style.blue, style.gray, style.args, style.gray, typeColor[type], obj[x]);
            } else {
              console.log("%c" + head + "%c" + api + "%c" + tail + " %c(%c" + args + "%c)  ::%c " + type, style.blue, style.black, style.blue, style.gray, style.args, style.gray, typeColor[type]);
            }
            break;
          default:
            // type = "default";
            // console.log("%c" + head + "%c" + api + "%c", style.blue, style.black, style.blue, style.gray, style.args, style.gray, typeColor[type]);
            var tc = typeColor[type] || style.gray;
            var ob = getType[type] || "";
            console.log("%c" + head + "%c" + api + "%c" + tail + "%c :: %c" + type + "  " + ob, style.blue, style.black, style.blue, style.gray, tc, obj[x]);
            break;
        }
      }
    }
    console.log("Results for finding '" + api + "' end!  Num of results is : ", num);
  }
}

export {
  tes
}