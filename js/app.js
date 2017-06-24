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
            }
            //Template loaded, just set template
            );
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
					: IS_BIND && own ? ctx(out, global
					// wrap global constructors for prevent change them in library
					) : IS_WRAP && target[key] == out ? function (C) {
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
					return '"' + (str + '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028' // Per Ecma-262 7.3 + 7.8.4
					).replace(/\u2029/g, '\\u2029') + '"';
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
        return 'authorization';
    },
    behaviors: [_hbs2.default],
    HBTemplate: 'templates/views/athorization.hbs',
    className: 'authorization',
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
    className: 'tasks__item',
    ui: {
        "edit": ".tasks__text",
        "editStyle": ".tasks__text",
        "remove": ".tasks__remove",
        "toggle": ".tasks__toggle"
    },
    events: {
        "focusout @ui.edit": "editTask",
        "click @ui.editStyle": "editStyles",
        "click @ui.toggle": "toggleDone",
        'click @ui.remove': 'removeModel'
    },
    triggers: {
        'click @ui.remove': 'remove:model'
    },
    editStyles: function editStyles(event) {
        $(event.currentTarget).addClass('edit');
    },
    removeModel: function removeModel(event) {
        this.model.clear();
    },
    onRender: function onRender() {
        this.$el.toggleClass('done', this.model.get('done'));
    },
    editTask: function editTask(event) {
        var newTaskTitle = $(event.currentTarget).text();
        if (newTaskTitle === '') {
            this.model.clear();
        } else {
            this.model.save({ "title": _.escape(newTaskTitle) }, { validate: true });
            $(event.currentTarget).removeClass('edit');
        }
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
    className: 'tasks__list',
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
            el: '.user__tasks'
        }
    },
    ui: {
        logOut: '.logout__btn',
        addtask: '.user__addtask'
    },
    events: {
        'click @ui.logOut': 'logOut',
        'click @ui.addtask': 'addTask'
    },
    addTask: function addTask(event) {
        event.preventDefault();
        var $input = $('.user__task');
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

        $('.user__name').text(email);
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
            el: '.todo__content',
            replaceElement: false
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0XFxqc1xcYXBwLmpzIiwiZGlzdFxcanNcXGJlaGF2aW9yc1xcaGJzLmpzIiwiZGlzdFxcanNcXGluaXRpYWxpemUuanMiLCJkaXN0XFxqc1xcbGlic1xcaGFuZGxlYmFycy12NC4wLjEwLmpzIiwiZGlzdFxcanNcXHZpZXdzXFxhdGhvcml6YXRpb24uanMiLCJkaXN0XFxqc1xcdmlld3NcXGN1cnJlbnQudXNlci5qcyIsImRpc3RcXGpzXFx2aWV3c1xcbGF5b3V0LmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2FycmF5LXNldC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9iYXNlNjQtdmxxLmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2Jhc2U2NC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9iaW5hcnktc2VhcmNoLmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL21hcHBpbmctbGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9xdWljay1zb3J0LmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL3NvdXJjZS1tYXAtY29uc3VtZXIuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvc291cmNlLW1hcC1nZW5lcmF0b3IuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvc291cmNlLW5vZGUuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL3NvdXJjZS1tYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7a0JBR2UsV0FBVyxXQUFYLENBQXVCLE1BQXZCLENBQThCO0FBQzVDLFNBQVEsTUFEb0M7QUFFNUMsYUFBWSxzQkFBVztBQUN0QixPQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxFQUoyQztBQUs1QyxRQUFPLGlCQUFXO0FBQ2pCLE9BQUssUUFBTCxDQUFjLHNCQUFkO0FBQ0EsRUFQMkM7QUFRNUMsS0FSNEMsZ0JBUXRDLE9BUnNDLEVBUTdCO0FBQ2QsTUFBSSxTQUFTLEVBQUUsTUFBRixDQUFTO0FBQ3JCLFFBQUssRUFEZ0I7QUFFckIsU0FBTSxNQUZlO0FBR3JCLFNBQU0sRUFIZTtBQUlyQixhQUFVLE1BSlc7QUFLckIsV0FMcUIsb0JBS1gsSUFMVyxFQUtMO0FBQ2Y7QUFDQTtBQVBvQixHQUFULEVBUVYsT0FSVSxDQUFiOztBQVVBLFNBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjs7QUFFdkMsS0FBRSxJQUFGLENBQU87QUFDTixTQUFLLE9BQU8sR0FETjtBQUVOLFVBQU0sT0FBTyxJQUZQO0FBR04sVUFBTSxPQUFPLElBSFA7QUFJTixjQUFVLE9BQU87QUFKWCxJQUFQLEVBS0csTUFMSCxDQUtVLFVBQUMsUUFBRCxFQUFXLE1BQVgsRUFBc0I7QUFDL0IsUUFBRyxXQUFXLE9BQWQsRUFBdUI7QUFDdEIsWUFBTyxRQUFQO0FBQ0E7O0FBRUQsUUFBRyxXQUFXLFNBQWQsRUFBeUI7QUFDeEIsU0FBRyxRQUFPLFFBQVAseUNBQU8sUUFBUCxPQUFvQixRQUFwQixJQUFnQyxTQUFTLElBQVQsSUFBaUIsR0FBcEQsRUFBeUQ7QUFDeEQsVUFBRyxTQUFTLE9BQVosRUFBcUI7QUFDcEIsY0FBTyxRQUFQO0FBQ0E7QUFDRDtBQUNELFlBQU8sUUFBUCxDQUFnQixRQUFoQjtBQUNBLGFBQVEsUUFBUjtBQUNBO0FBQ0QsSUFuQkQ7QUFxQkEsR0F2Qk0sRUF1QkosS0F2QkksQ0F1QkUsb0JBQVk7QUFDcEIsT0FBRyxTQUFTLE9BQVosRUFBcUI7QUFDcEI7QUFDQSxRQUFHLFNBQVMsSUFBVCxLQUFrQixHQUFyQixFQUEwQjtBQUN6QixTQUFJLE1BQUosQ0FBVyxRQUFYLENBQW9CLEdBQXBCLEVBQXlCLElBQXpCO0FBQ0E7O0FBRUQsVUFBTSxTQUFTLFFBQVQsRUFBTjtBQUNBO0FBQ0QsR0FoQ00sQ0FBUDtBQWlDQTtBQXBEMkMsQ0FBOUIsQzs7Ozs7Ozs7O0FDSGY7Ozs7OztBQUVBLElBQU0sU0FBUyxXQUFXLFFBQVgsQ0FBb0IsTUFBcEIsQ0FBMkI7QUFDdEMsWUFBUSxLQUQ4QjtBQUV0QyxjQUZzQyxzQkFFMUIsT0FGMEIsRUFFakI7QUFBQTs7QUFDakIsWUFBSSxhQUFhLEtBQUssSUFBTCxDQUFVLFVBQTNCOztBQUVBLGFBQUssSUFBTCxDQUFVLGFBQVYsR0FBMEIsS0FBMUI7O0FBRUE7QUFDQSxZQUFHLENBQUMsVUFBSixFQUFnQixPQUFPLFFBQVEsSUFBUixDQUFhLDJCQUFiLENBQVA7QUFDaEI7QUFDQSxZQUFHLElBQUksUUFBSixDQUFhLFVBQWIsS0FBNEIsU0FBL0IsRUFBMEM7QUFDdEMsbUJBQU8sSUFBSSxRQUFKLENBQWEsVUFBYixJQUEyQixJQUFJLElBQUosQ0FBUztBQUNuQyxzQkFBTSxLQUQ2QjtBQUVuQyxxQkFBSyxVQUY4QjtBQUduQywwQkFBVTtBQUh5QixhQUFULEVBSTNCLElBSjJCLENBSXRCLGdCQUFRO0FBQ1o7QUFDQSxvQkFBRyxDQUFDLE1BQUssSUFBTCxDQUFVLFdBQVYsRUFBSixFQUE2QjtBQUNqQyx3QkFBSSxRQUFKLENBQWEsVUFBYixJQUEyQixJQUEzQjtBQUNBLDBCQUFLLFdBQUwsQ0FBaUIsSUFBSSxRQUFKLENBQWEsVUFBYixDQUFqQjtBQUNBLHdCQUFHLEVBQUUsVUFBRixDQUFhLE1BQUssSUFBTCxDQUFVLGNBQXZCLENBQUgsRUFBMkMsTUFBSyxJQUFMLENBQVUsY0FBVjtBQUMzQywwQkFBSyxNQUFMLEdBQWMsSUFBZDtBQUNIOztBQUVELHVCQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVY7QUFBQSwyQkFBcUIsUUFBUSxJQUFSLENBQXJCO0FBQUEsaUJBQVosQ0FBUDtBQUNILGFBZHFDLENBQWxDO0FBZUg7QUFDRDtBQUNBLFlBQUcsRUFBRSxVQUFGLENBQWEsSUFBSSxRQUFKLENBQWEsVUFBYixFQUF5QixJQUF0QyxDQUFILEVBQWdEO0FBQzVDLGdCQUFJLFFBQUosQ0FBYSxVQUFiLEVBQXlCLElBQXpCLENBQThCLGdCQUFRO0FBQ2xDO0FBQ0Esb0JBQUksUUFBSixDQUFhLFVBQWIsSUFBMkIsSUFBM0I7QUFDSixzQkFBSyxXQUFMLENBQWlCLElBQUksUUFBSixDQUFhLFVBQWIsQ0FBakI7QUFDQSxvQkFBRyxFQUFFLFVBQUYsQ0FBYSxNQUFLLElBQUwsQ0FBVSxjQUF2QixDQUFILEVBQTJDLE1BQUssSUFBTCxDQUFVLGNBQVY7QUFDM0Msc0JBQUssTUFBTCxHQUFjLElBQWQ7QUFDSDtBQUNHO0FBUEE7QUFRSCxTQVRELE1BU087QUFDSCxpQkFBSyxNQUFMLEdBQWMsSUFBZDtBQUNBLGlCQUFLLFdBQUwsQ0FBaUIsSUFBSSxRQUFKLENBQWEsVUFBYixDQUFqQjtBQUNIO0FBQ0osS0F6Q3FDO0FBMEN0QyxlQTFDc0MsdUJBMEN6QixRQTFDeUIsRUEwQ2Y7QUFDbkIsWUFBSSxNQUFNLHNCQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBVjtBQUNBLGFBQUssSUFBTCxDQUFVLFFBQVYsR0FBcUI7QUFBQSxtQkFBUSxJQUFJLElBQUosQ0FBUjtBQUFBLFNBQXJCO0FBQ0EsYUFBSyxJQUFMLENBQVUsYUFBVixHQUEwQixJQUExQjtBQUNILEtBOUNxQztBQStDdEMsWUEvQ3NDLHNCQStDMUI7QUFDUixZQUFHLEVBQUUsVUFBRixDQUFhLEtBQUssSUFBTCxDQUFVLGNBQXZCLEtBQTBDLEtBQUssTUFBTCxLQUFnQixJQUE3RCxFQUFtRSxLQUFLLElBQUwsQ0FBVSxjQUFWO0FBQ3RFO0FBakRxQyxDQUEzQixDQUFmOztrQkFvRGUsTTs7Ozs7QUN0RGY7Ozs7OztBQUVBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDaEQsV0FBTyxHQUFQLEdBQWEsbUJBQWI7QUFDQSxRQUFJLEtBQUo7QUFDSCxDQUhEOzs7Ozs7O0FDRkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLENBQUMsU0FBUyxnQ0FBVCxDQUEwQyxJQUExQyxFQUFnRCxPQUFoRCxFQUF5RDtBQUN6RCxLQUFHLFFBQU8sT0FBUCx5Q0FBTyxPQUFQLE9BQW1CLFFBQW5CLElBQStCLFFBQU8sTUFBUCx5Q0FBTyxNQUFQLE9BQWtCLFFBQXBELEVBQ0MsT0FBTyxPQUFQLEdBQWlCLFNBQWpCLENBREQsS0FFSyxJQUFHLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTFDLEVBQ0osT0FBTyxFQUFQLEVBQVcsT0FBWCxFQURJLEtBRUEsSUFBRyxRQUFPLE9BQVAseUNBQU8sT0FBUCxPQUFtQixRQUF0QixFQUNKLFFBQVEsWUFBUixJQUF3QixTQUF4QixDQURJLEtBR0osS0FBSyxZQUFMLElBQXFCLFNBQXJCO0FBQ0QsQ0FURCxhQVNTLFlBQVc7QUFDcEIsUUFBTyxTQUFVLFVBQVMsT0FBVCxFQUFrQjtBQUFFO0FBQ3JDLFdBRG1DLENBQ3pCO0FBQ1YsV0FBVSxJQUFJLG1CQUFtQixFQUF2Qjs7QUFFVixXQUptQyxDQUl6QjtBQUNWLFdBQVUsU0FBUyxtQkFBVCxDQUE2QixRQUE3QixFQUF1Qzs7QUFFakQsWUFGaUQsQ0FFdEM7QUFDWCxZQUFXLElBQUcsaUJBQWlCLFFBQWpCLENBQUg7QUFDWCxhQUFZLE9BQU8saUJBQWlCLFFBQWpCLEVBQTJCLE9BQWxDOztBQUVaLFlBTmlELENBTXRDO0FBQ1gsWUFBVyxJQUFJLFNBQVMsaUJBQWlCLFFBQWpCLElBQTZCO0FBQ3JELGFBQVksU0FBUyxFQURnQztBQUVyRCxhQUFZLElBQUksUUFGcUM7QUFHckQsYUFBWSxRQUFRO0FBQ3BCLGFBSnFELEVBQTFDOztBQU1YLFlBYmlELENBYXRDO0FBQ1gsWUFBVyxRQUFRLFFBQVIsRUFBa0IsSUFBbEIsQ0FBdUIsT0FBTyxPQUE5QixFQUF1QyxNQUF2QyxFQUErQyxPQUFPLE9BQXRELEVBQStELG1CQUEvRDs7QUFFWCxZQWhCaUQsQ0FnQnRDO0FBQ1gsWUFBVyxPQUFPLE1BQVAsR0FBZ0IsSUFBaEI7O0FBRVgsWUFuQmlELENBbUJ0QztBQUNYLFlBQVcsT0FBTyxPQUFPLE9BQWQ7QUFDWDtBQUFXOztBQUdYLFdBN0JtQyxDQTZCekI7QUFDVixXQUFVLG9CQUFvQixDQUFwQixHQUF3QixPQUF4Qjs7QUFFVixXQWhDbUMsQ0FnQ3pCO0FBQ1YsV0FBVSxvQkFBb0IsQ0FBcEIsR0FBd0IsZ0JBQXhCOztBQUVWLFdBbkNtQyxDQW1DekI7QUFDVixXQUFVLG9CQUFvQixDQUFwQixHQUF3QixFQUF4Qjs7QUFFVixXQXRDbUMsQ0FzQ3pCO0FBQ1YsV0FBVSxPQUFPLG9CQUFvQixDQUFwQixDQUFQO0FBQ1Y7QUFBVSxHQXhDTTtBQXlDaEI7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJEOztBQUVBLE9BQUkseUJBQXlCLG9CQUFvQixDQUFwQixFQUF1QixTQUF2QixDQUE3Qjs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsT0FBSSxxQkFBcUIsb0JBQW9CLENBQXBCLENBQXpCOztBQUVBLE9BQUksc0JBQXNCLHVCQUF1QixrQkFBdkIsQ0FBMUI7O0FBRUE7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLEVBQXBCLENBQTdCOztBQUVBLE9BQUksMEJBQTBCLHVCQUF1QixzQkFBdkIsQ0FBOUI7O0FBRUEsT0FBSSwwQkFBMEIsb0JBQW9CLEVBQXBCLENBQTlCOztBQUVBLE9BQUksOEJBQThCLG9CQUFvQixFQUFwQixDQUFsQzs7QUFFQSxPQUFJLHdDQUF3QyxvQkFBb0IsRUFBcEIsQ0FBNUM7O0FBRUEsT0FBSSx5Q0FBeUMsdUJBQXVCLHFDQUF2QixDQUE3Qzs7QUFFQSxPQUFJLDZCQUE2QixvQkFBb0IsRUFBcEIsQ0FBakM7O0FBRUEsT0FBSSw4QkFBOEIsdUJBQXVCLDBCQUF2QixDQUFsQzs7QUFFQSxPQUFJLHdCQUF3QixvQkFBb0IsRUFBcEIsQ0FBNUI7O0FBRUEsT0FBSSx5QkFBeUIsdUJBQXVCLHFCQUF2QixDQUE3Qjs7QUFFQSxPQUFJLFVBQVUsb0JBQW9CLFNBQXBCLEVBQStCLE1BQTdDO0FBQ0EsWUFBUyxNQUFULEdBQWtCO0FBQ2hCLFFBQUksS0FBSyxTQUFUOztBQUVBLE9BQUcsT0FBSCxHQUFhLFVBQVUsS0FBVixFQUFpQixPQUFqQixFQUEwQjtBQUNyQyxZQUFPLDRCQUE0QixPQUE1QixDQUFvQyxLQUFwQyxFQUEyQyxPQUEzQyxFQUFvRCxFQUFwRCxDQUFQO0FBQ0QsS0FGRDtBQUdBLE9BQUcsVUFBSCxHQUFnQixVQUFVLEtBQVYsRUFBaUIsT0FBakIsRUFBMEI7QUFDeEMsWUFBTyw0QkFBNEIsVUFBNUIsQ0FBdUMsS0FBdkMsRUFBOEMsT0FBOUMsRUFBdUQsRUFBdkQsQ0FBUDtBQUNELEtBRkQ7O0FBSUEsT0FBRyxHQUFILEdBQVMsd0JBQXdCLFNBQXhCLENBQVQ7QUFDQSxPQUFHLFFBQUgsR0FBYyw0QkFBNEIsUUFBMUM7QUFDQSxPQUFHLGtCQUFILEdBQXdCLHVDQUF1QyxTQUF2QyxDQUF4QjtBQUNBLE9BQUcsTUFBSCxHQUFZLHdCQUF3QixNQUFwQztBQUNBLE9BQUcsS0FBSCxHQUFXLHdCQUF3QixLQUFuQzs7QUFFQSxXQUFPLEVBQVA7QUFDRDs7QUFFRCxPQUFJLE9BQU8sUUFBWDtBQUNBLFFBQUssTUFBTCxHQUFjLE1BQWQ7O0FBRUEsMEJBQXVCLFNBQXZCLEVBQWtDLElBQWxDOztBQUVBLFFBQUssT0FBTCxHQUFlLDRCQUE0QixTQUE1QixDQUFmOztBQUVBLFFBQUssU0FBTCxJQUFrQixJQUFsQjs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsSUFBckI7QUFDQSxVQUFPLE9BQVAsR0FBaUIsUUFBUSxTQUFSLENBQWpCOztBQUVEO0FBQU8sR0FwRUc7QUFxRVY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjs7QUFFaEM7O0FBRUEsV0FBUSxTQUFSLElBQXFCLFVBQVUsR0FBVixFQUFlO0FBQ2xDLFdBQU8sT0FBTyxJQUFJLFVBQVgsR0FBd0IsR0FBeEIsR0FBOEI7QUFDbkMsZ0JBQVc7QUFEd0IsS0FBckM7QUFHRCxJQUpEOztBQU1BLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFRDtBQUFPLEdBbEZHO0FBbUZWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxPQUFJLDBCQUEwQixvQkFBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBOUI7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTdCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxPQUFJLGtCQUFrQixvQkFBb0IsQ0FBcEIsQ0FBdEI7O0FBRUEsT0FBSSxPQUFPLHdCQUF3QixlQUF4QixDQUFYOztBQUVBO0FBQ0E7O0FBRUEsT0FBSSx3QkFBd0Isb0JBQW9CLEVBQXBCLENBQTVCOztBQUVBLE9BQUkseUJBQXlCLHVCQUF1QixxQkFBdkIsQ0FBN0I7O0FBRUEsT0FBSSx1QkFBdUIsb0JBQW9CLENBQXBCLENBQTNCOztBQUVBLE9BQUksd0JBQXdCLHVCQUF1QixvQkFBdkIsQ0FBNUI7O0FBRUEsT0FBSSxtQkFBbUIsb0JBQW9CLENBQXBCLENBQXZCOztBQUVBLE9BQUksUUFBUSx3QkFBd0IsZ0JBQXhCLENBQVo7O0FBRUEsT0FBSSxxQkFBcUIsb0JBQW9CLEVBQXBCLENBQXpCOztBQUVBLE9BQUksVUFBVSx3QkFBd0Isa0JBQXhCLENBQWQ7O0FBRUEsT0FBSSx3QkFBd0Isb0JBQW9CLEVBQXBCLENBQTVCOztBQUVBLE9BQUkseUJBQXlCLHVCQUF1QixxQkFBdkIsQ0FBN0I7O0FBRUE7QUFDQSxZQUFTLE1BQVQsR0FBa0I7QUFDaEIsUUFBSSxLQUFLLElBQUksS0FBSyxxQkFBVCxFQUFUOztBQUVBLFVBQU0sTUFBTixDQUFhLEVBQWIsRUFBaUIsSUFBakI7QUFDQSxPQUFHLFVBQUgsR0FBZ0IsdUJBQXVCLFNBQXZCLENBQWhCO0FBQ0EsT0FBRyxTQUFILEdBQWUsc0JBQXNCLFNBQXRCLENBQWY7QUFDQSxPQUFHLEtBQUgsR0FBVyxLQUFYO0FBQ0EsT0FBRyxnQkFBSCxHQUFzQixNQUFNLGdCQUE1Qjs7QUFFQSxPQUFHLEVBQUgsR0FBUSxPQUFSO0FBQ0EsT0FBRyxRQUFILEdBQWMsVUFBVSxJQUFWLEVBQWdCO0FBQzVCLFlBQU8sUUFBUSxRQUFSLENBQWlCLElBQWpCLEVBQXVCLEVBQXZCLENBQVA7QUFDRCxLQUZEOztBQUlBLFdBQU8sRUFBUDtBQUNEOztBQUVELE9BQUksT0FBTyxRQUFYO0FBQ0EsUUFBSyxNQUFMLEdBQWMsTUFBZDs7QUFFQSwwQkFBdUIsU0FBdkIsRUFBa0MsSUFBbEM7O0FBRUEsUUFBSyxTQUFMLElBQWtCLElBQWxCOztBQUVBLFdBQVEsU0FBUixJQUFxQixJQUFyQjtBQUNBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQXJKRztBQXNKVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCOztBQUVoQzs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsVUFBVSxHQUFWLEVBQWU7QUFDbEMsUUFBSSxPQUFPLElBQUksVUFBZixFQUEyQjtBQUN6QixZQUFPLEdBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxTQUFJLFNBQVMsRUFBYjs7QUFFQSxTQUFJLE9BQU8sSUFBWCxFQUFpQjtBQUNmLFdBQUssSUFBSSxHQUFULElBQWdCLEdBQWhCLEVBQXFCO0FBQ25CLFdBQUksT0FBTyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLEdBQXJDLEVBQTBDLEdBQTFDLENBQUosRUFBb0QsT0FBTyxHQUFQLElBQWMsSUFBSSxHQUFKLENBQWQ7QUFDckQ7QUFDRjs7QUFFRCxZQUFPLFNBQVAsSUFBb0IsR0FBcEI7QUFDQSxZQUFPLE1BQVA7QUFDRDtBQUNGLElBZkQ7O0FBaUJBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFRDtBQUFPLEdBOUtHO0FBK0tWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxPQUFJLHlCQUF5QixvQkFBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBN0I7O0FBRUEsV0FBUSxVQUFSLEdBQXFCLElBQXJCO0FBQ0EsV0FBUSxxQkFBUixHQUFnQyxxQkFBaEM7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLE9BQUksYUFBYSxvQkFBb0IsQ0FBcEIsQ0FBakI7O0FBRUEsT0FBSSxjQUFjLHVCQUF1QixVQUF2QixDQUFsQjs7QUFFQSxPQUFJLFdBQVcsb0JBQW9CLEVBQXBCLENBQWY7O0FBRUEsT0FBSSxjQUFjLG9CQUFvQixFQUFwQixDQUFsQjs7QUFFQSxPQUFJLFVBQVUsb0JBQW9CLEVBQXBCLENBQWQ7O0FBRUEsT0FBSSxXQUFXLHVCQUF1QixPQUF2QixDQUFmOztBQUVBLE9BQUksVUFBVSxRQUFkO0FBQ0EsV0FBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsT0FBSSxvQkFBb0IsQ0FBeEI7O0FBRUEsV0FBUSxpQkFBUixHQUE0QixpQkFBNUI7QUFDQSxPQUFJLG1CQUFtQjtBQUNyQixPQUFHLGFBRGtCLEVBQ0g7QUFDbEIsT0FBRyxlQUZrQjtBQUdyQixPQUFHLGVBSGtCO0FBSXJCLE9BQUcsVUFKa0I7QUFLckIsT0FBRyxrQkFMa0I7QUFNckIsT0FBRyxpQkFOa0I7QUFPckIsT0FBRztBQVBrQixJQUF2Qjs7QUFVQSxXQUFRLGdCQUFSLEdBQTJCLGdCQUEzQjtBQUNBLE9BQUksYUFBYSxpQkFBakI7O0FBRUEsWUFBUyxxQkFBVCxDQUErQixPQUEvQixFQUF3QyxRQUF4QyxFQUFrRCxVQUFsRCxFQUE4RDtBQUM1RCxTQUFLLE9BQUwsR0FBZSxXQUFXLEVBQTFCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLFlBQVksRUFBNUI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsY0FBYyxFQUFoQzs7QUFFQSxhQUFTLHNCQUFULENBQWdDLElBQWhDO0FBQ0EsZ0JBQVkseUJBQVosQ0FBc0MsSUFBdEM7QUFDRDs7QUFFRCx5QkFBc0IsU0FBdEIsR0FBa0M7QUFDaEMsaUJBQWEscUJBRG1COztBQUdoQyxZQUFRLFNBQVMsU0FBVCxDQUh3QjtBQUloQyxTQUFLLFNBQVMsU0FBVCxFQUFvQixHQUpPOztBQU1oQyxvQkFBZ0IsU0FBUyxjQUFULENBQXdCLElBQXhCLEVBQThCLEVBQTlCLEVBQWtDO0FBQ2hELFNBQUksT0FBTyxRQUFQLENBQWdCLElBQWhCLENBQXFCLElBQXJCLE1BQStCLFVBQW5DLEVBQStDO0FBQzdDLFVBQUksRUFBSixFQUFRO0FBQ04sYUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLHlDQUEzQixDQUFOO0FBQ0Q7QUFDRCxhQUFPLE1BQVAsQ0FBYyxLQUFLLE9BQW5CLEVBQTRCLElBQTVCO0FBQ0QsTUFMRCxNQUtPO0FBQ0wsV0FBSyxPQUFMLENBQWEsSUFBYixJQUFxQixFQUFyQjtBQUNEO0FBQ0YsS0FmK0I7QUFnQmhDLHNCQUFrQixTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDO0FBQ2hELFlBQU8sS0FBSyxPQUFMLENBQWEsSUFBYixDQUFQO0FBQ0QsS0FsQitCOztBQW9CaEMscUJBQWlCLFNBQVMsZUFBVCxDQUF5QixJQUF6QixFQUErQixPQUEvQixFQUF3QztBQUN2RCxTQUFJLE9BQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixNQUErQixVQUFuQyxFQUErQztBQUM3QyxhQUFPLE1BQVAsQ0FBYyxLQUFLLFFBQW5CLEVBQTZCLElBQTdCO0FBQ0QsTUFGRCxNQUVPO0FBQ0wsVUFBSSxPQUFPLE9BQVAsS0FBbUIsV0FBdkIsRUFBb0M7QUFDbEMsYUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLDhDQUE4QyxJQUE5QyxHQUFxRCxnQkFBaEYsQ0FBTjtBQUNEO0FBQ0QsV0FBSyxRQUFMLENBQWMsSUFBZCxJQUFzQixPQUF0QjtBQUNEO0FBQ0YsS0E3QitCO0FBOEJoQyx1QkFBbUIsU0FBUyxpQkFBVCxDQUEyQixJQUEzQixFQUFpQztBQUNsRCxZQUFPLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBUDtBQUNELEtBaEMrQjs7QUFrQ2hDLHVCQUFtQixTQUFTLGlCQUFULENBQTJCLElBQTNCLEVBQWlDLEVBQWpDLEVBQXFDO0FBQ3RELFNBQUksT0FBTyxRQUFQLENBQWdCLElBQWhCLENBQXFCLElBQXJCLE1BQStCLFVBQW5DLEVBQStDO0FBQzdDLFVBQUksRUFBSixFQUFRO0FBQ04sYUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLDRDQUEzQixDQUFOO0FBQ0Q7QUFDRCxhQUFPLE1BQVAsQ0FBYyxLQUFLLFVBQW5CLEVBQStCLElBQS9CO0FBQ0QsTUFMRCxNQUtPO0FBQ0wsV0FBSyxVQUFMLENBQWdCLElBQWhCLElBQXdCLEVBQXhCO0FBQ0Q7QUFDRixLQTNDK0I7QUE0Q2hDLHlCQUFxQixTQUFTLG1CQUFULENBQTZCLElBQTdCLEVBQW1DO0FBQ3RELFlBQU8sS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQTlDK0IsSUFBbEM7O0FBaURBLE9BQUksTUFBTSxTQUFTLFNBQVQsRUFBb0IsR0FBOUI7O0FBRUEsV0FBUSxHQUFSLEdBQWMsR0FBZDtBQUNBLFdBQVEsV0FBUixHQUFzQixPQUFPLFdBQTdCO0FBQ0EsV0FBUSxNQUFSLEdBQWlCLFNBQVMsU0FBVCxDQUFqQjs7QUFFRDtBQUFPLEdBelJHO0FBMFJWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjtBQUNBLFdBQVEsTUFBUixHQUFpQixNQUFqQjtBQUNBLFdBQVEsT0FBUixHQUFrQixPQUFsQjtBQUNBLFdBQVEsZ0JBQVIsR0FBMkIsZ0JBQTNCO0FBQ0EsV0FBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsV0FBUSxXQUFSLEdBQXNCLFdBQXRCO0FBQ0EsV0FBUSxXQUFSLEdBQXNCLFdBQXRCO0FBQ0EsV0FBUSxpQkFBUixHQUE0QixpQkFBNUI7QUFDQSxPQUFJLFNBQVM7QUFDWCxTQUFLLE9BRE07QUFFWCxTQUFLLE1BRk07QUFHWCxTQUFLLE1BSE07QUFJWCxTQUFLLFFBSk07QUFLWCxTQUFLLFFBTE07QUFNWCxTQUFLLFFBTk07QUFPWCxTQUFLO0FBUE0sSUFBYjs7QUFVQSxPQUFJLFdBQVcsWUFBZjtBQUFBLE9BQ0ksV0FBVyxXQURmOztBQUdBLFlBQVMsVUFBVCxDQUFvQixHQUFwQixFQUF5QjtBQUN2QixXQUFPLE9BQU8sR0FBUCxDQUFQO0FBQ0Q7O0FBRUQsWUFBUyxNQUFULENBQWdCLEdBQWhCLENBQW9CLGlCQUFwQixFQUF1QztBQUNyQyxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxVQUFLLElBQUksR0FBVCxJQUFnQixVQUFVLENBQVYsQ0FBaEIsRUFBOEI7QUFDNUIsVUFBSSxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsVUFBVSxDQUFWLENBQXJDLEVBQW1ELEdBQW5ELENBQUosRUFBNkQ7QUFDM0QsV0FBSSxHQUFKLElBQVcsVUFBVSxDQUFWLEVBQWEsR0FBYixDQUFYO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFdBQU8sR0FBUDtBQUNEOztBQUVELE9BQUksV0FBVyxPQUFPLFNBQVAsQ0FBaUIsUUFBaEM7O0FBRUEsV0FBUSxRQUFSLEdBQW1CLFFBQW5CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBSSxhQUFhLFNBQVMsVUFBVCxDQUFvQixLQUFwQixFQUEyQjtBQUMxQyxXQUFPLE9BQU8sS0FBUCxLQUFpQixVQUF4QjtBQUNELElBRkQ7QUFHQTtBQUNBO0FBQ0EsT0FBSSxXQUFXLEdBQVgsQ0FBSixFQUFxQjtBQUNuQixZQUFRLFVBQVIsR0FBcUIsYUFBYSxvQkFBVSxLQUFWLEVBQWlCO0FBQ2pELFlBQU8sT0FBTyxLQUFQLEtBQWlCLFVBQWpCLElBQStCLFNBQVMsSUFBVCxDQUFjLEtBQWQsTUFBeUIsbUJBQS9EO0FBQ0QsS0FGRDtBQUdEO0FBQ0QsV0FBUSxVQUFSLEdBQXFCLFVBQXJCOztBQUVBOztBQUVBO0FBQ0EsT0FBSSxVQUFVLE1BQU0sT0FBTixJQUFpQixVQUFVLEtBQVYsRUFBaUI7QUFDOUMsV0FBTyxTQUFTLFFBQU8sS0FBUCx5Q0FBTyxLQUFQLE9BQWlCLFFBQTFCLEdBQXFDLFNBQVMsSUFBVCxDQUFjLEtBQWQsTUFBeUIsZ0JBQTlELEdBQWlGLEtBQXhGO0FBQ0QsSUFGRDs7QUFJQSxXQUFRLE9BQVIsR0FBa0IsT0FBbEI7QUFDQTs7QUFFQSxZQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0IsS0FBeEIsRUFBK0I7QUFDN0IsU0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLE1BQU0sTUFBTSxNQUE1QixFQUFvQyxJQUFJLEdBQXhDLEVBQTZDLEdBQTdDLEVBQWtEO0FBQ2hELFNBQUksTUFBTSxDQUFOLE1BQWEsS0FBakIsRUFBd0I7QUFDdEIsYUFBTyxDQUFQO0FBQ0Q7QUFDRjtBQUNELFdBQU8sQ0FBQyxDQUFSO0FBQ0Q7O0FBRUQsWUFBUyxnQkFBVCxDQUEwQixNQUExQixFQUFrQztBQUNoQyxRQUFJLE9BQU8sTUFBUCxLQUFrQixRQUF0QixFQUFnQztBQUM5QjtBQUNBLFNBQUksVUFBVSxPQUFPLE1BQXJCLEVBQTZCO0FBQzNCLGFBQU8sT0FBTyxNQUFQLEVBQVA7QUFDRCxNQUZELE1BRU8sSUFBSSxVQUFVLElBQWQsRUFBb0I7QUFDekIsYUFBTyxFQUFQO0FBQ0QsTUFGTSxNQUVBLElBQUksQ0FBQyxNQUFMLEVBQWE7QUFDbEIsYUFBTyxTQUFTLEVBQWhCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsY0FBUyxLQUFLLE1BQWQ7QUFDRDs7QUFFRCxRQUFJLENBQUMsU0FBUyxJQUFULENBQWMsTUFBZCxDQUFMLEVBQTRCO0FBQzFCLFlBQU8sTUFBUDtBQUNEO0FBQ0QsV0FBTyxPQUFPLE9BQVAsQ0FBZSxRQUFmLEVBQXlCLFVBQXpCLENBQVA7QUFDRDs7QUFFRCxZQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0I7QUFDdEIsUUFBSSxDQUFDLEtBQUQsSUFBVSxVQUFVLENBQXhCLEVBQTJCO0FBQ3pCLFlBQU8sSUFBUDtBQUNELEtBRkQsTUFFTyxJQUFJLFFBQVEsS0FBUixLQUFrQixNQUFNLE1BQU4sS0FBaUIsQ0FBdkMsRUFBMEM7QUFDL0MsWUFBTyxJQUFQO0FBQ0QsS0FGTSxNQUVBO0FBQ0wsWUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRCxZQUFTLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkI7QUFDM0IsUUFBSSxRQUFRLE9BQU8sRUFBUCxFQUFXLE1BQVgsQ0FBWjtBQUNBLFVBQU0sT0FBTixHQUFnQixNQUFoQjtBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUVELFlBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixHQUE3QixFQUFrQztBQUNoQyxXQUFPLElBQVAsR0FBYyxHQUFkO0FBQ0EsV0FBTyxNQUFQO0FBQ0Q7O0FBRUQsWUFBUyxpQkFBVCxDQUEyQixXQUEzQixFQUF3QyxFQUF4QyxFQUE0QztBQUMxQyxXQUFPLENBQUMsY0FBYyxjQUFjLEdBQTVCLEdBQWtDLEVBQW5DLElBQXlDLEVBQWhEO0FBQ0Q7O0FBRUY7QUFBTyxHQXpaRztBQTBaVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTdCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxPQUFJLGFBQWEsQ0FBQyxhQUFELEVBQWdCLFVBQWhCLEVBQTRCLFlBQTVCLEVBQTBDLFNBQTFDLEVBQXFELE1BQXJELEVBQTZELFFBQTdELEVBQXVFLE9BQXZFLENBQWpCOztBQUVBLFlBQVMsU0FBVCxDQUFtQixPQUFuQixFQUE0QixJQUE1QixFQUFrQztBQUNoQyxRQUFJLE1BQU0sUUFBUSxLQUFLLEdBQXZCO0FBQUEsUUFDSSxPQUFPLFNBRFg7QUFBQSxRQUVJLFNBQVMsU0FGYjtBQUdBLFFBQUksR0FBSixFQUFTO0FBQ1AsWUFBTyxJQUFJLEtBQUosQ0FBVSxJQUFqQjtBQUNBLGNBQVMsSUFBSSxLQUFKLENBQVUsTUFBbkI7O0FBRUEsZ0JBQVcsUUFBUSxJQUFSLEdBQWUsR0FBZixHQUFxQixNQUFoQztBQUNEOztBQUVELFFBQUksTUFBTSxNQUFNLFNBQU4sQ0FBZ0IsV0FBaEIsQ0FBNEIsSUFBNUIsQ0FBaUMsSUFBakMsRUFBdUMsT0FBdkMsQ0FBVjs7QUFFQTtBQUNBLFNBQUssSUFBSSxNQUFNLENBQWYsRUFBa0IsTUFBTSxXQUFXLE1BQW5DLEVBQTJDLEtBQTNDLEVBQWtEO0FBQ2hELFVBQUssV0FBVyxHQUFYLENBQUwsSUFBd0IsSUFBSSxXQUFXLEdBQVgsQ0FBSixDQUF4QjtBQUNEOztBQUVEO0FBQ0EsUUFBSSxNQUFNLGlCQUFWLEVBQTZCO0FBQzNCLFdBQU0saUJBQU4sQ0FBd0IsSUFBeEIsRUFBOEIsU0FBOUI7QUFDRDs7QUFFRCxRQUFJO0FBQ0YsU0FBSSxHQUFKLEVBQVM7QUFDUCxXQUFLLFVBQUwsR0FBa0IsSUFBbEI7O0FBRUE7QUFDQTtBQUNBLFVBQUksc0JBQUosRUFBNEI7QUFDMUIsY0FBTyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFFBQTVCLEVBQXNDO0FBQ3BDLGVBQU8sTUFENkI7QUFFcEMsb0JBQVk7QUFGd0IsUUFBdEM7QUFJRCxPQUxELE1BS087QUFDTCxZQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0Q7QUFDRjtBQUNGLEtBZkQsQ0FlRSxPQUFPLEdBQVAsRUFBWTtBQUNaO0FBQ0Q7QUFDRjs7QUFFRCxhQUFVLFNBQVYsR0FBc0IsSUFBSSxLQUFKLEVBQXRCOztBQUVBLFdBQVEsU0FBUixJQUFxQixTQUFyQjtBQUNBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQXJkRztBQXNkVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQsVUFBTyxPQUFQLEdBQWlCLEVBQUUsV0FBVyxvQkFBb0IsQ0FBcEIsQ0FBYixFQUFxQyxZQUFZLElBQWpELEVBQWpCOztBQUVEO0FBQU8sR0EzZEc7QUE0ZFY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJELE9BQUksSUFBSSxvQkFBb0IsQ0FBcEIsQ0FBUjtBQUNBLFVBQU8sT0FBUCxHQUFpQixTQUFTLGNBQVQsQ0FBd0IsRUFBeEIsRUFBNEIsR0FBNUIsRUFBaUMsSUFBakMsRUFBc0M7QUFDckQsV0FBTyxFQUFFLE9BQUYsQ0FBVSxFQUFWLEVBQWMsR0FBZCxFQUFtQixJQUFuQixDQUFQO0FBQ0QsSUFGRDs7QUFJRDtBQUFPLEdBcGVHO0FBcWVWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDLE9BQUksVUFBVSxNQUFkO0FBQ0EsVUFBTyxPQUFQLEdBQWlCO0FBQ2YsWUFBWSxRQUFRLE1BREw7QUFFZixjQUFZLFFBQVEsY0FGTDtBQUdmLFlBQVksR0FBRyxvQkFIQTtBQUlmLGFBQVksUUFBUSx3QkFKTDtBQUtmLGFBQVksUUFBUSxjQUxMO0FBTWYsY0FBWSxRQUFRLGdCQU5MO0FBT2YsYUFBWSxRQUFRLElBUEw7QUFRZixjQUFZLFFBQVEsbUJBUkw7QUFTZixnQkFBWSxRQUFRLHFCQVRMO0FBVWYsVUFBWSxHQUFHO0FBVkEsSUFBakI7O0FBYUQ7QUFBTyxHQXRmRztBQXVmVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTdCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjtBQUNBLFdBQVEsc0JBQVIsR0FBaUMsc0JBQWpDOztBQUVBLE9BQUksNkJBQTZCLG9CQUFvQixFQUFwQixDQUFqQzs7QUFFQSxPQUFJLDhCQUE4Qix1QkFBdUIsMEJBQXZCLENBQWxDOztBQUVBLE9BQUksZUFBZSxvQkFBb0IsRUFBcEIsQ0FBbkI7O0FBRUEsT0FBSSxnQkFBZ0IsdUJBQXVCLFlBQXZCLENBQXBCOztBQUVBLE9BQUksd0JBQXdCLG9CQUFvQixFQUFwQixDQUE1Qjs7QUFFQSxPQUFJLHlCQUF5Qix1QkFBdUIscUJBQXZCLENBQTdCOztBQUVBLE9BQUksYUFBYSxvQkFBb0IsRUFBcEIsQ0FBakI7O0FBRUEsT0FBSSxjQUFjLHVCQUF1QixVQUF2QixDQUFsQjs7QUFFQSxPQUFJLGNBQWMsb0JBQW9CLEVBQXBCLENBQWxCOztBQUVBLE9BQUksZUFBZSx1QkFBdUIsV0FBdkIsQ0FBbkI7O0FBRUEsT0FBSSxpQkFBaUIsb0JBQW9CLEVBQXBCLENBQXJCOztBQUVBLE9BQUksa0JBQWtCLHVCQUF1QixjQUF2QixDQUF0Qjs7QUFFQSxPQUFJLGVBQWUsb0JBQW9CLEVBQXBCLENBQW5COztBQUVBLE9BQUksZ0JBQWdCLHVCQUF1QixZQUF2QixDQUFwQjs7QUFFQSxZQUFTLHNCQUFULENBQWdDLFFBQWhDLEVBQTBDO0FBQ3hDLGdDQUE0QixTQUE1QixFQUF1QyxRQUF2QztBQUNBLGtCQUFjLFNBQWQsRUFBeUIsUUFBekI7QUFDQSwyQkFBdUIsU0FBdkIsRUFBa0MsUUFBbEM7QUFDQSxnQkFBWSxTQUFaLEVBQXVCLFFBQXZCO0FBQ0EsaUJBQWEsU0FBYixFQUF3QixRQUF4QjtBQUNBLG9CQUFnQixTQUFoQixFQUEyQixRQUEzQjtBQUNBLGtCQUFjLFNBQWQsRUFBeUIsUUFBekI7QUFDRDs7QUFFRjtBQUFPLEdBdmlCRztBQXdpQlY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJEOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxPQUFJLFNBQVMsb0JBQW9CLENBQXBCLENBQWI7O0FBRUEsV0FBUSxTQUFSLElBQXFCLFVBQVUsUUFBVixFQUFvQjtBQUN2QyxhQUFTLGNBQVQsQ0FBd0Isb0JBQXhCLEVBQThDLFVBQVUsT0FBVixFQUFtQixPQUFuQixFQUE0QjtBQUN4RSxTQUFJLFVBQVUsUUFBUSxPQUF0QjtBQUFBLFNBQ0ksS0FBSyxRQUFRLEVBRGpCOztBQUdBLFNBQUksWUFBWSxJQUFoQixFQUFzQjtBQUNwQixhQUFPLEdBQUcsSUFBSCxDQUFQO0FBQ0QsTUFGRCxNQUVPLElBQUksWUFBWSxLQUFaLElBQXFCLFdBQVcsSUFBcEMsRUFBMEM7QUFDL0MsYUFBTyxRQUFRLElBQVIsQ0FBUDtBQUNELE1BRk0sTUFFQSxJQUFJLE9BQU8sT0FBUCxDQUFlLE9BQWYsQ0FBSixFQUE2QjtBQUNsQyxVQUFJLFFBQVEsTUFBUixHQUFpQixDQUFyQixFQUF3QjtBQUN0QixXQUFJLFFBQVEsR0FBWixFQUFpQjtBQUNmLGdCQUFRLEdBQVIsR0FBYyxDQUFDLFFBQVEsSUFBVCxDQUFkO0FBQ0Q7O0FBRUQsY0FBTyxTQUFTLE9BQVQsQ0FBaUIsSUFBakIsQ0FBc0IsT0FBdEIsRUFBK0IsT0FBL0IsQ0FBUDtBQUNELE9BTkQsTUFNTztBQUNMLGNBQU8sUUFBUSxJQUFSLENBQVA7QUFDRDtBQUNGLE1BVk0sTUFVQTtBQUNMLFVBQUksUUFBUSxJQUFSLElBQWdCLFFBQVEsR0FBNUIsRUFBaUM7QUFDL0IsV0FBSSxPQUFPLE9BQU8sV0FBUCxDQUFtQixRQUFRLElBQTNCLENBQVg7QUFDQSxZQUFLLFdBQUwsR0FBbUIsT0FBTyxpQkFBUCxDQUF5QixRQUFRLElBQVIsQ0FBYSxXQUF0QyxFQUFtRCxRQUFRLElBQTNELENBQW5CO0FBQ0EsaUJBQVUsRUFBRSxNQUFNLElBQVIsRUFBVjtBQUNEOztBQUVELGFBQU8sR0FBRyxPQUFILEVBQVksT0FBWixDQUFQO0FBQ0Q7QUFDRixLQTNCRDtBQTRCRCxJQTdCRDs7QUErQkEsVUFBTyxPQUFQLEdBQWlCLFFBQVEsU0FBUixDQUFqQjs7QUFFRDtBQUFPLEdBbGxCRztBQW1sQlY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJEOztBQUVBLE9BQUkseUJBQXlCLG9CQUFvQixDQUFwQixFQUF1QixTQUF2QixDQUE3Qjs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLE9BQUksYUFBYSxvQkFBb0IsQ0FBcEIsQ0FBakI7O0FBRUEsT0FBSSxjQUFjLHVCQUF1QixVQUF2QixDQUFsQjs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsVUFBVSxRQUFWLEVBQW9CO0FBQ3ZDLGFBQVMsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxVQUFVLE9BQVYsRUFBbUIsT0FBbkIsRUFBNEI7QUFDMUQsU0FBSSxDQUFDLE9BQUwsRUFBYztBQUNaLFlBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQiw2QkFBM0IsQ0FBTjtBQUNEOztBQUVELFNBQUksS0FBSyxRQUFRLEVBQWpCO0FBQUEsU0FDSSxVQUFVLFFBQVEsT0FEdEI7QUFBQSxTQUVJLElBQUksQ0FGUjtBQUFBLFNBR0ksTUFBTSxFQUhWO0FBQUEsU0FJSSxPQUFPLFNBSlg7QUFBQSxTQUtJLGNBQWMsU0FMbEI7O0FBT0EsU0FBSSxRQUFRLElBQVIsSUFBZ0IsUUFBUSxHQUE1QixFQUFpQztBQUMvQixvQkFBYyxPQUFPLGlCQUFQLENBQXlCLFFBQVEsSUFBUixDQUFhLFdBQXRDLEVBQW1ELFFBQVEsR0FBUixDQUFZLENBQVosQ0FBbkQsSUFBcUUsR0FBbkY7QUFDRDs7QUFFRCxTQUFJLE9BQU8sVUFBUCxDQUFrQixPQUFsQixDQUFKLEVBQWdDO0FBQzlCLGdCQUFVLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBVjtBQUNEOztBQUVELFNBQUksUUFBUSxJQUFaLEVBQWtCO0FBQ2hCLGFBQU8sT0FBTyxXQUFQLENBQW1CLFFBQVEsSUFBM0IsQ0FBUDtBQUNEOztBQUVELGNBQVMsYUFBVCxDQUF1QixLQUF2QixFQUE4QixLQUE5QixFQUFxQyxJQUFyQyxFQUEyQztBQUN6QyxVQUFJLElBQUosRUFBVTtBQUNSLFlBQUssR0FBTCxHQUFXLEtBQVg7QUFDQSxZQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsWUFBSyxLQUFMLEdBQWEsVUFBVSxDQUF2QjtBQUNBLFlBQUssSUFBTCxHQUFZLENBQUMsQ0FBQyxJQUFkOztBQUVBLFdBQUksV0FBSixFQUFpQjtBQUNmLGFBQUssV0FBTCxHQUFtQixjQUFjLEtBQWpDO0FBQ0Q7QUFDRjs7QUFFRCxZQUFNLE1BQU0sR0FBRyxRQUFRLEtBQVIsQ0FBSCxFQUFtQjtBQUM3QixhQUFNLElBRHVCO0FBRTdCLG9CQUFhLE9BQU8sV0FBUCxDQUFtQixDQUFDLFFBQVEsS0FBUixDQUFELEVBQWlCLEtBQWpCLENBQW5CLEVBQTRDLENBQUMsY0FBYyxLQUFmLEVBQXNCLElBQXRCLENBQTVDO0FBRmdCLE9BQW5CLENBQVo7QUFJRDs7QUFFRCxTQUFJLFdBQVcsUUFBTyxPQUFQLHlDQUFPLE9BQVAsT0FBbUIsUUFBbEMsRUFBNEM7QUFDMUMsVUFBSSxPQUFPLE9BQVAsQ0FBZSxPQUFmLENBQUosRUFBNkI7QUFDM0IsWUFBSyxJQUFJLElBQUksUUFBUSxNQUFyQixFQUE2QixJQUFJLENBQWpDLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3ZDLFlBQUksS0FBSyxPQUFULEVBQWtCO0FBQ2hCLHVCQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsTUFBTSxRQUFRLE1BQVIsR0FBaUIsQ0FBM0M7QUFDRDtBQUNGO0FBQ0YsT0FORCxNQU1PO0FBQ0wsV0FBSSxXQUFXLFNBQWY7O0FBRUEsWUFBSyxJQUFJLEdBQVQsSUFBZ0IsT0FBaEIsRUFBeUI7QUFDdkIsWUFBSSxRQUFRLGNBQVIsQ0FBdUIsR0FBdkIsQ0FBSixFQUFpQztBQUMvQjtBQUNBO0FBQ0E7QUFDQSxhQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDMUIsd0JBQWMsUUFBZCxFQUF3QixJQUFJLENBQTVCO0FBQ0Q7QUFDRCxvQkFBVyxHQUFYO0FBQ0E7QUFDRDtBQUNGO0FBQ0QsV0FBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCLHNCQUFjLFFBQWQsRUFBd0IsSUFBSSxDQUE1QixFQUErQixJQUEvQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFJLE1BQU0sQ0FBVixFQUFhO0FBQ1gsWUFBTSxRQUFRLElBQVIsQ0FBTjtBQUNEOztBQUVELFlBQU8sR0FBUDtBQUNELEtBM0VEO0FBNEVELElBN0VEOztBQStFQSxVQUFPLE9BQVAsR0FBaUIsUUFBUSxTQUFSLENBQWpCOztBQUVEO0FBQU8sR0FuckJHO0FBb3JCVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTdCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxPQUFJLGFBQWEsb0JBQW9CLENBQXBCLENBQWpCOztBQUVBLE9BQUksY0FBYyx1QkFBdUIsVUFBdkIsQ0FBbEI7O0FBRUEsV0FBUSxTQUFSLElBQXFCLFVBQVUsUUFBVixFQUFvQjtBQUN2QyxhQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsWUFBWSxxQkFBcUI7QUFDeEUsU0FBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUI7QUFDQSxhQUFPLFNBQVA7QUFDRCxNQUhELE1BR087QUFDTDtBQUNBLFlBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQixzQkFBc0IsVUFBVSxVQUFVLE1BQVYsR0FBbUIsQ0FBN0IsRUFBZ0MsSUFBdEQsR0FBNkQsR0FBeEYsQ0FBTjtBQUNEO0FBQ0YsS0FSRDtBQVNELElBVkQ7O0FBWUEsVUFBTyxPQUFQLEdBQWlCLFFBQVEsU0FBUixDQUFqQjs7QUFFRDtBQUFPLEdBL3NCRztBQWd0QlY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJEOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxPQUFJLFNBQVMsb0JBQW9CLENBQXBCLENBQWI7O0FBRUEsV0FBUSxTQUFSLElBQXFCLFVBQVUsUUFBVixFQUFvQjtBQUN2QyxhQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsVUFBVSxXQUFWLEVBQXVCLE9BQXZCLEVBQWdDO0FBQzVELFNBQUksT0FBTyxVQUFQLENBQWtCLFdBQWxCLENBQUosRUFBb0M7QUFDbEMsb0JBQWMsWUFBWSxJQUFaLENBQWlCLElBQWpCLENBQWQ7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxTQUFJLENBQUMsUUFBUSxJQUFSLENBQWEsV0FBZCxJQUE2QixDQUFDLFdBQTlCLElBQTZDLE9BQU8sT0FBUCxDQUFlLFdBQWYsQ0FBakQsRUFBOEU7QUFDNUUsYUFBTyxRQUFRLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNELE1BRkQsTUFFTztBQUNMLGFBQU8sUUFBUSxFQUFSLENBQVcsSUFBWCxDQUFQO0FBQ0Q7QUFDRixLQWJEOztBQWVBLGFBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxVQUFVLFdBQVYsRUFBdUIsT0FBdkIsRUFBZ0M7QUFDaEUsWUFBTyxTQUFTLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsRUFBa0MsV0FBbEMsRUFBK0MsRUFBRSxJQUFJLFFBQVEsT0FBZCxFQUF1QixTQUFTLFFBQVEsRUFBeEMsRUFBNEMsTUFBTSxRQUFRLElBQTFELEVBQS9DLENBQVA7QUFDRCxLQUZEO0FBR0QsSUFuQkQ7O0FBcUJBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQWh2Qkc7QUFpdkJWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsVUFBVSxRQUFWLEVBQW9CO0FBQ3ZDLGFBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQixZQUFZLHNCQUFzQjtBQUMvRCxTQUFJLE9BQU8sQ0FBQyxTQUFELENBQVg7QUFBQSxTQUNJLFVBQVUsVUFBVSxVQUFVLE1BQVYsR0FBbUIsQ0FBN0IsQ0FEZDtBQUVBLFVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQVYsR0FBbUIsQ0FBdkMsRUFBMEMsR0FBMUMsRUFBK0M7QUFDN0MsV0FBSyxJQUFMLENBQVUsVUFBVSxDQUFWLENBQVY7QUFDRDs7QUFFRCxTQUFJLFFBQVEsQ0FBWjtBQUNBLFNBQUksUUFBUSxJQUFSLENBQWEsS0FBYixJQUFzQixJQUExQixFQUFnQztBQUM5QixjQUFRLFFBQVEsSUFBUixDQUFhLEtBQXJCO0FBQ0QsTUFGRCxNQUVPLElBQUksUUFBUSxJQUFSLElBQWdCLFFBQVEsSUFBUixDQUFhLEtBQWIsSUFBc0IsSUFBMUMsRUFBZ0Q7QUFDckQsY0FBUSxRQUFRLElBQVIsQ0FBYSxLQUFyQjtBQUNEO0FBQ0QsVUFBSyxDQUFMLElBQVUsS0FBVjs7QUFFQSxjQUFTLEdBQVQsQ0FBYSxLQUFiLENBQW1CLFFBQW5CLEVBQTZCLElBQTdCO0FBQ0QsS0FoQkQ7QUFpQkQsSUFsQkQ7O0FBb0JBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQTl3Qkc7QUErd0JWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsVUFBVSxRQUFWLEVBQW9CO0FBQ3ZDLGFBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxVQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0FBQ3RELFlBQU8sT0FBTyxJQUFJLEtBQUosQ0FBZDtBQUNELEtBRkQ7QUFHRCxJQUpEOztBQU1BLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQTl4Qkc7QUEreEJWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLFdBQVEsU0FBUixJQUFxQixVQUFVLFFBQVYsRUFBb0I7QUFDdkMsYUFBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLFVBQVUsT0FBVixFQUFtQixPQUFuQixFQUE0QjtBQUMxRCxTQUFJLE9BQU8sVUFBUCxDQUFrQixPQUFsQixDQUFKLEVBQWdDO0FBQzlCLGdCQUFVLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBVjtBQUNEOztBQUVELFNBQUksS0FBSyxRQUFRLEVBQWpCOztBQUVBLFNBQUksQ0FBQyxPQUFPLE9BQVAsQ0FBZSxPQUFmLENBQUwsRUFBOEI7QUFDNUIsVUFBSSxPQUFPLFFBQVEsSUFBbkI7QUFDQSxVQUFJLFFBQVEsSUFBUixJQUFnQixRQUFRLEdBQTVCLEVBQWlDO0FBQy9CLGNBQU8sT0FBTyxXQUFQLENBQW1CLFFBQVEsSUFBM0IsQ0FBUDtBQUNBLFlBQUssV0FBTCxHQUFtQixPQUFPLGlCQUFQLENBQXlCLFFBQVEsSUFBUixDQUFhLFdBQXRDLEVBQW1ELFFBQVEsR0FBUixDQUFZLENBQVosQ0FBbkQsQ0FBbkI7QUFDRDs7QUFFRCxhQUFPLEdBQUcsT0FBSCxFQUFZO0FBQ2pCLGFBQU0sSUFEVztBQUVqQixvQkFBYSxPQUFPLFdBQVAsQ0FBbUIsQ0FBQyxPQUFELENBQW5CLEVBQThCLENBQUMsUUFBUSxLQUFLLFdBQWQsQ0FBOUI7QUFGSSxPQUFaLENBQVA7QUFJRCxNQVhELE1BV087QUFDTCxhQUFPLFFBQVEsT0FBUixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFDRixLQXJCRDtBQXNCRCxJQXZCRDs7QUF5QkEsVUFBTyxPQUFQLEdBQWlCLFFBQVEsU0FBUixDQUFqQjs7QUFFRDtBQUFPLEdBbjBCRztBQW8wQlY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJEOztBQUVBLE9BQUkseUJBQXlCLG9CQUFvQixDQUFwQixFQUF1QixTQUF2QixDQUE3Qjs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7QUFDQSxXQUFRLHlCQUFSLEdBQW9DLHlCQUFwQzs7QUFFQSxPQUFJLG9CQUFvQixvQkFBb0IsRUFBcEIsQ0FBeEI7O0FBRUEsT0FBSSxxQkFBcUIsdUJBQXVCLGlCQUF2QixDQUF6Qjs7QUFFQSxZQUFTLHlCQUFULENBQW1DLFFBQW5DLEVBQTZDO0FBQzNDLHVCQUFtQixTQUFuQixFQUE4QixRQUE5QjtBQUNEOztBQUVGO0FBQU8sR0F0MUJHO0FBdTFCVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7O0FBRUEsV0FBUSxVQUFSLEdBQXFCLElBQXJCOztBQUVBLE9BQUksU0FBUyxvQkFBb0IsQ0FBcEIsQ0FBYjs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsVUFBVSxRQUFWLEVBQW9CO0FBQ3ZDLGFBQVMsaUJBQVQsQ0FBMkIsUUFBM0IsRUFBcUMsVUFBVSxFQUFWLEVBQWMsS0FBZCxFQUFxQixTQUFyQixFQUFnQyxPQUFoQyxFQUF5QztBQUM1RSxTQUFJLE1BQU0sRUFBVjtBQUNBLFNBQUksQ0FBQyxNQUFNLFFBQVgsRUFBcUI7QUFDbkIsWUFBTSxRQUFOLEdBQWlCLEVBQWpCO0FBQ0EsWUFBTSxhQUFVLE9BQVYsRUFBbUIsT0FBbkIsRUFBNEI7QUFDaEM7QUFDQSxXQUFJLFdBQVcsVUFBVSxRQUF6QjtBQUNBLGlCQUFVLFFBQVYsR0FBcUIsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixRQUFsQixFQUE0QixNQUFNLFFBQWxDLENBQXJCO0FBQ0EsV0FBSSxNQUFNLEdBQUcsT0FBSCxFQUFZLE9BQVosQ0FBVjtBQUNBLGlCQUFVLFFBQVYsR0FBcUIsUUFBckI7QUFDQSxjQUFPLEdBQVA7QUFDRCxPQVBEO0FBUUQ7O0FBRUQsV0FBTSxRQUFOLENBQWUsUUFBUSxJQUFSLENBQWEsQ0FBYixDQUFmLElBQWtDLFFBQVEsRUFBMUM7O0FBRUEsWUFBTyxHQUFQO0FBQ0QsS0FqQkQ7QUFrQkQsSUFuQkQ7O0FBcUJBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQXYzQkc7QUF3M0JWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLE9BQUksU0FBUztBQUNYLGVBQVcsQ0FBQyxPQUFELEVBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQixPQUExQixDQURBO0FBRVgsV0FBTyxNQUZJOztBQUlYO0FBQ0EsaUJBQWEsU0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCO0FBQ3ZDLFNBQUksT0FBTyxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzdCLFVBQUksV0FBVyxPQUFPLE9BQVAsQ0FBZSxPQUFPLFNBQXRCLEVBQWlDLE1BQU0sV0FBTixFQUFqQyxDQUFmO0FBQ0EsVUFBSSxZQUFZLENBQWhCLEVBQW1CO0FBQ2pCLGVBQVEsUUFBUjtBQUNELE9BRkQsTUFFTztBQUNMLGVBQVEsU0FBUyxLQUFULEVBQWdCLEVBQWhCLENBQVI7QUFDRDtBQUNGOztBQUVELFlBQU8sS0FBUDtBQUNELEtBaEJVOztBQWtCWDtBQUNBLFNBQUssU0FBUyxHQUFULENBQWEsS0FBYixFQUFvQjtBQUN2QixhQUFRLE9BQU8sV0FBUCxDQUFtQixLQUFuQixDQUFSOztBQUVBLFNBQUksT0FBTyxPQUFQLEtBQW1CLFdBQW5CLElBQWtDLE9BQU8sV0FBUCxDQUFtQixPQUFPLEtBQTFCLEtBQW9DLEtBQTFFLEVBQWlGO0FBQy9FLFVBQUksU0FBUyxPQUFPLFNBQVAsQ0FBaUIsS0FBakIsQ0FBYjtBQUNBLFVBQUksQ0FBQyxRQUFRLE1BQVIsQ0FBTCxFQUFzQjtBQUNwQjtBQUNBLGdCQUFTLEtBQVQ7QUFDRDs7QUFFRCxXQUFLLElBQUksT0FBTyxVQUFVLE1BQXJCLEVBQTZCLFVBQVUsTUFBTSxPQUFPLENBQVAsR0FBVyxPQUFPLENBQWxCLEdBQXNCLENBQTVCLENBQXZDLEVBQXVFLE9BQU8sQ0FBbkYsRUFBc0YsT0FBTyxJQUE3RixFQUFtRyxNQUFuRyxFQUEyRztBQUN6RyxlQUFRLE9BQU8sQ0FBZixJQUFvQixVQUFVLElBQVYsQ0FBcEI7QUFDRDs7QUFFRCxjQUFRLE1BQVIsRUFBZ0IsS0FBaEIsQ0FBc0IsT0FBdEIsRUFBK0IsT0FBL0IsRUFYK0UsQ0FXdEM7QUFDMUM7QUFDRjtBQW5DVSxJQUFiOztBQXNDQSxXQUFRLFNBQVIsSUFBcUIsTUFBckI7QUFDQSxVQUFPLE9BQVAsR0FBaUIsUUFBUSxTQUFSLENBQWpCOztBQUVEO0FBQU8sR0ExNkJHO0FBMjZCVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCOztBQUVoQztBQUNBOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjtBQUNBLFlBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QjtBQUMxQixTQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0Q7O0FBRUQsY0FBVyxTQUFYLENBQXFCLFFBQXJCLEdBQWdDLFdBQVcsU0FBWCxDQUFxQixNQUFyQixHQUE4QixZQUFZO0FBQ3hFLFdBQU8sS0FBSyxLQUFLLE1BQWpCO0FBQ0QsSUFGRDs7QUFJQSxXQUFRLFNBQVIsSUFBcUIsVUFBckI7QUFDQSxVQUFPLE9BQVAsR0FBaUIsUUFBUSxTQUFSLENBQWpCOztBQUVEO0FBQU8sR0E3N0JHO0FBODdCVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7O0FBRUEsT0FBSSxlQUFlLG9CQUFvQixFQUFwQixFQUF3QixTQUF4QixDQUFuQjs7QUFFQSxPQUFJLDBCQUEwQixvQkFBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBOUI7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTdCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjtBQUNBLFdBQVEsYUFBUixHQUF3QixhQUF4QjtBQUNBLFdBQVEsUUFBUixHQUFtQixRQUFuQjtBQUNBLFdBQVEsV0FBUixHQUFzQixXQUF0QjtBQUNBLFdBQVEsY0FBUixHQUF5QixjQUF6QjtBQUNBLFdBQVEsYUFBUixHQUF3QixhQUF4QjtBQUNBLFdBQVEsSUFBUixHQUFlLElBQWY7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLE9BQUksUUFBUSx3QkFBd0IsTUFBeEIsQ0FBWjs7QUFFQSxPQUFJLGFBQWEsb0JBQW9CLENBQXBCLENBQWpCOztBQUVBLE9BQUksY0FBYyx1QkFBdUIsVUFBdkIsQ0FBbEI7O0FBRUEsT0FBSSxRQUFRLG9CQUFvQixDQUFwQixDQUFaOztBQUVBLFlBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUNuQyxRQUFJLG1CQUFtQixnQkFBZ0IsYUFBYSxDQUFiLENBQWhCLElBQW1DLENBQTFEO0FBQUEsUUFDSSxrQkFBa0IsTUFBTSxpQkFENUI7O0FBR0EsUUFBSSxxQkFBcUIsZUFBekIsRUFBMEM7QUFDeEMsU0FBSSxtQkFBbUIsZUFBdkIsRUFBd0M7QUFDdEMsVUFBSSxrQkFBa0IsTUFBTSxnQkFBTixDQUF1QixlQUF2QixDQUF0QjtBQUFBLFVBQ0ksbUJBQW1CLE1BQU0sZ0JBQU4sQ0FBdUIsZ0JBQXZCLENBRHZCO0FBRUEsWUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLDRGQUE0RixxREFBNUYsR0FBb0osZUFBcEosR0FBc0ssbURBQXRLLEdBQTROLGdCQUE1TixHQUErTyxJQUExUSxDQUFOO0FBQ0QsTUFKRCxNQUlPO0FBQ0w7QUFDQSxZQUFNLElBQUksWUFBWSxTQUFaLENBQUosQ0FBMkIsMkZBQTJGLGlEQUEzRixHQUErSSxhQUFhLENBQWIsQ0FBL0ksR0FBaUssSUFBNUwsQ0FBTjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxZQUFTLFFBQVQsQ0FBa0IsWUFBbEIsRUFBZ0MsR0FBaEMsRUFBcUM7QUFDbkM7QUFDQSxRQUFJLENBQUMsR0FBTCxFQUFVO0FBQ1IsV0FBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLG1DQUEzQixDQUFOO0FBQ0Q7QUFDRCxRQUFJLENBQUMsWUFBRCxJQUFpQixDQUFDLGFBQWEsSUFBbkMsRUFBeUM7QUFDdkMsV0FBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLHNDQUFxQyxZQUFyQyx5Q0FBcUMsWUFBckMsRUFBM0IsQ0FBTjtBQUNEOztBQUVELGlCQUFhLElBQWIsQ0FBa0IsU0FBbEIsR0FBOEIsYUFBYSxNQUEzQzs7QUFFQTtBQUNBO0FBQ0EsUUFBSSxFQUFKLENBQU8sYUFBUCxDQUFxQixhQUFhLFFBQWxDOztBQUVBLGFBQVMsb0JBQVQsQ0FBOEIsT0FBOUIsRUFBdUMsT0FBdkMsRUFBZ0QsT0FBaEQsRUFBeUQ7QUFDdkQsU0FBSSxRQUFRLElBQVosRUFBa0I7QUFDaEIsZ0JBQVUsTUFBTSxNQUFOLENBQWEsRUFBYixFQUFpQixPQUFqQixFQUEwQixRQUFRLElBQWxDLENBQVY7QUFDQSxVQUFJLFFBQVEsR0FBWixFQUFpQjtBQUNmLGVBQVEsR0FBUixDQUFZLENBQVosSUFBaUIsSUFBakI7QUFDRDtBQUNGOztBQUVELGVBQVUsSUFBSSxFQUFKLENBQU8sY0FBUCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixFQUFpQyxPQUFqQyxFQUEwQyxPQUExQyxFQUFtRCxPQUFuRCxDQUFWO0FBQ0EsU0FBSSxTQUFTLElBQUksRUFBSixDQUFPLGFBQVAsQ0FBcUIsSUFBckIsQ0FBMEIsSUFBMUIsRUFBZ0MsT0FBaEMsRUFBeUMsT0FBekMsRUFBa0QsT0FBbEQsQ0FBYjs7QUFFQSxTQUFJLFVBQVUsSUFBVixJQUFrQixJQUFJLE9BQTFCLEVBQW1DO0FBQ2pDLGNBQVEsUUFBUixDQUFpQixRQUFRLElBQXpCLElBQWlDLElBQUksT0FBSixDQUFZLE9BQVosRUFBcUIsYUFBYSxlQUFsQyxFQUFtRCxHQUFuRCxDQUFqQztBQUNBLGVBQVMsUUFBUSxRQUFSLENBQWlCLFFBQVEsSUFBekIsRUFBK0IsT0FBL0IsRUFBd0MsT0FBeEMsQ0FBVDtBQUNEO0FBQ0QsU0FBSSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsVUFBSSxRQUFRLE1BQVosRUFBb0I7QUFDbEIsV0FBSSxRQUFRLE9BQU8sS0FBUCxDQUFhLElBQWIsQ0FBWjtBQUNBLFlBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxJQUFJLE1BQU0sTUFBMUIsRUFBa0MsSUFBSSxDQUF0QyxFQUF5QyxHQUF6QyxFQUE4QztBQUM1QyxZQUFJLENBQUMsTUFBTSxDQUFOLENBQUQsSUFBYSxJQUFJLENBQUosS0FBVSxDQUEzQixFQUE4QjtBQUM1QjtBQUNEOztBQUVELGNBQU0sQ0FBTixJQUFXLFFBQVEsTUFBUixHQUFpQixNQUFNLENBQU4sQ0FBNUI7QUFDRDtBQUNELGdCQUFTLE1BQU0sSUFBTixDQUFXLElBQVgsQ0FBVDtBQUNEO0FBQ0QsYUFBTyxNQUFQO0FBQ0QsTUFiRCxNQWFPO0FBQ0wsWUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLGlCQUFpQixRQUFRLElBQXpCLEdBQWdDLDBEQUEzRCxDQUFOO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLFFBQUksWUFBWTtBQUNkLGFBQVEsU0FBUyxNQUFULENBQWdCLEdBQWhCLEVBQXFCLElBQXJCLEVBQTJCO0FBQ2pDLFVBQUksRUFBRSxRQUFRLEdBQVYsQ0FBSixFQUFvQjtBQUNsQixhQUFNLElBQUksWUFBWSxTQUFaLENBQUosQ0FBMkIsTUFBTSxJQUFOLEdBQWEsbUJBQWIsR0FBbUMsR0FBOUQsQ0FBTjtBQUNEO0FBQ0QsYUFBTyxJQUFJLElBQUosQ0FBUDtBQUNELE1BTmE7QUFPZCxhQUFRLFNBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixJQUF4QixFQUE4QjtBQUNwQyxVQUFJLE1BQU0sT0FBTyxNQUFqQjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxHQUFwQixFQUF5QixHQUF6QixFQUE4QjtBQUM1QixXQUFJLE9BQU8sQ0FBUCxLQUFhLE9BQU8sQ0FBUCxFQUFVLElBQVYsS0FBbUIsSUFBcEMsRUFBMEM7QUFDeEMsZUFBTyxPQUFPLENBQVAsRUFBVSxJQUFWLENBQVA7QUFDRDtBQUNGO0FBQ0YsTUFkYTtBQWVkLGFBQVEsU0FBUyxNQUFULENBQWdCLE9BQWhCLEVBQXlCLE9BQXpCLEVBQWtDO0FBQ3hDLGFBQU8sT0FBTyxPQUFQLEtBQW1CLFVBQW5CLEdBQWdDLFFBQVEsSUFBUixDQUFhLE9BQWIsQ0FBaEMsR0FBd0QsT0FBL0Q7QUFDRCxNQWpCYTs7QUFtQmQsdUJBQWtCLE1BQU0sZ0JBbkJWO0FBb0JkLG9CQUFlLG9CQXBCRDs7QUFzQmQsU0FBSSxTQUFTLEVBQVQsQ0FBWSxDQUFaLEVBQWU7QUFDakIsVUFBSSxNQUFNLGFBQWEsQ0FBYixDQUFWO0FBQ0EsVUFBSSxTQUFKLEdBQWdCLGFBQWEsSUFBSSxJQUFqQixDQUFoQjtBQUNBLGFBQU8sR0FBUDtBQUNELE1BMUJhOztBQTRCZCxlQUFVLEVBNUJJO0FBNkJkLGNBQVMsU0FBUyxPQUFULENBQWlCLENBQWpCLEVBQW9CLElBQXBCLEVBQTBCLG1CQUExQixFQUErQyxXQUEvQyxFQUE0RCxNQUE1RCxFQUFvRTtBQUMzRSxVQUFJLGlCQUFpQixLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQXJCO0FBQUEsVUFDSSxLQUFLLEtBQUssRUFBTCxDQUFRLENBQVIsQ0FEVDtBQUVBLFVBQUksUUFBUSxNQUFSLElBQWtCLFdBQWxCLElBQWlDLG1CQUFyQyxFQUEwRDtBQUN4RCx3QkFBaUIsWUFBWSxJQUFaLEVBQWtCLENBQWxCLEVBQXFCLEVBQXJCLEVBQXlCLElBQXpCLEVBQStCLG1CQUEvQixFQUFvRCxXQUFwRCxFQUFpRSxNQUFqRSxDQUFqQjtBQUNELE9BRkQsTUFFTyxJQUFJLENBQUMsY0FBTCxFQUFxQjtBQUMxQix3QkFBaUIsS0FBSyxRQUFMLENBQWMsQ0FBZCxJQUFtQixZQUFZLElBQVosRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0FBcEM7QUFDRDtBQUNELGFBQU8sY0FBUDtBQUNELE1BdENhOztBQXdDZCxXQUFNLFNBQVMsSUFBVCxDQUFjLEtBQWQsRUFBcUIsS0FBckIsRUFBNEI7QUFDaEMsYUFBTyxTQUFTLE9BQWhCLEVBQXlCO0FBQ3ZCLGVBQVEsTUFBTSxPQUFkO0FBQ0Q7QUFDRCxhQUFPLEtBQVA7QUFDRCxNQTdDYTtBQThDZCxZQUFPLFNBQVMsS0FBVCxDQUFlLEtBQWYsRUFBc0IsTUFBdEIsRUFBOEI7QUFDbkMsVUFBSSxNQUFNLFNBQVMsTUFBbkI7O0FBRUEsVUFBSSxTQUFTLE1BQVQsSUFBbUIsVUFBVSxNQUFqQyxFQUF5QztBQUN2QyxhQUFNLE1BQU0sTUFBTixDQUFhLEVBQWIsRUFBaUIsTUFBakIsRUFBeUIsS0FBekIsQ0FBTjtBQUNEOztBQUVELGFBQU8sR0FBUDtBQUNELE1BdERhO0FBdURkO0FBQ0Esa0JBQWEsYUFBYSxFQUFiLENBeERDOztBQTBEZCxXQUFNLElBQUksRUFBSixDQUFPLElBMURDO0FBMkRkLG1CQUFjLGFBQWE7QUEzRGIsS0FBaEI7O0FBOERBLGFBQVMsR0FBVCxDQUFhLE9BQWIsRUFBc0I7QUFDcEIsU0FBSSxVQUFVLFVBQVUsTUFBVixJQUFvQixDQUFwQixJQUF5QixVQUFVLENBQVYsTUFBaUIsU0FBMUMsR0FBc0QsRUFBdEQsR0FBMkQsVUFBVSxDQUFWLENBQXpFOztBQUVBLFNBQUksT0FBTyxRQUFRLElBQW5COztBQUVBLFNBQUksTUFBSixDQUFXLE9BQVg7QUFDQSxTQUFJLENBQUMsUUFBUSxPQUFULElBQW9CLGFBQWEsT0FBckMsRUFBOEM7QUFDNUMsYUFBTyxTQUFTLE9BQVQsRUFBa0IsSUFBbEIsQ0FBUDtBQUNEO0FBQ0QsU0FBSSxTQUFTLFNBQWI7QUFBQSxTQUNJLGNBQWMsYUFBYSxjQUFiLEdBQThCLEVBQTlCLEdBQW1DLFNBRHJEO0FBRUEsU0FBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCLFVBQUksUUFBUSxNQUFaLEVBQW9CO0FBQ2xCLGdCQUFTLFdBQVcsUUFBUSxNQUFSLENBQWUsQ0FBZixDQUFYLEdBQStCLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBaUIsUUFBUSxNQUF6QixDQUEvQixHQUFrRSxRQUFRLE1BQW5GO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZ0JBQVMsQ0FBQyxPQUFELENBQVQ7QUFDRDtBQUNGOztBQUVELGNBQVMsSUFBVCxDQUFjLE9BQWQsQ0FBc0IsYUFBdEIsRUFBcUM7QUFDbkMsYUFBTyxLQUFLLGFBQWEsSUFBYixDQUFrQixTQUFsQixFQUE2QixPQUE3QixFQUFzQyxVQUFVLE9BQWhELEVBQXlELFVBQVUsUUFBbkUsRUFBNkUsSUFBN0UsRUFBbUYsV0FBbkYsRUFBZ0csTUFBaEcsQ0FBWjtBQUNEO0FBQ0QsWUFBTyxrQkFBa0IsYUFBYSxJQUEvQixFQUFxQyxJQUFyQyxFQUEyQyxTQUEzQyxFQUFzRCxRQUFRLE1BQVIsSUFBa0IsRUFBeEUsRUFBNEUsSUFBNUUsRUFBa0YsV0FBbEYsQ0FBUDtBQUNBLFlBQU8sS0FBSyxPQUFMLEVBQWMsT0FBZCxDQUFQO0FBQ0Q7QUFDRCxRQUFJLEtBQUosR0FBWSxJQUFaOztBQUVBLFFBQUksTUFBSixHQUFhLFVBQVUsT0FBVixFQUFtQjtBQUM5QixTQUFJLENBQUMsUUFBUSxPQUFiLEVBQXNCO0FBQ3BCLGdCQUFVLE9BQVYsR0FBb0IsVUFBVSxLQUFWLENBQWdCLFFBQVEsT0FBeEIsRUFBaUMsSUFBSSxPQUFyQyxDQUFwQjs7QUFFQSxVQUFJLGFBQWEsVUFBakIsRUFBNkI7QUFDM0IsaUJBQVUsUUFBVixHQUFxQixVQUFVLEtBQVYsQ0FBZ0IsUUFBUSxRQUF4QixFQUFrQyxJQUFJLFFBQXRDLENBQXJCO0FBQ0Q7QUFDRCxVQUFJLGFBQWEsVUFBYixJQUEyQixhQUFhLGFBQTVDLEVBQTJEO0FBQ3pELGlCQUFVLFVBQVYsR0FBdUIsVUFBVSxLQUFWLENBQWdCLFFBQVEsVUFBeEIsRUFBb0MsSUFBSSxVQUF4QyxDQUF2QjtBQUNEO0FBQ0YsTUFURCxNQVNPO0FBQ0wsZ0JBQVUsT0FBVixHQUFvQixRQUFRLE9BQTVCO0FBQ0EsZ0JBQVUsUUFBVixHQUFxQixRQUFRLFFBQTdCO0FBQ0EsZ0JBQVUsVUFBVixHQUF1QixRQUFRLFVBQS9CO0FBQ0Q7QUFDRixLQWZEOztBQWlCQSxRQUFJLE1BQUosR0FBYSxVQUFVLENBQVYsRUFBYSxJQUFiLEVBQW1CLFdBQW5CLEVBQWdDLE1BQWhDLEVBQXdDO0FBQ25ELFNBQUksYUFBYSxjQUFiLElBQStCLENBQUMsV0FBcEMsRUFBaUQ7QUFDL0MsWUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLHdCQUEzQixDQUFOO0FBQ0Q7QUFDRCxTQUFJLGFBQWEsU0FBYixJQUEwQixDQUFDLE1BQS9CLEVBQXVDO0FBQ3JDLFlBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQix5QkFBM0IsQ0FBTjtBQUNEOztBQUVELFlBQU8sWUFBWSxTQUFaLEVBQXVCLENBQXZCLEVBQTBCLGFBQWEsQ0FBYixDQUExQixFQUEyQyxJQUEzQyxFQUFpRCxDQUFqRCxFQUFvRCxXQUFwRCxFQUFpRSxNQUFqRSxDQUFQO0FBQ0QsS0FURDtBQVVBLFdBQU8sR0FBUDtBQUNEOztBQUVELFlBQVMsV0FBVCxDQUFxQixTQUFyQixFQUFnQyxDQUFoQyxFQUFtQyxFQUFuQyxFQUF1QyxJQUF2QyxFQUE2QyxtQkFBN0MsRUFBa0UsV0FBbEUsRUFBK0UsTUFBL0UsRUFBdUY7QUFDckYsYUFBUyxJQUFULENBQWMsT0FBZCxFQUF1QjtBQUNyQixTQUFJLFVBQVUsVUFBVSxNQUFWLElBQW9CLENBQXBCLElBQXlCLFVBQVUsQ0FBVixNQUFpQixTQUExQyxHQUFzRCxFQUF0RCxHQUEyRCxVQUFVLENBQVYsQ0FBekU7O0FBRUEsU0FBSSxnQkFBZ0IsTUFBcEI7QUFDQSxTQUFJLFVBQVUsV0FBVyxPQUFPLENBQVAsQ0FBckIsSUFBa0MsRUFBRSxZQUFZLFVBQVUsV0FBdEIsSUFBcUMsT0FBTyxDQUFQLE1BQWMsSUFBckQsQ0FBdEMsRUFBa0c7QUFDaEcsc0JBQWdCLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBaUIsTUFBakIsQ0FBaEI7QUFDRDs7QUFFRCxZQUFPLEdBQUcsU0FBSCxFQUFjLE9BQWQsRUFBdUIsVUFBVSxPQUFqQyxFQUEwQyxVQUFVLFFBQXBELEVBQThELFFBQVEsSUFBUixJQUFnQixJQUE5RSxFQUFvRixlQUFlLENBQUMsUUFBUSxXQUFULEVBQXNCLE1BQXRCLENBQTZCLFdBQTdCLENBQW5HLEVBQThJLGFBQTlJLENBQVA7QUFDRDs7QUFFRCxXQUFPLGtCQUFrQixFQUFsQixFQUFzQixJQUF0QixFQUE0QixTQUE1QixFQUF1QyxNQUF2QyxFQUErQyxJQUEvQyxFQUFxRCxXQUFyRCxDQUFQOztBQUVBLFNBQUssT0FBTCxHQUFlLENBQWY7QUFDQSxTQUFLLEtBQUwsR0FBYSxTQUFTLE9BQU8sTUFBaEIsR0FBeUIsQ0FBdEM7QUFDQSxTQUFLLFdBQUwsR0FBbUIsdUJBQXVCLENBQTFDO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsWUFBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDLE9BQWpDLEVBQTBDLE9BQTFDLEVBQW1EO0FBQ2pELFFBQUksQ0FBQyxPQUFMLEVBQWM7QUFDWixTQUFJLFFBQVEsSUFBUixLQUFpQixnQkFBckIsRUFBdUM7QUFDckMsZ0JBQVUsUUFBUSxJQUFSLENBQWEsZUFBYixDQUFWO0FBQ0QsTUFGRCxNQUVPO0FBQ0wsZ0JBQVUsUUFBUSxRQUFSLENBQWlCLFFBQVEsSUFBekIsQ0FBVjtBQUNEO0FBQ0YsS0FORCxNQU1PLElBQUksQ0FBQyxRQUFRLElBQVQsSUFBaUIsQ0FBQyxRQUFRLElBQTlCLEVBQW9DO0FBQ3pDO0FBQ0EsYUFBUSxJQUFSLEdBQWUsT0FBZjtBQUNBLGVBQVUsUUFBUSxRQUFSLENBQWlCLE9BQWpCLENBQVY7QUFDRDtBQUNELFdBQU8sT0FBUDtBQUNEOztBQUVELFlBQVMsYUFBVCxDQUF1QixPQUF2QixFQUFnQyxPQUFoQyxFQUF5QyxPQUF6QyxFQUFrRDtBQUNoRDtBQUNBLFFBQUksc0JBQXNCLFFBQVEsSUFBUixJQUFnQixRQUFRLElBQVIsQ0FBYSxlQUFiLENBQTFDO0FBQ0EsWUFBUSxPQUFSLEdBQWtCLElBQWxCO0FBQ0EsUUFBSSxRQUFRLEdBQVosRUFBaUI7QUFDZixhQUFRLElBQVIsQ0FBYSxXQUFiLEdBQTJCLFFBQVEsR0FBUixDQUFZLENBQVosS0FBa0IsUUFBUSxJQUFSLENBQWEsV0FBMUQ7QUFDRDs7QUFFRCxRQUFJLGVBQWUsU0FBbkI7QUFDQSxRQUFJLFFBQVEsRUFBUixJQUFjLFFBQVEsRUFBUixLQUFlLElBQWpDLEVBQXVDO0FBQ3JDLE1BQUMsWUFBWTtBQUNYLGNBQVEsSUFBUixHQUFlLE1BQU0sV0FBTixDQUFrQixRQUFRLElBQTFCLENBQWY7QUFDQTtBQUNBLFVBQUksS0FBSyxRQUFRLEVBQWpCO0FBQ0EscUJBQWUsUUFBUSxJQUFSLENBQWEsZUFBYixJQUFnQyxTQUFTLG1CQUFULENBQTZCLE9BQTdCLEVBQXNDO0FBQ25GLFdBQUksVUFBVSxVQUFVLE1BQVYsSUFBb0IsQ0FBcEIsSUFBeUIsVUFBVSxDQUFWLE1BQWlCLFNBQTFDLEdBQXNELEVBQXRELEdBQTJELFVBQVUsQ0FBVixDQUF6RTs7QUFFQTtBQUNBO0FBQ0EsZUFBUSxJQUFSLEdBQWUsTUFBTSxXQUFOLENBQWtCLFFBQVEsSUFBMUIsQ0FBZjtBQUNBLGVBQVEsSUFBUixDQUFhLGVBQWIsSUFBZ0MsbUJBQWhDO0FBQ0EsY0FBTyxHQUFHLE9BQUgsRUFBWSxPQUFaLENBQVA7QUFDRCxPQVJEO0FBU0EsVUFBSSxHQUFHLFFBQVAsRUFBaUI7QUFDZixlQUFRLFFBQVIsR0FBbUIsTUFBTSxNQUFOLENBQWEsRUFBYixFQUFpQixRQUFRLFFBQXpCLEVBQW1DLEdBQUcsUUFBdEMsQ0FBbkI7QUFDRDtBQUNGLE1BaEJEO0FBaUJEOztBQUVELFFBQUksWUFBWSxTQUFaLElBQXlCLFlBQTdCLEVBQTJDO0FBQ3pDLGVBQVUsWUFBVjtBQUNEOztBQUVELFFBQUksWUFBWSxTQUFoQixFQUEyQjtBQUN6QixXQUFNLElBQUksWUFBWSxTQUFaLENBQUosQ0FBMkIsaUJBQWlCLFFBQVEsSUFBekIsR0FBZ0MscUJBQTNELENBQU47QUFDRCxLQUZELE1BRU8sSUFBSSxtQkFBbUIsUUFBdkIsRUFBaUM7QUFDdEMsWUFBTyxRQUFRLE9BQVIsRUFBaUIsT0FBakIsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQsWUFBUyxJQUFULEdBQWdCO0FBQ2QsV0FBTyxFQUFQO0FBQ0Q7O0FBRUQsWUFBUyxRQUFULENBQWtCLE9BQWxCLEVBQTJCLElBQTNCLEVBQWlDO0FBQy9CLFFBQUksQ0FBQyxJQUFELElBQVMsRUFBRSxVQUFVLElBQVosQ0FBYixFQUFnQztBQUM5QixZQUFPLE9BQU8sTUFBTSxXQUFOLENBQWtCLElBQWxCLENBQVAsR0FBaUMsRUFBeEM7QUFDQSxVQUFLLElBQUwsR0FBWSxPQUFaO0FBQ0Q7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFFRCxZQUFTLGlCQUFULENBQTJCLEVBQTNCLEVBQStCLElBQS9CLEVBQXFDLFNBQXJDLEVBQWdELE1BQWhELEVBQXdELElBQXhELEVBQThELFdBQTlELEVBQTJFO0FBQ3pFLFFBQUksR0FBRyxTQUFQLEVBQWtCO0FBQ2hCLFNBQUksUUFBUSxFQUFaO0FBQ0EsWUFBTyxHQUFHLFNBQUgsQ0FBYSxJQUFiLEVBQW1CLEtBQW5CLEVBQTBCLFNBQTFCLEVBQXFDLFVBQVUsT0FBTyxDQUFQLENBQS9DLEVBQTBELElBQTFELEVBQWdFLFdBQWhFLEVBQTZFLE1BQTdFLENBQVA7QUFDQSxXQUFNLE1BQU4sQ0FBYSxJQUFiLEVBQW1CLEtBQW5CO0FBQ0Q7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFFRjtBQUFPLEdBbnZDRztBQW92Q1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJELFVBQU8sT0FBUCxHQUFpQixFQUFFLFdBQVcsb0JBQW9CLEVBQXBCLENBQWIsRUFBc0MsWUFBWSxJQUFsRCxFQUFqQjs7QUFFRDtBQUFPLEdBenZDRztBQTB2Q1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJELHVCQUFvQixFQUFwQjtBQUNBLFVBQU8sT0FBUCxHQUFpQixvQkFBb0IsRUFBcEIsRUFBd0IsTUFBeEIsQ0FBK0IsSUFBaEQ7O0FBRUQ7QUFBTyxHQWh3Q0c7QUFpd0NWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDtBQUNBLE9BQUksV0FBVyxvQkFBb0IsRUFBcEIsQ0FBZjs7QUFFQSx1QkFBb0IsRUFBcEIsRUFBd0IsTUFBeEIsRUFBZ0MsVUFBUyxLQUFULEVBQWU7QUFDN0MsV0FBTyxTQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWlCO0FBQ3RCLFlBQU8sU0FBUyxTQUFTLEVBQVQsQ0FBVCxHQUF3QixNQUFNLEVBQU4sQ0FBeEIsR0FBb0MsRUFBM0M7QUFDRCxLQUZEO0FBR0QsSUFKRDs7QUFNRDtBQUFPLEdBN3dDRztBQTh3Q1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjs7QUFFaEMsVUFBTyxPQUFQLEdBQWlCLFVBQVMsRUFBVCxFQUFZO0FBQzNCLFdBQU8sUUFBTyxFQUFQLHlDQUFPLEVBQVAsT0FBYyxRQUFkLEdBQXlCLE9BQU8sSUFBaEMsR0FBdUMsT0FBTyxFQUFQLEtBQWMsVUFBNUQ7QUFDRCxJQUZEOztBQUlEO0FBQU8sR0FyeENHO0FBc3hDVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7QUFDQSxPQUFJLFVBQVUsb0JBQW9CLEVBQXBCLENBQWQ7QUFBQSxPQUNJLE9BQVUsb0JBQW9CLEVBQXBCLENBRGQ7QUFBQSxPQUVJLFFBQVUsb0JBQW9CLEVBQXBCLENBRmQ7QUFHQSxVQUFPLE9BQVAsR0FBaUIsVUFBUyxHQUFULEVBQWMsSUFBZCxFQUFtQjtBQUNsQyxRQUFJLEtBQU0sQ0FBQyxLQUFLLE1BQUwsSUFBZSxFQUFoQixFQUFvQixHQUFwQixLQUE0QixPQUFPLEdBQVAsQ0FBdEM7QUFBQSxRQUNJLE1BQU0sRUFEVjtBQUVBLFFBQUksR0FBSixJQUFXLEtBQUssRUFBTCxDQUFYO0FBQ0EsWUFBUSxRQUFRLENBQVIsR0FBWSxRQUFRLENBQVIsR0FBWSxNQUFNLFlBQVU7QUFBRSxRQUFHLENBQUg7QUFBUSxLQUExQixDQUFoQyxFQUE2RCxRQUE3RCxFQUF1RSxHQUF2RTtBQUNELElBTEQ7O0FBT0Q7QUFBTyxHQXB5Q0c7QUFxeUNWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRCxPQUFJLFNBQVksb0JBQW9CLEVBQXBCLENBQWhCO0FBQUEsT0FDSSxPQUFZLG9CQUFvQixFQUFwQixDQURoQjtBQUFBLE9BRUksTUFBWSxvQkFBb0IsRUFBcEIsQ0FGaEI7QUFBQSxPQUdJLFlBQVksV0FIaEI7O0FBS0EsT0FBSSxVQUFVLFNBQVYsT0FBVSxDQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQTRCO0FBQ3hDLFFBQUksWUFBWSxPQUFPLFFBQVEsQ0FBL0I7QUFBQSxRQUNJLFlBQVksT0FBTyxRQUFRLENBRC9CO0FBQUEsUUFFSSxZQUFZLE9BQU8sUUFBUSxDQUYvQjtBQUFBLFFBR0ksV0FBWSxPQUFPLFFBQVEsQ0FIL0I7QUFBQSxRQUlJLFVBQVksT0FBTyxRQUFRLENBSi9CO0FBQUEsUUFLSSxVQUFZLE9BQU8sUUFBUSxDQUwvQjtBQUFBLFFBTUksVUFBWSxZQUFZLElBQVosR0FBbUIsS0FBSyxJQUFMLE1BQWUsS0FBSyxJQUFMLElBQWEsRUFBNUIsQ0FObkM7QUFBQSxRQU9JLFNBQVksWUFBWSxNQUFaLEdBQXFCLFlBQVksT0FBTyxJQUFQLENBQVosR0FBMkIsQ0FBQyxPQUFPLElBQVAsS0FBZ0IsRUFBakIsRUFBcUIsU0FBckIsQ0FQaEU7QUFBQSxRQVFJLEdBUko7QUFBQSxRQVFTLEdBUlQ7QUFBQSxRQVFjLEdBUmQ7QUFTQSxRQUFHLFNBQUgsRUFBYSxTQUFTLElBQVQ7QUFDYixTQUFJLEdBQUosSUFBVyxNQUFYLEVBQWtCO0FBQ2hCO0FBQ0EsV0FBTSxDQUFDLFNBQUQsSUFBYyxNQUFkLElBQXdCLE9BQU8sTUFBckM7QUFDQSxTQUFHLE9BQU8sT0FBTyxPQUFqQixFQUF5QjtBQUN6QjtBQUNBLFdBQU0sTUFBTSxPQUFPLEdBQVAsQ0FBTixHQUFvQixPQUFPLEdBQVAsQ0FBMUI7QUFDQTtBQUNBLGFBQVEsR0FBUixJQUFlLGFBQWEsT0FBTyxPQUFPLEdBQVAsQ0FBUCxJQUFzQixVQUFuQyxHQUFnRCxPQUFPLEdBQVA7QUFDL0Q7QUFEZSxPQUViLFdBQVcsR0FBWCxHQUFpQixJQUFJLEdBQUosRUFBUztBQUM1QjtBQURtQixNQUFqQixHQUVBLFdBQVcsT0FBTyxHQUFQLEtBQWUsR0FBMUIsR0FBaUMsVUFBUyxDQUFULEVBQVc7QUFDNUMsVUFBSSxJQUFJLFNBQUosQ0FBSSxDQUFTLEtBQVQsRUFBZTtBQUNyQixjQUFPLGdCQUFnQixDQUFoQixHQUFvQixJQUFJLENBQUosQ0FBTSxLQUFOLENBQXBCLEdBQW1DLEVBQUUsS0FBRixDQUExQztBQUNELE9BRkQ7QUFHQSxRQUFFLFNBQUYsSUFBZSxFQUFFLFNBQUYsQ0FBZjtBQUNBLGFBQU8sQ0FBUDtBQUNGO0FBQ0MsTUFQaUMsQ0FPL0IsR0FQK0IsQ0FBaEMsR0FPUSxZQUFZLE9BQU8sR0FBUCxJQUFjLFVBQTFCLEdBQXVDLElBQUksU0FBUyxJQUFiLEVBQW1CLEdBQW5CLENBQXZDLEdBQWlFLEdBWDNFO0FBWUEsU0FBRyxRQUFILEVBQVksQ0FBQyxRQUFRLFNBQVIsTUFBdUIsUUFBUSxTQUFSLElBQXFCLEVBQTVDLENBQUQsRUFBa0QsR0FBbEQsSUFBeUQsR0FBekQ7QUFDYjtBQUNGLElBaENEO0FBaUNBO0FBQ0EsV0FBUSxDQUFSLEdBQVksQ0FBWixDQXpDcUQsQ0F5Q3JDO0FBQ2hCLFdBQVEsQ0FBUixHQUFZLENBQVosQ0ExQ3FELENBMENyQztBQUNoQixXQUFRLENBQVIsR0FBWSxDQUFaLENBM0NxRCxDQTJDckM7QUFDaEIsV0FBUSxDQUFSLEdBQVksQ0FBWixDQTVDcUQsQ0E0Q3JDO0FBQ2hCLFdBQVEsQ0FBUixHQUFZLEVBQVosQ0E3Q3FELENBNkNyQztBQUNoQixXQUFRLENBQVIsR0FBWSxFQUFaLENBOUNxRCxDQThDckM7QUFDaEIsVUFBTyxPQUFQLEdBQWlCLE9BQWpCOztBQUVEO0FBQU8sR0F2MUNHO0FBdzFDVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCOztBQUVoQztBQUNBLE9BQUksU0FBUyxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLElBQWlCLFdBQWpCLElBQWdDLE9BQU8sSUFBUCxJQUFlLElBQS9DLEdBQzFCLE1BRDBCLEdBQ2pCLE9BQU8sSUFBUCxJQUFlLFdBQWYsSUFBOEIsS0FBSyxJQUFMLElBQWEsSUFBM0MsR0FBa0QsSUFBbEQsR0FBeUQsU0FBUyxhQUFULEdBRHRFO0FBRUEsT0FBRyxPQUFPLEdBQVAsSUFBYyxRQUFqQixFQUEwQixNQUFNLE1BQU4sQ0FMTSxDQUtROztBQUV6QztBQUFPLEdBaDJDRztBQWkyQ1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjs7QUFFaEMsT0FBSSxPQUFPLE9BQU8sT0FBUCxHQUFpQixFQUFDLFNBQVMsT0FBVixFQUE1QjtBQUNBLE9BQUcsT0FBTyxHQUFQLElBQWMsUUFBakIsRUFBMEIsTUFBTSxJQUFOLENBSE0sQ0FHTTs7QUFFdkM7QUFBTyxHQXYyQ0c7QUF3MkNWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDtBQUNBLE9BQUksWUFBWSxvQkFBb0IsRUFBcEIsQ0FBaEI7QUFDQSxVQUFPLE9BQVAsR0FBaUIsVUFBUyxFQUFULEVBQWEsSUFBYixFQUFtQixNQUFuQixFQUEwQjtBQUN6QyxjQUFVLEVBQVY7QUFDQSxRQUFHLFNBQVMsU0FBWixFQUFzQixPQUFPLEVBQVA7QUFDdEIsWUFBTyxNQUFQO0FBQ0UsVUFBSyxDQUFMO0FBQVEsYUFBTyxVQUFTLENBQVQsRUFBVztBQUN4QixjQUFPLEdBQUcsSUFBSCxDQUFRLElBQVIsRUFBYyxDQUFkLENBQVA7QUFDRCxPQUZPO0FBR1IsVUFBSyxDQUFMO0FBQVEsYUFBTyxVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWM7QUFDM0IsY0FBTyxHQUFHLElBQUgsQ0FBUSxJQUFSLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixDQUFQO0FBQ0QsT0FGTztBQUdSLFVBQUssQ0FBTDtBQUFRLGFBQU8sVUFBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsRUFBaUI7QUFDOUIsY0FBTyxHQUFHLElBQUgsQ0FBUSxJQUFSLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixDQUFQO0FBQ0QsT0FGTztBQVBWO0FBV0EsV0FBTyxZQUFTLGFBQWM7QUFDNUIsWUFBTyxHQUFHLEtBQUgsQ0FBUyxJQUFULEVBQWUsU0FBZixDQUFQO0FBQ0QsS0FGRDtBQUdELElBakJEOztBQW1CRDtBQUFPLEdBaDRDRztBQWk0Q1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjs7QUFFaEMsVUFBTyxPQUFQLEdBQWlCLFVBQVMsRUFBVCxFQUFZO0FBQzNCLFFBQUcsT0FBTyxFQUFQLElBQWEsVUFBaEIsRUFBMkIsTUFBTSxVQUFVLEtBQUsscUJBQWYsQ0FBTjtBQUMzQixXQUFPLEVBQVA7QUFDRCxJQUhEOztBQUtEO0FBQU8sR0F6NENHO0FBMDRDVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCOztBQUVoQyxVQUFPLE9BQVAsR0FBaUIsVUFBUyxJQUFULEVBQWM7QUFDN0IsUUFBSTtBQUNGLFlBQU8sQ0FBQyxDQUFDLE1BQVQ7QUFDRCxLQUZELENBRUUsT0FBTSxDQUFOLEVBQVE7QUFDUixZQUFPLElBQVA7QUFDRDtBQUNGLElBTkQ7O0FBUUQ7QUFBTyxHQXI1Q0c7QUFzNUNWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDLDhCQUE0QixXQUFTLE1BQVQsRUFBaUI7QUFBQztBQUM5Qzs7QUFFQSxZQUFRLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsWUFBUSxTQUFSLElBQXFCLFVBQVUsVUFBVixFQUFzQjtBQUN6QztBQUNBLFNBQUksT0FBTyxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0MsTUFBaEMsR0FBeUMsTUFBcEQ7QUFBQSxTQUNJLGNBQWMsS0FBSyxVQUR2QjtBQUVBO0FBQ0EsZ0JBQVcsVUFBWCxHQUF3QixZQUFZO0FBQ2xDLFVBQUksS0FBSyxVQUFMLEtBQW9CLFVBQXhCLEVBQW9DO0FBQ2xDLFlBQUssVUFBTCxHQUFrQixXQUFsQjtBQUNEO0FBQ0QsYUFBTyxVQUFQO0FBQ0QsTUFMRDtBQU1ELEtBWEQ7O0FBYUEsV0FBTyxPQUFQLEdBQWlCLFFBQVEsU0FBUixDQUFqQjtBQUNBO0FBQTRCLElBbkJBLEVBbUJDLElBbkJELENBbUJNLE9BbkJOLEVBbUJnQixZQUFXO0FBQUUsV0FBTyxJQUFQO0FBQWMsSUFBM0IsRUFuQmhCLENBQUQ7O0FBcUI1QjtBQUFPLEdBOTZDRztBQSs2Q1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjs7QUFFaEM7O0FBRUEsV0FBUSxVQUFSLEdBQXFCLElBQXJCO0FBQ0EsT0FBSSxNQUFNO0FBQ1I7QUFDQSxhQUFTO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsdUJBQWtCLFNBQVMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0M7QUFDaEQsYUFBTyxLQUFLLElBQUwsS0FBYyxlQUFkLElBQWlDLENBQUMsS0FBSyxJQUFMLEtBQWMsbUJBQWQsSUFBcUMsS0FBSyxJQUFMLEtBQWMsZ0JBQXBELEtBQXlFLENBQUMsRUFBRSxLQUFLLE1BQUwsSUFBZSxLQUFLLE1BQUwsQ0FBWSxNQUEzQixJQUFxQyxLQUFLLElBQTVDLENBQWxIO0FBQ0QsTUFOTTs7QUFRUCxlQUFVLFNBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QjtBQUNoQyxhQUFRLGNBQWEsSUFBYixDQUFrQixLQUFLLFFBQXZCO0FBQVI7QUFFRCxNQVhNOztBQWFQO0FBQ0E7QUFDQSxlQUFVLFNBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QjtBQUNoQyxhQUFPLEtBQUssS0FBTCxDQUFXLE1BQVgsS0FBc0IsQ0FBdEIsSUFBMkIsQ0FBQyxJQUFJLE9BQUosQ0FBWSxRQUFaLENBQXFCLElBQXJCLENBQTVCLElBQTBELENBQUMsS0FBSyxLQUF2RTtBQUNEO0FBakJNO0FBRkQsSUFBVjs7QUF1QkE7QUFDQTtBQUNBLFdBQVEsU0FBUixJQUFxQixHQUFyQjtBQUNBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQWo5Q0c7QUFrOUNWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxPQUFJLHlCQUF5QixvQkFBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBN0I7O0FBRUEsT0FBSSwwQkFBMEIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTlCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjtBQUNBLFdBQVEsS0FBUixHQUFnQixLQUFoQjs7QUFFQSxPQUFJLFVBQVUsb0JBQW9CLEVBQXBCLENBQWQ7O0FBRUEsT0FBSSxXQUFXLHVCQUF1QixPQUF2QixDQUFmOztBQUVBLE9BQUkscUJBQXFCLG9CQUFvQixFQUFwQixDQUF6Qjs7QUFFQSxPQUFJLHNCQUFzQix1QkFBdUIsa0JBQXZCLENBQTFCOztBQUVBLE9BQUksV0FBVyxvQkFBb0IsRUFBcEIsQ0FBZjs7QUFFQSxPQUFJLFVBQVUsd0JBQXdCLFFBQXhCLENBQWQ7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLFdBQVEsTUFBUixHQUFpQixTQUFTLFNBQVQsQ0FBakI7O0FBRUEsT0FBSSxLQUFLLEVBQVQ7QUFDQSxVQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLE9BQWxCOztBQUVBLFlBQVMsS0FBVCxDQUFlLEtBQWYsRUFBc0IsT0FBdEIsRUFBK0I7QUFDN0I7QUFDQSxRQUFJLE1BQU0sSUFBTixLQUFlLFNBQW5CLEVBQThCO0FBQzVCLFlBQU8sS0FBUDtBQUNEOztBQUVELGFBQVMsU0FBVCxFQUFvQixFQUFwQixHQUF5QixFQUF6Qjs7QUFFQTtBQUNBLE9BQUcsT0FBSCxHQUFhLFVBQVUsT0FBVixFQUFtQjtBQUM5QixZQUFPLElBQUksR0FBRyxjQUFQLENBQXNCLFdBQVcsUUFBUSxPQUF6QyxFQUFrRCxPQUFsRCxDQUFQO0FBQ0QsS0FGRDs7QUFJQSxRQUFJLFFBQVEsSUFBSSxvQkFBb0IsU0FBcEIsQ0FBSixDQUFtQyxPQUFuQyxDQUFaO0FBQ0EsV0FBTyxNQUFNLE1BQU4sQ0FBYSxTQUFTLFNBQVQsRUFBb0IsS0FBcEIsQ0FBMEIsS0FBMUIsQ0FBYixDQUFQO0FBQ0Q7O0FBRUY7QUFBTyxHQWxnREc7QUFtZ0RWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDO0FBQ0E7QUFDQTs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7QUFDQSxPQUFJLGFBQWMsWUFBWTtBQUMxQixRQUFJLFNBQVMsRUFBRSxPQUFPLFNBQVMsS0FBVCxHQUFpQixDQUFFLENBQTVCO0FBQ1QsU0FBSSxFQURLO0FBRVQsZUFBVSxFQUFFLFNBQVMsQ0FBWCxFQUFjLFFBQVEsQ0FBdEIsRUFBeUIsV0FBVyxDQUFwQyxFQUF1QyxPQUFPLENBQTlDLEVBQWlELHVCQUF1QixDQUF4RSxFQUEyRSxhQUFhLENBQXhGLEVBQTJGLFlBQVksQ0FBdkcsRUFBMEcsU0FBUyxDQUFuSCxFQUFzSCxZQUFZLEVBQWxJLEVBQXNJLFdBQVcsRUFBakosRUFBcUosZ0JBQWdCLEVBQXJLLEVBQXlLLFdBQVcsRUFBcEwsRUFBd0wsV0FBVyxFQUFuTSxFQUF1TSxXQUFXLEVBQWxOLEVBQXNOLGdCQUFnQixFQUF0TyxFQUEwTyw2QkFBNkIsRUFBdlEsRUFBMlEsaUJBQWlCLEVBQTVSLEVBQWdTLGtCQUFrQixFQUFsVCxFQUFzVCxjQUFjLEVBQXBVLEVBQXdVLDRCQUE0QixFQUFwVyxFQUF3Vyx3QkFBd0IsRUFBaFksRUFBb1ksbUJBQW1CLEVBQXZaLEVBQTJaLGFBQWEsRUFBeGEsRUFBNGEsaUJBQWlCLEVBQTdiLEVBQWljLGNBQWMsRUFBL2MsRUFBbWQsZUFBZSxFQUFsZSxFQUFzZSxpQkFBaUIsRUFBdmYsRUFBMmYsY0FBYyxFQUF6Z0IsRUFBNmdCLHlCQUF5QixFQUF0aUIsRUFBMGlCLHFCQUFxQixFQUEvakIsRUFBbWtCLHFCQUFxQixFQUF4bEIsRUFBNGxCLFNBQVMsRUFBcm1CLEVBQXltQixnQkFBZ0IsRUFBem5CLEVBQTZuQiwyQkFBMkIsRUFBeHBCLEVBQTRwQix1QkFBdUIsRUFBbnJCLEVBQXVyQix1QkFBdUIsRUFBOXNCLEVBQWt0QixvQkFBb0IsRUFBdHVCLEVBQTB1QixzQkFBc0IsRUFBaHdCLEVBQW93QixnQ0FBZ0MsRUFBcHlCLEVBQXd5Qiw0QkFBNEIsRUFBcDBCLEVBQXcwQiw0QkFBNEIsRUFBcDJCLEVBQXcyQixxQkFBcUIsRUFBNzNCLEVBQWk0QixXQUFXLEVBQTU0QixFQUFnNUIsZ0JBQWdCLEVBQWg2QixFQUFvNkIsd0JBQXdCLEVBQTU3QixFQUFnOEIsaUJBQWlCLEVBQWo5QixFQUFxOUIsUUFBUSxFQUE3OUIsRUFBaStCLHdCQUF3QixFQUF6L0IsRUFBNi9CLG9CQUFvQixFQUFqaEMsRUFBcWhDLGtCQUFrQixFQUF2aUMsRUFBMmlDLHdCQUF3QixFQUFua0MsRUFBdWtDLG9CQUFvQixFQUEzbEMsRUFBK2xDLG1CQUFtQixFQUFsbkMsRUFBc25DLGdCQUFnQixFQUF0b0MsRUFBMG9DLGVBQWUsRUFBenBDLEVBQTZwQyx1QkFBdUIsRUFBcHJDLEVBQXdyQyxtQkFBbUIsRUFBM3NDLEVBQStzQyxvQkFBb0IsRUFBbnVDLEVBQXV1QyxzQkFBc0IsRUFBN3ZDLEVBQWl3QyxnQ0FBZ0MsRUFBanlDLEVBQXF5Qyw0QkFBNEIsRUFBajBDLEVBQXEwQyxTQUFTLEVBQTkwQyxFQUFrMUMsU0FBUyxFQUEzMUMsRUFBKzFDLGNBQWMsRUFBNzJDLEVBQWkzQyxxQkFBcUIsRUFBdDRDLEVBQTA0QyxpQkFBaUIsRUFBMzVDLEVBQSs1QyxlQUFlLEVBQTk2QyxFQUFrN0MsUUFBUSxFQUExN0MsRUFBODdDLHlCQUF5QixFQUF2OUMsRUFBMjlDLGVBQWUsRUFBMStDLEVBQTgrQyxNQUFNLEVBQXAvQyxFQUF3L0MsVUFBVSxFQUFsZ0QsRUFBc2dELGVBQWUsRUFBcmhELEVBQXloRCxxQkFBcUIsRUFBOWlELEVBQWtqRCxnQ0FBZ0MsRUFBbGxELEVBQXNsRCxzQkFBc0IsRUFBNW1ELEVBQWduRCxRQUFRLEVBQXhuRCxFQUE0bkQsWUFBWSxFQUF4b0QsRUFBNG9ELFVBQVUsRUFBdHBELEVBQTBwRCxVQUFVLEVBQXBxRCxFQUF3cUQsV0FBVyxFQUFuckQsRUFBdXJELGFBQWEsRUFBcHNELEVBQXdzRCxRQUFRLEVBQWh0RCxFQUFvdEQsUUFBUSxFQUE1dEQsRUFBZ3VELGdCQUFnQixFQUFodkQsRUFBb3ZELE9BQU8sRUFBM3ZELEVBQSt2RCxXQUFXLENBQTF3RCxFQUE2d0QsUUFBUSxDQUFyeEQsRUFGRDtBQUdULGlCQUFZLEVBQUUsR0FBRyxPQUFMLEVBQWMsR0FBRyxLQUFqQixFQUF3QixJQUFJLFNBQTVCLEVBQXVDLElBQUksU0FBM0MsRUFBc0QsSUFBSSxlQUExRCxFQUEyRSxJQUFJLGdCQUEvRSxFQUFpRyxJQUFJLGlCQUFyRyxFQUF3SCxJQUFJLFlBQTVILEVBQTBJLElBQUksT0FBOUksRUFBdUosSUFBSSxjQUEzSixFQUEySyxJQUFJLG9CQUEvSyxFQUFxTSxJQUFJLFNBQXpNLEVBQW9OLElBQUksZUFBeE4sRUFBeU8sSUFBSSxNQUE3TyxFQUFxUCxJQUFJLGdCQUF6UCxFQUEyUSxJQUFJLGlCQUEvUSxFQUFrUyxJQUFJLGNBQXRTLEVBQXNULElBQUksb0JBQTFULEVBQWdWLElBQUksWUFBcFYsRUFBa1csSUFBSSxhQUF0VyxFQUFxWCxJQUFJLElBQXpYLEVBQStYLElBQUksUUFBblksRUFBNlksSUFBSSxtQkFBalosRUFBc2EsSUFBSSxvQkFBMWEsRUFBZ2MsSUFBSSxRQUFwYyxFQUE4YyxJQUFJLFFBQWxkLEVBQTRkLElBQUksU0FBaGUsRUFBMmUsSUFBSSxXQUEvZSxFQUE0ZixJQUFJLE1BQWhnQixFQUF3Z0IsSUFBSSxNQUE1Z0IsRUFBb2hCLElBQUksS0FBeGhCLEVBSEg7QUFJVCxtQkFBYyxDQUFDLENBQUQsRUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUosRUFBWSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVosRUFBb0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFwQixFQUE0QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQTVCLEVBQW9DLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBcEMsRUFBNEMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUE1QyxFQUFvRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXBELEVBQTRELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBNUQsRUFBb0UsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFwRSxFQUE0RSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTVFLEVBQXFGLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBckYsRUFBOEYsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE5RixFQUF1RyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXZHLEVBQStHLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0csRUFBdUgsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF2SCxFQUFnSSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWhJLEVBQXlJLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBekksRUFBa0osQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFsSixFQUEySixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTNKLEVBQW9LLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBcEssRUFBNkssQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE3SyxFQUFzTCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXRMLEVBQThMLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBOUwsRUFBc00sQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF0TSxFQUErTSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQS9NLEVBQXdOLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBeE4sRUFBaU8sQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFqTyxFQUEwTyxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTFPLEVBQW1QLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBblAsRUFBNFAsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE1UCxFQUFxUSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXJRLEVBQThRLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBOVEsRUFBdVIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF2UixFQUFnUyxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWhTLEVBQXlTLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBelMsRUFBa1QsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFsVCxFQUEyVCxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTNULEVBQW9VLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBcFUsRUFBNlUsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE3VSxFQUFzVixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXRWLEVBQStWLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBL1YsRUFBd1csQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF4VyxFQUFpWCxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWpYLEVBQTBYLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBMVgsRUFBbVksQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFuWSxFQUE0WSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQTVZLEVBQW9aLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBcFosRUFBNFosQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE1WixFQUFxYSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXJhLEVBQThhLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBOWEsRUFBdWIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF2YixFQUFnYyxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWhjLEVBQXljLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBemMsRUFBa2QsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFsZCxFQUEyZCxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTNkLEVBQW9lLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBcGUsRUFBNmUsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE3ZSxFQUFzZixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXRmLEVBQStmLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBL2YsRUFBd2dCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBeGdCLEVBQWloQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWpoQixFQUEwaEIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUExaEIsRUFBbWlCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBbmlCLEVBQTRpQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTVpQixFQUFxakIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFyakIsRUFBOGpCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBOWpCLEVBQXVrQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXZrQixFQUFnbEIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFobEIsRUFBeWxCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBemxCLEVBQWttQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWxtQixFQUEybUIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUEzbUIsRUFBb25CLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBcG5CLEVBQTZuQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTduQixFQUFzb0IsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF0b0IsRUFBK29CLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBL29CLEVBQXdwQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXhwQixFQUFpcUIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFqcUIsRUFBMHFCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBMXFCLEVBQW1yQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQW5yQixFQUE0ckIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE1ckIsRUFBcXNCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBcnNCLEVBQThzQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTlzQixFQUF1dEIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF2dEIsRUFBZ3VCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBaHVCLEVBQXl1QixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXp1QixFQUFrdkIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFsdkIsRUFBMnZCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBM3ZCLEVBQW93QixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXB3QixFQUE2d0IsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE3d0IsRUFBc3hCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBdHhCLEVBQSt4QixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQS94QixFQUF3eUIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF4eUIsRUFBaXpCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBanpCLEVBQTB6QixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTF6QixFQUFtMEIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFuMEIsRUFBNDBCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBNTBCLEVBQXExQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXIxQixFQUE4MUIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE5MUIsRUFBdTJCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBdjJCLEVBQWczQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWgzQixFQUF5M0IsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF6M0IsQ0FKTDtBQUtULG9CQUFlLFNBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQixNQUEzQixFQUFtQyxRQUFuQyxFQUE2QyxFQUE3QyxFQUFpRCxPQUFqRCxFQUEwRCxFQUExRCxFQUE4RDtBQUM3RSxTQURlLEVBQ1Q7O0FBRUYsVUFBSSxLQUFLLEdBQUcsTUFBSCxHQUFZLENBQXJCO0FBQ0EsY0FBUSxPQUFSO0FBQ0ksWUFBSyxDQUFMO0FBQ0ksZUFBTyxHQUFHLEtBQUssQ0FBUixDQUFQO0FBQ0E7QUFDSixZQUFLLENBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLGNBQUgsQ0FBa0IsR0FBRyxFQUFILENBQWxCLENBQVQ7QUFDQTtBQUNKLFlBQUssQ0FBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0E7QUFDSixZQUFLLENBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLEVBQUgsQ0FBVDtBQUNBO0FBQ0osWUFBSyxDQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxFQUFILENBQVQ7QUFDQTtBQUNKLFlBQUssQ0FBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0E7QUFDSixZQUFLLENBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLEVBQUgsQ0FBVDtBQUNBO0FBQ0osWUFBSyxDQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxFQUFILENBQVQ7QUFDQTtBQUNKLFlBQUssQ0FBTDtBQUNJLGFBQUssQ0FBTCxHQUFTO0FBQ0wsZUFBTSxrQkFERDtBQUVMLGdCQUFPLEdBQUcsWUFBSCxDQUFnQixHQUFHLEVBQUgsQ0FBaEIsQ0FGRjtBQUdMLGdCQUFPLEdBQUcsVUFBSCxDQUFjLEdBQUcsRUFBSCxDQUFkLEVBQXNCLEdBQUcsRUFBSCxDQUF0QixDQUhGO0FBSUwsY0FBSyxHQUFHLE9BQUgsQ0FBVyxLQUFLLEVBQWhCO0FBSkEsU0FBVDs7QUFPQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTO0FBQ0wsZUFBTSxrQkFERDtBQUVMLG1CQUFVLEdBQUcsRUFBSCxDQUZMO0FBR0wsZ0JBQU8sR0FBRyxFQUFILENBSEY7QUFJTCxjQUFLLEdBQUcsT0FBSCxDQUFXLEtBQUssRUFBaEI7QUFKQSxTQUFUOztBQU9BO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxlQUFILENBQW1CLEdBQUcsS0FBSyxDQUFSLENBQW5CLEVBQStCLEdBQUcsS0FBSyxDQUFSLENBQS9CLEVBQTJDLEdBQUcsRUFBSCxDQUEzQyxFQUFtRCxLQUFLLEVBQXhELENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQUUsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUFSLEVBQW9CLFFBQVEsR0FBRyxLQUFLLENBQVIsQ0FBNUIsRUFBd0MsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUE5QyxFQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLFlBQUgsQ0FBZ0IsR0FBRyxLQUFLLENBQVIsQ0FBaEIsRUFBNEIsR0FBRyxLQUFLLENBQVIsQ0FBNUIsRUFBd0MsR0FBRyxLQUFLLENBQVIsQ0FBeEMsRUFBb0QsR0FBRyxFQUFILENBQXBELEVBQTRELEtBQTVELEVBQW1FLEtBQUssRUFBeEUsQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxZQUFILENBQWdCLEdBQUcsS0FBSyxDQUFSLENBQWhCLEVBQTRCLEdBQUcsS0FBSyxDQUFSLENBQTVCLEVBQXdDLEdBQUcsS0FBSyxDQUFSLENBQXhDLEVBQW9ELEdBQUcsRUFBSCxDQUFwRCxFQUE0RCxJQUE1RCxFQUFrRSxLQUFLLEVBQXZFLENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQUUsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUFSLEVBQW9CLE1BQU0sR0FBRyxLQUFLLENBQVIsQ0FBMUIsRUFBc0MsUUFBUSxHQUFHLEtBQUssQ0FBUixDQUE5QyxFQUEwRCxNQUFNLEdBQUcsS0FBSyxDQUFSLENBQWhFLEVBQTRFLGFBQWEsR0FBRyxLQUFLLENBQVIsQ0FBekYsRUFBcUcsT0FBTyxHQUFHLFVBQUgsQ0FBYyxHQUFHLEtBQUssQ0FBUixDQUFkLEVBQTBCLEdBQUcsRUFBSCxDQUExQixDQUE1RyxFQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQVIsQ0FBUixFQUFvQixRQUFRLEdBQUcsS0FBSyxDQUFSLENBQTVCLEVBQXdDLE1BQU0sR0FBRyxLQUFLLENBQVIsQ0FBOUMsRUFBMEQsYUFBYSxHQUFHLEtBQUssQ0FBUixDQUF2RSxFQUFtRixPQUFPLEdBQUcsVUFBSCxDQUFjLEdBQUcsS0FBSyxDQUFSLENBQWQsRUFBMEIsR0FBRyxFQUFILENBQTFCLENBQTFGLEVBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQUUsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUFSLEVBQW9CLFFBQVEsR0FBRyxLQUFLLENBQVIsQ0FBNUIsRUFBd0MsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUE5QyxFQUEwRCxhQUFhLEdBQUcsS0FBSyxDQUFSLENBQXZFLEVBQW1GLE9BQU8sR0FBRyxVQUFILENBQWMsR0FBRyxLQUFLLENBQVIsQ0FBZCxFQUEwQixHQUFHLEVBQUgsQ0FBMUIsQ0FBMUYsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBRSxPQUFPLEdBQUcsVUFBSCxDQUFjLEdBQUcsS0FBSyxDQUFSLENBQWQsRUFBMEIsR0FBRyxLQUFLLENBQVIsQ0FBMUIsQ0FBVCxFQUFnRCxTQUFTLEdBQUcsRUFBSCxDQUF6RCxFQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxZQUFJLFVBQVUsR0FBRyxZQUFILENBQWdCLEdBQUcsS0FBSyxDQUFSLENBQWhCLEVBQTRCLEdBQUcsS0FBSyxDQUFSLENBQTVCLEVBQXdDLEdBQUcsRUFBSCxDQUF4QyxFQUFnRCxHQUFHLEVBQUgsQ0FBaEQsRUFBd0QsS0FBeEQsRUFBK0QsS0FBSyxFQUFwRSxDQUFkO0FBQUEsWUFDSSxVQUFVLEdBQUcsY0FBSCxDQUFrQixDQUFDLE9BQUQsQ0FBbEIsRUFBNkIsR0FBRyxLQUFLLENBQVIsRUFBVyxHQUF4QyxDQURkO0FBRUEsZ0JBQVEsT0FBUixHQUFrQixJQUFsQjs7QUFFQSxhQUFLLENBQUwsR0FBUyxFQUFFLE9BQU8sR0FBRyxLQUFLLENBQVIsRUFBVyxLQUFwQixFQUEyQixTQUFTLE9BQXBDLEVBQTZDLE9BQU8sSUFBcEQsRUFBVDs7QUFFQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQVIsQ0FBUixFQUFvQixPQUFPLEdBQUcsVUFBSCxDQUFjLEdBQUcsS0FBSyxDQUFSLENBQWQsRUFBMEIsR0FBRyxFQUFILENBQTFCLENBQTNCLEVBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsZUFBSCxDQUFtQixHQUFHLEtBQUssQ0FBUixDQUFuQixFQUErQixHQUFHLEtBQUssQ0FBUixDQUEvQixFQUEyQyxHQUFHLEtBQUssQ0FBUixDQUEzQyxFQUF1RCxHQUFHLEtBQUssQ0FBUixDQUF2RCxFQUFtRSxHQUFHLFVBQUgsQ0FBYyxHQUFHLEtBQUssQ0FBUixDQUFkLEVBQTBCLEdBQUcsRUFBSCxDQUExQixDQUFuRSxFQUFzRyxLQUFLLEVBQTNHLENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsZUFBSCxDQUFtQixHQUFHLEtBQUssQ0FBUixDQUFuQixFQUErQixHQUFHLEtBQUssQ0FBUixDQUEvQixFQUEyQyxHQUFHLEtBQUssQ0FBUixDQUEzQyxFQUF1RCxHQUFHLEtBQUssQ0FBUixDQUF2RCxFQUFtRSxHQUFHLFVBQUgsQ0FBYyxHQUFHLEtBQUssQ0FBUixDQUFkLEVBQTBCLEdBQUcsRUFBSCxDQUExQixDQUFuRSxFQUFzRyxLQUFLLEVBQTNHLENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTO0FBQ0wsZUFBTSxrQkFERDtBQUVMLGVBQU0sR0FBRyxLQUFLLENBQVIsQ0FGRDtBQUdMLGlCQUFRLEdBQUcsS0FBSyxDQUFSLENBSEg7QUFJTCxlQUFNLEdBQUcsS0FBSyxDQUFSLENBSkQ7QUFLTCxpQkFBUSxFQUxIO0FBTUwsZ0JBQU8sR0FBRyxVQUFILENBQWMsR0FBRyxLQUFLLENBQVIsQ0FBZCxFQUEwQixHQUFHLEVBQUgsQ0FBMUIsQ0FORjtBQU9MLGNBQUssR0FBRyxPQUFILENBQVcsS0FBSyxFQUFoQjtBQVBBLFNBQVQ7O0FBVUE7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLG1CQUFILENBQXVCLEdBQUcsS0FBSyxDQUFSLENBQXZCLEVBQW1DLEdBQUcsS0FBSyxDQUFSLENBQW5DLEVBQStDLEdBQUcsRUFBSCxDQUEvQyxFQUF1RCxLQUFLLEVBQTVELENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQUUsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUFSLEVBQW9CLFFBQVEsR0FBRyxLQUFLLENBQVIsQ0FBNUIsRUFBd0MsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUE5QyxFQUEwRCxPQUFPLEdBQUcsVUFBSCxDQUFjLEdBQUcsS0FBSyxDQUFSLENBQWQsRUFBMEIsR0FBRyxFQUFILENBQTFCLENBQWpFLEVBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLEVBQUgsQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVM7QUFDTCxlQUFNLGVBREQ7QUFFTCxlQUFNLEdBQUcsS0FBSyxDQUFSLENBRkQ7QUFHTCxpQkFBUSxHQUFHLEtBQUssQ0FBUixDQUhIO0FBSUwsZUFBTSxHQUFHLEtBQUssQ0FBUixDQUpEO0FBS0wsY0FBSyxHQUFHLE9BQUgsQ0FBVyxLQUFLLEVBQWhCO0FBTEEsU0FBVDs7QUFRQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQUUsTUFBTSxNQUFSLEVBQWdCLE9BQU8sR0FBRyxFQUFILENBQXZCLEVBQStCLEtBQUssR0FBRyxPQUFILENBQVcsS0FBSyxFQUFoQixDQUFwQyxFQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxFQUFFLE1BQU0sVUFBUixFQUFvQixLQUFLLEdBQUcsRUFBSCxDQUFNLEdBQUcsS0FBSyxDQUFSLENBQU4sQ0FBekIsRUFBNEMsT0FBTyxHQUFHLEVBQUgsQ0FBbkQsRUFBMkQsS0FBSyxHQUFHLE9BQUgsQ0FBVyxLQUFLLEVBQWhCLENBQWhFLEVBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFNLEdBQUcsS0FBSyxDQUFSLENBQU4sQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxFQUFILENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxFQUFFLE1BQU0sZUFBUixFQUF5QixPQUFPLEdBQUcsRUFBSCxDQUFoQyxFQUF3QyxVQUFVLEdBQUcsRUFBSCxDQUFsRCxFQUEwRCxLQUFLLEdBQUcsT0FBSCxDQUFXLEtBQUssRUFBaEIsQ0FBL0QsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBRSxNQUFNLGVBQVIsRUFBeUIsT0FBTyxPQUFPLEdBQUcsRUFBSCxDQUFQLENBQWhDLEVBQWdELFVBQVUsT0FBTyxHQUFHLEVBQUgsQ0FBUCxDQUExRCxFQUEwRSxLQUFLLEdBQUcsT0FBSCxDQUFXLEtBQUssRUFBaEIsQ0FBL0UsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBRSxNQUFNLGdCQUFSLEVBQTBCLE9BQU8sR0FBRyxFQUFILE1BQVcsTUFBNUMsRUFBb0QsVUFBVSxHQUFHLEVBQUgsTUFBVyxNQUF6RSxFQUFpRixLQUFLLEdBQUcsT0FBSCxDQUFXLEtBQUssRUFBaEIsQ0FBdEYsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBRSxNQUFNLGtCQUFSLEVBQTRCLFVBQVUsU0FBdEMsRUFBaUQsT0FBTyxTQUF4RCxFQUFtRSxLQUFLLEdBQUcsT0FBSCxDQUFXLEtBQUssRUFBaEIsQ0FBeEUsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBRSxNQUFNLGFBQVIsRUFBdUIsVUFBVSxJQUFqQyxFQUF1QyxPQUFPLElBQTlDLEVBQW9ELEtBQUssR0FBRyxPQUFILENBQVcsS0FBSyxFQUFoQixDQUF6RCxFQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLEVBQUgsQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxFQUFILENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsV0FBSCxDQUFlLElBQWYsRUFBcUIsR0FBRyxFQUFILENBQXJCLEVBQTZCLEtBQUssRUFBbEMsQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxXQUFILENBQWUsS0FBZixFQUFzQixHQUFHLEVBQUgsQ0FBdEIsRUFBOEIsS0FBSyxFQUFuQyxDQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxXQUFHLEtBQUssQ0FBUixFQUFXLElBQVgsQ0FBZ0IsRUFBRSxNQUFNLEdBQUcsRUFBSCxDQUFNLEdBQUcsRUFBSCxDQUFOLENBQVIsRUFBdUIsVUFBVSxHQUFHLEVBQUgsQ0FBakMsRUFBeUMsV0FBVyxHQUFHLEtBQUssQ0FBUixDQUFwRCxFQUFoQixFQUFrRixLQUFLLENBQUwsR0FBUyxHQUFHLEtBQUssQ0FBUixDQUFUO0FBQ2xGO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxFQUFILENBQU0sR0FBRyxFQUFILENBQU4sQ0FBUixFQUF1QixVQUFVLEdBQUcsRUFBSCxDQUFqQyxFQUFELENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLFdBQUcsS0FBSyxDQUFSLEVBQVcsSUFBWCxDQUFnQixHQUFHLEVBQUgsQ0FBaEI7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLENBQUMsR0FBRyxFQUFILENBQUQsQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBMYXlvdXQgZnJvbSAnLi92aWV3cy9sYXlvdXQnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hcmlvbmV0dGUuQXBwbGljYXRpb24uZXh0ZW5kKHtcclxuXHRyZWdpb246ICcuYXBwJyxcclxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMudG1wQ2FjaGUgPSB7fTtcclxuXHR9LFxyXG5cdHN0YXJ0OiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2hvd1ZpZXcobmV3IExheW91dCgpKTtcclxuXHR9LFxyXG5cdGFqYXggKG9wdGlvbnMpIHtcclxuXHRcdHZhciBwYXJhbXMgPSBfLmV4dGVuZCh7XHJcblx0XHRcdHVybDogJycsXHJcblx0XHRcdHR5cGU6ICdQT1NUJyxcclxuXHRcdFx0ZGF0YToge30sXHJcblx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdGNhbGxiYWNrIChyZXNwKSB7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ2FqYXggcmVzcCcpXHJcblx0XHRcdH1cclxuXHRcdH0sIG9wdGlvbnMpO1xyXG5cclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG5cdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdHVybDogcGFyYW1zLnVybCxcclxuXHRcdFx0XHR0eXBlOiBwYXJhbXMudHlwZSxcclxuXHRcdFx0XHRkYXRhOiBwYXJhbXMuZGF0YSxcclxuXHRcdFx0XHRkYXRhVHlwZTogcGFyYW1zLmRhdGFUeXBlXHJcblx0XHRcdH0pLmFsd2F5cygocmVzcG9uc2UsIHN0YXR1cykgPT4ge1xyXG5cdFx0XHRcdGlmKHN0YXR1cyA9PT0gJ2Vycm9yJykge1xyXG5cdFx0XHRcdFx0cmVqZWN0KHJlc3BvbnNlKVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuXHRcdFx0XHRcdGlmKHR5cGVvZiByZXNwb25zZSA9PT0gJ29iamVjdCcgJiYgcmVzcG9uc2UuY29kZSAhPSAyMDApIHtcclxuXHRcdFx0XHRcdFx0aWYocmVzcG9uc2UubWVzc2FnZSkge1xyXG5cdFx0XHRcdFx0XHRcdHJlamVjdChyZXNwb25zZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHBhcmFtcy5jYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH0pLmNhdGNoKHJlc3BvbnNlID0+IHtcclxuXHRcdFx0aWYocmVzcG9uc2UubWVzc2FnZSkge1xyXG5cdFx0XHRcdC8vSWYgdG9rZW4gaW52YWxpZCAtIGxvZ291dCB1c2VyXHJcblx0XHRcdFx0aWYocmVzcG9uc2UuY29kZSA9PT0gNDAxKSB7XHJcblx0XHRcdFx0XHRBcHAuUm91dGVyLm5hdmlnYXRlKCcvJywgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRhbGVydChyZXNwb25zZS50b1N0cmluZygpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59KTsiLCJpbXBvcnQgaGFuZGxlYmFycyBmcm9tICcuLi9saWJzL2hhbmRsZWJhcnMtdjQuMC4xMCc7XG5cbmNvbnN0IEhiVmlldyA9IE1hcmlvbmV0dGUuQmVoYXZpb3IuZXh0ZW5kKHtcbiAgICBsb2FkZWQ6IGZhbHNlLFxuICAgIGluaXRpYWxpemUgKG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IEhCVGVtcGxhdGUgPSB0aGlzLnZpZXcuSEJUZW1wbGF0ZTtcblxuICAgICAgICB0aGlzLnZpZXcuX2xvYWRUZW1wbGF0ZSA9IGZhbHNlO1xuXG4gICAgICAgIC8vR2V0IHBhdGggdGVtcGxhdGVcbiAgICAgICAgaWYoIUhCVGVtcGxhdGUpIHJldHVybiBjb25zb2xlLndhcm4oXCJIQlRlbXBsYXRlIGlzIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICAvL0NoZWNrIGNhY2hlIG9ialxuICAgICAgICBpZihBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdID0gQXBwLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBIQlRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ3RleHQnXG4gICAgICAgICAgICAgICAgfSkudGhlbihyZXNwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9BZGQgdG8gY2FjaGVcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMudmlldy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICAgICAgICAgICAgQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdID0gcmVzcDtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRlbXBsYXRlKEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXSk7XG4gICAgICAgICAgICAgICAgaWYoXy5pc0Z1bmN0aW9uKHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSkpIHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHJlc29sdmUocmVzcCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvL0NoZWNrIGN1cnJlbnQgcnVubmluZyBQcm9taXNlXG4gICAgICAgIGlmKF8uaXNGdW5jdGlvbihBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0udGhlbikpIHtcbiAgICAgICAgICAgIEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXS50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgICAgICAgIC8vQWRkIHRvIGNhY2hlXG4gICAgICAgICAgICAgICAgQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdID0gcmVzcDtcbiAgICAgICAgICAgIHRoaXMuc2V0VGVtcGxhdGUoQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdKTtcbiAgICAgICAgICAgIGlmKF8uaXNGdW5jdGlvbih0aGlzLnZpZXcub25Mb2FkVGVtcGxhdGUpKSB0aGlzLnZpZXcub25Mb2FkVGVtcGxhdGUoKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC8vVGVtcGxhdGUgbG9hZGVkLCBqdXN0IHNldCB0ZW1wbGF0ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zZXRUZW1wbGF0ZShBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRUZW1wbGF0ZSAodGVtcGxhdGUpIHtcbiAgICAgICAgbGV0IHRtcCA9IGhhbmRsZWJhcnMuY29tcGlsZSh0ZW1wbGF0ZSlcbiAgICAgICAgdGhpcy52aWV3LnRlbXBsYXRlID0gZGF0YSA9PiB0bXAoZGF0YSk7XG4gICAgICAgIHRoaXMudmlldy5fbG9hZFRlbXBsYXRlID0gdHJ1ZTtcbiAgICB9LFxuICAgIG9uQXR0YWNoICgpIHtcbiAgICAgICAgaWYoXy5pc0Z1bmN0aW9uKHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSkgJiYgdGhpcy5sb2FkZWQgPT09IHRydWUpIHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSgpO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBIYlZpZXciLCJpbXBvcnQgVG9kb2FwcCBmcm9tICcuL2FwcCc7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgd2luZG93LkFwcCA9IG5ldyBUb2RvYXBwKCk7XG4gICAgQXBwLnN0YXJ0KCk7XG59KTtcbiIsIi8qKiFcblxuIEBsaWNlbnNlXG4gaGFuZGxlYmFycyB2NC4wLjEwXG5cbkNvcHlyaWdodCAoQykgMjAxMS0yMDE2IGJ5IFllaHVkYSBLYXR6XG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS5cblxuKi9cbihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkhhbmRsZWJhcnNcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiSGFuZGxlYmFyc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG5cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG5cblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF9oYW5kbGViYXJzUnVudGltZSA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XG5cblx0dmFyIF9oYW5kbGViYXJzUnVudGltZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzUnVudGltZSk7XG5cblx0Ly8gQ29tcGlsZXIgaW1wb3J0c1xuXG5cdHZhciBfaGFuZGxlYmFyc0NvbXBpbGVyQXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNSk7XG5cblx0dmFyIF9oYW5kbGViYXJzQ29tcGlsZXJBc3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGFuZGxlYmFyc0NvbXBpbGVyQXN0KTtcblxuXHR2YXIgX2hhbmRsZWJhcnNDb21waWxlckJhc2UgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM2KTtcblxuXHR2YXIgX2hhbmRsZWJhcnNDb21waWxlckNvbXBpbGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MSk7XG5cblx0dmFyIF9oYW5kbGViYXJzQ29tcGlsZXJKYXZhc2NyaXB0Q29tcGlsZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQyKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNDb21waWxlckphdmFzY3JpcHRDb21waWxlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzQ29tcGlsZXJKYXZhc2NyaXB0Q29tcGlsZXIpO1xuXG5cdHZhciBfaGFuZGxlYmFyc0NvbXBpbGVyVmlzaXRvciA9IF9fd2VicGFja19yZXF1aXJlX18oMzkpO1xuXG5cdHZhciBfaGFuZGxlYmFyc0NvbXBpbGVyVmlzaXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzQ29tcGlsZXJWaXNpdG9yKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNOb0NvbmZsaWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNCk7XG5cblx0dmFyIF9oYW5kbGViYXJzTm9Db25mbGljdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzTm9Db25mbGljdCk7XG5cblx0dmFyIF9jcmVhdGUgPSBfaGFuZGxlYmFyc1J1bnRpbWUyWydkZWZhdWx0J10uY3JlYXRlO1xuXHRmdW5jdGlvbiBjcmVhdGUoKSB7XG5cdCAgdmFyIGhiID0gX2NyZWF0ZSgpO1xuXG5cdCAgaGIuY29tcGlsZSA9IGZ1bmN0aW9uIChpbnB1dCwgb3B0aW9ucykge1xuXHQgICAgcmV0dXJuIF9oYW5kbGViYXJzQ29tcGlsZXJDb21waWxlci5jb21waWxlKGlucHV0LCBvcHRpb25zLCBoYik7XG5cdCAgfTtcblx0ICBoYi5wcmVjb21waWxlID0gZnVuY3Rpb24gKGlucHV0LCBvcHRpb25zKSB7XG5cdCAgICByZXR1cm4gX2hhbmRsZWJhcnNDb21waWxlckNvbXBpbGVyLnByZWNvbXBpbGUoaW5wdXQsIG9wdGlvbnMsIGhiKTtcblx0ICB9O1xuXG5cdCAgaGIuQVNUID0gX2hhbmRsZWJhcnNDb21waWxlckFzdDJbJ2RlZmF1bHQnXTtcblx0ICBoYi5Db21waWxlciA9IF9oYW5kbGViYXJzQ29tcGlsZXJDb21waWxlci5Db21waWxlcjtcblx0ICBoYi5KYXZhU2NyaXB0Q29tcGlsZXIgPSBfaGFuZGxlYmFyc0NvbXBpbGVySmF2YXNjcmlwdENvbXBpbGVyMlsnZGVmYXVsdCddO1xuXHQgIGhiLlBhcnNlciA9IF9oYW5kbGViYXJzQ29tcGlsZXJCYXNlLnBhcnNlcjtcblx0ICBoYi5wYXJzZSA9IF9oYW5kbGViYXJzQ29tcGlsZXJCYXNlLnBhcnNlO1xuXG5cdCAgcmV0dXJuIGhiO1xuXHR9XG5cblx0dmFyIGluc3QgPSBjcmVhdGUoKTtcblx0aW5zdC5jcmVhdGUgPSBjcmVhdGU7XG5cblx0X2hhbmRsZWJhcnNOb0NvbmZsaWN0MlsnZGVmYXVsdCddKGluc3QpO1xuXG5cdGluc3QuVmlzaXRvciA9IF9oYW5kbGViYXJzQ29tcGlsZXJWaXNpdG9yMlsnZGVmYXVsdCddO1xuXG5cdGluc3RbJ2RlZmF1bHQnXSA9IGluc3Q7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gaW5zdDtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKG9iaikge1xuXHQgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG5cdCAgICBcImRlZmF1bHRcIjogb2JqXG5cdCAgfTtcblx0fTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG4vKioqLyB9KSxcbi8qIDIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKVsnZGVmYXVsdCddO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF9oYW5kbGViYXJzQmFzZSA9IF9fd2VicGFja19yZXF1aXJlX18oNCk7XG5cblx0dmFyIGJhc2UgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfaGFuZGxlYmFyc0Jhc2UpO1xuXG5cdC8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cblx0Ly8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcblxuXHR2YXIgX2hhbmRsZWJhcnNTYWZlU3RyaW5nID0gX193ZWJwYWNrX3JlcXVpcmVfXygyMSk7XG5cblx0dmFyIF9oYW5kbGViYXJzU2FmZVN0cmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzU2FmZVN0cmluZyk7XG5cblx0dmFyIF9oYW5kbGViYXJzRXhjZXB0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHR2YXIgX2hhbmRsZWJhcnNFeGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGFuZGxlYmFyc0V4Y2VwdGlvbik7XG5cblx0dmFyIF9oYW5kbGViYXJzVXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdHZhciBVdGlscyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9oYW5kbGViYXJzVXRpbHMpO1xuXG5cdHZhciBfaGFuZGxlYmFyc1J1bnRpbWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIyKTtcblxuXHR2YXIgcnVudGltZSA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9oYW5kbGViYXJzUnVudGltZSk7XG5cblx0dmFyIF9oYW5kbGViYXJzTm9Db25mbGljdCA9IF9fd2VicGFja19yZXF1aXJlX18oMzQpO1xuXG5cdHZhciBfaGFuZGxlYmFyc05vQ29uZmxpY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGFuZGxlYmFyc05vQ29uZmxpY3QpO1xuXG5cdC8vIEZvciBjb21wYXRpYmlsaXR5IGFuZCB1c2FnZSBvdXRzaWRlIG9mIG1vZHVsZSBzeXN0ZW1zLCBtYWtlIHRoZSBIYW5kbGViYXJzIG9iamVjdCBhIG5hbWVzcGFjZVxuXHRmdW5jdGlvbiBjcmVhdGUoKSB7XG5cdCAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cblx0ICBVdGlscy5leHRlbmQoaGIsIGJhc2UpO1xuXHQgIGhiLlNhZmVTdHJpbmcgPSBfaGFuZGxlYmFyc1NhZmVTdHJpbmcyWydkZWZhdWx0J107XG5cdCAgaGIuRXhjZXB0aW9uID0gX2hhbmRsZWJhcnNFeGNlcHRpb24yWydkZWZhdWx0J107XG5cdCAgaGIuVXRpbHMgPSBVdGlscztcblx0ICBoYi5lc2NhcGVFeHByZXNzaW9uID0gVXRpbHMuZXNjYXBlRXhwcmVzc2lvbjtcblxuXHQgIGhiLlZNID0gcnVudGltZTtcblx0ICBoYi50ZW1wbGF0ZSA9IGZ1bmN0aW9uIChzcGVjKSB7XG5cdCAgICByZXR1cm4gcnVudGltZS50ZW1wbGF0ZShzcGVjLCBoYik7XG5cdCAgfTtcblxuXHQgIHJldHVybiBoYjtcblx0fVxuXG5cdHZhciBpbnN0ID0gY3JlYXRlKCk7XG5cdGluc3QuY3JlYXRlID0gY3JlYXRlO1xuXG5cdF9oYW5kbGViYXJzTm9Db25mbGljdDJbJ2RlZmF1bHQnXShpbnN0KTtcblxuXHRpbnN0WydkZWZhdWx0J10gPSBpbnN0O1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGluc3Q7XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRleHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChvYmopIHtcblx0ICBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7XG5cdCAgICByZXR1cm4gb2JqO1xuXHQgIH0gZWxzZSB7XG5cdCAgICB2YXIgbmV3T2JqID0ge307XG5cblx0ICAgIGlmIChvYmogIT0gbnVsbCkge1xuXHQgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdCAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajtcblx0ICAgIHJldHVybiBuZXdPYmo7XG5cdCAgfVxuXHR9O1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbi8qKiovIH0pLFxuLyogNCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHR2YXIgX2hlbHBlcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEwKTtcblxuXHR2YXIgX2RlY29yYXRvcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE4KTtcblxuXHR2YXIgX2xvZ2dlciA9IF9fd2VicGFja19yZXF1aXJlX18oMjApO1xuXG5cdHZhciBfbG9nZ2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZ2dlcik7XG5cblx0dmFyIFZFUlNJT04gPSAnNC4wLjEwJztcblx0ZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjtcblx0dmFyIENPTVBJTEVSX1JFVklTSU9OID0gNztcblxuXHRleHBvcnRzLkNPTVBJTEVSX1JFVklTSU9OID0gQ09NUElMRVJfUkVWSVNJT047XG5cdHZhciBSRVZJU0lPTl9DSEFOR0VTID0ge1xuXHQgIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG5cdCAgMjogJz09IDEuMC4wLXJjLjMnLFxuXHQgIDM6ICc9PSAxLjAuMC1yYy40Jyxcblx0ICA0OiAnPT0gMS54LngnLFxuXHQgIDU6ICc9PSAyLjAuMC1hbHBoYS54Jyxcblx0ICA2OiAnPj0gMi4wLjAtYmV0YS4xJyxcblx0ICA3OiAnPj0gNC4wLjAnXG5cdH07XG5cblx0ZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcblx0dmFyIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuXHRmdW5jdGlvbiBIYW5kbGViYXJzRW52aXJvbm1lbnQoaGVscGVycywgcGFydGlhbHMsIGRlY29yYXRvcnMpIHtcblx0ICB0aGlzLmhlbHBlcnMgPSBoZWxwZXJzIHx8IHt9O1xuXHQgIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblx0ICB0aGlzLmRlY29yYXRvcnMgPSBkZWNvcmF0b3JzIHx8IHt9O1xuXG5cdCAgX2hlbHBlcnMucmVnaXN0ZXJEZWZhdWx0SGVscGVycyh0aGlzKTtcblx0ICBfZGVjb3JhdG9ycy5yZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzKHRoaXMpO1xuXHR9XG5cblx0SGFuZGxlYmFyc0Vudmlyb25tZW50LnByb3RvdHlwZSA9IHtcblx0ICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG5cdCAgbG9nZ2VyOiBfbG9nZ2VyMlsnZGVmYXVsdCddLFxuXHQgIGxvZzogX2xvZ2dlcjJbJ2RlZmF1bHQnXS5sb2csXG5cblx0ICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24gcmVnaXN0ZXJIZWxwZXIobmFtZSwgZm4pIHtcblx0ICAgIGlmIChfdXRpbHMudG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuXHQgICAgICBpZiAoZm4pIHtcblx0ICAgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7XG5cdCAgICAgIH1cblx0ICAgICAgX3V0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5oZWxwZXJzW25hbWVdID0gZm47XG5cdCAgICB9XG5cdCAgfSxcblx0ICB1bnJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbiB1bnJlZ2lzdGVySGVscGVyKG5hbWUpIHtcblx0ICAgIGRlbGV0ZSB0aGlzLmhlbHBlcnNbbmFtZV07XG5cdCAgfSxcblxuXHQgIHJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24gcmVnaXN0ZXJQYXJ0aWFsKG5hbWUsIHBhcnRpYWwpIHtcblx0ICAgIGlmIChfdXRpbHMudG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuXHQgICAgICBfdXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsIG5hbWUpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKHR5cGVvZiBwYXJ0aWFsID09PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdBdHRlbXB0aW5nIHRvIHJlZ2lzdGVyIGEgcGFydGlhbCBjYWxsZWQgXCInICsgbmFtZSArICdcIiBhcyB1bmRlZmluZWQnKTtcblx0ICAgICAgfVxuXHQgICAgICB0aGlzLnBhcnRpYWxzW25hbWVdID0gcGFydGlhbDtcblx0ICAgIH1cblx0ICB9LFxuXHQgIHVucmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbiB1bnJlZ2lzdGVyUGFydGlhbChuYW1lKSB7XG5cdCAgICBkZWxldGUgdGhpcy5wYXJ0aWFsc1tuYW1lXTtcblx0ICB9LFxuXG5cdCAgcmVnaXN0ZXJEZWNvcmF0b3I6IGZ1bmN0aW9uIHJlZ2lzdGVyRGVjb3JhdG9yKG5hbWUsIGZuKSB7XG5cdCAgICBpZiAoX3V0aWxzLnRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcblx0ICAgICAgaWYgKGZuKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgZGVjb3JhdG9ycycpO1xuXHQgICAgICB9XG5cdCAgICAgIF91dGlscy5leHRlbmQodGhpcy5kZWNvcmF0b3JzLCBuYW1lKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMuZGVjb3JhdG9yc1tuYW1lXSA9IGZuO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgdW5yZWdpc3RlckRlY29yYXRvcjogZnVuY3Rpb24gdW5yZWdpc3RlckRlY29yYXRvcihuYW1lKSB7XG5cdCAgICBkZWxldGUgdGhpcy5kZWNvcmF0b3JzW25hbWVdO1xuXHQgIH1cblx0fTtcblxuXHR2YXIgbG9nID0gX2xvZ2dlcjJbJ2RlZmF1bHQnXS5sb2c7XG5cblx0ZXhwb3J0cy5sb2cgPSBsb2c7XG5cdGV4cG9ydHMuY3JlYXRlRnJhbWUgPSBfdXRpbHMuY3JlYXRlRnJhbWU7XG5cdGV4cG9ydHMubG9nZ2VyID0gX2xvZ2dlcjJbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiA1ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuXHRleHBvcnRzLmluZGV4T2YgPSBpbmRleE9mO1xuXHRleHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO1xuXHRleHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5O1xuXHRleHBvcnRzLmNyZWF0ZUZyYW1lID0gY3JlYXRlRnJhbWU7XG5cdGV4cG9ydHMuYmxvY2tQYXJhbXMgPSBibG9ja1BhcmFtcztcblx0ZXhwb3J0cy5hcHBlbmRDb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoO1xuXHR2YXIgZXNjYXBlID0ge1xuXHQgICcmJzogJyZhbXA7Jyxcblx0ICAnPCc6ICcmbHQ7Jyxcblx0ICAnPic6ICcmZ3Q7Jyxcblx0ICAnXCInOiAnJnF1b3Q7Jyxcblx0ICBcIidcIjogJyYjeDI3OycsXG5cdCAgJ2AnOiAnJiN4NjA7Jyxcblx0ICAnPSc6ICcmI3gzRDsnXG5cdH07XG5cblx0dmFyIGJhZENoYXJzID0gL1smPD5cIidgPV0vZyxcblx0ICAgIHBvc3NpYmxlID0gL1smPD5cIidgPV0vO1xuXG5cdGZ1bmN0aW9uIGVzY2FwZUNoYXIoY2hyKSB7XG5cdCAgcmV0dXJuIGVzY2FwZVtjaHJdO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXh0ZW5kKG9iaiAvKiAsIC4uLnNvdXJjZSAqLykge1xuXHQgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBmb3IgKHZhciBrZXkgaW4gYXJndW1lbnRzW2ldKSB7XG5cdCAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJndW1lbnRzW2ldLCBrZXkpKSB7XG5cdCAgICAgICAgb2JqW2tleV0gPSBhcmd1bWVudHNbaV1ba2V5XTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblxuXHQgIHJldHVybiBvYmo7XG5cdH1cblxuXHR2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5cdGV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcblx0Ly8gU291cmNlZCBmcm9tIGxvZGFzaFxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vYmVzdGllanMvbG9kYXNoL2Jsb2IvbWFzdGVyL0xJQ0VOU0UudHh0XG5cdC8qIGVzbGludC1kaXNhYmxlIGZ1bmMtc3R5bGUgKi9cblx0dmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcblx0fTtcblx0Ly8gZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zIG9mIENocm9tZSBhbmQgU2FmYXJpXG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdGlmIChpc0Z1bmN0aW9uKC94LykpIHtcblx0ICBleHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdCAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHQgIH07XG5cdH1cblx0ZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuXHQvKiBlc2xpbnQtZW5hYmxlIGZ1bmMtc3R5bGUgKi9cblxuXHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHR2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHZhbHVlKSB7XG5cdCAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJyA6IGZhbHNlO1xuXHR9O1xuXG5cdGV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cdC8vIE9sZGVyIElFIHZlcnNpb25zIGRvIG5vdCBkaXJlY3RseSBzdXBwb3J0IGluZGV4T2Ygc28gd2UgbXVzdCBpbXBsZW1lbnQgb3VyIG93biwgc2FkbHkuXG5cblx0ZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUpIHtcblx0ICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgIGlmIChhcnJheVtpXSA9PT0gdmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIGk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiAtMTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVzY2FwZUV4cHJlc3Npb24oc3RyaW5nKSB7XG5cdCAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG5cdCAgICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG5cdCAgICBpZiAoc3RyaW5nICYmIHN0cmluZy50b0hUTUwpIHtcblx0ICAgICAgcmV0dXJuIHN0cmluZy50b0hUTUwoKTtcblx0ICAgIH0gZWxzZSBpZiAoc3RyaW5nID09IG51bGwpIHtcblx0ICAgICAgcmV0dXJuICcnO1xuXHQgICAgfSBlbHNlIGlmICghc3RyaW5nKSB7XG5cdCAgICAgIHJldHVybiBzdHJpbmcgKyAnJztcblx0ICAgIH1cblxuXHQgICAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG5cdCAgICAvLyB0aGUgcmVnZXggdGVzdCB3aWxsIGRvIHRoaXMgdHJhbnNwYXJlbnRseSBiZWhpbmQgdGhlIHNjZW5lcywgY2F1c2luZyBpc3N1ZXMgaWZcblx0ICAgIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuXHQgICAgc3RyaW5nID0gJycgKyBzdHJpbmc7XG5cdCAgfVxuXG5cdCAgaWYgKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHtcblx0ICAgIHJldHVybiBzdHJpbmc7XG5cdCAgfVxuXHQgIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG5cdH1cblxuXHRmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG5cdCAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlRnJhbWUob2JqZWN0KSB7XG5cdCAgdmFyIGZyYW1lID0gZXh0ZW5kKHt9LCBvYmplY3QpO1xuXHQgIGZyYW1lLl9wYXJlbnQgPSBvYmplY3Q7XG5cdCAgcmV0dXJuIGZyYW1lO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmxvY2tQYXJhbXMocGFyYW1zLCBpZHMpIHtcblx0ICBwYXJhbXMucGF0aCA9IGlkcztcblx0ICByZXR1cm4gcGFyYW1zO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXBwZW5kQ29udGV4dFBhdGgoY29udGV4dFBhdGgsIGlkKSB7XG5cdCAgcmV0dXJuIChjb250ZXh0UGF0aCA/IGNvbnRleHRQYXRoICsgJy4nIDogJycpICsgaWQ7XG5cdH1cblxuLyoqKi8gfSksXG4vKiA2ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfT2JqZWN0JGRlZmluZVByb3BlcnR5ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3KVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIGVycm9yUHJvcHMgPSBbJ2Rlc2NyaXB0aW9uJywgJ2ZpbGVOYW1lJywgJ2xpbmVOdW1iZXInLCAnbWVzc2FnZScsICduYW1lJywgJ251bWJlcicsICdzdGFjayddO1xuXG5cdGZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG5cdCAgdmFyIGxvYyA9IG5vZGUgJiYgbm9kZS5sb2MsXG5cdCAgICAgIGxpbmUgPSB1bmRlZmluZWQsXG5cdCAgICAgIGNvbHVtbiA9IHVuZGVmaW5lZDtcblx0ICBpZiAobG9jKSB7XG5cdCAgICBsaW5lID0gbG9jLnN0YXJ0LmxpbmU7XG5cdCAgICBjb2x1bW4gPSBsb2Muc3RhcnQuY29sdW1uO1xuXG5cdCAgICBtZXNzYWdlICs9ICcgLSAnICsgbGluZSArICc6JyArIGNvbHVtbjtcblx0ICB9XG5cblx0ICB2YXIgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cblx0ICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cblx0ICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBlcnJvclByb3BzLmxlbmd0aDsgaWR4KyspIHtcblx0ICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuXHQgIH1cblxuXHQgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdCAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG5cdCAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBFeGNlcHRpb24pO1xuXHQgIH1cblxuXHQgIHRyeSB7XG5cdCAgICBpZiAobG9jKSB7XG5cdCAgICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG5cblx0ICAgICAgLy8gV29yayBhcm91bmQgaXNzdWUgdW5kZXIgc2FmYXJpIHdoZXJlIHdlIGNhbid0IGRpcmVjdGx5IHNldCB0aGUgY29sdW1uIHZhbHVlXG5cdCAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgICAgIGlmIChfT2JqZWN0JGRlZmluZVByb3BlcnR5KSB7XG5cdCAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdjb2x1bW4nLCB7XG5cdCAgICAgICAgICB2YWx1ZTogY29sdW1uLFxuXHQgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXHQgICAgICAgIH0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSBjYXRjaCAobm9wKSB7XG5cdCAgICAvKiBJZ25vcmUgaWYgdGhlIGJyb3dzZXIgaXMgdmVyeSBwYXJ0aWN1bGFyICovXG5cdCAgfVxuXHR9XG5cblx0RXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IEV4Y2VwdGlvbjtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogNyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogX193ZWJwYWNrX3JlcXVpcmVfXyg4KSwgX19lc01vZHVsZTogdHJ1ZSB9O1xuXG4vKioqLyB9KSxcbi8qIDggKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgJCA9IF9fd2VicGFja19yZXF1aXJlX18oOSk7XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYyl7XG5cdCAgcmV0dXJuICQuc2V0RGVzYyhpdCwga2V5LCBkZXNjKTtcblx0fTtcblxuLyoqKi8gfSksXG4vKiA5ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0dmFyICRPYmplY3QgPSBPYmplY3Q7XG5cdG1vZHVsZS5leHBvcnRzID0ge1xuXHQgIGNyZWF0ZTogICAgICRPYmplY3QuY3JlYXRlLFxuXHQgIGdldFByb3RvOiAgICRPYmplY3QuZ2V0UHJvdG90eXBlT2YsXG5cdCAgaXNFbnVtOiAgICAge30ucHJvcGVydHlJc0VudW1lcmFibGUsXG5cdCAgZ2V0RGVzYzogICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG5cdCAgc2V0RGVzYzogICAgJE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcblx0ICBzZXREZXNjczogICAkT2JqZWN0LmRlZmluZVByb3BlcnRpZXMsXG5cdCAgZ2V0S2V5czogICAgJE9iamVjdC5rZXlzLFxuXHQgIGdldE5hbWVzOiAgICRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxcblx0ICBnZXRTeW1ib2xzOiAkT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcblx0ICBlYWNoOiAgICAgICBbXS5mb3JFYWNoXG5cdH07XG5cbi8qKiovIH0pLFxuLyogMTAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5yZWdpc3RlckRlZmF1bHRIZWxwZXJzID0gcmVnaXN0ZXJEZWZhdWx0SGVscGVycztcblxuXHR2YXIgX2hlbHBlcnNCbG9ja0hlbHBlck1pc3NpbmcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDExKTtcblxuXHR2YXIgX2hlbHBlcnNCbG9ja0hlbHBlck1pc3NpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0Jsb2NrSGVscGVyTWlzc2luZyk7XG5cblx0dmFyIF9oZWxwZXJzRWFjaCA9IF9fd2VicGFja19yZXF1aXJlX18oMTIpO1xuXG5cdHZhciBfaGVscGVyc0VhY2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0VhY2gpO1xuXG5cdHZhciBfaGVscGVyc0hlbHBlck1pc3NpbmcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEzKTtcblxuXHR2YXIgX2hlbHBlcnNIZWxwZXJNaXNzaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNIZWxwZXJNaXNzaW5nKTtcblxuXHR2YXIgX2hlbHBlcnNJZiA9IF9fd2VicGFja19yZXF1aXJlX18oMTQpO1xuXG5cdHZhciBfaGVscGVyc0lmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNJZik7XG5cblx0dmFyIF9oZWxwZXJzTG9nID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNSk7XG5cblx0dmFyIF9oZWxwZXJzTG9nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNMb2cpO1xuXG5cdHZhciBfaGVscGVyc0xvb2t1cCA9IF9fd2VicGFja19yZXF1aXJlX18oMTYpO1xuXG5cdHZhciBfaGVscGVyc0xvb2t1cDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzTG9va3VwKTtcblxuXHR2YXIgX2hlbHBlcnNXaXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNyk7XG5cblx0dmFyIF9oZWxwZXJzV2l0aDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzV2l0aCk7XG5cblx0ZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0SGVscGVycyhpbnN0YW5jZSkge1xuXHQgIF9oZWxwZXJzQmxvY2tIZWxwZXJNaXNzaW5nMlsnZGVmYXVsdCddKGluc3RhbmNlKTtcblx0ICBfaGVscGVyc0VhY2gyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHQgIF9oZWxwZXJzSGVscGVyTWlzc2luZzJbJ2RlZmF1bHQnXShpbnN0YW5jZSk7XG5cdCAgX2hlbHBlcnNJZjJbJ2RlZmF1bHQnXShpbnN0YW5jZSk7XG5cdCAgX2hlbHBlcnNMb2cyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHQgIF9oZWxwZXJzTG9va3VwMlsnZGVmYXVsdCddKGluc3RhbmNlKTtcblx0ICBfaGVscGVyc1dpdGgyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHR9XG5cbi8qKiovIH0pLFxuLyogMTEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignYmxvY2tIZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24gKGNvbnRleHQsIG9wdGlvbnMpIHtcblx0ICAgIHZhciBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlLFxuXHQgICAgICAgIGZuID0gb3B0aW9ucy5mbjtcblxuXHQgICAgaWYgKGNvbnRleHQgPT09IHRydWUpIHtcblx0ICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuXHQgICAgfSBlbHNlIGlmIChjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcblx0ICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG5cdCAgICB9IGVsc2UgaWYgKF91dGlscy5pc0FycmF5KGNvbnRleHQpKSB7XG5cdCAgICAgIGlmIChjb250ZXh0Lmxlbmd0aCA+IDApIHtcblx0ICAgICAgICBpZiAob3B0aW9ucy5pZHMpIHtcblx0ICAgICAgICAgIG9wdGlvbnMuaWRzID0gW29wdGlvbnMubmFtZV07XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmlkcykge1xuXHQgICAgICAgIHZhciBkYXRhID0gX3V0aWxzLmNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG5cdCAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IF91dGlscy5hcHBlbmRDb250ZXh0UGF0aChvcHRpb25zLmRhdGEuY29udGV4dFBhdGgsIG9wdGlvbnMubmFtZSk7XG5cdCAgICAgICAgb3B0aW9ucyA9IHsgZGF0YTogZGF0YSB9O1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDEyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIF9leGNlcHRpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG5cdHZhciBfZXhjZXB0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4Y2VwdGlvbik7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbiAoY29udGV4dCwgb3B0aW9ucykge1xuXHQgICAgaWYgKCFvcHRpb25zKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdNdXN0IHBhc3MgaXRlcmF0b3IgdG8gI2VhY2gnKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGZuID0gb3B0aW9ucy5mbixcblx0ICAgICAgICBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlLFxuXHQgICAgICAgIGkgPSAwLFxuXHQgICAgICAgIHJldCA9ICcnLFxuXHQgICAgICAgIGRhdGEgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgY29udGV4dFBhdGggPSB1bmRlZmluZWQ7XG5cblx0ICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcblx0ICAgICAgY29udGV4dFBhdGggPSBfdXRpbHMuYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLmlkc1swXSkgKyAnLic7XG5cdCAgICB9XG5cblx0ICAgIGlmIChfdXRpbHMuaXNGdW5jdGlvbihjb250ZXh0KSkge1xuXHQgICAgICBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG5cdCAgICAgIGRhdGEgPSBfdXRpbHMuY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZXhlY0l0ZXJhdGlvbihmaWVsZCwgaW5kZXgsIGxhc3QpIHtcblx0ICAgICAgaWYgKGRhdGEpIHtcblx0ICAgICAgICBkYXRhLmtleSA9IGZpZWxkO1xuXHQgICAgICAgIGRhdGEuaW5kZXggPSBpbmRleDtcblx0ICAgICAgICBkYXRhLmZpcnN0ID0gaW5kZXggPT09IDA7XG5cdCAgICAgICAgZGF0YS5sYXN0ID0gISFsYXN0O1xuXG5cdCAgICAgICAgaWYgKGNvbnRleHRQYXRoKSB7XG5cdCAgICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gY29udGV4dFBhdGggKyBmaWVsZDtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2ZpZWxkXSwge1xuXHQgICAgICAgIGRhdGE6IGRhdGEsXG5cdCAgICAgICAgYmxvY2tQYXJhbXM6IF91dGlscy5ibG9ja1BhcmFtcyhbY29udGV4dFtmaWVsZF0sIGZpZWxkXSwgW2NvbnRleHRQYXRoICsgZmllbGQsIG51bGxdKVxuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIGlmIChfdXRpbHMuaXNBcnJheShjb250ZXh0KSkge1xuXHQgICAgICAgIGZvciAodmFyIGogPSBjb250ZXh0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHQgICAgICAgICAgaWYgKGkgaW4gY29udGV4dCkge1xuXHQgICAgICAgICAgICBleGVjSXRlcmF0aW9uKGksIGksIGkgPT09IGNvbnRleHQubGVuZ3RoIC0gMSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciBwcmlvcktleSA9IHVuZGVmaW5lZDtcblxuXHQgICAgICAgIGZvciAodmFyIGtleSBpbiBjb250ZXh0KSB7XG5cdCAgICAgICAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdCAgICAgICAgICAgIC8vIFdlJ3JlIHJ1bm5pbmcgdGhlIGl0ZXJhdGlvbnMgb25lIHN0ZXAgb3V0IG9mIHN5bmMgc28gd2UgY2FuIGRldGVjdFxuXHQgICAgICAgICAgICAvLyB0aGUgbGFzdCBpdGVyYXRpb24gd2l0aG91dCBoYXZlIHRvIHNjYW4gdGhlIG9iamVjdCB0d2ljZSBhbmQgY3JlYXRlXG5cdCAgICAgICAgICAgIC8vIGFuIGl0ZXJtZWRpYXRlIGtleXMgYXJyYXkuXG5cdCAgICAgICAgICAgIGlmIChwcmlvcktleSAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgZXhlY0l0ZXJhdGlvbihwcmlvcktleSwgaSAtIDEpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHByaW9yS2V5ID0ga2V5O1xuXHQgICAgICAgICAgICBpKys7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmIChwcmlvcktleSAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSwgdHJ1ZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGlmIChpID09PSAwKSB7XG5cdCAgICAgIHJldCA9IGludmVyc2UodGhpcyk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiByZXQ7XG5cdCAgfSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMTMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaGVscGVyTWlzc2luZycsIGZ1bmN0aW9uICgpIC8qIFthcmdzLCBdb3B0aW9ucyAqL3tcblx0ICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdCAgICAgIC8vIEEgbWlzc2luZyBmaWVsZCBpbiBhIHt7Zm9vfX0gY29uc3RydWN0LlxuXHQgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gU29tZW9uZSBpcyBhY3R1YWxseSB0cnlpbmcgdG8gY2FsbCBzb21ldGhpbmcsIGJsb3cgdXAuXG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdNaXNzaW5nIGhlbHBlcjogXCInICsgYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXS5uYW1lICsgJ1wiJyk7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMTQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbiAoY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcblx0ICAgIGlmIChfdXRpbHMuaXNGdW5jdGlvbihjb25kaXRpb25hbCkpIHtcblx0ICAgICAgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbC5jYWxsKHRoaXMpO1xuXHQgICAgfVxuXG5cdCAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIGlzIHRvIHJlbmRlciB0aGUgcG9zaXRpdmUgcGF0aCBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5IGFuZCBub3QgZW1wdHkuXG5cdCAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuXHQgICAgLy8gYmVoYXZpb3Igb2YgaXNFbXB0eS4gRWZmZWN0aXZlbHkgdGhpcyBkZXRlcm1pbmVzIGlmIDAgaXMgaGFuZGxlZCBieSB0aGUgcG9zaXRpdmUgcGF0aCBvciBuZWdhdGl2ZS5cblx0ICAgIGlmICghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCB8fCBfdXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcblx0ICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuXHQgICAgfVxuXHQgIH0pO1xuXG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uIChjb25kaXRpb25hbCwgb3B0aW9ucykge1xuXHQgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwgeyBmbjogb3B0aW9ucy5pbnZlcnNlLCBpbnZlcnNlOiBvcHRpb25zLmZuLCBoYXNoOiBvcHRpb25zLmhhc2ggfSk7XG5cdCAgfSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMTUgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24gKCkgLyogbWVzc2FnZSwgb3B0aW9ucyAqL3tcblx0ICAgIHZhciBhcmdzID0gW3VuZGVmaW5lZF0sXG5cdCAgICAgICAgb3B0aW9ucyA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpKyspIHtcblx0ICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG5cdCAgICB9XG5cblx0ICAgIHZhciBsZXZlbCA9IDE7XG5cdCAgICBpZiAob3B0aW9ucy5oYXNoLmxldmVsICE9IG51bGwpIHtcblx0ICAgICAgbGV2ZWwgPSBvcHRpb25zLmhhc2gubGV2ZWw7XG5cdCAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCkge1xuXHQgICAgICBsZXZlbCA9IG9wdGlvbnMuZGF0YS5sZXZlbDtcblx0ICAgIH1cblx0ICAgIGFyZ3NbMF0gPSBsZXZlbDtcblxuXHQgICAgaW5zdGFuY2UubG9nLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcblx0ICB9KTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAxNiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuXHQgIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb29rdXAnLCBmdW5jdGlvbiAob2JqLCBmaWVsZCkge1xuXHQgICAgcmV0dXJuIG9iaiAmJiBvYmpbZmllbGRdO1xuXHQgIH0pO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDE3ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbiAoY29udGV4dCwgb3B0aW9ucykge1xuXHQgICAgaWYgKF91dGlscy5pc0Z1bmN0aW9uKGNvbnRleHQpKSB7XG5cdCAgICAgIGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7XG5cdCAgICB9XG5cblx0ICAgIHZhciBmbiA9IG9wdGlvbnMuZm47XG5cblx0ICAgIGlmICghX3V0aWxzLmlzRW1wdHkoY29udGV4dCkpIHtcblx0ICAgICAgdmFyIGRhdGEgPSBvcHRpb25zLmRhdGE7XG5cdCAgICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcblx0ICAgICAgICBkYXRhID0gX3V0aWxzLmNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG5cdCAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IF91dGlscy5hcHBlbmRDb250ZXh0UGF0aChvcHRpb25zLmRhdGEuY29udGV4dFBhdGgsIG9wdGlvbnMuaWRzWzBdKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBmbihjb250ZXh0LCB7XG5cdCAgICAgICAgZGF0YTogZGF0YSxcblx0ICAgICAgICBibG9ja1BhcmFtczogX3V0aWxzLmJsb2NrUGFyYW1zKFtjb250ZXh0XSwgW2RhdGEgJiYgZGF0YS5jb250ZXh0UGF0aF0pXG5cdCAgICAgIH0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcblx0ICAgIH1cblx0ICB9KTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAxOCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnMgPSByZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzO1xuXG5cdHZhciBfZGVjb3JhdG9yc0lubGluZSA9IF9fd2VicGFja19yZXF1aXJlX18oMTkpO1xuXG5cdHZhciBfZGVjb3JhdG9yc0lubGluZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWNvcmF0b3JzSW5saW5lKTtcblxuXHRmdW5jdGlvbiByZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzKGluc3RhbmNlKSB7XG5cdCAgX2RlY29yYXRvcnNJbmxpbmUyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHR9XG5cbi8qKiovIH0pLFxuLyogMTkgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckRlY29yYXRvcignaW5saW5lJywgZnVuY3Rpb24gKGZuLCBwcm9wcywgY29udGFpbmVyLCBvcHRpb25zKSB7XG5cdCAgICB2YXIgcmV0ID0gZm47XG5cdCAgICBpZiAoIXByb3BzLnBhcnRpYWxzKSB7XG5cdCAgICAgIHByb3BzLnBhcnRpYWxzID0ge307XG5cdCAgICAgIHJldCA9IGZ1bmN0aW9uIChjb250ZXh0LCBvcHRpb25zKSB7XG5cdCAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHBhcnRpYWxzIHN0YWNrIGZyYW1lIHByaW9yIHRvIGV4ZWMuXG5cdCAgICAgICAgdmFyIG9yaWdpbmFsID0gY29udGFpbmVyLnBhcnRpYWxzO1xuXHQgICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IF91dGlscy5leHRlbmQoe30sIG9yaWdpbmFsLCBwcm9wcy5wYXJ0aWFscyk7XG5cdCAgICAgICAgdmFyIHJldCA9IGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IG9yaWdpbmFsO1xuXHQgICAgICAgIHJldHVybiByZXQ7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cblx0ICAgIHByb3BzLnBhcnRpYWxzW29wdGlvbnMuYXJnc1swXV0gPSBvcHRpb25zLmZuO1xuXG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH0pO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDIwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIGxvZ2dlciA9IHtcblx0ICBtZXRob2RNYXA6IFsnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ10sXG5cdCAgbGV2ZWw6ICdpbmZvJyxcblxuXHQgIC8vIE1hcHMgYSBnaXZlbiBsZXZlbCB2YWx1ZSB0byB0aGUgYG1ldGhvZE1hcGAgaW5kZXhlcyBhYm92ZS5cblx0ICBsb29rdXBMZXZlbDogZnVuY3Rpb24gbG9va3VwTGV2ZWwobGV2ZWwpIHtcblx0ICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgIHZhciBsZXZlbE1hcCA9IF91dGlscy5pbmRleE9mKGxvZ2dlci5tZXRob2RNYXAsIGxldmVsLnRvTG93ZXJDYXNlKCkpO1xuXHQgICAgICBpZiAobGV2ZWxNYXAgPj0gMCkge1xuXHQgICAgICAgIGxldmVsID0gbGV2ZWxNYXA7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgbGV2ZWwgPSBwYXJzZUludChsZXZlbCwgMTApO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBsZXZlbDtcblx0ICB9LFxuXG5cdCAgLy8gQ2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcblx0ICBsb2c6IGZ1bmN0aW9uIGxvZyhsZXZlbCkge1xuXHQgICAgbGV2ZWwgPSBsb2dnZXIubG9va3VwTGV2ZWwobGV2ZWwpO1xuXG5cdCAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGxvZ2dlci5sb29rdXBMZXZlbChsb2dnZXIubGV2ZWwpIDw9IGxldmVsKSB7XG5cdCAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcblx0ICAgICAgaWYgKCFjb25zb2xlW21ldGhvZF0pIHtcblx0ICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcblx0ICAgICAgICBtZXRob2QgPSAnbG9nJztcblx0ICAgICAgfVxuXG5cdCAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBtZXNzYWdlID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgICAgIG1lc3NhZ2VbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuXHQgICAgICB9XG5cblx0ICAgICAgY29uc29sZVttZXRob2RdLmFwcGx5KGNvbnNvbGUsIG1lc3NhZ2UpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcblx0ICAgIH1cblx0ICB9XG5cdH07XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gbG9nZ2VyO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAyMSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8vIEJ1aWxkIG91dCBvdXIgYmFzaWMgU2FmZVN0cmluZyB0eXBlXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRmdW5jdGlvbiBTYWZlU3RyaW5nKHN0cmluZykge1xuXHQgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuXHR9XG5cblx0U2FmZVN0cmluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBTYWZlU3RyaW5nLnByb3RvdHlwZS50b0hUTUwgPSBmdW5jdGlvbiAoKSB7XG5cdCAgcmV0dXJuICcnICsgdGhpcy5zdHJpbmc7XG5cdH07XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gU2FmZVN0cmluZztcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMjIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9PYmplY3Qkc2VhbCA9IF9fd2VicGFja19yZXF1aXJlX18oMjMpWydkZWZhdWx0J107XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKVsnZGVmYXVsdCddO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuY2hlY2tSZXZpc2lvbiA9IGNoZWNrUmV2aXNpb247XG5cdGV4cG9ydHMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcblx0ZXhwb3J0cy53cmFwUHJvZ3JhbSA9IHdyYXBQcm9ncmFtO1xuXHRleHBvcnRzLnJlc29sdmVQYXJ0aWFsID0gcmVzb2x2ZVBhcnRpYWw7XG5cdGV4cG9ydHMuaW52b2tlUGFydGlhbCA9IGludm9rZVBhcnRpYWw7XG5cdGV4cG9ydHMubm9vcCA9IG5vb3A7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIFV0aWxzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxzKTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHR2YXIgX2Jhc2UgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQpO1xuXG5cdGZ1bmN0aW9uIGNoZWNrUmV2aXNpb24oY29tcGlsZXJJbmZvKSB7XG5cdCAgdmFyIGNvbXBpbGVyUmV2aXNpb24gPSBjb21waWxlckluZm8gJiYgY29tcGlsZXJJbmZvWzBdIHx8IDEsXG5cdCAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IF9iYXNlLkNPTVBJTEVSX1JFVklTSU9OO1xuXG5cdCAgaWYgKGNvbXBpbGVyUmV2aXNpb24gIT09IGN1cnJlbnRSZXZpc2lvbikge1xuXHQgICAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBjdXJyZW50UmV2aXNpb24pIHtcblx0ICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IF9iYXNlLlJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcblx0ICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBfYmFzZS5SRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gJyArICdQbGVhc2UgdXBkYXRlIHlvdXIgcHJlY29tcGlsZXIgdG8gYSBuZXdlciB2ZXJzaW9uICgnICsgcnVudGltZVZlcnNpb25zICsgJykgb3IgZG93bmdyYWRlIHlvdXIgcnVudGltZSB0byBhbiBvbGRlciB2ZXJzaW9uICgnICsgY29tcGlsZXJWZXJzaW9ucyArICcpLicpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuICcgKyAnUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uICgnICsgY29tcGlsZXJJbmZvWzFdICsgJykuJyk7XG5cdCAgICB9XG5cdCAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcblx0ICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgIGlmICghZW52KSB7XG5cdCAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnTm8gZW52aXJvbm1lbnQgcGFzc2VkIHRvIHRlbXBsYXRlJyk7XG5cdCAgfVxuXHQgIGlmICghdGVtcGxhdGVTcGVjIHx8ICF0ZW1wbGF0ZVNwZWMubWFpbikge1xuXHQgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1Vua25vd24gdGVtcGxhdGUgb2JqZWN0OiAnICsgdHlwZW9mIHRlbXBsYXRlU3BlYyk7XG5cdCAgfVxuXG5cdCAgdGVtcGxhdGVTcGVjLm1haW4uZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjLm1haW5fZDtcblxuXHQgIC8vIE5vdGU6IFVzaW5nIGVudi5WTSByZWZlcmVuY2VzIHJhdGhlciB0aGFuIGxvY2FsIHZhciByZWZlcmVuY2VzIHRocm91Z2hvdXQgdGhpcyBzZWN0aW9uIHRvIGFsbG93XG5cdCAgLy8gZm9yIGV4dGVybmFsIHVzZXJzIHRvIG92ZXJyaWRlIHRoZXNlIGFzIHBzdWVkby1zdXBwb3J0ZWQgQVBJcy5cblx0ICBlbnYuVk0uY2hlY2tSZXZpc2lvbih0ZW1wbGF0ZVNwZWMuY29tcGlsZXIpO1xuXG5cdCAgZnVuY3Rpb24gaW52b2tlUGFydGlhbFdyYXBwZXIocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuXHQgICAgaWYgKG9wdGlvbnMuaGFzaCkge1xuXHQgICAgICBjb250ZXh0ID0gVXRpbHMuZXh0ZW5kKHt9LCBjb250ZXh0LCBvcHRpb25zLmhhc2gpO1xuXHQgICAgICBpZiAob3B0aW9ucy5pZHMpIHtcblx0ICAgICAgICBvcHRpb25zLmlkc1swXSA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcGFydGlhbCA9IGVudi5WTS5yZXNvbHZlUGFydGlhbC5jYWxsKHRoaXMsIHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgICAgdmFyIHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG5cblx0ICAgIGlmIChyZXN1bHQgPT0gbnVsbCAmJiBlbnYuY29tcGlsZSkge1xuXHQgICAgICBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0gPSBlbnYuY29tcGlsZShwYXJ0aWFsLCB0ZW1wbGF0ZVNwZWMuY29tcGlsZXJPcHRpb25zLCBlbnYpO1xuXHQgICAgICByZXN1bHQgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG5cdCAgICB9XG5cdCAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcblx0ICAgICAgaWYgKG9wdGlvbnMuaW5kZW50KSB7XG5cdCAgICAgICAgdmFyIGxpbmVzID0gcmVzdWx0LnNwbGl0KCdcXG4nKTtcblx0ICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICAgICAgaWYgKCFsaW5lc1tpXSAmJiBpICsgMSA9PT0gbCkge1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIH1cblxuXHQgICAgICAgICAgbGluZXNbaV0gPSBvcHRpb25zLmluZGVudCArIGxpbmVzW2ldO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXN1bHQgPSBsaW5lcy5qb2luKCdcXG4nKTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1RoZSBwYXJ0aWFsICcgKyBvcHRpb25zLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGUnKTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICAvLyBKdXN0IGFkZCB3YXRlclxuXHQgIHZhciBjb250YWluZXIgPSB7XG5cdCAgICBzdHJpY3Q6IGZ1bmN0aW9uIHN0cmljdChvYmosIG5hbWUpIHtcblx0ICAgICAgaWYgKCEobmFtZSBpbiBvYmopKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1wiJyArIG5hbWUgKyAnXCIgbm90IGRlZmluZWQgaW4gJyArIG9iaik7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG9ialtuYW1lXTtcblx0ICAgIH0sXG5cdCAgICBsb29rdXA6IGZ1bmN0aW9uIGxvb2t1cChkZXB0aHMsIG5hbWUpIHtcblx0ICAgICAgdmFyIGxlbiA9IGRlcHRocy5sZW5ndGg7XG5cdCAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgICBpZiAoZGVwdGhzW2ldICYmIGRlcHRoc1tpXVtuYW1lXSAhPSBudWxsKSB7XG5cdCAgICAgICAgICByZXR1cm4gZGVwdGhzW2ldW25hbWVdO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSxcblx0ICAgIGxhbWJkYTogZnVuY3Rpb24gbGFtYmRhKGN1cnJlbnQsIGNvbnRleHQpIHtcblx0ICAgICAgcmV0dXJuIHR5cGVvZiBjdXJyZW50ID09PSAnZnVuY3Rpb24nID8gY3VycmVudC5jYWxsKGNvbnRleHQpIDogY3VycmVudDtcblx0ICAgIH0sXG5cblx0ICAgIGVzY2FwZUV4cHJlc3Npb246IFV0aWxzLmVzY2FwZUV4cHJlc3Npb24sXG5cdCAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcblxuXHQgICAgZm46IGZ1bmN0aW9uIGZuKGkpIHtcblx0ICAgICAgdmFyIHJldCA9IHRlbXBsYXRlU3BlY1tpXTtcblx0ICAgICAgcmV0LmRlY29yYXRvciA9IHRlbXBsYXRlU3BlY1tpICsgJ19kJ107XG5cdCAgICAgIHJldHVybiByZXQ7XG5cdCAgICB9LFxuXG5cdCAgICBwcm9ncmFtczogW10sXG5cdCAgICBwcm9ncmFtOiBmdW5jdGlvbiBwcm9ncmFtKGksIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcblx0ICAgICAgdmFyIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSxcblx0ICAgICAgICAgIGZuID0gdGhpcy5mbihpKTtcblx0ICAgICAgaWYgKGRhdGEgfHwgZGVwdGhzIHx8IGJsb2NrUGFyYW1zIHx8IGRlY2xhcmVkQmxvY2tQYXJhbXMpIHtcblx0ICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHdyYXBQcm9ncmFtKHRoaXMsIGksIGZuLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcblx0ICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcblx0ICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSB3cmFwUHJvZ3JhbSh0aGlzLCBpLCBmbik7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuXHQgICAgfSxcblxuXHQgICAgZGF0YTogZnVuY3Rpb24gZGF0YSh2YWx1ZSwgZGVwdGgpIHtcblx0ICAgICAgd2hpbGUgKHZhbHVlICYmIGRlcHRoLS0pIHtcblx0ICAgICAgICB2YWx1ZSA9IHZhbHVlLl9wYXJlbnQ7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHZhbHVlO1xuXHQgICAgfSxcblx0ICAgIG1lcmdlOiBmdW5jdGlvbiBtZXJnZShwYXJhbSwgY29tbW9uKSB7XG5cdCAgICAgIHZhciBvYmogPSBwYXJhbSB8fCBjb21tb247XG5cblx0ICAgICAgaWYgKHBhcmFtICYmIGNvbW1vbiAmJiBwYXJhbSAhPT0gY29tbW9uKSB7XG5cdCAgICAgICAgb2JqID0gVXRpbHMuZXh0ZW5kKHt9LCBjb21tb24sIHBhcmFtKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBvYmo7XG5cdCAgICB9LFxuXHQgICAgLy8gQW4gZW1wdHkgb2JqZWN0IHRvIHVzZSBhcyByZXBsYWNlbWVudCBmb3IgbnVsbC1jb250ZXh0c1xuXHQgICAgbnVsbENvbnRleHQ6IF9PYmplY3Qkc2VhbCh7fSksXG5cblx0ICAgIG5vb3A6IGVudi5WTS5ub29wLFxuXHQgICAgY29tcGlsZXJJbmZvOiB0ZW1wbGF0ZVNwZWMuY29tcGlsZXJcblx0ICB9O1xuXG5cdCAgZnVuY3Rpb24gcmV0KGNvbnRleHQpIHtcblx0ICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cblx0ICAgIHZhciBkYXRhID0gb3B0aW9ucy5kYXRhO1xuXG5cdCAgICByZXQuX3NldHVwKG9wdGlvbnMpO1xuXHQgICAgaWYgKCFvcHRpb25zLnBhcnRpYWwgJiYgdGVtcGxhdGVTcGVjLnVzZURhdGEpIHtcblx0ICAgICAgZGF0YSA9IGluaXREYXRhKGNvbnRleHQsIGRhdGEpO1xuXHQgICAgfVxuXHQgICAgdmFyIGRlcHRocyA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBibG9ja1BhcmFtcyA9IHRlbXBsYXRlU3BlYy51c2VCbG9ja1BhcmFtcyA/IFtdIDogdW5kZWZpbmVkO1xuXHQgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VEZXB0aHMpIHtcblx0ICAgICAgaWYgKG9wdGlvbnMuZGVwdGhzKSB7XG5cdCAgICAgICAgZGVwdGhzID0gY29udGV4dCAhPSBvcHRpb25zLmRlcHRoc1swXSA/IFtjb250ZXh0XS5jb25jYXQob3B0aW9ucy5kZXB0aHMpIDogb3B0aW9ucy5kZXB0aHM7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgZGVwdGhzID0gW2NvbnRleHRdO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIG1haW4oY29udGV4dCAvKiwgb3B0aW9ucyovKSB7XG5cdCAgICAgIHJldHVybiAnJyArIHRlbXBsYXRlU3BlYy5tYWluKGNvbnRhaW5lciwgY29udGV4dCwgY29udGFpbmVyLmhlbHBlcnMsIGNvbnRhaW5lci5wYXJ0aWFscywgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG5cdCAgICB9XG5cdCAgICBtYWluID0gZXhlY3V0ZURlY29yYXRvcnModGVtcGxhdGVTcGVjLm1haW4sIG1haW4sIGNvbnRhaW5lciwgb3B0aW9ucy5kZXB0aHMgfHwgW10sIGRhdGEsIGJsb2NrUGFyYW1zKTtcblx0ICAgIHJldHVybiBtYWluKGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgIH1cblx0ICByZXQuaXNUb3AgPSB0cnVlO1xuXG5cdCAgcmV0Ll9zZXR1cCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdCAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuXHQgICAgICBjb250YWluZXIuaGVscGVycyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLmhlbHBlcnMsIGVudi5oZWxwZXJzKTtcblxuXHQgICAgICBpZiAodGVtcGxhdGVTcGVjLnVzZVBhcnRpYWwpIHtcblx0ICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBjb250YWluZXIubWVyZ2Uob3B0aW9ucy5wYXJ0aWFscywgZW52LnBhcnRpYWxzKTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAodGVtcGxhdGVTcGVjLnVzZVBhcnRpYWwgfHwgdGVtcGxhdGVTcGVjLnVzZURlY29yYXRvcnMpIHtcblx0ICAgICAgICBjb250YWluZXIuZGVjb3JhdG9ycyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLmRlY29yYXRvcnMsIGVudi5kZWNvcmF0b3JzKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgY29udGFpbmVyLmhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG5cdCAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG5cdCAgICAgIGNvbnRhaW5lci5kZWNvcmF0b3JzID0gb3B0aW9ucy5kZWNvcmF0b3JzO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICByZXQuX2NoaWxkID0gZnVuY3Rpb24gKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcblx0ICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgJiYgIWJsb2NrUGFyYW1zKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdtdXN0IHBhc3MgYmxvY2sgcGFyYW1zJyk7XG5cdCAgICB9XG5cdCAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocyAmJiAhZGVwdGhzKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdtdXN0IHBhc3MgcGFyZW50IGRlcHRocycpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gd3JhcFByb2dyYW0oY29udGFpbmVyLCBpLCB0ZW1wbGF0ZVNwZWNbaV0sIGRhdGEsIDAsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuXHQgIH07XG5cdCAgcmV0dXJuIHJldDtcblx0fVxuXG5cdGZ1bmN0aW9uIHdyYXBQcm9ncmFtKGNvbnRhaW5lciwgaSwgZm4sIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcblx0ICBmdW5jdGlvbiBwcm9nKGNvbnRleHQpIHtcblx0ICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cblx0ICAgIHZhciBjdXJyZW50RGVwdGhzID0gZGVwdGhzO1xuXHQgICAgaWYgKGRlcHRocyAmJiBjb250ZXh0ICE9IGRlcHRoc1swXSAmJiAhKGNvbnRleHQgPT09IGNvbnRhaW5lci5udWxsQ29udGV4dCAmJiBkZXB0aHNbMF0gPT09IG51bGwpKSB7XG5cdCAgICAgIGN1cnJlbnREZXB0aHMgPSBbY29udGV4dF0uY29uY2F0KGRlcHRocyk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBmbihjb250YWluZXIsIGNvbnRleHQsIGNvbnRhaW5lci5oZWxwZXJzLCBjb250YWluZXIucGFydGlhbHMsIG9wdGlvbnMuZGF0YSB8fCBkYXRhLCBibG9ja1BhcmFtcyAmJiBbb3B0aW9ucy5ibG9ja1BhcmFtc10uY29uY2F0KGJsb2NrUGFyYW1zKSwgY3VycmVudERlcHRocyk7XG5cdCAgfVxuXG5cdCAgcHJvZyA9IGV4ZWN1dGVEZWNvcmF0b3JzKGZuLCBwcm9nLCBjb250YWluZXIsIGRlcHRocywgZGF0YSwgYmxvY2tQYXJhbXMpO1xuXG5cdCAgcHJvZy5wcm9ncmFtID0gaTtcblx0ICBwcm9nLmRlcHRoID0gZGVwdGhzID8gZGVwdGhzLmxlbmd0aCA6IDA7XG5cdCAgcHJvZy5ibG9ja1BhcmFtcyA9IGRlY2xhcmVkQmxvY2tQYXJhbXMgfHwgMDtcblx0ICByZXR1cm4gcHJvZztcblx0fVxuXG5cdGZ1bmN0aW9uIHJlc29sdmVQYXJ0aWFsKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcblx0ICBpZiAoIXBhcnRpYWwpIHtcblx0ICAgIGlmIChvcHRpb25zLm5hbWUgPT09ICdAcGFydGlhbC1ibG9jaycpIHtcblx0ICAgICAgcGFydGlhbCA9IG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcGFydGlhbCA9IG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXTtcblx0ICAgIH1cblx0ICB9IGVsc2UgaWYgKCFwYXJ0aWFsLmNhbGwgJiYgIW9wdGlvbnMubmFtZSkge1xuXHQgICAgLy8gVGhpcyBpcyBhIGR5bmFtaWMgcGFydGlhbCB0aGF0IHJldHVybmVkIGEgc3RyaW5nXG5cdCAgICBvcHRpb25zLm5hbWUgPSBwYXJ0aWFsO1xuXHQgICAgcGFydGlhbCA9IG9wdGlvbnMucGFydGlhbHNbcGFydGlhbF07XG5cdCAgfVxuXHQgIHJldHVybiBwYXJ0aWFsO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG5cdCAgLy8gVXNlIHRoZSBjdXJyZW50IGNsb3N1cmUgY29udGV4dCB0byBzYXZlIHRoZSBwYXJ0aWFsLWJsb2NrIGlmIHRoaXMgcGFydGlhbFxuXHQgIHZhciBjdXJyZW50UGFydGlhbEJsb2NrID0gb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddO1xuXHQgIG9wdGlvbnMucGFydGlhbCA9IHRydWU7XG5cdCAgaWYgKG9wdGlvbnMuaWRzKSB7XG5cdCAgICBvcHRpb25zLmRhdGEuY29udGV4dFBhdGggPSBvcHRpb25zLmlkc1swXSB8fCBvcHRpb25zLmRhdGEuY29udGV4dFBhdGg7XG5cdCAgfVxuXG5cdCAgdmFyIHBhcnRpYWxCbG9jayA9IHVuZGVmaW5lZDtcblx0ICBpZiAob3B0aW9ucy5mbiAmJiBvcHRpb25zLmZuICE9PSBub29wKSB7XG5cdCAgICAoZnVuY3Rpb24gKCkge1xuXHQgICAgICBvcHRpb25zLmRhdGEgPSBfYmFzZS5jcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuXHQgICAgICAvLyBXcmFwcGVyIGZ1bmN0aW9uIHRvIGdldCBhY2Nlc3MgdG8gY3VycmVudFBhcnRpYWxCbG9jayBmcm9tIHRoZSBjbG9zdXJlXG5cdCAgICAgIHZhciBmbiA9IG9wdGlvbnMuZm47XG5cdCAgICAgIHBhcnRpYWxCbG9jayA9IG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddID0gZnVuY3Rpb24gcGFydGlhbEJsb2NrV3JhcHBlcihjb250ZXh0KSB7XG5cdCAgICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuXHQgICAgICAgIC8vIFJlc3RvcmUgdGhlIHBhcnRpYWwtYmxvY2sgZnJvbSB0aGUgY2xvc3VyZSBmb3IgdGhlIGV4ZWN1dGlvbiBvZiB0aGUgYmxvY2tcblx0ICAgICAgICAvLyBpLmUuIHRoZSBwYXJ0IGluc2lkZSB0aGUgYmxvY2sgb2YgdGhlIHBhcnRpYWwgY2FsbC5cblx0ICAgICAgICBvcHRpb25zLmRhdGEgPSBfYmFzZS5jcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuXHQgICAgICAgIG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddID0gY3VycmVudFBhcnRpYWxCbG9jaztcblx0ICAgICAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucyk7XG5cdCAgICAgIH07XG5cdCAgICAgIGlmIChmbi5wYXJ0aWFscykge1xuXHQgICAgICAgIG9wdGlvbnMucGFydGlhbHMgPSBVdGlscy5leHRlbmQoe30sIG9wdGlvbnMucGFydGlhbHMsIGZuLnBhcnRpYWxzKTtcblx0ICAgICAgfVxuXHQgICAgfSkoKTtcblx0ICB9XG5cblx0ICBpZiAocGFydGlhbCA9PT0gdW5kZWZpbmVkICYmIHBhcnRpYWxCbG9jaykge1xuXHQgICAgcGFydGlhbCA9IHBhcnRpYWxCbG9jaztcblx0ICB9XG5cblx0ICBpZiAocGFydGlhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVGhlIHBhcnRpYWwgJyArIG9wdGlvbnMubmFtZSArICcgY291bGQgbm90IGJlIGZvdW5kJyk7XG5cdCAgfSBlbHNlIGlmIChwYXJ0aWFsIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcblx0ICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIG5vb3AoKSB7XG5cdCAgcmV0dXJuICcnO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdERhdGEoY29udGV4dCwgZGF0YSkge1xuXHQgIGlmICghZGF0YSB8fCAhKCdyb290JyBpbiBkYXRhKSkge1xuXHQgICAgZGF0YSA9IGRhdGEgPyBfYmFzZS5jcmVhdGVGcmFtZShkYXRhKSA6IHt9O1xuXHQgICAgZGF0YS5yb290ID0gY29udGV4dDtcblx0ICB9XG5cdCAgcmV0dXJuIGRhdGE7XG5cdH1cblxuXHRmdW5jdGlvbiBleGVjdXRlRGVjb3JhdG9ycyhmbiwgcHJvZywgY29udGFpbmVyLCBkZXB0aHMsIGRhdGEsIGJsb2NrUGFyYW1zKSB7XG5cdCAgaWYgKGZuLmRlY29yYXRvcikge1xuXHQgICAgdmFyIHByb3BzID0ge307XG5cdCAgICBwcm9nID0gZm4uZGVjb3JhdG9yKHByb2csIHByb3BzLCBjb250YWluZXIsIGRlcHRocyAmJiBkZXB0aHNbMF0sIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuXHQgICAgVXRpbHMuZXh0ZW5kKHByb2csIHByb3BzKTtcblx0ICB9XG5cdCAgcmV0dXJuIHByb2c7XG5cdH1cblxuLyoqKi8gfSksXG4vKiAyMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogX193ZWJwYWNrX3JlcXVpcmVfXygyNCksIF9fZXNNb2R1bGU6IHRydWUgfTtcblxuLyoqKi8gfSksXG4vKiAyNCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdF9fd2VicGFja19yZXF1aXJlX18oMjUpO1xuXHRtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19yZXF1aXJlX18oMzApLk9iamVjdC5zZWFsO1xuXG4vKioqLyB9KSxcbi8qIDI1ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0Ly8gMTkuMS4yLjE3IE9iamVjdC5zZWFsKE8pXG5cdHZhciBpc09iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMjYpO1xuXG5cdF9fd2VicGFja19yZXF1aXJlX18oMjcpKCdzZWFsJywgZnVuY3Rpb24oJHNlYWwpe1xuXHQgIHJldHVybiBmdW5jdGlvbiBzZWFsKGl0KXtcblx0ICAgIHJldHVybiAkc2VhbCAmJiBpc09iamVjdChpdCkgPyAkc2VhbChpdCkgOiBpdDtcblx0ICB9O1xuXHR9KTtcblxuLyoqKi8gfSksXG4vKiAyNiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuXHQgIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG5cdH07XG5cbi8qKiovIH0pLFxuLyogMjcgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcblx0dmFyICRleHBvcnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDI4KVxuXHQgICwgY29yZSAgICA9IF9fd2VicGFja19yZXF1aXJlX18oMzApXG5cdCAgLCBmYWlscyAgID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMyk7XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZLCBleGVjKXtcblx0ICB2YXIgZm4gID0gKGNvcmUuT2JqZWN0IHx8IHt9KVtLRVldIHx8IE9iamVjdFtLRVldXG5cdCAgICAsIGV4cCA9IHt9O1xuXHQgIGV4cFtLRVldID0gZXhlYyhmbik7XG5cdCAgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbigpeyBmbigxKTsgfSksICdPYmplY3QnLCBleHApO1xuXHR9O1xuXG4vKioqLyB9KSxcbi8qIDI4ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGdsb2JhbCAgICA9IF9fd2VicGFja19yZXF1aXJlX18oMjkpXG5cdCAgLCBjb3JlICAgICAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMwKVxuXHQgICwgY3R4ICAgICAgID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMSlcblx0ICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG5cdHZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcblx0ICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuXHQgICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG5cdCAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcblx0ICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuXHQgICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG5cdCAgICAsIElTX1dSQVAgICA9IHR5cGUgJiAkZXhwb3J0Lldcblx0ICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcblx0ICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuXHQgICAgLCBrZXksIG93biwgb3V0O1xuXHQgIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuXHQgIGZvcihrZXkgaW4gc291cmNlKXtcblx0ICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuXHQgICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYga2V5IGluIHRhcmdldDtcblx0ICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcblx0ICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG5cdCAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuXHQgICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG5cdCAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuXHQgICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcblx0ICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG5cdCAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuXHQgICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbihDKXtcblx0ICAgICAgdmFyIEYgPSBmdW5jdGlvbihwYXJhbSl7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBDID8gbmV3IEMocGFyYW0pIDogQyhwYXJhbSk7XG5cdCAgICAgIH07XG5cdCAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcblx0ICAgICAgcmV0dXJuIEY7XG5cdCAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcblx0ICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcblx0ICAgIGlmKElTX1BST1RPKShleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KSlba2V5XSA9IG91dDtcblx0ICB9XG5cdH07XG5cdC8vIHR5cGUgYml0bWFwXG5cdCRleHBvcnQuRiA9IDE7ICAvLyBmb3JjZWRcblx0JGV4cG9ydC5HID0gMjsgIC8vIGdsb2JhbFxuXHQkZXhwb3J0LlMgPSA0OyAgLy8gc3RhdGljXG5cdCRleHBvcnQuUCA9IDg7ICAvLyBwcm90b1xuXHQkZXhwb3J0LkIgPSAxNjsgLy8gYmluZFxuXHQkZXhwb3J0LlcgPSAzMjsgLy8gd3JhcFxuXHRtb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG5cbi8qKiovIH0pLFxuLyogMjkgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxuXHR2YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcblx0ICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdGlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG5cbi8qKiovIH0pLFxuLyogMzAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHR2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcxLjIuNid9O1xuXHRpZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcblxuLyoqKi8gfSksXG4vKiAzMSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xuXHR2YXIgYUZ1bmN0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMik7XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG5cdCAgYUZ1bmN0aW9uKGZuKTtcblx0ICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuXHQgIHN3aXRjaChsZW5ndGgpe1xuXHQgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG5cdCAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuXHQgICAgfTtcblx0ICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuXHQgICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcblx0ICAgIH07XG5cdCAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcblx0ICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG5cdCAgICB9O1xuXHQgIH1cblx0ICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG5cdCAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcblx0ICB9O1xuXHR9O1xuXG4vKioqLyB9KSxcbi8qIDMyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG5cdCAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcblx0ICByZXR1cm4gaXQ7XG5cdH07XG5cbi8qKiovIH0pLFxuLyogMzMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuXHQgIHRyeSB7XG5cdCAgICByZXR1cm4gISFleGVjKCk7XG5cdCAgfSBjYXRjaChlKXtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblx0fTtcblxuLyoqKi8gfSksXG4vKiAzNCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihnbG9iYWwpIHsvKiBnbG9iYWwgd2luZG93ICovXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChIYW5kbGViYXJzKSB7XG5cdCAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICB2YXIgcm9vdCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93LFxuXHQgICAgICAkSGFuZGxlYmFycyA9IHJvb3QuSGFuZGxlYmFycztcblx0ICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgIEhhbmRsZWJhcnMubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIGlmIChyb290LkhhbmRsZWJhcnMgPT09IEhhbmRsZWJhcnMpIHtcblx0ICAgICAgcm9vdC5IYW5kbGViYXJzID0gJEhhbmRsZWJhcnM7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gSGFuZGxlYmFycztcblx0ICB9O1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSgpKSkpXG5cbi8qKiovIH0pLFxuLyogMzUgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0dmFyIEFTVCA9IHtcblx0ICAvLyBQdWJsaWMgQVBJIHVzZWQgdG8gZXZhbHVhdGUgZGVyaXZlZCBhdHRyaWJ1dGVzIHJlZ2FyZGluZyBBU1Qgbm9kZXNcblx0ICBoZWxwZXJzOiB7XG5cdCAgICAvLyBhIG11c3RhY2hlIGlzIGRlZmluaXRlbHkgYSBoZWxwZXIgaWY6XG5cdCAgICAvLyAqIGl0IGlzIGFuIGVsaWdpYmxlIGhlbHBlciwgYW5kXG5cdCAgICAvLyAqIGl0IGhhcyBhdCBsZWFzdCBvbmUgcGFyYW1ldGVyIG9yIGhhc2ggc2VnbWVudFxuXHQgICAgaGVscGVyRXhwcmVzc2lvbjogZnVuY3Rpb24gaGVscGVyRXhwcmVzc2lvbihub2RlKSB7XG5cdCAgICAgIHJldHVybiBub2RlLnR5cGUgPT09ICdTdWJFeHByZXNzaW9uJyB8fCAobm9kZS50eXBlID09PSAnTXVzdGFjaGVTdGF0ZW1lbnQnIHx8IG5vZGUudHlwZSA9PT0gJ0Jsb2NrU3RhdGVtZW50JykgJiYgISEobm9kZS5wYXJhbXMgJiYgbm9kZS5wYXJhbXMubGVuZ3RoIHx8IG5vZGUuaGFzaCk7XG5cdCAgICB9LFxuXG5cdCAgICBzY29wZWRJZDogZnVuY3Rpb24gc2NvcGVkSWQocGF0aCkge1xuXHQgICAgICByZXR1cm4gKC9eXFwufHRoaXNcXGIvLnRlc3QocGF0aC5vcmlnaW5hbClcblx0ICAgICAgKTtcblx0ICAgIH0sXG5cblx0ICAgIC8vIGFuIElEIGlzIHNpbXBsZSBpZiBpdCBvbmx5IGhhcyBvbmUgcGFydCwgYW5kIHRoYXQgcGFydCBpcyBub3Rcblx0ICAgIC8vIGAuLmAgb3IgYHRoaXNgLlxuXHQgICAgc2ltcGxlSWQ6IGZ1bmN0aW9uIHNpbXBsZUlkKHBhdGgpIHtcblx0ICAgICAgcmV0dXJuIHBhdGgucGFydHMubGVuZ3RoID09PSAxICYmICFBU1QuaGVscGVycy5zY29wZWRJZChwYXRoKSAmJiAhcGF0aC5kZXB0aDtcblx0ICAgIH1cblx0ICB9XG5cdH07XG5cblx0Ly8gTXVzdCBiZSBleHBvcnRlZCBhcyBhbiBvYmplY3QgcmF0aGVyIHRoYW4gdGhlIHJvb3Qgb2YgdGhlIG1vZHVsZSBhcyB0aGUgamlzb24gbGV4ZXJcblx0Ly8gbXVzdCBtb2RpZnkgdGhlIG9iamVjdCB0byBvcGVyYXRlIHByb3Blcmx5LlxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBBU1Q7XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDM2ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IF9fd2VicGFja19yZXF1aXJlX18oMylbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnBhcnNlID0gcGFyc2U7XG5cblx0dmFyIF9wYXJzZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM3KTtcblxuXHR2YXIgX3BhcnNlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wYXJzZXIpO1xuXG5cdHZhciBfd2hpdGVzcGFjZUNvbnRyb2wgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM4KTtcblxuXHR2YXIgX3doaXRlc3BhY2VDb250cm9sMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3doaXRlc3BhY2VDb250cm9sKTtcblxuXHR2YXIgX2hlbHBlcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQwKTtcblxuXHR2YXIgSGVscGVycyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9oZWxwZXJzKTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHRleHBvcnRzLnBhcnNlciA9IF9wYXJzZXIyWydkZWZhdWx0J107XG5cblx0dmFyIHl5ID0ge307XG5cdF91dGlscy5leHRlbmQoeXksIEhlbHBlcnMpO1xuXG5cdGZ1bmN0aW9uIHBhcnNlKGlucHV0LCBvcHRpb25zKSB7XG5cdCAgLy8gSnVzdCByZXR1cm4gaWYgYW4gYWxyZWFkeS1jb21waWxlZCBBU1Qgd2FzIHBhc3NlZCBpbi5cblx0ICBpZiAoaW5wdXQudHlwZSA9PT0gJ1Byb2dyYW0nKSB7XG5cdCAgICByZXR1cm4gaW5wdXQ7XG5cdCAgfVxuXG5cdCAgX3BhcnNlcjJbJ2RlZmF1bHQnXS55eSA9IHl5O1xuXG5cdCAgLy8gQWx0ZXJpbmcgdGhlIHNoYXJlZCBvYmplY3QgaGVyZSwgYnV0IHRoaXMgaXMgb2sgYXMgcGFyc2VyIGlzIGEgc3luYyBvcGVyYXRpb25cblx0ICB5eS5sb2NJbmZvID0gZnVuY3Rpb24gKGxvY0luZm8pIHtcblx0ICAgIHJldHVybiBuZXcgeXkuU291cmNlTG9jYXRpb24ob3B0aW9ucyAmJiBvcHRpb25zLnNyY05hbWUsIGxvY0luZm8pO1xuXHQgIH07XG5cblx0ICB2YXIgc3RyaXAgPSBuZXcgX3doaXRlc3BhY2VDb250cm9sMlsnZGVmYXVsdCddKG9wdGlvbnMpO1xuXHQgIHJldHVybiBzdHJpcC5hY2NlcHQoX3BhcnNlcjJbJ2RlZmF1bHQnXS5wYXJzZShpbnB1dCkpO1xuXHR9XG5cbi8qKiovIH0pLFxuLyogMzcgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvLyBGaWxlIGlnbm9yZWQgaW4gY292ZXJhZ2UgdGVzdHMgdmlhIHNldHRpbmcgaW4gLmlzdGFuYnVsLnltbFxuXHQvKiBKaXNvbiBnZW5lcmF0ZWQgcGFyc2VyICovXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdHZhciBoYW5kbGViYXJzID0gKGZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciBwYXJzZXIgPSB7IHRyYWNlOiBmdW5jdGlvbiB0cmFjZSgpIHt9LFxuXHQgICAgICAgIHl5OiB7fSxcblx0ICAgICAgICBzeW1ib2xzXzogeyBcImVycm9yXCI6IDIsIFwicm9vdFwiOiAzLCBcInByb2dyYW1cIjogNCwgXCJFT0ZcIjogNSwgXCJwcm9ncmFtX3JlcGV0aXRpb24wXCI6IDYsIFwic3RhdGVtZW50XCI6IDcsIFwibXVzdGFjaGVcIjogOCwgXCJibG9ja1wiOiA5LCBcInJhd0Jsb2NrXCI6IDEwLCBcInBhcnRpYWxcIjogMTEsIFwicGFydGlhbEJsb2NrXCI6IDEyLCBcImNvbnRlbnRcIjogMTMsIFwiQ09NTUVOVFwiOiAxNCwgXCJDT05URU5UXCI6IDE1LCBcIm9wZW5SYXdCbG9ja1wiOiAxNiwgXCJyYXdCbG9ja19yZXBldGl0aW9uX3BsdXMwXCI6IDE3LCBcIkVORF9SQVdfQkxPQ0tcIjogMTgsIFwiT1BFTl9SQVdfQkxPQ0tcIjogMTksIFwiaGVscGVyTmFtZVwiOiAyMCwgXCJvcGVuUmF3QmxvY2tfcmVwZXRpdGlvbjBcIjogMjEsIFwib3BlblJhd0Jsb2NrX29wdGlvbjBcIjogMjIsIFwiQ0xPU0VfUkFXX0JMT0NLXCI6IDIzLCBcIm9wZW5CbG9ja1wiOiAyNCwgXCJibG9ja19vcHRpb24wXCI6IDI1LCBcImNsb3NlQmxvY2tcIjogMjYsIFwib3BlbkludmVyc2VcIjogMjcsIFwiYmxvY2tfb3B0aW9uMVwiOiAyOCwgXCJPUEVOX0JMT0NLXCI6IDI5LCBcIm9wZW5CbG9ja19yZXBldGl0aW9uMFwiOiAzMCwgXCJvcGVuQmxvY2tfb3B0aW9uMFwiOiAzMSwgXCJvcGVuQmxvY2tfb3B0aW9uMVwiOiAzMiwgXCJDTE9TRVwiOiAzMywgXCJPUEVOX0lOVkVSU0VcIjogMzQsIFwib3BlbkludmVyc2VfcmVwZXRpdGlvbjBcIjogMzUsIFwib3BlbkludmVyc2Vfb3B0aW9uMFwiOiAzNiwgXCJvcGVuSW52ZXJzZV9vcHRpb24xXCI6IDM3LCBcIm9wZW5JbnZlcnNlQ2hhaW5cIjogMzgsIFwiT1BFTl9JTlZFUlNFX0NIQUlOXCI6IDM5LCBcIm9wZW5JbnZlcnNlQ2hhaW5fcmVwZXRpdGlvbjBcIjogNDAsIFwib3BlbkludmVyc2VDaGFpbl9vcHRpb24wXCI6IDQxLCBcIm9wZW5JbnZlcnNlQ2hhaW5fb3B0aW9uMVwiOiA0MiwgXCJpbnZlcnNlQW5kUHJvZ3JhbVwiOiA0MywgXCJJTlZFUlNFXCI6IDQ0LCBcImludmVyc2VDaGFpblwiOiA0NSwgXCJpbnZlcnNlQ2hhaW5fb3B0aW9uMFwiOiA0NiwgXCJPUEVOX0VOREJMT0NLXCI6IDQ3LCBcIk9QRU5cIjogNDgsIFwibXVzdGFjaGVfcmVwZXRpdGlvbjBcIjogNDksIFwibXVzdGFjaGVfb3B0aW9uMFwiOiA1MCwgXCJPUEVOX1VORVNDQVBFRFwiOiA1MSwgXCJtdXN0YWNoZV9yZXBldGl0aW9uMVwiOiA1MiwgXCJtdXN0YWNoZV9vcHRpb24xXCI6IDUzLCBcIkNMT1NFX1VORVNDQVBFRFwiOiA1NCwgXCJPUEVOX1BBUlRJQUxcIjogNTUsIFwicGFydGlhbE5hbWVcIjogNTYsIFwicGFydGlhbF9yZXBldGl0aW9uMFwiOiA1NywgXCJwYXJ0aWFsX29wdGlvbjBcIjogNTgsIFwib3BlblBhcnRpYWxCbG9ja1wiOiA1OSwgXCJPUEVOX1BBUlRJQUxfQkxPQ0tcIjogNjAsIFwib3BlblBhcnRpYWxCbG9ja19yZXBldGl0aW9uMFwiOiA2MSwgXCJvcGVuUGFydGlhbEJsb2NrX29wdGlvbjBcIjogNjIsIFwicGFyYW1cIjogNjMsIFwic2V4cHJcIjogNjQsIFwiT1BFTl9TRVhQUlwiOiA2NSwgXCJzZXhwcl9yZXBldGl0aW9uMFwiOiA2NiwgXCJzZXhwcl9vcHRpb24wXCI6IDY3LCBcIkNMT1NFX1NFWFBSXCI6IDY4LCBcImhhc2hcIjogNjksIFwiaGFzaF9yZXBldGl0aW9uX3BsdXMwXCI6IDcwLCBcImhhc2hTZWdtZW50XCI6IDcxLCBcIklEXCI6IDcyLCBcIkVRVUFMU1wiOiA3MywgXCJibG9ja1BhcmFtc1wiOiA3NCwgXCJPUEVOX0JMT0NLX1BBUkFNU1wiOiA3NSwgXCJibG9ja1BhcmFtc19yZXBldGl0aW9uX3BsdXMwXCI6IDc2LCBcIkNMT1NFX0JMT0NLX1BBUkFNU1wiOiA3NywgXCJwYXRoXCI6IDc4LCBcImRhdGFOYW1lXCI6IDc5LCBcIlNUUklOR1wiOiA4MCwgXCJOVU1CRVJcIjogODEsIFwiQk9PTEVBTlwiOiA4MiwgXCJVTkRFRklORURcIjogODMsIFwiTlVMTFwiOiA4NCwgXCJEQVRBXCI6IDg1LCBcInBhdGhTZWdtZW50c1wiOiA4NiwgXCJTRVBcIjogODcsIFwiJGFjY2VwdFwiOiAwLCBcIiRlbmRcIjogMSB9LFxuXHQgICAgICAgIHRlcm1pbmFsc186IHsgMjogXCJlcnJvclwiLCA1OiBcIkVPRlwiLCAxNDogXCJDT01NRU5UXCIsIDE1OiBcIkNPTlRFTlRcIiwgMTg6IFwiRU5EX1JBV19CTE9DS1wiLCAxOTogXCJPUEVOX1JBV19CTE9DS1wiLCAyMzogXCJDTE9TRV9SQVdfQkxPQ0tcIiwgMjk6IFwiT1BFTl9CTE9DS1wiLCAzMzogXCJDTE9TRVwiLCAzNDogXCJPUEVOX0lOVkVSU0VcIiwgMzk6IFwiT1BFTl9JTlZFUlNFX0NIQUlOXCIsIDQ0OiBcIklOVkVSU0VcIiwgNDc6IFwiT1BFTl9FTkRCTE9DS1wiLCA0ODogXCJPUEVOXCIsIDUxOiBcIk9QRU5fVU5FU0NBUEVEXCIsIDU0OiBcIkNMT1NFX1VORVNDQVBFRFwiLCA1NTogXCJPUEVOX1BBUlRJQUxcIiwgNjA6IFwiT1BFTl9QQVJUSUFMX0JMT0NLXCIsIDY1OiBcIk9QRU5fU0VYUFJcIiwgNjg6IFwiQ0xPU0VfU0VYUFJcIiwgNzI6IFwiSURcIiwgNzM6IFwiRVFVQUxTXCIsIDc1OiBcIk9QRU5fQkxPQ0tfUEFSQU1TXCIsIDc3OiBcIkNMT1NFX0JMT0NLX1BBUkFNU1wiLCA4MDogXCJTVFJJTkdcIiwgODE6IFwiTlVNQkVSXCIsIDgyOiBcIkJPT0xFQU5cIiwgODM6IFwiVU5ERUZJTkVEXCIsIDg0OiBcIk5VTExcIiwgODU6IFwiREFUQVwiLCA4NzogXCJTRVBcIiB9LFxuXHQgICAgICAgIHByb2R1Y3Rpb25zXzogWzAsIFszLCAyXSwgWzQsIDFdLCBbNywgMV0sIFs3LCAxXSwgWzcsIDFdLCBbNywgMV0sIFs3LCAxXSwgWzcsIDFdLCBbNywgMV0sIFsxMywgMV0sIFsxMCwgM10sIFsxNiwgNV0sIFs5LCA0XSwgWzksIDRdLCBbMjQsIDZdLCBbMjcsIDZdLCBbMzgsIDZdLCBbNDMsIDJdLCBbNDUsIDNdLCBbNDUsIDFdLCBbMjYsIDNdLCBbOCwgNV0sIFs4LCA1XSwgWzExLCA1XSwgWzEyLCAzXSwgWzU5LCA1XSwgWzYzLCAxXSwgWzYzLCAxXSwgWzY0LCA1XSwgWzY5LCAxXSwgWzcxLCAzXSwgWzc0LCAzXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzIwLCAxXSwgWzU2LCAxXSwgWzU2LCAxXSwgWzc5LCAyXSwgWzc4LCAxXSwgWzg2LCAzXSwgWzg2LCAxXSwgWzYsIDBdLCBbNiwgMl0sIFsxNywgMV0sIFsxNywgMl0sIFsyMSwgMF0sIFsyMSwgMl0sIFsyMiwgMF0sIFsyMiwgMV0sIFsyNSwgMF0sIFsyNSwgMV0sIFsyOCwgMF0sIFsyOCwgMV0sIFszMCwgMF0sIFszMCwgMl0sIFszMSwgMF0sIFszMSwgMV0sIFszMiwgMF0sIFszMiwgMV0sIFszNSwgMF0sIFszNSwgMl0sIFszNiwgMF0sIFszNiwgMV0sIFszNywgMF0sIFszNywgMV0sIFs0MCwgMF0sIFs0MCwgMl0sIFs0MSwgMF0sIFs0MSwgMV0sIFs0MiwgMF0sIFs0MiwgMV0sIFs0NiwgMF0sIFs0NiwgMV0sIFs0OSwgMF0sIFs0OSwgMl0sIFs1MCwgMF0sIFs1MCwgMV0sIFs1MiwgMF0sIFs1MiwgMl0sIFs1MywgMF0sIFs1MywgMV0sIFs1NywgMF0sIFs1NywgMl0sIFs1OCwgMF0sIFs1OCwgMV0sIFs2MSwgMF0sIFs2MSwgMl0sIFs2MiwgMF0sIFs2MiwgMV0sIFs2NiwgMF0sIFs2NiwgMl0sIFs2NywgMF0sIFs2NywgMV0sIFs3MCwgMV0sIFs3MCwgMl0sIFs3NiwgMV0sIFs3NiwgMl1dLFxuXHQgICAgICAgIHBlcmZvcm1BY3Rpb246IGZ1bmN0aW9uIGFub255bW91cyh5eXRleHQsIHl5bGVuZywgeXlsaW5lbm8sIHl5LCB5eXN0YXRlLCAkJCwgXyRcblx0ICAgICAgICAvKiovKSB7XG5cblx0ICAgICAgICAgICAgdmFyICQwID0gJCQubGVuZ3RoIC0gMTtcblx0ICAgICAgICAgICAgc3dpdGNoICh5eXN0YXRlKSB7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQkWyQwIC0gMV07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZVByb2dyYW0oJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA1OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDc6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdDb21tZW50U3RhdGVtZW50Jyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHl5LnN0cmlwQ29tbWVudCgkJFskMF0pLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdHJpcDogeXkuc3RyaXBGbGFncygkJFskMF0sICQkWyQwXSksXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKVxuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0ge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnQ29udGVudFN0YXRlbWVudCcsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiAkJFskMF0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAkJFskMF0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKVxuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTE6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZVJhd0Jsb2NrKCQkWyQwIC0gMl0sICQkWyQwIC0gMV0sICQkWyQwXSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEyOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgcGF0aDogJCRbJDAgLSAzXSwgcGFyYW1zOiAkJFskMCAtIDJdLCBoYXNoOiAkJFskMCAtIDFdIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEzOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVCbG9jaygkJFskMCAtIDNdLCAkJFskMCAtIDJdLCAkJFskMCAtIDFdLCAkJFskMF0sIGZhbHNlLCB0aGlzLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTQ6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZUJsb2NrKCQkWyQwIC0gM10sICQkWyQwIC0gMl0sICQkWyQwIC0gMV0sICQkWyQwXSwgdHJ1ZSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE1OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgb3BlbjogJCRbJDAgLSA1XSwgcGF0aDogJCRbJDAgLSA0XSwgcGFyYW1zOiAkJFskMCAtIDNdLCBoYXNoOiAkJFskMCAtIDJdLCBibG9ja1BhcmFtczogJCRbJDAgLSAxXSwgc3RyaXA6IHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSA1XSwgJCRbJDBdKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxNjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHBhdGg6ICQkWyQwIC0gNF0sIHBhcmFtczogJCRbJDAgLSAzXSwgaGFzaDogJCRbJDAgLSAyXSwgYmxvY2tQYXJhbXM6ICQkWyQwIC0gMV0sIHN0cmlwOiB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gNV0sICQkWyQwXSkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTc6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyBwYXRoOiAkJFskMCAtIDRdLCBwYXJhbXM6ICQkWyQwIC0gM10sIGhhc2g6ICQkWyQwIC0gMl0sIGJsb2NrUGFyYW1zOiAkJFskMCAtIDFdLCBzdHJpcDogeXkuc3RyaXBGbGFncygkJFskMCAtIDVdLCAkJFskMF0pIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgc3RyaXA6IHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSAxXSwgJCRbJDAgLSAxXSksIHByb2dyYW06ICQkWyQwXSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxOTpcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaW52ZXJzZSA9IHl5LnByZXBhcmVCbG9jaygkJFskMCAtIDJdLCAkJFskMCAtIDFdLCAkJFskMF0sICQkWyQwXSwgZmFsc2UsIHRoaXMuXyQpLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmFtID0geXkucHJlcGFyZVByb2dyYW0oW2ludmVyc2VdLCAkJFskMCAtIDFdLmxvYyk7XG5cdCAgICAgICAgICAgICAgICAgICAgcHJvZ3JhbS5jaGFpbmVkID0gdHJ1ZTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgc3RyaXA6ICQkWyQwIC0gMl0uc3RyaXAsIHByb2dyYW06IHByb2dyYW0sIGNoYWluOiB0cnVlIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyMTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHBhdGg6ICQkWyQwIC0gMV0sIHN0cmlwOiB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gMl0sICQkWyQwXSkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjI6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZU11c3RhY2hlKCQkWyQwIC0gM10sICQkWyQwIC0gMl0sICQkWyQwIC0gMV0sICQkWyQwIC0gNF0sIHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSA0XSwgJCRbJDBdKSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIzOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVNdXN0YWNoZSgkJFskMCAtIDNdLCAkJFskMCAtIDJdLCAkJFskMCAtIDFdLCAkJFskMCAtIDRdLCB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gNF0sICQkWyQwXSksIHRoaXMuXyQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyNDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQYXJ0aWFsU3RhdGVtZW50Jyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJCRbJDAgLSAzXSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiAkJFskMCAtIDJdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBoYXNoOiAkJFskMCAtIDFdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpbmRlbnQ6ICcnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdHJpcDogeXkuc3RyaXBGbGFncygkJFskMCAtIDRdLCAkJFskMF0pLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBsb2M6IHl5LmxvY0luZm8odGhpcy5fJClcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI1OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVQYXJ0aWFsQmxvY2soJCRbJDAgLSAyXSwgJCRbJDAgLSAxXSwgJCRbJDBdLCB0aGlzLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyBwYXRoOiAkJFskMCAtIDNdLCBwYXJhbXM6ICQkWyQwIC0gMl0sIGhhc2g6ICQkWyQwIC0gMV0sIHN0cmlwOiB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gNF0sICQkWyQwXSkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjc6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyODpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI5OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1N1YkV4cHJlc3Npb24nLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiAkJFskMCAtIDNdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6ICQkWyQwIC0gMl0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGhhc2g6ICQkWyQwIC0gMV0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKVxuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyB0eXBlOiAnSGFzaCcsIHBhaXJzOiAkJFskMF0sIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHR5cGU6ICdIYXNoUGFpcicsIGtleTogeXkuaWQoJCRbJDAgLSAyXSksIHZhbHVlOiAkJFskMF0sIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB5eS5pZCgkJFskMCAtIDFdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzM6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzNDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM1OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgdHlwZTogJ1N0cmluZ0xpdGVyYWwnLCB2YWx1ZTogJCRbJDBdLCBvcmlnaW5hbDogJCRbJDBdLCBsb2M6IHl5LmxvY0luZm8odGhpcy5fJCkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyB0eXBlOiAnTnVtYmVyTGl0ZXJhbCcsIHZhbHVlOiBOdW1iZXIoJCRbJDBdKSwgb3JpZ2luYWw6IE51bWJlcigkJFskMF0pLCBsb2M6IHl5LmxvY0luZm8odGhpcy5fJCkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzc6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyB0eXBlOiAnQm9vbGVhbkxpdGVyYWwnLCB2YWx1ZTogJCRbJDBdID09PSAndHJ1ZScsIG9yaWdpbmFsOiAkJFskMF0gPT09ICd0cnVlJywgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgdHlwZTogJ1VuZGVmaW5lZExpdGVyYWwnLCBvcmlnaW5hbDogdW5kZWZpbmVkLCB2YWx1ZTogdW5kZWZpbmVkLCBsb2M6IHl5LmxvY0luZm8odGhpcy5fJCkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzk6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyB0eXBlOiAnTnVsbExpdGVyYWwnLCBvcmlnaW5hbDogbnVsbCwgdmFsdWU6IG51bGwsIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0MDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQxOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDI6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZVBhdGgodHJ1ZSwgJCRbJDBdLCB0aGlzLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDM6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZVBhdGgoZmFsc2UsICQkWyQwXSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ0OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMl0ucHVzaCh7IHBhcnQ6IHl5LmlkKCQkWyQwXSksIG9yaWdpbmFsOiAkJFskMF0sIHNlcGFyYXRvcjogJCRbJDAgLSAxXSB9KTt0aGlzLiQgPSAkJFskMCAtIDJdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0NTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbeyBwYXJ0OiB5eS5pZCgkJFskMF0pLCBvcmlnaW5hbDogJCRbJDBdIH1dO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0Njpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDc6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFskJFskMF1dO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0OTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNTA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDUxOlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA1ODpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNTk6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDY0OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA2NTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNzA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDcxOlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA3ODpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNzk6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDgyOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA4Mzpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgODY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDg3OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA5MDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTE6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDk0OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA5NTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTg6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gWyQkWyQwXV07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDk5OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMDA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gWyQkWyQwXV07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEwMTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgdGFibGU6IFt7IDM6IDEsIDQ6IDIsIDU6IFsyLCA0Nl0sIDY6IDMsIDE0OiBbMiwgNDZdLCAxNTogWzIsIDQ2XSwgMTk6IFsyLCA0Nl0sIDI5OiBbMiwgNDZdLCAzNDogWzIsIDQ2XSwgNDg6IFsyLCA0Nl0sIDUxOiBbMiwgNDZdLCA1NTogWzIsIDQ2XSwgNjA6IFsyLCA0Nl0gfSwgeyAxOiBbM10gfSwgeyA1OiBbMSwgNF0gfSwgeyA1OiBbMiwgMl0sIDc6IDUsIDg6IDYsIDk6IDcsIDEwOiA4LCAxMTogOSwgMTI6IDEwLCAxMzogMTEsIDE0OiBbMSwgMTJdLCAxNTogWzEsIDIwXSwgMTY6IDE3LCAxOTogWzEsIDIzXSwgMjQ6IDE1LCAyNzogMTYsIDI5OiBbMSwgMjFdLCAzNDogWzEsIDIyXSwgMzk6IFsyLCAyXSwgNDQ6IFsyLCAyXSwgNDc6IFsyLCAyXSwgNDg6IFsxLCAxM10sIDUxOiBbMSwgMTRdLCA1NTogWzEsIDE4XSwgNTk6IDE5LCA2MDogWzEsIDI0XSB9LCB7IDE6IFsyLCAxXSB9LCB7IDU6IFsyLCA0N10sIDE0OiBbMiwgNDddLCAxNTogWzIsIDQ3XSwgMTk6IFsyLCA0N10sIDI5OiBbMiwgNDddLCAzNDogWzIsIDQ3XSwgMzk6IFsyLCA0N10sIDQ0OiBbMiwgNDddLCA0NzogWzIsIDQ3XSwgNDg6IFsyLCA0N10sIDUxOiBbMiwgNDddLCA1NTogWzIsIDQ3XSwgNjA6IFsyLCA0N10gfSwgeyA1OiBbMiwgM10sIDE0OiBbMiwgM10sIDE1OiBbMiwgM10sIDE5OiBbMiwgM10sIDI5OiBbMiwgM10sIDM0OiBbMiwgM10sIDM5OiBbMiwgM10sIDQ0OiBbMiwgM10sIDQ3OiBbMiwgM10sIDQ4OiBbMiwgM10sIDUxOiBbMiwgM10sIDU1OiBbMiwgM10sIDYwOiBbMiwgM10gfSwgeyA1OiBbMiwgNF0sIDE0OiBbMiwgNF0sIDE1OiBbMiwgNF0sIDE5OiBbMiwgNF0sIDI5OiBbMiwgNF0sIDM0OiBbMiwgNF0sIDM5OiBbMiwgNF0sIDQ0OiBbMiwgNF0sIDQ3OiBbMiwgNF0sIDQ4OiBbMiwgNF0sIDUxOiBbMiwgNF0sIDU1OiBbMiwgNF0sIDYwOiBbMiwgNF0gfSwgeyA1OiBbMiwgNV0sIDE0OiBbMiwgNV0sIDE1OiBbMiwgNV0sIDE5OiBbMiwgNV0sIDI5OiBbMiwgNV0sIDM0OiBbMiwgNV0sIDM5OiBbMiwgNV0sIDQ0OiBbMiwgNV0sIDQ3OiBbMiwgNV0sIDQ4OiBbMiwgNV0sIDUxOiBbMiwgNV0sIDU1OiBbMiwgNV0sIDYwOiBbMiwgNV0gfSwgeyA1OiBbMiwgNl0sIDE0OiBbMiwgNl0sIDE1OiBbMiwgNl0sIDE5OiBbMiwgNl0sIDI5OiBbMiwgNl0sIDM0OiBbMiwgNl0sIDM5OiBbMiwgNl0sIDQ0OiBbMiwgNl0sIDQ3OiBbMiwgNl0sIDQ4OiBbMiwgNl0sIDUxOiBbMiwgNl0sIDU1OiBbMiwgNl0sIDYwOiBbMiwgNl0gfSwgeyA1OiBbMiwgN10sIDE0OiBbMiwgN10sIDE1OiBbMiwgN10sIDE5OiBbMiwgN10sIDI5OiBbMiwgN10sIDM0OiBbMiwgN10sIDM5OiBbMiwgN10sIDQ0OiBbMiwgN10sIDQ3OiBbMiwgN10sIDQ4OiBbMiwgN10sIDUxOiBbMiwgN10sIDU1OiBbMiwgN10sIDYwOiBbMiwgN10gfSwgeyA1OiBbMiwgOF0sIDE0OiBbMiwgOF0sIDE1OiBbMiwgOF0sIDE5OiBbMiwgOF0sIDI5OiBbMiwgOF0sIDM0OiBbMiwgOF0sIDM5OiBbMiwgOF0sIDQ0OiBbMiwgOF0sIDQ3OiBbMiwgOF0sIDQ4OiBbMiwgOF0sIDUxOiBbMiwgOF0sIDU1OiBbMiwgOF0sIDYwOiBbMiwgOF0gfSwgeyA1OiBbMiwgOV0sIDE0OiBbMiwgOV0sIDE1OiBbMiwgOV0sIDE5OiBbMiwgOV0sIDI5OiBbMiwgOV0sIDM0OiBbMiwgOV0sIDM5OiBbMiwgOV0sIDQ0OiBbMiwgOV0sIDQ3OiBbMiwgOV0sIDQ4OiBbMiwgOV0sIDUxOiBbMiwgOV0sIDU1OiBbMiwgOV0sIDYwOiBbMiwgOV0gfSwgeyAyMDogMjUsIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDM2LCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDQ6IDM3LCA2OiAzLCAxNDogWzIsIDQ2XSwgMTU6IFsyLCA0Nl0sIDE5OiBbMiwgNDZdLCAyOTogWzIsIDQ2XSwgMzQ6IFsyLCA0Nl0sIDM5OiBbMiwgNDZdLCA0NDogWzIsIDQ2XSwgNDc6IFsyLCA0Nl0sIDQ4OiBbMiwgNDZdLCA1MTogWzIsIDQ2XSwgNTU6IFsyLCA0Nl0sIDYwOiBbMiwgNDZdIH0sIHsgNDogMzgsIDY6IDMsIDE0OiBbMiwgNDZdLCAxNTogWzIsIDQ2XSwgMTk6IFsyLCA0Nl0sIDI5OiBbMiwgNDZdLCAzNDogWzIsIDQ2XSwgNDQ6IFsyLCA0Nl0sIDQ3OiBbMiwgNDZdLCA0ODogWzIsIDQ2XSwgNTE6IFsyLCA0Nl0sIDU1OiBbMiwgNDZdLCA2MDogWzIsIDQ2XSB9LCB7IDEzOiA0MCwgMTU6IFsxLCAyMF0sIDE3OiAzOSB9LCB7IDIwOiA0MiwgNTY6IDQxLCA2NDogNDMsIDY1OiBbMSwgNDRdLCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDQ6IDQ1LCA2OiAzLCAxNDogWzIsIDQ2XSwgMTU6IFsyLCA0Nl0sIDE5OiBbMiwgNDZdLCAyOTogWzIsIDQ2XSwgMzQ6IFsyLCA0Nl0sIDQ3OiBbMiwgNDZdLCA0ODogWzIsIDQ2XSwgNTE6IFsyLCA0Nl0sIDU1OiBbMiwgNDZdLCA2MDogWzIsIDQ2XSB9LCB7IDU6IFsyLCAxMF0sIDE0OiBbMiwgMTBdLCAxNTogWzIsIDEwXSwgMTg6IFsyLCAxMF0sIDE5OiBbMiwgMTBdLCAyOTogWzIsIDEwXSwgMzQ6IFsyLCAxMF0sIDM5OiBbMiwgMTBdLCA0NDogWzIsIDEwXSwgNDc6IFsyLCAxMF0sIDQ4OiBbMiwgMTBdLCA1MTogWzIsIDEwXSwgNTU6IFsyLCAxMF0sIDYwOiBbMiwgMTBdIH0sIHsgMjA6IDQ2LCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDIwOiA0NywgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyMDogNDgsIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDQyLCA1NjogNDksIDY0OiA0MywgNjU6IFsxLCA0NF0sIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMzM6IFsyLCA3OF0sIDQ5OiA1MCwgNjU6IFsyLCA3OF0sIDcyOiBbMiwgNzhdLCA4MDogWzIsIDc4XSwgODE6IFsyLCA3OF0sIDgyOiBbMiwgNzhdLCA4MzogWzIsIDc4XSwgODQ6IFsyLCA3OF0sIDg1OiBbMiwgNzhdIH0sIHsgMjM6IFsyLCAzM10sIDMzOiBbMiwgMzNdLCA1NDogWzIsIDMzXSwgNjU6IFsyLCAzM10sIDY4OiBbMiwgMzNdLCA3MjogWzIsIDMzXSwgNzU6IFsyLCAzM10sIDgwOiBbMiwgMzNdLCA4MTogWzIsIDMzXSwgODI6IFsyLCAzM10sIDgzOiBbMiwgMzNdLCA4NDogWzIsIDMzXSwgODU6IFsyLCAzM10gfSwgeyAyMzogWzIsIDM0XSwgMzM6IFsyLCAzNF0sIDU0OiBbMiwgMzRdLCA2NTogWzIsIDM0XSwgNjg6IFsyLCAzNF0sIDcyOiBbMiwgMzRdLCA3NTogWzIsIDM0XSwgODA6IFsyLCAzNF0sIDgxOiBbMiwgMzRdLCA4MjogWzIsIDM0XSwgODM6IFsyLCAzNF0sIDg0OiBbMiwgMzRdLCA4NTogWzIsIDM0XSB9LCB7IDIzOiBbMiwgMzVdLCAzMzogWzIsIDM1XSwgNTQ6IFsyLCAzNV0sIDY1OiBbMiwgMzVdLCA2ODogWzIsIDM1XSwgNzI6IFsyLCAzNV0sIDc1OiBbMiwgMzVdLCA4MDogWzIsIDM1XSwgODE6IFsyLCAzNV0sIDgyOiBbMiwgMzVdLCA4MzogWzIsIDM1XSwgODQ6IFsyLCAzNV0sIDg1OiBbMiwgMzVdIH0sIHsgMjM6IFsyLCAzNl0sIDMzOiBbMiwgMzZdLCA1NDogWzIsIDM2XSwgNjU6IFsyLCAzNl0sIDY4OiBbMiwgMzZdLCA3MjogWzIsIDM2XSwgNzU6IFsyLCAzNl0sIDgwOiBbMiwgMzZdLCA4MTogWzIsIDM2XSwgODI6IFsyLCAzNl0sIDgzOiBbMiwgMzZdLCA4NDogWzIsIDM2XSwgODU6IFsyLCAzNl0gfSwgeyAyMzogWzIsIDM3XSwgMzM6IFsyLCAzN10sIDU0OiBbMiwgMzddLCA2NTogWzIsIDM3XSwgNjg6IFsyLCAzN10sIDcyOiBbMiwgMzddLCA3NTogWzIsIDM3XSwgODA6IFsyLCAzN10sIDgxOiBbMiwgMzddLCA4MjogWzIsIDM3XSwgODM6IFsyLCAzN10sIDg0OiBbMiwgMzddLCA4NTogWzIsIDM3XSB9LCB7IDIzOiBbMiwgMzhdLCAzMzogWzIsIDM4XSwgNTQ6IFsyLCAzOF0sIDY1OiBbMiwgMzhdLCA2ODogWzIsIDM4XSwgNzI6IFsyLCAzOF0sIDc1OiBbMiwgMzhdLCA4MDogWzIsIDM4XSwgODE6IFsyLCAzOF0sIDgyOiBbMiwgMzhdLCA4MzogWzIsIDM4XSwgODQ6IFsyLCAzOF0sIDg1OiBbMiwgMzhdIH0sIHsgMjM6IFsyLCAzOV0sIDMzOiBbMiwgMzldLCA1NDogWzIsIDM5XSwgNjU6IFsyLCAzOV0sIDY4OiBbMiwgMzldLCA3MjogWzIsIDM5XSwgNzU6IFsyLCAzOV0sIDgwOiBbMiwgMzldLCA4MTogWzIsIDM5XSwgODI6IFsyLCAzOV0sIDgzOiBbMiwgMzldLCA4NDogWzIsIDM5XSwgODU6IFsyLCAzOV0gfSwgeyAyMzogWzIsIDQzXSwgMzM6IFsyLCA0M10sIDU0OiBbMiwgNDNdLCA2NTogWzIsIDQzXSwgNjg6IFsyLCA0M10sIDcyOiBbMiwgNDNdLCA3NTogWzIsIDQzXSwgODA6IFsyLCA0M10sIDgxOiBbMiwgNDNdLCA4MjogWzIsIDQzXSwgODM6IFsyLCA0M10sIDg0OiBbMiwgNDNdLCA4NTogWzIsIDQzXSwgODc6IFsxLCA1MV0gfSwgeyA3MjogWzEsIDM1XSwgODY6IDUyIH0sIHsgMjM6IFsyLCA0NV0sIDMzOiBbMiwgNDVdLCA1NDogWzIsIDQ1XSwgNjU6IFsyLCA0NV0sIDY4OiBbMiwgNDVdLCA3MjogWzIsIDQ1XSwgNzU6IFsyLCA0NV0sIDgwOiBbMiwgNDVdLCA4MTogWzIsIDQ1XSwgODI6IFsyLCA0NV0sIDgzOiBbMiwgNDVdLCA4NDogWzIsIDQ1XSwgODU6IFsyLCA0NV0sIDg3OiBbMiwgNDVdIH0sIHsgNTI6IDUzLCA1NDogWzIsIDgyXSwgNjU6IFsyLCA4Ml0sIDcyOiBbMiwgODJdLCA4MDogWzIsIDgyXSwgODE6IFsyLCA4Ml0sIDgyOiBbMiwgODJdLCA4MzogWzIsIDgyXSwgODQ6IFsyLCA4Ml0sIDg1OiBbMiwgODJdIH0sIHsgMjU6IDU0LCAzODogNTYsIDM5OiBbMSwgNThdLCA0MzogNTcsIDQ0OiBbMSwgNTldLCA0NTogNTUsIDQ3OiBbMiwgNTRdIH0sIHsgMjg6IDYwLCA0MzogNjEsIDQ0OiBbMSwgNTldLCA0NzogWzIsIDU2XSB9LCB7IDEzOiA2MywgMTU6IFsxLCAyMF0sIDE4OiBbMSwgNjJdIH0sIHsgMTU6IFsyLCA0OF0sIDE4OiBbMiwgNDhdIH0sIHsgMzM6IFsyLCA4Nl0sIDU3OiA2NCwgNjU6IFsyLCA4Nl0sIDcyOiBbMiwgODZdLCA4MDogWzIsIDg2XSwgODE6IFsyLCA4Nl0sIDgyOiBbMiwgODZdLCA4MzogWzIsIDg2XSwgODQ6IFsyLCA4Nl0sIDg1OiBbMiwgODZdIH0sIHsgMzM6IFsyLCA0MF0sIDY1OiBbMiwgNDBdLCA3MjogWzIsIDQwXSwgODA6IFsyLCA0MF0sIDgxOiBbMiwgNDBdLCA4MjogWzIsIDQwXSwgODM6IFsyLCA0MF0sIDg0OiBbMiwgNDBdLCA4NTogWzIsIDQwXSB9LCB7IDMzOiBbMiwgNDFdLCA2NTogWzIsIDQxXSwgNzI6IFsyLCA0MV0sIDgwOiBbMiwgNDFdLCA4MTogWzIsIDQxXSwgODI6IFsyLCA0MV0sIDgzOiBbMiwgNDFdLCA4NDogWzIsIDQxXSwgODU6IFsyLCA0MV0gfSwgeyAyMDogNjUsIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjY6IDY2LCA0NzogWzEsIDY3XSB9LCB7IDMwOiA2OCwgMzM6IFsyLCA1OF0sIDY1OiBbMiwgNThdLCA3MjogWzIsIDU4XSwgNzU6IFsyLCA1OF0sIDgwOiBbMiwgNThdLCA4MTogWzIsIDU4XSwgODI6IFsyLCA1OF0sIDgzOiBbMiwgNThdLCA4NDogWzIsIDU4XSwgODU6IFsyLCA1OF0gfSwgeyAzMzogWzIsIDY0XSwgMzU6IDY5LCA2NTogWzIsIDY0XSwgNzI6IFsyLCA2NF0sIDc1OiBbMiwgNjRdLCA4MDogWzIsIDY0XSwgODE6IFsyLCA2NF0sIDgyOiBbMiwgNjRdLCA4MzogWzIsIDY0XSwgODQ6IFsyLCA2NF0sIDg1OiBbMiwgNjRdIH0sIHsgMjE6IDcwLCAyMzogWzIsIDUwXSwgNjU6IFsyLCA1MF0sIDcyOiBbMiwgNTBdLCA4MDogWzIsIDUwXSwgODE6IFsyLCA1MF0sIDgyOiBbMiwgNTBdLCA4MzogWzIsIDUwXSwgODQ6IFsyLCA1MF0sIDg1OiBbMiwgNTBdIH0sIHsgMzM6IFsyLCA5MF0sIDYxOiA3MSwgNjU6IFsyLCA5MF0sIDcyOiBbMiwgOTBdLCA4MDogWzIsIDkwXSwgODE6IFsyLCA5MF0sIDgyOiBbMiwgOTBdLCA4MzogWzIsIDkwXSwgODQ6IFsyLCA5MF0sIDg1OiBbMiwgOTBdIH0sIHsgMjA6IDc1LCAzMzogWzIsIDgwXSwgNTA6IDcyLCA2MzogNzMsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY5OiA3NCwgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgNzI6IFsxLCA4MF0gfSwgeyAyMzogWzIsIDQyXSwgMzM6IFsyLCA0Ml0sIDU0OiBbMiwgNDJdLCA2NTogWzIsIDQyXSwgNjg6IFsyLCA0Ml0sIDcyOiBbMiwgNDJdLCA3NTogWzIsIDQyXSwgODA6IFsyLCA0Ml0sIDgxOiBbMiwgNDJdLCA4MjogWzIsIDQyXSwgODM6IFsyLCA0Ml0sIDg0OiBbMiwgNDJdLCA4NTogWzIsIDQyXSwgODc6IFsxLCA1MV0gfSwgeyAyMDogNzUsIDUzOiA4MSwgNTQ6IFsyLCA4NF0sIDYzOiA4MiwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDgzLCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyNjogODQsIDQ3OiBbMSwgNjddIH0sIHsgNDc6IFsyLCA1NV0gfSwgeyA0OiA4NSwgNjogMywgMTQ6IFsyLCA0Nl0sIDE1OiBbMiwgNDZdLCAxOTogWzIsIDQ2XSwgMjk6IFsyLCA0Nl0sIDM0OiBbMiwgNDZdLCAzOTogWzIsIDQ2XSwgNDQ6IFsyLCA0Nl0sIDQ3OiBbMiwgNDZdLCA0ODogWzIsIDQ2XSwgNTE6IFsyLCA0Nl0sIDU1OiBbMiwgNDZdLCA2MDogWzIsIDQ2XSB9LCB7IDQ3OiBbMiwgMjBdIH0sIHsgMjA6IDg2LCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDQ6IDg3LCA2OiAzLCAxNDogWzIsIDQ2XSwgMTU6IFsyLCA0Nl0sIDE5OiBbMiwgNDZdLCAyOTogWzIsIDQ2XSwgMzQ6IFsyLCA0Nl0sIDQ3OiBbMiwgNDZdLCA0ODogWzIsIDQ2XSwgNTE6IFsyLCA0Nl0sIDU1OiBbMiwgNDZdLCA2MDogWzIsIDQ2XSB9LCB7IDI2OiA4OCwgNDc6IFsxLCA2N10gfSwgeyA0NzogWzIsIDU3XSB9LCB7IDU6IFsyLCAxMV0sIDE0OiBbMiwgMTFdLCAxNTogWzIsIDExXSwgMTk6IFsyLCAxMV0sIDI5OiBbMiwgMTFdLCAzNDogWzIsIDExXSwgMzk6IFsyLCAxMV0sIDQ0OiBbMiwgMTFdLCA0NzogWzIsIDExXSwgNDg6IFsyLCAxMV0sIDUxOiBbMiwgMTFdLCA1NTogWzIsIDExXSwgNjA6IFsyLCAxMV0gfSwgeyAxNTogWzIsIDQ5XSwgMTg6IFsyLCA0OV0gfSwgeyAyMDogNzUsIDMzOiBbMiwgODhdLCA1ODogODksIDYzOiA5MCwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDkxLCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyA2NTogWzIsIDk0XSwgNjY6IDkyLCA2ODogWzIsIDk0XSwgNzI6IFsyLCA5NF0sIDgwOiBbMiwgOTRdLCA4MTogWzIsIDk0XSwgODI6IFsyLCA5NF0sIDgzOiBbMiwgOTRdLCA4NDogWzIsIDk0XSwgODU6IFsyLCA5NF0gfSwgeyA1OiBbMiwgMjVdLCAxNDogWzIsIDI1XSwgMTU6IFsyLCAyNV0sIDE5OiBbMiwgMjVdLCAyOTogWzIsIDI1XSwgMzQ6IFsyLCAyNV0sIDM5OiBbMiwgMjVdLCA0NDogWzIsIDI1XSwgNDc6IFsyLCAyNV0sIDQ4OiBbMiwgMjVdLCA1MTogWzIsIDI1XSwgNTU6IFsyLCAyNV0sIDYwOiBbMiwgMjVdIH0sIHsgMjA6IDkzLCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDIwOiA3NSwgMzE6IDk0LCAzMzogWzIsIDYwXSwgNjM6IDk1LCA2NDogNzYsIDY1OiBbMSwgNDRdLCA2OTogOTYsIDcwOiA3NywgNzE6IDc4LCA3MjogWzEsIDc5XSwgNzU6IFsyLCA2MF0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyMDogNzUsIDMzOiBbMiwgNjZdLCAzNjogOTcsIDYzOiA5OCwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDk5LCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc1OiBbMiwgNjZdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDc1LCAyMjogMTAwLCAyMzogWzIsIDUyXSwgNjM6IDEwMSwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDEwMiwgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDc1LCAzMzogWzIsIDkyXSwgNjI6IDEwMywgNjM6IDEwNCwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDEwNSwgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMzM6IFsxLCAxMDZdIH0sIHsgMzM6IFsyLCA3OV0sIDY1OiBbMiwgNzldLCA3MjogWzIsIDc5XSwgODA6IFsyLCA3OV0sIDgxOiBbMiwgNzldLCA4MjogWzIsIDc5XSwgODM6IFsyLCA3OV0sIDg0OiBbMiwgNzldLCA4NTogWzIsIDc5XSB9LCB7IDMzOiBbMiwgODFdIH0sIHsgMjM6IFsyLCAyN10sIDMzOiBbMiwgMjddLCA1NDogWzIsIDI3XSwgNjU6IFsyLCAyN10sIDY4OiBbMiwgMjddLCA3MjogWzIsIDI3XSwgNzU6IFsyLCAyN10sIDgwOiBbMiwgMjddLCA4MTogWzIsIDI3XSwgODI6IFsyLCAyN10sIDgzOiBbMiwgMjddLCA4NDogWzIsIDI3XSwgODU6IFsyLCAyN10gfSwgeyAyMzogWzIsIDI4XSwgMzM6IFsyLCAyOF0sIDU0OiBbMiwgMjhdLCA2NTogWzIsIDI4XSwgNjg6IFsyLCAyOF0sIDcyOiBbMiwgMjhdLCA3NTogWzIsIDI4XSwgODA6IFsyLCAyOF0sIDgxOiBbMiwgMjhdLCA4MjogWzIsIDI4XSwgODM6IFsyLCAyOF0sIDg0OiBbMiwgMjhdLCA4NTogWzIsIDI4XSB9LCB7IDIzOiBbMiwgMzBdLCAzMzogWzIsIDMwXSwgNTQ6IFsyLCAzMF0sIDY4OiBbMiwgMzBdLCA3MTogMTA3LCA3MjogWzEsIDEwOF0sIDc1OiBbMiwgMzBdIH0sIHsgMjM6IFsyLCA5OF0sIDMzOiBbMiwgOThdLCA1NDogWzIsIDk4XSwgNjg6IFsyLCA5OF0sIDcyOiBbMiwgOThdLCA3NTogWzIsIDk4XSB9LCB7IDIzOiBbMiwgNDVdLCAzMzogWzIsIDQ1XSwgNTQ6IFsyLCA0NV0sIDY1OiBbMiwgNDVdLCA2ODogWzIsIDQ1XSwgNzI6IFsyLCA0NV0sIDczOiBbMSwgMTA5XSwgNzU6IFsyLCA0NV0sIDgwOiBbMiwgNDVdLCA4MTogWzIsIDQ1XSwgODI6IFsyLCA0NV0sIDgzOiBbMiwgNDVdLCA4NDogWzIsIDQ1XSwgODU6IFsyLCA0NV0sIDg3OiBbMiwgNDVdIH0sIHsgMjM6IFsyLCA0NF0sIDMzOiBbMiwgNDRdLCA1NDogWzIsIDQ0XSwgNjU6IFsyLCA0NF0sIDY4OiBbMiwgNDRdLCA3MjogWzIsIDQ0XSwgNzU6IFsyLCA0NF0sIDgwOiBbMiwgNDRdLCA4MTogWzIsIDQ0XSwgODI6IFsyLCA0NF0sIDgzOiBbMiwgNDRdLCA4NDogWzIsIDQ0XSwgODU6IFsyLCA0NF0sIDg3OiBbMiwgNDRdIH0sIHsgNTQ6IFsxLCAxMTBdIH0sIHsgNTQ6IFsyLCA4M10sIDY1OiBbMiwgODNdLCA3MjogWzIsIDgzXSwgODA6IFsyLCA4M10sIDgxOiBbMiwgODNdLCA4MjogWzIsIDgzXSwgODM6IFsyLCA4M10sIDg0OiBbMiwgODNdLCA4NTogWzIsIDgzXSB9LCB7IDU0OiBbMiwgODVdIH0sIHsgNTogWzIsIDEzXSwgMTQ6IFsyLCAxM10sIDE1OiBbMiwgMTNdLCAxOTogWzIsIDEzXSwgMjk6IFsyLCAxM10sIDM0OiBbMiwgMTNdLCAzOTogWzIsIDEzXSwgNDQ6IFsyLCAxM10sIDQ3OiBbMiwgMTNdLCA0ODogWzIsIDEzXSwgNTE6IFsyLCAxM10sIDU1OiBbMiwgMTNdLCA2MDogWzIsIDEzXSB9LCB7IDM4OiA1NiwgMzk6IFsxLCA1OF0sIDQzOiA1NywgNDQ6IFsxLCA1OV0sIDQ1OiAxMTIsIDQ2OiAxMTEsIDQ3OiBbMiwgNzZdIH0sIHsgMzM6IFsyLCA3MF0sIDQwOiAxMTMsIDY1OiBbMiwgNzBdLCA3MjogWzIsIDcwXSwgNzU6IFsyLCA3MF0sIDgwOiBbMiwgNzBdLCA4MTogWzIsIDcwXSwgODI6IFsyLCA3MF0sIDgzOiBbMiwgNzBdLCA4NDogWzIsIDcwXSwgODU6IFsyLCA3MF0gfSwgeyA0NzogWzIsIDE4XSB9LCB7IDU6IFsyLCAxNF0sIDE0OiBbMiwgMTRdLCAxNTogWzIsIDE0XSwgMTk6IFsyLCAxNF0sIDI5OiBbMiwgMTRdLCAzNDogWzIsIDE0XSwgMzk6IFsyLCAxNF0sIDQ0OiBbMiwgMTRdLCA0NzogWzIsIDE0XSwgNDg6IFsyLCAxNF0sIDUxOiBbMiwgMTRdLCA1NTogWzIsIDE0XSwgNjA6IFsyLCAxNF0gfSwgeyAzMzogWzEsIDExNF0gfSwgeyAzMzogWzIsIDg3XSwgNjU6IFsyLCA4N10sIDcyOiBbMiwgODddLCA4MDogWzIsIDg3XSwgODE6IFsyLCA4N10sIDgyOiBbMiwgODddLCA4MzogWzIsIDg3XSwgODQ6IFsyLCA4N10sIDg1OiBbMiwgODddIH0sIHsgMzM6IFsyLCA4OV0gfSwgeyAyMDogNzUsIDYzOiAxMTYsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY3OiAxMTUsIDY4OiBbMiwgOTZdLCA2OTogMTE3LCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAzMzogWzEsIDExOF0gfSwgeyAzMjogMTE5LCAzMzogWzIsIDYyXSwgNzQ6IDEyMCwgNzU6IFsxLCAxMjFdIH0sIHsgMzM6IFsyLCA1OV0sIDY1OiBbMiwgNTldLCA3MjogWzIsIDU5XSwgNzU6IFsyLCA1OV0sIDgwOiBbMiwgNTldLCA4MTogWzIsIDU5XSwgODI6IFsyLCA1OV0sIDgzOiBbMiwgNTldLCA4NDogWzIsIDU5XSwgODU6IFsyLCA1OV0gfSwgeyAzMzogWzIsIDYxXSwgNzU6IFsyLCA2MV0gfSwgeyAzMzogWzIsIDY4XSwgMzc6IDEyMiwgNzQ6IDEyMywgNzU6IFsxLCAxMjFdIH0sIHsgMzM6IFsyLCA2NV0sIDY1OiBbMiwgNjVdLCA3MjogWzIsIDY1XSwgNzU6IFsyLCA2NV0sIDgwOiBbMiwgNjVdLCA4MTogWzIsIDY1XSwgODI6IFsyLCA2NV0sIDgzOiBbMiwgNjVdLCA4NDogWzIsIDY1XSwgODU6IFsyLCA2NV0gfSwgeyAzMzogWzIsIDY3XSwgNzU6IFsyLCA2N10gfSwgeyAyMzogWzEsIDEyNF0gfSwgeyAyMzogWzIsIDUxXSwgNjU6IFsyLCA1MV0sIDcyOiBbMiwgNTFdLCA4MDogWzIsIDUxXSwgODE6IFsyLCA1MV0sIDgyOiBbMiwgNTFdLCA4MzogWzIsIDUxXSwgODQ6IFsyLCA1MV0sIDg1OiBbMiwgNTFdIH0sIHsgMjM6IFsyLCA1M10gfSwgeyAzMzogWzEsIDEyNV0gfSwgeyAzMzogWzIsIDkxXSwgNjU6IFsyLCA5MV0sIDcyOiBbMiwgOTFdLCA4MDogWzIsIDkxXSwgODE6IFsyLCA5MV0sIDgyOiBbMiwgOTFdLCA4MzogWzIsIDkxXSwgODQ6IFsyLCA5MV0sIDg1OiBbMiwgOTFdIH0sIHsgMzM6IFsyLCA5M10gfSwgeyA1OiBbMiwgMjJdLCAxNDogWzIsIDIyXSwgMTU6IFsyLCAyMl0sIDE5OiBbMiwgMjJdLCAyOTogWzIsIDIyXSwgMzQ6IFsyLCAyMl0sIDM5OiBbMiwgMjJdLCA0NDogWzIsIDIyXSwgNDc6IFsyLCAyMl0sIDQ4OiBbMiwgMjJdLCA1MTogWzIsIDIyXSwgNTU6IFsyLCAyMl0sIDYwOiBbMiwgMjJdIH0sIHsgMjM6IFsyLCA5OV0sIDMzOiBbMiwgOTldLCA1NDogWzIsIDk5XSwgNjg6IFsyLCA5OV0sIDcyOiBbMiwgOTldLCA3NTogWzIsIDk5XSB9LCB7IDczOiBbMSwgMTA5XSB9LCB7IDIwOiA3NSwgNjM6IDEyNiwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyA1OiBbMiwgMjNdLCAxNDogWzIsIDIzXSwgMTU6IFsyLCAyM10sIDE5OiBbMiwgMjNdLCAyOTogWzIsIDIzXSwgMzQ6IFsyLCAyM10sIDM5OiBbMiwgMjNdLCA0NDogWzIsIDIzXSwgNDc6IFsyLCAyM10sIDQ4OiBbMiwgMjNdLCA1MTogWzIsIDIzXSwgNTU6IFsyLCAyM10sIDYwOiBbMiwgMjNdIH0sIHsgNDc6IFsyLCAxOV0gfSwgeyA0NzogWzIsIDc3XSB9LCB7IDIwOiA3NSwgMzM6IFsyLCA3Ml0sIDQxOiAxMjcsIDYzOiAxMjgsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY5OiAxMjksIDcwOiA3NywgNzE6IDc4LCA3MjogWzEsIDc5XSwgNzU6IFsyLCA3Ml0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyA1OiBbMiwgMjRdLCAxNDogWzIsIDI0XSwgMTU6IFsyLCAyNF0sIDE5OiBbMiwgMjRdLCAyOTogWzIsIDI0XSwgMzQ6IFsyLCAyNF0sIDM5OiBbMiwgMjRdLCA0NDogWzIsIDI0XSwgNDc6IFsyLCAyNF0sIDQ4OiBbMiwgMjRdLCA1MTogWzIsIDI0XSwgNTU6IFsyLCAyNF0sIDYwOiBbMiwgMjRdIH0sIHsgNjg6IFsxLCAxMzBdIH0sIHsgNjU6IFsyLCA5NV0sIDY4OiBbMiwgOTVdLCA3MjogWzIsIDk1XSwgODA6IFsyLCA5NV0sIDgxOiBbMiwgOTVdLCA4MjogWzIsIDk1XSwgODM6IFsyLCA5NV0sIDg0OiBbMiwgOTVdLCA4NTogWzIsIDk1XSB9LCB7IDY4OiBbMiwgOTddIH0sIHsgNTogWzIsIDIxXSwgMTQ6IFsyLCAyMV0sIDE1OiBbMiwgMjFdLCAxOTogWzIsIDIxXSwgMjk6IFsyLCAyMV0sIDM0OiBbMiwgMjFdLCAzOTogWzIsIDIxXSwgNDQ6IFsyLCAyMV0sIDQ3OiBbMiwgMjFdLCA0ODogWzIsIDIxXSwgNTE6IFsyLCAyMV0sIDU1OiBbMiwgMjFdLCA2MDogWzIsIDIxXSB9LCB7IDMzOiBbMSwgMTMxXSB9LCB7IDMzOiBbMiwgNjNdIH0sIHsgNzI6IFsxLCAxMzNdLCA3NjogMTMyIH0sIHsgMzM6IFsxLCAxMzRdIH0sIHsgMzM6IFsyLCA2OV0gfSwgeyAxNTogWzIsIDEyXSB9LCB7IDE0OiBbMiwgMjZdLCAxNTogWzIsIDI2XSwgMTk6IFsyLCAyNl0sIDI5OiBbMiwgMjZdLCAzNDogWzIsIDI2XSwgNDc6IFsyLCAyNl0sIDQ4OiBbMiwgMjZdLCA1MTogWzIsIDI2XSwgNTU6IFsyLCAyNl0sIDYwOiBbMiwgMjZdIH0sIHsgMjM6IFsyLCAzMV0sIDMzOiBbMiwgMzFdLCA1NDogWzIsIDMxXSwgNjg6IFsyLCAzMV0sIDcyOiBbMiwgMzFdLCA3NTogWzIsIDMxXSB9LCB7IDMzOiBbMiwgNzRdLCA0MjogMTM1LCA3NDogMTM2LCA3NTogWzEsIDEyMV0gfSwgeyAzMzogWzIsIDcxXSwgNjU6IFsyLCA3MV0sIDcyOiBbMiwgNzFdLCA3NTogWzIsIDcxXSwgODA6IFsyLCA3MV0sIDgxOiBbMiwgNzFdLCA4MjogWzIsIDcxXSwgODM6IFsyLCA3MV0sIDg0OiBbMiwgNzFdLCA4NTogWzIsIDcxXSB9LCB7IDMzOiBbMiwgNzNdLCA3NTogWzIsIDczXSB9LCB7IDIzOiBbMiwgMjldLCAzMzogWzIsIDI5XSwgNTQ6IFsyLCAyOV0sIDY1OiBbMiwgMjldLCA2ODogWzIsIDI5XSwgNzI6IFsyLCAyOV0sIDc1OiBbMiwgMjldLCA4MDogWzIsIDI5XSwgODE6IFsyLCAyOV0sIDgyOiBbMiwgMjldLCA4MzogWzIsIDI5XSwgODQ6IFsyLCAyOV0sIDg1OiBbMiwgMjldIH0sIHsgMTQ6IFsyLCAxNV0sIDE1OiBbMiwgMTVdLCAxOTogWzIsIDE1XSwgMjk6IFsyLCAxNV0sIDM0OiBbMiwgMTVdLCAzOTogWzIsIDE1XSwgNDQ6IFsyLCAxNV0sIDQ3OiBbMiwgMTVdLCA0ODogWzIsIDE1XSwgNTE6IFsyLCAxNV0sIDU1OiBbMiwgMTVdLCA2MDogWzIsIDE1XSB9LCB7IDcyOiBbMSwgMTM4XSwgNzc6IFsxLCAxMzddIH0sIHsgNzI6IFsyLCAxMDBdLCA3NzogWzIsIDEwMF0gfSwgeyAxNDogWzIsIDE2XSwgMTU6IFsyLCAxNl0sIDE5OiBbMiwgMTZdLCAyOTogWzIsIDE2XSwgMzQ6IFsyLCAxNl0sIDQ0OiBbMiwgMTZdLCA0NzogWzIsIDE2XSwgNDg6IFsyLCAxNl0sIDUxOiBbMiwgMTZdLCA1NTogWzIsIDE2XSwgNjA6IFsyLCAxNl0gfSwgeyAzMzogWzEsIDEzOV0gfSwgeyAzMzogWzIsIDc1XSB9LCB7IDMzOiBbMiwgMzJdIH0sIHsgNzI6IFsyLCAxMDFdLCA3NzogWzIsIDEwMV0gfSwgeyAxNDogWzIsIDE3XSwgMTU6IFsyLCAxN10sIDE5OiBbMiwgMTddLCAyOTogWzIsIDE3XSwgMzQ6IFsyLCAxN10sIDM5OiBbMiwgMTddLCA0NDogWzIsIDE3XSwgNDc6IFsyLCAxN10sIDQ4OiBbMiwgMTddLCA1MTogWzIsIDE3XSwgNTU6IFsyLCAxN10sIDYwOiBbMiwgMTddIH1dLFxuXHQgICAgICAgIGRlZmF1bHRBY3Rpb25zOiB7IDQ6IFsyLCAxXSwgNTU6IFsyLCA1NV0sIDU3OiBbMiwgMjBdLCA2MTogWzIsIDU3XSwgNzQ6IFsyLCA4MV0sIDgzOiBbMiwgODVdLCA4NzogWzIsIDE4XSwgOTE6IFsyLCA4OV0sIDEwMjogWzIsIDUzXSwgMTA1OiBbMiwgOTNdLCAxMTE6IFsyLCAxOV0sIDExMjogWzIsIDc3XSwgMTE3OiBbMiwgOTddLCAxMjA6IFsyLCA2M10sIDEyMzogWzIsIDY5XSwgMTI0OiBbMiwgMTJdLCAxMzY6IFsyLCA3NV0sIDEzNzogWzIsIDMyXSB9LFxuXHQgICAgICAgIHBhcnNlRXJyb3I6IGZ1bmN0aW9uIHBhcnNlRXJyb3Ioc3RyLCBoYXNoKSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzdHIpO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIHBhcnNlKGlucHV0KSB7XG5cdCAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcblx0ICAgICAgICAgICAgICAgIHN0YWNrID0gWzBdLFxuXHQgICAgICAgICAgICAgICAgdnN0YWNrID0gW251bGxdLFxuXHQgICAgICAgICAgICAgICAgbHN0YWNrID0gW10sXG5cdCAgICAgICAgICAgICAgICB0YWJsZSA9IHRoaXMudGFibGUsXG5cdCAgICAgICAgICAgICAgICB5eXRleHQgPSBcIlwiLFxuXHQgICAgICAgICAgICAgICAgeXlsaW5lbm8gPSAwLFxuXHQgICAgICAgICAgICAgICAgeXlsZW5nID0gMCxcblx0ICAgICAgICAgICAgICAgIHJlY292ZXJpbmcgPSAwLFxuXHQgICAgICAgICAgICAgICAgVEVSUk9SID0gMixcblx0ICAgICAgICAgICAgICAgIEVPRiA9IDE7XG5cdCAgICAgICAgICAgIHRoaXMubGV4ZXIuc2V0SW5wdXQoaW5wdXQpO1xuXHQgICAgICAgICAgICB0aGlzLmxleGVyLnl5ID0gdGhpcy55eTtcblx0ICAgICAgICAgICAgdGhpcy55eS5sZXhlciA9IHRoaXMubGV4ZXI7XG5cdCAgICAgICAgICAgIHRoaXMueXkucGFyc2VyID0gdGhpcztcblx0ICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmxleGVyLnl5bGxvYyA9PSBcInVuZGVmaW5lZFwiKSB0aGlzLmxleGVyLnl5bGxvYyA9IHt9O1xuXHQgICAgICAgICAgICB2YXIgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcblx0ICAgICAgICAgICAgbHN0YWNrLnB1c2goeXlsb2MpO1xuXHQgICAgICAgICAgICB2YXIgcmFuZ2VzID0gdGhpcy5sZXhlci5vcHRpb25zICYmIHRoaXMubGV4ZXIub3B0aW9ucy5yYW5nZXM7XG5cdCAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy55eS5wYXJzZUVycm9yID09PSBcImZ1bmN0aW9uXCIpIHRoaXMucGFyc2VFcnJvciA9IHRoaXMueXkucGFyc2VFcnJvcjtcblx0ICAgICAgICAgICAgZnVuY3Rpb24gcG9wU3RhY2sobikge1xuXHQgICAgICAgICAgICAgICAgc3RhY2subGVuZ3RoID0gc3RhY2subGVuZ3RoIC0gMiAqIG47XG5cdCAgICAgICAgICAgICAgICB2c3RhY2subGVuZ3RoID0gdnN0YWNrLmxlbmd0aCAtIG47XG5cdCAgICAgICAgICAgICAgICBsc3RhY2subGVuZ3RoID0gbHN0YWNrLmxlbmd0aCAtIG47XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZnVuY3Rpb24gbGV4KCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIHRva2VuO1xuXHQgICAgICAgICAgICAgICAgdG9rZW4gPSBzZWxmLmxleGVyLmxleCgpIHx8IDE7XG5cdCAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRva2VuICE9PSBcIm51bWJlclwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBzZWxmLnN5bWJvbHNfW3Rva2VuXSB8fCB0b2tlbjtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB2YXIgc3ltYm9sLFxuXHQgICAgICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wsXG5cdCAgICAgICAgICAgICAgICBzdGF0ZSxcblx0ICAgICAgICAgICAgICAgIGFjdGlvbixcblx0ICAgICAgICAgICAgICAgIGEsXG5cdCAgICAgICAgICAgICAgICByLFxuXHQgICAgICAgICAgICAgICAgeXl2YWwgPSB7fSxcblx0ICAgICAgICAgICAgICAgIHAsXG5cdCAgICAgICAgICAgICAgICBsZW4sXG5cdCAgICAgICAgICAgICAgICBuZXdTdGF0ZSxcblx0ICAgICAgICAgICAgICAgIGV4cGVjdGVkO1xuXHQgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuXHQgICAgICAgICAgICAgICAgc3RhdGUgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRBY3Rpb25zW3N0YXRlXSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IHRoaXMuZGVmYXVsdEFjdGlvbnNbc3RhdGVdO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoc3ltYm9sID09PSBudWxsIHx8IHR5cGVvZiBzeW1ib2wgPT0gXCJ1bmRlZmluZWRcIikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBsZXgoKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gdGFibGVbc3RhdGVdICYmIHRhYmxlW3N0YXRlXVtzeW1ib2xdO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09IFwidW5kZWZpbmVkXCIgfHwgIWFjdGlvbi5sZW5ndGggfHwgIWFjdGlvblswXSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBlcnJTdHIgPSBcIlwiO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICghcmVjb3ZlcmluZykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHAgaW4gdGFibGVbc3RhdGVdKSBpZiAodGhpcy50ZXJtaW5hbHNfW3BdICYmIHAgPiAyKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZC5wdXNoKFwiJ1wiICsgdGhpcy50ZXJtaW5hbHNfW3BdICsgXCInXCIpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnNob3dQb3NpdGlvbikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gXCJQYXJzZSBlcnJvciBvbiBsaW5lIFwiICsgKHl5bGluZW5vICsgMSkgKyBcIjpcXG5cIiArIHRoaXMubGV4ZXIuc2hvd1Bvc2l0aW9uKCkgKyBcIlxcbkV4cGVjdGluZyBcIiArIGV4cGVjdGVkLmpvaW4oXCIsIFwiKSArIFwiLCBnb3QgJ1wiICsgKHRoaXMudGVybWluYWxzX1tzeW1ib2xdIHx8IHN5bWJvbCkgKyBcIidcIjtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyclN0ciA9IFwiUGFyc2UgZXJyb3Igb24gbGluZSBcIiArICh5eWxpbmVubyArIDEpICsgXCI6IFVuZXhwZWN0ZWQgXCIgKyAoc3ltYm9sID09IDEgPyBcImVuZCBvZiBpbnB1dFwiIDogXCInXCIgKyAodGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sKSArIFwiJ1wiKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRXJyb3IoZXJyU3RyLCB7IHRleHQ6IHRoaXMubGV4ZXIubWF0Y2gsIHRva2VuOiB0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wsIGxpbmU6IHRoaXMubGV4ZXIueXlsaW5lbm8sIGxvYzogeXlsb2MsIGV4cGVjdGVkOiBleHBlY3RlZCB9KTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAoYWN0aW9uWzBdIGluc3RhbmNlb2YgQXJyYXkgJiYgYWN0aW9uLmxlbmd0aCA+IDEpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXJzZSBFcnJvcjogbXVsdGlwbGUgYWN0aW9ucyBwb3NzaWJsZSBhdCBzdGF0ZTogXCIgKyBzdGF0ZSArIFwiLCB0b2tlbjogXCIgKyBzeW1ib2wpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgc3dpdGNoIChhY3Rpb25bMF0pIHtcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3ltYm9sKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdnN0YWNrLnB1c2godGhpcy5sZXhlci55eXRleHQpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBsc3RhY2sucHVzaCh0aGlzLmxleGVyLnl5bGxvYyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYWN0aW9uWzFdKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwcmVFcnJvclN5bWJvbCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgeXlsZW5nID0gdGhpcy5sZXhlci55eWxlbmc7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB5eXRleHQgPSB0aGlzLmxleGVyLnl5dGV4dDtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHl5bGluZW5vID0gdGhpcy5sZXhlci55eWxpbmVubztcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHl5bG9jID0gdGhpcy5sZXhlci55eWxsb2M7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVjb3ZlcmluZyA+IDApIHJlY292ZXJpbmctLTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IHByZUVycm9yU3ltYm9sO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wgPSBudWxsO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbGVuID0gdGhpcy5wcm9kdWN0aW9uc19bYWN0aW9uWzFdXVsxXTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeXl2YWwuJCA9IHZzdGFja1t2c3RhY2subGVuZ3RoIC0gbGVuXTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeXl2YWwuXyQgPSB7IGZpcnN0X2xpbmU6IGxzdGFja1tsc3RhY2subGVuZ3RoIC0gKGxlbiB8fCAxKV0uZmlyc3RfbGluZSwgbGFzdF9saW5lOiBsc3RhY2tbbHN0YWNrLmxlbmd0aCAtIDFdLmxhc3RfbGluZSwgZmlyc3RfY29sdW1uOiBsc3RhY2tbbHN0YWNrLmxlbmd0aCAtIChsZW4gfHwgMSldLmZpcnN0X2NvbHVtbiwgbGFzdF9jb2x1bW46IGxzdGFja1tsc3RhY2subGVuZ3RoIC0gMV0ubGFzdF9jb2x1bW4gfTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlcykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgeXl2YWwuXyQucmFuZ2UgPSBbbHN0YWNrW2xzdGFjay5sZW5ndGggLSAobGVuIHx8IDEpXS5yYW5nZVswXSwgbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5yYW5nZVsxXV07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgciA9IHRoaXMucGVyZm9ybUFjdGlvbi5jYWxsKHl5dmFsLCB5eXRleHQsIHl5bGVuZywgeXlsaW5lbm8sIHRoaXMueXksIGFjdGlvblsxXSwgdnN0YWNrLCBsc3RhY2spO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHIgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZW4pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrID0gc3RhY2suc2xpY2UoMCwgLTEgKiBsZW4gKiAyKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZzdGFjayA9IHZzdGFjay5zbGljZSgwLCAtMSAqIGxlbik7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBsc3RhY2sgPSBsc3RhY2suc2xpY2UoMCwgLTEgKiBsZW4pO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godGhpcy5wcm9kdWN0aW9uc19bYWN0aW9uWzFdXVswXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZzdGFjay5wdXNoKHl5dmFsLiQpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBsc3RhY2sucHVzaCh5eXZhbC5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlID0gdGFibGVbc3RhY2tbc3RhY2subGVuZ3RoIC0gMl1dW3N0YWNrW3N0YWNrLmxlbmd0aCAtIDFdXTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXdTdGF0ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0ICAgIC8qIEppc29uIGdlbmVyYXRlZCBsZXhlciAqL1xuXHQgICAgdmFyIGxleGVyID0gKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICB2YXIgbGV4ZXIgPSB7IEVPRjogMSxcblx0ICAgICAgICAgICAgcGFyc2VFcnJvcjogZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLnl5LnBhcnNlcikge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXkucGFyc2VyLnBhcnNlRXJyb3Ioc3RyLCBoYXNoKTtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0cik7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHNldElucHV0OiBmdW5jdGlvbiBzZXRJbnB1dChpbnB1dCkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcblx0ICAgICAgICAgICAgICAgIHRoaXMuX21vcmUgPSB0aGlzLl9sZXNzID0gdGhpcy5kb25lID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnl5bGluZW5vID0gdGhpcy55eWxlbmcgPSAwO1xuXHQgICAgICAgICAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLm1hdGNoZWQgPSB0aGlzLm1hdGNoID0gJyc7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbmRpdGlvblN0YWNrID0gWydJTklUSUFMJ107XG5cdCAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYyA9IHsgZmlyc3RfbGluZTogMSwgZmlyc3RfY29sdW1uOiAwLCBsYXN0X2xpbmU6IDEsIGxhc3RfY29sdW1uOiAwIH07XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykgdGhpcy55eWxsb2MucmFuZ2UgPSBbMCwgMF07XG5cdCAgICAgICAgICAgICAgICB0aGlzLm9mZnNldCA9IDA7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaW5wdXQ6IGZ1bmN0aW9uIGlucHV0KCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIGNoID0gdGhpcy5faW5wdXRbMF07XG5cdCAgICAgICAgICAgICAgICB0aGlzLnl5dGV4dCArPSBjaDtcblx0ICAgICAgICAgICAgICAgIHRoaXMueXlsZW5nKys7XG5cdCAgICAgICAgICAgICAgICB0aGlzLm9mZnNldCsrO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5tYXRjaCArPSBjaDtcblx0ICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlZCArPSBjaDtcblx0ICAgICAgICAgICAgICAgIHZhciBsaW5lcyA9IGNoLm1hdGNoKC8oPzpcXHJcXG4/fFxcbikuKi9nKTtcblx0ICAgICAgICAgICAgICAgIGlmIChsaW5lcykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXlsaW5lbm8rKztcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYy5sYXN0X2xpbmUrKztcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eWxsb2MubGFzdF9jb2x1bW4rKztcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZ2VzKSB0aGlzLnl5bGxvYy5yYW5nZVsxXSsrO1xuXG5cdCAgICAgICAgICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKDEpO1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGNoO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICB1bnB1dDogZnVuY3Rpb24gdW5wdXQoY2gpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBsZW4gPSBjaC5sZW5ndGg7XG5cdCAgICAgICAgICAgICAgICB2YXIgbGluZXMgPSBjaC5zcGxpdCgvKD86XFxyXFxuP3xcXG4pL2cpO1xuXG5cdCAgICAgICAgICAgICAgICB0aGlzLl9pbnB1dCA9IGNoICsgdGhpcy5faW5wdXQ7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnl5dGV4dCA9IHRoaXMueXl0ZXh0LnN1YnN0cigwLCB0aGlzLnl5dGV4dC5sZW5ndGggLSBsZW4gLSAxKTtcblx0ICAgICAgICAgICAgICAgIC8vdGhpcy55eWxlbmcgLT0gbGVuO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5vZmZzZXQgLT0gbGVuO1xuXHQgICAgICAgICAgICAgICAgdmFyIG9sZExpbmVzID0gdGhpcy5tYXRjaC5zcGxpdCgvKD86XFxyXFxuP3xcXG4pL2cpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5tYXRjaCA9IHRoaXMubWF0Y2guc3Vic3RyKDAsIHRoaXMubWF0Y2gubGVuZ3RoIC0gMSk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLm1hdGNoZWQgPSB0aGlzLm1hdGNoZWQuc3Vic3RyKDAsIHRoaXMubWF0Y2hlZC5sZW5ndGggLSAxKTtcblxuXHQgICAgICAgICAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCAtIDEpIHRoaXMueXlsaW5lbm8gLT0gbGluZXMubGVuZ3RoIC0gMTtcblx0ICAgICAgICAgICAgICAgIHZhciByID0gdGhpcy55eWxsb2MucmFuZ2U7XG5cblx0ICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jID0geyBmaXJzdF9saW5lOiB0aGlzLnl5bGxvYy5maXJzdF9saW5lLFxuXHQgICAgICAgICAgICAgICAgICAgIGxhc3RfbGluZTogdGhpcy55eWxpbmVubyArIDEsXG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5maXJzdF9jb2x1bW4sXG5cdCAgICAgICAgICAgICAgICAgICAgbGFzdF9jb2x1bW46IGxpbmVzID8gKGxpbmVzLmxlbmd0aCA9PT0gb2xkTGluZXMubGVuZ3RoID8gdGhpcy55eWxsb2MuZmlyc3RfY29sdW1uIDogMCkgKyBvbGRMaW5lc1tvbGRMaW5lcy5sZW5ndGggLSBsaW5lcy5sZW5ndGhdLmxlbmd0aCAtIGxpbmVzWzBdLmxlbmd0aCA6IHRoaXMueXlsbG9jLmZpcnN0X2NvbHVtbiAtIGxlblxuXHQgICAgICAgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYy5yYW5nZSA9IFtyWzBdLCByWzBdICsgdGhpcy55eWxlbmcgLSBsZW5dO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG1vcmU6IGZ1bmN0aW9uIG1vcmUoKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLl9tb3JlID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBsZXNzOiBmdW5jdGlvbiBsZXNzKG4pIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMudW5wdXQodGhpcy5tYXRjaC5zbGljZShuKSk7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHBhc3RJbnB1dDogZnVuY3Rpb24gcGFzdElucHV0KCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIHBhc3QgPSB0aGlzLm1hdGNoZWQuc3Vic3RyKDAsIHRoaXMubWF0Y2hlZC5sZW5ndGggLSB0aGlzLm1hdGNoLmxlbmd0aCk7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gKHBhc3QubGVuZ3RoID4gMjAgPyAnLi4uJyA6ICcnKSArIHBhc3Quc3Vic3RyKC0yMCkucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICB1cGNvbWluZ0lucHV0OiBmdW5jdGlvbiB1cGNvbWluZ0lucHV0KCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIG5leHQgPSB0aGlzLm1hdGNoO1xuXHQgICAgICAgICAgICAgICAgaWYgKG5leHQubGVuZ3RoIDwgMjApIHtcblx0ICAgICAgICAgICAgICAgICAgICBuZXh0ICs9IHRoaXMuX2lucHV0LnN1YnN0cigwLCAyMCAtIG5leHQubGVuZ3RoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIHJldHVybiAobmV4dC5zdWJzdHIoMCwgMjApICsgKG5leHQubGVuZ3RoID4gMjAgPyAnLi4uJyA6ICcnKSkucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBzaG93UG9zaXRpb246IGZ1bmN0aW9uIHNob3dQb3NpdGlvbigpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBwcmUgPSB0aGlzLnBhc3RJbnB1dCgpO1xuXHQgICAgICAgICAgICAgICAgdmFyIGMgPSBuZXcgQXJyYXkocHJlLmxlbmd0aCArIDEpLmpvaW4oXCItXCIpO1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHByZSArIHRoaXMudXBjb21pbmdJbnB1dCgpICsgXCJcXG5cIiArIGMgKyBcIl5cIjtcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dCgpIHtcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvbmUpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5FT0Y7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2lucHV0KSB0aGlzLmRvbmUgPSB0cnVlO1xuXG5cdCAgICAgICAgICAgICAgICB2YXIgdG9rZW4sIG1hdGNoLCB0ZW1wTWF0Y2gsIGluZGV4LCBjb2wsIGxpbmVzO1xuXHQgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9tb3JlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eXRleHQgPSAnJztcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGNoID0gJyc7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB2YXIgcnVsZXMgPSB0aGlzLl9jdXJyZW50UnVsZXMoKTtcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgICAgICB0ZW1wTWF0Y2ggPSB0aGlzLl9pbnB1dC5tYXRjaCh0aGlzLnJ1bGVzW3J1bGVzW2ldXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXBNYXRjaCAmJiAoIW1hdGNoIHx8IHRlbXBNYXRjaFswXS5sZW5ndGggPiBtYXRjaFswXS5sZW5ndGgpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gdGVtcE1hdGNoO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmZsZXgpIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGxpbmVzID0gbWF0Y2hbMF0ubWF0Y2goLyg/Olxcclxcbj98XFxuKS4qL2cpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmIChsaW5lcykgdGhpcy55eWxpbmVubyArPSBsaW5lcy5sZW5ndGg7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eWxsb2MgPSB7IGZpcnN0X2xpbmU6IHRoaXMueXlsbG9jLmxhc3RfbGluZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9saW5lOiB0aGlzLnl5bGluZW5vICsgMSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9jb2x1bW46IGxpbmVzID8gbGluZXNbbGluZXMubGVuZ3RoIC0gMV0ubGVuZ3RoIC0gbGluZXNbbGluZXMubGVuZ3RoIC0gMV0ubWF0Y2goL1xccj9cXG4/LylbMF0ubGVuZ3RoIDogdGhpcy55eWxsb2MubGFzdF9jb2x1bW4gKyBtYXRjaFswXS5sZW5ndGggfTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5dGV4dCArPSBtYXRjaFswXTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGNoICs9IG1hdGNoWzBdO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlcyA9IG1hdGNoO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXlsZW5nID0gdGhpcy55eXRleHQubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZ2VzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jLnJhbmdlID0gW3RoaXMub2Zmc2V0LCB0aGlzLm9mZnNldCArPSB0aGlzLnl5bGVuZ107XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX21vcmUgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKG1hdGNoWzBdLmxlbmd0aCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRjaGVkICs9IG1hdGNoWzBdO1xuXHQgICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5wZXJmb3JtQWN0aW9uLmNhbGwodGhpcywgdGhpcy55eSwgdGhpcywgcnVsZXNbaW5kZXhdLCB0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoIC0gMV0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvbmUgJiYgdGhpcy5faW5wdXQpIHRoaXMuZG9uZSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikgcmV0dXJuIHRva2VuO2Vsc2UgcmV0dXJuO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lucHV0ID09PSBcIlwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuRU9GO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUVycm9yKCdMZXhpY2FsIGVycm9yIG9uIGxpbmUgJyArICh0aGlzLnl5bGluZW5vICsgMSkgKyAnLiBVbnJlY29nbml6ZWQgdGV4dC5cXG4nICsgdGhpcy5zaG93UG9zaXRpb24oKSwgeyB0ZXh0OiBcIlwiLCB0b2tlbjogbnVsbCwgbGluZTogdGhpcy55eWxpbmVubyB9KTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgbGV4OiBmdW5jdGlvbiBsZXgoKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgciA9IHRoaXMubmV4dCgpO1xuXHQgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiByO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZXgoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgYmVnaW46IGZ1bmN0aW9uIGJlZ2luKGNvbmRpdGlvbikge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5jb25kaXRpb25TdGFjay5wdXNoKGNvbmRpdGlvbik7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHBvcFN0YXRlOiBmdW5jdGlvbiBwb3BTdGF0ZSgpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvblN0YWNrLnBvcCgpO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfY3VycmVudFJ1bGVzOiBmdW5jdGlvbiBfY3VycmVudFJ1bGVzKCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uc1t0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoIC0gMV1dLnJ1bGVzO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICB0b3BTdGF0ZTogZnVuY3Rpb24gdG9wU3RhdGUoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDJdO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBwdXNoU3RhdGU6IGZ1bmN0aW9uIGJlZ2luKGNvbmRpdGlvbikge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5iZWdpbihjb25kaXRpb24pO1xuXHQgICAgICAgICAgICB9IH07XG5cdCAgICAgICAgbGV4ZXIub3B0aW9ucyA9IHt9O1xuXHQgICAgICAgIGxleGVyLnBlcmZvcm1BY3Rpb24gPSBmdW5jdGlvbiBhbm9ueW1vdXMoeXksIHl5XywgJGF2b2lkaW5nX25hbWVfY29sbGlzaW9ucywgWVlfU1RBUlRcblx0ICAgICAgICAvKiovKSB7XG5cblx0ICAgICAgICAgICAgZnVuY3Rpb24gc3RyaXAoc3RhcnQsIGVuZCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHl5Xy55eXRleHQgPSB5eV8ueXl0ZXh0LnN1YnN0cihzdGFydCwgeXlfLnl5bGVuZyAtIGVuZCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICB2YXIgWVlTVEFURSA9IFlZX1NUQVJUO1xuXHQgICAgICAgICAgICBzd2l0Y2ggKCRhdm9pZGluZ19uYW1lX2NvbGxpc2lvbnMpIHtcblx0ICAgICAgICAgICAgICAgIGNhc2UgMDpcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoeXlfLnl5dGV4dC5zbGljZSgtMikgPT09IFwiXFxcXFxcXFxcIikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdHJpcCgwLCAxKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpbihcIm11XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoeXlfLnl5dGV4dC5zbGljZSgtMSkgPT09IFwiXFxcXFwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0cmlwKDAsIDEpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKFwiZW11XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmVnaW4oXCJtdVwiKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHl5Xy55eXRleHQpIHJldHVybiAxNTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE1O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpbigncmF3Jyk7cmV0dXJuIDE1O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtcblx0ICAgICAgICAgICAgICAgICAgICAvLyBTaG91bGQgYmUgdXNpbmcgYHRoaXMudG9wU3RhdGUoKWAgYmVsb3csIGJ1dCBpdCBjdXJyZW50bHlcblx0ICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm5zIHRoZSBzZWNvbmQgdG9wIGluc3RlYWQgb2YgdGhlIGZpcnN0IHRvcC4gT3BlbmVkIGFuXG5cdCAgICAgICAgICAgICAgICAgICAgLy8gaXNzdWUgYWJvdXQgaXQgYXQgaHR0cHM6Ly9naXRodWIuY29tL3phYWNoL2ppc29uL2lzc3Vlcy8yOTFcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDFdID09PSAncmF3Jykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTU7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeXlfLnl5dGV4dCA9IHl5Xy55eXRleHQuc3Vic3RyKDUsIHl5Xy55eWxlbmcgLSA5KTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdFTkRfUkFXX0JMT0NLJztcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTU7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNDtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA3OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA2NTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgODpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNjg7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDk6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE5O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpbigncmF3Jyk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDIzO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDExOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA1NTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTI6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDYwO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMzpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE0OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA0Nztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTU6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO3JldHVybiA0NDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO3JldHVybiA0NDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTc6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDM0O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxODpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMzk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE5OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA1MTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjA6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDQ4O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyMTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnVucHV0KHl5Xy55eXRleHQpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKCdjb20nKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyMjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE0O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIzOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA0ODtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjQ6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDczO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyNTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNzI7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI2OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA3Mjtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjc6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDg3O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyODpcblx0ICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgd2hpdGVzcGFjZVxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyOTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7cmV0dXJuIDU0O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7cmV0dXJuIDMzO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMTpcblx0ICAgICAgICAgICAgICAgICAgICB5eV8ueXl0ZXh0ID0gc3RyaXAoMSwgMikucmVwbGFjZSgvXFxcXFwiL2csICdcIicpO3JldHVybiA4MDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzI6XG5cdCAgICAgICAgICAgICAgICAgICAgeXlfLnl5dGV4dCA9IHN0cmlwKDEsIDIpLnJlcGxhY2UoL1xcXFwnL2csIFwiJ1wiKTtyZXR1cm4gODA7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDMzOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA4NTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzQ6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDgyO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzNTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gODI7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM2OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA4Mztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzc6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDg0O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzODpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gODE7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM5OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA3NTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDA6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDc3O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0MTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNzI7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQyOlxuXHQgICAgICAgICAgICAgICAgICAgIHl5Xy55eXRleHQgPSB5eV8ueXl0ZXh0LnJlcGxhY2UoL1xcXFwoW1xcXFxcXF1dKS9nLCAnJDEnKTtyZXR1cm4gNzI7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQzOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAnSU5WQUxJRCc7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ0OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA1O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfTtcblx0ICAgICAgICBsZXhlci5ydWxlcyA9IFsvXig/OlteXFx4MDBdKj8oPz0oXFx7XFx7KSkpLywgL14oPzpbXlxceDAwXSspLywgL14oPzpbXlxceDAwXXsyLH0/KD89KFxce1xce3xcXFxcXFx7XFx7fFxcXFxcXFxcXFx7XFx7fCQpKSkvLCAvXig/Olxce1xce1xce1xceyg/PVteXFwvXSkpLywgL14oPzpcXHtcXHtcXHtcXHtcXC9bXlxccyFcIiMlLSxcXC5cXC87LT5AXFxbLVxcXmBcXHstfl0rKD89Wz19XFxzXFwvLl0pXFx9XFx9XFx9XFx9KS8sIC9eKD86W15cXHgwMF0qPyg/PShcXHtcXHtcXHtcXHspKSkvLCAvXig/OltcXHNcXFNdKj8tLSh+KT9cXH1cXH0pLywgL14oPzpcXCgpLywgL14oPzpcXCkpLywgL14oPzpcXHtcXHtcXHtcXHspLywgL14oPzpcXH1cXH1cXH1cXH0pLywgL14oPzpcXHtcXHsofik/PikvLCAvXig/Olxce1xceyh+KT8jPikvLCAvXig/Olxce1xceyh+KT8jXFwqPykvLCAvXig/Olxce1xceyh+KT9cXC8pLywgL14oPzpcXHtcXHsofik/XFxeXFxzKih+KT9cXH1cXH0pLywgL14oPzpcXHtcXHsofik/XFxzKmVsc2VcXHMqKH4pP1xcfVxcfSkvLCAvXig/Olxce1xceyh+KT9cXF4pLywgL14oPzpcXHtcXHsofik/XFxzKmVsc2VcXGIpLywgL14oPzpcXHtcXHsofik/XFx7KS8sIC9eKD86XFx7XFx7KH4pPyYpLywgL14oPzpcXHtcXHsofik/IS0tKS8sIC9eKD86XFx7XFx7KH4pPyFbXFxzXFxTXSo/XFx9XFx9KS8sIC9eKD86XFx7XFx7KH4pP1xcKj8pLywgL14oPzo9KS8sIC9eKD86XFwuXFwuKS8sIC9eKD86XFwuKD89KFs9fn1cXHNcXC8uKXxdKSkpLywgL14oPzpbXFwvLl0pLywgL14oPzpcXHMrKS8sIC9eKD86XFx9KH4pP1xcfVxcfSkvLCAvXig/Oih+KT9cXH1cXH0pLywgL14oPzpcIihcXFxcW1wiXXxbXlwiXSkqXCIpLywgL14oPzonKFxcXFxbJ118W14nXSkqJykvLCAvXig/OkApLywgL14oPzp0cnVlKD89KFt+fVxccyldKSkpLywgL14oPzpmYWxzZSg/PShbfn1cXHMpXSkpKS8sIC9eKD86dW5kZWZpbmVkKD89KFt+fVxccyldKSkpLywgL14oPzpudWxsKD89KFt+fVxccyldKSkpLywgL14oPzotP1swLTldKyg/OlxcLlswLTldKyk/KD89KFt+fVxccyldKSkpLywgL14oPzphc1xccytcXHwpLywgL14oPzpcXHwpLywgL14oPzooW15cXHMhXCIjJS0sXFwuXFwvOy0+QFxcWy1cXF5gXFx7LX5dKyg/PShbPX59XFxzXFwvLil8XSkpKSkvLCAvXig/OlxcWyhcXFxcXFxdfFteXFxdXSkqXFxdKS8sIC9eKD86LikvLCAvXig/OiQpL107XG5cdCAgICAgICAgbGV4ZXIuY29uZGl0aW9ucyA9IHsgXCJtdVwiOiB7IFwicnVsZXNcIjogWzcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5LCAyMCwgMjEsIDIyLCAyMywgMjQsIDI1LCAyNiwgMjcsIDI4LCAyOSwgMzAsIDMxLCAzMiwgMzMsIDM0LCAzNSwgMzYsIDM3LCAzOCwgMzksIDQwLCA0MSwgNDIsIDQzLCA0NF0sIFwiaW5jbHVzaXZlXCI6IGZhbHNlIH0sIFwiZW11XCI6IHsgXCJydWxlc1wiOiBbMl0sIFwiaW5jbHVzaXZlXCI6IGZhbHNlIH0sIFwiY29tXCI6IHsgXCJydWxlc1wiOiBbNl0sIFwiaW5jbHVzaXZlXCI6IGZhbHNlIH0sIFwicmF3XCI6IHsgXCJydWxlc1wiOiBbMywgNCwgNV0sIFwiaW5jbHVzaXZlXCI6IGZhbHNlIH0sIFwiSU5JVElBTFwiOiB7IFwicnVsZXNcIjogWzAsIDEsIDQ0XSwgXCJpbmNsdXNpdmVcIjogdHJ1ZSB9IH07XG5cdCAgICAgICAgcmV0dXJuIGxleGVyO1xuXHQgICAgfSkoKTtcblx0ICAgIHBhcnNlci5sZXhlciA9IGxleGVyO1xuXHQgICAgZnVuY3Rpb24gUGFyc2VyKCkge1xuXHQgICAgICAgIHRoaXMueXkgPSB7fTtcblx0ICAgIH1QYXJzZXIucHJvdG90eXBlID0gcGFyc2VyO3BhcnNlci5QYXJzZXIgPSBQYXJzZXI7XG5cdCAgICByZXR1cm4gbmV3IFBhcnNlcigpO1xuXHR9KSgpO2V4cG9ydHNbXCJkZWZhdWx0XCJdID0gaGFuZGxlYmFycztcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTtcblxuLyoqKi8gfSksXG4vKiAzOCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfdmlzaXRvciA9IF9fd2VicGFja19yZXF1aXJlX18oMzkpO1xuXG5cdHZhciBfdmlzaXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF92aXNpdG9yKTtcblxuXHRmdW5jdGlvbiBXaGl0ZXNwYWNlQ29udHJvbCgpIHtcblx0ICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG5cdCAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0fVxuXHRXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUgPSBuZXcgX3Zpc2l0b3IyWydkZWZhdWx0J10oKTtcblxuXHRXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuUHJvZ3JhbSA9IGZ1bmN0aW9uIChwcm9ncmFtKSB7XG5cdCAgdmFyIGRvU3RhbmRhbG9uZSA9ICF0aGlzLm9wdGlvbnMuaWdub3JlU3RhbmRhbG9uZTtcblxuXHQgIHZhciBpc1Jvb3QgPSAhdGhpcy5pc1Jvb3RTZWVuO1xuXHQgIHRoaXMuaXNSb290U2VlbiA9IHRydWU7XG5cblx0ICB2YXIgYm9keSA9IHByb2dyYW0uYm9keTtcblx0ICBmb3IgKHZhciBpID0gMCwgbCA9IGJvZHkubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICB2YXIgY3VycmVudCA9IGJvZHlbaV0sXG5cdCAgICAgICAgc3RyaXAgPSB0aGlzLmFjY2VwdChjdXJyZW50KTtcblxuXHQgICAgaWYgKCFzdHJpcCkge1xuXHQgICAgICBjb250aW51ZTtcblx0ICAgIH1cblxuXHQgICAgdmFyIF9pc1ByZXZXaGl0ZXNwYWNlID0gaXNQcmV2V2hpdGVzcGFjZShib2R5LCBpLCBpc1Jvb3QpLFxuXHQgICAgICAgIF9pc05leHRXaGl0ZXNwYWNlID0gaXNOZXh0V2hpdGVzcGFjZShib2R5LCBpLCBpc1Jvb3QpLFxuXHQgICAgICAgIG9wZW5TdGFuZGFsb25lID0gc3RyaXAub3BlblN0YW5kYWxvbmUgJiYgX2lzUHJldldoaXRlc3BhY2UsXG5cdCAgICAgICAgY2xvc2VTdGFuZGFsb25lID0gc3RyaXAuY2xvc2VTdGFuZGFsb25lICYmIF9pc05leHRXaGl0ZXNwYWNlLFxuXHQgICAgICAgIGlubGluZVN0YW5kYWxvbmUgPSBzdHJpcC5pbmxpbmVTdGFuZGFsb25lICYmIF9pc1ByZXZXaGl0ZXNwYWNlICYmIF9pc05leHRXaGl0ZXNwYWNlO1xuXG5cdCAgICBpZiAoc3RyaXAuY2xvc2UpIHtcblx0ICAgICAgb21pdFJpZ2h0KGJvZHksIGksIHRydWUpO1xuXHQgICAgfVxuXHQgICAgaWYgKHN0cmlwLm9wZW4pIHtcblx0ICAgICAgb21pdExlZnQoYm9keSwgaSwgdHJ1ZSk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChkb1N0YW5kYWxvbmUgJiYgaW5saW5lU3RhbmRhbG9uZSkge1xuXHQgICAgICBvbWl0UmlnaHQoYm9keSwgaSk7XG5cblx0ICAgICAgaWYgKG9taXRMZWZ0KGJvZHksIGkpKSB7XG5cdCAgICAgICAgLy8gSWYgd2UgYXJlIG9uIGEgc3RhbmRhbG9uZSBub2RlLCBzYXZlIHRoZSBpbmRlbnQgaW5mbyBmb3IgcGFydGlhbHNcblx0ICAgICAgICBpZiAoY3VycmVudC50eXBlID09PSAnUGFydGlhbFN0YXRlbWVudCcpIHtcblx0ICAgICAgICAgIC8vIFB1bGwgb3V0IHRoZSB3aGl0ZXNwYWNlIGZyb20gdGhlIGZpbmFsIGxpbmVcblx0ICAgICAgICAgIGN1cnJlbnQuaW5kZW50ID0gLyhbIFxcdF0rJCkvLmV4ZWMoYm9keVtpIC0gMV0ub3JpZ2luYWwpWzFdO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgaWYgKGRvU3RhbmRhbG9uZSAmJiBvcGVuU3RhbmRhbG9uZSkge1xuXHQgICAgICBvbWl0UmlnaHQoKGN1cnJlbnQucHJvZ3JhbSB8fCBjdXJyZW50LmludmVyc2UpLmJvZHkpO1xuXG5cdCAgICAgIC8vIFN0cmlwIG91dCB0aGUgcHJldmlvdXMgY29udGVudCBub2RlIGlmIGl0J3Mgd2hpdGVzcGFjZSBvbmx5XG5cdCAgICAgIG9taXRMZWZ0KGJvZHksIGkpO1xuXHQgICAgfVxuXHQgICAgaWYgKGRvU3RhbmRhbG9uZSAmJiBjbG9zZVN0YW5kYWxvbmUpIHtcblx0ICAgICAgLy8gQWx3YXlzIHN0cmlwIHRoZSBuZXh0IG5vZGVcblx0ICAgICAgb21pdFJpZ2h0KGJvZHksIGkpO1xuXG5cdCAgICAgIG9taXRMZWZ0KChjdXJyZW50LmludmVyc2UgfHwgY3VycmVudC5wcm9ncmFtKS5ib2R5KTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICByZXR1cm4gcHJvZ3JhbTtcblx0fTtcblxuXHRXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuQmxvY2tTdGF0ZW1lbnQgPSBXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuRGVjb3JhdG9yQmxvY2sgPSBXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuUGFydGlhbEJsb2NrU3RhdGVtZW50ID0gZnVuY3Rpb24gKGJsb2NrKSB7XG5cdCAgdGhpcy5hY2NlcHQoYmxvY2sucHJvZ3JhbSk7XG5cdCAgdGhpcy5hY2NlcHQoYmxvY2suaW52ZXJzZSk7XG5cblx0ICAvLyBGaW5kIHRoZSBpbnZlcnNlIHByb2dyYW0gdGhhdCBpcyBpbnZvbGVkIHdpdGggd2hpdGVzcGFjZSBzdHJpcHBpbmcuXG5cdCAgdmFyIHByb2dyYW0gPSBibG9jay5wcm9ncmFtIHx8IGJsb2NrLmludmVyc2UsXG5cdCAgICAgIGludmVyc2UgPSBibG9jay5wcm9ncmFtICYmIGJsb2NrLmludmVyc2UsXG5cdCAgICAgIGZpcnN0SW52ZXJzZSA9IGludmVyc2UsXG5cdCAgICAgIGxhc3RJbnZlcnNlID0gaW52ZXJzZTtcblxuXHQgIGlmIChpbnZlcnNlICYmIGludmVyc2UuY2hhaW5lZCkge1xuXHQgICAgZmlyc3RJbnZlcnNlID0gaW52ZXJzZS5ib2R5WzBdLnByb2dyYW07XG5cblx0ICAgIC8vIFdhbGsgdGhlIGludmVyc2UgY2hhaW4gdG8gZmluZCB0aGUgbGFzdCBpbnZlcnNlIHRoYXQgaXMgYWN0dWFsbHkgaW4gdGhlIGNoYWluLlxuXHQgICAgd2hpbGUgKGxhc3RJbnZlcnNlLmNoYWluZWQpIHtcblx0ICAgICAgbGFzdEludmVyc2UgPSBsYXN0SW52ZXJzZS5ib2R5W2xhc3RJbnZlcnNlLmJvZHkubGVuZ3RoIC0gMV0ucHJvZ3JhbTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICB2YXIgc3RyaXAgPSB7XG5cdCAgICBvcGVuOiBibG9jay5vcGVuU3RyaXAub3Blbixcblx0ICAgIGNsb3NlOiBibG9jay5jbG9zZVN0cmlwLmNsb3NlLFxuXG5cdCAgICAvLyBEZXRlcm1pbmUgdGhlIHN0YW5kYWxvbmUgY2FuZGlhY3kuIEJhc2ljYWxseSBmbGFnIG91ciBjb250ZW50IGFzIGJlaW5nIHBvc3NpYmx5IHN0YW5kYWxvbmVcblx0ICAgIC8vIHNvIG91ciBwYXJlbnQgY2FuIGRldGVybWluZSBpZiB3ZSBhY3R1YWxseSBhcmUgc3RhbmRhbG9uZVxuXHQgICAgb3BlblN0YW5kYWxvbmU6IGlzTmV4dFdoaXRlc3BhY2UocHJvZ3JhbS5ib2R5KSxcblx0ICAgIGNsb3NlU3RhbmRhbG9uZTogaXNQcmV2V2hpdGVzcGFjZSgoZmlyc3RJbnZlcnNlIHx8IHByb2dyYW0pLmJvZHkpXG5cdCAgfTtcblxuXHQgIGlmIChibG9jay5vcGVuU3RyaXAuY2xvc2UpIHtcblx0ICAgIG9taXRSaWdodChwcm9ncmFtLmJvZHksIG51bGwsIHRydWUpO1xuXHQgIH1cblxuXHQgIGlmIChpbnZlcnNlKSB7XG5cdCAgICB2YXIgaW52ZXJzZVN0cmlwID0gYmxvY2suaW52ZXJzZVN0cmlwO1xuXG5cdCAgICBpZiAoaW52ZXJzZVN0cmlwLm9wZW4pIHtcblx0ICAgICAgb21pdExlZnQocHJvZ3JhbS5ib2R5LCBudWxsLCB0cnVlKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGludmVyc2VTdHJpcC5jbG9zZSkge1xuXHQgICAgICBvbWl0UmlnaHQoZmlyc3RJbnZlcnNlLmJvZHksIG51bGwsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgaWYgKGJsb2NrLmNsb3NlU3RyaXAub3Blbikge1xuXHQgICAgICBvbWl0TGVmdChsYXN0SW52ZXJzZS5ib2R5LCBudWxsLCB0cnVlKTtcblx0ICAgIH1cblxuXHQgICAgLy8gRmluZCBzdGFuZGFsb25lIGVsc2Ugc3RhdG1lbnRzXG5cdCAgICBpZiAoIXRoaXMub3B0aW9ucy5pZ25vcmVTdGFuZGFsb25lICYmIGlzUHJldldoaXRlc3BhY2UocHJvZ3JhbS5ib2R5KSAmJiBpc05leHRXaGl0ZXNwYWNlKGZpcnN0SW52ZXJzZS5ib2R5KSkge1xuXHQgICAgICBvbWl0TGVmdChwcm9ncmFtLmJvZHkpO1xuXHQgICAgICBvbWl0UmlnaHQoZmlyc3RJbnZlcnNlLmJvZHkpO1xuXHQgICAgfVxuXHQgIH0gZWxzZSBpZiAoYmxvY2suY2xvc2VTdHJpcC5vcGVuKSB7XG5cdCAgICBvbWl0TGVmdChwcm9ncmFtLmJvZHksIG51bGwsIHRydWUpO1xuXHQgIH1cblxuXHQgIHJldHVybiBzdHJpcDtcblx0fTtcblxuXHRXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuRGVjb3JhdG9yID0gV2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLk11c3RhY2hlU3RhdGVtZW50ID0gZnVuY3Rpb24gKG11c3RhY2hlKSB7XG5cdCAgcmV0dXJuIG11c3RhY2hlLnN0cmlwO1xuXHR9O1xuXG5cdFdoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5QYXJ0aWFsU3RhdGVtZW50ID0gV2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLkNvbW1lbnRTdGF0ZW1lbnQgPSBmdW5jdGlvbiAobm9kZSkge1xuXHQgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgdmFyIHN0cmlwID0gbm9kZS5zdHJpcCB8fCB7fTtcblx0ICByZXR1cm4ge1xuXHQgICAgaW5saW5lU3RhbmRhbG9uZTogdHJ1ZSxcblx0ICAgIG9wZW46IHN0cmlwLm9wZW4sXG5cdCAgICBjbG9zZTogc3RyaXAuY2xvc2Vcblx0ICB9O1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGlzUHJldldoaXRlc3BhY2UoYm9keSwgaSwgaXNSb290KSB7XG5cdCAgaWYgKGkgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgaSA9IGJvZHkubGVuZ3RoO1xuXHQgIH1cblxuXHQgIC8vIE5vZGVzIHRoYXQgZW5kIHdpdGggbmV3bGluZXMgYXJlIGNvbnNpZGVyZWQgd2hpdGVzcGFjZSAoYnV0IGFyZSBzcGVjaWFsXG5cdCAgLy8gY2FzZWQgZm9yIHN0cmlwIG9wZXJhdGlvbnMpXG5cdCAgdmFyIHByZXYgPSBib2R5W2kgLSAxXSxcblx0ICAgICAgc2libGluZyA9IGJvZHlbaSAtIDJdO1xuXHQgIGlmICghcHJldikge1xuXHQgICAgcmV0dXJuIGlzUm9vdDtcblx0ICB9XG5cblx0ICBpZiAocHJldi50eXBlID09PSAnQ29udGVudFN0YXRlbWVudCcpIHtcblx0ICAgIHJldHVybiAoc2libGluZyB8fCAhaXNSb290ID8gL1xccj9cXG5cXHMqPyQvIDogLyhefFxccj9cXG4pXFxzKj8kLykudGVzdChwcmV2Lm9yaWdpbmFsKTtcblx0ICB9XG5cdH1cblx0ZnVuY3Rpb24gaXNOZXh0V2hpdGVzcGFjZShib2R5LCBpLCBpc1Jvb3QpIHtcblx0ICBpZiAoaSA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICBpID0gLTE7XG5cdCAgfVxuXG5cdCAgdmFyIG5leHQgPSBib2R5W2kgKyAxXSxcblx0ICAgICAgc2libGluZyA9IGJvZHlbaSArIDJdO1xuXHQgIGlmICghbmV4dCkge1xuXHQgICAgcmV0dXJuIGlzUm9vdDtcblx0ICB9XG5cblx0ICBpZiAobmV4dC50eXBlID09PSAnQ29udGVudFN0YXRlbWVudCcpIHtcblx0ICAgIHJldHVybiAoc2libGluZyB8fCAhaXNSb290ID8gL15cXHMqP1xccj9cXG4vIDogL15cXHMqPyhcXHI/XFxufCQpLykudGVzdChuZXh0Lm9yaWdpbmFsKTtcblx0ICB9XG5cdH1cblxuXHQvLyBNYXJrcyB0aGUgbm9kZSB0byB0aGUgcmlnaHQgb2YgdGhlIHBvc2l0aW9uIGFzIG9taXR0ZWQuXG5cdC8vIEkuZS4ge3tmb299fScgJyB3aWxsIG1hcmsgdGhlICcgJyBub2RlIGFzIG9taXR0ZWQuXG5cdC8vXG5cdC8vIElmIGkgaXMgdW5kZWZpbmVkLCB0aGVuIHRoZSBmaXJzdCBjaGlsZCB3aWxsIGJlIG1hcmtlZCBhcyBzdWNoLlxuXHQvL1xuXHQvLyBJZiBtdWxpdHBsZSBpcyB0cnV0aHkgdGhlbiBhbGwgd2hpdGVzcGFjZSB3aWxsIGJlIHN0cmlwcGVkIG91dCB1bnRpbCBub24td2hpdGVzcGFjZVxuXHQvLyBjb250ZW50IGlzIG1ldC5cblx0ZnVuY3Rpb24gb21pdFJpZ2h0KGJvZHksIGksIG11bHRpcGxlKSB7XG5cdCAgdmFyIGN1cnJlbnQgPSBib2R5W2kgPT0gbnVsbCA/IDAgOiBpICsgMV07XG5cdCAgaWYgKCFjdXJyZW50IHx8IGN1cnJlbnQudHlwZSAhPT0gJ0NvbnRlbnRTdGF0ZW1lbnQnIHx8ICFtdWx0aXBsZSAmJiBjdXJyZW50LnJpZ2h0U3RyaXBwZWQpIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cblx0ICB2YXIgb3JpZ2luYWwgPSBjdXJyZW50LnZhbHVlO1xuXHQgIGN1cnJlbnQudmFsdWUgPSBjdXJyZW50LnZhbHVlLnJlcGxhY2UobXVsdGlwbGUgPyAvXlxccysvIDogL15bIFxcdF0qXFxyP1xcbj8vLCAnJyk7XG5cdCAgY3VycmVudC5yaWdodFN0cmlwcGVkID0gY3VycmVudC52YWx1ZSAhPT0gb3JpZ2luYWw7XG5cdH1cblxuXHQvLyBNYXJrcyB0aGUgbm9kZSB0byB0aGUgbGVmdCBvZiB0aGUgcG9zaXRpb24gYXMgb21pdHRlZC5cblx0Ly8gSS5lLiAnICd7e2Zvb319IHdpbGwgbWFyayB0aGUgJyAnIG5vZGUgYXMgb21pdHRlZC5cblx0Ly9cblx0Ly8gSWYgaSBpcyB1bmRlZmluZWQgdGhlbiB0aGUgbGFzdCBjaGlsZCB3aWxsIGJlIG1hcmtlZCBhcyBzdWNoLlxuXHQvL1xuXHQvLyBJZiBtdWxpdHBsZSBpcyB0cnV0aHkgdGhlbiBhbGwgd2hpdGVzcGFjZSB3aWxsIGJlIHN0cmlwcGVkIG91dCB1bnRpbCBub24td2hpdGVzcGFjZVxuXHQvLyBjb250ZW50IGlzIG1ldC5cblx0ZnVuY3Rpb24gb21pdExlZnQoYm9keSwgaSwgbXVsdGlwbGUpIHtcblx0ICB2YXIgY3VycmVudCA9IGJvZHlbaSA9PSBudWxsID8gYm9keS5sZW5ndGggLSAxIDogaSAtIDFdO1xuXHQgIGlmICghY3VycmVudCB8fCBjdXJyZW50LnR5cGUgIT09ICdDb250ZW50U3RhdGVtZW50JyB8fCAhbXVsdGlwbGUgJiYgY3VycmVudC5sZWZ0U3RyaXBwZWQpIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cblx0ICAvLyBXZSBvbWl0IHRoZSBsYXN0IG5vZGUgaWYgaXQncyB3aGl0ZXNwYWNlIG9ubHkgYW5kIG5vdCBwcmVjZWVkZWQgYnkgYSBub24tY29udGVudCBub2RlLlxuXHQgIHZhciBvcmlnaW5hbCA9IGN1cnJlbnQudmFsdWU7XG5cdCAgY3VycmVudC52YWx1ZSA9IGN1cnJlbnQudmFsdWUucmVwbGFjZShtdWx0aXBsZSA/IC9cXHMrJC8gOiAvWyBcXHRdKyQvLCAnJyk7XG5cdCAgY3VycmVudC5sZWZ0U3RyaXBwZWQgPSBjdXJyZW50LnZhbHVlICE9PSBvcmlnaW5hbDtcblx0ICByZXR1cm4gY3VycmVudC5sZWZ0U3RyaXBwZWQ7XG5cdH1cblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBXaGl0ZXNwYWNlQ29udHJvbDtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMzkgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHRmdW5jdGlvbiBWaXNpdG9yKCkge1xuXHQgIHRoaXMucGFyZW50cyA9IFtdO1xuXHR9XG5cblx0VmlzaXRvci5wcm90b3R5cGUgPSB7XG5cdCAgY29uc3RydWN0b3I6IFZpc2l0b3IsXG5cdCAgbXV0YXRpbmc6IGZhbHNlLFxuXG5cdCAgLy8gVmlzaXRzIGEgZ2l2ZW4gdmFsdWUuIElmIG11dGF0aW5nLCB3aWxsIHJlcGxhY2UgdGhlIHZhbHVlIGlmIG5lY2Vzc2FyeS5cblx0ICBhY2NlcHRLZXk6IGZ1bmN0aW9uIGFjY2VwdEtleShub2RlLCBuYW1lKSB7XG5cdCAgICB2YXIgdmFsdWUgPSB0aGlzLmFjY2VwdChub2RlW25hbWVdKTtcblx0ICAgIGlmICh0aGlzLm11dGF0aW5nKSB7XG5cdCAgICAgIC8vIEhhY2t5IHNhbml0eSBjaGVjazogVGhpcyBtYXkgaGF2ZSBhIGZldyBmYWxzZSBwb3NpdGl2ZXMgZm9yIHR5cGUgZm9yIHRoZSBoZWxwZXJcblx0ICAgICAgLy8gbWV0aG9kcyBidXQgd2lsbCBnZW5lcmFsbHkgZG8gdGhlIHJpZ2h0IHRoaW5nIHdpdGhvdXQgYSBsb3Qgb2Ygb3ZlcmhlYWQuXG5cdCAgICAgIGlmICh2YWx1ZSAmJiAhVmlzaXRvci5wcm90b3R5cGVbdmFsdWUudHlwZV0pIHtcblx0ICAgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVW5leHBlY3RlZCBub2RlIHR5cGUgXCInICsgdmFsdWUudHlwZSArICdcIiBmb3VuZCB3aGVuIGFjY2VwdGluZyAnICsgbmFtZSArICcgb24gJyArIG5vZGUudHlwZSk7XG5cdCAgICAgIH1cblx0ICAgICAgbm9kZVtuYW1lXSA9IHZhbHVlO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICAvLyBQZXJmb3JtcyBhbiBhY2NlcHQgb3BlcmF0aW9uIHdpdGggYWRkZWQgc2FuaXR5IGNoZWNrIHRvIGVuc3VyZVxuXHQgIC8vIHJlcXVpcmVkIGtleXMgYXJlIG5vdCByZW1vdmVkLlxuXHQgIGFjY2VwdFJlcXVpcmVkOiBmdW5jdGlvbiBhY2NlcHRSZXF1aXJlZChub2RlLCBuYW1lKSB7XG5cdCAgICB0aGlzLmFjY2VwdEtleShub2RlLCBuYW1lKTtcblxuXHQgICAgaWYgKCFub2RlW25hbWVdKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKG5vZGUudHlwZSArICcgcmVxdWlyZXMgJyArIG5hbWUpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICAvLyBUcmF2ZXJzZXMgYSBnaXZlbiBhcnJheS4gSWYgbXV0YXRpbmcsIGVtcHR5IHJlc3Buc2VzIHdpbGwgYmUgcmVtb3ZlZFxuXHQgIC8vIGZvciBjaGlsZCBlbGVtZW50cy5cblx0ICBhY2NlcHRBcnJheTogZnVuY3Rpb24gYWNjZXB0QXJyYXkoYXJyYXkpIHtcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXJyYXkubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgIHRoaXMuYWNjZXB0S2V5KGFycmF5LCBpKTtcblxuXHQgICAgICBpZiAoIWFycmF5W2ldKSB7XG5cdCAgICAgICAgYXJyYXkuc3BsaWNlKGksIDEpO1xuXHQgICAgICAgIGktLTtcblx0ICAgICAgICBsLS07XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgYWNjZXB0OiBmdW5jdGlvbiBhY2NlcHQob2JqZWN0KSB7XG5cdCAgICBpZiAoIW9iamVjdCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBTYW5pdHkgY29kZSAqL1xuXHQgICAgaWYgKCF0aGlzW29iamVjdC50eXBlXSkge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVW5rbm93biB0eXBlOiAnICsgb2JqZWN0LnR5cGUsIG9iamVjdCk7XG5cdCAgICB9XG5cblx0ICAgIGlmICh0aGlzLmN1cnJlbnQpIHtcblx0ICAgICAgdGhpcy5wYXJlbnRzLnVuc2hpZnQodGhpcy5jdXJyZW50KTtcblx0ICAgIH1cblx0ICAgIHRoaXMuY3VycmVudCA9IG9iamVjdDtcblxuXHQgICAgdmFyIHJldCA9IHRoaXNbb2JqZWN0LnR5cGVdKG9iamVjdCk7XG5cblx0ICAgIHRoaXMuY3VycmVudCA9IHRoaXMucGFyZW50cy5zaGlmdCgpO1xuXG5cdCAgICBpZiAoIXRoaXMubXV0YXRpbmcgfHwgcmV0KSB7XG5cdCAgICAgIHJldHVybiByZXQ7XG5cdCAgICB9IGVsc2UgaWYgKHJldCAhPT0gZmFsc2UpIHtcblx0ICAgICAgcmV0dXJuIG9iamVjdDtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgUHJvZ3JhbTogZnVuY3Rpb24gUHJvZ3JhbShwcm9ncmFtKSB7XG5cdCAgICB0aGlzLmFjY2VwdEFycmF5KHByb2dyYW0uYm9keSk7XG5cdCAgfSxcblxuXHQgIE11c3RhY2hlU3RhdGVtZW50OiB2aXNpdFN1YkV4cHJlc3Npb24sXG5cdCAgRGVjb3JhdG9yOiB2aXNpdFN1YkV4cHJlc3Npb24sXG5cblx0ICBCbG9ja1N0YXRlbWVudDogdmlzaXRCbG9jayxcblx0ICBEZWNvcmF0b3JCbG9jazogdmlzaXRCbG9jayxcblxuXHQgIFBhcnRpYWxTdGF0ZW1lbnQ6IHZpc2l0UGFydGlhbCxcblx0ICBQYXJ0aWFsQmxvY2tTdGF0ZW1lbnQ6IGZ1bmN0aW9uIFBhcnRpYWxCbG9ja1N0YXRlbWVudChwYXJ0aWFsKSB7XG5cdCAgICB2aXNpdFBhcnRpYWwuY2FsbCh0aGlzLCBwYXJ0aWFsKTtcblxuXHQgICAgdGhpcy5hY2NlcHRLZXkocGFydGlhbCwgJ3Byb2dyYW0nKTtcblx0ICB9LFxuXG5cdCAgQ29udGVudFN0YXRlbWVudDogZnVuY3Rpb24gQ29udGVudFN0YXRlbWVudCgpIC8qIGNvbnRlbnQgKi97fSxcblx0ICBDb21tZW50U3RhdGVtZW50OiBmdW5jdGlvbiBDb21tZW50U3RhdGVtZW50KCkgLyogY29tbWVudCAqL3t9LFxuXG5cdCAgU3ViRXhwcmVzc2lvbjogdmlzaXRTdWJFeHByZXNzaW9uLFxuXG5cdCAgUGF0aEV4cHJlc3Npb246IGZ1bmN0aW9uIFBhdGhFeHByZXNzaW9uKCkgLyogcGF0aCAqL3t9LFxuXG5cdCAgU3RyaW5nTGl0ZXJhbDogZnVuY3Rpb24gU3RyaW5nTGl0ZXJhbCgpIC8qIHN0cmluZyAqL3t9LFxuXHQgIE51bWJlckxpdGVyYWw6IGZ1bmN0aW9uIE51bWJlckxpdGVyYWwoKSAvKiBudW1iZXIgKi97fSxcblx0ICBCb29sZWFuTGl0ZXJhbDogZnVuY3Rpb24gQm9vbGVhbkxpdGVyYWwoKSAvKiBib29sICove30sXG5cdCAgVW5kZWZpbmVkTGl0ZXJhbDogZnVuY3Rpb24gVW5kZWZpbmVkTGl0ZXJhbCgpIC8qIGxpdGVyYWwgKi97fSxcblx0ICBOdWxsTGl0ZXJhbDogZnVuY3Rpb24gTnVsbExpdGVyYWwoKSAvKiBsaXRlcmFsICove30sXG5cblx0ICBIYXNoOiBmdW5jdGlvbiBIYXNoKGhhc2gpIHtcblx0ICAgIHRoaXMuYWNjZXB0QXJyYXkoaGFzaC5wYWlycyk7XG5cdCAgfSxcblx0ICBIYXNoUGFpcjogZnVuY3Rpb24gSGFzaFBhaXIocGFpcikge1xuXHQgICAgdGhpcy5hY2NlcHRSZXF1aXJlZChwYWlyLCAndmFsdWUnKTtcblx0ICB9XG5cdH07XG5cblx0ZnVuY3Rpb24gdmlzaXRTdWJFeHByZXNzaW9uKG11c3RhY2hlKSB7XG5cdCAgdGhpcy5hY2NlcHRSZXF1aXJlZChtdXN0YWNoZSwgJ3BhdGgnKTtcblx0ICB0aGlzLmFjY2VwdEFycmF5KG11c3RhY2hlLnBhcmFtcyk7XG5cdCAgdGhpcy5hY2NlcHRLZXkobXVzdGFjaGUsICdoYXNoJyk7XG5cdH1cblx0ZnVuY3Rpb24gdmlzaXRCbG9jayhibG9jaykge1xuXHQgIHZpc2l0U3ViRXhwcmVzc2lvbi5jYWxsKHRoaXMsIGJsb2NrKTtcblxuXHQgIHRoaXMuYWNjZXB0S2V5KGJsb2NrLCAncHJvZ3JhbScpO1xuXHQgIHRoaXMuYWNjZXB0S2V5KGJsb2NrLCAnaW52ZXJzZScpO1xuXHR9XG5cdGZ1bmN0aW9uIHZpc2l0UGFydGlhbChwYXJ0aWFsKSB7XG5cdCAgdGhpcy5hY2NlcHRSZXF1aXJlZChwYXJ0aWFsLCAnbmFtZScpO1xuXHQgIHRoaXMuYWNjZXB0QXJyYXkocGFydGlhbC5wYXJhbXMpO1xuXHQgIHRoaXMuYWNjZXB0S2V5KHBhcnRpYWwsICdoYXNoJyk7XG5cdH1cblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBWaXNpdG9yO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiA0MCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLlNvdXJjZUxvY2F0aW9uID0gU291cmNlTG9jYXRpb247XG5cdGV4cG9ydHMuaWQgPSBpZDtcblx0ZXhwb3J0cy5zdHJpcEZsYWdzID0gc3RyaXBGbGFncztcblx0ZXhwb3J0cy5zdHJpcENvbW1lbnQgPSBzdHJpcENvbW1lbnQ7XG5cdGV4cG9ydHMucHJlcGFyZVBhdGggPSBwcmVwYXJlUGF0aDtcblx0ZXhwb3J0cy5wcmVwYXJlTXVzdGFjaGUgPSBwcmVwYXJlTXVzdGFjaGU7XG5cdGV4cG9ydHMucHJlcGFyZVJhd0Jsb2NrID0gcHJlcGFyZVJhd0Jsb2NrO1xuXHRleHBvcnRzLnByZXBhcmVCbG9jayA9IHByZXBhcmVCbG9jaztcblx0ZXhwb3J0cy5wcmVwYXJlUHJvZ3JhbSA9IHByZXBhcmVQcm9ncmFtO1xuXHRleHBvcnRzLnByZXBhcmVQYXJ0aWFsQmxvY2sgPSBwcmVwYXJlUGFydGlhbEJsb2NrO1xuXG5cdHZhciBfZXhjZXB0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHR2YXIgX2V4Y2VwdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leGNlcHRpb24pO1xuXG5cdGZ1bmN0aW9uIHZhbGlkYXRlQ2xvc2Uob3BlbiwgY2xvc2UpIHtcblx0ICBjbG9zZSA9IGNsb3NlLnBhdGggPyBjbG9zZS5wYXRoLm9yaWdpbmFsIDogY2xvc2U7XG5cblx0ICBpZiAob3Blbi5wYXRoLm9yaWdpbmFsICE9PSBjbG9zZSkge1xuXHQgICAgdmFyIGVycm9yTm9kZSA9IHsgbG9jOiBvcGVuLnBhdGgubG9jIH07XG5cblx0ICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKG9wZW4ucGF0aC5vcmlnaW5hbCArIFwiIGRvZXNuJ3QgbWF0Y2ggXCIgKyBjbG9zZSwgZXJyb3JOb2RlKTtcblx0ICB9XG5cdH1cblxuXHRmdW5jdGlvbiBTb3VyY2VMb2NhdGlvbihzb3VyY2UsIGxvY0luZm8pIHtcblx0ICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblx0ICB0aGlzLnN0YXJ0ID0ge1xuXHQgICAgbGluZTogbG9jSW5mby5maXJzdF9saW5lLFxuXHQgICAgY29sdW1uOiBsb2NJbmZvLmZpcnN0X2NvbHVtblxuXHQgIH07XG5cdCAgdGhpcy5lbmQgPSB7XG5cdCAgICBsaW5lOiBsb2NJbmZvLmxhc3RfbGluZSxcblx0ICAgIGNvbHVtbjogbG9jSW5mby5sYXN0X2NvbHVtblxuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBpZCh0b2tlbikge1xuXHQgIGlmICgvXlxcWy4qXFxdJC8udGVzdCh0b2tlbikpIHtcblx0ICAgIHJldHVybiB0b2tlbi5zdWJzdHIoMSwgdG9rZW4ubGVuZ3RoIC0gMik7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJldHVybiB0b2tlbjtcblx0ICB9XG5cdH1cblxuXHRmdW5jdGlvbiBzdHJpcEZsYWdzKG9wZW4sIGNsb3NlKSB7XG5cdCAgcmV0dXJuIHtcblx0ICAgIG9wZW46IG9wZW4uY2hhckF0KDIpID09PSAnficsXG5cdCAgICBjbG9zZTogY2xvc2UuY2hhckF0KGNsb3NlLmxlbmd0aCAtIDMpID09PSAnfidcblx0ICB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gc3RyaXBDb21tZW50KGNvbW1lbnQpIHtcblx0ICByZXR1cm4gY29tbWVudC5yZXBsYWNlKC9eXFx7XFx7fj9cXCEtPy0/LywgJycpLnJlcGxhY2UoLy0/LT9+P1xcfVxcfSQvLCAnJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBwcmVwYXJlUGF0aChkYXRhLCBwYXJ0cywgbG9jKSB7XG5cdCAgbG9jID0gdGhpcy5sb2NJbmZvKGxvYyk7XG5cblx0ICB2YXIgb3JpZ2luYWwgPSBkYXRhID8gJ0AnIDogJycsXG5cdCAgICAgIGRpZyA9IFtdLFxuXHQgICAgICBkZXB0aCA9IDAsXG5cdCAgICAgIGRlcHRoU3RyaW5nID0gJyc7XG5cblx0ICBmb3IgKHZhciBpID0gMCwgbCA9IHBhcnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgdmFyIHBhcnQgPSBwYXJ0c1tpXS5wYXJ0LFxuXG5cdCAgICAvLyBJZiB3ZSBoYXZlIFtdIHN5bnRheCB0aGVuIHdlIGRvIG5vdCB0cmVhdCBwYXRoIHJlZmVyZW5jZXMgYXMgb3BlcmF0b3JzLFxuXHQgICAgLy8gaS5lLiBmb28uW3RoaXNdIHJlc29sdmVzIHRvIGFwcHJveGltYXRlbHkgY29udGV4dC5mb29bJ3RoaXMnXVxuXHQgICAgaXNMaXRlcmFsID0gcGFydHNbaV0ub3JpZ2luYWwgIT09IHBhcnQ7XG5cdCAgICBvcmlnaW5hbCArPSAocGFydHNbaV0uc2VwYXJhdG9yIHx8ICcnKSArIHBhcnQ7XG5cblx0ICAgIGlmICghaXNMaXRlcmFsICYmIChwYXJ0ID09PSAnLi4nIHx8IHBhcnQgPT09ICcuJyB8fCBwYXJ0ID09PSAndGhpcycpKSB7XG5cdCAgICAgIGlmIChkaWcubGVuZ3RoID4gMCkge1xuXHQgICAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdJbnZhbGlkIHBhdGg6ICcgKyBvcmlnaW5hbCwgeyBsb2M6IGxvYyB9KTtcblx0ICAgICAgfSBlbHNlIGlmIChwYXJ0ID09PSAnLi4nKSB7XG5cdCAgICAgICAgZGVwdGgrKztcblx0ICAgICAgICBkZXB0aFN0cmluZyArPSAnLi4vJztcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgZGlnLnB1c2gocGFydCk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgcmV0dXJuIHtcblx0ICAgIHR5cGU6ICdQYXRoRXhwcmVzc2lvbicsXG5cdCAgICBkYXRhOiBkYXRhLFxuXHQgICAgZGVwdGg6IGRlcHRoLFxuXHQgICAgcGFydHM6IGRpZyxcblx0ICAgIG9yaWdpbmFsOiBvcmlnaW5hbCxcblx0ICAgIGxvYzogbG9jXG5cdCAgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIHByZXBhcmVNdXN0YWNoZShwYXRoLCBwYXJhbXMsIGhhc2gsIG9wZW4sIHN0cmlwLCBsb2NJbmZvKSB7XG5cdCAgLy8gTXVzdCB1c2UgY2hhckF0IHRvIHN1cHBvcnQgSUUgcHJlLTEwXG5cdCAgdmFyIGVzY2FwZUZsYWcgPSBvcGVuLmNoYXJBdCgzKSB8fCBvcGVuLmNoYXJBdCgyKSxcblx0ICAgICAgZXNjYXBlZCA9IGVzY2FwZUZsYWcgIT09ICd7JyAmJiBlc2NhcGVGbGFnICE9PSAnJic7XG5cblx0ICB2YXIgZGVjb3JhdG9yID0gL1xcKi8udGVzdChvcGVuKTtcblx0ICByZXR1cm4ge1xuXHQgICAgdHlwZTogZGVjb3JhdG9yID8gJ0RlY29yYXRvcicgOiAnTXVzdGFjaGVTdGF0ZW1lbnQnLFxuXHQgICAgcGF0aDogcGF0aCxcblx0ICAgIHBhcmFtczogcGFyYW1zLFxuXHQgICAgaGFzaDogaGFzaCxcblx0ICAgIGVzY2FwZWQ6IGVzY2FwZWQsXG5cdCAgICBzdHJpcDogc3RyaXAsXG5cdCAgICBsb2M6IHRoaXMubG9jSW5mbyhsb2NJbmZvKVxuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBwcmVwYXJlUmF3QmxvY2sob3BlblJhd0Jsb2NrLCBjb250ZW50cywgY2xvc2UsIGxvY0luZm8pIHtcblx0ICB2YWxpZGF0ZUNsb3NlKG9wZW5SYXdCbG9jaywgY2xvc2UpO1xuXG5cdCAgbG9jSW5mbyA9IHRoaXMubG9jSW5mbyhsb2NJbmZvKTtcblx0ICB2YXIgcHJvZ3JhbSA9IHtcblx0ICAgIHR5cGU6ICdQcm9ncmFtJyxcblx0ICAgIGJvZHk6IGNvbnRlbnRzLFxuXHQgICAgc3RyaXA6IHt9LFxuXHQgICAgbG9jOiBsb2NJbmZvXG5cdCAgfTtcblxuXHQgIHJldHVybiB7XG5cdCAgICB0eXBlOiAnQmxvY2tTdGF0ZW1lbnQnLFxuXHQgICAgcGF0aDogb3BlblJhd0Jsb2NrLnBhdGgsXG5cdCAgICBwYXJhbXM6IG9wZW5SYXdCbG9jay5wYXJhbXMsXG5cdCAgICBoYXNoOiBvcGVuUmF3QmxvY2suaGFzaCxcblx0ICAgIHByb2dyYW06IHByb2dyYW0sXG5cdCAgICBvcGVuU3RyaXA6IHt9LFxuXHQgICAgaW52ZXJzZVN0cmlwOiB7fSxcblx0ICAgIGNsb3NlU3RyaXA6IHt9LFxuXHQgICAgbG9jOiBsb2NJbmZvXG5cdCAgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIHByZXBhcmVCbG9jayhvcGVuQmxvY2ssIHByb2dyYW0sIGludmVyc2VBbmRQcm9ncmFtLCBjbG9zZSwgaW52ZXJ0ZWQsIGxvY0luZm8pIHtcblx0ICBpZiAoY2xvc2UgJiYgY2xvc2UucGF0aCkge1xuXHQgICAgdmFsaWRhdGVDbG9zZShvcGVuQmxvY2ssIGNsb3NlKTtcblx0ICB9XG5cblx0ICB2YXIgZGVjb3JhdG9yID0gL1xcKi8udGVzdChvcGVuQmxvY2sub3Blbik7XG5cblx0ICBwcm9ncmFtLmJsb2NrUGFyYW1zID0gb3BlbkJsb2NrLmJsb2NrUGFyYW1zO1xuXG5cdCAgdmFyIGludmVyc2UgPSB1bmRlZmluZWQsXG5cdCAgICAgIGludmVyc2VTdHJpcCA9IHVuZGVmaW5lZDtcblxuXHQgIGlmIChpbnZlcnNlQW5kUHJvZ3JhbSkge1xuXHQgICAgaWYgKGRlY29yYXRvcikge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVW5leHBlY3RlZCBpbnZlcnNlIGJsb2NrIG9uIGRlY29yYXRvcicsIGludmVyc2VBbmRQcm9ncmFtKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGludmVyc2VBbmRQcm9ncmFtLmNoYWluKSB7XG5cdCAgICAgIGludmVyc2VBbmRQcm9ncmFtLnByb2dyYW0uYm9keVswXS5jbG9zZVN0cmlwID0gY2xvc2Uuc3RyaXA7XG5cdCAgICB9XG5cblx0ICAgIGludmVyc2VTdHJpcCA9IGludmVyc2VBbmRQcm9ncmFtLnN0cmlwO1xuXHQgICAgaW52ZXJzZSA9IGludmVyc2VBbmRQcm9ncmFtLnByb2dyYW07XG5cdCAgfVxuXG5cdCAgaWYgKGludmVydGVkKSB7XG5cdCAgICBpbnZlcnRlZCA9IGludmVyc2U7XG5cdCAgICBpbnZlcnNlID0gcHJvZ3JhbTtcblx0ICAgIHByb2dyYW0gPSBpbnZlcnRlZDtcblx0ICB9XG5cblx0ICByZXR1cm4ge1xuXHQgICAgdHlwZTogZGVjb3JhdG9yID8gJ0RlY29yYXRvckJsb2NrJyA6ICdCbG9ja1N0YXRlbWVudCcsXG5cdCAgICBwYXRoOiBvcGVuQmxvY2sucGF0aCxcblx0ICAgIHBhcmFtczogb3BlbkJsb2NrLnBhcmFtcyxcblx0ICAgIGhhc2g6IG9wZW5CbG9jay5oYXNoLFxuXHQgICAgcHJvZ3JhbTogcHJvZ3JhbSxcblx0ICAgIGludmVyc2U6IGludmVyc2UsXG5cdCAgICBvcGVuU3RyaXA6IG9wZW5CbG9jay5zdHJpcCxcblx0ICAgIGludmVyc2VTdHJpcDogaW52ZXJzZVN0cmlwLFxuXHQgICAgY2xvc2VTdHJpcDogY2xvc2UgJiYgY2xvc2Uuc3RyaXAsXG5cdCAgICBsb2M6IHRoaXMubG9jSW5mbyhsb2NJbmZvKVxuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBwcmVwYXJlUHJvZ3JhbShzdGF0ZW1lbnRzLCBsb2MpIHtcblx0ICBpZiAoIWxvYyAmJiBzdGF0ZW1lbnRzLmxlbmd0aCkge1xuXHQgICAgdmFyIGZpcnN0TG9jID0gc3RhdGVtZW50c1swXS5sb2MsXG5cdCAgICAgICAgbGFzdExvYyA9IHN0YXRlbWVudHNbc3RhdGVtZW50cy5sZW5ndGggLSAxXS5sb2M7XG5cblx0ICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdCAgICBpZiAoZmlyc3RMb2MgJiYgbGFzdExvYykge1xuXHQgICAgICBsb2MgPSB7XG5cdCAgICAgICAgc291cmNlOiBmaXJzdExvYy5zb3VyY2UsXG5cdCAgICAgICAgc3RhcnQ6IHtcblx0ICAgICAgICAgIGxpbmU6IGZpcnN0TG9jLnN0YXJ0LmxpbmUsXG5cdCAgICAgICAgICBjb2x1bW46IGZpcnN0TG9jLnN0YXJ0LmNvbHVtblxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZW5kOiB7XG5cdCAgICAgICAgICBsaW5lOiBsYXN0TG9jLmVuZC5saW5lLFxuXHQgICAgICAgICAgY29sdW1uOiBsYXN0TG9jLmVuZC5jb2x1bW5cblx0ICAgICAgICB9XG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgcmV0dXJuIHtcblx0ICAgIHR5cGU6ICdQcm9ncmFtJyxcblx0ICAgIGJvZHk6IHN0YXRlbWVudHMsXG5cdCAgICBzdHJpcDoge30sXG5cdCAgICBsb2M6IGxvY1xuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBwcmVwYXJlUGFydGlhbEJsb2NrKG9wZW4sIHByb2dyYW0sIGNsb3NlLCBsb2NJbmZvKSB7XG5cdCAgdmFsaWRhdGVDbG9zZShvcGVuLCBjbG9zZSk7XG5cblx0ICByZXR1cm4ge1xuXHQgICAgdHlwZTogJ1BhcnRpYWxCbG9ja1N0YXRlbWVudCcsXG5cdCAgICBuYW1lOiBvcGVuLnBhdGgsXG5cdCAgICBwYXJhbXM6IG9wZW4ucGFyYW1zLFxuXHQgICAgaGFzaDogb3Blbi5oYXNoLFxuXHQgICAgcHJvZ3JhbTogcHJvZ3JhbSxcblx0ICAgIG9wZW5TdHJpcDogb3Blbi5zdHJpcCxcblx0ICAgIGNsb3NlU3RyaXA6IGNsb3NlICYmIGNsb3NlLnN0cmlwLFxuXHQgICAgbG9jOiB0aGlzLmxvY0luZm8obG9jSW5mbylcblx0ICB9O1xuXHR9XG5cbi8qKiovIH0pLFxuLyogNDEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuQ29tcGlsZXIgPSBDb21waWxlcjtcblx0ZXhwb3J0cy5wcmVjb21waWxlID0gcHJlY29tcGlsZTtcblx0ZXhwb3J0cy5jb21waWxlID0gY29tcGlsZTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHR2YXIgX2FzdCA9IF9fd2VicGFja19yZXF1aXJlX18oMzUpO1xuXG5cdHZhciBfYXN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FzdCk7XG5cblx0dmFyIHNsaWNlID0gW10uc2xpY2U7XG5cblx0ZnVuY3Rpb24gQ29tcGlsZXIoKSB7fVxuXG5cdC8vIHRoZSBmb3VuZEhlbHBlciByZWdpc3RlciB3aWxsIGRpc2FtYmlndWF0ZSBoZWxwZXIgbG9va3VwIGZyb20gZmluZGluZyBhXG5cdC8vIGZ1bmN0aW9uIGluIGEgY29udGV4dC4gVGhpcyBpcyBuZWNlc3NhcnkgZm9yIG11c3RhY2hlIGNvbXBhdGliaWxpdHksIHdoaWNoXG5cdC8vIHJlcXVpcmVzIHRoYXQgY29udGV4dCBmdW5jdGlvbnMgaW4gYmxvY2tzIGFyZSBldmFsdWF0ZWQgYnkgYmxvY2tIZWxwZXJNaXNzaW5nLFxuXHQvLyBhbmQgdGhlbiBwcm9jZWVkIGFzIGlmIHRoZSByZXN1bHRpbmcgdmFsdWUgd2FzIHByb3ZpZGVkIHRvIGJsb2NrSGVscGVyTWlzc2luZy5cblxuXHRDb21waWxlci5wcm90b3R5cGUgPSB7XG5cdCAgY29tcGlsZXI6IENvbXBpbGVyLFxuXG5cdCAgZXF1YWxzOiBmdW5jdGlvbiBlcXVhbHMob3RoZXIpIHtcblx0ICAgIHZhciBsZW4gPSB0aGlzLm9wY29kZXMubGVuZ3RoO1xuXHQgICAgaWYgKG90aGVyLm9wY29kZXMubGVuZ3RoICE9PSBsZW4pIHtcblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIHZhciBvcGNvZGUgPSB0aGlzLm9wY29kZXNbaV0sXG5cdCAgICAgICAgICBvdGhlck9wY29kZSA9IG90aGVyLm9wY29kZXNbaV07XG5cdCAgICAgIGlmIChvcGNvZGUub3Bjb2RlICE9PSBvdGhlck9wY29kZS5vcGNvZGUgfHwgIWFyZ0VxdWFscyhvcGNvZGUuYXJncywgb3RoZXJPcGNvZGUuYXJncykpIHtcblx0ICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgLy8gV2Uga25vdyB0aGF0IGxlbmd0aCBpcyB0aGUgc2FtZSBiZXR3ZWVuIHRoZSB0d28gYXJyYXlzIGJlY2F1c2UgdGhleSBhcmUgZGlyZWN0bHkgdGllZFxuXHQgICAgLy8gdG8gdGhlIG9wY29kZSBiZWhhdmlvciBhYm92ZS5cblx0ICAgIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICBpZiAoIXRoaXMuY2hpbGRyZW5baV0uZXF1YWxzKG90aGVyLmNoaWxkcmVuW2ldKSkge1xuXHQgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9LFxuXG5cdCAgZ3VpZDogMCxcblxuXHQgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUocHJvZ3JhbSwgb3B0aW9ucykge1xuXHQgICAgdGhpcy5zb3VyY2VOb2RlID0gW107XG5cdCAgICB0aGlzLm9wY29kZXMgPSBbXTtcblx0ICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcblx0ICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdCAgICB0aGlzLnN0cmluZ1BhcmFtcyA9IG9wdGlvbnMuc3RyaW5nUGFyYW1zO1xuXHQgICAgdGhpcy50cmFja0lkcyA9IG9wdGlvbnMudHJhY2tJZHM7XG5cblx0ICAgIG9wdGlvbnMuYmxvY2tQYXJhbXMgPSBvcHRpb25zLmJsb2NrUGFyYW1zIHx8IFtdO1xuXG5cdCAgICAvLyBUaGVzZSBjaGFuZ2VzIHdpbGwgcHJvcGFnYXRlIHRvIHRoZSBvdGhlciBjb21waWxlciBjb21wb25lbnRzXG5cdCAgICB2YXIga25vd25IZWxwZXJzID0gb3B0aW9ucy5rbm93bkhlbHBlcnM7XG5cdCAgICBvcHRpb25zLmtub3duSGVscGVycyA9IHtcblx0ICAgICAgJ2hlbHBlck1pc3NpbmcnOiB0cnVlLFxuXHQgICAgICAnYmxvY2tIZWxwZXJNaXNzaW5nJzogdHJ1ZSxcblx0ICAgICAgJ2VhY2gnOiB0cnVlLFxuXHQgICAgICAnaWYnOiB0cnVlLFxuXHQgICAgICAndW5sZXNzJzogdHJ1ZSxcblx0ICAgICAgJ3dpdGgnOiB0cnVlLFxuXHQgICAgICAnbG9nJzogdHJ1ZSxcblx0ICAgICAgJ2xvb2t1cCc6IHRydWVcblx0ICAgIH07XG5cdCAgICBpZiAoa25vd25IZWxwZXJzKSB7XG5cdCAgICAgIGZvciAodmFyIF9uYW1lIGluIGtub3duSGVscGVycykge1xuXHQgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdCAgICAgICAgaWYgKF9uYW1lIGluIGtub3duSGVscGVycykge1xuXHQgICAgICAgICAgdGhpcy5vcHRpb25zLmtub3duSGVscGVyc1tfbmFtZV0gPSBrbm93bkhlbHBlcnNbX25hbWVdO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdGhpcy5hY2NlcHQocHJvZ3JhbSk7XG5cdCAgfSxcblxuXHQgIGNvbXBpbGVQcm9ncmFtOiBmdW5jdGlvbiBjb21waWxlUHJvZ3JhbShwcm9ncmFtKSB7XG5cdCAgICB2YXIgY2hpbGRDb21waWxlciA9IG5ldyB0aGlzLmNvbXBpbGVyKCksXG5cdCAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuZXctY2FwXG5cdCAgICByZXN1bHQgPSBjaGlsZENvbXBpbGVyLmNvbXBpbGUocHJvZ3JhbSwgdGhpcy5vcHRpb25zKSxcblx0ICAgICAgICBndWlkID0gdGhpcy5ndWlkKys7XG5cblx0ICAgIHRoaXMudXNlUGFydGlhbCA9IHRoaXMudXNlUGFydGlhbCB8fCByZXN1bHQudXNlUGFydGlhbDtcblxuXHQgICAgdGhpcy5jaGlsZHJlbltndWlkXSA9IHJlc3VsdDtcblx0ICAgIHRoaXMudXNlRGVwdGhzID0gdGhpcy51c2VEZXB0aHMgfHwgcmVzdWx0LnVzZURlcHRocztcblxuXHQgICAgcmV0dXJuIGd1aWQ7XG5cdCAgfSxcblxuXHQgIGFjY2VwdDogZnVuY3Rpb24gYWNjZXB0KG5vZGUpIHtcblx0ICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBTYW5pdHkgY29kZSAqL1xuXHQgICAgaWYgKCF0aGlzW25vZGUudHlwZV0pIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1Vua25vd24gdHlwZTogJyArIG5vZGUudHlwZSwgbm9kZSk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuc291cmNlTm9kZS51bnNoaWZ0KG5vZGUpO1xuXHQgICAgdmFyIHJldCA9IHRoaXNbbm9kZS50eXBlXShub2RlKTtcblx0ICAgIHRoaXMuc291cmNlTm9kZS5zaGlmdCgpO1xuXHQgICAgcmV0dXJuIHJldDtcblx0ICB9LFxuXG5cdCAgUHJvZ3JhbTogZnVuY3Rpb24gUHJvZ3JhbShwcm9ncmFtKSB7XG5cdCAgICB0aGlzLm9wdGlvbnMuYmxvY2tQYXJhbXMudW5zaGlmdChwcm9ncmFtLmJsb2NrUGFyYW1zKTtcblxuXHQgICAgdmFyIGJvZHkgPSBwcm9ncmFtLmJvZHksXG5cdCAgICAgICAgYm9keUxlbmd0aCA9IGJvZHkubGVuZ3RoO1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib2R5TGVuZ3RoOyBpKyspIHtcblx0ICAgICAgdGhpcy5hY2NlcHQoYm9keVtpXSk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMub3B0aW9ucy5ibG9ja1BhcmFtcy5zaGlmdCgpO1xuXG5cdCAgICB0aGlzLmlzU2ltcGxlID0gYm9keUxlbmd0aCA9PT0gMTtcblx0ICAgIHRoaXMuYmxvY2tQYXJhbXMgPSBwcm9ncmFtLmJsb2NrUGFyYW1zID8gcHJvZ3JhbS5ibG9ja1BhcmFtcy5sZW5ndGggOiAwO1xuXG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXG5cdCAgQmxvY2tTdGF0ZW1lbnQ6IGZ1bmN0aW9uIEJsb2NrU3RhdGVtZW50KGJsb2NrKSB7XG5cdCAgICB0cmFuc2Zvcm1MaXRlcmFsVG9QYXRoKGJsb2NrKTtcblxuXHQgICAgdmFyIHByb2dyYW0gPSBibG9jay5wcm9ncmFtLFxuXHQgICAgICAgIGludmVyc2UgPSBibG9jay5pbnZlcnNlO1xuXG5cdCAgICBwcm9ncmFtID0gcHJvZ3JhbSAmJiB0aGlzLmNvbXBpbGVQcm9ncmFtKHByb2dyYW0pO1xuXHQgICAgaW52ZXJzZSA9IGludmVyc2UgJiYgdGhpcy5jb21waWxlUHJvZ3JhbShpbnZlcnNlKTtcblxuXHQgICAgdmFyIHR5cGUgPSB0aGlzLmNsYXNzaWZ5U2V4cHIoYmxvY2spO1xuXG5cdCAgICBpZiAodHlwZSA9PT0gJ2hlbHBlcicpIHtcblx0ICAgICAgdGhpcy5oZWxwZXJTZXhwcihibG9jaywgcHJvZ3JhbSwgaW52ZXJzZSk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzaW1wbGUnKSB7XG5cdCAgICAgIHRoaXMuc2ltcGxlU2V4cHIoYmxvY2spO1xuXG5cdCAgICAgIC8vIG5vdyB0aGF0IHRoZSBzaW1wbGUgbXVzdGFjaGUgaXMgcmVzb2x2ZWQsIHdlIG5lZWQgdG9cblx0ICAgICAgLy8gZXZhbHVhdGUgaXQgYnkgZXhlY3V0aW5nIGBibG9ja0hlbHBlck1pc3NpbmdgXG5cdCAgICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIHByb2dyYW0pO1xuXHQgICAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBpbnZlcnNlKTtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2VtcHR5SGFzaCcpO1xuXHQgICAgICB0aGlzLm9wY29kZSgnYmxvY2tWYWx1ZScsIGJsb2NrLnBhdGgub3JpZ2luYWwpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5hbWJpZ3VvdXNTZXhwcihibG9jaywgcHJvZ3JhbSwgaW52ZXJzZSk7XG5cblx0ICAgICAgLy8gbm93IHRoYXQgdGhlIHNpbXBsZSBtdXN0YWNoZSBpcyByZXNvbHZlZCwgd2UgbmVlZCB0b1xuXHQgICAgICAvLyBldmFsdWF0ZSBpdCBieSBleGVjdXRpbmcgYGJsb2NrSGVscGVyTWlzc2luZ2Bcblx0ICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIGludmVyc2UpO1xuXHQgICAgICB0aGlzLm9wY29kZSgnZW1wdHlIYXNoJyk7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdhbWJpZ3VvdXNCbG9ja1ZhbHVlJyk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMub3Bjb2RlKCdhcHBlbmQnKTtcblx0ICB9LFxuXG5cdCAgRGVjb3JhdG9yQmxvY2s6IGZ1bmN0aW9uIERlY29yYXRvckJsb2NrKGRlY29yYXRvcikge1xuXHQgICAgdmFyIHByb2dyYW0gPSBkZWNvcmF0b3IucHJvZ3JhbSAmJiB0aGlzLmNvbXBpbGVQcm9ncmFtKGRlY29yYXRvci5wcm9ncmFtKTtcblx0ICAgIHZhciBwYXJhbXMgPSB0aGlzLnNldHVwRnVsbE11c3RhY2hlUGFyYW1zKGRlY29yYXRvciwgcHJvZ3JhbSwgdW5kZWZpbmVkKSxcblx0ICAgICAgICBwYXRoID0gZGVjb3JhdG9yLnBhdGg7XG5cblx0ICAgIHRoaXMudXNlRGVjb3JhdG9ycyA9IHRydWU7XG5cdCAgICB0aGlzLm9wY29kZSgncmVnaXN0ZXJEZWNvcmF0b3InLCBwYXJhbXMubGVuZ3RoLCBwYXRoLm9yaWdpbmFsKTtcblx0ICB9LFxuXG5cdCAgUGFydGlhbFN0YXRlbWVudDogZnVuY3Rpb24gUGFydGlhbFN0YXRlbWVudChwYXJ0aWFsKSB7XG5cdCAgICB0aGlzLnVzZVBhcnRpYWwgPSB0cnVlO1xuXG5cdCAgICB2YXIgcHJvZ3JhbSA9IHBhcnRpYWwucHJvZ3JhbTtcblx0ICAgIGlmIChwcm9ncmFtKSB7XG5cdCAgICAgIHByb2dyYW0gPSB0aGlzLmNvbXBpbGVQcm9ncmFtKHBhcnRpYWwucHJvZ3JhbSk7XG5cdCAgICB9XG5cblx0ICAgIHZhciBwYXJhbXMgPSBwYXJ0aWFsLnBhcmFtcztcblx0ICAgIGlmIChwYXJhbXMubGVuZ3RoID4gMSkge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVW5zdXBwb3J0ZWQgbnVtYmVyIG9mIHBhcnRpYWwgYXJndW1lbnRzOiAnICsgcGFyYW1zLmxlbmd0aCwgcGFydGlhbCk7XG5cdCAgICB9IGVsc2UgaWYgKCFwYXJhbXMubGVuZ3RoKSB7XG5cdCAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXhwbGljaXRQYXJ0aWFsQ29udGV4dCkge1xuXHQgICAgICAgIHRoaXMub3Bjb2RlKCdwdXNoTGl0ZXJhbCcsICd1bmRlZmluZWQnKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBwYXJhbXMucHVzaCh7IHR5cGU6ICdQYXRoRXhwcmVzc2lvbicsIHBhcnRzOiBbXSwgZGVwdGg6IDAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgdmFyIHBhcnRpYWxOYW1lID0gcGFydGlhbC5uYW1lLm9yaWdpbmFsLFxuXHQgICAgICAgIGlzRHluYW1pYyA9IHBhcnRpYWwubmFtZS50eXBlID09PSAnU3ViRXhwcmVzc2lvbic7XG5cdCAgICBpZiAoaXNEeW5hbWljKSB7XG5cdCAgICAgIHRoaXMuYWNjZXB0KHBhcnRpYWwubmFtZSk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXMocGFydGlhbCwgcHJvZ3JhbSwgdW5kZWZpbmVkLCB0cnVlKTtcblxuXHQgICAgdmFyIGluZGVudCA9IHBhcnRpYWwuaW5kZW50IHx8ICcnO1xuXHQgICAgaWYgKHRoaXMub3B0aW9ucy5wcmV2ZW50SW5kZW50ICYmIGluZGVudCkge1xuXHQgICAgICB0aGlzLm9wY29kZSgnYXBwZW5kQ29udGVudCcsIGluZGVudCk7XG5cdCAgICAgIGluZGVudCA9ICcnO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLm9wY29kZSgnaW52b2tlUGFydGlhbCcsIGlzRHluYW1pYywgcGFydGlhbE5hbWUsIGluZGVudCk7XG5cdCAgICB0aGlzLm9wY29kZSgnYXBwZW5kJyk7XG5cdCAgfSxcblx0ICBQYXJ0aWFsQmxvY2tTdGF0ZW1lbnQ6IGZ1bmN0aW9uIFBhcnRpYWxCbG9ja1N0YXRlbWVudChwYXJ0aWFsQmxvY2spIHtcblx0ICAgIHRoaXMuUGFydGlhbFN0YXRlbWVudChwYXJ0aWFsQmxvY2spO1xuXHQgIH0sXG5cblx0ICBNdXN0YWNoZVN0YXRlbWVudDogZnVuY3Rpb24gTXVzdGFjaGVTdGF0ZW1lbnQobXVzdGFjaGUpIHtcblx0ICAgIHRoaXMuU3ViRXhwcmVzc2lvbihtdXN0YWNoZSk7XG5cblx0ICAgIGlmIChtdXN0YWNoZS5lc2NhcGVkICYmICF0aGlzLm9wdGlvbnMubm9Fc2NhcGUpIHtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZEVzY2FwZWQnKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdhcHBlbmQnKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIERlY29yYXRvcjogZnVuY3Rpb24gRGVjb3JhdG9yKGRlY29yYXRvcikge1xuXHQgICAgdGhpcy5EZWNvcmF0b3JCbG9jayhkZWNvcmF0b3IpO1xuXHQgIH0sXG5cblx0ICBDb250ZW50U3RhdGVtZW50OiBmdW5jdGlvbiBDb250ZW50U3RhdGVtZW50KGNvbnRlbnQpIHtcblx0ICAgIGlmIChjb250ZW50LnZhbHVlKSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdhcHBlbmRDb250ZW50JywgY29udGVudC52YWx1ZSk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIENvbW1lbnRTdGF0ZW1lbnQ6IGZ1bmN0aW9uIENvbW1lbnRTdGF0ZW1lbnQoKSB7fSxcblxuXHQgIFN1YkV4cHJlc3Npb246IGZ1bmN0aW9uIFN1YkV4cHJlc3Npb24oc2V4cHIpIHtcblx0ICAgIHRyYW5zZm9ybUxpdGVyYWxUb1BhdGgoc2V4cHIpO1xuXHQgICAgdmFyIHR5cGUgPSB0aGlzLmNsYXNzaWZ5U2V4cHIoc2V4cHIpO1xuXG5cdCAgICBpZiAodHlwZSA9PT0gJ3NpbXBsZScpIHtcblx0ICAgICAgdGhpcy5zaW1wbGVTZXhwcihzZXhwcik7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdoZWxwZXInKSB7XG5cdCAgICAgIHRoaXMuaGVscGVyU2V4cHIoc2V4cHIpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5hbWJpZ3VvdXNTZXhwcihzZXhwcik7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBhbWJpZ3VvdXNTZXhwcjogZnVuY3Rpb24gYW1iaWd1b3VzU2V4cHIoc2V4cHIsIHByb2dyYW0sIGludmVyc2UpIHtcblx0ICAgIHZhciBwYXRoID0gc2V4cHIucGF0aCxcblx0ICAgICAgICBuYW1lID0gcGF0aC5wYXJ0c1swXSxcblx0ICAgICAgICBpc0Jsb2NrID0gcHJvZ3JhbSAhPSBudWxsIHx8IGludmVyc2UgIT0gbnVsbDtcblxuXHQgICAgdGhpcy5vcGNvZGUoJ2dldENvbnRleHQnLCBwYXRoLmRlcHRoKTtcblxuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBpbnZlcnNlKTtcblxuXHQgICAgcGF0aC5zdHJpY3QgPSB0cnVlO1xuXHQgICAgdGhpcy5hY2NlcHQocGF0aCk7XG5cblx0ICAgIHRoaXMub3Bjb2RlKCdpbnZva2VBbWJpZ3VvdXMnLCBuYW1lLCBpc0Jsb2NrKTtcblx0ICB9LFxuXG5cdCAgc2ltcGxlU2V4cHI6IGZ1bmN0aW9uIHNpbXBsZVNleHByKHNleHByKSB7XG5cdCAgICB2YXIgcGF0aCA9IHNleHByLnBhdGg7XG5cdCAgICBwYXRoLnN0cmljdCA9IHRydWU7XG5cdCAgICB0aGlzLmFjY2VwdChwYXRoKTtcblx0ICAgIHRoaXMub3Bjb2RlKCdyZXNvbHZlUG9zc2libGVMYW1iZGEnKTtcblx0ICB9LFxuXG5cdCAgaGVscGVyU2V4cHI6IGZ1bmN0aW9uIGhlbHBlclNleHByKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlKSB7XG5cdCAgICB2YXIgcGFyYW1zID0gdGhpcy5zZXR1cEZ1bGxNdXN0YWNoZVBhcmFtcyhzZXhwciwgcHJvZ3JhbSwgaW52ZXJzZSksXG5cdCAgICAgICAgcGF0aCA9IHNleHByLnBhdGgsXG5cdCAgICAgICAgbmFtZSA9IHBhdGgucGFydHNbMF07XG5cblx0ICAgIGlmICh0aGlzLm9wdGlvbnMua25vd25IZWxwZXJzW25hbWVdKSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdpbnZva2VLbm93bkhlbHBlcicsIHBhcmFtcy5sZW5ndGgsIG5hbWUpO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMua25vd25IZWxwZXJzT25seSkge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnWW91IHNwZWNpZmllZCBrbm93bkhlbHBlcnNPbmx5LCBidXQgdXNlZCB0aGUgdW5rbm93biBoZWxwZXIgJyArIG5hbWUsIHNleHByKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHBhdGguc3RyaWN0ID0gdHJ1ZTtcblx0ICAgICAgcGF0aC5mYWxzeSA9IHRydWU7XG5cblx0ICAgICAgdGhpcy5hY2NlcHQocGF0aCk7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdpbnZva2VIZWxwZXInLCBwYXJhbXMubGVuZ3RoLCBwYXRoLm9yaWdpbmFsLCBfYXN0MlsnZGVmYXVsdCddLmhlbHBlcnMuc2ltcGxlSWQocGF0aCkpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBQYXRoRXhwcmVzc2lvbjogZnVuY3Rpb24gUGF0aEV4cHJlc3Npb24ocGF0aCkge1xuXHQgICAgdGhpcy5hZGREZXB0aChwYXRoLmRlcHRoKTtcblx0ICAgIHRoaXMub3Bjb2RlKCdnZXRDb250ZXh0JywgcGF0aC5kZXB0aCk7XG5cblx0ICAgIHZhciBuYW1lID0gcGF0aC5wYXJ0c1swXSxcblx0ICAgICAgICBzY29wZWQgPSBfYXN0MlsnZGVmYXVsdCddLmhlbHBlcnMuc2NvcGVkSWQocGF0aCksXG5cdCAgICAgICAgYmxvY2tQYXJhbUlkID0gIXBhdGguZGVwdGggJiYgIXNjb3BlZCAmJiB0aGlzLmJsb2NrUGFyYW1JbmRleChuYW1lKTtcblxuXHQgICAgaWYgKGJsb2NrUGFyYW1JZCkge1xuXHQgICAgICB0aGlzLm9wY29kZSgnbG9va3VwQmxvY2tQYXJhbScsIGJsb2NrUGFyYW1JZCwgcGF0aC5wYXJ0cyk7XG5cdCAgICB9IGVsc2UgaWYgKCFuYW1lKSB7XG5cdCAgICAgIC8vIENvbnRleHQgcmVmZXJlbmNlLCBpLmUuIGB7e2ZvbyAufX1gIG9yIGB7e2ZvbyAuLn19YFxuXHQgICAgICB0aGlzLm9wY29kZSgncHVzaENvbnRleHQnKTtcblx0ICAgIH0gZWxzZSBpZiAocGF0aC5kYXRhKSB7XG5cdCAgICAgIHRoaXMub3B0aW9ucy5kYXRhID0gdHJ1ZTtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2xvb2t1cERhdGEnLCBwYXRoLmRlcHRoLCBwYXRoLnBhcnRzLCBwYXRoLnN0cmljdCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLm9wY29kZSgnbG9va3VwT25Db250ZXh0JywgcGF0aC5wYXJ0cywgcGF0aC5mYWxzeSwgcGF0aC5zdHJpY3QsIHNjb3BlZCk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIFN0cmluZ0xpdGVyYWw6IGZ1bmN0aW9uIFN0cmluZ0xpdGVyYWwoc3RyaW5nKSB7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaFN0cmluZycsIHN0cmluZy52YWx1ZSk7XG5cdCAgfSxcblxuXHQgIE51bWJlckxpdGVyYWw6IGZ1bmN0aW9uIE51bWJlckxpdGVyYWwobnVtYmVyKSB7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCBudW1iZXIudmFsdWUpO1xuXHQgIH0sXG5cblx0ICBCb29sZWFuTGl0ZXJhbDogZnVuY3Rpb24gQm9vbGVhbkxpdGVyYWwoYm9vbCkge1xuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgYm9vbC52YWx1ZSk7XG5cdCAgfSxcblxuXHQgIFVuZGVmaW5lZExpdGVyYWw6IGZ1bmN0aW9uIFVuZGVmaW5lZExpdGVyYWwoKSB7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCAndW5kZWZpbmVkJyk7XG5cdCAgfSxcblxuXHQgIE51bGxMaXRlcmFsOiBmdW5jdGlvbiBOdWxsTGl0ZXJhbCgpIHtcblx0ICAgIHRoaXMub3Bjb2RlKCdwdXNoTGl0ZXJhbCcsICdudWxsJyk7XG5cdCAgfSxcblxuXHQgIEhhc2g6IGZ1bmN0aW9uIEhhc2goaGFzaCkge1xuXHQgICAgdmFyIHBhaXJzID0gaGFzaC5wYWlycyxcblx0ICAgICAgICBpID0gMCxcblx0ICAgICAgICBsID0gcGFpcnMubGVuZ3RoO1xuXG5cdCAgICB0aGlzLm9wY29kZSgncHVzaEhhc2gnKTtcblxuXHQgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgdGhpcy5wdXNoUGFyYW0ocGFpcnNbaV0udmFsdWUpO1xuXHQgICAgfVxuXHQgICAgd2hpbGUgKGktLSkge1xuXHQgICAgICB0aGlzLm9wY29kZSgnYXNzaWduVG9IYXNoJywgcGFpcnNbaV0ua2V5KTtcblx0ICAgIH1cblx0ICAgIHRoaXMub3Bjb2RlKCdwb3BIYXNoJyk7XG5cdCAgfSxcblxuXHQgIC8vIEhFTFBFUlNcblx0ICBvcGNvZGU6IGZ1bmN0aW9uIG9wY29kZShuYW1lKSB7XG5cdCAgICB0aGlzLm9wY29kZXMucHVzaCh7IG9wY29kZTogbmFtZSwgYXJnczogc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBsb2M6IHRoaXMuc291cmNlTm9kZVswXS5sb2MgfSk7XG5cdCAgfSxcblxuXHQgIGFkZERlcHRoOiBmdW5jdGlvbiBhZGREZXB0aChkZXB0aCkge1xuXHQgICAgaWYgKCFkZXB0aCkge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHRoaXMudXNlRGVwdGhzID0gdHJ1ZTtcblx0ICB9LFxuXG5cdCAgY2xhc3NpZnlTZXhwcjogZnVuY3Rpb24gY2xhc3NpZnlTZXhwcihzZXhwcikge1xuXHQgICAgdmFyIGlzU2ltcGxlID0gX2FzdDJbJ2RlZmF1bHQnXS5oZWxwZXJzLnNpbXBsZUlkKHNleHByLnBhdGgpO1xuXG5cdCAgICB2YXIgaXNCbG9ja1BhcmFtID0gaXNTaW1wbGUgJiYgISF0aGlzLmJsb2NrUGFyYW1JbmRleChzZXhwci5wYXRoLnBhcnRzWzBdKTtcblxuXHQgICAgLy8gYSBtdXN0YWNoZSBpcyBhbiBlbGlnaWJsZSBoZWxwZXIgaWY6XG5cdCAgICAvLyAqIGl0cyBpZCBpcyBzaW1wbGUgKGEgc2luZ2xlIHBhcnQsIG5vdCBgdGhpc2Agb3IgYC4uYClcblx0ICAgIHZhciBpc0hlbHBlciA9ICFpc0Jsb2NrUGFyYW0gJiYgX2FzdDJbJ2RlZmF1bHQnXS5oZWxwZXJzLmhlbHBlckV4cHJlc3Npb24oc2V4cHIpO1xuXG5cdCAgICAvLyBpZiBhIG11c3RhY2hlIGlzIGFuIGVsaWdpYmxlIGhlbHBlciBidXQgbm90IGEgZGVmaW5pdGVcblx0ICAgIC8vIGhlbHBlciwgaXQgaXMgYW1iaWd1b3VzLCBhbmQgd2lsbCBiZSByZXNvbHZlZCBpbiBhIGxhdGVyXG5cdCAgICAvLyBwYXNzIG9yIGF0IHJ1bnRpbWUuXG5cdCAgICB2YXIgaXNFbGlnaWJsZSA9ICFpc0Jsb2NrUGFyYW0gJiYgKGlzSGVscGVyIHx8IGlzU2ltcGxlKTtcblxuXHQgICAgLy8gaWYgYW1iaWd1b3VzLCB3ZSBjYW4gcG9zc2libHkgcmVzb2x2ZSB0aGUgYW1iaWd1aXR5IG5vd1xuXHQgICAgLy8gQW4gZWxpZ2libGUgaGVscGVyIGlzIG9uZSB0aGF0IGRvZXMgbm90IGhhdmUgYSBjb21wbGV4IHBhdGgsIGkuZS4gYHRoaXMuZm9vYCwgYC4uL2Zvb2AgZXRjLlxuXHQgICAgaWYgKGlzRWxpZ2libGUgJiYgIWlzSGVscGVyKSB7XG5cdCAgICAgIHZhciBfbmFtZTIgPSBzZXhwci5wYXRoLnBhcnRzWzBdLFxuXHQgICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXHQgICAgICBpZiAob3B0aW9ucy5rbm93bkhlbHBlcnNbX25hbWUyXSkge1xuXHQgICAgICAgIGlzSGVscGVyID0gdHJ1ZTtcblx0ICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmtub3duSGVscGVyc09ubHkpIHtcblx0ICAgICAgICBpc0VsaWdpYmxlID0gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgaWYgKGlzSGVscGVyKSB7XG5cdCAgICAgIHJldHVybiAnaGVscGVyJztcblx0ICAgIH0gZWxzZSBpZiAoaXNFbGlnaWJsZSkge1xuXHQgICAgICByZXR1cm4gJ2FtYmlndW91cyc7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gJ3NpbXBsZSc7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHB1c2hQYXJhbXM6IGZ1bmN0aW9uIHB1c2hQYXJhbXMocGFyYW1zKSB7XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhcmFtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgdGhpcy5wdXNoUGFyYW0ocGFyYW1zW2ldKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgcHVzaFBhcmFtOiBmdW5jdGlvbiBwdXNoUGFyYW0odmFsKSB7XG5cdCAgICB2YXIgdmFsdWUgPSB2YWwudmFsdWUgIT0gbnVsbCA/IHZhbC52YWx1ZSA6IHZhbC5vcmlnaW5hbCB8fCAnJztcblxuXHQgICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG5cdCAgICAgIGlmICh2YWx1ZS5yZXBsYWNlKSB7XG5cdCAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9eKFxcLj9cXC5cXC8pKi9nLCAnJykucmVwbGFjZSgvXFwvL2csICcuJyk7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAodmFsLmRlcHRoKSB7XG5cdCAgICAgICAgdGhpcy5hZGREZXB0aCh2YWwuZGVwdGgpO1xuXHQgICAgICB9XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdnZXRDb250ZXh0JywgdmFsLmRlcHRoIHx8IDApO1xuXHQgICAgICB0aGlzLm9wY29kZSgncHVzaFN0cmluZ1BhcmFtJywgdmFsdWUsIHZhbC50eXBlKTtcblxuXHQgICAgICBpZiAodmFsLnR5cGUgPT09ICdTdWJFeHByZXNzaW9uJykge1xuXHQgICAgICAgIC8vIFN1YkV4cHJlc3Npb25zIGdldCBldmFsdWF0ZWQgYW5kIHBhc3NlZCBpblxuXHQgICAgICAgIC8vIGluIHN0cmluZyBwYXJhbXMgbW9kZS5cblx0ICAgICAgICB0aGlzLmFjY2VwdCh2YWwpO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBpZiAodGhpcy50cmFja0lkcykge1xuXHQgICAgICAgIHZhciBibG9ja1BhcmFtSW5kZXggPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgaWYgKHZhbC5wYXJ0cyAmJiAhX2FzdDJbJ2RlZmF1bHQnXS5oZWxwZXJzLnNjb3BlZElkKHZhbCkgJiYgIXZhbC5kZXB0aCkge1xuXHQgICAgICAgICAgYmxvY2tQYXJhbUluZGV4ID0gdGhpcy5ibG9ja1BhcmFtSW5kZXgodmFsLnBhcnRzWzBdKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKGJsb2NrUGFyYW1JbmRleCkge1xuXHQgICAgICAgICAgdmFyIGJsb2NrUGFyYW1DaGlsZCA9IHZhbC5wYXJ0cy5zbGljZSgxKS5qb2luKCcuJyk7XG5cdCAgICAgICAgICB0aGlzLm9wY29kZSgncHVzaElkJywgJ0Jsb2NrUGFyYW0nLCBibG9ja1BhcmFtSW5kZXgsIGJsb2NrUGFyYW1DaGlsZCk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHZhbHVlID0gdmFsLm9yaWdpbmFsIHx8IHZhbHVlO1xuXHQgICAgICAgICAgaWYgKHZhbHVlLnJlcGxhY2UpIHtcblx0ICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9edGhpcyg/OlxcLnwkKS8sICcnKS5yZXBsYWNlKC9eXFwuXFwvLywgJycpLnJlcGxhY2UoL15cXC4kLywgJycpO1xuXHQgICAgICAgICAgfVxuXG5cdCAgICAgICAgICB0aGlzLm9wY29kZSgncHVzaElkJywgdmFsLnR5cGUsIHZhbHVlKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5hY2NlcHQodmFsKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXM6IGZ1bmN0aW9uIHNldHVwRnVsbE11c3RhY2hlUGFyYW1zKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlLCBvbWl0RW1wdHkpIHtcblx0ICAgIHZhciBwYXJhbXMgPSBzZXhwci5wYXJhbXM7XG5cdCAgICB0aGlzLnB1c2hQYXJhbXMocGFyYW1zKTtcblxuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBpbnZlcnNlKTtcblxuXHQgICAgaWYgKHNleHByLmhhc2gpIHtcblx0ICAgICAgdGhpcy5hY2NlcHQoc2V4cHIuaGFzaCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLm9wY29kZSgnZW1wdHlIYXNoJywgb21pdEVtcHR5KTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHBhcmFtcztcblx0ICB9LFxuXG5cdCAgYmxvY2tQYXJhbUluZGV4OiBmdW5jdGlvbiBibG9ja1BhcmFtSW5kZXgobmFtZSkge1xuXHQgICAgZm9yICh2YXIgZGVwdGggPSAwLCBsZW4gPSB0aGlzLm9wdGlvbnMuYmxvY2tQYXJhbXMubGVuZ3RoOyBkZXB0aCA8IGxlbjsgZGVwdGgrKykge1xuXHQgICAgICB2YXIgYmxvY2tQYXJhbXMgPSB0aGlzLm9wdGlvbnMuYmxvY2tQYXJhbXNbZGVwdGhdLFxuXHQgICAgICAgICAgcGFyYW0gPSBibG9ja1BhcmFtcyAmJiBfdXRpbHMuaW5kZXhPZihibG9ja1BhcmFtcywgbmFtZSk7XG5cdCAgICAgIGlmIChibG9ja1BhcmFtcyAmJiBwYXJhbSA+PSAwKSB7XG5cdCAgICAgICAgcmV0dXJuIFtkZXB0aCwgcGFyYW1dO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXG5cdGZ1bmN0aW9uIHByZWNvbXBpbGUoaW5wdXQsIG9wdGlvbnMsIGVudikge1xuXHQgIGlmIChpbnB1dCA9PSBudWxsIHx8IHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycgJiYgaW5wdXQudHlwZSAhPT0gJ1Byb2dyYW0nKSB7XG5cdCAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnWW91IG11c3QgcGFzcyBhIHN0cmluZyBvciBIYW5kbGViYXJzIEFTVCB0byBIYW5kbGViYXJzLnByZWNvbXBpbGUuIFlvdSBwYXNzZWQgJyArIGlucHV0KTtcblx0ICB9XG5cblx0ICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0ICBpZiAoISgnZGF0YScgaW4gb3B0aW9ucykpIHtcblx0ICAgIG9wdGlvbnMuZGF0YSA9IHRydWU7XG5cdCAgfVxuXHQgIGlmIChvcHRpb25zLmNvbXBhdCkge1xuXHQgICAgb3B0aW9ucy51c2VEZXB0aHMgPSB0cnVlO1xuXHQgIH1cblxuXHQgIHZhciBhc3QgPSBlbnYucGFyc2UoaW5wdXQsIG9wdGlvbnMpLFxuXHQgICAgICBlbnZpcm9ubWVudCA9IG5ldyBlbnYuQ29tcGlsZXIoKS5jb21waWxlKGFzdCwgb3B0aW9ucyk7XG5cdCAgcmV0dXJuIG5ldyBlbnYuSmF2YVNjcmlwdENvbXBpbGVyKCkuY29tcGlsZShlbnZpcm9ubWVudCwgb3B0aW9ucyk7XG5cdH1cblxuXHRmdW5jdGlvbiBjb21waWxlKGlucHV0LCBvcHRpb25zLCBlbnYpIHtcblx0ICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSBvcHRpb25zID0ge307XG5cblx0ICBpZiAoaW5wdXQgPT0gbnVsbCB8fCB0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnICYmIGlucHV0LnR5cGUgIT09ICdQcm9ncmFtJykge1xuXHQgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1lvdSBtdXN0IHBhc3MgYSBzdHJpbmcgb3IgSGFuZGxlYmFycyBBU1QgdG8gSGFuZGxlYmFycy5jb21waWxlLiBZb3UgcGFzc2VkICcgKyBpbnB1dCk7XG5cdCAgfVxuXG5cdCAgb3B0aW9ucyA9IF91dGlscy5leHRlbmQoe30sIG9wdGlvbnMpO1xuXHQgIGlmICghKCdkYXRhJyBpbiBvcHRpb25zKSkge1xuXHQgICAgb3B0aW9ucy5kYXRhID0gdHJ1ZTtcblx0ICB9XG5cdCAgaWYgKG9wdGlvbnMuY29tcGF0KSB7XG5cdCAgICBvcHRpb25zLnVzZURlcHRocyA9IHRydWU7XG5cdCAgfVxuXG5cdCAgdmFyIGNvbXBpbGVkID0gdW5kZWZpbmVkO1xuXG5cdCAgZnVuY3Rpb24gY29tcGlsZUlucHV0KCkge1xuXHQgICAgdmFyIGFzdCA9IGVudi5wYXJzZShpbnB1dCwgb3B0aW9ucyksXG5cdCAgICAgICAgZW52aXJvbm1lbnQgPSBuZXcgZW52LkNvbXBpbGVyKCkuY29tcGlsZShhc3QsIG9wdGlvbnMpLFxuXHQgICAgICAgIHRlbXBsYXRlU3BlYyA9IG5ldyBlbnYuSmF2YVNjcmlwdENvbXBpbGVyKCkuY29tcGlsZShlbnZpcm9ubWVudCwgb3B0aW9ucywgdW5kZWZpbmVkLCB0cnVlKTtcblx0ICAgIHJldHVybiBlbnYudGVtcGxhdGUodGVtcGxhdGVTcGVjKTtcblx0ICB9XG5cblx0ICAvLyBUZW1wbGF0ZSBpcyBvbmx5IGNvbXBpbGVkIG9uIGZpcnN0IHVzZSBhbmQgY2FjaGVkIGFmdGVyIHRoYXQgcG9pbnQuXG5cdCAgZnVuY3Rpb24gcmV0KGNvbnRleHQsIGV4ZWNPcHRpb25zKSB7XG5cdCAgICBpZiAoIWNvbXBpbGVkKSB7XG5cdCAgICAgIGNvbXBpbGVkID0gY29tcGlsZUlucHV0KCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gY29tcGlsZWQuY2FsbCh0aGlzLCBjb250ZXh0LCBleGVjT3B0aW9ucyk7XG5cdCAgfVxuXHQgIHJldC5fc2V0dXAgPSBmdW5jdGlvbiAoc2V0dXBPcHRpb25zKSB7XG5cdCAgICBpZiAoIWNvbXBpbGVkKSB7XG5cdCAgICAgIGNvbXBpbGVkID0gY29tcGlsZUlucHV0KCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gY29tcGlsZWQuX3NldHVwKHNldHVwT3B0aW9ucyk7XG5cdCAgfTtcblx0ICByZXQuX2NoaWxkID0gZnVuY3Rpb24gKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcblx0ICAgIGlmICghY29tcGlsZWQpIHtcblx0ICAgICAgY29tcGlsZWQgPSBjb21waWxlSW5wdXQoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjb21waWxlZC5fY2hpbGQoaSwgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG5cdCAgfTtcblx0ICByZXR1cm4gcmV0O1xuXHR9XG5cblx0ZnVuY3Rpb24gYXJnRXF1YWxzKGEsIGIpIHtcblx0ICBpZiAoYSA9PT0gYikge1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXG5cdCAgaWYgKF91dGlscy5pc0FycmF5KGEpICYmIF91dGlscy5pc0FycmF5KGIpICYmIGEubGVuZ3RoID09PSBiLmxlbmd0aCkge1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIGlmICghYXJnRXF1YWxzKGFbaV0sIGJbaV0pKSB7XG5cdCAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cdH1cblxuXHRmdW5jdGlvbiB0cmFuc2Zvcm1MaXRlcmFsVG9QYXRoKHNleHByKSB7XG5cdCAgaWYgKCFzZXhwci5wYXRoLnBhcnRzKSB7XG5cdCAgICB2YXIgbGl0ZXJhbCA9IHNleHByLnBhdGg7XG5cdCAgICAvLyBDYXN0aW5nIHRvIHN0cmluZyBoZXJlIHRvIG1ha2UgZmFsc2UgYW5kIDAgbGl0ZXJhbCB2YWx1ZXMgcGxheSBuaWNlbHkgd2l0aCB0aGUgcmVzdFxuXHQgICAgLy8gb2YgdGhlIHN5c3RlbS5cblx0ICAgIHNleHByLnBhdGggPSB7XG5cdCAgICAgIHR5cGU6ICdQYXRoRXhwcmVzc2lvbicsXG5cdCAgICAgIGRhdGE6IGZhbHNlLFxuXHQgICAgICBkZXB0aDogMCxcblx0ICAgICAgcGFydHM6IFtsaXRlcmFsLm9yaWdpbmFsICsgJyddLFxuXHQgICAgICBvcmlnaW5hbDogbGl0ZXJhbC5vcmlnaW5hbCArICcnLFxuXHQgICAgICBsb2M6IGxpdGVyYWwubG9jXG5cdCAgICB9O1xuXHQgIH1cblx0fVxuXG4vKioqLyB9KSxcbi8qIDQyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF9iYXNlID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHR2YXIgX2NvZGVHZW4gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQzKTtcblxuXHR2YXIgX2NvZGVHZW4yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29kZUdlbik7XG5cblx0ZnVuY3Rpb24gTGl0ZXJhbCh2YWx1ZSkge1xuXHQgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIEphdmFTY3JpcHRDb21waWxlcigpIHt9XG5cblx0SmF2YVNjcmlwdENvbXBpbGVyLnByb3RvdHlwZSA9IHtcblx0ICAvLyBQVUJMSUMgQVBJOiBZb3UgY2FuIG92ZXJyaWRlIHRoZXNlIG1ldGhvZHMgaW4gYSBzdWJjbGFzcyB0byBwcm92aWRlXG5cdCAgLy8gYWx0ZXJuYXRpdmUgY29tcGlsZWQgZm9ybXMgZm9yIG5hbWUgbG9va3VwIGFuZCBidWZmZXJpbmcgc2VtYW50aWNzXG5cdCAgbmFtZUxvb2t1cDogZnVuY3Rpb24gbmFtZUxvb2t1cChwYXJlbnQsIG5hbWUgLyogLCB0eXBlKi8pIHtcblx0ICAgIGlmIChKYXZhU2NyaXB0Q29tcGlsZXIuaXNWYWxpZEphdmFTY3JpcHRWYXJpYWJsZU5hbWUobmFtZSkpIHtcblx0ICAgICAgcmV0dXJuIFtwYXJlbnQsICcuJywgbmFtZV07XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gW3BhcmVudCwgJ1snLCBKU09OLnN0cmluZ2lmeShuYW1lKSwgJ10nXTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIGRlcHRoZWRMb29rdXA6IGZ1bmN0aW9uIGRlcHRoZWRMb29rdXAobmFtZSkge1xuXHQgICAgcmV0dXJuIFt0aGlzLmFsaWFzYWJsZSgnY29udGFpbmVyLmxvb2t1cCcpLCAnKGRlcHRocywgXCInLCBuYW1lLCAnXCIpJ107XG5cdCAgfSxcblxuXHQgIGNvbXBpbGVySW5mbzogZnVuY3Rpb24gY29tcGlsZXJJbmZvKCkge1xuXHQgICAgdmFyIHJldmlzaW9uID0gX2Jhc2UuQ09NUElMRVJfUkVWSVNJT04sXG5cdCAgICAgICAgdmVyc2lvbnMgPSBfYmFzZS5SRVZJU0lPTl9DSEFOR0VTW3JldmlzaW9uXTtcblx0ICAgIHJldHVybiBbcmV2aXNpb24sIHZlcnNpb25zXTtcblx0ICB9LFxuXG5cdCAgYXBwZW5kVG9CdWZmZXI6IGZ1bmN0aW9uIGFwcGVuZFRvQnVmZmVyKHNvdXJjZSwgbG9jYXRpb24sIGV4cGxpY2l0KSB7XG5cdCAgICAvLyBGb3JjZSBhIHNvdXJjZSBhcyB0aGlzIHNpbXBsaWZpZXMgdGhlIG1lcmdlIGxvZ2ljLlxuXHQgICAgaWYgKCFfdXRpbHMuaXNBcnJheShzb3VyY2UpKSB7XG5cdCAgICAgIHNvdXJjZSA9IFtzb3VyY2VdO1xuXHQgICAgfVxuXHQgICAgc291cmNlID0gdGhpcy5zb3VyY2Uud3JhcChzb3VyY2UsIGxvY2F0aW9uKTtcblxuXHQgICAgaWYgKHRoaXMuZW52aXJvbm1lbnQuaXNTaW1wbGUpIHtcblx0ICAgICAgcmV0dXJuIFsncmV0dXJuICcsIHNvdXJjZSwgJzsnXTtcblx0ICAgIH0gZWxzZSBpZiAoZXhwbGljaXQpIHtcblx0ICAgICAgLy8gVGhpcyBpcyBhIGNhc2Ugd2hlcmUgdGhlIGJ1ZmZlciBvcGVyYXRpb24gb2NjdXJzIGFzIGEgY2hpbGQgb2YgYW5vdGhlclxuXHQgICAgICAvLyBjb25zdHJ1Y3QsIGdlbmVyYWxseSBicmFjZXMuIFdlIGhhdmUgdG8gZXhwbGljaXRseSBvdXRwdXQgdGhlc2UgYnVmZmVyXG5cdCAgICAgIC8vIG9wZXJhdGlvbnMgdG8gZW5zdXJlIHRoYXQgdGhlIGVtaXR0ZWQgY29kZSBnb2VzIGluIHRoZSBjb3JyZWN0IGxvY2F0aW9uLlxuXHQgICAgICByZXR1cm4gWydidWZmZXIgKz0gJywgc291cmNlLCAnOyddO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc291cmNlLmFwcGVuZFRvQnVmZmVyID0gdHJ1ZTtcblx0ICAgICAgcmV0dXJuIHNvdXJjZTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgaW5pdGlhbGl6ZUJ1ZmZlcjogZnVuY3Rpb24gaW5pdGlhbGl6ZUJ1ZmZlcigpIHtcblx0ICAgIHJldHVybiB0aGlzLnF1b3RlZFN0cmluZygnJyk7XG5cdCAgfSxcblx0ICAvLyBFTkQgUFVCTElDIEFQSVxuXG5cdCAgY29tcGlsZTogZnVuY3Rpb24gY29tcGlsZShlbnZpcm9ubWVudCwgb3B0aW9ucywgY29udGV4dCwgYXNPYmplY3QpIHtcblx0ICAgIHRoaXMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDtcblx0ICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdCAgICB0aGlzLnN0cmluZ1BhcmFtcyA9IHRoaXMub3B0aW9ucy5zdHJpbmdQYXJhbXM7XG5cdCAgICB0aGlzLnRyYWNrSWRzID0gdGhpcy5vcHRpb25zLnRyYWNrSWRzO1xuXHQgICAgdGhpcy5wcmVjb21waWxlID0gIWFzT2JqZWN0O1xuXG5cdCAgICB0aGlzLm5hbWUgPSB0aGlzLmVudmlyb25tZW50Lm5hbWU7XG5cdCAgICB0aGlzLmlzQ2hpbGQgPSAhIWNvbnRleHQ7XG5cdCAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0IHx8IHtcblx0ICAgICAgZGVjb3JhdG9yczogW10sXG5cdCAgICAgIHByb2dyYW1zOiBbXSxcblx0ICAgICAgZW52aXJvbm1lbnRzOiBbXVxuXHQgICAgfTtcblxuXHQgICAgdGhpcy5wcmVhbWJsZSgpO1xuXG5cdCAgICB0aGlzLnN0YWNrU2xvdCA9IDA7XG5cdCAgICB0aGlzLnN0YWNrVmFycyA9IFtdO1xuXHQgICAgdGhpcy5hbGlhc2VzID0ge307XG5cdCAgICB0aGlzLnJlZ2lzdGVycyA9IHsgbGlzdDogW10gfTtcblx0ICAgIHRoaXMuaGFzaGVzID0gW107XG5cdCAgICB0aGlzLmNvbXBpbGVTdGFjayA9IFtdO1xuXHQgICAgdGhpcy5pbmxpbmVTdGFjayA9IFtdO1xuXHQgICAgdGhpcy5ibG9ja1BhcmFtcyA9IFtdO1xuXG5cdCAgICB0aGlzLmNvbXBpbGVDaGlsZHJlbihlbnZpcm9ubWVudCwgb3B0aW9ucyk7XG5cblx0ICAgIHRoaXMudXNlRGVwdGhzID0gdGhpcy51c2VEZXB0aHMgfHwgZW52aXJvbm1lbnQudXNlRGVwdGhzIHx8IGVudmlyb25tZW50LnVzZURlY29yYXRvcnMgfHwgdGhpcy5vcHRpb25zLmNvbXBhdDtcblx0ICAgIHRoaXMudXNlQmxvY2tQYXJhbXMgPSB0aGlzLnVzZUJsb2NrUGFyYW1zIHx8IGVudmlyb25tZW50LnVzZUJsb2NrUGFyYW1zO1xuXG5cdCAgICB2YXIgb3Bjb2RlcyA9IGVudmlyb25tZW50Lm9wY29kZXMsXG5cdCAgICAgICAgb3Bjb2RlID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGZpcnN0TG9jID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGkgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgbCA9IHVuZGVmaW5lZDtcblxuXHQgICAgZm9yIChpID0gMCwgbCA9IG9wY29kZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgIG9wY29kZSA9IG9wY29kZXNbaV07XG5cblx0ICAgICAgdGhpcy5zb3VyY2UuY3VycmVudExvY2F0aW9uID0gb3Bjb2RlLmxvYztcblx0ICAgICAgZmlyc3RMb2MgPSBmaXJzdExvYyB8fCBvcGNvZGUubG9jO1xuXHQgICAgICB0aGlzW29wY29kZS5vcGNvZGVdLmFwcGx5KHRoaXMsIG9wY29kZS5hcmdzKTtcblx0ICAgIH1cblxuXHQgICAgLy8gRmx1c2ggYW55IHRyYWlsaW5nIGNvbnRlbnQgdGhhdCBtaWdodCBiZSBwZW5kaW5nLlxuXHQgICAgdGhpcy5zb3VyY2UuY3VycmVudExvY2F0aW9uID0gZmlyc3RMb2M7XG5cdCAgICB0aGlzLnB1c2hTb3VyY2UoJycpO1xuXG5cdCAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgICAgaWYgKHRoaXMuc3RhY2tTbG90IHx8IHRoaXMuaW5saW5lU3RhY2subGVuZ3RoIHx8IHRoaXMuY29tcGlsZVN0YWNrLmxlbmd0aCkge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnQ29tcGlsZSBjb21wbGV0ZWQgd2l0aCBjb250ZW50IGxlZnQgb24gc3RhY2snKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKCF0aGlzLmRlY29yYXRvcnMuaXNFbXB0eSgpKSB7XG5cdCAgICAgIHRoaXMudXNlRGVjb3JhdG9ycyA9IHRydWU7XG5cblx0ICAgICAgdGhpcy5kZWNvcmF0b3JzLnByZXBlbmQoJ3ZhciBkZWNvcmF0b3JzID0gY29udGFpbmVyLmRlY29yYXRvcnM7XFxuJyk7XG5cdCAgICAgIHRoaXMuZGVjb3JhdG9ycy5wdXNoKCdyZXR1cm4gZm47Jyk7XG5cblx0ICAgICAgaWYgKGFzT2JqZWN0KSB7XG5cdCAgICAgICAgdGhpcy5kZWNvcmF0b3JzID0gRnVuY3Rpb24uYXBwbHkodGhpcywgWydmbicsICdwcm9wcycsICdjb250YWluZXInLCAnZGVwdGgwJywgJ2RhdGEnLCAnYmxvY2tQYXJhbXMnLCAnZGVwdGhzJywgdGhpcy5kZWNvcmF0b3JzLm1lcmdlKCldKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB0aGlzLmRlY29yYXRvcnMucHJlcGVuZCgnZnVuY3Rpb24oZm4sIHByb3BzLCBjb250YWluZXIsIGRlcHRoMCwgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocykge1xcbicpO1xuXHQgICAgICAgIHRoaXMuZGVjb3JhdG9ycy5wdXNoKCd9XFxuJyk7XG5cdCAgICAgICAgdGhpcy5kZWNvcmF0b3JzID0gdGhpcy5kZWNvcmF0b3JzLm1lcmdlKCk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMuZGVjb3JhdG9ycyA9IHVuZGVmaW5lZDtcblx0ICAgIH1cblxuXHQgICAgdmFyIGZuID0gdGhpcy5jcmVhdGVGdW5jdGlvbkNvbnRleHQoYXNPYmplY3QpO1xuXHQgICAgaWYgKCF0aGlzLmlzQ2hpbGQpIHtcblx0ICAgICAgdmFyIHJldCA9IHtcblx0ICAgICAgICBjb21waWxlcjogdGhpcy5jb21waWxlckluZm8oKSxcblx0ICAgICAgICBtYWluOiBmblxuXHQgICAgICB9O1xuXG5cdCAgICAgIGlmICh0aGlzLmRlY29yYXRvcnMpIHtcblx0ICAgICAgICByZXQubWFpbl9kID0gdGhpcy5kZWNvcmF0b3JzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNhbWVsY2FzZVxuXHQgICAgICAgIHJldC51c2VEZWNvcmF0b3JzID0gdHJ1ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHZhciBfY29udGV4dCA9IHRoaXMuY29udGV4dDtcblx0ICAgICAgdmFyIHByb2dyYW1zID0gX2NvbnRleHQucHJvZ3JhbXM7XG5cdCAgICAgIHZhciBkZWNvcmF0b3JzID0gX2NvbnRleHQuZGVjb3JhdG9ycztcblxuXHQgICAgICBmb3IgKGkgPSAwLCBsID0gcHJvZ3JhbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgICAgaWYgKHByb2dyYW1zW2ldKSB7XG5cdCAgICAgICAgICByZXRbaV0gPSBwcm9ncmFtc1tpXTtcblx0ICAgICAgICAgIGlmIChkZWNvcmF0b3JzW2ldKSB7XG5cdCAgICAgICAgICAgIHJldFtpICsgJ19kJ10gPSBkZWNvcmF0b3JzW2ldO1xuXHQgICAgICAgICAgICByZXQudXNlRGVjb3JhdG9ycyA9IHRydWU7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKHRoaXMuZW52aXJvbm1lbnQudXNlUGFydGlhbCkge1xuXHQgICAgICAgIHJldC51c2VQYXJ0aWFsID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAodGhpcy5vcHRpb25zLmRhdGEpIHtcblx0ICAgICAgICByZXQudXNlRGF0YSA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHRoaXMudXNlRGVwdGhzKSB7XG5cdCAgICAgICAgcmV0LnVzZURlcHRocyA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHRoaXMudXNlQmxvY2tQYXJhbXMpIHtcblx0ICAgICAgICByZXQudXNlQmxvY2tQYXJhbXMgPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGF0KSB7XG5cdCAgICAgICAgcmV0LmNvbXBhdCA9IHRydWU7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoIWFzT2JqZWN0KSB7XG5cdCAgICAgICAgcmV0LmNvbXBpbGVyID0gSlNPTi5zdHJpbmdpZnkocmV0LmNvbXBpbGVyKTtcblxuXHQgICAgICAgIHRoaXMuc291cmNlLmN1cnJlbnRMb2NhdGlvbiA9IHsgc3RhcnQ6IHsgbGluZTogMSwgY29sdW1uOiAwIH0gfTtcblx0ICAgICAgICByZXQgPSB0aGlzLm9iamVjdExpdGVyYWwocmV0KTtcblxuXHQgICAgICAgIGlmIChvcHRpb25zLnNyY05hbWUpIHtcblx0ICAgICAgICAgIHJldCA9IHJldC50b1N0cmluZ1dpdGhTb3VyY2VNYXAoeyBmaWxlOiBvcHRpb25zLmRlc3ROYW1lIH0pO1xuXHQgICAgICAgICAgcmV0Lm1hcCA9IHJldC5tYXAgJiYgcmV0Lm1hcC50b1N0cmluZygpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICByZXQgPSByZXQudG9TdHJpbmcoKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmV0LmNvbXBpbGVyT3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiByZXQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gZm47XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHByZWFtYmxlOiBmdW5jdGlvbiBwcmVhbWJsZSgpIHtcblx0ICAgIC8vIHRyYWNrIHRoZSBsYXN0IGNvbnRleHQgcHVzaGVkIGludG8gcGxhY2UgdG8gYWxsb3cgc2tpcHBpbmcgdGhlXG5cdCAgICAvLyBnZXRDb250ZXh0IG9wY29kZSB3aGVuIGl0IHdvdWxkIGJlIGEgbm9vcFxuXHQgICAgdGhpcy5sYXN0Q29udGV4dCA9IDA7XG5cdCAgICB0aGlzLnNvdXJjZSA9IG5ldyBfY29kZUdlbjJbJ2RlZmF1bHQnXSh0aGlzLm9wdGlvbnMuc3JjTmFtZSk7XG5cdCAgICB0aGlzLmRlY29yYXRvcnMgPSBuZXcgX2NvZGVHZW4yWydkZWZhdWx0J10odGhpcy5vcHRpb25zLnNyY05hbWUpO1xuXHQgIH0sXG5cblx0ICBjcmVhdGVGdW5jdGlvbkNvbnRleHQ6IGZ1bmN0aW9uIGNyZWF0ZUZ1bmN0aW9uQ29udGV4dChhc09iamVjdCkge1xuXHQgICAgdmFyIHZhckRlY2xhcmF0aW9ucyA9ICcnO1xuXG5cdCAgICB2YXIgbG9jYWxzID0gdGhpcy5zdGFja1ZhcnMuY29uY2F0KHRoaXMucmVnaXN0ZXJzLmxpc3QpO1xuXHQgICAgaWYgKGxvY2Fscy5sZW5ndGggPiAwKSB7XG5cdCAgICAgIHZhckRlY2xhcmF0aW9ucyArPSAnLCAnICsgbG9jYWxzLmpvaW4oJywgJyk7XG5cdCAgICB9XG5cblx0ICAgIC8vIEdlbmVyYXRlIG1pbmltaXplciBhbGlhcyBtYXBwaW5nc1xuXHQgICAgLy9cblx0ICAgIC8vIFdoZW4gdXNpbmcgdHJ1ZSBTb3VyY2VOb2RlcywgdGhpcyB3aWxsIHVwZGF0ZSBhbGwgcmVmZXJlbmNlcyB0byB0aGUgZ2l2ZW4gYWxpYXNcblx0ICAgIC8vIGFzIHRoZSBzb3VyY2Ugbm9kZXMgYXJlIHJldXNlZCBpbiBzaXR1LiBGb3IgdGhlIG5vbi1zb3VyY2Ugbm9kZSBjb21waWxhdGlvbiBtb2RlLFxuXHQgICAgLy8gYWxpYXNlcyB3aWxsIG5vdCBiZSB1c2VkLCBidXQgdGhpcyBjYXNlIGlzIGFscmVhZHkgYmVpbmcgcnVuIG9uIHRoZSBjbGllbnQgYW5kXG5cdCAgICAvLyB3ZSBhcmVuJ3QgY29uY2VybiBhYm91dCBtaW5pbWl6aW5nIHRoZSB0ZW1wbGF0ZSBzaXplLlxuXHQgICAgdmFyIGFsaWFzQ291bnQgPSAwO1xuXHQgICAgZm9yICh2YXIgYWxpYXMgaW4gdGhpcy5hbGlhc2VzKSB7XG5cdCAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZ3VhcmQtZm9yLWluXG5cdCAgICAgIHZhciBub2RlID0gdGhpcy5hbGlhc2VzW2FsaWFzXTtcblxuXHQgICAgICBpZiAodGhpcy5hbGlhc2VzLmhhc093blByb3BlcnR5KGFsaWFzKSAmJiBub2RlLmNoaWxkcmVuICYmIG5vZGUucmVmZXJlbmNlQ291bnQgPiAxKSB7XG5cdCAgICAgICAgdmFyRGVjbGFyYXRpb25zICs9ICcsIGFsaWFzJyArICsrYWxpYXNDb3VudCArICc9JyArIGFsaWFzO1xuXHQgICAgICAgIG5vZGUuY2hpbGRyZW5bMF0gPSAnYWxpYXMnICsgYWxpYXNDb3VudDtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICB2YXIgcGFyYW1zID0gWydjb250YWluZXInLCAnZGVwdGgwJywgJ2hlbHBlcnMnLCAncGFydGlhbHMnLCAnZGF0YSddO1xuXG5cdCAgICBpZiAodGhpcy51c2VCbG9ja1BhcmFtcyB8fCB0aGlzLnVzZURlcHRocykge1xuXHQgICAgICBwYXJhbXMucHVzaCgnYmxvY2tQYXJhbXMnKTtcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnVzZURlcHRocykge1xuXHQgICAgICBwYXJhbXMucHVzaCgnZGVwdGhzJyk7XG5cdCAgICB9XG5cblx0ICAgIC8vIFBlcmZvcm0gYSBzZWNvbmQgcGFzcyBvdmVyIHRoZSBvdXRwdXQgdG8gbWVyZ2UgY29udGVudCB3aGVuIHBvc3NpYmxlXG5cdCAgICB2YXIgc291cmNlID0gdGhpcy5tZXJnZVNvdXJjZSh2YXJEZWNsYXJhdGlvbnMpO1xuXG5cdCAgICBpZiAoYXNPYmplY3QpIHtcblx0ICAgICAgcGFyYW1zLnB1c2goc291cmNlKTtcblxuXHQgICAgICByZXR1cm4gRnVuY3Rpb24uYXBwbHkodGhpcywgcGFyYW1zKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnNvdXJjZS53cmFwKFsnZnVuY3Rpb24oJywgcGFyYW1zLmpvaW4oJywnKSwgJykge1xcbiAgJywgc291cmNlLCAnfSddKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIG1lcmdlU291cmNlOiBmdW5jdGlvbiBtZXJnZVNvdXJjZSh2YXJEZWNsYXJhdGlvbnMpIHtcblx0ICAgIHZhciBpc1NpbXBsZSA9IHRoaXMuZW52aXJvbm1lbnQuaXNTaW1wbGUsXG5cdCAgICAgICAgYXBwZW5kT25seSA9ICF0aGlzLmZvcmNlQnVmZmVyLFxuXHQgICAgICAgIGFwcGVuZEZpcnN0ID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIHNvdXJjZVNlZW4gPSB1bmRlZmluZWQsXG5cdCAgICAgICAgYnVmZmVyU3RhcnQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgYnVmZmVyRW5kID0gdW5kZWZpbmVkO1xuXHQgICAgdGhpcy5zb3VyY2UuZWFjaChmdW5jdGlvbiAobGluZSkge1xuXHQgICAgICBpZiAobGluZS5hcHBlbmRUb0J1ZmZlcikge1xuXHQgICAgICAgIGlmIChidWZmZXJTdGFydCkge1xuXHQgICAgICAgICAgbGluZS5wcmVwZW5kKCcgICsgJyk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIGJ1ZmZlclN0YXJ0ID0gbGluZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgYnVmZmVyRW5kID0gbGluZTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBpZiAoYnVmZmVyU3RhcnQpIHtcblx0ICAgICAgICAgIGlmICghc291cmNlU2Vlbikge1xuXHQgICAgICAgICAgICBhcHBlbmRGaXJzdCA9IHRydWU7XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBidWZmZXJTdGFydC5wcmVwZW5kKCdidWZmZXIgKz0gJyk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICBidWZmZXJFbmQuYWRkKCc7Jyk7XG5cdCAgICAgICAgICBidWZmZXJTdGFydCA9IGJ1ZmZlckVuZCA9IHVuZGVmaW5lZDtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzb3VyY2VTZWVuID0gdHJ1ZTtcblx0ICAgICAgICBpZiAoIWlzU2ltcGxlKSB7XG5cdCAgICAgICAgICBhcHBlbmRPbmx5ID0gZmFsc2U7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgaWYgKGFwcGVuZE9ubHkpIHtcblx0ICAgICAgaWYgKGJ1ZmZlclN0YXJ0KSB7XG5cdCAgICAgICAgYnVmZmVyU3RhcnQucHJlcGVuZCgncmV0dXJuICcpO1xuXHQgICAgICAgIGJ1ZmZlckVuZC5hZGQoJzsnKTtcblx0ICAgICAgfSBlbHNlIGlmICghc291cmNlU2Vlbikge1xuXHQgICAgICAgIHRoaXMuc291cmNlLnB1c2goJ3JldHVybiBcIlwiOycpO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB2YXJEZWNsYXJhdGlvbnMgKz0gJywgYnVmZmVyID0gJyArIChhcHBlbmRGaXJzdCA/ICcnIDogdGhpcy5pbml0aWFsaXplQnVmZmVyKCkpO1xuXG5cdCAgICAgIGlmIChidWZmZXJTdGFydCkge1xuXHQgICAgICAgIGJ1ZmZlclN0YXJ0LnByZXBlbmQoJ3JldHVybiBidWZmZXIgKyAnKTtcblx0ICAgICAgICBidWZmZXJFbmQuYWRkKCc7Jyk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdGhpcy5zb3VyY2UucHVzaCgncmV0dXJuIGJ1ZmZlcjsnKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBpZiAodmFyRGVjbGFyYXRpb25zKSB7XG5cdCAgICAgIHRoaXMuc291cmNlLnByZXBlbmQoJ3ZhciAnICsgdmFyRGVjbGFyYXRpb25zLnN1YnN0cmluZygyKSArIChhcHBlbmRGaXJzdCA/ICcnIDogJztcXG4nKSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB0aGlzLnNvdXJjZS5tZXJnZSgpO1xuXHQgIH0sXG5cblx0ICAvLyBbYmxvY2tWYWx1ZV1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHZhbHVlXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXR1cm4gdmFsdWUgb2YgYmxvY2tIZWxwZXJNaXNzaW5nXG5cdCAgLy9cblx0ICAvLyBUaGUgcHVycG9zZSBvZiB0aGlzIG9wY29kZSBpcyB0byB0YWtlIGEgYmxvY2sgb2YgdGhlIGZvcm1cblx0ICAvLyBge3sjdGhpcy5mb299fS4uLnt7L3RoaXMuZm9vfX1gLCByZXNvbHZlIHRoZSB2YWx1ZSBvZiBgZm9vYCwgYW5kXG5cdCAgLy8gcmVwbGFjZSBpdCBvbiB0aGUgc3RhY2sgd2l0aCB0aGUgcmVzdWx0IG9mIHByb3Blcmx5XG5cdCAgLy8gaW52b2tpbmcgYmxvY2tIZWxwZXJNaXNzaW5nLlxuXHQgIGJsb2NrVmFsdWU6IGZ1bmN0aW9uIGJsb2NrVmFsdWUobmFtZSkge1xuXHQgICAgdmFyIGJsb2NrSGVscGVyTWlzc2luZyA9IHRoaXMuYWxpYXNhYmxlKCdoZWxwZXJzLmJsb2NrSGVscGVyTWlzc2luZycpLFxuXHQgICAgICAgIHBhcmFtcyA9IFt0aGlzLmNvbnRleHROYW1lKDApXTtcblx0ICAgIHRoaXMuc2V0dXBIZWxwZXJBcmdzKG5hbWUsIDAsIHBhcmFtcyk7XG5cblx0ICAgIHZhciBibG9ja05hbWUgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICBwYXJhbXMuc3BsaWNlKDEsIDAsIGJsb2NrTmFtZSk7XG5cblx0ICAgIHRoaXMucHVzaCh0aGlzLnNvdXJjZS5mdW5jdGlvbkNhbGwoYmxvY2tIZWxwZXJNaXNzaW5nLCAnY2FsbCcsIHBhcmFtcykpO1xuXHQgIH0sXG5cblx0ICAvLyBbYW1iaWd1b3VzQmxvY2tWYWx1ZV1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHZhbHVlXG5cdCAgLy8gQ29tcGlsZXIgdmFsdWUsIGJlZm9yZTogbGFzdEhlbHBlcj12YWx1ZSBvZiBsYXN0IGZvdW5kIGhlbHBlciwgaWYgYW55XG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyLCBpZiBubyBsYXN0SGVscGVyOiBzYW1lIGFzIFtibG9ja1ZhbHVlXVxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlciwgaWYgbGFzdEhlbHBlcjogdmFsdWVcblx0ICBhbWJpZ3VvdXNCbG9ja1ZhbHVlOiBmdW5jdGlvbiBhbWJpZ3VvdXNCbG9ja1ZhbHVlKCkge1xuXHQgICAgLy8gV2UncmUgYmVpbmcgYSBiaXQgY2hlZWt5IGFuZCByZXVzaW5nIHRoZSBvcHRpb25zIHZhbHVlIGZyb20gdGhlIHByaW9yIGV4ZWNcblx0ICAgIHZhciBibG9ja0hlbHBlck1pc3NpbmcgPSB0aGlzLmFsaWFzYWJsZSgnaGVscGVycy5ibG9ja0hlbHBlck1pc3NpbmcnKSxcblx0ICAgICAgICBwYXJhbXMgPSBbdGhpcy5jb250ZXh0TmFtZSgwKV07XG5cdCAgICB0aGlzLnNldHVwSGVscGVyQXJncygnJywgMCwgcGFyYW1zLCB0cnVlKTtcblxuXHQgICAgdGhpcy5mbHVzaElubGluZSgpO1xuXG5cdCAgICB2YXIgY3VycmVudCA9IHRoaXMudG9wU3RhY2soKTtcblx0ICAgIHBhcmFtcy5zcGxpY2UoMSwgMCwgY3VycmVudCk7XG5cblx0ICAgIHRoaXMucHVzaFNvdXJjZShbJ2lmICghJywgdGhpcy5sYXN0SGVscGVyLCAnKSB7ICcsIGN1cnJlbnQsICcgPSAnLCB0aGlzLnNvdXJjZS5mdW5jdGlvbkNhbGwoYmxvY2tIZWxwZXJNaXNzaW5nLCAnY2FsbCcsIHBhcmFtcyksICd9J10pO1xuXHQgIH0sXG5cblx0ICAvLyBbYXBwZW5kQ29udGVudF1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uXG5cdCAgLy9cblx0ICAvLyBBcHBlbmRzIHRoZSBzdHJpbmcgdmFsdWUgb2YgYGNvbnRlbnRgIHRvIHRoZSBjdXJyZW50IGJ1ZmZlclxuXHQgIGFwcGVuZENvbnRlbnQ6IGZ1bmN0aW9uIGFwcGVuZENvbnRlbnQoY29udGVudCkge1xuXHQgICAgaWYgKHRoaXMucGVuZGluZ0NvbnRlbnQpIHtcblx0ICAgICAgY29udGVudCA9IHRoaXMucGVuZGluZ0NvbnRlbnQgKyBjb250ZW50O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5wZW5kaW5nTG9jYXRpb24gPSB0aGlzLnNvdXJjZS5jdXJyZW50TG9jYXRpb247XG5cdCAgICB9XG5cblx0ICAgIHRoaXMucGVuZGluZ0NvbnRlbnQgPSBjb250ZW50O1xuXHQgIH0sXG5cblx0ICAvLyBbYXBwZW5kXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogdmFsdWUsIC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uXG5cdCAgLy9cblx0ICAvLyBDb2VyY2VzIGB2YWx1ZWAgdG8gYSBTdHJpbmcgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIGN1cnJlbnQgYnVmZmVyLlxuXHQgIC8vXG5cdCAgLy8gSWYgYHZhbHVlYCBpcyB0cnV0aHksIG9yIDAsIGl0IGlzIGNvZXJjZWQgaW50byBhIHN0cmluZyBhbmQgYXBwZW5kZWRcblx0ICAvLyBPdGhlcndpc2UsIHRoZSBlbXB0eSBzdHJpbmcgaXMgYXBwZW5kZWRcblx0ICBhcHBlbmQ6IGZ1bmN0aW9uIGFwcGVuZCgpIHtcblx0ICAgIGlmICh0aGlzLmlzSW5saW5lKCkpIHtcblx0ICAgICAgdGhpcy5yZXBsYWNlU3RhY2soZnVuY3Rpb24gKGN1cnJlbnQpIHtcblx0ICAgICAgICByZXR1cm4gWycgIT0gbnVsbCA/ICcsIGN1cnJlbnQsICcgOiBcIlwiJ107XG5cdCAgICAgIH0pO1xuXG5cdCAgICAgIHRoaXMucHVzaFNvdXJjZSh0aGlzLmFwcGVuZFRvQnVmZmVyKHRoaXMucG9wU3RhY2soKSkpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdmFyIGxvY2FsID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgICB0aGlzLnB1c2hTb3VyY2UoWydpZiAoJywgbG9jYWwsICcgIT0gbnVsbCkgeyAnLCB0aGlzLmFwcGVuZFRvQnVmZmVyKGxvY2FsLCB1bmRlZmluZWQsIHRydWUpLCAnIH0nXSk7XG5cdCAgICAgIGlmICh0aGlzLmVudmlyb25tZW50LmlzU2ltcGxlKSB7XG5cdCAgICAgICAgdGhpcy5wdXNoU291cmNlKFsnZWxzZSB7ICcsIHRoaXMuYXBwZW5kVG9CdWZmZXIoXCInJ1wiLCB1bmRlZmluZWQsIHRydWUpLCAnIH0nXSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgLy8gW2FwcGVuZEVzY2FwZWRdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiB2YWx1ZSwgLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi5cblx0ICAvL1xuXHQgIC8vIEVzY2FwZSBgdmFsdWVgIGFuZCBhcHBlbmQgaXQgdG8gdGhlIGJ1ZmZlclxuXHQgIGFwcGVuZEVzY2FwZWQ6IGZ1bmN0aW9uIGFwcGVuZEVzY2FwZWQoKSB7XG5cdCAgICB0aGlzLnB1c2hTb3VyY2UodGhpcy5hcHBlbmRUb0J1ZmZlcihbdGhpcy5hbGlhc2FibGUoJ2NvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uJyksICcoJywgdGhpcy5wb3BTdGFjaygpLCAnKSddKSk7XG5cdCAgfSxcblxuXHQgIC8vIFtnZXRDb250ZXh0XVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi5cblx0ICAvLyBDb21waWxlciB2YWx1ZSwgYWZ0ZXI6IGxhc3RDb250ZXh0PWRlcHRoXG5cdCAgLy9cblx0ICAvLyBTZXQgdGhlIHZhbHVlIG9mIHRoZSBgbGFzdENvbnRleHRgIGNvbXBpbGVyIHZhbHVlIHRvIHRoZSBkZXB0aFxuXHQgIGdldENvbnRleHQ6IGZ1bmN0aW9uIGdldENvbnRleHQoZGVwdGgpIHtcblx0ICAgIHRoaXMubGFzdENvbnRleHQgPSBkZXB0aDtcblx0ICB9LFxuXG5cdCAgLy8gW3B1c2hDb250ZXh0XVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiBjdXJyZW50Q29udGV4dCwgLi4uXG5cdCAgLy9cblx0ICAvLyBQdXNoZXMgdGhlIHZhbHVlIG9mIHRoZSBjdXJyZW50IGNvbnRleHQgb250byB0aGUgc3RhY2suXG5cdCAgcHVzaENvbnRleHQ6IGZ1bmN0aW9uIHB1c2hDb250ZXh0KCkge1xuXHQgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKHRoaXMuY29udGV4dE5hbWUodGhpcy5sYXN0Q29udGV4dCkpO1xuXHQgIH0sXG5cblx0ICAvLyBbbG9va3VwT25Db250ZXh0XVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiBjdXJyZW50Q29udGV4dFtuYW1lXSwgLi4uXG5cdCAgLy9cblx0ICAvLyBMb29rcyB1cCB0aGUgdmFsdWUgb2YgYG5hbWVgIG9uIHRoZSBjdXJyZW50IGNvbnRleHQgYW5kIHB1c2hlc1xuXHQgIC8vIGl0IG9udG8gdGhlIHN0YWNrLlxuXHQgIGxvb2t1cE9uQ29udGV4dDogZnVuY3Rpb24gbG9va3VwT25Db250ZXh0KHBhcnRzLCBmYWxzeSwgc3RyaWN0LCBzY29wZWQpIHtcblx0ICAgIHZhciBpID0gMDtcblxuXHQgICAgaWYgKCFzY29wZWQgJiYgdGhpcy5vcHRpb25zLmNvbXBhdCAmJiAhdGhpcy5sYXN0Q29udGV4dCkge1xuXHQgICAgICAvLyBUaGUgZGVwdGhlZCBxdWVyeSBpcyBleHBlY3RlZCB0byBoYW5kbGUgdGhlIHVuZGVmaW5lZCBsb2dpYyBmb3IgdGhlIHJvb3QgbGV2ZWwgdGhhdFxuXHQgICAgICAvLyBpcyBpbXBsZW1lbnRlZCBiZWxvdywgc28gd2UgZXZhbHVhdGUgdGhhdCBkaXJlY3RseSBpbiBjb21wYXQgbW9kZVxuXHQgICAgICB0aGlzLnB1c2godGhpcy5kZXB0aGVkTG9va3VwKHBhcnRzW2krK10pKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMucHVzaENvbnRleHQoKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5yZXNvbHZlUGF0aCgnY29udGV4dCcsIHBhcnRzLCBpLCBmYWxzeSwgc3RyaWN0KTtcblx0ICB9LFxuXG5cdCAgLy8gW2xvb2t1cEJsb2NrUGFyYW1dXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IGJsb2NrUGFyYW1bbmFtZV0sIC4uLlxuXHQgIC8vXG5cdCAgLy8gTG9va3MgdXAgdGhlIHZhbHVlIG9mIGBwYXJ0c2Agb24gdGhlIGdpdmVuIGJsb2NrIHBhcmFtIGFuZCBwdXNoZXNcblx0ICAvLyBpdCBvbnRvIHRoZSBzdGFjay5cblx0ICBsb29rdXBCbG9ja1BhcmFtOiBmdW5jdGlvbiBsb29rdXBCbG9ja1BhcmFtKGJsb2NrUGFyYW1JZCwgcGFydHMpIHtcblx0ICAgIHRoaXMudXNlQmxvY2tQYXJhbXMgPSB0cnVlO1xuXG5cdCAgICB0aGlzLnB1c2goWydibG9ja1BhcmFtc1snLCBibG9ja1BhcmFtSWRbMF0sICddWycsIGJsb2NrUGFyYW1JZFsxXSwgJ10nXSk7XG5cdCAgICB0aGlzLnJlc29sdmVQYXRoKCdjb250ZXh0JywgcGFydHMsIDEpO1xuXHQgIH0sXG5cblx0ICAvLyBbbG9va3VwRGF0YV1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogZGF0YSwgLi4uXG5cdCAgLy9cblx0ICAvLyBQdXNoIHRoZSBkYXRhIGxvb2t1cCBvcGVyYXRvclxuXHQgIGxvb2t1cERhdGE6IGZ1bmN0aW9uIGxvb2t1cERhdGEoZGVwdGgsIHBhcnRzLCBzdHJpY3QpIHtcblx0ICAgIGlmICghZGVwdGgpIHtcblx0ICAgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKCdkYXRhJyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoJ2NvbnRhaW5lci5kYXRhKGRhdGEsICcgKyBkZXB0aCArICcpJyk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMucmVzb2x2ZVBhdGgoJ2RhdGEnLCBwYXJ0cywgMCwgdHJ1ZSwgc3RyaWN0KTtcblx0ICB9LFxuXG5cdCAgcmVzb2x2ZVBhdGg6IGZ1bmN0aW9uIHJlc29sdmVQYXRoKHR5cGUsIHBhcnRzLCBpLCBmYWxzeSwgc3RyaWN0KSB7XG5cdCAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuXG5cdCAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdCAgICBpZiAodGhpcy5vcHRpb25zLnN0cmljdCB8fCB0aGlzLm9wdGlvbnMuYXNzdW1lT2JqZWN0cykge1xuXHQgICAgICB0aGlzLnB1c2goc3RyaWN0TG9va3VwKHRoaXMub3B0aW9ucy5zdHJpY3QgJiYgc3RyaWN0LCB0aGlzLCBwYXJ0cywgdHlwZSkpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHZhciBsZW4gPSBwYXJ0cy5sZW5ndGg7XG5cdCAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWxvb3AtZnVuYyAqL1xuXHQgICAgICB0aGlzLnJlcGxhY2VTdGFjayhmdW5jdGlvbiAoY3VycmVudCkge1xuXHQgICAgICAgIHZhciBsb29rdXAgPSBfdGhpcy5uYW1lTG9va3VwKGN1cnJlbnQsIHBhcnRzW2ldLCB0eXBlKTtcblx0ICAgICAgICAvLyBXZSB3YW50IHRvIGVuc3VyZSB0aGF0IHplcm8gYW5kIGZhbHNlIGFyZSBoYW5kbGVkIHByb3Blcmx5IGlmIHRoZSBjb250ZXh0IChmYWxzeSBmbGFnKVxuXHQgICAgICAgIC8vIG5lZWRzIHRvIGhhdmUgdGhlIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHRoZXNlIHZhbHVlcy5cblx0ICAgICAgICBpZiAoIWZhbHN5KSB7XG5cdCAgICAgICAgICByZXR1cm4gWycgIT0gbnVsbCA/ICcsIGxvb2t1cCwgJyA6ICcsIGN1cnJlbnRdO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAvLyBPdGhlcndpc2Ugd2UgY2FuIHVzZSBnZW5lcmljIGZhbHN5IGhhbmRsaW5nXG5cdCAgICAgICAgICByZXR1cm4gWycgJiYgJywgbG9va3VwXTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWxvb3AtZnVuYyAqL1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICAvLyBbcmVzb2x2ZVBvc3NpYmxlTGFtYmRhXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogdmFsdWUsIC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogcmVzb2x2ZWQgdmFsdWUsIC4uLlxuXHQgIC8vXG5cdCAgLy8gSWYgdGhlIGB2YWx1ZWAgaXMgYSBsYW1iZGEsIHJlcGxhY2UgaXQgb24gdGhlIHN0YWNrIGJ5XG5cdCAgLy8gdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbGFtYmRhXG5cdCAgcmVzb2x2ZVBvc3NpYmxlTGFtYmRhOiBmdW5jdGlvbiByZXNvbHZlUG9zc2libGVMYW1iZGEoKSB7XG5cdCAgICB0aGlzLnB1c2goW3RoaXMuYWxpYXNhYmxlKCdjb250YWluZXIubGFtYmRhJyksICcoJywgdGhpcy5wb3BTdGFjaygpLCAnLCAnLCB0aGlzLmNvbnRleHROYW1lKDApLCAnKSddKTtcblx0ICB9LFxuXG5cdCAgLy8gW3B1c2hTdHJpbmdQYXJhbV1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogc3RyaW5nLCBjdXJyZW50Q29udGV4dCwgLi4uXG5cdCAgLy9cblx0ICAvLyBUaGlzIG9wY29kZSBpcyBkZXNpZ25lZCBmb3IgdXNlIGluIHN0cmluZyBtb2RlLCB3aGljaFxuXHQgIC8vIHByb3ZpZGVzIHRoZSBzdHJpbmcgdmFsdWUgb2YgYSBwYXJhbWV0ZXIgYWxvbmcgd2l0aCBpdHNcblx0ICAvLyBkZXB0aCByYXRoZXIgdGhhbiByZXNvbHZpbmcgaXQgaW1tZWRpYXRlbHkuXG5cdCAgcHVzaFN0cmluZ1BhcmFtOiBmdW5jdGlvbiBwdXNoU3RyaW5nUGFyYW0oc3RyaW5nLCB0eXBlKSB7XG5cdCAgICB0aGlzLnB1c2hDb250ZXh0KCk7XG5cdCAgICB0aGlzLnB1c2hTdHJpbmcodHlwZSk7XG5cblx0ICAgIC8vIElmIGl0J3MgYSBzdWJleHByZXNzaW9uLCB0aGUgc3RyaW5nIHJlc3VsdFxuXHQgICAgLy8gd2lsbCBiZSBwdXNoZWQgYWZ0ZXIgdGhpcyBvcGNvZGUuXG5cdCAgICBpZiAodHlwZSAhPT0gJ1N1YkV4cHJlc3Npb24nKSB7XG5cdCAgICAgIGlmICh0eXBlb2Ygc3RyaW5nID09PSAnc3RyaW5nJykge1xuXHQgICAgICAgIHRoaXMucHVzaFN0cmluZyhzdHJpbmcpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbChzdHJpbmcpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIGVtcHR5SGFzaDogZnVuY3Rpb24gZW1wdHlIYXNoKG9taXRFbXB0eSkge1xuXHQgICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcblx0ICAgICAgdGhpcy5wdXNoKCd7fScpOyAvLyBoYXNoSWRzXG5cdCAgICB9XG5cdCAgICBpZiAodGhpcy5zdHJpbmdQYXJhbXMpIHtcblx0ICAgICAgdGhpcy5wdXNoKCd7fScpOyAvLyBoYXNoQ29udGV4dHNcblx0ICAgICAgdGhpcy5wdXNoKCd7fScpOyAvLyBoYXNoVHlwZXNcblx0ICAgIH1cblx0ICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbChvbWl0RW1wdHkgPyAndW5kZWZpbmVkJyA6ICd7fScpO1xuXHQgIH0sXG5cdCAgcHVzaEhhc2g6IGZ1bmN0aW9uIHB1c2hIYXNoKCkge1xuXHQgICAgaWYgKHRoaXMuaGFzaCkge1xuXHQgICAgICB0aGlzLmhhc2hlcy5wdXNoKHRoaXMuaGFzaCk7XG5cdCAgICB9XG5cdCAgICB0aGlzLmhhc2ggPSB7IHZhbHVlczogW10sIHR5cGVzOiBbXSwgY29udGV4dHM6IFtdLCBpZHM6IFtdIH07XG5cdCAgfSxcblx0ICBwb3BIYXNoOiBmdW5jdGlvbiBwb3BIYXNoKCkge1xuXHQgICAgdmFyIGhhc2ggPSB0aGlzLmhhc2g7XG5cdCAgICB0aGlzLmhhc2ggPSB0aGlzLmhhc2hlcy5wb3AoKTtcblxuXHQgICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcblx0ICAgICAgdGhpcy5wdXNoKHRoaXMub2JqZWN0TGl0ZXJhbChoYXNoLmlkcykpO1xuXHQgICAgfVxuXHQgICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG5cdCAgICAgIHRoaXMucHVzaCh0aGlzLm9iamVjdExpdGVyYWwoaGFzaC5jb250ZXh0cykpO1xuXHQgICAgICB0aGlzLnB1c2godGhpcy5vYmplY3RMaXRlcmFsKGhhc2gudHlwZXMpKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5wdXNoKHRoaXMub2JqZWN0TGl0ZXJhbChoYXNoLnZhbHVlcykpO1xuXHQgIH0sXG5cblx0ICAvLyBbcHVzaFN0cmluZ11cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogcXVvdGVkU3RyaW5nKHN0cmluZyksIC4uLlxuXHQgIC8vXG5cdCAgLy8gUHVzaCBhIHF1b3RlZCB2ZXJzaW9uIG9mIGBzdHJpbmdgIG9udG8gdGhlIHN0YWNrXG5cdCAgcHVzaFN0cmluZzogZnVuY3Rpb24gcHVzaFN0cmluZyhzdHJpbmcpIHtcblx0ICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCh0aGlzLnF1b3RlZFN0cmluZyhzdHJpbmcpKTtcblx0ICB9LFxuXG5cdCAgLy8gW3B1c2hMaXRlcmFsXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiB2YWx1ZSwgLi4uXG5cdCAgLy9cblx0ICAvLyBQdXNoZXMgYSB2YWx1ZSBvbnRvIHRoZSBzdGFjay4gVGhpcyBvcGVyYXRpb24gcHJldmVudHNcblx0ICAvLyB0aGUgY29tcGlsZXIgZnJvbSBjcmVhdGluZyBhIHRlbXBvcmFyeSB2YXJpYWJsZSB0byBob2xkXG5cdCAgLy8gaXQuXG5cdCAgcHVzaExpdGVyYWw6IGZ1bmN0aW9uIHB1c2hMaXRlcmFsKHZhbHVlKSB7XG5cdCAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwodmFsdWUpO1xuXHQgIH0sXG5cblx0ICAvLyBbcHVzaFByb2dyYW1dXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHByb2dyYW0oZ3VpZCksIC4uLlxuXHQgIC8vXG5cdCAgLy8gUHVzaCBhIHByb2dyYW0gZXhwcmVzc2lvbiBvbnRvIHRoZSBzdGFjay4gVGhpcyB0YWtlc1xuXHQgIC8vIGEgY29tcGlsZS10aW1lIGd1aWQgYW5kIGNvbnZlcnRzIGl0IGludG8gYSBydW50aW1lLWFjY2Vzc2libGVcblx0ICAvLyBleHByZXNzaW9uLlxuXHQgIHB1c2hQcm9ncmFtOiBmdW5jdGlvbiBwdXNoUHJvZ3JhbShndWlkKSB7XG5cdCAgICBpZiAoZ3VpZCAhPSBudWxsKSB7XG5cdCAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCh0aGlzLnByb2dyYW1FeHByZXNzaW9uKGd1aWQpKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbChudWxsKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgLy8gW3JlZ2lzdGVyRGVjb3JhdG9yXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogaGFzaCwgcHJvZ3JhbSwgcGFyYW1zLi4uLCAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IC4uLlxuXHQgIC8vXG5cdCAgLy8gUG9wcyBvZmYgdGhlIGRlY29yYXRvcidzIHBhcmFtZXRlcnMsIGludm9rZXMgdGhlIGRlY29yYXRvcixcblx0ICAvLyBhbmQgaW5zZXJ0cyB0aGUgZGVjb3JhdG9yIGludG8gdGhlIGRlY29yYXRvcnMgbGlzdC5cblx0ICByZWdpc3RlckRlY29yYXRvcjogZnVuY3Rpb24gcmVnaXN0ZXJEZWNvcmF0b3IocGFyYW1TaXplLCBuYW1lKSB7XG5cdCAgICB2YXIgZm91bmREZWNvcmF0b3IgPSB0aGlzLm5hbWVMb29rdXAoJ2RlY29yYXRvcnMnLCBuYW1lLCAnZGVjb3JhdG9yJyksXG5cdCAgICAgICAgb3B0aW9ucyA9IHRoaXMuc2V0dXBIZWxwZXJBcmdzKG5hbWUsIHBhcmFtU2l6ZSk7XG5cblx0ICAgIHRoaXMuZGVjb3JhdG9ycy5wdXNoKFsnZm4gPSAnLCB0aGlzLmRlY29yYXRvcnMuZnVuY3Rpb25DYWxsKGZvdW5kRGVjb3JhdG9yLCAnJywgWydmbicsICdwcm9wcycsICdjb250YWluZXInLCBvcHRpb25zXSksICcgfHwgZm47J10pO1xuXHQgIH0sXG5cblx0ICAvLyBbaW52b2tlSGVscGVyXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogaGFzaCwgaW52ZXJzZSwgcHJvZ3JhbSwgcGFyYW1zLi4uLCAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHJlc3VsdCBvZiBoZWxwZXIgaW52b2NhdGlvblxuXHQgIC8vXG5cdCAgLy8gUG9wcyBvZmYgdGhlIGhlbHBlcidzIHBhcmFtZXRlcnMsIGludm9rZXMgdGhlIGhlbHBlcixcblx0ICAvLyBhbmQgcHVzaGVzIHRoZSBoZWxwZXIncyByZXR1cm4gdmFsdWUgb250byB0aGUgc3RhY2suXG5cdCAgLy9cblx0ICAvLyBJZiB0aGUgaGVscGVyIGlzIG5vdCBmb3VuZCwgYGhlbHBlck1pc3NpbmdgIGlzIGNhbGxlZC5cblx0ICBpbnZva2VIZWxwZXI6IGZ1bmN0aW9uIGludm9rZUhlbHBlcihwYXJhbVNpemUsIG5hbWUsIGlzU2ltcGxlKSB7XG5cdCAgICB2YXIgbm9uSGVscGVyID0gdGhpcy5wb3BTdGFjaygpLFxuXHQgICAgICAgIGhlbHBlciA9IHRoaXMuc2V0dXBIZWxwZXIocGFyYW1TaXplLCBuYW1lKSxcblx0ICAgICAgICBzaW1wbGUgPSBpc1NpbXBsZSA/IFtoZWxwZXIubmFtZSwgJyB8fCAnXSA6ICcnO1xuXG5cdCAgICB2YXIgbG9va3VwID0gWycoJ10uY29uY2F0KHNpbXBsZSwgbm9uSGVscGVyKTtcblx0ICAgIGlmICghdGhpcy5vcHRpb25zLnN0cmljdCkge1xuXHQgICAgICBsb29rdXAucHVzaCgnIHx8ICcsIHRoaXMuYWxpYXNhYmxlKCdoZWxwZXJzLmhlbHBlck1pc3NpbmcnKSk7XG5cdCAgICB9XG5cdCAgICBsb29rdXAucHVzaCgnKScpO1xuXG5cdCAgICB0aGlzLnB1c2godGhpcy5zb3VyY2UuZnVuY3Rpb25DYWxsKGxvb2t1cCwgJ2NhbGwnLCBoZWxwZXIuY2FsbFBhcmFtcykpO1xuXHQgIH0sXG5cblx0ICAvLyBbaW52b2tlS25vd25IZWxwZXJdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiBoYXNoLCBpbnZlcnNlLCBwcm9ncmFtLCBwYXJhbXMuLi4sIC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogcmVzdWx0IG9mIGhlbHBlciBpbnZvY2F0aW9uXG5cdCAgLy9cblx0ICAvLyBUaGlzIG9wZXJhdGlvbiBpcyB1c2VkIHdoZW4gdGhlIGhlbHBlciBpcyBrbm93biB0byBleGlzdCxcblx0ICAvLyBzbyBhIGBoZWxwZXJNaXNzaW5nYCBmYWxsYmFjayBpcyBub3QgcmVxdWlyZWQuXG5cdCAgaW52b2tlS25vd25IZWxwZXI6IGZ1bmN0aW9uIGludm9rZUtub3duSGVscGVyKHBhcmFtU2l6ZSwgbmFtZSkge1xuXHQgICAgdmFyIGhlbHBlciA9IHRoaXMuc2V0dXBIZWxwZXIocGFyYW1TaXplLCBuYW1lKTtcblx0ICAgIHRoaXMucHVzaCh0aGlzLnNvdXJjZS5mdW5jdGlvbkNhbGwoaGVscGVyLm5hbWUsICdjYWxsJywgaGVscGVyLmNhbGxQYXJhbXMpKTtcblx0ICB9LFxuXG5cdCAgLy8gW2ludm9rZUFtYmlndW91c11cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHBhcmFtcy4uLiwgLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXN1bHQgb2YgZGlzYW1iaWd1YXRpb25cblx0ICAvL1xuXHQgIC8vIFRoaXMgb3BlcmF0aW9uIGlzIHVzZWQgd2hlbiBhbiBleHByZXNzaW9uIGxpa2UgYHt7Zm9vfX1gXG5cdCAgLy8gaXMgcHJvdmlkZWQsIGJ1dCB3ZSBkb24ndCBrbm93IGF0IGNvbXBpbGUtdGltZSB3aGV0aGVyIGl0XG5cdCAgLy8gaXMgYSBoZWxwZXIgb3IgYSBwYXRoLlxuXHQgIC8vXG5cdCAgLy8gVGhpcyBvcGVyYXRpb24gZW1pdHMgbW9yZSBjb2RlIHRoYW4gdGhlIG90aGVyIG9wdGlvbnMsXG5cdCAgLy8gYW5kIGNhbiBiZSBhdm9pZGVkIGJ5IHBhc3NpbmcgdGhlIGBrbm93bkhlbHBlcnNgIGFuZFxuXHQgIC8vIGBrbm93bkhlbHBlcnNPbmx5YCBmbGFncyBhdCBjb21waWxlLXRpbWUuXG5cdCAgaW52b2tlQW1iaWd1b3VzOiBmdW5jdGlvbiBpbnZva2VBbWJpZ3VvdXMobmFtZSwgaGVscGVyQ2FsbCkge1xuXHQgICAgdGhpcy51c2VSZWdpc3RlcignaGVscGVyJyk7XG5cblx0ICAgIHZhciBub25IZWxwZXIgPSB0aGlzLnBvcFN0YWNrKCk7XG5cblx0ICAgIHRoaXMuZW1wdHlIYXNoKCk7XG5cdCAgICB2YXIgaGVscGVyID0gdGhpcy5zZXR1cEhlbHBlcigwLCBuYW1lLCBoZWxwZXJDYWxsKTtcblxuXHQgICAgdmFyIGhlbHBlck5hbWUgPSB0aGlzLmxhc3RIZWxwZXIgPSB0aGlzLm5hbWVMb29rdXAoJ2hlbHBlcnMnLCBuYW1lLCAnaGVscGVyJyk7XG5cblx0ICAgIHZhciBsb29rdXAgPSBbJygnLCAnKGhlbHBlciA9ICcsIGhlbHBlck5hbWUsICcgfHwgJywgbm9uSGVscGVyLCAnKSddO1xuXHQgICAgaWYgKCF0aGlzLm9wdGlvbnMuc3RyaWN0KSB7XG5cdCAgICAgIGxvb2t1cFswXSA9ICcoaGVscGVyID0gJztcblx0ICAgICAgbG9va3VwLnB1c2goJyAhPSBudWxsID8gaGVscGVyIDogJywgdGhpcy5hbGlhc2FibGUoJ2hlbHBlcnMuaGVscGVyTWlzc2luZycpKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5wdXNoKFsnKCcsIGxvb2t1cCwgaGVscGVyLnBhcmFtc0luaXQgPyBbJyksKCcsIGhlbHBlci5wYXJhbXNJbml0XSA6IFtdLCAnKSwnLCAnKHR5cGVvZiBoZWxwZXIgPT09ICcsIHRoaXMuYWxpYXNhYmxlKCdcImZ1bmN0aW9uXCInKSwgJyA/ICcsIHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbCgnaGVscGVyJywgJ2NhbGwnLCBoZWxwZXIuY2FsbFBhcmFtcyksICcgOiBoZWxwZXIpKSddKTtcblx0ICB9LFxuXG5cdCAgLy8gW2ludm9rZVBhcnRpYWxdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiBjb250ZXh0LCAuLi5cblx0ICAvLyBPbiBzdGFjayBhZnRlcjogcmVzdWx0IG9mIHBhcnRpYWwgaW52b2NhdGlvblxuXHQgIC8vXG5cdCAgLy8gVGhpcyBvcGVyYXRpb24gcG9wcyBvZmYgYSBjb250ZXh0LCBpbnZva2VzIGEgcGFydGlhbCB3aXRoIHRoYXQgY29udGV4dCxcblx0ICAvLyBhbmQgcHVzaGVzIHRoZSByZXN1bHQgb2YgdGhlIGludm9jYXRpb24gYmFjay5cblx0ICBpbnZva2VQYXJ0aWFsOiBmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKGlzRHluYW1pYywgbmFtZSwgaW5kZW50KSB7XG5cdCAgICB2YXIgcGFyYW1zID0gW10sXG5cdCAgICAgICAgb3B0aW9ucyA9IHRoaXMuc2V0dXBQYXJhbXMobmFtZSwgMSwgcGFyYW1zKTtcblxuXHQgICAgaWYgKGlzRHluYW1pYykge1xuXHQgICAgICBuYW1lID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgICBkZWxldGUgb3B0aW9ucy5uYW1lO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoaW5kZW50KSB7XG5cdCAgICAgIG9wdGlvbnMuaW5kZW50ID0gSlNPTi5zdHJpbmdpZnkoaW5kZW50KTtcblx0ICAgIH1cblx0ICAgIG9wdGlvbnMuaGVscGVycyA9ICdoZWxwZXJzJztcblx0ICAgIG9wdGlvbnMucGFydGlhbHMgPSAncGFydGlhbHMnO1xuXHQgICAgb3B0aW9ucy5kZWNvcmF0b3JzID0gJ2NvbnRhaW5lci5kZWNvcmF0b3JzJztcblxuXHQgICAgaWYgKCFpc0R5bmFtaWMpIHtcblx0ICAgICAgcGFyYW1zLnVuc2hpZnQodGhpcy5uYW1lTG9va3VwKCdwYXJ0aWFscycsIG5hbWUsICdwYXJ0aWFsJykpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcGFyYW1zLnVuc2hpZnQobmFtZSk7XG5cdCAgICB9XG5cblx0ICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGF0KSB7XG5cdCAgICAgIG9wdGlvbnMuZGVwdGhzID0gJ2RlcHRocyc7XG5cdCAgICB9XG5cdCAgICBvcHRpb25zID0gdGhpcy5vYmplY3RMaXRlcmFsKG9wdGlvbnMpO1xuXHQgICAgcGFyYW1zLnB1c2gob3B0aW9ucyk7XG5cblx0ICAgIHRoaXMucHVzaCh0aGlzLnNvdXJjZS5mdW5jdGlvbkNhbGwoJ2NvbnRhaW5lci5pbnZva2VQYXJ0aWFsJywgJycsIHBhcmFtcykpO1xuXHQgIH0sXG5cblx0ICAvLyBbYXNzaWduVG9IYXNoXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogdmFsdWUsIC4uLiwgaGFzaCwgLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi4sIGhhc2gsIC4uLlxuXHQgIC8vXG5cdCAgLy8gUG9wcyBhIHZhbHVlIG9mZiB0aGUgc3RhY2sgYW5kIGFzc2lnbnMgaXQgdG8gdGhlIGN1cnJlbnQgaGFzaFxuXHQgIGFzc2lnblRvSGFzaDogZnVuY3Rpb24gYXNzaWduVG9IYXNoKGtleSkge1xuXHQgICAgdmFyIHZhbHVlID0gdGhpcy5wb3BTdGFjaygpLFxuXHQgICAgICAgIGNvbnRleHQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgdHlwZSA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBpZCA9IHVuZGVmaW5lZDtcblxuXHQgICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcblx0ICAgICAgaWQgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICB9XG5cdCAgICBpZiAodGhpcy5zdHJpbmdQYXJhbXMpIHtcblx0ICAgICAgdHlwZSA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgICAgY29udGV4dCA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGhhc2ggPSB0aGlzLmhhc2g7XG5cdCAgICBpZiAoY29udGV4dCkge1xuXHQgICAgICBoYXNoLmNvbnRleHRzW2tleV0gPSBjb250ZXh0O1xuXHQgICAgfVxuXHQgICAgaWYgKHR5cGUpIHtcblx0ICAgICAgaGFzaC50eXBlc1trZXldID0gdHlwZTtcblx0ICAgIH1cblx0ICAgIGlmIChpZCkge1xuXHQgICAgICBoYXNoLmlkc1trZXldID0gaWQ7XG5cdCAgICB9XG5cdCAgICBoYXNoLnZhbHVlc1trZXldID0gdmFsdWU7XG5cdCAgfSxcblxuXHQgIHB1c2hJZDogZnVuY3Rpb24gcHVzaElkKHR5cGUsIG5hbWUsIGNoaWxkKSB7XG5cdCAgICBpZiAodHlwZSA9PT0gJ0Jsb2NrUGFyYW0nKSB7XG5cdCAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCgnYmxvY2tQYXJhbXNbJyArIG5hbWVbMF0gKyAnXS5wYXRoWycgKyBuYW1lWzFdICsgJ10nICsgKGNoaWxkID8gJyArICcgKyBKU09OLnN0cmluZ2lmeSgnLicgKyBjaGlsZCkgOiAnJykpO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlID09PSAnUGF0aEV4cHJlc3Npb24nKSB7XG5cdCAgICAgIHRoaXMucHVzaFN0cmluZyhuYW1lKTtcblx0ICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ1N1YkV4cHJlc3Npb24nKSB7XG5cdCAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCgndHJ1ZScpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKCdudWxsJyk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIC8vIEhFTFBFUlNcblxuXHQgIGNvbXBpbGVyOiBKYXZhU2NyaXB0Q29tcGlsZXIsXG5cblx0ICBjb21waWxlQ2hpbGRyZW46IGZ1bmN0aW9uIGNvbXBpbGVDaGlsZHJlbihlbnZpcm9ubWVudCwgb3B0aW9ucykge1xuXHQgICAgdmFyIGNoaWxkcmVuID0gZW52aXJvbm1lbnQuY2hpbGRyZW4sXG5cdCAgICAgICAgY2hpbGQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgY29tcGlsZXIgPSB1bmRlZmluZWQ7XG5cblx0ICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG5cdCAgICAgIGNvbXBpbGVyID0gbmV3IHRoaXMuY29tcGlsZXIoKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuZXctY2FwXG5cblx0ICAgICAgdmFyIGV4aXN0aW5nID0gdGhpcy5tYXRjaEV4aXN0aW5nUHJvZ3JhbShjaGlsZCk7XG5cblx0ICAgICAgaWYgKGV4aXN0aW5nID09IG51bGwpIHtcblx0ICAgICAgICB0aGlzLmNvbnRleHQucHJvZ3JhbXMucHVzaCgnJyk7IC8vIFBsYWNlaG9sZGVyIHRvIHByZXZlbnQgbmFtZSBjb25mbGljdHMgZm9yIG5lc3RlZCBjaGlsZHJlblxuXHQgICAgICAgIHZhciBpbmRleCA9IHRoaXMuY29udGV4dC5wcm9ncmFtcy5sZW5ndGg7XG5cdCAgICAgICAgY2hpbGQuaW5kZXggPSBpbmRleDtcblx0ICAgICAgICBjaGlsZC5uYW1lID0gJ3Byb2dyYW0nICsgaW5kZXg7XG5cdCAgICAgICAgdGhpcy5jb250ZXh0LnByb2dyYW1zW2luZGV4XSA9IGNvbXBpbGVyLmNvbXBpbGUoY2hpbGQsIG9wdGlvbnMsIHRoaXMuY29udGV4dCwgIXRoaXMucHJlY29tcGlsZSk7XG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmRlY29yYXRvcnNbaW5kZXhdID0gY29tcGlsZXIuZGVjb3JhdG9ycztcblx0ICAgICAgICB0aGlzLmNvbnRleHQuZW52aXJvbm1lbnRzW2luZGV4XSA9IGNoaWxkO1xuXG5cdCAgICAgICAgdGhpcy51c2VEZXB0aHMgPSB0aGlzLnVzZURlcHRocyB8fCBjb21waWxlci51c2VEZXB0aHM7XG5cdCAgICAgICAgdGhpcy51c2VCbG9ja1BhcmFtcyA9IHRoaXMudXNlQmxvY2tQYXJhbXMgfHwgY29tcGlsZXIudXNlQmxvY2tQYXJhbXM7XG5cdCAgICAgICAgY2hpbGQudXNlRGVwdGhzID0gdGhpcy51c2VEZXB0aHM7XG5cdCAgICAgICAgY2hpbGQudXNlQmxvY2tQYXJhbXMgPSB0aGlzLnVzZUJsb2NrUGFyYW1zO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGNoaWxkLmluZGV4ID0gZXhpc3RpbmcuaW5kZXg7XG5cdCAgICAgICAgY2hpbGQubmFtZSA9ICdwcm9ncmFtJyArIGV4aXN0aW5nLmluZGV4O1xuXG5cdCAgICAgICAgdGhpcy51c2VEZXB0aHMgPSB0aGlzLnVzZURlcHRocyB8fCBleGlzdGluZy51c2VEZXB0aHM7XG5cdCAgICAgICAgdGhpcy51c2VCbG9ja1BhcmFtcyA9IHRoaXMudXNlQmxvY2tQYXJhbXMgfHwgZXhpc3RpbmcudXNlQmxvY2tQYXJhbXM7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LFxuXHQgIG1hdGNoRXhpc3RpbmdQcm9ncmFtOiBmdW5jdGlvbiBtYXRjaEV4aXN0aW5nUHJvZ3JhbShjaGlsZCkge1xuXHQgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuY29udGV4dC5lbnZpcm9ubWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgdmFyIGVudmlyb25tZW50ID0gdGhpcy5jb250ZXh0LmVudmlyb25tZW50c1tpXTtcblx0ICAgICAgaWYgKGVudmlyb25tZW50ICYmIGVudmlyb25tZW50LmVxdWFscyhjaGlsZCkpIHtcblx0ICAgICAgICByZXR1cm4gZW52aXJvbm1lbnQ7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgcHJvZ3JhbUV4cHJlc3Npb246IGZ1bmN0aW9uIHByb2dyYW1FeHByZXNzaW9uKGd1aWQpIHtcblx0ICAgIHZhciBjaGlsZCA9IHRoaXMuZW52aXJvbm1lbnQuY2hpbGRyZW5bZ3VpZF0sXG5cdCAgICAgICAgcHJvZ3JhbVBhcmFtcyA9IFtjaGlsZC5pbmRleCwgJ2RhdGEnLCBjaGlsZC5ibG9ja1BhcmFtc107XG5cblx0ICAgIGlmICh0aGlzLnVzZUJsb2NrUGFyYW1zIHx8IHRoaXMudXNlRGVwdGhzKSB7XG5cdCAgICAgIHByb2dyYW1QYXJhbXMucHVzaCgnYmxvY2tQYXJhbXMnKTtcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnVzZURlcHRocykge1xuXHQgICAgICBwcm9ncmFtUGFyYW1zLnB1c2goJ2RlcHRocycpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gJ2NvbnRhaW5lci5wcm9ncmFtKCcgKyBwcm9ncmFtUGFyYW1zLmpvaW4oJywgJykgKyAnKSc7XG5cdCAgfSxcblxuXHQgIHVzZVJlZ2lzdGVyOiBmdW5jdGlvbiB1c2VSZWdpc3RlcihuYW1lKSB7XG5cdCAgICBpZiAoIXRoaXMucmVnaXN0ZXJzW25hbWVdKSB7XG5cdCAgICAgIHRoaXMucmVnaXN0ZXJzW25hbWVdID0gdHJ1ZTtcblx0ICAgICAgdGhpcy5yZWdpc3RlcnMubGlzdC5wdXNoKG5hbWUpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBwdXNoOiBmdW5jdGlvbiBwdXNoKGV4cHIpIHtcblx0ICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBMaXRlcmFsKSkge1xuXHQgICAgICBleHByID0gdGhpcy5zb3VyY2Uud3JhcChleHByKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5pbmxpbmVTdGFjay5wdXNoKGV4cHIpO1xuXHQgICAgcmV0dXJuIGV4cHI7XG5cdCAgfSxcblxuXHQgIHB1c2hTdGFja0xpdGVyYWw6IGZ1bmN0aW9uIHB1c2hTdGFja0xpdGVyYWwoaXRlbSkge1xuXHQgICAgdGhpcy5wdXNoKG5ldyBMaXRlcmFsKGl0ZW0pKTtcblx0ICB9LFxuXG5cdCAgcHVzaFNvdXJjZTogZnVuY3Rpb24gcHVzaFNvdXJjZShzb3VyY2UpIHtcblx0ICAgIGlmICh0aGlzLnBlbmRpbmdDb250ZW50KSB7XG5cdCAgICAgIHRoaXMuc291cmNlLnB1c2godGhpcy5hcHBlbmRUb0J1ZmZlcih0aGlzLnNvdXJjZS5xdW90ZWRTdHJpbmcodGhpcy5wZW5kaW5nQ29udGVudCksIHRoaXMucGVuZGluZ0xvY2F0aW9uKSk7XG5cdCAgICAgIHRoaXMucGVuZGluZ0NvbnRlbnQgPSB1bmRlZmluZWQ7XG5cdCAgICB9XG5cblx0ICAgIGlmIChzb3VyY2UpIHtcblx0ICAgICAgdGhpcy5zb3VyY2UucHVzaChzb3VyY2UpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICByZXBsYWNlU3RhY2s6IGZ1bmN0aW9uIHJlcGxhY2VTdGFjayhjYWxsYmFjaykge1xuXHQgICAgdmFyIHByZWZpeCA9IFsnKCddLFxuXHQgICAgICAgIHN0YWNrID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGNyZWF0ZWRTdGFjayA9IHVuZGVmaW5lZCxcblx0ICAgICAgICB1c2VkTGl0ZXJhbCA9IHVuZGVmaW5lZDtcblxuXHQgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICAgIGlmICghdGhpcy5pc0lubGluZSgpKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdyZXBsYWNlU3RhY2sgb24gbm9uLWlubGluZScpO1xuXHQgICAgfVxuXG5cdCAgICAvLyBXZSB3YW50IHRvIG1lcmdlIHRoZSBpbmxpbmUgc3RhdGVtZW50IGludG8gdGhlIHJlcGxhY2VtZW50IHN0YXRlbWVudCB2aWEgJywnXG5cdCAgICB2YXIgdG9wID0gdGhpcy5wb3BTdGFjayh0cnVlKTtcblxuXHQgICAgaWYgKHRvcCBpbnN0YW5jZW9mIExpdGVyYWwpIHtcblx0ICAgICAgLy8gTGl0ZXJhbHMgZG8gbm90IG5lZWQgdG8gYmUgaW5saW5lZFxuXHQgICAgICBzdGFjayA9IFt0b3AudmFsdWVdO1xuXHQgICAgICBwcmVmaXggPSBbJygnLCBzdGFja107XG5cdCAgICAgIHVzZWRMaXRlcmFsID0gdHJ1ZTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIC8vIEdldCBvciBjcmVhdGUgdGhlIGN1cnJlbnQgc3RhY2sgbmFtZSBmb3IgdXNlIGJ5IHRoZSBpbmxpbmVcblx0ICAgICAgY3JlYXRlZFN0YWNrID0gdHJ1ZTtcblx0ICAgICAgdmFyIF9uYW1lID0gdGhpcy5pbmNyU3RhY2soKTtcblxuXHQgICAgICBwcmVmaXggPSBbJygoJywgdGhpcy5wdXNoKF9uYW1lKSwgJyA9ICcsIHRvcCwgJyknXTtcblx0ICAgICAgc3RhY2sgPSB0aGlzLnRvcFN0YWNrKCk7XG5cdCAgICB9XG5cblx0ICAgIHZhciBpdGVtID0gY2FsbGJhY2suY2FsbCh0aGlzLCBzdGFjayk7XG5cblx0ICAgIGlmICghdXNlZExpdGVyYWwpIHtcblx0ICAgICAgdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgfVxuXHQgICAgaWYgKGNyZWF0ZWRTdGFjaykge1xuXHQgICAgICB0aGlzLnN0YWNrU2xvdC0tO1xuXHQgICAgfVxuXHQgICAgdGhpcy5wdXNoKHByZWZpeC5jb25jYXQoaXRlbSwgJyknKSk7XG5cdCAgfSxcblxuXHQgIGluY3JTdGFjazogZnVuY3Rpb24gaW5jclN0YWNrKCkge1xuXHQgICAgdGhpcy5zdGFja1Nsb3QrKztcblx0ICAgIGlmICh0aGlzLnN0YWNrU2xvdCA+IHRoaXMuc3RhY2tWYXJzLmxlbmd0aCkge1xuXHQgICAgICB0aGlzLnN0YWNrVmFycy5wdXNoKCdzdGFjaycgKyB0aGlzLnN0YWNrU2xvdCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcy50b3BTdGFja05hbWUoKTtcblx0ICB9LFxuXHQgIHRvcFN0YWNrTmFtZTogZnVuY3Rpb24gdG9wU3RhY2tOYW1lKCkge1xuXHQgICAgcmV0dXJuICdzdGFjaycgKyB0aGlzLnN0YWNrU2xvdDtcblx0ICB9LFxuXHQgIGZsdXNoSW5saW5lOiBmdW5jdGlvbiBmbHVzaElubGluZSgpIHtcblx0ICAgIHZhciBpbmxpbmVTdGFjayA9IHRoaXMuaW5saW5lU3RhY2s7XG5cdCAgICB0aGlzLmlubGluZVN0YWNrID0gW107XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gaW5saW5lU3RhY2subGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgdmFyIGVudHJ5ID0gaW5saW5lU3RhY2tbaV07XG5cdCAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHQgICAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBMaXRlcmFsKSB7XG5cdCAgICAgICAgdGhpcy5jb21waWxlU3RhY2sucHVzaChlbnRyeSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFyIHN0YWNrID0gdGhpcy5pbmNyU3RhY2soKTtcblx0ICAgICAgICB0aGlzLnB1c2hTb3VyY2UoW3N0YWNrLCAnID0gJywgZW50cnksICc7J10pO1xuXHQgICAgICAgIHRoaXMuY29tcGlsZVN0YWNrLnB1c2goc3RhY2spO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSxcblx0ICBpc0lubGluZTogZnVuY3Rpb24gaXNJbmxpbmUoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5pbmxpbmVTdGFjay5sZW5ndGg7XG5cdCAgfSxcblxuXHQgIHBvcFN0YWNrOiBmdW5jdGlvbiBwb3BTdGFjayh3cmFwcGVkKSB7XG5cdCAgICB2YXIgaW5saW5lID0gdGhpcy5pc0lubGluZSgpLFxuXHQgICAgICAgIGl0ZW0gPSAoaW5saW5lID8gdGhpcy5pbmxpbmVTdGFjayA6IHRoaXMuY29tcGlsZVN0YWNrKS5wb3AoKTtcblxuXHQgICAgaWYgKCF3cmFwcGVkICYmIGl0ZW0gaW5zdGFuY2VvZiBMaXRlcmFsKSB7XG5cdCAgICAgIHJldHVybiBpdGVtLnZhbHVlO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKCFpbmxpbmUpIHtcblx0ICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgICAgICAgIGlmICghdGhpcy5zdGFja1Nsb3QpIHtcblx0ICAgICAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdJbnZhbGlkIHN0YWNrIHBvcCcpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB0aGlzLnN0YWNrU2xvdC0tO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBpdGVtO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICB0b3BTdGFjazogZnVuY3Rpb24gdG9wU3RhY2soKSB7XG5cdCAgICB2YXIgc3RhY2sgPSB0aGlzLmlzSW5saW5lKCkgPyB0aGlzLmlubGluZVN0YWNrIDogdGhpcy5jb21waWxlU3RhY2ssXG5cdCAgICAgICAgaXRlbSA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuXG5cdCAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0ICAgIGlmIChpdGVtIGluc3RhbmNlb2YgTGl0ZXJhbCkge1xuXHQgICAgICByZXR1cm4gaXRlbS52YWx1ZTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiBpdGVtO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBjb250ZXh0TmFtZTogZnVuY3Rpb24gY29udGV4dE5hbWUoY29udGV4dCkge1xuXHQgICAgaWYgKHRoaXMudXNlRGVwdGhzICYmIGNvbnRleHQpIHtcblx0ICAgICAgcmV0dXJuICdkZXB0aHNbJyArIGNvbnRleHQgKyAnXSc7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gJ2RlcHRoJyArIGNvbnRleHQ7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHF1b3RlZFN0cmluZzogZnVuY3Rpb24gcXVvdGVkU3RyaW5nKHN0cikge1xuXHQgICAgcmV0dXJuIHRoaXMuc291cmNlLnF1b3RlZFN0cmluZyhzdHIpO1xuXHQgIH0sXG5cblx0ICBvYmplY3RMaXRlcmFsOiBmdW5jdGlvbiBvYmplY3RMaXRlcmFsKG9iaikge1xuXHQgICAgcmV0dXJuIHRoaXMuc291cmNlLm9iamVjdExpdGVyYWwob2JqKTtcblx0ICB9LFxuXG5cdCAgYWxpYXNhYmxlOiBmdW5jdGlvbiBhbGlhc2FibGUobmFtZSkge1xuXHQgICAgdmFyIHJldCA9IHRoaXMuYWxpYXNlc1tuYW1lXTtcblx0ICAgIGlmIChyZXQpIHtcblx0ICAgICAgcmV0LnJlZmVyZW5jZUNvdW50Kys7XG5cdCAgICAgIHJldHVybiByZXQ7XG5cdCAgICB9XG5cblx0ICAgIHJldCA9IHRoaXMuYWxpYXNlc1tuYW1lXSA9IHRoaXMuc291cmNlLndyYXAobmFtZSk7XG5cdCAgICByZXQuYWxpYXNhYmxlID0gdHJ1ZTtcblx0ICAgIHJldC5yZWZlcmVuY2VDb3VudCA9IDE7XG5cblx0ICAgIHJldHVybiByZXQ7XG5cdCAgfSxcblxuXHQgIHNldHVwSGVscGVyOiBmdW5jdGlvbiBzZXR1cEhlbHBlcihwYXJhbVNpemUsIG5hbWUsIGJsb2NrSGVscGVyKSB7XG5cdCAgICB2YXIgcGFyYW1zID0gW10sXG5cdCAgICAgICAgcGFyYW1zSW5pdCA9IHRoaXMuc2V0dXBIZWxwZXJBcmdzKG5hbWUsIHBhcmFtU2l6ZSwgcGFyYW1zLCBibG9ja0hlbHBlcik7XG5cdCAgICB2YXIgZm91bmRIZWxwZXIgPSB0aGlzLm5hbWVMb29rdXAoJ2hlbHBlcnMnLCBuYW1lLCAnaGVscGVyJyksXG5cdCAgICAgICAgY2FsbENvbnRleHQgPSB0aGlzLmFsaWFzYWJsZSh0aGlzLmNvbnRleHROYW1lKDApICsgJyAhPSBudWxsID8gJyArIHRoaXMuY29udGV4dE5hbWUoMCkgKyAnIDogKGNvbnRhaW5lci5udWxsQ29udGV4dCB8fCB7fSknKTtcblxuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgcGFyYW1zOiBwYXJhbXMsXG5cdCAgICAgIHBhcmFtc0luaXQ6IHBhcmFtc0luaXQsXG5cdCAgICAgIG5hbWU6IGZvdW5kSGVscGVyLFxuXHQgICAgICBjYWxsUGFyYW1zOiBbY2FsbENvbnRleHRdLmNvbmNhdChwYXJhbXMpXG5cdCAgICB9O1xuXHQgIH0sXG5cblx0ICBzZXR1cFBhcmFtczogZnVuY3Rpb24gc2V0dXBQYXJhbXMoaGVscGVyLCBwYXJhbVNpemUsIHBhcmFtcykge1xuXHQgICAgdmFyIG9wdGlvbnMgPSB7fSxcblx0ICAgICAgICBjb250ZXh0cyA9IFtdLFxuXHQgICAgICAgIHR5cGVzID0gW10sXG5cdCAgICAgICAgaWRzID0gW10sXG5cdCAgICAgICAgb2JqZWN0QXJncyA9ICFwYXJhbXMsXG5cdCAgICAgICAgcGFyYW0gPSB1bmRlZmluZWQ7XG5cblx0ICAgIGlmIChvYmplY3RBcmdzKSB7XG5cdCAgICAgIHBhcmFtcyA9IFtdO1xuXHQgICAgfVxuXG5cdCAgICBvcHRpb25zLm5hbWUgPSB0aGlzLnF1b3RlZFN0cmluZyhoZWxwZXIpO1xuXHQgICAgb3B0aW9ucy5oYXNoID0gdGhpcy5wb3BTdGFjaygpO1xuXG5cdCAgICBpZiAodGhpcy50cmFja0lkcykge1xuXHQgICAgICBvcHRpb25zLmhhc2hJZHMgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICB9XG5cdCAgICBpZiAodGhpcy5zdHJpbmdQYXJhbXMpIHtcblx0ICAgICAgb3B0aW9ucy5oYXNoVHlwZXMgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgIG9wdGlvbnMuaGFzaENvbnRleHRzID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgaW52ZXJzZSA9IHRoaXMucG9wU3RhY2soKSxcblx0ICAgICAgICBwcm9ncmFtID0gdGhpcy5wb3BTdGFjaygpO1xuXG5cdCAgICAvLyBBdm9pZCBzZXR0aW5nIGZuIGFuZCBpbnZlcnNlIGlmIG5laXRoZXIgYXJlIHNldC4gVGhpcyBhbGxvd3Ncblx0ICAgIC8vIGhlbHBlcnMgdG8gZG8gYSBjaGVjayBmb3IgYGlmIChvcHRpb25zLmZuKWBcblx0ICAgIGlmIChwcm9ncmFtIHx8IGludmVyc2UpIHtcblx0ICAgICAgb3B0aW9ucy5mbiA9IHByb2dyYW0gfHwgJ2NvbnRhaW5lci5ub29wJztcblx0ICAgICAgb3B0aW9ucy5pbnZlcnNlID0gaW52ZXJzZSB8fCAnY29udGFpbmVyLm5vb3AnO1xuXHQgICAgfVxuXG5cdCAgICAvLyBUaGUgcGFyYW1ldGVycyBnbyBvbiB0byB0aGUgc3RhY2sgaW4gb3JkZXIgKG1ha2luZyBzdXJlIHRoYXQgdGhleSBhcmUgZXZhbHVhdGVkIGluIG9yZGVyKVxuXHQgICAgLy8gc28gd2UgbmVlZCB0byBwb3AgdGhlbSBvZmYgdGhlIHN0YWNrIGluIHJldmVyc2Ugb3JkZXJcblx0ICAgIHZhciBpID0gcGFyYW1TaXplO1xuXHQgICAgd2hpbGUgKGktLSkge1xuXHQgICAgICBwYXJhbSA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgICAgcGFyYW1zW2ldID0gcGFyYW07XG5cblx0ICAgICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcblx0ICAgICAgICBpZHNbaV0gPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG5cdCAgICAgICAgdHlwZXNbaV0gPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgICAgY29udGV4dHNbaV0gPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgaWYgKG9iamVjdEFyZ3MpIHtcblx0ICAgICAgb3B0aW9ucy5hcmdzID0gdGhpcy5zb3VyY2UuZ2VuZXJhdGVBcnJheShwYXJhbXMpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAodGhpcy50cmFja0lkcykge1xuXHQgICAgICBvcHRpb25zLmlkcyA9IHRoaXMuc291cmNlLmdlbmVyYXRlQXJyYXkoaWRzKTtcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuXHQgICAgICBvcHRpb25zLnR5cGVzID0gdGhpcy5zb3VyY2UuZ2VuZXJhdGVBcnJheSh0eXBlcyk7XG5cdCAgICAgIG9wdGlvbnMuY29udGV4dHMgPSB0aGlzLnNvdXJjZS5nZW5lcmF0ZUFycmF5KGNvbnRleHRzKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhKSB7XG5cdCAgICAgIG9wdGlvbnMuZGF0YSA9ICdkYXRhJztcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnVzZUJsb2NrUGFyYW1zKSB7XG5cdCAgICAgIG9wdGlvbnMuYmxvY2tQYXJhbXMgPSAnYmxvY2tQYXJhbXMnO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG9wdGlvbnM7XG5cdCAgfSxcblxuXHQgIHNldHVwSGVscGVyQXJnczogZnVuY3Rpb24gc2V0dXBIZWxwZXJBcmdzKGhlbHBlciwgcGFyYW1TaXplLCBwYXJhbXMsIHVzZVJlZ2lzdGVyKSB7XG5cdCAgICB2YXIgb3B0aW9ucyA9IHRoaXMuc2V0dXBQYXJhbXMoaGVscGVyLCBwYXJhbVNpemUsIHBhcmFtcyk7XG5cdCAgICBvcHRpb25zID0gdGhpcy5vYmplY3RMaXRlcmFsKG9wdGlvbnMpO1xuXHQgICAgaWYgKHVzZVJlZ2lzdGVyKSB7XG5cdCAgICAgIHRoaXMudXNlUmVnaXN0ZXIoJ29wdGlvbnMnKTtcblx0ICAgICAgcGFyYW1zLnB1c2goJ29wdGlvbnMnKTtcblx0ICAgICAgcmV0dXJuIFsnb3B0aW9ucz0nLCBvcHRpb25zXTtcblx0ICAgIH0gZWxzZSBpZiAocGFyYW1zKSB7XG5cdCAgICAgIHBhcmFtcy5wdXNoKG9wdGlvbnMpO1xuXHQgICAgICByZXR1cm4gJyc7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gb3B0aW9ucztcblx0ICAgIH1cblx0ICB9XG5cdH07XG5cblx0KGZ1bmN0aW9uICgpIHtcblx0ICB2YXIgcmVzZXJ2ZWRXb3JkcyA9ICgnYnJlYWsgZWxzZSBuZXcgdmFyJyArICcgY2FzZSBmaW5hbGx5IHJldHVybiB2b2lkJyArICcgY2F0Y2ggZm9yIHN3aXRjaCB3aGlsZScgKyAnIGNvbnRpbnVlIGZ1bmN0aW9uIHRoaXMgd2l0aCcgKyAnIGRlZmF1bHQgaWYgdGhyb3cnICsgJyBkZWxldGUgaW4gdHJ5JyArICcgZG8gaW5zdGFuY2VvZiB0eXBlb2YnICsgJyBhYnN0cmFjdCBlbnVtIGludCBzaG9ydCcgKyAnIGJvb2xlYW4gZXhwb3J0IGludGVyZmFjZSBzdGF0aWMnICsgJyBieXRlIGV4dGVuZHMgbG9uZyBzdXBlcicgKyAnIGNoYXIgZmluYWwgbmF0aXZlIHN5bmNocm9uaXplZCcgKyAnIGNsYXNzIGZsb2F0IHBhY2thZ2UgdGhyb3dzJyArICcgY29uc3QgZ290byBwcml2YXRlIHRyYW5zaWVudCcgKyAnIGRlYnVnZ2VyIGltcGxlbWVudHMgcHJvdGVjdGVkIHZvbGF0aWxlJyArICcgZG91YmxlIGltcG9ydCBwdWJsaWMgbGV0IHlpZWxkIGF3YWl0JyArICcgbnVsbCB0cnVlIGZhbHNlJykuc3BsaXQoJyAnKTtcblxuXHQgIHZhciBjb21waWxlcldvcmRzID0gSmF2YVNjcmlwdENvbXBpbGVyLlJFU0VSVkVEX1dPUkRTID0ge307XG5cblx0ICBmb3IgKHZhciBpID0gMCwgbCA9IHJlc2VydmVkV29yZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICBjb21waWxlcldvcmRzW3Jlc2VydmVkV29yZHNbaV1dID0gdHJ1ZTtcblx0ICB9XG5cdH0pKCk7XG5cblx0SmF2YVNjcmlwdENvbXBpbGVyLmlzVmFsaWRKYXZhU2NyaXB0VmFyaWFibGVOYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcblx0ICByZXR1cm4gIUphdmFTY3JpcHRDb21waWxlci5SRVNFUlZFRF9XT1JEU1tuYW1lXSAmJiAvXlthLXpBLVpfJF1bMC05YS16QS1aXyRdKiQvLnRlc3QobmFtZSk7XG5cdH07XG5cblx0ZnVuY3Rpb24gc3RyaWN0TG9va3VwKHJlcXVpcmVUZXJtaW5hbCwgY29tcGlsZXIsIHBhcnRzLCB0eXBlKSB7XG5cdCAgdmFyIHN0YWNrID0gY29tcGlsZXIucG9wU3RhY2soKSxcblx0ICAgICAgaSA9IDAsXG5cdCAgICAgIGxlbiA9IHBhcnRzLmxlbmd0aDtcblx0ICBpZiAocmVxdWlyZVRlcm1pbmFsKSB7XG5cdCAgICBsZW4tLTtcblx0ICB9XG5cblx0ICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICBzdGFjayA9IGNvbXBpbGVyLm5hbWVMb29rdXAoc3RhY2ssIHBhcnRzW2ldLCB0eXBlKTtcblx0ICB9XG5cblx0ICBpZiAocmVxdWlyZVRlcm1pbmFsKSB7XG5cdCAgICByZXR1cm4gW2NvbXBpbGVyLmFsaWFzYWJsZSgnY29udGFpbmVyLnN0cmljdCcpLCAnKCcsIHN0YWNrLCAnLCAnLCBjb21waWxlci5xdW90ZWRTdHJpbmcocGFydHNbaV0pLCAnKSddO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXR1cm4gc3RhY2s7XG5cdCAgfVxuXHR9XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gSmF2YVNjcmlwdENvbXBpbGVyO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiA0MyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIGdsb2JhbCBkZWZpbmUgKi9cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIFNvdXJjZU5vZGUgPSB1bmRlZmluZWQ7XG5cblx0dHJ5IHtcblx0ICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgIGlmIChmYWxzZSkge1xuXHQgICAgLy8gV2UgZG9uJ3Qgc3VwcG9ydCB0aGlzIGluIEFNRCBlbnZpcm9ubWVudHMuIEZvciB0aGVzZSBlbnZpcm9ubWVudHMsIHdlIGFzdXNtZSB0aGF0XG5cdCAgICAvLyB0aGV5IGFyZSBydW5uaW5nIG9uIHRoZSBicm93c2VyIGFuZCB0aHVzIGhhdmUgbm8gbmVlZCBmb3IgdGhlIHNvdXJjZS1tYXAgbGlicmFyeS5cblx0ICAgIHZhciBTb3VyY2VNYXAgPSByZXF1aXJlKCdzb3VyY2UtbWFwJyk7XG5cdCAgICBTb3VyY2VOb2RlID0gU291cmNlTWFwLlNvdXJjZU5vZGU7XG5cdCAgfVxuXHR9IGNhdGNoIChlcnIpIHt9XG5cdC8qIE5PUCAqL1xuXG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBpZjogdGVzdGVkIGJ1dCBub3QgY292ZXJlZCBpbiBpc3RhbmJ1bCBkdWUgdG8gZGlzdCBidWlsZCAgKi9cblx0aWYgKCFTb3VyY2VOb2RlKSB7XG5cdCAgU291cmNlTm9kZSA9IGZ1bmN0aW9uIChsaW5lLCBjb2x1bW4sIHNyY0ZpbGUsIGNodW5rcykge1xuXHQgICAgdGhpcy5zcmMgPSAnJztcblx0ICAgIGlmIChjaHVua3MpIHtcblx0ICAgICAgdGhpcy5hZGQoY2h1bmtzKTtcblx0ICAgIH1cblx0ICB9O1xuXHQgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgU291cmNlTm9kZS5wcm90b3R5cGUgPSB7XG5cdCAgICBhZGQ6IGZ1bmN0aW9uIGFkZChjaHVua3MpIHtcblx0ICAgICAgaWYgKF91dGlscy5pc0FycmF5KGNodW5rcykpIHtcblx0ICAgICAgICBjaHVua3MgPSBjaHVua3Muam9pbignJyk7XG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5zcmMgKz0gY2h1bmtzO1xuXHQgICAgfSxcblx0ICAgIHByZXBlbmQ6IGZ1bmN0aW9uIHByZXBlbmQoY2h1bmtzKSB7XG5cdCAgICAgIGlmIChfdXRpbHMuaXNBcnJheShjaHVua3MpKSB7XG5cdCAgICAgICAgY2h1bmtzID0gY2h1bmtzLmpvaW4oJycpO1xuXHQgICAgICB9XG5cdCAgICAgIHRoaXMuc3JjID0gY2h1bmtzICsgdGhpcy5zcmM7XG5cdCAgICB9LFxuXHQgICAgdG9TdHJpbmdXaXRoU291cmNlTWFwOiBmdW5jdGlvbiB0b1N0cmluZ1dpdGhTb3VyY2VNYXAoKSB7XG5cdCAgICAgIHJldHVybiB7IGNvZGU6IHRoaXMudG9TdHJpbmcoKSB9O1xuXHQgICAgfSxcblx0ICAgIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuc3JjO1xuXHQgICAgfVxuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBjYXN0Q2h1bmsoY2h1bmssIGNvZGVHZW4sIGxvYykge1xuXHQgIGlmIChfdXRpbHMuaXNBcnJheShjaHVuaykpIHtcblx0ICAgIHZhciByZXQgPSBbXTtcblxuXHQgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNodW5rLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIHJldC5wdXNoKGNvZGVHZW4ud3JhcChjaHVua1tpXSwgbG9jKSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH0gZWxzZSBpZiAodHlwZW9mIGNodW5rID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIGNodW5rID09PSAnbnVtYmVyJykge1xuXHQgICAgLy8gSGFuZGxlIHByaW1pdGl2ZXMgdGhhdCB0aGUgU291cmNlTm9kZSB3aWxsIHRocm93IHVwIG9uXG5cdCAgICByZXR1cm4gY2h1bmsgKyAnJztcblx0ICB9XG5cdCAgcmV0dXJuIGNodW5rO1xuXHR9XG5cblx0ZnVuY3Rpb24gQ29kZUdlbihzcmNGaWxlKSB7XG5cdCAgdGhpcy5zcmNGaWxlID0gc3JjRmlsZTtcblx0ICB0aGlzLnNvdXJjZSA9IFtdO1xuXHR9XG5cblx0Q29kZUdlbi5wcm90b3R5cGUgPSB7XG5cdCAgaXNFbXB0eTogZnVuY3Rpb24gaXNFbXB0eSgpIHtcblx0ICAgIHJldHVybiAhdGhpcy5zb3VyY2UubGVuZ3RoO1xuXHQgIH0sXG5cdCAgcHJlcGVuZDogZnVuY3Rpb24gcHJlcGVuZChzb3VyY2UsIGxvYykge1xuXHQgICAgdGhpcy5zb3VyY2UudW5zaGlmdCh0aGlzLndyYXAoc291cmNlLCBsb2MpKTtcblx0ICB9LFxuXHQgIHB1c2g6IGZ1bmN0aW9uIHB1c2goc291cmNlLCBsb2MpIHtcblx0ICAgIHRoaXMuc291cmNlLnB1c2godGhpcy53cmFwKHNvdXJjZSwgbG9jKSk7XG5cdCAgfSxcblxuXHQgIG1lcmdlOiBmdW5jdGlvbiBtZXJnZSgpIHtcblx0ICAgIHZhciBzb3VyY2UgPSB0aGlzLmVtcHR5KCk7XG5cdCAgICB0aGlzLmVhY2goZnVuY3Rpb24gKGxpbmUpIHtcblx0ICAgICAgc291cmNlLmFkZChbJyAgJywgbGluZSwgJ1xcbiddKTtcblx0ICAgIH0pO1xuXHQgICAgcmV0dXJuIHNvdXJjZTtcblx0ICB9LFxuXG5cdCAgZWFjaDogZnVuY3Rpb24gZWFjaChpdGVyKSB7XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5zb3VyY2UubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgaXRlcih0aGlzLnNvdXJjZVtpXSk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIGVtcHR5OiBmdW5jdGlvbiBlbXB0eSgpIHtcblx0ICAgIHZhciBsb2MgPSB0aGlzLmN1cnJlbnRMb2NhdGlvbiB8fCB7IHN0YXJ0OiB7fSB9O1xuXHQgICAgcmV0dXJuIG5ldyBTb3VyY2VOb2RlKGxvYy5zdGFydC5saW5lLCBsb2Muc3RhcnQuY29sdW1uLCB0aGlzLnNyY0ZpbGUpO1xuXHQgIH0sXG5cdCAgd3JhcDogZnVuY3Rpb24gd3JhcChjaHVuaykge1xuXHQgICAgdmFyIGxvYyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHRoaXMuY3VycmVudExvY2F0aW9uIHx8IHsgc3RhcnQ6IHt9IH0gOiBhcmd1bWVudHNbMV07XG5cblx0ICAgIGlmIChjaHVuayBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpIHtcblx0ICAgICAgcmV0dXJuIGNodW5rO1xuXHQgICAgfVxuXG5cdCAgICBjaHVuayA9IGNhc3RDaHVuayhjaHVuaywgdGhpcywgbG9jKTtcblxuXHQgICAgcmV0dXJuIG5ldyBTb3VyY2VOb2RlKGxvYy5zdGFydC5saW5lLCBsb2Muc3RhcnQuY29sdW1uLCB0aGlzLnNyY0ZpbGUsIGNodW5rKTtcblx0ICB9LFxuXG5cdCAgZnVuY3Rpb25DYWxsOiBmdW5jdGlvbiBmdW5jdGlvbkNhbGwoZm4sIHR5cGUsIHBhcmFtcykge1xuXHQgICAgcGFyYW1zID0gdGhpcy5nZW5lcmF0ZUxpc3QocGFyYW1zKTtcblx0ICAgIHJldHVybiB0aGlzLndyYXAoW2ZuLCB0eXBlID8gJy4nICsgdHlwZSArICcoJyA6ICcoJywgcGFyYW1zLCAnKSddKTtcblx0ICB9LFxuXG5cdCAgcXVvdGVkU3RyaW5nOiBmdW5jdGlvbiBxdW90ZWRTdHJpbmcoc3RyKSB7XG5cdCAgICByZXR1cm4gJ1wiJyArIChzdHIgKyAnJykucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csICdcXFxcbicpLnJlcGxhY2UoL1xcci9nLCAnXFxcXHInKS5yZXBsYWNlKC9cXHUyMDI4L2csICdcXFxcdTIwMjgnKSAvLyBQZXIgRWNtYS0yNjIgNy4zICsgNy44LjRcblx0ICAgIC5yZXBsYWNlKC9cXHUyMDI5L2csICdcXFxcdTIwMjknKSArICdcIic7XG5cdCAgfSxcblxuXHQgIG9iamVjdExpdGVyYWw6IGZ1bmN0aW9uIG9iamVjdExpdGVyYWwob2JqKSB7XG5cdCAgICB2YXIgcGFpcnMgPSBbXTtcblxuXHQgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuXHQgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0ICAgICAgICB2YXIgdmFsdWUgPSBjYXN0Q2h1bmsob2JqW2tleV0sIHRoaXMpO1xuXHQgICAgICAgIGlmICh2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICAgIHBhaXJzLnB1c2goW3RoaXMucXVvdGVkU3RyaW5nKGtleSksICc6JywgdmFsdWVdKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgdmFyIHJldCA9IHRoaXMuZ2VuZXJhdGVMaXN0KHBhaXJzKTtcblx0ICAgIHJldC5wcmVwZW5kKCd7Jyk7XG5cdCAgICByZXQuYWRkKCd9Jyk7XG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH0sXG5cblx0ICBnZW5lcmF0ZUxpc3Q6IGZ1bmN0aW9uIGdlbmVyYXRlTGlzdChlbnRyaWVzKSB7XG5cdCAgICB2YXIgcmV0ID0gdGhpcy5lbXB0eSgpO1xuXG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZW50cmllcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICBpZiAoaSkge1xuXHQgICAgICAgIHJldC5hZGQoJywnKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldC5hZGQoY2FzdENodW5rKGVudHJpZXNbaV0sIHRoaXMpKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHJldDtcblx0ICB9LFxuXG5cdCAgZ2VuZXJhdGVBcnJheTogZnVuY3Rpb24gZ2VuZXJhdGVBcnJheShlbnRyaWVzKSB7XG5cdCAgICB2YXIgcmV0ID0gdGhpcy5nZW5lcmF0ZUxpc3QoZW50cmllcyk7XG5cdCAgICByZXQucHJlcGVuZCgnWycpO1xuXHQgICAgcmV0LmFkZCgnXScpO1xuXG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH1cblx0fTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBDb2RlR2VuO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSlcbi8qKioqKiovIF0pXG59KTtcbjsiLCJpbXBvcnQgaGJzIGZyb20gJy4vLi4vYmVoYXZpb3JzL2hicyc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXJpb25ldHRlLlZpZXcuZXh0ZW5kKHtcbiAgICB0ZW1wbGF0ZTogZGF0YSA9PiAnYXV0aG9yaXphdGlvbicsXG4gICAgYmVoYXZpb3JzOiBbaGJzXSxcbiAgICBIQlRlbXBsYXRlOiAndGVtcGxhdGVzL3ZpZXdzL2F0aG9yaXphdGlvbi5oYnMnLFxuICAgIGNsYXNzTmFtZTogJ2F1dGhvcml6YXRpb24nLFxuICAgIHVpOiB7XG4gICAgICAgIGF1dGhvcml6ZTogJy5hdXRob3JpemF0aW9uX19idG4nLFxuICAgICAgICByZWdpc3RlcjogJy5yZWdpc3RyYXRpb25fX2J0bidcbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgQHVpLmF1dGhvcml6ZSc6ICdhdXRob3JpemVVc2VyJyxcbiAgICAgICAgJ2NsaWNrIEB1aS5yZWdpc3Rlcic6ICdyZWdpc3RlclVzZXInXG4gICAgfSxcbiAgICBhdXRob3JpemVVc2VyOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGVtYWlsID0gdGhpcy4kKCcuZW1haWxfX2lucHV0JykudmFsKCksXG4gICAgICAgICAgICBwYXNzID0gdGhpcy4kKCcucGFzc19faW5wdXQnKS52YWwoKTtcblxuICAgICAgICB2YXIgYXV0aCA9IGZpcmViYXNlLmF1dGgoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBhdXRoLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKGVtYWlsLCBwYXNzKTtcbiAgICAgICAgcHJvbWlzZS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgYWxlcnQoZS5tZXNzYWdlKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIHJlZ2lzdGVyVXNlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZW1haWwgPSB0aGlzLiQoJy5lbWFpbF9faW5wdXQnKS52YWwoKSxcbiAgICAgICAgICAgIHBhc3MgPSB0aGlzLiQoJy5wYXNzX19pbnB1dCcpLnZhbCgpO1xuXG4gICAgICAgIHZhciBhdXRoID0gZmlyZWJhc2UuYXV0aCgpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGF1dGguY3JlYXRlVXNlcldpdGhFbWFpbEFuZFBhc3N3b3JkKGVtYWlsLCBwYXNzKTtcblxuICAgICAgICBwcm9taXNlLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBhbGVydChlLm1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG9uTG9hZFRlbXBsYXRlICgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG59KTsiLCJpbXBvcnQgaGJzIGZyb20gJy4vLi4vYmVoYXZpb3JzL2hicyc7XG5cblxudmFyIFRhc2tNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5nZXQoXCJ0aXRsZVwiKSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoe1widGl0bGVcIjogdGhpcy5kZWZhdWx0cy50aXRsZX0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oYXR0cnMpIHtcbiAgICAgICAgaWYgKCAhJC50cmltKGF0dHJzLnRpdGxlKSApIHtcbiAgICAgICAgICAgIHJldHVybiAn0J7RiNC40LHQutCwISc7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRlZmF1bHRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgdGl0bGU6ICfQndC+0LLQsNGPINC30LDQtNCw0YfQsCcsXG4gICAgICAgICAgICBkb25lOiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcbiAgICB0b2dnbGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNhdmUoeyBkb25lOiF0aGlzLmdldChcImRvbmVcIil9KTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxufSk7XG5cbnZhciBUYXNrID0gTWFyaW9uZXR0ZS5WaWV3LmV4dGVuZCh7XG4gICAgdGVtcGxhdGU6IGRhdGEgPT4gJ21haW4gdmlldycsXG4gICAgYmVoYXZpb3JzOiBbaGJzXSxcbiAgICBIQlRlbXBsYXRlOiAndGVtcGxhdGVzL3ZpZXdzL3RvZG8uaXRlbS5oYnMnLFxuICAgIHRhZ05hbWU6ICdsaScsXG4gICAgY2xhc3NOYW1lOiAndGFza3NfX2l0ZW0nLFxuICAgIHVpOiB7XG4gICAgICAgIFwiZWRpdFwiOiBcIi50YXNrc19fdGV4dFwiLFxuICAgICAgICBcImVkaXRTdHlsZVwiOiBcIi50YXNrc19fdGV4dFwiLFxuICAgICAgICBcInJlbW92ZVwiOiBcIi50YXNrc19fcmVtb3ZlXCIsXG4gICAgICAgIFwidG9nZ2xlXCI6IFwiLnRhc2tzX190b2dnbGVcIlxuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIFwiZm9jdXNvdXQgQHVpLmVkaXRcIjogXCJlZGl0VGFza1wiLFxuICAgICAgICBcImNsaWNrIEB1aS5lZGl0U3R5bGVcIjogXCJlZGl0U3R5bGVzXCIsXG4gICAgICAgIFwiY2xpY2sgQHVpLnRvZ2dsZVwiOiBcInRvZ2dsZURvbmVcIixcbiAgICAgICAgJ2NsaWNrIEB1aS5yZW1vdmUnOiAncmVtb3ZlTW9kZWwnXG4gICAgfSxcbiAgICB0cmlnZ2Vyczoge1xuICAgICAgICAnY2xpY2sgQHVpLnJlbW92ZSc6ICdyZW1vdmU6bW9kZWwnXG4gICAgfSxcbiAgICBlZGl0U3R5bGVzOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgJChldmVudC5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnZWRpdCcpXG4gICAgfSxcbiAgICByZW1vdmVNb2RlbDogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICB0aGlzLm1vZGVsLmNsZWFyKCk7XG4gICAgfSxcbiAgICBvblJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJGVsLnRvZ2dsZUNsYXNzKCdkb25lJywgdGhpcy5tb2RlbC5nZXQoJ2RvbmUnKSk7XG4gICAgfSxcbiAgICBlZGl0VGFzazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIG5ld1Rhc2tUaXRsZSA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkudGV4dCgpO1xuICAgICAgICBpZiAobmV3VGFza1RpdGxlID09PSAnJykge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5jbGVhcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zYXZlKHtcInRpdGxlXCI6IF8uZXNjYXBlKG5ld1Rhc2tUaXRsZSl9LHt2YWxpZGF0ZTp0cnVlfSk777u/XG4gICAgICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnJlbW92ZUNsYXNzKCdlZGl0JylcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICB0b2dnbGVEb25lOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB0aGlzLm1vZGVsLnRvZ2dsZSgpO1xuICAgIH0sXG4gICAgb25Mb2FkVGVtcGxhdGUgKCkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgfVxufSk7XG5cbnZhciBUYXNrQ29sbGVjdGlvblZpZXcgPSBNYXJpb25ldHRlLkNvbGxlY3Rpb25WaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogJ3VsJyxcbiAgICBjbGFzc05hbWU6ICd0YXNrc19fbGlzdCcsXG4gICAgY2hpbGRWaWV3OiBUYXNrLFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5vbignY2hhbmdlJywgXy5iaW5kKHRoaXMucmVuZGVyLCB0aGlzKSk7XG4gICAgfSxcbiAgICBvbkNoaWxkdmlld1JlbW92ZU1vZGVsOiBmdW5jdGlvbiAodmlldykge1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb24ucmVtb3ZlKHZpZXcubW9kZWwpO1xuICAgIH0sXG4gICAgdmlld0NvbXBhcmF0b3I6IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgIHJldHVybiBtb2RlbC5nZXQoJ2RvbmUnKVxuICAgIH1cbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFyaW9uZXR0ZS5WaWV3LmV4dGVuZCh7XG4gICAgdGVtcGxhdGU6IGRhdGEgPT4gJ25ld3MgaXRlbScsXG4gICAgYmVoYXZpb3JzOiBbaGJzXSxcbiAgICBIQlRlbXBsYXRlOiAndGVtcGxhdGVzL3ZpZXdzL2N1cnJlbnQudXNlci5oYnMnLFxuICAgIGNsYXNzTmFtZTogJ2NvbnRhaW5lcicsXG4gICAgcmVnaW9uczoge1xuICAgICAgICBsaXN0OiB7XG4gICAgICAgICAgICBlbDogJy51c2VyX190YXNrcydcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdWk6IHtcbiAgICAgICAgbG9nT3V0OiAnLmxvZ291dF9fYnRuJyxcbiAgICAgICAgYWRkdGFzazogJy51c2VyX19hZGR0YXNrJ1xuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayBAdWkubG9nT3V0JzogJ2xvZ091dCcsXG4gICAgICAgICdjbGljayBAdWkuYWRkdGFzayc6ICdhZGRUYXNrJ1xuICAgIH0sXG4gICAgYWRkVGFzazogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciAkaW5wdXQgPSAkKCcudXNlcl9fdGFzaycpO1xuICAgICAgICB2YXIgbmV3VGFza1RpdGxlID0gJGlucHV0LnZhbCgpO1xuICAgICAgICBuZXdUYXNrVGl0bGUgPSBfLmVzY2FwZShuZXdUYXNrVGl0bGUpO1xuICAgICAgICAkaW5wdXQudmFsKCcnKTtcbiAgICAgICAgaWYgKCFuZXdUYXNrVGl0bGUpIHJldHVybjtcbiAgICAgICAgaWYgKG5ld1Rhc2tUaXRsZS5sZW5ndGggPiAxMDApIHJldHVybjtcbiAgICAgICAgdGhpcy50YXNrc0NvbGxlY3Rpb24uYWRkKHt0aXRsZTogbmV3VGFza1RpdGxlfSk7XG4gICAgfSxcbiAgICBsb2dPdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZmlyZWJhc2UuYXV0aCgpLnNpZ25PdXQoKVxuICAgIH0sXG4gICAgaW5pdFVzZXJMaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbWFpbCA9IGZpcmViYXNlLmF1dGgoKS5jdXJyZW50VXNlci5lbWFpbDtcbiAgICAgICAgdmFyIHVzZXJOaWNrbmFtZSA9IGVtYWlsLnN1YnN0cmluZygwLCBlbWFpbC5pbmRleE9mKCdAJykpO1xuXG4gICAgICAgICQoJy51c2VyX19uYW1lJykudGV4dChlbWFpbCk7XG4gICAgICAgIHZhciBUYXNrc0NvbGxlY3Rpb24gPSBCYWNrYm9uZS5GaXJlYmFzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgICAgICAgICBtb2RlbDogVGFza01vZGVsLFxuICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9tYXJpb25ldHRlLXRvZG8tYXBwLmZpcmViYXNlaW8uY29tL1VzZXJzLycrIHVzZXJOaWNrbmFtZSArJydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50YXNrc0NvbGxlY3Rpb24gPSBuZXcgVGFza3NDb2xsZWN0aW9uKCk7XG4gICAgICAgIHRoaXMudGFza0NvbGxlY3Rpb25WaWV3ID0gbmV3IFRhc2tDb2xsZWN0aW9uVmlldyh7XG4gICAgICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLnRhc2tzQ29sbGVjdGlvblxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNob3dDaGlsZFZpZXcoJ2xpc3QnLCB0aGlzLnRhc2tDb2xsZWN0aW9uVmlldyk7XG4gICAgfSxcbiAgICBvbkxvYWRUZW1wbGF0ZSAoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICAgICAgdGhpcy5pbml0VXNlckxpc3QoKTtcbiAgICB9XG59KSIsImltcG9ydCBoYnMgZnJvbSAnLi8uLi9iZWhhdmlvcnMvaGJzJztcblxuY29uc3QgY29uZmlnID0ge1xuICAgIGFwaUtleTogXCJBSXphU3lCRjJoRUJNYkdLZVFNM2prbkZzdEFOMFc2ZUI3TzN5Mk1cIixcbiAgICBhdXRoRG9tYWluOiBcIm1hcmlvbmV0dGUtdG9kby1hcHAuZmlyZWJhc2VhcHAuY29tXCIsXG4gICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9tYXJpb25ldHRlLXRvZG8tYXBwLmZpcmViYXNlaW8uY29tXCIsXG4gICAgcHJvamVjdElkOiBcIm1hcmlvbmV0dGUtdG9kby1hcHBcIixcbiAgICBzdG9yYWdlQnVja2V0OiBcIm1hcmlvbmV0dGUtdG9kby1hcHAuYXBwc3BvdC5jb21cIixcbiAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCIyNjkwMzA2Mjc3NzZcIlxufTtcbmZpcmViYXNlLmluaXRpYWxpemVBcHAoY29uZmlnKTtcblxuY29uc3QgUEFHRVMgPSB7XG4gICAgYXRob3JpemF0aW9uOiByZXF1aXJlKCcuL2F0aG9yaXphdGlvbicpLFxuICAgIHVzZXI6IHJlcXVpcmUoJy4vY3VycmVudC51c2VyJylcbn07XG5cbmV4cG9ydCBkZWZhdWx0ICBNYXJpb25ldHRlLlZpZXcuZXh0ZW5kKHtcbiAgICB0ZW1wbGF0ZTogZGF0YSA9PiAnbWFpbiB2aWV3JyxcbiAgICBiZWhhdmlvcnM6IFtoYnNdLFxuICAgIEhCVGVtcGxhdGU6ICd0ZW1wbGF0ZXMvbGF5b3V0LmhicycsXG4gICAgY2xhc3NOYW1lOiAnbWFpbi1hcHAnLFxuICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgYXBwOiB7XG4gICAgICAgICAgICBlbDogJy50b2RvX19jb250ZW50JyxcbiAgICAgICAgICAgIHJlcGxhY2VFbGVtZW50OiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjaGVja0F1dGg6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBmaXJlYmFzZS5hdXRoKCkub25BdXRoU3RhdGVDaGFuZ2VkKGZ1bmN0aW9uIChmaXJlYmFzZVVzZXIpIHtcbiAgICAgICAgICAgIGlmIChmaXJlYmFzZVVzZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVXNlciBsb2dnZWQgSW4nKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93Q2hpbGRWaWV3KCdhcHAnLCBuZXcgUEFHRVMudXNlcilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vdCBsb2dnZWQgSW4nKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93Q2hpbGRWaWV3KCdhcHAnLCBuZXcgUEFHRVMuYXRob3JpemF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBvbkxvYWRUZW1wbGF0ZSAoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIHRoaXMuY2hlY2tBdXRoKCk7XG4gICAgfVxufSk7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBIGRhdGEgc3RydWN0dXJlIHdoaWNoIGlzIGEgY29tYmluYXRpb24gb2YgYW4gYXJyYXkgYW5kIGEgc2V0LiBBZGRpbmcgYSBuZXdcbiAqIG1lbWJlciBpcyBPKDEpLCB0ZXN0aW5nIGZvciBtZW1iZXJzaGlwIGlzIE8oMSksIGFuZCBmaW5kaW5nIHRoZSBpbmRleCBvZiBhblxuICogZWxlbWVudCBpcyBPKDEpLiBSZW1vdmluZyBlbGVtZW50cyBmcm9tIHRoZSBzZXQgaXMgbm90IHN1cHBvcnRlZC4gT25seVxuICogc3RyaW5ncyBhcmUgc3VwcG9ydGVkIGZvciBtZW1iZXJzaGlwLlxuICovXG5mdW5jdGlvbiBBcnJheVNldCgpIHtcbiAgdGhpcy5fYXJyYXkgPSBbXTtcbiAgdGhpcy5fc2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cblxuLyoqXG4gKiBTdGF0aWMgbWV0aG9kIGZvciBjcmVhdGluZyBBcnJheVNldCBpbnN0YW5jZXMgZnJvbSBhbiBleGlzdGluZyBhcnJheS5cbiAqL1xuQXJyYXlTZXQuZnJvbUFycmF5ID0gZnVuY3Rpb24gQXJyYXlTZXRfZnJvbUFycmF5KGFBcnJheSwgYUFsbG93RHVwbGljYXRlcykge1xuICB2YXIgc2V0ID0gbmV3IEFycmF5U2V0KCk7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhQXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBzZXQuYWRkKGFBcnJheVtpXSwgYUFsbG93RHVwbGljYXRlcyk7XG4gIH1cbiAgcmV0dXJuIHNldDtcbn07XG5cbi8qKlxuICogUmV0dXJuIGhvdyBtYW55IHVuaXF1ZSBpdGVtcyBhcmUgaW4gdGhpcyBBcnJheVNldC4gSWYgZHVwbGljYXRlcyBoYXZlIGJlZW5cbiAqIGFkZGVkLCB0aGFuIHRob3NlIGRvIG5vdCBjb3VudCB0b3dhcmRzIHRoZSBzaXplLlxuICpcbiAqIEByZXR1cm5zIE51bWJlclxuICovXG5BcnJheVNldC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uIEFycmF5U2V0X3NpemUoKSB7XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLl9zZXQpLmxlbmd0aDtcbn07XG5cbi8qKlxuICogQWRkIHRoZSBnaXZlbiBzdHJpbmcgdG8gdGhpcyBzZXQuXG4gKlxuICogQHBhcmFtIFN0cmluZyBhU3RyXG4gKi9cbkFycmF5U2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBBcnJheVNldF9hZGQoYVN0ciwgYUFsbG93RHVwbGljYXRlcykge1xuICB2YXIgc1N0ciA9IHV0aWwudG9TZXRTdHJpbmcoYVN0cik7XG4gIHZhciBpc0R1cGxpY2F0ZSA9IGhhcy5jYWxsKHRoaXMuX3NldCwgc1N0cik7XG4gIHZhciBpZHggPSB0aGlzLl9hcnJheS5sZW5ndGg7XG4gIGlmICghaXNEdXBsaWNhdGUgfHwgYUFsbG93RHVwbGljYXRlcykge1xuICAgIHRoaXMuX2FycmF5LnB1c2goYVN0cik7XG4gIH1cbiAgaWYgKCFpc0R1cGxpY2F0ZSkge1xuICAgIHRoaXMuX3NldFtzU3RyXSA9IGlkeDtcbiAgfVxufTtcblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gc3RyaW5nIGEgbWVtYmVyIG9mIHRoaXMgc2V0P1xuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5BcnJheVNldC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gQXJyYXlTZXRfaGFzKGFTdHIpIHtcbiAgdmFyIHNTdHIgPSB1dGlsLnRvU2V0U3RyaW5nKGFTdHIpO1xuICByZXR1cm4gaGFzLmNhbGwodGhpcy5fc2V0LCBzU3RyKTtcbn07XG5cbi8qKlxuICogV2hhdCBpcyB0aGUgaW5kZXggb2YgdGhlIGdpdmVuIHN0cmluZyBpbiB0aGUgYXJyYXk/XG4gKlxuICogQHBhcmFtIFN0cmluZyBhU3RyXG4gKi9cbkFycmF5U2V0LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gQXJyYXlTZXRfaW5kZXhPZihhU3RyKSB7XG4gIHZhciBzU3RyID0gdXRpbC50b1NldFN0cmluZyhhU3RyKTtcbiAgaWYgKGhhcy5jYWxsKHRoaXMuX3NldCwgc1N0cikpIHtcbiAgICByZXR1cm4gdGhpcy5fc2V0W3NTdHJdO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignXCInICsgYVN0ciArICdcIiBpcyBub3QgaW4gdGhlIHNldC4nKTtcbn07XG5cbi8qKlxuICogV2hhdCBpcyB0aGUgZWxlbWVudCBhdCB0aGUgZ2l2ZW4gaW5kZXg/XG4gKlxuICogQHBhcmFtIE51bWJlciBhSWR4XG4gKi9cbkFycmF5U2V0LnByb3RvdHlwZS5hdCA9IGZ1bmN0aW9uIEFycmF5U2V0X2F0KGFJZHgpIHtcbiAgaWYgKGFJZHggPj0gMCAmJiBhSWR4IDwgdGhpcy5fYXJyYXkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FycmF5W2FJZHhdO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignTm8gZWxlbWVudCBpbmRleGVkIGJ5ICcgKyBhSWR4KTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYXJyYXkgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBzZXQgKHdoaWNoIGhhcyB0aGUgcHJvcGVyIGluZGljZXNcbiAqIGluZGljYXRlZCBieSBpbmRleE9mKS4gTm90ZSB0aGF0IHRoaXMgaXMgYSBjb3B5IG9mIHRoZSBpbnRlcm5hbCBhcnJheSB1c2VkXG4gKiBmb3Igc3RvcmluZyB0aGUgbWVtYmVycyBzbyB0aGF0IG5vIG9uZSBjYW4gbWVzcyB3aXRoIGludGVybmFsIHN0YXRlLlxuICovXG5BcnJheVNldC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIEFycmF5U2V0X3RvQXJyYXkoKSB7XG4gIHJldHVybiB0aGlzLl9hcnJheS5zbGljZSgpO1xufTtcblxuZXhwb3J0cy5BcnJheVNldCA9IEFycmF5U2V0O1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqXG4gKiBCYXNlZCBvbiB0aGUgQmFzZSA2NCBWTFEgaW1wbGVtZW50YXRpb24gaW4gQ2xvc3VyZSBDb21waWxlcjpcbiAqIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2xvc3VyZS1jb21waWxlci9zb3VyY2UvYnJvd3NlL3RydW5rL3NyYy9jb20vZ29vZ2xlL2RlYnVnZ2luZy9zb3VyY2VtYXAvQmFzZTY0VkxRLmphdmFcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSBUaGUgQ2xvc3VyZSBDb21waWxlciBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlXG4gKiBtZXQ6XG4gKlxuICogICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAqICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmVcbiAqICAgIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nXG4gKiAgICBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWRcbiAqICAgIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqICAqIE5laXRoZXIgdGhlIG5hbWUgb2YgR29vZ2xlIEluYy4gbm9yIHRoZSBuYW1lcyBvZiBpdHNcbiAqICAgIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZFxuICogICAgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcbiAqIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUlxuICogQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFRcbiAqIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLFxuICogU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVFxuICogTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsXG4gKiBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTllcbiAqIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAqIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRVxuICogT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnLi9iYXNlNjQnKTtcblxuLy8gQSBzaW5nbGUgYmFzZSA2NCBkaWdpdCBjYW4gY29udGFpbiA2IGJpdHMgb2YgZGF0YS4gRm9yIHRoZSBiYXNlIDY0IHZhcmlhYmxlXG4vLyBsZW5ndGggcXVhbnRpdGllcyB3ZSB1c2UgaW4gdGhlIHNvdXJjZSBtYXAgc3BlYywgdGhlIGZpcnN0IGJpdCBpcyB0aGUgc2lnbixcbi8vIHRoZSBuZXh0IGZvdXIgYml0cyBhcmUgdGhlIGFjdHVhbCB2YWx1ZSwgYW5kIHRoZSA2dGggYml0IGlzIHRoZVxuLy8gY29udGludWF0aW9uIGJpdC4gVGhlIGNvbnRpbnVhdGlvbiBiaXQgdGVsbHMgdXMgd2hldGhlciB0aGVyZSBhcmUgbW9yZVxuLy8gZGlnaXRzIGluIHRoaXMgdmFsdWUgZm9sbG93aW5nIHRoaXMgZGlnaXQuXG4vL1xuLy8gICBDb250aW51YXRpb25cbi8vICAgfCAgICBTaWduXG4vLyAgIHwgICAgfFxuLy8gICBWICAgIFZcbi8vICAgMTAxMDExXG5cbnZhciBWTFFfQkFTRV9TSElGVCA9IDU7XG5cbi8vIGJpbmFyeTogMTAwMDAwXG52YXIgVkxRX0JBU0UgPSAxIDw8IFZMUV9CQVNFX1NISUZUO1xuXG4vLyBiaW5hcnk6IDAxMTExMVxudmFyIFZMUV9CQVNFX01BU0sgPSBWTFFfQkFTRSAtIDE7XG5cbi8vIGJpbmFyeTogMTAwMDAwXG52YXIgVkxRX0NPTlRJTlVBVElPTl9CSVQgPSBWTFFfQkFTRTtcblxuLyoqXG4gKiBDb252ZXJ0cyBmcm9tIGEgdHdvLWNvbXBsZW1lbnQgdmFsdWUgdG8gYSB2YWx1ZSB3aGVyZSB0aGUgc2lnbiBiaXQgaXNcbiAqIHBsYWNlZCBpbiB0aGUgbGVhc3Qgc2lnbmlmaWNhbnQgYml0LiAgRm9yIGV4YW1wbGUsIGFzIGRlY2ltYWxzOlxuICogICAxIGJlY29tZXMgMiAoMTAgYmluYXJ5KSwgLTEgYmVjb21lcyAzICgxMSBiaW5hcnkpXG4gKiAgIDIgYmVjb21lcyA0ICgxMDAgYmluYXJ5KSwgLTIgYmVjb21lcyA1ICgxMDEgYmluYXJ5KVxuICovXG5mdW5jdGlvbiB0b1ZMUVNpZ25lZChhVmFsdWUpIHtcbiAgcmV0dXJuIGFWYWx1ZSA8IDBcbiAgICA/ICgoLWFWYWx1ZSkgPDwgMSkgKyAxXG4gICAgOiAoYVZhbHVlIDw8IDEpICsgMDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyB0byBhIHR3by1jb21wbGVtZW50IHZhbHVlIGZyb20gYSB2YWx1ZSB3aGVyZSB0aGUgc2lnbiBiaXQgaXNcbiAqIHBsYWNlZCBpbiB0aGUgbGVhc3Qgc2lnbmlmaWNhbnQgYml0LiAgRm9yIGV4YW1wbGUsIGFzIGRlY2ltYWxzOlxuICogICAyICgxMCBiaW5hcnkpIGJlY29tZXMgMSwgMyAoMTEgYmluYXJ5KSBiZWNvbWVzIC0xXG4gKiAgIDQgKDEwMCBiaW5hcnkpIGJlY29tZXMgMiwgNSAoMTAxIGJpbmFyeSkgYmVjb21lcyAtMlxuICovXG5mdW5jdGlvbiBmcm9tVkxRU2lnbmVkKGFWYWx1ZSkge1xuICB2YXIgaXNOZWdhdGl2ZSA9IChhVmFsdWUgJiAxKSA9PT0gMTtcbiAgdmFyIHNoaWZ0ZWQgPSBhVmFsdWUgPj4gMTtcbiAgcmV0dXJuIGlzTmVnYXRpdmVcbiAgICA/IC1zaGlmdGVkXG4gICAgOiBzaGlmdGVkO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGJhc2UgNjQgVkxRIGVuY29kZWQgdmFsdWUuXG4gKi9cbmV4cG9ydHMuZW5jb2RlID0gZnVuY3Rpb24gYmFzZTY0VkxRX2VuY29kZShhVmFsdWUpIHtcbiAgdmFyIGVuY29kZWQgPSBcIlwiO1xuICB2YXIgZGlnaXQ7XG5cbiAgdmFyIHZscSA9IHRvVkxRU2lnbmVkKGFWYWx1ZSk7XG5cbiAgZG8ge1xuICAgIGRpZ2l0ID0gdmxxICYgVkxRX0JBU0VfTUFTSztcbiAgICB2bHEgPj4+PSBWTFFfQkFTRV9TSElGVDtcbiAgICBpZiAodmxxID4gMCkge1xuICAgICAgLy8gVGhlcmUgYXJlIHN0aWxsIG1vcmUgZGlnaXRzIGluIHRoaXMgdmFsdWUsIHNvIHdlIG11c3QgbWFrZSBzdXJlIHRoZVxuICAgICAgLy8gY29udGludWF0aW9uIGJpdCBpcyBtYXJrZWQuXG4gICAgICBkaWdpdCB8PSBWTFFfQ09OVElOVUFUSU9OX0JJVDtcbiAgICB9XG4gICAgZW5jb2RlZCArPSBiYXNlNjQuZW5jb2RlKGRpZ2l0KTtcbiAgfSB3aGlsZSAodmxxID4gMCk7XG5cbiAgcmV0dXJuIGVuY29kZWQ7XG59O1xuXG4vKipcbiAqIERlY29kZXMgdGhlIG5leHQgYmFzZSA2NCBWTFEgdmFsdWUgZnJvbSB0aGUgZ2l2ZW4gc3RyaW5nIGFuZCByZXR1cm5zIHRoZVxuICogdmFsdWUgYW5kIHRoZSByZXN0IG9mIHRoZSBzdHJpbmcgdmlhIHRoZSBvdXQgcGFyYW1ldGVyLlxuICovXG5leHBvcnRzLmRlY29kZSA9IGZ1bmN0aW9uIGJhc2U2NFZMUV9kZWNvZGUoYVN0ciwgYUluZGV4LCBhT3V0UGFyYW0pIHtcbiAgdmFyIHN0ckxlbiA9IGFTdHIubGVuZ3RoO1xuICB2YXIgcmVzdWx0ID0gMDtcbiAgdmFyIHNoaWZ0ID0gMDtcbiAgdmFyIGNvbnRpbnVhdGlvbiwgZGlnaXQ7XG5cbiAgZG8ge1xuICAgIGlmIChhSW5kZXggPj0gc3RyTGVuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBtb3JlIGRpZ2l0cyBpbiBiYXNlIDY0IFZMUSB2YWx1ZS5cIik7XG4gICAgfVxuXG4gICAgZGlnaXQgPSBiYXNlNjQuZGVjb2RlKGFTdHIuY2hhckNvZGVBdChhSW5kZXgrKykpO1xuICAgIGlmIChkaWdpdCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYmFzZTY0IGRpZ2l0OiBcIiArIGFTdHIuY2hhckF0KGFJbmRleCAtIDEpKTtcbiAgICB9XG5cbiAgICBjb250aW51YXRpb24gPSAhIShkaWdpdCAmIFZMUV9DT05USU5VQVRJT05fQklUKTtcbiAgICBkaWdpdCAmPSBWTFFfQkFTRV9NQVNLO1xuICAgIHJlc3VsdCA9IHJlc3VsdCArIChkaWdpdCA8PCBzaGlmdCk7XG4gICAgc2hpZnQgKz0gVkxRX0JBU0VfU0hJRlQ7XG4gIH0gd2hpbGUgKGNvbnRpbnVhdGlvbik7XG5cbiAgYU91dFBhcmFtLnZhbHVlID0gZnJvbVZMUVNpZ25lZChyZXN1bHQpO1xuICBhT3V0UGFyYW0ucmVzdCA9IGFJbmRleDtcbn07XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciBpbnRUb0NoYXJNYXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLycuc3BsaXQoJycpO1xuXG4vKipcbiAqIEVuY29kZSBhbiBpbnRlZ2VyIGluIHRoZSByYW5nZSBvZiAwIHRvIDYzIHRvIGEgc2luZ2xlIGJhc2UgNjQgZGlnaXQuXG4gKi9cbmV4cG9ydHMuZW5jb2RlID0gZnVuY3Rpb24gKG51bWJlcikge1xuICBpZiAoMCA8PSBudW1iZXIgJiYgbnVtYmVyIDwgaW50VG9DaGFyTWFwLmxlbmd0aCkge1xuICAgIHJldHVybiBpbnRUb0NoYXJNYXBbbnVtYmVyXTtcbiAgfVxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiTXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDYzOiBcIiArIG51bWJlcik7XG59O1xuXG4vKipcbiAqIERlY29kZSBhIHNpbmdsZSBiYXNlIDY0IGNoYXJhY3RlciBjb2RlIGRpZ2l0IHRvIGFuIGludGVnZXIuIFJldHVybnMgLTEgb25cbiAqIGZhaWx1cmUuXG4gKi9cbmV4cG9ydHMuZGVjb2RlID0gZnVuY3Rpb24gKGNoYXJDb2RlKSB7XG4gIHZhciBiaWdBID0gNjU7ICAgICAvLyAnQSdcbiAgdmFyIGJpZ1ogPSA5MDsgICAgIC8vICdaJ1xuXG4gIHZhciBsaXR0bGVBID0gOTc7ICAvLyAnYSdcbiAgdmFyIGxpdHRsZVogPSAxMjI7IC8vICd6J1xuXG4gIHZhciB6ZXJvID0gNDg7ICAgICAvLyAnMCdcbiAgdmFyIG5pbmUgPSA1NzsgICAgIC8vICc5J1xuXG4gIHZhciBwbHVzID0gNDM7ICAgICAvLyAnKydcbiAgdmFyIHNsYXNoID0gNDc7ICAgIC8vICcvJ1xuXG4gIHZhciBsaXR0bGVPZmZzZXQgPSAyNjtcbiAgdmFyIG51bWJlck9mZnNldCA9IDUyO1xuXG4gIC8vIDAgLSAyNTogQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcbiAgaWYgKGJpZ0EgPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPD0gYmlnWikge1xuICAgIHJldHVybiAoY2hhckNvZGUgLSBiaWdBKTtcbiAgfVxuXG4gIC8vIDI2IC0gNTE6IGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XG4gIGlmIChsaXR0bGVBIDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDw9IGxpdHRsZVopIHtcbiAgICByZXR1cm4gKGNoYXJDb2RlIC0gbGl0dGxlQSArIGxpdHRsZU9mZnNldCk7XG4gIH1cblxuICAvLyA1MiAtIDYxOiAwMTIzNDU2Nzg5XG4gIGlmICh6ZXJvIDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDw9IG5pbmUpIHtcbiAgICByZXR1cm4gKGNoYXJDb2RlIC0gemVybyArIG51bWJlck9mZnNldCk7XG4gIH1cblxuICAvLyA2MjogK1xuICBpZiAoY2hhckNvZGUgPT0gcGx1cykge1xuICAgIHJldHVybiA2MjtcbiAgfVxuXG4gIC8vIDYzOiAvXG4gIGlmIChjaGFyQ29kZSA9PSBzbGFzaCkge1xuICAgIHJldHVybiA2MztcbiAgfVxuXG4gIC8vIEludmFsaWQgYmFzZTY0IGRpZ2l0LlxuICByZXR1cm4gLTE7XG59O1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG5leHBvcnRzLkdSRUFURVNUX0xPV0VSX0JPVU5EID0gMTtcbmV4cG9ydHMuTEVBU1RfVVBQRVJfQk9VTkQgPSAyO1xuXG4vKipcbiAqIFJlY3Vyc2l2ZSBpbXBsZW1lbnRhdGlvbiBvZiBiaW5hcnkgc2VhcmNoLlxuICpcbiAqIEBwYXJhbSBhTG93IEluZGljZXMgaGVyZSBhbmQgbG93ZXIgZG8gbm90IGNvbnRhaW4gdGhlIG5lZWRsZS5cbiAqIEBwYXJhbSBhSGlnaCBJbmRpY2VzIGhlcmUgYW5kIGhpZ2hlciBkbyBub3QgY29udGFpbiB0aGUgbmVlZGxlLlxuICogQHBhcmFtIGFOZWVkbGUgVGhlIGVsZW1lbnQgYmVpbmcgc2VhcmNoZWQgZm9yLlxuICogQHBhcmFtIGFIYXlzdGFjayBUaGUgbm9uLWVtcHR5IGFycmF5IGJlaW5nIHNlYXJjaGVkLlxuICogQHBhcmFtIGFDb21wYXJlIEZ1bmN0aW9uIHdoaWNoIHRha2VzIHR3byBlbGVtZW50cyBhbmQgcmV0dXJucyAtMSwgMCwgb3IgMS5cbiAqIEBwYXJhbSBhQmlhcyBFaXRoZXIgJ2JpbmFyeVNlYXJjaC5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnYmluYXJ5U2VhcmNoLkxFQVNUX1VQUEVSX0JPVU5EJy4gU3BlY2lmaWVzIHdoZXRoZXIgdG8gcmV0dXJuIHRoZVxuICogICAgIGNsb3Nlc3QgZWxlbWVudCB0aGF0IGlzIHNtYWxsZXIgdGhhbiBvciBncmVhdGVyIHRoYW4gdGhlIG9uZSB3ZSBhcmVcbiAqICAgICBzZWFyY2hpbmcgZm9yLCByZXNwZWN0aXZlbHksIGlmIHRoZSBleGFjdCBlbGVtZW50IGNhbm5vdCBiZSBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gcmVjdXJzaXZlU2VhcmNoKGFMb3csIGFIaWdoLCBhTmVlZGxlLCBhSGF5c3RhY2ssIGFDb21wYXJlLCBhQmlhcykge1xuICAvLyBUaGlzIGZ1bmN0aW9uIHRlcm1pbmF0ZXMgd2hlbiBvbmUgb2YgdGhlIGZvbGxvd2luZyBpcyB0cnVlOlxuICAvL1xuICAvLyAgIDEuIFdlIGZpbmQgdGhlIGV4YWN0IGVsZW1lbnQgd2UgYXJlIGxvb2tpbmcgZm9yLlxuICAvL1xuICAvLyAgIDIuIFdlIGRpZCBub3QgZmluZCB0aGUgZXhhY3QgZWxlbWVudCwgYnV0IHdlIGNhbiByZXR1cm4gdGhlIGluZGV4IG9mXG4gIC8vICAgICAgdGhlIG5leHQtY2xvc2VzdCBlbGVtZW50LlxuICAvL1xuICAvLyAgIDMuIFdlIGRpZCBub3QgZmluZCB0aGUgZXhhY3QgZWxlbWVudCwgYW5kIHRoZXJlIGlzIG5vIG5leHQtY2xvc2VzdFxuICAvLyAgICAgIGVsZW1lbnQgdGhhbiB0aGUgb25lIHdlIGFyZSBzZWFyY2hpbmcgZm9yLCBzbyB3ZSByZXR1cm4gLTEuXG4gIHZhciBtaWQgPSBNYXRoLmZsb29yKChhSGlnaCAtIGFMb3cpIC8gMikgKyBhTG93O1xuICB2YXIgY21wID0gYUNvbXBhcmUoYU5lZWRsZSwgYUhheXN0YWNrW21pZF0sIHRydWUpO1xuICBpZiAoY21wID09PSAwKSB7XG4gICAgLy8gRm91bmQgdGhlIGVsZW1lbnQgd2UgYXJlIGxvb2tpbmcgZm9yLlxuICAgIHJldHVybiBtaWQ7XG4gIH1cbiAgZWxzZSBpZiAoY21wID4gMCkge1xuICAgIC8vIE91ciBuZWVkbGUgaXMgZ3JlYXRlciB0aGFuIGFIYXlzdGFja1ttaWRdLlxuICAgIGlmIChhSGlnaCAtIG1pZCA+IDEpIHtcbiAgICAgIC8vIFRoZSBlbGVtZW50IGlzIGluIHRoZSB1cHBlciBoYWxmLlxuICAgICAgcmV0dXJuIHJlY3Vyc2l2ZVNlYXJjaChtaWQsIGFIaWdoLCBhTmVlZGxlLCBhSGF5c3RhY2ssIGFDb21wYXJlLCBhQmlhcyk7XG4gICAgfVxuXG4gICAgLy8gVGhlIGV4YWN0IG5lZWRsZSBlbGVtZW50IHdhcyBub3QgZm91bmQgaW4gdGhpcyBoYXlzdGFjay4gRGV0ZXJtaW5lIGlmXG4gICAgLy8gd2UgYXJlIGluIHRlcm1pbmF0aW9uIGNhc2UgKDMpIG9yICgyKSBhbmQgcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSB0aGluZy5cbiAgICBpZiAoYUJpYXMgPT0gZXhwb3J0cy5MRUFTVF9VUFBFUl9CT1VORCkge1xuICAgICAgcmV0dXJuIGFIaWdoIDwgYUhheXN0YWNrLmxlbmd0aCA/IGFIaWdoIDogLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtaWQ7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIC8vIE91ciBuZWVkbGUgaXMgbGVzcyB0aGFuIGFIYXlzdGFja1ttaWRdLlxuICAgIGlmIChtaWQgLSBhTG93ID4gMSkge1xuICAgICAgLy8gVGhlIGVsZW1lbnQgaXMgaW4gdGhlIGxvd2VyIGhhbGYuXG4gICAgICByZXR1cm4gcmVjdXJzaXZlU2VhcmNoKGFMb3csIG1pZCwgYU5lZWRsZSwgYUhheXN0YWNrLCBhQ29tcGFyZSwgYUJpYXMpO1xuICAgIH1cblxuICAgIC8vIHdlIGFyZSBpbiB0ZXJtaW5hdGlvbiBjYXNlICgzKSBvciAoMikgYW5kIHJldHVybiB0aGUgYXBwcm9wcmlhdGUgdGhpbmcuXG4gICAgaWYgKGFCaWFzID09IGV4cG9ydHMuTEVBU1RfVVBQRVJfQk9VTkQpIHtcbiAgICAgIHJldHVybiBtaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhTG93IDwgMCA/IC0xIDogYUxvdztcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIGJpbmFyeSBzZWFyY2ggd2hpY2ggd2lsbCBhbHdheXMgdHJ5IGFuZCByZXR1cm5cbiAqIHRoZSBpbmRleCBvZiB0aGUgY2xvc2VzdCBlbGVtZW50IGlmIHRoZXJlIGlzIG5vIGV4YWN0IGhpdC4gVGhpcyBpcyBiZWNhdXNlXG4gKiBtYXBwaW5ncyBiZXR3ZWVuIG9yaWdpbmFsIGFuZCBnZW5lcmF0ZWQgbGluZS9jb2wgcGFpcnMgYXJlIHNpbmdsZSBwb2ludHMsXG4gKiBhbmQgdGhlcmUgaXMgYW4gaW1wbGljaXQgcmVnaW9uIGJldHdlZW4gZWFjaCBvZiB0aGVtLCBzbyBhIG1pc3MganVzdCBtZWFuc1xuICogdGhhdCB5b3UgYXJlbid0IG9uIHRoZSB2ZXJ5IHN0YXJ0IG9mIGEgcmVnaW9uLlxuICpcbiAqIEBwYXJhbSBhTmVlZGxlIFRoZSBlbGVtZW50IHlvdSBhcmUgbG9va2luZyBmb3IuXG4gKiBAcGFyYW0gYUhheXN0YWNrIFRoZSBhcnJheSB0aGF0IGlzIGJlaW5nIHNlYXJjaGVkLlxuICogQHBhcmFtIGFDb21wYXJlIEEgZnVuY3Rpb24gd2hpY2ggdGFrZXMgdGhlIG5lZWRsZSBhbmQgYW4gZWxlbWVudCBpbiB0aGVcbiAqICAgICBhcnJheSBhbmQgcmV0dXJucyAtMSwgMCwgb3IgMSBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgbmVlZGxlIGlzIGxlc3NcbiAqICAgICB0aGFuLCBlcXVhbCB0bywgb3IgZ3JlYXRlciB0aGFuIHRoZSBlbGVtZW50LCByZXNwZWN0aXZlbHkuXG4gKiBAcGFyYW0gYUJpYXMgRWl0aGVyICdiaW5hcnlTZWFyY2guR1JFQVRFU1RfTE9XRVJfQk9VTkQnIG9yXG4gKiAgICAgJ2JpbmFyeVNlYXJjaC5MRUFTVF9VUFBFUl9CT1VORCcuIFNwZWNpZmllcyB3aGV0aGVyIHRvIHJldHVybiB0aGVcbiAqICAgICBjbG9zZXN0IGVsZW1lbnQgdGhhdCBpcyBzbWFsbGVyIHRoYW4gb3IgZ3JlYXRlciB0aGFuIHRoZSBvbmUgd2UgYXJlXG4gKiAgICAgc2VhcmNoaW5nIGZvciwgcmVzcGVjdGl2ZWx5LCBpZiB0aGUgZXhhY3QgZWxlbWVudCBjYW5ub3QgYmUgZm91bmQuXG4gKiAgICAgRGVmYXVsdHMgdG8gJ2JpbmFyeVNlYXJjaC5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKi9cbmV4cG9ydHMuc2VhcmNoID0gZnVuY3Rpb24gc2VhcmNoKGFOZWVkbGUsIGFIYXlzdGFjaywgYUNvbXBhcmUsIGFCaWFzKSB7XG4gIGlmIChhSGF5c3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgdmFyIGluZGV4ID0gcmVjdXJzaXZlU2VhcmNoKC0xLCBhSGF5c3RhY2subGVuZ3RoLCBhTmVlZGxlLCBhSGF5c3RhY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhQ29tcGFyZSwgYUJpYXMgfHwgZXhwb3J0cy5HUkVBVEVTVF9MT1dFUl9CT1VORCk7XG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvLyBXZSBoYXZlIGZvdW5kIGVpdGhlciB0aGUgZXhhY3QgZWxlbWVudCwgb3IgdGhlIG5leHQtY2xvc2VzdCBlbGVtZW50IHRoYW5cbiAgLy8gdGhlIG9uZSB3ZSBhcmUgc2VhcmNoaW5nIGZvci4gSG93ZXZlciwgdGhlcmUgbWF5IGJlIG1vcmUgdGhhbiBvbmUgc3VjaFxuICAvLyBlbGVtZW50LiBNYWtlIHN1cmUgd2UgYWx3YXlzIHJldHVybiB0aGUgc21hbGxlc3Qgb2YgdGhlc2UuXG4gIHdoaWxlIChpbmRleCAtIDEgPj0gMCkge1xuICAgIGlmIChhQ29tcGFyZShhSGF5c3RhY2tbaW5kZXhdLCBhSGF5c3RhY2tbaW5kZXggLSAxXSwgdHJ1ZSkgIT09IDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAtLWluZGV4O1xuICB9XG5cbiAgcmV0dXJuIGluZGV4O1xufTtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxNCBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciBtYXBwaW5nQiBpcyBhZnRlciBtYXBwaW5nQSB3aXRoIHJlc3BlY3QgdG8gZ2VuZXJhdGVkXG4gKiBwb3NpdGlvbi5cbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVkUG9zaXRpb25BZnRlcihtYXBwaW5nQSwgbWFwcGluZ0IpIHtcbiAgLy8gT3B0aW1pemVkIGZvciBtb3N0IGNvbW1vbiBjYXNlXG4gIHZhciBsaW5lQSA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmU7XG4gIHZhciBsaW5lQiA9IG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIHZhciBjb2x1bW5BID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uO1xuICB2YXIgY29sdW1uQiA9IG1hcHBpbmdCLmdlbmVyYXRlZENvbHVtbjtcbiAgcmV0dXJuIGxpbmVCID4gbGluZUEgfHwgbGluZUIgPT0gbGluZUEgJiYgY29sdW1uQiA+PSBjb2x1bW5BIHx8XG4gICAgICAgICB1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkKG1hcHBpbmdBLCBtYXBwaW5nQikgPD0gMDtcbn1cblxuLyoqXG4gKiBBIGRhdGEgc3RydWN0dXJlIHRvIHByb3ZpZGUgYSBzb3J0ZWQgdmlldyBvZiBhY2N1bXVsYXRlZCBtYXBwaW5ncyBpbiBhXG4gKiBwZXJmb3JtYW5jZSBjb25zY2lvdXMgbWFubmVyLiBJdCB0cmFkZXMgYSBuZWdsaWJhYmxlIG92ZXJoZWFkIGluIGdlbmVyYWxcbiAqIGNhc2UgZm9yIGEgbGFyZ2Ugc3BlZWR1cCBpbiBjYXNlIG9mIG1hcHBpbmdzIGJlaW5nIGFkZGVkIGluIG9yZGVyLlxuICovXG5mdW5jdGlvbiBNYXBwaW5nTGlzdCgpIHtcbiAgdGhpcy5fYXJyYXkgPSBbXTtcbiAgdGhpcy5fc29ydGVkID0gdHJ1ZTtcbiAgLy8gU2VydmVzIGFzIGluZmltdW1cbiAgdGhpcy5fbGFzdCA9IHtnZW5lcmF0ZWRMaW5lOiAtMSwgZ2VuZXJhdGVkQ29sdW1uOiAwfTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlIHRocm91Z2ggaW50ZXJuYWwgaXRlbXMuIFRoaXMgbWV0aG9kIHRha2VzIHRoZSBzYW1lIGFyZ3VtZW50cyB0aGF0XG4gKiBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIHRha2VzLlxuICpcbiAqIE5PVEU6IFRoZSBvcmRlciBvZiB0aGUgbWFwcGluZ3MgaXMgTk9UIGd1YXJhbnRlZWQuXG4gKi9cbk1hcHBpbmdMaXN0LnByb3RvdHlwZS51bnNvcnRlZEZvckVhY2ggPVxuICBmdW5jdGlvbiBNYXBwaW5nTGlzdF9mb3JFYWNoKGFDYWxsYmFjaywgYVRoaXNBcmcpIHtcbiAgICB0aGlzLl9hcnJheS5mb3JFYWNoKGFDYWxsYmFjaywgYVRoaXNBcmcpO1xuICB9O1xuXG4vKipcbiAqIEFkZCB0aGUgZ2l2ZW4gc291cmNlIG1hcHBpbmcuXG4gKlxuICogQHBhcmFtIE9iamVjdCBhTWFwcGluZ1xuICovXG5NYXBwaW5nTGlzdC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gTWFwcGluZ0xpc3RfYWRkKGFNYXBwaW5nKSB7XG4gIGlmIChnZW5lcmF0ZWRQb3NpdGlvbkFmdGVyKHRoaXMuX2xhc3QsIGFNYXBwaW5nKSkge1xuICAgIHRoaXMuX2xhc3QgPSBhTWFwcGluZztcbiAgICB0aGlzLl9hcnJheS5wdXNoKGFNYXBwaW5nKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9zb3J0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9hcnJheS5wdXNoKGFNYXBwaW5nKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmbGF0LCBzb3J0ZWQgYXJyYXkgb2YgbWFwcGluZ3MuIFRoZSBtYXBwaW5ncyBhcmUgc29ydGVkIGJ5XG4gKiBnZW5lcmF0ZWQgcG9zaXRpb24uXG4gKlxuICogV0FSTklORzogVGhpcyBtZXRob2QgcmV0dXJucyBpbnRlcm5hbCBkYXRhIHdpdGhvdXQgY29weWluZywgZm9yXG4gKiBwZXJmb3JtYW5jZS4gVGhlIHJldHVybiB2YWx1ZSBtdXN0IE5PVCBiZSBtdXRhdGVkLCBhbmQgc2hvdWxkIGJlIHRyZWF0ZWQgYXNcbiAqIGFuIGltbXV0YWJsZSBib3Jyb3cuIElmIHlvdSB3YW50IHRvIHRha2Ugb3duZXJzaGlwLCB5b3UgbXVzdCBtYWtlIHlvdXIgb3duXG4gKiBjb3B5LlxuICovXG5NYXBwaW5nTGlzdC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIE1hcHBpbmdMaXN0X3RvQXJyYXkoKSB7XG4gIGlmICghdGhpcy5fc29ydGVkKSB7XG4gICAgdGhpcy5fYXJyYXkuc29ydCh1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkKTtcbiAgICB0aGlzLl9zb3J0ZWQgPSB0cnVlO1xuICB9XG4gIHJldHVybiB0aGlzLl9hcnJheTtcbn07XG5cbmV4cG9ydHMuTWFwcGluZ0xpc3QgPSBNYXBwaW5nTGlzdDtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxuLy8gSXQgdHVybnMgb3V0IHRoYXQgc29tZSAobW9zdD8pIEphdmFTY3JpcHQgZW5naW5lcyBkb24ndCBzZWxmLWhvc3Rcbi8vIGBBcnJheS5wcm90b3R5cGUuc29ydGAuIFRoaXMgbWFrZXMgc2Vuc2UgYmVjYXVzZSBDKysgd2lsbCBsaWtlbHkgcmVtYWluXG4vLyBmYXN0ZXIgdGhhbiBKUyB3aGVuIGRvaW5nIHJhdyBDUFUtaW50ZW5zaXZlIHNvcnRpbmcuIEhvd2V2ZXIsIHdoZW4gdXNpbmcgYVxuLy8gY3VzdG9tIGNvbXBhcmF0b3IgZnVuY3Rpb24sIGNhbGxpbmcgYmFjayBhbmQgZm9ydGggYmV0d2VlbiB0aGUgVk0ncyBDKysgYW5kXG4vLyBKSVQnZCBKUyBpcyByYXRoZXIgc2xvdyAqYW5kKiBsb3NlcyBKSVQgdHlwZSBpbmZvcm1hdGlvbiwgcmVzdWx0aW5nIGluXG4vLyB3b3JzZSBnZW5lcmF0ZWQgY29kZSBmb3IgdGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24gdGhhbiB3b3VsZCBiZSBvcHRpbWFsLiBJblxuLy8gZmFjdCwgd2hlbiBzb3J0aW5nIHdpdGggYSBjb21wYXJhdG9yLCB0aGVzZSBjb3N0cyBvdXR3ZWlnaCB0aGUgYmVuZWZpdHMgb2Zcbi8vIHNvcnRpbmcgaW4gQysrLiBCeSB1c2luZyBvdXIgb3duIEpTLWltcGxlbWVudGVkIFF1aWNrIFNvcnQgKGJlbG93KSwgd2UgZ2V0XG4vLyBhIH4zNTAwbXMgbWVhbiBzcGVlZC11cCBpbiBgYmVuY2gvYmVuY2guaHRtbGAuXG5cbi8qKlxuICogU3dhcCB0aGUgZWxlbWVudHMgaW5kZXhlZCBieSBgeGAgYW5kIGB5YCBpbiB0aGUgYXJyYXkgYGFyeWAuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJ5XG4gKiAgICAgICAgVGhlIGFycmF5LlxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqICAgICAgICBUaGUgaW5kZXggb2YgdGhlIGZpcnN0IGl0ZW0uXG4gKiBAcGFyYW0ge051bWJlcn0geVxuICogICAgICAgIFRoZSBpbmRleCBvZiB0aGUgc2Vjb25kIGl0ZW0uXG4gKi9cbmZ1bmN0aW9uIHN3YXAoYXJ5LCB4LCB5KSB7XG4gIHZhciB0ZW1wID0gYXJ5W3hdO1xuICBhcnlbeF0gPSBhcnlbeV07XG4gIGFyeVt5XSA9IHRlbXA7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIHdpdGhpbiB0aGUgcmFuZ2UgYGxvdyAuLiBoaWdoYCBpbmNsdXNpdmUuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGxvd1xuICogICAgICAgIFRoZSBsb3dlciBib3VuZCBvbiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge051bWJlcn0gaGlnaFxuICogICAgICAgIFRoZSB1cHBlciBib3VuZCBvbiB0aGUgcmFuZ2UuXG4gKi9cbmZ1bmN0aW9uIHJhbmRvbUludEluUmFuZ2UobG93LCBoaWdoKSB7XG4gIHJldHVybiBNYXRoLnJvdW5kKGxvdyArIChNYXRoLnJhbmRvbSgpICogKGhpZ2ggLSBsb3cpKSk7XG59XG5cbi8qKlxuICogVGhlIFF1aWNrIFNvcnQgYWxnb3JpdGhtLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyeVxuICogICAgICAgIEFuIGFycmF5IHRvIHNvcnQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJhdG9yXG4gKiAgICAgICAgRnVuY3Rpb24gdG8gdXNlIHRvIGNvbXBhcmUgdHdvIGl0ZW1zLlxuICogQHBhcmFtIHtOdW1iZXJ9IHBcbiAqICAgICAgICBTdGFydCBpbmRleCBvZiB0aGUgYXJyYXlcbiAqIEBwYXJhbSB7TnVtYmVyfSByXG4gKiAgICAgICAgRW5kIGluZGV4IG9mIHRoZSBhcnJheVxuICovXG5mdW5jdGlvbiBkb1F1aWNrU29ydChhcnksIGNvbXBhcmF0b3IsIHAsIHIpIHtcbiAgLy8gSWYgb3VyIGxvd2VyIGJvdW5kIGlzIGxlc3MgdGhhbiBvdXIgdXBwZXIgYm91bmQsIHdlICgxKSBwYXJ0aXRpb24gdGhlXG4gIC8vIGFycmF5IGludG8gdHdvIHBpZWNlcyBhbmQgKDIpIHJlY3Vyc2Ugb24gZWFjaCBoYWxmLiBJZiBpdCBpcyBub3QsIHRoaXMgaXNcbiAgLy8gdGhlIGVtcHR5IGFycmF5IGFuZCBvdXIgYmFzZSBjYXNlLlxuXG4gIGlmIChwIDwgcikge1xuICAgIC8vICgxKSBQYXJ0aXRpb25pbmcuXG4gICAgLy9cbiAgICAvLyBUaGUgcGFydGl0aW9uaW5nIGNob29zZXMgYSBwaXZvdCBiZXR3ZWVuIGBwYCBhbmQgYHJgIGFuZCBtb3ZlcyBhbGxcbiAgICAvLyBlbGVtZW50cyB0aGF0IGFyZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHBpdm90IHRvIHRoZSBiZWZvcmUgaXQsIGFuZFxuICAgIC8vIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBhcmUgZ3JlYXRlciB0aGFuIGl0IGFmdGVyIGl0LiBUaGUgZWZmZWN0IGlzIHRoYXRcbiAgICAvLyBvbmNlIHBhcnRpdGlvbiBpcyBkb25lLCB0aGUgcGl2b3QgaXMgaW4gdGhlIGV4YWN0IHBsYWNlIGl0IHdpbGwgYmUgd2hlblxuICAgIC8vIHRoZSBhcnJheSBpcyBwdXQgaW4gc29ydGVkIG9yZGVyLCBhbmQgaXQgd2lsbCBub3QgbmVlZCB0byBiZSBtb3ZlZFxuICAgIC8vIGFnYWluLiBUaGlzIHJ1bnMgaW4gTyhuKSB0aW1lLlxuXG4gICAgLy8gQWx3YXlzIGNob29zZSBhIHJhbmRvbSBwaXZvdCBzbyB0aGF0IGFuIGlucHV0IGFycmF5IHdoaWNoIGlzIHJldmVyc2VcbiAgICAvLyBzb3J0ZWQgZG9lcyBub3QgY2F1c2UgTyhuXjIpIHJ1bm5pbmcgdGltZS5cbiAgICB2YXIgcGl2b3RJbmRleCA9IHJhbmRvbUludEluUmFuZ2UocCwgcik7XG4gICAgdmFyIGkgPSBwIC0gMTtcblxuICAgIHN3YXAoYXJ5LCBwaXZvdEluZGV4LCByKTtcbiAgICB2YXIgcGl2b3QgPSBhcnlbcl07XG5cbiAgICAvLyBJbW1lZGlhdGVseSBhZnRlciBgamAgaXMgaW5jcmVtZW50ZWQgaW4gdGhpcyBsb29wLCB0aGUgZm9sbG93aW5nIGhvbGRcbiAgICAvLyB0cnVlOlxuICAgIC8vXG4gICAgLy8gICAqIEV2ZXJ5IGVsZW1lbnQgaW4gYGFyeVtwIC4uIGldYCBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHBpdm90LlxuICAgIC8vXG4gICAgLy8gICAqIEV2ZXJ5IGVsZW1lbnQgaW4gYGFyeVtpKzEgLi4gai0xXWAgaXMgZ3JlYXRlciB0aGFuIHRoZSBwaXZvdC5cbiAgICBmb3IgKHZhciBqID0gcDsgaiA8IHI7IGorKykge1xuICAgICAgaWYgKGNvbXBhcmF0b3IoYXJ5W2pdLCBwaXZvdCkgPD0gMCkge1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIHN3YXAoYXJ5LCBpLCBqKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2FwKGFyeSwgaSArIDEsIGopO1xuICAgIHZhciBxID0gaSArIDE7XG5cbiAgICAvLyAoMikgUmVjdXJzZSBvbiBlYWNoIGhhbGYuXG5cbiAgICBkb1F1aWNrU29ydChhcnksIGNvbXBhcmF0b3IsIHAsIHEgLSAxKTtcbiAgICBkb1F1aWNrU29ydChhcnksIGNvbXBhcmF0b3IsIHEgKyAxLCByKTtcbiAgfVxufVxuXG4vKipcbiAqIFNvcnQgdGhlIGdpdmVuIGFycmF5IGluLXBsYWNlIHdpdGggdGhlIGdpdmVuIGNvbXBhcmF0b3IgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJ5XG4gKiAgICAgICAgQW4gYXJyYXkgdG8gc29ydC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbXBhcmF0b3JcbiAqICAgICAgICBGdW5jdGlvbiB0byB1c2UgdG8gY29tcGFyZSB0d28gaXRlbXMuXG4gKi9cbmV4cG9ydHMucXVpY2tTb3J0ID0gZnVuY3Rpb24gKGFyeSwgY29tcGFyYXRvcikge1xuICBkb1F1aWNrU29ydChhcnksIGNvbXBhcmF0b3IsIDAsIGFyeS5sZW5ndGggLSAxKTtcbn07XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgYmluYXJ5U2VhcmNoID0gcmVxdWlyZSgnLi9iaW5hcnktc2VhcmNoJyk7XG52YXIgQXJyYXlTZXQgPSByZXF1aXJlKCcuL2FycmF5LXNldCcpLkFycmF5U2V0O1xudmFyIGJhc2U2NFZMUSA9IHJlcXVpcmUoJy4vYmFzZTY0LXZscScpO1xudmFyIHF1aWNrU29ydCA9IHJlcXVpcmUoJy4vcXVpY2stc29ydCcpLnF1aWNrU29ydDtcblxuZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IEpTT04ucGFyc2UoYVNvdXJjZU1hcC5yZXBsYWNlKC9eXFwpXFxdXFx9Jy8sICcnKSk7XG4gIH1cblxuICByZXR1cm4gc291cmNlTWFwLnNlY3Rpb25zICE9IG51bGxcbiAgICA/IG5ldyBJbmRleGVkU291cmNlTWFwQ29uc3VtZXIoc291cmNlTWFwKVxuICAgIDogbmV3IEJhc2ljU291cmNlTWFwQ29uc3VtZXIoc291cmNlTWFwKTtcbn1cblxuU291cmNlTWFwQ29uc3VtZXIuZnJvbVNvdXJjZU1hcCA9IGZ1bmN0aW9uKGFTb3VyY2VNYXApIHtcbiAgcmV0dXJuIEJhc2ljU291cmNlTWFwQ29uc3VtZXIuZnJvbVNvdXJjZU1hcChhU291cmNlTWFwKTtcbn1cblxuLyoqXG4gKiBUaGUgdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcHBpbmcgc3BlYyB0aGF0IHdlIGFyZSBjb25zdW1pbmcuXG4gKi9cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8vIGBfX2dlbmVyYXRlZE1hcHBpbmdzYCBhbmQgYF9fb3JpZ2luYWxNYXBwaW5nc2AgYXJlIGFycmF5cyB0aGF0IGhvbGQgdGhlXG4vLyBwYXJzZWQgbWFwcGluZyBjb29yZGluYXRlcyBmcm9tIHRoZSBzb3VyY2UgbWFwJ3MgXCJtYXBwaW5nc1wiIGF0dHJpYnV0ZS4gVGhleVxuLy8gYXJlIGxhemlseSBpbnN0YW50aWF0ZWQsIGFjY2Vzc2VkIHZpYSB0aGUgYF9nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4vLyBgX29yaWdpbmFsTWFwcGluZ3NgIGdldHRlcnMgcmVzcGVjdGl2ZWx5LCBhbmQgd2Ugb25seSBwYXJzZSB0aGUgbWFwcGluZ3Ncbi8vIGFuZCBjcmVhdGUgdGhlc2UgYXJyYXlzIG9uY2UgcXVlcmllZCBmb3IgYSBzb3VyY2UgbG9jYXRpb24uIFdlIGp1bXAgdGhyb3VnaFxuLy8gdGhlc2UgaG9vcHMgYmVjYXVzZSB0aGVyZSBjYW4gYmUgbWFueSB0aG91c2FuZHMgb2YgbWFwcGluZ3MsIGFuZCBwYXJzaW5nXG4vLyB0aGVtIGlzIGV4cGVuc2l2ZSwgc28gd2Ugb25seSB3YW50IHRvIGRvIGl0IGlmIHdlIG11c3QuXG4vL1xuLy8gRWFjaCBvYmplY3QgaW4gdGhlIGFycmF5cyBpcyBvZiB0aGUgZm9ybTpcbi8vXG4vLyAgICAge1xuLy8gICAgICAgZ2VuZXJhdGVkTGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgY29kZSxcbi8vICAgICAgIGdlbmVyYXRlZENvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBjb2RlLFxuLy8gICAgICAgc291cmNlOiBUaGUgcGF0aCB0byB0aGUgb3JpZ2luYWwgc291cmNlIGZpbGUgdGhhdCBnZW5lcmF0ZWQgdGhpc1xuLy8gICAgICAgICAgICAgICBjaHVuayBvZiBjb2RlLFxuLy8gICAgICAgb3JpZ2luYWxMaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSB0aGF0XG4vLyAgICAgICAgICAgICAgICAgICAgIGNvcnJlc3BvbmRzIHRvIHRoaXMgY2h1bmsgb2YgZ2VuZXJhdGVkIGNvZGUsXG4vLyAgICAgICBvcmlnaW5hbENvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSB0aGF0XG4vLyAgICAgICAgICAgICAgICAgICAgICAgY29ycmVzcG9uZHMgdG8gdGhpcyBjaHVuayBvZiBnZW5lcmF0ZWQgY29kZSxcbi8vICAgICAgIG5hbWU6IFRoZSBuYW1lIG9mIHRoZSBvcmlnaW5hbCBzeW1ib2wgd2hpY2ggZ2VuZXJhdGVkIHRoaXMgY2h1bmsgb2Zcbi8vICAgICAgICAgICAgIGNvZGUuXG4vLyAgICAgfVxuLy9cbi8vIEFsbCBwcm9wZXJ0aWVzIGV4Y2VwdCBmb3IgYGdlbmVyYXRlZExpbmVgIGFuZCBgZ2VuZXJhdGVkQ29sdW1uYCBjYW4gYmVcbi8vIGBudWxsYC5cbi8vXG4vLyBgX2dlbmVyYXRlZE1hcHBpbmdzYCBpcyBvcmRlcmVkIGJ5IHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zLlxuLy9cbi8vIGBfb3JpZ2luYWxNYXBwaW5nc2AgaXMgb3JkZXJlZCBieSB0aGUgb3JpZ2luYWwgcG9zaXRpb25zLlxuXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IG51bGw7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLCAnX2dlbmVyYXRlZE1hcHBpbmdzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncykge1xuICAgICAgdGhpcy5fcGFyc2VNYXBwaW5ncyh0aGlzLl9tYXBwaW5ncywgdGhpcy5zb3VyY2VSb290KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzO1xuICB9XG59KTtcblxuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9fb3JpZ2luYWxNYXBwaW5ncyA9IG51bGw7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLCAnX29yaWdpbmFsTWFwcGluZ3MnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fX29yaWdpbmFsTWFwcGluZ3MpIHtcbiAgICAgIHRoaXMuX3BhcnNlTWFwcGluZ3ModGhpcy5fbWFwcGluZ3MsIHRoaXMuc291cmNlUm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzO1xuICB9XG59KTtcblxuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9jaGFySXNNYXBwaW5nU2VwYXJhdG9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfY2hhcklzTWFwcGluZ1NlcGFyYXRvcihhU3RyLCBpbmRleCkge1xuICAgIHZhciBjID0gYVN0ci5jaGFyQXQoaW5kZXgpO1xuICAgIHJldHVybiBjID09PSBcIjtcIiB8fCBjID09PSBcIixcIjtcbiAgfTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgbWFwcGluZ3MgaW4gYSBzdHJpbmcgaW4gdG8gYSBkYXRhIHN0cnVjdHVyZSB3aGljaCB3ZSBjYW4gZWFzaWx5XG4gKiBxdWVyeSAodGhlIG9yZGVyZWQgYXJyYXlzIGluIHRoZSBgdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzYCBhbmRcbiAqIGB0aGlzLl9fb3JpZ2luYWxNYXBwaW5nc2AgcHJvcGVydGllcykuXG4gKi9cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fcGFyc2VNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3BhcnNlTWFwcGluZ3MoYVN0ciwgYVNvdXJjZVJvb3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdWJjbGFzc2VzIG11c3QgaW1wbGVtZW50IF9wYXJzZU1hcHBpbmdzXCIpO1xuICB9O1xuXG5Tb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVIgPSAxO1xuU291cmNlTWFwQ29uc3VtZXIuT1JJR0lOQUxfT1JERVIgPSAyO1xuXG5Tb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCA9IDE7XG5Tb3VyY2VNYXBDb25zdW1lci5MRUFTVF9VUFBFUl9CT1VORCA9IDI7XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGVhY2ggbWFwcGluZyBiZXR3ZWVuIGFuIG9yaWdpbmFsIHNvdXJjZS9saW5lL2NvbHVtbiBhbmQgYVxuICogZ2VuZXJhdGVkIGxpbmUvY29sdW1uIGluIHRoaXMgc291cmNlIG1hcC5cbiAqXG4gKiBAcGFyYW0gRnVuY3Rpb24gYUNhbGxiYWNrXG4gKiAgICAgICAgVGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdpdGggZWFjaCBtYXBwaW5nLlxuICogQHBhcmFtIE9iamVjdCBhQ29udGV4dFxuICogICAgICAgIE9wdGlvbmFsLiBJZiBzcGVjaWZpZWQsIHRoaXMgb2JqZWN0IHdpbGwgYmUgdGhlIHZhbHVlIG9mIGB0aGlzYCBldmVyeVxuICogICAgICAgIHRpbWUgdGhhdCBgYUNhbGxiYWNrYCBpcyBjYWxsZWQuXG4gKiBAcGFyYW0gYU9yZGVyXG4gKiAgICAgICAgRWl0aGVyIGBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVJgIG9yXG4gKiAgICAgICAgYFNvdXJjZU1hcENvbnN1bWVyLk9SSUdJTkFMX09SREVSYC4gU3BlY2lmaWVzIHdoZXRoZXIgeW91IHdhbnQgdG9cbiAqICAgICAgICBpdGVyYXRlIG92ZXIgdGhlIG1hcHBpbmdzIHNvcnRlZCBieSB0aGUgZ2VuZXJhdGVkIGZpbGUncyBsaW5lL2NvbHVtblxuICogICAgICAgIG9yZGVyIG9yIHRoZSBvcmlnaW5hbCdzIHNvdXJjZS9saW5lL2NvbHVtbiBvcmRlciwgcmVzcGVjdGl2ZWx5LiBEZWZhdWx0cyB0b1xuICogICAgICAgIGBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVJgLlxuICovXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuZWFjaE1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9lYWNoTWFwcGluZyhhQ2FsbGJhY2ssIGFDb250ZXh0LCBhT3JkZXIpIHtcbiAgICB2YXIgY29udGV4dCA9IGFDb250ZXh0IHx8IG51bGw7XG4gICAgdmFyIG9yZGVyID0gYU9yZGVyIHx8IFNvdXJjZU1hcENvbnN1bWVyLkdFTkVSQVRFRF9PUkRFUjtcblxuICAgIHZhciBtYXBwaW5ncztcbiAgICBzd2l0Y2ggKG9yZGVyKSB7XG4gICAgY2FzZSBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVI6XG4gICAgICBtYXBwaW5ncyA9IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTb3VyY2VNYXBDb25zdW1lci5PUklHSU5BTF9PUkRFUjpcbiAgICAgIG1hcHBpbmdzID0gdGhpcy5fb3JpZ2luYWxNYXBwaW5ncztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG9yZGVyIG9mIGl0ZXJhdGlvbi5cIik7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZVJvb3QgPSB0aGlzLnNvdXJjZVJvb3Q7XG4gICAgbWFwcGluZ3MubWFwKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgICB2YXIgc291cmNlID0gbWFwcGluZy5zb3VyY2UgPT09IG51bGwgPyBudWxsIDogdGhpcy5fc291cmNlcy5hdChtYXBwaW5nLnNvdXJjZSk7XG4gICAgICBpZiAoc291cmNlICE9IG51bGwgJiYgc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgIHNvdXJjZSA9IHV0aWwuam9pbihzb3VyY2VSb290LCBzb3VyY2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgIGdlbmVyYXRlZExpbmU6IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSxcbiAgICAgICAgZ2VuZXJhdGVkQ29sdW1uOiBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbixcbiAgICAgICAgb3JpZ2luYWxMaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgb3JpZ2luYWxDb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW4sXG4gICAgICAgIG5hbWU6IG1hcHBpbmcubmFtZSA9PT0gbnVsbCA/IG51bGwgOiB0aGlzLl9uYW1lcy5hdChtYXBwaW5nLm5hbWUpXG4gICAgICB9O1xuICAgIH0sIHRoaXMpLmZvckVhY2goYUNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBnZW5lcmF0ZWQgbGluZSBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgb3JpZ2luYWwgc291cmNlLFxuICogbGluZSwgYW5kIGNvbHVtbiBwcm92aWRlZC4gSWYgbm8gY29sdW1uIGlzIHByb3ZpZGVkLCByZXR1cm5zIGFsbCBtYXBwaW5nc1xuICogY29ycmVzcG9uZGluZyB0byBhIGVpdGhlciB0aGUgbGluZSB3ZSBhcmUgc2VhcmNoaW5nIGZvciBvciB0aGUgbmV4dFxuICogY2xvc2VzdCBsaW5lIHRoYXQgaGFzIGFueSBtYXBwaW5ncy4gT3RoZXJ3aXNlLCByZXR1cm5zIGFsbCBtYXBwaW5nc1xuICogY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gbGluZSBhbmQgZWl0aGVyIHRoZSBjb2x1bW4gd2UgYXJlIHNlYXJjaGluZyBmb3JcbiAqIG9yIHRoZSBuZXh0IGNsb3Nlc3QgY29sdW1uIHRoYXQgaGFzIGFueSBvZmZzZXRzLlxuICpcbiAqIFRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgZmlsZW5hbWUgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBjb2x1bW46IE9wdGlvbmFsLiB0aGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLlxuICpcbiAqIGFuZCBhbiBhcnJheSBvZiBvYmplY3RzIGlzIHJldHVybmVkLCBlYWNoIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC5cbiAqL1xuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmFsbEdlbmVyYXRlZFBvc2l0aW9uc0ZvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2FsbEdlbmVyYXRlZFBvc2l0aW9uc0ZvcihhQXJncykge1xuICAgIHZhciBsaW5lID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdsaW5lJyk7XG5cbiAgICAvLyBXaGVuIHRoZXJlIGlzIG5vIGV4YWN0IG1hdGNoLCBCYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fZmluZE1hcHBpbmdcbiAgICAvLyByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgY2xvc2VzdCBtYXBwaW5nIGxlc3MgdGhhbiB0aGUgbmVlZGxlLiBCeVxuICAgIC8vIHNldHRpbmcgbmVlZGxlLm9yaWdpbmFsQ29sdW1uIHRvIDAsIHdlIHRodXMgZmluZCB0aGUgbGFzdCBtYXBwaW5nIGZvclxuICAgIC8vIHRoZSBnaXZlbiBsaW5lLCBwcm92aWRlZCBzdWNoIGEgbWFwcGluZyBleGlzdHMuXG4gICAgdmFyIG5lZWRsZSA9IHtcbiAgICAgIHNvdXJjZTogdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2UnKSxcbiAgICAgIG9yaWdpbmFsTGluZTogbGluZSxcbiAgICAgIG9yaWdpbmFsQ29sdW1uOiB1dGlsLmdldEFyZyhhQXJncywgJ2NvbHVtbicsIDApXG4gICAgfTtcblxuICAgIGlmICh0aGlzLnNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgbmVlZGxlLnNvdXJjZSA9IHV0aWwucmVsYXRpdmUodGhpcy5zb3VyY2VSb290LCBuZWVkbGUuc291cmNlKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9zb3VyY2VzLmhhcyhuZWVkbGUuc291cmNlKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBuZWVkbGUuc291cmNlID0gdGhpcy5fc291cmNlcy5pbmRleE9mKG5lZWRsZS5zb3VyY2UpO1xuXG4gICAgdmFyIG1hcHBpbmdzID0gW107XG5cbiAgICB2YXIgaW5kZXggPSB0aGlzLl9maW5kTWFwcGluZyhuZWVkbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxNYXBwaW5ncyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9yaWdpbmFsTGluZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib3JpZ2luYWxDb2x1bW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmFyeVNlYXJjaC5MRUFTVF9VUFBFUl9CT1VORCk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5fb3JpZ2luYWxNYXBwaW5nc1tpbmRleF07XG5cbiAgICAgIGlmIChhQXJncy5jb2x1bW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgb3JpZ2luYWxMaW5lID0gbWFwcGluZy5vcmlnaW5hbExpbmU7XG5cbiAgICAgICAgLy8gSXRlcmF0ZSB1bnRpbCBlaXRoZXIgd2UgcnVuIG91dCBvZiBtYXBwaW5ncywgb3Igd2UgcnVuIGludG9cbiAgICAgICAgLy8gYSBtYXBwaW5nIGZvciBhIGRpZmZlcmVudCBsaW5lIHRoYW4gdGhlIG9uZSB3ZSBmb3VuZC4gU2luY2VcbiAgICAgICAgLy8gbWFwcGluZ3MgYXJlIHNvcnRlZCwgdGhpcyBpcyBndWFyYW50ZWVkIHRvIGZpbmQgYWxsIG1hcHBpbmdzIGZvclxuICAgICAgICAvLyB0aGUgbGluZSB3ZSBmb3VuZC5cbiAgICAgICAgd2hpbGUgKG1hcHBpbmcgJiYgbWFwcGluZy5vcmlnaW5hbExpbmUgPT09IG9yaWdpbmFsTGluZSkge1xuICAgICAgICAgIG1hcHBpbmdzLnB1c2goe1xuICAgICAgICAgICAgbGluZTogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZExpbmUnLCBudWxsKSxcbiAgICAgICAgICAgIGNvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZENvbHVtbicsIG51bGwpLFxuICAgICAgICAgICAgbGFzdENvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2xhc3RHZW5lcmF0ZWRDb2x1bW4nLCBudWxsKVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbWFwcGluZyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3NbKytpbmRleF07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBvcmlnaW5hbENvbHVtbiA9IG1hcHBpbmcub3JpZ2luYWxDb2x1bW47XG5cbiAgICAgICAgLy8gSXRlcmF0ZSB1bnRpbCBlaXRoZXIgd2UgcnVuIG91dCBvZiBtYXBwaW5ncywgb3Igd2UgcnVuIGludG9cbiAgICAgICAgLy8gYSBtYXBwaW5nIGZvciBhIGRpZmZlcmVudCBsaW5lIHRoYW4gdGhlIG9uZSB3ZSB3ZXJlIHNlYXJjaGluZyBmb3IuXG4gICAgICAgIC8vIFNpbmNlIG1hcHBpbmdzIGFyZSBzb3J0ZWQsIHRoaXMgaXMgZ3VhcmFudGVlZCB0byBmaW5kIGFsbCBtYXBwaW5ncyBmb3JcbiAgICAgICAgLy8gdGhlIGxpbmUgd2UgYXJlIHNlYXJjaGluZyBmb3IuXG4gICAgICAgIHdoaWxlIChtYXBwaW5nICYmXG4gICAgICAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsTGluZSA9PT0gbGluZSAmJlxuICAgICAgICAgICAgICAgbWFwcGluZy5vcmlnaW5hbENvbHVtbiA9PSBvcmlnaW5hbENvbHVtbikge1xuICAgICAgICAgIG1hcHBpbmdzLnB1c2goe1xuICAgICAgICAgICAgbGluZTogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZExpbmUnLCBudWxsKSxcbiAgICAgICAgICAgIGNvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZENvbHVtbicsIG51bGwpLFxuICAgICAgICAgICAgbGFzdENvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2xhc3RHZW5lcmF0ZWRDb2x1bW4nLCBudWxsKVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbWFwcGluZyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3NbKytpbmRleF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWFwcGluZ3M7XG4gIH07XG5cbmV4cG9ydHMuU291cmNlTWFwQ29uc3VtZXIgPSBTb3VyY2VNYXBDb25zdW1lcjtcblxuLyoqXG4gKiBBIEJhc2ljU291cmNlTWFwQ29uc3VtZXIgaW5zdGFuY2UgcmVwcmVzZW50cyBhIHBhcnNlZCBzb3VyY2UgbWFwIHdoaWNoIHdlIGNhblxuICogcXVlcnkgZm9yIGluZm9ybWF0aW9uIGFib3V0IHRoZSBvcmlnaW5hbCBmaWxlIHBvc2l0aW9ucyBieSBnaXZpbmcgaXQgYSBmaWxlXG4gKiBwb3NpdGlvbiBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS5cbiAqXG4gKiBUaGUgb25seSBwYXJhbWV0ZXIgaXMgdGhlIHJhdyBzb3VyY2UgbWFwIChlaXRoZXIgYXMgYSBKU09OIHN0cmluZywgb3JcbiAqIGFscmVhZHkgcGFyc2VkIHRvIGFuIG9iamVjdCkuIEFjY29yZGluZyB0byB0aGUgc3BlYywgc291cmNlIG1hcHMgaGF2ZSB0aGVcbiAqIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuICpcbiAqICAgLSB2ZXJzaW9uOiBXaGljaCB2ZXJzaW9uIG9mIHRoZSBzb3VyY2UgbWFwIHNwZWMgdGhpcyBtYXAgaXMgZm9sbG93aW5nLlxuICogICAtIHNvdXJjZXM6IEFuIGFycmF5IG9mIFVSTHMgdG8gdGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlcy5cbiAqICAgLSBuYW1lczogQW4gYXJyYXkgb2YgaWRlbnRpZmllcnMgd2hpY2ggY2FuIGJlIHJlZmVycmVuY2VkIGJ5IGluZGl2aWR1YWwgbWFwcGluZ3MuXG4gKiAgIC0gc291cmNlUm9vdDogT3B0aW9uYWwuIFRoZSBVUkwgcm9vdCBmcm9tIHdoaWNoIGFsbCBzb3VyY2VzIGFyZSByZWxhdGl2ZS5cbiAqICAgLSBzb3VyY2VzQ29udGVudDogT3B0aW9uYWwuIEFuIGFycmF5IG9mIGNvbnRlbnRzIG9mIHRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZXMuXG4gKiAgIC0gbWFwcGluZ3M6IEEgc3RyaW5nIG9mIGJhc2U2NCBWTFFzIHdoaWNoIGNvbnRhaW4gdGhlIGFjdHVhbCBtYXBwaW5ncy5cbiAqICAgLSBmaWxlOiBPcHRpb25hbC4gVGhlIGdlbmVyYXRlZCBmaWxlIHRoaXMgc291cmNlIG1hcCBpcyBhc3NvY2lhdGVkIHdpdGguXG4gKlxuICogSGVyZSBpcyBhbiBleGFtcGxlIHNvdXJjZSBtYXAsIHRha2VuIGZyb20gdGhlIHNvdXJjZSBtYXAgc3BlY1swXTpcbiAqXG4gKiAgICAge1xuICogICAgICAgdmVyc2lvbiA6IDMsXG4gKiAgICAgICBmaWxlOiBcIm91dC5qc1wiLFxuICogICAgICAgc291cmNlUm9vdCA6IFwiXCIsXG4gKiAgICAgICBzb3VyY2VzOiBbXCJmb28uanNcIiwgXCJiYXIuanNcIl0sXG4gKiAgICAgICBuYW1lczogW1wic3JjXCIsIFwibWFwc1wiLCBcImFyZVwiLCBcImZ1blwiXSxcbiAqICAgICAgIG1hcHBpbmdzOiBcIkFBLEFCOztBQkNERTtcIlxuICogICAgIH1cbiAqXG4gKiBbMF06IGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL2RvY3VtZW50L2QvMVUxUkdBZWhRd1J5cFVUb3ZGMUtSbHBpT0Z6ZTBiLV8yZ2M2ZkFIMEtZMGsvZWRpdD9wbGk9MSNcbiAqL1xuZnVuY3Rpb24gQmFzaWNTb3VyY2VNYXBDb25zdW1lcihhU291cmNlTWFwKSB7XG4gIHZhciBzb3VyY2VNYXAgPSBhU291cmNlTWFwO1xuICBpZiAodHlwZW9mIGFTb3VyY2VNYXAgPT09ICdzdHJpbmcnKSB7XG4gICAgc291cmNlTWFwID0gSlNPTi5wYXJzZShhU291cmNlTWFwLnJlcGxhY2UoL15cXClcXF1cXH0nLywgJycpKTtcbiAgfVxuXG4gIHZhciB2ZXJzaW9uID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAndmVyc2lvbicpO1xuICB2YXIgc291cmNlcyA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3NvdXJjZXMnKTtcbiAgLy8gU2FzcyAzLjMgbGVhdmVzIG91dCB0aGUgJ25hbWVzJyBhcnJheSwgc28gd2UgZGV2aWF0ZSBmcm9tIHRoZSBzcGVjICh3aGljaFxuICAvLyByZXF1aXJlcyB0aGUgYXJyYXkpIHRvIHBsYXkgbmljZSBoZXJlLlxuICB2YXIgbmFtZXMgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICduYW1lcycsIFtdKTtcbiAgdmFyIHNvdXJjZVJvb3QgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdzb3VyY2VSb290JywgbnVsbCk7XG4gIHZhciBzb3VyY2VzQ29udGVudCA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3NvdXJjZXNDb250ZW50JywgbnVsbCk7XG4gIHZhciBtYXBwaW5ncyA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ21hcHBpbmdzJyk7XG4gIHZhciBmaWxlID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnZmlsZScsIG51bGwpO1xuXG4gIC8vIE9uY2UgYWdhaW4sIFNhc3MgZGV2aWF0ZXMgZnJvbSB0aGUgc3BlYyBhbmQgc3VwcGxpZXMgdGhlIHZlcnNpb24gYXMgYVxuICAvLyBzdHJpbmcgcmF0aGVyIHRoYW4gYSBudW1iZXIsIHNvIHdlIHVzZSBsb29zZSBlcXVhbGl0eSBjaGVja2luZyBoZXJlLlxuICBpZiAodmVyc2lvbiAhPSB0aGlzLl92ZXJzaW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCB2ZXJzaW9uOiAnICsgdmVyc2lvbik7XG4gIH1cblxuICBzb3VyY2VzID0gc291cmNlc1xuICAgIC5tYXAoU3RyaW5nKVxuICAgIC8vIFNvbWUgc291cmNlIG1hcHMgcHJvZHVjZSByZWxhdGl2ZSBzb3VyY2UgcGF0aHMgbGlrZSBcIi4vZm9vLmpzXCIgaW5zdGVhZCBvZlxuICAgIC8vIFwiZm9vLmpzXCIuICBOb3JtYWxpemUgdGhlc2UgZmlyc3Qgc28gdGhhdCBmdXR1cmUgY29tcGFyaXNvbnMgd2lsbCBzdWNjZWVkLlxuICAgIC8vIFNlZSBidWd6aWwubGEvMTA5MDc2OC5cbiAgICAubWFwKHV0aWwubm9ybWFsaXplKVxuICAgIC8vIEFsd2F5cyBlbnN1cmUgdGhhdCBhYnNvbHV0ZSBzb3VyY2VzIGFyZSBpbnRlcm5hbGx5IHN0b3JlZCByZWxhdGl2ZSB0b1xuICAgIC8vIHRoZSBzb3VyY2Ugcm9vdCwgaWYgdGhlIHNvdXJjZSByb290IGlzIGFic29sdXRlLiBOb3QgZG9pbmcgdGhpcyB3b3VsZFxuICAgIC8vIGJlIHBhcnRpY3VsYXJseSBwcm9ibGVtYXRpYyB3aGVuIHRoZSBzb3VyY2Ugcm9vdCBpcyBhIHByZWZpeCBvZiB0aGVcbiAgICAvLyBzb3VyY2UgKHZhbGlkLCBidXQgd2h5Pz8pLiBTZWUgZ2l0aHViIGlzc3VlICMxOTkgYW5kIGJ1Z3ppbC5sYS8xMTg4OTgyLlxuICAgIC5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIHNvdXJjZVJvb3QgJiYgdXRpbC5pc0Fic29sdXRlKHNvdXJjZVJvb3QpICYmIHV0aWwuaXNBYnNvbHV0ZShzb3VyY2UpXG4gICAgICAgID8gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBzb3VyY2UpXG4gICAgICAgIDogc291cmNlO1xuICAgIH0pO1xuXG4gIC8vIFBhc3MgYHRydWVgIGJlbG93IHRvIGFsbG93IGR1cGxpY2F0ZSBuYW1lcyBhbmQgc291cmNlcy4gV2hpbGUgc291cmNlIG1hcHNcbiAgLy8gYXJlIGludGVuZGVkIHRvIGJlIGNvbXByZXNzZWQgYW5kIGRlZHVwbGljYXRlZCwgdGhlIFR5cGVTY3JpcHQgY29tcGlsZXJcbiAgLy8gc29tZXRpbWVzIGdlbmVyYXRlcyBzb3VyY2UgbWFwcyB3aXRoIGR1cGxpY2F0ZXMgaW4gdGhlbS4gU2VlIEdpdGh1YiBpc3N1ZVxuICAvLyAjNzIgYW5kIGJ1Z3ppbC5sYS84ODk0OTIuXG4gIHRoaXMuX25hbWVzID0gQXJyYXlTZXQuZnJvbUFycmF5KG5hbWVzLm1hcChTdHJpbmcpLCB0cnVlKTtcbiAgdGhpcy5fc291cmNlcyA9IEFycmF5U2V0LmZyb21BcnJheShzb3VyY2VzLCB0cnVlKTtcblxuICB0aGlzLnNvdXJjZVJvb3QgPSBzb3VyY2VSb290O1xuICB0aGlzLnNvdXJjZXNDb250ZW50ID0gc291cmNlc0NvbnRlbnQ7XG4gIHRoaXMuX21hcHBpbmdzID0gbWFwcGluZ3M7XG4gIHRoaXMuZmlsZSA9IGZpbGU7XG59XG5cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUpO1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuY29uc3VtZXIgPSBTb3VyY2VNYXBDb25zdW1lcjtcblxuLyoqXG4gKiBDcmVhdGUgYSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyIGZyb20gYSBTb3VyY2VNYXBHZW5lcmF0b3IuXG4gKlxuICogQHBhcmFtIFNvdXJjZU1hcEdlbmVyYXRvciBhU291cmNlTWFwXG4gKiAgICAgICAgVGhlIHNvdXJjZSBtYXAgdGhhdCB3aWxsIGJlIGNvbnN1bWVkLlxuICogQHJldHVybnMgQmFzaWNTb3VyY2VNYXBDb25zdW1lclxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLmZyb21Tb3VyY2VNYXAgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9mcm9tU291cmNlTWFwKGFTb3VyY2VNYXApIHtcbiAgICB2YXIgc21jID0gT2JqZWN0LmNyZWF0ZShCYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSk7XG5cbiAgICB2YXIgbmFtZXMgPSBzbWMuX25hbWVzID0gQXJyYXlTZXQuZnJvbUFycmF5KGFTb3VyY2VNYXAuX25hbWVzLnRvQXJyYXkoKSwgdHJ1ZSk7XG4gICAgdmFyIHNvdXJjZXMgPSBzbWMuX3NvdXJjZXMgPSBBcnJheVNldC5mcm9tQXJyYXkoYVNvdXJjZU1hcC5fc291cmNlcy50b0FycmF5KCksIHRydWUpO1xuICAgIHNtYy5zb3VyY2VSb290ID0gYVNvdXJjZU1hcC5fc291cmNlUm9vdDtcbiAgICBzbWMuc291cmNlc0NvbnRlbnQgPSBhU291cmNlTWFwLl9nZW5lcmF0ZVNvdXJjZXNDb250ZW50KHNtYy5fc291cmNlcy50b0FycmF5KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbWMuc291cmNlUm9vdCk7XG4gICAgc21jLmZpbGUgPSBhU291cmNlTWFwLl9maWxlO1xuXG4gICAgLy8gQmVjYXVzZSB3ZSBhcmUgbW9kaWZ5aW5nIHRoZSBlbnRyaWVzIChieSBjb252ZXJ0aW5nIHN0cmluZyBzb3VyY2VzIGFuZFxuICAgIC8vIG5hbWVzIHRvIGluZGljZXMgaW50byB0aGUgc291cmNlcyBhbmQgbmFtZXMgQXJyYXlTZXRzKSwgd2UgaGF2ZSB0byBtYWtlXG4gICAgLy8gYSBjb3B5IG9mIHRoZSBlbnRyeSBvciBlbHNlIGJhZCB0aGluZ3MgaGFwcGVuLiBTaGFyZWQgbXV0YWJsZSBzdGF0ZVxuICAgIC8vIHN0cmlrZXMgYWdhaW4hIFNlZSBnaXRodWIgaXNzdWUgIzE5MS5cblxuICAgIHZhciBnZW5lcmF0ZWRNYXBwaW5ncyA9IGFTb3VyY2VNYXAuX21hcHBpbmdzLnRvQXJyYXkoKS5zbGljZSgpO1xuICAgIHZhciBkZXN0R2VuZXJhdGVkTWFwcGluZ3MgPSBzbWMuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IFtdO1xuICAgIHZhciBkZXN0T3JpZ2luYWxNYXBwaW5ncyA9IHNtYy5fX29yaWdpbmFsTWFwcGluZ3MgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZW5lcmF0ZWRNYXBwaW5ncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNyY01hcHBpbmcgPSBnZW5lcmF0ZWRNYXBwaW5nc1tpXTtcbiAgICAgIHZhciBkZXN0TWFwcGluZyA9IG5ldyBNYXBwaW5nO1xuICAgICAgZGVzdE1hcHBpbmcuZ2VuZXJhdGVkTGluZSA9IHNyY01hcHBpbmcuZ2VuZXJhdGVkTGluZTtcbiAgICAgIGRlc3RNYXBwaW5nLmdlbmVyYXRlZENvbHVtbiA9IHNyY01hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uO1xuXG4gICAgICBpZiAoc3JjTWFwcGluZy5zb3VyY2UpIHtcbiAgICAgICAgZGVzdE1hcHBpbmcuc291cmNlID0gc291cmNlcy5pbmRleE9mKHNyY01hcHBpbmcuc291cmNlKTtcbiAgICAgICAgZGVzdE1hcHBpbmcub3JpZ2luYWxMaW5lID0gc3JjTWFwcGluZy5vcmlnaW5hbExpbmU7XG4gICAgICAgIGRlc3RNYXBwaW5nLm9yaWdpbmFsQ29sdW1uID0gc3JjTWFwcGluZy5vcmlnaW5hbENvbHVtbjtcblxuICAgICAgICBpZiAoc3JjTWFwcGluZy5uYW1lKSB7XG4gICAgICAgICAgZGVzdE1hcHBpbmcubmFtZSA9IG5hbWVzLmluZGV4T2Yoc3JjTWFwcGluZy5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlc3RPcmlnaW5hbE1hcHBpbmdzLnB1c2goZGVzdE1hcHBpbmcpO1xuICAgICAgfVxuXG4gICAgICBkZXN0R2VuZXJhdGVkTWFwcGluZ3MucHVzaChkZXN0TWFwcGluZyk7XG4gICAgfVxuXG4gICAgcXVpY2tTb3J0KHNtYy5fX29yaWdpbmFsTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMpO1xuXG4gICAgcmV0dXJuIHNtYztcbiAgfTtcblxuLyoqXG4gKiBUaGUgdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcHBpbmcgc3BlYyB0aGF0IHdlIGFyZSBjb25zdW1pbmcuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLyoqXG4gKiBUaGUgbGlzdCBvZiBvcmlnaW5hbCBzb3VyY2VzLlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUsICdzb3VyY2VzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fc291cmNlcy50b0FycmF5KCkubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VSb290ICE9IG51bGwgPyB1dGlsLmpvaW4odGhpcy5zb3VyY2VSb290LCBzKSA6IHM7XG4gICAgfSwgdGhpcyk7XG4gIH1cbn0pO1xuXG4vKipcbiAqIFByb3ZpZGUgdGhlIEpJVCB3aXRoIGEgbmljZSBzaGFwZSAvIGhpZGRlbiBjbGFzcy5cbiAqL1xuZnVuY3Rpb24gTWFwcGluZygpIHtcbiAgdGhpcy5nZW5lcmF0ZWRMaW5lID0gMDtcbiAgdGhpcy5nZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICB0aGlzLnNvdXJjZSA9IG51bGw7XG4gIHRoaXMub3JpZ2luYWxMaW5lID0gbnVsbDtcbiAgdGhpcy5vcmlnaW5hbENvbHVtbiA9IG51bGw7XG4gIHRoaXMubmFtZSA9IG51bGw7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIG1hcHBpbmdzIGluIGEgc3RyaW5nIGluIHRvIGEgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggd2UgY2FuIGVhc2lseVxuICogcXVlcnkgKHRoZSBvcmRlcmVkIGFycmF5cyBpbiB0aGUgYHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4gKiBgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3NgIHByb3BlcnRpZXMpLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fcGFyc2VNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3BhcnNlTWFwcGluZ3MoYVN0ciwgYVNvdXJjZVJvb3QpIHtcbiAgICB2YXIgZ2VuZXJhdGVkTGluZSA9IDE7XG4gICAgdmFyIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNPcmlnaW5hbExpbmUgPSAwO1xuICAgIHZhciBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNTb3VyY2UgPSAwO1xuICAgIHZhciBwcmV2aW91c05hbWUgPSAwO1xuICAgIHZhciBsZW5ndGggPSBhU3RyLmxlbmd0aDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjYWNoZWRTZWdtZW50cyA9IHt9O1xuICAgIHZhciB0ZW1wID0ge307XG4gICAgdmFyIG9yaWdpbmFsTWFwcGluZ3MgPSBbXTtcbiAgICB2YXIgZ2VuZXJhdGVkTWFwcGluZ3MgPSBbXTtcbiAgICB2YXIgbWFwcGluZywgc3RyLCBzZWdtZW50LCBlbmQsIHZhbHVlO1xuXG4gICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBpZiAoYVN0ci5jaGFyQXQoaW5kZXgpID09PSAnOycpIHtcbiAgICAgICAgZ2VuZXJhdGVkTGluZSsrO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChhU3RyLmNoYXJBdChpbmRleCkgPT09ICcsJykge1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG1hcHBpbmcgPSBuZXcgTWFwcGluZygpO1xuICAgICAgICBtYXBwaW5nLmdlbmVyYXRlZExpbmUgPSBnZW5lcmF0ZWRMaW5lO1xuXG4gICAgICAgIC8vIEJlY2F1c2UgZWFjaCBvZmZzZXQgaXMgZW5jb2RlZCByZWxhdGl2ZSB0byB0aGUgcHJldmlvdXMgb25lLFxuICAgICAgICAvLyBtYW55IHNlZ21lbnRzIG9mdGVuIGhhdmUgdGhlIHNhbWUgZW5jb2RpbmcuIFdlIGNhbiBleHBsb2l0IHRoaXNcbiAgICAgICAgLy8gZmFjdCBieSBjYWNoaW5nIHRoZSBwYXJzZWQgdmFyaWFibGUgbGVuZ3RoIGZpZWxkcyBvZiBlYWNoIHNlZ21lbnQsXG4gICAgICAgIC8vIGFsbG93aW5nIHVzIHRvIGF2b2lkIGEgc2Vjb25kIHBhcnNlIGlmIHdlIGVuY291bnRlciB0aGUgc2FtZVxuICAgICAgICAvLyBzZWdtZW50IGFnYWluLlxuICAgICAgICBmb3IgKGVuZCA9IGluZGV4OyBlbmQgPCBsZW5ndGg7IGVuZCsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2NoYXJJc01hcHBpbmdTZXBhcmF0b3IoYVN0ciwgZW5kKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0ciA9IGFTdHIuc2xpY2UoaW5kZXgsIGVuZCk7XG5cbiAgICAgICAgc2VnbWVudCA9IGNhY2hlZFNlZ21lbnRzW3N0cl07XG4gICAgICAgIGlmIChzZWdtZW50KSB7XG4gICAgICAgICAgaW5kZXggKz0gc3RyLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWdtZW50ID0gW107XG4gICAgICAgICAgd2hpbGUgKGluZGV4IDwgZW5kKSB7XG4gICAgICAgICAgICBiYXNlNjRWTFEuZGVjb2RlKGFTdHIsIGluZGV4LCB0ZW1wKTtcbiAgICAgICAgICAgIHZhbHVlID0gdGVtcC52YWx1ZTtcbiAgICAgICAgICAgIGluZGV4ID0gdGVtcC5yZXN0O1xuICAgICAgICAgICAgc2VnbWVudC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgYSBzb3VyY2UsIGJ1dCBubyBsaW5lIGFuZCBjb2x1bW4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgYSBzb3VyY2UgYW5kIGxpbmUsIGJ1dCBubyBjb2x1bW4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjYWNoZWRTZWdtZW50c1tzdHJdID0gc2VnbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdlbmVyYXRlZCBjb2x1bW4uXG4gICAgICAgIG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uID0gcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gKyBzZWdtZW50WzBdO1xuICAgICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uO1xuXG4gICAgICAgIGlmIChzZWdtZW50Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAvLyBPcmlnaW5hbCBzb3VyY2UuXG4gICAgICAgICAgbWFwcGluZy5zb3VyY2UgPSBwcmV2aW91c1NvdXJjZSArIHNlZ21lbnRbMV07XG4gICAgICAgICAgcHJldmlvdXNTb3VyY2UgKz0gc2VnbWVudFsxXTtcblxuICAgICAgICAgIC8vIE9yaWdpbmFsIGxpbmUuXG4gICAgICAgICAgbWFwcGluZy5vcmlnaW5hbExpbmUgPSBwcmV2aW91c09yaWdpbmFsTGluZSArIHNlZ21lbnRbMl07XG4gICAgICAgICAgcHJldmlvdXNPcmlnaW5hbExpbmUgPSBtYXBwaW5nLm9yaWdpbmFsTGluZTtcbiAgICAgICAgICAvLyBMaW5lcyBhcmUgc3RvcmVkIDAtYmFzZWRcbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsTGluZSArPSAxO1xuXG4gICAgICAgICAgLy8gT3JpZ2luYWwgY29sdW1uLlxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxDb2x1bW4gPSBwcmV2aW91c09yaWdpbmFsQ29sdW1uICsgc2VnbWVudFszXTtcbiAgICAgICAgICBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gbWFwcGluZy5vcmlnaW5hbENvbHVtbjtcblxuICAgICAgICAgIGlmIChzZWdtZW50Lmxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgIC8vIE9yaWdpbmFsIG5hbWUuXG4gICAgICAgICAgICBtYXBwaW5nLm5hbWUgPSBwcmV2aW91c05hbWUgKyBzZWdtZW50WzRdO1xuICAgICAgICAgICAgcHJldmlvdXNOYW1lICs9IHNlZ21lbnRbNF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2VuZXJhdGVkTWFwcGluZ3MucHVzaChtYXBwaW5nKTtcbiAgICAgICAgaWYgKHR5cGVvZiBtYXBwaW5nLm9yaWdpbmFsTGluZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBvcmlnaW5hbE1hcHBpbmdzLnB1c2gobWFwcGluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBxdWlja1NvcnQoZ2VuZXJhdGVkTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQpO1xuICAgIHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IGdlbmVyYXRlZE1hcHBpbmdzO1xuXG4gICAgcXVpY2tTb3J0KG9yaWdpbmFsTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMpO1xuICAgIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzID0gb3JpZ2luYWxNYXBwaW5ncztcbiAgfTtcblxuLyoqXG4gKiBGaW5kIHRoZSBtYXBwaW5nIHRoYXQgYmVzdCBtYXRjaGVzIHRoZSBoeXBvdGhldGljYWwgXCJuZWVkbGVcIiBtYXBwaW5nIHRoYXRcbiAqIHdlIGFyZSBzZWFyY2hpbmcgZm9yIGluIHRoZSBnaXZlbiBcImhheXN0YWNrXCIgb2YgbWFwcGluZ3MuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9maW5kTWFwcGluZyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2ZpbmRNYXBwaW5nKGFOZWVkbGUsIGFNYXBwaW5ncywgYUxpbmVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhQ29sdW1uTmFtZSwgYUNvbXBhcmF0b3IsIGFCaWFzKSB7XG4gICAgLy8gVG8gcmV0dXJuIHRoZSBwb3NpdGlvbiB3ZSBhcmUgc2VhcmNoaW5nIGZvciwgd2UgbXVzdCBmaXJzdCBmaW5kIHRoZVxuICAgIC8vIG1hcHBpbmcgZm9yIHRoZSBnaXZlbiBwb3NpdGlvbiBhbmQgdGhlbiByZXR1cm4gdGhlIG9wcG9zaXRlIHBvc2l0aW9uIGl0XG4gICAgLy8gcG9pbnRzIHRvLiBCZWNhdXNlIHRoZSBtYXBwaW5ncyBhcmUgc29ydGVkLCB3ZSBjYW4gdXNlIGJpbmFyeSBzZWFyY2ggdG9cbiAgICAvLyBmaW5kIHRoZSBiZXN0IG1hcHBpbmcuXG5cbiAgICBpZiAoYU5lZWRsZVthTGluZU5hbWVdIDw9IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0xpbmUgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMSwgZ290ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKyBhTmVlZGxlW2FMaW5lTmFtZV0pO1xuICAgIH1cbiAgICBpZiAoYU5lZWRsZVthQ29sdW1uTmFtZV0gPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDb2x1bW4gbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMCwgZ290ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKyBhTmVlZGxlW2FDb2x1bW5OYW1lXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJpbmFyeVNlYXJjaC5zZWFyY2goYU5lZWRsZSwgYU1hcHBpbmdzLCBhQ29tcGFyYXRvciwgYUJpYXMpO1xuICB9O1xuXG4vKipcbiAqIENvbXB1dGUgdGhlIGxhc3QgY29sdW1uIGZvciBlYWNoIGdlbmVyYXRlZCBtYXBwaW5nLiBUaGUgbGFzdCBjb2x1bW4gaXNcbiAqIGluY2x1c2l2ZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuY29tcHV0ZUNvbHVtblNwYW5zID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfY29tcHV0ZUNvbHVtblNwYW5zKCkge1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncy5sZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICAvLyBNYXBwaW5ncyBkbyBub3QgY29udGFpbiBhIGZpZWxkIGZvciB0aGUgbGFzdCBnZW5lcmF0ZWQgY29sdW1udC4gV2VcbiAgICAgIC8vIGNhbiBjb21lIHVwIHdpdGggYW4gb3B0aW1pc3RpYyBlc3RpbWF0ZSwgaG93ZXZlciwgYnkgYXNzdW1pbmcgdGhhdFxuICAgICAgLy8gbWFwcGluZ3MgYXJlIGNvbnRpZ3VvdXMgKGkuZS4gZ2l2ZW4gdHdvIGNvbnNlY3V0aXZlIG1hcHBpbmdzLCB0aGVcbiAgICAgIC8vIGZpcnN0IG1hcHBpbmcgZW5kcyB3aGVyZSB0aGUgc2Vjb25kIG9uZSBzdGFydHMpLlxuICAgICAgaWYgKGluZGV4ICsgMSA8IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzLmxlbmd0aCkge1xuICAgICAgICB2YXIgbmV4dE1hcHBpbmcgPSB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5nc1tpbmRleCArIDFdO1xuXG4gICAgICAgIGlmIChtYXBwaW5nLmdlbmVyYXRlZExpbmUgPT09IG5leHRNYXBwaW5nLmdlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgICBtYXBwaW5nLmxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBuZXh0TWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gLSAxO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBsYXN0IG1hcHBpbmcgZm9yIGVhY2ggbGluZSBzcGFucyB0aGUgZW50aXJlIGxpbmUuXG4gICAgICBtYXBwaW5nLmxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBJbmZpbml0eTtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgb3JpZ2luYWwgc291cmNlLCBsaW5lLCBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgZ2VuZXJhdGVkXG4gKiBzb3VyY2UncyBsaW5lIGFuZCBjb2x1bW4gcG9zaXRpb25zIHByb3ZpZGVkLiBUaGUgb25seSBhcmd1bWVudCBpcyBhbiBvYmplY3RcbiAqIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS5cbiAqICAgLSBiaWFzOiBFaXRoZXIgJ1NvdXJjZU1hcENvbnN1bWVyLkdSRUFURVNUX0xPV0VSX0JPVU5EJyBvclxuICogICAgICdTb3VyY2VNYXBDb25zdW1lci5MRUFTVF9VUFBFUl9CT1VORCcuIFNwZWNpZmllcyB3aGV0aGVyIHRvIHJldHVybiB0aGVcbiAqICAgICBjbG9zZXN0IGVsZW1lbnQgdGhhdCBpcyBzbWFsbGVyIHRoYW4gb3IgZ3JlYXRlciB0aGFuIHRoZSBvbmUgd2UgYXJlXG4gKiAgICAgc2VhcmNoaW5nIGZvciwgcmVzcGVjdGl2ZWx5LCBpZiB0aGUgZXhhY3QgZWxlbWVudCBjYW5ub3QgYmUgZm91bmQuXG4gKiAgICAgRGVmYXVsdHMgdG8gJ1NvdXJjZU1hcENvbnN1bWVyLkdSRUFURVNUX0xPV0VSX0JPVU5EJy5cbiAqXG4gKiBhbmQgYW4gb2JqZWN0IGlzIHJldHVybmVkIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBzb3VyY2U6IFRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZSwgb3IgbnVsbC5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UsIG9yIG51bGwuXG4gKiAgIC0gbmFtZTogVGhlIG9yaWdpbmFsIGlkZW50aWZpZXIsIG9yIG51bGwuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLm9yaWdpbmFsUG9zaXRpb25Gb3IgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9vcmlnaW5hbFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgdmFyIG5lZWRsZSA9IHtcbiAgICAgIGdlbmVyYXRlZExpbmU6IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbGluZScpLFxuICAgICAgZ2VuZXJhdGVkQ29sdW1uOiB1dGlsLmdldEFyZyhhQXJncywgJ2NvbHVtbicpXG4gICAgfTtcblxuICAgIHZhciBpbmRleCA9IHRoaXMuX2ZpbmRNYXBwaW5nKFxuICAgICAgbmVlZGxlLFxuICAgICAgdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3MsXG4gICAgICBcImdlbmVyYXRlZExpbmVcIixcbiAgICAgIFwiZ2VuZXJhdGVkQ29sdW1uXCIsXG4gICAgICB1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkLFxuICAgICAgdXRpbC5nZXRBcmcoYUFyZ3MsICdiaWFzJywgU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQpXG4gICAgKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzW2luZGV4XTtcblxuICAgICAgaWYgKG1hcHBpbmcuZ2VuZXJhdGVkTGluZSA9PT0gbmVlZGxlLmdlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdzb3VyY2UnLCBudWxsKTtcbiAgICAgICAgaWYgKHNvdXJjZSAhPT0gbnVsbCkge1xuICAgICAgICAgIHNvdXJjZSA9IHRoaXMuX3NvdXJjZXMuYXQoc291cmNlKTtcbiAgICAgICAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IHV0aWwuam9pbih0aGlzLnNvdXJjZVJvb3QsIHNvdXJjZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBuYW1lID0gdXRpbC5nZXRBcmcobWFwcGluZywgJ25hbWUnLCBudWxsKTtcbiAgICAgICAgaWYgKG5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICBuYW1lID0gdGhpcy5fbmFtZXMuYXQobmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICBsaW5lOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnb3JpZ2luYWxMaW5lJywgbnVsbCksXG4gICAgICAgICAgY29sdW1uOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnb3JpZ2luYWxDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZTogbnVsbCxcbiAgICAgIGxpbmU6IG51bGwsXG4gICAgICBjb2x1bW46IG51bGwsXG4gICAgICBuYW1lOiBudWxsXG4gICAgfTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB3ZSBoYXZlIHRoZSBzb3VyY2UgY29udGVudCBmb3IgZXZlcnkgc291cmNlIGluIHRoZSBzb3VyY2VcbiAqIG1hcCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5oYXNDb250ZW50c09mQWxsU291cmNlcyA9XG4gIGZ1bmN0aW9uIEJhc2ljU291cmNlTWFwQ29uc3VtZXJfaGFzQ29udGVudHNPZkFsbFNvdXJjZXMoKSB7XG4gICAgaWYgKCF0aGlzLnNvdXJjZXNDb250ZW50KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZXNDb250ZW50Lmxlbmd0aCA+PSB0aGlzLl9zb3VyY2VzLnNpemUoKSAmJlxuICAgICAgIXRoaXMuc291cmNlc0NvbnRlbnQuc29tZShmdW5jdGlvbiAoc2MpIHsgcmV0dXJuIHNjID09IG51bGw7IH0pO1xuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSBjb250ZW50LiBUaGUgb25seSBhcmd1bWVudCBpcyB0aGUgdXJsIG9mIHRoZVxuICogb3JpZ2luYWwgc291cmNlIGZpbGUuIFJldHVybnMgbnVsbCBpZiBubyBvcmlnaW5hbCBzb3VyY2UgY29udGVudCBpc1xuICogYXZhaWxhYmxlLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5zb3VyY2VDb250ZW50Rm9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfc291cmNlQ29udGVudEZvcihhU291cmNlLCBudWxsT25NaXNzaW5nKSB7XG4gICAgaWYgKCF0aGlzLnNvdXJjZXNDb250ZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIGFTb3VyY2UgPSB1dGlsLnJlbGF0aXZlKHRoaXMuc291cmNlUm9vdCwgYVNvdXJjZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3NvdXJjZXMuaGFzKGFTb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VzQ29udGVudFt0aGlzLl9zb3VyY2VzLmluZGV4T2YoYVNvdXJjZSldO1xuICAgIH1cblxuICAgIHZhciB1cmw7XG4gICAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsXG4gICAgICAgICYmICh1cmwgPSB1dGlsLnVybFBhcnNlKHRoaXMuc291cmNlUm9vdCkpKSB7XG4gICAgICAvLyBYWFg6IGZpbGU6Ly8gVVJJcyBhbmQgYWJzb2x1dGUgcGF0aHMgbGVhZCB0byB1bmV4cGVjdGVkIGJlaGF2aW9yIGZvclxuICAgICAgLy8gbWFueSB1c2Vycy4gV2UgY2FuIGhlbHAgdGhlbSBvdXQgd2hlbiB0aGV5IGV4cGVjdCBmaWxlOi8vIFVSSXMgdG9cbiAgICAgIC8vIGJlaGF2ZSBsaWtlIGl0IHdvdWxkIGlmIHRoZXkgd2VyZSBydW5uaW5nIGEgbG9jYWwgSFRUUCBzZXJ2ZXIuIFNlZVxuICAgICAgLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9ODg1NTk3LlxuICAgICAgdmFyIGZpbGVVcmlBYnNQYXRoID0gYVNvdXJjZS5yZXBsYWNlKC9eZmlsZTpcXC9cXC8vLCBcIlwiKTtcbiAgICAgIGlmICh1cmwuc2NoZW1lID09IFwiZmlsZVwiXG4gICAgICAgICAgJiYgdGhpcy5fc291cmNlcy5oYXMoZmlsZVVyaUFic1BhdGgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZXNDb250ZW50W3RoaXMuX3NvdXJjZXMuaW5kZXhPZihmaWxlVXJpQWJzUGF0aCldXG4gICAgICB9XG5cbiAgICAgIGlmICgoIXVybC5wYXRoIHx8IHVybC5wYXRoID09IFwiL1wiKVxuICAgICAgICAgICYmIHRoaXMuX3NvdXJjZXMuaGFzKFwiL1wiICsgYVNvdXJjZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlc0NvbnRlbnRbdGhpcy5fc291cmNlcy5pbmRleE9mKFwiL1wiICsgYVNvdXJjZSldO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCByZWN1cnNpdmVseSBmcm9tXG4gICAgLy8gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5zb3VyY2VDb250ZW50Rm9yLiBJbiB0aGF0IGNhc2UsIHdlXG4gICAgLy8gZG9uJ3Qgd2FudCB0byB0aHJvdyBpZiB3ZSBjYW4ndCBmaW5kIHRoZSBzb3VyY2UgLSB3ZSBqdXN0IHdhbnQgdG9cbiAgICAvLyByZXR1cm4gbnVsbCwgc28gd2UgcHJvdmlkZSBhIGZsYWcgdG8gZXhpdCBncmFjZWZ1bGx5LlxuICAgIGlmIChudWxsT25NaXNzaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFTb3VyY2UgKyAnXCIgaXMgbm90IGluIHRoZSBTb3VyY2VNYXAuJyk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBvcmlnaW5hbCBzb3VyY2UsXG4gKiBsaW5lLCBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0IHdpdGhcbiAqIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgZmlsZW5hbWUgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gYmlhczogRWl0aGVyICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQnLiBTcGVjaWZpZXMgd2hldGhlciB0byByZXR1cm4gdGhlXG4gKiAgICAgY2xvc2VzdCBlbGVtZW50IHRoYXQgaXMgc21hbGxlciB0aGFuIG9yIGdyZWF0ZXIgdGhhbiB0aGUgb25lIHdlIGFyZVxuICogICAgIHNlYXJjaGluZyBmb3IsIHJlc3BlY3RpdmVseSwgaWYgdGhlIGV4YWN0IGVsZW1lbnQgY2Fubm90IGJlIGZvdW5kLlxuICogICAgIERlZmF1bHRzIHRvICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmdlbmVyYXRlZFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfZ2VuZXJhdGVkUG9zaXRpb25Gb3IoYUFyZ3MpIHtcbiAgICB2YXIgc291cmNlID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2UnKTtcbiAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIHNvdXJjZSA9IHV0aWwucmVsYXRpdmUodGhpcy5zb3VyY2VSb290LCBzb3VyY2UpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX3NvdXJjZXMuaGFzKHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxpbmU6IG51bGwsXG4gICAgICAgIGNvbHVtbjogbnVsbCxcbiAgICAgICAgbGFzdENvbHVtbjogbnVsbFxuICAgICAgfTtcbiAgICB9XG4gICAgc291cmNlID0gdGhpcy5fc291cmNlcy5pbmRleE9mKHNvdXJjZSk7XG5cbiAgICB2YXIgbmVlZGxlID0ge1xuICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICBvcmlnaW5hbExpbmU6IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbGluZScpLFxuICAgICAgb3JpZ2luYWxDb2x1bW46IHV0aWwuZ2V0QXJnKGFBcmdzLCAnY29sdW1uJylcbiAgICB9O1xuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZE1hcHBpbmcoXG4gICAgICBuZWVkbGUsXG4gICAgICB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzLFxuICAgICAgXCJvcmlnaW5hbExpbmVcIixcbiAgICAgIFwib3JpZ2luYWxDb2x1bW5cIixcbiAgICAgIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMsXG4gICAgICB1dGlsLmdldEFyZyhhQXJncywgJ2JpYXMnLCBTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORClcbiAgICApO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5fb3JpZ2luYWxNYXBwaW5nc1tpbmRleF07XG5cbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSA9PT0gbmVlZGxlLnNvdXJjZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxpbmU6IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRMaW5lJywgbnVsbCksXG4gICAgICAgICAgY29sdW1uOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnZ2VuZXJhdGVkQ29sdW1uJywgbnVsbCksXG4gICAgICAgICAgbGFzdENvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2xhc3RHZW5lcmF0ZWRDb2x1bW4nLCBudWxsKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBsaW5lOiBudWxsLFxuICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgbGFzdENvbHVtbjogbnVsbFxuICAgIH07XG4gIH07XG5cbmV4cG9ydHMuQmFzaWNTb3VyY2VNYXBDb25zdW1lciA9IEJhc2ljU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogQW4gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyIGluc3RhbmNlIHJlcHJlc2VudHMgYSBwYXJzZWQgc291cmNlIG1hcCB3aGljaFxuICogd2UgY2FuIHF1ZXJ5IGZvciBpbmZvcm1hdGlvbi4gSXQgZGlmZmVycyBmcm9tIEJhc2ljU291cmNlTWFwQ29uc3VtZXIgaW5cbiAqIHRoYXQgaXQgdGFrZXMgXCJpbmRleGVkXCIgc291cmNlIG1hcHMgKGkuZS4gb25lcyB3aXRoIGEgXCJzZWN0aW9uc1wiIGZpZWxkKSBhc1xuICogaW5wdXQuXG4gKlxuICogVGhlIG9ubHkgcGFyYW1ldGVyIGlzIGEgcmF3IHNvdXJjZSBtYXAgKGVpdGhlciBhcyBhIEpTT04gc3RyaW5nLCBvciBhbHJlYWR5XG4gKiBwYXJzZWQgdG8gYW4gb2JqZWN0KS4gQWNjb3JkaW5nIHRvIHRoZSBzcGVjIGZvciBpbmRleGVkIHNvdXJjZSBtYXBzLCB0aGV5XG4gKiBoYXZlIHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlczpcbiAqXG4gKiAgIC0gdmVyc2lvbjogV2hpY2ggdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcCBzcGVjIHRoaXMgbWFwIGlzIGZvbGxvd2luZy5cbiAqICAgLSBmaWxlOiBPcHRpb25hbC4gVGhlIGdlbmVyYXRlZCBmaWxlIHRoaXMgc291cmNlIG1hcCBpcyBhc3NvY2lhdGVkIHdpdGguXG4gKiAgIC0gc2VjdGlvbnM6IEEgbGlzdCBvZiBzZWN0aW9uIGRlZmluaXRpb25zLlxuICpcbiAqIEVhY2ggdmFsdWUgdW5kZXIgdGhlIFwic2VjdGlvbnNcIiBmaWVsZCBoYXMgdHdvIGZpZWxkczpcbiAqICAgLSBvZmZzZXQ6IFRoZSBvZmZzZXQgaW50byB0aGUgb3JpZ2luYWwgc3BlY2lmaWVkIGF0IHdoaWNoIHRoaXMgc2VjdGlvblxuICogICAgICAgYmVnaW5zIHRvIGFwcGx5LCBkZWZpbmVkIGFzIGFuIG9iamVjdCB3aXRoIGEgXCJsaW5lXCIgYW5kIFwiY29sdW1uXCJcbiAqICAgICAgIGZpZWxkLlxuICogICAtIG1hcDogQSBzb3VyY2UgbWFwIGRlZmluaXRpb24uIFRoaXMgc291cmNlIG1hcCBjb3VsZCBhbHNvIGJlIGluZGV4ZWQsXG4gKiAgICAgICBidXQgZG9lc24ndCBoYXZlIHRvIGJlLlxuICpcbiAqIEluc3RlYWQgb2YgdGhlIFwibWFwXCIgZmllbGQsIGl0J3MgYWxzbyBwb3NzaWJsZSB0byBoYXZlIGEgXCJ1cmxcIiBmaWVsZFxuICogc3BlY2lmeWluZyBhIFVSTCB0byByZXRyaWV2ZSBhIHNvdXJjZSBtYXAgZnJvbSwgYnV0IHRoYXQncyBjdXJyZW50bHlcbiAqIHVuc3VwcG9ydGVkLlxuICpcbiAqIEhlcmUncyBhbiBleGFtcGxlIHNvdXJjZSBtYXAsIHRha2VuIGZyb20gdGhlIHNvdXJjZSBtYXAgc3BlY1swXSwgYnV0XG4gKiBtb2RpZmllZCB0byBvbWl0IGEgc2VjdGlvbiB3aGljaCB1c2VzIHRoZSBcInVybFwiIGZpZWxkLlxuICpcbiAqICB7XG4gKiAgICB2ZXJzaW9uIDogMyxcbiAqICAgIGZpbGU6IFwiYXBwLmpzXCIsXG4gKiAgICBzZWN0aW9uczogW3tcbiAqICAgICAgb2Zmc2V0OiB7bGluZToxMDAsIGNvbHVtbjoxMH0sXG4gKiAgICAgIG1hcDoge1xuICogICAgICAgIHZlcnNpb24gOiAzLFxuICogICAgICAgIGZpbGU6IFwic2VjdGlvbi5qc1wiLFxuICogICAgICAgIHNvdXJjZXM6IFtcImZvby5qc1wiLCBcImJhci5qc1wiXSxcbiAqICAgICAgICBuYW1lczogW1wic3JjXCIsIFwibWFwc1wiLCBcImFyZVwiLCBcImZ1blwiXSxcbiAqICAgICAgICBtYXBwaW5nczogXCJBQUFBLEU7O0FCQ0RFO1wiXG4gKiAgICAgIH1cbiAqICAgIH1dLFxuICogIH1cbiAqXG4gKiBbMF06IGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL2RvY3VtZW50L2QvMVUxUkdBZWhRd1J5cFVUb3ZGMUtSbHBpT0Z6ZTBiLV8yZ2M2ZkFIMEtZMGsvZWRpdCNoZWFkaW5nPWguNTM1ZXMzeGVwcmd0XG4gKi9cbmZ1bmN0aW9uIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcihhU291cmNlTWFwKSB7XG4gIHZhciBzb3VyY2VNYXAgPSBhU291cmNlTWFwO1xuICBpZiAodHlwZW9mIGFTb3VyY2VNYXAgPT09ICdzdHJpbmcnKSB7XG4gICAgc291cmNlTWFwID0gSlNPTi5wYXJzZShhU291cmNlTWFwLnJlcGxhY2UoL15cXClcXF1cXH0nLywgJycpKTtcbiAgfVxuXG4gIHZhciB2ZXJzaW9uID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAndmVyc2lvbicpO1xuICB2YXIgc2VjdGlvbnMgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdzZWN0aW9ucycpO1xuXG4gIGlmICh2ZXJzaW9uICE9IHRoaXMuX3ZlcnNpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHZlcnNpb246ICcgKyB2ZXJzaW9uKTtcbiAgfVxuXG4gIHRoaXMuX3NvdXJjZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbmFtZXMgPSBuZXcgQXJyYXlTZXQoKTtcblxuICB2YXIgbGFzdE9mZnNldCA9IHtcbiAgICBsaW5lOiAtMSxcbiAgICBjb2x1bW46IDBcbiAgfTtcbiAgdGhpcy5fc2VjdGlvbnMgPSBzZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICBpZiAocy51cmwpIHtcbiAgICAgIC8vIFRoZSB1cmwgZmllbGQgd2lsbCByZXF1aXJlIHN1cHBvcnQgZm9yIGFzeW5jaHJvbmljaXR5LlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvaXNzdWVzLzE2XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1cHBvcnQgZm9yIHVybCBmaWVsZCBpbiBzZWN0aW9ucyBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxuICAgIHZhciBvZmZzZXQgPSB1dGlsLmdldEFyZyhzLCAnb2Zmc2V0Jyk7XG4gICAgdmFyIG9mZnNldExpbmUgPSB1dGlsLmdldEFyZyhvZmZzZXQsICdsaW5lJyk7XG4gICAgdmFyIG9mZnNldENvbHVtbiA9IHV0aWwuZ2V0QXJnKG9mZnNldCwgJ2NvbHVtbicpO1xuXG4gICAgaWYgKG9mZnNldExpbmUgPCBsYXN0T2Zmc2V0LmxpbmUgfHxcbiAgICAgICAgKG9mZnNldExpbmUgPT09IGxhc3RPZmZzZXQubGluZSAmJiBvZmZzZXRDb2x1bW4gPCBsYXN0T2Zmc2V0LmNvbHVtbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2VjdGlvbiBvZmZzZXRzIG11c3QgYmUgb3JkZXJlZCBhbmQgbm9uLW92ZXJsYXBwaW5nLicpO1xuICAgIH1cbiAgICBsYXN0T2Zmc2V0ID0gb2Zmc2V0O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdlbmVyYXRlZE9mZnNldDoge1xuICAgICAgICAvLyBUaGUgb2Zmc2V0IGZpZWxkcyBhcmUgMC1iYXNlZCwgYnV0IHdlIHVzZSAxLWJhc2VkIGluZGljZXMgd2hlblxuICAgICAgICAvLyBlbmNvZGluZy9kZWNvZGluZyBmcm9tIFZMUS5cbiAgICAgICAgZ2VuZXJhdGVkTGluZTogb2Zmc2V0TGluZSArIDEsXG4gICAgICAgIGdlbmVyYXRlZENvbHVtbjogb2Zmc2V0Q29sdW1uICsgMVxuICAgICAgfSxcbiAgICAgIGNvbnN1bWVyOiBuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC5nZXRBcmcocywgJ21hcCcpKVxuICAgIH1cbiAgfSk7XG59XG5cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSk7XG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogVGhlIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXBwaW5nIHNwZWMgdGhhdCB3ZSBhcmUgY29uc3VtaW5nLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLyoqXG4gKiBUaGUgbGlzdCBvZiBvcmlnaW5hbCBzb3VyY2VzLlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSwgJ3NvdXJjZXMnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzb3VyY2VzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9zZWN0aW9uc1tpXS5jb25zdW1lci5zb3VyY2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHNvdXJjZXMucHVzaCh0aGlzLl9zZWN0aW9uc1tpXS5jb25zdW1lci5zb3VyY2VzW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZXM7XG4gIH1cbn0pO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSwgbGluZSwgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGdlbmVyYXRlZFxuICogc291cmNlJ3MgbGluZSBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKiB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgb3JpZ2luYWwgc291cmNlIGZpbGUsIG9yIG51bGwuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UsIG9yIG51bGwuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLCBvciBudWxsLlxuICogICAtIG5hbWU6IFRoZSBvcmlnaW5hbCBpZGVudGlmaWVyLCBvciBudWxsLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLm9yaWdpbmFsUG9zaXRpb25Gb3IgPVxuICBmdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXJfb3JpZ2luYWxQb3NpdGlvbkZvcihhQXJncykge1xuICAgIHZhciBuZWVkbGUgPSB7XG4gICAgICBnZW5lcmF0ZWRMaW5lOiB1dGlsLmdldEFyZyhhQXJncywgJ2xpbmUnKSxcbiAgICAgIGdlbmVyYXRlZENvbHVtbjogdXRpbC5nZXRBcmcoYUFyZ3MsICdjb2x1bW4nKVxuICAgIH07XG5cbiAgICAvLyBGaW5kIHRoZSBzZWN0aW9uIGNvbnRhaW5pbmcgdGhlIGdlbmVyYXRlZCBwb3NpdGlvbiB3ZSdyZSB0cnlpbmcgdG8gbWFwXG4gICAgLy8gdG8gYW4gb3JpZ2luYWwgcG9zaXRpb24uXG4gICAgdmFyIHNlY3Rpb25JbmRleCA9IGJpbmFyeVNlYXJjaC5zZWFyY2gobmVlZGxlLCB0aGlzLl9zZWN0aW9ucyxcbiAgICAgIGZ1bmN0aW9uKG5lZWRsZSwgc2VjdGlvbikge1xuICAgICAgICB2YXIgY21wID0gbmVlZGxlLmdlbmVyYXRlZExpbmUgLSBzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lO1xuICAgICAgICBpZiAoY21wKSB7XG4gICAgICAgICAgcmV0dXJuIGNtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAobmVlZGxlLmdlbmVyYXRlZENvbHVtbiAtXG4gICAgICAgICAgICAgICAgc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uKTtcbiAgICAgIH0pO1xuICAgIHZhciBzZWN0aW9uID0gdGhpcy5fc2VjdGlvbnNbc2VjdGlvbkluZGV4XTtcblxuICAgIGlmICghc2VjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc291cmNlOiBudWxsLFxuICAgICAgICBsaW5lOiBudWxsLFxuICAgICAgICBjb2x1bW46IG51bGwsXG4gICAgICAgIG5hbWU6IG51bGxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlY3Rpb24uY29uc3VtZXIub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgICBsaW5lOiBuZWVkbGUuZ2VuZXJhdGVkTGluZSAtXG4gICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lIC0gMSksXG4gICAgICBjb2x1bW46IG5lZWRsZS5nZW5lcmF0ZWRDb2x1bW4gLVxuICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSA9PT0gbmVlZGxlLmdlbmVyYXRlZExpbmVcbiAgICAgICAgID8gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uIC0gMVxuICAgICAgICAgOiAwKSxcbiAgICAgIGJpYXM6IGFBcmdzLmJpYXNcbiAgICB9KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB3ZSBoYXZlIHRoZSBzb3VyY2UgY29udGVudCBmb3IgZXZlcnkgc291cmNlIGluIHRoZSBzb3VyY2VcbiAqIG1hcCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmhhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX2hhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzKCkge1xuICAgIHJldHVybiB0aGlzLl9zZWN0aW9ucy5ldmVyeShmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIHMuY29uc3VtZXIuaGFzQ29udGVudHNPZkFsbFNvdXJjZXMoKTtcbiAgICB9KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzb3VyY2UgY29udGVudC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgdGhlIHVybCBvZiB0aGVcbiAqIG9yaWdpbmFsIHNvdXJjZSBmaWxlLiBSZXR1cm5zIG51bGwgaWYgbm8gb3JpZ2luYWwgc291cmNlIGNvbnRlbnQgaXNcbiAqIGF2YWlsYWJsZS5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5zb3VyY2VDb250ZW50Rm9yID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX3NvdXJjZUNvbnRlbnRGb3IoYVNvdXJjZSwgbnVsbE9uTWlzc2luZykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzZWN0aW9uID0gdGhpcy5fc2VjdGlvbnNbaV07XG5cbiAgICAgIHZhciBjb250ZW50ID0gc2VjdGlvbi5jb25zdW1lci5zb3VyY2VDb250ZW50Rm9yKGFTb3VyY2UsIHRydWUpO1xuICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChudWxsT25NaXNzaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFTb3VyY2UgKyAnXCIgaXMgbm90IGluIHRoZSBTb3VyY2VNYXAuJyk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBvcmlnaW5hbCBzb3VyY2UsXG4gKiBsaW5lLCBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0IHdpdGhcbiAqIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgZmlsZW5hbWUgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuXG4gKi9cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuZ2VuZXJhdGVkUG9zaXRpb25Gb3IgPVxuICBmdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXJfZ2VuZXJhdGVkUG9zaXRpb25Gb3IoYUFyZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3NlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc2VjdGlvbiA9IHRoaXMuX3NlY3Rpb25zW2ldO1xuXG4gICAgICAvLyBPbmx5IGNvbnNpZGVyIHRoaXMgc2VjdGlvbiBpZiB0aGUgcmVxdWVzdGVkIHNvdXJjZSBpcyBpbiB0aGUgbGlzdCBvZlxuICAgICAgLy8gc291cmNlcyBvZiB0aGUgY29uc3VtZXIuXG4gICAgICBpZiAoc2VjdGlvbi5jb25zdW1lci5zb3VyY2VzLmluZGV4T2YodXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2UnKSkgPT09IC0xKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdmFyIGdlbmVyYXRlZFBvc2l0aW9uID0gc2VjdGlvbi5jb25zdW1lci5nZW5lcmF0ZWRQb3NpdGlvbkZvcihhQXJncyk7XG4gICAgICBpZiAoZ2VuZXJhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgdmFyIHJldCA9IHtcbiAgICAgICAgICBsaW5lOiBnZW5lcmF0ZWRQb3NpdGlvbi5saW5lICtcbiAgICAgICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lIC0gMSksXG4gICAgICAgICAgY29sdW1uOiBnZW5lcmF0ZWRQb3NpdGlvbi5jb2x1bW4gK1xuICAgICAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgPT09IGdlbmVyYXRlZFBvc2l0aW9uLmxpbmVcbiAgICAgICAgICAgICA/IHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZENvbHVtbiAtIDFcbiAgICAgICAgICAgICA6IDApXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmU6IG51bGwsXG4gICAgICBjb2x1bW46IG51bGxcbiAgICB9O1xuICB9O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBtYXBwaW5ncyBpbiBhIHN0cmluZyBpbiB0byBhIGRhdGEgc3RydWN0dXJlIHdoaWNoIHdlIGNhbiBlYXNpbHlcbiAqIHF1ZXJ5ICh0aGUgb3JkZXJlZCBhcnJheXMgaW4gdGhlIGB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3NgIGFuZFxuICogYHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzYCBwcm9wZXJ0aWVzKS5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fcGFyc2VNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcl9wYXJzZU1hcHBpbmdzKGFTdHIsIGFTb3VyY2VSb290KSB7XG4gICAgdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzID0gW107XG4gICAgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3NlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc2VjdGlvbiA9IHRoaXMuX3NlY3Rpb25zW2ldO1xuICAgICAgdmFyIHNlY3Rpb25NYXBwaW5ncyA9IHNlY3Rpb24uY29uc3VtZXIuX2dlbmVyYXRlZE1hcHBpbmdzO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzZWN0aW9uTWFwcGluZ3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdmFyIG1hcHBpbmcgPSBzZWN0aW9uTWFwcGluZ3Nbal07XG5cbiAgICAgICAgdmFyIHNvdXJjZSA9IHNlY3Rpb24uY29uc3VtZXIuX3NvdXJjZXMuYXQobWFwcGluZy5zb3VyY2UpO1xuICAgICAgICBpZiAoc2VjdGlvbi5jb25zdW1lci5zb3VyY2VSb290ICE9PSBudWxsKSB7XG4gICAgICAgICAgc291cmNlID0gdXRpbC5qb2luKHNlY3Rpb24uY29uc3VtZXIuc291cmNlUm9vdCwgc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zb3VyY2VzLmFkZChzb3VyY2UpO1xuICAgICAgICBzb3VyY2UgPSB0aGlzLl9zb3VyY2VzLmluZGV4T2Yoc291cmNlKTtcblxuICAgICAgICB2YXIgbmFtZSA9IHNlY3Rpb24uY29uc3VtZXIuX25hbWVzLmF0KG1hcHBpbmcubmFtZSk7XG4gICAgICAgIHRoaXMuX25hbWVzLmFkZChuYW1lKTtcbiAgICAgICAgbmFtZSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG5cbiAgICAgICAgLy8gVGhlIG1hcHBpbmdzIGNvbWluZyBmcm9tIHRoZSBjb25zdW1lciBmb3IgdGhlIHNlY3Rpb24gaGF2ZVxuICAgICAgICAvLyBnZW5lcmF0ZWQgcG9zaXRpb25zIHJlbGF0aXZlIHRvIHRoZSBzdGFydCBvZiB0aGUgc2VjdGlvbiwgc28gd2VcbiAgICAgICAgLy8gbmVlZCB0byBvZmZzZXQgdGhlbSB0byBiZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgb2YgdGhlIGNvbmNhdGVuYXRlZFxuICAgICAgICAvLyBnZW5lcmF0ZWQgZmlsZS5cbiAgICAgICAgdmFyIGFkanVzdGVkTWFwcGluZyA9IHtcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICBnZW5lcmF0ZWRMaW5lOiBtYXBwaW5nLmdlbmVyYXRlZExpbmUgK1xuICAgICAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgLSAxKSxcbiAgICAgICAgICBnZW5lcmF0ZWRDb2x1bW46IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uICtcbiAgICAgICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lID09PSBtYXBwaW5nLmdlbmVyYXRlZExpbmVcbiAgICAgICAgICAgID8gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uIC0gMVxuICAgICAgICAgICAgOiAwKSxcbiAgICAgICAgICBvcmlnaW5hbExpbmU6IG1hcHBpbmcub3JpZ2luYWxMaW5lLFxuICAgICAgICAgIG9yaWdpbmFsQ29sdW1uOiBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uLFxuICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MucHVzaChhZGp1c3RlZE1hcHBpbmcpO1xuICAgICAgICBpZiAodHlwZW9mIGFkanVzdGVkTWFwcGluZy5vcmlnaW5hbExpbmUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3MucHVzaChhZGp1c3RlZE1hcHBpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcXVpY2tTb3J0KHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncywgdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZCk7XG4gICAgcXVpY2tTb3J0KHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKTtcbiAgfTtcblxuZXhwb3J0cy5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIgPSBJbmRleGVkU291cmNlTWFwQ29uc3VtZXI7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciBiYXNlNjRWTFEgPSByZXF1aXJlKCcuL2Jhc2U2NC12bHEnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgQXJyYXlTZXQgPSByZXF1aXJlKCcuL2FycmF5LXNldCcpLkFycmF5U2V0O1xudmFyIE1hcHBpbmdMaXN0ID0gcmVxdWlyZSgnLi9tYXBwaW5nLWxpc3QnKS5NYXBwaW5nTGlzdDtcblxuLyoqXG4gKiBBbiBpbnN0YW5jZSBvZiB0aGUgU291cmNlTWFwR2VuZXJhdG9yIHJlcHJlc2VudHMgYSBzb3VyY2UgbWFwIHdoaWNoIGlzXG4gKiBiZWluZyBidWlsdCBpbmNyZW1lbnRhbGx5LiBZb3UgbWF5IHBhc3MgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZ1xuICogcHJvcGVydGllczpcbiAqXG4gKiAgIC0gZmlsZTogVGhlIGZpbGVuYW1lIG9mIHRoZSBnZW5lcmF0ZWQgc291cmNlLlxuICogICAtIHNvdXJjZVJvb3Q6IEEgcm9vdCBmb3IgYWxsIHJlbGF0aXZlIFVSTHMgaW4gdGhpcyBzb3VyY2UgbWFwLlxuICovXG5mdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3IoYUFyZ3MpIHtcbiAgaWYgKCFhQXJncykge1xuICAgIGFBcmdzID0ge307XG4gIH1cbiAgdGhpcy5fZmlsZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnZmlsZScsIG51bGwpO1xuICB0aGlzLl9zb3VyY2VSb290ID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2VSb290JywgbnVsbCk7XG4gIHRoaXMuX3NraXBWYWxpZGF0aW9uID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdza2lwVmFsaWRhdGlvbicsIGZhbHNlKTtcbiAgdGhpcy5fc291cmNlcyA9IG5ldyBBcnJheVNldCgpO1xuICB0aGlzLl9uYW1lcyA9IG5ldyBBcnJheVNldCgpO1xuICB0aGlzLl9tYXBwaW5ncyA9IG5ldyBNYXBwaW5nTGlzdCgpO1xuICB0aGlzLl9zb3VyY2VzQ29udGVudHMgPSBudWxsO1xufVxuXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFNvdXJjZU1hcEdlbmVyYXRvciBiYXNlZCBvbiBhIFNvdXJjZU1hcENvbnN1bWVyXG4gKlxuICogQHBhcmFtIGFTb3VyY2VNYXBDb25zdW1lciBUaGUgU291cmNlTWFwLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IuZnJvbVNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl9mcm9tU291cmNlTWFwKGFTb3VyY2VNYXBDb25zdW1lcikge1xuICAgIHZhciBzb3VyY2VSb290ID0gYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZVJvb3Q7XG4gICAgdmFyIGdlbmVyYXRvciA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgICAgZmlsZTogYVNvdXJjZU1hcENvbnN1bWVyLmZpbGUsXG4gICAgICBzb3VyY2VSb290OiBzb3VyY2VSb290XG4gICAgfSk7XG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLmVhY2hNYXBwaW5nKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgICB2YXIgbmV3TWFwcGluZyA9IHtcbiAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgbGluZTogbWFwcGluZy5nZW5lcmF0ZWRMaW5lLFxuICAgICAgICAgIGNvbHVtbjogbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW5cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKG1hcHBpbmcuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgbmV3TWFwcGluZy5zb3VyY2UgPSBtYXBwaW5nLnNvdXJjZTtcbiAgICAgICAgaWYgKHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICAgIG5ld01hcHBpbmcuc291cmNlID0gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBuZXdNYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdNYXBwaW5nLm9yaWdpbmFsID0ge1xuICAgICAgICAgIGxpbmU6IG1hcHBpbmcub3JpZ2luYWxMaW5lLFxuICAgICAgICAgIGNvbHVtbjogbWFwcGluZy5vcmlnaW5hbENvbHVtblxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChtYXBwaW5nLm5hbWUgIT0gbnVsbCkge1xuICAgICAgICAgIG5ld01hcHBpbmcubmFtZSA9IG1hcHBpbmcubmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnZW5lcmF0b3IuYWRkTWFwcGluZyhuZXdNYXBwaW5nKTtcbiAgICB9KTtcbiAgICBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2VGaWxlKSB7XG4gICAgICB2YXIgY29udGVudCA9IGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VDb250ZW50Rm9yKHNvdXJjZUZpbGUpO1xuICAgICAgaWYgKGNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgICBnZW5lcmF0b3Iuc2V0U291cmNlQ29udGVudChzb3VyY2VGaWxlLCBjb250ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9O1xuXG4vKipcbiAqIEFkZCBhIHNpbmdsZSBtYXBwaW5nIGZyb20gb3JpZ2luYWwgc291cmNlIGxpbmUgYW5kIGNvbHVtbiB0byB0aGUgZ2VuZXJhdGVkXG4gKiBzb3VyY2UncyBsaW5lIGFuZCBjb2x1bW4gZm9yIHRoaXMgc291cmNlIG1hcCBiZWluZyBjcmVhdGVkLiBUaGUgbWFwcGluZ1xuICogb2JqZWN0IHNob3VsZCBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gZ2VuZXJhdGVkOiBBbiBvYmplY3Qgd2l0aCB0aGUgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiBwb3NpdGlvbnMuXG4gKiAgIC0gb3JpZ2luYWw6IEFuIG9iamVjdCB3aXRoIHRoZSBvcmlnaW5hbCBsaW5lIGFuZCBjb2x1bW4gcG9zaXRpb25zLlxuICogICAtIHNvdXJjZTogVGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlIChyZWxhdGl2ZSB0byB0aGUgc291cmNlUm9vdCkuXG4gKiAgIC0gbmFtZTogQW4gb3B0aW9uYWwgb3JpZ2luYWwgdG9rZW4gbmFtZSBmb3IgdGhpcyBtYXBwaW5nLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLmFkZE1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfYWRkTWFwcGluZyhhQXJncykge1xuICAgIHZhciBnZW5lcmF0ZWQgPSB1dGlsLmdldEFyZyhhQXJncywgJ2dlbmVyYXRlZCcpO1xuICAgIHZhciBvcmlnaW5hbCA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnb3JpZ2luYWwnLCBudWxsKTtcbiAgICB2YXIgc291cmNlID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2UnLCBudWxsKTtcbiAgICB2YXIgbmFtZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbmFtZScsIG51bGwpO1xuXG4gICAgaWYgKCF0aGlzLl9za2lwVmFsaWRhdGlvbikge1xuICAgICAgdGhpcy5fdmFsaWRhdGVNYXBwaW5nKGdlbmVyYXRlZCwgb3JpZ2luYWwsIHNvdXJjZSwgbmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKHNvdXJjZSAhPSBudWxsKSB7XG4gICAgICBzb3VyY2UgPSBTdHJpbmcoc291cmNlKTtcbiAgICAgIGlmICghdGhpcy5fc291cmNlcy5oYXMoc291cmNlKSkge1xuICAgICAgICB0aGlzLl9zb3VyY2VzLmFkZChzb3VyY2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgICBpZiAoIXRoaXMuX25hbWVzLmhhcyhuYW1lKSkge1xuICAgICAgICB0aGlzLl9uYW1lcy5hZGQobmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fbWFwcGluZ3MuYWRkKHtcbiAgICAgIGdlbmVyYXRlZExpbmU6IGdlbmVyYXRlZC5saW5lLFxuICAgICAgZ2VuZXJhdGVkQ29sdW1uOiBnZW5lcmF0ZWQuY29sdW1uLFxuICAgICAgb3JpZ2luYWxMaW5lOiBvcmlnaW5hbCAhPSBudWxsICYmIG9yaWdpbmFsLmxpbmUsXG4gICAgICBvcmlnaW5hbENvbHVtbjogb3JpZ2luYWwgIT0gbnVsbCAmJiBvcmlnaW5hbC5jb2x1bW4sXG4gICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9KTtcbiAgfTtcblxuLyoqXG4gKiBTZXQgdGhlIHNvdXJjZSBjb250ZW50IGZvciBhIHNvdXJjZSBmaWxlLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLnNldFNvdXJjZUNvbnRlbnQgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3Jfc2V0U291cmNlQ29udGVudChhU291cmNlRmlsZSwgYVNvdXJjZUNvbnRlbnQpIHtcbiAgICB2YXIgc291cmNlID0gYVNvdXJjZUZpbGU7XG4gICAgaWYgKHRoaXMuX3NvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgc291cmNlID0gdXRpbC5yZWxhdGl2ZSh0aGlzLl9zb3VyY2VSb290LCBzb3VyY2UpO1xuICAgIH1cblxuICAgIGlmIChhU291cmNlQ29udGVudCAhPSBudWxsKSB7XG4gICAgICAvLyBBZGQgdGhlIHNvdXJjZSBjb250ZW50IHRvIHRoZSBfc291cmNlc0NvbnRlbnRzIG1hcC5cbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBfc291cmNlc0NvbnRlbnRzIG1hcCBpZiB0aGUgcHJvcGVydHkgaXMgbnVsbC5cbiAgICAgIGlmICghdGhpcy5fc291cmNlc0NvbnRlbnRzKSB7XG4gICAgICAgIHRoaXMuX3NvdXJjZXNDb250ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9zb3VyY2VzQ29udGVudHNbdXRpbC50b1NldFN0cmluZyhzb3VyY2UpXSA9IGFTb3VyY2VDb250ZW50O1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc291cmNlc0NvbnRlbnRzKSB7XG4gICAgICAvLyBSZW1vdmUgdGhlIHNvdXJjZSBmaWxlIGZyb20gdGhlIF9zb3VyY2VzQ29udGVudHMgbWFwLlxuICAgICAgLy8gSWYgdGhlIF9zb3VyY2VzQ29udGVudHMgbWFwIGlzIGVtcHR5LCBzZXQgdGhlIHByb3BlcnR5IHRvIG51bGwuXG4gICAgICBkZWxldGUgdGhpcy5fc291cmNlc0NvbnRlbnRzW3V0aWwudG9TZXRTdHJpbmcoc291cmNlKV07XG4gICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5fc291cmNlc0NvbnRlbnRzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fc291cmNlc0NvbnRlbnRzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbi8qKlxuICogQXBwbGllcyB0aGUgbWFwcGluZ3Mgb2YgYSBzdWItc291cmNlLW1hcCBmb3IgYSBzcGVjaWZpYyBzb3VyY2UgZmlsZSB0byB0aGVcbiAqIHNvdXJjZSBtYXAgYmVpbmcgZ2VuZXJhdGVkLiBFYWNoIG1hcHBpbmcgdG8gdGhlIHN1cHBsaWVkIHNvdXJjZSBmaWxlIGlzXG4gKiByZXdyaXR0ZW4gdXNpbmcgdGhlIHN1cHBsaWVkIHNvdXJjZSBtYXAuIE5vdGU6IFRoZSByZXNvbHV0aW9uIGZvciB0aGVcbiAqIHJlc3VsdGluZyBtYXBwaW5ncyBpcyB0aGUgbWluaW1pdW0gb2YgdGhpcyBtYXAgYW5kIHRoZSBzdXBwbGllZCBtYXAuXG4gKlxuICogQHBhcmFtIGFTb3VyY2VNYXBDb25zdW1lciBUaGUgc291cmNlIG1hcCB0byBiZSBhcHBsaWVkLlxuICogQHBhcmFtIGFTb3VyY2VGaWxlIE9wdGlvbmFsLiBUaGUgZmlsZW5hbWUgb2YgdGhlIHNvdXJjZSBmaWxlLlxuICogICAgICAgIElmIG9taXR0ZWQsIFNvdXJjZU1hcENvbnN1bWVyJ3MgZmlsZSBwcm9wZXJ0eSB3aWxsIGJlIHVzZWQuXG4gKiBAcGFyYW0gYVNvdXJjZU1hcFBhdGggT3B0aW9uYWwuIFRoZSBkaXJuYW1lIG9mIHRoZSBwYXRoIHRvIHRoZSBzb3VyY2UgbWFwXG4gKiAgICAgICAgdG8gYmUgYXBwbGllZC4gSWYgcmVsYXRpdmUsIGl0IGlzIHJlbGF0aXZlIHRvIHRoZSBTb3VyY2VNYXBDb25zdW1lci5cbiAqICAgICAgICBUaGlzIHBhcmFtZXRlciBpcyBuZWVkZWQgd2hlbiB0aGUgdHdvIHNvdXJjZSBtYXBzIGFyZW4ndCBpbiB0aGUgc2FtZVxuICogICAgICAgIGRpcmVjdG9yeSwgYW5kIHRoZSBzb3VyY2UgbWFwIHRvIGJlIGFwcGxpZWQgY29udGFpbnMgcmVsYXRpdmUgc291cmNlXG4gKiAgICAgICAgcGF0aHMuIElmIHNvLCB0aG9zZSByZWxhdGl2ZSBzb3VyY2UgcGF0aHMgbmVlZCB0byBiZSByZXdyaXR0ZW5cbiAqICAgICAgICByZWxhdGl2ZSB0byB0aGUgU291cmNlTWFwR2VuZXJhdG9yLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLmFwcGx5U291cmNlTWFwID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX2FwcGx5U291cmNlTWFwKGFTb3VyY2VNYXBDb25zdW1lciwgYVNvdXJjZUZpbGUsIGFTb3VyY2VNYXBQYXRoKSB7XG4gICAgdmFyIHNvdXJjZUZpbGUgPSBhU291cmNlRmlsZTtcbiAgICAvLyBJZiBhU291cmNlRmlsZSBpcyBvbWl0dGVkLCB3ZSB3aWxsIHVzZSB0aGUgZmlsZSBwcm9wZXJ0eSBvZiB0aGUgU291cmNlTWFwXG4gICAgaWYgKGFTb3VyY2VGaWxlID09IG51bGwpIHtcbiAgICAgIGlmIChhU291cmNlTWFwQ29uc3VtZXIuZmlsZSA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5hcHBseVNvdXJjZU1hcCByZXF1aXJlcyBlaXRoZXIgYW4gZXhwbGljaXQgc291cmNlIGZpbGUsICcgK1xuICAgICAgICAgICdvciB0aGUgc291cmNlIG1hcFxcJ3MgXCJmaWxlXCIgcHJvcGVydHkuIEJvdGggd2VyZSBvbWl0dGVkLidcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHNvdXJjZUZpbGUgPSBhU291cmNlTWFwQ29uc3VtZXIuZmlsZTtcbiAgICB9XG4gICAgdmFyIHNvdXJjZVJvb3QgPSB0aGlzLl9zb3VyY2VSb290O1xuICAgIC8vIE1ha2UgXCJzb3VyY2VGaWxlXCIgcmVsYXRpdmUgaWYgYW4gYWJzb2x1dGUgVXJsIGlzIHBhc3NlZC5cbiAgICBpZiAoc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICBzb3VyY2VGaWxlID0gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBzb3VyY2VGaWxlKTtcbiAgICB9XG4gICAgLy8gQXBwbHlpbmcgdGhlIFNvdXJjZU1hcCBjYW4gYWRkIGFuZCByZW1vdmUgaXRlbXMgZnJvbSB0aGUgc291cmNlcyBhbmRcbiAgICAvLyB0aGUgbmFtZXMgYXJyYXkuXG4gICAgdmFyIG5ld1NvdXJjZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgICB2YXIgbmV3TmFtZXMgPSBuZXcgQXJyYXlTZXQoKTtcblxuICAgIC8vIEZpbmQgbWFwcGluZ3MgZm9yIHRoZSBcInNvdXJjZUZpbGVcIlxuICAgIHRoaXMuX21hcHBpbmdzLnVuc29ydGVkRm9yRWFjaChmdW5jdGlvbiAobWFwcGluZykge1xuICAgICAgaWYgKG1hcHBpbmcuc291cmNlID09PSBzb3VyY2VGaWxlICYmIG1hcHBpbmcub3JpZ2luYWxMaW5lICE9IG51bGwpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaXQgY2FuIGJlIG1hcHBlZCBieSB0aGUgc291cmNlIG1hcCwgdGhlbiB1cGRhdGUgdGhlIG1hcHBpbmcuXG4gICAgICAgIHZhciBvcmlnaW5hbCA9IGFTb3VyY2VNYXBDb25zdW1lci5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICAgICAgICBsaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgICBjb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW5cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcmlnaW5hbC5zb3VyY2UgIT0gbnVsbCkge1xuICAgICAgICAgIC8vIENvcHkgbWFwcGluZ1xuICAgICAgICAgIG1hcHBpbmcuc291cmNlID0gb3JpZ2luYWwuc291cmNlO1xuICAgICAgICAgIGlmIChhU291cmNlTWFwUGF0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IHV0aWwuam9pbihhU291cmNlTWFwUGF0aCwgbWFwcGluZy5zb3VyY2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1hcHBpbmcuc291cmNlID0gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBtYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxMaW5lID0gb3JpZ2luYWwubGluZTtcbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uID0gb3JpZ2luYWwuY29sdW1uO1xuICAgICAgICAgIGlmIChvcmlnaW5hbC5uYW1lICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1hcHBpbmcubmFtZSA9IG9yaWdpbmFsLm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBzb3VyY2UgPSBtYXBwaW5nLnNvdXJjZTtcbiAgICAgIGlmIChzb3VyY2UgIT0gbnVsbCAmJiAhbmV3U291cmNlcy5oYXMoc291cmNlKSkge1xuICAgICAgICBuZXdTb3VyY2VzLmFkZChzb3VyY2UpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmFtZSA9IG1hcHBpbmcubmFtZTtcbiAgICAgIGlmIChuYW1lICE9IG51bGwgJiYgIW5ld05hbWVzLmhhcyhuYW1lKSkge1xuICAgICAgICBuZXdOYW1lcy5hZGQobmFtZSk7XG4gICAgICB9XG5cbiAgICB9LCB0aGlzKTtcbiAgICB0aGlzLl9zb3VyY2VzID0gbmV3U291cmNlcztcbiAgICB0aGlzLl9uYW1lcyA9IG5ld05hbWVzO1xuXG4gICAgLy8gQ29weSBzb3VyY2VzQ29udGVudHMgb2YgYXBwbGllZCBtYXAuXG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlRmlsZSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlQ29udGVudEZvcihzb3VyY2VGaWxlKTtcbiAgICAgIGlmIChjb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGFTb3VyY2VNYXBQYXRoICE9IG51bGwpIHtcbiAgICAgICAgICBzb3VyY2VGaWxlID0gdXRpbC5qb2luKGFTb3VyY2VNYXBQYXRoLCBzb3VyY2VGaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgICAgc291cmNlRmlsZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTb3VyY2VDb250ZW50KHNvdXJjZUZpbGUsIGNvbnRlbnQpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9O1xuXG4vKipcbiAqIEEgbWFwcGluZyBjYW4gaGF2ZSBvbmUgb2YgdGhlIHRocmVlIGxldmVscyBvZiBkYXRhOlxuICpcbiAqICAgMS4gSnVzdCB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9uLlxuICogICAyLiBUaGUgR2VuZXJhdGVkIHBvc2l0aW9uLCBvcmlnaW5hbCBwb3NpdGlvbiwgYW5kIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgMy4gR2VuZXJhdGVkIGFuZCBvcmlnaW5hbCBwb3NpdGlvbiwgb3JpZ2luYWwgc291cmNlLCBhcyB3ZWxsIGFzIGEgbmFtZVxuICogICAgICB0b2tlbi5cbiAqXG4gKiBUbyBtYWludGFpbiBjb25zaXN0ZW5jeSwgd2UgdmFsaWRhdGUgdGhhdCBhbnkgbmV3IG1hcHBpbmcgYmVpbmcgYWRkZWQgZmFsbHNcbiAqIGluIHRvIG9uZSBvZiB0aGVzZSBjYXRlZ29yaWVzLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLl92YWxpZGF0ZU1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfdmFsaWRhdGVNYXBwaW5nKGFHZW5lcmF0ZWQsIGFPcmlnaW5hbCwgYVNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhTmFtZSkge1xuICAgIGlmIChhR2VuZXJhdGVkICYmICdsaW5lJyBpbiBhR2VuZXJhdGVkICYmICdjb2x1bW4nIGluIGFHZW5lcmF0ZWRcbiAgICAgICAgJiYgYUdlbmVyYXRlZC5saW5lID4gMCAmJiBhR2VuZXJhdGVkLmNvbHVtbiA+PSAwXG4gICAgICAgICYmICFhT3JpZ2luYWwgJiYgIWFTb3VyY2UgJiYgIWFOYW1lKSB7XG4gICAgICAvLyBDYXNlIDEuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsc2UgaWYgKGFHZW5lcmF0ZWQgJiYgJ2xpbmUnIGluIGFHZW5lcmF0ZWQgJiYgJ2NvbHVtbicgaW4gYUdlbmVyYXRlZFxuICAgICAgICAgICAgICYmIGFPcmlnaW5hbCAmJiAnbGluZScgaW4gYU9yaWdpbmFsICYmICdjb2x1bW4nIGluIGFPcmlnaW5hbFxuICAgICAgICAgICAgICYmIGFHZW5lcmF0ZWQubGluZSA+IDAgJiYgYUdlbmVyYXRlZC5jb2x1bW4gPj0gMFxuICAgICAgICAgICAgICYmIGFPcmlnaW5hbC5saW5lID4gMCAmJiBhT3JpZ2luYWwuY29sdW1uID49IDBcbiAgICAgICAgICAgICAmJiBhU291cmNlKSB7XG4gICAgICAvLyBDYXNlcyAyIGFuZCAzLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBtYXBwaW5nOiAnICsgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBnZW5lcmF0ZWQ6IGFHZW5lcmF0ZWQsXG4gICAgICAgIHNvdXJjZTogYVNvdXJjZSxcbiAgICAgICAgb3JpZ2luYWw6IGFPcmlnaW5hbCxcbiAgICAgICAgbmFtZTogYU5hbWVcbiAgICAgIH0pKTtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBhY2N1bXVsYXRlZCBtYXBwaW5ncyBpbiB0byB0aGUgc3RyZWFtIG9mIGJhc2UgNjQgVkxRc1xuICogc3BlY2lmaWVkIGJ5IHRoZSBzb3VyY2UgbWFwIGZvcm1hdC5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fc2VyaWFsaXplTWFwcGluZ3MgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3Jfc2VyaWFsaXplTWFwcGluZ3MoKSB7XG4gICAgdmFyIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNHZW5lcmF0ZWRMaW5lID0gMTtcbiAgICB2YXIgcHJldmlvdXNPcmlnaW5hbENvbHVtbiA9IDA7XG4gICAgdmFyIHByZXZpb3VzT3JpZ2luYWxMaW5lID0gMDtcbiAgICB2YXIgcHJldmlvdXNOYW1lID0gMDtcbiAgICB2YXIgcHJldmlvdXNTb3VyY2UgPSAwO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgbmV4dDtcbiAgICB2YXIgbWFwcGluZztcbiAgICB2YXIgbmFtZUlkeDtcbiAgICB2YXIgc291cmNlSWR4O1xuXG4gICAgdmFyIG1hcHBpbmdzID0gdGhpcy5fbWFwcGluZ3MudG9BcnJheSgpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtYXBwaW5ncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbWFwcGluZyA9IG1hcHBpbmdzW2ldO1xuICAgICAgbmV4dCA9ICcnXG5cbiAgICAgIGlmIChtYXBwaW5nLmdlbmVyYXRlZExpbmUgIT09IHByZXZpb3VzR2VuZXJhdGVkTGluZSkge1xuICAgICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgICAgIHdoaWxlIChtYXBwaW5nLmdlbmVyYXRlZExpbmUgIT09IHByZXZpb3VzR2VuZXJhdGVkTGluZSkge1xuICAgICAgICAgIG5leHQgKz0gJzsnO1xuICAgICAgICAgIHByZXZpb3VzR2VuZXJhdGVkTGluZSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgaWYgKCF1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkKG1hcHBpbmcsIG1hcHBpbmdzW2kgLSAxXSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXh0ICs9ICcsJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBuZXh0ICs9IGJhc2U2NFZMUS5lbmNvZGUobWFwcGluZy5nZW5lcmF0ZWRDb2x1bW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcblxuICAgICAgaWYgKG1hcHBpbmcuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgc291cmNlSWR4ID0gdGhpcy5fc291cmNlcy5pbmRleE9mKG1hcHBpbmcuc291cmNlKTtcbiAgICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKHNvdXJjZUlkeCAtIHByZXZpb3VzU291cmNlKTtcbiAgICAgICAgcHJldmlvdXNTb3VyY2UgPSBzb3VyY2VJZHg7XG5cbiAgICAgICAgLy8gbGluZXMgYXJlIHN0b3JlZCAwLWJhc2VkIGluIFNvdXJjZU1hcCBzcGVjIHZlcnNpb24gM1xuICAgICAgICBuZXh0ICs9IGJhc2U2NFZMUS5lbmNvZGUobWFwcGluZy5vcmlnaW5hbExpbmUgLSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gcHJldmlvdXNPcmlnaW5hbExpbmUpO1xuICAgICAgICBwcmV2aW91c09yaWdpbmFsTGluZSA9IG1hcHBpbmcub3JpZ2luYWxMaW5lIC0gMTtcblxuICAgICAgICBuZXh0ICs9IGJhc2U2NFZMUS5lbmNvZGUobWFwcGluZy5vcmlnaW5hbENvbHVtblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIHByZXZpb3VzT3JpZ2luYWxDb2x1bW4pO1xuICAgICAgICBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gbWFwcGluZy5vcmlnaW5hbENvbHVtbjtcblxuICAgICAgICBpZiAobWFwcGluZy5uYW1lICE9IG51bGwpIHtcbiAgICAgICAgICBuYW1lSWR4ID0gdGhpcy5fbmFtZXMuaW5kZXhPZihtYXBwaW5nLm5hbWUpO1xuICAgICAgICAgIG5leHQgKz0gYmFzZTY0VkxRLmVuY29kZShuYW1lSWR4IC0gcHJldmlvdXNOYW1lKTtcbiAgICAgICAgICBwcmV2aW91c05hbWUgPSBuYW1lSWR4O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdCArPSBuZXh0O1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cblNvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUuX2dlbmVyYXRlU291cmNlc0NvbnRlbnQgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfZ2VuZXJhdGVTb3VyY2VzQ29udGVudChhU291cmNlcywgYVNvdXJjZVJvb3QpIHtcbiAgICByZXR1cm4gYVNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIGlmICghdGhpcy5fc291cmNlc0NvbnRlbnRzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKGFTb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgc291cmNlID0gdXRpbC5yZWxhdGl2ZShhU291cmNlUm9vdCwgc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBrZXkgPSB1dGlsLnRvU2V0U3RyaW5nKHNvdXJjZSk7XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuX3NvdXJjZXNDb250ZW50cywga2V5KVxuICAgICAgICA/IHRoaXMuX3NvdXJjZXNDb250ZW50c1trZXldXG4gICAgICAgIDogbnVsbDtcbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuLyoqXG4gKiBFeHRlcm5hbGl6ZSB0aGUgc291cmNlIG1hcC5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS50b0pTT04gPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfdG9KU09OKCkge1xuICAgIHZhciBtYXAgPSB7XG4gICAgICB2ZXJzaW9uOiB0aGlzLl92ZXJzaW9uLFxuICAgICAgc291cmNlczogdGhpcy5fc291cmNlcy50b0FycmF5KCksXG4gICAgICBuYW1lczogdGhpcy5fbmFtZXMudG9BcnJheSgpLFxuICAgICAgbWFwcGluZ3M6IHRoaXMuX3NlcmlhbGl6ZU1hcHBpbmdzKClcbiAgICB9O1xuICAgIGlmICh0aGlzLl9maWxlICE9IG51bGwpIHtcbiAgICAgIG1hcC5maWxlID0gdGhpcy5fZmlsZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgbWFwLnNvdXJjZVJvb3QgPSB0aGlzLl9zb3VyY2VSb290O1xuICAgIH1cbiAgICBpZiAodGhpcy5fc291cmNlc0NvbnRlbnRzKSB7XG4gICAgICBtYXAuc291cmNlc0NvbnRlbnQgPSB0aGlzLl9nZW5lcmF0ZVNvdXJjZXNDb250ZW50KG1hcC5zb3VyY2VzLCBtYXAuc291cmNlUm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcDtcbiAgfTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIHNvdXJjZSBtYXAgYmVpbmcgZ2VuZXJhdGVkIHRvIGEgc3RyaW5nLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLnRvU3RyaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3RvU3RyaW5nKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnRvSlNPTigpKTtcbiAgfTtcblxuZXhwb3J0cy5Tb3VyY2VNYXBHZW5lcmF0b3IgPSBTb3VyY2VNYXBHZW5lcmF0b3I7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciBTb3VyY2VNYXBHZW5lcmF0b3IgPSByZXF1aXJlKCcuL3NvdXJjZS1tYXAtZ2VuZXJhdG9yJykuU291cmNlTWFwR2VuZXJhdG9yO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLy8gTWF0Y2hlcyBhIFdpbmRvd3Mtc3R5bGUgYFxcclxcbmAgbmV3bGluZSBvciBhIGBcXG5gIG5ld2xpbmUgdXNlZCBieSBhbGwgb3RoZXJcbi8vIG9wZXJhdGluZyBzeXN0ZW1zIHRoZXNlIGRheXMgKGNhcHR1cmluZyB0aGUgcmVzdWx0KS5cbnZhciBSRUdFWF9ORVdMSU5FID0gLyhcXHI/XFxuKS87XG5cbi8vIE5ld2xpbmUgY2hhcmFjdGVyIGNvZGUgZm9yIGNoYXJDb2RlQXQoKSBjb21wYXJpc29uc1xudmFyIE5FV0xJTkVfQ09ERSA9IDEwO1xuXG4vLyBQcml2YXRlIHN5bWJvbCBmb3IgaWRlbnRpZnlpbmcgYFNvdXJjZU5vZGVgcyB3aGVuIG11bHRpcGxlIHZlcnNpb25zIG9mXG4vLyB0aGUgc291cmNlLW1hcCBsaWJyYXJ5IGFyZSBsb2FkZWQuIFRoaXMgTVVTVCBOT1QgQ0hBTkdFIGFjcm9zc1xuLy8gdmVyc2lvbnMhXG52YXIgaXNTb3VyY2VOb2RlID0gXCIkJCRpc1NvdXJjZU5vZGUkJCRcIjtcblxuLyoqXG4gKiBTb3VyY2VOb2RlcyBwcm92aWRlIGEgd2F5IHRvIGFic3RyYWN0IG92ZXIgaW50ZXJwb2xhdGluZy9jb25jYXRlbmF0aW5nXG4gKiBzbmlwcGV0cyBvZiBnZW5lcmF0ZWQgSmF2YVNjcmlwdCBzb3VyY2UgY29kZSB3aGlsZSBtYWludGFpbmluZyB0aGUgbGluZSBhbmRcbiAqIGNvbHVtbiBpbmZvcm1hdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIG9yaWdpbmFsIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwYXJhbSBhTGluZSBUaGUgb3JpZ2luYWwgbGluZSBudW1iZXIuXG4gKiBAcGFyYW0gYUNvbHVtbiBUaGUgb3JpZ2luYWwgY29sdW1uIG51bWJlci5cbiAqIEBwYXJhbSBhU291cmNlIFRoZSBvcmlnaW5hbCBzb3VyY2UncyBmaWxlbmFtZS5cbiAqIEBwYXJhbSBhQ2h1bmtzIE9wdGlvbmFsLiBBbiBhcnJheSBvZiBzdHJpbmdzIHdoaWNoIGFyZSBzbmlwcGV0cyBvZlxuICogICAgICAgIGdlbmVyYXRlZCBKUywgb3Igb3RoZXIgU291cmNlTm9kZXMuXG4gKiBAcGFyYW0gYU5hbWUgVGhlIG9yaWdpbmFsIGlkZW50aWZpZXIuXG4gKi9cbmZ1bmN0aW9uIFNvdXJjZU5vZGUoYUxpbmUsIGFDb2x1bW4sIGFTb3VyY2UsIGFDaHVua3MsIGFOYW1lKSB7XG4gIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgdGhpcy5zb3VyY2VDb250ZW50cyA9IHt9O1xuICB0aGlzLmxpbmUgPSBhTGluZSA9PSBudWxsID8gbnVsbCA6IGFMaW5lO1xuICB0aGlzLmNvbHVtbiA9IGFDb2x1bW4gPT0gbnVsbCA/IG51bGwgOiBhQ29sdW1uO1xuICB0aGlzLnNvdXJjZSA9IGFTb3VyY2UgPT0gbnVsbCA/IG51bGwgOiBhU291cmNlO1xuICB0aGlzLm5hbWUgPSBhTmFtZSA9PSBudWxsID8gbnVsbCA6IGFOYW1lO1xuICB0aGlzW2lzU291cmNlTm9kZV0gPSB0cnVlO1xuICBpZiAoYUNodW5rcyAhPSBudWxsKSB0aGlzLmFkZChhQ2h1bmtzKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgU291cmNlTm9kZSBmcm9tIGdlbmVyYXRlZCBjb2RlIGFuZCBhIFNvdXJjZU1hcENvbnN1bWVyLlxuICpcbiAqIEBwYXJhbSBhR2VuZXJhdGVkQ29kZSBUaGUgZ2VuZXJhdGVkIGNvZGVcbiAqIEBwYXJhbSBhU291cmNlTWFwQ29uc3VtZXIgVGhlIFNvdXJjZU1hcCBmb3IgdGhlIGdlbmVyYXRlZCBjb2RlXG4gKiBAcGFyYW0gYVJlbGF0aXZlUGF0aCBPcHRpb25hbC4gVGhlIHBhdGggdGhhdCByZWxhdGl2ZSBzb3VyY2VzIGluIHRoZVxuICogICAgICAgIFNvdXJjZU1hcENvbnN1bWVyIHNob3VsZCBiZSByZWxhdGl2ZSB0by5cbiAqL1xuU291cmNlTm9kZS5mcm9tU3RyaW5nV2l0aFNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU5vZGVfZnJvbVN0cmluZ1dpdGhTb3VyY2VNYXAoYUdlbmVyYXRlZENvZGUsIGFTb3VyY2VNYXBDb25zdW1lciwgYVJlbGF0aXZlUGF0aCkge1xuICAgIC8vIFRoZSBTb3VyY2VOb2RlIHdlIHdhbnQgdG8gZmlsbCB3aXRoIHRoZSBnZW5lcmF0ZWQgY29kZVxuICAgIC8vIGFuZCB0aGUgU291cmNlTWFwXG4gICAgdmFyIG5vZGUgPSBuZXcgU291cmNlTm9kZSgpO1xuXG4gICAgLy8gQWxsIGV2ZW4gaW5kaWNlcyBvZiB0aGlzIGFycmF5IGFyZSBvbmUgbGluZSBvZiB0aGUgZ2VuZXJhdGVkIGNvZGUsXG4gICAgLy8gd2hpbGUgYWxsIG9kZCBpbmRpY2VzIGFyZSB0aGUgbmV3bGluZXMgYmV0d2VlbiB0d28gYWRqYWNlbnQgbGluZXNcbiAgICAvLyAoc2luY2UgYFJFR0VYX05FV0xJTkVgIGNhcHR1cmVzIGl0cyBtYXRjaCkuXG4gICAgLy8gUHJvY2Vzc2VkIGZyYWdtZW50cyBhcmUgcmVtb3ZlZCBmcm9tIHRoaXMgYXJyYXksIGJ5IGNhbGxpbmcgYHNoaWZ0TmV4dExpbmVgLlxuICAgIHZhciByZW1haW5pbmdMaW5lcyA9IGFHZW5lcmF0ZWRDb2RlLnNwbGl0KFJFR0VYX05FV0xJTkUpO1xuICAgIHZhciBzaGlmdE5leHRMaW5lID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGluZUNvbnRlbnRzID0gcmVtYWluaW5nTGluZXMuc2hpZnQoKTtcbiAgICAgIC8vIFRoZSBsYXN0IGxpbmUgb2YgYSBmaWxlIG1pZ2h0IG5vdCBoYXZlIGEgbmV3bGluZS5cbiAgICAgIHZhciBuZXdMaW5lID0gcmVtYWluaW5nTGluZXMuc2hpZnQoKSB8fCBcIlwiO1xuICAgICAgcmV0dXJuIGxpbmVDb250ZW50cyArIG5ld0xpbmU7XG4gICAgfTtcblxuICAgIC8vIFdlIG5lZWQgdG8gcmVtZW1iZXIgdGhlIHBvc2l0aW9uIG9mIFwicmVtYWluaW5nTGluZXNcIlxuICAgIHZhciBsYXN0R2VuZXJhdGVkTGluZSA9IDEsIGxhc3RHZW5lcmF0ZWRDb2x1bW4gPSAwO1xuXG4gICAgLy8gVGhlIGdlbmVyYXRlIFNvdXJjZU5vZGVzIHdlIG5lZWQgYSBjb2RlIHJhbmdlLlxuICAgIC8vIFRvIGV4dHJhY3QgaXQgY3VycmVudCBhbmQgbGFzdCBtYXBwaW5nIGlzIHVzZWQuXG4gICAgLy8gSGVyZSB3ZSBzdG9yZSB0aGUgbGFzdCBtYXBwaW5nLlxuICAgIHZhciBsYXN0TWFwcGluZyA9IG51bGw7XG5cbiAgICBhU291cmNlTWFwQ29uc3VtZXIuZWFjaE1hcHBpbmcoZnVuY3Rpb24gKG1hcHBpbmcpIHtcbiAgICAgIGlmIChsYXN0TWFwcGluZyAhPT0gbnVsbCkge1xuICAgICAgICAvLyBXZSBhZGQgdGhlIGNvZGUgZnJvbSBcImxhc3RNYXBwaW5nXCIgdG8gXCJtYXBwaW5nXCI6XG4gICAgICAgIC8vIEZpcnN0IGNoZWNrIGlmIHRoZXJlIGlzIGEgbmV3IGxpbmUgaW4gYmV0d2Vlbi5cbiAgICAgICAgaWYgKGxhc3RHZW5lcmF0ZWRMaW5lIDwgbWFwcGluZy5nZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgICAgLy8gQXNzb2NpYXRlIGZpcnN0IGxpbmUgd2l0aCBcImxhc3RNYXBwaW5nXCJcbiAgICAgICAgICBhZGRNYXBwaW5nV2l0aENvZGUobGFzdE1hcHBpbmcsIHNoaWZ0TmV4dExpbmUoKSk7XG4gICAgICAgICAgbGFzdEdlbmVyYXRlZExpbmUrKztcbiAgICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgICAgICAgICAvLyBUaGUgcmVtYWluaW5nIGNvZGUgaXMgYWRkZWQgd2l0aG91dCBtYXBwaW5nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlcmUgaXMgbm8gbmV3IGxpbmUgaW4gYmV0d2Vlbi5cbiAgICAgICAgICAvLyBBc3NvY2lhdGUgdGhlIGNvZGUgYmV0d2VlbiBcImxhc3RHZW5lcmF0ZWRDb2x1bW5cIiBhbmRcbiAgICAgICAgICAvLyBcIm1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uXCIgd2l0aCBcImxhc3RNYXBwaW5nXCJcbiAgICAgICAgICB2YXIgbmV4dExpbmUgPSByZW1haW5pbmdMaW5lc1swXTtcbiAgICAgICAgICB2YXIgY29kZSA9IG5leHRMaW5lLnN1YnN0cigwLCBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbiAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEdlbmVyYXRlZENvbHVtbik7XG4gICAgICAgICAgcmVtYWluaW5nTGluZXNbMF0gPSBuZXh0TGluZS5zdWJzdHIobWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcbiAgICAgICAgICBhZGRNYXBwaW5nV2l0aENvZGUobGFzdE1hcHBpbmcsIGNvZGUpO1xuICAgICAgICAgIC8vIE5vIG1vcmUgcmVtYWluaW5nIGNvZGUsIGNvbnRpbnVlXG4gICAgICAgICAgbGFzdE1hcHBpbmcgPSBtYXBwaW5nO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gV2UgYWRkIHRoZSBnZW5lcmF0ZWQgY29kZSB1bnRpbCB0aGUgZmlyc3QgbWFwcGluZ1xuICAgICAgLy8gdG8gdGhlIFNvdXJjZU5vZGUgd2l0aG91dCBhbnkgbWFwcGluZy5cbiAgICAgIC8vIEVhY2ggbGluZSBpcyBhZGRlZCBhcyBzZXBhcmF0ZSBzdHJpbmcuXG4gICAgICB3aGlsZSAobGFzdEdlbmVyYXRlZExpbmUgPCBtYXBwaW5nLmdlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgbm9kZS5hZGQoc2hpZnROZXh0TGluZSgpKTtcbiAgICAgICAgbGFzdEdlbmVyYXRlZExpbmUrKztcbiAgICAgIH1cbiAgICAgIGlmIChsYXN0R2VuZXJhdGVkQ29sdW1uIDwgbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4pIHtcbiAgICAgICAgdmFyIG5leHRMaW5lID0gcmVtYWluaW5nTGluZXNbMF07XG4gICAgICAgIG5vZGUuYWRkKG5leHRMaW5lLnN1YnN0cigwLCBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbikpO1xuICAgICAgICByZW1haW5pbmdMaW5lc1swXSA9IG5leHRMaW5lLnN1YnN0cihtYXBwaW5nLmdlbmVyYXRlZENvbHVtbik7XG4gICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcbiAgICAgIH1cbiAgICAgIGxhc3RNYXBwaW5nID0gbWFwcGluZztcbiAgICB9LCB0aGlzKTtcbiAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgbWFwcGluZ3MuXG4gICAgaWYgKHJlbWFpbmluZ0xpbmVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmIChsYXN0TWFwcGluZykge1xuICAgICAgICAvLyBBc3NvY2lhdGUgdGhlIHJlbWFpbmluZyBjb2RlIGluIHRoZSBjdXJyZW50IGxpbmUgd2l0aCBcImxhc3RNYXBwaW5nXCJcbiAgICAgICAgYWRkTWFwcGluZ1dpdGhDb2RlKGxhc3RNYXBwaW5nLCBzaGlmdE5leHRMaW5lKCkpO1xuICAgICAgfVxuICAgICAgLy8gYW5kIGFkZCB0aGUgcmVtYWluaW5nIGxpbmVzIHdpdGhvdXQgYW55IG1hcHBpbmdcbiAgICAgIG5vZGUuYWRkKHJlbWFpbmluZ0xpbmVzLmpvaW4oXCJcIikpO1xuICAgIH1cblxuICAgIC8vIENvcHkgc291cmNlc0NvbnRlbnQgaW50byBTb3VyY2VOb2RlXG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlRmlsZSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlQ29udGVudEZvcihzb3VyY2VGaWxlKTtcbiAgICAgIGlmIChjb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGFSZWxhdGl2ZVBhdGggIT0gbnVsbCkge1xuICAgICAgICAgIHNvdXJjZUZpbGUgPSB1dGlsLmpvaW4oYVJlbGF0aXZlUGF0aCwgc291cmNlRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5zZXRTb3VyY2VDb250ZW50KHNvdXJjZUZpbGUsIGNvbnRlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5vZGU7XG5cbiAgICBmdW5jdGlvbiBhZGRNYXBwaW5nV2l0aENvZGUobWFwcGluZywgY29kZSkge1xuICAgICAgaWYgKG1hcHBpbmcgPT09IG51bGwgfHwgbWFwcGluZy5zb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBub2RlLmFkZChjb2RlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhUmVsYXRpdmVQYXRoXG4gICAgICAgICAgPyB1dGlsLmpvaW4oYVJlbGF0aXZlUGF0aCwgbWFwcGluZy5zb3VyY2UpXG4gICAgICAgICAgOiBtYXBwaW5nLnNvdXJjZTtcbiAgICAgICAgbm9kZS5hZGQobmV3IFNvdXJjZU5vZGUobWFwcGluZy5vcmlnaW5hbExpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxDb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcGluZy5uYW1lKSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIEFkZCBhIGNodW5rIG9mIGdlbmVyYXRlZCBKUyB0byB0aGlzIHNvdXJjZSBub2RlLlxuICpcbiAqIEBwYXJhbSBhQ2h1bmsgQSBzdHJpbmcgc25pcHBldCBvZiBnZW5lcmF0ZWQgSlMgY29kZSwgYW5vdGhlciBpbnN0YW5jZSBvZlxuICogICAgICAgIFNvdXJjZU5vZGUsIG9yIGFuIGFycmF5IHdoZXJlIGVhY2ggbWVtYmVyIGlzIG9uZSBvZiB0aG9zZSB0aGluZ3MuXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfYWRkKGFDaHVuaykge1xuICBpZiAoQXJyYXkuaXNBcnJheShhQ2h1bmspKSB7XG4gICAgYUNodW5rLmZvckVhY2goZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgICB0aGlzLmFkZChjaHVuayk7XG4gICAgfSwgdGhpcyk7XG4gIH1cbiAgZWxzZSBpZiAoYUNodW5rW2lzU291cmNlTm9kZV0gfHwgdHlwZW9mIGFDaHVuayA9PT0gXCJzdHJpbmdcIikge1xuICAgIGlmIChhQ2h1bmspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChhQ2h1bmspO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgXCJFeHBlY3RlZCBhIFNvdXJjZU5vZGUsIHN0cmluZywgb3IgYW4gYXJyYXkgb2YgU291cmNlTm9kZXMgYW5kIHN0cmluZ3MuIEdvdCBcIiArIGFDaHVua1xuICAgICk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCBhIGNodW5rIG9mIGdlbmVyYXRlZCBKUyB0byB0aGUgYmVnaW5uaW5nIG9mIHRoaXMgc291cmNlIG5vZGUuXG4gKlxuICogQHBhcmFtIGFDaHVuayBBIHN0cmluZyBzbmlwcGV0IG9mIGdlbmVyYXRlZCBKUyBjb2RlLCBhbm90aGVyIGluc3RhbmNlIG9mXG4gKiAgICAgICAgU291cmNlTm9kZSwgb3IgYW4gYXJyYXkgd2hlcmUgZWFjaCBtZW1iZXIgaXMgb25lIG9mIHRob3NlIHRoaW5ncy5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUucHJlcGVuZCA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfcHJlcGVuZChhQ2h1bmspIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYUNodW5rKSkge1xuICAgIGZvciAodmFyIGkgPSBhQ2h1bmsubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0aGlzLnByZXBlbmQoYUNodW5rW2ldKTtcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAoYUNodW5rW2lzU291cmNlTm9kZV0gfHwgdHlwZW9mIGFDaHVuayA9PT0gXCJzdHJpbmdcIikge1xuICAgIHRoaXMuY2hpbGRyZW4udW5zaGlmdChhQ2h1bmspO1xuICB9XG4gIGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICBcIkV4cGVjdGVkIGEgU291cmNlTm9kZSwgc3RyaW5nLCBvciBhbiBhcnJheSBvZiBTb3VyY2VOb2RlcyBhbmQgc3RyaW5ncy4gR290IFwiICsgYUNodW5rXG4gICAgKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogV2FsayBvdmVyIHRoZSB0cmVlIG9mIEpTIHNuaXBwZXRzIGluIHRoaXMgbm9kZSBhbmQgaXRzIGNoaWxkcmVuLiBUaGVcbiAqIHdhbGtpbmcgZnVuY3Rpb24gaXMgY2FsbGVkIG9uY2UgZm9yIGVhY2ggc25pcHBldCBvZiBKUyBhbmQgaXMgcGFzc2VkIHRoYXRcbiAqIHNuaXBwZXQgYW5kIHRoZSBpdHMgb3JpZ2luYWwgYXNzb2NpYXRlZCBzb3VyY2UncyBsaW5lL2NvbHVtbiBsb2NhdGlvbi5cbiAqXG4gKiBAcGFyYW0gYUZuIFRoZSB0cmF2ZXJzYWwgZnVuY3Rpb24uXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLndhbGsgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX3dhbGsoYUZuKSB7XG4gIHZhciBjaHVuaztcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjaHVuayA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgaWYgKGNodW5rW2lzU291cmNlTm9kZV0pIHtcbiAgICAgIGNodW5rLndhbGsoYUZuKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoY2h1bmsgIT09ICcnKSB7XG4gICAgICAgIGFGbihjaHVuaywgeyBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgbGluZTogdGhpcy5saW5lLFxuICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiB0aGlzLmNvbHVtbixcbiAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogTGlrZSBgU3RyaW5nLnByb3RvdHlwZS5qb2luYCBleGNlcHQgZm9yIFNvdXJjZU5vZGVzLiBJbnNlcnRzIGBhU3RyYCBiZXR3ZWVuXG4gKiBlYWNoIG9mIGB0aGlzLmNoaWxkcmVuYC5cbiAqXG4gKiBAcGFyYW0gYVNlcCBUaGUgc2VwYXJhdG9yLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS5qb2luID0gZnVuY3Rpb24gU291cmNlTm9kZV9qb2luKGFTZXApIHtcbiAgdmFyIG5ld0NoaWxkcmVuO1xuICB2YXIgaTtcbiAgdmFyIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICBpZiAobGVuID4gMCkge1xuICAgIG5ld0NoaWxkcmVuID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbi0xOyBpKyspIHtcbiAgICAgIG5ld0NoaWxkcmVuLnB1c2godGhpcy5jaGlsZHJlbltpXSk7XG4gICAgICBuZXdDaGlsZHJlbi5wdXNoKGFTZXApO1xuICAgIH1cbiAgICBuZXdDaGlsZHJlbi5wdXNoKHRoaXMuY2hpbGRyZW5baV0pO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBuZXdDaGlsZHJlbjtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2FsbCBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2Ugb24gdGhlIHZlcnkgcmlnaHQtbW9zdCBzb3VyY2Ugc25pcHBldC4gVXNlZnVsXG4gKiBmb3IgdHJpbW1pbmcgd2hpdGVzcGFjZSBmcm9tIHRoZSBlbmQgb2YgYSBzb3VyY2Ugbm9kZSwgZXRjLlxuICpcbiAqIEBwYXJhbSBhUGF0dGVybiBUaGUgcGF0dGVybiB0byByZXBsYWNlLlxuICogQHBhcmFtIGFSZXBsYWNlbWVudCBUaGUgdGhpbmcgdG8gcmVwbGFjZSB0aGUgcGF0dGVybiB3aXRoLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS5yZXBsYWNlUmlnaHQgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX3JlcGxhY2VSaWdodChhUGF0dGVybiwgYVJlcGxhY2VtZW50KSB7XG4gIHZhciBsYXN0Q2hpbGQgPSB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG4gIGlmIChsYXN0Q2hpbGRbaXNTb3VyY2VOb2RlXSkge1xuICAgIGxhc3RDaGlsZC5yZXBsYWNlUmlnaHQoYVBhdHRlcm4sIGFSZXBsYWNlbWVudCk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGxhc3RDaGlsZCA9PT0gJ3N0cmluZycpIHtcbiAgICB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV0gPSBsYXN0Q2hpbGQucmVwbGFjZShhUGF0dGVybiwgYVJlcGxhY2VtZW50KTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goJycucmVwbGFjZShhUGF0dGVybiwgYVJlcGxhY2VtZW50KSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgc291cmNlIGNvbnRlbnQgZm9yIGEgc291cmNlIGZpbGUuIFRoaXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgU291cmNlTWFwR2VuZXJhdG9yXG4gKiBpbiB0aGUgc291cmNlc0NvbnRlbnQgZmllbGQuXG4gKlxuICogQHBhcmFtIGFTb3VyY2VGaWxlIFRoZSBmaWxlbmFtZSBvZiB0aGUgc291cmNlIGZpbGVcbiAqIEBwYXJhbSBhU291cmNlQ29udGVudCBUaGUgY29udGVudCBvZiB0aGUgc291cmNlIGZpbGVcbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUuc2V0U291cmNlQ29udGVudCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU5vZGVfc2V0U291cmNlQ29udGVudChhU291cmNlRmlsZSwgYVNvdXJjZUNvbnRlbnQpIHtcbiAgICB0aGlzLnNvdXJjZUNvbnRlbnRzW3V0aWwudG9TZXRTdHJpbmcoYVNvdXJjZUZpbGUpXSA9IGFTb3VyY2VDb250ZW50O1xuICB9O1xuXG4vKipcbiAqIFdhbGsgb3ZlciB0aGUgdHJlZSBvZiBTb3VyY2VOb2Rlcy4gVGhlIHdhbGtpbmcgZnVuY3Rpb24gaXMgY2FsbGVkIGZvciBlYWNoXG4gKiBzb3VyY2UgZmlsZSBjb250ZW50IGFuZCBpcyBwYXNzZWQgdGhlIGZpbGVuYW1lIGFuZCBzb3VyY2UgY29udGVudC5cbiAqXG4gKiBAcGFyYW0gYUZuIFRoZSB0cmF2ZXJzYWwgZnVuY3Rpb24uXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLndhbGtTb3VyY2VDb250ZW50cyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU5vZGVfd2Fsa1NvdXJjZUNvbnRlbnRzKGFGbikge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5jaGlsZHJlbltpXVtpc1NvdXJjZU5vZGVdKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5baV0ud2Fsa1NvdXJjZUNvbnRlbnRzKGFGbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZXMgPSBPYmplY3Qua2V5cyh0aGlzLnNvdXJjZUNvbnRlbnRzKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc291cmNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYUZuKHV0aWwuZnJvbVNldFN0cmluZyhzb3VyY2VzW2ldKSwgdGhpcy5zb3VyY2VDb250ZW50c1tzb3VyY2VzW2ldXSk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFJldHVybiB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgc291cmNlIG5vZGUuIFdhbGtzIG92ZXIgdGhlIHRyZWVcbiAqIGFuZCBjb25jYXRlbmF0ZXMgYWxsIHRoZSB2YXJpb3VzIHNuaXBwZXRzIHRvZ2V0aGVyIHRvIG9uZSBzdHJpbmcuXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gU291cmNlTm9kZV90b1N0cmluZygpIHtcbiAgdmFyIHN0ciA9IFwiXCI7XG4gIHRoaXMud2FsayhmdW5jdGlvbiAoY2h1bmspIHtcbiAgICBzdHIgKz0gY2h1bms7XG4gIH0pO1xuICByZXR1cm4gc3RyO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBzb3VyY2Ugbm9kZSBhbG9uZyB3aXRoIGEgc291cmNlXG4gKiBtYXAuXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLnRvU3RyaW5nV2l0aFNvdXJjZU1hcCA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfdG9TdHJpbmdXaXRoU291cmNlTWFwKGFBcmdzKSB7XG4gIHZhciBnZW5lcmF0ZWQgPSB7XG4gICAgY29kZTogXCJcIixcbiAgICBsaW5lOiAxLFxuICAgIGNvbHVtbjogMFxuICB9O1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcihhQXJncyk7XG4gIHZhciBzb3VyY2VNYXBwaW5nQWN0aXZlID0gZmFsc2U7XG4gIHZhciBsYXN0T3JpZ2luYWxTb3VyY2UgPSBudWxsO1xuICB2YXIgbGFzdE9yaWdpbmFsTGluZSA9IG51bGw7XG4gIHZhciBsYXN0T3JpZ2luYWxDb2x1bW4gPSBudWxsO1xuICB2YXIgbGFzdE9yaWdpbmFsTmFtZSA9IG51bGw7XG4gIHRoaXMud2FsayhmdW5jdGlvbiAoY2h1bmssIG9yaWdpbmFsKSB7XG4gICAgZ2VuZXJhdGVkLmNvZGUgKz0gY2h1bms7XG4gICAgaWYgKG9yaWdpbmFsLnNvdXJjZSAhPT0gbnVsbFxuICAgICAgICAmJiBvcmlnaW5hbC5saW5lICE9PSBudWxsXG4gICAgICAgICYmIG9yaWdpbmFsLmNvbHVtbiAhPT0gbnVsbCkge1xuICAgICAgaWYobGFzdE9yaWdpbmFsU291cmNlICE9PSBvcmlnaW5hbC5zb3VyY2VcbiAgICAgICAgIHx8IGxhc3RPcmlnaW5hbExpbmUgIT09IG9yaWdpbmFsLmxpbmVcbiAgICAgICAgIHx8IGxhc3RPcmlnaW5hbENvbHVtbiAhPT0gb3JpZ2luYWwuY29sdW1uXG4gICAgICAgICB8fCBsYXN0T3JpZ2luYWxOYW1lICE9PSBvcmlnaW5hbC5uYW1lKSB7XG4gICAgICAgIG1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICBzb3VyY2U6IG9yaWdpbmFsLnNvdXJjZSxcbiAgICAgICAgICBvcmlnaW5hbDoge1xuICAgICAgICAgICAgbGluZTogb3JpZ2luYWwubGluZSxcbiAgICAgICAgICAgIGNvbHVtbjogb3JpZ2luYWwuY29sdW1uXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZW5lcmF0ZWQ6IHtcbiAgICAgICAgICAgIGxpbmU6IGdlbmVyYXRlZC5saW5lLFxuICAgICAgICAgICAgY29sdW1uOiBnZW5lcmF0ZWQuY29sdW1uXG4gICAgICAgICAgfSxcbiAgICAgICAgICBuYW1lOiBvcmlnaW5hbC5uYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgbGFzdE9yaWdpbmFsU291cmNlID0gb3JpZ2luYWwuc291cmNlO1xuICAgICAgbGFzdE9yaWdpbmFsTGluZSA9IG9yaWdpbmFsLmxpbmU7XG4gICAgICBsYXN0T3JpZ2luYWxDb2x1bW4gPSBvcmlnaW5hbC5jb2x1bW47XG4gICAgICBsYXN0T3JpZ2luYWxOYW1lID0gb3JpZ2luYWwubmFtZTtcbiAgICAgIHNvdXJjZU1hcHBpbmdBY3RpdmUgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoc291cmNlTWFwcGluZ0FjdGl2ZSkge1xuICAgICAgbWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICBnZW5lcmF0ZWQ6IHtcbiAgICAgICAgICBsaW5lOiBnZW5lcmF0ZWQubGluZSxcbiAgICAgICAgICBjb2x1bW46IGdlbmVyYXRlZC5jb2x1bW5cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsYXN0T3JpZ2luYWxTb3VyY2UgPSBudWxsO1xuICAgICAgc291cmNlTWFwcGluZ0FjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKHZhciBpZHggPSAwLCBsZW5ndGggPSBjaHVuay5sZW5ndGg7IGlkeCA8IGxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChjaHVuay5jaGFyQ29kZUF0KGlkeCkgPT09IE5FV0xJTkVfQ09ERSkge1xuICAgICAgICBnZW5lcmF0ZWQubGluZSsrO1xuICAgICAgICBnZW5lcmF0ZWQuY29sdW1uID0gMDtcbiAgICAgICAgLy8gTWFwcGluZ3MgZW5kIGF0IGVvbFxuICAgICAgICBpZiAoaWR4ICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgbGFzdE9yaWdpbmFsU291cmNlID0gbnVsbDtcbiAgICAgICAgICBzb3VyY2VNYXBwaW5nQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoc291cmNlTWFwcGluZ0FjdGl2ZSkge1xuICAgICAgICAgIG1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgIHNvdXJjZTogb3JpZ2luYWwuc291cmNlLFxuICAgICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgICAgbGluZTogb3JpZ2luYWwubGluZSxcbiAgICAgICAgICAgICAgY29sdW1uOiBvcmlnaW5hbC5jb2x1bW5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZW5lcmF0ZWQ6IHtcbiAgICAgICAgICAgICAgbGluZTogZ2VuZXJhdGVkLmxpbmUsXG4gICAgICAgICAgICAgIGNvbHVtbjogZ2VuZXJhdGVkLmNvbHVtblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6IG9yaWdpbmFsLm5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2VuZXJhdGVkLmNvbHVtbisrO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHRoaXMud2Fsa1NvdXJjZUNvbnRlbnRzKGZ1bmN0aW9uIChzb3VyY2VGaWxlLCBzb3VyY2VDb250ZW50KSB7XG4gICAgbWFwLnNldFNvdXJjZUNvbnRlbnQoc291cmNlRmlsZSwgc291cmNlQ29udGVudCk7XG4gIH0pO1xuXG4gIHJldHVybiB7IGNvZGU6IGdlbmVyYXRlZC5jb2RlLCBtYXA6IG1hcCB9O1xufTtcblxuZXhwb3J0cy5Tb3VyY2VOb2RlID0gU291cmNlTm9kZTtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxuLyoqXG4gKiBUaGlzIGlzIGEgaGVscGVyIGZ1bmN0aW9uIGZvciBnZXR0aW5nIHZhbHVlcyBmcm9tIHBhcmFtZXRlci9vcHRpb25zXG4gKiBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSBhcmdzIFRoZSBvYmplY3Qgd2UgYXJlIGV4dHJhY3RpbmcgdmFsdWVzIGZyb21cbiAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB3ZSBhcmUgZ2V0dGluZy5cbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWUgQW4gb3B0aW9uYWwgdmFsdWUgdG8gcmV0dXJuIGlmIHRoZSBwcm9wZXJ0eSBpcyBtaXNzaW5nXG4gKiBmcm9tIHRoZSBvYmplY3QuIElmIHRoaXMgaXMgbm90IHNwZWNpZmllZCBhbmQgdGhlIHByb3BlcnR5IGlzIG1pc3NpbmcsIGFuXG4gKiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAqL1xuZnVuY3Rpb24gZ2V0QXJnKGFBcmdzLCBhTmFtZSwgYURlZmF1bHRWYWx1ZSkge1xuICBpZiAoYU5hbWUgaW4gYUFyZ3MpIHtcbiAgICByZXR1cm4gYUFyZ3NbYU5hbWVdO1xuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICByZXR1cm4gYURlZmF1bHRWYWx1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFOYW1lICsgJ1wiIGlzIGEgcmVxdWlyZWQgYXJndW1lbnQuJyk7XG4gIH1cbn1cbmV4cG9ydHMuZ2V0QXJnID0gZ2V0QXJnO1xuXG52YXIgdXJsUmVnZXhwID0gL14oPzooW1xcdytcXC0uXSspOik/XFwvXFwvKD86KFxcdys6XFx3KylAKT8oW1xcdy5dKikoPzo6KFxcZCspKT8oXFxTKikkLztcbnZhciBkYXRhVXJsUmVnZXhwID0gL15kYXRhOi4rXFwsLiskLztcblxuZnVuY3Rpb24gdXJsUGFyc2UoYVVybCkge1xuICB2YXIgbWF0Y2ggPSBhVXJsLm1hdGNoKHVybFJlZ2V4cCk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHNjaGVtZTogbWF0Y2hbMV0sXG4gICAgYXV0aDogbWF0Y2hbMl0sXG4gICAgaG9zdDogbWF0Y2hbM10sXG4gICAgcG9ydDogbWF0Y2hbNF0sXG4gICAgcGF0aDogbWF0Y2hbNV1cbiAgfTtcbn1cbmV4cG9ydHMudXJsUGFyc2UgPSB1cmxQYXJzZTtcblxuZnVuY3Rpb24gdXJsR2VuZXJhdGUoYVBhcnNlZFVybCkge1xuICB2YXIgdXJsID0gJyc7XG4gIGlmIChhUGFyc2VkVXJsLnNjaGVtZSkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLnNjaGVtZSArICc6JztcbiAgfVxuICB1cmwgKz0gJy8vJztcbiAgaWYgKGFQYXJzZWRVcmwuYXV0aCkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLmF1dGggKyAnQCc7XG4gIH1cbiAgaWYgKGFQYXJzZWRVcmwuaG9zdCkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLmhvc3Q7XG4gIH1cbiAgaWYgKGFQYXJzZWRVcmwucG9ydCkge1xuICAgIHVybCArPSBcIjpcIiArIGFQYXJzZWRVcmwucG9ydFxuICB9XG4gIGlmIChhUGFyc2VkVXJsLnBhdGgpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5wYXRoO1xuICB9XG4gIHJldHVybiB1cmw7XG59XG5leHBvcnRzLnVybEdlbmVyYXRlID0gdXJsR2VuZXJhdGU7XG5cbi8qKlxuICogTm9ybWFsaXplcyBhIHBhdGgsIG9yIHRoZSBwYXRoIHBvcnRpb24gb2YgYSBVUkw6XG4gKlxuICogLSBSZXBsYWNlcyBjb25zZWN1dGl2ZSBzbGFzaGVzIHdpdGggb25lIHNsYXNoLlxuICogLSBSZW1vdmVzIHVubmVjZXNzYXJ5ICcuJyBwYXJ0cy5cbiAqIC0gUmVtb3ZlcyB1bm5lY2Vzc2FyeSAnPGRpcj4vLi4nIHBhcnRzLlxuICpcbiAqIEJhc2VkIG9uIGNvZGUgaW4gdGhlIE5vZGUuanMgJ3BhdGgnIGNvcmUgbW9kdWxlLlxuICpcbiAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciB1cmwgdG8gbm9ybWFsaXplLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemUoYVBhdGgpIHtcbiAgdmFyIHBhdGggPSBhUGF0aDtcbiAgdmFyIHVybCA9IHVybFBhcnNlKGFQYXRoKTtcbiAgaWYgKHVybCkge1xuICAgIGlmICghdXJsLnBhdGgpIHtcbiAgICAgIHJldHVybiBhUGF0aDtcbiAgICB9XG4gICAgcGF0aCA9IHVybC5wYXRoO1xuICB9XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpO1xuXG4gIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoL1xcLysvKTtcbiAgZm9yICh2YXIgcGFydCwgdXAgPSAwLCBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBwYXJ0ID0gcGFydHNbaV07XG4gICAgaWYgKHBhcnQgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAocGFydCA9PT0gJy4uJykge1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwID4gMCkge1xuICAgICAgaWYgKHBhcnQgPT09ICcnKSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBwYXJ0IGlzIGJsYW5rIGlmIHRoZSBwYXRoIGlzIGFic29sdXRlLiBUcnlpbmcgdG8gZ29cbiAgICAgICAgLy8gYWJvdmUgdGhlIHJvb3QgaXMgYSBuby1vcC4gVGhlcmVmb3JlIHdlIGNhbiByZW1vdmUgYWxsICcuLicgcGFydHNcbiAgICAgICAgLy8gZGlyZWN0bHkgYWZ0ZXIgdGhlIHJvb3QuXG4gICAgICAgIHBhcnRzLnNwbGljZShpICsgMSwgdXApO1xuICAgICAgICB1cCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMik7XG4gICAgICAgIHVwLS07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHBhdGggPSBwYXJ0cy5qb2luKCcvJyk7XG5cbiAgaWYgKHBhdGggPT09ICcnKSB7XG4gICAgcGF0aCA9IGlzQWJzb2x1dGUgPyAnLycgOiAnLic7XG4gIH1cblxuICBpZiAodXJsKSB7XG4gICAgdXJsLnBhdGggPSBwYXRoO1xuICAgIHJldHVybiB1cmxHZW5lcmF0ZSh1cmwpO1xuICB9XG4gIHJldHVybiBwYXRoO1xufVxuZXhwb3J0cy5ub3JtYWxpemUgPSBub3JtYWxpemU7XG5cbi8qKlxuICogSm9pbnMgdHdvIHBhdGhzL1VSTHMuXG4gKlxuICogQHBhcmFtIGFSb290IFRoZSByb290IHBhdGggb3IgVVJMLlxuICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIFVSTCB0byBiZSBqb2luZWQgd2l0aCB0aGUgcm9vdC5cbiAqXG4gKiAtIElmIGFQYXRoIGlzIGEgVVJMIG9yIGEgZGF0YSBVUkksIGFQYXRoIGlzIHJldHVybmVkLCB1bmxlc3MgYVBhdGggaXMgYVxuICogICBzY2hlbWUtcmVsYXRpdmUgVVJMOiBUaGVuIHRoZSBzY2hlbWUgb2YgYVJvb3QsIGlmIGFueSwgaXMgcHJlcGVuZGVkXG4gKiAgIGZpcnN0LlxuICogLSBPdGhlcndpc2UgYVBhdGggaXMgYSBwYXRoLiBJZiBhUm9vdCBpcyBhIFVSTCwgdGhlbiBpdHMgcGF0aCBwb3J0aW9uXG4gKiAgIGlzIHVwZGF0ZWQgd2l0aCB0aGUgcmVzdWx0IGFuZCBhUm9vdCBpcyByZXR1cm5lZC4gT3RoZXJ3aXNlIHRoZSByZXN1bHRcbiAqICAgaXMgcmV0dXJuZWQuXG4gKiAgIC0gSWYgYVBhdGggaXMgYWJzb2x1dGUsIHRoZSByZXN1bHQgaXMgYVBhdGguXG4gKiAgIC0gT3RoZXJ3aXNlIHRoZSB0d28gcGF0aHMgYXJlIGpvaW5lZCB3aXRoIGEgc2xhc2guXG4gKiAtIEpvaW5pbmcgZm9yIGV4YW1wbGUgJ2h0dHA6Ly8nIGFuZCAnd3d3LmV4YW1wbGUuY29tJyBpcyBhbHNvIHN1cHBvcnRlZC5cbiAqL1xuZnVuY3Rpb24gam9pbihhUm9vdCwgYVBhdGgpIHtcbiAgaWYgKGFSb290ID09PSBcIlwiKSB7XG4gICAgYVJvb3QgPSBcIi5cIjtcbiAgfVxuICBpZiAoYVBhdGggPT09IFwiXCIpIHtcbiAgICBhUGF0aCA9IFwiLlwiO1xuICB9XG4gIHZhciBhUGF0aFVybCA9IHVybFBhcnNlKGFQYXRoKTtcbiAgdmFyIGFSb290VXJsID0gdXJsUGFyc2UoYVJvb3QpO1xuICBpZiAoYVJvb3RVcmwpIHtcbiAgICBhUm9vdCA9IGFSb290VXJsLnBhdGggfHwgJy8nO1xuICB9XG5cbiAgLy8gYGpvaW4oZm9vLCAnLy93d3cuZXhhbXBsZS5vcmcnKWBcbiAgaWYgKGFQYXRoVXJsICYmICFhUGF0aFVybC5zY2hlbWUpIHtcbiAgICBpZiAoYVJvb3RVcmwpIHtcbiAgICAgIGFQYXRoVXJsLnNjaGVtZSA9IGFSb290VXJsLnNjaGVtZTtcbiAgICB9XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKGFQYXRoVXJsKTtcbiAgfVxuXG4gIGlmIChhUGF0aFVybCB8fCBhUGF0aC5tYXRjaChkYXRhVXJsUmVnZXhwKSkge1xuICAgIHJldHVybiBhUGF0aDtcbiAgfVxuXG4gIC8vIGBqb2luKCdodHRwOi8vJywgJ3d3dy5leGFtcGxlLmNvbScpYFxuICBpZiAoYVJvb3RVcmwgJiYgIWFSb290VXJsLmhvc3QgJiYgIWFSb290VXJsLnBhdGgpIHtcbiAgICBhUm9vdFVybC5ob3N0ID0gYVBhdGg7XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKGFSb290VXJsKTtcbiAgfVxuXG4gIHZhciBqb2luZWQgPSBhUGF0aC5jaGFyQXQoMCkgPT09ICcvJ1xuICAgID8gYVBhdGhcbiAgICA6IG5vcm1hbGl6ZShhUm9vdC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIGFQYXRoKTtcblxuICBpZiAoYVJvb3RVcmwpIHtcbiAgICBhUm9vdFVybC5wYXRoID0gam9pbmVkO1xuICAgIHJldHVybiB1cmxHZW5lcmF0ZShhUm9vdFVybCk7XG4gIH1cbiAgcmV0dXJuIGpvaW5lZDtcbn1cbmV4cG9ydHMuam9pbiA9IGpvaW47XG5cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uIChhUGF0aCkge1xuICByZXR1cm4gYVBhdGguY2hhckF0KDApID09PSAnLycgfHwgISFhUGF0aC5tYXRjaCh1cmxSZWdleHApO1xufTtcblxuLyoqXG4gKiBNYWtlIGEgcGF0aCByZWxhdGl2ZSB0byBhIFVSTCBvciBhbm90aGVyIHBhdGguXG4gKlxuICogQHBhcmFtIGFSb290IFRoZSByb290IHBhdGggb3IgVVJMLlxuICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIFVSTCB0byBiZSBtYWRlIHJlbGF0aXZlIHRvIGFSb290LlxuICovXG5mdW5jdGlvbiByZWxhdGl2ZShhUm9vdCwgYVBhdGgpIHtcbiAgaWYgKGFSb290ID09PSBcIlwiKSB7XG4gICAgYVJvb3QgPSBcIi5cIjtcbiAgfVxuXG4gIGFSb290ID0gYVJvb3QucmVwbGFjZSgvXFwvJC8sICcnKTtcblxuICAvLyBJdCBpcyBwb3NzaWJsZSBmb3IgdGhlIHBhdGggdG8gYmUgYWJvdmUgdGhlIHJvb3QuIEluIHRoaXMgY2FzZSwgc2ltcGx5XG4gIC8vIGNoZWNraW5nIHdoZXRoZXIgdGhlIHJvb3QgaXMgYSBwcmVmaXggb2YgdGhlIHBhdGggd29uJ3Qgd29yay4gSW5zdGVhZCwgd2VcbiAgLy8gbmVlZCB0byByZW1vdmUgY29tcG9uZW50cyBmcm9tIHRoZSByb290IG9uZSBieSBvbmUsIHVudGlsIGVpdGhlciB3ZSBmaW5kXG4gIC8vIGEgcHJlZml4IHRoYXQgZml0cywgb3Igd2UgcnVuIG91dCBvZiBjb21wb25lbnRzIHRvIHJlbW92ZS5cbiAgdmFyIGxldmVsID0gMDtcbiAgd2hpbGUgKGFQYXRoLmluZGV4T2YoYVJvb3QgKyAnLycpICE9PSAwKSB7XG4gICAgdmFyIGluZGV4ID0gYVJvb3QubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIHJldHVybiBhUGF0aDtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgb25seSBwYXJ0IG9mIHRoZSByb290IHRoYXQgaXMgbGVmdCBpcyB0aGUgc2NoZW1lIChpLmUuIGh0dHA6Ly8sXG4gICAgLy8gZmlsZTovLy8sIGV0Yy4pLCBvbmUgb3IgbW9yZSBzbGFzaGVzICgvKSwgb3Igc2ltcGx5IG5vdGhpbmcgYXQgYWxsLCB3ZVxuICAgIC8vIGhhdmUgZXhoYXVzdGVkIGFsbCBjb21wb25lbnRzLCBzbyB0aGUgcGF0aCBpcyBub3QgcmVsYXRpdmUgdG8gdGhlIHJvb3QuXG4gICAgYVJvb3QgPSBhUm9vdC5zbGljZSgwLCBpbmRleCk7XG4gICAgaWYgKGFSb290Lm1hdGNoKC9eKFteXFwvXSs6XFwvKT9cXC8qJC8pKSB7XG4gICAgICByZXR1cm4gYVBhdGg7XG4gICAgfVxuXG4gICAgKytsZXZlbDtcbiAgfVxuXG4gIC8vIE1ha2Ugc3VyZSB3ZSBhZGQgYSBcIi4uL1wiIGZvciBlYWNoIGNvbXBvbmVudCB3ZSByZW1vdmVkIGZyb20gdGhlIHJvb3QuXG4gIHJldHVybiBBcnJheShsZXZlbCArIDEpLmpvaW4oXCIuLi9cIikgKyBhUGF0aC5zdWJzdHIoYVJvb3QubGVuZ3RoICsgMSk7XG59XG5leHBvcnRzLnJlbGF0aXZlID0gcmVsYXRpdmU7XG5cbnZhciBzdXBwb3J0c051bGxQcm90byA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICByZXR1cm4gISgnX19wcm90b19fJyBpbiBvYmopO1xufSgpKTtcblxuZnVuY3Rpb24gaWRlbnRpdHkgKHMpIHtcbiAgcmV0dXJuIHM7XG59XG5cbi8qKlxuICogQmVjYXVzZSBiZWhhdmlvciBnb2VzIHdhY2t5IHdoZW4geW91IHNldCBgX19wcm90b19fYCBvbiBvYmplY3RzLCB3ZVxuICogaGF2ZSB0byBwcmVmaXggYWxsIHRoZSBzdHJpbmdzIGluIG91ciBzZXQgd2l0aCBhbiBhcmJpdHJhcnkgY2hhcmFjdGVyLlxuICpcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL3B1bGwvMzEgYW5kXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL2lzc3Vlcy8zMFxuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5mdW5jdGlvbiB0b1NldFN0cmluZyhhU3RyKSB7XG4gIGlmIChpc1Byb3RvU3RyaW5nKGFTdHIpKSB7XG4gICAgcmV0dXJuICckJyArIGFTdHI7XG4gIH1cblxuICByZXR1cm4gYVN0cjtcbn1cbmV4cG9ydHMudG9TZXRTdHJpbmcgPSBzdXBwb3J0c051bGxQcm90byA/IGlkZW50aXR5IDogdG9TZXRTdHJpbmc7XG5cbmZ1bmN0aW9uIGZyb21TZXRTdHJpbmcoYVN0cikge1xuICBpZiAoaXNQcm90b1N0cmluZyhhU3RyKSkge1xuICAgIHJldHVybiBhU3RyLnNsaWNlKDEpO1xuICB9XG5cbiAgcmV0dXJuIGFTdHI7XG59XG5leHBvcnRzLmZyb21TZXRTdHJpbmcgPSBzdXBwb3J0c051bGxQcm90byA/IGlkZW50aXR5IDogZnJvbVNldFN0cmluZztcblxuZnVuY3Rpb24gaXNQcm90b1N0cmluZyhzKSB7XG4gIGlmICghcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBzLmxlbmd0aDtcblxuICBpZiAobGVuZ3RoIDwgOSAvKiBcIl9fcHJvdG9fX1wiLmxlbmd0aCAqLykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMSkgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSAyKSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDMpICE9PSAxMTEgLyogJ28nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNCkgIT09IDExNiAvKiAndCcgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA1KSAhPT0gMTExIC8qICdvJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDYpICE9PSAxMTQgLyogJ3InICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNykgIT09IDExMiAvKiAncCcgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA4KSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDkpICE9PSA5NSAgLyogJ18nICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IGxlbmd0aCAtIDEwOyBpID49IDA7IGktLSkge1xuICAgIGlmIChzLmNoYXJDb2RlQXQoaSkgIT09IDM2IC8qICckJyAqLykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENvbXBhcmF0b3IgYmV0d2VlbiB0d28gbWFwcGluZ3Mgd2hlcmUgdGhlIG9yaWdpbmFsIHBvc2l0aW9ucyBhcmUgY29tcGFyZWQuXG4gKlxuICogT3B0aW9uYWxseSBwYXNzIGluIGB0cnVlYCBhcyBgb25seUNvbXBhcmVHZW5lcmF0ZWRgIHRvIGNvbnNpZGVyIHR3b1xuICogbWFwcGluZ3Mgd2l0aCB0aGUgc2FtZSBvcmlnaW5hbCBzb3VyY2UvbGluZS9jb2x1bW4sIGJ1dCBkaWZmZXJlbnQgZ2VuZXJhdGVkXG4gKiBsaW5lIGFuZCBjb2x1bW4gdGhlIHNhbWUuIFVzZWZ1bCB3aGVuIHNlYXJjaGluZyBmb3IgYSBtYXBwaW5nIHdpdGggYVxuICogc3R1YmJlZCBvdXQgbWFwcGluZy5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMobWFwcGluZ0EsIG1hcHBpbmdCLCBvbmx5Q29tcGFyZU9yaWdpbmFsKSB7XG4gIHZhciBjbXAgPSBtYXBwaW5nQS5zb3VyY2UgLSBtYXBwaW5nQi5zb3VyY2U7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVPcmlnaW5hbCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIG1hcHBpbmdBLm5hbWUgLSBtYXBwaW5nQi5uYW1lO1xufVxuZXhwb3J0cy5jb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyA9IGNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zO1xuXG4vKipcbiAqIENvbXBhcmF0b3IgYmV0d2VlbiB0d28gbWFwcGluZ3Mgd2l0aCBkZWZsYXRlZCBzb3VyY2UgYW5kIG5hbWUgaW5kaWNlcyB3aGVyZVxuICogdGhlIGdlbmVyYXRlZCBwb3NpdGlvbnMgYXJlIGNvbXBhcmVkLlxuICpcbiAqIE9wdGlvbmFsbHkgcGFzcyBpbiBgdHJ1ZWAgYXMgYG9ubHlDb21wYXJlR2VuZXJhdGVkYCB0byBjb25zaWRlciB0d29cbiAqIG1hcHBpbmdzIHdpdGggdGhlIHNhbWUgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiwgYnV0IGRpZmZlcmVudFxuICogc291cmNlL25hbWUvb3JpZ2luYWwgbGluZSBhbmQgY29sdW1uIHRoZSBzYW1lLiBVc2VmdWwgd2hlbiBzZWFyY2hpbmcgZm9yIGFcbiAqIG1hcHBpbmcgd2l0aCBhIHN0dWJiZWQgb3V0IG1hcHBpbmcuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkKG1hcHBpbmdBLCBtYXBwaW5nQiwgb25seUNvbXBhcmVHZW5lcmF0ZWQpIHtcbiAgdmFyIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZENvbHVtbiAtIG1hcHBpbmdCLmdlbmVyYXRlZENvbHVtbjtcbiAgaWYgKGNtcCAhPT0gMCB8fCBvbmx5Q29tcGFyZUdlbmVyYXRlZCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5zb3VyY2UgLSBtYXBwaW5nQi5zb3VyY2U7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIG1hcHBpbmdBLm5hbWUgLSBtYXBwaW5nQi5uYW1lO1xufVxuZXhwb3J0cy5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZCA9IGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkO1xuXG5mdW5jdGlvbiBzdHJjbXAoYVN0cjEsIGFTdHIyKSB7XG4gIGlmIChhU3RyMSA9PT0gYVN0cjIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChhU3RyMSA+IGFTdHIyKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aXRoIGluZmxhdGVkIHNvdXJjZSBhbmQgbmFtZSBzdHJpbmdzIHdoZXJlXG4gKiB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9ucyBhcmUgY29tcGFyZWQuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkKG1hcHBpbmdBLCBtYXBwaW5nQikge1xuICB2YXIgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IHN0cmNtcChtYXBwaW5nQS5zb3VyY2UsIG1hcHBpbmdCLnNvdXJjZSk7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIHN0cmNtcChtYXBwaW5nQS5uYW1lLCBtYXBwaW5nQi5uYW1lKTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQgPSBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZDtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwOS0yMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRS50eHQgb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cbmV4cG9ydHMuU291cmNlTWFwR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9saWIvc291cmNlLW1hcC1nZW5lcmF0b3InKS5Tb3VyY2VNYXBHZW5lcmF0b3I7XG5leHBvcnRzLlNvdXJjZU1hcENvbnN1bWVyID0gcmVxdWlyZSgnLi9saWIvc291cmNlLW1hcC1jb25zdW1lcicpLlNvdXJjZU1hcENvbnN1bWVyO1xuZXhwb3J0cy5Tb3VyY2VOb2RlID0gcmVxdWlyZSgnLi9saWIvc291cmNlLW5vZGUnKS5Tb3VyY2VOb2RlO1xuIl19
