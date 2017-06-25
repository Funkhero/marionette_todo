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
        formSubmit: '.authorization__block',
        register: '.registration__btn'
    },
    events: {
        'click @ui.authorize': 'authorizeUser',
        'submit @ui.formSubmit': 'authorizeUser',
        'click @ui.register': 'registerUser'
    },
    authorizeUser: function authorizeUser(event) {
        event.preventDefault();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0XFxqc1xcYXBwLmpzIiwiZGlzdFxcanNcXGJlaGF2aW9yc1xcaGJzLmpzIiwiZGlzdFxcanNcXGluaXRpYWxpemUuanMiLCJkaXN0XFxqc1xcbGlic1xcaGFuZGxlYmFycy12NC4wLjEwLmpzIiwiZGlzdFxcanNcXHZpZXdzXFxhdGhvcml6YXRpb24uanMiLCJkaXN0XFxqc1xcdmlld3NcXGN1cnJlbnQudXNlci5qcyIsImRpc3RcXGpzXFx2aWV3c1xcbGF5b3V0LmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2FycmF5LXNldC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9iYXNlNjQtdmxxLmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2Jhc2U2NC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9iaW5hcnktc2VhcmNoLmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL21hcHBpbmctbGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9xdWljay1zb3J0LmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL3NvdXJjZS1tYXAtY29uc3VtZXIuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvc291cmNlLW1hcC1nZW5lcmF0b3IuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvc291cmNlLW5vZGUuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL3NvdXJjZS1tYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7a0JBR2UsV0FBVyxXQUFYLENBQXVCLE1BQXZCLENBQThCO0FBQzVDLFNBQVEsTUFEb0M7QUFFNUMsYUFBWSxzQkFBVztBQUN0QixPQUFLLFFB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SyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2phQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IExheW91dCBmcm9tICcuL3ZpZXdzL2xheW91dCc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWFyaW9uZXR0ZS5BcHBsaWNhdGlvbi5leHRlbmQoe1xyXG5cdHJlZ2lvbjogJy5hcHAnLFxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy50bXBDYWNoZSA9IHt9O1xyXG5cdH0sXHJcblx0c3RhcnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zaG93VmlldyhuZXcgTGF5b3V0KCkpO1xyXG5cdH0sXHJcblx0YWpheCAob3B0aW9ucykge1xyXG5cdFx0dmFyIHBhcmFtcyA9IF8uZXh0ZW5kKHtcclxuXHRcdFx0dXJsOiAnJyxcclxuXHRcdFx0dHlwZTogJ1BPU1QnLFxyXG5cdFx0XHRkYXRhOiB7fSxcclxuXHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0Y2FsbGJhY2sgKHJlc3ApIHtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnYWpheCByZXNwJylcclxuXHRcdFx0fVxyXG5cdFx0fSwgb3B0aW9ucyk7XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcblx0XHRcdCQuYWpheCh7XHJcblx0XHRcdFx0dXJsOiBwYXJhbXMudXJsLFxyXG5cdFx0XHRcdHR5cGU6IHBhcmFtcy50eXBlLFxyXG5cdFx0XHRcdGRhdGE6IHBhcmFtcy5kYXRhLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiBwYXJhbXMuZGF0YVR5cGVcclxuXHRcdFx0fSkuYWx3YXlzKChyZXNwb25zZSwgc3RhdHVzKSA9PiB7XHJcblx0XHRcdFx0aWYoc3RhdHVzID09PSAnZXJyb3InKSB7XHJcblx0XHRcdFx0XHRyZWplY3QocmVzcG9uc2UpXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZihzdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG5cdFx0XHRcdFx0aWYodHlwZW9mIHJlc3BvbnNlID09PSAnb2JqZWN0JyAmJiByZXNwb25zZS5jb2RlICE9IDIwMCkge1xyXG5cdFx0XHRcdFx0XHRpZihyZXNwb25zZS5tZXNzYWdlKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVqZWN0KHJlc3BvbnNlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cGFyYW1zLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fSkuY2F0Y2gocmVzcG9uc2UgPT4ge1xyXG5cdFx0XHRpZihyZXNwb25zZS5tZXNzYWdlKSB7XHJcblx0XHRcdFx0Ly9JZiB0b2tlbiBpbnZhbGlkIC0gbG9nb3V0IHVzZXJcclxuXHRcdFx0XHRpZihyZXNwb25zZS5jb2RlID09PSA0MDEpIHtcclxuXHRcdFx0XHRcdEFwcC5Sb3V0ZXIubmF2aWdhdGUoJy8nLCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGFsZXJ0KHJlc3BvbnNlLnRvU3RyaW5nKCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn0pOyIsImltcG9ydCBoYW5kbGViYXJzIGZyb20gJy4uL2xpYnMvaGFuZGxlYmFycy12NC4wLjEwJztcblxuY29uc3QgSGJWaWV3ID0gTWFyaW9uZXR0ZS5CZWhhdmlvci5leHRlbmQoe1xuICAgIGxvYWRlZDogZmFsc2UsXG4gICAgaW5pdGlhbGl6ZSAob3B0aW9ucykge1xuICAgICAgICBsZXQgSEJUZW1wbGF0ZSA9IHRoaXMudmlldy5IQlRlbXBsYXRlO1xuXG4gICAgICAgIHRoaXMudmlldy5fbG9hZFRlbXBsYXRlID0gZmFsc2U7XG5cbiAgICAgICAgLy9HZXQgcGF0aCB0ZW1wbGF0ZVxuICAgICAgICBpZighSEJUZW1wbGF0ZSkgcmV0dXJuIGNvbnNvbGUud2FybihcIkhCVGVtcGxhdGUgaXMgbm90IGRlZmluZWRcIik7XG4gICAgICAgIC8vQ2hlY2sgY2FjaGUgb2JqXG4gICAgICAgIGlmKEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0gPSBBcHAuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IEhCVGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAndGV4dCdcbiAgICAgICAgICAgICAgICB9KS50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL0FkZCB0byBjYWNoZVxuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy52aWV3LmlzRGVzdHJveWVkKCkpIHtcbiAgICAgICAgICAgICAgICBBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0gPSByZXNwO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VGVtcGxhdGUoQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdKTtcbiAgICAgICAgICAgICAgICBpZihfLmlzRnVuY3Rpb24odGhpcy52aWV3Lm9uTG9hZFRlbXBsYXRlKSkgdGhpcy52aWV3Lm9uTG9hZFRlbXBsYXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gcmVzb2x2ZShyZXNwKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vQ2hlY2sgY3VycmVudCBydW5uaW5nIFByb21pc2VcbiAgICAgICAgaWYoXy5pc0Z1bmN0aW9uKEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXS50aGVuKSkge1xuICAgICAgICAgICAgQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgICAgICAgICAgLy9BZGQgdG8gY2FjaGVcbiAgICAgICAgICAgICAgICBBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0gPSByZXNwO1xuICAgICAgICAgICAgdGhpcy5zZXRUZW1wbGF0ZShBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0pO1xuICAgICAgICAgICAgaWYoXy5pc0Z1bmN0aW9uKHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSkpIHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLy9UZW1wbGF0ZSBsb2FkZWQsIGp1c3Qgc2V0IHRlbXBsYXRlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNldFRlbXBsYXRlKEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldFRlbXBsYXRlICh0ZW1wbGF0ZSkge1xuICAgICAgICBsZXQgdG1wID0gaGFuZGxlYmFycy5jb21waWxlKHRlbXBsYXRlKVxuICAgICAgICB0aGlzLnZpZXcudGVtcGxhdGUgPSBkYXRhID0+IHRtcChkYXRhKTtcbiAgICAgICAgdGhpcy52aWV3Ll9sb2FkVGVtcGxhdGUgPSB0cnVlO1xuICAgIH0sXG4gICAgb25BdHRhY2ggKCkge1xuICAgICAgICBpZihfLmlzRnVuY3Rpb24odGhpcy52aWV3Lm9uTG9hZFRlbXBsYXRlKSAmJiB0aGlzLmxvYWRlZCA9PT0gdHJ1ZSkgdGhpcy52aWV3Lm9uTG9hZFRlbXBsYXRlKCk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEhiVmlldyIsImltcG9ydCBUb2RvYXBwIGZyb20gJy4vYXBwJztcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICB3aW5kb3cuQXBwID0gbmV3IFRvZG9hcHAoKTtcbiAgICBBcHAuc3RhcnQoKTtcbn0pO1xuIiwiLyoqIVxuXG4gQGxpY2Vuc2VcbiBoYW5kbGViYXJzIHY0LjAuMTBcblxuQ29weXJpZ2h0IChDKSAyMDExLTIwMTYgYnkgWWVodWRhIEthdHpcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuXG4qL1xuKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiSGFuZGxlYmFyc1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJIYW5kbGViYXJzXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcblxuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cblxuXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX2hhbmRsZWJhcnNSdW50aW1lID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNSdW50aW1lMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hhbmRsZWJhcnNSdW50aW1lKTtcblxuXHQvLyBDb21waWxlciBpbXBvcnRzXG5cblx0dmFyIF9oYW5kbGViYXJzQ29tcGlsZXJBc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM1KTtcblxuXHR2YXIgX2hhbmRsZWJhcnNDb21waWxlckFzdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzQ29tcGlsZXJBc3QpO1xuXG5cdHZhciBfaGFuZGxlYmFyc0NvbXBpbGVyQmFzZSA9IF9fd2VicGFja19yZXF1aXJlX18oMzYpO1xuXG5cdHZhciBfaGFuZGxlYmFyc0NvbXBpbGVyQ29tcGlsZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQxKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNDb21waWxlckphdmFzY3JpcHRDb21waWxlciA9IF9fd2VicGFja19yZXF1aXJlX18oNDIpO1xuXG5cdHZhciBfaGFuZGxlYmFyc0NvbXBpbGVySmF2YXNjcmlwdENvbXBpbGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hhbmRsZWJhcnNDb21waWxlckphdmFzY3JpcHRDb21waWxlcik7XG5cblx0dmFyIF9oYW5kbGViYXJzQ29tcGlsZXJWaXNpdG9yID0gX193ZWJwYWNrX3JlcXVpcmVfXygzOSk7XG5cblx0dmFyIF9oYW5kbGViYXJzQ29tcGlsZXJWaXNpdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hhbmRsZWJhcnNDb21waWxlclZpc2l0b3IpO1xuXG5cdHZhciBfaGFuZGxlYmFyc05vQ29uZmxpY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM0KTtcblxuXHR2YXIgX2hhbmRsZWJhcnNOb0NvbmZsaWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hhbmRsZWJhcnNOb0NvbmZsaWN0KTtcblxuXHR2YXIgX2NyZWF0ZSA9IF9oYW5kbGViYXJzUnVudGltZTJbJ2RlZmF1bHQnXS5jcmVhdGU7XG5cdGZ1bmN0aW9uIGNyZWF0ZSgpIHtcblx0ICB2YXIgaGIgPSBfY3JlYXRlKCk7XG5cblx0ICBoYi5jb21waWxlID0gZnVuY3Rpb24gKGlucHV0LCBvcHRpb25zKSB7XG5cdCAgICByZXR1cm4gX2hhbmRsZWJhcnNDb21waWxlckNvbXBpbGVyLmNvbXBpbGUoaW5wdXQsIG9wdGlvbnMsIGhiKTtcblx0ICB9O1xuXHQgIGhiLnByZWNvbXBpbGUgPSBmdW5jdGlvbiAoaW5wdXQsIG9wdGlvbnMpIHtcblx0ICAgIHJldHVybiBfaGFuZGxlYmFyc0NvbXBpbGVyQ29tcGlsZXIucHJlY29tcGlsZShpbnB1dCwgb3B0aW9ucywgaGIpO1xuXHQgIH07XG5cblx0ICBoYi5BU1QgPSBfaGFuZGxlYmFyc0NvbXBpbGVyQXN0MlsnZGVmYXVsdCddO1xuXHQgIGhiLkNvbXBpbGVyID0gX2hhbmRsZWJhcnNDb21waWxlckNvbXBpbGVyLkNvbXBpbGVyO1xuXHQgIGhiLkphdmFTY3JpcHRDb21waWxlciA9IF9oYW5kbGViYXJzQ29tcGlsZXJKYXZhc2NyaXB0Q29tcGlsZXIyWydkZWZhdWx0J107XG5cdCAgaGIuUGFyc2VyID0gX2hhbmRsZWJhcnNDb21waWxlckJhc2UucGFyc2VyO1xuXHQgIGhiLnBhcnNlID0gX2hhbmRsZWJhcnNDb21waWxlckJhc2UucGFyc2U7XG5cblx0ICByZXR1cm4gaGI7XG5cdH1cblxuXHR2YXIgaW5zdCA9IGNyZWF0ZSgpO1xuXHRpbnN0LmNyZWF0ZSA9IGNyZWF0ZTtcblxuXHRfaGFuZGxlYmFyc05vQ29uZmxpY3QyWydkZWZhdWx0J10oaW5zdCk7XG5cblx0aW5zdC5WaXNpdG9yID0gX2hhbmRsZWJhcnNDb21waWxlclZpc2l0b3IyWydkZWZhdWx0J107XG5cblx0aW5zdFsnZGVmYXVsdCddID0gaW5zdDtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBpbnN0O1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0ZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAob2JqKSB7XG5cdCAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcblx0ICAgIFwiZGVmYXVsdFwiOiBvYmpcblx0ICB9O1xuXHR9O1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbi8qKiovIH0pLFxuLyogMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpWydkZWZhdWx0J107XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX2hhbmRsZWJhcnNCYXNlID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KTtcblxuXHR2YXIgYmFzZSA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9oYW5kbGViYXJzQmFzZSk7XG5cblx0Ly8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuXHQvLyAoVGhpcyBpcyBkb25lIHRvIGVhc2lseSBzaGFyZSBjb2RlIGJldHdlZW4gY29tbW9uanMgYW5kIGJyb3dzZSBlbnZzKVxuXG5cdHZhciBfaGFuZGxlYmFyc1NhZmVTdHJpbmcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIxKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNTYWZlU3RyaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hhbmRsZWJhcnNTYWZlU3RyaW5nKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNFeGNlcHRpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG5cdHZhciBfaGFuZGxlYmFyc0V4Y2VwdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzRXhjZXB0aW9uKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNVdGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIFV0aWxzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2hhbmRsZWJhcnNVdGlscyk7XG5cblx0dmFyIF9oYW5kbGViYXJzUnVudGltZSA9IF9fd2VicGFja19yZXF1aXJlX18oMjIpO1xuXG5cdHZhciBydW50aW1lID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2hhbmRsZWJhcnNSdW50aW1lKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNOb0NvbmZsaWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNCk7XG5cblx0dmFyIF9oYW5kbGViYXJzTm9Db25mbGljdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oYW5kbGViYXJzTm9Db25mbGljdCk7XG5cblx0Ly8gRm9yIGNvbXBhdGliaWxpdHkgYW5kIHVzYWdlIG91dHNpZGUgb2YgbW9kdWxlIHN5c3RlbXMsIG1ha2UgdGhlIEhhbmRsZWJhcnMgb2JqZWN0IGEgbmFtZXNwYWNlXG5cdGZ1bmN0aW9uIGNyZWF0ZSgpIHtcblx0ICB2YXIgaGIgPSBuZXcgYmFzZS5IYW5kbGViYXJzRW52aXJvbm1lbnQoKTtcblxuXHQgIFV0aWxzLmV4dGVuZChoYiwgYmFzZSk7XG5cdCAgaGIuU2FmZVN0cmluZyA9IF9oYW5kbGViYXJzU2FmZVN0cmluZzJbJ2RlZmF1bHQnXTtcblx0ICBoYi5FeGNlcHRpb24gPSBfaGFuZGxlYmFyc0V4Y2VwdGlvbjJbJ2RlZmF1bHQnXTtcblx0ICBoYi5VdGlscyA9IFV0aWxzO1xuXHQgIGhiLmVzY2FwZUV4cHJlc3Npb24gPSBVdGlscy5lc2NhcGVFeHByZXNzaW9uO1xuXG5cdCAgaGIuVk0gPSBydW50aW1lO1xuXHQgIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24gKHNwZWMpIHtcblx0ICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcblx0ICB9O1xuXG5cdCAgcmV0dXJuIGhiO1xuXHR9XG5cblx0dmFyIGluc3QgPSBjcmVhdGUoKTtcblx0aW5zdC5jcmVhdGUgPSBjcmVhdGU7XG5cblx0X2hhbmRsZWJhcnNOb0NvbmZsaWN0MlsnZGVmYXVsdCddKGluc3QpO1xuXG5cdGluc3RbJ2RlZmF1bHQnXSA9IGluc3Q7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gaW5zdDtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKG9iaikge1xuXHQgIGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHtcblx0ICAgIHJldHVybiBvYmo7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHZhciBuZXdPYmogPSB7fTtcblxuXHQgICAgaWYgKG9iaiAhPSBudWxsKSB7XG5cdCAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcblx0ICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqO1xuXHQgICAgcmV0dXJuIG5ld09iajtcblx0ICB9XG5cdH07XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuLyoqKi8gfSksXG4vKiA0ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuSGFuZGxlYmFyc0Vudmlyb25tZW50ID0gSGFuZGxlYmFyc0Vudmlyb25tZW50O1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdHZhciBfZXhjZXB0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHR2YXIgX2V4Y2VwdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leGNlcHRpb24pO1xuXG5cdHZhciBfaGVscGVycyA9IF9fd2VicGFja19yZXF1aXJlX18oMTApO1xuXG5cdHZhciBfZGVjb3JhdG9ycyA9IF9fd2VicGFja19yZXF1aXJlX18oMTgpO1xuXG5cdHZhciBfbG9nZ2VyID0gX193ZWJwYWNrX3JlcXVpcmVfXygyMCk7XG5cblx0dmFyIF9sb2dnZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9nZ2VyKTtcblxuXHR2YXIgVkVSU0lPTiA9ICc0LjAuMTAnO1xuXHRleHBvcnRzLlZFUlNJT04gPSBWRVJTSU9OO1xuXHR2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA3O1xuXG5cdGV4cG9ydHMuQ09NUElMRVJfUkVWSVNJT04gPSBDT01QSUxFUl9SRVZJU0lPTjtcblx0dmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG5cdCAgMTogJzw9IDEuMC5yYy4yJywgLy8gMS4wLnJjLjIgaXMgYWN0dWFsbHkgcmV2MiBidXQgZG9lc24ndCByZXBvcnQgaXRcblx0ICAyOiAnPT0gMS4wLjAtcmMuMycsXG5cdCAgMzogJz09IDEuMC4wLXJjLjQnLFxuXHQgIDQ6ICc9PSAxLngueCcsXG5cdCAgNTogJz09IDIuMC4wLWFscGhhLngnLFxuXHQgIDY6ICc+PSAyLjAuMC1iZXRhLjEnLFxuXHQgIDc6ICc+PSA0LjAuMCdcblx0fTtcblxuXHRleHBvcnRzLlJFVklTSU9OX0NIQU5HRVMgPSBSRVZJU0lPTl9DSEFOR0VTO1xuXHR2YXIgb2JqZWN0VHlwZSA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG5cdGZ1bmN0aW9uIEhhbmRsZWJhcnNFbnZpcm9ubWVudChoZWxwZXJzLCBwYXJ0aWFscywgZGVjb3JhdG9ycykge1xuXHQgIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG5cdCAgdGhpcy5wYXJ0aWFscyA9IHBhcnRpYWxzIHx8IHt9O1xuXHQgIHRoaXMuZGVjb3JhdG9ycyA9IGRlY29yYXRvcnMgfHwge307XG5cblx0ICBfaGVscGVycy5yZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xuXHQgIF9kZWNvcmF0b3JzLnJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnModGhpcyk7XG5cdH1cblxuXHRIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuXHQgIGNvbnN0cnVjdG9yOiBIYW5kbGViYXJzRW52aXJvbm1lbnQsXG5cblx0ICBsb2dnZXI6IF9sb2dnZXIyWydkZWZhdWx0J10sXG5cdCAgbG9nOiBfbG9nZ2VyMlsnZGVmYXVsdCddLmxvZyxcblxuXHQgIHJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbiByZWdpc3RlckhlbHBlcihuYW1lLCBmbikge1xuXHQgICAgaWYgKF91dGlscy50b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG5cdCAgICAgIGlmIChmbikge1xuXHQgICAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGhlbHBlcnMnKTtcblx0ICAgICAgfVxuXHQgICAgICBfdXRpbHMuZXh0ZW5kKHRoaXMuaGVscGVycywgbmFtZSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcblx0ICAgIH1cblx0ICB9LFxuXHQgIHVucmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uIHVucmVnaXN0ZXJIZWxwZXIobmFtZSkge1xuXHQgICAgZGVsZXRlIHRoaXMuaGVscGVyc1tuYW1lXTtcblx0ICB9LFxuXG5cdCAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbiByZWdpc3RlclBhcnRpYWwobmFtZSwgcGFydGlhbCkge1xuXHQgICAgaWYgKF91dGlscy50b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG5cdCAgICAgIF91dGlscy5leHRlbmQodGhpcy5wYXJ0aWFscywgbmFtZSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBpZiAodHlwZW9mIHBhcnRpYWwgPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ0F0dGVtcHRpbmcgdG8gcmVnaXN0ZXIgYSBwYXJ0aWFsIGNhbGxlZCBcIicgKyBuYW1lICsgJ1wiIGFzIHVuZGVmaW5lZCcpO1xuXHQgICAgICB9XG5cdCAgICAgIHRoaXMucGFydGlhbHNbbmFtZV0gPSBwYXJ0aWFsO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgdW5yZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uIHVucmVnaXN0ZXJQYXJ0aWFsKG5hbWUpIHtcblx0ICAgIGRlbGV0ZSB0aGlzLnBhcnRpYWxzW25hbWVdO1xuXHQgIH0sXG5cblx0ICByZWdpc3RlckRlY29yYXRvcjogZnVuY3Rpb24gcmVnaXN0ZXJEZWNvcmF0b3IobmFtZSwgZm4pIHtcblx0ICAgIGlmIChfdXRpbHMudG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuXHQgICAgICBpZiAoZm4pIHtcblx0ICAgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBkZWNvcmF0b3JzJyk7XG5cdCAgICAgIH1cblx0ICAgICAgX3V0aWxzLmV4dGVuZCh0aGlzLmRlY29yYXRvcnMsIG5hbWUpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5kZWNvcmF0b3JzW25hbWVdID0gZm47XG5cdCAgICB9XG5cdCAgfSxcblx0ICB1bnJlZ2lzdGVyRGVjb3JhdG9yOiBmdW5jdGlvbiB1bnJlZ2lzdGVyRGVjb3JhdG9yKG5hbWUpIHtcblx0ICAgIGRlbGV0ZSB0aGlzLmRlY29yYXRvcnNbbmFtZV07XG5cdCAgfVxuXHR9O1xuXG5cdHZhciBsb2cgPSBfbG9nZ2VyMlsnZGVmYXVsdCddLmxvZztcblxuXHRleHBvcnRzLmxvZyA9IGxvZztcblx0ZXhwb3J0cy5jcmVhdGVGcmFtZSA9IF91dGlscy5jcmVhdGVGcmFtZTtcblx0ZXhwb3J0cy5sb2dnZXIgPSBfbG9nZ2VyMlsnZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDUgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7XG5cdGV4cG9ydHMuaW5kZXhPZiA9IGluZGV4T2Y7XG5cdGV4cG9ydHMuZXNjYXBlRXhwcmVzc2lvbiA9IGVzY2FwZUV4cHJlc3Npb247XG5cdGV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7XG5cdGV4cG9ydHMuY3JlYXRlRnJhbWUgPSBjcmVhdGVGcmFtZTtcblx0ZXhwb3J0cy5ibG9ja1BhcmFtcyA9IGJsb2NrUGFyYW1zO1xuXHRleHBvcnRzLmFwcGVuZENvbnRleHRQYXRoID0gYXBwZW5kQ29udGV4dFBhdGg7XG5cdHZhciBlc2NhcGUgPSB7XG5cdCAgJyYnOiAnJmFtcDsnLFxuXHQgICc8JzogJyZsdDsnLFxuXHQgICc+JzogJyZndDsnLFxuXHQgICdcIic6ICcmcXVvdDsnLFxuXHQgIFwiJ1wiOiAnJiN4Mjc7Jyxcblx0ICAnYCc6ICcmI3g2MDsnLFxuXHQgICc9JzogJyYjeDNEOydcblx0fTtcblxuXHR2YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2A9XS9nLFxuXHQgICAgcG9zc2libGUgPSAvWyY8PlwiJ2A9XS87XG5cblx0ZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcblx0ICByZXR1cm4gZXNjYXBlW2Nocl07XG5cdH1cblxuXHRmdW5jdGlvbiBleHRlbmQob2JqIC8qICwgLi4uc291cmNlICovKSB7XG5cdCAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0ICAgIGZvciAodmFyIGtleSBpbiBhcmd1bWVudHNbaV0pIHtcblx0ICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcmd1bWVudHNbaV0sIGtleSkpIHtcblx0ICAgICAgICBvYmpba2V5XSA9IGFyZ3VtZW50c1tpXVtrZXldO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgcmV0dXJuIG9iajtcblx0fVxuXG5cdHZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cblx0ZXhwb3J0cy50b1N0cmluZyA9IHRvU3RyaW5nO1xuXHQvLyBTb3VyY2VkIGZyb20gbG9kYXNoXG5cdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcblx0LyogZXNsaW50LWRpc2FibGUgZnVuYy1zdHlsZSAqL1xuXHR2YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcblx0ICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xuXHR9O1xuXHQvLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcblx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0aWYgKGlzRnVuY3Rpb24oL3gvKSkge1xuXHQgIGV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0ICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cdCAgfTtcblx0fVxuXHRleHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5cdC8qIGVzbGludC1lbmFibGUgZnVuYy1zdHlsZSAqL1xuXG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAodmFsdWUpIHtcblx0ICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nIDogZmFsc2U7XG5cdH07XG5cblx0ZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblx0Ly8gT2xkZXIgSUUgdmVyc2lvbnMgZG8gbm90IGRpcmVjdGx5IHN1cHBvcnQgaW5kZXhPZiBzbyB3ZSBtdXN0IGltcGxlbWVudCBvdXIgb3duLCBzYWRseS5cblxuXHRmdW5jdGlvbiBpbmRleE9mKGFycmF5LCB2YWx1ZSkge1xuXHQgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgaWYgKGFycmF5W2ldID09PSB2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gaTtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIC0xO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcblx0ICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcblx0ICAgIC8vIGRvbid0IGVzY2FwZSBTYWZlU3RyaW5ncywgc2luY2UgdGhleSdyZSBhbHJlYWR5IHNhZmVcblx0ICAgIGlmIChzdHJpbmcgJiYgc3RyaW5nLnRvSFRNTCkge1xuXHQgICAgICByZXR1cm4gc3RyaW5nLnRvSFRNTCgpO1xuXHQgICAgfSBlbHNlIGlmIChzdHJpbmcgPT0gbnVsbCkge1xuXHQgICAgICByZXR1cm4gJyc7XG5cdCAgICB9IGVsc2UgaWYgKCFzdHJpbmcpIHtcblx0ICAgICAgcmV0dXJuIHN0cmluZyArICcnO1xuXHQgICAgfVxuXG5cdCAgICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcblx0ICAgIC8vIHRoZSByZWdleCB0ZXN0IHdpbGwgZG8gdGhpcyB0cmFuc3BhcmVudGx5IGJlaGluZCB0aGUgc2NlbmVzLCBjYXVzaW5nIGlzc3VlcyBpZlxuXHQgICAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG5cdCAgICBzdHJpbmcgPSAnJyArIHN0cmluZztcblx0ICB9XG5cblx0ICBpZiAoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkge1xuXHQgICAgcmV0dXJuIHN0cmluZztcblx0ICB9XG5cdCAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKGJhZENoYXJzLCBlc2NhcGVDaGFyKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcblx0ICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSB7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVGcmFtZShvYmplY3QpIHtcblx0ICB2YXIgZnJhbWUgPSBleHRlbmQoe30sIG9iamVjdCk7XG5cdCAgZnJhbWUuX3BhcmVudCA9IG9iamVjdDtcblx0ICByZXR1cm4gZnJhbWU7XG5cdH1cblxuXHRmdW5jdGlvbiBibG9ja1BhcmFtcyhwYXJhbXMsIGlkcykge1xuXHQgIHBhcmFtcy5wYXRoID0gaWRzO1xuXHQgIHJldHVybiBwYXJhbXM7XG5cdH1cblxuXHRmdW5jdGlvbiBhcHBlbmRDb250ZXh0UGF0aChjb250ZXh0UGF0aCwgaWQpIHtcblx0ICByZXR1cm4gKGNvbnRleHRQYXRoID8gY29udGV4dFBhdGggKyAnLicgOiAnJykgKyBpZDtcblx0fVxuXG4vKioqLyB9KSxcbi8qIDYgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9PYmplY3QkZGVmaW5lUHJvcGVydHkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cblx0ZnVuY3Rpb24gRXhjZXB0aW9uKG1lc3NhZ2UsIG5vZGUpIHtcblx0ICB2YXIgbG9jID0gbm9kZSAmJiBub2RlLmxvYyxcblx0ICAgICAgbGluZSA9IHVuZGVmaW5lZCxcblx0ICAgICAgY29sdW1uID0gdW5kZWZpbmVkO1xuXHQgIGlmIChsb2MpIHtcblx0ICAgIGxpbmUgPSBsb2Muc3RhcnQubGluZTtcblx0ICAgIGNvbHVtbiA9IGxvYy5zdGFydC5jb2x1bW47XG5cblx0ICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgY29sdW1uO1xuXHQgIH1cblxuXHQgIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuXHQgIC8vIFVuZm9ydHVuYXRlbHkgZXJyb3JzIGFyZSBub3QgZW51bWVyYWJsZSBpbiBDaHJvbWUgKGF0IGxlYXN0KSwgc28gYGZvciBwcm9wIGluIHRtcGAgZG9lc24ndCB3b3JrLlxuXHQgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGVycm9yUHJvcHMubGVuZ3RoOyBpZHgrKykge1xuXHQgICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG5cdCAgfVxuXG5cdCAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0ICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcblx0ICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEV4Y2VwdGlvbik7XG5cdCAgfVxuXG5cdCAgdHJ5IHtcblx0ICAgIGlmIChsb2MpIHtcblx0ICAgICAgdGhpcy5saW5lTnVtYmVyID0gbGluZTtcblxuXHQgICAgICAvLyBXb3JrIGFyb3VuZCBpc3N1ZSB1bmRlciBzYWZhcmkgd2hlcmUgd2UgY2FuJ3QgZGlyZWN0bHkgc2V0IHRoZSBjb2x1bW4gdmFsdWVcblx0ICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICAgICAgaWYgKF9PYmplY3QkZGVmaW5lUHJvcGVydHkpIHtcblx0ICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2NvbHVtbicsIHtcblx0ICAgICAgICAgIHZhbHVlOiBjb2x1bW4sXG5cdCAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9IGNhdGNoIChub3ApIHtcblx0ICAgIC8qIElnbm9yZSBpZiB0aGUgYnJvd3NlciBpcyB2ZXJ5IHBhcnRpY3VsYXIgKi9cblx0ICB9XG5cdH1cblxuXHRFeGNlcHRpb24ucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gRXhjZXB0aW9uO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiA3ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiBfX3dlYnBhY2tfcmVxdWlyZV9fKDgpLCBfX2VzTW9kdWxlOiB0cnVlIH07XG5cbi8qKiovIH0pLFxuLyogOCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciAkID0gX193ZWJwYWNrX3JlcXVpcmVfXyg5KTtcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKXtcblx0ICByZXR1cm4gJC5zZXREZXNjKGl0LCBrZXksIGRlc2MpO1xuXHR9O1xuXG4vKioqLyB9KSxcbi8qIDkgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHR2YXIgJE9iamVjdCA9IE9iamVjdDtcblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgY3JlYXRlOiAgICAgJE9iamVjdC5jcmVhdGUsXG5cdCAgZ2V0UHJvdG86ICAgJE9iamVjdC5nZXRQcm90b3R5cGVPZixcblx0ICBpc0VudW06ICAgICB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcblx0ICBnZXREZXNjOiAgICAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcblx0ICBzZXREZXNjOiAgICAkT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuXHQgIHNldERlc2NzOiAgICRPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcblx0ICBnZXRLZXlzOiAgICAkT2JqZWN0LmtleXMsXG5cdCAgZ2V0TmFtZXM6ICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLFxuXHQgIGdldFN5bWJvbHM6ICRPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuXHQgIGVhY2g6ICAgICAgIFtdLmZvckVhY2hcblx0fTtcblxuLyoqKi8gfSksXG4vKiAxMCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLnJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMgPSByZWdpc3RlckRlZmF1bHRIZWxwZXJzO1xuXG5cdHZhciBfaGVscGVyc0Jsb2NrSGVscGVyTWlzc2luZyA9IF9fd2VicGFja19yZXF1aXJlX18oMTEpO1xuXG5cdHZhciBfaGVscGVyc0Jsb2NrSGVscGVyTWlzc2luZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzQmxvY2tIZWxwZXJNaXNzaW5nKTtcblxuXHR2YXIgX2hlbHBlcnNFYWNoID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMik7XG5cblx0dmFyIF9oZWxwZXJzRWFjaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzRWFjaCk7XG5cblx0dmFyIF9oZWxwZXJzSGVscGVyTWlzc2luZyA9IF9fd2VicGFja19yZXF1aXJlX18oMTMpO1xuXG5cdHZhciBfaGVscGVyc0hlbHBlck1pc3NpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0hlbHBlck1pc3NpbmcpO1xuXG5cdHZhciBfaGVscGVyc0lmID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNCk7XG5cblx0dmFyIF9oZWxwZXJzSWYyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0lmKTtcblxuXHR2YXIgX2hlbHBlcnNMb2cgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE1KTtcblxuXHR2YXIgX2hlbHBlcnNMb2cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0xvZyk7XG5cblx0dmFyIF9oZWxwZXJzTG9va3VwID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNik7XG5cblx0dmFyIF9oZWxwZXJzTG9va3VwMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNMb29rdXApO1xuXG5cdHZhciBfaGVscGVyc1dpdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE3KTtcblxuXHR2YXIgX2hlbHBlcnNXaXRoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNXaXRoKTtcblxuXHRmdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG5cdCAgX2hlbHBlcnNCbG9ja0hlbHBlck1pc3NpbmcyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHQgIF9oZWxwZXJzRWFjaDJbJ2RlZmF1bHQnXShpbnN0YW5jZSk7XG5cdCAgX2hlbHBlcnNIZWxwZXJNaXNzaW5nMlsnZGVmYXVsdCddKGluc3RhbmNlKTtcblx0ICBfaGVscGVyc0lmMlsnZGVmYXVsdCddKGluc3RhbmNlKTtcblx0ICBfaGVscGVyc0xvZzJbJ2RlZmF1bHQnXShpbnN0YW5jZSk7XG5cdCAgX2hlbHBlcnNMb29rdXAyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHQgIF9oZWxwZXJzV2l0aDJbJ2RlZmF1bHQnXShpbnN0YW5jZSk7XG5cdH1cblxuLyoqKi8gfSksXG4vKiAxMSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuXHQgIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbiAoY29udGV4dCwgb3B0aW9ucykge1xuXHQgICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG5cdCAgICAgICAgZm4gPSBvcHRpb25zLmZuO1xuXG5cdCAgICBpZiAoY29udGV4dCA9PT0gdHJ1ZSkge1xuXHQgICAgICByZXR1cm4gZm4odGhpcyk7XG5cdCAgICB9IGVsc2UgaWYgKGNvbnRleHQgPT09IGZhbHNlIHx8IGNvbnRleHQgPT0gbnVsbCkge1xuXHQgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcblx0ICAgIH0gZWxzZSBpZiAoX3V0aWxzLmlzQXJyYXkoY29udGV4dCkpIHtcblx0ICAgICAgaWYgKGNvbnRleHQubGVuZ3RoID4gMCkge1xuXHQgICAgICAgIGlmIChvcHRpb25zLmlkcykge1xuXHQgICAgICAgICAgb3B0aW9ucy5pZHMgPSBbb3B0aW9ucy5uYW1lXTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVycy5lYWNoKGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG5cdCAgICAgICAgdmFyIGRhdGEgPSBfdXRpbHMuY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcblx0ICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gX3V0aWxzLmFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5uYW1lKTtcblx0ICAgICAgICBvcHRpb25zID0geyBkYXRhOiBkYXRhIH07XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucyk7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMTIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uIChjb250ZXh0LCBvcHRpb25zKSB7XG5cdCAgICBpZiAoIW9wdGlvbnMpIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ011c3QgcGFzcyBpdGVyYXRvciB0byAjZWFjaCcpO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgZm4gPSBvcHRpb25zLmZuLFxuXHQgICAgICAgIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG5cdCAgICAgICAgaSA9IDAsXG5cdCAgICAgICAgcmV0ID0gJycsXG5cdCAgICAgICAgZGF0YSA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBjb250ZXh0UGF0aCA9IHVuZGVmaW5lZDtcblxuXHQgICAgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmlkcykge1xuXHQgICAgICBjb250ZXh0UGF0aCA9IF91dGlscy5hcHBlbmRDb250ZXh0UGF0aChvcHRpb25zLmRhdGEuY29udGV4dFBhdGgsIG9wdGlvbnMuaWRzWzBdKSArICcuJztcblx0ICAgIH1cblxuXHQgICAgaWYgKF91dGlscy5pc0Z1bmN0aW9uKGNvbnRleHQpKSB7XG5cdCAgICAgIGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChvcHRpb25zLmRhdGEpIHtcblx0ICAgICAgZGF0YSA9IF91dGlscy5jcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBleGVjSXRlcmF0aW9uKGZpZWxkLCBpbmRleCwgbGFzdCkge1xuXHQgICAgICBpZiAoZGF0YSkge1xuXHQgICAgICAgIGRhdGEua2V5ID0gZmllbGQ7XG5cdCAgICAgICAgZGF0YS5pbmRleCA9IGluZGV4O1xuXHQgICAgICAgIGRhdGEuZmlyc3QgPSBpbmRleCA9PT0gMDtcblx0ICAgICAgICBkYXRhLmxhc3QgPSAhIWxhc3Q7XG5cblx0ICAgICAgICBpZiAoY29udGV4dFBhdGgpIHtcblx0ICAgICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBjb250ZXh0UGF0aCArIGZpZWxkO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRbZmllbGRdLCB7XG5cdCAgICAgICAgZGF0YTogZGF0YSxcblx0ICAgICAgICBibG9ja1BhcmFtczogX3V0aWxzLmJsb2NrUGFyYW1zKFtjb250ZXh0W2ZpZWxkXSwgZmllbGRdLCBbY29udGV4dFBhdGggKyBmaWVsZCwgbnVsbF0pXG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dCA9PT0gJ29iamVjdCcpIHtcblx0ICAgICAgaWYgKF91dGlscy5pc0FycmF5KGNvbnRleHQpKSB7XG5cdCAgICAgICAgZm9yICh2YXIgaiA9IGNvbnRleHQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdCAgICAgICAgICBpZiAoaSBpbiBjb250ZXh0KSB7XG5cdCAgICAgICAgICAgIGV4ZWNJdGVyYXRpb24oaSwgaSwgaSA9PT0gY29udGV4dC5sZW5ndGggLSAxKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFyIHByaW9yS2V5ID0gdW5kZWZpbmVkO1xuXG5cdCAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbnRleHQpIHtcblx0ICAgICAgICAgIGlmIChjb250ZXh0Lmhhc093blByb3BlcnR5KGtleSkpIHtcblx0ICAgICAgICAgICAgLy8gV2UncmUgcnVubmluZyB0aGUgaXRlcmF0aW9ucyBvbmUgc3RlcCBvdXQgb2Ygc3luYyBzbyB3ZSBjYW4gZGV0ZWN0XG5cdCAgICAgICAgICAgIC8vIHRoZSBsYXN0IGl0ZXJhdGlvbiB3aXRob3V0IGhhdmUgdG8gc2NhbiB0aGUgb2JqZWN0IHR3aWNlIGFuZCBjcmVhdGVcblx0ICAgICAgICAgICAgLy8gYW4gaXRlcm1lZGlhdGUga2V5cyBhcnJheS5cblx0ICAgICAgICAgICAgaWYgKHByaW9yS2V5ICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcHJpb3JLZXkgPSBrZXk7XG5cdCAgICAgICAgICAgIGkrKztcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKHByaW9yS2V5ICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgIGV4ZWNJdGVyYXRpb24ocHJpb3JLZXksIGkgLSAxLCB0cnVlKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgaWYgKGkgPT09IDApIHtcblx0ICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHJldDtcblx0ICB9KTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAxMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfZXhjZXB0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHR2YXIgX2V4Y2VwdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leGNlcHRpb24pO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuXHQgIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdoZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24gKCkgLyogW2FyZ3MsIF1vcHRpb25zICove1xuXHQgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0ICAgICAgLy8gQSBtaXNzaW5nIGZpZWxkIGluIGEge3tmb299fSBjb25zdHJ1Y3QuXG5cdCAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAvLyBTb21lb25lIGlzIGFjdHVhbGx5IHRyeWluZyB0byBjYWxsIHNvbWV0aGluZywgYmxvdyB1cC5cblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ01pc3NpbmcgaGVscGVyOiBcIicgKyBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdLm5hbWUgKyAnXCInKTtcblx0ICAgIH1cblx0ICB9KTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAxNCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuXHQgIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdpZicsIGZ1bmN0aW9uIChjb25kaXRpb25hbCwgb3B0aW9ucykge1xuXHQgICAgaWYgKF91dGlscy5pc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkge1xuXHQgICAgICBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7XG5cdCAgICB9XG5cblx0ICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cblx0ICAgIC8vIFRoZSBgaW5jbHVkZVplcm9gIG9wdGlvbiBtYXkgYmUgc2V0IHRvIHRyZWF0IHRoZSBjb25kdGlvbmFsIGFzIHB1cmVseSBub3QgZW1wdHkgYmFzZWQgb24gdGhlXG5cdCAgICAvLyBiZWhhdmlvciBvZiBpc0VtcHR5LiBFZmZlY3RpdmVseSB0aGlzIGRldGVybWluZXMgaWYgMCBpcyBoYW5kbGVkIGJ5IHRoZSBwb3NpdGl2ZSBwYXRoIG9yIG5lZ2F0aXZlLlxuXHQgICAgaWYgKCFvcHRpb25zLmhhc2guaW5jbHVkZVplcm8gJiYgIWNvbmRpdGlvbmFsIHx8IF91dGlscy5pc0VtcHR5KGNvbmRpdGlvbmFsKSkge1xuXHQgICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuIG9wdGlvbnMuZm4odGhpcyk7XG5cdCAgICB9XG5cdCAgfSk7XG5cblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcigndW5sZXNzJywgZnVuY3Rpb24gKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG5cdCAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7IGZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaCB9KTtcblx0ICB9KTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAxNSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuXHQgIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb2cnLCBmdW5jdGlvbiAoKSAvKiBtZXNzYWdlLCBvcHRpb25zICove1xuXHQgICAgdmFyIGFyZ3MgPSBbdW5kZWZpbmVkXSxcblx0ICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkrKykge1xuXHQgICAgICBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGxldmVsID0gMTtcblx0ICAgIGlmIChvcHRpb25zLmhhc2gubGV2ZWwgIT0gbnVsbCkge1xuXHQgICAgICBsZXZlbCA9IG9wdGlvbnMuaGFzaC5sZXZlbDtcblx0ICAgIH0gZWxzZSBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YS5sZXZlbCAhPSBudWxsKSB7XG5cdCAgICAgIGxldmVsID0gb3B0aW9ucy5kYXRhLmxldmVsO1xuXHQgICAgfVxuXHQgICAgYXJnc1swXSA9IGxldmVsO1xuXG5cdCAgICBpbnN0YW5jZS5sb2cuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuXHQgIH0pO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDE2ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvb2t1cCcsIGZ1bmN0aW9uIChvYmosIGZpZWxkKSB7XG5cdCAgICByZXR1cm4gb2JqICYmIG9ialtmaWVsZF07XG5cdCAgfSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMTcgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uIChjb250ZXh0LCBvcHRpb25zKSB7XG5cdCAgICBpZiAoX3V0aWxzLmlzRnVuY3Rpb24oY29udGV4dCkpIHtcblx0ICAgICAgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGZuID0gb3B0aW9ucy5mbjtcblxuXHQgICAgaWYgKCFfdXRpbHMuaXNFbXB0eShjb250ZXh0KSkge1xuXHQgICAgICB2YXIgZGF0YSA9IG9wdGlvbnMuZGF0YTtcblx0ICAgICAgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmlkcykge1xuXHQgICAgICAgIGRhdGEgPSBfdXRpbHMuY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcblx0ICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gX3V0aWxzLmFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIHtcblx0ICAgICAgICBkYXRhOiBkYXRhLFxuXHQgICAgICAgIGJsb2NrUGFyYW1zOiBfdXRpbHMuYmxvY2tQYXJhbXMoW2NvbnRleHRdLCBbZGF0YSAmJiBkYXRhLmNvbnRleHRQYXRoXSlcblx0ICAgICAgfSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDE4ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMucmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyA9IHJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnM7XG5cblx0dmFyIF9kZWNvcmF0b3JzSW5saW5lID0gX193ZWJwYWNrX3JlcXVpcmVfXygxOSk7XG5cblx0dmFyIF9kZWNvcmF0b3JzSW5saW5lMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlY29yYXRvcnNJbmxpbmUpO1xuXG5cdGZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnMoaW5zdGFuY2UpIHtcblx0ICBfZGVjb3JhdG9yc0lubGluZTJbJ2RlZmF1bHQnXShpbnN0YW5jZSk7XG5cdH1cblxuLyoqKi8gfSksXG4vKiAxOSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuXHQgIGluc3RhbmNlLnJlZ2lzdGVyRGVjb3JhdG9yKCdpbmxpbmUnLCBmdW5jdGlvbiAoZm4sIHByb3BzLCBjb250YWluZXIsIG9wdGlvbnMpIHtcblx0ICAgIHZhciByZXQgPSBmbjtcblx0ICAgIGlmICghcHJvcHMucGFydGlhbHMpIHtcblx0ICAgICAgcHJvcHMucGFydGlhbHMgPSB7fTtcblx0ICAgICAgcmV0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG9wdGlvbnMpIHtcblx0ICAgICAgICAvLyBDcmVhdGUgYSBuZXcgcGFydGlhbHMgc3RhY2sgZnJhbWUgcHJpb3IgdG8gZXhlYy5cblx0ICAgICAgICB2YXIgb3JpZ2luYWwgPSBjb250YWluZXIucGFydGlhbHM7XG5cdCAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gX3V0aWxzLmV4dGVuZCh7fSwgb3JpZ2luYWwsIHByb3BzLnBhcnRpYWxzKTtcblx0ICAgICAgICB2YXIgcmV0ID0gZm4oY29udGV4dCwgb3B0aW9ucyk7XG5cdCAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gb3JpZ2luYWw7XG5cdCAgICAgICAgcmV0dXJuIHJldDtcblx0ICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgcHJvcHMucGFydGlhbHNbb3B0aW9ucy5hcmdzWzBdXSA9IG9wdGlvbnMuZm47XG5cblx0ICAgIHJldHVybiByZXQ7XG5cdCAgfSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMjAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHR2YXIgbG9nZ2VyID0ge1xuXHQgIG1ldGhvZE1hcDogWydkZWJ1ZycsICdpbmZvJywgJ3dhcm4nLCAnZXJyb3InXSxcblx0ICBsZXZlbDogJ2luZm8nLFxuXG5cdCAgLy8gTWFwcyBhIGdpdmVuIGxldmVsIHZhbHVlIHRvIHRoZSBgbWV0aG9kTWFwYCBpbmRleGVzIGFib3ZlLlxuXHQgIGxvb2t1cExldmVsOiBmdW5jdGlvbiBsb29rdXBMZXZlbChsZXZlbCkge1xuXHQgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgdmFyIGxldmVsTWFwID0gX3V0aWxzLmluZGV4T2YobG9nZ2VyLm1ldGhvZE1hcCwgbGV2ZWwudG9Mb3dlckNhc2UoKSk7XG5cdCAgICAgIGlmIChsZXZlbE1hcCA+PSAwKSB7XG5cdCAgICAgICAgbGV2ZWwgPSBsZXZlbE1hcDtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBsZXZlbCA9IHBhcnNlSW50KGxldmVsLCAxMCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGxldmVsO1xuXHQgIH0sXG5cblx0ICAvLyBDYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgaG9zdCBlbnZpcm9ubWVudFxuXHQgIGxvZzogZnVuY3Rpb24gbG9nKGxldmVsKSB7XG5cdCAgICBsZXZlbCA9IGxvZ2dlci5sb29rdXBMZXZlbChsZXZlbCk7XG5cblx0ICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbG9nZ2VyLmxvb2t1cExldmVsKGxvZ2dlci5sZXZlbCkgPD0gbGV2ZWwpIHtcblx0ICAgICAgdmFyIG1ldGhvZCA9IGxvZ2dlci5tZXRob2RNYXBbbGV2ZWxdO1xuXHQgICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kXSkge1xuXHQgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuXHQgICAgICAgIG1ldGhvZCA9ICdsb2cnO1xuXHQgICAgICB9XG5cblx0ICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIG1lc3NhZ2UgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICAgICAgbWVzc2FnZVtfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgICAgIH1cblxuXHQgICAgICBjb25zb2xlW21ldGhvZF0uYXBwbHkoY29uc29sZSwgbWVzc2FnZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuXHQgICAgfVxuXHQgIH1cblx0fTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBsb2dnZXI7XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDIxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0Ly8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG5cdCAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG5cdH1cblxuXHRTYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IFNhZmVTdHJpbmcucHJvdG90eXBlLnRvSFRNTCA9IGZ1bmN0aW9uICgpIHtcblx0ICByZXR1cm4gJycgKyB0aGlzLnN0cmluZztcblx0fTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBTYWZlU3RyaW5nO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAyMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX09iamVjdCRzZWFsID0gX193ZWJwYWNrX3JlcXVpcmVfXygyMylbJ2RlZmF1bHQnXTtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpWydkZWZhdWx0J107XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjtcblx0ZXhwb3J0cy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuXHRleHBvcnRzLndyYXBQcm9ncmFtID0gd3JhcFByb2dyYW07XG5cdGV4cG9ydHMucmVzb2x2ZVBhcnRpYWwgPSByZXNvbHZlUGFydGlhbDtcblx0ZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtcblx0ZXhwb3J0cy5ub29wID0gbm9vcDtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHR2YXIgVXRpbHMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfdXRpbHMpO1xuXG5cdHZhciBfZXhjZXB0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHR2YXIgX2V4Y2VwdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leGNlcHRpb24pO1xuXG5cdHZhciBfYmFzZSA9IF9fd2VicGFja19yZXF1aXJlX18oNCk7XG5cblx0ZnVuY3Rpb24gY2hlY2tSZXZpc2lvbihjb21waWxlckluZm8pIHtcblx0ICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcblx0ICAgICAgY3VycmVudFJldmlzaW9uID0gX2Jhc2UuQ09NUElMRVJfUkVWSVNJT047XG5cblx0ICBpZiAoY29tcGlsZXJSZXZpc2lvbiAhPT0gY3VycmVudFJldmlzaW9uKSB7XG5cdCAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuXHQgICAgICB2YXIgcnVudGltZVZlcnNpb25zID0gX2Jhc2UuUkVWSVNJT05fQ0hBTkdFU1tjdXJyZW50UmV2aXNpb25dLFxuXHQgICAgICAgICAgY29tcGlsZXJWZXJzaW9ucyA9IF9iYXNlLlJFVklTSU9OX0NIQU5HRVNbY29tcGlsZXJSZXZpc2lvbl07XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiAnICsgJ1BsZWFzZSB1cGRhdGUgeW91ciBwcmVjb21waWxlciB0byBhIG5ld2VyIHZlcnNpb24gKCcgKyBydW50aW1lVmVyc2lvbnMgKyAnKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKCcgKyBjb21waWxlclZlcnNpb25zICsgJykuJyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAvLyBVc2UgdGhlIGVtYmVkZGVkIHZlcnNpb24gaW5mbyBzaW5jZSB0aGUgcnVudGltZSBkb2Vzbid0IGtub3cgYWJvdXQgdGhpcyByZXZpc2lvbiB5ZXRcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1RlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGEgbmV3ZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gJyArICdQbGVhc2UgdXBkYXRlIHlvdXIgcnVudGltZSB0byBhIG5ld2VyIHZlcnNpb24gKCcgKyBjb21waWxlckluZm9bMV0gKyAnKS4nKTtcblx0ICAgIH1cblx0ICB9XG5cdH1cblxuXHRmdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuXHQgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgaWYgKCFlbnYpIHtcblx0ICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGUnKTtcblx0ICB9XG5cdCAgaWYgKCF0ZW1wbGF0ZVNwZWMgfHwgIXRlbXBsYXRlU3BlYy5tYWluKSB7XG5cdCAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVW5rbm93biB0ZW1wbGF0ZSBvYmplY3Q6ICcgKyB0eXBlb2YgdGVtcGxhdGVTcGVjKTtcblx0ICB9XG5cblx0ICB0ZW1wbGF0ZVNwZWMubWFpbi5kZWNvcmF0b3IgPSB0ZW1wbGF0ZVNwZWMubWFpbl9kO1xuXG5cdCAgLy8gTm90ZTogVXNpbmcgZW52LlZNIHJlZmVyZW5jZXMgcmF0aGVyIHRoYW4gbG9jYWwgdmFyIHJlZmVyZW5jZXMgdGhyb3VnaG91dCB0aGlzIHNlY3Rpb24gdG8gYWxsb3dcblx0ICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuXHQgIGVudi5WTS5jaGVja1JldmlzaW9uKHRlbXBsYXRlU3BlYy5jb21waWxlcik7XG5cblx0ICBmdW5jdGlvbiBpbnZva2VQYXJ0aWFsV3JhcHBlcihwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG5cdCAgICBpZiAob3B0aW9ucy5oYXNoKSB7XG5cdCAgICAgIGNvbnRleHQgPSBVdGlscy5leHRlbmQoe30sIGNvbnRleHQsIG9wdGlvbnMuaGFzaCk7XG5cdCAgICAgIGlmIChvcHRpb25zLmlkcykge1xuXHQgICAgICAgIG9wdGlvbnMuaWRzWzBdID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBwYXJ0aWFsID0gZW52LlZNLnJlc29sdmVQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG5cdCAgICB2YXIgcmVzdWx0ID0gZW52LlZNLmludm9rZVBhcnRpYWwuY2FsbCh0aGlzLCBwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKTtcblxuXHQgICAgaWYgKHJlc3VsdCA9PSBudWxsICYmIGVudi5jb21waWxlKSB7XG5cdCAgICAgIG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXSA9IGVudi5jb21waWxlKHBhcnRpYWwsIHRlbXBsYXRlU3BlYy5jb21waWxlck9wdGlvbnMsIGVudik7XG5cdCAgICAgIHJlc3VsdCA9IG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXShjb250ZXh0LCBvcHRpb25zKTtcblx0ICAgIH1cblx0ICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuXHQgICAgICBpZiAob3B0aW9ucy5pbmRlbnQpIHtcblx0ICAgICAgICB2YXIgbGluZXMgPSByZXN1bHQuc3BsaXQoJ1xcbicpO1xuXHQgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGluZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgICAgICBpZiAoIWxpbmVzW2ldICYmIGkgKyAxID09PSBsKSB7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgfVxuXG5cdCAgICAgICAgICBsaW5lc1tpXSA9IG9wdGlvbnMuaW5kZW50ICsgbGluZXNbaV07XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJlc3VsdCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiByZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVGhlIHBhcnRpYWwgJyArIG9wdGlvbnMubmFtZSArICcgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZScpO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIC8vIEp1c3QgYWRkIHdhdGVyXG5cdCAgdmFyIGNvbnRhaW5lciA9IHtcblx0ICAgIHN0cmljdDogZnVuY3Rpb24gc3RyaWN0KG9iaiwgbmFtZSkge1xuXHQgICAgICBpZiAoIShuYW1lIGluIG9iaikpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnXCInICsgbmFtZSArICdcIiBub3QgZGVmaW5lZCBpbiAnICsgb2JqKTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gb2JqW25hbWVdO1xuXHQgICAgfSxcblx0ICAgIGxvb2t1cDogZnVuY3Rpb24gbG9va3VwKGRlcHRocywgbmFtZSkge1xuXHQgICAgICB2YXIgbGVuID0gZGVwdGhzLmxlbmd0aDtcblx0ICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICAgIGlmIChkZXB0aHNbaV0gJiYgZGVwdGhzW2ldW25hbWVdICE9IG51bGwpIHtcblx0ICAgICAgICAgIHJldHVybiBkZXB0aHNbaV1bbmFtZV07XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9LFxuXHQgICAgbGFtYmRhOiBmdW5jdGlvbiBsYW1iZGEoY3VycmVudCwgY29udGV4dCkge1xuXHQgICAgICByZXR1cm4gdHlwZW9mIGN1cnJlbnQgPT09ICdmdW5jdGlvbicgPyBjdXJyZW50LmNhbGwoY29udGV4dCkgOiBjdXJyZW50O1xuXHQgICAgfSxcblxuXHQgICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcblx0ICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuXG5cdCAgICBmbjogZnVuY3Rpb24gZm4oaSkge1xuXHQgICAgICB2YXIgcmV0ID0gdGVtcGxhdGVTcGVjW2ldO1xuXHQgICAgICByZXQuZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjW2kgKyAnX2QnXTtcblx0ICAgICAgcmV0dXJuIHJldDtcblx0ICAgIH0sXG5cblx0ICAgIHByb2dyYW1zOiBbXSxcblx0ICAgIHByb2dyYW06IGZ1bmN0aW9uIHByb2dyYW0oaSwgZGF0YSwgZGVjbGFyZWRCbG9ja1BhcmFtcywgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuXHQgICAgICB2YXIgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldLFxuXHQgICAgICAgICAgZm4gPSB0aGlzLmZuKGkpO1xuXHQgICAgICBpZiAoZGF0YSB8fCBkZXB0aHMgfHwgYmxvY2tQYXJhbXMgfHwgZGVjbGFyZWRCbG9ja1BhcmFtcykge1xuXHQgICAgICAgIHByb2dyYW1XcmFwcGVyID0gd3JhcFByb2dyYW0odGhpcywgaSwgZm4sIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuXHQgICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuXHQgICAgICAgIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSA9IHdyYXBQcm9ncmFtKHRoaXMsIGksIGZuKTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gcHJvZ3JhbVdyYXBwZXI7XG5cdCAgICB9LFxuXG5cdCAgICBkYXRhOiBmdW5jdGlvbiBkYXRhKHZhbHVlLCBkZXB0aCkge1xuXHQgICAgICB3aGlsZSAodmFsdWUgJiYgZGVwdGgtLSkge1xuXHQgICAgICAgIHZhbHVlID0gdmFsdWUuX3BhcmVudDtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gdmFsdWU7XG5cdCAgICB9LFxuXHQgICAgbWVyZ2U6IGZ1bmN0aW9uIG1lcmdlKHBhcmFtLCBjb21tb24pIHtcblx0ICAgICAgdmFyIG9iaiA9IHBhcmFtIHx8IGNvbW1vbjtcblxuXHQgICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIHBhcmFtICE9PSBjb21tb24pIHtcblx0ICAgICAgICBvYmogPSBVdGlscy5leHRlbmQoe30sIGNvbW1vbiwgcGFyYW0pO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIG9iajtcblx0ICAgIH0sXG5cdCAgICAvLyBBbiBlbXB0eSBvYmplY3QgdG8gdXNlIGFzIHJlcGxhY2VtZW50IGZvciBudWxsLWNvbnRleHRzXG5cdCAgICBudWxsQ29udGV4dDogX09iamVjdCRzZWFsKHt9KSxcblxuXHQgICAgbm9vcDogZW52LlZNLm5vb3AsXG5cdCAgICBjb21waWxlckluZm86IHRlbXBsYXRlU3BlYy5jb21waWxlclxuXHQgIH07XG5cblx0ICBmdW5jdGlvbiByZXQoY29udGV4dCkge1xuXHQgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuXHQgICAgdmFyIGRhdGEgPSBvcHRpb25zLmRhdGE7XG5cblx0ICAgIHJldC5fc2V0dXAob3B0aW9ucyk7XG5cdCAgICBpZiAoIW9wdGlvbnMucGFydGlhbCAmJiB0ZW1wbGF0ZVNwZWMudXNlRGF0YSkge1xuXHQgICAgICBkYXRhID0gaW5pdERhdGEoY29udGV4dCwgZGF0YSk7XG5cdCAgICB9XG5cdCAgICB2YXIgZGVwdGhzID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGJsb2NrUGFyYW1zID0gdGVtcGxhdGVTcGVjLnVzZUJsb2NrUGFyYW1zID8gW10gOiB1bmRlZmluZWQ7XG5cdCAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocykge1xuXHQgICAgICBpZiAob3B0aW9ucy5kZXB0aHMpIHtcblx0ICAgICAgICBkZXB0aHMgPSBjb250ZXh0ICE9IG9wdGlvbnMuZGVwdGhzWzBdID8gW2NvbnRleHRdLmNvbmNhdChvcHRpb25zLmRlcHRocykgOiBvcHRpb25zLmRlcHRocztcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBkZXB0aHMgPSBbY29udGV4dF07XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gbWFpbihjb250ZXh0IC8qLCBvcHRpb25zKi8pIHtcblx0ICAgICAgcmV0dXJuICcnICsgdGVtcGxhdGVTcGVjLm1haW4oY29udGFpbmVyLCBjb250ZXh0LCBjb250YWluZXIuaGVscGVycywgY29udGFpbmVyLnBhcnRpYWxzLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcblx0ICAgIH1cblx0ICAgIG1haW4gPSBleGVjdXRlRGVjb3JhdG9ycyh0ZW1wbGF0ZVNwZWMubWFpbiwgbWFpbiwgY29udGFpbmVyLCBvcHRpb25zLmRlcHRocyB8fCBbXSwgZGF0YSwgYmxvY2tQYXJhbXMpO1xuXHQgICAgcmV0dXJuIG1haW4oY29udGV4dCwgb3B0aW9ucyk7XG5cdCAgfVxuXHQgIHJldC5pc1RvcCA9IHRydWU7XG5cblx0ICByZXQuX3NldHVwID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0ICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG5cdCAgICAgIGNvbnRhaW5lci5oZWxwZXJzID0gY29udGFpbmVyLm1lcmdlKG9wdGlvbnMuaGVscGVycywgZW52LmhlbHBlcnMpO1xuXG5cdCAgICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlUGFydGlhbCkge1xuXHQgICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLnBhcnRpYWxzLCBlbnYucGFydGlhbHMpO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlUGFydGlhbCB8fCB0ZW1wbGF0ZVNwZWMudXNlRGVjb3JhdG9ycykge1xuXHQgICAgICAgIGNvbnRhaW5lci5kZWNvcmF0b3JzID0gY29udGFpbmVyLm1lcmdlKG9wdGlvbnMuZGVjb3JhdG9ycywgZW52LmRlY29yYXRvcnMpO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBjb250YWluZXIuaGVscGVycyA9IG9wdGlvbnMuaGVscGVycztcblx0ICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gb3B0aW9ucy5wYXJ0aWFscztcblx0ICAgICAgY29udGFpbmVyLmRlY29yYXRvcnMgPSBvcHRpb25zLmRlY29yYXRvcnM7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIHJldC5fY2hpbGQgPSBmdW5jdGlvbiAoaSwgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuXHQgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VCbG9ja1BhcmFtcyAmJiAhYmxvY2tQYXJhbXMpIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ211c3QgcGFzcyBibG9jayBwYXJhbXMnKTtcblx0ICAgIH1cblx0ICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlRGVwdGhzICYmICFkZXB0aHMpIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ211c3QgcGFzcyBwYXJlbnQgZGVwdGhzJyk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB3cmFwUHJvZ3JhbShjb250YWluZXIsIGksIHRlbXBsYXRlU3BlY1tpXSwgZGF0YSwgMCwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG5cdCAgfTtcblx0ICByZXR1cm4gcmV0O1xuXHR9XG5cblx0ZnVuY3Rpb24gd3JhcFByb2dyYW0oY29udGFpbmVyLCBpLCBmbiwgZGF0YSwgZGVjbGFyZWRCbG9ja1BhcmFtcywgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuXHQgIGZ1bmN0aW9uIHByb2coY29udGV4dCkge1xuXHQgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuXHQgICAgdmFyIGN1cnJlbnREZXB0aHMgPSBkZXB0aHM7XG5cdCAgICBpZiAoZGVwdGhzICYmIGNvbnRleHQgIT0gZGVwdGhzWzBdICYmICEoY29udGV4dCA9PT0gY29udGFpbmVyLm51bGxDb250ZXh0ICYmIGRlcHRoc1swXSA9PT0gbnVsbCkpIHtcblx0ICAgICAgY3VycmVudERlcHRocyA9IFtjb250ZXh0XS5jb25jYXQoZGVwdGhzKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGZuKGNvbnRhaW5lciwgY29udGV4dCwgY29udGFpbmVyLmhlbHBlcnMsIGNvbnRhaW5lci5wYXJ0aWFscywgb3B0aW9ucy5kYXRhIHx8IGRhdGEsIGJsb2NrUGFyYW1zICYmIFtvcHRpb25zLmJsb2NrUGFyYW1zXS5jb25jYXQoYmxvY2tQYXJhbXMpLCBjdXJyZW50RGVwdGhzKTtcblx0ICB9XG5cblx0ICBwcm9nID0gZXhlY3V0ZURlY29yYXRvcnMoZm4sIHByb2csIGNvbnRhaW5lciwgZGVwdGhzLCBkYXRhLCBibG9ja1BhcmFtcyk7XG5cblx0ICBwcm9nLnByb2dyYW0gPSBpO1xuXHQgIHByb2cuZGVwdGggPSBkZXB0aHMgPyBkZXB0aHMubGVuZ3RoIDogMDtcblx0ICBwcm9nLmJsb2NrUGFyYW1zID0gZGVjbGFyZWRCbG9ja1BhcmFtcyB8fCAwO1xuXHQgIHJldHVybiBwcm9nO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVzb2x2ZVBhcnRpYWwocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuXHQgIGlmICghcGFydGlhbCkge1xuXHQgICAgaWYgKG9wdGlvbnMubmFtZSA9PT0gJ0BwYXJ0aWFsLWJsb2NrJykge1xuXHQgICAgICBwYXJ0aWFsID0gb3B0aW9ucy5kYXRhWydwYXJ0aWFsLWJsb2NrJ107XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdO1xuXHQgICAgfVxuXHQgIH0gZWxzZSBpZiAoIXBhcnRpYWwuY2FsbCAmJiAhb3B0aW9ucy5uYW1lKSB7XG5cdCAgICAvLyBUaGlzIGlzIGEgZHluYW1pYyBwYXJ0aWFsIHRoYXQgcmV0dXJuZWQgYSBzdHJpbmdcblx0ICAgIG9wdGlvbnMubmFtZSA9IHBhcnRpYWw7XG5cdCAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1twYXJ0aWFsXTtcblx0ICB9XG5cdCAgcmV0dXJuIHBhcnRpYWw7XG5cdH1cblxuXHRmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcblx0ICAvLyBVc2UgdGhlIGN1cnJlbnQgY2xvc3VyZSBjb250ZXh0IHRvIHNhdmUgdGhlIHBhcnRpYWwtYmxvY2sgaWYgdGhpcyBwYXJ0aWFsXG5cdCAgdmFyIGN1cnJlbnRQYXJ0aWFsQmxvY2sgPSBvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5kYXRhWydwYXJ0aWFsLWJsb2NrJ107XG5cdCAgb3B0aW9ucy5wYXJ0aWFsID0gdHJ1ZTtcblx0ICBpZiAob3B0aW9ucy5pZHMpIHtcblx0ICAgIG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCA9IG9wdGlvbnMuaWRzWzBdIHx8IG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aDtcblx0ICB9XG5cblx0ICB2YXIgcGFydGlhbEJsb2NrID0gdW5kZWZpbmVkO1xuXHQgIGlmIChvcHRpb25zLmZuICYmIG9wdGlvbnMuZm4gIT09IG5vb3ApIHtcblx0ICAgIChmdW5jdGlvbiAoKSB7XG5cdCAgICAgIG9wdGlvbnMuZGF0YSA9IF9iYXNlLmNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG5cdCAgICAgIC8vIFdyYXBwZXIgZnVuY3Rpb24gdG8gZ2V0IGFjY2VzcyB0byBjdXJyZW50UGFydGlhbEJsb2NrIGZyb20gdGhlIGNsb3N1cmVcblx0ICAgICAgdmFyIGZuID0gb3B0aW9ucy5mbjtcblx0ICAgICAgcGFydGlhbEJsb2NrID0gb3B0aW9ucy5kYXRhWydwYXJ0aWFsLWJsb2NrJ10gPSBmdW5jdGlvbiBwYXJ0aWFsQmxvY2tXcmFwcGVyKGNvbnRleHQpIHtcblx0ICAgICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG5cdCAgICAgICAgLy8gUmVzdG9yZSB0aGUgcGFydGlhbC1ibG9jayBmcm9tIHRoZSBjbG9zdXJlIGZvciB0aGUgZXhlY3V0aW9uIG9mIHRoZSBibG9ja1xuXHQgICAgICAgIC8vIGkuZS4gdGhlIHBhcnQgaW5zaWRlIHRoZSBibG9jayBvZiB0aGUgcGFydGlhbCBjYWxsLlxuXHQgICAgICAgIG9wdGlvbnMuZGF0YSA9IF9iYXNlLmNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG5cdCAgICAgICAgb3B0aW9ucy5kYXRhWydwYXJ0aWFsLWJsb2NrJ10gPSBjdXJyZW50UGFydGlhbEJsb2NrO1xuXHQgICAgICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zKTtcblx0ICAgICAgfTtcblx0ICAgICAgaWYgKGZuLnBhcnRpYWxzKSB7XG5cdCAgICAgICAgb3B0aW9ucy5wYXJ0aWFscyA9IFV0aWxzLmV4dGVuZCh7fSwgb3B0aW9ucy5wYXJ0aWFscywgZm4ucGFydGlhbHMpO1xuXHQgICAgICB9XG5cdCAgICB9KSgpO1xuXHQgIH1cblxuXHQgIGlmIChwYXJ0aWFsID09PSB1bmRlZmluZWQgJiYgcGFydGlhbEJsb2NrKSB7XG5cdCAgICBwYXJ0aWFsID0gcGFydGlhbEJsb2NrO1xuXHQgIH1cblxuXHQgIGlmIChwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcblx0ICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdUaGUgcGFydGlhbCAnICsgb3B0aW9ucy5uYW1lICsgJyBjb3VsZCBub3QgYmUgZm91bmQnKTtcblx0ICB9IGVsc2UgaWYgKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuXHQgICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG5cdCAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gbm9vcCgpIHtcblx0ICByZXR1cm4gJyc7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0RGF0YShjb250ZXh0LCBkYXRhKSB7XG5cdCAgaWYgKCFkYXRhIHx8ICEoJ3Jvb3QnIGluIGRhdGEpKSB7XG5cdCAgICBkYXRhID0gZGF0YSA/IF9iYXNlLmNyZWF0ZUZyYW1lKGRhdGEpIDoge307XG5cdCAgICBkYXRhLnJvb3QgPSBjb250ZXh0O1xuXHQgIH1cblx0ICByZXR1cm4gZGF0YTtcblx0fVxuXG5cdGZ1bmN0aW9uIGV4ZWN1dGVEZWNvcmF0b3JzKGZuLCBwcm9nLCBjb250YWluZXIsIGRlcHRocywgZGF0YSwgYmxvY2tQYXJhbXMpIHtcblx0ICBpZiAoZm4uZGVjb3JhdG9yKSB7XG5cdCAgICB2YXIgcHJvcHMgPSB7fTtcblx0ICAgIHByb2cgPSBmbi5kZWNvcmF0b3IocHJvZywgcHJvcHMsIGNvbnRhaW5lciwgZGVwdGhzICYmIGRlcHRoc1swXSwgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG5cdCAgICBVdGlscy5leHRlbmQocHJvZywgcHJvcHMpO1xuXHQgIH1cblx0ICByZXR1cm4gcHJvZztcblx0fVxuXG4vKioqLyB9KSxcbi8qIDIzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiBfX3dlYnBhY2tfcmVxdWlyZV9fKDI0KSwgX19lc01vZHVsZTogdHJ1ZSB9O1xuXG4vKioqLyB9KSxcbi8qIDI0ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0X193ZWJwYWNrX3JlcXVpcmVfXygyNSk7XG5cdG1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMCkuT2JqZWN0LnNlYWw7XG5cbi8qKiovIH0pLFxuLyogMjUgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvLyAxOS4xLjIuMTcgT2JqZWN0LnNlYWwoTylcblx0dmFyIGlzT2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygyNik7XG5cblx0X193ZWJwYWNrX3JlcXVpcmVfXygyNykoJ3NlYWwnLCBmdW5jdGlvbigkc2VhbCl7XG5cdCAgcmV0dXJuIGZ1bmN0aW9uIHNlYWwoaXQpe1xuXHQgICAgcmV0dXJuICRzZWFsICYmIGlzT2JqZWN0KGl0KSA/ICRzZWFsKGl0KSA6IGl0O1xuXHQgIH07XG5cdH0pO1xuXG4vKioqLyB9KSxcbi8qIDI2ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG5cdCAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcblx0fTtcblxuLyoqKi8gfSksXG4vKiAyNyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8vIG1vc3QgT2JqZWN0IG1ldGhvZHMgYnkgRVM2IHNob3VsZCBhY2NlcHQgcHJpbWl0aXZlc1xuXHR2YXIgJGV4cG9ydCA9IF9fd2VicGFja19yZXF1aXJlX18oMjgpXG5cdCAgLCBjb3JlICAgID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMClcblx0ICAsIGZhaWxzICAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMzKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVksIGV4ZWMpe1xuXHQgIHZhciBmbiAgPSAoY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cblx0ICAgICwgZXhwID0ge307XG5cdCAgZXhwW0tFWV0gPSBleGVjKGZuKTtcblx0ICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uKCl7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG5cdH07XG5cbi8qKiovIH0pLFxuLyogMjggKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgZ2xvYmFsICAgID0gX193ZWJwYWNrX3JlcXVpcmVfXygyOSlcblx0ICAsIGNvcmUgICAgICA9IF9fd2VicGFja19yZXF1aXJlX18oMzApXG5cdCAgLCBjdHggICAgICAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMxKVxuXHQgICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cblx0dmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuXHQgIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG5cdCAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkdcblx0ICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuXHQgICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG5cdCAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcblx0ICAgICwgSVNfV1JBUCAgID0gdHlwZSAmICRleHBvcnQuV1xuXHQgICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuXHQgICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG5cdCAgICAsIGtleSwgb3duLCBvdXQ7XG5cdCAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG5cdCAgZm9yKGtleSBpbiBzb3VyY2Upe1xuXHQgICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG5cdCAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiBrZXkgaW4gdGFyZ2V0O1xuXHQgICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuXHQgICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcblx0ICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG5cdCAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcblx0ICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG5cdCAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuXHQgICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcblx0ICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG5cdCAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuXHQgICAgICB2YXIgRiA9IGZ1bmN0aW9uKHBhcmFtKXtcblx0ICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIEMgPyBuZXcgQyhwYXJhbSkgOiBDKHBhcmFtKTtcblx0ICAgICAgfTtcblx0ICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuXHQgICAgICByZXR1cm4gRjtcblx0ICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuXHQgICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuXHQgICAgaWYoSVNfUFJPVE8pKGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pKVtrZXldID0gb3V0O1xuXHQgIH1cblx0fTtcblx0Ly8gdHlwZSBiaXRtYXBcblx0JGV4cG9ydC5GID0gMTsgIC8vIGZvcmNlZFxuXHQkZXhwb3J0LkcgPSAyOyAgLy8gZ2xvYmFsXG5cdCRleHBvcnQuUyA9IDQ7ICAvLyBzdGF0aWNcblx0JGV4cG9ydC5QID0gODsgIC8vIHByb3RvXG5cdCRleHBvcnQuQiA9IDE2OyAvLyBiaW5kXG5cdCRleHBvcnQuVyA9IDMyOyAvLyB3cmFwXG5cdG1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcblxuLyoqKi8gfSksXG4vKiAyOSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG5cdHZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuXHQgID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0aWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcblxuLyoqKi8gfSksXG4vKiAzMCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdHZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzEuMi42J307XG5cdGlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG4vKioqLyB9KSxcbi8qIDMxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0Ly8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG5cdHZhciBhRnVuY3Rpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMyKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcblx0ICBhRnVuY3Rpb24oZm4pO1xuXHQgIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG5cdCAgc3dpdGNoKGxlbmd0aCl7XG5cdCAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcblx0ICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG5cdCAgICB9O1xuXHQgICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG5cdCAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuXHQgICAgfTtcblx0ICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuXHQgICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcblx0ICAgIH07XG5cdCAgfVxuXHQgIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcblx0ICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuXHQgIH07XG5cdH07XG5cbi8qKiovIH0pLFxuLyogMzIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcblx0ICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuXHQgIHJldHVybiBpdDtcblx0fTtcblxuLyoqKi8gfSksXG4vKiAzMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG5cdCAgdHJ5IHtcblx0ICAgIHJldHVybiAhIWV4ZWMoKTtcblx0ICB9IGNhdGNoKGUpe1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXHR9O1xuXG4vKioqLyB9KSxcbi8qIDM0ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKGdsb2JhbCkgey8qIGdsb2JhbCB3aW5kb3cgKi9cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKEhhbmRsZWJhcnMpIHtcblx0ICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgIHZhciByb290ID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB3aW5kb3csXG5cdCAgICAgICRIYW5kbGViYXJzID0gcm9vdC5IYW5kbGViYXJzO1xuXHQgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgSGFuZGxlYmFycy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgaWYgKHJvb3QuSGFuZGxlYmFycyA9PT0gSGFuZGxlYmFycykge1xuXHQgICAgICByb290LkhhbmRsZWJhcnMgPSAkSGFuZGxlYmFycztcblx0ICAgIH1cblx0ICAgIHJldHVybiBIYW5kbGViYXJzO1xuXHQgIH07XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KCkpKSlcblxuLyoqKi8gfSksXG4vKiAzNSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHR2YXIgQVNUID0ge1xuXHQgIC8vIFB1YmxpYyBBUEkgdXNlZCB0byBldmFsdWF0ZSBkZXJpdmVkIGF0dHJpYnV0ZXMgcmVnYXJkaW5nIEFTVCBub2Rlc1xuXHQgIGhlbHBlcnM6IHtcblx0ICAgIC8vIGEgbXVzdGFjaGUgaXMgZGVmaW5pdGVseSBhIGhlbHBlciBpZjpcblx0ICAgIC8vICogaXQgaXMgYW4gZWxpZ2libGUgaGVscGVyLCBhbmRcblx0ICAgIC8vICogaXQgaGFzIGF0IGxlYXN0IG9uZSBwYXJhbWV0ZXIgb3IgaGFzaCBzZWdtZW50XG5cdCAgICBoZWxwZXJFeHByZXNzaW9uOiBmdW5jdGlvbiBoZWxwZXJFeHByZXNzaW9uKG5vZGUpIHtcblx0ICAgICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ1N1YkV4cHJlc3Npb24nIHx8IChub2RlLnR5cGUgPT09ICdNdXN0YWNoZVN0YXRlbWVudCcgfHwgbm9kZS50eXBlID09PSAnQmxvY2tTdGF0ZW1lbnQnKSAmJiAhIShub2RlLnBhcmFtcyAmJiBub2RlLnBhcmFtcy5sZW5ndGggfHwgbm9kZS5oYXNoKTtcblx0ICAgIH0sXG5cblx0ICAgIHNjb3BlZElkOiBmdW5jdGlvbiBzY29wZWRJZChwYXRoKSB7XG5cdCAgICAgIHJldHVybiAoL15cXC58dGhpc1xcYi8udGVzdChwYXRoLm9yaWdpbmFsKVxuXHQgICAgICApO1xuXHQgICAgfSxcblxuXHQgICAgLy8gYW4gSUQgaXMgc2ltcGxlIGlmIGl0IG9ubHkgaGFzIG9uZSBwYXJ0LCBhbmQgdGhhdCBwYXJ0IGlzIG5vdFxuXHQgICAgLy8gYC4uYCBvciBgdGhpc2AuXG5cdCAgICBzaW1wbGVJZDogZnVuY3Rpb24gc2ltcGxlSWQocGF0aCkge1xuXHQgICAgICByZXR1cm4gcGF0aC5wYXJ0cy5sZW5ndGggPT09IDEgJiYgIUFTVC5oZWxwZXJzLnNjb3BlZElkKHBhdGgpICYmICFwYXRoLmRlcHRoO1xuXHQgICAgfVxuXHQgIH1cblx0fTtcblxuXHQvLyBNdXN0IGJlIGV4cG9ydGVkIGFzIGFuIG9iamVjdCByYXRoZXIgdGhhbiB0aGUgcm9vdCBvZiB0aGUgbW9kdWxlIGFzIHRoZSBqaXNvbiBsZXhlclxuXHQvLyBtdXN0IG1vZGlmeSB0aGUgb2JqZWN0IHRvIG9wZXJhdGUgcHJvcGVybHkuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IEFTVDtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMzYgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMucGFyc2UgPSBwYXJzZTtcblxuXHR2YXIgX3BhcnNlciA9IF9fd2VicGFja19yZXF1aXJlX18oMzcpO1xuXG5cdHZhciBfcGFyc2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BhcnNlcik7XG5cblx0dmFyIF93aGl0ZXNwYWNlQ29udHJvbCA9IF9fd2VicGFja19yZXF1aXJlX18oMzgpO1xuXG5cdHZhciBfd2hpdGVzcGFjZUNvbnRyb2wyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2hpdGVzcGFjZUNvbnRyb2wpO1xuXG5cdHZhciBfaGVscGVycyA9IF9fd2VicGFja19yZXF1aXJlX18oNDApO1xuXG5cdHZhciBIZWxwZXJzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2hlbHBlcnMpO1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdGV4cG9ydHMucGFyc2VyID0gX3BhcnNlcjJbJ2RlZmF1bHQnXTtcblxuXHR2YXIgeXkgPSB7fTtcblx0X3V0aWxzLmV4dGVuZCh5eSwgSGVscGVycyk7XG5cblx0ZnVuY3Rpb24gcGFyc2UoaW5wdXQsIG9wdGlvbnMpIHtcblx0ICAvLyBKdXN0IHJldHVybiBpZiBhbiBhbHJlYWR5LWNvbXBpbGVkIEFTVCB3YXMgcGFzc2VkIGluLlxuXHQgIGlmIChpbnB1dC50eXBlID09PSAnUHJvZ3JhbScpIHtcblx0ICAgIHJldHVybiBpbnB1dDtcblx0ICB9XG5cblx0ICBfcGFyc2VyMlsnZGVmYXVsdCddLnl5ID0geXk7XG5cblx0ICAvLyBBbHRlcmluZyB0aGUgc2hhcmVkIG9iamVjdCBoZXJlLCBidXQgdGhpcyBpcyBvayBhcyBwYXJzZXIgaXMgYSBzeW5jIG9wZXJhdGlvblxuXHQgIHl5LmxvY0luZm8gPSBmdW5jdGlvbiAobG9jSW5mbykge1xuXHQgICAgcmV0dXJuIG5ldyB5eS5Tb3VyY2VMb2NhdGlvbihvcHRpb25zICYmIG9wdGlvbnMuc3JjTmFtZSwgbG9jSW5mbyk7XG5cdCAgfTtcblxuXHQgIHZhciBzdHJpcCA9IG5ldyBfd2hpdGVzcGFjZUNvbnRyb2wyWydkZWZhdWx0J10ob3B0aW9ucyk7XG5cdCAgcmV0dXJuIHN0cmlwLmFjY2VwdChfcGFyc2VyMlsnZGVmYXVsdCddLnBhcnNlKGlucHV0KSk7XG5cdH1cblxuLyoqKi8gfSksXG4vKiAzNyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8vIEZpbGUgaWdub3JlZCBpbiBjb3ZlcmFnZSB0ZXN0cyB2aWEgc2V0dGluZyBpbiAuaXN0YW5idWwueW1sXG5cdC8qIEppc29uIGdlbmVyYXRlZCBwYXJzZXIgKi9cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0dmFyIGhhbmRsZWJhcnMgPSAoZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIHBhcnNlciA9IHsgdHJhY2U6IGZ1bmN0aW9uIHRyYWNlKCkge30sXG5cdCAgICAgICAgeXk6IHt9LFxuXHQgICAgICAgIHN5bWJvbHNfOiB7IFwiZXJyb3JcIjogMiwgXCJyb290XCI6IDMsIFwicHJvZ3JhbVwiOiA0LCBcIkVPRlwiOiA1LCBcInByb2dyYW1fcmVwZXRpdGlvbjBcIjogNiwgXCJzdGF0ZW1lbnRcIjogNywgXCJtdXN0YWNoZVwiOiA4LCBcImJsb2NrXCI6IDksIFwicmF3QmxvY2tcIjogMTAsIFwicGFydGlhbFwiOiAxMSwgXCJwYXJ0aWFsQmxvY2tcIjogMTIsIFwiY29udGVudFwiOiAxMywgXCJDT01NRU5UXCI6IDE0LCBcIkNPTlRFTlRcIjogMTUsIFwib3BlblJhd0Jsb2NrXCI6IDE2LCBcInJhd0Jsb2NrX3JlcGV0aXRpb25fcGx1czBcIjogMTcsIFwiRU5EX1JBV19CTE9DS1wiOiAxOCwgXCJPUEVOX1JBV19CTE9DS1wiOiAxOSwgXCJoZWxwZXJOYW1lXCI6IDIwLCBcIm9wZW5SYXdCbG9ja19yZXBldGl0aW9uMFwiOiAyMSwgXCJvcGVuUmF3QmxvY2tfb3B0aW9uMFwiOiAyMiwgXCJDTE9TRV9SQVdfQkxPQ0tcIjogMjMsIFwib3BlbkJsb2NrXCI6IDI0LCBcImJsb2NrX29wdGlvbjBcIjogMjUsIFwiY2xvc2VCbG9ja1wiOiAyNiwgXCJvcGVuSW52ZXJzZVwiOiAyNywgXCJibG9ja19vcHRpb24xXCI6IDI4LCBcIk9QRU5fQkxPQ0tcIjogMjksIFwib3BlbkJsb2NrX3JlcGV0aXRpb24wXCI6IDMwLCBcIm9wZW5CbG9ja19vcHRpb24wXCI6IDMxLCBcIm9wZW5CbG9ja19vcHRpb24xXCI6IDMyLCBcIkNMT1NFXCI6IDMzLCBcIk9QRU5fSU5WRVJTRVwiOiAzNCwgXCJvcGVuSW52ZXJzZV9yZXBldGl0aW9uMFwiOiAzNSwgXCJvcGVuSW52ZXJzZV9vcHRpb24wXCI6IDM2LCBcIm9wZW5JbnZlcnNlX29wdGlvbjFcIjogMzcsIFwib3BlbkludmVyc2VDaGFpblwiOiAzOCwgXCJPUEVOX0lOVkVSU0VfQ0hBSU5cIjogMzksIFwib3BlbkludmVyc2VDaGFpbl9yZXBldGl0aW9uMFwiOiA0MCwgXCJvcGVuSW52ZXJzZUNoYWluX29wdGlvbjBcIjogNDEsIFwib3BlbkludmVyc2VDaGFpbl9vcHRpb24xXCI6IDQyLCBcImludmVyc2VBbmRQcm9ncmFtXCI6IDQzLCBcIklOVkVSU0VcIjogNDQsIFwiaW52ZXJzZUNoYWluXCI6IDQ1LCBcImludmVyc2VDaGFpbl9vcHRpb24wXCI6IDQ2LCBcIk9QRU5fRU5EQkxPQ0tcIjogNDcsIFwiT1BFTlwiOiA0OCwgXCJtdXN0YWNoZV9yZXBldGl0aW9uMFwiOiA0OSwgXCJtdXN0YWNoZV9vcHRpb24wXCI6IDUwLCBcIk9QRU5fVU5FU0NBUEVEXCI6IDUxLCBcIm11c3RhY2hlX3JlcGV0aXRpb24xXCI6IDUyLCBcIm11c3RhY2hlX29wdGlvbjFcIjogNTMsIFwiQ0xPU0VfVU5FU0NBUEVEXCI6IDU0LCBcIk9QRU5fUEFSVElBTFwiOiA1NSwgXCJwYXJ0aWFsTmFtZVwiOiA1NiwgXCJwYXJ0aWFsX3JlcGV0aXRpb24wXCI6IDU3LCBcInBhcnRpYWxfb3B0aW9uMFwiOiA1OCwgXCJvcGVuUGFydGlhbEJsb2NrXCI6IDU5LCBcIk9QRU5fUEFSVElBTF9CTE9DS1wiOiA2MCwgXCJvcGVuUGFydGlhbEJsb2NrX3JlcGV0aXRpb24wXCI6IDYxLCBcIm9wZW5QYXJ0aWFsQmxvY2tfb3B0aW9uMFwiOiA2MiwgXCJwYXJhbVwiOiA2MywgXCJzZXhwclwiOiA2NCwgXCJPUEVOX1NFWFBSXCI6IDY1LCBcInNleHByX3JlcGV0aXRpb24wXCI6IDY2LCBcInNleHByX29wdGlvbjBcIjogNjcsIFwiQ0xPU0VfU0VYUFJcIjogNjgsIFwiaGFzaFwiOiA2OSwgXCJoYXNoX3JlcGV0aXRpb25fcGx1czBcIjogNzAsIFwiaGFzaFNlZ21lbnRcIjogNzEsIFwiSURcIjogNzIsIFwiRVFVQUxTXCI6IDczLCBcImJsb2NrUGFyYW1zXCI6IDc0LCBcIk9QRU5fQkxPQ0tfUEFSQU1TXCI6IDc1LCBcImJsb2NrUGFyYW1zX3JlcGV0aXRpb25fcGx1czBcIjogNzYsIFwiQ0xPU0VfQkxPQ0tfUEFSQU1TXCI6IDc3LCBcInBhdGhcIjogNzgsIFwiZGF0YU5hbWVcIjogNzksIFwiU1RSSU5HXCI6IDgwLCBcIk5VTUJFUlwiOiA4MSwgXCJCT09MRUFOXCI6IDgyLCBcIlVOREVGSU5FRFwiOiA4MywgXCJOVUxMXCI6IDg0LCBcIkRBVEFcIjogODUsIFwicGF0aFNlZ21lbnRzXCI6IDg2LCBcIlNFUFwiOiA4NywgXCIkYWNjZXB0XCI6IDAsIFwiJGVuZFwiOiAxIH0sXG5cdCAgICAgICAgdGVybWluYWxzXzogeyAyOiBcImVycm9yXCIsIDU6IFwiRU9GXCIsIDE0OiBcIkNPTU1FTlRcIiwgMTU6IFwiQ09OVEVOVFwiLCAxODogXCJFTkRfUkFXX0JMT0NLXCIsIDE5OiBcIk9QRU5fUkFXX0JMT0NLXCIsIDIzOiBcIkNMT1NFX1JBV19CTE9DS1wiLCAyOTogXCJPUEVOX0JMT0NLXCIsIDMzOiBcIkNMT1NFXCIsIDM0OiBcIk9QRU5fSU5WRVJTRVwiLCAzOTogXCJPUEVOX0lOVkVSU0VfQ0hBSU5cIiwgNDQ6IFwiSU5WRVJTRVwiLCA0NzogXCJPUEVOX0VOREJMT0NLXCIsIDQ4OiBcIk9QRU5cIiwgNTE6IFwiT1BFTl9VTkVTQ0FQRURcIiwgNTQ6IFwiQ0xPU0VfVU5FU0NBUEVEXCIsIDU1OiBcIk9QRU5fUEFSVElBTFwiLCA2MDogXCJPUEVOX1BBUlRJQUxfQkxPQ0tcIiwgNjU6IFwiT1BFTl9TRVhQUlwiLCA2ODogXCJDTE9TRV9TRVhQUlwiLCA3MjogXCJJRFwiLCA3MzogXCJFUVVBTFNcIiwgNzU6IFwiT1BFTl9CTE9DS19QQVJBTVNcIiwgNzc6IFwiQ0xPU0VfQkxPQ0tfUEFSQU1TXCIsIDgwOiBcIlNUUklOR1wiLCA4MTogXCJOVU1CRVJcIiwgODI6IFwiQk9PTEVBTlwiLCA4MzogXCJVTkRFRklORURcIiwgODQ6IFwiTlVMTFwiLCA4NTogXCJEQVRBXCIsIDg3OiBcIlNFUFwiIH0sXG5cdCAgICAgICAgcHJvZHVjdGlvbnNfOiBbMCwgWzMsIDJdLCBbNCwgMV0sIFs3LCAxXSwgWzcsIDFdLCBbNywgMV0sIFs3LCAxXSwgWzcsIDFdLCBbNywgMV0sIFs3LCAxXSwgWzEzLCAxXSwgWzEwLCAzXSwgWzE2LCA1XSwgWzksIDRdLCBbOSwgNF0sIFsyNCwgNl0sIFsyNywgNl0sIFszOCwgNl0sIFs0MywgMl0sIFs0NSwgM10sIFs0NSwgMV0sIFsyNiwgM10sIFs4LCA1XSwgWzgsIDVdLCBbMTEsIDVdLCBbMTIsIDNdLCBbNTksIDVdLCBbNjMsIDFdLCBbNjMsIDFdLCBbNjQsIDVdLCBbNjksIDFdLCBbNzEsIDNdLCBbNzQsIDNdLCBbMjAsIDFdLCBbMjAsIDFdLCBbMjAsIDFdLCBbMjAsIDFdLCBbMjAsIDFdLCBbMjAsIDFdLCBbMjAsIDFdLCBbNTYsIDFdLCBbNTYsIDFdLCBbNzksIDJdLCBbNzgsIDFdLCBbODYsIDNdLCBbODYsIDFdLCBbNiwgMF0sIFs2LCAyXSwgWzE3LCAxXSwgWzE3LCAyXSwgWzIxLCAwXSwgWzIxLCAyXSwgWzIyLCAwXSwgWzIyLCAxXSwgWzI1LCAwXSwgWzI1LCAxXSwgWzI4LCAwXSwgWzI4LCAxXSwgWzMwLCAwXSwgWzMwLCAyXSwgWzMxLCAwXSwgWzMxLCAxXSwgWzMyLCAwXSwgWzMyLCAxXSwgWzM1LCAwXSwgWzM1LCAyXSwgWzM2LCAwXSwgWzM2LCAxXSwgWzM3LCAwXSwgWzM3LCAxXSwgWzQwLCAwXSwgWzQwLCAyXSwgWzQxLCAwXSwgWzQxLCAxXSwgWzQyLCAwXSwgWzQyLCAxXSwgWzQ2LCAwXSwgWzQ2LCAxXSwgWzQ5LCAwXSwgWzQ5LCAyXSwgWzUwLCAwXSwgWzUwLCAxXSwgWzUyLCAwXSwgWzUyLCAyXSwgWzUzLCAwXSwgWzUzLCAxXSwgWzU3LCAwXSwgWzU3LCAyXSwgWzU4LCAwXSwgWzU4LCAxXSwgWzYxLCAwXSwgWzYxLCAyXSwgWzYyLCAwXSwgWzYyLCAxXSwgWzY2LCAwXSwgWzY2LCAyXSwgWzY3LCAwXSwgWzY3LCAxXSwgWzcwLCAxXSwgWzcwLCAyXSwgWzc2LCAxXSwgWzc2LCAyXV0sXG5cdCAgICAgICAgcGVyZm9ybUFjdGlvbjogZnVuY3Rpb24gYW5vbnltb3VzKHl5dGV4dCwgeXlsZW5nLCB5eWxpbmVubywgeXksIHl5c3RhdGUsICQkLCBfJFxuXHQgICAgICAgIC8qKi8pIHtcblxuXHQgICAgICAgICAgICB2YXIgJDAgPSAkJC5sZW5ndGggLSAxO1xuXHQgICAgICAgICAgICBzd2l0Y2ggKHl5c3RhdGUpIHtcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCRbJDAgLSAxXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB5eS5wcmVwYXJlUHJvZ3JhbSgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDU6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA2OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNzpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDg6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA5OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0NvbW1lbnRTdGF0ZW1lbnQnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogeXkuc3RyaXBDb21tZW50KCQkWyQwXSksXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0cmlwOiB5eS5zdHJpcEZsYWdzKCQkWyQwXSwgJCRbJDBdKSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpXG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdDb250ZW50U3RhdGVtZW50Jyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6ICQkWyQwXSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICQkWyQwXSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpXG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB5eS5wcmVwYXJlUmF3QmxvY2soJCRbJDAgLSAyXSwgJCRbJDAgLSAxXSwgJCRbJDBdLCB0aGlzLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTI6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyBwYXRoOiAkJFskMCAtIDNdLCBwYXJhbXM6ICQkWyQwIC0gMl0sIGhhc2g6ICQkWyQwIC0gMV0gfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTM6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZUJsb2NrKCQkWyQwIC0gM10sICQkWyQwIC0gMl0sICQkWyQwIC0gMV0sICQkWyQwXSwgZmFsc2UsIHRoaXMuXyQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxNDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB5eS5wcmVwYXJlQmxvY2soJCRbJDAgLSAzXSwgJCRbJDAgLSAyXSwgJCRbJDAgLSAxXSwgJCRbJDBdLCB0cnVlLCB0aGlzLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTU6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyBvcGVuOiAkJFskMCAtIDVdLCBwYXRoOiAkJFskMCAtIDRdLCBwYXJhbXM6ICQkWyQwIC0gM10sIGhhc2g6ICQkWyQwIC0gMl0sIGJsb2NrUGFyYW1zOiAkJFskMCAtIDFdLCBzdHJpcDogeXkuc3RyaXBGbGFncygkJFskMCAtIDVdLCAkJFskMF0pIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE2OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgcGF0aDogJCRbJDAgLSA0XSwgcGFyYW1zOiAkJFskMCAtIDNdLCBoYXNoOiAkJFskMCAtIDJdLCBibG9ja1BhcmFtczogJCRbJDAgLSAxXSwgc3RyaXA6IHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSA1XSwgJCRbJDBdKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxNzpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHBhdGg6ICQkWyQwIC0gNF0sIHBhcmFtczogJCRbJDAgLSAzXSwgaGFzaDogJCRbJDAgLSAyXSwgYmxvY2tQYXJhbXM6ICQkWyQwIC0gMV0sIHN0cmlwOiB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gNV0sICQkWyQwXSkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTg6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyBzdHJpcDogeXkuc3RyaXBGbGFncygkJFskMCAtIDFdLCAkJFskMCAtIDFdKSwgcHJvZ3JhbTogJCRbJDBdIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE5OlxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpbnZlcnNlID0geXkucHJlcGFyZUJsb2NrKCQkWyQwIC0gMl0sICQkWyQwIC0gMV0sICQkWyQwXSwgJCRbJDBdLCBmYWxzZSwgdGhpcy5fJCksXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyYW0gPSB5eS5wcmVwYXJlUHJvZ3JhbShbaW52ZXJzZV0sICQkWyQwIC0gMV0ubG9jKTtcblx0ICAgICAgICAgICAgICAgICAgICBwcm9ncmFtLmNoYWluZWQgPSB0cnVlO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyBzdHJpcDogJCRbJDAgLSAyXS5zdHJpcCwgcHJvZ3JhbTogcHJvZ3JhbSwgY2hhaW46IHRydWUgfTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyMDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIxOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgcGF0aDogJCRbJDAgLSAxXSwgc3RyaXA6IHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSAyXSwgJCRbJDBdKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyMjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB5eS5wcmVwYXJlTXVzdGFjaGUoJCRbJDAgLSAzXSwgJCRbJDAgLSAyXSwgJCRbJDAgLSAxXSwgJCRbJDAgLSA0XSwgeXkuc3RyaXBGbGFncygkJFskMCAtIDRdLCAkJFskMF0pLCB0aGlzLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjM6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZU11c3RhY2hlKCQkWyQwIC0gM10sICQkWyQwIC0gMl0sICQkWyQwIC0gMV0sICQkWyQwIC0gNF0sIHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSA0XSwgJCRbJDBdKSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI0OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BhcnRpYWxTdGF0ZW1lbnQnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAkJFskMCAtIDNdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6ICQkWyQwIC0gMl0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGhhc2g6ICQkWyQwIC0gMV0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudDogJycsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0cmlwOiB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gNF0sICQkWyQwXSksXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKVxuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjU6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkucHJlcGFyZVBhcnRpYWxCbG9jaygkJFskMCAtIDJdLCAkJFskMCAtIDFdLCAkJFskMF0sIHRoaXMuXyQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyNjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHBhdGg6ICQkWyQwIC0gM10sIHBhcmFtczogJCRbJDAgLSAyXSwgaGFzaDogJCRbJDAgLSAxXSwgc3RyaXA6IHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSA0XSwgJCRbJDBdKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyNzpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjk6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0ge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnU3ViRXhwcmVzc2lvbicsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICQkWyQwIC0gM10sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczogJCRbJDAgLSAyXSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaGFzaDogJCRbJDAgLSAxXSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpXG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHR5cGU6ICdIYXNoJywgcGFpcnM6ICQkWyQwXSwgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDMxOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgdHlwZTogJ0hhc2hQYWlyJywga2V5OiB5eS5pZCgkJFskMCAtIDJdKSwgdmFsdWU6ICQkWyQwXSwgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDMyOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LmlkKCQkWyQwIC0gMV0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMzpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM0OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzU6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyB0eXBlOiAnU3RyaW5nTGl0ZXJhbCcsIHZhbHVlOiAkJFskMF0sIG9yaWdpbmFsOiAkJFskMF0sIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzNjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHR5cGU6ICdOdW1iZXJMaXRlcmFsJywgdmFsdWU6IE51bWJlcigkJFskMF0pLCBvcmlnaW5hbDogTnVtYmVyKCQkWyQwXSksIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzNzpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHR5cGU6ICdCb29sZWFuTGl0ZXJhbCcsIHZhbHVlOiAkJFskMF0gPT09ICd0cnVlJywgb3JpZ2luYWw6ICQkWyQwXSA9PT0gJ3RydWUnLCBsb2M6IHl5LmxvY0luZm8odGhpcy5fJCkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzg6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyB0eXBlOiAnVW5kZWZpbmVkTGl0ZXJhbCcsIG9yaWdpbmFsOiB1bmRlZmluZWQsIHZhbHVlOiB1bmRlZmluZWQsIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzOTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHR5cGU6ICdOdWxsTGl0ZXJhbCcsIG9yaWdpbmFsOiBudWxsLCB2YWx1ZTogbnVsbCwgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQwOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDE6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0Mjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB5eS5wcmVwYXJlUGF0aCh0cnVlLCAkJFskMF0sIHRoaXMuXyQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0Mzpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB5eS5wcmVwYXJlUGF0aChmYWxzZSwgJCRbJDBdLCB0aGlzLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDQ6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAyXS5wdXNoKHsgcGFydDogeXkuaWQoJCRbJDBdKSwgb3JpZ2luYWw6ICQkWyQwXSwgc2VwYXJhdG9yOiAkJFskMCAtIDFdIH0pO3RoaXMuJCA9ICQkWyQwIC0gMl07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ1OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFt7IHBhcnQ6IHl5LmlkKCQkWyQwXSksIG9yaWdpbmFsOiAkJFskMF0gfV07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ2OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0Nzpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDg6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gWyQkWyQwXV07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ5OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA1MDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNTE6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDU4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA1OTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNjQ6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDY1OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA3MDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNzE6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDc4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA3OTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgODI6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDgzOlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA4Njpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgODc6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDkwOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA5MTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTQ6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDk1OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA5ODpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbJCRbJDBdXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTk6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEwMDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbJCRbJDBdXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTAxOlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSxcblx0ICAgICAgICB0YWJsZTogW3sgMzogMSwgNDogMiwgNTogWzIsIDQ2XSwgNjogMywgMTQ6IFsyLCA0Nl0sIDE1OiBbMiwgNDZdLCAxOTogWzIsIDQ2XSwgMjk6IFsyLCA0Nl0sIDM0OiBbMiwgNDZdLCA0ODogWzIsIDQ2XSwgNTE6IFsyLCA0Nl0sIDU1OiBbMiwgNDZdLCA2MDogWzIsIDQ2XSB9LCB7IDE6IFszXSB9LCB7IDU6IFsxLCA0XSB9LCB7IDU6IFsyLCAyXSwgNzogNSwgODogNiwgOTogNywgMTA6IDgsIDExOiA5LCAxMjogMTAsIDEzOiAxMSwgMTQ6IFsxLCAxMl0sIDE1OiBbMSwgMjBdLCAxNjogMTcsIDE5OiBbMSwgMjNdLCAyNDogMTUsIDI3OiAxNiwgMjk6IFsxLCAyMV0sIDM0OiBbMSwgMjJdLCAzOTogWzIsIDJdLCA0NDogWzIsIDJdLCA0NzogWzIsIDJdLCA0ODogWzEsIDEzXSwgNTE6IFsxLCAxNF0sIDU1OiBbMSwgMThdLCA1OTogMTksIDYwOiBbMSwgMjRdIH0sIHsgMTogWzIsIDFdIH0sIHsgNTogWzIsIDQ3XSwgMTQ6IFsyLCA0N10sIDE1OiBbMiwgNDddLCAxOTogWzIsIDQ3XSwgMjk6IFsyLCA0N10sIDM0OiBbMiwgNDddLCAzOTogWzIsIDQ3XSwgNDQ6IFsyLCA0N10sIDQ3OiBbMiwgNDddLCA0ODogWzIsIDQ3XSwgNTE6IFsyLCA0N10sIDU1OiBbMiwgNDddLCA2MDogWzIsIDQ3XSB9LCB7IDU6IFsyLCAzXSwgMTQ6IFsyLCAzXSwgMTU6IFsyLCAzXSwgMTk6IFsyLCAzXSwgMjk6IFsyLCAzXSwgMzQ6IFsyLCAzXSwgMzk6IFsyLCAzXSwgNDQ6IFsyLCAzXSwgNDc6IFsyLCAzXSwgNDg6IFsyLCAzXSwgNTE6IFsyLCAzXSwgNTU6IFsyLCAzXSwgNjA6IFsyLCAzXSB9LCB7IDU6IFsyLCA0XSwgMTQ6IFsyLCA0XSwgMTU6IFsyLCA0XSwgMTk6IFsyLCA0XSwgMjk6IFsyLCA0XSwgMzQ6IFsyLCA0XSwgMzk6IFsyLCA0XSwgNDQ6IFsyLCA0XSwgNDc6IFsyLCA0XSwgNDg6IFsyLCA0XSwgNTE6IFsyLCA0XSwgNTU6IFsyLCA0XSwgNjA6IFsyLCA0XSB9LCB7IDU6IFsyLCA1XSwgMTQ6IFsyLCA1XSwgMTU6IFsyLCA1XSwgMTk6IFsyLCA1XSwgMjk6IFsyLCA1XSwgMzQ6IFsyLCA1XSwgMzk6IFsyLCA1XSwgNDQ6IFsyLCA1XSwgNDc6IFsyLCA1XSwgNDg6IFsyLCA1XSwgNTE6IFsyLCA1XSwgNTU6IFsyLCA1XSwgNjA6IFsyLCA1XSB9LCB7IDU6IFsyLCA2XSwgMTQ6IFsyLCA2XSwgMTU6IFsyLCA2XSwgMTk6IFsyLCA2XSwgMjk6IFsyLCA2XSwgMzQ6IFsyLCA2XSwgMzk6IFsyLCA2XSwgNDQ6IFsyLCA2XSwgNDc6IFsyLCA2XSwgNDg6IFsyLCA2XSwgNTE6IFsyLCA2XSwgNTU6IFsyLCA2XSwgNjA6IFsyLCA2XSB9LCB7IDU6IFsyLCA3XSwgMTQ6IFsyLCA3XSwgMTU6IFsyLCA3XSwgMTk6IFsyLCA3XSwgMjk6IFsyLCA3XSwgMzQ6IFsyLCA3XSwgMzk6IFsyLCA3XSwgNDQ6IFsyLCA3XSwgNDc6IFsyLCA3XSwgNDg6IFsyLCA3XSwgNTE6IFsyLCA3XSwgNTU6IFsyLCA3XSwgNjA6IFsyLCA3XSB9LCB7IDU6IFsyLCA4XSwgMTQ6IFsyLCA4XSwgMTU6IFsyLCA4XSwgMTk6IFsyLCA4XSwgMjk6IFsyLCA4XSwgMzQ6IFsyLCA4XSwgMzk6IFsyLCA4XSwgNDQ6IFsyLCA4XSwgNDc6IFsyLCA4XSwgNDg6IFsyLCA4XSwgNTE6IFsyLCA4XSwgNTU6IFsyLCA4XSwgNjA6IFsyLCA4XSB9LCB7IDU6IFsyLCA5XSwgMTQ6IFsyLCA5XSwgMTU6IFsyLCA5XSwgMTk6IFsyLCA5XSwgMjk6IFsyLCA5XSwgMzQ6IFsyLCA5XSwgMzk6IFsyLCA5XSwgNDQ6IFsyLCA5XSwgNDc6IFsyLCA5XSwgNDg6IFsyLCA5XSwgNTE6IFsyLCA5XSwgNTU6IFsyLCA5XSwgNjA6IFsyLCA5XSB9LCB7IDIwOiAyNSwgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyMDogMzYsIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgNDogMzcsIDY6IDMsIDE0OiBbMiwgNDZdLCAxNTogWzIsIDQ2XSwgMTk6IFsyLCA0Nl0sIDI5OiBbMiwgNDZdLCAzNDogWzIsIDQ2XSwgMzk6IFsyLCA0Nl0sIDQ0OiBbMiwgNDZdLCA0NzogWzIsIDQ2XSwgNDg6IFsyLCA0Nl0sIDUxOiBbMiwgNDZdLCA1NTogWzIsIDQ2XSwgNjA6IFsyLCA0Nl0gfSwgeyA0OiAzOCwgNjogMywgMTQ6IFsyLCA0Nl0sIDE1OiBbMiwgNDZdLCAxOTogWzIsIDQ2XSwgMjk6IFsyLCA0Nl0sIDM0OiBbMiwgNDZdLCA0NDogWzIsIDQ2XSwgNDc6IFsyLCA0Nl0sIDQ4OiBbMiwgNDZdLCA1MTogWzIsIDQ2XSwgNTU6IFsyLCA0Nl0sIDYwOiBbMiwgNDZdIH0sIHsgMTM6IDQwLCAxNTogWzEsIDIwXSwgMTc6IDM5IH0sIHsgMjA6IDQyLCA1NjogNDEsIDY0OiA0MywgNjU6IFsxLCA0NF0sIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgNDogNDUsIDY6IDMsIDE0OiBbMiwgNDZdLCAxNTogWzIsIDQ2XSwgMTk6IFsyLCA0Nl0sIDI5OiBbMiwgNDZdLCAzNDogWzIsIDQ2XSwgNDc6IFsyLCA0Nl0sIDQ4OiBbMiwgNDZdLCA1MTogWzIsIDQ2XSwgNTU6IFsyLCA0Nl0sIDYwOiBbMiwgNDZdIH0sIHsgNTogWzIsIDEwXSwgMTQ6IFsyLCAxMF0sIDE1OiBbMiwgMTBdLCAxODogWzIsIDEwXSwgMTk6IFsyLCAxMF0sIDI5OiBbMiwgMTBdLCAzNDogWzIsIDEwXSwgMzk6IFsyLCAxMF0sIDQ0OiBbMiwgMTBdLCA0NzogWzIsIDEwXSwgNDg6IFsyLCAxMF0sIDUxOiBbMiwgMTBdLCA1NTogWzIsIDEwXSwgNjA6IFsyLCAxMF0gfSwgeyAyMDogNDYsIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDQ3LCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDIwOiA0OCwgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyMDogNDIsIDU2OiA0OSwgNjQ6IDQzLCA2NTogWzEsIDQ0XSwgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAzMzogWzIsIDc4XSwgNDk6IDUwLCA2NTogWzIsIDc4XSwgNzI6IFsyLCA3OF0sIDgwOiBbMiwgNzhdLCA4MTogWzIsIDc4XSwgODI6IFsyLCA3OF0sIDgzOiBbMiwgNzhdLCA4NDogWzIsIDc4XSwgODU6IFsyLCA3OF0gfSwgeyAyMzogWzIsIDMzXSwgMzM6IFsyLCAzM10sIDU0OiBbMiwgMzNdLCA2NTogWzIsIDMzXSwgNjg6IFsyLCAzM10sIDcyOiBbMiwgMzNdLCA3NTogWzIsIDMzXSwgODA6IFsyLCAzM10sIDgxOiBbMiwgMzNdLCA4MjogWzIsIDMzXSwgODM6IFsyLCAzM10sIDg0OiBbMiwgMzNdLCA4NTogWzIsIDMzXSB9LCB7IDIzOiBbMiwgMzRdLCAzMzogWzIsIDM0XSwgNTQ6IFsyLCAzNF0sIDY1OiBbMiwgMzRdLCA2ODogWzIsIDM0XSwgNzI6IFsyLCAzNF0sIDc1OiBbMiwgMzRdLCA4MDogWzIsIDM0XSwgODE6IFsyLCAzNF0sIDgyOiBbMiwgMzRdLCA4MzogWzIsIDM0XSwgODQ6IFsyLCAzNF0sIDg1OiBbMiwgMzRdIH0sIHsgMjM6IFsyLCAzNV0sIDMzOiBbMiwgMzVdLCA1NDogWzIsIDM1XSwgNjU6IFsyLCAzNV0sIDY4OiBbMiwgMzVdLCA3MjogWzIsIDM1XSwgNzU6IFsyLCAzNV0sIDgwOiBbMiwgMzVdLCA4MTogWzIsIDM1XSwgODI6IFsyLCAzNV0sIDgzOiBbMiwgMzVdLCA4NDogWzIsIDM1XSwgODU6IFsyLCAzNV0gfSwgeyAyMzogWzIsIDM2XSwgMzM6IFsyLCAzNl0sIDU0OiBbMiwgMzZdLCA2NTogWzIsIDM2XSwgNjg6IFsyLCAzNl0sIDcyOiBbMiwgMzZdLCA3NTogWzIsIDM2XSwgODA6IFsyLCAzNl0sIDgxOiBbMiwgMzZdLCA4MjogWzIsIDM2XSwgODM6IFsyLCAzNl0sIDg0OiBbMiwgMzZdLCA4NTogWzIsIDM2XSB9LCB7IDIzOiBbMiwgMzddLCAzMzogWzIsIDM3XSwgNTQ6IFsyLCAzN10sIDY1OiBbMiwgMzddLCA2ODogWzIsIDM3XSwgNzI6IFsyLCAzN10sIDc1OiBbMiwgMzddLCA4MDogWzIsIDM3XSwgODE6IFsyLCAzN10sIDgyOiBbMiwgMzddLCA4MzogWzIsIDM3XSwgODQ6IFsyLCAzN10sIDg1OiBbMiwgMzddIH0sIHsgMjM6IFsyLCAzOF0sIDMzOiBbMiwgMzhdLCA1NDogWzIsIDM4XSwgNjU6IFsyLCAzOF0sIDY4OiBbMiwgMzhdLCA3MjogWzIsIDM4XSwgNzU6IFsyLCAzOF0sIDgwOiBbMiwgMzhdLCA4MTogWzIsIDM4XSwgODI6IFsyLCAzOF0sIDgzOiBbMiwgMzhdLCA4NDogWzIsIDM4XSwgODU6IFsyLCAzOF0gfSwgeyAyMzogWzIsIDM5XSwgMzM6IFsyLCAzOV0sIDU0OiBbMiwgMzldLCA2NTogWzIsIDM5XSwgNjg6IFsyLCAzOV0sIDcyOiBbMiwgMzldLCA3NTogWzIsIDM5XSwgODA6IFsyLCAzOV0sIDgxOiBbMiwgMzldLCA4MjogWzIsIDM5XSwgODM6IFsyLCAzOV0sIDg0OiBbMiwgMzldLCA4NTogWzIsIDM5XSB9LCB7IDIzOiBbMiwgNDNdLCAzMzogWzIsIDQzXSwgNTQ6IFsyLCA0M10sIDY1OiBbMiwgNDNdLCA2ODogWzIsIDQzXSwgNzI6IFsyLCA0M10sIDc1OiBbMiwgNDNdLCA4MDogWzIsIDQzXSwgODE6IFsyLCA0M10sIDgyOiBbMiwgNDNdLCA4MzogWzIsIDQzXSwgODQ6IFsyLCA0M10sIDg1OiBbMiwgNDNdLCA4NzogWzEsIDUxXSB9LCB7IDcyOiBbMSwgMzVdLCA4NjogNTIgfSwgeyAyMzogWzIsIDQ1XSwgMzM6IFsyLCA0NV0sIDU0OiBbMiwgNDVdLCA2NTogWzIsIDQ1XSwgNjg6IFsyLCA0NV0sIDcyOiBbMiwgNDVdLCA3NTogWzIsIDQ1XSwgODA6IFsyLCA0NV0sIDgxOiBbMiwgNDVdLCA4MjogWzIsIDQ1XSwgODM6IFsyLCA0NV0sIDg0OiBbMiwgNDVdLCA4NTogWzIsIDQ1XSwgODc6IFsyLCA0NV0gfSwgeyA1MjogNTMsIDU0OiBbMiwgODJdLCA2NTogWzIsIDgyXSwgNzI6IFsyLCA4Ml0sIDgwOiBbMiwgODJdLCA4MTogWzIsIDgyXSwgODI6IFsyLCA4Ml0sIDgzOiBbMiwgODJdLCA4NDogWzIsIDgyXSwgODU6IFsyLCA4Ml0gfSwgeyAyNTogNTQsIDM4OiA1NiwgMzk6IFsxLCA1OF0sIDQzOiA1NywgNDQ6IFsxLCA1OV0sIDQ1OiA1NSwgNDc6IFsyLCA1NF0gfSwgeyAyODogNjAsIDQzOiA2MSwgNDQ6IFsxLCA1OV0sIDQ3OiBbMiwgNTZdIH0sIHsgMTM6IDYzLCAxNTogWzEsIDIwXSwgMTg6IFsxLCA2Ml0gfSwgeyAxNTogWzIsIDQ4XSwgMTg6IFsyLCA0OF0gfSwgeyAzMzogWzIsIDg2XSwgNTc6IDY0LCA2NTogWzIsIDg2XSwgNzI6IFsyLCA4Nl0sIDgwOiBbMiwgODZdLCA4MTogWzIsIDg2XSwgODI6IFsyLCA4Nl0sIDgzOiBbMiwgODZdLCA4NDogWzIsIDg2XSwgODU6IFsyLCA4Nl0gfSwgeyAzMzogWzIsIDQwXSwgNjU6IFsyLCA0MF0sIDcyOiBbMiwgNDBdLCA4MDogWzIsIDQwXSwgODE6IFsyLCA0MF0sIDgyOiBbMiwgNDBdLCA4MzogWzIsIDQwXSwgODQ6IFsyLCA0MF0sIDg1OiBbMiwgNDBdIH0sIHsgMzM6IFsyLCA0MV0sIDY1OiBbMiwgNDFdLCA3MjogWzIsIDQxXSwgODA6IFsyLCA0MV0sIDgxOiBbMiwgNDFdLCA4MjogWzIsIDQxXSwgODM6IFsyLCA0MV0sIDg0OiBbMiwgNDFdLCA4NTogWzIsIDQxXSB9LCB7IDIwOiA2NSwgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyNjogNjYsIDQ3OiBbMSwgNjddIH0sIHsgMzA6IDY4LCAzMzogWzIsIDU4XSwgNjU6IFsyLCA1OF0sIDcyOiBbMiwgNThdLCA3NTogWzIsIDU4XSwgODA6IFsyLCA1OF0sIDgxOiBbMiwgNThdLCA4MjogWzIsIDU4XSwgODM6IFsyLCA1OF0sIDg0OiBbMiwgNThdLCA4NTogWzIsIDU4XSB9LCB7IDMzOiBbMiwgNjRdLCAzNTogNjksIDY1OiBbMiwgNjRdLCA3MjogWzIsIDY0XSwgNzU6IFsyLCA2NF0sIDgwOiBbMiwgNjRdLCA4MTogWzIsIDY0XSwgODI6IFsyLCA2NF0sIDgzOiBbMiwgNjRdLCA4NDogWzIsIDY0XSwgODU6IFsyLCA2NF0gfSwgeyAyMTogNzAsIDIzOiBbMiwgNTBdLCA2NTogWzIsIDUwXSwgNzI6IFsyLCA1MF0sIDgwOiBbMiwgNTBdLCA4MTogWzIsIDUwXSwgODI6IFsyLCA1MF0sIDgzOiBbMiwgNTBdLCA4NDogWzIsIDUwXSwgODU6IFsyLCA1MF0gfSwgeyAzMzogWzIsIDkwXSwgNjE6IDcxLCA2NTogWzIsIDkwXSwgNzI6IFsyLCA5MF0sIDgwOiBbMiwgOTBdLCA4MTogWzIsIDkwXSwgODI6IFsyLCA5MF0sIDgzOiBbMiwgOTBdLCA4NDogWzIsIDkwXSwgODU6IFsyLCA5MF0gfSwgeyAyMDogNzUsIDMzOiBbMiwgODBdLCA1MDogNzIsIDYzOiA3MywgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDc0LCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyA3MjogWzEsIDgwXSB9LCB7IDIzOiBbMiwgNDJdLCAzMzogWzIsIDQyXSwgNTQ6IFsyLCA0Ml0sIDY1OiBbMiwgNDJdLCA2ODogWzIsIDQyXSwgNzI6IFsyLCA0Ml0sIDc1OiBbMiwgNDJdLCA4MDogWzIsIDQyXSwgODE6IFsyLCA0Ml0sIDgyOiBbMiwgNDJdLCA4MzogWzIsIDQyXSwgODQ6IFsyLCA0Ml0sIDg1OiBbMiwgNDJdLCA4NzogWzEsIDUxXSB9LCB7IDIwOiA3NSwgNTM6IDgxLCA1NDogWzIsIDg0XSwgNjM6IDgyLCA2NDogNzYsIDY1OiBbMSwgNDRdLCA2OTogODMsIDcwOiA3NywgNzE6IDc4LCA3MjogWzEsIDc5XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDI2OiA4NCwgNDc6IFsxLCA2N10gfSwgeyA0NzogWzIsIDU1XSB9LCB7IDQ6IDg1LCA2OiAzLCAxNDogWzIsIDQ2XSwgMTU6IFsyLCA0Nl0sIDE5OiBbMiwgNDZdLCAyOTogWzIsIDQ2XSwgMzQ6IFsyLCA0Nl0sIDM5OiBbMiwgNDZdLCA0NDogWzIsIDQ2XSwgNDc6IFsyLCA0Nl0sIDQ4OiBbMiwgNDZdLCA1MTogWzIsIDQ2XSwgNTU6IFsyLCA0Nl0sIDYwOiBbMiwgNDZdIH0sIHsgNDc6IFsyLCAyMF0gfSwgeyAyMDogODYsIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgNDogODcsIDY6IDMsIDE0OiBbMiwgNDZdLCAxNTogWzIsIDQ2XSwgMTk6IFsyLCA0Nl0sIDI5OiBbMiwgNDZdLCAzNDogWzIsIDQ2XSwgNDc6IFsyLCA0Nl0sIDQ4OiBbMiwgNDZdLCA1MTogWzIsIDQ2XSwgNTU6IFsyLCA0Nl0sIDYwOiBbMiwgNDZdIH0sIHsgMjY6IDg4LCA0NzogWzEsIDY3XSB9LCB7IDQ3OiBbMiwgNTddIH0sIHsgNTogWzIsIDExXSwgMTQ6IFsyLCAxMV0sIDE1OiBbMiwgMTFdLCAxOTogWzIsIDExXSwgMjk6IFsyLCAxMV0sIDM0OiBbMiwgMTFdLCAzOTogWzIsIDExXSwgNDQ6IFsyLCAxMV0sIDQ3OiBbMiwgMTFdLCA0ODogWzIsIDExXSwgNTE6IFsyLCAxMV0sIDU1OiBbMiwgMTFdLCA2MDogWzIsIDExXSB9LCB7IDE1OiBbMiwgNDldLCAxODogWzIsIDQ5XSB9LCB7IDIwOiA3NSwgMzM6IFsyLCA4OF0sIDU4OiA4OSwgNjM6IDkwLCA2NDogNzYsIDY1OiBbMSwgNDRdLCA2OTogOTEsIDcwOiA3NywgNzE6IDc4LCA3MjogWzEsIDc5XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDY1OiBbMiwgOTRdLCA2NjogOTIsIDY4OiBbMiwgOTRdLCA3MjogWzIsIDk0XSwgODA6IFsyLCA5NF0sIDgxOiBbMiwgOTRdLCA4MjogWzIsIDk0XSwgODM6IFsyLCA5NF0sIDg0OiBbMiwgOTRdLCA4NTogWzIsIDk0XSB9LCB7IDU6IFsyLCAyNV0sIDE0OiBbMiwgMjVdLCAxNTogWzIsIDI1XSwgMTk6IFsyLCAyNV0sIDI5OiBbMiwgMjVdLCAzNDogWzIsIDI1XSwgMzk6IFsyLCAyNV0sIDQ0OiBbMiwgMjVdLCA0NzogWzIsIDI1XSwgNDg6IFsyLCAyNV0sIDUxOiBbMiwgMjVdLCA1NTogWzIsIDI1XSwgNjA6IFsyLCAyNV0gfSwgeyAyMDogOTMsIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDc1LCAzMTogOTQsIDMzOiBbMiwgNjBdLCA2MzogOTUsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY5OiA5NiwgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3NTogWzIsIDYwXSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDIwOiA3NSwgMzM6IFsyLCA2Nl0sIDM2OiA5NywgNjM6IDk4LCA2NDogNzYsIDY1OiBbMSwgNDRdLCA2OTogOTksIDcwOiA3NywgNzE6IDc4LCA3MjogWzEsIDc5XSwgNzU6IFsyLCA2Nl0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyMDogNzUsIDIyOiAxMDAsIDIzOiBbMiwgNTJdLCA2MzogMTAxLCA2NDogNzYsIDY1OiBbMSwgNDRdLCA2OTogMTAyLCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyMDogNzUsIDMzOiBbMiwgOTJdLCA2MjogMTAzLCA2MzogMTA0LCA2NDogNzYsIDY1OiBbMSwgNDRdLCA2OTogMTA1LCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAzMzogWzEsIDEwNl0gfSwgeyAzMzogWzIsIDc5XSwgNjU6IFsyLCA3OV0sIDcyOiBbMiwgNzldLCA4MDogWzIsIDc5XSwgODE6IFsyLCA3OV0sIDgyOiBbMiwgNzldLCA4MzogWzIsIDc5XSwgODQ6IFsyLCA3OV0sIDg1OiBbMiwgNzldIH0sIHsgMzM6IFsyLCA4MV0gfSwgeyAyMzogWzIsIDI3XSwgMzM6IFsyLCAyN10sIDU0OiBbMiwgMjddLCA2NTogWzIsIDI3XSwgNjg6IFsyLCAyN10sIDcyOiBbMiwgMjddLCA3NTogWzIsIDI3XSwgODA6IFsyLCAyN10sIDgxOiBbMiwgMjddLCA4MjogWzIsIDI3XSwgODM6IFsyLCAyN10sIDg0OiBbMiwgMjddLCA4NTogWzIsIDI3XSB9LCB7IDIzOiBbMiwgMjhdLCAzMzogWzIsIDI4XSwgNTQ6IFsyLCAyOF0sIDY1OiBbMiwgMjhdLCA2ODogWzIsIDI4XSwgNzI6IFsyLCAyOF0sIDc1OiBbMiwgMjhdLCA4MDogWzIsIDI4XSwgODE6IFsyLCAyOF0sIDgyOiBbMiwgMjhdLCA4MzogWzIsIDI4XSwgODQ6IFsyLCAyOF0sIDg1OiBbMiwgMjhdIH0sIHsgMjM6IFsyLCAzMF0sIDMzOiBbMiwgMzBdLCA1NDogWzIsIDMwXSwgNjg6IFsyLCAzMF0sIDcxOiAxMDcsIDcyOiBbMSwgMTA4XSwgNzU6IFsyLCAzMF0gfSwgeyAyMzogWzIsIDk4XSwgMzM6IFsyLCA5OF0sIDU0OiBbMiwgOThdLCA2ODogWzIsIDk4XSwgNzI6IFsyLCA5OF0sIDc1OiBbMiwgOThdIH0sIHsgMjM6IFsyLCA0NV0sIDMzOiBbMiwgNDVdLCA1NDogWzIsIDQ1XSwgNjU6IFsyLCA0NV0sIDY4OiBbMiwgNDVdLCA3MjogWzIsIDQ1XSwgNzM6IFsxLCAxMDldLCA3NTogWzIsIDQ1XSwgODA6IFsyLCA0NV0sIDgxOiBbMiwgNDVdLCA4MjogWzIsIDQ1XSwgODM6IFsyLCA0NV0sIDg0OiBbMiwgNDVdLCA4NTogWzIsIDQ1XSwgODc6IFsyLCA0NV0gfSwgeyAyMzogWzIsIDQ0XSwgMzM6IFsyLCA0NF0sIDU0OiBbMiwgNDRdLCA2NTogWzIsIDQ0XSwgNjg6IFsyLCA0NF0sIDcyOiBbMiwgNDRdLCA3NTogWzIsIDQ0XSwgODA6IFsyLCA0NF0sIDgxOiBbMiwgNDRdLCA4MjogWzIsIDQ0XSwgODM6IFsyLCA0NF0sIDg0OiBbMiwgNDRdLCA4NTogWzIsIDQ0XSwgODc6IFsyLCA0NF0gfSwgeyA1NDogWzEsIDExMF0gfSwgeyA1NDogWzIsIDgzXSwgNjU6IFsyLCA4M10sIDcyOiBbMiwgODNdLCA4MDogWzIsIDgzXSwgODE6IFsyLCA4M10sIDgyOiBbMiwgODNdLCA4MzogWzIsIDgzXSwgODQ6IFsyLCA4M10sIDg1OiBbMiwgODNdIH0sIHsgNTQ6IFsyLCA4NV0gfSwgeyA1OiBbMiwgMTNdLCAxNDogWzIsIDEzXSwgMTU6IFsyLCAxM10sIDE5OiBbMiwgMTNdLCAyOTogWzIsIDEzXSwgMzQ6IFsyLCAxM10sIDM5OiBbMiwgMTNdLCA0NDogWzIsIDEzXSwgNDc6IFsyLCAxM10sIDQ4OiBbMiwgMTNdLCA1MTogWzIsIDEzXSwgNTU6IFsyLCAxM10sIDYwOiBbMiwgMTNdIH0sIHsgMzg6IDU2LCAzOTogWzEsIDU4XSwgNDM6IDU3LCA0NDogWzEsIDU5XSwgNDU6IDExMiwgNDY6IDExMSwgNDc6IFsyLCA3Nl0gfSwgeyAzMzogWzIsIDcwXSwgNDA6IDExMywgNjU6IFsyLCA3MF0sIDcyOiBbMiwgNzBdLCA3NTogWzIsIDcwXSwgODA6IFsyLCA3MF0sIDgxOiBbMiwgNzBdLCA4MjogWzIsIDcwXSwgODM6IFsyLCA3MF0sIDg0OiBbMiwgNzBdLCA4NTogWzIsIDcwXSB9LCB7IDQ3OiBbMiwgMThdIH0sIHsgNTogWzIsIDE0XSwgMTQ6IFsyLCAxNF0sIDE1OiBbMiwgMTRdLCAxOTogWzIsIDE0XSwgMjk6IFsyLCAxNF0sIDM0OiBbMiwgMTRdLCAzOTogWzIsIDE0XSwgNDQ6IFsyLCAxNF0sIDQ3OiBbMiwgMTRdLCA0ODogWzIsIDE0XSwgNTE6IFsyLCAxNF0sIDU1OiBbMiwgMTRdLCA2MDogWzIsIDE0XSB9LCB7IDMzOiBbMSwgMTE0XSB9LCB7IDMzOiBbMiwgODddLCA2NTogWzIsIDg3XSwgNzI6IFsyLCA4N10sIDgwOiBbMiwgODddLCA4MTogWzIsIDg3XSwgODI6IFsyLCA4N10sIDgzOiBbMiwgODddLCA4NDogWzIsIDg3XSwgODU6IFsyLCA4N10gfSwgeyAzMzogWzIsIDg5XSB9LCB7IDIwOiA3NSwgNjM6IDExNiwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjc6IDExNSwgNjg6IFsyLCA5Nl0sIDY5OiAxMTcsIDcwOiA3NywgNzE6IDc4LCA3MjogWzEsIDc5XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDMzOiBbMSwgMTE4XSB9LCB7IDMyOiAxMTksIDMzOiBbMiwgNjJdLCA3NDogMTIwLCA3NTogWzEsIDEyMV0gfSwgeyAzMzogWzIsIDU5XSwgNjU6IFsyLCA1OV0sIDcyOiBbMiwgNTldLCA3NTogWzIsIDU5XSwgODA6IFsyLCA1OV0sIDgxOiBbMiwgNTldLCA4MjogWzIsIDU5XSwgODM6IFsyLCA1OV0sIDg0OiBbMiwgNTldLCA4NTogWzIsIDU5XSB9LCB7IDMzOiBbMiwgNjFdLCA3NTogWzIsIDYxXSB9LCB7IDMzOiBbMiwgNjhdLCAzNzogMTIyLCA3NDogMTIzLCA3NTogWzEsIDEyMV0gfSwgeyAzMzogWzIsIDY1XSwgNjU6IFsyLCA2NV0sIDcyOiBbMiwgNjVdLCA3NTogWzIsIDY1XSwgODA6IFsyLCA2NV0sIDgxOiBbMiwgNjVdLCA4MjogWzIsIDY1XSwgODM6IFsyLCA2NV0sIDg0OiBbMiwgNjVdLCA4NTogWzIsIDY1XSB9LCB7IDMzOiBbMiwgNjddLCA3NTogWzIsIDY3XSB9LCB7IDIzOiBbMSwgMTI0XSB9LCB7IDIzOiBbMiwgNTFdLCA2NTogWzIsIDUxXSwgNzI6IFsyLCA1MV0sIDgwOiBbMiwgNTFdLCA4MTogWzIsIDUxXSwgODI6IFsyLCA1MV0sIDgzOiBbMiwgNTFdLCA4NDogWzIsIDUxXSwgODU6IFsyLCA1MV0gfSwgeyAyMzogWzIsIDUzXSB9LCB7IDMzOiBbMSwgMTI1XSB9LCB7IDMzOiBbMiwgOTFdLCA2NTogWzIsIDkxXSwgNzI6IFsyLCA5MV0sIDgwOiBbMiwgOTFdLCA4MTogWzIsIDkxXSwgODI6IFsyLCA5MV0sIDgzOiBbMiwgOTFdLCA4NDogWzIsIDkxXSwgODU6IFsyLCA5MV0gfSwgeyAzMzogWzIsIDkzXSB9LCB7IDU6IFsyLCAyMl0sIDE0OiBbMiwgMjJdLCAxNTogWzIsIDIyXSwgMTk6IFsyLCAyMl0sIDI5OiBbMiwgMjJdLCAzNDogWzIsIDIyXSwgMzk6IFsyLCAyMl0sIDQ0OiBbMiwgMjJdLCA0NzogWzIsIDIyXSwgNDg6IFsyLCAyMl0sIDUxOiBbMiwgMjJdLCA1NTogWzIsIDIyXSwgNjA6IFsyLCAyMl0gfSwgeyAyMzogWzIsIDk5XSwgMzM6IFsyLCA5OV0sIDU0OiBbMiwgOTldLCA2ODogWzIsIDk5XSwgNzI6IFsyLCA5OV0sIDc1OiBbMiwgOTldIH0sIHsgNzM6IFsxLCAxMDldIH0sIHsgMjA6IDc1LCA2MzogMTI2LCA2NDogNzYsIDY1OiBbMSwgNDRdLCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDU6IFsyLCAyM10sIDE0OiBbMiwgMjNdLCAxNTogWzIsIDIzXSwgMTk6IFsyLCAyM10sIDI5OiBbMiwgMjNdLCAzNDogWzIsIDIzXSwgMzk6IFsyLCAyM10sIDQ0OiBbMiwgMjNdLCA0NzogWzIsIDIzXSwgNDg6IFsyLCAyM10sIDUxOiBbMiwgMjNdLCA1NTogWzIsIDIzXSwgNjA6IFsyLCAyM10gfSwgeyA0NzogWzIsIDE5XSB9LCB7IDQ3OiBbMiwgNzddIH0sIHsgMjA6IDc1LCAzMzogWzIsIDcyXSwgNDE6IDEyNywgNjM6IDEyOCwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDEyOSwgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3NTogWzIsIDcyXSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDU6IFsyLCAyNF0sIDE0OiBbMiwgMjRdLCAxNTogWzIsIDI0XSwgMTk6IFsyLCAyNF0sIDI5OiBbMiwgMjRdLCAzNDogWzIsIDI0XSwgMzk6IFsyLCAyNF0sIDQ0OiBbMiwgMjRdLCA0NzogWzIsIDI0XSwgNDg6IFsyLCAyNF0sIDUxOiBbMiwgMjRdLCA1NTogWzIsIDI0XSwgNjA6IFsyLCAyNF0gfSwgeyA2ODogWzEsIDEzMF0gfSwgeyA2NTogWzIsIDk1XSwgNjg6IFsyLCA5NV0sIDcyOiBbMiwgOTVdLCA4MDogWzIsIDk1XSwgODE6IFsyLCA5NV0sIDgyOiBbMiwgOTVdLCA4MzogWzIsIDk1XSwgODQ6IFsyLCA5NV0sIDg1OiBbMiwgOTVdIH0sIHsgNjg6IFsyLCA5N10gfSwgeyA1OiBbMiwgMjFdLCAxNDogWzIsIDIxXSwgMTU6IFsyLCAyMV0sIDE5OiBbMiwgMjFdLCAyOTogWzIsIDIxXSwgMzQ6IFsyLCAyMV0sIDM5OiBbMiwgMjFdLCA0NDogWzIsIDIxXSwgNDc6IFsyLCAyMV0sIDQ4OiBbMiwgMjFdLCA1MTogWzIsIDIxXSwgNTU6IFsyLCAyMV0sIDYwOiBbMiwgMjFdIH0sIHsgMzM6IFsxLCAxMzFdIH0sIHsgMzM6IFsyLCA2M10gfSwgeyA3MjogWzEsIDEzM10sIDc2OiAxMzIgfSwgeyAzMzogWzEsIDEzNF0gfSwgeyAzMzogWzIsIDY5XSB9LCB7IDE1OiBbMiwgMTJdIH0sIHsgMTQ6IFsyLCAyNl0sIDE1OiBbMiwgMjZdLCAxOTogWzIsIDI2XSwgMjk6IFsyLCAyNl0sIDM0OiBbMiwgMjZdLCA0NzogWzIsIDI2XSwgNDg6IFsyLCAyNl0sIDUxOiBbMiwgMjZdLCA1NTogWzIsIDI2XSwgNjA6IFsyLCAyNl0gfSwgeyAyMzogWzIsIDMxXSwgMzM6IFsyLCAzMV0sIDU0OiBbMiwgMzFdLCA2ODogWzIsIDMxXSwgNzI6IFsyLCAzMV0sIDc1OiBbMiwgMzFdIH0sIHsgMzM6IFsyLCA3NF0sIDQyOiAxMzUsIDc0OiAxMzYsIDc1OiBbMSwgMTIxXSB9LCB7IDMzOiBbMiwgNzFdLCA2NTogWzIsIDcxXSwgNzI6IFsyLCA3MV0sIDc1OiBbMiwgNzFdLCA4MDogWzIsIDcxXSwgODE6IFsyLCA3MV0sIDgyOiBbMiwgNzFdLCA4MzogWzIsIDcxXSwgODQ6IFsyLCA3MV0sIDg1OiBbMiwgNzFdIH0sIHsgMzM6IFsyLCA3M10sIDc1OiBbMiwgNzNdIH0sIHsgMjM6IFsyLCAyOV0sIDMzOiBbMiwgMjldLCA1NDogWzIsIDI5XSwgNjU6IFsyLCAyOV0sIDY4OiBbMiwgMjldLCA3MjogWzIsIDI5XSwgNzU6IFsyLCAyOV0sIDgwOiBbMiwgMjldLCA4MTogWzIsIDI5XSwgODI6IFsyLCAyOV0sIDgzOiBbMiwgMjldLCA4NDogWzIsIDI5XSwgODU6IFsyLCAyOV0gfSwgeyAxNDogWzIsIDE1XSwgMTU6IFsyLCAxNV0sIDE5OiBbMiwgMTVdLCAyOTogWzIsIDE1XSwgMzQ6IFsyLCAxNV0sIDM5OiBbMiwgMTVdLCA0NDogWzIsIDE1XSwgNDc6IFsyLCAxNV0sIDQ4OiBbMiwgMTVdLCA1MTogWzIsIDE1XSwgNTU6IFsyLCAxNV0sIDYwOiBbMiwgMTVdIH0sIHsgNzI6IFsxLCAxMzhdLCA3NzogWzEsIDEzN10gfSwgeyA3MjogWzIsIDEwMF0sIDc3OiBbMiwgMTAwXSB9LCB7IDE0OiBbMiwgMTZdLCAxNTogWzIsIDE2XSwgMTk6IFsyLCAxNl0sIDI5OiBbMiwgMTZdLCAzNDogWzIsIDE2XSwgNDQ6IFsyLCAxNl0sIDQ3OiBbMiwgMTZdLCA0ODogWzIsIDE2XSwgNTE6IFsyLCAxNl0sIDU1OiBbMiwgMTZdLCA2MDogWzIsIDE2XSB9LCB7IDMzOiBbMSwgMTM5XSB9LCB7IDMzOiBbMiwgNzVdIH0sIHsgMzM6IFsyLCAzMl0gfSwgeyA3MjogWzIsIDEwMV0sIDc3OiBbMiwgMTAxXSB9LCB7IDE0OiBbMiwgMTddLCAxNTogWzIsIDE3XSwgMTk6IFsyLCAxN10sIDI5OiBbMiwgMTddLCAzNDogWzIsIDE3XSwgMzk6IFsyLCAxN10sIDQ0OiBbMiwgMTddLCA0NzogWzIsIDE3XSwgNDg6IFsyLCAxN10sIDUxOiBbMiwgMTddLCA1NTogWzIsIDE3XSwgNjA6IFsyLCAxN10gfV0sXG5cdCAgICAgICAgZGVmYXVsdEFjdGlvbnM6IHsgNDogWzIsIDFdLCA1NTogWzIsIDU1XSwgNTc6IFsyLCAyMF0sIDYxOiBbMiwgNTddLCA3NDogWzIsIDgxXSwgODM6IFsyLCA4NV0sIDg3OiBbMiwgMThdLCA5MTogWzIsIDg5XSwgMTAyOiBbMiwgNTNdLCAxMDU6IFsyLCA5M10sIDExMTogWzIsIDE5XSwgMTEyOiBbMiwgNzddLCAxMTc6IFsyLCA5N10sIDEyMDogWzIsIDYzXSwgMTIzOiBbMiwgNjldLCAxMjQ6IFsyLCAxMl0sIDEzNjogWzIsIDc1XSwgMTM3OiBbMiwgMzJdIH0sXG5cdCAgICAgICAgcGFyc2VFcnJvcjogZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0cik7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBwYXJzZTogZnVuY3Rpb24gcGFyc2UoaW5wdXQpIHtcblx0ICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuXHQgICAgICAgICAgICAgICAgc3RhY2sgPSBbMF0sXG5cdCAgICAgICAgICAgICAgICB2c3RhY2sgPSBbbnVsbF0sXG5cdCAgICAgICAgICAgICAgICBsc3RhY2sgPSBbXSxcblx0ICAgICAgICAgICAgICAgIHRhYmxlID0gdGhpcy50YWJsZSxcblx0ICAgICAgICAgICAgICAgIHl5dGV4dCA9IFwiXCIsXG5cdCAgICAgICAgICAgICAgICB5eWxpbmVubyA9IDAsXG5cdCAgICAgICAgICAgICAgICB5eWxlbmcgPSAwLFxuXHQgICAgICAgICAgICAgICAgcmVjb3ZlcmluZyA9IDAsXG5cdCAgICAgICAgICAgICAgICBURVJST1IgPSAyLFxuXHQgICAgICAgICAgICAgICAgRU9GID0gMTtcblx0ICAgICAgICAgICAgdGhpcy5sZXhlci5zZXRJbnB1dChpbnB1dCk7XG5cdCAgICAgICAgICAgIHRoaXMubGV4ZXIueXkgPSB0aGlzLnl5O1xuXHQgICAgICAgICAgICB0aGlzLnl5LmxleGVyID0gdGhpcy5sZXhlcjtcblx0ICAgICAgICAgICAgdGhpcy55eS5wYXJzZXIgPSB0aGlzO1xuXHQgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMubGV4ZXIueXlsbG9jID09IFwidW5kZWZpbmVkXCIpIHRoaXMubGV4ZXIueXlsbG9jID0ge307XG5cdCAgICAgICAgICAgIHZhciB5eWxvYyA9IHRoaXMubGV4ZXIueXlsbG9jO1xuXHQgICAgICAgICAgICBsc3RhY2sucHVzaCh5eWxvYyk7XG5cdCAgICAgICAgICAgIHZhciByYW5nZXMgPSB0aGlzLmxleGVyLm9wdGlvbnMgJiYgdGhpcy5sZXhlci5vcHRpb25zLnJhbmdlcztcblx0ICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnl5LnBhcnNlRXJyb3IgPT09IFwiZnVuY3Rpb25cIikgdGhpcy5wYXJzZUVycm9yID0gdGhpcy55eS5wYXJzZUVycm9yO1xuXHQgICAgICAgICAgICBmdW5jdGlvbiBwb3BTdGFjayhuKSB7XG5cdCAgICAgICAgICAgICAgICBzdGFjay5sZW5ndGggPSBzdGFjay5sZW5ndGggLSAyICogbjtcblx0ICAgICAgICAgICAgICAgIHZzdGFjay5sZW5ndGggPSB2c3RhY2subGVuZ3RoIC0gbjtcblx0ICAgICAgICAgICAgICAgIGxzdGFjay5sZW5ndGggPSBsc3RhY2subGVuZ3RoIC0gbjtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBmdW5jdGlvbiBsZXgoKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgdG9rZW47XG5cdCAgICAgICAgICAgICAgICB0b2tlbiA9IHNlbGYubGV4ZXIubGV4KCkgfHwgMTtcblx0ICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdG9rZW4gIT09IFwibnVtYmVyXCIpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHNlbGYuc3ltYm9sc19bdG9rZW5dIHx8IHRva2VuO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHZhciBzeW1ib2wsXG5cdCAgICAgICAgICAgICAgICBwcmVFcnJvclN5bWJvbCxcblx0ICAgICAgICAgICAgICAgIHN0YXRlLFxuXHQgICAgICAgICAgICAgICAgYWN0aW9uLFxuXHQgICAgICAgICAgICAgICAgYSxcblx0ICAgICAgICAgICAgICAgIHIsXG5cdCAgICAgICAgICAgICAgICB5eXZhbCA9IHt9LFxuXHQgICAgICAgICAgICAgICAgcCxcblx0ICAgICAgICAgICAgICAgIGxlbixcblx0ICAgICAgICAgICAgICAgIG5ld1N0YXRlLFxuXHQgICAgICAgICAgICAgICAgZXhwZWN0ZWQ7XG5cdCAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG5cdCAgICAgICAgICAgICAgICBzdGF0ZSA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEFjdGlvbnNbc3RhdGVdKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gdGhpcy5kZWZhdWx0QWN0aW9uc1tzdGF0ZV07XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmIChzeW1ib2wgPT09IG51bGwgfHwgdHlwZW9mIHN5bWJvbCA9PSBcInVuZGVmaW5lZFwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IGxleCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSB0YWJsZVtzdGF0ZV0gJiYgdGFibGVbc3RhdGVdW3N5bWJvbF07XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhYWN0aW9uLmxlbmd0aCB8fCAhYWN0aW9uWzBdKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGVyclN0ciA9IFwiXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWNvdmVyaW5nKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGZvciAocCBpbiB0YWJsZVtzdGF0ZV0pIGlmICh0aGlzLnRlcm1pbmFsc19bcF0gJiYgcCA+IDIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkLnB1c2goXCInXCIgKyB0aGlzLnRlcm1pbmFsc19bcF0gKyBcIidcIik7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIuc2hvd1Bvc2l0aW9uKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJTdHIgPSBcIlBhcnNlIGVycm9yIG9uIGxpbmUgXCIgKyAoeXlsaW5lbm8gKyAxKSArIFwiOlxcblwiICsgdGhpcy5sZXhlci5zaG93UG9zaXRpb24oKSArIFwiXFxuRXhwZWN0aW5nIFwiICsgZXhwZWN0ZWQuam9pbihcIiwgXCIpICsgXCIsIGdvdCAnXCIgKyAodGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sKSArIFwiJ1wiO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gXCJQYXJzZSBlcnJvciBvbiBsaW5lIFwiICsgKHl5bGluZW5vICsgMSkgKyBcIjogVW5leHBlY3RlZCBcIiArIChzeW1ib2wgPT0gMSA/IFwiZW5kIG9mIGlucHV0XCIgOiBcIidcIiArICh0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wpICsgXCInXCIpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFcnJvcihlcnJTdHIsIHsgdGV4dDogdGhpcy5sZXhlci5tYXRjaCwgdG9rZW46IHRoaXMudGVybWluYWxzX1tzeW1ib2xdIHx8IHN5bWJvbCwgbGluZTogdGhpcy5sZXhlci55eWxpbmVubywgbG9jOiB5eWxvYywgZXhwZWN0ZWQ6IGV4cGVjdGVkIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGlmIChhY3Rpb25bMF0gaW5zdGFuY2VvZiBBcnJheSAmJiBhY3Rpb24ubGVuZ3RoID4gMSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhcnNlIEVycm9yOiBtdWx0aXBsZSBhY3Rpb25zIHBvc3NpYmxlIGF0IHN0YXRlOiBcIiArIHN0YXRlICsgXCIsIHRva2VuOiBcIiArIHN5bWJvbCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBzd2l0Y2ggKGFjdGlvblswXSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChzeW1ib2wpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2c3RhY2sucHVzaCh0aGlzLmxleGVyLnl5dGV4dCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxzdGFjay5wdXNoKHRoaXMubGV4ZXIueXlsbG9jKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChhY3Rpb25bMV0pO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBudWxsO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXByZUVycm9yU3ltYm9sKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB5eWxlbmcgPSB0aGlzLmxleGVyLnl5bGVuZztcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHl5dGV4dCA9IHRoaXMubGV4ZXIueXl0ZXh0O1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgeXlsaW5lbm8gPSB0aGlzLmxleGVyLnl5bGluZW5vO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWNvdmVyaW5nID4gMCkgcmVjb3ZlcmluZy0tO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gcHJlRXJyb3JTeW1ib2w7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVFcnJvclN5bWJvbCA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuXHQgICAgICAgICAgICAgICAgICAgICAgICBsZW4gPSB0aGlzLnByb2R1Y3Rpb25zX1thY3Rpb25bMV1dWzFdO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB5eXZhbC4kID0gdnN0YWNrW3ZzdGFjay5sZW5ndGggLSBsZW5dO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB5eXZhbC5fJCA9IHsgZmlyc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAobGVuIHx8IDEpXS5maXJzdF9saW5lLCBsYXN0X2xpbmU6IGxzdGFja1tsc3RhY2subGVuZ3RoIC0gMV0ubGFzdF9saW5lLCBmaXJzdF9jb2x1bW46IGxzdGFja1tsc3RhY2subGVuZ3RoIC0gKGxlbiB8fCAxKV0uZmlyc3RfY29sdW1uLCBsYXN0X2NvbHVtbjogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5sYXN0X2NvbHVtbiB9O1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFuZ2VzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB5eXZhbC5fJC5yYW5nZSA9IFtsc3RhY2tbbHN0YWNrLmxlbmd0aCAtIChsZW4gfHwgMSldLnJhbmdlWzBdLCBsc3RhY2tbbHN0YWNrLmxlbmd0aCAtIDFdLnJhbmdlWzFdXTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgICAgICByID0gdGhpcy5wZXJmb3JtQWN0aW9uLmNhbGwoeXl2YWwsIHl5dGV4dCwgeXlsZW5nLCB5eWxpbmVubywgdGhpcy55eSwgYWN0aW9uWzFdLCB2c3RhY2ssIGxzdGFjayk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgciAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHI7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxlbikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sgPSBzdGFjay5zbGljZSgwLCAtMSAqIGxlbiAqIDIpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdnN0YWNrID0gdnN0YWNrLnNsaWNlKDAsIC0xICogbGVuKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxzdGFjayA9IGxzdGFjay5zbGljZSgwLCAtMSAqIGxlbik7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaCh0aGlzLnByb2R1Y3Rpb25zX1thY3Rpb25bMV1dWzBdKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdnN0YWNrLnB1c2goeXl2YWwuJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxzdGFjay5wdXNoKHl5dmFsLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RhdGUgPSB0YWJsZVtzdGFja1tzdGFjay5sZW5ndGggLSAyXV1bc3RhY2tbc3RhY2subGVuZ3RoIC0gMV1dO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5ld1N0YXRlKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXHQgICAgLyogSmlzb24gZ2VuZXJhdGVkIGxleGVyICovXG5cdCAgICB2YXIgbGV4ZXIgPSAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHZhciBsZXhlciA9IHsgRU9GOiAxLFxuXHQgICAgICAgICAgICBwYXJzZUVycm9yOiBmdW5jdGlvbiBwYXJzZUVycm9yKHN0ciwgaGFzaCkge1xuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMueXkucGFyc2VyKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eS5wYXJzZXIucGFyc2VFcnJvcihzdHIsIGhhc2gpO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RyKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgc2V0SW5wdXQ6IGZ1bmN0aW9uIHNldElucHV0KGlucHV0KSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuXHQgICAgICAgICAgICAgICAgdGhpcy5fbW9yZSA9IHRoaXMuX2xlc3MgPSB0aGlzLmRvbmUgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgIHRoaXMueXlsaW5lbm8gPSB0aGlzLnl5bGVuZyA9IDA7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnl5dGV4dCA9IHRoaXMubWF0Y2hlZCA9IHRoaXMubWF0Y2ggPSAnJztcblx0ICAgICAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sgPSBbJ0lOSVRJQUwnXTtcblx0ICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jID0geyBmaXJzdF9saW5lOiAxLCBmaXJzdF9jb2x1bW46IDAsIGxhc3RfbGluZTogMSwgbGFzdF9jb2x1bW46IDAgfTtcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZ2VzKSB0aGlzLnl5bGxvYy5yYW5nZSA9IFswLCAwXTtcblx0ICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gMDtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBpbnB1dDogZnVuY3Rpb24gaW5wdXQoKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgY2ggPSB0aGlzLl9pbnB1dFswXTtcblx0ICAgICAgICAgICAgICAgIHRoaXMueXl0ZXh0ICs9IGNoO1xuXHQgICAgICAgICAgICAgICAgdGhpcy55eWxlbmcrKztcblx0ICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0Kys7XG5cdCAgICAgICAgICAgICAgICB0aGlzLm1hdGNoICs9IGNoO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5tYXRjaGVkICs9IGNoO1xuXHQgICAgICAgICAgICAgICAgdmFyIGxpbmVzID0gY2gubWF0Y2goLyg/Olxcclxcbj98XFxuKS4qL2cpO1xuXHQgICAgICAgICAgICAgICAgaWYgKGxpbmVzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eWxpbmVubysrO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jLmxhc3RfbGluZSsrO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbisrO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHRoaXMueXlsbG9jLnJhbmdlWzFdKys7XG5cblx0ICAgICAgICAgICAgICAgIHRoaXMuX2lucHV0ID0gdGhpcy5faW5wdXQuc2xpY2UoMSk7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gY2g7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHVucHV0OiBmdW5jdGlvbiB1bnB1dChjaCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIGxlbiA9IGNoLmxlbmd0aDtcblx0ICAgICAgICAgICAgICAgIHZhciBsaW5lcyA9IGNoLnNwbGl0KC8oPzpcXHJcXG4/fFxcbikvZyk7XG5cblx0ICAgICAgICAgICAgICAgIHRoaXMuX2lucHV0ID0gY2ggKyB0aGlzLl9pbnB1dDtcblx0ICAgICAgICAgICAgICAgIHRoaXMueXl0ZXh0ID0gdGhpcy55eXRleHQuc3Vic3RyKDAsIHRoaXMueXl0ZXh0Lmxlbmd0aCAtIGxlbiAtIDEpO1xuXHQgICAgICAgICAgICAgICAgLy90aGlzLnl5bGVuZyAtPSBsZW47XG5cdCAgICAgICAgICAgICAgICB0aGlzLm9mZnNldCAtPSBsZW47XG5cdCAgICAgICAgICAgICAgICB2YXIgb2xkTGluZXMgPSB0aGlzLm1hdGNoLnNwbGl0KC8oPzpcXHJcXG4/fFxcbikvZyk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLm1hdGNoID0gdGhpcy5tYXRjaC5zdWJzdHIoMCwgdGhpcy5tYXRjaC5sZW5ndGggLSAxKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlZCA9IHRoaXMubWF0Y2hlZC5zdWJzdHIoMCwgdGhpcy5tYXRjaGVkLmxlbmd0aCAtIDEpO1xuXG5cdCAgICAgICAgICAgICAgICBpZiAobGluZXMubGVuZ3RoIC0gMSkgdGhpcy55eWxpbmVubyAtPSBsaW5lcy5sZW5ndGggLSAxO1xuXHQgICAgICAgICAgICAgICAgdmFyIHIgPSB0aGlzLnl5bGxvYy5yYW5nZTtcblxuXHQgICAgICAgICAgICAgICAgdGhpcy55eWxsb2MgPSB7IGZpcnN0X2xpbmU6IHRoaXMueXlsbG9jLmZpcnN0X2xpbmUsXG5cdCAgICAgICAgICAgICAgICAgICAgbGFzdF9saW5lOiB0aGlzLnl5bGluZW5vICsgMSxcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdF9jb2x1bW46IHRoaXMueXlsbG9jLmZpcnN0X2NvbHVtbixcblx0ICAgICAgICAgICAgICAgICAgICBsYXN0X2NvbHVtbjogbGluZXMgPyAobGluZXMubGVuZ3RoID09PSBvbGRMaW5lcy5sZW5ndGggPyB0aGlzLnl5bGxvYy5maXJzdF9jb2x1bW4gOiAwKSArIG9sZExpbmVzW29sZExpbmVzLmxlbmd0aCAtIGxpbmVzLmxlbmd0aF0ubGVuZ3RoIC0gbGluZXNbMF0ubGVuZ3RoIDogdGhpcy55eWxsb2MuZmlyc3RfY29sdW1uIC0gbGVuXG5cdCAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jLnJhbmdlID0gW3JbMF0sIHJbMF0gKyB0aGlzLnl5bGVuZyAtIGxlbl07XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgbW9yZTogZnVuY3Rpb24gbW9yZSgpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuX21vcmUgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGxlc3M6IGZ1bmN0aW9uIGxlc3Mobikge1xuXHQgICAgICAgICAgICAgICAgdGhpcy51bnB1dCh0aGlzLm1hdGNoLnNsaWNlKG4pKTtcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgcGFzdElucHV0OiBmdW5jdGlvbiBwYXN0SW5wdXQoKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgcGFzdCA9IHRoaXMubWF0Y2hlZC5zdWJzdHIoMCwgdGhpcy5tYXRjaGVkLmxlbmd0aCAtIHRoaXMubWF0Y2gubGVuZ3RoKTtcblx0ICAgICAgICAgICAgICAgIHJldHVybiAocGFzdC5sZW5ndGggPiAyMCA/ICcuLi4nIDogJycpICsgcGFzdC5zdWJzdHIoLTIwKS5yZXBsYWNlKC9cXG4vZywgXCJcIik7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHVwY29taW5nSW5wdXQ6IGZ1bmN0aW9uIHVwY29taW5nSW5wdXQoKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IHRoaXMubWF0Y2g7XG5cdCAgICAgICAgICAgICAgICBpZiAobmV4dC5sZW5ndGggPCAyMCkge1xuXHQgICAgICAgICAgICAgICAgICAgIG5leHQgKz0gdGhpcy5faW5wdXQuc3Vic3RyKDAsIDIwIC0gbmV4dC5sZW5ndGgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIChuZXh0LnN1YnN0cigwLCAyMCkgKyAobmV4dC5sZW5ndGggPiAyMCA/ICcuLi4nIDogJycpKS5yZXBsYWNlKC9cXG4vZywgXCJcIik7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHNob3dQb3NpdGlvbjogZnVuY3Rpb24gc2hvd1Bvc2l0aW9uKCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIHByZSA9IHRoaXMucGFzdElucHV0KCk7XG5cdCAgICAgICAgICAgICAgICB2YXIgYyA9IG5ldyBBcnJheShwcmUubGVuZ3RoICsgMSkuam9pbihcIi1cIik7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gcHJlICsgdGhpcy51cGNvbWluZ0lucHV0KCkgKyBcIlxcblwiICsgYyArIFwiXlwiO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiBuZXh0KCkge1xuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuZG9uZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLkVPRjtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGlmICghdGhpcy5faW5wdXQpIHRoaXMuZG9uZSA9IHRydWU7XG5cblx0ICAgICAgICAgICAgICAgIHZhciB0b2tlbiwgbWF0Y2gsIHRlbXBNYXRjaCwgaW5kZXgsIGNvbCwgbGluZXM7XG5cdCAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX21vcmUpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5dGV4dCA9ICcnO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0Y2ggPSAnJztcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIHZhciBydWxlcyA9IHRoaXMuX2N1cnJlbnRSdWxlcygpO1xuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRlbXBNYXRjaCA9IHRoaXMuX2lucHV0Lm1hdGNoKHRoaXMucnVsZXNbcnVsZXNbaV1dKTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGVtcE1hdGNoICYmICghbWF0Y2ggfHwgdGVtcE1hdGNoWzBdLmxlbmd0aCA+IG1hdGNoWzBdLmxlbmd0aCkpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSB0ZW1wTWF0Y2g7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZmxleCkgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgbGluZXMgPSBtYXRjaFswXS5tYXRjaCgvKD86XFxyXFxuP3xcXG4pLiovZyk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVzKSB0aGlzLnl5bGluZW5vICs9IGxpbmVzLmxlbmd0aDtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYyA9IHsgZmlyc3RfbGluZTogdGhpcy55eWxsb2MubGFzdF9saW5lLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBsYXN0X2xpbmU6IHRoaXMueXlsaW5lbm8gKyAxLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdF9jb2x1bW46IHRoaXMueXlsbG9jLmxhc3RfY29sdW1uLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBsYXN0X2NvbHVtbjogbGluZXMgPyBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5sZW5ndGggLSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5tYXRjaCgvXFxyP1xcbj8vKVswXS5sZW5ndGggOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbiArIG1hdGNoWzBdLmxlbmd0aCB9O1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXl0ZXh0ICs9IG1hdGNoWzBdO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0Y2ggKz0gbWF0Y2hbMF07XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRjaGVzID0gbWF0Y2g7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eWxlbmcgPSB0aGlzLnl5dGV4dC5sZW5ndGg7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55eWxsb2MucmFuZ2UgPSBbdGhpcy5vZmZzZXQsIHRoaXMub2Zmc2V0ICs9IHRoaXMueXlsZW5nXTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9yZSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX2lucHV0ID0gdGhpcy5faW5wdXQuc2xpY2UobWF0Y2hbMF0ubGVuZ3RoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGNoZWQgKz0gbWF0Y2hbMF07XG5cdCAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnBlcmZvcm1BY3Rpb24uY2FsbCh0aGlzLCB0aGlzLnl5LCB0aGlzLCBydWxlc1tpbmRleF0sIHRoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGggLSAxXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZG9uZSAmJiB0aGlzLl9pbnB1dCkgdGhpcy5kb25lID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuKSByZXR1cm4gdG9rZW47ZWxzZSByZXR1cm47XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5faW5wdXQgPT09IFwiXCIpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5FT0Y7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRXJyb3IoJ0xleGljYWwgZXJyb3Igb24gbGluZSAnICsgKHRoaXMueXlsaW5lbm8gKyAxKSArICcuIFVucmVjb2duaXplZCB0ZXh0LlxcbicgKyB0aGlzLnNob3dQb3NpdGlvbigpLCB7IHRleHQ6IFwiXCIsIHRva2VuOiBudWxsLCBsaW5lOiB0aGlzLnl5bGluZW5vIH0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBsZXg6IGZ1bmN0aW9uIGxleCgpIHtcblx0ICAgICAgICAgICAgICAgIHZhciByID0gdGhpcy5uZXh0KCk7XG5cdCAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHIgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHI7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxleCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBiZWdpbjogZnVuY3Rpb24gYmVnaW4oY29uZGl0aW9uKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbmRpdGlvblN0YWNrLnB1c2goY29uZGl0aW9uKTtcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgcG9wU3RhdGU6IGZ1bmN0aW9uIHBvcFN0YXRlKCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uU3RhY2sucG9wKCk7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9jdXJyZW50UnVsZXM6IGZ1bmN0aW9uIF9jdXJyZW50UnVsZXMoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25zW3RoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGggLSAxXV0ucnVsZXM7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHRvcFN0YXRlOiBmdW5jdGlvbiB0b3BTdGF0ZSgpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoIC0gMl07XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHB1c2hTdGF0ZTogZnVuY3Rpb24gYmVnaW4oY29uZGl0aW9uKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKGNvbmRpdGlvbik7XG5cdCAgICAgICAgICAgIH0gfTtcblx0ICAgICAgICBsZXhlci5vcHRpb25zID0ge307XG5cdCAgICAgICAgbGV4ZXIucGVyZm9ybUFjdGlvbiA9IGZ1bmN0aW9uIGFub255bW91cyh5eSwgeXlfLCAkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zLCBZWV9TVEFSVFxuXHQgICAgICAgIC8qKi8pIHtcblxuXHQgICAgICAgICAgICBmdW5jdGlvbiBzdHJpcChzdGFydCwgZW5kKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4geXlfLnl5dGV4dCA9IHl5Xy55eXRleHQuc3Vic3RyKHN0YXJ0LCB5eV8ueXlsZW5nIC0gZW5kKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHZhciBZWVNUQVRFID0gWVlfU1RBUlQ7XG5cdCAgICAgICAgICAgIHN3aXRjaCAoJGF2b2lkaW5nX25hbWVfY29sbGlzaW9ucykge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAwOlxuXHQgICAgICAgICAgICAgICAgICAgIGlmICh5eV8ueXl0ZXh0LnNsaWNlKC0yKSA9PT0gXCJcXFxcXFxcXFwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0cmlwKDAsIDEpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKFwibXVcIik7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh5eV8ueXl0ZXh0LnNsaWNlKC0xKSA9PT0gXCJcXFxcXCIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RyaXAoMCwgMSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmVnaW4oXCJlbXVcIik7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpbihcIm11XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICBpZiAoeXlfLnl5dGV4dCkgcmV0dXJuIDE1O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE1O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTU7XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKCdyYXcnKTtyZXR1cm4gMTU7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIFNob3VsZCBiZSB1c2luZyBgdGhpcy50b3BTdGF0ZSgpYCBiZWxvdywgYnV0IGl0IGN1cnJlbnRseVxuXHQgICAgICAgICAgICAgICAgICAgIC8vIHJldHVybnMgdGhlIHNlY29uZCB0b3AgaW5zdGVhZCBvZiB0aGUgZmlyc3QgdG9wLiBPcGVuZWQgYW5cblx0ICAgICAgICAgICAgICAgICAgICAvLyBpc3N1ZSBhYm91dCBpdCBhdCBodHRwczovL2dpdGh1Yi5jb20vemFhY2gvamlzb24vaXNzdWVzLzI5MVxuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoIC0gMV0gPT09ICdyYXcnKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNTtcblx0ICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB5eV8ueXl0ZXh0ID0geXlfLnl5dGV4dC5zdWJzdHIoNSwgeXlfLnl5bGVuZyAtIDkpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0VORF9SQVdfQkxPQ0snO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA1OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE0O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDc6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDY1O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA4OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA2ODtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEwOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKCdyYXcnKTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjM7XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTE6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDU1O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMjpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNjA7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEzOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAyOTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTQ6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDQ3O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxNTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7cmV0dXJuIDQ0O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxNjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7cmV0dXJuIDQ0O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxNzpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMzQ7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE4OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAzOTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTk6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDUxO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyMDpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNDg7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIxOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudW5wdXQoeXlfLnl5dGV4dCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuYmVnaW4oJ2NvbScpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIyOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTQ7XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjM6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDQ4O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyNDpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNzM7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI1OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA3Mjtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjY6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDcyO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyNzpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gODc7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI4OlxuXHQgICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSB3aGl0ZXNwYWNlXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI5OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtyZXR1cm4gNTQ7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDMwOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtyZXR1cm4gMzM7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDMxOlxuXHQgICAgICAgICAgICAgICAgICAgIHl5Xy55eXRleHQgPSBzdHJpcCgxLCAyKS5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJyk7cmV0dXJuIDgwO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMjpcblx0ICAgICAgICAgICAgICAgICAgICB5eV8ueXl0ZXh0ID0gc3RyaXAoMSwgMikucmVwbGFjZSgvXFxcXCcvZywgXCInXCIpO3JldHVybiA4MDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzM6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDg1O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzNDpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gODI7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM1OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA4Mjtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzY6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDgzO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzNzpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gODQ7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM4OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA4MTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzk6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDc1O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0MDpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNzc7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQxOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA3Mjtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDI6XG5cdCAgICAgICAgICAgICAgICAgICAgeXlfLnl5dGV4dCA9IHl5Xy55eXRleHQucmVwbGFjZSgvXFxcXChbXFxcXFxcXV0pL2csICckMScpO3JldHVybiA3Mjtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDM6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdJTlZBTElEJztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDQ6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDU7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9O1xuXHQgICAgICAgIGxleGVyLnJ1bGVzID0gWy9eKD86W15cXHgwMF0qPyg/PShcXHtcXHspKSkvLCAvXig/OlteXFx4MDBdKykvLCAvXig/OlteXFx4MDBdezIsfT8oPz0oXFx7XFx7fFxcXFxcXHtcXHt8XFxcXFxcXFxcXHtcXHt8JCkpKS8sIC9eKD86XFx7XFx7XFx7XFx7KD89W15cXC9dKSkvLCAvXig/Olxce1xce1xce1xce1xcL1teXFxzIVwiIyUtLFxcLlxcLzstPkBcXFstXFxeYFxcey1+XSsoPz1bPX1cXHNcXC8uXSlcXH1cXH1cXH1cXH0pLywgL14oPzpbXlxceDAwXSo/KD89KFxce1xce1xce1xceykpKS8sIC9eKD86W1xcc1xcU10qPy0tKH4pP1xcfVxcfSkvLCAvXig/OlxcKCkvLCAvXig/OlxcKSkvLCAvXig/Olxce1xce1xce1xceykvLCAvXig/OlxcfVxcfVxcfVxcfSkvLCAvXig/Olxce1xceyh+KT8+KS8sIC9eKD86XFx7XFx7KH4pPyM+KS8sIC9eKD86XFx7XFx7KH4pPyNcXCo/KS8sIC9eKD86XFx7XFx7KH4pP1xcLykvLCAvXig/Olxce1xceyh+KT9cXF5cXHMqKH4pP1xcfVxcfSkvLCAvXig/Olxce1xceyh+KT9cXHMqZWxzZVxccyoofik/XFx9XFx9KS8sIC9eKD86XFx7XFx7KH4pP1xcXikvLCAvXig/Olxce1xceyh+KT9cXHMqZWxzZVxcYikvLCAvXig/Olxce1xceyh+KT9cXHspLywgL14oPzpcXHtcXHsofik/JikvLCAvXig/Olxce1xceyh+KT8hLS0pLywgL14oPzpcXHtcXHsofik/IVtcXHNcXFNdKj9cXH1cXH0pLywgL14oPzpcXHtcXHsofik/XFwqPykvLCAvXig/Oj0pLywgL14oPzpcXC5cXC4pLywgL14oPzpcXC4oPz0oWz1+fVxcc1xcLy4pfF0pKSkvLCAvXig/OltcXC8uXSkvLCAvXig/OlxccyspLywgL14oPzpcXH0ofik/XFx9XFx9KS8sIC9eKD86KH4pP1xcfVxcfSkvLCAvXig/OlwiKFxcXFxbXCJdfFteXCJdKSpcIikvLCAvXig/OicoXFxcXFsnXXxbXiddKSonKS8sIC9eKD86QCkvLCAvXig/OnRydWUoPz0oW359XFxzKV0pKSkvLCAvXig/OmZhbHNlKD89KFt+fVxccyldKSkpLywgL14oPzp1bmRlZmluZWQoPz0oW359XFxzKV0pKSkvLCAvXig/Om51bGwoPz0oW359XFxzKV0pKSkvLCAvXig/Oi0/WzAtOV0rKD86XFwuWzAtOV0rKT8oPz0oW359XFxzKV0pKSkvLCAvXig/OmFzXFxzK1xcfCkvLCAvXig/OlxcfCkvLCAvXig/OihbXlxccyFcIiMlLSxcXC5cXC87LT5AXFxbLVxcXmBcXHstfl0rKD89KFs9fn1cXHNcXC8uKXxdKSkpKS8sIC9eKD86XFxbKFxcXFxcXF18W15cXF1dKSpcXF0pLywgL14oPzouKS8sIC9eKD86JCkvXTtcblx0ICAgICAgICBsZXhlci5jb25kaXRpb25zID0geyBcIm11XCI6IHsgXCJydWxlc1wiOiBbNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTksIDIwLCAyMSwgMjIsIDIzLCAyNCwgMjUsIDI2LCAyNywgMjgsIDI5LCAzMCwgMzEsIDMyLCAzMywgMzQsIDM1LCAzNiwgMzcsIDM4LCAzOSwgNDAsIDQxLCA0MiwgNDMsIDQ0XSwgXCJpbmNsdXNpdmVcIjogZmFsc2UgfSwgXCJlbXVcIjogeyBcInJ1bGVzXCI6IFsyXSwgXCJpbmNsdXNpdmVcIjogZmFsc2UgfSwgXCJjb21cIjogeyBcInJ1bGVzXCI6IFs2XSwgXCJpbmNsdXNpdmVcIjogZmFsc2UgfSwgXCJyYXdcIjogeyBcInJ1bGVzXCI6IFszLCA0LCA1XSwgXCJpbmNsdXNpdmVcIjogZmFsc2UgfSwgXCJJTklUSUFMXCI6IHsgXCJydWxlc1wiOiBbMCwgMSwgNDRdLCBcImluY2x1c2l2ZVwiOiB0cnVlIH0gfTtcblx0ICAgICAgICByZXR1cm4gbGV4ZXI7XG5cdCAgICB9KSgpO1xuXHQgICAgcGFyc2VyLmxleGVyID0gbGV4ZXI7XG5cdCAgICBmdW5jdGlvbiBQYXJzZXIoKSB7XG5cdCAgICAgICAgdGhpcy55eSA9IHt9O1xuXHQgICAgfVBhcnNlci5wcm90b3R5cGUgPSBwYXJzZXI7cGFyc2VyLlBhcnNlciA9IFBhcnNlcjtcblx0ICAgIHJldHVybiBuZXcgUGFyc2VyKCk7XG5cdH0pKCk7ZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBoYW5kbGViYXJzO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xuXG4vKioqLyB9KSxcbi8qIDM4ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF92aXNpdG9yID0gX193ZWJwYWNrX3JlcXVpcmVfXygzOSk7XG5cblx0dmFyIF92aXNpdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Zpc2l0b3IpO1xuXG5cdGZ1bmN0aW9uIFdoaXRlc3BhY2VDb250cm9sKCkge1xuXHQgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cblx0ICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHR9XG5cdFdoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZSA9IG5ldyBfdmlzaXRvcjJbJ2RlZmF1bHQnXSgpO1xuXG5cdFdoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5Qcm9ncmFtID0gZnVuY3Rpb24gKHByb2dyYW0pIHtcblx0ICB2YXIgZG9TdGFuZGFsb25lID0gIXRoaXMub3B0aW9ucy5pZ25vcmVTdGFuZGFsb25lO1xuXG5cdCAgdmFyIGlzUm9vdCA9ICF0aGlzLmlzUm9vdFNlZW47XG5cdCAgdGhpcy5pc1Jvb3RTZWVuID0gdHJ1ZTtcblxuXHQgIHZhciBib2R5ID0gcHJvZ3JhbS5ib2R5O1xuXHQgIGZvciAodmFyIGkgPSAwLCBsID0gYm9keS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgIHZhciBjdXJyZW50ID0gYm9keVtpXSxcblx0ICAgICAgICBzdHJpcCA9IHRoaXMuYWNjZXB0KGN1cnJlbnQpO1xuXG5cdCAgICBpZiAoIXN0cmlwKSB7XG5cdCAgICAgIGNvbnRpbnVlO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgX2lzUHJldldoaXRlc3BhY2UgPSBpc1ByZXZXaGl0ZXNwYWNlKGJvZHksIGksIGlzUm9vdCksXG5cdCAgICAgICAgX2lzTmV4dFdoaXRlc3BhY2UgPSBpc05leHRXaGl0ZXNwYWNlKGJvZHksIGksIGlzUm9vdCksXG5cdCAgICAgICAgb3BlblN0YW5kYWxvbmUgPSBzdHJpcC5vcGVuU3RhbmRhbG9uZSAmJiBfaXNQcmV2V2hpdGVzcGFjZSxcblx0ICAgICAgICBjbG9zZVN0YW5kYWxvbmUgPSBzdHJpcC5jbG9zZVN0YW5kYWxvbmUgJiYgX2lzTmV4dFdoaXRlc3BhY2UsXG5cdCAgICAgICAgaW5saW5lU3RhbmRhbG9uZSA9IHN0cmlwLmlubGluZVN0YW5kYWxvbmUgJiYgX2lzUHJldldoaXRlc3BhY2UgJiYgX2lzTmV4dFdoaXRlc3BhY2U7XG5cblx0ICAgIGlmIChzdHJpcC5jbG9zZSkge1xuXHQgICAgICBvbWl0UmlnaHQoYm9keSwgaSwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgICBpZiAoc3RyaXAub3Blbikge1xuXHQgICAgICBvbWl0TGVmdChib2R5LCBpLCB0cnVlKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGRvU3RhbmRhbG9uZSAmJiBpbmxpbmVTdGFuZGFsb25lKSB7XG5cdCAgICAgIG9taXRSaWdodChib2R5LCBpKTtcblxuXHQgICAgICBpZiAob21pdExlZnQoYm9keSwgaSkpIHtcblx0ICAgICAgICAvLyBJZiB3ZSBhcmUgb24gYSBzdGFuZGFsb25lIG5vZGUsIHNhdmUgdGhlIGluZGVudCBpbmZvIGZvciBwYXJ0aWFsc1xuXHQgICAgICAgIGlmIChjdXJyZW50LnR5cGUgPT09ICdQYXJ0aWFsU3RhdGVtZW50Jykge1xuXHQgICAgICAgICAgLy8gUHVsbCBvdXQgdGhlIHdoaXRlc3BhY2UgZnJvbSB0aGUgZmluYWwgbGluZVxuXHQgICAgICAgICAgY3VycmVudC5pbmRlbnQgPSAvKFsgXFx0XSskKS8uZXhlYyhib2R5W2kgLSAxXS5vcmlnaW5hbClbMV07XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICBpZiAoZG9TdGFuZGFsb25lICYmIG9wZW5TdGFuZGFsb25lKSB7XG5cdCAgICAgIG9taXRSaWdodCgoY3VycmVudC5wcm9ncmFtIHx8IGN1cnJlbnQuaW52ZXJzZSkuYm9keSk7XG5cblx0ICAgICAgLy8gU3RyaXAgb3V0IHRoZSBwcmV2aW91cyBjb250ZW50IG5vZGUgaWYgaXQncyB3aGl0ZXNwYWNlIG9ubHlcblx0ICAgICAgb21pdExlZnQoYm9keSwgaSk7XG5cdCAgICB9XG5cdCAgICBpZiAoZG9TdGFuZGFsb25lICYmIGNsb3NlU3RhbmRhbG9uZSkge1xuXHQgICAgICAvLyBBbHdheXMgc3RyaXAgdGhlIG5leHQgbm9kZVxuXHQgICAgICBvbWl0UmlnaHQoYm9keSwgaSk7XG5cblx0ICAgICAgb21pdExlZnQoKGN1cnJlbnQuaW52ZXJzZSB8fCBjdXJyZW50LnByb2dyYW0pLmJvZHkpO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIHJldHVybiBwcm9ncmFtO1xuXHR9O1xuXG5cdFdoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5CbG9ja1N0YXRlbWVudCA9IFdoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5EZWNvcmF0b3JCbG9jayA9IFdoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5QYXJ0aWFsQmxvY2tTdGF0ZW1lbnQgPSBmdW5jdGlvbiAoYmxvY2spIHtcblx0ICB0aGlzLmFjY2VwdChibG9jay5wcm9ncmFtKTtcblx0ICB0aGlzLmFjY2VwdChibG9jay5pbnZlcnNlKTtcblxuXHQgIC8vIEZpbmQgdGhlIGludmVyc2UgcHJvZ3JhbSB0aGF0IGlzIGludm9sZWQgd2l0aCB3aGl0ZXNwYWNlIHN0cmlwcGluZy5cblx0ICB2YXIgcHJvZ3JhbSA9IGJsb2NrLnByb2dyYW0gfHwgYmxvY2suaW52ZXJzZSxcblx0ICAgICAgaW52ZXJzZSA9IGJsb2NrLnByb2dyYW0gJiYgYmxvY2suaW52ZXJzZSxcblx0ICAgICAgZmlyc3RJbnZlcnNlID0gaW52ZXJzZSxcblx0ICAgICAgbGFzdEludmVyc2UgPSBpbnZlcnNlO1xuXG5cdCAgaWYgKGludmVyc2UgJiYgaW52ZXJzZS5jaGFpbmVkKSB7XG5cdCAgICBmaXJzdEludmVyc2UgPSBpbnZlcnNlLmJvZHlbMF0ucHJvZ3JhbTtcblxuXHQgICAgLy8gV2FsayB0aGUgaW52ZXJzZSBjaGFpbiB0byBmaW5kIHRoZSBsYXN0IGludmVyc2UgdGhhdCBpcyBhY3R1YWxseSBpbiB0aGUgY2hhaW4uXG5cdCAgICB3aGlsZSAobGFzdEludmVyc2UuY2hhaW5lZCkge1xuXHQgICAgICBsYXN0SW52ZXJzZSA9IGxhc3RJbnZlcnNlLmJvZHlbbGFzdEludmVyc2UuYm9keS5sZW5ndGggLSAxXS5wcm9ncmFtO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIHZhciBzdHJpcCA9IHtcblx0ICAgIG9wZW46IGJsb2NrLm9wZW5TdHJpcC5vcGVuLFxuXHQgICAgY2xvc2U6IGJsb2NrLmNsb3NlU3RyaXAuY2xvc2UsXG5cblx0ICAgIC8vIERldGVybWluZSB0aGUgc3RhbmRhbG9uZSBjYW5kaWFjeS4gQmFzaWNhbGx5IGZsYWcgb3VyIGNvbnRlbnQgYXMgYmVpbmcgcG9zc2libHkgc3RhbmRhbG9uZVxuXHQgICAgLy8gc28gb3VyIHBhcmVudCBjYW4gZGV0ZXJtaW5lIGlmIHdlIGFjdHVhbGx5IGFyZSBzdGFuZGFsb25lXG5cdCAgICBvcGVuU3RhbmRhbG9uZTogaXNOZXh0V2hpdGVzcGFjZShwcm9ncmFtLmJvZHkpLFxuXHQgICAgY2xvc2VTdGFuZGFsb25lOiBpc1ByZXZXaGl0ZXNwYWNlKChmaXJzdEludmVyc2UgfHwgcHJvZ3JhbSkuYm9keSlcblx0ICB9O1xuXG5cdCAgaWYgKGJsb2NrLm9wZW5TdHJpcC5jbG9zZSkge1xuXHQgICAgb21pdFJpZ2h0KHByb2dyYW0uYm9keSwgbnVsbCwgdHJ1ZSk7XG5cdCAgfVxuXG5cdCAgaWYgKGludmVyc2UpIHtcblx0ICAgIHZhciBpbnZlcnNlU3RyaXAgPSBibG9jay5pbnZlcnNlU3RyaXA7XG5cblx0ICAgIGlmIChpbnZlcnNlU3RyaXAub3Blbikge1xuXHQgICAgICBvbWl0TGVmdChwcm9ncmFtLmJvZHksIG51bGwsIHRydWUpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoaW52ZXJzZVN0cmlwLmNsb3NlKSB7XG5cdCAgICAgIG9taXRSaWdodChmaXJzdEludmVyc2UuYm9keSwgbnVsbCwgdHJ1ZSk7XG5cdCAgICB9XG5cdCAgICBpZiAoYmxvY2suY2xvc2VTdHJpcC5vcGVuKSB7XG5cdCAgICAgIG9taXRMZWZ0KGxhc3RJbnZlcnNlLmJvZHksIG51bGwsIHRydWUpO1xuXHQgICAgfVxuXG5cdCAgICAvLyBGaW5kIHN0YW5kYWxvbmUgZWxzZSBzdGF0bWVudHNcblx0ICAgIGlmICghdGhpcy5vcHRpb25zLmlnbm9yZVN0YW5kYWxvbmUgJiYgaXNQcmV2V2hpdGVzcGFjZShwcm9ncmFtLmJvZHkpICYmIGlzTmV4dFdoaXRlc3BhY2UoZmlyc3RJbnZlcnNlLmJvZHkpKSB7XG5cdCAgICAgIG9taXRMZWZ0KHByb2dyYW0uYm9keSk7XG5cdCAgICAgIG9taXRSaWdodChmaXJzdEludmVyc2UuYm9keSk7XG5cdCAgICB9XG5cdCAgfSBlbHNlIGlmIChibG9jay5jbG9zZVN0cmlwLm9wZW4pIHtcblx0ICAgIG9taXRMZWZ0KHByb2dyYW0uYm9keSwgbnVsbCwgdHJ1ZSk7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIHN0cmlwO1xuXHR9O1xuXG5cdFdoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5EZWNvcmF0b3IgPSBXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuTXVzdGFjaGVTdGF0ZW1lbnQgPSBmdW5jdGlvbiAobXVzdGFjaGUpIHtcblx0ICByZXR1cm4gbXVzdGFjaGUuc3RyaXA7XG5cdH07XG5cblx0V2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLlBhcnRpYWxTdGF0ZW1lbnQgPSBXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuQ29tbWVudFN0YXRlbWVudCA9IGZ1bmN0aW9uIChub2RlKSB7XG5cdCAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICB2YXIgc3RyaXAgPSBub2RlLnN0cmlwIHx8IHt9O1xuXHQgIHJldHVybiB7XG5cdCAgICBpbmxpbmVTdGFuZGFsb25lOiB0cnVlLFxuXHQgICAgb3Blbjogc3RyaXAub3Blbixcblx0ICAgIGNsb3NlOiBzdHJpcC5jbG9zZVxuXHQgIH07XG5cdH07XG5cblx0ZnVuY3Rpb24gaXNQcmV2V2hpdGVzcGFjZShib2R5LCBpLCBpc1Jvb3QpIHtcblx0ICBpZiAoaSA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICBpID0gYm9keS5sZW5ndGg7XG5cdCAgfVxuXG5cdCAgLy8gTm9kZXMgdGhhdCBlbmQgd2l0aCBuZXdsaW5lcyBhcmUgY29uc2lkZXJlZCB3aGl0ZXNwYWNlIChidXQgYXJlIHNwZWNpYWxcblx0ICAvLyBjYXNlZCBmb3Igc3RyaXAgb3BlcmF0aW9ucylcblx0ICB2YXIgcHJldiA9IGJvZHlbaSAtIDFdLFxuXHQgICAgICBzaWJsaW5nID0gYm9keVtpIC0gMl07XG5cdCAgaWYgKCFwcmV2KSB7XG5cdCAgICByZXR1cm4gaXNSb290O1xuXHQgIH1cblxuXHQgIGlmIChwcmV2LnR5cGUgPT09ICdDb250ZW50U3RhdGVtZW50Jykge1xuXHQgICAgcmV0dXJuIChzaWJsaW5nIHx8ICFpc1Jvb3QgPyAvXFxyP1xcblxccyo/JC8gOiAvKF58XFxyP1xcbilcXHMqPyQvKS50ZXN0KHByZXYub3JpZ2luYWwpO1xuXHQgIH1cblx0fVxuXHRmdW5jdGlvbiBpc05leHRXaGl0ZXNwYWNlKGJvZHksIGksIGlzUm9vdCkge1xuXHQgIGlmIChpID09PSB1bmRlZmluZWQpIHtcblx0ICAgIGkgPSAtMTtcblx0ICB9XG5cblx0ICB2YXIgbmV4dCA9IGJvZHlbaSArIDFdLFxuXHQgICAgICBzaWJsaW5nID0gYm9keVtpICsgMl07XG5cdCAgaWYgKCFuZXh0KSB7XG5cdCAgICByZXR1cm4gaXNSb290O1xuXHQgIH1cblxuXHQgIGlmIChuZXh0LnR5cGUgPT09ICdDb250ZW50U3RhdGVtZW50Jykge1xuXHQgICAgcmV0dXJuIChzaWJsaW5nIHx8ICFpc1Jvb3QgPyAvXlxccyo/XFxyP1xcbi8gOiAvXlxccyo/KFxccj9cXG58JCkvKS50ZXN0KG5leHQub3JpZ2luYWwpO1xuXHQgIH1cblx0fVxuXG5cdC8vIE1hcmtzIHRoZSBub2RlIHRvIHRoZSByaWdodCBvZiB0aGUgcG9zaXRpb24gYXMgb21pdHRlZC5cblx0Ly8gSS5lLiB7e2Zvb319JyAnIHdpbGwgbWFyayB0aGUgJyAnIG5vZGUgYXMgb21pdHRlZC5cblx0Ly9cblx0Ly8gSWYgaSBpcyB1bmRlZmluZWQsIHRoZW4gdGhlIGZpcnN0IGNoaWxkIHdpbGwgYmUgbWFya2VkIGFzIHN1Y2guXG5cdC8vXG5cdC8vIElmIG11bGl0cGxlIGlzIHRydXRoeSB0aGVuIGFsbCB3aGl0ZXNwYWNlIHdpbGwgYmUgc3RyaXBwZWQgb3V0IHVudGlsIG5vbi13aGl0ZXNwYWNlXG5cdC8vIGNvbnRlbnQgaXMgbWV0LlxuXHRmdW5jdGlvbiBvbWl0UmlnaHQoYm9keSwgaSwgbXVsdGlwbGUpIHtcblx0ICB2YXIgY3VycmVudCA9IGJvZHlbaSA9PSBudWxsID8gMCA6IGkgKyAxXTtcblx0ICBpZiAoIWN1cnJlbnQgfHwgY3VycmVudC50eXBlICE9PSAnQ29udGVudFN0YXRlbWVudCcgfHwgIW11bHRpcGxlICYmIGN1cnJlbnQucmlnaHRTdHJpcHBlZCkge1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblxuXHQgIHZhciBvcmlnaW5hbCA9IGN1cnJlbnQudmFsdWU7XG5cdCAgY3VycmVudC52YWx1ZSA9IGN1cnJlbnQudmFsdWUucmVwbGFjZShtdWx0aXBsZSA/IC9eXFxzKy8gOiAvXlsgXFx0XSpcXHI/XFxuPy8sICcnKTtcblx0ICBjdXJyZW50LnJpZ2h0U3RyaXBwZWQgPSBjdXJyZW50LnZhbHVlICE9PSBvcmlnaW5hbDtcblx0fVxuXG5cdC8vIE1hcmtzIHRoZSBub2RlIHRvIHRoZSBsZWZ0IG9mIHRoZSBwb3NpdGlvbiBhcyBvbWl0dGVkLlxuXHQvLyBJLmUuICcgJ3t7Zm9vfX0gd2lsbCBtYXJrIHRoZSAnICcgbm9kZSBhcyBvbWl0dGVkLlxuXHQvL1xuXHQvLyBJZiBpIGlzIHVuZGVmaW5lZCB0aGVuIHRoZSBsYXN0IGNoaWxkIHdpbGwgYmUgbWFya2VkIGFzIHN1Y2guXG5cdC8vXG5cdC8vIElmIG11bGl0cGxlIGlzIHRydXRoeSB0aGVuIGFsbCB3aGl0ZXNwYWNlIHdpbGwgYmUgc3RyaXBwZWQgb3V0IHVudGlsIG5vbi13aGl0ZXNwYWNlXG5cdC8vIGNvbnRlbnQgaXMgbWV0LlxuXHRmdW5jdGlvbiBvbWl0TGVmdChib2R5LCBpLCBtdWx0aXBsZSkge1xuXHQgIHZhciBjdXJyZW50ID0gYm9keVtpID09IG51bGwgPyBib2R5Lmxlbmd0aCAtIDEgOiBpIC0gMV07XG5cdCAgaWYgKCFjdXJyZW50IHx8IGN1cnJlbnQudHlwZSAhPT0gJ0NvbnRlbnRTdGF0ZW1lbnQnIHx8ICFtdWx0aXBsZSAmJiBjdXJyZW50LmxlZnRTdHJpcHBlZCkge1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblxuXHQgIC8vIFdlIG9taXQgdGhlIGxhc3Qgbm9kZSBpZiBpdCdzIHdoaXRlc3BhY2Ugb25seSBhbmQgbm90IHByZWNlZWRlZCBieSBhIG5vbi1jb250ZW50IG5vZGUuXG5cdCAgdmFyIG9yaWdpbmFsID0gY3VycmVudC52YWx1ZTtcblx0ICBjdXJyZW50LnZhbHVlID0gY3VycmVudC52YWx1ZS5yZXBsYWNlKG11bHRpcGxlID8gL1xccyskLyA6IC9bIFxcdF0rJC8sICcnKTtcblx0ICBjdXJyZW50LmxlZnRTdHJpcHBlZCA9IGN1cnJlbnQudmFsdWUgIT09IG9yaWdpbmFsO1xuXHQgIHJldHVybiBjdXJyZW50LmxlZnRTdHJpcHBlZDtcblx0fVxuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IFdoaXRlc3BhY2VDb250cm9sO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAzOSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfZXhjZXB0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHR2YXIgX2V4Y2VwdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leGNlcHRpb24pO1xuXG5cdGZ1bmN0aW9uIFZpc2l0b3IoKSB7XG5cdCAgdGhpcy5wYXJlbnRzID0gW107XG5cdH1cblxuXHRWaXNpdG9yLnByb3RvdHlwZSA9IHtcblx0ICBjb25zdHJ1Y3RvcjogVmlzaXRvcixcblx0ICBtdXRhdGluZzogZmFsc2UsXG5cblx0ICAvLyBWaXNpdHMgYSBnaXZlbiB2YWx1ZS4gSWYgbXV0YXRpbmcsIHdpbGwgcmVwbGFjZSB0aGUgdmFsdWUgaWYgbmVjZXNzYXJ5LlxuXHQgIGFjY2VwdEtleTogZnVuY3Rpb24gYWNjZXB0S2V5KG5vZGUsIG5hbWUpIHtcblx0ICAgIHZhciB2YWx1ZSA9IHRoaXMuYWNjZXB0KG5vZGVbbmFtZV0pO1xuXHQgICAgaWYgKHRoaXMubXV0YXRpbmcpIHtcblx0ICAgICAgLy8gSGFja3kgc2FuaXR5IGNoZWNrOiBUaGlzIG1heSBoYXZlIGEgZmV3IGZhbHNlIHBvc2l0aXZlcyBmb3IgdHlwZSBmb3IgdGhlIGhlbHBlclxuXHQgICAgICAvLyBtZXRob2RzIGJ1dCB3aWxsIGdlbmVyYWxseSBkbyB0aGUgcmlnaHQgdGhpbmcgd2l0aG91dCBhIGxvdCBvZiBvdmVyaGVhZC5cblx0ICAgICAgaWYgKHZhbHVlICYmICFWaXNpdG9yLnByb3RvdHlwZVt2YWx1ZS50eXBlXSkge1xuXHQgICAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdVbmV4cGVjdGVkIG5vZGUgdHlwZSBcIicgKyB2YWx1ZS50eXBlICsgJ1wiIGZvdW5kIHdoZW4gYWNjZXB0aW5nICcgKyBuYW1lICsgJyBvbiAnICsgbm9kZS50eXBlKTtcblx0ICAgICAgfVxuXHQgICAgICBub2RlW25hbWVdID0gdmFsdWU7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIC8vIFBlcmZvcm1zIGFuIGFjY2VwdCBvcGVyYXRpb24gd2l0aCBhZGRlZCBzYW5pdHkgY2hlY2sgdG8gZW5zdXJlXG5cdCAgLy8gcmVxdWlyZWQga2V5cyBhcmUgbm90IHJlbW92ZWQuXG5cdCAgYWNjZXB0UmVxdWlyZWQ6IGZ1bmN0aW9uIGFjY2VwdFJlcXVpcmVkKG5vZGUsIG5hbWUpIHtcblx0ICAgIHRoaXMuYWNjZXB0S2V5KG5vZGUsIG5hbWUpO1xuXG5cdCAgICBpZiAoIW5vZGVbbmFtZV0pIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10obm9kZS50eXBlICsgJyByZXF1aXJlcyAnICsgbmFtZSk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIC8vIFRyYXZlcnNlcyBhIGdpdmVuIGFycmF5LiBJZiBtdXRhdGluZywgZW1wdHkgcmVzcG5zZXMgd2lsbCBiZSByZW1vdmVkXG5cdCAgLy8gZm9yIGNoaWxkIGVsZW1lbnRzLlxuXHQgIGFjY2VwdEFycmF5OiBmdW5jdGlvbiBhY2NlcHRBcnJheShhcnJheSkge1xuXHQgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcnJheS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgdGhpcy5hY2NlcHRLZXkoYXJyYXksIGkpO1xuXG5cdCAgICAgIGlmICghYXJyYXlbaV0pIHtcblx0ICAgICAgICBhcnJheS5zcGxpY2UoaSwgMSk7XG5cdCAgICAgICAgaS0tO1xuXHQgICAgICAgIGwtLTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBhY2NlcHQ6IGZ1bmN0aW9uIGFjY2VwdChvYmplY3QpIHtcblx0ICAgIGlmICghb2JqZWN0KSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IFNhbml0eSBjb2RlICovXG5cdCAgICBpZiAoIXRoaXNbb2JqZWN0LnR5cGVdKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdVbmtub3duIHR5cGU6ICcgKyBvYmplY3QudHlwZSwgb2JqZWN0KTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHRoaXMuY3VycmVudCkge1xuXHQgICAgICB0aGlzLnBhcmVudHMudW5zaGlmdCh0aGlzLmN1cnJlbnQpO1xuXHQgICAgfVxuXHQgICAgdGhpcy5jdXJyZW50ID0gb2JqZWN0O1xuXG5cdCAgICB2YXIgcmV0ID0gdGhpc1tvYmplY3QudHlwZV0ob2JqZWN0KTtcblxuXHQgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5wYXJlbnRzLnNoaWZ0KCk7XG5cblx0ICAgIGlmICghdGhpcy5tdXRhdGluZyB8fCByZXQpIHtcblx0ICAgICAgcmV0dXJuIHJldDtcblx0ICAgIH0gZWxzZSBpZiAocmV0ICE9PSBmYWxzZSkge1xuXHQgICAgICByZXR1cm4gb2JqZWN0O1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBQcm9ncmFtOiBmdW5jdGlvbiBQcm9ncmFtKHByb2dyYW0pIHtcblx0ICAgIHRoaXMuYWNjZXB0QXJyYXkocHJvZ3JhbS5ib2R5KTtcblx0ICB9LFxuXG5cdCAgTXVzdGFjaGVTdGF0ZW1lbnQ6IHZpc2l0U3ViRXhwcmVzc2lvbixcblx0ICBEZWNvcmF0b3I6IHZpc2l0U3ViRXhwcmVzc2lvbixcblxuXHQgIEJsb2NrU3RhdGVtZW50OiB2aXNpdEJsb2NrLFxuXHQgIERlY29yYXRvckJsb2NrOiB2aXNpdEJsb2NrLFxuXG5cdCAgUGFydGlhbFN0YXRlbWVudDogdmlzaXRQYXJ0aWFsLFxuXHQgIFBhcnRpYWxCbG9ja1N0YXRlbWVudDogZnVuY3Rpb24gUGFydGlhbEJsb2NrU3RhdGVtZW50KHBhcnRpYWwpIHtcblx0ICAgIHZpc2l0UGFydGlhbC5jYWxsKHRoaXMsIHBhcnRpYWwpO1xuXG5cdCAgICB0aGlzLmFjY2VwdEtleShwYXJ0aWFsLCAncHJvZ3JhbScpO1xuXHQgIH0sXG5cblx0ICBDb250ZW50U3RhdGVtZW50OiBmdW5jdGlvbiBDb250ZW50U3RhdGVtZW50KCkgLyogY29udGVudCAqL3t9LFxuXHQgIENvbW1lbnRTdGF0ZW1lbnQ6IGZ1bmN0aW9uIENvbW1lbnRTdGF0ZW1lbnQoKSAvKiBjb21tZW50ICove30sXG5cblx0ICBTdWJFeHByZXNzaW9uOiB2aXNpdFN1YkV4cHJlc3Npb24sXG5cblx0ICBQYXRoRXhwcmVzc2lvbjogZnVuY3Rpb24gUGF0aEV4cHJlc3Npb24oKSAvKiBwYXRoICove30sXG5cblx0ICBTdHJpbmdMaXRlcmFsOiBmdW5jdGlvbiBTdHJpbmdMaXRlcmFsKCkgLyogc3RyaW5nICove30sXG5cdCAgTnVtYmVyTGl0ZXJhbDogZnVuY3Rpb24gTnVtYmVyTGl0ZXJhbCgpIC8qIG51bWJlciAqL3t9LFxuXHQgIEJvb2xlYW5MaXRlcmFsOiBmdW5jdGlvbiBCb29sZWFuTGl0ZXJhbCgpIC8qIGJvb2wgKi97fSxcblx0ICBVbmRlZmluZWRMaXRlcmFsOiBmdW5jdGlvbiBVbmRlZmluZWRMaXRlcmFsKCkgLyogbGl0ZXJhbCAqL3t9LFxuXHQgIE51bGxMaXRlcmFsOiBmdW5jdGlvbiBOdWxsTGl0ZXJhbCgpIC8qIGxpdGVyYWwgKi97fSxcblxuXHQgIEhhc2g6IGZ1bmN0aW9uIEhhc2goaGFzaCkge1xuXHQgICAgdGhpcy5hY2NlcHRBcnJheShoYXNoLnBhaXJzKTtcblx0ICB9LFxuXHQgIEhhc2hQYWlyOiBmdW5jdGlvbiBIYXNoUGFpcihwYWlyKSB7XG5cdCAgICB0aGlzLmFjY2VwdFJlcXVpcmVkKHBhaXIsICd2YWx1ZScpO1xuXHQgIH1cblx0fTtcblxuXHRmdW5jdGlvbiB2aXNpdFN1YkV4cHJlc3Npb24obXVzdGFjaGUpIHtcblx0ICB0aGlzLmFjY2VwdFJlcXVpcmVkKG11c3RhY2hlLCAncGF0aCcpO1xuXHQgIHRoaXMuYWNjZXB0QXJyYXkobXVzdGFjaGUucGFyYW1zKTtcblx0ICB0aGlzLmFjY2VwdEtleShtdXN0YWNoZSwgJ2hhc2gnKTtcblx0fVxuXHRmdW5jdGlvbiB2aXNpdEJsb2NrKGJsb2NrKSB7XG5cdCAgdmlzaXRTdWJFeHByZXNzaW9uLmNhbGwodGhpcywgYmxvY2spO1xuXG5cdCAgdGhpcy5hY2NlcHRLZXkoYmxvY2ssICdwcm9ncmFtJyk7XG5cdCAgdGhpcy5hY2NlcHRLZXkoYmxvY2ssICdpbnZlcnNlJyk7XG5cdH1cblx0ZnVuY3Rpb24gdmlzaXRQYXJ0aWFsKHBhcnRpYWwpIHtcblx0ICB0aGlzLmFjY2VwdFJlcXVpcmVkKHBhcnRpYWwsICduYW1lJyk7XG5cdCAgdGhpcy5hY2NlcHRBcnJheShwYXJ0aWFsLnBhcmFtcyk7XG5cdCAgdGhpcy5hY2NlcHRLZXkocGFydGlhbCwgJ2hhc2gnKTtcblx0fVxuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IFZpc2l0b3I7XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDQwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMuU291cmNlTG9jYXRpb24gPSBTb3VyY2VMb2NhdGlvbjtcblx0ZXhwb3J0cy5pZCA9IGlkO1xuXHRleHBvcnRzLnN0cmlwRmxhZ3MgPSBzdHJpcEZsYWdzO1xuXHRleHBvcnRzLnN0cmlwQ29tbWVudCA9IHN0cmlwQ29tbWVudDtcblx0ZXhwb3J0cy5wcmVwYXJlUGF0aCA9IHByZXBhcmVQYXRoO1xuXHRleHBvcnRzLnByZXBhcmVNdXN0YWNoZSA9IHByZXBhcmVNdXN0YWNoZTtcblx0ZXhwb3J0cy5wcmVwYXJlUmF3QmxvY2sgPSBwcmVwYXJlUmF3QmxvY2s7XG5cdGV4cG9ydHMucHJlcGFyZUJsb2NrID0gcHJlcGFyZUJsb2NrO1xuXHRleHBvcnRzLnByZXBhcmVQcm9ncmFtID0gcHJlcGFyZVByb2dyYW07XG5cdGV4cG9ydHMucHJlcGFyZVBhcnRpYWxCbG9jayA9IHByZXBhcmVQYXJ0aWFsQmxvY2s7XG5cblx0dmFyIF9leGNlcHRpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG5cdHZhciBfZXhjZXB0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4Y2VwdGlvbik7XG5cblx0ZnVuY3Rpb24gdmFsaWRhdGVDbG9zZShvcGVuLCBjbG9zZSkge1xuXHQgIGNsb3NlID0gY2xvc2UucGF0aCA/IGNsb3NlLnBhdGgub3JpZ2luYWwgOiBjbG9zZTtcblxuXHQgIGlmIChvcGVuLnBhdGgub3JpZ2luYWwgIT09IGNsb3NlKSB7XG5cdCAgICB2YXIgZXJyb3JOb2RlID0geyBsb2M6IG9wZW4ucGF0aC5sb2MgfTtcblxuXHQgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10ob3Blbi5wYXRoLm9yaWdpbmFsICsgXCIgZG9lc24ndCBtYXRjaCBcIiArIGNsb3NlLCBlcnJvck5vZGUpO1xuXHQgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIFNvdXJjZUxvY2F0aW9uKHNvdXJjZSwgbG9jSW5mbykge1xuXHQgIHRoaXMuc291cmNlID0gc291cmNlO1xuXHQgIHRoaXMuc3RhcnQgPSB7XG5cdCAgICBsaW5lOiBsb2NJbmZvLmZpcnN0X2xpbmUsXG5cdCAgICBjb2x1bW46IGxvY0luZm8uZmlyc3RfY29sdW1uXG5cdCAgfTtcblx0ICB0aGlzLmVuZCA9IHtcblx0ICAgIGxpbmU6IGxvY0luZm8ubGFzdF9saW5lLFxuXHQgICAgY29sdW1uOiBsb2NJbmZvLmxhc3RfY29sdW1uXG5cdCAgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlkKHRva2VuKSB7XG5cdCAgaWYgKC9eXFxbLipcXF0kLy50ZXN0KHRva2VuKSkge1xuXHQgICAgcmV0dXJuIHRva2VuLnN1YnN0cigxLCB0b2tlbi5sZW5ndGggLSAyKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmV0dXJuIHRva2VuO1xuXHQgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIHN0cmlwRmxhZ3Mob3BlbiwgY2xvc2UpIHtcblx0ICByZXR1cm4ge1xuXHQgICAgb3Blbjogb3Blbi5jaGFyQXQoMikgPT09ICd+Jyxcblx0ICAgIGNsb3NlOiBjbG9zZS5jaGFyQXQoY2xvc2UubGVuZ3RoIC0gMykgPT09ICd+J1xuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBzdHJpcENvbW1lbnQoY29tbWVudCkge1xuXHQgIHJldHVybiBjb21tZW50LnJlcGxhY2UoL15cXHtcXHt+P1xcIS0/LT8vLCAnJykucmVwbGFjZSgvLT8tP34/XFx9XFx9JC8sICcnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHByZXBhcmVQYXRoKGRhdGEsIHBhcnRzLCBsb2MpIHtcblx0ICBsb2MgPSB0aGlzLmxvY0luZm8obG9jKTtcblxuXHQgIHZhciBvcmlnaW5hbCA9IGRhdGEgPyAnQCcgOiAnJyxcblx0ICAgICAgZGlnID0gW10sXG5cdCAgICAgIGRlcHRoID0gMCxcblx0ICAgICAgZGVwdGhTdHJpbmcgPSAnJztcblxuXHQgIGZvciAodmFyIGkgPSAwLCBsID0gcGFydHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICB2YXIgcGFydCA9IHBhcnRzW2ldLnBhcnQsXG5cblx0ICAgIC8vIElmIHdlIGhhdmUgW10gc3ludGF4IHRoZW4gd2UgZG8gbm90IHRyZWF0IHBhdGggcmVmZXJlbmNlcyBhcyBvcGVyYXRvcnMsXG5cdCAgICAvLyBpLmUuIGZvby5bdGhpc10gcmVzb2x2ZXMgdG8gYXBwcm94aW1hdGVseSBjb250ZXh0LmZvb1sndGhpcyddXG5cdCAgICBpc0xpdGVyYWwgPSBwYXJ0c1tpXS5vcmlnaW5hbCAhPT0gcGFydDtcblx0ICAgIG9yaWdpbmFsICs9IChwYXJ0c1tpXS5zZXBhcmF0b3IgfHwgJycpICsgcGFydDtcblxuXHQgICAgaWYgKCFpc0xpdGVyYWwgJiYgKHBhcnQgPT09ICcuLicgfHwgcGFydCA9PT0gJy4nIHx8IHBhcnQgPT09ICd0aGlzJykpIHtcblx0ICAgICAgaWYgKGRpZy5sZW5ndGggPiAwKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ0ludmFsaWQgcGF0aDogJyArIG9yaWdpbmFsLCB7IGxvYzogbG9jIH0pO1xuXHQgICAgICB9IGVsc2UgaWYgKHBhcnQgPT09ICcuLicpIHtcblx0ICAgICAgICBkZXB0aCsrO1xuXHQgICAgICAgIGRlcHRoU3RyaW5nICs9ICcuLi8nO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBkaWcucHVzaChwYXJ0KTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICByZXR1cm4ge1xuXHQgICAgdHlwZTogJ1BhdGhFeHByZXNzaW9uJyxcblx0ICAgIGRhdGE6IGRhdGEsXG5cdCAgICBkZXB0aDogZGVwdGgsXG5cdCAgICBwYXJ0czogZGlnLFxuXHQgICAgb3JpZ2luYWw6IG9yaWdpbmFsLFxuXHQgICAgbG9jOiBsb2Ncblx0ICB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJlcGFyZU11c3RhY2hlKHBhdGgsIHBhcmFtcywgaGFzaCwgb3Blbiwgc3RyaXAsIGxvY0luZm8pIHtcblx0ICAvLyBNdXN0IHVzZSBjaGFyQXQgdG8gc3VwcG9ydCBJRSBwcmUtMTBcblx0ICB2YXIgZXNjYXBlRmxhZyA9IG9wZW4uY2hhckF0KDMpIHx8IG9wZW4uY2hhckF0KDIpLFxuXHQgICAgICBlc2NhcGVkID0gZXNjYXBlRmxhZyAhPT0gJ3snICYmIGVzY2FwZUZsYWcgIT09ICcmJztcblxuXHQgIHZhciBkZWNvcmF0b3IgPSAvXFwqLy50ZXN0KG9wZW4pO1xuXHQgIHJldHVybiB7XG5cdCAgICB0eXBlOiBkZWNvcmF0b3IgPyAnRGVjb3JhdG9yJyA6ICdNdXN0YWNoZVN0YXRlbWVudCcsXG5cdCAgICBwYXRoOiBwYXRoLFxuXHQgICAgcGFyYW1zOiBwYXJhbXMsXG5cdCAgICBoYXNoOiBoYXNoLFxuXHQgICAgZXNjYXBlZDogZXNjYXBlZCxcblx0ICAgIHN0cmlwOiBzdHJpcCxcblx0ICAgIGxvYzogdGhpcy5sb2NJbmZvKGxvY0luZm8pXG5cdCAgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIHByZXBhcmVSYXdCbG9jayhvcGVuUmF3QmxvY2ssIGNvbnRlbnRzLCBjbG9zZSwgbG9jSW5mbykge1xuXHQgIHZhbGlkYXRlQ2xvc2Uob3BlblJhd0Jsb2NrLCBjbG9zZSk7XG5cblx0ICBsb2NJbmZvID0gdGhpcy5sb2NJbmZvKGxvY0luZm8pO1xuXHQgIHZhciBwcm9ncmFtID0ge1xuXHQgICAgdHlwZTogJ1Byb2dyYW0nLFxuXHQgICAgYm9keTogY29udGVudHMsXG5cdCAgICBzdHJpcDoge30sXG5cdCAgICBsb2M6IGxvY0luZm9cblx0ICB9O1xuXG5cdCAgcmV0dXJuIHtcblx0ICAgIHR5cGU6ICdCbG9ja1N0YXRlbWVudCcsXG5cdCAgICBwYXRoOiBvcGVuUmF3QmxvY2sucGF0aCxcblx0ICAgIHBhcmFtczogb3BlblJhd0Jsb2NrLnBhcmFtcyxcblx0ICAgIGhhc2g6IG9wZW5SYXdCbG9jay5oYXNoLFxuXHQgICAgcHJvZ3JhbTogcHJvZ3JhbSxcblx0ICAgIG9wZW5TdHJpcDoge30sXG5cdCAgICBpbnZlcnNlU3RyaXA6IHt9LFxuXHQgICAgY2xvc2VTdHJpcDoge30sXG5cdCAgICBsb2M6IGxvY0luZm9cblx0ICB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJlcGFyZUJsb2NrKG9wZW5CbG9jaywgcHJvZ3JhbSwgaW52ZXJzZUFuZFByb2dyYW0sIGNsb3NlLCBpbnZlcnRlZCwgbG9jSW5mbykge1xuXHQgIGlmIChjbG9zZSAmJiBjbG9zZS5wYXRoKSB7XG5cdCAgICB2YWxpZGF0ZUNsb3NlKG9wZW5CbG9jaywgY2xvc2UpO1xuXHQgIH1cblxuXHQgIHZhciBkZWNvcmF0b3IgPSAvXFwqLy50ZXN0KG9wZW5CbG9jay5vcGVuKTtcblxuXHQgIHByb2dyYW0uYmxvY2tQYXJhbXMgPSBvcGVuQmxvY2suYmxvY2tQYXJhbXM7XG5cblx0ICB2YXIgaW52ZXJzZSA9IHVuZGVmaW5lZCxcblx0ICAgICAgaW52ZXJzZVN0cmlwID0gdW5kZWZpbmVkO1xuXG5cdCAgaWYgKGludmVyc2VBbmRQcm9ncmFtKSB7XG5cdCAgICBpZiAoZGVjb3JhdG9yKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdVbmV4cGVjdGVkIGludmVyc2UgYmxvY2sgb24gZGVjb3JhdG9yJywgaW52ZXJzZUFuZFByb2dyYW0pO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoaW52ZXJzZUFuZFByb2dyYW0uY2hhaW4pIHtcblx0ICAgICAgaW52ZXJzZUFuZFByb2dyYW0ucHJvZ3JhbS5ib2R5WzBdLmNsb3NlU3RyaXAgPSBjbG9zZS5zdHJpcDtcblx0ICAgIH1cblxuXHQgICAgaW52ZXJzZVN0cmlwID0gaW52ZXJzZUFuZFByb2dyYW0uc3RyaXA7XG5cdCAgICBpbnZlcnNlID0gaW52ZXJzZUFuZFByb2dyYW0ucHJvZ3JhbTtcblx0ICB9XG5cblx0ICBpZiAoaW52ZXJ0ZWQpIHtcblx0ICAgIGludmVydGVkID0gaW52ZXJzZTtcblx0ICAgIGludmVyc2UgPSBwcm9ncmFtO1xuXHQgICAgcHJvZ3JhbSA9IGludmVydGVkO1xuXHQgIH1cblxuXHQgIHJldHVybiB7XG5cdCAgICB0eXBlOiBkZWNvcmF0b3IgPyAnRGVjb3JhdG9yQmxvY2snIDogJ0Jsb2NrU3RhdGVtZW50Jyxcblx0ICAgIHBhdGg6IG9wZW5CbG9jay5wYXRoLFxuXHQgICAgcGFyYW1zOiBvcGVuQmxvY2sucGFyYW1zLFxuXHQgICAgaGFzaDogb3BlbkJsb2NrLmhhc2gsXG5cdCAgICBwcm9ncmFtOiBwcm9ncmFtLFxuXHQgICAgaW52ZXJzZTogaW52ZXJzZSxcblx0ICAgIG9wZW5TdHJpcDogb3BlbkJsb2NrLnN0cmlwLFxuXHQgICAgaW52ZXJzZVN0cmlwOiBpbnZlcnNlU3RyaXAsXG5cdCAgICBjbG9zZVN0cmlwOiBjbG9zZSAmJiBjbG9zZS5zdHJpcCxcblx0ICAgIGxvYzogdGhpcy5sb2NJbmZvKGxvY0luZm8pXG5cdCAgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIHByZXBhcmVQcm9ncmFtKHN0YXRlbWVudHMsIGxvYykge1xuXHQgIGlmICghbG9jICYmIHN0YXRlbWVudHMubGVuZ3RoKSB7XG5cdCAgICB2YXIgZmlyc3RMb2MgPSBzdGF0ZW1lbnRzWzBdLmxvYyxcblx0ICAgICAgICBsYXN0TG9jID0gc3RhdGVtZW50c1tzdGF0ZW1lbnRzLmxlbmd0aCAtIDFdLmxvYztcblxuXHQgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0ICAgIGlmIChmaXJzdExvYyAmJiBsYXN0TG9jKSB7XG5cdCAgICAgIGxvYyA9IHtcblx0ICAgICAgICBzb3VyY2U6IGZpcnN0TG9jLnNvdXJjZSxcblx0ICAgICAgICBzdGFydDoge1xuXHQgICAgICAgICAgbGluZTogZmlyc3RMb2Muc3RhcnQubGluZSxcblx0ICAgICAgICAgIGNvbHVtbjogZmlyc3RMb2Muc3RhcnQuY29sdW1uXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlbmQ6IHtcblx0ICAgICAgICAgIGxpbmU6IGxhc3RMb2MuZW5kLmxpbmUsXG5cdCAgICAgICAgICBjb2x1bW46IGxhc3RMb2MuZW5kLmNvbHVtblxuXHQgICAgICAgIH1cblx0ICAgICAgfTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICByZXR1cm4ge1xuXHQgICAgdHlwZTogJ1Byb2dyYW0nLFxuXHQgICAgYm9keTogc3RhdGVtZW50cyxcblx0ICAgIHN0cmlwOiB7fSxcblx0ICAgIGxvYzogbG9jXG5cdCAgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIHByZXBhcmVQYXJ0aWFsQmxvY2sob3BlbiwgcHJvZ3JhbSwgY2xvc2UsIGxvY0luZm8pIHtcblx0ICB2YWxpZGF0ZUNsb3NlKG9wZW4sIGNsb3NlKTtcblxuXHQgIHJldHVybiB7XG5cdCAgICB0eXBlOiAnUGFydGlhbEJsb2NrU3RhdGVtZW50Jyxcblx0ICAgIG5hbWU6IG9wZW4ucGF0aCxcblx0ICAgIHBhcmFtczogb3Blbi5wYXJhbXMsXG5cdCAgICBoYXNoOiBvcGVuLmhhc2gsXG5cdCAgICBwcm9ncmFtOiBwcm9ncmFtLFxuXHQgICAgb3BlblN0cmlwOiBvcGVuLnN0cmlwLFxuXHQgICAgY2xvc2VTdHJpcDogY2xvc2UgJiYgY2xvc2Uuc3RyaXAsXG5cdCAgICBsb2M6IHRoaXMubG9jSW5mbyhsb2NJbmZvKVxuXHQgIH07XG5cdH1cblxuLyoqKi8gfSksXG4vKiA0MSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5Db21waWxlciA9IENvbXBpbGVyO1xuXHRleHBvcnRzLnByZWNvbXBpbGUgPSBwcmVjb21waWxlO1xuXHRleHBvcnRzLmNvbXBpbGUgPSBjb21waWxlO1xuXG5cdHZhciBfZXhjZXB0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHR2YXIgX2V4Y2VwdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leGNlcHRpb24pO1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdHZhciBfYXN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNSk7XG5cblx0dmFyIF9hc3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXN0KTtcblxuXHR2YXIgc2xpY2UgPSBbXS5zbGljZTtcblxuXHRmdW5jdGlvbiBDb21waWxlcigpIHt9XG5cblx0Ly8gdGhlIGZvdW5kSGVscGVyIHJlZ2lzdGVyIHdpbGwgZGlzYW1iaWd1YXRlIGhlbHBlciBsb29rdXAgZnJvbSBmaW5kaW5nIGFcblx0Ly8gZnVuY3Rpb24gaW4gYSBjb250ZXh0LiBUaGlzIGlzIG5lY2Vzc2FyeSBmb3IgbXVzdGFjaGUgY29tcGF0aWJpbGl0eSwgd2hpY2hcblx0Ly8gcmVxdWlyZXMgdGhhdCBjb250ZXh0IGZ1bmN0aW9ucyBpbiBibG9ja3MgYXJlIGV2YWx1YXRlZCBieSBibG9ja0hlbHBlck1pc3NpbmcsXG5cdC8vIGFuZCB0aGVuIHByb2NlZWQgYXMgaWYgdGhlIHJlc3VsdGluZyB2YWx1ZSB3YXMgcHJvdmlkZWQgdG8gYmxvY2tIZWxwZXJNaXNzaW5nLlxuXG5cdENvbXBpbGVyLnByb3RvdHlwZSA9IHtcblx0ICBjb21waWxlcjogQ29tcGlsZXIsXG5cblx0ICBlcXVhbHM6IGZ1bmN0aW9uIGVxdWFscyhvdGhlcikge1xuXHQgICAgdmFyIGxlbiA9IHRoaXMub3Bjb2Rlcy5sZW5ndGg7XG5cdCAgICBpZiAob3RoZXIub3Bjb2Rlcy5sZW5ndGggIT09IGxlbikge1xuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgdmFyIG9wY29kZSA9IHRoaXMub3Bjb2Rlc1tpXSxcblx0ICAgICAgICAgIG90aGVyT3Bjb2RlID0gb3RoZXIub3Bjb2Rlc1tpXTtcblx0ICAgICAgaWYgKG9wY29kZS5vcGNvZGUgIT09IG90aGVyT3Bjb2RlLm9wY29kZSB8fCAhYXJnRXF1YWxzKG9wY29kZS5hcmdzLCBvdGhlck9wY29kZS5hcmdzKSkge1xuXHQgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICAvLyBXZSBrbm93IHRoYXQgbGVuZ3RoIGlzIHRoZSBzYW1lIGJldHdlZW4gdGhlIHR3byBhcnJheXMgYmVjYXVzZSB0aGV5IGFyZSBkaXJlY3RseSB0aWVkXG5cdCAgICAvLyB0byB0aGUgb3Bjb2RlIGJlaGF2aW9yIGFib3ZlLlxuXHQgICAgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIGlmICghdGhpcy5jaGlsZHJlbltpXS5lcXVhbHMob3RoZXIuY2hpbGRyZW5baV0pKSB7XG5cdCAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH0sXG5cblx0ICBndWlkOiAwLFxuXG5cdCAgY29tcGlsZTogZnVuY3Rpb24gY29tcGlsZShwcm9ncmFtLCBvcHRpb25zKSB7XG5cdCAgICB0aGlzLnNvdXJjZU5vZGUgPSBbXTtcblx0ICAgIHRoaXMub3Bjb2RlcyA9IFtdO1xuXHQgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuXHQgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0ICAgIHRoaXMuc3RyaW5nUGFyYW1zID0gb3B0aW9ucy5zdHJpbmdQYXJhbXM7XG5cdCAgICB0aGlzLnRyYWNrSWRzID0gb3B0aW9ucy50cmFja0lkcztcblxuXHQgICAgb3B0aW9ucy5ibG9ja1BhcmFtcyA9IG9wdGlvbnMuYmxvY2tQYXJhbXMgfHwgW107XG5cblx0ICAgIC8vIFRoZXNlIGNoYW5nZXMgd2lsbCBwcm9wYWdhdGUgdG8gdGhlIG90aGVyIGNvbXBpbGVyIGNvbXBvbmVudHNcblx0ICAgIHZhciBrbm93bkhlbHBlcnMgPSBvcHRpb25zLmtub3duSGVscGVycztcblx0ICAgIG9wdGlvbnMua25vd25IZWxwZXJzID0ge1xuXHQgICAgICAnaGVscGVyTWlzc2luZyc6IHRydWUsXG5cdCAgICAgICdibG9ja0hlbHBlck1pc3NpbmcnOiB0cnVlLFxuXHQgICAgICAnZWFjaCc6IHRydWUsXG5cdCAgICAgICdpZic6IHRydWUsXG5cdCAgICAgICd1bmxlc3MnOiB0cnVlLFxuXHQgICAgICAnd2l0aCc6IHRydWUsXG5cdCAgICAgICdsb2cnOiB0cnVlLFxuXHQgICAgICAnbG9va3VwJzogdHJ1ZVxuXHQgICAgfTtcblx0ICAgIGlmIChrbm93bkhlbHBlcnMpIHtcblx0ICAgICAgZm9yICh2YXIgX25hbWUgaW4ga25vd25IZWxwZXJzKSB7XG5cdCAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0ICAgICAgICBpZiAoX25hbWUgaW4ga25vd25IZWxwZXJzKSB7XG5cdCAgICAgICAgICB0aGlzLm9wdGlvbnMua25vd25IZWxwZXJzW19uYW1lXSA9IGtub3duSGVscGVyc1tfbmFtZV07XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB0aGlzLmFjY2VwdChwcm9ncmFtKTtcblx0ICB9LFxuXG5cdCAgY29tcGlsZVByb2dyYW06IGZ1bmN0aW9uIGNvbXBpbGVQcm9ncmFtKHByb2dyYW0pIHtcblx0ICAgIHZhciBjaGlsZENvbXBpbGVyID0gbmV3IHRoaXMuY29tcGlsZXIoKSxcblx0ICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5ldy1jYXBcblx0ICAgIHJlc3VsdCA9IGNoaWxkQ29tcGlsZXIuY29tcGlsZShwcm9ncmFtLCB0aGlzLm9wdGlvbnMpLFxuXHQgICAgICAgIGd1aWQgPSB0aGlzLmd1aWQrKztcblxuXHQgICAgdGhpcy51c2VQYXJ0aWFsID0gdGhpcy51c2VQYXJ0aWFsIHx8IHJlc3VsdC51c2VQYXJ0aWFsO1xuXG5cdCAgICB0aGlzLmNoaWxkcmVuW2d1aWRdID0gcmVzdWx0O1xuXHQgICAgdGhpcy51c2VEZXB0aHMgPSB0aGlzLnVzZURlcHRocyB8fCByZXN1bHQudXNlRGVwdGhzO1xuXG5cdCAgICByZXR1cm4gZ3VpZDtcblx0ICB9LFxuXG5cdCAgYWNjZXB0OiBmdW5jdGlvbiBhY2NlcHQobm9kZSkge1xuXHQgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IFNhbml0eSBjb2RlICovXG5cdCAgICBpZiAoIXRoaXNbbm9kZS50eXBlXSkge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVW5rbm93biB0eXBlOiAnICsgbm9kZS50eXBlLCBub2RlKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5zb3VyY2VOb2RlLnVuc2hpZnQobm9kZSk7XG5cdCAgICB2YXIgcmV0ID0gdGhpc1tub2RlLnR5cGVdKG5vZGUpO1xuXHQgICAgdGhpcy5zb3VyY2VOb2RlLnNoaWZ0KCk7XG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH0sXG5cblx0ICBQcm9ncmFtOiBmdW5jdGlvbiBQcm9ncmFtKHByb2dyYW0pIHtcblx0ICAgIHRoaXMub3B0aW9ucy5ibG9ja1BhcmFtcy51bnNoaWZ0KHByb2dyYW0uYmxvY2tQYXJhbXMpO1xuXG5cdCAgICB2YXIgYm9keSA9IHByb2dyYW0uYm9keSxcblx0ICAgICAgICBib2R5TGVuZ3RoID0gYm9keS5sZW5ndGg7XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvZHlMZW5ndGg7IGkrKykge1xuXHQgICAgICB0aGlzLmFjY2VwdChib2R5W2ldKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5vcHRpb25zLmJsb2NrUGFyYW1zLnNoaWZ0KCk7XG5cblx0ICAgIHRoaXMuaXNTaW1wbGUgPSBib2R5TGVuZ3RoID09PSAxO1xuXHQgICAgdGhpcy5ibG9ja1BhcmFtcyA9IHByb2dyYW0uYmxvY2tQYXJhbXMgPyBwcm9ncmFtLmJsb2NrUGFyYW1zLmxlbmd0aCA6IDA7XG5cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cblx0ICBCbG9ja1N0YXRlbWVudDogZnVuY3Rpb24gQmxvY2tTdGF0ZW1lbnQoYmxvY2spIHtcblx0ICAgIHRyYW5zZm9ybUxpdGVyYWxUb1BhdGgoYmxvY2spO1xuXG5cdCAgICB2YXIgcHJvZ3JhbSA9IGJsb2NrLnByb2dyYW0sXG5cdCAgICAgICAgaW52ZXJzZSA9IGJsb2NrLmludmVyc2U7XG5cblx0ICAgIHByb2dyYW0gPSBwcm9ncmFtICYmIHRoaXMuY29tcGlsZVByb2dyYW0ocHJvZ3JhbSk7XG5cdCAgICBpbnZlcnNlID0gaW52ZXJzZSAmJiB0aGlzLmNvbXBpbGVQcm9ncmFtKGludmVyc2UpO1xuXG5cdCAgICB2YXIgdHlwZSA9IHRoaXMuY2xhc3NpZnlTZXhwcihibG9jayk7XG5cblx0ICAgIGlmICh0eXBlID09PSAnaGVscGVyJykge1xuXHQgICAgICB0aGlzLmhlbHBlclNleHByKGJsb2NrLCBwcm9ncmFtLCBpbnZlcnNlKTtcblx0ICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3NpbXBsZScpIHtcblx0ICAgICAgdGhpcy5zaW1wbGVTZXhwcihibG9jayk7XG5cblx0ICAgICAgLy8gbm93IHRoYXQgdGhlIHNpbXBsZSBtdXN0YWNoZSBpcyByZXNvbHZlZCwgd2UgbmVlZCB0b1xuXHQgICAgICAvLyBldmFsdWF0ZSBpdCBieSBleGVjdXRpbmcgYGJsb2NrSGVscGVyTWlzc2luZ2Bcblx0ICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIGludmVyc2UpO1xuXHQgICAgICB0aGlzLm9wY29kZSgnZW1wdHlIYXNoJyk7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdibG9ja1ZhbHVlJywgYmxvY2sucGF0aC5vcmlnaW5hbCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLmFtYmlndW91c1NleHByKGJsb2NrLCBwcm9ncmFtLCBpbnZlcnNlKTtcblxuXHQgICAgICAvLyBub3cgdGhhdCB0aGUgc2ltcGxlIG11c3RhY2hlIGlzIHJlc29sdmVkLCB3ZSBuZWVkIHRvXG5cdCAgICAgIC8vIGV2YWx1YXRlIGl0IGJ5IGV4ZWN1dGluZyBgYmxvY2tIZWxwZXJNaXNzaW5nYFxuXHQgICAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBwcm9ncmFtKTtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgaW52ZXJzZSk7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdlbXB0eUhhc2gnKTtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2FtYmlndW91c0Jsb2NrVmFsdWUnKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZCcpO1xuXHQgIH0sXG5cblx0ICBEZWNvcmF0b3JCbG9jazogZnVuY3Rpb24gRGVjb3JhdG9yQmxvY2soZGVjb3JhdG9yKSB7XG5cdCAgICB2YXIgcHJvZ3JhbSA9IGRlY29yYXRvci5wcm9ncmFtICYmIHRoaXMuY29tcGlsZVByb2dyYW0oZGVjb3JhdG9yLnByb2dyYW0pO1xuXHQgICAgdmFyIHBhcmFtcyA9IHRoaXMuc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXMoZGVjb3JhdG9yLCBwcm9ncmFtLCB1bmRlZmluZWQpLFxuXHQgICAgICAgIHBhdGggPSBkZWNvcmF0b3IucGF0aDtcblxuXHQgICAgdGhpcy51c2VEZWNvcmF0b3JzID0gdHJ1ZTtcblx0ICAgIHRoaXMub3Bjb2RlKCdyZWdpc3RlckRlY29yYXRvcicsIHBhcmFtcy5sZW5ndGgsIHBhdGgub3JpZ2luYWwpO1xuXHQgIH0sXG5cblx0ICBQYXJ0aWFsU3RhdGVtZW50OiBmdW5jdGlvbiBQYXJ0aWFsU3RhdGVtZW50KHBhcnRpYWwpIHtcblx0ICAgIHRoaXMudXNlUGFydGlhbCA9IHRydWU7XG5cblx0ICAgIHZhciBwcm9ncmFtID0gcGFydGlhbC5wcm9ncmFtO1xuXHQgICAgaWYgKHByb2dyYW0pIHtcblx0ICAgICAgcHJvZ3JhbSA9IHRoaXMuY29tcGlsZVByb2dyYW0ocGFydGlhbC5wcm9ncmFtKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIHBhcmFtcyA9IHBhcnRpYWwucGFyYW1zO1xuXHQgICAgaWYgKHBhcmFtcy5sZW5ndGggPiAxKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdVbnN1cHBvcnRlZCBudW1iZXIgb2YgcGFydGlhbCBhcmd1bWVudHM6ICcgKyBwYXJhbXMubGVuZ3RoLCBwYXJ0aWFsKTtcblx0ICAgIH0gZWxzZSBpZiAoIXBhcmFtcy5sZW5ndGgpIHtcblx0ICAgICAgaWYgKHRoaXMub3B0aW9ucy5leHBsaWNpdFBhcnRpYWxDb250ZXh0KSB7XG5cdCAgICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgJ3VuZGVmaW5lZCcpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHBhcmFtcy5wdXNoKHsgdHlwZTogJ1BhdGhFeHByZXNzaW9uJywgcGFydHM6IFtdLCBkZXB0aDogMCB9KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICB2YXIgcGFydGlhbE5hbWUgPSBwYXJ0aWFsLm5hbWUub3JpZ2luYWwsXG5cdCAgICAgICAgaXNEeW5hbWljID0gcGFydGlhbC5uYW1lLnR5cGUgPT09ICdTdWJFeHByZXNzaW9uJztcblx0ICAgIGlmIChpc0R5bmFtaWMpIHtcblx0ICAgICAgdGhpcy5hY2NlcHQocGFydGlhbC5uYW1lKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5zZXR1cEZ1bGxNdXN0YWNoZVBhcmFtcyhwYXJ0aWFsLCBwcm9ncmFtLCB1bmRlZmluZWQsIHRydWUpO1xuXG5cdCAgICB2YXIgaW5kZW50ID0gcGFydGlhbC5pbmRlbnQgfHwgJyc7XG5cdCAgICBpZiAodGhpcy5vcHRpb25zLnByZXZlbnRJbmRlbnQgJiYgaW5kZW50KSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdhcHBlbmRDb250ZW50JywgaW5kZW50KTtcblx0ICAgICAgaW5kZW50ID0gJyc7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMub3Bjb2RlKCdpbnZva2VQYXJ0aWFsJywgaXNEeW5hbWljLCBwYXJ0aWFsTmFtZSwgaW5kZW50KTtcblx0ICAgIHRoaXMub3Bjb2RlKCdhcHBlbmQnKTtcblx0ICB9LFxuXHQgIFBhcnRpYWxCbG9ja1N0YXRlbWVudDogZnVuY3Rpb24gUGFydGlhbEJsb2NrU3RhdGVtZW50KHBhcnRpYWxCbG9jaykge1xuXHQgICAgdGhpcy5QYXJ0aWFsU3RhdGVtZW50KHBhcnRpYWxCbG9jayk7XG5cdCAgfSxcblxuXHQgIE11c3RhY2hlU3RhdGVtZW50OiBmdW5jdGlvbiBNdXN0YWNoZVN0YXRlbWVudChtdXN0YWNoZSkge1xuXHQgICAgdGhpcy5TdWJFeHByZXNzaW9uKG11c3RhY2hlKTtcblxuXHQgICAgaWYgKG11c3RhY2hlLmVzY2FwZWQgJiYgIXRoaXMub3B0aW9ucy5ub0VzY2FwZSkge1xuXHQgICAgICB0aGlzLm9wY29kZSgnYXBwZW5kRXNjYXBlZCcpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZCcpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgRGVjb3JhdG9yOiBmdW5jdGlvbiBEZWNvcmF0b3IoZGVjb3JhdG9yKSB7XG5cdCAgICB0aGlzLkRlY29yYXRvckJsb2NrKGRlY29yYXRvcik7XG5cdCAgfSxcblxuXHQgIENvbnRlbnRTdGF0ZW1lbnQ6IGZ1bmN0aW9uIENvbnRlbnRTdGF0ZW1lbnQoY29udGVudCkge1xuXHQgICAgaWYgKGNvbnRlbnQudmFsdWUpIHtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZENvbnRlbnQnLCBjb250ZW50LnZhbHVlKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgQ29tbWVudFN0YXRlbWVudDogZnVuY3Rpb24gQ29tbWVudFN0YXRlbWVudCgpIHt9LFxuXG5cdCAgU3ViRXhwcmVzc2lvbjogZnVuY3Rpb24gU3ViRXhwcmVzc2lvbihzZXhwcikge1xuXHQgICAgdHJhbnNmb3JtTGl0ZXJhbFRvUGF0aChzZXhwcik7XG5cdCAgICB2YXIgdHlwZSA9IHRoaXMuY2xhc3NpZnlTZXhwcihzZXhwcik7XG5cblx0ICAgIGlmICh0eXBlID09PSAnc2ltcGxlJykge1xuXHQgICAgICB0aGlzLnNpbXBsZVNleHByKHNleHByKTtcblx0ICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2hlbHBlcicpIHtcblx0ICAgICAgdGhpcy5oZWxwZXJTZXhwcihzZXhwcik7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLmFtYmlndW91c1NleHByKHNleHByKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIGFtYmlndW91c1NleHByOiBmdW5jdGlvbiBhbWJpZ3VvdXNTZXhwcihzZXhwciwgcHJvZ3JhbSwgaW52ZXJzZSkge1xuXHQgICAgdmFyIHBhdGggPSBzZXhwci5wYXRoLFxuXHQgICAgICAgIG5hbWUgPSBwYXRoLnBhcnRzWzBdLFxuXHQgICAgICAgIGlzQmxvY2sgPSBwcm9ncmFtICE9IG51bGwgfHwgaW52ZXJzZSAhPSBudWxsO1xuXG5cdCAgICB0aGlzLm9wY29kZSgnZ2V0Q29udGV4dCcsIHBhdGguZGVwdGgpO1xuXG5cdCAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBwcm9ncmFtKTtcblx0ICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIGludmVyc2UpO1xuXG5cdCAgICBwYXRoLnN0cmljdCA9IHRydWU7XG5cdCAgICB0aGlzLmFjY2VwdChwYXRoKTtcblxuXHQgICAgdGhpcy5vcGNvZGUoJ2ludm9rZUFtYmlndW91cycsIG5hbWUsIGlzQmxvY2spO1xuXHQgIH0sXG5cblx0ICBzaW1wbGVTZXhwcjogZnVuY3Rpb24gc2ltcGxlU2V4cHIoc2V4cHIpIHtcblx0ICAgIHZhciBwYXRoID0gc2V4cHIucGF0aDtcblx0ICAgIHBhdGguc3RyaWN0ID0gdHJ1ZTtcblx0ICAgIHRoaXMuYWNjZXB0KHBhdGgpO1xuXHQgICAgdGhpcy5vcGNvZGUoJ3Jlc29sdmVQb3NzaWJsZUxhbWJkYScpO1xuXHQgIH0sXG5cblx0ICBoZWxwZXJTZXhwcjogZnVuY3Rpb24gaGVscGVyU2V4cHIoc2V4cHIsIHByb2dyYW0sIGludmVyc2UpIHtcblx0ICAgIHZhciBwYXJhbXMgPSB0aGlzLnNldHVwRnVsbE11c3RhY2hlUGFyYW1zKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlKSxcblx0ICAgICAgICBwYXRoID0gc2V4cHIucGF0aCxcblx0ICAgICAgICBuYW1lID0gcGF0aC5wYXJ0c1swXTtcblxuXHQgICAgaWYgKHRoaXMub3B0aW9ucy5rbm93bkhlbHBlcnNbbmFtZV0pIHtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2ludm9rZUtub3duSGVscGVyJywgcGFyYW1zLmxlbmd0aCwgbmFtZSk7XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5rbm93bkhlbHBlcnNPbmx5KSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdZb3Ugc3BlY2lmaWVkIGtub3duSGVscGVyc09ubHksIGJ1dCB1c2VkIHRoZSB1bmtub3duIGhlbHBlciAnICsgbmFtZSwgc2V4cHIpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcGF0aC5zdHJpY3QgPSB0cnVlO1xuXHQgICAgICBwYXRoLmZhbHN5ID0gdHJ1ZTtcblxuXHQgICAgICB0aGlzLmFjY2VwdChwYXRoKTtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2ludm9rZUhlbHBlcicsIHBhcmFtcy5sZW5ndGgsIHBhdGgub3JpZ2luYWwsIF9hc3QyWydkZWZhdWx0J10uaGVscGVycy5zaW1wbGVJZChwYXRoKSk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIFBhdGhFeHByZXNzaW9uOiBmdW5jdGlvbiBQYXRoRXhwcmVzc2lvbihwYXRoKSB7XG5cdCAgICB0aGlzLmFkZERlcHRoKHBhdGguZGVwdGgpO1xuXHQgICAgdGhpcy5vcGNvZGUoJ2dldENvbnRleHQnLCBwYXRoLmRlcHRoKTtcblxuXHQgICAgdmFyIG5hbWUgPSBwYXRoLnBhcnRzWzBdLFxuXHQgICAgICAgIHNjb3BlZCA9IF9hc3QyWydkZWZhdWx0J10uaGVscGVycy5zY29wZWRJZChwYXRoKSxcblx0ICAgICAgICBibG9ja1BhcmFtSWQgPSAhcGF0aC5kZXB0aCAmJiAhc2NvcGVkICYmIHRoaXMuYmxvY2tQYXJhbUluZGV4KG5hbWUpO1xuXG5cdCAgICBpZiAoYmxvY2tQYXJhbUlkKSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdsb29rdXBCbG9ja1BhcmFtJywgYmxvY2tQYXJhbUlkLCBwYXRoLnBhcnRzKTtcblx0ICAgIH0gZWxzZSBpZiAoIW5hbWUpIHtcblx0ICAgICAgLy8gQ29udGV4dCByZWZlcmVuY2UsIGkuZS4gYHt7Zm9vIC59fWAgb3IgYHt7Zm9vIC4ufX1gXG5cdCAgICAgIHRoaXMub3Bjb2RlKCdwdXNoQ29udGV4dCcpO1xuXHQgICAgfSBlbHNlIGlmIChwYXRoLmRhdGEpIHtcblx0ICAgICAgdGhpcy5vcHRpb25zLmRhdGEgPSB0cnVlO1xuXHQgICAgICB0aGlzLm9wY29kZSgnbG9va3VwRGF0YScsIHBhdGguZGVwdGgsIHBhdGgucGFydHMsIHBhdGguc3RyaWN0KTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdsb29rdXBPbkNvbnRleHQnLCBwYXRoLnBhcnRzLCBwYXRoLmZhbHN5LCBwYXRoLnN0cmljdCwgc2NvcGVkKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgU3RyaW5nTGl0ZXJhbDogZnVuY3Rpb24gU3RyaW5nTGl0ZXJhbChzdHJpbmcpIHtcblx0ICAgIHRoaXMub3Bjb2RlKCdwdXNoU3RyaW5nJywgc3RyaW5nLnZhbHVlKTtcblx0ICB9LFxuXG5cdCAgTnVtYmVyTGl0ZXJhbDogZnVuY3Rpb24gTnVtYmVyTGl0ZXJhbChudW1iZXIpIHtcblx0ICAgIHRoaXMub3Bjb2RlKCdwdXNoTGl0ZXJhbCcsIG51bWJlci52YWx1ZSk7XG5cdCAgfSxcblxuXHQgIEJvb2xlYW5MaXRlcmFsOiBmdW5jdGlvbiBCb29sZWFuTGl0ZXJhbChib29sKSB7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCBib29sLnZhbHVlKTtcblx0ICB9LFxuXG5cdCAgVW5kZWZpbmVkTGl0ZXJhbDogZnVuY3Rpb24gVW5kZWZpbmVkTGl0ZXJhbCgpIHtcblx0ICAgIHRoaXMub3Bjb2RlKCdwdXNoTGl0ZXJhbCcsICd1bmRlZmluZWQnKTtcblx0ICB9LFxuXG5cdCAgTnVsbExpdGVyYWw6IGZ1bmN0aW9uIE51bGxMaXRlcmFsKCkge1xuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgJ251bGwnKTtcblx0ICB9LFxuXG5cdCAgSGFzaDogZnVuY3Rpb24gSGFzaChoYXNoKSB7XG5cdCAgICB2YXIgcGFpcnMgPSBoYXNoLnBhaXJzLFxuXHQgICAgICAgIGkgPSAwLFxuXHQgICAgICAgIGwgPSBwYWlycy5sZW5ndGg7XG5cblx0ICAgIHRoaXMub3Bjb2RlKCdwdXNoSGFzaCcpO1xuXG5cdCAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuXHQgICAgICB0aGlzLnB1c2hQYXJhbShwYWlyc1tpXS52YWx1ZSk7XG5cdCAgICB9XG5cdCAgICB3aGlsZSAoaS0tKSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdhc3NpZ25Ub0hhc2gnLCBwYWlyc1tpXS5rZXkpO1xuXHQgICAgfVxuXHQgICAgdGhpcy5vcGNvZGUoJ3BvcEhhc2gnKTtcblx0ICB9LFxuXG5cdCAgLy8gSEVMUEVSU1xuXHQgIG9wY29kZTogZnVuY3Rpb24gb3Bjb2RlKG5hbWUpIHtcblx0ICAgIHRoaXMub3Bjb2Rlcy5wdXNoKHsgb3Bjb2RlOiBuYW1lLCBhcmdzOiBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGxvYzogdGhpcy5zb3VyY2VOb2RlWzBdLmxvYyB9KTtcblx0ICB9LFxuXG5cdCAgYWRkRGVwdGg6IGZ1bmN0aW9uIGFkZERlcHRoKGRlcHRoKSB7XG5cdCAgICBpZiAoIWRlcHRoKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgdGhpcy51c2VEZXB0aHMgPSB0cnVlO1xuXHQgIH0sXG5cblx0ICBjbGFzc2lmeVNleHByOiBmdW5jdGlvbiBjbGFzc2lmeVNleHByKHNleHByKSB7XG5cdCAgICB2YXIgaXNTaW1wbGUgPSBfYXN0MlsnZGVmYXVsdCddLmhlbHBlcnMuc2ltcGxlSWQoc2V4cHIucGF0aCk7XG5cblx0ICAgIHZhciBpc0Jsb2NrUGFyYW0gPSBpc1NpbXBsZSAmJiAhIXRoaXMuYmxvY2tQYXJhbUluZGV4KHNleHByLnBhdGgucGFydHNbMF0pO1xuXG5cdCAgICAvLyBhIG11c3RhY2hlIGlzIGFuIGVsaWdpYmxlIGhlbHBlciBpZjpcblx0ICAgIC8vICogaXRzIGlkIGlzIHNpbXBsZSAoYSBzaW5nbGUgcGFydCwgbm90IGB0aGlzYCBvciBgLi5gKVxuXHQgICAgdmFyIGlzSGVscGVyID0gIWlzQmxvY2tQYXJhbSAmJiBfYXN0MlsnZGVmYXVsdCddLmhlbHBlcnMuaGVscGVyRXhwcmVzc2lvbihzZXhwcik7XG5cblx0ICAgIC8vIGlmIGEgbXVzdGFjaGUgaXMgYW4gZWxpZ2libGUgaGVscGVyIGJ1dCBub3QgYSBkZWZpbml0ZVxuXHQgICAgLy8gaGVscGVyLCBpdCBpcyBhbWJpZ3VvdXMsIGFuZCB3aWxsIGJlIHJlc29sdmVkIGluIGEgbGF0ZXJcblx0ICAgIC8vIHBhc3Mgb3IgYXQgcnVudGltZS5cblx0ICAgIHZhciBpc0VsaWdpYmxlID0gIWlzQmxvY2tQYXJhbSAmJiAoaXNIZWxwZXIgfHwgaXNTaW1wbGUpO1xuXG5cdCAgICAvLyBpZiBhbWJpZ3VvdXMsIHdlIGNhbiBwb3NzaWJseSByZXNvbHZlIHRoZSBhbWJpZ3VpdHkgbm93XG5cdCAgICAvLyBBbiBlbGlnaWJsZSBoZWxwZXIgaXMgb25lIHRoYXQgZG9lcyBub3QgaGF2ZSBhIGNvbXBsZXggcGF0aCwgaS5lLiBgdGhpcy5mb29gLCBgLi4vZm9vYCBldGMuXG5cdCAgICBpZiAoaXNFbGlnaWJsZSAmJiAhaXNIZWxwZXIpIHtcblx0ICAgICAgdmFyIF9uYW1lMiA9IHNleHByLnBhdGgucGFydHNbMF0sXG5cdCAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG5cdCAgICAgIGlmIChvcHRpb25zLmtub3duSGVscGVyc1tfbmFtZTJdKSB7XG5cdCAgICAgICAgaXNIZWxwZXIgPSB0cnVlO1xuXHQgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMua25vd25IZWxwZXJzT25seSkge1xuXHQgICAgICAgIGlzRWxpZ2libGUgPSBmYWxzZTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBpZiAoaXNIZWxwZXIpIHtcblx0ICAgICAgcmV0dXJuICdoZWxwZXInO1xuXHQgICAgfSBlbHNlIGlmIChpc0VsaWdpYmxlKSB7XG5cdCAgICAgIHJldHVybiAnYW1iaWd1b3VzJztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiAnc2ltcGxlJztcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgcHVzaFBhcmFtczogZnVuY3Rpb24gcHVzaFBhcmFtcyhwYXJhbXMpIHtcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsID0gcGFyYW1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICB0aGlzLnB1c2hQYXJhbShwYXJhbXNbaV0pO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBwdXNoUGFyYW06IGZ1bmN0aW9uIHB1c2hQYXJhbSh2YWwpIHtcblx0ICAgIHZhciB2YWx1ZSA9IHZhbC52YWx1ZSAhPSBudWxsID8gdmFsLnZhbHVlIDogdmFsLm9yaWdpbmFsIHx8ICcnO1xuXG5cdCAgICBpZiAodGhpcy5zdHJpbmdQYXJhbXMpIHtcblx0ICAgICAgaWYgKHZhbHVlLnJlcGxhY2UpIHtcblx0ICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL14oXFwuP1xcLlxcLykqL2csICcnKS5yZXBsYWNlKC9cXC8vZywgJy4nKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICh2YWwuZGVwdGgpIHtcblx0ICAgICAgICB0aGlzLmFkZERlcHRoKHZhbC5kZXB0aCk7XG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5vcGNvZGUoJ2dldENvbnRleHQnLCB2YWwuZGVwdGggfHwgMCk7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdwdXNoU3RyaW5nUGFyYW0nLCB2YWx1ZSwgdmFsLnR5cGUpO1xuXG5cdCAgICAgIGlmICh2YWwudHlwZSA9PT0gJ1N1YkV4cHJlc3Npb24nKSB7XG5cdCAgICAgICAgLy8gU3ViRXhwcmVzc2lvbnMgZ2V0IGV2YWx1YXRlZCBhbmQgcGFzc2VkIGluXG5cdCAgICAgICAgLy8gaW4gc3RyaW5nIHBhcmFtcyBtb2RlLlxuXHQgICAgICAgIHRoaXMuYWNjZXB0KHZhbCk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGlmICh0aGlzLnRyYWNrSWRzKSB7XG5cdCAgICAgICAgdmFyIGJsb2NrUGFyYW1JbmRleCA9IHVuZGVmaW5lZDtcblx0ICAgICAgICBpZiAodmFsLnBhcnRzICYmICFfYXN0MlsnZGVmYXVsdCddLmhlbHBlcnMuc2NvcGVkSWQodmFsKSAmJiAhdmFsLmRlcHRoKSB7XG5cdCAgICAgICAgICBibG9ja1BhcmFtSW5kZXggPSB0aGlzLmJsb2NrUGFyYW1JbmRleCh2YWwucGFydHNbMF0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoYmxvY2tQYXJhbUluZGV4KSB7XG5cdCAgICAgICAgICB2YXIgYmxvY2tQYXJhbUNoaWxkID0gdmFsLnBhcnRzLnNsaWNlKDEpLmpvaW4oJy4nKTtcblx0ICAgICAgICAgIHRoaXMub3Bjb2RlKCdwdXNoSWQnLCAnQmxvY2tQYXJhbScsIGJsb2NrUGFyYW1JbmRleCwgYmxvY2tQYXJhbUNoaWxkKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgdmFsdWUgPSB2YWwub3JpZ2luYWwgfHwgdmFsdWU7XG5cdCAgICAgICAgICBpZiAodmFsdWUucmVwbGFjZSkge1xuXHQgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL150aGlzKD86XFwufCQpLywgJycpLnJlcGxhY2UoL15cXC5cXC8vLCAnJykucmVwbGFjZSgvXlxcLiQvLCAnJyk7XG5cdCAgICAgICAgICB9XG5cblx0ICAgICAgICAgIHRoaXMub3Bjb2RlKCdwdXNoSWQnLCB2YWwudHlwZSwgdmFsdWUpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICB0aGlzLmFjY2VwdCh2YWwpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBzZXR1cEZ1bGxNdXN0YWNoZVBhcmFtczogZnVuY3Rpb24gc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXMoc2V4cHIsIHByb2dyYW0sIGludmVyc2UsIG9taXRFbXB0eSkge1xuXHQgICAgdmFyIHBhcmFtcyA9IHNleHByLnBhcmFtcztcblx0ICAgIHRoaXMucHVzaFBhcmFtcyhwYXJhbXMpO1xuXG5cdCAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBwcm9ncmFtKTtcblx0ICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIGludmVyc2UpO1xuXG5cdCAgICBpZiAoc2V4cHIuaGFzaCkge1xuXHQgICAgICB0aGlzLmFjY2VwdChzZXhwci5oYXNoKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdlbXB0eUhhc2gnLCBvbWl0RW1wdHkpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gcGFyYW1zO1xuXHQgIH0sXG5cblx0ICBibG9ja1BhcmFtSW5kZXg6IGZ1bmN0aW9uIGJsb2NrUGFyYW1JbmRleChuYW1lKSB7XG5cdCAgICBmb3IgKHZhciBkZXB0aCA9IDAsIGxlbiA9IHRoaXMub3B0aW9ucy5ibG9ja1BhcmFtcy5sZW5ndGg7IGRlcHRoIDwgbGVuOyBkZXB0aCsrKSB7XG5cdCAgICAgIHZhciBibG9ja1BhcmFtcyA9IHRoaXMub3B0aW9ucy5ibG9ja1BhcmFtc1tkZXB0aF0sXG5cdCAgICAgICAgICBwYXJhbSA9IGJsb2NrUGFyYW1zICYmIF91dGlscy5pbmRleE9mKGJsb2NrUGFyYW1zLCBuYW1lKTtcblx0ICAgICAgaWYgKGJsb2NrUGFyYW1zICYmIHBhcmFtID49IDApIHtcblx0ICAgICAgICByZXR1cm4gW2RlcHRoLCBwYXJhbV07XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdH07XG5cblx0ZnVuY3Rpb24gcHJlY29tcGlsZShpbnB1dCwgb3B0aW9ucywgZW52KSB7XG5cdCAgaWYgKGlucHV0ID09IG51bGwgfHwgdHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyAmJiBpbnB1dC50eXBlICE9PSAnUHJvZ3JhbScpIHtcblx0ICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdZb3UgbXVzdCBwYXNzIGEgc3RyaW5nIG9yIEhhbmRsZWJhcnMgQVNUIHRvIEhhbmRsZWJhcnMucHJlY29tcGlsZS4gWW91IHBhc3NlZCAnICsgaW5wdXQpO1xuXHQgIH1cblxuXHQgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHQgIGlmICghKCdkYXRhJyBpbiBvcHRpb25zKSkge1xuXHQgICAgb3B0aW9ucy5kYXRhID0gdHJ1ZTtcblx0ICB9XG5cdCAgaWYgKG9wdGlvbnMuY29tcGF0KSB7XG5cdCAgICBvcHRpb25zLnVzZURlcHRocyA9IHRydWU7XG5cdCAgfVxuXG5cdCAgdmFyIGFzdCA9IGVudi5wYXJzZShpbnB1dCwgb3B0aW9ucyksXG5cdCAgICAgIGVudmlyb25tZW50ID0gbmV3IGVudi5Db21waWxlcigpLmNvbXBpbGUoYXN0LCBvcHRpb25zKTtcblx0ICByZXR1cm4gbmV3IGVudi5KYXZhU2NyaXB0Q29tcGlsZXIoKS5jb21waWxlKGVudmlyb25tZW50LCBvcHRpb25zKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNvbXBpbGUoaW5wdXQsIG9wdGlvbnMsIGVudikge1xuXHQgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIG9wdGlvbnMgPSB7fTtcblxuXHQgIGlmIChpbnB1dCA9PSBudWxsIHx8IHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycgJiYgaW5wdXQudHlwZSAhPT0gJ1Byb2dyYW0nKSB7XG5cdCAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnWW91IG11c3QgcGFzcyBhIHN0cmluZyBvciBIYW5kbGViYXJzIEFTVCB0byBIYW5kbGViYXJzLmNvbXBpbGUuIFlvdSBwYXNzZWQgJyArIGlucHV0KTtcblx0ICB9XG5cblx0ICBvcHRpb25zID0gX3V0aWxzLmV4dGVuZCh7fSwgb3B0aW9ucyk7XG5cdCAgaWYgKCEoJ2RhdGEnIGluIG9wdGlvbnMpKSB7XG5cdCAgICBvcHRpb25zLmRhdGEgPSB0cnVlO1xuXHQgIH1cblx0ICBpZiAob3B0aW9ucy5jb21wYXQpIHtcblx0ICAgIG9wdGlvbnMudXNlRGVwdGhzID0gdHJ1ZTtcblx0ICB9XG5cblx0ICB2YXIgY29tcGlsZWQgPSB1bmRlZmluZWQ7XG5cblx0ICBmdW5jdGlvbiBjb21waWxlSW5wdXQoKSB7XG5cdCAgICB2YXIgYXN0ID0gZW52LnBhcnNlKGlucHV0LCBvcHRpb25zKSxcblx0ICAgICAgICBlbnZpcm9ubWVudCA9IG5ldyBlbnYuQ29tcGlsZXIoKS5jb21waWxlKGFzdCwgb3B0aW9ucyksXG5cdCAgICAgICAgdGVtcGxhdGVTcGVjID0gbmV3IGVudi5KYXZhU2NyaXB0Q29tcGlsZXIoKS5jb21waWxlKGVudmlyb25tZW50LCBvcHRpb25zLCB1bmRlZmluZWQsIHRydWUpO1xuXHQgICAgcmV0dXJuIGVudi50ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMpO1xuXHQgIH1cblxuXHQgIC8vIFRlbXBsYXRlIGlzIG9ubHkgY29tcGlsZWQgb24gZmlyc3QgdXNlIGFuZCBjYWNoZWQgYWZ0ZXIgdGhhdCBwb2ludC5cblx0ICBmdW5jdGlvbiByZXQoY29udGV4dCwgZXhlY09wdGlvbnMpIHtcblx0ICAgIGlmICghY29tcGlsZWQpIHtcblx0ICAgICAgY29tcGlsZWQgPSBjb21waWxlSW5wdXQoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjb21waWxlZC5jYWxsKHRoaXMsIGNvbnRleHQsIGV4ZWNPcHRpb25zKTtcblx0ICB9XG5cdCAgcmV0Ll9zZXR1cCA9IGZ1bmN0aW9uIChzZXR1cE9wdGlvbnMpIHtcblx0ICAgIGlmICghY29tcGlsZWQpIHtcblx0ICAgICAgY29tcGlsZWQgPSBjb21waWxlSW5wdXQoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjb21waWxlZC5fc2V0dXAoc2V0dXBPcHRpb25zKTtcblx0ICB9O1xuXHQgIHJldC5fY2hpbGQgPSBmdW5jdGlvbiAoaSwgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuXHQgICAgaWYgKCFjb21waWxlZCkge1xuXHQgICAgICBjb21waWxlZCA9IGNvbXBpbGVJbnB1dCgpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGNvbXBpbGVkLl9jaGlsZChpLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcblx0ICB9O1xuXHQgIHJldHVybiByZXQ7XG5cdH1cblxuXHRmdW5jdGlvbiBhcmdFcXVhbHMoYSwgYikge1xuXHQgIGlmIChhID09PSBiKSB7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cblx0ICBpZiAoX3V0aWxzLmlzQXJyYXkoYSkgJiYgX3V0aWxzLmlzQXJyYXkoYikgJiYgYS5sZW5ndGggPT09IGIubGVuZ3RoKSB7XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgaWYgKCFhcmdFcXVhbHMoYVtpXSwgYltpXSkpIHtcblx0ICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIHRyYW5zZm9ybUxpdGVyYWxUb1BhdGgoc2V4cHIpIHtcblx0ICBpZiAoIXNleHByLnBhdGgucGFydHMpIHtcblx0ICAgIHZhciBsaXRlcmFsID0gc2V4cHIucGF0aDtcblx0ICAgIC8vIENhc3RpbmcgdG8gc3RyaW5nIGhlcmUgdG8gbWFrZSBmYWxzZSBhbmQgMCBsaXRlcmFsIHZhbHVlcyBwbGF5IG5pY2VseSB3aXRoIHRoZSByZXN0XG5cdCAgICAvLyBvZiB0aGUgc3lzdGVtLlxuXHQgICAgc2V4cHIucGF0aCA9IHtcblx0ICAgICAgdHlwZTogJ1BhdGhFeHByZXNzaW9uJyxcblx0ICAgICAgZGF0YTogZmFsc2UsXG5cdCAgICAgIGRlcHRoOiAwLFxuXHQgICAgICBwYXJ0czogW2xpdGVyYWwub3JpZ2luYWwgKyAnJ10sXG5cdCAgICAgIG9yaWdpbmFsOiBsaXRlcmFsLm9yaWdpbmFsICsgJycsXG5cdCAgICAgIGxvYzogbGl0ZXJhbC5sb2Ncblx0ICAgIH07XG5cdCAgfVxuXHR9XG5cbi8qKiovIH0pLFxuLyogNDIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX2Jhc2UgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQpO1xuXG5cdHZhciBfZXhjZXB0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHR2YXIgX2V4Y2VwdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leGNlcHRpb24pO1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdHZhciBfY29kZUdlbiA9IF9fd2VicGFja19yZXF1aXJlX18oNDMpO1xuXG5cdHZhciBfY29kZUdlbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb2RlR2VuKTtcblxuXHRmdW5jdGlvbiBMaXRlcmFsKHZhbHVlKSB7XG5cdCAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gSmF2YVNjcmlwdENvbXBpbGVyKCkge31cblxuXHRKYXZhU2NyaXB0Q29tcGlsZXIucHJvdG90eXBlID0ge1xuXHQgIC8vIFBVQkxJQyBBUEk6IFlvdSBjYW4gb3ZlcnJpZGUgdGhlc2UgbWV0aG9kcyBpbiBhIHN1YmNsYXNzIHRvIHByb3ZpZGVcblx0ICAvLyBhbHRlcm5hdGl2ZSBjb21waWxlZCBmb3JtcyBmb3IgbmFtZSBsb29rdXAgYW5kIGJ1ZmZlcmluZyBzZW1hbnRpY3Ncblx0ICBuYW1lTG9va3VwOiBmdW5jdGlvbiBuYW1lTG9va3VwKHBhcmVudCwgbmFtZSAvKiAsIHR5cGUqLykge1xuXHQgICAgaWYgKEphdmFTY3JpcHRDb21waWxlci5pc1ZhbGlkSmF2YVNjcmlwdFZhcmlhYmxlTmFtZShuYW1lKSkge1xuXHQgICAgICByZXR1cm4gW3BhcmVudCwgJy4nLCBuYW1lXTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiBbcGFyZW50LCAnWycsIEpTT04uc3RyaW5naWZ5KG5hbWUpLCAnXSddO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgZGVwdGhlZExvb2t1cDogZnVuY3Rpb24gZGVwdGhlZExvb2t1cChuYW1lKSB7XG5cdCAgICByZXR1cm4gW3RoaXMuYWxpYXNhYmxlKCdjb250YWluZXIubG9va3VwJyksICcoZGVwdGhzLCBcIicsIG5hbWUsICdcIiknXTtcblx0ICB9LFxuXG5cdCAgY29tcGlsZXJJbmZvOiBmdW5jdGlvbiBjb21waWxlckluZm8oKSB7XG5cdCAgICB2YXIgcmV2aXNpb24gPSBfYmFzZS5DT01QSUxFUl9SRVZJU0lPTixcblx0ICAgICAgICB2ZXJzaW9ucyA9IF9iYXNlLlJFVklTSU9OX0NIQU5HRVNbcmV2aXNpb25dO1xuXHQgICAgcmV0dXJuIFtyZXZpc2lvbiwgdmVyc2lvbnNdO1xuXHQgIH0sXG5cblx0ICBhcHBlbmRUb0J1ZmZlcjogZnVuY3Rpb24gYXBwZW5kVG9CdWZmZXIoc291cmNlLCBsb2NhdGlvbiwgZXhwbGljaXQpIHtcblx0ICAgIC8vIEZvcmNlIGEgc291cmNlIGFzIHRoaXMgc2ltcGxpZmllcyB0aGUgbWVyZ2UgbG9naWMuXG5cdCAgICBpZiAoIV91dGlscy5pc0FycmF5KHNvdXJjZSkpIHtcblx0ICAgICAgc291cmNlID0gW3NvdXJjZV07XG5cdCAgICB9XG5cdCAgICBzb3VyY2UgPSB0aGlzLnNvdXJjZS53cmFwKHNvdXJjZSwgbG9jYXRpb24pO1xuXG5cdCAgICBpZiAodGhpcy5lbnZpcm9ubWVudC5pc1NpbXBsZSkge1xuXHQgICAgICByZXR1cm4gWydyZXR1cm4gJywgc291cmNlLCAnOyddO1xuXHQgICAgfSBlbHNlIGlmIChleHBsaWNpdCkge1xuXHQgICAgICAvLyBUaGlzIGlzIGEgY2FzZSB3aGVyZSB0aGUgYnVmZmVyIG9wZXJhdGlvbiBvY2N1cnMgYXMgYSBjaGlsZCBvZiBhbm90aGVyXG5cdCAgICAgIC8vIGNvbnN0cnVjdCwgZ2VuZXJhbGx5IGJyYWNlcy4gV2UgaGF2ZSB0byBleHBsaWNpdGx5IG91dHB1dCB0aGVzZSBidWZmZXJcblx0ICAgICAgLy8gb3BlcmF0aW9ucyB0byBlbnN1cmUgdGhhdCB0aGUgZW1pdHRlZCBjb2RlIGdvZXMgaW4gdGhlIGNvcnJlY3QgbG9jYXRpb24uXG5cdCAgICAgIHJldHVybiBbJ2J1ZmZlciArPSAnLCBzb3VyY2UsICc7J107XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzb3VyY2UuYXBwZW5kVG9CdWZmZXIgPSB0cnVlO1xuXHQgICAgICByZXR1cm4gc291cmNlO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBpbml0aWFsaXplQnVmZmVyOiBmdW5jdGlvbiBpbml0aWFsaXplQnVmZmVyKCkge1xuXHQgICAgcmV0dXJuIHRoaXMucXVvdGVkU3RyaW5nKCcnKTtcblx0ICB9LFxuXHQgIC8vIEVORCBQVUJMSUMgQVBJXG5cblx0ICBjb21waWxlOiBmdW5jdGlvbiBjb21waWxlKGVudmlyb25tZW50LCBvcHRpb25zLCBjb250ZXh0LCBhc09iamVjdCkge1xuXHQgICAgdGhpcy5lbnZpcm9ubWVudCA9IGVudmlyb25tZW50O1xuXHQgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0ICAgIHRoaXMuc3RyaW5nUGFyYW1zID0gdGhpcy5vcHRpb25zLnN0cmluZ1BhcmFtcztcblx0ICAgIHRoaXMudHJhY2tJZHMgPSB0aGlzLm9wdGlvbnMudHJhY2tJZHM7XG5cdCAgICB0aGlzLnByZWNvbXBpbGUgPSAhYXNPYmplY3Q7XG5cblx0ICAgIHRoaXMubmFtZSA9IHRoaXMuZW52aXJvbm1lbnQubmFtZTtcblx0ICAgIHRoaXMuaXNDaGlsZCA9ICEhY29udGV4dDtcblx0ICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQgfHwge1xuXHQgICAgICBkZWNvcmF0b3JzOiBbXSxcblx0ICAgICAgcHJvZ3JhbXM6IFtdLFxuXHQgICAgICBlbnZpcm9ubWVudHM6IFtdXG5cdCAgICB9O1xuXG5cdCAgICB0aGlzLnByZWFtYmxlKCk7XG5cblx0ICAgIHRoaXMuc3RhY2tTbG90ID0gMDtcblx0ICAgIHRoaXMuc3RhY2tWYXJzID0gW107XG5cdCAgICB0aGlzLmFsaWFzZXMgPSB7fTtcblx0ICAgIHRoaXMucmVnaXN0ZXJzID0geyBsaXN0OiBbXSB9O1xuXHQgICAgdGhpcy5oYXNoZXMgPSBbXTtcblx0ICAgIHRoaXMuY29tcGlsZVN0YWNrID0gW107XG5cdCAgICB0aGlzLmlubGluZVN0YWNrID0gW107XG5cdCAgICB0aGlzLmJsb2NrUGFyYW1zID0gW107XG5cblx0ICAgIHRoaXMuY29tcGlsZUNoaWxkcmVuKGVudmlyb25tZW50LCBvcHRpb25zKTtcblxuXHQgICAgdGhpcy51c2VEZXB0aHMgPSB0aGlzLnVzZURlcHRocyB8fCBlbnZpcm9ubWVudC51c2VEZXB0aHMgfHwgZW52aXJvbm1lbnQudXNlRGVjb3JhdG9ycyB8fCB0aGlzLm9wdGlvbnMuY29tcGF0O1xuXHQgICAgdGhpcy51c2VCbG9ja1BhcmFtcyA9IHRoaXMudXNlQmxvY2tQYXJhbXMgfHwgZW52aXJvbm1lbnQudXNlQmxvY2tQYXJhbXM7XG5cblx0ICAgIHZhciBvcGNvZGVzID0gZW52aXJvbm1lbnQub3Bjb2Rlcyxcblx0ICAgICAgICBvcGNvZGUgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgZmlyc3RMb2MgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgaSA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBsID0gdW5kZWZpbmVkO1xuXG5cdCAgICBmb3IgKGkgPSAwLCBsID0gb3Bjb2Rlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgb3Bjb2RlID0gb3Bjb2Rlc1tpXTtcblxuXHQgICAgICB0aGlzLnNvdXJjZS5jdXJyZW50TG9jYXRpb24gPSBvcGNvZGUubG9jO1xuXHQgICAgICBmaXJzdExvYyA9IGZpcnN0TG9jIHx8IG9wY29kZS5sb2M7XG5cdCAgICAgIHRoaXNbb3Bjb2RlLm9wY29kZV0uYXBwbHkodGhpcywgb3Bjb2RlLmFyZ3MpO1xuXHQgICAgfVxuXG5cdCAgICAvLyBGbHVzaCBhbnkgdHJhaWxpbmcgY29udGVudCB0aGF0IG1pZ2h0IGJlIHBlbmRpbmcuXG5cdCAgICB0aGlzLnNvdXJjZS5jdXJyZW50TG9jYXRpb24gPSBmaXJzdExvYztcblx0ICAgIHRoaXMucHVzaFNvdXJjZSgnJyk7XG5cblx0ICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgICBpZiAodGhpcy5zdGFja1Nsb3QgfHwgdGhpcy5pbmxpbmVTdGFjay5sZW5ndGggfHwgdGhpcy5jb21waWxlU3RhY2subGVuZ3RoKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdDb21waWxlIGNvbXBsZXRlZCB3aXRoIGNvbnRlbnQgbGVmdCBvbiBzdGFjaycpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoIXRoaXMuZGVjb3JhdG9ycy5pc0VtcHR5KCkpIHtcblx0ICAgICAgdGhpcy51c2VEZWNvcmF0b3JzID0gdHJ1ZTtcblxuXHQgICAgICB0aGlzLmRlY29yYXRvcnMucHJlcGVuZCgndmFyIGRlY29yYXRvcnMgPSBjb250YWluZXIuZGVjb3JhdG9ycztcXG4nKTtcblx0ICAgICAgdGhpcy5kZWNvcmF0b3JzLnB1c2goJ3JldHVybiBmbjsnKTtcblxuXHQgICAgICBpZiAoYXNPYmplY3QpIHtcblx0ICAgICAgICB0aGlzLmRlY29yYXRvcnMgPSBGdW5jdGlvbi5hcHBseSh0aGlzLCBbJ2ZuJywgJ3Byb3BzJywgJ2NvbnRhaW5lcicsICdkZXB0aDAnLCAnZGF0YScsICdibG9ja1BhcmFtcycsICdkZXB0aHMnLCB0aGlzLmRlY29yYXRvcnMubWVyZ2UoKV0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHRoaXMuZGVjb3JhdG9ycy5wcmVwZW5kKCdmdW5jdGlvbihmbiwgcHJvcHMsIGNvbnRhaW5lciwgZGVwdGgwLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XFxuJyk7XG5cdCAgICAgICAgdGhpcy5kZWNvcmF0b3JzLnB1c2goJ31cXG4nKTtcblx0ICAgICAgICB0aGlzLmRlY29yYXRvcnMgPSB0aGlzLmRlY29yYXRvcnMubWVyZ2UoKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5kZWNvcmF0b3JzID0gdW5kZWZpbmVkO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgZm4gPSB0aGlzLmNyZWF0ZUZ1bmN0aW9uQ29udGV4dChhc09iamVjdCk7XG5cdCAgICBpZiAoIXRoaXMuaXNDaGlsZCkge1xuXHQgICAgICB2YXIgcmV0ID0ge1xuXHQgICAgICAgIGNvbXBpbGVyOiB0aGlzLmNvbXBpbGVySW5mbygpLFxuXHQgICAgICAgIG1haW46IGZuXG5cdCAgICAgIH07XG5cblx0ICAgICAgaWYgKHRoaXMuZGVjb3JhdG9ycykge1xuXHQgICAgICAgIHJldC5tYWluX2QgPSB0aGlzLmRlY29yYXRvcnM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXG5cdCAgICAgICAgcmV0LnVzZURlY29yYXRvcnMgPSB0cnVlO1xuXHQgICAgICB9XG5cblx0ICAgICAgdmFyIF9jb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuXHQgICAgICB2YXIgcHJvZ3JhbXMgPSBfY29udGV4dC5wcm9ncmFtcztcblx0ICAgICAgdmFyIGRlY29yYXRvcnMgPSBfY29udGV4dC5kZWNvcmF0b3JzO1xuXG5cdCAgICAgIGZvciAoaSA9IDAsIGwgPSBwcm9ncmFtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgICBpZiAocHJvZ3JhbXNbaV0pIHtcblx0ICAgICAgICAgIHJldFtpXSA9IHByb2dyYW1zW2ldO1xuXHQgICAgICAgICAgaWYgKGRlY29yYXRvcnNbaV0pIHtcblx0ICAgICAgICAgICAgcmV0W2kgKyAnX2QnXSA9IGRlY29yYXRvcnNbaV07XG5cdCAgICAgICAgICAgIHJldC51c2VEZWNvcmF0b3JzID0gdHJ1ZTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAodGhpcy5lbnZpcm9ubWVudC51c2VQYXJ0aWFsKSB7XG5cdCAgICAgICAgcmV0LnVzZVBhcnRpYWwgPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGF0YSkge1xuXHQgICAgICAgIHJldC51c2VEYXRhID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAodGhpcy51c2VEZXB0aHMpIHtcblx0ICAgICAgICByZXQudXNlRGVwdGhzID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAodGhpcy51c2VCbG9ja1BhcmFtcykge1xuXHQgICAgICAgIHJldC51c2VCbG9ja1BhcmFtcyA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb21wYXQpIHtcblx0ICAgICAgICByZXQuY29tcGF0ID0gdHJ1ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICghYXNPYmplY3QpIHtcblx0ICAgICAgICByZXQuY29tcGlsZXIgPSBKU09OLnN0cmluZ2lmeShyZXQuY29tcGlsZXIpO1xuXG5cdCAgICAgICAgdGhpcy5zb3VyY2UuY3VycmVudExvY2F0aW9uID0geyBzdGFydDogeyBsaW5lOiAxLCBjb2x1bW46IDAgfSB9O1xuXHQgICAgICAgIHJldCA9IHRoaXMub2JqZWN0TGl0ZXJhbChyZXQpO1xuXG5cdCAgICAgICAgaWYgKG9wdGlvbnMuc3JjTmFtZSkge1xuXHQgICAgICAgICAgcmV0ID0gcmV0LnRvU3RyaW5nV2l0aFNvdXJjZU1hcCh7IGZpbGU6IG9wdGlvbnMuZGVzdE5hbWUgfSk7XG5cdCAgICAgICAgICByZXQubWFwID0gcmV0Lm1hcCAmJiByZXQubWFwLnRvU3RyaW5nKCk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHJldCA9IHJldC50b1N0cmluZygpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXQuY29tcGlsZXJPcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIHJldDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiBmbjtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgcHJlYW1ibGU6IGZ1bmN0aW9uIHByZWFtYmxlKCkge1xuXHQgICAgLy8gdHJhY2sgdGhlIGxhc3QgY29udGV4dCBwdXNoZWQgaW50byBwbGFjZSB0byBhbGxvdyBza2lwcGluZyB0aGVcblx0ICAgIC8vIGdldENvbnRleHQgb3Bjb2RlIHdoZW4gaXQgd291bGQgYmUgYSBub29wXG5cdCAgICB0aGlzLmxhc3RDb250ZXh0ID0gMDtcblx0ICAgIHRoaXMuc291cmNlID0gbmV3IF9jb2RlR2VuMlsnZGVmYXVsdCddKHRoaXMub3B0aW9ucy5zcmNOYW1lKTtcblx0ICAgIHRoaXMuZGVjb3JhdG9ycyA9IG5ldyBfY29kZUdlbjJbJ2RlZmF1bHQnXSh0aGlzLm9wdGlvbnMuc3JjTmFtZSk7XG5cdCAgfSxcblxuXHQgIGNyZWF0ZUZ1bmN0aW9uQ29udGV4dDogZnVuY3Rpb24gY3JlYXRlRnVuY3Rpb25Db250ZXh0KGFzT2JqZWN0KSB7XG5cdCAgICB2YXIgdmFyRGVjbGFyYXRpb25zID0gJyc7XG5cblx0ICAgIHZhciBsb2NhbHMgPSB0aGlzLnN0YWNrVmFycy5jb25jYXQodGhpcy5yZWdpc3RlcnMubGlzdCk7XG5cdCAgICBpZiAobG9jYWxzLmxlbmd0aCA+IDApIHtcblx0ICAgICAgdmFyRGVjbGFyYXRpb25zICs9ICcsICcgKyBsb2NhbHMuam9pbignLCAnKTtcblx0ICAgIH1cblxuXHQgICAgLy8gR2VuZXJhdGUgbWluaW1pemVyIGFsaWFzIG1hcHBpbmdzXG5cdCAgICAvL1xuXHQgICAgLy8gV2hlbiB1c2luZyB0cnVlIFNvdXJjZU5vZGVzLCB0aGlzIHdpbGwgdXBkYXRlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBnaXZlbiBhbGlhc1xuXHQgICAgLy8gYXMgdGhlIHNvdXJjZSBub2RlcyBhcmUgcmV1c2VkIGluIHNpdHUuIEZvciB0aGUgbm9uLXNvdXJjZSBub2RlIGNvbXBpbGF0aW9uIG1vZGUsXG5cdCAgICAvLyBhbGlhc2VzIHdpbGwgbm90IGJlIHVzZWQsIGJ1dCB0aGlzIGNhc2UgaXMgYWxyZWFkeSBiZWluZyBydW4gb24gdGhlIGNsaWVudCBhbmRcblx0ICAgIC8vIHdlIGFyZW4ndCBjb25jZXJuIGFib3V0IG1pbmltaXppbmcgdGhlIHRlbXBsYXRlIHNpemUuXG5cdCAgICB2YXIgYWxpYXNDb3VudCA9IDA7XG5cdCAgICBmb3IgKHZhciBhbGlhcyBpbiB0aGlzLmFsaWFzZXMpIHtcblx0ICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBndWFyZC1mb3ItaW5cblx0ICAgICAgdmFyIG5vZGUgPSB0aGlzLmFsaWFzZXNbYWxpYXNdO1xuXG5cdCAgICAgIGlmICh0aGlzLmFsaWFzZXMuaGFzT3duUHJvcGVydHkoYWxpYXMpICYmIG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5yZWZlcmVuY2VDb3VudCA+IDEpIHtcblx0ICAgICAgICB2YXJEZWNsYXJhdGlvbnMgKz0gJywgYWxpYXMnICsgKythbGlhc0NvdW50ICsgJz0nICsgYWxpYXM7XG5cdCAgICAgICAgbm9kZS5jaGlsZHJlblswXSA9ICdhbGlhcycgKyBhbGlhc0NvdW50O1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHZhciBwYXJhbXMgPSBbJ2NvbnRhaW5lcicsICdkZXB0aDAnLCAnaGVscGVycycsICdwYXJ0aWFscycsICdkYXRhJ107XG5cblx0ICAgIGlmICh0aGlzLnVzZUJsb2NrUGFyYW1zIHx8IHRoaXMudXNlRGVwdGhzKSB7XG5cdCAgICAgIHBhcmFtcy5wdXNoKCdibG9ja1BhcmFtcycpO1xuXHQgICAgfVxuXHQgICAgaWYgKHRoaXMudXNlRGVwdGhzKSB7XG5cdCAgICAgIHBhcmFtcy5wdXNoKCdkZXB0aHMnKTtcblx0ICAgIH1cblxuXHQgICAgLy8gUGVyZm9ybSBhIHNlY29uZCBwYXNzIG92ZXIgdGhlIG91dHB1dCB0byBtZXJnZSBjb250ZW50IHdoZW4gcG9zc2libGVcblx0ICAgIHZhciBzb3VyY2UgPSB0aGlzLm1lcmdlU291cmNlKHZhckRlY2xhcmF0aW9ucyk7XG5cblx0ICAgIGlmIChhc09iamVjdCkge1xuXHQgICAgICBwYXJhbXMucHVzaChzb3VyY2UpO1xuXG5cdCAgICAgIHJldHVybiBGdW5jdGlvbi5hcHBseSh0aGlzLCBwYXJhbXMpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuc291cmNlLndyYXAoWydmdW5jdGlvbignLCBwYXJhbXMuam9pbignLCcpLCAnKSB7XFxuICAnLCBzb3VyY2UsICd9J10pO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgbWVyZ2VTb3VyY2U6IGZ1bmN0aW9uIG1lcmdlU291cmNlKHZhckRlY2xhcmF0aW9ucykge1xuXHQgICAgdmFyIGlzU2ltcGxlID0gdGhpcy5lbnZpcm9ubWVudC5pc1NpbXBsZSxcblx0ICAgICAgICBhcHBlbmRPbmx5ID0gIXRoaXMuZm9yY2VCdWZmZXIsXG5cdCAgICAgICAgYXBwZW5kRmlyc3QgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgc291cmNlU2VlbiA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBidWZmZXJTdGFydCA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBidWZmZXJFbmQgPSB1bmRlZmluZWQ7XG5cdCAgICB0aGlzLnNvdXJjZS5lYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG5cdCAgICAgIGlmIChsaW5lLmFwcGVuZFRvQnVmZmVyKSB7XG5cdCAgICAgICAgaWYgKGJ1ZmZlclN0YXJ0KSB7XG5cdCAgICAgICAgICBsaW5lLnByZXBlbmQoJyAgKyAnKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgYnVmZmVyU3RhcnQgPSBsaW5lO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBidWZmZXJFbmQgPSBsaW5lO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmIChidWZmZXJTdGFydCkge1xuXHQgICAgICAgICAgaWYgKCFzb3VyY2VTZWVuKSB7XG5cdCAgICAgICAgICAgIGFwcGVuZEZpcnN0ID0gdHJ1ZTtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIGJ1ZmZlclN0YXJ0LnByZXBlbmQoJ2J1ZmZlciArPSAnKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIGJ1ZmZlckVuZC5hZGQoJzsnKTtcblx0ICAgICAgICAgIGJ1ZmZlclN0YXJ0ID0gYnVmZmVyRW5kID0gdW5kZWZpbmVkO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHNvdXJjZVNlZW4gPSB0cnVlO1xuXHQgICAgICAgIGlmICghaXNTaW1wbGUpIHtcblx0ICAgICAgICAgIGFwcGVuZE9ubHkgPSBmYWxzZTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXG5cdCAgICBpZiAoYXBwZW5kT25seSkge1xuXHQgICAgICBpZiAoYnVmZmVyU3RhcnQpIHtcblx0ICAgICAgICBidWZmZXJTdGFydC5wcmVwZW5kKCdyZXR1cm4gJyk7XG5cdCAgICAgICAgYnVmZmVyRW5kLmFkZCgnOycpO1xuXHQgICAgICB9IGVsc2UgaWYgKCFzb3VyY2VTZWVuKSB7XG5cdCAgICAgICAgdGhpcy5zb3VyY2UucHVzaCgncmV0dXJuIFwiXCI7Jyk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHZhckRlY2xhcmF0aW9ucyArPSAnLCBidWZmZXIgPSAnICsgKGFwcGVuZEZpcnN0ID8gJycgOiB0aGlzLmluaXRpYWxpemVCdWZmZXIoKSk7XG5cblx0ICAgICAgaWYgKGJ1ZmZlclN0YXJ0KSB7XG5cdCAgICAgICAgYnVmZmVyU3RhcnQucHJlcGVuZCgncmV0dXJuIGJ1ZmZlciArICcpO1xuXHQgICAgICAgIGJ1ZmZlckVuZC5hZGQoJzsnKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB0aGlzLnNvdXJjZS5wdXNoKCdyZXR1cm4gYnVmZmVyOycpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGlmICh2YXJEZWNsYXJhdGlvbnMpIHtcblx0ICAgICAgdGhpcy5zb3VyY2UucHJlcGVuZCgndmFyICcgKyB2YXJEZWNsYXJhdGlvbnMuc3Vic3RyaW5nKDIpICsgKGFwcGVuZEZpcnN0ID8gJycgOiAnO1xcbicpKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHRoaXMuc291cmNlLm1lcmdlKCk7XG5cdCAgfSxcblxuXHQgIC8vIFtibG9ja1ZhbHVlXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogaGFzaCwgaW52ZXJzZSwgcHJvZ3JhbSwgdmFsdWVcblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHJldHVybiB2YWx1ZSBvZiBibG9ja0hlbHBlck1pc3Npbmdcblx0ICAvL1xuXHQgIC8vIFRoZSBwdXJwb3NlIG9mIHRoaXMgb3Bjb2RlIGlzIHRvIHRha2UgYSBibG9jayBvZiB0aGUgZm9ybVxuXHQgIC8vIGB7eyN0aGlzLmZvb319Li4ue3svdGhpcy5mb299fWAsIHJlc29sdmUgdGhlIHZhbHVlIG9mIGBmb29gLCBhbmRcblx0ICAvLyByZXBsYWNlIGl0IG9uIHRoZSBzdGFjayB3aXRoIHRoZSByZXN1bHQgb2YgcHJvcGVybHlcblx0ICAvLyBpbnZva2luZyBibG9ja0hlbHBlck1pc3NpbmcuXG5cdCAgYmxvY2tWYWx1ZTogZnVuY3Rpb24gYmxvY2tWYWx1ZShuYW1lKSB7XG5cdCAgICB2YXIgYmxvY2tIZWxwZXJNaXNzaW5nID0gdGhpcy5hbGlhc2FibGUoJ2hlbHBlcnMuYmxvY2tIZWxwZXJNaXNzaW5nJyksXG5cdCAgICAgICAgcGFyYW1zID0gW3RoaXMuY29udGV4dE5hbWUoMCldO1xuXHQgICAgdGhpcy5zZXR1cEhlbHBlckFyZ3MobmFtZSwgMCwgcGFyYW1zKTtcblxuXHQgICAgdmFyIGJsb2NrTmFtZSA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgIHBhcmFtcy5zcGxpY2UoMSwgMCwgYmxvY2tOYW1lKTtcblxuXHQgICAgdGhpcy5wdXNoKHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbChibG9ja0hlbHBlck1pc3NpbmcsICdjYWxsJywgcGFyYW1zKSk7XG5cdCAgfSxcblxuXHQgIC8vIFthbWJpZ3VvdXNCbG9ja1ZhbHVlXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogaGFzaCwgaW52ZXJzZSwgcHJvZ3JhbSwgdmFsdWVcblx0ICAvLyBDb21waWxlciB2YWx1ZSwgYmVmb3JlOiBsYXN0SGVscGVyPXZhbHVlIG9mIGxhc3QgZm91bmQgaGVscGVyLCBpZiBhbnlcblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXIsIGlmIG5vIGxhc3RIZWxwZXI6IHNhbWUgYXMgW2Jsb2NrVmFsdWVdXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyLCBpZiBsYXN0SGVscGVyOiB2YWx1ZVxuXHQgIGFtYmlndW91c0Jsb2NrVmFsdWU6IGZ1bmN0aW9uIGFtYmlndW91c0Jsb2NrVmFsdWUoKSB7XG5cdCAgICAvLyBXZSdyZSBiZWluZyBhIGJpdCBjaGVla3kgYW5kIHJldXNpbmcgdGhlIG9wdGlvbnMgdmFsdWUgZnJvbSB0aGUgcHJpb3IgZXhlY1xuXHQgICAgdmFyIGJsb2NrSGVscGVyTWlzc2luZyA9IHRoaXMuYWxpYXNhYmxlKCdoZWxwZXJzLmJsb2NrSGVscGVyTWlzc2luZycpLFxuXHQgICAgICAgIHBhcmFtcyA9IFt0aGlzLmNvbnRleHROYW1lKDApXTtcblx0ICAgIHRoaXMuc2V0dXBIZWxwZXJBcmdzKCcnLCAwLCBwYXJhbXMsIHRydWUpO1xuXG5cdCAgICB0aGlzLmZsdXNoSW5saW5lKCk7XG5cblx0ICAgIHZhciBjdXJyZW50ID0gdGhpcy50b3BTdGFjaygpO1xuXHQgICAgcGFyYW1zLnNwbGljZSgxLCAwLCBjdXJyZW50KTtcblxuXHQgICAgdGhpcy5wdXNoU291cmNlKFsnaWYgKCEnLCB0aGlzLmxhc3RIZWxwZXIsICcpIHsgJywgY3VycmVudCwgJyA9ICcsIHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbChibG9ja0hlbHBlck1pc3NpbmcsICdjYWxsJywgcGFyYW1zKSwgJ30nXSk7XG5cdCAgfSxcblxuXHQgIC8vIFthcHBlbmRDb250ZW50XVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi5cblx0ICAvL1xuXHQgIC8vIEFwcGVuZHMgdGhlIHN0cmluZyB2YWx1ZSBvZiBgY29udGVudGAgdG8gdGhlIGN1cnJlbnQgYnVmZmVyXG5cdCAgYXBwZW5kQ29udGVudDogZnVuY3Rpb24gYXBwZW5kQ29udGVudChjb250ZW50KSB7XG5cdCAgICBpZiAodGhpcy5wZW5kaW5nQ29udGVudCkge1xuXHQgICAgICBjb250ZW50ID0gdGhpcy5wZW5kaW5nQ29udGVudCArIGNvbnRlbnQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLnBlbmRpbmdMb2NhdGlvbiA9IHRoaXMuc291cmNlLmN1cnJlbnRMb2NhdGlvbjtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5wZW5kaW5nQ29udGVudCA9IGNvbnRlbnQ7XG5cdCAgfSxcblxuXHQgIC8vIFthcHBlbmRdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiB2YWx1ZSwgLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi5cblx0ICAvL1xuXHQgIC8vIENvZXJjZXMgYHZhbHVlYCB0byBhIFN0cmluZyBhbmQgYXBwZW5kcyBpdCB0byB0aGUgY3VycmVudCBidWZmZXIuXG5cdCAgLy9cblx0ICAvLyBJZiBgdmFsdWVgIGlzIHRydXRoeSwgb3IgMCwgaXQgaXMgY29lcmNlZCBpbnRvIGEgc3RyaW5nIGFuZCBhcHBlbmRlZFxuXHQgIC8vIE90aGVyd2lzZSwgdGhlIGVtcHR5IHN0cmluZyBpcyBhcHBlbmRlZFxuXHQgIGFwcGVuZDogZnVuY3Rpb24gYXBwZW5kKCkge1xuXHQgICAgaWYgKHRoaXMuaXNJbmxpbmUoKSkge1xuXHQgICAgICB0aGlzLnJlcGxhY2VTdGFjayhmdW5jdGlvbiAoY3VycmVudCkge1xuXHQgICAgICAgIHJldHVybiBbJyAhPSBudWxsID8gJywgY3VycmVudCwgJyA6IFwiXCInXTtcblx0ICAgICAgfSk7XG5cblx0ICAgICAgdGhpcy5wdXNoU291cmNlKHRoaXMuYXBwZW5kVG9CdWZmZXIodGhpcy5wb3BTdGFjaygpKSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB2YXIgbG9jYWwgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgIHRoaXMucHVzaFNvdXJjZShbJ2lmICgnLCBsb2NhbCwgJyAhPSBudWxsKSB7ICcsIHRoaXMuYXBwZW5kVG9CdWZmZXIobG9jYWwsIHVuZGVmaW5lZCwgdHJ1ZSksICcgfSddKTtcblx0ICAgICAgaWYgKHRoaXMuZW52aXJvbm1lbnQuaXNTaW1wbGUpIHtcblx0ICAgICAgICB0aGlzLnB1c2hTb3VyY2UoWydlbHNlIHsgJywgdGhpcy5hcHBlbmRUb0J1ZmZlcihcIicnXCIsIHVuZGVmaW5lZCwgdHJ1ZSksICcgfSddKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0sXG5cblx0ICAvLyBbYXBwZW5kRXNjYXBlZF1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IHZhbHVlLCAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IC4uLlxuXHQgIC8vXG5cdCAgLy8gRXNjYXBlIGB2YWx1ZWAgYW5kIGFwcGVuZCBpdCB0byB0aGUgYnVmZmVyXG5cdCAgYXBwZW5kRXNjYXBlZDogZnVuY3Rpb24gYXBwZW5kRXNjYXBlZCgpIHtcblx0ICAgIHRoaXMucHVzaFNvdXJjZSh0aGlzLmFwcGVuZFRvQnVmZmVyKFt0aGlzLmFsaWFzYWJsZSgnY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24nKSwgJygnLCB0aGlzLnBvcFN0YWNrKCksICcpJ10pKTtcblx0ICB9LFxuXG5cdCAgLy8gW2dldENvbnRleHRdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IC4uLlxuXHQgIC8vIENvbXBpbGVyIHZhbHVlLCBhZnRlcjogbGFzdENvbnRleHQ9ZGVwdGhcblx0ICAvL1xuXHQgIC8vIFNldCB0aGUgdmFsdWUgb2YgdGhlIGBsYXN0Q29udGV4dGAgY29tcGlsZXIgdmFsdWUgdG8gdGhlIGRlcHRoXG5cdCAgZ2V0Q29udGV4dDogZnVuY3Rpb24gZ2V0Q29udGV4dChkZXB0aCkge1xuXHQgICAgdGhpcy5sYXN0Q29udGV4dCA9IGRlcHRoO1xuXHQgIH0sXG5cblx0ICAvLyBbcHVzaENvbnRleHRdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IGN1cnJlbnRDb250ZXh0LCAuLi5cblx0ICAvL1xuXHQgIC8vIFB1c2hlcyB0aGUgdmFsdWUgb2YgdGhlIGN1cnJlbnQgY29udGV4dCBvbnRvIHRoZSBzdGFjay5cblx0ICBwdXNoQ29udGV4dDogZnVuY3Rpb24gcHVzaENvbnRleHQoKSB7XG5cdCAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwodGhpcy5jb250ZXh0TmFtZSh0aGlzLmxhc3RDb250ZXh0KSk7XG5cdCAgfSxcblxuXHQgIC8vIFtsb29rdXBPbkNvbnRleHRdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IGN1cnJlbnRDb250ZXh0W25hbWVdLCAuLi5cblx0ICAvL1xuXHQgIC8vIExvb2tzIHVwIHRoZSB2YWx1ZSBvZiBgbmFtZWAgb24gdGhlIGN1cnJlbnQgY29udGV4dCBhbmQgcHVzaGVzXG5cdCAgLy8gaXQgb250byB0aGUgc3RhY2suXG5cdCAgbG9va3VwT25Db250ZXh0OiBmdW5jdGlvbiBsb29rdXBPbkNvbnRleHQocGFydHMsIGZhbHN5LCBzdHJpY3QsIHNjb3BlZCkge1xuXHQgICAgdmFyIGkgPSAwO1xuXG5cdCAgICBpZiAoIXNjb3BlZCAmJiB0aGlzLm9wdGlvbnMuY29tcGF0ICYmICF0aGlzLmxhc3RDb250ZXh0KSB7XG5cdCAgICAgIC8vIFRoZSBkZXB0aGVkIHF1ZXJ5IGlzIGV4cGVjdGVkIHRvIGhhbmRsZSB0aGUgdW5kZWZpbmVkIGxvZ2ljIGZvciB0aGUgcm9vdCBsZXZlbCB0aGF0XG5cdCAgICAgIC8vIGlzIGltcGxlbWVudGVkIGJlbG93LCBzbyB3ZSBldmFsdWF0ZSB0aGF0IGRpcmVjdGx5IGluIGNvbXBhdCBtb2RlXG5cdCAgICAgIHRoaXMucHVzaCh0aGlzLmRlcHRoZWRMb29rdXAocGFydHNbaSsrXSkpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5wdXNoQ29udGV4dCgpO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLnJlc29sdmVQYXRoKCdjb250ZXh0JywgcGFydHMsIGksIGZhbHN5LCBzdHJpY3QpO1xuXHQgIH0sXG5cblx0ICAvLyBbbG9va3VwQmxvY2tQYXJhbV1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogYmxvY2tQYXJhbVtuYW1lXSwgLi4uXG5cdCAgLy9cblx0ICAvLyBMb29rcyB1cCB0aGUgdmFsdWUgb2YgYHBhcnRzYCBvbiB0aGUgZ2l2ZW4gYmxvY2sgcGFyYW0gYW5kIHB1c2hlc1xuXHQgIC8vIGl0IG9udG8gdGhlIHN0YWNrLlxuXHQgIGxvb2t1cEJsb2NrUGFyYW06IGZ1bmN0aW9uIGxvb2t1cEJsb2NrUGFyYW0oYmxvY2tQYXJhbUlkLCBwYXJ0cykge1xuXHQgICAgdGhpcy51c2VCbG9ja1BhcmFtcyA9IHRydWU7XG5cblx0ICAgIHRoaXMucHVzaChbJ2Jsb2NrUGFyYW1zWycsIGJsb2NrUGFyYW1JZFswXSwgJ11bJywgYmxvY2tQYXJhbUlkWzFdLCAnXSddKTtcblx0ICAgIHRoaXMucmVzb2x2ZVBhdGgoJ2NvbnRleHQnLCBwYXJ0cywgMSk7XG5cdCAgfSxcblxuXHQgIC8vIFtsb29rdXBEYXRhXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiBkYXRhLCAuLi5cblx0ICAvL1xuXHQgIC8vIFB1c2ggdGhlIGRhdGEgbG9va3VwIG9wZXJhdG9yXG5cdCAgbG9va3VwRGF0YTogZnVuY3Rpb24gbG9va3VwRGF0YShkZXB0aCwgcGFydHMsIHN0cmljdCkge1xuXHQgICAgaWYgKCFkZXB0aCkge1xuXHQgICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoJ2RhdGEnKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCgnY29udGFpbmVyLmRhdGEoZGF0YSwgJyArIGRlcHRoICsgJyknKTtcblx0ICAgIH1cblxuXHQgICAgdGhpcy5yZXNvbHZlUGF0aCgnZGF0YScsIHBhcnRzLCAwLCB0cnVlLCBzdHJpY3QpO1xuXHQgIH0sXG5cblx0ICByZXNvbHZlUGF0aDogZnVuY3Rpb24gcmVzb2x2ZVBhdGgodHlwZSwgcGFydHMsIGksIGZhbHN5LCBzdHJpY3QpIHtcblx0ICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG5cblx0ICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cblx0ICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaWN0IHx8IHRoaXMub3B0aW9ucy5hc3N1bWVPYmplY3RzKSB7XG5cdCAgICAgIHRoaXMucHVzaChzdHJpY3RMb29rdXAodGhpcy5vcHRpb25zLnN0cmljdCAmJiBzdHJpY3QsIHRoaXMsIHBhcnRzLCB0eXBlKSk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgdmFyIGxlbiA9IHBhcnRzLmxlbmd0aDtcblx0ICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tbG9vcC1mdW5jICovXG5cdCAgICAgIHRoaXMucmVwbGFjZVN0YWNrKGZ1bmN0aW9uIChjdXJyZW50KSB7XG5cdCAgICAgICAgdmFyIGxvb2t1cCA9IF90aGlzLm5hbWVMb29rdXAoY3VycmVudCwgcGFydHNbaV0sIHR5cGUpO1xuXHQgICAgICAgIC8vIFdlIHdhbnQgdG8gZW5zdXJlIHRoYXQgemVybyBhbmQgZmFsc2UgYXJlIGhhbmRsZWQgcHJvcGVybHkgaWYgdGhlIGNvbnRleHQgKGZhbHN5IGZsYWcpXG5cdCAgICAgICAgLy8gbmVlZHMgdG8gaGF2ZSB0aGUgc3BlY2lhbCBoYW5kbGluZyBmb3IgdGhlc2UgdmFsdWVzLlxuXHQgICAgICAgIGlmICghZmFsc3kpIHtcblx0ICAgICAgICAgIHJldHVybiBbJyAhPSBudWxsID8gJywgbG9va3VwLCAnIDogJywgY3VycmVudF07XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIC8vIE90aGVyd2lzZSB3ZSBjYW4gdXNlIGdlbmVyaWMgZmFsc3kgaGFuZGxpbmdcblx0ICAgICAgICAgIHJldHVybiBbJyAmJiAnLCBsb29rdXBdO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tbG9vcC1mdW5jICovXG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIC8vIFtyZXNvbHZlUG9zc2libGVMYW1iZGFdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiB2YWx1ZSwgLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXNvbHZlZCB2YWx1ZSwgLi4uXG5cdCAgLy9cblx0ICAvLyBJZiB0aGUgYHZhbHVlYCBpcyBhIGxhbWJkYSwgcmVwbGFjZSBpdCBvbiB0aGUgc3RhY2sgYnlcblx0ICAvLyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBsYW1iZGFcblx0ICByZXNvbHZlUG9zc2libGVMYW1iZGE6IGZ1bmN0aW9uIHJlc29sdmVQb3NzaWJsZUxhbWJkYSgpIHtcblx0ICAgIHRoaXMucHVzaChbdGhpcy5hbGlhc2FibGUoJ2NvbnRhaW5lci5sYW1iZGEnKSwgJygnLCB0aGlzLnBvcFN0YWNrKCksICcsICcsIHRoaXMuY29udGV4dE5hbWUoMCksICcpJ10pO1xuXHQgIH0sXG5cblx0ICAvLyBbcHVzaFN0cmluZ1BhcmFtXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiBzdHJpbmcsIGN1cnJlbnRDb250ZXh0LCAuLi5cblx0ICAvL1xuXHQgIC8vIFRoaXMgb3Bjb2RlIGlzIGRlc2lnbmVkIGZvciB1c2UgaW4gc3RyaW5nIG1vZGUsIHdoaWNoXG5cdCAgLy8gcHJvdmlkZXMgdGhlIHN0cmluZyB2YWx1ZSBvZiBhIHBhcmFtZXRlciBhbG9uZyB3aXRoIGl0c1xuXHQgIC8vIGRlcHRoIHJhdGhlciB0aGFuIHJlc29sdmluZyBpdCBpbW1lZGlhdGVseS5cblx0ICBwdXNoU3RyaW5nUGFyYW06IGZ1bmN0aW9uIHB1c2hTdHJpbmdQYXJhbShzdHJpbmcsIHR5cGUpIHtcblx0ICAgIHRoaXMucHVzaENvbnRleHQoKTtcblx0ICAgIHRoaXMucHVzaFN0cmluZyh0eXBlKTtcblxuXHQgICAgLy8gSWYgaXQncyBhIHN1YmV4cHJlc3Npb24sIHRoZSBzdHJpbmcgcmVzdWx0XG5cdCAgICAvLyB3aWxsIGJlIHB1c2hlZCBhZnRlciB0aGlzIG9wY29kZS5cblx0ICAgIGlmICh0eXBlICE9PSAnU3ViRXhwcmVzc2lvbicpIHtcblx0ICAgICAgaWYgKHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgICAgdGhpcy5wdXNoU3RyaW5nKHN0cmluZyk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKHN0cmluZyk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgZW1wdHlIYXNoOiBmdW5jdGlvbiBlbXB0eUhhc2gob21pdEVtcHR5KSB7XG5cdCAgICBpZiAodGhpcy50cmFja0lkcykge1xuXHQgICAgICB0aGlzLnB1c2goJ3t9Jyk7IC8vIGhhc2hJZHNcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuXHQgICAgICB0aGlzLnB1c2goJ3t9Jyk7IC8vIGhhc2hDb250ZXh0c1xuXHQgICAgICB0aGlzLnB1c2goJ3t9Jyk7IC8vIGhhc2hUeXBlc1xuXHQgICAgfVxuXHQgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKG9taXRFbXB0eSA/ICd1bmRlZmluZWQnIDogJ3t9Jyk7XG5cdCAgfSxcblx0ICBwdXNoSGFzaDogZnVuY3Rpb24gcHVzaEhhc2goKSB7XG5cdCAgICBpZiAodGhpcy5oYXNoKSB7XG5cdCAgICAgIHRoaXMuaGFzaGVzLnB1c2godGhpcy5oYXNoKTtcblx0ICAgIH1cblx0ICAgIHRoaXMuaGFzaCA9IHsgdmFsdWVzOiBbXSwgdHlwZXM6IFtdLCBjb250ZXh0czogW10sIGlkczogW10gfTtcblx0ICB9LFxuXHQgIHBvcEhhc2g6IGZ1bmN0aW9uIHBvcEhhc2goKSB7XG5cdCAgICB2YXIgaGFzaCA9IHRoaXMuaGFzaDtcblx0ICAgIHRoaXMuaGFzaCA9IHRoaXMuaGFzaGVzLnBvcCgpO1xuXG5cdCAgICBpZiAodGhpcy50cmFja0lkcykge1xuXHQgICAgICB0aGlzLnB1c2godGhpcy5vYmplY3RMaXRlcmFsKGhhc2guaWRzKSk7XG5cdCAgICB9XG5cdCAgICBpZiAodGhpcy5zdHJpbmdQYXJhbXMpIHtcblx0ICAgICAgdGhpcy5wdXNoKHRoaXMub2JqZWN0TGl0ZXJhbChoYXNoLmNvbnRleHRzKSk7XG5cdCAgICAgIHRoaXMucHVzaCh0aGlzLm9iamVjdExpdGVyYWwoaGFzaC50eXBlcykpO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLnB1c2godGhpcy5vYmplY3RMaXRlcmFsKGhhc2gudmFsdWVzKSk7XG5cdCAgfSxcblxuXHQgIC8vIFtwdXNoU3RyaW5nXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiBxdW90ZWRTdHJpbmcoc3RyaW5nKSwgLi4uXG5cdCAgLy9cblx0ICAvLyBQdXNoIGEgcXVvdGVkIHZlcnNpb24gb2YgYHN0cmluZ2Agb250byB0aGUgc3RhY2tcblx0ICBwdXNoU3RyaW5nOiBmdW5jdGlvbiBwdXNoU3RyaW5nKHN0cmluZykge1xuXHQgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKHRoaXMucXVvdGVkU3RyaW5nKHN0cmluZykpO1xuXHQgIH0sXG5cblx0ICAvLyBbcHVzaExpdGVyYWxdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHZhbHVlLCAuLi5cblx0ICAvL1xuXHQgIC8vIFB1c2hlcyBhIHZhbHVlIG9udG8gdGhlIHN0YWNrLiBUaGlzIG9wZXJhdGlvbiBwcmV2ZW50c1xuXHQgIC8vIHRoZSBjb21waWxlciBmcm9tIGNyZWF0aW5nIGEgdGVtcG9yYXJ5IHZhcmlhYmxlIHRvIGhvbGRcblx0ICAvLyBpdC5cblx0ICBwdXNoTGl0ZXJhbDogZnVuY3Rpb24gcHVzaExpdGVyYWwodmFsdWUpIHtcblx0ICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCh2YWx1ZSk7XG5cdCAgfSxcblxuXHQgIC8vIFtwdXNoUHJvZ3JhbV1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogcHJvZ3JhbShndWlkKSwgLi4uXG5cdCAgLy9cblx0ICAvLyBQdXNoIGEgcHJvZ3JhbSBleHByZXNzaW9uIG9udG8gdGhlIHN0YWNrLiBUaGlzIHRha2VzXG5cdCAgLy8gYSBjb21waWxlLXRpbWUgZ3VpZCBhbmQgY29udmVydHMgaXQgaW50byBhIHJ1bnRpbWUtYWNjZXNzaWJsZVxuXHQgIC8vIGV4cHJlc3Npb24uXG5cdCAgcHVzaFByb2dyYW06IGZ1bmN0aW9uIHB1c2hQcm9ncmFtKGd1aWQpIHtcblx0ICAgIGlmIChndWlkICE9IG51bGwpIHtcblx0ICAgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKHRoaXMucHJvZ3JhbUV4cHJlc3Npb24oZ3VpZCkpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKG51bGwpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICAvLyBbcmVnaXN0ZXJEZWNvcmF0b3JdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiBoYXNoLCBwcm9ncmFtLCBwYXJhbXMuLi4sIC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uXG5cdCAgLy9cblx0ICAvLyBQb3BzIG9mZiB0aGUgZGVjb3JhdG9yJ3MgcGFyYW1ldGVycywgaW52b2tlcyB0aGUgZGVjb3JhdG9yLFxuXHQgIC8vIGFuZCBpbnNlcnRzIHRoZSBkZWNvcmF0b3IgaW50byB0aGUgZGVjb3JhdG9ycyBsaXN0LlxuXHQgIHJlZ2lzdGVyRGVjb3JhdG9yOiBmdW5jdGlvbiByZWdpc3RlckRlY29yYXRvcihwYXJhbVNpemUsIG5hbWUpIHtcblx0ICAgIHZhciBmb3VuZERlY29yYXRvciA9IHRoaXMubmFtZUxvb2t1cCgnZGVjb3JhdG9ycycsIG5hbWUsICdkZWNvcmF0b3InKSxcblx0ICAgICAgICBvcHRpb25zID0gdGhpcy5zZXR1cEhlbHBlckFyZ3MobmFtZSwgcGFyYW1TaXplKTtcblxuXHQgICAgdGhpcy5kZWNvcmF0b3JzLnB1c2goWydmbiA9ICcsIHRoaXMuZGVjb3JhdG9ycy5mdW5jdGlvbkNhbGwoZm91bmREZWNvcmF0b3IsICcnLCBbJ2ZuJywgJ3Byb3BzJywgJ2NvbnRhaW5lcicsIG9wdGlvbnNdKSwgJyB8fCBmbjsnXSk7XG5cdCAgfSxcblxuXHQgIC8vIFtpbnZva2VIZWxwZXJdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiBoYXNoLCBpbnZlcnNlLCBwcm9ncmFtLCBwYXJhbXMuLi4sIC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogcmVzdWx0IG9mIGhlbHBlciBpbnZvY2F0aW9uXG5cdCAgLy9cblx0ICAvLyBQb3BzIG9mZiB0aGUgaGVscGVyJ3MgcGFyYW1ldGVycywgaW52b2tlcyB0aGUgaGVscGVyLFxuXHQgIC8vIGFuZCBwdXNoZXMgdGhlIGhlbHBlcidzIHJldHVybiB2YWx1ZSBvbnRvIHRoZSBzdGFjay5cblx0ICAvL1xuXHQgIC8vIElmIHRoZSBoZWxwZXIgaXMgbm90IGZvdW5kLCBgaGVscGVyTWlzc2luZ2AgaXMgY2FsbGVkLlxuXHQgIGludm9rZUhlbHBlcjogZnVuY3Rpb24gaW52b2tlSGVscGVyKHBhcmFtU2l6ZSwgbmFtZSwgaXNTaW1wbGUpIHtcblx0ICAgIHZhciBub25IZWxwZXIgPSB0aGlzLnBvcFN0YWNrKCksXG5cdCAgICAgICAgaGVscGVyID0gdGhpcy5zZXR1cEhlbHBlcihwYXJhbVNpemUsIG5hbWUpLFxuXHQgICAgICAgIHNpbXBsZSA9IGlzU2ltcGxlID8gW2hlbHBlci5uYW1lLCAnIHx8ICddIDogJyc7XG5cblx0ICAgIHZhciBsb29rdXAgPSBbJygnXS5jb25jYXQoc2ltcGxlLCBub25IZWxwZXIpO1xuXHQgICAgaWYgKCF0aGlzLm9wdGlvbnMuc3RyaWN0KSB7XG5cdCAgICAgIGxvb2t1cC5wdXNoKCcgfHwgJywgdGhpcy5hbGlhc2FibGUoJ2hlbHBlcnMuaGVscGVyTWlzc2luZycpKTtcblx0ICAgIH1cblx0ICAgIGxvb2t1cC5wdXNoKCcpJyk7XG5cblx0ICAgIHRoaXMucHVzaCh0aGlzLnNvdXJjZS5mdW5jdGlvbkNhbGwobG9va3VwLCAnY2FsbCcsIGhlbHBlci5jYWxsUGFyYW1zKSk7XG5cdCAgfSxcblxuXHQgIC8vIFtpbnZva2VLbm93bkhlbHBlcl1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHBhcmFtcy4uLiwgLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXN1bHQgb2YgaGVscGVyIGludm9jYXRpb25cblx0ICAvL1xuXHQgIC8vIFRoaXMgb3BlcmF0aW9uIGlzIHVzZWQgd2hlbiB0aGUgaGVscGVyIGlzIGtub3duIHRvIGV4aXN0LFxuXHQgIC8vIHNvIGEgYGhlbHBlck1pc3NpbmdgIGZhbGxiYWNrIGlzIG5vdCByZXF1aXJlZC5cblx0ICBpbnZva2VLbm93bkhlbHBlcjogZnVuY3Rpb24gaW52b2tlS25vd25IZWxwZXIocGFyYW1TaXplLCBuYW1lKSB7XG5cdCAgICB2YXIgaGVscGVyID0gdGhpcy5zZXR1cEhlbHBlcihwYXJhbVNpemUsIG5hbWUpO1xuXHQgICAgdGhpcy5wdXNoKHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbChoZWxwZXIubmFtZSwgJ2NhbGwnLCBoZWxwZXIuY2FsbFBhcmFtcykpO1xuXHQgIH0sXG5cblx0ICAvLyBbaW52b2tlQW1iaWd1b3VzXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogaGFzaCwgaW52ZXJzZSwgcHJvZ3JhbSwgcGFyYW1zLi4uLCAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHJlc3VsdCBvZiBkaXNhbWJpZ3VhdGlvblxuXHQgIC8vXG5cdCAgLy8gVGhpcyBvcGVyYXRpb24gaXMgdXNlZCB3aGVuIGFuIGV4cHJlc3Npb24gbGlrZSBge3tmb299fWBcblx0ICAvLyBpcyBwcm92aWRlZCwgYnV0IHdlIGRvbid0IGtub3cgYXQgY29tcGlsZS10aW1lIHdoZXRoZXIgaXRcblx0ICAvLyBpcyBhIGhlbHBlciBvciBhIHBhdGguXG5cdCAgLy9cblx0ICAvLyBUaGlzIG9wZXJhdGlvbiBlbWl0cyBtb3JlIGNvZGUgdGhhbiB0aGUgb3RoZXIgb3B0aW9ucyxcblx0ICAvLyBhbmQgY2FuIGJlIGF2b2lkZWQgYnkgcGFzc2luZyB0aGUgYGtub3duSGVscGVyc2AgYW5kXG5cdCAgLy8gYGtub3duSGVscGVyc09ubHlgIGZsYWdzIGF0IGNvbXBpbGUtdGltZS5cblx0ICBpbnZva2VBbWJpZ3VvdXM6IGZ1bmN0aW9uIGludm9rZUFtYmlndW91cyhuYW1lLCBoZWxwZXJDYWxsKSB7XG5cdCAgICB0aGlzLnVzZVJlZ2lzdGVyKCdoZWxwZXInKTtcblxuXHQgICAgdmFyIG5vbkhlbHBlciA9IHRoaXMucG9wU3RhY2soKTtcblxuXHQgICAgdGhpcy5lbXB0eUhhc2goKTtcblx0ICAgIHZhciBoZWxwZXIgPSB0aGlzLnNldHVwSGVscGVyKDAsIG5hbWUsIGhlbHBlckNhbGwpO1xuXG5cdCAgICB2YXIgaGVscGVyTmFtZSA9IHRoaXMubGFzdEhlbHBlciA9IHRoaXMubmFtZUxvb2t1cCgnaGVscGVycycsIG5hbWUsICdoZWxwZXInKTtcblxuXHQgICAgdmFyIGxvb2t1cCA9IFsnKCcsICcoaGVscGVyID0gJywgaGVscGVyTmFtZSwgJyB8fCAnLCBub25IZWxwZXIsICcpJ107XG5cdCAgICBpZiAoIXRoaXMub3B0aW9ucy5zdHJpY3QpIHtcblx0ICAgICAgbG9va3VwWzBdID0gJyhoZWxwZXIgPSAnO1xuXHQgICAgICBsb29rdXAucHVzaCgnICE9IG51bGwgPyBoZWxwZXIgOiAnLCB0aGlzLmFsaWFzYWJsZSgnaGVscGVycy5oZWxwZXJNaXNzaW5nJykpO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLnB1c2goWycoJywgbG9va3VwLCBoZWxwZXIucGFyYW1zSW5pdCA/IFsnKSwoJywgaGVscGVyLnBhcmFtc0luaXRdIDogW10sICcpLCcsICcodHlwZW9mIGhlbHBlciA9PT0gJywgdGhpcy5hbGlhc2FibGUoJ1wiZnVuY3Rpb25cIicpLCAnID8gJywgdGhpcy5zb3VyY2UuZnVuY3Rpb25DYWxsKCdoZWxwZXInLCAnY2FsbCcsIGhlbHBlci5jYWxsUGFyYW1zKSwgJyA6IGhlbHBlcikpJ10pO1xuXHQgIH0sXG5cblx0ICAvLyBbaW52b2tlUGFydGlhbF1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGNvbnRleHQsIC4uLlxuXHQgIC8vIE9uIHN0YWNrIGFmdGVyOiByZXN1bHQgb2YgcGFydGlhbCBpbnZvY2F0aW9uXG5cdCAgLy9cblx0ICAvLyBUaGlzIG9wZXJhdGlvbiBwb3BzIG9mZiBhIGNvbnRleHQsIGludm9rZXMgYSBwYXJ0aWFsIHdpdGggdGhhdCBjb250ZXh0LFxuXHQgIC8vIGFuZCBwdXNoZXMgdGhlIHJlc3VsdCBvZiB0aGUgaW52b2NhdGlvbiBiYWNrLlxuXHQgIGludm9rZVBhcnRpYWw6IGZ1bmN0aW9uIGludm9rZVBhcnRpYWwoaXNEeW5hbWljLCBuYW1lLCBpbmRlbnQpIHtcblx0ICAgIHZhciBwYXJhbXMgPSBbXSxcblx0ICAgICAgICBvcHRpb25zID0gdGhpcy5zZXR1cFBhcmFtcyhuYW1lLCAxLCBwYXJhbXMpO1xuXG5cdCAgICBpZiAoaXNEeW5hbWljKSB7XG5cdCAgICAgIG5hbWUgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgIGRlbGV0ZSBvcHRpb25zLm5hbWU7XG5cdCAgICB9XG5cblx0ICAgIGlmIChpbmRlbnQpIHtcblx0ICAgICAgb3B0aW9ucy5pbmRlbnQgPSBKU09OLnN0cmluZ2lmeShpbmRlbnQpO1xuXHQgICAgfVxuXHQgICAgb3B0aW9ucy5oZWxwZXJzID0gJ2hlbHBlcnMnO1xuXHQgICAgb3B0aW9ucy5wYXJ0aWFscyA9ICdwYXJ0aWFscyc7XG5cdCAgICBvcHRpb25zLmRlY29yYXRvcnMgPSAnY29udGFpbmVyLmRlY29yYXRvcnMnO1xuXG5cdCAgICBpZiAoIWlzRHluYW1pYykge1xuXHQgICAgICBwYXJhbXMudW5zaGlmdCh0aGlzLm5hbWVMb29rdXAoJ3BhcnRpYWxzJywgbmFtZSwgJ3BhcnRpYWwnKSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBwYXJhbXMudW5zaGlmdChuYW1lKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHRoaXMub3B0aW9ucy5jb21wYXQpIHtcblx0ICAgICAgb3B0aW9ucy5kZXB0aHMgPSAnZGVwdGhzJztcblx0ICAgIH1cblx0ICAgIG9wdGlvbnMgPSB0aGlzLm9iamVjdExpdGVyYWwob3B0aW9ucyk7XG5cdCAgICBwYXJhbXMucHVzaChvcHRpb25zKTtcblxuXHQgICAgdGhpcy5wdXNoKHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbCgnY29udGFpbmVyLmludm9rZVBhcnRpYWwnLCAnJywgcGFyYW1zKSk7XG5cdCAgfSxcblxuXHQgIC8vIFthc3NpZ25Ub0hhc2hdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiB2YWx1ZSwgLi4uLCBoYXNoLCAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IC4uLiwgaGFzaCwgLi4uXG5cdCAgLy9cblx0ICAvLyBQb3BzIGEgdmFsdWUgb2ZmIHRoZSBzdGFjayBhbmQgYXNzaWducyBpdCB0byB0aGUgY3VycmVudCBoYXNoXG5cdCAgYXNzaWduVG9IYXNoOiBmdW5jdGlvbiBhc3NpZ25Ub0hhc2goa2V5KSB7XG5cdCAgICB2YXIgdmFsdWUgPSB0aGlzLnBvcFN0YWNrKCksXG5cdCAgICAgICAgY29udGV4dCA9IHVuZGVmaW5lZCxcblx0ICAgICAgICB0eXBlID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGlkID0gdW5kZWZpbmVkO1xuXG5cdCAgICBpZiAodGhpcy50cmFja0lkcykge1xuXHQgICAgICBpZCA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuXHQgICAgICB0eXBlID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgICBjb250ZXh0ID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgaGFzaCA9IHRoaXMuaGFzaDtcblx0ICAgIGlmIChjb250ZXh0KSB7XG5cdCAgICAgIGhhc2guY29udGV4dHNba2V5XSA9IGNvbnRleHQ7XG5cdCAgICB9XG5cdCAgICBpZiAodHlwZSkge1xuXHQgICAgICBoYXNoLnR5cGVzW2tleV0gPSB0eXBlO1xuXHQgICAgfVxuXHQgICAgaWYgKGlkKSB7XG5cdCAgICAgIGhhc2guaWRzW2tleV0gPSBpZDtcblx0ICAgIH1cblx0ICAgIGhhc2gudmFsdWVzW2tleV0gPSB2YWx1ZTtcblx0ICB9LFxuXG5cdCAgcHVzaElkOiBmdW5jdGlvbiBwdXNoSWQodHlwZSwgbmFtZSwgY2hpbGQpIHtcblx0ICAgIGlmICh0eXBlID09PSAnQmxvY2tQYXJhbScpIHtcblx0ICAgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKCdibG9ja1BhcmFtc1snICsgbmFtZVswXSArICddLnBhdGhbJyArIG5hbWVbMV0gKyAnXScgKyAoY2hpbGQgPyAnICsgJyArIEpTT04uc3RyaW5naWZ5KCcuJyArIGNoaWxkKSA6ICcnKSk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdQYXRoRXhwcmVzc2lvbicpIHtcblx0ICAgICAgdGhpcy5wdXNoU3RyaW5nKG5hbWUpO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlID09PSAnU3ViRXhwcmVzc2lvbicpIHtcblx0ICAgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKCd0cnVlJyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoJ251bGwnKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgLy8gSEVMUEVSU1xuXG5cdCAgY29tcGlsZXI6IEphdmFTY3JpcHRDb21waWxlcixcblxuXHQgIGNvbXBpbGVDaGlsZHJlbjogZnVuY3Rpb24gY29tcGlsZUNoaWxkcmVuKGVudmlyb25tZW50LCBvcHRpb25zKSB7XG5cdCAgICB2YXIgY2hpbGRyZW4gPSBlbnZpcm9ubWVudC5jaGlsZHJlbixcblx0ICAgICAgICBjaGlsZCA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBjb21waWxlciA9IHVuZGVmaW5lZDtcblxuXHQgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcblx0ICAgICAgY29tcGlsZXIgPSBuZXcgdGhpcy5jb21waWxlcigpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5ldy1jYXBcblxuXHQgICAgICB2YXIgZXhpc3RpbmcgPSB0aGlzLm1hdGNoRXhpc3RpbmdQcm9ncmFtKGNoaWxkKTtcblxuXHQgICAgICBpZiAoZXhpc3RpbmcgPT0gbnVsbCkge1xuXHQgICAgICAgIHRoaXMuY29udGV4dC5wcm9ncmFtcy5wdXNoKCcnKTsgLy8gUGxhY2Vob2xkZXIgdG8gcHJldmVudCBuYW1lIGNvbmZsaWN0cyBmb3IgbmVzdGVkIGNoaWxkcmVuXG5cdCAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5jb250ZXh0LnByb2dyYW1zLmxlbmd0aDtcblx0ICAgICAgICBjaGlsZC5pbmRleCA9IGluZGV4O1xuXHQgICAgICAgIGNoaWxkLm5hbWUgPSAncHJvZ3JhbScgKyBpbmRleDtcblx0ICAgICAgICB0aGlzLmNvbnRleHQucHJvZ3JhbXNbaW5kZXhdID0gY29tcGlsZXIuY29tcGlsZShjaGlsZCwgb3B0aW9ucywgdGhpcy5jb250ZXh0LCAhdGhpcy5wcmVjb21waWxlKTtcblx0ICAgICAgICB0aGlzLmNvbnRleHQuZGVjb3JhdG9yc1tpbmRleF0gPSBjb21waWxlci5kZWNvcmF0b3JzO1xuXHQgICAgICAgIHRoaXMuY29udGV4dC5lbnZpcm9ubWVudHNbaW5kZXhdID0gY2hpbGQ7XG5cblx0ICAgICAgICB0aGlzLnVzZURlcHRocyA9IHRoaXMudXNlRGVwdGhzIHx8IGNvbXBpbGVyLnVzZURlcHRocztcblx0ICAgICAgICB0aGlzLnVzZUJsb2NrUGFyYW1zID0gdGhpcy51c2VCbG9ja1BhcmFtcyB8fCBjb21waWxlci51c2VCbG9ja1BhcmFtcztcblx0ICAgICAgICBjaGlsZC51c2VEZXB0aHMgPSB0aGlzLnVzZURlcHRocztcblx0ICAgICAgICBjaGlsZC51c2VCbG9ja1BhcmFtcyA9IHRoaXMudXNlQmxvY2tQYXJhbXM7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgY2hpbGQuaW5kZXggPSBleGlzdGluZy5pbmRleDtcblx0ICAgICAgICBjaGlsZC5uYW1lID0gJ3Byb2dyYW0nICsgZXhpc3RpbmcuaW5kZXg7XG5cblx0ICAgICAgICB0aGlzLnVzZURlcHRocyA9IHRoaXMudXNlRGVwdGhzIHx8IGV4aXN0aW5nLnVzZURlcHRocztcblx0ICAgICAgICB0aGlzLnVzZUJsb2NrUGFyYW1zID0gdGhpcy51c2VCbG9ja1BhcmFtcyB8fCBleGlzdGluZy51c2VCbG9ja1BhcmFtcztcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0sXG5cdCAgbWF0Y2hFeGlzdGluZ1Byb2dyYW06IGZ1bmN0aW9uIG1hdGNoRXhpc3RpbmdQcm9ncmFtKGNoaWxkKSB7XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5jb250ZXh0LmVudmlyb25tZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICB2YXIgZW52aXJvbm1lbnQgPSB0aGlzLmNvbnRleHQuZW52aXJvbm1lbnRzW2ldO1xuXHQgICAgICBpZiAoZW52aXJvbm1lbnQgJiYgZW52aXJvbm1lbnQuZXF1YWxzKGNoaWxkKSkge1xuXHQgICAgICAgIHJldHVybiBlbnZpcm9ubWVudDtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBwcm9ncmFtRXhwcmVzc2lvbjogZnVuY3Rpb24gcHJvZ3JhbUV4cHJlc3Npb24oZ3VpZCkge1xuXHQgICAgdmFyIGNoaWxkID0gdGhpcy5lbnZpcm9ubWVudC5jaGlsZHJlbltndWlkXSxcblx0ICAgICAgICBwcm9ncmFtUGFyYW1zID0gW2NoaWxkLmluZGV4LCAnZGF0YScsIGNoaWxkLmJsb2NrUGFyYW1zXTtcblxuXHQgICAgaWYgKHRoaXMudXNlQmxvY2tQYXJhbXMgfHwgdGhpcy51c2VEZXB0aHMpIHtcblx0ICAgICAgcHJvZ3JhbVBhcmFtcy5wdXNoKCdibG9ja1BhcmFtcycpO1xuXHQgICAgfVxuXHQgICAgaWYgKHRoaXMudXNlRGVwdGhzKSB7XG5cdCAgICAgIHByb2dyYW1QYXJhbXMucHVzaCgnZGVwdGhzJyk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiAnY29udGFpbmVyLnByb2dyYW0oJyArIHByb2dyYW1QYXJhbXMuam9pbignLCAnKSArICcpJztcblx0ICB9LFxuXG5cdCAgdXNlUmVnaXN0ZXI6IGZ1bmN0aW9uIHVzZVJlZ2lzdGVyKG5hbWUpIHtcblx0ICAgIGlmICghdGhpcy5yZWdpc3RlcnNbbmFtZV0pIHtcblx0ICAgICAgdGhpcy5yZWdpc3RlcnNbbmFtZV0gPSB0cnVlO1xuXHQgICAgICB0aGlzLnJlZ2lzdGVycy5saXN0LnB1c2gobmFtZSk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHB1c2g6IGZ1bmN0aW9uIHB1c2goZXhwcikge1xuXHQgICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIExpdGVyYWwpKSB7XG5cdCAgICAgIGV4cHIgPSB0aGlzLnNvdXJjZS53cmFwKGV4cHIpO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLmlubGluZVN0YWNrLnB1c2goZXhwcik7XG5cdCAgICByZXR1cm4gZXhwcjtcblx0ICB9LFxuXG5cdCAgcHVzaFN0YWNrTGl0ZXJhbDogZnVuY3Rpb24gcHVzaFN0YWNrTGl0ZXJhbChpdGVtKSB7XG5cdCAgICB0aGlzLnB1c2gobmV3IExpdGVyYWwoaXRlbSkpO1xuXHQgIH0sXG5cblx0ICBwdXNoU291cmNlOiBmdW5jdGlvbiBwdXNoU291cmNlKHNvdXJjZSkge1xuXHQgICAgaWYgKHRoaXMucGVuZGluZ0NvbnRlbnQpIHtcblx0ICAgICAgdGhpcy5zb3VyY2UucHVzaCh0aGlzLmFwcGVuZFRvQnVmZmVyKHRoaXMuc291cmNlLnF1b3RlZFN0cmluZyh0aGlzLnBlbmRpbmdDb250ZW50KSwgdGhpcy5wZW5kaW5nTG9jYXRpb24pKTtcblx0ICAgICAgdGhpcy5wZW5kaW5nQ29udGVudCA9IHVuZGVmaW5lZDtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNvdXJjZSkge1xuXHQgICAgICB0aGlzLnNvdXJjZS5wdXNoKHNvdXJjZSk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHJlcGxhY2VTdGFjazogZnVuY3Rpb24gcmVwbGFjZVN0YWNrKGNhbGxiYWNrKSB7XG5cdCAgICB2YXIgcHJlZml4ID0gWycoJ10sXG5cdCAgICAgICAgc3RhY2sgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgY3JlYXRlZFN0YWNrID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIHVzZWRMaXRlcmFsID0gdW5kZWZpbmVkO1xuXG5cdCAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgICAgaWYgKCF0aGlzLmlzSW5saW5lKCkpIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ3JlcGxhY2VTdGFjayBvbiBub24taW5saW5lJyk7XG5cdCAgICB9XG5cblx0ICAgIC8vIFdlIHdhbnQgdG8gbWVyZ2UgdGhlIGlubGluZSBzdGF0ZW1lbnQgaW50byB0aGUgcmVwbGFjZW1lbnQgc3RhdGVtZW50IHZpYSAnLCdcblx0ICAgIHZhciB0b3AgPSB0aGlzLnBvcFN0YWNrKHRydWUpO1xuXG5cdCAgICBpZiAodG9wIGluc3RhbmNlb2YgTGl0ZXJhbCkge1xuXHQgICAgICAvLyBMaXRlcmFscyBkbyBub3QgbmVlZCB0byBiZSBpbmxpbmVkXG5cdCAgICAgIHN0YWNrID0gW3RvcC52YWx1ZV07XG5cdCAgICAgIHByZWZpeCA9IFsnKCcsIHN0YWNrXTtcblx0ICAgICAgdXNlZExpdGVyYWwgPSB0cnVlO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gR2V0IG9yIGNyZWF0ZSB0aGUgY3VycmVudCBzdGFjayBuYW1lIGZvciB1c2UgYnkgdGhlIGlubGluZVxuXHQgICAgICBjcmVhdGVkU3RhY2sgPSB0cnVlO1xuXHQgICAgICB2YXIgX25hbWUgPSB0aGlzLmluY3JTdGFjaygpO1xuXG5cdCAgICAgIHByZWZpeCA9IFsnKCgnLCB0aGlzLnB1c2goX25hbWUpLCAnID0gJywgdG9wLCAnKSddO1xuXHQgICAgICBzdGFjayA9IHRoaXMudG9wU3RhY2soKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGl0ZW0gPSBjYWxsYmFjay5jYWxsKHRoaXMsIHN0YWNrKTtcblxuXHQgICAgaWYgKCF1c2VkTGl0ZXJhbCkge1xuXHQgICAgICB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICB9XG5cdCAgICBpZiAoY3JlYXRlZFN0YWNrKSB7XG5cdCAgICAgIHRoaXMuc3RhY2tTbG90LS07XG5cdCAgICB9XG5cdCAgICB0aGlzLnB1c2gocHJlZml4LmNvbmNhdChpdGVtLCAnKScpKTtcblx0ICB9LFxuXG5cdCAgaW5jclN0YWNrOiBmdW5jdGlvbiBpbmNyU3RhY2soKSB7XG5cdCAgICB0aGlzLnN0YWNrU2xvdCsrO1xuXHQgICAgaWYgKHRoaXMuc3RhY2tTbG90ID4gdGhpcy5zdGFja1ZhcnMubGVuZ3RoKSB7XG5cdCAgICAgIHRoaXMuc3RhY2tWYXJzLnB1c2goJ3N0YWNrJyArIHRoaXMuc3RhY2tTbG90KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzLnRvcFN0YWNrTmFtZSgpO1xuXHQgIH0sXG5cdCAgdG9wU3RhY2tOYW1lOiBmdW5jdGlvbiB0b3BTdGFja05hbWUoKSB7XG5cdCAgICByZXR1cm4gJ3N0YWNrJyArIHRoaXMuc3RhY2tTbG90O1xuXHQgIH0sXG5cdCAgZmx1c2hJbmxpbmU6IGZ1bmN0aW9uIGZsdXNoSW5saW5lKCkge1xuXHQgICAgdmFyIGlubGluZVN0YWNrID0gdGhpcy5pbmxpbmVTdGFjaztcblx0ICAgIHRoaXMuaW5saW5lU3RhY2sgPSBbXTtcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBpbmxpbmVTdGFjay5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICB2YXIgZW50cnkgPSBpbmxpbmVTdGFja1tpXTtcblx0ICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdCAgICAgIGlmIChlbnRyeSBpbnN0YW5jZW9mIExpdGVyYWwpIHtcblx0ICAgICAgICB0aGlzLmNvbXBpbGVTdGFjay5wdXNoKGVudHJ5KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgc3RhY2sgPSB0aGlzLmluY3JTdGFjaygpO1xuXHQgICAgICAgIHRoaXMucHVzaFNvdXJjZShbc3RhY2ssICcgPSAnLCBlbnRyeSwgJzsnXSk7XG5cdCAgICAgICAgdGhpcy5jb21waWxlU3RhY2sucHVzaChzdGFjayk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LFxuXHQgIGlzSW5saW5lOiBmdW5jdGlvbiBpc0lubGluZSgpIHtcblx0ICAgIHJldHVybiB0aGlzLmlubGluZVN0YWNrLmxlbmd0aDtcblx0ICB9LFxuXG5cdCAgcG9wU3RhY2s6IGZ1bmN0aW9uIHBvcFN0YWNrKHdyYXBwZWQpIHtcblx0ICAgIHZhciBpbmxpbmUgPSB0aGlzLmlzSW5saW5lKCksXG5cdCAgICAgICAgaXRlbSA9IChpbmxpbmUgPyB0aGlzLmlubGluZVN0YWNrIDogdGhpcy5jb21waWxlU3RhY2spLnBvcCgpO1xuXG5cdCAgICBpZiAoIXdyYXBwZWQgJiYgaXRlbSBpbnN0YW5jZW9mIExpdGVyYWwpIHtcblx0ICAgICAgcmV0dXJuIGl0ZW0udmFsdWU7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBpZiAoIWlubGluZSkge1xuXHQgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgICAgICAgaWYgKCF0aGlzLnN0YWNrU2xvdCkge1xuXHQgICAgICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ0ludmFsaWQgc3RhY2sgcG9wJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHRoaXMuc3RhY2tTbG90LS07XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGl0ZW07XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHRvcFN0YWNrOiBmdW5jdGlvbiB0b3BTdGFjaygpIHtcblx0ICAgIHZhciBzdGFjayA9IHRoaXMuaXNJbmxpbmUoKSA/IHRoaXMuaW5saW5lU3RhY2sgOiB0aGlzLmNvbXBpbGVTdGFjayxcblx0ICAgICAgICBpdGVtID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cblx0ICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXHQgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBMaXRlcmFsKSB7XG5cdCAgICAgIHJldHVybiBpdGVtLnZhbHVlO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuIGl0ZW07XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIGNvbnRleHROYW1lOiBmdW5jdGlvbiBjb250ZXh0TmFtZShjb250ZXh0KSB7XG5cdCAgICBpZiAodGhpcy51c2VEZXB0aHMgJiYgY29udGV4dCkge1xuXHQgICAgICByZXR1cm4gJ2RlcHRoc1snICsgY29udGV4dCArICddJztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiAnZGVwdGgnICsgY29udGV4dDtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgcXVvdGVkU3RyaW5nOiBmdW5jdGlvbiBxdW90ZWRTdHJpbmcoc3RyKSB7XG5cdCAgICByZXR1cm4gdGhpcy5zb3VyY2UucXVvdGVkU3RyaW5nKHN0cik7XG5cdCAgfSxcblxuXHQgIG9iamVjdExpdGVyYWw6IGZ1bmN0aW9uIG9iamVjdExpdGVyYWwob2JqKSB7XG5cdCAgICByZXR1cm4gdGhpcy5zb3VyY2Uub2JqZWN0TGl0ZXJhbChvYmopO1xuXHQgIH0sXG5cblx0ICBhbGlhc2FibGU6IGZ1bmN0aW9uIGFsaWFzYWJsZShuYW1lKSB7XG5cdCAgICB2YXIgcmV0ID0gdGhpcy5hbGlhc2VzW25hbWVdO1xuXHQgICAgaWYgKHJldCkge1xuXHQgICAgICByZXQucmVmZXJlbmNlQ291bnQrKztcblx0ICAgICAgcmV0dXJuIHJldDtcblx0ICAgIH1cblxuXHQgICAgcmV0ID0gdGhpcy5hbGlhc2VzW25hbWVdID0gdGhpcy5zb3VyY2Uud3JhcChuYW1lKTtcblx0ICAgIHJldC5hbGlhc2FibGUgPSB0cnVlO1xuXHQgICAgcmV0LnJlZmVyZW5jZUNvdW50ID0gMTtcblxuXHQgICAgcmV0dXJuIHJldDtcblx0ICB9LFxuXG5cdCAgc2V0dXBIZWxwZXI6IGZ1bmN0aW9uIHNldHVwSGVscGVyKHBhcmFtU2l6ZSwgbmFtZSwgYmxvY2tIZWxwZXIpIHtcblx0ICAgIHZhciBwYXJhbXMgPSBbXSxcblx0ICAgICAgICBwYXJhbXNJbml0ID0gdGhpcy5zZXR1cEhlbHBlckFyZ3MobmFtZSwgcGFyYW1TaXplLCBwYXJhbXMsIGJsb2NrSGVscGVyKTtcblx0ICAgIHZhciBmb3VuZEhlbHBlciA9IHRoaXMubmFtZUxvb2t1cCgnaGVscGVycycsIG5hbWUsICdoZWxwZXInKSxcblx0ICAgICAgICBjYWxsQ29udGV4dCA9IHRoaXMuYWxpYXNhYmxlKHRoaXMuY29udGV4dE5hbWUoMCkgKyAnICE9IG51bGwgPyAnICsgdGhpcy5jb250ZXh0TmFtZSgwKSArICcgOiAoY29udGFpbmVyLm51bGxDb250ZXh0IHx8IHt9KScpO1xuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICBwYXJhbXM6IHBhcmFtcyxcblx0ICAgICAgcGFyYW1zSW5pdDogcGFyYW1zSW5pdCxcblx0ICAgICAgbmFtZTogZm91bmRIZWxwZXIsXG5cdCAgICAgIGNhbGxQYXJhbXM6IFtjYWxsQ29udGV4dF0uY29uY2F0KHBhcmFtcylcblx0ICAgIH07XG5cdCAgfSxcblxuXHQgIHNldHVwUGFyYW1zOiBmdW5jdGlvbiBzZXR1cFBhcmFtcyhoZWxwZXIsIHBhcmFtU2l6ZSwgcGFyYW1zKSB7XG5cdCAgICB2YXIgb3B0aW9ucyA9IHt9LFxuXHQgICAgICAgIGNvbnRleHRzID0gW10sXG5cdCAgICAgICAgdHlwZXMgPSBbXSxcblx0ICAgICAgICBpZHMgPSBbXSxcblx0ICAgICAgICBvYmplY3RBcmdzID0gIXBhcmFtcyxcblx0ICAgICAgICBwYXJhbSA9IHVuZGVmaW5lZDtcblxuXHQgICAgaWYgKG9iamVjdEFyZ3MpIHtcblx0ICAgICAgcGFyYW1zID0gW107XG5cdCAgICB9XG5cblx0ICAgIG9wdGlvbnMubmFtZSA9IHRoaXMucXVvdGVkU3RyaW5nKGhlbHBlcik7XG5cdCAgICBvcHRpb25zLmhhc2ggPSB0aGlzLnBvcFN0YWNrKCk7XG5cblx0ICAgIGlmICh0aGlzLnRyYWNrSWRzKSB7XG5cdCAgICAgIG9wdGlvbnMuaGFzaElkcyA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuXHQgICAgICBvcHRpb25zLmhhc2hUeXBlcyA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgICAgb3B0aW9ucy5oYXNoQ29udGV4dHMgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICB9XG5cblx0ICAgIHZhciBpbnZlcnNlID0gdGhpcy5wb3BTdGFjaygpLFxuXHQgICAgICAgIHByb2dyYW0gPSB0aGlzLnBvcFN0YWNrKCk7XG5cblx0ICAgIC8vIEF2b2lkIHNldHRpbmcgZm4gYW5kIGludmVyc2UgaWYgbmVpdGhlciBhcmUgc2V0LiBUaGlzIGFsbG93c1xuXHQgICAgLy8gaGVscGVycyB0byBkbyBhIGNoZWNrIGZvciBgaWYgKG9wdGlvbnMuZm4pYFxuXHQgICAgaWYgKHByb2dyYW0gfHwgaW52ZXJzZSkge1xuXHQgICAgICBvcHRpb25zLmZuID0gcHJvZ3JhbSB8fCAnY29udGFpbmVyLm5vb3AnO1xuXHQgICAgICBvcHRpb25zLmludmVyc2UgPSBpbnZlcnNlIHx8ICdjb250YWluZXIubm9vcCc7XG5cdCAgICB9XG5cblx0ICAgIC8vIFRoZSBwYXJhbWV0ZXJzIGdvIG9uIHRvIHRoZSBzdGFjayBpbiBvcmRlciAobWFraW5nIHN1cmUgdGhhdCB0aGV5IGFyZSBldmFsdWF0ZWQgaW4gb3JkZXIpXG5cdCAgICAvLyBzbyB3ZSBuZWVkIHRvIHBvcCB0aGVtIG9mZiB0aGUgc3RhY2sgaW4gcmV2ZXJzZSBvcmRlclxuXHQgICAgdmFyIGkgPSBwYXJhbVNpemU7XG5cdCAgICB3aGlsZSAoaS0tKSB7XG5cdCAgICAgIHBhcmFtID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgICBwYXJhbXNbaV0gPSBwYXJhbTtcblxuXHQgICAgICBpZiAodGhpcy50cmFja0lkcykge1xuXHQgICAgICAgIGlkc1tpXSA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAodGhpcy5zdHJpbmdQYXJhbXMpIHtcblx0ICAgICAgICB0eXBlc1tpXSA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgICAgICBjb250ZXh0c1tpXSA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBpZiAob2JqZWN0QXJncykge1xuXHQgICAgICBvcHRpb25zLmFyZ3MgPSB0aGlzLnNvdXJjZS5nZW5lcmF0ZUFycmF5KHBhcmFtcyk7XG5cdCAgICB9XG5cblx0ICAgIGlmICh0aGlzLnRyYWNrSWRzKSB7XG5cdCAgICAgIG9wdGlvbnMuaWRzID0gdGhpcy5zb3VyY2UuZ2VuZXJhdGVBcnJheShpZHMpO1xuXHQgICAgfVxuXHQgICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG5cdCAgICAgIG9wdGlvbnMudHlwZXMgPSB0aGlzLnNvdXJjZS5nZW5lcmF0ZUFycmF5KHR5cGVzKTtcblx0ICAgICAgb3B0aW9ucy5jb250ZXh0cyA9IHRoaXMuc291cmNlLmdlbmVyYXRlQXJyYXkoY29udGV4dHMpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAodGhpcy5vcHRpb25zLmRhdGEpIHtcblx0ICAgICAgb3B0aW9ucy5kYXRhID0gJ2RhdGEnO1xuXHQgICAgfVxuXHQgICAgaWYgKHRoaXMudXNlQmxvY2tQYXJhbXMpIHtcblx0ICAgICAgb3B0aW9ucy5ibG9ja1BhcmFtcyA9ICdibG9ja1BhcmFtcyc7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gb3B0aW9ucztcblx0ICB9LFxuXG5cdCAgc2V0dXBIZWxwZXJBcmdzOiBmdW5jdGlvbiBzZXR1cEhlbHBlckFyZ3MoaGVscGVyLCBwYXJhbVNpemUsIHBhcmFtcywgdXNlUmVnaXN0ZXIpIHtcblx0ICAgIHZhciBvcHRpb25zID0gdGhpcy5zZXR1cFBhcmFtcyhoZWxwZXIsIHBhcmFtU2l6ZSwgcGFyYW1zKTtcblx0ICAgIG9wdGlvbnMgPSB0aGlzLm9iamVjdExpdGVyYWwob3B0aW9ucyk7XG5cdCAgICBpZiAodXNlUmVnaXN0ZXIpIHtcblx0ICAgICAgdGhpcy51c2VSZWdpc3Rlcignb3B0aW9ucycpO1xuXHQgICAgICBwYXJhbXMucHVzaCgnb3B0aW9ucycpO1xuXHQgICAgICByZXR1cm4gWydvcHRpb25zPScsIG9wdGlvbnNdO1xuXHQgICAgfSBlbHNlIGlmIChwYXJhbXMpIHtcblx0ICAgICAgcGFyYW1zLnB1c2gob3B0aW9ucyk7XG5cdCAgICAgIHJldHVybiAnJztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiBvcHRpb25zO1xuXHQgICAgfVxuXHQgIH1cblx0fTtcblxuXHQoZnVuY3Rpb24gKCkge1xuXHQgIHZhciByZXNlcnZlZFdvcmRzID0gKCdicmVhayBlbHNlIG5ldyB2YXInICsgJyBjYXNlIGZpbmFsbHkgcmV0dXJuIHZvaWQnICsgJyBjYXRjaCBmb3Igc3dpdGNoIHdoaWxlJyArICcgY29udGludWUgZnVuY3Rpb24gdGhpcyB3aXRoJyArICcgZGVmYXVsdCBpZiB0aHJvdycgKyAnIGRlbGV0ZSBpbiB0cnknICsgJyBkbyBpbnN0YW5jZW9mIHR5cGVvZicgKyAnIGFic3RyYWN0IGVudW0gaW50IHNob3J0JyArICcgYm9vbGVhbiBleHBvcnQgaW50ZXJmYWNlIHN0YXRpYycgKyAnIGJ5dGUgZXh0ZW5kcyBsb25nIHN1cGVyJyArICcgY2hhciBmaW5hbCBuYXRpdmUgc3luY2hyb25pemVkJyArICcgY2xhc3MgZmxvYXQgcGFja2FnZSB0aHJvd3MnICsgJyBjb25zdCBnb3RvIHByaXZhdGUgdHJhbnNpZW50JyArICcgZGVidWdnZXIgaW1wbGVtZW50cyBwcm90ZWN0ZWQgdm9sYXRpbGUnICsgJyBkb3VibGUgaW1wb3J0IHB1YmxpYyBsZXQgeWllbGQgYXdhaXQnICsgJyBudWxsIHRydWUgZmFsc2UnKS5zcGxpdCgnICcpO1xuXG5cdCAgdmFyIGNvbXBpbGVyV29yZHMgPSBKYXZhU2NyaXB0Q29tcGlsZXIuUkVTRVJWRURfV09SRFMgPSB7fTtcblxuXHQgIGZvciAodmFyIGkgPSAwLCBsID0gcmVzZXJ2ZWRXb3Jkcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgIGNvbXBpbGVyV29yZHNbcmVzZXJ2ZWRXb3Jkc1tpXV0gPSB0cnVlO1xuXHQgIH1cblx0fSkoKTtcblxuXHRKYXZhU2NyaXB0Q29tcGlsZXIuaXNWYWxpZEphdmFTY3JpcHRWYXJpYWJsZU5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuXHQgIHJldHVybiAhSmF2YVNjcmlwdENvbXBpbGVyLlJFU0VSVkVEX1dPUkRTW25hbWVdICYmIC9eW2EtekEtWl8kXVswLTlhLXpBLVpfJF0qJC8udGVzdChuYW1lKTtcblx0fTtcblxuXHRmdW5jdGlvbiBzdHJpY3RMb29rdXAocmVxdWlyZVRlcm1pbmFsLCBjb21waWxlciwgcGFydHMsIHR5cGUpIHtcblx0ICB2YXIgc3RhY2sgPSBjb21waWxlci5wb3BTdGFjaygpLFxuXHQgICAgICBpID0gMCxcblx0ICAgICAgbGVuID0gcGFydHMubGVuZ3RoO1xuXHQgIGlmIChyZXF1aXJlVGVybWluYWwpIHtcblx0ICAgIGxlbi0tO1xuXHQgIH1cblxuXHQgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgIHN0YWNrID0gY29tcGlsZXIubmFtZUxvb2t1cChzdGFjaywgcGFydHNbaV0sIHR5cGUpO1xuXHQgIH1cblxuXHQgIGlmIChyZXF1aXJlVGVybWluYWwpIHtcblx0ICAgIHJldHVybiBbY29tcGlsZXIuYWxpYXNhYmxlKCdjb250YWluZXIuc3RyaWN0JyksICcoJywgc3RhY2ssICcsICcsIGNvbXBpbGVyLnF1b3RlZFN0cmluZyhwYXJ0c1tpXSksICcpJ107XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJldHVybiBzdGFjaztcblx0ICB9XG5cdH1cblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBKYXZhU2NyaXB0Q29tcGlsZXI7XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDQzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogZ2xvYmFsIGRlZmluZSAqL1xuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX3V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHR2YXIgU291cmNlTm9kZSA9IHVuZGVmaW5lZDtcblxuXHR0cnkge1xuXHQgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgaWYgKGZhbHNlKSB7XG5cdCAgICAvLyBXZSBkb24ndCBzdXBwb3J0IHRoaXMgaW4gQU1EIGVudmlyb25tZW50cy4gRm9yIHRoZXNlIGVudmlyb25tZW50cywgd2UgYXN1c21lIHRoYXRcblx0ICAgIC8vIHRoZXkgYXJlIHJ1bm5pbmcgb24gdGhlIGJyb3dzZXIgYW5kIHRodXMgaGF2ZSBubyBuZWVkIGZvciB0aGUgc291cmNlLW1hcCBsaWJyYXJ5LlxuXHQgICAgdmFyIFNvdXJjZU1hcCA9IHJlcXVpcmUoJ3NvdXJjZS1tYXAnKTtcblx0ICAgIFNvdXJjZU5vZGUgPSBTb3VyY2VNYXAuU291cmNlTm9kZTtcblx0ICB9XG5cdH0gY2F0Y2ggKGVycikge31cblx0LyogTk9QICovXG5cblx0LyogaXN0YW5idWwgaWdub3JlIGlmOiB0ZXN0ZWQgYnV0IG5vdCBjb3ZlcmVkIGluIGlzdGFuYnVsIGR1ZSB0byBkaXN0IGJ1aWxkICAqL1xuXHRpZiAoIVNvdXJjZU5vZGUpIHtcblx0ICBTb3VyY2VOb2RlID0gZnVuY3Rpb24gKGxpbmUsIGNvbHVtbiwgc3JjRmlsZSwgY2h1bmtzKSB7XG5cdCAgICB0aGlzLnNyYyA9ICcnO1xuXHQgICAgaWYgKGNodW5rcykge1xuXHQgICAgICB0aGlzLmFkZChjaHVua3MpO1xuXHQgICAgfVxuXHQgIH07XG5cdCAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICBTb3VyY2VOb2RlLnByb3RvdHlwZSA9IHtcblx0ICAgIGFkZDogZnVuY3Rpb24gYWRkKGNodW5rcykge1xuXHQgICAgICBpZiAoX3V0aWxzLmlzQXJyYXkoY2h1bmtzKSkge1xuXHQgICAgICAgIGNodW5rcyA9IGNodW5rcy5qb2luKCcnKTtcblx0ICAgICAgfVxuXHQgICAgICB0aGlzLnNyYyArPSBjaHVua3M7XG5cdCAgICB9LFxuXHQgICAgcHJlcGVuZDogZnVuY3Rpb24gcHJlcGVuZChjaHVua3MpIHtcblx0ICAgICAgaWYgKF91dGlscy5pc0FycmF5KGNodW5rcykpIHtcblx0ICAgICAgICBjaHVua3MgPSBjaHVua3Muam9pbignJyk7XG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5zcmMgPSBjaHVua3MgKyB0aGlzLnNyYztcblx0ICAgIH0sXG5cdCAgICB0b1N0cmluZ1dpdGhTb3VyY2VNYXA6IGZ1bmN0aW9uIHRvU3RyaW5nV2l0aFNvdXJjZU1hcCgpIHtcblx0ICAgICAgcmV0dXJuIHsgY29kZTogdGhpcy50b1N0cmluZygpIH07XG5cdCAgICB9LFxuXHQgICAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHQgICAgICByZXR1cm4gdGhpcy5zcmM7XG5cdCAgICB9XG5cdCAgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNhc3RDaHVuayhjaHVuaywgY29kZUdlbiwgbG9jKSB7XG5cdCAgaWYgKF91dGlscy5pc0FycmF5KGNodW5rKSkge1xuXHQgICAgdmFyIHJldCA9IFtdO1xuXG5cdCAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2h1bmsubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgcmV0LnB1c2goY29kZUdlbi53cmFwKGNodW5rW2ldLCBsb2MpKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiByZXQ7XG5cdCAgfSBlbHNlIGlmICh0eXBlb2YgY2h1bmsgPT09ICdib29sZWFuJyB8fCB0eXBlb2YgY2h1bmsgPT09ICdudW1iZXInKSB7XG5cdCAgICAvLyBIYW5kbGUgcHJpbWl0aXZlcyB0aGF0IHRoZSBTb3VyY2VOb2RlIHdpbGwgdGhyb3cgdXAgb25cblx0ICAgIHJldHVybiBjaHVuayArICcnO1xuXHQgIH1cblx0ICByZXR1cm4gY2h1bms7XG5cdH1cblxuXHRmdW5jdGlvbiBDb2RlR2VuKHNyY0ZpbGUpIHtcblx0ICB0aGlzLnNyY0ZpbGUgPSBzcmNGaWxlO1xuXHQgIHRoaXMuc291cmNlID0gW107XG5cdH1cblxuXHRDb2RlR2VuLnByb3RvdHlwZSA9IHtcblx0ICBpc0VtcHR5OiBmdW5jdGlvbiBpc0VtcHR5KCkge1xuXHQgICAgcmV0dXJuICF0aGlzLnNvdXJjZS5sZW5ndGg7XG5cdCAgfSxcblx0ICBwcmVwZW5kOiBmdW5jdGlvbiBwcmVwZW5kKHNvdXJjZSwgbG9jKSB7XG5cdCAgICB0aGlzLnNvdXJjZS51bnNoaWZ0KHRoaXMud3JhcChzb3VyY2UsIGxvYykpO1xuXHQgIH0sXG5cdCAgcHVzaDogZnVuY3Rpb24gcHVzaChzb3VyY2UsIGxvYykge1xuXHQgICAgdGhpcy5zb3VyY2UucHVzaCh0aGlzLndyYXAoc291cmNlLCBsb2MpKTtcblx0ICB9LFxuXG5cdCAgbWVyZ2U6IGZ1bmN0aW9uIG1lcmdlKCkge1xuXHQgICAgdmFyIHNvdXJjZSA9IHRoaXMuZW1wdHkoKTtcblx0ICAgIHRoaXMuZWFjaChmdW5jdGlvbiAobGluZSkge1xuXHQgICAgICBzb3VyY2UuYWRkKFsnICAnLCBsaW5lLCAnXFxuJ10pO1xuXHQgICAgfSk7XG5cdCAgICByZXR1cm4gc291cmNlO1xuXHQgIH0sXG5cblx0ICBlYWNoOiBmdW5jdGlvbiBlYWNoKGl0ZXIpIHtcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLnNvdXJjZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICBpdGVyKHRoaXMuc291cmNlW2ldKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgZW1wdHk6IGZ1bmN0aW9uIGVtcHR5KCkge1xuXHQgICAgdmFyIGxvYyA9IHRoaXMuY3VycmVudExvY2F0aW9uIHx8IHsgc3RhcnQ6IHt9IH07XG5cdCAgICByZXR1cm4gbmV3IFNvdXJjZU5vZGUobG9jLnN0YXJ0LmxpbmUsIGxvYy5zdGFydC5jb2x1bW4sIHRoaXMuc3JjRmlsZSk7XG5cdCAgfSxcblx0ICB3cmFwOiBmdW5jdGlvbiB3cmFwKGNodW5rKSB7XG5cdCAgICB2YXIgbG9jID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gdGhpcy5jdXJyZW50TG9jYXRpb24gfHwgeyBzdGFydDoge30gfSA6IGFyZ3VtZW50c1sxXTtcblxuXHQgICAgaWYgKGNodW5rIGluc3RhbmNlb2YgU291cmNlTm9kZSkge1xuXHQgICAgICByZXR1cm4gY2h1bms7XG5cdCAgICB9XG5cblx0ICAgIGNodW5rID0gY2FzdENodW5rKGNodW5rLCB0aGlzLCBsb2MpO1xuXG5cdCAgICByZXR1cm4gbmV3IFNvdXJjZU5vZGUobG9jLnN0YXJ0LmxpbmUsIGxvYy5zdGFydC5jb2x1bW4sIHRoaXMuc3JjRmlsZSwgY2h1bmspO1xuXHQgIH0sXG5cblx0ICBmdW5jdGlvbkNhbGw6IGZ1bmN0aW9uIGZ1bmN0aW9uQ2FsbChmbiwgdHlwZSwgcGFyYW1zKSB7XG5cdCAgICBwYXJhbXMgPSB0aGlzLmdlbmVyYXRlTGlzdChwYXJhbXMpO1xuXHQgICAgcmV0dXJuIHRoaXMud3JhcChbZm4sIHR5cGUgPyAnLicgKyB0eXBlICsgJygnIDogJygnLCBwYXJhbXMsICcpJ10pO1xuXHQgIH0sXG5cblx0ICBxdW90ZWRTdHJpbmc6IGZ1bmN0aW9uIHF1b3RlZFN0cmluZyhzdHIpIHtcblx0ICAgIHJldHVybiAnXCInICsgKHN0ciArICcnKS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJykucmVwbGFjZSgvXFxyL2csICdcXFxccicpLnJlcGxhY2UoL1xcdTIwMjgvZywgJ1xcXFx1MjAyOCcpIC8vIFBlciBFY21hLTI2MiA3LjMgKyA3LjguNFxuXHQgICAgLnJlcGxhY2UoL1xcdTIwMjkvZywgJ1xcXFx1MjAyOScpICsgJ1wiJztcblx0ICB9LFxuXG5cdCAgb2JqZWN0TGl0ZXJhbDogZnVuY3Rpb24gb2JqZWN0TGl0ZXJhbChvYmopIHtcblx0ICAgIHZhciBwYWlycyA9IFtdO1xuXG5cdCAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdCAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHQgICAgICAgIHZhciB2YWx1ZSA9IGNhc3RDaHVuayhvYmpba2V5XSwgdGhpcyk7XG5cdCAgICAgICAgaWYgKHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgICAgcGFpcnMucHVzaChbdGhpcy5xdW90ZWRTdHJpbmcoa2V5KSwgJzonLCB2YWx1ZV0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICB2YXIgcmV0ID0gdGhpcy5nZW5lcmF0ZUxpc3QocGFpcnMpO1xuXHQgICAgcmV0LnByZXBlbmQoJ3snKTtcblx0ICAgIHJldC5hZGQoJ30nKTtcblx0ICAgIHJldHVybiByZXQ7XG5cdCAgfSxcblxuXHQgIGdlbmVyYXRlTGlzdDogZnVuY3Rpb24gZ2VuZXJhdGVMaXN0KGVudHJpZXMpIHtcblx0ICAgIHZhciByZXQgPSB0aGlzLmVtcHR5KCk7XG5cblx0ICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBlbnRyaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIGlmIChpKSB7XG5cdCAgICAgICAgcmV0LmFkZCgnLCcpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0LmFkZChjYXN0Q2h1bmsoZW50cmllc1tpXSwgdGhpcykpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH0sXG5cblx0ICBnZW5lcmF0ZUFycmF5OiBmdW5jdGlvbiBnZW5lcmF0ZUFycmF5KGVudHJpZXMpIHtcblx0ICAgIHZhciByZXQgPSB0aGlzLmdlbmVyYXRlTGlzdChlbnRyaWVzKTtcblx0ICAgIHJldC5wcmVwZW5kKCdbJyk7XG5cdCAgICByZXQuYWRkKCddJyk7XG5cblx0ICAgIHJldHVybiByZXQ7XG5cdCAgfVxuXHR9O1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IENvZGVHZW47XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KVxuLyoqKioqKi8gXSlcbn0pO1xuOyIsImltcG9ydCBoYnMgZnJvbSAnLi8uLi9iZWhhdmlvcnMvaGJzJztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcmlvbmV0dGUuVmlldy5leHRlbmQoe1xuICAgIHRlbXBsYXRlOiBkYXRhID0+ICdhdXRob3JpemF0aW9uJyxcbiAgICBiZWhhdmlvcnM6IFtoYnNdLFxuICAgIEhCVGVtcGxhdGU6ICd0ZW1wbGF0ZXMvdmlld3MvYXRob3JpemF0aW9uLmhicycsXG4gICAgY2xhc3NOYW1lOiAnYXV0aG9yaXphdGlvbicsXG4gICAgdWk6IHtcbiAgICAgICAgYXV0aG9yaXplOiAnLmF1dGhvcml6YXRpb25fX2J0bicsXG4gICAgICAgIGZvcm1TdWJtaXQ6ICcuYXV0aG9yaXphdGlvbl9fYmxvY2snLFxuICAgICAgICByZWdpc3RlcjogJy5yZWdpc3RyYXRpb25fX2J0bidcbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgQHVpLmF1dGhvcml6ZSc6ICdhdXRob3JpemVVc2VyJyxcbiAgICAgICAgJ3N1Ym1pdCBAdWkuZm9ybVN1Ym1pdCc6ICdhdXRob3JpemVVc2VyJyxcbiAgICAgICAgJ2NsaWNrIEB1aS5yZWdpc3Rlcic6ICdyZWdpc3RlclVzZXInXG4gICAgfSxcbiAgICBhdXRob3JpemVVc2VyOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGVtYWlsID0gdGhpcy4kKCcuZW1haWxfX2lucHV0JykudmFsKCksXG4gICAgICAgICAgICBwYXNzID0gdGhpcy4kKCcucGFzc19faW5wdXQnKS52YWwoKTtcblxuICAgICAgICB2YXIgYXV0aCA9IGZpcmViYXNlLmF1dGgoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBhdXRoLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKGVtYWlsLCBwYXNzKTtcbiAgICAgICAgcHJvbWlzZS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgYWxlcnQoZS5tZXNzYWdlKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIHJlZ2lzdGVyVXNlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZW1haWwgPSB0aGlzLiQoJy5lbWFpbF9faW5wdXQnKS52YWwoKSxcbiAgICAgICAgICAgIHBhc3MgPSB0aGlzLiQoJy5wYXNzX19pbnB1dCcpLnZhbCgpO1xuXG4gICAgICAgIHZhciBhdXRoID0gZmlyZWJhc2UuYXV0aCgpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGF1dGguY3JlYXRlVXNlcldpdGhFbWFpbEFuZFBhc3N3b3JkKGVtYWlsLCBwYXNzKTtcblxuICAgICAgICBwcm9taXNlLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBhbGVydChlLm1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG9uTG9hZFRlbXBsYXRlICgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG59KTsiLCJpbXBvcnQgaGJzIGZyb20gJy4vLi4vYmVoYXZpb3JzL2hicyc7XG5cblxudmFyIFRhc2tNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5nZXQoXCJ0aXRsZVwiKSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoe1widGl0bGVcIjogdGhpcy5kZWZhdWx0cy50aXRsZX0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oYXR0cnMpIHtcbiAgICAgICAgaWYgKCAhJC50cmltKGF0dHJzLnRpdGxlKSApIHtcbiAgICAgICAgICAgIHJldHVybiAn0J7RiNC40LHQutCwISc7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRlZmF1bHRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgdGl0bGU6ICfQndC+0LLQsNGPINC30LDQtNCw0YfQsCcsXG4gICAgICAgICAgICBkb25lOiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcbiAgICB0b2dnbGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNhdmUoeyBkb25lOiF0aGlzLmdldChcImRvbmVcIil9KTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxufSk7XG5cbnZhciBUYXNrID0gTWFyaW9uZXR0ZS5WaWV3LmV4dGVuZCh7XG4gICAgdGVtcGxhdGU6IGRhdGEgPT4gJ21haW4gdmlldycsXG4gICAgYmVoYXZpb3JzOiBbaGJzXSxcbiAgICBIQlRlbXBsYXRlOiAndGVtcGxhdGVzL3ZpZXdzL3RvZG8uaXRlbS5oYnMnLFxuICAgIHRhZ05hbWU6ICdsaScsXG4gICAgY2xhc3NOYW1lOiAndGFza3NfX2l0ZW0nLFxuICAgIHVpOiB7XG4gICAgICAgIFwiZWRpdFwiOiBcIi50YXNrc19fdGV4dFwiLFxuICAgICAgICBcImVkaXRTdHlsZVwiOiBcIi50YXNrc19fdGV4dFwiLFxuICAgICAgICBcInJlbW92ZVwiOiBcIi50YXNrc19fcmVtb3ZlXCIsXG4gICAgICAgIFwidG9nZ2xlXCI6IFwiLnRhc2tzX190b2dnbGVcIlxuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIFwiZm9jdXNvdXQgQHVpLmVkaXRcIjogXCJlZGl0VGFza1wiLFxuICAgICAgICBcImNsaWNrIEB1aS5lZGl0U3R5bGVcIjogXCJlZGl0U3R5bGVzXCIsXG4gICAgICAgIFwiY2xpY2sgQHVpLnRvZ2dsZVwiOiBcInRvZ2dsZURvbmVcIixcbiAgICAgICAgJ2NsaWNrIEB1aS5yZW1vdmUnOiAncmVtb3ZlTW9kZWwnXG4gICAgfSxcbiAgICB0cmlnZ2Vyczoge1xuICAgICAgICAnY2xpY2sgQHVpLnJlbW92ZSc6ICdyZW1vdmU6bW9kZWwnXG4gICAgfSxcbiAgICBlZGl0U3R5bGVzOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgJChldmVudC5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnZWRpdCcpXG4gICAgfSxcbiAgICByZW1vdmVNb2RlbDogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICB0aGlzLm1vZGVsLmNsZWFyKCk7XG4gICAgfSxcbiAgICBvblJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJGVsLnRvZ2dsZUNsYXNzKCdkb25lJywgdGhpcy5tb2RlbC5nZXQoJ2RvbmUnKSk7XG4gICAgfSxcbiAgICBlZGl0VGFzazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIG5ld1Rhc2tUaXRsZSA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkudGV4dCgpO1xuICAgICAgICBpZiAobmV3VGFza1RpdGxlID09PSAnJykge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5jbGVhcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zYXZlKHtcInRpdGxlXCI6IF8uZXNjYXBlKG5ld1Rhc2tUaXRsZSl9LHt2YWxpZGF0ZTp0cnVlfSk777u/XG4gICAgICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnJlbW92ZUNsYXNzKCdlZGl0JylcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICB0b2dnbGVEb25lOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB0aGlzLm1vZGVsLnRvZ2dsZSgpO1xuICAgIH0sXG4gICAgb25Mb2FkVGVtcGxhdGUgKCkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgfVxufSk7XG5cbnZhciBUYXNrQ29sbGVjdGlvblZpZXcgPSBNYXJpb25ldHRlLkNvbGxlY3Rpb25WaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogJ3VsJyxcbiAgICBjbGFzc05hbWU6ICd0YXNrc19fbGlzdCcsXG4gICAgY2hpbGRWaWV3OiBUYXNrLFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5vbignY2hhbmdlJywgXy5iaW5kKHRoaXMucmVuZGVyLCB0aGlzKSk7XG4gICAgfSxcbiAgICBvbkNoaWxkdmlld1JlbW92ZU1vZGVsOiBmdW5jdGlvbiAodmlldykge1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb24ucmVtb3ZlKHZpZXcubW9kZWwpO1xuICAgIH0sXG4gICAgdmlld0NvbXBhcmF0b3I6IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgIHJldHVybiBtb2RlbC5nZXQoJ2RvbmUnKVxuICAgIH1cbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFyaW9uZXR0ZS5WaWV3LmV4dGVuZCh7XG4gICAgdGVtcGxhdGU6IGRhdGEgPT4gJ25ld3MgaXRlbScsXG4gICAgYmVoYXZpb3JzOiBbaGJzXSxcbiAgICBIQlRlbXBsYXRlOiAndGVtcGxhdGVzL3ZpZXdzL2N1cnJlbnQudXNlci5oYnMnLFxuICAgIGNsYXNzTmFtZTogJ2NvbnRhaW5lcicsXG4gICAgcmVnaW9uczoge1xuICAgICAgICBsaXN0OiB7XG4gICAgICAgICAgICBlbDogJy51c2VyX190YXNrcydcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdWk6IHtcbiAgICAgICAgbG9nT3V0OiAnLmxvZ291dF9fYnRuJyxcbiAgICAgICAgYWRkdGFzazogJy51c2VyX19hZGR0YXNrJ1xuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayBAdWkubG9nT3V0JzogJ2xvZ091dCcsXG4gICAgICAgICdjbGljayBAdWkuYWRkdGFzayc6ICdhZGRUYXNrJ1xuICAgIH0sXG4gICAgYWRkVGFzazogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciAkaW5wdXQgPSAkKCcudXNlcl9fdGFzaycpO1xuICAgICAgICB2YXIgbmV3VGFza1RpdGxlID0gJGlucHV0LnZhbCgpO1xuICAgICAgICBuZXdUYXNrVGl0bGUgPSBfLmVzY2FwZShuZXdUYXNrVGl0bGUpO1xuICAgICAgICAkaW5wdXQudmFsKCcnKTtcbiAgICAgICAgaWYgKCFuZXdUYXNrVGl0bGUpIHJldHVybjtcbiAgICAgICAgaWYgKG5ld1Rhc2tUaXRsZS5sZW5ndGggPiAxMDApIHJldHVybjtcbiAgICAgICAgdGhpcy50YXNrc0NvbGxlY3Rpb24uYWRkKHt0aXRsZTogbmV3VGFza1RpdGxlfSk7XG4gICAgfSxcbiAgICBsb2dPdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZmlyZWJhc2UuYXV0aCgpLnNpZ25PdXQoKVxuICAgIH0sXG4gICAgaW5pdFVzZXJMaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbWFpbCA9IGZpcmViYXNlLmF1dGgoKS5jdXJyZW50VXNlci5lbWFpbDtcbiAgICAgICAgdmFyIHVzZXJOaWNrbmFtZSA9IGVtYWlsLnN1YnN0cmluZygwLCBlbWFpbC5pbmRleE9mKCdAJykpO1xuXG4gICAgICAgICQoJy51c2VyX19uYW1lJykudGV4dChlbWFpbCk7XG4gICAgICAgIHZhciBUYXNrc0NvbGxlY3Rpb24gPSBCYWNrYm9uZS5GaXJlYmFzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgICAgICAgICBtb2RlbDogVGFza01vZGVsLFxuICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9tYXJpb25ldHRlLXRvZG8tYXBwLmZpcmViYXNlaW8uY29tL1VzZXJzLycrIHVzZXJOaWNrbmFtZSArJydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50YXNrc0NvbGxlY3Rpb24gPSBuZXcgVGFza3NDb2xsZWN0aW9uKCk7XG4gICAgICAgIHRoaXMudGFza0NvbGxlY3Rpb25WaWV3ID0gbmV3IFRhc2tDb2xsZWN0aW9uVmlldyh7XG4gICAgICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLnRhc2tzQ29sbGVjdGlvblxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNob3dDaGlsZFZpZXcoJ2xpc3QnLCB0aGlzLnRhc2tDb2xsZWN0aW9uVmlldyk7XG4gICAgfSxcbiAgICBvbkxvYWRUZW1wbGF0ZSAoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICAgICAgdGhpcy5pbml0VXNlckxpc3QoKTtcbiAgICB9XG59KSIsImltcG9ydCBoYnMgZnJvbSAnLi8uLi9iZWhhdmlvcnMvaGJzJztcblxuY29uc3QgY29uZmlnID0ge1xuICAgIGFwaUtleTogXCJBSXphU3lCRjJoRUJNYkdLZVFNM2prbkZzdEFOMFc2ZUI3TzN5Mk1cIixcbiAgICBhdXRoRG9tYWluOiBcIm1hcmlvbmV0dGUtdG9kby1hcHAuZmlyZWJhc2VhcHAuY29tXCIsXG4gICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9tYXJpb25ldHRlLXRvZG8tYXBwLmZpcmViYXNlaW8uY29tXCIsXG4gICAgcHJvamVjdElkOiBcIm1hcmlvbmV0dGUtdG9kby1hcHBcIixcbiAgICBzdG9yYWdlQnVja2V0OiBcIm1hcmlvbmV0dGUtdG9kby1hcHAuYXBwc3BvdC5jb21cIixcbiAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCIyNjkwMzA2Mjc3NzZcIlxufTtcbmZpcmViYXNlLmluaXRpYWxpemVBcHAoY29uZmlnKTtcblxuY29uc3QgUEFHRVMgPSB7XG4gICAgYXRob3JpemF0aW9uOiByZXF1aXJlKCcuL2F0aG9yaXphdGlvbicpLFxuICAgIHVzZXI6IHJlcXVpcmUoJy4vY3VycmVudC51c2VyJylcbn07XG5cbmV4cG9ydCBkZWZhdWx0ICBNYXJpb25ldHRlLlZpZXcuZXh0ZW5kKHtcbiAgICB0ZW1wbGF0ZTogZGF0YSA9PiAnbWFpbiB2aWV3JyxcbiAgICBiZWhhdmlvcnM6IFtoYnNdLFxuICAgIEhCVGVtcGxhdGU6ICd0ZW1wbGF0ZXMvbGF5b3V0LmhicycsXG4gICAgY2xhc3NOYW1lOiAnbWFpbi1hcHAnLFxuICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgYXBwOiB7XG4gICAgICAgICAgICBlbDogJy50b2RvX19jb250ZW50JyxcbiAgICAgICAgICAgIHJlcGxhY2VFbGVtZW50OiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjaGVja0F1dGg6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBmaXJlYmFzZS5hdXRoKCkub25BdXRoU3RhdGVDaGFuZ2VkKGZ1bmN0aW9uIChmaXJlYmFzZVVzZXIpIHtcbiAgICAgICAgICAgIGlmIChmaXJlYmFzZVVzZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVXNlciBsb2dnZWQgSW4nKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93Q2hpbGRWaWV3KCdhcHAnLCBuZXcgUEFHRVMudXNlcilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vdCBsb2dnZWQgSW4nKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93Q2hpbGRWaWV3KCdhcHAnLCBuZXcgUEFHRVMuYXRob3JpemF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBvbkxvYWRUZW1wbGF0ZSAoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIHRoaXMuY2hlY2tBdXRoKCk7XG4gICAgfVxufSk7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBIGRhdGEgc3RydWN0dXJlIHdoaWNoIGlzIGEgY29tYmluYXRpb24gb2YgYW4gYXJyYXkgYW5kIGEgc2V0LiBBZGRpbmcgYSBuZXdcbiAqIG1lbWJlciBpcyBPKDEpLCB0ZXN0aW5nIGZvciBtZW1iZXJzaGlwIGlzIE8oMSksIGFuZCBmaW5kaW5nIHRoZSBpbmRleCBvZiBhblxuICogZWxlbWVudCBpcyBPKDEpLiBSZW1vdmluZyBlbGVtZW50cyBmcm9tIHRoZSBzZXQgaXMgbm90IHN1cHBvcnRlZC4gT25seVxuICogc3RyaW5ncyBhcmUgc3VwcG9ydGVkIGZvciBtZW1iZXJzaGlwLlxuICovXG5mdW5jdGlvbiBBcnJheVNldCgpIHtcbiAgdGhpcy5fYXJyYXkgPSBbXTtcbiAgdGhpcy5fc2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cblxuLyoqXG4gKiBTdGF0aWMgbWV0aG9kIGZvciBjcmVhdGluZyBBcnJheVNldCBpbnN0YW5jZXMgZnJvbSBhbiBleGlzdGluZyBhcnJheS5cbiAqL1xuQXJyYXlTZXQuZnJvbUFycmF5ID0gZnVuY3Rpb24gQXJyYXlTZXRfZnJvbUFycmF5KGFBcnJheSwgYUFsbG93RHVwbGljYXRlcykge1xuICB2YXIgc2V0ID0gbmV3IEFycmF5U2V0KCk7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhQXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBzZXQuYWRkKGFBcnJheVtpXSwgYUFsbG93RHVwbGljYXRlcyk7XG4gIH1cbiAgcmV0dXJuIHNldDtcbn07XG5cbi8qKlxuICogUmV0dXJuIGhvdyBtYW55IHVuaXF1ZSBpdGVtcyBhcmUgaW4gdGhpcyBBcnJheVNldC4gSWYgZHVwbGljYXRlcyBoYXZlIGJlZW5cbiAqIGFkZGVkLCB0aGFuIHRob3NlIGRvIG5vdCBjb3VudCB0b3dhcmRzIHRoZSBzaXplLlxuICpcbiAqIEByZXR1cm5zIE51bWJlclxuICovXG5BcnJheVNldC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uIEFycmF5U2V0X3NpemUoKSB7XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLl9zZXQpLmxlbmd0aDtcbn07XG5cbi8qKlxuICogQWRkIHRoZSBnaXZlbiBzdHJpbmcgdG8gdGhpcyBzZXQuXG4gKlxuICogQHBhcmFtIFN0cmluZyBhU3RyXG4gKi9cbkFycmF5U2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBBcnJheVNldF9hZGQoYVN0ciwgYUFsbG93RHVwbGljYXRlcykge1xuICB2YXIgc1N0ciA9IHV0aWwudG9TZXRTdHJpbmcoYVN0cik7XG4gIHZhciBpc0R1cGxpY2F0ZSA9IGhhcy5jYWxsKHRoaXMuX3NldCwgc1N0cik7XG4gIHZhciBpZHggPSB0aGlzLl9hcnJheS5sZW5ndGg7XG4gIGlmICghaXNEdXBsaWNhdGUgfHwgYUFsbG93RHVwbGljYXRlcykge1xuICAgIHRoaXMuX2FycmF5LnB1c2goYVN0cik7XG4gIH1cbiAgaWYgKCFpc0R1cGxpY2F0ZSkge1xuICAgIHRoaXMuX3NldFtzU3RyXSA9IGlkeDtcbiAgfVxufTtcblxuLyoqXG4gKiBJcyB0aGUgZ2l2ZW4gc3RyaW5nIGEgbWVtYmVyIG9mIHRoaXMgc2V0P1xuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5BcnJheVNldC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gQXJyYXlTZXRfaGFzKGFTdHIpIHtcbiAgdmFyIHNTdHIgPSB1dGlsLnRvU2V0U3RyaW5nKGFTdHIpO1xuICByZXR1cm4gaGFzLmNhbGwodGhpcy5fc2V0LCBzU3RyKTtcbn07XG5cbi8qKlxuICogV2hhdCBpcyB0aGUgaW5kZXggb2YgdGhlIGdpdmVuIHN0cmluZyBpbiB0aGUgYXJyYXk/XG4gKlxuICogQHBhcmFtIFN0cmluZyBhU3RyXG4gKi9cbkFycmF5U2V0LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gQXJyYXlTZXRfaW5kZXhPZihhU3RyKSB7XG4gIHZhciBzU3RyID0gdXRpbC50b1NldFN0cmluZyhhU3RyKTtcbiAgaWYgKGhhcy5jYWxsKHRoaXMuX3NldCwgc1N0cikpIHtcbiAgICByZXR1cm4gdGhpcy5fc2V0W3NTdHJdO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignXCInICsgYVN0ciArICdcIiBpcyBub3QgaW4gdGhlIHNldC4nKTtcbn07XG5cbi8qKlxuICogV2hhdCBpcyB0aGUgZWxlbWVudCBhdCB0aGUgZ2l2ZW4gaW5kZXg/XG4gKlxuICogQHBhcmFtIE51bWJlciBhSWR4XG4gKi9cbkFycmF5U2V0LnByb3RvdHlwZS5hdCA9IGZ1bmN0aW9uIEFycmF5U2V0X2F0KGFJZHgpIHtcbiAgaWYgKGFJZHggPj0gMCAmJiBhSWR4IDwgdGhpcy5fYXJyYXkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FycmF5W2FJZHhdO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignTm8gZWxlbWVudCBpbmRleGVkIGJ5ICcgKyBhSWR4KTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYXJyYXkgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBzZXQgKHdoaWNoIGhhcyB0aGUgcHJvcGVyIGluZGljZXNcbiAqIGluZGljYXRlZCBieSBpbmRleE9mKS4gTm90ZSB0aGF0IHRoaXMgaXMgYSBjb3B5IG9mIHRoZSBpbnRlcm5hbCBhcnJheSB1c2VkXG4gKiBmb3Igc3RvcmluZyB0aGUgbWVtYmVycyBzbyB0aGF0IG5vIG9uZSBjYW4gbWVzcyB3aXRoIGludGVybmFsIHN0YXRlLlxuICovXG5BcnJheVNldC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIEFycmF5U2V0X3RvQXJyYXkoKSB7XG4gIHJldHVybiB0aGlzLl9hcnJheS5zbGljZSgpO1xufTtcblxuZXhwb3J0cy5BcnJheVNldCA9IEFycmF5U2V0O1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqXG4gKiBCYXNlZCBvbiB0aGUgQmFzZSA2NCBWTFEgaW1wbGVtZW50YXRpb24gaW4gQ2xvc3VyZSBDb21waWxlcjpcbiAqIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2xvc3VyZS1jb21waWxlci9zb3VyY2UvYnJvd3NlL3RydW5rL3NyYy9jb20vZ29vZ2xlL2RlYnVnZ2luZy9zb3VyY2VtYXAvQmFzZTY0VkxRLmphdmFcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSBUaGUgQ2xvc3VyZSBDb21waWxlciBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlXG4gKiBtZXQ6XG4gKlxuICogICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAqICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmVcbiAqICAgIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nXG4gKiAgICBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWRcbiAqICAgIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqICAqIE5laXRoZXIgdGhlIG5hbWUgb2YgR29vZ2xlIEluYy4gbm9yIHRoZSBuYW1lcyBvZiBpdHNcbiAqICAgIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZFxuICogICAgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcbiAqIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUlxuICogQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFRcbiAqIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLFxuICogU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVFxuICogTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsXG4gKiBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTllcbiAqIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAqIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRVxuICogT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnLi9iYXNlNjQnKTtcblxuLy8gQSBzaW5nbGUgYmFzZSA2NCBkaWdpdCBjYW4gY29udGFpbiA2IGJpdHMgb2YgZGF0YS4gRm9yIHRoZSBiYXNlIDY0IHZhcmlhYmxlXG4vLyBsZW5ndGggcXVhbnRpdGllcyB3ZSB1c2UgaW4gdGhlIHNvdXJjZSBtYXAgc3BlYywgdGhlIGZpcnN0IGJpdCBpcyB0aGUgc2lnbixcbi8vIHRoZSBuZXh0IGZvdXIgYml0cyBhcmUgdGhlIGFjdHVhbCB2YWx1ZSwgYW5kIHRoZSA2dGggYml0IGlzIHRoZVxuLy8gY29udGludWF0aW9uIGJpdC4gVGhlIGNvbnRpbnVhdGlvbiBiaXQgdGVsbHMgdXMgd2hldGhlciB0aGVyZSBhcmUgbW9yZVxuLy8gZGlnaXRzIGluIHRoaXMgdmFsdWUgZm9sbG93aW5nIHRoaXMgZGlnaXQuXG4vL1xuLy8gICBDb250aW51YXRpb25cbi8vICAgfCAgICBTaWduXG4vLyAgIHwgICAgfFxuLy8gICBWICAgIFZcbi8vICAgMTAxMDExXG5cbnZhciBWTFFfQkFTRV9TSElGVCA9IDU7XG5cbi8vIGJpbmFyeTogMTAwMDAwXG52YXIgVkxRX0JBU0UgPSAxIDw8IFZMUV9CQVNFX1NISUZUO1xuXG4vLyBiaW5hcnk6IDAxMTExMVxudmFyIFZMUV9CQVNFX01BU0sgPSBWTFFfQkFTRSAtIDE7XG5cbi8vIGJpbmFyeTogMTAwMDAwXG52YXIgVkxRX0NPTlRJTlVBVElPTl9CSVQgPSBWTFFfQkFTRTtcblxuLyoqXG4gKiBDb252ZXJ0cyBmcm9tIGEgdHdvLWNvbXBsZW1lbnQgdmFsdWUgdG8gYSB2YWx1ZSB3aGVyZSB0aGUgc2lnbiBiaXQgaXNcbiAqIHBsYWNlZCBpbiB0aGUgbGVhc3Qgc2lnbmlmaWNhbnQgYml0LiAgRm9yIGV4YW1wbGUsIGFzIGRlY2ltYWxzOlxuICogICAxIGJlY29tZXMgMiAoMTAgYmluYXJ5KSwgLTEgYmVjb21lcyAzICgxMSBiaW5hcnkpXG4gKiAgIDIgYmVjb21lcyA0ICgxMDAgYmluYXJ5KSwgLTIgYmVjb21lcyA1ICgxMDEgYmluYXJ5KVxuICovXG5mdW5jdGlvbiB0b1ZMUVNpZ25lZChhVmFsdWUpIHtcbiAgcmV0dXJuIGFWYWx1ZSA8IDBcbiAgICA/ICgoLWFWYWx1ZSkgPDwgMSkgKyAxXG4gICAgOiAoYVZhbHVlIDw8IDEpICsgMDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyB0byBhIHR3by1jb21wbGVtZW50IHZhbHVlIGZyb20gYSB2YWx1ZSB3aGVyZSB0aGUgc2lnbiBiaXQgaXNcbiAqIHBsYWNlZCBpbiB0aGUgbGVhc3Qgc2lnbmlmaWNhbnQgYml0LiAgRm9yIGV4YW1wbGUsIGFzIGRlY2ltYWxzOlxuICogICAyICgxMCBiaW5hcnkpIGJlY29tZXMgMSwgMyAoMTEgYmluYXJ5KSBiZWNvbWVzIC0xXG4gKiAgIDQgKDEwMCBiaW5hcnkpIGJlY29tZXMgMiwgNSAoMTAxIGJpbmFyeSkgYmVjb21lcyAtMlxuICovXG5mdW5jdGlvbiBmcm9tVkxRU2lnbmVkKGFWYWx1ZSkge1xuICB2YXIgaXNOZWdhdGl2ZSA9IChhVmFsdWUgJiAxKSA9PT0gMTtcbiAgdmFyIHNoaWZ0ZWQgPSBhVmFsdWUgPj4gMTtcbiAgcmV0dXJuIGlzTmVnYXRpdmVcbiAgICA/IC1zaGlmdGVkXG4gICAgOiBzaGlmdGVkO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGJhc2UgNjQgVkxRIGVuY29kZWQgdmFsdWUuXG4gKi9cbmV4cG9ydHMuZW5jb2RlID0gZnVuY3Rpb24gYmFzZTY0VkxRX2VuY29kZShhVmFsdWUpIHtcbiAgdmFyIGVuY29kZWQgPSBcIlwiO1xuICB2YXIgZGlnaXQ7XG5cbiAgdmFyIHZscSA9IHRvVkxRU2lnbmVkKGFWYWx1ZSk7XG5cbiAgZG8ge1xuICAgIGRpZ2l0ID0gdmxxICYgVkxRX0JBU0VfTUFTSztcbiAgICB2bHEgPj4+PSBWTFFfQkFTRV9TSElGVDtcbiAgICBpZiAodmxxID4gMCkge1xuICAgICAgLy8gVGhlcmUgYXJlIHN0aWxsIG1vcmUgZGlnaXRzIGluIHRoaXMgdmFsdWUsIHNvIHdlIG11c3QgbWFrZSBzdXJlIHRoZVxuICAgICAgLy8gY29udGludWF0aW9uIGJpdCBpcyBtYXJrZWQuXG4gICAgICBkaWdpdCB8PSBWTFFfQ09OVElOVUFUSU9OX0JJVDtcbiAgICB9XG4gICAgZW5jb2RlZCArPSBiYXNlNjQuZW5jb2RlKGRpZ2l0KTtcbiAgfSB3aGlsZSAodmxxID4gMCk7XG5cbiAgcmV0dXJuIGVuY29kZWQ7XG59O1xuXG4vKipcbiAqIERlY29kZXMgdGhlIG5leHQgYmFzZSA2NCBWTFEgdmFsdWUgZnJvbSB0aGUgZ2l2ZW4gc3RyaW5nIGFuZCByZXR1cm5zIHRoZVxuICogdmFsdWUgYW5kIHRoZSByZXN0IG9mIHRoZSBzdHJpbmcgdmlhIHRoZSBvdXQgcGFyYW1ldGVyLlxuICovXG5leHBvcnRzLmRlY29kZSA9IGZ1bmN0aW9uIGJhc2U2NFZMUV9kZWNvZGUoYVN0ciwgYUluZGV4LCBhT3V0UGFyYW0pIHtcbiAgdmFyIHN0ckxlbiA9IGFTdHIubGVuZ3RoO1xuICB2YXIgcmVzdWx0ID0gMDtcbiAgdmFyIHNoaWZ0ID0gMDtcbiAgdmFyIGNvbnRpbnVhdGlvbiwgZGlnaXQ7XG5cbiAgZG8ge1xuICAgIGlmIChhSW5kZXggPj0gc3RyTGVuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBtb3JlIGRpZ2l0cyBpbiBiYXNlIDY0IFZMUSB2YWx1ZS5cIik7XG4gICAgfVxuXG4gICAgZGlnaXQgPSBiYXNlNjQuZGVjb2RlKGFTdHIuY2hhckNvZGVBdChhSW5kZXgrKykpO1xuICAgIGlmIChkaWdpdCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYmFzZTY0IGRpZ2l0OiBcIiArIGFTdHIuY2hhckF0KGFJbmRleCAtIDEpKTtcbiAgICB9XG5cbiAgICBjb250aW51YXRpb24gPSAhIShkaWdpdCAmIFZMUV9DT05USU5VQVRJT05fQklUKTtcbiAgICBkaWdpdCAmPSBWTFFfQkFTRV9NQVNLO1xuICAgIHJlc3VsdCA9IHJlc3VsdCArIChkaWdpdCA8PCBzaGlmdCk7XG4gICAgc2hpZnQgKz0gVkxRX0JBU0VfU0hJRlQ7XG4gIH0gd2hpbGUgKGNvbnRpbnVhdGlvbik7XG5cbiAgYU91dFBhcmFtLnZhbHVlID0gZnJvbVZMUVNpZ25lZChyZXN1bHQpO1xuICBhT3V0UGFyYW0ucmVzdCA9IGFJbmRleDtcbn07XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciBpbnRUb0NoYXJNYXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLycuc3BsaXQoJycpO1xuXG4vKipcbiAqIEVuY29kZSBhbiBpbnRlZ2VyIGluIHRoZSByYW5nZSBvZiAwIHRvIDYzIHRvIGEgc2luZ2xlIGJhc2UgNjQgZGlnaXQuXG4gKi9cbmV4cG9ydHMuZW5jb2RlID0gZnVuY3Rpb24gKG51bWJlcikge1xuICBpZiAoMCA8PSBudW1iZXIgJiYgbnVtYmVyIDwgaW50VG9DaGFyTWFwLmxlbmd0aCkge1xuICAgIHJldHVybiBpbnRUb0NoYXJNYXBbbnVtYmVyXTtcbiAgfVxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiTXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDYzOiBcIiArIG51bWJlcik7XG59O1xuXG4vKipcbiAqIERlY29kZSBhIHNpbmdsZSBiYXNlIDY0IGNoYXJhY3RlciBjb2RlIGRpZ2l0IHRvIGFuIGludGVnZXIuIFJldHVybnMgLTEgb25cbiAqIGZhaWx1cmUuXG4gKi9cbmV4cG9ydHMuZGVjb2RlID0gZnVuY3Rpb24gKGNoYXJDb2RlKSB7XG4gIHZhciBiaWdBID0gNjU7ICAgICAvLyAnQSdcbiAgdmFyIGJpZ1ogPSA5MDsgICAgIC8vICdaJ1xuXG4gIHZhciBsaXR0bGVBID0gOTc7ICAvLyAnYSdcbiAgdmFyIGxpdHRsZVogPSAxMjI7IC8vICd6J1xuXG4gIHZhciB6ZXJvID0gNDg7ICAgICAvLyAnMCdcbiAgdmFyIG5pbmUgPSA1NzsgICAgIC8vICc5J1xuXG4gIHZhciBwbHVzID0gNDM7ICAgICAvLyAnKydcbiAgdmFyIHNsYXNoID0gNDc7ICAgIC8vICcvJ1xuXG4gIHZhciBsaXR0bGVPZmZzZXQgPSAyNjtcbiAgdmFyIG51bWJlck9mZnNldCA9IDUyO1xuXG4gIC8vIDAgLSAyNTogQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcbiAgaWYgKGJpZ0EgPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPD0gYmlnWikge1xuICAgIHJldHVybiAoY2hhckNvZGUgLSBiaWdBKTtcbiAgfVxuXG4gIC8vIDI2IC0gNTE6IGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XG4gIGlmIChsaXR0bGVBIDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDw9IGxpdHRsZVopIHtcbiAgICByZXR1cm4gKGNoYXJDb2RlIC0gbGl0dGxlQSArIGxpdHRsZU9mZnNldCk7XG4gIH1cblxuICAvLyA1MiAtIDYxOiAwMTIzNDU2Nzg5XG4gIGlmICh6ZXJvIDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDw9IG5pbmUpIHtcbiAgICByZXR1cm4gKGNoYXJDb2RlIC0gemVybyArIG51bWJlck9mZnNldCk7XG4gIH1cblxuICAvLyA2MjogK1xuICBpZiAoY2hhckNvZGUgPT0gcGx1cykge1xuICAgIHJldHVybiA2MjtcbiAgfVxuXG4gIC8vIDYzOiAvXG4gIGlmIChjaGFyQ29kZSA9PSBzbGFzaCkge1xuICAgIHJldHVybiA2MztcbiAgfVxuXG4gIC8vIEludmFsaWQgYmFzZTY0IGRpZ2l0LlxuICByZXR1cm4gLTE7XG59O1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG5leHBvcnRzLkdSRUFURVNUX0xPV0VSX0JPVU5EID0gMTtcbmV4cG9ydHMuTEVBU1RfVVBQRVJfQk9VTkQgPSAyO1xuXG4vKipcbiAqIFJlY3Vyc2l2ZSBpbXBsZW1lbnRhdGlvbiBvZiBiaW5hcnkgc2VhcmNoLlxuICpcbiAqIEBwYXJhbSBhTG93IEluZGljZXMgaGVyZSBhbmQgbG93ZXIgZG8gbm90IGNvbnRhaW4gdGhlIG5lZWRsZS5cbiAqIEBwYXJhbSBhSGlnaCBJbmRpY2VzIGhlcmUgYW5kIGhpZ2hlciBkbyBub3QgY29udGFpbiB0aGUgbmVlZGxlLlxuICogQHBhcmFtIGFOZWVkbGUgVGhlIGVsZW1lbnQgYmVpbmcgc2VhcmNoZWQgZm9yLlxuICogQHBhcmFtIGFIYXlzdGFjayBUaGUgbm9uLWVtcHR5IGFycmF5IGJlaW5nIHNlYXJjaGVkLlxuICogQHBhcmFtIGFDb21wYXJlIEZ1bmN0aW9uIHdoaWNoIHRha2VzIHR3byBlbGVtZW50cyBhbmQgcmV0dXJucyAtMSwgMCwgb3IgMS5cbiAqIEBwYXJhbSBhQmlhcyBFaXRoZXIgJ2JpbmFyeVNlYXJjaC5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnYmluYXJ5U2VhcmNoLkxFQVNUX1VQUEVSX0JPVU5EJy4gU3BlY2lmaWVzIHdoZXRoZXIgdG8gcmV0dXJuIHRoZVxuICogICAgIGNsb3Nlc3QgZWxlbWVudCB0aGF0IGlzIHNtYWxsZXIgdGhhbiBvciBncmVhdGVyIHRoYW4gdGhlIG9uZSB3ZSBhcmVcbiAqICAgICBzZWFyY2hpbmcgZm9yLCByZXNwZWN0aXZlbHksIGlmIHRoZSBleGFjdCBlbGVtZW50IGNhbm5vdCBiZSBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gcmVjdXJzaXZlU2VhcmNoKGFMb3csIGFIaWdoLCBhTmVlZGxlLCBhSGF5c3RhY2ssIGFDb21wYXJlLCBhQmlhcykge1xuICAvLyBUaGlzIGZ1bmN0aW9uIHRlcm1pbmF0ZXMgd2hlbiBvbmUgb2YgdGhlIGZvbGxvd2luZyBpcyB0cnVlOlxuICAvL1xuICAvLyAgIDEuIFdlIGZpbmQgdGhlIGV4YWN0IGVsZW1lbnQgd2UgYXJlIGxvb2tpbmcgZm9yLlxuICAvL1xuICAvLyAgIDIuIFdlIGRpZCBub3QgZmluZCB0aGUgZXhhY3QgZWxlbWVudCwgYnV0IHdlIGNhbiByZXR1cm4gdGhlIGluZGV4IG9mXG4gIC8vICAgICAgdGhlIG5leHQtY2xvc2VzdCBlbGVtZW50LlxuICAvL1xuICAvLyAgIDMuIFdlIGRpZCBub3QgZmluZCB0aGUgZXhhY3QgZWxlbWVudCwgYW5kIHRoZXJlIGlzIG5vIG5leHQtY2xvc2VzdFxuICAvLyAgICAgIGVsZW1lbnQgdGhhbiB0aGUgb25lIHdlIGFyZSBzZWFyY2hpbmcgZm9yLCBzbyB3ZSByZXR1cm4gLTEuXG4gIHZhciBtaWQgPSBNYXRoLmZsb29yKChhSGlnaCAtIGFMb3cpIC8gMikgKyBhTG93O1xuICB2YXIgY21wID0gYUNvbXBhcmUoYU5lZWRsZSwgYUhheXN0YWNrW21pZF0sIHRydWUpO1xuICBpZiAoY21wID09PSAwKSB7XG4gICAgLy8gRm91bmQgdGhlIGVsZW1lbnQgd2UgYXJlIGxvb2tpbmcgZm9yLlxuICAgIHJldHVybiBtaWQ7XG4gIH1cbiAgZWxzZSBpZiAoY21wID4gMCkge1xuICAgIC8vIE91ciBuZWVkbGUgaXMgZ3JlYXRlciB0aGFuIGFIYXlzdGFja1ttaWRdLlxuICAgIGlmIChhSGlnaCAtIG1pZCA+IDEpIHtcbiAgICAgIC8vIFRoZSBlbGVtZW50IGlzIGluIHRoZSB1cHBlciBoYWxmLlxuICAgICAgcmV0dXJuIHJlY3Vyc2l2ZVNlYXJjaChtaWQsIGFIaWdoLCBhTmVlZGxlLCBhSGF5c3RhY2ssIGFDb21wYXJlLCBhQmlhcyk7XG4gICAgfVxuXG4gICAgLy8gVGhlIGV4YWN0IG5lZWRsZSBlbGVtZW50IHdhcyBub3QgZm91bmQgaW4gdGhpcyBoYXlzdGFjay4gRGV0ZXJtaW5lIGlmXG4gICAgLy8gd2UgYXJlIGluIHRlcm1pbmF0aW9uIGNhc2UgKDMpIG9yICgyKSBhbmQgcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSB0aGluZy5cbiAgICBpZiAoYUJpYXMgPT0gZXhwb3J0cy5MRUFTVF9VUFBFUl9CT1VORCkge1xuICAgICAgcmV0dXJuIGFIaWdoIDwgYUhheXN0YWNrLmxlbmd0aCA/IGFIaWdoIDogLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtaWQ7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIC8vIE91ciBuZWVkbGUgaXMgbGVzcyB0aGFuIGFIYXlzdGFja1ttaWRdLlxuICAgIGlmIChtaWQgLSBhTG93ID4gMSkge1xuICAgICAgLy8gVGhlIGVsZW1lbnQgaXMgaW4gdGhlIGxvd2VyIGhhbGYuXG4gICAgICByZXR1cm4gcmVjdXJzaXZlU2VhcmNoKGFMb3csIG1pZCwgYU5lZWRsZSwgYUhheXN0YWNrLCBhQ29tcGFyZSwgYUJpYXMpO1xuICAgIH1cblxuICAgIC8vIHdlIGFyZSBpbiB0ZXJtaW5hdGlvbiBjYXNlICgzKSBvciAoMikgYW5kIHJldHVybiB0aGUgYXBwcm9wcmlhdGUgdGhpbmcuXG4gICAgaWYgKGFCaWFzID09IGV4cG9ydHMuTEVBU1RfVVBQRVJfQk9VTkQpIHtcbiAgICAgIHJldHVybiBtaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhTG93IDwgMCA/IC0xIDogYUxvdztcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIGJpbmFyeSBzZWFyY2ggd2hpY2ggd2lsbCBhbHdheXMgdHJ5IGFuZCByZXR1cm5cbiAqIHRoZSBpbmRleCBvZiB0aGUgY2xvc2VzdCBlbGVtZW50IGlmIHRoZXJlIGlzIG5vIGV4YWN0IGhpdC4gVGhpcyBpcyBiZWNhdXNlXG4gKiBtYXBwaW5ncyBiZXR3ZWVuIG9yaWdpbmFsIGFuZCBnZW5lcmF0ZWQgbGluZS9jb2wgcGFpcnMgYXJlIHNpbmdsZSBwb2ludHMsXG4gKiBhbmQgdGhlcmUgaXMgYW4gaW1wbGljaXQgcmVnaW9uIGJldHdlZW4gZWFjaCBvZiB0aGVtLCBzbyBhIG1pc3MganVzdCBtZWFuc1xuICogdGhhdCB5b3UgYXJlbid0IG9uIHRoZSB2ZXJ5IHN0YXJ0IG9mIGEgcmVnaW9uLlxuICpcbiAqIEBwYXJhbSBhTmVlZGxlIFRoZSBlbGVtZW50IHlvdSBhcmUgbG9va2luZyBmb3IuXG4gKiBAcGFyYW0gYUhheXN0YWNrIFRoZSBhcnJheSB0aGF0IGlzIGJlaW5nIHNlYXJjaGVkLlxuICogQHBhcmFtIGFDb21wYXJlIEEgZnVuY3Rpb24gd2hpY2ggdGFrZXMgdGhlIG5lZWRsZSBhbmQgYW4gZWxlbWVudCBpbiB0aGVcbiAqICAgICBhcnJheSBhbmQgcmV0dXJucyAtMSwgMCwgb3IgMSBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgbmVlZGxlIGlzIGxlc3NcbiAqICAgICB0aGFuLCBlcXVhbCB0bywgb3IgZ3JlYXRlciB0aGFuIHRoZSBlbGVtZW50LCByZXNwZWN0aXZlbHkuXG4gKiBAcGFyYW0gYUJpYXMgRWl0aGVyICdiaW5hcnlTZWFyY2guR1JFQVRFU1RfTE9XRVJfQk9VTkQnIG9yXG4gKiAgICAgJ2JpbmFyeVNlYXJjaC5MRUFTVF9VUFBFUl9CT1VORCcuIFNwZWNpZmllcyB3aGV0aGVyIHRvIHJldHVybiB0aGVcbiAqICAgICBjbG9zZXN0IGVsZW1lbnQgdGhhdCBpcyBzbWFsbGVyIHRoYW4gb3IgZ3JlYXRlciB0aGFuIHRoZSBvbmUgd2UgYXJlXG4gKiAgICAgc2VhcmNoaW5nIGZvciwgcmVzcGVjdGl2ZWx5LCBpZiB0aGUgZXhhY3QgZWxlbWVudCBjYW5ub3QgYmUgZm91bmQuXG4gKiAgICAgRGVmYXVsdHMgdG8gJ2JpbmFyeVNlYXJjaC5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKi9cbmV4cG9ydHMuc2VhcmNoID0gZnVuY3Rpb24gc2VhcmNoKGFOZWVkbGUsIGFIYXlzdGFjaywgYUNvbXBhcmUsIGFCaWFzKSB7XG4gIGlmIChhSGF5c3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgdmFyIGluZGV4ID0gcmVjdXJzaXZlU2VhcmNoKC0xLCBhSGF5c3RhY2subGVuZ3RoLCBhTmVlZGxlLCBhSGF5c3RhY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhQ29tcGFyZSwgYUJpYXMgfHwgZXhwb3J0cy5HUkVBVEVTVF9MT1dFUl9CT1VORCk7XG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvLyBXZSBoYXZlIGZvdW5kIGVpdGhlciB0aGUgZXhhY3QgZWxlbWVudCwgb3IgdGhlIG5leHQtY2xvc2VzdCBlbGVtZW50IHRoYW5cbiAgLy8gdGhlIG9uZSB3ZSBhcmUgc2VhcmNoaW5nIGZvci4gSG93ZXZlciwgdGhlcmUgbWF5IGJlIG1vcmUgdGhhbiBvbmUgc3VjaFxuICAvLyBlbGVtZW50LiBNYWtlIHN1cmUgd2UgYWx3YXlzIHJldHVybiB0aGUgc21hbGxlc3Qgb2YgdGhlc2UuXG4gIHdoaWxlIChpbmRleCAtIDEgPj0gMCkge1xuICAgIGlmIChhQ29tcGFyZShhSGF5c3RhY2tbaW5kZXhdLCBhSGF5c3RhY2tbaW5kZXggLSAxXSwgdHJ1ZSkgIT09IDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAtLWluZGV4O1xuICB9XG5cbiAgcmV0dXJuIGluZGV4O1xufTtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxNCBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciBtYXBwaW5nQiBpcyBhZnRlciBtYXBwaW5nQSB3aXRoIHJlc3BlY3QgdG8gZ2VuZXJhdGVkXG4gKiBwb3NpdGlvbi5cbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVkUG9zaXRpb25BZnRlcihtYXBwaW5nQSwgbWFwcGluZ0IpIHtcbiAgLy8gT3B0aW1pemVkIGZvciBtb3N0IGNvbW1vbiBjYXNlXG4gIHZhciBsaW5lQSA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmU7XG4gIHZhciBsaW5lQiA9IG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIHZhciBjb2x1bW5BID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uO1xuICB2YXIgY29sdW1uQiA9IG1hcHBpbmdCLmdlbmVyYXRlZENvbHVtbjtcbiAgcmV0dXJuIGxpbmVCID4gbGluZUEgfHwgbGluZUIgPT0gbGluZUEgJiYgY29sdW1uQiA+PSBjb2x1bW5BIHx8XG4gICAgICAgICB1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkKG1hcHBpbmdBLCBtYXBwaW5nQikgPD0gMDtcbn1cblxuLyoqXG4gKiBBIGRhdGEgc3RydWN0dXJlIHRvIHByb3ZpZGUgYSBzb3J0ZWQgdmlldyBvZiBhY2N1bXVsYXRlZCBtYXBwaW5ncyBpbiBhXG4gKiBwZXJmb3JtYW5jZSBjb25zY2lvdXMgbWFubmVyLiBJdCB0cmFkZXMgYSBuZWdsaWJhYmxlIG92ZXJoZWFkIGluIGdlbmVyYWxcbiAqIGNhc2UgZm9yIGEgbGFyZ2Ugc3BlZWR1cCBpbiBjYXNlIG9mIG1hcHBpbmdzIGJlaW5nIGFkZGVkIGluIG9yZGVyLlxuICovXG5mdW5jdGlvbiBNYXBwaW5nTGlzdCgpIHtcbiAgdGhpcy5fYXJyYXkgPSBbXTtcbiAgdGhpcy5fc29ydGVkID0gdHJ1ZTtcbiAgLy8gU2VydmVzIGFzIGluZmltdW1cbiAgdGhpcy5fbGFzdCA9IHtnZW5lcmF0ZWRMaW5lOiAtMSwgZ2VuZXJhdGVkQ29sdW1uOiAwfTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlIHRocm91Z2ggaW50ZXJuYWwgaXRlbXMuIFRoaXMgbWV0aG9kIHRha2VzIHRoZSBzYW1lIGFyZ3VtZW50cyB0aGF0XG4gKiBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIHRha2VzLlxuICpcbiAqIE5PVEU6IFRoZSBvcmRlciBvZiB0aGUgbWFwcGluZ3MgaXMgTk9UIGd1YXJhbnRlZWQuXG4gKi9cbk1hcHBpbmdMaXN0LnByb3RvdHlwZS51bnNvcnRlZEZvckVhY2ggPVxuICBmdW5jdGlvbiBNYXBwaW5nTGlzdF9mb3JFYWNoKGFDYWxsYmFjaywgYVRoaXNBcmcpIHtcbiAgICB0aGlzLl9hcnJheS5mb3JFYWNoKGFDYWxsYmFjaywgYVRoaXNBcmcpO1xuICB9O1xuXG4vKipcbiAqIEFkZCB0aGUgZ2l2ZW4gc291cmNlIG1hcHBpbmcuXG4gKlxuICogQHBhcmFtIE9iamVjdCBhTWFwcGluZ1xuICovXG5NYXBwaW5nTGlzdC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gTWFwcGluZ0xpc3RfYWRkKGFNYXBwaW5nKSB7XG4gIGlmIChnZW5lcmF0ZWRQb3NpdGlvbkFmdGVyKHRoaXMuX2xhc3QsIGFNYXBwaW5nKSkge1xuICAgIHRoaXMuX2xhc3QgPSBhTWFwcGluZztcbiAgICB0aGlzLl9hcnJheS5wdXNoKGFNYXBwaW5nKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9zb3J0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9hcnJheS5wdXNoKGFNYXBwaW5nKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmbGF0LCBzb3J0ZWQgYXJyYXkgb2YgbWFwcGluZ3MuIFRoZSBtYXBwaW5ncyBhcmUgc29ydGVkIGJ5XG4gKiBnZW5lcmF0ZWQgcG9zaXRpb24uXG4gKlxuICogV0FSTklORzogVGhpcyBtZXRob2QgcmV0dXJucyBpbnRlcm5hbCBkYXRhIHdpdGhvdXQgY29weWluZywgZm9yXG4gKiBwZXJmb3JtYW5jZS4gVGhlIHJldHVybiB2YWx1ZSBtdXN0IE5PVCBiZSBtdXRhdGVkLCBhbmQgc2hvdWxkIGJlIHRyZWF0ZWQgYXNcbiAqIGFuIGltbXV0YWJsZSBib3Jyb3cuIElmIHlvdSB3YW50IHRvIHRha2Ugb3duZXJzaGlwLCB5b3UgbXVzdCBtYWtlIHlvdXIgb3duXG4gKiBjb3B5LlxuICovXG5NYXBwaW5nTGlzdC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIE1hcHBpbmdMaXN0X3RvQXJyYXkoKSB7XG4gIGlmICghdGhpcy5fc29ydGVkKSB7XG4gICAgdGhpcy5fYXJyYXkuc29ydCh1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkKTtcbiAgICB0aGlzLl9zb3J0ZWQgPSB0cnVlO1xuICB9XG4gIHJldHVybiB0aGlzLl9hcnJheTtcbn07XG5cbmV4cG9ydHMuTWFwcGluZ0xpc3QgPSBNYXBwaW5nTGlzdDtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxuLy8gSXQgdHVybnMgb3V0IHRoYXQgc29tZSAobW9zdD8pIEphdmFTY3JpcHQgZW5naW5lcyBkb24ndCBzZWxmLWhvc3Rcbi8vIGBBcnJheS5wcm90b3R5cGUuc29ydGAuIFRoaXMgbWFrZXMgc2Vuc2UgYmVjYXVzZSBDKysgd2lsbCBsaWtlbHkgcmVtYWluXG4vLyBmYXN0ZXIgdGhhbiBKUyB3aGVuIGRvaW5nIHJhdyBDUFUtaW50ZW5zaXZlIHNvcnRpbmcuIEhvd2V2ZXIsIHdoZW4gdXNpbmcgYVxuLy8gY3VzdG9tIGNvbXBhcmF0b3IgZnVuY3Rpb24sIGNhbGxpbmcgYmFjayBhbmQgZm9ydGggYmV0d2VlbiB0aGUgVk0ncyBDKysgYW5kXG4vLyBKSVQnZCBKUyBpcyByYXRoZXIgc2xvdyAqYW5kKiBsb3NlcyBKSVQgdHlwZSBpbmZvcm1hdGlvbiwgcmVzdWx0aW5nIGluXG4vLyB3b3JzZSBnZW5lcmF0ZWQgY29kZSBmb3IgdGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24gdGhhbiB3b3VsZCBiZSBvcHRpbWFsLiBJblxuLy8gZmFjdCwgd2hlbiBzb3J0aW5nIHdpdGggYSBjb21wYXJhdG9yLCB0aGVzZSBjb3N0cyBvdXR3ZWlnaCB0aGUgYmVuZWZpdHMgb2Zcbi8vIHNvcnRpbmcgaW4gQysrLiBCeSB1c2luZyBvdXIgb3duIEpTLWltcGxlbWVudGVkIFF1aWNrIFNvcnQgKGJlbG93KSwgd2UgZ2V0XG4vLyBhIH4zNTAwbXMgbWVhbiBzcGVlZC11cCBpbiBgYmVuY2gvYmVuY2guaHRtbGAuXG5cbi8qKlxuICogU3dhcCB0aGUgZWxlbWVudHMgaW5kZXhlZCBieSBgeGAgYW5kIGB5YCBpbiB0aGUgYXJyYXkgYGFyeWAuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJ5XG4gKiAgICAgICAgVGhlIGFycmF5LlxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqICAgICAgICBUaGUgaW5kZXggb2YgdGhlIGZpcnN0IGl0ZW0uXG4gKiBAcGFyYW0ge051bWJlcn0geVxuICogICAgICAgIFRoZSBpbmRleCBvZiB0aGUgc2Vjb25kIGl0ZW0uXG4gKi9cbmZ1bmN0aW9uIHN3YXAoYXJ5LCB4LCB5KSB7XG4gIHZhciB0ZW1wID0gYXJ5W3hdO1xuICBhcnlbeF0gPSBhcnlbeV07XG4gIGFyeVt5XSA9IHRlbXA7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIHdpdGhpbiB0aGUgcmFuZ2UgYGxvdyAuLiBoaWdoYCBpbmNsdXNpdmUuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGxvd1xuICogICAgICAgIFRoZSBsb3dlciBib3VuZCBvbiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge051bWJlcn0gaGlnaFxuICogICAgICAgIFRoZSB1cHBlciBib3VuZCBvbiB0aGUgcmFuZ2UuXG4gKi9cbmZ1bmN0aW9uIHJhbmRvbUludEluUmFuZ2UobG93LCBoaWdoKSB7XG4gIHJldHVybiBNYXRoLnJvdW5kKGxvdyArIChNYXRoLnJhbmRvbSgpICogKGhpZ2ggLSBsb3cpKSk7XG59XG5cbi8qKlxuICogVGhlIFF1aWNrIFNvcnQgYWxnb3JpdGhtLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyeVxuICogICAgICAgIEFuIGFycmF5IHRvIHNvcnQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJhdG9yXG4gKiAgICAgICAgRnVuY3Rpb24gdG8gdXNlIHRvIGNvbXBhcmUgdHdvIGl0ZW1zLlxuICogQHBhcmFtIHtOdW1iZXJ9IHBcbiAqICAgICAgICBTdGFydCBpbmRleCBvZiB0aGUgYXJyYXlcbiAqIEBwYXJhbSB7TnVtYmVyfSByXG4gKiAgICAgICAgRW5kIGluZGV4IG9mIHRoZSBhcnJheVxuICovXG5mdW5jdGlvbiBkb1F1aWNrU29ydChhcnksIGNvbXBhcmF0b3IsIHAsIHIpIHtcbiAgLy8gSWYgb3VyIGxvd2VyIGJvdW5kIGlzIGxlc3MgdGhhbiBvdXIgdXBwZXIgYm91bmQsIHdlICgxKSBwYXJ0aXRpb24gdGhlXG4gIC8vIGFycmF5IGludG8gdHdvIHBpZWNlcyBhbmQgKDIpIHJlY3Vyc2Ugb24gZWFjaCBoYWxmLiBJZiBpdCBpcyBub3QsIHRoaXMgaXNcbiAgLy8gdGhlIGVtcHR5IGFycmF5IGFuZCBvdXIgYmFzZSBjYXNlLlxuXG4gIGlmIChwIDwgcikge1xuICAgIC8vICgxKSBQYXJ0aXRpb25pbmcuXG4gICAgLy9cbiAgICAvLyBUaGUgcGFydGl0aW9uaW5nIGNob29zZXMgYSBwaXZvdCBiZXR3ZWVuIGBwYCBhbmQgYHJgIGFuZCBtb3ZlcyBhbGxcbiAgICAvLyBlbGVtZW50cyB0aGF0IGFyZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHBpdm90IHRvIHRoZSBiZWZvcmUgaXQsIGFuZFxuICAgIC8vIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBhcmUgZ3JlYXRlciB0aGFuIGl0IGFmdGVyIGl0LiBUaGUgZWZmZWN0IGlzIHRoYXRcbiAgICAvLyBvbmNlIHBhcnRpdGlvbiBpcyBkb25lLCB0aGUgcGl2b3QgaXMgaW4gdGhlIGV4YWN0IHBsYWNlIGl0IHdpbGwgYmUgd2hlblxuICAgIC8vIHRoZSBhcnJheSBpcyBwdXQgaW4gc29ydGVkIG9yZGVyLCBhbmQgaXQgd2lsbCBub3QgbmVlZCB0byBiZSBtb3ZlZFxuICAgIC8vIGFnYWluLiBUaGlzIHJ1bnMgaW4gTyhuKSB0aW1lLlxuXG4gICAgLy8gQWx3YXlzIGNob29zZSBhIHJhbmRvbSBwaXZvdCBzbyB0aGF0IGFuIGlucHV0IGFycmF5IHdoaWNoIGlzIHJldmVyc2VcbiAgICAvLyBzb3J0ZWQgZG9lcyBub3QgY2F1c2UgTyhuXjIpIHJ1bm5pbmcgdGltZS5cbiAgICB2YXIgcGl2b3RJbmRleCA9IHJhbmRvbUludEluUmFuZ2UocCwgcik7XG4gICAgdmFyIGkgPSBwIC0gMTtcblxuICAgIHN3YXAoYXJ5LCBwaXZvdEluZGV4LCByKTtcbiAgICB2YXIgcGl2b3QgPSBhcnlbcl07XG5cbiAgICAvLyBJbW1lZGlhdGVseSBhZnRlciBgamAgaXMgaW5jcmVtZW50ZWQgaW4gdGhpcyBsb29wLCB0aGUgZm9sbG93aW5nIGhvbGRcbiAgICAvLyB0cnVlOlxuICAgIC8vXG4gICAgLy8gICAqIEV2ZXJ5IGVsZW1lbnQgaW4gYGFyeVtwIC4uIGldYCBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHBpdm90LlxuICAgIC8vXG4gICAgLy8gICAqIEV2ZXJ5IGVsZW1lbnQgaW4gYGFyeVtpKzEgLi4gai0xXWAgaXMgZ3JlYXRlciB0aGFuIHRoZSBwaXZvdC5cbiAgICBmb3IgKHZhciBqID0gcDsgaiA8IHI7IGorKykge1xuICAgICAgaWYgKGNvbXBhcmF0b3IoYXJ5W2pdLCBwaXZvdCkgPD0gMCkge1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIHN3YXAoYXJ5LCBpLCBqKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2FwKGFyeSwgaSArIDEsIGopO1xuICAgIHZhciBxID0gaSArIDE7XG5cbiAgICAvLyAoMikgUmVjdXJzZSBvbiBlYWNoIGhhbGYuXG5cbiAgICBkb1F1aWNrU29ydChhcnksIGNvbXBhcmF0b3IsIHAsIHEgLSAxKTtcbiAgICBkb1F1aWNrU29ydChhcnksIGNvbXBhcmF0b3IsIHEgKyAxLCByKTtcbiAgfVxufVxuXG4vKipcbiAqIFNvcnQgdGhlIGdpdmVuIGFycmF5IGluLXBsYWNlIHdpdGggdGhlIGdpdmVuIGNvbXBhcmF0b3IgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJ5XG4gKiAgICAgICAgQW4gYXJyYXkgdG8gc29ydC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbXBhcmF0b3JcbiAqICAgICAgICBGdW5jdGlvbiB0byB1c2UgdG8gY29tcGFyZSB0d28gaXRlbXMuXG4gKi9cbmV4cG9ydHMucXVpY2tTb3J0ID0gZnVuY3Rpb24gKGFyeSwgY29tcGFyYXRvcikge1xuICBkb1F1aWNrU29ydChhcnksIGNvbXBhcmF0b3IsIDAsIGFyeS5sZW5ndGggLSAxKTtcbn07XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgYmluYXJ5U2VhcmNoID0gcmVxdWlyZSgnLi9iaW5hcnktc2VhcmNoJyk7XG52YXIgQXJyYXlTZXQgPSByZXF1aXJlKCcuL2FycmF5LXNldCcpLkFycmF5U2V0O1xudmFyIGJhc2U2NFZMUSA9IHJlcXVpcmUoJy4vYmFzZTY0LXZscScpO1xudmFyIHF1aWNrU29ydCA9IHJlcXVpcmUoJy4vcXVpY2stc29ydCcpLnF1aWNrU29ydDtcblxuZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IEpTT04ucGFyc2UoYVNvdXJjZU1hcC5yZXBsYWNlKC9eXFwpXFxdXFx9Jy8sICcnKSk7XG4gIH1cblxuICByZXR1cm4gc291cmNlTWFwLnNlY3Rpb25zICE9IG51bGxcbiAgICA/IG5ldyBJbmRleGVkU291cmNlTWFwQ29uc3VtZXIoc291cmNlTWFwKVxuICAgIDogbmV3IEJhc2ljU291cmNlTWFwQ29uc3VtZXIoc291cmNlTWFwKTtcbn1cblxuU291cmNlTWFwQ29uc3VtZXIuZnJvbVNvdXJjZU1hcCA9IGZ1bmN0aW9uKGFTb3VyY2VNYXApIHtcbiAgcmV0dXJuIEJhc2ljU291cmNlTWFwQ29uc3VtZXIuZnJvbVNvdXJjZU1hcChhU291cmNlTWFwKTtcbn1cblxuLyoqXG4gKiBUaGUgdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcHBpbmcgc3BlYyB0aGF0IHdlIGFyZSBjb25zdW1pbmcuXG4gKi9cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8vIGBfX2dlbmVyYXRlZE1hcHBpbmdzYCBhbmQgYF9fb3JpZ2luYWxNYXBwaW5nc2AgYXJlIGFycmF5cyB0aGF0IGhvbGQgdGhlXG4vLyBwYXJzZWQgbWFwcGluZyBjb29yZGluYXRlcyBmcm9tIHRoZSBzb3VyY2UgbWFwJ3MgXCJtYXBwaW5nc1wiIGF0dHJpYnV0ZS4gVGhleVxuLy8gYXJlIGxhemlseSBpbnN0YW50aWF0ZWQsIGFjY2Vzc2VkIHZpYSB0aGUgYF9nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4vLyBgX29yaWdpbmFsTWFwcGluZ3NgIGdldHRlcnMgcmVzcGVjdGl2ZWx5LCBhbmQgd2Ugb25seSBwYXJzZSB0aGUgbWFwcGluZ3Ncbi8vIGFuZCBjcmVhdGUgdGhlc2UgYXJyYXlzIG9uY2UgcXVlcmllZCBmb3IgYSBzb3VyY2UgbG9jYXRpb24uIFdlIGp1bXAgdGhyb3VnaFxuLy8gdGhlc2UgaG9vcHMgYmVjYXVzZSB0aGVyZSBjYW4gYmUgbWFueSB0aG91c2FuZHMgb2YgbWFwcGluZ3MsIGFuZCBwYXJzaW5nXG4vLyB0aGVtIGlzIGV4cGVuc2l2ZSwgc28gd2Ugb25seSB3YW50IHRvIGRvIGl0IGlmIHdlIG11c3QuXG4vL1xuLy8gRWFjaCBvYmplY3QgaW4gdGhlIGFycmF5cyBpcyBvZiB0aGUgZm9ybTpcbi8vXG4vLyAgICAge1xuLy8gICAgICAgZ2VuZXJhdGVkTGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgY29kZSxcbi8vICAgICAgIGdlbmVyYXRlZENvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBjb2RlLFxuLy8gICAgICAgc291cmNlOiBUaGUgcGF0aCB0byB0aGUgb3JpZ2luYWwgc291cmNlIGZpbGUgdGhhdCBnZW5lcmF0ZWQgdGhpc1xuLy8gICAgICAgICAgICAgICBjaHVuayBvZiBjb2RlLFxuLy8gICAgICAgb3JpZ2luYWxMaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSB0aGF0XG4vLyAgICAgICAgICAgICAgICAgICAgIGNvcnJlc3BvbmRzIHRvIHRoaXMgY2h1bmsgb2YgZ2VuZXJhdGVkIGNvZGUsXG4vLyAgICAgICBvcmlnaW5hbENvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSB0aGF0XG4vLyAgICAgICAgICAgICAgICAgICAgICAgY29ycmVzcG9uZHMgdG8gdGhpcyBjaHVuayBvZiBnZW5lcmF0ZWQgY29kZSxcbi8vICAgICAgIG5hbWU6IFRoZSBuYW1lIG9mIHRoZSBvcmlnaW5hbCBzeW1ib2wgd2hpY2ggZ2VuZXJhdGVkIHRoaXMgY2h1bmsgb2Zcbi8vICAgICAgICAgICAgIGNvZGUuXG4vLyAgICAgfVxuLy9cbi8vIEFsbCBwcm9wZXJ0aWVzIGV4Y2VwdCBmb3IgYGdlbmVyYXRlZExpbmVgIGFuZCBgZ2VuZXJhdGVkQ29sdW1uYCBjYW4gYmVcbi8vIGBudWxsYC5cbi8vXG4vLyBgX2dlbmVyYXRlZE1hcHBpbmdzYCBpcyBvcmRlcmVkIGJ5IHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zLlxuLy9cbi8vIGBfb3JpZ2luYWxNYXBwaW5nc2AgaXMgb3JkZXJlZCBieSB0aGUgb3JpZ2luYWwgcG9zaXRpb25zLlxuXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IG51bGw7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLCAnX2dlbmVyYXRlZE1hcHBpbmdzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncykge1xuICAgICAgdGhpcy5fcGFyc2VNYXBwaW5ncyh0aGlzLl9tYXBwaW5ncywgdGhpcy5zb3VyY2VSb290KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzO1xuICB9XG59KTtcblxuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9fb3JpZ2luYWxNYXBwaW5ncyA9IG51bGw7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLCAnX29yaWdpbmFsTWFwcGluZ3MnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fX29yaWdpbmFsTWFwcGluZ3MpIHtcbiAgICAgIHRoaXMuX3BhcnNlTWFwcGluZ3ModGhpcy5fbWFwcGluZ3MsIHRoaXMuc291cmNlUm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzO1xuICB9XG59KTtcblxuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9jaGFySXNNYXBwaW5nU2VwYXJhdG9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfY2hhcklzTWFwcGluZ1NlcGFyYXRvcihhU3RyLCBpbmRleCkge1xuICAgIHZhciBjID0gYVN0ci5jaGFyQXQoaW5kZXgpO1xuICAgIHJldHVybiBjID09PSBcIjtcIiB8fCBjID09PSBcIixcIjtcbiAgfTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgbWFwcGluZ3MgaW4gYSBzdHJpbmcgaW4gdG8gYSBkYXRhIHN0cnVjdHVyZSB3aGljaCB3ZSBjYW4gZWFzaWx5XG4gKiBxdWVyeSAodGhlIG9yZGVyZWQgYXJyYXlzIGluIHRoZSBgdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzYCBhbmRcbiAqIGB0aGlzLl9fb3JpZ2luYWxNYXBwaW5nc2AgcHJvcGVydGllcykuXG4gKi9cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fcGFyc2VNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3BhcnNlTWFwcGluZ3MoYVN0ciwgYVNvdXJjZVJvb3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdWJjbGFzc2VzIG11c3QgaW1wbGVtZW50IF9wYXJzZU1hcHBpbmdzXCIpO1xuICB9O1xuXG5Tb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVIgPSAxO1xuU291cmNlTWFwQ29uc3VtZXIuT1JJR0lOQUxfT1JERVIgPSAyO1xuXG5Tb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCA9IDE7XG5Tb3VyY2VNYXBDb25zdW1lci5MRUFTVF9VUFBFUl9CT1VORCA9IDI7XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGVhY2ggbWFwcGluZyBiZXR3ZWVuIGFuIG9yaWdpbmFsIHNvdXJjZS9saW5lL2NvbHVtbiBhbmQgYVxuICogZ2VuZXJhdGVkIGxpbmUvY29sdW1uIGluIHRoaXMgc291cmNlIG1hcC5cbiAqXG4gKiBAcGFyYW0gRnVuY3Rpb24gYUNhbGxiYWNrXG4gKiAgICAgICAgVGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdpdGggZWFjaCBtYXBwaW5nLlxuICogQHBhcmFtIE9iamVjdCBhQ29udGV4dFxuICogICAgICAgIE9wdGlvbmFsLiBJZiBzcGVjaWZpZWQsIHRoaXMgb2JqZWN0IHdpbGwgYmUgdGhlIHZhbHVlIG9mIGB0aGlzYCBldmVyeVxuICogICAgICAgIHRpbWUgdGhhdCBgYUNhbGxiYWNrYCBpcyBjYWxsZWQuXG4gKiBAcGFyYW0gYU9yZGVyXG4gKiAgICAgICAgRWl0aGVyIGBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVJgIG9yXG4gKiAgICAgICAgYFNvdXJjZU1hcENvbnN1bWVyLk9SSUdJTkFMX09SREVSYC4gU3BlY2lmaWVzIHdoZXRoZXIgeW91IHdhbnQgdG9cbiAqICAgICAgICBpdGVyYXRlIG92ZXIgdGhlIG1hcHBpbmdzIHNvcnRlZCBieSB0aGUgZ2VuZXJhdGVkIGZpbGUncyBsaW5lL2NvbHVtblxuICogICAgICAgIG9yZGVyIG9yIHRoZSBvcmlnaW5hbCdzIHNvdXJjZS9saW5lL2NvbHVtbiBvcmRlciwgcmVzcGVjdGl2ZWx5LiBEZWZhdWx0cyB0b1xuICogICAgICAgIGBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVJgLlxuICovXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuZWFjaE1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9lYWNoTWFwcGluZyhhQ2FsbGJhY2ssIGFDb250ZXh0LCBhT3JkZXIpIHtcbiAgICB2YXIgY29udGV4dCA9IGFDb250ZXh0IHx8IG51bGw7XG4gICAgdmFyIG9yZGVyID0gYU9yZGVyIHx8IFNvdXJjZU1hcENvbnN1bWVyLkdFTkVSQVRFRF9PUkRFUjtcblxuICAgIHZhciBtYXBwaW5ncztcbiAgICBzd2l0Y2ggKG9yZGVyKSB7XG4gICAgY2FzZSBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVI6XG4gICAgICBtYXBwaW5ncyA9IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTb3VyY2VNYXBDb25zdW1lci5PUklHSU5BTF9PUkRFUjpcbiAgICAgIG1hcHBpbmdzID0gdGhpcy5fb3JpZ2luYWxNYXBwaW5ncztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG9yZGVyIG9mIGl0ZXJhdGlvbi5cIik7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZVJvb3QgPSB0aGlzLnNvdXJjZVJvb3Q7XG4gICAgbWFwcGluZ3MubWFwKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgICB2YXIgc291cmNlID0gbWFwcGluZy5zb3VyY2UgPT09IG51bGwgPyBudWxsIDogdGhpcy5fc291cmNlcy5hdChtYXBwaW5nLnNvdXJjZSk7XG4gICAgICBpZiAoc291cmNlICE9IG51bGwgJiYgc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgIHNvdXJjZSA9IHV0aWwuam9pbihzb3VyY2VSb290LCBzb3VyY2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgIGdlbmVyYXRlZExpbmU6IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSxcbiAgICAgICAgZ2VuZXJhdGVkQ29sdW1uOiBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbixcbiAgICAgICAgb3JpZ2luYWxMaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgb3JpZ2luYWxDb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW4sXG4gICAgICAgIG5hbWU6IG1hcHBpbmcubmFtZSA9PT0gbnVsbCA/IG51bGwgOiB0aGlzLl9uYW1lcy5hdChtYXBwaW5nLm5hbWUpXG4gICAgICB9O1xuICAgIH0sIHRoaXMpLmZvckVhY2goYUNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBnZW5lcmF0ZWQgbGluZSBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgb3JpZ2luYWwgc291cmNlLFxuICogbGluZSwgYW5kIGNvbHVtbiBwcm92aWRlZC4gSWYgbm8gY29sdW1uIGlzIHByb3ZpZGVkLCByZXR1cm5zIGFsbCBtYXBwaW5nc1xuICogY29ycmVzcG9uZGluZyB0byBhIGVpdGhlciB0aGUgbGluZSB3ZSBhcmUgc2VhcmNoaW5nIGZvciBvciB0aGUgbmV4dFxuICogY2xvc2VzdCBsaW5lIHRoYXQgaGFzIGFueSBtYXBwaW5ncy4gT3RoZXJ3aXNlLCByZXR1cm5zIGFsbCBtYXBwaW5nc1xuICogY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gbGluZSBhbmQgZWl0aGVyIHRoZSBjb2x1bW4gd2UgYXJlIHNlYXJjaGluZyBmb3JcbiAqIG9yIHRoZSBuZXh0IGNsb3Nlc3QgY29sdW1uIHRoYXQgaGFzIGFueSBvZmZzZXRzLlxuICpcbiAqIFRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgZmlsZW5hbWUgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBjb2x1bW46IE9wdGlvbmFsLiB0aGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLlxuICpcbiAqIGFuZCBhbiBhcnJheSBvZiBvYmplY3RzIGlzIHJldHVybmVkLCBlYWNoIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC5cbiAqL1xuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmFsbEdlbmVyYXRlZFBvc2l0aW9uc0ZvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2FsbEdlbmVyYXRlZFBvc2l0aW9uc0ZvcihhQXJncykge1xuICAgIHZhciBsaW5lID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdsaW5lJyk7XG5cbiAgICAvLyBXaGVuIHRoZXJlIGlzIG5vIGV4YWN0IG1hdGNoLCBCYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fZmluZE1hcHBpbmdcbiAgICAvLyByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgY2xvc2VzdCBtYXBwaW5nIGxlc3MgdGhhbiB0aGUgbmVlZGxlLiBCeVxuICAgIC8vIHNldHRpbmcgbmVlZGxlLm9yaWdpbmFsQ29sdW1uIHRvIDAsIHdlIHRodXMgZmluZCB0aGUgbGFzdCBtYXBwaW5nIGZvclxuICAgIC8vIHRoZSBnaXZlbiBsaW5lLCBwcm92aWRlZCBzdWNoIGEgbWFwcGluZyBleGlzdHMuXG4gICAgdmFyIG5lZWRsZSA9IHtcbiAgICAgIHNvdXJjZTogdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2UnKSxcbiAgICAgIG9yaWdpbmFsTGluZTogbGluZSxcbiAgICAgIG9yaWdpbmFsQ29sdW1uOiB1dGlsLmdldEFyZyhhQXJncywgJ2NvbHVtbicsIDApXG4gICAgfTtcblxuICAgIGlmICh0aGlzLnNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgbmVlZGxlLnNvdXJjZSA9IHV0aWwucmVsYXRpdmUodGhpcy5zb3VyY2VSb290LCBuZWVkbGUuc291cmNlKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9zb3VyY2VzLmhhcyhuZWVkbGUuc291cmNlKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBuZWVkbGUuc291cmNlID0gdGhpcy5fc291cmNlcy5pbmRleE9mKG5lZWRsZS5zb3VyY2UpO1xuXG4gICAgdmFyIG1hcHBpbmdzID0gW107XG5cbiAgICB2YXIgaW5kZXggPSB0aGlzLl9maW5kTWFwcGluZyhuZWVkbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxNYXBwaW5ncyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9yaWdpbmFsTGluZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib3JpZ2luYWxDb2x1bW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmFyeVNlYXJjaC5MRUFTVF9VUFBFUl9CT1VORCk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5fb3JpZ2luYWxNYXBwaW5nc1tpbmRleF07XG5cbiAgICAgIGlmIChhQXJncy5jb2x1bW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgb3JpZ2luYWxMaW5lID0gbWFwcGluZy5vcmlnaW5hbExpbmU7XG5cbiAgICAgICAgLy8gSXRlcmF0ZSB1bnRpbCBlaXRoZXIgd2UgcnVuIG91dCBvZiBtYXBwaW5ncywgb3Igd2UgcnVuIGludG9cbiAgICAgICAgLy8gYSBtYXBwaW5nIGZvciBhIGRpZmZlcmVudCBsaW5lIHRoYW4gdGhlIG9uZSB3ZSBmb3VuZC4gU2luY2VcbiAgICAgICAgLy8gbWFwcGluZ3MgYXJlIHNvcnRlZCwgdGhpcyBpcyBndWFyYW50ZWVkIHRvIGZpbmQgYWxsIG1hcHBpbmdzIGZvclxuICAgICAgICAvLyB0aGUgbGluZSB3ZSBmb3VuZC5cbiAgICAgICAgd2hpbGUgKG1hcHBpbmcgJiYgbWFwcGluZy5vcmlnaW5hbExpbmUgPT09IG9yaWdpbmFsTGluZSkge1xuICAgICAgICAgIG1hcHBpbmdzLnB1c2goe1xuICAgICAgICAgICAgbGluZTogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZExpbmUnLCBudWxsKSxcbiAgICAgICAgICAgIGNvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZENvbHVtbicsIG51bGwpLFxuICAgICAgICAgICAgbGFzdENvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2xhc3RHZW5lcmF0ZWRDb2x1bW4nLCBudWxsKVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbWFwcGluZyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3NbKytpbmRleF07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBvcmlnaW5hbENvbHVtbiA9IG1hcHBpbmcub3JpZ2luYWxDb2x1bW47XG5cbiAgICAgICAgLy8gSXRlcmF0ZSB1bnRpbCBlaXRoZXIgd2UgcnVuIG91dCBvZiBtYXBwaW5ncywgb3Igd2UgcnVuIGludG9cbiAgICAgICAgLy8gYSBtYXBwaW5nIGZvciBhIGRpZmZlcmVudCBsaW5lIHRoYW4gdGhlIG9uZSB3ZSB3ZXJlIHNlYXJjaGluZyBmb3IuXG4gICAgICAgIC8vIFNpbmNlIG1hcHBpbmdzIGFyZSBzb3J0ZWQsIHRoaXMgaXMgZ3VhcmFudGVlZCB0byBmaW5kIGFsbCBtYXBwaW5ncyBmb3JcbiAgICAgICAgLy8gdGhlIGxpbmUgd2UgYXJlIHNlYXJjaGluZyBmb3IuXG4gICAgICAgIHdoaWxlIChtYXBwaW5nICYmXG4gICAgICAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsTGluZSA9PT0gbGluZSAmJlxuICAgICAgICAgICAgICAgbWFwcGluZy5vcmlnaW5hbENvbHVtbiA9PSBvcmlnaW5hbENvbHVtbikge1xuICAgICAgICAgIG1hcHBpbmdzLnB1c2goe1xuICAgICAgICAgICAgbGluZTogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZExpbmUnLCBudWxsKSxcbiAgICAgICAgICAgIGNvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZENvbHVtbicsIG51bGwpLFxuICAgICAgICAgICAgbGFzdENvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2xhc3RHZW5lcmF0ZWRDb2x1bW4nLCBudWxsKVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbWFwcGluZyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3NbKytpbmRleF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWFwcGluZ3M7XG4gIH07XG5cbmV4cG9ydHMuU291cmNlTWFwQ29uc3VtZXIgPSBTb3VyY2VNYXBDb25zdW1lcjtcblxuLyoqXG4gKiBBIEJhc2ljU291cmNlTWFwQ29uc3VtZXIgaW5zdGFuY2UgcmVwcmVzZW50cyBhIHBhcnNlZCBzb3VyY2UgbWFwIHdoaWNoIHdlIGNhblxuICogcXVlcnkgZm9yIGluZm9ybWF0aW9uIGFib3V0IHRoZSBvcmlnaW5hbCBmaWxlIHBvc2l0aW9ucyBieSBnaXZpbmcgaXQgYSBmaWxlXG4gKiBwb3NpdGlvbiBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS5cbiAqXG4gKiBUaGUgb25seSBwYXJhbWV0ZXIgaXMgdGhlIHJhdyBzb3VyY2UgbWFwIChlaXRoZXIgYXMgYSBKU09OIHN0cmluZywgb3JcbiAqIGFscmVhZHkgcGFyc2VkIHRvIGFuIG9iamVjdCkuIEFjY29yZGluZyB0byB0aGUgc3BlYywgc291cmNlIG1hcHMgaGF2ZSB0aGVcbiAqIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuICpcbiAqICAgLSB2ZXJzaW9uOiBXaGljaCB2ZXJzaW9uIG9mIHRoZSBzb3VyY2UgbWFwIHNwZWMgdGhpcyBtYXAgaXMgZm9sbG93aW5nLlxuICogICAtIHNvdXJjZXM6IEFuIGFycmF5IG9mIFVSTHMgdG8gdGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlcy5cbiAqICAgLSBuYW1lczogQW4gYXJyYXkgb2YgaWRlbnRpZmllcnMgd2hpY2ggY2FuIGJlIHJlZmVycmVuY2VkIGJ5IGluZGl2aWR1YWwgbWFwcGluZ3MuXG4gKiAgIC0gc291cmNlUm9vdDogT3B0aW9uYWwuIFRoZSBVUkwgcm9vdCBmcm9tIHdoaWNoIGFsbCBzb3VyY2VzIGFyZSByZWxhdGl2ZS5cbiAqICAgLSBzb3VyY2VzQ29udGVudDogT3B0aW9uYWwuIEFuIGFycmF5IG9mIGNvbnRlbnRzIG9mIHRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZXMuXG4gKiAgIC0gbWFwcGluZ3M6IEEgc3RyaW5nIG9mIGJhc2U2NCBWTFFzIHdoaWNoIGNvbnRhaW4gdGhlIGFjdHVhbCBtYXBwaW5ncy5cbiAqICAgLSBmaWxlOiBPcHRpb25hbC4gVGhlIGdlbmVyYXRlZCBmaWxlIHRoaXMgc291cmNlIG1hcCBpcyBhc3NvY2lhdGVkIHdpdGguXG4gKlxuICogSGVyZSBpcyBhbiBleGFtcGxlIHNvdXJjZSBtYXAsIHRha2VuIGZyb20gdGhlIHNvdXJjZSBtYXAgc3BlY1swXTpcbiAqXG4gKiAgICAge1xuICogICAgICAgdmVyc2lvbiA6IDMsXG4gKiAgICAgICBmaWxlOiBcIm91dC5qc1wiLFxuICogICAgICAgc291cmNlUm9vdCA6IFwiXCIsXG4gKiAgICAgICBzb3VyY2VzOiBbXCJmb28uanNcIiwgXCJiYXIuanNcIl0sXG4gKiAgICAgICBuYW1lczogW1wic3JjXCIsIFwibWFwc1wiLCBcImFyZVwiLCBcImZ1blwiXSxcbiAqICAgICAgIG1hcHBpbmdzOiBcIkFBLEFCOztBQkNERTtcIlxuICogICAgIH1cbiAqXG4gKiBbMF06IGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL2RvY3VtZW50L2QvMVUxUkdBZWhRd1J5cFVUb3ZGMUtSbHBpT0Z6ZTBiLV8yZ2M2ZkFIMEtZMGsvZWRpdD9wbGk9MSNcbiAqL1xuZnVuY3Rpb24gQmFzaWNTb3VyY2VNYXBDb25zdW1lcihhU291cmNlTWFwKSB7XG4gIHZhciBzb3VyY2VNYXAgPSBhU291cmNlTWFwO1xuICBpZiAodHlwZW9mIGFTb3VyY2VNYXAgPT09ICdzdHJpbmcnKSB7XG4gICAgc291cmNlTWFwID0gSlNPTi5wYXJzZShhU291cmNlTWFwLnJlcGxhY2UoL15cXClcXF1cXH0nLywgJycpKTtcbiAgfVxuXG4gIHZhciB2ZXJzaW9uID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAndmVyc2lvbicpO1xuICB2YXIgc291cmNlcyA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3NvdXJjZXMnKTtcbiAgLy8gU2FzcyAzLjMgbGVhdmVzIG91dCB0aGUgJ25hbWVzJyBhcnJheSwgc28gd2UgZGV2aWF0ZSBmcm9tIHRoZSBzcGVjICh3aGljaFxuICAvLyByZXF1aXJlcyB0aGUgYXJyYXkpIHRvIHBsYXkgbmljZSBoZXJlLlxuICB2YXIgbmFtZXMgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICduYW1lcycsIFtdKTtcbiAgdmFyIHNvdXJjZVJvb3QgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdzb3VyY2VSb290JywgbnVsbCk7XG4gIHZhciBzb3VyY2VzQ29udGVudCA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3NvdXJjZXNDb250ZW50JywgbnVsbCk7XG4gIHZhciBtYXBwaW5ncyA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ21hcHBpbmdzJyk7XG4gIHZhciBmaWxlID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnZmlsZScsIG51bGwpO1xuXG4gIC8vIE9uY2UgYWdhaW4sIFNhc3MgZGV2aWF0ZXMgZnJvbSB0aGUgc3BlYyBhbmQgc3VwcGxpZXMgdGhlIHZlcnNpb24gYXMgYVxuICAvLyBzdHJpbmcgcmF0aGVyIHRoYW4gYSBudW1iZXIsIHNvIHdlIHVzZSBsb29zZSBlcXVhbGl0eSBjaGVja2luZyBoZXJlLlxuICBpZiAodmVyc2lvbiAhPSB0aGlzLl92ZXJzaW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCB2ZXJzaW9uOiAnICsgdmVyc2lvbik7XG4gIH1cblxuICBzb3VyY2VzID0gc291cmNlc1xuICAgIC5tYXAoU3RyaW5nKVxuICAgIC8vIFNvbWUgc291cmNlIG1hcHMgcHJvZHVjZSByZWxhdGl2ZSBzb3VyY2UgcGF0aHMgbGlrZSBcIi4vZm9vLmpzXCIgaW5zdGVhZCBvZlxuICAgIC8vIFwiZm9vLmpzXCIuICBOb3JtYWxpemUgdGhlc2UgZmlyc3Qgc28gdGhhdCBmdXR1cmUgY29tcGFyaXNvbnMgd2lsbCBzdWNjZWVkLlxuICAgIC8vIFNlZSBidWd6aWwubGEvMTA5MDc2OC5cbiAgICAubWFwKHV0aWwubm9ybWFsaXplKVxuICAgIC8vIEFsd2F5cyBlbnN1cmUgdGhhdCBhYnNvbHV0ZSBzb3VyY2VzIGFyZSBpbnRlcm5hbGx5IHN0b3JlZCByZWxhdGl2ZSB0b1xuICAgIC8vIHRoZSBzb3VyY2Ugcm9vdCwgaWYgdGhlIHNvdXJjZSByb290IGlzIGFic29sdXRlLiBOb3QgZG9pbmcgdGhpcyB3b3VsZFxuICAgIC8vIGJlIHBhcnRpY3VsYXJseSBwcm9ibGVtYXRpYyB3aGVuIHRoZSBzb3VyY2Ugcm9vdCBpcyBhIHByZWZpeCBvZiB0aGVcbiAgICAvLyBzb3VyY2UgKHZhbGlkLCBidXQgd2h5Pz8pLiBTZWUgZ2l0aHViIGlzc3VlICMxOTkgYW5kIGJ1Z3ppbC5sYS8xMTg4OTgyLlxuICAgIC5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIHNvdXJjZVJvb3QgJiYgdXRpbC5pc0Fic29sdXRlKHNvdXJjZVJvb3QpICYmIHV0aWwuaXNBYnNvbHV0ZShzb3VyY2UpXG4gICAgICAgID8gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBzb3VyY2UpXG4gICAgICAgIDogc291cmNlO1xuICAgIH0pO1xuXG4gIC8vIFBhc3MgYHRydWVgIGJlbG93IHRvIGFsbG93IGR1cGxpY2F0ZSBuYW1lcyBhbmQgc291cmNlcy4gV2hpbGUgc291cmNlIG1hcHNcbiAgLy8gYXJlIGludGVuZGVkIHRvIGJlIGNvbXByZXNzZWQgYW5kIGRlZHVwbGljYXRlZCwgdGhlIFR5cGVTY3JpcHQgY29tcGlsZXJcbiAgLy8gc29tZXRpbWVzIGdlbmVyYXRlcyBzb3VyY2UgbWFwcyB3aXRoIGR1cGxpY2F0ZXMgaW4gdGhlbS4gU2VlIEdpdGh1YiBpc3N1ZVxuICAvLyAjNzIgYW5kIGJ1Z3ppbC5sYS84ODk0OTIuXG4gIHRoaXMuX25hbWVzID0gQXJyYXlTZXQuZnJvbUFycmF5KG5hbWVzLm1hcChTdHJpbmcpLCB0cnVlKTtcbiAgdGhpcy5fc291cmNlcyA9IEFycmF5U2V0LmZyb21BcnJheShzb3VyY2VzLCB0cnVlKTtcblxuICB0aGlzLnNvdXJjZVJvb3QgPSBzb3VyY2VSb290O1xuICB0aGlzLnNvdXJjZXNDb250ZW50ID0gc291cmNlc0NvbnRlbnQ7XG4gIHRoaXMuX21hcHBpbmdzID0gbWFwcGluZ3M7XG4gIHRoaXMuZmlsZSA9IGZpbGU7XG59XG5cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUpO1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuY29uc3VtZXIgPSBTb3VyY2VNYXBDb25zdW1lcjtcblxuLyoqXG4gKiBDcmVhdGUgYSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyIGZyb20gYSBTb3VyY2VNYXBHZW5lcmF0b3IuXG4gKlxuICogQHBhcmFtIFNvdXJjZU1hcEdlbmVyYXRvciBhU291cmNlTWFwXG4gKiAgICAgICAgVGhlIHNvdXJjZSBtYXAgdGhhdCB3aWxsIGJlIGNvbnN1bWVkLlxuICogQHJldHVybnMgQmFzaWNTb3VyY2VNYXBDb25zdW1lclxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLmZyb21Tb3VyY2VNYXAgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9mcm9tU291cmNlTWFwKGFTb3VyY2VNYXApIHtcbiAgICB2YXIgc21jID0gT2JqZWN0LmNyZWF0ZShCYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSk7XG5cbiAgICB2YXIgbmFtZXMgPSBzbWMuX25hbWVzID0gQXJyYXlTZXQuZnJvbUFycmF5KGFTb3VyY2VNYXAuX25hbWVzLnRvQXJyYXkoKSwgdHJ1ZSk7XG4gICAgdmFyIHNvdXJjZXMgPSBzbWMuX3NvdXJjZXMgPSBBcnJheVNldC5mcm9tQXJyYXkoYVNvdXJjZU1hcC5fc291cmNlcy50b0FycmF5KCksIHRydWUpO1xuICAgIHNtYy5zb3VyY2VSb290ID0gYVNvdXJjZU1hcC5fc291cmNlUm9vdDtcbiAgICBzbWMuc291cmNlc0NvbnRlbnQgPSBhU291cmNlTWFwLl9nZW5lcmF0ZVNvdXJjZXNDb250ZW50KHNtYy5fc291cmNlcy50b0FycmF5KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbWMuc291cmNlUm9vdCk7XG4gICAgc21jLmZpbGUgPSBhU291cmNlTWFwLl9maWxlO1xuXG4gICAgLy8gQmVjYXVzZSB3ZSBhcmUgbW9kaWZ5aW5nIHRoZSBlbnRyaWVzIChieSBjb252ZXJ0aW5nIHN0cmluZyBzb3VyY2VzIGFuZFxuICAgIC8vIG5hbWVzIHRvIGluZGljZXMgaW50byB0aGUgc291cmNlcyBhbmQgbmFtZXMgQXJyYXlTZXRzKSwgd2UgaGF2ZSB0byBtYWtlXG4gICAgLy8gYSBjb3B5IG9mIHRoZSBlbnRyeSBvciBlbHNlIGJhZCB0aGluZ3MgaGFwcGVuLiBTaGFyZWQgbXV0YWJsZSBzdGF0ZVxuICAgIC8vIHN0cmlrZXMgYWdhaW4hIFNlZSBnaXRodWIgaXNzdWUgIzE5MS5cblxuICAgIHZhciBnZW5lcmF0ZWRNYXBwaW5ncyA9IGFTb3VyY2VNYXAuX21hcHBpbmdzLnRvQXJyYXkoKS5zbGljZSgpO1xuICAgIHZhciBkZXN0R2VuZXJhdGVkTWFwcGluZ3MgPSBzbWMuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IFtdO1xuICAgIHZhciBkZXN0T3JpZ2luYWxNYXBwaW5ncyA9IHNtYy5fX29yaWdpbmFsTWFwcGluZ3MgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZW5lcmF0ZWRNYXBwaW5ncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNyY01hcHBpbmcgPSBnZW5lcmF0ZWRNYXBwaW5nc1tpXTtcbiAgICAgIHZhciBkZXN0TWFwcGluZyA9IG5ldyBNYXBwaW5nO1xuICAgICAgZGVzdE1hcHBpbmcuZ2VuZXJhdGVkTGluZSA9IHNyY01hcHBpbmcuZ2VuZXJhdGVkTGluZTtcbiAgICAgIGRlc3RNYXBwaW5nLmdlbmVyYXRlZENvbHVtbiA9IHNyY01hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uO1xuXG4gICAgICBpZiAoc3JjTWFwcGluZy5zb3VyY2UpIHtcbiAgICAgICAgZGVzdE1hcHBpbmcuc291cmNlID0gc291cmNlcy5pbmRleE9mKHNyY01hcHBpbmcuc291cmNlKTtcbiAgICAgICAgZGVzdE1hcHBpbmcub3JpZ2luYWxMaW5lID0gc3JjTWFwcGluZy5vcmlnaW5hbExpbmU7XG4gICAgICAgIGRlc3RNYXBwaW5nLm9yaWdpbmFsQ29sdW1uID0gc3JjTWFwcGluZy5vcmlnaW5hbENvbHVtbjtcblxuICAgICAgICBpZiAoc3JjTWFwcGluZy5uYW1lKSB7XG4gICAgICAgICAgZGVzdE1hcHBpbmcubmFtZSA9IG5hbWVzLmluZGV4T2Yoc3JjTWFwcGluZy5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlc3RPcmlnaW5hbE1hcHBpbmdzLnB1c2goZGVzdE1hcHBpbmcpO1xuICAgICAgfVxuXG4gICAgICBkZXN0R2VuZXJhdGVkTWFwcGluZ3MucHVzaChkZXN0TWFwcGluZyk7XG4gICAgfVxuXG4gICAgcXVpY2tTb3J0KHNtYy5fX29yaWdpbmFsTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMpO1xuXG4gICAgcmV0dXJuIHNtYztcbiAgfTtcblxuLyoqXG4gKiBUaGUgdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcHBpbmcgc3BlYyB0aGF0IHdlIGFyZSBjb25zdW1pbmcuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLyoqXG4gKiBUaGUgbGlzdCBvZiBvcmlnaW5hbCBzb3VyY2VzLlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUsICdzb3VyY2VzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fc291cmNlcy50b0FycmF5KCkubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VSb290ICE9IG51bGwgPyB1dGlsLmpvaW4odGhpcy5zb3VyY2VSb290LCBzKSA6IHM7XG4gICAgfSwgdGhpcyk7XG4gIH1cbn0pO1xuXG4vKipcbiAqIFByb3ZpZGUgdGhlIEpJVCB3aXRoIGEgbmljZSBzaGFwZSAvIGhpZGRlbiBjbGFzcy5cbiAqL1xuZnVuY3Rpb24gTWFwcGluZygpIHtcbiAgdGhpcy5nZW5lcmF0ZWRMaW5lID0gMDtcbiAgdGhpcy5nZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICB0aGlzLnNvdXJjZSA9IG51bGw7XG4gIHRoaXMub3JpZ2luYWxMaW5lID0gbnVsbDtcbiAgdGhpcy5vcmlnaW5hbENvbHVtbiA9IG51bGw7XG4gIHRoaXMubmFtZSA9IG51bGw7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIG1hcHBpbmdzIGluIGEgc3RyaW5nIGluIHRvIGEgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggd2UgY2FuIGVhc2lseVxuICogcXVlcnkgKHRoZSBvcmRlcmVkIGFycmF5cyBpbiB0aGUgYHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4gKiBgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3NgIHByb3BlcnRpZXMpLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fcGFyc2VNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3BhcnNlTWFwcGluZ3MoYVN0ciwgYVNvdXJjZVJvb3QpIHtcbiAgICB2YXIgZ2VuZXJhdGVkTGluZSA9IDE7XG4gICAgdmFyIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNPcmlnaW5hbExpbmUgPSAwO1xuICAgIHZhciBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNTb3VyY2UgPSAwO1xuICAgIHZhciBwcmV2aW91c05hbWUgPSAwO1xuICAgIHZhciBsZW5ndGggPSBhU3RyLmxlbmd0aDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjYWNoZWRTZWdtZW50cyA9IHt9O1xuICAgIHZhciB0ZW1wID0ge307XG4gICAgdmFyIG9yaWdpbmFsTWFwcGluZ3MgPSBbXTtcbiAgICB2YXIgZ2VuZXJhdGVkTWFwcGluZ3MgPSBbXTtcbiAgICB2YXIgbWFwcGluZywgc3RyLCBzZWdtZW50LCBlbmQsIHZhbHVlO1xuXG4gICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBpZiAoYVN0ci5jaGFyQXQoaW5kZXgpID09PSAnOycpIHtcbiAgICAgICAgZ2VuZXJhdGVkTGluZSsrO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChhU3RyLmNoYXJBdChpbmRleCkgPT09ICcsJykge1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG1hcHBpbmcgPSBuZXcgTWFwcGluZygpO1xuICAgICAgICBtYXBwaW5nLmdlbmVyYXRlZExpbmUgPSBnZW5lcmF0ZWRMaW5lO1xuXG4gICAgICAgIC8vIEJlY2F1c2UgZWFjaCBvZmZzZXQgaXMgZW5jb2RlZCByZWxhdGl2ZSB0byB0aGUgcHJldmlvdXMgb25lLFxuICAgICAgICAvLyBtYW55IHNlZ21lbnRzIG9mdGVuIGhhdmUgdGhlIHNhbWUgZW5jb2RpbmcuIFdlIGNhbiBleHBsb2l0IHRoaXNcbiAgICAgICAgLy8gZmFjdCBieSBjYWNoaW5nIHRoZSBwYXJzZWQgdmFyaWFibGUgbGVuZ3RoIGZpZWxkcyBvZiBlYWNoIHNlZ21lbnQsXG4gICAgICAgIC8vIGFsbG93aW5nIHVzIHRvIGF2b2lkIGEgc2Vjb25kIHBhcnNlIGlmIHdlIGVuY291bnRlciB0aGUgc2FtZVxuICAgICAgICAvLyBzZWdtZW50IGFnYWluLlxuICAgICAgICBmb3IgKGVuZCA9IGluZGV4OyBlbmQgPCBsZW5ndGg7IGVuZCsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2NoYXJJc01hcHBpbmdTZXBhcmF0b3IoYVN0ciwgZW5kKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0ciA9IGFTdHIuc2xpY2UoaW5kZXgsIGVuZCk7XG5cbiAgICAgICAgc2VnbWVudCA9IGNhY2hlZFNlZ21lbnRzW3N0cl07XG4gICAgICAgIGlmIChzZWdtZW50KSB7XG4gICAgICAgICAgaW5kZXggKz0gc3RyLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWdtZW50ID0gW107XG4gICAgICAgICAgd2hpbGUgKGluZGV4IDwgZW5kKSB7XG4gICAgICAgICAgICBiYXNlNjRWTFEuZGVjb2RlKGFTdHIsIGluZGV4LCB0ZW1wKTtcbiAgICAgICAgICAgIHZhbHVlID0gdGVtcC52YWx1ZTtcbiAgICAgICAgICAgIGluZGV4ID0gdGVtcC5yZXN0O1xuICAgICAgICAgICAgc2VnbWVudC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgYSBzb3VyY2UsIGJ1dCBubyBsaW5lIGFuZCBjb2x1bW4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgYSBzb3VyY2UgYW5kIGxpbmUsIGJ1dCBubyBjb2x1bW4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjYWNoZWRTZWdtZW50c1tzdHJdID0gc2VnbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdlbmVyYXRlZCBjb2x1bW4uXG4gICAgICAgIG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uID0gcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gKyBzZWdtZW50WzBdO1xuICAgICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uO1xuXG4gICAgICAgIGlmIChzZWdtZW50Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAvLyBPcmlnaW5hbCBzb3VyY2UuXG4gICAgICAgICAgbWFwcGluZy5zb3VyY2UgPSBwcmV2aW91c1NvdXJjZSArIHNlZ21lbnRbMV07XG4gICAgICAgICAgcHJldmlvdXNTb3VyY2UgKz0gc2VnbWVudFsxXTtcblxuICAgICAgICAgIC8vIE9yaWdpbmFsIGxpbmUuXG4gICAgICAgICAgbWFwcGluZy5vcmlnaW5hbExpbmUgPSBwcmV2aW91c09yaWdpbmFsTGluZSArIHNlZ21lbnRbMl07XG4gICAgICAgICAgcHJldmlvdXNPcmlnaW5hbExpbmUgPSBtYXBwaW5nLm9yaWdpbmFsTGluZTtcbiAgICAgICAgICAvLyBMaW5lcyBhcmUgc3RvcmVkIDAtYmFzZWRcbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsTGluZSArPSAxO1xuXG4gICAgICAgICAgLy8gT3JpZ2luYWwgY29sdW1uLlxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxDb2x1bW4gPSBwcmV2aW91c09yaWdpbmFsQ29sdW1uICsgc2VnbWVudFszXTtcbiAgICAgICAgICBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gbWFwcGluZy5vcmlnaW5hbENvbHVtbjtcblxuICAgICAgICAgIGlmIChzZWdtZW50Lmxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgIC8vIE9yaWdpbmFsIG5hbWUuXG4gICAgICAgICAgICBtYXBwaW5nLm5hbWUgPSBwcmV2aW91c05hbWUgKyBzZWdtZW50WzRdO1xuICAgICAgICAgICAgcHJldmlvdXNOYW1lICs9IHNlZ21lbnRbNF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2VuZXJhdGVkTWFwcGluZ3MucHVzaChtYXBwaW5nKTtcbiAgICAgICAgaWYgKHR5cGVvZiBtYXBwaW5nLm9yaWdpbmFsTGluZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBvcmlnaW5hbE1hcHBpbmdzLnB1c2gobWFwcGluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBxdWlja1NvcnQoZ2VuZXJhdGVkTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQpO1xuICAgIHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IGdlbmVyYXRlZE1hcHBpbmdzO1xuXG4gICAgcXVpY2tTb3J0KG9yaWdpbmFsTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMpO1xuICAgIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzID0gb3JpZ2luYWxNYXBwaW5ncztcbiAgfTtcblxuLyoqXG4gKiBGaW5kIHRoZSBtYXBwaW5nIHRoYXQgYmVzdCBtYXRjaGVzIHRoZSBoeXBvdGhldGljYWwgXCJuZWVkbGVcIiBtYXBwaW5nIHRoYXRcbiAqIHdlIGFyZSBzZWFyY2hpbmcgZm9yIGluIHRoZSBnaXZlbiBcImhheXN0YWNrXCIgb2YgbWFwcGluZ3MuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9maW5kTWFwcGluZyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2ZpbmRNYXBwaW5nKGFOZWVkbGUsIGFNYXBwaW5ncywgYUxpbmVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhQ29sdW1uTmFtZSwgYUNvbXBhcmF0b3IsIGFCaWFzKSB7XG4gICAgLy8gVG8gcmV0dXJuIHRoZSBwb3NpdGlvbiB3ZSBhcmUgc2VhcmNoaW5nIGZvciwgd2UgbXVzdCBmaXJzdCBmaW5kIHRoZVxuICAgIC8vIG1hcHBpbmcgZm9yIHRoZSBnaXZlbiBwb3NpdGlvbiBhbmQgdGhlbiByZXR1cm4gdGhlIG9wcG9zaXRlIHBvc2l0aW9uIGl0XG4gICAgLy8gcG9pbnRzIHRvLiBCZWNhdXNlIHRoZSBtYXBwaW5ncyBhcmUgc29ydGVkLCB3ZSBjYW4gdXNlIGJpbmFyeSBzZWFyY2ggdG9cbiAgICAvLyBmaW5kIHRoZSBiZXN0IG1hcHBpbmcuXG5cbiAgICBpZiAoYU5lZWRsZVthTGluZU5hbWVdIDw9IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0xpbmUgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMSwgZ290ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKyBhTmVlZGxlW2FMaW5lTmFtZV0pO1xuICAgIH1cbiAgICBpZiAoYU5lZWRsZVthQ29sdW1uTmFtZV0gPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDb2x1bW4gbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMCwgZ290ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKyBhTmVlZGxlW2FDb2x1bW5OYW1lXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJpbmFyeVNlYXJjaC5zZWFyY2goYU5lZWRsZSwgYU1hcHBpbmdzLCBhQ29tcGFyYXRvciwgYUJpYXMpO1xuICB9O1xuXG4vKipcbiAqIENvbXB1dGUgdGhlIGxhc3QgY29sdW1uIGZvciBlYWNoIGdlbmVyYXRlZCBtYXBwaW5nLiBUaGUgbGFzdCBjb2x1bW4gaXNcbiAqIGluY2x1c2l2ZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuY29tcHV0ZUNvbHVtblNwYW5zID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfY29tcHV0ZUNvbHVtblNwYW5zKCkge1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncy5sZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICAvLyBNYXBwaW5ncyBkbyBub3QgY29udGFpbiBhIGZpZWxkIGZvciB0aGUgbGFzdCBnZW5lcmF0ZWQgY29sdW1udC4gV2VcbiAgICAgIC8vIGNhbiBjb21lIHVwIHdpdGggYW4gb3B0aW1pc3RpYyBlc3RpbWF0ZSwgaG93ZXZlciwgYnkgYXNzdW1pbmcgdGhhdFxuICAgICAgLy8gbWFwcGluZ3MgYXJlIGNvbnRpZ3VvdXMgKGkuZS4gZ2l2ZW4gdHdvIGNvbnNlY3V0aXZlIG1hcHBpbmdzLCB0aGVcbiAgICAgIC8vIGZpcnN0IG1hcHBpbmcgZW5kcyB3aGVyZSB0aGUgc2Vjb25kIG9uZSBzdGFydHMpLlxuICAgICAgaWYgKGluZGV4ICsgMSA8IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzLmxlbmd0aCkge1xuICAgICAgICB2YXIgbmV4dE1hcHBpbmcgPSB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5nc1tpbmRleCArIDFdO1xuXG4gICAgICAgIGlmIChtYXBwaW5nLmdlbmVyYXRlZExpbmUgPT09IG5leHRNYXBwaW5nLmdlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgICBtYXBwaW5nLmxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBuZXh0TWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gLSAxO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBsYXN0IG1hcHBpbmcgZm9yIGVhY2ggbGluZSBzcGFucyB0aGUgZW50aXJlIGxpbmUuXG4gICAgICBtYXBwaW5nLmxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBJbmZpbml0eTtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgb3JpZ2luYWwgc291cmNlLCBsaW5lLCBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgZ2VuZXJhdGVkXG4gKiBzb3VyY2UncyBsaW5lIGFuZCBjb2x1bW4gcG9zaXRpb25zIHByb3ZpZGVkLiBUaGUgb25seSBhcmd1bWVudCBpcyBhbiBvYmplY3RcbiAqIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS5cbiAqICAgLSBiaWFzOiBFaXRoZXIgJ1NvdXJjZU1hcENvbnN1bWVyLkdSRUFURVNUX0xPV0VSX0JPVU5EJyBvclxuICogICAgICdTb3VyY2VNYXBDb25zdW1lci5MRUFTVF9VUFBFUl9CT1VORCcuIFNwZWNpZmllcyB3aGV0aGVyIHRvIHJldHVybiB0aGVcbiAqICAgICBjbG9zZXN0IGVsZW1lbnQgdGhhdCBpcyBzbWFsbGVyIHRoYW4gb3IgZ3JlYXRlciB0aGFuIHRoZSBvbmUgd2UgYXJlXG4gKiAgICAgc2VhcmNoaW5nIGZvciwgcmVzcGVjdGl2ZWx5LCBpZiB0aGUgZXhhY3QgZWxlbWVudCBjYW5ub3QgYmUgZm91bmQuXG4gKiAgICAgRGVmYXVsdHMgdG8gJ1NvdXJjZU1hcENvbnN1bWVyLkdSRUFURVNUX0xPV0VSX0JPVU5EJy5cbiAqXG4gKiBhbmQgYW4gb2JqZWN0IGlzIHJldHVybmVkIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBzb3VyY2U6IFRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZSwgb3IgbnVsbC5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UsIG9yIG51bGwuXG4gKiAgIC0gbmFtZTogVGhlIG9yaWdpbmFsIGlkZW50aWZpZXIsIG9yIG51bGwuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLm9yaWdpbmFsUG9zaXRpb25Gb3IgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9vcmlnaW5hbFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgdmFyIG5lZWRsZSA9IHtcbiAgICAgIGdlbmVyYXRlZExpbmU6IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbGluZScpLFxuICAgICAgZ2VuZXJhdGVkQ29sdW1uOiB1dGlsLmdldEFyZyhhQXJncywgJ2NvbHVtbicpXG4gICAgfTtcblxuICAgIHZhciBpbmRleCA9IHRoaXMuX2ZpbmRNYXBwaW5nKFxuICAgICAgbmVlZGxlLFxuICAgICAgdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3MsXG4gICAgICBcImdlbmVyYXRlZExpbmVcIixcbiAgICAgIFwiZ2VuZXJhdGVkQ29sdW1uXCIsXG4gICAgICB1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkLFxuICAgICAgdXRpbC5nZXRBcmcoYUFyZ3MsICdiaWFzJywgU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQpXG4gICAgKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzW2luZGV4XTtcblxuICAgICAgaWYgKG1hcHBpbmcuZ2VuZXJhdGVkTGluZSA9PT0gbmVlZGxlLmdlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdzb3VyY2UnLCBudWxsKTtcbiAgICAgICAgaWYgKHNvdXJjZSAhPT0gbnVsbCkge1xuICAgICAgICAgIHNvdXJjZSA9IHRoaXMuX3NvdXJjZXMuYXQoc291cmNlKTtcbiAgICAgICAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IHV0aWwuam9pbih0aGlzLnNvdXJjZVJvb3QsIHNvdXJjZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBuYW1lID0gdXRpbC5nZXRBcmcobWFwcGluZywgJ25hbWUnLCBudWxsKTtcbiAgICAgICAgaWYgKG5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICBuYW1lID0gdGhpcy5fbmFtZXMuYXQobmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICBsaW5lOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnb3JpZ2luYWxMaW5lJywgbnVsbCksXG4gICAgICAgICAgY29sdW1uOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnb3JpZ2luYWxDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZTogbnVsbCxcbiAgICAgIGxpbmU6IG51bGwsXG4gICAgICBjb2x1bW46IG51bGwsXG4gICAgICBuYW1lOiBudWxsXG4gICAgfTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB3ZSBoYXZlIHRoZSBzb3VyY2UgY29udGVudCBmb3IgZXZlcnkgc291cmNlIGluIHRoZSBzb3VyY2VcbiAqIG1hcCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5oYXNDb250ZW50c09mQWxsU291cmNlcyA9XG4gIGZ1bmN0aW9uIEJhc2ljU291cmNlTWFwQ29uc3VtZXJfaGFzQ29udGVudHNPZkFsbFNvdXJjZXMoKSB7XG4gICAgaWYgKCF0aGlzLnNvdXJjZXNDb250ZW50KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZXNDb250ZW50Lmxlbmd0aCA+PSB0aGlzLl9zb3VyY2VzLnNpemUoKSAmJlxuICAgICAgIXRoaXMuc291cmNlc0NvbnRlbnQuc29tZShmdW5jdGlvbiAoc2MpIHsgcmV0dXJuIHNjID09IG51bGw7IH0pO1xuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSBjb250ZW50LiBUaGUgb25seSBhcmd1bWVudCBpcyB0aGUgdXJsIG9mIHRoZVxuICogb3JpZ2luYWwgc291cmNlIGZpbGUuIFJldHVybnMgbnVsbCBpZiBubyBvcmlnaW5hbCBzb3VyY2UgY29udGVudCBpc1xuICogYXZhaWxhYmxlLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5zb3VyY2VDb250ZW50Rm9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfc291cmNlQ29udGVudEZvcihhU291cmNlLCBudWxsT25NaXNzaW5nKSB7XG4gICAgaWYgKCF0aGlzLnNvdXJjZXNDb250ZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIGFTb3VyY2UgPSB1dGlsLnJlbGF0aXZlKHRoaXMuc291cmNlUm9vdCwgYVNvdXJjZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3NvdXJjZXMuaGFzKGFTb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VzQ29udGVudFt0aGlzLl9zb3VyY2VzLmluZGV4T2YoYVNvdXJjZSldO1xuICAgIH1cblxuICAgIHZhciB1cmw7XG4gICAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsXG4gICAgICAgICYmICh1cmwgPSB1dGlsLnVybFBhcnNlKHRoaXMuc291cmNlUm9vdCkpKSB7XG4gICAgICAvLyBYWFg6IGZpbGU6Ly8gVVJJcyBhbmQgYWJzb2x1dGUgcGF0aHMgbGVhZCB0byB1bmV4cGVjdGVkIGJlaGF2aW9yIGZvclxuICAgICAgLy8gbWFueSB1c2Vycy4gV2UgY2FuIGhlbHAgdGhlbSBvdXQgd2hlbiB0aGV5IGV4cGVjdCBmaWxlOi8vIFVSSXMgdG9cbiAgICAgIC8vIGJlaGF2ZSBsaWtlIGl0IHdvdWxkIGlmIHRoZXkgd2VyZSBydW5uaW5nIGEgbG9jYWwgSFRUUCBzZXJ2ZXIuIFNlZVxuICAgICAgLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9ODg1NTk3LlxuICAgICAgdmFyIGZpbGVVcmlBYnNQYXRoID0gYVNvdXJjZS5yZXBsYWNlKC9eZmlsZTpcXC9cXC8vLCBcIlwiKTtcbiAgICAgIGlmICh1cmwuc2NoZW1lID09IFwiZmlsZVwiXG4gICAgICAgICAgJiYgdGhpcy5fc291cmNlcy5oYXMoZmlsZVVyaUFic1BhdGgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZXNDb250ZW50W3RoaXMuX3NvdXJjZXMuaW5kZXhPZihmaWxlVXJpQWJzUGF0aCldXG4gICAgICB9XG5cbiAgICAgIGlmICgoIXVybC5wYXRoIHx8IHVybC5wYXRoID09IFwiL1wiKVxuICAgICAgICAgICYmIHRoaXMuX3NvdXJjZXMuaGFzKFwiL1wiICsgYVNvdXJjZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlc0NvbnRlbnRbdGhpcy5fc291cmNlcy5pbmRleE9mKFwiL1wiICsgYVNvdXJjZSldO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCByZWN1cnNpdmVseSBmcm9tXG4gICAgLy8gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5zb3VyY2VDb250ZW50Rm9yLiBJbiB0aGF0IGNhc2UsIHdlXG4gICAgLy8gZG9uJ3Qgd2FudCB0byB0aHJvdyBpZiB3ZSBjYW4ndCBmaW5kIHRoZSBzb3VyY2UgLSB3ZSBqdXN0IHdhbnQgdG9cbiAgICAvLyByZXR1cm4gbnVsbCwgc28gd2UgcHJvdmlkZSBhIGZsYWcgdG8gZXhpdCBncmFjZWZ1bGx5LlxuICAgIGlmIChudWxsT25NaXNzaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFTb3VyY2UgKyAnXCIgaXMgbm90IGluIHRoZSBTb3VyY2VNYXAuJyk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBvcmlnaW5hbCBzb3VyY2UsXG4gKiBsaW5lLCBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0IHdpdGhcbiAqIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgZmlsZW5hbWUgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gYmlhczogRWl0aGVyICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQnLiBTcGVjaWZpZXMgd2hldGhlciB0byByZXR1cm4gdGhlXG4gKiAgICAgY2xvc2VzdCBlbGVtZW50IHRoYXQgaXMgc21hbGxlciB0aGFuIG9yIGdyZWF0ZXIgdGhhbiB0aGUgb25lIHdlIGFyZVxuICogICAgIHNlYXJjaGluZyBmb3IsIHJlc3BlY3RpdmVseSwgaWYgdGhlIGV4YWN0IGVsZW1lbnQgY2Fubm90IGJlIGZvdW5kLlxuICogICAgIERlZmF1bHRzIHRvICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmdlbmVyYXRlZFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfZ2VuZXJhdGVkUG9zaXRpb25Gb3IoYUFyZ3MpIHtcbiAgICB2YXIgc291cmNlID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2UnKTtcbiAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIHNvdXJjZSA9IHV0aWwucmVsYXRpdmUodGhpcy5zb3VyY2VSb290LCBzb3VyY2UpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX3NvdXJjZXMuaGFzKHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxpbmU6IG51bGwsXG4gICAgICAgIGNvbHVtbjogbnVsbCxcbiAgICAgICAgbGFzdENvbHVtbjogbnVsbFxuICAgICAgfTtcbiAgICB9XG4gICAgc291cmNlID0gdGhpcy5fc291cmNlcy5pbmRleE9mKHNvdXJjZSk7XG5cbiAgICB2YXIgbmVlZGxlID0ge1xuICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICBvcmlnaW5hbExpbmU6IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbGluZScpLFxuICAgICAgb3JpZ2luYWxDb2x1bW46IHV0aWwuZ2V0QXJnKGFBcmdzLCAnY29sdW1uJylcbiAgICB9O1xuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZE1hcHBpbmcoXG4gICAgICBuZWVkbGUsXG4gICAgICB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzLFxuICAgICAgXCJvcmlnaW5hbExpbmVcIixcbiAgICAgIFwib3JpZ2luYWxDb2x1bW5cIixcbiAgICAgIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMsXG4gICAgICB1dGlsLmdldEFyZyhhQXJncywgJ2JpYXMnLCBTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORClcbiAgICApO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5fb3JpZ2luYWxNYXBwaW5nc1tpbmRleF07XG5cbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSA9PT0gbmVlZGxlLnNvdXJjZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxpbmU6IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRMaW5lJywgbnVsbCksXG4gICAgICAgICAgY29sdW1uOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnZ2VuZXJhdGVkQ29sdW1uJywgbnVsbCksXG4gICAgICAgICAgbGFzdENvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2xhc3RHZW5lcmF0ZWRDb2x1bW4nLCBudWxsKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBsaW5lOiBudWxsLFxuICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgbGFzdENvbHVtbjogbnVsbFxuICAgIH07XG4gIH07XG5cbmV4cG9ydHMuQmFzaWNTb3VyY2VNYXBDb25zdW1lciA9IEJhc2ljU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogQW4gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyIGluc3RhbmNlIHJlcHJlc2VudHMgYSBwYXJzZWQgc291cmNlIG1hcCB3aGljaFxuICogd2UgY2FuIHF1ZXJ5IGZvciBpbmZvcm1hdGlvbi4gSXQgZGlmZmVycyBmcm9tIEJhc2ljU291cmNlTWFwQ29uc3VtZXIgaW5cbiAqIHRoYXQgaXQgdGFrZXMgXCJpbmRleGVkXCIgc291cmNlIG1hcHMgKGkuZS4gb25lcyB3aXRoIGEgXCJzZWN0aW9uc1wiIGZpZWxkKSBhc1xuICogaW5wdXQuXG4gKlxuICogVGhlIG9ubHkgcGFyYW1ldGVyIGlzIGEgcmF3IHNvdXJjZSBtYXAgKGVpdGhlciBhcyBhIEpTT04gc3RyaW5nLCBvciBhbHJlYWR5XG4gKiBwYXJzZWQgdG8gYW4gb2JqZWN0KS4gQWNjb3JkaW5nIHRvIHRoZSBzcGVjIGZvciBpbmRleGVkIHNvdXJjZSBtYXBzLCB0aGV5XG4gKiBoYXZlIHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlczpcbiAqXG4gKiAgIC0gdmVyc2lvbjogV2hpY2ggdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcCBzcGVjIHRoaXMgbWFwIGlzIGZvbGxvd2luZy5cbiAqICAgLSBmaWxlOiBPcHRpb25hbC4gVGhlIGdlbmVyYXRlZCBmaWxlIHRoaXMgc291cmNlIG1hcCBpcyBhc3NvY2lhdGVkIHdpdGguXG4gKiAgIC0gc2VjdGlvbnM6IEEgbGlzdCBvZiBzZWN0aW9uIGRlZmluaXRpb25zLlxuICpcbiAqIEVhY2ggdmFsdWUgdW5kZXIgdGhlIFwic2VjdGlvbnNcIiBmaWVsZCBoYXMgdHdvIGZpZWxkczpcbiAqICAgLSBvZmZzZXQ6IFRoZSBvZmZzZXQgaW50byB0aGUgb3JpZ2luYWwgc3BlY2lmaWVkIGF0IHdoaWNoIHRoaXMgc2VjdGlvblxuICogICAgICAgYmVnaW5zIHRvIGFwcGx5LCBkZWZpbmVkIGFzIGFuIG9iamVjdCB3aXRoIGEgXCJsaW5lXCIgYW5kIFwiY29sdW1uXCJcbiAqICAgICAgIGZpZWxkLlxuICogICAtIG1hcDogQSBzb3VyY2UgbWFwIGRlZmluaXRpb24uIFRoaXMgc291cmNlIG1hcCBjb3VsZCBhbHNvIGJlIGluZGV4ZWQsXG4gKiAgICAgICBidXQgZG9lc24ndCBoYXZlIHRvIGJlLlxuICpcbiAqIEluc3RlYWQgb2YgdGhlIFwibWFwXCIgZmllbGQsIGl0J3MgYWxzbyBwb3NzaWJsZSB0byBoYXZlIGEgXCJ1cmxcIiBmaWVsZFxuICogc3BlY2lmeWluZyBhIFVSTCB0byByZXRyaWV2ZSBhIHNvdXJjZSBtYXAgZnJvbSwgYnV0IHRoYXQncyBjdXJyZW50bHlcbiAqIHVuc3VwcG9ydGVkLlxuICpcbiAqIEhlcmUncyBhbiBleGFtcGxlIHNvdXJjZSBtYXAsIHRha2VuIGZyb20gdGhlIHNvdXJjZSBtYXAgc3BlY1swXSwgYnV0XG4gKiBtb2RpZmllZCB0byBvbWl0IGEgc2VjdGlvbiB3aGljaCB1c2VzIHRoZSBcInVybFwiIGZpZWxkLlxuICpcbiAqICB7XG4gKiAgICB2ZXJzaW9uIDogMyxcbiAqICAgIGZpbGU6IFwiYXBwLmpzXCIsXG4gKiAgICBzZWN0aW9uczogW3tcbiAqICAgICAgb2Zmc2V0OiB7bGluZToxMDAsIGNvbHVtbjoxMH0sXG4gKiAgICAgIG1hcDoge1xuICogICAgICAgIHZlcnNpb24gOiAzLFxuICogICAgICAgIGZpbGU6IFwic2VjdGlvbi5qc1wiLFxuICogICAgICAgIHNvdXJjZXM6IFtcImZvby5qc1wiLCBcImJhci5qc1wiXSxcbiAqICAgICAgICBuYW1lczogW1wic3JjXCIsIFwibWFwc1wiLCBcImFyZVwiLCBcImZ1blwiXSxcbiAqICAgICAgICBtYXBwaW5nczogXCJBQUFBLEU7O0FCQ0RFO1wiXG4gKiAgICAgIH1cbiAqICAgIH1dLFxuICogIH1cbiAqXG4gKiBbMF06IGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL2RvY3VtZW50L2QvMVUxUkdBZWhRd1J5cFVUb3ZGMUtSbHBpT0Z6ZTBiLV8yZ2M2ZkFIMEtZMGsvZWRpdCNoZWFkaW5nPWguNTM1ZXMzeGVwcmd0XG4gKi9cbmZ1bmN0aW9uIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcihhU291cmNlTWFwKSB7XG4gIHZhciBzb3VyY2VNYXAgPSBhU291cmNlTWFwO1xuICBpZiAodHlwZW9mIGFTb3VyY2VNYXAgPT09ICdzdHJpbmcnKSB7XG4gICAgc291cmNlTWFwID0gSlNPTi5wYXJzZShhU291cmNlTWFwLnJlcGxhY2UoL15cXClcXF1cXH0nLywgJycpKTtcbiAgfVxuXG4gIHZhciB2ZXJzaW9uID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAndmVyc2lvbicpO1xuICB2YXIgc2VjdGlvbnMgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdzZWN0aW9ucycpO1xuXG4gIGlmICh2ZXJzaW9uICE9IHRoaXMuX3ZlcnNpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHZlcnNpb246ICcgKyB2ZXJzaW9uKTtcbiAgfVxuXG4gIHRoaXMuX3NvdXJjZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbmFtZXMgPSBuZXcgQXJyYXlTZXQoKTtcblxuICB2YXIgbGFzdE9mZnNldCA9IHtcbiAgICBsaW5lOiAtMSxcbiAgICBjb2x1bW46IDBcbiAgfTtcbiAgdGhpcy5fc2VjdGlvbnMgPSBzZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICBpZiAocy51cmwpIHtcbiAgICAgIC8vIFRoZSB1cmwgZmllbGQgd2lsbCByZXF1aXJlIHN1cHBvcnQgZm9yIGFzeW5jaHJvbmljaXR5LlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvaXNzdWVzLzE2XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1cHBvcnQgZm9yIHVybCBmaWVsZCBpbiBzZWN0aW9ucyBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxuICAgIHZhciBvZmZzZXQgPSB1dGlsLmdldEFyZyhzLCAnb2Zmc2V0Jyk7XG4gICAgdmFyIG9mZnNldExpbmUgPSB1dGlsLmdldEFyZyhvZmZzZXQsICdsaW5lJyk7XG4gICAgdmFyIG9mZnNldENvbHVtbiA9IHV0aWwuZ2V0QXJnKG9mZnNldCwgJ2NvbHVtbicpO1xuXG4gICAgaWYgKG9mZnNldExpbmUgPCBsYXN0T2Zmc2V0LmxpbmUgfHxcbiAgICAgICAgKG9mZnNldExpbmUgPT09IGxhc3RPZmZzZXQubGluZSAmJiBvZmZzZXRDb2x1bW4gPCBsYXN0T2Zmc2V0LmNvbHVtbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2VjdGlvbiBvZmZzZXRzIG11c3QgYmUgb3JkZXJlZCBhbmQgbm9uLW92ZXJsYXBwaW5nLicpO1xuICAgIH1cbiAgICBsYXN0T2Zmc2V0ID0gb2Zmc2V0O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdlbmVyYXRlZE9mZnNldDoge1xuICAgICAgICAvLyBUaGUgb2Zmc2V0IGZpZWxkcyBhcmUgMC1iYXNlZCwgYnV0IHdlIHVzZSAxLWJhc2VkIGluZGljZXMgd2hlblxuICAgICAgICAvLyBlbmNvZGluZy9kZWNvZGluZyBmcm9tIFZMUS5cbiAgICAgICAgZ2VuZXJhdGVkTGluZTogb2Zmc2V0TGluZSArIDEsXG4gICAgICAgIGdlbmVyYXRlZENvbHVtbjogb2Zmc2V0Q29sdW1uICsgMVxuICAgICAgfSxcbiAgICAgIGNvbnN1bWVyOiBuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC5nZXRBcmcocywgJ21hcCcpKVxuICAgIH1cbiAgfSk7XG59XG5cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSk7XG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogVGhlIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXBwaW5nIHNwZWMgdGhhdCB3ZSBhcmUgY29uc3VtaW5nLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLyoqXG4gKiBUaGUgbGlzdCBvZiBvcmlnaW5hbCBzb3VyY2VzLlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSwgJ3NvdXJjZXMnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzb3VyY2VzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9zZWN0aW9uc1tpXS5jb25zdW1lci5zb3VyY2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHNvdXJjZXMucHVzaCh0aGlzLl9zZWN0aW9uc1tpXS5jb25zdW1lci5zb3VyY2VzW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZXM7XG4gIH1cbn0pO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSwgbGluZSwgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGdlbmVyYXRlZFxuICogc291cmNlJ3MgbGluZSBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKiB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgb3JpZ2luYWwgc291cmNlIGZpbGUsIG9yIG51bGwuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UsIG9yIG51bGwuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLCBvciBudWxsLlxuICogICAtIG5hbWU6IFRoZSBvcmlnaW5hbCBpZGVudGlmaWVyLCBvciBudWxsLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLm9yaWdpbmFsUG9zaXRpb25Gb3IgPVxuICBmdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXJfb3JpZ2luYWxQb3NpdGlvbkZvcihhQXJncykge1xuICAgIHZhciBuZWVkbGUgPSB7XG4gICAgICBnZW5lcmF0ZWRMaW5lOiB1dGlsLmdldEFyZyhhQXJncywgJ2xpbmUnKSxcbiAgICAgIGdlbmVyYXRlZENvbHVtbjogdXRpbC5nZXRBcmcoYUFyZ3MsICdjb2x1bW4nKVxuICAgIH07XG5cbiAgICAvLyBGaW5kIHRoZSBzZWN0aW9uIGNvbnRhaW5pbmcgdGhlIGdlbmVyYXRlZCBwb3NpdGlvbiB3ZSdyZSB0cnlpbmcgdG8gbWFwXG4gICAgLy8gdG8gYW4gb3JpZ2luYWwgcG9zaXRpb24uXG4gICAgdmFyIHNlY3Rpb25JbmRleCA9IGJpbmFyeVNlYXJjaC5zZWFyY2gobmVlZGxlLCB0aGlzLl9zZWN0aW9ucyxcbiAgICAgIGZ1bmN0aW9uKG5lZWRsZSwgc2VjdGlvbikge1xuICAgICAgICB2YXIgY21wID0gbmVlZGxlLmdlbmVyYXRlZExpbmUgLSBzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lO1xuICAgICAgICBpZiAoY21wKSB7XG4gICAgICAgICAgcmV0dXJuIGNtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAobmVlZGxlLmdlbmVyYXRlZENvbHVtbiAtXG4gICAgICAgICAgICAgICAgc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uKTtcbiAgICAgIH0pO1xuICAgIHZhciBzZWN0aW9uID0gdGhpcy5fc2VjdGlvbnNbc2VjdGlvbkluZGV4XTtcblxuICAgIGlmICghc2VjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc291cmNlOiBudWxsLFxuICAgICAgICBsaW5lOiBudWxsLFxuICAgICAgICBjb2x1bW46IG51bGwsXG4gICAgICAgIG5hbWU6IG51bGxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlY3Rpb24uY29uc3VtZXIub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgICBsaW5lOiBuZWVkbGUuZ2VuZXJhdGVkTGluZSAtXG4gICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lIC0gMSksXG4gICAgICBjb2x1bW46IG5lZWRsZS5nZW5lcmF0ZWRDb2x1bW4gLVxuICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSA9PT0gbmVlZGxlLmdlbmVyYXRlZExpbmVcbiAgICAgICAgID8gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uIC0gMVxuICAgICAgICAgOiAwKSxcbiAgICAgIGJpYXM6IGFBcmdzLmJpYXNcbiAgICB9KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB3ZSBoYXZlIHRoZSBzb3VyY2UgY29udGVudCBmb3IgZXZlcnkgc291cmNlIGluIHRoZSBzb3VyY2VcbiAqIG1hcCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmhhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX2hhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzKCkge1xuICAgIHJldHVybiB0aGlzLl9zZWN0aW9ucy5ldmVyeShmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIHMuY29uc3VtZXIuaGFzQ29udGVudHNPZkFsbFNvdXJjZXMoKTtcbiAgICB9KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzb3VyY2UgY29udGVudC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgdGhlIHVybCBvZiB0aGVcbiAqIG9yaWdpbmFsIHNvdXJjZSBmaWxlLiBSZXR1cm5zIG51bGwgaWYgbm8gb3JpZ2luYWwgc291cmNlIGNvbnRlbnQgaXNcbiAqIGF2YWlsYWJsZS5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5zb3VyY2VDb250ZW50Rm9yID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX3NvdXJjZUNvbnRlbnRGb3IoYVNvdXJjZSwgbnVsbE9uTWlzc2luZykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzZWN0aW9uID0gdGhpcy5fc2VjdGlvbnNbaV07XG5cbiAgICAgIHZhciBjb250ZW50ID0gc2VjdGlvbi5jb25zdW1lci5zb3VyY2VDb250ZW50Rm9yKGFTb3VyY2UsIHRydWUpO1xuICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChudWxsT25NaXNzaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFTb3VyY2UgKyAnXCIgaXMgbm90IGluIHRoZSBTb3VyY2VNYXAuJyk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBvcmlnaW5hbCBzb3VyY2UsXG4gKiBsaW5lLCBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0IHdpdGhcbiAqIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgZmlsZW5hbWUgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuXG4gKi9cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuZ2VuZXJhdGVkUG9zaXRpb25Gb3IgPVxuICBmdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXJfZ2VuZXJhdGVkUG9zaXRpb25Gb3IoYUFyZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3NlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc2VjdGlvbiA9IHRoaXMuX3NlY3Rpb25zW2ldO1xuXG4gICAgICAvLyBPbmx5IGNvbnNpZGVyIHRoaXMgc2VjdGlvbiBpZiB0aGUgcmVxdWVzdGVkIHNvdXJjZSBpcyBpbiB0aGUgbGlzdCBvZlxuICAgICAgLy8gc291cmNlcyBvZiB0aGUgY29uc3VtZXIuXG4gICAgICBpZiAoc2VjdGlvbi5jb25zdW1lci5zb3VyY2VzLmluZGV4T2YodXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2UnKSkgPT09IC0xKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdmFyIGdlbmVyYXRlZFBvc2l0aW9uID0gc2VjdGlvbi5jb25zdW1lci5nZW5lcmF0ZWRQb3NpdGlvbkZvcihhQXJncyk7XG4gICAgICBpZiAoZ2VuZXJhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgdmFyIHJldCA9IHtcbiAgICAgICAgICBsaW5lOiBnZW5lcmF0ZWRQb3NpdGlvbi5saW5lICtcbiAgICAgICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lIC0gMSksXG4gICAgICAgICAgY29sdW1uOiBnZW5lcmF0ZWRQb3NpdGlvbi5jb2x1bW4gK1xuICAgICAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgPT09IGdlbmVyYXRlZFBvc2l0aW9uLmxpbmVcbiAgICAgICAgICAgICA/IHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZENvbHVtbiAtIDFcbiAgICAgICAgICAgICA6IDApXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmU6IG51bGwsXG4gICAgICBjb2x1bW46IG51bGxcbiAgICB9O1xuICB9O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBtYXBwaW5ncyBpbiBhIHN0cmluZyBpbiB0byBhIGRhdGEgc3RydWN0dXJlIHdoaWNoIHdlIGNhbiBlYXNpbHlcbiAqIHF1ZXJ5ICh0aGUgb3JkZXJlZCBhcnJheXMgaW4gdGhlIGB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3NgIGFuZFxuICogYHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzYCBwcm9wZXJ0aWVzKS5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fcGFyc2VNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcl9wYXJzZU1hcHBpbmdzKGFTdHIsIGFTb3VyY2VSb290KSB7XG4gICAgdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzID0gW107XG4gICAgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3NlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc2VjdGlvbiA9IHRoaXMuX3NlY3Rpb25zW2ldO1xuICAgICAgdmFyIHNlY3Rpb25NYXBwaW5ncyA9IHNlY3Rpb24uY29uc3VtZXIuX2dlbmVyYXRlZE1hcHBpbmdzO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzZWN0aW9uTWFwcGluZ3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdmFyIG1hcHBpbmcgPSBzZWN0aW9uTWFwcGluZ3Nbal07XG5cbiAgICAgICAgdmFyIHNvdXJjZSA9IHNlY3Rpb24uY29uc3VtZXIuX3NvdXJjZXMuYXQobWFwcGluZy5zb3VyY2UpO1xuICAgICAgICBpZiAoc2VjdGlvbi5jb25zdW1lci5zb3VyY2VSb290ICE9PSBudWxsKSB7XG4gICAgICAgICAgc291cmNlID0gdXRpbC5qb2luKHNlY3Rpb24uY29uc3VtZXIuc291cmNlUm9vdCwgc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zb3VyY2VzLmFkZChzb3VyY2UpO1xuICAgICAgICBzb3VyY2UgPSB0aGlzLl9zb3VyY2VzLmluZGV4T2Yoc291cmNlKTtcblxuICAgICAgICB2YXIgbmFtZSA9IHNlY3Rpb24uY29uc3VtZXIuX25hbWVzLmF0KG1hcHBpbmcubmFtZSk7XG4gICAgICAgIHRoaXMuX25hbWVzLmFkZChuYW1lKTtcbiAgICAgICAgbmFtZSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG5cbiAgICAgICAgLy8gVGhlIG1hcHBpbmdzIGNvbWluZyBmcm9tIHRoZSBjb25zdW1lciBmb3IgdGhlIHNlY3Rpb24gaGF2ZVxuICAgICAgICAvLyBnZW5lcmF0ZWQgcG9zaXRpb25zIHJlbGF0aXZlIHRvIHRoZSBzdGFydCBvZiB0aGUgc2VjdGlvbiwgc28gd2VcbiAgICAgICAgLy8gbmVlZCB0byBvZmZzZXQgdGhlbSB0byBiZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgb2YgdGhlIGNvbmNhdGVuYXRlZFxuICAgICAgICAvLyBnZW5lcmF0ZWQgZmlsZS5cbiAgICAgICAgdmFyIGFkanVzdGVkTWFwcGluZyA9IHtcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICBnZW5lcmF0ZWRMaW5lOiBtYXBwaW5nLmdlbmVyYXRlZExpbmUgK1xuICAgICAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgLSAxKSxcbiAgICAgICAgICBnZW5lcmF0ZWRDb2x1bW46IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uICtcbiAgICAgICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lID09PSBtYXBwaW5nLmdlbmVyYXRlZExpbmVcbiAgICAgICAgICAgID8gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uIC0gMVxuICAgICAgICAgICAgOiAwKSxcbiAgICAgICAgICBvcmlnaW5hbExpbmU6IG1hcHBpbmcub3JpZ2luYWxMaW5lLFxuICAgICAgICAgIG9yaWdpbmFsQ29sdW1uOiBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uLFxuICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MucHVzaChhZGp1c3RlZE1hcHBpbmcpO1xuICAgICAgICBpZiAodHlwZW9mIGFkanVzdGVkTWFwcGluZy5vcmlnaW5hbExpbmUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3MucHVzaChhZGp1c3RlZE1hcHBpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcXVpY2tTb3J0KHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncywgdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZCk7XG4gICAgcXVpY2tTb3J0KHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKTtcbiAgfTtcblxuZXhwb3J0cy5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIgPSBJbmRleGVkU291cmNlTWFwQ29uc3VtZXI7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciBiYXNlNjRWTFEgPSByZXF1aXJlKCcuL2Jhc2U2NC12bHEnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgQXJyYXlTZXQgPSByZXF1aXJlKCcuL2FycmF5LXNldCcpLkFycmF5U2V0O1xudmFyIE1hcHBpbmdMaXN0ID0gcmVxdWlyZSgnLi9tYXBwaW5nLWxpc3QnKS5NYXBwaW5nTGlzdDtcblxuLyoqXG4gKiBBbiBpbnN0YW5jZSBvZiB0aGUgU291cmNlTWFwR2VuZXJhdG9yIHJlcHJlc2VudHMgYSBzb3VyY2UgbWFwIHdoaWNoIGlzXG4gKiBiZWluZyBidWlsdCBpbmNyZW1lbnRhbGx5LiBZb3UgbWF5IHBhc3MgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZ1xuICogcHJvcGVydGllczpcbiAqXG4gKiAgIC0gZmlsZTogVGhlIGZpbGVuYW1lIG9mIHRoZSBnZW5lcmF0ZWQgc291cmNlLlxuICogICAtIHNvdXJjZVJvb3Q6IEEgcm9vdCBmb3IgYWxsIHJlbGF0aXZlIFVSTHMgaW4gdGhpcyBzb3VyY2UgbWFwLlxuICovXG5mdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3IoYUFyZ3MpIHtcbiAgaWYgKCFhQXJncykge1xuICAgIGFBcmdzID0ge307XG4gIH1cbiAgdGhpcy5fZmlsZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnZmlsZScsIG51bGwpO1xuICB0aGlzLl9zb3VyY2VSb290ID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2VSb290JywgbnVsbCk7XG4gIHRoaXMuX3NraXBWYWxpZGF0aW9uID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdza2lwVmFsaWRhdGlvbicsIGZhbHNlKTtcbiAgdGhpcy5fc291cmNlcyA9IG5ldyBBcnJheVNldCgpO1xuICB0aGlzLl9uYW1lcyA9IG5ldyBBcnJheVNldCgpO1xuICB0aGlzLl9tYXBwaW5ncyA9IG5ldyBNYXBwaW5nTGlzdCgpO1xuICB0aGlzLl9zb3VyY2VzQ29udGVudHMgPSBudWxsO1xufVxuXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFNvdXJjZU1hcEdlbmVyYXRvciBiYXNlZCBvbiBhIFNvdXJjZU1hcENvbnN1bWVyXG4gKlxuICogQHBhcmFtIGFTb3VyY2VNYXBDb25zdW1lciBUaGUgU291cmNlTWFwLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IuZnJvbVNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl9mcm9tU291cmNlTWFwKGFTb3VyY2VNYXBDb25zdW1lcikge1xuICAgIHZhciBzb3VyY2VSb290ID0gYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZVJvb3Q7XG4gICAgdmFyIGdlbmVyYXRvciA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgICAgZmlsZTogYVNvdXJjZU1hcENvbnN1bWVyLmZpbGUsXG4gICAgICBzb3VyY2VSb290OiBzb3VyY2VSb290XG4gICAgfSk7XG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLmVhY2hNYXBwaW5nKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgICB2YXIgbmV3TWFwcGluZyA9IHtcbiAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgbGluZTogbWFwcGluZy5nZW5lcmF0ZWRMaW5lLFxuICAgICAgICAgIGNvbHVtbjogbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW5cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKG1hcHBpbmcuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgbmV3TWFwcGluZy5zb3VyY2UgPSBtYXBwaW5nLnNvdXJjZTtcbiAgICAgICAgaWYgKHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICAgIG5ld01hcHBpbmcuc291cmNlID0gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBuZXdNYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdNYXBwaW5nLm9yaWdpbmFsID0ge1xuICAgICAgICAgIGxpbmU6IG1hcHBpbmcub3JpZ2luYWxMaW5lLFxuICAgICAgICAgIGNvbHVtbjogbWFwcGluZy5vcmlnaW5hbENvbHVtblxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChtYXBwaW5nLm5hbWUgIT0gbnVsbCkge1xuICAgICAgICAgIG5ld01hcHBpbmcubmFtZSA9IG1hcHBpbmcubmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnZW5lcmF0b3IuYWRkTWFwcGluZyhuZXdNYXBwaW5nKTtcbiAgICB9KTtcbiAgICBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2VGaWxlKSB7XG4gICAgICB2YXIgY29udGVudCA9IGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VDb250ZW50Rm9yKHNvdXJjZUZpbGUpO1xuICAgICAgaWYgKGNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgICBnZW5lcmF0b3Iuc2V0U291cmNlQ29udGVudChzb3VyY2VGaWxlLCBjb250ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9O1xuXG4vKipcbiAqIEFkZCBhIHNpbmdsZSBtYXBwaW5nIGZyb20gb3JpZ2luYWwgc291cmNlIGxpbmUgYW5kIGNvbHVtbiB0byB0aGUgZ2VuZXJhdGVkXG4gKiBzb3VyY2UncyBsaW5lIGFuZCBjb2x1bW4gZm9yIHRoaXMgc291cmNlIG1hcCBiZWluZyBjcmVhdGVkLiBUaGUgbWFwcGluZ1xuICogb2JqZWN0IHNob3VsZCBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gZ2VuZXJhdGVkOiBBbiBvYmplY3Qgd2l0aCB0aGUgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiBwb3NpdGlvbnMuXG4gKiAgIC0gb3JpZ2luYWw6IEFuIG9iamVjdCB3aXRoIHRoZSBvcmlnaW5hbCBsaW5lIGFuZCBjb2x1bW4gcG9zaXRpb25zLlxuICogICAtIHNvdXJjZTogVGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlIChyZWxhdGl2ZSB0byB0aGUgc291cmNlUm9vdCkuXG4gKiAgIC0gbmFtZTogQW4gb3B0aW9uYWwgb3JpZ2luYWwgdG9rZW4gbmFtZSBmb3IgdGhpcyBtYXBwaW5nLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLmFkZE1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfYWRkTWFwcGluZyhhQXJncykge1xuICAgIHZhciBnZW5lcmF0ZWQgPSB1dGlsLmdldEFyZyhhQXJncywgJ2dlbmVyYXRlZCcpO1xuICAgIHZhciBvcmlnaW5hbCA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnb3JpZ2luYWwnLCBudWxsKTtcbiAgICB2YXIgc291cmNlID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2UnLCBudWxsKTtcbiAgICB2YXIgbmFtZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbmFtZScsIG51bGwpO1xuXG4gICAgaWYgKCF0aGlzLl9za2lwVmFsaWRhdGlvbikge1xuICAgICAgdGhpcy5fdmFsaWRhdGVNYXBwaW5nKGdlbmVyYXRlZCwgb3JpZ2luYWwsIHNvdXJjZSwgbmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKHNvdXJjZSAhPSBudWxsKSB7XG4gICAgICBzb3VyY2UgPSBTdHJpbmcoc291cmNlKTtcbiAgICAgIGlmICghdGhpcy5fc291cmNlcy5oYXMoc291cmNlKSkge1xuICAgICAgICB0aGlzLl9zb3VyY2VzLmFkZChzb3VyY2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgICBpZiAoIXRoaXMuX25hbWVzLmhhcyhuYW1lKSkge1xuICAgICAgICB0aGlzLl9uYW1lcy5hZGQobmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fbWFwcGluZ3MuYWRkKHtcbiAgICAgIGdlbmVyYXRlZExpbmU6IGdlbmVyYXRlZC5saW5lLFxuICAgICAgZ2VuZXJhdGVkQ29sdW1uOiBnZW5lcmF0ZWQuY29sdW1uLFxuICAgICAgb3JpZ2luYWxMaW5lOiBvcmlnaW5hbCAhPSBudWxsICYmIG9yaWdpbmFsLmxpbmUsXG4gICAgICBvcmlnaW5hbENvbHVtbjogb3JpZ2luYWwgIT0gbnVsbCAmJiBvcmlnaW5hbC5jb2x1bW4sXG4gICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9KTtcbiAgfTtcblxuLyoqXG4gKiBTZXQgdGhlIHNvdXJjZSBjb250ZW50IGZvciBhIHNvdXJjZSBmaWxlLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLnNldFNvdXJjZUNvbnRlbnQgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3Jfc2V0U291cmNlQ29udGVudChhU291cmNlRmlsZSwgYVNvdXJjZUNvbnRlbnQpIHtcbiAgICB2YXIgc291cmNlID0gYVNvdXJjZUZpbGU7XG4gICAgaWYgKHRoaXMuX3NvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgc291cmNlID0gdXRpbC5yZWxhdGl2ZSh0aGlzLl9zb3VyY2VSb290LCBzb3VyY2UpO1xuICAgIH1cblxuICAgIGlmIChhU291cmNlQ29udGVudCAhPSBudWxsKSB7XG4gICAgICAvLyBBZGQgdGhlIHNvdXJjZSBjb250ZW50IHRvIHRoZSBfc291cmNlc0NvbnRlbnRzIG1hcC5cbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBfc291cmNlc0NvbnRlbnRzIG1hcCBpZiB0aGUgcHJvcGVydHkgaXMgbnVsbC5cbiAgICAgIGlmICghdGhpcy5fc291cmNlc0NvbnRlbnRzKSB7XG4gICAgICAgIHRoaXMuX3NvdXJjZXNDb250ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9zb3VyY2VzQ29udGVudHNbdXRpbC50b1NldFN0cmluZyhzb3VyY2UpXSA9IGFTb3VyY2VDb250ZW50O1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc291cmNlc0NvbnRlbnRzKSB7XG4gICAgICAvLyBSZW1vdmUgdGhlIHNvdXJjZSBmaWxlIGZyb20gdGhlIF9zb3VyY2VzQ29udGVudHMgbWFwLlxuICAgICAgLy8gSWYgdGhlIF9zb3VyY2VzQ29udGVudHMgbWFwIGlzIGVtcHR5LCBzZXQgdGhlIHByb3BlcnR5IHRvIG51bGwuXG4gICAgICBkZWxldGUgdGhpcy5fc291cmNlc0NvbnRlbnRzW3V0aWwudG9TZXRTdHJpbmcoc291cmNlKV07XG4gICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5fc291cmNlc0NvbnRlbnRzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fc291cmNlc0NvbnRlbnRzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbi8qKlxuICogQXBwbGllcyB0aGUgbWFwcGluZ3Mgb2YgYSBzdWItc291cmNlLW1hcCBmb3IgYSBzcGVjaWZpYyBzb3VyY2UgZmlsZSB0byB0aGVcbiAqIHNvdXJjZSBtYXAgYmVpbmcgZ2VuZXJhdGVkLiBFYWNoIG1hcHBpbmcgdG8gdGhlIHN1cHBsaWVkIHNvdXJjZSBmaWxlIGlzXG4gKiByZXdyaXR0ZW4gdXNpbmcgdGhlIHN1cHBsaWVkIHNvdXJjZSBtYXAuIE5vdGU6IFRoZSByZXNvbHV0aW9uIGZvciB0aGVcbiAqIHJlc3VsdGluZyBtYXBwaW5ncyBpcyB0aGUgbWluaW1pdW0gb2YgdGhpcyBtYXAgYW5kIHRoZSBzdXBwbGllZCBtYXAuXG4gKlxuICogQHBhcmFtIGFTb3VyY2VNYXBDb25zdW1lciBUaGUgc291cmNlIG1hcCB0byBiZSBhcHBsaWVkLlxuICogQHBhcmFtIGFTb3VyY2VGaWxlIE9wdGlvbmFsLiBUaGUgZmlsZW5hbWUgb2YgdGhlIHNvdXJjZSBmaWxlLlxuICogICAgICAgIElmIG9taXR0ZWQsIFNvdXJjZU1hcENvbnN1bWVyJ3MgZmlsZSBwcm9wZXJ0eSB3aWxsIGJlIHVzZWQuXG4gKiBAcGFyYW0gYVNvdXJjZU1hcFBhdGggT3B0aW9uYWwuIFRoZSBkaXJuYW1lIG9mIHRoZSBwYXRoIHRvIHRoZSBzb3VyY2UgbWFwXG4gKiAgICAgICAgdG8gYmUgYXBwbGllZC4gSWYgcmVsYXRpdmUsIGl0IGlzIHJlbGF0aXZlIHRvIHRoZSBTb3VyY2VNYXBDb25zdW1lci5cbiAqICAgICAgICBUaGlzIHBhcmFtZXRlciBpcyBuZWVkZWQgd2hlbiB0aGUgdHdvIHNvdXJjZSBtYXBzIGFyZW4ndCBpbiB0aGUgc2FtZVxuICogICAgICAgIGRpcmVjdG9yeSwgYW5kIHRoZSBzb3VyY2UgbWFwIHRvIGJlIGFwcGxpZWQgY29udGFpbnMgcmVsYXRpdmUgc291cmNlXG4gKiAgICAgICAgcGF0aHMuIElmIHNvLCB0aG9zZSByZWxhdGl2ZSBzb3VyY2UgcGF0aHMgbmVlZCB0byBiZSByZXdyaXR0ZW5cbiAqICAgICAgICByZWxhdGl2ZSB0byB0aGUgU291cmNlTWFwR2VuZXJhdG9yLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLmFwcGx5U291cmNlTWFwID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX2FwcGx5U291cmNlTWFwKGFTb3VyY2VNYXBDb25zdW1lciwgYVNvdXJjZUZpbGUsIGFTb3VyY2VNYXBQYXRoKSB7XG4gICAgdmFyIHNvdXJjZUZpbGUgPSBhU291cmNlRmlsZTtcbiAgICAvLyBJZiBhU291cmNlRmlsZSBpcyBvbWl0dGVkLCB3ZSB3aWxsIHVzZSB0aGUgZmlsZSBwcm9wZXJ0eSBvZiB0aGUgU291cmNlTWFwXG4gICAgaWYgKGFTb3VyY2VGaWxlID09IG51bGwpIHtcbiAgICAgIGlmIChhU291cmNlTWFwQ29uc3VtZXIuZmlsZSA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5hcHBseVNvdXJjZU1hcCByZXF1aXJlcyBlaXRoZXIgYW4gZXhwbGljaXQgc291cmNlIGZpbGUsICcgK1xuICAgICAgICAgICdvciB0aGUgc291cmNlIG1hcFxcJ3MgXCJmaWxlXCIgcHJvcGVydHkuIEJvdGggd2VyZSBvbWl0dGVkLidcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHNvdXJjZUZpbGUgPSBhU291cmNlTWFwQ29uc3VtZXIuZmlsZTtcbiAgICB9XG4gICAgdmFyIHNvdXJjZVJvb3QgPSB0aGlzLl9zb3VyY2VSb290O1xuICAgIC8vIE1ha2UgXCJzb3VyY2VGaWxlXCIgcmVsYXRpdmUgaWYgYW4gYWJzb2x1dGUgVXJsIGlzIHBhc3NlZC5cbiAgICBpZiAoc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICBzb3VyY2VGaWxlID0gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBzb3VyY2VGaWxlKTtcbiAgICB9XG4gICAgLy8gQXBwbHlpbmcgdGhlIFNvdXJjZU1hcCBjYW4gYWRkIGFuZCByZW1vdmUgaXRlbXMgZnJvbSB0aGUgc291cmNlcyBhbmRcbiAgICAvLyB0aGUgbmFtZXMgYXJyYXkuXG4gICAgdmFyIG5ld1NvdXJjZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgICB2YXIgbmV3TmFtZXMgPSBuZXcgQXJyYXlTZXQoKTtcblxuICAgIC8vIEZpbmQgbWFwcGluZ3MgZm9yIHRoZSBcInNvdXJjZUZpbGVcIlxuICAgIHRoaXMuX21hcHBpbmdzLnVuc29ydGVkRm9yRWFjaChmdW5jdGlvbiAobWFwcGluZykge1xuICAgICAgaWYgKG1hcHBpbmcuc291cmNlID09PSBzb3VyY2VGaWxlICYmIG1hcHBpbmcub3JpZ2luYWxMaW5lICE9IG51bGwpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaXQgY2FuIGJlIG1hcHBlZCBieSB0aGUgc291cmNlIG1hcCwgdGhlbiB1cGRhdGUgdGhlIG1hcHBpbmcuXG4gICAgICAgIHZhciBvcmlnaW5hbCA9IGFTb3VyY2VNYXBDb25zdW1lci5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICAgICAgICBsaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgICBjb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW5cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcmlnaW5hbC5zb3VyY2UgIT0gbnVsbCkge1xuICAgICAgICAgIC8vIENvcHkgbWFwcGluZ1xuICAgICAgICAgIG1hcHBpbmcuc291cmNlID0gb3JpZ2luYWwuc291cmNlO1xuICAgICAgICAgIGlmIChhU291cmNlTWFwUGF0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IHV0aWwuam9pbihhU291cmNlTWFwUGF0aCwgbWFwcGluZy5zb3VyY2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1hcHBpbmcuc291cmNlID0gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBtYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxMaW5lID0gb3JpZ2luYWwubGluZTtcbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uID0gb3JpZ2luYWwuY29sdW1uO1xuICAgICAgICAgIGlmIChvcmlnaW5hbC5uYW1lICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1hcHBpbmcubmFtZSA9IG9yaWdpbmFsLm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBzb3VyY2UgPSBtYXBwaW5nLnNvdXJjZTtcbiAgICAgIGlmIChzb3VyY2UgIT0gbnVsbCAmJiAhbmV3U291cmNlcy5oYXMoc291cmNlKSkge1xuICAgICAgICBuZXdTb3VyY2VzLmFkZChzb3VyY2UpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmFtZSA9IG1hcHBpbmcubmFtZTtcbiAgICAgIGlmIChuYW1lICE9IG51bGwgJiYgIW5ld05hbWVzLmhhcyhuYW1lKSkge1xuICAgICAgICBuZXdOYW1lcy5hZGQobmFtZSk7XG4gICAgICB9XG5cbiAgICB9LCB0aGlzKTtcbiAgICB0aGlzLl9zb3VyY2VzID0gbmV3U291cmNlcztcbiAgICB0aGlzLl9uYW1lcyA9IG5ld05hbWVzO1xuXG4gICAgLy8gQ29weSBzb3VyY2VzQ29udGVudHMgb2YgYXBwbGllZCBtYXAuXG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlRmlsZSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlQ29udGVudEZvcihzb3VyY2VGaWxlKTtcbiAgICAgIGlmIChjb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGFTb3VyY2VNYXBQYXRoICE9IG51bGwpIHtcbiAgICAgICAgICBzb3VyY2VGaWxlID0gdXRpbC5qb2luKGFTb3VyY2VNYXBQYXRoLCBzb3VyY2VGaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgICAgc291cmNlRmlsZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTb3VyY2VDb250ZW50KHNvdXJjZUZpbGUsIGNvbnRlbnQpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9O1xuXG4vKipcbiAqIEEgbWFwcGluZyBjYW4gaGF2ZSBvbmUgb2YgdGhlIHRocmVlIGxldmVscyBvZiBkYXRhOlxuICpcbiAqICAgMS4gSnVzdCB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9uLlxuICogICAyLiBUaGUgR2VuZXJhdGVkIHBvc2l0aW9uLCBvcmlnaW5hbCBwb3NpdGlvbiwgYW5kIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgMy4gR2VuZXJhdGVkIGFuZCBvcmlnaW5hbCBwb3NpdGlvbiwgb3JpZ2luYWwgc291cmNlLCBhcyB3ZWxsIGFzIGEgbmFtZVxuICogICAgICB0b2tlbi5cbiAqXG4gKiBUbyBtYWludGFpbiBjb25zaXN0ZW5jeSwgd2UgdmFsaWRhdGUgdGhhdCBhbnkgbmV3IG1hcHBpbmcgYmVpbmcgYWRkZWQgZmFsbHNcbiAqIGluIHRvIG9uZSBvZiB0aGVzZSBjYXRlZ29yaWVzLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLl92YWxpZGF0ZU1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfdmFsaWRhdGVNYXBwaW5nKGFHZW5lcmF0ZWQsIGFPcmlnaW5hbCwgYVNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhTmFtZSkge1xuICAgIGlmIChhR2VuZXJhdGVkICYmICdsaW5lJyBpbiBhR2VuZXJhdGVkICYmICdjb2x1bW4nIGluIGFHZW5lcmF0ZWRcbiAgICAgICAgJiYgYUdlbmVyYXRlZC5saW5lID4gMCAmJiBhR2VuZXJhdGVkLmNvbHVtbiA+PSAwXG4gICAgICAgICYmICFhT3JpZ2luYWwgJiYgIWFTb3VyY2UgJiYgIWFOYW1lKSB7XG4gICAgICAvLyBDYXNlIDEuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsc2UgaWYgKGFHZW5lcmF0ZWQgJiYgJ2xpbmUnIGluIGFHZW5lcmF0ZWQgJiYgJ2NvbHVtbicgaW4gYUdlbmVyYXRlZFxuICAgICAgICAgICAgICYmIGFPcmlnaW5hbCAmJiAnbGluZScgaW4gYU9yaWdpbmFsICYmICdjb2x1bW4nIGluIGFPcmlnaW5hbFxuICAgICAgICAgICAgICYmIGFHZW5lcmF0ZWQubGluZSA+IDAgJiYgYUdlbmVyYXRlZC5jb2x1bW4gPj0gMFxuICAgICAgICAgICAgICYmIGFPcmlnaW5hbC5saW5lID4gMCAmJiBhT3JpZ2luYWwuY29sdW1uID49IDBcbiAgICAgICAgICAgICAmJiBhU291cmNlKSB7XG4gICAgICAvLyBDYXNlcyAyIGFuZCAzLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBtYXBwaW5nOiAnICsgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBnZW5lcmF0ZWQ6IGFHZW5lcmF0ZWQsXG4gICAgICAgIHNvdXJjZTogYVNvdXJjZSxcbiAgICAgICAgb3JpZ2luYWw6IGFPcmlnaW5hbCxcbiAgICAgICAgbmFtZTogYU5hbWVcbiAgICAgIH0pKTtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBhY2N1bXVsYXRlZCBtYXBwaW5ncyBpbiB0byB0aGUgc3RyZWFtIG9mIGJhc2UgNjQgVkxRc1xuICogc3BlY2lmaWVkIGJ5IHRoZSBzb3VyY2UgbWFwIGZvcm1hdC5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fc2VyaWFsaXplTWFwcGluZ3MgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3Jfc2VyaWFsaXplTWFwcGluZ3MoKSB7XG4gICAgdmFyIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNHZW5lcmF0ZWRMaW5lID0gMTtcbiAgICB2YXIgcHJldmlvdXNPcmlnaW5hbENvbHVtbiA9IDA7XG4gICAgdmFyIHByZXZpb3VzT3JpZ2luYWxMaW5lID0gMDtcbiAgICB2YXIgcHJldmlvdXNOYW1lID0gMDtcbiAgICB2YXIgcHJldmlvdXNTb3VyY2UgPSAwO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgbmV4dDtcbiAgICB2YXIgbWFwcGluZztcbiAgICB2YXIgbmFtZUlkeDtcbiAgICB2YXIgc291cmNlSWR4O1xuXG4gICAgdmFyIG1hcHBpbmdzID0gdGhpcy5fbWFwcGluZ3MudG9BcnJheSgpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtYXBwaW5ncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbWFwcGluZyA9IG1hcHBpbmdzW2ldO1xuICAgICAgbmV4dCA9ICcnXG5cbiAgICAgIGlmIChtYXBwaW5nLmdlbmVyYXRlZExpbmUgIT09IHByZXZpb3VzR2VuZXJhdGVkTGluZSkge1xuICAgICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgICAgIHdoaWxlIChtYXBwaW5nLmdlbmVyYXRlZExpbmUgIT09IHByZXZpb3VzR2VuZXJhdGVkTGluZSkge1xuICAgICAgICAgIG5leHQgKz0gJzsnO1xuICAgICAgICAgIHByZXZpb3VzR2VuZXJhdGVkTGluZSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgaWYgKCF1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkKG1hcHBpbmcsIG1hcHBpbmdzW2kgLSAxXSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXh0ICs9ICcsJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBuZXh0ICs9IGJhc2U2NFZMUS5lbmNvZGUobWFwcGluZy5nZW5lcmF0ZWRDb2x1bW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcblxuICAgICAgaWYgKG1hcHBpbmcuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgc291cmNlSWR4ID0gdGhpcy5fc291cmNlcy5pbmRleE9mKG1hcHBpbmcuc291cmNlKTtcbiAgICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKHNvdXJjZUlkeCAtIHByZXZpb3VzU291cmNlKTtcbiAgICAgICAgcHJldmlvdXNTb3VyY2UgPSBzb3VyY2VJZHg7XG5cbiAgICAgICAgLy8gbGluZXMgYXJlIHN0b3JlZCAwLWJhc2VkIGluIFNvdXJjZU1hcCBzcGVjIHZlcnNpb24gM1xuICAgICAgICBuZXh0ICs9IGJhc2U2NFZMUS5lbmNvZGUobWFwcGluZy5vcmlnaW5hbExpbmUgLSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gcHJldmlvdXNPcmlnaW5hbExpbmUpO1xuICAgICAgICBwcmV2aW91c09yaWdpbmFsTGluZSA9IG1hcHBpbmcub3JpZ2luYWxMaW5lIC0gMTtcblxuICAgICAgICBuZXh0ICs9IGJhc2U2NFZMUS5lbmNvZGUobWFwcGluZy5vcmlnaW5hbENvbHVtblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIHByZXZpb3VzT3JpZ2luYWxDb2x1bW4pO1xuICAgICAgICBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gbWFwcGluZy5vcmlnaW5hbENvbHVtbjtcblxuICAgICAgICBpZiAobWFwcGluZy5uYW1lICE9IG51bGwpIHtcbiAgICAgICAgICBuYW1lSWR4ID0gdGhpcy5fbmFtZXMuaW5kZXhPZihtYXBwaW5nLm5hbWUpO1xuICAgICAgICAgIG5leHQgKz0gYmFzZTY0VkxRLmVuY29kZShuYW1lSWR4IC0gcHJldmlvdXNOYW1lKTtcbiAgICAgICAgICBwcmV2aW91c05hbWUgPSBuYW1lSWR4O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdCArPSBuZXh0O1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cblNvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUuX2dlbmVyYXRlU291cmNlc0NvbnRlbnQgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfZ2VuZXJhdGVTb3VyY2VzQ29udGVudChhU291cmNlcywgYVNvdXJjZVJvb3QpIHtcbiAgICByZXR1cm4gYVNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIGlmICghdGhpcy5fc291cmNlc0NvbnRlbnRzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKGFTb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgc291cmNlID0gdXRpbC5yZWxhdGl2ZShhU291cmNlUm9vdCwgc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBrZXkgPSB1dGlsLnRvU2V0U3RyaW5nKHNvdXJjZSk7XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuX3NvdXJjZXNDb250ZW50cywga2V5KVxuICAgICAgICA/IHRoaXMuX3NvdXJjZXNDb250ZW50c1trZXldXG4gICAgICAgIDogbnVsbDtcbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuLyoqXG4gKiBFeHRlcm5hbGl6ZSB0aGUgc291cmNlIG1hcC5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS50b0pTT04gPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfdG9KU09OKCkge1xuICAgIHZhciBtYXAgPSB7XG4gICAgICB2ZXJzaW9uOiB0aGlzLl92ZXJzaW9uLFxuICAgICAgc291cmNlczogdGhpcy5fc291cmNlcy50b0FycmF5KCksXG4gICAgICBuYW1lczogdGhpcy5fbmFtZXMudG9BcnJheSgpLFxuICAgICAgbWFwcGluZ3M6IHRoaXMuX3NlcmlhbGl6ZU1hcHBpbmdzKClcbiAgICB9O1xuICAgIGlmICh0aGlzLl9maWxlICE9IG51bGwpIHtcbiAgICAgIG1hcC5maWxlID0gdGhpcy5fZmlsZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgbWFwLnNvdXJjZVJvb3QgPSB0aGlzLl9zb3VyY2VSb290O1xuICAgIH1cbiAgICBpZiAodGhpcy5fc291cmNlc0NvbnRlbnRzKSB7XG4gICAgICBtYXAuc291cmNlc0NvbnRlbnQgPSB0aGlzLl9nZW5lcmF0ZVNvdXJjZXNDb250ZW50KG1hcC5zb3VyY2VzLCBtYXAuc291cmNlUm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcDtcbiAgfTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIHNvdXJjZSBtYXAgYmVpbmcgZ2VuZXJhdGVkIHRvIGEgc3RyaW5nLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLnRvU3RyaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3RvU3RyaW5nKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnRvSlNPTigpKTtcbiAgfTtcblxuZXhwb3J0cy5Tb3VyY2VNYXBHZW5lcmF0b3IgPSBTb3VyY2VNYXBHZW5lcmF0b3I7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciBTb3VyY2VNYXBHZW5lcmF0b3IgPSByZXF1aXJlKCcuL3NvdXJjZS1tYXAtZ2VuZXJhdG9yJykuU291cmNlTWFwR2VuZXJhdG9yO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLy8gTWF0Y2hlcyBhIFdpbmRvd3Mtc3R5bGUgYFxcclxcbmAgbmV3bGluZSBvciBhIGBcXG5gIG5ld2xpbmUgdXNlZCBieSBhbGwgb3RoZXJcbi8vIG9wZXJhdGluZyBzeXN0ZW1zIHRoZXNlIGRheXMgKGNhcHR1cmluZyB0aGUgcmVzdWx0KS5cbnZhciBSRUdFWF9ORVdMSU5FID0gLyhcXHI/XFxuKS87XG5cbi8vIE5ld2xpbmUgY2hhcmFjdGVyIGNvZGUgZm9yIGNoYXJDb2RlQXQoKSBjb21wYXJpc29uc1xudmFyIE5FV0xJTkVfQ09ERSA9IDEwO1xuXG4vLyBQcml2YXRlIHN5bWJvbCBmb3IgaWRlbnRpZnlpbmcgYFNvdXJjZU5vZGVgcyB3aGVuIG11bHRpcGxlIHZlcnNpb25zIG9mXG4vLyB0aGUgc291cmNlLW1hcCBsaWJyYXJ5IGFyZSBsb2FkZWQuIFRoaXMgTVVTVCBOT1QgQ0hBTkdFIGFjcm9zc1xuLy8gdmVyc2lvbnMhXG52YXIgaXNTb3VyY2VOb2RlID0gXCIkJCRpc1NvdXJjZU5vZGUkJCRcIjtcblxuLyoqXG4gKiBTb3VyY2VOb2RlcyBwcm92aWRlIGEgd2F5IHRvIGFic3RyYWN0IG92ZXIgaW50ZXJwb2xhdGluZy9jb25jYXRlbmF0aW5nXG4gKiBzbmlwcGV0cyBvZiBnZW5lcmF0ZWQgSmF2YVNjcmlwdCBzb3VyY2UgY29kZSB3aGlsZSBtYWludGFpbmluZyB0aGUgbGluZSBhbmRcbiAqIGNvbHVtbiBpbmZvcm1hdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIG9yaWdpbmFsIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwYXJhbSBhTGluZSBUaGUgb3JpZ2luYWwgbGluZSBudW1iZXIuXG4gKiBAcGFyYW0gYUNvbHVtbiBUaGUgb3JpZ2luYWwgY29sdW1uIG51bWJlci5cbiAqIEBwYXJhbSBhU291cmNlIFRoZSBvcmlnaW5hbCBzb3VyY2UncyBmaWxlbmFtZS5cbiAqIEBwYXJhbSBhQ2h1bmtzIE9wdGlvbmFsLiBBbiBhcnJheSBvZiBzdHJpbmdzIHdoaWNoIGFyZSBzbmlwcGV0cyBvZlxuICogICAgICAgIGdlbmVyYXRlZCBKUywgb3Igb3RoZXIgU291cmNlTm9kZXMuXG4gKiBAcGFyYW0gYU5hbWUgVGhlIG9yaWdpbmFsIGlkZW50aWZpZXIuXG4gKi9cbmZ1bmN0aW9uIFNvdXJjZU5vZGUoYUxpbmUsIGFDb2x1bW4sIGFTb3VyY2UsIGFDaHVua3MsIGFOYW1lKSB7XG4gIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgdGhpcy5zb3VyY2VDb250ZW50cyA9IHt9O1xuICB0aGlzLmxpbmUgPSBhTGluZSA9PSBudWxsID8gbnVsbCA6IGFMaW5lO1xuICB0aGlzLmNvbHVtbiA9IGFDb2x1bW4gPT0gbnVsbCA/IG51bGwgOiBhQ29sdW1uO1xuICB0aGlzLnNvdXJjZSA9IGFTb3VyY2UgPT0gbnVsbCA/IG51bGwgOiBhU291cmNlO1xuICB0aGlzLm5hbWUgPSBhTmFtZSA9PSBudWxsID8gbnVsbCA6IGFOYW1lO1xuICB0aGlzW2lzU291cmNlTm9kZV0gPSB0cnVlO1xuICBpZiAoYUNodW5rcyAhPSBudWxsKSB0aGlzLmFkZChhQ2h1bmtzKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgU291cmNlTm9kZSBmcm9tIGdlbmVyYXRlZCBjb2RlIGFuZCBhIFNvdXJjZU1hcENvbnN1bWVyLlxuICpcbiAqIEBwYXJhbSBhR2VuZXJhdGVkQ29kZSBUaGUgZ2VuZXJhdGVkIGNvZGVcbiAqIEBwYXJhbSBhU291cmNlTWFwQ29uc3VtZXIgVGhlIFNvdXJjZU1hcCBmb3IgdGhlIGdlbmVyYXRlZCBjb2RlXG4gKiBAcGFyYW0gYVJlbGF0aXZlUGF0aCBPcHRpb25hbC4gVGhlIHBhdGggdGhhdCByZWxhdGl2ZSBzb3VyY2VzIGluIHRoZVxuICogICAgICAgIFNvdXJjZU1hcENvbnN1bWVyIHNob3VsZCBiZSByZWxhdGl2ZSB0by5cbiAqL1xuU291cmNlTm9kZS5mcm9tU3RyaW5nV2l0aFNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU5vZGVfZnJvbVN0cmluZ1dpdGhTb3VyY2VNYXAoYUdlbmVyYXRlZENvZGUsIGFTb3VyY2VNYXBDb25zdW1lciwgYVJlbGF0aXZlUGF0aCkge1xuICAgIC8vIFRoZSBTb3VyY2VOb2RlIHdlIHdhbnQgdG8gZmlsbCB3aXRoIHRoZSBnZW5lcmF0ZWQgY29kZVxuICAgIC8vIGFuZCB0aGUgU291cmNlTWFwXG4gICAgdmFyIG5vZGUgPSBuZXcgU291cmNlTm9kZSgpO1xuXG4gICAgLy8gQWxsIGV2ZW4gaW5kaWNlcyBvZiB0aGlzIGFycmF5IGFyZSBvbmUgbGluZSBvZiB0aGUgZ2VuZXJhdGVkIGNvZGUsXG4gICAgLy8gd2hpbGUgYWxsIG9kZCBpbmRpY2VzIGFyZSB0aGUgbmV3bGluZXMgYmV0d2VlbiB0d28gYWRqYWNlbnQgbGluZXNcbiAgICAvLyAoc2luY2UgYFJFR0VYX05FV0xJTkVgIGNhcHR1cmVzIGl0cyBtYXRjaCkuXG4gICAgLy8gUHJvY2Vzc2VkIGZyYWdtZW50cyBhcmUgcmVtb3ZlZCBmcm9tIHRoaXMgYXJyYXksIGJ5IGNhbGxpbmcgYHNoaWZ0TmV4dExpbmVgLlxuICAgIHZhciByZW1haW5pbmdMaW5lcyA9IGFHZW5lcmF0ZWRDb2RlLnNwbGl0KFJFR0VYX05FV0xJTkUpO1xuICAgIHZhciBzaGlmdE5leHRMaW5lID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGluZUNvbnRlbnRzID0gcmVtYWluaW5nTGluZXMuc2hpZnQoKTtcbiAgICAgIC8vIFRoZSBsYXN0IGxpbmUgb2YgYSBmaWxlIG1pZ2h0IG5vdCBoYXZlIGEgbmV3bGluZS5cbiAgICAgIHZhciBuZXdMaW5lID0gcmVtYWluaW5nTGluZXMuc2hpZnQoKSB8fCBcIlwiO1xuICAgICAgcmV0dXJuIGxpbmVDb250ZW50cyArIG5ld0xpbmU7XG4gICAgfTtcblxuICAgIC8vIFdlIG5lZWQgdG8gcmVtZW1iZXIgdGhlIHBvc2l0aW9uIG9mIFwicmVtYWluaW5nTGluZXNcIlxuICAgIHZhciBsYXN0R2VuZXJhdGVkTGluZSA9IDEsIGxhc3RHZW5lcmF0ZWRDb2x1bW4gPSAwO1xuXG4gICAgLy8gVGhlIGdlbmVyYXRlIFNvdXJjZU5vZGVzIHdlIG5lZWQgYSBjb2RlIHJhbmdlLlxuICAgIC8vIFRvIGV4dHJhY3QgaXQgY3VycmVudCBhbmQgbGFzdCBtYXBwaW5nIGlzIHVzZWQuXG4gICAgLy8gSGVyZSB3ZSBzdG9yZSB0aGUgbGFzdCBtYXBwaW5nLlxuICAgIHZhciBsYXN0TWFwcGluZyA9IG51bGw7XG5cbiAgICBhU291cmNlTWFwQ29uc3VtZXIuZWFjaE1hcHBpbmcoZnVuY3Rpb24gKG1hcHBpbmcpIHtcbiAgICAgIGlmIChsYXN0TWFwcGluZyAhPT0gbnVsbCkge1xuICAgICAgICAvLyBXZSBhZGQgdGhlIGNvZGUgZnJvbSBcImxhc3RNYXBwaW5nXCIgdG8gXCJtYXBwaW5nXCI6XG4gICAgICAgIC8vIEZpcnN0IGNoZWNrIGlmIHRoZXJlIGlzIGEgbmV3IGxpbmUgaW4gYmV0d2Vlbi5cbiAgICAgICAgaWYgKGxhc3RHZW5lcmF0ZWRMaW5lIDwgbWFwcGluZy5nZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgICAgLy8gQXNzb2NpYXRlIGZpcnN0IGxpbmUgd2l0aCBcImxhc3RNYXBwaW5nXCJcbiAgICAgICAgICBhZGRNYXBwaW5nV2l0aENvZGUobGFzdE1hcHBpbmcsIHNoaWZ0TmV4dExpbmUoKSk7XG4gICAgICAgICAgbGFzdEdlbmVyYXRlZExpbmUrKztcbiAgICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgICAgICAgICAvLyBUaGUgcmVtYWluaW5nIGNvZGUgaXMgYWRkZWQgd2l0aG91dCBtYXBwaW5nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlcmUgaXMgbm8gbmV3IGxpbmUgaW4gYmV0d2Vlbi5cbiAgICAgICAgICAvLyBBc3NvY2lhdGUgdGhlIGNvZGUgYmV0d2VlbiBcImxhc3RHZW5lcmF0ZWRDb2x1bW5cIiBhbmRcbiAgICAgICAgICAvLyBcIm1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uXCIgd2l0aCBcImxhc3RNYXBwaW5nXCJcbiAgICAgICAgICB2YXIgbmV4dExpbmUgPSByZW1haW5pbmdMaW5lc1swXTtcbiAgICAgICAgICB2YXIgY29kZSA9IG5leHRMaW5lLnN1YnN0cigwLCBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbiAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEdlbmVyYXRlZENvbHVtbik7XG4gICAgICAgICAgcmVtYWluaW5nTGluZXNbMF0gPSBuZXh0TGluZS5zdWJzdHIobWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcbiAgICAgICAgICBhZGRNYXBwaW5nV2l0aENvZGUobGFzdE1hcHBpbmcsIGNvZGUpO1xuICAgICAgICAgIC8vIE5vIG1vcmUgcmVtYWluaW5nIGNvZGUsIGNvbnRpbnVlXG4gICAgICAgICAgbGFzdE1hcHBpbmcgPSBtYXBwaW5nO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gV2UgYWRkIHRoZSBnZW5lcmF0ZWQgY29kZSB1bnRpbCB0aGUgZmlyc3QgbWFwcGluZ1xuICAgICAgLy8gdG8gdGhlIFNvdXJjZU5vZGUgd2l0aG91dCBhbnkgbWFwcGluZy5cbiAgICAgIC8vIEVhY2ggbGluZSBpcyBhZGRlZCBhcyBzZXBhcmF0ZSBzdHJpbmcuXG4gICAgICB3aGlsZSAobGFzdEdlbmVyYXRlZExpbmUgPCBtYXBwaW5nLmdlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgbm9kZS5hZGQoc2hpZnROZXh0TGluZSgpKTtcbiAgICAgICAgbGFzdEdlbmVyYXRlZExpbmUrKztcbiAgICAgIH1cbiAgICAgIGlmIChsYXN0R2VuZXJhdGVkQ29sdW1uIDwgbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4pIHtcbiAgICAgICAgdmFyIG5leHRMaW5lID0gcmVtYWluaW5nTGluZXNbMF07XG4gICAgICAgIG5vZGUuYWRkKG5leHRMaW5lLnN1YnN0cigwLCBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbikpO1xuICAgICAgICByZW1haW5pbmdMaW5lc1swXSA9IG5leHRMaW5lLnN1YnN0cihtYXBwaW5nLmdlbmVyYXRlZENvbHVtbik7XG4gICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcbiAgICAgIH1cbiAgICAgIGxhc3RNYXBwaW5nID0gbWFwcGluZztcbiAgICB9LCB0aGlzKTtcbiAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgbWFwcGluZ3MuXG4gICAgaWYgKHJlbWFpbmluZ0xpbmVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmIChsYXN0TWFwcGluZykge1xuICAgICAgICAvLyBBc3NvY2lhdGUgdGhlIHJlbWFpbmluZyBjb2RlIGluIHRoZSBjdXJyZW50IGxpbmUgd2l0aCBcImxhc3RNYXBwaW5nXCJcbiAgICAgICAgYWRkTWFwcGluZ1dpdGhDb2RlKGxhc3RNYXBwaW5nLCBzaGlmdE5leHRMaW5lKCkpO1xuICAgICAgfVxuICAgICAgLy8gYW5kIGFkZCB0aGUgcmVtYWluaW5nIGxpbmVzIHdpdGhvdXQgYW55IG1hcHBpbmdcbiAgICAgIG5vZGUuYWRkKHJlbWFpbmluZ0xpbmVzLmpvaW4oXCJcIikpO1xuICAgIH1cblxuICAgIC8vIENvcHkgc291cmNlc0NvbnRlbnQgaW50byBTb3VyY2VOb2RlXG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlRmlsZSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlQ29udGVudEZvcihzb3VyY2VGaWxlKTtcbiAgICAgIGlmIChjb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGFSZWxhdGl2ZVBhdGggIT0gbnVsbCkge1xuICAgICAgICAgIHNvdXJjZUZpbGUgPSB1dGlsLmpvaW4oYVJlbGF0aXZlUGF0aCwgc291cmNlRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5zZXRTb3VyY2VDb250ZW50KHNvdXJjZUZpbGUsIGNvbnRlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5vZGU7XG5cbiAgICBmdW5jdGlvbiBhZGRNYXBwaW5nV2l0aENvZGUobWFwcGluZywgY29kZSkge1xuICAgICAgaWYgKG1hcHBpbmcgPT09IG51bGwgfHwgbWFwcGluZy5zb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBub2RlLmFkZChjb2RlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhUmVsYXRpdmVQYXRoXG4gICAgICAgICAgPyB1dGlsLmpvaW4oYVJlbGF0aXZlUGF0aCwgbWFwcGluZy5zb3VyY2UpXG4gICAgICAgICAgOiBtYXBwaW5nLnNvdXJjZTtcbiAgICAgICAgbm9kZS5hZGQobmV3IFNvdXJjZU5vZGUobWFwcGluZy5vcmlnaW5hbExpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxDb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcGluZy5uYW1lKSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIEFkZCBhIGNodW5rIG9mIGdlbmVyYXRlZCBKUyB0byB0aGlzIHNvdXJjZSBub2RlLlxuICpcbiAqIEBwYXJhbSBhQ2h1bmsgQSBzdHJpbmcgc25pcHBldCBvZiBnZW5lcmF0ZWQgSlMgY29kZSwgYW5vdGhlciBpbnN0YW5jZSBvZlxuICogICAgICAgIFNvdXJjZU5vZGUsIG9yIGFuIGFycmF5IHdoZXJlIGVhY2ggbWVtYmVyIGlzIG9uZSBvZiB0aG9zZSB0aGluZ3MuXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfYWRkKGFDaHVuaykge1xuICBpZiAoQXJyYXkuaXNBcnJheShhQ2h1bmspKSB7XG4gICAgYUNodW5rLmZvckVhY2goZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgICB0aGlzLmFkZChjaHVuayk7XG4gICAgfSwgdGhpcyk7XG4gIH1cbiAgZWxzZSBpZiAoYUNodW5rW2lzU291cmNlTm9kZV0gfHwgdHlwZW9mIGFDaHVuayA9PT0gXCJzdHJpbmdcIikge1xuICAgIGlmIChhQ2h1bmspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChhQ2h1bmspO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgXCJFeHBlY3RlZCBhIFNvdXJjZU5vZGUsIHN0cmluZywgb3IgYW4gYXJyYXkgb2YgU291cmNlTm9kZXMgYW5kIHN0cmluZ3MuIEdvdCBcIiArIGFDaHVua1xuICAgICk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCBhIGNodW5rIG9mIGdlbmVyYXRlZCBKUyB0byB0aGUgYmVnaW5uaW5nIG9mIHRoaXMgc291cmNlIG5vZGUuXG4gKlxuICogQHBhcmFtIGFDaHVuayBBIHN0cmluZyBzbmlwcGV0IG9mIGdlbmVyYXRlZCBKUyBjb2RlLCBhbm90aGVyIGluc3RhbmNlIG9mXG4gKiAgICAgICAgU291cmNlTm9kZSwgb3IgYW4gYXJyYXkgd2hlcmUgZWFjaCBtZW1iZXIgaXMgb25lIG9mIHRob3NlIHRoaW5ncy5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUucHJlcGVuZCA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfcHJlcGVuZChhQ2h1bmspIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYUNodW5rKSkge1xuICAgIGZvciAodmFyIGkgPSBhQ2h1bmsubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0aGlzLnByZXBlbmQoYUNodW5rW2ldKTtcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAoYUNodW5rW2lzU291cmNlTm9kZV0gfHwgdHlwZW9mIGFDaHVuayA9PT0gXCJzdHJpbmdcIikge1xuICAgIHRoaXMuY2hpbGRyZW4udW5zaGlmdChhQ2h1bmspO1xuICB9XG4gIGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICBcIkV4cGVjdGVkIGEgU291cmNlTm9kZSwgc3RyaW5nLCBvciBhbiBhcnJheSBvZiBTb3VyY2VOb2RlcyBhbmQgc3RyaW5ncy4gR290IFwiICsgYUNodW5rXG4gICAgKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogV2FsayBvdmVyIHRoZSB0cmVlIG9mIEpTIHNuaXBwZXRzIGluIHRoaXMgbm9kZSBhbmQgaXRzIGNoaWxkcmVuLiBUaGVcbiAqIHdhbGtpbmcgZnVuY3Rpb24gaXMgY2FsbGVkIG9uY2UgZm9yIGVhY2ggc25pcHBldCBvZiBKUyBhbmQgaXMgcGFzc2VkIHRoYXRcbiAqIHNuaXBwZXQgYW5kIHRoZSBpdHMgb3JpZ2luYWwgYXNzb2NpYXRlZCBzb3VyY2UncyBsaW5lL2NvbHVtbiBsb2NhdGlvbi5cbiAqXG4gKiBAcGFyYW0gYUZuIFRoZSB0cmF2ZXJzYWwgZnVuY3Rpb24uXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLndhbGsgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX3dhbGsoYUZuKSB7XG4gIHZhciBjaHVuaztcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjaHVuayA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgaWYgKGNodW5rW2lzU291cmNlTm9kZV0pIHtcbiAgICAgIGNodW5rLndhbGsoYUZuKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoY2h1bmsgIT09ICcnKSB7XG4gICAgICAgIGFGbihjaHVuaywgeyBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgbGluZTogdGhpcy5saW5lLFxuICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiB0aGlzLmNvbHVtbixcbiAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogTGlrZSBgU3RyaW5nLnByb3RvdHlwZS5qb2luYCBleGNlcHQgZm9yIFNvdXJjZU5vZGVzLiBJbnNlcnRzIGBhU3RyYCBiZXR3ZWVuXG4gKiBlYWNoIG9mIGB0aGlzLmNoaWxkcmVuYC5cbiAqXG4gKiBAcGFyYW0gYVNlcCBUaGUgc2VwYXJhdG9yLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS5qb2luID0gZnVuY3Rpb24gU291cmNlTm9kZV9qb2luKGFTZXApIHtcbiAgdmFyIG5ld0NoaWxkcmVuO1xuICB2YXIgaTtcbiAgdmFyIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICBpZiAobGVuID4gMCkge1xuICAgIG5ld0NoaWxkcmVuID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbi0xOyBpKyspIHtcbiAgICAgIG5ld0NoaWxkcmVuLnB1c2godGhpcy5jaGlsZHJlbltpXSk7XG4gICAgICBuZXdDaGlsZHJlbi5wdXNoKGFTZXApO1xuICAgIH1cbiAgICBuZXdDaGlsZHJlbi5wdXNoKHRoaXMuY2hpbGRyZW5baV0pO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBuZXdDaGlsZHJlbjtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2FsbCBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2Ugb24gdGhlIHZlcnkgcmlnaHQtbW9zdCBzb3VyY2Ugc25pcHBldC4gVXNlZnVsXG4gKiBmb3IgdHJpbW1pbmcgd2hpdGVzcGFjZSBmcm9tIHRoZSBlbmQgb2YgYSBzb3VyY2Ugbm9kZSwgZXRjLlxuICpcbiAqIEBwYXJhbSBhUGF0dGVybiBUaGUgcGF0dGVybiB0byByZXBsYWNlLlxuICogQHBhcmFtIGFSZXBsYWNlbWVudCBUaGUgdGhpbmcgdG8gcmVwbGFjZSB0aGUgcGF0dGVybiB3aXRoLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS5yZXBsYWNlUmlnaHQgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX3JlcGxhY2VSaWdodChhUGF0dGVybiwgYVJlcGxhY2VtZW50KSB7XG4gIHZhciBsYXN0Q2hpbGQgPSB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG4gIGlmIChsYXN0Q2hpbGRbaXNTb3VyY2VOb2RlXSkge1xuICAgIGxhc3RDaGlsZC5yZXBsYWNlUmlnaHQoYVBhdHRlcm4sIGFSZXBsYWNlbWVudCk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGxhc3RDaGlsZCA9PT0gJ3N0cmluZycpIHtcbiAgICB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV0gPSBsYXN0Q2hpbGQucmVwbGFjZShhUGF0dGVybiwgYVJlcGxhY2VtZW50KTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goJycucmVwbGFjZShhUGF0dGVybiwgYVJlcGxhY2VtZW50KSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgc291cmNlIGNvbnRlbnQgZm9yIGEgc291cmNlIGZpbGUuIFRoaXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgU291cmNlTWFwR2VuZXJhdG9yXG4gKiBpbiB0aGUgc291cmNlc0NvbnRlbnQgZmllbGQuXG4gKlxuICogQHBhcmFtIGFTb3VyY2VGaWxlIFRoZSBmaWxlbmFtZSBvZiB0aGUgc291cmNlIGZpbGVcbiAqIEBwYXJhbSBhU291cmNlQ29udGVudCBUaGUgY29udGVudCBvZiB0aGUgc291cmNlIGZpbGVcbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUuc2V0U291cmNlQ29udGVudCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU5vZGVfc2V0U291cmNlQ29udGVudChhU291cmNlRmlsZSwgYVNvdXJjZUNvbnRlbnQpIHtcbiAgICB0aGlzLnNvdXJjZUNvbnRlbnRzW3V0aWwudG9TZXRTdHJpbmcoYVNvdXJjZUZpbGUpXSA9IGFTb3VyY2VDb250ZW50O1xuICB9O1xuXG4vKipcbiAqIFdhbGsgb3ZlciB0aGUgdHJlZSBvZiBTb3VyY2VOb2Rlcy4gVGhlIHdhbGtpbmcgZnVuY3Rpb24gaXMgY2FsbGVkIGZvciBlYWNoXG4gKiBzb3VyY2UgZmlsZSBjb250ZW50IGFuZCBpcyBwYXNzZWQgdGhlIGZpbGVuYW1lIGFuZCBzb3VyY2UgY29udGVudC5cbiAqXG4gKiBAcGFyYW0gYUZuIFRoZSB0cmF2ZXJzYWwgZnVuY3Rpb24uXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLndhbGtTb3VyY2VDb250ZW50cyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU5vZGVfd2Fsa1NvdXJjZUNvbnRlbnRzKGFGbikge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5jaGlsZHJlbltpXVtpc1NvdXJjZU5vZGVdKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5baV0ud2Fsa1NvdXJjZUNvbnRlbnRzKGFGbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZXMgPSBPYmplY3Qua2V5cyh0aGlzLnNvdXJjZUNvbnRlbnRzKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc291cmNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYUZuKHV0aWwuZnJvbVNldFN0cmluZyhzb3VyY2VzW2ldKSwgdGhpcy5zb3VyY2VDb250ZW50c1tzb3VyY2VzW2ldXSk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFJldHVybiB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgc291cmNlIG5vZGUuIFdhbGtzIG92ZXIgdGhlIHRyZWVcbiAqIGFuZCBjb25jYXRlbmF0ZXMgYWxsIHRoZSB2YXJpb3VzIHNuaXBwZXRzIHRvZ2V0aGVyIHRvIG9uZSBzdHJpbmcuXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gU291cmNlTm9kZV90b1N0cmluZygpIHtcbiAgdmFyIHN0ciA9IFwiXCI7XG4gIHRoaXMud2FsayhmdW5jdGlvbiAoY2h1bmspIHtcbiAgICBzdHIgKz0gY2h1bms7XG4gIH0pO1xuICByZXR1cm4gc3RyO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBzb3VyY2Ugbm9kZSBhbG9uZyB3aXRoIGEgc291cmNlXG4gKiBtYXAuXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLnRvU3RyaW5nV2l0aFNvdXJjZU1hcCA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfdG9TdHJpbmdXaXRoU291cmNlTWFwKGFBcmdzKSB7XG4gIHZhciBnZW5lcmF0ZWQgPSB7XG4gICAgY29kZTogXCJcIixcbiAgICBsaW5lOiAxLFxuICAgIGNvbHVtbjogMFxuICB9O1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcihhQXJncyk7XG4gIHZhciBzb3VyY2VNYXBwaW5nQWN0aXZlID0gZmFsc2U7XG4gIHZhciBsYXN0T3JpZ2luYWxTb3VyY2UgPSBudWxsO1xuICB2YXIgbGFzdE9yaWdpbmFsTGluZSA9IG51bGw7XG4gIHZhciBsYXN0T3JpZ2luYWxDb2x1bW4gPSBudWxsO1xuICB2YXIgbGFzdE9yaWdpbmFsTmFtZSA9IG51bGw7XG4gIHRoaXMud2FsayhmdW5jdGlvbiAoY2h1bmssIG9yaWdpbmFsKSB7XG4gICAgZ2VuZXJhdGVkLmNvZGUgKz0gY2h1bms7XG4gICAgaWYgKG9yaWdpbmFsLnNvdXJjZSAhPT0gbnVsbFxuICAgICAgICAmJiBvcmlnaW5hbC5saW5lICE9PSBudWxsXG4gICAgICAgICYmIG9yaWdpbmFsLmNvbHVtbiAhPT0gbnVsbCkge1xuICAgICAgaWYobGFzdE9yaWdpbmFsU291cmNlICE9PSBvcmlnaW5hbC5zb3VyY2VcbiAgICAgICAgIHx8IGxhc3RPcmlnaW5hbExpbmUgIT09IG9yaWdpbmFsLmxpbmVcbiAgICAgICAgIHx8IGxhc3RPcmlnaW5hbENvbHVtbiAhPT0gb3JpZ2luYWwuY29sdW1uXG4gICAgICAgICB8fCBsYXN0T3JpZ2luYWxOYW1lICE9PSBvcmlnaW5hbC5uYW1lKSB7XG4gICAgICAgIG1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICBzb3VyY2U6IG9yaWdpbmFsLnNvdXJjZSxcbiAgICAgICAgICBvcmlnaW5hbDoge1xuICAgICAgICAgICAgbGluZTogb3JpZ2luYWwubGluZSxcbiAgICAgICAgICAgIGNvbHVtbjogb3JpZ2luYWwuY29sdW1uXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZW5lcmF0ZWQ6IHtcbiAgICAgICAgICAgIGxpbmU6IGdlbmVyYXRlZC5saW5lLFxuICAgICAgICAgICAgY29sdW1uOiBnZW5lcmF0ZWQuY29sdW1uXG4gICAgICAgICAgfSxcbiAgICAgICAgICBuYW1lOiBvcmlnaW5hbC5uYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgbGFzdE9yaWdpbmFsU291cmNlID0gb3JpZ2luYWwuc291cmNlO1xuICAgICAgbGFzdE9yaWdpbmFsTGluZSA9IG9yaWdpbmFsLmxpbmU7XG4gICAgICBsYXN0T3JpZ2luYWxDb2x1bW4gPSBvcmlnaW5hbC5jb2x1bW47XG4gICAgICBsYXN0T3JpZ2luYWxOYW1lID0gb3JpZ2luYWwubmFtZTtcbiAgICAgIHNvdXJjZU1hcHBpbmdBY3RpdmUgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoc291cmNlTWFwcGluZ0FjdGl2ZSkge1xuICAgICAgbWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICBnZW5lcmF0ZWQ6IHtcbiAgICAgICAgICBsaW5lOiBnZW5lcmF0ZWQubGluZSxcbiAgICAgICAgICBjb2x1bW46IGdlbmVyYXRlZC5jb2x1bW5cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsYXN0T3JpZ2luYWxTb3VyY2UgPSBudWxsO1xuICAgICAgc291cmNlTWFwcGluZ0FjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKHZhciBpZHggPSAwLCBsZW5ndGggPSBjaHVuay5sZW5ndGg7IGlkeCA8IGxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChjaHVuay5jaGFyQ29kZUF0KGlkeCkgPT09IE5FV0xJTkVfQ09ERSkge1xuICAgICAgICBnZW5lcmF0ZWQubGluZSsrO1xuICAgICAgICBnZW5lcmF0ZWQuY29sdW1uID0gMDtcbiAgICAgICAgLy8gTWFwcGluZ3MgZW5kIGF0IGVvbFxuICAgICAgICBpZiAoaWR4ICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgbGFzdE9yaWdpbmFsU291cmNlID0gbnVsbDtcbiAgICAgICAgICBzb3VyY2VNYXBwaW5nQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoc291cmNlTWFwcGluZ0FjdGl2ZSkge1xuICAgICAgICAgIG1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgICAgIHNvdXJjZTogb3JpZ2luYWwuc291cmNlLFxuICAgICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgICAgbGluZTogb3JpZ2luYWwubGluZSxcbiAgICAgICAgICAgICAgY29sdW1uOiBvcmlnaW5hbC5jb2x1bW5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZW5lcmF0ZWQ6IHtcbiAgICAgICAgICAgICAgbGluZTogZ2VuZXJhdGVkLmxpbmUsXG4gICAgICAgICAgICAgIGNvbHVtbjogZ2VuZXJhdGVkLmNvbHVtblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6IG9yaWdpbmFsLm5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2VuZXJhdGVkLmNvbHVtbisrO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHRoaXMud2Fsa1NvdXJjZUNvbnRlbnRzKGZ1bmN0aW9uIChzb3VyY2VGaWxlLCBzb3VyY2VDb250ZW50KSB7XG4gICAgbWFwLnNldFNvdXJjZUNvbnRlbnQoc291cmNlRmlsZSwgc291cmNlQ29udGVudCk7XG4gIH0pO1xuXG4gIHJldHVybiB7IGNvZGU6IGdlbmVyYXRlZC5jb2RlLCBtYXA6IG1hcCB9O1xufTtcblxuZXhwb3J0cy5Tb3VyY2VOb2RlID0gU291cmNlTm9kZTtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxuLyoqXG4gKiBUaGlzIGlzIGEgaGVscGVyIGZ1bmN0aW9uIGZvciBnZXR0aW5nIHZhbHVlcyBmcm9tIHBhcmFtZXRlci9vcHRpb25zXG4gKiBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSBhcmdzIFRoZSBvYmplY3Qgd2UgYXJlIGV4dHJhY3RpbmcgdmFsdWVzIGZyb21cbiAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB3ZSBhcmUgZ2V0dGluZy5cbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWUgQW4gb3B0aW9uYWwgdmFsdWUgdG8gcmV0dXJuIGlmIHRoZSBwcm9wZXJ0eSBpcyBtaXNzaW5nXG4gKiBmcm9tIHRoZSBvYmplY3QuIElmIHRoaXMgaXMgbm90IHNwZWNpZmllZCBhbmQgdGhlIHByb3BlcnR5IGlzIG1pc3NpbmcsIGFuXG4gKiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAqL1xuZnVuY3Rpb24gZ2V0QXJnKGFBcmdzLCBhTmFtZSwgYURlZmF1bHRWYWx1ZSkge1xuICBpZiAoYU5hbWUgaW4gYUFyZ3MpIHtcbiAgICByZXR1cm4gYUFyZ3NbYU5hbWVdO1xuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICByZXR1cm4gYURlZmF1bHRWYWx1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFOYW1lICsgJ1wiIGlzIGEgcmVxdWlyZWQgYXJndW1lbnQuJyk7XG4gIH1cbn1cbmV4cG9ydHMuZ2V0QXJnID0gZ2V0QXJnO1xuXG52YXIgdXJsUmVnZXhwID0gL14oPzooW1xcdytcXC0uXSspOik/XFwvXFwvKD86KFxcdys6XFx3KylAKT8oW1xcdy5dKikoPzo6KFxcZCspKT8oXFxTKikkLztcbnZhciBkYXRhVXJsUmVnZXhwID0gL15kYXRhOi4rXFwsLiskLztcblxuZnVuY3Rpb24gdXJsUGFyc2UoYVVybCkge1xuICB2YXIgbWF0Y2ggPSBhVXJsLm1hdGNoKHVybFJlZ2V4cCk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHNjaGVtZTogbWF0Y2hbMV0sXG4gICAgYXV0aDogbWF0Y2hbMl0sXG4gICAgaG9zdDogbWF0Y2hbM10sXG4gICAgcG9ydDogbWF0Y2hbNF0sXG4gICAgcGF0aDogbWF0Y2hbNV1cbiAgfTtcbn1cbmV4cG9ydHMudXJsUGFyc2UgPSB1cmxQYXJzZTtcblxuZnVuY3Rpb24gdXJsR2VuZXJhdGUoYVBhcnNlZFVybCkge1xuICB2YXIgdXJsID0gJyc7XG4gIGlmIChhUGFyc2VkVXJsLnNjaGVtZSkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLnNjaGVtZSArICc6JztcbiAgfVxuICB1cmwgKz0gJy8vJztcbiAgaWYgKGFQYXJzZWRVcmwuYXV0aCkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLmF1dGggKyAnQCc7XG4gIH1cbiAgaWYgKGFQYXJzZWRVcmwuaG9zdCkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLmhvc3Q7XG4gIH1cbiAgaWYgKGFQYXJzZWRVcmwucG9ydCkge1xuICAgIHVybCArPSBcIjpcIiArIGFQYXJzZWRVcmwucG9ydFxuICB9XG4gIGlmIChhUGFyc2VkVXJsLnBhdGgpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5wYXRoO1xuICB9XG4gIHJldHVybiB1cmw7XG59XG5leHBvcnRzLnVybEdlbmVyYXRlID0gdXJsR2VuZXJhdGU7XG5cbi8qKlxuICogTm9ybWFsaXplcyBhIHBhdGgsIG9yIHRoZSBwYXRoIHBvcnRpb24gb2YgYSBVUkw6XG4gKlxuICogLSBSZXBsYWNlcyBjb25zZWN1dGl2ZSBzbGFzaGVzIHdpdGggb25lIHNsYXNoLlxuICogLSBSZW1vdmVzIHVubmVjZXNzYXJ5ICcuJyBwYXJ0cy5cbiAqIC0gUmVtb3ZlcyB1bm5lY2Vzc2FyeSAnPGRpcj4vLi4nIHBhcnRzLlxuICpcbiAqIEJhc2VkIG9uIGNvZGUgaW4gdGhlIE5vZGUuanMgJ3BhdGgnIGNvcmUgbW9kdWxlLlxuICpcbiAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciB1cmwgdG8gbm9ybWFsaXplLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemUoYVBhdGgpIHtcbiAgdmFyIHBhdGggPSBhUGF0aDtcbiAgdmFyIHVybCA9IHVybFBhcnNlKGFQYXRoKTtcbiAgaWYgKHVybCkge1xuICAgIGlmICghdXJsLnBhdGgpIHtcbiAgICAgIHJldHVybiBhUGF0aDtcbiAgICB9XG4gICAgcGF0aCA9IHVybC5wYXRoO1xuICB9XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpO1xuXG4gIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoL1xcLysvKTtcbiAgZm9yICh2YXIgcGFydCwgdXAgPSAwLCBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBwYXJ0ID0gcGFydHNbaV07XG4gICAgaWYgKHBhcnQgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAocGFydCA9PT0gJy4uJykge1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwID4gMCkge1xuICAgICAgaWYgKHBhcnQgPT09ICcnKSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBwYXJ0IGlzIGJsYW5rIGlmIHRoZSBwYXRoIGlzIGFic29sdXRlLiBUcnlpbmcgdG8gZ29cbiAgICAgICAgLy8gYWJvdmUgdGhlIHJvb3QgaXMgYSBuby1vcC4gVGhlcmVmb3JlIHdlIGNhbiByZW1vdmUgYWxsICcuLicgcGFydHNcbiAgICAgICAgLy8gZGlyZWN0bHkgYWZ0ZXIgdGhlIHJvb3QuXG4gICAgICAgIHBhcnRzLnNwbGljZShpICsgMSwgdXApO1xuICAgICAgICB1cCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMik7XG4gICAgICAgIHVwLS07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHBhdGggPSBwYXJ0cy5qb2luKCcvJyk7XG5cbiAgaWYgKHBhdGggPT09ICcnKSB7XG4gICAgcGF0aCA9IGlzQWJzb2x1dGUgPyAnLycgOiAnLic7XG4gIH1cblxuICBpZiAodXJsKSB7XG4gICAgdXJsLnBhdGggPSBwYXRoO1xuICAgIHJldHVybiB1cmxHZW5lcmF0ZSh1cmwpO1xuICB9XG4gIHJldHVybiBwYXRoO1xufVxuZXhwb3J0cy5ub3JtYWxpemUgPSBub3JtYWxpemU7XG5cbi8qKlxuICogSm9pbnMgdHdvIHBhdGhzL1VSTHMuXG4gKlxuICogQHBhcmFtIGFSb290IFRoZSByb290IHBhdGggb3IgVVJMLlxuICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIFVSTCB0byBiZSBqb2luZWQgd2l0aCB0aGUgcm9vdC5cbiAqXG4gKiAtIElmIGFQYXRoIGlzIGEgVVJMIG9yIGEgZGF0YSBVUkksIGFQYXRoIGlzIHJldHVybmVkLCB1bmxlc3MgYVBhdGggaXMgYVxuICogICBzY2hlbWUtcmVsYXRpdmUgVVJMOiBUaGVuIHRoZSBzY2hlbWUgb2YgYVJvb3QsIGlmIGFueSwgaXMgcHJlcGVuZGVkXG4gKiAgIGZpcnN0LlxuICogLSBPdGhlcndpc2UgYVBhdGggaXMgYSBwYXRoLiBJZiBhUm9vdCBpcyBhIFVSTCwgdGhlbiBpdHMgcGF0aCBwb3J0aW9uXG4gKiAgIGlzIHVwZGF0ZWQgd2l0aCB0aGUgcmVzdWx0IGFuZCBhUm9vdCBpcyByZXR1cm5lZC4gT3RoZXJ3aXNlIHRoZSByZXN1bHRcbiAqICAgaXMgcmV0dXJuZWQuXG4gKiAgIC0gSWYgYVBhdGggaXMgYWJzb2x1dGUsIHRoZSByZXN1bHQgaXMgYVBhdGguXG4gKiAgIC0gT3RoZXJ3aXNlIHRoZSB0d28gcGF0aHMgYXJlIGpvaW5lZCB3aXRoIGEgc2xhc2guXG4gKiAtIEpvaW5pbmcgZm9yIGV4YW1wbGUgJ2h0dHA6Ly8nIGFuZCAnd3d3LmV4YW1wbGUuY29tJyBpcyBhbHNvIHN1cHBvcnRlZC5cbiAqL1xuZnVuY3Rpb24gam9pbihhUm9vdCwgYVBhdGgpIHtcbiAgaWYgKGFSb290ID09PSBcIlwiKSB7XG4gICAgYVJvb3QgPSBcIi5cIjtcbiAgfVxuICBpZiAoYVBhdGggPT09IFwiXCIpIHtcbiAgICBhUGF0aCA9IFwiLlwiO1xuICB9XG4gIHZhciBhUGF0aFVybCA9IHVybFBhcnNlKGFQYXRoKTtcbiAgdmFyIGFSb290VXJsID0gdXJsUGFyc2UoYVJvb3QpO1xuICBpZiAoYVJvb3RVcmwpIHtcbiAgICBhUm9vdCA9IGFSb290VXJsLnBhdGggfHwgJy8nO1xuICB9XG5cbiAgLy8gYGpvaW4oZm9vLCAnLy93d3cuZXhhbXBsZS5vcmcnKWBcbiAgaWYgKGFQYXRoVXJsICYmICFhUGF0aFVybC5zY2hlbWUpIHtcbiAgICBpZiAoYVJvb3RVcmwpIHtcbiAgICAgIGFQYXRoVXJsLnNjaGVtZSA9IGFSb290VXJsLnNjaGVtZTtcbiAgICB9XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKGFQYXRoVXJsKTtcbiAgfVxuXG4gIGlmIChhUGF0aFVybCB8fCBhUGF0aC5tYXRjaChkYXRhVXJsUmVnZXhwKSkge1xuICAgIHJldHVybiBhUGF0aDtcbiAgfVxuXG4gIC8vIGBqb2luKCdodHRwOi8vJywgJ3d3dy5leGFtcGxlLmNvbScpYFxuICBpZiAoYVJvb3RVcmwgJiYgIWFSb290VXJsLmhvc3QgJiYgIWFSb290VXJsLnBhdGgpIHtcbiAgICBhUm9vdFVybC5ob3N0ID0gYVBhdGg7XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKGFSb290VXJsKTtcbiAgfVxuXG4gIHZhciBqb2luZWQgPSBhUGF0aC5jaGFyQXQoMCkgPT09ICcvJ1xuICAgID8gYVBhdGhcbiAgICA6IG5vcm1hbGl6ZShhUm9vdC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIGFQYXRoKTtcblxuICBpZiAoYVJvb3RVcmwpIHtcbiAgICBhUm9vdFVybC5wYXRoID0gam9pbmVkO1xuICAgIHJldHVybiB1cmxHZW5lcmF0ZShhUm9vdFVybCk7XG4gIH1cbiAgcmV0dXJuIGpvaW5lZDtcbn1cbmV4cG9ydHMuam9pbiA9IGpvaW47XG5cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uIChhUGF0aCkge1xuICByZXR1cm4gYVBhdGguY2hhckF0KDApID09PSAnLycgfHwgISFhUGF0aC5tYXRjaCh1cmxSZWdleHApO1xufTtcblxuLyoqXG4gKiBNYWtlIGEgcGF0aCByZWxhdGl2ZSB0byBhIFVSTCBvciBhbm90aGVyIHBhdGguXG4gKlxuICogQHBhcmFtIGFSb290IFRoZSByb290IHBhdGggb3IgVVJMLlxuICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIFVSTCB0byBiZSBtYWRlIHJlbGF0aXZlIHRvIGFSb290LlxuICovXG5mdW5jdGlvbiByZWxhdGl2ZShhUm9vdCwgYVBhdGgpIHtcbiAgaWYgKGFSb290ID09PSBcIlwiKSB7XG4gICAgYVJvb3QgPSBcIi5cIjtcbiAgfVxuXG4gIGFSb290ID0gYVJvb3QucmVwbGFjZSgvXFwvJC8sICcnKTtcblxuICAvLyBJdCBpcyBwb3NzaWJsZSBmb3IgdGhlIHBhdGggdG8gYmUgYWJvdmUgdGhlIHJvb3QuIEluIHRoaXMgY2FzZSwgc2ltcGx5XG4gIC8vIGNoZWNraW5nIHdoZXRoZXIgdGhlIHJvb3QgaXMgYSBwcmVmaXggb2YgdGhlIHBhdGggd29uJ3Qgd29yay4gSW5zdGVhZCwgd2VcbiAgLy8gbmVlZCB0byByZW1vdmUgY29tcG9uZW50cyBmcm9tIHRoZSByb290IG9uZSBieSBvbmUsIHVudGlsIGVpdGhlciB3ZSBmaW5kXG4gIC8vIGEgcHJlZml4IHRoYXQgZml0cywgb3Igd2UgcnVuIG91dCBvZiBjb21wb25lbnRzIHRvIHJlbW92ZS5cbiAgdmFyIGxldmVsID0gMDtcbiAgd2hpbGUgKGFQYXRoLmluZGV4T2YoYVJvb3QgKyAnLycpICE9PSAwKSB7XG4gICAgdmFyIGluZGV4ID0gYVJvb3QubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIHJldHVybiBhUGF0aDtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgb25seSBwYXJ0IG9mIHRoZSByb290IHRoYXQgaXMgbGVmdCBpcyB0aGUgc2NoZW1lIChpLmUuIGh0dHA6Ly8sXG4gICAgLy8gZmlsZTovLy8sIGV0Yy4pLCBvbmUgb3IgbW9yZSBzbGFzaGVzICgvKSwgb3Igc2ltcGx5IG5vdGhpbmcgYXQgYWxsLCB3ZVxuICAgIC8vIGhhdmUgZXhoYXVzdGVkIGFsbCBjb21wb25lbnRzLCBzbyB0aGUgcGF0aCBpcyBub3QgcmVsYXRpdmUgdG8gdGhlIHJvb3QuXG4gICAgYVJvb3QgPSBhUm9vdC5zbGljZSgwLCBpbmRleCk7XG4gICAgaWYgKGFSb290Lm1hdGNoKC9eKFteXFwvXSs6XFwvKT9cXC8qJC8pKSB7XG4gICAgICByZXR1cm4gYVBhdGg7XG4gICAgfVxuXG4gICAgKytsZXZlbDtcbiAgfVxuXG4gIC8vIE1ha2Ugc3VyZSB3ZSBhZGQgYSBcIi4uL1wiIGZvciBlYWNoIGNvbXBvbmVudCB3ZSByZW1vdmVkIGZyb20gdGhlIHJvb3QuXG4gIHJldHVybiBBcnJheShsZXZlbCArIDEpLmpvaW4oXCIuLi9cIikgKyBhUGF0aC5zdWJzdHIoYVJvb3QubGVuZ3RoICsgMSk7XG59XG5leHBvcnRzLnJlbGF0aXZlID0gcmVsYXRpdmU7XG5cbnZhciBzdXBwb3J0c051bGxQcm90byA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICByZXR1cm4gISgnX19wcm90b19fJyBpbiBvYmopO1xufSgpKTtcblxuZnVuY3Rpb24gaWRlbnRpdHkgKHMpIHtcbiAgcmV0dXJuIHM7XG59XG5cbi8qKlxuICogQmVjYXVzZSBiZWhhdmlvciBnb2VzIHdhY2t5IHdoZW4geW91IHNldCBgX19wcm90b19fYCBvbiBvYmplY3RzLCB3ZVxuICogaGF2ZSB0byBwcmVmaXggYWxsIHRoZSBzdHJpbmdzIGluIG91ciBzZXQgd2l0aCBhbiBhcmJpdHJhcnkgY2hhcmFjdGVyLlxuICpcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL3B1bGwvMzEgYW5kXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL2lzc3Vlcy8zMFxuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5mdW5jdGlvbiB0b1NldFN0cmluZyhhU3RyKSB7XG4gIGlmIChpc1Byb3RvU3RyaW5nKGFTdHIpKSB7XG4gICAgcmV0dXJuICckJyArIGFTdHI7XG4gIH1cblxuICByZXR1cm4gYVN0cjtcbn1cbmV4cG9ydHMudG9TZXRTdHJpbmcgPSBzdXBwb3J0c051bGxQcm90byA/IGlkZW50aXR5IDogdG9TZXRTdHJpbmc7XG5cbmZ1bmN0aW9uIGZyb21TZXRTdHJpbmcoYVN0cikge1xuICBpZiAoaXNQcm90b1N0cmluZyhhU3RyKSkge1xuICAgIHJldHVybiBhU3RyLnNsaWNlKDEpO1xuICB9XG5cbiAgcmV0dXJuIGFTdHI7XG59XG5leHBvcnRzLmZyb21TZXRTdHJpbmcgPSBzdXBwb3J0c051bGxQcm90byA/IGlkZW50aXR5IDogZnJvbVNldFN0cmluZztcblxuZnVuY3Rpb24gaXNQcm90b1N0cmluZyhzKSB7XG4gIGlmICghcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBzLmxlbmd0aDtcblxuICBpZiAobGVuZ3RoIDwgOSAvKiBcIl9fcHJvdG9fX1wiLmxlbmd0aCAqLykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMSkgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSAyKSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDMpICE9PSAxMTEgLyogJ28nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNCkgIT09IDExNiAvKiAndCcgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA1KSAhPT0gMTExIC8qICdvJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDYpICE9PSAxMTQgLyogJ3InICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNykgIT09IDExMiAvKiAncCcgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA4KSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDkpICE9PSA5NSAgLyogJ18nICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IGxlbmd0aCAtIDEwOyBpID49IDA7IGktLSkge1xuICAgIGlmIChzLmNoYXJDb2RlQXQoaSkgIT09IDM2IC8qICckJyAqLykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENvbXBhcmF0b3IgYmV0d2VlbiB0d28gbWFwcGluZ3Mgd2hlcmUgdGhlIG9yaWdpbmFsIHBvc2l0aW9ucyBhcmUgY29tcGFyZWQuXG4gKlxuICogT3B0aW9uYWxseSBwYXNzIGluIGB0cnVlYCBhcyBgb25seUNvbXBhcmVHZW5lcmF0ZWRgIHRvIGNvbnNpZGVyIHR3b1xuICogbWFwcGluZ3Mgd2l0aCB0aGUgc2FtZSBvcmlnaW5hbCBzb3VyY2UvbGluZS9jb2x1bW4sIGJ1dCBkaWZmZXJlbnQgZ2VuZXJhdGVkXG4gKiBsaW5lIGFuZCBjb2x1bW4gdGhlIHNhbWUuIFVzZWZ1bCB3aGVuIHNlYXJjaGluZyBmb3IgYSBtYXBwaW5nIHdpdGggYVxuICogc3R1YmJlZCBvdXQgbWFwcGluZy5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMobWFwcGluZ0EsIG1hcHBpbmdCLCBvbmx5Q29tcGFyZU9yaWdpbmFsKSB7XG4gIHZhciBjbXAgPSBtYXBwaW5nQS5zb3VyY2UgLSBtYXBwaW5nQi5zb3VyY2U7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVPcmlnaW5hbCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIG1hcHBpbmdBLm5hbWUgLSBtYXBwaW5nQi5uYW1lO1xufVxuZXhwb3J0cy5jb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyA9IGNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zO1xuXG4vKipcbiAqIENvbXBhcmF0b3IgYmV0d2VlbiB0d28gbWFwcGluZ3Mgd2l0aCBkZWZsYXRlZCBzb3VyY2UgYW5kIG5hbWUgaW5kaWNlcyB3aGVyZVxuICogdGhlIGdlbmVyYXRlZCBwb3NpdGlvbnMgYXJlIGNvbXBhcmVkLlxuICpcbiAqIE9wdGlvbmFsbHkgcGFzcyBpbiBgdHJ1ZWAgYXMgYG9ubHlDb21wYXJlR2VuZXJhdGVkYCB0byBjb25zaWRlciB0d29cbiAqIG1hcHBpbmdzIHdpdGggdGhlIHNhbWUgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiwgYnV0IGRpZmZlcmVudFxuICogc291cmNlL25hbWUvb3JpZ2luYWwgbGluZSBhbmQgY29sdW1uIHRoZSBzYW1lLiBVc2VmdWwgd2hlbiBzZWFyY2hpbmcgZm9yIGFcbiAqIG1hcHBpbmcgd2l0aCBhIHN0dWJiZWQgb3V0IG1hcHBpbmcuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkKG1hcHBpbmdBLCBtYXBwaW5nQiwgb25seUNvbXBhcmVHZW5lcmF0ZWQpIHtcbiAgdmFyIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZENvbHVtbiAtIG1hcHBpbmdCLmdlbmVyYXRlZENvbHVtbjtcbiAgaWYgKGNtcCAhPT0gMCB8fCBvbmx5Q29tcGFyZUdlbmVyYXRlZCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5zb3VyY2UgLSBtYXBwaW5nQi5zb3VyY2U7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIG1hcHBpbmdBLm5hbWUgLSBtYXBwaW5nQi5uYW1lO1xufVxuZXhwb3J0cy5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZCA9IGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkO1xuXG5mdW5jdGlvbiBzdHJjbXAoYVN0cjEsIGFTdHIyKSB7XG4gIGlmIChhU3RyMSA9PT0gYVN0cjIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChhU3RyMSA+IGFTdHIyKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aXRoIGluZmxhdGVkIHNvdXJjZSBhbmQgbmFtZSBzdHJpbmdzIHdoZXJlXG4gKiB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9ucyBhcmUgY29tcGFyZWQuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkKG1hcHBpbmdBLCBtYXBwaW5nQikge1xuICB2YXIgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IHN0cmNtcChtYXBwaW5nQS5zb3VyY2UsIG1hcHBpbmdCLnNvdXJjZSk7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIHN0cmNtcChtYXBwaW5nQS5uYW1lLCBtYXBwaW5nQi5uYW1lKTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQgPSBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZDtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwOS0yMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRS50eHQgb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cbmV4cG9ydHMuU291cmNlTWFwR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9saWIvc291cmNlLW1hcC1nZW5lcmF0b3InKS5Tb3VyY2VNYXBHZW5lcmF0b3I7XG5leHBvcnRzLlNvdXJjZU1hcENvbnN1bWVyID0gcmVxdWlyZSgnLi9saWIvc291cmNlLW1hcC1jb25zdW1lcicpLlNvdXJjZU1hcENvbnN1bWVyO1xuZXhwb3J0cy5Tb3VyY2VOb2RlID0gcmVxdWlyZSgnLi9saWIvc291cmNlLW5vZGUnKS5Tb3VyY2VOb2RlO1xuIl19
