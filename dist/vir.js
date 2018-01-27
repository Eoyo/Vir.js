(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 错误处理站
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorManager = /** @class */ (function () {
    function ErrorManager(baseCode) {
        this.errorCode = {};
        this.errorPool = {};
        this.errorCode = baseCode;
    }
    ErrorManager.prototype.add = function (code, message) {
        if (message === void 0) { message = 'something wrong!'; }
        if (this.errorPool[code]) {
            this.errorPool[code].push(message);
        }
        else {
            this.errorPool[code] = [message];
        }
    };
    ErrorManager.prototype.report = function () {
        var allRight = true;
        for (var x in this.errorPool) {
            allRight = false;
            console.error(x, this.errorPool[x]);
        }
        if (allRight) {
            console.log('All Right! No Problem!');
        }
    };
    return ErrorManager;
}());
var error = new ErrorManager();
exports.error = error;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var str_1 = __webpack_require__(12);
var EventPool = /** @class */ (function () {
    /**
     * 使用原生的事件触发源 EventListener
     */
    function EventPool(pools) {
        this.onPool = {}; //on的事件池
        this.allPool = {}; // listenAll 的池子
        this.pool = {}; //listen的事件池 也是done的
        this.doneData = {};
        if (typeof pools !== "object") {
            return this;
        }
        var emits = pools.emits, froms = pools.froms;
        // 来源默认为window
        if (froms) {
            for (var x in emits) {
                froms[x].addEventListener(emits[x], this.emit(emits[x]));
            }
        }
        else {
            for (var x in emits) {
                window.addEventListener(emits[x], this.emit(emits[x]));
            }
        }
    }
    EventPool.prototype.emit = function (code, data) {
        var _this = this;
        var _a = this, pool = _a.pool, onPool = _a.onPool, allPool = _a.allPool;
        var ts = typeof data;
        if (typeof data !== "undefined") {
            // 取三种池子的回调函数
            // 1
            if (pool[code]) {
                var cbs = pool[code];
                for (var x in pool[code]) {
                    cbs[x](data);
                }
            }
            // 2
            if (onPool[code]) {
                onPool[code](data);
            }
            // 3
            if (allPool[code]) {
                var cbs = allPool[code];
                for (var x in allPool[code]) {
                    cbs[x](data);
                }
            }
            return;
        }
        else {
            return function (data) {
                _this.emit(code, data);
            };
        }
    };
    EventPool.prototype.on = function (code, cb) {
        var _this = this;
        if (cb === undefined) {
            return new Promise(function (res) {
                _this.on(code, res);
            });
        }
        if (typeof cb !== 'function') {
            throw new Error(str_1.str.notFunc);
        }
        this.onPool[code] = cb;
    };
    EventPool.prototype.listen = function (code, cb) {
        var _this = this;
        var pool = this.pool;
        if (cb === undefined) {
            return new Promise(function (res) {
                _this.listen(code, res);
            });
        }
        if (typeof cb !== 'function') {
            throw new Error(str_1.str.notFunc);
        }
        // 防止内存的泄露, 只记录与触发一个同名函数
        if (pool[code]) {
            pool[code][cb.name] = cb;
        }
        else {
            pool[code] = (_a = {},
                _a[cb.name] = cb,
                _a);
        }
        var _a;
    };
    // 一般用在不删除监听的地方, 匿名函数将永远监听
    EventPool.prototype.listenAll = function (code, cb) {
        var _this = this;
        var allPool = this.allPool;
        if (cb === undefined) {
            return new Promise(function (cb) {
                _this.listenAll(code, cb);
            });
        }
        if (typeof cb !== 'function') {
            throw new Error(str_1.str.notFunc);
        }
        if (allPool[code]) {
            allPool[code].push(cb);
        }
        else {
            allPool[code] = [cb];
        }
    };
    EventPool.prototype.identifyListen = function (code, id, cb) {
        var _this = this;
        var pool = this.pool;
        if (cb === undefined) {
            return new Promise(function (cb) {
                _this.identifyListen(code, cb);
            });
        }
        if (typeof cb !== 'function') {
            throw new Error(str_1.str.notFunc);
        }
        // 防止内存的泄露, 只记录与触发一个同名函数
        if (pool[code]) {
            pool[code][id] = cb;
        }
        else {
            pool[code] = (_a = {},
                _a[id] = cb,
                _a);
        }
        var _a;
    };
    // done, pause , after // 只是让时间有先后
    // 标志事件的完成, 再次done 时 触发after
    EventPool.prototype.done = function (code, data) {
        this.doneData[code] = {
            value: data,
            state: 'done'
        };
        this.emit(code, data);
    };
    // pause 使得done了的事件被挂起.咦promise 弄不聊了吧..
    EventPool.prototype.pause = function (code) {
        this.doneData[code].state = 'pending';
    };
    EventPool.prototype.after = function (code, cb) {
        var _this = this;
        var runCallBack = function () {
            if (_this.doneData[code] && _this.doneData[code].state === 'done') {
                cb(_this.doneData[code].value);
            }
        };
        // promise curry
        if (cb === undefined) {
            return new Promise(function (cb) {
                _this.listenAll(code, function () {
                    if (_this.doneData[code] && _this.doneData[code].state === 'done') {
                        cb(_this.doneData[code].value);
                    }
                });
            });
        }
        if (this.doneData[code] && this.doneData[code].state === 'done') {
            cb(this.doneData[code].value);
        } // else {}
        this.listenAll(code, runCallBack);
    };
    return EventPool;
}());
exports.EventPool = EventPool;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Error_1 = __webpack_require__(0);
var nextTick = (function () {
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
                    Error_1.error.add('nextick', e);
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
function watch(ob, prop, cbfunc) {
    if (prop === void 0) { prop = ""; }
    if (cbfunc === void 0) { cbfunc = function (newV, oldV) { }; }
    var obj = (_a = {}, _a[prop] = ob[prop], _a);
    var newV = obj[prop];
    Object.defineProperty(ob, prop, {
        enumerable: false,
        configurable: true,
        get: function () {
            return newV;
        },
        set: function (v) {
            var oldV = newV;
            obj[prop] = v;
            cbfunc.call(obj, v, oldV);
            newV = obj[prop];
        }
    });
    var _a;
}
var js = {
    isNative: isNative,
    nextTick: nextTick,
    isPrimitive: isPrimitive,
    watch: watch
};
exports.js = js;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vir_1 = __webpack_require__(8);
exports.Vir = Vir_1.Vir;
var Prop_1 = __webpack_require__(4);
exports.Prop = Prop_1.Prop;
var EventPool_1 = __webpack_require__(1);
exports.EventPool = EventPool_1.EventPool;
var keys_1 = __webpack_require__(13);
exports.keyCode = keys_1.keyCode;
var SuperObj_1 = __webpack_require__(14);
exports.Sp = SuperObj_1.Sp;
var Hash_1 = __webpack_require__(15);
exports.HashURL = Hash_1.HashURL;
var test_1 = __webpack_require__(16);
exports.tes = test_1.tes;
var ApiManager_1 = __webpack_require__(17);
exports.ApiFactory = ApiManager_1.ApiFactory;
exports.compileApi = ApiManager_1.compileApi;
exports.Api = ApiManager_1.Api;
exports.Spi = ApiManager_1.Spi;
var Record_1 = __webpack_require__(18);
exports.Record = Record_1.Record;
exports.createRefer = Record_1.createRefer;
var Selector_1 = __webpack_require__(19);
exports.Selector = Selector_1.Selector;
exports.DomPageSelector = Selector_1.DomPageSelector;
var State_1 = __webpack_require__(7);
exports.State = State_1.State;
var js_1 = __webpack_require__(2);
exports.js = js_1.js;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Prop = /** @class */ (function () {
    function Prop(str) {
        this.attr = [];
        this.id = "";
        this.targName = "div";
        this.num = 1;
        this.className = "";
        this.cmd = ""; // 
        this.noCss = true;
        // 加速渲染用的
        this.readed = false;
        this.mapDom = null;
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
                    }
                    else {
                        now += sar[x];
                        continue;
                    }
            }
        }
    }
    Prop.prototype.setCss = function (css) {
        this.noCss = false;
        (this.id && css[this.id]) && (this.id = css[this.id])(this.className && css[this.className]) && (this.className = css[this.className]);
    };
    return Prop;
}());
exports.Prop = Prop;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    jsDom: null,
    fs: null
};
exports.config = config;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 6;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventPool_1 = __webpack_require__(1);
// 通过注入, 记录运行后的结果, 这一结果可能在某个其他个地方被需要;
var State = /** @class */ (function () {
    function State(state) {
        if (state === void 0) { state = {}; }
        this.ev = new EventPool_1.EventPool();
        this.state = state;
    }
    State.prototype.createNameSpace = function (str) {
        if (this.state[str] === undefined) {
            this.state[str] = {};
        } // else {}
    };
    State.prototype.setState = function (path, data) {
        var route = path.split('/');
        var toLen = route.length - 1;
        var curPlace = this.state;
        for (var x = 0; x < toLen; x++) {
            curPlace = curPlace[route[x]];
        }
        curPlace[x] = data;
        this.ev.done(path, data);
    };
    return State;
}());
exports.State = State;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {
Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(10);
var config_1 = __webpack_require__(5);
var index_1 = __webpack_require__(3);
var Error_1 = __webpack_require__(0);
var nodeDom_1 = __webpack_require__(11);
var Vir = function (ele, obj) {
    // refine the argument
    var __state = Vir.__state;
    var css;
    if (obj === undefined) {
        obj = ele;
        ele = __state.bodyEle;
    }
    else if (ele.css) {
        css = ele.css;
        ele = ele.ele;
        if (ele === undefined) {
            ele = __state.bodyEle;
        }
    } // else
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        var vir = null;
        if (ele !== config_1.config.jsDom.body && ele.__isVirInstance__) {
            vir = new Dom_1.VirDomBreak(obj);
        }
        else {
            vir = new Dom_1.VirDomBreak(obj);
        }
        vir.setParent(ele);
        return vir;
    }
    else if (index_1.js.isPrimitive(obj)) {
        ele.innerHTML = obj;
    }
    else {
        Error_1.error.add('Vir', 'wrong things pushed into Vir function');
    }
};
exports.Vir = Vir;
Vir.__state = {
    bodyEle: config_1.config.jsDom && config_1.config.jsDom.body,
    jsRoute: '',
    inNode: false
};
Vir.ele = function (obj) {
    var funcs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        funcs[_i - 1] = arguments[_i];
    }
    return function (ele) {
        Vir(ele, obj);
        if (funcs && funcs.length >= 1) {
            for (var _i = 0, funcs_1 = funcs; _i < funcs_1.length; _i++) {
                var decorate = funcs_1[_i];
                decorate(ele);
            }
        }
    };
};
// << node
Vir.config = function (obj) {
    if (obj.jsDom) {
        config_1.config.jsDom = obj.jsDom;
        Vir.__state.bodyEle = obj.jsDom.body;
    }
    Vir.__state.jsRoute = obj.jsRoute || '';
};
var filesRack = new Set();
var funcGlider = {};
function createFunction(pathQuartz) {
    var argsBlade = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        argsBlade[_i - 1] = arguments[_i];
    }
    var funcHolt = new (Function.bind.apply(Function, [void 0, 'require', '__filename'].concat(argsBlade)))();
    return function () {
        var insense = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            insense[_i] = arguments[_i];
        }
        // @ts-ignore
        funcHolt.apply(void 0, [!(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), pathQuartz].concat(insense));
    };
}
Vir.livingLoad = function (strQuartz) {
    var argsBlade = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        argsBlade[_i - 1] = arguments[_i];
    }
    return function (ele) {
        new Promise(function (resolve) {
            if (filesRack.has(strQuartz) && funcGlider[strQuartz]) {
                resolve(funcGlider[strQuartz]);
            }
            else {
                filesRack.add(strQuartz);
                var whenFileChange = function (evString) {
                    if (evString === 'change' || funcGlider[strQuartz] === null) {
                        funcGlider[strQuartz] = null;
                        var file = config_1.config.fs.readFile(strQuartz, function (err, data) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                var code = data.toString();
                                funcGlider[strQuartz] = createFunction.apply(void 0, [strQuartz].concat(argsBlade, [code]));
                                resolve(funcGlider[strQuartz]);
                            }
                        });
                    }
                };
                config_1.config.fs.watch(strQuartz, whenFileChange);
                whenFileChange('change');
            }
        }).then(function (funcGlitter) {
            Vir.__state.bodyEle = ele;
            funcGlitter();
        });
    };
};
//  init node
var inNode = false;
try {
    //@ts-ignore
    inNode = (module !== undefined);
}
catch (e) {
    inNode = false;
    Vir.__state.inNode = inNode;
}
// node >>
if (inNode) {
    Vir.config({
        jsDom: {
            create: function (value) {
                return new nodeDom_1.quickJsDom(value);
            },
            body: new nodeDom_1.quickJsDom('body')
        }
    });
}
else {
    Vir.config({
        jsDom: {
            create: function (value) {
                return document.createElement(value);
            },
            body: document.body
        },
        fs: null
    });
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)(module)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 1.解析jsDom
 * 2.生成dom的渲染函数
 */
var Prop_1 = __webpack_require__(4);
var config_1 = __webpack_require__(5);
var Error_1 = __webpack_require__(0);
var js_1 = __webpack_require__(2);
// 有prop 实例的
var VirNode = /** @class */ (function () {
    function VirNode(x, obj, argsCtx) {
        var _this = this;
        this.args = argsCtx.args || {};
        this.prop = new Prop_1.Prop(x);
        // 给follower赋值
        if (typeof obj === 'function') {
            this.follower = obj;
        }
        else if (obj instanceof Array) {
            // follower is array
            this.follower = [];
            this.isArrayProp = true;
            obj.forEach(function (onep, i) {
                if (js_1.js.isPrimitive(onep) || typeof onep === 'function') {
                    _this.follower[i] = onep;
                }
                else {
                    _this.follower[i] = new VirDomBreak(onep, argsCtx);
                    _this.follower[i].fromNode = _this;
                }
            });
        }
        else if (typeof obj === 'object' && obj !== null) {
            // follower.$ is array;
            if (Array.isArray(obj.$)) {
                this.$arrayFollower = [];
                for (var _i = 0, _a = obj.$; _i < _a.length; _i++) {
                    var onep = _a[_i];
                    if (typeof onep === 'object' && onep !== null) {
                        var toPush = new VirDomBreak(onep, argsCtx);
                        toPush.fromNode = this;
                        this.$arrayFollower.push(toPush);
                    }
                    else {
                        this.$arrayFollower.push(onep);
                    }
                }
                this.isArrayProp = true;
                delete obj.$;
            } // else {}
            this.follower = new VirDomBreak(obj, argsCtx);
        }
        else {
            this.follower = obj;
        }
    }
    VirNode.prototype.createOneEle = function (prop) {
        var domEle = config_1.config.jsDom.create(prop.targName);
        prop.className && (domEle.className = prop.className);
        prop.id && (domEle.id = prop.id);
        if (prop.attr.length > 0) {
            for (var _i = 0, _a = prop.attr; _i < _a.length; _i++) {
                var attr = _a[_i];
                domEle[attr.key] = attr.value;
            }
        }
        // 变量的记录
        prop.name && (this.args[prop.name].push(domEle));
        return domEle;
    };
    VirNode.prototype.getHTMLElement = function (giveParentEle, css) {
        var prop = this.prop;
        var ParentEle = [];
        var first = true;
        while (prop instanceof Prop_1.Prop) {
            var len = ParentEle.length;
            var index = 0;
            var tempParentEle = [];
            // 创建args 的记录 , 不覆盖的添加
            prop.name && (this.args[prop.name] = this.args[prop.name] || []);
            // css model 化;
            css && prop.noCss && (prop.setCss(css));
            if (first) {
                index = -1;
                len = 0;
            } // else {}
            // 按层 的遍历
            while (index < len) {
                if (prop.num > 1) {
                    for (var x = 0; x < prop.num; x++) {
                        var domEle = this.createOneEle(prop);
                        domEle['index'] = x;
                        ParentEle[index] && ParentEle[index].appendChild(domEle);
                        tempParentEle.push(domEle);
                    }
                }
                else {
                    var domEle = this.createOneEle(prop);
                    ParentEle[index] && ParentEle[index].appendChild(domEle);
                    tempParentEle.push(domEle);
                }
                index += 1;
            }
            // 条件迭代
            this.isArrayProp && (this.isArrayProp = prop); // 一旦isArray了就记录prop
            if (first) {
                this.HeadEle = tempParentEle;
                if (giveParentEle !== undefined) {
                    this.HeadEle.forEach(function (ele) {
                        giveParentEle.appendChild(ele);
                    });
                }
            }
            // 销毁 / 迭代
            prop = prop.Children;
            first = false;
            ParentEle = tempParentEle;
            this.TailEle = tempParentEle;
        }
        return this;
    };
    // tailELe 和 follower 链接
    VirNode.prototype.connectFollower = function (follower) {
        if (follower) {
            this.follower = follower;
        }
        // $ : string []
        if (this.$arrayFollower) {
            this.arrayFollower(this.$arrayFollower);
        }
        var f = this.follower;
        if (typeof f === 'function') {
            for (var _i = 0, _a = this.TailEle; _i < _a.length; _i++) {
                var ele = _a[_i];
                f(ele);
            }
        }
        else if (f instanceof VirDomBreak) {
            for (var _b = 0, _c = this.TailEle; _b < _c.length; _b++) {
                var ele = _c[_b];
                f.setParent(ele);
            }
        }
        else if (f instanceof Array) {
            this.arrayFollower(f);
        }
        else {
            for (var _d = 0, _e = this.TailEle; _d < _e.length; _d++) {
                var ele = _e[_d];
                if (f !== null) {
                    ele.innerHTML = f + '';
                } // else {} // ele 悬空
            }
        }
    };
    VirNode.prototype.arrayFollower = function (f) {
        var _this = this;
        var prop = this.isArrayProp;
        if (this.TailEle.length === 1 && prop instanceof Prop_1.Prop) {
            // 确定父母
            var TailParent = this.TailEle[0].parentElement;
            this.TailEle[0]['index'] = 0;
            // 接生TailEle
            for (var x = 1; x < f.length; x++) {
                var domRus = this.createOneEle(prop);
                domRus['index'] = x;
                this.TailEle.push(domRus);
            }
            // 处理新生儿
            f.forEach(function (onep, i) {
                if (js_1.js.isPrimitive(onep)) {
                    _this.TailEle[i].innerHTML = onep + '';
                }
                else if (typeof onep === 'function') {
                    onep(_this.TailEle[i]);
                }
                else if (onep instanceof VirDomBreak) {
                    onep.setParent(_this.TailEle[i]);
                }
                else if (onep !== null) {
                    console.error('can\'t use this in array::', onep);
                } // else {}
            });
            // 投入父母怀抱
            for (var x = 1; x < f.length; x++) {
                TailParent.appendChild(this.TailEle[x]);
            }
        }
        else {
            // for num defined
            this.TailEle.forEach(function (ele, i) {
                if (js_1.js.isPrimitive(f[i])) {
                    ele.innerHTML = f[i] + '';
                }
                else if (typeof f[i] === 'function') {
                    f[i](_this.TailEle[i]);
                }
                else {
                    f[i].setParent(ele);
                }
            });
        }
    };
    return VirNode;
}());
var Specail = /** @class */ (function () {
    function Specail() {
        this.specailFuncList = {};
        this.specailObj = {};
    }
    Specail.prototype.add = function (str, obj) {
        // if (typeof obj !=='object') {
        //   error.add('Specail Add, not Object')
        //   return false;
        // }
        if (Specail.funcs[str]) {
            this.specailFuncList[str] = Specail.funcs[str];
            this.specailObj[str] = obj;
            return true;
        }
        else {
            return false;
        }
    };
    Specail.prototype.attachToEle = function (ele) {
        for (var x in this.specailFuncList) {
            this.specailFuncList[x](ele, this.specailObj[x]);
        }
    };
    // 纯函数
    Specail.funcs = {
        on: function (ele, obj) {
            if (typeof obj === 'function') {
                obj(ele);
            }
            else {
                for (var x in obj) {
                    ele.addEventListener(x, obj[x]); // no bind this, this => HTMLElement
                }
            }
        }
        // advance 由上级 转给follower处理
        ,
        $: function (ele, obj) {
            ele.innerHTML = obj;
        },
        data: function (ele, obj) {
            for (var x in obj) {
                ele.dataset[x] = obj[x];
            }
        },
        args: function (ele, obj) {
            if (obj.index !== undefined) {
                Error_1.error.add('Special', 'index has been use by Vir');
            }
            Object.assign(ele, obj);
        },
        style: function (ele, obj) {
            Object.assign(ele.style, obj);
        }
    };
    return Specail;
}());
// 分解成nodes 和 specails
var VirDomBreak = /** @class */ (function () {
    function VirDomBreak(obj, argsCtx) {
        this.nodes = [];
        this.specails = new Specail();
        if (argsCtx && argsCtx.args) {
            this.args = argsCtx.args;
        }
        else {
            argsCtx = {
                args: {}
            };
            this.args = argsCtx.args;
        }
        this.obj = obj;
        for (var x in obj) {
            if (!this.specails.add(x, obj[x])) {
                this.nodes.push(new VirNode(x, obj[x], argsCtx));
            }
        }
    }
    VirDomBreak.prototype.setParent = function (parentEle) {
        var _this = this;
        this.parentEle = parentEle;
        this.specails.attachToEle(parentEle);
        // appendChild from headEle
        this.nodes.forEach(function (virNode) {
            // 初始化的 // 接头 // 设置dom 域和css 域;
            virNode.getHTMLElement(parentEle, _this.css);
            // 连尾 // 可能由于arrayFollower 影响HeadELe
            virNode.connectFollower();
        });
    };
    VirDomBreak.prototype.setCss = function (css) {
        if (typeof css === 'object') {
            this.css = css;
        }
    };
    return VirDomBreak;
}());
exports.VirDomBreak = VirDomBreak;
/**
 * @example

 {
 }

 {
   "3* div > 3* div" : {
     $: []
   }
 }
  
 {
   "div": [
     {
       div: "nice"
     }
   ]
 }
 1. node 端
 2. VirEvNode

 */
/** bug.log
 *
 1-06 :
   1. $ array surport object;
   2. use null as 空
   3. on :: function
   4. no Index customer
   5. args type is HTMLElement[]

 */ 


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var quickJsDom = /** @class */ (function () {
    function quickJsDom(name) {
        this.nodeName = 'div';
        this.childrenlist = [];
        this.attribute = {};
        this.id = '';
        this.className = '';
        this.nodeName = name;
    }
    quickJsDom.prototype.appendChild = function (jsDomInstance) {
        this.childrenlist.push(jsDomInstance);
        jsDomInstance.parentElement = this;
    };
    quickJsDom.prototype.setAttribute = function (strName, value) {
        this.attribute[strName] = value;
    };
    Object.defineProperty(quickJsDom.prototype, "outerHTML", {
        get: function () {
            var atttributeStr = '';
            for (var x in this.attribute) {
                atttributeStr += " " + x + "=\"" + this.attribute[x] + "\"";
            }
            this.id && (atttributeStr += ' id="' + this.id + '"');
            this.className && (atttributeStr += ' class="' + this.className + '"');
            return "<" + this.nodeName + atttributeStr + ">" + this.innerHTML + "</" + this.nodeName + ">";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(quickJsDom.prototype, "innerHTML", {
        get: function () {
            var childrenStr = '';
            for (var _i = 0, _a = this.childrenlist; _i < _a.length; _i++) {
                var x = _a[_i];
                childrenStr += x.outerHTML;
            }
            return childrenStr;
        },
        set: function (value) {
            this.childrenlist = [{ outerHTML: value }];
        },
        enumerable: true,
        configurable: true
    });
    quickJsDom.create = function (name) {
        return new quickJsDom(name);
    };
    return quickJsDom;
}());
exports.quickJsDom = quickJsDom;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var str = {
    notFunc: '不是function'
};
exports.str = str;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 键盘的监听
 */
var keyCode = {
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "q": 81,
    "w": 87,
    "e": 69,
    "r": 82,
    "t": 84,
    "y": 89,
    "u": 85,
    "i": 73,
    "o": 79,
    "p": 80,
    "a": 65,
    "s": 83,
    "d": 68,
    "f": 70,
    "g": 71,
    "h": 72,
    "j": 74,
    "k": 75,
    "l": 76,
    "z": 90,
    "x": 88,
    "c": 67,
    "n": 78,
    "v": 86,
    "m": 77,
    "b": 66,
    ",": 188,
    "`": 192,
    "tab": 9,
    "capslock": 20,
    "escape": 27,
    "delete": 46,
    "insert": 45,
    "numlock": 144,
    "arrowdown": 40,
    "pagedown": 34,
    "end": 35,
    "clear": 12,
    "arrowleft": 37,
    "arrowright": 39,
    "home": 36,
    "pageup": 33,
    "+": 107,
    "-": 189,
    "*": 56,
    "/": 111,
    "enter": 13,
    "control": 17,
    "process": 229,
    "alt": 18,
    "contextmenu": 93,
    "backspace": 8,
    "arrowup": 38,
    "=": 187,
    "shift": 16,
    "(": 57,
    ")": 48,
    "&": 55,
    "%": 53,
    "^": 54,
    "#": 51,
    "$": 52,
    "@": 50,
    "!": 49,
    "_": 189,
    "meta": 91,
    " ": 32
};
exports.keyCode = keyCode;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 通过对象传递的事件的代理
 * @author Liumiao
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
var EventPool_1 = __webpack_require__(1);
function createSp() {
    var g = {
        targetObj: null,
        tartgetKey: '',
        curDep: ''
    };
    var ObjEvMap = new WeakMap();
    function getEv(fromObj) {
        if (ObjEvMap.has(fromObj)) {
            return ObjEvMap.get(fromObj);
        }
        else {
            var ev = new EventPool_1.EventPool();
            ObjEvMap.set(fromObj, ev);
            return ev;
        }
    }
    return getEv;
}
var Sp = createSp();
exports.Sp = Sp;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventPool_1 = __webpack_require__(1);
var HashURL = /** @class */ (function () {
    function HashURL() {
        var _this = this;
        this.ev = new EventPool_1.EventPool();
        this.fromHashChange = function (e) {
            _this.ev.done(location.hash, e);
            _this.ev.done(_this.hash, e);
        };
        this.hash = Symbol('hashchange');
        window.addEventListener('hashchange', this.fromHashChange);
        window.addEventListener('load', this.fromHashChange);
    }
    HashURL.prototype.at = function (str, cb) {
        var _this = this;
        return function (ele) {
            _this.ev.after(str, function () {
                cb(ele);
            });
            _this.ev.listenAll(_this.hash, function () {
                if (location.hash !== str) {
                    ele.innerHTML = '';
                }
            });
        };
    };
    HashURL.prototype.emit = function (str) {
        this.ev.done(str, '');
    };
    HashURL.prototype.onChange = function (cb) {
        var _this = this;
        return function (ele) {
            _this.ev.listen(_this.hash, function () {
                cb(ele, location.hash);
            });
        };
    };
    HashURL.prototype.remove = function () {
        window.removeEventListener('hashchange', this.fromHashChange);
        window.removeEventListener('load', this.fromHashChange);
    };
    return HashURL;
}());
exports.HashURL = HashURL;
// VirEvNode


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 用于测试的工具
 */
Object.defineProperty(exports, "__esModule", { value: true });
var js_1 = __webpack_require__(2);
var tes = {
    //查看属性值的改动情况
    watch: function (obj, prop) {
        if (typeof prop == "object") {
            var _loop_1 = function (onep) {
                js_1.js.watch(obj, onep, function (newV, oldV) {
                    if (typeof prop[onep] == "function") {
                        if (prop[onep].call(this, newV, oldV) === -1) {
                            console.log(onep + " is changed from", oldV, "to", newV);
                        }
                    }
                    else {
                        console.log(onep + " is changed from", oldV, "to", newV);
                    }
                });
            };
            for (var onep in prop) {
                _loop_1(onep);
            }
        }
        else {
            js_1.js.watch(obj, prop, function (newV, oldV) {
                console.log(prop + "is changed from", oldV, "to", newV);
            });
        }
    }
    //列出属性
    ,
    list: function (obj) {
        if (typeof obj == "string") {
            console.log(obj, window[obj]);
        }
        else {
            console.log(obj);
        }
    }
    //查找api
    ,
    find: function (obj, api, show) {
        if (api === void 0) { api = "none"; }
        if (show === void 0) { show = false; }
        console.log("Results for finding '" + api + "' in ", obj);
        var style = {
            gray: "color:#999;",
            args: "color:#f3c;",
            blue: "color:#33f;",
            black: "color:#e60;",
            gYellow: "color:#8a3;"
        };
        var typeColor = {
            "function": style.blue,
            "object": style.gYellow
        };
        var getType = {
            "object": "%O"
        };
        var num = 0;
        try {
            var reg = new RegExp(api);
        }
        catch (e) {
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
                        }
                        else {
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
};
exports.tes = tes;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var State_1 = __webpack_require__(7);
var Error_1 = __webpack_require__(0);
var EventPool_1 = __webpack_require__(1);
function ApiFactory(state, transformer) {
    return /** @class */ (function () {
        function Api(op) {
        }
        Api.prototype.afterDone = function (cb) {
            var _this = this;
            this.namespace && state.ev.after(this.namespace, function (res) {
                // 使用state 记录 res;
                state.setState(_this.namespace, res);
                // 
                cb(res);
            });
        };
        Api.prototype.update = function (data) {
            var _this = this;
            var opData = data;
            transformer(this.op, data).then(function (res) { state.ev.done(_this.namespace, res); }, function (e) { Error_1.error.add('Api', e); });
        };
        Api.prototype.setNameSpace = function (str) {
            if (str) {
                this.namespace = str;
                state.createNameSpace(str);
            } // else {}
        };
        Api.prototype.getAllState = function () {
            return state;
        };
        return Api;
    }());
}
exports.ApiFactory = ApiFactory;
function compileApi(api) {
    for (var x in api) {
        api[x].setNameSpace(x);
    }
    return api;
}
exports.compileApi = compileApi;
// example
var apiState = new State_1.State();
var Api = ApiFactory(apiState, // State record
// how to deal with option and update data;
function (op, update) {
    return $.ajax({
        url: op.src[0],
        method: op.src[1],
        data: __assign({}, op.data, update)
    });
});
exports.Api = Api;
var Spi = /** @class */ (function () {
    function Spi(obj) {
        this.ev = new EventPool_1.EventPool();
        this.sy = Symbol();
        this.obj = obj;
    }
    Spi.prototype.updata = function (obj) {
        if (typeof obj === 'function') {
            this.ev.done(this.sy, obj(this.obj));
        }
        else {
            Object.assign(this.obj, obj);
            this.ev.done(this.sy, this.obj);
        }
    };
    Spi.prototype.afterDone = function (callBack) {
        this.ev.after(this.sy, callBack);
    };
    return Spi;
}());
exports.Spi = Spi;
/**
 * typescript
 * 1. 类型的精化, 范式验证, 精确使用, Partial<T>
 * 2. 引用函数的返回类型
 */
/**
 * 1. 如何标注responseJSON 的类型
 * 2. 需要和可以传的参数
 * 3. 如何集中的管理api
 * 4. 减少依赖, 枢纽的代码独立!
 * 5. 查看state, 可以快速知道异步的完成情况
 *
 * apiManeger 的 范式 ok
 * 1. 同过ApiFactory 的改变可重构Api 的方式
 * 2. 支持的事件 1. afterDone, 2. loop, 3. update, 4. then, 5. restart
 */
/**
 * 面向对象, 继承,依赖没毛病
 * java 的factory 类??
 */ 


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Error_1 = __webpack_require__(0);
// 记录每一步函数的运行, 通过代理记录操作的情况
var Record = /** @class */ (function () {
    function Record(record, history, length) {
        if (record === void 0) { record = {}; }
        if (history === void 0) { history = false; }
        if (length === void 0) { length = 10; }
        this.proxyObj = {};
        this.record = record;
        this.recordHistory = history;
        this.maxHistoryLength = length;
        if (this.recordHistory) {
            this.historyPath = {};
        }
    }
    Record.prototype.add = function (code, obj) {
        var _this = this;
        if (obj === undefined) {
            obj = code;
            for (var x in obj) {
                this.add(x, obj[x]);
            }
        }
        else {
            if (this.proxyObj[code] !== undefined) {
                Error_1.error.add('Record', "Can't add same code in record");
            }
            else {
                this.proxyObj[code];
                this.record[code] = {};
                this.recordHistory && (this.historyPath[code] = []);
                this.proxyObj[code] = new Proxy(obj, {
                    get: function (target, name) {
                        // when you get function from target
                        // this lost!!!
                        if (typeof target[name] === 'function') {
                            return function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                _this.recordHistory && (_this.setHistory(code, name, args));
                                // record the args that you send to function
                                _this.record[code][name] = args;
                                // 防止 this lost!!
                                return target[name].apply(target, args);
                            };
                        }
                        else {
                            return target[name];
                        }
                    },
                    set: function (target, name) {
                        Error_1.error.add('record', 'can\'t set value to record, please call a function');
                        return false;
                    }
                });
            }
        }
    };
    Record.prototype.at = function (code) {
        if (typeof this.proxyObj[code] === 'object') {
            return this.proxyObj[code];
        }
        else {
            Error_1.error.add('Record', 'can\'t get this code at record');
            return undefined;
        }
    };
    Record.prototype.getRecord = function () {
        return this.record;
    };
    Record.prototype.historySnapshoot = function (code) {
        return this.historyPath[code].map(function (e) { return e; });
    };
    Record.prototype.setHistory = function (code, name, args) {
        this.historyPath[code].push({
            caller: name,
            value: args,
            code: code
        });
        if (this.historyPath[code].length > this.maxHistoryLength) {
            this.historyPath[code].shift();
        }
    };
    return Record;
}());
exports.Record = Record;
var refHandle = {
    get: function (target, name) {
        return target.at(name);
    }
};
function createRefer(record) {
    return function Refer(obj) {
        record.add(obj);
        var ref = new Proxy(record, refHandle);
        return ref;
    };
}
exports.createRefer = createRefer;
/*
const store = new Record();
const ref = createRefer(store);
*/
/**
 * record manager protect obj
 */ 


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Selector = /** @class */ (function () {
    function Selector(op) {
        this.curId = undefined;
        Object.assign(this, op);
    }
    Selector.prototype.select = function (id) {
        if (this.curId !== undefined) {
            this.outFunc(this.region[this.curId]);
        }
        this.curId = id;
        this.inFunc(this.region[this.curId]);
    };
    Selector.prototype.inFunc = function (ele) { };
    Selector.prototype.outFunc = function (ele) { };
    return Selector;
}());
exports.Selector = Selector;
var DomPageSelector = /** @class */ (function (_super) {
    __extends(DomPageSelector, _super);
    function DomPageSelector(op) {
        return _super.call(this, op) || this;
    }
    DomPageSelector.prototype.inFunc = function (ele) {
        ele.style.display = 'block';
    };
    DomPageSelector.prototype.outFunc = function (ele) {
        ele.style.display = 'none';
    };
    return DomPageSelector;
}(Selector));
exports.DomPageSelector = DomPageSelector;


/***/ })
/******/ ]);
});
//# sourceMappingURL=vir.js.map