(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _layout = require('./views/layout');

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Marionette.Application.extend({
	region: '.app',
	initialize: function initialize() {
		this.tmpCache = {};
	},
	start: function start() {
		this.showView(new _layout2.default());
	},
	ajax: function ajax(options) {
		var params = _.extend({
			url: '',
			type: 'POST',
			data: {},
			dataType: 'json',
			callback: function callback(resp) {
				// console.log('ajax resp')
			}
		}, options);

		return new Promise(function (resolve, reject) {

			$.ajax({
				url: params.url,
				type: params.type,
				data: params.data,
				dataType: params.dataType
			}).always(function (response, status) {
				if (status === 'error') {
					reject(response);
				}

				if (status === 'success') {
					if ((typeof response === 'undefined' ? 'undefined' : _typeof(response)) === 'object' && response.code != 200) {
						if (response.message) {
							reject(response);
						}
					}
					params.callback(response);
					resolve(response);
				}
			});
		}).catch(function (response) {
			if (response.message) {
				//If token invalid - logout user
				if (response.code === 401) {
					App.Router.navigate('/', true);
				}

				alert(response.toString());
			}
		});
	}
});

},{"./views/layout":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _handlebarsV = require('../libs/handlebars-v4.0.10');

var _handlebarsV2 = _interopRequireDefault(_handlebarsV);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HbView = Marionette.Behavior.extend({
    loaded: false,
    initialize: function initialize(options) {
        var _this = this;

        var HBTemplate = this.view.HBTemplate;

        this.view._loadTemplate = false;

        //Get path template
        if (!HBTemplate) return console.warn("HBTemplate is not defined");
        //Check cache obj
        if (App.tmpCache[HBTemplate] == undefined) {
            return App.tmpCache[HBTemplate] = App.ajax({
                type: 'GET',
                url: HBTemplate,
                dataType: 'text'
            }).then(function (resp) {
                //Add to cache
                if (!_this.view.isDestroyed()) {
                    App.tmpCache[HBTemplate] = resp;
                    _this.setTemplate(App.tmpCache[HBTemplate]);
                    if (_.isFunction(_this.view.onLoadTemplate)) _this.view.onLoadTemplate();
                    _this.loaded = true;
                }

                return new Promise(function (resolve, reject) {
                    return resolve(resp);
                });
            });
        }
        //Check current running Promise
        if (_.isFunction(App.tmpCache[HBTemplate].then)) {
            App.tmpCache[HBTemplate].then(function (resp) {
                //Add to cache
                App.tmpCache[HBTemplate] = resp;
                _this.setTemplate(App.tmpCache[HBTemplate]);
                if (_.isFunction(_this.view.onLoadTemplate)) _this.view.onLoadTemplate();
                _this.loaded = true;
            });
            //Template loaded, just set template
        } else {
            this.loaded = true;
            this.setTemplate(App.tmpCache[HBTemplate]);
        }
    },
    setTemplate: function setTemplate(template) {
        var tmp = _handlebarsV2.default.compile(template);
        this.view.template = function (data) {
            return tmp(data);
        };
        this.view._loadTemplate = true;
    },
    onAttach: function onAttach() {
        if (_.isFunction(this.view.onLoadTemplate) && this.loaded === true) this.view.onLoadTemplate();
    }
});

exports.default = HbView;

},{"../libs/handlebars-v4.0.10":4}],3:[function(require,module,exports){
'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
    window.App = new _app2.default();
    App.start();
});

},{"./app":1}],4:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**!

 @license
 handlebars v4.0.10

Copyright (C) 2011-2016 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
(function webpackUniversalModuleDefinition(root, factory) {
	if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define([], factory);else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["Handlebars"] = factory();else root["Handlebars"] = factory();
})(undefined, function () {
	return (/******/function (modules) {
			// webpackBootstrap
			/******/ // The module cache
			/******/var installedModules = {};

			/******/ // The require function
			/******/function __webpack_require__(moduleId) {

				/******/ // Check if module is in cache
				/******/if (installedModules[moduleId])
					/******/return installedModules[moduleId].exports;

				/******/ // Create a new module (and put it into the cache)
				/******/var module = installedModules[moduleId] = {
					/******/exports: {},
					/******/id: moduleId,
					/******/loaded: false
					/******/ };

				/******/ // Execute the module function
				/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

				/******/ // Flag the module as loaded
				/******/module.loaded = true;

				/******/ // Return the exports of the module
				/******/return module.exports;
				/******/
			}

			/******/ // expose the modules object (__webpack_modules__)
			/******/__webpack_require__.m = modules;

			/******/ // expose the module cache
			/******/__webpack_require__.c = installedModules;

			/******/ // __webpack_public_path__
			/******/__webpack_require__.p = "";

			/******/ // Load entry module and return exports
			/******/return __webpack_require__(0);
			/******/
		}(
		/************************************************************************/
		/******/[
		/* 0 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;

			var _handlebarsRuntime = __webpack_require__(2);

			var _handlebarsRuntime2 = _interopRequireDefault(_handlebarsRuntime);

			// Compiler imports

			var _handlebarsCompilerAst = __webpack_require__(35);

			var _handlebarsCompilerAst2 = _interopRequireDefault(_handlebarsCompilerAst);

			var _handlebarsCompilerBase = __webpack_require__(36);

			var _handlebarsCompilerCompiler = __webpack_require__(41);

			var _handlebarsCompilerJavascriptCompiler = __webpack_require__(42);

			var _handlebarsCompilerJavascriptCompiler2 = _interopRequireDefault(_handlebarsCompilerJavascriptCompiler);

			var _handlebarsCompilerVisitor = __webpack_require__(39);

			var _handlebarsCompilerVisitor2 = _interopRequireDefault(_handlebarsCompilerVisitor);

			var _handlebarsNoConflict = __webpack_require__(34);

			var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

			var _create = _handlebarsRuntime2['default'].create;
			function create() {
				var hb = _create();

				hb.compile = function (input, options) {
					return _handlebarsCompilerCompiler.compile(input, options, hb);
				};
				hb.precompile = function (input, options) {
					return _handlebarsCompilerCompiler.precompile(input, options, hb);
				};

				hb.AST = _handlebarsCompilerAst2['default'];
				hb.Compiler = _handlebarsCompilerCompiler.Compiler;
				hb.JavaScriptCompiler = _handlebarsCompilerJavascriptCompiler2['default'];
				hb.Parser = _handlebarsCompilerBase.parser;
				hb.parse = _handlebarsCompilerBase.parse;

				return hb;
			}

			var inst = create();
			inst.create = create;

			_handlebarsNoConflict2['default'](inst);

			inst.Visitor = _handlebarsCompilerVisitor2['default'];

			inst['default'] = inst;

			exports['default'] = inst;
			module.exports = exports['default'];

			/***/
		},
		/* 1 */
		/***/function (module, exports) {

			"use strict";

			exports["default"] = function (obj) {
				return obj && obj.__esModule ? obj : {
					"default": obj
				};
			};

			exports.__esModule = true;

			/***/
		},
		/* 2 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireWildcard = __webpack_require__(3)['default'];

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;

			var _handlebarsBase = __webpack_require__(4);

			var base = _interopRequireWildcard(_handlebarsBase);

			// Each of these augment the Handlebars object. No need to setup here.
			// (This is done to easily share code between commonjs and browse envs)

			var _handlebarsSafeString = __webpack_require__(21);

			var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

			var _handlebarsException = __webpack_require__(6);

			var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

			var _handlebarsUtils = __webpack_require__(5);

			var Utils = _interopRequireWildcard(_handlebarsUtils);

			var _handlebarsRuntime = __webpack_require__(22);

			var runtime = _interopRequireWildcard(_handlebarsRuntime);

			var _handlebarsNoConflict = __webpack_require__(34);

			var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

			// For compatibility and usage outside of module systems, make the Handlebars object a namespace
			function create() {
				var hb = new base.HandlebarsEnvironment();

				Utils.extend(hb, base);
				hb.SafeString = _handlebarsSafeString2['default'];
				hb.Exception = _handlebarsException2['default'];
				hb.Utils = Utils;
				hb.escapeExpression = Utils.escapeExpression;

				hb.VM = runtime;
				hb.template = function (spec) {
					return runtime.template(spec, hb);
				};

				return hb;
			}

			var inst = create();
			inst.create = create;

			_handlebarsNoConflict2['default'](inst);

			inst['default'] = inst;

			exports['default'] = inst;
			module.exports = exports['default'];

			/***/
		},
		/* 3 */
		/***/function (module, exports) {

			"use strict";

			exports["default"] = function (obj) {
				if (obj && obj.__esModule) {
					return obj;
				} else {
					var newObj = {};

					if (obj != null) {
						for (var key in obj) {
							if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
						}
					}

					newObj["default"] = obj;
					return newObj;
				}
			};

			exports.__esModule = true;

			/***/
		},
		/* 4 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;
			exports.HandlebarsEnvironment = HandlebarsEnvironment;

			var _utils = __webpack_require__(5);

			var _exception = __webpack_require__(6);

			var _exception2 = _interopRequireDefault(_exception);

			var _helpers = __webpack_require__(10);

			var _decorators = __webpack_require__(18);

			var _logger = __webpack_require__(20);

			var _logger2 = _interopRequireDefault(_logger);

			var VERSION = '4.0.10';
			exports.VERSION = VERSION;
			var COMPILER_REVISION = 7;

			exports.COMPILER_REVISION = COMPILER_REVISION;
			var REVISION_CHANGES = {
				1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
				2: '== 1.0.0-rc.3',
				3: '== 1.0.0-rc.4',
				4: '== 1.x.x',
				5: '== 2.0.0-alpha.x',
				6: '>= 2.0.0-beta.1',
				7: '>= 4.0.0'
			};

			exports.REVISION_CHANGES = REVISION_CHANGES;
			var objectType = '[object Object]';

			function HandlebarsEnvironment(helpers, partials, decorators) {
				this.helpers = helpers || {};
				this.partials = partials || {};
				this.decorators = decorators || {};

				_helpers.registerDefaultHelpers(this);
				_decorators.registerDefaultDecorators(this);
			}

			HandlebarsEnvironment.prototype = {
				constructor: HandlebarsEnvironment,

				logger: _logger2['default'],
				log: _logger2['default'].log,

				registerHelper: function registerHelper(name, fn) {
					if (_utils.toString.call(name) === objectType) {
						if (fn) {
							throw new _exception2['default']('Arg not supported with multiple helpers');
						}
						_utils.extend(this.helpers, name);
					} else {
						this.helpers[name] = fn;
					}
				},
				unregisterHelper: function unregisterHelper(name) {
					delete this.helpers[name];
				},

				registerPartial: function registerPartial(name, partial) {
					if (_utils.toString.call(name) === objectType) {
						_utils.extend(this.partials, name);
					} else {
						if (typeof partial === 'undefined') {
							throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
						}
						this.partials[name] = partial;
					}
				},
				unregisterPartial: function unregisterPartial(name) {
					delete this.partials[name];
				},

				registerDecorator: function registerDecorator(name, fn) {
					if (_utils.toString.call(name) === objectType) {
						if (fn) {
							throw new _exception2['default']('Arg not supported with multiple decorators');
						}
						_utils.extend(this.decorators, name);
					} else {
						this.decorators[name] = fn;
					}
				},
				unregisterDecorator: function unregisterDecorator(name) {
					delete this.decorators[name];
				}
			};

			var log = _logger2['default'].log;

			exports.log = log;
			exports.createFrame = _utils.createFrame;
			exports.logger = _logger2['default'];

			/***/
		},
		/* 5 */
		/***/function (module, exports) {

			'use strict';

			exports.__esModule = true;
			exports.extend = extend;
			exports.indexOf = indexOf;
			exports.escapeExpression = escapeExpression;
			exports.isEmpty = isEmpty;
			exports.createFrame = createFrame;
			exports.blockParams = blockParams;
			exports.appendContextPath = appendContextPath;
			var escape = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#x27;',
				'`': '&#x60;',
				'=': '&#x3D;'
			};

			var badChars = /[&<>"'`=]/g,
			    possible = /[&<>"'`=]/;

			function escapeChar(chr) {
				return escape[chr];
			}

			function extend(obj /* , ...source */) {
				for (var i = 1; i < arguments.length; i++) {
					for (var key in arguments[i]) {
						if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
							obj[key] = arguments[i][key];
						}
					}
				}

				return obj;
			}

			var toString = Object.prototype.toString;

			exports.toString = toString;
			// Sourced from lodash
			// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
			/* eslint-disable func-style */
			var isFunction = function isFunction(value) {
				return typeof value === 'function';
			};
			// fallback for older versions of Chrome and Safari
			/* istanbul ignore next */
			if (isFunction(/x/)) {
				exports.isFunction = isFunction = function isFunction(value) {
					return typeof value === 'function' && toString.call(value) === '[object Function]';
				};
			}
			exports.isFunction = isFunction;

			/* eslint-enable func-style */

			/* istanbul ignore next */
			var isArray = Array.isArray || function (value) {
				return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? toString.call(value) === '[object Array]' : false;
			};

			exports.isArray = isArray;
			// Older IE versions do not directly support indexOf so we must implement our own, sadly.

			function indexOf(array, value) {
				for (var i = 0, len = array.length; i < len; i++) {
					if (array[i] === value) {
						return i;
					}
				}
				return -1;
			}

			function escapeExpression(string) {
				if (typeof string !== 'string') {
					// don't escape SafeStrings, since they're already safe
					if (string && string.toHTML) {
						return string.toHTML();
					} else if (string == null) {
						return '';
					} else if (!string) {
						return string + '';
					}

					// Force a string conversion as this will be done by the append regardless and
					// the regex test will do this transparently behind the scenes, causing issues if
					// an object's to string has escaped characters in it.
					string = '' + string;
				}

				if (!possible.test(string)) {
					return string;
				}
				return string.replace(badChars, escapeChar);
			}

			function isEmpty(value) {
				if (!value && value !== 0) {
					return true;
				} else if (isArray(value) && value.length === 0) {
					return true;
				} else {
					return false;
				}
			}

			function createFrame(object) {
				var frame = extend({}, object);
				frame._parent = object;
				return frame;
			}

			function blockParams(params, ids) {
				params.path = ids;
				return params;
			}

			function appendContextPath(contextPath, id) {
				return (contextPath ? contextPath + '.' : '') + id;
			}

			/***/
		},
		/* 6 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _Object$defineProperty = __webpack_require__(7)['default'];

			exports.__esModule = true;

			var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

			function Exception(message, node) {
				var loc = node && node.loc,
				    line = undefined,
				    column = undefined;
				if (loc) {
					line = loc.start.line;
					column = loc.start.column;

					message += ' - ' + line + ':' + column;
				}

				var tmp = Error.prototype.constructor.call(this, message);

				// Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
				for (var idx = 0; idx < errorProps.length; idx++) {
					this[errorProps[idx]] = tmp[errorProps[idx]];
				}

				/* istanbul ignore else */
				if (Error.captureStackTrace) {
					Error.captureStackTrace(this, Exception);
				}

				try {
					if (loc) {
						this.lineNumber = line;

						// Work around issue under safari where we can't directly set the column value
						/* istanbul ignore next */
						if (_Object$defineProperty) {
							Object.defineProperty(this, 'column', {
								value: column,
								enumerable: true
							});
						} else {
							this.column = column;
						}
					}
				} catch (nop) {
					/* Ignore if the browser is very particular */
				}
			}

			Exception.prototype = new Error();

			exports['default'] = Exception;
			module.exports = exports['default'];

			/***/
		},
		/* 7 */
		/***/function (module, exports, __webpack_require__) {

			module.exports = { "default": __webpack_require__(8), __esModule: true };

			/***/
		},
		/* 8 */
		/***/function (module, exports, __webpack_require__) {

			var $ = __webpack_require__(9);
			module.exports = function defineProperty(it, key, desc) {
				return $.setDesc(it, key, desc);
			};

			/***/
		},
		/* 9 */
		/***/function (module, exports) {

			var $Object = Object;
			module.exports = {
				create: $Object.create,
				getProto: $Object.getPrototypeOf,
				isEnum: {}.propertyIsEnumerable,
				getDesc: $Object.getOwnPropertyDescriptor,
				setDesc: $Object.defineProperty,
				setDescs: $Object.defineProperties,
				getKeys: $Object.keys,
				getNames: $Object.getOwnPropertyNames,
				getSymbols: $Object.getOwnPropertySymbols,
				each: [].forEach
			};

			/***/
		},
		/* 10 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;
			exports.registerDefaultHelpers = registerDefaultHelpers;

			var _helpersBlockHelperMissing = __webpack_require__(11);

			var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

			var _helpersEach = __webpack_require__(12);

			var _helpersEach2 = _interopRequireDefault(_helpersEach);

			var _helpersHelperMissing = __webpack_require__(13);

			var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

			var _helpersIf = __webpack_require__(14);

			var _helpersIf2 = _interopRequireDefault(_helpersIf);

			var _helpersLog = __webpack_require__(15);

			var _helpersLog2 = _interopRequireDefault(_helpersLog);

			var _helpersLookup = __webpack_require__(16);

			var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

			var _helpersWith = __webpack_require__(17);

			var _helpersWith2 = _interopRequireDefault(_helpersWith);

			function registerDefaultHelpers(instance) {
				_helpersBlockHelperMissing2['default'](instance);
				_helpersEach2['default'](instance);
				_helpersHelperMissing2['default'](instance);
				_helpersIf2['default'](instance);
				_helpersLog2['default'](instance);
				_helpersLookup2['default'](instance);
				_helpersWith2['default'](instance);
			}

			/***/
		},
		/* 11 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			exports.__esModule = true;

			var _utils = __webpack_require__(5);

			exports['default'] = function (instance) {
				instance.registerHelper('blockHelperMissing', function (context, options) {
					var inverse = options.inverse,
					    fn = options.fn;

					if (context === true) {
						return fn(this);
					} else if (context === false || context == null) {
						return inverse(this);
					} else if (_utils.isArray(context)) {
						if (context.length > 0) {
							if (options.ids) {
								options.ids = [options.name];
							}

							return instance.helpers.each(context, options);
						} else {
							return inverse(this);
						}
					} else {
						if (options.data && options.ids) {
							var data = _utils.createFrame(options.data);
							data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
							options = { data: data };
						}

						return fn(context, options);
					}
				});
			};

			module.exports = exports['default'];

			/***/
		},
		/* 12 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;

			var _utils = __webpack_require__(5);

			var _exception = __webpack_require__(6);

			var _exception2 = _interopRequireDefault(_exception);

			exports['default'] = function (instance) {
				instance.registerHelper('each', function (context, options) {
					if (!options) {
						throw new _exception2['default']('Must pass iterator to #each');
					}

					var fn = options.fn,
					    inverse = options.inverse,
					    i = 0,
					    ret = '',
					    data = undefined,
					    contextPath = undefined;

					if (options.data && options.ids) {
						contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
					}

					if (_utils.isFunction(context)) {
						context = context.call(this);
					}

					if (options.data) {
						data = _utils.createFrame(options.data);
					}

					function execIteration(field, index, last) {
						if (data) {
							data.key = field;
							data.index = index;
							data.first = index === 0;
							data.last = !!last;

							if (contextPath) {
								data.contextPath = contextPath + field;
							}
						}

						ret = ret + fn(context[field], {
							data: data,
							blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
						});
					}

					if (context && (typeof context === 'undefined' ? 'undefined' : _typeof(context)) === 'object') {
						if (_utils.isArray(context)) {
							for (var j = context.length; i < j; i++) {
								if (i in context) {
									execIteration(i, i, i === context.length - 1);
								}
							}
						} else {
							var priorKey = undefined;

							for (var key in context) {
								if (context.hasOwnProperty(key)) {
									// We're running the iterations one step out of sync so we can detect
									// the last iteration without have to scan the object twice and create
									// an itermediate keys array.
									if (priorKey !== undefined) {
										execIteration(priorKey, i - 1);
									}
									priorKey = key;
									i++;
								}
							}
							if (priorKey !== undefined) {
								execIteration(priorKey, i - 1, true);
							}
						}
					}

					if (i === 0) {
						ret = inverse(this);
					}

					return ret;
				});
			};

			module.exports = exports['default'];

			/***/
		},
		/* 13 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;

			var _exception = __webpack_require__(6);

			var _exception2 = _interopRequireDefault(_exception);

			exports['default'] = function (instance) {
				instance.registerHelper('helperMissing', function () /* [args, ]options */{
					if (arguments.length === 1) {
						// A missing field in a {{foo}} construct.
						return undefined;
					} else {
						// Someone is actually trying to call something, blow up.
						throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
					}
				});
			};

			module.exports = exports['default'];

			/***/
		},
		/* 14 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			exports.__esModule = true;

			var _utils = __webpack_require__(5);

			exports['default'] = function (instance) {
				instance.registerHelper('if', function (conditional, options) {
					if (_utils.isFunction(conditional)) {
						conditional = conditional.call(this);
					}

					// Default behavior is to render the positive path if the value is truthy and not empty.
					// The `includeZero` option may be set to treat the condtional as purely not empty based on the
					// behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
					if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
						return options.inverse(this);
					} else {
						return options.fn(this);
					}
				});

				instance.registerHelper('unless', function (conditional, options) {
					return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
				});
			};

			module.exports = exports['default'];

			/***/
		},
		/* 15 */
		/***/function (module, exports) {

			'use strict';

			exports.__esModule = true;

			exports['default'] = function (instance) {
				instance.registerHelper('log', function () /* message, options */{
					var args = [undefined],
					    options = arguments[arguments.length - 1];
					for (var i = 0; i < arguments.length - 1; i++) {
						args.push(arguments[i]);
					}

					var level = 1;
					if (options.hash.level != null) {
						level = options.hash.level;
					} else if (options.data && options.data.level != null) {
						level = options.data.level;
					}
					args[0] = level;

					instance.log.apply(instance, args);
				});
			};

			module.exports = exports['default'];

			/***/
		},
		/* 16 */
		/***/function (module, exports) {

			'use strict';

			exports.__esModule = true;

			exports['default'] = function (instance) {
				instance.registerHelper('lookup', function (obj, field) {
					return obj && obj[field];
				});
			};

			module.exports = exports['default'];

			/***/
		},
		/* 17 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			exports.__esModule = true;

			var _utils = __webpack_require__(5);

			exports['default'] = function (instance) {
				instance.registerHelper('with', function (context, options) {
					if (_utils.isFunction(context)) {
						context = context.call(this);
					}

					var fn = options.fn;

					if (!_utils.isEmpty(context)) {
						var data = options.data;
						if (options.data && options.ids) {
							data = _utils.createFrame(options.data);
							data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
						}

						return fn(context, {
							data: data,
							blockParams: _utils.blockParams([context], [data && data.contextPath])
						});
					} else {
						return options.inverse(this);
					}
				});
			};

			module.exports = exports['default'];

			/***/
		},
		/* 18 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;
			exports.registerDefaultDecorators = registerDefaultDecorators;

			var _decoratorsInline = __webpack_require__(19);

			var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

			function registerDefaultDecorators(instance) {
				_decoratorsInline2['default'](instance);
			}

			/***/
		},
		/* 19 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			exports.__esModule = true;

			var _utils = __webpack_require__(5);

			exports['default'] = function (instance) {
				instance.registerDecorator('inline', function (fn, props, container, options) {
					var ret = fn;
					if (!props.partials) {
						props.partials = {};
						ret = function ret(context, options) {
							// Create a new partials stack frame prior to exec.
							var original = container.partials;
							container.partials = _utils.extend({}, original, props.partials);
							var ret = fn(context, options);
							container.partials = original;
							return ret;
						};
					}

					props.partials[options.args[0]] = options.fn;

					return ret;
				});
			};

			module.exports = exports['default'];

			/***/
		},
		/* 20 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			exports.__esModule = true;

			var _utils = __webpack_require__(5);

			var logger = {
				methodMap: ['debug', 'info', 'warn', 'error'],
				level: 'info',

				// Maps a given level value to the `methodMap` indexes above.
				lookupLevel: function lookupLevel(level) {
					if (typeof level === 'string') {
						var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
						if (levelMap >= 0) {
							level = levelMap;
						} else {
							level = parseInt(level, 10);
						}
					}

					return level;
				},

				// Can be overridden in the host environment
				log: function log(level) {
					level = logger.lookupLevel(level);

					if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
						var method = logger.methodMap[level];
						if (!console[method]) {
							// eslint-disable-line no-console
							method = 'log';
						}

						for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
							message[_key - 1] = arguments[_key];
						}

						console[method].apply(console, message); // eslint-disable-line no-console
					}
				}
			};

			exports['default'] = logger;
			module.exports = exports['default'];

			/***/
		},
		/* 21 */
		/***/function (module, exports) {

			// Build out our basic SafeString type
			'use strict';

			exports.__esModule = true;
			function SafeString(string) {
				this.string = string;
			}

			SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
				return '' + this.string;
			};

			exports['default'] = SafeString;
			module.exports = exports['default'];

			/***/
		},
		/* 22 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _Object$seal = __webpack_require__(23)['default'];

			var _interopRequireWildcard = __webpack_require__(3)['default'];

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;
			exports.checkRevision = checkRevision;
			exports.template = template;
			exports.wrapProgram = wrapProgram;
			exports.resolvePartial = resolvePartial;
			exports.invokePartial = invokePartial;
			exports.noop = noop;

			var _utils = __webpack_require__(5);

			var Utils = _interopRequireWildcard(_utils);

			var _exception = __webpack_require__(6);

			var _exception2 = _interopRequireDefault(_exception);

			var _base = __webpack_require__(4);

			function checkRevision(compilerInfo) {
				var compilerRevision = compilerInfo && compilerInfo[0] || 1,
				    currentRevision = _base.COMPILER_REVISION;

				if (compilerRevision !== currentRevision) {
					if (compilerRevision < currentRevision) {
						var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
						    compilerVersions = _base.REVISION_CHANGES[compilerRevision];
						throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
					} else {
						// Use the embedded version info since the runtime doesn't know about this revision yet
						throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
					}
				}
			}

			function template(templateSpec, env) {
				/* istanbul ignore next */
				if (!env) {
					throw new _exception2['default']('No environment passed to template');
				}
				if (!templateSpec || !templateSpec.main) {
					throw new _exception2['default']('Unknown template object: ' + (typeof templateSpec === 'undefined' ? 'undefined' : _typeof(templateSpec)));
				}

				templateSpec.main.decorator = templateSpec.main_d;

				// Note: Using env.VM references rather than local var references throughout this section to allow
				// for external users to override these as psuedo-supported APIs.
				env.VM.checkRevision(templateSpec.compiler);

				function invokePartialWrapper(partial, context, options) {
					if (options.hash) {
						context = Utils.extend({}, context, options.hash);
						if (options.ids) {
							options.ids[0] = true;
						}
					}

					partial = env.VM.resolvePartial.call(this, partial, context, options);
					var result = env.VM.invokePartial.call(this, partial, context, options);

					if (result == null && env.compile) {
						options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
						result = options.partials[options.name](context, options);
					}
					if (result != null) {
						if (options.indent) {
							var lines = result.split('\n');
							for (var i = 0, l = lines.length; i < l; i++) {
								if (!lines[i] && i + 1 === l) {
									break;
								}

								lines[i] = options.indent + lines[i];
							}
							result = lines.join('\n');
						}
						return result;
					} else {
						throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
					}
				}

				// Just add water
				var container = {
					strict: function strict(obj, name) {
						if (!(name in obj)) {
							throw new _exception2['default']('"' + name + '" not defined in ' + obj);
						}
						return obj[name];
					},
					lookup: function lookup(depths, name) {
						var len = depths.length;
						for (var i = 0; i < len; i++) {
							if (depths[i] && depths[i][name] != null) {
								return depths[i][name];
							}
						}
					},
					lambda: function lambda(current, context) {
						return typeof current === 'function' ? current.call(context) : current;
					},

					escapeExpression: Utils.escapeExpression,
					invokePartial: invokePartialWrapper,

					fn: function fn(i) {
						var ret = templateSpec[i];
						ret.decorator = templateSpec[i + '_d'];
						return ret;
					},

					programs: [],
					program: function program(i, data, declaredBlockParams, blockParams, depths) {
						var programWrapper = this.programs[i],
						    fn = this.fn(i);
						if (data || depths || blockParams || declaredBlockParams) {
							programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
						} else if (!programWrapper) {
							programWrapper = this.programs[i] = wrapProgram(this, i, fn);
						}
						return programWrapper;
					},

					data: function data(value, depth) {
						while (value && depth--) {
							value = value._parent;
						}
						return value;
					},
					merge: function merge(param, common) {
						var obj = param || common;

						if (param && common && param !== common) {
							obj = Utils.extend({}, common, param);
						}

						return obj;
					},
					// An empty object to use as replacement for null-contexts
					nullContext: _Object$seal({}),

					noop: env.VM.noop,
					compilerInfo: templateSpec.compiler
				};

				function ret(context) {
					var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

					var data = options.data;

					ret._setup(options);
					if (!options.partial && templateSpec.useData) {
						data = initData(context, data);
					}
					var depths = undefined,
					    blockParams = templateSpec.useBlockParams ? [] : undefined;
					if (templateSpec.useDepths) {
						if (options.depths) {
							depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
						} else {
							depths = [context];
						}
					}

					function main(context /*, options*/) {
						return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
					}
					main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
					return main(context, options);
				}
				ret.isTop = true;

				ret._setup = function (options) {
					if (!options.partial) {
						container.helpers = container.merge(options.helpers, env.helpers);

						if (templateSpec.usePartial) {
							container.partials = container.merge(options.partials, env.partials);
						}
						if (templateSpec.usePartial || templateSpec.useDecorators) {
							container.decorators = container.merge(options.decorators, env.decorators);
						}
					} else {
						container.helpers = options.helpers;
						container.partials = options.partials;
						container.decorators = options.decorators;
					}
				};

				ret._child = function (i, data, blockParams, depths) {
					if (templateSpec.useBlockParams && !blockParams) {
						throw new _exception2['default']('must pass block params');
					}
					if (templateSpec.useDepths && !depths) {
						throw new _exception2['default']('must pass parent depths');
					}

					return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
				};
				return ret;
			}

			function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
				function prog(context) {
					var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

					var currentDepths = depths;
					if (depths && context != depths[0] && !(context === container.nullContext && depths[0] === null)) {
						currentDepths = [context].concat(depths);
					}

					return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
				}

				prog = executeDecorators(fn, prog, container, depths, data, blockParams);

				prog.program = i;
				prog.depth = depths ? depths.length : 0;
				prog.blockParams = declaredBlockParams || 0;
				return prog;
			}

			function resolvePartial(partial, context, options) {
				if (!partial) {
					if (options.name === '@partial-block') {
						partial = options.data['partial-block'];
					} else {
						partial = options.partials[options.name];
					}
				} else if (!partial.call && !options.name) {
					// This is a dynamic partial that returned a string
					options.name = partial;
					partial = options.partials[partial];
				}
				return partial;
			}

			function invokePartial(partial, context, options) {
				// Use the current closure context to save the partial-block if this partial
				var currentPartialBlock = options.data && options.data['partial-block'];
				options.partial = true;
				if (options.ids) {
					options.data.contextPath = options.ids[0] || options.data.contextPath;
				}

				var partialBlock = undefined;
				if (options.fn && options.fn !== noop) {
					(function () {
						options.data = _base.createFrame(options.data);
						// Wrapper function to get access to currentPartialBlock from the closure
						var fn = options.fn;
						partialBlock = options.data['partial-block'] = function partialBlockWrapper(context) {
							var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

							// Restore the partial-block from the closure for the execution of the block
							// i.e. the part inside the block of the partial call.
							options.data = _base.createFrame(options.data);
							options.data['partial-block'] = currentPartialBlock;
							return fn(context, options);
						};
						if (fn.partials) {
							options.partials = Utils.extend({}, options.partials, fn.partials);
						}
					})();
				}

				if (partial === undefined && partialBlock) {
					partial = partialBlock;
				}

				if (partial === undefined) {
					throw new _exception2['default']('The partial ' + options.name + ' could not be found');
				} else if (partial instanceof Function) {
					return partial(context, options);
				}
			}

			function noop() {
				return '';
			}

			function initData(context, data) {
				if (!data || !('root' in data)) {
					data = data ? _base.createFrame(data) : {};
					data.root = context;
				}
				return data;
			}

			function executeDecorators(fn, prog, container, depths, data, blockParams) {
				if (fn.decorator) {
					var props = {};
					prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
					Utils.extend(prog, props);
				}
				return prog;
			}

			/***/
		},
		/* 23 */
		/***/function (module, exports, __webpack_require__) {

			module.exports = { "default": __webpack_require__(24), __esModule: true };

			/***/
		},
		/* 24 */
		/***/function (module, exports, __webpack_require__) {

			__webpack_require__(25);
			module.exports = __webpack_require__(30).Object.seal;

			/***/
		},
		/* 25 */
		/***/function (module, exports, __webpack_require__) {

			// 19.1.2.17 Object.seal(O)
			var isObject = __webpack_require__(26);

			__webpack_require__(27)('seal', function ($seal) {
				return function seal(it) {
					return $seal && isObject(it) ? $seal(it) : it;
				};
			});

			/***/
		},
		/* 26 */
		/***/function (module, exports) {

			module.exports = function (it) {
				return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
			};

			/***/
		},
		/* 27 */
		/***/function (module, exports, __webpack_require__) {

			// most Object methods by ES6 should accept primitives
			var $export = __webpack_require__(28),
			    core = __webpack_require__(30),
			    fails = __webpack_require__(33);
			module.exports = function (KEY, exec) {
				var fn = (core.Object || {})[KEY] || Object[KEY],
				    exp = {};
				exp[KEY] = exec(fn);
				$export($export.S + $export.F * fails(function () {
					fn(1);
				}), 'Object', exp);
			};

			/***/
		},
		/* 28 */
		/***/function (module, exports, __webpack_require__) {

			var global = __webpack_require__(29),
			    core = __webpack_require__(30),
			    ctx = __webpack_require__(31),
			    PROTOTYPE = 'prototype';

			var $export = function $export(type, name, source) {
				var IS_FORCED = type & $export.F,
				    IS_GLOBAL = type & $export.G,
				    IS_STATIC = type & $export.S,
				    IS_PROTO = type & $export.P,
				    IS_BIND = type & $export.B,
				    IS_WRAP = type & $export.W,
				    exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
				    target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
				    key,
				    own,
				    out;
				if (IS_GLOBAL) source = name;
				for (key in source) {
					// contains in native
					own = !IS_FORCED && target && key in target;
					if (own && key in exports) continue;
					// export native or passed
					out = own ? target[key] : source[key];
					// prevent global pollution for namespaces
					exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
					// bind timers to global for call from export context
					: IS_BIND && own ? ctx(out, global)
					// wrap global constructors for prevent change them in library
					: IS_WRAP && target[key] == out ? function (C) {
						var F = function F(param) {
							return this instanceof C ? new C(param) : C(param);
						};
						F[PROTOTYPE] = C[PROTOTYPE];
						return F;
						// make static versions for prototype methods
					}(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
					if (IS_PROTO) (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
				}
			};
			// type bitmap
			$export.F = 1; // forced
			$export.G = 2; // global
			$export.S = 4; // static
			$export.P = 8; // proto
			$export.B = 16; // bind
			$export.W = 32; // wrap
			module.exports = $export;

			/***/
		},
		/* 29 */
		/***/function (module, exports) {

			// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
			var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
			if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

			/***/
		},
		/* 30 */
		/***/function (module, exports) {

			var core = module.exports = { version: '1.2.6' };
			if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

			/***/
		},
		/* 31 */
		/***/function (module, exports, __webpack_require__) {

			// optional / simple context binding
			var aFunction = __webpack_require__(32);
			module.exports = function (fn, that, length) {
				aFunction(fn);
				if (that === undefined) return fn;
				switch (length) {
					case 1:
						return function (a) {
							return fn.call(that, a);
						};
					case 2:
						return function (a, b) {
							return fn.call(that, a, b);
						};
					case 3:
						return function (a, b, c) {
							return fn.call(that, a, b, c);
						};
				}
				return function () /* ...args */{
					return fn.apply(that, arguments);
				};
			};

			/***/
		},
		/* 32 */
		/***/function (module, exports) {

			module.exports = function (it) {
				if (typeof it != 'function') throw TypeError(it + ' is not a function!');
				return it;
			};

			/***/
		},
		/* 33 */
		/***/function (module, exports) {

			module.exports = function (exec) {
				try {
					return !!exec();
				} catch (e) {
					return true;
				}
			};

			/***/
		},
		/* 34 */
		/***/function (module, exports) {

			/* WEBPACK VAR INJECTION */(function (global) {
				/* global window */
				'use strict';

				exports.__esModule = true;

				exports['default'] = function (Handlebars) {
					/* istanbul ignore next */
					var root = typeof global !== 'undefined' ? global : window,
					    $Handlebars = root.Handlebars;
					/* istanbul ignore next */
					Handlebars.noConflict = function () {
						if (root.Handlebars === Handlebars) {
							root.Handlebars = $Handlebars;
						}
						return Handlebars;
					};
				};

				module.exports = exports['default'];
				/* WEBPACK VAR INJECTION */
			}).call(exports, function () {
				return this;
			}());

			/***/
		},
		/* 35 */
		/***/function (module, exports) {

			'use strict';

			exports.__esModule = true;
			var AST = {
				// Public API used to evaluate derived attributes regarding AST nodes
				helpers: {
					// a mustache is definitely a helper if:
					// * it is an eligible helper, and
					// * it has at least one parameter or hash segment
					helperExpression: function helperExpression(node) {
						return node.type === 'SubExpression' || (node.type === 'MustacheStatement' || node.type === 'BlockStatement') && !!(node.params && node.params.length || node.hash);
					},

					scopedId: function scopedId(path) {
						return (/^\.|this\b/.test(path.original)
						);
					},

					// an ID is simple if it only has one part, and that part is not
					// `..` or `this`.
					simpleId: function simpleId(path) {
						return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
					}
				}
			};

			// Must be exported as an object rather than the root of the module as the jison lexer
			// must modify the object to operate properly.
			exports['default'] = AST;
			module.exports = exports['default'];

			/***/
		},
		/* 36 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			var _interopRequireWildcard = __webpack_require__(3)['default'];

			exports.__esModule = true;
			exports.parse = parse;

			var _parser = __webpack_require__(37);

			var _parser2 = _interopRequireDefault(_parser);

			var _whitespaceControl = __webpack_require__(38);

			var _whitespaceControl2 = _interopRequireDefault(_whitespaceControl);

			var _helpers = __webpack_require__(40);

			var Helpers = _interopRequireWildcard(_helpers);

			var _utils = __webpack_require__(5);

			exports.parser = _parser2['default'];

			var yy = {};
			_utils.extend(yy, Helpers);

			function parse(input, options) {
				// Just return if an already-compiled AST was passed in.
				if (input.type === 'Program') {
					return input;
				}

				_parser2['default'].yy = yy;

				// Altering the shared object here, but this is ok as parser is a sync operation
				yy.locInfo = function (locInfo) {
					return new yy.SourceLocation(options && options.srcName, locInfo);
				};

				var strip = new _whitespaceControl2['default'](options);
				return strip.accept(_parser2['default'].parse(input));
			}

			/***/
		},
		/* 37 */
		/***/function (module, exports) {

			// File ignored in coverage tests via setting in .istanbul.yml
			/* Jison generated parser */
			"use strict";

			exports.__esModule = true;
			var handlebars = function () {
				var parser = { trace: function trace() {},
					yy: {},
					symbols_: { "error": 2, "root": 3, "program": 4, "EOF": 5, "program_repetition0": 6, "statement": 7, "mustache": 8, "block": 9, "rawBlock": 10, "partial": 11, "partialBlock": 12, "content": 13, "COMMENT": 14, "CONTENT": 15, "openRawBlock": 16, "rawBlock_repetition_plus0": 17, "END_RAW_BLOCK": 18, "OPEN_RAW_BLOCK": 19, "helperName": 20, "openRawBlock_repetition0": 21, "openRawBlock_option0": 22, "CLOSE_RAW_BLOCK": 23, "openBlock": 24, "block_option0": 25, "closeBlock": 26, "openInverse": 27, "block_option1": 28, "OPEN_BLOCK": 29, "openBlock_repetition0": 30, "openBlock_option0": 31, "openBlock_option1": 32, "CLOSE": 33, "OPEN_INVERSE": 34, "openInverse_repetition0": 35, "openInverse_option0": 36, "openInverse_option1": 37, "openInverseChain": 38, "OPEN_INVERSE_CHAIN": 39, "openInverseChain_repetition0": 40, "openInverseChain_option0": 41, "openInverseChain_option1": 42, "inverseAndProgram": 43, "INVERSE": 44, "inverseChain": 45, "inverseChain_option0": 46, "OPEN_ENDBLOCK": 47, "OPEN": 48, "mustache_repetition0": 49, "mustache_option0": 50, "OPEN_UNESCAPED": 51, "mustache_repetition1": 52, "mustache_option1": 53, "CLOSE_UNESCAPED": 54, "OPEN_PARTIAL": 55, "partialName": 56, "partial_repetition0": 57, "partial_option0": 58, "openPartialBlock": 59, "OPEN_PARTIAL_BLOCK": 60, "openPartialBlock_repetition0": 61, "openPartialBlock_option0": 62, "param": 63, "sexpr": 64, "OPEN_SEXPR": 65, "sexpr_repetition0": 66, "sexpr_option0": 67, "CLOSE_SEXPR": 68, "hash": 69, "hash_repetition_plus0": 70, "hashSegment": 71, "ID": 72, "EQUALS": 73, "blockParams": 74, "OPEN_BLOCK_PARAMS": 75, "blockParams_repetition_plus0": 76, "CLOSE_BLOCK_PARAMS": 77, "path": 78, "dataName": 79, "STRING": 80, "NUMBER": 81, "BOOLEAN": 82, "UNDEFINED": 83, "NULL": 84, "DATA": 85, "pathSegments": 86, "SEP": 87, "$accept": 0, "$end": 1 },
					terminals_: { 2: "error", 5: "EOF", 14: "COMMENT", 15: "CONTENT", 18: "END_RAW_BLOCK", 19: "OPEN_RAW_BLOCK", 23: "CLOSE_RAW_BLOCK", 29: "OPEN_BLOCK", 33: "CLOSE", 34: "OPEN_INVERSE", 39: "OPEN_INVERSE_CHAIN", 44: "INVERSE", 47: "OPEN_ENDBLOCK", 48: "OPEN", 51: "OPEN_UNESCAPED", 54: "CLOSE_UNESCAPED", 55: "OPEN_PARTIAL", 60: "OPEN_PARTIAL_BLOCK", 65: "OPEN_SEXPR", 68: "CLOSE_SEXPR", 72: "ID", 73: "EQUALS", 75: "OPEN_BLOCK_PARAMS", 77: "CLOSE_BLOCK_PARAMS", 80: "STRING", 81: "NUMBER", 82: "BOOLEAN", 83: "UNDEFINED", 84: "NULL", 85: "DATA", 87: "SEP" },
					productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [13, 1], [10, 3], [16, 5], [9, 4], [9, 4], [24, 6], [27, 6], [38, 6], [43, 2], [45, 3], [45, 1], [26, 3], [8, 5], [8, 5], [11, 5], [12, 3], [59, 5], [63, 1], [63, 1], [64, 5], [69, 1], [71, 3], [74, 3], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [56, 1], [56, 1], [79, 2], [78, 1], [86, 3], [86, 1], [6, 0], [6, 2], [17, 1], [17, 2], [21, 0], [21, 2], [22, 0], [22, 1], [25, 0], [25, 1], [28, 0], [28, 1], [30, 0], [30, 2], [31, 0], [31, 1], [32, 0], [32, 1], [35, 0], [35, 2], [36, 0], [36, 1], [37, 0], [37, 1], [40, 0], [40, 2], [41, 0], [41, 1], [42, 0], [42, 1], [46, 0], [46, 1], [49, 0], [49, 2], [50, 0], [50, 1], [52, 0], [52, 2], [53, 0], [53, 1], [57, 0], [57, 2], [58, 0], [58, 1], [61, 0], [61, 2], [62, 0], [62, 1], [66, 0], [66, 2], [67, 0], [67, 1], [70, 1], [70, 2], [76, 1], [76, 2]],
					performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$
					/**/) {

						var $0 = $$.length - 1;
						switch (yystate) {
							case 1:
								return $$[$0 - 1];
								break;
							case 2:
								this.$ = yy.prepareProgram($$[$0]);
								break;
							case 3:
								this.$ = $$[$0];
								break;
							case 4:
								this.$ = $$[$0];
								break;
							case 5:
								this.$ = $$[$0];
								break;
							case 6:
								this.$ = $$[$0];
								break;
							case 7:
								this.$ = $$[$0];
								break;
							case 8:
								this.$ = $$[$0];
								break;
							case 9:
								this.$ = {
									type: 'CommentStatement',
									value: yy.stripComment($$[$0]),
									strip: yy.stripFlags($$[$0], $$[$0]),
									loc: yy.locInfo(this._$)
								};

								break;
							case 10:
								this.$ = {
									type: 'ContentStatement',
									original: $$[$0],
									value: $$[$0],
									loc: yy.locInfo(this._$)
								};

								break;
							case 11:
								this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
								break;
							case 12:
								this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1] };
								break;
							case 13:
								this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
								break;
							case 14:
								this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
								break;
							case 15:
								this.$ = { open: $$[$0 - 5], path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
								break;
							case 16:
								this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
								break;
							case 17:
								this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
								break;
							case 18:
								this.$ = { strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]), program: $$[$0] };
								break;
							case 19:
								var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$),
								    program = yy.prepareProgram([inverse], $$[$0 - 1].loc);
								program.chained = true;

								this.$ = { strip: $$[$0 - 2].strip, program: program, chain: true };

								break;
							case 20:
								this.$ = $$[$0];
								break;
							case 21:
								this.$ = { path: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 2], $$[$0]) };
								break;
							case 22:
								this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
								break;
							case 23:
								this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
								break;
							case 24:
								this.$ = {
									type: 'PartialStatement',
									name: $$[$0 - 3],
									params: $$[$0 - 2],
									hash: $$[$0 - 1],
									indent: '',
									strip: yy.stripFlags($$[$0 - 4], $$[$0]),
									loc: yy.locInfo(this._$)
								};

								break;
							case 25:
								this.$ = yy.preparePartialBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
								break;
							case 26:
								this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 4], $$[$0]) };
								break;
							case 27:
								this.$ = $$[$0];
								break;
							case 28:
								this.$ = $$[$0];
								break;
							case 29:
								this.$ = {
									type: 'SubExpression',
									path: $$[$0 - 3],
									params: $$[$0 - 2],
									hash: $$[$0 - 1],
									loc: yy.locInfo(this._$)
								};

								break;
							case 30:
								this.$ = { type: 'Hash', pairs: $$[$0], loc: yy.locInfo(this._$) };
								break;
							case 31:
								this.$ = { type: 'HashPair', key: yy.id($$[$0 - 2]), value: $$[$0], loc: yy.locInfo(this._$) };
								break;
							case 32:
								this.$ = yy.id($$[$0 - 1]);
								break;
							case 33:
								this.$ = $$[$0];
								break;
							case 34:
								this.$ = $$[$0];
								break;
							case 35:
								this.$ = { type: 'StringLiteral', value: $$[$0], original: $$[$0], loc: yy.locInfo(this._$) };
								break;
							case 36:
								this.$ = { type: 'NumberLiteral', value: Number($$[$0]), original: Number($$[$0]), loc: yy.locInfo(this._$) };
								break;
							case 37:
								this.$ = { type: 'BooleanLiteral', value: $$[$0] === 'true', original: $$[$0] === 'true', loc: yy.locInfo(this._$) };
								break;
							case 38:
								this.$ = { type: 'UndefinedLiteral', original: undefined, value: undefined, loc: yy.locInfo(this._$) };
								break;
							case 39:
								this.$ = { type: 'NullLiteral', original: null, value: null, loc: yy.locInfo(this._$) };
								break;
							case 40:
								this.$ = $$[$0];
								break;
							case 41:
								this.$ = $$[$0];
								break;
							case 42:
								this.$ = yy.preparePath(true, $$[$0], this._$);
								break;
							case 43:
								this.$ = yy.preparePath(false, $$[$0], this._$);
								break;
							case 44:
								$$[$0 - 2].push({ part: yy.id($$[$0]), original: $$[$0], separator: $$[$0 - 1] });this.$ = $$[$0 - 2];
								break;
							case 45:
								this.$ = [{ part: yy.id($$[$0]), original: $$[$0] }];
								break;
							case 46:
								this.$ = [];
								break;
							case 47:
								$$[$0 - 1].push($$[$0]);
								break;
							case 48:
								this.$ = [$$[$0]];
								break;
							case 49:
								$$[$0 - 1].push($$[$0]);
								break;
							case 50:
								this.$ = [];
								break;
							case 51:
								$$[$0 - 1].push($$[$0]);
								break;
							case 58:
								this.$ = [];
								break;
							case 59:
								$$[$0 - 1].push($$[$0]);
								break;
							case 64:
								this.$ = [];
								break;
							case 65:
								$$[$0 - 1].push($$[$0]);
								break;
							case 70:
								this.$ = [];
								break;
							case 71:
								$$[$0 - 1].push($$[$0]);
								break;
							case 78:
								this.$ = [];
								break;
							case 79:
								$$[$0 - 1].push($$[$0]);
								break;
							case 82:
								this.$ = [];
								break;
							case 83:
								$$[$0 - 1].push($$[$0]);
								break;
							case 86:
								this.$ = [];
								break;
							case 87:
								$$[$0 - 1].push($$[$0]);
								break;
							case 90:
								this.$ = [];
								break;
							case 91:
								$$[$0 - 1].push($$[$0]);
								break;
							case 94:
								this.$ = [];
								break;
							case 95:
								$$[$0 - 1].push($$[$0]);
								break;
							case 98:
								this.$ = [$$[$0]];
								break;
							case 99:
								$$[$0 - 1].push($$[$0]);
								break;
							case 100:
								this.$ = [$$[$0]];
								break;
							case 101:
								$$[$0 - 1].push($$[$0]);
								break;
						}
					},
					table: [{ 3: 1, 4: 2, 5: [2, 46], 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 1: [3] }, { 5: [1, 4] }, { 5: [2, 2], 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: 11, 14: [1, 12], 15: [1, 20], 16: 17, 19: [1, 23], 24: 15, 27: 16, 29: [1, 21], 34: [1, 22], 39: [2, 2], 44: [2, 2], 47: [2, 2], 48: [1, 13], 51: [1, 14], 55: [1, 18], 59: 19, 60: [1, 24] }, { 1: [2, 1] }, { 5: [2, 47], 14: [2, 47], 15: [2, 47], 19: [2, 47], 29: [2, 47], 34: [2, 47], 39: [2, 47], 44: [2, 47], 47: [2, 47], 48: [2, 47], 51: [2, 47], 55: [2, 47], 60: [2, 47] }, { 5: [2, 3], 14: [2, 3], 15: [2, 3], 19: [2, 3], 29: [2, 3], 34: [2, 3], 39: [2, 3], 44: [2, 3], 47: [2, 3], 48: [2, 3], 51: [2, 3], 55: [2, 3], 60: [2, 3] }, { 5: [2, 4], 14: [2, 4], 15: [2, 4], 19: [2, 4], 29: [2, 4], 34: [2, 4], 39: [2, 4], 44: [2, 4], 47: [2, 4], 48: [2, 4], 51: [2, 4], 55: [2, 4], 60: [2, 4] }, { 5: [2, 5], 14: [2, 5], 15: [2, 5], 19: [2, 5], 29: [2, 5], 34: [2, 5], 39: [2, 5], 44: [2, 5], 47: [2, 5], 48: [2, 5], 51: [2, 5], 55: [2, 5], 60: [2, 5] }, { 5: [2, 6], 14: [2, 6], 15: [2, 6], 19: [2, 6], 29: [2, 6], 34: [2, 6], 39: [2, 6], 44: [2, 6], 47: [2, 6], 48: [2, 6], 51: [2, 6], 55: [2, 6], 60: [2, 6] }, { 5: [2, 7], 14: [2, 7], 15: [2, 7], 19: [2, 7], 29: [2, 7], 34: [2, 7], 39: [2, 7], 44: [2, 7], 47: [2, 7], 48: [2, 7], 51: [2, 7], 55: [2, 7], 60: [2, 7] }, { 5: [2, 8], 14: [2, 8], 15: [2, 8], 19: [2, 8], 29: [2, 8], 34: [2, 8], 39: [2, 8], 44: [2, 8], 47: [2, 8], 48: [2, 8], 51: [2, 8], 55: [2, 8], 60: [2, 8] }, { 5: [2, 9], 14: [2, 9], 15: [2, 9], 19: [2, 9], 29: [2, 9], 34: [2, 9], 39: [2, 9], 44: [2, 9], 47: [2, 9], 48: [2, 9], 51: [2, 9], 55: [2, 9], 60: [2, 9] }, { 20: 25, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 36, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 37, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 4: 38, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 13: 40, 15: [1, 20], 17: 39 }, { 20: 42, 56: 41, 64: 43, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 45, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 5: [2, 10], 14: [2, 10], 15: [2, 10], 18: [2, 10], 19: [2, 10], 29: [2, 10], 34: [2, 10], 39: [2, 10], 44: [2, 10], 47: [2, 10], 48: [2, 10], 51: [2, 10], 55: [2, 10], 60: [2, 10] }, { 20: 46, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 47, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 48, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 42, 56: 49, 64: 43, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [2, 78], 49: 50, 65: [2, 78], 72: [2, 78], 80: [2, 78], 81: [2, 78], 82: [2, 78], 83: [2, 78], 84: [2, 78], 85: [2, 78] }, { 23: [2, 33], 33: [2, 33], 54: [2, 33], 65: [2, 33], 68: [2, 33], 72: [2, 33], 75: [2, 33], 80: [2, 33], 81: [2, 33], 82: [2, 33], 83: [2, 33], 84: [2, 33], 85: [2, 33] }, { 23: [2, 34], 33: [2, 34], 54: [2, 34], 65: [2, 34], 68: [2, 34], 72: [2, 34], 75: [2, 34], 80: [2, 34], 81: [2, 34], 82: [2, 34], 83: [2, 34], 84: [2, 34], 85: [2, 34] }, { 23: [2, 35], 33: [2, 35], 54: [2, 35], 65: [2, 35], 68: [2, 35], 72: [2, 35], 75: [2, 35], 80: [2, 35], 81: [2, 35], 82: [2, 35], 83: [2, 35], 84: [2, 35], 85: [2, 35] }, { 23: [2, 36], 33: [2, 36], 54: [2, 36], 65: [2, 36], 68: [2, 36], 72: [2, 36], 75: [2, 36], 80: [2, 36], 81: [2, 36], 82: [2, 36], 83: [2, 36], 84: [2, 36], 85: [2, 36] }, { 23: [2, 37], 33: [2, 37], 54: [2, 37], 65: [2, 37], 68: [2, 37], 72: [2, 37], 75: [2, 37], 80: [2, 37], 81: [2, 37], 82: [2, 37], 83: [2, 37], 84: [2, 37], 85: [2, 37] }, { 23: [2, 38], 33: [2, 38], 54: [2, 38], 65: [2, 38], 68: [2, 38], 72: [2, 38], 75: [2, 38], 80: [2, 38], 81: [2, 38], 82: [2, 38], 83: [2, 38], 84: [2, 38], 85: [2, 38] }, { 23: [2, 39], 33: [2, 39], 54: [2, 39], 65: [2, 39], 68: [2, 39], 72: [2, 39], 75: [2, 39], 80: [2, 39], 81: [2, 39], 82: [2, 39], 83: [2, 39], 84: [2, 39], 85: [2, 39] }, { 23: [2, 43], 33: [2, 43], 54: [2, 43], 65: [2, 43], 68: [2, 43], 72: [2, 43], 75: [2, 43], 80: [2, 43], 81: [2, 43], 82: [2, 43], 83: [2, 43], 84: [2, 43], 85: [2, 43], 87: [1, 51] }, { 72: [1, 35], 86: 52 }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 52: 53, 54: [2, 82], 65: [2, 82], 72: [2, 82], 80: [2, 82], 81: [2, 82], 82: [2, 82], 83: [2, 82], 84: [2, 82], 85: [2, 82] }, { 25: 54, 38: 56, 39: [1, 58], 43: 57, 44: [1, 59], 45: 55, 47: [2, 54] }, { 28: 60, 43: 61, 44: [1, 59], 47: [2, 56] }, { 13: 63, 15: [1, 20], 18: [1, 62] }, { 15: [2, 48], 18: [2, 48] }, { 33: [2, 86], 57: 64, 65: [2, 86], 72: [2, 86], 80: [2, 86], 81: [2, 86], 82: [2, 86], 83: [2, 86], 84: [2, 86], 85: [2, 86] }, { 33: [2, 40], 65: [2, 40], 72: [2, 40], 80: [2, 40], 81: [2, 40], 82: [2, 40], 83: [2, 40], 84: [2, 40], 85: [2, 40] }, { 33: [2, 41], 65: [2, 41], 72: [2, 41], 80: [2, 41], 81: [2, 41], 82: [2, 41], 83: [2, 41], 84: [2, 41], 85: [2, 41] }, { 20: 65, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 66, 47: [1, 67] }, { 30: 68, 33: [2, 58], 65: [2, 58], 72: [2, 58], 75: [2, 58], 80: [2, 58], 81: [2, 58], 82: [2, 58], 83: [2, 58], 84: [2, 58], 85: [2, 58] }, { 33: [2, 64], 35: 69, 65: [2, 64], 72: [2, 64], 75: [2, 64], 80: [2, 64], 81: [2, 64], 82: [2, 64], 83: [2, 64], 84: [2, 64], 85: [2, 64] }, { 21: 70, 23: [2, 50], 65: [2, 50], 72: [2, 50], 80: [2, 50], 81: [2, 50], 82: [2, 50], 83: [2, 50], 84: [2, 50], 85: [2, 50] }, { 33: [2, 90], 61: 71, 65: [2, 90], 72: [2, 90], 80: [2, 90], 81: [2, 90], 82: [2, 90], 83: [2, 90], 84: [2, 90], 85: [2, 90] }, { 20: 75, 33: [2, 80], 50: 72, 63: 73, 64: 76, 65: [1, 44], 69: 74, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 72: [1, 80] }, { 23: [2, 42], 33: [2, 42], 54: [2, 42], 65: [2, 42], 68: [2, 42], 72: [2, 42], 75: [2, 42], 80: [2, 42], 81: [2, 42], 82: [2, 42], 83: [2, 42], 84: [2, 42], 85: [2, 42], 87: [1, 51] }, { 20: 75, 53: 81, 54: [2, 84], 63: 82, 64: 76, 65: [1, 44], 69: 83, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 84, 47: [1, 67] }, { 47: [2, 55] }, { 4: 85, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 47: [2, 20] }, { 20: 86, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 87, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 26: 88, 47: [1, 67] }, { 47: [2, 57] }, { 5: [2, 11], 14: [2, 11], 15: [2, 11], 19: [2, 11], 29: [2, 11], 34: [2, 11], 39: [2, 11], 44: [2, 11], 47: [2, 11], 48: [2, 11], 51: [2, 11], 55: [2, 11], 60: [2, 11] }, { 15: [2, 49], 18: [2, 49] }, { 20: 75, 33: [2, 88], 58: 89, 63: 90, 64: 76, 65: [1, 44], 69: 91, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 65: [2, 94], 66: 92, 68: [2, 94], 72: [2, 94], 80: [2, 94], 81: [2, 94], 82: [2, 94], 83: [2, 94], 84: [2, 94], 85: [2, 94] }, { 5: [2, 25], 14: [2, 25], 15: [2, 25], 19: [2, 25], 29: [2, 25], 34: [2, 25], 39: [2, 25], 44: [2, 25], 47: [2, 25], 48: [2, 25], 51: [2, 25], 55: [2, 25], 60: [2, 25] }, { 20: 93, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 31: 94, 33: [2, 60], 63: 95, 64: 76, 65: [1, 44], 69: 96, 70: 77, 71: 78, 72: [1, 79], 75: [2, 60], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 33: [2, 66], 36: 97, 63: 98, 64: 76, 65: [1, 44], 69: 99, 70: 77, 71: 78, 72: [1, 79], 75: [2, 66], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 22: 100, 23: [2, 52], 63: 101, 64: 76, 65: [1, 44], 69: 102, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 33: [2, 92], 62: 103, 63: 104, 64: 76, 65: [1, 44], 69: 105, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 106] }, { 33: [2, 79], 65: [2, 79], 72: [2, 79], 80: [2, 79], 81: [2, 79], 82: [2, 79], 83: [2, 79], 84: [2, 79], 85: [2, 79] }, { 33: [2, 81] }, { 23: [2, 27], 33: [2, 27], 54: [2, 27], 65: [2, 27], 68: [2, 27], 72: [2, 27], 75: [2, 27], 80: [2, 27], 81: [2, 27], 82: [2, 27], 83: [2, 27], 84: [2, 27], 85: [2, 27] }, { 23: [2, 28], 33: [2, 28], 54: [2, 28], 65: [2, 28], 68: [2, 28], 72: [2, 28], 75: [2, 28], 80: [2, 28], 81: [2, 28], 82: [2, 28], 83: [2, 28], 84: [2, 28], 85: [2, 28] }, { 23: [2, 30], 33: [2, 30], 54: [2, 30], 68: [2, 30], 71: 107, 72: [1, 108], 75: [2, 30] }, { 23: [2, 98], 33: [2, 98], 54: [2, 98], 68: [2, 98], 72: [2, 98], 75: [2, 98] }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 73: [1, 109], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 23: [2, 44], 33: [2, 44], 54: [2, 44], 65: [2, 44], 68: [2, 44], 72: [2, 44], 75: [2, 44], 80: [2, 44], 81: [2, 44], 82: [2, 44], 83: [2, 44], 84: [2, 44], 85: [2, 44], 87: [2, 44] }, { 54: [1, 110] }, { 54: [2, 83], 65: [2, 83], 72: [2, 83], 80: [2, 83], 81: [2, 83], 82: [2, 83], 83: [2, 83], 84: [2, 83], 85: [2, 83] }, { 54: [2, 85] }, { 5: [2, 13], 14: [2, 13], 15: [2, 13], 19: [2, 13], 29: [2, 13], 34: [2, 13], 39: [2, 13], 44: [2, 13], 47: [2, 13], 48: [2, 13], 51: [2, 13], 55: [2, 13], 60: [2, 13] }, { 38: 56, 39: [1, 58], 43: 57, 44: [1, 59], 45: 112, 46: 111, 47: [2, 76] }, { 33: [2, 70], 40: 113, 65: [2, 70], 72: [2, 70], 75: [2, 70], 80: [2, 70], 81: [2, 70], 82: [2, 70], 83: [2, 70], 84: [2, 70], 85: [2, 70] }, { 47: [2, 18] }, { 5: [2, 14], 14: [2, 14], 15: [2, 14], 19: [2, 14], 29: [2, 14], 34: [2, 14], 39: [2, 14], 44: [2, 14], 47: [2, 14], 48: [2, 14], 51: [2, 14], 55: [2, 14], 60: [2, 14] }, { 33: [1, 114] }, { 33: [2, 87], 65: [2, 87], 72: [2, 87], 80: [2, 87], 81: [2, 87], 82: [2, 87], 83: [2, 87], 84: [2, 87], 85: [2, 87] }, { 33: [2, 89] }, { 20: 75, 63: 116, 64: 76, 65: [1, 44], 67: 115, 68: [2, 96], 69: 117, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 118] }, { 32: 119, 33: [2, 62], 74: 120, 75: [1, 121] }, { 33: [2, 59], 65: [2, 59], 72: [2, 59], 75: [2, 59], 80: [2, 59], 81: [2, 59], 82: [2, 59], 83: [2, 59], 84: [2, 59], 85: [2, 59] }, { 33: [2, 61], 75: [2, 61] }, { 33: [2, 68], 37: 122, 74: 123, 75: [1, 121] }, { 33: [2, 65], 65: [2, 65], 72: [2, 65], 75: [2, 65], 80: [2, 65], 81: [2, 65], 82: [2, 65], 83: [2, 65], 84: [2, 65], 85: [2, 65] }, { 33: [2, 67], 75: [2, 67] }, { 23: [1, 124] }, { 23: [2, 51], 65: [2, 51], 72: [2, 51], 80: [2, 51], 81: [2, 51], 82: [2, 51], 83: [2, 51], 84: [2, 51], 85: [2, 51] }, { 23: [2, 53] }, { 33: [1, 125] }, { 33: [2, 91], 65: [2, 91], 72: [2, 91], 80: [2, 91], 81: [2, 91], 82: [2, 91], 83: [2, 91], 84: [2, 91], 85: [2, 91] }, { 33: [2, 93] }, { 5: [2, 22], 14: [2, 22], 15: [2, 22], 19: [2, 22], 29: [2, 22], 34: [2, 22], 39: [2, 22], 44: [2, 22], 47: [2, 22], 48: [2, 22], 51: [2, 22], 55: [2, 22], 60: [2, 22] }, { 23: [2, 99], 33: [2, 99], 54: [2, 99], 68: [2, 99], 72: [2, 99], 75: [2, 99] }, { 73: [1, 109] }, { 20: 75, 63: 126, 64: 76, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 23], 14: [2, 23], 15: [2, 23], 19: [2, 23], 29: [2, 23], 34: [2, 23], 39: [2, 23], 44: [2, 23], 47: [2, 23], 48: [2, 23], 51: [2, 23], 55: [2, 23], 60: [2, 23] }, { 47: [2, 19] }, { 47: [2, 77] }, { 20: 75, 33: [2, 72], 41: 127, 63: 128, 64: 76, 65: [1, 44], 69: 129, 70: 77, 71: 78, 72: [1, 79], 75: [2, 72], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 24], 14: [2, 24], 15: [2, 24], 19: [2, 24], 29: [2, 24], 34: [2, 24], 39: [2, 24], 44: [2, 24], 47: [2, 24], 48: [2, 24], 51: [2, 24], 55: [2, 24], 60: [2, 24] }, { 68: [1, 130] }, { 65: [2, 95], 68: [2, 95], 72: [2, 95], 80: [2, 95], 81: [2, 95], 82: [2, 95], 83: [2, 95], 84: [2, 95], 85: [2, 95] }, { 68: [2, 97] }, { 5: [2, 21], 14: [2, 21], 15: [2, 21], 19: [2, 21], 29: [2, 21], 34: [2, 21], 39: [2, 21], 44: [2, 21], 47: [2, 21], 48: [2, 21], 51: [2, 21], 55: [2, 21], 60: [2, 21] }, { 33: [1, 131] }, { 33: [2, 63] }, { 72: [1, 133], 76: 132 }, { 33: [1, 134] }, { 33: [2, 69] }, { 15: [2, 12] }, { 14: [2, 26], 15: [2, 26], 19: [2, 26], 29: [2, 26], 34: [2, 26], 47: [2, 26], 48: [2, 26], 51: [2, 26], 55: [2, 26], 60: [2, 26] }, { 23: [2, 31], 33: [2, 31], 54: [2, 31], 68: [2, 31], 72: [2, 31], 75: [2, 31] }, { 33: [2, 74], 42: 135, 74: 136, 75: [1, 121] }, { 33: [2, 71], 65: [2, 71], 72: [2, 71], 75: [2, 71], 80: [2, 71], 81: [2, 71], 82: [2, 71], 83: [2, 71], 84: [2, 71], 85: [2, 71] }, { 33: [2, 73], 75: [2, 73] }, { 23: [2, 29], 33: [2, 29], 54: [2, 29], 65: [2, 29], 68: [2, 29], 72: [2, 29], 75: [2, 29], 80: [2, 29], 81: [2, 29], 82: [2, 29], 83: [2, 29], 84: [2, 29], 85: [2, 29] }, { 14: [2, 15], 15: [2, 15], 19: [2, 15], 29: [2, 15], 34: [2, 15], 39: [2, 15], 44: [2, 15], 47: [2, 15], 48: [2, 15], 51: [2, 15], 55: [2, 15], 60: [2, 15] }, { 72: [1, 138], 77: [1, 137] }, { 72: [2, 100], 77: [2, 100] }, { 14: [2, 16], 15: [2, 16], 19: [2, 16], 29: [2, 16], 34: [2, 16], 44: [2, 16], 47: [2, 16], 48: [2, 16], 51: [2, 16], 55: [2, 16], 60: [2, 16] }, { 33: [1, 139] }, { 33: [2, 75] }, { 33: [2, 32] }, { 72: [2, 101], 77: [2, 101] }, { 14: [2, 17], 15: [2, 17], 19: [2, 17], 29: [2, 17], 34: [2, 17], 39: [2, 17], 44: [2, 17], 47: [2, 17], 48: [2, 17], 51: [2, 17], 55: [2, 17], 60: [2, 17] }],
					defaultActions: { 4: [2, 1], 55: [2, 55], 57: [2, 20], 61: [2, 57], 74: [2, 81], 83: [2, 85], 87: [2, 18], 91: [2, 89], 102: [2, 53], 105: [2, 93], 111: [2, 19], 112: [2, 77], 117: [2, 97], 120: [2, 63], 123: [2, 69], 124: [2, 12], 136: [2, 75], 137: [2, 32] },
					parseError: function parseError(str, hash) {
						throw new Error(str);
					},
					parse: function parse(input) {
						var self = this,
						    stack = [0],
						    vstack = [null],
						    lstack = [],
						    table = this.table,
						    yytext = "",
						    yylineno = 0,
						    yyleng = 0,
						    recovering = 0,
						    TERROR = 2,
						    EOF = 1;
						this.lexer.setInput(input);
						this.lexer.yy = this.yy;
						this.yy.lexer = this.lexer;
						this.yy.parser = this;
						if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
						var yyloc = this.lexer.yylloc;
						lstack.push(yyloc);
						var ranges = this.lexer.options && this.lexer.options.ranges;
						if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
						function popStack(n) {
							stack.length = stack.length - 2 * n;
							vstack.length = vstack.length - n;
							lstack.length = lstack.length - n;
						}
						function lex() {
							var token;
							token = self.lexer.lex() || 1;
							if (typeof token !== "number") {
								token = self.symbols_[token] || token;
							}
							return token;
						}
						var symbol,
						    preErrorSymbol,
						    state,
						    action,
						    a,
						    r,
						    yyval = {},
						    p,
						    len,
						    newState,
						    expected;
						while (true) {
							state = stack[stack.length - 1];
							if (this.defaultActions[state]) {
								action = this.defaultActions[state];
							} else {
								if (symbol === null || typeof symbol == "undefined") {
									symbol = lex();
								}
								action = table[state] && table[state][symbol];
							}
							if (typeof action === "undefined" || !action.length || !action[0]) {
								var errStr = "";
								if (!recovering) {
									expected = [];
									for (p in table[state]) {
										if (this.terminals_[p] && p > 2) {
											expected.push("'" + this.terminals_[p] + "'");
										}
									}if (this.lexer.showPosition) {
										errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
									} else {
										errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
									}
									this.parseError(errStr, { text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected });
								}
							}
							if (action[0] instanceof Array && action.length > 1) {
								throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
							}
							switch (action[0]) {
								case 1:
									stack.push(symbol);
									vstack.push(this.lexer.yytext);
									lstack.push(this.lexer.yylloc);
									stack.push(action[1]);
									symbol = null;
									if (!preErrorSymbol) {
										yyleng = this.lexer.yyleng;
										yytext = this.lexer.yytext;
										yylineno = this.lexer.yylineno;
										yyloc = this.lexer.yylloc;
										if (recovering > 0) recovering--;
									} else {
										symbol = preErrorSymbol;
										preErrorSymbol = null;
									}
									break;
								case 2:
									len = this.productions_[action[1]][1];
									yyval.$ = vstack[vstack.length - len];
									yyval._$ = { first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column };
									if (ranges) {
										yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
									}
									r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
									if (typeof r !== "undefined") {
										return r;
									}
									if (len) {
										stack = stack.slice(0, -1 * len * 2);
										vstack = vstack.slice(0, -1 * len);
										lstack = lstack.slice(0, -1 * len);
									}
									stack.push(this.productions_[action[1]][0]);
									vstack.push(yyval.$);
									lstack.push(yyval._$);
									newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
									stack.push(newState);
									break;
								case 3:
									return true;
							}
						}
						return true;
					}
				};
				/* Jison generated lexer */
				var lexer = function () {
					var lexer = { EOF: 1,
						parseError: function parseError(str, hash) {
							if (this.yy.parser) {
								this.yy.parser.parseError(str, hash);
							} else {
								throw new Error(str);
							}
						},
						setInput: function setInput(input) {
							this._input = input;
							this._more = this._less = this.done = false;
							this.yylineno = this.yyleng = 0;
							this.yytext = this.matched = this.match = '';
							this.conditionStack = ['INITIAL'];
							this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 };
							if (this.options.ranges) this.yylloc.range = [0, 0];
							this.offset = 0;
							return this;
						},
						input: function input() {
							var ch = this._input[0];
							this.yytext += ch;
							this.yyleng++;
							this.offset++;
							this.match += ch;
							this.matched += ch;
							var lines = ch.match(/(?:\r\n?|\n).*/g);
							if (lines) {
								this.yylineno++;
								this.yylloc.last_line++;
							} else {
								this.yylloc.last_column++;
							}
							if (this.options.ranges) this.yylloc.range[1]++;

							this._input = this._input.slice(1);
							return ch;
						},
						unput: function unput(ch) {
							var len = ch.length;
							var lines = ch.split(/(?:\r\n?|\n)/g);

							this._input = ch + this._input;
							this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
							//this.yyleng -= len;
							this.offset -= len;
							var oldLines = this.match.split(/(?:\r\n?|\n)/g);
							this.match = this.match.substr(0, this.match.length - 1);
							this.matched = this.matched.substr(0, this.matched.length - 1);

							if (lines.length - 1) this.yylineno -= lines.length - 1;
							var r = this.yylloc.range;

							this.yylloc = { first_line: this.yylloc.first_line,
								last_line: this.yylineno + 1,
								first_column: this.yylloc.first_column,
								last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
							};

							if (this.options.ranges) {
								this.yylloc.range = [r[0], r[0] + this.yyleng - len];
							}
							return this;
						},
						more: function more() {
							this._more = true;
							return this;
						},
						less: function less(n) {
							this.unput(this.match.slice(n));
						},
						pastInput: function pastInput() {
							var past = this.matched.substr(0, this.matched.length - this.match.length);
							return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
						},
						upcomingInput: function upcomingInput() {
							var next = this.match;
							if (next.length < 20) {
								next += this._input.substr(0, 20 - next.length);
							}
							return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
						},
						showPosition: function showPosition() {
							var pre = this.pastInput();
							var c = new Array(pre.length + 1).join("-");
							return pre + this.upcomingInput() + "\n" + c + "^";
						},
						next: function next() {
							if (this.done) {
								return this.EOF;
							}
							if (!this._input) this.done = true;

							var token, match, tempMatch, index, col, lines;
							if (!this._more) {
								this.yytext = '';
								this.match = '';
							}
							var rules = this._currentRules();
							for (var i = 0; i < rules.length; i++) {
								tempMatch = this._input.match(this.rules[rules[i]]);
								if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
									match = tempMatch;
									index = i;
									if (!this.options.flex) break;
								}
							}
							if (match) {
								lines = match[0].match(/(?:\r\n?|\n).*/g);
								if (lines) this.yylineno += lines.length;
								this.yylloc = { first_line: this.yylloc.last_line,
									last_line: this.yylineno + 1,
									first_column: this.yylloc.last_column,
									last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length };
								this.yytext += match[0];
								this.match += match[0];
								this.matches = match;
								this.yyleng = this.yytext.length;
								if (this.options.ranges) {
									this.yylloc.range = [this.offset, this.offset += this.yyleng];
								}
								this._more = false;
								this._input = this._input.slice(match[0].length);
								this.matched += match[0];
								token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
								if (this.done && this._input) this.done = false;
								if (token) return token;else return;
							}
							if (this._input === "") {
								return this.EOF;
							} else {
								return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), { text: "", token: null, line: this.yylineno });
							}
						},
						lex: function lex() {
							var r = this.next();
							if (typeof r !== 'undefined') {
								return r;
							} else {
								return this.lex();
							}
						},
						begin: function begin(condition) {
							this.conditionStack.push(condition);
						},
						popState: function popState() {
							return this.conditionStack.pop();
						},
						_currentRules: function _currentRules() {
							return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
						},
						topState: function topState() {
							return this.conditionStack[this.conditionStack.length - 2];
						},
						pushState: function begin(condition) {
							this.begin(condition);
						} };
					lexer.options = {};
					lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START
					/**/) {

						function strip(start, end) {
							return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng - end);
						}

						var YYSTATE = YY_START;
						switch ($avoiding_name_collisions) {
							case 0:
								if (yy_.yytext.slice(-2) === "\\\\") {
									strip(0, 1);
									this.begin("mu");
								} else if (yy_.yytext.slice(-1) === "\\") {
									strip(0, 1);
									this.begin("emu");
								} else {
									this.begin("mu");
								}
								if (yy_.yytext) return 15;

								break;
							case 1:
								return 15;
								break;
							case 2:
								this.popState();
								return 15;

								break;
							case 3:
								this.begin('raw');return 15;
								break;
							case 4:
								this.popState();
								// Should be using `this.topState()` below, but it currently
								// returns the second top instead of the first top. Opened an
								// issue about it at https://github.com/zaach/jison/issues/291
								if (this.conditionStack[this.conditionStack.length - 1] === 'raw') {
									return 15;
								} else {
									yy_.yytext = yy_.yytext.substr(5, yy_.yyleng - 9);
									return 'END_RAW_BLOCK';
								}

								break;
							case 5:
								return 15;
								break;
							case 6:
								this.popState();
								return 14;

								break;
							case 7:
								return 65;
								break;
							case 8:
								return 68;
								break;
							case 9:
								return 19;
								break;
							case 10:
								this.popState();
								this.begin('raw');
								return 23;

								break;
							case 11:
								return 55;
								break;
							case 12:
								return 60;
								break;
							case 13:
								return 29;
								break;
							case 14:
								return 47;
								break;
							case 15:
								this.popState();return 44;
								break;
							case 16:
								this.popState();return 44;
								break;
							case 17:
								return 34;
								break;
							case 18:
								return 39;
								break;
							case 19:
								return 51;
								break;
							case 20:
								return 48;
								break;
							case 21:
								this.unput(yy_.yytext);
								this.popState();
								this.begin('com');

								break;
							case 22:
								this.popState();
								return 14;

								break;
							case 23:
								return 48;
								break;
							case 24:
								return 73;
								break;
							case 25:
								return 72;
								break;
							case 26:
								return 72;
								break;
							case 27:
								return 87;
								break;
							case 28:
								// ignore whitespace
								break;
							case 29:
								this.popState();return 54;
								break;
							case 30:
								this.popState();return 33;
								break;
							case 31:
								yy_.yytext = strip(1, 2).replace(/\\"/g, '"');return 80;
								break;
							case 32:
								yy_.yytext = strip(1, 2).replace(/\\'/g, "'");return 80;
								break;
							case 33:
								return 85;
								break;
							case 34:
								return 82;
								break;
							case 35:
								return 82;
								break;
							case 36:
								return 83;
								break;
							case 37:
								return 84;
								break;
							case 38:
								return 81;
								break;
							case 39:
								return 75;
								break;
							case 40:
								return 77;
								break;
							case 41:
								return 72;
								break;
							case 42:
								yy_.yytext = yy_.yytext.replace(/\\([\\\]])/g, '$1');return 72;
								break;
							case 43:
								return 'INVALID';
								break;
							case 44:
								return 5;
								break;
						}
					};
					lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{(?=[^\/]))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]*?(?=(\{\{\{\{)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#>)/, /^(?:\{\{(~)?#\*?)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?\*?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[(\\\]|[^\]])*\])/, /^(?:.)/, /^(?:$)/];
					lexer.conditions = { "mu": { "rules": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], "inclusive": false }, "emu": { "rules": [2], "inclusive": false }, "com": { "rules": [6], "inclusive": false }, "raw": { "rules": [3, 4, 5], "inclusive": false }, "INITIAL": { "rules": [0, 1, 44], "inclusive": true } };
					return lexer;
				}();
				parser.lexer = lexer;
				function Parser() {
					this.yy = {};
				}Parser.prototype = parser;parser.Parser = Parser;
				return new Parser();
			}();exports["default"] = handlebars;
			module.exports = exports["default"];

			/***/
		},
		/* 38 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;

			var _visitor = __webpack_require__(39);

			var _visitor2 = _interopRequireDefault(_visitor);

			function WhitespaceControl() {
				var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				this.options = options;
			}
			WhitespaceControl.prototype = new _visitor2['default']();

			WhitespaceControl.prototype.Program = function (program) {
				var doStandalone = !this.options.ignoreStandalone;

				var isRoot = !this.isRootSeen;
				this.isRootSeen = true;

				var body = program.body;
				for (var i = 0, l = body.length; i < l; i++) {
					var current = body[i],
					    strip = this.accept(current);

					if (!strip) {
						continue;
					}

					var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
					    _isNextWhitespace = isNextWhitespace(body, i, isRoot),
					    openStandalone = strip.openStandalone && _isPrevWhitespace,
					    closeStandalone = strip.closeStandalone && _isNextWhitespace,
					    inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

					if (strip.close) {
						omitRight(body, i, true);
					}
					if (strip.open) {
						omitLeft(body, i, true);
					}

					if (doStandalone && inlineStandalone) {
						omitRight(body, i);

						if (omitLeft(body, i)) {
							// If we are on a standalone node, save the indent info for partials
							if (current.type === 'PartialStatement') {
								// Pull out the whitespace from the final line
								current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
							}
						}
					}
					if (doStandalone && openStandalone) {
						omitRight((current.program || current.inverse).body);

						// Strip out the previous content node if it's whitespace only
						omitLeft(body, i);
					}
					if (doStandalone && closeStandalone) {
						// Always strip the next node
						omitRight(body, i);

						omitLeft((current.inverse || current.program).body);
					}
				}

				return program;
			};

			WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function (block) {
				this.accept(block.program);
				this.accept(block.inverse);

				// Find the inverse program that is involed with whitespace stripping.
				var program = block.program || block.inverse,
				    inverse = block.program && block.inverse,
				    firstInverse = inverse,
				    lastInverse = inverse;

				if (inverse && inverse.chained) {
					firstInverse = inverse.body[0].program;

					// Walk the inverse chain to find the last inverse that is actually in the chain.
					while (lastInverse.chained) {
						lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
					}
				}

				var strip = {
					open: block.openStrip.open,
					close: block.closeStrip.close,

					// Determine the standalone candiacy. Basically flag our content as being possibly standalone
					// so our parent can determine if we actually are standalone
					openStandalone: isNextWhitespace(program.body),
					closeStandalone: isPrevWhitespace((firstInverse || program).body)
				};

				if (block.openStrip.close) {
					omitRight(program.body, null, true);
				}

				if (inverse) {
					var inverseStrip = block.inverseStrip;

					if (inverseStrip.open) {
						omitLeft(program.body, null, true);
					}

					if (inverseStrip.close) {
						omitRight(firstInverse.body, null, true);
					}
					if (block.closeStrip.open) {
						omitLeft(lastInverse.body, null, true);
					}

					// Find standalone else statments
					if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
						omitLeft(program.body);
						omitRight(firstInverse.body);
					}
				} else if (block.closeStrip.open) {
					omitLeft(program.body, null, true);
				}

				return strip;
			};

			WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function (mustache) {
				return mustache.strip;
			};

			WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function (node) {
				/* istanbul ignore next */
				var strip = node.strip || {};
				return {
					inlineStandalone: true,
					open: strip.open,
					close: strip.close
				};
			};

			function isPrevWhitespace(body, i, isRoot) {
				if (i === undefined) {
					i = body.length;
				}

				// Nodes that end with newlines are considered whitespace (but are special
				// cased for strip operations)
				var prev = body[i - 1],
				    sibling = body[i - 2];
				if (!prev) {
					return isRoot;
				}

				if (prev.type === 'ContentStatement') {
					return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
				}
			}
			function isNextWhitespace(body, i, isRoot) {
				if (i === undefined) {
					i = -1;
				}

				var next = body[i + 1],
				    sibling = body[i + 2];
				if (!next) {
					return isRoot;
				}

				if (next.type === 'ContentStatement') {
					return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
				}
			}

			// Marks the node to the right of the position as omitted.
			// I.e. {{foo}}' ' will mark the ' ' node as omitted.
			//
			// If i is undefined, then the first child will be marked as such.
			//
			// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
			// content is met.
			function omitRight(body, i, multiple) {
				var current = body[i == null ? 0 : i + 1];
				if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
					return;
				}

				var original = current.value;
				current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
				current.rightStripped = current.value !== original;
			}

			// Marks the node to the left of the position as omitted.
			// I.e. ' '{{foo}} will mark the ' ' node as omitted.
			//
			// If i is undefined then the last child will be marked as such.
			//
			// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
			// content is met.
			function omitLeft(body, i, multiple) {
				var current = body[i == null ? body.length - 1 : i - 1];
				if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
					return;
				}

				// We omit the last node if it's whitespace only and not preceeded by a non-content node.
				var original = current.value;
				current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
				current.leftStripped = current.value !== original;
				return current.leftStripped;
			}

			exports['default'] = WhitespaceControl;
			module.exports = exports['default'];

			/***/
		},
		/* 39 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;

			var _exception = __webpack_require__(6);

			var _exception2 = _interopRequireDefault(_exception);

			function Visitor() {
				this.parents = [];
			}

			Visitor.prototype = {
				constructor: Visitor,
				mutating: false,

				// Visits a given value. If mutating, will replace the value if necessary.
				acceptKey: function acceptKey(node, name) {
					var value = this.accept(node[name]);
					if (this.mutating) {
						// Hacky sanity check: This may have a few false positives for type for the helper
						// methods but will generally do the right thing without a lot of overhead.
						if (value && !Visitor.prototype[value.type]) {
							throw new _exception2['default']('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
						}
						node[name] = value;
					}
				},

				// Performs an accept operation with added sanity check to ensure
				// required keys are not removed.
				acceptRequired: function acceptRequired(node, name) {
					this.acceptKey(node, name);

					if (!node[name]) {
						throw new _exception2['default'](node.type + ' requires ' + name);
					}
				},

				// Traverses a given array. If mutating, empty respnses will be removed
				// for child elements.
				acceptArray: function acceptArray(array) {
					for (var i = 0, l = array.length; i < l; i++) {
						this.acceptKey(array, i);

						if (!array[i]) {
							array.splice(i, 1);
							i--;
							l--;
						}
					}
				},

				accept: function accept(object) {
					if (!object) {
						return;
					}

					/* istanbul ignore next: Sanity code */
					if (!this[object.type]) {
						throw new _exception2['default']('Unknown type: ' + object.type, object);
					}

					if (this.current) {
						this.parents.unshift(this.current);
					}
					this.current = object;

					var ret = this[object.type](object);

					this.current = this.parents.shift();

					if (!this.mutating || ret) {
						return ret;
					} else if (ret !== false) {
						return object;
					}
				},

				Program: function Program(program) {
					this.acceptArray(program.body);
				},

				MustacheStatement: visitSubExpression,
				Decorator: visitSubExpression,

				BlockStatement: visitBlock,
				DecoratorBlock: visitBlock,

				PartialStatement: visitPartial,
				PartialBlockStatement: function PartialBlockStatement(partial) {
					visitPartial.call(this, partial);

					this.acceptKey(partial, 'program');
				},

				ContentStatement: function ContentStatement() /* content */{},
				CommentStatement: function CommentStatement() /* comment */{},

				SubExpression: visitSubExpression,

				PathExpression: function PathExpression() /* path */{},

				StringLiteral: function StringLiteral() /* string */{},
				NumberLiteral: function NumberLiteral() /* number */{},
				BooleanLiteral: function BooleanLiteral() /* bool */{},
				UndefinedLiteral: function UndefinedLiteral() /* literal */{},
				NullLiteral: function NullLiteral() /* literal */{},

				Hash: function Hash(hash) {
					this.acceptArray(hash.pairs);
				},
				HashPair: function HashPair(pair) {
					this.acceptRequired(pair, 'value');
				}
			};

			function visitSubExpression(mustache) {
				this.acceptRequired(mustache, 'path');
				this.acceptArray(mustache.params);
				this.acceptKey(mustache, 'hash');
			}
			function visitBlock(block) {
				visitSubExpression.call(this, block);

				this.acceptKey(block, 'program');
				this.acceptKey(block, 'inverse');
			}
			function visitPartial(partial) {
				this.acceptRequired(partial, 'name');
				this.acceptArray(partial.params);
				this.acceptKey(partial, 'hash');
			}

			exports['default'] = Visitor;
			module.exports = exports['default'];

			/***/
		},
		/* 40 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;
			exports.SourceLocation = SourceLocation;
			exports.id = id;
			exports.stripFlags = stripFlags;
			exports.stripComment = stripComment;
			exports.preparePath = preparePath;
			exports.prepareMustache = prepareMustache;
			exports.prepareRawBlock = prepareRawBlock;
			exports.prepareBlock = prepareBlock;
			exports.prepareProgram = prepareProgram;
			exports.preparePartialBlock = preparePartialBlock;

			var _exception = __webpack_require__(6);

			var _exception2 = _interopRequireDefault(_exception);

			function validateClose(open, close) {
				close = close.path ? close.path.original : close;

				if (open.path.original !== close) {
					var errorNode = { loc: open.path.loc };

					throw new _exception2['default'](open.path.original + " doesn't match " + close, errorNode);
				}
			}

			function SourceLocation(source, locInfo) {
				this.source = source;
				this.start = {
					line: locInfo.first_line,
					column: locInfo.first_column
				};
				this.end = {
					line: locInfo.last_line,
					column: locInfo.last_column
				};
			}

			function id(token) {
				if (/^\[.*\]$/.test(token)) {
					return token.substr(1, token.length - 2);
				} else {
					return token;
				}
			}

			function stripFlags(open, close) {
				return {
					open: open.charAt(2) === '~',
					close: close.charAt(close.length - 3) === '~'
				};
			}

			function stripComment(comment) {
				return comment.replace(/^\{\{~?\!-?-?/, '').replace(/-?-?~?\}\}$/, '');
			}

			function preparePath(data, parts, loc) {
				loc = this.locInfo(loc);

				var original = data ? '@' : '',
				    dig = [],
				    depth = 0,
				    depthString = '';

				for (var i = 0, l = parts.length; i < l; i++) {
					var part = parts[i].part,


					// If we have [] syntax then we do not treat path references as operators,
					// i.e. foo.[this] resolves to approximately context.foo['this']
					isLiteral = parts[i].original !== part;
					original += (parts[i].separator || '') + part;

					if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
						if (dig.length > 0) {
							throw new _exception2['default']('Invalid path: ' + original, { loc: loc });
						} else if (part === '..') {
							depth++;
							depthString += '../';
						}
					} else {
						dig.push(part);
					}
				}

				return {
					type: 'PathExpression',
					data: data,
					depth: depth,
					parts: dig,
					original: original,
					loc: loc
				};
			}

			function prepareMustache(path, params, hash, open, strip, locInfo) {
				// Must use charAt to support IE pre-10
				var escapeFlag = open.charAt(3) || open.charAt(2),
				    escaped = escapeFlag !== '{' && escapeFlag !== '&';

				var decorator = /\*/.test(open);
				return {
					type: decorator ? 'Decorator' : 'MustacheStatement',
					path: path,
					params: params,
					hash: hash,
					escaped: escaped,
					strip: strip,
					loc: this.locInfo(locInfo)
				};
			}

			function prepareRawBlock(openRawBlock, contents, close, locInfo) {
				validateClose(openRawBlock, close);

				locInfo = this.locInfo(locInfo);
				var program = {
					type: 'Program',
					body: contents,
					strip: {},
					loc: locInfo
				};

				return {
					type: 'BlockStatement',
					path: openRawBlock.path,
					params: openRawBlock.params,
					hash: openRawBlock.hash,
					program: program,
					openStrip: {},
					inverseStrip: {},
					closeStrip: {},
					loc: locInfo
				};
			}

			function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
				if (close && close.path) {
					validateClose(openBlock, close);
				}

				var decorator = /\*/.test(openBlock.open);

				program.blockParams = openBlock.blockParams;

				var inverse = undefined,
				    inverseStrip = undefined;

				if (inverseAndProgram) {
					if (decorator) {
						throw new _exception2['default']('Unexpected inverse block on decorator', inverseAndProgram);
					}

					if (inverseAndProgram.chain) {
						inverseAndProgram.program.body[0].closeStrip = close.strip;
					}

					inverseStrip = inverseAndProgram.strip;
					inverse = inverseAndProgram.program;
				}

				if (inverted) {
					inverted = inverse;
					inverse = program;
					program = inverted;
				}

				return {
					type: decorator ? 'DecoratorBlock' : 'BlockStatement',
					path: openBlock.path,
					params: openBlock.params,
					hash: openBlock.hash,
					program: program,
					inverse: inverse,
					openStrip: openBlock.strip,
					inverseStrip: inverseStrip,
					closeStrip: close && close.strip,
					loc: this.locInfo(locInfo)
				};
			}

			function prepareProgram(statements, loc) {
				if (!loc && statements.length) {
					var firstLoc = statements[0].loc,
					    lastLoc = statements[statements.length - 1].loc;

					/* istanbul ignore else */
					if (firstLoc && lastLoc) {
						loc = {
							source: firstLoc.source,
							start: {
								line: firstLoc.start.line,
								column: firstLoc.start.column
							},
							end: {
								line: lastLoc.end.line,
								column: lastLoc.end.column
							}
						};
					}
				}

				return {
					type: 'Program',
					body: statements,
					strip: {},
					loc: loc
				};
			}

			function preparePartialBlock(open, program, close, locInfo) {
				validateClose(open, close);

				return {
					type: 'PartialBlockStatement',
					name: open.path,
					params: open.params,
					hash: open.hash,
					program: program,
					openStrip: open.strip,
					closeStrip: close && close.strip,
					loc: this.locInfo(locInfo)
				};
			}

			/***/
		},
		/* 41 */
		/***/function (module, exports, __webpack_require__) {

			/* eslint-disable new-cap */

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;
			exports.Compiler = Compiler;
			exports.precompile = precompile;
			exports.compile = compile;

			var _exception = __webpack_require__(6);

			var _exception2 = _interopRequireDefault(_exception);

			var _utils = __webpack_require__(5);

			var _ast = __webpack_require__(35);

			var _ast2 = _interopRequireDefault(_ast);

			var slice = [].slice;

			function Compiler() {}

			// the foundHelper register will disambiguate helper lookup from finding a
			// function in a context. This is necessary for mustache compatibility, which
			// requires that context functions in blocks are evaluated by blockHelperMissing,
			// and then proceed as if the resulting value was provided to blockHelperMissing.

			Compiler.prototype = {
				compiler: Compiler,

				equals: function equals(other) {
					var len = this.opcodes.length;
					if (other.opcodes.length !== len) {
						return false;
					}

					for (var i = 0; i < len; i++) {
						var opcode = this.opcodes[i],
						    otherOpcode = other.opcodes[i];
						if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
							return false;
						}
					}

					// We know that length is the same between the two arrays because they are directly tied
					// to the opcode behavior above.
					len = this.children.length;
					for (var i = 0; i < len; i++) {
						if (!this.children[i].equals(other.children[i])) {
							return false;
						}
					}

					return true;
				},

				guid: 0,

				compile: function compile(program, options) {
					this.sourceNode = [];
					this.opcodes = [];
					this.children = [];
					this.options = options;
					this.stringParams = options.stringParams;
					this.trackIds = options.trackIds;

					options.blockParams = options.blockParams || [];

					// These changes will propagate to the other compiler components
					var knownHelpers = options.knownHelpers;
					options.knownHelpers = {
						'helperMissing': true,
						'blockHelperMissing': true,
						'each': true,
						'if': true,
						'unless': true,
						'with': true,
						'log': true,
						'lookup': true
					};
					if (knownHelpers) {
						for (var _name in knownHelpers) {
							/* istanbul ignore else */
							if (_name in knownHelpers) {
								this.options.knownHelpers[_name] = knownHelpers[_name];
							}
						}
					}

					return this.accept(program);
				},

				compileProgram: function compileProgram(program) {
					var childCompiler = new this.compiler(),

					// eslint-disable-line new-cap
					result = childCompiler.compile(program, this.options),
					    guid = this.guid++;

					this.usePartial = this.usePartial || result.usePartial;

					this.children[guid] = result;
					this.useDepths = this.useDepths || result.useDepths;

					return guid;
				},

				accept: function accept(node) {
					/* istanbul ignore next: Sanity code */
					if (!this[node.type]) {
						throw new _exception2['default']('Unknown type: ' + node.type, node);
					}

					this.sourceNode.unshift(node);
					var ret = this[node.type](node);
					this.sourceNode.shift();
					return ret;
				},

				Program: function Program(program) {
					this.options.blockParams.unshift(program.blockParams);

					var body = program.body,
					    bodyLength = body.length;
					for (var i = 0; i < bodyLength; i++) {
						this.accept(body[i]);
					}

					this.options.blockParams.shift();

					this.isSimple = bodyLength === 1;
					this.blockParams = program.blockParams ? program.blockParams.length : 0;

					return this;
				},

				BlockStatement: function BlockStatement(block) {
					transformLiteralToPath(block);

					var program = block.program,
					    inverse = block.inverse;

					program = program && this.compileProgram(program);
					inverse = inverse && this.compileProgram(inverse);

					var type = this.classifySexpr(block);

					if (type === 'helper') {
						this.helperSexpr(block, program, inverse);
					} else if (type === 'simple') {
						this.simpleSexpr(block);

						// now that the simple mustache is resolved, we need to
						// evaluate it by executing `blockHelperMissing`
						this.opcode('pushProgram', program);
						this.opcode('pushProgram', inverse);
						this.opcode('emptyHash');
						this.opcode('blockValue', block.path.original);
					} else {
						this.ambiguousSexpr(block, program, inverse);

						// now that the simple mustache is resolved, we need to
						// evaluate it by executing `blockHelperMissing`
						this.opcode('pushProgram', program);
						this.opcode('pushProgram', inverse);
						this.opcode('emptyHash');
						this.opcode('ambiguousBlockValue');
					}

					this.opcode('append');
				},

				DecoratorBlock: function DecoratorBlock(decorator) {
					var program = decorator.program && this.compileProgram(decorator.program);
					var params = this.setupFullMustacheParams(decorator, program, undefined),
					    path = decorator.path;

					this.useDecorators = true;
					this.opcode('registerDecorator', params.length, path.original);
				},

				PartialStatement: function PartialStatement(partial) {
					this.usePartial = true;

					var program = partial.program;
					if (program) {
						program = this.compileProgram(partial.program);
					}

					var params = partial.params;
					if (params.length > 1) {
						throw new _exception2['default']('Unsupported number of partial arguments: ' + params.length, partial);
					} else if (!params.length) {
						if (this.options.explicitPartialContext) {
							this.opcode('pushLiteral', 'undefined');
						} else {
							params.push({ type: 'PathExpression', parts: [], depth: 0 });
						}
					}

					var partialName = partial.name.original,
					    isDynamic = partial.name.type === 'SubExpression';
					if (isDynamic) {
						this.accept(partial.name);
					}

					this.setupFullMustacheParams(partial, program, undefined, true);

					var indent = partial.indent || '';
					if (this.options.preventIndent && indent) {
						this.opcode('appendContent', indent);
						indent = '';
					}

					this.opcode('invokePartial', isDynamic, partialName, indent);
					this.opcode('append');
				},
				PartialBlockStatement: function PartialBlockStatement(partialBlock) {
					this.PartialStatement(partialBlock);
				},

				MustacheStatement: function MustacheStatement(mustache) {
					this.SubExpression(mustache);

					if (mustache.escaped && !this.options.noEscape) {
						this.opcode('appendEscaped');
					} else {
						this.opcode('append');
					}
				},
				Decorator: function Decorator(decorator) {
					this.DecoratorBlock(decorator);
				},

				ContentStatement: function ContentStatement(content) {
					if (content.value) {
						this.opcode('appendContent', content.value);
					}
				},

				CommentStatement: function CommentStatement() {},

				SubExpression: function SubExpression(sexpr) {
					transformLiteralToPath(sexpr);
					var type = this.classifySexpr(sexpr);

					if (type === 'simple') {
						this.simpleSexpr(sexpr);
					} else if (type === 'helper') {
						this.helperSexpr(sexpr);
					} else {
						this.ambiguousSexpr(sexpr);
					}
				},
				ambiguousSexpr: function ambiguousSexpr(sexpr, program, inverse) {
					var path = sexpr.path,
					    name = path.parts[0],
					    isBlock = program != null || inverse != null;

					this.opcode('getContext', path.depth);

					this.opcode('pushProgram', program);
					this.opcode('pushProgram', inverse);

					path.strict = true;
					this.accept(path);

					this.opcode('invokeAmbiguous', name, isBlock);
				},

				simpleSexpr: function simpleSexpr(sexpr) {
					var path = sexpr.path;
					path.strict = true;
					this.accept(path);
					this.opcode('resolvePossibleLambda');
				},

				helperSexpr: function helperSexpr(sexpr, program, inverse) {
					var params = this.setupFullMustacheParams(sexpr, program, inverse),
					    path = sexpr.path,
					    name = path.parts[0];

					if (this.options.knownHelpers[name]) {
						this.opcode('invokeKnownHelper', params.length, name);
					} else if (this.options.knownHelpersOnly) {
						throw new _exception2['default']('You specified knownHelpersOnly, but used the unknown helper ' + name, sexpr);
					} else {
						path.strict = true;
						path.falsy = true;

						this.accept(path);
						this.opcode('invokeHelper', params.length, path.original, _ast2['default'].helpers.simpleId(path));
					}
				},

				PathExpression: function PathExpression(path) {
					this.addDepth(path.depth);
					this.opcode('getContext', path.depth);

					var name = path.parts[0],
					    scoped = _ast2['default'].helpers.scopedId(path),
					    blockParamId = !path.depth && !scoped && this.blockParamIndex(name);

					if (blockParamId) {
						this.opcode('lookupBlockParam', blockParamId, path.parts);
					} else if (!name) {
						// Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
						this.opcode('pushContext');
					} else if (path.data) {
						this.options.data = true;
						this.opcode('lookupData', path.depth, path.parts, path.strict);
					} else {
						this.opcode('lookupOnContext', path.parts, path.falsy, path.strict, scoped);
					}
				},

				StringLiteral: function StringLiteral(string) {
					this.opcode('pushString', string.value);
				},

				NumberLiteral: function NumberLiteral(number) {
					this.opcode('pushLiteral', number.value);
				},

				BooleanLiteral: function BooleanLiteral(bool) {
					this.opcode('pushLiteral', bool.value);
				},

				UndefinedLiteral: function UndefinedLiteral() {
					this.opcode('pushLiteral', 'undefined');
				},

				NullLiteral: function NullLiteral() {
					this.opcode('pushLiteral', 'null');
				},

				Hash: function Hash(hash) {
					var pairs = hash.pairs,
					    i = 0,
					    l = pairs.length;

					this.opcode('pushHash');

					for (; i < l; i++) {
						this.pushParam(pairs[i].value);
					}
					while (i--) {
						this.opcode('assignToHash', pairs[i].key);
					}
					this.opcode('popHash');
				},

				// HELPERS
				opcode: function opcode(name) {
					this.opcodes.push({ opcode: name, args: slice.call(arguments, 1), loc: this.sourceNode[0].loc });
				},

				addDepth: function addDepth(depth) {
					if (!depth) {
						return;
					}

					this.useDepths = true;
				},

				classifySexpr: function classifySexpr(sexpr) {
					var isSimple = _ast2['default'].helpers.simpleId(sexpr.path);

					var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);

					// a mustache is an eligible helper if:
					// * its id is simple (a single part, not `this` or `..`)
					var isHelper = !isBlockParam && _ast2['default'].helpers.helperExpression(sexpr);

					// if a mustache is an eligible helper but not a definite
					// helper, it is ambiguous, and will be resolved in a later
					// pass or at runtime.
					var isEligible = !isBlockParam && (isHelper || isSimple);

					// if ambiguous, we can possibly resolve the ambiguity now
					// An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
					if (isEligible && !isHelper) {
						var _name2 = sexpr.path.parts[0],
						    options = this.options;

						if (options.knownHelpers[_name2]) {
							isHelper = true;
						} else if (options.knownHelpersOnly) {
							isEligible = false;
						}
					}

					if (isHelper) {
						return 'helper';
					} else if (isEligible) {
						return 'ambiguous';
					} else {
						return 'simple';
					}
				},

				pushParams: function pushParams(params) {
					for (var i = 0, l = params.length; i < l; i++) {
						this.pushParam(params[i]);
					}
				},

				pushParam: function pushParam(val) {
					var value = val.value != null ? val.value : val.original || '';

					if (this.stringParams) {
						if (value.replace) {
							value = value.replace(/^(\.?\.\/)*/g, '').replace(/\//g, '.');
						}

						if (val.depth) {
							this.addDepth(val.depth);
						}
						this.opcode('getContext', val.depth || 0);
						this.opcode('pushStringParam', value, val.type);

						if (val.type === 'SubExpression') {
							// SubExpressions get evaluated and passed in
							// in string params mode.
							this.accept(val);
						}
					} else {
						if (this.trackIds) {
							var blockParamIndex = undefined;
							if (val.parts && !_ast2['default'].helpers.scopedId(val) && !val.depth) {
								blockParamIndex = this.blockParamIndex(val.parts[0]);
							}
							if (blockParamIndex) {
								var blockParamChild = val.parts.slice(1).join('.');
								this.opcode('pushId', 'BlockParam', blockParamIndex, blockParamChild);
							} else {
								value = val.original || value;
								if (value.replace) {
									value = value.replace(/^this(?:\.|$)/, '').replace(/^\.\//, '').replace(/^\.$/, '');
								}

								this.opcode('pushId', val.type, value);
							}
						}
						this.accept(val);
					}
				},

				setupFullMustacheParams: function setupFullMustacheParams(sexpr, program, inverse, omitEmpty) {
					var params = sexpr.params;
					this.pushParams(params);

					this.opcode('pushProgram', program);
					this.opcode('pushProgram', inverse);

					if (sexpr.hash) {
						this.accept(sexpr.hash);
					} else {
						this.opcode('emptyHash', omitEmpty);
					}

					return params;
				},

				blockParamIndex: function blockParamIndex(name) {
					for (var depth = 0, len = this.options.blockParams.length; depth < len; depth++) {
						var blockParams = this.options.blockParams[depth],
						    param = blockParams && _utils.indexOf(blockParams, name);
						if (blockParams && param >= 0) {
							return [depth, param];
						}
					}
				}
			};

			function precompile(input, options, env) {
				if (input == null || typeof input !== 'string' && input.type !== 'Program') {
					throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.precompile. You passed ' + input);
				}

				options = options || {};
				if (!('data' in options)) {
					options.data = true;
				}
				if (options.compat) {
					options.useDepths = true;
				}

				var ast = env.parse(input, options),
				    environment = new env.Compiler().compile(ast, options);
				return new env.JavaScriptCompiler().compile(environment, options);
			}

			function compile(input, options, env) {
				if (options === undefined) options = {};

				if (input == null || typeof input !== 'string' && input.type !== 'Program') {
					throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.compile. You passed ' + input);
				}

				options = _utils.extend({}, options);
				if (!('data' in options)) {
					options.data = true;
				}
				if (options.compat) {
					options.useDepths = true;
				}

				var compiled = undefined;

				function compileInput() {
					var ast = env.parse(input, options),
					    environment = new env.Compiler().compile(ast, options),
					    templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
					return env.template(templateSpec);
				}

				// Template is only compiled on first use and cached after that point.
				function ret(context, execOptions) {
					if (!compiled) {
						compiled = compileInput();
					}
					return compiled.call(this, context, execOptions);
				}
				ret._setup = function (setupOptions) {
					if (!compiled) {
						compiled = compileInput();
					}
					return compiled._setup(setupOptions);
				};
				ret._child = function (i, data, blockParams, depths) {
					if (!compiled) {
						compiled = compileInput();
					}
					return compiled._child(i, data, blockParams, depths);
				};
				return ret;
			}

			function argEquals(a, b) {
				if (a === b) {
					return true;
				}

				if (_utils.isArray(a) && _utils.isArray(b) && a.length === b.length) {
					for (var i = 0; i < a.length; i++) {
						if (!argEquals(a[i], b[i])) {
							return false;
						}
					}
					return true;
				}
			}

			function transformLiteralToPath(sexpr) {
				if (!sexpr.path.parts) {
					var literal = sexpr.path;
					// Casting to string here to make false and 0 literal values play nicely with the rest
					// of the system.
					sexpr.path = {
						type: 'PathExpression',
						data: false,
						depth: 0,
						parts: [literal.original + ''],
						original: literal.original + '',
						loc: literal.loc
					};
				}
			}

			/***/
		},
		/* 42 */
		/***/function (module, exports, __webpack_require__) {

			'use strict';

			var _interopRequireDefault = __webpack_require__(1)['default'];

			exports.__esModule = true;

			var _base = __webpack_require__(4);

			var _exception = __webpack_require__(6);

			var _exception2 = _interopRequireDefault(_exception);

			var _utils = __webpack_require__(5);

			var _codeGen = __webpack_require__(43);

			var _codeGen2 = _interopRequireDefault(_codeGen);

			function Literal(value) {
				this.value = value;
			}

			function JavaScriptCompiler() {}

			JavaScriptCompiler.prototype = {
				// PUBLIC API: You can override these methods in a subclass to provide
				// alternative compiled forms for name lookup and buffering semantics
				nameLookup: function nameLookup(parent, name /* , type*/) {
					if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
						return [parent, '.', name];
					} else {
						return [parent, '[', JSON.stringify(name), ']'];
					}
				},
				depthedLookup: function depthedLookup(name) {
					return [this.aliasable('container.lookup'), '(depths, "', name, '")'];
				},

				compilerInfo: function compilerInfo() {
					var revision = _base.COMPILER_REVISION,
					    versions = _base.REVISION_CHANGES[revision];
					return [revision, versions];
				},

				appendToBuffer: function appendToBuffer(source, location, explicit) {
					// Force a source as this simplifies the merge logic.
					if (!_utils.isArray(source)) {
						source = [source];
					}
					source = this.source.wrap(source, location);

					if (this.environment.isSimple) {
						return ['return ', source, ';'];
					} else if (explicit) {
						// This is a case where the buffer operation occurs as a child of another
						// construct, generally braces. We have to explicitly output these buffer
						// operations to ensure that the emitted code goes in the correct location.
						return ['buffer += ', source, ';'];
					} else {
						source.appendToBuffer = true;
						return source;
					}
				},

				initializeBuffer: function initializeBuffer() {
					return this.quotedString('');
				},
				// END PUBLIC API

				compile: function compile(environment, options, context, asObject) {
					this.environment = environment;
					this.options = options;
					this.stringParams = this.options.stringParams;
					this.trackIds = this.options.trackIds;
					this.precompile = !asObject;

					this.name = this.environment.name;
					this.isChild = !!context;
					this.context = context || {
						decorators: [],
						programs: [],
						environments: []
					};

					this.preamble();

					this.stackSlot = 0;
					this.stackVars = [];
					this.aliases = {};
					this.registers = { list: [] };
					this.hashes = [];
					this.compileStack = [];
					this.inlineStack = [];
					this.blockParams = [];

					this.compileChildren(environment, options);

					this.useDepths = this.useDepths || environment.useDepths || environment.useDecorators || this.options.compat;
					this.useBlockParams = this.useBlockParams || environment.useBlockParams;

					var opcodes = environment.opcodes,
					    opcode = undefined,
					    firstLoc = undefined,
					    i = undefined,
					    l = undefined;

					for (i = 0, l = opcodes.length; i < l; i++) {
						opcode = opcodes[i];

						this.source.currentLocation = opcode.loc;
						firstLoc = firstLoc || opcode.loc;
						this[opcode.opcode].apply(this, opcode.args);
					}

					// Flush any trailing content that might be pending.
					this.source.currentLocation = firstLoc;
					this.pushSource('');

					/* istanbul ignore next */
					if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
						throw new _exception2['default']('Compile completed with content left on stack');
					}

					if (!this.decorators.isEmpty()) {
						this.useDecorators = true;

						this.decorators.prepend('var decorators = container.decorators;\n');
						this.decorators.push('return fn;');

						if (asObject) {
							this.decorators = Function.apply(this, ['fn', 'props', 'container', 'depth0', 'data', 'blockParams', 'depths', this.decorators.merge()]);
						} else {
							this.decorators.prepend('function(fn, props, container, depth0, data, blockParams, depths) {\n');
							this.decorators.push('}\n');
							this.decorators = this.decorators.merge();
						}
					} else {
						this.decorators = undefined;
					}

					var fn = this.createFunctionContext(asObject);
					if (!this.isChild) {
						var ret = {
							compiler: this.compilerInfo(),
							main: fn
						};

						if (this.decorators) {
							ret.main_d = this.decorators; // eslint-disable-line camelcase
							ret.useDecorators = true;
						}

						var _context = this.context;
						var programs = _context.programs;
						var decorators = _context.decorators;

						for (i = 0, l = programs.length; i < l; i++) {
							if (programs[i]) {
								ret[i] = programs[i];
								if (decorators[i]) {
									ret[i + '_d'] = decorators[i];
									ret.useDecorators = true;
								}
							}
						}

						if (this.environment.usePartial) {
							ret.usePartial = true;
						}
						if (this.options.data) {
							ret.useData = true;
						}
						if (this.useDepths) {
							ret.useDepths = true;
						}
						if (this.useBlockParams) {
							ret.useBlockParams = true;
						}
						if (this.options.compat) {
							ret.compat = true;
						}

						if (!asObject) {
							ret.compiler = JSON.stringify(ret.compiler);

							this.source.currentLocation = { start: { line: 1, column: 0 } };
							ret = this.objectLiteral(ret);

							if (options.srcName) {
								ret = ret.toStringWithSourceMap({ file: options.destName });
								ret.map = ret.map && ret.map.toString();
							} else {
								ret = ret.toString();
							}
						} else {
							ret.compilerOptions = this.options;
						}

						return ret;
					} else {
						return fn;
					}
				},

				preamble: function preamble() {
					// track the last context pushed into place to allow skipping the
					// getContext opcode when it would be a noop
					this.lastContext = 0;
					this.source = new _codeGen2['default'](this.options.srcName);
					this.decorators = new _codeGen2['default'](this.options.srcName);
				},

				createFunctionContext: function createFunctionContext(asObject) {
					var varDeclarations = '';

					var locals = this.stackVars.concat(this.registers.list);
					if (locals.length > 0) {
						varDeclarations += ', ' + locals.join(', ');
					}

					// Generate minimizer alias mappings
					//
					// When using true SourceNodes, this will update all references to the given alias
					// as the source nodes are reused in situ. For the non-source node compilation mode,
					// aliases will not be used, but this case is already being run on the client and
					// we aren't concern about minimizing the template size.
					var aliasCount = 0;
					for (var alias in this.aliases) {
						// eslint-disable-line guard-for-in
						var node = this.aliases[alias];

						if (this.aliases.hasOwnProperty(alias) && node.children && node.referenceCount > 1) {
							varDeclarations += ', alias' + ++aliasCount + '=' + alias;
							node.children[0] = 'alias' + aliasCount;
						}
					}

					var params = ['container', 'depth0', 'helpers', 'partials', 'data'];

					if (this.useBlockParams || this.useDepths) {
						params.push('blockParams');
					}
					if (this.useDepths) {
						params.push('depths');
					}

					// Perform a second pass over the output to merge content when possible
					var source = this.mergeSource(varDeclarations);

					if (asObject) {
						params.push(source);

						return Function.apply(this, params);
					} else {
						return this.source.wrap(['function(', params.join(','), ') {\n  ', source, '}']);
					}
				},
				mergeSource: function mergeSource(varDeclarations) {
					var isSimple = this.environment.isSimple,
					    appendOnly = !this.forceBuffer,
					    appendFirst = undefined,
					    sourceSeen = undefined,
					    bufferStart = undefined,
					    bufferEnd = undefined;
					this.source.each(function (line) {
						if (line.appendToBuffer) {
							if (bufferStart) {
								line.prepend('  + ');
							} else {
								bufferStart = line;
							}
							bufferEnd = line;
						} else {
							if (bufferStart) {
								if (!sourceSeen) {
									appendFirst = true;
								} else {
									bufferStart.prepend('buffer += ');
								}
								bufferEnd.add(';');
								bufferStart = bufferEnd = undefined;
							}

							sourceSeen = true;
							if (!isSimple) {
								appendOnly = false;
							}
						}
					});

					if (appendOnly) {
						if (bufferStart) {
							bufferStart.prepend('return ');
							bufferEnd.add(';');
						} else if (!sourceSeen) {
							this.source.push('return "";');
						}
					} else {
						varDeclarations += ', buffer = ' + (appendFirst ? '' : this.initializeBuffer());

						if (bufferStart) {
							bufferStart.prepend('return buffer + ');
							bufferEnd.add(';');
						} else {
							this.source.push('return buffer;');
						}
					}

					if (varDeclarations) {
						this.source.prepend('var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n'));
					}

					return this.source.merge();
				},

				// [blockValue]
				//
				// On stack, before: hash, inverse, program, value
				// On stack, after: return value of blockHelperMissing
				//
				// The purpose of this opcode is to take a block of the form
				// `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
				// replace it on the stack with the result of properly
				// invoking blockHelperMissing.
				blockValue: function blockValue(name) {
					var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
					    params = [this.contextName(0)];
					this.setupHelperArgs(name, 0, params);

					var blockName = this.popStack();
					params.splice(1, 0, blockName);

					this.push(this.source.functionCall(blockHelperMissing, 'call', params));
				},

				// [ambiguousBlockValue]
				//
				// On stack, before: hash, inverse, program, value
				// Compiler value, before: lastHelper=value of last found helper, if any
				// On stack, after, if no lastHelper: same as [blockValue]
				// On stack, after, if lastHelper: value
				ambiguousBlockValue: function ambiguousBlockValue() {
					// We're being a bit cheeky and reusing the options value from the prior exec
					var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
					    params = [this.contextName(0)];
					this.setupHelperArgs('', 0, params, true);

					this.flushInline();

					var current = this.topStack();
					params.splice(1, 0, current);

					this.pushSource(['if (!', this.lastHelper, ') { ', current, ' = ', this.source.functionCall(blockHelperMissing, 'call', params), '}']);
				},

				// [appendContent]
				//
				// On stack, before: ...
				// On stack, after: ...
				//
				// Appends the string value of `content` to the current buffer
				appendContent: function appendContent(content) {
					if (this.pendingContent) {
						content = this.pendingContent + content;
					} else {
						this.pendingLocation = this.source.currentLocation;
					}

					this.pendingContent = content;
				},

				// [append]
				//
				// On stack, before: value, ...
				// On stack, after: ...
				//
				// Coerces `value` to a String and appends it to the current buffer.
				//
				// If `value` is truthy, or 0, it is coerced into a string and appended
				// Otherwise, the empty string is appended
				append: function append() {
					if (this.isInline()) {
						this.replaceStack(function (current) {
							return [' != null ? ', current, ' : ""'];
						});

						this.pushSource(this.appendToBuffer(this.popStack()));
					} else {
						var local = this.popStack();
						this.pushSource(['if (', local, ' != null) { ', this.appendToBuffer(local, undefined, true), ' }']);
						if (this.environment.isSimple) {
							this.pushSource(['else { ', this.appendToBuffer("''", undefined, true), ' }']);
						}
					}
				},

				// [appendEscaped]
				//
				// On stack, before: value, ...
				// On stack, after: ...
				//
				// Escape `value` and append it to the buffer
				appendEscaped: function appendEscaped() {
					this.pushSource(this.appendToBuffer([this.aliasable('container.escapeExpression'), '(', this.popStack(), ')']));
				},

				// [getContext]
				//
				// On stack, before: ...
				// On stack, after: ...
				// Compiler value, after: lastContext=depth
				//
				// Set the value of the `lastContext` compiler value to the depth
				getContext: function getContext(depth) {
					this.lastContext = depth;
				},

				// [pushContext]
				//
				// On stack, before: ...
				// On stack, after: currentContext, ...
				//
				// Pushes the value of the current context onto the stack.
				pushContext: function pushContext() {
					this.pushStackLiteral(this.contextName(this.lastContext));
				},

				// [lookupOnContext]
				//
				// On stack, before: ...
				// On stack, after: currentContext[name], ...
				//
				// Looks up the value of `name` on the current context and pushes
				// it onto the stack.
				lookupOnContext: function lookupOnContext(parts, falsy, strict, scoped) {
					var i = 0;

					if (!scoped && this.options.compat && !this.lastContext) {
						// The depthed query is expected to handle the undefined logic for the root level that
						// is implemented below, so we evaluate that directly in compat mode
						this.push(this.depthedLookup(parts[i++]));
					} else {
						this.pushContext();
					}

					this.resolvePath('context', parts, i, falsy, strict);
				},

				// [lookupBlockParam]
				//
				// On stack, before: ...
				// On stack, after: blockParam[name], ...
				//
				// Looks up the value of `parts` on the given block param and pushes
				// it onto the stack.
				lookupBlockParam: function lookupBlockParam(blockParamId, parts) {
					this.useBlockParams = true;

					this.push(['blockParams[', blockParamId[0], '][', blockParamId[1], ']']);
					this.resolvePath('context', parts, 1);
				},

				// [lookupData]
				//
				// On stack, before: ...
				// On stack, after: data, ...
				//
				// Push the data lookup operator
				lookupData: function lookupData(depth, parts, strict) {
					if (!depth) {
						this.pushStackLiteral('data');
					} else {
						this.pushStackLiteral('container.data(data, ' + depth + ')');
					}

					this.resolvePath('data', parts, 0, true, strict);
				},

				resolvePath: function resolvePath(type, parts, i, falsy, strict) {
					// istanbul ignore next

					var _this = this;

					if (this.options.strict || this.options.assumeObjects) {
						this.push(strictLookup(this.options.strict && strict, this, parts, type));
						return;
					}

					var len = parts.length;
					for (; i < len; i++) {
						/* eslint-disable no-loop-func */
						this.replaceStack(function (current) {
							var lookup = _this.nameLookup(current, parts[i], type);
							// We want to ensure that zero and false are handled properly if the context (falsy flag)
							// needs to have the special handling for these values.
							if (!falsy) {
								return [' != null ? ', lookup, ' : ', current];
							} else {
								// Otherwise we can use generic falsy handling
								return [' && ', lookup];
							}
						});
						/* eslint-enable no-loop-func */
					}
				},

				// [resolvePossibleLambda]
				//
				// On stack, before: value, ...
				// On stack, after: resolved value, ...
				//
				// If the `value` is a lambda, replace it on the stack by
				// the return value of the lambda
				resolvePossibleLambda: function resolvePossibleLambda() {
					this.push([this.aliasable('container.lambda'), '(', this.popStack(), ', ', this.contextName(0), ')']);
				},

				// [pushStringParam]
				//
				// On stack, before: ...
				// On stack, after: string, currentContext, ...
				//
				// This opcode is designed for use in string mode, which
				// provides the string value of a parameter along with its
				// depth rather than resolving it immediately.
				pushStringParam: function pushStringParam(string, type) {
					this.pushContext();
					this.pushString(type);

					// If it's a subexpression, the string result
					// will be pushed after this opcode.
					if (type !== 'SubExpression') {
						if (typeof string === 'string') {
							this.pushString(string);
						} else {
							this.pushStackLiteral(string);
						}
					}
				},

				emptyHash: function emptyHash(omitEmpty) {
					if (this.trackIds) {
						this.push('{}'); // hashIds
					}
					if (this.stringParams) {
						this.push('{}'); // hashContexts
						this.push('{}'); // hashTypes
					}
					this.pushStackLiteral(omitEmpty ? 'undefined' : '{}');
				},
				pushHash: function pushHash() {
					if (this.hash) {
						this.hashes.push(this.hash);
					}
					this.hash = { values: [], types: [], contexts: [], ids: [] };
				},
				popHash: function popHash() {
					var hash = this.hash;
					this.hash = this.hashes.pop();

					if (this.trackIds) {
						this.push(this.objectLiteral(hash.ids));
					}
					if (this.stringParams) {
						this.push(this.objectLiteral(hash.contexts));
						this.push(this.objectLiteral(hash.types));
					}

					this.push(this.objectLiteral(hash.values));
				},

				// [pushString]
				//
				// On stack, before: ...
				// On stack, after: quotedString(string), ...
				//
				// Push a quoted version of `string` onto the stack
				pushString: function pushString(string) {
					this.pushStackLiteral(this.quotedString(string));
				},

				// [pushLiteral]
				//
				// On stack, before: ...
				// On stack, after: value, ...
				//
				// Pushes a value onto the stack. This operation prevents
				// the compiler from creating a temporary variable to hold
				// it.
				pushLiteral: function pushLiteral(value) {
					this.pushStackLiteral(value);
				},

				// [pushProgram]
				//
				// On stack, before: ...
				// On stack, after: program(guid), ...
				//
				// Push a program expression onto the stack. This takes
				// a compile-time guid and converts it into a runtime-accessible
				// expression.
				pushProgram: function pushProgram(guid) {
					if (guid != null) {
						this.pushStackLiteral(this.programExpression(guid));
					} else {
						this.pushStackLiteral(null);
					}
				},

				// [registerDecorator]
				//
				// On stack, before: hash, program, params..., ...
				// On stack, after: ...
				//
				// Pops off the decorator's parameters, invokes the decorator,
				// and inserts the decorator into the decorators list.
				registerDecorator: function registerDecorator(paramSize, name) {
					var foundDecorator = this.nameLookup('decorators', name, 'decorator'),
					    options = this.setupHelperArgs(name, paramSize);

					this.decorators.push(['fn = ', this.decorators.functionCall(foundDecorator, '', ['fn', 'props', 'container', options]), ' || fn;']);
				},

				// [invokeHelper]
				//
				// On stack, before: hash, inverse, program, params..., ...
				// On stack, after: result of helper invocation
				//
				// Pops off the helper's parameters, invokes the helper,
				// and pushes the helper's return value onto the stack.
				//
				// If the helper is not found, `helperMissing` is called.
				invokeHelper: function invokeHelper(paramSize, name, isSimple) {
					var nonHelper = this.popStack(),
					    helper = this.setupHelper(paramSize, name),
					    simple = isSimple ? [helper.name, ' || '] : '';

					var lookup = ['('].concat(simple, nonHelper);
					if (!this.options.strict) {
						lookup.push(' || ', this.aliasable('helpers.helperMissing'));
					}
					lookup.push(')');

					this.push(this.source.functionCall(lookup, 'call', helper.callParams));
				},

				// [invokeKnownHelper]
				//
				// On stack, before: hash, inverse, program, params..., ...
				// On stack, after: result of helper invocation
				//
				// This operation is used when the helper is known to exist,
				// so a `helperMissing` fallback is not required.
				invokeKnownHelper: function invokeKnownHelper(paramSize, name) {
					var helper = this.setupHelper(paramSize, name);
					this.push(this.source.functionCall(helper.name, 'call', helper.callParams));
				},

				// [invokeAmbiguous]
				//
				// On stack, before: hash, inverse, program, params..., ...
				// On stack, after: result of disambiguation
				//
				// This operation is used when an expression like `{{foo}}`
				// is provided, but we don't know at compile-time whether it
				// is a helper or a path.
				//
				// This operation emits more code than the other options,
				// and can be avoided by passing the `knownHelpers` and
				// `knownHelpersOnly` flags at compile-time.
				invokeAmbiguous: function invokeAmbiguous(name, helperCall) {
					this.useRegister('helper');

					var nonHelper = this.popStack();

					this.emptyHash();
					var helper = this.setupHelper(0, name, helperCall);

					var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

					var lookup = ['(', '(helper = ', helperName, ' || ', nonHelper, ')'];
					if (!this.options.strict) {
						lookup[0] = '(helper = ';
						lookup.push(' != null ? helper : ', this.aliasable('helpers.helperMissing'));
					}

					this.push(['(', lookup, helper.paramsInit ? ['),(', helper.paramsInit] : [], '),', '(typeof helper === ', this.aliasable('"function"'), ' ? ', this.source.functionCall('helper', 'call', helper.callParams), ' : helper))']);
				},

				// [invokePartial]
				//
				// On stack, before: context, ...
				// On stack after: result of partial invocation
				//
				// This operation pops off a context, invokes a partial with that context,
				// and pushes the result of the invocation back.
				invokePartial: function invokePartial(isDynamic, name, indent) {
					var params = [],
					    options = this.setupParams(name, 1, params);

					if (isDynamic) {
						name = this.popStack();
						delete options.name;
					}

					if (indent) {
						options.indent = JSON.stringify(indent);
					}
					options.helpers = 'helpers';
					options.partials = 'partials';
					options.decorators = 'container.decorators';

					if (!isDynamic) {
						params.unshift(this.nameLookup('partials', name, 'partial'));
					} else {
						params.unshift(name);
					}

					if (this.options.compat) {
						options.depths = 'depths';
					}
					options = this.objectLiteral(options);
					params.push(options);

					this.push(this.source.functionCall('container.invokePartial', '', params));
				},

				// [assignToHash]
				//
				// On stack, before: value, ..., hash, ...
				// On stack, after: ..., hash, ...
				//
				// Pops a value off the stack and assigns it to the current hash
				assignToHash: function assignToHash(key) {
					var value = this.popStack(),
					    context = undefined,
					    type = undefined,
					    id = undefined;

					if (this.trackIds) {
						id = this.popStack();
					}
					if (this.stringParams) {
						type = this.popStack();
						context = this.popStack();
					}

					var hash = this.hash;
					if (context) {
						hash.contexts[key] = context;
					}
					if (type) {
						hash.types[key] = type;
					}
					if (id) {
						hash.ids[key] = id;
					}
					hash.values[key] = value;
				},

				pushId: function pushId(type, name, child) {
					if (type === 'BlockParam') {
						this.pushStackLiteral('blockParams[' + name[0] + '].path[' + name[1] + ']' + (child ? ' + ' + JSON.stringify('.' + child) : ''));
					} else if (type === 'PathExpression') {
						this.pushString(name);
					} else if (type === 'SubExpression') {
						this.pushStackLiteral('true');
					} else {
						this.pushStackLiteral('null');
					}
				},

				// HELPERS

				compiler: JavaScriptCompiler,

				compileChildren: function compileChildren(environment, options) {
					var children = environment.children,
					    child = undefined,
					    compiler = undefined;

					for (var i = 0, l = children.length; i < l; i++) {
						child = children[i];
						compiler = new this.compiler(); // eslint-disable-line new-cap

						var existing = this.matchExistingProgram(child);

						if (existing == null) {
							this.context.programs.push(''); // Placeholder to prevent name conflicts for nested children
							var index = this.context.programs.length;
							child.index = index;
							child.name = 'program' + index;
							this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
							this.context.decorators[index] = compiler.decorators;
							this.context.environments[index] = child;

							this.useDepths = this.useDepths || compiler.useDepths;
							this.useBlockParams = this.useBlockParams || compiler.useBlockParams;
							child.useDepths = this.useDepths;
							child.useBlockParams = this.useBlockParams;
						} else {
							child.index = existing.index;
							child.name = 'program' + existing.index;

							this.useDepths = this.useDepths || existing.useDepths;
							this.useBlockParams = this.useBlockParams || existing.useBlockParams;
						}
					}
				},
				matchExistingProgram: function matchExistingProgram(child) {
					for (var i = 0, len = this.context.environments.length; i < len; i++) {
						var environment = this.context.environments[i];
						if (environment && environment.equals(child)) {
							return environment;
						}
					}
				},

				programExpression: function programExpression(guid) {
					var child = this.environment.children[guid],
					    programParams = [child.index, 'data', child.blockParams];

					if (this.useBlockParams || this.useDepths) {
						programParams.push('blockParams');
					}
					if (this.useDepths) {
						programParams.push('depths');
					}

					return 'container.program(' + programParams.join(', ') + ')';
				},

				useRegister: function useRegister(name) {
					if (!this.registers[name]) {
						this.registers[name] = true;
						this.registers.list.push(name);
					}
				},

				push: function push(expr) {
					if (!(expr instanceof Literal)) {
						expr = this.source.wrap(expr);
					}

					this.inlineStack.push(expr);
					return expr;
				},

				pushStackLiteral: function pushStackLiteral(item) {
					this.push(new Literal(item));
				},

				pushSource: function pushSource(source) {
					if (this.pendingContent) {
						this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
						this.pendingContent = undefined;
					}

					if (source) {
						this.source.push(source);
					}
				},

				replaceStack: function replaceStack(callback) {
					var prefix = ['('],
					    stack = undefined,
					    createdStack = undefined,
					    usedLiteral = undefined;

					/* istanbul ignore next */
					if (!this.isInline()) {
						throw new _exception2['default']('replaceStack on non-inline');
					}

					// We want to merge the inline statement into the replacement statement via ','
					var top = this.popStack(true);

					if (top instanceof Literal) {
						// Literals do not need to be inlined
						stack = [top.value];
						prefix = ['(', stack];
						usedLiteral = true;
					} else {
						// Get or create the current stack name for use by the inline
						createdStack = true;
						var _name = this.incrStack();

						prefix = ['((', this.push(_name), ' = ', top, ')'];
						stack = this.topStack();
					}

					var item = callback.call(this, stack);

					if (!usedLiteral) {
						this.popStack();
					}
					if (createdStack) {
						this.stackSlot--;
					}
					this.push(prefix.concat(item, ')'));
				},

				incrStack: function incrStack() {
					this.stackSlot++;
					if (this.stackSlot > this.stackVars.length) {
						this.stackVars.push('stack' + this.stackSlot);
					}
					return this.topStackName();
				},
				topStackName: function topStackName() {
					return 'stack' + this.stackSlot;
				},
				flushInline: function flushInline() {
					var inlineStack = this.inlineStack;
					this.inlineStack = [];
					for (var i = 0, len = inlineStack.length; i < len; i++) {
						var entry = inlineStack[i];
						/* istanbul ignore if */
						if (entry instanceof Literal) {
							this.compileStack.push(entry);
						} else {
							var stack = this.incrStack();
							this.pushSource([stack, ' = ', entry, ';']);
							this.compileStack.push(stack);
						}
					}
				},
				isInline: function isInline() {
					return this.inlineStack.length;
				},

				popStack: function popStack(wrapped) {
					var inline = this.isInline(),
					    item = (inline ? this.inlineStack : this.compileStack).pop();

					if (!wrapped && item instanceof Literal) {
						return item.value;
					} else {
						if (!inline) {
							/* istanbul ignore next */
							if (!this.stackSlot) {
								throw new _exception2['default']('Invalid stack pop');
							}
							this.stackSlot--;
						}
						return item;
					}
				},

				topStack: function topStack() {
					var stack = this.isInline() ? this.inlineStack : this.compileStack,
					    item = stack[stack.length - 1];

					/* istanbul ignore if */
					if (item instanceof Literal) {
						return item.value;
					} else {
						return item;
					}
				},

				contextName: function contextName(context) {
					if (this.useDepths && context) {
						return 'depths[' + context + ']';
					} else {
						return 'depth' + context;
					}
				},

				quotedString: function quotedString(str) {
					return this.source.quotedString(str);
				},

				objectLiteral: function objectLiteral(obj) {
					return this.source.objectLiteral(obj);
				},

				aliasable: function aliasable(name) {
					var ret = this.aliases[name];
					if (ret) {
						ret.referenceCount++;
						return ret;
					}

					ret = this.aliases[name] = this.source.wrap(name);
					ret.aliasable = true;
					ret.referenceCount = 1;

					return ret;
				},

				setupHelper: function setupHelper(paramSize, name, blockHelper) {
					var params = [],
					    paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
					var foundHelper = this.nameLookup('helpers', name, 'helper'),
					    callContext = this.aliasable(this.contextName(0) + ' != null ? ' + this.contextName(0) + ' : (container.nullContext || {})');

					return {
						params: params,
						paramsInit: paramsInit,
						name: foundHelper,
						callParams: [callContext].concat(params)
					};
				},

				setupParams: function setupParams(helper, paramSize, params) {
					var options = {},
					    contexts = [],
					    types = [],
					    ids = [],
					    objectArgs = !params,
					    param = undefined;

					if (objectArgs) {
						params = [];
					}

					options.name = this.quotedString(helper);
					options.hash = this.popStack();

					if (this.trackIds) {
						options.hashIds = this.popStack();
					}
					if (this.stringParams) {
						options.hashTypes = this.popStack();
						options.hashContexts = this.popStack();
					}

					var inverse = this.popStack(),
					    program = this.popStack();

					// Avoid setting fn and inverse if neither are set. This allows
					// helpers to do a check for `if (options.fn)`
					if (program || inverse) {
						options.fn = program || 'container.noop';
						options.inverse = inverse || 'container.noop';
					}

					// The parameters go on to the stack in order (making sure that they are evaluated in order)
					// so we need to pop them off the stack in reverse order
					var i = paramSize;
					while (i--) {
						param = this.popStack();
						params[i] = param;

						if (this.trackIds) {
							ids[i] = this.popStack();
						}
						if (this.stringParams) {
							types[i] = this.popStack();
							contexts[i] = this.popStack();
						}
					}

					if (objectArgs) {
						options.args = this.source.generateArray(params);
					}

					if (this.trackIds) {
						options.ids = this.source.generateArray(ids);
					}
					if (this.stringParams) {
						options.types = this.source.generateArray(types);
						options.contexts = this.source.generateArray(contexts);
					}

					if (this.options.data) {
						options.data = 'data';
					}
					if (this.useBlockParams) {
						options.blockParams = 'blockParams';
					}
					return options;
				},

				setupHelperArgs: function setupHelperArgs(helper, paramSize, params, useRegister) {
					var options = this.setupParams(helper, paramSize, params);
					options = this.objectLiteral(options);
					if (useRegister) {
						this.useRegister('options');
						params.push('options');
						return ['options=', options];
					} else if (params) {
						params.push(options);
						return '';
					} else {
						return options;
					}
				}
			};

			(function () {
				var reservedWords = ('break else new var' + ' case finally return void' + ' catch for switch while' + ' continue function this with' + ' default if throw' + ' delete in try' + ' do instanceof typeof' + ' abstract enum int short' + ' boolean export interface static' + ' byte extends long super' + ' char final native synchronized' + ' class float package throws' + ' const goto private transient' + ' debugger implements protected volatile' + ' double import public let yield await' + ' null true false').split(' ');

				var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

				for (var i = 0, l = reservedWords.length; i < l; i++) {
					compilerWords[reservedWords[i]] = true;
				}
			})();

			JavaScriptCompiler.isValidJavaScriptVariableName = function (name) {
				return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
			};

			function strictLookup(requireTerminal, compiler, parts, type) {
				var stack = compiler.popStack(),
				    i = 0,
				    len = parts.length;
				if (requireTerminal) {
					len--;
				}

				for (; i < len; i++) {
					stack = compiler.nameLookup(stack, parts[i], type);
				}

				if (requireTerminal) {
					return [compiler.aliasable('container.strict'), '(', stack, ', ', compiler.quotedString(parts[i]), ')'];
				} else {
					return stack;
				}
			}

			exports['default'] = JavaScriptCompiler;
			module.exports = exports['default'];

			/***/
		},
		/* 43 */
		/***/function (module, exports, __webpack_require__) {

			/* global define */
			'use strict';

			exports.__esModule = true;

			var _utils = __webpack_require__(5);

			var SourceNode = undefined;

			try {
				/* istanbul ignore next */
				if (false) {
					// We don't support this in AMD environments. For these environments, we asusme that
					// they are running on the browser and thus have no need for the source-map library.
					var SourceMap = require('source-map');
					SourceNode = SourceMap.SourceNode;
				}
			} catch (err) {}
			/* NOP */

			/* istanbul ignore if: tested but not covered in istanbul due to dist build  */
			if (!SourceNode) {
				SourceNode = function SourceNode(line, column, srcFile, chunks) {
					this.src = '';
					if (chunks) {
						this.add(chunks);
					}
				};
				/* istanbul ignore next */
				SourceNode.prototype = {
					add: function add(chunks) {
						if (_utils.isArray(chunks)) {
							chunks = chunks.join('');
						}
						this.src += chunks;
					},
					prepend: function prepend(chunks) {
						if (_utils.isArray(chunks)) {
							chunks = chunks.join('');
						}
						this.src = chunks + this.src;
					},
					toStringWithSourceMap: function toStringWithSourceMap() {
						return { code: this.toString() };
					},
					toString: function toString() {
						return this.src;
					}
				};
			}

			function castChunk(chunk, codeGen, loc) {
				if (_utils.isArray(chunk)) {
					var ret = [];

					for (var i = 0, len = chunk.length; i < len; i++) {
						ret.push(codeGen.wrap(chunk[i], loc));
					}
					return ret;
				} else if (typeof chunk === 'boolean' || typeof chunk === 'number') {
					// Handle primitives that the SourceNode will throw up on
					return chunk + '';
				}
				return chunk;
			}

			function CodeGen(srcFile) {
				this.srcFile = srcFile;
				this.source = [];
			}

			CodeGen.prototype = {
				isEmpty: function isEmpty() {
					return !this.source.length;
				},
				prepend: function prepend(source, loc) {
					this.source.unshift(this.wrap(source, loc));
				},
				push: function push(source, loc) {
					this.source.push(this.wrap(source, loc));
				},

				merge: function merge() {
					var source = this.empty();
					this.each(function (line) {
						source.add(['  ', line, '\n']);
					});
					return source;
				},

				each: function each(iter) {
					for (var i = 0, len = this.source.length; i < len; i++) {
						iter(this.source[i]);
					}
				},

				empty: function empty() {
					var loc = this.currentLocation || { start: {} };
					return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
				},
				wrap: function wrap(chunk) {
					var loc = arguments.length <= 1 || arguments[1] === undefined ? this.currentLocation || { start: {} } : arguments[1];

					if (chunk instanceof SourceNode) {
						return chunk;
					}

					chunk = castChunk(chunk, this, loc);

					return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
				},

				functionCall: function functionCall(fn, type, params) {
					params = this.generateList(params);
					return this.wrap([fn, type ? '.' + type + '(' : '(', params, ')']);
				},

				quotedString: function quotedString(str) {
					return '"' + (str + '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028') // Per Ecma-262 7.3 + 7.8.4
					.replace(/\u2029/g, '\\u2029') + '"';
				},

				objectLiteral: function objectLiteral(obj) {
					var pairs = [];

					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							var value = castChunk(obj[key], this);
							if (value !== 'undefined') {
								pairs.push([this.quotedString(key), ':', value]);
							}
						}
					}

					var ret = this.generateList(pairs);
					ret.prepend('{');
					ret.add('}');
					return ret;
				},

				generateList: function generateList(entries) {
					var ret = this.empty();

					for (var i = 0, len = entries.length; i < len; i++) {
						if (i) {
							ret.add(',');
						}

						ret.add(castChunk(entries[i], this));
					}

					return ret;
				},

				generateArray: function generateArray(entries) {
					var ret = this.generateList(entries);
					ret.prepend('[');
					ret.add(']');

					return ret;
				}
			};

			exports['default'] = CodeGen;
			module.exports = exports['default'];

			/***/
		}])
	);
});
;

},{"source-map":18}],5:[function(require,module,exports){
'use strict';

var _hbs = require('./../behaviors/hbs');

var _hbs2 = _interopRequireDefault(_hbs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = Marionette.View.extend({
    template: function template(data) {
        return 'autorization';
    },
    behaviors: [_hbs2.default],
    HBTemplate: 'templates/views/athorization.hbs',
    className: 'autorization',
    ui: {
        authorize: '.authorization__btn',
        register: '.registration__btn'
    },
    events: {
        'click @ui.authorize': 'authorizeUser',
        'click @ui.register': 'registerUser'
    },
    authorizeUser: function authorizeUser(event) {
        var email = this.$('.email__input').val(),
            pass = this.$('.pass__input').val();

        var auth = firebase.auth();
        var promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(function (e) {
            alert(e.message);
        });
    },
    registerUser: function registerUser() {
        var email = this.$('.email__input').val(),
            pass = this.$('.pass__input').val();

        var auth = firebase.auth();
        var promise = auth.createUserWithEmailAndPassword(email, pass);

        promise.catch(function (e) {
            alert(e.message);
        });
    },
    onLoadTemplate: function onLoadTemplate() {
        this.render();
    }
});

},{"./../behaviors/hbs":2}],6:[function(require,module,exports){
"use strict";

var _hbs = require("./../behaviors/hbs");

var _hbs2 = _interopRequireDefault(_hbs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TaskModel = Backbone.Model.extend({
    initialize: function initialize() {
        if (!this.get("title")) {
            this.set({ "title": this.defaults.title });
        }
    },
    validate: function validate(attrs) {
        if (!$.trim(attrs.title)) {
            return 'Ошибка!';
        }
    },
    defaults: function defaults() {
        return {
            title: 'Новая задача',
            done: false
        };
    },
    toggle: function toggle() {
        this.save({ done: !this.get("done") });
    },
    clear: function clear() {
        this.destroy();
    }
});

var Task = Marionette.View.extend({
    template: function template(data) {
        return 'main view';
    },
    behaviors: [_hbs2.default],
    HBTemplate: 'templates/views/todo.item.hbs',
    tagName: 'li',
    ui: {
        "edit": "span",
        "remove": ".remove",
        "toggle": ".toggle"
    },
    events: {
        "click @ui.edit": "editTask",
        "click @ui.toggle": "toggleDone",
        'click @ui.remove': 'removeModel'
    },
    triggers: {
        'click @ui.remove': 'remove:model'
    },
    removeModel: function removeModel(event) {
        this.model.clear();
    },
    onRender: function onRender() {
        this.$el.toggleClass('done', this.model.get('done'));
    },
    editTask: function editTask() {
        var newTaskTitle = prompt('Изменить задачу', this.model.get('title'));
        this.model.save({ "title": _.escape(newTaskTitle) }, { validate: true });
    },
    toggleDone: function toggleDone(event) {
        this.model.toggle();
    },
    onLoadTemplate: function onLoadTemplate() {
        this.render();
    }
});

var TaskCollectionView = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'tasks',
    childView: Task,
    initialize: function initialize() {
        this.collection.on('change', _.bind(this.render, this));
    },
    onChildviewRemoveModel: function onChildviewRemoveModel(view) {
        this.collection.remove(view.model);
    },
    viewComparator: function viewComparator(model) {
        return model.get('done');
    }
});

module.exports = Marionette.View.extend({
    template: function template(data) {
        return 'news item';
    },
    behaviors: [_hbs2.default],
    HBTemplate: 'templates/views/current.user.hbs',
    className: 'container',
    regions: {
        list: {
            el: '#wrapper'
        }
    },
    ui: {
        logOut: '.logout__btn',
        addtask: '.addtask'
    },
    events: {
        'click @ui.logOut': 'logOut',
        'click @ui.addtask': 'addTask'
    },
    addTask: function addTask(event) {
        event.preventDefault();
        var $input = $('.add');
        var newTaskTitle = $input.val();
        newTaskTitle = _.escape(newTaskTitle);
        $input.val('');
        if (!newTaskTitle) return;
        if (newTaskTitle.length > 100) return;
        this.tasksCollection.add({ title: newTaskTitle });
    },
    logOut: function logOut() {
        firebase.auth().signOut();
    },
    initUserList: function initUserList() {
        var email = firebase.auth().currentUser.email;
        var userNickname = email.substring(0, email.indexOf('@'));

        $('.user-name').html(userNickname);
        var TasksCollection = Backbone.Firebase.Collection.extend({
            model: TaskModel,
            url: 'https://marionette-todo-app.firebaseio.com/Users/' + userNickname + ''
        });

        this.tasksCollection = new TasksCollection();
        this.taskCollectionView = new TaskCollectionView({
            collection: this.tasksCollection
        });

        this.showChildView('list', this.taskCollectionView);
    },
    onLoadTemplate: function onLoadTemplate() {
        this.render();

        this.initUserList();
    }
});

},{"./../behaviors/hbs":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hbs = require("./../behaviors/hbs");

var _hbs2 = _interopRequireDefault(_hbs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
    apiKey: "AIzaSyBF2hEBMbGKeQM3jknFstAN0W6eB7O3y2M",
    authDomain: "marionette-todo-app.firebaseapp.com",
    databaseURL: "https://marionette-todo-app.firebaseio.com",
    projectId: "marionette-todo-app",
    storageBucket: "marionette-todo-app.appspot.com",
    messagingSenderId: "269030627776"
};
firebase.initializeApp(config);

var PAGES = {
    athorization: require('./athorization'),
    user: require('./current.user')
};

exports.default = Marionette.View.extend({
    template: function template(data) {
        return 'main view';
    },
    behaviors: [_hbs2.default],
    HBTemplate: 'templates/layout.hbs',
    className: 'main-app',
    regions: {
        app: {
            el: '#application',
            replaceElement: true
        }
    },
    checkAuth: function checkAuth() {
        var _this = this;

        firebase.auth().onAuthStateChanged(function (firebaseUser) {
            if (firebaseUser) {
                console.log('User logged In');
                _this.showChildView('app', new PAGES.user());
            } else {
                console.log('Not logged In');
                _this.showChildView('app', new PAGES.athorization());
            }
        });
    },
    onLoadTemplate: function onLoadTemplate() {
        this.render();
        this.checkAuth();
    }
});

},{"./../behaviors/hbs":2,"./athorization":5,"./current.user":6}],8:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');
var has = Object.prototype.hasOwnProperty;

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = util.toSetString(aStr);
  var isDuplicate = has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    this._set[sStr] = idx;
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  var sStr = util.toSetString(aStr);
  return has.call(this._set, sStr);
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  var sStr = util.toSetString(aStr);
  if (has.call(this._set, sStr)) {
    return this._set[sStr];
  }
  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;

},{"./util":17}],9:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = require('./base64');

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

},{"./base64":10}],10:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

},{}],11:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};

},{}],12:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;

},{"./util":17}],13:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

},{}],14:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');
var binarySearch = require('./binary-search');
var ArraySet = require('./array-set').ArraySet;
var base64VLQ = require('./base64-vlq');
var quickSort = require('./quick-sort').quickSort;

function SourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap)
    : new BasicSourceMapConsumer(sourceMap);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      if (source != null && sourceRoot != null) {
        source = util.join(sourceRoot, source);
      }
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: Optional. the column number in the original source.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    if (this.sourceRoot != null) {
      needle.source = util.relative(this.sourceRoot, needle.source);
    }
    if (!this._sources.has(needle.source)) {
      return [];
    }
    needle.source = this._sources.indexOf(needle.source);

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The only parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._sources.toArray().map(function (s) {
      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
    }, this);
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          if (this.sourceRoot != null) {
            source = util.join(this.sourceRoot, source);
          }
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    if (this.sourceRoot != null) {
      aSource = util.relative(this.sourceRoot, aSource);
    }

    if (this._sources.has(aSource)) {
      return this.sourcesContent[this._sources.indexOf(aSource)];
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + aSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    if (this.sourceRoot != null) {
      source = util.relative(this.sourceRoot, source);
    }
    if (!this._sources.has(source)) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    source = this._sources.indexOf(source);

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The only parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        if (section.consumer.sourceRoot !== null) {
          source = util.join(section.consumer.sourceRoot, source);
        }
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = section.consumer._names.at(mapping.name);
        this._names.add(name);
        name = this._names.indexOf(name);

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

},{"./array-set":8,"./base64-vlq":9,"./binary-search":11,"./quick-sort":13,"./util":17}],15:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = require('./base64-vlq');
var util = require('./util');
var ArraySet = require('./array-set').ArraySet;
var MappingList = require('./mapping-list').MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;

},{"./array-set":8,"./base64-vlq":9,"./mapping-list":12,"./util":17}],16:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;
var util = require('./util');

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are removed from this array, by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var shiftNextLine = function() {
      var lineContents = remainingLines.shift();
      // The last line of a file might not have a newline.
      var newLine = remainingLines.shift() || "";
      return lineContents + newLine;
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[0];
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[0] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[0];
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[0] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLines.length > 0) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;

},{"./source-map-generator":15,"./util":17}],17:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

},{}],18:[function(require,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require('./lib/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = require('./lib/source-map-consumer').SourceMapConsumer;
exports.SourceNode = require('./lib/source-node').SourceNode;

},{"./lib/source-map-consumer":14,"./lib/source-map-generator":15,"./lib/source-node":16}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2pzL2FwcC5qcyIsImRpc3QvanMvYmVoYXZpb3JzL2hicy5qcyIsImRpc3QvanMvaW5pdGlhbGl6ZS5qcyIsImRpc3QvanMvbGlicy9oYW5kbGViYXJzLXY0LjAuMTAuanMiLCJkaXN0L2pzL3ZpZXdzL2F0aG9yaXphdGlvbi5qcyIsImRpc3QvanMvdmlld3MvY3VycmVudC51c2VyLmpzIiwiZGlzdC9qcy92aWV3cy9sYXlvdXQuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvYXJyYXktc2V0LmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2Jhc2U2NC12bHEuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvYmFzZTY0LmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2JpbmFyeS1zZWFyY2guanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvbWFwcGluZy1saXN0LmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL3F1aWNrLXNvcnQuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvc291cmNlLW1hcC1jb25zdW1lci5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9zb3VyY2UtbWFwLWdlbmVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9zb3VyY2Utbm9kZS5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi91dGlsLmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvc291cmNlLW1hcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7OztrQkFHZSxXQUFXLFdBQVgsQ0FBdUIsTUFBdkIsQ0FBOEI7QUFDNUMsU0FBUSxNQURvQztBQUU1QyxhQUFZLHNCQUFXO0FBQ3RCLE9BQUssUUFBTCxHQUFnQixFQUFoQjtBQUNB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O0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsQ0FBQyxHQUFHLEVBQUgsQ0FBRCxDQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxXQUFHLEtBQUssQ0FBUixFQUFXLElBQVgsQ0FBZ0IsR0FBRyxFQUFILENBQWhCO0FBQ0E7QUFDSixZQUFLLEdBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxDQUFDLEdBQUcsRUFBSCxDQUFELENBQVQ7QUFDQTtBQUNKLFlBQUssR0FBTDtBQUNJLFdBQUcsS0FBSyxDQUFSLEVBQVcsSUFBWCxDQUFnQixHQUFHLEVBQUgsQ0FBaEI7QUFDQTtBQXRQUjtBQXdQSCxNQWpRUTtBQWtRVCxZQUFPLENBQUMsRUFBRSxHQUFHLENBQUwsRUFBUSxHQUFHLENBQVgsRUFBYyxHQUFHLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakIsRUFBMEIsR0FBRyxDQUE3QixFQUFnQyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEMsRUFBNkMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpELEVBQTBELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RCxFQUF1RSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0UsRUFBb0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhGLEVBQWlHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFyRyxFQUE4RyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEgsRUFBMkgsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9ILEVBQXdJLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1SSxFQUFELEVBQXdKLEVBQUUsR0FBRyxDQUFDLENBQUQsQ0FBTCxFQUF4SixFQUFvSyxFQUFFLEdBQUcsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFMLEVBQXBLLEVBQW1MLEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUwsRUFBYSxHQUFHLENBQWhCLEVBQW1CLEdBQUcsQ0FBdEIsRUFBeUIsR0FBRyxDQUE1QixFQUErQixJQUFJLENBQW5DLEVBQXNDLElBQUksQ0FBMUMsRUFBNkMsSUFBSSxFQUFqRCxFQUFxRCxJQUFJLEVBQXpELEVBQTZELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFqRSxFQUEwRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBOUUsRUFBdUYsSUFBSSxFQUEzRixFQUErRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkcsRUFBNEcsSUFBSSxFQUFoSCxFQUFvSCxJQUFJLEVBQXhILEVBQTRILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoSSxFQUF5SSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0ksRUFBc0osSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQTFKLEVBQWtLLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF0SyxFQUE4SyxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBbEwsRUFBMEwsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTlMLEVBQXVNLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzTSxFQUFvTixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeE4sRUFBaU8sSUFBSSxFQUFyTyxFQUF5TyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN08sRUFBbkwsRUFBMmEsRUFBRSxHQUFHLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBTCxFQUEzYSxFQUEwYixFQUFFLEdBQUcsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFMLEVBQWMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxCLEVBQTJCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvQixFQUF3QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUMsRUFBcUQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXpELEVBQWtFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF0RSxFQUErRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkYsRUFBNEYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhHLEVBQXlHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE3RyxFQUFzSCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBMUgsRUFBbUksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXZJLEVBQWdKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFwSixFQUE2SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakssRUFBMWIsRUFBc21CLEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUwsRUFBYSxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQTdCLEVBQXFDLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QyxFQUFpRCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBckQsRUFBNkQsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpFLEVBQXlFLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUE3RSxFQUFxRixJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekYsRUFBaUcsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXJHLEVBQTZHLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqSCxFQUF5SCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBN0gsRUFBcUksSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFySixFQUF0bUIsRUFBcXdCLEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUwsRUFBYSxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQTdCLEVBQXFDLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QyxFQUFpRCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBckQsRUFBNkQsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpFLEVBQXlFLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUE3RSxFQUFxRixJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekYsRUFBaUcsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXJHLEVBQTZHLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqSCxFQUF5SCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBN0gsRUFBcUksSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFySixFQUFyd0IsRUFBbzZCLEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUwsRUFBYSxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQTdCLEVBQXFDLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QyxFQUFpRCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBckQsRUFBNkQsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpFLEVBQXlFLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUE3RSxFQUFxRixJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekYsRUFBaUcsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXJHLEVBQTZHLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqSCxFQUF5SCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBN0gsRUFBcUksSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFySixFQUFwNkIsRUFBbWtDLEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUwsRUFBYSxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQTdCLEVBQXFDLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QyxFQUFpRCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBckQsRUFBNkQsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpFLEVBQXlFLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUE3RSxFQUFxRixJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekYsRUFBaUcsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXJHLEVBQTZHLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqSCxFQUF5SCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBN0gsRUFBcUksSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFySixFQUFua0MsRUFBa3VDLEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUwsRUFBYSxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQTdCLEVBQXFDLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QyxFQUFpRCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBckQsRUFBNkQsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpFLEVBQXlFLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUE3RSxFQUFxRixJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekYsRUFBaUcsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXJHLEVBQTZHLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqSCxFQUF5SCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBN0gsRUFBcUksSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFySixFQUFsdUMsRUFBaTRDLEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUwsRUFBYSxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQTdCLEVBQXFDLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QyxFQUFpRCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBckQsRUFBNkQsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpFLEVBQXlFLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUE3RSxFQUFxRixJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekYsRUFBaUcsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXJHLEVBQTZHLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqSCxFQUF5SCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBN0gsRUFBcUksSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFySixFQUFqNEMsRUFBZ2lELEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUwsRUFBYSxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQTdCLEVBQXFDLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QyxFQUFpRCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBckQsRUFBNkQsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpFLEVBQXlFLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUE3RSxFQUFxRixJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekYsRUFBaUcsSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXJHLEVBQTZHLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqSCxFQUF5SCxJQUFJLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBN0gsRUFBcUksSUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFySixFQUFoaUQsRUFBK3JELEVBQUUsSUFBSSxFQUFOLEVBQVUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWQsRUFBdUIsSUFBSSxFQUEzQixFQUErQixJQUFJLEVBQW5DLEVBQXVDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzQyxFQUFvRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEQsRUFBaUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJFLEVBQThFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsRixFQUEyRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0YsRUFBd0csSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVHLEVBQXFILElBQUksRUFBekgsRUFBL3JELEVBQTh6RCxFQUFFLElBQUksRUFBTixFQUFVLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFkLEVBQXVCLElBQUksRUFBM0IsRUFBK0IsSUFBSSxFQUFuQyxFQUF1QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0MsRUFBb0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhELEVBQWlFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFyRSxFQUE4RSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEYsRUFBMkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9GLEVBQXdHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1RyxFQUFxSCxJQUFJLEVBQXpILEVBQTl6RCxFQUE2N0QsRUFBRSxHQUFHLEVBQUwsRUFBUyxHQUFHLENBQVosRUFBZSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkIsRUFBNEIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhDLEVBQXlDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE3QyxFQUFzRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBMUQsRUFBbUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXZFLEVBQWdGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFwRixFQUE2RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakcsRUFBMEcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTlHLEVBQXVILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzSCxFQUFvSSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEksRUFBaUosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJKLEVBQThKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsSyxFQUE3N0QsRUFBMG1FLEVBQUUsR0FBRyxFQUFMLEVBQVMsR0FBRyxDQUFaLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUExbUUsRUFBMHdFLEVBQUUsSUFBSSxFQUFOLEVBQVUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWQsRUFBdUIsSUFBSSxFQUEzQixFQUExd0UsRUFBMnlFLEVBQUUsSUFBSSxFQUFOLEVBQVUsSUFBSSxFQUFkLEVBQWtCLElBQUksRUFBdEIsRUFBMEIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTlCLEVBQXVDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzQyxFQUFvRCxJQUFJLEVBQXhELEVBQTRELElBQUksRUFBaEUsRUFBb0UsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhFLEVBQWlGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFyRixFQUE4RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEcsRUFBMkcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9HLEVBQXdILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1SCxFQUFxSSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekksRUFBa0osSUFBSSxFQUF0SixFQUEzeUUsRUFBdThFLEVBQUUsR0FBRyxFQUFMLEVBQVMsR0FBRyxDQUFaLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQXY4RSxFQUEwbEYsRUFBRSxHQUFHLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTCxFQUFjLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsQixFQUEyQixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0IsRUFBd0MsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVDLEVBQXFELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF6RCxFQUFrRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEUsRUFBK0UsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5GLEVBQTRGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoRyxFQUF5RyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0csRUFBc0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFILEVBQW1JLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2SSxFQUFnSixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEosRUFBNkosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpLLEVBQTBLLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5SyxFQUExbEYsRUFBbXhGLEVBQUUsSUFBSSxFQUFOLEVBQVUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWQsRUFBdUIsSUFBSSxFQUEzQixFQUErQixJQUFJLEVBQW5DLEVBQXVDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzQyxFQUFvRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEQsRUFBaUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJFLEVBQThFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsRixFQUEyRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0YsRUFBd0csSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVHLEVBQXFILElBQUksRUFBekgsRUFBbnhGLEVBQWs1RixFQUFFLElBQUksRUFBTixFQUFVLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFkLEVBQXVCLElBQUksRUFBM0IsRUFBK0IsSUFBSSxFQUFuQyxFQUF1QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0MsRUFBb0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhELEVBQWlFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFyRSxFQUE4RSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEYsRUFBMkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9GLEVBQXdHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1RyxFQUFxSCxJQUFJLEVBQXpILEVBQWw1RixFQUFpaEcsRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBZCxFQUF1QixJQUFJLEVBQTNCLEVBQStCLElBQUksRUFBbkMsRUFBdUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNDLEVBQW9ELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF4RCxFQUFpRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBckUsRUFBOEUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxGLEVBQTJGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvRixFQUF3RyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUcsRUFBcUgsSUFBSSxFQUF6SCxFQUFqaEcsRUFBZ3BHLEVBQUUsSUFBSSxFQUFOLEVBQVUsSUFBSSxFQUFkLEVBQWtCLElBQUksRUFBdEIsRUFBMEIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTlCLEVBQXVDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzQyxFQUFvRCxJQUFJLEVBQXhELEVBQTRELElBQUksRUFBaEUsRUFBb0UsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhFLEVBQWlGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFyRixFQUE4RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEcsRUFBMkcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9HLEVBQXdILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1SCxFQUFxSSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekksRUFBa0osSUFBSSxFQUF0SixFQUFocEcsRUFBNHlHLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBZSxJQUFJLEVBQW5CLEVBQXVCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzQixFQUFvQyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEMsRUFBaUQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJELEVBQThELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsRSxFQUEyRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0UsRUFBd0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVGLEVBQXFHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF6RyxFQUFrSCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEgsRUFBNXlHLEVBQTY2RyxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBNzZHLEVBQTBsSCxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBMWxILEVBQXV3SCxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBdndILEVBQW83SCxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBcDdILEVBQWltSSxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBam1JLEVBQTh3SSxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBOXdJLEVBQTI3SSxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBMzdJLEVBQXdtSixFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBMkssSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9LLEVBQXhtSixFQUFreUosRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksRUFBbkIsRUFBbHlKLEVBQTJ6SixFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBMkssSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9LLEVBQTN6SixFQUFxL0osRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBZCxFQUF1QixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0IsRUFBb0MsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhDLEVBQWlELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFyRCxFQUE4RCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEUsRUFBMkUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9FLEVBQXdGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1RixFQUFxRyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekcsRUFBa0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXRILEVBQXIvSixFQUFzbkssRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLEVBQWQsRUFBa0IsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXRCLEVBQStCLElBQUksRUFBbkMsRUFBdUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNDLEVBQW9ELElBQUksRUFBeEQsRUFBNEQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhFLEVBQXRuSyxFQUFpc0ssRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLEVBQWQsRUFBa0IsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXRCLEVBQStCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQyxFQUFqc0ssRUFBK3VLLEVBQUUsSUFBSSxFQUFOLEVBQVUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWQsRUFBdUIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNCLEVBQS91SyxFQUFxeEssRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQixFQUFyeEssRUFBbXpLLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBZSxJQUFJLEVBQW5CLEVBQXVCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzQixFQUFvQyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEMsRUFBaUQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJELEVBQThELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsRSxFQUEyRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0UsRUFBd0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVGLEVBQXFHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF6RyxFQUFrSCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEgsRUFBbnpLLEVBQW83SyxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUFwN0ssRUFBNmlMLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBZSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkIsRUFBNEIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhDLEVBQXlDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE3QyxFQUFzRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBMUQsRUFBbUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXZFLEVBQWdGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFwRixFQUE2RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakcsRUFBMEcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTlHLEVBQTdpTCxFQUFzcUwsRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBZCxFQUF1QixJQUFJLEVBQTNCLEVBQStCLElBQUksRUFBbkMsRUFBdUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNDLEVBQW9ELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF4RCxFQUFpRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBckUsRUFBOEUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxGLEVBQTJGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvRixFQUF3RyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUcsRUFBcUgsSUFBSSxFQUF6SCxFQUF0cUwsRUFBcXlMLEVBQUUsSUFBSSxFQUFOLEVBQVUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWQsRUFBcnlMLEVBQTh6TCxFQUFFLElBQUksRUFBTixFQUFVLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFkLEVBQXVCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzQixFQUFvQyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEMsRUFBaUQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJELEVBQThELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsRSxFQUEyRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0UsRUFBd0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVGLEVBQXFHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF6RyxFQUFrSCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEgsRUFBK0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5JLEVBQTl6TCxFQUE0OEwsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksRUFBbkIsRUFBdUIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNCLEVBQW9DLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF4QyxFQUFpRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBckQsRUFBOEQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxFLEVBQTJFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvRSxFQUF3RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUYsRUFBcUcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXpHLEVBQWtILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF0SCxFQUErSCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkksRUFBNThMLEVBQTBsTSxFQUFFLElBQUksRUFBTixFQUFVLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFkLEVBQXVCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzQixFQUFvQyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEMsRUFBaUQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJELEVBQThELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsRSxFQUEyRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0UsRUFBd0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVGLEVBQXFHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF6RyxFQUFrSCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEgsRUFBMWxNLEVBQTJ0TSxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxFQUFuQixFQUF1QixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0IsRUFBb0MsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhDLEVBQWlELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFyRCxFQUE4RCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEUsRUFBMkUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9FLEVBQXdGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1RixFQUFxRyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekcsRUFBa0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXRILEVBQTN0TSxFQUE0MU0sRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBZCxFQUF1QixJQUFJLEVBQTNCLEVBQStCLElBQUksRUFBbkMsRUFBdUMsSUFBSSxFQUEzQyxFQUErQyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkQsRUFBNEQsSUFBSSxFQUFoRSxFQUFvRSxJQUFJLEVBQXhFLEVBQTRFLElBQUksRUFBaEYsRUFBb0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhGLEVBQWlHLElBQUksRUFBckcsRUFBeUcsSUFBSSxFQUE3RyxFQUFpSCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBckgsRUFBOEgsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxJLEVBQTJJLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvSSxFQUF3SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUosRUFBcUssSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXpLLEVBQWtMLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF0TCxFQUErTCxJQUFJLEVBQW5NLEVBQTUxTSxFQUFxaU4sRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFyaU4sRUFBc2pOLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBZSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkIsRUFBNEIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhDLEVBQXlDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE3QyxFQUFzRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBMUQsRUFBbUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXZFLEVBQWdGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFwRixFQUE2RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakcsRUFBMEcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTlHLEVBQXVILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzSCxFQUFvSSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEksRUFBaUosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJKLEVBQThKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsSyxFQUEySyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0ssRUFBdGpOLEVBQWd2TixFQUFFLElBQUksRUFBTixFQUFVLElBQUksRUFBZCxFQUFrQixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEIsRUFBK0IsSUFBSSxFQUFuQyxFQUF1QyxJQUFJLEVBQTNDLEVBQStDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuRCxFQUE0RCxJQUFJLEVBQWhFLEVBQW9FLElBQUksRUFBeEUsRUFBNEUsSUFBSSxFQUFoRixFQUFvRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEYsRUFBaUcsSUFBSSxFQUFyRyxFQUF5RyxJQUFJLEVBQTdHLEVBQWlILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySCxFQUE4SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEksRUFBMkksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9JLEVBQXdKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1SixFQUFxSyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekssRUFBa0wsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXRMLEVBQStMLElBQUksRUFBbk0sRUFBaHZOLEVBQXk3TixFQUFFLElBQUksRUFBTixFQUFVLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFkLEVBQXo3TixFQUFrOU4sRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFsOU4sRUFBbStOLEVBQUUsR0FBRyxFQUFMLEVBQVMsR0FBRyxDQUFaLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBbitOLEVBQWdwTyxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWhwTyxFQUFpcU8sRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBZCxFQUF1QixJQUFJLEVBQTNCLEVBQStCLElBQUksRUFBbkMsRUFBdUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNDLEVBQW9ELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF4RCxFQUFpRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBckUsRUFBOEUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxGLEVBQTJGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvRixFQUF3RyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUcsRUFBcUgsSUFBSSxFQUF6SCxFQUFqcU8sRUFBZ3lPLEVBQUUsR0FBRyxFQUFMLEVBQVMsR0FBRyxDQUFaLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWh5TyxFQUFtN08sRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBZCxFQUFuN08sRUFBNDhPLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBNThPLEVBQTY5TyxFQUFFLEdBQUcsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFMLEVBQWMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxCLEVBQTJCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvQixFQUF3QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUMsRUFBcUQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXpELEVBQWtFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF0RSxFQUErRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkYsRUFBNEYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhHLEVBQXlHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE3RyxFQUFzSCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBMUgsRUFBbUksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXZJLEVBQWdKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFwSixFQUE2SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakssRUFBNzlPLEVBQXlvUCxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQXpvUCxFQUF1cVAsRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBZCxFQUF1QixJQUFJLEVBQTNCLEVBQStCLElBQUksRUFBbkMsRUFBdUMsSUFBSSxFQUEzQyxFQUErQyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkQsRUFBNEQsSUFBSSxFQUFoRSxFQUFvRSxJQUFJLEVBQXhFLEVBQTRFLElBQUksRUFBaEYsRUFBb0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhGLEVBQWlHLElBQUksRUFBckcsRUFBeUcsSUFBSSxFQUE3RyxFQUFpSCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBckgsRUFBOEgsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxJLEVBQTJJLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvSSxFQUF3SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUosRUFBcUssSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXpLLEVBQWtMLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF0TCxFQUErTCxJQUFJLEVBQW5NLEVBQXZxUCxFQUFnM1AsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksRUFBbkIsRUFBdUIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNCLEVBQW9DLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF4QyxFQUFpRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBckQsRUFBOEQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxFLEVBQTJFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvRSxFQUF3RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUYsRUFBcUcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXpHLEVBQWtILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF0SCxFQUFoM1AsRUFBaS9QLEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQUwsRUFBYyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEIsRUFBMkIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9CLEVBQXdDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1QyxFQUFxRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekQsRUFBa0UsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXRFLEVBQStFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuRixFQUE0RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBaEcsRUFBeUcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdHLEVBQXNILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUExSCxFQUFtSSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdkksRUFBZ0osSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXBKLEVBQTZKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFqSyxFQUFqL1AsRUFBNnBRLEVBQUUsSUFBSSxFQUFOLEVBQVUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWQsRUFBdUIsSUFBSSxFQUEzQixFQUErQixJQUFJLEVBQW5DLEVBQXVDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzQyxFQUFvRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEQsRUFBaUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJFLEVBQThFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsRixFQUEyRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0YsRUFBd0csSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVHLEVBQXFILElBQUksRUFBekgsRUFBN3BRLEVBQTR4USxFQUFFLElBQUksRUFBTixFQUFVLElBQUksRUFBZCxFQUFrQixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEIsRUFBK0IsSUFBSSxFQUFuQyxFQUF1QyxJQUFJLEVBQTNDLEVBQStDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuRCxFQUE0RCxJQUFJLEVBQWhFLEVBQW9FLElBQUksRUFBeEUsRUFBNEUsSUFBSSxFQUFoRixFQUFvRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEYsRUFBaUcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJHLEVBQThHLElBQUksRUFBbEgsRUFBc0gsSUFBSSxFQUExSCxFQUE4SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEksRUFBMkksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9JLEVBQXdKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1SixFQUFxSyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekssRUFBa0wsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXRMLEVBQStMLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuTSxFQUE0TSxJQUFJLEVBQWhOLEVBQTV4USxFQUFrL1EsRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBZCxFQUF1QixJQUFJLEVBQTNCLEVBQStCLElBQUksRUFBbkMsRUFBdUMsSUFBSSxFQUEzQyxFQUErQyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkQsRUFBNEQsSUFBSSxFQUFoRSxFQUFvRSxJQUFJLEVBQXhFLEVBQTRFLElBQUksRUFBaEYsRUFBb0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhGLEVBQWlHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFyRyxFQUE4RyxJQUFJLEVBQWxILEVBQXNILElBQUksRUFBMUgsRUFBOEgsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxJLEVBQTJJLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvSSxFQUF3SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUosRUFBcUssSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXpLLEVBQWtMLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF0TCxFQUErTCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbk0sRUFBNE0sSUFBSSxFQUFoTixFQUFsL1EsRUFBd3NSLEVBQUUsSUFBSSxFQUFOLEVBQVUsSUFBSSxHQUFkLEVBQW1CLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2QixFQUFnQyxJQUFJLEdBQXBDLEVBQXlDLElBQUksRUFBN0MsRUFBaUQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJELEVBQThELElBQUksR0FBbEUsRUFBdUUsSUFBSSxFQUEzRSxFQUErRSxJQUFJLEVBQW5GLEVBQXVGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzRixFQUFvRyxJQUFJLEVBQXhHLEVBQTRHLElBQUksRUFBaEgsRUFBb0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhILEVBQWlJLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySSxFQUE4SSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEosRUFBMkosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9KLEVBQXdLLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1SyxFQUFxTCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekwsRUFBa00sSUFBSSxFQUF0TSxFQUF4c1IsRUFBbzVSLEVBQUUsSUFBSSxFQUFOLEVBQVUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWQsRUFBdUIsSUFBSSxHQUEzQixFQUFnQyxJQUFJLEdBQXBDLEVBQXlDLElBQUksRUFBN0MsRUFBaUQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJELEVBQThELElBQUksR0FBbEUsRUFBdUUsSUFBSSxFQUEzRSxFQUErRSxJQUFJLEVBQW5GLEVBQXVGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzRixFQUFvRyxJQUFJLEVBQXhHLEVBQTRHLElBQUksRUFBaEgsRUFBb0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhILEVBQWlJLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySSxFQUE4SSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEosRUFBMkosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9KLEVBQXdLLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1SyxFQUFxTCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekwsRUFBa00sSUFBSSxFQUF0TSxFQUFwNVIsRUFBZ21TLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxHQUFKLENBQU4sRUFBaG1TLEVBQWtuUyxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUFsblMsRUFBMnVTLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBM3VTLEVBQTR2UyxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBNXZTLEVBQXk2UyxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBejZTLEVBQXNsVCxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxHQUExRCxFQUErRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBbkUsRUFBNkUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpGLEVBQXRsVCxFQUFrclQsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQixFQUE0QixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBaEMsRUFBeUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdDLEVBQXNELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUExRCxFQUFtRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdkUsRUFBbHJULEVBQW93VCxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBcEYsRUFBOEYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxHLEVBQTJHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvRyxFQUF3SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUgsRUFBcUksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXpJLEVBQWtKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF0SixFQUErSixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkssRUFBNEssSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhMLEVBQXlMLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE3TCxFQUFwd1QsRUFBNDhULEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBZSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkIsRUFBNEIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhDLEVBQXlDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE3QyxFQUFzRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBMUQsRUFBbUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXZFLEVBQWdGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFwRixFQUE2RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakcsRUFBMEcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTlHLEVBQXVILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzSCxFQUFvSSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEksRUFBaUosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJKLEVBQThKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsSyxFQUEySyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0ssRUFBNThULEVBQXNvVSxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksR0FBSixDQUFOLEVBQXRvVSxFQUF3cFUsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQixFQUE0QixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBaEMsRUFBeUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdDLEVBQXNELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUExRCxFQUFtRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdkUsRUFBZ0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXBGLEVBQTZGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFqRyxFQUEwRyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBOUcsRUFBeHBVLEVBQWl4VSxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWp4VSxFQUFreVUsRUFBRSxHQUFHLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTCxFQUFjLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsQixFQUEyQixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0IsRUFBd0MsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVDLEVBQXFELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF6RCxFQUFrRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEUsRUFBK0UsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5GLEVBQTRGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoRyxFQUF5RyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0csRUFBc0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFILEVBQW1JLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2SSxFQUFnSixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEosRUFBNkosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpLLEVBQWx5VSxFQUE4OFUsRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBZCxFQUF1QixJQUFJLEVBQTNCLEVBQStCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQyxFQUE0QyxJQUFJLEdBQWhELEVBQXFELElBQUksR0FBekQsRUFBOEQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxFLEVBQTk4VSxFQUEyaFYsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksR0FBbkIsRUFBd0IsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVCLEVBQXFDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF6QyxFQUFrRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEQsRUFBK0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5FLEVBQTRFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoRixFQUF5RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0YsRUFBc0csSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFHLEVBQW1ILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2SCxFQUFnSSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEksRUFBM2hWLEVBQTBxVixFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQTFxVixFQUEyclYsRUFBRSxHQUFHLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTCxFQUFjLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsQixFQUEyQixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0IsRUFBd0MsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVDLEVBQXFELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF6RCxFQUFrRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEUsRUFBK0UsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5GLEVBQTRGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoRyxFQUF5RyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0csRUFBc0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFILEVBQW1JLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2SSxFQUFnSixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEosRUFBNkosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpLLEVBQTNyVixFQUF1MlYsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBTixFQUF2MlYsRUFBeTNWLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBZSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkIsRUFBNEIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhDLEVBQXlDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE3QyxFQUFzRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBMUQsRUFBbUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXZFLEVBQWdGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFwRixFQUE2RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakcsRUFBMEcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTlHLEVBQXozVixFQUFrL1YsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFsL1YsRUFBbWdXLEVBQUUsSUFBSSxFQUFOLEVBQVUsSUFBSSxHQUFkLEVBQW1CLElBQUksRUFBdkIsRUFBMkIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9CLEVBQXdDLElBQUksR0FBNUMsRUFBaUQsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJELEVBQThELElBQUksR0FBbEUsRUFBdUUsSUFBSSxFQUEzRSxFQUErRSxJQUFJLEVBQW5GLEVBQXVGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzRixFQUFvRyxJQUFJLEVBQXhHLEVBQTRHLElBQUksRUFBaEgsRUFBb0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhILEVBQWlJLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySSxFQUE4SSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEosRUFBMkosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9KLEVBQXdLLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1SyxFQUFxTCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekwsRUFBa00sSUFBSSxFQUF0TSxFQUFuZ1csRUFBK3NXLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxHQUFKLENBQU4sRUFBL3NXLEVBQWl1VyxFQUFFLElBQUksR0FBTixFQUFXLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFmLEVBQXdCLElBQUksR0FBNUIsRUFBaUMsSUFBSSxDQUFDLENBQUQsRUFBSSxHQUFKLENBQXJDLEVBQWp1VyxFQUFreFcsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQixFQUE0QixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBaEMsRUFBeUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdDLEVBQXNELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUExRCxFQUFtRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdkUsRUFBZ0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXBGLEVBQTZGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFqRyxFQUEwRyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBOUcsRUFBdUgsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNILEVBQWx4VyxFQUF3NVcsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQixFQUF4NVcsRUFBczdXLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBZSxJQUFJLEdBQW5CLEVBQXdCLElBQUksR0FBNUIsRUFBaUMsSUFBSSxDQUFDLENBQUQsRUFBSSxHQUFKLENBQXJDLEVBQXQ3VyxFQUF1K1csRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQixFQUE0QixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBaEMsRUFBeUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdDLEVBQXNELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUExRCxFQUFtRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdkUsRUFBZ0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXBGLEVBQTZGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFqRyxFQUEwRyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBOUcsRUFBdUgsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNILEVBQXYrVyxFQUE2bVgsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQixFQUE3bVgsRUFBMm9YLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxHQUFKLENBQU4sRUFBM29YLEVBQTZwWCxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUE3cFgsRUFBc3hYLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBdHhYLEVBQXV5WCxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksR0FBSixDQUFOLEVBQXZ5WCxFQUF5elgsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQixFQUE0QixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBaEMsRUFBeUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdDLEVBQXNELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUExRCxFQUFtRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdkUsRUFBZ0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXBGLEVBQTZGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFqRyxFQUEwRyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBOUcsRUFBenpYLEVBQWs3WCxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWw3WCxFQUFtOFgsRUFBRSxHQUFHLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTCxFQUFjLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsQixFQUEyQixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0IsRUFBd0MsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVDLEVBQXFELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF6RCxFQUFrRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEUsRUFBK0UsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5GLEVBQTRGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoRyxFQUF5RyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0csRUFBc0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFILEVBQW1JLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2SSxFQUFnSixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEosRUFBNkosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpLLEVBQW44WCxFQUErbVksRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQixFQUE0QixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBaEMsRUFBeUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdDLEVBQXNELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUExRCxFQUFtRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdkUsRUFBL21ZLEVBQWlzWSxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksR0FBSixDQUFOLEVBQWpzWSxFQUFtdFksRUFBRSxJQUFJLEVBQU4sRUFBVSxJQUFJLEdBQWQsRUFBbUIsSUFBSSxFQUF2QixFQUEyQixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0IsRUFBd0MsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVDLEVBQXFELElBQUksRUFBekQsRUFBNkQsSUFBSSxFQUFqRSxFQUFxRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekUsRUFBa0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXRGLEVBQStGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuRyxFQUE0RyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBaEgsRUFBeUgsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdILEVBQXNJLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUExSSxFQUFtSixJQUFJLEVBQXZKLEVBQW50WSxFQUFnM1ksRUFBRSxHQUFHLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTCxFQUFjLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsQixFQUEyQixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0IsRUFBd0MsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVDLEVBQXFELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF6RCxFQUFrRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEUsRUFBK0UsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5GLEVBQTRGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoRyxFQUF5RyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0csRUFBc0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFILEVBQW1JLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2SSxFQUFnSixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEosRUFBNkosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpLLEVBQWgzWSxFQUE0aFosRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUE1aFosRUFBNmlaLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBN2laLEVBQThqWixFQUFFLElBQUksRUFBTixFQUFVLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFkLEVBQXVCLElBQUksR0FBM0IsRUFBZ0MsSUFBSSxHQUFwQyxFQUF5QyxJQUFJLEVBQTdDLEVBQWlELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFyRCxFQUE4RCxJQUFJLEdBQWxFLEVBQXVFLElBQUksRUFBM0UsRUFBK0UsSUFBSSxFQUFuRixFQUF1RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0YsRUFBb0csSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhHLEVBQWlILElBQUksRUFBckgsRUFBeUgsSUFBSSxFQUE3SCxFQUFpSSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBckksRUFBOEksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWxKLEVBQTJKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvSixFQUF3SyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBNUssRUFBcUwsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXpMLEVBQWtNLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF0TSxFQUErTSxJQUFJLEVBQW5OLEVBQTlqWixFQUF1eFosRUFBRSxHQUFHLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTCxFQUFjLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsQixFQUEyQixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0IsRUFBd0MsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTVDLEVBQXFELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF6RCxFQUFrRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEUsRUFBK0UsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5GLEVBQTRGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoRyxFQUF5RyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0csRUFBc0gsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFILEVBQW1JLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2SSxFQUFnSixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEosRUFBNkosSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpLLEVBQXZ4WixFQUFtOFosRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBTixFQUFuOFosRUFBcTlaLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBZSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkIsRUFBNEIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhDLEVBQXlDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE3QyxFQUFzRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBMUQsRUFBbUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXZFLEVBQWdGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFwRixFQUE2RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakcsRUFBMEcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTlHLEVBQXI5WixFQUE4a2EsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUE5a2EsRUFBK2xhLEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQUwsRUFBYyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEIsRUFBMkIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9CLEVBQXdDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE1QyxFQUFxRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekQsRUFBa0UsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXRFLEVBQStFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuRixFQUE0RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBaEcsRUFBeUcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdHLEVBQXNILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUExSCxFQUFtSSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdkksRUFBZ0osSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXBKLEVBQTZKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFqSyxFQUEvbGEsRUFBMndhLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxHQUFKLENBQU4sRUFBM3dhLEVBQTZ4YSxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQTd4YSxFQUE4eWEsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBTixFQUFnQixJQUFJLEdBQXBCLEVBQTl5YSxFQUF5MGEsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBTixFQUF6MGEsRUFBMjFhLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBMzFhLEVBQTQyYSxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQTUyYSxFQUE2M2EsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQixFQUE0QixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBaEMsRUFBeUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdDLEVBQXNELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUExRCxFQUFtRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdkUsRUFBZ0YsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXBGLEVBQTZGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFqRyxFQUEwRyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBOUcsRUFBdUgsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNILEVBQTczYSxFQUFtZ2IsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTixFQUFlLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFuQixFQUE0QixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBaEMsRUFBeUMsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdDLEVBQXNELElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUExRCxFQUFtRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdkUsRUFBbmdiLEVBQXFsYixFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxHQUFuQixFQUF3QixJQUFJLEdBQTVCLEVBQWlDLElBQUksQ0FBQyxDQUFELEVBQUksR0FBSixDQUFyQyxFQUFybGIsRUFBc29iLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBZSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkIsRUFBNEIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhDLEVBQXlDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE3QyxFQUFzRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBMUQsRUFBbUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXZFLEVBQWdGLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFwRixFQUE2RixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakcsRUFBMEcsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTlHLEVBQXVILElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzSCxFQUF0b2IsRUFBNHdiLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBZSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkIsRUFBNXdiLEVBQTB5YixFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE4SixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbEssRUFBMXliLEVBQXU5YixFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUF2OWIsRUFBdW5jLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxHQUFKLENBQU4sRUFBZ0IsSUFBSSxDQUFDLENBQUQsRUFBSSxHQUFKLENBQXBCLEVBQXZuYyxFQUF1cGMsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBTixFQUFnQixJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBcEIsRUFBdnBjLEVBQXVyYyxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQXZyYyxFQUEwMGMsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBTixFQUExMGMsRUFBNDFjLEVBQUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU4sRUFBNTFjLEVBQTYyYyxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQTcyYyxFQUE4M2MsRUFBRSxJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBTixFQUFnQixJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBcEIsRUFBOTNjLEVBQTg1YyxFQUFFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOLEVBQWUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQW5CLEVBQTRCLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFoQyxFQUF5QyxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN0MsRUFBc0QsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTFELEVBQW1FLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUF2RSxFQUFnRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBcEYsRUFBNkYsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpHLEVBQTBHLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUE5RyxFQUF1SCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0gsRUFBb0ksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXhJLEVBQWlKLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySixFQUE5NWMsQ0FsUUU7QUFtUVQscUJBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUwsRUFBYSxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakIsRUFBMEIsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTlCLEVBQXVDLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzQyxFQUFvRCxJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBeEQsRUFBaUUsSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXJFLEVBQThFLElBQUksQ0FBQyxDQUFELEVBQUksRUFBSixDQUFsRixFQUEyRixJQUFJLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0YsRUFBd0csS0FBSyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTdHLEVBQXNILEtBQUssQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzSCxFQUFvSSxLQUFLLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBekksRUFBa0osS0FBSyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQXZKLEVBQWdLLEtBQUssQ0FBQyxDQUFELEVBQUksRUFBSixDQUFySyxFQUE4SyxLQUFLLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBbkwsRUFBNEwsS0FBSyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpNLEVBQTBNLEtBQUssQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvTSxFQUF3TixLQUFLLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBN04sRUFBc08sS0FBSyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNPLEVBblFQO0FBb1FULGlCQUFZLFNBQVMsVUFBVCxDQUFvQixHQUFwQixFQUF5QixJQUF6QixFQUErQjtBQUN2QyxZQUFNLElBQUksS0FBSixDQUFVLEdBQVYsQ0FBTjtBQUNILE1BdFFRO0FBdVFULFlBQU8sU0FBUyxLQUFULENBQWUsS0FBZixFQUFzQjtBQUN6QixVQUFJLE9BQU8sSUFBWDtBQUFBLFVBQ0ksUUFBUSxDQUFDLENBQUQsQ0FEWjtBQUFBLFVBRUksU0FBUyxDQUFDLElBQUQsQ0FGYjtBQUFBLFVBR0ksU0FBUyxFQUhiO0FBQUEsVUFJSSxRQUFRLEtBQUssS0FKakI7QUFBQSxVQUtJLFNBQVMsRUFMYjtBQUFBLFVBTUksV0FBVyxDQU5mO0FBQUEsVUFPSSxTQUFTLENBUGI7QUFBQSxVQVFJLGFBQWEsQ0FSakI7QUFBQSxVQVNJLFNBQVMsQ0FUYjtBQUFBLFVBVUksTUFBTSxDQVZWO0FBV0EsV0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixLQUFwQjtBQUNBLFdBQUssS0FBTCxDQUFXLEVBQVgsR0FBZ0IsS0FBSyxFQUFyQjtBQUNBLFdBQUssRUFBTCxDQUFRLEtBQVIsR0FBZ0IsS0FBSyxLQUFyQjtBQUNBLFdBQUssRUFBTCxDQUFRLE1BQVIsR0FBaUIsSUFBakI7QUFDQSxVQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsTUFBbEIsSUFBNEIsV0FBaEMsRUFBNkMsS0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixFQUFwQjtBQUM3QyxVQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBdkI7QUFDQSxhQUFPLElBQVAsQ0FBWSxLQUFaO0FBQ0EsVUFBSSxTQUFTLEtBQUssS0FBTCxDQUFXLE9BQVgsSUFBc0IsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixNQUF0RDtBQUNBLFVBQUksT0FBTyxLQUFLLEVBQUwsQ0FBUSxVQUFmLEtBQThCLFVBQWxDLEVBQThDLEtBQUssVUFBTCxHQUFrQixLQUFLLEVBQUwsQ0FBUSxVQUExQjtBQUM5QyxlQUFTLFFBQVQsQ0FBa0IsQ0FBbEIsRUFBcUI7QUFDakIsYUFBTSxNQUFOLEdBQWUsTUFBTSxNQUFOLEdBQWUsSUFBSSxDQUFsQztBQUNBLGNBQU8sTUFBUCxHQUFnQixPQUFPLE1BQVAsR0FBZ0IsQ0FBaEM7QUFDQSxjQUFPLE1BQVAsR0FBZ0IsT0FBTyxNQUFQLEdBQWdCLENBQWhDO0FBQ0g7QUFDRCxlQUFTLEdBQVQsR0FBZTtBQUNYLFdBQUksS0FBSjtBQUNBLGVBQVEsS0FBSyxLQUFMLENBQVcsR0FBWCxNQUFvQixDQUE1QjtBQUNBLFdBQUksT0FBTyxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzNCLGdCQUFRLEtBQUssUUFBTCxDQUFjLEtBQWQsS0FBd0IsS0FBaEM7QUFDSDtBQUNELGNBQU8sS0FBUDtBQUNIO0FBQ0QsVUFBSSxNQUFKO0FBQUEsVUFDSSxjQURKO0FBQUEsVUFFSSxLQUZKO0FBQUEsVUFHSSxNQUhKO0FBQUEsVUFJSSxDQUpKO0FBQUEsVUFLSSxDQUxKO0FBQUEsVUFNSSxRQUFRLEVBTlo7QUFBQSxVQU9JLENBUEo7QUFBQSxVQVFJLEdBUko7QUFBQSxVQVNJLFFBVEo7QUFBQSxVQVVJLFFBVko7QUFXQSxhQUFPLElBQVAsRUFBYTtBQUNULGVBQVEsTUFBTSxNQUFNLE1BQU4sR0FBZSxDQUFyQixDQUFSO0FBQ0EsV0FBSSxLQUFLLGNBQUwsQ0FBb0IsS0FBcEIsQ0FBSixFQUFnQztBQUM1QixpQkFBUyxLQUFLLGNBQUwsQ0FBb0IsS0FBcEIsQ0FBVDtBQUNILFFBRkQsTUFFTztBQUNILFlBQUksV0FBVyxJQUFYLElBQW1CLE9BQU8sTUFBUCxJQUFpQixXQUF4QyxFQUFxRDtBQUNqRCxrQkFBUyxLQUFUO0FBQ0g7QUFDRCxpQkFBUyxNQUFNLEtBQU4sS0FBZ0IsTUFBTSxLQUFOLEVBQWEsTUFBYixDQUF6QjtBQUNIO0FBQ0QsV0FBSSxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUMsQ0FBQyxPQUFPLE1BQXpDLElBQW1ELENBQUMsT0FBTyxDQUFQLENBQXhELEVBQW1FO0FBQy9ELFlBQUksU0FBUyxFQUFiO0FBQ0EsWUFBSSxDQUFDLFVBQUwsRUFBaUI7QUFDYixvQkFBVyxFQUFYO0FBQ0EsY0FBSyxDQUFMLElBQVUsTUFBTSxLQUFOLENBQVY7QUFBd0IsY0FBSSxLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsS0FBc0IsSUFBSSxDQUE5QixFQUFpQztBQUNyRCxvQkFBUyxJQUFULENBQWMsTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBTixHQUEyQixHQUF6QztBQUNIO0FBRkQsVUFHQSxJQUFJLEtBQUssS0FBTCxDQUFXLFlBQWYsRUFBNkI7QUFDekIsbUJBQVMsMEJBQTBCLFdBQVcsQ0FBckMsSUFBMEMsS0FBMUMsR0FBa0QsS0FBSyxLQUFMLENBQVcsWUFBWCxFQUFsRCxHQUE4RSxjQUE5RSxHQUErRixTQUFTLElBQVQsQ0FBYyxJQUFkLENBQS9GLEdBQXFILFNBQXJILElBQWtJLEtBQUssVUFBTCxDQUFnQixNQUFoQixLQUEyQixNQUE3SixJQUF1SyxHQUFoTDtBQUNILFVBRkQsTUFFTztBQUNILG1CQUFTLDBCQUEwQixXQUFXLENBQXJDLElBQTBDLGVBQTFDLElBQTZELFVBQVUsQ0FBVixHQUFjLGNBQWQsR0FBK0IsT0FBTyxLQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsS0FBMkIsTUFBbEMsSUFBNEMsR0FBeEksQ0FBVDtBQUNIO0FBQ0QsY0FBSyxVQUFMLENBQWdCLE1BQWhCLEVBQXdCLEVBQUUsTUFBTSxLQUFLLEtBQUwsQ0FBVyxLQUFuQixFQUEwQixPQUFPLEtBQUssVUFBTCxDQUFnQixNQUFoQixLQUEyQixNQUE1RCxFQUFvRSxNQUFNLEtBQUssS0FBTCxDQUFXLFFBQXJGLEVBQStGLEtBQUssS0FBcEcsRUFBMkcsVUFBVSxRQUFySCxFQUF4QjtBQUNIO0FBQ0o7QUFDRCxXQUFJLE9BQU8sQ0FBUCxhQUFxQixLQUFyQixJQUE4QixPQUFPLE1BQVAsR0FBZ0IsQ0FBbEQsRUFBcUQ7QUFDakQsY0FBTSxJQUFJLEtBQUosQ0FBVSxzREFBc0QsS0FBdEQsR0FBOEQsV0FBOUQsR0FBNEUsTUFBdEYsQ0FBTjtBQUNIO0FBQ0QsZUFBUSxPQUFPLENBQVAsQ0FBUjtBQUNJLGFBQUssQ0FBTDtBQUNJLGVBQU0sSUFBTixDQUFXLE1BQVg7QUFDQSxnQkFBTyxJQUFQLENBQVksS0FBSyxLQUFMLENBQVcsTUFBdkI7QUFDQSxnQkFBTyxJQUFQLENBQVksS0FBSyxLQUFMLENBQVcsTUFBdkI7QUFDQSxlQUFNLElBQU4sQ0FBVyxPQUFPLENBQVAsQ0FBWDtBQUNBLGtCQUFTLElBQVQ7QUFDQSxhQUFJLENBQUMsY0FBTCxFQUFxQjtBQUNqQixtQkFBUyxLQUFLLEtBQUwsQ0FBVyxNQUFwQjtBQUNBLG1CQUFTLEtBQUssS0FBTCxDQUFXLE1BQXBCO0FBQ0EscUJBQVcsS0FBSyxLQUFMLENBQVcsUUFBdEI7QUFDQSxrQkFBUSxLQUFLLEtBQUwsQ0FBVyxNQUFuQjtBQUNBLGNBQUksYUFBYSxDQUFqQixFQUFvQjtBQUN2QixVQU5ELE1BTU87QUFDSCxtQkFBUyxjQUFUO0FBQ0EsMkJBQWlCLElBQWpCO0FBQ0g7QUFDRDtBQUNKLGFBQUssQ0FBTDtBQUNJLGVBQU0sS0FBSyxZQUFMLENBQWtCLE9BQU8sQ0FBUCxDQUFsQixFQUE2QixDQUE3QixDQUFOO0FBQ0EsZUFBTSxDQUFOLEdBQVUsT0FBTyxPQUFPLE1BQVAsR0FBZ0IsR0FBdkIsQ0FBVjtBQUNBLGVBQU0sRUFBTixHQUFXLEVBQUUsWUFBWSxPQUFPLE9BQU8sTUFBUCxJQUFpQixPQUFPLENBQXhCLENBQVAsRUFBbUMsVUFBakQsRUFBNkQsV0FBVyxPQUFPLE9BQU8sTUFBUCxHQUFnQixDQUF2QixFQUEwQixTQUFsRyxFQUE2RyxjQUFjLE9BQU8sT0FBTyxNQUFQLElBQWlCLE9BQU8sQ0FBeEIsQ0FBUCxFQUFtQyxZQUE5SixFQUE0SyxhQUFhLE9BQU8sT0FBTyxNQUFQLEdBQWdCLENBQXZCLEVBQTBCLFdBQW5OLEVBQVg7QUFDQSxhQUFJLE1BQUosRUFBWTtBQUNSLGdCQUFNLEVBQU4sQ0FBUyxLQUFULEdBQWlCLENBQUMsT0FBTyxPQUFPLE1BQVAsSUFBaUIsT0FBTyxDQUF4QixDQUFQLEVBQW1DLEtBQW5DLENBQXlDLENBQXpDLENBQUQsRUFBOEMsT0FBTyxPQUFPLE1BQVAsR0FBZ0IsQ0FBdkIsRUFBMEIsS0FBMUIsQ0FBZ0MsQ0FBaEMsQ0FBOUMsQ0FBakI7QUFDSDtBQUNELGFBQUksS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLEtBQXhCLEVBQStCLE1BQS9CLEVBQXVDLE1BQXZDLEVBQStDLFFBQS9DLEVBQXlELEtBQUssRUFBOUQsRUFBa0UsT0FBTyxDQUFQLENBQWxFLEVBQTZFLE1BQTdFLEVBQXFGLE1BQXJGLENBQUo7QUFDQSxhQUFJLE9BQU8sQ0FBUCxLQUFhLFdBQWpCLEVBQThCO0FBQzFCLGlCQUFPLENBQVA7QUFDSDtBQUNELGFBQUksR0FBSixFQUFTO0FBQ0wsa0JBQVEsTUFBTSxLQUFOLENBQVksQ0FBWixFQUFlLENBQUMsQ0FBRCxHQUFLLEdBQUwsR0FBVyxDQUExQixDQUFSO0FBQ0EsbUJBQVMsT0FBTyxLQUFQLENBQWEsQ0FBYixFQUFnQixDQUFDLENBQUQsR0FBSyxHQUFyQixDQUFUO0FBQ0EsbUJBQVMsT0FBTyxLQUFQLENBQWEsQ0FBYixFQUFnQixDQUFDLENBQUQsR0FBSyxHQUFyQixDQUFUO0FBQ0g7QUFDRCxlQUFNLElBQU4sQ0FBVyxLQUFLLFlBQUwsQ0FBa0IsT0FBTyxDQUFQLENBQWxCLEVBQTZCLENBQTdCLENBQVg7QUFDQSxnQkFBTyxJQUFQLENBQVksTUFBTSxDQUFsQjtBQUNBLGdCQUFPLElBQVAsQ0FBWSxNQUFNLEVBQWxCO0FBQ0Esb0JBQVcsTUFBTSxNQUFNLE1BQU0sTUFBTixHQUFlLENBQXJCLENBQU4sRUFBK0IsTUFBTSxNQUFNLE1BQU4sR0FBZSxDQUFyQixDQUEvQixDQUFYO0FBQ0EsZUFBTSxJQUFOLENBQVcsUUFBWDtBQUNBO0FBQ0osYUFBSyxDQUFMO0FBQ0ksZ0JBQU8sSUFBUDtBQXpDUjtBQTJDSDtBQUNELGFBQU8sSUFBUDtBQUNIO0FBN1hRLEtBQWI7QUErWEE7QUFDQSxRQUFJLFFBQVMsWUFBWTtBQUNyQixTQUFJLFFBQVEsRUFBRSxLQUFLLENBQVA7QUFDUixrQkFBWSxTQUFTLFVBQVQsQ0FBb0IsR0FBcEIsRUFBeUIsSUFBekIsRUFBK0I7QUFDdkMsV0FBSSxLQUFLLEVBQUwsQ0FBUSxNQUFaLEVBQW9CO0FBQ2hCLGFBQUssRUFBTCxDQUFRLE1BQVIsQ0FBZSxVQUFmLENBQTBCLEdBQTFCLEVBQStCLElBQS9CO0FBQ0gsUUFGRCxNQUVPO0FBQ0gsY0FBTSxJQUFJLEtBQUosQ0FBVSxHQUFWLENBQU47QUFDSDtBQUNKLE9BUE87QUFRUixnQkFBVSxTQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBeUI7QUFDL0IsWUFBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLFlBQUssS0FBTCxHQUFhLEtBQUssS0FBTCxHQUFhLEtBQUssSUFBTCxHQUFZLEtBQXRDO0FBQ0EsWUFBSyxRQUFMLEdBQWdCLEtBQUssTUFBTCxHQUFjLENBQTlCO0FBQ0EsWUFBSyxNQUFMLEdBQWMsS0FBSyxPQUFMLEdBQWUsS0FBSyxLQUFMLEdBQWEsRUFBMUM7QUFDQSxZQUFLLGNBQUwsR0FBc0IsQ0FBQyxTQUFELENBQXRCO0FBQ0EsWUFBSyxNQUFMLEdBQWMsRUFBRSxZQUFZLENBQWQsRUFBaUIsY0FBYyxDQUEvQixFQUFrQyxXQUFXLENBQTdDLEVBQWdELGFBQWEsQ0FBN0QsRUFBZDtBQUNBLFdBQUksS0FBSyxPQUFMLENBQWEsTUFBakIsRUFBeUIsS0FBSyxNQUFMLENBQVksS0FBWixHQUFvQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXBCO0FBQ3pCLFlBQUssTUFBTCxHQUFjLENBQWQ7QUFDQSxjQUFPLElBQVA7QUFDSCxPQWxCTztBQW1CUixhQUFPLFNBQVMsS0FBVCxHQUFpQjtBQUNwQixXQUFJLEtBQUssS0FBSyxNQUFMLENBQVksQ0FBWixDQUFUO0FBQ0EsWUFBSyxNQUFMLElBQWUsRUFBZjtBQUNBLFlBQUssTUFBTDtBQUNBLFlBQUssTUFBTDtBQUNBLFlBQUssS0FBTCxJQUFjLEVBQWQ7QUFDQSxZQUFLLE9BQUwsSUFBZ0IsRUFBaEI7QUFDQSxXQUFJLFFBQVEsR0FBRyxLQUFILENBQVMsaUJBQVQsQ0FBWjtBQUNBLFdBQUksS0FBSixFQUFXO0FBQ1AsYUFBSyxRQUFMO0FBQ0EsYUFBSyxNQUFMLENBQVksU0FBWjtBQUNILFFBSEQsTUFHTztBQUNILGFBQUssTUFBTCxDQUFZLFdBQVo7QUFDSDtBQUNELFdBQUksS0FBSyxPQUFMLENBQWEsTUFBakIsRUFBeUIsS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixDQUFsQjs7QUFFekIsWUFBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixDQUFsQixDQUFkO0FBQ0EsY0FBTyxFQUFQO0FBQ0gsT0FyQ087QUFzQ1IsYUFBTyxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ3RCLFdBQUksTUFBTSxHQUFHLE1BQWI7QUFDQSxXQUFJLFFBQVEsR0FBRyxLQUFILENBQVMsZUFBVCxDQUFaOztBQUVBLFlBQUssTUFBTCxHQUFjLEtBQUssS0FBSyxNQUF4QjtBQUNBLFlBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsQ0FBbkIsRUFBc0IsS0FBSyxNQUFMLENBQVksTUFBWixHQUFxQixHQUFyQixHQUEyQixDQUFqRCxDQUFkO0FBQ0E7QUFDQSxZQUFLLE1BQUwsSUFBZSxHQUFmO0FBQ0EsV0FBSSxXQUFXLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsZUFBakIsQ0FBZjtBQUNBLFlBQUssS0FBTCxHQUFhLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsQ0FBbEIsRUFBcUIsS0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixDQUF6QyxDQUFiO0FBQ0EsWUFBSyxPQUFMLEdBQWUsS0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixDQUFwQixFQUF1QixLQUFLLE9BQUwsQ0FBYSxNQUFiLEdBQXNCLENBQTdDLENBQWY7O0FBRUEsV0FBSSxNQUFNLE1BQU4sR0FBZSxDQUFuQixFQUFzQixLQUFLLFFBQUwsSUFBaUIsTUFBTSxNQUFOLEdBQWUsQ0FBaEM7QUFDdEIsV0FBSSxJQUFJLEtBQUssTUFBTCxDQUFZLEtBQXBCOztBQUVBLFlBQUssTUFBTCxHQUFjLEVBQUUsWUFBWSxLQUFLLE1BQUwsQ0FBWSxVQUExQjtBQUNWLG1CQUFXLEtBQUssUUFBTCxHQUFnQixDQURqQjtBQUVWLHNCQUFjLEtBQUssTUFBTCxDQUFZLFlBRmhCO0FBR1YscUJBQWEsUUFBUSxDQUFDLE1BQU0sTUFBTixLQUFpQixTQUFTLE1BQTFCLEdBQW1DLEtBQUssTUFBTCxDQUFZLFlBQS9DLEdBQThELENBQS9ELElBQW9FLFNBQVMsU0FBUyxNQUFULEdBQWtCLE1BQU0sTUFBakMsRUFBeUMsTUFBN0csR0FBc0gsTUFBTSxDQUFOLEVBQVMsTUFBdkksR0FBZ0osS0FBSyxNQUFMLENBQVksWUFBWixHQUEyQjtBQUg5SyxRQUFkOztBQU1BLFdBQUksS0FBSyxPQUFMLENBQWEsTUFBakIsRUFBeUI7QUFDckIsYUFBSyxNQUFMLENBQVksS0FBWixHQUFvQixDQUFDLEVBQUUsQ0FBRixDQUFELEVBQU8sRUFBRSxDQUFGLElBQU8sS0FBSyxNQUFaLEdBQXFCLEdBQTVCLENBQXBCO0FBQ0g7QUFDRCxjQUFPLElBQVA7QUFDSCxPQS9ETztBQWdFUixZQUFNLFNBQVMsSUFBVCxHQUFnQjtBQUNsQixZQUFLLEtBQUwsR0FBYSxJQUFiO0FBQ0EsY0FBTyxJQUFQO0FBQ0gsT0FuRU87QUFvRVIsWUFBTSxTQUFTLElBQVQsQ0FBYyxDQUFkLEVBQWlCO0FBQ25CLFlBQUssS0FBTCxDQUFXLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsQ0FBakIsQ0FBWDtBQUNILE9BdEVPO0FBdUVSLGlCQUFXLFNBQVMsU0FBVCxHQUFxQjtBQUM1QixXQUFJLE9BQU8sS0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixDQUFwQixFQUF1QixLQUFLLE9BQUwsQ0FBYSxNQUFiLEdBQXNCLEtBQUssS0FBTCxDQUFXLE1BQXhELENBQVg7QUFDQSxjQUFPLENBQUMsS0FBSyxNQUFMLEdBQWMsRUFBZCxHQUFtQixLQUFuQixHQUEyQixFQUE1QixJQUFrQyxLQUFLLE1BQUwsQ0FBWSxDQUFDLEVBQWIsRUFBaUIsT0FBakIsQ0FBeUIsS0FBekIsRUFBZ0MsRUFBaEMsQ0FBekM7QUFDSCxPQTFFTztBQTJFUixxQkFBZSxTQUFTLGFBQVQsR0FBeUI7QUFDcEMsV0FBSSxPQUFPLEtBQUssS0FBaEI7QUFDQSxXQUFJLEtBQUssTUFBTCxHQUFjLEVBQWxCLEVBQXNCO0FBQ2xCLGdCQUFRLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsQ0FBbkIsRUFBc0IsS0FBSyxLQUFLLE1BQWhDLENBQVI7QUFDSDtBQUNELGNBQU8sQ0FBQyxLQUFLLE1BQUwsQ0FBWSxDQUFaLEVBQWUsRUFBZixLQUFzQixLQUFLLE1BQUwsR0FBYyxFQUFkLEdBQW1CLEtBQW5CLEdBQTJCLEVBQWpELENBQUQsRUFBdUQsT0FBdkQsQ0FBK0QsS0FBL0QsRUFBc0UsRUFBdEUsQ0FBUDtBQUNILE9BakZPO0FBa0ZSLG9CQUFjLFNBQVMsWUFBVCxHQUF3QjtBQUNsQyxXQUFJLE1BQU0sS0FBSyxTQUFMLEVBQVY7QUFDQSxXQUFJLElBQUksSUFBSSxLQUFKLENBQVUsSUFBSSxNQUFKLEdBQWEsQ0FBdkIsRUFBMEIsSUFBMUIsQ0FBK0IsR0FBL0IsQ0FBUjtBQUNBLGNBQU8sTUFBTSxLQUFLLGFBQUwsRUFBTixHQUE2QixJQUE3QixHQUFvQyxDQUFwQyxHQUF3QyxHQUEvQztBQUNILE9BdEZPO0FBdUZSLFlBQU0sU0FBUyxJQUFULEdBQWdCO0FBQ2xCLFdBQUksS0FBSyxJQUFULEVBQWU7QUFDWCxlQUFPLEtBQUssR0FBWjtBQUNIO0FBQ0QsV0FBSSxDQUFDLEtBQUssTUFBVixFQUFrQixLQUFLLElBQUwsR0FBWSxJQUFaOztBQUVsQixXQUFJLEtBQUosRUFBVyxLQUFYLEVBQWtCLFNBQWxCLEVBQTZCLEtBQTdCLEVBQW9DLEdBQXBDLEVBQXlDLEtBQXpDO0FBQ0EsV0FBSSxDQUFDLEtBQUssS0FBVixFQUFpQjtBQUNiLGFBQUssTUFBTCxHQUFjLEVBQWQ7QUFDQSxhQUFLLEtBQUwsR0FBYSxFQUFiO0FBQ0g7QUFDRCxXQUFJLFFBQVEsS0FBSyxhQUFMLEVBQVo7QUFDQSxZQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNuQyxvQkFBWSxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLEtBQUssS0FBTCxDQUFXLE1BQU0sQ0FBTixDQUFYLENBQWxCLENBQVo7QUFDQSxZQUFJLGNBQWMsQ0FBQyxLQUFELElBQVUsVUFBVSxDQUFWLEVBQWEsTUFBYixHQUFzQixNQUFNLENBQU4sRUFBUyxNQUF2RCxDQUFKLEVBQW9FO0FBQ2hFLGlCQUFRLFNBQVI7QUFDQSxpQkFBUSxDQUFSO0FBQ0EsYUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLElBQWxCLEVBQXdCO0FBQzNCO0FBQ0o7QUFDRCxXQUFJLEtBQUosRUFBVztBQUNQLGdCQUFRLE1BQU0sQ0FBTixFQUFTLEtBQVQsQ0FBZSxpQkFBZixDQUFSO0FBQ0EsWUFBSSxLQUFKLEVBQVcsS0FBSyxRQUFMLElBQWlCLE1BQU0sTUFBdkI7QUFDWCxhQUFLLE1BQUwsR0FBYyxFQUFFLFlBQVksS0FBSyxNQUFMLENBQVksU0FBMUI7QUFDVixvQkFBVyxLQUFLLFFBQUwsR0FBZ0IsQ0FEakI7QUFFVix1QkFBYyxLQUFLLE1BQUwsQ0FBWSxXQUZoQjtBQUdWLHNCQUFhLFFBQVEsTUFBTSxNQUFNLE1BQU4sR0FBZSxDQUFyQixFQUF3QixNQUF4QixHQUFpQyxNQUFNLE1BQU0sTUFBTixHQUFlLENBQXJCLEVBQXdCLEtBQXhCLENBQThCLFFBQTlCLEVBQXdDLENBQXhDLEVBQTJDLE1BQXBGLEdBQTZGLEtBQUssTUFBTCxDQUFZLFdBQVosR0FBMEIsTUFBTSxDQUFOLEVBQVMsTUFIbkksRUFBZDtBQUlBLGFBQUssTUFBTCxJQUFlLE1BQU0sQ0FBTixDQUFmO0FBQ0EsYUFBSyxLQUFMLElBQWMsTUFBTSxDQUFOLENBQWQ7QUFDQSxhQUFLLE9BQUwsR0FBZSxLQUFmO0FBQ0EsYUFBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksTUFBMUI7QUFDQSxZQUFJLEtBQUssT0FBTCxDQUFhLE1BQWpCLEVBQXlCO0FBQ3JCLGNBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsQ0FBQyxLQUFLLE1BQU4sRUFBYyxLQUFLLE1BQUwsSUFBZSxLQUFLLE1BQWxDLENBQXBCO0FBQ0g7QUFDRCxhQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsYUFBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixNQUFNLENBQU4sRUFBUyxNQUEzQixDQUFkO0FBQ0EsYUFBSyxPQUFMLElBQWdCLE1BQU0sQ0FBTixDQUFoQjtBQUNBLGdCQUFRLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixFQUE4QixLQUFLLEVBQW5DLEVBQXVDLElBQXZDLEVBQTZDLE1BQU0sS0FBTixDQUE3QyxFQUEyRCxLQUFLLGNBQUwsQ0FBb0IsS0FBSyxjQUFMLENBQW9CLE1BQXBCLEdBQTZCLENBQWpELENBQTNELENBQVI7QUFDQSxZQUFJLEtBQUssSUFBTCxJQUFhLEtBQUssTUFBdEIsRUFBOEIsS0FBSyxJQUFMLEdBQVksS0FBWjtBQUM5QixZQUFJLEtBQUosRUFBVyxPQUFPLEtBQVAsQ0FBWCxLQUE2QjtBQUNoQztBQUNELFdBQUksS0FBSyxNQUFMLEtBQWdCLEVBQXBCLEVBQXdCO0FBQ3BCLGVBQU8sS0FBSyxHQUFaO0FBQ0gsUUFGRCxNQUVPO0FBQ0gsZUFBTyxLQUFLLFVBQUwsQ0FBZ0IsNEJBQTRCLEtBQUssUUFBTCxHQUFnQixDQUE1QyxJQUFpRCx3QkFBakQsR0FBNEUsS0FBSyxZQUFMLEVBQTVGLEVBQWlILEVBQUUsTUFBTSxFQUFSLEVBQVksT0FBTyxJQUFuQixFQUF5QixNQUFNLEtBQUssUUFBcEMsRUFBakgsQ0FBUDtBQUNIO0FBQ0osT0FySU87QUFzSVIsV0FBSyxTQUFTLEdBQVQsR0FBZTtBQUNoQixXQUFJLElBQUksS0FBSyxJQUFMLEVBQVI7QUFDQSxXQUFJLE9BQU8sQ0FBUCxLQUFhLFdBQWpCLEVBQThCO0FBQzFCLGVBQU8sQ0FBUDtBQUNILFFBRkQsTUFFTztBQUNILGVBQU8sS0FBSyxHQUFMLEVBQVA7QUFDSDtBQUNKLE9BN0lPO0FBOElSLGFBQU8sU0FBUyxLQUFULENBQWUsU0FBZixFQUEwQjtBQUM3QixZQUFLLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBeUIsU0FBekI7QUFDSCxPQWhKTztBQWlKUixnQkFBVSxTQUFTLFFBQVQsR0FBb0I7QUFDMUIsY0FBTyxLQUFLLGNBQUwsQ0FBb0IsR0FBcEIsRUFBUDtBQUNILE9BbkpPO0FBb0pSLHFCQUFlLFNBQVMsYUFBVCxHQUF5QjtBQUNwQyxjQUFPLEtBQUssVUFBTCxDQUFnQixLQUFLLGNBQUwsQ0FBb0IsS0FBSyxjQUFMLENBQW9CLE1BQXBCLEdBQTZCLENBQWpELENBQWhCLEVBQXFFLEtBQTVFO0FBQ0gsT0F0Sk87QUF1SlIsZ0JBQVUsU0FBUyxRQUFULEdBQW9CO0FBQzFCLGNBQU8sS0FBSyxjQUFMLENBQW9CLEtBQUssY0FBTCxDQUFvQixNQUFwQixHQUE2QixDQUFqRCxDQUFQO0FBQ0gsT0F6Sk87QUEwSlIsaUJBQVcsU0FBUyxLQUFULENBQWUsU0FBZixFQUEwQjtBQUNqQyxZQUFLLEtBQUwsQ0FBVyxTQUFYO0FBQ0gsT0E1Sk8sRUFBWjtBQTZKQSxXQUFNLE9BQU4sR0FBZ0IsRUFBaEI7QUFDQSxXQUFNLGFBQU4sR0FBc0IsU0FBUyxTQUFULENBQW1CLEVBQW5CLEVBQXVCLEdBQXZCLEVBQTRCLHlCQUE1QixFQUF1RDtBQUM3RSxTQURzQixFQUNoQjs7QUFFRixlQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCLEdBQXRCLEVBQTJCO0FBQ3ZCLGNBQU8sSUFBSSxNQUFKLEdBQWEsSUFBSSxNQUFKLENBQVcsTUFBWCxDQUFrQixLQUFsQixFQUF5QixJQUFJLE1BQUosR0FBYSxHQUF0QyxDQUFwQjtBQUNIOztBQUVELFVBQUksVUFBVSxRQUFkO0FBQ0EsY0FBUSx5QkFBUjtBQUNJLFlBQUssQ0FBTDtBQUNJLFlBQUksSUFBSSxNQUFKLENBQVcsS0FBWCxDQUFpQixDQUFDLENBQWxCLE1BQXlCLE1BQTdCLEVBQXFDO0FBQ2pDLGVBQU0sQ0FBTixFQUFTLENBQVQ7QUFDQSxjQUFLLEtBQUwsQ0FBVyxJQUFYO0FBQ0gsU0FIRCxNQUdPLElBQUksSUFBSSxNQUFKLENBQVcsS0FBWCxDQUFpQixDQUFDLENBQWxCLE1BQXlCLElBQTdCLEVBQW1DO0FBQ3RDLGVBQU0sQ0FBTixFQUFTLENBQVQ7QUFDQSxjQUFLLEtBQUwsQ0FBVyxLQUFYO0FBQ0gsU0FITSxNQUdBO0FBQ0gsY0FBSyxLQUFMLENBQVcsSUFBWDtBQUNIO0FBQ0QsWUFBSSxJQUFJLE1BQVIsRUFBZ0IsT0FBTyxFQUFQOztBQUVoQjtBQUNKLFlBQUssQ0FBTDtBQUNJLGVBQU8sRUFBUDtBQUNBO0FBQ0osWUFBSyxDQUFMO0FBQ0ksYUFBSyxRQUFMO0FBQ0EsZUFBTyxFQUFQOztBQUVBO0FBQ0osWUFBSyxDQUFMO0FBQ0ksYUFBSyxLQUFMLENBQVcsS0FBWCxFQUFrQixPQUFPLEVBQVA7QUFDbEI7QUFDSixZQUFLLENBQUw7QUFDSSxhQUFLLFFBQUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJLEtBQUssY0FBTCxDQUFvQixLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsR0FBNkIsQ0FBakQsTUFBd0QsS0FBNUQsRUFBbUU7QUFDL0QsZ0JBQU8sRUFBUDtBQUNILFNBRkQsTUFFTztBQUNILGFBQUksTUFBSixHQUFhLElBQUksTUFBSixDQUFXLE1BQVgsQ0FBa0IsQ0FBbEIsRUFBcUIsSUFBSSxNQUFKLEdBQWEsQ0FBbEMsQ0FBYjtBQUNBLGdCQUFPLGVBQVA7QUFDSDs7QUFFRDtBQUNKLFlBQUssQ0FBTDtBQUNJLGVBQU8sRUFBUDtBQUNBO0FBQ0osWUFBSyxDQUFMO0FBQ0ksYUFBSyxRQUFMO0FBQ0EsZUFBTyxFQUFQOztBQUVBO0FBQ0osWUFBSyxDQUFMO0FBQ0ksZUFBTyxFQUFQO0FBQ0E7QUFDSixZQUFLLENBQUw7QUFDSSxlQUFPLEVBQVA7QUFDQTtBQUNKLFlBQUssQ0FBTDtBQUNJLGVBQU8sRUFBUDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxRQUFMO0FBQ0EsYUFBSyxLQUFMLENBQVcsS0FBWDtBQUNBLGVBQU8sRUFBUDs7QUFFQTtBQUNKLFlBQUssRUFBTDtBQUNJLGVBQU8sRUFBUDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksZUFBTyxFQUFQO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxlQUFPLEVBQVA7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGVBQU8sRUFBUDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxRQUFMLEdBQWdCLE9BQU8sRUFBUDtBQUNoQjtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssUUFBTCxHQUFnQixPQUFPLEVBQVA7QUFDaEI7QUFDSixZQUFLLEVBQUw7QUFDSSxlQUFPLEVBQVA7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGVBQU8sRUFBUDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksZUFBTyxFQUFQO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxlQUFPLEVBQVA7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssS0FBTCxDQUFXLElBQUksTUFBZjtBQUNBLGFBQUssUUFBTDtBQUNBLGFBQUssS0FBTCxDQUFXLEtBQVg7O0FBRUE7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLFFBQUw7QUFDQSxlQUFPLEVBQVA7O0FBRUE7QUFDSixZQUFLLEVBQUw7QUFDSSxlQUFPLEVBQVA7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGVBQU8sRUFBUDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksZUFBTyxFQUFQO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxlQUFPLEVBQVA7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGVBQU8sRUFBUDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0k7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssUUFBTCxHQUFnQixPQUFPLEVBQVA7QUFDaEI7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLFFBQUwsR0FBZ0IsT0FBTyxFQUFQO0FBQ2hCO0FBQ0osWUFBSyxFQUFMO0FBQ0ksWUFBSSxNQUFKLEdBQWEsTUFBTSxDQUFOLEVBQVMsQ0FBVCxFQUFZLE9BQVosQ0FBb0IsTUFBcEIsRUFBNEIsR0FBNUIsQ0FBYixDQUE4QyxPQUFPLEVBQVA7QUFDOUM7QUFDSixZQUFLLEVBQUw7QUFDSSxZQUFJLE1BQUosR0FBYSxNQUFNLENBQU4sRUFBUyxDQUFULEVBQVksT0FBWixDQUFvQixNQUFwQixFQUE0QixHQUE1QixDQUFiLENBQThDLE9BQU8sRUFBUDtBQUM5QztBQUNKLFlBQUssRUFBTDtBQUNJLGVBQU8sRUFBUDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksZUFBTyxFQUFQO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxlQUFPLEVBQVA7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGVBQU8sRUFBUDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksZUFBTyxFQUFQO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxlQUFPLEVBQVA7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGVBQU8sRUFBUDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksZUFBTyxFQUFQO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxlQUFPLEVBQVA7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLFlBQUksTUFBSixHQUFhLElBQUksTUFBSixDQUFXLE9BQVgsQ0FBbUIsYUFBbkIsRUFBa0MsSUFBbEMsQ0FBYixDQUFxRCxPQUFPLEVBQVA7QUFDckQ7QUFDSixZQUFLLEVBQUw7QUFDSSxlQUFPLFNBQVA7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGVBQU8sQ0FBUDtBQUNBO0FBdktSO0FBeUtILE1BakxEO0FBa0xBLFdBQU0sS0FBTixHQUFjLENBQUMsMEJBQUQsRUFBNkIsZUFBN0IsRUFBOEMsK0NBQTlDLEVBQStGLHdCQUEvRixFQUF5SCxvRUFBekgsRUFBK0wsOEJBQS9MLEVBQStOLHlCQUEvTixFQUEwUCxTQUExUCxFQUFxUSxTQUFyUSxFQUFnUixlQUFoUixFQUFpUyxlQUFqUyxFQUFrVCxnQkFBbFQsRUFBb1UsaUJBQXBVLEVBQXVWLG1CQUF2VixFQUE0VyxpQkFBNVcsRUFBK1gsNEJBQS9YLEVBQTZaLGlDQUE3WixFQUFnYyxpQkFBaGMsRUFBbWQsd0JBQW5kLEVBQTZlLGlCQUE3ZSxFQUFnZ0IsZ0JBQWhnQixFQUFraEIsa0JBQWxoQixFQUFzaUIsNEJBQXRpQixFQUFva0Isa0JBQXBrQixFQUF3bEIsUUFBeGxCLEVBQWttQixXQUFsbUIsRUFBK21CLDJCQUEvbUIsRUFBNG9CLFlBQTVvQixFQUEwcEIsVUFBMXBCLEVBQXNxQixpQkFBdHFCLEVBQXlyQixlQUF6ckIsRUFBMHNCLHNCQUExc0IsRUFBa3VCLHNCQUFsdUIsRUFBMHZCLFFBQTF2QixFQUFvd0Isd0JBQXB3QixFQUE4eEIseUJBQTl4QixFQUF5ekIsNkJBQXp6QixFQUF3MUIsd0JBQXgxQixFQUFrM0IseUNBQWwzQixFQUE2NUIsY0FBNzVCLEVBQTY2QixTQUE3NkIsRUFBdzdCLHlEQUF4N0IsRUFBbS9CLHdCQUFuL0IsRUFBNmdDLFFBQTdnQyxFQUF1aEMsUUFBdmhDLENBQWQ7QUFDQSxXQUFNLFVBQU4sR0FBbUIsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCLEVBQXRCLEVBQTBCLEVBQTFCLEVBQThCLEVBQTlCLEVBQWtDLEVBQWxDLEVBQXNDLEVBQXRDLEVBQTBDLEVBQTFDLEVBQThDLEVBQTlDLEVBQWtELEVBQWxELEVBQXNELEVBQXRELEVBQTBELEVBQTFELEVBQThELEVBQTlELEVBQWtFLEVBQWxFLEVBQXNFLEVBQXRFLEVBQTBFLEVBQTFFLEVBQThFLEVBQTlFLEVBQWtGLEVBQWxGLEVBQXNGLEVBQXRGLEVBQTBGLEVBQTFGLEVBQThGLEVBQTlGLEVBQWtHLEVBQWxHLEVBQXNHLEVBQXRHLEVBQTBHLEVBQTFHLEVBQThHLEVBQTlHLEVBQWtILEVBQWxILEVBQXNILEVBQXRILEVBQTBILEVBQTFILEVBQThILEVBQTlILEVBQWtJLEVBQWxJLEVBQXNJLEVBQXRJLEVBQTBJLEVBQTFJLEVBQThJLEVBQTlJLEVBQWtKLEVBQWxKLENBQVgsRUFBa0ssYUFBYSxLQUEvSyxFQUFSLEVBQWdNLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBRCxDQUFYLEVBQWdCLGFBQWEsS0FBN0IsRUFBdk0sRUFBNk8sT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFELENBQVgsRUFBZ0IsYUFBYSxLQUE3QixFQUFwUCxFQUEwUixPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFYLEVBQXNCLGFBQWEsS0FBbkMsRUFBalMsRUFBNlUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLEVBQVAsQ0FBWCxFQUF1QixhQUFhLElBQXBDLEVBQXhWLEVBQW5CO0FBQ0EsWUFBTyxLQUFQO0FBQ0gsS0FwVlcsRUFBWjtBQXFWQSxXQUFPLEtBQVAsR0FBZSxLQUFmO0FBQ0EsYUFBUyxNQUFULEdBQWtCO0FBQ2QsVUFBSyxFQUFMLEdBQVUsRUFBVjtBQUNILFlBQU8sU0FBUCxHQUFtQixNQUFuQixDQUEwQixPQUFPLE1BQVAsR0FBZ0IsTUFBaEI7QUFDM0IsV0FBTyxJQUFJLE1BQUosRUFBUDtBQUNILElBM3RCZ0IsRUFBakIsQ0EydEJLLFFBQVEsU0FBUixJQUFxQixVQUFyQjtBQUNMLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQXp1RUc7QUEwdUVWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxPQUFJLHlCQUF5QixvQkFBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBN0I7O0FBRUEsV0FBUSxVQUFSLEdBQXFCLElBQXJCOztBQUVBLE9BQUksV0FBVyxvQkFBb0IsRUFBcEIsQ0FBZjs7QUFFQSxPQUFJLFlBQVksdUJBQXVCLFFBQXZCLENBQWhCOztBQUVBLFlBQVMsaUJBQVQsR0FBNkI7QUFDM0IsUUFBSSxVQUFVLFVBQVUsTUFBVixJQUFvQixDQUFwQixJQUF5QixVQUFVLENBQVYsTUFBaUIsU0FBMUMsR0FBc0QsRUFBdEQsR0FBMkQsVUFBVSxDQUFWLENBQXpFOztBQUVBLFNBQUssT0FBTCxHQUFlLE9BQWY7QUFDRDtBQUNELHFCQUFrQixTQUFsQixHQUE4QixJQUFJLFVBQVUsU0FBVixDQUFKLEVBQTlCOztBQUVBLHFCQUFrQixTQUFsQixDQUE0QixPQUE1QixHQUFzQyxVQUFVLE9BQVYsRUFBbUI7QUFDdkQsUUFBSSxlQUFlLENBQUMsS0FBSyxPQUFMLENBQWEsZ0JBQWpDOztBQUVBLFFBQUksU0FBUyxDQUFDLEtBQUssVUFBbkI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsSUFBbEI7O0FBRUEsUUFBSSxPQUFPLFFBQVEsSUFBbkI7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLElBQUksQ0FBckMsRUFBd0MsR0FBeEMsRUFBNkM7QUFDM0MsU0FBSSxVQUFVLEtBQUssQ0FBTCxDQUFkO0FBQUEsU0FDSSxRQUFRLEtBQUssTUFBTCxDQUFZLE9BQVosQ0FEWjs7QUFHQSxTQUFJLENBQUMsS0FBTCxFQUFZO0FBQ1Y7QUFDRDs7QUFFRCxTQUFJLG9CQUFvQixpQkFBaUIsSUFBakIsRUFBdUIsQ0FBdkIsRUFBMEIsTUFBMUIsQ0FBeEI7QUFBQSxTQUNJLG9CQUFvQixpQkFBaUIsSUFBakIsRUFBdUIsQ0FBdkIsRUFBMEIsTUFBMUIsQ0FEeEI7QUFBQSxTQUVJLGlCQUFpQixNQUFNLGNBQU4sSUFBd0IsaUJBRjdDO0FBQUEsU0FHSSxrQkFBa0IsTUFBTSxlQUFOLElBQXlCLGlCQUgvQztBQUFBLFNBSUksbUJBQW1CLE1BQU0sZ0JBQU4sSUFBMEIsaUJBQTFCLElBQStDLGlCQUp0RTs7QUFNQSxTQUFJLE1BQU0sS0FBVixFQUFpQjtBQUNmLGdCQUFVLElBQVYsRUFBZ0IsQ0FBaEIsRUFBbUIsSUFBbkI7QUFDRDtBQUNELFNBQUksTUFBTSxJQUFWLEVBQWdCO0FBQ2QsZUFBUyxJQUFULEVBQWUsQ0FBZixFQUFrQixJQUFsQjtBQUNEOztBQUVELFNBQUksZ0JBQWdCLGdCQUFwQixFQUFzQztBQUNwQyxnQkFBVSxJQUFWLEVBQWdCLENBQWhCOztBQUVBLFVBQUksU0FBUyxJQUFULEVBQWUsQ0FBZixDQUFKLEVBQXVCO0FBQ3JCO0FBQ0EsV0FBSSxRQUFRLElBQVIsS0FBaUIsa0JBQXJCLEVBQXlDO0FBQ3ZDO0FBQ0EsZ0JBQVEsTUFBUixHQUFpQixZQUFZLElBQVosQ0FBaUIsS0FBSyxJQUFJLENBQVQsRUFBWSxRQUE3QixFQUF1QyxDQUF2QyxDQUFqQjtBQUNEO0FBQ0Y7QUFDRjtBQUNELFNBQUksZ0JBQWdCLGNBQXBCLEVBQW9DO0FBQ2xDLGdCQUFVLENBQUMsUUFBUSxPQUFSLElBQW1CLFFBQVEsT0FBNUIsRUFBcUMsSUFBL0M7O0FBRUE7QUFDQSxlQUFTLElBQVQsRUFBZSxDQUFmO0FBQ0Q7QUFDRCxTQUFJLGdCQUFnQixlQUFwQixFQUFxQztBQUNuQztBQUNBLGdCQUFVLElBQVYsRUFBZ0IsQ0FBaEI7O0FBRUEsZUFBUyxDQUFDLFFBQVEsT0FBUixJQUFtQixRQUFRLE9BQTVCLEVBQXFDLElBQTlDO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLE9BQVA7QUFDRCxJQXRERDs7QUF3REEscUJBQWtCLFNBQWxCLENBQTRCLGNBQTVCLEdBQTZDLGtCQUFrQixTQUFsQixDQUE0QixjQUE1QixHQUE2QyxrQkFBa0IsU0FBbEIsQ0FBNEIscUJBQTVCLEdBQW9ELFVBQVUsS0FBVixFQUFpQjtBQUM3SixTQUFLLE1BQUwsQ0FBWSxNQUFNLE9BQWxCO0FBQ0EsU0FBSyxNQUFMLENBQVksTUFBTSxPQUFsQjs7QUFFQTtBQUNBLFFBQUksVUFBVSxNQUFNLE9BQU4sSUFBaUIsTUFBTSxPQUFyQztBQUFBLFFBQ0ksVUFBVSxNQUFNLE9BQU4sSUFBaUIsTUFBTSxPQURyQztBQUFBLFFBRUksZUFBZSxPQUZuQjtBQUFBLFFBR0ksY0FBYyxPQUhsQjs7QUFLQSxRQUFJLFdBQVcsUUFBUSxPQUF2QixFQUFnQztBQUM5QixvQkFBZSxRQUFRLElBQVIsQ0FBYSxDQUFiLEVBQWdCLE9BQS9COztBQUVBO0FBQ0EsWUFBTyxZQUFZLE9BQW5CLEVBQTRCO0FBQzFCLG9CQUFjLFlBQVksSUFBWixDQUFpQixZQUFZLElBQVosQ0FBaUIsTUFBakIsR0FBMEIsQ0FBM0MsRUFBOEMsT0FBNUQ7QUFDRDtBQUNGOztBQUVELFFBQUksUUFBUTtBQUNWLFdBQU0sTUFBTSxTQUFOLENBQWdCLElBRFo7QUFFVixZQUFPLE1BQU0sVUFBTixDQUFpQixLQUZkOztBQUlWO0FBQ0E7QUFDQSxxQkFBZ0IsaUJBQWlCLFFBQVEsSUFBekIsQ0FOTjtBQU9WLHNCQUFpQixpQkFBaUIsQ0FBQyxnQkFBZ0IsT0FBakIsRUFBMEIsSUFBM0M7QUFQUCxLQUFaOztBQVVBLFFBQUksTUFBTSxTQUFOLENBQWdCLEtBQXBCLEVBQTJCO0FBQ3pCLGVBQVUsUUFBUSxJQUFsQixFQUF3QixJQUF4QixFQUE4QixJQUE5QjtBQUNEOztBQUVELFFBQUksT0FBSixFQUFhO0FBQ1gsU0FBSSxlQUFlLE1BQU0sWUFBekI7O0FBRUEsU0FBSSxhQUFhLElBQWpCLEVBQXVCO0FBQ3JCLGVBQVMsUUFBUSxJQUFqQixFQUF1QixJQUF2QixFQUE2QixJQUE3QjtBQUNEOztBQUVELFNBQUksYUFBYSxLQUFqQixFQUF3QjtBQUN0QixnQkFBVSxhQUFhLElBQXZCLEVBQTZCLElBQTdCLEVBQW1DLElBQW5DO0FBQ0Q7QUFDRCxTQUFJLE1BQU0sVUFBTixDQUFpQixJQUFyQixFQUEyQjtBQUN6QixlQUFTLFlBQVksSUFBckIsRUFBMkIsSUFBM0IsRUFBaUMsSUFBakM7QUFDRDs7QUFFRDtBQUNBLFNBQUksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxnQkFBZCxJQUFrQyxpQkFBaUIsUUFBUSxJQUF6QixDQUFsQyxJQUFvRSxpQkFBaUIsYUFBYSxJQUE5QixDQUF4RSxFQUE2RztBQUMzRyxlQUFTLFFBQVEsSUFBakI7QUFDQSxnQkFBVSxhQUFhLElBQXZCO0FBQ0Q7QUFDRixLQW5CRCxNQW1CTyxJQUFJLE1BQU0sVUFBTixDQUFpQixJQUFyQixFQUEyQjtBQUNoQyxjQUFTLFFBQVEsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0I7QUFDRDs7QUFFRCxXQUFPLEtBQVA7QUFDRCxJQXpERDs7QUEyREEscUJBQWtCLFNBQWxCLENBQTRCLFNBQTVCLEdBQXdDLGtCQUFrQixTQUFsQixDQUE0QixpQkFBNUIsR0FBZ0QsVUFBVSxRQUFWLEVBQW9CO0FBQzFHLFdBQU8sU0FBUyxLQUFoQjtBQUNELElBRkQ7O0FBSUEscUJBQWtCLFNBQWxCLENBQTRCLGdCQUE1QixHQUErQyxrQkFBa0IsU0FBbEIsQ0FBNEIsZ0JBQTVCLEdBQStDLFVBQVUsSUFBVixFQUFnQjtBQUM1RztBQUNBLFFBQUksUUFBUSxLQUFLLEtBQUwsSUFBYyxFQUExQjtBQUNBLFdBQU87QUFDTCx1QkFBa0IsSUFEYjtBQUVMLFdBQU0sTUFBTSxJQUZQO0FBR0wsWUFBTyxNQUFNO0FBSFIsS0FBUDtBQUtELElBUkQ7O0FBVUEsWUFBUyxnQkFBVCxDQUEwQixJQUExQixFQUFnQyxDQUFoQyxFQUFtQyxNQUFuQyxFQUEyQztBQUN6QyxRQUFJLE1BQU0sU0FBVixFQUFxQjtBQUNuQixTQUFJLEtBQUssTUFBVDtBQUNEOztBQUVEO0FBQ0E7QUFDQSxRQUFJLE9BQU8sS0FBSyxJQUFJLENBQVQsQ0FBWDtBQUFBLFFBQ0ksVUFBVSxLQUFLLElBQUksQ0FBVCxDQURkO0FBRUEsUUFBSSxDQUFDLElBQUwsRUFBVztBQUNULFlBQU8sTUFBUDtBQUNEOztBQUVELFFBQUksS0FBSyxJQUFMLEtBQWMsa0JBQWxCLEVBQXNDO0FBQ3BDLFlBQU8sQ0FBQyxXQUFXLENBQUMsTUFBWixHQUFxQixZQUFyQixHQUFvQyxnQkFBckMsRUFBdUQsSUFBdkQsQ0FBNEQsS0FBSyxRQUFqRSxDQUFQO0FBQ0Q7QUFDRjtBQUNELFlBQVMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0MsQ0FBaEMsRUFBbUMsTUFBbkMsRUFBMkM7QUFDekMsUUFBSSxNQUFNLFNBQVYsRUFBcUI7QUFDbkIsU0FBSSxDQUFDLENBQUw7QUFDRDs7QUFFRCxRQUFJLE9BQU8sS0FBSyxJQUFJLENBQVQsQ0FBWDtBQUFBLFFBQ0ksVUFBVSxLQUFLLElBQUksQ0FBVCxDQURkO0FBRUEsUUFBSSxDQUFDLElBQUwsRUFBVztBQUNULFlBQU8sTUFBUDtBQUNEOztBQUVELFFBQUksS0FBSyxJQUFMLEtBQWMsa0JBQWxCLEVBQXNDO0FBQ3BDLFlBQU8sQ0FBQyxXQUFXLENBQUMsTUFBWixHQUFxQixZQUFyQixHQUFvQyxnQkFBckMsRUFBdUQsSUFBdkQsQ0FBNEQsS0FBSyxRQUFqRSxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVMsU0FBVCxDQUFtQixJQUFuQixFQUF5QixDQUF6QixFQUE0QixRQUE1QixFQUFzQztBQUNwQyxRQUFJLFVBQVUsS0FBSyxLQUFLLElBQUwsR0FBWSxDQUFaLEdBQWdCLElBQUksQ0FBekIsQ0FBZDtBQUNBLFFBQUksQ0FBQyxPQUFELElBQVksUUFBUSxJQUFSLEtBQWlCLGtCQUE3QixJQUFtRCxDQUFDLFFBQUQsSUFBYSxRQUFRLGFBQTVFLEVBQTJGO0FBQ3pGO0FBQ0Q7O0FBRUQsUUFBSSxXQUFXLFFBQVEsS0FBdkI7QUFDQSxZQUFRLEtBQVIsR0FBZ0IsUUFBUSxLQUFSLENBQWMsT0FBZCxDQUFzQixXQUFXLE1BQVgsR0FBb0IsZUFBMUMsRUFBMkQsRUFBM0QsQ0FBaEI7QUFDQSxZQUFRLGFBQVIsR0FBd0IsUUFBUSxLQUFSLEtBQWtCLFFBQTFDO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFTLFFBQVQsQ0FBa0IsSUFBbEIsRUFBd0IsQ0FBeEIsRUFBMkIsUUFBM0IsRUFBcUM7QUFDbkMsUUFBSSxVQUFVLEtBQUssS0FBSyxJQUFMLEdBQVksS0FBSyxNQUFMLEdBQWMsQ0FBMUIsR0FBOEIsSUFBSSxDQUF2QyxDQUFkO0FBQ0EsUUFBSSxDQUFDLE9BQUQsSUFBWSxRQUFRLElBQVIsS0FBaUIsa0JBQTdCLElBQW1ELENBQUMsUUFBRCxJQUFhLFFBQVEsWUFBNUUsRUFBMEY7QUFDeEY7QUFDRDs7QUFFRDtBQUNBLFFBQUksV0FBVyxRQUFRLEtBQXZCO0FBQ0EsWUFBUSxLQUFSLEdBQWdCLFFBQVEsS0FBUixDQUFjLE9BQWQsQ0FBc0IsV0FBVyxNQUFYLEdBQW9CLFNBQTFDLEVBQXFELEVBQXJELENBQWhCO0FBQ0EsWUFBUSxZQUFSLEdBQXVCLFFBQVEsS0FBUixLQUFrQixRQUF6QztBQUNBLFdBQU8sUUFBUSxZQUFmO0FBQ0Q7O0FBRUQsV0FBUSxTQUFSLElBQXFCLGlCQUFyQjtBQUNBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQXo4RUc7QUEwOEVWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxPQUFJLHlCQUF5QixvQkFBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBN0I7O0FBRUEsV0FBUSxVQUFSLEdBQXFCLElBQXJCOztBQUVBLE9BQUksYUFBYSxvQkFBb0IsQ0FBcEIsQ0FBakI7O0FBRUEsT0FBSSxjQUFjLHVCQUF1QixVQUF2QixDQUFsQjs7QUFFQSxZQUFTLE9BQVQsR0FBbUI7QUFDakIsU0FBSyxPQUFMLEdBQWUsRUFBZjtBQUNEOztBQUVELFdBQVEsU0FBUixHQUFvQjtBQUNsQixpQkFBYSxPQURLO0FBRWxCLGNBQVUsS0FGUTs7QUFJbEI7QUFDQSxlQUFXLFNBQVMsU0FBVCxDQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQjtBQUN4QyxTQUFJLFFBQVEsS0FBSyxNQUFMLENBQVksS0FBSyxJQUFMLENBQVosQ0FBWjtBQUNBLFNBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2pCO0FBQ0E7QUFDQSxVQUFJLFNBQVMsQ0FBQyxRQUFRLFNBQVIsQ0FBa0IsTUFBTSxJQUF4QixDQUFkLEVBQTZDO0FBQzNDLGFBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQiwyQkFBMkIsTUFBTSxJQUFqQyxHQUF3Qyx5QkFBeEMsR0FBb0UsSUFBcEUsR0FBMkUsTUFBM0UsR0FBb0YsS0FBSyxJQUFwSCxDQUFOO0FBQ0Q7QUFDRCxXQUFLLElBQUwsSUFBYSxLQUFiO0FBQ0Q7QUFDRixLQWZpQjs7QUFpQmxCO0FBQ0E7QUFDQSxvQkFBZ0IsU0FBUyxjQUFULENBQXdCLElBQXhCLEVBQThCLElBQTlCLEVBQW9DO0FBQ2xELFVBQUssU0FBTCxDQUFlLElBQWYsRUFBcUIsSUFBckI7O0FBRUEsU0FBSSxDQUFDLEtBQUssSUFBTCxDQUFMLEVBQWlCO0FBQ2YsWUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLEtBQUssSUFBTCxHQUFZLFlBQVosR0FBMkIsSUFBdEQsQ0FBTjtBQUNEO0FBQ0YsS0F6QmlCOztBQTJCbEI7QUFDQTtBQUNBLGlCQUFhLFNBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QjtBQUN2QyxVQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLElBQUksQ0FBdEMsRUFBeUMsR0FBekMsRUFBOEM7QUFDNUMsV0FBSyxTQUFMLENBQWUsS0FBZixFQUFzQixDQUF0Qjs7QUFFQSxVQUFJLENBQUMsTUFBTSxDQUFOLENBQUwsRUFBZTtBQUNiLGFBQU0sTUFBTixDQUFhLENBQWIsRUFBZ0IsQ0FBaEI7QUFDQTtBQUNBO0FBQ0Q7QUFDRjtBQUNGLEtBdkNpQjs7QUF5Q2xCLFlBQVEsU0FBUyxNQUFULENBQWdCLE1BQWhCLEVBQXdCO0FBQzlCLFNBQUksQ0FBQyxNQUFMLEVBQWE7QUFDWDtBQUNEOztBQUVEO0FBQ0EsU0FBSSxDQUFDLEtBQUssT0FBTyxJQUFaLENBQUwsRUFBd0I7QUFDdEIsWUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLG1CQUFtQixPQUFPLElBQXJELEVBQTJELE1BQTNELENBQU47QUFDRDs7QUFFRCxTQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQixXQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEtBQUssT0FBMUI7QUFDRDtBQUNELFVBQUssT0FBTCxHQUFlLE1BQWY7O0FBRUEsU0FBSSxNQUFNLEtBQUssT0FBTyxJQUFaLEVBQWtCLE1BQWxCLENBQVY7O0FBRUEsVUFBSyxPQUFMLEdBQWUsS0FBSyxPQUFMLENBQWEsS0FBYixFQUFmOztBQUVBLFNBQUksQ0FBQyxLQUFLLFFBQU4sSUFBa0IsR0FBdEIsRUFBMkI7QUFDekIsYUFBTyxHQUFQO0FBQ0QsTUFGRCxNQUVPLElBQUksUUFBUSxLQUFaLEVBQW1CO0FBQ3hCLGFBQU8sTUFBUDtBQUNEO0FBQ0YsS0FqRWlCOztBQW1FbEIsYUFBUyxTQUFTLE9BQVQsQ0FBaUIsT0FBakIsRUFBMEI7QUFDakMsVUFBSyxXQUFMLENBQWlCLFFBQVEsSUFBekI7QUFDRCxLQXJFaUI7O0FBdUVsQix1QkFBbUIsa0JBdkVEO0FBd0VsQixlQUFXLGtCQXhFTzs7QUEwRWxCLG9CQUFnQixVQTFFRTtBQTJFbEIsb0JBQWdCLFVBM0VFOztBQTZFbEIsc0JBQWtCLFlBN0VBO0FBOEVsQiwyQkFBdUIsU0FBUyxxQkFBVCxDQUErQixPQUEvQixFQUF3QztBQUM3RCxrQkFBYSxJQUFiLENBQWtCLElBQWxCLEVBQXdCLE9BQXhCOztBQUVBLFVBQUssU0FBTCxDQUFlLE9BQWYsRUFBd0IsU0FBeEI7QUFDRCxLQWxGaUI7O0FBb0ZsQixzQkFBa0IsU0FBUyxnQkFBVCxHQUE0QixhQUFhLENBQUUsQ0FwRjNDO0FBcUZsQixzQkFBa0IsU0FBUyxnQkFBVCxHQUE0QixhQUFhLENBQUUsQ0FyRjNDOztBQXVGbEIsbUJBQWUsa0JBdkZHOztBQXlGbEIsb0JBQWdCLFNBQVMsY0FBVCxHQUEwQixVQUFVLENBQUUsQ0F6RnBDOztBQTJGbEIsbUJBQWUsU0FBUyxhQUFULEdBQXlCLFlBQVksQ0FBRSxDQTNGcEM7QUE0RmxCLG1CQUFlLFNBQVMsYUFBVCxHQUF5QixZQUFZLENBQUUsQ0E1RnBDO0FBNkZsQixvQkFBZ0IsU0FBUyxjQUFULEdBQTBCLFVBQVUsQ0FBRSxDQTdGcEM7QUE4RmxCLHNCQUFrQixTQUFTLGdCQUFULEdBQTRCLGFBQWEsQ0FBRSxDQTlGM0M7QUErRmxCLGlCQUFhLFNBQVMsV0FBVCxHQUF1QixhQUFhLENBQUUsQ0EvRmpDOztBQWlHbEIsVUFBTSxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CO0FBQ3hCLFVBQUssV0FBTCxDQUFpQixLQUFLLEtBQXRCO0FBQ0QsS0FuR2lCO0FBb0dsQixjQUFVLFNBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QjtBQUNoQyxVQUFLLGNBQUwsQ0FBb0IsSUFBcEIsRUFBMEIsT0FBMUI7QUFDRDtBQXRHaUIsSUFBcEI7O0FBeUdBLFlBQVMsa0JBQVQsQ0FBNEIsUUFBNUIsRUFBc0M7QUFDcEMsU0FBSyxjQUFMLENBQW9CLFFBQXBCLEVBQThCLE1BQTlCO0FBQ0EsU0FBSyxXQUFMLENBQWlCLFNBQVMsTUFBMUI7QUFDQSxTQUFLLFNBQUwsQ0FBZSxRQUFmLEVBQXlCLE1BQXpCO0FBQ0Q7QUFDRCxZQUFTLFVBQVQsQ0FBb0IsS0FBcEIsRUFBMkI7QUFDekIsdUJBQW1CLElBQW5CLENBQXdCLElBQXhCLEVBQThCLEtBQTlCOztBQUVBLFNBQUssU0FBTCxDQUFlLEtBQWYsRUFBc0IsU0FBdEI7QUFDQSxTQUFLLFNBQUwsQ0FBZSxLQUFmLEVBQXNCLFNBQXRCO0FBQ0Q7QUFDRCxZQUFTLFlBQVQsQ0FBc0IsT0FBdEIsRUFBK0I7QUFDN0IsU0FBSyxjQUFMLENBQW9CLE9BQXBCLEVBQTZCLE1BQTdCO0FBQ0EsU0FBSyxXQUFMLENBQWlCLFFBQVEsTUFBekI7QUFDQSxTQUFLLFNBQUwsQ0FBZSxPQUFmLEVBQXdCLE1BQXhCO0FBQ0Q7O0FBRUQsV0FBUSxTQUFSLElBQXFCLE9BQXJCO0FBQ0EsVUFBTyxPQUFQLEdBQWlCLFFBQVEsU0FBUixDQUFqQjs7QUFFRDtBQUFPLEdBeGxGRztBQXlsRlY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJEOztBQUVBLE9BQUkseUJBQXlCLG9CQUFvQixDQUFwQixFQUF1QixTQUF2QixDQUE3Qjs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7QUFDQSxXQUFRLGNBQVIsR0FBeUIsY0FBekI7QUFDQSxXQUFRLEVBQVIsR0FBYSxFQUFiO0FBQ0EsV0FBUSxVQUFSLEdBQXFCLFVBQXJCO0FBQ0EsV0FBUSxZQUFSLEdBQXVCLFlBQXZCO0FBQ0EsV0FBUSxXQUFSLEdBQXNCLFdBQXRCO0FBQ0EsV0FBUSxlQUFSLEdBQTBCLGVBQTFCO0FBQ0EsV0FBUSxlQUFSLEdBQTBCLGVBQTFCO0FBQ0EsV0FBUSxZQUFSLEdBQXVCLFlBQXZCO0FBQ0EsV0FBUSxjQUFSLEdBQXlCLGNBQXpCO0FBQ0EsV0FBUSxtQkFBUixHQUE4QixtQkFBOUI7O0FBRUEsT0FBSSxhQUFhLG9CQUFvQixDQUFwQixDQUFqQjs7QUFFQSxPQUFJLGNBQWMsdUJBQXVCLFVBQXZCLENBQWxCOztBQUVBLFlBQVMsYUFBVCxDQUF1QixJQUF2QixFQUE2QixLQUE3QixFQUFvQztBQUNsQyxZQUFRLE1BQU0sSUFBTixHQUFhLE1BQU0sSUFBTixDQUFXLFFBQXhCLEdBQW1DLEtBQTNDOztBQUVBLFFBQUksS0FBSyxJQUFMLENBQVUsUUFBVixLQUF1QixLQUEzQixFQUFrQztBQUNoQyxTQUFJLFlBQVksRUFBRSxLQUFLLEtBQUssSUFBTCxDQUFVLEdBQWpCLEVBQWhCOztBQUVBLFdBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQixLQUFLLElBQUwsQ0FBVSxRQUFWLEdBQXFCLGlCQUFyQixHQUF5QyxLQUFwRSxFQUEyRSxTQUEzRSxDQUFOO0FBQ0Q7QUFDRjs7QUFFRCxZQUFTLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0MsT0FBaEMsRUFBeUM7QUFDdkMsU0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLFNBQUssS0FBTCxHQUFhO0FBQ1gsV0FBTSxRQUFRLFVBREg7QUFFWCxhQUFRLFFBQVE7QUFGTCxLQUFiO0FBSUEsU0FBSyxHQUFMLEdBQVc7QUFDVCxXQUFNLFFBQVEsU0FETDtBQUVULGFBQVEsUUFBUTtBQUZQLEtBQVg7QUFJRDs7QUFFRCxZQUFTLEVBQVQsQ0FBWSxLQUFaLEVBQW1CO0FBQ2pCLFFBQUksV0FBVyxJQUFYLENBQWdCLEtBQWhCLENBQUosRUFBNEI7QUFDMUIsWUFBTyxNQUFNLE1BQU4sQ0FBYSxDQUFiLEVBQWdCLE1BQU0sTUFBTixHQUFlLENBQS9CLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxZQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVELFlBQVMsVUFBVCxDQUFvQixJQUFwQixFQUEwQixLQUExQixFQUFpQztBQUMvQixXQUFPO0FBQ0wsV0FBTSxLQUFLLE1BQUwsQ0FBWSxDQUFaLE1BQW1CLEdBRHBCO0FBRUwsWUFBTyxNQUFNLE1BQU4sQ0FBYSxNQUFNLE1BQU4sR0FBZSxDQUE1QixNQUFtQztBQUZyQyxLQUFQO0FBSUQ7O0FBRUQsWUFBUyxZQUFULENBQXNCLE9BQXRCLEVBQStCO0FBQzdCLFdBQU8sUUFBUSxPQUFSLENBQWdCLGVBQWhCLEVBQWlDLEVBQWpDLEVBQXFDLE9BQXJDLENBQTZDLGFBQTdDLEVBQTRELEVBQTVELENBQVA7QUFDRDs7QUFFRCxZQUFTLFdBQVQsQ0FBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsR0FBbEMsRUFBdUM7QUFDckMsVUFBTSxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQU47O0FBRUEsUUFBSSxXQUFXLE9BQU8sR0FBUCxHQUFhLEVBQTVCO0FBQUEsUUFDSSxNQUFNLEVBRFY7QUFBQSxRQUVJLFFBQVEsQ0FGWjtBQUFBLFFBR0ksY0FBYyxFQUhsQjs7QUFLQSxTQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLElBQUksQ0FBdEMsRUFBeUMsR0FBekMsRUFBOEM7QUFDNUMsU0FBSSxPQUFPLE1BQU0sQ0FBTixFQUFTLElBQXBCOzs7QUFFQTtBQUNBO0FBQ0EsaUJBQVksTUFBTSxDQUFOLEVBQVMsUUFBVCxLQUFzQixJQUpsQztBQUtBLGlCQUFZLENBQUMsTUFBTSxDQUFOLEVBQVMsU0FBVCxJQUFzQixFQUF2QixJQUE2QixJQUF6Qzs7QUFFQSxTQUFJLENBQUMsU0FBRCxLQUFlLFNBQVMsSUFBVCxJQUFpQixTQUFTLEdBQTFCLElBQWlDLFNBQVMsTUFBekQsQ0FBSixFQUFzRTtBQUNwRSxVQUFJLElBQUksTUFBSixHQUFhLENBQWpCLEVBQW9CO0FBQ2xCLGFBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQixtQkFBbUIsUUFBOUMsRUFBd0QsRUFBRSxLQUFLLEdBQVAsRUFBeEQsQ0FBTjtBQUNELE9BRkQsTUFFTyxJQUFJLFNBQVMsSUFBYixFQUFtQjtBQUN4QjtBQUNBLHNCQUFlLEtBQWY7QUFDRDtBQUNGLE1BUEQsTUFPTztBQUNMLFVBQUksSUFBSixDQUFTLElBQVQ7QUFDRDtBQUNGOztBQUVELFdBQU87QUFDTCxXQUFNLGdCQUREO0FBRUwsV0FBTSxJQUZEO0FBR0wsWUFBTyxLQUhGO0FBSUwsWUFBTyxHQUpGO0FBS0wsZUFBVSxRQUxMO0FBTUwsVUFBSztBQU5BLEtBQVA7QUFRRDs7QUFFRCxZQUFTLGVBQVQsQ0FBeUIsSUFBekIsRUFBK0IsTUFBL0IsRUFBdUMsSUFBdkMsRUFBNkMsSUFBN0MsRUFBbUQsS0FBbkQsRUFBMEQsT0FBMUQsRUFBbUU7QUFDakU7QUFDQSxRQUFJLGFBQWEsS0FBSyxNQUFMLENBQVksQ0FBWixLQUFrQixLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQW5DO0FBQUEsUUFDSSxVQUFVLGVBQWUsR0FBZixJQUFzQixlQUFlLEdBRG5EOztBQUdBLFFBQUksWUFBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWhCO0FBQ0EsV0FBTztBQUNMLFdBQU0sWUFBWSxXQUFaLEdBQTBCLG1CQUQzQjtBQUVMLFdBQU0sSUFGRDtBQUdMLGFBQVEsTUFISDtBQUlMLFdBQU0sSUFKRDtBQUtMLGNBQVMsT0FMSjtBQU1MLFlBQU8sS0FORjtBQU9MLFVBQUssS0FBSyxPQUFMLENBQWEsT0FBYjtBQVBBLEtBQVA7QUFTRDs7QUFFRCxZQUFTLGVBQVQsQ0FBeUIsWUFBekIsRUFBdUMsUUFBdkMsRUFBaUQsS0FBakQsRUFBd0QsT0FBeEQsRUFBaUU7QUFDL0Qsa0JBQWMsWUFBZCxFQUE0QixLQUE1Qjs7QUFFQSxjQUFVLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBVjtBQUNBLFFBQUksVUFBVTtBQUNaLFdBQU0sU0FETTtBQUVaLFdBQU0sUUFGTTtBQUdaLFlBQU8sRUFISztBQUlaLFVBQUs7QUFKTyxLQUFkOztBQU9BLFdBQU87QUFDTCxXQUFNLGdCQUREO0FBRUwsV0FBTSxhQUFhLElBRmQ7QUFHTCxhQUFRLGFBQWEsTUFIaEI7QUFJTCxXQUFNLGFBQWEsSUFKZDtBQUtMLGNBQVMsT0FMSjtBQU1MLGdCQUFXLEVBTk47QUFPTCxtQkFBYyxFQVBUO0FBUUwsaUJBQVksRUFSUDtBQVNMLFVBQUs7QUFUQSxLQUFQO0FBV0Q7O0FBRUQsWUFBUyxZQUFULENBQXNCLFNBQXRCLEVBQWlDLE9BQWpDLEVBQTBDLGlCQUExQyxFQUE2RCxLQUE3RCxFQUFvRSxRQUFwRSxFQUE4RSxPQUE5RSxFQUF1RjtBQUNyRixRQUFJLFNBQVMsTUFBTSxJQUFuQixFQUF5QjtBQUN2QixtQkFBYyxTQUFkLEVBQXlCLEtBQXpCO0FBQ0Q7O0FBRUQsUUFBSSxZQUFZLEtBQUssSUFBTCxDQUFVLFVBQVUsSUFBcEIsQ0FBaEI7O0FBRUEsWUFBUSxXQUFSLEdBQXNCLFVBQVUsV0FBaEM7O0FBRUEsUUFBSSxVQUFVLFNBQWQ7QUFBQSxRQUNJLGVBQWUsU0FEbkI7O0FBR0EsUUFBSSxpQkFBSixFQUF1QjtBQUNyQixTQUFJLFNBQUosRUFBZTtBQUNiLFlBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQix1Q0FBM0IsRUFBb0UsaUJBQXBFLENBQU47QUFDRDs7QUFFRCxTQUFJLGtCQUFrQixLQUF0QixFQUE2QjtBQUMzQix3QkFBa0IsT0FBbEIsQ0FBMEIsSUFBMUIsQ0FBK0IsQ0FBL0IsRUFBa0MsVUFBbEMsR0FBK0MsTUFBTSxLQUFyRDtBQUNEOztBQUVELG9CQUFlLGtCQUFrQixLQUFqQztBQUNBLGVBQVUsa0JBQWtCLE9BQTVCO0FBQ0Q7O0FBRUQsUUFBSSxRQUFKLEVBQWM7QUFDWixnQkFBVyxPQUFYO0FBQ0EsZUFBVSxPQUFWO0FBQ0EsZUFBVSxRQUFWO0FBQ0Q7O0FBRUQsV0FBTztBQUNMLFdBQU0sWUFBWSxnQkFBWixHQUErQixnQkFEaEM7QUFFTCxXQUFNLFVBQVUsSUFGWDtBQUdMLGFBQVEsVUFBVSxNQUhiO0FBSUwsV0FBTSxVQUFVLElBSlg7QUFLTCxjQUFTLE9BTEo7QUFNTCxjQUFTLE9BTko7QUFPTCxnQkFBVyxVQUFVLEtBUGhCO0FBUUwsbUJBQWMsWUFSVDtBQVNMLGlCQUFZLFNBQVMsTUFBTSxLQVR0QjtBQVVMLFVBQUssS0FBSyxPQUFMLENBQWEsT0FBYjtBQVZBLEtBQVA7QUFZRDs7QUFFRCxZQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsR0FBcEMsRUFBeUM7QUFDdkMsUUFBSSxDQUFDLEdBQUQsSUFBUSxXQUFXLE1BQXZCLEVBQStCO0FBQzdCLFNBQUksV0FBVyxXQUFXLENBQVgsRUFBYyxHQUE3QjtBQUFBLFNBQ0ksVUFBVSxXQUFXLFdBQVcsTUFBWCxHQUFvQixDQUEvQixFQUFrQyxHQURoRDs7QUFHQTtBQUNBLFNBQUksWUFBWSxPQUFoQixFQUF5QjtBQUN2QixZQUFNO0FBQ0osZUFBUSxTQUFTLE1BRGI7QUFFSixjQUFPO0FBQ0wsY0FBTSxTQUFTLEtBQVQsQ0FBZSxJQURoQjtBQUVMLGdCQUFRLFNBQVMsS0FBVCxDQUFlO0FBRmxCLFFBRkg7QUFNSixZQUFLO0FBQ0gsY0FBTSxRQUFRLEdBQVIsQ0FBWSxJQURmO0FBRUgsZ0JBQVEsUUFBUSxHQUFSLENBQVk7QUFGakI7QUFORCxPQUFOO0FBV0Q7QUFDRjs7QUFFRCxXQUFPO0FBQ0wsV0FBTSxTQUREO0FBRUwsV0FBTSxVQUZEO0FBR0wsWUFBTyxFQUhGO0FBSUwsVUFBSztBQUpBLEtBQVA7QUFNRDs7QUFFRCxZQUFTLG1CQUFULENBQTZCLElBQTdCLEVBQW1DLE9BQW5DLEVBQTRDLEtBQTVDLEVBQW1ELE9BQW5ELEVBQTREO0FBQzFELGtCQUFjLElBQWQsRUFBb0IsS0FBcEI7O0FBRUEsV0FBTztBQUNMLFdBQU0sdUJBREQ7QUFFTCxXQUFNLEtBQUssSUFGTjtBQUdMLGFBQVEsS0FBSyxNQUhSO0FBSUwsV0FBTSxLQUFLLElBSk47QUFLTCxjQUFTLE9BTEo7QUFNTCxnQkFBVyxLQUFLLEtBTlg7QUFPTCxpQkFBWSxTQUFTLE1BQU0sS0FQdEI7QUFRTCxVQUFLLEtBQUssT0FBTCxDQUFhLE9BQWI7QUFSQSxLQUFQO0FBVUQ7O0FBRUY7QUFBTyxHQWowRkc7QUFrMEZWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQTs7QUFFQSxPQUFJLHlCQUF5QixvQkFBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBN0I7O0FBRUEsV0FBUSxVQUFSLEdBQXFCLElBQXJCO0FBQ0EsV0FBUSxRQUFSLEdBQW1CLFFBQW5CO0FBQ0EsV0FBUSxVQUFSLEdBQXFCLFVBQXJCO0FBQ0EsV0FBUSxPQUFSLEdBQWtCLE9BQWxCOztBQUVBLE9BQUksYUFBYSxvQkFBb0IsQ0FBcEIsQ0FBakI7O0FBRUEsT0FBSSxjQUFjLHVCQUF1QixVQUF2QixDQUFsQjs7QUFFQSxPQUFJLFNBQVMsb0JBQW9CLENBQXBCLENBQWI7O0FBRUEsT0FBSSxPQUFPLG9CQUFvQixFQUFwQixDQUFYOztBQUVBLE9BQUksUUFBUSx1QkFBdUIsSUFBdkIsQ0FBWjs7QUFFQSxPQUFJLFFBQVEsR0FBRyxLQUFmOztBQUVBLFlBQVMsUUFBVCxHQUFvQixDQUFFOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxZQUFTLFNBQVQsR0FBcUI7QUFDbkIsY0FBVSxRQURTOztBQUduQixZQUFRLFNBQVMsTUFBVCxDQUFnQixLQUFoQixFQUF1QjtBQUM3QixTQUFJLE1BQU0sS0FBSyxPQUFMLENBQWEsTUFBdkI7QUFDQSxTQUFJLE1BQU0sT0FBTixDQUFjLE1BQWQsS0FBeUIsR0FBN0IsRUFBa0M7QUFDaEMsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQsVUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEdBQXBCLEVBQXlCLEdBQXpCLEVBQThCO0FBQzVCLFVBQUksU0FBUyxLQUFLLE9BQUwsQ0FBYSxDQUFiLENBQWI7QUFBQSxVQUNJLGNBQWMsTUFBTSxPQUFOLENBQWMsQ0FBZCxDQURsQjtBQUVBLFVBQUksT0FBTyxNQUFQLEtBQWtCLFlBQVksTUFBOUIsSUFBd0MsQ0FBQyxVQUFVLE9BQU8sSUFBakIsRUFBdUIsWUFBWSxJQUFuQyxDQUE3QyxFQUF1RjtBQUNyRixjQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEO0FBQ0E7QUFDQSxXQUFNLEtBQUssUUFBTCxDQUFjLE1BQXBCO0FBQ0EsVUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEdBQXBCLEVBQXlCLEdBQXpCLEVBQThCO0FBQzVCLFVBQUksQ0FBQyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLE1BQWpCLENBQXdCLE1BQU0sUUFBTixDQUFlLENBQWYsQ0FBeEIsQ0FBTCxFQUFpRDtBQUMvQyxjQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVELFlBQU8sSUFBUDtBQUNELEtBM0JrQjs7QUE2Qm5CLFVBQU0sQ0E3QmE7O0FBK0JuQixhQUFTLFNBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQixPQUExQixFQUFtQztBQUMxQyxVQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxVQUFLLE9BQUwsR0FBZSxFQUFmO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsVUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLFVBQUssWUFBTCxHQUFvQixRQUFRLFlBQTVCO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLFFBQVEsUUFBeEI7O0FBRUEsYUFBUSxXQUFSLEdBQXNCLFFBQVEsV0FBUixJQUF1QixFQUE3Qzs7QUFFQTtBQUNBLFNBQUksZUFBZSxRQUFRLFlBQTNCO0FBQ0EsYUFBUSxZQUFSLEdBQXVCO0FBQ3JCLHVCQUFpQixJQURJO0FBRXJCLDRCQUFzQixJQUZEO0FBR3JCLGNBQVEsSUFIYTtBQUlyQixZQUFNLElBSmU7QUFLckIsZ0JBQVUsSUFMVztBQU1yQixjQUFRLElBTmE7QUFPckIsYUFBTyxJQVBjO0FBUXJCLGdCQUFVO0FBUlcsTUFBdkI7QUFVQSxTQUFJLFlBQUosRUFBa0I7QUFDaEIsV0FBSyxJQUFJLEtBQVQsSUFBa0IsWUFBbEIsRUFBZ0M7QUFDOUI7QUFDQSxXQUFJLFNBQVMsWUFBYixFQUEyQjtBQUN6QixhQUFLLE9BQUwsQ0FBYSxZQUFiLENBQTBCLEtBQTFCLElBQW1DLGFBQWEsS0FBYixDQUFuQztBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxZQUFPLEtBQUssTUFBTCxDQUFZLE9BQVosQ0FBUDtBQUNELEtBL0RrQjs7QUFpRW5CLG9CQUFnQixTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUM7QUFDL0MsU0FBSSxnQkFBZ0IsSUFBSSxLQUFLLFFBQVQsRUFBcEI7O0FBQ0k7QUFDSixjQUFTLGNBQWMsT0FBZCxDQUFzQixPQUF0QixFQUErQixLQUFLLE9BQXBDLENBRlQ7QUFBQSxTQUdJLE9BQU8sS0FBSyxJQUFMLEVBSFg7O0FBS0EsVUFBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxJQUFtQixPQUFPLFVBQTVDOztBQUVBLFVBQUssUUFBTCxDQUFjLElBQWQsSUFBc0IsTUFBdEI7QUFDQSxVQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLElBQWtCLE9BQU8sU0FBMUM7O0FBRUEsWUFBTyxJQUFQO0FBQ0QsS0E3RWtCOztBQStFbkIsWUFBUSxTQUFTLE1BQVQsQ0FBZ0IsSUFBaEIsRUFBc0I7QUFDNUI7QUFDQSxTQUFJLENBQUMsS0FBSyxLQUFLLElBQVYsQ0FBTCxFQUFzQjtBQUNwQixZQUFNLElBQUksWUFBWSxTQUFaLENBQUosQ0FBMkIsbUJBQW1CLEtBQUssSUFBbkQsRUFBeUQsSUFBekQsQ0FBTjtBQUNEOztBQUVELFVBQUssVUFBTCxDQUFnQixPQUFoQixDQUF3QixJQUF4QjtBQUNBLFNBQUksTUFBTSxLQUFLLEtBQUssSUFBVixFQUFnQixJQUFoQixDQUFWO0FBQ0EsVUFBSyxVQUFMLENBQWdCLEtBQWhCO0FBQ0EsWUFBTyxHQUFQO0FBQ0QsS0F6RmtCOztBQTJGbkIsYUFBUyxTQUFTLE9BQVQsQ0FBaUIsT0FBakIsRUFBMEI7QUFDakMsVUFBSyxPQUFMLENBQWEsV0FBYixDQUF5QixPQUF6QixDQUFpQyxRQUFRLFdBQXpDOztBQUVBLFNBQUksT0FBTyxRQUFRLElBQW5CO0FBQUEsU0FDSSxhQUFhLEtBQUssTUFEdEI7QUFFQSxVQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBcEIsRUFBZ0MsR0FBaEMsRUFBcUM7QUFDbkMsV0FBSyxNQUFMLENBQVksS0FBSyxDQUFMLENBQVo7QUFDRDs7QUFFRCxVQUFLLE9BQUwsQ0FBYSxXQUFiLENBQXlCLEtBQXpCOztBQUVBLFVBQUssUUFBTCxHQUFnQixlQUFlLENBQS9CO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLFFBQVEsV0FBUixHQUFzQixRQUFRLFdBQVIsQ0FBb0IsTUFBMUMsR0FBbUQsQ0FBdEU7O0FBRUEsWUFBTyxJQUFQO0FBQ0QsS0ExR2tCOztBQTRHbkIsb0JBQWdCLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQjtBQUM3Qyw0QkFBdUIsS0FBdkI7O0FBRUEsU0FBSSxVQUFVLE1BQU0sT0FBcEI7QUFBQSxTQUNJLFVBQVUsTUFBTSxPQURwQjs7QUFHQSxlQUFVLFdBQVcsS0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQXJCO0FBQ0EsZUFBVSxXQUFXLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFyQjs7QUFFQSxTQUFJLE9BQU8sS0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQVg7O0FBRUEsU0FBSSxTQUFTLFFBQWIsRUFBdUI7QUFDckIsV0FBSyxXQUFMLENBQWlCLEtBQWpCLEVBQXdCLE9BQXhCLEVBQWlDLE9BQWpDO0FBQ0QsTUFGRCxNQUVPLElBQUksU0FBUyxRQUFiLEVBQXVCO0FBQzVCLFdBQUssV0FBTCxDQUFpQixLQUFqQjs7QUFFQTtBQUNBO0FBQ0EsV0FBSyxNQUFMLENBQVksYUFBWixFQUEyQixPQUEzQjtBQUNBLFdBQUssTUFBTCxDQUFZLGFBQVosRUFBMkIsT0FBM0I7QUFDQSxXQUFLLE1BQUwsQ0FBWSxXQUFaO0FBQ0EsV0FBSyxNQUFMLENBQVksWUFBWixFQUEwQixNQUFNLElBQU4sQ0FBVyxRQUFyQztBQUNELE1BVE0sTUFTQTtBQUNMLFdBQUssY0FBTCxDQUFvQixLQUFwQixFQUEyQixPQUEzQixFQUFvQyxPQUFwQzs7QUFFQTtBQUNBO0FBQ0EsV0FBSyxNQUFMLENBQVksYUFBWixFQUEyQixPQUEzQjtBQUNBLFdBQUssTUFBTCxDQUFZLGFBQVosRUFBMkIsT0FBM0I7QUFDQSxXQUFLLE1BQUwsQ0FBWSxXQUFaO0FBQ0EsV0FBSyxNQUFMLENBQVkscUJBQVo7QUFDRDs7QUFFRCxVQUFLLE1BQUwsQ0FBWSxRQUFaO0FBQ0QsS0E5SWtCOztBQWdKbkIsb0JBQWdCLFNBQVMsY0FBVCxDQUF3QixTQUF4QixFQUFtQztBQUNqRCxTQUFJLFVBQVUsVUFBVSxPQUFWLElBQXFCLEtBQUssY0FBTCxDQUFvQixVQUFVLE9BQTlCLENBQW5DO0FBQ0EsU0FBSSxTQUFTLEtBQUssdUJBQUwsQ0FBNkIsU0FBN0IsRUFBd0MsT0FBeEMsRUFBaUQsU0FBakQsQ0FBYjtBQUFBLFNBQ0ksT0FBTyxVQUFVLElBRHJCOztBQUdBLFVBQUssYUFBTCxHQUFxQixJQUFyQjtBQUNBLFVBQUssTUFBTCxDQUFZLG1CQUFaLEVBQWlDLE9BQU8sTUFBeEMsRUFBZ0QsS0FBSyxRQUFyRDtBQUNELEtBdkprQjs7QUF5Sm5CLHNCQUFrQixTQUFTLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DO0FBQ25ELFVBQUssVUFBTCxHQUFrQixJQUFsQjs7QUFFQSxTQUFJLFVBQVUsUUFBUSxPQUF0QjtBQUNBLFNBQUksT0FBSixFQUFhO0FBQ1gsZ0JBQVUsS0FBSyxjQUFMLENBQW9CLFFBQVEsT0FBNUIsQ0FBVjtBQUNEOztBQUVELFNBQUksU0FBUyxRQUFRLE1BQXJCO0FBQ0EsU0FBSSxPQUFPLE1BQVAsR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDckIsWUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLDhDQUE4QyxPQUFPLE1BQWhGLEVBQXdGLE9BQXhGLENBQU47QUFDRCxNQUZELE1BRU8sSUFBSSxDQUFDLE9BQU8sTUFBWixFQUFvQjtBQUN6QixVQUFJLEtBQUssT0FBTCxDQUFhLHNCQUFqQixFQUF5QztBQUN2QyxZQUFLLE1BQUwsQ0FBWSxhQUFaLEVBQTJCLFdBQTNCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsY0FBTyxJQUFQLENBQVksRUFBRSxNQUFNLGdCQUFSLEVBQTBCLE9BQU8sRUFBakMsRUFBcUMsT0FBTyxDQUE1QyxFQUFaO0FBQ0Q7QUFDRjs7QUFFRCxTQUFJLGNBQWMsUUFBUSxJQUFSLENBQWEsUUFBL0I7QUFBQSxTQUNJLFlBQVksUUFBUSxJQUFSLENBQWEsSUFBYixLQUFzQixlQUR0QztBQUVBLFNBQUksU0FBSixFQUFlO0FBQ2IsV0FBSyxNQUFMLENBQVksUUFBUSxJQUFwQjtBQUNEOztBQUVELFVBQUssdUJBQUwsQ0FBNkIsT0FBN0IsRUFBc0MsT0FBdEMsRUFBK0MsU0FBL0MsRUFBMEQsSUFBMUQ7O0FBRUEsU0FBSSxTQUFTLFFBQVEsTUFBUixJQUFrQixFQUEvQjtBQUNBLFNBQUksS0FBSyxPQUFMLENBQWEsYUFBYixJQUE4QixNQUFsQyxFQUEwQztBQUN4QyxXQUFLLE1BQUwsQ0FBWSxlQUFaLEVBQTZCLE1BQTdCO0FBQ0EsZUFBUyxFQUFUO0FBQ0Q7O0FBRUQsVUFBSyxNQUFMLENBQVksZUFBWixFQUE2QixTQUE3QixFQUF3QyxXQUF4QyxFQUFxRCxNQUFyRDtBQUNBLFVBQUssTUFBTCxDQUFZLFFBQVo7QUFDRCxLQTVMa0I7QUE2TG5CLDJCQUF1QixTQUFTLHFCQUFULENBQStCLFlBQS9CLEVBQTZDO0FBQ2xFLFVBQUssZ0JBQUwsQ0FBc0IsWUFBdEI7QUFDRCxLQS9Ma0I7O0FBaU1uQix1QkFBbUIsU0FBUyxpQkFBVCxDQUEyQixRQUEzQixFQUFxQztBQUN0RCxVQUFLLGFBQUwsQ0FBbUIsUUFBbkI7O0FBRUEsU0FBSSxTQUFTLE9BQVQsSUFBb0IsQ0FBQyxLQUFLLE9BQUwsQ0FBYSxRQUF0QyxFQUFnRDtBQUM5QyxXQUFLLE1BQUwsQ0FBWSxlQUFaO0FBQ0QsTUFGRCxNQUVPO0FBQ0wsV0FBSyxNQUFMLENBQVksUUFBWjtBQUNEO0FBQ0YsS0F6TWtCO0FBME1uQixlQUFXLFNBQVMsU0FBVCxDQUFtQixTQUFuQixFQUE4QjtBQUN2QyxVQUFLLGNBQUwsQ0FBb0IsU0FBcEI7QUFDRCxLQTVNa0I7O0FBOE1uQixzQkFBa0IsU0FBUyxnQkFBVCxDQUEwQixPQUExQixFQUFtQztBQUNuRCxTQUFJLFFBQVEsS0FBWixFQUFtQjtBQUNqQixXQUFLLE1BQUwsQ0FBWSxlQUFaLEVBQTZCLFFBQVEsS0FBckM7QUFDRDtBQUNGLEtBbE5rQjs7QUFvTm5CLHNCQUFrQixTQUFTLGdCQUFULEdBQTRCLENBQUUsQ0FwTjdCOztBQXNObkIsbUJBQWUsU0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQThCO0FBQzNDLDRCQUF1QixLQUF2QjtBQUNBLFNBQUksT0FBTyxLQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBWDs7QUFFQSxTQUFJLFNBQVMsUUFBYixFQUF1QjtBQUNyQixXQUFLLFdBQUwsQ0FBaUIsS0FBakI7QUFDRCxNQUZELE1BRU8sSUFBSSxTQUFTLFFBQWIsRUFBdUI7QUFDNUIsV0FBSyxXQUFMLENBQWlCLEtBQWpCO0FBQ0QsTUFGTSxNQUVBO0FBQ0wsV0FBSyxjQUFMLENBQW9CLEtBQXBCO0FBQ0Q7QUFDRixLQWpPa0I7QUFrT25CLG9CQUFnQixTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0IsT0FBL0IsRUFBd0MsT0FBeEMsRUFBaUQ7QUFDL0QsU0FBSSxPQUFPLE1BQU0sSUFBakI7QUFBQSxTQUNJLE9BQU8sS0FBSyxLQUFMLENBQVcsQ0FBWCxDQURYO0FBQUEsU0FFSSxVQUFVLFdBQVcsSUFBWCxJQUFtQixXQUFXLElBRjVDOztBQUlBLFVBQUssTUFBTCxDQUFZLFlBQVosRUFBMEIsS0FBSyxLQUEvQjs7QUFFQSxVQUFLLE1BQUwsQ0FBWSxhQUFaLEVBQTJCLE9BQTNCO0FBQ0EsVUFBSyxNQUFMLENBQVksYUFBWixFQUEyQixPQUEzQjs7QUFFQSxVQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0EsVUFBSyxNQUFMLENBQVksSUFBWjs7QUFFQSxVQUFLLE1BQUwsQ0FBWSxpQkFBWixFQUErQixJQUEvQixFQUFxQyxPQUFyQztBQUNELEtBaFBrQjs7QUFrUG5CLGlCQUFhLFNBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QjtBQUN2QyxTQUFJLE9BQU8sTUFBTSxJQUFqQjtBQUNBLFVBQUssTUFBTCxHQUFjLElBQWQ7QUFDQSxVQUFLLE1BQUwsQ0FBWSxJQUFaO0FBQ0EsVUFBSyxNQUFMLENBQVksdUJBQVo7QUFDRCxLQXZQa0I7O0FBeVBuQixpQkFBYSxTQUFTLFdBQVQsQ0FBcUIsS0FBckIsRUFBNEIsT0FBNUIsRUFBcUMsT0FBckMsRUFBOEM7QUFDekQsU0FBSSxTQUFTLEtBQUssdUJBQUwsQ0FBNkIsS0FBN0IsRUFBb0MsT0FBcEMsRUFBNkMsT0FBN0MsQ0FBYjtBQUFBLFNBQ0ksT0FBTyxNQUFNLElBRGpCO0FBQUEsU0FFSSxPQUFPLEtBQUssS0FBTCxDQUFXLENBQVgsQ0FGWDs7QUFJQSxTQUFJLEtBQUssT0FBTCxDQUFhLFlBQWIsQ0FBMEIsSUFBMUIsQ0FBSixFQUFxQztBQUNuQyxXQUFLLE1BQUwsQ0FBWSxtQkFBWixFQUFpQyxPQUFPLE1BQXhDLEVBQWdELElBQWhEO0FBQ0QsTUFGRCxNQUVPLElBQUksS0FBSyxPQUFMLENBQWEsZ0JBQWpCLEVBQW1DO0FBQ3hDLFlBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQixpRUFBaUUsSUFBNUYsRUFBa0csS0FBbEcsQ0FBTjtBQUNELE1BRk0sTUFFQTtBQUNMLFdBQUssTUFBTCxHQUFjLElBQWQ7QUFDQSxXQUFLLEtBQUwsR0FBYSxJQUFiOztBQUVBLFdBQUssTUFBTCxDQUFZLElBQVo7QUFDQSxXQUFLLE1BQUwsQ0FBWSxjQUFaLEVBQTRCLE9BQU8sTUFBbkMsRUFBMkMsS0FBSyxRQUFoRCxFQUEwRCxNQUFNLFNBQU4sRUFBaUIsT0FBakIsQ0FBeUIsUUFBekIsQ0FBa0MsSUFBbEMsQ0FBMUQ7QUFDRDtBQUNGLEtBelFrQjs7QUEyUW5CLG9CQUFnQixTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEI7QUFDNUMsVUFBSyxRQUFMLENBQWMsS0FBSyxLQUFuQjtBQUNBLFVBQUssTUFBTCxDQUFZLFlBQVosRUFBMEIsS0FBSyxLQUEvQjs7QUFFQSxTQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUFYO0FBQUEsU0FDSSxTQUFTLE1BQU0sU0FBTixFQUFpQixPQUFqQixDQUF5QixRQUF6QixDQUFrQyxJQUFsQyxDQURiO0FBQUEsU0FFSSxlQUFlLENBQUMsS0FBSyxLQUFOLElBQWUsQ0FBQyxNQUFoQixJQUEwQixLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FGN0M7O0FBSUEsU0FBSSxZQUFKLEVBQWtCO0FBQ2hCLFdBQUssTUFBTCxDQUFZLGtCQUFaLEVBQWdDLFlBQWhDLEVBQThDLEtBQUssS0FBbkQ7QUFDRCxNQUZELE1BRU8sSUFBSSxDQUFDLElBQUwsRUFBVztBQUNoQjtBQUNBLFdBQUssTUFBTCxDQUFZLGFBQVo7QUFDRCxNQUhNLE1BR0EsSUFBSSxLQUFLLElBQVQsRUFBZTtBQUNwQixXQUFLLE9BQUwsQ0FBYSxJQUFiLEdBQW9CLElBQXBCO0FBQ0EsV0FBSyxNQUFMLENBQVksWUFBWixFQUEwQixLQUFLLEtBQS9CLEVBQXNDLEtBQUssS0FBM0MsRUFBa0QsS0FBSyxNQUF2RDtBQUNELE1BSE0sTUFHQTtBQUNMLFdBQUssTUFBTCxDQUFZLGlCQUFaLEVBQStCLEtBQUssS0FBcEMsRUFBMkMsS0FBSyxLQUFoRCxFQUF1RCxLQUFLLE1BQTVELEVBQW9FLE1BQXBFO0FBQ0Q7QUFDRixLQTlSa0I7O0FBZ1NuQixtQkFBZSxTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsRUFBK0I7QUFDNUMsVUFBSyxNQUFMLENBQVksWUFBWixFQUEwQixPQUFPLEtBQWpDO0FBQ0QsS0FsU2tCOztBQW9TbkIsbUJBQWUsU0FBUyxhQUFULENBQXVCLE1BQXZCLEVBQStCO0FBQzVDLFVBQUssTUFBTCxDQUFZLGFBQVosRUFBMkIsT0FBTyxLQUFsQztBQUNELEtBdFNrQjs7QUF3U25CLG9CQUFnQixTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEI7QUFDNUMsVUFBSyxNQUFMLENBQVksYUFBWixFQUEyQixLQUFLLEtBQWhDO0FBQ0QsS0ExU2tCOztBQTRTbkIsc0JBQWtCLFNBQVMsZ0JBQVQsR0FBNEI7QUFDNUMsVUFBSyxNQUFMLENBQVksYUFBWixFQUEyQixXQUEzQjtBQUNELEtBOVNrQjs7QUFnVG5CLGlCQUFhLFNBQVMsV0FBVCxHQUF1QjtBQUNsQyxVQUFLLE1BQUwsQ0FBWSxhQUFaLEVBQTJCLE1BQTNCO0FBQ0QsS0FsVGtCOztBQW9UbkIsVUFBTSxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CO0FBQ3hCLFNBQUksUUFBUSxLQUFLLEtBQWpCO0FBQUEsU0FDSSxJQUFJLENBRFI7QUFBQSxTQUVJLElBQUksTUFBTSxNQUZkOztBQUlBLFVBQUssTUFBTCxDQUFZLFVBQVo7O0FBRUEsWUFBTyxJQUFJLENBQVgsRUFBYyxHQUFkLEVBQW1CO0FBQ2pCLFdBQUssU0FBTCxDQUFlLE1BQU0sQ0FBTixFQUFTLEtBQXhCO0FBQ0Q7QUFDRCxZQUFPLEdBQVAsRUFBWTtBQUNWLFdBQUssTUFBTCxDQUFZLGNBQVosRUFBNEIsTUFBTSxDQUFOLEVBQVMsR0FBckM7QUFDRDtBQUNELFVBQUssTUFBTCxDQUFZLFNBQVo7QUFDRCxLQWxVa0I7O0FBb1VuQjtBQUNBLFlBQVEsU0FBUyxNQUFULENBQWdCLElBQWhCLEVBQXNCO0FBQzVCLFVBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsRUFBRSxRQUFRLElBQVYsRUFBZ0IsTUFBTSxNQUFNLElBQU4sQ0FBVyxTQUFYLEVBQXNCLENBQXRCLENBQXRCLEVBQWdELEtBQUssS0FBSyxVQUFMLENBQWdCLENBQWhCLEVBQW1CLEdBQXhFLEVBQWxCO0FBQ0QsS0F2VWtCOztBQXlVbkIsY0FBVSxTQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBeUI7QUFDakMsU0FBSSxDQUFDLEtBQUwsRUFBWTtBQUNWO0FBQ0Q7O0FBRUQsVUFBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0QsS0EvVWtCOztBQWlWbkIsbUJBQWUsU0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQThCO0FBQzNDLFNBQUksV0FBVyxNQUFNLFNBQU4sRUFBaUIsT0FBakIsQ0FBeUIsUUFBekIsQ0FBa0MsTUFBTSxJQUF4QyxDQUFmOztBQUVBLFNBQUksZUFBZSxZQUFZLENBQUMsQ0FBQyxLQUFLLGVBQUwsQ0FBcUIsTUFBTSxJQUFOLENBQVcsS0FBWCxDQUFpQixDQUFqQixDQUFyQixDQUFqQzs7QUFFQTtBQUNBO0FBQ0EsU0FBSSxXQUFXLENBQUMsWUFBRCxJQUFpQixNQUFNLFNBQU4sRUFBaUIsT0FBakIsQ0FBeUIsZ0JBQXpCLENBQTBDLEtBQTFDLENBQWhDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQUksYUFBYSxDQUFDLFlBQUQsS0FBa0IsWUFBWSxRQUE5QixDQUFqQjs7QUFFQTtBQUNBO0FBQ0EsU0FBSSxjQUFjLENBQUMsUUFBbkIsRUFBNkI7QUFDM0IsVUFBSSxTQUFTLE1BQU0sSUFBTixDQUFXLEtBQVgsQ0FBaUIsQ0FBakIsQ0FBYjtBQUFBLFVBQ0ksVUFBVSxLQUFLLE9BRG5COztBQUdBLFVBQUksUUFBUSxZQUFSLENBQXFCLE1BQXJCLENBQUosRUFBa0M7QUFDaEMsa0JBQVcsSUFBWDtBQUNELE9BRkQsTUFFTyxJQUFJLFFBQVEsZ0JBQVosRUFBOEI7QUFDbkMsb0JBQWEsS0FBYjtBQUNEO0FBQ0Y7O0FBRUQsU0FBSSxRQUFKLEVBQWM7QUFDWixhQUFPLFFBQVA7QUFDRCxNQUZELE1BRU8sSUFBSSxVQUFKLEVBQWdCO0FBQ3JCLGFBQU8sV0FBUDtBQUNELE1BRk0sTUFFQTtBQUNMLGFBQU8sUUFBUDtBQUNEO0FBQ0YsS0FuWGtCOztBQXFYbkIsZ0JBQVksU0FBUyxVQUFULENBQW9CLE1BQXBCLEVBQTRCO0FBQ3RDLFVBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxJQUFJLE9BQU8sTUFBM0IsRUFBbUMsSUFBSSxDQUF2QyxFQUEwQyxHQUExQyxFQUErQztBQUM3QyxXQUFLLFNBQUwsQ0FBZSxPQUFPLENBQVAsQ0FBZjtBQUNEO0FBQ0YsS0F6WGtCOztBQTJYbkIsZUFBVyxTQUFTLFNBQVQsQ0FBbUIsR0FBbkIsRUFBd0I7QUFDakMsU0FBSSxRQUFRLElBQUksS0FBSixJQUFhLElBQWIsR0FBb0IsSUFBSSxLQUF4QixHQUFnQyxJQUFJLFFBQUosSUFBZ0IsRUFBNUQ7O0FBRUEsU0FBSSxLQUFLLFlBQVQsRUFBdUI7QUFDckIsVUFBSSxNQUFNLE9BQVYsRUFBbUI7QUFDakIsZUFBUSxNQUFNLE9BQU4sQ0FBYyxjQUFkLEVBQThCLEVBQTlCLEVBQWtDLE9BQWxDLENBQTBDLEtBQTFDLEVBQWlELEdBQWpELENBQVI7QUFDRDs7QUFFRCxVQUFJLElBQUksS0FBUixFQUFlO0FBQ2IsWUFBSyxRQUFMLENBQWMsSUFBSSxLQUFsQjtBQUNEO0FBQ0QsV0FBSyxNQUFMLENBQVksWUFBWixFQUEwQixJQUFJLEtBQUosSUFBYSxDQUF2QztBQUNBLFdBQUssTUFBTCxDQUFZLGlCQUFaLEVBQStCLEtBQS9CLEVBQXNDLElBQUksSUFBMUM7O0FBRUEsVUFBSSxJQUFJLElBQUosS0FBYSxlQUFqQixFQUFrQztBQUNoQztBQUNBO0FBQ0EsWUFBSyxNQUFMLENBQVksR0FBWjtBQUNEO0FBQ0YsTUFoQkQsTUFnQk87QUFDTCxVQUFJLEtBQUssUUFBVCxFQUFtQjtBQUNqQixXQUFJLGtCQUFrQixTQUF0QjtBQUNBLFdBQUksSUFBSSxLQUFKLElBQWEsQ0FBQyxNQUFNLFNBQU4sRUFBaUIsT0FBakIsQ0FBeUIsUUFBekIsQ0FBa0MsR0FBbEMsQ0FBZCxJQUF3RCxDQUFDLElBQUksS0FBakUsRUFBd0U7QUFDdEUsMEJBQWtCLEtBQUssZUFBTCxDQUFxQixJQUFJLEtBQUosQ0FBVSxDQUFWLENBQXJCLENBQWxCO0FBQ0Q7QUFDRCxXQUFJLGVBQUosRUFBcUI7QUFDbkIsWUFBSSxrQkFBa0IsSUFBSSxLQUFKLENBQVUsS0FBVixDQUFnQixDQUFoQixFQUFtQixJQUFuQixDQUF3QixHQUF4QixDQUF0QjtBQUNBLGFBQUssTUFBTCxDQUFZLFFBQVosRUFBc0IsWUFBdEIsRUFBb0MsZUFBcEMsRUFBcUQsZUFBckQ7QUFDRCxRQUhELE1BR087QUFDTCxnQkFBUSxJQUFJLFFBQUosSUFBZ0IsS0FBeEI7QUFDQSxZQUFJLE1BQU0sT0FBVixFQUFtQjtBQUNqQixpQkFBUSxNQUFNLE9BQU4sQ0FBYyxlQUFkLEVBQStCLEVBQS9CLEVBQW1DLE9BQW5DLENBQTJDLE9BQTNDLEVBQW9ELEVBQXBELEVBQXdELE9BQXhELENBQWdFLE1BQWhFLEVBQXdFLEVBQXhFLENBQVI7QUFDRDs7QUFFRCxhQUFLLE1BQUwsQ0FBWSxRQUFaLEVBQXNCLElBQUksSUFBMUIsRUFBZ0MsS0FBaEM7QUFDRDtBQUNGO0FBQ0QsV0FBSyxNQUFMLENBQVksR0FBWjtBQUNEO0FBQ0YsS0FsYWtCOztBQW9hbkIsNkJBQXlCLFNBQVMsdUJBQVQsQ0FBaUMsS0FBakMsRUFBd0MsT0FBeEMsRUFBaUQsT0FBakQsRUFBMEQsU0FBMUQsRUFBcUU7QUFDNUYsU0FBSSxTQUFTLE1BQU0sTUFBbkI7QUFDQSxVQUFLLFVBQUwsQ0FBZ0IsTUFBaEI7O0FBRUEsVUFBSyxNQUFMLENBQVksYUFBWixFQUEyQixPQUEzQjtBQUNBLFVBQUssTUFBTCxDQUFZLGFBQVosRUFBMkIsT0FBM0I7O0FBRUEsU0FBSSxNQUFNLElBQVYsRUFBZ0I7QUFDZCxXQUFLLE1BQUwsQ0FBWSxNQUFNLElBQWxCO0FBQ0QsTUFGRCxNQUVPO0FBQ0wsV0FBSyxNQUFMLENBQVksV0FBWixFQUF5QixTQUF6QjtBQUNEOztBQUVELFlBQU8sTUFBUDtBQUNELEtBbGJrQjs7QUFvYm5CLHFCQUFpQixTQUFTLGVBQVQsQ0FBeUIsSUFBekIsRUFBK0I7QUFDOUMsVUFBSyxJQUFJLFFBQVEsQ0FBWixFQUFlLE1BQU0sS0FBSyxPQUFMLENBQWEsV0FBYixDQUF5QixNQUFuRCxFQUEyRCxRQUFRLEdBQW5FLEVBQXdFLE9BQXhFLEVBQWlGO0FBQy9FLFVBQUksY0FBYyxLQUFLLE9BQUwsQ0FBYSxXQUFiLENBQXlCLEtBQXpCLENBQWxCO0FBQUEsVUFDSSxRQUFRLGVBQWUsT0FBTyxPQUFQLENBQWUsV0FBZixFQUE0QixJQUE1QixDQUQzQjtBQUVBLFVBQUksZUFBZSxTQUFTLENBQTVCLEVBQStCO0FBQzdCLGNBQU8sQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFQO0FBQ0Q7QUFDRjtBQUNGO0FBNWJrQixJQUFyQjs7QUErYkEsWUFBUyxVQUFULENBQW9CLEtBQXBCLEVBQTJCLE9BQTNCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3ZDLFFBQUksU0FBUyxJQUFULElBQWlCLE9BQU8sS0FBUCxLQUFpQixRQUFqQixJQUE2QixNQUFNLElBQU4sS0FBZSxTQUFqRSxFQUE0RTtBQUMxRSxXQUFNLElBQUksWUFBWSxTQUFaLENBQUosQ0FBMkIsbUZBQW1GLEtBQTlHLENBQU47QUFDRDs7QUFFRCxjQUFVLFdBQVcsRUFBckI7QUFDQSxRQUFJLEVBQUUsVUFBVSxPQUFaLENBQUosRUFBMEI7QUFDeEIsYUFBUSxJQUFSLEdBQWUsSUFBZjtBQUNEO0FBQ0QsUUFBSSxRQUFRLE1BQVosRUFBb0I7QUFDbEIsYUFBUSxTQUFSLEdBQW9CLElBQXBCO0FBQ0Q7O0FBRUQsUUFBSSxNQUFNLElBQUksS0FBSixDQUFVLEtBQVYsRUFBaUIsT0FBakIsQ0FBVjtBQUFBLFFBQ0ksY0FBYyxJQUFJLElBQUksUUFBUixHQUFtQixPQUFuQixDQUEyQixHQUEzQixFQUFnQyxPQUFoQyxDQURsQjtBQUVBLFdBQU8sSUFBSSxJQUFJLGtCQUFSLEdBQTZCLE9BQTdCLENBQXFDLFdBQXJDLEVBQWtELE9BQWxELENBQVA7QUFDRDs7QUFFRCxZQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0IsT0FBeEIsRUFBaUMsR0FBakMsRUFBc0M7QUFDcEMsUUFBSSxZQUFZLFNBQWhCLEVBQTJCLFVBQVUsRUFBVjs7QUFFM0IsUUFBSSxTQUFTLElBQVQsSUFBaUIsT0FBTyxLQUFQLEtBQWlCLFFBQWpCLElBQTZCLE1BQU0sSUFBTixLQUFlLFNBQWpFLEVBQTRFO0FBQzFFLFdBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQixnRkFBZ0YsS0FBM0csQ0FBTjtBQUNEOztBQUVELGNBQVUsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixPQUFsQixDQUFWO0FBQ0EsUUFBSSxFQUFFLFVBQVUsT0FBWixDQUFKLEVBQTBCO0FBQ3hCLGFBQVEsSUFBUixHQUFlLElBQWY7QUFDRDtBQUNELFFBQUksUUFBUSxNQUFaLEVBQW9CO0FBQ2xCLGFBQVEsU0FBUixHQUFvQixJQUFwQjtBQUNEOztBQUVELFFBQUksV0FBVyxTQUFmOztBQUVBLGFBQVMsWUFBVCxHQUF3QjtBQUN0QixTQUFJLE1BQU0sSUFBSSxLQUFKLENBQVUsS0FBVixFQUFpQixPQUFqQixDQUFWO0FBQUEsU0FDSSxjQUFjLElBQUksSUFBSSxRQUFSLEdBQW1CLE9BQW5CLENBQTJCLEdBQTNCLEVBQWdDLE9BQWhDLENBRGxCO0FBQUEsU0FFSSxlQUFlLElBQUksSUFBSSxrQkFBUixHQUE2QixPQUE3QixDQUFxQyxXQUFyQyxFQUFrRCxPQUFsRCxFQUEyRCxTQUEzRCxFQUFzRSxJQUF0RSxDQUZuQjtBQUdBLFlBQU8sSUFBSSxRQUFKLENBQWEsWUFBYixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxhQUFTLEdBQVQsQ0FBYSxPQUFiLEVBQXNCLFdBQXRCLEVBQW1DO0FBQ2pDLFNBQUksQ0FBQyxRQUFMLEVBQWU7QUFDYixpQkFBVyxjQUFYO0FBQ0Q7QUFDRCxZQUFPLFNBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsT0FBcEIsRUFBNkIsV0FBN0IsQ0FBUDtBQUNEO0FBQ0QsUUFBSSxNQUFKLEdBQWEsVUFBVSxZQUFWLEVBQXdCO0FBQ25DLFNBQUksQ0FBQyxRQUFMLEVBQWU7QUFDYixpQkFBVyxjQUFYO0FBQ0Q7QUFDRCxZQUFPLFNBQVMsTUFBVCxDQUFnQixZQUFoQixDQUFQO0FBQ0QsS0FMRDtBQU1BLFFBQUksTUFBSixHQUFhLFVBQVUsQ0FBVixFQUFhLElBQWIsRUFBbUIsV0FBbkIsRUFBZ0MsTUFBaEMsRUFBd0M7QUFDbkQsU0FBSSxDQUFDLFFBQUwsRUFBZTtBQUNiLGlCQUFXLGNBQVg7QUFDRDtBQUNELFlBQU8sU0FBUyxNQUFULENBQWdCLENBQWhCLEVBQW1CLElBQW5CLEVBQXlCLFdBQXpCLEVBQXNDLE1BQXRDLENBQVA7QUFDRCxLQUxEO0FBTUEsV0FBTyxHQUFQO0FBQ0Q7O0FBRUQsWUFBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCO0FBQ3ZCLFFBQUksTUFBTSxDQUFWLEVBQWE7QUFDWCxZQUFPLElBQVA7QUFDRDs7QUFFRCxRQUFJLE9BQU8sT0FBUCxDQUFlLENBQWYsS0FBcUIsT0FBTyxPQUFQLENBQWUsQ0FBZixDQUFyQixJQUEwQyxFQUFFLE1BQUYsS0FBYSxFQUFFLE1BQTdELEVBQXFFO0FBQ25FLFVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxFQUFFLE1BQXRCLEVBQThCLEdBQTlCLEVBQW1DO0FBQ2pDLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBRixDQUFWLEVBQWdCLEVBQUUsQ0FBRixDQUFoQixDQUFMLEVBQTRCO0FBQzFCLGNBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxZQUFPLElBQVA7QUFDRDtBQUNGOztBQUVELFlBQVMsc0JBQVQsQ0FBZ0MsS0FBaEMsRUFBdUM7QUFDckMsUUFBSSxDQUFDLE1BQU0sSUFBTixDQUFXLEtBQWhCLEVBQXVCO0FBQ3JCLFNBQUksVUFBVSxNQUFNLElBQXBCO0FBQ0E7QUFDQTtBQUNBLFdBQU0sSUFBTixHQUFhO0FBQ1gsWUFBTSxnQkFESztBQUVYLFlBQU0sS0FGSztBQUdYLGFBQU8sQ0FISTtBQUlYLGFBQU8sQ0FBQyxRQUFRLFFBQVIsR0FBbUIsRUFBcEIsQ0FKSTtBQUtYLGdCQUFVLFFBQVEsUUFBUixHQUFtQixFQUxsQjtBQU1YLFdBQUssUUFBUTtBQU5GLE1BQWI7QUFRRDtBQUNGOztBQUVGO0FBQU8sR0FqNEdHO0FBazRHVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTdCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxPQUFJLFFBQVEsb0JBQW9CLENBQXBCLENBQVo7O0FBRUEsT0FBSSxhQUFhLG9CQUFvQixDQUFwQixDQUFqQjs7QUFFQSxPQUFJLGNBQWMsdUJBQXVCLFVBQXZCLENBQWxCOztBQUVBLE9BQUksU0FBUyxvQkFBb0IsQ0FBcEIsQ0FBYjs7QUFFQSxPQUFJLFdBQVcsb0JBQW9CLEVBQXBCLENBQWY7O0FBRUEsT0FBSSxZQUFZLHVCQUF1QixRQUF2QixDQUFoQjs7QUFFQSxZQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0I7QUFDdEIsU0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNEOztBQUVELFlBQVMsa0JBQVQsR0FBOEIsQ0FBRTs7QUFFaEMsc0JBQW1CLFNBQW5CLEdBQStCO0FBQzdCO0FBQ0E7QUFDQSxnQkFBWSxTQUFTLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEIsSUFBNUIsQ0FBaUMsV0FBakMsRUFBOEM7QUFDeEQsU0FBSSxtQkFBbUIsNkJBQW5CLENBQWlELElBQWpELENBQUosRUFBNEQ7QUFDMUQsYUFBTyxDQUFDLE1BQUQsRUFBUyxHQUFULEVBQWMsSUFBZCxDQUFQO0FBQ0QsTUFGRCxNQUVPO0FBQ0wsYUFBTyxDQUFDLE1BQUQsRUFBUyxHQUFULEVBQWMsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFkLEVBQW9DLEdBQXBDLENBQVA7QUFDRDtBQUNGLEtBVDRCO0FBVTdCLG1CQUFlLFNBQVMsYUFBVCxDQUF1QixJQUF2QixFQUE2QjtBQUMxQyxZQUFPLENBQUMsS0FBSyxTQUFMLENBQWUsa0JBQWYsQ0FBRCxFQUFxQyxZQUFyQyxFQUFtRCxJQUFuRCxFQUF5RCxJQUF6RCxDQUFQO0FBQ0QsS0FaNEI7O0FBYzdCLGtCQUFjLFNBQVMsWUFBVCxHQUF3QjtBQUNwQyxTQUFJLFdBQVcsTUFBTSxpQkFBckI7QUFBQSxTQUNJLFdBQVcsTUFBTSxnQkFBTixDQUF1QixRQUF2QixDQURmO0FBRUEsWUFBTyxDQUFDLFFBQUQsRUFBVyxRQUFYLENBQVA7QUFDRCxLQWxCNEI7O0FBb0I3QixvQkFBZ0IsU0FBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLFFBQWhDLEVBQTBDLFFBQTFDLEVBQW9EO0FBQ2xFO0FBQ0EsU0FBSSxDQUFDLE9BQU8sT0FBUCxDQUFlLE1BQWYsQ0FBTCxFQUE2QjtBQUMzQixlQUFTLENBQUMsTUFBRCxDQUFUO0FBQ0Q7QUFDRCxjQUFTLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsTUFBakIsRUFBeUIsUUFBekIsQ0FBVDs7QUFFQSxTQUFJLEtBQUssV0FBTCxDQUFpQixRQUFyQixFQUErQjtBQUM3QixhQUFPLENBQUMsU0FBRCxFQUFZLE1BQVosRUFBb0IsR0FBcEIsQ0FBUDtBQUNELE1BRkQsTUFFTyxJQUFJLFFBQUosRUFBYztBQUNuQjtBQUNBO0FBQ0E7QUFDQSxhQUFPLENBQUMsWUFBRCxFQUFlLE1BQWYsRUFBdUIsR0FBdkIsQ0FBUDtBQUNELE1BTE0sTUFLQTtBQUNMLGFBQU8sY0FBUCxHQUF3QixJQUF4QjtBQUNBLGFBQU8sTUFBUDtBQUNEO0FBQ0YsS0F0QzRCOztBQXdDN0Isc0JBQWtCLFNBQVMsZ0JBQVQsR0FBNEI7QUFDNUMsWUFBTyxLQUFLLFlBQUwsQ0FBa0IsRUFBbEIsQ0FBUDtBQUNELEtBMUM0QjtBQTJDN0I7O0FBRUEsYUFBUyxTQUFTLE9BQVQsQ0FBaUIsV0FBakIsRUFBOEIsT0FBOUIsRUFBdUMsT0FBdkMsRUFBZ0QsUUFBaEQsRUFBMEQ7QUFDakUsVUFBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0EsVUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLFVBQUssWUFBTCxHQUFvQixLQUFLLE9BQUwsQ0FBYSxZQUFqQztBQUNBLFVBQUssUUFBTCxHQUFnQixLQUFLLE9BQUwsQ0FBYSxRQUE3QjtBQUNBLFVBQUssVUFBTCxHQUFrQixDQUFDLFFBQW5COztBQUVBLFVBQUssSUFBTCxHQUFZLEtBQUssV0FBTCxDQUFpQixJQUE3QjtBQUNBLFVBQUssT0FBTCxHQUFlLENBQUMsQ0FBQyxPQUFqQjtBQUNBLFVBQUssT0FBTCxHQUFlLFdBQVc7QUFDeEIsa0JBQVksRUFEWTtBQUV4QixnQkFBVSxFQUZjO0FBR3hCLG9CQUFjO0FBSFUsTUFBMUI7O0FBTUEsVUFBSyxRQUFMOztBQUVBLFVBQUssU0FBTCxHQUFpQixDQUFqQjtBQUNBLFVBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFVBQUssT0FBTCxHQUFlLEVBQWY7QUFDQSxVQUFLLFNBQUwsR0FBaUIsRUFBRSxNQUFNLEVBQVIsRUFBakI7QUFDQSxVQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsVUFBSyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLEVBQW5COztBQUVBLFVBQUssZUFBTCxDQUFxQixXQUFyQixFQUFrQyxPQUFsQzs7QUFFQSxVQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLElBQWtCLFlBQVksU0FBOUIsSUFBMkMsWUFBWSxhQUF2RCxJQUF3RSxLQUFLLE9BQUwsQ0FBYSxNQUF0RztBQUNBLFVBQUssY0FBTCxHQUFzQixLQUFLLGNBQUwsSUFBdUIsWUFBWSxjQUF6RDs7QUFFQSxTQUFJLFVBQVUsWUFBWSxPQUExQjtBQUFBLFNBQ0ksU0FBUyxTQURiO0FBQUEsU0FFSSxXQUFXLFNBRmY7QUFBQSxTQUdJLElBQUksU0FIUjtBQUFBLFNBSUksSUFBSSxTQUpSOztBQU1BLFVBQUssSUFBSSxDQUFKLEVBQU8sSUFBSSxRQUFRLE1BQXhCLEVBQWdDLElBQUksQ0FBcEMsRUFBdUMsR0FBdkMsRUFBNEM7QUFDMUMsZUFBUyxRQUFRLENBQVIsQ0FBVDs7QUFFQSxXQUFLLE1BQUwsQ0FBWSxlQUFaLEdBQThCLE9BQU8sR0FBckM7QUFDQSxpQkFBVyxZQUFZLE9BQU8sR0FBOUI7QUFDQSxXQUFLLE9BQU8sTUFBWixFQUFvQixLQUFwQixDQUEwQixJQUExQixFQUFnQyxPQUFPLElBQXZDO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFLLE1BQUwsQ0FBWSxlQUFaLEdBQThCLFFBQTlCO0FBQ0EsVUFBSyxVQUFMLENBQWdCLEVBQWhCOztBQUVBO0FBQ0EsU0FBSSxLQUFLLFNBQUwsSUFBa0IsS0FBSyxXQUFMLENBQWlCLE1BQW5DLElBQTZDLEtBQUssWUFBTCxDQUFrQixNQUFuRSxFQUEyRTtBQUN6RSxZQUFNLElBQUksWUFBWSxTQUFaLENBQUosQ0FBMkIsOENBQTNCLENBQU47QUFDRDs7QUFFRCxTQUFJLENBQUMsS0FBSyxVQUFMLENBQWdCLE9BQWhCLEVBQUwsRUFBZ0M7QUFDOUIsV0FBSyxhQUFMLEdBQXFCLElBQXJCOztBQUVBLFdBQUssVUFBTCxDQUFnQixPQUFoQixDQUF3QiwwQ0FBeEI7QUFDQSxXQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsWUFBckI7O0FBRUEsVUFBSSxRQUFKLEVBQWM7QUFDWixZQUFLLFVBQUwsR0FBa0IsU0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLFdBQWhCLEVBQTZCLFFBQTdCLEVBQXVDLE1BQXZDLEVBQStDLGFBQS9DLEVBQThELFFBQTlELEVBQXdFLEtBQUssVUFBTCxDQUFnQixLQUFoQixFQUF4RSxDQUFyQixDQUFsQjtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUssVUFBTCxDQUFnQixPQUFoQixDQUF3Qix1RUFBeEI7QUFDQSxZQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsS0FBckI7QUFDQSxZQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLEtBQWhCLEVBQWxCO0FBQ0Q7QUFDRixNQWJELE1BYU87QUFDTCxXQUFLLFVBQUwsR0FBa0IsU0FBbEI7QUFDRDs7QUFFRCxTQUFJLEtBQUssS0FBSyxxQkFBTCxDQUEyQixRQUEzQixDQUFUO0FBQ0EsU0FBSSxDQUFDLEtBQUssT0FBVixFQUFtQjtBQUNqQixVQUFJLE1BQU07QUFDUixpQkFBVSxLQUFLLFlBQUwsRUFERjtBQUVSLGFBQU07QUFGRSxPQUFWOztBQUtBLFVBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLFdBQUksTUFBSixHQUFhLEtBQUssVUFBbEIsQ0FEbUIsQ0FDVztBQUM5QixXQUFJLGFBQUosR0FBb0IsSUFBcEI7QUFDRDs7QUFFRCxVQUFJLFdBQVcsS0FBSyxPQUFwQjtBQUNBLFVBQUksV0FBVyxTQUFTLFFBQXhCO0FBQ0EsVUFBSSxhQUFhLFNBQVMsVUFBMUI7O0FBRUEsV0FBSyxJQUFJLENBQUosRUFBTyxJQUFJLFNBQVMsTUFBekIsRUFBaUMsSUFBSSxDQUFyQyxFQUF3QyxHQUF4QyxFQUE2QztBQUMzQyxXQUFJLFNBQVMsQ0FBVCxDQUFKLEVBQWlCO0FBQ2YsWUFBSSxDQUFKLElBQVMsU0FBUyxDQUFULENBQVQ7QUFDQSxZQUFJLFdBQVcsQ0FBWCxDQUFKLEVBQW1CO0FBQ2pCLGFBQUksSUFBSSxJQUFSLElBQWdCLFdBQVcsQ0FBWCxDQUFoQjtBQUNBLGFBQUksYUFBSixHQUFvQixJQUFwQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxVQUFJLEtBQUssV0FBTCxDQUFpQixVQUFyQixFQUFpQztBQUMvQixXQUFJLFVBQUosR0FBaUIsSUFBakI7QUFDRDtBQUNELFVBQUksS0FBSyxPQUFMLENBQWEsSUFBakIsRUFBdUI7QUFDckIsV0FBSSxPQUFKLEdBQWMsSUFBZDtBQUNEO0FBQ0QsVUFBSSxLQUFLLFNBQVQsRUFBb0I7QUFDbEIsV0FBSSxTQUFKLEdBQWdCLElBQWhCO0FBQ0Q7QUFDRCxVQUFJLEtBQUssY0FBVCxFQUF5QjtBQUN2QixXQUFJLGNBQUosR0FBcUIsSUFBckI7QUFDRDtBQUNELFVBQUksS0FBSyxPQUFMLENBQWEsTUFBakIsRUFBeUI7QUFDdkIsV0FBSSxNQUFKLEdBQWEsSUFBYjtBQUNEOztBQUVELFVBQUksQ0FBQyxRQUFMLEVBQWU7QUFDYixXQUFJLFFBQUosR0FBZSxLQUFLLFNBQUwsQ0FBZSxJQUFJLFFBQW5CLENBQWY7O0FBRUEsWUFBSyxNQUFMLENBQVksZUFBWixHQUE4QixFQUFFLE9BQU8sRUFBRSxNQUFNLENBQVIsRUFBVyxRQUFRLENBQW5CLEVBQVQsRUFBOUI7QUFDQSxhQUFNLEtBQUssYUFBTCxDQUFtQixHQUFuQixDQUFOOztBQUVBLFdBQUksUUFBUSxPQUFaLEVBQXFCO0FBQ25CLGNBQU0sSUFBSSxxQkFBSixDQUEwQixFQUFFLE1BQU0sUUFBUSxRQUFoQixFQUExQixDQUFOO0FBQ0EsWUFBSSxHQUFKLEdBQVUsSUFBSSxHQUFKLElBQVcsSUFBSSxHQUFKLENBQVEsUUFBUixFQUFyQjtBQUNELFFBSEQsTUFHTztBQUNMLGNBQU0sSUFBSSxRQUFKLEVBQU47QUFDRDtBQUNGLE9BWkQsTUFZTztBQUNMLFdBQUksZUFBSixHQUFzQixLQUFLLE9BQTNCO0FBQ0Q7O0FBRUQsYUFBTyxHQUFQO0FBQ0QsTUExREQsTUEwRE87QUFDTCxhQUFPLEVBQVA7QUFDRDtBQUNGLEtBbEw0Qjs7QUFvTDdCLGNBQVUsU0FBUyxRQUFULEdBQW9CO0FBQzVCO0FBQ0E7QUFDQSxVQUFLLFdBQUwsR0FBbUIsQ0FBbkI7QUFDQSxVQUFLLE1BQUwsR0FBYyxJQUFJLFVBQVUsU0FBVixDQUFKLENBQXlCLEtBQUssT0FBTCxDQUFhLE9BQXRDLENBQWQ7QUFDQSxVQUFLLFVBQUwsR0FBa0IsSUFBSSxVQUFVLFNBQVYsQ0FBSixDQUF5QixLQUFLLE9BQUwsQ0FBYSxPQUF0QyxDQUFsQjtBQUNELEtBMUw0Qjs7QUE0TDdCLDJCQUF1QixTQUFTLHFCQUFULENBQStCLFFBQS9CLEVBQXlDO0FBQzlELFNBQUksa0JBQWtCLEVBQXRCOztBQUVBLFNBQUksU0FBUyxLQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLEtBQUssU0FBTCxDQUFlLElBQXJDLENBQWI7QUFDQSxTQUFJLE9BQU8sTUFBUCxHQUFnQixDQUFwQixFQUF1QjtBQUNyQix5QkFBbUIsT0FBTyxPQUFPLElBQVAsQ0FBWSxJQUFaLENBQTFCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBSSxhQUFhLENBQWpCO0FBQ0EsVUFBSyxJQUFJLEtBQVQsSUFBa0IsS0FBSyxPQUF2QixFQUFnQztBQUM5QjtBQUNBLFVBQUksT0FBTyxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQVg7O0FBRUEsVUFBSSxLQUFLLE9BQUwsQ0FBYSxjQUFiLENBQTRCLEtBQTVCLEtBQXNDLEtBQUssUUFBM0MsSUFBdUQsS0FBSyxjQUFMLEdBQXNCLENBQWpGLEVBQW9GO0FBQ2xGLDBCQUFtQixZQUFZLEVBQUUsVUFBZCxHQUEyQixHQUEzQixHQUFpQyxLQUFwRDtBQUNBLFlBQUssUUFBTCxDQUFjLENBQWQsSUFBbUIsVUFBVSxVQUE3QjtBQUNEO0FBQ0Y7O0FBRUQsU0FBSSxTQUFTLENBQUMsV0FBRCxFQUFjLFFBQWQsRUFBd0IsU0FBeEIsRUFBbUMsVUFBbkMsRUFBK0MsTUFBL0MsQ0FBYjs7QUFFQSxTQUFJLEtBQUssY0FBTCxJQUF1QixLQUFLLFNBQWhDLEVBQTJDO0FBQ3pDLGFBQU8sSUFBUCxDQUFZLGFBQVo7QUFDRDtBQUNELFNBQUksS0FBSyxTQUFULEVBQW9CO0FBQ2xCLGFBQU8sSUFBUCxDQUFZLFFBQVo7QUFDRDs7QUFFRDtBQUNBLFNBQUksU0FBUyxLQUFLLFdBQUwsQ0FBaUIsZUFBakIsQ0FBYjs7QUFFQSxTQUFJLFFBQUosRUFBYztBQUNaLGFBQU8sSUFBUCxDQUFZLE1BQVo7O0FBRUEsYUFBTyxTQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLENBQVA7QUFDRCxNQUpELE1BSU87QUFDTCxhQUFPLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsQ0FBQyxXQUFELEVBQWMsT0FBTyxJQUFQLENBQVksR0FBWixDQUFkLEVBQWdDLFNBQWhDLEVBQTJDLE1BQTNDLEVBQW1ELEdBQW5ELENBQWpCLENBQVA7QUFDRDtBQUNGLEtBeE80QjtBQXlPN0IsaUJBQWEsU0FBUyxXQUFULENBQXFCLGVBQXJCLEVBQXNDO0FBQ2pELFNBQUksV0FBVyxLQUFLLFdBQUwsQ0FBaUIsUUFBaEM7QUFBQSxTQUNJLGFBQWEsQ0FBQyxLQUFLLFdBRHZCO0FBQUEsU0FFSSxjQUFjLFNBRmxCO0FBQUEsU0FHSSxhQUFhLFNBSGpCO0FBQUEsU0FJSSxjQUFjLFNBSmxCO0FBQUEsU0FLSSxZQUFZLFNBTGhCO0FBTUEsVUFBSyxNQUFMLENBQVksSUFBWixDQUFpQixVQUFVLElBQVYsRUFBZ0I7QUFDL0IsVUFBSSxLQUFLLGNBQVQsRUFBeUI7QUFDdkIsV0FBSSxXQUFKLEVBQWlCO0FBQ2YsYUFBSyxPQUFMLENBQWEsTUFBYjtBQUNELFFBRkQsTUFFTztBQUNMLHNCQUFjLElBQWQ7QUFDRDtBQUNELG1CQUFZLElBQVo7QUFDRCxPQVBELE1BT087QUFDTCxXQUFJLFdBQUosRUFBaUI7QUFDZixZQUFJLENBQUMsVUFBTCxFQUFpQjtBQUNmLHVCQUFjLElBQWQ7QUFDRCxTQUZELE1BRU87QUFDTCxxQkFBWSxPQUFaLENBQW9CLFlBQXBCO0FBQ0Q7QUFDRCxrQkFBVSxHQUFWLENBQWMsR0FBZDtBQUNBLHNCQUFjLFlBQVksU0FBMUI7QUFDRDs7QUFFRCxvQkFBYSxJQUFiO0FBQ0EsV0FBSSxDQUFDLFFBQUwsRUFBZTtBQUNiLHFCQUFhLEtBQWI7QUFDRDtBQUNGO0FBQ0YsTUF4QkQ7O0FBMEJBLFNBQUksVUFBSixFQUFnQjtBQUNkLFVBQUksV0FBSixFQUFpQjtBQUNmLG1CQUFZLE9BQVosQ0FBb0IsU0FBcEI7QUFDQSxpQkFBVSxHQUFWLENBQWMsR0FBZDtBQUNELE9BSEQsTUFHTyxJQUFJLENBQUMsVUFBTCxFQUFpQjtBQUN0QixZQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLFlBQWpCO0FBQ0Q7QUFDRixNQVBELE1BT087QUFDTCx5QkFBbUIsaUJBQWlCLGNBQWMsRUFBZCxHQUFtQixLQUFLLGdCQUFMLEVBQXBDLENBQW5COztBQUVBLFVBQUksV0FBSixFQUFpQjtBQUNmLG1CQUFZLE9BQVosQ0FBb0Isa0JBQXBCO0FBQ0EsaUJBQVUsR0FBVixDQUFjLEdBQWQ7QUFDRCxPQUhELE1BR087QUFDTCxZQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLGdCQUFqQjtBQUNEO0FBQ0Y7O0FBRUQsU0FBSSxlQUFKLEVBQXFCO0FBQ25CLFdBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsU0FBUyxnQkFBZ0IsU0FBaEIsQ0FBMEIsQ0FBMUIsQ0FBVCxJQUF5QyxjQUFjLEVBQWQsR0FBbUIsS0FBNUQsQ0FBcEI7QUFDRDs7QUFFRCxZQUFPLEtBQUssTUFBTCxDQUFZLEtBQVosRUFBUDtBQUNELEtBalM0Qjs7QUFtUzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFZLFNBQVMsVUFBVCxDQUFvQixJQUFwQixFQUEwQjtBQUNwQyxTQUFJLHFCQUFxQixLQUFLLFNBQUwsQ0FBZSw0QkFBZixDQUF6QjtBQUFBLFNBQ0ksU0FBUyxDQUFDLEtBQUssV0FBTCxDQUFpQixDQUFqQixDQUFELENBRGI7QUFFQSxVQUFLLGVBQUwsQ0FBcUIsSUFBckIsRUFBMkIsQ0FBM0IsRUFBOEIsTUFBOUI7O0FBRUEsU0FBSSxZQUFZLEtBQUssUUFBTCxFQUFoQjtBQUNBLFlBQU8sTUFBUCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsU0FBcEI7O0FBRUEsVUFBSyxJQUFMLENBQVUsS0FBSyxNQUFMLENBQVksWUFBWixDQUF5QixrQkFBekIsRUFBNkMsTUFBN0MsRUFBcUQsTUFBckQsQ0FBVjtBQUNELEtBclQ0Qjs7QUF1VDdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUFxQixTQUFTLG1CQUFULEdBQStCO0FBQ2xEO0FBQ0EsU0FBSSxxQkFBcUIsS0FBSyxTQUFMLENBQWUsNEJBQWYsQ0FBekI7QUFBQSxTQUNJLFNBQVMsQ0FBQyxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBRCxDQURiO0FBRUEsVUFBSyxlQUFMLENBQXFCLEVBQXJCLEVBQXlCLENBQXpCLEVBQTRCLE1BQTVCLEVBQW9DLElBQXBDOztBQUVBLFVBQUssV0FBTDs7QUFFQSxTQUFJLFVBQVUsS0FBSyxRQUFMLEVBQWQ7QUFDQSxZQUFPLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLE9BQXBCOztBQUVBLFVBQUssVUFBTCxDQUFnQixDQUFDLE9BQUQsRUFBVSxLQUFLLFVBQWYsRUFBMkIsTUFBM0IsRUFBbUMsT0FBbkMsRUFBNEMsS0FBNUMsRUFBbUQsS0FBSyxNQUFMLENBQVksWUFBWixDQUF5QixrQkFBekIsRUFBNkMsTUFBN0MsRUFBcUQsTUFBckQsQ0FBbkQsRUFBaUgsR0FBakgsQ0FBaEI7QUFDRCxLQXpVNEI7O0FBMlU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBZSxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0M7QUFDN0MsU0FBSSxLQUFLLGNBQVQsRUFBeUI7QUFDdkIsZ0JBQVUsS0FBSyxjQUFMLEdBQXNCLE9BQWhDO0FBQ0QsTUFGRCxNQUVPO0FBQ0wsV0FBSyxlQUFMLEdBQXVCLEtBQUssTUFBTCxDQUFZLGVBQW5DO0FBQ0Q7O0FBRUQsVUFBSyxjQUFMLEdBQXNCLE9BQXRCO0FBQ0QsS0F6VjRCOztBQTJWN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBUSxTQUFTLE1BQVQsR0FBa0I7QUFDeEIsU0FBSSxLQUFLLFFBQUwsRUFBSixFQUFxQjtBQUNuQixXQUFLLFlBQUwsQ0FBa0IsVUFBVSxPQUFWLEVBQW1CO0FBQ25DLGNBQU8sQ0FBQyxhQUFELEVBQWdCLE9BQWhCLEVBQXlCLE9BQXpCLENBQVA7QUFDRCxPQUZEOztBQUlBLFdBQUssVUFBTCxDQUFnQixLQUFLLGNBQUwsQ0FBb0IsS0FBSyxRQUFMLEVBQXBCLENBQWhCO0FBQ0QsTUFORCxNQU1PO0FBQ0wsVUFBSSxRQUFRLEtBQUssUUFBTCxFQUFaO0FBQ0EsV0FBSyxVQUFMLENBQWdCLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsY0FBaEIsRUFBZ0MsS0FBSyxjQUFMLENBQW9CLEtBQXBCLEVBQTJCLFNBQTNCLEVBQXNDLElBQXRDLENBQWhDLEVBQTZFLElBQTdFLENBQWhCO0FBQ0EsVUFBSSxLQUFLLFdBQUwsQ0FBaUIsUUFBckIsRUFBK0I7QUFDN0IsWUFBSyxVQUFMLENBQWdCLENBQUMsU0FBRCxFQUFZLEtBQUssY0FBTCxDQUFvQixJQUFwQixFQUEwQixTQUExQixFQUFxQyxJQUFyQyxDQUFaLEVBQXdELElBQXhELENBQWhCO0FBQ0Q7QUFDRjtBQUNGLEtBbFg0Qjs7QUFvWDdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFlLFNBQVMsYUFBVCxHQUF5QjtBQUN0QyxVQUFLLFVBQUwsQ0FBZ0IsS0FBSyxjQUFMLENBQW9CLENBQUMsS0FBSyxTQUFMLENBQWUsNEJBQWYsQ0FBRCxFQUErQyxHQUEvQyxFQUFvRCxLQUFLLFFBQUwsRUFBcEQsRUFBcUUsR0FBckUsQ0FBcEIsQ0FBaEI7QUFDRCxLQTVYNEI7O0FBOFg3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFZLFNBQVMsVUFBVCxDQUFvQixLQUFwQixFQUEyQjtBQUNyQyxVQUFLLFdBQUwsR0FBbUIsS0FBbkI7QUFDRCxLQXZZNEI7O0FBeVk3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBYSxTQUFTLFdBQVQsR0FBdUI7QUFDbEMsVUFBSyxnQkFBTCxDQUFzQixLQUFLLFdBQUwsQ0FBaUIsS0FBSyxXQUF0QixDQUF0QjtBQUNELEtBalo0Qjs7QUFtWjdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQWlCLFNBQVMsZUFBVCxDQUF5QixLQUF6QixFQUFnQyxLQUFoQyxFQUF1QyxNQUF2QyxFQUErQyxNQUEvQyxFQUF1RDtBQUN0RSxTQUFJLElBQUksQ0FBUjs7QUFFQSxTQUFJLENBQUMsTUFBRCxJQUFXLEtBQUssT0FBTCxDQUFhLE1BQXhCLElBQWtDLENBQUMsS0FBSyxXQUE1QyxFQUF5RDtBQUN2RDtBQUNBO0FBQ0EsV0FBSyxJQUFMLENBQVUsS0FBSyxhQUFMLENBQW1CLE1BQU0sR0FBTixDQUFuQixDQUFWO0FBQ0QsTUFKRCxNQUlPO0FBQ0wsV0FBSyxXQUFMO0FBQ0Q7O0FBRUQsVUFBSyxXQUFMLENBQWlCLFNBQWpCLEVBQTRCLEtBQTVCLEVBQW1DLENBQW5DLEVBQXNDLEtBQXRDLEVBQTZDLE1BQTdDO0FBQ0QsS0F0YTRCOztBQXdhN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBa0IsU0FBUyxnQkFBVCxDQUEwQixZQUExQixFQUF3QyxLQUF4QyxFQUErQztBQUMvRCxVQUFLLGNBQUwsR0FBc0IsSUFBdEI7O0FBRUEsVUFBSyxJQUFMLENBQVUsQ0FBQyxjQUFELEVBQWlCLGFBQWEsQ0FBYixDQUFqQixFQUFrQyxJQUFsQyxFQUF3QyxhQUFhLENBQWIsQ0FBeEMsRUFBeUQsR0FBekQsQ0FBVjtBQUNBLFVBQUssV0FBTCxDQUFpQixTQUFqQixFQUE0QixLQUE1QixFQUFtQyxDQUFuQztBQUNELEtBcGI0Qjs7QUFzYjdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFZLFNBQVMsVUFBVCxDQUFvQixLQUFwQixFQUEyQixLQUEzQixFQUFrQyxNQUFsQyxFQUEwQztBQUNwRCxTQUFJLENBQUMsS0FBTCxFQUFZO0FBQ1YsV0FBSyxnQkFBTCxDQUFzQixNQUF0QjtBQUNELE1BRkQsTUFFTztBQUNMLFdBQUssZ0JBQUwsQ0FBc0IsMEJBQTBCLEtBQTFCLEdBQWtDLEdBQXhEO0FBQ0Q7O0FBRUQsVUFBSyxXQUFMLENBQWlCLE1BQWpCLEVBQXlCLEtBQXpCLEVBQWdDLENBQWhDLEVBQW1DLElBQW5DLEVBQXlDLE1BQXpDO0FBQ0QsS0FwYzRCOztBQXNjN0IsaUJBQWEsU0FBUyxXQUFULENBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLENBQWxDLEVBQXFDLEtBQXJDLEVBQTRDLE1BQTVDLEVBQW9EO0FBQy9EOztBQUVBLFNBQUksUUFBUSxJQUFaOztBQUVBLFNBQUksS0FBSyxPQUFMLENBQWEsTUFBYixJQUF1QixLQUFLLE9BQUwsQ0FBYSxhQUF4QyxFQUF1RDtBQUNyRCxXQUFLLElBQUwsQ0FBVSxhQUFhLEtBQUssT0FBTCxDQUFhLE1BQWIsSUFBdUIsTUFBcEMsRUFBNEMsSUFBNUMsRUFBa0QsS0FBbEQsRUFBeUQsSUFBekQsQ0FBVjtBQUNBO0FBQ0Q7O0FBRUQsU0FBSSxNQUFNLE1BQU0sTUFBaEI7QUFDQSxZQUFPLElBQUksR0FBWCxFQUFnQixHQUFoQixFQUFxQjtBQUNuQjtBQUNBLFdBQUssWUFBTCxDQUFrQixVQUFVLE9BQVYsRUFBbUI7QUFDbkMsV0FBSSxTQUFTLE1BQU0sVUFBTixDQUFpQixPQUFqQixFQUEwQixNQUFNLENBQU4sQ0FBMUIsRUFBb0MsSUFBcEMsQ0FBYjtBQUNBO0FBQ0E7QUFDQSxXQUFJLENBQUMsS0FBTCxFQUFZO0FBQ1YsZUFBTyxDQUFDLGFBQUQsRUFBZ0IsTUFBaEIsRUFBd0IsS0FBeEIsRUFBK0IsT0FBL0IsQ0FBUDtBQUNELFFBRkQsTUFFTztBQUNMO0FBQ0EsZUFBTyxDQUFDLE1BQUQsRUFBUyxNQUFULENBQVA7QUFDRDtBQUNGLE9BVkQ7QUFXQTtBQUNEO0FBQ0YsS0FoZTRCOztBQWtlN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBdUIsU0FBUyxxQkFBVCxHQUFpQztBQUN0RCxVQUFLLElBQUwsQ0FBVSxDQUFDLEtBQUssU0FBTCxDQUFlLGtCQUFmLENBQUQsRUFBcUMsR0FBckMsRUFBMEMsS0FBSyxRQUFMLEVBQTFDLEVBQTJELElBQTNELEVBQWlFLEtBQUssV0FBTCxDQUFpQixDQUFqQixDQUFqRSxFQUFzRixHQUF0RixDQUFWO0FBQ0QsS0EzZTRCOztBQTZlN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFpQixTQUFTLGVBQVQsQ0FBeUIsTUFBekIsRUFBaUMsSUFBakMsRUFBdUM7QUFDdEQsVUFBSyxXQUFMO0FBQ0EsVUFBSyxVQUFMLENBQWdCLElBQWhCOztBQUVBO0FBQ0E7QUFDQSxTQUFJLFNBQVMsZUFBYixFQUE4QjtBQUM1QixVQUFJLE9BQU8sTUFBUCxLQUFrQixRQUF0QixFQUFnQztBQUM5QixZQUFLLFVBQUwsQ0FBZ0IsTUFBaEI7QUFDRCxPQUZELE1BRU87QUFDTCxZQUFLLGdCQUFMLENBQXNCLE1BQXRCO0FBQ0Q7QUFDRjtBQUNGLEtBbGdCNEI7O0FBb2dCN0IsZUFBVyxTQUFTLFNBQVQsQ0FBbUIsU0FBbkIsRUFBOEI7QUFDdkMsU0FBSSxLQUFLLFFBQVQsRUFBbUI7QUFDakIsV0FBSyxJQUFMLENBQVUsSUFBVixFQURpQixDQUNBO0FBQ2xCO0FBQ0QsU0FBSSxLQUFLLFlBQVQsRUFBdUI7QUFDckIsV0FBSyxJQUFMLENBQVUsSUFBVixFQURxQixDQUNKO0FBQ2pCLFdBQUssSUFBTCxDQUFVLElBQVYsRUFGcUIsQ0FFSjtBQUNsQjtBQUNELFVBQUssZ0JBQUwsQ0FBc0IsWUFBWSxXQUFaLEdBQTBCLElBQWhEO0FBQ0QsS0E3Z0I0QjtBQThnQjdCLGNBQVUsU0FBUyxRQUFULEdBQW9CO0FBQzVCLFNBQUksS0FBSyxJQUFULEVBQWU7QUFDYixXQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLEtBQUssSUFBdEI7QUFDRDtBQUNELFVBQUssSUFBTCxHQUFZLEVBQUUsUUFBUSxFQUFWLEVBQWMsT0FBTyxFQUFyQixFQUF5QixVQUFVLEVBQW5DLEVBQXVDLEtBQUssRUFBNUMsRUFBWjtBQUNELEtBbmhCNEI7QUFvaEI3QixhQUFTLFNBQVMsT0FBVCxHQUFtQjtBQUMxQixTQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLFVBQUssSUFBTCxHQUFZLEtBQUssTUFBTCxDQUFZLEdBQVosRUFBWjs7QUFFQSxTQUFJLEtBQUssUUFBVCxFQUFtQjtBQUNqQixXQUFLLElBQUwsQ0FBVSxLQUFLLGFBQUwsQ0FBbUIsS0FBSyxHQUF4QixDQUFWO0FBQ0Q7QUFDRCxTQUFJLEtBQUssWUFBVCxFQUF1QjtBQUNyQixXQUFLLElBQUwsQ0FBVSxLQUFLLGFBQUwsQ0FBbUIsS0FBSyxRQUF4QixDQUFWO0FBQ0EsV0FBSyxJQUFMLENBQVUsS0FBSyxhQUFMLENBQW1CLEtBQUssS0FBeEIsQ0FBVjtBQUNEOztBQUVELFVBQUssSUFBTCxDQUFVLEtBQUssYUFBTCxDQUFtQixLQUFLLE1BQXhCLENBQVY7QUFDRCxLQWppQjRCOztBQW1pQjdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFZLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QjtBQUN0QyxVQUFLLGdCQUFMLENBQXNCLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUF0QjtBQUNELEtBM2lCNEI7O0FBNmlCN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFhLFNBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QjtBQUN2QyxVQUFLLGdCQUFMLENBQXNCLEtBQXRCO0FBQ0QsS0F2akI0Qjs7QUF5akI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWEsU0FBUyxXQUFULENBQXFCLElBQXJCLEVBQTJCO0FBQ3RDLFNBQUksUUFBUSxJQUFaLEVBQWtCO0FBQ2hCLFdBQUssZ0JBQUwsQ0FBc0IsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUF0QjtBQUNELE1BRkQsTUFFTztBQUNMLFdBQUssZ0JBQUwsQ0FBc0IsSUFBdEI7QUFDRDtBQUNGLEtBdmtCNEI7O0FBeWtCN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBbUIsU0FBUyxpQkFBVCxDQUEyQixTQUEzQixFQUFzQyxJQUF0QyxFQUE0QztBQUM3RCxTQUFJLGlCQUFpQixLQUFLLFVBQUwsQ0FBZ0IsWUFBaEIsRUFBOEIsSUFBOUIsRUFBb0MsV0FBcEMsQ0FBckI7QUFBQSxTQUNJLFVBQVUsS0FBSyxlQUFMLENBQXFCLElBQXJCLEVBQTJCLFNBQTNCLENBRGQ7O0FBR0EsVUFBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLENBQUMsT0FBRCxFQUFVLEtBQUssVUFBTCxDQUFnQixZQUFoQixDQUE2QixjQUE3QixFQUE2QyxFQUE3QyxFQUFpRCxDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLFdBQWhCLEVBQTZCLE9BQTdCLENBQWpELENBQVYsRUFBbUcsU0FBbkcsQ0FBckI7QUFDRCxLQXJsQjRCOztBQXVsQjdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFjLFNBQVMsWUFBVCxDQUFzQixTQUF0QixFQUFpQyxJQUFqQyxFQUF1QyxRQUF2QyxFQUFpRDtBQUM3RCxTQUFJLFlBQVksS0FBSyxRQUFMLEVBQWhCO0FBQUEsU0FDSSxTQUFTLEtBQUssV0FBTCxDQUFpQixTQUFqQixFQUE0QixJQUE1QixDQURiO0FBQUEsU0FFSSxTQUFTLFdBQVcsQ0FBQyxPQUFPLElBQVIsRUFBYyxNQUFkLENBQVgsR0FBbUMsRUFGaEQ7O0FBSUEsU0FBSSxTQUFTLENBQUMsR0FBRCxFQUFNLE1BQU4sQ0FBYSxNQUFiLEVBQXFCLFNBQXJCLENBQWI7QUFDQSxTQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsTUFBbEIsRUFBMEI7QUFDeEIsYUFBTyxJQUFQLENBQVksTUFBWixFQUFvQixLQUFLLFNBQUwsQ0FBZSx1QkFBZixDQUFwQjtBQUNEO0FBQ0QsWUFBTyxJQUFQLENBQVksR0FBWjs7QUFFQSxVQUFLLElBQUwsQ0FBVSxLQUFLLE1BQUwsQ0FBWSxZQUFaLENBQXlCLE1BQXpCLEVBQWlDLE1BQWpDLEVBQXlDLE9BQU8sVUFBaEQsQ0FBVjtBQUNELEtBNW1CNEI7O0FBOG1CN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBbUIsU0FBUyxpQkFBVCxDQUEyQixTQUEzQixFQUFzQyxJQUF0QyxFQUE0QztBQUM3RCxTQUFJLFNBQVMsS0FBSyxXQUFMLENBQWlCLFNBQWpCLEVBQTRCLElBQTVCLENBQWI7QUFDQSxVQUFLLElBQUwsQ0FBVSxLQUFLLE1BQUwsQ0FBWSxZQUFaLENBQXlCLE9BQU8sSUFBaEMsRUFBc0MsTUFBdEMsRUFBOEMsT0FBTyxVQUFyRCxDQUFWO0FBQ0QsS0F4bkI0Qjs7QUEwbkI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBaUIsU0FBUyxlQUFULENBQXlCLElBQXpCLEVBQStCLFVBQS9CLEVBQTJDO0FBQzFELFVBQUssV0FBTCxDQUFpQixRQUFqQjs7QUFFQSxTQUFJLFlBQVksS0FBSyxRQUFMLEVBQWhCOztBQUVBLFVBQUssU0FBTDtBQUNBLFNBQUksU0FBUyxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsRUFBb0IsSUFBcEIsRUFBMEIsVUFBMUIsQ0FBYjs7QUFFQSxTQUFJLGFBQWEsS0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixTQUFoQixFQUEyQixJQUEzQixFQUFpQyxRQUFqQyxDQUFuQzs7QUFFQSxTQUFJLFNBQVMsQ0FBQyxHQUFELEVBQU0sWUFBTixFQUFvQixVQUFwQixFQUFnQyxNQUFoQyxFQUF3QyxTQUF4QyxFQUFtRCxHQUFuRCxDQUFiO0FBQ0EsU0FBSSxDQUFDLEtBQUssT0FBTCxDQUFhLE1BQWxCLEVBQTBCO0FBQ3hCLGFBQU8sQ0FBUCxJQUFZLFlBQVo7QUFDQSxhQUFPLElBQVAsQ0FBWSxzQkFBWixFQUFvQyxLQUFLLFNBQUwsQ0FBZSx1QkFBZixDQUFwQztBQUNEOztBQUVELFVBQUssSUFBTCxDQUFVLENBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxPQUFPLFVBQVAsR0FBb0IsQ0FBQyxLQUFELEVBQVEsT0FBTyxVQUFmLENBQXBCLEdBQWlELEVBQS9ELEVBQW1FLElBQW5FLEVBQXlFLHFCQUF6RSxFQUFnRyxLQUFLLFNBQUwsQ0FBZSxZQUFmLENBQWhHLEVBQThILEtBQTlILEVBQXFJLEtBQUssTUFBTCxDQUFZLFlBQVosQ0FBeUIsUUFBekIsRUFBbUMsTUFBbkMsRUFBMkMsT0FBTyxVQUFsRCxDQUFySSxFQUFvTSxhQUFwTSxDQUFWO0FBQ0QsS0F2cEI0Qjs7QUF5cEI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFlLFNBQVMsYUFBVCxDQUF1QixTQUF2QixFQUFrQyxJQUFsQyxFQUF3QyxNQUF4QyxFQUFnRDtBQUM3RCxTQUFJLFNBQVMsRUFBYjtBQUFBLFNBQ0ksVUFBVSxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsRUFBdUIsQ0FBdkIsRUFBMEIsTUFBMUIsQ0FEZDs7QUFHQSxTQUFJLFNBQUosRUFBZTtBQUNiLGFBQU8sS0FBSyxRQUFMLEVBQVA7QUFDQSxhQUFPLFFBQVEsSUFBZjtBQUNEOztBQUVELFNBQUksTUFBSixFQUFZO0FBQ1YsY0FBUSxNQUFSLEdBQWlCLEtBQUssU0FBTCxDQUFlLE1BQWYsQ0FBakI7QUFDRDtBQUNELGFBQVEsT0FBUixHQUFrQixTQUFsQjtBQUNBLGFBQVEsUUFBUixHQUFtQixVQUFuQjtBQUNBLGFBQVEsVUFBUixHQUFxQixzQkFBckI7O0FBRUEsU0FBSSxDQUFDLFNBQUwsRUFBZ0I7QUFDZCxhQUFPLE9BQVAsQ0FBZSxLQUFLLFVBQUwsQ0FBZ0IsVUFBaEIsRUFBNEIsSUFBNUIsRUFBa0MsU0FBbEMsQ0FBZjtBQUNELE1BRkQsTUFFTztBQUNMLGFBQU8sT0FBUCxDQUFlLElBQWY7QUFDRDs7QUFFRCxTQUFJLEtBQUssT0FBTCxDQUFhLE1BQWpCLEVBQXlCO0FBQ3ZCLGNBQVEsTUFBUixHQUFpQixRQUFqQjtBQUNEO0FBQ0QsZUFBVSxLQUFLLGFBQUwsQ0FBbUIsT0FBbkIsQ0FBVjtBQUNBLFlBQU8sSUFBUCxDQUFZLE9BQVo7O0FBRUEsVUFBSyxJQUFMLENBQVUsS0FBSyxNQUFMLENBQVksWUFBWixDQUF5Qix5QkFBekIsRUFBb0QsRUFBcEQsRUFBd0QsTUFBeEQsQ0FBVjtBQUNELEtBN3JCNEI7O0FBK3JCN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWMsU0FBUyxZQUFULENBQXNCLEdBQXRCLEVBQTJCO0FBQ3ZDLFNBQUksUUFBUSxLQUFLLFFBQUwsRUFBWjtBQUFBLFNBQ0ksVUFBVSxTQURkO0FBQUEsU0FFSSxPQUFPLFNBRlg7QUFBQSxTQUdJLEtBQUssU0FIVDs7QUFLQSxTQUFJLEtBQUssUUFBVCxFQUFtQjtBQUNqQixXQUFLLEtBQUssUUFBTCxFQUFMO0FBQ0Q7QUFDRCxTQUFJLEtBQUssWUFBVCxFQUF1QjtBQUNyQixhQUFPLEtBQUssUUFBTCxFQUFQO0FBQ0EsZ0JBQVUsS0FBSyxRQUFMLEVBQVY7QUFDRDs7QUFFRCxTQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLFNBQUksT0FBSixFQUFhO0FBQ1gsV0FBSyxRQUFMLENBQWMsR0FBZCxJQUFxQixPQUFyQjtBQUNEO0FBQ0QsU0FBSSxJQUFKLEVBQVU7QUFDUixXQUFLLEtBQUwsQ0FBVyxHQUFYLElBQWtCLElBQWxCO0FBQ0Q7QUFDRCxTQUFJLEVBQUosRUFBUTtBQUNOLFdBQUssR0FBTCxDQUFTLEdBQVQsSUFBZ0IsRUFBaEI7QUFDRDtBQUNELFVBQUssTUFBTCxDQUFZLEdBQVosSUFBbUIsS0FBbkI7QUFDRCxLQTl0QjRCOztBQWd1QjdCLFlBQVEsU0FBUyxNQUFULENBQWdCLElBQWhCLEVBQXNCLElBQXRCLEVBQTRCLEtBQTVCLEVBQW1DO0FBQ3pDLFNBQUksU0FBUyxZQUFiLEVBQTJCO0FBQ3pCLFdBQUssZ0JBQUwsQ0FBc0IsaUJBQWlCLEtBQUssQ0FBTCxDQUFqQixHQUEyQixTQUEzQixHQUF1QyxLQUFLLENBQUwsQ0FBdkMsR0FBaUQsR0FBakQsSUFBd0QsUUFBUSxRQUFRLEtBQUssU0FBTCxDQUFlLE1BQU0sS0FBckIsQ0FBaEIsR0FBOEMsRUFBdEcsQ0FBdEI7QUFDRCxNQUZELE1BRU8sSUFBSSxTQUFTLGdCQUFiLEVBQStCO0FBQ3BDLFdBQUssVUFBTCxDQUFnQixJQUFoQjtBQUNELE1BRk0sTUFFQSxJQUFJLFNBQVMsZUFBYixFQUE4QjtBQUNuQyxXQUFLLGdCQUFMLENBQXNCLE1BQXRCO0FBQ0QsTUFGTSxNQUVBO0FBQ0wsV0FBSyxnQkFBTCxDQUFzQixNQUF0QjtBQUNEO0FBQ0YsS0ExdUI0Qjs7QUE0dUI3Qjs7QUFFQSxjQUFVLGtCQTl1Qm1COztBQWd2QjdCLHFCQUFpQixTQUFTLGVBQVQsQ0FBeUIsV0FBekIsRUFBc0MsT0FBdEMsRUFBK0M7QUFDOUQsU0FBSSxXQUFXLFlBQVksUUFBM0I7QUFBQSxTQUNJLFFBQVEsU0FEWjtBQUFBLFNBRUksV0FBVyxTQUZmOztBQUlBLFVBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxJQUFJLFNBQVMsTUFBN0IsRUFBcUMsSUFBSSxDQUF6QyxFQUE0QyxHQUE1QyxFQUFpRDtBQUMvQyxjQUFRLFNBQVMsQ0FBVCxDQUFSO0FBQ0EsaUJBQVcsSUFBSSxLQUFLLFFBQVQsRUFBWCxDQUYrQyxDQUVmOztBQUVoQyxVQUFJLFdBQVcsS0FBSyxvQkFBTCxDQUEwQixLQUExQixDQUFmOztBQUVBLFVBQUksWUFBWSxJQUFoQixFQUFzQjtBQUNwQixZQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLElBQXRCLENBQTJCLEVBQTNCLEVBRG9CLENBQ1k7QUFDaEMsV0FBSSxRQUFRLEtBQUssT0FBTCxDQUFhLFFBQWIsQ0FBc0IsTUFBbEM7QUFDQSxhQUFNLEtBQU4sR0FBYyxLQUFkO0FBQ0EsYUFBTSxJQUFOLEdBQWEsWUFBWSxLQUF6QjtBQUNBLFlBQUssT0FBTCxDQUFhLFFBQWIsQ0FBc0IsS0FBdEIsSUFBK0IsU0FBUyxPQUFULENBQWlCLEtBQWpCLEVBQXdCLE9BQXhCLEVBQWlDLEtBQUssT0FBdEMsRUFBK0MsQ0FBQyxLQUFLLFVBQXJELENBQS9CO0FBQ0EsWUFBSyxPQUFMLENBQWEsVUFBYixDQUF3QixLQUF4QixJQUFpQyxTQUFTLFVBQTFDO0FBQ0EsWUFBSyxPQUFMLENBQWEsWUFBYixDQUEwQixLQUExQixJQUFtQyxLQUFuQzs7QUFFQSxZQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLElBQWtCLFNBQVMsU0FBNUM7QUFDQSxZQUFLLGNBQUwsR0FBc0IsS0FBSyxjQUFMLElBQXVCLFNBQVMsY0FBdEQ7QUFDQSxhQUFNLFNBQU4sR0FBa0IsS0FBSyxTQUF2QjtBQUNBLGFBQU0sY0FBTixHQUF1QixLQUFLLGNBQTVCO0FBQ0QsT0FiRCxNQWFPO0FBQ0wsYUFBTSxLQUFOLEdBQWMsU0FBUyxLQUF2QjtBQUNBLGFBQU0sSUFBTixHQUFhLFlBQVksU0FBUyxLQUFsQzs7QUFFQSxZQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLElBQWtCLFNBQVMsU0FBNUM7QUFDQSxZQUFLLGNBQUwsR0FBc0IsS0FBSyxjQUFMLElBQXVCLFNBQVMsY0FBdEQ7QUFDRDtBQUNGO0FBQ0YsS0FoeEI0QjtBQWl4QjdCLDBCQUFzQixTQUFTLG9CQUFULENBQThCLEtBQTlCLEVBQXFDO0FBQ3pELFVBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxNQUFNLEtBQUssT0FBTCxDQUFhLFlBQWIsQ0FBMEIsTUFBaEQsRUFBd0QsSUFBSSxHQUE1RCxFQUFpRSxHQUFqRSxFQUFzRTtBQUNwRSxVQUFJLGNBQWMsS0FBSyxPQUFMLENBQWEsWUFBYixDQUEwQixDQUExQixDQUFsQjtBQUNBLFVBQUksZUFBZSxZQUFZLE1BQVosQ0FBbUIsS0FBbkIsQ0FBbkIsRUFBOEM7QUFDNUMsY0FBTyxXQUFQO0FBQ0Q7QUFDRjtBQUNGLEtBeHhCNEI7O0FBMHhCN0IsdUJBQW1CLFNBQVMsaUJBQVQsQ0FBMkIsSUFBM0IsRUFBaUM7QUFDbEQsU0FBSSxRQUFRLEtBQUssV0FBTCxDQUFpQixRQUFqQixDQUEwQixJQUExQixDQUFaO0FBQUEsU0FDSSxnQkFBZ0IsQ0FBQyxNQUFNLEtBQVAsRUFBYyxNQUFkLEVBQXNCLE1BQU0sV0FBNUIsQ0FEcEI7O0FBR0EsU0FBSSxLQUFLLGNBQUwsSUFBdUIsS0FBSyxTQUFoQyxFQUEyQztBQUN6QyxvQkFBYyxJQUFkLENBQW1CLGFBQW5CO0FBQ0Q7QUFDRCxTQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNsQixvQkFBYyxJQUFkLENBQW1CLFFBQW5CO0FBQ0Q7O0FBRUQsWUFBTyx1QkFBdUIsY0FBYyxJQUFkLENBQW1CLElBQW5CLENBQXZCLEdBQWtELEdBQXpEO0FBQ0QsS0F0eUI0Qjs7QUF3eUI3QixpQkFBYSxTQUFTLFdBQVQsQ0FBcUIsSUFBckIsRUFBMkI7QUFDdEMsU0FBSSxDQUFDLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBTCxFQUEyQjtBQUN6QixXQUFLLFNBQUwsQ0FBZSxJQUFmLElBQXVCLElBQXZCO0FBQ0EsV0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixJQUFwQixDQUF5QixJQUF6QjtBQUNEO0FBQ0YsS0E3eUI0Qjs7QUEreUI3QixVQUFNLFNBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0I7QUFDeEIsU0FBSSxFQUFFLGdCQUFnQixPQUFsQixDQUFKLEVBQWdDO0FBQzlCLGFBQU8sS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixJQUFqQixDQUFQO0FBQ0Q7O0FBRUQsVUFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCO0FBQ0EsWUFBTyxJQUFQO0FBQ0QsS0F0ekI0Qjs7QUF3ekI3QixzQkFBa0IsU0FBUyxnQkFBVCxDQUEwQixJQUExQixFQUFnQztBQUNoRCxVQUFLLElBQUwsQ0FBVSxJQUFJLE9BQUosQ0FBWSxJQUFaLENBQVY7QUFDRCxLQTF6QjRCOztBQTR6QjdCLGdCQUFZLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QjtBQUN0QyxTQUFJLEtBQUssY0FBVCxFQUF5QjtBQUN2QixXQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLEtBQUssY0FBTCxDQUFvQixLQUFLLE1BQUwsQ0FBWSxZQUFaLENBQXlCLEtBQUssY0FBOUIsQ0FBcEIsRUFBbUUsS0FBSyxlQUF4RSxDQUFqQjtBQUNBLFdBQUssY0FBTCxHQUFzQixTQUF0QjtBQUNEOztBQUVELFNBQUksTUFBSixFQUFZO0FBQ1YsV0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixNQUFqQjtBQUNEO0FBQ0YsS0FyMEI0Qjs7QUF1MEI3QixrQkFBYyxTQUFTLFlBQVQsQ0FBc0IsUUFBdEIsRUFBZ0M7QUFDNUMsU0FBSSxTQUFTLENBQUMsR0FBRCxDQUFiO0FBQUEsU0FDSSxRQUFRLFNBRFo7QUFBQSxTQUVJLGVBQWUsU0FGbkI7QUFBQSxTQUdJLGNBQWMsU0FIbEI7O0FBS0E7QUFDQSxTQUFJLENBQUMsS0FBSyxRQUFMLEVBQUwsRUFBc0I7QUFDcEIsWUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLDRCQUEzQixDQUFOO0FBQ0Q7O0FBRUQ7QUFDQSxTQUFJLE1BQU0sS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFWOztBQUVBLFNBQUksZUFBZSxPQUFuQixFQUE0QjtBQUMxQjtBQUNBLGNBQVEsQ0FBQyxJQUFJLEtBQUwsQ0FBUjtBQUNBLGVBQVMsQ0FBQyxHQUFELEVBQU0sS0FBTixDQUFUO0FBQ0Esb0JBQWMsSUFBZDtBQUNELE1BTEQsTUFLTztBQUNMO0FBQ0EscUJBQWUsSUFBZjtBQUNBLFVBQUksUUFBUSxLQUFLLFNBQUwsRUFBWjs7QUFFQSxlQUFTLENBQUMsSUFBRCxFQUFPLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBUCxFQUF5QixLQUF6QixFQUFnQyxHQUFoQyxFQUFxQyxHQUFyQyxDQUFUO0FBQ0EsY0FBUSxLQUFLLFFBQUwsRUFBUjtBQUNEOztBQUVELFNBQUksT0FBTyxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLEtBQXBCLENBQVg7O0FBRUEsU0FBSSxDQUFDLFdBQUwsRUFBa0I7QUFDaEIsV0FBSyxRQUFMO0FBQ0Q7QUFDRCxTQUFJLFlBQUosRUFBa0I7QUFDaEIsV0FBSyxTQUFMO0FBQ0Q7QUFDRCxVQUFLLElBQUwsQ0FBVSxPQUFPLE1BQVAsQ0FBYyxJQUFkLEVBQW9CLEdBQXBCLENBQVY7QUFDRCxLQTUyQjRCOztBQTgyQjdCLGVBQVcsU0FBUyxTQUFULEdBQXFCO0FBQzlCLFVBQUssU0FBTDtBQUNBLFNBQUksS0FBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxDQUFlLE1BQXBDLEVBQTRDO0FBQzFDLFdBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsVUFBVSxLQUFLLFNBQW5DO0FBQ0Q7QUFDRCxZQUFPLEtBQUssWUFBTCxFQUFQO0FBQ0QsS0FwM0I0QjtBQXEzQjdCLGtCQUFjLFNBQVMsWUFBVCxHQUF3QjtBQUNwQyxZQUFPLFVBQVUsS0FBSyxTQUF0QjtBQUNELEtBdjNCNEI7QUF3M0I3QixpQkFBYSxTQUFTLFdBQVQsR0FBdUI7QUFDbEMsU0FBSSxjQUFjLEtBQUssV0FBdkI7QUFDQSxVQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxVQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsTUFBTSxZQUFZLE1BQWxDLEVBQTBDLElBQUksR0FBOUMsRUFBbUQsR0FBbkQsRUFBd0Q7QUFDdEQsVUFBSSxRQUFRLFlBQVksQ0FBWixDQUFaO0FBQ0E7QUFDQSxVQUFJLGlCQUFpQixPQUFyQixFQUE4QjtBQUM1QixZQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsS0FBdkI7QUFDRCxPQUZELE1BRU87QUFDTCxXQUFJLFFBQVEsS0FBSyxTQUFMLEVBQVo7QUFDQSxZQUFLLFVBQUwsQ0FBZ0IsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsRUFBc0IsR0FBdEIsQ0FBaEI7QUFDQSxZQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsS0FBdkI7QUFDRDtBQUNGO0FBQ0YsS0F0NEI0QjtBQXU0QjdCLGNBQVUsU0FBUyxRQUFULEdBQW9CO0FBQzVCLFlBQU8sS0FBSyxXQUFMLENBQWlCLE1BQXhCO0FBQ0QsS0F6NEI0Qjs7QUEyNEI3QixjQUFVLFNBQVMsUUFBVCxDQUFrQixPQUFsQixFQUEyQjtBQUNuQyxTQUFJLFNBQVMsS0FBSyxRQUFMLEVBQWI7QUFBQSxTQUNJLE9BQU8sQ0FBQyxTQUFTLEtBQUssV0FBZCxHQUE0QixLQUFLLFlBQWxDLEVBQWdELEdBQWhELEVBRFg7O0FBR0EsU0FBSSxDQUFDLE9BQUQsSUFBWSxnQkFBZ0IsT0FBaEMsRUFBeUM7QUFDdkMsYUFBTyxLQUFLLEtBQVo7QUFDRCxNQUZELE1BRU87QUFDTCxVQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1g7QUFDQSxXQUFJLENBQUMsS0FBSyxTQUFWLEVBQXFCO0FBQ25CLGNBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQixtQkFBM0IsQ0FBTjtBQUNEO0FBQ0QsWUFBSyxTQUFMO0FBQ0Q7QUFDRCxhQUFPLElBQVA7QUFDRDtBQUNGLEtBMzVCNEI7O0FBNjVCN0IsY0FBVSxTQUFTLFFBQVQsR0FBb0I7QUFDNUIsU0FBSSxRQUFRLEtBQUssUUFBTCxLQUFrQixLQUFLLFdBQXZCLEdBQXFDLEtBQUssWUFBdEQ7QUFBQSxTQUNJLE9BQU8sTUFBTSxNQUFNLE1BQU4sR0FBZSxDQUFyQixDQURYOztBQUdBO0FBQ0EsU0FBSSxnQkFBZ0IsT0FBcEIsRUFBNkI7QUFDM0IsYUFBTyxLQUFLLEtBQVo7QUFDRCxNQUZELE1BRU87QUFDTCxhQUFPLElBQVA7QUFDRDtBQUNGLEtBdjZCNEI7O0FBeTZCN0IsaUJBQWEsU0FBUyxXQUFULENBQXFCLE9BQXJCLEVBQThCO0FBQ3pDLFNBQUksS0FBSyxTQUFMLElBQWtCLE9BQXRCLEVBQStCO0FBQzdCLGFBQU8sWUFBWSxPQUFaLEdBQXNCLEdBQTdCO0FBQ0QsTUFGRCxNQUVPO0FBQ0wsYUFBTyxVQUFVLE9BQWpCO0FBQ0Q7QUFDRixLQS82QjRCOztBQWk3QjdCLGtCQUFjLFNBQVMsWUFBVCxDQUFzQixHQUF0QixFQUEyQjtBQUN2QyxZQUFPLEtBQUssTUFBTCxDQUFZLFlBQVosQ0FBeUIsR0FBekIsQ0FBUDtBQUNELEtBbjdCNEI7O0FBcTdCN0IsbUJBQWUsU0FBUyxhQUFULENBQXVCLEdBQXZCLEVBQTRCO0FBQ3pDLFlBQU8sS0FBSyxNQUFMLENBQVksYUFBWixDQUEwQixHQUExQixDQUFQO0FBQ0QsS0F2N0I0Qjs7QUF5N0I3QixlQUFXLFNBQVMsU0FBVCxDQUFtQixJQUFuQixFQUF5QjtBQUNsQyxTQUFJLE1BQU0sS0FBSyxPQUFMLENBQWEsSUFBYixDQUFWO0FBQ0EsU0FBSSxHQUFKLEVBQVM7QUFDUCxVQUFJLGNBQUo7QUFDQSxhQUFPLEdBQVA7QUFDRDs7QUFFRCxXQUFNLEtBQUssT0FBTCxDQUFhLElBQWIsSUFBcUIsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixJQUFqQixDQUEzQjtBQUNBLFNBQUksU0FBSixHQUFnQixJQUFoQjtBQUNBLFNBQUksY0FBSixHQUFxQixDQUFyQjs7QUFFQSxZQUFPLEdBQVA7QUFDRCxLQXI4QjRCOztBQXU4QjdCLGlCQUFhLFNBQVMsV0FBVCxDQUFxQixTQUFyQixFQUFnQyxJQUFoQyxFQUFzQyxXQUF0QyxFQUFtRDtBQUM5RCxTQUFJLFNBQVMsRUFBYjtBQUFBLFNBQ0ksYUFBYSxLQUFLLGVBQUwsQ0FBcUIsSUFBckIsRUFBMkIsU0FBM0IsRUFBc0MsTUFBdEMsRUFBOEMsV0FBOUMsQ0FEakI7QUFFQSxTQUFJLGNBQWMsS0FBSyxVQUFMLENBQWdCLFNBQWhCLEVBQTJCLElBQTNCLEVBQWlDLFFBQWpDLENBQWxCO0FBQUEsU0FDSSxjQUFjLEtBQUssU0FBTCxDQUFlLEtBQUssV0FBTCxDQUFpQixDQUFqQixJQUFzQixhQUF0QixHQUFzQyxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBdEMsR0FBNEQsa0NBQTNFLENBRGxCOztBQUdBLFlBQU87QUFDTCxjQUFRLE1BREg7QUFFTCxrQkFBWSxVQUZQO0FBR0wsWUFBTSxXQUhEO0FBSUwsa0JBQVksQ0FBQyxXQUFELEVBQWMsTUFBZCxDQUFxQixNQUFyQjtBQUpQLE1BQVA7QUFNRCxLQW45QjRCOztBQXE5QjdCLGlCQUFhLFNBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixTQUE3QixFQUF3QyxNQUF4QyxFQUFnRDtBQUMzRCxTQUFJLFVBQVUsRUFBZDtBQUFBLFNBQ0ksV0FBVyxFQURmO0FBQUEsU0FFSSxRQUFRLEVBRlo7QUFBQSxTQUdJLE1BQU0sRUFIVjtBQUFBLFNBSUksYUFBYSxDQUFDLE1BSmxCO0FBQUEsU0FLSSxRQUFRLFNBTFo7O0FBT0EsU0FBSSxVQUFKLEVBQWdCO0FBQ2QsZUFBUyxFQUFUO0FBQ0Q7O0FBRUQsYUFBUSxJQUFSLEdBQWUsS0FBSyxZQUFMLENBQWtCLE1BQWxCLENBQWY7QUFDQSxhQUFRLElBQVIsR0FBZSxLQUFLLFFBQUwsRUFBZjs7QUFFQSxTQUFJLEtBQUssUUFBVCxFQUFtQjtBQUNqQixjQUFRLE9BQVIsR0FBa0IsS0FBSyxRQUFMLEVBQWxCO0FBQ0Q7QUFDRCxTQUFJLEtBQUssWUFBVCxFQUF1QjtBQUNyQixjQUFRLFNBQVIsR0FBb0IsS0FBSyxRQUFMLEVBQXBCO0FBQ0EsY0FBUSxZQUFSLEdBQXVCLEtBQUssUUFBTCxFQUF2QjtBQUNEOztBQUVELFNBQUksVUFBVSxLQUFLLFFBQUwsRUFBZDtBQUFBLFNBQ0ksVUFBVSxLQUFLLFFBQUwsRUFEZDs7QUFHQTtBQUNBO0FBQ0EsU0FBSSxXQUFXLE9BQWYsRUFBd0I7QUFDdEIsY0FBUSxFQUFSLEdBQWEsV0FBVyxnQkFBeEI7QUFDQSxjQUFRLE9BQVIsR0FBa0IsV0FBVyxnQkFBN0I7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsU0FBSSxJQUFJLFNBQVI7QUFDQSxZQUFPLEdBQVAsRUFBWTtBQUNWLGNBQVEsS0FBSyxRQUFMLEVBQVI7QUFDQSxhQUFPLENBQVAsSUFBWSxLQUFaOztBQUVBLFVBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2pCLFdBQUksQ0FBSixJQUFTLEtBQUssUUFBTCxFQUFUO0FBQ0Q7QUFDRCxVQUFJLEtBQUssWUFBVCxFQUF1QjtBQUNyQixhQUFNLENBQU4sSUFBVyxLQUFLLFFBQUwsRUFBWDtBQUNBLGdCQUFTLENBQVQsSUFBYyxLQUFLLFFBQUwsRUFBZDtBQUNEO0FBQ0Y7O0FBRUQsU0FBSSxVQUFKLEVBQWdCO0FBQ2QsY0FBUSxJQUFSLEdBQWUsS0FBSyxNQUFMLENBQVksYUFBWixDQUEwQixNQUExQixDQUFmO0FBQ0Q7O0FBRUQsU0FBSSxLQUFLLFFBQVQsRUFBbUI7QUFDakIsY0FBUSxHQUFSLEdBQWMsS0FBSyxNQUFMLENBQVksYUFBWixDQUEwQixHQUExQixDQUFkO0FBQ0Q7QUFDRCxTQUFJLEtBQUssWUFBVCxFQUF1QjtBQUNyQixjQUFRLEtBQVIsR0FBZ0IsS0FBSyxNQUFMLENBQVksYUFBWixDQUEwQixLQUExQixDQUFoQjtBQUNBLGNBQVEsUUFBUixHQUFtQixLQUFLLE1BQUwsQ0FBWSxhQUFaLENBQTBCLFFBQTFCLENBQW5CO0FBQ0Q7O0FBRUQsU0FBSSxLQUFLLE9BQUwsQ0FBYSxJQUFqQixFQUF1QjtBQUNyQixjQUFRLElBQVIsR0FBZSxNQUFmO0FBQ0Q7QUFDRCxTQUFJLEtBQUssY0FBVCxFQUF5QjtBQUN2QixjQUFRLFdBQVIsR0FBc0IsYUFBdEI7QUFDRDtBQUNELFlBQU8sT0FBUDtBQUNELEtBemhDNEI7O0FBMmhDN0IscUJBQWlCLFNBQVMsZUFBVCxDQUF5QixNQUF6QixFQUFpQyxTQUFqQyxFQUE0QyxNQUE1QyxFQUFvRCxXQUFwRCxFQUFpRTtBQUNoRixTQUFJLFVBQVUsS0FBSyxXQUFMLENBQWlCLE1BQWpCLEVBQXlCLFNBQXpCLEVBQW9DLE1BQXBDLENBQWQ7QUFDQSxlQUFVLEtBQUssYUFBTCxDQUFtQixPQUFuQixDQUFWO0FBQ0EsU0FBSSxXQUFKLEVBQWlCO0FBQ2YsV0FBSyxXQUFMLENBQWlCLFNBQWpCO0FBQ0EsYUFBTyxJQUFQLENBQVksU0FBWjtBQUNBLGFBQU8sQ0FBQyxVQUFELEVBQWEsT0FBYixDQUFQO0FBQ0QsTUFKRCxNQUlPLElBQUksTUFBSixFQUFZO0FBQ2pCLGFBQU8sSUFBUCxDQUFZLE9BQVo7QUFDQSxhQUFPLEVBQVA7QUFDRCxNQUhNLE1BR0E7QUFDTCxhQUFPLE9BQVA7QUFDRDtBQUNGO0FBeGlDNEIsSUFBL0I7O0FBMmlDQSxJQUFDLFlBQVk7QUFDWCxRQUFJLGdCQUFnQixDQUFDLHVCQUF1QiwyQkFBdkIsR0FBcUQseUJBQXJELEdBQWlGLDhCQUFqRixHQUFrSCxtQkFBbEgsR0FBd0ksZ0JBQXhJLEdBQTJKLHVCQUEzSixHQUFxTCwwQkFBckwsR0FBa04sa0NBQWxOLEdBQXVQLDBCQUF2UCxHQUFvUixpQ0FBcFIsR0FBd1QsNkJBQXhULEdBQXdWLCtCQUF4VixHQUEwWCx5Q0FBMVgsR0FBc2EsdUNBQXRhLEdBQWdkLGtCQUFqZCxFQUFxZSxLQUFyZSxDQUEyZSxHQUEzZSxDQUFwQjs7QUFFQSxRQUFJLGdCQUFnQixtQkFBbUIsY0FBbkIsR0FBb0MsRUFBeEQ7O0FBRUEsU0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLElBQUksY0FBYyxNQUFsQyxFQUEwQyxJQUFJLENBQTlDLEVBQWlELEdBQWpELEVBQXNEO0FBQ3BELG1CQUFjLGNBQWMsQ0FBZCxDQUFkLElBQWtDLElBQWxDO0FBQ0Q7QUFDRixJQVJEOztBQVVBLHNCQUFtQiw2QkFBbkIsR0FBbUQsVUFBVSxJQUFWLEVBQWdCO0FBQ2pFLFdBQU8sQ0FBQyxtQkFBbUIsY0FBbkIsQ0FBa0MsSUFBbEMsQ0FBRCxJQUE0Qyw2QkFBNkIsSUFBN0IsQ0FBa0MsSUFBbEMsQ0FBbkQ7QUFDRCxJQUZEOztBQUlBLFlBQVMsWUFBVCxDQUFzQixlQUF0QixFQUF1QyxRQUF2QyxFQUFpRCxLQUFqRCxFQUF3RCxJQUF4RCxFQUE4RDtBQUM1RCxRQUFJLFFBQVEsU0FBUyxRQUFULEVBQVo7QUFBQSxRQUNJLElBQUksQ0FEUjtBQUFBLFFBRUksTUFBTSxNQUFNLE1BRmhCO0FBR0EsUUFBSSxlQUFKLEVBQXFCO0FBQ25CO0FBQ0Q7O0FBRUQsV0FBTyxJQUFJLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUI7QUFDbkIsYUFBUSxTQUFTLFVBQVQsQ0FBb0IsS0FBcEIsRUFBMkIsTUFBTSxDQUFOLENBQTNCLEVBQXFDLElBQXJDLENBQVI7QUFDRDs7QUFFRCxRQUFJLGVBQUosRUFBcUI7QUFDbkIsWUFBTyxDQUFDLFNBQVMsU0FBVCxDQUFtQixrQkFBbkIsQ0FBRCxFQUF5QyxHQUF6QyxFQUE4QyxLQUE5QyxFQUFxRCxJQUFyRCxFQUEyRCxTQUFTLFlBQVQsQ0FBc0IsTUFBTSxDQUFOLENBQXRCLENBQTNELEVBQTRGLEdBQTVGLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxZQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVELFdBQVEsU0FBUixJQUFxQixrQkFBckI7QUFDQSxVQUFPLE9BQVAsR0FBaUIsUUFBUSxTQUFSLENBQWpCOztBQUVEO0FBQU8sR0E1K0lHO0FBNitJVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7QUFDQTs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLE9BQUksYUFBYSxTQUFqQjs7QUFFQSxPQUFJO0FBQ0Y7QUFDQSxRQUFJLEtBQUosRUFBVztBQUNUO0FBQ0E7QUFDQSxTQUFJLFlBQVksUUFBUSxZQUFSLENBQWhCO0FBQ0Esa0JBQWEsVUFBVSxVQUF2QjtBQUNEO0FBQ0YsSUFSRCxDQVFFLE9BQU8sR0FBUCxFQUFZLENBQUU7QUFDaEI7O0FBRUE7QUFDQSxPQUFJLENBQUMsVUFBTCxFQUFpQjtBQUNmLGlCQUFhLG9CQUFVLElBQVYsRUFBZ0IsTUFBaEIsRUFBd0IsT0FBeEIsRUFBaUMsTUFBakMsRUFBeUM7QUFDcEQsVUFBSyxHQUFMLEdBQVcsRUFBWDtBQUNBLFNBQUksTUFBSixFQUFZO0FBQ1YsV0FBSyxHQUFMLENBQVMsTUFBVDtBQUNEO0FBQ0YsS0FMRDtBQU1BO0FBQ0EsZUFBVyxTQUFYLEdBQXVCO0FBQ3JCLFVBQUssU0FBUyxHQUFULENBQWEsTUFBYixFQUFxQjtBQUN4QixVQUFJLE9BQU8sT0FBUCxDQUFlLE1BQWYsQ0FBSixFQUE0QjtBQUMxQixnQkFBUyxPQUFPLElBQVAsQ0FBWSxFQUFaLENBQVQ7QUFDRDtBQUNELFdBQUssR0FBTCxJQUFZLE1BQVo7QUFDRCxNQU5vQjtBQU9yQixjQUFTLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QjtBQUNoQyxVQUFJLE9BQU8sT0FBUCxDQUFlLE1BQWYsQ0FBSixFQUE0QjtBQUMxQixnQkFBUyxPQUFPLElBQVAsQ0FBWSxFQUFaLENBQVQ7QUFDRDtBQUNELFdBQUssR0FBTCxHQUFXLFNBQVMsS0FBSyxHQUF6QjtBQUNELE1BWm9CO0FBYXJCLDRCQUF1QixTQUFTLHFCQUFULEdBQWlDO0FBQ3RELGFBQU8sRUFBRSxNQUFNLEtBQUssUUFBTCxFQUFSLEVBQVA7QUFDRCxNQWZvQjtBQWdCckIsZUFBVSxTQUFTLFFBQVQsR0FBb0I7QUFDNUIsYUFBTyxLQUFLLEdBQVo7QUFDRDtBQWxCb0IsS0FBdkI7QUFvQkQ7O0FBRUQsWUFBUyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLE9BQTFCLEVBQW1DLEdBQW5DLEVBQXdDO0FBQ3RDLFFBQUksT0FBTyxPQUFQLENBQWUsS0FBZixDQUFKLEVBQTJCO0FBQ3pCLFNBQUksTUFBTSxFQUFWOztBQUVBLFVBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxNQUFNLE1BQU0sTUFBNUIsRUFBb0MsSUFBSSxHQUF4QyxFQUE2QyxHQUE3QyxFQUFrRDtBQUNoRCxVQUFJLElBQUosQ0FBUyxRQUFRLElBQVIsQ0FBYSxNQUFNLENBQU4sQ0FBYixFQUF1QixHQUF2QixDQUFUO0FBQ0Q7QUFDRCxZQUFPLEdBQVA7QUFDRCxLQVBELE1BT08sSUFBSSxPQUFPLEtBQVAsS0FBaUIsU0FBakIsSUFBOEIsT0FBTyxLQUFQLEtBQWlCLFFBQW5ELEVBQTZEO0FBQ2xFO0FBQ0EsWUFBTyxRQUFRLEVBQWY7QUFDRDtBQUNELFdBQU8sS0FBUDtBQUNEOztBQUVELFlBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQjtBQUN4QixTQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EsU0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNEOztBQUVELFdBQVEsU0FBUixHQUFvQjtBQUNsQixhQUFTLFNBQVMsT0FBVCxHQUFtQjtBQUMxQixZQUFPLENBQUMsS0FBSyxNQUFMLENBQVksTUFBcEI7QUFDRCxLQUhpQjtBQUlsQixhQUFTLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixHQUF6QixFQUE4QjtBQUNyQyxVQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLEtBQUssSUFBTCxDQUFVLE1BQVYsRUFBa0IsR0FBbEIsQ0FBcEI7QUFDRCxLQU5pQjtBQU9sQixVQUFNLFNBQVMsSUFBVCxDQUFjLE1BQWQsRUFBc0IsR0FBdEIsRUFBMkI7QUFDL0IsVUFBSyxNQUFMLENBQVksSUFBWixDQUFpQixLQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLEdBQWxCLENBQWpCO0FBQ0QsS0FUaUI7O0FBV2xCLFdBQU8sU0FBUyxLQUFULEdBQWlCO0FBQ3RCLFNBQUksU0FBUyxLQUFLLEtBQUwsRUFBYjtBQUNBLFVBQUssSUFBTCxDQUFVLFVBQVUsSUFBVixFQUFnQjtBQUN4QixhQUFPLEdBQVAsQ0FBVyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixDQUFYO0FBQ0QsTUFGRDtBQUdBLFlBQU8sTUFBUDtBQUNELEtBakJpQjs7QUFtQmxCLFVBQU0sU0FBUyxJQUFULENBQWMsSUFBZCxFQUFvQjtBQUN4QixVQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsTUFBTSxLQUFLLE1BQUwsQ0FBWSxNQUFsQyxFQUEwQyxJQUFJLEdBQTlDLEVBQW1ELEdBQW5ELEVBQXdEO0FBQ3RELFdBQUssS0FBSyxNQUFMLENBQVksQ0FBWixDQUFMO0FBQ0Q7QUFDRixLQXZCaUI7O0FBeUJsQixXQUFPLFNBQVMsS0FBVCxHQUFpQjtBQUN0QixTQUFJLE1BQU0sS0FBSyxlQUFMLElBQXdCLEVBQUUsT0FBTyxFQUFULEVBQWxDO0FBQ0EsWUFBTyxJQUFJLFVBQUosQ0FBZSxJQUFJLEtBQUosQ0FBVSxJQUF6QixFQUErQixJQUFJLEtBQUosQ0FBVSxNQUF6QyxFQUFpRCxLQUFLLE9BQXRELENBQVA7QUFDRCxLQTVCaUI7QUE2QmxCLFVBQU0sU0FBUyxJQUFULENBQWMsS0FBZCxFQUFxQjtBQUN6QixTQUFJLE1BQU0sVUFBVSxNQUFWLElBQW9CLENBQXBCLElBQXlCLFVBQVUsQ0FBVixNQUFpQixTQUExQyxHQUFzRCxLQUFLLGVBQUwsSUFBd0IsRUFBRSxPQUFPLEVBQVQsRUFBOUUsR0FBOEYsVUFBVSxDQUFWLENBQXhHOztBQUVBLFNBQUksaUJBQWlCLFVBQXJCLEVBQWlDO0FBQy9CLGFBQU8sS0FBUDtBQUNEOztBQUVELGFBQVEsVUFBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCLEdBQXZCLENBQVI7O0FBRUEsWUFBTyxJQUFJLFVBQUosQ0FBZSxJQUFJLEtBQUosQ0FBVSxJQUF6QixFQUErQixJQUFJLEtBQUosQ0FBVSxNQUF6QyxFQUFpRCxLQUFLLE9BQXRELEVBQStELEtBQS9ELENBQVA7QUFDRCxLQXZDaUI7O0FBeUNsQixrQkFBYyxTQUFTLFlBQVQsQ0FBc0IsRUFBdEIsRUFBMEIsSUFBMUIsRUFBZ0MsTUFBaEMsRUFBd0M7QUFDcEQsY0FBUyxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBVDtBQUNBLFlBQU8sS0FBSyxJQUFMLENBQVUsQ0FBQyxFQUFELEVBQUssT0FBTyxNQUFNLElBQU4sR0FBYSxHQUFwQixHQUEwQixHQUEvQixFQUFvQyxNQUFwQyxFQUE0QyxHQUE1QyxDQUFWLENBQVA7QUFDRCxLQTVDaUI7O0FBOENsQixrQkFBYyxTQUFTLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkI7QUFDdkMsWUFBTyxNQUFNLENBQUMsTUFBTSxFQUFQLEVBQVcsT0FBWCxDQUFtQixLQUFuQixFQUEwQixNQUExQixFQUFrQyxPQUFsQyxDQUEwQyxJQUExQyxFQUFnRCxLQUFoRCxFQUF1RCxPQUF2RCxDQUErRCxLQUEvRCxFQUFzRSxLQUF0RSxFQUE2RSxPQUE3RSxDQUFxRixLQUFyRixFQUE0RixLQUE1RixFQUFtRyxPQUFuRyxDQUEyRyxTQUEzRyxFQUFzSCxTQUF0SCxFQUFpSTtBQUFqSSxNQUNaLE9BRFksQ0FDSixTQURJLEVBQ08sU0FEUCxDQUFOLEdBQzBCLEdBRGpDO0FBRUQsS0FqRGlCOztBQW1EbEIsbUJBQWUsU0FBUyxhQUFULENBQXVCLEdBQXZCLEVBQTRCO0FBQ3pDLFNBQUksUUFBUSxFQUFaOztBQUVBLFVBQUssSUFBSSxHQUFULElBQWdCLEdBQWhCLEVBQXFCO0FBQ25CLFVBQUksSUFBSSxjQUFKLENBQW1CLEdBQW5CLENBQUosRUFBNkI7QUFDM0IsV0FBSSxRQUFRLFVBQVUsSUFBSSxHQUFKLENBQVYsRUFBb0IsSUFBcEIsQ0FBWjtBQUNBLFdBQUksVUFBVSxXQUFkLEVBQTJCO0FBQ3pCLGNBQU0sSUFBTixDQUFXLENBQUMsS0FBSyxZQUFMLENBQWtCLEdBQWxCLENBQUQsRUFBeUIsR0FBekIsRUFBOEIsS0FBOUIsQ0FBWDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFJLE1BQU0sS0FBSyxZQUFMLENBQWtCLEtBQWxCLENBQVY7QUFDQSxTQUFJLE9BQUosQ0FBWSxHQUFaO0FBQ0EsU0FBSSxHQUFKLENBQVEsR0FBUjtBQUNBLFlBQU8sR0FBUDtBQUNELEtBbkVpQjs7QUFxRWxCLGtCQUFjLFNBQVMsWUFBVCxDQUFzQixPQUF0QixFQUErQjtBQUMzQyxTQUFJLE1BQU0sS0FBSyxLQUFMLEVBQVY7O0FBRUEsVUFBSyxJQUFJLElBQUksQ0FBUixFQUFXLE1BQU0sUUFBUSxNQUE5QixFQUFzQyxJQUFJLEdBQTFDLEVBQStDLEdBQS9DLEVBQW9EO0FBQ2xELFVBQUksQ0FBSixFQUFPO0FBQ0wsV0FBSSxHQUFKLENBQVEsR0FBUjtBQUNEOztBQUVELFVBQUksR0FBSixDQUFRLFVBQVUsUUFBUSxDQUFSLENBQVYsRUFBc0IsSUFBdEIsQ0FBUjtBQUNEOztBQUVELFlBQU8sR0FBUDtBQUNELEtBakZpQjs7QUFtRmxCLG1CQUFlLFNBQVMsYUFBVCxDQUF1QixPQUF2QixFQUFnQztBQUM3QyxTQUFJLE1BQU0sS0FBSyxZQUFMLENBQWtCLE9BQWxCLENBQVY7QUFDQSxTQUFJLE9BQUosQ0FBWSxHQUFaO0FBQ0EsU0FBSSxHQUFKLENBQVEsR0FBUjs7QUFFQSxZQUFPLEdBQVA7QUFDRDtBQXpGaUIsSUFBcEI7O0FBNEZBLFdBQVEsU0FBUixJQUFxQixPQUFyQjtBQUNBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQXRwSkcsQ0ExQ007QUFBaEI7QUFrc0pDLENBNXNKRDtBQTZzSkE7Ozs7O0FDdnVKQTs7Ozs7O0FBR0EsT0FBTyxPQUFQLEdBQWlCLFdBQVcsSUFBWCxDQUFnQixNQUFoQixDQUF1QjtBQUNwQyxjQUFVO0FBQUEsZUFBUSxjQUFSO0FBQUEsS0FEMEI7QUFFcEMsZUFBVyxlQUZ5QjtBQUdwQyxnQkFBWSxrQ0FId0I7QUFJcEMsZUFBVyxjQUp5QjtBQUtwQyxRQUFJO0FBQ0EsbUJBQVcscUJBRFg7QUFFQSxrQkFBVTtBQUZWLEtBTGdDO0FBU3BDLFlBQVE7QUFDSiwrQkFBdUIsZUFEbkI7QUFFSiw4QkFBc0I7QUFGbEIsS0FUNEI7QUFhcEMsbUJBQWUsdUJBQVUsS0FBVixFQUFpQjtBQUM1QixZQUFJLFFBQVEsS0FBSyxDQUFMLENBQU8sZUFBUCxFQUF3QixHQUF4QixFQUFaO0FBQUEsWUFDSSxPQUFPLEtBQUssQ0FBTCxDQUFPLGNBQVAsRUFBdUIsR0FBdkIsRUFEWDs7QUFHQSxZQUFJLE9BQU8sU0FBUyxJQUFULEVBQVg7QUFDQSxZQUFJLFVBQVUsS0FBSywwQkFBTCxDQUFnQyxLQUFoQyxFQUF1QyxJQUF2QyxDQUFkO0FBQ0EsZ0JBQVEsS0FBUixDQUFjLFVBQVUsQ0FBVixFQUFhO0FBQ3ZCLGtCQUFNLEVBQUUsT0FBUjtBQUNILFNBRkQ7QUFHSCxLQXRCbUM7QUF1QnBDLGtCQUFjLHdCQUFZO0FBQ3RCLFlBQUksUUFBUSxLQUFLLENBQUwsQ0FBTyxlQUFQLEVBQXdCLEdBQXhCLEVBQVo7QUFBQSxZQUNJLE9BQU8sS0FBSyxDQUFMLENBQU8sY0FBUCxFQUF1QixHQUF2QixFQURYOztBQUdBLFlBQUksT0FBTyxTQUFTLElBQVQsRUFBWDtBQUNBLFlBQUksVUFBVSxLQUFLLDhCQUFMLENBQW9DLEtBQXBDLEVBQTJDLElBQTNDLENBQWQ7O0FBRUEsZ0JBQVEsS0FBUixDQUFjLFVBQVUsQ0FBVixFQUFhO0FBQ3ZCLGtCQUFNLEVBQUUsT0FBUjtBQUNILFNBRkQ7QUFHSCxLQWpDbUM7QUFrQ3BDLGtCQWxDb0MsNEJBa0NsQjtBQUNkLGFBQUssTUFBTDtBQUNIO0FBcENtQyxDQUF2QixDQUFqQjs7Ozs7QUNIQTs7Ozs7O0FBR0EsSUFBSSxZQUFZLFNBQVMsS0FBVCxDQUFlLE1BQWYsQ0FBc0I7QUFDbEMsZ0JBQVksc0JBQVc7QUFDbkIsWUFBSSxDQUFDLEtBQUssR0FBTCxDQUFTLE9BQVQsQ0FBTCxFQUF3QjtBQUNwQixpQkFBSyxHQUFMLENBQVMsRUFBQyxTQUFTLEtBQUssUUFBTCxDQUFjLEtBQXhCLEVBQVQ7QUFDSDtBQUNKLEtBTGlDO0FBTWxDLGNBQVUsa0JBQVMsS0FBVCxFQUFnQjtBQUN0QixZQUFLLENBQUMsRUFBRSxJQUFGLENBQU8sTUFBTSxLQUFiLENBQU4sRUFBNEI7QUFDeEIsbUJBQU8sU0FBUDtBQUNIO0FBQ0osS0FWaUM7QUFXbEMsY0FBVSxvQkFBVztBQUNqQixlQUFNO0FBQ0YsbUJBQU8sY0FETDtBQUVGLGtCQUFNO0FBRkosU0FBTjtBQUlILEtBaEJpQztBQWlCbEMsWUFBUSxrQkFBVztBQUNmLGFBQUssSUFBTCxDQUFVLEVBQUUsTUFBSyxDQUFDLEtBQUssR0FBTCxDQUFTLE1BQVQsQ0FBUixFQUFWO0FBQ0gsS0FuQmlDO0FBb0JsQyxXQUFPLGlCQUFXO0FBQ2QsYUFBSyxPQUFMO0FBQ0g7QUF0QmlDLENBQXRCLENBQWhCOztBQXlCQSxJQUFJLE9BQU8sV0FBVyxJQUFYLENBQWdCLE1BQWhCLENBQXVCO0FBQzlCLGNBQVU7QUFBQSxlQUFRLFdBQVI7QUFBQSxLQURvQjtBQUU5QixlQUFXLGVBRm1CO0FBRzlCLGdCQUFZLCtCQUhrQjtBQUk5QixhQUFTLElBSnFCO0FBSzlCLFFBQUk7QUFDQSxnQkFBUSxNQURSO0FBRUEsa0JBQVUsU0FGVjtBQUdBLGtCQUFVO0FBSFYsS0FMMEI7QUFVOUIsWUFBUTtBQUNKLDBCQUFrQixVQURkO0FBRUosNEJBQW9CLFlBRmhCO0FBR0osNEJBQW9CO0FBSGhCLEtBVnNCO0FBZTlCLGNBQVU7QUFDTiw0QkFBb0I7QUFEZCxLQWZvQjtBQWtCOUIsaUJBQWEscUJBQVMsS0FBVCxFQUFlO0FBQ3hCLGFBQUssS0FBTCxDQUFXLEtBQVg7QUFDSCxLQXBCNkI7QUFxQjlCLGNBQVUsb0JBQVc7QUFDakIsYUFBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixDQUE3QjtBQUNILEtBdkI2QjtBQXdCOUIsY0FBVSxvQkFBVztBQUNqQixZQUFJLGVBQWUsT0FBTyxpQkFBUCxFQUEwQixLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsT0FBZixDQUExQixDQUFuQjtBQUNBLGFBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsRUFBQyxTQUFTLEVBQUUsTUFBRixDQUFTLFlBQVQsQ0FBVixFQUFoQixFQUFrRCxFQUFDLFVBQVMsSUFBVixFQUFsRDtBQUNILEtBM0I2QjtBQTRCOUIsZ0JBQVksb0JBQVMsS0FBVCxFQUFnQjtBQUN4QixhQUFLLEtBQUwsQ0FBVyxNQUFYO0FBQ0gsS0E5QjZCO0FBK0I5QixrQkEvQjhCLDRCQStCWjtBQUNkLGFBQUssTUFBTDtBQUNIO0FBakM2QixDQUF2QixDQUFYOztBQW9DQSxJQUFJLHFCQUFxQixXQUFXLGNBQVgsQ0FBMEIsTUFBMUIsQ0FBaUM7QUFDdEQsYUFBUyxJQUQ2QztBQUV0RCxlQUFXLE9BRjJDO0FBR3RELGVBQVcsSUFIMkM7QUFJdEQsZ0JBQVksc0JBQVU7QUFDbEIsYUFBSyxVQUFMLENBQWdCLEVBQWhCLENBQW1CLFFBQW5CLEVBQTZCLEVBQUUsSUFBRixDQUFPLEtBQUssTUFBWixFQUFvQixJQUFwQixDQUE3QjtBQUNILEtBTnFEO0FBT3RELDRCQUF3QixnQ0FBVSxJQUFWLEVBQWdCO0FBQ3BDLGFBQUssVUFBTCxDQUFnQixNQUFoQixDQUF1QixLQUFLLEtBQTVCO0FBQ0gsS0FUcUQ7QUFVdEQsb0JBQWdCLHdCQUFTLEtBQVQsRUFBZ0I7QUFDNUIsZUFBTyxNQUFNLEdBQU4sQ0FBVSxNQUFWLENBQVA7QUFDSDtBQVpxRCxDQUFqQyxDQUF6Qjs7QUFnQkEsT0FBTyxPQUFQLEdBQWlCLFdBQVcsSUFBWCxDQUFnQixNQUFoQixDQUF1QjtBQUNwQyxjQUFVO0FBQUEsZUFBUSxXQUFSO0FBQUEsS0FEMEI7QUFFcEMsZUFBVyxlQUZ5QjtBQUdwQyxnQkFBWSxrQ0FId0I7QUFJcEMsZUFBVyxXQUp5QjtBQUtwQyxhQUFTO0FBQ0wsY0FBTTtBQUNGLGdCQUFJO0FBREY7QUFERCxLQUwyQjtBQVVwQyxRQUFJO0FBQ0EsZ0JBQVEsY0FEUjtBQUVBLGlCQUFTO0FBRlQsS0FWZ0M7QUFjcEMsWUFBUTtBQUNKLDRCQUFvQixRQURoQjtBQUVKLDZCQUFxQjtBQUZqQixLQWQ0QjtBQWtCcEMsYUFBUyxpQkFBVSxLQUFWLEVBQWlCO0FBQ3RCLGNBQU0sY0FBTjtBQUNBLFlBQUksU0FBUyxFQUFFLE1BQUYsQ0FBYjtBQUNBLFlBQUksZUFBZSxPQUFPLEdBQVAsRUFBbkI7QUFDQSx1QkFBZSxFQUFFLE1BQUYsQ0FBUyxZQUFULENBQWY7QUFDQSxlQUFPLEdBQVAsQ0FBVyxFQUFYO0FBQ0EsWUFBSSxDQUFDLFlBQUwsRUFBbUI7QUFDbkIsWUFBSSxhQUFhLE1BQWIsR0FBc0IsR0FBMUIsRUFBK0I7QUFDL0IsYUFBSyxlQUFMLENBQXFCLEdBQXJCLENBQXlCLEVBQUMsT0FBTyxZQUFSLEVBQXpCO0FBQ0gsS0EzQm1DO0FBNEJwQyxZQUFRLGtCQUFZO0FBQ2hCLGlCQUFTLElBQVQsR0FBZ0IsT0FBaEI7QUFDSCxLQTlCbUM7QUErQnBDLGtCQUFjLHdCQUFZO0FBQ3RCLFlBQUksUUFBUSxTQUFTLElBQVQsR0FBZ0IsV0FBaEIsQ0FBNEIsS0FBeEM7QUFDQSxZQUFJLGVBQWUsTUFBTSxTQUFOLENBQWdCLENBQWhCLEVBQW1CLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBbkIsQ0FBbkI7O0FBRUEsVUFBRSxZQUFGLEVBQWdCLElBQWhCLENBQXFCLFlBQXJCO0FBQ0EsWUFBSSxrQkFBa0IsU0FBUyxRQUFULENBQWtCLFVBQWxCLENBQTZCLE1BQTdCLENBQW9DO0FBQ3RELG1CQUFPLFNBRCtDO0FBRXRELGlCQUFLLHNEQUFxRCxZQUFyRCxHQUFtRTtBQUZsQixTQUFwQyxDQUF0Qjs7QUFLQSxhQUFLLGVBQUwsR0FBdUIsSUFBSSxlQUFKLEVBQXZCO0FBQ0EsYUFBSyxrQkFBTCxHQUEwQixJQUFJLGtCQUFKLENBQXVCO0FBQzdDLHdCQUFZLEtBQUs7QUFENEIsU0FBdkIsQ0FBMUI7O0FBSUEsYUFBSyxhQUFMLENBQW1CLE1BQW5CLEVBQTJCLEtBQUssa0JBQWhDO0FBQ0gsS0EvQ21DO0FBZ0RwQyxrQkFoRG9DLDRCQWdEbEI7QUFDZCxhQUFLLE1BQUw7O0FBRUEsYUFBSyxZQUFMO0FBQ0g7QUFwRG1DLENBQXZCLENBQWpCOzs7Ozs7Ozs7QUNoRkE7Ozs7OztBQUVBLElBQU0sU0FBUztBQUNYLFlBQVEseUNBREc7QUFFWCxnQkFBWSxxQ0FGRDtBQUdYLGlCQUFhLDRDQUhGO0FBSVgsZUFBVyxxQkFKQTtBQUtYLG1CQUFlLGlDQUxKO0FBTVgsdUJBQW1CO0FBTlIsQ0FBZjtBQVFBLFNBQVMsYUFBVCxDQUF1QixNQUF2Qjs7QUFFQSxJQUFNLFFBQVE7QUFDVixrQkFBYyxRQUFRLGdCQUFSLENBREo7QUFFVixVQUFNLFFBQVEsZ0JBQVI7QUFGSSxDQUFkOztrQkFLZ0IsV0FBVyxJQUFYLENBQWdCLE1BQWhCLENBQXVCO0FBQ25DLGNBQVU7QUFBQSxlQUFRLFdBQVI7QUFBQSxLQUR5QjtBQUVuQyxlQUFXLGVBRndCO0FBR25DLGdCQUFZLHNCQUh1QjtBQUluQyxlQUFXLFVBSndCO0FBS25DLGFBQVM7QUFDTCxhQUFLO0FBQ0QsZ0JBQUksY0FESDtBQUVELDRCQUFnQjtBQUZmO0FBREEsS0FMMEI7QUFXbkMsZUFBVyxxQkFBWTtBQUNuQixZQUFJLFFBQVEsSUFBWjs7QUFFQSxpQkFBUyxJQUFULEdBQWdCLGtCQUFoQixDQUFtQyxVQUFVLFlBQVYsRUFBd0I7QUFDdkQsZ0JBQUksWUFBSixFQUFrQjtBQUNkLHdCQUFRLEdBQVIsQ0FBWSxnQkFBWjtBQUNBLHNCQUFNLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkIsSUFBSSxNQUFNLElBQVYsRUFBM0I7QUFDSCxhQUhELE1BR087QUFDSCx3QkFBUSxHQUFSLENBQVksZUFBWjtBQUNBLHNCQUFNLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkIsSUFBSSxNQUFNLFlBQVYsRUFBM0I7QUFDSDtBQUNKLFNBUkQ7QUFTSCxLQXZCa0M7QUF3Qm5DLGtCQXhCbUMsNEJBd0JqQjtBQUNkLGFBQUssTUFBTDtBQUNBLGFBQUssU0FBTDtBQUNIO0FBM0JrQyxDQUF2QixDOzs7QUNqQmhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBMYXlvdXQgZnJvbSAnLi92aWV3cy9sYXlvdXQnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hcmlvbmV0dGUuQXBwbGljYXRpb24uZXh0ZW5kKHtcclxuXHRyZWdpb246ICcuYXBwJyxcclxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMudG1wQ2FjaGUgPSB7fTtcclxuXHR9LFxyXG5cdHN0YXJ0OiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2hvd1ZpZXcobmV3IExheW91dCgpKTtcclxuXHR9LFxyXG5cdGFqYXggKG9wdGlvbnMpIHtcclxuXHRcdHZhciBwYXJhbXMgPSBfLmV4dGVuZCh7XHJcblx0XHRcdHVybDogJycsXHJcblx0XHRcdHR5cGU6ICdQT1NUJyxcclxuXHRcdFx0ZGF0YToge30sXHJcblx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdGNhbGxiYWNrIChyZXNwKSB7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ2FqYXggcmVzcCcpXHJcblx0XHRcdH1cclxuXHRcdH0sIG9wdGlvbnMpO1xyXG5cclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG5cdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdHVybDogcGFyYW1zLnVybCxcclxuXHRcdFx0XHR0eXBlOiBwYXJhbXMudHlwZSxcclxuXHRcdFx0XHRkYXRhOiBwYXJhbXMuZGF0YSxcclxuXHRcdFx0XHRkYXRhVHlwZTogcGFyYW1zLmRhdGFUeXBlXHJcblx0XHRcdH0pLmFsd2F5cygocmVzcG9uc2UsIHN0YXR1cykgPT4ge1xyXG5cdFx0XHRcdGlmKHN0YXR1cyA9PT0gJ2Vycm9yJykge1xyXG5cdFx0XHRcdFx0cmVqZWN0KHJlc3BvbnNlKVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuXHRcdFx0XHRcdGlmKHR5cGVvZiByZXNwb25zZSA9PT0gJ29iamVjdCcgJiYgcmVzcG9uc2UuY29kZSAhPSAyMDApIHtcclxuXHRcdFx0XHRcdFx0aWYocmVzcG9uc2UubWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdHJlamVjdChyZXNwb25zZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHBhcmFtcy5jYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH0pLmNhdGNoKHJlc3BvbnNlID0+IHtcclxuXHRcdFx0aWYocmVzcG9uc2UubWVzc2FnZSkge1xyXG5cdFx0XHRcdC8vSWYgdG9rZW4gaW52YWxpZCAtIGxvZ291dCB1c2VyXHJcblx0XHRcdFx0aWYocmVzcG9uc2UuY29kZSA9PT0gNDAxKSB7XHJcblx0XHRcdFx0XHRBcHAuUm91dGVyLm5hdmlnYXRlKCcvJywgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRhbGVydChyZXNwb25zZS50b1N0cmluZygpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59KTsiLCJpbXBvcnQgaGFuZGxlYmFycyBmcm9tICcuLi9saWJzL2hhbmRsZWJhcnMtdjQuMC4xMCc7XG5cbmNvbnN0IEhiVmlldyA9IE1hcmlvbmV0dGUuQmVoYXZpb3IuZXh0ZW5kKHtcbiAgICBsb2FkZWQ6IGZhbHNlLFxuICAgIGluaXRpYWxpemUgKG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IEhCVGVtcGxhdGUgPSB0aGlzLnZpZXcuSEJUZW1wbGF0ZTtcblxuICAgICAgICB0aGlzLnZpZXcuX2xvYWRUZW1wbGF0ZSA9IGZhbHNlO1xuXG4gICAgICAgIC8vR2V0IHBhdGggdGVtcGxhdGVcbiAgICAgICAgaWYoIUhCVGVtcGxhdGUpIHJldHVybiBjb25zb2xlLndhcm4oXCJIQlRlbXBsYXRlIGlzIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICAvL0NoZWNrIGNhY2hlIG9ialxuICAgICAgICBpZihBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdID0gQXBwLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBIQlRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ3RleHQnXG4gICAgICAgICAgICAgICAgfSkudGhlbihyZXNwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9BZGQgdG8gY2FjaGVcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMudmlldy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICAgICAgICAgICAgQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdID0gcmVzcDtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRlbXBsYXRlKEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXSk7XG4gICAgICAgICAgICAgICAgaWYoXy5pc0Z1bmN0aW9uKHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSkpIHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHJlc29sdmUocmVzcCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvL0NoZWNrIGN1cnJlbnQgcnVubmluZyBQcm9taXNlXG4gICAgICAgIGlmKF8uaXNGdW5jdGlvbihBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0udGhlbikpIHtcbiAgICAgICAgICAgIEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXS50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgICAgICAgIC8vQWRkIHRvIGNhY2hlXG4gICAgICAgICAgICAgICAgQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdID0gcmVzcDtcbiAgICAgICAgICAgIHRoaXMuc2V0VGVtcGxhdGUoQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdKTtcbiAgICAgICAgICAgIGlmKF8uaXNGdW5jdGlvbih0aGlzLnZpZXcub25Mb2FkVGVtcGxhdGUpKSB0aGlzLnZpZXcub25Mb2FkVGVtcGxhdGUoKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC8vVGVtcGxhdGUgbG9hZGVkLCBqdXN0IHNldCB0ZW1wbGF0ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zZXRUZW1wbGF0ZShBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRUZW1wbGF0ZSAodGVtcGxhdGUpIHtcbiAgICAgICAgbGV0IHRtcCA9IGhhbmRsZWJhcnMuY29tcGlsZSh0ZW1wbGF0ZSlcbiAgICAgICAgdGhpcy52aWV3LnRlbXBsYXRlID0gZGF0YSA9PiB0bXAoZGF0YSk7XG4gICAgICAgIHRoaXMudmlldy5fbG9hZFRlbXBsYXRlID0gdHJ1ZTtcbiAgICB9LFxuICAgIG9uQXR0YWNoICgpIHtcbiAgICAgICAgaWYoXy5pc0Z1bmN0aW9uKHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSkgJiYgdGhpcy5sb2FkZWQgPT09IHRydWUpIHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSgpO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBIYlZpZXciLCJpbXBvcnQgVG9kb2FwcCBmcm9tICcuL2FwcCc7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgd2luZG93LkFwcCA9IG5ldyBUb2RvYXBwKCk7XG4gICAgQXBwLnN0YXJ0KCk7XG59KTtcbiIsIi8qKiFcblxuIEBsaWNlbnNlXG4gaGFuZGxlYmFycyB2NC4wLjEwXG5cbkNvcHlyaWdodCAoQykgMjAxMS0yMDE2IGJ5IFllaHVkYSBLYXR6XG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS5cblxuKi9cbihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkhhbmRsZWJhcnNcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiSGFuZGxlYmFyc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG5cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG5cblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF9oYW5kbGViYXJzUnVudGltZSA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XG5cblx0dmFyIF9oYW5kbGViYXJzUnVudGltZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzUnVudGltZSk7XG5cblx0Ly8gQ29tcGlsZXIgaW1wb3J0c1xuXG5cdHZhciBfaGFuZGxlYmFyc0NvbXBpbGVyQXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNSk7XG5cblx0dmFyIF9oYW5kbGViYXJzQ29tcGlsZXJBc3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGFuZGxlYmFyc0NvbXBpbGVyQXN0KTtcblxuXHR2YXIgX2hhbmRsZWJhcnNDb21waWxlckJhc2UgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM2KTtcblxuXHR2YXIgX2hhbmRsZWJhcnNDb21waWxlckNvbXBpbGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MSk7XG5cblx0dmFyIF9oYW5kbGViYXJzQ29tcGlsZXJKYXZhc2NyaXB0Q29tcGlsZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQyKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNDb21waWxlckphdmFzY3JpcHRDb21waWxlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzQ29tcGlsZXJKYXZhc2NyaXB0Q29tcGlsZXIpO1xuXG5cdHZhciBfaGFuZGxlYmFyc0NvbXBpbGVyVmlzaXRvciA9IF9fd2VicGFja19yZXF1aXJlX18oMzkpO1xuXG5cdHZhciBfaGFuZGxlYmFyc0NvbXBpbGVyVmlzaXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzQ29tcGlsZXJWaXNpdG9yKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNOb0NvbmZsaWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNCk7XG5cblx0dmFyIF9oYW5kbGViYXJzTm9Db25mbGljdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzTm9Db25mbGljdCk7XG5cblx0dmFyIF9jcmVhdGUgPSBfaGFuZGxlYmFyc1J1bnRpbWUyWydkZWZhdWx0J10uY3JlYXRlO1xuXHRmdW5jdGlvbiBjcmVhdGUoKSB7XG5cdCAgdmFyIGhiID0gX2NyZWF0ZSgpO1xuXG5cdCAgaGIuY29tcGlsZSA9IGZ1bmN0aW9uIChpbnB1dCwgb3B0aW9ucykge1xuXHQgICAgcmV0dXJuIF9oYW5kbGViYXJzQ29tcGlsZXJDb21waWxlci5jb21waWxlKGlucHV0LCBvcHRpb25zLCBoYik7XG5cdCAgfTtcblx0ICBoYi5wcmVjb21waWxlID0gZnVuY3Rpb24gKGlucHV0LCBvcHRpb25zKSB7XG5cdCAgICByZXR1cm4gX2hhbmRsZWJhcnNDb21waWxlckNvbXBpbGVyLnByZWNvbXBpbGUoaW5wdXQsIG9wdGlvbnMsIGhiKTtcblx0ICB9O1xuXG5cdCAgaGIuQVNUID0gX2hhbmRsZWJhcnNDb21waWxlckFzdDJbJ2RlZmF1bHQnXTtcblx0ICBoYi5Db21waWxlciA9IF9oYW5kbGViYXJzQ29tcGlsZXJDb21waWxlci5Db21waWxlcjtcblx0ICBoYi5KYXZhU2NyaXB0Q29tcGlsZXIgPSBfaGFuZGxlYmFyc0NvbXBpbGVySmF2YXNjcmlwdENvbXBpbGVyMlsnZGVmYXVsdCddO1xuXHQgIGhiLlBhcnNlciA9IF9oYW5kbGViYXJzQ29tcGlsZXJCYXNlLnBhcnNlcjtcblx0ICBoYi5wYXJzZSA9IF9oYW5kbGViYXJzQ29tcGlsZXJCYXNlLnBhcnNlO1xuXG5cdCAgcmV0dXJuIGhiO1xuXHR9XG5cblx0dmFyIGluc3QgPSBjcmVhdGUoKTtcblx0aW5zdC5jcmVhdGUgPSBjcmVhdGU7XG5cblx0X2hhbmRsZWJhcnNOb0NvbmZsaWN0MlsnZGVmYXVsdCddKGluc3QpO1xuXG5cdGluc3QuVmlzaXRvciA9IF9oYW5kbGViYXJzQ29tcGlsZXJWaXNpdG9yMlsnZGVmYXVsdCddO1xuXG5cdGluc3RbJ2RlZmF1bHQnXSA9IGluc3Q7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gaW5zdDtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKG9iaikge1xuXHQgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG5cdCAgICBcImRlZmF1bHRcIjogb2JqXG5cdCAgfTtcblx0fTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG4vKioqLyB9KSxcbi8qIDIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKVsnZGVmYXVsdCddO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF9oYW5kbGViYXJzQmFzZSA9IF9fd2VicGFja19yZXF1aXJlX18oNCk7XG5cblx0dmFyIGJhc2UgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfaGFuZGxlYmFyc0Jhc2UpO1xuXG5cdC8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cblx0Ly8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcblxuXHR2YXIgX2hhbmRsZWJhcnNTYWZlU3RyaW5nID0gX193ZWJwYWNrX3JlcXVpcmVfXygyMSk7XG5cblx0dmFyIF9oYW5kbGViYXJzU2FmZVN0cmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzU2FmZVN0cmluZyk7XG5cblx0dmFyIF9oYW5kbGViYXJzRXhjZXB0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHR2YXIgX2hhbmRsZWJhcnNFeGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGFuZGxlYmFyc0V4Y2VwdGlvbik7XG5cblx0dmFyIF9oYW5kbGViYXJzVXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdHZhciBVdGlscyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9oYW5kbGViYXJzVXRpbHMpO1xuXG5cdHZhciBfaGFuZGxlYmFyc1J1bnRpbWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIyKTtcblxuXHR2YXIgcnVudGltZSA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9oYW5kbGViYXJzUnVudGltZSk7XG5cblx0dmFyIF9oYW5kbGViYXJzTm9Db25mbGljdCA9IF9fd2VicGFja19yZXF1aXJlX18oMzQpO1xuXG5cdHZhciBfaGFuZGxlYmFyc05vQ29uZmxpY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGFuZGxlYmFyc05vQ29uZmxpY3QpO1xuXG5cdC8vIEZvciBjb21wYXRpYmlsaXR5IGFuZCB1c2FnZSBvdXRzaWRlIG9mIG1vZHVsZSBzeXN0ZW1zLCBtYWtlIHRoZSBIYW5kbGViYXJzIG9iamVjdCBhIG5hbWVzcGFjZVxuXHRmdW5jdGlvbiBjcmVhdGUoKSB7XG5cdCAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cblx0ICBVdGlscy5leHRlbmQoaGIsIGJhc2UpO1xuXHQgIGhiLlNhZmVTdHJpbmcgPSBfaGFuZGxlYmFyc1NhZmVTdHJpbmcyWydkZWZhdWx0J107XG5cdCAgaGIuRXhjZXB0aW9uID0gX2hhbmRsZWJhcnNFeGNlcHRpb24yWydkZWZhdWx0J107XG5cdCAgaGIuVXRpbHMgPSBVdGlscztcblx0ICBoYi5lc2NhcGVFeHByZXNzaW9uID0gVXRpbHMuZXNjYXBlRXhwcmVzc2lvbjtcblxuXHQgIGhiLlZNID0gcnVudGltZTtcblx0ICBoYi50ZW1wbGF0ZSA9IGZ1bmN0aW9uIChzcGVjKSB7XG5cdCAgICByZXR1cm4gcnVudGltZS50ZW1wbGF0ZShzcGVjLCBoYik7XG5cdCAgfTtcblxuXHQgIHJldHVybiBoYjtcblx0fVxuXG5cdHZhciBpbnN0ID0gY3JlYXRlKCk7XG5cdGluc3QuY3JlYXRlID0gY3JlYXRlO1xuXG5cdF9oYW5kbGViYXJzTm9Db25mbGljdDJbJ2RlZmF1bHQnXShpbnN0KTtcblxuXHRpbnN0WydkZWZhdWx0J10gPSBpbnN0O1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGluc3Q7XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRleHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChvYmopIHtcblx0ICBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7XG5cdCAgICByZXR1cm4gb2JqO1xuXHQgIH0gZWxzZSB7XG5cdCAgICB2YXIgbmV3T2JqID0ge307XG5cblx0ICAgIGlmIChvYmogIT0gbnVsbCkge1xuXHQgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdCAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajtcblx0ICAgIHJldHVybiBuZXdPYmo7XG5cdCAgfVxuXHR9O1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbi8qKiovIH0pLFxuLyogNCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHR2YXIgX2hlbHBlcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEwKTtcblxuXHR2YXIgX2RlY29yYXRvcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE4KTtcblxuXHR2YXIgX2xvZ2dlciA9IF9fd2VicGFja19yZXF1aXJlX18oMjApO1xuXG5cdHZhciBfbG9nZ2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZ2dlcik7XG5cblx0dmFyIFZFUlNJT04gPSAnNC4wLjEwJztcblx0ZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjtcblx0dmFyIENPTVBJTEVSX1JFVklTSU9OID0gNztcblxuXHRleHBvcnRzLkNPTVBJTEVSX1JFVklTSU9OID0gQ09NUElMRVJfUkVWSVNJT047XG5cdHZhciBSRVZJU0lPTl9DSEFOR0VTID0ge1xuXHQgIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG5cdCAgMjogJz09IDEuMC4wLXJjLjMnLFxuXHQgIDM6ICc9PSAxLjAuMC1yYy40Jyxcblx0ICA0OiAnPT0gMS54LngnLFxuXHQgIDU6ICc9PSAyLjAuMC1hbHBoYS54Jyxcblx0ICA2OiAnPj0gMi4wLjAtYmV0YS4xJyxcblx0ICA3OiAnPj0gNC4wLjAnXG5cdH07XG5cblx0ZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcblx0dmFyIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuXHRmdW5jdGlvbiBIYW5kbGViYXJzRW52aXJvbm1lbnQoaGVscGVycywgcGFydGlhbHMsIGRlY29yYXRvcnMpIHtcblx0ICB0aGlzLmhlbHBlcnMgPSBoZWxwZXJzIHx8IHt9O1xuXHQgIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblx0ICB0aGlzLmRlY29yYXRvcnMgPSBkZWNvcmF0b3JzIHx8IHt9O1xuXG5cdCAgX2hlbHBlcnMucmVnaXN0ZXJEZWZhdWx0SGVscGVycyh0aGlzKTtcblx0ICBfZGVjb3JhdG9ycy5yZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzKHRoaXMpO1xuXHR9XG5cblx0SGFuZGxlYmFyc0Vudmlyb25tZW50LnByb3RvdHlwZSA9IHtcblx0ICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG5cdCAgbG9nZ2VyOiBfbG9nZ2VyMlsnZGVmYXVsdCddLFxuXHQgIGxvZzogX2xvZ2dlcjJbJ2RlZmF1bHQnXS5sb2csXG5cblx0ICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24gcmVnaXN0ZXJIZWxwZXIobmFtZSwgZm4pIHtcblx0ICAgIGlmIChfdXRpbHMudG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuXHQgICAgICBpZiAoZm4pIHtcblx0ICAgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7XG5cdCAgICAgIH1cblx0ICAgICAgX3V0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5oZWxwZXJzW25hbWVdID0gZm47XG5cdCAgICB9XG5cdCAgfSxcblx0ICB1bnJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbiB1bnJlZ2lzdGVySGVscGVyKG5hbWUpIHtcblx0ICAgIGRlbGV0ZSB0aGlzLmhlbHBlcnNbbmFtZV07XG5cdCAgfSxcblxuXHQgIHJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24gcmVnaXN0ZXJQYXJ0aWFsKG5hbWUsIHBhcnRpYWwpIHtcblx0ICAgIGlmIChfdXRpbHMudG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuXHQgICAgICBfdXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsIG5hbWUpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKHR5cGVvZiBwYXJ0aWFsID09PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdBdHRlbXB0aW5nIHRvIHJlZ2lzdGVyIGEgcGFydGlhbCBjYWxsZWQgXCInICsgbmFtZSArICdcIiBhcyB1bmRlZmluZWQnKTtcblx0ICAgICAgfVxuXHQgICAgICB0aGlzLnBhcnRpYWxzW25hbWVdID0gcGFydGlhbDtcblx0ICAgIH1cblx0ICB9LFxuXHQgIHVucmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbiB1bnJlZ2lzdGVyUGFydGlhbChuYW1lKSB7XG5cdCAgICBkZWxldGUgdGhpcy5wYXJ0aWFsc1tuYW1lXTtcblx0ICB9LFxuXG5cdCAgcmVnaXN0ZXJEZWNvcmF0b3I6IGZ1bmN0aW9uIHJlZ2lzdGVyRGVjb3JhdG9yKG5hbWUsIGZuKSB7XG5cdCAgICBpZiAoX3V0aWxzLnRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcblx0ICAgICAgaWYgKGZuKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgZGVjb3JhdG9ycycpO1xuXHQgICAgICB9XG5cdCAgICAgIF91dGlscy5leHRlbmQodGhpcy5kZWNvcmF0b3JzLCBuYW1lKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMuZGVjb3JhdG9yc1tuYW1lXSA9IGZuO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgdW5yZWdpc3RlckRlY29yYXRvcjogZnVuY3Rpb24gdW5yZWdpc3RlckRlY29yYXRvcihuYW1lKSB7XG5cdCAgICBkZWxldGUgdGhpcy5kZWNvcmF0b3JzW25hbWVdO1xuXHQgIH1cblx0fTtcblxuXHR2YXIgbG9nID0gX2xvZ2dlcjJbJ2RlZmF1bHQnXS5sb2c7XG5cblx0ZXhwb3J0cy5sb2cgPSBsb2c7XG5cdGV4cG9ydHMuY3JlYXRlRnJhbWUgPSBfdXRpbHMuY3JlYXRlRnJhbWU7XG5cdGV4cG9ydHMubG9nZ2VyID0gX2xvZ2dlcjJbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiA1ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuXHRleHBvcnRzLmluZGV4T2YgPSBpbmRleE9mO1xuXHRleHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO1xuXHRleHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5O1xuXHRleHBvcnRzLmNyZWF0ZUZyYW1lID0gY3JlYXRlRnJhbWU7XG5cdGV4cG9ydHMuYmxvY2tQYXJhbXMgPSBibG9ja1BhcmFtcztcblx0ZXhwb3J0cy5hcHBlbmRDb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoO1xuXHR2YXIgZXNjYXBlID0ge1xuXHQgICcmJzogJyZhbXA7Jyxcblx0ICAnPCc6ICcmbHQ7Jyxcblx0ICAnPic6ICcmZ3Q7Jyxcblx0ICAnXCInOiAnJnF1b3Q7Jyxcblx0ICBcIidcIjogJyYjeDI3OycsXG5cdCAgJ2AnOiAnJiN4NjA7Jyxcblx0ICAnPSc6ICcmI3gzRDsnXG5cdH07XG5cblx0dmFyIGJhZENoYXJzID0gL1smPD5cIidgPV0vZyxcblx0ICAgIHBvc3NpYmxlID0gL1smPD5cIidgPV0vO1xuXG5cdGZ1bmN0aW9uIGVzY2FwZUNoYXIoY2hyKSB7XG5cdCAgcmV0dXJuIGVzY2FwZVtjaHJdO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXh0ZW5kKG9iaiAvKiAsIC4uLnNvdXJjZSAqLykge1xuXHQgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBmb3IgKHZhciBrZXkgaW4gYXJndW1lbnRzW2ldKSB7XG5cdCAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJndW1lbnRzW2ldLCBrZXkpKSB7XG5cdCAgICAgICAgb2JqW2tleV0gPSBhcmd1bWVudHNbaV1ba2V5XTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblxuXHQgIHJldHVybiBvYmo7XG5cdH1cblxuXHR2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5cdGV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcblx0Ly8gU291cmNlZCBmcm9tIGxvZGFzaFxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vYmVzdGllanMvbG9kYXNoL2Jsb2IvbWFzdGVyL0xJQ0VOU0UudHh0XG5cdC8qIGVzbGludC1kaXNhYmxlIGZ1bmMtc3R5bGUgKi9cblx0dmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcblx0fTtcblx0Ly8gZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zIG9mIENocm9tZSBhbmQgU2FmYXJpXG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdGlmIChpc0Z1bmN0aW9uKC94LykpIHtcblx0ICBleHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdCAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHQgIH07XG5cdH1cblx0ZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuXHQvKiBlc2xpbnQtZW5hYmxlIGZ1bmMtc3R5bGUgKi9cblxuXHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHR2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJyA6IGZhbHNlO1xuXHR9O1xuXG5cdGV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cdC8vIE9sZGVyIElFIHZlcnNpb25zIGRvIG5vdCBkaXJlY3RseSBzdXBwb3J0IGluZGV4T2Ygc28gd2UgbXVzdCBpbXBsZW1lbnQgb3VyIG93biwgc2FkbHkuXG5cblx0ZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUpIHtcblx0ICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgIGlmIChhcnJheVtpXSA9PT0gdmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIGk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiAtMTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVzY2FwZUV4cHJlc3Npb24oc3RyaW5nKSB7XG5cdCAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG5cdCAgICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG5cdCAgICBpZiAoc3RyaW5nICYmIHN0cmluZy50b0hUTUwpIHtcblx0ICAgICAgcmV0dXJuIHN0cmluZy50b0hUTUwoKTtcblx0ICAgIH0gZWxzZSBpZiAoc3RyaW5nID09IG51bGwpIHtcblx0ICAgICAgcmV0dXJuICcnO1xuXHQgICAgfSBlbHNlIGlmICghc3RyaW5nKSB7XG5cdCAgICAgIHJldHVybiBzdHJpbmcgKyAnJztcblx0ICAgIH1cblxuXHQgICAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG5cdCAgICAvLyB0aGUgcmVnZXggdGVzdCB3aWxsIGRvIHRoaXMgdHJhbnNwYXJlbnRseSBiZWhpbmQgdGhlIHNjZW5lcywgY2F1c2luZyBpc3N1ZXMgaWZcblx0ICAgIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuXHQgICAgc3RyaW5nID0gJycgKyBzdHJpbmc7XG5cdCAgfVxuXG5cdCAgaWYgKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHtcblx0ICAgIHJldHVybiBzdHJpbmc7XG5cdCAgfVxuXHQgIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG5cdCAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlRnJhbWUob2JqZWN0KSB7XG5cdCAgdmFyIGZyYW1lID0gZXh0ZW5kKHt9LCBvYmplY3QpO1xuXHQgIGZyYW1lLl9wYXJlbnQgPSBvYmplY3Q7XG5cdCAgcmV0dXJuIGZyYW1lO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmxvY2tQYXJhbXMocGFyYW1zLCBpZHMpIHtcblx0ICBwYXJhbXMucGF0aCA9IGlkcztcblx0ICByZXR1cm4gcGFyYW1zO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXBwZW5kQ29udGV4dFBhdGgoY29udGV4dFBhdGgsIGlkKSB7XG5cdCAgcmV0dXJuIChjb250ZXh0UGF0aCA/IGNvbnRleHRQYXRoICsgJy4nIDogJycpICsgaWQ7XG5cdH1cblxuLyoqKi8gfSksXG4vKiA2ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfT2JqZWN0JGRlZmluZVByb3BlcnR5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3KVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIGVycm9yUHJvcHMgPSBbJ2Rlc2NyaXB0aW9uJywgJ2ZpbGVOYW1lJywgJ2xpbmVOdW1iZXInLCAnbWVzc2FnZScsICduYW1lJywgJ251bWJlcicsICdzdGFjayddO1xuXG5cdGZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG5cdCAgdmFyIGxvYyA9IG5vZGUgJiYgbm9kZS5sb2MsXG5cdCAgICAgIGxpbmUgPSB1bmRlZmluZWQsXG5cdCAgICAgIGNvbHVtbiA9IHVuZGVmaW5lZDtcblx0ICBpZiAobG9jKSB7XG5cdCAgICBsaW5lID0gbG9jLnN0YXJ0LmxpbmU7XG5cdCAgICBjb2x1bW4gPSBsb2Muc3RhcnQuY29sdW1uO1xuXG5cdCAgICBtZXNzYWdlICs9ICcgLSAnICsgbGluZSArICc6JyArIGNvbHVtbjtcblx0ICB9XG5cblx0ICB2YXIgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cblx0ICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cblx0ICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBlcnJvclByb3BzLmxlbmd0aDsgaWR4KyspIHtcblx0ICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuXHQgIH1cblxuXHQgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdCAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG5cdCAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBFeGNlcHRpb24pO1xuXHQgIH1cblxuXHQgIHRyeSB7XG5cdCAgICBpZiAobG9jKSB7XG5cdCAgICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG5cblx0ICAgICAgLy8gV29yayBhcm91bmQgaXNzdWUgdW5kZXIgc2FmYXJpIHdoZXJlIHdlIGNhbid0IGRpcmVjdGx5IHNldCB0aGUgY29sdW1uIHZhbHVlXG5cdCAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgICAgIGlmIChfT2JqZWN0JGRlZmluZVByb3BlcnR5KSB7XG5cdCAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdjb2x1bW4nLCB7XG5cdCAgICAgICAgICB2YWx1ZTogY29sdW1uLFxuXHQgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXHQgICAgICAgIH0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSBjYXRjaCAobm9wKSB7XG5cdCAgICAvKiBJZ25vcmUgaWYgdGhlIGJyb3dzZXIgaXMgdmVyeSBwYXJ0aWN1bGFyICovXG5cdCAgfVxuXHR9XG5cblx0RXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IEV4Y2VwdGlvbjtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogNyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogX193ZWJwYWNrX3JlcXVpcmVfXyg4KSwgX19lc01vZHVsZTogdHJ1ZSB9O1xuXG4vKioqLyB9KSxcbi8qIDggKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgJCA9IF9fd2VicGFja19yZXF1aXJlX18oOSk7XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYyl7XG5cdCAgcmV0dXJuICQuc2V0RGVzYyhpdCwga2V5LCBkZXNjKTtcblx0fTtcblxuLyoqKi8gfSksXG4vKiA5ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0dmFyICRPYmplY3QgPSBPYmplY3Q7XG5cdG1vZHVsZS5leHBvcnRzID0ge1xuXHQgIGNyZWF0ZTogICAgICRPYmplY3QuY3JlYXRlLFxuXHQgIGdldFByb3RvOiAgICRPYmplY3QuZ2V0UHJvdG90eXBlT2YsXG5cdCAgaXNFbnVtOiAgICAge30ucHJvcGVydHlJc0VudW1lcmFibGUsXG5cdCAgZ2V0RGVzYzogICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG5cdCAgc2V0RGVzYzogICAgJE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcblx0ICBzZXREZXNjczogICAkT2JqZWN0LmRlZmluZVByb3BlcnRpZXMsXG5cdCAgZ2V0S2V5czogICAgJE9iamVjdC5rZXlzLFxuXHQgIGdldE5hbWVzOiAgICRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxcblx0ICBnZXRTeW1ib2xzOiAkT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcblx0ICBlYWNoOiAgICAgICBbXS5mb3JFYWNoXG5cdH07XG5cbi8qKiovIH0pLFxuLyogMTAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5yZWdpc3RlckRlZmF1bHRIZWxwZXJzID0gcmVnaXN0ZXJEZWZhdWx0SGVscGVycztcblxuXHR2YXIgX2hlbHBlcnNCbG9ja0hlbHBlck1pc3NpbmcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDExKTtcblxuXHR2YXIgX2hlbHBlcnNCbG9ja0hlbHBlck1pc3NpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0Jsb2NrSGVscGVyTWlzc2luZyk7XG5cblx0dmFyIF9oZWxwZXJzRWFjaCA9IF9fd2VicGFja19yZXF1aXJlX18oMTIpO1xuXG5cdHZhciBfaGVscGVyc0VhY2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0VhY2gpO1xuXG5cdHZhciBfaGVscGVyc0hlbHBlck1pc3NpbmcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEzKTtcblxuXHR2YXIgX2hlbHBlcnNIZWxwZXJNaXNzaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNIZWxwZXJNaXNzaW5nKTtcblxuXHR2YXIgX2hlbHBlcnNJZiA9IF9fd2VicGFja19yZXF1aXJlX18oMTQpO1xuXG5cdHZhciBfaGVscGVyc0lmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNJZik7XG5cblx0dmFyIF9oZWxwZXJzTG9nID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNSk7XG5cblx0dmFyIF9oZWxwZXJzTG9nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNMb2cpO1xuXG5cdHZhciBfaGVscGVyc0xvb2t1cCA9IF9fd2VicGFja19yZXF1aXJlX18oMTYpO1xuXG5cdHZhciBfaGVscGVyc0xvb2t1cDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzTG9va3VwKTtcblxuXHR2YXIgX2hlbHBlcnNXaXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNyk7XG5cblx0dmFyIF9oZWxwZXJzV2l0aDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzV2l0aCk7XG5cblx0ZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0SGVscGVycyhpbnN0YW5jZSkge1xuXHQgIF9oZWxwZXJzQmxvY2tIZWxwZXJNaXNzaW5nMlsnZGVmYXVsdCddKGluc3RhbmNlKTtcblx0ICBfaGVscGVyc0VhY2gyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHQgIF9oZWxwZXJzSGVscGVyTWlzc2luZzJbJ2RlZmF1bHQnXShpbnN0YW5jZSk7XG5cdCAgX2hlbHBlcnNJZjJbJ2RlZmF1bHQnXShpbnN0YW5jZSk7XG5cdCAgX2hlbHBlcnNMb2cyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHQgIF9oZWxwZXJzTG9va3VwMlsnZGVmYXVsdCddKGluc3RhbmNlKTtcblx0ICBfaGVscGVyc1dpdGgyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHR9XG5cbi8qKiovIH0pLFxuLyogMTEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignYmxvY2tIZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24gKGNvbnRleHQsIG9wdGlvbnMpIHtcblx0ICAgIHZhciBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlLFxuXHQgICAgICAgIGZuID0gb3B0aW9ucy5mbjtcblxuXHQgICAgaWYgKGNvbnRleHQgPT09IHRydWUpIHtcblx0ICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuXHQgICAgfSBlbHNlIGlmIChjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcblx0ICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG5cdCAgICB9IGVsc2UgaWYgKF91dGlscy5pc0FycmF5KGNvbnRleHQpKSB7XG5cdCAgICAgIGlmIChjb250ZXh0Lmxlbmd0aCA+IDApIHtcblx0ICAgICAgICBpZiAob3B0aW9ucy5pZHMpIHtcblx0ICAgICAgICAgIG9wdGlvbnMuaWRzID0gW29wdGlvbnMubmFtZV07XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmlkcykge1xuXHQgICAgICAgIHZhciBkYXRhID0gX3V0aWxzLmNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG5cdCAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IF91dGlscy5hcHBlbmRDb250ZXh0UGF0aChvcHRpb25zLmRhdGEuY29udGV4dFBhdGgsIG9wdGlvbnMubmFtZSk7XG5cdCAgICAgICAgb3B0aW9ucyA9IHsgZGF0YTogZGF0YSB9O1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDEyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIF9leGNlcHRpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG5cdHZhciBfZXhjZXB0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4Y2VwdGlvbik7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbiAoY29udGV4dCwgb3B0aW9ucykge1xuXHQgICAgaWYgKCFvcHRpb25zKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdNdXN0IHBhc3MgaXRlcmF0b3IgdG8gI2VhY2gnKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGZuID0gb3B0aW9ucy5mbixcblx0ICAgICAgICBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlLFxuXHQgICAgICAgIGkgPSAwLFxuXHQgICAgICAgIHJldCA9ICcnLFxuXHQgICAgICAgIGRhdGEgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgY29udGV4dFBhdGggPSB1bmRlZmluZWQ7XG5cblx0ICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcblx0ICAgICAgY29udGV4dFBhdGggPSBfdXRpbHMuYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLmlkc1swXSkgKyAnLic7XG5cdCAgICB9XG5cblx0ICAgIGlmIChfdXRpbHMuaXNGdW5jdGlvbihjb250ZXh0KSkge1xuXHQgICAgICBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG5cdCAgICAgIGRhdGEgPSBfdXRpbHMuY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZXhlY0l0ZXJhdGlvbihmaWVsZCwgaW5kZXgsIGxhc3QpIHtcblx0ICAgICAgaWYgKGRhdGEpIHtcblx0ICAgICAgICBkYXRhLmtleSA9IGZpZWxkO1xuXHQgICAgICAgIGRhdGEuaW5kZXggPSBpbmRleDtcblx0ICAgICAgICBkYXRhLmZpcnN0ID0gaW5kZXggPT09IDA7XG5cdCAgICAgICAgZGF0YS5sYXN0ID0gISFsYXN0O1xuXG5cdCAgICAgICAgaWYgKGNvbnRleHRQYXRoKSB7XG5cdCAgICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gY29udGV4dFBhdGggKyBmaWVsZDtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2ZpZWxkXSwge1xuXHQgICAgICAgIGRhdGE6IGRhdGEsXG5cdCAgICAgICAgYmxvY2tQYXJhbXM6IF91dGlscy5ibG9ja1BhcmFtcyhbY29udGV4dFtmaWVsZF0sIGZpZWxkXSwgW2NvbnRleHRQYXRoICsgZmllbGQsIG51bGxdKVxuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIGlmIChfdXRpbHMuaXNBcnJheShjb250ZXh0KSkge1xuXHQgICAgICAgIGZvciAodmFyIGogPSBjb250ZXh0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHQgICAgICAgICAgaWYgKGkgaW4gY29udGV4dCkge1xuXHQgICAgICAgICAgICBleGVjSXRlcmF0aW9uKGksIGksIGkgPT09IGNvbnRleHQubGVuZ3RoIC0gMSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciBwcmlvcktleSA9IHVuZGVmaW5lZDtcblxuXHQgICAgICAgIGZvciAodmFyIGtleSBpbiBjb250ZXh0KSB7XG5cdCAgICAgICAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdCAgICAgICAgICAgIC8vIFdlJ3JlIHJ1bm5pbmcgdGhlIGl0ZXJhdGlvbnMgb25lIHN0ZXAgb3V0IG9mIHN5bmMgc28gd2UgY2FuIGRldGVjdFxuXHQgICAgICAgICAgICAvLyB0aGUgbGFzdCBpdGVyYXRpb24gd2l0aG91dCBoYXZlIHRvIHNjYW4gdGhlIG9iamVjdCB0d2ljZSBhbmQgY3JlYXRlXG5cdCAgICAgICAgICAgIC8vIGFuIGl0ZXJtZWRpYXRlIGtleXMgYXJyYXkuXG5cdCAgICAgICAgICAgIGlmIChwcmlvcktleSAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgZXhlY0l0ZXJhdGlvbihwcmlvcktleSwgaSAtIDEpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHByaW9yS2V5ID0ga2V5O1xuXHQgICAgICAgICAgICBpKys7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmIChwcmlvcktleSAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSwgdHJ1ZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGlmIChpID09PSAwKSB7XG5cdCAgICAgIHJldCA9IGludmVyc2UodGhpcyk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiByZXQ7XG5cdCAgfSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMTMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaGVscGVyTWlzc2luZycsIGZ1bmN0aW9uICgpIC8qIFthcmdzLCBdb3B0aW9ucyAqL3tcblx0ICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdCAgICAgIC8vIEEgbWlzc2luZyBmaWVsZCBpbiBhIHt7Zm9vfX0gY29uc3RydWN0LlxuXHQgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gU29tZW9uZSBpcyBhY3R1YWxseSB0cnlpbmcgdG8gY2FsbCBzb21ldGhpbmcsIGJsb3cgdXAuXG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdNaXNzaW5nIGhlbHBlcjogXCInICsgYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXS5uYW1lICsgJ1wiJyk7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMTQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbiAoY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcblx0ICAgIGlmIChfdXRpbHMuaXNGdW5jdGlvbihjb25kaXRpb25hbCkpIHtcblx0ICAgICAgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbC5jYWxsKHRoaXMpO1xuXHQgICAgfVxuXG5cdCAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIGlzIHRvIHJlbmRlciB0aGUgcG9zaXRpdmUgcGF0aCBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5IGFuZCBub3QgZW1wdHkuXG5cdCAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuXHQgICAgLy8gYmVoYXZpb3Igb2YgaXNFbXB0eS4gRWZmZWN0aXZlbHkgdGhpcyBkZXRlcm1pbmVzIGlmIDAgaXMgaGFuZGxlZCBieSB0aGUgcG9zaXRpdmUgcGF0aCBvciBuZWdhdGl2ZS5cblx0ICAgIGlmICghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCB8fCBfdXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcblx0ICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuXHQgICAgfVxuXHQgIH0pO1xuXG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uIChjb25kaXRpb25hbCwgb3B0aW9ucykge1xuXHQgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwgeyBmbjogb3B0aW9ucy5pbnZlcnNlLCBpbnZlcnNlOiBvcHRpb25zLmZuLCBoYXNoOiBvcHRpb25zLmhhc2ggfSk7XG5cdCAgfSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMTUgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24gKCkgLyogbWVzc2FnZSwgb3B0aW9ucyAqL3tcblx0ICAgIHZhciBhcmdzID0gW3VuZGVmaW5lZF0sXG5cdCAgICAgICAgb3B0aW9ucyA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpKyspIHtcblx0ICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG5cdCAgICB9XG5cblx0ICAgIHZhciBsZXZlbCA9IDE7XG5cdCAgICBpZiAob3B0aW9ucy5oYXNoLmxldmVsICE9IG51bGwpIHtcblx0ICAgICAgbGV2ZWwgPSBvcHRpb25zLmhhc2gubGV2ZWw7XG5cdCAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCkge1xuXHQgICAgICBsZXZlbCA9IG9wdGlvbnMuZGF0YS5sZXZlbDtcblx0ICAgIH1cblx0ICAgIGFyZ3NbMF0gPSBsZXZlbDtcblxuXHQgICAgaW5zdGFuY2UubG9nLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcblx0ICB9KTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAxNiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuXHQgIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb29rdXAnLCBmdW5jdGlvbiAob2JqLCBmaWVsZCkge1xuXHQgICAgcmV0dXJuIG9iaiAmJiBvYmpbZmllbGRdO1xuXHQgIH0pO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDE3ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbiAoY29udGV4dCwgb3B0aW9ucykge1xuXHQgICAgaWYgKF91dGlscy5pc0Z1bmN0aW9uKGNvbnRleHQpKSB7XG5cdCAgICAgIGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7XG5cdCAgICB9XG5cblx0ICAgIHZhciBmbiA9IG9wdGlvbnMuZm47XG5cblx0ICAgIGlmICghX3V0aWxzLmlzRW1wdHkoY29udGV4dCkpIHtcblx0ICAgICAgdmFyIGRhdGEgPSBvcHRpb25zLmRhdGE7XG5cdCAgICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcblx0ICAgICAgICBkYXRhID0gX3V0aWxzLmNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG5cdCAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IF91dGlscy5hcHBlbmRDb250ZXh0UGF0aChvcHRpb25zLmRhdGEuY29udGV4dFBhdGgsIG9wdGlvbnMuaWRzWzBdKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBmbihjb250ZXh0LCB7XG5cdCAgICAgICAgZGF0YTogZGF0YSxcblx0ICAgICAgICBibG9ja1BhcmFtczogX3V0aWxzLmJsb2NrUGFyYW1zKFtjb250ZXh0XSwgW2RhdGEgJiYgZGF0YS5jb250ZXh0UGF0aF0pXG5cdCAgICAgIH0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcblx0ICAgIH1cblx0ICB9KTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAxOCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnMgPSByZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzO1xuXG5cdHZhciBfZGVjb3JhdG9yc0lubGluZSA9IF9fd2VicGFja19yZXF1aXJlX18oMTkpO1xuXG5cdHZhciBfZGVjb3JhdG9yc0lubGluZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWNvcmF0b3JzSW5saW5lKTtcblxuXHRmdW5jdGlvbiByZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzKGluc3RhbmNlKSB7XG5cdCAgX2RlY29yYXRvcnNJbmxpbmUyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHR9XG5cbi8qKiovIH0pLFxuLyogMTkgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckRlY29yYXRvcignaW5saW5lJywgZnVuY3Rpb24gKGZuLCBwcm9wcywgY29udGFpbmVyLCBvcHRpb25zKSB7XG5cdCAgICB2YXIgcmV0ID0gZm47XG5cdCAgICBpZiAoIXByb3BzLnBhcnRpYWxzKSB7XG5cdCAgICAgIHByb3BzLnBhcnRpYWxzID0ge307XG5cdCAgICAgIHJldCA9IGZ1bmN0aW9uIChjb250ZXh0LCBvcHRpb25zKSB7XG5cdCAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHBhcnRpYWxzIHN0YWNrIGZyYW1lIHByaW9yIHRvIGV4ZWMuXG5cdCAgICAgICAgdmFyIG9yaWdpbmFsID0gY29udGFpbmVyLnBhcnRpYWxzO1xuXHQgICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IF91dGlscy5leHRlbmQoe30sIG9yaWdpbmFsLCBwcm9wcy5wYXJ0aWFscyk7XG5cdCAgICAgICAgdmFyIHJldCA9IGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IG9yaWdpbmFsO1xuXHQgICAgICAgIHJldHVybiByZXQ7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cblx0ICAgIHByb3BzLnBhcnRpYWxzW29wdGlvbnMuYXJnc1swXV0gPSBvcHRpb25zLmZuO1xuXG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH0pO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDIwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIGxvZ2dlciA9IHtcblx0ICBtZXRob2RNYXA6IFsnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ10sXG5cdCAgbGV2ZWw6ICdpbmZvJyxcblxuXHQgIC8vIE1hcHMgYSBnaXZlbiBsZXZlbCB2YWx1ZSB0byB0aGUgYG1ldGhvZE1hcGAgaW5kZXhlcyBhYm92ZS5cblx0ICBsb29rdXBMZXZlbDogZnVuY3Rpb24gbG9va3VwTGV2ZWwobGV2ZWwpIHtcblx0ICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgIHZhciBsZXZlbE1hcCA9IF91dGlscy5pbmRleE9mKGxvZ2dlci5tZXRob2RNYXAsIGxldmVsLnRvTG93ZXJDYXNlKCkpO1xuXHQgICAgICBpZiAobGV2ZWxNYXAgPj0gMCkge1xuXHQgICAgICAgIGxldmVsID0gbGV2ZWxNYXA7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgbGV2ZWwgPSBwYXJzZUludChsZXZlbCwgMTApO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBsZXZlbDtcblx0ICB9LFxuXG5cdCAgLy8gQ2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcblx0ICBsb2c6IGZ1bmN0aW9uIGxvZyhsZXZlbCkge1xuXHQgICAgbGV2ZWwgPSBsb2dnZXIubG9va3VwTGV2ZWwobGV2ZWwpO1xuXG5cdCAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGxvZ2dlci5sb29rdXBMZXZlbChsb2dnZXIubGV2ZWwpIDw9IGxldmVsKSB7XG5cdCAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcblx0ICAgICAgaWYgKCFjb25zb2xlW21ldGhvZF0pIHtcblx0ICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcblx0ICAgICAgICBtZXRob2QgPSAnbG9nJztcblx0ICAgICAgfVxuXG5cdCAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBtZXNzYWdlID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgICAgIG1lc3NhZ2VbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuXHQgICAgICB9XG5cblx0ICAgICAgY29uc29sZVttZXRob2RdLmFwcGx5KGNvbnNvbGUsIG1lc3NhZ2UpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcblx0ICAgIH1cblx0ICB9XG5cdH07XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gbG9nZ2VyO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAyMSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8vIEJ1aWxkIG91dCBvdXIgYmFzaWMgU2FmZVN0cmluZyB0eXBlXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRmdW5jdGlvbiBTYWZlU3RyaW5nKHN0cmluZykge1xuXHQgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuXHR9XG5cblx0U2FmZVN0cmluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBTYWZlU3RyaW5nLnByb3RvdHlwZS50b0hUTUwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgcmV0dXJuICcnICsgdGhpcy5zdHJpbmc7XG5cdH07XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gU2FmZVN0cmluZztcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMjIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9PYmplY3Qkc2VhbCA9IF9fd2VicGFja19yZXF1aXJlX18oMjMpWydkZWZhdWx0J107XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKVsnZGVmYXVsdCddO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuY2hlY2tSZXZpc2lvbiA9IGNoZWNrUmV2aXNpb247XG5cdGV4cG9ydHMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcblx0ZXhwb3J0cy53cmFwUHJvZ3JhbSA9IHdyYXBQcm9ncmFtO1xuXHRleHBvcnRzLnJlc29sdmVQYXJ0aWFsID0gcmVzb2x2ZVBhcnRpYWw7XG5cdGV4cG9ydHMuaW52b2tlUGFydGlhbCA9IGludm9rZVBhcnRpYWw7XG5cdGV4cG9ydHMubm9vcCA9IG5vb3A7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIFV0aWxzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxzKTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHR2YXIgX2Jhc2UgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQpO1xuXG5cdGZ1bmN0aW9uIGNoZWNrUmV2aXNpb24oY29tcGlsZXJJbmZvKSB7XG5cdCAgdmFyIGNvbXBpbGVyUmV2aXNpb24gPSBjb21waWxlckluZm8gJiYgY29tcGlsZXJJbmZvWzBdIHx8IDEsXG5cdCAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IF9iYXNlLkNPTVBJTEVSX1JFVklTSU9OO1xuXG5cdCAgaWYgKGNvbXBpbGVyUmV2aXNpb24gIT09IGN1cnJlbnRSZXZpc2lvbikge1xuXHQgICAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBjdXJyZW50UmV2aXNpb24pIHtcblx0ICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IF9iYXNlLlJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcblx0ICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBfYmFzZS5SRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gJyArICdQbGVhc2UgdXBkYXRlIHlvdXIgcHJlY29tcGlsZXIgdG8gYSBuZXdlciB2ZXJzaW9uICgnICsgcnVudGltZVZlcnNpb25zICsgJykgb3IgZG93bmdyYWRlIHlvdXIgcnVudGltZSB0byBhbiBvbGRlciB2ZXJzaW9uICgnICsgY29tcGlsZXJWZXJzaW9ucyArICcpLicpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuICcgKyAnUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uICgnICsgY29tcGlsZXJJbmZvWzFdICsgJykuJyk7XG5cdCAgICB9XG5cdCAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcblx0ICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgIGlmICghZW52KSB7XG5cdCAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnTm8gZW52aXJvbm1lbnQgcGFzc2VkIHRvIHRlbXBsYXRlJyk7XG5cdCAgfVxuXHQgIGlmICghdGVtcGxhdGVTcGVjIHx8ICF0ZW1wbGF0ZVNwZWMubWFpbikge1xuXHQgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1Vua25vd24gdGVtcGxhdGUgb2JqZWN0OiAnICsgdHlwZW9mIHRlbXBsYXRlU3BlYyk7XG5cdCAgfVxuXG5cdCAgdGVtcGxhdGVTcGVjLm1haW4uZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjLm1haW5fZDtcblxuXHQgIC8vIE5vdGU6IFVzaW5nIGVudi5WTSByZWZlcmVuY2VzIHJhdGhlciB0aGFuIGxvY2FsIHZhciByZWZlcmVuY2VzIHRocm91Z2hvdXQgdGhpcyBzZWN0aW9uIHRvIGFsbG93XG5cdCAgLy8gZm9yIGV4dGVybmFsIHVzZXJzIHRvIG92ZXJyaWRlIHRoZXNlIGFzIHBzdWVkby1zdXBwb3J0ZWQgQVBJcy5cblx0ICBlbnYuVk0uY2hlY2tSZXZpc2lvbih0ZW1wbGF0ZVNwZWMuY29tcGlsZXIpO1xuXG5cdCAgZnVuY3Rpb24gaW52b2tlUGFydGlhbFdyYXBwZXIocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuXHQgICAgaWYgKG9wdGlvbnMuaGFzaCkge1xuXHQgICAgICBjb250ZXh0ID0gVXRpbHMuZXh0ZW5kKHt9LCBjb250ZXh0LCBvcHRpb25zLmhhc2gpO1xuXHQgICAgICBpZiAob3B0aW9ucy5pZHMpIHtcblx0ICAgICAgICBvcHRpb25zLmlkc1swXSA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcGFydGlhbCA9IGVudi5WTS5yZXNvbHZlUGFydGlhbC5jYWxsKHRoaXMsIHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgICAgdmFyIHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG5cblx0ICAgIGlmIChyZXN1bHQgPT0gbnVsbCAmJiBlbnYuY29tcGlsZSkge1xuXHQgICAgICBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0gPSBlbnYuY29tcGlsZShwYXJ0aWFsLCB0ZW1wbGF0ZVNwZWMuY29tcGlsZXJPcHRpb25zLCBlbnYpO1xuXHQgICAgICByZXN1bHQgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG5cdCAgICB9XG5cdCAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcblx0ICAgICAgaWYgKG9wdGlvbnMuaW5kZW50KSB7XG5cdCAgICAgICAgdmFyIGxpbmVzID0gcmVzdWx0LnNwbGl0KCdcXG4nKTtcblx0ICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICAgICAgaWYgKCFsaW5lc1tpXSAmJiBpICsgMSA9PT0gbCkge1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIH1cblxuXHQgICAgICAgICAgbGluZXNbaV0gPSBvcHRpb25zLmluZGVudCArIGxpbmVzW2ldO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXN1bHQgPSBsaW5lcy5qb2luKCdcXG4nKTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1RoZSBwYXJ0aWFsICcgKyBvcHRpb25zLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGUnKTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICAvLyBKdXN0IGFkZCB3YXRlclxuXHQgIHZhciBjb250YWluZXIgPSB7XG5cdCAgICBzdHJpY3Q6IGZ1bmN0aW9uIHN0cmljdChvYmosIG5hbWUpIHtcblx0ICAgICAgaWYgKCEobmFtZSBpbiBvYmopKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1wiJyArIG5hbWUgKyAnXCIgbm90IGRlZmluZWQgaW4gJyArIG9iaik7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG9ialtuYW1lXTtcblx0ICAgIH0sXG5cdCAgICBsb29rdXA6IGZ1bmN0aW9uIGxvb2t1cChkZXB0aHMsIG5hbWUpIHtcblx0ICAgICAgdmFyIGxlbiA9IGRlcHRocy5sZW5ndGg7XG5cdCAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgICBpZiAoZGVwdGhzW2ldICYmIGRlcHRoc1tpXVtuYW1lXSAhPSBudWxsKSB7XG5cdCAgICAgICAgICByZXR1cm4gZGVwdGhzW2ldW25hbWVdO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0ICAgIGxhbWJkYTogZnVuY3Rpb24gbGFtYmRhKGN1cnJlbnQsIGNvbnRleHQpIHtcblx0ICAgICAgcmV0dXJuIHR5cGVvZiBjdXJyZW50ID09PSAnZnVuY3Rpb24nID8gY3VycmVudC5jYWxsKGNvbnRleHQpIDogY3VycmVudDtcblx0ICAgIH0sXG5cblx0ICAgIGVzY2FwZUV4cHJlc3Npb246IFV0aWxzLmVzY2FwZUV4cHJlc3Npb24sXG5cdCAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcblxuXHQgICAgZm46IGZ1bmN0aW9uIGZuKGkpIHtcblx0ICAgICAgdmFyIHJldCA9IHRlbXBsYXRlU3BlY1tpXTtcblx0ICAgICAgcmV0LmRlY29yYXRvciA9IHRlbXBsYXRlU3BlY1tpICsgJ19kJ107XG5cdCAgICAgIHJldHVybiByZXQ7XG5cdCAgICB9LFxuXG5cdCAgICBwcm9ncmFtczogW10sXG5cdCAgICBwcm9ncmFtOiBmdW5jdGlvbiBwcm9ncmFtKGksIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcblx0ICAgICAgdmFyIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSxcblx0ICAgICAgICAgIGZuID0gdGhpcy5mbihpKTtcblx0ICAgICAgaWYgKGRhdGEgfHwgZGVwdGhzIHx8IGJsb2NrUGFyYW1zIHx8IGRlY2xhcmVkQmxvY2tQYXJhbXMpIHtcblx0ICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHdyYXBQcm9ncmFtKHRoaXMsIGksIGZuLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcblx0ICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcblx0ICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSB3cmFwUHJvZ3JhbSh0aGlzLCBpLCBmbik7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuXHQgICAgfSxcblxuXHQgICAgZGF0YTogZnVuY3Rpb24gZGF0YSh2YWx1ZSwgZGVwdGgpIHtcblx0ICAgICAgd2hpbGUgKHZhbHVlICYmIGRlcHRoLS0pIHtcblx0ICAgICAgICB2YWx1ZSA9IHZhbHVlLl9wYXJlbnQ7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHZhbHVlO1xuXHQgICAgfSxcblx0ICAgIG1lcmdlOiBmdW5jdGlvbiBtZXJnZShwYXJhbSwgY29tbW9uKSB7XG5cdCAgICAgIHZhciBvYmogPSBwYXJhbSB8fCBjb21tb247XG5cblx0ICAgICAgaWYgKHBhcmFtICYmIGNvbW1vbiAmJiBwYXJhbSAhPT0gY29tbW9uKSB7XG5cdCAgICAgICAgb2JqID0gVXRpbHMuZXh0ZW5kKHt9LCBjb21tb24sIHBhcmFtKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBvYmo7XG5cdCAgICB9LFxuXHQgICAgLy8gQW4gZW1wdHkgb2JqZWN0IHRvIHVzZSBhcyByZXBsYWNlbWVudCBmb3IgbnVsbC1jb250ZXh0c1xuXHQgICAgbnVsbENvbnRleHQ6IF9PYmplY3Qkc2VhbCh7fSksXG5cblx0ICAgIG5vb3A6IGVudi5WTS5ub29wLFxuXHQgICAgY29tcGlsZXJJbmZvOiB0ZW1wbGF0ZVNwZWMuY29tcGlsZXJcblx0ICB9O1xuXG5cdCAgZnVuY3Rpb24gcmV0KGNvbnRleHQpIHtcblx0ICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cblx0ICAgIHZhciBkYXRhID0gb3B0aW9ucy5kYXRhO1xuXG5cdCAgICByZXQuX3NldHVwKG9wdGlvbnMpO1xuXHQgICAgaWYgKCFvcHRpb25zLnBhcnRpYWwgJiYgdGVtcGxhdGVTcGVjLnVzZURhdGEpIHtcblx0ICAgICAgZGF0YSA9IGluaXREYXRhKGNvbnRleHQsIGRhdGEpO1xuXHQgICAgfVxuXHQgICAgdmFyIGRlcHRocyA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBibG9ja1BhcmFtcyA9IHRlbXBsYXRlU3BlYy51c2VCbG9ja1BhcmFtcyA/IFtdIDogdW5kZWZpbmVkO1xuXHQgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VEZXB0aHMpIHtcblx0ICAgICAgaWYgKG9wdGlvbnMuZGVwdGhzKSB7XG5cdCAgICAgICAgZGVwdGhzID0gY29udGV4dCAhPSBvcHRpb25zLmRlcHRoc1swXSA/IFtjb250ZXh0XS5jb25jYXQob3B0aW9ucy5kZXB0aHMpIDogb3B0aW9ucy5kZXB0aHM7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgZGVwdGhzID0gW2NvbnRleHRdO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIG1haW4oY29udGV4dCAvKiwgb3B0aW9ucyovKSB7XG5cdCAgICAgIHJldHVybiAnJyArIHRlbXBsYXRlU3BlYy5tYWluKGNvbnRhaW5lciwgY29udGV4dCwgY29udGFpbmVyLmhlbHBlcnMsIGNvbnRhaW5lci5wYXJ0aWFscywgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG5cdCAgICB9XG5cdCAgICBtYWluID0gZXhlY3V0ZURlY29yYXRvcnModGVtcGxhdGVTcGVjLm1haW4sIG1haW4sIGNvbnRhaW5lciwgb3B0aW9ucy5kZXB0aHMgfHwgW10sIGRhdGEsIGJsb2NrUGFyYW1zKTtcblx0ICAgIHJldHVybiBtYWluKGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgIH1cblx0ICByZXQuaXNUb3AgPSB0cnVlO1xuXG5cdCAgcmV0Ll9zZXR1cCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdCAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuXHQgICAgICBjb250YWluZXIuaGVscGVycyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLmhlbHBlcnMsIGVudi5oZWxwZXJzKTtcblxuXHQgICAgICBpZiAodGVtcGxhdGVTcGVjLnVzZVBhcnRpYWwpIHtcblx0ICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBjb250YWluZXIubWVyZ2Uob3B0aW9ucy5wYXJ0aWFscywgZW52LnBhcnRpYWxzKTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAodGVtcGxhdGVTcGVjLnVzZVBhcnRpYWwgfHwgdGVtcGxhdGVTcGVjLnVzZURlY29yYXRvcnMpIHtcblx0ICAgICAgICBjb250YWluZXIuZGVjb3JhdG9ycyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLmRlY29yYXRvcnMsIGVudi5kZWNvcmF0b3JzKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgY29udGFpbmVyLmhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG5cdCAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG5cdCAgICAgIGNvbnRhaW5lci5kZWNvcmF0b3JzID0gb3B0aW9ucy5kZWNvcmF0b3JzO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICByZXQuX2NoaWxkID0gZnVuY3Rpb24gKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcblx0ICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgJiYgIWJsb2NrUGFyYW1zKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdtdXN0IHBhc3MgYmxvY2sgcGFyYW1zJyk7XG5cdCAgICB9XG5cdCAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocyAmJiAhZGVwdGhzKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdtdXN0IHBhc3MgcGFyZW50IGRlcHRocycpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gd3JhcFByb2dyYW0oY29udGFpbmVyLCBpLCB0ZW1wbGF0ZVNwZWNbaV0sIGRhdGEsIDAsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuXHQgIH07XG5cdCAgcmV0dXJuIHJldDtcblx0fVxuXG5cdGZ1bmN0aW9uIHdyYXBQcm9ncmFtKGNvbnRhaW5lciwgaSwgZm4sIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcblx0ICBmdW5jdGlvbiBwcm9nKGNvbnRleHQpIHtcblx0ICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cblx0ICAgIHZhciBjdXJyZW50RGVwdGhzID0gZGVwdGhzO1xuXHQgICAgaWYgKGRlcHRocyAmJiBjb250ZXh0ICE9IGRlcHRoc1swXSAmJiAhKGNvbnRleHQgPT09IGNvbnRhaW5lci5udWxsQ29udGV4dCAmJiBkZXB0aHNbMF0gPT09IG51bGwpKSB7XG5cdCAgICAgIGN1cnJlbnREZXB0aHMgPSBbY29udGV4dF0uY29uY2F0KGRlcHRocyk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBmbihjb250YWluZXIsIGNvbnRleHQsIGNvbnRhaW5lci5oZWxwZXJzLCBjb250YWluZXIucGFydGlhbHMsIG9wdGlvbnMuZGF0YSB8fCBkYXRhLCBibG9ja1BhcmFtcyAmJiBbb3B0aW9ucy5ibG9ja1BhcmFtc10uY29uY2F0KGJsb2NrUGFyYW1zKSwgY3VycmVudERlcHRocyk7XG5cdCAgfVxuXG5cdCAgcHJvZyA9IGV4ZWN1dGVEZWNvcmF0b3JzKGZuLCBwcm9nLCBjb250YWluZXIsIGRlcHRocywgZGF0YSwgYmxvY2tQYXJhbXMpO1xuXG5cdCAgcHJvZy5wcm9ncmFtID0gaTtcblx0ICBwcm9nLmRlcHRoID0gZGVwdGhzID8gZGVwdGhzLmxlbmd0aCA6IDA7XG5cdCAgcHJvZy5ibG9ja1BhcmFtcyA9IGRlY2xhcmVkQmxvY2tQYXJhbXMgfHwgMDtcblx0ICByZXR1cm4gcHJvZztcblx0fVxuXG5cdGZ1bmN0aW9uIHJlc29sdmVQYXJ0aWFsKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcblx0ICBpZiAoIXBhcnRpYWwpIHtcblx0ICAgIGlmIChvcHRpb25zLm5hbWUgPT09ICdAcGFydGlhbC1ibG9jaycpIHtcblx0ICAgICAgcGFydGlhbCA9IG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcGFydGlhbCA9IG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXTtcblx0ICAgIH1cblx0ICB9IGVsc2UgaWYgKCFwYXJ0aWFsLmNhbGwgJiYgIW9wdGlvbnMubmFtZSkge1xuXHQgICAgLy8gVGhpcyBpcyBhIGR5bmFtaWMgcGFydGlhbCB0aGF0IHJldHVybmVkIGEgc3RyaW5nXG5cdCAgICBvcHRpb25zLm5hbWUgPSBwYXJ0aWFsO1xuXHQgICAgcGFydGlhbCA9IG9wdGlvbnMucGFydGlhbHNbcGFydGlhbF07XG5cdCAgfVxuXHQgIHJldHVybiBwYXJ0aWFsO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG5cdCAgLy8gVXNlIHRoZSBjdXJyZW50IGNsb3N1cmUgY29udGV4dCB0byBzYXZlIHRoZSBwYXJ0aWFsLWJsb2NrIGlmIHRoaXMgcGFydGlhbFxuXHQgIHZhciBjdXJyZW50UGFydGlhbEJsb2NrID0gb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddO1xuXHQgIG9wdGlvbnMucGFydGlhbCA9IHRydWU7XG5cdCAgaWYgKG9wdGlvbnMuaWRzKSB7XG5cdCAgICBvcHRpb25zLmRhdGEuY29udGV4dFBhdGggPSBvcHRpb25zLmlkc1swXSB8fCBvcHRpb25zLmRhdGEuY29udGV4dFBhdGg7XG5cdCAgfVxuXG5cdCAgdmFyIHBhcnRpYWxCbG9jayA9IHVuZGVmaW5lZDtcblx0ICBpZiAob3B0aW9ucy5mbiAmJiBvcHRpb25zLmZuICE9PSBub29wKSB7XG5cdCAgICAoZnVuY3Rpb24gKCkge1xuXHQgICAgICBvcHRpb25zLmRhdGEgPSBfYmFzZS5jcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuXHQgICAgICAvLyBXcmFwcGVyIGZ1bmN0aW9uIHRvIGdldCBhY2Nlc3MgdG8gY3VycmVudFBhcnRpYWxCbG9jayBmcm9tIHRoZSBjbG9zdXJlXG5cdCAgICAgIHZhciBmbiA9IG9wdGlvbnMuZm47XG5cdCAgICAgIHBhcnRpYWxCbG9jayA9IG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddID0gZnVuY3Rpb24gcGFydGlhbEJsb2NrV3JhcHBlcihjb250ZXh0KSB7XG5cdCAgICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuXHQgICAgICAgIC8vIFJlc3RvcmUgdGhlIHBhcnRpYWwtYmxvY2sgZnJvbSB0aGUgY2xvc3VyZSBmb3IgdGhlIGV4ZWN1dGlvbiBvZiB0aGUgYmxvY2tcblx0ICAgICAgICAvLyBpLmUuIHRoZSBwYXJ0IGluc2lkZSB0aGUgYmxvY2sgb2YgdGhlIHBhcnRpYWwgY2FsbC5cblx0ICAgICAgICBvcHRpb25zLmRhdGEgPSBfYmFzZS5jcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuXHQgICAgICAgIG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddID0gY3VycmVudFBhcnRpYWxCbG9jaztcblx0ICAgICAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucyk7XG5cdCAgICAgIH07XG5cdCAgICAgIGlmIChmbi5wYXJ0aWFscykge1xuXHQgICAgICAgIG9wdGlvbnMucGFydGlhbHMgPSBVdGlscy5leHRlbmQoe30sIG9wdGlvbnMucGFydGlhbHMsIGZuLnBhcnRpYWxzKTtcblx0ICAgICAgfVxuXHQgICAgfSkoKTtcblx0ICB9XG5cblx0ICBpZiAocGFydGlhbCA9PT0gdW5kZWZpbmVkICYmIHBhcnRpYWxCbG9jaykge1xuXHQgICAgcGFydGlhbCA9IHBhcnRpYWxCbG9jaztcblx0ICB9XG5cblx0ICBpZiAocGFydGlhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVGhlIHBhcnRpYWwgJyArIG9wdGlvbnMubmFtZSArICcgY291bGQgbm90IGJlIGZvdW5kJyk7XG5cdCAgfSBlbHNlIGlmIChwYXJ0aWFsIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcblx0ICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIG5vb3AoKSB7XG5cdCAgcmV0dXJuICcnO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdERhdGEoY29udGV4dCwgZGF0YSkge1xuXHQgIGlmICghZGF0YSB8fCAhKCdyb290JyBpbiBkYXRhKSkge1xuXHQgICAgZGF0YSA9IGRhdGEgPyBfYmFzZS5jcmVhdGVGcmFtZShkYXRhKSA6IHt9O1xuXHQgICAgZGF0YS5yb290ID0gY29udGV4dDtcblx0ICB9XG5cdCAgcmV0dXJuIGRhdGE7XG5cdH1cblxuXHRmdW5jdGlvbiBleGVjdXRlRGVjb3JhdG9ycyhmbiwgcHJvZywgY29udGFpbmVyLCBkZXB0aHMsIGRhdGEsIGJsb2NrUGFyYW1zKSB7XG5cdCAgaWYgKGZuLmRlY29yYXRvcikge1xuXHQgICAgdmFyIHByb3BzID0ge307XG5cdCAgICBwcm9nID0gZm4uZGVjb3JhdG9yKHByb2csIHByb3BzLCBjb250YWluZXIsIGRlcHRocyAmJiBkZXB0aHNbMF0sIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuXHQgICAgVXRpbHMuZXh0ZW5kKHByb2csIHByb3BzKTtcblx0ICB9XG5cdCAgcmV0dXJuIHByb2c7XG5cdH1cblxuLyoqKi8gfSksXG4vKiAyMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogX193ZWJwYWNrX3JlcXVpcmVfXygyNCksIF9fZXNNb2R1bGU6IHRydWUgfTtcblxuLyoqKi8gfSksXG4vKiAyNCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdF9fd2VicGFja19yZXF1aXJlX18oMjUpO1xuXHRtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19yZXF1aXJlX18oMzApLk9iamVjdC5zZWFsO1xuXG4vKioqLyB9KSxcbi8qIDI1ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0Ly8gMTkuMS4yLjE3IE9iamVjdC5zZWFsKE8pXG5cdHZhciBpc09iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMjYpO1xuXG5cdF9fd2VicGFja19yZXF1aXJlX18oMjcpKCdzZWFsJywgZnVuY3Rpb24oJHNlYWwpe1xuXHQgIHJldHVybiBmdW5jdGlvbiBzZWFsKGl0KXtcblx0ICAgIHJldHVybiAkc2VhbCAmJiBpc09iamVjdChpdCkgPyAkc2VhbChpdCkgOiBpdDtcblx0ICB9O1xuXHR9KTtcblxuLyoqKi8gfSksXG4vKiAyNiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuXHQgIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG5cdH07XG5cbi8qKiovIH0pLFxuLyogMjcgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcblx0dmFyICRleHBvcnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDI4KVxuXHQgICwgY29yZSAgICA9IF9fd2VicGFja19yZXF1aXJlX18oMzApXG5cdCAgLCBmYWlscyAgID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMyk7XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZLCBleGVjKXtcblx0ICB2YXIgZm4gID0gKGNvcmUuT2JqZWN0IHx8IHt9KVtLRVldIHx8IE9iamVjdFtLRVldXG5cdCAgICAsIGV4cCA9IHt9O1xuXHQgIGV4cFtLRVldID0gZXhlYyhmbik7XG5cdCAgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbigpeyBmbigxKTsgfSksICdPYmplY3QnLCBleHApO1xuXHR9O1xuXG4vKioqLyB9KSxcbi8qIDI4ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGdsb2JhbCAgICA9IF9fd2VicGFja19yZXF1aXJlX18oMjkpXG5cdCAgLCBjb3JlICAgICAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMwKVxuXHQgICwgY3R4ICAgICAgID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMSlcblx0ICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG5cdHZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcblx0ICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuXHQgICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG5cdCAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcblx0ICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuXHQgICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG5cdCAgICAsIElTX1dSQVAgICA9IHR5cGUgJiAkZXhwb3J0Lldcblx0ICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcblx0ICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuXHQgICAgLCBrZXksIG93biwgb3V0O1xuXHQgIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuXHQgIGZvcihrZXkgaW4gc291cmNlKXtcblx0ICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuXHQgICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYga2V5IGluIHRhcmdldDtcblx0ICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcblx0ICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG5cdCAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuXHQgICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG5cdCAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuXHQgICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcblx0ICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG5cdCAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuXHQgICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbihDKXtcblx0ICAgICAgdmFyIEYgPSBmdW5jdGlvbihwYXJhbSl7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBDID8gbmV3IEMocGFyYW0pIDogQyhwYXJhbSk7XG5cdCAgICAgIH07XG5cdCAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcblx0ICAgICAgcmV0dXJuIEY7XG5cdCAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcblx0ICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcblx0ICAgIGlmKElTX1BST1RPKShleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KSlba2V5XSA9IG91dDtcblx0ICB9XG5cdH07XG5cdC8vIHR5cGUgYml0bWFwXG5cdCRleHBvcnQuRiA9IDE7ICAvLyBmb3JjZWRcblx0JGV4cG9ydC5HID0gMjsgIC8vIGdsb2JhbFxuXHQkZXhwb3J0LlMgPSA0OyAgLy8gc3RhdGljXG5cdCRleHBvcnQuUCA9IDg7ICAvLyBwcm90b1xuXHQkZXhwb3J0LkIgPSAxNjsgLy8gYmluZFxuXHQkZXhwb3J0LlcgPSAzMjsgLy8gd3JhcFxuXHRtb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG5cbi8qKiovIH0pLFxuLyogMjkgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxuXHR2YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcblx0ICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdGlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG5cbi8qKiovIH0pLFxuLyogMzAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHR2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcxLjIuNid9O1xuXHRpZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcblxuLyoqKi8gfSksXG4vKiAzMSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xuXHR2YXIgYUZ1bmN0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMik7XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG5cdCAgYUZ1bmN0aW9uKGZuKTtcblx0ICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuXHQgIHN3aXRjaChsZW5ndGgpe1xuXHQgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG5cdCAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuXHQgICAgfTtcblx0ICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuXHQgICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcblx0ICAgIH07XG5cdCAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcblx0ICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG5cdCAgICB9O1xuXHQgIH1cblx0ICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG5cdCAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcblx0ICB9O1xuXHR9O1xuXG4vKioqLyB9KSxcbi8qIDMyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG5cdCAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcblx0ICByZXR1cm4gaXQ7XG5cdH07XG5cbi8qKiovIH0pLFxuLyogMzMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuXHQgIHRyeSB7XG5cdCAgICByZXR1cm4gISFleGVjKCk7XG5cdCAgfSBjYXRjaChlKXtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblx0fTtcblxuLyoqKi8gfSksXG4vKiAzNCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihnbG9iYWwpIHsvKiBnbG9iYWwgd2luZG93ICovXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChIYW5kbGViYXJzKSB7XG5cdCAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICB2YXIgcm9vdCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93LFxuXHQgICAgICAkSGFuZGxlYmFycyA9IHJvb3QuSGFuZGxlYmFycztcblx0ICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgIEhhbmRsZWJhcnMubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIGlmIChyb290LkhhbmRsZWJhcnMgPT09IEhhbmRsZWJhcnMpIHtcblx0ICAgICAgcm9vdC5IYW5kbGViYXJzID0gJEhhbmRsZWJhcnM7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gSGFuZGxlYmFycztcblx0ICB9O1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSgpKSkpXG5cbi8qKiovIH0pLFxuLyogMzUgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0dmFyIEFTVCA9IHtcblx0ICAvLyBQdWJsaWMgQVBJIHVzZWQgdG8gZXZhbHVhdGUgZGVyaXZlZCBhdHRyaWJ1dGVzIHJlZ2FyZGluZyBBU1Qgbm9kZXNcblx0ICBoZWxwZXJzOiB7XG5cdCAgICAvLyBhIG11c3RhY2hlIGlzIGRlZmluaXRlbHkgYSBoZWxwZXIgaWY6XG5cdCAgICAvLyAqIGl0IGlzIGFuIGVsaWdpYmxlIGhlbHBlciwgYW5kXG5cdCAgICAvLyAqIGl0IGhhcyBhdCBsZWFzdCBvbmUgcGFyYW1ldGVyIG9yIGhhc2ggc2VnbWVudFxuXHQgICAgaGVscGVyRXhwcmVzc2lvbjogZnVuY3Rpb24gaGVscGVyRXhwcmVzc2lvbihub2RlKSB7XG5cdCAgICAgIHJldHVybiBub2RlLnR5cGUgPT09ICdTdWJFeHByZXNzaW9uJyB8fCAobm9kZS50eXBlID09PSAnTXVzdGFjaGVTdGF0ZW1lbnQnIHx8IG5vZGUudHlwZSA9PT0gJ0Jsb2NrU3RhdGVtZW50JykgJiYgISEobm9kZS5wYXJhbXMgJiYgbm9kZS5wYXJhbXMubGVuZ3RoIHx8IG5vZGUuaGFzaCk7XG5cdCAgICB9LFxuXG5cdCAgICBzY29wZWRJZDogZnVuY3Rpb24gc2NvcGVkSWQocGF0aCkge1xuXHQgICAgICByZXR1cm4gKC9eXFwufHRoaXNcXGIvLnRlc3QocGF0aC5vcmlnaW5hbClcblx0ICAgICAgKTtcblx0ICAgIH0sXG5cblx0ICAgIC8vIGFuIElEIGlzIHNpbXBsZSBpZiBpdCBvbmx5IGhhcyBvbmUgcGFydCwgYW5kIHRoYXQgcGFydCBpcyBub3Rcblx0ICAgIC8vIGAuLmAgb3IgYHRoaXNgLlxuXHQgICAgc2ltcGxlSWQ6IGZ1bmN0aW9uIHNpbXBsZUlkKHBhdGgpIHtcblx0ICAgICAgcmV0dXJuIHBhdGgucGFydHMubGVuZ3RoID09PSAxICYmICFBU1QuaGVscGVycy5zY29wZWRJZChwYXRoKSAmJiAhcGF0aC5kZXB0aDtcblx0ICAgIH1cblx0ICB9XG5cdH07XG5cblx0Ly8gTXVzdCBiZSBleHBvcnRlZCBhcyBhbiBvYmplY3QgcmF0aGVyIHRoYW4gdGhlIHJvb3Qgb2YgdGhlIG1vZHVsZSBhcyB0aGUgamlzb24gbGV4ZXJcblx0Ly8gbXVzdCBtb2RpZnkgdGhlIG9iamVjdCB0byBvcGVyYXRlIHByb3Blcmx5LlxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBBU1Q7XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDM2ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IF9fd2VicGFja19yZXF1aXJlX18oMylbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnBhcnNlID0gcGFyc2U7XG5cblx0dmFyIF9wYXJzZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM3KTtcblxuXHR2YXIgX3BhcnNlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wYXJzZXIpO1xuXG5cdHZhciBfd2hpdGVzcGFjZUNvbnRyb2wgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM4KTtcblxuXHR2YXIgX3doaXRlc3BhY2VDb250cm9sMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3doaXRlc3BhY2VDb250cm9sKTtcblxuXHR2YXIgX2hlbHBlcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQwKTtcblxuXHR2YXIgSGVscGVycyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9oZWxwZXJzKTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHRleHBvcnRzLnBhcnNlciA9IF9wYXJzZXIyWydkZWZhdWx0J107XG5cblx0dmFyIHl5ID0ge307XG5cdF91dGlscy5leHRlbmQoeXksIEhlbHBlcnMpO1xuXG5cdGZ1bmN0aW9uIHBhcnNlKGlucHV0LCBvcHRpb25zKSB7XG5cdCAgLy8gSnVzdCByZXR1cm4gaWYgYW4gYWxyZWFkeS1jb21waWxlZCBBU1Qgd2FzIHBhc3NlZCBpbi5cblx0ICBpZiAoaW5wdXQudHlwZSA9PT0gJ1Byb2dyYW0nKSB7XG5cdCAgICByZXR1cm4gaW5wdXQ7XG5cdCAgfVxuXG5cdCAgX3BhcnNlcjJbJ2RlZmF1bHQnXS55eSA9IHl5O1xuXG5cdCAgLy8gQWx0ZXJpbmcgdGhlIHNoYXJlZCBvYmplY3QgaGVyZSwgYnV0IHRoaXMgaXMgb2sgYXMgcGFyc2VyIGlzIGEgc3luYyBvcGVyYXRpb25cblx0ICB5eS5sb2NJbmZvID0gZnVuY3Rpb24gKGxvY0luZm8pIHtcblx0ICAgIHJldHVybiBuZXcgeXkuU291cmNlTG9jYXRpb24ob3B0aW9ucyAmJiBvcHRpb25zLnNyY05hbWUsIGxvY0luZm8pO1xuXHQgIH07XG5cblx0ICB2YXIgc3RyaXAgPSBuZXcgX3doaXRlc3BhY2VDb250cm9sMlsnZGVmYXVsdCddKG9wdGlvbnMpO1xuXHQgIHJldHVybiBzdHJpcC5hY2NlcHQoX3BhcnNlcjJbJ2RlZmF1bHQnXS5wYXJzZShpbnB1dCkpO1xuXHR9XG5cbi8qKiovIH0pLFxuLyogMzcgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvLyBGaWxlIGlnbm9yZWQgaW4gY292ZXJhZ2UgdGVzdHMgdmlhIHNldHRpbmcgaW4gLmlzdGFuYnVsLnltbFxuXHQvKiBKaXNvbiBnZW5lcmF0ZWQgcGFyc2VyICovXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdHZhciBoYW5kbGViYXJzID0gKGZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciBwYXJzZXIgPSB7IHRyYWNlOiBmdW5jdGlvbiB0cmFjZSgpIHt9LFxuXHQgICAgICAgIHl5OiB7fSxcblx0ICAgICAgICBzeW1ib2xzXzogeyBcImVycm9yXCI6IDIsIFwicm9vdFwiOiAzLCBcInByb2dyYW1cIjogNCwgXCJFT0ZcIjogNSwgXCJwcm9ncmFtX3JlcGV0aXRpb24wXCI6IDYsIFwic3RhdGVtZW50XCI6IDcsIFwibXVzdGFjaGVcIjogOCwgXCJibG9ja1wiOiA5LCBcInJhd0Jsb2NrXCI6IDEwLCBcInBhcnRpYWxcIjogMTEsIFwicGFydGlhbEJsb2NrXCI6IDEyLCBcImNvbnRlbnRcIjogMTMsIFwiQ09NTUVOVFwiOiAxNCwgXCJDT05URU5UXCI6IDE1LCBcIm9wZW5SYXdCbG9ja1wiOiAxNiwgXCJyYXdCbG9ja19yZXBldGl0aW9uX3BsdXMwXCI6IDE3LCBcIkVORF9SQVdfQkxPQ0tcIjogMTgsIFwiT1BFTl9SQVdfQkxPQ0tcIjogMTksIFwiaGVscGVyTmFtZVwiOiAyMCwgXCJvcGVuUmF3QmxvY2tfcmVwZXRpdGlvbjBcIjogMjEsIFwib3BlblJhd0Jsb2NrX29wdGlvbjBcIjogMjIsIFwiQ0xPU0VfUkFXX0JMT0NLXCI6IDIzLCBcIm9wZW5CbG9ja1wiOiAyNCwgXCJibG9ja19vcHRpb24wXCI6IDI1LCBcImNsb3NlQmxvY2tcIjogMjYsIFwib3BlbkludmVyc2VcIjogMjcsIFwiYmxvY2tfb3B0aW9uMVwiOiAyOCwgXCJPUEVOX0JMT0NLXCI6IDI5LCBcIm9wZW5CbG9ja19yZXBldGl0aW9uMFwiOiAzMCwgXCJvcGVuQmxvY2tfb3B0aW9uMFwiOiAzMSwgXCJvcGVuQmxvY2tfb3B0aW9uMVwiOiAzMiwgXCJDTE9TRVwiOiAzMywgXCJPUEVOX0lOVkVSU0VcIjogMzQsIFwib3BlbkludmVyc2VfcmVwZXRpdGlvbjBcIjogMzUsIFwib3BlbkludmVyc2Vfb3B0aW9uMFwiOiAzNiwgXCJvcGVuSW52ZXJzZV9vcHRpb24xXCI6IDM3LCBcIm9wZW5JbnZlcnNlQ2hhaW5cIjogMzgsIFwiT1BFTl9JTlZFUlNFX0NIQUlOXCI6IDM5LCBcIm9wZW5JbnZlcnNlQ2hhaW5fcmVwZXRpdGlvbjBcIjogNDAsIFwib3BlbkludmVyc2VDaGFpbl9vcHRpb24wXCI6IDQxLCBcIm9wZW5JbnZlcnNlQ2hhaW5fb3B0aW9uMVwiOiA0MiwgXCJpbnZlcnNlQW5kUHJvZ3JhbVwiOiA0MywgXCJJTlZFUlNFXCI6IDQ0LCBcImludmVyc2VDaGFpblwiOiA0NSwgXCJpbnZlcnNlQ2hhaW5fb3B0aW9uMFwiOiA0NiwgXCJPUEVOX0VOREJMT0NLXCI6IDQ3LCBcIk9QRU5cIjogNDgsIFwibXVzdGFjaGVfcmVwZXRpdGlvbjBcIjogNDksIFwibXVzdGFjaGVfb3B0aW9uMFwiOiA1MCwgXCJPUEVOX1VORVNDQVBFRFwiOiA1MSwgXCJtdXN0YWNoZV9yZXBldGl0aW9uMVwiOiA1MiwgXCJtdXN0YWNoZV9vcHRpb24xXCI6IDUzLCBcIkNMT1NFX1VORVNDQVBFRFwiOiA1NCwgXCJPUEVOX1BBUlRJQUxcIjogNTUsIFwicGFydGlhbE5hbWVcIjogNTYsIFwicGFydGlhbF9yZXBldGl0aW9uMFwiOiA1NywgXCJwYXJ0aWFsX29wdGlvbjBcIjogNTgsIFwib3BlblBhcnRpYWxCbG9ja1wiOiA1OSwgXCJPUEVOX1BBUlRJQUxfQkxPQ0tcIjogNjAsIFwib3BlblBhcnRpYWxCbG9ja19yZXBldGl0aW9uMFwiOiA2MSwgXCJvcGVuUGFydGlhbEJsb2NrX29wdGlvbjBcIjogNjIsIFwicGFyYW1cIjogNjMsIFwic2V4cHJcIjogNjQsIFwiT1BFTl9TRVhQUlwiOiA2NSwgXCJzZXhwcl9yZXBldGl0aW9uMFwiOiA2NiwgXCJzZXhwcl9vcHRpb24wXCI6IDY3LCBcIkNMT1NFX1NFWFBSXCI6IDY4LCBcImhhc2hcIjogNjksIFwiaGFzaF9yZXBldGl0aW9uX3BsdXMwXCI6IDcwLCBcImhhc2hTZWdtZW50XCI6IDcxLCBcIklEXCI6IDcyLCBcIkVRVUFMU1wiOiA3MywgXCJibG9ja1BhcmFtc1wiOiA3NCwgXCJPUEVOX0JMT0NLX1BBUkFNU1wiOiA3NSwgXCJibG9ja1BhcmFtc19yZXBldGl0aW9uX3BsdXMwXCI6IDc2LCBcIkNMT1NFX0JMT0NLX1BBUkFNU1wiOiA3NywgXCJwYXRoXCI6IDc4LCBcImRhdGFOYW1lXCI6IDc5LCBcIlNUUklOR1wiOiA4MCwgXCJOVU1CRVJcIjogODEsIFwiQk9PTEVBTlwiOiA4MiwgXCJVTkRFRklORURcIjogODMsIFwiTlVMTFwiOiA4NCwgXCJEQVRBXCI6IDg1LCBcInBhdGhTZWdtZW50c1wiOiA4NiwgXCJTRVBcIjogODcsIFwiJGFjY2VwdFwiOiAwLCBcIiRlbmRcIjogMSB9LFxuXHQgICAgICAgIHRlcm1pbmFsc186IHsgMjogXCJlcnJvclwiLCA1OiBcIkVPRlwiLCAxNDogXCJDT01NRU5UXCIsIDE1OiBcIkNPTlRFTlRcIiwgMTg6IFwiRU5EX1JBV19CTE9DS1wiLCAxOTogXCJPUEVOX1JBV19CTE9DS1wiLCAyMzogXCJDTE9TRV9SQVdfQkxPQ0tcIiwgMjk6IFwiT1BFTl9CTE9DS1wiLCAzMzogXCJDTE9TRVwiLCAzNDogXCJPUEVOX0lOVkVSU0VcIiwgMzk6IFwiT1BFTl9JTlZFUlNFX0NIQUlOXCIsIDQ0OiBcIklOVkVSU0VcIiwgNDc6IFwiT1BFTl9FTkRCTE9DS1wiLCA0ODogXCJPUEVOXCIsIDUxOiBcIk9QRU5fVU5FU0NBUEVEXCIsIDU0OiBcIkNMT1NFX1VORVNDQVBFRFwiLCA1NTogXCJPUEVOX1BBUlRJQUxcIiwgNjA6IFwiT1BFTl9QQVJUSUFMX0JMT0NLXCIsIDY1OiBcIk9QRU5fU0VYUFJcIiwgNjg6IFwiQ0xPU0VfU0VYUFJcIiwgNzI6IFwiSURcIiwgNzM6IFwiRVFVQUxTXCIsIDc1OiBcIk9QRU5fQkxPQ0tfUEFSQU1TXCIsIDc3OiBcIkNMT1NFX0JMT0NLX1BBUkFNU1wiLCA4MDogXCJTVFJJTkdcIiwgODE6IFwiTlVNQkVSXCIsIDgyOiBcIkJPT0xFQU5cIiwgODM6IFwiVU5ERUZJTkVEXCIsIDg0OiBcIk5VTExcIiwgODU6IFwiREFUQVwiLCA4NzogXCJTRVBcIiB9LFxuXHQgICAgICAgIHByb2R1Y3Rpb25zXzogWzAsIFszLCAyXSwgWzQsIDFdLCBbNywgMV0sIFs3LCAxXSwgWzcsIDFdLCBbNywgMV0sIFs3LCAxXSwgWzcsIDFdLCBbNywgMV0sIFsxMywgMV0sIFsxMCwgM10sIFsxNiwgNV0sIFs5LCA0XSwgWzksIDRdLCBbMjQsIDZdLCBbMjcsIDZdLCBbMzgsIDZdLCBbNDMsIDJdLCBbNDUsIDNdLCBbNDUsIDFdLCBbMjYsIDNdLCBbOCwgNV0sIFs4LCA1XSwgWzExLCA1XSwgWzEyLCAzXSwgWzU5LCA1XSwgWzYzLCAxXSwgWzYzLCAxXSwgWzY0LCA1XSwgWzY5LCAxXSwgWzcxLCAzXSwgWzc0LCAzXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzU2LCAxXSwgWzU2LCAxXSwgWzc5LCAyXSwgWzc4LCAxXSwgWzg2LCAzXSwgWzg2LCAxXSwgWzYsIDBdLCBbNiwgMl0sIFsxNywgMV0sIFsxNywgMl0sIFsyMSwgMF0sIFsyMSwgMl0sIFsyMiwgMF0sIFsyMiwgMV0sIFsyNSwgMF0sIFsyNSwgMV0sIFsyOCwgMF0sIFsyOCwgMV0sIFszMCwgMF0sIFszMCwgMl0sIFszMSwgMF0sIFszMSwgMV0sIFszMiwgMF0sIFszMiwgMV0sIFszNSwgMF0sIFszNSwgMl0sIFszNiwgMF0sIFszNiwgMV0sIFszNywgMF0sIFszNywgMV0sIFs0MCwgMF0sIFs0MCwgMl0sIFs0MSwgMF0sIFs0MSwgMV0sIFs0MiwgMF0sIFs0MiwgMV0sIFs0NiwgMF0sIFs0NiwgMV0sIFs0OSwgMF0sIFs0OSwgMl0sIFs1MCwgMF0sIFs1MCwgMV0sIFs1MiwgMF0sIFs1MiwgMl0sIFs1MywgMF0sIFs1MywgMV0sIFs1NywgMF0sIFs1NywgMl0sIFs1OCwgMF0sIFs1OCwgMV0sIFs2MSwgMF0sIFs2MSwgMl0sIFs2MiwgMF0sIFs2MiwgMV0sIFs2NiwgMF0sIFs2NiwgMl0sIFs2NywgMF0sIFs2NywgMV0sIFs3MCwgMV0sIFs3MCwgMl0sIFs3NiwgMV0sIFs3NiwgMl1dLFxuXHQgICAgICAgIHBlcmZvcm1BY3Rpb246IGZ1bmN0aW9uIGFub255bW91cyh5eXRleHQsIHl5bGVuZywgeXlsaW5lbm8sIHl5LCB5eXN0YXRlLCAkJCwgXyRcblx0ICAgICAgICAvKiovKSB7XG5cblx0ICAgICAgICAgICAgdmFyICQwID0gJCQubGVuZ3RoIC0gMTtcblx0ICAgICAgICAgICAgc3dpdGNoICh5eXN0YXRlKSB7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQkWyQwIC0gMV07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZVByb2dyYW0oJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA1OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDc6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdDb21tZW50U3RhdGVtZW50Jyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHl5LnN0cmlwQ29tbWVudCgkJFskMF0pLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdHJpcDogeXkuc3RyaXBGbGFncygkJFskMF0sICQkWyQwXSksXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKVxuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0ge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnQ29udGVudFN0YXRlbWVudCcsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiAkJFskMF0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAkJFskMF0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKVxuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTE6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZVJhd0Jsb2NrKCQkWyQwIC0gMl0sICQkWyQwIC0gMV0sICQkWyQwXSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEyOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgcGF0aDogJCRbJDAgLSAzXSwgcGFyYW1zOiAkJFskMCAtIDJdLCBoYXNoOiAkJFskMCAtIDFdIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEzOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVCbG9jaygkJFskMCAtIDNdLCAkJFskMCAtIDJdLCAkJFskMCAtIDFdLCAkJFskMF0sIGZhbHNlLCB0aGlzLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTQ6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZUJsb2NrKCQkWyQwIC0gM10sICQkWyQwIC0gMl0sICQkWyQwIC0gMV0sICQkWyQwXSwgdHJ1ZSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE1OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgb3BlbjogJCRbJDAgLSA1XSwgcGF0aDogJCRbJDAgLSA0XSwgcGFyYW1zOiAkJFskMCAtIDNdLCBoYXNoOiAkJFskMCAtIDJdLCBibG9ja1BhcmFtczogJCRbJDAgLSAxXSwgc3RyaXA6IHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSA1XSwgJCRbJDBdKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxNjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHBhdGg6ICQkWyQwIC0gNF0sIHBhcmFtczogJCRbJDAgLSAzXSwgaGFzaDogJCRbJDAgLSAyXSwgYmxvY2tQYXJhbXM6ICQkWyQwIC0gMV0sIHN0cmlwOiB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gNV0sICQkWyQwXSkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTc6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyBwYXRoOiAkJFskMCAtIDRdLCBwYXJhbXM6ICQkWyQwIC0gM10sIGhhc2g6ICQkWyQwIC0gMl0sIGJsb2NrUGFyYW1zOiAkJFskMCAtIDFdLCBzdHJpcDogeXkuc3RyaXBGbGFncygkJFskMCAtIDVdLCAkJFskMF0pIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgc3RyaXA6IHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSAxXSwgJCRbJDAgLSAxXSksIHByb2dyYW06ICQkWyQwXSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxOTpcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaW52ZXJzZSA9IHl5LnByZXBhcmVCbG9jaygkJFskMCAtIDJdLCAkJFskMCAtIDFdLCAkJFskMF0sICQkWyQwXSwgZmFsc2UsIHRoaXMuXyQpLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmFtID0geXkucHJlcGFyZVByb2dyYW0oW2ludmVyc2VdLCAkJFskMCAtIDFdLmxvYyk7XG5cdCAgICAgICAgICAgICAgICAgICAgcHJvZ3JhbS5jaGFpbmVkID0gdHJ1ZTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgc3RyaXA6ICQkWyQwIC0gMl0uc3RyaXAsIHByb2dyYW06IHByb2dyYW0sIGNoYWluOiB0cnVlIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyMTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHBhdGg6ICQkWyQwIC0gMV0sIHN0cmlwOiB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gMl0sICQkWyQwXSkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjI6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZU11c3RhY2hlKCQkWyQwIC0gM10sICQkWyQwIC0gMl0sICQkWyQwIC0gMV0sICQkWyQwIC0gNF0sIHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSA0XSwgJCRbJDBdKSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIzOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVNdXN0YWNoZSgkJFskMCAtIDNdLCAkJFskMCAtIDJdLCAkJFskMCAtIDFdLCAkJFskMCAtIDRdLCB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gNF0sICQkWyQwXSksIHRoaXMuXyQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyNDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQYXJ0aWFsU3RhdGVtZW50Jyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJCRbJDAgLSAzXSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiAkJFskMCAtIDJdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBoYXNoOiAkJFskMCAtIDFdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpbmRlbnQ6ICcnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdHJpcDogeXkuc3RyaXBGbGFncygkJFskMCAtIDRdLCAkJFskMF0pLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBsb2M6IHl5LmxvY0luZm8odGhpcy5fJClcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI1OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVQYXJ0aWFsQmxvY2soJCRbJDAgLSAyXSwgJCRbJDAgLSAxXSwgJCRbJDBdLCB0aGlzLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyBwYXRoOiAkJFskMCAtIDNdLCBwYXJhbXM6ICQkWyQwIC0gMl0sIGhhc2g6ICQkWyQwIC0gMV0sIHN0cmlwOiB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gNF0sICQkWyQwXSkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjc6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyODpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI5OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1N1YkV4cHJlc3Npb24nLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiAkJFskMCAtIDNdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6ICQkWyQwIC0gMl0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGhhc2g6ICQkWyQwIC0gMV0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKVxuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyB0eXBlOiAnSGFzaCcsIHBhaXJzOiAkJFskMF0sIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHR5cGU6ICdIYXNoUGFpcicsIGtleTogeXkuaWQoJCRbJDAgLSAyXSksIHZhbHVlOiAkJFskMF0sIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB5eS5pZCgkJFskMCAtIDFdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzM6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzNDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM1OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgdHlwZTogJ1N0cmluZ0xpdGVyYWwnLCB2YWx1ZTogJCRbJDBdLCBvcmlnaW5hbDogJCRbJDBdLCBsb2M6IHl5LmxvY0luZm8odGhpcy5fJCkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyB0eXBlOiAnTnVtYmVyTGl0ZXJhbCcsIHZhbHVlOiBOdW1iZXIoJCRbJDBdKSwgb3JpZ2luYWw6IE51bWJlcigkJFskMF0pLCBsb2M6IHl5LmxvY0luZm8odGhpcy5fJCkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzc6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyB0eXBlOiAnQm9vbGVhbkxpdGVyYWwnLCB2YWx1ZTogJCRbJDBdID09PSAndHJ1ZScsIG9yaWdpbmFsOiAkJFskMF0gPT09ICd0cnVlJywgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgdHlwZTogJ1VuZGVmaW5lZExpdGVyYWwnLCBvcmlnaW5hbDogdW5kZWZpbmVkLCB2YWx1ZTogdW5kZWZpbmVkLCBsb2M6IHl5LmxvY0luZm8odGhpcy5fJCkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzk6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyB0eXBlOiAnTnVsbExpdGVyYWwnLCBvcmlnaW5hbDogbnVsbCwgdmFsdWU6IG51bGwsIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0MDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQxOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDI6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZVBhdGgodHJ1ZSwgJCRbJDBdLCB0aGlzLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDM6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZVBhdGgoZmFsc2UsICQkWyQwXSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ0OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMl0ucHVzaCh7IHBhcnQ6IHl5LmlkKCQkWyQwXSksIG9yaWdpbmFsOiAkJFskMF0sIHNlcGFyYXRvcjogJCRbJDAgLSAxXSB9KTt0aGlzLiQgPSAkJFskMCAtIDJdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0NTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbeyBwYXJ0OiB5eS5pZCgkJFskMF0pLCBvcmlnaW5hbDogJCRbJDBdIH1dO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0Njpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDc6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFskJFskMF1dO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0OTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNTA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDUxOlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA1ODpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNTk6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDY0OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA2NTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNzA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDcxOlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA3ODpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNzk6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDgyOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA4Mzpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgODY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDg3OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA5MDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTE6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDk0OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA5NTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTg6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gWyQkWyQwXV07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDk5OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMDA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gWyQkWyQwXV07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEwMTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgdGFibGU6IFt7IDM6IDEsIDQ6IDIsIDU6IFsyLCA0Nl0sIDY6IDMsIDE0OiBbMiwgNDZdLCAxNTogWzIsIDQ2XSwgMTk6IFsyLCA0Nl0sIDI5OiBbMiwgNDZdLCAzNDogWzIsIDQ2XSwgNDg6IFsyLCA0Nl0sIDUxOiBbMiwgNDZdLCA1NTogWzIsIDQ2XSwgNjA6IFsyLCA0Nl0gfSwgeyAxOiBbM10gfSwgeyA1OiBbMSwgNF0gfSwgeyA1OiBbMiwgMl0sIDc6IDUsIDg6IDYsIDk6IDcsIDEwOiA4LCAxMTogOSwgMTI6IDEwLCAxMzogMTEsIDE0OiBbMSwgMTJdLCAxNTogWzEsIDIwXSwgMTY6IDE3LCAxOTogWzEsIDIzXSwgMjQ6IDE1LCAyNzogMTYsIDI5OiBbMSwgMjFdLCAzNDogWzEsIDIyXSwgMzk6IFsyLCAyXSwgNDQ6IFsyLCAyXSwgNDc6IFsyLCAyXSwgNDg6IFsxLCAxM10sIDUxOiBbMSwgMTRdLCA1NTogWzEsIDE4XSwgNTk6IDE5LCA2MDogWzEsIDI0XSB9LCB7IDE6IFsyLCAxXSB9LCB7IDU6IFsyLCA0N10sIDE0OiBbMiwgNDddLCAxNTogWzIsIDQ3XSwgMTk6IFsyLCA0N10sIDI5OiBbMiwgNDddLCAzNDogWzIsIDQ3XSwgMzk6IFsyLCA0N10sIDQ0OiBbMiwgNDddLCA0NzogWzIsIDQ3XSwgNDg6IFsyLCA0N10sIDUxOiBbMiwgNDddLCA1NTogWzIsIDQ3XSwgNjA6IFsyLCA0N10gfSwgeyA1OiBbMiwgM10sIDE0OiBbMiwgM10sIDE1OiBbMiwgM10sIDE5OiBbMiwgM10sIDI5OiBbMiwgM10sIDM0OiBbMiwgM10sIDM5OiBbMiwgM10sIDQ0OiBbMiwgM10sIDQ3OiBbMiwgM10sIDQ4OiBbMiwgM10sIDUxOiBbMiwgM10sIDU1OiBbMiwgM10sIDYwOiBbMiwgM10gfSwgeyA1OiBbMiwgNF0sIDE0OiBbMiwgNF0sIDE1OiBbMiwgNF0sIDE5OiBbMiwgNF0sIDI5OiBbMiwgNF0sIDM0OiBbMiwgNF0sIDM5OiBbMiwgNF0sIDQ0OiBbMiwgNF0sIDQ3OiBbMiwgNF0sIDQ4OiBbMiwgNF0sIDUxOiBbMiwgNF0sIDU1OiBbMiwgNF0sIDYwOiBbMiwgNF0gfSwgeyA1OiBbMiwgNV0sIDE0OiBbMiwgNV0sIDE1OiBbMiwgNV0sIDE5OiBbMiwgNV0sIDI5OiBbMiwgNV0sIDM0OiBbMiwgNV0sIDM5OiBbMiwgNV0sIDQ0OiBbMiwgNV0sIDQ3OiBbMiwgNV0sIDQ4OiBbMiwgNV0sIDUxOiBbMiwgNV0sIDU1OiBbMiwgNV0sIDYwOiBbMiwgNV0gfSwgeyA1OiBbMiwgNl0sIDE0OiBbMiwgNl0sIDE1OiBbMiwgNl0sIDE5OiBbMiwgNl0sIDI5OiBbMiwgNl0sIDM0OiBbMiwgNl0sIDM5OiBbMiwgNl0sIDQ0OiBbMiwgNl0sIDQ3OiBbMiwgNl0sIDQ4OiBbMiwgNl0sIDUxOiBbMiwgNl0sIDU1OiBbMiwgNl0sIDYwOiBbMiwgNl0gfSwgeyA1OiBbMiwgN10sIDE0OiBbMiwgN10sIDE1OiBbMiwgN10sIDE5OiBbMiwgN10sIDI5OiBbMiwgN10sIDM0OiBbMiwgN10sIDM5OiBbMiwgN10sIDQ0OiBbMiwgN10sIDQ3OiBbMiwgN10sIDQ4OiBbMiwgN10sIDUxOiBbMiwgN10sIDU1OiBbMiwgN10sIDYwOiBbMiwgN10gfSwgeyA1OiBbMiwgOF0sIDE0OiBbMiwgOF0sIDE1OiBbMiwgOF0sIDE5OiBbMiwgOF0sIDI5OiBbMiwgOF0sIDM0OiBbMiwgOF0sIDM5OiBbMiwgOF0sIDQ0OiBbMiwgOF0sIDQ3OiBbMiwgOF0sIDQ4OiBbMiwgOF0sIDUxOiBbMiwgOF0sIDU1OiBbMiwgOF0sIDYwOiBbMiwgOF0gfSwgeyA1OiBbMiwgOV0sIDE0OiBbMiwgOV0sIDE1OiBbMiwgOV0sIDE5OiBbMiwgOV0sIDI5OiBbMiwgOV0sIDM0OiBbMiwgOV0sIDM5OiBbMiwgOV0sIDQ0OiBbMiwgOV0sIDQ3OiBbMiwgOV0sIDQ4OiBbMiwgOV0sIDUxOiBbMiwgOV0sIDU1OiBbMiwgOV0sIDYwOiBbMiwgOV0gfSwgeyAyMDogMjUsIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDM2LCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDQ6IDM3LCA2OiAzLCAxNDogWzIsIDQ2XSwgMTU6IFsyLCA0Nl0sIDE5OiBbMiwgNDZdLCAyOTogWzIsIDQ2XSwgMzQ6IFsyLCA0Nl0sIDM5OiBbMiwgNDZdLCA0NDogWzIsIDQ2XSwgNDc6IFsyLCA0Nl0sIDQ4OiBbMiwgNDZdLCA1MTogWzIsIDQ2XSwgNTU6IFsyLCA0Nl0sIDYwOiBbMiwgNDZdIH0sIHsgNDogMzgsIDY6IDMsIDE0OiBbMiwgNDZdLCAxNTogWzIsIDQ2XSwgMTk6IFsyLCA0Nl0sIDI5OiBbMiwgNDZdLCAzNDogWzIsIDQ2XSwgNDQ6IFsyLCA0Nl0sIDQ3OiBbMiwgNDZdLCA0ODogWzIsIDQ2XSwgNTE6IFsyLCA0Nl0sIDU1OiBbMiwgNDZdLCA2MDogWzIsIDQ2XSB9LCB7IDEzOiA0MCwgMTU6IFsxLCAyMF0sIDE3OiAzOSB9LCB7IDIwOiA0MiwgNTY6IDQxLCA2NDogNDMsIDY1OiBbMSwgNDRdLCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDQ6IDQ1LCA2OiAzLCAxNDogWzIsIDQ2XSwgMTU6IFsyLCA0Nl0sIDE5OiBbMiwgNDZdLCAyOTogWzIsIDQ2XSwgMzQ6IFsyLCA0Nl0sIDQ3OiBbMiwgNDZdLCA0ODogWzIsIDQ2XSwgNTE6IFsyLCA0Nl0sIDU1OiBbMiwgNDZdLCA2MDogWzIsIDQ2XSB9LCB7IDU6IFsyLCAxMF0sIDE0OiBbMiwgMTBdLCAxNTogWzIsIDEwXSwgMTg6IFsyLCAxMF0sIDE5OiBbMiwgMTBdLCAyOTogWzIsIDEwXSwgMzQ6IFsyLCAxMF0sIDM5OiBbMiwgMTBdLCA0NDogWzIsIDEwXSwgNDc6IFsyLCAxMF0sIDQ4OiBbMiwgMTBdLCA1MTogWzIsIDEwXSwgNTU6IFsyLCAxMF0sIDYwOiBbMiwgMTBdIH0sIHsgMjA6IDQ2LCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDIwOiA0NywgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyMDogNDgsIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDQyLCA1NjogNDksIDY0OiA0MywgNjU6IFsxLCA0NF0sIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMzM6IFsyLCA3OF0sIDQ5OiA1MCwgNjU6IFsyLCA3OF0sIDcyOiBbMiwgNzhdLCA4MDogWzIsIDc4XSwgODE6IFsyLCA3OF0sIDgyOiBbMiwgNzhdLCA4MzogWzIsIDc4XSwgODQ6IFsyLCA3OF0sIDg1OiBbMiwgNzhdIH0sIHsgMjM6IFsyLCAzM10sIDMzOiBbMiwgMzNdLCA1NDogWzIsIDMzXSwgNjU6IFsyLCAzM10sIDY4OiBbMiwgMzNdLCA3MjogWzIsIDMzXSwgNzU6IFsyLCAzM10sIDgwOiBbMiwgMzNdLCA4MTogWzIsIDMzXSwgODI6IFsyLCAzM10sIDgzOiBbMiwgMzNdLCA4NDogWzIsIDMzXSwgODU6IFsyLCAzM10gfSwgeyAyMzogWzIsIDM0XSwgMzM6IFsyLCAzNF0sIDU0OiBbMiwgMzRdLCA2NTogWzIsIDM0XSwgNjg6IFsyLCAzNF0sIDcyOiBbMiwgMzRdLCA3NTogWzIsIDM0XSwgODA6IFsyLCAzNF0sIDgxOiBbMiwgMzRdLCA4MjogWzIsIDM0XSwgODM6IFsyLCAzNF0sIDg0OiBbMiwgMzRdLCA4NTogWzIsIDM0XSB9LCB7IDIzOiBbMiwgMzVdLCAzMzogWzIsIDM1XSwgNTQ6IFsyLCAzNV0sIDY1OiBbMiwgMzVdLCA2ODogWzIsIDM1XSwgNzI6IFsyLCAzNV0sIDc1OiBbMiwgMzVdLCA4MDogWzIsIDM1XSwgODE6IFsyLCAzNV0sIDgyOiBbMiwgMzVdLCA4MzogWzIsIDM1XSwgODQ6IFsyLCAzNV0sIDg1OiBbMiwgMzVdIH0sIHsgMjM6IFsyLCAzNl0sIDMzOiBbMiwgMzZdLCA1NDogWzIsIDM2XSwgNjU6IFsyLCAzNl0sIDY4OiBbMiwgMzZdLCA3MjogWzIsIDM2XSwgNzU6IFsyLCAzNl0sIDgwOiBbMiwgMzZdLCA4MTogWzIsIDM2XSwgODI6IFsyLCAzNl0sIDgzOiBbMiwgMzZdLCA4NDogWzIsIDM2XSwgODU6IFsyLCAzNl0gfSwgeyAyMzogWzIsIDM3XSwgMzM6IFsyLCAzN10sIDU0OiBbMiwgMzddLCA2NTogWzIsIDM3XSwgNjg6IFsyLCAzN10sIDcyOiBbMiwgMzddLCA3NTogWzIsIDM3XSwgODA6IFsyLCAzN10sIDgxOiBbMiwgMzddLCA4MjogWzIsIDM3XSwgODM6IFsyLCAzN10sIDg0OiBbMiwgMzddLCA4NTogWzIsIDM3XSB9LCB7IDIzOiBbMiwgMzhdLCAzMzogWzIsIDM4XSwgNTQ6IFsyLCAzOF0sIDY1OiBbMiwgMzhdLCA2ODogWzIsIDM4XSwgNzI6IFsyLCAzOF0sIDc1OiBbMiwgMzhdLCA4MDogWzIsIDM4XSwgODE6IFsyLCAzOF0sIDgyOiBbMiwgMzhdLCA4MzogWzIsIDM4XSwgODQ6IFsyLCAzOF0sIDg1OiBbMiwgMzhdIH0sIHsgMjM6IFsyLCAzOV0sIDMzOiBbMiwgMzldLCA1NDogWzIsIDM5XSwgNjU6IFsyLCAzOV0sIDY4OiBbMiwgMzldLCA3MjogWzIsIDM5XSwgNzU6IFsyLCAzOV0sIDgwOiBbMiwgMzldLCA4MTogWzIsIDM5XSwgODI6IFsyLCAzOV0sIDgzOiBbMiwgMzldLCA4NDogWzIsIDM5XSwgODU6IFsyLCAzOV0gfSwgeyAyMzogWzIsIDQzXSwgMzM6IFsyLCA0M10sIDU0OiBbMiwgNDNdLCA2NTogWzIsIDQzXSwgNjg6IFsyLCA0M10sIDcyOiBbMiwgNDNdLCA3NTogWzIsIDQzXSwgODA6IFsyLCA0M10sIDgxOiBbMiwgNDNdLCA4MjogWzIsIDQzXSwgODM6IFsyLCA0M10sIDg0OiBbMiwgNDNdLCA4NTogWzIsIDQzXSwgODc6IFsxLCA1MV0gfSwgeyA3MjogWzEsIDM1XSwgODY6IDUyIH0sIHsgMjM6IFsyLCA0NV0sIDMzOiBbMiwgNDVdLCA1NDogWzIsIDQ1XSwgNjU6IFsyLCA0NV0sIDY4OiBbMiwgNDVdLCA3MjogWzIsIDQ1XSwgNzU6IFsyLCA0NV0sIDgwOiBbMiwgNDVdLCA4MTogWzIsIDQ1XSwgODI6IFsyLCA0NV0sIDgzOiBbMiwgNDVdLCA4NDogWzIsIDQ1XSwgODU6IFsyLCA0NV0sIDg3OiBbMiwgNDVdIH0sIHsgNTI6IDUzLCA1NDogWzIsIDgyXSwgNjU6IFsyLCA4Ml0sIDcyOiBbMiwgODJdLCA4MDogWzIsIDgyXSwgODE6IFsyLCA4Ml0sIDgyOiBbMiwgODJdLCA4MzogWzIsIDgyXSwgODQ6IFsyLCA4Ml0sIDg1OiBbMiwgODJdIH0sIHsgMjU6IDU0LCAzODogNTYsIDM5OiBbMSwgNThdLCA0MzogNTcsIDQ0OiBbMSwgNTldLCA0NTogNTUsIDQ3OiBbMiwgNTRdIH0sIHsgMjg6IDYwLCA0MzogNjEsIDQ0OiBbMSwgNTldLCA0NzogWzIsIDU2XSB9LCB7IDEzOiA2MywgMTU6IFsxLCAyMF0sIDE4OiBbMSwgNjJdIH0sIHsgMTU6IFsyLCA0OF0sIDE4OiBbMiwgNDhdIH0sIHsgMzM6IFsyLCA4Nl0sIDU3OiA2NCwgNjU6IFsyLCA4Nl0sIDcyOiBbMiwgODZdLCA4MDogWzIsIDg2XSwgODE6IFsyLCA4Nl0sIDgyOiBbMiwgODZdLCA4MzogWzIsIDg2XSwgODQ6IFsyLCA4Nl0sIDg1OiBbMiwgODZdIH0sIHsgMzM6IFsyLCA0MF0sIDY1OiBbMiwgNDBdLCA3MjogWzIsIDQwXSwgODA6IFsyLCA0MF0sIDgxOiBbMiwgNDBdLCA4MjogWzIsIDQwXSwgODM6IFsyLCA0MF0sIDg0OiBbMiwgNDBdLCA4NTogWzIsIDQwXSB9LCB7IDMzOiBbMiwgNDFdLCA2NTogWzIsIDQxXSwgNzI6IFsyLCA0MV0sIDgwOiBbMiwgNDFdLCA4MTogWzIsIDQxXSwgODI6IFsyLCA0MV0sIDgzOiBbMiwgNDFdLCA4NDogWzIsIDQxXSwgODU6IFsyLCA0MV0gfSwgeyAyMDogNjUsIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjY6IDY2LCA0NzogWzEsIDY3XSB9LCB7IDMwOiA2OCwgMzM6IFsyLCA1OF0sIDY1OiBbMiwgNThdLCA3MjogWzIsIDU4XSwgNzU6IFsyLCA1OF0sIDgwOiBbMiwgNThdLCA4MTogWzIsIDU4XSwgODI6IFsyLCA1OF0sIDgzOiBbMiwgNThdLCA4NDogWzIsIDU4XSwgODU6IFsyLCA1OF0gfSwgeyAzMzogWzIsIDY0XSwgMzU6IDY5LCA2NTogWzIsIDY0XSwgNzI6IFsyLCA2NF0sIDc1OiBbMiwgNjRdLCA4MDogWzIsIDY0XSwgODE6IFsyLCA2NF0sIDgyOiBbMiwgNjRdLCA4MzogWzIsIDY0XSwgODQ6IFsyLCA2NF0sIDg1OiBbMiwgNjRdIH0sIHsgMjE6IDcwLCAyMzogWzIsIDUwXSwgNjU6IFsyLCA1MF0sIDcyOiBbMiwgNTBdLCA4MDogWzIsIDUwXSwgODE6IFsyLCA1MF0sIDgyOiBbMiwgNTBdLCA4MzogWzIsIDUwXSwgODQ6IFsyLCA1MF0sIDg1OiBbMiwgNTBdIH0sIHsgMzM6IFsyLCA5MF0sIDYxOiA3MSwgNjU6IFsyLCA5MF0sIDcyOiBbMiwgOTBdLCA4MDogWzIsIDkwXSwgODE6IFsyLCA5MF0sIDgyOiBbMiwgOTBdLCA4MzogWzIsIDkwXSwgODQ6IFsyLCA5MF0sIDg1OiBbMiwgOTBdIH0sIHsgMjA6IDc1LCAzMzogWzIsIDgwXSwgNTA6IDcyLCA2MzogNzMsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY5OiA3NCwgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgNzI6IFsxLCA4MF0gfSwgeyAyMzogWzIsIDQyXSwgMzM6IFsyLCA0Ml0sIDU0OiBbMiwgNDJdLCA2NTogWzIsIDQyXSwgNjg6IFsyLCA0Ml0sIDcyOiBbMiwgNDJdLCA3NTogWzIsIDQyXSwgODA6IFsyLCA0Ml0sIDgxOiBbMiwgNDJdLCA4MjogWzIsIDQyXSwgODM6IFsyLCA0Ml0sIDg0OiBbMiwgNDJdLCA4NTogWzIsIDQyXSwgODc6IFsxLCA1MV0gfSwgeyAyMDogNzUsIDUzOiA4MSwgNTQ6IFsyLCA4NF0sIDYzOiA4MiwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDgzLCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyNjogODQsIDQ3OiBbMSwgNjddIH0sIHsgNDc6IFsyLCA1NV0gfSwgeyA0OiA4NSwgNjogMywgMTQ6IFsyLCA0Nl0sIDE1OiBbMiwgNDZdLCAxOTogWzIsIDQ2XSwgMjk6IFsyLCA0Nl0sIDM0OiBbMiwgNDZdLCAzOTogWzIsIDQ2XSwgNDQ6IFsyLCA0Nl0sIDQ3OiBbMiwgNDZdLCA0ODogWzIsIDQ2XSwgNTE6IFsyLCA0Nl0sIDU1OiBbMiwgNDZdLCA2MDogWzIsIDQ2XSB9LCB7IDQ3OiBbMiwgMjBdIH0sIHsgMjA6IDg2LCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDQ6IDg3LCA2OiAzLCAxNDogWzIsIDQ2XSwgMTU6IFsyLCA0Nl0sIDE5OiBbMiwgNDZdLCAyOTogWzIsIDQ2XSwgMzQ6IFsyLCA0Nl0sIDQ3OiBbMiwgNDZdLCA0ODogWzIsIDQ2XSwgNTE6IFsyLCA0Nl0sIDU1OiBbMiwgNDZdLCA2MDogWzIsIDQ2XSB9LCB7IDI2OiA4OCwgNDc6IFsxLCA2N10gfSwgeyA0NzogWzIsIDU3XSB9LCB7IDU6IFsyLCAxMV0sIDE0OiBbMiwgMTFdLCAxNTogWzIsIDExXSwgMTk6IFsyLCAxMV0sIDI5OiBbMiwgMTFdLCAzNDogWzIsIDExXSwgMzk6IFsyLCAxMV0sIDQ0OiBbMiwgMTFdLCA0NzogWzIsIDExXSwgNDg6IFsyLCAxMV0sIDUxOiBbMiwgMTFdLCA1NTogWzIsIDExXSwgNjA6IFsyLCAxMV0gfSwgeyAxNTogWzIsIDQ5XSwgMTg6IFsyLCA0OV0gfSwgeyAyMDogNzUsIDMzOiBbMiwgODhdLCA1ODogODksIDYzOiA5MCwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDkxLCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyA2NTogWzIsIDk0XSwgNjY6IDkyLCA2ODogWzIsIDk0XSwgNzI6IFsyLCA5NF0sIDgwOiBbMiwgOTRdLCA4MTogWzIsIDk0XSwgODI6IFsyLCA5NF0sIDgzOiBbMiwgOTRdLCA4NDogWzIsIDk0XSwgODU6IFsyLCA5NF0gfSwgeyA1OiBbMiwgMjVdLCAxNDogWzIsIDI1XSwgMTU6IFsyLCAyNV0sIDE5OiBbMiwgMjVdLCAyOTogWzIsIDI1XSwgMzQ6IFsyLCAyNV0sIDM5OiBbMiwgMjVdLCA0NDogWzIsIDI1XSwgNDc6IFsyLCAyNV0sIDQ4OiBbMiwgMjVdLCA1MTogWzIsIDI1XSwgNTU6IFsyLCAyNV0sIDYwOiBbMiwgMjVdIH0sIHsgMjA6IDkzLCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDIwOiA3NSwgMzE6IDk0LCAzMzogWzIsIDYwXSwgNjM6IDk1LCA2NDogNzYsIDY1OiBbMSwgNDRdLCA2OTogOTYsIDcwOiA3NywgNzE6IDc4LCA3MjogWzEsIDc5XSwgNzU6IFsyLCA2MF0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyMDogNzUsIDMzOiBbMiwgNjZdLCAzNjogOTcsIDYzOiA5OCwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDk5LCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc1OiBbMiwgNjZdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDc1LCAyMjogMTAwLCAyMzogWzIsIDUyXSwgNjM6IDEwMSwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDEwMiwgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDc1LCAzMzogWzIsIDkyXSwgNjI6IDEwMywgNjM6IDEwNCwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDEwNSwgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMzM6IFsxLCAxMDZdIH0sIHsgMzM6IFsyLCA3OV0sIDY1OiBbMiwgNzldLCA3MjogWzIsIDc5XSwgODA6IFsyLCA3OV0sIDgxOiBbMiwgNzldLCA4MjogWzIsIDc5XSwgODM6IFsyLCA3OV0sIDg0OiBbMiwgNzldLCA4NTogWzIsIDc5XSB9LCB7IDMzOiBbMiwgODFdIH0sIHsgMjM6IFsyLCAyN10sIDMzOiBbMiwgMjddLCA1NDogWzIsIDI3XSwgNjU6IFsyLCAyN10sIDY4OiBbMiwgMjddLCA3MjogWzIsIDI3XSwgNzU6IFsyLCAyN10sIDgwOiBbMiwgMjddLCA4MTogWzIsIDI3XSwgODI6IFsyLCAyN10sIDgzOiBbMiwgMjddLCA4NDogWzIsIDI3XSwgODU6IFsyLCAyN10gfSwgeyAyMzogWzIsIDI4XSwgMzM6IFsyLCAyOF0sIDU0OiBbMiwgMjhdLCA2NTogWzIsIDI4XSwgNjg6IFsyLCAyOF0sIDcyOiBbMiwgMjhdLCA3NTogWzIsIDI4XSwgODA6IFsyLCAyOF0sIDgxOiBbMiwgMjhdLCA4MjogWzIsIDI4XSwgODM6IFsyLCAyOF0sIDg0OiBbMiwgMjhdLCA4NTogWzIsIDI4XSB9LCB7IDIzOiBbMiwgMzBdLCAzMzogWzIsIDMwXSwgNTQ6IFsyLCAzMF0sIDY4OiBbMiwgMzBdLCA3MTogMTA3LCA3MjogWzEsIDEwOF0sIDc1OiBbMiwgMzBdIH0sIHsgMjM6IFsyLCA5OF0sIDMzOiBbMiwgOThdLCA1NDogWzIsIDk4XSwgNjg6IFsyLCA5OF0sIDcyOiBbMiwgOThdLCA3NTogWzIsIDk4XSB9LCB7IDIzOiBbMiwgNDVdLCAzMzogWzIsIDQ1XSwgNTQ6IFsyLCA0NV0sIDY1OiBbMiwgNDVdLCA2ODogWzIsIDQ1XSwgNzI6IFsyLCA0NV0sIDczOiBbMSwgMTA5XSwgNzU6IFsyLCA0NV0sIDgwOiBbMiwgNDVdLCA4MTogWzIsIDQ1XSwgODI6IFsyLCA0NV0sIDgzOiBbMiwgNDVdLCA4NDogWzIsIDQ1XSwgODU6IFsyLCA0NV0sIDg3OiBbMiwgNDVdIH0sIHsgMjM6IFsyLCA0NF0sIDMzOiBbMiwgNDRdLCA1NDogWzIsIDQ0XSwgNjU6IFsyLCA0NF0sIDY4OiBbMiwgNDRdLCA3MjogWzIsIDQ0XSwgNzU6IFsyLCA0NF0sIDgwOiBbMiwgNDRdLCA4MTogWzIsIDQ0XSwgODI6IFsyLCA0NF0sIDgzOiBbMiwgNDRdLCA4NDogWzIsIDQ0XSwgODU6IFsyLCA0NF0sIDg3OiBbMiwgNDRdIH0sIHsgNTQ6IFsxLCAxMTBdIH0sIHsgNTQ6IFsyLCA4M10sIDY1OiBbMiwgODNdLCA3MjogWzIsIDgzXSwgODA6IFsyLCA4M10sIDgxOiBbMiwgODNdLCA4MjogWzIsIDgzXSwgODM6IFsyLCA4M10sIDg0OiBbMiwgODNdLCA4NTogWzIsIDgzXSB9LCB7IDU0OiBbMiwgODVdIH0sIHsgNTogWzIsIDEzXSwgMTQ6IFsyLCAxM10sIDE1OiBbMiwgMTNdLCAxOTogWzIsIDEzXSwgMjk6IFsyLCAxM10sIDM0OiBbMiwgMTNdLCAzOTogWzIsIDEzXSwgNDQ6IFsyLCAxM10sIDQ3OiBbMiwgMTNdLCA0ODogWzIsIDEzXSwgNTE6IFsyLCAxM10sIDU1OiBbMiwgMTNdLCA2MDogWzIsIDEzXSB9LCB7IDM4OiA1NiwgMzk6IFsxLCA1OF0sIDQzOiA1NywgNDQ6IFsxLCA1OV0sIDQ1OiAxMTIsIDQ2OiAxMTEsIDQ3OiBbMiwgNzZdIH0sIHsgMzM6IFsyLCA3MF0sIDQwOiAxMTMsIDY1OiBbMiwgNzBdLCA3MjogWzIsIDcwXSwgNzU6IFsyLCA3MF0sIDgwOiBbMiwgNzBdLCA4MTogWzIsIDcwXSwgODI6IFsyLCA3MF0sIDgzOiBbMiwgNzBdLCA4NDogWzIsIDcwXSwgODU6IFsyLCA3MF0gfSwgeyA0NzogWzIsIDE4XSB9LCB7IDU6IFsyLCAxNF0sIDE0OiBbMiwgMTRdLCAxNTogWzIsIDE0XSwgMTk6IFsyLCAxNF0sIDI5OiBbMiwgMTRdLCAzNDogWzIsIDE0XSwgMzk6IFsyLCAxNF0sIDQ0OiBbMiwgMTRdLCA0NzogWzIsIDE0XSwgNDg6IFsyLCAxNF0sIDUxOiBbMiwgMTRdLCA1NTogWzIsIDE0XSwgNjA6IFsyLCAxNF0gfSwgeyAzMzogWzEsIDExNF0gfSwgeyAzMzogWzIsIDg3XSwgNjU6IFsyLCA4N10sIDcyOiBbMiwgODddLCA4MDogWzIsIDg3XSwgODE6IFsyLCA4N10sIDgyOiBbMiwgODddLCA4MzogWzIsIDg3XSwgODQ6IFsyLCA4N10sIDg1OiBbMiwgODddIH0sIHsgMzM6IFsyLCA4OV0gfSwgeyAyMDogNzUsIDYzOiAxMTYsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY3OiAxMTUsIDY4OiBbMiwgOTZdLCA2OTogMTE3LCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAzMzogWzEsIDExOF0gfSwgeyAzMjogMTE5LCAzMzogWzIsIDYyXSwgNzQ6IDEyMCwgNzU6IFsxLCAxMjFdIH0sIHsgMzM6IFsyLCA1OV0sIDY1OiBbMiwgNTldLCA3MjogWzIsIDU5XSwgNzU6IFsyLCA1OV0sIDgwOiBbMiwgNTldLCA4MTogWzIsIDU5XSwgODI6IFsyLCA1OV0sIDgzOiBbMiwgNTldLCA4NDogWzIsIDU5XSwgODU6IFsyLCA1OV0gfSwgeyAzMzogWzIsIDYxXSwgNzU6IFsyLCA2MV0gfSwgeyAzMzogWzIsIDY4XSwgMzc6IDEyMiwgNzQ6IDEyMywgNzU6IFsxLCAxMjFdIH0sIHsgMzM6IFsyLCA2NV0sIDY1OiBbMiwgNjVdLCA3MjogWzIsIDY1XSwgNzU6IFsyLCA2NV0sIDgwOiBbMiwgNjVdLCA4MTogWzIsIDY1XSwgODI6IFsyLCA2NV0sIDgzOiBbMiwgNjVdLCA4NDogWzIsIDY1XSwgODU6IFsyLCA2NV0gfSwgeyAzMzogWzIsIDY3XSwgNzU6IFsyLCA2N10gfSwgeyAyMzogWzEsIDEyNF0gfSwgeyAyMzogWzIsIDUxXSwgNjU6IFsyLCA1MV0sIDcyOiBbMiwgNTFdLCA4MDogWzIsIDUxXSwgODE6IFsyLCA1MV0sIDgyOiBbMiwgNTFdLCA4MzogWzIsIDUxXSwgODQ6IFsyLCA1MV0sIDg1OiBbMiwgNTFdIH0sIHsgMjM6IFsyLCA1M10gfSwgeyAzMzogWzEsIDEyNV0gfSwgeyAzMzogWzIsIDkxXSwgNjU6IFsyLCA5MV0sIDcyOiBbMiwgOTFdLCA4MDogWzIsIDkxXSwgODE6IFsyLCA5MV0sIDgyOiBbMiwgOTFdLCA4MzogWzIsIDkxXSwgODQ6IFsyLCA5MV0sIDg1OiBbMiwgOTFdIH0sIHsgMzM6IFsyLCA5M10gfSwgeyA1OiBbMiwgMjJdLCAxNDogWzIsIDIyXSwgMTU6IFsyLCAyMl0sIDE5OiBbMiwgMjJdLCAyOTogWzIsIDIyXSwgMzQ6IFsyLCAyMl0sIDM5OiBbMiwgMjJdLCA0NDogWzIsIDIyXSwgNDc6IFsyLCAyMl0sIDQ4OiBbMiwgMjJdLCA1MTogWzIsIDIyXSwgNTU6IFsyLCAyMl0sIDYwOiBbMiwgMjJdIH0sIHsgMjM6IFsyLCA5OV0sIDMzOiBbMiwgOTldLCA1NDogWzIsIDk5XSwgNjg6IFsyLCA5OV0sIDcyOiBbMiwgOTldLCA3NTogWzIsIDk5XSB9LCB7IDczOiBbMSwgMTA5XSB9LCB7IDIwOiA3NSwgNjM6IDEyNiwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyA1OiBbMiwgMjNdLCAxNDogWzIsIDIzXSwgMTU6IFsyLCAyM10sIDE5OiBbMiwgMjNdLCAyOTogWzIsIDIzXSwgMzQ6IFsyLCAyM10sIDM5OiBbMiwgMjNdLCA0NDogWzIsIDIzXSwgNDc6IFsyLCAyM10sIDQ4OiBbMiwgMjNdLCA1MTogWzIsIDIzXSwgNTU6IFsyLCAyM10sIDYwOiBbMiwgMjNdIH0sIHsgNDc6IFsyLCAxOV0gfSwgeyA0NzogWzIsIDc3XSB9LCB7IDIwOiA3NSwgMzM6IFsyLCA3Ml0sIDQxOiAxMjcsIDYzOiAxMjgsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY5OiAxMjksIDcwOiA3NywgNzE6IDc4LCA3MjogWzEsIDc5XSwgNzU6IFsyLCA3Ml0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyA1OiBbMiwgMjRdLCAxNDogWzIsIDI0XSwgMTU6IFsyLCAyNF0sIDE5OiBbMiwgMjRdLCAyOTogWzIsIDI0XSwgMzQ6IFsyLCAyNF0sIDM5OiBbMiwgMjRdLCA0NDogWzIsIDI0XSwgNDc6IFsyLCAyNF0sIDQ4OiBbMiwgMjRdLCA1MTogWzIsIDI0XSwgNTU6IFsyLCAyNF0sIDYwOiBbMiwgMjRdIH0sIHsgNjg6IFsxLCAxMzBdIH0sIHsgNjU6IFsyLCA5NV0sIDY4OiBbMiwgOTVdLCA3MjogWzIsIDk1XSwgODA6IFsyLCA5NV0sIDgxOiBbMiwgOTVdLCA4MjogWzIsIDk1XSwgODM6IFsyLCA5NV0sIDg0OiBbMiwgOTVdLCA4NTogWzIsIDk1XSB9LCB7IDY4OiBbMiwgOTddIH0sIHsgNTogWzIsIDIxXSwgMTQ6IFsyLCAyMV0sIDE1OiBbMiwgMjFdLCAxOTogWzIsIDIxXSwgMjk6IFsyLCAyMV0sIDM0OiBbMiwgMjFdLCAzOTogWzIsIDIxXSwgNDQ6IFsyLCAyMV0sIDQ3OiBbMiwgMjFdLCA0ODogWzIsIDIxXSwgNTE6IFsyLCAyMV0sIDU1OiBbMiwgMjFdLCA2MDogWzIsIDIxXSB9LCB7IDMzOiBbMSwgMTMxXSB9LCB7IDMzOiBbMiwgNjNdIH0sIHsgNzI6IFsxLCAxMzNdLCA3NjogMTMyIH0sIHsgMzM6IFsxLCAxMzRdIH0sIHsgMzM6IFsyLCA2OV0gfSwgeyAxNTogWzIsIDEyXSB9LCB7IDE0OiBbMiwgMjZdLCAxNTogWzIsIDI2XSwgMTk6IFsyLCAyNl0sIDI5OiBbMiwgMjZdLCAzNDogWzIsIDI2XSwgNDc6IFsyLCAyNl0sIDQ4OiBbMiwgMjZdLCA1MTogWzIsIDI2XSwgNTU6IFsyLCAyNl0sIDYwOiBbMiwgMjZdIH0sIHsgMjM6IFsyLCAzMV0sIDMzOiBbMiwgMzFdLCA1NDogWzIsIDMxXSwgNjg6IFsyLCAzMV0sIDcyOiBbMiwgMzFdLCA3NTogWzIsIDMxXSB9LCB7IDMzOiBbMiwgNzRdLCA0MjogMTM1LCA3NDogMTM2LCA3NTogWzEsIDEyMV0gfSwgeyAzMzogWzIsIDcxXSwgNjU6IFsyLCA3MV0sIDcyOiBbMiwgNzFdLCA3NTogWzIsIDcxXSwgODA6IFsyLCA3MV0sIDgxOiBbMiwgNzFdLCA4MjogWzIsIDcxXSwgODM6IFsyLCA3MV0sIDg0OiBbMiwgNzFdLCA4NTogWzIsIDcxXSB9LCB7IDMzOiBbMiwgNzNdLCA3NTogWzIsIDczXSB9LCB7IDIzOiBbMiwgMjldLCAzMzogWzIsIDI5XSwgNTQ6IFsyLCAyOV0sIDY1OiBbMiwgMjldLCA2ODogWzIsIDI5XSwgNzI6IFsyLCAyOV0sIDc1OiBbMiwgMjldLCA4MDogWzIsIDI5XSwgODE6IFsyLCAyOV0sIDgyOiBbMiwgMjldLCA4MzogWzIsIDI5XSwgODQ6IFsyLCAyOV0sIDg1OiBbMiwgMjldIH0sIHsgMTQ6IFsyLCAxNV0sIDE1OiBbMiwgMTVdLCAxOTogWzIsIDE1XSwgMjk6IFsyLCAxNV0sIDM0OiBbMiwgMTVdLCAzOTogWzIsIDE1XSwgNDQ6IFsyLCAxNV0sIDQ3OiBbMiwgMTVdLCA0ODogWzIsIDE1XSwgNTE6IFsyLCAxNV0sIDU1OiBbMiwgMTVdLCA2MDogWzIsIDE1XSB9LCB7IDcyOiBbMSwgMTM4XSwgNzc6IFsxLCAxMzddIH0sIHsgNzI6IFsyLCAxMDBdLCA3NzogWzIsIDEwMF0gfSwgeyAxNDogWzIsIDE2XSwgMTU6IFsyLCAxNl0sIDE5OiBbMiwgMTZdLCAyOTogWzIsIDE2XSwgMzQ6IFsyLCAxNl0sIDQ0OiBbMiwgMTZdLCA0NzogWzIsIDE2XSwgNDg6IFsyLCAxNl0sIDUxOiBbMiwgMTZdLCA1NTogWzIsIDE2XSwgNjA6IFsyLCAxNl0gfSwgeyAzMzogWzEsIDEzOV0gfSwgeyAzMzogWzIsIDc1XSB9LCB7IDMzOiBbMiwgMzJdIH0sIHsgNzI6IFsyLCAxMDFdLCA3NzogWzIsIDEwMV0gfSwgeyAxNDogWzIsIDE3XSwgMTU6IFsyLCAxN10sIDE5OiBbMiwgMTddLCAyOTogWzIsIDE3XSwgMzQ6IFsyLCAxN10sIDM5OiBbMiwgMTddLCA0NDogWzIsIDE3XSwgNDc6IFsyLCAxN10sIDQ4OiBbMiwgMTddLCA1MTogWzIsIDE3XSwgNTU6IFsyLCAxN10sIDYwOiBbMiwgMTddIH1dLFxuXHQgICAgICAgIGRlZmF1bHRBY3Rpb25zOiB7IDQ6IFsyLCAxXSwgNTU6IFsyLCA1NV0sIDU3OiBbMiwgMjBdLCA2MTogWzIsIDU3XSwgNzQ6IFsyLCA4MV0sIDgzOiBbMiwgODVdLCA4NzogWzIsIDE4XSwgOTE6IFsyLCA4OV0sIDEwMjogWzIsIDUzXSwgMTA1OiBbMiwgOTNdLCAxMTE6IFsyLCAxOV0sIDExMjogWzIsIDc3XSwgMTE3OiBbMiwgOTddLCAxMjA6IFsyLCA2M10sIDEyMzogWzIsIDY5XSwgMTI0OiBbMiwgMTJdLCAxMzY6IFsyLCA3NV0sIDEzNzogWzIsIDMyXSB9LFxuXHQgICAgICAgIHBhcnNlRXJyb3I6IGZ1bmN0aW9uIHBhcnNlRXJyb3Ioc3RyLCBoYXNoKSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzdHIpO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIHBhcnNlKGlucHV0KSB7XG5cdCAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcblx0ICAgICAgICAgICAgICAgIHN0YWNrID0gWzBdLFxuXHQgICAgICAgICAgICAgICAgdnN0YWNrID0gW251bGxdLFxuXHQgICAgICAgICAgICAgICAgbHN0YWNrID0gW10sXG5cdCAgICAgICAgICAgICAgICB0YWJsZSA9IHRoaXMudGFibGUsXG5cdCAgICAgICAgICAgICAgICB5eXRleHQgPSBcIlwiLFxuXHQgICAgICAgICAgICAgICAgeXlsaW5lbm8gPSAwLFxuXHQgICAgICAgICAgICAgICAgeXlsZW5nID0gMCxcblx0ICAgICAgICAgICAgICAgIHJlY292ZXJpbmcgPSAwLFxuXHQgICAgICAgICAgICAgICAgVEVSUk9SID0gMixcblx0ICAgICAgICAgICAgICAgIEVPRiA9IDE7XG5cdCAgICAgICAgICAgIHRoaXMubGV4ZXIuc2V0SW5wdXQoaW5wdXQpO1xuXHQgICAgICAgICAgICB0aGlzLmxleGVyLnl5ID0gdGhpcy55eTtcblx0ICAgICAgICAgICAgdGhpcy55eS5sZXhlciA9IHRoaXMubGV4ZXI7XG5cdCAgICAgICAgICAgIHRoaXMueXkucGFyc2VyID0gdGhpcztcblx0ICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmxleGVyLnl5bGxvYyA9PSBcInVuZGVmaW5lZFwiKSB0aGlzLmxleGVyLnl5bGxvYyA9IHt9O1xuXHQgICAgICAgICAgICB2YXIgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcblx0ICAgICAgICAgICAgbHN0YWNrLnB1c2goeXlsb2MpO1xuXHQgICAgICAgICAgICB2YXIgcmFuZ2VzID0gdGhpcy5sZXhlci5vcHRpb25zICYmIHRoaXMubGV4ZXIub3B0aW9ucy5yYW5nZXM7XG5cdCAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy55eS5wYXJzZUVycm9yID09PSBcImZ1bmN0aW9uXCIpIHRoaXMucGFyc2VFcnJvciA9IHRoaXMueXkucGFyc2VFcnJvcjtcblx0ICAgICAgICAgICAgZnVuY3Rpb24gcG9wU3RhY2sobikge1xuXHQgICAgICAgICAgICAgICAgc3RhY2subGVuZ3RoID0gc3RhY2subGVuZ3RoIC0gMiAqIG47XG5cdCAgICAgICAgICAgICAgICB2c3RhY2subGVuZ3RoID0gdnN0YWNrLmxlbmd0aCAtIG47XG5cdCAgICAgICAgICAgICAgICBsc3RhY2subGVuZ3RoID0gbHN0YWNrLmxlbmd0aCAtIG47XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZnVuY3Rpb24gbGV4KCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIHRva2VuO1xuXHQgICAgICAgICAgICAgICAgdG9rZW4gPSBzZWxmLmxleGVyLmxleCgpIHx8IDE7XG5cdCAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRva2VuICE9PSBcIm51bWJlclwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBzZWxmLnN5bWJvbHNfW3Rva2VuXSB8fCB0b2tlbjtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB2YXIgc3ltYm9sLFxuXHQgICAgICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wsXG5cdCAgICAgICAgICAgICAgICBzdGF0ZSxcblx0ICAgICAgICAgICAgICAgIGFjdGlvbixcblx0ICAgICAgICAgICAgICAgIGEsXG5cdCAgICAgICAgICAgICAgICByLFxuXHQgICAgICAgICAgICAgICAgeXl2YWwgPSB7fSxcblx0ICAgICAgICAgICAgICAgIHAsXG5cdCAgICAgICAgICAgICAgICBsZW4sXG5cdCAgICAgICAgICAgICAgICBuZXdTdGF0ZSxcblx0ICAgICAgICAgICAgICAgIGV4cGVjdGVkO1xuXHQgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuXHQgICAgICAgICAgICAgICAgc3RhdGUgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRBY3Rpb25zW3N0YXRlXSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IHRoaXMuZGVmYXVsdEFjdGlvbnNbc3RhdGVdO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoc3ltYm9sID09PSBudWxsIHx8IHR5cGVvZiBzeW1ib2wgPT0gXCJ1bmRlZmluZWRcIikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBsZXgoKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gdGFibGVbc3RhdGVdICYmIHRhYmxlW3N0YXRlXVtzeW1ib2xdO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09IFwidW5kZWZpbmVkXCIgfHwgIWFjdGlvbi5sZW5ndGggfHwgIWFjdGlvblswXSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBlcnJTdHIgPSBcIlwiO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICghcmVjb3ZlcmluZykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHAgaW4gdGFibGVbc3RhdGVdKSBpZiAodGhpcy50ZXJtaW5hbHNfW3BdICYmIHAgPiAyKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZC5wdXNoKFwiJ1wiICsgdGhpcy50ZXJtaW5hbHNfW3BdICsgXCInXCIpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnNob3dQb3NpdGlvbikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gXCJQYXJzZSBlcnJvciBvbiBsaW5lIFwiICsgKHl5bGluZW5vICsgMSkgKyBcIjpcXG5cIiArIHRoaXMubGV4ZXIuc2hvd1Bvc2l0aW9uKCkgKyBcIlxcbkV4cGVjdGluZyBcIiArIGV4cGVjdGVkLmpvaW4oXCIsIFwiKSArIFwiLCBnb3QgJ1wiICsgKHRoaXMudGVybWluYWxzX1tzeW1ib2xdIHx8IHN5bWJvbCkgKyBcIidcIjtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyclN0ciA9IFwiUGFyc2UgZXJyb3Igb24gbGluZSBcIiArICh5eWxpbmVubyArIDEpICsgXCI6IFVuZXhwZWN0ZWQgXCIgKyAoc3ltYm9sID09IDEgPyBcImVuZCBvZiBpbnB1dFwiIDogXCInXCIgKyAodGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sKSArIFwiJ1wiKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRXJyb3IoZXJyU3RyLCB7IHRleHQ6IHRoaXMubGV4ZXIubWF0Y2gsIHRva2VuOiB0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wsIGxpbmU6IHRoaXMubGV4ZXIueXlsaW5lbm8sIGxvYzogeXlsb2MsIGV4cGVjdGVkOiBleHBlY3RlZCB9KTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAoYWN0aW9uWzBdIGluc3RhbmNlb2YgQXJyYXkgJiYgYWN0aW9uLmxlbmd0aCA+IDEpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXJzZSBFcnJvcjogbXVsdGlwbGUgYWN0aW9ucyBwb3NzaWJsZSBhdCBzdGF0ZTogXCIgKyBzdGF0ZSArIFwiLCB0b2tlbjogXCIgKyBzeW1ib2wpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgc3dpdGNoIChhY3Rpb25bMF0pIHtcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3ltYm9sKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdnN0YWNrLnB1c2godGhpcy5sZXhlci55eXRleHQpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBsc3RhY2sucHVzaCh0aGlzLmxleGVyLnl5bGxvYyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYWN0aW9uWzFdKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwcmVFcnJvclN5bWJvbCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgeXlsZW5nID0gdGhpcy5sZXhlci55eWxlbmc7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB5eXRleHQgPSB0aGlzLmxleGVyLnl5dGV4dDtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHl5bGluZW5vID0gdGhpcy5sZXhlci55eWxpbmVubztcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHl5bG9jID0gdGhpcy5sZXhlci55eWxsb2M7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVjb3ZlcmluZyA+IDApIHJlY292ZXJpbmctLTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IHByZUVycm9yU3ltYm9sO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wgPSBudWxsO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbGVuID0gdGhpcy5wcm9kdWN0aW9uc19bYWN0aW9uWzFdXVsxXTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeXl2YWwuJCA9IHZzdGFja1t2c3RhY2subGVuZ3RoIC0gbGVuXTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeXl2YWwuXyQgPSB7IGZpcnN0X2xpbmU6IGxzdGFja1tsc3RhY2subGVuZ3RoIC0gKGxlbiB8fCAxKV0uZmlyc3RfbGluZSwgbGFzdF9saW5lOiBsc3RhY2tbbHN0YWNrLmxlbmd0aCAtIDFdLmxhc3RfbGluZSwgZmlyc3RfY29sdW1uOiBsc3RhY2tbbHN0YWNrLmxlbmd0aCAtIChsZW4gfHwgMSldLmZpcnN0X2NvbHVtbiwgbGFzdF9jb2x1bW46IGxzdGFja1tsc3RhY2subGVuZ3RoIC0gMV0ubGFzdF9jb2x1bW4gfTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlcykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgeXl2YWwuXyQucmFuZ2UgPSBbbHN0YWNrW2xzdGFjay5sZW5ndGggLSAobGVuIHx8IDEpXS5yYW5nZVswXSwgbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5yYW5nZVsxXV07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgciA9IHRoaXMucGVyZm9ybUFjdGlvbi5jYWxsKHl5dmFsLCB5eXRleHQsIHl5bGVuZywgeXlsaW5lbm8sIHRoaXMueXksIGFjdGlvblsxXSwgdnN0YWNrLCBsc3RhY2spO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHIgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZW4pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrID0gc3RhY2suc2xpY2UoMCwgLTEgKiBsZW4gKiAyKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZzdGFjayA9IHZzdGFjay5zbGljZSgwLCAtMSAqIGxlbik7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBsc3RhY2sgPSBsc3RhY2suc2xpY2UoMCwgLTEgKiBsZW4pO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godGhpcy5wcm9kdWN0aW9uc19bYWN0aW9uWzFdXVswXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZzdGFjay5wdXNoKHl5dmFsLiQpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBsc3RhY2sucHVzaCh5eXZhbC5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlID0gdGFibGVbc3RhY2tbc3RhY2subGVuZ3RoIC0gMl1dW3N0YWNrW3N0YWNrLmxlbmd0aCAtIDFdXTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXdTdGF0ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0ICAgIC8qIEppc29uIGdlbmVyYXRlZCBsZXhlciAqL1xuXHQgICAgdmFyIGxleGVyID0gKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICB2YXIgbGV4ZXIgPSB7IEVPRjogMSxcblx0ICAgICAgICAgICAgcGFyc2VFcnJvcjogZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLnl5LnBhcnNlcikge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXkucGFyc2VyLnBhcnNlRXJyb3Ioc3RyLCBoYXNoKTtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0cik7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHNldElucHV0OiBmdW5jdGlvbiBzZXRJbnB1dChpbnB1dCkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcblx0ICAgICAgICAgICAgICAgIHRoaXMuX21vcmUgPSB0aGlzLl9sZXNzID0gdGhpcy5kb25lID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnl5bGluZW5vID0gdGhpcy55eWxlbmcgPSAwO1xuXHQgICAgICAgICAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLm1hdGNoZWQgPSB0aGlzLm1hdGNoID0gJyc7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbmRpdGlvblN0YWNrID0gWydJTklUSUFMJ107XG5cdCAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYyA9IHsgZmlyc3RfbGluZTogMSwgZmlyc3RfY29sdW1uOiAwLCBsYXN0X2xpbmU6IDEsIGxhc3RfY29sdW1uOiAwIH07XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykgdGhpcy55eWxsb2MucmFuZ2UgPSBbMCwgMF07XG5cdCAgICAgICAgICAgICAgICB0aGlzLm9mZnNldCA9IDA7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaW5wdXQ6IGZ1bmN0aW9uIGlucHV0KCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIGNoID0gdGhpcy5faW5wdXRbMF07XG5cdCAgICAgICAgICAgICAgICB0aGlzLnl5dGV4dCArPSBjaDtcblx0ICAgICAgICAgICAgICAgIHRoaXMueXlsZW5nKys7XG5cdCAgICAgICAgICAgICAgICB0aGlzLm9mZnNldCsrO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5tYXRjaCArPSBjaDtcblx0ICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlZCArPSBjaDtcblx0ICAgICAgICAgICAgICAgIHZhciBsaW5lcyA9IGNoLm1hdGNoKC8oPzpcXHJcXG4/fFxcbikuKi9nKTtcblx0ICAgICAgICAgICAgICAgIGlmIChsaW5lcykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXlsaW5lbm8rKztcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYy5sYXN0X2xpbmUrKztcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eWxsb2MubGFzdF9jb2x1bW4rKztcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZ2VzKSB0aGlzLnl5bGxvYy5yYW5nZVsxXSsrO1xuXG5cdCAgICAgICAgICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKDEpO1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGNoO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICB1bnB1dDogZnVuY3Rpb24gdW5wdXQoY2gpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBsZW4gPSBjaC5sZW5ndGg7XG5cdCAgICAgICAgICAgICAgICB2YXIgbGluZXMgPSBjaC5zcGxpdCgvKD86XFxyXFxuP3xcXG4pL2cpO1xuXG5cdCAgICAgICAgICAgICAgICB0aGlzLl9pbnB1dCA9IGNoICsgdGhpcy5faW5wdXQ7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnl5dGV4dCA9IHRoaXMueXl0ZXh0LnN1YnN0cigwLCB0aGlzLnl5dGV4dC5sZW5ndGggLSBsZW4gLSAxKTtcblx0ICAgICAgICAgICAgICAgIC8vdGhpcy55eWxlbmcgLT0gbGVuO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5vZmZzZXQgLT0gbGVuO1xuXHQgICAgICAgICAgICAgICAgdmFyIG9sZExpbmVzID0gdGhpcy5tYXRjaC5zcGxpdCgvKD86XFxyXFxuP3xcXG4pL2cpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5tYXRjaCA9IHRoaXMubWF0Y2guc3Vic3RyKDAsIHRoaXMubWF0Y2gubGVuZ3RoIC0gMSk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLm1hdGNoZWQgPSB0aGlzLm1hdGNoZWQuc3Vic3RyKDAsIHRoaXMubWF0Y2hlZC5sZW5ndGggLSAxKTtcblxuXHQgICAgICAgICAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCAtIDEpIHRoaXMueXlsaW5lbm8gLT0gbGluZXMubGVuZ3RoIC0gMTtcblx0ICAgICAgICAgICAgICAgIHZhciByID0gdGhpcy55eWxsb2MucmFuZ2U7XG5cblx0ICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jID0geyBmaXJzdF9saW5lOiB0aGlzLnl5bGxvYy5maXJzdF9saW5lLFxuXHQgICAgICAgICAgICAgICAgICAgIGxhc3RfbGluZTogdGhpcy55eWxpbmVubyArIDEsXG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5maXJzdF9jb2x1bW4sXG5cdCAgICAgICAgICAgICAgICAgICAgbGFzdF9jb2x1bW46IGxpbmVzID8gKGxpbmVzLmxlbmd0aCA9PT0gb2xkTGluZXMubGVuZ3RoID8gdGhpcy55eWxsb2MuZmlyc3RfY29sdW1uIDogMCkgKyBvbGRMaW5lc1tvbGRMaW5lcy5sZW5ndGggLSBsaW5lcy5sZW5ndGhdLmxlbmd0aCAtIGxpbmVzWzBdLmxlbmd0aCA6IHRoaXMueXlsbG9jLmZpcnN0X2NvbHVtbiAtIGxlblxuXHQgICAgICAgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYy5yYW5nZSA9IFtyWzBdLCByWzBdICsgdGhpcy55eWxlbmcgLSBsZW5dO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG1vcmU6IGZ1bmN0aW9uIG1vcmUoKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLl9tb3JlID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBsZXNzOiBmdW5jdGlvbiBsZXNzKG4pIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMudW5wdXQodGhpcy5tYXRjaC5zbGljZShuKSk7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHBhc3RJbnB1dDogZnVuY3Rpb24gcGFzdElucHV0KCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIHBhc3QgPSB0aGlzLm1hdGNoZWQuc3Vic3RyKDAsIHRoaXMubWF0Y2hlZC5sZW5ndGggLSB0aGlzLm1hdGNoLmxlbmd0aCk7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gKHBhc3QubGVuZ3RoID4gMjAgPyAnLi4uJyA6ICcnKSArIHBhc3Quc3Vic3RyKC0yMCkucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICB1cGNvbWluZ0lucHV0OiBmdW5jdGlvbiB1cGNvbWluZ0lucHV0KCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIG5leHQgPSB0aGlzLm1hdGNoO1xuXHQgICAgICAgICAgICAgICAgaWYgKG5leHQubGVuZ3RoIDwgMjApIHtcblx0ICAgICAgICAgICAgICAgICAgICBuZXh0ICs9IHRoaXMuX2lucHV0LnN1YnN0cigwLCAyMCAtIG5leHQubGVuZ3RoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIHJldHVybiAobmV4dC5zdWJzdHIoMCwgMjApICsgKG5leHQubGVuZ3RoID4gMjAgPyAnLi4uJyA6ICcnKSkucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBzaG93UG9zaXRpb246IGZ1bmN0aW9uIHNob3dQb3NpdGlvbigpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBwcmUgPSB0aGlzLnBhc3RJbnB1dCgpO1xuXHQgICAgICAgICAgICAgICAgdmFyIGMgPSBuZXcgQXJyYXkocHJlLmxlbmd0aCArIDEpLmpvaW4oXCItXCIpO1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHByZSArIHRoaXMudXBjb21pbmdJbnB1dCgpICsgXCJcXG5cIiArIGMgKyBcIl5cIjtcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dCgpIHtcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvbmUpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5FT0Y7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2lucHV0KSB0aGlzLmRvbmUgPSB0cnVlO1xuXG5cdCAgICAgICAgICAgICAgICB2YXIgdG9rZW4sIG1hdGNoLCB0ZW1wTWF0Y2gsIGluZGV4LCBjb2wsIGxpbmVzO1xuXHQgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9tb3JlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eXRleHQgPSAnJztcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGNoID0gJyc7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB2YXIgcnVsZXMgPSB0aGlzLl9jdXJyZW50UnVsZXMoKTtcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgICAgICB0ZW1wTWF0Y2ggPSB0aGlzLl9pbnB1dC5tYXRjaCh0aGlzLnJ1bGVzW3J1bGVzW2ldXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXBNYXRjaCAmJiAoIW1hdGNoIHx8IHRlbXBNYXRjaFswXS5sZW5ndGggPiBtYXRjaFswXS5sZW5ndGgpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gdGVtcE1hdGNoO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmZsZXgpIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGxpbmVzID0gbWF0Y2hbMF0ubWF0Y2goLyg/Olxcclxcbj98XFxuKS4qL2cpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmIChsaW5lcykgdGhpcy55eWxpbmVubyArPSBsaW5lcy5sZW5ndGg7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eWxsb2MgPSB7IGZpcnN0X2xpbmU6IHRoaXMueXlsbG9jLmxhc3RfbGluZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9saW5lOiB0aGlzLnl5bGluZW5vICsgMSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9jb2x1bW46IGxpbmVzID8gbGluZXNbbGluZXMubGVuZ3RoIC0gMV0ubGVuZ3RoIC0gbGluZXNbbGluZXMubGVuZ3RoIC0gMV0ubWF0Y2goL1xccj9cXG4/LylbMF0ubGVuZ3RoIDogdGhpcy55eWxsb2MubGFzdF9jb2x1bW4gKyBtYXRjaFswXS5sZW5ndGggfTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5dGV4dCArPSBtYXRjaFswXTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGNoICs9IG1hdGNoWzBdO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlcyA9IG1hdGNoO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXlsZW5nID0gdGhpcy55eXRleHQubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZ2VzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jLnJhbmdlID0gW3RoaXMub2Zmc2V0LCB0aGlzLm9mZnNldCArPSB0aGlzLnl5bGVuZ107XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX21vcmUgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKG1hdGNoWzBdLmxlbmd0aCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRjaGVkICs9IG1hdGNoWzBdO1xuXHQgICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5wZXJmb3JtQWN0aW9uLmNhbGwodGhpcywgdGhpcy55eSwgdGhpcywgcnVsZXNbaW5kZXhdLCB0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoIC0gMV0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvbmUgJiYgdGhpcy5faW5wdXQpIHRoaXMuZG9uZSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikgcmV0dXJuIHRva2VuO2Vsc2UgcmV0dXJuO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lucHV0ID09PSBcIlwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuRU9GO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUVycm9yKCdMZXhpY2FsIGVycm9yIG9uIGxpbmUgJyArICh0aGlzLnl5bGluZW5vICsgMSkgKyAnLiBVbnJlY29nbml6ZWQgdGV4dC5cXG4nICsgdGhpcy5zaG93UG9zaXRpb24oKSwgeyB0ZXh0OiBcIlwiLCB0b2tlbjogbnVsbCwgbGluZTogdGhpcy55eWxpbmVubyB9KTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgbGV4OiBmdW5jdGlvbiBsZXgoKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgciA9IHRoaXMubmV4dCgpO1xuXHQgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiByO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZXgoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgYmVnaW46IGZ1bmN0aW9uIGJlZ2luKGNvbmRpdGlvbikge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5jb25kaXRpb25TdGFjay5wdXNoKGNvbmRpdGlvbik7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHBvcFN0YXRlOiBmdW5jdGlvbiBwb3BTdGF0ZSgpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvblN0YWNrLnBvcCgpO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfY3VycmVudFJ1bGVzOiBmdW5jdGlvbiBfY3VycmVudFJ1bGVzKCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uc1t0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoIC0gMV1dLnJ1bGVzO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICB0b3BTdGF0ZTogZnVuY3Rpb24gdG9wU3RhdGUoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDJdO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBwdXNoU3RhdGU6IGZ1bmN0aW9uIGJlZ2luKGNvbmRpdGlvbikge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5iZWdpbihjb25kaXRpb24pO1xuXHQgICAgICAgICAgICB9IH07XG5cdCAgICAgICAgbGV4ZXIub3B0aW9ucyA9IHt9O1xuXHQgICAgICAgIGxleGVyLnBlcmZvcm1BY3Rpb24gPSBmdW5jdGlvbiBhbm9ueW1vdXMoeXksIHl5XywgJGF2b2lkaW5nX25hbWVfY29sbGlzaW9ucywgWVlfU1RBUlRcblx0ICAgICAgICAvKiovKSB7XG5cblx0ICAgICAgICAgICAgZnVuY3Rpb24gc3RyaXAoc3RhcnQsIGVuZCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHl5Xy55eXRleHQgPSB5eV8ueXl0ZXh0LnN1YnN0cihzdGFydCwgeXlfLnl5bGVuZyAtIGVuZCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICB2YXIgWVlTVEFURSA9IFlZX1NUQVJUO1xuXHQgICAgICAgICAgICBzd2l0Y2ggKCRhdm9pZGluZ19uYW1lX2NvbGxpc2lvbnMpIHtcblx0ICAgICAgICAgICAgICAgIGNhc2UgMDpcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoeXlfLnl5dGV4dC5zbGljZSgtMikgPT09IFwiXFxcXFxcXFxcIikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdHJpcCgwLCAxKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpbihcIm11XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoeXlfLnl5dGV4dC5zbGljZSgtMSkgPT09IFwiXFxcXFwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0cmlwKDAsIDEpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKFwiZW11XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmVnaW4oXCJtdVwiKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHl5Xy55eXRleHQpIHJldHVybiAxNTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE1O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpbigncmF3Jyk7cmV0dXJuIDE1O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtcblx0ICAgICAgICAgICAgICAgICAgICAvLyBTaG91bGQgYmUgdXNpbmcgYHRoaXMudG9wU3RhdGUoKWAgYmVsb3csIGJ1dCBpdCBjdXJyZW50bHlcblx0ICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm5zIHRoZSBzZWNvbmQgdG9wIGluc3RlYWQgb2YgdGhlIGZpcnN0IHRvcC4gT3BlbmVkIGFuXG5cdCAgICAgICAgICAgICAgICAgICAgLy8gaXNzdWUgYWJvdXQgaXQgYXQgaHR0cHM6Ly9naXRodWIuY29tL3phYWNoL2ppc29uL2lzc3Vlcy8yOTFcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDFdID09PSAncmF3Jykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTU7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeXlfLnl5dGV4dCA9IHl5Xy55eXRleHQuc3Vic3RyKDUsIHl5Xy55eWxlbmcgLSA5KTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdFTkRfUkFXX0JMT0NLJztcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTU7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNDtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA3OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA2NTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgODpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNjg7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDk6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE5O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpbigncmF3Jyk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDIzO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDExOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA1NTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDYwO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMzpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE0OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA0Nztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTU6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO3JldHVybiA0NDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO3JldHVybiA0NDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTc6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDM0O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxODpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMzk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE5OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA1MTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjA6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDQ4O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyMTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnVucHV0KHl5Xy55eXRleHQpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKCdjb20nKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyMjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE0O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIzOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA0ODtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjQ6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDczO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyNTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNzI7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI2OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA3Mjtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjc6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDg3O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyODpcblx0ICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgd2hpdGVzcGFjZVxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyOTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7cmV0dXJuIDU0O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7cmV0dXJuIDMzO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMTpcblx0ICAgICAgICAgICAgICAgICAgICB5eV8ueXl0ZXh0ID0gc3RyaXAoMSwgMikucmVwbGFjZSgvXFxcXFwiL2csICdcIicpO3JldHVybiA4MDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzI6XG5cdCAgICAgICAgICAgICAgICAgICAgeXlfLnl5dGV4dCA9IHN0cmlwKDEsIDIpLnJlcGxhY2UoL1xcXFwnL2csIFwiJ1wiKTtyZXR1cm4gODA7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDMzOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA4NTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzQ6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDgyO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzNTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gODI7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM2OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA4Mztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzc6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDg0O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzODpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gODE7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM5OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA3NTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDA6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDc3O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0MTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNzI7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQyOlxuXHQgICAgICAgICAgICAgICAgICAgIHl5Xy55eXRleHQgPSB5eV8ueXl0ZXh0LnJlcGxhY2UoL1xcXFwoW1xcXFxcXF1dKS9nLCAnJDEnKTtyZXR1cm4gNzI7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQzOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAnSU5WQUxJRCc7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ0OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA1O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfTtcblx0ICAgICAgICBsZXhlci5ydWxlcyA9IFsvXig/OlteXFx4MDBdKj8oPz0oXFx7XFx7KSkpLywgL14oPzpbXlxceDAwXSspLywgL14oPzpbXlxceDAwXXsyLH0/KD89KFxce1xce3xcXFxcXFx7XFx7fFxcXFxcXFxcXFx7XFx7fCQpKSkvLCAvXig/Olxce1xce1xce1xceyg/PVteXFwvXSkpLywgL14oPzpcXHtcXHtcXHtcXHtcXC9bXlxccyFcIiMlLSxcXC5cXC87LT5AXFxbLVxcXmBcXHstfl0rKD89Wz19XFxzXFwvLl0pXFx9XFx9XFx9XFx9KS8sIC9eKD86W15cXHgwMF0qPyg/PShcXHtcXHtcXHtcXHspKSkvLCAvXig/OltcXHNcXFNdKj8tLSh+KT9cXH1cXH0pLywgL14oPzpcXCgpLywgL14oPzpcXCkpLywgL14oPzpcXHtcXHtcXHtcXHspLywgL14oPzpcXH1cXH1cXH1cXH0pLywgL14oPzpcXHtcXHsofik/PikvLCAvXig/Olxce1xceyh+KT8jPikvLCAvXig/Olxce1xceyh+KT8jXFwqPykvLCAvXig/Olxce1xceyh+KT9cXC8pLywgL14oPzpcXHtcXHsofik/XFxeXFxzKih+KT9cXH1cXH0pLywgL14oPzpcXHtcXHsofik/XFxzKmVsc2VcXHMqKH4pP1xcfVxcfSkvLCAvXig/Olxce1xceyh+KT9cXF4pLywgL14oPzpcXHtcXHsofik/XFxzKmVsc2VcXGIpLywgL14oPzpcXHtcXHsofik/XFx7KS8sIC9eKD86XFx7XFx7KH4pPyYpLywgL14oPzpcXHtcXHsofik/IS0tKS8sIC9eKD86XFx7XFx7KH4pPyFbXFxzXFxTXSo/XFx9XFx9KS8sIC9eKD86XFx7XFx7KH4pP1xcKj8pLywgL14oPzo9KS8sIC9eKD86XFwuXFwuKS8sIC9eKD86XFwuKD89KFs9fn1cXHNcXC8uKXxdKSkpLywgL14oPzpbXFwvLl0pLywgL14oPzpcXHMrKS8sIC9eKD86XFx9KH4pP1xcfVxcfSkvLCAvXig/Oih+KT9cXH1cXH0pLywgL14oPzpcIihcXFxcW1wiXXxbXlwiXSkqXCIpLywgL14oPzonKFxcXFxbJ118W14nXSkqJykvLCAvXig/OkApLywgL14oPzp0cnVlKD89KFt+fVxccyldKSkpLywgL14oPzpmYWxzZSg/PShbfn1cXHMpXSkpKS8sIC9eKD86dW5kZWZpbmVkKD89KFt+fVxccyldKSkpLywgL14oPzpudWxsKD89KFt+fVxccyldKSkpLywgL14oPzotP1swLTldKyg/OlxcLlswLTldKyk/KD89KFt+fVxccyldKSkpLywgL14oPzphc1xccytcXHwpLywgL14oPzpcXHwpLywgL14oPzooW15cXHMhXCIjJS0sXFwuXFwvOy0+QFxcWy1cXF5gXFx7LX5dKyg/PShbPX59XFxzXFwvLil8XSkpKSkvLCAvXig/OlxcWyhcXFxcXFxdfFteXFxdXSkqXFxdKS8sIC9eKD86LikvLCAvXig/OiQpL107XG5cdCAgICAgICAgbGV4ZXIuY29uZGl0aW9ucyA9IHsgXCJtdVwiOiB7IFwicnVsZXNcIjogWzcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5LCAyMCwgMjEsIDIyLCAyMywgMjQsIDI1LCAyNiwgMjcsIDI4LCAyOSwgMzAsIDMxLCAzMiwgMzMsIDM0LCAzNSwgMzYsIDM3LCAzOCwgMzksIDQwLCA0MSwgNDIsIDQzLCA0NF0sIFwiaW5jbHVzaXZlXCI6IGZhbHNlIH0sIFwiZW11XCI6IHsgXCJydWxlc1wiOiBbMl0sIFwiaW5jbHVzaXZlXCI6IGZhbHNlIH0sIFwiY29tXCI6IHsgXCJydWxlc1wiOiBbNl0sIFwiaW5jbHVzaXZlXCI6IGZhbHNlIH0sIFwicmF3XCI6IHsgXCJydWxlc1wiOiBbMywgNCwgNV0sIFwiaW5jbHVzaXZlXCI6IGZhbHNlIH0sIFwiSU5JVElBTFwiOiB7IFwicnVsZXNcIjogWzAsIDEsIDQ0XSwgXCJpbmNsdXNpdmVcIjogdHJ1ZSB9IH07XG5cdCAgICAgICAgcmV0dXJuIGxleGVyO1xuXHQgICAgfSkoKTtcblx0ICAgIHBhcnNlci5sZXhlciA9IGxleGVyO1xuXHQgICAgZnVuY3Rpb24gUGFyc2VyKCkge1xuXHQgICAgICAgIHRoaXMueXkgPSB7fTtcblx0ICAgIH1QYXJzZXIucHJvdG90eXBlID0gcGFyc2VyO3BhcnNlci5QYXJzZXIgPSBQYXJzZXI7XG5cdCAgICByZXR1cm4gbmV3IFBhcnNlcigpO1xuXHR9KSgpO2V4cG9ydHNbXCJkZWZhdWx0XCJdID0gaGFuZGxlYmFycztcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTtcblxuLyoqKi8gfSksXG4vKiAzOCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfdmlzaXRvciA9IF9fd2VicGFja19yZXF1aXJlX18oMzkpO1xuXG5cdHZhciBfdmlzaXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF92aXNpdG9yKTtcblxuXHRmdW5jdGlvbiBXaGl0ZXNwYWNlQ29udHJvbCgpIHtcblx0ICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG5cdCAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0fVxuXHRXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUgPSBuZXcgX3Zpc2l0b3IyWydkZWZhdWx0J10oKTtcblxuXHRXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuUHJvZ3JhbSA9IGZ1bmN0aW9uIChwcm9ncmFtKSB7XG5cdCAgdmFyIGRvU3RhbmRhbG9uZSA9ICF0aGlzLm9wdGlvbnMuaWdub3JlU3RhbmRhbG9uZTtcblxuXHQgIHZhciBpc1Jvb3QgPSAhdGhpcy5pc1Jvb3RTZWVuO1xuXHQgIHRoaXMuaXNSb290U2VlbiA9IHRydWU7XG5cblx0ICB2YXIgYm9keSA9IHByb2dyYW0uYm9keTtcblx0ICBmb3IgKHZhciBpID0gMCwgbCA9IGJvZHkubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICB2YXIgY3VycmVudCA9IGJvZHlbaV0sXG5cdCAgICAgICAgc3RyaXAgPSB0aGlzLmFjY2VwdChjdXJyZW50KTtcblxuXHQgICAgaWYgKCFzdHJpcCkge1xuXHQgICAgICBjb250aW51ZTtcblx0ICAgIH1cblxuXHQgICAgdmFyIF9pc1ByZXZXaGl0ZXNwYWNlID0gaXNQcmV2V2hpdGVzcGFjZShib2R5LCBpLCBpc1Jvb3QpLFxuXHQgICAgICAgIF9pc05leHRXaGl0ZXNwYWNlID0gaXNOZXh0V2hpdGVzcGFjZShib2R5LCBpLCBpc1Jvb3QpLFxuXHQgICAgICAgIG9wZW5TdGFuZGFsb25lID0gc3RyaXAub3BlblN0YW5kYWxvbmUgJiYgX2lzUHJldldoaXRlc3BhY2UsXG5cdCAgICAgICAgY2xvc2VTdGFuZGFsb25lID0gc3RyaXAuY2xvc2VTdGFuZGFsb25lICYmIF9pc05leHRXaGl0ZXNwYWNlLFxuXHQgICAgICAgIGlubGluZVN0YW5kYWxvbmUgPSBzdHJpcC5pbmxpbmVTdGFuZGFsb25lICYmIF9pc1ByZXZXaGl0ZXNwYWNlICYmIF9pc05leHRXaGl0ZXNwYWNlO1xuXG5cdCAgICBpZiAoc3RyaXAuY2xvc2UpIHtcblx0ICAgICAgb21pdFJpZ2h0KGJvZHksIGksIHRydWUpO1xuXHQgICAgfVxuXHQgICAgaWYgKHN0cmlwLm9wZW4pIHtcblx0ICAgICAgb21pdExlZnQoYm9keSwgaSwgdHJ1ZSk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChkb1N0YW5kYWxvbmUgJiYgaW5saW5lU3RhbmRhbG9uZSkge1xuXHQgICAgICBvbWl0UmlnaHQoYm9keSwgaSk7XG5cblx0ICAgICAgaWYgKG9taXRMZWZ0KGJvZHksIGkpKSB7XG5cdCAgICAgICAgLy8gSWYgd2UgYXJlIG9uIGEgc3RhbmRhbG9uZSBub2RlLCBzYXZlIHRoZSBpbmRlbnQgaW5mbyBmb3IgcGFydGlhbHNcblx0ICAgICAgICBpZiAoY3VycmVudC50eXBlID09PSAnUGFydGlhbFN0YXRlbWVudCcpIHtcblx0ICAgICAgICAgIC8vIFB1bGwgb3V0IHRoZSB3aGl0ZXNwYWNlIGZyb20gdGhlIGZpbmFsIGxpbmVcblx0ICAgICAgICAgIGN1cnJlbnQuaW5kZW50ID0gLyhbIFxcdF0rJCkvLmV4ZWMoYm9keVtpIC0gMV0ub3JpZ2luYWwpWzFdO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgaWYgKGRvU3RhbmRhbG9uZSAmJiBvcGVuU3RhbmRhbG9uZSkge1xuXHQgICAgICBvbWl0UmlnaHQoKGN1cnJlbnQucHJvZ3JhbSB8fCBjdXJyZW50LmludmVyc2UpLmJvZHkpO1xuXG5cdCAgICAgIC8vIFN0cmlwIG91dCB0aGUgcHJldmlvdXMgY29udGVudCBub2RlIGlmIGl0J3Mgd2hpdGVzcGFjZSBvbmx5XG5cdCAgICAgIG9taXRMZWZ0KGJvZHksIGkpO1xuXHQgICAgfVxuXHQgICAgaWYgKGRvU3RhbmRhbG9uZSAmJiBjbG9zZVN0YW5kYWxvbmUpIHtcblx0ICAgICAgLy8gQWx3YXlzIHN0cmlwIHRoZSBuZXh0IG5vZGVcblx0ICAgICAgb21pdFJpZ2h0KGJvZHksIGkpO1xuXG5cdCAgICAgIG9taXRMZWZ0KChjdXJyZW50LmludmVyc2UgfHwgY3VycmVudC5wcm9ncmFtKS5ib2R5KTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICByZXR1cm4gcHJvZ3JhbTtcblx0fTtcblxuXHRXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuQmxvY2tTdGF0ZW1lbnQgPSBXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuRGVjb3JhdG9yQmxvY2sgPSBXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuUGFydGlhbEJsb2NrU3RhdGVtZW50ID0gZnVuY3Rpb24gKGJsb2NrKSB7XG5cdCAgdGhpcy5hY2NlcHQoYmxvY2sucHJvZ3JhbSk7XG5cdCAgdGhpcy5hY2NlcHQoYmxvY2suaW52ZXJzZSk7XG5cblx0ICAvLyBGaW5kIHRoZSBpbnZlcnNlIHByb2dyYW0gdGhhdCBpcyBpbnZvbGVkIHdpdGggd2hpdGVzcGFjZSBzdHJpcHBpbmcuXG5cdCAgdmFyIHByb2dyYW0gPSBibG9jay5wcm9ncmFtIHx8IGJsb2NrLmludmVyc2UsXG5cdCAgICAgIGludmVyc2UgPSBibG9jay5wcm9ncmFtICYmIGJsb2NrLmludmVyc2UsXG5cdCAgICAgIGZpcnN0SW52ZXJzZSA9IGludmVyc2UsXG5cdCAgICAgIGxhc3RJbnZlcnNlID0gaW52ZXJzZTtcblxuXHQgIGlmIChpbnZlcnNlICYmIGludmVyc2UuY2hhaW5lZCkge1xuXHQgICAgZmlyc3RJbnZlcnNlID0gaW52ZXJzZS5ib2R5WzBdLnByb2dyYW07XG5cblx0ICAgIC8vIFdhbGsgdGhlIGludmVyc2UgY2hhaW4gdG8gZmluZCB0aGUgbGFzdCBpbnZlcnNlIHRoYXQgaXMgYWN0dWFsbHkgaW4gdGhlIGNoYWluLlxuXHQgICAgd2hpbGUgKGxhc3RJbnZlcnNlLmNoYWluZWQpIHtcblx0ICAgICAgbGFzdEludmVyc2UgPSBsYXN0SW52ZXJzZS5ib2R5W2xhc3RJbnZlcnNlLmJvZHkubGVuZ3RoIC0gMV0ucHJvZ3JhbTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICB2YXIgc3RyaXAgPSB7XG5cdCAgICBvcGVuOiBibG9jay5vcGVuU3RyaXAub3Blbixcblx0ICAgIGNsb3NlOiBibG9jay5jbG9zZVN0cmlwLmNsb3NlLFxuXG5cdCAgICAvLyBEZXRlcm1pbmUgdGhlIHN0YW5kYWxvbmUgY2FuZGlhY3kuIEJhc2ljYWxseSBmbGFnIG91ciBjb250ZW50IGFzIGJlaW5nIHBvc3NpYmx5IHN0YW5kYWxvbmVcblx0ICAgIC8vIHNvIG91ciBwYXJlbnQgY2FuIGRldGVybWluZSBpZiB3ZSBhY3R1YWxseSBhcmUgc3RhbmRhbG9uZVxuXHQgICAgb3BlblN0YW5kYWxvbmU6IGlzTmV4dFdoaXRlc3BhY2UocHJvZ3JhbS5ib2R5KSxcblx0ICAgIGNsb3NlU3RhbmRhbG9uZTogaXNQcmV2V2hpdGVzcGFjZSgoZmlyc3RJbnZlcnNlIHx8IHByb2dyYW0pLmJvZHkpXG5cdCAgfTtcblxuXHQgIGlmIChibG9jay5vcGVuU3RyaXAuY2xvc2UpIHtcblx0ICAgIG9taXRSaWdodChwcm9ncmFtLmJvZHksIG51bGwsIHRydWUpO1xuXHQgIH1cblxuXHQgIGlmIChpbnZlcnNlKSB7XG5cdCAgICB2YXIgaW52ZXJzZVN0cmlwID0gYmxvY2suaW52ZXJzZVN0cmlwO1xuXG5cdCAgICBpZiAoaW52ZXJzZVN0cmlwLm9wZW4pIHtcblx0ICAgICAgb21pdExlZnQocHJvZ3JhbS5ib2R5LCBudWxsLCB0cnVlKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGludmVyc2VTdHJpcC5jbG9zZSkge1xuXHQgICAgICBvbWl0UmlnaHQoZmlyc3RJbnZlcnNlLmJvZHksIG51bGwsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgaWYgKGJsb2NrLmNsb3NlU3RyaXAub3Blbikge1xuXHQgICAgICBvbWl0TGVmdChsYXN0SW52ZXJzZS5ib2R5LCBudWxsLCB0cnVlKTtcblx0ICAgIH1cblxuXHQgICAgLy8gRmluZCBzdGFuZGFsb25lIGVsc2Ugc3RhdG1lbnRzXG5cdCAgICBpZiAoIXRoaXMub3B0aW9ucy5pZ25vcmVTdGFuZGFsb25lICYmIGlzUHJldldoaXRlc3BhY2UocHJvZ3JhbS5ib2R5KSAmJiBpc05leHRXaGl0ZXNwYWNlKGZpcnN0SW52ZXJzZS5ib2R5KSkge1xuXHQgICAgICBvbWl0TGVmdChwcm9ncmFtLmJvZHkpO1xuXHQgICAgICBvbWl0UmlnaHQoZmlyc3RJbnZlcnNlLmJvZHkpO1xuXHQgICAgfVxuXHQgIH0gZWxzZSBpZiAoYmxvY2suY2xvc2VTdHJpcC5vcGVuKSB7XG5cdCAgICBvbWl0TGVmdChwcm9ncmFtLmJvZHksIG51bGwsIHRydWUpO1xuXHQgIH1cblxuXHQgIHJldHVybiBzdHJpcDtcblx0fTtcblxuXHRXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuRGVjb3JhdG9yID0gV2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLk11c3RhY2hlU3RhdGVtZW50ID0gZnVuY3Rpb24gKG11c3RhY2hlKSB7XG5cdCAgcmV0dXJuIG11c3RhY2hlLnN0cmlwO1xuXHR9O1xuXG5cdFdoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5QYXJ0aWFsU3RhdGVtZW50ID0gV2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLkNvbW1lbnRTdGF0ZW1lbnQgPSBmdW5jdGlvbiAobm9kZSkge1xuXHQgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgdmFyIHN0cmlwID0gbm9kZS5zdHJpcCB8fCB7fTtcblx0ICByZXR1cm4ge1xuXHQgICAgaW5saW5lU3RhbmRhbG9uZTogdHJ1ZSxcblx0ICAgIG9wZW46IHN0cmlwLm9wZW4sXG5cdCAgICBjbG9zZTogc3RyaXAuY2xvc2Vcblx0ICB9O1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGlzUHJldldoaXRlc3BhY2UoYm9keSwgaSwgaXNSb290KSB7XG5cdCAgaWYgKGkgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgaSA9IGJvZHkubGVuZ3RoO1xuXHQgIH1cblxuXHQgIC8vIE5vZGVzIHRoYXQgZW5kIHdpdGggbmV3bGluZXMgYXJlIGNvbnNpZGVyZWQgd2hpdGVzcGFjZSAoYnV0IGFyZSBzcGVjaWFsXG5cdCAgLy8gY2FzZWQgZm9yIHN0cmlwIG9wZXJhdGlvbnMpXG5cdCAgdmFyIHByZXYgPSBib2R5W2kgLSAxXSxcblx0ICAgICAgc2libGluZyA9IGJvZHlbaSAtIDJdO1xuXHQgIGlmICghcHJldikge1xuXHQgICAgcmV0dXJuIGlzUm9vdDtcblx0ICB9XG5cblx0ICBpZiAocHJldi50eXBlID09PSAnQ29udGVudFN0YXRlbWVudCcpIHtcblx0ICAgIHJldHVybiAoc2libGluZyB8fCAhaXNSb290ID8gL1xccj9cXG5cXHMqPyQvIDogLyhefFxccj9cXG4pXFxzKj8kLykudGVzdChwcmV2Lm9yaWdpbmFsKTtcblx0ICB9XG5cdH1cblx0ZnVuY3Rpb24gaXNOZXh0V2hpdGVzcGFjZShib2R5LCBpLCBpc1Jvb3QpIHtcblx0ICBpZiAoaSA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICBpID0gLTE7XG5cdCAgfVxuXG5cdCAgdmFyIG5leHQgPSBib2R5W2kgKyAxXSxcblx0ICAgICAgc2libGluZyA9IGJvZHlbaSArIDJdO1xuXHQgIGlmICghbmV4dCkge1xuXHQgICAgcmV0dXJuIGlzUm9vdDtcblx0ICB9XG5cblx0ICBpZiAobmV4dC50eXBlID09PSAnQ29udGVudFN0YXRlbWVudCcpIHtcblx0ICAgIHJldHVybiAoc2libGluZyB8fCAhaXNSb290ID8gL15cXHMqP1xccj9cXG4vIDogL15cXHMqPyhcXHI/XFxufCQpLykudGVzdChuZXh0Lm9yaWdpbmFsKTtcblx0ICB9XG5cdH1cblxuXHQvLyBNYXJrcyB0aGUgbm9kZSB0byB0aGUgcmlnaHQgb2YgdGhlIHBvc2l0aW9uIGFzIG9taXR0ZWQuXG5cdC8vIEkuZS4ge3tmb299fScgJyB3aWxsIG1hcmsgdGhlICcgJyBub2RlIGFzIG9taXR0ZWQuXG5cdC8vXG5cdC8vIElmIGkgaXMgdW5kZWZpbmVkLCB0aGVuIHRoZSBmaXJzdCBjaGlsZCB3aWxsIGJlIG1hcmtlZCBhcyBzdWNoLlxuXHQvL1xuXHQvLyBJZiBtdWxpdHBsZSBpcyB0cnV0aHkgdGhlbiBhbGwgd2hpdGVzcGFjZSB3aWxsIGJlIHN0cmlwcGVkIG91dCB1bnRpbCBub24td2hpdGVzcGFjZVxuXHQvLyBjb250ZW50IGlzIG1ldC5cblx0ZnVuY3Rpb24gb21pdFJpZ2h0KGJvZHksIGksIG11bHRpcGxlKSB7XG5cdCAgdmFyIGN1cnJlbnQgPSBib2R5W2kgPT0gbnVsbCA/IDAgOiBpICsgMV07XG5cdCAgaWYgKCFjdXJyZW50IHx8IGN1cnJlbnQudHlwZSAhPT0gJ0NvbnRlbnRTdGF0ZW1lbnQnIHx8ICFtdWx0aXBsZSAmJiBjdXJyZW50LnJpZ2h0U3RyaXBwZWQpIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cblx0ICB2YXIgb3JpZ2luYWwgPSBjdXJyZW50LnZhbHVlO1xuXHQgIGN1cnJlbnQudmFsdWUgPSBjdXJyZW50LnZhbHVlLnJlcGxhY2UobXVsdGlwbGUgPyAvXlxccysvIDogL15bIFxcdF0qXFxyP1xcbj8vLCAnJyk7XG5cdCAgY3VycmVudC5yaWdodFN0cmlwcGVkID0gY3VycmVudC52YWx1ZSAhPT0gb3JpZ2luYWw7XG5cdH1cblxuXHQvLyBNYXJrcyB0aGUgbm9kZSB0byB0aGUgbGVmdCBvZiB0aGUgcG9zaXRpb24gYXMgb21pdHRlZC5cblx0Ly8gSS5lLiAnICd7e2Zvb319IHdpbGwgbWFyayB0aGUgJyAnIG5vZGUgYXMgb21pdHRlZC5cblx0Ly9cblx0Ly8gSWYgaSBpcyB1bmRlZmluZWQgdGhlbiB0aGUgbGFzdCBjaGlsZCB3aWxsIGJlIG1hcmtlZCBhcyBzdWNoLlxuXHQvL1xuXHQvLyBJZiBtdWxpdHBsZSBpcyB0cnV0aHkgdGhlbiBhbGwgd2hpdGVzcGFjZSB3aWxsIGJlIHN0cmlwcGVkIG91dCB1bnRpbCBub24td2hpdGVzcGFjZVxuXHQvLyBjb250ZW50IGlzIG1ldC5cblx0ZnVuY3Rpb24gb21pdExlZnQoYm9keSwgaSwgbXVsdGlwbGUpIHtcblx0ICB2YXIgY3VycmVudCA9IGJvZHlbaSA9PSBudWxsID8gYm9keS5sZW5ndGggLSAxIDogaSAtIDFdO1xuXHQgIGlmICghY3VycmVudCB8fCBjdXJyZW50LnR5cGUgIT09ICdDb250ZW50U3RhdGVtZW50JyB8fCAhbXVsdGlwbGUgJiYgY3VycmVudC5sZWZ0U3RyaXBwZWQpIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cblx0ICAvLyBXZSBvbWl0IHRoZSBsYXN0IG5vZGUgaWYgaXQncyB3aGl0ZXNwYWNlIG9ubHkgYW5kIG5vdCBwcmVjZWVkZWQgYnkgYSBub24tY29udGVudCBub2RlLlxuXHQgIHZhciBvcmlnaW5hbCA9IGN1cnJlbnQudmFsdWU7XG5cdCAgY3VycmVudC52YWx1ZSA9IGN1cnJlbnQudmFsdWUucmVwbGFjZShtdWx0aXBsZSA/IC9cXHMrJC8gOiAvWyBcXHRdKyQvLCAnJyk7XG5cdCAgY3VycmVudC5sZWZ0U3RyaXBwZWQgPSBjdXJyZW50LnZhbHVlICE9PSBvcmlnaW5hbDtcblx0ICByZXR1cm4gY3VycmVudC5sZWZ0U3RyaXBwZWQ7XG5cdH1cblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBXaGl0ZXNwYWNlQ29udHJvbDtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMzkgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHRmdW5jdGlvbiBWaXNpdG9yKCkge1xuXHQgIHRoaXMucGFyZW50cyA9IFtdO1xuXHR9XG5cblx0VmlzaXRvci5wcm90b3R5cGUgPSB7XG5cdCAgY29uc3RydWN0b3I6IFZpc2l0b3IsXG5cdCAgbXV0YXRpbmc6IGZhbHNlLFxuXG5cdCAgLy8gVmlzaXRzIGEgZ2l2ZW4gdmFsdWUuIElmIG11dGF0aW5nLCB3aWxsIHJlcGxhY2UgdGhlIHZhbHVlIGlmIG5lY2Vzc2FyeS5cblx0ICBhY2NlcHRLZXk6IGZ1bmN0aW9uIGFjY2VwdEtleShub2RlLCBuYW1lKSB7XG5cdCAgICB2YXIgdmFsdWUgPSB0aGlzLmFjY2VwdChub2RlW25hbWVdKTtcblx0ICAgIGlmICh0aGlzLm11dGF0aW5nKSB7XG5cdCAgICAgIC8vIEhhY2t5IHNhbml0eSBjaGVjazogVGhpcyBtYXkgaGF2ZSBhIGZldyBmYWxzZSBwb3NpdGl2ZXMgZm9yIHR5cGUgZm9yIHRoZSBoZWxwZXJcblx0ICAgICAgLy8gbWV0aG9kcyBidXQgd2lsbCBnZW5lcmFsbHkgZG8gdGhlIHJpZ2h0IHRoaW5nIHdpdGhvdXQgYSBsb3Qgb2Ygb3ZlcmhlYWQuXG5cdCAgICAgIGlmICh2YWx1ZSAmJiAhVmlzaXRvci5wcm90b3R5cGVbdmFsdWUudHlwZV0pIHtcblx0ICAgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVW5leHBlY3RlZCBub2RlIHR5cGUgXCInICsgdmFsdWUudHlwZSArICdcIiBmb3VuZCB3aGVuIGFjY2VwdGluZyAnICsgbmFtZSArICcgb24gJyArIG5vZGUudHlwZSk7XG5cdCAgICAgIH1cblx0ICAgICAgbm9kZVtuYW1lXSA9IHZhbHVlO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICAvLyBQZXJmb3JtcyBhbiBhY2NlcHQgb3BlcmF0aW9uIHdpdGggYWRkZWQgc2FuaXR5IGNoZWNrIHRvIGVuc3VyZVxuXHQgIC8vIHJlcXVpcmVkIGtleXMgYXJlIG5vdCByZW1vdmVkLlxuXHQgIGFjY2VwdFJlcXVpcmVkOiBmdW5jdGlvbiBhY2NlcHRSZXF1aXJlZChub2RlLCBuYW1lKSB7XG5cdCAgICB0aGlzLmFjY2VwdEtleShub2RlLCBuYW1lKTtcblxuXHQgICAgaWYgKCFub2RlW25hbWVdKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKG5vZGUudHlwZSArICcgcmVxdWlyZXMgJyArIG5hbWUpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICAvLyBUcmF2ZXJzZXMgYSBnaXZlbiBhcnJheS4gSWYgbXV0YXRpbmcsIGVtcHR5IHJlc3Buc2VzIHdpbGwgYmUgcmVtb3ZlZFxuXHQgIC8vIGZvciBjaGlsZCBlbGVtZW50cy5cblx0ICBhY2NlcHRBcnJheTogZnVuY3Rpb24gYWNjZXB0QXJyYXkoYXJyYXkpIHtcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXJyYXkubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgIHRoaXMuYWNjZXB0S2V5KGFycmF5LCBpKTtcblxuXHQgICAgICBpZiAoIWFycmF5W2ldKSB7XG5cdCAgICAgICAgYXJyYXkuc3BsaWNlKGksIDEpO1xuXHQgICAgICAgIGktLTtcblx0ICAgICAgICBsLS07XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgYWNjZXB0OiBmdW5jdGlvbiBhY2NlcHQob2JqZWN0KSB7XG5cdCAgICBpZiAoIW9iamVjdCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBTYW5pdHkgY29kZSAqL1xuXHQgICAgaWYgKCF0aGlzW29iamVjdC50eXBlXSkge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVW5rbm93biB0eXBlOiAnICsgb2JqZWN0LnR5cGUsIG9iamVjdCk7XG5cdCAgICB9XG5cblx0ICAgIGlmICh0aGlzLmN1cnJlbnQpIHtcblx0ICAgICAgdGhpcy5wYXJlbnRzLnVuc2hpZnQodGhpcy5jdXJyZW50KTtcblx0ICAgIH1cblx0ICAgIHRoaXMuY3VycmVudCA9IG9iamVjdDtcblxuXHQgICAgdmFyIHJldCA9IHRoaXNbb2JqZWN0LnR5cGVdKG9iamVjdCk7XG5cblx0ICAgIHRoaXMuY3VycmVudCA9IHRoaXMucGFyZW50cy5zaGlmdCgpO1xuXG5cdCAgICBpZiAoIXRoaXMubXV0YXRpbmcgfHwgcmV0KSB7XG5cdCAgICAgIHJldHVybiByZXQ7XG5cdCAgICB9IGVsc2UgaWYgKHJldCAhPT0gZmFsc2UpIHtcblx0ICAgICAgcmV0dXJuIG9iamVjdDtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgUHJvZ3JhbTogZnVuY3Rpb24gUHJvZ3JhbShwcm9ncmFtKSB7XG5cdCAgICB0aGlzLmFjY2VwdEFycmF5KHByb2dyYW0uYm9keSk7XG5cdCAgfSxcblxuXHQgIE11c3RhY2hlU3RhdGVtZW50OiB2aXNpdFN1YkV4cHJlc3Npb24sXG5cdCAgRGVjb3JhdG9yOiB2aXNpdFN1YkV4cHJlc3Npb24sXG5cblx0ICBCbG9ja1N0YXRlbWVudDogdmlzaXRCbG9jayxcblx0ICBEZWNvcmF0b3JCbG9jazogdmlzaXRCbG9jayxcblxuXHQgIFBhcnRpYWxTdGF0ZW1lbnQ6IHZpc2l0UGFydGlhbCxcblx0ICBQYXJ0aWFsQmxvY2tTdGF0ZW1lbnQ6IGZ1bmN0aW9uIFBhcnRpYWxCbG9ja1N0YXRlbWVudChwYXJ0aWFsKSB7XG5cdCAgICB2aXNpdFBhcnRpYWwuY2FsbCh0aGlzLCBwYXJ0aWFsKTtcblxuXHQgICAgdGhpcy5hY2NlcHRLZXkocGFydGlhbCwgJ3Byb2dyYW0nKTtcblx0ICB9LFxuXG5cdCAgQ29udGVudFN0YXRlbWVudDogZnVuY3Rpb24gQ29udGVudFN0YXRlbWVudCgpIC8qIGNvbnRlbnQgKi97fSxcblx0ICBDb21tZW50U3RhdGVtZW50OiBmdW5jdGlvbiBDb21tZW50U3RhdGVtZW50KCkgLyogY29tbWVudCAqL3t9LFxuXG5cdCAgU3ViRXhwcmVzc2lvbjogdmlzaXRTdWJFeHByZXNzaW9uLFxuXG5cdCAgUGF0aEV4cHJlc3Npb246IGZ1bmN0aW9uIFBhdGhFeHByZXNzaW9uKCkgLyogcGF0aCAqL3t9LFxuXG5cdCAgU3RyaW5nTGl0ZXJhbDogZnVuY3Rpb24gU3RyaW5nTGl0ZXJhbCgpIC8qIHN0cmluZyAqL3t9LFxuXHQgIE51bWJlckxpdGVyYWw6IGZ1bmN0aW9uIE51bWJlckxpdGVyYWwoKSAvKiBudW1iZXIgKi97fSxcblx0ICBCb29sZWFuTGl0ZXJhbDogZnVuY3Rpb24gQm9vbGVhbkxpdGVyYWwoKSAvKiBib29sICove30sXG5cdCAgVW5kZWZpbmVkTGl0ZXJhbDogZnVuY3Rpb24gVW5kZWZpbmVkTGl0ZXJhbCgpIC8qIGxpdGVyYWwgKi97fSxcblx0ICBOdWxsTGl0ZXJhbDogZnVuY3Rpb24gTnVsbExpdGVyYWwoKSAvKiBsaXRlcmFsICove30sXG5cblx0ICBIYXNoOiBmdW5jdGlvbiBIYXNoKGhhc2gpIHtcblx0ICAgIHRoaXMuYWNjZXB0QXJyYXkoaGFzaC5wYWlycyk7XG5cdCAgfSxcblx0ICBIYXNoUGFpcjogZnVuY3Rpb24gSGFzaFBhaXIocGFpcikge1xuXHQgICAgdGhpcy5hY2NlcHRSZXF1aXJlZChwYWlyLCAndmFsdWUnKTtcblx0ICB9XG5cdH07XG5cblx0ZnVuY3Rpb24gdmlzaXRTdWJFeHByZXNzaW9uKG11c3RhY2hlKSB7XG5cdCAgdGhpcy5hY2NlcHRSZXF1aXJlZChtdXN0YWNoZSwgJ3BhdGgnKTtcblx0ICB0aGlzLmFjY2VwdEFycmF5KG11c3RhY2hlLnBhcmFtcyk7XG5cdCAgdGhpcy5hY2NlcHRLZXkobXVzdGFjaGUsICdoYXNoJyk7XG5cdH1cblx0ZnVuY3Rpb24gdmlzaXRCbG9jayhibG9jaykge1xuXHQgIHZpc2l0U3ViRXhwcmVzc2lvbi5jYWxsKHRoaXMsIGJsb2NrKTtcblxuXHQgIHRoaXMuYWNjZXB0S2V5KGJsb2NrLCAncHJvZ3JhbScpO1xuXHQgIHRoaXMuYWNjZXB0S2V5KGJsb2NrLCAnaW52ZXJzZScpO1xuXHR9XG5cdGZ1bmN0aW9uIHZpc2l0UGFydGlhbChwYXJ0aWFsKSB7XG5cdCAgdGhpcy5hY2NlcHRSZXF1aXJlZChwYXJ0aWFsLCAnbmFtZScpO1xuXHQgIHRoaXMuYWNjZXB0QXJyYXkocGFydGlhbC5wYXJhbXMpO1xuXHQgIHRoaXMuYWNjZXB0S2V5KHBhcnRpYWwsICdoYXNoJyk7XG5cdH1cblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBWaXNpdG9yO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiA0MCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLlNvdXJjZUxvY2F0aW9uID0gU291cmNlTG9jYXRpb247XG5cdGV4cG9ydHMuaWQgPSBpZDtcblx0ZXhwb3J0cy5zdHJpcEZsYWdzID0gc3RyaXBGbGFncztcblx0ZXhwb3J0cy5zdHJpcENvbW1lbnQgPSBzdHJpcENvbW1lbnQ7XG5cdGV4cG9ydHMucHJlcGFyZVBhdGggPSBwcmVwYXJlUGF0aDtcblx0ZXhwb3J0cy5wcmVwYXJlTXVzdGFjaGUgPSBwcmVwYXJlTXVzdGFjaGU7XG5cdGV4cG9ydHMucHJlcGFyZVJhd0Jsb2NrID0gcHJlcGFyZVJhd0Jsb2NrO1xuXHRleHBvcnRzLnByZXBhcmVCbG9jayA9IHByZXBhcmVCbG9jaztcblx0ZXhwb3J0cy5wcmVwYXJlUHJvZ3JhbSA9IHByZXBhcmVQcm9ncmFtO1xuXHRleHBvcnRzLnByZXBhcmVQYXJ0aWFsQmxvY2sgPSBwcmVwYXJlUGFydGlhbEJsb2NrO1xuXG5cdHZhciBfZXhjZXB0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHR2YXIgX2V4Y2VwdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leGNlcHRpb24pO1xuXG5cdGZ1bmN0aW9uIHZhbGlkYXRlQ2xvc2Uob3BlbiwgY2xvc2UpIHtcblx0ICBjbG9zZSA9IGNsb3NlLnBhdGggPyBjbG9zZS5wYXRoLm9yaWdpbmFsIDogY2xvc2U7XG5cblx0ICBpZiAob3Blbi5wYXRoLm9yaWdpbmFsICE9PSBjbG9zZSkge1xuXHQgICAgdmFyIGVycm9yTm9kZSA9IHsgbG9jOiBvcGVuLnBhdGgubG9jIH07XG5cblx0ICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKG9wZW4ucGF0aC5vcmlnaW5hbCArIFwiIGRvZXNuJ3QgbWF0Y2ggXCIgKyBjbG9zZSwgZXJyb3JOb2RlKTtcblx0ICB9XG5cdH1cblxuXHRmdW5jdGlvbiBTb3VyY2VMb2NhdGlvbihzb3VyY2UsIGxvY0luZm8pIHtcblx0ICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblx0ICB0aGlzLnN0YXJ0ID0ge1xuXHQgICAgbGluZTogbG9jSW5mby5maXJzdF9saW5lLFxuXHQgICAgY29sdW1uOiBsb2NJbmZvLmZpcnN0X2NvbHVtblxuXHQgIH07XG5cdCAgdGhpcy5lbmQgPSB7XG5cdCAgICBsaW5lOiBsb2NJbmZvLmxhc3RfbGluZSxcblx0ICAgIGNvbHVtbjogbG9jSW5mby5sYXN0X2NvbHVtblxuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBpZCh0b2tlbikge1xuXHQgIGlmICgvXlxcWy4qXFxdJC8udGVzdCh0b2tlbikpIHtcblx0ICAgIHJldHVybiB0b2tlbi5zdWJzdHIoMSwgdG9rZW4ubGVuZ3RoIC0gMik7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJldHVybiB0b2tlbjtcblx0ICB9XG5cdH1cblxuXHRmdW5jdGlvbiBzdHJpcEZsYWdzKG9wZW4sIGNsb3NlKSB7XG5cdCAgcmV0dXJuIHtcblx0ICAgIG9wZW46IG9wZW4uY2hhckF0KDIpID09PSAnficsXG5cdCAgICBjbG9zZTogY2xvc2UuY2hhckF0KGNsb3NlLmxlbmd0aCAtIDMpID09PSAnfidcblx0ICB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gc3RyaXBDb21tZW50KGNvbW1lbnQpIHtcblx0ICByZXR1cm4gY29tbWVudC5yZXBsYWNlKC9eXFx7XFx7fj9cXCEtPy0/LywgJycpLnJlcGxhY2UoLy0/LT9+P1xcfVxcfSQvLCAnJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBwcmVwYXJlUGF0aChkYXRhLCBwYXJ0cywgbG9jKSB7XG5cdCAgbG9jID0gdGhpcy5sb2NJbmZvKGxvYyk7XG5cblx0ICB2YXIgb3JpZ2luYWwgPSBkYXRhID8gJ0AnIDogJycsXG5cdCAgICAgIGRpZyA9IFtdLFxuXHQgICAgICBkZXB0aCA9IDAsXG5cdCAgICAgIGRlcHRoU3RyaW5nID0gJyc7XG5cblx0ICBmb3IgKHZhciBpID0gMCwgbCA9IHBhcnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgdmFyIHBhcnQgPSBwYXJ0c1tpXS5wYXJ0LFxuXG5cdCAgICAvLyBJZiB3ZSBoYXZlIFtdIHN5bnRheCB0aGVuIHdlIGRvIG5vdCB0cmVhdCBwYXRoIHJlZmVyZW5jZXMgYXMgb3BlcmF0b3JzLFxuXHQgICAgLy8gaS5lLiBmb28uW3RoaXNdIHJlc29sdmVzIHRvIGFwcHJveGltYXRlbHkgY29udGV4dC5mb29bJ3RoaXMnXVxuXHQgICAgaXNMaXRlcmFsID0gcGFydHNbaV0ub3JpZ2luYWwgIT09IHBhcnQ7XG5cdCAgICBvcmlnaW5hbCArPSAocGFydHNbaV0uc2VwYXJhdG9yIHx8ICcnKSArIHBhcnQ7XG5cblx0ICAgIGlmICghaXNMaXRlcmFsICYmIChwYXJ0ID09PSAnLi4nIHx8IHBhcnQgPT09ICcuJyB8fCBwYXJ0ID09PSAndGhpcycpKSB7XG5cdCAgICAgIGlmIChkaWcubGVuZ3RoID4gMCkge1xuXHQgICAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdJbnZhbGlkIHBhdGg6ICcgKyBvcmlnaW5hbCwgeyBsb2M6IGxvYyB9KTtcblx0ICAgICAgfSBlbHNlIGlmIChwYXJ0ID09PSAnLi4nKSB7XG5cdCAgICAgICAgZGVwdGgrKztcblx0ICAgICAgICBkZXB0aFN0cmluZyArPSAnLi4vJztcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgZGlnLnB1c2gocGFydCk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgcmV0dXJuIHtcblx0ICAgIHR5cGU6ICdQYXRoRXhwcmVzc2lvbicsXG5cdCAgICBkYXRhOiBkYXRhLFxuXHQgICAgZGVwdGg6IGRlcHRoLFxuXHQgICAgcGFydHM6IGRpZyxcblx0ICAgIG9yaWdpbmFsOiBvcmlnaW5hbCxcblx0ICAgIGxvYzogbG9jXG5cdCAgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIHByZXBhcmVNdXN0YWNoZShwYXRoLCBwYXJhbXMsIGhhc2gsIG9wZW4sIHN0cmlwLCBsb2NJbmZvKSB7XG5cdCAgLy8gTXVzdCB1c2UgY2hhckF0IHRvIHN1cHBvcnQgSUUgcHJlLTEwXG5cdCAgdmFyIGVzY2FwZUZsYWcgPSBvcGVuLmNoYXJBdCgzKSB8fCBvcGVuLmNoYXJBdCgyKSxcblx0ICAgICAgZXNjYXBlZCA9IGVzY2FwZUZsYWcgIT09ICd7JyAmJiBlc2NhcGVGbGFnICE9PSAnJic7XG5cblx0ICB2YXIgZGVjb3JhdG9yID0gL1xcKi8udGVzdChvcGVuKTtcblx0ICByZXR1cm4ge1xuXHQgICAgdHlwZTogZGVjb3JhdG9yID8gJ0RlY29yYXRvcicgOiAnTXVzdGFjaGVTdGF0ZW1lbnQnLFxuXHQgICAgcGF0aDogcGF0aCxcblx0ICAgIHBhcmFtczogcGFyYW1zLFxuXHQgICAgaGFzaDogaGFzaCxcblx0ICAgIGVzY2FwZWQ6IGVzY2FwZWQsXG5cdCAgICBzdHJpcDogc3RyaXAsXG5cdCAgICBsb2M6IHRoaXMubG9jSW5mbyhsb2NJbmZvKVxuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBwcmVwYXJlUmF3QmxvY2sob3BlblJhd0Jsb2NrLCBjb250ZW50cywgY2xvc2UsIGxvY0luZm8pIHtcblx0ICB2YWxpZGF0ZUNsb3NlKG9wZW5SYXdCbG9jaywgY2xvc2UpO1xuXG5cdCAgbG9jSW5mbyA9IHRoaXMubG9jSW5mbyhsb2NJbmZvKTtcblx0ICB2YXIgcHJvZ3JhbSA9IHtcblx0ICAgIHR5cGU6ICdQcm9ncmFtJyxcblx0ICAgIGJvZHk6IGNvbnRlbnRzLFxuXHQgICAgc3RyaXA6IHt9LFxuXHQgICAgbG9jOiBsb2NJbmZvXG5cdCAgfTtcblxuXHQgIHJldHVybiB7XG5cdCAgICB0eXBlOiAnQmxvY2tTdGF0ZW1lbnQnLFxuXHQgICAgcGF0aDogb3BlblJhd0Jsb2NrLnBhdGgsXG5cdCAgICBwYXJhbXM6IG9wZW5SYXdCbG9jay5wYXJhbXMsXG5cdCAgICBoYXNoOiBvcGVuUmF3QmxvY2suaGFzaCxcblx0ICAgIHByb2dyYW06IHByb2dyYW0sXG5cdCAgICBvcGVuU3RyaXA6IHt9LFxuXHQgICAgaW52ZXJzZVN0cmlwOiB7fSxcblx0ICAgIGNsb3NlU3RyaXA6IHt9LFxuXHQgICAgbG9jOiBsb2NJbmZvXG5cdCAgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIHByZXBhcmVCbG9jayhvcGVuQmxvY2ssIHByb2dyYW0sIGludmVyc2VBbmRQcm9ncmFtLCBjbG9zZSwgaW52ZXJ0ZWQsIGxvY0luZm8pIHtcblx0ICBpZiAoY2xvc2UgJiYgY2xvc2UucGF0aCkge1xuXHQgICAgdmFsaWRhdGVDbG9zZShvcGVuQmxvY2ssIGNsb3NlKTtcblx0ICB9XG5cblx0ICB2YXIgZGVjb3JhdG9yID0gL1xcKi8udGVzdChvcGVuQmxvY2sub3Blbik7XG5cblx0ICBwcm9ncmFtLmJsb2NrUGFyYW1zID0gb3BlbkJsb2NrLmJsb2NrUGFyYW1zO1xuXG5cdCAgdmFyIGludmVyc2UgPSB1bmRlZmluZWQsXG5cdCAgICAgIGludmVyc2VTdHJpcCA9IHVuZGVmaW5lZDtcblxuXHQgIGlmIChpbnZlcnNlQW5kUHJvZ3JhbSkge1xuXHQgICAgaWYgKGRlY29yYXRvcikge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVW5leHBlY3RlZCBpbnZlcnNlIGJsb2NrIG9uIGRlY29yYXRvcicsIGludmVyc2VBbmRQcm9ncmFtKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGludmVyc2VBbmRQcm9ncmFtLmNoYWluKSB7XG5cdCAgICAgIGludmVyc2VBbmRQcm9ncmFtLnByb2dyYW0uYm9keVswXS5jbG9zZVN0cmlwID0gY2xvc2Uuc3RyaXA7XG5cdCAgICB9XG5cblx0ICAgIGludmVyc2VTdHJpcCA9IGludmVyc2VBbmRQcm9ncmFtLnN0cmlwO1xuXHQgICAgaW52ZXJzZSA9IGludmVyc2VBbmRQcm9ncmFtLnByb2dyYW07XG5cdCAgfVxuXG5cdCAgaWYgKGludmVydGVkKSB7XG5cdCAgICBpbnZlcnRlZCA9IGludmVyc2U7XG5cdCAgICBpbnZlcnNlID0gcHJvZ3JhbTtcblx0ICAgIHByb2dyYW0gPSBpbnZlcnRlZDtcblx0ICB9XG5cblx0ICByZXR1cm4ge1xuXHQgICAgdHlwZTogZGVjb3JhdG9yID8gJ0RlY29yYXRvckJsb2NrJyA6ICdCbG9ja1N0YXRlbWVudCcsXG5cdCAgICBwYXRoOiBvcGVuQmxvY2sucGF0aCxcblx0ICAgIHBhcmFtczogb3BlbkJsb2NrLnBhcmFtcyxcblx0ICAgIGhhc2g6IG9wZW5CbG9jay5oYXNoLFxuXHQgICAgcHJvZ3JhbTogcHJvZ3JhbSxcblx0ICAgIGludmVyc2U6IGludmVyc2UsXG5cdCAgICBvcGVuU3RyaXA6IG9wZW5CbG9jay5zdHJpcCxcblx0ICAgIGludmVyc2VTdHJpcDogaW52ZXJzZVN0cmlwLFxuXHQgICAgY2xvc2VTdHJpcDogY2xvc2UgJiYgY2xvc2Uuc3RyaXAsXG5cdCAgICBsb2M6IHRoaXMubG9jSW5mbyhsb2NJbmZvKVxuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBwcmVwYXJlUHJvZ3JhbShzdGF0ZW1lbnRzLCBsb2MpIHtcblx0ICBpZiAoIWxvYyAmJiBzdGF0ZW1lbnRzLmxlbmd0aCkge1xuXHQgICAgdmFyIGZpcnN0TG9jID0gc3RhdGVtZW50c1swXS5sb2MsXG5cdCAgICAgICAgbGFzdExvYyA9IHN0YXRlbWVudHNbc3RhdGVtZW50cy5sZW5ndGggLSAxXS5sb2M7XG5cblx0ICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdCAgICBpZiAoZmlyc3RMb2MgJiYgbGFzdExvYykge1xuXHQgICAgICBsb2MgPSB7XG5cdCAgICAgICAgc291cmNlOiBmaXJzdExvYy5zb3VyY2UsXG5cdCAgICAgICAgc3RhcnQ6IHtcblx0ICAgICAgICAgIGxpbmU6IGZpcnN0TG9jLnN0YXJ0LmxpbmUsXG5cdCAgICAgICAgICBjb2x1bW46IGZpcnN0TG9jLnN0YXJ0LmNvbHVtblxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZW5kOiB7XG5cdCAgICAgICAgICBsaW5lOiBsYXN0TG9jLmVuZC5saW5lLFxuXHQgICAgICAgICAgY29sdW1uOiBsYXN0TG9jLmVuZC5jb2x1bW5cblx0ICAgICAgICB9XG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgcmV0dXJuIHtcblx0ICAgIHR5cGU6ICdQcm9ncmFtJyxcblx0ICAgIGJvZHk6IHN0YXRlbWVudHMsXG5cdCAgICBzdHJpcDoge30sXG5cdCAgICBsb2M6IGxvY1xuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBwcmVwYXJlUGFydGlhbEJsb2NrKG9wZW4sIHByb2dyYW0sIGNsb3NlLCBsb2NJbmZvKSB7XG5cdCAgdmFsaWRhdGVDbG9zZShvcGVuLCBjbG9zZSk7XG5cblx0ICByZXR1cm4ge1xuXHQgICAgdHlwZTogJ1BhcnRpYWxCbG9ja1N0YXRlbWVudCcsXG5cdCAgICBuYW1lOiBvcGVuLnBhdGgsXG5cdCAgICBwYXJhbXM6IG9wZW4ucGFyYW1zLFxuXHQgICAgaGFzaDogb3Blbi5oYXNoLFxuXHQgICAgcHJvZ3JhbTogcHJvZ3JhbSxcblx0ICAgIG9wZW5TdHJpcDogb3Blbi5zdHJpcCxcblx0ICAgIGNsb3NlU3RyaXA6IGNsb3NlICYmIGNsb3NlLnN0cmlwLFxuXHQgICAgbG9jOiB0aGlzLmxvY0luZm8obG9jSW5mbylcblx0ICB9O1xuXHR9XG5cbi8qKiovIH0pLFxuLyogNDEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuQ29tcGlsZXIgPSBDb21waWxlcjtcblx0ZXhwb3J0cy5wcmVjb21waWxlID0gcHJlY29tcGlsZTtcblx0ZXhwb3J0cy5jb21waWxlID0gY29tcGlsZTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHR2YXIgX2FzdCA9IF9fd2VicGFja19yZXF1aXJlX18oMzUpO1xuXG5cdHZhciBfYXN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FzdCk7XG5cblx0dmFyIHNsaWNlID0gW10uc2xpY2U7XG5cblx0ZnVuY3Rpb24gQ29tcGlsZXIoKSB7fVxuXG5cdC8vIHRoZSBmb3VuZEhlbHBlciByZWdpc3RlciB3aWxsIGRpc2FtYmlndWF0ZSBoZWxwZXIgbG9va3VwIGZyb20gZmluZGluZyBhXG5cdC8vIGZ1bmN0aW9uIGluIGEgY29udGV4dC4gVGhpcyBpcyBuZWNlc3NhcnkgZm9yIG11c3RhY2hlIGNvbXBhdGliaWxpdHksIHdoaWNoXG5cdC8vIHJlcXVpcmVzIHRoYXQgY29udGV4dCBmdW5jdGlvbnMgaW4gYmxvY2tzIGFyZSBldmFsdWF0ZWQgYnkgYmxvY2tIZWxwZXJNaXNzaW5nLFxuXHQvLyBhbmQgdGhlbiBwcm9jZWVkIGFzIGlmIHRoZSByZXN1bHRpbmcgdmFsdWUgd2FzIHByb3ZpZGVkIHRvIGJsb2NrSGVscGVyTWlzc2luZy5cblxuXHRDb21waWxlci5wcm90b3R5cGUgPSB7XG5cdCAgY29tcGlsZXI6IENvbXBpbGVyLFxuXG5cdCAgZXF1YWxzOiBmdW5jdGlvbiBlcXVhbHMob3RoZXIpIHtcblx0ICAgIHZhciBsZW4gPSB0aGlzLm9wY29kZXMubGVuZ3RoO1xuXHQgICAgaWYgKG90aGVyLm9wY29kZXMubGVuZ3RoICE9PSBsZW4pIHtcblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIHZhciBvcGNvZGUgPSB0aGlzLm9wY29kZXNbaV0sXG5cdCAgICAgICAgICBvdGhlck9wY29kZSA9IG90aGVyLm9wY29kZXNbaV07XG5cdCAgICAgIGlmIChvcGNvZGUub3Bjb2RlICE9PSBvdGhlck9wY29kZS5vcGNvZGUgfHwgIWFyZ0VxdWFscyhvcGNvZGUuYXJncywgb3RoZXJPcGNvZGUuYXJncykpIHtcblx0ICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgLy8gV2Uga25vdyB0aGF0IGxlbmd0aCBpcyB0aGUgc2FtZSBiZXR3ZWVuIHRoZSB0d28gYXJyYXlzIGJlY2F1c2UgdGhleSBhcmUgZGlyZWN0bHkgdGllZFxuXHQgICAgLy8gdG8gdGhlIG9wY29kZSBiZWhhdmlvciBhYm92ZS5cblx0ICAgIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICBpZiAoIXRoaXMuY2hpbGRyZW5baV0uZXF1YWxzKG90aGVyLmNoaWxkcmVuW2ldKSkge1xuXHQgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9LFxuXG5cdCAgZ3VpZDogMCxcblxuXHQgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUocHJvZ3JhbSwgb3B0aW9ucykge1xuXHQgICAgdGhpcy5zb3VyY2VOb2RlID0gW107XG5cdCAgICB0aGlzLm9wY29kZXMgPSBbXTtcblx0ICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcblx0ICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdCAgICB0aGlzLnN0cmluZ1BhcmFtcyA9IG9wdGlvbnMuc3RyaW5nUGFyYW1zO1xuXHQgICAgdGhpcy50cmFja0lkcyA9IG9wdGlvbnMudHJhY2tJZHM7XG5cblx0ICAgIG9wdGlvbnMuYmxvY2tQYXJhbXMgPSBvcHRpb25zLmJsb2NrUGFyYW1zIHx8IFtdO1xuXG5cdCAgICAvLyBUaGVzZSBjaGFuZ2VzIHdpbGwgcHJvcGFnYXRlIHRvIHRoZSBvdGhlciBjb21waWxlciBjb21wb25lbnRzXG5cdCAgICB2YXIga25vd25IZWxwZXJzID0gb3B0aW9ucy5rbm93bkhlbHBlcnM7XG5cdCAgICBvcHRpb25zLmtub3duSGVscGVycyA9IHtcblx0ICAgICAgJ2hlbHBlck1pc3NpbmcnOiB0cnVlLFxuXHQgICAgICAnYmxvY2tIZWxwZXJNaXNzaW5nJzogdHJ1ZSxcblx0ICAgICAgJ2VhY2gnOiB0cnVlLFxuXHQgICAgICAnaWYnOiB0cnVlLFxuXHQgICAgICAndW5sZXNzJzogdHJ1ZSxcblx0ICAgICAgJ3dpdGgnOiB0cnVlLFxuXHQgICAgICAnbG9nJzogdHJ1ZSxcblx0ICAgICAgJ2xvb2t1cCc6IHRydWVcblx0ICAgIH07XG5cdCAgICBpZiAoa25vd25IZWxwZXJzKSB7XG5cdCAgICAgIGZvciAodmFyIF9uYW1lIGluIGtub3duSGVscGVycykge1xuXHQgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdCAgICAgICAgaWYgKF9uYW1lIGluIGtub3duSGVscGVycykge1xuXHQgICAgICAgICAgdGhpcy5vcHRpb25zLmtub3duSGVscGVyc1tfbmFtZV0gPSBrbm93bkhlbHBlcnNbX25hbWVdO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdGhpcy5hY2NlcHQocHJvZ3JhbSk7XG5cdCAgfSxcblxuXHQgIGNvbXBpbGVQcm9ncmFtOiBmdW5jdGlvbiBjb21waWxlUHJvZ3JhbShwcm9ncmFtKSB7XG5cdCAgICB2YXIgY2hpbGRDb21waWxlciA9IG5ldyB0aGlzLmNvbXBpbGVyKCksXG5cdCAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuZXctY2FwXG5cdCAgICByZXN1bHQgPSBjaGlsZENvbXBpbGVyLmNvbXBpbGUocHJvZ3JhbSwgdGhpcy5vcHRpb25zKSxcblx0ICAgICAgICBndWlkID0gdGhpcy5ndWlkKys7XG5cblx0ICAgIHRoaXMudXNlUGFydGlhbCA9IHRoaXMudXNlUGFydGlhbCB8fCByZXN1bHQudXNlUGFydGlhbDtcblxuXHQgICAgdGhpcy5jaGlsZHJlbltndWlkXSA9IHJlc3VsdDtcblx0ICAgIHRoaXMudXNlRGVwdGhzID0gdGhpcy51c2VEZXB0aHMgfHwgcmVzdWx0LnVzZURlcHRocztcblxuXHQgICAgcmV0dXJuIGd1aWQ7XG5cdCAgfSxcblxuXHQgIGFjY2VwdDogZnVuY3Rpb24gYWNjZXB0KG5vZGUpIHtcblx0ICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBTYW5pdHkgY29kZSAqL1xuXHQgICAgaWYgKCF0aGlzW25vZGUudHlwZV0pIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1Vua25vd24gdHlwZTogJyArIG5vZGUudHlwZSwgbm9kZSk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuc291cmNlTm9kZS51bnNoaWZ0KG5vZGUpO1xuXHQgICAgdmFyIHJldCA9IHRoaXNbbm9kZS50eXBlXShub2RlKTtcblx0ICAgIHRoaXMuc291cmNlTm9kZS5zaGlmdCgpO1xuXHQgICAgcmV0dXJuIHJldDtcblx0ICB9LFxuXG5cdCAgUHJvZ3JhbTogZnVuY3Rpb24gUHJvZ3JhbShwcm9ncmFtKSB7XG5cdCAgICB0aGlzLm9wdGlvbnMuYmxvY2tQYXJhbXMudW5zaGlmdChwcm9ncmFtLmJsb2NrUGFyYW1zKTtcblxuXHQgICAgdmFyIGJvZHkgPSBwcm9ncmFtLmJvZHksXG5cdCAgICAgICAgYm9keUxlbmd0aCA9IGJvZHkubGVuZ3RoO1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib2R5TGVuZ3RoOyBpKyspIHtcblx0ICAgICAgdGhpcy5hY2NlcHQoYm9keVtpXSk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMub3B0aW9ucy5ibG9ja1BhcmFtcy5zaGlmdCgpO1xuXG5cdCAgICB0aGlzLmlzU2ltcGxlID0gYm9keUxlbmd0aCA9PT0gMTtcblx0ICAgIHRoaXMuYmxvY2tQYXJhbXMgPSBwcm9ncmFtLmJsb2NrUGFyYW1zID8gcHJvZ3JhbS5ibG9ja1BhcmFtcy5sZW5ndGggOiAwO1xuXG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXG5cdCAgQmxvY2tTdGF0ZW1lbnQ6IGZ1bmN0aW9uIEJsb2NrU3RhdGVtZW50KGJsb2NrKSB7XG5cdCAgICB0cmFuc2Zvcm1MaXRlcmFsVG9QYXRoKGJsb2NrKTtcblxuXHQgICAgdmFyIHByb2dyYW0gPSBibG9jay5wcm9ncmFtLFxuXHQgICAgICAgIGludmVyc2UgPSBibG9jay5pbnZlcnNlO1xuXG5cdCAgICBwcm9ncmFtID0gcHJvZ3JhbSAmJiB0aGlzLmNvbXBpbGVQcm9ncmFtKHByb2dyYW0pO1xuXHQgICAgaW52ZXJzZSA9IGludmVyc2UgJiYgdGhpcy5jb21waWxlUHJvZ3JhbShpbnZlcnNlKTtcblxuXHQgICAgdmFyIHR5cGUgPSB0aGlzLmNsYXNzaWZ5U2V4cHIoYmxvY2spO1xuXG5cdCAgICBpZiAodHlwZSA9PT0gJ2hlbHBlcicpIHtcblx0ICAgICAgdGhpcy5oZWxwZXJTZXhwcihibG9jaywgcHJvZ3JhbSwgaW52ZXJzZSk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzaW1wbGUnKSB7XG5cdCAgICAgIHRoaXMuc2ltcGxlU2V4cHIoYmxvY2spO1xuXG5cdCAgICAgIC8vIG5vdyB0aGF0IHRoZSBzaW1wbGUgbXVzdGFjaGUgaXMgcmVzb2x2ZWQsIHdlIG5lZWQgdG9cblx0ICAgICAgLy8gZXZhbHVhdGUgaXQgYnkgZXhlY3V0aW5nIGBibG9ja0hlbHBlck1pc3NpbmdgXG5cdCAgICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIHByb2dyYW0pO1xuXHQgICAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBpbnZlcnNlKTtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2VtcHR5SGFzaCcpO1xuXHQgICAgICB0aGlzLm9wY29kZSgnYmxvY2tWYWx1ZScsIGJsb2NrLnBhdGgub3JpZ2luYWwpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5hbWJpZ3VvdXNTZXhwcihibG9jaywgcHJvZ3JhbSwgaW52ZXJzZSk7XG5cblx0ICAgICAgLy8gbm93IHRoYXQgdGhlIHNpbXBsZSBtdXN0YWNoZSBpcyByZXNvbHZlZCwgd2UgbmVlZCB0b1xuXHQgICAgICAvLyBldmFsdWF0ZSBpdCBieSBleGVjdXRpbmcgYGJsb2NrSGVscGVyTWlzc2luZ2Bcblx0ICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIGludmVyc2UpO1xuXHQgICAgICB0aGlzLm9wY29kZSgnZW1wdHlIYXNoJyk7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdhbWJpZ3VvdXNCbG9ja1ZhbHVlJyk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMub3Bjb2RlKCdhcHBlbmQnKTtcblx0ICB9LFxuXG5cdCAgRGVjb3JhdG9yQmxvY2s6IGZ1bmN0aW9uIERlY29yYXRvckJsb2NrKGRlY29yYXRvcikge1xuXHQgICAgdmFyIHByb2dyYW0gPSBkZWNvcmF0b3IucHJvZ3JhbSAmJiB0aGlzLmNvbXBpbGVQcm9ncmFtKGRlY29yYXRvci5wcm9ncmFtKTtcblx0ICAgIHZhciBwYXJhbXMgPSB0aGlzLnNldHVwRnVsbE11c3RhY2hlUGFyYW1zKGRlY29yYXRvciwgcHJvZ3JhbSwgdW5kZWZpbmVkKSxcblx0ICAgICAgICBwYXRoID0gZGVjb3JhdG9yLnBhdGg7XG5cblx0ICAgIHRoaXMudXNlRGVjb3JhdG9ycyA9IHRydWU7XG5cdCAgICB0aGlzLm9wY29kZSgncmVnaXN0ZXJEZWNvcmF0b3InLCBwYXJhbXMubGVuZ3RoLCBwYXRoLm9yaWdpbmFsKTtcblx0ICB9LFxuXG5cdCAgUGFydGlhbFN0YXRlbWVudDogZnVuY3Rpb24gUGFydGlhbFN0YXRlbWVudChwYXJ0aWFsKSB7XG5cdCAgICB0aGlzLnVzZVBhcnRpYWwgPSB0cnVlO1xuXG5cdCAgICB2YXIgcHJvZ3JhbSA9IHBhcnRpYWwucHJvZ3JhbTtcblx0ICAgIGlmIChwcm9ncmFtKSB7XG5cdCAgICAgIHByb2dyYW0gPSB0aGlzLmNvbXBpbGVQcm9ncmFtKHBhcnRpYWwucHJvZ3JhbSk7XG5cdCAgICB9XG5cblx0ICAgIHZhciBwYXJhbXMgPSBwYXJ0aWFsLnBhcmFtcztcblx0ICAgIGlmIChwYXJhbXMubGVuZ3RoID4gMSkge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVW5zdXBwb3J0ZWQgbnVtYmVyIG9mIHBhcnRpYWwgYXJndW1lbnRzOiAnICsgcGFyYW1zLmxlbmd0aCwgcGFydGlhbCk7XG5cdCAgICB9IGVsc2UgaWYgKCFwYXJhbXMubGVuZ3RoKSB7XG5cdCAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXhwbGljaXRQYXJ0aWFsQ29udGV4dCkge1xuXHQgICAgICAgIHRoaXMub3Bjb2RlKCdwdXNoTGl0ZXJhbCcsICd1bmRlZmluZWQnKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBwYXJhbXMucHVzaCh7IHR5cGU6ICdQYXRoRXhwcmVzc2lvbicsIHBhcnRzOiBbXSwgZGVwdGg6IDAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgdmFyIHBhcnRpYWxOYW1lID0gcGFydGlhbC5uYW1lLm9yaWdpbmFsLFxuXHQgICAgICAgIGlzRHluYW1pYyA9IHBhcnRpYWwubmFtZS50eXBlID09PSAnU3ViRXhwcmVzc2lvbic7XG5cdCAgICBpZiAoaXNEeW5hbWljKSB7XG5cdCAgICAgIHRoaXMuYWNjZXB0KHBhcnRpYWwubmFtZSk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXMocGFydGlhbCwgcHJvZ3JhbSwgdW5kZWZpbmVkLCB0cnVlKTtcblxuXHQgICAgdmFyIGluZGVudCA9IHBhcnRpYWwuaW5kZW50IHx8ICcnO1xuXHQgICAgaWYgKHRoaXMub3B0aW9ucy5wcmV2ZW50SW5kZW50ICYmIGluZGVudCkge1xuXHQgICAgICB0aGlzLm9wY29kZSgnYXBwZW5kQ29udGVudCcsIGluZGVudCk7XG5cdCAgICAgIGluZGVudCA9ICcnO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLm9wY29kZSgnaW52b2tlUGFydGlhbCcsIGlzRHluYW1pYywgcGFydGlhbE5hbWUsIGluZGVudCk7XG5cdCAgICB0aGlzLm9wY29kZSgnYXBwZW5kJyk7XG5cdCAgfSxcblx0ICBQYXJ0aWFsQmxvY2tTdGF0ZW1lbnQ6IGZ1bmN0aW9uIFBhcnRpYWxCbG9ja1N0YXRlbWVudChwYXJ0aWFsQmxvY2spIHtcblx0ICAgIHRoaXMuUGFydGlhbFN0YXRlbWVudChwYXJ0aWFsQmxvY2spO1xuXHQgIH0sXG5cblx0ICBNdXN0YWNoZVN0YXRlbWVudDogZnVuY3Rpb24gTXVzdGFjaGVTdGF0ZW1lbnQobXVzdGFjaGUpIHtcblx0ICAgIHRoaXMuU3ViRXhwcmVzc2lvbihtdXN0YWNoZSk7XG5cblx0ICAgIGlmIChtdXN0YWNoZS5lc2NhcGVkICYmICF0aGlzLm9wdGlvbnMubm9Fc2NhcGUpIHtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZEVzY2FwZWQnKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdhcHBlbmQnKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIERlY29yYXRvcjogZnVuY3Rpb24gRGVjb3JhdG9yKGRlY29yYXRvcikge1xuXHQgICAgdGhpcy5EZWNvcmF0b3JCbG9jayhkZWNvcmF0b3IpO1xuXHQgIH0sXG5cblx0ICBDb250ZW50U3RhdGVtZW50OiBmdW5jdGlvbiBDb250ZW50U3RhdGVtZW50KGNvbnRlbnQpIHtcblx0ICAgIGlmIChjb250ZW50LnZhbHVlKSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdhcHBlbmRDb250ZW50JywgY29udGVudC52YWx1ZSk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIENvbW1lbnRTdGF0ZW1lbnQ6IGZ1bmN0aW9uIENvbW1lbnRTdGF0ZW1lbnQoKSB7fSxcblxuXHQgIFN1YkV4cHJlc3Npb246IGZ1bmN0aW9uIFN1YkV4cHJlc3Npb24oc2V4cHIpIHtcblx0ICAgIHRyYW5zZm9ybUxpdGVyYWxUb1BhdGgoc2V4cHIpO1xuXHQgICAgdmFyIHR5cGUgPSB0aGlzLmNsYXNzaWZ5U2V4cHIoc2V4cHIpO1xuXG5cdCAgICBpZiAodHlwZSA9PT0gJ3NpbXBsZScpIHtcblx0ICAgICAgdGhpcy5zaW1wbGVTZXhwcihzZXhwcik7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdoZWxwZXInKSB7XG5cdCAgICAgIHRoaXMuaGVscGVyU2V4cHIoc2V4cHIpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5hbWJpZ3VvdXNTZXhwcihzZXhwcik7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBhbWJpZ3VvdXNTZXhwcjogZnVuY3Rpb24gYW1iaWd1b3VzU2V4cHIoc2V4cHIsIHByb2dyYW0sIGludmVyc2UpIHtcblx0ICAgIHZhciBwYXRoID0gc2V4cHIucGF0aCxcblx0ICAgICAgICBuYW1lID0gcGF0aC5wYXJ0c1swXSxcblx0ICAgICAgICBpc0Jsb2NrID0gcHJvZ3JhbSAhPSBudWxsIHx8IGludmVyc2UgIT0gbnVsbDtcblxuXHQgICAgdGhpcy5vcGNvZGUoJ2dldENvbnRleHQnLCBwYXRoLmRlcHRoKTtcblxuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBpbnZlcnNlKTtcblxuXHQgICAgcGF0aC5zdHJpY3QgPSB0cnVlO1xuXHQgICAgdGhpcy5hY2NlcHQocGF0aCk7XG5cblx0ICAgIHRoaXMub3Bjb2RlKCdpbnZva2VBbWJpZ3VvdXMnLCBuYW1lLCBpc0Jsb2NrKTtcblx0ICB9LFxuXG5cdCAgc2ltcGxlU2V4cHI6IGZ1bmN0aW9uIHNpbXBsZVNleHByKHNleHByKSB7XG5cdCAgICB2YXIgcGF0aCA9IHNleHByLnBhdGg7XG5cdCAgICBwYXRoLnN0cmljdCA9IHRydWU7XG5cdCAgICB0aGlzLmFjY2VwdChwYXRoKTtcblx0ICAgIHRoaXMub3Bjb2RlKCdyZXNvbHZlUG9zc2libGVMYW1iZGEnKTtcblx0ICB9LFxuXG5cdCAgaGVscGVyU2V4cHI6IGZ1bmN0aW9uIGhlbHBlclNleHByKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlKSB7XG5cdCAgICB2YXIgcGFyYW1zID0gdGhpcy5zZXR1cEZ1bGxNdXN0YWNoZVBhcmFtcyhzZXhwciwgcHJvZ3JhbSwgaW52ZXJzZSksXG5cdCAgICAgICAgcGF0aCA9IHNleHByLnBhdGgsXG5cdCAgICAgICAgbmFtZSA9IHBhdGgucGFydHNbMF07XG5cblx0ICAgIGlmICh0aGlzLm9wdGlvbnMua25vd25IZWxwZXJzW25hbWVdKSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdpbnZva2VLbm93bkhlbHBlcicsIHBhcmFtcy5sZW5ndGgsIG5hbWUpO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMua25vd25IZWxwZXJzT25seSkge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnWW91IHNwZWNpZmllZCBrbm93bkhlbHBlcnNPbmx5LCBidXQgdXNlZCB0aGUgdW5rbm93biBoZWxwZXIgJyArIG5hbWUsIHNleHByKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHBhdGguc3RyaWN0ID0gdHJ1ZTtcblx0ICAgICAgcGF0aC5mYWxzeSA9IHRydWU7XG5cblx0ICAgICAgdGhpcy5hY2NlcHQocGF0aCk7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdpbnZva2VIZWxwZXInLCBwYXJhbXMubGVuZ3RoLCBwYXRoLm9yaWdpbmFsLCBfYXN0MlsnZGVmYXVsdCddLmhlbHBlcnMuc2ltcGxlSWQocGF0aCkpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBQYXRoRXhwcmVzc2lvbjogZnVuY3Rpb24gUGF0aEV4cHJlc3Npb24ocGF0aCkge1xuXHQgICAgdGhpcy5hZGREZXB0aChwYXRoLmRlcHRoKTtcblx0ICAgIHRoaXMub3Bjb2RlKCdnZXRDb250ZXh0JywgcGF0aC5kZXB0aCk7XG5cblx0ICAgIHZhciBuYW1lID0gcGF0aC5wYXJ0c1swXSxcblx0ICAgICAgICBzY29wZWQgPSBfYXN0MlsnZGVmYXVsdCddLmhlbHBlcnMuc2NvcGVkSWQocGF0aCksXG5cdCAgICAgICAgYmxvY2tQYXJhbUlkID0gIXBhdGguZGVwdGggJiYgIXNjb3BlZCAmJiB0aGlzLmJsb2NrUGFyYW1JbmRleChuYW1lKTtcblxuXHQgICAgaWYgKGJsb2NrUGFyYW1JZCkge1xuXHQgICAgICB0aGlzLm9wY29kZSgnbG9va3VwQmxvY2tQYXJhbScsIGJsb2NrUGFyYW1JZCwgcGF0aC5wYXJ0cyk7XG5cdCAgICB9IGVsc2UgaWYgKCFuYW1lKSB7XG5cdCAgICAgIC8vIENvbnRleHQgcmVmZXJlbmNlLCBpLmUuIGB7e2ZvbyAufX1gIG9yIGB7e2ZvbyAuLn19YFxuXHQgICAgICB0aGlzLm9wY29kZSgncHVzaENvbnRleHQnKTtcblx0ICAgIH0gZWxzZSBpZiAocGF0aC5kYXRhKSB7XG5cdCAgICAgIHRoaXMub3B0aW9ucy5kYXRhID0gdHJ1ZTtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2xvb2t1cERhdGEnLCBwYXRoLmRlcHRoLCBwYXRoLnBhcnRzLCBwYXRoLnN0cmljdCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLm9wY29kZSgnbG9va3VwT25Db250ZXh0JywgcGF0aC5wYXJ0cywgcGF0aC5mYWxzeSwgcGF0aC5zdHJpY3QsIHNjb3BlZCk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIFN0cmluZ0xpdGVyYWw6IGZ1bmN0aW9uIFN0cmluZ0xpdGVyYWwoc3RyaW5nKSB7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaFN0cmluZycsIHN0cmluZy52YWx1ZSk7XG5cdCAgfSxcblxuXHQgIE51bWJlckxpdGVyYWw6IGZ1bmN0aW9uIE51bWJlckxpdGVyYWwobnVtYmVyKSB7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCBudW1iZXIudmFsdWUpO1xuXHQgIH0sXG5cblx0ICBCb29sZWFuTGl0ZXJhbDogZnVuY3Rpb24gQm9vbGVhbkxpdGVyYWwoYm9vbCkge1xuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgYm9vbC52YWx1ZSk7XG5cdCAgfSxcblxuXHQgIFVuZGVmaW5lZExpdGVyYWw6IGZ1bmN0aW9uIFVuZGVmaW5lZExpdGVyYWwoKSB7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCAndW5kZWZpbmVkJyk7XG5cdCAgfSxcblxuXHQgIE51bGxMaXRlcmFsOiBmdW5jdGlvbiBOdWxsTGl0ZXJhbCgpIHtcblx0ICAgIHRoaXMub3Bjb2RlKCdwdXNoTGl0ZXJhbCcsICdudWxsJyk7XG5cdCAgfSxcblxuXHQgIEhhc2g6IGZ1bmN0aW9uIEhhc2goaGFzaCkge1xuXHQgICAgdmFyIHBhaXJzID0gaGFzaC5wYWlycyxcblx0ICAgICAgICBpID0gMCxcblx0ICAgICAgICBsID0gcGFpcnMubGVuZ3RoO1xuXG5cdCAgICB0aGlzLm9wY29kZSgncHVzaEhhc2gnKTtcblxuXHQgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgdGhpcy5wdXNoUGFyYW0ocGFpcnNbaV0udmFsdWUpO1xuXHQgICAgfVxuXHQgICAgd2hpbGUgKGktLSkge1xuXHQgICAgICB0aGlzLm9wY29kZSgnYXNzaWduVG9IYXNoJywgcGFpcnNbaV0ua2V5KTtcblx0ICAgIH1cblx0ICAgIHRoaXMub3Bjb2RlKCdwb3BIYXNoJyk7XG5cdCAgfSxcblxuXHQgIC8vIEhFTFBFUlNcblx0ICBvcGNvZGU6IGZ1bmN0aW9uIG9wY29kZShuYW1lKSB7XG5cdCAgICB0aGlzLm9wY29kZXMucHVzaCh7IG9wY29kZTogbmFtZSwgYXJnczogc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBsb2M6IHRoaXMuc291cmNlTm9kZVswXS5sb2MgfSk7XG5cdCAgfSxcblxuXHQgIGFkZERlcHRoOiBmdW5jdGlvbiBhZGREZXB0aChkZXB0aCkge1xuXHQgICAgaWYgKCFkZXB0aCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHRoaXMudXNlRGVwdGhzID0gdHJ1ZTtcblx0ICB9LFxuXG5cdCAgY2xhc3NpZnlTZXhwcjogZnVuY3Rpb24gY2xhc3NpZnlTZXhwcihzZXhwcikge1xuXHQgICAgdmFyIGlzU2ltcGxlID0gX2FzdDJbJ2RlZmF1bHQnXS5oZWxwZXJzLnNpbXBsZUlkKHNleHByLnBhdGgpO1xuXG5cdCAgICB2YXIgaXNCbG9ja1BhcmFtID0gaXNTaW1wbGUgJiYgISF0aGlzLmJsb2NrUGFyYW1JbmRleChzZXhwci5wYXRoLnBhcnRzWzBdKTtcblxuXHQgICAgLy8gYSBtdXN0YWNoZSBpcyBhbiBlbGlnaWJsZSBoZWxwZXIgaWY6XG5cdCAgICAvLyAqIGl0cyBpZCBpcyBzaW1wbGUgKGEgc2luZ2xlIHBhcnQsIG5vdCBgdGhpc2Agb3IgYC4uYClcblx0ICAgIHZhciBpc0hlbHBlciA9ICFpc0Jsb2NrUGFyYW0gJiYgX2FzdDJbJ2RlZmF1bHQnXS5oZWxwZXJzLmhlbHBlckV4cHJlc3Npb24oc2V4cHIpO1xuXG5cdCAgICAvLyBpZiBhIG11c3RhY2hlIGlzIGFuIGVsaWdpYmxlIGhlbHBlciBidXQgbm90IGEgZGVmaW5pdGVcblx0ICAgIC8vIGhlbHBlciwgaXQgaXMgYW1iaWd1b3VzLCBhbmQgd2lsbCBiZSByZXNvbHZlZCBpbiBhIGxhdGVyXG5cdCAgICAvLyBwYXNzIG9yIGF0IHJ1bnRpbWUuXG5cdCAgICB2YXIgaXNFbGlnaWJsZSA9ICFpc0Jsb2NrUGFyYW0gJiYgKGlzSGVscGVyIHx8IGlzU2ltcGxlKTtcblxuXHQgICAgLy8gaWYgYW1iaWd1b3VzLCB3ZSBjYW4gcG9zc2libHkgcmVzb2x2ZSB0aGUgYW1iaWd1aXR5IG5vd1xuXHQgICAgLy8gQW4gZWxpZ2libGUgaGVscGVyIGlzIG9uZSB0aGF0IGRvZXMgbm90IGhhdmUgYSBjb21wbGV4IHBhdGgsIGkuZS4gYHRoaXMuZm9vYCwgYC4uL2Zvb2AgZXRjLlxuXHQgICAgaWYgKGlzRWxpZ2libGUgJiYgIWlzSGVscGVyKSB7XG5cdCAgICAgIHZhciBfbmFtZTIgPSBzZXhwci5wYXRoLnBhcnRzWzBdLFxuXHQgICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXHQgICAgICBpZiAob3B0aW9ucy5rbm93bkhlbHBlcnNbX25hbWUyXSkge1xuXHQgICAgICAgIGlzSGVscGVyID0gdHJ1ZTtcblx0ICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmtub3duSGVscGVyc09ubHkpIHtcblx0ICAgICAgICBpc0VsaWdpYmxlID0gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgaWYgKGlzSGVscGVyKSB7XG5cdCAgICAgIHJldHVybiAnaGVscGVyJztcblx0ICAgIH0gZWxzZSBpZiAoaXNFbGlnaWJsZSkge1xuXHQgICAgICByZXR1cm4gJ2FtYmlndW91cyc7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gJ3NpbXBsZSc7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHB1c2hQYXJhbXM6IGZ1bmN0aW9uIHB1c2hQYXJhbXMocGFyYW1zKSB7XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhcmFtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgdGhpcy5wdXNoUGFyYW0ocGFyYW1zW2ldKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgcHVzaFBhcmFtOiBmdW5jdGlvbiBwdXNoUGFyYW0odmFsKSB7XG5cdCAgICB2YXIgdmFsdWUgPSB2YWwudmFsdWUgIT0gbnVsbCA/IHZhbC52YWx1ZSA6IHZhbC5vcmlnaW5hbCB8fCAnJztcblxuXHQgICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG5cdCAgICAgIGlmICh2YWx1ZS5yZXBsYWNlKSB7XG5cdCAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9eKFxcLj9cXC5cXC8pKi9nLCAnJykucmVwbGFjZSgvXFwvL2csICcuJyk7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAodmFsLmRlcHRoKSB7XG5cdCAgICAgICAgdGhpcy5hZGREZXB0aCh2YWwuZGVwdGgpO1xuXHQgICAgICB9XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdnZXRDb250ZXh0JywgdmFsLmRlcHRoIHx8IDApO1xuXHQgICAgICB0aGlzLm9wY29kZSgncHVzaFN0cmluZ1BhcmFtJywgdmFsdWUsIHZhbC50eXBlKTtcblxuXHQgICAgICBpZiAodmFsLnR5cGUgPT09ICdTdWJFeHByZXNzaW9uJykge1xuXHQgICAgICAgIC8vIFN1YkV4cHJlc3Npb25zIGdldCBldmFsdWF0ZWQgYW5kIHBhc3NlZCBpblxuXHQgICAgICAgIC8vIGluIHN0cmluZyBwYXJhbXMgbW9kZS5cblx0ICAgICAgICB0aGlzLmFjY2VwdCh2YWwpO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBpZiAodGhpcy50cmFja0lkcykge1xuXHQgICAgICAgIHZhciBibG9ja1BhcmFtSW5kZXggPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgaWYgKHZhbC5wYXJ0cyAmJiAhX2FzdDJbJ2RlZmF1bHQnXS5oZWxwZXJzLnNjb3BlZElkKHZhbCkgJiYgIXZhbC5kZXB0aCkge1xuXHQgICAgICAgICAgYmxvY2tQYXJhbUluZGV4ID0gdGhpcy5ibG9ja1BhcmFtSW5kZXgodmFsLnBhcnRzWzBdKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKGJsb2NrUGFyYW1JbmRleCkge1xuXHQgICAgICAgICAgdmFyIGJsb2NrUGFyYW1DaGlsZCA9IHZhbC5wYXJ0cy5zbGljZSgxKS5qb2luKCcuJyk7XG5cdCAgICAgICAgICB0aGlzLm9wY29kZSgncHVzaElkJywgJ0Jsb2NrUGFyYW0nLCBibG9ja1BhcmFtSW5kZXgsIGJsb2NrUGFyYW1DaGlsZCk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHZhbHVlID0gdmFsLm9yaWdpbmFsIHx8IHZhbHVlO1xuXHQgICAgICAgICAgaWYgKHZhbHVlLnJlcGxhY2UpIHtcblx0ICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9edGhpcyg/OlxcLnwkKS8sICcnKS5yZXBsYWNlKC9eXFwuXFwvLywgJycpLnJlcGxhY2UoL15cXC4kLywgJycpO1xuXHQgICAgICAgICAgfVxuXG5cdCAgICAgICAgICB0aGlzLm9wY29kZSgncHVzaElkJywgdmFsLnR5cGUsIHZhbHVlKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5hY2NlcHQodmFsKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXM6IGZ1bmN0aW9uIHNldHVwRnVsbE11c3RhY2hlUGFyYW1zKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlLCBvbWl0RW1wdHkpIHtcblx0ICAgIHZhciBwYXJhbXMgPSBzZXhwci5wYXJhbXM7XG5cdCAgICB0aGlzLnB1c2hQYXJhbXMocGFyYW1zKTtcblxuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBpbnZlcnNlKTtcblxuXHQgICAgaWYgKHNleHByLmhhc2gpIHtcblx0ICAgICAgdGhpcy5hY2NlcHQoc2V4cHIuaGFzaCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLm9wY29kZSgnZW1wdHlIYXNoJywgb21pdEVtcHR5KTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHBhcmFtcztcblx0ICB9LFxuXG5cdCAgYmxvY2tQYXJhbUluZGV4OiBmdW5jdGlvbiBibG9ja1BhcmFtSW5kZXgobmFtZSkge1xuXHQgICAgZm9yICh2YXIgZGVwdGggPSAwLCBsZW4gPSB0aGlzLm9wdGlvbnMuYmxvY2tQYXJhbXMubGVuZ3RoOyBkZXB0aCA8IGxlbjsgZGVwdGgrKykge1xuXHQgICAgICB2YXIgYmxvY2tQYXJhbXMgPSB0aGlzLm9wdGlvbnMuYmxvY2tQYXJhbXNbZGVwdGhdLFxuXHQgICAgICAgICAgcGFyYW0gPSBibG9ja1BhcmFtcyAmJiBfdXRpbHMuaW5kZXhPZihibG9ja1BhcmFtcywgbmFtZSk7XG5cdCAgICAgIGlmIChibG9ja1BhcmFtcyAmJiBwYXJhbSA+PSAwKSB7XG5cdCAgICAgICAgcmV0dXJuIFtkZXB0aCwgcGFyYW1dO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXG5cdGZ1bmN0aW9uIHByZWNvbXBpbGUoaW5wdXQsIG9wdGlvbnMsIGVudikge1xuXHQgIGlmIChpbnB1dCA9PSBudWxsIHx8IHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycgJiYgaW5wdXQudHlwZSAhPT0gJ1Byb2dyYW0nKSB7XG5cdCAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnWW91IG11c3QgcGFzcyBhIHN0cmluZyBvciBIYW5kbGViYXJzIEFTVCB0byBIYW5kbGViYXJzLnByZWNvbXBpbGUuIFlvdSBwYXNzZWQgJyArIGlucHV0KTtcblx0ICB9XG5cblx0ICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0ICBpZiAoISgnZGF0YScgaW4gb3B0aW9ucykpIHtcblx0ICAgIG9wdGlvbnMuZGF0YSA9IHRydWU7XG5cdCAgfVxuXHQgIGlmIChvcHRpb25zLmNvbXBhdCkge1xuXHQgICAgb3B0aW9ucy51c2VEZXB0aHMgPSB0cnVlO1xuXHQgIH1cblxuXHQgIHZhciBhc3QgPSBlbnYucGFyc2UoaW5wdXQsIG9wdGlvbnMpLFxuXHQgICAgICBlbnZpcm9ubWVudCA9IG5ldyBlbnYuQ29tcGlsZXIoKS5jb21waWxlKGFzdCwgb3B0aW9ucyk7XG5cdCAgcmV0dXJuIG5ldyBlbnYuSmF2YVNjcmlwdENvbXBpbGVyKCkuY29tcGlsZShlbnZpcm9ubWVudCwgb3B0aW9ucyk7XG5cdH1cblxuXHRmdW5jdGlvbiBjb21waWxlKGlucHV0LCBvcHRpb25zLCBlbnYpIHtcblx0ICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSBvcHRpb25zID0ge307XG5cblx0ICBpZiAoaW5wdXQgPT0gbnVsbCB8fCB0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnICYmIGlucHV0LnR5cGUgIT09ICdQcm9ncmFtJykge1xuXHQgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1lvdSBtdXN0IHBhc3MgYSBzdHJpbmcgb3IgSGFuZGxlYmFycyBBU1QgdG8gSGFuZGxlYmFycy5jb21waWxlLiBZb3UgcGFzc2VkICcgKyBpbnB1dCk7XG5cdCAgfVxuXG5cdCAgb3B0aW9ucyA9IF91dGlscy5leHRlbmQoe30sIG9wdGlvbnMpO1xuXHQgIGlmICghKCdkYXRhJyBpbiBvcHRpb25zKSkge1xuXHQgICAgb3B0aW9ucy5kYXRhID0gdHJ1ZTtcblx0ICB9XG5cdCAgaWYgKG9wdGlvbnMuY29tcGF0KSB7XG5cdCAgICBvcHRpb25zLnVzZURlcHRocyA9IHRydWU7XG5cdCAgfVxuXG5cdCAgdmFyIGNvbXBpbGVkID0gdW5kZWZpbmVkO1xuXG5cdCAgZnVuY3Rpb24gY29tcGlsZUlucHV0KCkge1xuXHQgICAgdmFyIGFzdCA9IGVudi5wYXJzZShpbnB1dCwgb3B0aW9ucyksXG5cdCAgICAgICAgZW52aXJvbm1lbnQgPSBuZXcgZW52LkNvbXBpbGVyKCkuY29tcGlsZShhc3QsIG9wdGlvbnMpLFxuXHQgICAgICAgIHRlbXBsYXRlU3BlYyA9IG5ldyBlbnYuSmF2YVNjcmlwdENvbXBpbGVyKCkuY29tcGlsZShlbnZpcm9ubWVudCwgb3B0aW9ucywgdW5kZWZpbmVkLCB0cnVlKTtcblx0ICAgIHJldHVybiBlbnYudGVtcGxhdGUodGVtcGxhdGVTcGVjKTtcblx0ICB9XG5cblx0ICAvLyBUZW1wbGF0ZSBpcyBvbmx5IGNvbXBpbGVkIG9uIGZpcnN0IHVzZSBhbmQgY2FjaGVkIGFmdGVyIHRoYXQgcG9pbnQuXG5cdCAgZnVuY3Rpb24gcmV0KGNvbnRleHQsIGV4ZWNPcHRpb25zKSB7XG5cdCAgICBpZiAoIWNvbXBpbGVkKSB7XG5cdCAgICAgIGNvbXBpbGVkID0gY29tcGlsZUlucHV0KCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gY29tcGlsZWQuY2FsbCh0aGlzLCBjb250ZXh0LCBleGVjT3B0aW9ucyk7XG5cdCAgfVxuXHQgIHJldC5fc2V0dXAgPSBmdW5jdGlvbiAoc2V0dXBPcHRpb25zKSB7XG5cdCAgICBpZiAoIWNvbXBpbGVkKSB7XG5cdCAgICAgIGNvbXBpbGVkID0gY29tcGlsZUlucHV0KCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gY29tcGlsZWQuX3NldHVwKHNldHVwT3B0aW9ucyk7XG5cdCAgfTtcblx0ICByZXQuX2NoaWxkID0gZnVuY3Rpb24gKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcblx0ICAgIGlmICghY29tcGlsZWQpIHtcblx0ICAgICAgY29tcGlsZWQgPSBjb21waWxlSW5wdXQoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjb21waWxlZC5fY2hpbGQoaSwgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG5cdCAgfTtcblx0ICByZXR1cm4gcmV0O1xuXHR9XG5cblx0ZnVuY3Rpb24gYXJnRXF1YWxzKGEsIGIpIHtcblx0ICBpZiAoYSA9PT0gYikge1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXG5cdCAgaWYgKF91dGlscy5pc0FycmF5KGEpICYmIF91dGlscy5pc0FycmF5KGIpICYmIGEubGVuZ3RoID09PSBiLmxlbmd0aCkge1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIGlmICghYXJnRXF1YWxzKGFbaV0sIGJbaV0pKSB7XG5cdCAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cdH1cblxuXHRmdW5jdGlvbiB0cmFuc2Zvcm1MaXRlcmFsVG9QYXRoKHNleHByKSB7XG5cdCAgaWYgKCFzZXhwci5wYXRoLnBhcnRzKSB7XG5cdCAgICB2YXIgbGl0ZXJhbCA9IHNleHByLnBhdGg7XG5cdCAgICAvLyBDYXN0aW5nIHRvIHN0cmluZyBoZXJlIHRvIG1ha2UgZmFsc2UgYW5kIDAgbGl0ZXJhbCB2YWx1ZXMgcGxheSBuaWNlbHkgd2l0aCB0aGUgcmVzdFxuXHQgICAgLy8gb2YgdGhlIHN5c3RlbS5cblx0ICAgIHNleHByLnBhdGggPSB7XG5cdCAgICAgIHR5cGU6ICdQYXRoRXhwcmVzc2lvbicsXG5cdCAgICAgIGRhdGE6IGZhbHNlLFxuXHQgICAgICBkZXB0aDogMCxcblx0ICAgICAgcGFydHM6IFtsaXRlcmFsLm9yaWdpbmFsICsgJyddLFxuXHQgICAgICBvcmlnaW5hbDogbGl0ZXJhbC5vcmlnaW5hbCArICcnLFxuXHQgICAgICBsb2M6IGxpdGVyYWwubG9jXG5cdCAgICB9O1xuXHQgIH1cblx0fVxuXG4vKioqLyB9KSxcbi8qIDQyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF9iYXNlID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHR2YXIgX2NvZGVHZW4gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQzKTtcblxuXHR2YXIgX2NvZGVHZW4yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29kZUdlbik7XG5cblx0ZnVuY3Rpb24gTGl0ZXJhbCh2YWx1ZSkge1xuXHQgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIEphdmFTY3JpcHRDb21waWxlcigpIHt9XG5cblx0SmF2YVNjcmlwdENvbXBpbGVyLnByb3RvdHlwZSA9IHtcblx0ICAvLyBQVUJMSUMgQVBJOiBZb3UgY2FuIG92ZXJyaWRlIHRoZXNlIG1ldGhvZHMgaW4gYSBzdWJjbGFzcyB0byBwcm92aWRlXG5cdCAgLy8gYWx0ZXJuYXRpdmUgY29tcGlsZWQgZm9ybXMgZm9yIG5hbWUgbG9va3VwIGFuZCBidWZmZXJpbmcgc2VtYW50aWNzXG5cdCAgbmFtZUxvb2t1cDogZnVuY3Rpb24gbmFtZUxvb2t1cChwYXJlbnQsIG5hbWUgLyogLCB0eXBlKi8pIHtcblx0ICAgIGlmIChKYXZhU2NyaXB0Q29tcGlsZXIuaXNWYWxpZEphdmFTY3JpcHRWYXJpYWJsZU5hbWUobmFtZSkpIHtcblx0ICAgICAgcmV0dXJuIFtwYXJlbnQsICcuJywgbmFtZV07XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gW3BhcmVudCwgJ1snLCBKU09OLnN0cmluZ2lmeShuYW1lKSwgJ10nXTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIGRlcHRoZWRMb29rdXA6IGZ1bmN0aW9uIGRlcHRoZWRMb29rdXAobmFtZSkge1xuXHQgICAgcmV0dXJuIFt0aGlzLmFsaWFzYWJsZSgnY29udGFpbmVyLmxvb2t1cCcpLCAnKGRlcHRocywgXCInLCBuYW1lLCAnXCIpJ107XG5cdCAgfSxcblxuXHQgIGNvbXBpbGVySW5mbzogZnVuY3Rpb24gY29tcGlsZXJJbmZvKCkge1xuXHQgICAgdmFyIHJldmlzaW9uID0gX2Jhc2UuQ09NUElMRVJfUkVWSVNJT04sXG5cdCAgICAgICAgdmVyc2lvbnMgPSBfYmFzZS5SRVZJU0lPTl9DSEFOR0VTW3JldmlzaW9uXTtcblx0ICAgIHJldHVybiBbcmV2aXNpb24sIHZlcnNpb25zXTtcblx0ICB9LFxuXG5cdCAgYXBwZW5kVG9CdWZmZXI6IGZ1bmN0aW9uIGFwcGVuZFRvQnVmZmVyKHNvdXJjZSwgbG9jYXRpb24sIGV4cGxpY2l0KSB7XG5cdCAgICAvLyBGb3JjZSBhIHNvdXJjZSBhcyB0aGlzIHNpbXBsaWZpZXMgdGhlIG1lcmdlIGxvZ2ljLlxuXHQgICAgaWYgKCFfdXRpbHMuaXNBcnJheShzb3VyY2UpKSB7XG5cdCAgICAgIHNvdXJjZSA9IFtzb3VyY2VdO1xuXHQgICAgfVxuXHQgICAgc291cmNlID0gdGhpcy5zb3VyY2Uud3JhcChzb3VyY2UsIGxvY2F0aW9uKTtcblxuXHQgICAgaWYgKHRoaXMuZW52aXJvbm1lbnQuaXNTaW1wbGUpIHtcblx0ICAgICAgcmV0dXJuIFsncmV0dXJuICcsIHNvdXJjZSwgJzsnXTtcblx0ICAgIH0gZWxzZSBpZiAoZXhwbGljaXQpIHtcblx0ICAgICAgLy8gVGhpcyBpcyBhIGNhc2Ugd2hlcmUgdGhlIGJ1ZmZlciBvcGVyYXRpb24gb2NjdXJzIGFzIGEgY2hpbGQgb2YgYW5vdGhlclxuXHQgICAgICAvLyBjb25zdHJ1Y3QsIGdlbmVyYWxseSBicmFjZXMuIFdlIGhhdmUgdG8gZXhwbGljaXRseSBvdXRwdXQgdGhlc2UgYnVmZmVyXG5cdCAgICAgIC8vIG9wZXJhdGlvbnMgdG8gZW5zdXJlIHRoYXQgdGhlIGVtaXR0ZWQgY29kZSBnb2VzIGluIHRoZSBjb3JyZWN0IGxvY2F0aW9uLlxuXHQgICAgICByZXR1cm4gWydidWZmZXIgKz0gJywgc291cmNlLCAnOyddO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc291cmNlLmFwcGVuZFRvQnVmZmVyID0gdHJ1ZTtcblx0ICAgICAgcmV0dXJuIHNvdXJjZTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgaW5pdGlhbGl6ZUJ1ZmZlcjogZnVuY3Rpb24gaW5pdGlhbGl6ZUJ1ZmZlcigpIHtcblx0ICAgIHJldHVybiB0aGlzLnF1b3RlZFN0cmluZygnJyk7XG5cdCAgfSxcblx0ICAvLyBFTkQgUFVCTElDIEFQSVxuXG5cdCAgY29tcGlsZTogZnVuY3Rpb24gY29tcGlsZShlbnZpcm9ubWVudCwgb3B0aW9ucywgY29udGV4dCwgYXNPYmplY3QpIHtcblx0ICAgIHRoaXMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDtcblx0ICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdCAgICB0aGlzLnN0cmluZ1BhcmFtcyA9IHRoaXMub3B0aW9ucy5zdHJpbmdQYXJhbXM7XG5cdCAgICB0aGlzLnRyYWNrSWRzID0gdGhpcy5vcHRpb25zLnRyYWNrSWRzO1xuXHQgICAgdGhpcy5wcmVjb21waWxlID0gIWFzT2JqZWN0O1xuXG5cdCAgICB0aGlzLm5hbWUgPSB0aGlzLmVudmlyb25tZW50Lm5hbWU7XG5cdCAgICB0aGlzLmlzQ2hpbGQgPSAhIWNvbnRleHQ7XG5cdCAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0IHx8IHtcblx0ICAgICAgZGVjb3JhdG9yczogW10sXG5cdCAgICAgIHByb2dyYW1zOiBbXSxcblx0ICAgICAgZW52aXJvbm1lbnRzOiBbXVxuXHQgICAgfTtcblxuXHQgICAgdGhpcy5wcmVhbWJsZSgpO1xuXG5cdCAgICB0aGlzLnN0YWNrU2xvdCA9IDA7XG5cdCAgICB0aGlzLnN0YWNrVmFycyA9IFtdO1xuXHQgICAgdGhpcy5hbGlhc2VzID0ge307XG5cdCAgICB0aGlzLnJlZ2lzdGVycyA9IHsgbGlzdDogW10gfTtcblx0ICAgIHRoaXMuaGFzaGVzID0gW107XG5cdCAgICB0aGlzLmNvbXBpbGVTdGFjayA9IFtdO1xuXHQgICAgdGhpcy5pbmxpbmVTdGFjayA9IFtdO1xuXHQgICAgdGhpcy5ibG9ja1BhcmFtcyA9IFtdO1xuXG5cdCAgICB0aGlzLmNvbXBpbGVDaGlsZHJlbihlbnZpcm9ubWVudCwgb3B0aW9ucyk7XG5cblx0ICAgIHRoaXMudXNlRGVwdGhzID0gdGhpcy51c2VEZXB0aHMgfHwgZW52aXJvbm1lbnQudXNlRGVwdGhzIHx8IGVudmlyb25tZW50LnVzZURlY29yYXRvcnMgfHwgdGhpcy5vcHRpb25zLmNvbXBhdDtcblx0ICAgIHRoaXMudXNlQmxvY2tQYXJhbXMgPSB0aGlzLnVzZUJsb2NrUGFyYW1zIHx8IGVudmlyb25tZW50LnVzZUJsb2NrUGFyYW1zO1xuXG5cdCAgICB2YXIgb3Bjb2RlcyA9IGVudmlyb25tZW50Lm9wY29kZXMsXG5cdCAgICAgICAgb3Bjb2RlID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGZpcnN0TG9jID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGkgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgbCA9IHVuZGVmaW5lZDtcblxuXHQgICAgZm9yIChpID0gMCwgbCA9IG9wY29kZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgIG9wY29kZSA9IG9wY29kZXNbaV07XG5cblx0ICAgICAgdGhpcy5zb3VyY2UuY3VycmVudExvY2F0aW9uID0gb3Bjb2RlLmxvYztcblx0ICAgICAgZmlyc3RMb2MgPSBmaXJzdExvYyB8fCBvcGNvZGUubG9jO1xuXHQgICAgICB0aGlzW29wY29kZS5vcGNvZGVdLmFwcGx5KHRoaXMsIG9wY29kZS5hcmdzKTtcblx0ICAgIH1cblxuXHQgICAgLy8gRmx1c2ggYW55IHRyYWlsaW5nIGNvbnRlbnQgdGhhdCBtaWdodCBiZSBwZW5kaW5nLlxuXHQgICAgdGhpcy5zb3VyY2UuY3VycmVudExvY2F0aW9uID0gZmlyc3RMb2M7XG5cdCAgICB0aGlzLnB1c2hTb3VyY2UoJycpO1xuXG5cdCAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgICAgaWYgKHRoaXMuc3RhY2tTbG90IHx8IHRoaXMuaW5saW5lU3RhY2subGVuZ3RoIHx8IHRoaXMuY29tcGlsZVN0YWNrLmxlbmd0aCkge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnQ29tcGlsZSBjb21wbGV0ZWQgd2l0aCBjb250ZW50IGxlZnQgb24gc3RhY2snKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKCF0aGlzLmRlY29yYXRvcnMuaXNFbXB0eSgpKSB7XG5cdCAgICAgIHRoaXMudXNlRGVjb3JhdG9ycyA9IHRydWU7XG5cblx0ICAgICAgdGhpcy5kZWNvcmF0b3JzLnByZXBlbmQoJ3ZhciBkZWNvcmF0b3JzID0gY29udGFpbmVyLmRlY29yYXRvcnM7XFxuJyk7XG5cdCAgICAgIHRoaXMuZGVjb3JhdG9ycy5wdXNoKCdyZXR1cm4gZm47Jyk7XG5cblx0ICAgICAgaWYgKGFzT2JqZWN0KSB7XG5cdCAgICAgICAgdGhpcy5kZWNvcmF0b3JzID0gRnVuY3Rpb24uYXBwbHkodGhpcywgWydmbicsICdwcm9wcycsICdjb250YWluZXInLCAnZGVwdGgwJywgJ2RhdGEnLCAnYmxvY2tQYXJhbXMnLCAnZGVwdGhzJywgdGhpcy5kZWNvcmF0b3JzLm1lcmdlKCldKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB0aGlzLmRlY29yYXRvcnMucHJlcGVuZCgnZnVuY3Rpb24oZm4sIHByb3BzLCBjb250YWluZXIsIGRlcHRoMCwgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocykge1xcbicpO1xuXHQgICAgICAgIHRoaXMuZGVjb3JhdG9ycy5wdXNoKCd9XFxuJyk7XG5cdCAgICAgICAgdGhpcy5kZWNvcmF0b3JzID0gdGhpcy5kZWNvcmF0b3JzLm1lcmdlKCk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMuZGVjb3JhdG9ycyA9IHVuZGVmaW5lZDtcblx0ICAgIH1cblxuXHQgICAgdmFyIGZuID0gdGhpcy5jcmVhdGVGdW5jdGlvbkNvbnRleHQoYXNPYmplY3QpO1xuXHQgICAgaWYgKCF0aGlzLmlzQ2hpbGQpIHtcblx0ICAgICAgdmFyIHJldCA9IHtcblx0ICAgICAgICBjb21waWxlcjogdGhpcy5jb21waWxlckluZm8oKSxcblx0ICAgICAgICBtYWluOiBmblxuXHQgICAgICB9O1xuXG5cdCAgICAgIGlmICh0aGlzLmRlY29yYXRvcnMpIHtcblx0ICAgICAgICByZXQubWFpbl9kID0gdGhpcy5kZWNvcmF0b3JzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNhbWVsY2FzZVxuXHQgICAgICAgIHJldC51c2VEZWNvcmF0b3JzID0gdHJ1ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHZhciBfY29udGV4dCA9IHRoaXMuY29udGV4dDtcblx0ICAgICAgdmFyIHByb2dyYW1zID0gX2NvbnRleHQucHJvZ3JhbXM7XG5cdCAgICAgIHZhciBkZWNvcmF0b3JzID0gX2NvbnRleHQuZGVjb3JhdG9ycztcblxuXHQgICAgICBmb3IgKGkgPSAwLCBsID0gcHJvZ3JhbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgICAgaWYgKHByb2dyYW1zW2ldKSB7XG5cdCAgICAgICAgICByZXRbaV0gPSBwcm9ncmFtc1tpXTtcblx0ICAgICAgICAgIGlmIChkZWNvcmF0b3JzW2ldKSB7XG5cdCAgICAgICAgICAgIHJldFtpICsgJ19kJ10gPSBkZWNvcmF0b3JzW2ldO1xuXHQgICAgICAgICAgICByZXQudXNlRGVjb3JhdG9ycyA9IHRydWU7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKHRoaXMuZW52aXJvbm1lbnQudXNlUGFydGlhbCkge1xuXHQgICAgICAgIHJldC51c2VQYXJ0aWFsID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAodGhpcy5vcHRpb25zLmRhdGEpIHtcblx0ICAgICAgICByZXQudXNlRGF0YSA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHRoaXMudXNlRGVwdGhzKSB7XG5cdCAgICAgICAgcmV0LnVzZURlcHRocyA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHRoaXMudXNlQmxvY2tQYXJhbXMpIHtcblx0ICAgICAgICByZXQudXNlQmxvY2tQYXJhbXMgPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGF0KSB7XG5cdCAgICAgICAgcmV0LmNvbXBhdCA9IHRydWU7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoIWFzT2JqZWN0KSB7XG5cdCAgICAgICAgcmV0LmNvbXBpbGVyID0gSlNPTi5zdHJpbmdpZnkocmV0LmNvbXBpbGVyKTtcblxuXHQgICAgICAgIHRoaXMuc291cmNlLmN1cnJlbnRMb2NhdGlvbiA9IHsgc3RhcnQ6IHsgbGluZTogMSwgY29sdW1uOiAwIH0gfTtcblx0ICAgICAgICByZXQgPSB0aGlzLm9iamVjdExpdGVyYWwocmV0KTtcblxuXHQgICAgICAgIGlmIChvcHRpb25zLnNyY05hbWUpIHtcblx0ICAgICAgICAgIHJldCA9IHJldC50b1N0cmluZ1dpdGhTb3VyY2VNYXAoeyBmaWxlOiBvcHRpb25zLmRlc3ROYW1lIH0pO1xuXHQgICAgICAgICAgcmV0Lm1hcCA9IHJldC5tYXAgJiYgcmV0Lm1hcC50b1N0cmluZygpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICByZXQgPSByZXQudG9TdHJpbmcoKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmV0LmNvbXBpbGVyT3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiByZXQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gZm47XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHByZWFtYmxlOiBmdW5jdGlvbiBwcmVhbWJsZSgpIHtcblx0ICAgIC8vIHRyYWNrIHRoZSBsYXN0IGNvbnRleHQgcHVzaGVkIGludG8gcGxhY2UgdG8gYWxsb3cgc2tpcHBpbmcgdGhlXG5cdCAgICAvLyBnZXRDb250ZXh0IG9wY29kZSB3aGVuIGl0IHdvdWxkIGJlIGEgbm9vcFxuXHQgICAgdGhpcy5sYXN0Q29udGV4dCA9IDA7XG5cdCAgICB0aGlzLnNvdXJjZSA9IG5ldyBfY29kZUdlbjJbJ2RlZmF1bHQnXSh0aGlzLm9wdGlvbnMuc3JjTmFtZSk7XG5cdCAgICB0aGlzLmRlY29yYXRvcnMgPSBuZXcgX2NvZGVHZW4yWydkZWZhdWx0J10odGhpcy5vcHRpb25zLnNyY05hbWUpO1xuXHQgIH0sXG5cblx0ICBjcmVhdGVGdW5jdGlvbkNvbnRleHQ6IGZ1bmN0aW9uIGNyZWF0ZUZ1bmN0aW9uQ29udGV4dChhc09iamVjdCkge1xuXHQgICAgdmFyIHZhckRlY2xhcmF0aW9ucyA9ICcnO1xuXG5cdCAgICB2YXIgbG9jYWxzID0gdGhpcy5zdGFja1ZhcnMuY29uY2F0KHRoaXMucmVnaXN0ZXJzLmxpc3QpO1xuXHQgICAgaWYgKGxvY2Fscy5sZW5ndGggPiAwKSB7XG5cdCAgICAgIHZhckRlY2xhcmF0aW9ucyArPSAnLCAnICsgbG9jYWxzLmpvaW4oJywgJyk7XG5cdCAgICB9XG5cblx0ICAgIC8vIEdlbmVyYXRlIG1pbmltaXplciBhbGlhcyBtYXBwaW5nc1xuXHQgICAgLy9cblx0ICAgIC8vIFdoZW4gdXNpbmcgdHJ1ZSBTb3VyY2VOb2RlcywgdGhpcyB3aWxsIHVwZGF0ZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgZ2l2ZW4gYWxpYXNcblx0ICAgIC8vIGFzIHRoZSBzb3VyY2Ugbm9kZXMgYXJlIHJldXNlZCBpbiBzaXR1LiBGb3IgdGhlIG5vbi1zb3VyY2Ugbm9kZSBjb21waWxhdGlvbiBtb2RlLFxuXHQgICAgLy8gYWxpYXNlcyB3aWxsIG5vdCBiZSB1c2VkLCBidXQgdGhpcyBjYXNlIGlzIGFscmVhZHkgYmVpbmcgcnVuIG9uIHRoZSBjbGllbnQgYW5kXG5cdCAgICAvLyB3ZSBhcmVuJ3QgY29uY2VybiBhYm91dCBtaW5pbWl6aW5nIHRoZSB0ZW1wbGF0ZSBzaXplLlxuXHQgICAgdmFyIGFsaWFzQ291bnQgPSAwO1xuXHQgICAgZm9yICh2YXIgYWxpYXMgaW4gdGhpcy5hbGlhc2VzKSB7XG5cdCAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZ3VhcmQtZm9yLWluXG5cdCAgICAgIHZhciBub2RlID0gdGhpcy5hbGlhc2VzW2FsaWFzXTtcblxuXHQgICAgICBpZiAodGhpcy5hbGlhc2VzLmhhc093blByb3BlcnR5KGFsaWFzKSAmJiBub2RlLmNoaWxkcmVuICYmIG5vZGUucmVmZXJlbmNlQ291bnQgPiAxKSB7XG5cdCAgICAgICAgdmFyRGVjbGFyYXRpb25zICs9ICcsIGFsaWFzJyArICsrYWxpYXNDb3VudCArICc9JyArIGFsaWFzO1xuXHQgICAgICAgIG5vZGUuY2hpbGRyZW5bMF0gPSAnYWxpYXMnICsgYWxpYXNDb3VudDtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICB2YXIgcGFyYW1zID0gWydjb250YWluZXInLCAnZGVwdGgwJywgJ2hlbHBlcnMnLCAncGFydGlhbHMnLCAnZGF0YSddO1xuXG5cdCAgICBpZiAodGhpcy51c2VCbG9ja1BhcmFtcyB8fCB0aGlzLnVzZURlcHRocykge1xuXHQgICAgICBwYXJhbXMucHVzaCgnYmxvY2tQYXJhbXMnKTtcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnVzZURlcHRocykge1xuXHQgICAgICBwYXJhbXMucHVzaCgnZGVwdGhzJyk7XG5cdCAgICB9XG5cblx0ICAgIC8vIFBlcmZvcm0gYSBzZWNvbmQgcGFzcyBvdmVyIHRoZSBvdXRwdXQgdG8gbWVyZ2UgY29udGVudCB3aGVuIHBvc3NpYmxlXG5cdCAgICB2YXIgc291cmNlID0gdGhpcy5tZXJnZVNvdXJjZSh2YXJEZWNsYXJhdGlvbnMpO1xuXG5cdCAgICBpZiAoYXNPYmplY3QpIHtcblx0ICAgICAgcGFyYW1zLnB1c2goc291cmNlKTtcblxuXHQgICAgICByZXR1cm4gRnVuY3Rpb24uYXBwbHkodGhpcywgcGFyYW1zKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnNvdXJjZS53cmFwKFsnZnVuY3Rpb24oJywgcGFyYW1zLmpvaW4oJywnKSwgJykge1xcbiAgJywgc291cmNlLCAnfSddKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIG1lcmdlU291cmNlOiBmdW5jdGlvbiBtZXJnZVNvdXJjZSh2YXJEZWNsYXJhdGlvbnMpIHtcblx0ICAgIHZhciBpc1NpbXBsZSA9IHRoaXMuZW52aXJvbm1lbnQuaXNTaW1wbGUsXG5cdCAgICAgICAgYXBwZW5kT25seSA9ICF0aGlzLmZvcmNlQnVmZmVyLFxuXHQgICAgICAgIGFwcGVuZEZpcnN0ID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIHNvdXJjZVNlZW4gPSB1bmRlZmluZWQsXG5cdCAgICAgICAgYnVmZmVyU3RhcnQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgYnVmZmVyRW5kID0gdW5kZWZpbmVkO1xuXHQgICAgdGhpcy5zb3VyY2UuZWFjaChmdW5jdGlvbiAobGluZSkge1xuXHQgICAgICBpZiAobGluZS5hcHBlbmRUb0J1ZmZlcikge1xuXHQgICAgICAgIGlmIChidWZmZXJTdGFydCkge1xuXHQgICAgICAgICAgbGluZS5wcmVwZW5kKCcgICsgJyk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIGJ1ZmZlclN0YXJ0ID0gbGluZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgYnVmZmVyRW5kID0gbGluZTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBpZiAoYnVmZmVyU3RhcnQpIHtcblx0ICAgICAgICAgIGlmICghc291cmNlU2Vlbikge1xuXHQgICAgICAgICAgICBhcHBlbmRGaXJzdCA9IHRydWU7XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBidWZmZXJTdGFydC5wcmVwZW5kKCdidWZmZXIgKz0gJyk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICBidWZmZXJFbmQuYWRkKCc7Jyk7XG5cdCAgICAgICAgICBidWZmZXJTdGFydCA9IGJ1ZmZlckVuZCA9IHVuZGVmaW5lZDtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzb3VyY2VTZWVuID0gdHJ1ZTtcblx0ICAgICAgICBpZiAoIWlzU2ltcGxlKSB7XG5cdCAgICAgICAgICBhcHBlbmRPbmx5ID0gZmFsc2U7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgaWYgKGFwcGVuZE9ubHkpIHtcblx0ICAgICAgaWYgKGJ1ZmZlclN0YXJ0KSB7XG5cdCAgICAgICAgYnVmZmVyU3RhcnQucHJlcGVuZCgncmV0dXJuICcpO1xuXHQgICAgICAgIGJ1ZmZlckVuZC5hZGQoJzsnKTtcblx0ICAgICAgfSBlbHNlIGlmICghc291cmNlU2Vlbikge1xuXHQgICAgICAgIHRoaXMuc291cmNlLnB1c2goJ3JldHVybiBcIlwiOycpO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB2YXJEZWNsYXJhdGlvbnMgKz0gJywgYnVmZmVyID0gJyArIChhcHBlbmRGaXJzdCA/ICcnIDogdGhpcy5pbml0aWFsaXplQnVmZmVyKCkpO1xuXG5cdCAgICAgIGlmIChidWZmZXJTdGFydCkge1xuXHQgICAgICAgIGJ1ZmZlclN0YXJ0LnByZXBlbmQoJ3JldHVybiBidWZmZXIgKyAnKTtcblx0ICAgICAgICBidWZmZXJFbmQuYWRkKCc7Jyk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdGhpcy5zb3VyY2UucHVzaCgncmV0dXJuIGJ1ZmZlcjsnKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBpZiAodmFyRGVjbGFyYXRpb25zKSB7XG5cdCAgICAgIHRoaXMuc291cmNlLnByZXBlbmQoJ3ZhciAnICsgdmFyRGVjbGFyYXRpb25zLnN1YnN0cmluZygyKSArIChhcHBlbmRGaXJzdCA/ICcnIDogJztcXG4nKSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB0aGlzLnNvdXJjZS5tZXJnZSgpO1xuXHQgIH0sXG5cblx0ICAvLyBbYmxvY2tWYWx1ZV1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHZhbHVlXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXR1cm4gdmFsdWUgb2YgYmxvY2tIZWxwZXJNaXNzaW5nXG5cdCAgLy9cblx0ICAvLyBUaGUgcHVycG9zZSBvZiB0aGlzIG9wY29kZSBpcyB0byB0YWtlIGEgYmxvY2sgb2YgdGhlIGZvcm1cblx0ICAvLyBge3sjdGhpcy5mb299fS4uLnt7L3RoaXMuZm9vfX1gLCByZXNvbHZlIHRoZSB2YWx1ZSBvZiBgZm9vYCwgYW5kXG5cdCAgLy8gcmVwbGFjZSBpdCBvbiB0aGUgc3RhY2sgd2l0aCB0aGUgcmVzdWx0IG9mIHByb3Blcmx5XG5cdCAgLy8gaW52b2tpbmcgYmxvY2tIZWxwZXJNaXNzaW5nLlxuXHQgIGJsb2NrVmFsdWU6IGZ1bmN0aW9uIGJsb2NrVmFsdWUobmFtZSkge1xuXHQgICAgdmFyIGJsb2NrSGVscGVyTWlzc2luZyA9IHRoaXMuYWxpYXNhYmxlKCdoZWxwZXJzLmJsb2NrSGVscGVyTWlzc2luZycpLFxuXHQgICAgICAgIHBhcmFtcyA9IFt0aGlzLmNvbnRleHROYW1lKDApXTtcblx0ICAgIHRoaXMuc2V0dXBIZWxwZXJBcmdzKG5hbWUsIDAsIHBhcmFtcyk7XG5cblx0ICAgIHZhciBibG9ja05hbWUgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICBwYXJhbXMuc3BsaWNlKDEsIDAsIGJsb2NrTmFtZSk7XG5cblx0ICAgIHRoaXMucHVzaCh0aGlzLnNvdXJjZS5mdW5jdGlvbkNhbGwoYmxvY2tIZWxwZXJNaXNzaW5nLCAnY2FsbCcsIHBhcmFtcykpO1xuXHQgIH0sXG5cblx0ICAvLyBbYW1iaWd1b3VzQmxvY2tWYWx1ZV1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHZhbHVlXG5cdCAgLy8gQ29tcGlsZXIgdmFsdWUsIGJlZm9yZTogbGFzdEhlbHBlcj12YWx1ZSBvZiBsYXN0IGZvdW5kIGhlbHBlciwgaWYgYW55XG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyLCBpZiBubyBsYXN0SGVscGVyOiBzYW1lIGFzIFtibG9ja1ZhbHVlXVxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlciwgaWYgbGFzdEhlbHBlcjogdmFsdWVcblx0ICBhbWJpZ3VvdXNCbG9ja1ZhbHVlOiBmdW5jdGlvbiBhbWJpZ3VvdXNCbG9ja1ZhbHVlKCkge1xuXHQgICAgLy8gV2UncmUgYmVpbmcgYSBiaXQgY2hlZWt5IGFuZCByZXVzaW5nIHRoZSBvcHRpb25zIHZhbHVlIGZyb20gdGhlIHByaW9yIGV4ZWNcblx0ICAgIHZhciBibG9ja0hlbHBlck1pc3NpbmcgPSB0aGlzLmFsaWFzYWJsZSgnaGVscGVycy5ibG9ja0hlbHBlck1pc3NpbmcnKSxcblx0ICAgICAgICBwYXJhbXMgPSBbdGhpcy5jb250ZXh0TmFtZSgwKV07XG5cdCAgICB0aGlzLnNldHVwSGVscGVyQXJncygnJywgMCwgcGFyYW1zLCB0cnVlKTtcblxuXHQgICAgdGhpcy5mbHVzaElubGluZSgpO1xuXG5cdCAgICB2YXIgY3VycmVudCA9IHRoaXMudG9wU3RhY2soKTtcblx0ICAgIHBhcmFtcy5zcGxpY2UoMSwgMCwgY3VycmVudCk7XG5cblx0ICAgIHRoaXMucHVzaFNvdXJjZShbJ2lmICghJywgdGhpcy5sYXN0SGVscGVyLCAnKSB7ICcsIGN1cnJlbnQsICcgPSAnLCB0aGlzLnNvdXJjZS5mdW5jdGlvbkNhbGwoYmxvY2tIZWxwZXJNaXNzaW5nLCAnY2FsbCcsIHBhcmFtcyksICd9J10pO1xuXHQgIH0sXG5cblx0ICAvLyBbYXBwZW5kQ29udGVudF1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uXG5cdCAgLy9cblx0ICAvLyBBcHBlbmRzIHRoZSBzdHJpbmcgdmFsdWUgb2YgYGNvbnRlbnRgIHRvIHRoZSBjdXJyZW50IGJ1ZmZlclxuXHQgIGFwcGVuZENvbnRlbnQ6IGZ1bmN0aW9uIGFwcGVuZENvbnRlbnQoY29udGVudCkge1xuXHQgICAgaWYgKHRoaXMucGVuZGluZ0NvbnRlbnQpIHtcblx0ICAgICAgY29udGVudCA9IHRoaXMucGVuZGluZ0NvbnRlbnQgKyBjb250ZW50O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5wZW5kaW5nTG9jYXRpb24gPSB0aGlzLnNvdXJjZS5jdXJyZW50TG9jYXRpb247XG5cdCAgICB9XG5cblx0ICAgIHRoaXMucGVuZGluZ0NvbnRlbnQgPSBjb250ZW50O1xuXHQgIH0sXG5cblx0ICAvLyBbYXBwZW5kXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogdmFsdWUsIC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uXG5cdCAgLy9cblx0ICAvLyBDb2VyY2VzIGB2YWx1ZWAgdG8gYSBTdHJpbmcgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIGN1cnJlbnQgYnVmZmVyLlxuXHQgIC8vXG5cdCAgLy8gSWYgYHZhbHVlYCBpcyB0cnV0aHksIG9yIDAsIGl0IGlzIGNvZXJjZWQgaW50byBhIHN0cmluZyBhbmQgYXBwZW5kZWRcblx0ICAvLyBPdGhlcndpc2UsIHRoZSBlbXB0eSBzdHJpbmcgaXMgYXBwZW5kZWRcblx0ICBhcHBlbmQ6IGZ1bmN0aW9uIGFwcGVuZCgpIHtcblx0ICAgIGlmICh0aGlzLmlzSW5saW5lKCkpIHtcblx0ICAgICAgdGhpcy5yZXBsYWNlU3RhY2soZnVuY3Rpb24gKGN1cnJlbnQpIHtcblx0ICAgICAgICByZXR1cm4gWycgIT0gbnVsbCA/ICcsIGN1cnJlbnQsICcgOiBcIlwiJ107XG5cdCAgICAgIH0pO1xuXG5cdCAgICAgIHRoaXMucHVzaFNvdXJjZSh0aGlzLmFwcGVuZFRvQnVmZmVyKHRoaXMucG9wU3RhY2soKSkpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdmFyIGxvY2FsID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgICB0aGlzLnB1c2hTb3VyY2UoWydpZiAoJywgbG9jYWwsICcgIT0gbnVsbCkgeyAnLCB0aGlzLmFwcGVuZFRvQnVmZmVyKGxvY2FsLCB1bmRlZmluZWQsIHRydWUpLCAnIH0nXSk7XG5cdCAgICAgIGlmICh0aGlzLmVudmlyb25tZW50LmlzU2ltcGxlKSB7XG5cdCAgICAgICAgdGhpcy5wdXNoU291cmNlKFsnZWxzZSB7ICcsIHRoaXMuYXBwZW5kVG9CdWZmZXIoXCInJ1wiLCB1bmRlZmluZWQsIHRydWUpLCAnIH0nXSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgLy8gW2FwcGVuZEVzY2FwZWRdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiB2YWx1ZSwgLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi5cblx0ICAvL1xuXHQgIC8vIEVzY2FwZSBgdmFsdWVgIGFuZCBhcHBlbmQgaXQgdG8gdGhlIGJ1ZmZlclxuXHQgIGFwcGVuZEVzY2FwZWQ6IGZ1bmN0aW9uIGFwcGVuZEVzY2FwZWQoKSB7XG5cdCAgICB0aGlzLnB1c2hTb3VyY2UodGhpcy5hcHBlbmRUb0J1ZmZlcihbdGhpcy5hbGlhc2FibGUoJ2NvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uJyksICcoJywgdGhpcy5wb3BTdGFjaygpLCAnKSddKSk7XG5cdCAgfSxcblxuXHQgIC8vIFtnZXRDb250ZXh0XVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi5cblx0ICAvLyBDb21waWxlciB2YWx1ZSwgYWZ0ZXI6IGxhc3RDb250ZXh0PWRlcHRoXG5cdCAgLy9cblx0ICAvLyBTZXQgdGhlIHZhbHVlIG9mIHRoZSBgbGFzdENvbnRleHRgIGNvbXBpbGVyIHZhbHVlIHRvIHRoZSBkZXB0aFxuXHQgIGdldENvbnRleHQ6IGZ1bmN0aW9uIGdldENvbnRleHQoZGVwdGgpIHtcblx0ICAgIHRoaXMubGFzdENvbnRleHQgPSBkZXB0aDtcblx0ICB9LFxuXG5cdCAgLy8gW3B1c2hDb250ZXh0XVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiBjdXJyZW50Q29udGV4dCwgLi4uXG5cdCAgLy9cblx0ICAvLyBQdXNoZXMgdGhlIHZhbHVlIG9mIHRoZSBjdXJyZW50IGNvbnRleHQgb250byB0aGUgc3RhY2suXG5cdCAgcHVzaENvbnRleHQ6IGZ1bmN0aW9uIHB1c2hDb250ZXh0KCkge1xuXHQgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKHRoaXMuY29udGV4dE5hbWUodGhpcy5sYXN0Q29udGV4dCkpO1xuXHQgIH0sXG5cblx0ICAvLyBbbG9va3VwT25Db250ZXh0XVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiBjdXJyZW50Q29udGV4dFtuYW1lXSwgLi4uXG5cdCAgLy9cblx0ICAvLyBMb29rcyB1cCB0aGUgdmFsdWUgb2YgYG5hbWVgIG9uIHRoZSBjdXJyZW50IGNvbnRleHQgYW5kIHB1c2hlc1xuXHQgIC8vIGl0IG9udG8gdGhlIHN0YWNrLlxuXHQgIGxvb2t1cE9uQ29udGV4dDogZnVuY3Rpb24gbG9va3VwT25Db250ZXh0KHBhcnRzLCBmYWxzeSwgc3RyaWN0LCBzY29wZWQpIHtcblx0ICAgIHZhciBpID0gMDtcblxuXHQgICAgaWYgKCFzY29wZWQgJiYgdGhpcy5vcHRpb25zLmNvbXBhdCAmJiAhdGhpcy5sYXN0Q29udGV4dCkge1xuXHQgICAgICAvLyBUaGUgZGVwdGhlZCBxdWVyeSBpcyBleHBlY3RlZCB0byBoYW5kbGUgdGhlIHVuZGVmaW5lZCBsb2dpYyBmb3IgdGhlIHJvb3QgbGV2ZWwgdGhhdFxuXHQgICAgICAvLyBpcyBpbXBsZW1lbnRlZCBiZWxvdywgc28gd2UgZXZhbHVhdGUgdGhhdCBkaXJlY3RseSBpbiBjb21wYXQgbW9kZVxuXHQgICAgICB0aGlzLnB1c2godGhpcy5kZXB0aGVkTG9va3VwKHBhcnRzW2krK10pKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMucHVzaENvbnRleHQoKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5yZXNvbHZlUGF0aCgnY29udGV4dCcsIHBhcnRzLCBpLCBmYWxzeSwgc3RyaWN0KTtcblx0ICB9LFxuXG5cdCAgLy8gW2xvb2t1cEJsb2NrUGFyYW1dXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IGJsb2NrUGFyYW1bbmFtZV0sIC4uLlxuXHQgIC8vXG5cdCAgLy8gTG9va3MgdXAgdGhlIHZhbHVlIG9mIGBwYXJ0c2Agb24gdGhlIGdpdmVuIGJsb2NrIHBhcmFtIGFuZCBwdXNoZXNcblx0ICAvLyBpdCBvbnRvIHRoZSBzdGFjay5cblx0ICBsb29rdXBCbG9ja1BhcmFtOiBmdW5jdGlvbiBsb29rdXBCbG9ja1BhcmFtKGJsb2NrUGFyYW1JZCwgcGFydHMpIHtcblx0ICAgIHRoaXMudXNlQmxvY2tQYXJhbXMgPSB0cnVlO1xuXG5cdCAgICB0aGlzLnB1c2goWydibG9ja1BhcmFtc1snLCBibG9ja1BhcmFtSWRbMF0sICddWycsIGJsb2NrUGFyYW1JZFsxXSwgJ10nXSk7XG5cdCAgICB0aGlzLnJlc29sdmVQYXRoKCdjb250ZXh0JywgcGFydHMsIDEpO1xuXHQgIH0sXG5cblx0ICAvLyBbbG9va3VwRGF0YV1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogZGF0YSwgLi4uXG5cdCAgLy9cblx0ICAvLyBQdXNoIHRoZSBkYXRhIGxvb2t1cCBvcGVyYXRvclxuXHQgIGxvb2t1cERhdGE6IGZ1bmN0aW9uIGxvb2t1cERhdGEoZGVwdGgsIHBhcnRzLCBzdHJpY3QpIHtcblx0ICAgIGlmICghZGVwdGgpIHtcblx0ICAgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKCdkYXRhJyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoJ2NvbnRhaW5lci5kYXRhKGRhdGEsICcgKyBkZXB0aCArICcpJyk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMucmVzb2x2ZVBhdGgoJ2RhdGEnLCBwYXJ0cywgMCwgdHJ1ZSwgc3RyaWN0KTtcblx0ICB9LFxuXG5cdCAgcmVzb2x2ZVBhdGg6IGZ1bmN0aW9uIHJlc29sdmVQYXRoKHR5cGUsIHBhcnRzLCBpLCBmYWxzeSwgc3RyaWN0KSB7XG5cdCAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuXG5cdCAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdCAgICBpZiAodGhpcy5vcHRpb25zLnN0cmljdCB8fCB0aGlzLm9wdGlvbnMuYXNzdW1lT2JqZWN0cykge1xuXHQgICAgICB0aGlzLnB1c2goc3RyaWN0TG9va3VwKHRoaXMub3B0aW9ucy5zdHJpY3QgJiYgc3RyaWN0LCB0aGlzLCBwYXJ0cywgdHlwZSkpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHZhciBsZW4gPSBwYXJ0cy5sZW5ndGg7XG5cdCAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWxvb3AtZnVuYyAqL1xuXHQgICAgICB0aGlzLnJlcGxhY2VTdGFjayhmdW5jdGlvbiAoY3VycmVudCkge1xuXHQgICAgICAgIHZhciBsb29rdXAgPSBfdGhpcy5uYW1lTG9va3VwKGN1cnJlbnQsIHBhcnRzW2ldLCB0eXBlKTtcblx0ICAgICAgICAvLyBXZSB3YW50IHRvIGVuc3VyZSB0aGF0IHplcm8gYW5kIGZhbHNlIGFyZSBoYW5kbGVkIHByb3Blcmx5IGlmIHRoZSBjb250ZXh0IChmYWxzeSBmbGFnKVxuXHQgICAgICAgIC8vIG5lZWRzIHRvIGhhdmUgdGhlIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHRoZXNlIHZhbHVlcy5cblx0ICAgICAgICBpZiAoIWZhbHN5KSB7XG5cdCAgICAgICAgICByZXR1cm4gWycgIT0gbnVsbCA/ICcsIGxvb2t1cCwgJyA6ICcsIGN1cnJlbnRdO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAvLyBPdGhlcndpc2Ugd2UgY2FuIHVzZSBnZW5lcmljIGZhbHN5IGhhbmRsaW5nXG5cdCAgICAgICAgICByZXR1cm4gWycgJiYgJywgbG9va3VwXTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWxvb3AtZnVuYyAqL1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICAvLyBbcmVzb2x2ZVBvc3NpYmxlTGFtYmRhXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogdmFsdWUsIC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogcmVzb2x2ZWQgdmFsdWUsIC4uLlxuXHQgIC8vXG5cdCAgLy8gSWYgdGhlIGB2YWx1ZWAgaXMgYSBsYW1iZGEsIHJlcGxhY2UgaXQgb24gdGhlIHN0YWNrIGJ5XG5cdCAgLy8gdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbGFtYmRhXG5cdCAgcmVzb2x2ZVBvc3NpYmxlTGFtYmRhOiBmdW5jdGlvbiByZXNvbHZlUG9zc2libGVMYW1iZGEoKSB7XG5cdCAgICB0aGlzLnB1c2goW3RoaXMuYWxpYXNhYmxlKCdjb250YWluZXIubGFtYmRhJyksICcoJywgdGhpcy5wb3BTdGFjaygpLCAnLCAnLCB0aGlzLmNvbnRleHROYW1lKDApLCAnKSddKTtcblx0ICB9LFxuXG5cdCAgLy8gW3B1c2hTdHJpbmdQYXJhbV1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogc3RyaW5nLCBjdXJyZW50Q29udGV4dCwgLi4uXG5cdCAgLy9cblx0ICAvLyBUaGlzIG9wY29kZSBpcyBkZXNpZ25lZCBmb3IgdXNlIGluIHN0cmluZyBtb2RlLCB3aGljaFxuXHQgIC8vIHByb3ZpZGVzIHRoZSBzdHJpbmcgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgYWxvbmcgd2l0aCBpdHNcblx0ICAvLyBkZXB0aCByYXRoZXIgdGhhbiByZXNvbHZpbmcgaXQgaW1tZWRpYXRlbHkuXG5cdCAgcHVzaFN0cmluZ1BhcmFtOiBmdW5jdGlvbiBwdXNoU3RyaW5nUGFyYW0oc3RyaW5nLCB0eXBlKSB7XG5cdCAgICB0aGlzLnB1c2hDb250ZXh0KCk7XG5cdCAgICB0aGlzLnB1c2hTdHJpbmcodHlwZSk7XG5cblx0ICAgIC8vIElmIGl0J3MgYSBzdWJleHByZXNzaW9uLCB0aGUgc3RyaW5nIHJlc3VsdFxuXHQgICAgLy8gd2lsbCBiZSBwdXNoZWQgYWZ0ZXIgdGhpcyBvcGNvZGUuXG5cdCAgICBpZiAodHlwZSAhPT0gJ1N1YkV4cHJlc3Npb24nKSB7XG5cdCAgICAgIGlmICh0eXBlb2Ygc3RyaW5nID09PSAnc3RyaW5nJykge1xuXHQgICAgICAgIHRoaXMucHVzaFN0cmluZyhzdHJpbmcpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbChzdHJpbmcpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIGVtcHR5SGFzaDogZnVuY3Rpb24gZW1wdHlIYXNoKG9taXRFbXB0eSkge1xuXHQgICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcblx0ICAgICAgdGhpcy5wdXNoKCd7fScpOyAvLyBoYXNoSWRzXG5cdCAgICB9XG5cdCAgICBpZiAodGhpcy5zdHJpbmdQYXJhbXMpIHtcblx0ICAgICAgdGhpcy5wdXNoKCd7fScpOyAvLyBoYXNoQ29udGV4dHNcblx0ICAgICAgdGhpcy5wdXNoKCd7fScpOyAvLyBoYXNoVHlwZXNcblx0ICAgIH1cblx0ICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbChvbWl0RW1wdHkgPyAndW5kZWZpbmVkJyA6ICd7fScpO1xuXHQgIH0sXG5cdCAgcHVzaEhhc2g6IGZ1bmN0aW9uIHB1c2hIYXNoKCkge1xuXHQgICAgaWYgKHRoaXMuaGFzaCkge1xuXHQgICAgICB0aGlzLmhhc2hlcy5wdXNoKHRoaXMuaGFzaCk7XG5cdCAgICB9XG5cdCAgICB0aGlzLmhhc2ggPSB7IHZhbHVlczogW10sIHR5cGVzOiBbXSwgY29udGV4dHM6IFtdLCBpZHM6IFtdIH07XG5cdCAgfSxcblx0ICBwb3BIYXNoOiBmdW5jdGlvbiBwb3BIYXNoKCkge1xuXHQgICAgdmFyIGhhc2ggPSB0aGlzLmhhc2g7XG5cdCAgICB0aGlzLmhhc2ggPSB0aGlzLmhhc2hlcy5wb3AoKTtcblxuXHQgICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcblx0ICAgICAgdGhpcy5wdXNoKHRoaXMub2JqZWN0TGl0ZXJhbChoYXNoLmlkcykpO1xuXHQgICAgfVxuXHQgICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG5cdCAgICAgIHRoaXMucHVzaCh0aGlzLm9iamVjdExpdGVyYWwoaGFzaC5jb250ZXh0cykpO1xuXHQgICAgICB0aGlzLnB1c2godGhpcy5vYmplY3RMaXRlcmFsKGhhc2gudHlwZXMpKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5wdXNoKHRoaXMub2JqZWN0TGl0ZXJhbChoYXNoLnZhbHVlcykpO1xuXHQgIH0sXG5cblx0ICAvLyBbcHVzaFN0cmluZ11cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogcXVvdGVkU3RyaW5nKHN0cmluZyksIC4uLlxuXHQgIC8vXG5cdCAgLy8gUHVzaCBhIHF1b3RlZCB2ZXJzaW9uIG9mIGBzdHJpbmdgIG9udG8gdGhlIHN0YWNrXG5cdCAgcHVzaFN0cmluZzogZnVuY3Rpb24gcHVzaFN0cmluZyhzdHJpbmcpIHtcblx0ICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCh0aGlzLnF1b3RlZFN0cmluZyhzdHJpbmcpKTtcblx0ICB9LFxuXG5cdCAgLy8gW3B1c2hMaXRlcmFsXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiB2YWx1ZSwgLi4uXG5cdCAgLy9cblx0ICAvLyBQdXNoZXMgYSB2YWx1ZSBvbnRvIHRoZSBzdGFjay4gVGhpcyBvcGVyYXRpb24gcHJldmVudHNcblx0ICAvLyB0aGUgY29tcGlsZXIgZnJvbSBjcmVhdGluZyBhIHRlbXBvcmFyeSB2YXJpYWJsZSB0byBob2xkXG5cdCAgLy8gaXQuXG5cdCAgcHVzaExpdGVyYWw6IGZ1bmN0aW9uIHB1c2hMaXRlcmFsKHZhbHVlKSB7XG5cdCAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwodmFsdWUpO1xuXHQgIH0sXG5cblx0ICAvLyBbcHVzaFByb2dyYW1dXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHByb2dyYW0oZ3VpZCksIC4uLlxuXHQgIC8vXG5cdCAgLy8gUHVzaCBhIHByb2dyYW0gZXhwcmVzc2lvbiBvbnRvIHRoZSBzdGFjay4gVGhpcyB0YWtlc1xuXHQgIC8vIGEgY29tcGlsZS10aW1lIGd1aWQgYW5kIGNvbnZlcnRzIGl0IGludG8gYSBydW50aW1lLWFjY2Vzc2libGVcblx0ICAvLyBleHByZXNzaW9uLlxuXHQgIHB1c2hQcm9ncmFtOiBmdW5jdGlvbiBwdXNoUHJvZ3JhbShndWlkKSB7XG5cdCAgICBpZiAoZ3VpZCAhPSBudWxsKSB7XG5cdCAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCh0aGlzLnByb2dyYW1FeHByZXNzaW9uKGd1aWQpKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbChudWxsKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgLy8gW3JlZ2lzdGVyRGVjb3JhdG9yXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogaGFzaCwgcHJvZ3JhbSwgcGFyYW1zLi4uLCAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IC4uLlxuXHQgIC8vXG5cdCAgLy8gUG9wcyBvZmYgdGhlIGRlY29yYXRvcidzIHBhcmFtZXRlcnMsIGludm9rZXMgdGhlIGRlY29yYXRvcixcblx0ICAvLyBhbmQgaW5zZXJ0cyB0aGUgZGVjb3JhdG9yIGludG8gdGhlIGRlY29yYXRvcnMgbGlzdC5cblx0ICByZWdpc3RlckRlY29yYXRvcjogZnVuY3Rpb24gcmVnaXN0ZXJEZWNvcmF0b3IocGFyYW1TaXplLCBuYW1lKSB7XG5cdCAgICB2YXIgZm91bmREZWNvcmF0b3IgPSB0aGlzLm5hbWVMb29rdXAoJ2RlY29yYXRvcnMnLCBuYW1lLCAnZGVjb3JhdG9yJyksXG5cdCAgICAgICAgb3B0aW9ucyA9IHRoaXMuc2V0dXBIZWxwZXJBcmdzKG5hbWUsIHBhcmFtU2l6ZSk7XG5cblx0ICAgIHRoaXMuZGVjb3JhdG9ycy5wdXNoKFsnZm4gPSAnLCB0aGlzLmRlY29yYXRvcnMuZnVuY3Rpb25DYWxsKGZvdW5kRGVjb3JhdG9yLCAnJywgWydmbicsICdwcm9wcycsICdjb250YWluZXInLCBvcHRpb25zXSksICcgfHwgZm47J10pO1xuXHQgIH0sXG5cblx0ICAvLyBbaW52b2tlSGVscGVyXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogaGFzaCwgaW52ZXJzZSwgcHJvZ3JhbSwgcGFyYW1zLi4uLCAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHJlc3VsdCBvZiBoZWxwZXIgaW52b2NhdGlvblxuXHQgIC8vXG5cdCAgLy8gUG9wcyBvZmYgdGhlIGhlbHBlcidzIHBhcmFtZXRlcnMsIGludm9rZXMgdGhlIGhlbHBlcixcblx0ICAvLyBhbmQgcHVzaGVzIHRoZSBoZWxwZXIncyByZXR1cm4gdmFsdWUgb250byB0aGUgc3RhY2suXG5cdCAgLy9cblx0ICAvLyBJZiB0aGUgaGVscGVyIGlzIG5vdCBmb3VuZCwgYGhlbHBlck1pc3NpbmdgIGlzIGNhbGxlZC5cblx0ICBpbnZva2VIZWxwZXI6IGZ1bmN0aW9uIGludm9rZUhlbHBlcihwYXJhbVNpemUsIG5hbWUsIGlzU2ltcGxlKSB7XG5cdCAgICB2YXIgbm9uSGVscGVyID0gdGhpcy5wb3BTdGFjaygpLFxuXHQgICAgICAgIGhlbHBlciA9IHRoaXMuc2V0dXBIZWxwZXIocGFyYW1TaXplLCBuYW1lKSxcblx0ICAgICAgICBzaW1wbGUgPSBpc1NpbXBsZSA/IFtoZWxwZXIubmFtZSwgJyB8fCAnXSA6ICcnO1xuXG5cdCAgICB2YXIgbG9va3VwID0gWycoJ10uY29uY2F0KHNpbXBsZSwgbm9uSGVscGVyKTtcblx0ICAgIGlmICghdGhpcy5vcHRpb25zLnN0cmljdCkge1xuXHQgICAgICBsb29rdXAucHVzaCgnIHx8ICcsIHRoaXMuYWxpYXNhYmxlKCdoZWxwZXJzLmhlbHBlck1pc3NpbmcnKSk7XG5cdCAgICB9XG5cdCAgICBsb29rdXAucHVzaCgnKScpO1xuXG5cdCAgICB0aGlzLnB1c2godGhpcy5zb3VyY2UuZnVuY3Rpb25DYWxsKGxvb2t1cCwgJ2NhbGwnLCBoZWxwZXIuY2FsbFBhcmFtcykpO1xuXHQgIH0sXG5cblx0ICAvLyBbaW52b2tlS25vd25IZWxwZXJdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiBoYXNoLCBpbnZlcnNlLCBwcm9ncmFtLCBwYXJhbXMuLi4sIC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogcmVzdWx0IG9mIGhlbHBlciBpbnZvY2F0aW9uXG5cdCAgLy9cblx0ICAvLyBUaGlzIG9wZXJhdGlvbiBpcyB1c2VkIHdoZW4gdGhlIGhlbHBlciBpcyBrbm93biB0byBleGlzdCxcblx0ICAvLyBzbyBhIGBoZWxwZXJNaXNzaW5nYCBmYWxsYmFjayBpcyBub3QgcmVxdWlyZWQuXG5cdCAgaW52b2tlS25vd25IZWxwZXI6IGZ1bmN0aW9uIGludm9rZUtub3duSGVscGVyKHBhcmFtU2l6ZSwgbmFtZSkge1xuXHQgICAgdmFyIGhlbHBlciA9IHRoaXMuc2V0dXBIZWxwZXIocGFyYW1TaXplLCBuYW1lKTtcblx0ICAgIHRoaXMucHVzaCh0aGlzLnNvdXJjZS5mdW5jdGlvbkNhbGwoaGVscGVyLm5hbWUsICdjYWxsJywgaGVscGVyLmNhbGxQYXJhbXMpKTtcblx0ICB9LFxuXG5cdCAgLy8gW2ludm9rZUFtYmlndW91c11cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHBhcmFtcy4uLiwgLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXN1bHQgb2YgZGlzYW1iaWd1YXRpb25cblx0ICAvL1xuXHQgIC8vIFRoaXMgb3BlcmF0aW9uIGlzIHVzZWQgd2hlbiBhbiBleHByZXNzaW9uIGxpa2UgYHt7Zm9vfX1gXG5cdCAgLy8gaXMgcHJvdmlkZWQsIGJ1dCB3ZSBkb24ndCBrbm93IGF0IGNvbXBpbGUtdGltZSB3aGV0aGVyIGl0XG5cdCAgLy8gaXMgYSBoZWxwZXIgb3IgYSBwYXRoLlxuXHQgIC8vXG5cdCAgLy8gVGhpcyBvcGVyYXRpb24gZW1pdHMgbW9yZSBjb2RlIHRoYW4gdGhlIG90aGVyIG9wdGlvbnMsXG5cdCAgLy8gYW5kIGNhbiBiZSBhdm9pZGVkIGJ5IHBhc3NpbmcgdGhlIGBrbm93bkhlbHBlcnNgIGFuZFxuXHQgIC8vIGBrbm93bkhlbHBlcnNPbmx5YCBmbGFncyBhdCBjb21waWxlLXRpbWUuXG5cdCAgaW52b2tlQW1iaWd1b3VzOiBmdW5jdGlvbiBpbnZva2VBbWJpZ3VvdXMobmFtZSwgaGVscGVyQ2FsbCkge1xuXHQgICAgdGhpcy51c2VSZWdpc3RlcignaGVscGVyJyk7XG5cblx0ICAgIHZhciBub25IZWxwZXIgPSB0aGlzLnBvcFN0YWNrKCk7XG5cblx0ICAgIHRoaXMuZW1wdHlIYXNoKCk7XG5cdCAgICB2YXIgaGVscGVyID0gdGhpcy5zZXR1cEhlbHBlcigwLCBuYW1lLCBoZWxwZXJDYWxsKTtcblxuXHQgICAgdmFyIGhlbHBlck5hbWUgPSB0aGlzLmxhc3RIZWxwZXIgPSB0aGlzLm5hbWVMb29rdXAoJ2hlbHBlcnMnLCBuYW1lLCAnaGVscGVyJyk7XG5cblx0ICAgIHZhciBsb29rdXAgPSBbJygnLCAnKGhlbHBlciA9ICcsIGhlbHBlck5hbWUsICcgfHwgJywgbm9uSGVscGVyLCAnKSddO1xuXHQgICAgaWYgKCF0aGlzLm9wdGlvbnMuc3RyaWN0KSB7XG5cdCAgICAgIGxvb2t1cFswXSA9ICcoaGVscGVyID0gJztcblx0ICAgICAgbG9va3VwLnB1c2goJyAhPSBudWxsID8gaGVscGVyIDogJywgdGhpcy5hbGlhc2FibGUoJ2hlbHBlcnMuaGVscGVyTWlzc2luZycpKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5wdXNoKFsnKCcsIGxvb2t1cCwgaGVscGVyLnBhcmFtc0luaXQgPyBbJyksKCcsIGhlbHBlci5wYXJhbXNJbml0XSA6IFtdLCAnKSwnLCAnKHR5cGVvZiBoZWxwZXIgPT09ICcsIHRoaXMuYWxpYXNhYmxlKCdcImZ1bmN0aW9uXCInKSwgJyA/ICcsIHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbCgnaGVscGVyJywgJ2NhbGwnLCBoZWxwZXIuY2FsbFBhcmFtcyksICcgOiBoZWxwZXIpKSddKTtcblx0ICB9LFxuXG5cdCAgLy8gW2ludm9rZVBhcnRpYWxdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiBjb250ZXh0LCAuLi5cblx0ICAvLyBPbiBzdGFjayBhZnRlcjogcmVzdWx0IG9mIHBhcnRpYWwgaW52b2NhdGlvblxuXHQgIC8vXG5cdCAgLy8gVGhpcyBvcGVyYXRpb24gcG9wcyBvZmYgYSBjb250ZXh0LCBpbnZva2VzIGEgcGFydGlhbCB3aXRoIHRoYXQgY29udGV4dCxcblx0ICAvLyBhbmQgcHVzaGVzIHRoZSByZXN1bHQgb2YgdGhlIGludm9jYXRpb24gYmFjay5cblx0ICBpbnZva2VQYXJ0aWFsOiBmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKGlzRHluYW1pYywgbmFtZSwgaW5kZW50KSB7XG5cdCAgICB2YXIgcGFyYW1zID0gW10sXG5cdCAgICAgICAgb3B0aW9ucyA9IHRoaXMuc2V0dXBQYXJhbXMobmFtZSwgMSwgcGFyYW1zKTtcblxuXHQgICAgaWYgKGlzRHluYW1pYykge1xuXHQgICAgICBuYW1lID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgICBkZWxldGUgb3B0aW9ucy5uYW1lO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoaW5kZW50KSB7XG5cdCAgICAgIG9wdGlvbnMuaW5kZW50ID0gSlNPTi5zdHJpbmdpZnkoaW5kZW50KTtcblx0ICAgIH1cblx0ICAgIG9wdGlvbnMuaGVscGVycyA9ICdoZWxwZXJzJztcblx0ICAgIG9wdGlvbnMucGFydGlhbHMgPSAncGFydGlhbHMnO1xuXHQgICAgb3B0aW9ucy5kZWNvcmF0b3JzID0gJ2NvbnRhaW5lci5kZWNvcmF0b3JzJztcblxuXHQgICAgaWYgKCFpc0R5bmFtaWMpIHtcblx0ICAgICAgcGFyYW1zLnVuc2hpZnQodGhpcy5uYW1lTG9va3VwKCdwYXJ0aWFscycsIG5hbWUsICdwYXJ0aWFsJykpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcGFyYW1zLnVuc2hpZnQobmFtZSk7XG5cdCAgICB9XG5cblx0ICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGF0KSB7XG5cdCAgICAgIG9wdGlvbnMuZGVwdGhzID0gJ2RlcHRocyc7XG5cdCAgICB9XG5cdCAgICBvcHRpb25zID0gdGhpcy5vYmplY3RMaXRlcmFsKG9wdGlvbnMpO1xuXHQgICAgcGFyYW1zLnB1c2gob3B0aW9ucyk7XG5cblx0ICAgIHRoaXMucHVzaCh0aGlzLnNvdXJjZS5mdW5jdGlvbkNhbGwoJ2NvbnRhaW5lci5pbnZva2VQYXJ0aWFsJywgJycsIHBhcmFtcykpO1xuXHQgIH0sXG5cblx0ICAvLyBbYXNzaWduVG9IYXNoXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogdmFsdWUsIC4uLiwgaGFzaCwgLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi4sIGhhc2gsIC4uLlxuXHQgIC8vXG5cdCAgLy8gUG9wcyBhIHZhbHVlIG9mZiB0aGUgc3RhY2sgYW5kIGFzc2lnbnMgaXQgdG8gdGhlIGN1cnJlbnQgaGFzaFxuXHQgIGFzc2lnblRvSGFzaDogZnVuY3Rpb24gYXNzaWduVG9IYXNoKGtleSkge1xuXHQgICAgdmFyIHZhbHVlID0gdGhpcy5wb3BTdGFjaygpLFxuXHQgICAgICAgIGNvbnRleHQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgdHlwZSA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBpZCA9IHVuZGVmaW5lZDtcblxuXHQgICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcblx0ICAgICAgaWQgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICB9XG5cdCAgICBpZiAodGhpcy5zdHJpbmdQYXJhbXMpIHtcblx0ICAgICAgdHlwZSA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgICAgY29udGV4dCA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGhhc2ggPSB0aGlzLmhhc2g7XG5cdCAgICBpZiAoY29udGV4dCkge1xuXHQgICAgICBoYXNoLmNvbnRleHRzW2tleV0gPSBjb250ZXh0O1xuXHQgICAgfVxuXHQgICAgaWYgKHR5cGUpIHtcblx0ICAgICAgaGFzaC50eXBlc1trZXldID0gdHlwZTtcblx0ICAgIH1cblx0ICAgIGlmIChpZCkge1xuXHQgICAgICBoYXNoLmlkc1trZXldID0gaWQ7XG5cdCAgICB9XG5cdCAgICBoYXNoLnZhbHVlc1trZXldID0gdmFsdWU7XG5cdCAgfSxcblxuXHQgIHB1c2hJZDogZnVuY3Rpb24gcHVzaElkKHR5cGUsIG5hbWUsIGNoaWxkKSB7XG5cdCAgICBpZiAodHlwZSA9PT0gJ0Jsb2NrUGFyYW0nKSB7XG5cdCAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCgnYmxvY2tQYXJhbXNbJyArIG5hbWVbMF0gKyAnXS5wYXRoWycgKyBuYW1lWzFdICsgJ10nICsgKGNoaWxkID8gJyArICcgKyBKU09OLnN0cmluZ2lmeSgnLicgKyBjaGlsZCkgOiAnJykpO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlID09PSAnUGF0aEV4cHJlc3Npb24nKSB7XG5cdCAgICAgIHRoaXMucHVzaFN0cmluZyhuYW1lKTtcblx0ICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ1N1YkV4cHJlc3Npb24nKSB7XG5cdCAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCgndHJ1ZScpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKCdudWxsJyk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIC8vIEhFTFBFUlNcblxuXHQgIGNvbXBpbGVyOiBKYXZhU2NyaXB0Q29tcGlsZXIsXG5cblx0ICBjb21waWxlQ2hpbGRyZW46IGZ1bmN0aW9uIGNvbXBpbGVDaGlsZHJlbihlbnZpcm9ubWVudCwgb3B0aW9ucykge1xuXHQgICAgdmFyIGNoaWxkcmVuID0gZW52aXJvbm1lbnQuY2hpbGRyZW4sXG5cdCAgICAgICAgY2hpbGQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgY29tcGlsZXIgPSB1bmRlZmluZWQ7XG5cblx0ICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG5cdCAgICAgIGNvbXBpbGVyID0gbmV3IHRoaXMuY29tcGlsZXIoKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuZXctY2FwXG5cblx0ICAgICAgdmFyIGV4aXN0aW5nID0gdGhpcy5tYXRjaEV4aXN0aW5nUHJvZ3JhbShjaGlsZCk7XG5cblx0ICAgICAgaWYgKGV4aXN0aW5nID09IG51bGwpIHtcblx0ICAgICAgICB0aGlzLmNvbnRleHQucHJvZ3JhbXMucHVzaCgnJyk7IC8vIFBsYWNlaG9sZGVyIHRvIHByZXZlbnQgbmFtZSBjb25mbGljdHMgZm9yIG5lc3RlZCBjaGlsZHJlblxuXHQgICAgICAgIHZhciBpbmRleCA9IHRoaXMuY29udGV4dC5wcm9ncmFtcy5sZW5ndGg7XG5cdCAgICAgICAgY2hpbGQuaW5kZXggPSBpbmRleDtcblx0ICAgICAgICBjaGlsZC5uYW1lID0gJ3Byb2dyYW0nICsgaW5kZXg7XG5cdCAgICAgICAgdGhpcy5jb250ZXh0LnByb2dyYW1zW2luZGV4XSA9IGNvbXBpbGVyLmNvbXBpbGUoY2hpbGQsIG9wdGlvbnMsIHRoaXMuY29udGV4dCwgIXRoaXMucHJlY29tcGlsZSk7XG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmRlY29yYXRvcnNbaW5kZXhdID0gY29tcGlsZXIuZGVjb3JhdG9ycztcblx0ICAgICAgICB0aGlzLmNvbnRleHQuZW52aXJvbm1lbnRzW2luZGV4XSA9IGNoaWxkO1xuXG5cdCAgICAgICAgdGhpcy51c2VEZXB0aHMgPSB0aGlzLnVzZURlcHRocyB8fCBjb21waWxlci51c2VEZXB0aHM7XG5cdCAgICAgICAgdGhpcy51c2VCbG9ja1BhcmFtcyA9IHRoaXMudXNlQmxvY2tQYXJhbXMgfHwgY29tcGlsZXIudXNlQmxvY2tQYXJhbXM7XG5cdCAgICAgICAgY2hpbGQudXNlRGVwdGhzID0gdGhpcy51c2VEZXB0aHM7XG5cdCAgICAgICAgY2hpbGQudXNlQmxvY2tQYXJhbXMgPSB0aGlzLnVzZUJsb2NrUGFyYW1zO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGNoaWxkLmluZGV4ID0gZXhpc3RpbmcuaW5kZXg7XG5cdCAgICAgICAgY2hpbGQubmFtZSA9ICdwcm9ncmFtJyArIGV4aXN0aW5nLmluZGV4O1xuXG5cdCAgICAgICAgdGhpcy51c2VEZXB0aHMgPSB0aGlzLnVzZURlcHRocyB8fCBleGlzdGluZy51c2VEZXB0aHM7XG5cdCAgICAgICAgdGhpcy51c2VCbG9ja1BhcmFtcyA9IHRoaXMudXNlQmxvY2tQYXJhbXMgfHwgZXhpc3RpbmcudXNlQmxvY2tQYXJhbXM7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LFxuXHQgIG1hdGNoRXhpc3RpbmdQcm9ncmFtOiBmdW5jdGlvbiBtYXRjaEV4aXN0aW5nUHJvZ3JhbShjaGlsZCkge1xuXHQgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuY29udGV4dC5lbnZpcm9ubWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgdmFyIGVudmlyb25tZW50ID0gdGhpcy5jb250ZXh0LmVudmlyb25tZW50c1tpXTtcblx0ICAgICAgaWYgKGVudmlyb25tZW50ICYmIGVudmlyb25tZW50LmVxdWFscyhjaGlsZCkpIHtcblx0ICAgICAgICByZXR1cm4gZW52aXJvbm1lbnQ7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgcHJvZ3JhbUV4cHJlc3Npb246IGZ1bmN0aW9uIHByb2dyYW1FeHByZXNzaW9uKGd1aWQpIHtcblx0ICAgIHZhciBjaGlsZCA9IHRoaXMuZW52aXJvbm1lbnQuY2hpbGRyZW5bZ3VpZF0sXG5cdCAgICAgICAgcHJvZ3JhbVBhcmFtcyA9IFtjaGlsZC5pbmRleCwgJ2RhdGEnLCBjaGlsZC5ibG9ja1BhcmFtc107XG5cblx0ICAgIGlmICh0aGlzLnVzZUJsb2NrUGFyYW1zIHx8IHRoaXMudXNlRGVwdGhzKSB7XG5cdCAgICAgIHByb2dyYW1QYXJhbXMucHVzaCgnYmxvY2tQYXJhbXMnKTtcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnVzZURlcHRocykge1xuXHQgICAgICBwcm9ncmFtUGFyYW1zLnB1c2goJ2RlcHRocycpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gJ2NvbnRhaW5lci5wcm9ncmFtKCcgKyBwcm9ncmFtUGFyYW1zLmpvaW4oJywgJykgKyAnKSc7XG5cdCAgfSxcblxuXHQgIHVzZVJlZ2lzdGVyOiBmdW5jdGlvbiB1c2VSZWdpc3RlcihuYW1lKSB7XG5cdCAgICBpZiAoIXRoaXMucmVnaXN0ZXJzW25hbWVdKSB7XG5cdCAgICAgIHRoaXMucmVnaXN0ZXJzW25hbWVdID0gdHJ1ZTtcblx0ICAgICAgdGhpcy5yZWdpc3RlcnMubGlzdC5wdXNoKG5hbWUpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBwdXNoOiBmdW5jdGlvbiBwdXNoKGV4cHIpIHtcblx0ICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBMaXRlcmFsKSkge1xuXHQgICAgICBleHByID0gdGhpcy5zb3VyY2Uud3JhcChleHByKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5pbmxpbmVTdGFjay5wdXNoKGV4cHIpO1xuXHQgICAgcmV0dXJuIGV4cHI7XG5cdCAgfSxcblxuXHQgIHB1c2hTdGFja0xpdGVyYWw6IGZ1bmN0aW9uIHB1c2hTdGFja0xpdGVyYWwoaXRlbSkge1xuXHQgICAgdGhpcy5wdXNoKG5ldyBMaXRlcmFsKGl0ZW0pKTtcblx0ICB9LFxuXG5cdCAgcHVzaFNvdXJjZTogZnVuY3Rpb24gcHVzaFNvdXJjZShzb3VyY2UpIHtcblx0ICAgIGlmICh0aGlzLnBlbmRpbmdDb250ZW50KSB7XG5cdCAgICAgIHRoaXMuc291cmNlLnB1c2godGhpcy5hcHBlbmRUb0J1ZmZlcih0aGlzLnNvdXJjZS5xdW90ZWRTdHJpbmcodGhpcy5wZW5kaW5nQ29udGVudCksIHRoaXMucGVuZGluZ0xvY2F0aW9uKSk7XG5cdCAgICAgIHRoaXMucGVuZGluZ0NvbnRlbnQgPSB1bmRlZmluZWQ7XG5cdCAgICB9XG5cblx0ICAgIGlmIChzb3VyY2UpIHtcblx0ICAgICAgdGhpcy5zb3VyY2UucHVzaChzb3VyY2UpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICByZXBsYWNlU3RhY2s6IGZ1bmN0aW9uIHJlcGxhY2VTdGFjayhjYWxsYmFjaykge1xuXHQgICAgdmFyIHByZWZpeCA9IFsnKCddLFxuXHQgICAgICAgIHN0YWNrID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGNyZWF0ZWRTdGFjayA9IHVuZGVmaW5lZCxcblx0ICAgICAgICB1c2VkTGl0ZXJhbCA9IHVuZGVmaW5lZDtcblxuXHQgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICAgIGlmICghdGhpcy5pc0lubGluZSgpKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdyZXBsYWNlU3RhY2sgb24gbm9uLWlubGluZScpO1xuXHQgICAgfVxuXG5cdCAgICAvLyBXZSB3YW50IHRvIG1lcmdlIHRoZSBpbmxpbmUgc3RhdGVtZW50IGludG8gdGhlIHJlcGxhY2VtZW50IHN0YXRlbWVudCB2aWEgJywnXG5cdCAgICB2YXIgdG9wID0gdGhpcy5wb3BTdGFjayh0cnVlKTtcblxuXHQgICAgaWYgKHRvcCBpbnN0YW5jZW9mIExpdGVyYWwpIHtcblx0ICAgICAgLy8gTGl0ZXJhbHMgZG8gbm90IG5lZWQgdG8gYmUgaW5saW5lZFxuXHQgICAgICBzdGFjayA9IFt0b3AudmFsdWVdO1xuXHQgICAgICBwcmVmaXggPSBbJygnLCBzdGFja107XG5cdCAgICAgIHVzZWRMaXRlcmFsID0gdHJ1ZTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIC8vIEdldCBvciBjcmVhdGUgdGhlIGN1cnJlbnQgc3RhY2sgbmFtZSBmb3IgdXNlIGJ5IHRoZSBpbmxpbmVcblx0ICAgICAgY3JlYXRlZFN0YWNrID0gdHJ1ZTtcblx0ICAgICAgdmFyIF9uYW1lID0gdGhpcy5pbmNyU3RhY2soKTtcblxuXHQgICAgICBwcmVmaXggPSBbJygoJywgdGhpcy5wdXNoKF9uYW1lKSwgJyA9ICcsIHRvcCwgJyknXTtcblx0ICAgICAgc3RhY2sgPSB0aGlzLnRvcFN0YWNrKCk7XG5cdCAgICB9XG5cblx0ICAgIHZhciBpdGVtID0gY2FsbGJhY2suY2FsbCh0aGlzLCBzdGFjayk7XG5cblx0ICAgIGlmICghdXNlZExpdGVyYWwpIHtcblx0ICAgICAgdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgfVxuXHQgICAgaWYgKGNyZWF0ZWRTdGFjaykge1xuXHQgICAgICB0aGlzLnN0YWNrU2xvdC0tO1xuXHQgICAgfVxuXHQgICAgdGhpcy5wdXNoKHByZWZpeC5jb25jYXQoaXRlbSwgJyknKSk7XG5cdCAgfSxcblxuXHQgIGluY3JTdGFjazogZnVuY3Rpb24gaW5jclN0YWNrKCkge1xuXHQgICAgdGhpcy5zdGFja1Nsb3QrKztcblx0ICAgIGlmICh0aGlzLnN0YWNrU2xvdCA+IHRoaXMuc3RhY2tWYXJzLmxlbmd0aCkge1xuXHQgICAgICB0aGlzLnN0YWNrVmFycy5wdXNoKCdzdGFjaycgKyB0aGlzLnN0YWNrU2xvdCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcy50b3BTdGFja05hbWUoKTtcblx0ICB9LFxuXHQgIHRvcFN0YWNrTmFtZTogZnVuY3Rpb24gdG9wU3RhY2tOYW1lKCkge1xuXHQgICAgcmV0dXJuICdzdGFjaycgKyB0aGlzLnN0YWNrU2xvdDtcblx0ICB9LFxuXHQgIGZsdXNoSW5saW5lOiBmdW5jdGlvbiBmbHVzaElubGluZSgpIHtcblx0ICAgIHZhciBpbmxpbmVTdGFjayA9IHRoaXMuaW5saW5lU3RhY2s7XG5cdCAgICB0aGlzLmlubGluZVN0YWNrID0gW107XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gaW5saW5lU3RhY2subGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgdmFyIGVudHJ5ID0gaW5saW5lU3RhY2tbaV07XG5cdCAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHQgICAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBMaXRlcmFsKSB7XG5cdCAgICAgICAgdGhpcy5jb21waWxlU3RhY2sucHVzaChlbnRyeSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFyIHN0YWNrID0gdGhpcy5pbmNyU3RhY2soKTtcblx0ICAgICAgICB0aGlzLnB1c2hTb3VyY2UoW3N0YWNrLCAnID0gJywgZW50cnksICc7J10pO1xuXHQgICAgICAgIHRoaXMuY29tcGlsZVN0YWNrLnB1c2goc3RhY2spO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSxcblx0ICBpc0lubGluZTogZnVuY3Rpb24gaXNJbmxpbmUoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5pbmxpbmVTdGFjay5sZW5ndGg7XG5cdCAgfSxcblxuXHQgIHBvcFN0YWNrOiBmdW5jdGlvbiBwb3BTdGFjayh3cmFwcGVkKSB7XG5cdCAgICB2YXIgaW5saW5lID0gdGhpcy5pc0lubGluZSgpLFxuXHQgICAgICAgIGl0ZW0gPSAoaW5saW5lID8gdGhpcy5pbmxpbmVTdGFjayA6IHRoaXMuY29tcGlsZVN0YWNrKS5wb3AoKTtcblxuXHQgICAgaWYgKCF3cmFwcGVkICYmIGl0ZW0gaW5zdGFuY2VvZiBMaXRlcmFsKSB7XG5cdCAgICAgIHJldHVybiBpdGVtLnZhbHVlO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKCFpbmxpbmUpIHtcblx0ICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgICAgICAgIGlmICghdGhpcy5zdGFja1Nsb3QpIHtcblx0ICAgICAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdJbnZhbGlkIHN0YWNrIHBvcCcpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB0aGlzLnN0YWNrU2xvdC0tO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBpdGVtO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICB0b3BTdGFjazogZnVuY3Rpb24gdG9wU3RhY2soKSB7XG5cdCAgICB2YXIgc3RhY2sgPSB0aGlzLmlzSW5saW5lKCkgPyB0aGlzLmlubGluZVN0YWNrIDogdGhpcy5jb21waWxlU3RhY2ssXG5cdCAgICAgICAgaXRlbSA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuXG5cdCAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0ICAgIGlmIChpdGVtIGluc3RhbmNlb2YgTGl0ZXJhbCkge1xuXHQgICAgICByZXR1cm4gaXRlbS52YWx1ZTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiBpdGVtO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBjb250ZXh0TmFtZTogZnVuY3Rpb24gY29udGV4dE5hbWUoY29udGV4dCkge1xuXHQgICAgaWYgKHRoaXMudXNlRGVwdGhzICYmIGNvbnRleHQpIHtcblx0ICAgICAgcmV0dXJuICdkZXB0aHNbJyArIGNvbnRleHQgKyAnXSc7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gJ2RlcHRoJyArIGNvbnRleHQ7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHF1b3RlZFN0cmluZzogZnVuY3Rpb24gcXVvdGVkU3RyaW5nKHN0cikge1xuXHQgICAgcmV0dXJuIHRoaXMuc291cmNlLnF1b3RlZFN0cmluZyhzdHIpO1xuXHQgIH0sXG5cblx0ICBvYmplY3RMaXRlcmFsOiBmdW5jdGlvbiBvYmplY3RMaXRlcmFsKG9iaikge1xuXHQgICAgcmV0dXJuIHRoaXMuc291cmNlLm9iamVjdExpdGVyYWwob2JqKTtcblx0ICB9LFxuXG5cdCAgYWxpYXNhYmxlOiBmdW5jdGlvbiBhbGlhc2FibGUobmFtZSkge1xuXHQgICAgdmFyIHJldCA9IHRoaXMuYWxpYXNlc1tuYW1lXTtcblx0ICAgIGlmIChyZXQpIHtcblx0ICAgICAgcmV0LnJlZmVyZW5jZUNvdW50Kys7XG5cdCAgICAgIHJldHVybiByZXQ7XG5cdCAgICB9XG5cblx0ICAgIHJldCA9IHRoaXMuYWxpYXNlc1tuYW1lXSA9IHRoaXMuc291cmNlLndyYXAobmFtZSk7XG5cdCAgICByZXQuYWxpYXNhYmxlID0gdHJ1ZTtcblx0ICAgIHJldC5yZWZlcmVuY2VDb3VudCA9IDE7XG5cblx0ICAgIHJldHVybiByZXQ7XG5cdCAgfSxcblxuXHQgIHNldHVwSGVscGVyOiBmdW5jdGlvbiBzZXR1cEhlbHBlcihwYXJhbVNpemUsIG5hbWUsIGJsb2NrSGVscGVyKSB7XG5cdCAgICB2YXIgcGFyYW1zID0gW10sXG5cdCAgICAgICAgcGFyYW1zSW5pdCA9IHRoaXMuc2V0dXBIZWxwZXJBcmdzKG5hbWUsIHBhcmFtU2l6ZSwgcGFyYW1zLCBibG9ja0hlbHBlcik7XG5cdCAgICB2YXIgZm91bmRIZWxwZXIgPSB0aGlzLm5hbWVMb29rdXAoJ2hlbHBlcnMnLCBuYW1lLCAnaGVscGVyJyksXG5cdCAgICAgICAgY2FsbENvbnRleHQgPSB0aGlzLmFsaWFzYWJsZSh0aGlzLmNvbnRleHROYW1lKDApICsgJyAhPSBudWxsID8gJyArIHRoaXMuY29udGV4dE5hbWUoMCkgKyAnIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSknKTtcblxuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgcGFyYW1zOiBwYXJhbXMsXG5cdCAgICAgIHBhcmFtc0luaXQ6IHBhcmFtc0luaXQsXG5cdCAgICAgIG5hbWU6IGZvdW5kSGVscGVyLFxuXHQgICAgICBjYWxsUGFyYW1zOiBbY2FsbENvbnRleHRdLmNvbmNhdChwYXJhbXMpXG5cdCAgICB9O1xuXHQgIH0sXG5cblx0ICBzZXR1cFBhcmFtczogZnVuY3Rpb24gc2V0dXBQYXJhbXMoaGVscGVyLCBwYXJhbVNpemUsIHBhcmFtcykge1xuXHQgICAgdmFyIG9wdGlvbnMgPSB7fSxcblx0ICAgICAgICBjb250ZXh0cyA9IFtdLFxuXHQgICAgICAgIHR5cGVzID0gW10sXG5cdCAgICAgICAgaWRzID0gW10sXG5cdCAgICAgICAgb2JqZWN0QXJncyA9ICFwYXJhbXMsXG5cdCAgICAgICAgcGFyYW0gPSB1bmRlZmluZWQ7XG5cblx0ICAgIGlmIChvYmplY3RBcmdzKSB7XG5cdCAgICAgIHBhcmFtcyA9IFtdO1xuXHQgICAgfVxuXG5cdCAgICBvcHRpb25zLm5hbWUgPSB0aGlzLnF1b3RlZFN0cmluZyhoZWxwZXIpO1xuXHQgICAgb3B0aW9ucy5oYXNoID0gdGhpcy5wb3BTdGFjaygpO1xuXG5cdCAgICBpZiAodGhpcy50cmFja0lkcykge1xuXHQgICAgICBvcHRpb25zLmhhc2hJZHMgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICB9XG5cdCAgICBpZiAodGhpcy5zdHJpbmdQYXJhbXMpIHtcblx0ICAgICAgb3B0aW9ucy5oYXNoVHlwZXMgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgIG9wdGlvbnMuaGFzaENvbnRleHRzID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgaW52ZXJzZSA9IHRoaXMucG9wU3RhY2soKSxcblx0ICAgICAgICBwcm9ncmFtID0gdGhpcy5wb3BTdGFjaygpO1xuXG5cdCAgICAvLyBBdm9pZCBzZXR0aW5nIGZuIGFuZCBpbnZlcnNlIGlmIG5laXRoZXIgYXJlIHNldC4gVGhpcyBhbGxvd3Ncblx0ICAgIC8vIGhlbHBlcnMgdG8gZG8gYSBjaGVjayBmb3IgYGlmIChvcHRpb25zLmZuKWBcblx0ICAgIGlmIChwcm9ncmFtIHx8IGludmVyc2UpIHtcblx0ICAgICAgb3B0aW9ucy5mbiA9IHByb2dyYW0gfHwgJ2NvbnRhaW5lci5ub29wJztcblx0ICAgICAgb3B0aW9ucy5pbnZlcnNlID0gaW52ZXJzZSB8fCAnY29udGFpbmVyLm5vb3AnO1xuXHQgICAgfVxuXG5cdCAgICAvLyBUaGUgcGFyYW1ldGVycyBnbyBvbiB0byB0aGUgc3RhY2sgaW4gb3JkZXIgKG1ha2luZyBzdXJlIHRoYXQgdGhleSBhcmUgZXZhbHVhdGVkIGluIG9yZGVyKVxuXHQgICAgLy8gc28gd2UgbmVlZCB0byBwb3AgdGhlbSBvZmYgdGhlIHN0YWNrIGluIHJldmVyc2Ugb3JkZXJcblx0ICAgIHZhciBpID0gcGFyYW1TaXplO1xuXHQgICAgd2hpbGUgKGktLSkge1xuXHQgICAgICBwYXJhbSA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgICAgcGFyYW1zW2ldID0gcGFyYW07XG5cblx0ICAgICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcblx0ICAgICAgICBpZHNbaV0gPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG5cdCAgICAgICAgdHlwZXNbaV0gPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgICAgY29udGV4dHNbaV0gPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgaWYgKG9iamVjdEFyZ3MpIHtcblx0ICAgICAgb3B0aW9ucy5hcmdzID0gdGhpcy5zb3VyY2UuZ2VuZXJhdGVBcnJheShwYXJhbXMpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAodGhpcy50cmFja0lkcykge1xuXHQgICAgICBvcHRpb25zLmlkcyA9IHRoaXMuc291cmNlLmdlbmVyYXRlQXJyYXkoaWRzKTtcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuXHQgICAgICBvcHRpb25zLnR5cGVzID0gdGhpcy5zb3VyY2UuZ2VuZXJhdGVBcnJheSh0eXBlcyk7XG5cdCAgICAgIG9wdGlvbnMuY29udGV4dHMgPSB0aGlzLnNvdXJjZS5nZW5lcmF0ZUFycmF5KGNvbnRleHRzKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhKSB7XG5cdCAgICAgIG9wdGlvbnMuZGF0YSA9ICdkYXRhJztcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnVzZUJsb2NrUGFyYW1zKSB7XG5cdCAgICAgIG9wdGlvbnMuYmxvY2tQYXJhbXMgPSAnYmxvY2tQYXJhbXMnO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG9wdGlvbnM7XG5cdCAgfSxcblxuXHQgIHNldHVwSGVscGVyQXJnczogZnVuY3Rpb24gc2V0dXBIZWxwZXJBcmdzKGhlbHBlciwgcGFyYW1TaXplLCBwYXJhbXMsIHVzZVJlZ2lzdGVyKSB7XG5cdCAgICB2YXIgb3B0aW9ucyA9IHRoaXMuc2V0dXBQYXJhbXMoaGVscGVyLCBwYXJhbVNpemUsIHBhcmFtcyk7XG5cdCAgICBvcHRpb25zID0gdGhpcy5vYmplY3RMaXRlcmFsKG9wdGlvbnMpO1xuXHQgICAgaWYgKHVzZVJlZ2lzdGVyKSB7XG5cdCAgICAgIHRoaXMudXNlUmVnaXN0ZXIoJ29wdGlvbnMnKTtcblx0ICAgICAgcGFyYW1zLnB1c2goJ29wdGlvbnMnKTtcblx0ICAgICAgcmV0dXJuIFsnb3B0aW9ucz0nLCBvcHRpb25zXTtcblx0ICAgIH0gZWxzZSBpZiAocGFyYW1zKSB7XG5cdCAgICAgIHBhcmFtcy5wdXNoKG9wdGlvbnMpO1xuXHQgICAgICByZXR1cm4gJyc7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gb3B0aW9ucztcblx0ICAgIH1cblx0ICB9XG5cdH07XG5cblx0KGZ1bmN0aW9uICgpIHtcblx0ICB2YXIgcmVzZXJ2ZWRXb3JkcyA9ICgnYnJlYWsgZWxzZSBuZXcgdmFyJyArICcgY2FzZSBmaW5hbGx5IHJldHVybiB2b2lkJyArICcgY2F0Y2ggZm9yIHN3aXRjaCB3aGlsZScgKyAnIGNvbnRpbnVlIGZ1bmN0aW9uIHRoaXMgd2l0aCcgKyAnIGRlZmF1bHQgaWYgdGhyb3cnICsgJyBkZWxldGUgaW4gdHJ5JyArICcgZG8gaW5zdGFuY2VvZiB0eXBlb2YnICsgJyBhYnN0cmFjdCBlbnVtIGludCBzaG9ydCcgKyAnIGJvb2xlYW4gZXhwb3J0IGludGVyZmFjZSBzdGF0aWMnICsgJyBieXRlIGV4dGVuZHMgbG9uZyBzdXBlcicgKyAnIGNoYXIgZmluYWwgbmF0aXZlIHN5bmNocm9uaXplZCcgKyAnIGNsYXNzIGZsb2F0IHBhY2thZ2UgdGhyb3dzJyArICcgY29uc3QgZ290byBwcml2YXRlIHRyYW5zaWVudCcgKyAnIGRlYnVnZ2VyIGltcGxlbWVudHMgcHJvdGVjdGVkIHZvbGF0aWxlJyArICcgZG91YmxlIGltcG9ydCBwdWJsaWMgbGV0IHlpZWxkIGF3YWl0JyArICcgbnVsbCB0cnVlIGZhbHNlJykuc3BsaXQoJyAnKTtcblxuXHQgIHZhciBjb21waWxlcldvcmRzID0gSmF2YVNjcmlwdENvbXBpbGVyLlJFU0VSVkVEX1dPUkRTID0ge307XG5cblx0ICBmb3IgKHZhciBpID0gMCwgbCA9IHJlc2VydmVkV29yZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICBjb21waWxlcldvcmRzW3Jlc2VydmVkV29yZHNbaV1dID0gdHJ1ZTtcblx0ICB9XG5cdH0pKCk7XG5cblx0SmF2YVNjcmlwdENvbXBpbGVyLmlzVmFsaWRKYXZhU2NyaXB0VmFyaWFibGVOYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcblx0ICByZXR1cm4gIUphdmFTY3JpcHRDb21waWxlci5SRVNFUlZFRF9XT1JEU1tuYW1lXSAmJiAvXlthLXpBLVpfJF1bMC05YS16QS1aXyRdKiQvLnRlc3QobmFtZSk7XG5cdH07XG5cblx0ZnVuY3Rpb24gc3RyaWN0TG9va3VwKHJlcXVpcmVUZXJtaW5hbCwgY29tcGlsZXIsIHBhcnRzLCB0eXBlKSB7XG5cdCAgdmFyIHN0YWNrID0gY29tcGlsZXIucG9wU3RhY2soKSxcblx0ICAgICAgaSA9IDAsXG5cdCAgICAgIGxlbiA9IHBhcnRzLmxlbmd0aDtcblx0ICBpZiAocmVxdWlyZVRlcm1pbmFsKSB7XG5cdCAgICBsZW4tLTtcblx0ICB9XG5cblx0ICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICBzdGFjayA9IGNvbXBpbGVyLm5hbWVMb29rdXAoc3RhY2ssIHBhcnRzW2ldLCB0eXBlKTtcblx0ICB9XG5cblx0ICBpZiAocmVxdWlyZVRlcm1pbmFsKSB7XG5cdCAgICByZXR1cm4gW2NvbXBpbGVyLmFsaWFzYWJsZSgnY29udGFpbmVyLnN0cmljdCcpLCAnKCcsIHN0YWNrLCAnLCAnLCBjb21waWxlci5xdW90ZWRTdHJpbmcocGFydHNbaV0pLCAnKSddO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXR1cm4gc3RhY2s7XG5cdCAgfVxuXHR9XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gSmF2YVNjcmlwdENvbXBpbGVyO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiA0MyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIGdsb2JhbCBkZWZpbmUgKi9cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIFNvdXJjZU5vZGUgPSB1bmRlZmluZWQ7XG5cblx0dHJ5IHtcblx0ICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgIGlmIChmYWxzZSkge1xuXHQgICAgLy8gV2UgZG9uJ3Qgc3VwcG9ydCB0aGlzIGluIEFNRCBlbnZpcm9ubWVudHMuIEZvciB0aGVzZSBlbnZpcm9ubWVudHMsIHdlIGFzdXNtZSB0aGF0XG5cdCAgICAvLyB0aGV5IGFyZSBydW5uaW5nIG9uIHRoZSBicm93c2VyIGFuZCB0aHVzIGhhdmUgbm8gbmVlZCBmb3IgdGhlIHNvdXJjZS1tYXAgbGlicmFyeS5cblx0ICAgIHZhciBTb3VyY2VNYXAgPSByZXF1aXJlKCdzb3VyY2UtbWFwJyk7XG5cdCAgICBTb3VyY2VOb2RlID0gU291cmNlTWFwLlNvdXJjZU5vZGU7XG5cdCAgfVxuXHR9IGNhdGNoIChlcnIpIHt9XG5cdC8qIE5PUCAqL1xuXG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBpZjogdGVzdGVkIGJ1dCBub3QgY292ZXJlZCBpbiBpc3RhbmJ1bCBkdWUgdG8gZGlzdCBidWlsZCAgKi9cblx0aWYgKCFTb3VyY2VOb2RlKSB7XG5cdCAgU291cmNlTm9kZSA9IGZ1bmN0aW9uIChsaW5lLCBjb2x1bW4sIHNyY0ZpbGUsIGNodW5rcykge1xuXHQgICAgdGhpcy5zcmMgPSAnJztcblx0ICAgIGlmIChjaHVua3MpIHtcblx0ICAgICAgdGhpcy5hZGQoY2h1bmtzKTtcblx0ICAgIH1cblx0ICB9O1xuXHQgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgU291cmNlTm9kZS5wcm90b3R5cGUgPSB7XG5cdCAgICBhZGQ6IGZ1bmN0aW9uIGFkZChjaHVua3MpIHtcblx0ICAgICAgaWYgKF91dGlscy5pc0FycmF5KGNodW5rcykpIHtcblx0ICAgICAgICBjaHVua3MgPSBjaHVua3Muam9pbignJyk7XG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5zcmMgKz0gY2h1bmtzO1xuXHQgICAgfSxcblx0ICAgIHByZXBlbmQ6IGZ1bmN0aW9uIHByZXBlbmQoY2h1bmtzKSB7XG5cdCAgICAgIGlmIChfdXRpbHMuaXNBcnJheShjaHVua3MpKSB7XG5cdCAgICAgICAgY2h1bmtzID0gY2h1bmtzLmpvaW4oJycpO1xuXHQgICAgICB9XG5cdCAgICAgIHRoaXMuc3JjID0gY2h1bmtzICsgdGhpcy5zcmM7XG5cdCAgICB9LFxuXHQgICAgdG9TdHJpbmdXaXRoU291cmNlTWFwOiBmdW5jdGlvbiB0b1N0cmluZ1dpdGhTb3VyY2VNYXAoKSB7XG5cdCAgICAgIHJldHVybiB7IGNvZGU6IHRoaXMudG9TdHJpbmcoKSB9O1xuXHQgICAgfSxcblx0ICAgIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuc3JjO1xuXHQgICAgfVxuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBjYXN0Q2h1bmsoY2h1bmssIGNvZGVHZW4sIGxvYykge1xuXHQgIGlmIChfdXRpbHMuaXNBcnJheShjaHVuaykpIHtcblx0ICAgIHZhciByZXQgPSBbXTtcblxuXHQgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNodW5rLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIHJldC5wdXNoKGNvZGVHZW4ud3JhcChjaHVua1tpXSwgbG9jKSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH0gZWxzZSBpZiAodHlwZW9mIGNodW5rID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIGNodW5rID09PSAnbnVtYmVyJykge1xuXHQgICAgLy8gSGFuZGxlIHByaW1pdGl2ZXMgdGhhdCB0aGUgU291cmNlTm9kZSB3aWxsIHRocm93IHVwIG9uXG5cdCAgICByZXR1cm4gY2h1bmsgKyAnJztcblx0ICB9XG5cdCAgcmV0dXJuIGNodW5rO1xuXHR9XG5cblx0ZnVuY3Rpb24gQ29kZUdlbihzcmNGaWxlKSB7XG5cdCAgdGhpcy5zcmNGaWxlID0gc3JjRmlsZTtcblx0ICB0aGlzLnNvdXJjZSA9IFtdO1xuXHR9XG5cblx0Q29kZUdlbi5wcm90b3R5cGUgPSB7XG5cdCAgaXNFbXB0eTogZnVuY3Rpb24gaXNFbXB0eSgpIHtcblx0ICAgIHJldHVybiAhdGhpcy5zb3VyY2UubGVuZ3RoO1xuXHQgIH0sXG5cdCAgcHJlcGVuZDogZnVuY3Rpb24gcHJlcGVuZChzb3VyY2UsIGxvYykge1xuXHQgICAgdGhpcy5zb3VyY2UudW5zaGlmdCh0aGlzLndyYXAoc291cmNlLCBsb2MpKTtcblx0ICB9LFxuXHQgIHB1c2g6IGZ1bmN0aW9uIHB1c2goc291cmNlLCBsb2MpIHtcblx0ICAgIHRoaXMuc291cmNlLnB1c2godGhpcy53cmFwKHNvdXJjZSwgbG9jKSk7XG5cdCAgfSxcblxuXHQgIG1lcmdlOiBmdW5jdGlvbiBtZXJnZSgpIHtcblx0ICAgIHZhciBzb3VyY2UgPSB0aGlzLmVtcHR5KCk7XG5cdCAgICB0aGlzLmVhY2goZnVuY3Rpb24gKGxpbmUpIHtcblx0ICAgICAgc291cmNlLmFkZChbJyAgJywgbGluZSwgJ1xcbiddKTtcblx0ICAgIH0pO1xuXHQgICAgcmV0dXJuIHNvdXJjZTtcblx0ICB9LFxuXG5cdCAgZWFjaDogZnVuY3Rpb24gZWFjaChpdGVyKSB7XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5zb3VyY2UubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgaXRlcih0aGlzLnNvdXJjZVtpXSk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIGVtcHR5OiBmdW5jdGlvbiBlbXB0eSgpIHtcblx0ICAgIHZhciBsb2MgPSB0aGlzLmN1cnJlbnRMb2NhdGlvbiB8fCB7IHN0YXJ0OiB7fSB9O1xuXHQgICAgcmV0dXJuIG5ldyBTb3VyY2VOb2RlKGxvYy5zdGFydC5saW5lLCBsb2Muc3RhcnQuY29sdW1uLCB0aGlzLnNyY0ZpbGUpO1xuXHQgIH0sXG5cdCAgd3JhcDogZnVuY3Rpb24gd3JhcChjaHVuaykge1xuXHQgICAgdmFyIGxvYyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHRoaXMuY3VycmVudExvY2F0aW9uIHx8IHsgc3RhcnQ6IHt9IH0gOiBhcmd1bWVudHNbMV07XG5cblx0ICAgIGlmIChjaHVuayBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpIHtcblx0ICAgICAgcmV0dXJuIGNodW5rO1xuXHQgICAgfVxuXG5cdCAgICBjaHVuayA9IGNhc3RDaHVuayhjaHVuaywgdGhpcywgbG9jKTtcblxuXHQgICAgcmV0dXJuIG5ldyBTb3VyY2VOb2RlKGxvYy5zdGFydC5saW5lLCBsb2Muc3RhcnQuY29sdW1uLCB0aGlzLnNyY0ZpbGUsIGNodW5rKTtcblx0ICB9LFxuXG5cdCAgZnVuY3Rpb25DYWxsOiBmdW5jdGlvbiBmdW5jdGlvbkNhbGwoZm4sIHR5cGUsIHBhcmFtcykge1xuXHQgICAgcGFyYW1zID0gdGhpcy5nZW5lcmF0ZUxpc3QocGFyYW1zKTtcblx0ICAgIHJldHVybiB0aGlzLndyYXAoW2ZuLCB0eXBlID8gJy4nICsgdHlwZSArICcoJyA6ICcoJywgcGFyYW1zLCAnKSddKTtcblx0ICB9LFxuXG5cdCAgcXVvdGVkU3RyaW5nOiBmdW5jdGlvbiBxdW90ZWRTdHJpbmcoc3RyKSB7XG5cdCAgICByZXR1cm4gJ1wiJyArIChzdHIgKyAnJykucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csICdcXFxcbicpLnJlcGxhY2UoL1xcci9nLCAnXFxcXHInKS5yZXBsYWNlKC9cXHUyMDI4L2csICdcXFxcdTIwMjgnKSAvLyBQZXIgRWNtYS0yNjIgNy4zICsgNy44LjRcblx0ICAgIC5yZXBsYWNlKC9cXHUyMDI5L2csICdcXFxcdTIwMjknKSArICdcIic7XG5cdCAgfSxcblxuXHQgIG9iamVjdExpdGVyYWw6IGZ1bmN0aW9uIG9iamVjdExpdGVyYWwob2JqKSB7XG5cdCAgICB2YXIgcGFpcnMgPSBbXTtcblxuXHQgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuXHQgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0ICAgICAgICB2YXIgdmFsdWUgPSBjYXN0Q2h1bmsob2JqW2tleV0sIHRoaXMpO1xuXHQgICAgICAgIGlmICh2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICAgIHBhaXJzLnB1c2goW3RoaXMucXVvdGVkU3RyaW5nKGtleSksICc6JywgdmFsdWVdKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgdmFyIHJldCA9IHRoaXMuZ2VuZXJhdGVMaXN0KHBhaXJzKTtcblx0ICAgIHJldC5wcmVwZW5kKCd7Jyk7XG5cdCAgICByZXQuYWRkKCd9Jyk7XG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH0sXG5cblx0ICBnZW5lcmF0ZUxpc3Q6IGZ1bmN0aW9uIGdlbmVyYXRlTGlzdChlbnRyaWVzKSB7XG5cdCAgICB2YXIgcmV0ID0gdGhpcy5lbXB0eSgpO1xuXG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZW50cmllcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICBpZiAoaSkge1xuXHQgICAgICAgIHJldC5hZGQoJywnKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldC5hZGQoY2FzdENodW5rKGVudHJpZXNbaV0sIHRoaXMpKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHJldDtcblx0ICB9LFxuXG5cdCAgZ2VuZXJhdGVBcnJheTogZnVuY3Rpb24gZ2VuZXJhdGVBcnJheShlbnRyaWVzKSB7XG5cdCAgICB2YXIgcmV0ID0gdGhpcy5nZW5lcmF0ZUxpc3QoZW50cmllcyk7XG5cdCAgICByZXQucHJlcGVuZCgnWycpO1xuXHQgICAgcmV0LmFkZCgnXScpO1xuXG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH1cblx0fTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBDb2RlR2VuO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSlcbi8qKioqKiovIF0pXG59KTtcbjsiLCJpbXBvcnQgaGJzIGZyb20gJy4vLi4vYmVoYXZpb3JzL2hicyc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXJpb25ldHRlLlZpZXcuZXh0ZW5kKHtcbiAgICB0ZW1wbGF0ZTogZGF0YSA9PiAnYXV0b3JpemF0aW9uJyxcbiAgICBiZWhhdmlvcnM6IFtoYnNdLFxuICAgIEhCVGVtcGxhdGU6ICd0ZW1wbGF0ZXMvdmlld3MvYXRob3JpemF0aW9uLmhicycsXG4gICAgY2xhc3NOYW1lOiAnYXV0b3JpemF0aW9uJyxcbiAgICB1aToge1xuICAgICAgICBhdXRob3JpemU6ICcuYXV0aG9yaXphdGlvbl9fYnRuJyxcbiAgICAgICAgcmVnaXN0ZXI6ICcucmVnaXN0cmF0aW9uX19idG4nXG4gICAgfSxcbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIEB1aS5hdXRob3JpemUnOiAnYXV0aG9yaXplVXNlcicsXG4gICAgICAgICdjbGljayBAdWkucmVnaXN0ZXInOiAncmVnaXN0ZXJVc2VyJ1xuICAgIH0sXG4gICAgYXV0aG9yaXplVXNlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBlbWFpbCA9IHRoaXMuJCgnLmVtYWlsX19pbnB1dCcpLnZhbCgpLFxuICAgICAgICAgICAgcGFzcyA9IHRoaXMuJCgnLnBhc3NfX2lucHV0JykudmFsKCk7XG5cbiAgICAgICAgdmFyIGF1dGggPSBmaXJlYmFzZS5hdXRoKCk7XG4gICAgICAgIHZhciBwcm9taXNlID0gYXV0aC5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChlbWFpbCwgcGFzcyk7XG4gICAgICAgIHByb21pc2UuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGFsZXJ0KGUubWVzc2FnZSk7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICByZWdpc3RlclVzZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVtYWlsID0gdGhpcy4kKCcuZW1haWxfX2lucHV0JykudmFsKCksXG4gICAgICAgICAgICBwYXNzID0gdGhpcy4kKCcucGFzc19faW5wdXQnKS52YWwoKTtcblxuICAgICAgICB2YXIgYXV0aCA9IGZpcmViYXNlLmF1dGgoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBhdXRoLmNyZWF0ZVVzZXJXaXRoRW1haWxBbmRQYXNzd29yZChlbWFpbCwgcGFzcyk7XG5cbiAgICAgICAgcHJvbWlzZS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgYWxlcnQoZS5tZXNzYWdlKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBvbkxvYWRUZW1wbGF0ZSAoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxufSk7IiwiaW1wb3J0IGhicyBmcm9tICcuLy4uL2JlaGF2aW9ycy9oYnMnO1xuXG5cbnZhciBUYXNrTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2V0KFwidGl0bGVcIikpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KHtcInRpdGxlXCI6IHRoaXMuZGVmYXVsdHMudGl0bGV9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgICAgIGlmICggISQudHJpbShhdHRycy50aXRsZSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gJ9Ce0YjQuNCx0LrQsCEnO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBkZWZhdWx0czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIHRpdGxlOiAn0J3QvtCy0LDRjyDQt9Cw0LTQsNGH0LAnLFxuICAgICAgICAgICAgZG9uZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zYXZlKHsgZG9uZTohdGhpcy5nZXQoXCJkb25lXCIpfSk7XG4gICAgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH1cbn0pO1xuXG52YXIgVGFzayA9IE1hcmlvbmV0dGUuVmlldy5leHRlbmQoe1xuICAgIHRlbXBsYXRlOiBkYXRhID0+ICdtYWluIHZpZXcnLFxuICAgIGJlaGF2aW9yczogW2hic10sXG4gICAgSEJUZW1wbGF0ZTogJ3RlbXBsYXRlcy92aWV3cy90b2RvLml0ZW0uaGJzJyxcbiAgICB0YWdOYW1lOiAnbGknLFxuICAgIHVpOiB7XG4gICAgICAgIFwiZWRpdFwiOiBcInNwYW5cIixcbiAgICAgICAgXCJyZW1vdmVcIjogXCIucmVtb3ZlXCIsXG4gICAgICAgIFwidG9nZ2xlXCI6IFwiLnRvZ2dsZVwiXG4gICAgfSxcbiAgICBldmVudHM6IHtcbiAgICAgICAgXCJjbGljayBAdWkuZWRpdFwiOiBcImVkaXRUYXNrXCIsXG4gICAgICAgIFwiY2xpY2sgQHVpLnRvZ2dsZVwiOiBcInRvZ2dsZURvbmVcIixcbiAgICAgICAgJ2NsaWNrIEB1aS5yZW1vdmUnOiAncmVtb3ZlTW9kZWwnXG4gICAgfSxcbiAgICB0cmlnZ2Vyczoge1xuICAgICAgICAnY2xpY2sgQHVpLnJlbW92ZSc6ICdyZW1vdmU6bW9kZWwnXG4gICAgfSxcbiAgICByZW1vdmVNb2RlbDogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICB0aGlzLm1vZGVsLmNsZWFyKCk7XG4gICAgfSxcbiAgICBvblJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJGVsLnRvZ2dsZUNsYXNzKCdkb25lJywgdGhpcy5tb2RlbC5nZXQoJ2RvbmUnKSk7XG4gICAgfSxcbiAgICBlZGl0VGFzazogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBuZXdUYXNrVGl0bGUgPSBwcm9tcHQoJ9CY0LfQvNC10L3QuNGC0Ywg0LfQsNC00LDRh9GDJywgdGhpcy5tb2RlbC5nZXQoJ3RpdGxlJykpO1xuICAgICAgICB0aGlzLm1vZGVsLnNhdmUoe1widGl0bGVcIjogXy5lc2NhcGUobmV3VGFza1RpdGxlKX0se3ZhbGlkYXRlOnRydWV9KTvvu79cbiAgICB9LFxuICAgIHRvZ2dsZURvbmU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHRoaXMubW9kZWwudG9nZ2xlKCk7XG4gICAgfSxcbiAgICBvbkxvYWRUZW1wbGF0ZSAoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxufSk7XG5cbnZhciBUYXNrQ29sbGVjdGlvblZpZXcgPSBNYXJpb25ldHRlLkNvbGxlY3Rpb25WaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogJ3VsJyxcbiAgICBjbGFzc05hbWU6ICd0YXNrcycsXG4gICAgY2hpbGRWaWV3OiBUYXNrLFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5vbignY2hhbmdlJywgXy5iaW5kKHRoaXMucmVuZGVyLCB0aGlzKSk7XG4gICAgfSxcbiAgICBvbkNoaWxkdmlld1JlbW92ZU1vZGVsOiBmdW5jdGlvbiAodmlldykge1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb24ucmVtb3ZlKHZpZXcubW9kZWwpO1xuICAgIH0sXG4gICAgdmlld0NvbXBhcmF0b3I6IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgIHJldHVybiBtb2RlbC5nZXQoJ2RvbmUnKVxuICAgIH1cbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFyaW9uZXR0ZS5WaWV3LmV4dGVuZCh7XG4gICAgdGVtcGxhdGU6IGRhdGEgPT4gJ25ld3MgaXRlbScsXG4gICAgYmVoYXZpb3JzOiBbaGJzXSxcbiAgICBIQlRlbXBsYXRlOiAndGVtcGxhdGVzL3ZpZXdzL2N1cnJlbnQudXNlci5oYnMnLFxuICAgIGNsYXNzTmFtZTogJ2NvbnRhaW5lcicsXG4gICAgcmVnaW9uczoge1xuICAgICAgICBsaXN0OiB7XG4gICAgICAgICAgICBlbDogJyN3cmFwcGVyJ1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1aToge1xuICAgICAgICBsb2dPdXQ6ICcubG9nb3V0X19idG4nLFxuICAgICAgICBhZGR0YXNrOiAnLmFkZHRhc2snXG4gICAgfSxcbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIEB1aS5sb2dPdXQnOiAnbG9nT3V0JyxcbiAgICAgICAgJ2NsaWNrIEB1aS5hZGR0YXNrJzogJ2FkZFRhc2snXG4gICAgfSxcbiAgICBhZGRUYXNrOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyICRpbnB1dCA9ICQoJy5hZGQnKTtcbiAgICAgICAgdmFyIG5ld1Rhc2tUaXRsZSA9ICRpbnB1dC52YWwoKTtcbiAgICAgICAgbmV3VGFza1RpdGxlID0gXy5lc2NhcGUobmV3VGFza1RpdGxlKTtcbiAgICAgICAgJGlucHV0LnZhbCgnJyk7XG4gICAgICAgIGlmICghbmV3VGFza1RpdGxlKSByZXR1cm47XG4gICAgICAgIGlmIChuZXdUYXNrVGl0bGUubGVuZ3RoID4gMTAwKSByZXR1cm47XG4gICAgICAgIHRoaXMudGFza3NDb2xsZWN0aW9uLmFkZCh7dGl0bGU6IG5ld1Rhc2tUaXRsZX0pO1xuICAgIH0sXG4gICAgbG9nT3V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZpcmViYXNlLmF1dGgoKS5zaWduT3V0KClcbiAgICB9LFxuICAgIGluaXRVc2VyTGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZW1haWwgPSBmaXJlYmFzZS5hdXRoKCkuY3VycmVudFVzZXIuZW1haWw7XG4gICAgICAgIHZhciB1c2VyTmlja25hbWUgPSBlbWFpbC5zdWJzdHJpbmcoMCwgZW1haWwuaW5kZXhPZignQCcpKTtcblxuICAgICAgICAkKCcudXNlci1uYW1lJykuaHRtbCh1c2VyTmlja25hbWUpO1xuICAgICAgICB2YXIgVGFza3NDb2xsZWN0aW9uID0gQmFja2JvbmUuRmlyZWJhc2UuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgICAgICAgICAgbW9kZWw6IFRhc2tNb2RlbCxcbiAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vbWFyaW9uZXR0ZS10b2RvLWFwcC5maXJlYmFzZWlvLmNvbS9Vc2Vycy8nKyB1c2VyTmlja25hbWUgKycnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudGFza3NDb2xsZWN0aW9uID0gbmV3IFRhc2tzQ29sbGVjdGlvbigpO1xuICAgICAgICB0aGlzLnRhc2tDb2xsZWN0aW9uVmlldyA9IG5ldyBUYXNrQ29sbGVjdGlvblZpZXcoe1xuICAgICAgICAgICAgY29sbGVjdGlvbjogdGhpcy50YXNrc0NvbGxlY3Rpb25cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zaG93Q2hpbGRWaWV3KCdsaXN0JywgdGhpcy50YXNrQ29sbGVjdGlvblZpZXcpO1xuICAgIH0sXG4gICAgb25Mb2FkVGVtcGxhdGUgKCkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgICAgIHRoaXMuaW5pdFVzZXJMaXN0KCk7XG4gICAgfVxufSkiLCJpbXBvcnQgaGJzIGZyb20gJy4vLi4vYmVoYXZpb3JzL2hicyc7XG5cbmNvbnN0IGNvbmZpZyA9IHtcbiAgICBhcGlLZXk6IFwiQUl6YVN5QkYyaEVCTWJHS2VRTTNqa25Gc3RBTjBXNmVCN08zeTJNXCIsXG4gICAgYXV0aERvbWFpbjogXCJtYXJpb25ldHRlLXRvZG8tYXBwLmZpcmViYXNlYXBwLmNvbVwiLFxuICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vbWFyaW9uZXR0ZS10b2RvLWFwcC5maXJlYmFzZWlvLmNvbVwiLFxuICAgIHByb2plY3RJZDogXCJtYXJpb25ldHRlLXRvZG8tYXBwXCIsXG4gICAgc3RvcmFnZUJ1Y2tldDogXCJtYXJpb25ldHRlLXRvZG8tYXBwLmFwcHNwb3QuY29tXCIsXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMjY5MDMwNjI3Nzc2XCJcbn07XG5maXJlYmFzZS5pbml0aWFsaXplQXBwKGNvbmZpZyk7XG5cbmNvbnN0IFBBR0VTID0ge1xuICAgIGF0aG9yaXphdGlvbjogcmVxdWlyZSgnLi9hdGhvcml6YXRpb24nKSxcbiAgICB1c2VyOiByZXF1aXJlKCcuL2N1cnJlbnQudXNlcicpXG59O1xuXG5leHBvcnQgZGVmYXVsdCAgTWFyaW9uZXR0ZS5WaWV3LmV4dGVuZCh7XG4gICAgdGVtcGxhdGU6IGRhdGEgPT4gJ21haW4gdmlldycsXG4gICAgYmVoYXZpb3JzOiBbaGJzXSxcbiAgICBIQlRlbXBsYXRlOiAndGVtcGxhdGVzL2xheW91dC5oYnMnLFxuICAgIGNsYXNzTmFtZTogJ21haW4tYXBwJyxcbiAgICByZWdpb25zOiB7XG4gICAgICAgIGFwcDoge1xuICAgICAgICAgICAgZWw6ICcjYXBwbGljYXRpb24nLFxuICAgICAgICAgICAgcmVwbGFjZUVsZW1lbnQ6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tBdXRoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgZmlyZWJhc2UuYXV0aCgpLm9uQXV0aFN0YXRlQ2hhbmdlZChmdW5jdGlvbiAoZmlyZWJhc2VVc2VyKSB7XG4gICAgICAgICAgICBpZiAoZmlyZWJhc2VVc2VyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1VzZXIgbG9nZ2VkIEluJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0NoaWxkVmlldygnYXBwJywgbmV3IFBBR0VTLnVzZXIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3QgbG9nZ2VkIEluJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0NoaWxkVmlldygnYXBwJywgbmV3IFBBR0VTLmF0aG9yaXphdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgb25Mb2FkVGVtcGxhdGUgKCkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB0aGlzLmNoZWNrQXV0aCgpO1xuICAgIH1cbn0pO1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQSBkYXRhIHN0cnVjdHVyZSB3aGljaCBpcyBhIGNvbWJpbmF0aW9uIG9mIGFuIGFycmF5IGFuZCBhIHNldC4gQWRkaW5nIGEgbmV3XG4gKiBtZW1iZXIgaXMgTygxKSwgdGVzdGluZyBmb3IgbWVtYmVyc2hpcCBpcyBPKDEpLCBhbmQgZmluZGluZyB0aGUgaW5kZXggb2YgYW5cbiAqIGVsZW1lbnQgaXMgTygxKS4gUmVtb3ZpbmcgZWxlbWVudHMgZnJvbSB0aGUgc2V0IGlzIG5vdCBzdXBwb3J0ZWQuIE9ubHlcbiAqIHN0cmluZ3MgYXJlIHN1cHBvcnRlZCBmb3IgbWVtYmVyc2hpcC5cbiAqL1xuZnVuY3Rpb24gQXJyYXlTZXQoKSB7XG4gIHRoaXMuX2FycmF5ID0gW107XG4gIHRoaXMuX3NldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG59XG5cbi8qKlxuICogU3RhdGljIG1ldGhvZCBmb3IgY3JlYXRpbmcgQXJyYXlTZXQgaW5zdGFuY2VzIGZyb20gYW4gZXhpc3RpbmcgYXJyYXkuXG4gKi9cbkFycmF5U2V0LmZyb21BcnJheSA9IGZ1bmN0aW9uIEFycmF5U2V0X2Zyb21BcnJheShhQXJyYXksIGFBbGxvd0R1cGxpY2F0ZXMpIHtcbiAgdmFyIHNldCA9IG5ldyBBcnJheVNldCgpO1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gYUFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgc2V0LmFkZChhQXJyYXlbaV0sIGFBbGxvd0R1cGxpY2F0ZXMpO1xuICB9XG4gIHJldHVybiBzZXQ7XG59O1xuXG4vKipcbiAqIFJldHVybiBob3cgbWFueSB1bmlxdWUgaXRlbXMgYXJlIGluIHRoaXMgQXJyYXlTZXQuIElmIGR1cGxpY2F0ZXMgaGF2ZSBiZWVuXG4gKiBhZGRlZCwgdGhhbiB0aG9zZSBkbyBub3QgY291bnQgdG93YXJkcyB0aGUgc2l6ZS5cbiAqXG4gKiBAcmV0dXJucyBOdW1iZXJcbiAqL1xuQXJyYXlTZXQucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiBBcnJheVNldF9zaXplKCkge1xuICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5fc2V0KS5sZW5ndGg7XG59O1xuXG4vKipcbiAqIEFkZCB0aGUgZ2l2ZW4gc3RyaW5nIHRvIHRoaXMgc2V0LlxuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5BcnJheVNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gQXJyYXlTZXRfYWRkKGFTdHIsIGFBbGxvd0R1cGxpY2F0ZXMpIHtcbiAgdmFyIHNTdHIgPSB1dGlsLnRvU2V0U3RyaW5nKGFTdHIpO1xuICB2YXIgaXNEdXBsaWNhdGUgPSBoYXMuY2FsbCh0aGlzLl9zZXQsIHNTdHIpO1xuICB2YXIgaWR4ID0gdGhpcy5fYXJyYXkubGVuZ3RoO1xuICBpZiAoIWlzRHVwbGljYXRlIHx8IGFBbGxvd0R1cGxpY2F0ZXMpIHtcbiAgICB0aGlzLl9hcnJheS5wdXNoKGFTdHIpO1xuICB9XG4gIGlmICghaXNEdXBsaWNhdGUpIHtcbiAgICB0aGlzLl9zZXRbc1N0cl0gPSBpZHg7XG4gIH1cbn07XG5cbi8qKlxuICogSXMgdGhlIGdpdmVuIHN0cmluZyBhIG1lbWJlciBvZiB0aGlzIHNldD9cbiAqXG4gKiBAcGFyYW0gU3RyaW5nIGFTdHJcbiAqL1xuQXJyYXlTZXQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIEFycmF5U2V0X2hhcyhhU3RyKSB7XG4gIHZhciBzU3RyID0gdXRpbC50b1NldFN0cmluZyhhU3RyKTtcbiAgcmV0dXJuIGhhcy5jYWxsKHRoaXMuX3NldCwgc1N0cik7XG59O1xuXG4vKipcbiAqIFdoYXQgaXMgdGhlIGluZGV4IG9mIHRoZSBnaXZlbiBzdHJpbmcgaW4gdGhlIGFycmF5P1xuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5BcnJheVNldC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIEFycmF5U2V0X2luZGV4T2YoYVN0cikge1xuICB2YXIgc1N0ciA9IHV0aWwudG9TZXRTdHJpbmcoYVN0cik7XG4gIGlmIChoYXMuY2FsbCh0aGlzLl9zZXQsIHNTdHIpKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NldFtzU3RyXTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFTdHIgKyAnXCIgaXMgbm90IGluIHRoZSBzZXQuJyk7XG59O1xuXG4vKipcbiAqIFdoYXQgaXMgdGhlIGVsZW1lbnQgYXQgdGhlIGdpdmVuIGluZGV4P1xuICpcbiAqIEBwYXJhbSBOdW1iZXIgYUlkeFxuICovXG5BcnJheVNldC5wcm90b3R5cGUuYXQgPSBmdW5jdGlvbiBBcnJheVNldF9hdChhSWR4KSB7XG4gIGlmIChhSWR4ID49IDAgJiYgYUlkeCA8IHRoaXMuX2FycmF5Lmxlbmd0aCkge1xuICAgIHJldHVybiB0aGlzLl9hcnJheVthSWR4XTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVsZW1lbnQgaW5kZXhlZCBieSAnICsgYUlkeCk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgc2V0ICh3aGljaCBoYXMgdGhlIHByb3BlciBpbmRpY2VzXG4gKiBpbmRpY2F0ZWQgYnkgaW5kZXhPZikuIE5vdGUgdGhhdCB0aGlzIGlzIGEgY29weSBvZiB0aGUgaW50ZXJuYWwgYXJyYXkgdXNlZFxuICogZm9yIHN0b3JpbmcgdGhlIG1lbWJlcnMgc28gdGhhdCBubyBvbmUgY2FuIG1lc3Mgd2l0aCBpbnRlcm5hbCBzdGF0ZS5cbiAqL1xuQXJyYXlTZXQucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiBBcnJheVNldF90b0FycmF5KCkge1xuICByZXR1cm4gdGhpcy5fYXJyYXkuc2xpY2UoKTtcbn07XG5cbmV4cG9ydHMuQXJyYXlTZXQgPSBBcnJheVNldDtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKlxuICogQmFzZWQgb24gdGhlIEJhc2UgNjQgVkxRIGltcGxlbWVudGF0aW9uIGluIENsb3N1cmUgQ29tcGlsZXI6XG4gKiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nsb3N1cmUtY29tcGlsZXIvc291cmNlL2Jyb3dzZS90cnVuay9zcmMvY29tL2dvb2dsZS9kZWJ1Z2dpbmcvc291cmNlbWFwL0Jhc2U2NFZMUS5qYXZhXG4gKlxuICogQ29weXJpZ2h0IDIwMTEgVGhlIENsb3N1cmUgQ29tcGlsZXIgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZVxuICogbWV0OlxuICpcbiAqICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gKiAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlXG4gKiAgICBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZ1xuICogICAgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkXG4gKiAgICB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKiAgKiBOZWl0aGVyIHRoZSBuYW1lIG9mIEdvb2dsZSBJbmMuIG5vciB0aGUgbmFtZXMgb2YgaXRzXG4gKiAgICBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWRcbiAqICAgIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAqIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUXG4gKiBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCxcbiAqIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLFxuICogREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZXG4gKiBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0VcbiAqIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJy4vYmFzZTY0Jyk7XG5cbi8vIEEgc2luZ2xlIGJhc2UgNjQgZGlnaXQgY2FuIGNvbnRhaW4gNiBiaXRzIG9mIGRhdGEuIEZvciB0aGUgYmFzZSA2NCB2YXJpYWJsZVxuLy8gbGVuZ3RoIHF1YW50aXRpZXMgd2UgdXNlIGluIHRoZSBzb3VyY2UgbWFwIHNwZWMsIHRoZSBmaXJzdCBiaXQgaXMgdGhlIHNpZ24sXG4vLyB0aGUgbmV4dCBmb3VyIGJpdHMgYXJlIHRoZSBhY3R1YWwgdmFsdWUsIGFuZCB0aGUgNnRoIGJpdCBpcyB0aGVcbi8vIGNvbnRpbnVhdGlvbiBiaXQuIFRoZSBjb250aW51YXRpb24gYml0IHRlbGxzIHVzIHdoZXRoZXIgdGhlcmUgYXJlIG1vcmVcbi8vIGRpZ2l0cyBpbiB0aGlzIHZhbHVlIGZvbGxvd2luZyB0aGlzIGRpZ2l0LlxuLy9cbi8vICAgQ29udGludWF0aW9uXG4vLyAgIHwgICAgU2lnblxuLy8gICB8ICAgIHxcbi8vICAgViAgICBWXG4vLyAgIDEwMTAxMVxuXG52YXIgVkxRX0JBU0VfU0hJRlQgPSA1O1xuXG4vLyBiaW5hcnk6IDEwMDAwMFxudmFyIFZMUV9CQVNFID0gMSA8PCBWTFFfQkFTRV9TSElGVDtcblxuLy8gYmluYXJ5OiAwMTExMTFcbnZhciBWTFFfQkFTRV9NQVNLID0gVkxRX0JBU0UgLSAxO1xuXG4vLyBiaW5hcnk6IDEwMDAwMFxudmFyIFZMUV9DT05USU5VQVRJT05fQklUID0gVkxRX0JBU0U7XG5cbi8qKlxuICogQ29udmVydHMgZnJvbSBhIHR3by1jb21wbGVtZW50IHZhbHVlIHRvIGEgdmFsdWUgd2hlcmUgdGhlIHNpZ24gYml0IGlzXG4gKiBwbGFjZWQgaW4gdGhlIGxlYXN0IHNpZ25pZmljYW50IGJpdC4gIEZvciBleGFtcGxlLCBhcyBkZWNpbWFsczpcbiAqICAgMSBiZWNvbWVzIDIgKDEwIGJpbmFyeSksIC0xIGJlY29tZXMgMyAoMTEgYmluYXJ5KVxuICogICAyIGJlY29tZXMgNCAoMTAwIGJpbmFyeSksIC0yIGJlY29tZXMgNSAoMTAxIGJpbmFyeSlcbiAqL1xuZnVuY3Rpb24gdG9WTFFTaWduZWQoYVZhbHVlKSB7XG4gIHJldHVybiBhVmFsdWUgPCAwXG4gICAgPyAoKC1hVmFsdWUpIDw8IDEpICsgMVxuICAgIDogKGFWYWx1ZSA8PCAxKSArIDA7XG59XG5cbi8qKlxuICogQ29udmVydHMgdG8gYSB0d28tY29tcGxlbWVudCB2YWx1ZSBmcm9tIGEgdmFsdWUgd2hlcmUgdGhlIHNpZ24gYml0IGlzXG4gKiBwbGFjZWQgaW4gdGhlIGxlYXN0IHNpZ25pZmljYW50IGJpdC4gIEZvciBleGFtcGxlLCBhcyBkZWNpbWFsczpcbiAqICAgMiAoMTAgYmluYXJ5KSBiZWNvbWVzIDEsIDMgKDExIGJpbmFyeSkgYmVjb21lcyAtMVxuICogICA0ICgxMDAgYmluYXJ5KSBiZWNvbWVzIDIsIDUgKDEwMSBiaW5hcnkpIGJlY29tZXMgLTJcbiAqL1xuZnVuY3Rpb24gZnJvbVZMUVNpZ25lZChhVmFsdWUpIHtcbiAgdmFyIGlzTmVnYXRpdmUgPSAoYVZhbHVlICYgMSkgPT09IDE7XG4gIHZhciBzaGlmdGVkID0gYVZhbHVlID4+IDE7XG4gIHJldHVybiBpc05lZ2F0aXZlXG4gICAgPyAtc2hpZnRlZFxuICAgIDogc2hpZnRlZDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBiYXNlIDY0IFZMUSBlbmNvZGVkIHZhbHVlLlxuICovXG5leHBvcnRzLmVuY29kZSA9IGZ1bmN0aW9uIGJhc2U2NFZMUV9lbmNvZGUoYVZhbHVlKSB7XG4gIHZhciBlbmNvZGVkID0gXCJcIjtcbiAgdmFyIGRpZ2l0O1xuXG4gIHZhciB2bHEgPSB0b1ZMUVNpZ25lZChhVmFsdWUpO1xuXG4gIGRvIHtcbiAgICBkaWdpdCA9IHZscSAmIFZMUV9CQVNFX01BU0s7XG4gICAgdmxxID4+Pj0gVkxRX0JBU0VfU0hJRlQ7XG4gICAgaWYgKHZscSA+IDApIHtcbiAgICAgIC8vIFRoZXJlIGFyZSBzdGlsbCBtb3JlIGRpZ2l0cyBpbiB0aGlzIHZhbHVlLCBzbyB3ZSBtdXN0IG1ha2Ugc3VyZSB0aGVcbiAgICAgIC8vIGNvbnRpbnVhdGlvbiBiaXQgaXMgbWFya2VkLlxuICAgICAgZGlnaXQgfD0gVkxRX0NPTlRJTlVBVElPTl9CSVQ7XG4gICAgfVxuICAgIGVuY29kZWQgKz0gYmFzZTY0LmVuY29kZShkaWdpdCk7XG4gIH0gd2hpbGUgKHZscSA+IDApO1xuXG4gIHJldHVybiBlbmNvZGVkO1xufTtcblxuLyoqXG4gKiBEZWNvZGVzIHRoZSBuZXh0IGJhc2UgNjQgVkxRIHZhbHVlIGZyb20gdGhlIGdpdmVuIHN0cmluZyBhbmQgcmV0dXJucyB0aGVcbiAqIHZhbHVlIGFuZCB0aGUgcmVzdCBvZiB0aGUgc3RyaW5nIHZpYSB0aGUgb3V0IHBhcmFtZXRlci5cbiAqL1xuZXhwb3J0cy5kZWNvZGUgPSBmdW5jdGlvbiBiYXNlNjRWTFFfZGVjb2RlKGFTdHIsIGFJbmRleCwgYU91dFBhcmFtKSB7XG4gIHZhciBzdHJMZW4gPSBhU3RyLmxlbmd0aDtcbiAgdmFyIHJlc3VsdCA9IDA7XG4gIHZhciBzaGlmdCA9IDA7XG4gIHZhciBjb250aW51YXRpb24sIGRpZ2l0O1xuXG4gIGRvIHtcbiAgICBpZiAoYUluZGV4ID49IHN0ckxlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgbW9yZSBkaWdpdHMgaW4gYmFzZSA2NCBWTFEgdmFsdWUuXCIpO1xuICAgIH1cblxuICAgIGRpZ2l0ID0gYmFzZTY0LmRlY29kZShhU3RyLmNoYXJDb2RlQXQoYUluZGV4KyspKTtcbiAgICBpZiAoZGlnaXQgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGJhc2U2NCBkaWdpdDogXCIgKyBhU3RyLmNoYXJBdChhSW5kZXggLSAxKSk7XG4gICAgfVxuXG4gICAgY29udGludWF0aW9uID0gISEoZGlnaXQgJiBWTFFfQ09OVElOVUFUSU9OX0JJVCk7XG4gICAgZGlnaXQgJj0gVkxRX0JBU0VfTUFTSztcbiAgICByZXN1bHQgPSByZXN1bHQgKyAoZGlnaXQgPDwgc2hpZnQpO1xuICAgIHNoaWZ0ICs9IFZMUV9CQVNFX1NISUZUO1xuICB9IHdoaWxlIChjb250aW51YXRpb24pO1xuXG4gIGFPdXRQYXJhbS52YWx1ZSA9IGZyb21WTFFTaWduZWQocmVzdWx0KTtcbiAgYU91dFBhcmFtLnJlc3QgPSBhSW5kZXg7XG59O1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgaW50VG9DaGFyTWFwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLnNwbGl0KCcnKTtcblxuLyoqXG4gKiBFbmNvZGUgYW4gaW50ZWdlciBpbiB0aGUgcmFuZ2Ugb2YgMCB0byA2MyB0byBhIHNpbmdsZSBiYXNlIDY0IGRpZ2l0LlxuICovXG5leHBvcnRzLmVuY29kZSA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgaWYgKDAgPD0gbnVtYmVyICYmIG51bWJlciA8IGludFRvQ2hhck1hcC5sZW5ndGgpIHtcbiAgICByZXR1cm4gaW50VG9DaGFyTWFwW251bWJlcl07XG4gIH1cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk11c3QgYmUgYmV0d2VlbiAwIGFuZCA2MzogXCIgKyBudW1iZXIpO1xufTtcblxuLyoqXG4gKiBEZWNvZGUgYSBzaW5nbGUgYmFzZSA2NCBjaGFyYWN0ZXIgY29kZSBkaWdpdCB0byBhbiBpbnRlZ2VyLiBSZXR1cm5zIC0xIG9uXG4gKiBmYWlsdXJlLlxuICovXG5leHBvcnRzLmRlY29kZSA9IGZ1bmN0aW9uIChjaGFyQ29kZSkge1xuICB2YXIgYmlnQSA9IDY1OyAgICAgLy8gJ0EnXG4gIHZhciBiaWdaID0gOTA7ICAgICAvLyAnWidcblxuICB2YXIgbGl0dGxlQSA9IDk3OyAgLy8gJ2EnXG4gIHZhciBsaXR0bGVaID0gMTIyOyAvLyAneidcblxuICB2YXIgemVybyA9IDQ4OyAgICAgLy8gJzAnXG4gIHZhciBuaW5lID0gNTc7ICAgICAvLyAnOSdcblxuICB2YXIgcGx1cyA9IDQzOyAgICAgLy8gJysnXG4gIHZhciBzbGFzaCA9IDQ3OyAgICAvLyAnLydcblxuICB2YXIgbGl0dGxlT2Zmc2V0ID0gMjY7XG4gIHZhciBudW1iZXJPZmZzZXQgPSA1MjtcblxuICAvLyAwIC0gMjU6IEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXG4gIGlmIChiaWdBIDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDw9IGJpZ1opIHtcbiAgICByZXR1cm4gKGNoYXJDb2RlIC0gYmlnQSk7XG4gIH1cblxuICAvLyAyNiAtIDUxOiBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elxuICBpZiAobGl0dGxlQSA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8PSBsaXR0bGVaKSB7XG4gICAgcmV0dXJuIChjaGFyQ29kZSAtIGxpdHRsZUEgKyBsaXR0bGVPZmZzZXQpO1xuICB9XG5cbiAgLy8gNTIgLSA2MTogMDEyMzQ1Njc4OVxuICBpZiAoemVybyA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8PSBuaW5lKSB7XG4gICAgcmV0dXJuIChjaGFyQ29kZSAtIHplcm8gKyBudW1iZXJPZmZzZXQpO1xuICB9XG5cbiAgLy8gNjI6ICtcbiAgaWYgKGNoYXJDb2RlID09IHBsdXMpIHtcbiAgICByZXR1cm4gNjI7XG4gIH1cblxuICAvLyA2MzogL1xuICBpZiAoY2hhckNvZGUgPT0gc2xhc2gpIHtcbiAgICByZXR1cm4gNjM7XG4gIH1cblxuICAvLyBJbnZhbGlkIGJhc2U2NCBkaWdpdC5cbiAgcmV0dXJuIC0xO1xufTtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxuZXhwb3J0cy5HUkVBVEVTVF9MT1dFUl9CT1VORCA9IDE7XG5leHBvcnRzLkxFQVNUX1VQUEVSX0JPVU5EID0gMjtcblxuLyoqXG4gKiBSZWN1cnNpdmUgaW1wbGVtZW50YXRpb24gb2YgYmluYXJ5IHNlYXJjaC5cbiAqXG4gKiBAcGFyYW0gYUxvdyBJbmRpY2VzIGhlcmUgYW5kIGxvd2VyIGRvIG5vdCBjb250YWluIHRoZSBuZWVkbGUuXG4gKiBAcGFyYW0gYUhpZ2ggSW5kaWNlcyBoZXJlIGFuZCBoaWdoZXIgZG8gbm90IGNvbnRhaW4gdGhlIG5lZWRsZS5cbiAqIEBwYXJhbSBhTmVlZGxlIFRoZSBlbGVtZW50IGJlaW5nIHNlYXJjaGVkIGZvci5cbiAqIEBwYXJhbSBhSGF5c3RhY2sgVGhlIG5vbi1lbXB0eSBhcnJheSBiZWluZyBzZWFyY2hlZC5cbiAqIEBwYXJhbSBhQ29tcGFyZSBGdW5jdGlvbiB3aGljaCB0YWtlcyB0d28gZWxlbWVudHMgYW5kIHJldHVybnMgLTEsIDAsIG9yIDEuXG4gKiBAcGFyYW0gYUJpYXMgRWl0aGVyICdiaW5hcnlTZWFyY2guR1JFQVRFU1RfTE9XRVJfQk9VTkQnIG9yXG4gKiAgICAgJ2JpbmFyeVNlYXJjaC5MRUFTVF9VUFBFUl9CT1VORCcuIFNwZWNpZmllcyB3aGV0aGVyIHRvIHJldHVybiB0aGVcbiAqICAgICBjbG9zZXN0IGVsZW1lbnQgdGhhdCBpcyBzbWFsbGVyIHRoYW4gb3IgZ3JlYXRlciB0aGFuIHRoZSBvbmUgd2UgYXJlXG4gKiAgICAgc2VhcmNoaW5nIGZvciwgcmVzcGVjdGl2ZWx5LCBpZiB0aGUgZXhhY3QgZWxlbWVudCBjYW5ub3QgYmUgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIHJlY3Vyc2l2ZVNlYXJjaChhTG93LCBhSGlnaCwgYU5lZWRsZSwgYUhheXN0YWNrLCBhQ29tcGFyZSwgYUJpYXMpIHtcbiAgLy8gVGhpcyBmdW5jdGlvbiB0ZXJtaW5hdGVzIHdoZW4gb25lIG9mIHRoZSBmb2xsb3dpbmcgaXMgdHJ1ZTpcbiAgLy9cbiAgLy8gICAxLiBXZSBmaW5kIHRoZSBleGFjdCBlbGVtZW50IHdlIGFyZSBsb29raW5nIGZvci5cbiAgLy9cbiAgLy8gICAyLiBXZSBkaWQgbm90IGZpbmQgdGhlIGV4YWN0IGVsZW1lbnQsIGJ1dCB3ZSBjYW4gcmV0dXJuIHRoZSBpbmRleCBvZlxuICAvLyAgICAgIHRoZSBuZXh0LWNsb3Nlc3QgZWxlbWVudC5cbiAgLy9cbiAgLy8gICAzLiBXZSBkaWQgbm90IGZpbmQgdGhlIGV4YWN0IGVsZW1lbnQsIGFuZCB0aGVyZSBpcyBubyBuZXh0LWNsb3Nlc3RcbiAgLy8gICAgICBlbGVtZW50IHRoYW4gdGhlIG9uZSB3ZSBhcmUgc2VhcmNoaW5nIGZvciwgc28gd2UgcmV0dXJuIC0xLlxuICB2YXIgbWlkID0gTWF0aC5mbG9vcigoYUhpZ2ggLSBhTG93KSAvIDIpICsgYUxvdztcbiAgdmFyIGNtcCA9IGFDb21wYXJlKGFOZWVkbGUsIGFIYXlzdGFja1ttaWRdLCB0cnVlKTtcbiAgaWYgKGNtcCA9PT0gMCkge1xuICAgIC8vIEZvdW5kIHRoZSBlbGVtZW50IHdlIGFyZSBsb29raW5nIGZvci5cbiAgICByZXR1cm4gbWlkO1xuICB9XG4gIGVsc2UgaWYgKGNtcCA+IDApIHtcbiAgICAvLyBPdXIgbmVlZGxlIGlzIGdyZWF0ZXIgdGhhbiBhSGF5c3RhY2tbbWlkXS5cbiAgICBpZiAoYUhpZ2ggLSBtaWQgPiAxKSB7XG4gICAgICAvLyBUaGUgZWxlbWVudCBpcyBpbiB0aGUgdXBwZXIgaGFsZi5cbiAgICAgIHJldHVybiByZWN1cnNpdmVTZWFyY2gobWlkLCBhSGlnaCwgYU5lZWRsZSwgYUhheXN0YWNrLCBhQ29tcGFyZSwgYUJpYXMpO1xuICAgIH1cblxuICAgIC8vIFRoZSBleGFjdCBuZWVkbGUgZWxlbWVudCB3YXMgbm90IGZvdW5kIGluIHRoaXMgaGF5c3RhY2suIERldGVybWluZSBpZlxuICAgIC8vIHdlIGFyZSBpbiB0ZXJtaW5hdGlvbiBjYXNlICgzKSBvciAoMikgYW5kIHJldHVybiB0aGUgYXBwcm9wcmlhdGUgdGhpbmcuXG4gICAgaWYgKGFCaWFzID09IGV4cG9ydHMuTEVBU1RfVVBQRVJfQk9VTkQpIHtcbiAgICAgIHJldHVybiBhSGlnaCA8IGFIYXlzdGFjay5sZW5ndGggPyBhSGlnaCA6IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbWlkO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICAvLyBPdXIgbmVlZGxlIGlzIGxlc3MgdGhhbiBhSGF5c3RhY2tbbWlkXS5cbiAgICBpZiAobWlkIC0gYUxvdyA+IDEpIHtcbiAgICAgIC8vIFRoZSBlbGVtZW50IGlzIGluIHRoZSBsb3dlciBoYWxmLlxuICAgICAgcmV0dXJuIHJlY3Vyc2l2ZVNlYXJjaChhTG93LCBtaWQsIGFOZWVkbGUsIGFIYXlzdGFjaywgYUNvbXBhcmUsIGFCaWFzKTtcbiAgICB9XG5cbiAgICAvLyB3ZSBhcmUgaW4gdGVybWluYXRpb24gY2FzZSAoMykgb3IgKDIpIGFuZCByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIHRoaW5nLlxuICAgIGlmIChhQmlhcyA9PSBleHBvcnRzLkxFQVNUX1VQUEVSX0JPVU5EKSB7XG4gICAgICByZXR1cm4gbWlkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYUxvdyA8IDAgPyAtMSA6IGFMb3c7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVGhpcyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiBiaW5hcnkgc2VhcmNoIHdoaWNoIHdpbGwgYWx3YXlzIHRyeSBhbmQgcmV0dXJuXG4gKiB0aGUgaW5kZXggb2YgdGhlIGNsb3Nlc3QgZWxlbWVudCBpZiB0aGVyZSBpcyBubyBleGFjdCBoaXQuIFRoaXMgaXMgYmVjYXVzZVxuICogbWFwcGluZ3MgYmV0d2VlbiBvcmlnaW5hbCBhbmQgZ2VuZXJhdGVkIGxpbmUvY29sIHBhaXJzIGFyZSBzaW5nbGUgcG9pbnRzLFxuICogYW5kIHRoZXJlIGlzIGFuIGltcGxpY2l0IHJlZ2lvbiBiZXR3ZWVuIGVhY2ggb2YgdGhlbSwgc28gYSBtaXNzIGp1c3QgbWVhbnNcbiAqIHRoYXQgeW91IGFyZW4ndCBvbiB0aGUgdmVyeSBzdGFydCBvZiBhIHJlZ2lvbi5cbiAqXG4gKiBAcGFyYW0gYU5lZWRsZSBUaGUgZWxlbWVudCB5b3UgYXJlIGxvb2tpbmcgZm9yLlxuICogQHBhcmFtIGFIYXlzdGFjayBUaGUgYXJyYXkgdGhhdCBpcyBiZWluZyBzZWFyY2hlZC5cbiAqIEBwYXJhbSBhQ29tcGFyZSBBIGZ1bmN0aW9uIHdoaWNoIHRha2VzIHRoZSBuZWVkbGUgYW5kIGFuIGVsZW1lbnQgaW4gdGhlXG4gKiAgICAgYXJyYXkgYW5kIHJldHVybnMgLTEsIDAsIG9yIDEgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIG5lZWRsZSBpcyBsZXNzXG4gKiAgICAgdGhhbiwgZXF1YWwgdG8sIG9yIGdyZWF0ZXIgdGhhbiB0aGUgZWxlbWVudCwgcmVzcGVjdGl2ZWx5LlxuICogQHBhcmFtIGFCaWFzIEVpdGhlciAnYmluYXJ5U2VhcmNoLkdSRUFURVNUX0xPV0VSX0JPVU5EJyBvclxuICogICAgICdiaW5hcnlTZWFyY2guTEVBU1RfVVBQRVJfQk9VTkQnLiBTcGVjaWZpZXMgd2hldGhlciB0byByZXR1cm4gdGhlXG4gKiAgICAgY2xvc2VzdCBlbGVtZW50IHRoYXQgaXMgc21hbGxlciB0aGFuIG9yIGdyZWF0ZXIgdGhhbiB0aGUgb25lIHdlIGFyZVxuICogICAgIHNlYXJjaGluZyBmb3IsIHJlc3BlY3RpdmVseSwgaWYgdGhlIGV4YWN0IGVsZW1lbnQgY2Fubm90IGJlIGZvdW5kLlxuICogICAgIERlZmF1bHRzIHRvICdiaW5hcnlTZWFyY2guR1JFQVRFU1RfTE9XRVJfQk9VTkQnLlxuICovXG5leHBvcnRzLnNlYXJjaCA9IGZ1bmN0aW9uIHNlYXJjaChhTmVlZGxlLCBhSGF5c3RhY2ssIGFDb21wYXJlLCBhQmlhcykge1xuICBpZiAoYUhheXN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIHZhciBpbmRleCA9IHJlY3Vyc2l2ZVNlYXJjaCgtMSwgYUhheXN0YWNrLmxlbmd0aCwgYU5lZWRsZSwgYUhheXN0YWNrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYUNvbXBhcmUsIGFCaWFzIHx8IGV4cG9ydHMuR1JFQVRFU1RfTE9XRVJfQk9VTkQpO1xuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLy8gV2UgaGF2ZSBmb3VuZCBlaXRoZXIgdGhlIGV4YWN0IGVsZW1lbnQsIG9yIHRoZSBuZXh0LWNsb3Nlc3QgZWxlbWVudCB0aGFuXG4gIC8vIHRoZSBvbmUgd2UgYXJlIHNlYXJjaGluZyBmb3IuIEhvd2V2ZXIsIHRoZXJlIG1heSBiZSBtb3JlIHRoYW4gb25lIHN1Y2hcbiAgLy8gZWxlbWVudC4gTWFrZSBzdXJlIHdlIGFsd2F5cyByZXR1cm4gdGhlIHNtYWxsZXN0IG9mIHRoZXNlLlxuICB3aGlsZSAoaW5kZXggLSAxID49IDApIHtcbiAgICBpZiAoYUNvbXBhcmUoYUhheXN0YWNrW2luZGV4XSwgYUhheXN0YWNrW2luZGV4IC0gMV0sIHRydWUpICE9PSAwKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgLS1pbmRleDtcbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn07XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTQgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgbWFwcGluZ0IgaXMgYWZ0ZXIgbWFwcGluZ0Egd2l0aCByZXNwZWN0IHRvIGdlbmVyYXRlZFxuICogcG9zaXRpb24uXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlZFBvc2l0aW9uQWZ0ZXIobWFwcGluZ0EsIG1hcHBpbmdCKSB7XG4gIC8vIE9wdGltaXplZCBmb3IgbW9zdCBjb21tb24gY2FzZVxuICB2YXIgbGluZUEgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lO1xuICB2YXIgbGluZUIgPSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICB2YXIgY29sdW1uQSA9IG1hcHBpbmdBLmdlbmVyYXRlZENvbHVtbjtcbiAgdmFyIGNvbHVtbkIgPSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIHJldHVybiBsaW5lQiA+IGxpbmVBIHx8IGxpbmVCID09IGxpbmVBICYmIGNvbHVtbkIgPj0gY29sdW1uQSB8fFxuICAgICAgICAgdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IpIDw9IDA7XG59XG5cbi8qKlxuICogQSBkYXRhIHN0cnVjdHVyZSB0byBwcm92aWRlIGEgc29ydGVkIHZpZXcgb2YgYWNjdW11bGF0ZWQgbWFwcGluZ3MgaW4gYVxuICogcGVyZm9ybWFuY2UgY29uc2Npb3VzIG1hbm5lci4gSXQgdHJhZGVzIGEgbmVnbGliYWJsZSBvdmVyaGVhZCBpbiBnZW5lcmFsXG4gKiBjYXNlIGZvciBhIGxhcmdlIHNwZWVkdXAgaW4gY2FzZSBvZiBtYXBwaW5ncyBiZWluZyBhZGRlZCBpbiBvcmRlci5cbiAqL1xuZnVuY3Rpb24gTWFwcGluZ0xpc3QoKSB7XG4gIHRoaXMuX2FycmF5ID0gW107XG4gIHRoaXMuX3NvcnRlZCA9IHRydWU7XG4gIC8vIFNlcnZlcyBhcyBpbmZpbXVtXG4gIHRoaXMuX2xhc3QgPSB7Z2VuZXJhdGVkTGluZTogLTEsIGdlbmVyYXRlZENvbHVtbjogMH07XG59XG5cbi8qKlxuICogSXRlcmF0ZSB0aHJvdWdoIGludGVybmFsIGl0ZW1zLiBUaGlzIG1ldGhvZCB0YWtlcyB0aGUgc2FtZSBhcmd1bWVudHMgdGhhdFxuICogYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCB0YWtlcy5cbiAqXG4gKiBOT1RFOiBUaGUgb3JkZXIgb2YgdGhlIG1hcHBpbmdzIGlzIE5PVCBndWFyYW50ZWVkLlxuICovXG5NYXBwaW5nTGlzdC5wcm90b3R5cGUudW5zb3J0ZWRGb3JFYWNoID1cbiAgZnVuY3Rpb24gTWFwcGluZ0xpc3RfZm9yRWFjaChhQ2FsbGJhY2ssIGFUaGlzQXJnKSB7XG4gICAgdGhpcy5fYXJyYXkuZm9yRWFjaChhQ2FsbGJhY2ssIGFUaGlzQXJnKTtcbiAgfTtcblxuLyoqXG4gKiBBZGQgdGhlIGdpdmVuIHNvdXJjZSBtYXBwaW5nLlxuICpcbiAqIEBwYXJhbSBPYmplY3QgYU1hcHBpbmdcbiAqL1xuTWFwcGluZ0xpc3QucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIE1hcHBpbmdMaXN0X2FkZChhTWFwcGluZykge1xuICBpZiAoZ2VuZXJhdGVkUG9zaXRpb25BZnRlcih0aGlzLl9sYXN0LCBhTWFwcGluZykpIHtcbiAgICB0aGlzLl9sYXN0ID0gYU1hcHBpbmc7XG4gICAgdGhpcy5fYXJyYXkucHVzaChhTWFwcGluZyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fc29ydGVkID0gZmFsc2U7XG4gICAgdGhpcy5fYXJyYXkucHVzaChhTWFwcGluZyk7XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmxhdCwgc29ydGVkIGFycmF5IG9mIG1hcHBpbmdzLiBUaGUgbWFwcGluZ3MgYXJlIHNvcnRlZCBieVxuICogZ2VuZXJhdGVkIHBvc2l0aW9uLlxuICpcbiAqIFdBUk5JTkc6IFRoaXMgbWV0aG9kIHJldHVybnMgaW50ZXJuYWwgZGF0YSB3aXRob3V0IGNvcHlpbmcsIGZvclxuICogcGVyZm9ybWFuY2UuIFRoZSByZXR1cm4gdmFsdWUgbXVzdCBOT1QgYmUgbXV0YXRlZCwgYW5kIHNob3VsZCBiZSB0cmVhdGVkIGFzXG4gKiBhbiBpbW11dGFibGUgYm9ycm93LiBJZiB5b3Ugd2FudCB0byB0YWtlIG93bmVyc2hpcCwgeW91IG11c3QgbWFrZSB5b3VyIG93blxuICogY29weS5cbiAqL1xuTWFwcGluZ0xpc3QucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiBNYXBwaW5nTGlzdF90b0FycmF5KCkge1xuICBpZiAoIXRoaXMuX3NvcnRlZCkge1xuICAgIHRoaXMuX2FycmF5LnNvcnQodXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZCk7XG4gICAgdGhpcy5fc29ydGVkID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdGhpcy5fYXJyYXk7XG59O1xuXG5leHBvcnRzLk1hcHBpbmdMaXN0ID0gTWFwcGluZ0xpc3Q7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbi8vIEl0IHR1cm5zIG91dCB0aGF0IHNvbWUgKG1vc3Q/KSBKYXZhU2NyaXB0IGVuZ2luZXMgZG9uJ3Qgc2VsZi1ob3N0XG4vLyBgQXJyYXkucHJvdG90eXBlLnNvcnRgLiBUaGlzIG1ha2VzIHNlbnNlIGJlY2F1c2UgQysrIHdpbGwgbGlrZWx5IHJlbWFpblxuLy8gZmFzdGVyIHRoYW4gSlMgd2hlbiBkb2luZyByYXcgQ1BVLWludGVuc2l2ZSBzb3J0aW5nLiBIb3dldmVyLCB3aGVuIHVzaW5nIGFcbi8vIGN1c3RvbSBjb21wYXJhdG9yIGZ1bmN0aW9uLCBjYWxsaW5nIGJhY2sgYW5kIGZvcnRoIGJldHdlZW4gdGhlIFZNJ3MgQysrIGFuZFxuLy8gSklUJ2QgSlMgaXMgcmF0aGVyIHNsb3cgKmFuZCogbG9zZXMgSklUIHR5cGUgaW5mb3JtYXRpb24sIHJlc3VsdGluZyBpblxuLy8gd29yc2UgZ2VuZXJhdGVkIGNvZGUgZm9yIHRoZSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRoYW4gd291bGQgYmUgb3B0aW1hbC4gSW5cbi8vIGZhY3QsIHdoZW4gc29ydGluZyB3aXRoIGEgY29tcGFyYXRvciwgdGhlc2UgY29zdHMgb3V0d2VpZ2ggdGhlIGJlbmVmaXRzIG9mXG4vLyBzb3J0aW5nIGluIEMrKy4gQnkgdXNpbmcgb3VyIG93biBKUy1pbXBsZW1lbnRlZCBRdWljayBTb3J0IChiZWxvdyksIHdlIGdldFxuLy8gYSB+MzUwMG1zIG1lYW4gc3BlZWQtdXAgaW4gYGJlbmNoL2JlbmNoLmh0bWxgLlxuXG4vKipcbiAqIFN3YXAgdGhlIGVsZW1lbnRzIGluZGV4ZWQgYnkgYHhgIGFuZCBgeWAgaW4gdGhlIGFycmF5IGBhcnlgLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyeVxuICogICAgICAgIFRoZSBhcnJheS5cbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiAgICAgICAgVGhlIGluZGV4IG9mIHRoZSBmaXJzdCBpdGVtLlxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqICAgICAgICBUaGUgaW5kZXggb2YgdGhlIHNlY29uZCBpdGVtLlxuICovXG5mdW5jdGlvbiBzd2FwKGFyeSwgeCwgeSkge1xuICB2YXIgdGVtcCA9IGFyeVt4XTtcbiAgYXJ5W3hdID0gYXJ5W3ldO1xuICBhcnlbeV0gPSB0ZW1wO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSByYW5kb20gaW50ZWdlciB3aXRoaW4gdGhlIHJhbmdlIGBsb3cgLi4gaGlnaGAgaW5jbHVzaXZlLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBsb3dcbiAqICAgICAgICBUaGUgbG93ZXIgYm91bmQgb24gdGhlIHJhbmdlLlxuICogQHBhcmFtIHtOdW1iZXJ9IGhpZ2hcbiAqICAgICAgICBUaGUgdXBwZXIgYm91bmQgb24gdGhlIHJhbmdlLlxuICovXG5mdW5jdGlvbiByYW5kb21JbnRJblJhbmdlKGxvdywgaGlnaCkge1xuICByZXR1cm4gTWF0aC5yb3VuZChsb3cgKyAoTWF0aC5yYW5kb20oKSAqIChoaWdoIC0gbG93KSkpO1xufVxuXG4vKipcbiAqIFRoZSBRdWljayBTb3J0IGFsZ29yaXRobS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnlcbiAqICAgICAgICBBbiBhcnJheSB0byBzb3J0LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyYXRvclxuICogICAgICAgIEZ1bmN0aW9uIHRvIHVzZSB0byBjb21wYXJlIHR3byBpdGVtcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBwXG4gKiAgICAgICAgU3RhcnQgaW5kZXggb2YgdGhlIGFycmF5XG4gKiBAcGFyYW0ge051bWJlcn0gclxuICogICAgICAgIEVuZCBpbmRleCBvZiB0aGUgYXJyYXlcbiAqL1xuZnVuY3Rpb24gZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCBwLCByKSB7XG4gIC8vIElmIG91ciBsb3dlciBib3VuZCBpcyBsZXNzIHRoYW4gb3VyIHVwcGVyIGJvdW5kLCB3ZSAoMSkgcGFydGl0aW9uIHRoZVxuICAvLyBhcnJheSBpbnRvIHR3byBwaWVjZXMgYW5kICgyKSByZWN1cnNlIG9uIGVhY2ggaGFsZi4gSWYgaXQgaXMgbm90LCB0aGlzIGlzXG4gIC8vIHRoZSBlbXB0eSBhcnJheSBhbmQgb3VyIGJhc2UgY2FzZS5cblxuICBpZiAocCA8IHIpIHtcbiAgICAvLyAoMSkgUGFydGl0aW9uaW5nLlxuICAgIC8vXG4gICAgLy8gVGhlIHBhcnRpdGlvbmluZyBjaG9vc2VzIGEgcGl2b3QgYmV0d2VlbiBgcGAgYW5kIGByYCBhbmQgbW92ZXMgYWxsXG4gICAgLy8gZWxlbWVudHMgdGhhdCBhcmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwaXZvdCB0byB0aGUgYmVmb3JlIGl0LCBhbmRcbiAgICAvLyBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgYXJlIGdyZWF0ZXIgdGhhbiBpdCBhZnRlciBpdC4gVGhlIGVmZmVjdCBpcyB0aGF0XG4gICAgLy8gb25jZSBwYXJ0aXRpb24gaXMgZG9uZSwgdGhlIHBpdm90IGlzIGluIHRoZSBleGFjdCBwbGFjZSBpdCB3aWxsIGJlIHdoZW5cbiAgICAvLyB0aGUgYXJyYXkgaXMgcHV0IGluIHNvcnRlZCBvcmRlciwgYW5kIGl0IHdpbGwgbm90IG5lZWQgdG8gYmUgbW92ZWRcbiAgICAvLyBhZ2Fpbi4gVGhpcyBydW5zIGluIE8obikgdGltZS5cblxuICAgIC8vIEFsd2F5cyBjaG9vc2UgYSByYW5kb20gcGl2b3Qgc28gdGhhdCBhbiBpbnB1dCBhcnJheSB3aGljaCBpcyByZXZlcnNlXG4gICAgLy8gc29ydGVkIGRvZXMgbm90IGNhdXNlIE8obl4yKSBydW5uaW5nIHRpbWUuXG4gICAgdmFyIHBpdm90SW5kZXggPSByYW5kb21JbnRJblJhbmdlKHAsIHIpO1xuICAgIHZhciBpID0gcCAtIDE7XG5cbiAgICBzd2FwKGFyeSwgcGl2b3RJbmRleCwgcik7XG4gICAgdmFyIHBpdm90ID0gYXJ5W3JdO1xuXG4gICAgLy8gSW1tZWRpYXRlbHkgYWZ0ZXIgYGpgIGlzIGluY3JlbWVudGVkIGluIHRoaXMgbG9vcCwgdGhlIGZvbGxvd2luZyBob2xkXG4gICAgLy8gdHJ1ZTpcbiAgICAvL1xuICAgIC8vICAgKiBFdmVyeSBlbGVtZW50IGluIGBhcnlbcCAuLiBpXWAgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwaXZvdC5cbiAgICAvL1xuICAgIC8vICAgKiBFdmVyeSBlbGVtZW50IGluIGBhcnlbaSsxIC4uIGotMV1gIGlzIGdyZWF0ZXIgdGhhbiB0aGUgcGl2b3QuXG4gICAgZm9yICh2YXIgaiA9IHA7IGogPCByOyBqKyspIHtcbiAgICAgIGlmIChjb21wYXJhdG9yKGFyeVtqXSwgcGl2b3QpIDw9IDApIHtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBzd2FwKGFyeSwgaSwgaik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3dhcChhcnksIGkgKyAxLCBqKTtcbiAgICB2YXIgcSA9IGkgKyAxO1xuXG4gICAgLy8gKDIpIFJlY3Vyc2Ugb24gZWFjaCBoYWxmLlxuXG4gICAgZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCBwLCBxIC0gMSk7XG4gICAgZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCBxICsgMSwgcik7XG4gIH1cbn1cblxuLyoqXG4gKiBTb3J0IHRoZSBnaXZlbiBhcnJheSBpbi1wbGFjZSB3aXRoIHRoZSBnaXZlbiBjb21wYXJhdG9yIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyeVxuICogICAgICAgIEFuIGFycmF5IHRvIHNvcnQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJhdG9yXG4gKiAgICAgICAgRnVuY3Rpb24gdG8gdXNlIHRvIGNvbXBhcmUgdHdvIGl0ZW1zLlxuICovXG5leHBvcnRzLnF1aWNrU29ydCA9IGZ1bmN0aW9uIChhcnksIGNvbXBhcmF0b3IpIHtcbiAgZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCAwLCBhcnkubGVuZ3RoIC0gMSk7XG59O1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGJpbmFyeVNlYXJjaCA9IHJlcXVpcmUoJy4vYmluYXJ5LXNlYXJjaCcpO1xudmFyIEFycmF5U2V0ID0gcmVxdWlyZSgnLi9hcnJheS1zZXQnKS5BcnJheVNldDtcbnZhciBiYXNlNjRWTFEgPSByZXF1aXJlKCcuL2Jhc2U2NC12bHEnKTtcbnZhciBxdWlja1NvcnQgPSByZXF1aXJlKCcuL3F1aWNrLXNvcnQnKS5xdWlja1NvcnQ7XG5cbmZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyKGFTb3VyY2VNYXApIHtcbiAgdmFyIHNvdXJjZU1hcCA9IGFTb3VyY2VNYXA7XG4gIGlmICh0eXBlb2YgYVNvdXJjZU1hcCA9PT0gJ3N0cmluZycpIHtcbiAgICBzb3VyY2VNYXAgPSBKU09OLnBhcnNlKGFTb3VyY2VNYXAucmVwbGFjZSgvXlxcKVxcXVxcfScvLCAnJykpO1xuICB9XG5cbiAgcmV0dXJuIHNvdXJjZU1hcC5zZWN0aW9ucyAhPSBudWxsXG4gICAgPyBuZXcgSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcClcbiAgICA6IG5ldyBCYXNpY1NvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcCk7XG59XG5cblNvdXJjZU1hcENvbnN1bWVyLmZyb21Tb3VyY2VNYXAgPSBmdW5jdGlvbihhU291cmNlTWFwKSB7XG4gIHJldHVybiBCYXNpY1NvdXJjZU1hcENvbnN1bWVyLmZyb21Tb3VyY2VNYXAoYVNvdXJjZU1hcCk7XG59XG5cbi8qKlxuICogVGhlIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXBwaW5nIHNwZWMgdGhhdCB3ZSBhcmUgY29uc3VtaW5nLlxuICovXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX3ZlcnNpb24gPSAzO1xuXG4vLyBgX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kIGBfX29yaWdpbmFsTWFwcGluZ3NgIGFyZSBhcnJheXMgdGhhdCBob2xkIHRoZVxuLy8gcGFyc2VkIG1hcHBpbmcgY29vcmRpbmF0ZXMgZnJvbSB0aGUgc291cmNlIG1hcCdzIFwibWFwcGluZ3NcIiBhdHRyaWJ1dGUuIFRoZXlcbi8vIGFyZSBsYXppbHkgaW5zdGFudGlhdGVkLCBhY2Nlc3NlZCB2aWEgdGhlIGBfZ2VuZXJhdGVkTWFwcGluZ3NgIGFuZFxuLy8gYF9vcmlnaW5hbE1hcHBpbmdzYCBnZXR0ZXJzIHJlc3BlY3RpdmVseSwgYW5kIHdlIG9ubHkgcGFyc2UgdGhlIG1hcHBpbmdzXG4vLyBhbmQgY3JlYXRlIHRoZXNlIGFycmF5cyBvbmNlIHF1ZXJpZWQgZm9yIGEgc291cmNlIGxvY2F0aW9uLiBXZSBqdW1wIHRocm91Z2hcbi8vIHRoZXNlIGhvb3BzIGJlY2F1c2UgdGhlcmUgY2FuIGJlIG1hbnkgdGhvdXNhbmRzIG9mIG1hcHBpbmdzLCBhbmQgcGFyc2luZ1xuLy8gdGhlbSBpcyBleHBlbnNpdmUsIHNvIHdlIG9ubHkgd2FudCB0byBkbyBpdCBpZiB3ZSBtdXN0LlxuLy9cbi8vIEVhY2ggb2JqZWN0IGluIHRoZSBhcnJheXMgaXMgb2YgdGhlIGZvcm06XG4vL1xuLy8gICAgIHtcbi8vICAgICAgIGdlbmVyYXRlZExpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIGNvZGUsXG4vLyAgICAgICBnZW5lcmF0ZWRDb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgY29kZSxcbi8vICAgICAgIHNvdXJjZTogVGhlIHBhdGggdG8gdGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlIHRoYXQgZ2VuZXJhdGVkIHRoaXNcbi8vICAgICAgICAgICAgICAgY2h1bmsgb2YgY29kZSxcbi8vICAgICAgIG9yaWdpbmFsTGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UgdGhhdFxuLy8gICAgICAgICAgICAgICAgICAgICBjb3JyZXNwb25kcyB0byB0aGlzIGNodW5rIG9mIGdlbmVyYXRlZCBjb2RlLFxuLy8gICAgICAgb3JpZ2luYWxDb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UgdGhhdFxuLy8gICAgICAgICAgICAgICAgICAgICAgIGNvcnJlc3BvbmRzIHRvIHRoaXMgY2h1bmsgb2YgZ2VuZXJhdGVkIGNvZGUsXG4vLyAgICAgICBuYW1lOiBUaGUgbmFtZSBvZiB0aGUgb3JpZ2luYWwgc3ltYm9sIHdoaWNoIGdlbmVyYXRlZCB0aGlzIGNodW5rIG9mXG4vLyAgICAgICAgICAgICBjb2RlLlxuLy8gICAgIH1cbi8vXG4vLyBBbGwgcHJvcGVydGllcyBleGNlcHQgZm9yIGBnZW5lcmF0ZWRMaW5lYCBhbmQgYGdlbmVyYXRlZENvbHVtbmAgY2FuIGJlXG4vLyBgbnVsbGAuXG4vL1xuLy8gYF9nZW5lcmF0ZWRNYXBwaW5nc2AgaXMgb3JkZXJlZCBieSB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9ucy5cbi8vXG4vLyBgX29yaWdpbmFsTWFwcGluZ3NgIGlzIG9yZGVyZWQgYnkgdGhlIG9yaWdpbmFsIHBvc2l0aW9ucy5cblxuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9fZ2VuZXJhdGVkTWFwcGluZ3MgPSBudWxsO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSwgJ19nZW5lcmF0ZWRNYXBwaW5ncycsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MpIHtcbiAgICAgIHRoaXMuX3BhcnNlTWFwcGluZ3ModGhpcy5fbWFwcGluZ3MsIHRoaXMuc291cmNlUm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncztcbiAgfVxufSk7XG5cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fX29yaWdpbmFsTWFwcGluZ3MgPSBudWxsO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSwgJ19vcmlnaW5hbE1hcHBpbmdzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX19vcmlnaW5hbE1hcHBpbmdzKSB7XG4gICAgICB0aGlzLl9wYXJzZU1hcHBpbmdzKHRoaXMuX21hcHBpbmdzLCB0aGlzLnNvdXJjZVJvb3QpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncztcbiAgfVxufSk7XG5cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fY2hhcklzTWFwcGluZ1NlcGFyYXRvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2NoYXJJc01hcHBpbmdTZXBhcmF0b3IoYVN0ciwgaW5kZXgpIHtcbiAgICB2YXIgYyA9IGFTdHIuY2hhckF0KGluZGV4KTtcbiAgICByZXR1cm4gYyA9PT0gXCI7XCIgfHwgYyA9PT0gXCIsXCI7XG4gIH07XG5cbi8qKlxuICogUGFyc2UgdGhlIG1hcHBpbmdzIGluIGEgc3RyaW5nIGluIHRvIGEgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggd2UgY2FuIGVhc2lseVxuICogcXVlcnkgKHRoZSBvcmRlcmVkIGFycmF5cyBpbiB0aGUgYHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4gKiBgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3NgIHByb3BlcnRpZXMpLlxuICovXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX3BhcnNlTWFwcGluZ3MgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9wYXJzZU1hcHBpbmdzKGFTdHIsIGFTb3VyY2VSb290KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU3ViY2xhc3NlcyBtdXN0IGltcGxlbWVudCBfcGFyc2VNYXBwaW5nc1wiKTtcbiAgfTtcblxuU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSID0gMTtcblNvdXJjZU1hcENvbnN1bWVyLk9SSUdJTkFMX09SREVSID0gMjtcblxuU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQgPSAxO1xuU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQgPSAyO1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBlYWNoIG1hcHBpbmcgYmV0d2VlbiBhbiBvcmlnaW5hbCBzb3VyY2UvbGluZS9jb2x1bW4gYW5kIGFcbiAqIGdlbmVyYXRlZCBsaW5lL2NvbHVtbiBpbiB0aGlzIHNvdXJjZSBtYXAuXG4gKlxuICogQHBhcmFtIEZ1bmN0aW9uIGFDYWxsYmFja1xuICogICAgICAgIFRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aXRoIGVhY2ggbWFwcGluZy5cbiAqIEBwYXJhbSBPYmplY3QgYUNvbnRleHRcbiAqICAgICAgICBPcHRpb25hbC4gSWYgc3BlY2lmaWVkLCB0aGlzIG9iamVjdCB3aWxsIGJlIHRoZSB2YWx1ZSBvZiBgdGhpc2AgZXZlcnlcbiAqICAgICAgICB0aW1lIHRoYXQgYGFDYWxsYmFja2AgaXMgY2FsbGVkLlxuICogQHBhcmFtIGFPcmRlclxuICogICAgICAgIEVpdGhlciBgU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSYCBvclxuICogICAgICAgIGBTb3VyY2VNYXBDb25zdW1lci5PUklHSU5BTF9PUkRFUmAuIFNwZWNpZmllcyB3aGV0aGVyIHlvdSB3YW50IHRvXG4gKiAgICAgICAgaXRlcmF0ZSBvdmVyIHRoZSBtYXBwaW5ncyBzb3J0ZWQgYnkgdGhlIGdlbmVyYXRlZCBmaWxlJ3MgbGluZS9jb2x1bW5cbiAqICAgICAgICBvcmRlciBvciB0aGUgb3JpZ2luYWwncyBzb3VyY2UvbGluZS9jb2x1bW4gb3JkZXIsIHJlc3BlY3RpdmVseS4gRGVmYXVsdHMgdG9cbiAqICAgICAgICBgU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSYC5cbiAqL1xuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmVhY2hNYXBwaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfZWFjaE1hcHBpbmcoYUNhbGxiYWNrLCBhQ29udGV4dCwgYU9yZGVyKSB7XG4gICAgdmFyIGNvbnRleHQgPSBhQ29udGV4dCB8fCBudWxsO1xuICAgIHZhciBvcmRlciA9IGFPcmRlciB8fCBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVI7XG5cbiAgICB2YXIgbWFwcGluZ3M7XG4gICAgc3dpdGNoIChvcmRlcikge1xuICAgIGNhc2UgU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSOlxuICAgICAgbWFwcGluZ3MgPSB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU291cmNlTWFwQ29uc3VtZXIuT1JJR0lOQUxfT1JERVI6XG4gICAgICBtYXBwaW5ncyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3M7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBvcmRlciBvZiBpdGVyYXRpb24uXCIpO1xuICAgIH1cblxuICAgIHZhciBzb3VyY2VSb290ID0gdGhpcy5zb3VyY2VSb290O1xuICAgIG1hcHBpbmdzLm1hcChmdW5jdGlvbiAobWFwcGluZykge1xuICAgICAgdmFyIHNvdXJjZSA9IG1hcHBpbmcuc291cmNlID09PSBudWxsID8gbnVsbCA6IHRoaXMuX3NvdXJjZXMuYXQobWFwcGluZy5zb3VyY2UpO1xuICAgICAgaWYgKHNvdXJjZSAhPSBudWxsICYmIHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICBzb3VyY2UgPSB1dGlsLmpvaW4oc291cmNlUm9vdCwgc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICBnZW5lcmF0ZWRMaW5lOiBtYXBwaW5nLmdlbmVyYXRlZExpbmUsXG4gICAgICAgIGdlbmVyYXRlZENvbHVtbjogbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4sXG4gICAgICAgIG9yaWdpbmFsTGluZTogbWFwcGluZy5vcmlnaW5hbExpbmUsXG4gICAgICAgIG9yaWdpbmFsQ29sdW1uOiBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uLFxuICAgICAgICBuYW1lOiBtYXBwaW5nLm5hbWUgPT09IG51bGwgPyBudWxsIDogdGhpcy5fbmFtZXMuYXQobWFwcGluZy5uYW1lKVxuICAgICAgfTtcbiAgICB9LCB0aGlzKS5mb3JFYWNoKGFDYWxsYmFjaywgY29udGV4dCk7XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyBhbGwgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIG9yaWdpbmFsIHNvdXJjZSxcbiAqIGxpbmUsIGFuZCBjb2x1bW4gcHJvdmlkZWQuIElmIG5vIGNvbHVtbiBpcyBwcm92aWRlZCwgcmV0dXJucyBhbGwgbWFwcGluZ3NcbiAqIGNvcnJlc3BvbmRpbmcgdG8gYSBlaXRoZXIgdGhlIGxpbmUgd2UgYXJlIHNlYXJjaGluZyBmb3Igb3IgdGhlIG5leHRcbiAqIGNsb3Nlc3QgbGluZSB0aGF0IGhhcyBhbnkgbWFwcGluZ3MuIE90aGVyd2lzZSwgcmV0dXJucyBhbGwgbWFwcGluZ3NcbiAqIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIGxpbmUgYW5kIGVpdGhlciB0aGUgY29sdW1uIHdlIGFyZSBzZWFyY2hpbmcgZm9yXG4gKiBvciB0aGUgbmV4dCBjbG9zZXN0IGNvbHVtbiB0aGF0IGhhcyBhbnkgb2Zmc2V0cy5cbiAqXG4gKiBUaGUgb25seSBhcmd1bWVudCBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIGZpbGVuYW1lIG9mIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gY29sdW1uOiBPcHRpb25hbC4gdGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqXG4gKiBhbmQgYW4gYXJyYXkgb2Ygb2JqZWN0cyBpcyByZXR1cm5lZCwgZWFjaCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuXG4gKi9cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5hbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3IgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9hbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3IoYUFyZ3MpIHtcbiAgICB2YXIgbGluZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbGluZScpO1xuXG4gICAgLy8gV2hlbiB0aGVyZSBpcyBubyBleGFjdCBtYXRjaCwgQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX2ZpbmRNYXBwaW5nXG4gICAgLy8gcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGNsb3Nlc3QgbWFwcGluZyBsZXNzIHRoYW4gdGhlIG5lZWRsZS4gQnlcbiAgICAvLyBzZXR0aW5nIG5lZWRsZS5vcmlnaW5hbENvbHVtbiB0byAwLCB3ZSB0aHVzIGZpbmQgdGhlIGxhc3QgbWFwcGluZyBmb3JcbiAgICAvLyB0aGUgZ2l2ZW4gbGluZSwgcHJvdmlkZWQgc3VjaCBhIG1hcHBpbmcgZXhpc3RzLlxuICAgIHZhciBuZWVkbGUgPSB7XG4gICAgICBzb3VyY2U6IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJyksXG4gICAgICBvcmlnaW5hbExpbmU6IGxpbmUsXG4gICAgICBvcmlnaW5hbENvbHVtbjogdXRpbC5nZXRBcmcoYUFyZ3MsICdjb2x1bW4nLCAwKVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIG5lZWRsZS5zb3VyY2UgPSB1dGlsLnJlbGF0aXZlKHRoaXMuc291cmNlUm9vdCwgbmVlZGxlLnNvdXJjZSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fc291cmNlcy5oYXMobmVlZGxlLnNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgbmVlZGxlLnNvdXJjZSA9IHRoaXMuX3NvdXJjZXMuaW5kZXhPZihuZWVkbGUuc291cmNlKTtcblxuICAgIHZhciBtYXBwaW5ncyA9IFtdO1xuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZE1hcHBpbmcobmVlZGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsTWFwcGluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvcmlnaW5hbExpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9yaWdpbmFsQ29sdW1uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbC5jb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5hcnlTZWFyY2guTEVBU1RfVVBQRVJfQk9VTkQpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICBpZiAoYUFyZ3MuY29sdW1uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsTGluZSA9IG1hcHBpbmcub3JpZ2luYWxMaW5lO1xuXG4gICAgICAgIC8vIEl0ZXJhdGUgdW50aWwgZWl0aGVyIHdlIHJ1biBvdXQgb2YgbWFwcGluZ3MsIG9yIHdlIHJ1biBpbnRvXG4gICAgICAgIC8vIGEgbWFwcGluZyBmb3IgYSBkaWZmZXJlbnQgbGluZSB0aGFuIHRoZSBvbmUgd2UgZm91bmQuIFNpbmNlXG4gICAgICAgIC8vIG1hcHBpbmdzIGFyZSBzb3J0ZWQsIHRoaXMgaXMgZ3VhcmFudGVlZCB0byBmaW5kIGFsbCBtYXBwaW5ncyBmb3JcbiAgICAgICAgLy8gdGhlIGxpbmUgd2UgZm91bmQuXG4gICAgICAgIHdoaWxlIChtYXBwaW5nICYmIG1hcHBpbmcub3JpZ2luYWxMaW5lID09PSBvcmlnaW5hbExpbmUpIHtcbiAgICAgICAgICBtYXBwaW5ncy5wdXNoKHtcbiAgICAgICAgICAgIGxpbmU6IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRMaW5lJywgbnVsbCksXG4gICAgICAgICAgICBjb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICAgIGxhc3RDb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdsYXN0R2VuZXJhdGVkQ29sdW1uJywgbnVsbClcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG1hcHBpbmcgPSB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzWysraW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgb3JpZ2luYWxDb2x1bW4gPSBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uO1xuXG4gICAgICAgIC8vIEl0ZXJhdGUgdW50aWwgZWl0aGVyIHdlIHJ1biBvdXQgb2YgbWFwcGluZ3MsIG9yIHdlIHJ1biBpbnRvXG4gICAgICAgIC8vIGEgbWFwcGluZyBmb3IgYSBkaWZmZXJlbnQgbGluZSB0aGFuIHRoZSBvbmUgd2Ugd2VyZSBzZWFyY2hpbmcgZm9yLlxuICAgICAgICAvLyBTaW5jZSBtYXBwaW5ncyBhcmUgc29ydGVkLCB0aGlzIGlzIGd1YXJhbnRlZWQgdG8gZmluZCBhbGwgbWFwcGluZ3MgZm9yXG4gICAgICAgIC8vIHRoZSBsaW5lIHdlIGFyZSBzZWFyY2hpbmcgZm9yLlxuICAgICAgICB3aGlsZSAobWFwcGluZyAmJlxuICAgICAgICAgICAgICAgbWFwcGluZy5vcmlnaW5hbExpbmUgPT09IGxpbmUgJiZcbiAgICAgICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxDb2x1bW4gPT0gb3JpZ2luYWxDb2x1bW4pIHtcbiAgICAgICAgICBtYXBwaW5ncy5wdXNoKHtcbiAgICAgICAgICAgIGxpbmU6IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRMaW5lJywgbnVsbCksXG4gICAgICAgICAgICBjb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICAgIGxhc3RDb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdsYXN0R2VuZXJhdGVkQ29sdW1uJywgbnVsbClcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG1hcHBpbmcgPSB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzWysraW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcHBpbmdzO1xuICB9O1xuXG5leHBvcnRzLlNvdXJjZU1hcENvbnN1bWVyID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogQSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyIGluc3RhbmNlIHJlcHJlc2VudHMgYSBwYXJzZWQgc291cmNlIG1hcCB3aGljaCB3ZSBjYW5cbiAqIHF1ZXJ5IGZvciBpbmZvcm1hdGlvbiBhYm91dCB0aGUgb3JpZ2luYWwgZmlsZSBwb3NpdGlvbnMgYnkgZ2l2aW5nIGl0IGEgZmlsZVxuICogcG9zaXRpb24gaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuXG4gKlxuICogVGhlIG9ubHkgcGFyYW1ldGVyIGlzIHRoZSByYXcgc291cmNlIG1hcCAoZWl0aGVyIGFzIGEgSlNPTiBzdHJpbmcsIG9yXG4gKiBhbHJlYWR5IHBhcnNlZCB0byBhbiBvYmplY3QpLiBBY2NvcmRpbmcgdG8gdGhlIHNwZWMsIHNvdXJjZSBtYXBzIGhhdmUgdGhlXG4gKiBmb2xsb3dpbmcgYXR0cmlidXRlczpcbiAqXG4gKiAgIC0gdmVyc2lvbjogV2hpY2ggdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcCBzcGVjIHRoaXMgbWFwIGlzIGZvbGxvd2luZy5cbiAqICAgLSBzb3VyY2VzOiBBbiBhcnJheSBvZiBVUkxzIHRvIHRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZXMuXG4gKiAgIC0gbmFtZXM6IEFuIGFycmF5IG9mIGlkZW50aWZpZXJzIHdoaWNoIGNhbiBiZSByZWZlcnJlbmNlZCBieSBpbmRpdmlkdWFsIG1hcHBpbmdzLlxuICogICAtIHNvdXJjZVJvb3Q6IE9wdGlvbmFsLiBUaGUgVVJMIHJvb3QgZnJvbSB3aGljaCBhbGwgc291cmNlcyBhcmUgcmVsYXRpdmUuXG4gKiAgIC0gc291cmNlc0NvbnRlbnQ6IE9wdGlvbmFsLiBBbiBhcnJheSBvZiBjb250ZW50cyBvZiB0aGUgb3JpZ2luYWwgc291cmNlIGZpbGVzLlxuICogICAtIG1hcHBpbmdzOiBBIHN0cmluZyBvZiBiYXNlNjQgVkxRcyB3aGljaCBjb250YWluIHRoZSBhY3R1YWwgbWFwcGluZ3MuXG4gKiAgIC0gZmlsZTogT3B0aW9uYWwuIFRoZSBnZW5lcmF0ZWQgZmlsZSB0aGlzIHNvdXJjZSBtYXAgaXMgYXNzb2NpYXRlZCB3aXRoLlxuICpcbiAqIEhlcmUgaXMgYW4gZXhhbXBsZSBzb3VyY2UgbWFwLCB0YWtlbiBmcm9tIHRoZSBzb3VyY2UgbWFwIHNwZWNbMF06XG4gKlxuICogICAgIHtcbiAqICAgICAgIHZlcnNpb24gOiAzLFxuICogICAgICAgZmlsZTogXCJvdXQuanNcIixcbiAqICAgICAgIHNvdXJjZVJvb3QgOiBcIlwiLFxuICogICAgICAgc291cmNlczogW1wiZm9vLmpzXCIsIFwiYmFyLmpzXCJdLFxuICogICAgICAgbmFtZXM6IFtcInNyY1wiLCBcIm1hcHNcIiwgXCJhcmVcIiwgXCJmdW5cIl0sXG4gKiAgICAgICBtYXBwaW5nczogXCJBQSxBQjs7QUJDREU7XCJcbiAqICAgICB9XG4gKlxuICogWzBdOiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9kb2N1bWVudC9kLzFVMVJHQWVoUXdSeXBVVG92RjFLUmxwaU9GemUwYi1fMmdjNmZBSDBLWTBrL2VkaXQ/cGxpPTEjXG4gKi9cbmZ1bmN0aW9uIEJhc2ljU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IEpTT04ucGFyc2UoYVNvdXJjZU1hcC5yZXBsYWNlKC9eXFwpXFxdXFx9Jy8sICcnKSk7XG4gIH1cblxuICB2YXIgdmVyc2lvbiA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3ZlcnNpb24nKTtcbiAgdmFyIHNvdXJjZXMgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdzb3VyY2VzJyk7XG4gIC8vIFNhc3MgMy4zIGxlYXZlcyBvdXQgdGhlICduYW1lcycgYXJyYXksIHNvIHdlIGRldmlhdGUgZnJvbSB0aGUgc3BlYyAod2hpY2hcbiAgLy8gcmVxdWlyZXMgdGhlIGFycmF5KSB0byBwbGF5IG5pY2UgaGVyZS5cbiAgdmFyIG5hbWVzID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnbmFtZXMnLCBbXSk7XG4gIHZhciBzb3VyY2VSb290ID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnc291cmNlUm9vdCcsIG51bGwpO1xuICB2YXIgc291cmNlc0NvbnRlbnQgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdzb3VyY2VzQ29udGVudCcsIG51bGwpO1xuICB2YXIgbWFwcGluZ3MgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdtYXBwaW5ncycpO1xuICB2YXIgZmlsZSA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ2ZpbGUnLCBudWxsKTtcblxuICAvLyBPbmNlIGFnYWluLCBTYXNzIGRldmlhdGVzIGZyb20gdGhlIHNwZWMgYW5kIHN1cHBsaWVzIHRoZSB2ZXJzaW9uIGFzIGFcbiAgLy8gc3RyaW5nIHJhdGhlciB0aGFuIGEgbnVtYmVyLCBzbyB3ZSB1c2UgbG9vc2UgZXF1YWxpdHkgY2hlY2tpbmcgaGVyZS5cbiAgaWYgKHZlcnNpb24gIT0gdGhpcy5fdmVyc2lvbikge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgdmVyc2lvbjogJyArIHZlcnNpb24pO1xuICB9XG5cbiAgc291cmNlcyA9IHNvdXJjZXNcbiAgICAubWFwKFN0cmluZylcbiAgICAvLyBTb21lIHNvdXJjZSBtYXBzIHByb2R1Y2UgcmVsYXRpdmUgc291cmNlIHBhdGhzIGxpa2UgXCIuL2Zvby5qc1wiIGluc3RlYWQgb2ZcbiAgICAvLyBcImZvby5qc1wiLiAgTm9ybWFsaXplIHRoZXNlIGZpcnN0IHNvIHRoYXQgZnV0dXJlIGNvbXBhcmlzb25zIHdpbGwgc3VjY2VlZC5cbiAgICAvLyBTZWUgYnVnemlsLmxhLzEwOTA3NjguXG4gICAgLm1hcCh1dGlsLm5vcm1hbGl6ZSlcbiAgICAvLyBBbHdheXMgZW5zdXJlIHRoYXQgYWJzb2x1dGUgc291cmNlcyBhcmUgaW50ZXJuYWxseSBzdG9yZWQgcmVsYXRpdmUgdG9cbiAgICAvLyB0aGUgc291cmNlIHJvb3QsIGlmIHRoZSBzb3VyY2Ugcm9vdCBpcyBhYnNvbHV0ZS4gTm90IGRvaW5nIHRoaXMgd291bGRcbiAgICAvLyBiZSBwYXJ0aWN1bGFybHkgcHJvYmxlbWF0aWMgd2hlbiB0aGUgc291cmNlIHJvb3QgaXMgYSBwcmVmaXggb2YgdGhlXG4gICAgLy8gc291cmNlICh2YWxpZCwgYnV0IHdoeT8/KS4gU2VlIGdpdGh1YiBpc3N1ZSAjMTk5IGFuZCBidWd6aWwubGEvMTE4ODk4Mi5cbiAgICAubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBzb3VyY2VSb290ICYmIHV0aWwuaXNBYnNvbHV0ZShzb3VyY2VSb290KSAmJiB1dGlsLmlzQWJzb2x1dGUoc291cmNlKVxuICAgICAgICA/IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlKVxuICAgICAgICA6IHNvdXJjZTtcbiAgICB9KTtcblxuICAvLyBQYXNzIGB0cnVlYCBiZWxvdyB0byBhbGxvdyBkdXBsaWNhdGUgbmFtZXMgYW5kIHNvdXJjZXMuIFdoaWxlIHNvdXJjZSBtYXBzXG4gIC8vIGFyZSBpbnRlbmRlZCB0byBiZSBjb21wcmVzc2VkIGFuZCBkZWR1cGxpY2F0ZWQsIHRoZSBUeXBlU2NyaXB0IGNvbXBpbGVyXG4gIC8vIHNvbWV0aW1lcyBnZW5lcmF0ZXMgc291cmNlIG1hcHMgd2l0aCBkdXBsaWNhdGVzIGluIHRoZW0uIFNlZSBHaXRodWIgaXNzdWVcbiAgLy8gIzcyIGFuZCBidWd6aWwubGEvODg5NDkyLlxuICB0aGlzLl9uYW1lcyA9IEFycmF5U2V0LmZyb21BcnJheShuYW1lcy5tYXAoU3RyaW5nKSwgdHJ1ZSk7XG4gIHRoaXMuX3NvdXJjZXMgPSBBcnJheVNldC5mcm9tQXJyYXkoc291cmNlcywgdHJ1ZSk7XG5cbiAgdGhpcy5zb3VyY2VSb290ID0gc291cmNlUm9vdDtcbiAgdGhpcy5zb3VyY2VzQ29udGVudCA9IHNvdXJjZXNDb250ZW50O1xuICB0aGlzLl9tYXBwaW5ncyA9IG1hcHBpbmdzO1xuICB0aGlzLmZpbGUgPSBmaWxlO1xufVxuXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlKTtcbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbnN1bWVyID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogQ3JlYXRlIGEgQmFzaWNTb3VyY2VNYXBDb25zdW1lciBmcm9tIGEgU291cmNlTWFwR2VuZXJhdG9yLlxuICpcbiAqIEBwYXJhbSBTb3VyY2VNYXBHZW5lcmF0b3IgYVNvdXJjZU1hcFxuICogICAgICAgIFRoZSBzb3VyY2UgbWFwIHRoYXQgd2lsbCBiZSBjb25zdW1lZC5cbiAqIEByZXR1cm5zIEJhc2ljU291cmNlTWFwQ29uc3VtZXJcbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5mcm9tU291cmNlTWFwID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfZnJvbVNvdXJjZU1hcChhU291cmNlTWFwKSB7XG4gICAgdmFyIHNtYyA9IE9iamVjdC5jcmVhdGUoQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUpO1xuXG4gICAgdmFyIG5hbWVzID0gc21jLl9uYW1lcyA9IEFycmF5U2V0LmZyb21BcnJheShhU291cmNlTWFwLl9uYW1lcy50b0FycmF5KCksIHRydWUpO1xuICAgIHZhciBzb3VyY2VzID0gc21jLl9zb3VyY2VzID0gQXJyYXlTZXQuZnJvbUFycmF5KGFTb3VyY2VNYXAuX3NvdXJjZXMudG9BcnJheSgpLCB0cnVlKTtcbiAgICBzbWMuc291cmNlUm9vdCA9IGFTb3VyY2VNYXAuX3NvdXJjZVJvb3Q7XG4gICAgc21jLnNvdXJjZXNDb250ZW50ID0gYVNvdXJjZU1hcC5fZ2VuZXJhdGVTb3VyY2VzQ29udGVudChzbWMuX3NvdXJjZXMudG9BcnJheSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc21jLnNvdXJjZVJvb3QpO1xuICAgIHNtYy5maWxlID0gYVNvdXJjZU1hcC5fZmlsZTtcblxuICAgIC8vIEJlY2F1c2Ugd2UgYXJlIG1vZGlmeWluZyB0aGUgZW50cmllcyAoYnkgY29udmVydGluZyBzdHJpbmcgc291cmNlcyBhbmRcbiAgICAvLyBuYW1lcyB0byBpbmRpY2VzIGludG8gdGhlIHNvdXJjZXMgYW5kIG5hbWVzIEFycmF5U2V0cyksIHdlIGhhdmUgdG8gbWFrZVxuICAgIC8vIGEgY29weSBvZiB0aGUgZW50cnkgb3IgZWxzZSBiYWQgdGhpbmdzIGhhcHBlbi4gU2hhcmVkIG11dGFibGUgc3RhdGVcbiAgICAvLyBzdHJpa2VzIGFnYWluISBTZWUgZ2l0aHViIGlzc3VlICMxOTEuXG5cbiAgICB2YXIgZ2VuZXJhdGVkTWFwcGluZ3MgPSBhU291cmNlTWFwLl9tYXBwaW5ncy50b0FycmF5KCkuc2xpY2UoKTtcbiAgICB2YXIgZGVzdEdlbmVyYXRlZE1hcHBpbmdzID0gc21jLl9fZ2VuZXJhdGVkTWFwcGluZ3MgPSBbXTtcbiAgICB2YXIgZGVzdE9yaWdpbmFsTWFwcGluZ3MgPSBzbWMuX19vcmlnaW5hbE1hcHBpbmdzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2VuZXJhdGVkTWFwcGluZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzcmNNYXBwaW5nID0gZ2VuZXJhdGVkTWFwcGluZ3NbaV07XG4gICAgICB2YXIgZGVzdE1hcHBpbmcgPSBuZXcgTWFwcGluZztcbiAgICAgIGRlc3RNYXBwaW5nLmdlbmVyYXRlZExpbmUgPSBzcmNNYXBwaW5nLmdlbmVyYXRlZExpbmU7XG4gICAgICBkZXN0TWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gPSBzcmNNYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcblxuICAgICAgaWYgKHNyY01hcHBpbmcuc291cmNlKSB7XG4gICAgICAgIGRlc3RNYXBwaW5nLnNvdXJjZSA9IHNvdXJjZXMuaW5kZXhPZihzcmNNYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIGRlc3RNYXBwaW5nLm9yaWdpbmFsTGluZSA9IHNyY01hcHBpbmcub3JpZ2luYWxMaW5lO1xuICAgICAgICBkZXN0TWFwcGluZy5vcmlnaW5hbENvbHVtbiA9IHNyY01hcHBpbmcub3JpZ2luYWxDb2x1bW47XG5cbiAgICAgICAgaWYgKHNyY01hcHBpbmcubmFtZSkge1xuICAgICAgICAgIGRlc3RNYXBwaW5nLm5hbWUgPSBuYW1lcy5pbmRleE9mKHNyY01hcHBpbmcubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBkZXN0T3JpZ2luYWxNYXBwaW5ncy5wdXNoKGRlc3RNYXBwaW5nKTtcbiAgICAgIH1cblxuICAgICAgZGVzdEdlbmVyYXRlZE1hcHBpbmdzLnB1c2goZGVzdE1hcHBpbmcpO1xuICAgIH1cblxuICAgIHF1aWNrU29ydChzbWMuX19vcmlnaW5hbE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKTtcblxuICAgIHJldHVybiBzbWM7XG4gIH07XG5cbi8qKlxuICogVGhlIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXBwaW5nIHNwZWMgdGhhdCB3ZSBhcmUgY29uc3VtaW5nLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8qKlxuICogVGhlIGxpc3Qgb2Ygb3JpZ2luYWwgc291cmNlcy5cbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLCAnc291cmNlcycsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZXMudG9BcnJheSgpLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlUm9vdCAhPSBudWxsID8gdXRpbC5qb2luKHRoaXMuc291cmNlUm9vdCwgcykgOiBzO1xuICAgIH0sIHRoaXMpO1xuICB9XG59KTtcblxuLyoqXG4gKiBQcm92aWRlIHRoZSBKSVQgd2l0aCBhIG5pY2Ugc2hhcGUgLyBoaWRkZW4gY2xhc3MuXG4gKi9cbmZ1bmN0aW9uIE1hcHBpbmcoKSB7XG4gIHRoaXMuZ2VuZXJhdGVkTGluZSA9IDA7XG4gIHRoaXMuZ2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgdGhpcy5zb3VyY2UgPSBudWxsO1xuICB0aGlzLm9yaWdpbmFsTGluZSA9IG51bGw7XG4gIHRoaXMub3JpZ2luYWxDb2x1bW4gPSBudWxsO1xuICB0aGlzLm5hbWUgPSBudWxsO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBtYXBwaW5ncyBpbiBhIHN0cmluZyBpbiB0byBhIGRhdGEgc3RydWN0dXJlIHdoaWNoIHdlIGNhbiBlYXNpbHlcbiAqIHF1ZXJ5ICh0aGUgb3JkZXJlZCBhcnJheXMgaW4gdGhlIGB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3NgIGFuZFxuICogYHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzYCBwcm9wZXJ0aWVzKS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX3BhcnNlTWFwcGluZ3MgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9wYXJzZU1hcHBpbmdzKGFTdHIsIGFTb3VyY2VSb290KSB7XG4gICAgdmFyIGdlbmVyYXRlZExpbmUgPSAxO1xuICAgIHZhciBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgdmFyIHByZXZpb3VzT3JpZ2luYWxMaW5lID0gMDtcbiAgICB2YXIgcHJldmlvdXNPcmlnaW5hbENvbHVtbiA9IDA7XG4gICAgdmFyIHByZXZpb3VzU291cmNlID0gMDtcbiAgICB2YXIgcHJldmlvdXNOYW1lID0gMDtcbiAgICB2YXIgbGVuZ3RoID0gYVN0ci5sZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgY2FjaGVkU2VnbWVudHMgPSB7fTtcbiAgICB2YXIgdGVtcCA9IHt9O1xuICAgIHZhciBvcmlnaW5hbE1hcHBpbmdzID0gW107XG4gICAgdmFyIGdlbmVyYXRlZE1hcHBpbmdzID0gW107XG4gICAgdmFyIG1hcHBpbmcsIHN0ciwgc2VnbWVudCwgZW5kLCB2YWx1ZTtcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKGFTdHIuY2hhckF0KGluZGV4KSA9PT0gJzsnKSB7XG4gICAgICAgIGdlbmVyYXRlZExpbmUrKztcbiAgICAgICAgaW5kZXgrKztcbiAgICAgICAgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoYVN0ci5jaGFyQXQoaW5kZXgpID09PSAnLCcpIHtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBtYXBwaW5nID0gbmV3IE1hcHBpbmcoKTtcbiAgICAgICAgbWFwcGluZy5nZW5lcmF0ZWRMaW5lID0gZ2VuZXJhdGVkTGluZTtcblxuICAgICAgICAvLyBCZWNhdXNlIGVhY2ggb2Zmc2V0IGlzIGVuY29kZWQgcmVsYXRpdmUgdG8gdGhlIHByZXZpb3VzIG9uZSxcbiAgICAgICAgLy8gbWFueSBzZWdtZW50cyBvZnRlbiBoYXZlIHRoZSBzYW1lIGVuY29kaW5nLiBXZSBjYW4gZXhwbG9pdCB0aGlzXG4gICAgICAgIC8vIGZhY3QgYnkgY2FjaGluZyB0aGUgcGFyc2VkIHZhcmlhYmxlIGxlbmd0aCBmaWVsZHMgb2YgZWFjaCBzZWdtZW50LFxuICAgICAgICAvLyBhbGxvd2luZyB1cyB0byBhdm9pZCBhIHNlY29uZCBwYXJzZSBpZiB3ZSBlbmNvdW50ZXIgdGhlIHNhbWVcbiAgICAgICAgLy8gc2VnbWVudCBhZ2Fpbi5cbiAgICAgICAgZm9yIChlbmQgPSBpbmRleDsgZW5kIDwgbGVuZ3RoOyBlbmQrKykge1xuICAgICAgICAgIGlmICh0aGlzLl9jaGFySXNNYXBwaW5nU2VwYXJhdG9yKGFTdHIsIGVuZCkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdHIgPSBhU3RyLnNsaWNlKGluZGV4LCBlbmQpO1xuXG4gICAgICAgIHNlZ21lbnQgPSBjYWNoZWRTZWdtZW50c1tzdHJdO1xuICAgICAgICBpZiAoc2VnbWVudCkge1xuICAgICAgICAgIGluZGV4ICs9IHN0ci5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VnbWVudCA9IFtdO1xuICAgICAgICAgIHdoaWxlIChpbmRleCA8IGVuZCkge1xuICAgICAgICAgICAgYmFzZTY0VkxRLmRlY29kZShhU3RyLCBpbmRleCwgdGVtcCk7XG4gICAgICAgICAgICB2YWx1ZSA9IHRlbXAudmFsdWU7XG4gICAgICAgICAgICBpbmRleCA9IHRlbXAucmVzdDtcbiAgICAgICAgICAgIHNlZ21lbnQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlZ21lbnQubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIGEgc291cmNlLCBidXQgbm8gbGluZSBhbmQgY29sdW1uJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlZ21lbnQubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIGEgc291cmNlIGFuZCBsaW5lLCBidXQgbm8gY29sdW1uJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2FjaGVkU2VnbWVudHNbc3RyXSA9IHNlZ21lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHZW5lcmF0ZWQgY29sdW1uLlxuICAgICAgICBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbiA9IHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uICsgc2VnbWVudFswXTtcbiAgICAgICAgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcblxuICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgLy8gT3JpZ2luYWwgc291cmNlLlxuICAgICAgICAgIG1hcHBpbmcuc291cmNlID0gcHJldmlvdXNTb3VyY2UgKyBzZWdtZW50WzFdO1xuICAgICAgICAgIHByZXZpb3VzU291cmNlICs9IHNlZ21lbnRbMV07XG5cbiAgICAgICAgICAvLyBPcmlnaW5hbCBsaW5lLlxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxMaW5lID0gcHJldmlvdXNPcmlnaW5hbExpbmUgKyBzZWdtZW50WzJdO1xuICAgICAgICAgIHByZXZpb3VzT3JpZ2luYWxMaW5lID0gbWFwcGluZy5vcmlnaW5hbExpbmU7XG4gICAgICAgICAgLy8gTGluZXMgYXJlIHN0b3JlZCAwLWJhc2VkXG4gICAgICAgICAgbWFwcGluZy5vcmlnaW5hbExpbmUgKz0gMTtcblxuICAgICAgICAgIC8vIE9yaWdpbmFsIGNvbHVtbi5cbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uID0gcHJldmlvdXNPcmlnaW5hbENvbHVtbiArIHNlZ21lbnRbM107XG4gICAgICAgICAgcHJldmlvdXNPcmlnaW5hbENvbHVtbiA9IG1hcHBpbmcub3JpZ2luYWxDb2x1bW47XG5cbiAgICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPiA0KSB7XG4gICAgICAgICAgICAvLyBPcmlnaW5hbCBuYW1lLlxuICAgICAgICAgICAgbWFwcGluZy5uYW1lID0gcHJldmlvdXNOYW1lICsgc2VnbWVudFs0XTtcbiAgICAgICAgICAgIHByZXZpb3VzTmFtZSArPSBzZWdtZW50WzRdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdlbmVyYXRlZE1hcHBpbmdzLnB1c2gobWFwcGluZyk7XG4gICAgICAgIGlmICh0eXBlb2YgbWFwcGluZy5vcmlnaW5hbExpbmUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgb3JpZ2luYWxNYXBwaW5ncy5wdXNoKG1hcHBpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcXVpY2tTb3J0KGdlbmVyYXRlZE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkKTtcbiAgICB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MgPSBnZW5lcmF0ZWRNYXBwaW5ncztcblxuICAgIHF1aWNrU29ydChvcmlnaW5hbE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKTtcbiAgICB0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncyA9IG9yaWdpbmFsTWFwcGluZ3M7XG4gIH07XG5cbi8qKlxuICogRmluZCB0aGUgbWFwcGluZyB0aGF0IGJlc3QgbWF0Y2hlcyB0aGUgaHlwb3RoZXRpY2FsIFwibmVlZGxlXCIgbWFwcGluZyB0aGF0XG4gKiB3ZSBhcmUgc2VhcmNoaW5nIGZvciBpbiB0aGUgZ2l2ZW4gXCJoYXlzdGFja1wiIG9mIG1hcHBpbmdzLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fZmluZE1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9maW5kTWFwcGluZyhhTmVlZGxlLCBhTWFwcGluZ3MsIGFMaW5lTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYUNvbHVtbk5hbWUsIGFDb21wYXJhdG9yLCBhQmlhcykge1xuICAgIC8vIFRvIHJldHVybiB0aGUgcG9zaXRpb24gd2UgYXJlIHNlYXJjaGluZyBmb3IsIHdlIG11c3QgZmlyc3QgZmluZCB0aGVcbiAgICAvLyBtYXBwaW5nIGZvciB0aGUgZ2l2ZW4gcG9zaXRpb24gYW5kIHRoZW4gcmV0dXJuIHRoZSBvcHBvc2l0ZSBwb3NpdGlvbiBpdFxuICAgIC8vIHBvaW50cyB0by4gQmVjYXVzZSB0aGUgbWFwcGluZ3MgYXJlIHNvcnRlZCwgd2UgY2FuIHVzZSBiaW5hcnkgc2VhcmNoIHRvXG4gICAgLy8gZmluZCB0aGUgYmVzdCBtYXBwaW5nLlxuXG4gICAgaWYgKGFOZWVkbGVbYUxpbmVOYW1lXSA8PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdMaW5lIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDEsIGdvdCAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICsgYU5lZWRsZVthTGluZU5hbWVdKTtcbiAgICB9XG4gICAgaWYgKGFOZWVkbGVbYUNvbHVtbk5hbWVdIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ29sdW1uIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDAsIGdvdCAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICsgYU5lZWRsZVthQ29sdW1uTmFtZV0pO1xuICAgIH1cblxuICAgIHJldHVybiBiaW5hcnlTZWFyY2guc2VhcmNoKGFOZWVkbGUsIGFNYXBwaW5ncywgYUNvbXBhcmF0b3IsIGFCaWFzKTtcbiAgfTtcblxuLyoqXG4gKiBDb21wdXRlIHRoZSBsYXN0IGNvbHVtbiBmb3IgZWFjaCBnZW5lcmF0ZWQgbWFwcGluZy4gVGhlIGxhc3QgY29sdW1uIGlzXG4gKiBpbmNsdXNpdmUuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbXB1dGVDb2x1bW5TcGFucyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2NvbXB1dGVDb2x1bW5TcGFucygpIHtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3MubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzW2luZGV4XTtcblxuICAgICAgLy8gTWFwcGluZ3MgZG8gbm90IGNvbnRhaW4gYSBmaWVsZCBmb3IgdGhlIGxhc3QgZ2VuZXJhdGVkIGNvbHVtbnQuIFdlXG4gICAgICAvLyBjYW4gY29tZSB1cCB3aXRoIGFuIG9wdGltaXN0aWMgZXN0aW1hdGUsIGhvd2V2ZXIsIGJ5IGFzc3VtaW5nIHRoYXRcbiAgICAgIC8vIG1hcHBpbmdzIGFyZSBjb250aWd1b3VzIChpLmUuIGdpdmVuIHR3byBjb25zZWN1dGl2ZSBtYXBwaW5ncywgdGhlXG4gICAgICAvLyBmaXJzdCBtYXBwaW5nIGVuZHMgd2hlcmUgdGhlIHNlY29uZCBvbmUgc3RhcnRzKS5cbiAgICAgIGlmIChpbmRleCArIDEgPCB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIG5leHRNYXBwaW5nID0gdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3NbaW5kZXggKyAxXTtcblxuICAgICAgICBpZiAobWFwcGluZy5nZW5lcmF0ZWRMaW5lID09PSBuZXh0TWFwcGluZy5nZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgICAgbWFwcGluZy5sYXN0R2VuZXJhdGVkQ29sdW1uID0gbmV4dE1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uIC0gMTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgbGFzdCBtYXBwaW5nIGZvciBlYWNoIGxpbmUgc3BhbnMgdGhlIGVudGlyZSBsaW5lLlxuICAgICAgbWFwcGluZy5sYXN0R2VuZXJhdGVkQ29sdW1uID0gSW5maW5pdHk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSwgbGluZSwgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGdlbmVyYXRlZFxuICogc291cmNlJ3MgbGluZSBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKiB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuXG4gKiAgIC0gYmlhczogRWl0aGVyICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQnLiBTcGVjaWZpZXMgd2hldGhlciB0byByZXR1cm4gdGhlXG4gKiAgICAgY2xvc2VzdCBlbGVtZW50IHRoYXQgaXMgc21hbGxlciB0aGFuIG9yIGdyZWF0ZXIgdGhhbiB0aGUgb25lIHdlIGFyZVxuICogICAgIHNlYXJjaGluZyBmb3IsIHJlc3BlY3RpdmVseSwgaWYgdGhlIGV4YWN0IGVsZW1lbnQgY2Fubm90IGJlIGZvdW5kLlxuICogICAgIERlZmF1bHRzIHRvICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgb3JpZ2luYWwgc291cmNlIGZpbGUsIG9yIG51bGwuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UsIG9yIG51bGwuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLCBvciBudWxsLlxuICogICAtIG5hbWU6IFRoZSBvcmlnaW5hbCBpZGVudGlmaWVyLCBvciBudWxsLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5vcmlnaW5hbFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfb3JpZ2luYWxQb3NpdGlvbkZvcihhQXJncykge1xuICAgIHZhciBuZWVkbGUgPSB7XG4gICAgICBnZW5lcmF0ZWRMaW5lOiB1dGlsLmdldEFyZyhhQXJncywgJ2xpbmUnKSxcbiAgICAgIGdlbmVyYXRlZENvbHVtbjogdXRpbC5nZXRBcmcoYUFyZ3MsICdjb2x1bW4nKVxuICAgIH07XG5cbiAgICB2YXIgaW5kZXggPSB0aGlzLl9maW5kTWFwcGluZyhcbiAgICAgIG5lZWRsZSxcbiAgICAgIHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzLFxuICAgICAgXCJnZW5lcmF0ZWRMaW5lXCIsXG4gICAgICBcImdlbmVyYXRlZENvbHVtblwiLFxuICAgICAgdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZCxcbiAgICAgIHV0aWwuZ2V0QXJnKGFBcmdzLCAnYmlhcycsIFNvdXJjZU1hcENvbnN1bWVyLkdSRUFURVNUX0xPV0VSX0JPVU5EKVxuICAgICk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5nc1tpbmRleF07XG5cbiAgICAgIGlmIChtYXBwaW5nLmdlbmVyYXRlZExpbmUgPT09IG5lZWRsZS5nZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSB1dGlsLmdldEFyZyhtYXBwaW5nLCAnc291cmNlJywgbnVsbCk7XG4gICAgICAgIGlmIChzb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgICBzb3VyY2UgPSB0aGlzLl9zb3VyY2VzLmF0KHNvdXJjZSk7XG4gICAgICAgICAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBzb3VyY2UgPSB1dGlsLmpvaW4odGhpcy5zb3VyY2VSb290LCBzb3VyY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgbmFtZSA9IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICduYW1lJywgbnVsbCk7XG4gICAgICAgIGlmIChuYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgbmFtZSA9IHRoaXMuX25hbWVzLmF0KG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgbGluZTogdXRpbC5nZXRBcmcobWFwcGluZywgJ29yaWdpbmFsTGluZScsIG51bGwpLFxuICAgICAgICAgIGNvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ29yaWdpbmFsQ29sdW1uJywgbnVsbCksXG4gICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzb3VyY2U6IG51bGwsXG4gICAgICBsaW5lOiBudWxsLFxuICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgbmFtZTogbnVsbFxuICAgIH07XG4gIH07XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgd2UgaGF2ZSB0aGUgc291cmNlIGNvbnRlbnQgZm9yIGV2ZXJ5IHNvdXJjZSBpbiB0aGUgc291cmNlXG4gKiBtYXAsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuaGFzQ29udGVudHNPZkFsbFNvdXJjZXMgPVxuICBmdW5jdGlvbiBCYXNpY1NvdXJjZU1hcENvbnN1bWVyX2hhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzKCkge1xuICAgIGlmICghdGhpcy5zb3VyY2VzQ29udGVudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2VzQ29udGVudC5sZW5ndGggPj0gdGhpcy5fc291cmNlcy5zaXplKCkgJiZcbiAgICAgICF0aGlzLnNvdXJjZXNDb250ZW50LnNvbWUoZnVuY3Rpb24gKHNjKSB7IHJldHVybiBzYyA9PSBudWxsOyB9KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzb3VyY2UgY29udGVudC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgdGhlIHVybCBvZiB0aGVcbiAqIG9yaWdpbmFsIHNvdXJjZSBmaWxlLiBSZXR1cm5zIG51bGwgaWYgbm8gb3JpZ2luYWwgc291cmNlIGNvbnRlbnQgaXNcbiAqIGF2YWlsYWJsZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuc291cmNlQ29udGVudEZvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3NvdXJjZUNvbnRlbnRGb3IoYVNvdXJjZSwgbnVsbE9uTWlzc2luZykge1xuICAgIGlmICghdGhpcy5zb3VyY2VzQ29udGVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICBhU291cmNlID0gdXRpbC5yZWxhdGl2ZSh0aGlzLnNvdXJjZVJvb3QsIGFTb3VyY2UpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zb3VyY2VzLmhhcyhhU291cmNlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlc0NvbnRlbnRbdGhpcy5fc291cmNlcy5pbmRleE9mKGFTb3VyY2UpXTtcbiAgICB9XG5cbiAgICB2YXIgdXJsO1xuICAgIGlmICh0aGlzLnNvdXJjZVJvb3QgIT0gbnVsbFxuICAgICAgICAmJiAodXJsID0gdXRpbC51cmxQYXJzZSh0aGlzLnNvdXJjZVJvb3QpKSkge1xuICAgICAgLy8gWFhYOiBmaWxlOi8vIFVSSXMgYW5kIGFic29sdXRlIHBhdGhzIGxlYWQgdG8gdW5leHBlY3RlZCBiZWhhdmlvciBmb3JcbiAgICAgIC8vIG1hbnkgdXNlcnMuIFdlIGNhbiBoZWxwIHRoZW0gb3V0IHdoZW4gdGhleSBleHBlY3QgZmlsZTovLyBVUklzIHRvXG4gICAgICAvLyBiZWhhdmUgbGlrZSBpdCB3b3VsZCBpZiB0aGV5IHdlcmUgcnVubmluZyBhIGxvY2FsIEhUVFAgc2VydmVyLiBTZWVcbiAgICAgIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTg4NTU5Ny5cbiAgICAgIHZhciBmaWxlVXJpQWJzUGF0aCA9IGFTb3VyY2UucmVwbGFjZSgvXmZpbGU6XFwvXFwvLywgXCJcIik7XG4gICAgICBpZiAodXJsLnNjaGVtZSA9PSBcImZpbGVcIlxuICAgICAgICAgICYmIHRoaXMuX3NvdXJjZXMuaGFzKGZpbGVVcmlBYnNQYXRoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VzQ29udGVudFt0aGlzLl9zb3VyY2VzLmluZGV4T2YoZmlsZVVyaUFic1BhdGgpXVxuICAgICAgfVxuXG4gICAgICBpZiAoKCF1cmwucGF0aCB8fCB1cmwucGF0aCA9PSBcIi9cIilcbiAgICAgICAgICAmJiB0aGlzLl9zb3VyY2VzLmhhcyhcIi9cIiArIGFTb3VyY2UpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZXNDb250ZW50W3RoaXMuX3NvdXJjZXMuaW5kZXhPZihcIi9cIiArIGFTb3VyY2UpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgcmVjdXJzaXZlbHkgZnJvbVxuICAgIC8vIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuc291cmNlQ29udGVudEZvci4gSW4gdGhhdCBjYXNlLCB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gdGhyb3cgaWYgd2UgY2FuJ3QgZmluZCB0aGUgc291cmNlIC0gd2UganVzdCB3YW50IHRvXG4gICAgLy8gcmV0dXJuIG51bGwsIHNvIHdlIHByb3ZpZGUgYSBmbGFnIHRvIGV4aXQgZ3JhY2VmdWxseS5cbiAgICBpZiAobnVsbE9uTWlzc2luZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBhU291cmNlICsgJ1wiIGlzIG5vdCBpbiB0aGUgU291cmNlTWFwLicpO1xuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBnZW5lcmF0ZWQgbGluZSBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgb3JpZ2luYWwgc291cmNlLFxuICogbGluZSwgYW5kIGNvbHVtbiBwb3NpdGlvbnMgcHJvdmlkZWQuIFRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIG9iamVjdCB3aXRoXG4gKiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIGZpbGVuYW1lIG9mIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLlxuICogICAtIGJpYXM6IEVpdGhlciAnU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQnIG9yXG4gKiAgICAgJ1NvdXJjZU1hcENvbnN1bWVyLkxFQVNUX1VQUEVSX0JPVU5EJy4gU3BlY2lmaWVzIHdoZXRoZXIgdG8gcmV0dXJuIHRoZVxuICogICAgIGNsb3Nlc3QgZWxlbWVudCB0aGF0IGlzIHNtYWxsZXIgdGhhbiBvciBncmVhdGVyIHRoYW4gdGhlIG9uZSB3ZSBhcmVcbiAqICAgICBzZWFyY2hpbmcgZm9yLCByZXNwZWN0aXZlbHksIGlmIHRoZSBleGFjdCBlbGVtZW50IGNhbm5vdCBiZSBmb3VuZC5cbiAqICAgICBEZWZhdWx0cyB0byAnU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQnLlxuICpcbiAqIGFuZCBhbiBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5nZW5lcmF0ZWRQb3NpdGlvbkZvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2dlbmVyYXRlZFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgdmFyIHNvdXJjZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJyk7XG4gICAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICBzb3VyY2UgPSB1dGlsLnJlbGF0aXZlKHRoaXMuc291cmNlUm9vdCwgc291cmNlKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9zb3VyY2VzLmhhcyhzb3VyY2UpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaW5lOiBudWxsLFxuICAgICAgICBjb2x1bW46IG51bGwsXG4gICAgICAgIGxhc3RDb2x1bW46IG51bGxcbiAgICAgIH07XG4gICAgfVxuICAgIHNvdXJjZSA9IHRoaXMuX3NvdXJjZXMuaW5kZXhPZihzb3VyY2UpO1xuXG4gICAgdmFyIG5lZWRsZSA9IHtcbiAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgb3JpZ2luYWxMaW5lOiB1dGlsLmdldEFyZyhhQXJncywgJ2xpbmUnKSxcbiAgICAgIG9yaWdpbmFsQ29sdW1uOiB1dGlsLmdldEFyZyhhQXJncywgJ2NvbHVtbicpXG4gICAgfTtcblxuICAgIHZhciBpbmRleCA9IHRoaXMuX2ZpbmRNYXBwaW5nKFxuICAgICAgbmVlZGxlLFxuICAgICAgdGhpcy5fb3JpZ2luYWxNYXBwaW5ncyxcbiAgICAgIFwib3JpZ2luYWxMaW5lXCIsXG4gICAgICBcIm9yaWdpbmFsQ29sdW1uXCIsXG4gICAgICB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zLFxuICAgICAgdXRpbC5nZXRBcmcoYUFyZ3MsICdiaWFzJywgU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQpXG4gICAgKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICBpZiAobWFwcGluZy5zb3VyY2UgPT09IG5lZWRsZS5zb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsaW5lOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnZ2VuZXJhdGVkTGluZScsIG51bGwpLFxuICAgICAgICAgIGNvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZENvbHVtbicsIG51bGwpLFxuICAgICAgICAgIGxhc3RDb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdsYXN0R2VuZXJhdGVkQ29sdW1uJywgbnVsbClcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZTogbnVsbCxcbiAgICAgIGNvbHVtbjogbnVsbCxcbiAgICAgIGxhc3RDb2x1bW46IG51bGxcbiAgICB9O1xuICB9O1xuXG5leHBvcnRzLkJhc2ljU291cmNlTWFwQ29uc3VtZXIgPSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyO1xuXG4vKipcbiAqIEFuIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lciBpbnN0YW5jZSByZXByZXNlbnRzIGEgcGFyc2VkIHNvdXJjZSBtYXAgd2hpY2hcbiAqIHdlIGNhbiBxdWVyeSBmb3IgaW5mb3JtYXRpb24uIEl0IGRpZmZlcnMgZnJvbSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyIGluXG4gKiB0aGF0IGl0IHRha2VzIFwiaW5kZXhlZFwiIHNvdXJjZSBtYXBzIChpLmUuIG9uZXMgd2l0aCBhIFwic2VjdGlvbnNcIiBmaWVsZCkgYXNcbiAqIGlucHV0LlxuICpcbiAqIFRoZSBvbmx5IHBhcmFtZXRlciBpcyBhIHJhdyBzb3VyY2UgbWFwIChlaXRoZXIgYXMgYSBKU09OIHN0cmluZywgb3IgYWxyZWFkeVxuICogcGFyc2VkIHRvIGFuIG9iamVjdCkuIEFjY29yZGluZyB0byB0aGUgc3BlYyBmb3IgaW5kZXhlZCBzb3VyY2UgbWFwcywgdGhleVxuICogaGF2ZSB0aGUgZm9sbG93aW5nIGF0dHJpYnV0ZXM6XG4gKlxuICogICAtIHZlcnNpb246IFdoaWNoIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXAgc3BlYyB0aGlzIG1hcCBpcyBmb2xsb3dpbmcuXG4gKiAgIC0gZmlsZTogT3B0aW9uYWwuIFRoZSBnZW5lcmF0ZWQgZmlsZSB0aGlzIHNvdXJjZSBtYXAgaXMgYXNzb2NpYXRlZCB3aXRoLlxuICogICAtIHNlY3Rpb25zOiBBIGxpc3Qgb2Ygc2VjdGlvbiBkZWZpbml0aW9ucy5cbiAqXG4gKiBFYWNoIHZhbHVlIHVuZGVyIHRoZSBcInNlY3Rpb25zXCIgZmllbGQgaGFzIHR3byBmaWVsZHM6XG4gKiAgIC0gb2Zmc2V0OiBUaGUgb2Zmc2V0IGludG8gdGhlIG9yaWdpbmFsIHNwZWNpZmllZCBhdCB3aGljaCB0aGlzIHNlY3Rpb25cbiAqICAgICAgIGJlZ2lucyB0byBhcHBseSwgZGVmaW5lZCBhcyBhbiBvYmplY3Qgd2l0aCBhIFwibGluZVwiIGFuZCBcImNvbHVtblwiXG4gKiAgICAgICBmaWVsZC5cbiAqICAgLSBtYXA6IEEgc291cmNlIG1hcCBkZWZpbml0aW9uLiBUaGlzIHNvdXJjZSBtYXAgY291bGQgYWxzbyBiZSBpbmRleGVkLFxuICogICAgICAgYnV0IGRvZXNuJ3QgaGF2ZSB0byBiZS5cbiAqXG4gKiBJbnN0ZWFkIG9mIHRoZSBcIm1hcFwiIGZpZWxkLCBpdCdzIGFsc28gcG9zc2libGUgdG8gaGF2ZSBhIFwidXJsXCIgZmllbGRcbiAqIHNwZWNpZnlpbmcgYSBVUkwgdG8gcmV0cmlldmUgYSBzb3VyY2UgbWFwIGZyb20sIGJ1dCB0aGF0J3MgY3VycmVudGx5XG4gKiB1bnN1cHBvcnRlZC5cbiAqXG4gKiBIZXJlJ3MgYW4gZXhhbXBsZSBzb3VyY2UgbWFwLCB0YWtlbiBmcm9tIHRoZSBzb3VyY2UgbWFwIHNwZWNbMF0sIGJ1dFxuICogbW9kaWZpZWQgdG8gb21pdCBhIHNlY3Rpb24gd2hpY2ggdXNlcyB0aGUgXCJ1cmxcIiBmaWVsZC5cbiAqXG4gKiAge1xuICogICAgdmVyc2lvbiA6IDMsXG4gKiAgICBmaWxlOiBcImFwcC5qc1wiLFxuICogICAgc2VjdGlvbnM6IFt7XG4gKiAgICAgIG9mZnNldDoge2xpbmU6MTAwLCBjb2x1bW46MTB9LFxuICogICAgICBtYXA6IHtcbiAqICAgICAgICB2ZXJzaW9uIDogMyxcbiAqICAgICAgICBmaWxlOiBcInNlY3Rpb24uanNcIixcbiAqICAgICAgICBzb3VyY2VzOiBbXCJmb28uanNcIiwgXCJiYXIuanNcIl0sXG4gKiAgICAgICAgbmFtZXM6IFtcInNyY1wiLCBcIm1hcHNcIiwgXCJhcmVcIiwgXCJmdW5cIl0sXG4gKiAgICAgICAgbWFwcGluZ3M6IFwiQUFBQSxFOztBQkNERTtcIlxuICogICAgICB9XG4gKiAgICB9XSxcbiAqICB9XG4gKlxuICogWzBdOiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9kb2N1bWVudC9kLzFVMVJHQWVoUXdSeXBVVG92RjFLUmxwaU9GemUwYi1fMmdjNmZBSDBLWTBrL2VkaXQjaGVhZGluZz1oLjUzNWVzM3hlcHJndFxuICovXG5mdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IEpTT04ucGFyc2UoYVNvdXJjZU1hcC5yZXBsYWNlKC9eXFwpXFxdXFx9Jy8sICcnKSk7XG4gIH1cblxuICB2YXIgdmVyc2lvbiA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3ZlcnNpb24nKTtcbiAgdmFyIHNlY3Rpb25zID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnc2VjdGlvbnMnKTtcblxuICBpZiAodmVyc2lvbiAhPSB0aGlzLl92ZXJzaW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCB2ZXJzaW9uOiAnICsgdmVyc2lvbik7XG4gIH1cblxuICB0aGlzLl9zb3VyY2VzID0gbmV3IEFycmF5U2V0KCk7XG4gIHRoaXMuX25hbWVzID0gbmV3IEFycmF5U2V0KCk7XG5cbiAgdmFyIGxhc3RPZmZzZXQgPSB7XG4gICAgbGluZTogLTEsXG4gICAgY29sdW1uOiAwXG4gIH07XG4gIHRoaXMuX3NlY3Rpb25zID0gc2VjdGlvbnMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgaWYgKHMudXJsKSB7XG4gICAgICAvLyBUaGUgdXJsIGZpZWxkIHdpbGwgcmVxdWlyZSBzdXBwb3J0IGZvciBhc3luY2hyb25pY2l0eS5cbiAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL2lzc3Vlcy8xNlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdXBwb3J0IGZvciB1cmwgZmllbGQgaW4gc2VjdGlvbnMgbm90IGltcGxlbWVudGVkLicpO1xuICAgIH1cbiAgICB2YXIgb2Zmc2V0ID0gdXRpbC5nZXRBcmcocywgJ29mZnNldCcpO1xuICAgIHZhciBvZmZzZXRMaW5lID0gdXRpbC5nZXRBcmcob2Zmc2V0LCAnbGluZScpO1xuICAgIHZhciBvZmZzZXRDb2x1bW4gPSB1dGlsLmdldEFyZyhvZmZzZXQsICdjb2x1bW4nKTtcblxuICAgIGlmIChvZmZzZXRMaW5lIDwgbGFzdE9mZnNldC5saW5lIHx8XG4gICAgICAgIChvZmZzZXRMaW5lID09PSBsYXN0T2Zmc2V0LmxpbmUgJiYgb2Zmc2V0Q29sdW1uIDwgbGFzdE9mZnNldC5jb2x1bW4pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlY3Rpb24gb2Zmc2V0cyBtdXN0IGJlIG9yZGVyZWQgYW5kIG5vbi1vdmVybGFwcGluZy4nKTtcbiAgICB9XG4gICAgbGFzdE9mZnNldCA9IG9mZnNldDtcblxuICAgIHJldHVybiB7XG4gICAgICBnZW5lcmF0ZWRPZmZzZXQ6IHtcbiAgICAgICAgLy8gVGhlIG9mZnNldCBmaWVsZHMgYXJlIDAtYmFzZWQsIGJ1dCB3ZSB1c2UgMS1iYXNlZCBpbmRpY2VzIHdoZW5cbiAgICAgICAgLy8gZW5jb2RpbmcvZGVjb2RpbmcgZnJvbSBWTFEuXG4gICAgICAgIGdlbmVyYXRlZExpbmU6IG9mZnNldExpbmUgKyAxLFxuICAgICAgICBnZW5lcmF0ZWRDb2x1bW46IG9mZnNldENvbHVtbiArIDFcbiAgICAgIH0sXG4gICAgICBjb25zdW1lcjogbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwuZ2V0QXJnKHMsICdtYXAnKSlcbiAgICB9XG4gIH0pO1xufVxuXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUpO1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNvdXJjZU1hcENvbnN1bWVyO1xuXG4vKipcbiAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBzb3VyY2UgbWFwcGluZyBzcGVjIHRoYXQgd2UgYXJlIGNvbnN1bWluZy5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8qKlxuICogVGhlIGxpc3Qgb2Ygb3JpZ2luYWwgc291cmNlcy5cbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUsICdzb3VyY2VzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc291cmNlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5fc2VjdGlvbnNbaV0uY29uc3VtZXIuc291cmNlcy5sZW5ndGg7IGorKykge1xuICAgICAgICBzb3VyY2VzLnB1c2godGhpcy5fc2VjdGlvbnNbaV0uY29uc3VtZXIuc291cmNlc1tqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2VzO1xuICB9XG59KTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzb3VyY2UsIGxpbmUsIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBnZW5lcmF0ZWRcbiAqIHNvdXJjZSdzIGxpbmUgYW5kIGNvbHVtbiBwb3NpdGlvbnMgcHJvdmlkZWQuIFRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIG9iamVjdFxuICogd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLlxuICpcbiAqIGFuZCBhbiBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlLCBvciBudWxsLlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLCBvciBudWxsLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgLSBuYW1lOiBUaGUgb3JpZ2luYWwgaWRlbnRpZmllciwgb3IgbnVsbC5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5vcmlnaW5hbFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX29yaWdpbmFsUG9zaXRpb25Gb3IoYUFyZ3MpIHtcbiAgICB2YXIgbmVlZGxlID0ge1xuICAgICAgZ2VuZXJhdGVkTGluZTogdXRpbC5nZXRBcmcoYUFyZ3MsICdsaW5lJyksXG4gICAgICBnZW5lcmF0ZWRDb2x1bW46IHV0aWwuZ2V0QXJnKGFBcmdzLCAnY29sdW1uJylcbiAgICB9O1xuXG4gICAgLy8gRmluZCB0aGUgc2VjdGlvbiBjb250YWluaW5nIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb24gd2UncmUgdHJ5aW5nIHRvIG1hcFxuICAgIC8vIHRvIGFuIG9yaWdpbmFsIHBvc2l0aW9uLlxuICAgIHZhciBzZWN0aW9uSW5kZXggPSBiaW5hcnlTZWFyY2guc2VhcmNoKG5lZWRsZSwgdGhpcy5fc2VjdGlvbnMsXG4gICAgICBmdW5jdGlvbihuZWVkbGUsIHNlY3Rpb24pIHtcbiAgICAgICAgdmFyIGNtcCA9IG5lZWRsZS5nZW5lcmF0ZWRMaW5lIC0gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZTtcbiAgICAgICAgaWYgKGNtcCkge1xuICAgICAgICAgIHJldHVybiBjbXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKG5lZWRsZS5nZW5lcmF0ZWRDb2x1bW4gLVxuICAgICAgICAgICAgICAgIHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZENvbHVtbik7XG4gICAgICB9KTtcbiAgICB2YXIgc2VjdGlvbiA9IHRoaXMuX3NlY3Rpb25zW3NlY3Rpb25JbmRleF07XG5cbiAgICBpZiAoIXNlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNvdXJjZTogbnVsbCxcbiAgICAgICAgbGluZTogbnVsbCxcbiAgICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgICBuYW1lOiBudWxsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBzZWN0aW9uLmNvbnN1bWVyLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe1xuICAgICAgbGluZTogbmVlZGxlLmdlbmVyYXRlZExpbmUgLVxuICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSAtIDEpLFxuICAgICAgY29sdW1uOiBuZWVkbGUuZ2VuZXJhdGVkQ29sdW1uIC1cbiAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgPT09IG5lZWRsZS5nZW5lcmF0ZWRMaW5lXG4gICAgICAgICA/IHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZENvbHVtbiAtIDFcbiAgICAgICAgIDogMCksXG4gICAgICBiaWFzOiBhQXJncy5iaWFzXG4gICAgfSk7XG4gIH07XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgd2UgaGF2ZSB0aGUgc291cmNlIGNvbnRlbnQgZm9yIGV2ZXJ5IHNvdXJjZSBpbiB0aGUgc291cmNlXG4gKiBtYXAsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5oYXNDb250ZW50c09mQWxsU291cmNlcyA9XG4gIGZ1bmN0aW9uIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcl9oYXNDb250ZW50c09mQWxsU291cmNlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VjdGlvbnMuZXZlcnkoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLmNvbnN1bWVyLmhhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzKCk7XG4gICAgfSk7XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgb3JpZ2luYWwgc291cmNlIGNvbnRlbnQuIFRoZSBvbmx5IGFyZ3VtZW50IGlzIHRoZSB1cmwgb2YgdGhlXG4gKiBvcmlnaW5hbCBzb3VyY2UgZmlsZS4gUmV0dXJucyBudWxsIGlmIG5vIG9yaWdpbmFsIHNvdXJjZSBjb250ZW50IGlzXG4gKiBhdmFpbGFibGUuXG4gKi9cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuc291cmNlQ29udGVudEZvciA9XG4gIGZ1bmN0aW9uIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcl9zb3VyY2VDb250ZW50Rm9yKGFTb3VyY2UsIG51bGxPbk1pc3NpbmcpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3NlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc2VjdGlvbiA9IHRoaXMuX3NlY3Rpb25zW2ldO1xuXG4gICAgICB2YXIgY29udGVudCA9IHNlY3Rpb24uY29uc3VtZXIuc291cmNlQ29udGVudEZvcihhU291cmNlLCB0cnVlKTtcbiAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobnVsbE9uTWlzc2luZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBhU291cmNlICsgJ1wiIGlzIG5vdCBpbiB0aGUgU291cmNlTWFwLicpO1xuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBnZW5lcmF0ZWQgbGluZSBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgb3JpZ2luYWwgc291cmNlLFxuICogbGluZSwgYW5kIGNvbHVtbiBwb3NpdGlvbnMgcHJvdmlkZWQuIFRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIG9iamVjdCB3aXRoXG4gKiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIGZpbGVuYW1lIG9mIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLlxuICpcbiAqIGFuZCBhbiBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmdlbmVyYXRlZFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX2dlbmVyYXRlZFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlY3Rpb24gPSB0aGlzLl9zZWN0aW9uc1tpXTtcblxuICAgICAgLy8gT25seSBjb25zaWRlciB0aGlzIHNlY3Rpb24gaWYgdGhlIHJlcXVlc3RlZCBzb3VyY2UgaXMgaW4gdGhlIGxpc3Qgb2ZcbiAgICAgIC8vIHNvdXJjZXMgb2YgdGhlIGNvbnN1bWVyLlxuICAgICAgaWYgKHNlY3Rpb24uY29uc3VtZXIuc291cmNlcy5pbmRleE9mKHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJykpID09PSAtMSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHZhciBnZW5lcmF0ZWRQb3NpdGlvbiA9IHNlY3Rpb24uY29uc3VtZXIuZ2VuZXJhdGVkUG9zaXRpb25Gb3IoYUFyZ3MpO1xuICAgICAgaWYgKGdlbmVyYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgIHZhciByZXQgPSB7XG4gICAgICAgICAgbGluZTogZ2VuZXJhdGVkUG9zaXRpb24ubGluZSArXG4gICAgICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSAtIDEpLFxuICAgICAgICAgIGNvbHVtbjogZ2VuZXJhdGVkUG9zaXRpb24uY29sdW1uICtcbiAgICAgICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lID09PSBnZW5lcmF0ZWRQb3NpdGlvbi5saW5lXG4gICAgICAgICAgICAgPyBzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRDb2x1bW4gLSAxXG4gICAgICAgICAgICAgOiAwKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBsaW5lOiBudWxsLFxuICAgICAgY29sdW1uOiBudWxsXG4gICAgfTtcbiAgfTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgbWFwcGluZ3MgaW4gYSBzdHJpbmcgaW4gdG8gYSBkYXRhIHN0cnVjdHVyZSB3aGljaCB3ZSBjYW4gZWFzaWx5XG4gKiBxdWVyeSAodGhlIG9yZGVyZWQgYXJyYXlzIGluIHRoZSBgdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzYCBhbmRcbiAqIGB0aGlzLl9fb3JpZ2luYWxNYXBwaW5nc2AgcHJvcGVydGllcykuXG4gKi9cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX3BhcnNlTWFwcGluZ3MgPVxuICBmdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXJfcGFyc2VNYXBwaW5ncyhhU3RyLCBhU291cmNlUm9vdCkge1xuICAgIHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IFtdO1xuICAgIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlY3Rpb24gPSB0aGlzLl9zZWN0aW9uc1tpXTtcbiAgICAgIHZhciBzZWN0aW9uTWFwcGluZ3MgPSBzZWN0aW9uLmNvbnN1bWVyLl9nZW5lcmF0ZWRNYXBwaW5ncztcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2VjdGlvbk1hcHBpbmdzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBtYXBwaW5nID0gc2VjdGlvbk1hcHBpbmdzW2pdO1xuXG4gICAgICAgIHZhciBzb3VyY2UgPSBzZWN0aW9uLmNvbnN1bWVyLl9zb3VyY2VzLmF0KG1hcHBpbmcuc291cmNlKTtcbiAgICAgICAgaWYgKHNlY3Rpb24uY29uc3VtZXIuc291cmNlUm9vdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHNvdXJjZSA9IHV0aWwuam9pbihzZWN0aW9uLmNvbnN1bWVyLnNvdXJjZVJvb3QsIHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgICAgc291cmNlID0gdGhpcy5fc291cmNlcy5pbmRleE9mKHNvdXJjZSk7XG5cbiAgICAgICAgdmFyIG5hbWUgPSBzZWN0aW9uLmNvbnN1bWVyLl9uYW1lcy5hdChtYXBwaW5nLm5hbWUpO1xuICAgICAgICB0aGlzLl9uYW1lcy5hZGQobmFtZSk7XG4gICAgICAgIG5hbWUgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuXG4gICAgICAgIC8vIFRoZSBtYXBwaW5ncyBjb21pbmcgZnJvbSB0aGUgY29uc3VtZXIgZm9yIHRoZSBzZWN0aW9uIGhhdmVcbiAgICAgICAgLy8gZ2VuZXJhdGVkIHBvc2l0aW9ucyByZWxhdGl2ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHNlY3Rpb24sIHNvIHdlXG4gICAgICAgIC8vIG5lZWQgdG8gb2Zmc2V0IHRoZW0gdG8gYmUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IG9mIHRoZSBjb25jYXRlbmF0ZWRcbiAgICAgICAgLy8gZ2VuZXJhdGVkIGZpbGUuXG4gICAgICAgIHZhciBhZGp1c3RlZE1hcHBpbmcgPSB7XG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgZ2VuZXJhdGVkTGluZTogbWFwcGluZy5nZW5lcmF0ZWRMaW5lICtcbiAgICAgICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lIC0gMSksXG4gICAgICAgICAgZ2VuZXJhdGVkQ29sdW1uOiBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbiArXG4gICAgICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSA9PT0gbWFwcGluZy5nZW5lcmF0ZWRMaW5lXG4gICAgICAgICAgICA/IHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZENvbHVtbiAtIDFcbiAgICAgICAgICAgIDogMCksXG4gICAgICAgICAgb3JpZ2luYWxMaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgICBvcmlnaW5hbENvbHVtbjogbWFwcGluZy5vcmlnaW5hbENvbHVtbixcbiAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzLnB1c2goYWRqdXN0ZWRNYXBwaW5nKTtcbiAgICAgICAgaWYgKHR5cGVvZiBhZGp1c3RlZE1hcHBpbmcub3JpZ2luYWxMaW5lID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzLnB1c2goYWRqdXN0ZWRNYXBwaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHF1aWNrU29ydCh0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQpO1xuICAgIHF1aWNrU29ydCh0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncywgdXRpbC5jb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyk7XG4gIH07XG5cbmV4cG9ydHMuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyID0gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyO1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgYmFzZTY0VkxRID0gcmVxdWlyZSgnLi9iYXNlNjQtdmxxJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIEFycmF5U2V0ID0gcmVxdWlyZSgnLi9hcnJheS1zZXQnKS5BcnJheVNldDtcbnZhciBNYXBwaW5nTGlzdCA9IHJlcXVpcmUoJy4vbWFwcGluZy1saXN0JykuTWFwcGluZ0xpc3Q7XG5cbi8qKlxuICogQW4gaW5zdGFuY2Ugb2YgdGhlIFNvdXJjZU1hcEdlbmVyYXRvciByZXByZXNlbnRzIGEgc291cmNlIG1hcCB3aGljaCBpc1xuICogYmVpbmcgYnVpbHQgaW5jcmVtZW50YWxseS4gWW91IG1heSBwYXNzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmdcbiAqIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGZpbGU6IFRoZSBmaWxlbmFtZSBvZiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS5cbiAqICAgLSBzb3VyY2VSb290OiBBIHJvb3QgZm9yIGFsbCByZWxhdGl2ZSBVUkxzIGluIHRoaXMgc291cmNlIG1hcC5cbiAqL1xuZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yKGFBcmdzKSB7XG4gIGlmICghYUFyZ3MpIHtcbiAgICBhQXJncyA9IHt9O1xuICB9XG4gIHRoaXMuX2ZpbGUgPSB1dGlsLmdldEFyZyhhQXJncywgJ2ZpbGUnLCBudWxsKTtcbiAgdGhpcy5fc291cmNlUm9vdCA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlUm9vdCcsIG51bGwpO1xuICB0aGlzLl9za2lwVmFsaWRhdGlvbiA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc2tpcFZhbGlkYXRpb24nLCBmYWxzZSk7XG4gIHRoaXMuX3NvdXJjZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbmFtZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbWFwcGluZ3MgPSBuZXcgTWFwcGluZ0xpc3QoKTtcbiAgdGhpcy5fc291cmNlc0NvbnRlbnRzID0gbnVsbDtcbn1cblxuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IgYmFzZWQgb24gYSBTb3VyY2VNYXBDb25zdW1lclxuICpcbiAqIEBwYXJhbSBhU291cmNlTWFwQ29uc3VtZXIgVGhlIFNvdXJjZU1hcC5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLmZyb21Tb3VyY2VNYXAgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfZnJvbVNvdXJjZU1hcChhU291cmNlTWFwQ29uc3VtZXIpIHtcbiAgICB2YXIgc291cmNlUm9vdCA9IGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VSb290O1xuICAgIHZhciBnZW5lcmF0b3IgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHtcbiAgICAgIGZpbGU6IGFTb3VyY2VNYXBDb25zdW1lci5maWxlLFxuICAgICAgc291cmNlUm9vdDogc291cmNlUm9vdFxuICAgIH0pO1xuICAgIGFTb3VyY2VNYXBDb25zdW1lci5lYWNoTWFwcGluZyhmdW5jdGlvbiAobWFwcGluZykge1xuICAgICAgdmFyIG5ld01hcHBpbmcgPSB7XG4gICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgIGxpbmU6IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSxcbiAgICAgICAgICBjb2x1bW46IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIG5ld01hcHBpbmcuc291cmNlID0gbWFwcGluZy5zb3VyY2U7XG4gICAgICAgIGlmIChzb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgICBuZXdNYXBwaW5nLnNvdXJjZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgbmV3TWFwcGluZy5zb3VyY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3TWFwcGluZy5vcmlnaW5hbCA9IHtcbiAgICAgICAgICBsaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgICBjb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW5cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAobWFwcGluZy5uYW1lICE9IG51bGwpIHtcbiAgICAgICAgICBuZXdNYXBwaW5nLm5hbWUgPSBtYXBwaW5nLm5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2VuZXJhdG9yLmFkZE1hcHBpbmcobmV3TWFwcGluZyk7XG4gICAgfSk7XG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlRmlsZSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlQ29udGVudEZvcihzb3VyY2VGaWxlKTtcbiAgICAgIGlmIChjb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgZ2VuZXJhdG9yLnNldFNvdXJjZUNvbnRlbnQoc291cmNlRmlsZSwgY29udGVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfTtcblxuLyoqXG4gKiBBZGQgYSBzaW5nbGUgbWFwcGluZyBmcm9tIG9yaWdpbmFsIHNvdXJjZSBsaW5lIGFuZCBjb2x1bW4gdG8gdGhlIGdlbmVyYXRlZFxuICogc291cmNlJ3MgbGluZSBhbmQgY29sdW1uIGZvciB0aGlzIHNvdXJjZSBtYXAgYmVpbmcgY3JlYXRlZC4gVGhlIG1hcHBpbmdcbiAqIG9iamVjdCBzaG91bGQgaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGdlbmVyYXRlZDogQW4gb2JqZWN0IHdpdGggdGhlIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4gcG9zaXRpb25zLlxuICogICAtIG9yaWdpbmFsOiBBbiBvYmplY3Qgd2l0aCB0aGUgb3JpZ2luYWwgbGluZSBhbmQgY29sdW1uIHBvc2l0aW9ucy5cbiAqICAgLSBzb3VyY2U6IFRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZSAocmVsYXRpdmUgdG8gdGhlIHNvdXJjZVJvb3QpLlxuICogICAtIG5hbWU6IEFuIG9wdGlvbmFsIG9yaWdpbmFsIHRva2VuIG5hbWUgZm9yIHRoaXMgbWFwcGluZy5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5hZGRNYXBwaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX2FkZE1hcHBpbmcoYUFyZ3MpIHtcbiAgICB2YXIgZ2VuZXJhdGVkID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdnZW5lcmF0ZWQnKTtcbiAgICB2YXIgb3JpZ2luYWwgPSB1dGlsLmdldEFyZyhhQXJncywgJ29yaWdpbmFsJywgbnVsbCk7XG4gICAgdmFyIHNvdXJjZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJywgbnVsbCk7XG4gICAgdmFyIG5hbWUgPSB1dGlsLmdldEFyZyhhQXJncywgJ25hbWUnLCBudWxsKTtcblxuICAgIGlmICghdGhpcy5fc2tpcFZhbGlkYXRpb24pIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlTWFwcGluZyhnZW5lcmF0ZWQsIG9yaWdpbmFsLCBzb3VyY2UsIG5hbWUpO1xuICAgIH1cblxuICAgIGlmIChzb3VyY2UgIT0gbnVsbCkge1xuICAgICAgc291cmNlID0gU3RyaW5nKHNvdXJjZSk7XG4gICAgICBpZiAoIXRoaXMuX3NvdXJjZXMuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgdGhpcy5fc291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICAgICAgaWYgKCF0aGlzLl9uYW1lcy5oYXMobmFtZSkpIHtcbiAgICAgICAgdGhpcy5fbmFtZXMuYWRkKG5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX21hcHBpbmdzLmFkZCh7XG4gICAgICBnZW5lcmF0ZWRMaW5lOiBnZW5lcmF0ZWQubGluZSxcbiAgICAgIGdlbmVyYXRlZENvbHVtbjogZ2VuZXJhdGVkLmNvbHVtbixcbiAgICAgIG9yaWdpbmFsTGluZTogb3JpZ2luYWwgIT0gbnVsbCAmJiBvcmlnaW5hbC5saW5lLFxuICAgICAgb3JpZ2luYWxDb2x1bW46IG9yaWdpbmFsICE9IG51bGwgJiYgb3JpZ2luYWwuY29sdW1uLFxuICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfSk7XG4gIH07XG5cbi8qKlxuICogU2V0IHRoZSBzb3VyY2UgY29udGVudCBmb3IgYSBzb3VyY2UgZmlsZS5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5zZXRTb3VyY2VDb250ZW50ID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3NldFNvdXJjZUNvbnRlbnQoYVNvdXJjZUZpbGUsIGFTb3VyY2VDb250ZW50KSB7XG4gICAgdmFyIHNvdXJjZSA9IGFTb3VyY2VGaWxlO1xuICAgIGlmICh0aGlzLl9zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIHNvdXJjZSA9IHV0aWwucmVsYXRpdmUodGhpcy5fc291cmNlUm9vdCwgc291cmNlKTtcbiAgICB9XG5cbiAgICBpZiAoYVNvdXJjZUNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgLy8gQWRkIHRoZSBzb3VyY2UgY29udGVudCB0byB0aGUgX3NvdXJjZXNDb250ZW50cyBtYXAuXG4gICAgICAvLyBDcmVhdGUgYSBuZXcgX3NvdXJjZXNDb250ZW50cyBtYXAgaWYgdGhlIHByb3BlcnR5IGlzIG51bGwuXG4gICAgICBpZiAoIXRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgICB0aGlzLl9zb3VyY2VzQ29udGVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgfVxuICAgICAgdGhpcy5fc291cmNlc0NvbnRlbnRzW3V0aWwudG9TZXRTdHJpbmcoc291cmNlKV0gPSBhU291cmNlQ29udGVudDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBzb3VyY2UgZmlsZSBmcm9tIHRoZSBfc291cmNlc0NvbnRlbnRzIG1hcC5cbiAgICAgIC8vIElmIHRoZSBfc291cmNlc0NvbnRlbnRzIG1hcCBpcyBlbXB0eSwgc2V0IHRoZSBwcm9wZXJ0eSB0byBudWxsLlxuICAgICAgZGVsZXRlIHRoaXMuX3NvdXJjZXNDb250ZW50c1t1dGlsLnRvU2V0U3RyaW5nKHNvdXJjZSldO1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuX3NvdXJjZXNDb250ZW50cykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX3NvdXJjZXNDb250ZW50cyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIEFwcGxpZXMgdGhlIG1hcHBpbmdzIG9mIGEgc3ViLXNvdXJjZS1tYXAgZm9yIGEgc3BlY2lmaWMgc291cmNlIGZpbGUgdG8gdGhlXG4gKiBzb3VyY2UgbWFwIGJlaW5nIGdlbmVyYXRlZC4gRWFjaCBtYXBwaW5nIHRvIHRoZSBzdXBwbGllZCBzb3VyY2UgZmlsZSBpc1xuICogcmV3cml0dGVuIHVzaW5nIHRoZSBzdXBwbGllZCBzb3VyY2UgbWFwLiBOb3RlOiBUaGUgcmVzb2x1dGlvbiBmb3IgdGhlXG4gKiByZXN1bHRpbmcgbWFwcGluZ3MgaXMgdGhlIG1pbmltaXVtIG9mIHRoaXMgbWFwIGFuZCB0aGUgc3VwcGxpZWQgbWFwLlxuICpcbiAqIEBwYXJhbSBhU291cmNlTWFwQ29uc3VtZXIgVGhlIHNvdXJjZSBtYXAgdG8gYmUgYXBwbGllZC5cbiAqIEBwYXJhbSBhU291cmNlRmlsZSBPcHRpb25hbC4gVGhlIGZpbGVuYW1lIG9mIHRoZSBzb3VyY2UgZmlsZS5cbiAqICAgICAgICBJZiBvbWl0dGVkLCBTb3VyY2VNYXBDb25zdW1lcidzIGZpbGUgcHJvcGVydHkgd2lsbCBiZSB1c2VkLlxuICogQHBhcmFtIGFTb3VyY2VNYXBQYXRoIE9wdGlvbmFsLiBUaGUgZGlybmFtZSBvZiB0aGUgcGF0aCB0byB0aGUgc291cmNlIG1hcFxuICogICAgICAgIHRvIGJlIGFwcGxpZWQuIElmIHJlbGF0aXZlLCBpdCBpcyByZWxhdGl2ZSB0byB0aGUgU291cmNlTWFwQ29uc3VtZXIuXG4gKiAgICAgICAgVGhpcyBwYXJhbWV0ZXIgaXMgbmVlZGVkIHdoZW4gdGhlIHR3byBzb3VyY2UgbWFwcyBhcmVuJ3QgaW4gdGhlIHNhbWVcbiAqICAgICAgICBkaXJlY3RvcnksIGFuZCB0aGUgc291cmNlIG1hcCB0byBiZSBhcHBsaWVkIGNvbnRhaW5zIHJlbGF0aXZlIHNvdXJjZVxuICogICAgICAgIHBhdGhzLiBJZiBzbywgdGhvc2UgcmVsYXRpdmUgc291cmNlIHBhdGhzIG5lZWQgdG8gYmUgcmV3cml0dGVuXG4gKiAgICAgICAgcmVsYXRpdmUgdG8gdGhlIFNvdXJjZU1hcEdlbmVyYXRvci5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5hcHBseVNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl9hcHBseVNvdXJjZU1hcChhU291cmNlTWFwQ29uc3VtZXIsIGFTb3VyY2VGaWxlLCBhU291cmNlTWFwUGF0aCkge1xuICAgIHZhciBzb3VyY2VGaWxlID0gYVNvdXJjZUZpbGU7XG4gICAgLy8gSWYgYVNvdXJjZUZpbGUgaXMgb21pdHRlZCwgd2Ugd2lsbCB1c2UgdGhlIGZpbGUgcHJvcGVydHkgb2YgdGhlIFNvdXJjZU1hcFxuICAgIGlmIChhU291cmNlRmlsZSA9PSBudWxsKSB7XG4gICAgICBpZiAoYVNvdXJjZU1hcENvbnN1bWVyLmZpbGUgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1NvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUuYXBwbHlTb3VyY2VNYXAgcmVxdWlyZXMgZWl0aGVyIGFuIGV4cGxpY2l0IHNvdXJjZSBmaWxlLCAnICtcbiAgICAgICAgICAnb3IgdGhlIHNvdXJjZSBtYXBcXCdzIFwiZmlsZVwiIHByb3BlcnR5LiBCb3RoIHdlcmUgb21pdHRlZC4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBzb3VyY2VGaWxlID0gYVNvdXJjZU1hcENvbnN1bWVyLmZpbGU7XG4gICAgfVxuICAgIHZhciBzb3VyY2VSb290ID0gdGhpcy5fc291cmNlUm9vdDtcbiAgICAvLyBNYWtlIFwic291cmNlRmlsZVwiIHJlbGF0aXZlIGlmIGFuIGFic29sdXRlIFVybCBpcyBwYXNzZWQuXG4gICAgaWYgKHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgc291cmNlRmlsZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlRmlsZSk7XG4gICAgfVxuICAgIC8vIEFwcGx5aW5nIHRoZSBTb3VyY2VNYXAgY2FuIGFkZCBhbmQgcmVtb3ZlIGl0ZW1zIGZyb20gdGhlIHNvdXJjZXMgYW5kXG4gICAgLy8gdGhlIG5hbWVzIGFycmF5LlxuICAgIHZhciBuZXdTb3VyY2VzID0gbmV3IEFycmF5U2V0KCk7XG4gICAgdmFyIG5ld05hbWVzID0gbmV3IEFycmF5U2V0KCk7XG5cbiAgICAvLyBGaW5kIG1hcHBpbmdzIGZvciB0aGUgXCJzb3VyY2VGaWxlXCJcbiAgICB0aGlzLl9tYXBwaW5ncy51bnNvcnRlZEZvckVhY2goZnVuY3Rpb24gKG1hcHBpbmcpIHtcbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSA9PT0gc291cmNlRmlsZSAmJiBtYXBwaW5nLm9yaWdpbmFsTGluZSAhPSBudWxsKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIGl0IGNhbiBiZSBtYXBwZWQgYnkgdGhlIHNvdXJjZSBtYXAsIHRoZW4gdXBkYXRlIHRoZSBtYXBwaW5nLlxuICAgICAgICB2YXIgb3JpZ2luYWwgPSBhU291cmNlTWFwQ29uc3VtZXIub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgICAgICAgbGluZTogbWFwcGluZy5vcmlnaW5hbExpbmUsXG4gICAgICAgICAgY29sdW1uOiBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAob3JpZ2luYWwuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgICAvLyBDb3B5IG1hcHBpbmdcbiAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IG9yaWdpbmFsLnNvdXJjZTtcbiAgICAgICAgICBpZiAoYVNvdXJjZU1hcFBhdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgbWFwcGluZy5zb3VyY2UgPSB1dGlsLmpvaW4oYVNvdXJjZU1hcFBhdGgsIG1hcHBpbmcuc291cmNlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgbWFwcGluZy5zb3VyY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsTGluZSA9IG9yaWdpbmFsLmxpbmU7XG4gICAgICAgICAgbWFwcGluZy5vcmlnaW5hbENvbHVtbiA9IG9yaWdpbmFsLmNvbHVtbjtcbiAgICAgICAgICBpZiAob3JpZ2luYWwubmFtZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXBwaW5nLm5hbWUgPSBvcmlnaW5hbC5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgc291cmNlID0gbWFwcGluZy5zb3VyY2U7XG4gICAgICBpZiAoc291cmNlICE9IG51bGwgJiYgIW5ld1NvdXJjZXMuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgbmV3U291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5hbWUgPSBtYXBwaW5nLm5hbWU7XG4gICAgICBpZiAobmFtZSAhPSBudWxsICYmICFuZXdOYW1lcy5oYXMobmFtZSkpIHtcbiAgICAgICAgbmV3TmFtZXMuYWRkKG5hbWUpO1xuICAgICAgfVxuXG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5fc291cmNlcyA9IG5ld1NvdXJjZXM7XG4gICAgdGhpcy5fbmFtZXMgPSBuZXdOYW1lcztcblxuICAgIC8vIENvcHkgc291cmNlc0NvbnRlbnRzIG9mIGFwcGxpZWQgbWFwLlxuICAgIGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZUZpbGUpIHtcbiAgICAgIHZhciBjb250ZW50ID0gYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZUNvbnRlbnRGb3Ioc291cmNlRmlsZSk7XG4gICAgICBpZiAoY29udGVudCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChhU291cmNlTWFwUGF0aCAhPSBudWxsKSB7XG4gICAgICAgICAgc291cmNlRmlsZSA9IHV0aWwuam9pbihhU291cmNlTWFwUGF0aCwgc291cmNlRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICAgIHNvdXJjZUZpbGUgPSB1dGlsLnJlbGF0aXZlKHNvdXJjZVJvb3QsIHNvdXJjZUZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U291cmNlQ29udGVudChzb3VyY2VGaWxlLCBjb250ZW50KTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuLyoqXG4gKiBBIG1hcHBpbmcgY2FuIGhhdmUgb25lIG9mIHRoZSB0aHJlZSBsZXZlbHMgb2YgZGF0YTpcbiAqXG4gKiAgIDEuIEp1c3QgdGhlIGdlbmVyYXRlZCBwb3NpdGlvbi5cbiAqICAgMi4gVGhlIEdlbmVyYXRlZCBwb3NpdGlvbiwgb3JpZ2luYWwgcG9zaXRpb24sIGFuZCBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIDMuIEdlbmVyYXRlZCBhbmQgb3JpZ2luYWwgcG9zaXRpb24sIG9yaWdpbmFsIHNvdXJjZSwgYXMgd2VsbCBhcyBhIG5hbWVcbiAqICAgICAgdG9rZW4uXG4gKlxuICogVG8gbWFpbnRhaW4gY29uc2lzdGVuY3ksIHdlIHZhbGlkYXRlIHRoYXQgYW55IG5ldyBtYXBwaW5nIGJlaW5nIGFkZGVkIGZhbGxzXG4gKiBpbiB0byBvbmUgb2YgdGhlc2UgY2F0ZWdvcmllcy5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fdmFsaWRhdGVNYXBwaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3ZhbGlkYXRlTWFwcGluZyhhR2VuZXJhdGVkLCBhT3JpZ2luYWwsIGFTb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYU5hbWUpIHtcbiAgICBpZiAoYUdlbmVyYXRlZCAmJiAnbGluZScgaW4gYUdlbmVyYXRlZCAmJiAnY29sdW1uJyBpbiBhR2VuZXJhdGVkXG4gICAgICAgICYmIGFHZW5lcmF0ZWQubGluZSA+IDAgJiYgYUdlbmVyYXRlZC5jb2x1bW4gPj0gMFxuICAgICAgICAmJiAhYU9yaWdpbmFsICYmICFhU291cmNlICYmICFhTmFtZSkge1xuICAgICAgLy8gQ2FzZSAxLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIGlmIChhR2VuZXJhdGVkICYmICdsaW5lJyBpbiBhR2VuZXJhdGVkICYmICdjb2x1bW4nIGluIGFHZW5lcmF0ZWRcbiAgICAgICAgICAgICAmJiBhT3JpZ2luYWwgJiYgJ2xpbmUnIGluIGFPcmlnaW5hbCAmJiAnY29sdW1uJyBpbiBhT3JpZ2luYWxcbiAgICAgICAgICAgICAmJiBhR2VuZXJhdGVkLmxpbmUgPiAwICYmIGFHZW5lcmF0ZWQuY29sdW1uID49IDBcbiAgICAgICAgICAgICAmJiBhT3JpZ2luYWwubGluZSA+IDAgJiYgYU9yaWdpbmFsLmNvbHVtbiA+PSAwXG4gICAgICAgICAgICAgJiYgYVNvdXJjZSkge1xuICAgICAgLy8gQ2FzZXMgMiBhbmQgMy5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbWFwcGluZzogJyArIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgZ2VuZXJhdGVkOiBhR2VuZXJhdGVkLFxuICAgICAgICBzb3VyY2U6IGFTb3VyY2UsXG4gICAgICAgIG9yaWdpbmFsOiBhT3JpZ2luYWwsXG4gICAgICAgIG5hbWU6IGFOYW1lXG4gICAgICB9KSk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFNlcmlhbGl6ZSB0aGUgYWNjdW11bGF0ZWQgbWFwcGluZ3MgaW4gdG8gdGhlIHN0cmVhbSBvZiBiYXNlIDY0IFZMUXNcbiAqIHNwZWNpZmllZCBieSB0aGUgc291cmNlIG1hcCBmb3JtYXQuXG4gKi9cblNvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUuX3NlcmlhbGl6ZU1hcHBpbmdzID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3NlcmlhbGl6ZU1hcHBpbmdzKCkge1xuICAgIHZhciBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgdmFyIHByZXZpb3VzR2VuZXJhdGVkTGluZSA9IDE7XG4gICAgdmFyIHByZXZpb3VzT3JpZ2luYWxDb2x1bW4gPSAwO1xuICAgIHZhciBwcmV2aW91c09yaWdpbmFsTGluZSA9IDA7XG4gICAgdmFyIHByZXZpb3VzTmFtZSA9IDA7XG4gICAgdmFyIHByZXZpb3VzU291cmNlID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIG5leHQ7XG4gICAgdmFyIG1hcHBpbmc7XG4gICAgdmFyIG5hbWVJZHg7XG4gICAgdmFyIHNvdXJjZUlkeDtcblxuICAgIHZhciBtYXBwaW5ncyA9IHRoaXMuX21hcHBpbmdzLnRvQXJyYXkoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbWFwcGluZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG1hcHBpbmcgPSBtYXBwaW5nc1tpXTtcbiAgICAgIG5leHQgPSAnJ1xuXG4gICAgICBpZiAobWFwcGluZy5nZW5lcmF0ZWRMaW5lICE9PSBwcmV2aW91c0dlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICAgICAgICB3aGlsZSAobWFwcGluZy5nZW5lcmF0ZWRMaW5lICE9PSBwcmV2aW91c0dlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgICBuZXh0ICs9ICc7JztcbiAgICAgICAgICBwcmV2aW91c0dlbmVyYXRlZExpbmUrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgIGlmICghdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZChtYXBwaW5nLCBtYXBwaW5nc1tpIC0gMV0pKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dCArPSAnLCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uKTtcbiAgICAgIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uID0gbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW47XG5cbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIHNvdXJjZUlkeCA9IHRoaXMuX3NvdXJjZXMuaW5kZXhPZihtYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIG5leHQgKz0gYmFzZTY0VkxRLmVuY29kZShzb3VyY2VJZHggLSBwcmV2aW91c1NvdXJjZSk7XG4gICAgICAgIHByZXZpb3VzU291cmNlID0gc291cmNlSWR4O1xuXG4gICAgICAgIC8vIGxpbmVzIGFyZSBzdG9yZWQgMC1iYXNlZCBpbiBTb3VyY2VNYXAgc3BlYyB2ZXJzaW9uIDNcbiAgICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKG1hcHBpbmcub3JpZ2luYWxMaW5lIC0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIHByZXZpb3VzT3JpZ2luYWxMaW5lKTtcbiAgICAgICAgcHJldmlvdXNPcmlnaW5hbExpbmUgPSBtYXBwaW5nLm9yaWdpbmFsTGluZSAtIDE7XG5cbiAgICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKG1hcHBpbmcub3JpZ2luYWxDb2x1bW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBwcmV2aW91c09yaWdpbmFsQ29sdW1uKTtcbiAgICAgICAgcHJldmlvdXNPcmlnaW5hbENvbHVtbiA9IG1hcHBpbmcub3JpZ2luYWxDb2x1bW47XG5cbiAgICAgICAgaWYgKG1hcHBpbmcubmFtZSAhPSBudWxsKSB7XG4gICAgICAgICAgbmFtZUlkeCA9IHRoaXMuX25hbWVzLmluZGV4T2YobWFwcGluZy5uYW1lKTtcbiAgICAgICAgICBuZXh0ICs9IGJhc2U2NFZMUS5lbmNvZGUobmFtZUlkeCAtIHByZXZpb3VzTmFtZSk7XG4gICAgICAgICAgcHJldmlvdXNOYW1lID0gbmFtZUlkeDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXN1bHQgKz0gbmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLl9nZW5lcmF0ZVNvdXJjZXNDb250ZW50ID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX2dlbmVyYXRlU291cmNlc0NvbnRlbnQoYVNvdXJjZXMsIGFTb3VyY2VSb290KSB7XG4gICAgcmV0dXJuIGFTb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICBpZiAoIXRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChhU291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgIHNvdXJjZSA9IHV0aWwucmVsYXRpdmUoYVNvdXJjZVJvb3QsIHNvdXJjZSk7XG4gICAgICB9XG4gICAgICB2YXIga2V5ID0gdXRpbC50b1NldFN0cmluZyhzb3VyY2UpO1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLl9zb3VyY2VzQ29udGVudHMsIGtleSlcbiAgICAgICAgPyB0aGlzLl9zb3VyY2VzQ29udGVudHNba2V5XVxuICAgICAgICA6IG51bGw7XG4gICAgfSwgdGhpcyk7XG4gIH07XG5cbi8qKlxuICogRXh0ZXJuYWxpemUgdGhlIHNvdXJjZSBtYXAuXG4gKi9cblNvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUudG9KU09OID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3RvSlNPTigpIHtcbiAgICB2YXIgbWFwID0ge1xuICAgICAgdmVyc2lvbjogdGhpcy5fdmVyc2lvbixcbiAgICAgIHNvdXJjZXM6IHRoaXMuX3NvdXJjZXMudG9BcnJheSgpLFxuICAgICAgbmFtZXM6IHRoaXMuX25hbWVzLnRvQXJyYXkoKSxcbiAgICAgIG1hcHBpbmdzOiB0aGlzLl9zZXJpYWxpemVNYXBwaW5ncygpXG4gICAgfTtcbiAgICBpZiAodGhpcy5fZmlsZSAhPSBudWxsKSB7XG4gICAgICBtYXAuZmlsZSA9IHRoaXMuX2ZpbGU7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIG1hcC5zb3VyY2VSb290ID0gdGhpcy5fc291cmNlUm9vdDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgbWFwLnNvdXJjZXNDb250ZW50ID0gdGhpcy5fZ2VuZXJhdGVTb3VyY2VzQ29udGVudChtYXAuc291cmNlcywgbWFwLnNvdXJjZVJvb3QpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXA7XG4gIH07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBzb3VyY2UgbWFwIGJlaW5nIGdlbmVyYXRlZCB0byBhIHN0cmluZy5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS50b1N0cmluZyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl90b1N0cmluZygpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy50b0pTT04oKSk7XG4gIH07XG5cbmV4cG9ydHMuU291cmNlTWFwR2VuZXJhdG9yID0gU291cmNlTWFwR2VuZXJhdG9yO1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgU291cmNlTWFwR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9zb3VyY2UtbWFwLWdlbmVyYXRvcicpLlNvdXJjZU1hcEdlbmVyYXRvcjtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8vIE1hdGNoZXMgYSBXaW5kb3dzLXN0eWxlIGBcXHJcXG5gIG5ld2xpbmUgb3IgYSBgXFxuYCBuZXdsaW5lIHVzZWQgYnkgYWxsIG90aGVyXG4vLyBvcGVyYXRpbmcgc3lzdGVtcyB0aGVzZSBkYXlzIChjYXB0dXJpbmcgdGhlIHJlc3VsdCkuXG52YXIgUkVHRVhfTkVXTElORSA9IC8oXFxyP1xcbikvO1xuXG4vLyBOZXdsaW5lIGNoYXJhY3RlciBjb2RlIGZvciBjaGFyQ29kZUF0KCkgY29tcGFyaXNvbnNcbnZhciBORVdMSU5FX0NPREUgPSAxMDtcblxuLy8gUHJpdmF0ZSBzeW1ib2wgZm9yIGlkZW50aWZ5aW5nIGBTb3VyY2VOb2RlYHMgd2hlbiBtdWx0aXBsZSB2ZXJzaW9ucyBvZlxuLy8gdGhlIHNvdXJjZS1tYXAgbGlicmFyeSBhcmUgbG9hZGVkLiBUaGlzIE1VU1QgTk9UIENIQU5HRSBhY3Jvc3Ncbi8vIHZlcnNpb25zIVxudmFyIGlzU291cmNlTm9kZSA9IFwiJCQkaXNTb3VyY2VOb2RlJCQkXCI7XG5cbi8qKlxuICogU291cmNlTm9kZXMgcHJvdmlkZSBhIHdheSB0byBhYnN0cmFjdCBvdmVyIGludGVycG9sYXRpbmcvY29uY2F0ZW5hdGluZ1xuICogc25pcHBldHMgb2YgZ2VuZXJhdGVkIEphdmFTY3JpcHQgc291cmNlIGNvZGUgd2hpbGUgbWFpbnRhaW5pbmcgdGhlIGxpbmUgYW5kXG4gKiBjb2x1bW4gaW5mb3JtYXRpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBvcmlnaW5hbCBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcGFyYW0gYUxpbmUgVGhlIG9yaWdpbmFsIGxpbmUgbnVtYmVyLlxuICogQHBhcmFtIGFDb2x1bW4gVGhlIG9yaWdpbmFsIGNvbHVtbiBudW1iZXIuXG4gKiBAcGFyYW0gYVNvdXJjZSBUaGUgb3JpZ2luYWwgc291cmNlJ3MgZmlsZW5hbWUuXG4gKiBAcGFyYW0gYUNodW5rcyBPcHRpb25hbC4gQW4gYXJyYXkgb2Ygc3RyaW5ncyB3aGljaCBhcmUgc25pcHBldHMgb2ZcbiAqICAgICAgICBnZW5lcmF0ZWQgSlMsIG9yIG90aGVyIFNvdXJjZU5vZGVzLlxuICogQHBhcmFtIGFOYW1lIFRoZSBvcmlnaW5hbCBpZGVudGlmaWVyLlxuICovXG5mdW5jdGlvbiBTb3VyY2VOb2RlKGFMaW5lLCBhQ29sdW1uLCBhU291cmNlLCBhQ2h1bmtzLCBhTmFtZSkge1xuICB0aGlzLmNoaWxkcmVuID0gW107XG4gIHRoaXMuc291cmNlQ29udGVudHMgPSB7fTtcbiAgdGhpcy5saW5lID0gYUxpbmUgPT0gbnVsbCA/IG51bGwgOiBhTGluZTtcbiAgdGhpcy5jb2x1bW4gPSBhQ29sdW1uID09IG51bGwgPyBudWxsIDogYUNvbHVtbjtcbiAgdGhpcy5zb3VyY2UgPSBhU291cmNlID09IG51bGwgPyBudWxsIDogYVNvdXJjZTtcbiAgdGhpcy5uYW1lID0gYU5hbWUgPT0gbnVsbCA/IG51bGwgOiBhTmFtZTtcbiAgdGhpc1tpc1NvdXJjZU5vZGVdID0gdHJ1ZTtcbiAgaWYgKGFDaHVua3MgIT0gbnVsbCkgdGhpcy5hZGQoYUNodW5rcyk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIFNvdXJjZU5vZGUgZnJvbSBnZW5lcmF0ZWQgY29kZSBhbmQgYSBTb3VyY2VNYXBDb25zdW1lci5cbiAqXG4gKiBAcGFyYW0gYUdlbmVyYXRlZENvZGUgVGhlIGdlbmVyYXRlZCBjb2RlXG4gKiBAcGFyYW0gYVNvdXJjZU1hcENvbnN1bWVyIFRoZSBTb3VyY2VNYXAgZm9yIHRoZSBnZW5lcmF0ZWQgY29kZVxuICogQHBhcmFtIGFSZWxhdGl2ZVBhdGggT3B0aW9uYWwuIFRoZSBwYXRoIHRoYXQgcmVsYXRpdmUgc291cmNlcyBpbiB0aGVcbiAqICAgICAgICBTb3VyY2VNYXBDb25zdW1lciBzaG91bGQgYmUgcmVsYXRpdmUgdG8uXG4gKi9cblNvdXJjZU5vZGUuZnJvbVN0cmluZ1dpdGhTb3VyY2VNYXAgPVxuICBmdW5jdGlvbiBTb3VyY2VOb2RlX2Zyb21TdHJpbmdXaXRoU291cmNlTWFwKGFHZW5lcmF0ZWRDb2RlLCBhU291cmNlTWFwQ29uc3VtZXIsIGFSZWxhdGl2ZVBhdGgpIHtcbiAgICAvLyBUaGUgU291cmNlTm9kZSB3ZSB3YW50IHRvIGZpbGwgd2l0aCB0aGUgZ2VuZXJhdGVkIGNvZGVcbiAgICAvLyBhbmQgdGhlIFNvdXJjZU1hcFxuICAgIHZhciBub2RlID0gbmV3IFNvdXJjZU5vZGUoKTtcblxuICAgIC8vIEFsbCBldmVuIGluZGljZXMgb2YgdGhpcyBhcnJheSBhcmUgb25lIGxpbmUgb2YgdGhlIGdlbmVyYXRlZCBjb2RlLFxuICAgIC8vIHdoaWxlIGFsbCBvZGQgaW5kaWNlcyBhcmUgdGhlIG5ld2xpbmVzIGJldHdlZW4gdHdvIGFkamFjZW50IGxpbmVzXG4gICAgLy8gKHNpbmNlIGBSRUdFWF9ORVdMSU5FYCBjYXB0dXJlcyBpdHMgbWF0Y2gpLlxuICAgIC8vIFByb2Nlc3NlZCBmcmFnbWVudHMgYXJlIHJlbW92ZWQgZnJvbSB0aGlzIGFycmF5LCBieSBjYWxsaW5nIGBzaGlmdE5leHRMaW5lYC5cbiAgICB2YXIgcmVtYWluaW5nTGluZXMgPSBhR2VuZXJhdGVkQ29kZS5zcGxpdChSRUdFWF9ORVdMSU5FKTtcbiAgICB2YXIgc2hpZnROZXh0TGluZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxpbmVDb250ZW50cyA9IHJlbWFpbmluZ0xpbmVzLnNoaWZ0KCk7XG4gICAgICAvLyBUaGUgbGFzdCBsaW5lIG9mIGEgZmlsZSBtaWdodCBub3QgaGF2ZSBhIG5ld2xpbmUuXG4gICAgICB2YXIgbmV3TGluZSA9IHJlbWFpbmluZ0xpbmVzLnNoaWZ0KCkgfHwgXCJcIjtcbiAgICAgIHJldHVybiBsaW5lQ29udGVudHMgKyBuZXdMaW5lO1xuICAgIH07XG5cbiAgICAvLyBXZSBuZWVkIHRvIHJlbWVtYmVyIHRoZSBwb3NpdGlvbiBvZiBcInJlbWFpbmluZ0xpbmVzXCJcbiAgICB2YXIgbGFzdEdlbmVyYXRlZExpbmUgPSAxLCBsYXN0R2VuZXJhdGVkQ29sdW1uID0gMDtcblxuICAgIC8vIFRoZSBnZW5lcmF0ZSBTb3VyY2VOb2RlcyB3ZSBuZWVkIGEgY29kZSByYW5nZS5cbiAgICAvLyBUbyBleHRyYWN0IGl0IGN1cnJlbnQgYW5kIGxhc3QgbWFwcGluZyBpcyB1c2VkLlxuICAgIC8vIEhlcmUgd2Ugc3RvcmUgdGhlIGxhc3QgbWFwcGluZy5cbiAgICB2YXIgbGFzdE1hcHBpbmcgPSBudWxsO1xuXG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLmVhY2hNYXBwaW5nKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgICBpZiAobGFzdE1hcHBpbmcgIT09IG51bGwpIHtcbiAgICAgICAgLy8gV2UgYWRkIHRoZSBjb2RlIGZyb20gXCJsYXN0TWFwcGluZ1wiIHRvIFwibWFwcGluZ1wiOlxuICAgICAgICAvLyBGaXJzdCBjaGVjayBpZiB0aGVyZSBpcyBhIG5ldyBsaW5lIGluIGJldHdlZW4uXG4gICAgICAgIGlmIChsYXN0R2VuZXJhdGVkTGluZSA8IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSkge1xuICAgICAgICAgIC8vIEFzc29jaWF0ZSBmaXJzdCBsaW5lIHdpdGggXCJsYXN0TWFwcGluZ1wiXG4gICAgICAgICAgYWRkTWFwcGluZ1dpdGhDb2RlKGxhc3RNYXBwaW5nLCBzaGlmdE5leHRMaW5lKCkpO1xuICAgICAgICAgIGxhc3RHZW5lcmF0ZWRMaW5lKys7XG4gICAgICAgICAgbGFzdEdlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgICAgICAgLy8gVGhlIHJlbWFpbmluZyBjb2RlIGlzIGFkZGVkIHdpdGhvdXQgbWFwcGluZ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZXJlIGlzIG5vIG5ldyBsaW5lIGluIGJldHdlZW4uXG4gICAgICAgICAgLy8gQXNzb2NpYXRlIHRoZSBjb2RlIGJldHdlZW4gXCJsYXN0R2VuZXJhdGVkQ29sdW1uXCIgYW5kXG4gICAgICAgICAgLy8gXCJtYXBwaW5nLmdlbmVyYXRlZENvbHVtblwiIHdpdGggXCJsYXN0TWFwcGluZ1wiXG4gICAgICAgICAgdmFyIG5leHRMaW5lID0gcmVtYWluaW5nTGluZXNbMF07XG4gICAgICAgICAgdmFyIGNvZGUgPSBuZXh0TGluZS5zdWJzdHIoMCwgbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgICAgIHJlbWFpbmluZ0xpbmVzWzBdID0gbmV4dExpbmUuc3Vic3RyKG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uIC1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uKTtcbiAgICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uID0gbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW47XG4gICAgICAgICAgYWRkTWFwcGluZ1dpdGhDb2RlKGxhc3RNYXBwaW5nLCBjb2RlKTtcbiAgICAgICAgICAvLyBObyBtb3JlIHJlbWFpbmluZyBjb2RlLCBjb250aW51ZVxuICAgICAgICAgIGxhc3RNYXBwaW5nID0gbWFwcGluZztcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIFdlIGFkZCB0aGUgZ2VuZXJhdGVkIGNvZGUgdW50aWwgdGhlIGZpcnN0IG1hcHBpbmdcbiAgICAgIC8vIHRvIHRoZSBTb3VyY2VOb2RlIHdpdGhvdXQgYW55IG1hcHBpbmcuXG4gICAgICAvLyBFYWNoIGxpbmUgaXMgYWRkZWQgYXMgc2VwYXJhdGUgc3RyaW5nLlxuICAgICAgd2hpbGUgKGxhc3RHZW5lcmF0ZWRMaW5lIDwgbWFwcGluZy5nZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgIG5vZGUuYWRkKHNoaWZ0TmV4dExpbmUoKSk7XG4gICAgICAgIGxhc3RHZW5lcmF0ZWRMaW5lKys7XG4gICAgICB9XG4gICAgICBpZiAobGFzdEdlbmVyYXRlZENvbHVtbiA8IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uKSB7XG4gICAgICAgIHZhciBuZXh0TGluZSA9IHJlbWFpbmluZ0xpbmVzWzBdO1xuICAgICAgICBub2RlLmFkZChuZXh0TGluZS5zdWJzdHIoMCwgbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4pKTtcbiAgICAgICAgcmVtYWluaW5nTGluZXNbMF0gPSBuZXh0TGluZS5zdWJzdHIobWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uID0gbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW47XG4gICAgICB9XG4gICAgICBsYXN0TWFwcGluZyA9IG1hcHBpbmc7XG4gICAgfSwgdGhpcyk7XG4gICAgLy8gV2UgaGF2ZSBwcm9jZXNzZWQgYWxsIG1hcHBpbmdzLlxuICAgIGlmIChyZW1haW5pbmdMaW5lcy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAobGFzdE1hcHBpbmcpIHtcbiAgICAgICAgLy8gQXNzb2NpYXRlIHRoZSByZW1haW5pbmcgY29kZSBpbiB0aGUgY3VycmVudCBsaW5lIHdpdGggXCJsYXN0TWFwcGluZ1wiXG4gICAgICAgIGFkZE1hcHBpbmdXaXRoQ29kZShsYXN0TWFwcGluZywgc2hpZnROZXh0TGluZSgpKTtcbiAgICAgIH1cbiAgICAgIC8vIGFuZCBhZGQgdGhlIHJlbWFpbmluZyBsaW5lcyB3aXRob3V0IGFueSBtYXBwaW5nXG4gICAgICBub2RlLmFkZChyZW1haW5pbmdMaW5lcy5qb2luKFwiXCIpKTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IHNvdXJjZXNDb250ZW50IGludG8gU291cmNlTm9kZVxuICAgIGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZUZpbGUpIHtcbiAgICAgIHZhciBjb250ZW50ID0gYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZUNvbnRlbnRGb3Ioc291cmNlRmlsZSk7XG4gICAgICBpZiAoY29udGVudCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChhUmVsYXRpdmVQYXRoICE9IG51bGwpIHtcbiAgICAgICAgICBzb3VyY2VGaWxlID0gdXRpbC5qb2luKGFSZWxhdGl2ZVBhdGgsIHNvdXJjZUZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUuc2V0U291cmNlQ29udGVudChzb3VyY2VGaWxlLCBjb250ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBub2RlO1xuXG4gICAgZnVuY3Rpb24gYWRkTWFwcGluZ1dpdGhDb2RlKG1hcHBpbmcsIGNvZGUpIHtcbiAgICAgIGlmIChtYXBwaW5nID09PSBudWxsIHx8IG1hcHBpbmcuc291cmNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm9kZS5hZGQoY29kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc291cmNlID0gYVJlbGF0aXZlUGF0aFxuICAgICAgICAgID8gdXRpbC5qb2luKGFSZWxhdGl2ZVBhdGgsIG1hcHBpbmcuc291cmNlKVxuICAgICAgICAgIDogbWFwcGluZy5zb3VyY2U7XG4gICAgICAgIG5vZGUuYWRkKG5ldyBTb3VyY2VOb2RlKG1hcHBpbmcub3JpZ2luYWxMaW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBpbmcubmFtZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBBZGQgYSBjaHVuayBvZiBnZW5lcmF0ZWQgSlMgdG8gdGhpcyBzb3VyY2Ugbm9kZS5cbiAqXG4gKiBAcGFyYW0gYUNodW5rIEEgc3RyaW5nIHNuaXBwZXQgb2YgZ2VuZXJhdGVkIEpTIGNvZGUsIGFub3RoZXIgaW5zdGFuY2Ugb2ZcbiAqICAgICAgICBTb3VyY2VOb2RlLCBvciBhbiBhcnJheSB3aGVyZSBlYWNoIG1lbWJlciBpcyBvbmUgb2YgdGhvc2UgdGhpbmdzLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX2FkZChhQ2h1bmspIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYUNodW5rKSkge1xuICAgIGFDaHVuay5mb3JFYWNoKGZ1bmN0aW9uIChjaHVuaykge1xuICAgICAgdGhpcy5hZGQoY2h1bmspO1xuICAgIH0sIHRoaXMpO1xuICB9XG4gIGVsc2UgaWYgKGFDaHVua1tpc1NvdXJjZU5vZGVdIHx8IHR5cGVvZiBhQ2h1bmsgPT09IFwic3RyaW5nXCIpIHtcbiAgICBpZiAoYUNodW5rKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuLnB1c2goYUNodW5rKTtcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgIFwiRXhwZWN0ZWQgYSBTb3VyY2VOb2RlLCBzdHJpbmcsIG9yIGFuIGFycmF5IG9mIFNvdXJjZU5vZGVzIGFuZCBzdHJpbmdzLiBHb3QgXCIgKyBhQ2h1bmtcbiAgICApO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSBjaHVuayBvZiBnZW5lcmF0ZWQgSlMgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGlzIHNvdXJjZSBub2RlLlxuICpcbiAqIEBwYXJhbSBhQ2h1bmsgQSBzdHJpbmcgc25pcHBldCBvZiBnZW5lcmF0ZWQgSlMgY29kZSwgYW5vdGhlciBpbnN0YW5jZSBvZlxuICogICAgICAgIFNvdXJjZU5vZGUsIG9yIGFuIGFycmF5IHdoZXJlIGVhY2ggbWVtYmVyIGlzIG9uZSBvZiB0aG9zZSB0aGluZ3MuXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLnByZXBlbmQgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX3ByZXBlbmQoYUNodW5rKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFDaHVuaykpIHtcbiAgICBmb3IgKHZhciBpID0gYUNodW5rLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5wcmVwZW5kKGFDaHVua1tpXSk7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKGFDaHVua1tpc1NvdXJjZU5vZGVdIHx8IHR5cGVvZiBhQ2h1bmsgPT09IFwic3RyaW5nXCIpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnVuc2hpZnQoYUNodW5rKTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgXCJFeHBlY3RlZCBhIFNvdXJjZU5vZGUsIHN0cmluZywgb3IgYW4gYXJyYXkgb2YgU291cmNlTm9kZXMgYW5kIHN0cmluZ3MuIEdvdCBcIiArIGFDaHVua1xuICAgICk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdhbGsgb3ZlciB0aGUgdHJlZSBvZiBKUyBzbmlwcGV0cyBpbiB0aGlzIG5vZGUgYW5kIGl0cyBjaGlsZHJlbi4gVGhlXG4gKiB3YWxraW5nIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbmNlIGZvciBlYWNoIHNuaXBwZXQgb2YgSlMgYW5kIGlzIHBhc3NlZCB0aGF0XG4gKiBzbmlwcGV0IGFuZCB0aGUgaXRzIG9yaWdpbmFsIGFzc29jaWF0ZWQgc291cmNlJ3MgbGluZS9jb2x1bW4gbG9jYXRpb24uXG4gKlxuICogQHBhcmFtIGFGbiBUaGUgdHJhdmVyc2FsIGZ1bmN0aW9uLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS53YWxrID0gZnVuY3Rpb24gU291cmNlTm9kZV93YWxrKGFGbikge1xuICB2YXIgY2h1bms7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY2h1bmsgPSB0aGlzLmNoaWxkcmVuW2ldO1xuICAgIGlmIChjaHVua1tpc1NvdXJjZU5vZGVdKSB7XG4gICAgICBjaHVuay53YWxrKGFGbik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKGNodW5rICE9PSAnJykge1xuICAgICAgICBhRm4oY2h1bmssIHsgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMubGluZSxcbiAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogdGhpcy5jb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIExpa2UgYFN0cmluZy5wcm90b3R5cGUuam9pbmAgZXhjZXB0IGZvciBTb3VyY2VOb2Rlcy4gSW5zZXJ0cyBgYVN0cmAgYmV0d2VlblxuICogZWFjaCBvZiBgdGhpcy5jaGlsZHJlbmAuXG4gKlxuICogQHBhcmFtIGFTZXAgVGhlIHNlcGFyYXRvci5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUuam9pbiA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfam9pbihhU2VwKSB7XG4gIHZhciBuZXdDaGlsZHJlbjtcbiAgdmFyIGk7XG4gIHZhciBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgaWYgKGxlbiA+IDApIHtcbiAgICBuZXdDaGlsZHJlbiA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW4tMTsgaSsrKSB7XG4gICAgICBuZXdDaGlsZHJlbi5wdXNoKHRoaXMuY2hpbGRyZW5baV0pO1xuICAgICAgbmV3Q2hpbGRyZW4ucHVzaChhU2VwKTtcbiAgICB9XG4gICAgbmV3Q2hpbGRyZW4ucHVzaCh0aGlzLmNoaWxkcmVuW2ldKTtcbiAgICB0aGlzLmNoaWxkcmVuID0gbmV3Q2hpbGRyZW47XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENhbGwgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlIG9uIHRoZSB2ZXJ5IHJpZ2h0LW1vc3Qgc291cmNlIHNuaXBwZXQuIFVzZWZ1bFxuICogZm9yIHRyaW1taW5nIHdoaXRlc3BhY2UgZnJvbSB0aGUgZW5kIG9mIGEgc291cmNlIG5vZGUsIGV0Yy5cbiAqXG4gKiBAcGFyYW0gYVBhdHRlcm4gVGhlIHBhdHRlcm4gdG8gcmVwbGFjZS5cbiAqIEBwYXJhbSBhUmVwbGFjZW1lbnQgVGhlIHRoaW5nIHRvIHJlcGxhY2UgdGhlIHBhdHRlcm4gd2l0aC5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUucmVwbGFjZVJpZ2h0ID0gZnVuY3Rpb24gU291cmNlTm9kZV9yZXBsYWNlUmlnaHQoYVBhdHRlcm4sIGFSZXBsYWNlbWVudCkge1xuICB2YXIgbGFzdENoaWxkID0gdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xuICBpZiAobGFzdENoaWxkW2lzU291cmNlTm9kZV0pIHtcbiAgICBsYXN0Q2hpbGQucmVwbGFjZVJpZ2h0KGFQYXR0ZXJuLCBhUmVwbGFjZW1lbnQpO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBsYXN0Q2hpbGQgPT09ICdzdHJpbmcnKSB7XG4gICAgdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdID0gbGFzdENoaWxkLnJlcGxhY2UoYVBhdHRlcm4sIGFSZXBsYWNlbWVudCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKCcnLnJlcGxhY2UoYVBhdHRlcm4sIGFSZXBsYWNlbWVudCkpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIHNvdXJjZSBjb250ZW50IGZvciBhIHNvdXJjZSBmaWxlLiBUaGlzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIFNvdXJjZU1hcEdlbmVyYXRvclxuICogaW4gdGhlIHNvdXJjZXNDb250ZW50IGZpZWxkLlxuICpcbiAqIEBwYXJhbSBhU291cmNlRmlsZSBUaGUgZmlsZW5hbWUgb2YgdGhlIHNvdXJjZSBmaWxlXG4gKiBAcGFyYW0gYVNvdXJjZUNvbnRlbnQgVGhlIGNvbnRlbnQgb2YgdGhlIHNvdXJjZSBmaWxlXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLnNldFNvdXJjZUNvbnRlbnQgPVxuICBmdW5jdGlvbiBTb3VyY2VOb2RlX3NldFNvdXJjZUNvbnRlbnQoYVNvdXJjZUZpbGUsIGFTb3VyY2VDb250ZW50KSB7XG4gICAgdGhpcy5zb3VyY2VDb250ZW50c1t1dGlsLnRvU2V0U3RyaW5nKGFTb3VyY2VGaWxlKV0gPSBhU291cmNlQ29udGVudDtcbiAgfTtcblxuLyoqXG4gKiBXYWxrIG92ZXIgdGhlIHRyZWUgb2YgU291cmNlTm9kZXMuIFRoZSB3YWxraW5nIGZ1bmN0aW9uIGlzIGNhbGxlZCBmb3IgZWFjaFxuICogc291cmNlIGZpbGUgY29udGVudCBhbmQgaXMgcGFzc2VkIHRoZSBmaWxlbmFtZSBhbmQgc291cmNlIGNvbnRlbnQuXG4gKlxuICogQHBhcmFtIGFGbiBUaGUgdHJhdmVyc2FsIGZ1bmN0aW9uLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS53YWxrU291cmNlQ29udGVudHMgPVxuICBmdW5jdGlvbiBTb3VyY2VOb2RlX3dhbGtTb3VyY2VDb250ZW50cyhhRm4pIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHRoaXMuY2hpbGRyZW5baV1baXNTb3VyY2VOb2RlXSkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLndhbGtTb3VyY2VDb250ZW50cyhhRm4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzb3VyY2VzID0gT2JqZWN0LmtleXModGhpcy5zb3VyY2VDb250ZW50cyk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNvdXJjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFGbih1dGlsLmZyb21TZXRTdHJpbmcoc291cmNlc1tpXSksIHRoaXMuc291cmNlQ29udGVudHNbc291cmNlc1tpXV0pO1xuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHNvdXJjZSBub2RlLiBXYWxrcyBvdmVyIHRoZSB0cmVlXG4gKiBhbmQgY29uY2F0ZW5hdGVzIGFsbCB0aGUgdmFyaW91cyBzbmlwcGV0cyB0b2dldGhlciB0byBvbmUgc3RyaW5nLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfdG9TdHJpbmcoKSB7XG4gIHZhciBzdHIgPSBcIlwiO1xuICB0aGlzLndhbGsoZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgc3RyICs9IGNodW5rO1xuICB9KTtcbiAgcmV0dXJuIHN0cjtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgc291cmNlIG5vZGUgYWxvbmcgd2l0aCBhIHNvdXJjZVxuICogbWFwLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS50b1N0cmluZ1dpdGhTb3VyY2VNYXAgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX3RvU3RyaW5nV2l0aFNvdXJjZU1hcChhQXJncykge1xuICB2YXIgZ2VuZXJhdGVkID0ge1xuICAgIGNvZGU6IFwiXCIsXG4gICAgbGluZTogMSxcbiAgICBjb2x1bW46IDBcbiAgfTtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoYUFyZ3MpO1xuICB2YXIgc291cmNlTWFwcGluZ0FjdGl2ZSA9IGZhbHNlO1xuICB2YXIgbGFzdE9yaWdpbmFsU291cmNlID0gbnVsbDtcbiAgdmFyIGxhc3RPcmlnaW5hbExpbmUgPSBudWxsO1xuICB2YXIgbGFzdE9yaWdpbmFsQ29sdW1uID0gbnVsbDtcbiAgdmFyIGxhc3RPcmlnaW5hbE5hbWUgPSBudWxsO1xuICB0aGlzLndhbGsoZnVuY3Rpb24gKGNodW5rLCBvcmlnaW5hbCkge1xuICAgIGdlbmVyYXRlZC5jb2RlICs9IGNodW5rO1xuICAgIGlmIChvcmlnaW5hbC5zb3VyY2UgIT09IG51bGxcbiAgICAgICAgJiYgb3JpZ2luYWwubGluZSAhPT0gbnVsbFxuICAgICAgICAmJiBvcmlnaW5hbC5jb2x1bW4gIT09IG51bGwpIHtcbiAgICAgIGlmKGxhc3RPcmlnaW5hbFNvdXJjZSAhPT0gb3JpZ2luYWwuc291cmNlXG4gICAgICAgICB8fCBsYXN0T3JpZ2luYWxMaW5lICE9PSBvcmlnaW5hbC5saW5lXG4gICAgICAgICB8fCBsYXN0T3JpZ2luYWxDb2x1bW4gIT09IG9yaWdpbmFsLmNvbHVtblxuICAgICAgICAgfHwgbGFzdE9yaWdpbmFsTmFtZSAhPT0gb3JpZ2luYWwubmFtZSkge1xuICAgICAgICBtYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgc291cmNlOiBvcmlnaW5hbC5zb3VyY2UsXG4gICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgIGxpbmU6IG9yaWdpbmFsLmxpbmUsXG4gICAgICAgICAgICBjb2x1bW46IG9yaWdpbmFsLmNvbHVtblxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgICBsaW5lOiBnZW5lcmF0ZWQubGluZSxcbiAgICAgICAgICAgIGNvbHVtbjogZ2VuZXJhdGVkLmNvbHVtblxuICAgICAgICAgIH0sXG4gICAgICAgICAgbmFtZTogb3JpZ2luYWwubmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGxhc3RPcmlnaW5hbFNvdXJjZSA9IG9yaWdpbmFsLnNvdXJjZTtcbiAgICAgIGxhc3RPcmlnaW5hbExpbmUgPSBvcmlnaW5hbC5saW5lO1xuICAgICAgbGFzdE9yaWdpbmFsQ29sdW1uID0gb3JpZ2luYWwuY29sdW1uO1xuICAgICAgbGFzdE9yaWdpbmFsTmFtZSA9IG9yaWdpbmFsLm5hbWU7XG4gICAgICBzb3VyY2VNYXBwaW5nQWN0aXZlID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHNvdXJjZU1hcHBpbmdBY3RpdmUpIHtcbiAgICAgIG1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgbGluZTogZ2VuZXJhdGVkLmxpbmUsXG4gICAgICAgICAgY29sdW1uOiBnZW5lcmF0ZWQuY29sdW1uXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbGFzdE9yaWdpbmFsU291cmNlID0gbnVsbDtcbiAgICAgIHNvdXJjZU1hcHBpbmdBY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gICAgZm9yICh2YXIgaWR4ID0gMCwgbGVuZ3RoID0gY2h1bmsubGVuZ3RoOyBpZHggPCBsZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoY2h1bmsuY2hhckNvZGVBdChpZHgpID09PSBORVdMSU5FX0NPREUpIHtcbiAgICAgICAgZ2VuZXJhdGVkLmxpbmUrKztcbiAgICAgICAgZ2VuZXJhdGVkLmNvbHVtbiA9IDA7XG4gICAgICAgIC8vIE1hcHBpbmdzIGVuZCBhdCBlb2xcbiAgICAgICAgaWYgKGlkeCArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIGxhc3RPcmlnaW5hbFNvdXJjZSA9IG51bGw7XG4gICAgICAgICAgc291cmNlTWFwcGluZ0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKHNvdXJjZU1hcHBpbmdBY3RpdmUpIHtcbiAgICAgICAgICBtYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICBzb3VyY2U6IG9yaWdpbmFsLnNvdXJjZSxcbiAgICAgICAgICAgIG9yaWdpbmFsOiB7XG4gICAgICAgICAgICAgIGxpbmU6IG9yaWdpbmFsLmxpbmUsXG4gICAgICAgICAgICAgIGNvbHVtbjogb3JpZ2luYWwuY29sdW1uXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgICAgIGxpbmU6IGdlbmVyYXRlZC5saW5lLFxuICAgICAgICAgICAgICBjb2x1bW46IGdlbmVyYXRlZC5jb2x1bW5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiBvcmlnaW5hbC5uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdlbmVyYXRlZC5jb2x1bW4rKztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICB0aGlzLndhbGtTb3VyY2VDb250ZW50cyhmdW5jdGlvbiAoc291cmNlRmlsZSwgc291cmNlQ29udGVudCkge1xuICAgIG1hcC5zZXRTb3VyY2VDb250ZW50KHNvdXJjZUZpbGUsIHNvdXJjZUNvbnRlbnQpO1xuICB9KTtcblxuICByZXR1cm4geyBjb2RlOiBnZW5lcmF0ZWQuY29kZSwgbWFwOiBtYXAgfTtcbn07XG5cbmV4cG9ydHMuU291cmNlTm9kZSA9IFNvdXJjZU5vZGU7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbi8qKlxuICogVGhpcyBpcyBhIGhlbHBlciBmdW5jdGlvbiBmb3IgZ2V0dGluZyB2YWx1ZXMgZnJvbSBwYXJhbWV0ZXIvb3B0aW9uc1xuICogb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0gYXJncyBUaGUgb2JqZWN0IHdlIGFyZSBleHRyYWN0aW5nIHZhbHVlcyBmcm9tXG4gKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgd2UgYXJlIGdldHRpbmcuXG4gKiBAcGFyYW0gZGVmYXVsdFZhbHVlIEFuIG9wdGlvbmFsIHZhbHVlIHRvIHJldHVybiBpZiB0aGUgcHJvcGVydHkgaXMgbWlzc2luZ1xuICogZnJvbSB0aGUgb2JqZWN0LiBJZiB0aGlzIGlzIG5vdCBzcGVjaWZpZWQgYW5kIHRoZSBwcm9wZXJ0eSBpcyBtaXNzaW5nLCBhblxuICogZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gKi9cbmZ1bmN0aW9uIGdldEFyZyhhQXJncywgYU5hbWUsIGFEZWZhdWx0VmFsdWUpIHtcbiAgaWYgKGFOYW1lIGluIGFBcmdzKSB7XG4gICAgcmV0dXJuIGFBcmdzW2FOYW1lXTtcbiAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgcmV0dXJuIGFEZWZhdWx0VmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBhTmFtZSArICdcIiBpcyBhIHJlcXVpcmVkIGFyZ3VtZW50LicpO1xuICB9XG59XG5leHBvcnRzLmdldEFyZyA9IGdldEFyZztcblxudmFyIHVybFJlZ2V4cCA9IC9eKD86KFtcXHcrXFwtLl0rKTopP1xcL1xcLyg/OihcXHcrOlxcdyspQCk/KFtcXHcuXSopKD86OihcXGQrKSk/KFxcUyopJC87XG52YXIgZGF0YVVybFJlZ2V4cCA9IC9eZGF0YTouK1xcLC4rJC87XG5cbmZ1bmN0aW9uIHVybFBhcnNlKGFVcmwpIHtcbiAgdmFyIG1hdGNoID0gYVVybC5tYXRjaCh1cmxSZWdleHApO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBzY2hlbWU6IG1hdGNoWzFdLFxuICAgIGF1dGg6IG1hdGNoWzJdLFxuICAgIGhvc3Q6IG1hdGNoWzNdLFxuICAgIHBvcnQ6IG1hdGNoWzRdLFxuICAgIHBhdGg6IG1hdGNoWzVdXG4gIH07XG59XG5leHBvcnRzLnVybFBhcnNlID0gdXJsUGFyc2U7XG5cbmZ1bmN0aW9uIHVybEdlbmVyYXRlKGFQYXJzZWRVcmwpIHtcbiAgdmFyIHVybCA9ICcnO1xuICBpZiAoYVBhcnNlZFVybC5zY2hlbWUpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5zY2hlbWUgKyAnOic7XG4gIH1cbiAgdXJsICs9ICcvLyc7XG4gIGlmIChhUGFyc2VkVXJsLmF1dGgpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5hdXRoICsgJ0AnO1xuICB9XG4gIGlmIChhUGFyc2VkVXJsLmhvc3QpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5ob3N0O1xuICB9XG4gIGlmIChhUGFyc2VkVXJsLnBvcnQpIHtcbiAgICB1cmwgKz0gXCI6XCIgKyBhUGFyc2VkVXJsLnBvcnRcbiAgfVxuICBpZiAoYVBhcnNlZFVybC5wYXRoKSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwucGF0aDtcbiAgfVxuICByZXR1cm4gdXJsO1xufVxuZXhwb3J0cy51cmxHZW5lcmF0ZSA9IHVybEdlbmVyYXRlO1xuXG4vKipcbiAqIE5vcm1hbGl6ZXMgYSBwYXRoLCBvciB0aGUgcGF0aCBwb3J0aW9uIG9mIGEgVVJMOlxuICpcbiAqIC0gUmVwbGFjZXMgY29uc2VjdXRpdmUgc2xhc2hlcyB3aXRoIG9uZSBzbGFzaC5cbiAqIC0gUmVtb3ZlcyB1bm5lY2Vzc2FyeSAnLicgcGFydHMuXG4gKiAtIFJlbW92ZXMgdW5uZWNlc3NhcnkgJzxkaXI+Ly4uJyBwYXJ0cy5cbiAqXG4gKiBCYXNlZCBvbiBjb2RlIGluIHRoZSBOb2RlLmpzICdwYXRoJyBjb3JlIG1vZHVsZS5cbiAqXG4gKiBAcGFyYW0gYVBhdGggVGhlIHBhdGggb3IgdXJsIHRvIG5vcm1hbGl6ZS5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplKGFQYXRoKSB7XG4gIHZhciBwYXRoID0gYVBhdGg7XG4gIHZhciB1cmwgPSB1cmxQYXJzZShhUGF0aCk7XG4gIGlmICh1cmwpIHtcbiAgICBpZiAoIXVybC5wYXRoKSB7XG4gICAgICByZXR1cm4gYVBhdGg7XG4gICAgfVxuICAgIHBhdGggPSB1cmwucGF0aDtcbiAgfVxuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKTtcblxuICB2YXIgcGFydHMgPSBwYXRoLnNwbGl0KC9cXC8rLyk7XG4gIGZvciAodmFyIHBhcnQsIHVwID0gMCwgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgcGFydCA9IHBhcnRzW2ldO1xuICAgIGlmIChwYXJ0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKHBhcnQgPT09ICcuLicpIHtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCA+IDApIHtcbiAgICAgIGlmIChwYXJ0ID09PSAnJykge1xuICAgICAgICAvLyBUaGUgZmlyc3QgcGFydCBpcyBibGFuayBpZiB0aGUgcGF0aCBpcyBhYnNvbHV0ZS4gVHJ5aW5nIHRvIGdvXG4gICAgICAgIC8vIGFib3ZlIHRoZSByb290IGlzIGEgbm8tb3AuIFRoZXJlZm9yZSB3ZSBjYW4gcmVtb3ZlIGFsbCAnLi4nIHBhcnRzXG4gICAgICAgIC8vIGRpcmVjdGx5IGFmdGVyIHRoZSByb290LlxuICAgICAgICBwYXJ0cy5zcGxpY2UoaSArIDEsIHVwKTtcbiAgICAgICAgdXAgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFydHMuc3BsaWNlKGksIDIpO1xuICAgICAgICB1cC0tO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBwYXRoID0gcGFydHMuam9pbignLycpO1xuXG4gIGlmIChwYXRoID09PSAnJykge1xuICAgIHBhdGggPSBpc0Fic29sdXRlID8gJy8nIDogJy4nO1xuICB9XG5cbiAgaWYgKHVybCkge1xuICAgIHVybC5wYXRoID0gcGF0aDtcbiAgICByZXR1cm4gdXJsR2VuZXJhdGUodXJsKTtcbiAgfVxuICByZXR1cm4gcGF0aDtcbn1cbmV4cG9ydHMubm9ybWFsaXplID0gbm9ybWFsaXplO1xuXG4vKipcbiAqIEpvaW5zIHR3byBwYXRocy9VUkxzLlxuICpcbiAqIEBwYXJhbSBhUm9vdCBUaGUgcm9vdCBwYXRoIG9yIFVSTC5cbiAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciBVUkwgdG8gYmUgam9pbmVkIHdpdGggdGhlIHJvb3QuXG4gKlxuICogLSBJZiBhUGF0aCBpcyBhIFVSTCBvciBhIGRhdGEgVVJJLCBhUGF0aCBpcyByZXR1cm5lZCwgdW5sZXNzIGFQYXRoIGlzIGFcbiAqICAgc2NoZW1lLXJlbGF0aXZlIFVSTDogVGhlbiB0aGUgc2NoZW1lIG9mIGFSb290LCBpZiBhbnksIGlzIHByZXBlbmRlZFxuICogICBmaXJzdC5cbiAqIC0gT3RoZXJ3aXNlIGFQYXRoIGlzIGEgcGF0aC4gSWYgYVJvb3QgaXMgYSBVUkwsIHRoZW4gaXRzIHBhdGggcG9ydGlvblxuICogICBpcyB1cGRhdGVkIHdpdGggdGhlIHJlc3VsdCBhbmQgYVJvb3QgaXMgcmV0dXJuZWQuIE90aGVyd2lzZSB0aGUgcmVzdWx0XG4gKiAgIGlzIHJldHVybmVkLlxuICogICAtIElmIGFQYXRoIGlzIGFic29sdXRlLCB0aGUgcmVzdWx0IGlzIGFQYXRoLlxuICogICAtIE90aGVyd2lzZSB0aGUgdHdvIHBhdGhzIGFyZSBqb2luZWQgd2l0aCBhIHNsYXNoLlxuICogLSBKb2luaW5nIGZvciBleGFtcGxlICdodHRwOi8vJyBhbmQgJ3d3dy5leGFtcGxlLmNvbScgaXMgYWxzbyBzdXBwb3J0ZWQuXG4gKi9cbmZ1bmN0aW9uIGpvaW4oYVJvb3QsIGFQYXRoKSB7XG4gIGlmIChhUm9vdCA9PT0gXCJcIikge1xuICAgIGFSb290ID0gXCIuXCI7XG4gIH1cbiAgaWYgKGFQYXRoID09PSBcIlwiKSB7XG4gICAgYVBhdGggPSBcIi5cIjtcbiAgfVxuICB2YXIgYVBhdGhVcmwgPSB1cmxQYXJzZShhUGF0aCk7XG4gIHZhciBhUm9vdFVybCA9IHVybFBhcnNlKGFSb290KTtcbiAgaWYgKGFSb290VXJsKSB7XG4gICAgYVJvb3QgPSBhUm9vdFVybC5wYXRoIHx8ICcvJztcbiAgfVxuXG4gIC8vIGBqb2luKGZvbywgJy8vd3d3LmV4YW1wbGUub3JnJylgXG4gIGlmIChhUGF0aFVybCAmJiAhYVBhdGhVcmwuc2NoZW1lKSB7XG4gICAgaWYgKGFSb290VXJsKSB7XG4gICAgICBhUGF0aFVybC5zY2hlbWUgPSBhUm9vdFVybC5zY2hlbWU7XG4gICAgfVxuICAgIHJldHVybiB1cmxHZW5lcmF0ZShhUGF0aFVybCk7XG4gIH1cblxuICBpZiAoYVBhdGhVcmwgfHwgYVBhdGgubWF0Y2goZGF0YVVybFJlZ2V4cCkpIHtcbiAgICByZXR1cm4gYVBhdGg7XG4gIH1cblxuICAvLyBgam9pbignaHR0cDovLycsICd3d3cuZXhhbXBsZS5jb20nKWBcbiAgaWYgKGFSb290VXJsICYmICFhUm9vdFVybC5ob3N0ICYmICFhUm9vdFVybC5wYXRoKSB7XG4gICAgYVJvb3RVcmwuaG9zdCA9IGFQYXRoO1xuICAgIHJldHVybiB1cmxHZW5lcmF0ZShhUm9vdFVybCk7XG4gIH1cblxuICB2YXIgam9pbmVkID0gYVBhdGguY2hhckF0KDApID09PSAnLydcbiAgICA/IGFQYXRoXG4gICAgOiBub3JtYWxpemUoYVJvb3QucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyBhUGF0aCk7XG5cbiAgaWYgKGFSb290VXJsKSB7XG4gICAgYVJvb3RVcmwucGF0aCA9IGpvaW5lZDtcbiAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVJvb3RVcmwpO1xuICB9XG4gIHJldHVybiBqb2luZWQ7XG59XG5leHBvcnRzLmpvaW4gPSBqb2luO1xuXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbiAoYVBhdGgpIHtcbiAgcmV0dXJuIGFQYXRoLmNoYXJBdCgwKSA9PT0gJy8nIHx8ICEhYVBhdGgubWF0Y2godXJsUmVnZXhwKTtcbn07XG5cbi8qKlxuICogTWFrZSBhIHBhdGggcmVsYXRpdmUgdG8gYSBVUkwgb3IgYW5vdGhlciBwYXRoLlxuICpcbiAqIEBwYXJhbSBhUm9vdCBUaGUgcm9vdCBwYXRoIG9yIFVSTC5cbiAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciBVUkwgdG8gYmUgbWFkZSByZWxhdGl2ZSB0byBhUm9vdC5cbiAqL1xuZnVuY3Rpb24gcmVsYXRpdmUoYVJvb3QsIGFQYXRoKSB7XG4gIGlmIChhUm9vdCA9PT0gXCJcIikge1xuICAgIGFSb290ID0gXCIuXCI7XG4gIH1cblxuICBhUm9vdCA9IGFSb290LnJlcGxhY2UoL1xcLyQvLCAnJyk7XG5cbiAgLy8gSXQgaXMgcG9zc2libGUgZm9yIHRoZSBwYXRoIHRvIGJlIGFib3ZlIHRoZSByb290LiBJbiB0aGlzIGNhc2UsIHNpbXBseVxuICAvLyBjaGVja2luZyB3aGV0aGVyIHRoZSByb290IGlzIGEgcHJlZml4IG9mIHRoZSBwYXRoIHdvbid0IHdvcmsuIEluc3RlYWQsIHdlXG4gIC8vIG5lZWQgdG8gcmVtb3ZlIGNvbXBvbmVudHMgZnJvbSB0aGUgcm9vdCBvbmUgYnkgb25lLCB1bnRpbCBlaXRoZXIgd2UgZmluZFxuICAvLyBhIHByZWZpeCB0aGF0IGZpdHMsIG9yIHdlIHJ1biBvdXQgb2YgY29tcG9uZW50cyB0byByZW1vdmUuXG4gIHZhciBsZXZlbCA9IDA7XG4gIHdoaWxlIChhUGF0aC5pbmRleE9mKGFSb290ICsgJy8nKSAhPT0gMCkge1xuICAgIHZhciBpbmRleCA9IGFSb290Lmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICByZXR1cm4gYVBhdGg7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG9ubHkgcGFydCBvZiB0aGUgcm9vdCB0aGF0IGlzIGxlZnQgaXMgdGhlIHNjaGVtZSAoaS5lLiBodHRwOi8vLFxuICAgIC8vIGZpbGU6Ly8vLCBldGMuKSwgb25lIG9yIG1vcmUgc2xhc2hlcyAoLyksIG9yIHNpbXBseSBub3RoaW5nIGF0IGFsbCwgd2VcbiAgICAvLyBoYXZlIGV4aGF1c3RlZCBhbGwgY29tcG9uZW50cywgc28gdGhlIHBhdGggaXMgbm90IHJlbGF0aXZlIHRvIHRoZSByb290LlxuICAgIGFSb290ID0gYVJvb3Quc2xpY2UoMCwgaW5kZXgpO1xuICAgIGlmIChhUm9vdC5tYXRjaCgvXihbXlxcL10rOlxcLyk/XFwvKiQvKSkge1xuICAgICAgcmV0dXJuIGFQYXRoO1xuICAgIH1cblxuICAgICsrbGV2ZWw7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgd2UgYWRkIGEgXCIuLi9cIiBmb3IgZWFjaCBjb21wb25lbnQgd2UgcmVtb3ZlZCBmcm9tIHRoZSByb290LlxuICByZXR1cm4gQXJyYXkobGV2ZWwgKyAxKS5qb2luKFwiLi4vXCIpICsgYVBhdGguc3Vic3RyKGFSb290Lmxlbmd0aCArIDEpO1xufVxuZXhwb3J0cy5yZWxhdGl2ZSA9IHJlbGF0aXZlO1xuXG52YXIgc3VwcG9ydHNOdWxsUHJvdG8gPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgb2JqID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgcmV0dXJuICEoJ19fcHJvdG9fXycgaW4gb2JqKTtcbn0oKSk7XG5cbmZ1bmN0aW9uIGlkZW50aXR5IChzKSB7XG4gIHJldHVybiBzO1xufVxuXG4vKipcbiAqIEJlY2F1c2UgYmVoYXZpb3IgZ29lcyB3YWNreSB3aGVuIHlvdSBzZXQgYF9fcHJvdG9fX2Agb24gb2JqZWN0cywgd2VcbiAqIGhhdmUgdG8gcHJlZml4IGFsbCB0aGUgc3RyaW5ncyBpbiBvdXIgc2V0IHdpdGggYW4gYXJiaXRyYXJ5IGNoYXJhY3Rlci5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvc291cmNlLW1hcC9wdWxsLzMxIGFuZFxuICogaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvc291cmNlLW1hcC9pc3N1ZXMvMzBcbiAqXG4gKiBAcGFyYW0gU3RyaW5nIGFTdHJcbiAqL1xuZnVuY3Rpb24gdG9TZXRTdHJpbmcoYVN0cikge1xuICBpZiAoaXNQcm90b1N0cmluZyhhU3RyKSkge1xuICAgIHJldHVybiAnJCcgKyBhU3RyO1xuICB9XG5cbiAgcmV0dXJuIGFTdHI7XG59XG5leHBvcnRzLnRvU2V0U3RyaW5nID0gc3VwcG9ydHNOdWxsUHJvdG8gPyBpZGVudGl0eSA6IHRvU2V0U3RyaW5nO1xuXG5mdW5jdGlvbiBmcm9tU2V0U3RyaW5nKGFTdHIpIHtcbiAgaWYgKGlzUHJvdG9TdHJpbmcoYVN0cikpIHtcbiAgICByZXR1cm4gYVN0ci5zbGljZSgxKTtcbiAgfVxuXG4gIHJldHVybiBhU3RyO1xufVxuZXhwb3J0cy5mcm9tU2V0U3RyaW5nID0gc3VwcG9ydHNOdWxsUHJvdG8gPyBpZGVudGl0eSA6IGZyb21TZXRTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzUHJvdG9TdHJpbmcocykge1xuICBpZiAoIXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgbGVuZ3RoID0gcy5sZW5ndGg7XG5cbiAgaWYgKGxlbmd0aCA8IDkgLyogXCJfX3Byb3RvX19cIi5sZW5ndGggKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocy5jaGFyQ29kZUF0KGxlbmd0aCAtIDEpICE9PSA5NSAgLyogJ18nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMikgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSAzKSAhPT0gMTExIC8qICdvJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDQpICE9PSAxMTYgLyogJ3QnICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNSkgIT09IDExMSAvKiAnbycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA2KSAhPT0gMTE0IC8qICdyJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDcpICE9PSAxMTIgLyogJ3AnICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gOCkgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA5KSAhPT0gOTUgIC8qICdfJyAqLykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSBsZW5ndGggLSAxMDsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAocy5jaGFyQ29kZUF0KGkpICE9PSAzNiAvKiAnJCcgKi8pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdoZXJlIHRoZSBvcmlnaW5hbCBwb3NpdGlvbnMgYXJlIGNvbXBhcmVkLlxuICpcbiAqIE9wdGlvbmFsbHkgcGFzcyBpbiBgdHJ1ZWAgYXMgYG9ubHlDb21wYXJlR2VuZXJhdGVkYCB0byBjb25zaWRlciB0d29cbiAqIG1hcHBpbmdzIHdpdGggdGhlIHNhbWUgb3JpZ2luYWwgc291cmNlL2xpbmUvY29sdW1uLCBidXQgZGlmZmVyZW50IGdlbmVyYXRlZFxuICogbGluZSBhbmQgY29sdW1uIHRoZSBzYW1lLiBVc2VmdWwgd2hlbiBzZWFyY2hpbmcgZm9yIGEgbWFwcGluZyB3aXRoIGFcbiAqIHN0dWJiZWQgb3V0IG1hcHBpbmcuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKG1hcHBpbmdBLCBtYXBwaW5nQiwgb25seUNvbXBhcmVPcmlnaW5hbCkge1xuICB2YXIgY21wID0gbWFwcGluZ0Euc291cmNlIC0gbWFwcGluZ0Iuc291cmNlO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICBpZiAoY21wICE9PSAwIHx8IG9ubHlDb21wYXJlT3JpZ2luYWwpIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIHJldHVybiBtYXBwaW5nQS5uYW1lIC0gbWFwcGluZ0IubmFtZTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMgPSBjb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucztcblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdpdGggZGVmbGF0ZWQgc291cmNlIGFuZCBuYW1lIGluZGljZXMgd2hlcmVcbiAqIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IHBhc3MgaW4gYHRydWVgIGFzIGBvbmx5Q29tcGFyZUdlbmVyYXRlZGAgdG8gY29uc2lkZXIgdHdvXG4gKiBtYXBwaW5ncyB3aXRoIHRoZSBzYW1lIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4sIGJ1dCBkaWZmZXJlbnRcbiAqIHNvdXJjZS9uYW1lL29yaWdpbmFsIGxpbmUgYW5kIGNvbHVtbiB0aGUgc2FtZS4gVXNlZnVsIHdoZW4gc2VhcmNoaW5nIGZvciBhXG4gKiBtYXBwaW5nIHdpdGggYSBzdHViYmVkIG91dCBtYXBwaW5nLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IsIG9ubHlDb21wYXJlR2VuZXJhdGVkKSB7XG4gIHZhciBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lIC0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVHZW5lcmF0ZWQpIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Euc291cmNlIC0gbWFwcGluZ0Iuc291cmNlO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIHJldHVybiBtYXBwaW5nQS5uYW1lIC0gbWFwcGluZ0IubmFtZTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQgPSBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZDtcblxuZnVuY3Rpb24gc3RyY21wKGFTdHIxLCBhU3RyMikge1xuICBpZiAoYVN0cjEgPT09IGFTdHIyKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoYVN0cjEgPiBhU3RyMikge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIENvbXBhcmF0b3IgYmV0d2VlbiB0d28gbWFwcGluZ3Mgd2l0aCBpbmZsYXRlZCBzb3VyY2UgYW5kIG5hbWUgc3RyaW5ncyB3aGVyZVxuICogdGhlIGdlbmVyYXRlZCBwb3NpdGlvbnMgYXJlIGNvbXBhcmVkLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IpIHtcbiAgdmFyIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZENvbHVtbiAtIG1hcHBpbmdCLmdlbmVyYXRlZENvbHVtbjtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBzdHJjbXAobWFwcGluZ0Euc291cmNlLCBtYXBwaW5nQi5zb3VyY2UpO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIHJldHVybiBzdHJjbXAobWFwcGluZ0EubmFtZSwgbWFwcGluZ0IubmFtZSk7XG59XG5leHBvcnRzLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkID0gY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQ7XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDktMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0UudHh0IG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5leHBvcnRzLlNvdXJjZU1hcEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vbGliL3NvdXJjZS1tYXAtZ2VuZXJhdG9yJykuU291cmNlTWFwR2VuZXJhdG9yO1xuZXhwb3J0cy5Tb3VyY2VNYXBDb25zdW1lciA9IHJlcXVpcmUoJy4vbGliL3NvdXJjZS1tYXAtY29uc3VtZXInKS5Tb3VyY2VNYXBDb25zdW1lcjtcbmV4cG9ydHMuU291cmNlTm9kZSA9IHJlcXVpcmUoJy4vbGliL3NvdXJjZS1ub2RlJykuU291cmNlTm9kZTtcbiJdfQ==
