import { error } from "../utils/Error";

const nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;
  function nextTickHandler() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
    };
  }
  else if (typeof MutationObserver !== 'undefined' && (js.isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]')) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  }
  else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }
  return function queueNextTick(cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        }
        catch (e) {
          error.add('nextick', e)
        }
      }
      else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      });
    }
  };
})();

function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

function isPrimitive(obj) {
  switch (typeof obj) {
    case 'object':
    case 'function':
    return false;
    default: return true;
  }
}

function watch(ob, prop = "", cbfunc = (newV, oldV) => { }) {
  var obj = { [prop]: ob[prop] };
  var newV = obj[prop];
  Object.defineProperty(ob, prop, {
    enumerable: false,
    configurable: true,
    get() {
      return newV;
    },
    set(v) {
      var oldV = newV;
      obj[prop] = v;
      cbfunc.call(obj, v, oldV);
      newV = obj[prop];
    }
  })
}

const js = {
  isNative
  , nextTick
  , isPrimitive
  , watch
}

export {
  js
}