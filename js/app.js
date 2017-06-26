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
        googleSignin: '.authorization__google',
        register: '.registration__btn'
    },
    events: {
        'click @ui.authorize': 'authorizeUser',
        'submit @ui.formSubmit': 'authorizeUser',
        'click @ui.googleSignin': 'googleSignin',
        'click @ui.register': 'registerUser'
    },
    googleSignin: function googleSignin(event) {
        var provider = new firebase.auth.GoogleAuthProvider();
        var promise = firebase.auth().signInWithPopup(provider);
        promise.catch(function (e) {
            alert(e.message);
        });
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
        var userId = firebase.auth().currentUser.uid;
        var email = firebase.auth().currentUser.email;

        $('.user__name').text(email);
        var TasksCollection = Backbone.Firebase.Collection.extend({
            model: TaskModel,
            url: 'https://marionette-todo-app.firebaseio.com/Users/' + userId + ''
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0XFxqc1xcYXBwLmpzIiwiZGlzdFxcanNcXGJlaGF2aW9yc1xcaGJzLmpzIiwiZGlzdFxcanNcXGluaXRpYWxpemUuanMiLCJkaXN0XFxqc1xcbGlic1xcaGFuZGxlYmFycy12NC4wLjEwLmpzIiwiZGlzdFxcanNcXHZpZXdzXFxhdGhvcml6YXRpb24uanMiLCJkaXN0XFxqc1xcdmlld3NcXGN1cnJlbnQudXNlci5qcyIsImRpc3RcXGpzXFx2aWV3c1xcbGF5b3V0LmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2FycmF5LXNldC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9iYXNlNjQtdmxxLmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2Jhc2U2NC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9iaW5hcnktc2VhcmNoLmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL21hcHBpbmctbGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9xdWljay1zb3J0LmpzIiwibm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL3NvdXJjZS1tYXAtY29uc3VtZXIuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvc291cmNlLW1hcC1nZW5lcmF0b3IuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvc291cmNlLW5vZGUuanMiLCJub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL3NvdXJjZS1tYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7a0JBR2UsV0FBVyxXQUFYLENBQXVCLE1BQXZCLENBQThCO0FBQzVDLFNBQVEsTUFEb0M7QUFFNUMsYUFBWSxzQkFBVztBQUN0QixPQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxFQUoyQztBQUs1QyxRQUFPLGlCQUFXO0FBQ2pCLE9BQUssUUFBTCxDQUFjLHNCQUFkO0FBQ0EsRUFQMkM7QUFRNUMsS0FSNEMsZ0JBUXRDLE9BUnNDLEVBUTdCO0FBQ2QsTUFBSSxTQUFTLEVBQUUsTUFBRixDQUFTO0FBQ3JCLFFBQUssRUFEZ0I7QUFFckIsU0FBTSxNQUZlO0FBR3JCLFNBQU0sRUFIZTtBQUlyQixhQUFVLE1BSlc7QUFLckIsV0FMcUIsb0JBS1gsSUFMVyxFQUtMO0FBQ2Y7QUFDQTtBQVBvQixHQUFULEVBUVYsT0FSVSxDQUFiOztBQVVBLFNBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjs7QUFFdkMsS0FBRSxJQUFGLENBQU87QUFDTixTQUFLLE9BQU8sR0FETjtBQUVOLFVBQU0sT0FBTyxJQUZQO0FBR04sVUFBTSxPQUFPLElBSFA7QUFJTixjQUFVLE9BQU87QUFKWCxJQUFQLEVBS0csTUFMSCxDQUtVLFVBQUMsUUFBRCxFQUFXLE1BQVgsRUFBc0I7QUFDL0IsUUFBRyxXQUFXLE9BQWQsRUFBdUI7QUFDdEIsWUFBTyxRQUFQO0FBQ0E7O0FBRUQsUUFBRyxXQUFXLFNBQWQsRUFBeUI7QUFDeEIsU0FBRyxRQUFPLFFBQVAseUNBQU8sUUFBUCxPQUFvQixRQUFwQixJQUFnQyxTQUFTLElBQVQsSUFBaUIsR0FBcEQsRUFBeUQ7QUFDeEQsVUFBRyxTQUFTLE9BQVosRUFBcUI7QUFDcEIsY0FBTyxRQUFQO0FBQ0E7QUFDRDtBQUNELFlBQU8sUUFBUCxDQUFnQixRQUFoQjtBQUNBLGFBQVEsUUFBUjtBQUNBO0FBQ0QsSUFuQkQ7QUFxQkEsR0F2Qk0sRUF1QkosS0F2QkksQ0F1QkUsb0JBQVk7QUFDcEIsT0FBRyxTQUFTLE9BQVosRUFBcUI7QUFDcEI7QUFDQSxRQUFHLFNBQVMsSUFBVCxLQUFrQixHQUFyQixFQUEwQjtBQUN6QixTQUFJLE1BQUosQ0FBVyxRQUFYLENBQW9CLEdBQXBCLEVBQXlCLElBQXpCO0FBQ0E7O0FBRUQsVUFBTSxTQUFTLFFBQVQsRUFBTjtBQUNBO0FBQ0QsR0FoQ00sQ0FBUDtBQWlDQTtBQXBEMkMsQ0FBOUIsQzs7Ozs7Ozs7O0FDSGY7Ozs7OztBQUVBLElBQU0sU0FBUyxXQUFXLFFBQVgsQ0FBb0IsTUFBcEIsQ0FBMkI7QUFDdEMsWUFBUSxLQUQ4QjtBQUV0QyxjQUZzQyxzQkFFMUIsT0FGMEIsRUFFakI7QUFBQTs7QUFDakIsWUFBSSxhQUFhLEtBQUssSUFBTCxDQUFVLFVBQTNCOztBQUVBLGFBQUssSUFBTCxDQUFVLGFBQVYsR0FBMEIsS0FBMUI7O0FBRUE7QUFDQSxZQUFHLENBQUMsVUFBSixFQUFnQixPQUFPLFFBQVEsSUFBUixDQUFhLDJCQUFiLENBQVA7QUFDaEI7QUFDQSxZQUFHLElBQUksUUFBSixDQUFhLFVBQWIsS0FBNEIsU0FBL0IsRUFBMEM7QUFDdEMsbUJBQU8sSUFBSSxRQUFKLENBQWEsVUFBYixJQUEyQixJQUFJLElBQUosQ0FBUztBQUNuQyxzQkFBTSxLQUQ2QjtBQUVuQyxxQkFBSyxVQUY4QjtBQUduQywwQkFBVTtBQUh5QixhQUFULEVBSTNCLElBSjJCLENBSXRCLGdCQUFRO0FBQ1o7QUFDQSxvQkFBRyxDQUFDLE1BQUssSUFBTCxDQUFVLFdBQVYsRUFBSixFQUE2QjtBQUNqQyx3QkFBSSxRQUFKLENBQWEsVUFBYixJQUEyQixJQUEzQjtBQUNBLDBCQUFLLFdBQUwsQ0FBaUIsSUFBSSxRQUFKLENBQWEsVUFBYixDQUFqQjtBQUNBLHdCQUFHLEVBQUUsVUFBRixDQUFhLE1BQUssSUFBTCxDQUFVLGNBQXZCLENBQUgsRUFBMkMsTUFBSyxJQUFMLENBQVUsY0FBVjtBQUMzQywwQkFBSyxNQUFMLEdBQWMsSUFBZDtBQUNIOztBQUVELHVCQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVY7QUFBQSwyQkFBcUIsUUFBUSxJQUFSLENBQXJCO0FBQUEsaUJBQVosQ0FBUDtBQUNILGFBZHFDLENBQWxDO0FBZUg7QUFDRDtBQUNBLFlBQUcsRUFBRSxVQUFGLENBQWEsSUFBSSxRQUFKLENBQWEsVUFBYixFQUF5QixJQUF0QyxDQUFILEVBQWdEO0FBQzVDLGdCQUFJLFFBQUosQ0FBYSxVQUFiLEVBQXlCLElBQXpCLENBQThCLGdCQUFRO0FBQ2xDO0FBQ0Esb0JBQUksUUFBSixDQUFhLFVBQWIsSUFBMkIsSUFBM0I7QUFDSixzQkFBSyxXQUFMLENBQWlCLElBQUksUUFBSixDQUFhLFVBQWIsQ0FBakI7QUFDQSxvQkFBRyxFQUFFLFVBQUYsQ0FBYSxNQUFLLElBQUwsQ0FBVSxjQUF2QixDQUFILEVBQTJDLE1BQUssSUFBTCxDQUFVLGNBQVY7QUFDM0Msc0JBQUssTUFBTCxHQUFjLElBQWQ7QUFDSDtBQUNHO0FBUEE7QUFRSCxTQVRELE1BU087QUFDSCxpQkFBSyxNQUFMLEdBQWMsSUFBZDtBQUNBLGlCQUFLLFdBQUwsQ0FBaUIsSUFBSSxRQUFKLENBQWEsVUFBYixDQUFqQjtBQUNIO0FBQ0osS0F6Q3FDO0FBMEN0QyxlQTFDc0MsdUJBMEN6QixRQTFDeUIsRUEwQ2Y7QUFDbkIsWUFBSSxNQUFNLHNCQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBVjtBQUNBLGFBQUssSUFBTCxDQUFVLFFBQVYsR0FBcUI7QUFBQSxtQkFBUSxJQUFJLElBQUosQ0FBUjtBQUFBLFNBQXJCO0FBQ0EsYUFBSyxJQUFMLENBQVUsYUFBVixHQUEwQixJQUExQjtBQUNILEtBOUNxQztBQStDdEMsWUEvQ3NDLHNCQStDMUI7QUFDUixZQUFHLEVBQUUsVUFBRixDQUFhLEtBQUssSUFBTCxDQUFVLGNBQXZCLEtBQTBDLEtBQUssTUFBTCxLQUFnQixJQUE3RCxFQUFtRSxLQUFLLElBQUwsQ0FBVSxjQUFWO0FBQ3RFO0FBakRxQyxDQUEzQixDQUFmOztrQkFvRGUsTTs7Ozs7QUN0RGY7Ozs7OztBQUVBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDaEQsV0FBTyxHQUFQLEdBQWEsbUJBQWI7QUFDQSxRQUFJLEtBQUo7QUFDSCxDQUhEOzs7Ozs7O0FDRkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLENBQUMsU0FBUyxnQ0FBVCxDQUEwQyxJQUExQyxFQUFnRCxPQUFoRCxFQUF5RDtBQUN6RCxLQUFHLFFBQU8sT0FBUCx5Q0FBTyxPQUFQLE9BQW1CLFFBQW5CLElBQStCLFFBQU8sTUFBUCx5Q0FBTyxNQUFQLE9BQWtCLFFBQXBELEVBQ0MsT0FBTyxPQUFQLEdBQWlCLFNBQWpCLENBREQsS0FFSyxJQUFHLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTFDLEVBQ0osT0FBTyxFQUFQLEVBQVcsT0FBWCxFQURJLEtBRUEsSUFBRyxRQUFPLE9BQVAseUNBQU8sT0FBUCxPQUFtQixRQUF0QixFQUNKLFFBQVEsWUFBUixJQUF3QixTQUF4QixDQURJLEtBR0osS0FBSyxZQUFMLElBQXFCLFNBQXJCO0FBQ0QsQ0FURCxhQVNTLFlBQVc7QUFDcEIsUUFBTyxTQUFVLFVBQVMsT0FBVCxFQUFrQjtBQUFFO0FBQ3JDLFdBRG1DLENBQ3pCO0FBQ1YsV0FBVSxJQUFJLG1CQUFtQixFQUF2Qjs7QUFFVixXQUptQyxDQUl6QjtBQUNWLFdBQVUsU0FBUyxtQkFBVCxDQUE2QixRQUE3QixFQUF1Qzs7QUFFakQsWUFGaUQsQ0FFdEM7QUFDWCxZQUFXLElBQUcsaUJBQWlCLFFBQWpCLENBQUg7QUFDWCxhQUFZLE9BQU8saUJBQWlCLFFBQWpCLEVBQTJCLE9BQWxDOztBQUVaLFlBTmlELENBTXRDO0FBQ1gsWUFBVyxJQUFJLFNBQVMsaUJBQWlCLFFBQWpCLElBQTZCO0FBQ3JELGFBQVksU0FBUyxFQURnQztBQUVyRCxhQUFZLElBQUksUUFGcUM7QUFHckQsYUFBWSxRQUFRO0FBQ3BCLGFBSnFELEVBQTFDOztBQU1YLFlBYmlELENBYXRDO0FBQ1gsWUFBVyxRQUFRLFFBQVIsRUFBa0IsSUFBbEIsQ0FBdUIsT0FBTyxPQUE5QixFQUF1QyxNQUF2QyxFQUErQyxPQUFPLE9BQXRELEVBQStELG1CQUEvRDs7QUFFWCxZQWhCaUQsQ0FnQnRDO0FBQ1gsWUFBVyxPQUFPLE1BQVAsR0FBZ0IsSUFBaEI7O0FBRVgsWUFuQmlELENBbUJ0QztBQUNYLFlBQVcsT0FBTyxPQUFPLE9BQWQ7QUFDWDtBQUFXOztBQUdYLFdBN0JtQyxDQTZCekI7QUFDVixXQUFVLG9CQUFvQixDQUFwQixHQUF3QixPQUF4Qjs7QUFFVixXQWhDbUMsQ0FnQ3pCO0FBQ1YsV0FBVSxvQkFBb0IsQ0FBcEIsR0FBd0IsZ0JBQXhCOztBQUVWLFdBbkNtQyxDQW1DekI7QUFDVixXQUFVLG9CQUFvQixDQUFwQixHQUF3QixFQUF4Qjs7QUFFVixXQXRDbUMsQ0FzQ3pCO0FBQ1YsV0FBVSxPQUFPLG9CQUFvQixDQUFwQixDQUFQO0FBQ1Y7QUFBVSxHQXhDTTtBQXlDaEI7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJEOztBQUVBLE9BQUkseUJBQXlCLG9CQUFvQixDQUFwQixFQUF1QixTQUF2QixDQUE3Qjs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsT0FBSSxxQkFBcUIsb0JBQW9CLENBQXBCLENBQXpCOztBQUVBLE9BQUksc0JBQXNCLHVCQUF1QixrQkFBdkIsQ0FBMUI7O0FBRUE7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLEVBQXBCLENBQTdCOztBQUVBLE9BQUksMEJBQTBCLHVCQUF1QixzQkFBdkIsQ0FBOUI7O0FBRUEsT0FBSSwwQkFBMEIsb0JBQW9CLEVBQXBCLENBQTlCOztBQUVBLE9BQUksOEJBQThCLG9CQUFvQixFQUFwQixDQUFsQzs7QUFFQSxPQUFJLHdDQUF3QyxvQkFBb0IsRUFBcEIsQ0FBNUM7O0FBRUEsT0FBSSx5Q0FBeUMsdUJBQXVCLHFDQUF2QixDQUE3Qzs7QUFFQSxPQUFJLDZCQUE2QixvQkFBb0IsRUFBcEIsQ0FBakM7O0FBRUEsT0FBSSw4QkFBOEIsdUJBQXVCLDBCQUF2QixDQUFsQzs7QUFFQSxPQUFJLHdCQUF3QixvQkFBb0IsRUFBcEIsQ0FBNUI7O0FBRUEsT0FBSSx5QkFBeUIsdUJBQXVCLHFCQUF2QixDQUE3Qjs7QUFFQSxPQUFJLFVBQVUsb0JBQW9CLFNBQXBCLEVBQStCLE1BQTdDO0FBQ0EsWUFBUyxNQUFULEdBQWtCO0FBQ2hCLFFBQUksS0FBSyxTQUFUOztBQUVBLE9BQUcsT0FBSCxHQUFhLFVBQVUsS0FBVixFQUFpQixPQUFqQixFQUEwQjtBQUNyQyxZQUFPLDRCQUE0QixPQUE1QixDQUFvQyxLQUFwQyxFQUEyQyxPQUEzQyxFQUFvRCxFQUFwRCxDQUFQO0FBQ0QsS0FGRDtBQUdBLE9BQUcsVUFBSCxHQUFnQixVQUFVLEtBQVYsRUFBaUIsT0FBakIsRUFBMEI7QUFDeEMsWUFBTyw0QkFBNEIsVUFBNUIsQ0FBdUMsS0FBdkMsRUFBOEMsT0FBOUMsRUFBdUQsRUFBdkQsQ0FBUDtBQUNELEtBRkQ7O0FBSUEsT0FBRyxHQUFILEdBQVMsd0JBQXdCLFNBQXhCLENBQVQ7QUFDQSxPQUFHLFFBQUgsR0FBYyw0QkFBNEIsUUFBMUM7QUFDQSxPQUFHLGtCQUFILEdBQXdCLHVDQUF1QyxTQUF2QyxDQUF4QjtBQUNBLE9BQUcsTUFBSCxHQUFZLHdCQUF3QixNQUFwQztBQUNBLE9BQUcsS0FBSCxHQUFXLHdCQUF3QixLQUFuQzs7QUFFQSxXQUFPLEVBQVA7QUFDRDs7QUFFRCxPQUFJLE9BQU8sUUFBWDtBQUNBLFFBQUssTUFBTCxHQUFjLE1BQWQ7O0FBRUEsMEJBQXVCLFNBQXZCLEVBQWtDLElBQWxDOztBQUVBLFFBQUssT0FBTCxHQUFlLDRCQUE0QixTQUE1QixDQUFmOztBQUVBLFFBQUssU0FBTCxJQUFrQixJQUFsQjs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsSUFBckI7QUFDQSxVQUFPLE9BQVAsR0FBaUIsUUFBUSxTQUFSLENBQWpCOztBQUVEO0FBQU8sR0FwRUc7QUFxRVY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjs7QUFFaEM7O0FBRUEsV0FBUSxTQUFSLElBQXFCLFVBQVUsR0FBVixFQUFlO0FBQ2xDLFdBQU8sT0FBTyxJQUFJLFVBQVgsR0FBd0IsR0FBeEIsR0FBOEI7QUFDbkMsZ0JBQVc7QUFEd0IsS0FBckM7QUFHRCxJQUpEOztBQU1BLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFRDtBQUFPLEdBbEZHO0FBbUZWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxPQUFJLDBCQUEwQixvQkFBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBOUI7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTdCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxPQUFJLGtCQUFrQixvQkFBb0IsQ0FBcEIsQ0FBdEI7O0FBRUEsT0FBSSxPQUFPLHdCQUF3QixlQUF4QixDQUFYOztBQUVBO0FBQ0E7O0FBRUEsT0FBSSx3QkFBd0Isb0JBQW9CLEVBQXBCLENBQTVCOztBQUVBLE9BQUkseUJBQXlCLHVCQUF1QixxQkFBdkIsQ0FBN0I7O0FBRUEsT0FBSSx1QkFBdUIsb0JBQW9CLENBQXBCLENBQTNCOztBQUVBLE9BQUksd0JBQXdCLHVCQUF1QixvQkFBdkIsQ0FBNUI7O0FBRUEsT0FBSSxtQkFBbUIsb0JBQW9CLENBQXBCLENBQXZCOztBQUVBLE9BQUksUUFBUSx3QkFBd0IsZ0JBQXhCLENBQVo7O0FBRUEsT0FBSSxxQkFBcUIsb0JBQW9CLEVBQXBCLENBQXpCOztBQUVBLE9BQUksVUFBVSx3QkFBd0Isa0JBQXhCLENBQWQ7O0FBRUEsT0FBSSx3QkFBd0Isb0JBQW9CLEVBQXBCLENBQTVCOztBQUVBLE9BQUkseUJBQXlCLHVCQUF1QixxQkFBdkIsQ0FBN0I7O0FBRUE7QUFDQSxZQUFTLE1BQVQsR0FBa0I7QUFDaEIsUUFBSSxLQUFLLElBQUksS0FBSyxxQkFBVCxFQUFUOztBQUVBLFVBQU0sTUFBTixDQUFhLEVBQWIsRUFBaUIsSUFBakI7QUFDQSxPQUFHLFVBQUgsR0FBZ0IsdUJBQXVCLFNBQXZCLENBQWhCO0FBQ0EsT0FBRyxTQUFILEdBQWUsc0JBQXNCLFNBQXRCLENBQWY7QUFDQSxPQUFHLEtBQUgsR0FBVyxLQUFYO0FBQ0EsT0FBRyxnQkFBSCxHQUFzQixNQUFNLGdCQUE1Qjs7QUFFQSxPQUFHLEVBQUgsR0FBUSxPQUFSO0FBQ0EsT0FBRyxRQUFILEdBQWMsVUFBVSxJQUFWLEVBQWdCO0FBQzVCLFlBQU8sUUFBUSxRQUFSLENBQWlCLElBQWpCLEVBQXVCLEVBQXZCLENBQVA7QUFDRCxLQUZEOztBQUlBLFdBQU8sRUFBUDtBQUNEOztBQUVELE9BQUksT0FBTyxRQUFYO0FBQ0EsUUFBSyxNQUFMLEdBQWMsTUFBZDs7QUFFQSwwQkFBdUIsU0FBdkIsRUFBa0MsSUFBbEM7O0FBRUEsUUFBSyxTQUFMLElBQWtCLElBQWxCOztBQUVBLFdBQVEsU0FBUixJQUFxQixJQUFyQjtBQUNBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQXJKRztBQXNKVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCOztBQUVoQzs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsVUFBVSxHQUFWLEVBQWU7QUFDbEMsUUFBSSxPQUFPLElBQUksVUFBZixFQUEyQjtBQUN6QixZQUFPLEdBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxTQUFJLFNBQVMsRUFBYjs7QUFFQSxTQUFJLE9BQU8sSUFBWCxFQUFpQjtBQUNmLFdBQUssSUFBSSxHQUFULElBQWdCLEdBQWhCLEVBQXFCO0FBQ25CLFdBQUksT0FBTyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLEdBQXJDLEVBQTBDLEdBQTFDLENBQUosRUFBb0QsT0FBTyxHQUFQLElBQWMsSUFBSSxHQUFKLENBQWQ7QUFDckQ7QUFDRjs7QUFFRCxZQUFPLFNBQVAsSUFBb0IsR0FBcEI7QUFDQSxZQUFPLE1BQVA7QUFDRDtBQUNGLElBZkQ7O0FBaUJBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFRDtBQUFPLEdBOUtHO0FBK0tWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxPQUFJLHlCQUF5QixvQkFBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBN0I7O0FBRUEsV0FBUSxVQUFSLEdBQXFCLElBQXJCO0FBQ0EsV0FBUSxxQkFBUixHQUFnQyxxQkFBaEM7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLE9BQUksYUFBYSxvQkFBb0IsQ0FBcEIsQ0FBakI7O0FBRUEsT0FBSSxjQUFjLHVCQUF1QixVQUF2QixDQUFsQjs7QUFFQSxPQUFJLFdBQVcsb0JBQW9CLEVBQXBCLENBQWY7O0FBRUEsT0FBSSxjQUFjLG9CQUFvQixFQUFwQixDQUFsQjs7QUFFQSxPQUFJLFVBQVUsb0JBQW9CLEVBQXBCLENBQWQ7O0FBRUEsT0FBSSxXQUFXLHVCQUF1QixPQUF2QixDQUFmOztBQUVBLE9BQUksVUFBVSxRQUFkO0FBQ0EsV0FBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsT0FBSSxvQkFBb0IsQ0FBeEI7O0FBRUEsV0FBUSxpQkFBUixHQUE0QixpQkFBNUI7QUFDQSxPQUFJLG1CQUFtQjtBQUNyQixPQUFHLGFBRGtCLEVBQ0g7QUFDbEIsT0FBRyxlQUZrQjtBQUdyQixPQUFHLGVBSGtCO0FBSXJCLE9BQUcsVUFKa0I7QUFLckIsT0FBRyxrQkFMa0I7QUFNckIsT0FBRyxpQkFOa0I7QUFPckIsT0FBRztBQVBrQixJQUF2Qjs7QUFVQSxXQUFRLGdCQUFSLEdBQTJCLGdCQUEzQjtBQUNBLE9BQUksYUFBYSxpQkFBakI7O0FBRUEsWUFBUyxxQkFBVCxDQUErQixPQUEvQixFQUF3QyxRQUF4QyxFQUFrRCxVQUFsRCxFQUE4RDtBQUM1RCxTQUFLLE9BQUwsR0FBZSxXQUFXLEVBQTFCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLFlBQVksRUFBNUI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsY0FBYyxFQUFoQzs7QUFFQSxhQUFTLHNCQUFULENBQWdDLElBQWhDO0FBQ0EsZ0JBQVkseUJBQVosQ0FBc0MsSUFBdEM7QUFDRDs7QUFFRCx5QkFBc0IsU0FBdEIsR0FBa0M7QUFDaEMsaUJBQWEscUJBRG1COztBQUdoQyxZQUFRLFNBQVMsU0FBVCxDQUh3QjtBQUloQyxTQUFLLFNBQVMsU0FBVCxFQUFvQixHQUpPOztBQU1oQyxvQkFBZ0IsU0FBUyxjQUFULENBQXdCLElBQXhCLEVBQThCLEVBQTlCLEVBQWtDO0FBQ2hELFNBQUksT0FBTyxRQUFQLENBQWdCLElBQWhCLENBQXFCLElBQXJCLE1BQStCLFVBQW5DLEVBQStDO0FBQzdDLFVBQUksRUFBSixFQUFRO0FBQ04sYUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLHlDQUEzQixDQUFOO0FBQ0Q7QUFDRCxhQUFPLE1BQVAsQ0FBYyxLQUFLLE9BQW5CLEVBQTRCLElBQTVCO0FBQ0QsTUFMRCxNQUtPO0FBQ0wsV0FBSyxPQUFMLENBQWEsSUFBYixJQUFxQixFQUFyQjtBQUNEO0FBQ0YsS0FmK0I7QUFnQmhDLHNCQUFrQixTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDO0FBQ2hELFlBQU8sS0FBSyxPQUFMLENBQWEsSUFBYixDQUFQO0FBQ0QsS0FsQitCOztBQW9CaEMscUJBQWlCLFNBQVMsZUFBVCxDQUF5QixJQUF6QixFQUErQixPQUEvQixFQUF3QztBQUN2RCxTQUFJLE9BQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixNQUErQixVQUFuQyxFQUErQztBQUM3QyxhQUFPLE1BQVAsQ0FBYyxLQUFLLFFBQW5CLEVBQTZCLElBQTdCO0FBQ0QsTUFGRCxNQUVPO0FBQ0wsVUFBSSxPQUFPLE9BQVAsS0FBbUIsV0FBdkIsRUFBb0M7QUFDbEMsYUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLDhDQUE4QyxJQUE5QyxHQUFxRCxnQkFBaEYsQ0FBTjtBQUNEO0FBQ0QsV0FBSyxRQUFMLENBQWMsSUFBZCxJQUFzQixPQUF0QjtBQUNEO0FBQ0YsS0E3QitCO0FBOEJoQyx1QkFBbUIsU0FBUyxpQkFBVCxDQUEyQixJQUEzQixFQUFpQztBQUNsRCxZQUFPLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBUDtBQUNELEtBaEMrQjs7QUFrQ2hDLHVCQUFtQixTQUFTLGlCQUFULENBQTJCLElBQTNCLEVBQWlDLEVBQWpDLEVBQXFDO0FBQ3RELFNBQUksT0FBTyxRQUFQLENBQWdCLElBQWhCLENBQXFCLElBQXJCLE1BQStCLFVBQW5DLEVBQStDO0FBQzdDLFVBQUksRUFBSixFQUFRO0FBQ04sYUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLDRDQUEzQixDQUFOO0FBQ0Q7QUFDRCxhQUFPLE1BQVAsQ0FBYyxLQUFLLFVBQW5CLEVBQStCLElBQS9CO0FBQ0QsTUFMRCxNQUtPO0FBQ0wsV0FBSyxVQUFMLENBQWdCLElBQWhCLElBQXdCLEVBQXhCO0FBQ0Q7QUFDRixLQTNDK0I7QUE0Q2hDLHlCQUFxQixTQUFTLG1CQUFULENBQTZCLElBQTdCLEVBQW1DO0FBQ3RELFlBQU8sS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQTlDK0IsSUFBbEM7O0FBaURBLE9BQUksTUFBTSxTQUFTLFNBQVQsRUFBb0IsR0FBOUI7O0FBRUEsV0FBUSxHQUFSLEdBQWMsR0FBZDtBQUNBLFdBQVEsV0FBUixHQUFzQixPQUFPLFdBQTdCO0FBQ0EsV0FBUSxNQUFSLEdBQWlCLFNBQVMsU0FBVCxDQUFqQjs7QUFFRDtBQUFPLEdBelJHO0FBMFJWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjtBQUNBLFdBQVEsTUFBUixHQUFpQixNQUFqQjtBQUNBLFdBQVEsT0FBUixHQUFrQixPQUFsQjtBQUNBLFdBQVEsZ0JBQVIsR0FBMkIsZ0JBQTNCO0FBQ0EsV0FBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsV0FBUSxXQUFSLEdBQXNCLFdBQXRCO0FBQ0EsV0FBUSxXQUFSLEdBQXNCLFdBQXRCO0FBQ0EsV0FBUSxpQkFBUixHQUE0QixpQkFBNUI7QUFDQSxPQUFJLFNBQVM7QUFDWCxTQUFLLE9BRE07QUFFWCxTQUFLLE1BRk07QUFHWCxTQUFLLE1BSE07QUFJWCxTQUFLLFFBSk07QUFLWCxTQUFLLFFBTE07QUFNWCxTQUFLLFFBTk07QUFPWCxTQUFLO0FBUE0sSUFBYjs7QUFVQSxPQUFJLFdBQVcsWUFBZjtBQUFBLE9BQ0ksV0FBVyxXQURmOztBQUdBLFlBQVMsVUFBVCxDQUFvQixHQUFwQixFQUF5QjtBQUN2QixXQUFPLE9BQU8sR0FBUCxDQUFQO0FBQ0Q7O0FBRUQsWUFBUyxNQUFULENBQWdCLEdBQWhCLENBQW9CLGlCQUFwQixFQUF1QztBQUNyQyxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxVQUFLLElBQUksR0FBVCxJQUFnQixVQUFVLENBQVYsQ0FBaEIsRUFBOEI7QUFDNUIsVUFBSSxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsVUFBVSxDQUFWLENBQXJDLEVBQW1ELEdBQW5ELENBQUosRUFBNkQ7QUFDM0QsV0FBSSxHQUFKLElBQVcsVUFBVSxDQUFWLEVBQWEsR0FBYixDQUFYO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFdBQU8sR0FBUDtBQUNEOztBQUVELE9BQUksV0FBVyxPQUFPLFNBQVAsQ0FBaUIsUUFBaEM7O0FBRUEsV0FBUSxRQUFSLEdBQW1CLFFBQW5CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBSSxhQUFhLFNBQVMsVUFBVCxDQUFvQixLQUFwQixFQUEyQjtBQUMxQyxXQUFPLE9BQU8sS0FBUCxLQUFpQixVQUF4QjtBQUNELElBRkQ7QUFHQTtBQUNBO0FBQ0EsT0FBSSxXQUFXLEdBQVgsQ0FBSixFQUFxQjtBQUNuQixZQUFRLFVBQVIsR0FBcUIsYUFBYSxvQkFBVSxLQUFWLEVBQWlCO0FBQ2pELFlBQU8sT0FBTyxLQUFQLEtBQWlCLFVBQWpCLElBQStCLFNBQVMsSUFBVCxDQUFjLEtBQWQsTUFBeUIsbUJBQS9EO0FBQ0QsS0FGRDtBQUdEO0FBQ0QsV0FBUSxVQUFSLEdBQXFCLFVBQXJCOztBQUVBOztBQUVBO0FBQ0EsT0FBSSxVQUFVLE1BQU0sT0FBTixJQUFpQixVQUFVLEtBQVYsRUFBaUI7QUFDOUMsV0FBTyxTQUFTLFFBQU8sS0FBUCx5Q0FBTyxLQUFQLE9BQWlCLFFBQTFCLEdBQXFDLFNBQVMsSUFBVCxDQUFjLEtBQWQsTUFBeUIsZ0JBQTlELEdBQWlGLEtBQXhGO0FBQ0QsSUFGRDs7QUFJQSxXQUFRLE9BQVIsR0FBa0IsT0FBbEI7QUFDQTs7QUFFQSxZQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0IsS0FBeEIsRUFBK0I7QUFDN0IsU0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLE1BQU0sTUFBTSxNQUE1QixFQUFvQyxJQUFJLEdBQXhDLEVBQTZDLEdBQTdDLEVBQWtEO0FBQ2hELFNBQUksTUFBTSxDQUFOLE1BQWEsS0FBakIsRUFBd0I7QUFDdEIsYUFBTyxDQUFQO0FBQ0Q7QUFDRjtBQUNELFdBQU8sQ0FBQyxDQUFSO0FBQ0Q7O0FBRUQsWUFBUyxnQkFBVCxDQUEwQixNQUExQixFQUFrQztBQUNoQyxRQUFJLE9BQU8sTUFBUCxLQUFrQixRQUF0QixFQUFnQztBQUM5QjtBQUNBLFNBQUksVUFBVSxPQUFPLE1BQXJCLEVBQTZCO0FBQzNCLGFBQU8sT0FBTyxNQUFQLEVBQVA7QUFDRCxNQUZELE1BRU8sSUFBSSxVQUFVLElBQWQsRUFBb0I7QUFDekIsYUFBTyxFQUFQO0FBQ0QsTUFGTSxNQUVBLElBQUksQ0FBQyxNQUFMLEVBQWE7QUFDbEIsYUFBTyxTQUFTLEVBQWhCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsY0FBUyxLQUFLLE1BQWQ7QUFDRDs7QUFFRCxRQUFJLENBQUMsU0FBUyxJQUFULENBQWMsTUFBZCxDQUFMLEVBQTRCO0FBQzFCLFlBQU8sTUFBUDtBQUNEO0FBQ0QsV0FBTyxPQUFPLE9BQVAsQ0FBZSxRQUFmLEVBQXlCLFVBQXpCLENBQVA7QUFDRDs7QUFFRCxZQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0I7QUFDdEIsUUFBSSxDQUFDLEtBQUQsSUFBVSxVQUFVLENBQXhCLEVBQTJCO0FBQ3pCLFlBQU8sSUFBUDtBQUNELEtBRkQsTUFFTyxJQUFJLFFBQVEsS0FBUixLQUFrQixNQUFNLE1BQU4sS0FBaUIsQ0FBdkMsRUFBMEM7QUFDL0MsWUFBTyxJQUFQO0FBQ0QsS0FGTSxNQUVBO0FBQ0wsWUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRCxZQUFTLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkI7QUFDM0IsUUFBSSxRQUFRLE9BQU8sRUFBUCxFQUFXLE1BQVgsQ0FBWjtBQUNBLFVBQU0sT0FBTixHQUFnQixNQUFoQjtBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUVELFlBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixHQUE3QixFQUFrQztBQUNoQyxXQUFPLElBQVAsR0FBYyxHQUFkO0FBQ0EsV0FBTyxNQUFQO0FBQ0Q7O0FBRUQsWUFBUyxpQkFBVCxDQUEyQixXQUEzQixFQUF3QyxFQUF4QyxFQUE0QztBQUMxQyxXQUFPLENBQUMsY0FBYyxjQUFjLEdBQTVCLEdBQWtDLEVBQW5DLElBQXlDLEVBQWhEO0FBQ0Q7O0FBRUY7QUFBTyxHQXpaRztBQTBaVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTdCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxPQUFJLGFBQWEsQ0FBQyxhQUFELEVBQWdCLFVBQWhCLEVBQTRCLFlBQTVCLEVBQTBDLFNBQTFDLEVBQXFELE1BQXJELEVBQTZELFFBQTdELEVBQXVFLE9BQXZFLENBQWpCOztBQUVBLFlBQVMsU0FBVCxDQUFtQixPQUFuQixFQUE0QixJQUE1QixFQUFrQztBQUNoQyxRQUFJLE1BQU0sUUFBUSxLQUFLLEdBQXZCO0FBQUEsUUFDSSxPQUFPLFNBRFg7QUFBQSxRQUVJLFNBQVMsU0FGYjtBQUdBLFFBQUksR0FBSixFQUFTO0FBQ1AsWUFBTyxJQUFJLEtBQUosQ0FBVSxJQUFqQjtBQUNBLGNBQVMsSUFBSSxLQUFKLENBQVUsTUFBbkI7O0FBRUEsZ0JBQVcsUUFBUSxJQUFSLEdBQWUsR0FBZixHQUFxQixNQUFoQztBQUNEOztBQUVELFFBQUksTUFBTSxNQUFNLFNBQU4sQ0FBZ0IsV0FBaEIsQ0FBNEIsSUFBNUIsQ0FBaUMsSUFBakMsRUFBdUMsT0FBdkMsQ0FBVjs7QUFFQTtBQUNBLFNBQUssSUFBSSxNQUFNLENBQWYsRUFBa0IsTUFBTSxXQUFXLE1BQW5DLEVBQTJDLEtBQTNDLEVBQWtEO0FBQ2hELFVBQUssV0FBVyxHQUFYLENBQUwsSUFBd0IsSUFBSSxXQUFXLEdBQVgsQ0FBSixDQUF4QjtBQUNEOztBQUVEO0FBQ0EsUUFBSSxNQUFNLGlCQUFWLEVBQTZCO0FBQzNCLFdBQU0saUJBQU4sQ0FBd0IsSUFBeEIsRUFBOEIsU0FBOUI7QUFDRDs7QUFFRCxRQUFJO0FBQ0YsU0FBSSxHQUFKLEVBQVM7QUFDUCxXQUFLLFVBQUwsR0FBa0IsSUFBbEI7O0FBRUE7QUFDQTtBQUNBLFVBQUksc0JBQUosRUFBNEI7QUFDMUIsY0FBTyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFFBQTVCLEVBQXNDO0FBQ3BDLGVBQU8sTUFENkI7QUFFcEMsb0JBQVk7QUFGd0IsUUFBdEM7QUFJRCxPQUxELE1BS087QUFDTCxZQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0Q7QUFDRjtBQUNGLEtBZkQsQ0FlRSxPQUFPLEdBQVAsRUFBWTtBQUNaO0FBQ0Q7QUFDRjs7QUFFRCxhQUFVLFNBQVYsR0FBc0IsSUFBSSxLQUFKLEVBQXRCOztBQUVBLFdBQVEsU0FBUixJQUFxQixTQUFyQjtBQUNBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQXJkRztBQXNkVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQsVUFBTyxPQUFQLEdBQWlCLEVBQUUsV0FBVyxvQkFBb0IsQ0FBcEIsQ0FBYixFQUFxQyxZQUFZLElBQWpELEVBQWpCOztBQUVEO0FBQU8sR0EzZEc7QUE0ZFY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJELE9BQUksSUFBSSxvQkFBb0IsQ0FBcEIsQ0FBUjtBQUNBLFVBQU8sT0FBUCxHQUFpQixTQUFTLGNBQVQsQ0FBd0IsRUFBeEIsRUFBNEIsR0FBNUIsRUFBaUMsSUFBakMsRUFBc0M7QUFDckQsV0FBTyxFQUFFLE9BQUYsQ0FBVSxFQUFWLEVBQWMsR0FBZCxFQUFtQixJQUFuQixDQUFQO0FBQ0QsSUFGRDs7QUFJRDtBQUFPLEdBcGVHO0FBcWVWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDLE9BQUksVUFBVSxNQUFkO0FBQ0EsVUFBTyxPQUFQLEdBQWlCO0FBQ2YsWUFBWSxRQUFRLE1BREw7QUFFZixjQUFZLFFBQVEsY0FGTDtBQUdmLFlBQVksR0FBRyxvQkFIQTtBQUlmLGFBQVksUUFBUSx3QkFKTDtBQUtmLGFBQVksUUFBUSxjQUxMO0FBTWYsY0FBWSxRQUFRLGdCQU5MO0FBT2YsYUFBWSxRQUFRLElBUEw7QUFRZixjQUFZLFFBQVEsbUJBUkw7QUFTZixnQkFBWSxRQUFRLHFCQVRMO0FBVWYsVUFBWSxHQUFHO0FBVkEsSUFBakI7O0FBYUQ7QUFBTyxHQXRmRztBQXVmVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTdCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjtBQUNBLFdBQVEsc0JBQVIsR0FBaUMsc0JBQWpDOztBQUVBLE9BQUksNkJBQTZCLG9CQUFvQixFQUFwQixDQUFqQzs7QUFFQSxPQUFJLDhCQUE4Qix1QkFBdUIsMEJBQXZCLENBQWxDOztBQUVBLE9BQUksZUFBZSxvQkFBb0IsRUFBcEIsQ0FBbkI7O0FBRUEsT0FBSSxnQkFBZ0IsdUJBQXVCLFlBQXZCLENBQXBCOztBQUVBLE9BQUksd0JBQXdCLG9CQUFvQixFQUFwQixDQUE1Qjs7QUFFQSxPQUFJLHlCQUF5Qix1QkFBdUIscUJBQXZCLENBQTdCOztBQUVBLE9BQUksYUFBYSxvQkFBb0IsRUFBcEIsQ0FBakI7O0FBRUEsT0FBSSxjQUFjLHVCQUF1QixVQUF2QixDQUFsQjs7QUFFQSxPQUFJLGNBQWMsb0JBQW9CLEVBQXBCLENBQWxCOztBQUVBLE9BQUksZUFBZSx1QkFBdUIsV0FBdkIsQ0FBbkI7O0FBRUEsT0FBSSxpQkFBaUIsb0JBQW9CLEVBQXBCLENBQXJCOztBQUVBLE9BQUksa0JBQWtCLHVCQUF1QixjQUF2QixDQUF0Qjs7QUFFQSxPQUFJLGVBQWUsb0JBQW9CLEVBQXBCLENBQW5COztBQUVBLE9BQUksZ0JBQWdCLHVCQUF1QixZQUF2QixDQUFwQjs7QUFFQSxZQUFTLHNCQUFULENBQWdDLFFBQWhDLEVBQTBDO0FBQ3hDLGdDQUE0QixTQUE1QixFQUF1QyxRQUF2QztBQUNBLGtCQUFjLFNBQWQsRUFBeUIsUUFBekI7QUFDQSwyQkFBdUIsU0FBdkIsRUFBa0MsUUFBbEM7QUFDQSxnQkFBWSxTQUFaLEVBQXVCLFFBQXZCO0FBQ0EsaUJBQWEsU0FBYixFQUF3QixRQUF4QjtBQUNBLG9CQUFnQixTQUFoQixFQUEyQixRQUEzQjtBQUNBLGtCQUFjLFNBQWQsRUFBeUIsUUFBekI7QUFDRDs7QUFFRjtBQUFPLEdBdmlCRztBQXdpQlY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJEOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxPQUFJLFNBQVMsb0JBQW9CLENBQXBCLENBQWI7O0FBRUEsV0FBUSxTQUFSLElBQXFCLFVBQVUsUUFBVixFQUFvQjtBQUN2QyxhQUFTLGNBQVQsQ0FBd0Isb0JBQXhCLEVBQThDLFVBQVUsT0FBVixFQUFtQixPQUFuQixFQUE0QjtBQUN4RSxTQUFJLFVBQVUsUUFBUSxPQUF0QjtBQUFBLFNBQ0ksS0FBSyxRQUFRLEVBRGpCOztBQUdBLFNBQUksWUFBWSxJQUFoQixFQUFzQjtBQUNwQixhQUFPLEdBQUcsSUFBSCxDQUFQO0FBQ0QsTUFGRCxNQUVPLElBQUksWUFBWSxLQUFaLElBQXFCLFdBQVcsSUFBcEMsRUFBMEM7QUFDL0MsYUFBTyxRQUFRLElBQVIsQ0FBUDtBQUNELE1BRk0sTUFFQSxJQUFJLE9BQU8sT0FBUCxDQUFlLE9BQWYsQ0FBSixFQUE2QjtBQUNsQyxVQUFJLFFBQVEsTUFBUixHQUFpQixDQUFyQixFQUF3QjtBQUN0QixXQUFJLFFBQVEsR0FBWixFQUFpQjtBQUNmLGdCQUFRLEdBQVIsR0FBYyxDQUFDLFFBQVEsSUFBVCxDQUFkO0FBQ0Q7O0FBRUQsY0FBTyxTQUFTLE9BQVQsQ0FBaUIsSUFBakIsQ0FBc0IsT0FBdEIsRUFBK0IsT0FBL0IsQ0FBUDtBQUNELE9BTkQsTUFNTztBQUNMLGNBQU8sUUFBUSxJQUFSLENBQVA7QUFDRDtBQUNGLE1BVk0sTUFVQTtBQUNMLFVBQUksUUFBUSxJQUFSLElBQWdCLFFBQVEsR0FBNUIsRUFBaUM7QUFDL0IsV0FBSSxPQUFPLE9BQU8sV0FBUCxDQUFtQixRQUFRLElBQTNCLENBQVg7QUFDQSxZQUFLLFdBQUwsR0FBbUIsT0FBTyxpQkFBUCxDQUF5QixRQUFRLElBQVIsQ0FBYSxXQUF0QyxFQUFtRCxRQUFRLElBQTNELENBQW5CO0FBQ0EsaUJBQVUsRUFBRSxNQUFNLElBQVIsRUFBVjtBQUNEOztBQUVELGFBQU8sR0FBRyxPQUFILEVBQVksT0FBWixDQUFQO0FBQ0Q7QUFDRixLQTNCRDtBQTRCRCxJQTdCRDs7QUErQkEsVUFBTyxPQUFQLEdBQWlCLFFBQVEsU0FBUixDQUFqQjs7QUFFRDtBQUFPLEdBbGxCRztBQW1sQlY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJEOztBQUVBLE9BQUkseUJBQXlCLG9CQUFvQixDQUFwQixFQUF1QixTQUF2QixDQUE3Qjs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLE9BQUksYUFBYSxvQkFBb0IsQ0FBcEIsQ0FBakI7O0FBRUEsT0FBSSxjQUFjLHVCQUF1QixVQUF2QixDQUFsQjs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsVUFBVSxRQUFWLEVBQW9CO0FBQ3ZDLGFBQVMsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxVQUFVLE9BQVYsRUFBbUIsT0FBbkIsRUFBNEI7QUFDMUQsU0FBSSxDQUFDLE9BQUwsRUFBYztBQUNaLFlBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQiw2QkFBM0IsQ0FBTjtBQUNEOztBQUVELFNBQUksS0FBSyxRQUFRLEVBQWpCO0FBQUEsU0FDSSxVQUFVLFFBQVEsT0FEdEI7QUFBQSxTQUVJLElBQUksQ0FGUjtBQUFBLFNBR0ksTUFBTSxFQUhWO0FBQUEsU0FJSSxPQUFPLFNBSlg7QUFBQSxTQUtJLGNBQWMsU0FMbEI7O0FBT0EsU0FBSSxRQUFRLElBQVIsSUFBZ0IsUUFBUSxHQUE1QixFQUFpQztBQUMvQixvQkFBYyxPQUFPLGlCQUFQLENBQXlCLFFBQVEsSUFBUixDQUFhLFdBQXRDLEVBQW1ELFFBQVEsR0FBUixDQUFZLENBQVosQ0FBbkQsSUFBcUUsR0FBbkY7QUFDRDs7QUFFRCxTQUFJLE9BQU8sVUFBUCxDQUFrQixPQUFsQixDQUFKLEVBQWdDO0FBQzlCLGdCQUFVLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBVjtBQUNEOztBQUVELFNBQUksUUFBUSxJQUFaLEVBQWtCO0FBQ2hCLGFBQU8sT0FBTyxXQUFQLENBQW1CLFFBQVEsSUFBM0IsQ0FBUDtBQUNEOztBQUVELGNBQVMsYUFBVCxDQUF1QixLQUF2QixFQUE4QixLQUE5QixFQUFxQyxJQUFyQyxFQUEyQztBQUN6QyxVQUFJLElBQUosRUFBVTtBQUNSLFlBQUssR0FBTCxHQUFXLEtBQVg7QUFDQSxZQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsWUFBSyxLQUFMLEdBQWEsVUFBVSxDQUF2QjtBQUNBLFlBQUssSUFBTCxHQUFZLENBQUMsQ0FBQyxJQUFkOztBQUVBLFdBQUksV0FBSixFQUFpQjtBQUNmLGFBQUssV0FBTCxHQUFtQixjQUFjLEtBQWpDO0FBQ0Q7QUFDRjs7QUFFRCxZQUFNLE1BQU0sR0FBRyxRQUFRLEtBQVIsQ0FBSCxFQUFtQjtBQUM3QixhQUFNLElBRHVCO0FBRTdCLG9CQUFhLE9BQU8sV0FBUCxDQUFtQixDQUFDLFFBQVEsS0FBUixDQUFELEVBQWlCLEtBQWpCLENBQW5CLEVBQTRDLENBQUMsY0FBYyxLQUFmLEVBQXNCLElBQXRCLENBQTVDO0FBRmdCLE9BQW5CLENBQVo7QUFJRDs7QUFFRCxTQUFJLFdBQVcsUUFBTyxPQUFQLHlDQUFPLE9BQVAsT0FBbUIsUUFBbEMsRUFBNEM7QUFDMUMsVUFBSSxPQUFPLE9BQVAsQ0FBZSxPQUFmLENBQUosRUFBNkI7QUFDM0IsWUFBSyxJQUFJLElBQUksUUFBUSxNQUFyQixFQUE2QixJQUFJLENBQWpDLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3ZDLFlBQUksS0FBSyxPQUFULEVBQWtCO0FBQ2hCLHVCQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsTUFBTSxRQUFRLE1BQVIsR0FBaUIsQ0FBM0M7QUFDRDtBQUNGO0FBQ0YsT0FORCxNQU1PO0FBQ0wsV0FBSSxXQUFXLFNBQWY7O0FBRUEsWUFBSyxJQUFJLEdBQVQsSUFBZ0IsT0FBaEIsRUFBeUI7QUFDdkIsWUFBSSxRQUFRLGNBQVIsQ0FBdUIsR0FBdkIsQ0FBSixFQUFpQztBQUMvQjtBQUNBO0FBQ0E7QUFDQSxhQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDMUIsd0JBQWMsUUFBZCxFQUF3QixJQUFJLENBQTVCO0FBQ0Q7QUFDRCxvQkFBVyxHQUFYO0FBQ0E7QUFDRDtBQUNGO0FBQ0QsV0FBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCLHNCQUFjLFFBQWQsRUFBd0IsSUFBSSxDQUE1QixFQUErQixJQUEvQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFJLE1BQU0sQ0FBVixFQUFhO0FBQ1gsWUFBTSxRQUFRLElBQVIsQ0FBTjtBQUNEOztBQUVELFlBQU8sR0FBUDtBQUNELEtBM0VEO0FBNEVELElBN0VEOztBQStFQSxVQUFPLE9BQVAsR0FBaUIsUUFBUSxTQUFSLENBQWpCOztBQUVEO0FBQU8sR0FuckJHO0FBb3JCVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTdCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxPQUFJLGFBQWEsb0JBQW9CLENBQXBCLENBQWpCOztBQUVBLE9BQUksY0FBYyx1QkFBdUIsVUFBdkIsQ0FBbEI7O0FBRUEsV0FBUSxTQUFSLElBQXFCLFVBQVUsUUFBVixFQUFvQjtBQUN2QyxhQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsWUFBWSxxQkFBcUI7QUFDeEUsU0FBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUI7QUFDQSxhQUFPLFNBQVA7QUFDRCxNQUhELE1BR087QUFDTDtBQUNBLFlBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQixzQkFBc0IsVUFBVSxVQUFVLE1BQVYsR0FBbUIsQ0FBN0IsRUFBZ0MsSUFBdEQsR0FBNkQsR0FBeEYsQ0FBTjtBQUNEO0FBQ0YsS0FSRDtBQVNELElBVkQ7O0FBWUEsVUFBTyxPQUFQLEdBQWlCLFFBQVEsU0FBUixDQUFqQjs7QUFFRDtBQUFPLEdBL3NCRztBQWd0QlY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJEOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxPQUFJLFNBQVMsb0JBQW9CLENBQXBCLENBQWI7O0FBRUEsV0FBUSxTQUFSLElBQXFCLFVBQVUsUUFBVixFQUFvQjtBQUN2QyxhQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsVUFBVSxXQUFWLEVBQXVCLE9BQXZCLEVBQWdDO0FBQzVELFNBQUksT0FBTyxVQUFQLENBQWtCLFdBQWxCLENBQUosRUFBb0M7QUFDbEMsb0JBQWMsWUFBWSxJQUFaLENBQWlCLElBQWpCLENBQWQ7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxTQUFJLENBQUMsUUFBUSxJQUFSLENBQWEsV0FBZCxJQUE2QixDQUFDLFdBQTlCLElBQTZDLE9BQU8sT0FBUCxDQUFlLFdBQWYsQ0FBakQsRUFBOEU7QUFDNUUsYUFBTyxRQUFRLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNELE1BRkQsTUFFTztBQUNMLGFBQU8sUUFBUSxFQUFSLENBQVcsSUFBWCxDQUFQO0FBQ0Q7QUFDRixLQWJEOztBQWVBLGFBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxVQUFVLFdBQVYsRUFBdUIsT0FBdkIsRUFBZ0M7QUFDaEUsWUFBTyxTQUFTLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsRUFBa0MsV0FBbEMsRUFBK0MsRUFBRSxJQUFJLFFBQVEsT0FBZCxFQUF1QixTQUFTLFFBQVEsRUFBeEMsRUFBNEMsTUFBTSxRQUFRLElBQTFELEVBQS9DLENBQVA7QUFDRCxLQUZEO0FBR0QsSUFuQkQ7O0FBcUJBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQWh2Qkc7QUFpdkJWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsVUFBVSxRQUFWLEVBQW9CO0FBQ3ZDLGFBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQixZQUFZLHNCQUFzQjtBQUMvRCxTQUFJLE9BQU8sQ0FBQyxTQUFELENBQVg7QUFBQSxTQUNJLFVBQVUsVUFBVSxVQUFVLE1BQVYsR0FBbUIsQ0FBN0IsQ0FEZDtBQUVBLFVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQVYsR0FBbUIsQ0FBdkMsRUFBMEMsR0FBMUMsRUFBK0M7QUFDN0MsV0FBSyxJQUFMLENBQVUsVUFBVSxDQUFWLENBQVY7QUFDRDs7QUFFRCxTQUFJLFFBQVEsQ0FBWjtBQUNBLFNBQUksUUFBUSxJQUFSLENBQWEsS0FBYixJQUFzQixJQUExQixFQUFnQztBQUM5QixjQUFRLFFBQVEsSUFBUixDQUFhLEtBQXJCO0FBQ0QsTUFGRCxNQUVPLElBQUksUUFBUSxJQUFSLElBQWdCLFFBQVEsSUFBUixDQUFhLEtBQWIsSUFBc0IsSUFBMUMsRUFBZ0Q7QUFDckQsY0FBUSxRQUFRLElBQVIsQ0FBYSxLQUFyQjtBQUNEO0FBQ0QsVUFBSyxDQUFMLElBQVUsS0FBVjs7QUFFQSxjQUFTLEdBQVQsQ0FBYSxLQUFiLENBQW1CLFFBQW5CLEVBQTZCLElBQTdCO0FBQ0QsS0FoQkQ7QUFpQkQsSUFsQkQ7O0FBb0JBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQTl3Qkc7QUErd0JWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsVUFBVSxRQUFWLEVBQW9CO0FBQ3ZDLGFBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxVQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0FBQ3RELFlBQU8sT0FBTyxJQUFJLEtBQUosQ0FBZDtBQUNELEtBRkQ7QUFHRCxJQUpEOztBQU1BLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQTl4Qkc7QUEreEJWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLFdBQVEsU0FBUixJQUFxQixVQUFVLFFBQVYsRUFBb0I7QUFDdkMsYUFBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLFVBQVUsT0FBVixFQUFtQixPQUFuQixFQUE0QjtBQUMxRCxTQUFJLE9BQU8sVUFBUCxDQUFrQixPQUFsQixDQUFKLEVBQWdDO0FBQzlCLGdCQUFVLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBVjtBQUNEOztBQUVELFNBQUksS0FBSyxRQUFRLEVBQWpCOztBQUVBLFNBQUksQ0FBQyxPQUFPLE9BQVAsQ0FBZSxPQUFmLENBQUwsRUFBOEI7QUFDNUIsVUFBSSxPQUFPLFFBQVEsSUFBbkI7QUFDQSxVQUFJLFFBQVEsSUFBUixJQUFnQixRQUFRLEdBQTVCLEVBQWlDO0FBQy9CLGNBQU8sT0FBTyxXQUFQLENBQW1CLFFBQVEsSUFBM0IsQ0FBUDtBQUNBLFlBQUssV0FBTCxHQUFtQixPQUFPLGlCQUFQLENBQXlCLFFBQVEsSUFBUixDQUFhLFdBQXRDLEVBQW1ELFFBQVEsR0FBUixDQUFZLENBQVosQ0FBbkQsQ0FBbkI7QUFDRDs7QUFFRCxhQUFPLEdBQUcsT0FBSCxFQUFZO0FBQ2pCLGFBQU0sSUFEVztBQUVqQixvQkFBYSxPQUFPLFdBQVAsQ0FBbUIsQ0FBQyxPQUFELENBQW5CLEVBQThCLENBQUMsUUFBUSxLQUFLLFdBQWQsQ0FBOUI7QUFGSSxPQUFaLENBQVA7QUFJRCxNQVhELE1BV087QUFDTCxhQUFPLFFBQVEsT0FBUixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFDRixLQXJCRDtBQXNCRCxJQXZCRDs7QUF5QkEsVUFBTyxPQUFQLEdBQWlCLFFBQVEsU0FBUixDQUFqQjs7QUFFRDtBQUFPLEdBbjBCRztBQW8wQlY7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJEOztBQUVBLE9BQUkseUJBQXlCLG9CQUFvQixDQUFwQixFQUF1QixTQUF2QixDQUE3Qjs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7QUFDQSxXQUFRLHlCQUFSLEdBQW9DLHlCQUFwQzs7QUFFQSxPQUFJLG9CQUFvQixvQkFBb0IsRUFBcEIsQ0FBeEI7O0FBRUEsT0FBSSxxQkFBcUIsdUJBQXVCLGlCQUF2QixDQUF6Qjs7QUFFQSxZQUFTLHlCQUFULENBQW1DLFFBQW5DLEVBQTZDO0FBQzNDLHVCQUFtQixTQUFuQixFQUE4QixRQUE5QjtBQUNEOztBQUVGO0FBQU8sR0F0MUJHO0FBdTFCVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7O0FBRUEsV0FBUSxVQUFSLEdBQXFCLElBQXJCOztBQUVBLE9BQUksU0FBUyxvQkFBb0IsQ0FBcEIsQ0FBYjs7QUFFQSxXQUFRLFNBQVIsSUFBcUIsVUFBVSxRQUFWLEVBQW9CO0FBQ3ZDLGFBQVMsaUJBQVQsQ0FBMkIsUUFBM0IsRUFBcUMsVUFBVSxFQUFWLEVBQWMsS0FBZCxFQUFxQixTQUFyQixFQUFnQyxPQUFoQyxFQUF5QztBQUM1RSxTQUFJLE1BQU0sRUFBVjtBQUNBLFNBQUksQ0FBQyxNQUFNLFFBQVgsRUFBcUI7QUFDbkIsWUFBTSxRQUFOLEdBQWlCLEVBQWpCO0FBQ0EsWUFBTSxhQUFVLE9BQVYsRUFBbUIsT0FBbkIsRUFBNEI7QUFDaEM7QUFDQSxXQUFJLFdBQVcsVUFBVSxRQUF6QjtBQUNBLGlCQUFVLFFBQVYsR0FBcUIsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixRQUFsQixFQUE0QixNQUFNLFFBQWxDLENBQXJCO0FBQ0EsV0FBSSxNQUFNLEdBQUcsT0FBSCxFQUFZLE9BQVosQ0FBVjtBQUNBLGlCQUFVLFFBQVYsR0FBcUIsUUFBckI7QUFDQSxjQUFPLEdBQVA7QUFDRCxPQVBEO0FBUUQ7O0FBRUQsV0FBTSxRQUFOLENBQWUsUUFBUSxJQUFSLENBQWEsQ0FBYixDQUFmLElBQWtDLFFBQVEsRUFBMUM7O0FBRUEsWUFBTyxHQUFQO0FBQ0QsS0FqQkQ7QUFrQkQsSUFuQkQ7O0FBcUJBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQXYzQkc7QUF3M0JWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLE9BQUksU0FBUztBQUNYLGVBQVcsQ0FBQyxPQUFELEVBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQixPQUExQixDQURBO0FBRVgsV0FBTyxNQUZJOztBQUlYO0FBQ0EsaUJBQWEsU0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCO0FBQ3ZDLFNBQUksT0FBTyxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzdCLFVBQUksV0FBVyxPQUFPLE9BQVAsQ0FBZSxPQUFPLFNBQXRCLEVBQWlDLE1BQU0sV0FBTixFQUFqQyxDQUFmO0FBQ0EsVUFBSSxZQUFZLENBQWhCLEVBQW1CO0FBQ2pCLGVBQVEsUUFBUjtBQUNELE9BRkQsTUFFTztBQUNMLGVBQVEsU0FBUyxLQUFULEVBQWdCLEVBQWhCLENBQVI7QUFDRDtBQUNGOztBQUVELFlBQU8sS0FBUDtBQUNELEtBaEJVOztBQWtCWDtBQUNBLFNBQUssU0FBUyxHQUFULENBQWEsS0FBYixFQUFvQjtBQUN2QixhQUFRLE9BQU8sV0FBUCxDQUFtQixLQUFuQixDQUFSOztBQUVBLFNBQUksT0FBTyxPQUFQLEtBQW1CLFdBQW5CLElBQWtDLE9BQU8sV0FBUCxDQUFtQixPQUFPLEtBQTFCLEtBQW9DLEtBQTFFLEVBQWlGO0FBQy9FLFVBQUksU0FBUyxPQUFPLFNBQVAsQ0FBaUIsS0FBakIsQ0FBYjtBQUNBLFVBQUksQ0FBQyxRQUFRLE1BQVIsQ0FBTCxFQUFzQjtBQUNwQjtBQUNBLGdCQUFTLEtBQVQ7QUFDRDs7QUFFRCxXQUFLLElBQUksT0FBTyxVQUFVLE1BQXJCLEVBQTZCLFVBQVUsTUFBTSxPQUFPLENBQVAsR0FBVyxPQUFPLENBQWxCLEdBQXNCLENBQTVCLENBQXZDLEVBQXVFLE9BQU8sQ0FBbkYsRUFBc0YsT0FBTyxJQUE3RixFQUFtRyxNQUFuRyxFQUEyRztBQUN6RyxlQUFRLE9BQU8sQ0FBZixJQUFvQixVQUFVLElBQVYsQ0FBcEI7QUFDRDs7QUFFRCxjQUFRLE1BQVIsRUFBZ0IsS0FBaEIsQ0FBc0IsT0FBdEIsRUFBK0IsT0FBL0IsRUFYK0UsQ0FXdEM7QUFDMUM7QUFDRjtBQW5DVSxJQUFiOztBQXNDQSxXQUFRLFNBQVIsSUFBcUIsTUFBckI7QUFDQSxVQUFPLE9BQVAsR0FBaUIsUUFBUSxTQUFSLENBQWpCOztBQUVEO0FBQU8sR0ExNkJHO0FBMjZCVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCOztBQUVoQztBQUNBOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjtBQUNBLFlBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QjtBQUMxQixTQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0Q7O0FBRUQsY0FBVyxTQUFYLENBQXFCLFFBQXJCLEdBQWdDLFdBQVcsU0FBWCxDQUFxQixNQUFyQixHQUE4QixZQUFZO0FBQ3hFLFdBQU8sS0FBSyxLQUFLLE1BQWpCO0FBQ0QsSUFGRDs7QUFJQSxXQUFRLFNBQVIsSUFBcUIsVUFBckI7QUFDQSxVQUFPLE9BQVAsR0FBaUIsUUFBUSxTQUFSLENBQWpCOztBQUVEO0FBQU8sR0E3N0JHO0FBODdCVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7O0FBRUEsT0FBSSxlQUFlLG9CQUFvQixFQUFwQixFQUF3QixTQUF4QixDQUFuQjs7QUFFQSxPQUFJLDBCQUEwQixvQkFBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBOUI7O0FBRUEsT0FBSSx5QkFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTdCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjtBQUNBLFdBQVEsYUFBUixHQUF3QixhQUF4QjtBQUNBLFdBQVEsUUFBUixHQUFtQixRQUFuQjtBQUNBLFdBQVEsV0FBUixHQUFzQixXQUF0QjtBQUNBLFdBQVEsY0FBUixHQUF5QixjQUF6QjtBQUNBLFdBQVEsYUFBUixHQUF3QixhQUF4QjtBQUNBLFdBQVEsSUFBUixHQUFlLElBQWY7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLE9BQUksUUFBUSx3QkFBd0IsTUFBeEIsQ0FBWjs7QUFFQSxPQUFJLGFBQWEsb0JBQW9CLENBQXBCLENBQWpCOztBQUVBLE9BQUksY0FBYyx1QkFBdUIsVUFBdkIsQ0FBbEI7O0FBRUEsT0FBSSxRQUFRLG9CQUFvQixDQUFwQixDQUFaOztBQUVBLFlBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUNuQyxRQUFJLG1CQUFtQixnQkFBZ0IsYUFBYSxDQUFiLENBQWhCLElBQW1DLENBQTFEO0FBQUEsUUFDSSxrQkFBa0IsTUFBTSxpQkFENUI7O0FBR0EsUUFBSSxxQkFBcUIsZUFBekIsRUFBMEM7QUFDeEMsU0FBSSxtQkFBbUIsZUFBdkIsRUFBd0M7QUFDdEMsVUFBSSxrQkFBa0IsTUFBTSxnQkFBTixDQUF1QixlQUF2QixDQUF0QjtBQUFBLFVBQ0ksbUJBQW1CLE1BQU0sZ0JBQU4sQ0FBdUIsZ0JBQXZCLENBRHZCO0FBRUEsWUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLDRGQUE0RixxREFBNUYsR0FBb0osZUFBcEosR0FBc0ssbURBQXRLLEdBQTROLGdCQUE1TixHQUErTyxJQUExUSxDQUFOO0FBQ0QsTUFKRCxNQUlPO0FBQ0w7QUFDQSxZQUFNLElBQUksWUFBWSxTQUFaLENBQUosQ0FBMkIsMkZBQTJGLGlEQUEzRixHQUErSSxhQUFhLENBQWIsQ0FBL0ksR0FBaUssSUFBNUwsQ0FBTjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxZQUFTLFFBQVQsQ0FBa0IsWUFBbEIsRUFBZ0MsR0FBaEMsRUFBcUM7QUFDbkM7QUFDQSxRQUFJLENBQUMsR0FBTCxFQUFVO0FBQ1IsV0FBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLG1DQUEzQixDQUFOO0FBQ0Q7QUFDRCxRQUFJLENBQUMsWUFBRCxJQUFpQixDQUFDLGFBQWEsSUFBbkMsRUFBeUM7QUFDdkMsV0FBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLHNDQUFxQyxZQUFyQyx5Q0FBcUMsWUFBckMsRUFBM0IsQ0FBTjtBQUNEOztBQUVELGlCQUFhLElBQWIsQ0FBa0IsU0FBbEIsR0FBOEIsYUFBYSxNQUEzQzs7QUFFQTtBQUNBO0FBQ0EsUUFBSSxFQUFKLENBQU8sYUFBUCxDQUFxQixhQUFhLFFBQWxDOztBQUVBLGFBQVMsb0JBQVQsQ0FBOEIsT0FBOUIsRUFBdUMsT0FBdkMsRUFBZ0QsT0FBaEQsRUFBeUQ7QUFDdkQsU0FBSSxRQUFRLElBQVosRUFBa0I7QUFDaEIsZ0JBQVUsTUFBTSxNQUFOLENBQWEsRUFBYixFQUFpQixPQUFqQixFQUEwQixRQUFRLElBQWxDLENBQVY7QUFDQSxVQUFJLFFBQVEsR0FBWixFQUFpQjtBQUNmLGVBQVEsR0FBUixDQUFZLENBQVosSUFBaUIsSUFBakI7QUFDRDtBQUNGOztBQUVELGVBQVUsSUFBSSxFQUFKLENBQU8sY0FBUCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixFQUFpQyxPQUFqQyxFQUEwQyxPQUExQyxFQUFtRCxPQUFuRCxDQUFWO0FBQ0EsU0FBSSxTQUFTLElBQUksRUFBSixDQUFPLGFBQVAsQ0FBcUIsSUFBckIsQ0FBMEIsSUFBMUIsRUFBZ0MsT0FBaEMsRUFBeUMsT0FBekMsRUFBa0QsT0FBbEQsQ0FBYjs7QUFFQSxTQUFJLFVBQVUsSUFBVixJQUFrQixJQUFJLE9BQTFCLEVBQW1DO0FBQ2pDLGNBQVEsUUFBUixDQUFpQixRQUFRLElBQXpCLElBQWlDLElBQUksT0FBSixDQUFZLE9BQVosRUFBcUIsYUFBYSxlQUFsQyxFQUFtRCxHQUFuRCxDQUFqQztBQUNBLGVBQVMsUUFBUSxRQUFSLENBQWlCLFFBQVEsSUFBekIsRUFBK0IsT0FBL0IsRUFBd0MsT0FBeEMsQ0FBVDtBQUNEO0FBQ0QsU0FBSSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsVUFBSSxRQUFRLE1BQVosRUFBb0I7QUFDbEIsV0FBSSxRQUFRLE9BQU8sS0FBUCxDQUFhLElBQWIsQ0FBWjtBQUNBLFlBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxJQUFJLE1BQU0sTUFBMUIsRUFBa0MsSUFBSSxDQUF0QyxFQUF5QyxHQUF6QyxFQUE4QztBQUM1QyxZQUFJLENBQUMsTUFBTSxDQUFOLENBQUQsSUFBYSxJQUFJLENBQUosS0FBVSxDQUEzQixFQUE4QjtBQUM1QjtBQUNEOztBQUVELGNBQU0sQ0FBTixJQUFXLFFBQVEsTUFBUixHQUFpQixNQUFNLENBQU4sQ0FBNUI7QUFDRDtBQUNELGdCQUFTLE1BQU0sSUFBTixDQUFXLElBQVgsQ0FBVDtBQUNEO0FBQ0QsYUFBTyxNQUFQO0FBQ0QsTUFiRCxNQWFPO0FBQ0wsWUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLGlCQUFpQixRQUFRLElBQXpCLEdBQWdDLDBEQUEzRCxDQUFOO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLFFBQUksWUFBWTtBQUNkLGFBQVEsU0FBUyxNQUFULENBQWdCLEdBQWhCLEVBQXFCLElBQXJCLEVBQTJCO0FBQ2pDLFVBQUksRUFBRSxRQUFRLEdBQVYsQ0FBSixFQUFvQjtBQUNsQixhQUFNLElBQUksWUFBWSxTQUFaLENBQUosQ0FBMkIsTUFBTSxJQUFOLEdBQWEsbUJBQWIsR0FBbUMsR0FBOUQsQ0FBTjtBQUNEO0FBQ0QsYUFBTyxJQUFJLElBQUosQ0FBUDtBQUNELE1BTmE7QUFPZCxhQUFRLFNBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixJQUF4QixFQUE4QjtBQUNwQyxVQUFJLE1BQU0sT0FBTyxNQUFqQjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxHQUFwQixFQUF5QixHQUF6QixFQUE4QjtBQUM1QixXQUFJLE9BQU8sQ0FBUCxLQUFhLE9BQU8sQ0FBUCxFQUFVLElBQVYsS0FBbUIsSUFBcEMsRUFBMEM7QUFDeEMsZUFBTyxPQUFPLENBQVAsRUFBVSxJQUFWLENBQVA7QUFDRDtBQUNGO0FBQ0YsTUFkYTtBQWVkLGFBQVEsU0FBUyxNQUFULENBQWdCLE9BQWhCLEVBQXlCLE9BQXpCLEVBQWtDO0FBQ3hDLGFBQU8sT0FBTyxPQUFQLEtBQW1CLFVBQW5CLEdBQWdDLFFBQVEsSUFBUixDQUFhLE9BQWIsQ0FBaEMsR0FBd0QsT0FBL0Q7QUFDRCxNQWpCYTs7QUFtQmQsdUJBQWtCLE1BQU0sZ0JBbkJWO0FBb0JkLG9CQUFlLG9CQXBCRDs7QUFzQmQsU0FBSSxTQUFTLEVBQVQsQ0FBWSxDQUFaLEVBQWU7QUFDakIsVUFBSSxNQUFNLGFBQWEsQ0FBYixDQUFWO0FBQ0EsVUFBSSxTQUFKLEdBQWdCLGFBQWEsSUFBSSxJQUFqQixDQUFoQjtBQUNBLGFBQU8sR0FBUDtBQUNELE1BMUJhOztBQTRCZCxlQUFVLEVBNUJJO0FBNkJkLGNBQVMsU0FBUyxPQUFULENBQWlCLENBQWpCLEVBQW9CLElBQXBCLEVBQTBCLG1CQUExQixFQUErQyxXQUEvQyxFQUE0RCxNQUE1RCxFQUFvRTtBQUMzRSxVQUFJLGlCQUFpQixLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQXJCO0FBQUEsVUFDSSxLQUFLLEtBQUssRUFBTCxDQUFRLENBQVIsQ0FEVDtBQUVBLFVBQUksUUFBUSxNQUFSLElBQWtCLFdBQWxCLElBQWlDLG1CQUFyQyxFQUEwRDtBQUN4RCx3QkFBaUIsWUFBWSxJQUFaLEVBQWtCLENBQWxCLEVBQXFCLEVBQXJCLEVBQXlCLElBQXpCLEVBQStCLG1CQUEvQixFQUFvRCxXQUFwRCxFQUFpRSxNQUFqRSxDQUFqQjtBQUNELE9BRkQsTUFFTyxJQUFJLENBQUMsY0FBTCxFQUFxQjtBQUMxQix3QkFBaUIsS0FBSyxRQUFMLENBQWMsQ0FBZCxJQUFtQixZQUFZLElBQVosRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0FBcEM7QUFDRDtBQUNELGFBQU8sY0FBUDtBQUNELE1BdENhOztBQXdDZCxXQUFNLFNBQVMsSUFBVCxDQUFjLEtBQWQsRUFBcUIsS0FBckIsRUFBNEI7QUFDaEMsYUFBTyxTQUFTLE9BQWhCLEVBQXlCO0FBQ3ZCLGVBQVEsTUFBTSxPQUFkO0FBQ0Q7QUFDRCxhQUFPLEtBQVA7QUFDRCxNQTdDYTtBQThDZCxZQUFPLFNBQVMsS0FBVCxDQUFlLEtBQWYsRUFBc0IsTUFBdEIsRUFBOEI7QUFDbkMsVUFBSSxNQUFNLFNBQVMsTUFBbkI7O0FBRUEsVUFBSSxTQUFTLE1BQVQsSUFBbUIsVUFBVSxNQUFqQyxFQUF5QztBQUN2QyxhQUFNLE1BQU0sTUFBTixDQUFhLEVBQWIsRUFBaUIsTUFBakIsRUFBeUIsS0FBekIsQ0FBTjtBQUNEOztBQUVELGFBQU8sR0FBUDtBQUNELE1BdERhO0FBdURkO0FBQ0Esa0JBQWEsYUFBYSxFQUFiLENBeERDOztBQTBEZCxXQUFNLElBQUksRUFBSixDQUFPLElBMURDO0FBMkRkLG1CQUFjLGFBQWE7QUEzRGIsS0FBaEI7O0FBOERBLGFBQVMsR0FBVCxDQUFhLE9BQWIsRUFBc0I7QUFDcEIsU0FBSSxVQUFVLFVBQVUsTUFBVixJQUFvQixDQUFwQixJQUF5QixVQUFVLENBQVYsTUFBaUIsU0FBMUMsR0FBc0QsRUFBdEQsR0FBMkQsVUFBVSxDQUFWLENBQXpFOztBQUVBLFNBQUksT0FBTyxRQUFRLElBQW5COztBQUVBLFNBQUksTUFBSixDQUFXLE9BQVg7QUFDQSxTQUFJLENBQUMsUUFBUSxPQUFULElBQW9CLGFBQWEsT0FBckMsRUFBOEM7QUFDNUMsYUFBTyxTQUFTLE9BQVQsRUFBa0IsSUFBbEIsQ0FBUDtBQUNEO0FBQ0QsU0FBSSxTQUFTLFNBQWI7QUFBQSxTQUNJLGNBQWMsYUFBYSxjQUFiLEdBQThCLEVBQTlCLEdBQW1DLFNBRHJEO0FBRUEsU0FBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCLFVBQUksUUFBUSxNQUFaLEVBQW9CO0FBQ2xCLGdCQUFTLFdBQVcsUUFBUSxNQUFSLENBQWUsQ0FBZixDQUFYLEdBQStCLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBaUIsUUFBUSxNQUF6QixDQUEvQixHQUFrRSxRQUFRLE1BQW5GO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZ0JBQVMsQ0FBQyxPQUFELENBQVQ7QUFDRDtBQUNGOztBQUVELGNBQVMsSUFBVCxDQUFjLE9BQWQsQ0FBc0IsYUFBdEIsRUFBcUM7QUFDbkMsYUFBTyxLQUFLLGFBQWEsSUFBYixDQUFrQixTQUFsQixFQUE2QixPQUE3QixFQUFzQyxVQUFVLE9BQWhELEVBQXlELFVBQVUsUUFBbkUsRUFBNkUsSUFBN0UsRUFBbUYsV0FBbkYsRUFBZ0csTUFBaEcsQ0FBWjtBQUNEO0FBQ0QsWUFBTyxrQkFBa0IsYUFBYSxJQUEvQixFQUFxQyxJQUFyQyxFQUEyQyxTQUEzQyxFQUFzRCxRQUFRLE1BQVIsSUFBa0IsRUFBeEUsRUFBNEUsSUFBNUUsRUFBa0YsV0FBbEYsQ0FBUDtBQUNBLFlBQU8sS0FBSyxPQUFMLEVBQWMsT0FBZCxDQUFQO0FBQ0Q7QUFDRCxRQUFJLEtBQUosR0FBWSxJQUFaOztBQUVBLFFBQUksTUFBSixHQUFhLFVBQVUsT0FBVixFQUFtQjtBQUM5QixTQUFJLENBQUMsUUFBUSxPQUFiLEVBQXNCO0FBQ3BCLGdCQUFVLE9BQVYsR0FBb0IsVUFBVSxLQUFWLENBQWdCLFFBQVEsT0FBeEIsRUFBaUMsSUFBSSxPQUFyQyxDQUFwQjs7QUFFQSxVQUFJLGFBQWEsVUFBakIsRUFBNkI7QUFDM0IsaUJBQVUsUUFBVixHQUFxQixVQUFVLEtBQVYsQ0FBZ0IsUUFBUSxRQUF4QixFQUFrQyxJQUFJLFFBQXRDLENBQXJCO0FBQ0Q7QUFDRCxVQUFJLGFBQWEsVUFBYixJQUEyQixhQUFhLGFBQTVDLEVBQTJEO0FBQ3pELGlCQUFVLFVBQVYsR0FBdUIsVUFBVSxLQUFWLENBQWdCLFFBQVEsVUFBeEIsRUFBb0MsSUFBSSxVQUF4QyxDQUF2QjtBQUNEO0FBQ0YsTUFURCxNQVNPO0FBQ0wsZ0JBQVUsT0FBVixHQUFvQixRQUFRLE9BQTVCO0FBQ0EsZ0JBQVUsUUFBVixHQUFxQixRQUFRLFFBQTdCO0FBQ0EsZ0JBQVUsVUFBVixHQUF1QixRQUFRLFVBQS9CO0FBQ0Q7QUFDRixLQWZEOztBQWlCQSxRQUFJLE1BQUosR0FBYSxVQUFVLENBQVYsRUFBYSxJQUFiLEVBQW1CLFdBQW5CLEVBQWdDLE1BQWhDLEVBQXdDO0FBQ25ELFNBQUksYUFBYSxjQUFiLElBQStCLENBQUMsV0FBcEMsRUFBaUQ7QUFDL0MsWUFBTSxJQUFJLFlBQVksU0FBWixDQUFKLENBQTJCLHdCQUEzQixDQUFOO0FBQ0Q7QUFDRCxTQUFJLGFBQWEsU0FBYixJQUEwQixDQUFDLE1BQS9CLEVBQXVDO0FBQ3JDLFlBQU0sSUFBSSxZQUFZLFNBQVosQ0FBSixDQUEyQix5QkFBM0IsQ0FBTjtBQUNEOztBQUVELFlBQU8sWUFBWSxTQUFaLEVBQXVCLENBQXZCLEVBQTBCLGFBQWEsQ0FBYixDQUExQixFQUEyQyxJQUEzQyxFQUFpRCxDQUFqRCxFQUFvRCxXQUFwRCxFQUFpRSxNQUFqRSxDQUFQO0FBQ0QsS0FURDtBQVVBLFdBQU8sR0FBUDtBQUNEOztBQUVELFlBQVMsV0FBVCxDQUFxQixTQUFyQixFQUFnQyxDQUFoQyxFQUFtQyxFQUFuQyxFQUF1QyxJQUF2QyxFQUE2QyxtQkFBN0MsRUFBa0UsV0FBbEUsRUFBK0UsTUFBL0UsRUFBdUY7QUFDckYsYUFBUyxJQUFULENBQWMsT0FBZCxFQUF1QjtBQUNyQixTQUFJLFVBQVUsVUFBVSxNQUFWLElBQW9CLENBQXBCLElBQXlCLFVBQVUsQ0FBVixNQUFpQixTQUExQyxHQUFzRCxFQUF0RCxHQUEyRCxVQUFVLENBQVYsQ0FBekU7O0FBRUEsU0FBSSxnQkFBZ0IsTUFBcEI7QUFDQSxTQUFJLFVBQVUsV0FBVyxPQUFPLENBQVAsQ0FBckIsSUFBa0MsRUFBRSxZQUFZLFVBQVUsV0FBdEIsSUFBcUMsT0FBTyxDQUFQLE1BQWMsSUFBckQsQ0FBdEMsRUFBa0c7QUFDaEcsc0JBQWdCLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBaUIsTUFBakIsQ0FBaEI7QUFDRDs7QUFFRCxZQUFPLEdBQUcsU0FBSCxFQUFjLE9BQWQsRUFBdUIsVUFBVSxPQUFqQyxFQUEwQyxVQUFVLFFBQXBELEVBQThELFFBQVEsSUFBUixJQUFnQixJQUE5RSxFQUFvRixlQUFlLENBQUMsUUFBUSxXQUFULEVBQXNCLE1BQXRCLENBQTZCLFdBQTdCLENBQW5HLEVBQThJLGFBQTlJLENBQVA7QUFDRDs7QUFFRCxXQUFPLGtCQUFrQixFQUFsQixFQUFzQixJQUF0QixFQUE0QixTQUE1QixFQUF1QyxNQUF2QyxFQUErQyxJQUEvQyxFQUFxRCxXQUFyRCxDQUFQOztBQUVBLFNBQUssT0FBTCxHQUFlLENBQWY7QUFDQSxTQUFLLEtBQUwsR0FBYSxTQUFTLE9BQU8sTUFBaEIsR0FBeUIsQ0FBdEM7QUFDQSxTQUFLLFdBQUwsR0FBbUIsdUJBQXVCLENBQTFDO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsWUFBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDLE9BQWpDLEVBQTBDLE9BQTFDLEVBQW1EO0FBQ2pELFFBQUksQ0FBQyxPQUFMLEVBQWM7QUFDWixTQUFJLFFBQVEsSUFBUixLQUFpQixnQkFBckIsRUFBdUM7QUFDckMsZ0JBQVUsUUFBUSxJQUFSLENBQWEsZUFBYixDQUFWO0FBQ0QsTUFGRCxNQUVPO0FBQ0wsZ0JBQVUsUUFBUSxRQUFSLENBQWlCLFFBQVEsSUFBekIsQ0FBVjtBQUNEO0FBQ0YsS0FORCxNQU1PLElBQUksQ0FBQyxRQUFRLElBQVQsSUFBaUIsQ0FBQyxRQUFRLElBQTlCLEVBQW9DO0FBQ3pDO0FBQ0EsYUFBUSxJQUFSLEdBQWUsT0FBZjtBQUNBLGVBQVUsUUFBUSxRQUFSLENBQWlCLE9BQWpCLENBQVY7QUFDRDtBQUNELFdBQU8sT0FBUDtBQUNEOztBQUVELFlBQVMsYUFBVCxDQUF1QixPQUF2QixFQUFnQyxPQUFoQyxFQUF5QyxPQUF6QyxFQUFrRDtBQUNoRDtBQUNBLFFBQUksc0JBQXNCLFFBQVEsSUFBUixJQUFnQixRQUFRLElBQVIsQ0FBYSxlQUFiLENBQTFDO0FBQ0EsWUFBUSxPQUFSLEdBQWtCLElBQWxCO0FBQ0EsUUFBSSxRQUFRLEdBQVosRUFBaUI7QUFDZixhQUFRLElBQVIsQ0FBYSxXQUFiLEdBQTJCLFFBQVEsR0FBUixDQUFZLENBQVosS0FBa0IsUUFBUSxJQUFSLENBQWEsV0FBMUQ7QUFDRDs7QUFFRCxRQUFJLGVBQWUsU0FBbkI7QUFDQSxRQUFJLFFBQVEsRUFBUixJQUFjLFFBQVEsRUFBUixLQUFlLElBQWpDLEVBQXVDO0FBQ3JDLE1BQUMsWUFBWTtBQUNYLGNBQVEsSUFBUixHQUFlLE1BQU0sV0FBTixDQUFrQixRQUFRLElBQTFCLENBQWY7QUFDQTtBQUNBLFVBQUksS0FBSyxRQUFRLEVBQWpCO0FBQ0EscUJBQWUsUUFBUSxJQUFSLENBQWEsZUFBYixJQUFnQyxTQUFTLG1CQUFULENBQTZCLE9BQTdCLEVBQXNDO0FBQ25GLFdBQUksVUFBVSxVQUFVLE1BQVYsSUFBb0IsQ0FBcEIsSUFBeUIsVUFBVSxDQUFWLE1BQWlCLFNBQTFDLEdBQXNELEVBQXRELEdBQTJELFVBQVUsQ0FBVixDQUF6RTs7QUFFQTtBQUNBO0FBQ0EsZUFBUSxJQUFSLEdBQWUsTUFBTSxXQUFOLENBQWtCLFFBQVEsSUFBMUIsQ0FBZjtBQUNBLGVBQVEsSUFBUixDQUFhLGVBQWIsSUFBZ0MsbUJBQWhDO0FBQ0EsY0FBTyxHQUFHLE9BQUgsRUFBWSxPQUFaLENBQVA7QUFDRCxPQVJEO0FBU0EsVUFBSSxHQUFHLFFBQVAsRUFBaUI7QUFDZixlQUFRLFFBQVIsR0FBbUIsTUFBTSxNQUFOLENBQWEsRUFBYixFQUFpQixRQUFRLFFBQXpCLEVBQW1DLEdBQUcsUUFBdEMsQ0FBbkI7QUFDRDtBQUNGLE1BaEJEO0FBaUJEOztBQUVELFFBQUksWUFBWSxTQUFaLElBQXlCLFlBQTdCLEVBQTJDO0FBQ3pDLGVBQVUsWUFBVjtBQUNEOztBQUVELFFBQUksWUFBWSxTQUFoQixFQUEyQjtBQUN6QixXQUFNLElBQUksWUFBWSxTQUFaLENBQUosQ0FBMkIsaUJBQWlCLFFBQVEsSUFBekIsR0FBZ0MscUJBQTNELENBQU47QUFDRCxLQUZELE1BRU8sSUFBSSxtQkFBbUIsUUFBdkIsRUFBaUM7QUFDdEMsWUFBTyxRQUFRLE9BQVIsRUFBaUIsT0FBakIsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQsWUFBUyxJQUFULEdBQWdCO0FBQ2QsV0FBTyxFQUFQO0FBQ0Q7O0FBRUQsWUFBUyxRQUFULENBQWtCLE9BQWxCLEVBQTJCLElBQTNCLEVBQWlDO0FBQy9CLFFBQUksQ0FBQyxJQUFELElBQVMsRUFBRSxVQUFVLElBQVosQ0FBYixFQUFnQztBQUM5QixZQUFPLE9BQU8sTUFBTSxXQUFOLENBQWtCLElBQWxCLENBQVAsR0FBaUMsRUFBeEM7QUFDQSxVQUFLLElBQUwsR0FBWSxPQUFaO0FBQ0Q7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFFRCxZQUFTLGlCQUFULENBQTJCLEVBQTNCLEVBQStCLElBQS9CLEVBQXFDLFNBQXJDLEVBQWdELE1BQWhELEVBQXdELElBQXhELEVBQThELFdBQTlELEVBQTJFO0FBQ3pFLFFBQUksR0FBRyxTQUFQLEVBQWtCO0FBQ2hCLFNBQUksUUFBUSxFQUFaO0FBQ0EsWUFBTyxHQUFHLFNBQUgsQ0FBYSxJQUFiLEVBQW1CLEtBQW5CLEVBQTBCLFNBQTFCLEVBQXFDLFVBQVUsT0FBTyxDQUFQLENBQS9DLEVBQTBELElBQTFELEVBQWdFLFdBQWhFLEVBQTZFLE1BQTdFLENBQVA7QUFDQSxXQUFNLE1BQU4sQ0FBYSxJQUFiLEVBQW1CLEtBQW5CO0FBQ0Q7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFFRjtBQUFPLEdBbnZDRztBQW92Q1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJELFVBQU8sT0FBUCxHQUFpQixFQUFFLFdBQVcsb0JBQW9CLEVBQXBCLENBQWIsRUFBc0MsWUFBWSxJQUFsRCxFQUFqQjs7QUFFRDtBQUFPLEdBenZDRztBQTB2Q1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixtQkFBMUIsRUFBK0M7O0FBRXJELHVCQUFvQixFQUFwQjtBQUNBLFVBQU8sT0FBUCxHQUFpQixvQkFBb0IsRUFBcEIsRUFBd0IsTUFBeEIsQ0FBK0IsSUFBaEQ7O0FBRUQ7QUFBTyxHQWh3Q0c7QUFpd0NWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDtBQUNBLE9BQUksV0FBVyxvQkFBb0IsRUFBcEIsQ0FBZjs7QUFFQSx1QkFBb0IsRUFBcEIsRUFBd0IsTUFBeEIsRUFBZ0MsVUFBUyxLQUFULEVBQWU7QUFDN0MsV0FBTyxTQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWlCO0FBQ3RCLFlBQU8sU0FBUyxTQUFTLEVBQVQsQ0FBVCxHQUF3QixNQUFNLEVBQU4sQ0FBeEIsR0FBb0MsRUFBM0M7QUFDRCxLQUZEO0FBR0QsSUFKRDs7QUFNRDtBQUFPLEdBN3dDRztBQTh3Q1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjs7QUFFaEMsVUFBTyxPQUFQLEdBQWlCLFVBQVMsRUFBVCxFQUFZO0FBQzNCLFdBQU8sUUFBTyxFQUFQLHlDQUFPLEVBQVAsT0FBYyxRQUFkLEdBQXlCLE9BQU8sSUFBaEMsR0FBdUMsT0FBTyxFQUFQLEtBQWMsVUFBNUQ7QUFDRCxJQUZEOztBQUlEO0FBQU8sR0FyeENHO0FBc3hDVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLG1CQUExQixFQUErQzs7QUFFckQ7QUFDQSxPQUFJLFVBQVUsb0JBQW9CLEVBQXBCLENBQWQ7QUFBQSxPQUNJLE9BQVUsb0JBQW9CLEVBQXBCLENBRGQ7QUFBQSxPQUVJLFFBQVUsb0JBQW9CLEVBQXBCLENBRmQ7QUFHQSxVQUFPLE9BQVAsR0FBaUIsVUFBUyxHQUFULEVBQWMsSUFBZCxFQUFtQjtBQUNsQyxRQUFJLEtBQU0sQ0FBQyxLQUFLLE1BQUwsSUFBZSxFQUFoQixFQUFvQixHQUFwQixLQUE0QixPQUFPLEdBQVAsQ0FBdEM7QUFBQSxRQUNJLE1BQU0sRUFEVjtBQUVBLFFBQUksR0FBSixJQUFXLEtBQUssRUFBTCxDQUFYO0FBQ0EsWUFBUSxRQUFRLENBQVIsR0FBWSxRQUFRLENBQVIsR0FBWSxNQUFNLFlBQVU7QUFBRSxRQUFHLENBQUg7QUFBUSxLQUExQixDQUFoQyxFQUE2RCxRQUE3RCxFQUF1RSxHQUF2RTtBQUNELElBTEQ7O0FBT0Q7QUFBTyxHQXB5Q0c7QUFxeUNWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRCxPQUFJLFNBQVksb0JBQW9CLEVBQXBCLENBQWhCO0FBQUEsT0FDSSxPQUFZLG9CQUFvQixFQUFwQixDQURoQjtBQUFBLE9BRUksTUFBWSxvQkFBb0IsRUFBcEIsQ0FGaEI7QUFBQSxPQUdJLFlBQVksV0FIaEI7O0FBS0EsT0FBSSxVQUFVLFNBQVYsT0FBVSxDQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQTRCO0FBQ3hDLFFBQUksWUFBWSxPQUFPLFFBQVEsQ0FBL0I7QUFBQSxRQUNJLFlBQVksT0FBTyxRQUFRLENBRC9CO0FBQUEsUUFFSSxZQUFZLE9BQU8sUUFBUSxDQUYvQjtBQUFBLFFBR0ksV0FBWSxPQUFPLFFBQVEsQ0FIL0I7QUFBQSxRQUlJLFVBQVksT0FBTyxRQUFRLENBSi9CO0FBQUEsUUFLSSxVQUFZLE9BQU8sUUFBUSxDQUwvQjtBQUFBLFFBTUksVUFBWSxZQUFZLElBQVosR0FBbUIsS0FBSyxJQUFMLE1BQWUsS0FBSyxJQUFMLElBQWEsRUFBNUIsQ0FObkM7QUFBQSxRQU9JLFNBQVksWUFBWSxNQUFaLEdBQXFCLFlBQVksT0FBTyxJQUFQLENBQVosR0FBMkIsQ0FBQyxPQUFPLElBQVAsS0FBZ0IsRUFBakIsRUFBcUIsU0FBckIsQ0FQaEU7QUFBQSxRQVFJLEdBUko7QUFBQSxRQVFTLEdBUlQ7QUFBQSxRQVFjLEdBUmQ7QUFTQSxRQUFHLFNBQUgsRUFBYSxTQUFTLElBQVQ7QUFDYixTQUFJLEdBQUosSUFBVyxNQUFYLEVBQWtCO0FBQ2hCO0FBQ0EsV0FBTSxDQUFDLFNBQUQsSUFBYyxNQUFkLElBQXdCLE9BQU8sTUFBckM7QUFDQSxTQUFHLE9BQU8sT0FBTyxPQUFqQixFQUF5QjtBQUN6QjtBQUNBLFdBQU0sTUFBTSxPQUFPLEdBQVAsQ0FBTixHQUFvQixPQUFPLEdBQVAsQ0FBMUI7QUFDQTtBQUNBLGFBQVEsR0FBUixJQUFlLGFBQWEsT0FBTyxPQUFPLEdBQVAsQ0FBUCxJQUFzQixVQUFuQyxHQUFnRCxPQUFPLEdBQVA7QUFDL0Q7QUFEZSxPQUViLFdBQVcsR0FBWCxHQUFpQixJQUFJLEdBQUosRUFBUztBQUM1QjtBQURtQixNQUFqQixHQUVBLFdBQVcsT0FBTyxHQUFQLEtBQWUsR0FBMUIsR0FBaUMsVUFBUyxDQUFULEVBQVc7QUFDNUMsVUFBSSxJQUFJLFNBQUosQ0FBSSxDQUFTLEtBQVQsRUFBZTtBQUNyQixjQUFPLGdCQUFnQixDQUFoQixHQUFvQixJQUFJLENBQUosQ0FBTSxLQUFOLENBQXBCLEdBQW1DLEVBQUUsS0FBRixDQUExQztBQUNELE9BRkQ7QUFHQSxRQUFFLFNBQUYsSUFBZSxFQUFFLFNBQUYsQ0FBZjtBQUNBLGFBQU8sQ0FBUDtBQUNGO0FBQ0MsTUFQaUMsQ0FPL0IsR0FQK0IsQ0FBaEMsR0FPUSxZQUFZLE9BQU8sR0FBUCxJQUFjLFVBQTFCLEdBQXVDLElBQUksU0FBUyxJQUFiLEVBQW1CLEdBQW5CLENBQXZDLEdBQWlFLEdBWDNFO0FBWUEsU0FBRyxRQUFILEVBQVksQ0FBQyxRQUFRLFNBQVIsTUFBdUIsUUFBUSxTQUFSLElBQXFCLEVBQTVDLENBQUQsRUFBa0QsR0FBbEQsSUFBeUQsR0FBekQ7QUFDYjtBQUNGLElBaENEO0FBaUNBO0FBQ0EsV0FBUSxDQUFSLEdBQVksQ0FBWixDQXpDcUQsQ0F5Q3JDO0FBQ2hCLFdBQVEsQ0FBUixHQUFZLENBQVosQ0ExQ3FELENBMENyQztBQUNoQixXQUFRLENBQVIsR0FBWSxDQUFaLENBM0NxRCxDQTJDckM7QUFDaEIsV0FBUSxDQUFSLEdBQVksQ0FBWixDQTVDcUQsQ0E0Q3JDO0FBQ2hCLFdBQVEsQ0FBUixHQUFZLEVBQVosQ0E3Q3FELENBNkNyQztBQUNoQixXQUFRLENBQVIsR0FBWSxFQUFaLENBOUNxRCxDQThDckM7QUFDaEIsVUFBTyxPQUFQLEdBQWlCLE9BQWpCOztBQUVEO0FBQU8sR0F2MUNHO0FBdzFDVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCOztBQUVoQztBQUNBLE9BQUksU0FBUyxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLElBQWlCLFdBQWpCLElBQWdDLE9BQU8sSUFBUCxJQUFlLElBQS9DLEdBQzFCLE1BRDBCLEdBQ2pCLE9BQU8sSUFBUCxJQUFlLFdBQWYsSUFBOEIsS0FBSyxJQUFMLElBQWEsSUFBM0MsR0FBa0QsSUFBbEQsR0FBeUQsU0FBUyxhQUFULEdBRHRFO0FBRUEsT0FBRyxPQUFPLEdBQVAsSUFBYyxRQUFqQixFQUEwQixNQUFNLE1BQU4sQ0FMTSxDQUtROztBQUV6QztBQUFPLEdBaDJDRztBQWkyQ1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjs7QUFFaEMsT0FBSSxPQUFPLE9BQU8sT0FBUCxHQUFpQixFQUFDLFNBQVMsT0FBVixFQUE1QjtBQUNBLE9BQUcsT0FBTyxHQUFQLElBQWMsUUFBakIsRUFBMEIsTUFBTSxJQUFOLENBSE0sQ0FHTTs7QUFFdkM7QUFBTyxHQXYyQ0c7QUF3MkNWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDtBQUNBLE9BQUksWUFBWSxvQkFBb0IsRUFBcEIsQ0FBaEI7QUFDQSxVQUFPLE9BQVAsR0FBaUIsVUFBUyxFQUFULEVBQWEsSUFBYixFQUFtQixNQUFuQixFQUEwQjtBQUN6QyxjQUFVLEVBQVY7QUFDQSxRQUFHLFNBQVMsU0FBWixFQUFzQixPQUFPLEVBQVA7QUFDdEIsWUFBTyxNQUFQO0FBQ0UsVUFBSyxDQUFMO0FBQVEsYUFBTyxVQUFTLENBQVQsRUFBVztBQUN4QixjQUFPLEdBQUcsSUFBSCxDQUFRLElBQVIsRUFBYyxDQUFkLENBQVA7QUFDRCxPQUZPO0FBR1IsVUFBSyxDQUFMO0FBQVEsYUFBTyxVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWM7QUFDM0IsY0FBTyxHQUFHLElBQUgsQ0FBUSxJQUFSLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixDQUFQO0FBQ0QsT0FGTztBQUdSLFVBQUssQ0FBTDtBQUFRLGFBQU8sVUFBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsRUFBaUI7QUFDOUIsY0FBTyxHQUFHLElBQUgsQ0FBUSxJQUFSLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixDQUFQO0FBQ0QsT0FGTztBQVBWO0FBV0EsV0FBTyxZQUFTLGFBQWM7QUFDNUIsWUFBTyxHQUFHLEtBQUgsQ0FBUyxJQUFULEVBQWUsU0FBZixDQUFQO0FBQ0QsS0FGRDtBQUdELElBakJEOztBQW1CRDtBQUFPLEdBaDRDRztBQWk0Q1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjs7QUFFaEMsVUFBTyxPQUFQLEdBQWlCLFVBQVMsRUFBVCxFQUFZO0FBQzNCLFFBQUcsT0FBTyxFQUFQLElBQWEsVUFBaEIsRUFBMkIsTUFBTSxVQUFVLEtBQUsscUJBQWYsQ0FBTjtBQUMzQixXQUFPLEVBQVA7QUFDRCxJQUhEOztBQUtEO0FBQU8sR0F6NENHO0FBMDRDVjtBQUNBLE9BQU8sVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCOztBQUVoQyxVQUFPLE9BQVAsR0FBaUIsVUFBUyxJQUFULEVBQWM7QUFDN0IsUUFBSTtBQUNGLFlBQU8sQ0FBQyxDQUFDLE1BQVQ7QUFDRCxLQUZELENBRUUsT0FBTSxDQUFOLEVBQVE7QUFDUixZQUFPLElBQVA7QUFDRDtBQUNGLElBTkQ7O0FBUUQ7QUFBTyxHQXI1Q0c7QUFzNUNWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDLDhCQUE0QixXQUFTLE1BQVQsRUFBaUI7QUFBQztBQUM5Qzs7QUFFQSxZQUFRLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsWUFBUSxTQUFSLElBQXFCLFVBQVUsVUFBVixFQUFzQjtBQUN6QztBQUNBLFNBQUksT0FBTyxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0MsTUFBaEMsR0FBeUMsTUFBcEQ7QUFBQSxTQUNJLGNBQWMsS0FBSyxVQUR2QjtBQUVBO0FBQ0EsZ0JBQVcsVUFBWCxHQUF3QixZQUFZO0FBQ2xDLFVBQUksS0FBSyxVQUFMLEtBQW9CLFVBQXhCLEVBQW9DO0FBQ2xDLFlBQUssVUFBTCxHQUFrQixXQUFsQjtBQUNEO0FBQ0QsYUFBTyxVQUFQO0FBQ0QsTUFMRDtBQU1ELEtBWEQ7O0FBYUEsV0FBTyxPQUFQLEdBQWlCLFFBQVEsU0FBUixDQUFqQjtBQUNBO0FBQTRCLElBbkJBLEVBbUJDLElBbkJELENBbUJNLE9BbkJOLEVBbUJnQixZQUFXO0FBQUUsV0FBTyxJQUFQO0FBQWMsSUFBM0IsRUFuQmhCLENBQUQ7O0FBcUI1QjtBQUFPLEdBOTZDRztBQSs2Q1Y7QUFDQSxPQUFPLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjs7QUFFaEM7O0FBRUEsV0FBUSxVQUFSLEdBQXFCLElBQXJCO0FBQ0EsT0FBSSxNQUFNO0FBQ1I7QUFDQSxhQUFTO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsdUJBQWtCLFNBQVMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0M7QUFDaEQsYUFBTyxLQUFLLElBQUwsS0FBYyxlQUFkLElBQWlDLENBQUMsS0FBSyxJQUFMLEtBQWMsbUJBQWQsSUFBcUMsS0FBSyxJQUFMLEtBQWMsZ0JBQXBELEtBQXlFLENBQUMsRUFBRSxLQUFLLE1BQUwsSUFBZSxLQUFLLE1BQUwsQ0FBWSxNQUEzQixJQUFxQyxLQUFLLElBQTVDLENBQWxIO0FBQ0QsTUFOTTs7QUFRUCxlQUFVLFNBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QjtBQUNoQyxhQUFRLGNBQWEsSUFBYixDQUFrQixLQUFLLFFBQXZCO0FBQVI7QUFFRCxNQVhNOztBQWFQO0FBQ0E7QUFDQSxlQUFVLFNBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QjtBQUNoQyxhQUFPLEtBQUssS0FBTCxDQUFXLE1BQVgsS0FBc0IsQ0FBdEIsSUFBMkIsQ0FBQyxJQUFJLE9BQUosQ0FBWSxRQUFaLENBQXFCLElBQXJCLENBQTVCLElBQTBELENBQUMsS0FBSyxLQUF2RTtBQUNEO0FBakJNO0FBRkQsSUFBVjs7QUF1QkE7QUFDQTtBQUNBLFdBQVEsU0FBUixJQUFxQixHQUFyQjtBQUNBLFVBQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakI7O0FBRUQ7QUFBTyxHQWo5Q0c7QUFrOUNWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsbUJBQTFCLEVBQStDOztBQUVyRDs7QUFFQSxPQUFJLHlCQUF5QixvQkFBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBN0I7O0FBRUEsT0FBSSwwQkFBMEIsb0JBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQTlCOztBQUVBLFdBQVEsVUFBUixHQUFxQixJQUFyQjtBQUNBLFdBQVEsS0FBUixHQUFnQixLQUFoQjs7QUFFQSxPQUFJLFVBQVUsb0JBQW9CLEVBQXBCLENBQWQ7O0FBRUEsT0FBSSxXQUFXLHVCQUF1QixPQUF2QixDQUFmOztBQUVBLE9BQUkscUJBQXFCLG9CQUFvQixFQUFwQixDQUF6Qjs7QUFFQSxPQUFJLHNCQUFzQix1QkFBdUIsa0JBQXZCLENBQTFCOztBQUVBLE9BQUksV0FBVyxvQkFBb0IsRUFBcEIsQ0FBZjs7QUFFQSxPQUFJLFVBQVUsd0JBQXdCLFFBQXhCLENBQWQ7O0FBRUEsT0FBSSxTQUFTLG9CQUFvQixDQUFwQixDQUFiOztBQUVBLFdBQVEsTUFBUixHQUFpQixTQUFTLFNBQVQsQ0FBakI7O0FBRUEsT0FBSSxLQUFLLEVBQVQ7QUFDQSxVQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLE9BQWxCOztBQUVBLFlBQVMsS0FBVCxDQUFlLEtBQWYsRUFBc0IsT0FBdEIsRUFBK0I7QUFDN0I7QUFDQSxRQUFJLE1BQU0sSUFBTixLQUFlLFNBQW5CLEVBQThCO0FBQzVCLFlBQU8sS0FBUDtBQUNEOztBQUVELGFBQVMsU0FBVCxFQUFvQixFQUFwQixHQUF5QixFQUF6Qjs7QUFFQTtBQUNBLE9BQUcsT0FBSCxHQUFhLFVBQVUsT0FBVixFQUFtQjtBQUM5QixZQUFPLElBQUksR0FBRyxjQUFQLENBQXNCLFdBQVcsUUFBUSxPQUF6QyxFQUFrRCxPQUFsRCxDQUFQO0FBQ0QsS0FGRDs7QUFJQSxRQUFJLFFBQVEsSUFBSSxvQkFBb0IsU0FBcEIsQ0FBSixDQUFtQyxPQUFuQyxDQUFaO0FBQ0EsV0FBTyxNQUFNLE1BQU4sQ0FBYSxTQUFTLFNBQVQsRUFBb0IsS0FBcEIsQ0FBMEIsS0FBMUIsQ0FBYixDQUFQO0FBQ0Q7O0FBRUY7QUFBTyxHQWxnREc7QUFtZ0RWO0FBQ0EsT0FBTyxVQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEI7O0FBRWhDO0FBQ0E7QUFDQTs7QUFFQSxXQUFRLFVBQVIsR0FBcUIsSUFBckI7QUFDQSxPQUFJLGFBQWMsWUFBWTtBQUMxQixRQUFJLFNBQVMsRUFBRSxPQUFPLFNBQVMsS0FBVCxHQUFpQixDQUFFLENBQTVCO0FBQ1QsU0FBSSxFQURLO0FBRVQsZUFBVSxFQUFFLFNBQVMsQ0FBWCxFQUFjLFFBQVEsQ0FBdEIsRUFBeUIsV0FBVyxDQUFwQyxFQUF1QyxPQUFPLENBQTlDLEVBQWlELHVCQUF1QixDQUF4RSxFQUEyRSxhQUFhLENBQXhGLEVBQTJGLFlBQVksQ0FBdkcsRUFBMEcsU0FBUyxDQUFuSCxFQUFzSCxZQUFZLEVBQWxJLEVBQXNJLFdBQVcsRUFBakosRUFBcUosZ0JBQWdCLEVBQXJLLEVBQXlLLFdBQVcsRUFBcEwsRUFBd0wsV0FBVyxFQUFuTSxFQUF1TSxXQUFXLEVBQWxOLEVBQXNOLGdCQUFnQixFQUF0TyxFQUEwTyw2QkFBNkIsRUFBdlEsRUFBMlEsaUJBQWlCLEVBQTVSLEVBQWdTLGtCQUFrQixFQUFsVCxFQUFzVCxjQUFjLEVBQXBVLEVBQXdVLDRCQUE0QixFQUFwVyxFQUF3Vyx3QkFBd0IsRUFBaFksRUFBb1ksbUJBQW1CLEVBQXZaLEVBQTJaLGFBQWEsRUFBeGEsRUFBNGEsaUJBQWlCLEVBQTdiLEVBQWljLGNBQWMsRUFBL2MsRUFBbWQsZUFBZSxFQUFsZSxFQUFzZSxpQkFBaUIsRUFBdmYsRUFBMmYsY0FBYyxFQUF6Z0IsRUFBNmdCLHlCQUF5QixFQUF0aUIsRUFBMGlCLHFCQUFxQixFQUEvakIsRUFBbWtCLHFCQUFxQixFQUF4bEIsRUFBNGxCLFNBQVMsRUFBcm1CLEVBQXltQixnQkFBZ0IsRUFBem5CLEVBQTZuQiwyQkFBMkIsRUFBeHBCLEVBQTRwQix1QkFBdUIsRUFBbnJCLEVBQXVyQix1QkFBdUIsRUFBOXNCLEVBQWt0QixvQkFBb0IsRUFBdHVCLEVBQTB1QixzQkFBc0IsRUFBaHdCLEVBQW93QixnQ0FBZ0MsRUFBcHlCLEVBQXd5Qiw0QkFBNEIsRUFBcDBCLEVBQXcwQiw0QkFBNEIsRUFBcDJCLEVBQXcyQixxQkFBcUIsRUFBNzNCLEVBQWk0QixXQUFXLEVBQTU0QixFQUFnNUIsZ0JBQWdCLEVBQWg2QixFQUFvNkIsd0JBQXdCLEVBQTU3QixFQUFnOEIsaUJBQWlCLEVBQWo5QixFQUFxOUIsUUFBUSxFQUE3OUIsRUFBaStCLHdCQUF3QixFQUF6L0IsRUFBNi9CLG9CQUFvQixFQUFqaEMsRUFBcWhDLGtCQUFrQixFQUF2aUMsRUFBMmlDLHdCQUF3QixFQUFua0MsRUFBdWtDLG9CQUFvQixFQUEzbEMsRUFBK2xDLG1CQUFtQixFQUFsbkMsRUFBc25DLGdCQUFnQixFQUF0b0MsRUFBMG9DLGVBQWUsRUFBenBDLEVBQTZwQyx1QkFBdUIsRUFBcHJDLEVBQXdyQyxtQkFBbUIsRUFBM3NDLEVBQStzQyxvQkFBb0IsRUFBbnVDLEVBQXV1QyxzQkFBc0IsRUFBN3ZDLEVBQWl3QyxnQ0FBZ0MsRUFBanlDLEVBQXF5Qyw0QkFBNEIsRUFBajBDLEVBQXEwQyxTQUFTLEVBQTkwQyxFQUFrMUMsU0FBUyxFQUEzMUMsRUFBKzFDLGNBQWMsRUFBNzJDLEVBQWkzQyxxQkFBcUIsRUFBdDRDLEVBQTA0QyxpQkFBaUIsRUFBMzVDLEVBQSs1QyxlQUFlLEVBQTk2QyxFQUFrN0MsUUFBUSxFQUExN0MsRUFBODdDLHlCQUF5QixFQUF2OUMsRUFBMjlDLGVBQWUsRUFBMStDLEVBQTgrQyxNQUFNLEVBQXAvQyxFQUF3L0MsVUFBVSxFQUFsZ0QsRUFBc2dELGVBQWUsRUFBcmhELEVBQXloRCxxQkFBcUIsRUFBOWlELEVBQWtqRCxnQ0FBZ0MsRUFBbGxELEVBQXNsRCxzQkFBc0IsRUFBNW1ELEVBQWduRCxRQUFRLEVBQXhuRCxFQUE0bkQsWUFBWSxFQUF4b0QsRUFBNG9ELFVBQVUsRUFBdHBELEVBQTBwRCxVQUFVLEVBQXBxRCxFQUF3cUQsV0FBVyxFQUFuckQsRUFBdXJELGFBQWEsRUFBcHNELEVBQXdzRCxRQUFRLEVBQWh0RCxFQUFvdEQsUUFBUSxFQUE1dEQsRUFBZ3VELGdCQUFnQixFQUFodkQsRUFBb3ZELE9BQU8sRUFBM3ZELEVBQSt2RCxXQUFXLENBQTF3RCxFQUE2d0QsUUFBUSxDQUFyeEQsRUFGRDtBQUdULGlCQUFZLEVBQUUsR0FBRyxPQUFMLEVBQWMsR0FBRyxLQUFqQixFQUF3QixJQUFJLFNBQTVCLEVBQXVDLElBQUksU0FBM0MsRUFBc0QsSUFBSSxlQUExRCxFQUEyRSxJQUFJLGdCQUEvRSxFQUFpRyxJQUFJLGlCQUFyRyxFQUF3SCxJQUFJLFlBQTVILEVBQTBJLElBQUksT0FBOUksRUFBdUosSUFBSSxjQUEzSixFQUEySyxJQUFJLG9CQUEvSyxFQUFxTSxJQUFJLFNBQXpNLEVBQW9OLElBQUksZUFBeE4sRUFBeU8sSUFBSSxNQUE3TyxFQUFxUCxJQUFJLGdCQUF6UCxFQUEyUSxJQUFJLGlCQUEvUSxFQUFrUyxJQUFJLGNBQXRTLEVBQXNULElBQUksb0JBQTFULEVBQWdWLElBQUksWUFBcFYsRUFBa1csSUFBSSxhQUF0VyxFQUFxWCxJQUFJLElBQXpYLEVBQStYLElBQUksUUFBblksRUFBNlksSUFBSSxtQkFBalosRUFBc2EsSUFBSSxvQkFBMWEsRUFBZ2MsSUFBSSxRQUFwYyxFQUE4YyxJQUFJLFFBQWxkLEVBQTRkLElBQUksU0FBaGUsRUFBMmUsSUFBSSxXQUEvZSxFQUE0ZixJQUFJLE1BQWhnQixFQUF3Z0IsSUFBSSxNQUE1Z0IsRUFBb2hCLElBQUksS0FBeGhCLEVBSEg7QUFJVCxtQkFBYyxDQUFDLENBQUQsRUFBSSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUosRUFBWSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVosRUFBb0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFwQixFQUE0QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQTVCLEVBQW9DLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBcEMsRUFBNEMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUE1QyxFQUFvRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXBELEVBQTRELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBNUQsRUFBb0UsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFwRSxFQUE0RSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTVFLEVBQXFGLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBckYsRUFBOEYsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE5RixFQUF1RyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXZHLEVBQStHLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0csRUFBdUgsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF2SCxFQUFnSSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWhJLEVBQXlJLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBekksRUFBa0osQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFsSixFQUEySixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTNKLEVBQW9LLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBcEssRUFBNkssQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE3SyxFQUFzTCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXRMLEVBQThMLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBOUwsRUFBc00sQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF0TSxFQUErTSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQS9NLEVBQXdOLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBeE4sRUFBaU8sQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFqTyxFQUEwTyxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTFPLEVBQW1QLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBblAsRUFBNFAsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE1UCxFQUFxUSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXJRLEVBQThRLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBOVEsRUFBdVIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF2UixFQUFnUyxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWhTLEVBQXlTLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBelMsRUFBa1QsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFsVCxFQUEyVCxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTNULEVBQW9VLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBcFUsRUFBNlUsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE3VSxFQUFzVixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXRWLEVBQStWLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBL1YsRUFBd1csQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF4VyxFQUFpWCxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWpYLEVBQTBYLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBMVgsRUFBbVksQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFuWSxFQUE0WSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQTVZLEVBQW9aLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBcFosRUFBNFosQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE1WixFQUFxYSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXJhLEVBQThhLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBOWEsRUFBdWIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF2YixFQUFnYyxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWhjLEVBQXljLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBemMsRUFBa2QsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFsZCxFQUEyZCxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTNkLEVBQW9lLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBcGUsRUFBNmUsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE3ZSxFQUFzZixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXRmLEVBQStmLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBL2YsRUFBd2dCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBeGdCLEVBQWloQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWpoQixFQUEwaEIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUExaEIsRUFBbWlCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBbmlCLEVBQTRpQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTVpQixFQUFxakIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFyakIsRUFBOGpCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBOWpCLEVBQXVrQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXZrQixFQUFnbEIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFobEIsRUFBeWxCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBemxCLEVBQWttQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWxtQixFQUEybUIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUEzbUIsRUFBb25CLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBcG5CLEVBQTZuQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTduQixFQUFzb0IsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF0b0IsRUFBK29CLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBL29CLEVBQXdwQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXhwQixFQUFpcUIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFqcUIsRUFBMHFCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBMXFCLEVBQW1yQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQW5yQixFQUE0ckIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE1ckIsRUFBcXNCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBcnNCLEVBQThzQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTlzQixFQUF1dEIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF2dEIsRUFBZ3VCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBaHVCLEVBQXl1QixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXp1QixFQUFrdkIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFsdkIsRUFBMnZCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBM3ZCLEVBQW93QixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXB3QixFQUE2d0IsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE3d0IsRUFBc3hCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBdHhCLEVBQSt4QixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQS94QixFQUF3eUIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF4eUIsRUFBaXpCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBanpCLEVBQTB6QixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQTF6QixFQUFtMEIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFuMEIsRUFBNDBCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBNTBCLEVBQXExQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQXIxQixFQUE4MUIsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUE5MUIsRUFBdTJCLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FBdjJCLEVBQWczQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWgzQixFQUF5M0IsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUF6M0IsQ0FKTDtBQUtULG9CQUFlLFNBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQixNQUEzQixFQUFtQyxRQUFuQyxFQUE2QyxFQUE3QyxFQUFpRCxPQUFqRCxFQUEwRCxFQUExRCxFQUE4RDtBQUM3RSxTQURlLEVBQ1Q7O0FBRUYsVUFBSSxLQUFLLEdBQUcsTUFBSCxHQUFZLENBQXJCO0FBQ0EsY0FBUSxPQUFSO0FBQ0ksWUFBSyxDQUFMO0FBQ0ksZUFBTyxHQUFHLEtBQUssQ0FBUixDQUFQO0FBQ0E7QUFDSixZQUFLLENBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLGNBQUgsQ0FBa0IsR0FBRyxFQUFILENBQWxCLENBQVQ7QUFDQTtBQUNKLFlBQUssQ0FBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0E7QUFDSixZQUFLLENBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLEVBQUgsQ0FBVDtBQUNBO0FBQ0osWUFBSyxDQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxFQUFILENBQVQ7QUFDQTtBQUNKLFlBQUssQ0FBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0E7QUFDSixZQUFLLENBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLEVBQUgsQ0FBVDtBQUNBO0FBQ0osWUFBSyxDQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxFQUFILENBQVQ7QUFDQTtBQUNKLFlBQUssQ0FBTDtBQUNJLGFBQUssQ0FBTCxHQUFTO0FBQ0wsZUFBTSxrQkFERDtBQUVMLGdCQUFPLEdBQUcsWUFBSCxDQUFnQixHQUFHLEVBQUgsQ0FBaEIsQ0FGRjtBQUdMLGdCQUFPLEdBQUcsVUFBSCxDQUFjLEdBQUcsRUFBSCxDQUFkLEVBQXNCLEdBQUcsRUFBSCxDQUF0QixDQUhGO0FBSUwsY0FBSyxHQUFHLE9BQUgsQ0FBVyxLQUFLLEVBQWhCO0FBSkEsU0FBVDs7QUFPQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTO0FBQ0wsZUFBTSxrQkFERDtBQUVMLG1CQUFVLEdBQUcsRUFBSCxDQUZMO0FBR0wsZ0JBQU8sR0FBRyxFQUFILENBSEY7QUFJTCxjQUFLLEdBQUcsT0FBSCxDQUFXLEtBQUssRUFBaEI7QUFKQSxTQUFUOztBQU9BO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxlQUFILENBQW1CLEdBQUcsS0FBSyxDQUFSLENBQW5CLEVBQStCLEdBQUcsS0FBSyxDQUFSLENBQS9CLEVBQTJDLEdBQUcsRUFBSCxDQUEzQyxFQUFtRCxLQUFLLEVBQXhELENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQUUsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUFSLEVBQW9CLFFBQVEsR0FBRyxLQUFLLENBQVIsQ0FBNUIsRUFBd0MsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUE5QyxFQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLFlBQUgsQ0FBZ0IsR0FBRyxLQUFLLENBQVIsQ0FBaEIsRUFBNEIsR0FBRyxLQUFLLENBQVIsQ0FBNUIsRUFBd0MsR0FBRyxLQUFLLENBQVIsQ0FBeEMsRUFBb0QsR0FBRyxFQUFILENBQXBELEVBQTRELEtBQTVELEVBQW1FLEtBQUssRUFBeEUsQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxZQUFILENBQWdCLEdBQUcsS0FBSyxDQUFSLENBQWhCLEVBQTRCLEdBQUcsS0FBSyxDQUFSLENBQTVCLEVBQXdDLEdBQUcsS0FBSyxDQUFSLENBQXhDLEVBQW9ELEdBQUcsRUFBSCxDQUFwRCxFQUE0RCxJQUE1RCxFQUFrRSxLQUFLLEVBQXZFLENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQUUsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUFSLEVBQW9CLE1BQU0sR0FBRyxLQUFLLENBQVIsQ0FBMUIsRUFBc0MsUUFBUSxHQUFHLEtBQUssQ0FBUixDQUE5QyxFQUEwRCxNQUFNLEdBQUcsS0FBSyxDQUFSLENBQWhFLEVBQTRFLGFBQWEsR0FBRyxLQUFLLENBQVIsQ0FBekYsRUFBcUcsT0FBTyxHQUFHLFVBQUgsQ0FBYyxHQUFHLEtBQUssQ0FBUixDQUFkLEVBQTBCLEdBQUcsRUFBSCxDQUExQixDQUE1RyxFQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQVIsQ0FBUixFQUFvQixRQUFRLEdBQUcsS0FBSyxDQUFSLENBQTVCLEVBQXdDLE1BQU0sR0FBRyxLQUFLLENBQVIsQ0FBOUMsRUFBMEQsYUFBYSxHQUFHLEtBQUssQ0FBUixDQUF2RSxFQUFtRixPQUFPLEdBQUcsVUFBSCxDQUFjLEdBQUcsS0FBSyxDQUFSLENBQWQsRUFBMEIsR0FBRyxFQUFILENBQTFCLENBQTFGLEVBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQUUsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUFSLEVBQW9CLFFBQVEsR0FBRyxLQUFLLENBQVIsQ0FBNUIsRUFBd0MsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUE5QyxFQUEwRCxhQUFhLEdBQUcsS0FBSyxDQUFSLENBQXZFLEVBQW1GLE9BQU8sR0FBRyxVQUFILENBQWMsR0FBRyxLQUFLLENBQVIsQ0FBZCxFQUEwQixHQUFHLEVBQUgsQ0FBMUIsQ0FBMUYsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBRSxPQUFPLEdBQUcsVUFBSCxDQUFjLEdBQUcsS0FBSyxDQUFSLENBQWQsRUFBMEIsR0FBRyxLQUFLLENBQVIsQ0FBMUIsQ0FBVCxFQUFnRCxTQUFTLEdBQUcsRUFBSCxDQUF6RCxFQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxZQUFJLFVBQVUsR0FBRyxZQUFILENBQWdCLEdBQUcsS0FBSyxDQUFSLENBQWhCLEVBQTRCLEdBQUcsS0FBSyxDQUFSLENBQTVCLEVBQXdDLEdBQUcsRUFBSCxDQUF4QyxFQUFnRCxHQUFHLEVBQUgsQ0FBaEQsRUFBd0QsS0FBeEQsRUFBK0QsS0FBSyxFQUFwRSxDQUFkO0FBQUEsWUFDSSxVQUFVLEdBQUcsY0FBSCxDQUFrQixDQUFDLE9BQUQsQ0FBbEIsRUFBNkIsR0FBRyxLQUFLLENBQVIsRUFBVyxHQUF4QyxDQURkO0FBRUEsZ0JBQVEsT0FBUixHQUFrQixJQUFsQjs7QUFFQSxhQUFLLENBQUwsR0FBUyxFQUFFLE9BQU8sR0FBRyxLQUFLLENBQVIsRUFBVyxLQUFwQixFQUEyQixTQUFTLE9BQXBDLEVBQTZDLE9BQU8sSUFBcEQsRUFBVDs7QUFFQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQVIsQ0FBUixFQUFvQixPQUFPLEdBQUcsVUFBSCxDQUFjLEdBQUcsS0FBSyxDQUFSLENBQWQsRUFBMEIsR0FBRyxFQUFILENBQTFCLENBQTNCLEVBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsZUFBSCxDQUFtQixHQUFHLEtBQUssQ0FBUixDQUFuQixFQUErQixHQUFHLEtBQUssQ0FBUixDQUEvQixFQUEyQyxHQUFHLEtBQUssQ0FBUixDQUEzQyxFQUF1RCxHQUFHLEtBQUssQ0FBUixDQUF2RCxFQUFtRSxHQUFHLFVBQUgsQ0FBYyxHQUFHLEtBQUssQ0FBUixDQUFkLEVBQTBCLEdBQUcsRUFBSCxDQUExQixDQUFuRSxFQUFzRyxLQUFLLEVBQTNHLENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsZUFBSCxDQUFtQixHQUFHLEtBQUssQ0FBUixDQUFuQixFQUErQixHQUFHLEtBQUssQ0FBUixDQUEvQixFQUEyQyxHQUFHLEtBQUssQ0FBUixDQUEzQyxFQUF1RCxHQUFHLEtBQUssQ0FBUixDQUF2RCxFQUFtRSxHQUFHLFVBQUgsQ0FBYyxHQUFHLEtBQUssQ0FBUixDQUFkLEVBQTBCLEdBQUcsRUFBSCxDQUExQixDQUFuRSxFQUFzRyxLQUFLLEVBQTNHLENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTO0FBQ0wsZUFBTSxrQkFERDtBQUVMLGVBQU0sR0FBRyxLQUFLLENBQVIsQ0FGRDtBQUdMLGlCQUFRLEdBQUcsS0FBSyxDQUFSLENBSEg7QUFJTCxlQUFNLEdBQUcsS0FBSyxDQUFSLENBSkQ7QUFLTCxpQkFBUSxFQUxIO0FBTUwsZ0JBQU8sR0FBRyxVQUFILENBQWMsR0FBRyxLQUFLLENBQVIsQ0FBZCxFQUEwQixHQUFHLEVBQUgsQ0FBMUIsQ0FORjtBQU9MLGNBQUssR0FBRyxPQUFILENBQVcsS0FBSyxFQUFoQjtBQVBBLFNBQVQ7O0FBVUE7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLG1CQUFILENBQXVCLEdBQUcsS0FBSyxDQUFSLENBQXZCLEVBQW1DLEdBQUcsS0FBSyxDQUFSLENBQW5DLEVBQStDLEdBQUcsRUFBSCxDQUEvQyxFQUF1RCxLQUFLLEVBQTVELENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQUUsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUFSLEVBQW9CLFFBQVEsR0FBRyxLQUFLLENBQVIsQ0FBNUIsRUFBd0MsTUFBTSxHQUFHLEtBQUssQ0FBUixDQUE5QyxFQUEwRCxPQUFPLEdBQUcsVUFBSCxDQUFjLEdBQUcsS0FBSyxDQUFSLENBQWQsRUFBMEIsR0FBRyxFQUFILENBQTFCLENBQWpFLEVBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLEVBQUgsQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVM7QUFDTCxlQUFNLGVBREQ7QUFFTCxlQUFNLEdBQUcsS0FBSyxDQUFSLENBRkQ7QUFHTCxpQkFBUSxHQUFHLEtBQUssQ0FBUixDQUhIO0FBSUwsZUFBTSxHQUFHLEtBQUssQ0FBUixDQUpEO0FBS0wsY0FBSyxHQUFHLE9BQUgsQ0FBVyxLQUFLLEVBQWhCO0FBTEEsU0FBVDs7QUFRQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQUUsTUFBTSxNQUFSLEVBQWdCLE9BQU8sR0FBRyxFQUFILENBQXZCLEVBQStCLEtBQUssR0FBRyxPQUFILENBQVcsS0FBSyxFQUFoQixDQUFwQyxFQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxFQUFFLE1BQU0sVUFBUixFQUFvQixLQUFLLEdBQUcsRUFBSCxDQUFNLEdBQUcsS0FBSyxDQUFSLENBQU4sQ0FBekIsRUFBNEMsT0FBTyxHQUFHLEVBQUgsQ0FBbkQsRUFBMkQsS0FBSyxHQUFHLE9BQUgsQ0FBVyxLQUFLLEVBQWhCLENBQWhFLEVBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFNLEdBQUcsS0FBSyxDQUFSLENBQU4sQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxFQUFILENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxFQUFFLE1BQU0sZUFBUixFQUF5QixPQUFPLEdBQUcsRUFBSCxDQUFoQyxFQUF3QyxVQUFVLEdBQUcsRUFBSCxDQUFsRCxFQUEwRCxLQUFLLEdBQUcsT0FBSCxDQUFXLEtBQUssRUFBaEIsQ0FBL0QsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBRSxNQUFNLGVBQVIsRUFBeUIsT0FBTyxPQUFPLEdBQUcsRUFBSCxDQUFQLENBQWhDLEVBQWdELFVBQVUsT0FBTyxHQUFHLEVBQUgsQ0FBUCxDQUExRCxFQUEwRSxLQUFLLEdBQUcsT0FBSCxDQUFXLEtBQUssRUFBaEIsQ0FBL0UsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBRSxNQUFNLGdCQUFSLEVBQTBCLE9BQU8sR0FBRyxFQUFILE1BQVcsTUFBNUMsRUFBb0QsVUFBVSxHQUFHLEVBQUgsTUFBVyxNQUF6RSxFQUFpRixLQUFLLEdBQUcsT0FBSCxDQUFXLEtBQUssRUFBaEIsQ0FBdEYsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBRSxNQUFNLGtCQUFSLEVBQTRCLFVBQVUsU0FBdEMsRUFBaUQsT0FBTyxTQUF4RCxFQUFtRSxLQUFLLEdBQUcsT0FBSCxDQUFXLEtBQUssRUFBaEIsQ0FBeEUsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBRSxNQUFNLGFBQVIsRUFBdUIsVUFBVSxJQUFqQyxFQUF1QyxPQUFPLElBQTlDLEVBQW9ELEtBQUssR0FBRyxPQUFILENBQVcsS0FBSyxFQUFoQixDQUF6RCxFQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxhQUFLLENBQUwsR0FBUyxHQUFHLEVBQUgsQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxFQUFILENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEdBQUcsV0FBSCxDQUFlLElBQWYsRUFBcUIsR0FBRyxFQUFILENBQXJCLEVBQTZCLEtBQUssRUFBbEMsQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsR0FBRyxXQUFILENBQWUsS0FBZixFQUFzQixHQUFHLEVBQUgsQ0FBdEIsRUFBOEIsS0FBSyxFQUFuQyxDQUFUO0FBQ0E7QUFDSixZQUFLLEVBQUw7QUFDSSxXQUFHLEtBQUssQ0FBUixFQUFXLElBQVgsQ0FBZ0IsRUFBRSxNQUFNLEdBQUcsRUFBSCxDQUFNLEdBQUcsRUFBSCxDQUFOLENBQVIsRUFBdUIsVUFBVSxHQUFHLEVBQUgsQ0FBakMsRUFBeUMsV0FBVyxHQUFHLEtBQUssQ0FBUixDQUFwRCxFQUFoQixFQUFrRixLQUFLLENBQUwsR0FBUyxHQUFHLEtBQUssQ0FBUixDQUFUO0FBQ2xGO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxFQUFILENBQU0sR0FBRyxFQUFILENBQU4sQ0FBUixFQUF1QixVQUFVLEdBQUcsRUFBSCxDQUFqQyxFQUFELENBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLEVBQVQ7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLFdBQUcsS0FBSyxDQUFSLEVBQVcsSUFBWCxDQUFnQixHQUFHLEVBQUgsQ0FBaEI7QUFDQTtBQUNKLFlBQUssRUFBTDtBQUNJLGFBQUssQ0FBTCxHQUFTLENBQUMsR0FBRyxFQUFILENBQUQsQ0FBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFBSCxDQUFoQjtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksYUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBO0FBQ0osWUFBSyxFQUFMO0FBQ0ksV0FBRyxLQUFLLENBQVIsRUFBVyxJQUFYLENBQWdCLEdBQUcsRUFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWpDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDamFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTGF5b3V0IGZyb20gJy4vdmlld3MvbGF5b3V0JztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYXJpb25ldHRlLkFwcGxpY2F0aW9uLmV4dGVuZCh7XHJcblx0cmVnaW9uOiAnLmFwcCcsXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnRtcENhY2hlID0ge307XHJcblx0fSxcclxuXHRzdGFydDogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNob3dWaWV3KG5ldyBMYXlvdXQoKSk7XHJcblx0fSxcclxuXHRhamF4IChvcHRpb25zKSB7XHJcblx0XHR2YXIgcGFyYW1zID0gXy5leHRlbmQoe1xyXG5cdFx0XHR1cmw6ICcnLFxyXG5cdFx0XHR0eXBlOiAnUE9TVCcsXHJcblx0XHRcdGRhdGE6IHt9LFxyXG5cdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRjYWxsYmFjayAocmVzcCkge1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdhamF4IHJlc3AnKVxyXG5cdFx0XHR9XHJcblx0XHR9LCBvcHRpb25zKTtcclxuXHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuXHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHR1cmw6IHBhcmFtcy51cmwsXHJcblx0XHRcdFx0dHlwZTogcGFyYW1zLnR5cGUsXHJcblx0XHRcdFx0ZGF0YTogcGFyYW1zLmRhdGEsXHJcblx0XHRcdFx0ZGF0YVR5cGU6IHBhcmFtcy5kYXRhVHlwZVxyXG5cdFx0XHR9KS5hbHdheXMoKHJlc3BvbnNlLCBzdGF0dXMpID0+IHtcclxuXHRcdFx0XHRpZihzdGF0dXMgPT09ICdlcnJvcicpIHtcclxuXHRcdFx0XHRcdHJlamVjdChyZXNwb25zZSlcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKHN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcblx0XHRcdFx0XHRpZih0eXBlb2YgcmVzcG9uc2UgPT09ICdvYmplY3QnICYmIHJlc3BvbnNlLmNvZGUgIT0gMjAwKSB7XHJcblx0XHRcdFx0XHRcdGlmKHJlc3BvbnNlLm1lc3NhZ2UpIHtcclxuXHRcdFx0XHRcdFx0XHRyZWplY3QocmVzcG9uc2UpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRwYXJhbXMuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9KS5jYXRjaChyZXNwb25zZSA9PiB7XHJcblx0XHRcdGlmKHJlc3BvbnNlLm1lc3NhZ2UpIHtcclxuXHRcdFx0XHQvL0lmIHRva2VuIGludmFsaWQgLSBsb2dvdXQgdXNlclxyXG5cdFx0XHRcdGlmKHJlc3BvbnNlLmNvZGUgPT09IDQwMSkge1xyXG5cdFx0XHRcdFx0QXBwLlJvdXRlci5uYXZpZ2F0ZSgnLycsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0YWxlcnQocmVzcG9uc2UudG9TdHJpbmcoKSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufSk7IiwiaW1wb3J0IGhhbmRsZWJhcnMgZnJvbSAnLi4vbGlicy9oYW5kbGViYXJzLXY0LjAuMTAnO1xuXG5jb25zdCBIYlZpZXcgPSBNYXJpb25ldHRlLkJlaGF2aW9yLmV4dGVuZCh7XG4gICAgbG9hZGVkOiBmYWxzZSxcbiAgICBpbml0aWFsaXplIChvcHRpb25zKSB7XG4gICAgICAgIGxldCBIQlRlbXBsYXRlID0gdGhpcy52aWV3LkhCVGVtcGxhdGU7XG5cbiAgICAgICAgdGhpcy52aWV3Ll9sb2FkVGVtcGxhdGUgPSBmYWxzZTtcblxuICAgICAgICAvL0dldCBwYXRoIHRlbXBsYXRlXG4gICAgICAgIGlmKCFIQlRlbXBsYXRlKSByZXR1cm4gY29uc29sZS53YXJuKFwiSEJUZW1wbGF0ZSBpcyBub3QgZGVmaW5lZFwiKTtcbiAgICAgICAgLy9DaGVjayBjYWNoZSBvYmpcbiAgICAgICAgaWYoQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXSA9IEFwcC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogSEJUZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICd0ZXh0J1xuICAgICAgICAgICAgICAgIH0pLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vQWRkIHRvIGNhY2hlXG4gICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLnZpZXcuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgICAgICAgICAgIEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXSA9IHJlc3A7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUZW1wbGF0ZShBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0pO1xuICAgICAgICAgICAgICAgIGlmKF8uaXNGdW5jdGlvbih0aGlzLnZpZXcub25Mb2FkVGVtcGxhdGUpKSB0aGlzLnZpZXcub25Mb2FkVGVtcGxhdGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZXNvbHZlKHJlc3ApKTtcbiAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy9DaGVjayBjdXJyZW50IHJ1bm5pbmcgUHJvbWlzZVxuICAgICAgICBpZihfLmlzRnVuY3Rpb24oQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdLnRoZW4pKSB7XG4gICAgICAgICAgICBBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0udGhlbihyZXNwID0+IHtcbiAgICAgICAgICAgICAgICAvL0FkZCB0byBjYWNoZVxuICAgICAgICAgICAgICAgIEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXSA9IHJlc3A7XG4gICAgICAgICAgICB0aGlzLnNldFRlbXBsYXRlKEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXSk7XG4gICAgICAgICAgICBpZihfLmlzRnVuY3Rpb24odGhpcy52aWV3Lm9uTG9hZFRlbXBsYXRlKSkgdGhpcy52aWV3Lm9uTG9hZFRlbXBsYXRlKCk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAvL1RlbXBsYXRlIGxvYWRlZCwganVzdCBzZXQgdGVtcGxhdGVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGVtcGxhdGUoQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0VGVtcGxhdGUgKHRlbXBsYXRlKSB7XG4gICAgICAgIGxldCB0bXAgPSBoYW5kbGViYXJzLmNvbXBpbGUodGVtcGxhdGUpXG4gICAgICAgIHRoaXMudmlldy50ZW1wbGF0ZSA9IGRhdGEgPT4gdG1wKGRhdGEpO1xuICAgICAgICB0aGlzLnZpZXcuX2xvYWRUZW1wbGF0ZSA9IHRydWU7XG4gICAgfSxcbiAgICBvbkF0dGFjaCAoKSB7XG4gICAgICAgIGlmKF8uaXNGdW5jdGlvbih0aGlzLnZpZXcub25Mb2FkVGVtcGxhdGUpICYmIHRoaXMubG9hZGVkID09PSB0cnVlKSB0aGlzLnZpZXcub25Mb2FkVGVtcGxhdGUoKTtcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSGJWaWV3IiwiaW1wb3J0IFRvZG9hcHAgZnJvbSAnLi9hcHAnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIHdpbmRvdy5BcHAgPSBuZXcgVG9kb2FwcCgpO1xuICAgIEFwcC5zdGFydCgpO1xufSk7XG4iLCIvKiohXG5cbiBAbGljZW5zZVxuIGhhbmRsZWJhcnMgdjQuMC4xMFxuXG5Db3B5cmlnaHQgKEMpIDIwMTEtMjAxNiBieSBZZWh1ZGEgS2F0elxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuXG5cbiovXG4oZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJIYW5kbGViYXJzXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkhhbmRsZWJhcnNcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuXG5cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfaGFuZGxlYmFyc1J1bnRpbWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xuXG5cdHZhciBfaGFuZGxlYmFyc1J1bnRpbWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGFuZGxlYmFyc1J1bnRpbWUpO1xuXG5cdC8vIENvbXBpbGVyIGltcG9ydHNcblxuXHR2YXIgX2hhbmRsZWJhcnNDb21waWxlckFzdCA9IF9fd2VicGFja19yZXF1aXJlX18oMzUpO1xuXG5cdHZhciBfaGFuZGxlYmFyc0NvbXBpbGVyQXN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hhbmRsZWJhcnNDb21waWxlckFzdCk7XG5cblx0dmFyIF9oYW5kbGViYXJzQ29tcGlsZXJCYXNlID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNik7XG5cblx0dmFyIF9oYW5kbGViYXJzQ29tcGlsZXJDb21waWxlciA9IF9fd2VicGFja19yZXF1aXJlX18oNDEpO1xuXG5cdHZhciBfaGFuZGxlYmFyc0NvbXBpbGVySmF2YXNjcmlwdENvbXBpbGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0Mik7XG5cblx0dmFyIF9oYW5kbGViYXJzQ29tcGlsZXJKYXZhc2NyaXB0Q29tcGlsZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGFuZGxlYmFyc0NvbXBpbGVySmF2YXNjcmlwdENvbXBpbGVyKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNDb21waWxlclZpc2l0b3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM5KTtcblxuXHR2YXIgX2hhbmRsZWJhcnNDb21waWxlclZpc2l0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGFuZGxlYmFyc0NvbXBpbGVyVmlzaXRvcik7XG5cblx0dmFyIF9oYW5kbGViYXJzTm9Db25mbGljdCA9IF9fd2VicGFja19yZXF1aXJlX18oMzQpO1xuXG5cdHZhciBfaGFuZGxlYmFyc05vQ29uZmxpY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGFuZGxlYmFyc05vQ29uZmxpY3QpO1xuXG5cdHZhciBfY3JlYXRlID0gX2hhbmRsZWJhcnNSdW50aW1lMlsnZGVmYXVsdCddLmNyZWF0ZTtcblx0ZnVuY3Rpb24gY3JlYXRlKCkge1xuXHQgIHZhciBoYiA9IF9jcmVhdGUoKTtcblxuXHQgIGhiLmNvbXBpbGUgPSBmdW5jdGlvbiAoaW5wdXQsIG9wdGlvbnMpIHtcblx0ICAgIHJldHVybiBfaGFuZGxlYmFyc0NvbXBpbGVyQ29tcGlsZXIuY29tcGlsZShpbnB1dCwgb3B0aW9ucywgaGIpO1xuXHQgIH07XG5cdCAgaGIucHJlY29tcGlsZSA9IGZ1bmN0aW9uIChpbnB1dCwgb3B0aW9ucykge1xuXHQgICAgcmV0dXJuIF9oYW5kbGViYXJzQ29tcGlsZXJDb21waWxlci5wcmVjb21waWxlKGlucHV0LCBvcHRpb25zLCBoYik7XG5cdCAgfTtcblxuXHQgIGhiLkFTVCA9IF9oYW5kbGViYXJzQ29tcGlsZXJBc3QyWydkZWZhdWx0J107XG5cdCAgaGIuQ29tcGlsZXIgPSBfaGFuZGxlYmFyc0NvbXBpbGVyQ29tcGlsZXIuQ29tcGlsZXI7XG5cdCAgaGIuSmF2YVNjcmlwdENvbXBpbGVyID0gX2hhbmRsZWJhcnNDb21waWxlckphdmFzY3JpcHRDb21waWxlcjJbJ2RlZmF1bHQnXTtcblx0ICBoYi5QYXJzZXIgPSBfaGFuZGxlYmFyc0NvbXBpbGVyQmFzZS5wYXJzZXI7XG5cdCAgaGIucGFyc2UgPSBfaGFuZGxlYmFyc0NvbXBpbGVyQmFzZS5wYXJzZTtcblxuXHQgIHJldHVybiBoYjtcblx0fVxuXG5cdHZhciBpbnN0ID0gY3JlYXRlKCk7XG5cdGluc3QuY3JlYXRlID0gY3JlYXRlO1xuXG5cdF9oYW5kbGViYXJzTm9Db25mbGljdDJbJ2RlZmF1bHQnXShpbnN0KTtcblxuXHRpbnN0LlZpc2l0b3IgPSBfaGFuZGxlYmFyc0NvbXBpbGVyVmlzaXRvcjJbJ2RlZmF1bHQnXTtcblxuXHRpbnN0WydkZWZhdWx0J10gPSBpbnN0O1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGluc3Q7XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRleHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChvYmopIHtcblx0ICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuXHQgICAgXCJkZWZhdWx0XCI6IG9ialxuXHQgIH07XG5cdH07XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuLyoqKi8gfSksXG4vKiAyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IF9fd2VicGFja19yZXF1aXJlX18oMylbJ2RlZmF1bHQnXTtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfaGFuZGxlYmFyc0Jhc2UgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQpO1xuXG5cdHZhciBiYXNlID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2hhbmRsZWJhcnNCYXNlKTtcblxuXHQvLyBFYWNoIG9mIHRoZXNlIGF1Z21lbnQgdGhlIEhhbmRsZWJhcnMgb2JqZWN0LiBObyBuZWVkIHRvIHNldHVwIGhlcmUuXG5cdC8vIChUaGlzIGlzIGRvbmUgdG8gZWFzaWx5IHNoYXJlIGNvZGUgYmV0d2VlbiBjb21tb25qcyBhbmQgYnJvd3NlIGVudnMpXG5cblx0dmFyIF9oYW5kbGViYXJzU2FmZVN0cmluZyA9IF9fd2VicGFja19yZXF1aXJlX18oMjEpO1xuXG5cdHZhciBfaGFuZGxlYmFyc1NhZmVTdHJpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGFuZGxlYmFyc1NhZmVTdHJpbmcpO1xuXG5cdHZhciBfaGFuZGxlYmFyc0V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9oYW5kbGViYXJzRXhjZXB0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hhbmRsZWJhcnNFeGNlcHRpb24pO1xuXG5cdHZhciBfaGFuZGxlYmFyc1V0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KTtcblxuXHR2YXIgVXRpbHMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfaGFuZGxlYmFyc1V0aWxzKTtcblxuXHR2YXIgX2hhbmRsZWJhcnNSdW50aW1lID0gX193ZWJwYWNrX3JlcXVpcmVfXygyMik7XG5cblx0dmFyIHJ1bnRpbWUgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfaGFuZGxlYmFyc1J1bnRpbWUpO1xuXG5cdHZhciBfaGFuZGxlYmFyc05vQ29uZmxpY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM0KTtcblxuXHR2YXIgX2hhbmRsZWJhcnNOb0NvbmZsaWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hhbmRsZWJhcnNOb0NvbmZsaWN0KTtcblxuXHQvLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2Vcblx0ZnVuY3Rpb24gY3JlYXRlKCkge1xuXHQgIHZhciBoYiA9IG5ldyBiYXNlLkhhbmRsZWJhcnNFbnZpcm9ubWVudCgpO1xuXG5cdCAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcblx0ICBoYi5TYWZlU3RyaW5nID0gX2hhbmRsZWJhcnNTYWZlU3RyaW5nMlsnZGVmYXVsdCddO1xuXHQgIGhiLkV4Y2VwdGlvbiA9IF9oYW5kbGViYXJzRXhjZXB0aW9uMlsnZGVmYXVsdCddO1xuXHQgIGhiLlV0aWxzID0gVXRpbHM7XG5cdCAgaGIuZXNjYXBlRXhwcmVzc2lvbiA9IFV0aWxzLmVzY2FwZUV4cHJlc3Npb247XG5cblx0ICBoYi5WTSA9IHJ1bnRpbWU7XG5cdCAgaGIudGVtcGxhdGUgPSBmdW5jdGlvbiAoc3BlYykge1xuXHQgICAgcmV0dXJuIHJ1bnRpbWUudGVtcGxhdGUoc3BlYywgaGIpO1xuXHQgIH07XG5cblx0ICByZXR1cm4gaGI7XG5cdH1cblxuXHR2YXIgaW5zdCA9IGNyZWF0ZSgpO1xuXHRpbnN0LmNyZWF0ZSA9IGNyZWF0ZTtcblxuXHRfaGFuZGxlYmFyc05vQ29uZmxpY3QyWydkZWZhdWx0J10oaW5zdCk7XG5cblx0aW5zdFsnZGVmYXVsdCddID0gaW5zdDtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBpbnN0O1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0ZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAob2JqKSB7XG5cdCAgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkge1xuXHQgICAgcmV0dXJuIG9iajtcblx0ICB9IGVsc2Uge1xuXHQgICAgdmFyIG5ld09iaiA9IHt9O1xuXG5cdCAgICBpZiAob2JqICE9IG51bGwpIHtcblx0ICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuXHQgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7XG5cdCAgICByZXR1cm4gbmV3T2JqO1xuXHQgIH1cblx0fTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG4vKioqLyB9KSxcbi8qIDQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5IYW5kbGViYXJzRW52aXJvbm1lbnQgPSBIYW5kbGViYXJzRW52aXJvbm1lbnQ7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIF9leGNlcHRpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG5cdHZhciBfZXhjZXB0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4Y2VwdGlvbik7XG5cblx0dmFyIF9oZWxwZXJzID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMCk7XG5cblx0dmFyIF9kZWNvcmF0b3JzID0gX193ZWJwYWNrX3JlcXVpcmVfXygxOCk7XG5cblx0dmFyIF9sb2dnZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIwKTtcblxuXHR2YXIgX2xvZ2dlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2dnZXIpO1xuXG5cdHZhciBWRVJTSU9OID0gJzQuMC4xMCc7XG5cdGV4cG9ydHMuVkVSU0lPTiA9IFZFUlNJT047XG5cdHZhciBDT01QSUxFUl9SRVZJU0lPTiA9IDc7XG5cblx0ZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXHR2YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHtcblx0ICAxOiAnPD0gMS4wLnJjLjInLCAvLyAxLjAucmMuMiBpcyBhY3R1YWxseSByZXYyIGJ1dCBkb2Vzbid0IHJlcG9ydCBpdFxuXHQgIDI6ICc9PSAxLjAuMC1yYy4zJyxcblx0ICAzOiAnPT0gMS4wLjAtcmMuNCcsXG5cdCAgNDogJz09IDEueC54Jyxcblx0ICA1OiAnPT0gMi4wLjAtYWxwaGEueCcsXG5cdCAgNjogJz49IDIuMC4wLWJldGEuMScsXG5cdCAgNzogJz49IDQuMC4wJ1xuXHR9O1xuXG5cdGV4cG9ydHMuUkVWSVNJT05fQ0hBTkdFUyA9IFJFVklTSU9OX0NIQU5HRVM7XG5cdHZhciBvYmplY3RUeXBlID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cblx0ZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzLCBkZWNvcmF0b3JzKSB7XG5cdCAgdGhpcy5oZWxwZXJzID0gaGVscGVycyB8fCB7fTtcblx0ICB0aGlzLnBhcnRpYWxzID0gcGFydGlhbHMgfHwge307XG5cdCAgdGhpcy5kZWNvcmF0b3JzID0gZGVjb3JhdG9ycyB8fCB7fTtcblxuXHQgIF9oZWxwZXJzLnJlZ2lzdGVyRGVmYXVsdEhlbHBlcnModGhpcyk7XG5cdCAgX2RlY29yYXRvcnMucmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyh0aGlzKTtcblx0fVxuXG5cdEhhbmRsZWJhcnNFbnZpcm9ubWVudC5wcm90b3R5cGUgPSB7XG5cdCAgY29uc3RydWN0b3I6IEhhbmRsZWJhcnNFbnZpcm9ubWVudCxcblxuXHQgIGxvZ2dlcjogX2xvZ2dlcjJbJ2RlZmF1bHQnXSxcblx0ICBsb2c6IF9sb2dnZXIyWydkZWZhdWx0J10ubG9nLFxuXG5cdCAgcmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uIHJlZ2lzdGVySGVscGVyKG5hbWUsIGZuKSB7XG5cdCAgICBpZiAoX3V0aWxzLnRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcblx0ICAgICAgaWYgKGZuKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgaGVscGVycycpO1xuXHQgICAgICB9XG5cdCAgICAgIF91dGlscy5leHRlbmQodGhpcy5oZWxwZXJzLCBuYW1lKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMuaGVscGVyc1tuYW1lXSA9IGZuO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgdW5yZWdpc3RlckhlbHBlcjogZnVuY3Rpb24gdW5yZWdpc3RlckhlbHBlcihuYW1lKSB7XG5cdCAgICBkZWxldGUgdGhpcy5oZWxwZXJzW25hbWVdO1xuXHQgIH0sXG5cblx0ICByZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uIHJlZ2lzdGVyUGFydGlhbChuYW1lLCBwYXJ0aWFsKSB7XG5cdCAgICBpZiAoX3V0aWxzLnRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcblx0ICAgICAgX3V0aWxzLmV4dGVuZCh0aGlzLnBhcnRpYWxzLCBuYW1lKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGlmICh0eXBlb2YgcGFydGlhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnQXR0ZW1wdGluZyB0byByZWdpc3RlciBhIHBhcnRpYWwgY2FsbGVkIFwiJyArIG5hbWUgKyAnXCIgYXMgdW5kZWZpbmVkJyk7XG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHBhcnRpYWw7XG5cdCAgICB9XG5cdCAgfSxcblx0ICB1bnJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24gdW5yZWdpc3RlclBhcnRpYWwobmFtZSkge1xuXHQgICAgZGVsZXRlIHRoaXMucGFydGlhbHNbbmFtZV07XG5cdCAgfSxcblxuXHQgIHJlZ2lzdGVyRGVjb3JhdG9yOiBmdW5jdGlvbiByZWdpc3RlckRlY29yYXRvcihuYW1lLCBmbikge1xuXHQgICAgaWYgKF91dGlscy50b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG5cdCAgICAgIGlmIChmbikge1xuXHQgICAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGRlY29yYXRvcnMnKTtcblx0ICAgICAgfVxuXHQgICAgICBfdXRpbHMuZXh0ZW5kKHRoaXMuZGVjb3JhdG9ycywgbmFtZSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLmRlY29yYXRvcnNbbmFtZV0gPSBmbjtcblx0ICAgIH1cblx0ICB9LFxuXHQgIHVucmVnaXN0ZXJEZWNvcmF0b3I6IGZ1bmN0aW9uIHVucmVnaXN0ZXJEZWNvcmF0b3IobmFtZSkge1xuXHQgICAgZGVsZXRlIHRoaXMuZGVjb3JhdG9yc1tuYW1lXTtcblx0ICB9XG5cdH07XG5cblx0dmFyIGxvZyA9IF9sb2dnZXIyWydkZWZhdWx0J10ubG9nO1xuXG5cdGV4cG9ydHMubG9nID0gbG9nO1xuXHRleHBvcnRzLmNyZWF0ZUZyYW1lID0gX3V0aWxzLmNyZWF0ZUZyYW1lO1xuXHRleHBvcnRzLmxvZ2dlciA9IF9sb2dnZXIyWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogNSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcblx0ZXhwb3J0cy5pbmRleE9mID0gaW5kZXhPZjtcblx0ZXhwb3J0cy5lc2NhcGVFeHByZXNzaW9uID0gZXNjYXBlRXhwcmVzc2lvbjtcblx0ZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTtcblx0ZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lO1xuXHRleHBvcnRzLmJsb2NrUGFyYW1zID0gYmxvY2tQYXJhbXM7XG5cdGV4cG9ydHMuYXBwZW5kQ29udGV4dFBhdGggPSBhcHBlbmRDb250ZXh0UGF0aDtcblx0dmFyIGVzY2FwZSA9IHtcblx0ICAnJic6ICcmYW1wOycsXG5cdCAgJzwnOiAnJmx0OycsXG5cdCAgJz4nOiAnJmd0OycsXG5cdCAgJ1wiJzogJyZxdW90OycsXG5cdCAgXCInXCI6ICcmI3gyNzsnLFxuXHQgICdgJzogJyYjeDYwOycsXG5cdCAgJz0nOiAnJiN4M0Q7J1xuXHR9O1xuXG5cdHZhciBiYWRDaGFycyA9IC9bJjw+XCInYD1dL2csXG5cdCAgICBwb3NzaWJsZSA9IC9bJjw+XCInYD1dLztcblxuXHRmdW5jdGlvbiBlc2NhcGVDaGFyKGNocikge1xuXHQgIHJldHVybiBlc2NhcGVbY2hyXTtcblx0fVxuXG5cdGZ1bmN0aW9uIGV4dGVuZChvYmogLyogLCAuLi5zb3VyY2UgKi8pIHtcblx0ICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHQgICAgZm9yICh2YXIga2V5IGluIGFyZ3VtZW50c1tpXSkge1xuXHQgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyZ3VtZW50c1tpXSwga2V5KSkge1xuXHQgICAgICAgIG9ialtrZXldID0gYXJndW1lbnRzW2ldW2tleV07XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cblx0ICByZXR1cm4gb2JqO1xuXHR9XG5cblx0dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuXHRleHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG5cdC8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcblx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxuXHQvKiBlc2xpbnQtZGlzYWJsZSBmdW5jLXN0eWxlICovXG5cdHZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuXHQgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG5cdH07XG5cdC8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuXHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRpZiAoaXNGdW5jdGlvbigveC8pKSB7XG5cdCAgZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHQgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0ICB9O1xuXHR9XG5cdGV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cblx0LyogZXNsaW50LWVuYWJsZSBmdW5jLXN0eWxlICovXG5cblx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0dmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHQgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcblx0fTtcblxuXHRleHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXHQvLyBPbGRlciBJRSB2ZXJzaW9ucyBkbyBub3QgZGlyZWN0bHkgc3VwcG9ydCBpbmRleE9mIHNvIHdlIG11c3QgaW1wbGVtZW50IG91ciBvd24sIHNhZGx5LlxuXG5cdGZ1bmN0aW9uIGluZGV4T2YoYXJyYXksIHZhbHVlKSB7XG5cdCAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICBpZiAoYXJyYXlbaV0gPT09IHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiBpO1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gLTE7XG5cdH1cblxuXHRmdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuXHQgIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuXHQgICAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuXHQgICAgaWYgKHN0cmluZyAmJiBzdHJpbmcudG9IVE1MKSB7XG5cdCAgICAgIHJldHVybiBzdHJpbmcudG9IVE1MKCk7XG5cdCAgICB9IGVsc2UgaWYgKHN0cmluZyA9PSBudWxsKSB7XG5cdCAgICAgIHJldHVybiAnJztcblx0ICAgIH0gZWxzZSBpZiAoIXN0cmluZykge1xuXHQgICAgICByZXR1cm4gc3RyaW5nICsgJyc7XG5cdCAgICB9XG5cblx0ICAgIC8vIEZvcmNlIGEgc3RyaW5nIGNvbnZlcnNpb24gYXMgdGhpcyB3aWxsIGJlIGRvbmUgYnkgdGhlIGFwcGVuZCByZWdhcmRsZXNzIGFuZFxuXHQgICAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG5cdCAgICAvLyBhbiBvYmplY3QncyB0byBzdHJpbmcgaGFzIGVzY2FwZWQgY2hhcmFjdGVycyBpbiBpdC5cblx0ICAgIHN0cmluZyA9ICcnICsgc3RyaW5nO1xuXHQgIH1cblxuXHQgIGlmICghcG9zc2libGUudGVzdChzdHJpbmcpKSB7XG5cdCAgICByZXR1cm4gc3RyaW5nO1xuXHQgIH1cblx0ICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuXHQgIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUZyYW1lKG9iamVjdCkge1xuXHQgIHZhciBmcmFtZSA9IGV4dGVuZCh7fSwgb2JqZWN0KTtcblx0ICBmcmFtZS5fcGFyZW50ID0gb2JqZWN0O1xuXHQgIHJldHVybiBmcmFtZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJsb2NrUGFyYW1zKHBhcmFtcywgaWRzKSB7XG5cdCAgcGFyYW1zLnBhdGggPSBpZHM7XG5cdCAgcmV0dXJuIHBhcmFtcztcblx0fVxuXG5cdGZ1bmN0aW9uIGFwcGVuZENvbnRleHRQYXRoKGNvbnRleHRQYXRoLCBpZCkge1xuXHQgIHJldHVybiAoY29udGV4dFBhdGggPyBjb250ZXh0UGF0aCArICcuJyA6ICcnKSArIGlkO1xuXHR9XG5cbi8qKiovIH0pLFxuLyogNiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX09iamVjdCRkZWZpbmVQcm9wZXJ0eSA9IF9fd2VicGFja19yZXF1aXJlX18oNylbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBlcnJvclByb3BzID0gWydkZXNjcmlwdGlvbicsICdmaWxlTmFtZScsICdsaW5lTnVtYmVyJywgJ21lc3NhZ2UnLCAnbmFtZScsICdudW1iZXInLCAnc3RhY2snXTtcblxuXHRmdW5jdGlvbiBFeGNlcHRpb24obWVzc2FnZSwgbm9kZSkge1xuXHQgIHZhciBsb2MgPSBub2RlICYmIG5vZGUubG9jLFxuXHQgICAgICBsaW5lID0gdW5kZWZpbmVkLFxuXHQgICAgICBjb2x1bW4gPSB1bmRlZmluZWQ7XG5cdCAgaWYgKGxvYykge1xuXHQgICAgbGluZSA9IGxvYy5zdGFydC5saW5lO1xuXHQgICAgY29sdW1uID0gbG9jLnN0YXJ0LmNvbHVtbjtcblxuXHQgICAgbWVzc2FnZSArPSAnIC0gJyArIGxpbmUgKyAnOicgKyBjb2x1bW47XG5cdCAgfVxuXG5cdCAgdmFyIHRtcCA9IEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG5cdCAgLy8gVW5mb3J0dW5hdGVseSBlcnJvcnMgYXJlIG5vdCBlbnVtZXJhYmxlIGluIENocm9tZSAoYXQgbGVhc3QpLCBzbyBgZm9yIHByb3AgaW4gdG1wYCBkb2Vzbid0IHdvcmsuXG5cdCAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG5cdCAgICB0aGlzW2Vycm9yUHJvcHNbaWR4XV0gPSB0bXBbZXJyb3JQcm9wc1tpZHhdXTtcblx0ICB9XG5cblx0ICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHQgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuXHQgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgRXhjZXB0aW9uKTtcblx0ICB9XG5cblx0ICB0cnkge1xuXHQgICAgaWYgKGxvYykge1xuXHQgICAgICB0aGlzLmxpbmVOdW1iZXIgPSBsaW5lO1xuXG5cdCAgICAgIC8vIFdvcmsgYXJvdW5kIGlzc3VlIHVuZGVyIHNhZmFyaSB3aGVyZSB3ZSBjYW4ndCBkaXJlY3RseSBzZXQgdGhlIGNvbHVtbiB2YWx1ZVxuXHQgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgICAgICBpZiAoX09iamVjdCRkZWZpbmVQcm9wZXJ0eSkge1xuXHQgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY29sdW1uJywge1xuXHQgICAgICAgICAgdmFsdWU6IGNvbHVtbixcblx0ICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcblx0ICAgICAgICB9KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0gY2F0Y2ggKG5vcCkge1xuXHQgICAgLyogSWdub3JlIGlmIHRoZSBicm93c2VyIGlzIHZlcnkgcGFydGljdWxhciAqL1xuXHQgIH1cblx0fVxuXG5cdEV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBFeGNlcHRpb247XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDcgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IF9fd2VicGFja19yZXF1aXJlX18oOCksIF9fZXNNb2R1bGU6IHRydWUgfTtcblxuLyoqKi8gfSksXG4vKiA4ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyICQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDkpO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2Mpe1xuXHQgIHJldHVybiAkLnNldERlc2MoaXQsIGtleSwgZGVzYyk7XG5cdH07XG5cbi8qKiovIH0pLFxuLyogOSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdHZhciAkT2JqZWN0ID0gT2JqZWN0O1xuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0ICBjcmVhdGU6ICAgICAkT2JqZWN0LmNyZWF0ZSxcblx0ICBnZXRQcm90bzogICAkT2JqZWN0LmdldFByb3RvdHlwZU9mLFxuXHQgIGlzRW51bTogICAgIHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlLFxuXHQgIGdldERlc2M6ICAgICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuXHQgIHNldERlc2M6ICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHksXG5cdCAgc2V0RGVzY3M6ICAgJE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzLFxuXHQgIGdldEtleXM6ICAgICRPYmplY3Qua2V5cyxcblx0ICBnZXROYW1lczogICAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG5cdCAgZ2V0U3ltYm9sczogJE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG5cdCAgZWFjaDogICAgICAgW10uZm9yRWFjaFxuXHR9O1xuXG4vKioqLyB9KSxcbi8qIDEwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdGV4cG9ydHMucmVnaXN0ZXJEZWZhdWx0SGVscGVycyA9IHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnM7XG5cblx0dmFyIF9oZWxwZXJzQmxvY2tIZWxwZXJNaXNzaW5nID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMSk7XG5cblx0dmFyIF9oZWxwZXJzQmxvY2tIZWxwZXJNaXNzaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNCbG9ja0hlbHBlck1pc3NpbmcpO1xuXG5cdHZhciBfaGVscGVyc0VhY2ggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEyKTtcblxuXHR2YXIgX2hlbHBlcnNFYWNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNFYWNoKTtcblxuXHR2YXIgX2hlbHBlcnNIZWxwZXJNaXNzaW5nID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMyk7XG5cblx0dmFyIF9oZWxwZXJzSGVscGVyTWlzc2luZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzSGVscGVyTWlzc2luZyk7XG5cblx0dmFyIF9oZWxwZXJzSWYgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE0KTtcblxuXHR2YXIgX2hlbHBlcnNJZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzSWYpO1xuXG5cdHZhciBfaGVscGVyc0xvZyA9IF9fd2VicGFja19yZXF1aXJlX18oMTUpO1xuXG5cdHZhciBfaGVscGVyc0xvZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzTG9nKTtcblxuXHR2YXIgX2hlbHBlcnNMb29rdXAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE2KTtcblxuXHR2YXIgX2hlbHBlcnNMb29rdXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0xvb2t1cCk7XG5cblx0dmFyIF9oZWxwZXJzV2l0aCA9IF9fd2VicGFja19yZXF1aXJlX18oMTcpO1xuXG5cdHZhciBfaGVscGVyc1dpdGgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc1dpdGgpO1xuXG5cdGZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcblx0ICBfaGVscGVyc0Jsb2NrSGVscGVyTWlzc2luZzJbJ2RlZmF1bHQnXShpbnN0YW5jZSk7XG5cdCAgX2hlbHBlcnNFYWNoMlsnZGVmYXVsdCddKGluc3RhbmNlKTtcblx0ICBfaGVscGVyc0hlbHBlck1pc3NpbmcyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHQgIF9oZWxwZXJzSWYyWydkZWZhdWx0J10oaW5zdGFuY2UpO1xuXHQgIF9oZWxwZXJzTG9nMlsnZGVmYXVsdCddKGluc3RhbmNlKTtcblx0ICBfaGVscGVyc0xvb2t1cDJbJ2RlZmF1bHQnXShpbnN0YW5jZSk7XG5cdCAgX2hlbHBlcnNXaXRoMlsnZGVmYXVsdCddKGluc3RhbmNlKTtcblx0fVxuXG4vKioqLyB9KSxcbi8qIDExICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2Jsb2NrSGVscGVyTWlzc2luZycsIGZ1bmN0aW9uIChjb250ZXh0LCBvcHRpb25zKSB7XG5cdCAgICB2YXIgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSxcblx0ICAgICAgICBmbiA9IG9wdGlvbnMuZm47XG5cblx0ICAgIGlmIChjb250ZXh0ID09PSB0cnVlKSB7XG5cdCAgICAgIHJldHVybiBmbih0aGlzKTtcblx0ICAgIH0gZWxzZSBpZiAoY29udGV4dCA9PT0gZmFsc2UgfHwgY29udGV4dCA9PSBudWxsKSB7XG5cdCAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuXHQgICAgfSBlbHNlIGlmIChfdXRpbHMuaXNBcnJheShjb250ZXh0KSkge1xuXHQgICAgICBpZiAoY29udGV4dC5sZW5ndGggPiAwKSB7XG5cdCAgICAgICAgaWYgKG9wdGlvbnMuaWRzKSB7XG5cdCAgICAgICAgICBvcHRpb25zLmlkcyA9IFtvcHRpb25zLm5hbWVdO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcblx0ICAgICAgICB2YXIgZGF0YSA9IF91dGlscy5jcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuXHQgICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBfdXRpbHMuYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLm5hbWUpO1xuXHQgICAgICAgIG9wdGlvbnMgPSB7IGRhdGE6IGRhdGEgfTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zKTtcblx0ICAgIH1cblx0ICB9KTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAxMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdHZhciBfZXhjZXB0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHR2YXIgX2V4Y2VwdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leGNlcHRpb24pO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuXHQgIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdlYWNoJywgZnVuY3Rpb24gKGNvbnRleHQsIG9wdGlvbnMpIHtcblx0ICAgIGlmICghb3B0aW9ucykge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnTXVzdCBwYXNzIGl0ZXJhdG9yIHRvICNlYWNoJyk7XG5cdCAgICB9XG5cblx0ICAgIHZhciBmbiA9IG9wdGlvbnMuZm4sXG5cdCAgICAgICAgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSxcblx0ICAgICAgICBpID0gMCxcblx0ICAgICAgICByZXQgPSAnJyxcblx0ICAgICAgICBkYXRhID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGNvbnRleHRQYXRoID0gdW5kZWZpbmVkO1xuXG5cdCAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG5cdCAgICAgIGNvbnRleHRQYXRoID0gX3V0aWxzLmFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pICsgJy4nO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoX3V0aWxzLmlzRnVuY3Rpb24oY29udGV4dCkpIHtcblx0ICAgICAgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKG9wdGlvbnMuZGF0YSkge1xuXHQgICAgICBkYXRhID0gX3V0aWxzLmNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGV4ZWNJdGVyYXRpb24oZmllbGQsIGluZGV4LCBsYXN0KSB7XG5cdCAgICAgIGlmIChkYXRhKSB7XG5cdCAgICAgICAgZGF0YS5rZXkgPSBmaWVsZDtcblx0ICAgICAgICBkYXRhLmluZGV4ID0gaW5kZXg7XG5cdCAgICAgICAgZGF0YS5maXJzdCA9IGluZGV4ID09PSAwO1xuXHQgICAgICAgIGRhdGEubGFzdCA9ICEhbGFzdDtcblxuXHQgICAgICAgIGlmIChjb250ZXh0UGF0aCkge1xuXHQgICAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IGNvbnRleHRQYXRoICsgZmllbGQ7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtmaWVsZF0sIHtcblx0ICAgICAgICBkYXRhOiBkYXRhLFxuXHQgICAgICAgIGJsb2NrUGFyYW1zOiBfdXRpbHMuYmxvY2tQYXJhbXMoW2NvbnRleHRbZmllbGRdLCBmaWVsZF0sIFtjb250ZXh0UGF0aCArIGZpZWxkLCBudWxsXSlcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuXHQgICAgICBpZiAoX3V0aWxzLmlzQXJyYXkoY29udGV4dCkpIHtcblx0ICAgICAgICBmb3IgKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0ICAgICAgICAgIGlmIChpIGluIGNvbnRleHQpIHtcblx0ICAgICAgICAgICAgZXhlY0l0ZXJhdGlvbihpLCBpLCBpID09PSBjb250ZXh0Lmxlbmd0aCAtIDEpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgcHJpb3JLZXkgPSB1bmRlZmluZWQ7XG5cblx0ICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29udGV4dCkge1xuXHQgICAgICAgICAgaWYgKGNvbnRleHQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHQgICAgICAgICAgICAvLyBXZSdyZSBydW5uaW5nIHRoZSBpdGVyYXRpb25zIG9uZSBzdGVwIG91dCBvZiBzeW5jIHNvIHdlIGNhbiBkZXRlY3Rcblx0ICAgICAgICAgICAgLy8gdGhlIGxhc3QgaXRlcmF0aW9uIHdpdGhvdXQgaGF2ZSB0byBzY2FuIHRoZSBvYmplY3QgdHdpY2UgYW5kIGNyZWF0ZVxuXHQgICAgICAgICAgICAvLyBhbiBpdGVybWVkaWF0ZSBrZXlzIGFycmF5LlxuXHQgICAgICAgICAgICBpZiAocHJpb3JLZXkgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICAgIGV4ZWNJdGVyYXRpb24ocHJpb3JLZXksIGkgLSAxKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBwcmlvcktleSA9IGtleTtcblx0ICAgICAgICAgICAgaSsrO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAocHJpb3JLZXkgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgZXhlY0l0ZXJhdGlvbihwcmlvcktleSwgaSAtIDEsIHRydWUpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBpZiAoaSA9PT0gMCkge1xuXHQgICAgICByZXQgPSBpbnZlcnNlKHRoaXMpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH0pO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDEzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF9leGNlcHRpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG5cdHZhciBfZXhjZXB0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4Y2VwdGlvbik7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbiAoKSAvKiBbYXJncywgXW9wdGlvbnMgKi97XG5cdCAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHQgICAgICAvLyBBIG1pc3NpbmcgZmllbGQgaW4gYSB7e2Zvb319IGNvbnN0cnVjdC5cblx0ICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIC8vIFNvbWVvbmUgaXMgYWN0dWFsbHkgdHJ5aW5nIHRvIGNhbGwgc29tZXRoaW5nLCBibG93IHVwLlxuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnTWlzc2luZyBoZWxwZXI6IFwiJyArIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0ubmFtZSArICdcIicpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDE0ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2lmJywgZnVuY3Rpb24gKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG5cdCAgICBpZiAoX3V0aWxzLmlzRnVuY3Rpb24oY29uZGl0aW9uYWwpKSB7XG5cdCAgICAgIGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwuY2FsbCh0aGlzKTtcblx0ICAgIH1cblxuXHQgICAgLy8gRGVmYXVsdCBiZWhhdmlvciBpcyB0byByZW5kZXIgdGhlIHBvc2l0aXZlIHBhdGggaWYgdGhlIHZhbHVlIGlzIHRydXRoeSBhbmQgbm90IGVtcHR5LlxuXHQgICAgLy8gVGhlIGBpbmNsdWRlWmVyb2Agb3B0aW9uIG1heSBiZSBzZXQgdG8gdHJlYXQgdGhlIGNvbmR0aW9uYWwgYXMgcHVyZWx5IG5vdCBlbXB0eSBiYXNlZCBvbiB0aGVcblx0ICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG5cdCAgICBpZiAoIW9wdGlvbnMuaGFzaC5pbmNsdWRlWmVybyAmJiAhY29uZGl0aW9uYWwgfHwgX3V0aWxzLmlzRW1wdHkoY29uZGl0aW9uYWwpKSB7XG5cdCAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gb3B0aW9ucy5mbih0aGlzKTtcblx0ICAgIH1cblx0ICB9KTtcblxuXHQgIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd1bmxlc3MnLCBmdW5jdGlvbiAoY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcblx0ICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzWydpZiddLmNhbGwodGhpcywgY29uZGl0aW9uYWwsIHsgZm46IG9wdGlvbnMuaW52ZXJzZSwgaW52ZXJzZTogb3B0aW9ucy5mbiwgaGFzaDogb3B0aW9ucy5oYXNoIH0pO1xuXHQgIH0pO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDE1ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uICgpIC8qIG1lc3NhZ2UsIG9wdGlvbnMgKi97XG5cdCAgICB2YXIgYXJncyA9IFt1bmRlZmluZWRdLFxuXHQgICAgICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSsrKSB7XG5cdCAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgbGV2ZWwgPSAxO1xuXHQgICAgaWYgKG9wdGlvbnMuaGFzaC5sZXZlbCAhPSBudWxsKSB7XG5cdCAgICAgIGxldmVsID0gb3B0aW9ucy5oYXNoLmxldmVsO1xuXHQgICAgfSBlbHNlIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5kYXRhLmxldmVsICE9IG51bGwpIHtcblx0ICAgICAgbGV2ZWwgPSBvcHRpb25zLmRhdGEubGV2ZWw7XG5cdCAgICB9XG5cdCAgICBhcmdzWzBdID0gbGV2ZWw7XG5cblx0ICAgIGluc3RhbmNlLmxvZy5hcHBseShpbnN0YW5jZSwgYXJncyk7XG5cdCAgfSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMTYgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcblx0ICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9va3VwJywgZnVuY3Rpb24gKG9iaiwgZmllbGQpIHtcblx0ICAgIHJldHVybiBvYmogJiYgb2JqW2ZpZWxkXTtcblx0ICB9KTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAxNyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuXHQgIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd3aXRoJywgZnVuY3Rpb24gKGNvbnRleHQsIG9wdGlvbnMpIHtcblx0ICAgIGlmIChfdXRpbHMuaXNGdW5jdGlvbihjb250ZXh0KSkge1xuXHQgICAgICBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgZm4gPSBvcHRpb25zLmZuO1xuXG5cdCAgICBpZiAoIV91dGlscy5pc0VtcHR5KGNvbnRleHQpKSB7XG5cdCAgICAgIHZhciBkYXRhID0gb3B0aW9ucy5kYXRhO1xuXHQgICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG5cdCAgICAgICAgZGF0YSA9IF91dGlscy5jcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuXHQgICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBfdXRpbHMuYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLmlkc1swXSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gZm4oY29udGV4dCwge1xuXHQgICAgICAgIGRhdGE6IGRhdGEsXG5cdCAgICAgICAgYmxvY2tQYXJhbXM6IF91dGlscy5ibG9ja1BhcmFtcyhbY29udGV4dF0sIFtkYXRhICYmIGRhdGEuY29udGV4dFBhdGhdKVxuXHQgICAgICB9KTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMTggKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5yZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzID0gcmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycztcblxuXHR2YXIgX2RlY29yYXRvcnNJbmxpbmUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE5KTtcblxuXHR2YXIgX2RlY29yYXRvcnNJbmxpbmUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVjb3JhdG9yc0lubGluZSk7XG5cblx0ZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyhpbnN0YW5jZSkge1xuXHQgIF9kZWNvcmF0b3JzSW5saW5lMlsnZGVmYXVsdCddKGluc3RhbmNlKTtcblx0fVxuXG4vKioqLyB9KSxcbi8qIDE5ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG5cdCAgaW5zdGFuY2UucmVnaXN0ZXJEZWNvcmF0b3IoJ2lubGluZScsIGZ1bmN0aW9uIChmbiwgcHJvcHMsIGNvbnRhaW5lciwgb3B0aW9ucykge1xuXHQgICAgdmFyIHJldCA9IGZuO1xuXHQgICAgaWYgKCFwcm9wcy5wYXJ0aWFscykge1xuXHQgICAgICBwcm9wcy5wYXJ0aWFscyA9IHt9O1xuXHQgICAgICByZXQgPSBmdW5jdGlvbiAoY29udGV4dCwgb3B0aW9ucykge1xuXHQgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBwYXJ0aWFscyBzdGFjayBmcmFtZSBwcmlvciB0byBleGVjLlxuXHQgICAgICAgIHZhciBvcmlnaW5hbCA9IGNvbnRhaW5lci5wYXJ0aWFscztcblx0ICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBfdXRpbHMuZXh0ZW5kKHt9LCBvcmlnaW5hbCwgcHJvcHMucGFydGlhbHMpO1xuXHQgICAgICAgIHZhciByZXQgPSBmbihjb250ZXh0LCBvcHRpb25zKTtcblx0ICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBvcmlnaW5hbDtcblx0ICAgICAgICByZXR1cm4gcmV0O1xuXHQgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICBwcm9wcy5wYXJ0aWFsc1tvcHRpb25zLmFyZ3NbMF1dID0gb3B0aW9ucy5mbjtcblxuXHQgICAgcmV0dXJuIHJldDtcblx0ICB9KTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAyMCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdHZhciBsb2dnZXIgPSB7XG5cdCAgbWV0aG9kTWFwOiBbJ2RlYnVnJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddLFxuXHQgIGxldmVsOiAnaW5mbycsXG5cblx0ICAvLyBNYXBzIGEgZ2l2ZW4gbGV2ZWwgdmFsdWUgdG8gdGhlIGBtZXRob2RNYXBgIGluZGV4ZXMgYWJvdmUuXG5cdCAgbG9va3VwTGV2ZWw6IGZ1bmN0aW9uIGxvb2t1cExldmVsKGxldmVsKSB7XG5cdCAgICBpZiAodHlwZW9mIGxldmVsID09PSAnc3RyaW5nJykge1xuXHQgICAgICB2YXIgbGV2ZWxNYXAgPSBfdXRpbHMuaW5kZXhPZihsb2dnZXIubWV0aG9kTWFwLCBsZXZlbC50b0xvd2VyQ2FzZSgpKTtcblx0ICAgICAgaWYgKGxldmVsTWFwID49IDApIHtcblx0ICAgICAgICBsZXZlbCA9IGxldmVsTWFwO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGxldmVsID0gcGFyc2VJbnQobGV2ZWwsIDEwKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gbGV2ZWw7XG5cdCAgfSxcblxuXHQgIC8vIENhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG5cdCAgbG9nOiBmdW5jdGlvbiBsb2cobGV2ZWwpIHtcblx0ICAgIGxldmVsID0gbG9nZ2VyLmxvb2t1cExldmVsKGxldmVsKTtcblxuXHQgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBsb2dnZXIubG9va3VwTGV2ZWwobG9nZ2VyLmxldmVsKSA8PSBsZXZlbCkge1xuXHQgICAgICB2YXIgbWV0aG9kID0gbG9nZ2VyLm1ldGhvZE1hcFtsZXZlbF07XG5cdCAgICAgIGlmICghY29uc29sZVttZXRob2RdKSB7XG5cdCAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG5cdCAgICAgICAgbWV0aG9kID0gJ2xvZyc7XG5cdCAgICAgIH1cblxuXHQgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgbWVzc2FnZSA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgICAgICBtZXNzYWdlW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGNvbnNvbGVbbWV0aG9kXS5hcHBseShjb25zb2xlLCBtZXNzYWdlKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IGxvZ2dlcjtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogMjEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZnVuY3Rpb24gU2FmZVN0cmluZyhzdHJpbmcpIHtcblx0ICB0aGlzLnN0cmluZyA9IHN0cmluZztcblx0fVxuXG5cdFNhZmVTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gU2FmZVN0cmluZy5wcm90b3R5cGUudG9IVE1MID0gZnVuY3Rpb24gKCkge1xuXHQgIHJldHVybiAnJyArIHRoaXMuc3RyaW5nO1xuXHR9O1xuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IFNhZmVTdHJpbmc7XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDIyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfT2JqZWN0JHNlYWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIzKVsnZGVmYXVsdCddO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IF9fd2VicGFja19yZXF1aXJlX18oMylbJ2RlZmF1bHQnXTtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLmNoZWNrUmV2aXNpb24gPSBjaGVja1JldmlzaW9uO1xuXHRleHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5cdGV4cG9ydHMud3JhcFByb2dyYW0gPSB3cmFwUHJvZ3JhbTtcblx0ZXhwb3J0cy5yZXNvbHZlUGFydGlhbCA9IHJlc29sdmVQYXJ0aWFsO1xuXHRleHBvcnRzLmludm9rZVBhcnRpYWwgPSBpbnZva2VQYXJ0aWFsO1xuXHRleHBvcnRzLm5vb3AgPSBub29wO1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdHZhciBVdGlscyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF91dGlscyk7XG5cblx0dmFyIF9leGNlcHRpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG5cdHZhciBfZXhjZXB0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4Y2VwdGlvbik7XG5cblx0dmFyIF9iYXNlID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KTtcblxuXHRmdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuXHQgIHZhciBjb21waWxlclJldmlzaW9uID0gY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSB8fCAxLFxuXHQgICAgICBjdXJyZW50UmV2aXNpb24gPSBfYmFzZS5DT01QSUxFUl9SRVZJU0lPTjtcblxuXHQgIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcblx0ICAgIGlmIChjb21waWxlclJldmlzaW9uIDwgY3VycmVudFJldmlzaW9uKSB7XG5cdCAgICAgIHZhciBydW50aW1lVmVyc2lvbnMgPSBfYmFzZS5SRVZJU0lPTl9DSEFOR0VTW2N1cnJlbnRSZXZpc2lvbl0sXG5cdCAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gX2Jhc2UuUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1RlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGFuIG9sZGVyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuICcgKyAnUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArIHJ1bnRpbWVWZXJzaW9ucyArICcpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoJyArIGNvbXBpbGVyVmVyc2lvbnMgKyAnKS4nKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIC8vIFVzZSB0aGUgZW1iZWRkZWQgdmVyc2lvbiBpbmZvIHNpbmNlIHRoZSBydW50aW1lIGRvZXNuJ3Qga25vdyBhYm91dCB0aGlzIHJldmlzaW9uIHlldFxuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiAnICsgJ1BsZWFzZSB1cGRhdGUgeW91ciBydW50aW1lIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArIGNvbXBpbGVySW5mb1sxXSArICcpLicpO1xuXHQgICAgfVxuXHQgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIHRlbXBsYXRlKHRlbXBsYXRlU3BlYywgZW52KSB7XG5cdCAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICBpZiAoIWVudikge1xuXHQgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ05vIGVudmlyb25tZW50IHBhc3NlZCB0byB0ZW1wbGF0ZScpO1xuXHQgIH1cblx0ICBpZiAoIXRlbXBsYXRlU3BlYyB8fCAhdGVtcGxhdGVTcGVjLm1haW4pIHtcblx0ICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdVbmtub3duIHRlbXBsYXRlIG9iamVjdDogJyArIHR5cGVvZiB0ZW1wbGF0ZVNwZWMpO1xuXHQgIH1cblxuXHQgIHRlbXBsYXRlU3BlYy5tYWluLmRlY29yYXRvciA9IHRlbXBsYXRlU3BlYy5tYWluX2Q7XG5cblx0ICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuXHQgIC8vIGZvciBleHRlcm5hbCB1c2VycyB0byBvdmVycmlkZSB0aGVzZSBhcyBwc3VlZG8tc3VwcG9ydGVkIEFQSXMuXG5cdCAgZW52LlZNLmNoZWNrUmV2aXNpb24odGVtcGxhdGVTcGVjLmNvbXBpbGVyKTtcblxuXHQgIGZ1bmN0aW9uIGludm9rZVBhcnRpYWxXcmFwcGVyKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcblx0ICAgIGlmIChvcHRpb25zLmhhc2gpIHtcblx0ICAgICAgY29udGV4dCA9IFV0aWxzLmV4dGVuZCh7fSwgY29udGV4dCwgb3B0aW9ucy5oYXNoKTtcblx0ICAgICAgaWYgKG9wdGlvbnMuaWRzKSB7XG5cdCAgICAgICAgb3B0aW9ucy5pZHNbMF0gPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHBhcnRpYWwgPSBlbnYuVk0ucmVzb2x2ZVBhcnRpYWwuY2FsbCh0aGlzLCBwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKTtcblx0ICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5jYWxsKHRoaXMsIHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpO1xuXG5cdCAgICBpZiAocmVzdWx0ID09IG51bGwgJiYgZW52LmNvbXBpbGUpIHtcblx0ICAgICAgb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgdGVtcGxhdGVTcGVjLmNvbXBpbGVyT3B0aW9ucywgZW52KTtcblx0ICAgICAgcmVzdWx0ID0gb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdKGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgICAgfVxuXHQgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG5cdCAgICAgIGlmIChvcHRpb25zLmluZGVudCkge1xuXHQgICAgICAgIHZhciBsaW5lcyA9IHJlc3VsdC5zcGxpdCgnXFxuJyk7XG5cdCAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgICAgIGlmICghbGluZXNbaV0gJiYgaSArIDEgPT09IGwpIHtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICB9XG5cblx0ICAgICAgICAgIGxpbmVzW2ldID0gb3B0aW9ucy5pbmRlbnQgKyBsaW5lc1tpXTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmVzdWx0ID0gbGluZXMuam9pbignXFxuJyk7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdUaGUgcGFydGlhbCAnICsgb3B0aW9ucy5uYW1lICsgJyBjb3VsZCBub3QgYmUgY29tcGlsZWQgd2hlbiBydW5uaW5nIGluIHJ1bnRpbWUtb25seSBtb2RlJyk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgLy8gSnVzdCBhZGQgd2F0ZXJcblx0ICB2YXIgY29udGFpbmVyID0ge1xuXHQgICAgc3RyaWN0OiBmdW5jdGlvbiBzdHJpY3Qob2JqLCBuYW1lKSB7XG5cdCAgICAgIGlmICghKG5hbWUgaW4gb2JqKSkge1xuXHQgICAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdcIicgKyBuYW1lICsgJ1wiIG5vdCBkZWZpbmVkIGluICcgKyBvYmopO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBvYmpbbmFtZV07XG5cdCAgICB9LFxuXHQgICAgbG9va3VwOiBmdW5jdGlvbiBsb29rdXAoZGVwdGhzLCBuYW1lKSB7XG5cdCAgICAgIHZhciBsZW4gPSBkZXB0aHMubGVuZ3RoO1xuXHQgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgICAgaWYgKGRlcHRoc1tpXSAmJiBkZXB0aHNbaV1bbmFtZV0gIT0gbnVsbCkge1xuXHQgICAgICAgICAgcmV0dXJuIGRlcHRoc1tpXVtuYW1lXTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0sXG5cdCAgICBsYW1iZGE6IGZ1bmN0aW9uIGxhbWJkYShjdXJyZW50LCBjb250ZXh0KSB7XG5cdCAgICAgIHJldHVybiB0eXBlb2YgY3VycmVudCA9PT0gJ2Z1bmN0aW9uJyA/IGN1cnJlbnQuY2FsbChjb250ZXh0KSA6IGN1cnJlbnQ7XG5cdCAgICB9LFxuXG5cdCAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuXHQgICAgaW52b2tlUGFydGlhbDogaW52b2tlUGFydGlhbFdyYXBwZXIsXG5cblx0ICAgIGZuOiBmdW5jdGlvbiBmbihpKSB7XG5cdCAgICAgIHZhciByZXQgPSB0ZW1wbGF0ZVNwZWNbaV07XG5cdCAgICAgIHJldC5kZWNvcmF0b3IgPSB0ZW1wbGF0ZVNwZWNbaSArICdfZCddO1xuXHQgICAgICByZXR1cm4gcmV0O1xuXHQgICAgfSxcblxuXHQgICAgcHJvZ3JhbXM6IFtdLFxuXHQgICAgcHJvZ3JhbTogZnVuY3Rpb24gcHJvZ3JhbShpLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG5cdCAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0sXG5cdCAgICAgICAgICBmbiA9IHRoaXMuZm4oaSk7XG5cdCAgICAgIGlmIChkYXRhIHx8IGRlcHRocyB8fCBibG9ja1BhcmFtcyB8fCBkZWNsYXJlZEJsb2NrUGFyYW1zKSB7XG5cdCAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB3cmFwUHJvZ3JhbSh0aGlzLCBpLCBmbiwgZGF0YSwgZGVjbGFyZWRCbG9ja1BhcmFtcywgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG5cdCAgICAgIH0gZWxzZSBpZiAoIXByb2dyYW1XcmFwcGVyKSB7XG5cdCAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gd3JhcFByb2dyYW0odGhpcywgaSwgZm4pO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcblx0ICAgIH0sXG5cblx0ICAgIGRhdGE6IGZ1bmN0aW9uIGRhdGEodmFsdWUsIGRlcHRoKSB7XG5cdCAgICAgIHdoaWxlICh2YWx1ZSAmJiBkZXB0aC0tKSB7XG5cdCAgICAgICAgdmFsdWUgPSB2YWx1ZS5fcGFyZW50O1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiB2YWx1ZTtcblx0ICAgIH0sXG5cdCAgICBtZXJnZTogZnVuY3Rpb24gbWVyZ2UocGFyYW0sIGNvbW1vbikge1xuXHQgICAgICB2YXIgb2JqID0gcGFyYW0gfHwgY29tbW9uO1xuXG5cdCAgICAgIGlmIChwYXJhbSAmJiBjb21tb24gJiYgcGFyYW0gIT09IGNvbW1vbikge1xuXHQgICAgICAgIG9iaiA9IFV0aWxzLmV4dGVuZCh7fSwgY29tbW9uLCBwYXJhbSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gb2JqO1xuXHQgICAgfSxcblx0ICAgIC8vIEFuIGVtcHR5IG9iamVjdCB0byB1c2UgYXMgcmVwbGFjZW1lbnQgZm9yIG51bGwtY29udGV4dHNcblx0ICAgIG51bGxDb250ZXh0OiBfT2JqZWN0JHNlYWwoe30pLFxuXG5cdCAgICBub29wOiBlbnYuVk0ubm9vcCxcblx0ICAgIGNvbXBpbGVySW5mbzogdGVtcGxhdGVTcGVjLmNvbXBpbGVyXG5cdCAgfTtcblxuXHQgIGZ1bmN0aW9uIHJldChjb250ZXh0KSB7XG5cdCAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG5cdCAgICB2YXIgZGF0YSA9IG9wdGlvbnMuZGF0YTtcblxuXHQgICAgcmV0Ll9zZXR1cChvcHRpb25zKTtcblx0ICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsICYmIHRlbXBsYXRlU3BlYy51c2VEYXRhKSB7XG5cdCAgICAgIGRhdGEgPSBpbml0RGF0YShjb250ZXh0LCBkYXRhKTtcblx0ICAgIH1cblx0ICAgIHZhciBkZXB0aHMgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgYmxvY2tQYXJhbXMgPSB0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgPyBbXSA6IHVuZGVmaW5lZDtcblx0ICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlRGVwdGhzKSB7XG5cdCAgICAgIGlmIChvcHRpb25zLmRlcHRocykge1xuXHQgICAgICAgIGRlcHRocyA9IGNvbnRleHQgIT0gb3B0aW9ucy5kZXB0aHNbMF0gPyBbY29udGV4dF0uY29uY2F0KG9wdGlvbnMuZGVwdGhzKSA6IG9wdGlvbnMuZGVwdGhzO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGRlcHRocyA9IFtjb250ZXh0XTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBtYWluKGNvbnRleHQgLyosIG9wdGlvbnMqLykge1xuXHQgICAgICByZXR1cm4gJycgKyB0ZW1wbGF0ZVNwZWMubWFpbihjb250YWluZXIsIGNvbnRleHQsIGNvbnRhaW5lci5oZWxwZXJzLCBjb250YWluZXIucGFydGlhbHMsIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuXHQgICAgfVxuXHQgICAgbWFpbiA9IGV4ZWN1dGVEZWNvcmF0b3JzKHRlbXBsYXRlU3BlYy5tYWluLCBtYWluLCBjb250YWluZXIsIG9wdGlvbnMuZGVwdGhzIHx8IFtdLCBkYXRhLCBibG9ja1BhcmFtcyk7XG5cdCAgICByZXR1cm4gbWFpbihjb250ZXh0LCBvcHRpb25zKTtcblx0ICB9XG5cdCAgcmV0LmlzVG9wID0gdHJ1ZTtcblxuXHQgIHJldC5fc2V0dXAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXHQgICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcblx0ICAgICAgY29udGFpbmVyLmhlbHBlcnMgPSBjb250YWluZXIubWVyZ2Uob3B0aW9ucy5oZWxwZXJzLCBlbnYuaGVscGVycyk7XG5cblx0ICAgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VQYXJ0aWFsKSB7XG5cdCAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gY29udGFpbmVyLm1lcmdlKG9wdGlvbnMucGFydGlhbHMsIGVudi5wYXJ0aWFscyk7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VQYXJ0aWFsIHx8IHRlbXBsYXRlU3BlYy51c2VEZWNvcmF0b3JzKSB7XG5cdCAgICAgICAgY29udGFpbmVyLmRlY29yYXRvcnMgPSBjb250YWluZXIubWVyZ2Uob3B0aW9ucy5kZWNvcmF0b3JzLCBlbnYuZGVjb3JhdG9ycyk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGNvbnRhaW5lci5oZWxwZXJzID0gb3B0aW9ucy5oZWxwZXJzO1xuXHQgICAgICBjb250YWluZXIucGFydGlhbHMgPSBvcHRpb25zLnBhcnRpYWxzO1xuXHQgICAgICBjb250YWluZXIuZGVjb3JhdG9ycyA9IG9wdGlvbnMuZGVjb3JhdG9ycztcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgcmV0Ll9jaGlsZCA9IGZ1bmN0aW9uIChpLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG5cdCAgICBpZiAodGVtcGxhdGVTcGVjLnVzZUJsb2NrUGFyYW1zICYmICFibG9ja1BhcmFtcykge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnbXVzdCBwYXNzIGJsb2NrIHBhcmFtcycpO1xuXHQgICAgfVxuXHQgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VEZXB0aHMgJiYgIWRlcHRocykge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnbXVzdCBwYXNzIHBhcmVudCBkZXB0aHMnKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHdyYXBQcm9ncmFtKGNvbnRhaW5lciwgaSwgdGVtcGxhdGVTcGVjW2ldLCBkYXRhLCAwLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcblx0ICB9O1xuXHQgIHJldHVybiByZXQ7XG5cdH1cblxuXHRmdW5jdGlvbiB3cmFwUHJvZ3JhbShjb250YWluZXIsIGksIGZuLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG5cdCAgZnVuY3Rpb24gcHJvZyhjb250ZXh0KSB7XG5cdCAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG5cdCAgICB2YXIgY3VycmVudERlcHRocyA9IGRlcHRocztcblx0ICAgIGlmIChkZXB0aHMgJiYgY29udGV4dCAhPSBkZXB0aHNbMF0gJiYgIShjb250ZXh0ID09PSBjb250YWluZXIubnVsbENvbnRleHQgJiYgZGVwdGhzWzBdID09PSBudWxsKSkge1xuXHQgICAgICBjdXJyZW50RGVwdGhzID0gW2NvbnRleHRdLmNvbmNhdChkZXB0aHMpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZm4oY29udGFpbmVyLCBjb250ZXh0LCBjb250YWluZXIuaGVscGVycywgY29udGFpbmVyLnBhcnRpYWxzLCBvcHRpb25zLmRhdGEgfHwgZGF0YSwgYmxvY2tQYXJhbXMgJiYgW29wdGlvbnMuYmxvY2tQYXJhbXNdLmNvbmNhdChibG9ja1BhcmFtcyksIGN1cnJlbnREZXB0aHMpO1xuXHQgIH1cblxuXHQgIHByb2cgPSBleGVjdXRlRGVjb3JhdG9ycyhmbiwgcHJvZywgY29udGFpbmVyLCBkZXB0aHMsIGRhdGEsIGJsb2NrUGFyYW1zKTtcblxuXHQgIHByb2cucHJvZ3JhbSA9IGk7XG5cdCAgcHJvZy5kZXB0aCA9IGRlcHRocyA/IGRlcHRocy5sZW5ndGggOiAwO1xuXHQgIHByb2cuYmxvY2tQYXJhbXMgPSBkZWNsYXJlZEJsb2NrUGFyYW1zIHx8IDA7XG5cdCAgcmV0dXJuIHByb2c7XG5cdH1cblxuXHRmdW5jdGlvbiByZXNvbHZlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG5cdCAgaWYgKCFwYXJ0aWFsKSB7XG5cdCAgICBpZiAob3B0aW9ucy5uYW1lID09PSAnQHBhcnRpYWwtYmxvY2snKSB7XG5cdCAgICAgIHBhcnRpYWwgPSBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHBhcnRpYWwgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV07XG5cdCAgICB9XG5cdCAgfSBlbHNlIGlmICghcGFydGlhbC5jYWxsICYmICFvcHRpb25zLm5hbWUpIHtcblx0ICAgIC8vIFRoaXMgaXMgYSBkeW5hbWljIHBhcnRpYWwgdGhhdCByZXR1cm5lZCBhIHN0cmluZ1xuXHQgICAgb3B0aW9ucy5uYW1lID0gcGFydGlhbDtcblx0ICAgIHBhcnRpYWwgPSBvcHRpb25zLnBhcnRpYWxzW3BhcnRpYWxdO1xuXHQgIH1cblx0ICByZXR1cm4gcGFydGlhbDtcblx0fVxuXG5cdGZ1bmN0aW9uIGludm9rZVBhcnRpYWwocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuXHQgIC8vIFVzZSB0aGUgY3VycmVudCBjbG9zdXJlIGNvbnRleHQgdG8gc2F2ZSB0aGUgcGFydGlhbC1ibG9jayBpZiB0aGlzIHBhcnRpYWxcblx0ICB2YXIgY3VycmVudFBhcnRpYWxCbG9jayA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXTtcblx0ICBvcHRpb25zLnBhcnRpYWwgPSB0cnVlO1xuXHQgIGlmIChvcHRpb25zLmlkcykge1xuXHQgICAgb3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoID0gb3B0aW9ucy5pZHNbMF0gfHwgb3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoO1xuXHQgIH1cblxuXHQgIHZhciBwYXJ0aWFsQmxvY2sgPSB1bmRlZmluZWQ7XG5cdCAgaWYgKG9wdGlvbnMuZm4gJiYgb3B0aW9ucy5mbiAhPT0gbm9vcCkge1xuXHQgICAgKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgb3B0aW9ucy5kYXRhID0gX2Jhc2UuY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcblx0ICAgICAgLy8gV3JhcHBlciBmdW5jdGlvbiB0byBnZXQgYWNjZXNzIHRvIGN1cnJlbnRQYXJ0aWFsQmxvY2sgZnJvbSB0aGUgY2xvc3VyZVxuXHQgICAgICB2YXIgZm4gPSBvcHRpb25zLmZuO1xuXHQgICAgICBwYXJ0aWFsQmxvY2sgPSBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXSA9IGZ1bmN0aW9uIHBhcnRpYWxCbG9ja1dyYXBwZXIoY29udGV4dCkge1xuXHQgICAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cblx0ICAgICAgICAvLyBSZXN0b3JlIHRoZSBwYXJ0aWFsLWJsb2NrIGZyb20gdGhlIGNsb3N1cmUgZm9yIHRoZSBleGVjdXRpb24gb2YgdGhlIGJsb2NrXG5cdCAgICAgICAgLy8gaS5lLiB0aGUgcGFydCBpbnNpZGUgdGhlIGJsb2NrIG9mIHRoZSBwYXJ0aWFsIGNhbGwuXG5cdCAgICAgICAgb3B0aW9ucy5kYXRhID0gX2Jhc2UuY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcblx0ICAgICAgICBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXSA9IGN1cnJlbnRQYXJ0aWFsQmxvY2s7XG5cdCAgICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuXHQgICAgICB9O1xuXHQgICAgICBpZiAoZm4ucGFydGlhbHMpIHtcblx0ICAgICAgICBvcHRpb25zLnBhcnRpYWxzID0gVXRpbHMuZXh0ZW5kKHt9LCBvcHRpb25zLnBhcnRpYWxzLCBmbi5wYXJ0aWFscyk7XG5cdCAgICAgIH1cblx0ICAgIH0pKCk7XG5cdCAgfVxuXG5cdCAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCAmJiBwYXJ0aWFsQmxvY2spIHtcblx0ICAgIHBhcnRpYWwgPSBwYXJ0aWFsQmxvY2s7XG5cdCAgfVxuXG5cdCAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1RoZSBwYXJ0aWFsICcgKyBvcHRpb25zLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuXHQgIH0gZWxzZSBpZiAocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG5cdCAgICByZXR1cm4gcGFydGlhbChjb250ZXh0LCBvcHRpb25zKTtcblx0ICB9XG5cdH1cblxuXHRmdW5jdGlvbiBub29wKCkge1xuXHQgIHJldHVybiAnJztcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXREYXRhKGNvbnRleHQsIGRhdGEpIHtcblx0ICBpZiAoIWRhdGEgfHwgISgncm9vdCcgaW4gZGF0YSkpIHtcblx0ICAgIGRhdGEgPSBkYXRhID8gX2Jhc2UuY3JlYXRlRnJhbWUoZGF0YSkgOiB7fTtcblx0ICAgIGRhdGEucm9vdCA9IGNvbnRleHQ7XG5cdCAgfVxuXHQgIHJldHVybiBkYXRhO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXhlY3V0ZURlY29yYXRvcnMoZm4sIHByb2csIGNvbnRhaW5lciwgZGVwdGhzLCBkYXRhLCBibG9ja1BhcmFtcykge1xuXHQgIGlmIChmbi5kZWNvcmF0b3IpIHtcblx0ICAgIHZhciBwcm9wcyA9IHt9O1xuXHQgICAgcHJvZyA9IGZuLmRlY29yYXRvcihwcm9nLCBwcm9wcywgY29udGFpbmVyLCBkZXB0aHMgJiYgZGVwdGhzWzBdLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcblx0ICAgIFV0aWxzLmV4dGVuZChwcm9nLCBwcm9wcyk7XG5cdCAgfVxuXHQgIHJldHVybiBwcm9nO1xuXHR9XG5cbi8qKiovIH0pLFxuLyogMjMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IF9fd2VicGFja19yZXF1aXJlX18oMjQpLCBfX2VzTW9kdWxlOiB0cnVlIH07XG5cbi8qKiovIH0pLFxuLyogMjQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRfX3dlYnBhY2tfcmVxdWlyZV9fKDI1KTtcblx0bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMwKS5PYmplY3Quc2VhbDtcblxuLyoqKi8gfSksXG4vKiAyNSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8vIDE5LjEuMi4xNyBPYmplY3Quc2VhbChPKVxuXHR2YXIgaXNPYmplY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDI2KTtcblxuXHRfX3dlYnBhY2tfcmVxdWlyZV9fKDI3KSgnc2VhbCcsIGZ1bmN0aW9uKCRzZWFsKXtcblx0ICByZXR1cm4gZnVuY3Rpb24gc2VhbChpdCl7XG5cdCAgICByZXR1cm4gJHNlYWwgJiYgaXNPYmplY3QoaXQpID8gJHNlYWwoaXQpIDogaXQ7XG5cdCAgfTtcblx0fSk7XG5cbi8qKiovIH0pLFxuLyogMjYgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcblx0ICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xuXHR9O1xuXG4vKioqLyB9KSxcbi8qIDI3ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0Ly8gbW9zdCBPYmplY3QgbWV0aG9kcyBieSBFUzYgc2hvdWxkIGFjY2VwdCBwcmltaXRpdmVzXG5cdHZhciAkZXhwb3J0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygyOClcblx0ICAsIGNvcmUgICAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMwKVxuXHQgICwgZmFpbHMgICA9IF9fd2VicGFja19yZXF1aXJlX18oMzMpO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSwgZXhlYyl7XG5cdCAgdmFyIGZuICA9IChjb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXVxuXHQgICAgLCBleHAgPSB7fTtcblx0ICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuXHQgICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24oKXsgZm4oMSk7IH0pLCAnT2JqZWN0JywgZXhwKTtcblx0fTtcblxuLyoqKi8gfSksXG4vKiAyOCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBnbG9iYWwgICAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDI5KVxuXHQgICwgY29yZSAgICAgID0gX193ZWJwYWNrX3JlcXVpcmVfXygzMClcblx0ICAsIGN0eCAgICAgICA9IF9fd2VicGFja19yZXF1aXJlX18oMzEpXG5cdCAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuXHR2YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG5cdCAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcblx0ICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuXHQgICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG5cdCAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcblx0ICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuXHQgICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG5cdCAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG5cdCAgICAsIHRhcmdldCAgICA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cblx0ICAgICwga2V5LCBvd24sIG91dDtcblx0ICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcblx0ICBmb3Ioa2V5IGluIHNvdXJjZSl7XG5cdCAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcblx0ICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXQ7XG5cdCAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG5cdCAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuXHQgICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcblx0ICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuXHQgICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cblx0ICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG5cdCAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuXHQgICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcblx0ICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG5cdCAgICAgIHZhciBGID0gZnVuY3Rpb24ocGFyYW0pe1xuXHQgICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgQyA/IG5ldyBDKHBhcmFtKSA6IEMocGFyYW0pO1xuXHQgICAgICB9O1xuXHQgICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG5cdCAgICAgIHJldHVybiBGO1xuXHQgICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG5cdCAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG5cdCAgICBpZihJU19QUk9UTykoZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSkpW2tleV0gPSBvdXQ7XG5cdCAgfVxuXHR9O1xuXHQvLyB0eXBlIGJpdG1hcFxuXHQkZXhwb3J0LkYgPSAxOyAgLy8gZm9yY2VkXG5cdCRleHBvcnQuRyA9IDI7ICAvLyBnbG9iYWxcblx0JGV4cG9ydC5TID0gNDsgIC8vIHN0YXRpY1xuXHQkZXhwb3J0LlAgPSA4OyAgLy8gcHJvdG9cblx0JGV4cG9ydC5CID0gMTY7IC8vIGJpbmRcblx0JGV4cG9ydC5XID0gMzI7IC8vIHdyYXBcblx0bW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuXG4vKioqLyB9KSxcbi8qIDI5ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcblx0dmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG5cdCAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHRpZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG4vKioqLyB9KSxcbi8qIDMwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0dmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMS4yLjYnfTtcblx0aWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG5cbi8qKiovIH0pLFxuLyogMzEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcblx0dmFyIGFGdW5jdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oMzIpO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuXHQgIGFGdW5jdGlvbihmbik7XG5cdCAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcblx0ICBzd2l0Y2gobGVuZ3RoKXtcblx0ICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuXHQgICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcblx0ICAgIH07XG5cdCAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcblx0ICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG5cdCAgICB9O1xuXHQgICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG5cdCAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuXHQgICAgfTtcblx0ICB9XG5cdCAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuXHQgICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG5cdCAgfTtcblx0fTtcblxuLyoqKi8gfSksXG4vKiAzMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuXHQgIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG5cdCAgcmV0dXJuIGl0O1xuXHR9O1xuXG4vKioqLyB9KSxcbi8qIDMzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcblx0ICB0cnkge1xuXHQgICAgcmV0dXJuICEhZXhlYygpO1xuXHQgIH0gY2F0Y2goZSl7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cdH07XG5cbi8qKiovIH0pLFxuLyogMzQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24oZ2xvYmFsKSB7LyogZ2xvYmFsIHdpbmRvdyAqL1xuXHQndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHRleHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoSGFuZGxlYmFycykge1xuXHQgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgdmFyIHJvb3QgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdyxcblx0ICAgICAgJEhhbmRsZWJhcnMgPSByb290LkhhbmRsZWJhcnM7XG5cdCAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICBIYW5kbGViYXJzLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICBpZiAocm9vdC5IYW5kbGViYXJzID09PSBIYW5kbGViYXJzKSB7XG5cdCAgICAgIHJvb3QuSGFuZGxlYmFycyA9ICRIYW5kbGViYXJzO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIEhhbmRsZWJhcnM7XG5cdCAgfTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0oKSkpKVxuXG4vKioqLyB9KSxcbi8qIDM1ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cdHZhciBBU1QgPSB7XG5cdCAgLy8gUHVibGljIEFQSSB1c2VkIHRvIGV2YWx1YXRlIGRlcml2ZWQgYXR0cmlidXRlcyByZWdhcmRpbmcgQVNUIG5vZGVzXG5cdCAgaGVscGVyczoge1xuXHQgICAgLy8gYSBtdXN0YWNoZSBpcyBkZWZpbml0ZWx5IGEgaGVscGVyIGlmOlxuXHQgICAgLy8gKiBpdCBpcyBhbiBlbGlnaWJsZSBoZWxwZXIsIGFuZFxuXHQgICAgLy8gKiBpdCBoYXMgYXQgbGVhc3Qgb25lIHBhcmFtZXRlciBvciBoYXNoIHNlZ21lbnRcblx0ICAgIGhlbHBlckV4cHJlc3Npb246IGZ1bmN0aW9uIGhlbHBlckV4cHJlc3Npb24obm9kZSkge1xuXHQgICAgICByZXR1cm4gbm9kZS50eXBlID09PSAnU3ViRXhwcmVzc2lvbicgfHwgKG5vZGUudHlwZSA9PT0gJ011c3RhY2hlU3RhdGVtZW50JyB8fCBub2RlLnR5cGUgPT09ICdCbG9ja1N0YXRlbWVudCcpICYmICEhKG5vZGUucGFyYW1zICYmIG5vZGUucGFyYW1zLmxlbmd0aCB8fCBub2RlLmhhc2gpO1xuXHQgICAgfSxcblxuXHQgICAgc2NvcGVkSWQ6IGZ1bmN0aW9uIHNjb3BlZElkKHBhdGgpIHtcblx0ICAgICAgcmV0dXJuICgvXlxcLnx0aGlzXFxiLy50ZXN0KHBhdGgub3JpZ2luYWwpXG5cdCAgICAgICk7XG5cdCAgICB9LFxuXG5cdCAgICAvLyBhbiBJRCBpcyBzaW1wbGUgaWYgaXQgb25seSBoYXMgb25lIHBhcnQsIGFuZCB0aGF0IHBhcnQgaXMgbm90XG5cdCAgICAvLyBgLi5gIG9yIGB0aGlzYC5cblx0ICAgIHNpbXBsZUlkOiBmdW5jdGlvbiBzaW1wbGVJZChwYXRoKSB7XG5cdCAgICAgIHJldHVybiBwYXRoLnBhcnRzLmxlbmd0aCA9PT0gMSAmJiAhQVNULmhlbHBlcnMuc2NvcGVkSWQocGF0aCkgJiYgIXBhdGguZGVwdGg7XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXG5cdC8vIE11c3QgYmUgZXhwb3J0ZWQgYXMgYW4gb2JqZWN0IHJhdGhlciB0aGFuIHRoZSByb290IG9mIHRoZSBtb2R1bGUgYXMgdGhlIGppc29uIGxleGVyXG5cdC8vIG11c3QgbW9kaWZ5IHRoZSBvYmplY3QgdG8gb3BlcmF0ZSBwcm9wZXJseS5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gQVNUO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfSksXG4vKiAzNiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuXG5cdHZhciBfcGFyc2VyID0gX193ZWJwYWNrX3JlcXVpcmVfXygzNyk7XG5cblx0dmFyIF9wYXJzZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGFyc2VyKTtcblxuXHR2YXIgX3doaXRlc3BhY2VDb250cm9sID0gX193ZWJwYWNrX3JlcXVpcmVfXygzOCk7XG5cblx0dmFyIF93aGl0ZXNwYWNlQ29udHJvbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93aGl0ZXNwYWNlQ29udHJvbCk7XG5cblx0dmFyIF9oZWxwZXJzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0MCk7XG5cblx0dmFyIEhlbHBlcnMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfaGVscGVycyk7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0ZXhwb3J0cy5wYXJzZXIgPSBfcGFyc2VyMlsnZGVmYXVsdCddO1xuXG5cdHZhciB5eSA9IHt9O1xuXHRfdXRpbHMuZXh0ZW5kKHl5LCBIZWxwZXJzKTtcblxuXHRmdW5jdGlvbiBwYXJzZShpbnB1dCwgb3B0aW9ucykge1xuXHQgIC8vIEp1c3QgcmV0dXJuIGlmIGFuIGFscmVhZHktY29tcGlsZWQgQVNUIHdhcyBwYXNzZWQgaW4uXG5cdCAgaWYgKGlucHV0LnR5cGUgPT09ICdQcm9ncmFtJykge1xuXHQgICAgcmV0dXJuIGlucHV0O1xuXHQgIH1cblxuXHQgIF9wYXJzZXIyWydkZWZhdWx0J10ueXkgPSB5eTtcblxuXHQgIC8vIEFsdGVyaW5nIHRoZSBzaGFyZWQgb2JqZWN0IGhlcmUsIGJ1dCB0aGlzIGlzIG9rIGFzIHBhcnNlciBpcyBhIHN5bmMgb3BlcmF0aW9uXG5cdCAgeXkubG9jSW5mbyA9IGZ1bmN0aW9uIChsb2NJbmZvKSB7XG5cdCAgICByZXR1cm4gbmV3IHl5LlNvdXJjZUxvY2F0aW9uKG9wdGlvbnMgJiYgb3B0aW9ucy5zcmNOYW1lLCBsb2NJbmZvKTtcblx0ICB9O1xuXG5cdCAgdmFyIHN0cmlwID0gbmV3IF93aGl0ZXNwYWNlQ29udHJvbDJbJ2RlZmF1bHQnXShvcHRpb25zKTtcblx0ICByZXR1cm4gc3RyaXAuYWNjZXB0KF9wYXJzZXIyWydkZWZhdWx0J10ucGFyc2UoaW5wdXQpKTtcblx0fVxuXG4vKioqLyB9KSxcbi8qIDM3ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0Ly8gRmlsZSBpZ25vcmVkIGluIGNvdmVyYWdlIHRlc3RzIHZpYSBzZXR0aW5nIGluIC5pc3RhbmJ1bC55bWxcblx0LyogSmlzb24gZ2VuZXJhdGVkIHBhcnNlciAqL1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHR2YXIgaGFuZGxlYmFycyA9IChmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgcGFyc2VyID0geyB0cmFjZTogZnVuY3Rpb24gdHJhY2UoKSB7fSxcblx0ICAgICAgICB5eToge30sXG5cdCAgICAgICAgc3ltYm9sc186IHsgXCJlcnJvclwiOiAyLCBcInJvb3RcIjogMywgXCJwcm9ncmFtXCI6IDQsIFwiRU9GXCI6IDUsIFwicHJvZ3JhbV9yZXBldGl0aW9uMFwiOiA2LCBcInN0YXRlbWVudFwiOiA3LCBcIm11c3RhY2hlXCI6IDgsIFwiYmxvY2tcIjogOSwgXCJyYXdCbG9ja1wiOiAxMCwgXCJwYXJ0aWFsXCI6IDExLCBcInBhcnRpYWxCbG9ja1wiOiAxMiwgXCJjb250ZW50XCI6IDEzLCBcIkNPTU1FTlRcIjogMTQsIFwiQ09OVEVOVFwiOiAxNSwgXCJvcGVuUmF3QmxvY2tcIjogMTYsIFwicmF3QmxvY2tfcmVwZXRpdGlvbl9wbHVzMFwiOiAxNywgXCJFTkRfUkFXX0JMT0NLXCI6IDE4LCBcIk9QRU5fUkFXX0JMT0NLXCI6IDE5LCBcImhlbHBlck5hbWVcIjogMjAsIFwib3BlblJhd0Jsb2NrX3JlcGV0aXRpb24wXCI6IDIxLCBcIm9wZW5SYXdCbG9ja19vcHRpb24wXCI6IDIyLCBcIkNMT1NFX1JBV19CTE9DS1wiOiAyMywgXCJvcGVuQmxvY2tcIjogMjQsIFwiYmxvY2tfb3B0aW9uMFwiOiAyNSwgXCJjbG9zZUJsb2NrXCI6IDI2LCBcIm9wZW5JbnZlcnNlXCI6IDI3LCBcImJsb2NrX29wdGlvbjFcIjogMjgsIFwiT1BFTl9CTE9DS1wiOiAyOSwgXCJvcGVuQmxvY2tfcmVwZXRpdGlvbjBcIjogMzAsIFwib3BlbkJsb2NrX29wdGlvbjBcIjogMzEsIFwib3BlbkJsb2NrX29wdGlvbjFcIjogMzIsIFwiQ0xPU0VcIjogMzMsIFwiT1BFTl9JTlZFUlNFXCI6IDM0LCBcIm9wZW5JbnZlcnNlX3JlcGV0aXRpb24wXCI6IDM1LCBcIm9wZW5JbnZlcnNlX29wdGlvbjBcIjogMzYsIFwib3BlbkludmVyc2Vfb3B0aW9uMVwiOiAzNywgXCJvcGVuSW52ZXJzZUNoYWluXCI6IDM4LCBcIk9QRU5fSU5WRVJTRV9DSEFJTlwiOiAzOSwgXCJvcGVuSW52ZXJzZUNoYWluX3JlcGV0aXRpb24wXCI6IDQwLCBcIm9wZW5JbnZlcnNlQ2hhaW5fb3B0aW9uMFwiOiA0MSwgXCJvcGVuSW52ZXJzZUNoYWluX29wdGlvbjFcIjogNDIsIFwiaW52ZXJzZUFuZFByb2dyYW1cIjogNDMsIFwiSU5WRVJTRVwiOiA0NCwgXCJpbnZlcnNlQ2hhaW5cIjogNDUsIFwiaW52ZXJzZUNoYWluX29wdGlvbjBcIjogNDYsIFwiT1BFTl9FTkRCTE9DS1wiOiA0NywgXCJPUEVOXCI6IDQ4LCBcIm11c3RhY2hlX3JlcGV0aXRpb24wXCI6IDQ5LCBcIm11c3RhY2hlX29wdGlvbjBcIjogNTAsIFwiT1BFTl9VTkVTQ0FQRURcIjogNTEsIFwibXVzdGFjaGVfcmVwZXRpdGlvbjFcIjogNTIsIFwibXVzdGFjaGVfb3B0aW9uMVwiOiA1MywgXCJDTE9TRV9VTkVTQ0FQRURcIjogNTQsIFwiT1BFTl9QQVJUSUFMXCI6IDU1LCBcInBhcnRpYWxOYW1lXCI6IDU2LCBcInBhcnRpYWxfcmVwZXRpdGlvbjBcIjogNTcsIFwicGFydGlhbF9vcHRpb24wXCI6IDU4LCBcIm9wZW5QYXJ0aWFsQmxvY2tcIjogNTksIFwiT1BFTl9QQVJUSUFMX0JMT0NLXCI6IDYwLCBcIm9wZW5QYXJ0aWFsQmxvY2tfcmVwZXRpdGlvbjBcIjogNjEsIFwib3BlblBhcnRpYWxCbG9ja19vcHRpb24wXCI6IDYyLCBcInBhcmFtXCI6IDYzLCBcInNleHByXCI6IDY0LCBcIk9QRU5fU0VYUFJcIjogNjUsIFwic2V4cHJfcmVwZXRpdGlvbjBcIjogNjYsIFwic2V4cHJfb3B0aW9uMFwiOiA2NywgXCJDTE9TRV9TRVhQUlwiOiA2OCwgXCJoYXNoXCI6IDY5LCBcImhhc2hfcmVwZXRpdGlvbl9wbHVzMFwiOiA3MCwgXCJoYXNoU2VnbWVudFwiOiA3MSwgXCJJRFwiOiA3MiwgXCJFUVVBTFNcIjogNzMsIFwiYmxvY2tQYXJhbXNcIjogNzQsIFwiT1BFTl9CTE9DS19QQVJBTVNcIjogNzUsIFwiYmxvY2tQYXJhbXNfcmVwZXRpdGlvbl9wbHVzMFwiOiA3NiwgXCJDTE9TRV9CTE9DS19QQVJBTVNcIjogNzcsIFwicGF0aFwiOiA3OCwgXCJkYXRhTmFtZVwiOiA3OSwgXCJTVFJJTkdcIjogODAsIFwiTlVNQkVSXCI6IDgxLCBcIkJPT0xFQU5cIjogODIsIFwiVU5ERUZJTkVEXCI6IDgzLCBcIk5VTExcIjogODQsIFwiREFUQVwiOiA4NSwgXCJwYXRoU2VnbWVudHNcIjogODYsIFwiU0VQXCI6IDg3LCBcIiRhY2NlcHRcIjogMCwgXCIkZW5kXCI6IDEgfSxcblx0ICAgICAgICB0ZXJtaW5hbHNfOiB7IDI6IFwiZXJyb3JcIiwgNTogXCJFT0ZcIiwgMTQ6IFwiQ09NTUVOVFwiLCAxNTogXCJDT05URU5UXCIsIDE4OiBcIkVORF9SQVdfQkxPQ0tcIiwgMTk6IFwiT1BFTl9SQVdfQkxPQ0tcIiwgMjM6IFwiQ0xPU0VfUkFXX0JMT0NLXCIsIDI5OiBcIk9QRU5fQkxPQ0tcIiwgMzM6IFwiQ0xPU0VcIiwgMzQ6IFwiT1BFTl9JTlZFUlNFXCIsIDM5OiBcIk9QRU5fSU5WRVJTRV9DSEFJTlwiLCA0NDogXCJJTlZFUlNFXCIsIDQ3OiBcIk9QRU5fRU5EQkxPQ0tcIiwgNDg6IFwiT1BFTlwiLCA1MTogXCJPUEVOX1VORVNDQVBFRFwiLCA1NDogXCJDTE9TRV9VTkVTQ0FQRURcIiwgNTU6IFwiT1BFTl9QQVJUSUFMXCIsIDYwOiBcIk9QRU5fUEFSVElBTF9CTE9DS1wiLCA2NTogXCJPUEVOX1NFWFBSXCIsIDY4OiBcIkNMT1NFX1NFWFBSXCIsIDcyOiBcIklEXCIsIDczOiBcIkVRVUFMU1wiLCA3NTogXCJPUEVOX0JMT0NLX1BBUkFNU1wiLCA3NzogXCJDTE9TRV9CTE9DS19QQVJBTVNcIiwgODA6IFwiU1RSSU5HXCIsIDgxOiBcIk5VTUJFUlwiLCA4MjogXCJCT09MRUFOXCIsIDgzOiBcIlVOREVGSU5FRFwiLCA4NDogXCJOVUxMXCIsIDg1OiBcIkRBVEFcIiwgODc6IFwiU0VQXCIgfSxcblx0ICAgICAgICBwcm9kdWN0aW9uc186IFswLCBbMywgMl0sIFs0LCAxXSwgWzcsIDFdLCBbNywgMV0sIFs3LCAxXSwgWzcsIDFdLCBbNywgMV0sIFs3LCAxXSwgWzcsIDFdLCBbMTMsIDFdLCBbMTAsIDNdLCBbMTYsIDVdLCBbOSwgNF0sIFs5LCA0XSwgWzI0LCA2XSwgWzI3LCA2XSwgWzM4LCA2XSwgWzQzLCAyXSwgWzQ1LCAzXSwgWzQ1LCAxXSwgWzI2LCAzXSwgWzgsIDVdLCBbOCwgNV0sIFsxMSwgNV0sIFsxMiwgM10sIFs1OSwgNV0sIFs2MywgMV0sIFs2MywgMV0sIFs2NCwgNV0sIFs2OSwgMV0sIFs3MSwgM10sIFs3NCwgM10sIFsyMCwgMV0sIFsyMCwgMV0sIFsyMCwgMV0sIFsyMCwgMV0sIFsyMCwgMV0sIFsyMCwgMV0sIFsyMCwgMV0sIFs1NiwgMV0sIFs1NiwgMV0sIFs3OSwgMl0sIFs3OCwgMV0sIFs4NiwgM10sIFs4NiwgMV0sIFs2LCAwXSwgWzYsIDJdLCBbMTcsIDFdLCBbMTcsIDJdLCBbMjEsIDBdLCBbMjEsIDJdLCBbMjIsIDBdLCBbMjIsIDFdLCBbMjUsIDBdLCBbMjUsIDFdLCBbMjgsIDBdLCBbMjgsIDFdLCBbMzAsIDBdLCBbMzAsIDJdLCBbMzEsIDBdLCBbMzEsIDFdLCBbMzIsIDBdLCBbMzIsIDFdLCBbMzUsIDBdLCBbMzUsIDJdLCBbMzYsIDBdLCBbMzYsIDFdLCBbMzcsIDBdLCBbMzcsIDFdLCBbNDAsIDBdLCBbNDAsIDJdLCBbNDEsIDBdLCBbNDEsIDFdLCBbNDIsIDBdLCBbNDIsIDFdLCBbNDYsIDBdLCBbNDYsIDFdLCBbNDksIDBdLCBbNDksIDJdLCBbNTAsIDBdLCBbNTAsIDFdLCBbNTIsIDBdLCBbNTIsIDJdLCBbNTMsIDBdLCBbNTMsIDFdLCBbNTcsIDBdLCBbNTcsIDJdLCBbNTgsIDBdLCBbNTgsIDFdLCBbNjEsIDBdLCBbNjEsIDJdLCBbNjIsIDBdLCBbNjIsIDFdLCBbNjYsIDBdLCBbNjYsIDJdLCBbNjcsIDBdLCBbNjcsIDFdLCBbNzAsIDFdLCBbNzAsIDJdLCBbNzYsIDFdLCBbNzYsIDJdXSxcblx0ICAgICAgICBwZXJmb3JtQWN0aW9uOiBmdW5jdGlvbiBhbm9ueW1vdXMoeXl0ZXh0LCB5eWxlbmcsIHl5bGluZW5vLCB5eSwgeXlzdGF0ZSwgJCQsIF8kXG5cdCAgICAgICAgLyoqLykge1xuXG5cdCAgICAgICAgICAgIHZhciAkMCA9ICQkLmxlbmd0aCAtIDE7XG5cdCAgICAgICAgICAgIHN3aXRjaCAoeXlzdGF0ZSkge1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAkJFskMCAtIDFdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVQcm9ncmFtKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA3OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgODpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDk6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0ge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnQ29tbWVudFN0YXRlbWVudCcsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB5eS5zdHJpcENvbW1lbnQoJCRbJDBdKSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RyaXA6IHl5LnN0cmlwRmxhZ3MoJCRbJDBdLCAkJFskMF0pLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBsb2M6IHl5LmxvY0luZm8odGhpcy5fJClcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEwOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0NvbnRlbnRTdGF0ZW1lbnQnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogJCRbJDBdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJCRbJDBdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBsb2M6IHl5LmxvY0luZm8odGhpcy5fJClcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDExOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVSYXdCbG9jaygkJFskMCAtIDJdLCAkJFskMCAtIDFdLCAkJFskMF0sIHRoaXMuXyQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHBhdGg6ICQkWyQwIC0gM10sIHBhcmFtczogJCRbJDAgLSAyXSwgaGFzaDogJCRbJDAgLSAxXSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMzpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB5eS5wcmVwYXJlQmxvY2soJCRbJDAgLSAzXSwgJCRbJDAgLSAyXSwgJCRbJDAgLSAxXSwgJCRbJDBdLCBmYWxzZSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE0OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVCbG9jaygkJFskMCAtIDNdLCAkJFskMCAtIDJdLCAkJFskMCAtIDFdLCAkJFskMF0sIHRydWUsIHRoaXMuXyQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxNTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IG9wZW46ICQkWyQwIC0gNV0sIHBhdGg6ICQkWyQwIC0gNF0sIHBhcmFtczogJCRbJDAgLSAzXSwgaGFzaDogJCRbJDAgLSAyXSwgYmxvY2tQYXJhbXM6ICQkWyQwIC0gMV0sIHN0cmlwOiB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gNV0sICQkWyQwXSkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyBwYXRoOiAkJFskMCAtIDRdLCBwYXJhbXM6ICQkWyQwIC0gM10sIGhhc2g6ICQkWyQwIC0gMl0sIGJsb2NrUGFyYW1zOiAkJFskMCAtIDFdLCBzdHJpcDogeXkuc3RyaXBGbGFncygkJFskMCAtIDVdLCAkJFskMF0pIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE3OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgcGF0aDogJCRbJDAgLSA0XSwgcGFyYW1zOiAkJFskMCAtIDNdLCBoYXNoOiAkJFskMCAtIDJdLCBibG9ja1BhcmFtczogJCRbJDAgLSAxXSwgc3RyaXA6IHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSA1XSwgJCRbJDBdKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxODpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHN0cmlwOiB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gMV0sICQkWyQwIC0gMV0pLCBwcm9ncmFtOiAkJFskMF0gfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTk6XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGludmVyc2UgPSB5eS5wcmVwYXJlQmxvY2soJCRbJDAgLSAyXSwgJCRbJDAgLSAxXSwgJCRbJDBdLCAkJFskMF0sIGZhbHNlLCB0aGlzLl8kKSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3JhbSA9IHl5LnByZXBhcmVQcm9ncmFtKFtpbnZlcnNlXSwgJCRbJDAgLSAxXS5sb2MpO1xuXHQgICAgICAgICAgICAgICAgICAgIHByb2dyYW0uY2hhaW5lZCA9IHRydWU7XG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHN0cmlwOiAkJFskMCAtIDJdLnN0cmlwLCBwcm9ncmFtOiBwcm9ncmFtLCBjaGFpbjogdHJ1ZSB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIwOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjE6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyBwYXRoOiAkJFskMCAtIDFdLCBzdHJpcDogeXkuc3RyaXBGbGFncygkJFskMCAtIDJdLCAkJFskMF0pIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIyOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVNdXN0YWNoZSgkJFskMCAtIDNdLCAkJFskMCAtIDJdLCAkJFskMCAtIDFdLCAkJFskMCAtIDRdLCB5eS5zdHJpcEZsYWdzKCQkWyQwIC0gNF0sICQkWyQwXSksIHRoaXMuXyQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyMzpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB5eS5wcmVwYXJlTXVzdGFjaGUoJCRbJDAgLSAzXSwgJCRbJDAgLSAyXSwgJCRbJDAgLSAxXSwgJCRbJDAgLSA0XSwgeXkuc3RyaXBGbGFncygkJFskMCAtIDRdLCAkJFskMF0pLCB0aGlzLl8kKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjQ6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0ge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUGFydGlhbFN0YXRlbWVudCcsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICQkWyQwIC0gM10sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczogJCRbJDAgLSAyXSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaGFzaDogJCRbJDAgLSAxXSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50OiAnJyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RyaXA6IHl5LnN0cmlwRmxhZ3MoJCRbJDAgLSA0XSwgJCRbJDBdKSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpXG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyNTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB5eS5wcmVwYXJlUGFydGlhbEJsb2NrKCQkWyQwIC0gMl0sICQkWyQwIC0gMV0sICQkWyQwXSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI2OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgcGF0aDogJCRbJDAgLSAzXSwgcGFyYW1zOiAkJFskMCAtIDJdLCBoYXNoOiAkJFskMCAtIDFdLCBzdHJpcDogeXkuc3RyaXBGbGFncygkJFskMCAtIDRdLCAkJFskMF0pIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI3OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjg6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyOTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdTdWJFeHByZXNzaW9uJyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJCRbJDAgLSAzXSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiAkJFskMCAtIDJdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBoYXNoOiAkJFskMCAtIDFdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBsb2M6IHl5LmxvY0luZm8odGhpcy5fJClcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDMwOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgdHlwZTogJ0hhc2gnLCBwYWlyczogJCRbJDBdLCBsb2M6IHl5LmxvY0luZm8odGhpcy5fJCkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzE6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geyB0eXBlOiAnSGFzaFBhaXInLCBrZXk6IHl5LmlkKCQkWyQwIC0gMl0pLCB2YWx1ZTogJCRbJDBdLCBsb2M6IHl5LmxvY0luZm8odGhpcy5fJCkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzI6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0geXkuaWQoJCRbJDAgLSAxXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDMzOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzQ6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzNTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHR5cGU6ICdTdHJpbmdMaXRlcmFsJywgdmFsdWU6ICQkWyQwXSwgb3JpZ2luYWw6ICQkWyQwXSwgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM2OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgdHlwZTogJ051bWJlckxpdGVyYWwnLCB2YWx1ZTogTnVtYmVyKCQkWyQwXSksIG9yaWdpbmFsOiBOdW1iZXIoJCRbJDBdKSwgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM3OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgdHlwZTogJ0Jvb2xlYW5MaXRlcmFsJywgdmFsdWU6ICQkWyQwXSA9PT0gJ3RydWUnLCBvcmlnaW5hbDogJCRbJDBdID09PSAndHJ1ZScsIGxvYzogeXkubG9jSW5mbyh0aGlzLl8kKSB9O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzODpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSB7IHR5cGU6ICdVbmRlZmluZWRMaXRlcmFsJywgb3JpZ2luYWw6IHVuZGVmaW5lZCwgdmFsdWU6IHVuZGVmaW5lZCwgbG9jOiB5eS5sb2NJbmZvKHRoaXMuXyQpIH07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM5OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHsgdHlwZTogJ051bGxMaXRlcmFsJywgb3JpZ2luYWw6IG51bGwsIHZhbHVlOiBudWxsLCBsb2M6IHl5LmxvY0luZm8odGhpcy5fJCkgfTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0MTpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSAkJFskMF07XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQyOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVQYXRoKHRydWUsICQkWyQwXSwgdGhpcy5fJCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQzOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IHl5LnByZXBhcmVQYXRoKGZhbHNlLCAkJFskMF0sIHRoaXMuXyQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0NDpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDJdLnB1c2goeyBwYXJ0OiB5eS5pZCgkJFskMF0pLCBvcmlnaW5hbDogJCRbJDBdLCBzZXBhcmF0b3I6ICQkWyQwIC0gMV0gfSk7dGhpcy4kID0gJCRbJDAgLSAyXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDU6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW3sgcGFydDogeXkuaWQoJCRbJDBdKSwgb3JpZ2luYWw6ICQkWyQwXSB9XTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDY6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQ3OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0ODpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbJCRbJDBdXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDk6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDUwOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA1MTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNTg6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDU5OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA2NDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNjU6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDcwOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA3MTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNzg6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDc5OlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA4Mjpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgODM6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDg2OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFtdO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA4Nzpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy4kID0gW107XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDkxOlxuXHQgICAgICAgICAgICAgICAgICAgICQkWyQwIC0gMV0ucHVzaCgkJFskMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA5NDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLiQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgOTU6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDk4OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFskJFskMF1dO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA5OTpcblx0ICAgICAgICAgICAgICAgICAgICAkJFskMCAtIDFdLnB1c2goJCRbJDBdKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTAwOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuJCA9IFskJFskMF1dO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMDE6XG5cdCAgICAgICAgICAgICAgICAgICAgJCRbJDAgLSAxXS5wdXNoKCQkWyQwXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9LFxuXHQgICAgICAgIHRhYmxlOiBbeyAzOiAxLCA0OiAyLCA1OiBbMiwgNDZdLCA2OiAzLCAxNDogWzIsIDQ2XSwgMTU6IFsyLCA0Nl0sIDE5OiBbMiwgNDZdLCAyOTogWzIsIDQ2XSwgMzQ6IFsyLCA0Nl0sIDQ4OiBbMiwgNDZdLCA1MTogWzIsIDQ2XSwgNTU6IFsyLCA0Nl0sIDYwOiBbMiwgNDZdIH0sIHsgMTogWzNdIH0sIHsgNTogWzEsIDRdIH0sIHsgNTogWzIsIDJdLCA3OiA1LCA4OiA2LCA5OiA3LCAxMDogOCwgMTE6IDksIDEyOiAxMCwgMTM6IDExLCAxNDogWzEsIDEyXSwgMTU6IFsxLCAyMF0sIDE2OiAxNywgMTk6IFsxLCAyM10sIDI0OiAxNSwgMjc6IDE2LCAyOTogWzEsIDIxXSwgMzQ6IFsxLCAyMl0sIDM5OiBbMiwgMl0sIDQ0OiBbMiwgMl0sIDQ3OiBbMiwgMl0sIDQ4OiBbMSwgMTNdLCA1MTogWzEsIDE0XSwgNTU6IFsxLCAxOF0sIDU5OiAxOSwgNjA6IFsxLCAyNF0gfSwgeyAxOiBbMiwgMV0gfSwgeyA1OiBbMiwgNDddLCAxNDogWzIsIDQ3XSwgMTU6IFsyLCA0N10sIDE5OiBbMiwgNDddLCAyOTogWzIsIDQ3XSwgMzQ6IFsyLCA0N10sIDM5OiBbMiwgNDddLCA0NDogWzIsIDQ3XSwgNDc6IFsyLCA0N10sIDQ4OiBbMiwgNDddLCA1MTogWzIsIDQ3XSwgNTU6IFsyLCA0N10sIDYwOiBbMiwgNDddIH0sIHsgNTogWzIsIDNdLCAxNDogWzIsIDNdLCAxNTogWzIsIDNdLCAxOTogWzIsIDNdLCAyOTogWzIsIDNdLCAzNDogWzIsIDNdLCAzOTogWzIsIDNdLCA0NDogWzIsIDNdLCA0NzogWzIsIDNdLCA0ODogWzIsIDNdLCA1MTogWzIsIDNdLCA1NTogWzIsIDNdLCA2MDogWzIsIDNdIH0sIHsgNTogWzIsIDRdLCAxNDogWzIsIDRdLCAxNTogWzIsIDRdLCAxOTogWzIsIDRdLCAyOTogWzIsIDRdLCAzNDogWzIsIDRdLCAzOTogWzIsIDRdLCA0NDogWzIsIDRdLCA0NzogWzIsIDRdLCA0ODogWzIsIDRdLCA1MTogWzIsIDRdLCA1NTogWzIsIDRdLCA2MDogWzIsIDRdIH0sIHsgNTogWzIsIDVdLCAxNDogWzIsIDVdLCAxNTogWzIsIDVdLCAxOTogWzIsIDVdLCAyOTogWzIsIDVdLCAzNDogWzIsIDVdLCAzOTogWzIsIDVdLCA0NDogWzIsIDVdLCA0NzogWzIsIDVdLCA0ODogWzIsIDVdLCA1MTogWzIsIDVdLCA1NTogWzIsIDVdLCA2MDogWzIsIDVdIH0sIHsgNTogWzIsIDZdLCAxNDogWzIsIDZdLCAxNTogWzIsIDZdLCAxOTogWzIsIDZdLCAyOTogWzIsIDZdLCAzNDogWzIsIDZdLCAzOTogWzIsIDZdLCA0NDogWzIsIDZdLCA0NzogWzIsIDZdLCA0ODogWzIsIDZdLCA1MTogWzIsIDZdLCA1NTogWzIsIDZdLCA2MDogWzIsIDZdIH0sIHsgNTogWzIsIDddLCAxNDogWzIsIDddLCAxNTogWzIsIDddLCAxOTogWzIsIDddLCAyOTogWzIsIDddLCAzNDogWzIsIDddLCAzOTogWzIsIDddLCA0NDogWzIsIDddLCA0NzogWzIsIDddLCA0ODogWzIsIDddLCA1MTogWzIsIDddLCA1NTogWzIsIDddLCA2MDogWzIsIDddIH0sIHsgNTogWzIsIDhdLCAxNDogWzIsIDhdLCAxNTogWzIsIDhdLCAxOTogWzIsIDhdLCAyOTogWzIsIDhdLCAzNDogWzIsIDhdLCAzOTogWzIsIDhdLCA0NDogWzIsIDhdLCA0NzogWzIsIDhdLCA0ODogWzIsIDhdLCA1MTogWzIsIDhdLCA1NTogWzIsIDhdLCA2MDogWzIsIDhdIH0sIHsgNTogWzIsIDldLCAxNDogWzIsIDldLCAxNTogWzIsIDldLCAxOTogWzIsIDldLCAyOTogWzIsIDldLCAzNDogWzIsIDldLCAzOTogWzIsIDldLCA0NDogWzIsIDldLCA0NzogWzIsIDldLCA0ODogWzIsIDldLCA1MTogWzIsIDldLCA1NTogWzIsIDldLCA2MDogWzIsIDldIH0sIHsgMjA6IDI1LCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDIwOiAzNiwgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyA0OiAzNywgNjogMywgMTQ6IFsyLCA0Nl0sIDE1OiBbMiwgNDZdLCAxOTogWzIsIDQ2XSwgMjk6IFsyLCA0Nl0sIDM0OiBbMiwgNDZdLCAzOTogWzIsIDQ2XSwgNDQ6IFsyLCA0Nl0sIDQ3OiBbMiwgNDZdLCA0ODogWzIsIDQ2XSwgNTE6IFsyLCA0Nl0sIDU1OiBbMiwgNDZdLCA2MDogWzIsIDQ2XSB9LCB7IDQ6IDM4LCA2OiAzLCAxNDogWzIsIDQ2XSwgMTU6IFsyLCA0Nl0sIDE5OiBbMiwgNDZdLCAyOTogWzIsIDQ2XSwgMzQ6IFsyLCA0Nl0sIDQ0OiBbMiwgNDZdLCA0NzogWzIsIDQ2XSwgNDg6IFsyLCA0Nl0sIDUxOiBbMiwgNDZdLCA1NTogWzIsIDQ2XSwgNjA6IFsyLCA0Nl0gfSwgeyAxMzogNDAsIDE1OiBbMSwgMjBdLCAxNzogMzkgfSwgeyAyMDogNDIsIDU2OiA0MSwgNjQ6IDQzLCA2NTogWzEsIDQ0XSwgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyA0OiA0NSwgNjogMywgMTQ6IFsyLCA0Nl0sIDE1OiBbMiwgNDZdLCAxOTogWzIsIDQ2XSwgMjk6IFsyLCA0Nl0sIDM0OiBbMiwgNDZdLCA0NzogWzIsIDQ2XSwgNDg6IFsyLCA0Nl0sIDUxOiBbMiwgNDZdLCA1NTogWzIsIDQ2XSwgNjA6IFsyLCA0Nl0gfSwgeyA1OiBbMiwgMTBdLCAxNDogWzIsIDEwXSwgMTU6IFsyLCAxMF0sIDE4OiBbMiwgMTBdLCAxOTogWzIsIDEwXSwgMjk6IFsyLCAxMF0sIDM0OiBbMiwgMTBdLCAzOTogWzIsIDEwXSwgNDQ6IFsyLCAxMF0sIDQ3OiBbMiwgMTBdLCA0ODogWzIsIDEwXSwgNTE6IFsyLCAxMF0sIDU1OiBbMiwgMTBdLCA2MDogWzIsIDEwXSB9LCB7IDIwOiA0NiwgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyMDogNDcsIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDQ4LCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDIwOiA0MiwgNTY6IDQ5LCA2NDogNDMsIDY1OiBbMSwgNDRdLCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDMzOiBbMiwgNzhdLCA0OTogNTAsIDY1OiBbMiwgNzhdLCA3MjogWzIsIDc4XSwgODA6IFsyLCA3OF0sIDgxOiBbMiwgNzhdLCA4MjogWzIsIDc4XSwgODM6IFsyLCA3OF0sIDg0OiBbMiwgNzhdLCA4NTogWzIsIDc4XSB9LCB7IDIzOiBbMiwgMzNdLCAzMzogWzIsIDMzXSwgNTQ6IFsyLCAzM10sIDY1OiBbMiwgMzNdLCA2ODogWzIsIDMzXSwgNzI6IFsyLCAzM10sIDc1OiBbMiwgMzNdLCA4MDogWzIsIDMzXSwgODE6IFsyLCAzM10sIDgyOiBbMiwgMzNdLCA4MzogWzIsIDMzXSwgODQ6IFsyLCAzM10sIDg1OiBbMiwgMzNdIH0sIHsgMjM6IFsyLCAzNF0sIDMzOiBbMiwgMzRdLCA1NDogWzIsIDM0XSwgNjU6IFsyLCAzNF0sIDY4OiBbMiwgMzRdLCA3MjogWzIsIDM0XSwgNzU6IFsyLCAzNF0sIDgwOiBbMiwgMzRdLCA4MTogWzIsIDM0XSwgODI6IFsyLCAzNF0sIDgzOiBbMiwgMzRdLCA4NDogWzIsIDM0XSwgODU6IFsyLCAzNF0gfSwgeyAyMzogWzIsIDM1XSwgMzM6IFsyLCAzNV0sIDU0OiBbMiwgMzVdLCA2NTogWzIsIDM1XSwgNjg6IFsyLCAzNV0sIDcyOiBbMiwgMzVdLCA3NTogWzIsIDM1XSwgODA6IFsyLCAzNV0sIDgxOiBbMiwgMzVdLCA4MjogWzIsIDM1XSwgODM6IFsyLCAzNV0sIDg0OiBbMiwgMzVdLCA4NTogWzIsIDM1XSB9LCB7IDIzOiBbMiwgMzZdLCAzMzogWzIsIDM2XSwgNTQ6IFsyLCAzNl0sIDY1OiBbMiwgMzZdLCA2ODogWzIsIDM2XSwgNzI6IFsyLCAzNl0sIDc1OiBbMiwgMzZdLCA4MDogWzIsIDM2XSwgODE6IFsyLCAzNl0sIDgyOiBbMiwgMzZdLCA4MzogWzIsIDM2XSwgODQ6IFsyLCAzNl0sIDg1OiBbMiwgMzZdIH0sIHsgMjM6IFsyLCAzN10sIDMzOiBbMiwgMzddLCA1NDogWzIsIDM3XSwgNjU6IFsyLCAzN10sIDY4OiBbMiwgMzddLCA3MjogWzIsIDM3XSwgNzU6IFsyLCAzN10sIDgwOiBbMiwgMzddLCA4MTogWzIsIDM3XSwgODI6IFsyLCAzN10sIDgzOiBbMiwgMzddLCA4NDogWzIsIDM3XSwgODU6IFsyLCAzN10gfSwgeyAyMzogWzIsIDM4XSwgMzM6IFsyLCAzOF0sIDU0OiBbMiwgMzhdLCA2NTogWzIsIDM4XSwgNjg6IFsyLCAzOF0sIDcyOiBbMiwgMzhdLCA3NTogWzIsIDM4XSwgODA6IFsyLCAzOF0sIDgxOiBbMiwgMzhdLCA4MjogWzIsIDM4XSwgODM6IFsyLCAzOF0sIDg0OiBbMiwgMzhdLCA4NTogWzIsIDM4XSB9LCB7IDIzOiBbMiwgMzldLCAzMzogWzIsIDM5XSwgNTQ6IFsyLCAzOV0sIDY1OiBbMiwgMzldLCA2ODogWzIsIDM5XSwgNzI6IFsyLCAzOV0sIDc1OiBbMiwgMzldLCA4MDogWzIsIDM5XSwgODE6IFsyLCAzOV0sIDgyOiBbMiwgMzldLCA4MzogWzIsIDM5XSwgODQ6IFsyLCAzOV0sIDg1OiBbMiwgMzldIH0sIHsgMjM6IFsyLCA0M10sIDMzOiBbMiwgNDNdLCA1NDogWzIsIDQzXSwgNjU6IFsyLCA0M10sIDY4OiBbMiwgNDNdLCA3MjogWzIsIDQzXSwgNzU6IFsyLCA0M10sIDgwOiBbMiwgNDNdLCA4MTogWzIsIDQzXSwgODI6IFsyLCA0M10sIDgzOiBbMiwgNDNdLCA4NDogWzIsIDQzXSwgODU6IFsyLCA0M10sIDg3OiBbMSwgNTFdIH0sIHsgNzI6IFsxLCAzNV0sIDg2OiA1MiB9LCB7IDIzOiBbMiwgNDVdLCAzMzogWzIsIDQ1XSwgNTQ6IFsyLCA0NV0sIDY1OiBbMiwgNDVdLCA2ODogWzIsIDQ1XSwgNzI6IFsyLCA0NV0sIDc1OiBbMiwgNDVdLCA4MDogWzIsIDQ1XSwgODE6IFsyLCA0NV0sIDgyOiBbMiwgNDVdLCA4MzogWzIsIDQ1XSwgODQ6IFsyLCA0NV0sIDg1OiBbMiwgNDVdLCA4NzogWzIsIDQ1XSB9LCB7IDUyOiA1MywgNTQ6IFsyLCA4Ml0sIDY1OiBbMiwgODJdLCA3MjogWzIsIDgyXSwgODA6IFsyLCA4Ml0sIDgxOiBbMiwgODJdLCA4MjogWzIsIDgyXSwgODM6IFsyLCA4Ml0sIDg0OiBbMiwgODJdLCA4NTogWzIsIDgyXSB9LCB7IDI1OiA1NCwgMzg6IDU2LCAzOTogWzEsIDU4XSwgNDM6IDU3LCA0NDogWzEsIDU5XSwgNDU6IDU1LCA0NzogWzIsIDU0XSB9LCB7IDI4OiA2MCwgNDM6IDYxLCA0NDogWzEsIDU5XSwgNDc6IFsyLCA1Nl0gfSwgeyAxMzogNjMsIDE1OiBbMSwgMjBdLCAxODogWzEsIDYyXSB9LCB7IDE1OiBbMiwgNDhdLCAxODogWzIsIDQ4XSB9LCB7IDMzOiBbMiwgODZdLCA1NzogNjQsIDY1OiBbMiwgODZdLCA3MjogWzIsIDg2XSwgODA6IFsyLCA4Nl0sIDgxOiBbMiwgODZdLCA4MjogWzIsIDg2XSwgODM6IFsyLCA4Nl0sIDg0OiBbMiwgODZdLCA4NTogWzIsIDg2XSB9LCB7IDMzOiBbMiwgNDBdLCA2NTogWzIsIDQwXSwgNzI6IFsyLCA0MF0sIDgwOiBbMiwgNDBdLCA4MTogWzIsIDQwXSwgODI6IFsyLCA0MF0sIDgzOiBbMiwgNDBdLCA4NDogWzIsIDQwXSwgODU6IFsyLCA0MF0gfSwgeyAzMzogWzIsIDQxXSwgNjU6IFsyLCA0MV0sIDcyOiBbMiwgNDFdLCA4MDogWzIsIDQxXSwgODE6IFsyLCA0MV0sIDgyOiBbMiwgNDFdLCA4MzogWzIsIDQxXSwgODQ6IFsyLCA0MV0sIDg1OiBbMiwgNDFdIH0sIHsgMjA6IDY1LCA3MjogWzEsIDM1XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDI2OiA2NiwgNDc6IFsxLCA2N10gfSwgeyAzMDogNjgsIDMzOiBbMiwgNThdLCA2NTogWzIsIDU4XSwgNzI6IFsyLCA1OF0sIDc1OiBbMiwgNThdLCA4MDogWzIsIDU4XSwgODE6IFsyLCA1OF0sIDgyOiBbMiwgNThdLCA4MzogWzIsIDU4XSwgODQ6IFsyLCA1OF0sIDg1OiBbMiwgNThdIH0sIHsgMzM6IFsyLCA2NF0sIDM1OiA2OSwgNjU6IFsyLCA2NF0sIDcyOiBbMiwgNjRdLCA3NTogWzIsIDY0XSwgODA6IFsyLCA2NF0sIDgxOiBbMiwgNjRdLCA4MjogWzIsIDY0XSwgODM6IFsyLCA2NF0sIDg0OiBbMiwgNjRdLCA4NTogWzIsIDY0XSB9LCB7IDIxOiA3MCwgMjM6IFsyLCA1MF0sIDY1OiBbMiwgNTBdLCA3MjogWzIsIDUwXSwgODA6IFsyLCA1MF0sIDgxOiBbMiwgNTBdLCA4MjogWzIsIDUwXSwgODM6IFsyLCA1MF0sIDg0OiBbMiwgNTBdLCA4NTogWzIsIDUwXSB9LCB7IDMzOiBbMiwgOTBdLCA2MTogNzEsIDY1OiBbMiwgOTBdLCA3MjogWzIsIDkwXSwgODA6IFsyLCA5MF0sIDgxOiBbMiwgOTBdLCA4MjogWzIsIDkwXSwgODM6IFsyLCA5MF0sIDg0OiBbMiwgOTBdLCA4NTogWzIsIDkwXSB9LCB7IDIwOiA3NSwgMzM6IFsyLCA4MF0sIDUwOiA3MiwgNjM6IDczLCA2NDogNzYsIDY1OiBbMSwgNDRdLCA2OTogNzQsIDcwOiA3NywgNzE6IDc4LCA3MjogWzEsIDc5XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDcyOiBbMSwgODBdIH0sIHsgMjM6IFsyLCA0Ml0sIDMzOiBbMiwgNDJdLCA1NDogWzIsIDQyXSwgNjU6IFsyLCA0Ml0sIDY4OiBbMiwgNDJdLCA3MjogWzIsIDQyXSwgNzU6IFsyLCA0Ml0sIDgwOiBbMiwgNDJdLCA4MTogWzIsIDQyXSwgODI6IFsyLCA0Ml0sIDgzOiBbMiwgNDJdLCA4NDogWzIsIDQyXSwgODU6IFsyLCA0Ml0sIDg3OiBbMSwgNTFdIH0sIHsgMjA6IDc1LCA1MzogODEsIDU0OiBbMiwgODRdLCA2MzogODIsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY5OiA4MywgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjY6IDg0LCA0NzogWzEsIDY3XSB9LCB7IDQ3OiBbMiwgNTVdIH0sIHsgNDogODUsIDY6IDMsIDE0OiBbMiwgNDZdLCAxNTogWzIsIDQ2XSwgMTk6IFsyLCA0Nl0sIDI5OiBbMiwgNDZdLCAzNDogWzIsIDQ2XSwgMzk6IFsyLCA0Nl0sIDQ0OiBbMiwgNDZdLCA0NzogWzIsIDQ2XSwgNDg6IFsyLCA0Nl0sIDUxOiBbMiwgNDZdLCA1NTogWzIsIDQ2XSwgNjA6IFsyLCA0Nl0gfSwgeyA0NzogWzIsIDIwXSB9LCB7IDIwOiA4NiwgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyA0OiA4NywgNjogMywgMTQ6IFsyLCA0Nl0sIDE1OiBbMiwgNDZdLCAxOTogWzIsIDQ2XSwgMjk6IFsyLCA0Nl0sIDM0OiBbMiwgNDZdLCA0NzogWzIsIDQ2XSwgNDg6IFsyLCA0Nl0sIDUxOiBbMiwgNDZdLCA1NTogWzIsIDQ2XSwgNjA6IFsyLCA0Nl0gfSwgeyAyNjogODgsIDQ3OiBbMSwgNjddIH0sIHsgNDc6IFsyLCA1N10gfSwgeyA1OiBbMiwgMTFdLCAxNDogWzIsIDExXSwgMTU6IFsyLCAxMV0sIDE5OiBbMiwgMTFdLCAyOTogWzIsIDExXSwgMzQ6IFsyLCAxMV0sIDM5OiBbMiwgMTFdLCA0NDogWzIsIDExXSwgNDc6IFsyLCAxMV0sIDQ4OiBbMiwgMTFdLCA1MTogWzIsIDExXSwgNTU6IFsyLCAxMV0sIDYwOiBbMiwgMTFdIH0sIHsgMTU6IFsyLCA0OV0sIDE4OiBbMiwgNDldIH0sIHsgMjA6IDc1LCAzMzogWzIsIDg4XSwgNTg6IDg5LCA2MzogOTAsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY5OiA5MSwgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgNjU6IFsyLCA5NF0sIDY2OiA5MiwgNjg6IFsyLCA5NF0sIDcyOiBbMiwgOTRdLCA4MDogWzIsIDk0XSwgODE6IFsyLCA5NF0sIDgyOiBbMiwgOTRdLCA4MzogWzIsIDk0XSwgODQ6IFsyLCA5NF0sIDg1OiBbMiwgOTRdIH0sIHsgNTogWzIsIDI1XSwgMTQ6IFsyLCAyNV0sIDE1OiBbMiwgMjVdLCAxOTogWzIsIDI1XSwgMjk6IFsyLCAyNV0sIDM0OiBbMiwgMjVdLCAzOTogWzIsIDI1XSwgNDQ6IFsyLCAyNV0sIDQ3OiBbMiwgMjVdLCA0ODogWzIsIDI1XSwgNTE6IFsyLCAyNV0sIDU1OiBbMiwgMjVdLCA2MDogWzIsIDI1XSB9LCB7IDIwOiA5MywgNzI6IFsxLCAzNV0sIDc4OiAyNiwgNzk6IDI3LCA4MDogWzEsIDI4XSwgODE6IFsxLCAyOV0sIDgyOiBbMSwgMzBdLCA4MzogWzEsIDMxXSwgODQ6IFsxLCAzMl0sIDg1OiBbMSwgMzRdLCA4NjogMzMgfSwgeyAyMDogNzUsIDMxOiA5NCwgMzM6IFsyLCA2MF0sIDYzOiA5NSwgNjQ6IDc2LCA2NTogWzEsIDQ0XSwgNjk6IDk2LCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc1OiBbMiwgNjBdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMjA6IDc1LCAzMzogWzIsIDY2XSwgMzY6IDk3LCA2MzogOTgsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY5OiA5OSwgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3NTogWzIsIDY2XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDIwOiA3NSwgMjI6IDEwMCwgMjM6IFsyLCA1Ml0sIDYzOiAxMDEsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY5OiAxMDIsIDcwOiA3NywgNzE6IDc4LCA3MjogWzEsIDc5XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDIwOiA3NSwgMzM6IFsyLCA5Ml0sIDYyOiAxMDMsIDYzOiAxMDQsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDY5OiAxMDUsIDcwOiA3NywgNzE6IDc4LCA3MjogWzEsIDc5XSwgNzg6IDI2LCA3OTogMjcsIDgwOiBbMSwgMjhdLCA4MTogWzEsIDI5XSwgODI6IFsxLCAzMF0sIDgzOiBbMSwgMzFdLCA4NDogWzEsIDMyXSwgODU6IFsxLCAzNF0sIDg2OiAzMyB9LCB7IDMzOiBbMSwgMTA2XSB9LCB7IDMzOiBbMiwgNzldLCA2NTogWzIsIDc5XSwgNzI6IFsyLCA3OV0sIDgwOiBbMiwgNzldLCA4MTogWzIsIDc5XSwgODI6IFsyLCA3OV0sIDgzOiBbMiwgNzldLCA4NDogWzIsIDc5XSwgODU6IFsyLCA3OV0gfSwgeyAzMzogWzIsIDgxXSB9LCB7IDIzOiBbMiwgMjddLCAzMzogWzIsIDI3XSwgNTQ6IFsyLCAyN10sIDY1OiBbMiwgMjddLCA2ODogWzIsIDI3XSwgNzI6IFsyLCAyN10sIDc1OiBbMiwgMjddLCA4MDogWzIsIDI3XSwgODE6IFsyLCAyN10sIDgyOiBbMiwgMjddLCA4MzogWzIsIDI3XSwgODQ6IFsyLCAyN10sIDg1OiBbMiwgMjddIH0sIHsgMjM6IFsyLCAyOF0sIDMzOiBbMiwgMjhdLCA1NDogWzIsIDI4XSwgNjU6IFsyLCAyOF0sIDY4OiBbMiwgMjhdLCA3MjogWzIsIDI4XSwgNzU6IFsyLCAyOF0sIDgwOiBbMiwgMjhdLCA4MTogWzIsIDI4XSwgODI6IFsyLCAyOF0sIDgzOiBbMiwgMjhdLCA4NDogWzIsIDI4XSwgODU6IFsyLCAyOF0gfSwgeyAyMzogWzIsIDMwXSwgMzM6IFsyLCAzMF0sIDU0OiBbMiwgMzBdLCA2ODogWzIsIDMwXSwgNzE6IDEwNywgNzI6IFsxLCAxMDhdLCA3NTogWzIsIDMwXSB9LCB7IDIzOiBbMiwgOThdLCAzMzogWzIsIDk4XSwgNTQ6IFsyLCA5OF0sIDY4OiBbMiwgOThdLCA3MjogWzIsIDk4XSwgNzU6IFsyLCA5OF0gfSwgeyAyMzogWzIsIDQ1XSwgMzM6IFsyLCA0NV0sIDU0OiBbMiwgNDVdLCA2NTogWzIsIDQ1XSwgNjg6IFsyLCA0NV0sIDcyOiBbMiwgNDVdLCA3MzogWzEsIDEwOV0sIDc1OiBbMiwgNDVdLCA4MDogWzIsIDQ1XSwgODE6IFsyLCA0NV0sIDgyOiBbMiwgNDVdLCA4MzogWzIsIDQ1XSwgODQ6IFsyLCA0NV0sIDg1OiBbMiwgNDVdLCA4NzogWzIsIDQ1XSB9LCB7IDIzOiBbMiwgNDRdLCAzMzogWzIsIDQ0XSwgNTQ6IFsyLCA0NF0sIDY1OiBbMiwgNDRdLCA2ODogWzIsIDQ0XSwgNzI6IFsyLCA0NF0sIDc1OiBbMiwgNDRdLCA4MDogWzIsIDQ0XSwgODE6IFsyLCA0NF0sIDgyOiBbMiwgNDRdLCA4MzogWzIsIDQ0XSwgODQ6IFsyLCA0NF0sIDg1OiBbMiwgNDRdLCA4NzogWzIsIDQ0XSB9LCB7IDU0OiBbMSwgMTEwXSB9LCB7IDU0OiBbMiwgODNdLCA2NTogWzIsIDgzXSwgNzI6IFsyLCA4M10sIDgwOiBbMiwgODNdLCA4MTogWzIsIDgzXSwgODI6IFsyLCA4M10sIDgzOiBbMiwgODNdLCA4NDogWzIsIDgzXSwgODU6IFsyLCA4M10gfSwgeyA1NDogWzIsIDg1XSB9LCB7IDU6IFsyLCAxM10sIDE0OiBbMiwgMTNdLCAxNTogWzIsIDEzXSwgMTk6IFsyLCAxM10sIDI5OiBbMiwgMTNdLCAzNDogWzIsIDEzXSwgMzk6IFsyLCAxM10sIDQ0OiBbMiwgMTNdLCA0NzogWzIsIDEzXSwgNDg6IFsyLCAxM10sIDUxOiBbMiwgMTNdLCA1NTogWzIsIDEzXSwgNjA6IFsyLCAxM10gfSwgeyAzODogNTYsIDM5OiBbMSwgNThdLCA0MzogNTcsIDQ0OiBbMSwgNTldLCA0NTogMTEyLCA0NjogMTExLCA0NzogWzIsIDc2XSB9LCB7IDMzOiBbMiwgNzBdLCA0MDogMTEzLCA2NTogWzIsIDcwXSwgNzI6IFsyLCA3MF0sIDc1OiBbMiwgNzBdLCA4MDogWzIsIDcwXSwgODE6IFsyLCA3MF0sIDgyOiBbMiwgNzBdLCA4MzogWzIsIDcwXSwgODQ6IFsyLCA3MF0sIDg1OiBbMiwgNzBdIH0sIHsgNDc6IFsyLCAxOF0gfSwgeyA1OiBbMiwgMTRdLCAxNDogWzIsIDE0XSwgMTU6IFsyLCAxNF0sIDE5OiBbMiwgMTRdLCAyOTogWzIsIDE0XSwgMzQ6IFsyLCAxNF0sIDM5OiBbMiwgMTRdLCA0NDogWzIsIDE0XSwgNDc6IFsyLCAxNF0sIDQ4OiBbMiwgMTRdLCA1MTogWzIsIDE0XSwgNTU6IFsyLCAxNF0sIDYwOiBbMiwgMTRdIH0sIHsgMzM6IFsxLCAxMTRdIH0sIHsgMzM6IFsyLCA4N10sIDY1OiBbMiwgODddLCA3MjogWzIsIDg3XSwgODA6IFsyLCA4N10sIDgxOiBbMiwgODddLCA4MjogWzIsIDg3XSwgODM6IFsyLCA4N10sIDg0OiBbMiwgODddLCA4NTogWzIsIDg3XSB9LCB7IDMzOiBbMiwgODldIH0sIHsgMjA6IDc1LCA2MzogMTE2LCA2NDogNzYsIDY1OiBbMSwgNDRdLCA2NzogMTE1LCA2ODogWzIsIDk2XSwgNjk6IDExNywgNzA6IDc3LCA3MTogNzgsIDcyOiBbMSwgNzldLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgMzM6IFsxLCAxMThdIH0sIHsgMzI6IDExOSwgMzM6IFsyLCA2Ml0sIDc0OiAxMjAsIDc1OiBbMSwgMTIxXSB9LCB7IDMzOiBbMiwgNTldLCA2NTogWzIsIDU5XSwgNzI6IFsyLCA1OV0sIDc1OiBbMiwgNTldLCA4MDogWzIsIDU5XSwgODE6IFsyLCA1OV0sIDgyOiBbMiwgNTldLCA4MzogWzIsIDU5XSwgODQ6IFsyLCA1OV0sIDg1OiBbMiwgNTldIH0sIHsgMzM6IFsyLCA2MV0sIDc1OiBbMiwgNjFdIH0sIHsgMzM6IFsyLCA2OF0sIDM3OiAxMjIsIDc0OiAxMjMsIDc1OiBbMSwgMTIxXSB9LCB7IDMzOiBbMiwgNjVdLCA2NTogWzIsIDY1XSwgNzI6IFsyLCA2NV0sIDc1OiBbMiwgNjVdLCA4MDogWzIsIDY1XSwgODE6IFsyLCA2NV0sIDgyOiBbMiwgNjVdLCA4MzogWzIsIDY1XSwgODQ6IFsyLCA2NV0sIDg1OiBbMiwgNjVdIH0sIHsgMzM6IFsyLCA2N10sIDc1OiBbMiwgNjddIH0sIHsgMjM6IFsxLCAxMjRdIH0sIHsgMjM6IFsyLCA1MV0sIDY1OiBbMiwgNTFdLCA3MjogWzIsIDUxXSwgODA6IFsyLCA1MV0sIDgxOiBbMiwgNTFdLCA4MjogWzIsIDUxXSwgODM6IFsyLCA1MV0sIDg0OiBbMiwgNTFdLCA4NTogWzIsIDUxXSB9LCB7IDIzOiBbMiwgNTNdIH0sIHsgMzM6IFsxLCAxMjVdIH0sIHsgMzM6IFsyLCA5MV0sIDY1OiBbMiwgOTFdLCA3MjogWzIsIDkxXSwgODA6IFsyLCA5MV0sIDgxOiBbMiwgOTFdLCA4MjogWzIsIDkxXSwgODM6IFsyLCA5MV0sIDg0OiBbMiwgOTFdLCA4NTogWzIsIDkxXSB9LCB7IDMzOiBbMiwgOTNdIH0sIHsgNTogWzIsIDIyXSwgMTQ6IFsyLCAyMl0sIDE1OiBbMiwgMjJdLCAxOTogWzIsIDIyXSwgMjk6IFsyLCAyMl0sIDM0OiBbMiwgMjJdLCAzOTogWzIsIDIyXSwgNDQ6IFsyLCAyMl0sIDQ3OiBbMiwgMjJdLCA0ODogWzIsIDIyXSwgNTE6IFsyLCAyMl0sIDU1OiBbMiwgMjJdLCA2MDogWzIsIDIyXSB9LCB7IDIzOiBbMiwgOTldLCAzMzogWzIsIDk5XSwgNTQ6IFsyLCA5OV0sIDY4OiBbMiwgOTldLCA3MjogWzIsIDk5XSwgNzU6IFsyLCA5OV0gfSwgeyA3MzogWzEsIDEwOV0gfSwgeyAyMDogNzUsIDYzOiAxMjYsIDY0OiA3NiwgNjU6IFsxLCA0NF0sIDcyOiBbMSwgMzVdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgNTogWzIsIDIzXSwgMTQ6IFsyLCAyM10sIDE1OiBbMiwgMjNdLCAxOTogWzIsIDIzXSwgMjk6IFsyLCAyM10sIDM0OiBbMiwgMjNdLCAzOTogWzIsIDIzXSwgNDQ6IFsyLCAyM10sIDQ3OiBbMiwgMjNdLCA0ODogWzIsIDIzXSwgNTE6IFsyLCAyM10sIDU1OiBbMiwgMjNdLCA2MDogWzIsIDIzXSB9LCB7IDQ3OiBbMiwgMTldIH0sIHsgNDc6IFsyLCA3N10gfSwgeyAyMDogNzUsIDMzOiBbMiwgNzJdLCA0MTogMTI3LCA2MzogMTI4LCA2NDogNzYsIDY1OiBbMSwgNDRdLCA2OTogMTI5LCA3MDogNzcsIDcxOiA3OCwgNzI6IFsxLCA3OV0sIDc1OiBbMiwgNzJdLCA3ODogMjYsIDc5OiAyNywgODA6IFsxLCAyOF0sIDgxOiBbMSwgMjldLCA4MjogWzEsIDMwXSwgODM6IFsxLCAzMV0sIDg0OiBbMSwgMzJdLCA4NTogWzEsIDM0XSwgODY6IDMzIH0sIHsgNTogWzIsIDI0XSwgMTQ6IFsyLCAyNF0sIDE1OiBbMiwgMjRdLCAxOTogWzIsIDI0XSwgMjk6IFsyLCAyNF0sIDM0OiBbMiwgMjRdLCAzOTogWzIsIDI0XSwgNDQ6IFsyLCAyNF0sIDQ3OiBbMiwgMjRdLCA0ODogWzIsIDI0XSwgNTE6IFsyLCAyNF0sIDU1OiBbMiwgMjRdLCA2MDogWzIsIDI0XSB9LCB7IDY4OiBbMSwgMTMwXSB9LCB7IDY1OiBbMiwgOTVdLCA2ODogWzIsIDk1XSwgNzI6IFsyLCA5NV0sIDgwOiBbMiwgOTVdLCA4MTogWzIsIDk1XSwgODI6IFsyLCA5NV0sIDgzOiBbMiwgOTVdLCA4NDogWzIsIDk1XSwgODU6IFsyLCA5NV0gfSwgeyA2ODogWzIsIDk3XSB9LCB7IDU6IFsyLCAyMV0sIDE0OiBbMiwgMjFdLCAxNTogWzIsIDIxXSwgMTk6IFsyLCAyMV0sIDI5OiBbMiwgMjFdLCAzNDogWzIsIDIxXSwgMzk6IFsyLCAyMV0sIDQ0OiBbMiwgMjFdLCA0NzogWzIsIDIxXSwgNDg6IFsyLCAyMV0sIDUxOiBbMiwgMjFdLCA1NTogWzIsIDIxXSwgNjA6IFsyLCAyMV0gfSwgeyAzMzogWzEsIDEzMV0gfSwgeyAzMzogWzIsIDYzXSB9LCB7IDcyOiBbMSwgMTMzXSwgNzY6IDEzMiB9LCB7IDMzOiBbMSwgMTM0XSB9LCB7IDMzOiBbMiwgNjldIH0sIHsgMTU6IFsyLCAxMl0gfSwgeyAxNDogWzIsIDI2XSwgMTU6IFsyLCAyNl0sIDE5OiBbMiwgMjZdLCAyOTogWzIsIDI2XSwgMzQ6IFsyLCAyNl0sIDQ3OiBbMiwgMjZdLCA0ODogWzIsIDI2XSwgNTE6IFsyLCAyNl0sIDU1OiBbMiwgMjZdLCA2MDogWzIsIDI2XSB9LCB7IDIzOiBbMiwgMzFdLCAzMzogWzIsIDMxXSwgNTQ6IFsyLCAzMV0sIDY4OiBbMiwgMzFdLCA3MjogWzIsIDMxXSwgNzU6IFsyLCAzMV0gfSwgeyAzMzogWzIsIDc0XSwgNDI6IDEzNSwgNzQ6IDEzNiwgNzU6IFsxLCAxMjFdIH0sIHsgMzM6IFsyLCA3MV0sIDY1OiBbMiwgNzFdLCA3MjogWzIsIDcxXSwgNzU6IFsyLCA3MV0sIDgwOiBbMiwgNzFdLCA4MTogWzIsIDcxXSwgODI6IFsyLCA3MV0sIDgzOiBbMiwgNzFdLCA4NDogWzIsIDcxXSwgODU6IFsyLCA3MV0gfSwgeyAzMzogWzIsIDczXSwgNzU6IFsyLCA3M10gfSwgeyAyMzogWzIsIDI5XSwgMzM6IFsyLCAyOV0sIDU0OiBbMiwgMjldLCA2NTogWzIsIDI5XSwgNjg6IFsyLCAyOV0sIDcyOiBbMiwgMjldLCA3NTogWzIsIDI5XSwgODA6IFsyLCAyOV0sIDgxOiBbMiwgMjldLCA4MjogWzIsIDI5XSwgODM6IFsyLCAyOV0sIDg0OiBbMiwgMjldLCA4NTogWzIsIDI5XSB9LCB7IDE0OiBbMiwgMTVdLCAxNTogWzIsIDE1XSwgMTk6IFsyLCAxNV0sIDI5OiBbMiwgMTVdLCAzNDogWzIsIDE1XSwgMzk6IFsyLCAxNV0sIDQ0OiBbMiwgMTVdLCA0NzogWzIsIDE1XSwgNDg6IFsyLCAxNV0sIDUxOiBbMiwgMTVdLCA1NTogWzIsIDE1XSwgNjA6IFsyLCAxNV0gfSwgeyA3MjogWzEsIDEzOF0sIDc3OiBbMSwgMTM3XSB9LCB7IDcyOiBbMiwgMTAwXSwgNzc6IFsyLCAxMDBdIH0sIHsgMTQ6IFsyLCAxNl0sIDE1OiBbMiwgMTZdLCAxOTogWzIsIDE2XSwgMjk6IFsyLCAxNl0sIDM0OiBbMiwgMTZdLCA0NDogWzIsIDE2XSwgNDc6IFsyLCAxNl0sIDQ4OiBbMiwgMTZdLCA1MTogWzIsIDE2XSwgNTU6IFsyLCAxNl0sIDYwOiBbMiwgMTZdIH0sIHsgMzM6IFsxLCAxMzldIH0sIHsgMzM6IFsyLCA3NV0gfSwgeyAzMzogWzIsIDMyXSB9LCB7IDcyOiBbMiwgMTAxXSwgNzc6IFsyLCAxMDFdIH0sIHsgMTQ6IFsyLCAxN10sIDE1OiBbMiwgMTddLCAxOTogWzIsIDE3XSwgMjk6IFsyLCAxN10sIDM0OiBbMiwgMTddLCAzOTogWzIsIDE3XSwgNDQ6IFsyLCAxN10sIDQ3OiBbMiwgMTddLCA0ODogWzIsIDE3XSwgNTE6IFsyLCAxN10sIDU1OiBbMiwgMTddLCA2MDogWzIsIDE3XSB9XSxcblx0ICAgICAgICBkZWZhdWx0QWN0aW9uczogeyA0OiBbMiwgMV0sIDU1OiBbMiwgNTVdLCA1NzogWzIsIDIwXSwgNjE6IFsyLCA1N10sIDc0OiBbMiwgODFdLCA4MzogWzIsIDg1XSwgODc6IFsyLCAxOF0sIDkxOiBbMiwgODldLCAxMDI6IFsyLCA1M10sIDEwNTogWzIsIDkzXSwgMTExOiBbMiwgMTldLCAxMTI6IFsyLCA3N10sIDExNzogWzIsIDk3XSwgMTIwOiBbMiwgNjNdLCAxMjM6IFsyLCA2OV0sIDEyNDogWzIsIDEyXSwgMTM2OiBbMiwgNzVdLCAxMzc6IFsyLCAzMl0gfSxcblx0ICAgICAgICBwYXJzZUVycm9yOiBmdW5jdGlvbiBwYXJzZUVycm9yKHN0ciwgaGFzaCkge1xuXHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RyKTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIHBhcnNlOiBmdW5jdGlvbiBwYXJzZShpbnB1dCkge1xuXHQgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG5cdCAgICAgICAgICAgICAgICBzdGFjayA9IFswXSxcblx0ICAgICAgICAgICAgICAgIHZzdGFjayA9IFtudWxsXSxcblx0ICAgICAgICAgICAgICAgIGxzdGFjayA9IFtdLFxuXHQgICAgICAgICAgICAgICAgdGFibGUgPSB0aGlzLnRhYmxlLFxuXHQgICAgICAgICAgICAgICAgeXl0ZXh0ID0gXCJcIixcblx0ICAgICAgICAgICAgICAgIHl5bGluZW5vID0gMCxcblx0ICAgICAgICAgICAgICAgIHl5bGVuZyA9IDAsXG5cdCAgICAgICAgICAgICAgICByZWNvdmVyaW5nID0gMCxcblx0ICAgICAgICAgICAgICAgIFRFUlJPUiA9IDIsXG5cdCAgICAgICAgICAgICAgICBFT0YgPSAxO1xuXHQgICAgICAgICAgICB0aGlzLmxleGVyLnNldElucHV0KGlucHV0KTtcblx0ICAgICAgICAgICAgdGhpcy5sZXhlci55eSA9IHRoaXMueXk7XG5cdCAgICAgICAgICAgIHRoaXMueXkubGV4ZXIgPSB0aGlzLmxleGVyO1xuXHQgICAgICAgICAgICB0aGlzLnl5LnBhcnNlciA9IHRoaXM7XG5cdCAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5sZXhlci55eWxsb2MgPT0gXCJ1bmRlZmluZWRcIikgdGhpcy5sZXhlci55eWxsb2MgPSB7fTtcblx0ICAgICAgICAgICAgdmFyIHl5bG9jID0gdGhpcy5sZXhlci55eWxsb2M7XG5cdCAgICAgICAgICAgIGxzdGFjay5wdXNoKHl5bG9jKTtcblx0ICAgICAgICAgICAgdmFyIHJhbmdlcyA9IHRoaXMubGV4ZXIub3B0aW9ucyAmJiB0aGlzLmxleGVyLm9wdGlvbnMucmFuZ2VzO1xuXHQgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMueXkucGFyc2VFcnJvciA9PT0gXCJmdW5jdGlvblwiKSB0aGlzLnBhcnNlRXJyb3IgPSB0aGlzLnl5LnBhcnNlRXJyb3I7XG5cdCAgICAgICAgICAgIGZ1bmN0aW9uIHBvcFN0YWNrKG4pIHtcblx0ICAgICAgICAgICAgICAgIHN0YWNrLmxlbmd0aCA9IHN0YWNrLmxlbmd0aCAtIDIgKiBuO1xuXHQgICAgICAgICAgICAgICAgdnN0YWNrLmxlbmd0aCA9IHZzdGFjay5sZW5ndGggLSBuO1xuXHQgICAgICAgICAgICAgICAgbHN0YWNrLmxlbmd0aCA9IGxzdGFjay5sZW5ndGggLSBuO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGZ1bmN0aW9uIGxleCgpIHtcblx0ICAgICAgICAgICAgICAgIHZhciB0b2tlbjtcblx0ICAgICAgICAgICAgICAgIHRva2VuID0gc2VsZi5sZXhlci5sZXgoKSB8fCAxO1xuXHQgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiAhPT0gXCJudW1iZXJcIikge1xuXHQgICAgICAgICAgICAgICAgICAgIHRva2VuID0gc2VsZi5zeW1ib2xzX1t0b2tlbl0gfHwgdG9rZW47XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgdmFyIHN5bWJvbCxcblx0ICAgICAgICAgICAgICAgIHByZUVycm9yU3ltYm9sLFxuXHQgICAgICAgICAgICAgICAgc3RhdGUsXG5cdCAgICAgICAgICAgICAgICBhY3Rpb24sXG5cdCAgICAgICAgICAgICAgICBhLFxuXHQgICAgICAgICAgICAgICAgcixcblx0ICAgICAgICAgICAgICAgIHl5dmFsID0ge30sXG5cdCAgICAgICAgICAgICAgICBwLFxuXHQgICAgICAgICAgICAgICAgbGVuLFxuXHQgICAgICAgICAgICAgICAgbmV3U3RhdGUsXG5cdCAgICAgICAgICAgICAgICBleHBlY3RlZDtcblx0ICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcblx0ICAgICAgICAgICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWZhdWx0QWN0aW9uc1tzdGF0ZV0pIHtcblx0ICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSB0aGlzLmRlZmF1bHRBY3Rpb25zW3N0YXRlXTtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHN5bWJvbCA9PT0gbnVsbCB8fCB0eXBlb2Ygc3ltYm9sID09IFwidW5kZWZpbmVkXCIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gbGV4KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IHRhYmxlW3N0YXRlXSAmJiB0YWJsZVtzdGF0ZV1bc3ltYm9sXTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSBcInVuZGVmaW5lZFwiIHx8ICFhY3Rpb24ubGVuZ3RoIHx8ICFhY3Rpb25bMF0pIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZXJyU3RyID0gXCJcIjtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXJlY292ZXJpbmcpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQgPSBbXTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChwIGluIHRhYmxlW3N0YXRlXSkgaWYgKHRoaXMudGVybWluYWxzX1twXSAmJiBwID4gMikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQucHVzaChcIidcIiArIHRoaXMudGVybWluYWxzX1twXSArIFwiJ1wiKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sZXhlci5zaG93UG9zaXRpb24pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyclN0ciA9IFwiUGFyc2UgZXJyb3Igb24gbGluZSBcIiArICh5eWxpbmVubyArIDEpICsgXCI6XFxuXCIgKyB0aGlzLmxleGVyLnNob3dQb3NpdGlvbigpICsgXCJcXG5FeHBlY3RpbmcgXCIgKyBleHBlY3RlZC5qb2luKFwiLCBcIikgKyBcIiwgZ290ICdcIiArICh0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wpICsgXCInXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJTdHIgPSBcIlBhcnNlIGVycm9yIG9uIGxpbmUgXCIgKyAoeXlsaW5lbm8gKyAxKSArIFwiOiBVbmV4cGVjdGVkIFwiICsgKHN5bWJvbCA9PSAxID8gXCJlbmQgb2YgaW5wdXRcIiA6IFwiJ1wiICsgKHRoaXMudGVybWluYWxzX1tzeW1ib2xdIHx8IHN5bWJvbCkgKyBcIidcIik7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZUVycm9yKGVyclN0ciwgeyB0ZXh0OiB0aGlzLmxleGVyLm1hdGNoLCB0b2tlbjogdGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sLCBsaW5lOiB0aGlzLmxleGVyLnl5bGluZW5vLCBsb2M6IHl5bG9jLCBleHBlY3RlZDogZXhwZWN0ZWQgfSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgaWYgKGFjdGlvblswXSBpbnN0YW5jZW9mIEFycmF5ICYmIGFjdGlvbi5sZW5ndGggPiAxKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFyc2UgRXJyb3I6IG11bHRpcGxlIGFjdGlvbnMgcG9zc2libGUgYXQgc3RhdGU6IFwiICsgc3RhdGUgKyBcIiwgdG9rZW46IFwiICsgc3ltYm9sKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIHN3aXRjaCAoYWN0aW9uWzBdKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN5bWJvbCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZzdGFjay5wdXNoKHRoaXMubGV4ZXIueXl0ZXh0KTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbHN0YWNrLnB1c2godGhpcy5sZXhlci55eWxsb2MpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGFjdGlvblsxXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcHJlRXJyb3JTeW1ib2wpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHl5bGVuZyA9IHRoaXMubGV4ZXIueXlsZW5nO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgeXl0ZXh0ID0gdGhpcy5sZXhlci55eXRleHQ7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB5eWxpbmVubyA9IHRoaXMubGV4ZXIueXlsaW5lbm87XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB5eWxvYyA9IHRoaXMubGV4ZXIueXlsbG9jO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY292ZXJpbmcgPiAwKSByZWNvdmVyaW5nLS07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBwcmVFcnJvclN5bWJvbDtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZUVycm9yU3ltYm9sID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxlbiA9IHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMV07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHl5dmFsLiQgPSB2c3RhY2tbdnN0YWNrLmxlbmd0aCAtIGxlbl07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHl5dmFsLl8kID0geyBmaXJzdF9saW5lOiBsc3RhY2tbbHN0YWNrLmxlbmd0aCAtIChsZW4gfHwgMSldLmZpcnN0X2xpbmUsIGxhc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5sYXN0X2xpbmUsIGZpcnN0X2NvbHVtbjogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAobGVuIHx8IDEpXS5maXJzdF9jb2x1bW4sIGxhc3RfY29sdW1uOiBsc3RhY2tbbHN0YWNrLmxlbmd0aCAtIDFdLmxhc3RfY29sdW1uIH07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyYW5nZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHl5dmFsLl8kLnJhbmdlID0gW2xzdGFja1tsc3RhY2subGVuZ3RoIC0gKGxlbiB8fCAxKV0ucmFuZ2VbMF0sIGxzdGFja1tsc3RhY2subGVuZ3RoIC0gMV0ucmFuZ2VbMV1dO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHIgPSB0aGlzLnBlcmZvcm1BY3Rpb24uY2FsbCh5eXZhbCwgeXl0ZXh0LCB5eWxlbmcsIHl5bGluZW5vLCB0aGlzLnl5LCBhY3Rpb25bMV0sIHZzdGFjaywgbHN0YWNrKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcjtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGVuKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFjayA9IHN0YWNrLnNsaWNlKDAsIC0xICogbGVuICogMik7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB2c3RhY2sgPSB2c3RhY2suc2xpY2UoMCwgLTEgKiBsZW4pO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgbHN0YWNrID0gbHN0YWNrLnNsaWNlKDAsIC0xICogbGVuKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMF0pO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2c3RhY2sucHVzaCh5eXZhbC4kKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbHN0YWNrLnB1c2goeXl2YWwuXyQpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGF0ZSA9IHRhYmxlW3N0YWNrW3N0YWNrLmxlbmd0aCAtIDJdXVtzdGFja1tzdGFjay5sZW5ndGggLSAxXV07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV3U3RhdGUpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdCAgICAvKiBKaXNvbiBnZW5lcmF0ZWQgbGV4ZXIgKi9cblx0ICAgIHZhciBsZXhlciA9IChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgdmFyIGxleGVyID0geyBFT0Y6IDEsXG5cdCAgICAgICAgICAgIHBhcnNlRXJyb3I6IGZ1bmN0aW9uIHBhcnNlRXJyb3Ioc3RyLCBoYXNoKSB7XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy55eS5wYXJzZXIpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5LnBhcnNlci5wYXJzZUVycm9yKHN0ciwgaGFzaCk7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzdHIpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBzZXRJbnB1dDogZnVuY3Rpb24gc2V0SW5wdXQoaW5wdXQpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG5cdCAgICAgICAgICAgICAgICB0aGlzLl9tb3JlID0gdGhpcy5fbGVzcyA9IHRoaXMuZG9uZSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgdGhpcy55eWxpbmVubyA9IHRoaXMueXlsZW5nID0gMDtcblx0ICAgICAgICAgICAgICAgIHRoaXMueXl0ZXh0ID0gdGhpcy5tYXRjaGVkID0gdGhpcy5tYXRjaCA9ICcnO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5jb25kaXRpb25TdGFjayA9IFsnSU5JVElBTCddO1xuXHQgICAgICAgICAgICAgICAgdGhpcy55eWxsb2MgPSB7IGZpcnN0X2xpbmU6IDEsIGZpcnN0X2NvbHVtbjogMCwgbGFzdF9saW5lOiAxLCBsYXN0X2NvbHVtbjogMCB9O1xuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHRoaXMueXlsbG9jLnJhbmdlID0gWzAsIDBdO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGlucHV0OiBmdW5jdGlvbiBpbnB1dCgpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBjaCA9IHRoaXMuX2lucHV0WzBdO1xuXHQgICAgICAgICAgICAgICAgdGhpcy55eXRleHQgKz0gY2g7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnl5bGVuZysrO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5vZmZzZXQrKztcblx0ICAgICAgICAgICAgICAgIHRoaXMubWF0Y2ggKz0gY2g7XG5cdCAgICAgICAgICAgICAgICB0aGlzLm1hdGNoZWQgKz0gY2g7XG5cdCAgICAgICAgICAgICAgICB2YXIgbGluZXMgPSBjaC5tYXRjaCgvKD86XFxyXFxuP3xcXG4pLiovZyk7XG5cdCAgICAgICAgICAgICAgICBpZiAobGluZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5bGluZW5vKys7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eWxsb2MubGFzdF9saW5lKys7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jLmxhc3RfY29sdW1uKys7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykgdGhpcy55eWxsb2MucmFuZ2VbMV0rKztcblxuXHQgICAgICAgICAgICAgICAgdGhpcy5faW5wdXQgPSB0aGlzLl9pbnB1dC5zbGljZSgxKTtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBjaDtcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgdW5wdXQ6IGZ1bmN0aW9uIHVucHV0KGNoKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgbGVuID0gY2gubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgdmFyIGxpbmVzID0gY2guc3BsaXQoLyg/Olxcclxcbj98XFxuKS9nKTtcblxuXHQgICAgICAgICAgICAgICAgdGhpcy5faW5wdXQgPSBjaCArIHRoaXMuX2lucHV0O1xuXHQgICAgICAgICAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLnl5dGV4dC5zdWJzdHIoMCwgdGhpcy55eXRleHQubGVuZ3RoIC0gbGVuIC0gMSk7XG5cdCAgICAgICAgICAgICAgICAvL3RoaXMueXlsZW5nIC09IGxlbjtcblx0ICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0IC09IGxlbjtcblx0ICAgICAgICAgICAgICAgIHZhciBvbGRMaW5lcyA9IHRoaXMubWF0Y2guc3BsaXQoLyg/Olxcclxcbj98XFxuKS9nKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMubWF0Y2ggPSB0aGlzLm1hdGNoLnN1YnN0cigwLCB0aGlzLm1hdGNoLmxlbmd0aCAtIDEpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5tYXRjaGVkID0gdGhpcy5tYXRjaGVkLnN1YnN0cigwLCB0aGlzLm1hdGNoZWQubGVuZ3RoIC0gMSk7XG5cblx0ICAgICAgICAgICAgICAgIGlmIChsaW5lcy5sZW5ndGggLSAxKSB0aGlzLnl5bGluZW5vIC09IGxpbmVzLmxlbmd0aCAtIDE7XG5cdCAgICAgICAgICAgICAgICB2YXIgciA9IHRoaXMueXlsbG9jLnJhbmdlO1xuXG5cdCAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYyA9IHsgZmlyc3RfbGluZTogdGhpcy55eWxsb2MuZmlyc3RfbGluZSxcblx0ICAgICAgICAgICAgICAgICAgICBsYXN0X2xpbmU6IHRoaXMueXlsaW5lbm8gKyAxLFxuXHQgICAgICAgICAgICAgICAgICAgIGZpcnN0X2NvbHVtbjogdGhpcy55eWxsb2MuZmlyc3RfY29sdW1uLFxuXHQgICAgICAgICAgICAgICAgICAgIGxhc3RfY29sdW1uOiBsaW5lcyA/IChsaW5lcy5sZW5ndGggPT09IG9sZExpbmVzLmxlbmd0aCA/IHRoaXMueXlsbG9jLmZpcnN0X2NvbHVtbiA6IDApICsgb2xkTGluZXNbb2xkTGluZXMubGVuZ3RoIC0gbGluZXMubGVuZ3RoXS5sZW5ndGggLSBsaW5lc1swXS5sZW5ndGggOiB0aGlzLnl5bGxvYy5maXJzdF9jb2x1bW4gLSBsZW5cblx0ICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZ2VzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eWxsb2MucmFuZ2UgPSBbclswXSwgclswXSArIHRoaXMueXlsZW5nIC0gbGVuXTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBtb3JlOiBmdW5jdGlvbiBtb3JlKCkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5fbW9yZSA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgbGVzczogZnVuY3Rpb24gbGVzcyhuKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnVucHV0KHRoaXMubWF0Y2guc2xpY2UobikpO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBwYXN0SW5wdXQ6IGZ1bmN0aW9uIHBhc3RJbnB1dCgpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBwYXN0ID0gdGhpcy5tYXRjaGVkLnN1YnN0cigwLCB0aGlzLm1hdGNoZWQubGVuZ3RoIC0gdGhpcy5tYXRjaC5sZW5ndGgpO1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIChwYXN0Lmxlbmd0aCA+IDIwID8gJy4uLicgOiAnJykgKyBwYXN0LnN1YnN0cigtMjApLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgdXBjb21pbmdJbnB1dDogZnVuY3Rpb24gdXBjb21pbmdJbnB1dCgpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gdGhpcy5tYXRjaDtcblx0ICAgICAgICAgICAgICAgIGlmIChuZXh0Lmxlbmd0aCA8IDIwKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgbmV4dCArPSB0aGlzLl9pbnB1dC5zdWJzdHIoMCwgMjAgLSBuZXh0Lmxlbmd0aCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gKG5leHQuc3Vic3RyKDAsIDIwKSArIChuZXh0Lmxlbmd0aCA+IDIwID8gJy4uLicgOiAnJykpLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgc2hvd1Bvc2l0aW9uOiBmdW5jdGlvbiBzaG93UG9zaXRpb24oKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgcHJlID0gdGhpcy5wYXN0SW5wdXQoKTtcblx0ICAgICAgICAgICAgICAgIHZhciBjID0gbmV3IEFycmF5KHByZS5sZW5ndGggKyAxKS5qb2luKFwiLVwiKTtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBwcmUgKyB0aGlzLnVwY29taW5nSW5wdXQoKSArIFwiXFxuXCIgKyBjICsgXCJeXCI7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uIG5leHQoKSB7XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5kb25lKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuRU9GO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pbnB1dCkgdGhpcy5kb25lID0gdHJ1ZTtcblxuXHQgICAgICAgICAgICAgICAgdmFyIHRva2VuLCBtYXRjaCwgdGVtcE1hdGNoLCBpbmRleCwgY29sLCBsaW5lcztcblx0ICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbW9yZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXl0ZXh0ID0gJyc7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRjaCA9ICcnO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5fY3VycmVudFJ1bGVzKCk7XG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGVtcE1hdGNoID0gdGhpcy5faW5wdXQubWF0Y2godGhpcy5ydWxlc1tydWxlc1tpXV0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0ZW1wTWF0Y2ggJiYgKCFtYXRjaCB8fCB0ZW1wTWF0Y2hbMF0ubGVuZ3RoID4gbWF0Y2hbMF0ubGVuZ3RoKSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHRlbXBNYXRjaDtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5mbGV4KSBicmVhaztcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcblx0ICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IG1hdGNoWzBdLm1hdGNoKC8oPzpcXHJcXG4/fFxcbikuKi9nKTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAobGluZXMpIHRoaXMueXlsaW5lbm8gKz0gbGluZXMubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jID0geyBmaXJzdF9saW5lOiB0aGlzLnl5bGxvYy5sYXN0X2xpbmUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfbGluZTogdGhpcy55eWxpbmVubyArIDEsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0X2NvbHVtbjogdGhpcy55eWxsb2MubGFzdF9jb2x1bW4sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfY29sdW1uOiBsaW5lcyA/IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLmxlbmd0aCAtIGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLm1hdGNoKC9cXHI/XFxuPy8pWzBdLmxlbmd0aCA6IHRoaXMueXlsbG9jLmxhc3RfY29sdW1uICsgbWF0Y2hbMF0ubGVuZ3RoIH07XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy55eXRleHQgKz0gbWF0Y2hbMF07XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRjaCArPSBtYXRjaFswXTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGNoZXMgPSBtYXRjaDtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnl5bGVuZyA9IHRoaXMueXl0ZXh0Lmxlbmd0aDtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYy5yYW5nZSA9IFt0aGlzLm9mZnNldCwgdGhpcy5vZmZzZXQgKz0gdGhpcy55eWxlbmddO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb3JlID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5wdXQgPSB0aGlzLl9pbnB1dC5zbGljZShtYXRjaFswXS5sZW5ndGgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlZCArPSBtYXRjaFswXTtcblx0ICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMucGVyZm9ybUFjdGlvbi5jYWxsKHRoaXMsIHRoaXMueXksIHRoaXMsIHJ1bGVzW2luZGV4XSwgdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDFdKTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kb25lICYmIHRoaXMuX2lucHV0KSB0aGlzLmRvbmUgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHJldHVybiB0b2tlbjtlbHNlIHJldHVybjtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbnB1dCA9PT0gXCJcIikge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLkVPRjtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VFcnJvcignTGV4aWNhbCBlcnJvciBvbiBsaW5lICcgKyAodGhpcy55eWxpbmVubyArIDEpICsgJy4gVW5yZWNvZ25pemVkIHRleHQuXFxuJyArIHRoaXMuc2hvd1Bvc2l0aW9uKCksIHsgdGV4dDogXCJcIiwgdG9rZW46IG51bGwsIGxpbmU6IHRoaXMueXlsaW5lbm8gfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGxleDogZnVuY3Rpb24gbGV4KCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIHIgPSB0aGlzLm5leHQoKTtcblx0ICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgciAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gcjtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGV4KCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGJlZ2luOiBmdW5jdGlvbiBiZWdpbihjb25kaXRpb24pIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sucHVzaChjb25kaXRpb24pO1xuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBwb3BTdGF0ZTogZnVuY3Rpb24gcG9wU3RhdGUoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFjay5wb3AoKTtcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2N1cnJlbnRSdWxlczogZnVuY3Rpb24gX2N1cnJlbnRSdWxlcygpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbnNbdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDFdXS5ydWxlcztcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgdG9wU3RhdGU6IGZ1bmN0aW9uIHRvcFN0YXRlKCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGggLSAyXTtcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgcHVzaFN0YXRlOiBmdW5jdGlvbiBiZWdpbihjb25kaXRpb24pIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuYmVnaW4oY29uZGl0aW9uKTtcblx0ICAgICAgICAgICAgfSB9O1xuXHQgICAgICAgIGxleGVyLm9wdGlvbnMgPSB7fTtcblx0ICAgICAgICBsZXhlci5wZXJmb3JtQWN0aW9uID0gZnVuY3Rpb24gYW5vbnltb3VzKHl5LCB5eV8sICRhdm9pZGluZ19uYW1lX2NvbGxpc2lvbnMsIFlZX1NUQVJUXG5cdCAgICAgICAgLyoqLykge1xuXG5cdCAgICAgICAgICAgIGZ1bmN0aW9uIHN0cmlwKHN0YXJ0LCBlbmQpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB5eV8ueXl0ZXh0ID0geXlfLnl5dGV4dC5zdWJzdHIoc3RhcnQsIHl5Xy55eWxlbmcgLSBlbmQpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdmFyIFlZU1RBVEUgPSBZWV9TVEFSVDtcblx0ICAgICAgICAgICAgc3dpdGNoICgkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zKSB7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDA6XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHl5Xy55eXRleHQuc2xpY2UoLTIpID09PSBcIlxcXFxcXFxcXCIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RyaXAoMCwgMSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmVnaW4oXCJtdVwiKTtcblx0ICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHl5Xy55eXRleHQuc2xpY2UoLTEpID09PSBcIlxcXFxcIikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdHJpcCgwLCAxKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpbihcImVtdVwiKTtcblx0ICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKFwibXVcIik7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgIGlmICh5eV8ueXl0ZXh0KSByZXR1cm4gMTU7XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTU7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzOlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuYmVnaW4oJ3JhdycpO3JldHVybiAxNTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDpcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gU2hvdWxkIGJlIHVzaW5nIGB0aGlzLnRvcFN0YXRlKClgIGJlbG93LCBidXQgaXQgY3VycmVudGx5XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJucyB0aGUgc2Vjb25kIHRvcCBpbnN0ZWFkIG9mIHRoZSBmaXJzdCB0b3AuIE9wZW5lZCBhblxuXHQgICAgICAgICAgICAgICAgICAgIC8vIGlzc3VlIGFib3V0IGl0IGF0IGh0dHBzOi8vZ2l0aHViLmNvbS96YWFjaC9qaXNvbi9pc3N1ZXMvMjkxXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGggLSAxXSA9PT0gJ3JhdycpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE1O1xuXHQgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHl5Xy55eXRleHQgPSB5eV8ueXl0ZXh0LnN1YnN0cig1LCB5eV8ueXlsZW5nIC0gOSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnRU5EX1JBV19CTE9DSyc7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDU6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE1O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA2OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTQ7XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNzpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNjU7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDg6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDY4O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA5OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAxOTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuYmVnaW4oJ3JhdycpO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAyMztcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxMTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNTU7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDEyOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA2MDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTM6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI5O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxNDpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNDc7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE1OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtyZXR1cm4gNDQ7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE2OlxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wU3RhdGUoKTtyZXR1cm4gNDQ7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE3OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAzNDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTg6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDM5O1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAxOTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNTE7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDIwOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA0ODtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjE6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy51bnB1dCh5eV8ueXl0ZXh0KTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcFN0YXRlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpbignY29tJyk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjI6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNDtcblxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyMzpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNDg7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI0OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA3Mztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjU6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDcyO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAyNjpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNzI7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI3OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA4Nztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjg6XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlIHdoaXRlc3BhY2Vcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjk6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO3JldHVybiA1NDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzA6XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO3JldHVybiAzMztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzE6XG5cdCAgICAgICAgICAgICAgICAgICAgeXlfLnl5dGV4dCA9IHN0cmlwKDEsIDIpLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKTtyZXR1cm4gODA7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDMyOlxuXHQgICAgICAgICAgICAgICAgICAgIHl5Xy55eXRleHQgPSBzdHJpcCgxLCAyKS5yZXBsYWNlKC9cXFxcJy9nLCBcIidcIik7cmV0dXJuIDgwO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzMzpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gODU7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM0OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA4Mjtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzU6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDgyO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzNjpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gODM7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM3OlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA4NDtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzg6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDgxO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSAzOTpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNzU7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDQwOlxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiA3Nztcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgNDE6XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDcyO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0Mjpcblx0ICAgICAgICAgICAgICAgICAgICB5eV8ueXl0ZXh0ID0geXlfLnl5dGV4dC5yZXBsYWNlKC9cXFxcKFtcXFxcXFxdXSkvZywgJyQxJyk7cmV0dXJuIDcyO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0Mzpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ0lOVkFMSUQnO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgY2FzZSA0NDpcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gNTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH07XG5cdCAgICAgICAgbGV4ZXIucnVsZXMgPSBbL14oPzpbXlxceDAwXSo/KD89KFxce1xceykpKS8sIC9eKD86W15cXHgwMF0rKS8sIC9eKD86W15cXHgwMF17Mix9Pyg/PShcXHtcXHt8XFxcXFxce1xce3xcXFxcXFxcXFxce1xce3wkKSkpLywgL14oPzpcXHtcXHtcXHtcXHsoPz1bXlxcL10pKS8sIC9eKD86XFx7XFx7XFx7XFx7XFwvW15cXHMhXCIjJS0sXFwuXFwvOy0+QFxcWy1cXF5gXFx7LX5dKyg/PVs9fVxcc1xcLy5dKVxcfVxcfVxcfVxcfSkvLCAvXig/OlteXFx4MDBdKj8oPz0oXFx7XFx7XFx7XFx7KSkpLywgL14oPzpbXFxzXFxTXSo/LS0ofik/XFx9XFx9KS8sIC9eKD86XFwoKS8sIC9eKD86XFwpKS8sIC9eKD86XFx7XFx7XFx7XFx7KS8sIC9eKD86XFx9XFx9XFx9XFx9KS8sIC9eKD86XFx7XFx7KH4pPz4pLywgL14oPzpcXHtcXHsofik/Iz4pLywgL14oPzpcXHtcXHsofik/I1xcKj8pLywgL14oPzpcXHtcXHsofik/XFwvKS8sIC9eKD86XFx7XFx7KH4pP1xcXlxccyoofik/XFx9XFx9KS8sIC9eKD86XFx7XFx7KH4pP1xccyplbHNlXFxzKih+KT9cXH1cXH0pLywgL14oPzpcXHtcXHsofik/XFxeKS8sIC9eKD86XFx7XFx7KH4pP1xccyplbHNlXFxiKS8sIC9eKD86XFx7XFx7KH4pP1xceykvLCAvXig/Olxce1xceyh+KT8mKS8sIC9eKD86XFx7XFx7KH4pPyEtLSkvLCAvXig/Olxce1xceyh+KT8hW1xcc1xcU10qP1xcfVxcfSkvLCAvXig/Olxce1xceyh+KT9cXCo/KS8sIC9eKD86PSkvLCAvXig/OlxcLlxcLikvLCAvXig/OlxcLig/PShbPX59XFxzXFwvLil8XSkpKS8sIC9eKD86W1xcLy5dKS8sIC9eKD86XFxzKykvLCAvXig/OlxcfSh+KT9cXH1cXH0pLywgL14oPzoofik/XFx9XFx9KS8sIC9eKD86XCIoXFxcXFtcIl18W15cIl0pKlwiKS8sIC9eKD86JyhcXFxcWyddfFteJ10pKicpLywgL14oPzpAKS8sIC9eKD86dHJ1ZSg/PShbfn1cXHMpXSkpKS8sIC9eKD86ZmFsc2UoPz0oW359XFxzKV0pKSkvLCAvXig/OnVuZGVmaW5lZCg/PShbfn1cXHMpXSkpKS8sIC9eKD86bnVsbCg/PShbfn1cXHMpXSkpKS8sIC9eKD86LT9bMC05XSsoPzpcXC5bMC05XSspPyg/PShbfn1cXHMpXSkpKS8sIC9eKD86YXNcXHMrXFx8KS8sIC9eKD86XFx8KS8sIC9eKD86KFteXFxzIVwiIyUtLFxcLlxcLzstPkBcXFstXFxeYFxcey1+XSsoPz0oWz1+fVxcc1xcLy4pfF0pKSkpLywgL14oPzpcXFsoXFxcXFxcXXxbXlxcXV0pKlxcXSkvLCAvXig/Oi4pLywgL14oPzokKS9dO1xuXHQgICAgICAgIGxleGVyLmNvbmRpdGlvbnMgPSB7IFwibXVcIjogeyBcInJ1bGVzXCI6IFs3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNiwgMTcsIDE4LCAxOSwgMjAsIDIxLCAyMiwgMjMsIDI0LCAyNSwgMjYsIDI3LCAyOCwgMjksIDMwLCAzMSwgMzIsIDMzLCAzNCwgMzUsIDM2LCAzNywgMzgsIDM5LCA0MCwgNDEsIDQyLCA0MywgNDRdLCBcImluY2x1c2l2ZVwiOiBmYWxzZSB9LCBcImVtdVwiOiB7IFwicnVsZXNcIjogWzJdLCBcImluY2x1c2l2ZVwiOiBmYWxzZSB9LCBcImNvbVwiOiB7IFwicnVsZXNcIjogWzZdLCBcImluY2x1c2l2ZVwiOiBmYWxzZSB9LCBcInJhd1wiOiB7IFwicnVsZXNcIjogWzMsIDQsIDVdLCBcImluY2x1c2l2ZVwiOiBmYWxzZSB9LCBcIklOSVRJQUxcIjogeyBcInJ1bGVzXCI6IFswLCAxLCA0NF0sIFwiaW5jbHVzaXZlXCI6IHRydWUgfSB9O1xuXHQgICAgICAgIHJldHVybiBsZXhlcjtcblx0ICAgIH0pKCk7XG5cdCAgICBwYXJzZXIubGV4ZXIgPSBsZXhlcjtcblx0ICAgIGZ1bmN0aW9uIFBhcnNlcigpIHtcblx0ICAgICAgICB0aGlzLnl5ID0ge307XG5cdCAgICB9UGFyc2VyLnByb3RvdHlwZSA9IHBhcnNlcjtwYXJzZXIuUGFyc2VyID0gUGFyc2VyO1xuXHQgICAgcmV0dXJuIG5ldyBQYXJzZXIoKTtcblx0fSkoKTtleHBvcnRzW1wiZGVmYXVsdFwiXSA9IGhhbmRsZWJhcnM7XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG5cbi8qKiovIH0pLFxuLyogMzggKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuXHR2YXIgX3Zpc2l0b3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM5KTtcblxuXHR2YXIgX3Zpc2l0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdmlzaXRvcik7XG5cblx0ZnVuY3Rpb24gV2hpdGVzcGFjZUNvbnRyb2woKSB7XG5cdCAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuXHQgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdH1cblx0V2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlID0gbmV3IF92aXNpdG9yMlsnZGVmYXVsdCddKCk7XG5cblx0V2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLlByb2dyYW0gPSBmdW5jdGlvbiAocHJvZ3JhbSkge1xuXHQgIHZhciBkb1N0YW5kYWxvbmUgPSAhdGhpcy5vcHRpb25zLmlnbm9yZVN0YW5kYWxvbmU7XG5cblx0ICB2YXIgaXNSb290ID0gIXRoaXMuaXNSb290U2Vlbjtcblx0ICB0aGlzLmlzUm9vdFNlZW4gPSB0cnVlO1xuXG5cdCAgdmFyIGJvZHkgPSBwcm9ncmFtLmJvZHk7XG5cdCAgZm9yICh2YXIgaSA9IDAsIGwgPSBib2R5Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgdmFyIGN1cnJlbnQgPSBib2R5W2ldLFxuXHQgICAgICAgIHN0cmlwID0gdGhpcy5hY2NlcHQoY3VycmVudCk7XG5cblx0ICAgIGlmICghc3RyaXApIHtcblx0ICAgICAgY29udGludWU7XG5cdCAgICB9XG5cblx0ICAgIHZhciBfaXNQcmV2V2hpdGVzcGFjZSA9IGlzUHJldldoaXRlc3BhY2UoYm9keSwgaSwgaXNSb290KSxcblx0ICAgICAgICBfaXNOZXh0V2hpdGVzcGFjZSA9IGlzTmV4dFdoaXRlc3BhY2UoYm9keSwgaSwgaXNSb290KSxcblx0ICAgICAgICBvcGVuU3RhbmRhbG9uZSA9IHN0cmlwLm9wZW5TdGFuZGFsb25lICYmIF9pc1ByZXZXaGl0ZXNwYWNlLFxuXHQgICAgICAgIGNsb3NlU3RhbmRhbG9uZSA9IHN0cmlwLmNsb3NlU3RhbmRhbG9uZSAmJiBfaXNOZXh0V2hpdGVzcGFjZSxcblx0ICAgICAgICBpbmxpbmVTdGFuZGFsb25lID0gc3RyaXAuaW5saW5lU3RhbmRhbG9uZSAmJiBfaXNQcmV2V2hpdGVzcGFjZSAmJiBfaXNOZXh0V2hpdGVzcGFjZTtcblxuXHQgICAgaWYgKHN0cmlwLmNsb3NlKSB7XG5cdCAgICAgIG9taXRSaWdodChib2R5LCBpLCB0cnVlKTtcblx0ICAgIH1cblx0ICAgIGlmIChzdHJpcC5vcGVuKSB7XG5cdCAgICAgIG9taXRMZWZ0KGJvZHksIGksIHRydWUpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoZG9TdGFuZGFsb25lICYmIGlubGluZVN0YW5kYWxvbmUpIHtcblx0ICAgICAgb21pdFJpZ2h0KGJvZHksIGkpO1xuXG5cdCAgICAgIGlmIChvbWl0TGVmdChib2R5LCBpKSkge1xuXHQgICAgICAgIC8vIElmIHdlIGFyZSBvbiBhIHN0YW5kYWxvbmUgbm9kZSwgc2F2ZSB0aGUgaW5kZW50IGluZm8gZm9yIHBhcnRpYWxzXG5cdCAgICAgICAgaWYgKGN1cnJlbnQudHlwZSA9PT0gJ1BhcnRpYWxTdGF0ZW1lbnQnKSB7XG5cdCAgICAgICAgICAvLyBQdWxsIG91dCB0aGUgd2hpdGVzcGFjZSBmcm9tIHRoZSBmaW5hbCBsaW5lXG5cdCAgICAgICAgICBjdXJyZW50LmluZGVudCA9IC8oWyBcXHRdKyQpLy5leGVjKGJvZHlbaSAtIDFdLm9yaWdpbmFsKVsxXTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIGlmIChkb1N0YW5kYWxvbmUgJiYgb3BlblN0YW5kYWxvbmUpIHtcblx0ICAgICAgb21pdFJpZ2h0KChjdXJyZW50LnByb2dyYW0gfHwgY3VycmVudC5pbnZlcnNlKS5ib2R5KTtcblxuXHQgICAgICAvLyBTdHJpcCBvdXQgdGhlIHByZXZpb3VzIGNvbnRlbnQgbm9kZSBpZiBpdCdzIHdoaXRlc3BhY2Ugb25seVxuXHQgICAgICBvbWl0TGVmdChib2R5LCBpKTtcblx0ICAgIH1cblx0ICAgIGlmIChkb1N0YW5kYWxvbmUgJiYgY2xvc2VTdGFuZGFsb25lKSB7XG5cdCAgICAgIC8vIEFsd2F5cyBzdHJpcCB0aGUgbmV4dCBub2RlXG5cdCAgICAgIG9taXRSaWdodChib2R5LCBpKTtcblxuXHQgICAgICBvbWl0TGVmdCgoY3VycmVudC5pbnZlcnNlIHx8IGN1cnJlbnQucHJvZ3JhbSkuYm9keSk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgcmV0dXJuIHByb2dyYW07XG5cdH07XG5cblx0V2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLkJsb2NrU3RhdGVtZW50ID0gV2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLkRlY29yYXRvckJsb2NrID0gV2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLlBhcnRpYWxCbG9ja1N0YXRlbWVudCA9IGZ1bmN0aW9uIChibG9jaykge1xuXHQgIHRoaXMuYWNjZXB0KGJsb2NrLnByb2dyYW0pO1xuXHQgIHRoaXMuYWNjZXB0KGJsb2NrLmludmVyc2UpO1xuXG5cdCAgLy8gRmluZCB0aGUgaW52ZXJzZSBwcm9ncmFtIHRoYXQgaXMgaW52b2xlZCB3aXRoIHdoaXRlc3BhY2Ugc3RyaXBwaW5nLlxuXHQgIHZhciBwcm9ncmFtID0gYmxvY2sucHJvZ3JhbSB8fCBibG9jay5pbnZlcnNlLFxuXHQgICAgICBpbnZlcnNlID0gYmxvY2sucHJvZ3JhbSAmJiBibG9jay5pbnZlcnNlLFxuXHQgICAgICBmaXJzdEludmVyc2UgPSBpbnZlcnNlLFxuXHQgICAgICBsYXN0SW52ZXJzZSA9IGludmVyc2U7XG5cblx0ICBpZiAoaW52ZXJzZSAmJiBpbnZlcnNlLmNoYWluZWQpIHtcblx0ICAgIGZpcnN0SW52ZXJzZSA9IGludmVyc2UuYm9keVswXS5wcm9ncmFtO1xuXG5cdCAgICAvLyBXYWxrIHRoZSBpbnZlcnNlIGNoYWluIHRvIGZpbmQgdGhlIGxhc3QgaW52ZXJzZSB0aGF0IGlzIGFjdHVhbGx5IGluIHRoZSBjaGFpbi5cblx0ICAgIHdoaWxlIChsYXN0SW52ZXJzZS5jaGFpbmVkKSB7XG5cdCAgICAgIGxhc3RJbnZlcnNlID0gbGFzdEludmVyc2UuYm9keVtsYXN0SW52ZXJzZS5ib2R5Lmxlbmd0aCAtIDFdLnByb2dyYW07XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgdmFyIHN0cmlwID0ge1xuXHQgICAgb3BlbjogYmxvY2sub3BlblN0cmlwLm9wZW4sXG5cdCAgICBjbG9zZTogYmxvY2suY2xvc2VTdHJpcC5jbG9zZSxcblxuXHQgICAgLy8gRGV0ZXJtaW5lIHRoZSBzdGFuZGFsb25lIGNhbmRpYWN5LiBCYXNpY2FsbHkgZmxhZyBvdXIgY29udGVudCBhcyBiZWluZyBwb3NzaWJseSBzdGFuZGFsb25lXG5cdCAgICAvLyBzbyBvdXIgcGFyZW50IGNhbiBkZXRlcm1pbmUgaWYgd2UgYWN0dWFsbHkgYXJlIHN0YW5kYWxvbmVcblx0ICAgIG9wZW5TdGFuZGFsb25lOiBpc05leHRXaGl0ZXNwYWNlKHByb2dyYW0uYm9keSksXG5cdCAgICBjbG9zZVN0YW5kYWxvbmU6IGlzUHJldldoaXRlc3BhY2UoKGZpcnN0SW52ZXJzZSB8fCBwcm9ncmFtKS5ib2R5KVxuXHQgIH07XG5cblx0ICBpZiAoYmxvY2sub3BlblN0cmlwLmNsb3NlKSB7XG5cdCAgICBvbWl0UmlnaHQocHJvZ3JhbS5ib2R5LCBudWxsLCB0cnVlKTtcblx0ICB9XG5cblx0ICBpZiAoaW52ZXJzZSkge1xuXHQgICAgdmFyIGludmVyc2VTdHJpcCA9IGJsb2NrLmludmVyc2VTdHJpcDtcblxuXHQgICAgaWYgKGludmVyc2VTdHJpcC5vcGVuKSB7XG5cdCAgICAgIG9taXRMZWZ0KHByb2dyYW0uYm9keSwgbnVsbCwgdHJ1ZSk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChpbnZlcnNlU3RyaXAuY2xvc2UpIHtcblx0ICAgICAgb21pdFJpZ2h0KGZpcnN0SW52ZXJzZS5ib2R5LCBudWxsLCB0cnVlKTtcblx0ICAgIH1cblx0ICAgIGlmIChibG9jay5jbG9zZVN0cmlwLm9wZW4pIHtcblx0ICAgICAgb21pdExlZnQobGFzdEludmVyc2UuYm9keSwgbnVsbCwgdHJ1ZSk7XG5cdCAgICB9XG5cblx0ICAgIC8vIEZpbmQgc3RhbmRhbG9uZSBlbHNlIHN0YXRtZW50c1xuXHQgICAgaWYgKCF0aGlzLm9wdGlvbnMuaWdub3JlU3RhbmRhbG9uZSAmJiBpc1ByZXZXaGl0ZXNwYWNlKHByb2dyYW0uYm9keSkgJiYgaXNOZXh0V2hpdGVzcGFjZShmaXJzdEludmVyc2UuYm9keSkpIHtcblx0ICAgICAgb21pdExlZnQocHJvZ3JhbS5ib2R5KTtcblx0ICAgICAgb21pdFJpZ2h0KGZpcnN0SW52ZXJzZS5ib2R5KTtcblx0ICAgIH1cblx0ICB9IGVsc2UgaWYgKGJsb2NrLmNsb3NlU3RyaXAub3Blbikge1xuXHQgICAgb21pdExlZnQocHJvZ3JhbS5ib2R5LCBudWxsLCB0cnVlKTtcblx0ICB9XG5cblx0ICByZXR1cm4gc3RyaXA7XG5cdH07XG5cblx0V2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLkRlY29yYXRvciA9IFdoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5NdXN0YWNoZVN0YXRlbWVudCA9IGZ1bmN0aW9uIChtdXN0YWNoZSkge1xuXHQgIHJldHVybiBtdXN0YWNoZS5zdHJpcDtcblx0fTtcblxuXHRXaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuUGFydGlhbFN0YXRlbWVudCA9IFdoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5Db21tZW50U3RhdGVtZW50ID0gZnVuY3Rpb24gKG5vZGUpIHtcblx0ICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgIHZhciBzdHJpcCA9IG5vZGUuc3RyaXAgfHwge307XG5cdCAgcmV0dXJuIHtcblx0ICAgIGlubGluZVN0YW5kYWxvbmU6IHRydWUsXG5cdCAgICBvcGVuOiBzdHJpcC5vcGVuLFxuXHQgICAgY2xvc2U6IHN0cmlwLmNsb3NlXG5cdCAgfTtcblx0fTtcblxuXHRmdW5jdGlvbiBpc1ByZXZXaGl0ZXNwYWNlKGJvZHksIGksIGlzUm9vdCkge1xuXHQgIGlmIChpID09PSB1bmRlZmluZWQpIHtcblx0ICAgIGkgPSBib2R5Lmxlbmd0aDtcblx0ICB9XG5cblx0ICAvLyBOb2RlcyB0aGF0IGVuZCB3aXRoIG5ld2xpbmVzIGFyZSBjb25zaWRlcmVkIHdoaXRlc3BhY2UgKGJ1dCBhcmUgc3BlY2lhbFxuXHQgIC8vIGNhc2VkIGZvciBzdHJpcCBvcGVyYXRpb25zKVxuXHQgIHZhciBwcmV2ID0gYm9keVtpIC0gMV0sXG5cdCAgICAgIHNpYmxpbmcgPSBib2R5W2kgLSAyXTtcblx0ICBpZiAoIXByZXYpIHtcblx0ICAgIHJldHVybiBpc1Jvb3Q7XG5cdCAgfVxuXG5cdCAgaWYgKHByZXYudHlwZSA9PT0gJ0NvbnRlbnRTdGF0ZW1lbnQnKSB7XG5cdCAgICByZXR1cm4gKHNpYmxpbmcgfHwgIWlzUm9vdCA/IC9cXHI/XFxuXFxzKj8kLyA6IC8oXnxcXHI/XFxuKVxccyo/JC8pLnRlc3QocHJldi5vcmlnaW5hbCk7XG5cdCAgfVxuXHR9XG5cdGZ1bmN0aW9uIGlzTmV4dFdoaXRlc3BhY2UoYm9keSwgaSwgaXNSb290KSB7XG5cdCAgaWYgKGkgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgaSA9IC0xO1xuXHQgIH1cblxuXHQgIHZhciBuZXh0ID0gYm9keVtpICsgMV0sXG5cdCAgICAgIHNpYmxpbmcgPSBib2R5W2kgKyAyXTtcblx0ICBpZiAoIW5leHQpIHtcblx0ICAgIHJldHVybiBpc1Jvb3Q7XG5cdCAgfVxuXG5cdCAgaWYgKG5leHQudHlwZSA9PT0gJ0NvbnRlbnRTdGF0ZW1lbnQnKSB7XG5cdCAgICByZXR1cm4gKHNpYmxpbmcgfHwgIWlzUm9vdCA/IC9eXFxzKj9cXHI/XFxuLyA6IC9eXFxzKj8oXFxyP1xcbnwkKS8pLnRlc3QobmV4dC5vcmlnaW5hbCk7XG5cdCAgfVxuXHR9XG5cblx0Ly8gTWFya3MgdGhlIG5vZGUgdG8gdGhlIHJpZ2h0IG9mIHRoZSBwb3NpdGlvbiBhcyBvbWl0dGVkLlxuXHQvLyBJLmUuIHt7Zm9vfX0nICcgd2lsbCBtYXJrIHRoZSAnICcgbm9kZSBhcyBvbWl0dGVkLlxuXHQvL1xuXHQvLyBJZiBpIGlzIHVuZGVmaW5lZCwgdGhlbiB0aGUgZmlyc3QgY2hpbGQgd2lsbCBiZSBtYXJrZWQgYXMgc3VjaC5cblx0Ly9cblx0Ly8gSWYgbXVsaXRwbGUgaXMgdHJ1dGh5IHRoZW4gYWxsIHdoaXRlc3BhY2Ugd2lsbCBiZSBzdHJpcHBlZCBvdXQgdW50aWwgbm9uLXdoaXRlc3BhY2Vcblx0Ly8gY29udGVudCBpcyBtZXQuXG5cdGZ1bmN0aW9uIG9taXRSaWdodChib2R5LCBpLCBtdWx0aXBsZSkge1xuXHQgIHZhciBjdXJyZW50ID0gYm9keVtpID09IG51bGwgPyAwIDogaSArIDFdO1xuXHQgIGlmICghY3VycmVudCB8fCBjdXJyZW50LnR5cGUgIT09ICdDb250ZW50U3RhdGVtZW50JyB8fCAhbXVsdGlwbGUgJiYgY3VycmVudC5yaWdodFN0cmlwcGVkKSB7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXG5cdCAgdmFyIG9yaWdpbmFsID0gY3VycmVudC52YWx1ZTtcblx0ICBjdXJyZW50LnZhbHVlID0gY3VycmVudC52YWx1ZS5yZXBsYWNlKG11bHRpcGxlID8gL15cXHMrLyA6IC9eWyBcXHRdKlxccj9cXG4/LywgJycpO1xuXHQgIGN1cnJlbnQucmlnaHRTdHJpcHBlZCA9IGN1cnJlbnQudmFsdWUgIT09IG9yaWdpbmFsO1xuXHR9XG5cblx0Ly8gTWFya3MgdGhlIG5vZGUgdG8gdGhlIGxlZnQgb2YgdGhlIHBvc2l0aW9uIGFzIG9taXR0ZWQuXG5cdC8vIEkuZS4gJyAne3tmb299fSB3aWxsIG1hcmsgdGhlICcgJyBub2RlIGFzIG9taXR0ZWQuXG5cdC8vXG5cdC8vIElmIGkgaXMgdW5kZWZpbmVkIHRoZW4gdGhlIGxhc3QgY2hpbGQgd2lsbCBiZSBtYXJrZWQgYXMgc3VjaC5cblx0Ly9cblx0Ly8gSWYgbXVsaXRwbGUgaXMgdHJ1dGh5IHRoZW4gYWxsIHdoaXRlc3BhY2Ugd2lsbCBiZSBzdHJpcHBlZCBvdXQgdW50aWwgbm9uLXdoaXRlc3BhY2Vcblx0Ly8gY29udGVudCBpcyBtZXQuXG5cdGZ1bmN0aW9uIG9taXRMZWZ0KGJvZHksIGksIG11bHRpcGxlKSB7XG5cdCAgdmFyIGN1cnJlbnQgPSBib2R5W2kgPT0gbnVsbCA/IGJvZHkubGVuZ3RoIC0gMSA6IGkgLSAxXTtcblx0ICBpZiAoIWN1cnJlbnQgfHwgY3VycmVudC50eXBlICE9PSAnQ29udGVudFN0YXRlbWVudCcgfHwgIW11bHRpcGxlICYmIGN1cnJlbnQubGVmdFN0cmlwcGVkKSB7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXG5cdCAgLy8gV2Ugb21pdCB0aGUgbGFzdCBub2RlIGlmIGl0J3Mgd2hpdGVzcGFjZSBvbmx5IGFuZCBub3QgcHJlY2VlZGVkIGJ5IGEgbm9uLWNvbnRlbnQgbm9kZS5cblx0ICB2YXIgb3JpZ2luYWwgPSBjdXJyZW50LnZhbHVlO1xuXHQgIGN1cnJlbnQudmFsdWUgPSBjdXJyZW50LnZhbHVlLnJlcGxhY2UobXVsdGlwbGUgPyAvXFxzKyQvIDogL1sgXFx0XSskLywgJycpO1xuXHQgIGN1cnJlbnQubGVmdFN0cmlwcGVkID0gY3VycmVudC52YWx1ZSAhPT0gb3JpZ2luYWw7XG5cdCAgcmV0dXJuIGN1cnJlbnQubGVmdFN0cmlwcGVkO1xuXHR9XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gV2hpdGVzcGFjZUNvbnRyb2w7XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9KSxcbi8qIDM5ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKVsnZGVmYXVsdCddO1xuXG5cdGV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cblx0dmFyIF9leGNlcHRpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG5cdHZhciBfZXhjZXB0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4Y2VwdGlvbik7XG5cblx0ZnVuY3Rpb24gVmlzaXRvcigpIHtcblx0ICB0aGlzLnBhcmVudHMgPSBbXTtcblx0fVxuXG5cdFZpc2l0b3IucHJvdG90eXBlID0ge1xuXHQgIGNvbnN0cnVjdG9yOiBWaXNpdG9yLFxuXHQgIG11dGF0aW5nOiBmYWxzZSxcblxuXHQgIC8vIFZpc2l0cyBhIGdpdmVuIHZhbHVlLiBJZiBtdXRhdGluZywgd2lsbCByZXBsYWNlIHRoZSB2YWx1ZSBpZiBuZWNlc3NhcnkuXG5cdCAgYWNjZXB0S2V5OiBmdW5jdGlvbiBhY2NlcHRLZXkobm9kZSwgbmFtZSkge1xuXHQgICAgdmFyIHZhbHVlID0gdGhpcy5hY2NlcHQobm9kZVtuYW1lXSk7XG5cdCAgICBpZiAodGhpcy5tdXRhdGluZykge1xuXHQgICAgICAvLyBIYWNreSBzYW5pdHkgY2hlY2s6IFRoaXMgbWF5IGhhdmUgYSBmZXcgZmFsc2UgcG9zaXRpdmVzIGZvciB0eXBlIGZvciB0aGUgaGVscGVyXG5cdCAgICAgIC8vIG1ldGhvZHMgYnV0IHdpbGwgZ2VuZXJhbGx5IGRvIHRoZSByaWdodCB0aGluZyB3aXRob3V0IGEgbG90IG9mIG92ZXJoZWFkLlxuXHQgICAgICBpZiAodmFsdWUgJiYgIVZpc2l0b3IucHJvdG90eXBlW3ZhbHVlLnR5cGVdKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1VuZXhwZWN0ZWQgbm9kZSB0eXBlIFwiJyArIHZhbHVlLnR5cGUgKyAnXCIgZm91bmQgd2hlbiBhY2NlcHRpbmcgJyArIG5hbWUgKyAnIG9uICcgKyBub2RlLnR5cGUpO1xuXHQgICAgICB9XG5cdCAgICAgIG5vZGVbbmFtZV0gPSB2YWx1ZTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgLy8gUGVyZm9ybXMgYW4gYWNjZXB0IG9wZXJhdGlvbiB3aXRoIGFkZGVkIHNhbml0eSBjaGVjayB0byBlbnN1cmVcblx0ICAvLyByZXF1aXJlZCBrZXlzIGFyZSBub3QgcmVtb3ZlZC5cblx0ICBhY2NlcHRSZXF1aXJlZDogZnVuY3Rpb24gYWNjZXB0UmVxdWlyZWQobm9kZSwgbmFtZSkge1xuXHQgICAgdGhpcy5hY2NlcHRLZXkobm9kZSwgbmFtZSk7XG5cblx0ICAgIGlmICghbm9kZVtuYW1lXSkge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXShub2RlLnR5cGUgKyAnIHJlcXVpcmVzICcgKyBuYW1lKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgLy8gVHJhdmVyc2VzIGEgZ2l2ZW4gYXJyYXkuIElmIG11dGF0aW5nLCBlbXB0eSByZXNwbnNlcyB3aWxsIGJlIHJlbW92ZWRcblx0ICAvLyBmb3IgY2hpbGQgZWxlbWVudHMuXG5cdCAgYWNjZXB0QXJyYXk6IGZ1bmN0aW9uIGFjY2VwdEFycmF5KGFycmF5KSB7XG5cdCAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICB0aGlzLmFjY2VwdEtleShhcnJheSwgaSk7XG5cblx0ICAgICAgaWYgKCFhcnJheVtpXSkge1xuXHQgICAgICAgIGFycmF5LnNwbGljZShpLCAxKTtcblx0ICAgICAgICBpLS07XG5cdCAgICAgICAgbC0tO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIGFjY2VwdDogZnVuY3Rpb24gYWNjZXB0KG9iamVjdCkge1xuXHQgICAgaWYgKCFvYmplY3QpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogU2FuaXR5IGNvZGUgKi9cblx0ICAgIGlmICghdGhpc1tvYmplY3QudHlwZV0pIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1Vua25vd24gdHlwZTogJyArIG9iamVjdC50eXBlLCBvYmplY3QpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAodGhpcy5jdXJyZW50KSB7XG5cdCAgICAgIHRoaXMucGFyZW50cy51bnNoaWZ0KHRoaXMuY3VycmVudCk7XG5cdCAgICB9XG5cdCAgICB0aGlzLmN1cnJlbnQgPSBvYmplY3Q7XG5cblx0ICAgIHZhciByZXQgPSB0aGlzW29iamVjdC50eXBlXShvYmplY3QpO1xuXG5cdCAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnBhcmVudHMuc2hpZnQoKTtcblxuXHQgICAgaWYgKCF0aGlzLm11dGF0aW5nIHx8IHJldCkge1xuXHQgICAgICByZXR1cm4gcmV0O1xuXHQgICAgfSBlbHNlIGlmIChyZXQgIT09IGZhbHNlKSB7XG5cdCAgICAgIHJldHVybiBvYmplY3Q7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIFByb2dyYW06IGZ1bmN0aW9uIFByb2dyYW0ocHJvZ3JhbSkge1xuXHQgICAgdGhpcy5hY2NlcHRBcnJheShwcm9ncmFtLmJvZHkpO1xuXHQgIH0sXG5cblx0ICBNdXN0YWNoZVN0YXRlbWVudDogdmlzaXRTdWJFeHByZXNzaW9uLFxuXHQgIERlY29yYXRvcjogdmlzaXRTdWJFeHByZXNzaW9uLFxuXG5cdCAgQmxvY2tTdGF0ZW1lbnQ6IHZpc2l0QmxvY2ssXG5cdCAgRGVjb3JhdG9yQmxvY2s6IHZpc2l0QmxvY2ssXG5cblx0ICBQYXJ0aWFsU3RhdGVtZW50OiB2aXNpdFBhcnRpYWwsXG5cdCAgUGFydGlhbEJsb2NrU3RhdGVtZW50OiBmdW5jdGlvbiBQYXJ0aWFsQmxvY2tTdGF0ZW1lbnQocGFydGlhbCkge1xuXHQgICAgdmlzaXRQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCk7XG5cblx0ICAgIHRoaXMuYWNjZXB0S2V5KHBhcnRpYWwsICdwcm9ncmFtJyk7XG5cdCAgfSxcblxuXHQgIENvbnRlbnRTdGF0ZW1lbnQ6IGZ1bmN0aW9uIENvbnRlbnRTdGF0ZW1lbnQoKSAvKiBjb250ZW50ICove30sXG5cdCAgQ29tbWVudFN0YXRlbWVudDogZnVuY3Rpb24gQ29tbWVudFN0YXRlbWVudCgpIC8qIGNvbW1lbnQgKi97fSxcblxuXHQgIFN1YkV4cHJlc3Npb246IHZpc2l0U3ViRXhwcmVzc2lvbixcblxuXHQgIFBhdGhFeHByZXNzaW9uOiBmdW5jdGlvbiBQYXRoRXhwcmVzc2lvbigpIC8qIHBhdGggKi97fSxcblxuXHQgIFN0cmluZ0xpdGVyYWw6IGZ1bmN0aW9uIFN0cmluZ0xpdGVyYWwoKSAvKiBzdHJpbmcgKi97fSxcblx0ICBOdW1iZXJMaXRlcmFsOiBmdW5jdGlvbiBOdW1iZXJMaXRlcmFsKCkgLyogbnVtYmVyICove30sXG5cdCAgQm9vbGVhbkxpdGVyYWw6IGZ1bmN0aW9uIEJvb2xlYW5MaXRlcmFsKCkgLyogYm9vbCAqL3t9LFxuXHQgIFVuZGVmaW5lZExpdGVyYWw6IGZ1bmN0aW9uIFVuZGVmaW5lZExpdGVyYWwoKSAvKiBsaXRlcmFsICove30sXG5cdCAgTnVsbExpdGVyYWw6IGZ1bmN0aW9uIE51bGxMaXRlcmFsKCkgLyogbGl0ZXJhbCAqL3t9LFxuXG5cdCAgSGFzaDogZnVuY3Rpb24gSGFzaChoYXNoKSB7XG5cdCAgICB0aGlzLmFjY2VwdEFycmF5KGhhc2gucGFpcnMpO1xuXHQgIH0sXG5cdCAgSGFzaFBhaXI6IGZ1bmN0aW9uIEhhc2hQYWlyKHBhaXIpIHtcblx0ICAgIHRoaXMuYWNjZXB0UmVxdWlyZWQocGFpciwgJ3ZhbHVlJyk7XG5cdCAgfVxuXHR9O1xuXG5cdGZ1bmN0aW9uIHZpc2l0U3ViRXhwcmVzc2lvbihtdXN0YWNoZSkge1xuXHQgIHRoaXMuYWNjZXB0UmVxdWlyZWQobXVzdGFjaGUsICdwYXRoJyk7XG5cdCAgdGhpcy5hY2NlcHRBcnJheShtdXN0YWNoZS5wYXJhbXMpO1xuXHQgIHRoaXMuYWNjZXB0S2V5KG11c3RhY2hlLCAnaGFzaCcpO1xuXHR9XG5cdGZ1bmN0aW9uIHZpc2l0QmxvY2soYmxvY2spIHtcblx0ICB2aXNpdFN1YkV4cHJlc3Npb24uY2FsbCh0aGlzLCBibG9jayk7XG5cblx0ICB0aGlzLmFjY2VwdEtleShibG9jaywgJ3Byb2dyYW0nKTtcblx0ICB0aGlzLmFjY2VwdEtleShibG9jaywgJ2ludmVyc2UnKTtcblx0fVxuXHRmdW5jdGlvbiB2aXNpdFBhcnRpYWwocGFydGlhbCkge1xuXHQgIHRoaXMuYWNjZXB0UmVxdWlyZWQocGFydGlhbCwgJ25hbWUnKTtcblx0ICB0aGlzLmFjY2VwdEFycmF5KHBhcnRpYWwucGFyYW1zKTtcblx0ICB0aGlzLmFjY2VwdEtleShwYXJ0aWFsLCAnaGFzaCcpO1xuXHR9XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gVmlzaXRvcjtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogNDAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpWydkZWZhdWx0J107XG5cblx0ZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblx0ZXhwb3J0cy5Tb3VyY2VMb2NhdGlvbiA9IFNvdXJjZUxvY2F0aW9uO1xuXHRleHBvcnRzLmlkID0gaWQ7XG5cdGV4cG9ydHMuc3RyaXBGbGFncyA9IHN0cmlwRmxhZ3M7XG5cdGV4cG9ydHMuc3RyaXBDb21tZW50ID0gc3RyaXBDb21tZW50O1xuXHRleHBvcnRzLnByZXBhcmVQYXRoID0gcHJlcGFyZVBhdGg7XG5cdGV4cG9ydHMucHJlcGFyZU11c3RhY2hlID0gcHJlcGFyZU11c3RhY2hlO1xuXHRleHBvcnRzLnByZXBhcmVSYXdCbG9jayA9IHByZXBhcmVSYXdCbG9jaztcblx0ZXhwb3J0cy5wcmVwYXJlQmxvY2sgPSBwcmVwYXJlQmxvY2s7XG5cdGV4cG9ydHMucHJlcGFyZVByb2dyYW0gPSBwcmVwYXJlUHJvZ3JhbTtcblx0ZXhwb3J0cy5wcmVwYXJlUGFydGlhbEJsb2NrID0gcHJlcGFyZVBhcnRpYWxCbG9jaztcblxuXHR2YXIgX2V4Y2VwdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0dmFyIF9leGNlcHRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhjZXB0aW9uKTtcblxuXHRmdW5jdGlvbiB2YWxpZGF0ZUNsb3NlKG9wZW4sIGNsb3NlKSB7XG5cdCAgY2xvc2UgPSBjbG9zZS5wYXRoID8gY2xvc2UucGF0aC5vcmlnaW5hbCA6IGNsb3NlO1xuXG5cdCAgaWYgKG9wZW4ucGF0aC5vcmlnaW5hbCAhPT0gY2xvc2UpIHtcblx0ICAgIHZhciBlcnJvck5vZGUgPSB7IGxvYzogb3Blbi5wYXRoLmxvYyB9O1xuXG5cdCAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXShvcGVuLnBhdGgub3JpZ2luYWwgKyBcIiBkb2Vzbid0IG1hdGNoIFwiICsgY2xvc2UsIGVycm9yTm9kZSk7XG5cdCAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gU291cmNlTG9jYXRpb24oc291cmNlLCBsb2NJbmZvKSB7XG5cdCAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG5cdCAgdGhpcy5zdGFydCA9IHtcblx0ICAgIGxpbmU6IGxvY0luZm8uZmlyc3RfbGluZSxcblx0ICAgIGNvbHVtbjogbG9jSW5mby5maXJzdF9jb2x1bW5cblx0ICB9O1xuXHQgIHRoaXMuZW5kID0ge1xuXHQgICAgbGluZTogbG9jSW5mby5sYXN0X2xpbmUsXG5cdCAgICBjb2x1bW46IGxvY0luZm8ubGFzdF9jb2x1bW5cblx0ICB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gaWQodG9rZW4pIHtcblx0ICBpZiAoL15cXFsuKlxcXSQvLnRlc3QodG9rZW4pKSB7XG5cdCAgICByZXR1cm4gdG9rZW4uc3Vic3RyKDEsIHRva2VuLmxlbmd0aCAtIDIpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZXR1cm4gdG9rZW47XG5cdCAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gc3RyaXBGbGFncyhvcGVuLCBjbG9zZSkge1xuXHQgIHJldHVybiB7XG5cdCAgICBvcGVuOiBvcGVuLmNoYXJBdCgyKSA9PT0gJ34nLFxuXHQgICAgY2xvc2U6IGNsb3NlLmNoYXJBdChjbG9zZS5sZW5ndGggLSAzKSA9PT0gJ34nXG5cdCAgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIHN0cmlwQ29tbWVudChjb21tZW50KSB7XG5cdCAgcmV0dXJuIGNvbW1lbnQucmVwbGFjZSgvXlxce1xce34/XFwhLT8tPy8sICcnKS5yZXBsYWNlKC8tPy0/fj9cXH1cXH0kLywgJycpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJlcGFyZVBhdGgoZGF0YSwgcGFydHMsIGxvYykge1xuXHQgIGxvYyA9IHRoaXMubG9jSW5mbyhsb2MpO1xuXG5cdCAgdmFyIG9yaWdpbmFsID0gZGF0YSA/ICdAJyA6ICcnLFxuXHQgICAgICBkaWcgPSBbXSxcblx0ICAgICAgZGVwdGggPSAwLFxuXHQgICAgICBkZXB0aFN0cmluZyA9ICcnO1xuXG5cdCAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXJ0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgIHZhciBwYXJ0ID0gcGFydHNbaV0ucGFydCxcblxuXHQgICAgLy8gSWYgd2UgaGF2ZSBbXSBzeW50YXggdGhlbiB3ZSBkbyBub3QgdHJlYXQgcGF0aCByZWZlcmVuY2VzIGFzIG9wZXJhdG9ycyxcblx0ICAgIC8vIGkuZS4gZm9vLlt0aGlzXSByZXNvbHZlcyB0byBhcHByb3hpbWF0ZWx5IGNvbnRleHQuZm9vWyd0aGlzJ11cblx0ICAgIGlzTGl0ZXJhbCA9IHBhcnRzW2ldLm9yaWdpbmFsICE9PSBwYXJ0O1xuXHQgICAgb3JpZ2luYWwgKz0gKHBhcnRzW2ldLnNlcGFyYXRvciB8fCAnJykgKyBwYXJ0O1xuXG5cdCAgICBpZiAoIWlzTGl0ZXJhbCAmJiAocGFydCA9PT0gJy4uJyB8fCBwYXJ0ID09PSAnLicgfHwgcGFydCA9PT0gJ3RoaXMnKSkge1xuXHQgICAgICBpZiAoZGlnLmxlbmd0aCA+IDApIHtcblx0ICAgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnSW52YWxpZCBwYXRoOiAnICsgb3JpZ2luYWwsIHsgbG9jOiBsb2MgfSk7XG5cdCAgICAgIH0gZWxzZSBpZiAocGFydCA9PT0gJy4uJykge1xuXHQgICAgICAgIGRlcHRoKys7XG5cdCAgICAgICAgZGVwdGhTdHJpbmcgKz0gJy4uLyc7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGRpZy5wdXNoKHBhcnQpO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIHJldHVybiB7XG5cdCAgICB0eXBlOiAnUGF0aEV4cHJlc3Npb24nLFxuXHQgICAgZGF0YTogZGF0YSxcblx0ICAgIGRlcHRoOiBkZXB0aCxcblx0ICAgIHBhcnRzOiBkaWcsXG5cdCAgICBvcmlnaW5hbDogb3JpZ2luYWwsXG5cdCAgICBsb2M6IGxvY1xuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBwcmVwYXJlTXVzdGFjaGUocGF0aCwgcGFyYW1zLCBoYXNoLCBvcGVuLCBzdHJpcCwgbG9jSW5mbykge1xuXHQgIC8vIE11c3QgdXNlIGNoYXJBdCB0byBzdXBwb3J0IElFIHByZS0xMFxuXHQgIHZhciBlc2NhcGVGbGFnID0gb3Blbi5jaGFyQXQoMykgfHwgb3Blbi5jaGFyQXQoMiksXG5cdCAgICAgIGVzY2FwZWQgPSBlc2NhcGVGbGFnICE9PSAneycgJiYgZXNjYXBlRmxhZyAhPT0gJyYnO1xuXG5cdCAgdmFyIGRlY29yYXRvciA9IC9cXCovLnRlc3Qob3Blbik7XG5cdCAgcmV0dXJuIHtcblx0ICAgIHR5cGU6IGRlY29yYXRvciA/ICdEZWNvcmF0b3InIDogJ011c3RhY2hlU3RhdGVtZW50Jyxcblx0ICAgIHBhdGg6IHBhdGgsXG5cdCAgICBwYXJhbXM6IHBhcmFtcyxcblx0ICAgIGhhc2g6IGhhc2gsXG5cdCAgICBlc2NhcGVkOiBlc2NhcGVkLFxuXHQgICAgc3RyaXA6IHN0cmlwLFxuXHQgICAgbG9jOiB0aGlzLmxvY0luZm8obG9jSW5mbylcblx0ICB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJlcGFyZVJhd0Jsb2NrKG9wZW5SYXdCbG9jaywgY29udGVudHMsIGNsb3NlLCBsb2NJbmZvKSB7XG5cdCAgdmFsaWRhdGVDbG9zZShvcGVuUmF3QmxvY2ssIGNsb3NlKTtcblxuXHQgIGxvY0luZm8gPSB0aGlzLmxvY0luZm8obG9jSW5mbyk7XG5cdCAgdmFyIHByb2dyYW0gPSB7XG5cdCAgICB0eXBlOiAnUHJvZ3JhbScsXG5cdCAgICBib2R5OiBjb250ZW50cyxcblx0ICAgIHN0cmlwOiB7fSxcblx0ICAgIGxvYzogbG9jSW5mb1xuXHQgIH07XG5cblx0ICByZXR1cm4ge1xuXHQgICAgdHlwZTogJ0Jsb2NrU3RhdGVtZW50Jyxcblx0ICAgIHBhdGg6IG9wZW5SYXdCbG9jay5wYXRoLFxuXHQgICAgcGFyYW1zOiBvcGVuUmF3QmxvY2sucGFyYW1zLFxuXHQgICAgaGFzaDogb3BlblJhd0Jsb2NrLmhhc2gsXG5cdCAgICBwcm9ncmFtOiBwcm9ncmFtLFxuXHQgICAgb3BlblN0cmlwOiB7fSxcblx0ICAgIGludmVyc2VTdHJpcDoge30sXG5cdCAgICBjbG9zZVN0cmlwOiB7fSxcblx0ICAgIGxvYzogbG9jSW5mb1xuXHQgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBwcmVwYXJlQmxvY2sob3BlbkJsb2NrLCBwcm9ncmFtLCBpbnZlcnNlQW5kUHJvZ3JhbSwgY2xvc2UsIGludmVydGVkLCBsb2NJbmZvKSB7XG5cdCAgaWYgKGNsb3NlICYmIGNsb3NlLnBhdGgpIHtcblx0ICAgIHZhbGlkYXRlQ2xvc2Uob3BlbkJsb2NrLCBjbG9zZSk7XG5cdCAgfVxuXG5cdCAgdmFyIGRlY29yYXRvciA9IC9cXCovLnRlc3Qob3BlbkJsb2NrLm9wZW4pO1xuXG5cdCAgcHJvZ3JhbS5ibG9ja1BhcmFtcyA9IG9wZW5CbG9jay5ibG9ja1BhcmFtcztcblxuXHQgIHZhciBpbnZlcnNlID0gdW5kZWZpbmVkLFxuXHQgICAgICBpbnZlcnNlU3RyaXAgPSB1bmRlZmluZWQ7XG5cblx0ICBpZiAoaW52ZXJzZUFuZFByb2dyYW0pIHtcblx0ICAgIGlmIChkZWNvcmF0b3IpIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1VuZXhwZWN0ZWQgaW52ZXJzZSBibG9jayBvbiBkZWNvcmF0b3InLCBpbnZlcnNlQW5kUHJvZ3JhbSk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChpbnZlcnNlQW5kUHJvZ3JhbS5jaGFpbikge1xuXHQgICAgICBpbnZlcnNlQW5kUHJvZ3JhbS5wcm9ncmFtLmJvZHlbMF0uY2xvc2VTdHJpcCA9IGNsb3NlLnN0cmlwO1xuXHQgICAgfVxuXG5cdCAgICBpbnZlcnNlU3RyaXAgPSBpbnZlcnNlQW5kUHJvZ3JhbS5zdHJpcDtcblx0ICAgIGludmVyc2UgPSBpbnZlcnNlQW5kUHJvZ3JhbS5wcm9ncmFtO1xuXHQgIH1cblxuXHQgIGlmIChpbnZlcnRlZCkge1xuXHQgICAgaW52ZXJ0ZWQgPSBpbnZlcnNlO1xuXHQgICAgaW52ZXJzZSA9IHByb2dyYW07XG5cdCAgICBwcm9ncmFtID0gaW52ZXJ0ZWQ7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIHtcblx0ICAgIHR5cGU6IGRlY29yYXRvciA/ICdEZWNvcmF0b3JCbG9jaycgOiAnQmxvY2tTdGF0ZW1lbnQnLFxuXHQgICAgcGF0aDogb3BlbkJsb2NrLnBhdGgsXG5cdCAgICBwYXJhbXM6IG9wZW5CbG9jay5wYXJhbXMsXG5cdCAgICBoYXNoOiBvcGVuQmxvY2suaGFzaCxcblx0ICAgIHByb2dyYW06IHByb2dyYW0sXG5cdCAgICBpbnZlcnNlOiBpbnZlcnNlLFxuXHQgICAgb3BlblN0cmlwOiBvcGVuQmxvY2suc3RyaXAsXG5cdCAgICBpbnZlcnNlU3RyaXA6IGludmVyc2VTdHJpcCxcblx0ICAgIGNsb3NlU3RyaXA6IGNsb3NlICYmIGNsb3NlLnN0cmlwLFxuXHQgICAgbG9jOiB0aGlzLmxvY0luZm8obG9jSW5mbylcblx0ICB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJlcGFyZVByb2dyYW0oc3RhdGVtZW50cywgbG9jKSB7XG5cdCAgaWYgKCFsb2MgJiYgc3RhdGVtZW50cy5sZW5ndGgpIHtcblx0ICAgIHZhciBmaXJzdExvYyA9IHN0YXRlbWVudHNbMF0ubG9jLFxuXHQgICAgICAgIGxhc3RMb2MgPSBzdGF0ZW1lbnRzW3N0YXRlbWVudHMubGVuZ3RoIC0gMV0ubG9jO1xuXG5cdCAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHQgICAgaWYgKGZpcnN0TG9jICYmIGxhc3RMb2MpIHtcblx0ICAgICAgbG9jID0ge1xuXHQgICAgICAgIHNvdXJjZTogZmlyc3RMb2Muc291cmNlLFxuXHQgICAgICAgIHN0YXJ0OiB7XG5cdCAgICAgICAgICBsaW5lOiBmaXJzdExvYy5zdGFydC5saW5lLFxuXHQgICAgICAgICAgY29sdW1uOiBmaXJzdExvYy5zdGFydC5jb2x1bW5cblx0ICAgICAgICB9LFxuXHQgICAgICAgIGVuZDoge1xuXHQgICAgICAgICAgbGluZTogbGFzdExvYy5lbmQubGluZSxcblx0ICAgICAgICAgIGNvbHVtbjogbGFzdExvYy5lbmQuY29sdW1uXG5cdCAgICAgICAgfVxuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIHJldHVybiB7XG5cdCAgICB0eXBlOiAnUHJvZ3JhbScsXG5cdCAgICBib2R5OiBzdGF0ZW1lbnRzLFxuXHQgICAgc3RyaXA6IHt9LFxuXHQgICAgbG9jOiBsb2Ncblx0ICB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJlcGFyZVBhcnRpYWxCbG9jayhvcGVuLCBwcm9ncmFtLCBjbG9zZSwgbG9jSW5mbykge1xuXHQgIHZhbGlkYXRlQ2xvc2Uob3BlbiwgY2xvc2UpO1xuXG5cdCAgcmV0dXJuIHtcblx0ICAgIHR5cGU6ICdQYXJ0aWFsQmxvY2tTdGF0ZW1lbnQnLFxuXHQgICAgbmFtZTogb3Blbi5wYXRoLFxuXHQgICAgcGFyYW1zOiBvcGVuLnBhcmFtcyxcblx0ICAgIGhhc2g6IG9wZW4uaGFzaCxcblx0ICAgIHByb2dyYW06IHByb2dyYW0sXG5cdCAgICBvcGVuU3RyaXA6IG9wZW4uc3RyaXAsXG5cdCAgICBjbG9zZVN0cmlwOiBjbG9zZSAmJiBjbG9zZS5zdHJpcCxcblx0ICAgIGxvYzogdGhpcy5sb2NJbmZvKGxvY0luZm8pXG5cdCAgfTtcblx0fVxuXG4vKioqLyB9KSxcbi8qIDQxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXHRleHBvcnRzLkNvbXBpbGVyID0gQ29tcGlsZXI7XG5cdGV4cG9ydHMucHJlY29tcGlsZSA9IHByZWNvbXBpbGU7XG5cdGV4cG9ydHMuY29tcGlsZSA9IGNvbXBpbGU7XG5cblx0dmFyIF9leGNlcHRpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG5cdHZhciBfZXhjZXB0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4Y2VwdGlvbik7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIF9hc3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDM1KTtcblxuXHR2YXIgX2FzdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hc3QpO1xuXG5cdHZhciBzbGljZSA9IFtdLnNsaWNlO1xuXG5cdGZ1bmN0aW9uIENvbXBpbGVyKCkge31cblxuXHQvLyB0aGUgZm91bmRIZWxwZXIgcmVnaXN0ZXIgd2lsbCBkaXNhbWJpZ3VhdGUgaGVscGVyIGxvb2t1cCBmcm9tIGZpbmRpbmcgYVxuXHQvLyBmdW5jdGlvbiBpbiBhIGNvbnRleHQuIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBtdXN0YWNoZSBjb21wYXRpYmlsaXR5LCB3aGljaFxuXHQvLyByZXF1aXJlcyB0aGF0IGNvbnRleHQgZnVuY3Rpb25zIGluIGJsb2NrcyBhcmUgZXZhbHVhdGVkIGJ5IGJsb2NrSGVscGVyTWlzc2luZyxcblx0Ly8gYW5kIHRoZW4gcHJvY2VlZCBhcyBpZiB0aGUgcmVzdWx0aW5nIHZhbHVlIHdhcyBwcm92aWRlZCB0byBibG9ja0hlbHBlck1pc3NpbmcuXG5cblx0Q29tcGlsZXIucHJvdG90eXBlID0ge1xuXHQgIGNvbXBpbGVyOiBDb21waWxlcixcblxuXHQgIGVxdWFsczogZnVuY3Rpb24gZXF1YWxzKG90aGVyKSB7XG5cdCAgICB2YXIgbGVuID0gdGhpcy5vcGNvZGVzLmxlbmd0aDtcblx0ICAgIGlmIChvdGhlci5vcGNvZGVzLmxlbmd0aCAhPT0gbGVuKSB7XG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICB2YXIgb3Bjb2RlID0gdGhpcy5vcGNvZGVzW2ldLFxuXHQgICAgICAgICAgb3RoZXJPcGNvZGUgPSBvdGhlci5vcGNvZGVzW2ldO1xuXHQgICAgICBpZiAob3Bjb2RlLm9wY29kZSAhPT0gb3RoZXJPcGNvZGUub3Bjb2RlIHx8ICFhcmdFcXVhbHMob3Bjb2RlLmFyZ3MsIG90aGVyT3Bjb2RlLmFyZ3MpKSB7XG5cdCAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIC8vIFdlIGtub3cgdGhhdCBsZW5ndGggaXMgdGhlIHNhbWUgYmV0d2VlbiB0aGUgdHdvIGFycmF5cyBiZWNhdXNlIHRoZXkgYXJlIGRpcmVjdGx5IHRpZWRcblx0ICAgIC8vIHRvIHRoZSBvcGNvZGUgYmVoYXZpb3IgYWJvdmUuXG5cdCAgICBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgaWYgKCF0aGlzLmNoaWxkcmVuW2ldLmVxdWFscyhvdGhlci5jaGlsZHJlbltpXSkpIHtcblx0ICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfSxcblxuXHQgIGd1aWQ6IDAsXG5cblx0ICBjb21waWxlOiBmdW5jdGlvbiBjb21waWxlKHByb2dyYW0sIG9wdGlvbnMpIHtcblx0ICAgIHRoaXMuc291cmNlTm9kZSA9IFtdO1xuXHQgICAgdGhpcy5vcGNvZGVzID0gW107XG5cdCAgICB0aGlzLmNoaWxkcmVuID0gW107XG5cdCAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHQgICAgdGhpcy5zdHJpbmdQYXJhbXMgPSBvcHRpb25zLnN0cmluZ1BhcmFtcztcblx0ICAgIHRoaXMudHJhY2tJZHMgPSBvcHRpb25zLnRyYWNrSWRzO1xuXG5cdCAgICBvcHRpb25zLmJsb2NrUGFyYW1zID0gb3B0aW9ucy5ibG9ja1BhcmFtcyB8fCBbXTtcblxuXHQgICAgLy8gVGhlc2UgY2hhbmdlcyB3aWxsIHByb3BhZ2F0ZSB0byB0aGUgb3RoZXIgY29tcGlsZXIgY29tcG9uZW50c1xuXHQgICAgdmFyIGtub3duSGVscGVycyA9IG9wdGlvbnMua25vd25IZWxwZXJzO1xuXHQgICAgb3B0aW9ucy5rbm93bkhlbHBlcnMgPSB7XG5cdCAgICAgICdoZWxwZXJNaXNzaW5nJzogdHJ1ZSxcblx0ICAgICAgJ2Jsb2NrSGVscGVyTWlzc2luZyc6IHRydWUsXG5cdCAgICAgICdlYWNoJzogdHJ1ZSxcblx0ICAgICAgJ2lmJzogdHJ1ZSxcblx0ICAgICAgJ3VubGVzcyc6IHRydWUsXG5cdCAgICAgICd3aXRoJzogdHJ1ZSxcblx0ICAgICAgJ2xvZyc6IHRydWUsXG5cdCAgICAgICdsb29rdXAnOiB0cnVlXG5cdCAgICB9O1xuXHQgICAgaWYgKGtub3duSGVscGVycykge1xuXHQgICAgICBmb3IgKHZhciBfbmFtZSBpbiBrbm93bkhlbHBlcnMpIHtcblx0ICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHQgICAgICAgIGlmIChfbmFtZSBpbiBrbm93bkhlbHBlcnMpIHtcblx0ICAgICAgICAgIHRoaXMub3B0aW9ucy5rbm93bkhlbHBlcnNbX25hbWVdID0ga25vd25IZWxwZXJzW19uYW1lXTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHRoaXMuYWNjZXB0KHByb2dyYW0pO1xuXHQgIH0sXG5cblx0ICBjb21waWxlUHJvZ3JhbTogZnVuY3Rpb24gY29tcGlsZVByb2dyYW0ocHJvZ3JhbSkge1xuXHQgICAgdmFyIGNoaWxkQ29tcGlsZXIgPSBuZXcgdGhpcy5jb21waWxlcigpLFxuXHQgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbmV3LWNhcFxuXHQgICAgcmVzdWx0ID0gY2hpbGRDb21waWxlci5jb21waWxlKHByb2dyYW0sIHRoaXMub3B0aW9ucyksXG5cdCAgICAgICAgZ3VpZCA9IHRoaXMuZ3VpZCsrO1xuXG5cdCAgICB0aGlzLnVzZVBhcnRpYWwgPSB0aGlzLnVzZVBhcnRpYWwgfHwgcmVzdWx0LnVzZVBhcnRpYWw7XG5cblx0ICAgIHRoaXMuY2hpbGRyZW5bZ3VpZF0gPSByZXN1bHQ7XG5cdCAgICB0aGlzLnVzZURlcHRocyA9IHRoaXMudXNlRGVwdGhzIHx8IHJlc3VsdC51c2VEZXB0aHM7XG5cblx0ICAgIHJldHVybiBndWlkO1xuXHQgIH0sXG5cblx0ICBhY2NlcHQ6IGZ1bmN0aW9uIGFjY2VwdChub2RlKSB7XG5cdCAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogU2FuaXR5IGNvZGUgKi9cblx0ICAgIGlmICghdGhpc1tub2RlLnR5cGVdKSB7XG5cdCAgICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdVbmtub3duIHR5cGU6ICcgKyBub2RlLnR5cGUsIG5vZGUpO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLnNvdXJjZU5vZGUudW5zaGlmdChub2RlKTtcblx0ICAgIHZhciByZXQgPSB0aGlzW25vZGUudHlwZV0obm9kZSk7XG5cdCAgICB0aGlzLnNvdXJjZU5vZGUuc2hpZnQoKTtcblx0ICAgIHJldHVybiByZXQ7XG5cdCAgfSxcblxuXHQgIFByb2dyYW06IGZ1bmN0aW9uIFByb2dyYW0ocHJvZ3JhbSkge1xuXHQgICAgdGhpcy5vcHRpb25zLmJsb2NrUGFyYW1zLnVuc2hpZnQocHJvZ3JhbS5ibG9ja1BhcmFtcyk7XG5cblx0ICAgIHZhciBib2R5ID0gcHJvZ3JhbS5ib2R5LFxuXHQgICAgICAgIGJvZHlMZW5ndGggPSBib2R5Lmxlbmd0aDtcblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9keUxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIHRoaXMuYWNjZXB0KGJvZHlbaV0pO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLm9wdGlvbnMuYmxvY2tQYXJhbXMuc2hpZnQoKTtcblxuXHQgICAgdGhpcy5pc1NpbXBsZSA9IGJvZHlMZW5ndGggPT09IDE7XG5cdCAgICB0aGlzLmJsb2NrUGFyYW1zID0gcHJvZ3JhbS5ibG9ja1BhcmFtcyA/IHByb2dyYW0uYmxvY2tQYXJhbXMubGVuZ3RoIDogMDtcblxuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfSxcblxuXHQgIEJsb2NrU3RhdGVtZW50OiBmdW5jdGlvbiBCbG9ja1N0YXRlbWVudChibG9jaykge1xuXHQgICAgdHJhbnNmb3JtTGl0ZXJhbFRvUGF0aChibG9jayk7XG5cblx0ICAgIHZhciBwcm9ncmFtID0gYmxvY2sucHJvZ3JhbSxcblx0ICAgICAgICBpbnZlcnNlID0gYmxvY2suaW52ZXJzZTtcblxuXHQgICAgcHJvZ3JhbSA9IHByb2dyYW0gJiYgdGhpcy5jb21waWxlUHJvZ3JhbShwcm9ncmFtKTtcblx0ICAgIGludmVyc2UgPSBpbnZlcnNlICYmIHRoaXMuY29tcGlsZVByb2dyYW0oaW52ZXJzZSk7XG5cblx0ICAgIHZhciB0eXBlID0gdGhpcy5jbGFzc2lmeVNleHByKGJsb2NrKTtcblxuXHQgICAgaWYgKHR5cGUgPT09ICdoZWxwZXInKSB7XG5cdCAgICAgIHRoaXMuaGVscGVyU2V4cHIoYmxvY2ssIHByb2dyYW0sIGludmVyc2UpO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlID09PSAnc2ltcGxlJykge1xuXHQgICAgICB0aGlzLnNpbXBsZVNleHByKGJsb2NrKTtcblxuXHQgICAgICAvLyBub3cgdGhhdCB0aGUgc2ltcGxlIG11c3RhY2hlIGlzIHJlc29sdmVkLCB3ZSBuZWVkIHRvXG5cdCAgICAgIC8vIGV2YWx1YXRlIGl0IGJ5IGV4ZWN1dGluZyBgYmxvY2tIZWxwZXJNaXNzaW5nYFxuXHQgICAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBwcm9ncmFtKTtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgaW52ZXJzZSk7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdlbXB0eUhhc2gnKTtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2Jsb2NrVmFsdWUnLCBibG9jay5wYXRoLm9yaWdpbmFsKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMuYW1iaWd1b3VzU2V4cHIoYmxvY2ssIHByb2dyYW0sIGludmVyc2UpO1xuXG5cdCAgICAgIC8vIG5vdyB0aGF0IHRoZSBzaW1wbGUgbXVzdGFjaGUgaXMgcmVzb2x2ZWQsIHdlIG5lZWQgdG9cblx0ICAgICAgLy8gZXZhbHVhdGUgaXQgYnkgZXhlY3V0aW5nIGBibG9ja0hlbHBlck1pc3NpbmdgXG5cdCAgICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIHByb2dyYW0pO1xuXHQgICAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBpbnZlcnNlKTtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2VtcHR5SGFzaCcpO1xuXHQgICAgICB0aGlzLm9wY29kZSgnYW1iaWd1b3VzQmxvY2tWYWx1ZScpO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLm9wY29kZSgnYXBwZW5kJyk7XG5cdCAgfSxcblxuXHQgIERlY29yYXRvckJsb2NrOiBmdW5jdGlvbiBEZWNvcmF0b3JCbG9jayhkZWNvcmF0b3IpIHtcblx0ICAgIHZhciBwcm9ncmFtID0gZGVjb3JhdG9yLnByb2dyYW0gJiYgdGhpcy5jb21waWxlUHJvZ3JhbShkZWNvcmF0b3IucHJvZ3JhbSk7XG5cdCAgICB2YXIgcGFyYW1zID0gdGhpcy5zZXR1cEZ1bGxNdXN0YWNoZVBhcmFtcyhkZWNvcmF0b3IsIHByb2dyYW0sIHVuZGVmaW5lZCksXG5cdCAgICAgICAgcGF0aCA9IGRlY29yYXRvci5wYXRoO1xuXG5cdCAgICB0aGlzLnVzZURlY29yYXRvcnMgPSB0cnVlO1xuXHQgICAgdGhpcy5vcGNvZGUoJ3JlZ2lzdGVyRGVjb3JhdG9yJywgcGFyYW1zLmxlbmd0aCwgcGF0aC5vcmlnaW5hbCk7XG5cdCAgfSxcblxuXHQgIFBhcnRpYWxTdGF0ZW1lbnQ6IGZ1bmN0aW9uIFBhcnRpYWxTdGF0ZW1lbnQocGFydGlhbCkge1xuXHQgICAgdGhpcy51c2VQYXJ0aWFsID0gdHJ1ZTtcblxuXHQgICAgdmFyIHByb2dyYW0gPSBwYXJ0aWFsLnByb2dyYW07XG5cdCAgICBpZiAocHJvZ3JhbSkge1xuXHQgICAgICBwcm9ncmFtID0gdGhpcy5jb21waWxlUHJvZ3JhbShwYXJ0aWFsLnByb2dyYW0pO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgcGFyYW1zID0gcGFydGlhbC5wYXJhbXM7XG5cdCAgICBpZiAocGFyYW1zLmxlbmd0aCA+IDEpIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1Vuc3VwcG9ydGVkIG51bWJlciBvZiBwYXJ0aWFsIGFyZ3VtZW50czogJyArIHBhcmFtcy5sZW5ndGgsIHBhcnRpYWwpO1xuXHQgICAgfSBlbHNlIGlmICghcGFyYW1zLmxlbmd0aCkge1xuXHQgICAgICBpZiAodGhpcy5vcHRpb25zLmV4cGxpY2l0UGFydGlhbENvbnRleHQpIHtcblx0ICAgICAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCAndW5kZWZpbmVkJyk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcGFyYW1zLnB1c2goeyB0eXBlOiAnUGF0aEV4cHJlc3Npb24nLCBwYXJ0czogW10sIGRlcHRoOiAwIH0pO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHZhciBwYXJ0aWFsTmFtZSA9IHBhcnRpYWwubmFtZS5vcmlnaW5hbCxcblx0ICAgICAgICBpc0R5bmFtaWMgPSBwYXJ0aWFsLm5hbWUudHlwZSA9PT0gJ1N1YkV4cHJlc3Npb24nO1xuXHQgICAgaWYgKGlzRHluYW1pYykge1xuXHQgICAgICB0aGlzLmFjY2VwdChwYXJ0aWFsLm5hbWUpO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLnNldHVwRnVsbE11c3RhY2hlUGFyYW1zKHBhcnRpYWwsIHByb2dyYW0sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cblx0ICAgIHZhciBpbmRlbnQgPSBwYXJ0aWFsLmluZGVudCB8fCAnJztcblx0ICAgIGlmICh0aGlzLm9wdGlvbnMucHJldmVudEluZGVudCAmJiBpbmRlbnQpIHtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZENvbnRlbnQnLCBpbmRlbnQpO1xuXHQgICAgICBpbmRlbnQgPSAnJztcblx0ICAgIH1cblxuXHQgICAgdGhpcy5vcGNvZGUoJ2ludm9rZVBhcnRpYWwnLCBpc0R5bmFtaWMsIHBhcnRpYWxOYW1lLCBpbmRlbnQpO1xuXHQgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZCcpO1xuXHQgIH0sXG5cdCAgUGFydGlhbEJsb2NrU3RhdGVtZW50OiBmdW5jdGlvbiBQYXJ0aWFsQmxvY2tTdGF0ZW1lbnQocGFydGlhbEJsb2NrKSB7XG5cdCAgICB0aGlzLlBhcnRpYWxTdGF0ZW1lbnQocGFydGlhbEJsb2NrKTtcblx0ICB9LFxuXG5cdCAgTXVzdGFjaGVTdGF0ZW1lbnQ6IGZ1bmN0aW9uIE11c3RhY2hlU3RhdGVtZW50KG11c3RhY2hlKSB7XG5cdCAgICB0aGlzLlN1YkV4cHJlc3Npb24obXVzdGFjaGUpO1xuXG5cdCAgICBpZiAobXVzdGFjaGUuZXNjYXBlZCAmJiAhdGhpcy5vcHRpb25zLm5vRXNjYXBlKSB7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdhcHBlbmRFc2NhcGVkJyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLm9wY29kZSgnYXBwZW5kJyk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBEZWNvcmF0b3I6IGZ1bmN0aW9uIERlY29yYXRvcihkZWNvcmF0b3IpIHtcblx0ICAgIHRoaXMuRGVjb3JhdG9yQmxvY2soZGVjb3JhdG9yKTtcblx0ICB9LFxuXG5cdCAgQ29udGVudFN0YXRlbWVudDogZnVuY3Rpb24gQ29udGVudFN0YXRlbWVudChjb250ZW50KSB7XG5cdCAgICBpZiAoY29udGVudC52YWx1ZSkge1xuXHQgICAgICB0aGlzLm9wY29kZSgnYXBwZW5kQ29udGVudCcsIGNvbnRlbnQudmFsdWUpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBDb21tZW50U3RhdGVtZW50OiBmdW5jdGlvbiBDb21tZW50U3RhdGVtZW50KCkge30sXG5cblx0ICBTdWJFeHByZXNzaW9uOiBmdW5jdGlvbiBTdWJFeHByZXNzaW9uKHNleHByKSB7XG5cdCAgICB0cmFuc2Zvcm1MaXRlcmFsVG9QYXRoKHNleHByKTtcblx0ICAgIHZhciB0eXBlID0gdGhpcy5jbGFzc2lmeVNleHByKHNleHByKTtcblxuXHQgICAgaWYgKHR5cGUgPT09ICdzaW1wbGUnKSB7XG5cdCAgICAgIHRoaXMuc2ltcGxlU2V4cHIoc2V4cHIpO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlID09PSAnaGVscGVyJykge1xuXHQgICAgICB0aGlzLmhlbHBlclNleHByKHNleHByKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMuYW1iaWd1b3VzU2V4cHIoc2V4cHIpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgYW1iaWd1b3VzU2V4cHI6IGZ1bmN0aW9uIGFtYmlndW91c1NleHByKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlKSB7XG5cdCAgICB2YXIgcGF0aCA9IHNleHByLnBhdGgsXG5cdCAgICAgICAgbmFtZSA9IHBhdGgucGFydHNbMF0sXG5cdCAgICAgICAgaXNCbG9jayA9IHByb2dyYW0gIT0gbnVsbCB8fCBpbnZlcnNlICE9IG51bGw7XG5cblx0ICAgIHRoaXMub3Bjb2RlKCdnZXRDb250ZXh0JywgcGF0aC5kZXB0aCk7XG5cblx0ICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIHByb2dyYW0pO1xuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgaW52ZXJzZSk7XG5cblx0ICAgIHBhdGguc3RyaWN0ID0gdHJ1ZTtcblx0ICAgIHRoaXMuYWNjZXB0KHBhdGgpO1xuXG5cdCAgICB0aGlzLm9wY29kZSgnaW52b2tlQW1iaWd1b3VzJywgbmFtZSwgaXNCbG9jayk7XG5cdCAgfSxcblxuXHQgIHNpbXBsZVNleHByOiBmdW5jdGlvbiBzaW1wbGVTZXhwcihzZXhwcikge1xuXHQgICAgdmFyIHBhdGggPSBzZXhwci5wYXRoO1xuXHQgICAgcGF0aC5zdHJpY3QgPSB0cnVlO1xuXHQgICAgdGhpcy5hY2NlcHQocGF0aCk7XG5cdCAgICB0aGlzLm9wY29kZSgncmVzb2x2ZVBvc3NpYmxlTGFtYmRhJyk7XG5cdCAgfSxcblxuXHQgIGhlbHBlclNleHByOiBmdW5jdGlvbiBoZWxwZXJTZXhwcihzZXhwciwgcHJvZ3JhbSwgaW52ZXJzZSkge1xuXHQgICAgdmFyIHBhcmFtcyA9IHRoaXMuc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXMoc2V4cHIsIHByb2dyYW0sIGludmVyc2UpLFxuXHQgICAgICAgIHBhdGggPSBzZXhwci5wYXRoLFxuXHQgICAgICAgIG5hbWUgPSBwYXRoLnBhcnRzWzBdO1xuXG5cdCAgICBpZiAodGhpcy5vcHRpb25zLmtub3duSGVscGVyc1tuYW1lXSkge1xuXHQgICAgICB0aGlzLm9wY29kZSgnaW52b2tlS25vd25IZWxwZXInLCBwYXJhbXMubGVuZ3RoLCBuYW1lKTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmtub3duSGVscGVyc09ubHkpIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1lvdSBzcGVjaWZpZWQga25vd25IZWxwZXJzT25seSwgYnV0IHVzZWQgdGhlIHVua25vd24gaGVscGVyICcgKyBuYW1lLCBzZXhwcik7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBwYXRoLnN0cmljdCA9IHRydWU7XG5cdCAgICAgIHBhdGguZmFsc3kgPSB0cnVlO1xuXG5cdCAgICAgIHRoaXMuYWNjZXB0KHBhdGgpO1xuXHQgICAgICB0aGlzLm9wY29kZSgnaW52b2tlSGVscGVyJywgcGFyYW1zLmxlbmd0aCwgcGF0aC5vcmlnaW5hbCwgX2FzdDJbJ2RlZmF1bHQnXS5oZWxwZXJzLnNpbXBsZUlkKHBhdGgpKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgUGF0aEV4cHJlc3Npb246IGZ1bmN0aW9uIFBhdGhFeHByZXNzaW9uKHBhdGgpIHtcblx0ICAgIHRoaXMuYWRkRGVwdGgocGF0aC5kZXB0aCk7XG5cdCAgICB0aGlzLm9wY29kZSgnZ2V0Q29udGV4dCcsIHBhdGguZGVwdGgpO1xuXG5cdCAgICB2YXIgbmFtZSA9IHBhdGgucGFydHNbMF0sXG5cdCAgICAgICAgc2NvcGVkID0gX2FzdDJbJ2RlZmF1bHQnXS5oZWxwZXJzLnNjb3BlZElkKHBhdGgpLFxuXHQgICAgICAgIGJsb2NrUGFyYW1JZCA9ICFwYXRoLmRlcHRoICYmICFzY29wZWQgJiYgdGhpcy5ibG9ja1BhcmFtSW5kZXgobmFtZSk7XG5cblx0ICAgIGlmIChibG9ja1BhcmFtSWQpIHtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2xvb2t1cEJsb2NrUGFyYW0nLCBibG9ja1BhcmFtSWQsIHBhdGgucGFydHMpO1xuXHQgICAgfSBlbHNlIGlmICghbmFtZSkge1xuXHQgICAgICAvLyBDb250ZXh0IHJlZmVyZW5jZSwgaS5lLiBge3tmb28gLn19YCBvciBge3tmb28gLi59fWBcblx0ICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hDb250ZXh0Jyk7XG5cdCAgICB9IGVsc2UgaWYgKHBhdGguZGF0YSkge1xuXHQgICAgICB0aGlzLm9wdGlvbnMuZGF0YSA9IHRydWU7XG5cdCAgICAgIHRoaXMub3Bjb2RlKCdsb29rdXBEYXRhJywgcGF0aC5kZXB0aCwgcGF0aC5wYXJ0cywgcGF0aC5zdHJpY3QpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2xvb2t1cE9uQ29udGV4dCcsIHBhdGgucGFydHMsIHBhdGguZmFsc3ksIHBhdGguc3RyaWN0LCBzY29wZWQpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBTdHJpbmdMaXRlcmFsOiBmdW5jdGlvbiBTdHJpbmdMaXRlcmFsKHN0cmluZykge1xuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hTdHJpbmcnLCBzdHJpbmcudmFsdWUpO1xuXHQgIH0sXG5cblx0ICBOdW1iZXJMaXRlcmFsOiBmdW5jdGlvbiBOdW1iZXJMaXRlcmFsKG51bWJlcikge1xuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgbnVtYmVyLnZhbHVlKTtcblx0ICB9LFxuXG5cdCAgQm9vbGVhbkxpdGVyYWw6IGZ1bmN0aW9uIEJvb2xlYW5MaXRlcmFsKGJvb2wpIHtcblx0ICAgIHRoaXMub3Bjb2RlKCdwdXNoTGl0ZXJhbCcsIGJvb2wudmFsdWUpO1xuXHQgIH0sXG5cblx0ICBVbmRlZmluZWRMaXRlcmFsOiBmdW5jdGlvbiBVbmRlZmluZWRMaXRlcmFsKCkge1xuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgJ3VuZGVmaW5lZCcpO1xuXHQgIH0sXG5cblx0ICBOdWxsTGl0ZXJhbDogZnVuY3Rpb24gTnVsbExpdGVyYWwoKSB7XG5cdCAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCAnbnVsbCcpO1xuXHQgIH0sXG5cblx0ICBIYXNoOiBmdW5jdGlvbiBIYXNoKGhhc2gpIHtcblx0ICAgIHZhciBwYWlycyA9IGhhc2gucGFpcnMsXG5cdCAgICAgICAgaSA9IDAsXG5cdCAgICAgICAgbCA9IHBhaXJzLmxlbmd0aDtcblxuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hIYXNoJyk7XG5cblx0ICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgIHRoaXMucHVzaFBhcmFtKHBhaXJzW2ldLnZhbHVlKTtcblx0ICAgIH1cblx0ICAgIHdoaWxlIChpLS0pIHtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2Fzc2lnblRvSGFzaCcsIHBhaXJzW2ldLmtleSk7XG5cdCAgICB9XG5cdCAgICB0aGlzLm9wY29kZSgncG9wSGFzaCcpO1xuXHQgIH0sXG5cblx0ICAvLyBIRUxQRVJTXG5cdCAgb3Bjb2RlOiBmdW5jdGlvbiBvcGNvZGUobmFtZSkge1xuXHQgICAgdGhpcy5vcGNvZGVzLnB1c2goeyBvcGNvZGU6IG5hbWUsIGFyZ3M6IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgbG9jOiB0aGlzLnNvdXJjZU5vZGVbMF0ubG9jIH0pO1xuXHQgIH0sXG5cblx0ICBhZGREZXB0aDogZnVuY3Rpb24gYWRkRGVwdGgoZGVwdGgpIHtcblx0ICAgIGlmICghZGVwdGgpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLnVzZURlcHRocyA9IHRydWU7XG5cdCAgfSxcblxuXHQgIGNsYXNzaWZ5U2V4cHI6IGZ1bmN0aW9uIGNsYXNzaWZ5U2V4cHIoc2V4cHIpIHtcblx0ICAgIHZhciBpc1NpbXBsZSA9IF9hc3QyWydkZWZhdWx0J10uaGVscGVycy5zaW1wbGVJZChzZXhwci5wYXRoKTtcblxuXHQgICAgdmFyIGlzQmxvY2tQYXJhbSA9IGlzU2ltcGxlICYmICEhdGhpcy5ibG9ja1BhcmFtSW5kZXgoc2V4cHIucGF0aC5wYXJ0c1swXSk7XG5cblx0ICAgIC8vIGEgbXVzdGFjaGUgaXMgYW4gZWxpZ2libGUgaGVscGVyIGlmOlxuXHQgICAgLy8gKiBpdHMgaWQgaXMgc2ltcGxlIChhIHNpbmdsZSBwYXJ0LCBub3QgYHRoaXNgIG9yIGAuLmApXG5cdCAgICB2YXIgaXNIZWxwZXIgPSAhaXNCbG9ja1BhcmFtICYmIF9hc3QyWydkZWZhdWx0J10uaGVscGVycy5oZWxwZXJFeHByZXNzaW9uKHNleHByKTtcblxuXHQgICAgLy8gaWYgYSBtdXN0YWNoZSBpcyBhbiBlbGlnaWJsZSBoZWxwZXIgYnV0IG5vdCBhIGRlZmluaXRlXG5cdCAgICAvLyBoZWxwZXIsIGl0IGlzIGFtYmlndW91cywgYW5kIHdpbGwgYmUgcmVzb2x2ZWQgaW4gYSBsYXRlclxuXHQgICAgLy8gcGFzcyBvciBhdCBydW50aW1lLlxuXHQgICAgdmFyIGlzRWxpZ2libGUgPSAhaXNCbG9ja1BhcmFtICYmIChpc0hlbHBlciB8fCBpc1NpbXBsZSk7XG5cblx0ICAgIC8vIGlmIGFtYmlndW91cywgd2UgY2FuIHBvc3NpYmx5IHJlc29sdmUgdGhlIGFtYmlndWl0eSBub3dcblx0ICAgIC8vIEFuIGVsaWdpYmxlIGhlbHBlciBpcyBvbmUgdGhhdCBkb2VzIG5vdCBoYXZlIGEgY29tcGxleCBwYXRoLCBpLmUuIGB0aGlzLmZvb2AsIGAuLi9mb29gIGV0Yy5cblx0ICAgIGlmIChpc0VsaWdpYmxlICYmICFpc0hlbHBlcikge1xuXHQgICAgICB2YXIgX25hbWUyID0gc2V4cHIucGF0aC5wYXJ0c1swXSxcblx0ICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cblx0ICAgICAgaWYgKG9wdGlvbnMua25vd25IZWxwZXJzW19uYW1lMl0pIHtcblx0ICAgICAgICBpc0hlbHBlciA9IHRydWU7XG5cdCAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5rbm93bkhlbHBlcnNPbmx5KSB7XG5cdCAgICAgICAgaXNFbGlnaWJsZSA9IGZhbHNlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGlmIChpc0hlbHBlcikge1xuXHQgICAgICByZXR1cm4gJ2hlbHBlcic7XG5cdCAgICB9IGVsc2UgaWYgKGlzRWxpZ2libGUpIHtcblx0ICAgICAgcmV0dXJuICdhbWJpZ3VvdXMnO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuICdzaW1wbGUnO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBwdXNoUGFyYW1zOiBmdW5jdGlvbiBwdXNoUGFyYW1zKHBhcmFtcykge1xuXHQgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXJhbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgIHRoaXMucHVzaFBhcmFtKHBhcmFtc1tpXSk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHB1c2hQYXJhbTogZnVuY3Rpb24gcHVzaFBhcmFtKHZhbCkge1xuXHQgICAgdmFyIHZhbHVlID0gdmFsLnZhbHVlICE9IG51bGwgPyB2YWwudmFsdWUgOiB2YWwub3JpZ2luYWwgfHwgJyc7XG5cblx0ICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuXHQgICAgICBpZiAodmFsdWUucmVwbGFjZSkge1xuXHQgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXihcXC4/XFwuXFwvKSovZywgJycpLnJlcGxhY2UoL1xcLy9nLCAnLicpO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKHZhbC5kZXB0aCkge1xuXHQgICAgICAgIHRoaXMuYWRkRGVwdGgodmFsLmRlcHRoKTtcblx0ICAgICAgfVxuXHQgICAgICB0aGlzLm9wY29kZSgnZ2V0Q29udGV4dCcsIHZhbC5kZXB0aCB8fCAwKTtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hTdHJpbmdQYXJhbScsIHZhbHVlLCB2YWwudHlwZSk7XG5cblx0ICAgICAgaWYgKHZhbC50eXBlID09PSAnU3ViRXhwcmVzc2lvbicpIHtcblx0ICAgICAgICAvLyBTdWJFeHByZXNzaW9ucyBnZXQgZXZhbHVhdGVkIGFuZCBwYXNzZWQgaW5cblx0ICAgICAgICAvLyBpbiBzdHJpbmcgcGFyYW1zIG1vZGUuXG5cdCAgICAgICAgdGhpcy5hY2NlcHQodmFsKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcblx0ICAgICAgICB2YXIgYmxvY2tQYXJhbUluZGV4ID0gdW5kZWZpbmVkO1xuXHQgICAgICAgIGlmICh2YWwucGFydHMgJiYgIV9hc3QyWydkZWZhdWx0J10uaGVscGVycy5zY29wZWRJZCh2YWwpICYmICF2YWwuZGVwdGgpIHtcblx0ICAgICAgICAgIGJsb2NrUGFyYW1JbmRleCA9IHRoaXMuYmxvY2tQYXJhbUluZGV4KHZhbC5wYXJ0c1swXSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmIChibG9ja1BhcmFtSW5kZXgpIHtcblx0ICAgICAgICAgIHZhciBibG9ja1BhcmFtQ2hpbGQgPSB2YWwucGFydHMuc2xpY2UoMSkuam9pbignLicpO1xuXHQgICAgICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hJZCcsICdCbG9ja1BhcmFtJywgYmxvY2tQYXJhbUluZGV4LCBibG9ja1BhcmFtQ2hpbGQpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICB2YWx1ZSA9IHZhbC5vcmlnaW5hbCB8fCB2YWx1ZTtcblx0ICAgICAgICAgIGlmICh2YWx1ZS5yZXBsYWNlKSB7XG5cdCAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXnRoaXMoPzpcXC58JCkvLCAnJykucmVwbGFjZSgvXlxcLlxcLy8sICcnKS5yZXBsYWNlKC9eXFwuJC8sICcnKTtcblx0ICAgICAgICAgIH1cblxuXHQgICAgICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hJZCcsIHZhbC50eXBlLCB2YWx1ZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHRoaXMuYWNjZXB0KHZhbCk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHNldHVwRnVsbE11c3RhY2hlUGFyYW1zOiBmdW5jdGlvbiBzZXR1cEZ1bGxNdXN0YWNoZVBhcmFtcyhzZXhwciwgcHJvZ3JhbSwgaW52ZXJzZSwgb21pdEVtcHR5KSB7XG5cdCAgICB2YXIgcGFyYW1zID0gc2V4cHIucGFyYW1zO1xuXHQgICAgdGhpcy5wdXNoUGFyYW1zKHBhcmFtcyk7XG5cblx0ICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIHByb2dyYW0pO1xuXHQgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgaW52ZXJzZSk7XG5cblx0ICAgIGlmIChzZXhwci5oYXNoKSB7XG5cdCAgICAgIHRoaXMuYWNjZXB0KHNleHByLmhhc2gpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5vcGNvZGUoJ2VtcHR5SGFzaCcsIG9taXRFbXB0eSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBwYXJhbXM7XG5cdCAgfSxcblxuXHQgIGJsb2NrUGFyYW1JbmRleDogZnVuY3Rpb24gYmxvY2tQYXJhbUluZGV4KG5hbWUpIHtcblx0ICAgIGZvciAodmFyIGRlcHRoID0gMCwgbGVuID0gdGhpcy5vcHRpb25zLmJsb2NrUGFyYW1zLmxlbmd0aDsgZGVwdGggPCBsZW47IGRlcHRoKyspIHtcblx0ICAgICAgdmFyIGJsb2NrUGFyYW1zID0gdGhpcy5vcHRpb25zLmJsb2NrUGFyYW1zW2RlcHRoXSxcblx0ICAgICAgICAgIHBhcmFtID0gYmxvY2tQYXJhbXMgJiYgX3V0aWxzLmluZGV4T2YoYmxvY2tQYXJhbXMsIG5hbWUpO1xuXHQgICAgICBpZiAoYmxvY2tQYXJhbXMgJiYgcGFyYW0gPj0gMCkge1xuXHQgICAgICAgIHJldHVybiBbZGVwdGgsIHBhcmFtXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0fTtcblxuXHRmdW5jdGlvbiBwcmVjb21waWxlKGlucHV0LCBvcHRpb25zLCBlbnYpIHtcblx0ICBpZiAoaW5wdXQgPT0gbnVsbCB8fCB0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnICYmIGlucHV0LnR5cGUgIT09ICdQcm9ncmFtJykge1xuXHQgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ1lvdSBtdXN0IHBhc3MgYSBzdHJpbmcgb3IgSGFuZGxlYmFycyBBU1QgdG8gSGFuZGxlYmFycy5wcmVjb21waWxlLiBZb3UgcGFzc2VkICcgKyBpbnB1dCk7XG5cdCAgfVxuXG5cdCAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdCAgaWYgKCEoJ2RhdGEnIGluIG9wdGlvbnMpKSB7XG5cdCAgICBvcHRpb25zLmRhdGEgPSB0cnVlO1xuXHQgIH1cblx0ICBpZiAob3B0aW9ucy5jb21wYXQpIHtcblx0ICAgIG9wdGlvbnMudXNlRGVwdGhzID0gdHJ1ZTtcblx0ICB9XG5cblx0ICB2YXIgYXN0ID0gZW52LnBhcnNlKGlucHV0LCBvcHRpb25zKSxcblx0ICAgICAgZW52aXJvbm1lbnQgPSBuZXcgZW52LkNvbXBpbGVyKCkuY29tcGlsZShhc3QsIG9wdGlvbnMpO1xuXHQgIHJldHVybiBuZXcgZW52LkphdmFTY3JpcHRDb21waWxlcigpLmNvbXBpbGUoZW52aXJvbm1lbnQsIG9wdGlvbnMpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY29tcGlsZShpbnB1dCwgb3B0aW9ucywgZW52KSB7XG5cdCAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkgb3B0aW9ucyA9IHt9O1xuXG5cdCAgaWYgKGlucHV0ID09IG51bGwgfHwgdHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyAmJiBpbnB1dC50eXBlICE9PSAnUHJvZ3JhbScpIHtcblx0ICAgIHRocm93IG5ldyBfZXhjZXB0aW9uMlsnZGVmYXVsdCddKCdZb3UgbXVzdCBwYXNzIGEgc3RyaW5nIG9yIEhhbmRsZWJhcnMgQVNUIHRvIEhhbmRsZWJhcnMuY29tcGlsZS4gWW91IHBhc3NlZCAnICsgaW5wdXQpO1xuXHQgIH1cblxuXHQgIG9wdGlvbnMgPSBfdXRpbHMuZXh0ZW5kKHt9LCBvcHRpb25zKTtcblx0ICBpZiAoISgnZGF0YScgaW4gb3B0aW9ucykpIHtcblx0ICAgIG9wdGlvbnMuZGF0YSA9IHRydWU7XG5cdCAgfVxuXHQgIGlmIChvcHRpb25zLmNvbXBhdCkge1xuXHQgICAgb3B0aW9ucy51c2VEZXB0aHMgPSB0cnVlO1xuXHQgIH1cblxuXHQgIHZhciBjb21waWxlZCA9IHVuZGVmaW5lZDtcblxuXHQgIGZ1bmN0aW9uIGNvbXBpbGVJbnB1dCgpIHtcblx0ICAgIHZhciBhc3QgPSBlbnYucGFyc2UoaW5wdXQsIG9wdGlvbnMpLFxuXHQgICAgICAgIGVudmlyb25tZW50ID0gbmV3IGVudi5Db21waWxlcigpLmNvbXBpbGUoYXN0LCBvcHRpb25zKSxcblx0ICAgICAgICB0ZW1wbGF0ZVNwZWMgPSBuZXcgZW52LkphdmFTY3JpcHRDb21waWxlcigpLmNvbXBpbGUoZW52aXJvbm1lbnQsIG9wdGlvbnMsIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cdCAgICByZXR1cm4gZW52LnRlbXBsYXRlKHRlbXBsYXRlU3BlYyk7XG5cdCAgfVxuXG5cdCAgLy8gVGVtcGxhdGUgaXMgb25seSBjb21waWxlZCBvbiBmaXJzdCB1c2UgYW5kIGNhY2hlZCBhZnRlciB0aGF0IHBvaW50LlxuXHQgIGZ1bmN0aW9uIHJldChjb250ZXh0LCBleGVjT3B0aW9ucykge1xuXHQgICAgaWYgKCFjb21waWxlZCkge1xuXHQgICAgICBjb21waWxlZCA9IGNvbXBpbGVJbnB1dCgpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGNvbXBpbGVkLmNhbGwodGhpcywgY29udGV4dCwgZXhlY09wdGlvbnMpO1xuXHQgIH1cblx0ICByZXQuX3NldHVwID0gZnVuY3Rpb24gKHNldHVwT3B0aW9ucykge1xuXHQgICAgaWYgKCFjb21waWxlZCkge1xuXHQgICAgICBjb21waWxlZCA9IGNvbXBpbGVJbnB1dCgpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGNvbXBpbGVkLl9zZXR1cChzZXR1cE9wdGlvbnMpO1xuXHQgIH07XG5cdCAgcmV0Ll9jaGlsZCA9IGZ1bmN0aW9uIChpLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG5cdCAgICBpZiAoIWNvbXBpbGVkKSB7XG5cdCAgICAgIGNvbXBpbGVkID0gY29tcGlsZUlucHV0KCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gY29tcGlsZWQuX2NoaWxkKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuXHQgIH07XG5cdCAgcmV0dXJuIHJldDtcblx0fVxuXG5cdGZ1bmN0aW9uIGFyZ0VxdWFscyhhLCBiKSB7XG5cdCAgaWYgKGEgPT09IGIpIHtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblxuXHQgIGlmIChfdXRpbHMuaXNBcnJheShhKSAmJiBfdXRpbHMuaXNBcnJheShiKSAmJiBhLmxlbmd0aCA9PT0gYi5sZW5ndGgpIHtcblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuXHQgICAgICBpZiAoIWFyZ0VxdWFscyhhW2ldLCBiW2ldKSkge1xuXHQgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gdHJhbnNmb3JtTGl0ZXJhbFRvUGF0aChzZXhwcikge1xuXHQgIGlmICghc2V4cHIucGF0aC5wYXJ0cykge1xuXHQgICAgdmFyIGxpdGVyYWwgPSBzZXhwci5wYXRoO1xuXHQgICAgLy8gQ2FzdGluZyB0byBzdHJpbmcgaGVyZSB0byBtYWtlIGZhbHNlIGFuZCAwIGxpdGVyYWwgdmFsdWVzIHBsYXkgbmljZWx5IHdpdGggdGhlIHJlc3Rcblx0ICAgIC8vIG9mIHRoZSBzeXN0ZW0uXG5cdCAgICBzZXhwci5wYXRoID0ge1xuXHQgICAgICB0eXBlOiAnUGF0aEV4cHJlc3Npb24nLFxuXHQgICAgICBkYXRhOiBmYWxzZSxcblx0ICAgICAgZGVwdGg6IDAsXG5cdCAgICAgIHBhcnRzOiBbbGl0ZXJhbC5vcmlnaW5hbCArICcnXSxcblx0ICAgICAgb3JpZ2luYWw6IGxpdGVyYWwub3JpZ2luYWwgKyAnJyxcblx0ICAgICAgbG9jOiBsaXRlcmFsLmxvY1xuXHQgICAgfTtcblx0ICB9XG5cdH1cblxuLyoqKi8gfSksXG4vKiA0MiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSlbJ2RlZmF1bHQnXTtcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfYmFzZSA9IF9fd2VicGFja19yZXF1aXJlX18oNCk7XG5cblx0dmFyIF9leGNlcHRpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG5cdHZhciBfZXhjZXB0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4Y2VwdGlvbik7XG5cblx0dmFyIF91dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cblx0dmFyIF9jb2RlR2VuID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0Myk7XG5cblx0dmFyIF9jb2RlR2VuMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvZGVHZW4pO1xuXG5cdGZ1bmN0aW9uIExpdGVyYWwodmFsdWUpIHtcblx0ICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cdH1cblxuXHRmdW5jdGlvbiBKYXZhU2NyaXB0Q29tcGlsZXIoKSB7fVxuXG5cdEphdmFTY3JpcHRDb21waWxlci5wcm90b3R5cGUgPSB7XG5cdCAgLy8gUFVCTElDIEFQSTogWW91IGNhbiBvdmVycmlkZSB0aGVzZSBtZXRob2RzIGluIGEgc3ViY2xhc3MgdG8gcHJvdmlkZVxuXHQgIC8vIGFsdGVybmF0aXZlIGNvbXBpbGVkIGZvcm1zIGZvciBuYW1lIGxvb2t1cCBhbmQgYnVmZmVyaW5nIHNlbWFudGljc1xuXHQgIG5hbWVMb29rdXA6IGZ1bmN0aW9uIG5hbWVMb29rdXAocGFyZW50LCBuYW1lIC8qICwgdHlwZSovKSB7XG5cdCAgICBpZiAoSmF2YVNjcmlwdENvbXBpbGVyLmlzVmFsaWRKYXZhU2NyaXB0VmFyaWFibGVOYW1lKG5hbWUpKSB7XG5cdCAgICAgIHJldHVybiBbcGFyZW50LCAnLicsIG5hbWVdO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuIFtwYXJlbnQsICdbJywgSlNPTi5zdHJpbmdpZnkobmFtZSksICddJ107XG5cdCAgICB9XG5cdCAgfSxcblx0ICBkZXB0aGVkTG9va3VwOiBmdW5jdGlvbiBkZXB0aGVkTG9va3VwKG5hbWUpIHtcblx0ICAgIHJldHVybiBbdGhpcy5hbGlhc2FibGUoJ2NvbnRhaW5lci5sb29rdXAnKSwgJyhkZXB0aHMsIFwiJywgbmFtZSwgJ1wiKSddO1xuXHQgIH0sXG5cblx0ICBjb21waWxlckluZm86IGZ1bmN0aW9uIGNvbXBpbGVySW5mbygpIHtcblx0ICAgIHZhciByZXZpc2lvbiA9IF9iYXNlLkNPTVBJTEVSX1JFVklTSU9OLFxuXHQgICAgICAgIHZlcnNpb25zID0gX2Jhc2UuUkVWSVNJT05fQ0hBTkdFU1tyZXZpc2lvbl07XG5cdCAgICByZXR1cm4gW3JldmlzaW9uLCB2ZXJzaW9uc107XG5cdCAgfSxcblxuXHQgIGFwcGVuZFRvQnVmZmVyOiBmdW5jdGlvbiBhcHBlbmRUb0J1ZmZlcihzb3VyY2UsIGxvY2F0aW9uLCBleHBsaWNpdCkge1xuXHQgICAgLy8gRm9yY2UgYSBzb3VyY2UgYXMgdGhpcyBzaW1wbGlmaWVzIHRoZSBtZXJnZSBsb2dpYy5cblx0ICAgIGlmICghX3V0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuXHQgICAgICBzb3VyY2UgPSBbc291cmNlXTtcblx0ICAgIH1cblx0ICAgIHNvdXJjZSA9IHRoaXMuc291cmNlLndyYXAoc291cmNlLCBsb2NhdGlvbik7XG5cblx0ICAgIGlmICh0aGlzLmVudmlyb25tZW50LmlzU2ltcGxlKSB7XG5cdCAgICAgIHJldHVybiBbJ3JldHVybiAnLCBzb3VyY2UsICc7J107XG5cdCAgICB9IGVsc2UgaWYgKGV4cGxpY2l0KSB7XG5cdCAgICAgIC8vIFRoaXMgaXMgYSBjYXNlIHdoZXJlIHRoZSBidWZmZXIgb3BlcmF0aW9uIG9jY3VycyBhcyBhIGNoaWxkIG9mIGFub3RoZXJcblx0ICAgICAgLy8gY29uc3RydWN0LCBnZW5lcmFsbHkgYnJhY2VzLiBXZSBoYXZlIHRvIGV4cGxpY2l0bHkgb3V0cHV0IHRoZXNlIGJ1ZmZlclxuXHQgICAgICAvLyBvcGVyYXRpb25zIHRvIGVuc3VyZSB0aGF0IHRoZSBlbWl0dGVkIGNvZGUgZ29lcyBpbiB0aGUgY29ycmVjdCBsb2NhdGlvbi5cblx0ICAgICAgcmV0dXJuIFsnYnVmZmVyICs9ICcsIHNvdXJjZSwgJzsnXTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNvdXJjZS5hcHBlbmRUb0J1ZmZlciA9IHRydWU7XG5cdCAgICAgIHJldHVybiBzb3VyY2U7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIGluaXRpYWxpemVCdWZmZXI6IGZ1bmN0aW9uIGluaXRpYWxpemVCdWZmZXIoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5xdW90ZWRTdHJpbmcoJycpO1xuXHQgIH0sXG5cdCAgLy8gRU5EIFBVQkxJQyBBUElcblxuXHQgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUoZW52aXJvbm1lbnQsIG9wdGlvbnMsIGNvbnRleHQsIGFzT2JqZWN0KSB7XG5cdCAgICB0aGlzLmVudmlyb25tZW50ID0gZW52aXJvbm1lbnQ7XG5cdCAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHQgICAgdGhpcy5zdHJpbmdQYXJhbXMgPSB0aGlzLm9wdGlvbnMuc3RyaW5nUGFyYW1zO1xuXHQgICAgdGhpcy50cmFja0lkcyA9IHRoaXMub3B0aW9ucy50cmFja0lkcztcblx0ICAgIHRoaXMucHJlY29tcGlsZSA9ICFhc09iamVjdDtcblxuXHQgICAgdGhpcy5uYW1lID0gdGhpcy5lbnZpcm9ubWVudC5uYW1lO1xuXHQgICAgdGhpcy5pc0NoaWxkID0gISFjb250ZXh0O1xuXHQgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dCB8fCB7XG5cdCAgICAgIGRlY29yYXRvcnM6IFtdLFxuXHQgICAgICBwcm9ncmFtczogW10sXG5cdCAgICAgIGVudmlyb25tZW50czogW11cblx0ICAgIH07XG5cblx0ICAgIHRoaXMucHJlYW1ibGUoKTtcblxuXHQgICAgdGhpcy5zdGFja1Nsb3QgPSAwO1xuXHQgICAgdGhpcy5zdGFja1ZhcnMgPSBbXTtcblx0ICAgIHRoaXMuYWxpYXNlcyA9IHt9O1xuXHQgICAgdGhpcy5yZWdpc3RlcnMgPSB7IGxpc3Q6IFtdIH07XG5cdCAgICB0aGlzLmhhc2hlcyA9IFtdO1xuXHQgICAgdGhpcy5jb21waWxlU3RhY2sgPSBbXTtcblx0ICAgIHRoaXMuaW5saW5lU3RhY2sgPSBbXTtcblx0ICAgIHRoaXMuYmxvY2tQYXJhbXMgPSBbXTtcblxuXHQgICAgdGhpcy5jb21waWxlQ2hpbGRyZW4oZW52aXJvbm1lbnQsIG9wdGlvbnMpO1xuXG5cdCAgICB0aGlzLnVzZURlcHRocyA9IHRoaXMudXNlRGVwdGhzIHx8IGVudmlyb25tZW50LnVzZURlcHRocyB8fCBlbnZpcm9ubWVudC51c2VEZWNvcmF0b3JzIHx8IHRoaXMub3B0aW9ucy5jb21wYXQ7XG5cdCAgICB0aGlzLnVzZUJsb2NrUGFyYW1zID0gdGhpcy51c2VCbG9ja1BhcmFtcyB8fCBlbnZpcm9ubWVudC51c2VCbG9ja1BhcmFtcztcblxuXHQgICAgdmFyIG9wY29kZXMgPSBlbnZpcm9ubWVudC5vcGNvZGVzLFxuXHQgICAgICAgIG9wY29kZSA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBmaXJzdExvYyA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBpID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGwgPSB1bmRlZmluZWQ7XG5cblx0ICAgIGZvciAoaSA9IDAsIGwgPSBvcGNvZGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICBvcGNvZGUgPSBvcGNvZGVzW2ldO1xuXG5cdCAgICAgIHRoaXMuc291cmNlLmN1cnJlbnRMb2NhdGlvbiA9IG9wY29kZS5sb2M7XG5cdCAgICAgIGZpcnN0TG9jID0gZmlyc3RMb2MgfHwgb3Bjb2RlLmxvYztcblx0ICAgICAgdGhpc1tvcGNvZGUub3Bjb2RlXS5hcHBseSh0aGlzLCBvcGNvZGUuYXJncyk7XG5cdCAgICB9XG5cblx0ICAgIC8vIEZsdXNoIGFueSB0cmFpbGluZyBjb250ZW50IHRoYXQgbWlnaHQgYmUgcGVuZGluZy5cblx0ICAgIHRoaXMuc291cmNlLmN1cnJlbnRMb2NhdGlvbiA9IGZpcnN0TG9jO1xuXHQgICAgdGhpcy5wdXNoU291cmNlKCcnKTtcblxuXHQgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICAgIGlmICh0aGlzLnN0YWNrU2xvdCB8fCB0aGlzLmlubGluZVN0YWNrLmxlbmd0aCB8fCB0aGlzLmNvbXBpbGVTdGFjay5sZW5ndGgpIHtcblx0ICAgICAgdGhyb3cgbmV3IF9leGNlcHRpb24yWydkZWZhdWx0J10oJ0NvbXBpbGUgY29tcGxldGVkIHdpdGggY29udGVudCBsZWZ0IG9uIHN0YWNrJyk7XG5cdCAgICB9XG5cblx0ICAgIGlmICghdGhpcy5kZWNvcmF0b3JzLmlzRW1wdHkoKSkge1xuXHQgICAgICB0aGlzLnVzZURlY29yYXRvcnMgPSB0cnVlO1xuXG5cdCAgICAgIHRoaXMuZGVjb3JhdG9ycy5wcmVwZW5kKCd2YXIgZGVjb3JhdG9ycyA9IGNvbnRhaW5lci5kZWNvcmF0b3JzO1xcbicpO1xuXHQgICAgICB0aGlzLmRlY29yYXRvcnMucHVzaCgncmV0dXJuIGZuOycpO1xuXG5cdCAgICAgIGlmIChhc09iamVjdCkge1xuXHQgICAgICAgIHRoaXMuZGVjb3JhdG9ycyA9IEZ1bmN0aW9uLmFwcGx5KHRoaXMsIFsnZm4nLCAncHJvcHMnLCAnY29udGFpbmVyJywgJ2RlcHRoMCcsICdkYXRhJywgJ2Jsb2NrUGFyYW1zJywgJ2RlcHRocycsIHRoaXMuZGVjb3JhdG9ycy5tZXJnZSgpXSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdGhpcy5kZWNvcmF0b3JzLnByZXBlbmQoJ2Z1bmN0aW9uKGZuLCBwcm9wcywgY29udGFpbmVyLCBkZXB0aDAsIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcXG4nKTtcblx0ICAgICAgICB0aGlzLmRlY29yYXRvcnMucHVzaCgnfVxcbicpO1xuXHQgICAgICAgIHRoaXMuZGVjb3JhdG9ycyA9IHRoaXMuZGVjb3JhdG9ycy5tZXJnZSgpO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLmRlY29yYXRvcnMgPSB1bmRlZmluZWQ7XG5cdCAgICB9XG5cblx0ICAgIHZhciBmbiA9IHRoaXMuY3JlYXRlRnVuY3Rpb25Db250ZXh0KGFzT2JqZWN0KTtcblx0ICAgIGlmICghdGhpcy5pc0NoaWxkKSB7XG5cdCAgICAgIHZhciByZXQgPSB7XG5cdCAgICAgICAgY29tcGlsZXI6IHRoaXMuY29tcGlsZXJJbmZvKCksXG5cdCAgICAgICAgbWFpbjogZm5cblx0ICAgICAgfTtcblxuXHQgICAgICBpZiAodGhpcy5kZWNvcmF0b3JzKSB7XG5cdCAgICAgICAgcmV0Lm1haW5fZCA9IHRoaXMuZGVjb3JhdG9yczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjYW1lbGNhc2Vcblx0ICAgICAgICByZXQudXNlRGVjb3JhdG9ycyA9IHRydWU7XG5cdCAgICAgIH1cblxuXHQgICAgICB2YXIgX2NvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG5cdCAgICAgIHZhciBwcm9ncmFtcyA9IF9jb250ZXh0LnByb2dyYW1zO1xuXHQgICAgICB2YXIgZGVjb3JhdG9ycyA9IF9jb250ZXh0LmRlY29yYXRvcnM7XG5cblx0ICAgICAgZm9yIChpID0gMCwgbCA9IHByb2dyYW1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICAgIGlmIChwcm9ncmFtc1tpXSkge1xuXHQgICAgICAgICAgcmV0W2ldID0gcHJvZ3JhbXNbaV07XG5cdCAgICAgICAgICBpZiAoZGVjb3JhdG9yc1tpXSkge1xuXHQgICAgICAgICAgICByZXRbaSArICdfZCddID0gZGVjb3JhdG9yc1tpXTtcblx0ICAgICAgICAgICAgcmV0LnVzZURlY29yYXRvcnMgPSB0cnVlO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICh0aGlzLmVudmlyb25tZW50LnVzZVBhcnRpYWwpIHtcblx0ICAgICAgICByZXQudXNlUGFydGlhbCA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhKSB7XG5cdCAgICAgICAgcmV0LnVzZURhdGEgPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICh0aGlzLnVzZURlcHRocykge1xuXHQgICAgICAgIHJldC51c2VEZXB0aHMgPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICh0aGlzLnVzZUJsb2NrUGFyYW1zKSB7XG5cdCAgICAgICAgcmV0LnVzZUJsb2NrUGFyYW1zID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAodGhpcy5vcHRpb25zLmNvbXBhdCkge1xuXHQgICAgICAgIHJldC5jb21wYXQgPSB0cnVlO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKCFhc09iamVjdCkge1xuXHQgICAgICAgIHJldC5jb21waWxlciA9IEpTT04uc3RyaW5naWZ5KHJldC5jb21waWxlcik7XG5cblx0ICAgICAgICB0aGlzLnNvdXJjZS5jdXJyZW50TG9jYXRpb24gPSB7IHN0YXJ0OiB7IGxpbmU6IDEsIGNvbHVtbjogMCB9IH07XG5cdCAgICAgICAgcmV0ID0gdGhpcy5vYmplY3RMaXRlcmFsKHJldCk7XG5cblx0ICAgICAgICBpZiAob3B0aW9ucy5zcmNOYW1lKSB7XG5cdCAgICAgICAgICByZXQgPSByZXQudG9TdHJpbmdXaXRoU291cmNlTWFwKHsgZmlsZTogb3B0aW9ucy5kZXN0TmFtZSB9KTtcblx0ICAgICAgICAgIHJldC5tYXAgPSByZXQubWFwICYmIHJldC5tYXAudG9TdHJpbmcoKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgcmV0ID0gcmV0LnRvU3RyaW5nKCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJldC5jb21waWxlck9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gcmV0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuIGZuO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBwcmVhbWJsZTogZnVuY3Rpb24gcHJlYW1ibGUoKSB7XG5cdCAgICAvLyB0cmFjayB0aGUgbGFzdCBjb250ZXh0IHB1c2hlZCBpbnRvIHBsYWNlIHRvIGFsbG93IHNraXBwaW5nIHRoZVxuXHQgICAgLy8gZ2V0Q29udGV4dCBvcGNvZGUgd2hlbiBpdCB3b3VsZCBiZSBhIG5vb3Bcblx0ICAgIHRoaXMubGFzdENvbnRleHQgPSAwO1xuXHQgICAgdGhpcy5zb3VyY2UgPSBuZXcgX2NvZGVHZW4yWydkZWZhdWx0J10odGhpcy5vcHRpb25zLnNyY05hbWUpO1xuXHQgICAgdGhpcy5kZWNvcmF0b3JzID0gbmV3IF9jb2RlR2VuMlsnZGVmYXVsdCddKHRoaXMub3B0aW9ucy5zcmNOYW1lKTtcblx0ICB9LFxuXG5cdCAgY3JlYXRlRnVuY3Rpb25Db250ZXh0OiBmdW5jdGlvbiBjcmVhdGVGdW5jdGlvbkNvbnRleHQoYXNPYmplY3QpIHtcblx0ICAgIHZhciB2YXJEZWNsYXJhdGlvbnMgPSAnJztcblxuXHQgICAgdmFyIGxvY2FscyA9IHRoaXMuc3RhY2tWYXJzLmNvbmNhdCh0aGlzLnJlZ2lzdGVycy5saXN0KTtcblx0ICAgIGlmIChsb2NhbHMubGVuZ3RoID4gMCkge1xuXHQgICAgICB2YXJEZWNsYXJhdGlvbnMgKz0gJywgJyArIGxvY2Fscy5qb2luKCcsICcpO1xuXHQgICAgfVxuXG5cdCAgICAvLyBHZW5lcmF0ZSBtaW5pbWl6ZXIgYWxpYXMgbWFwcGluZ3Ncblx0ICAgIC8vXG5cdCAgICAvLyBXaGVuIHVzaW5nIHRydWUgU291cmNlTm9kZXMsIHRoaXMgd2lsbCB1cGRhdGUgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIGdpdmVuIGFsaWFzXG5cdCAgICAvLyBhcyB0aGUgc291cmNlIG5vZGVzIGFyZSByZXVzZWQgaW4gc2l0dS4gRm9yIHRoZSBub24tc291cmNlIG5vZGUgY29tcGlsYXRpb24gbW9kZSxcblx0ICAgIC8vIGFsaWFzZXMgd2lsbCBub3QgYmUgdXNlZCwgYnV0IHRoaXMgY2FzZSBpcyBhbHJlYWR5IGJlaW5nIHJ1biBvbiB0aGUgY2xpZW50IGFuZFxuXHQgICAgLy8gd2UgYXJlbid0IGNvbmNlcm4gYWJvdXQgbWluaW1pemluZyB0aGUgdGVtcGxhdGUgc2l6ZS5cblx0ICAgIHZhciBhbGlhc0NvdW50ID0gMDtcblx0ICAgIGZvciAodmFyIGFsaWFzIGluIHRoaXMuYWxpYXNlcykge1xuXHQgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGd1YXJkLWZvci1pblxuXHQgICAgICB2YXIgbm9kZSA9IHRoaXMuYWxpYXNlc1thbGlhc107XG5cblx0ICAgICAgaWYgKHRoaXMuYWxpYXNlcy5oYXNPd25Qcm9wZXJ0eShhbGlhcykgJiYgbm9kZS5jaGlsZHJlbiAmJiBub2RlLnJlZmVyZW5jZUNvdW50ID4gMSkge1xuXHQgICAgICAgIHZhckRlY2xhcmF0aW9ucyArPSAnLCBhbGlhcycgKyArK2FsaWFzQ291bnQgKyAnPScgKyBhbGlhcztcblx0ICAgICAgICBub2RlLmNoaWxkcmVuWzBdID0gJ2FsaWFzJyArIGFsaWFzQ291bnQ7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgdmFyIHBhcmFtcyA9IFsnY29udGFpbmVyJywgJ2RlcHRoMCcsICdoZWxwZXJzJywgJ3BhcnRpYWxzJywgJ2RhdGEnXTtcblxuXHQgICAgaWYgKHRoaXMudXNlQmxvY2tQYXJhbXMgfHwgdGhpcy51c2VEZXB0aHMpIHtcblx0ICAgICAgcGFyYW1zLnB1c2goJ2Jsb2NrUGFyYW1zJyk7XG5cdCAgICB9XG5cdCAgICBpZiAodGhpcy51c2VEZXB0aHMpIHtcblx0ICAgICAgcGFyYW1zLnB1c2goJ2RlcHRocycpO1xuXHQgICAgfVxuXG5cdCAgICAvLyBQZXJmb3JtIGEgc2Vjb25kIHBhc3Mgb3ZlciB0aGUgb3V0cHV0IHRvIG1lcmdlIGNvbnRlbnQgd2hlbiBwb3NzaWJsZVxuXHQgICAgdmFyIHNvdXJjZSA9IHRoaXMubWVyZ2VTb3VyY2UodmFyRGVjbGFyYXRpb25zKTtcblxuXHQgICAgaWYgKGFzT2JqZWN0KSB7XG5cdCAgICAgIHBhcmFtcy5wdXNoKHNvdXJjZSk7XG5cblx0ICAgICAgcmV0dXJuIEZ1bmN0aW9uLmFwcGx5KHRoaXMsIHBhcmFtcyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gdGhpcy5zb3VyY2Uud3JhcChbJ2Z1bmN0aW9uKCcsIHBhcmFtcy5qb2luKCcsJyksICcpIHtcXG4gICcsIHNvdXJjZSwgJ30nXSk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBtZXJnZVNvdXJjZTogZnVuY3Rpb24gbWVyZ2VTb3VyY2UodmFyRGVjbGFyYXRpb25zKSB7XG5cdCAgICB2YXIgaXNTaW1wbGUgPSB0aGlzLmVudmlyb25tZW50LmlzU2ltcGxlLFxuXHQgICAgICAgIGFwcGVuZE9ubHkgPSAhdGhpcy5mb3JjZUJ1ZmZlcixcblx0ICAgICAgICBhcHBlbmRGaXJzdCA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBzb3VyY2VTZWVuID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGJ1ZmZlclN0YXJ0ID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGJ1ZmZlckVuZCA9IHVuZGVmaW5lZDtcblx0ICAgIHRoaXMuc291cmNlLmVhY2goZnVuY3Rpb24gKGxpbmUpIHtcblx0ICAgICAgaWYgKGxpbmUuYXBwZW5kVG9CdWZmZXIpIHtcblx0ICAgICAgICBpZiAoYnVmZmVyU3RhcnQpIHtcblx0ICAgICAgICAgIGxpbmUucHJlcGVuZCgnICArICcpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBidWZmZXJTdGFydCA9IGxpbmU7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGJ1ZmZlckVuZCA9IGxpbmU7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgaWYgKGJ1ZmZlclN0YXJ0KSB7XG5cdCAgICAgICAgICBpZiAoIXNvdXJjZVNlZW4pIHtcblx0ICAgICAgICAgICAgYXBwZW5kRmlyc3QgPSB0cnVlO1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgYnVmZmVyU3RhcnQucHJlcGVuZCgnYnVmZmVyICs9ICcpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgYnVmZmVyRW5kLmFkZCgnOycpO1xuXHQgICAgICAgICAgYnVmZmVyU3RhcnQgPSBidWZmZXJFbmQgPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc291cmNlU2VlbiA9IHRydWU7XG5cdCAgICAgICAgaWYgKCFpc1NpbXBsZSkge1xuXHQgICAgICAgICAgYXBwZW5kT25seSA9IGZhbHNlO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSk7XG5cblx0ICAgIGlmIChhcHBlbmRPbmx5KSB7XG5cdCAgICAgIGlmIChidWZmZXJTdGFydCkge1xuXHQgICAgICAgIGJ1ZmZlclN0YXJ0LnByZXBlbmQoJ3JldHVybiAnKTtcblx0ICAgICAgICBidWZmZXJFbmQuYWRkKCc7Jyk7XG5cdCAgICAgIH0gZWxzZSBpZiAoIXNvdXJjZVNlZW4pIHtcblx0ICAgICAgICB0aGlzLnNvdXJjZS5wdXNoKCdyZXR1cm4gXCJcIjsnKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdmFyRGVjbGFyYXRpb25zICs9ICcsIGJ1ZmZlciA9ICcgKyAoYXBwZW5kRmlyc3QgPyAnJyA6IHRoaXMuaW5pdGlhbGl6ZUJ1ZmZlcigpKTtcblxuXHQgICAgICBpZiAoYnVmZmVyU3RhcnQpIHtcblx0ICAgICAgICBidWZmZXJTdGFydC5wcmVwZW5kKCdyZXR1cm4gYnVmZmVyICsgJyk7XG5cdCAgICAgICAgYnVmZmVyRW5kLmFkZCgnOycpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHRoaXMuc291cmNlLnB1c2goJ3JldHVybiBidWZmZXI7Jyk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgaWYgKHZhckRlY2xhcmF0aW9ucykge1xuXHQgICAgICB0aGlzLnNvdXJjZS5wcmVwZW5kKCd2YXIgJyArIHZhckRlY2xhcmF0aW9ucy5zdWJzdHJpbmcoMikgKyAoYXBwZW5kRmlyc3QgPyAnJyA6ICc7XFxuJykpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdGhpcy5zb3VyY2UubWVyZ2UoKTtcblx0ICB9LFxuXG5cdCAgLy8gW2Jsb2NrVmFsdWVdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiBoYXNoLCBpbnZlcnNlLCBwcm9ncmFtLCB2YWx1ZVxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogcmV0dXJuIHZhbHVlIG9mIGJsb2NrSGVscGVyTWlzc2luZ1xuXHQgIC8vXG5cdCAgLy8gVGhlIHB1cnBvc2Ugb2YgdGhpcyBvcGNvZGUgaXMgdG8gdGFrZSBhIGJsb2NrIG9mIHRoZSBmb3JtXG5cdCAgLy8gYHt7I3RoaXMuZm9vfX0uLi57ey90aGlzLmZvb319YCwgcmVzb2x2ZSB0aGUgdmFsdWUgb2YgYGZvb2AsIGFuZFxuXHQgIC8vIHJlcGxhY2UgaXQgb24gdGhlIHN0YWNrIHdpdGggdGhlIHJlc3VsdCBvZiBwcm9wZXJseVxuXHQgIC8vIGludm9raW5nIGJsb2NrSGVscGVyTWlzc2luZy5cblx0ICBibG9ja1ZhbHVlOiBmdW5jdGlvbiBibG9ja1ZhbHVlKG5hbWUpIHtcblx0ICAgIHZhciBibG9ja0hlbHBlck1pc3NpbmcgPSB0aGlzLmFsaWFzYWJsZSgnaGVscGVycy5ibG9ja0hlbHBlck1pc3NpbmcnKSxcblx0ICAgICAgICBwYXJhbXMgPSBbdGhpcy5jb250ZXh0TmFtZSgwKV07XG5cdCAgICB0aGlzLnNldHVwSGVscGVyQXJncyhuYW1lLCAwLCBwYXJhbXMpO1xuXG5cdCAgICB2YXIgYmxvY2tOYW1lID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgcGFyYW1zLnNwbGljZSgxLCAwLCBibG9ja05hbWUpO1xuXG5cdCAgICB0aGlzLnB1c2godGhpcy5zb3VyY2UuZnVuY3Rpb25DYWxsKGJsb2NrSGVscGVyTWlzc2luZywgJ2NhbGwnLCBwYXJhbXMpKTtcblx0ICB9LFxuXG5cdCAgLy8gW2FtYmlndW91c0Jsb2NrVmFsdWVdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiBoYXNoLCBpbnZlcnNlLCBwcm9ncmFtLCB2YWx1ZVxuXHQgIC8vIENvbXBpbGVyIHZhbHVlLCBiZWZvcmU6IGxhc3RIZWxwZXI9dmFsdWUgb2YgbGFzdCBmb3VuZCBoZWxwZXIsIGlmIGFueVxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlciwgaWYgbm8gbGFzdEhlbHBlcjogc2FtZSBhcyBbYmxvY2tWYWx1ZV1cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXIsIGlmIGxhc3RIZWxwZXI6IHZhbHVlXG5cdCAgYW1iaWd1b3VzQmxvY2tWYWx1ZTogZnVuY3Rpb24gYW1iaWd1b3VzQmxvY2tWYWx1ZSgpIHtcblx0ICAgIC8vIFdlJ3JlIGJlaW5nIGEgYml0IGNoZWVreSBhbmQgcmV1c2luZyB0aGUgb3B0aW9ucyB2YWx1ZSBmcm9tIHRoZSBwcmlvciBleGVjXG5cdCAgICB2YXIgYmxvY2tIZWxwZXJNaXNzaW5nID0gdGhpcy5hbGlhc2FibGUoJ2hlbHBlcnMuYmxvY2tIZWxwZXJNaXNzaW5nJyksXG5cdCAgICAgICAgcGFyYW1zID0gW3RoaXMuY29udGV4dE5hbWUoMCldO1xuXHQgICAgdGhpcy5zZXR1cEhlbHBlckFyZ3MoJycsIDAsIHBhcmFtcywgdHJ1ZSk7XG5cblx0ICAgIHRoaXMuZmx1c2hJbmxpbmUoKTtcblxuXHQgICAgdmFyIGN1cnJlbnQgPSB0aGlzLnRvcFN0YWNrKCk7XG5cdCAgICBwYXJhbXMuc3BsaWNlKDEsIDAsIGN1cnJlbnQpO1xuXG5cdCAgICB0aGlzLnB1c2hTb3VyY2UoWydpZiAoIScsIHRoaXMubGFzdEhlbHBlciwgJykgeyAnLCBjdXJyZW50LCAnID0gJywgdGhpcy5zb3VyY2UuZnVuY3Rpb25DYWxsKGJsb2NrSGVscGVyTWlzc2luZywgJ2NhbGwnLCBwYXJhbXMpLCAnfSddKTtcblx0ICB9LFxuXG5cdCAgLy8gW2FwcGVuZENvbnRlbnRdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IC4uLlxuXHQgIC8vXG5cdCAgLy8gQXBwZW5kcyB0aGUgc3RyaW5nIHZhbHVlIG9mIGBjb250ZW50YCB0byB0aGUgY3VycmVudCBidWZmZXJcblx0ICBhcHBlbmRDb250ZW50OiBmdW5jdGlvbiBhcHBlbmRDb250ZW50KGNvbnRlbnQpIHtcblx0ICAgIGlmICh0aGlzLnBlbmRpbmdDb250ZW50KSB7XG5cdCAgICAgIGNvbnRlbnQgPSB0aGlzLnBlbmRpbmdDb250ZW50ICsgY29udGVudDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMucGVuZGluZ0xvY2F0aW9uID0gdGhpcy5zb3VyY2UuY3VycmVudExvY2F0aW9uO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLnBlbmRpbmdDb250ZW50ID0gY29udGVudDtcblx0ICB9LFxuXG5cdCAgLy8gW2FwcGVuZF1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IHZhbHVlLCAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IC4uLlxuXHQgIC8vXG5cdCAgLy8gQ29lcmNlcyBgdmFsdWVgIHRvIGEgU3RyaW5nIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBjdXJyZW50IGJ1ZmZlci5cblx0ICAvL1xuXHQgIC8vIElmIGB2YWx1ZWAgaXMgdHJ1dGh5LCBvciAwLCBpdCBpcyBjb2VyY2VkIGludG8gYSBzdHJpbmcgYW5kIGFwcGVuZGVkXG5cdCAgLy8gT3RoZXJ3aXNlLCB0aGUgZW1wdHkgc3RyaW5nIGlzIGFwcGVuZGVkXG5cdCAgYXBwZW5kOiBmdW5jdGlvbiBhcHBlbmQoKSB7XG5cdCAgICBpZiAodGhpcy5pc0lubGluZSgpKSB7XG5cdCAgICAgIHRoaXMucmVwbGFjZVN0YWNrKGZ1bmN0aW9uIChjdXJyZW50KSB7XG5cdCAgICAgICAgcmV0dXJuIFsnICE9IG51bGwgPyAnLCBjdXJyZW50LCAnIDogXCJcIiddO1xuXHQgICAgICB9KTtcblxuXHQgICAgICB0aGlzLnB1c2hTb3VyY2UodGhpcy5hcHBlbmRUb0J1ZmZlcih0aGlzLnBvcFN0YWNrKCkpKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHZhciBsb2NhbCA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgICAgdGhpcy5wdXNoU291cmNlKFsnaWYgKCcsIGxvY2FsLCAnICE9IG51bGwpIHsgJywgdGhpcy5hcHBlbmRUb0J1ZmZlcihsb2NhbCwgdW5kZWZpbmVkLCB0cnVlKSwgJyB9J10pO1xuXHQgICAgICBpZiAodGhpcy5lbnZpcm9ubWVudC5pc1NpbXBsZSkge1xuXHQgICAgICAgIHRoaXMucHVzaFNvdXJjZShbJ2Vsc2UgeyAnLCB0aGlzLmFwcGVuZFRvQnVmZmVyKFwiJydcIiwgdW5kZWZpbmVkLCB0cnVlKSwgJyB9J10pO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIC8vIFthcHBlbmRFc2NhcGVkXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogdmFsdWUsIC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uXG5cdCAgLy9cblx0ICAvLyBFc2NhcGUgYHZhbHVlYCBhbmQgYXBwZW5kIGl0IHRvIHRoZSBidWZmZXJcblx0ICBhcHBlbmRFc2NhcGVkOiBmdW5jdGlvbiBhcHBlbmRFc2NhcGVkKCkge1xuXHQgICAgdGhpcy5wdXNoU291cmNlKHRoaXMuYXBwZW5kVG9CdWZmZXIoW3RoaXMuYWxpYXNhYmxlKCdjb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbicpLCAnKCcsIHRoaXMucG9wU3RhY2soKSwgJyknXSkpO1xuXHQgIH0sXG5cblx0ICAvLyBbZ2V0Q29udGV4dF1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uXG5cdCAgLy8gQ29tcGlsZXIgdmFsdWUsIGFmdGVyOiBsYXN0Q29udGV4dD1kZXB0aFxuXHQgIC8vXG5cdCAgLy8gU2V0IHRoZSB2YWx1ZSBvZiB0aGUgYGxhc3RDb250ZXh0YCBjb21waWxlciB2YWx1ZSB0byB0aGUgZGVwdGhcblx0ICBnZXRDb250ZXh0OiBmdW5jdGlvbiBnZXRDb250ZXh0KGRlcHRoKSB7XG5cdCAgICB0aGlzLmxhc3RDb250ZXh0ID0gZGVwdGg7XG5cdCAgfSxcblxuXHQgIC8vIFtwdXNoQ29udGV4dF1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogY3VycmVudENvbnRleHQsIC4uLlxuXHQgIC8vXG5cdCAgLy8gUHVzaGVzIHRoZSB2YWx1ZSBvZiB0aGUgY3VycmVudCBjb250ZXh0IG9udG8gdGhlIHN0YWNrLlxuXHQgIHB1c2hDb250ZXh0OiBmdW5jdGlvbiBwdXNoQ29udGV4dCgpIHtcblx0ICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCh0aGlzLmNvbnRleHROYW1lKHRoaXMubGFzdENvbnRleHQpKTtcblx0ICB9LFxuXG5cdCAgLy8gW2xvb2t1cE9uQ29udGV4dF1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogY3VycmVudENvbnRleHRbbmFtZV0sIC4uLlxuXHQgIC8vXG5cdCAgLy8gTG9va3MgdXAgdGhlIHZhbHVlIG9mIGBuYW1lYCBvbiB0aGUgY3VycmVudCBjb250ZXh0IGFuZCBwdXNoZXNcblx0ICAvLyBpdCBvbnRvIHRoZSBzdGFjay5cblx0ICBsb29rdXBPbkNvbnRleHQ6IGZ1bmN0aW9uIGxvb2t1cE9uQ29udGV4dChwYXJ0cywgZmFsc3ksIHN0cmljdCwgc2NvcGVkKSB7XG5cdCAgICB2YXIgaSA9IDA7XG5cblx0ICAgIGlmICghc2NvcGVkICYmIHRoaXMub3B0aW9ucy5jb21wYXQgJiYgIXRoaXMubGFzdENvbnRleHQpIHtcblx0ICAgICAgLy8gVGhlIGRlcHRoZWQgcXVlcnkgaXMgZXhwZWN0ZWQgdG8gaGFuZGxlIHRoZSB1bmRlZmluZWQgbG9naWMgZm9yIHRoZSByb290IGxldmVsIHRoYXRcblx0ICAgICAgLy8gaXMgaW1wbGVtZW50ZWQgYmVsb3csIHNvIHdlIGV2YWx1YXRlIHRoYXQgZGlyZWN0bHkgaW4gY29tcGF0IG1vZGVcblx0ICAgICAgdGhpcy5wdXNoKHRoaXMuZGVwdGhlZExvb2t1cChwYXJ0c1tpKytdKSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLnB1c2hDb250ZXh0KCk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMucmVzb2x2ZVBhdGgoJ2NvbnRleHQnLCBwYXJ0cywgaSwgZmFsc3ksIHN0cmljdCk7XG5cdCAgfSxcblxuXHQgIC8vIFtsb29rdXBCbG9ja1BhcmFtXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiBibG9ja1BhcmFtW25hbWVdLCAuLi5cblx0ICAvL1xuXHQgIC8vIExvb2tzIHVwIHRoZSB2YWx1ZSBvZiBgcGFydHNgIG9uIHRoZSBnaXZlbiBibG9jayBwYXJhbSBhbmQgcHVzaGVzXG5cdCAgLy8gaXQgb250byB0aGUgc3RhY2suXG5cdCAgbG9va3VwQmxvY2tQYXJhbTogZnVuY3Rpb24gbG9va3VwQmxvY2tQYXJhbShibG9ja1BhcmFtSWQsIHBhcnRzKSB7XG5cdCAgICB0aGlzLnVzZUJsb2NrUGFyYW1zID0gdHJ1ZTtcblxuXHQgICAgdGhpcy5wdXNoKFsnYmxvY2tQYXJhbXNbJywgYmxvY2tQYXJhbUlkWzBdLCAnXVsnLCBibG9ja1BhcmFtSWRbMV0sICddJ10pO1xuXHQgICAgdGhpcy5yZXNvbHZlUGF0aCgnY29udGV4dCcsIHBhcnRzLCAxKTtcblx0ICB9LFxuXG5cdCAgLy8gW2xvb2t1cERhdGFdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IGRhdGEsIC4uLlxuXHQgIC8vXG5cdCAgLy8gUHVzaCB0aGUgZGF0YSBsb29rdXAgb3BlcmF0b3Jcblx0ICBsb29rdXBEYXRhOiBmdW5jdGlvbiBsb29rdXBEYXRhKGRlcHRoLCBwYXJ0cywgc3RyaWN0KSB7XG5cdCAgICBpZiAoIWRlcHRoKSB7XG5cdCAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCgnZGF0YScpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKCdjb250YWluZXIuZGF0YShkYXRhLCAnICsgZGVwdGggKyAnKScpO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLnJlc29sdmVQYXRoKCdkYXRhJywgcGFydHMsIDAsIHRydWUsIHN0cmljdCk7XG5cdCAgfSxcblxuXHQgIHJlc29sdmVQYXRoOiBmdW5jdGlvbiByZXNvbHZlUGF0aCh0eXBlLCBwYXJ0cywgaSwgZmFsc3ksIHN0cmljdCkge1xuXHQgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcblxuXHQgICAgdmFyIF90aGlzID0gdGhpcztcblxuXHQgICAgaWYgKHRoaXMub3B0aW9ucy5zdHJpY3QgfHwgdGhpcy5vcHRpb25zLmFzc3VtZU9iamVjdHMpIHtcblx0ICAgICAgdGhpcy5wdXNoKHN0cmljdExvb2t1cCh0aGlzLm9wdGlvbnMuc3RyaWN0ICYmIHN0cmljdCwgdGhpcywgcGFydHMsIHR5cGUpKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgbGVuID0gcGFydHMubGVuZ3RoO1xuXHQgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1sb29wLWZ1bmMgKi9cblx0ICAgICAgdGhpcy5yZXBsYWNlU3RhY2soZnVuY3Rpb24gKGN1cnJlbnQpIHtcblx0ICAgICAgICB2YXIgbG9va3VwID0gX3RoaXMubmFtZUxvb2t1cChjdXJyZW50LCBwYXJ0c1tpXSwgdHlwZSk7XG5cdCAgICAgICAgLy8gV2Ugd2FudCB0byBlbnN1cmUgdGhhdCB6ZXJvIGFuZCBmYWxzZSBhcmUgaGFuZGxlZCBwcm9wZXJseSBpZiB0aGUgY29udGV4dCAoZmFsc3kgZmxhZylcblx0ICAgICAgICAvLyBuZWVkcyB0byBoYXZlIHRoZSBzcGVjaWFsIGhhbmRsaW5nIGZvciB0aGVzZSB2YWx1ZXMuXG5cdCAgICAgICAgaWYgKCFmYWxzeSkge1xuXHQgICAgICAgICAgcmV0dXJuIFsnICE9IG51bGwgPyAnLCBsb29rdXAsICcgOiAnLCBjdXJyZW50XTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgLy8gT3RoZXJ3aXNlIHdlIGNhbiB1c2UgZ2VuZXJpYyBmYWxzeSBoYW5kbGluZ1xuXHQgICAgICAgICAgcmV0dXJuIFsnICYmICcsIGxvb2t1cF07XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1sb29wLWZ1bmMgKi9cblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgLy8gW3Jlc29sdmVQb3NzaWJsZUxhbWJkYV1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IHZhbHVlLCAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHJlc29sdmVkIHZhbHVlLCAuLi5cblx0ICAvL1xuXHQgIC8vIElmIHRoZSBgdmFsdWVgIGlzIGEgbGFtYmRhLCByZXBsYWNlIGl0IG9uIHRoZSBzdGFjayBieVxuXHQgIC8vIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGxhbWJkYVxuXHQgIHJlc29sdmVQb3NzaWJsZUxhbWJkYTogZnVuY3Rpb24gcmVzb2x2ZVBvc3NpYmxlTGFtYmRhKCkge1xuXHQgICAgdGhpcy5wdXNoKFt0aGlzLmFsaWFzYWJsZSgnY29udGFpbmVyLmxhbWJkYScpLCAnKCcsIHRoaXMucG9wU3RhY2soKSwgJywgJywgdGhpcy5jb250ZXh0TmFtZSgwKSwgJyknXSk7XG5cdCAgfSxcblxuXHQgIC8vIFtwdXNoU3RyaW5nUGFyYW1dXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHN0cmluZywgY3VycmVudENvbnRleHQsIC4uLlxuXHQgIC8vXG5cdCAgLy8gVGhpcyBvcGNvZGUgaXMgZGVzaWduZWQgZm9yIHVzZSBpbiBzdHJpbmcgbW9kZSwgd2hpY2hcblx0ICAvLyBwcm92aWRlcyB0aGUgc3RyaW5nIHZhbHVlIG9mIGEgcGFyYW1ldGVyIGFsb25nIHdpdGggaXRzXG5cdCAgLy8gZGVwdGggcmF0aGVyIHRoYW4gcmVzb2x2aW5nIGl0IGltbWVkaWF0ZWx5LlxuXHQgIHB1c2hTdHJpbmdQYXJhbTogZnVuY3Rpb24gcHVzaFN0cmluZ1BhcmFtKHN0cmluZywgdHlwZSkge1xuXHQgICAgdGhpcy5wdXNoQ29udGV4dCgpO1xuXHQgICAgdGhpcy5wdXNoU3RyaW5nKHR5cGUpO1xuXG5cdCAgICAvLyBJZiBpdCdzIGEgc3ViZXhwcmVzc2lvbiwgdGhlIHN0cmluZyByZXN1bHRcblx0ICAgIC8vIHdpbGwgYmUgcHVzaGVkIGFmdGVyIHRoaXMgb3Bjb2RlLlxuXHQgICAgaWYgKHR5cGUgIT09ICdTdWJFeHByZXNzaW9uJykge1xuXHQgICAgICBpZiAodHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgICB0aGlzLnB1c2hTdHJpbmcoc3RyaW5nKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoc3RyaW5nKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBlbXB0eUhhc2g6IGZ1bmN0aW9uIGVtcHR5SGFzaChvbWl0RW1wdHkpIHtcblx0ICAgIGlmICh0aGlzLnRyYWNrSWRzKSB7XG5cdCAgICAgIHRoaXMucHVzaCgne30nKTsgLy8gaGFzaElkc1xuXHQgICAgfVxuXHQgICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG5cdCAgICAgIHRoaXMucHVzaCgne30nKTsgLy8gaGFzaENvbnRleHRzXG5cdCAgICAgIHRoaXMucHVzaCgne30nKTsgLy8gaGFzaFR5cGVzXG5cdCAgICB9XG5cdCAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwob21pdEVtcHR5ID8gJ3VuZGVmaW5lZCcgOiAne30nKTtcblx0ICB9LFxuXHQgIHB1c2hIYXNoOiBmdW5jdGlvbiBwdXNoSGFzaCgpIHtcblx0ICAgIGlmICh0aGlzLmhhc2gpIHtcblx0ICAgICAgdGhpcy5oYXNoZXMucHVzaCh0aGlzLmhhc2gpO1xuXHQgICAgfVxuXHQgICAgdGhpcy5oYXNoID0geyB2YWx1ZXM6IFtdLCB0eXBlczogW10sIGNvbnRleHRzOiBbXSwgaWRzOiBbXSB9O1xuXHQgIH0sXG5cdCAgcG9wSGFzaDogZnVuY3Rpb24gcG9wSGFzaCgpIHtcblx0ICAgIHZhciBoYXNoID0gdGhpcy5oYXNoO1xuXHQgICAgdGhpcy5oYXNoID0gdGhpcy5oYXNoZXMucG9wKCk7XG5cblx0ICAgIGlmICh0aGlzLnRyYWNrSWRzKSB7XG5cdCAgICAgIHRoaXMucHVzaCh0aGlzLm9iamVjdExpdGVyYWwoaGFzaC5pZHMpKTtcblx0ICAgIH1cblx0ICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuXHQgICAgICB0aGlzLnB1c2godGhpcy5vYmplY3RMaXRlcmFsKGhhc2guY29udGV4dHMpKTtcblx0ICAgICAgdGhpcy5wdXNoKHRoaXMub2JqZWN0TGl0ZXJhbChoYXNoLnR5cGVzKSk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMucHVzaCh0aGlzLm9iamVjdExpdGVyYWwoaGFzaC52YWx1ZXMpKTtcblx0ICB9LFxuXG5cdCAgLy8gW3B1c2hTdHJpbmddXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHF1b3RlZFN0cmluZyhzdHJpbmcpLCAuLi5cblx0ICAvL1xuXHQgIC8vIFB1c2ggYSBxdW90ZWQgdmVyc2lvbiBvZiBgc3RyaW5nYCBvbnRvIHRoZSBzdGFja1xuXHQgIHB1c2hTdHJpbmc6IGZ1bmN0aW9uIHB1c2hTdHJpbmcoc3RyaW5nKSB7XG5cdCAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwodGhpcy5xdW90ZWRTdHJpbmcoc3RyaW5nKSk7XG5cdCAgfSxcblxuXHQgIC8vIFtwdXNoTGl0ZXJhbF1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogdmFsdWUsIC4uLlxuXHQgIC8vXG5cdCAgLy8gUHVzaGVzIGEgdmFsdWUgb250byB0aGUgc3RhY2suIFRoaXMgb3BlcmF0aW9uIHByZXZlbnRzXG5cdCAgLy8gdGhlIGNvbXBpbGVyIGZyb20gY3JlYXRpbmcgYSB0ZW1wb3JhcnkgdmFyaWFibGUgdG8gaG9sZFxuXHQgIC8vIGl0LlxuXHQgIHB1c2hMaXRlcmFsOiBmdW5jdGlvbiBwdXNoTGl0ZXJhbCh2YWx1ZSkge1xuXHQgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKHZhbHVlKTtcblx0ICB9LFxuXG5cdCAgLy8gW3B1c2hQcm9ncmFtXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiBwcm9ncmFtKGd1aWQpLCAuLi5cblx0ICAvL1xuXHQgIC8vIFB1c2ggYSBwcm9ncmFtIGV4cHJlc3Npb24gb250byB0aGUgc3RhY2suIFRoaXMgdGFrZXNcblx0ICAvLyBhIGNvbXBpbGUtdGltZSBndWlkIGFuZCBjb252ZXJ0cyBpdCBpbnRvIGEgcnVudGltZS1hY2Nlc3NpYmxlXG5cdCAgLy8gZXhwcmVzc2lvbi5cblx0ICBwdXNoUHJvZ3JhbTogZnVuY3Rpb24gcHVzaFByb2dyYW0oZ3VpZCkge1xuXHQgICAgaWYgKGd1aWQgIT0gbnVsbCkge1xuXHQgICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwodGhpcy5wcm9ncmFtRXhwcmVzc2lvbihndWlkKSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwobnVsbCk7XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIC8vIFtyZWdpc3RlckRlY29yYXRvcl1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIHByb2dyYW0sIHBhcmFtcy4uLiwgLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi5cblx0ICAvL1xuXHQgIC8vIFBvcHMgb2ZmIHRoZSBkZWNvcmF0b3IncyBwYXJhbWV0ZXJzLCBpbnZva2VzIHRoZSBkZWNvcmF0b3IsXG5cdCAgLy8gYW5kIGluc2VydHMgdGhlIGRlY29yYXRvciBpbnRvIHRoZSBkZWNvcmF0b3JzIGxpc3QuXG5cdCAgcmVnaXN0ZXJEZWNvcmF0b3I6IGZ1bmN0aW9uIHJlZ2lzdGVyRGVjb3JhdG9yKHBhcmFtU2l6ZSwgbmFtZSkge1xuXHQgICAgdmFyIGZvdW5kRGVjb3JhdG9yID0gdGhpcy5uYW1lTG9va3VwKCdkZWNvcmF0b3JzJywgbmFtZSwgJ2RlY29yYXRvcicpLFxuXHQgICAgICAgIG9wdGlvbnMgPSB0aGlzLnNldHVwSGVscGVyQXJncyhuYW1lLCBwYXJhbVNpemUpO1xuXG5cdCAgICB0aGlzLmRlY29yYXRvcnMucHVzaChbJ2ZuID0gJywgdGhpcy5kZWNvcmF0b3JzLmZ1bmN0aW9uQ2FsbChmb3VuZERlY29yYXRvciwgJycsIFsnZm4nLCAncHJvcHMnLCAnY29udGFpbmVyJywgb3B0aW9uc10pLCAnIHx8IGZuOyddKTtcblx0ICB9LFxuXG5cdCAgLy8gW2ludm9rZUhlbHBlcl1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHBhcmFtcy4uLiwgLi4uXG5cdCAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXN1bHQgb2YgaGVscGVyIGludm9jYXRpb25cblx0ICAvL1xuXHQgIC8vIFBvcHMgb2ZmIHRoZSBoZWxwZXIncyBwYXJhbWV0ZXJzLCBpbnZva2VzIHRoZSBoZWxwZXIsXG5cdCAgLy8gYW5kIHB1c2hlcyB0aGUgaGVscGVyJ3MgcmV0dXJuIHZhbHVlIG9udG8gdGhlIHN0YWNrLlxuXHQgIC8vXG5cdCAgLy8gSWYgdGhlIGhlbHBlciBpcyBub3QgZm91bmQsIGBoZWxwZXJNaXNzaW5nYCBpcyBjYWxsZWQuXG5cdCAgaW52b2tlSGVscGVyOiBmdW5jdGlvbiBpbnZva2VIZWxwZXIocGFyYW1TaXplLCBuYW1lLCBpc1NpbXBsZSkge1xuXHQgICAgdmFyIG5vbkhlbHBlciA9IHRoaXMucG9wU3RhY2soKSxcblx0ICAgICAgICBoZWxwZXIgPSB0aGlzLnNldHVwSGVscGVyKHBhcmFtU2l6ZSwgbmFtZSksXG5cdCAgICAgICAgc2ltcGxlID0gaXNTaW1wbGUgPyBbaGVscGVyLm5hbWUsICcgfHwgJ10gOiAnJztcblxuXHQgICAgdmFyIGxvb2t1cCA9IFsnKCddLmNvbmNhdChzaW1wbGUsIG5vbkhlbHBlcik7XG5cdCAgICBpZiAoIXRoaXMub3B0aW9ucy5zdHJpY3QpIHtcblx0ICAgICAgbG9va3VwLnB1c2goJyB8fCAnLCB0aGlzLmFsaWFzYWJsZSgnaGVscGVycy5oZWxwZXJNaXNzaW5nJykpO1xuXHQgICAgfVxuXHQgICAgbG9va3VwLnB1c2goJyknKTtcblxuXHQgICAgdGhpcy5wdXNoKHRoaXMuc291cmNlLmZ1bmN0aW9uQ2FsbChsb29rdXAsICdjYWxsJywgaGVscGVyLmNhbGxQYXJhbXMpKTtcblx0ICB9LFxuXG5cdCAgLy8gW2ludm9rZUtub3duSGVscGVyXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogaGFzaCwgaW52ZXJzZSwgcHJvZ3JhbSwgcGFyYW1zLi4uLCAuLi5cblx0ICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHJlc3VsdCBvZiBoZWxwZXIgaW52b2NhdGlvblxuXHQgIC8vXG5cdCAgLy8gVGhpcyBvcGVyYXRpb24gaXMgdXNlZCB3aGVuIHRoZSBoZWxwZXIgaXMga25vd24gdG8gZXhpc3QsXG5cdCAgLy8gc28gYSBgaGVscGVyTWlzc2luZ2AgZmFsbGJhY2sgaXMgbm90IHJlcXVpcmVkLlxuXHQgIGludm9rZUtub3duSGVscGVyOiBmdW5jdGlvbiBpbnZva2VLbm93bkhlbHBlcihwYXJhbVNpemUsIG5hbWUpIHtcblx0ICAgIHZhciBoZWxwZXIgPSB0aGlzLnNldHVwSGVscGVyKHBhcmFtU2l6ZSwgbmFtZSk7XG5cdCAgICB0aGlzLnB1c2godGhpcy5zb3VyY2UuZnVuY3Rpb25DYWxsKGhlbHBlci5uYW1lLCAnY2FsbCcsIGhlbHBlci5jYWxsUGFyYW1zKSk7XG5cdCAgfSxcblxuXHQgIC8vIFtpbnZva2VBbWJpZ3VvdXNdXG5cdCAgLy9cblx0ICAvLyBPbiBzdGFjaywgYmVmb3JlOiBoYXNoLCBpbnZlcnNlLCBwcm9ncmFtLCBwYXJhbXMuLi4sIC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogcmVzdWx0IG9mIGRpc2FtYmlndWF0aW9uXG5cdCAgLy9cblx0ICAvLyBUaGlzIG9wZXJhdGlvbiBpcyB1c2VkIHdoZW4gYW4gZXhwcmVzc2lvbiBsaWtlIGB7e2Zvb319YFxuXHQgIC8vIGlzIHByb3ZpZGVkLCBidXQgd2UgZG9uJ3Qga25vdyBhdCBjb21waWxlLXRpbWUgd2hldGhlciBpdFxuXHQgIC8vIGlzIGEgaGVscGVyIG9yIGEgcGF0aC5cblx0ICAvL1xuXHQgIC8vIFRoaXMgb3BlcmF0aW9uIGVtaXRzIG1vcmUgY29kZSB0aGFuIHRoZSBvdGhlciBvcHRpb25zLFxuXHQgIC8vIGFuZCBjYW4gYmUgYXZvaWRlZCBieSBwYXNzaW5nIHRoZSBga25vd25IZWxwZXJzYCBhbmRcblx0ICAvLyBga25vd25IZWxwZXJzT25seWAgZmxhZ3MgYXQgY29tcGlsZS10aW1lLlxuXHQgIGludm9rZUFtYmlndW91czogZnVuY3Rpb24gaW52b2tlQW1iaWd1b3VzKG5hbWUsIGhlbHBlckNhbGwpIHtcblx0ICAgIHRoaXMudXNlUmVnaXN0ZXIoJ2hlbHBlcicpO1xuXG5cdCAgICB2YXIgbm9uSGVscGVyID0gdGhpcy5wb3BTdGFjaygpO1xuXG5cdCAgICB0aGlzLmVtcHR5SGFzaCgpO1xuXHQgICAgdmFyIGhlbHBlciA9IHRoaXMuc2V0dXBIZWxwZXIoMCwgbmFtZSwgaGVscGVyQ2FsbCk7XG5cblx0ICAgIHZhciBoZWxwZXJOYW1lID0gdGhpcy5sYXN0SGVscGVyID0gdGhpcy5uYW1lTG9va3VwKCdoZWxwZXJzJywgbmFtZSwgJ2hlbHBlcicpO1xuXG5cdCAgICB2YXIgbG9va3VwID0gWycoJywgJyhoZWxwZXIgPSAnLCBoZWxwZXJOYW1lLCAnIHx8ICcsIG5vbkhlbHBlciwgJyknXTtcblx0ICAgIGlmICghdGhpcy5vcHRpb25zLnN0cmljdCkge1xuXHQgICAgICBsb29rdXBbMF0gPSAnKGhlbHBlciA9ICc7XG5cdCAgICAgIGxvb2t1cC5wdXNoKCcgIT0gbnVsbCA/IGhlbHBlciA6ICcsIHRoaXMuYWxpYXNhYmxlKCdoZWxwZXJzLmhlbHBlck1pc3NpbmcnKSk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMucHVzaChbJygnLCBsb29rdXAsIGhlbHBlci5wYXJhbXNJbml0ID8gWycpLCgnLCBoZWxwZXIucGFyYW1zSW5pdF0gOiBbXSwgJyksJywgJyh0eXBlb2YgaGVscGVyID09PSAnLCB0aGlzLmFsaWFzYWJsZSgnXCJmdW5jdGlvblwiJyksICcgPyAnLCB0aGlzLnNvdXJjZS5mdW5jdGlvbkNhbGwoJ2hlbHBlcicsICdjYWxsJywgaGVscGVyLmNhbGxQYXJhbXMpLCAnIDogaGVscGVyKSknXSk7XG5cdCAgfSxcblxuXHQgIC8vIFtpbnZva2VQYXJ0aWFsXVxuXHQgIC8vXG5cdCAgLy8gT24gc3RhY2ssIGJlZm9yZTogY29udGV4dCwgLi4uXG5cdCAgLy8gT24gc3RhY2sgYWZ0ZXI6IHJlc3VsdCBvZiBwYXJ0aWFsIGludm9jYXRpb25cblx0ICAvL1xuXHQgIC8vIFRoaXMgb3BlcmF0aW9uIHBvcHMgb2ZmIGEgY29udGV4dCwgaW52b2tlcyBhIHBhcnRpYWwgd2l0aCB0aGF0IGNvbnRleHQsXG5cdCAgLy8gYW5kIHB1c2hlcyB0aGUgcmVzdWx0IG9mIHRoZSBpbnZvY2F0aW9uIGJhY2suXG5cdCAgaW52b2tlUGFydGlhbDogZnVuY3Rpb24gaW52b2tlUGFydGlhbChpc0R5bmFtaWMsIG5hbWUsIGluZGVudCkge1xuXHQgICAgdmFyIHBhcmFtcyA9IFtdLFxuXHQgICAgICAgIG9wdGlvbnMgPSB0aGlzLnNldHVwUGFyYW1zKG5hbWUsIDEsIHBhcmFtcyk7XG5cblx0ICAgIGlmIChpc0R5bmFtaWMpIHtcblx0ICAgICAgbmFtZSA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgICAgZGVsZXRlIG9wdGlvbnMubmFtZTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGluZGVudCkge1xuXHQgICAgICBvcHRpb25zLmluZGVudCA9IEpTT04uc3RyaW5naWZ5KGluZGVudCk7XG5cdCAgICB9XG5cdCAgICBvcHRpb25zLmhlbHBlcnMgPSAnaGVscGVycyc7XG5cdCAgICBvcHRpb25zLnBhcnRpYWxzID0gJ3BhcnRpYWxzJztcblx0ICAgIG9wdGlvbnMuZGVjb3JhdG9ycyA9ICdjb250YWluZXIuZGVjb3JhdG9ycyc7XG5cblx0ICAgIGlmICghaXNEeW5hbWljKSB7XG5cdCAgICAgIHBhcmFtcy51bnNoaWZ0KHRoaXMubmFtZUxvb2t1cCgncGFydGlhbHMnLCBuYW1lLCAncGFydGlhbCcpKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHBhcmFtcy51bnNoaWZ0KG5hbWUpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAodGhpcy5vcHRpb25zLmNvbXBhdCkge1xuXHQgICAgICBvcHRpb25zLmRlcHRocyA9ICdkZXB0aHMnO1xuXHQgICAgfVxuXHQgICAgb3B0aW9ucyA9IHRoaXMub2JqZWN0TGl0ZXJhbChvcHRpb25zKTtcblx0ICAgIHBhcmFtcy5wdXNoKG9wdGlvbnMpO1xuXG5cdCAgICB0aGlzLnB1c2godGhpcy5zb3VyY2UuZnVuY3Rpb25DYWxsKCdjb250YWluZXIuaW52b2tlUGFydGlhbCcsICcnLCBwYXJhbXMpKTtcblx0ICB9LFxuXG5cdCAgLy8gW2Fzc2lnblRvSGFzaF1cblx0ICAvL1xuXHQgIC8vIE9uIHN0YWNrLCBiZWZvcmU6IHZhbHVlLCAuLi4sIGhhc2gsIC4uLlxuXHQgIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uLCBoYXNoLCAuLi5cblx0ICAvL1xuXHQgIC8vIFBvcHMgYSB2YWx1ZSBvZmYgdGhlIHN0YWNrIGFuZCBhc3NpZ25zIGl0IHRvIHRoZSBjdXJyZW50IGhhc2hcblx0ICBhc3NpZ25Ub0hhc2g6IGZ1bmN0aW9uIGFzc2lnblRvSGFzaChrZXkpIHtcblx0ICAgIHZhciB2YWx1ZSA9IHRoaXMucG9wU3RhY2soKSxcblx0ICAgICAgICBjb250ZXh0ID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIHR5cGUgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgaWQgPSB1bmRlZmluZWQ7XG5cblx0ICAgIGlmICh0aGlzLnRyYWNrSWRzKSB7XG5cdCAgICAgIGlkID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgfVxuXHQgICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG5cdCAgICAgIHR5cGUgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgIGNvbnRleHQgPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICB9XG5cblx0ICAgIHZhciBoYXNoID0gdGhpcy5oYXNoO1xuXHQgICAgaWYgKGNvbnRleHQpIHtcblx0ICAgICAgaGFzaC5jb250ZXh0c1trZXldID0gY29udGV4dDtcblx0ICAgIH1cblx0ICAgIGlmICh0eXBlKSB7XG5cdCAgICAgIGhhc2gudHlwZXNba2V5XSA9IHR5cGU7XG5cdCAgICB9XG5cdCAgICBpZiAoaWQpIHtcblx0ICAgICAgaGFzaC5pZHNba2V5XSA9IGlkO1xuXHQgICAgfVxuXHQgICAgaGFzaC52YWx1ZXNba2V5XSA9IHZhbHVlO1xuXHQgIH0sXG5cblx0ICBwdXNoSWQ6IGZ1bmN0aW9uIHB1c2hJZCh0eXBlLCBuYW1lLCBjaGlsZCkge1xuXHQgICAgaWYgKHR5cGUgPT09ICdCbG9ja1BhcmFtJykge1xuXHQgICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoJ2Jsb2NrUGFyYW1zWycgKyBuYW1lWzBdICsgJ10ucGF0aFsnICsgbmFtZVsxXSArICddJyArIChjaGlsZCA/ICcgKyAnICsgSlNPTi5zdHJpbmdpZnkoJy4nICsgY2hpbGQpIDogJycpKTtcblx0ICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ1BhdGhFeHByZXNzaW9uJykge1xuXHQgICAgICB0aGlzLnB1c2hTdHJpbmcobmFtZSk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdTdWJFeHByZXNzaW9uJykge1xuXHQgICAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoJ3RydWUnKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCgnbnVsbCcpO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICAvLyBIRUxQRVJTXG5cblx0ICBjb21waWxlcjogSmF2YVNjcmlwdENvbXBpbGVyLFxuXG5cdCAgY29tcGlsZUNoaWxkcmVuOiBmdW5jdGlvbiBjb21waWxlQ2hpbGRyZW4oZW52aXJvbm1lbnQsIG9wdGlvbnMpIHtcblx0ICAgIHZhciBjaGlsZHJlbiA9IGVudmlyb25tZW50LmNoaWxkcmVuLFxuXHQgICAgICAgIGNoaWxkID0gdW5kZWZpbmVkLFxuXHQgICAgICAgIGNvbXBpbGVyID0gdW5kZWZpbmVkO1xuXG5cdCAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXHQgICAgICBjb21waWxlciA9IG5ldyB0aGlzLmNvbXBpbGVyKCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbmV3LWNhcFxuXG5cdCAgICAgIHZhciBleGlzdGluZyA9IHRoaXMubWF0Y2hFeGlzdGluZ1Byb2dyYW0oY2hpbGQpO1xuXG5cdCAgICAgIGlmIChleGlzdGluZyA9PSBudWxsKSB7XG5cdCAgICAgICAgdGhpcy5jb250ZXh0LnByb2dyYW1zLnB1c2goJycpOyAvLyBQbGFjZWhvbGRlciB0byBwcmV2ZW50IG5hbWUgY29uZmxpY3RzIGZvciBuZXN0ZWQgY2hpbGRyZW5cblx0ICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNvbnRleHQucHJvZ3JhbXMubGVuZ3RoO1xuXHQgICAgICAgIGNoaWxkLmluZGV4ID0gaW5kZXg7XG5cdCAgICAgICAgY2hpbGQubmFtZSA9ICdwcm9ncmFtJyArIGluZGV4O1xuXHQgICAgICAgIHRoaXMuY29udGV4dC5wcm9ncmFtc1tpbmRleF0gPSBjb21waWxlci5jb21waWxlKGNoaWxkLCBvcHRpb25zLCB0aGlzLmNvbnRleHQsICF0aGlzLnByZWNvbXBpbGUpO1xuXHQgICAgICAgIHRoaXMuY29udGV4dC5kZWNvcmF0b3JzW2luZGV4XSA9IGNvbXBpbGVyLmRlY29yYXRvcnM7XG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmVudmlyb25tZW50c1tpbmRleF0gPSBjaGlsZDtcblxuXHQgICAgICAgIHRoaXMudXNlRGVwdGhzID0gdGhpcy51c2VEZXB0aHMgfHwgY29tcGlsZXIudXNlRGVwdGhzO1xuXHQgICAgICAgIHRoaXMudXNlQmxvY2tQYXJhbXMgPSB0aGlzLnVzZUJsb2NrUGFyYW1zIHx8IGNvbXBpbGVyLnVzZUJsb2NrUGFyYW1zO1xuXHQgICAgICAgIGNoaWxkLnVzZURlcHRocyA9IHRoaXMudXNlRGVwdGhzO1xuXHQgICAgICAgIGNoaWxkLnVzZUJsb2NrUGFyYW1zID0gdGhpcy51c2VCbG9ja1BhcmFtcztcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBjaGlsZC5pbmRleCA9IGV4aXN0aW5nLmluZGV4O1xuXHQgICAgICAgIGNoaWxkLm5hbWUgPSAncHJvZ3JhbScgKyBleGlzdGluZy5pbmRleDtcblxuXHQgICAgICAgIHRoaXMudXNlRGVwdGhzID0gdGhpcy51c2VEZXB0aHMgfHwgZXhpc3RpbmcudXNlRGVwdGhzO1xuXHQgICAgICAgIHRoaXMudXNlQmxvY2tQYXJhbXMgPSB0aGlzLnVzZUJsb2NrUGFyYW1zIHx8IGV4aXN0aW5nLnVzZUJsb2NrUGFyYW1zO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSxcblx0ICBtYXRjaEV4aXN0aW5nUHJvZ3JhbTogZnVuY3Rpb24gbWF0Y2hFeGlzdGluZ1Byb2dyYW0oY2hpbGQpIHtcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNvbnRleHQuZW52aXJvbm1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIHZhciBlbnZpcm9ubWVudCA9IHRoaXMuY29udGV4dC5lbnZpcm9ubWVudHNbaV07XG5cdCAgICAgIGlmIChlbnZpcm9ubWVudCAmJiBlbnZpcm9ubWVudC5lcXVhbHMoY2hpbGQpKSB7XG5cdCAgICAgICAgcmV0dXJuIGVudmlyb25tZW50O1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSxcblxuXHQgIHByb2dyYW1FeHByZXNzaW9uOiBmdW5jdGlvbiBwcm9ncmFtRXhwcmVzc2lvbihndWlkKSB7XG5cdCAgICB2YXIgY2hpbGQgPSB0aGlzLmVudmlyb25tZW50LmNoaWxkcmVuW2d1aWRdLFxuXHQgICAgICAgIHByb2dyYW1QYXJhbXMgPSBbY2hpbGQuaW5kZXgsICdkYXRhJywgY2hpbGQuYmxvY2tQYXJhbXNdO1xuXG5cdCAgICBpZiAodGhpcy51c2VCbG9ja1BhcmFtcyB8fCB0aGlzLnVzZURlcHRocykge1xuXHQgICAgICBwcm9ncmFtUGFyYW1zLnB1c2goJ2Jsb2NrUGFyYW1zJyk7XG5cdCAgICB9XG5cdCAgICBpZiAodGhpcy51c2VEZXB0aHMpIHtcblx0ICAgICAgcHJvZ3JhbVBhcmFtcy5wdXNoKCdkZXB0aHMnKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuICdjb250YWluZXIucHJvZ3JhbSgnICsgcHJvZ3JhbVBhcmFtcy5qb2luKCcsICcpICsgJyknO1xuXHQgIH0sXG5cblx0ICB1c2VSZWdpc3RlcjogZnVuY3Rpb24gdXNlUmVnaXN0ZXIobmFtZSkge1xuXHQgICAgaWYgKCF0aGlzLnJlZ2lzdGVyc1tuYW1lXSkge1xuXHQgICAgICB0aGlzLnJlZ2lzdGVyc1tuYW1lXSA9IHRydWU7XG5cdCAgICAgIHRoaXMucmVnaXN0ZXJzLmxpc3QucHVzaChuYW1lKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgcHVzaDogZnVuY3Rpb24gcHVzaChleHByKSB7XG5cdCAgICBpZiAoIShleHByIGluc3RhbmNlb2YgTGl0ZXJhbCkpIHtcblx0ICAgICAgZXhwciA9IHRoaXMuc291cmNlLndyYXAoZXhwcik7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuaW5saW5lU3RhY2sucHVzaChleHByKTtcblx0ICAgIHJldHVybiBleHByO1xuXHQgIH0sXG5cblx0ICBwdXNoU3RhY2tMaXRlcmFsOiBmdW5jdGlvbiBwdXNoU3RhY2tMaXRlcmFsKGl0ZW0pIHtcblx0ICAgIHRoaXMucHVzaChuZXcgTGl0ZXJhbChpdGVtKSk7XG5cdCAgfSxcblxuXHQgIHB1c2hTb3VyY2U6IGZ1bmN0aW9uIHB1c2hTb3VyY2Uoc291cmNlKSB7XG5cdCAgICBpZiAodGhpcy5wZW5kaW5nQ29udGVudCkge1xuXHQgICAgICB0aGlzLnNvdXJjZS5wdXNoKHRoaXMuYXBwZW5kVG9CdWZmZXIodGhpcy5zb3VyY2UucXVvdGVkU3RyaW5nKHRoaXMucGVuZGluZ0NvbnRlbnQpLCB0aGlzLnBlbmRpbmdMb2NhdGlvbikpO1xuXHQgICAgICB0aGlzLnBlbmRpbmdDb250ZW50ID0gdW5kZWZpbmVkO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoc291cmNlKSB7XG5cdCAgICAgIHRoaXMuc291cmNlLnB1c2goc291cmNlKTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgcmVwbGFjZVN0YWNrOiBmdW5jdGlvbiByZXBsYWNlU3RhY2soY2FsbGJhY2spIHtcblx0ICAgIHZhciBwcmVmaXggPSBbJygnXSxcblx0ICAgICAgICBzdGFjayA9IHVuZGVmaW5lZCxcblx0ICAgICAgICBjcmVhdGVkU3RhY2sgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgdXNlZExpdGVyYWwgPSB1bmRlZmluZWQ7XG5cblx0ICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdCAgICBpZiAoIXRoaXMuaXNJbmxpbmUoKSkge1xuXHQgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgncmVwbGFjZVN0YWNrIG9uIG5vbi1pbmxpbmUnKTtcblx0ICAgIH1cblxuXHQgICAgLy8gV2Ugd2FudCB0byBtZXJnZSB0aGUgaW5saW5lIHN0YXRlbWVudCBpbnRvIHRoZSByZXBsYWNlbWVudCBzdGF0ZW1lbnQgdmlhICcsJ1xuXHQgICAgdmFyIHRvcCA9IHRoaXMucG9wU3RhY2sodHJ1ZSk7XG5cblx0ICAgIGlmICh0b3AgaW5zdGFuY2VvZiBMaXRlcmFsKSB7XG5cdCAgICAgIC8vIExpdGVyYWxzIGRvIG5vdCBuZWVkIHRvIGJlIGlubGluZWRcblx0ICAgICAgc3RhY2sgPSBbdG9wLnZhbHVlXTtcblx0ICAgICAgcHJlZml4ID0gWycoJywgc3RhY2tdO1xuXHQgICAgICB1c2VkTGl0ZXJhbCA9IHRydWU7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAvLyBHZXQgb3IgY3JlYXRlIHRoZSBjdXJyZW50IHN0YWNrIG5hbWUgZm9yIHVzZSBieSB0aGUgaW5saW5lXG5cdCAgICAgIGNyZWF0ZWRTdGFjayA9IHRydWU7XG5cdCAgICAgIHZhciBfbmFtZSA9IHRoaXMuaW5jclN0YWNrKCk7XG5cblx0ICAgICAgcHJlZml4ID0gWycoKCcsIHRoaXMucHVzaChfbmFtZSksICcgPSAnLCB0b3AsICcpJ107XG5cdCAgICAgIHN0YWNrID0gdGhpcy50b3BTdGFjaygpO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgaXRlbSA9IGNhbGxiYWNrLmNhbGwodGhpcywgc3RhY2spO1xuXG5cdCAgICBpZiAoIXVzZWRMaXRlcmFsKSB7XG5cdCAgICAgIHRoaXMucG9wU3RhY2soKTtcblx0ICAgIH1cblx0ICAgIGlmIChjcmVhdGVkU3RhY2spIHtcblx0ICAgICAgdGhpcy5zdGFja1Nsb3QtLTtcblx0ICAgIH1cblx0ICAgIHRoaXMucHVzaChwcmVmaXguY29uY2F0KGl0ZW0sICcpJykpO1xuXHQgIH0sXG5cblx0ICBpbmNyU3RhY2s6IGZ1bmN0aW9uIGluY3JTdGFjaygpIHtcblx0ICAgIHRoaXMuc3RhY2tTbG90Kys7XG5cdCAgICBpZiAodGhpcy5zdGFja1Nsb3QgPiB0aGlzLnN0YWNrVmFycy5sZW5ndGgpIHtcblx0ICAgICAgdGhpcy5zdGFja1ZhcnMucHVzaCgnc3RhY2snICsgdGhpcy5zdGFja1Nsb3QpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXMudG9wU3RhY2tOYW1lKCk7XG5cdCAgfSxcblx0ICB0b3BTdGFja05hbWU6IGZ1bmN0aW9uIHRvcFN0YWNrTmFtZSgpIHtcblx0ICAgIHJldHVybiAnc3RhY2snICsgdGhpcy5zdGFja1Nsb3Q7XG5cdCAgfSxcblx0ICBmbHVzaElubGluZTogZnVuY3Rpb24gZmx1c2hJbmxpbmUoKSB7XG5cdCAgICB2YXIgaW5saW5lU3RhY2sgPSB0aGlzLmlubGluZVN0YWNrO1xuXHQgICAgdGhpcy5pbmxpbmVTdGFjayA9IFtdO1xuXHQgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGlubGluZVN0YWNrLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIHZhciBlbnRyeSA9IGlubGluZVN0YWNrW2ldO1xuXHQgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblx0ICAgICAgaWYgKGVudHJ5IGluc3RhbmNlb2YgTGl0ZXJhbCkge1xuXHQgICAgICAgIHRoaXMuY29tcGlsZVN0YWNrLnB1c2goZW50cnkpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHZhciBzdGFjayA9IHRoaXMuaW5jclN0YWNrKCk7XG5cdCAgICAgICAgdGhpcy5wdXNoU291cmNlKFtzdGFjaywgJyA9ICcsIGVudHJ5LCAnOyddKTtcblx0ICAgICAgICB0aGlzLmNvbXBpbGVTdGFjay5wdXNoKHN0YWNrKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0sXG5cdCAgaXNJbmxpbmU6IGZ1bmN0aW9uIGlzSW5saW5lKCkge1xuXHQgICAgcmV0dXJuIHRoaXMuaW5saW5lU3RhY2subGVuZ3RoO1xuXHQgIH0sXG5cblx0ICBwb3BTdGFjazogZnVuY3Rpb24gcG9wU3RhY2sod3JhcHBlZCkge1xuXHQgICAgdmFyIGlubGluZSA9IHRoaXMuaXNJbmxpbmUoKSxcblx0ICAgICAgICBpdGVtID0gKGlubGluZSA/IHRoaXMuaW5saW5lU3RhY2sgOiB0aGlzLmNvbXBpbGVTdGFjaykucG9wKCk7XG5cblx0ICAgIGlmICghd3JhcHBlZCAmJiBpdGVtIGluc3RhbmNlb2YgTGl0ZXJhbCkge1xuXHQgICAgICByZXR1cm4gaXRlbS52YWx1ZTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGlmICghaW5saW5lKSB7XG5cdCAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICAgICAgICBpZiAoIXRoaXMuc3RhY2tTbG90KSB7XG5cdCAgICAgICAgICB0aHJvdyBuZXcgX2V4Y2VwdGlvbjJbJ2RlZmF1bHQnXSgnSW52YWxpZCBzdGFjayBwb3AnKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgdGhpcy5zdGFja1Nsb3QtLTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gaXRlbTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgdG9wU3RhY2s6IGZ1bmN0aW9uIHRvcFN0YWNrKCkge1xuXHQgICAgdmFyIHN0YWNrID0gdGhpcy5pc0lubGluZSgpID8gdGhpcy5pbmxpbmVTdGFjayA6IHRoaXMuY29tcGlsZVN0YWNrLFxuXHQgICAgICAgIGl0ZW0gPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcblxuXHQgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cdCAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIExpdGVyYWwpIHtcblx0ICAgICAgcmV0dXJuIGl0ZW0udmFsdWU7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gaXRlbTtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgY29udGV4dE5hbWU6IGZ1bmN0aW9uIGNvbnRleHROYW1lKGNvbnRleHQpIHtcblx0ICAgIGlmICh0aGlzLnVzZURlcHRocyAmJiBjb250ZXh0KSB7XG5cdCAgICAgIHJldHVybiAnZGVwdGhzWycgKyBjb250ZXh0ICsgJ10nO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuICdkZXB0aCcgKyBjb250ZXh0O1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBxdW90ZWRTdHJpbmc6IGZ1bmN0aW9uIHF1b3RlZFN0cmluZyhzdHIpIHtcblx0ICAgIHJldHVybiB0aGlzLnNvdXJjZS5xdW90ZWRTdHJpbmcoc3RyKTtcblx0ICB9LFxuXG5cdCAgb2JqZWN0TGl0ZXJhbDogZnVuY3Rpb24gb2JqZWN0TGl0ZXJhbChvYmopIHtcblx0ICAgIHJldHVybiB0aGlzLnNvdXJjZS5vYmplY3RMaXRlcmFsKG9iaik7XG5cdCAgfSxcblxuXHQgIGFsaWFzYWJsZTogZnVuY3Rpb24gYWxpYXNhYmxlKG5hbWUpIHtcblx0ICAgIHZhciByZXQgPSB0aGlzLmFsaWFzZXNbbmFtZV07XG5cdCAgICBpZiAocmV0KSB7XG5cdCAgICAgIHJldC5yZWZlcmVuY2VDb3VudCsrO1xuXHQgICAgICByZXR1cm4gcmV0O1xuXHQgICAgfVxuXG5cdCAgICByZXQgPSB0aGlzLmFsaWFzZXNbbmFtZV0gPSB0aGlzLnNvdXJjZS53cmFwKG5hbWUpO1xuXHQgICAgcmV0LmFsaWFzYWJsZSA9IHRydWU7XG5cdCAgICByZXQucmVmZXJlbmNlQ291bnQgPSAxO1xuXG5cdCAgICByZXR1cm4gcmV0O1xuXHQgIH0sXG5cblx0ICBzZXR1cEhlbHBlcjogZnVuY3Rpb24gc2V0dXBIZWxwZXIocGFyYW1TaXplLCBuYW1lLCBibG9ja0hlbHBlcikge1xuXHQgICAgdmFyIHBhcmFtcyA9IFtdLFxuXHQgICAgICAgIHBhcmFtc0luaXQgPSB0aGlzLnNldHVwSGVscGVyQXJncyhuYW1lLCBwYXJhbVNpemUsIHBhcmFtcywgYmxvY2tIZWxwZXIpO1xuXHQgICAgdmFyIGZvdW5kSGVscGVyID0gdGhpcy5uYW1lTG9va3VwKCdoZWxwZXJzJywgbmFtZSwgJ2hlbHBlcicpLFxuXHQgICAgICAgIGNhbGxDb250ZXh0ID0gdGhpcy5hbGlhc2FibGUodGhpcy5jb250ZXh0TmFtZSgwKSArICcgIT0gbnVsbCA/ICcgKyB0aGlzLmNvbnRleHROYW1lKDApICsgJyA6IChjb250YWluZXIubnVsbENvbnRleHQgfHwge30pJyk7XG5cblx0ICAgIHJldHVybiB7XG5cdCAgICAgIHBhcmFtczogcGFyYW1zLFxuXHQgICAgICBwYXJhbXNJbml0OiBwYXJhbXNJbml0LFxuXHQgICAgICBuYW1lOiBmb3VuZEhlbHBlcixcblx0ICAgICAgY2FsbFBhcmFtczogW2NhbGxDb250ZXh0XS5jb25jYXQocGFyYW1zKVxuXHQgICAgfTtcblx0ICB9LFxuXG5cdCAgc2V0dXBQYXJhbXM6IGZ1bmN0aW9uIHNldHVwUGFyYW1zKGhlbHBlciwgcGFyYW1TaXplLCBwYXJhbXMpIHtcblx0ICAgIHZhciBvcHRpb25zID0ge30sXG5cdCAgICAgICAgY29udGV4dHMgPSBbXSxcblx0ICAgICAgICB0eXBlcyA9IFtdLFxuXHQgICAgICAgIGlkcyA9IFtdLFxuXHQgICAgICAgIG9iamVjdEFyZ3MgPSAhcGFyYW1zLFxuXHQgICAgICAgIHBhcmFtID0gdW5kZWZpbmVkO1xuXG5cdCAgICBpZiAob2JqZWN0QXJncykge1xuXHQgICAgICBwYXJhbXMgPSBbXTtcblx0ICAgIH1cblxuXHQgICAgb3B0aW9ucy5uYW1lID0gdGhpcy5xdW90ZWRTdHJpbmcoaGVscGVyKTtcblx0ICAgIG9wdGlvbnMuaGFzaCA9IHRoaXMucG9wU3RhY2soKTtcblxuXHQgICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcblx0ICAgICAgb3B0aW9ucy5oYXNoSWRzID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgfVxuXHQgICAgaWYgKHRoaXMuc3RyaW5nUGFyYW1zKSB7XG5cdCAgICAgIG9wdGlvbnMuaGFzaFR5cGVzID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgICBvcHRpb25zLmhhc2hDb250ZXh0cyA9IHRoaXMucG9wU3RhY2soKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGludmVyc2UgPSB0aGlzLnBvcFN0YWNrKCksXG5cdCAgICAgICAgcHJvZ3JhbSA9IHRoaXMucG9wU3RhY2soKTtcblxuXHQgICAgLy8gQXZvaWQgc2V0dGluZyBmbiBhbmQgaW52ZXJzZSBpZiBuZWl0aGVyIGFyZSBzZXQuIFRoaXMgYWxsb3dzXG5cdCAgICAvLyBoZWxwZXJzIHRvIGRvIGEgY2hlY2sgZm9yIGBpZiAob3B0aW9ucy5mbilgXG5cdCAgICBpZiAocHJvZ3JhbSB8fCBpbnZlcnNlKSB7XG5cdCAgICAgIG9wdGlvbnMuZm4gPSBwcm9ncmFtIHx8ICdjb250YWluZXIubm9vcCc7XG5cdCAgICAgIG9wdGlvbnMuaW52ZXJzZSA9IGludmVyc2UgfHwgJ2NvbnRhaW5lci5ub29wJztcblx0ICAgIH1cblxuXHQgICAgLy8gVGhlIHBhcmFtZXRlcnMgZ28gb24gdG8gdGhlIHN0YWNrIGluIG9yZGVyIChtYWtpbmcgc3VyZSB0aGF0IHRoZXkgYXJlIGV2YWx1YXRlZCBpbiBvcmRlcilcblx0ICAgIC8vIHNvIHdlIG5lZWQgdG8gcG9wIHRoZW0gb2ZmIHRoZSBzdGFjayBpbiByZXZlcnNlIG9yZGVyXG5cdCAgICB2YXIgaSA9IHBhcmFtU2l6ZTtcblx0ICAgIHdoaWxlIChpLS0pIHtcblx0ICAgICAgcGFyYW0gPSB0aGlzLnBvcFN0YWNrKCk7XG5cdCAgICAgIHBhcmFtc1tpXSA9IHBhcmFtO1xuXG5cdCAgICAgIGlmICh0aGlzLnRyYWNrSWRzKSB7XG5cdCAgICAgICAgaWRzW2ldID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuXHQgICAgICAgIHR5cGVzW2ldID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgICAgIGNvbnRleHRzW2ldID0gdGhpcy5wb3BTdGFjaygpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGlmIChvYmplY3RBcmdzKSB7XG5cdCAgICAgIG9wdGlvbnMuYXJncyA9IHRoaXMuc291cmNlLmdlbmVyYXRlQXJyYXkocGFyYW1zKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHRoaXMudHJhY2tJZHMpIHtcblx0ICAgICAgb3B0aW9ucy5pZHMgPSB0aGlzLnNvdXJjZS5nZW5lcmF0ZUFycmF5KGlkcyk7XG5cdCAgICB9XG5cdCAgICBpZiAodGhpcy5zdHJpbmdQYXJhbXMpIHtcblx0ICAgICAgb3B0aW9ucy50eXBlcyA9IHRoaXMuc291cmNlLmdlbmVyYXRlQXJyYXkodHlwZXMpO1xuXHQgICAgICBvcHRpb25zLmNvbnRleHRzID0gdGhpcy5zb3VyY2UuZ2VuZXJhdGVBcnJheShjb250ZXh0cyk7XG5cdCAgICB9XG5cblx0ICAgIGlmICh0aGlzLm9wdGlvbnMuZGF0YSkge1xuXHQgICAgICBvcHRpb25zLmRhdGEgPSAnZGF0YSc7XG5cdCAgICB9XG5cdCAgICBpZiAodGhpcy51c2VCbG9ja1BhcmFtcykge1xuXHQgICAgICBvcHRpb25zLmJsb2NrUGFyYW1zID0gJ2Jsb2NrUGFyYW1zJztcblx0ICAgIH1cblx0ICAgIHJldHVybiBvcHRpb25zO1xuXHQgIH0sXG5cblx0ICBzZXR1cEhlbHBlckFyZ3M6IGZ1bmN0aW9uIHNldHVwSGVscGVyQXJncyhoZWxwZXIsIHBhcmFtU2l6ZSwgcGFyYW1zLCB1c2VSZWdpc3Rlcikge1xuXHQgICAgdmFyIG9wdGlvbnMgPSB0aGlzLnNldHVwUGFyYW1zKGhlbHBlciwgcGFyYW1TaXplLCBwYXJhbXMpO1xuXHQgICAgb3B0aW9ucyA9IHRoaXMub2JqZWN0TGl0ZXJhbChvcHRpb25zKTtcblx0ICAgIGlmICh1c2VSZWdpc3Rlcikge1xuXHQgICAgICB0aGlzLnVzZVJlZ2lzdGVyKCdvcHRpb25zJyk7XG5cdCAgICAgIHBhcmFtcy5wdXNoKCdvcHRpb25zJyk7XG5cdCAgICAgIHJldHVybiBbJ29wdGlvbnM9Jywgb3B0aW9uc107XG5cdCAgICB9IGVsc2UgaWYgKHBhcmFtcykge1xuXHQgICAgICBwYXJhbXMucHVzaChvcHRpb25zKTtcblx0ICAgICAgcmV0dXJuICcnO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuIG9wdGlvbnM7XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXG5cdChmdW5jdGlvbiAoKSB7XG5cdCAgdmFyIHJlc2VydmVkV29yZHMgPSAoJ2JyZWFrIGVsc2UgbmV3IHZhcicgKyAnIGNhc2UgZmluYWxseSByZXR1cm4gdm9pZCcgKyAnIGNhdGNoIGZvciBzd2l0Y2ggd2hpbGUnICsgJyBjb250aW51ZSBmdW5jdGlvbiB0aGlzIHdpdGgnICsgJyBkZWZhdWx0IGlmIHRocm93JyArICcgZGVsZXRlIGluIHRyeScgKyAnIGRvIGluc3RhbmNlb2YgdHlwZW9mJyArICcgYWJzdHJhY3QgZW51bSBpbnQgc2hvcnQnICsgJyBib29sZWFuIGV4cG9ydCBpbnRlcmZhY2Ugc3RhdGljJyArICcgYnl0ZSBleHRlbmRzIGxvbmcgc3VwZXInICsgJyBjaGFyIGZpbmFsIG5hdGl2ZSBzeW5jaHJvbml6ZWQnICsgJyBjbGFzcyBmbG9hdCBwYWNrYWdlIHRocm93cycgKyAnIGNvbnN0IGdvdG8gcHJpdmF0ZSB0cmFuc2llbnQnICsgJyBkZWJ1Z2dlciBpbXBsZW1lbnRzIHByb3RlY3RlZCB2b2xhdGlsZScgKyAnIGRvdWJsZSBpbXBvcnQgcHVibGljIGxldCB5aWVsZCBhd2FpdCcgKyAnIG51bGwgdHJ1ZSBmYWxzZScpLnNwbGl0KCcgJyk7XG5cblx0ICB2YXIgY29tcGlsZXJXb3JkcyA9IEphdmFTY3JpcHRDb21waWxlci5SRVNFUlZFRF9XT1JEUyA9IHt9O1xuXG5cdCAgZm9yICh2YXIgaSA9IDAsIGwgPSByZXNlcnZlZFdvcmRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgY29tcGlsZXJXb3Jkc1tyZXNlcnZlZFdvcmRzW2ldXSA9IHRydWU7XG5cdCAgfVxuXHR9KSgpO1xuXG5cdEphdmFTY3JpcHRDb21waWxlci5pc1ZhbGlkSmF2YVNjcmlwdFZhcmlhYmxlTmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG5cdCAgcmV0dXJuICFKYXZhU2NyaXB0Q29tcGlsZXIuUkVTRVJWRURfV09SRFNbbmFtZV0gJiYgL15bYS16QS1aXyRdWzAtOWEtekEtWl8kXSokLy50ZXN0KG5hbWUpO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIHN0cmljdExvb2t1cChyZXF1aXJlVGVybWluYWwsIGNvbXBpbGVyLCBwYXJ0cywgdHlwZSkge1xuXHQgIHZhciBzdGFjayA9IGNvbXBpbGVyLnBvcFN0YWNrKCksXG5cdCAgICAgIGkgPSAwLFxuXHQgICAgICBsZW4gPSBwYXJ0cy5sZW5ndGg7XG5cdCAgaWYgKHJlcXVpcmVUZXJtaW5hbCkge1xuXHQgICAgbGVuLS07XG5cdCAgfVxuXG5cdCAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgc3RhY2sgPSBjb21waWxlci5uYW1lTG9va3VwKHN0YWNrLCBwYXJ0c1tpXSwgdHlwZSk7XG5cdCAgfVxuXG5cdCAgaWYgKHJlcXVpcmVUZXJtaW5hbCkge1xuXHQgICAgcmV0dXJuIFtjb21waWxlci5hbGlhc2FibGUoJ2NvbnRhaW5lci5zdHJpY3QnKSwgJygnLCBzdGFjaywgJywgJywgY29tcGlsZXIucXVvdGVkU3RyaW5nKHBhcnRzW2ldKSwgJyknXTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmV0dXJuIHN0YWNrO1xuXHQgIH1cblx0fVxuXG5cdGV4cG9ydHNbJ2RlZmF1bHQnXSA9IEphdmFTY3JpcHRDb21waWxlcjtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pLFxuLyogNDMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBnbG9iYWwgZGVmaW5lICovXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRleHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5cdHZhciBfdXRpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXG5cdHZhciBTb3VyY2VOb2RlID0gdW5kZWZpbmVkO1xuXG5cdHRyeSB7XG5cdCAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ICBpZiAoZmFsc2UpIHtcblx0ICAgIC8vIFdlIGRvbid0IHN1cHBvcnQgdGhpcyBpbiBBTUQgZW52aXJvbm1lbnRzLiBGb3IgdGhlc2UgZW52aXJvbm1lbnRzLCB3ZSBhc3VzbWUgdGhhdFxuXHQgICAgLy8gdGhleSBhcmUgcnVubmluZyBvbiB0aGUgYnJvd3NlciBhbmQgdGh1cyBoYXZlIG5vIG5lZWQgZm9yIHRoZSBzb3VyY2UtbWFwIGxpYnJhcnkuXG5cdCAgICB2YXIgU291cmNlTWFwID0gcmVxdWlyZSgnc291cmNlLW1hcCcpO1xuXHQgICAgU291cmNlTm9kZSA9IFNvdXJjZU1hcC5Tb3VyY2VOb2RlO1xuXHQgIH1cblx0fSBjYXRjaCAoZXJyKSB7fVxuXHQvKiBOT1AgKi9cblxuXHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWY6IHRlc3RlZCBidXQgbm90IGNvdmVyZWQgaW4gaXN0YW5idWwgZHVlIHRvIGRpc3QgYnVpbGQgICovXG5cdGlmICghU291cmNlTm9kZSkge1xuXHQgIFNvdXJjZU5vZGUgPSBmdW5jdGlvbiAobGluZSwgY29sdW1uLCBzcmNGaWxlLCBjaHVua3MpIHtcblx0ICAgIHRoaXMuc3JjID0gJyc7XG5cdCAgICBpZiAoY2h1bmtzKSB7XG5cdCAgICAgIHRoaXMuYWRkKGNodW5rcyk7XG5cdCAgICB9XG5cdCAgfTtcblx0ICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHQgIFNvdXJjZU5vZGUucHJvdG90eXBlID0ge1xuXHQgICAgYWRkOiBmdW5jdGlvbiBhZGQoY2h1bmtzKSB7XG5cdCAgICAgIGlmIChfdXRpbHMuaXNBcnJheShjaHVua3MpKSB7XG5cdCAgICAgICAgY2h1bmtzID0gY2h1bmtzLmpvaW4oJycpO1xuXHQgICAgICB9XG5cdCAgICAgIHRoaXMuc3JjICs9IGNodW5rcztcblx0ICAgIH0sXG5cdCAgICBwcmVwZW5kOiBmdW5jdGlvbiBwcmVwZW5kKGNodW5rcykge1xuXHQgICAgICBpZiAoX3V0aWxzLmlzQXJyYXkoY2h1bmtzKSkge1xuXHQgICAgICAgIGNodW5rcyA9IGNodW5rcy5qb2luKCcnKTtcblx0ICAgICAgfVxuXHQgICAgICB0aGlzLnNyYyA9IGNodW5rcyArIHRoaXMuc3JjO1xuXHQgICAgfSxcblx0ICAgIHRvU3RyaW5nV2l0aFNvdXJjZU1hcDogZnVuY3Rpb24gdG9TdHJpbmdXaXRoU291cmNlTWFwKCkge1xuXHQgICAgICByZXR1cm4geyBjb2RlOiB0aGlzLnRvU3RyaW5nKCkgfTtcblx0ICAgIH0sXG5cdCAgICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnNyYztcblx0ICAgIH1cblx0ICB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gY2FzdENodW5rKGNodW5rLCBjb2RlR2VuLCBsb2MpIHtcblx0ICBpZiAoX3V0aWxzLmlzQXJyYXkoY2h1bmspKSB7XG5cdCAgICB2YXIgcmV0ID0gW107XG5cblx0ICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjaHVuay5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICByZXQucHVzaChjb2RlR2VuLndyYXAoY2h1bmtbaV0sIGxvYykpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHJldDtcblx0ICB9IGVsc2UgaWYgKHR5cGVvZiBjaHVuayA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBjaHVuayA9PT0gJ251bWJlcicpIHtcblx0ICAgIC8vIEhhbmRsZSBwcmltaXRpdmVzIHRoYXQgdGhlIFNvdXJjZU5vZGUgd2lsbCB0aHJvdyB1cCBvblxuXHQgICAgcmV0dXJuIGNodW5rICsgJyc7XG5cdCAgfVxuXHQgIHJldHVybiBjaHVuaztcblx0fVxuXG5cdGZ1bmN0aW9uIENvZGVHZW4oc3JjRmlsZSkge1xuXHQgIHRoaXMuc3JjRmlsZSA9IHNyY0ZpbGU7XG5cdCAgdGhpcy5zb3VyY2UgPSBbXTtcblx0fVxuXG5cdENvZGVHZW4ucHJvdG90eXBlID0ge1xuXHQgIGlzRW1wdHk6IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG5cdCAgICByZXR1cm4gIXRoaXMuc291cmNlLmxlbmd0aDtcblx0ICB9LFxuXHQgIHByZXBlbmQ6IGZ1bmN0aW9uIHByZXBlbmQoc291cmNlLCBsb2MpIHtcblx0ICAgIHRoaXMuc291cmNlLnVuc2hpZnQodGhpcy53cmFwKHNvdXJjZSwgbG9jKSk7XG5cdCAgfSxcblx0ICBwdXNoOiBmdW5jdGlvbiBwdXNoKHNvdXJjZSwgbG9jKSB7XG5cdCAgICB0aGlzLnNvdXJjZS5wdXNoKHRoaXMud3JhcChzb3VyY2UsIGxvYykpO1xuXHQgIH0sXG5cblx0ICBtZXJnZTogZnVuY3Rpb24gbWVyZ2UoKSB7XG5cdCAgICB2YXIgc291cmNlID0gdGhpcy5lbXB0eSgpO1xuXHQgICAgdGhpcy5lYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG5cdCAgICAgIHNvdXJjZS5hZGQoWycgICcsIGxpbmUsICdcXG4nXSk7XG5cdCAgICB9KTtcblx0ICAgIHJldHVybiBzb3VyY2U7XG5cdCAgfSxcblxuXHQgIGVhY2g6IGZ1bmN0aW9uIGVhY2goaXRlcikge1xuXHQgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuc291cmNlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdCAgICAgIGl0ZXIodGhpcy5zb3VyY2VbaV0pO1xuXHQgICAgfVxuXHQgIH0sXG5cblx0ICBlbXB0eTogZnVuY3Rpb24gZW1wdHkoKSB7XG5cdCAgICB2YXIgbG9jID0gdGhpcy5jdXJyZW50TG9jYXRpb24gfHwgeyBzdGFydDoge30gfTtcblx0ICAgIHJldHVybiBuZXcgU291cmNlTm9kZShsb2Muc3RhcnQubGluZSwgbG9jLnN0YXJ0LmNvbHVtbiwgdGhpcy5zcmNGaWxlKTtcblx0ICB9LFxuXHQgIHdyYXA6IGZ1bmN0aW9uIHdyYXAoY2h1bmspIHtcblx0ICAgIHZhciBsb2MgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB0aGlzLmN1cnJlbnRMb2NhdGlvbiB8fCB7IHN0YXJ0OiB7fSB9IDogYXJndW1lbnRzWzFdO1xuXG5cdCAgICBpZiAoY2h1bmsgaW5zdGFuY2VvZiBTb3VyY2VOb2RlKSB7XG5cdCAgICAgIHJldHVybiBjaHVuaztcblx0ICAgIH1cblxuXHQgICAgY2h1bmsgPSBjYXN0Q2h1bmsoY2h1bmssIHRoaXMsIGxvYyk7XG5cblx0ICAgIHJldHVybiBuZXcgU291cmNlTm9kZShsb2Muc3RhcnQubGluZSwgbG9jLnN0YXJ0LmNvbHVtbiwgdGhpcy5zcmNGaWxlLCBjaHVuayk7XG5cdCAgfSxcblxuXHQgIGZ1bmN0aW9uQ2FsbDogZnVuY3Rpb24gZnVuY3Rpb25DYWxsKGZuLCB0eXBlLCBwYXJhbXMpIHtcblx0ICAgIHBhcmFtcyA9IHRoaXMuZ2VuZXJhdGVMaXN0KHBhcmFtcyk7XG5cdCAgICByZXR1cm4gdGhpcy53cmFwKFtmbiwgdHlwZSA/ICcuJyArIHR5cGUgKyAnKCcgOiAnKCcsIHBhcmFtcywgJyknXSk7XG5cdCAgfSxcblxuXHQgIHF1b3RlZFN0cmluZzogZnVuY3Rpb24gcXVvdGVkU3RyaW5nKHN0cikge1xuXHQgICAgcmV0dXJuICdcIicgKyAoc3RyICsgJycpLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKS5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJykucmVwbGFjZSgvXFx1MjAyOC9nLCAnXFxcXHUyMDI4JykgLy8gUGVyIEVjbWEtMjYyIDcuMyArIDcuOC40XG5cdCAgICAucmVwbGFjZSgvXFx1MjAyOS9nLCAnXFxcXHUyMDI5JykgKyAnXCInO1xuXHQgIH0sXG5cblx0ICBvYmplY3RMaXRlcmFsOiBmdW5jdGlvbiBvYmplY3RMaXRlcmFsKG9iaikge1xuXHQgICAgdmFyIHBhaXJzID0gW107XG5cblx0ICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcblx0ICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdCAgICAgICAgdmFyIHZhbHVlID0gY2FzdENodW5rKG9ialtrZXldLCB0aGlzKTtcblx0ICAgICAgICBpZiAodmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgICBwYWlycy5wdXNoKFt0aGlzLnF1b3RlZFN0cmluZyhrZXkpLCAnOicsIHZhbHVlXSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHZhciByZXQgPSB0aGlzLmdlbmVyYXRlTGlzdChwYWlycyk7XG5cdCAgICByZXQucHJlcGVuZCgneycpO1xuXHQgICAgcmV0LmFkZCgnfScpO1xuXHQgICAgcmV0dXJuIHJldDtcblx0ICB9LFxuXG5cdCAgZ2VuZXJhdGVMaXN0OiBmdW5jdGlvbiBnZW5lcmF0ZUxpc3QoZW50cmllcykge1xuXHQgICAgdmFyIHJldCA9IHRoaXMuZW1wdHkoKTtcblxuXHQgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgaWYgKGkpIHtcblx0ICAgICAgICByZXQuYWRkKCcsJyk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXQuYWRkKGNhc3RDaHVuayhlbnRyaWVzW2ldLCB0aGlzKSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiByZXQ7XG5cdCAgfSxcblxuXHQgIGdlbmVyYXRlQXJyYXk6IGZ1bmN0aW9uIGdlbmVyYXRlQXJyYXkoZW50cmllcykge1xuXHQgICAgdmFyIHJldCA9IHRoaXMuZ2VuZXJhdGVMaXN0KGVudHJpZXMpO1xuXHQgICAgcmV0LnByZXBlbmQoJ1snKTtcblx0ICAgIHJldC5hZGQoJ10nKTtcblxuXHQgICAgcmV0dXJuIHJldDtcblx0ICB9XG5cdH07XG5cblx0ZXhwb3J0c1snZGVmYXVsdCddID0gQ29kZUdlbjtcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH0pXG4vKioqKioqLyBdKVxufSk7XG47IiwiaW1wb3J0IGhicyBmcm9tICcuLy4uL2JlaGF2aW9ycy9oYnMnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFyaW9uZXR0ZS5WaWV3LmV4dGVuZCh7XG4gICAgdGVtcGxhdGU6IGRhdGEgPT4gJ2F1dGhvcml6YXRpb24nLFxuICAgIGJlaGF2aW9yczogW2hic10sXG4gICAgSEJUZW1wbGF0ZTogJ3RlbXBsYXRlcy92aWV3cy9hdGhvcml6YXRpb24uaGJzJyxcbiAgICBjbGFzc05hbWU6ICdhdXRob3JpemF0aW9uJyxcbiAgICB1aToge1xuICAgICAgICBhdXRob3JpemU6ICcuYXV0aG9yaXphdGlvbl9fYnRuJyxcbiAgICAgICAgZm9ybVN1Ym1pdDogJy5hdXRob3JpemF0aW9uX19ibG9jaycsXG4gICAgICAgIGdvb2dsZVNpZ25pbjogJy5hdXRob3JpemF0aW9uX19nb29nbGUnLFxuICAgICAgICByZWdpc3RlcjogJy5yZWdpc3RyYXRpb25fX2J0bidcbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgQHVpLmF1dGhvcml6ZSc6ICdhdXRob3JpemVVc2VyJyxcbiAgICAgICAgJ3N1Ym1pdCBAdWkuZm9ybVN1Ym1pdCc6ICdhdXRob3JpemVVc2VyJyxcbiAgICAgICAgJ2NsaWNrIEB1aS5nb29nbGVTaWduaW4nOiAnZ29vZ2xlU2lnbmluJyxcbiAgICAgICAgJ2NsaWNrIEB1aS5yZWdpc3Rlcic6ICdyZWdpc3RlclVzZXInXG4gICAgfSxcbiAgICBnb29nbGVTaWduaW46IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgcHJvdmlkZXIgPSBuZXcgZmlyZWJhc2UuYXV0aC5Hb29nbGVBdXRoUHJvdmlkZXIoKTtcbiAgICAgICAgbGV0IHByb21pc2UgPSBmaXJlYmFzZS5hdXRoKCkuc2lnbkluV2l0aFBvcHVwKHByb3ZpZGVyKTtcbiAgICAgICAgcHJvbWlzZS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgYWxlcnQoZS5tZXNzYWdlKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIGF1dGhvcml6ZVVzZXI6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgZW1haWwgPSB0aGlzLiQoJy5lbWFpbF9faW5wdXQnKS52YWwoKSxcbiAgICAgICAgICAgIHBhc3MgPSB0aGlzLiQoJy5wYXNzX19pbnB1dCcpLnZhbCgpO1xuXG4gICAgICAgIHZhciBhdXRoID0gZmlyZWJhc2UuYXV0aCgpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGF1dGguc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoZW1haWwsIHBhc3MpO1xuICAgICAgICBwcm9taXNlLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBhbGVydChlLm1lc3NhZ2UpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgcmVnaXN0ZXJVc2VyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbWFpbCA9IHRoaXMuJCgnLmVtYWlsX19pbnB1dCcpLnZhbCgpLFxuICAgICAgICAgICAgcGFzcyA9IHRoaXMuJCgnLnBhc3NfX2lucHV0JykudmFsKCk7XG5cbiAgICAgICAgdmFyIGF1dGggPSBmaXJlYmFzZS5hdXRoKCk7XG4gICAgICAgIHZhciBwcm9taXNlID0gYXV0aC5jcmVhdGVVc2VyV2l0aEVtYWlsQW5kUGFzc3dvcmQoZW1haWwsIHBhc3MpO1xuXG4gICAgICAgIHByb21pc2UuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGFsZXJ0KGUubWVzc2FnZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgb25Mb2FkVGVtcGxhdGUgKCkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbn0pOyIsImltcG9ydCBoYnMgZnJvbSAnLi8uLi9iZWhhdmlvcnMvaGJzJztcblxuXG52YXIgVGFza01vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdldChcInRpdGxlXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnNldCh7XCJ0aXRsZVwiOiB0aGlzLmRlZmF1bHRzLnRpdGxlfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbihhdHRycykge1xuICAgICAgICBpZiAoICEkLnRyaW0oYXR0cnMudGl0bGUpICkge1xuICAgICAgICAgICAgcmV0dXJuICfQntGI0LjQsdC60LAhJztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGVmYXVsdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICB0aXRsZTogJ9Cd0L7QstCw0Y8g0LfQsNC00LDRh9CwJyxcbiAgICAgICAgICAgIGRvbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHRvZ2dsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2F2ZSh7IGRvbmU6IXRoaXMuZ2V0KFwiZG9uZVwiKX0pO1xuICAgIH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG59KTtcblxudmFyIFRhc2sgPSBNYXJpb25ldHRlLlZpZXcuZXh0ZW5kKHtcbiAgICB0ZW1wbGF0ZTogZGF0YSA9PiAnbWFpbiB2aWV3JyxcbiAgICBiZWhhdmlvcnM6IFtoYnNdLFxuICAgIEhCVGVtcGxhdGU6ICd0ZW1wbGF0ZXMvdmlld3MvdG9kby5pdGVtLmhicycsXG4gICAgdGFnTmFtZTogJ2xpJyxcbiAgICBjbGFzc05hbWU6ICd0YXNrc19faXRlbScsXG4gICAgdWk6IHtcbiAgICAgICAgXCJlZGl0XCI6IFwiLnRhc2tzX190ZXh0XCIsXG4gICAgICAgIFwiZWRpdFN0eWxlXCI6IFwiLnRhc2tzX190ZXh0XCIsXG4gICAgICAgIFwicmVtb3ZlXCI6IFwiLnRhc2tzX19yZW1vdmVcIixcbiAgICAgICAgXCJ0b2dnbGVcIjogXCIudGFza3NfX3RvZ2dsZVwiXG4gICAgfSxcbiAgICBldmVudHM6IHtcbiAgICAgICAgXCJmb2N1c291dCBAdWkuZWRpdFwiOiBcImVkaXRUYXNrXCIsXG4gICAgICAgIFwiY2xpY2sgQHVpLmVkaXRTdHlsZVwiOiBcImVkaXRTdHlsZXNcIixcbiAgICAgICAgXCJjbGljayBAdWkudG9nZ2xlXCI6IFwidG9nZ2xlRG9uZVwiLFxuICAgICAgICAnY2xpY2sgQHVpLnJlbW92ZSc6ICdyZW1vdmVNb2RlbCdcbiAgICB9LFxuICAgIHRyaWdnZXJzOiB7XG4gICAgICAgICdjbGljayBAdWkucmVtb3ZlJzogJ3JlbW92ZTptb2RlbCdcbiAgICB9LFxuICAgIGVkaXRTdHlsZXM6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmFkZENsYXNzKCdlZGl0JylcbiAgICB9LFxuICAgIHJlbW92ZU1vZGVsOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHRoaXMubW9kZWwuY2xlYXIoKTtcbiAgICB9LFxuICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ2RvbmUnLCB0aGlzLm1vZGVsLmdldCgnZG9uZScpKTtcbiAgICB9LFxuICAgIGVkaXRUYXNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgbmV3VGFza1RpdGxlID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS50ZXh0KCk7XG4gICAgICAgIGlmIChuZXdUYXNrVGl0bGUgPT09ICcnKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLmNsZWFyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNhdmUoe1widGl0bGVcIjogXy5lc2NhcGUobmV3VGFza1RpdGxlKX0se3ZhbGlkYXRlOnRydWV9KTvvu79cbiAgICAgICAgICAgICQoZXZlbnQuY3VycmVudFRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VkaXQnKVxuICAgICAgICB9XG5cbiAgICB9LFxuICAgIHRvZ2dsZURvbmU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHRoaXMubW9kZWwudG9nZ2xlKCk7XG4gICAgfSxcbiAgICBvbkxvYWRUZW1wbGF0ZSAoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICB9XG59KTtcblxudmFyIFRhc2tDb2xsZWN0aW9uVmlldyA9IE1hcmlvbmV0dGUuQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAndWwnLFxuICAgIGNsYXNzTmFtZTogJ3Rhc2tzX19saXN0JyxcbiAgICBjaGlsZFZpZXc6IFRhc2ssXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLm9uKCdjaGFuZ2UnLCBfLmJpbmQodGhpcy5yZW5kZXIsIHRoaXMpKTtcbiAgICB9LFxuICAgIG9uQ2hpbGR2aWV3UmVtb3ZlTW9kZWw6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5yZW1vdmUodmlldy5tb2RlbCk7XG4gICAgfSxcbiAgICB2aWV3Q29tcGFyYXRvcjogZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIG1vZGVsLmdldCgnZG9uZScpXG4gICAgfVxufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXJpb25ldHRlLlZpZXcuZXh0ZW5kKHtcbiAgICB0ZW1wbGF0ZTogZGF0YSA9PiAnbmV3cyBpdGVtJyxcbiAgICBiZWhhdmlvcnM6IFtoYnNdLFxuICAgIEhCVGVtcGxhdGU6ICd0ZW1wbGF0ZXMvdmlld3MvY3VycmVudC51c2VyLmhicycsXG4gICAgY2xhc3NOYW1lOiAnY29udGFpbmVyJyxcbiAgICByZWdpb25zOiB7XG4gICAgICAgIGxpc3Q6IHtcbiAgICAgICAgICAgIGVsOiAnLnVzZXJfX3Rhc2tzJ1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1aToge1xuICAgICAgICBsb2dPdXQ6ICcubG9nb3V0X19idG4nLFxuICAgICAgICBhZGR0YXNrOiAnLnVzZXJfX2FkZHRhc2snXG4gICAgfSxcbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIEB1aS5sb2dPdXQnOiAnbG9nT3V0JyxcbiAgICAgICAgJ2NsaWNrIEB1aS5hZGR0YXNrJzogJ2FkZFRhc2snXG4gICAgfSxcbiAgICBhZGRUYXNrOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyICRpbnB1dCA9ICQoJy51c2VyX190YXNrJyk7XG4gICAgICAgIHZhciBuZXdUYXNrVGl0bGUgPSAkaW5wdXQudmFsKCk7XG4gICAgICAgIG5ld1Rhc2tUaXRsZSA9IF8uZXNjYXBlKG5ld1Rhc2tUaXRsZSk7XG4gICAgICAgICRpbnB1dC52YWwoJycpO1xuICAgICAgICBpZiAoIW5ld1Rhc2tUaXRsZSkgcmV0dXJuO1xuICAgICAgICBpZiAobmV3VGFza1RpdGxlLmxlbmd0aCA+IDEwMCkgcmV0dXJuO1xuICAgICAgICB0aGlzLnRhc2tzQ29sbGVjdGlvbi5hZGQoe3RpdGxlOiBuZXdUYXNrVGl0bGV9KTtcbiAgICB9LFxuICAgIGxvZ091dDogZnVuY3Rpb24gKCkge1xuICAgICAgICBmaXJlYmFzZS5hdXRoKCkuc2lnbk91dCgpXG4gICAgfSxcbiAgICBpbml0VXNlckxpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVzZXJJZCA9IGZpcmViYXNlLmF1dGgoKS5jdXJyZW50VXNlci51aWQ7XG4gICAgICAgIHZhciBlbWFpbCA9IGZpcmViYXNlLmF1dGgoKS5jdXJyZW50VXNlci5lbWFpbDtcblxuICAgICAgICAkKCcudXNlcl9fbmFtZScpLnRleHQoZW1haWwpO1xuICAgICAgICB2YXIgVGFza3NDb2xsZWN0aW9uID0gQmFja2JvbmUuRmlyZWJhc2UuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgICAgICAgICAgbW9kZWw6IFRhc2tNb2RlbCxcbiAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vbWFyaW9uZXR0ZS10b2RvLWFwcC5maXJlYmFzZWlvLmNvbS9Vc2Vycy8nKyB1c2VySWQgKycnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudGFza3NDb2xsZWN0aW9uID0gbmV3IFRhc2tzQ29sbGVjdGlvbigpO1xuICAgICAgICB0aGlzLnRhc2tDb2xsZWN0aW9uVmlldyA9IG5ldyBUYXNrQ29sbGVjdGlvblZpZXcoe1xuICAgICAgICAgICAgY29sbGVjdGlvbjogdGhpcy50YXNrc0NvbGxlY3Rpb25cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zaG93Q2hpbGRWaWV3KCdsaXN0JywgdGhpcy50YXNrQ29sbGVjdGlvblZpZXcpO1xuICAgIH0sXG4gICAgb25Mb2FkVGVtcGxhdGUgKCkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgICAgIHRoaXMuaW5pdFVzZXJMaXN0KCk7XG4gICAgfVxufSkiLCJpbXBvcnQgaGJzIGZyb20gJy4vLi4vYmVoYXZpb3JzL2hicyc7XG5cbmNvbnN0IGNvbmZpZyA9IHtcbiAgICBhcGlLZXk6IFwiQUl6YVN5QkYyaEVCTWJHS2VRTTNqa25Gc3RBTjBXNmVCN08zeTJNXCIsXG4gICAgYXV0aERvbWFpbjogXCJtYXJpb25ldHRlLXRvZG8tYXBwLmZpcmViYXNlYXBwLmNvbVwiLFxuICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vbWFyaW9uZXR0ZS10b2RvLWFwcC5maXJlYmFzZWlvLmNvbVwiLFxuICAgIHByb2plY3RJZDogXCJtYXJpb25ldHRlLXRvZG8tYXBwXCIsXG4gICAgc3RvcmFnZUJ1Y2tldDogXCJtYXJpb25ldHRlLXRvZG8tYXBwLmFwcHNwb3QuY29tXCIsXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMjY5MDMwNjI3Nzc2XCJcbn07XG5maXJlYmFzZS5pbml0aWFsaXplQXBwKGNvbmZpZyk7XG5cbmNvbnN0IFBBR0VTID0ge1xuICAgIGF0aG9yaXphdGlvbjogcmVxdWlyZSgnLi9hdGhvcml6YXRpb24nKSxcbiAgICB1c2VyOiByZXF1aXJlKCcuL2N1cnJlbnQudXNlcicpXG59O1xuXG5leHBvcnQgZGVmYXVsdCAgTWFyaW9uZXR0ZS5WaWV3LmV4dGVuZCh7XG4gICAgdGVtcGxhdGU6IGRhdGEgPT4gJ21haW4gdmlldycsXG4gICAgYmVoYXZpb3JzOiBbaGJzXSxcbiAgICBIQlRlbXBsYXRlOiAndGVtcGxhdGVzL2xheW91dC5oYnMnLFxuICAgIGNsYXNzTmFtZTogJ21haW4tYXBwJyxcbiAgICByZWdpb25zOiB7XG4gICAgICAgIGFwcDoge1xuICAgICAgICAgICAgZWw6ICcudG9kb19fY29udGVudCcsXG4gICAgICAgICAgICByZXBsYWNlRWxlbWVudDogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tBdXRoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgZmlyZWJhc2UuYXV0aCgpLm9uQXV0aFN0YXRlQ2hhbmdlZChmdW5jdGlvbiAoZmlyZWJhc2VVc2VyKSB7XG4gICAgICAgICAgICBpZiAoZmlyZWJhc2VVc2VyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1VzZXIgbG9nZ2VkIEluJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0NoaWxkVmlldygnYXBwJywgbmV3IFBBR0VTLnVzZXIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3QgbG9nZ2VkIEluJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0NoaWxkVmlldygnYXBwJywgbmV3IFBBR0VTLmF0aG9yaXphdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgb25Mb2FkVGVtcGxhdGUgKCkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB0aGlzLmNoZWNrQXV0aCgpO1xuICAgIH1cbn0pO1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQSBkYXRhIHN0cnVjdHVyZSB3aGljaCBpcyBhIGNvbWJpbmF0aW9uIG9mIGFuIGFycmF5IGFuZCBhIHNldC4gQWRkaW5nIGEgbmV3XG4gKiBtZW1iZXIgaXMgTygxKSwgdGVzdGluZyBmb3IgbWVtYmVyc2hpcCBpcyBPKDEpLCBhbmQgZmluZGluZyB0aGUgaW5kZXggb2YgYW5cbiAqIGVsZW1lbnQgaXMgTygxKS4gUmVtb3ZpbmcgZWxlbWVudHMgZnJvbSB0aGUgc2V0IGlzIG5vdCBzdXBwb3J0ZWQuIE9ubHlcbiAqIHN0cmluZ3MgYXJlIHN1cHBvcnRlZCBmb3IgbWVtYmVyc2hpcC5cbiAqL1xuZnVuY3Rpb24gQXJyYXlTZXQoKSB7XG4gIHRoaXMuX2FycmF5ID0gW107XG4gIHRoaXMuX3NldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG59XG5cbi8qKlxuICogU3RhdGljIG1ldGhvZCBmb3IgY3JlYXRpbmcgQXJyYXlTZXQgaW5zdGFuY2VzIGZyb20gYW4gZXhpc3RpbmcgYXJyYXkuXG4gKi9cbkFycmF5U2V0LmZyb21BcnJheSA9IGZ1bmN0aW9uIEFycmF5U2V0X2Zyb21BcnJheShhQXJyYXksIGFBbGxvd0R1cGxpY2F0ZXMpIHtcbiAgdmFyIHNldCA9IG5ldyBBcnJheVNldCgpO1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gYUFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgc2V0LmFkZChhQXJyYXlbaV0sIGFBbGxvd0R1cGxpY2F0ZXMpO1xuICB9XG4gIHJldHVybiBzZXQ7XG59O1xuXG4vKipcbiAqIFJldHVybiBob3cgbWFueSB1bmlxdWUgaXRlbXMgYXJlIGluIHRoaXMgQXJyYXlTZXQuIElmIGR1cGxpY2F0ZXMgaGF2ZSBiZWVuXG4gKiBhZGRlZCwgdGhhbiB0aG9zZSBkbyBub3QgY291bnQgdG93YXJkcyB0aGUgc2l6ZS5cbiAqXG4gKiBAcmV0dXJucyBOdW1iZXJcbiAqL1xuQXJyYXlTZXQucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiBBcnJheVNldF9zaXplKCkge1xuICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5fc2V0KS5sZW5ndGg7XG59O1xuXG4vKipcbiAqIEFkZCB0aGUgZ2l2ZW4gc3RyaW5nIHRvIHRoaXMgc2V0LlxuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5BcnJheVNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gQXJyYXlTZXRfYWRkKGFTdHIsIGFBbGxvd0R1cGxpY2F0ZXMpIHtcbiAgdmFyIHNTdHIgPSB1dGlsLnRvU2V0U3RyaW5nKGFTdHIpO1xuICB2YXIgaXNEdXBsaWNhdGUgPSBoYXMuY2FsbCh0aGlzLl9zZXQsIHNTdHIpO1xuICB2YXIgaWR4ID0gdGhpcy5fYXJyYXkubGVuZ3RoO1xuICBpZiAoIWlzRHVwbGljYXRlIHx8IGFBbGxvd0R1cGxpY2F0ZXMpIHtcbiAgICB0aGlzLl9hcnJheS5wdXNoKGFTdHIpO1xuICB9XG4gIGlmICghaXNEdXBsaWNhdGUpIHtcbiAgICB0aGlzLl9zZXRbc1N0cl0gPSBpZHg7XG4gIH1cbn07XG5cbi8qKlxuICogSXMgdGhlIGdpdmVuIHN0cmluZyBhIG1lbWJlciBvZiB0aGlzIHNldD9cbiAqXG4gKiBAcGFyYW0gU3RyaW5nIGFTdHJcbiAqL1xuQXJyYXlTZXQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIEFycmF5U2V0X2hhcyhhU3RyKSB7XG4gIHZhciBzU3RyID0gdXRpbC50b1NldFN0cmluZyhhU3RyKTtcbiAgcmV0dXJuIGhhcy5jYWxsKHRoaXMuX3NldCwgc1N0cik7XG59O1xuXG4vKipcbiAqIFdoYXQgaXMgdGhlIGluZGV4IG9mIHRoZSBnaXZlbiBzdHJpbmcgaW4gdGhlIGFycmF5P1xuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5BcnJheVNldC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIEFycmF5U2V0X2luZGV4T2YoYVN0cikge1xuICB2YXIgc1N0ciA9IHV0aWwudG9TZXRTdHJpbmcoYVN0cik7XG4gIGlmIChoYXMuY2FsbCh0aGlzLl9zZXQsIHNTdHIpKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NldFtzU3RyXTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFTdHIgKyAnXCIgaXMgbm90IGluIHRoZSBzZXQuJyk7XG59O1xuXG4vKipcbiAqIFdoYXQgaXMgdGhlIGVsZW1lbnQgYXQgdGhlIGdpdmVuIGluZGV4P1xuICpcbiAqIEBwYXJhbSBOdW1iZXIgYUlkeFxuICovXG5BcnJheVNldC5wcm90b3R5cGUuYXQgPSBmdW5jdGlvbiBBcnJheVNldF9hdChhSWR4KSB7XG4gIGlmIChhSWR4ID49IDAgJiYgYUlkeCA8IHRoaXMuX2FycmF5Lmxlbmd0aCkge1xuICAgIHJldHVybiB0aGlzLl9hcnJheVthSWR4XTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVsZW1lbnQgaW5kZXhlZCBieSAnICsgYUlkeCk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgc2V0ICh3aGljaCBoYXMgdGhlIHByb3BlciBpbmRpY2VzXG4gKiBpbmRpY2F0ZWQgYnkgaW5kZXhPZikuIE5vdGUgdGhhdCB0aGlzIGlzIGEgY29weSBvZiB0aGUgaW50ZXJuYWwgYXJyYXkgdXNlZFxuICogZm9yIHN0b3JpbmcgdGhlIG1lbWJlcnMgc28gdGhhdCBubyBvbmUgY2FuIG1lc3Mgd2l0aCBpbnRlcm5hbCBzdGF0ZS5cbiAqL1xuQXJyYXlTZXQucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiBBcnJheVNldF90b0FycmF5KCkge1xuICByZXR1cm4gdGhpcy5fYXJyYXkuc2xpY2UoKTtcbn07XG5cbmV4cG9ydHMuQXJyYXlTZXQgPSBBcnJheVNldDtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKlxuICogQmFzZWQgb24gdGhlIEJhc2UgNjQgVkxRIGltcGxlbWVudGF0aW9uIGluIENsb3N1cmUgQ29tcGlsZXI6XG4gKiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nsb3N1cmUtY29tcGlsZXIvc291cmNlL2Jyb3dzZS90cnVuay9zcmMvY29tL2dvb2dsZS9kZWJ1Z2dpbmcvc291cmNlbWFwL0Jhc2U2NFZMUS5qYXZhXG4gKlxuICogQ29weXJpZ2h0IDIwMTEgVGhlIENsb3N1cmUgQ29tcGlsZXIgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZVxuICogbWV0OlxuICpcbiAqICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gKiAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlXG4gKiAgICBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZ1xuICogICAgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkXG4gKiAgICB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKiAgKiBOZWl0aGVyIHRoZSBuYW1lIG9mIEdvb2dsZSBJbmMuIG5vciB0aGUgbmFtZXMgb2YgaXRzXG4gKiAgICBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWRcbiAqICAgIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAqIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUXG4gKiBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCxcbiAqIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLFxuICogREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZXG4gKiBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0VcbiAqIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJy4vYmFzZTY0Jyk7XG5cbi8vIEEgc2luZ2xlIGJhc2UgNjQgZGlnaXQgY2FuIGNvbnRhaW4gNiBiaXRzIG9mIGRhdGEuIEZvciB0aGUgYmFzZSA2NCB2YXJpYWJsZVxuLy8gbGVuZ3RoIHF1YW50aXRpZXMgd2UgdXNlIGluIHRoZSBzb3VyY2UgbWFwIHNwZWMsIHRoZSBmaXJzdCBiaXQgaXMgdGhlIHNpZ24sXG4vLyB0aGUgbmV4dCBmb3VyIGJpdHMgYXJlIHRoZSBhY3R1YWwgdmFsdWUsIGFuZCB0aGUgNnRoIGJpdCBpcyB0aGVcbi8vIGNvbnRpbnVhdGlvbiBiaXQuIFRoZSBjb250aW51YXRpb24gYml0IHRlbGxzIHVzIHdoZXRoZXIgdGhlcmUgYXJlIG1vcmVcbi8vIGRpZ2l0cyBpbiB0aGlzIHZhbHVlIGZvbGxvd2luZyB0aGlzIGRpZ2l0LlxuLy9cbi8vICAgQ29udGludWF0aW9uXG4vLyAgIHwgICAgU2lnblxuLy8gICB8ICAgIHxcbi8vICAgViAgICBWXG4vLyAgIDEwMTAxMVxuXG52YXIgVkxRX0JBU0VfU0hJRlQgPSA1O1xuXG4vLyBiaW5hcnk6IDEwMDAwMFxudmFyIFZMUV9CQVNFID0gMSA8PCBWTFFfQkFTRV9TSElGVDtcblxuLy8gYmluYXJ5OiAwMTExMTFcbnZhciBWTFFfQkFTRV9NQVNLID0gVkxRX0JBU0UgLSAxO1xuXG4vLyBiaW5hcnk6IDEwMDAwMFxudmFyIFZMUV9DT05USU5VQVRJT05fQklUID0gVkxRX0JBU0U7XG5cbi8qKlxuICogQ29udmVydHMgZnJvbSBhIHR3by1jb21wbGVtZW50IHZhbHVlIHRvIGEgdmFsdWUgd2hlcmUgdGhlIHNpZ24gYml0IGlzXG4gKiBwbGFjZWQgaW4gdGhlIGxlYXN0IHNpZ25pZmljYW50IGJpdC4gIEZvciBleGFtcGxlLCBhcyBkZWNpbWFsczpcbiAqICAgMSBiZWNvbWVzIDIgKDEwIGJpbmFyeSksIC0xIGJlY29tZXMgMyAoMTEgYmluYXJ5KVxuICogICAyIGJlY29tZXMgNCAoMTAwIGJpbmFyeSksIC0yIGJlY29tZXMgNSAoMTAxIGJpbmFyeSlcbiAqL1xuZnVuY3Rpb24gdG9WTFFTaWduZWQoYVZhbHVlKSB7XG4gIHJldHVybiBhVmFsdWUgPCAwXG4gICAgPyAoKC1hVmFsdWUpIDw8IDEpICsgMVxuICAgIDogKGFWYWx1ZSA8PCAxKSArIDA7XG59XG5cbi8qKlxuICogQ29udmVydHMgdG8gYSB0d28tY29tcGxlbWVudCB2YWx1ZSBmcm9tIGEgdmFsdWUgd2hlcmUgdGhlIHNpZ24gYml0IGlzXG4gKiBwbGFjZWQgaW4gdGhlIGxlYXN0IHNpZ25pZmljYW50IGJpdC4gIEZvciBleGFtcGxlLCBhcyBkZWNpbWFsczpcbiAqICAgMiAoMTAgYmluYXJ5KSBiZWNvbWVzIDEsIDMgKDExIGJpbmFyeSkgYmVjb21lcyAtMVxuICogICA0ICgxMDAgYmluYXJ5KSBiZWNvbWVzIDIsIDUgKDEwMSBiaW5hcnkpIGJlY29tZXMgLTJcbiAqL1xuZnVuY3Rpb24gZnJvbVZMUVNpZ25lZChhVmFsdWUpIHtcbiAgdmFyIGlzTmVnYXRpdmUgPSAoYVZhbHVlICYgMSkgPT09IDE7XG4gIHZhciBzaGlmdGVkID0gYVZhbHVlID4+IDE7XG4gIHJldHVybiBpc05lZ2F0aXZlXG4gICAgPyAtc2hpZnRlZFxuICAgIDogc2hpZnRlZDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBiYXNlIDY0IFZMUSBlbmNvZGVkIHZhbHVlLlxuICovXG5leHBvcnRzLmVuY29kZSA9IGZ1bmN0aW9uIGJhc2U2NFZMUV9lbmNvZGUoYVZhbHVlKSB7XG4gIHZhciBlbmNvZGVkID0gXCJcIjtcbiAgdmFyIGRpZ2l0O1xuXG4gIHZhciB2bHEgPSB0b1ZMUVNpZ25lZChhVmFsdWUpO1xuXG4gIGRvIHtcbiAgICBkaWdpdCA9IHZscSAmIFZMUV9CQVNFX01BU0s7XG4gICAgdmxxID4+Pj0gVkxRX0JBU0VfU0hJRlQ7XG4gICAgaWYgKHZscSA+IDApIHtcbiAgICAgIC8vIFRoZXJlIGFyZSBzdGlsbCBtb3JlIGRpZ2l0cyBpbiB0aGlzIHZhbHVlLCBzbyB3ZSBtdXN0IG1ha2Ugc3VyZSB0aGVcbiAgICAgIC8vIGNvbnRpbnVhdGlvbiBiaXQgaXMgbWFya2VkLlxuICAgICAgZGlnaXQgfD0gVkxRX0NPTlRJTlVBVElPTl9CSVQ7XG4gICAgfVxuICAgIGVuY29kZWQgKz0gYmFzZTY0LmVuY29kZShkaWdpdCk7XG4gIH0gd2hpbGUgKHZscSA+IDApO1xuXG4gIHJldHVybiBlbmNvZGVkO1xufTtcblxuLyoqXG4gKiBEZWNvZGVzIHRoZSBuZXh0IGJhc2UgNjQgVkxRIHZhbHVlIGZyb20gdGhlIGdpdmVuIHN0cmluZyBhbmQgcmV0dXJucyB0aGVcbiAqIHZhbHVlIGFuZCB0aGUgcmVzdCBvZiB0aGUgc3RyaW5nIHZpYSB0aGUgb3V0IHBhcmFtZXRlci5cbiAqL1xuZXhwb3J0cy5kZWNvZGUgPSBmdW5jdGlvbiBiYXNlNjRWTFFfZGVjb2RlKGFTdHIsIGFJbmRleCwgYU91dFBhcmFtKSB7XG4gIHZhciBzdHJMZW4gPSBhU3RyLmxlbmd0aDtcbiAgdmFyIHJlc3VsdCA9IDA7XG4gIHZhciBzaGlmdCA9IDA7XG4gIHZhciBjb250aW51YXRpb24sIGRpZ2l0O1xuXG4gIGRvIHtcbiAgICBpZiAoYUluZGV4ID49IHN0ckxlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgbW9yZSBkaWdpdHMgaW4gYmFzZSA2NCBWTFEgdmFsdWUuXCIpO1xuICAgIH1cblxuICAgIGRpZ2l0ID0gYmFzZTY0LmRlY29kZShhU3RyLmNoYXJDb2RlQXQoYUluZGV4KyspKTtcbiAgICBpZiAoZGlnaXQgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGJhc2U2NCBkaWdpdDogXCIgKyBhU3RyLmNoYXJBdChhSW5kZXggLSAxKSk7XG4gICAgfVxuXG4gICAgY29udGludWF0aW9uID0gISEoZGlnaXQgJiBWTFFfQ09OVElOVUFUSU9OX0JJVCk7XG4gICAgZGlnaXQgJj0gVkxRX0JBU0VfTUFTSztcbiAgICByZXN1bHQgPSByZXN1bHQgKyAoZGlnaXQgPDwgc2hpZnQpO1xuICAgIHNoaWZ0ICs9IFZMUV9CQVNFX1NISUZUO1xuICB9IHdoaWxlIChjb250aW51YXRpb24pO1xuXG4gIGFPdXRQYXJhbS52YWx1ZSA9IGZyb21WTFFTaWduZWQocmVzdWx0KTtcbiAgYU91dFBhcmFtLnJlc3QgPSBhSW5kZXg7XG59O1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgaW50VG9DaGFyTWFwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLnNwbGl0KCcnKTtcblxuLyoqXG4gKiBFbmNvZGUgYW4gaW50ZWdlciBpbiB0aGUgcmFuZ2Ugb2YgMCB0byA2MyB0byBhIHNpbmdsZSBiYXNlIDY0IGRpZ2l0LlxuICovXG5leHBvcnRzLmVuY29kZSA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgaWYgKDAgPD0gbnVtYmVyICYmIG51bWJlciA8IGludFRvQ2hhck1hcC5sZW5ndGgpIHtcbiAgICByZXR1cm4gaW50VG9DaGFyTWFwW251bWJlcl07XG4gIH1cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk11c3QgYmUgYmV0d2VlbiAwIGFuZCA2MzogXCIgKyBudW1iZXIpO1xufTtcblxuLyoqXG4gKiBEZWNvZGUgYSBzaW5nbGUgYmFzZSA2NCBjaGFyYWN0ZXIgY29kZSBkaWdpdCB0byBhbiBpbnRlZ2VyLiBSZXR1cm5zIC0xIG9uXG4gKiBmYWlsdXJlLlxuICovXG5leHBvcnRzLmRlY29kZSA9IGZ1bmN0aW9uIChjaGFyQ29kZSkge1xuICB2YXIgYmlnQSA9IDY1OyAgICAgLy8gJ0EnXG4gIHZhciBiaWdaID0gOTA7ICAgICAvLyAnWidcblxuICB2YXIgbGl0dGxlQSA9IDk3OyAgLy8gJ2EnXG4gIHZhciBsaXR0bGVaID0gMTIyOyAvLyAneidcblxuICB2YXIgemVybyA9IDQ4OyAgICAgLy8gJzAnXG4gIHZhciBuaW5lID0gNTc7ICAgICAvLyAnOSdcblxuICB2YXIgcGx1cyA9IDQzOyAgICAgLy8gJysnXG4gIHZhciBzbGFzaCA9IDQ3OyAgICAvLyAnLydcblxuICB2YXIgbGl0dGxlT2Zmc2V0ID0gMjY7XG4gIHZhciBudW1iZXJPZmZzZXQgPSA1MjtcblxuICAvLyAwIC0gMjU6IEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXG4gIGlmIChiaWdBIDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDw9IGJpZ1opIHtcbiAgICByZXR1cm4gKGNoYXJDb2RlIC0gYmlnQSk7XG4gIH1cblxuICAvLyAyNiAtIDUxOiBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elxuICBpZiAobGl0dGxlQSA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8PSBsaXR0bGVaKSB7XG4gICAgcmV0dXJuIChjaGFyQ29kZSAtIGxpdHRsZUEgKyBsaXR0bGVPZmZzZXQpO1xuICB9XG5cbiAgLy8gNTIgLSA2MTogMDEyMzQ1Njc4OVxuICBpZiAoemVybyA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8PSBuaW5lKSB7XG4gICAgcmV0dXJuIChjaGFyQ29kZSAtIHplcm8gKyBudW1iZXJPZmZzZXQpO1xuICB9XG5cbiAgLy8gNjI6ICtcbiAgaWYgKGNoYXJDb2RlID09IHBsdXMpIHtcbiAgICByZXR1cm4gNjI7XG4gIH1cblxuICAvLyA2MzogL1xuICBpZiAoY2hhckNvZGUgPT0gc2xhc2gpIHtcbiAgICByZXR1cm4gNjM7XG4gIH1cblxuICAvLyBJbnZhbGlkIGJhc2U2NCBkaWdpdC5cbiAgcmV0dXJuIC0xO1xufTtcbiIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxuZXhwb3J0cy5HUkVBVEVTVF9MT1dFUl9CT1VORCA9IDE7XG5leHBvcnRzLkxFQVNUX1VQUEVSX0JPVU5EID0gMjtcblxuLyoqXG4gKiBSZWN1cnNpdmUgaW1wbGVtZW50YXRpb24gb2YgYmluYXJ5IHNlYXJjaC5cbiAqXG4gKiBAcGFyYW0gYUxvdyBJbmRpY2VzIGhlcmUgYW5kIGxvd2VyIGRvIG5vdCBjb250YWluIHRoZSBuZWVkbGUuXG4gKiBAcGFyYW0gYUhpZ2ggSW5kaWNlcyBoZXJlIGFuZCBoaWdoZXIgZG8gbm90IGNvbnRhaW4gdGhlIG5lZWRsZS5cbiAqIEBwYXJhbSBhTmVlZGxlIFRoZSBlbGVtZW50IGJlaW5nIHNlYXJjaGVkIGZvci5cbiAqIEBwYXJhbSBhSGF5c3RhY2sgVGhlIG5vbi1lbXB0eSBhcnJheSBiZWluZyBzZWFyY2hlZC5cbiAqIEBwYXJhbSBhQ29tcGFyZSBGdW5jdGlvbiB3aGljaCB0YWtlcyB0d28gZWxlbWVudHMgYW5kIHJldHVybnMgLTEsIDAsIG9yIDEuXG4gKiBAcGFyYW0gYUJpYXMgRWl0aGVyICdiaW5hcnlTZWFyY2guR1JFQVRFU1RfTE9XRVJfQk9VTkQnIG9yXG4gKiAgICAgJ2JpbmFyeVNlYXJjaC5MRUFTVF9VUFBFUl9CT1VORCcuIFNwZWNpZmllcyB3aGV0aGVyIHRvIHJldHVybiB0aGVcbiAqICAgICBjbG9zZXN0IGVsZW1lbnQgdGhhdCBpcyBzbWFsbGVyIHRoYW4gb3IgZ3JlYXRlciB0aGFuIHRoZSBvbmUgd2UgYXJlXG4gKiAgICAgc2VhcmNoaW5nIGZvciwgcmVzcGVjdGl2ZWx5LCBpZiB0aGUgZXhhY3QgZWxlbWVudCBjYW5ub3QgYmUgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIHJlY3Vyc2l2ZVNlYXJjaChhTG93LCBhSGlnaCwgYU5lZWRsZSwgYUhheXN0YWNrLCBhQ29tcGFyZSwgYUJpYXMpIHtcbiAgLy8gVGhpcyBmdW5jdGlvbiB0ZXJtaW5hdGVzIHdoZW4gb25lIG9mIHRoZSBmb2xsb3dpbmcgaXMgdHJ1ZTpcbiAgLy9cbiAgLy8gICAxLiBXZSBmaW5kIHRoZSBleGFjdCBlbGVtZW50IHdlIGFyZSBsb29raW5nIGZvci5cbiAgLy9cbiAgLy8gICAyLiBXZSBkaWQgbm90IGZpbmQgdGhlIGV4YWN0IGVsZW1lbnQsIGJ1dCB3ZSBjYW4gcmV0dXJuIHRoZSBpbmRleCBvZlxuICAvLyAgICAgIHRoZSBuZXh0LWNsb3Nlc3QgZWxlbWVudC5cbiAgLy9cbiAgLy8gICAzLiBXZSBkaWQgbm90IGZpbmQgdGhlIGV4YWN0IGVsZW1lbnQsIGFuZCB0aGVyZSBpcyBubyBuZXh0LWNsb3Nlc3RcbiAgLy8gICAgICBlbGVtZW50IHRoYW4gdGhlIG9uZSB3ZSBhcmUgc2VhcmNoaW5nIGZvciwgc28gd2UgcmV0dXJuIC0xLlxuICB2YXIgbWlkID0gTWF0aC5mbG9vcigoYUhpZ2ggLSBhTG93KSAvIDIpICsgYUxvdztcbiAgdmFyIGNtcCA9IGFDb21wYXJlKGFOZWVkbGUsIGFIYXlzdGFja1ttaWRdLCB0cnVlKTtcbiAgaWYgKGNtcCA9PT0gMCkge1xuICAgIC8vIEZvdW5kIHRoZSBlbGVtZW50IHdlIGFyZSBsb29raW5nIGZvci5cbiAgICByZXR1cm4gbWlkO1xuICB9XG4gIGVsc2UgaWYgKGNtcCA+IDApIHtcbiAgICAvLyBPdXIgbmVlZGxlIGlzIGdyZWF0ZXIgdGhhbiBhSGF5c3RhY2tbbWlkXS5cbiAgICBpZiAoYUhpZ2ggLSBtaWQgPiAxKSB7XG4gICAgICAvLyBUaGUgZWxlbWVudCBpcyBpbiB0aGUgdXBwZXIgaGFsZi5cbiAgICAgIHJldHVybiByZWN1cnNpdmVTZWFyY2gobWlkLCBhSGlnaCwgYU5lZWRsZSwgYUhheXN0YWNrLCBhQ29tcGFyZSwgYUJpYXMpO1xuICAgIH1cblxuICAgIC8vIFRoZSBleGFjdCBuZWVkbGUgZWxlbWVudCB3YXMgbm90IGZvdW5kIGluIHRoaXMgaGF5c3RhY2suIERldGVybWluZSBpZlxuICAgIC8vIHdlIGFyZSBpbiB0ZXJtaW5hdGlvbiBjYXNlICgzKSBvciAoMikgYW5kIHJldHVybiB0aGUgYXBwcm9wcmlhdGUgdGhpbmcuXG4gICAgaWYgKGFCaWFzID09IGV4cG9ydHMuTEVBU1RfVVBQRVJfQk9VTkQpIHtcbiAgICAgIHJldHVybiBhSGlnaCA8IGFIYXlzdGFjay5sZW5ndGggPyBhSGlnaCA6IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbWlkO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICAvLyBPdXIgbmVlZGxlIGlzIGxlc3MgdGhhbiBhSGF5c3RhY2tbbWlkXS5cbiAgICBpZiAobWlkIC0gYUxvdyA+IDEpIHtcbiAgICAgIC8vIFRoZSBlbGVtZW50IGlzIGluIHRoZSBsb3dlciBoYWxmLlxuICAgICAgcmV0dXJuIHJlY3Vyc2l2ZVNlYXJjaChhTG93LCBtaWQsIGFOZWVkbGUsIGFIYXlzdGFjaywgYUNvbXBhcmUsIGFCaWFzKTtcbiAgICB9XG5cbiAgICAvLyB3ZSBhcmUgaW4gdGVybWluYXRpb24gY2FzZSAoMykgb3IgKDIpIGFuZCByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIHRoaW5nLlxuICAgIGlmIChhQmlhcyA9PSBleHBvcnRzLkxFQVNUX1VQUEVSX0JPVU5EKSB7XG4gICAgICByZXR1cm4gbWlkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYUxvdyA8IDAgPyAtMSA6IGFMb3c7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVGhpcyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiBiaW5hcnkgc2VhcmNoIHdoaWNoIHdpbGwgYWx3YXlzIHRyeSBhbmQgcmV0dXJuXG4gKiB0aGUgaW5kZXggb2YgdGhlIGNsb3Nlc3QgZWxlbWVudCBpZiB0aGVyZSBpcyBubyBleGFjdCBoaXQuIFRoaXMgaXMgYmVjYXVzZVxuICogbWFwcGluZ3MgYmV0d2VlbiBvcmlnaW5hbCBhbmQgZ2VuZXJhdGVkIGxpbmUvY29sIHBhaXJzIGFyZSBzaW5nbGUgcG9pbnRzLFxuICogYW5kIHRoZXJlIGlzIGFuIGltcGxpY2l0IHJlZ2lvbiBiZXR3ZWVuIGVhY2ggb2YgdGhlbSwgc28gYSBtaXNzIGp1c3QgbWVhbnNcbiAqIHRoYXQgeW91IGFyZW4ndCBvbiB0aGUgdmVyeSBzdGFydCBvZiBhIHJlZ2lvbi5cbiAqXG4gKiBAcGFyYW0gYU5lZWRsZSBUaGUgZWxlbWVudCB5b3UgYXJlIGxvb2tpbmcgZm9yLlxuICogQHBhcmFtIGFIYXlzdGFjayBUaGUgYXJyYXkgdGhhdCBpcyBiZWluZyBzZWFyY2hlZC5cbiAqIEBwYXJhbSBhQ29tcGFyZSBBIGZ1bmN0aW9uIHdoaWNoIHRha2VzIHRoZSBuZWVkbGUgYW5kIGFuIGVsZW1lbnQgaW4gdGhlXG4gKiAgICAgYXJyYXkgYW5kIHJldHVybnMgLTEsIDAsIG9yIDEgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIG5lZWRsZSBpcyBsZXNzXG4gKiAgICAgdGhhbiwgZXF1YWwgdG8sIG9yIGdyZWF0ZXIgdGhhbiB0aGUgZWxlbWVudCwgcmVzcGVjdGl2ZWx5LlxuICogQHBhcmFtIGFCaWFzIEVpdGhlciAnYmluYXJ5U2VhcmNoLkdSRUFURVNUX0xPV0VSX0JPVU5EJyBvclxuICogICAgICdiaW5hcnlTZWFyY2guTEVBU1RfVVBQRVJfQk9VTkQnLiBTcGVjaWZpZXMgd2hldGhlciB0byByZXR1cm4gdGhlXG4gKiAgICAgY2xvc2VzdCBlbGVtZW50IHRoYXQgaXMgc21hbGxlciB0aGFuIG9yIGdyZWF0ZXIgdGhhbiB0aGUgb25lIHdlIGFyZVxuICogICAgIHNlYXJjaGluZyBmb3IsIHJlc3BlY3RpdmVseSwgaWYgdGhlIGV4YWN0IGVsZW1lbnQgY2Fubm90IGJlIGZvdW5kLlxuICogICAgIERlZmF1bHRzIHRvICdiaW5hcnlTZWFyY2guR1JFQVRFU1RfTE9XRVJfQk9VTkQnLlxuICovXG5leHBvcnRzLnNlYXJjaCA9IGZ1bmN0aW9uIHNlYXJjaChhTmVlZGxlLCBhSGF5c3RhY2ssIGFDb21wYXJlLCBhQmlhcykge1xuICBpZiAoYUhheXN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIHZhciBpbmRleCA9IHJlY3Vyc2l2ZVNlYXJjaCgtMSwgYUhheXN0YWNrLmxlbmd0aCwgYU5lZWRsZSwgYUhheXN0YWNrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYUNvbXBhcmUsIGFCaWFzIHx8IGV4cG9ydHMuR1JFQVRFU1RfTE9XRVJfQk9VTkQpO1xuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLy8gV2UgaGF2ZSBmb3VuZCBlaXRoZXIgdGhlIGV4YWN0IGVsZW1lbnQsIG9yIHRoZSBuZXh0LWNsb3Nlc3QgZWxlbWVudCB0aGFuXG4gIC8vIHRoZSBvbmUgd2UgYXJlIHNlYXJjaGluZyBmb3IuIEhvd2V2ZXIsIHRoZXJlIG1heSBiZSBtb3JlIHRoYW4gb25lIHN1Y2hcbiAgLy8gZWxlbWVudC4gTWFrZSBzdXJlIHdlIGFsd2F5cyByZXR1cm4gdGhlIHNtYWxsZXN0IG9mIHRoZXNlLlxuICB3aGlsZSAoaW5kZXggLSAxID49IDApIHtcbiAgICBpZiAoYUNvbXBhcmUoYUhheXN0YWNrW2luZGV4XSwgYUhheXN0YWNrW2luZGV4IC0gMV0sIHRydWUpICE9PSAwKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgLS1pbmRleDtcbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn07XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTQgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgbWFwcGluZ0IgaXMgYWZ0ZXIgbWFwcGluZ0Egd2l0aCByZXNwZWN0IHRvIGdlbmVyYXRlZFxuICogcG9zaXRpb24uXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlZFBvc2l0aW9uQWZ0ZXIobWFwcGluZ0EsIG1hcHBpbmdCKSB7XG4gIC8vIE9wdGltaXplZCBmb3IgbW9zdCBjb21tb24gY2FzZVxuICB2YXIgbGluZUEgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lO1xuICB2YXIgbGluZUIgPSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICB2YXIgY29sdW1uQSA9IG1hcHBpbmdBLmdlbmVyYXRlZENvbHVtbjtcbiAgdmFyIGNvbHVtbkIgPSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIHJldHVybiBsaW5lQiA+IGxpbmVBIHx8IGxpbmVCID09IGxpbmVBICYmIGNvbHVtbkIgPj0gY29sdW1uQSB8fFxuICAgICAgICAgdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IpIDw9IDA7XG59XG5cbi8qKlxuICogQSBkYXRhIHN0cnVjdHVyZSB0byBwcm92aWRlIGEgc29ydGVkIHZpZXcgb2YgYWNjdW11bGF0ZWQgbWFwcGluZ3MgaW4gYVxuICogcGVyZm9ybWFuY2UgY29uc2Npb3VzIG1hbm5lci4gSXQgdHJhZGVzIGEgbmVnbGliYWJsZSBvdmVyaGVhZCBpbiBnZW5lcmFsXG4gKiBjYXNlIGZvciBhIGxhcmdlIHNwZWVkdXAgaW4gY2FzZSBvZiBtYXBwaW5ncyBiZWluZyBhZGRlZCBpbiBvcmRlci5cbiAqL1xuZnVuY3Rpb24gTWFwcGluZ0xpc3QoKSB7XG4gIHRoaXMuX2FycmF5ID0gW107XG4gIHRoaXMuX3NvcnRlZCA9IHRydWU7XG4gIC8vIFNlcnZlcyBhcyBpbmZpbXVtXG4gIHRoaXMuX2xhc3QgPSB7Z2VuZXJhdGVkTGluZTogLTEsIGdlbmVyYXRlZENvbHVtbjogMH07XG59XG5cbi8qKlxuICogSXRlcmF0ZSB0aHJvdWdoIGludGVybmFsIGl0ZW1zLiBUaGlzIG1ldGhvZCB0YWtlcyB0aGUgc2FtZSBhcmd1bWVudHMgdGhhdFxuICogYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCB0YWtlcy5cbiAqXG4gKiBOT1RFOiBUaGUgb3JkZXIgb2YgdGhlIG1hcHBpbmdzIGlzIE5PVCBndWFyYW50ZWVkLlxuICovXG5NYXBwaW5nTGlzdC5wcm90b3R5cGUudW5zb3J0ZWRGb3JFYWNoID1cbiAgZnVuY3Rpb24gTWFwcGluZ0xpc3RfZm9yRWFjaChhQ2FsbGJhY2ssIGFUaGlzQXJnKSB7XG4gICAgdGhpcy5fYXJyYXkuZm9yRWFjaChhQ2FsbGJhY2ssIGFUaGlzQXJnKTtcbiAgfTtcblxuLyoqXG4gKiBBZGQgdGhlIGdpdmVuIHNvdXJjZSBtYXBwaW5nLlxuICpcbiAqIEBwYXJhbSBPYmplY3QgYU1hcHBpbmdcbiAqL1xuTWFwcGluZ0xpc3QucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIE1hcHBpbmdMaXN0X2FkZChhTWFwcGluZykge1xuICBpZiAoZ2VuZXJhdGVkUG9zaXRpb25BZnRlcih0aGlzLl9sYXN0LCBhTWFwcGluZykpIHtcbiAgICB0aGlzLl9sYXN0ID0gYU1hcHBpbmc7XG4gICAgdGhpcy5fYXJyYXkucHVzaChhTWFwcGluZyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fc29ydGVkID0gZmFsc2U7XG4gICAgdGhpcy5fYXJyYXkucHVzaChhTWFwcGluZyk7XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmxhdCwgc29ydGVkIGFycmF5IG9mIG1hcHBpbmdzLiBUaGUgbWFwcGluZ3MgYXJlIHNvcnRlZCBieVxuICogZ2VuZXJhdGVkIHBvc2l0aW9uLlxuICpcbiAqIFdBUk5JTkc6IFRoaXMgbWV0aG9kIHJldHVybnMgaW50ZXJuYWwgZGF0YSB3aXRob3V0IGNvcHlpbmcsIGZvclxuICogcGVyZm9ybWFuY2UuIFRoZSByZXR1cm4gdmFsdWUgbXVzdCBOT1QgYmUgbXV0YXRlZCwgYW5kIHNob3VsZCBiZSB0cmVhdGVkIGFzXG4gKiBhbiBpbW11dGFibGUgYm9ycm93LiBJZiB5b3Ugd2FudCB0byB0YWtlIG93bmVyc2hpcCwgeW91IG11c3QgbWFrZSB5b3VyIG93blxuICogY29weS5cbiAqL1xuTWFwcGluZ0xpc3QucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiBNYXBwaW5nTGlzdF90b0FycmF5KCkge1xuICBpZiAoIXRoaXMuX3NvcnRlZCkge1xuICAgIHRoaXMuX2FycmF5LnNvcnQodXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZCk7XG4gICAgdGhpcy5fc29ydGVkID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdGhpcy5fYXJyYXk7XG59O1xuXG5leHBvcnRzLk1hcHBpbmdMaXN0ID0gTWFwcGluZ0xpc3Q7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbi8vIEl0IHR1cm5zIG91dCB0aGF0IHNvbWUgKG1vc3Q/KSBKYXZhU2NyaXB0IGVuZ2luZXMgZG9uJ3Qgc2VsZi1ob3N0XG4vLyBgQXJyYXkucHJvdG90eXBlLnNvcnRgLiBUaGlzIG1ha2VzIHNlbnNlIGJlY2F1c2UgQysrIHdpbGwgbGlrZWx5IHJlbWFpblxuLy8gZmFzdGVyIHRoYW4gSlMgd2hlbiBkb2luZyByYXcgQ1BVLWludGVuc2l2ZSBzb3J0aW5nLiBIb3dldmVyLCB3aGVuIHVzaW5nIGFcbi8vIGN1c3RvbSBjb21wYXJhdG9yIGZ1bmN0aW9uLCBjYWxsaW5nIGJhY2sgYW5kIGZvcnRoIGJldHdlZW4gdGhlIFZNJ3MgQysrIGFuZFxuLy8gSklUJ2QgSlMgaXMgcmF0aGVyIHNsb3cgKmFuZCogbG9zZXMgSklUIHR5cGUgaW5mb3JtYXRpb24sIHJlc3VsdGluZyBpblxuLy8gd29yc2UgZ2VuZXJhdGVkIGNvZGUgZm9yIHRoZSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRoYW4gd291bGQgYmUgb3B0aW1hbC4gSW5cbi8vIGZhY3QsIHdoZW4gc29ydGluZyB3aXRoIGEgY29tcGFyYXRvciwgdGhlc2UgY29zdHMgb3V0d2VpZ2ggdGhlIGJlbmVmaXRzIG9mXG4vLyBzb3J0aW5nIGluIEMrKy4gQnkgdXNpbmcgb3VyIG93biBKUy1pbXBsZW1lbnRlZCBRdWljayBTb3J0IChiZWxvdyksIHdlIGdldFxuLy8gYSB+MzUwMG1zIG1lYW4gc3BlZWQtdXAgaW4gYGJlbmNoL2JlbmNoLmh0bWxgLlxuXG4vKipcbiAqIFN3YXAgdGhlIGVsZW1lbnRzIGluZGV4ZWQgYnkgYHhgIGFuZCBgeWAgaW4gdGhlIGFycmF5IGBhcnlgLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyeVxuICogICAgICAgIFRoZSBhcnJheS5cbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiAgICAgICAgVGhlIGluZGV4IG9mIHRoZSBmaXJzdCBpdGVtLlxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqICAgICAgICBUaGUgaW5kZXggb2YgdGhlIHNlY29uZCBpdGVtLlxuICovXG5mdW5jdGlvbiBzd2FwKGFyeSwgeCwgeSkge1xuICB2YXIgdGVtcCA9IGFyeVt4XTtcbiAgYXJ5W3hdID0gYXJ5W3ldO1xuICBhcnlbeV0gPSB0ZW1wO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSByYW5kb20gaW50ZWdlciB3aXRoaW4gdGhlIHJhbmdlIGBsb3cgLi4gaGlnaGAgaW5jbHVzaXZlLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBsb3dcbiAqICAgICAgICBUaGUgbG93ZXIgYm91bmQgb24gdGhlIHJhbmdlLlxuICogQHBhcmFtIHtOdW1iZXJ9IGhpZ2hcbiAqICAgICAgICBUaGUgdXBwZXIgYm91bmQgb24gdGhlIHJhbmdlLlxuICovXG5mdW5jdGlvbiByYW5kb21JbnRJblJhbmdlKGxvdywgaGlnaCkge1xuICByZXR1cm4gTWF0aC5yb3VuZChsb3cgKyAoTWF0aC5yYW5kb20oKSAqIChoaWdoIC0gbG93KSkpO1xufVxuXG4vKipcbiAqIFRoZSBRdWljayBTb3J0IGFsZ29yaXRobS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnlcbiAqICAgICAgICBBbiBhcnJheSB0byBzb3J0LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyYXRvclxuICogICAgICAgIEZ1bmN0aW9uIHRvIHVzZSB0byBjb21wYXJlIHR3byBpdGVtcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBwXG4gKiAgICAgICAgU3RhcnQgaW5kZXggb2YgdGhlIGFycmF5XG4gKiBAcGFyYW0ge051bWJlcn0gclxuICogICAgICAgIEVuZCBpbmRleCBvZiB0aGUgYXJyYXlcbiAqL1xuZnVuY3Rpb24gZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCBwLCByKSB7XG4gIC8vIElmIG91ciBsb3dlciBib3VuZCBpcyBsZXNzIHRoYW4gb3VyIHVwcGVyIGJvdW5kLCB3ZSAoMSkgcGFydGl0aW9uIHRoZVxuICAvLyBhcnJheSBpbnRvIHR3byBwaWVjZXMgYW5kICgyKSByZWN1cnNlIG9uIGVhY2ggaGFsZi4gSWYgaXQgaXMgbm90LCB0aGlzIGlzXG4gIC8vIHRoZSBlbXB0eSBhcnJheSBhbmQgb3VyIGJhc2UgY2FzZS5cblxuICBpZiAocCA8IHIpIHtcbiAgICAvLyAoMSkgUGFydGl0aW9uaW5nLlxuICAgIC8vXG4gICAgLy8gVGhlIHBhcnRpdGlvbmluZyBjaG9vc2VzIGEgcGl2b3QgYmV0d2VlbiBgcGAgYW5kIGByYCBhbmQgbW92ZXMgYWxsXG4gICAgLy8gZWxlbWVudHMgdGhhdCBhcmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwaXZvdCB0byB0aGUgYmVmb3JlIGl0LCBhbmRcbiAgICAvLyBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgYXJlIGdyZWF0ZXIgdGhhbiBpdCBhZnRlciBpdC4gVGhlIGVmZmVjdCBpcyB0aGF0XG4gICAgLy8gb25jZSBwYXJ0aXRpb24gaXMgZG9uZSwgdGhlIHBpdm90IGlzIGluIHRoZSBleGFjdCBwbGFjZSBpdCB3aWxsIGJlIHdoZW5cbiAgICAvLyB0aGUgYXJyYXkgaXMgcHV0IGluIHNvcnRlZCBvcmRlciwgYW5kIGl0IHdpbGwgbm90IG5lZWQgdG8gYmUgbW92ZWRcbiAgICAvLyBhZ2Fpbi4gVGhpcyBydW5zIGluIE8obikgdGltZS5cblxuICAgIC8vIEFsd2F5cyBjaG9vc2UgYSByYW5kb20gcGl2b3Qgc28gdGhhdCBhbiBpbnB1dCBhcnJheSB3aGljaCBpcyByZXZlcnNlXG4gICAgLy8gc29ydGVkIGRvZXMgbm90IGNhdXNlIE8obl4yKSBydW5uaW5nIHRpbWUuXG4gICAgdmFyIHBpdm90SW5kZXggPSByYW5kb21JbnRJblJhbmdlKHAsIHIpO1xuICAgIHZhciBpID0gcCAtIDE7XG5cbiAgICBzd2FwKGFyeSwgcGl2b3RJbmRleCwgcik7XG4gICAgdmFyIHBpdm90ID0gYXJ5W3JdO1xuXG4gICAgLy8gSW1tZWRpYXRlbHkgYWZ0ZXIgYGpgIGlzIGluY3JlbWVudGVkIGluIHRoaXMgbG9vcCwgdGhlIGZvbGxvd2luZyBob2xkXG4gICAgLy8gdHJ1ZTpcbiAgICAvL1xuICAgIC8vICAgKiBFdmVyeSBlbGVtZW50IGluIGBhcnlbcCAuLiBpXWAgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwaXZvdC5cbiAgICAvL1xuICAgIC8vICAgKiBFdmVyeSBlbGVtZW50IGluIGBhcnlbaSsxIC4uIGotMV1gIGlzIGdyZWF0ZXIgdGhhbiB0aGUgcGl2b3QuXG4gICAgZm9yICh2YXIgaiA9IHA7IGogPCByOyBqKyspIHtcbiAgICAgIGlmIChjb21wYXJhdG9yKGFyeVtqXSwgcGl2b3QpIDw9IDApIHtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBzd2FwKGFyeSwgaSwgaik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3dhcChhcnksIGkgKyAxLCBqKTtcbiAgICB2YXIgcSA9IGkgKyAxO1xuXG4gICAgLy8gKDIpIFJlY3Vyc2Ugb24gZWFjaCBoYWxmLlxuXG4gICAgZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCBwLCBxIC0gMSk7XG4gICAgZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCBxICsgMSwgcik7XG4gIH1cbn1cblxuLyoqXG4gKiBTb3J0IHRoZSBnaXZlbiBhcnJheSBpbi1wbGFjZSB3aXRoIHRoZSBnaXZlbiBjb21wYXJhdG9yIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyeVxuICogICAgICAgIEFuIGFycmF5IHRvIHNvcnQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJhdG9yXG4gKiAgICAgICAgRnVuY3Rpb24gdG8gdXNlIHRvIGNvbXBhcmUgdHdvIGl0ZW1zLlxuICovXG5leHBvcnRzLnF1aWNrU29ydCA9IGZ1bmN0aW9uIChhcnksIGNvbXBhcmF0b3IpIHtcbiAgZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCAwLCBhcnkubGVuZ3RoIC0gMSk7XG59O1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGJpbmFyeVNlYXJjaCA9IHJlcXVpcmUoJy4vYmluYXJ5LXNlYXJjaCcpO1xudmFyIEFycmF5U2V0ID0gcmVxdWlyZSgnLi9hcnJheS1zZXQnKS5BcnJheVNldDtcbnZhciBiYXNlNjRWTFEgPSByZXF1aXJlKCcuL2Jhc2U2NC12bHEnKTtcbnZhciBxdWlja1NvcnQgPSByZXF1aXJlKCcuL3F1aWNrLXNvcnQnKS5xdWlja1NvcnQ7XG5cbmZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyKGFTb3VyY2VNYXApIHtcbiAgdmFyIHNvdXJjZU1hcCA9IGFTb3VyY2VNYXA7XG4gIGlmICh0eXBlb2YgYVNvdXJjZU1hcCA9PT0gJ3N0cmluZycpIHtcbiAgICBzb3VyY2VNYXAgPSBKU09OLnBhcnNlKGFTb3VyY2VNYXAucmVwbGFjZSgvXlxcKVxcXVxcfScvLCAnJykpO1xuICB9XG5cbiAgcmV0dXJuIHNvdXJjZU1hcC5zZWN0aW9ucyAhPSBudWxsXG4gICAgPyBuZXcgSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcClcbiAgICA6IG5ldyBCYXNpY1NvdXJjZU1hcENvbnN1bWVyKHNvdXJjZU1hcCk7XG59XG5cblNvdXJjZU1hcENvbnN1bWVyLmZyb21Tb3VyY2VNYXAgPSBmdW5jdGlvbihhU291cmNlTWFwKSB7XG4gIHJldHVybiBCYXNpY1NvdXJjZU1hcENvbnN1bWVyLmZyb21Tb3VyY2VNYXAoYVNvdXJjZU1hcCk7XG59XG5cbi8qKlxuICogVGhlIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXBwaW5nIHNwZWMgdGhhdCB3ZSBhcmUgY29uc3VtaW5nLlxuICovXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX3ZlcnNpb24gPSAzO1xuXG4vLyBgX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kIGBfX29yaWdpbmFsTWFwcGluZ3NgIGFyZSBhcnJheXMgdGhhdCBob2xkIHRoZVxuLy8gcGFyc2VkIG1hcHBpbmcgY29vcmRpbmF0ZXMgZnJvbSB0aGUgc291cmNlIG1hcCdzIFwibWFwcGluZ3NcIiBhdHRyaWJ1dGUuIFRoZXlcbi8vIGFyZSBsYXppbHkgaW5zdGFudGlhdGVkLCBhY2Nlc3NlZCB2aWEgdGhlIGBfZ2VuZXJhdGVkTWFwcGluZ3NgIGFuZFxuLy8gYF9vcmlnaW5hbE1hcHBpbmdzYCBnZXR0ZXJzIHJlc3BlY3RpdmVseSwgYW5kIHdlIG9ubHkgcGFyc2UgdGhlIG1hcHBpbmdzXG4vLyBhbmQgY3JlYXRlIHRoZXNlIGFycmF5cyBvbmNlIHF1ZXJpZWQgZm9yIGEgc291cmNlIGxvY2F0aW9uLiBXZSBqdW1wIHRocm91Z2hcbi8vIHRoZXNlIGhvb3BzIGJlY2F1c2UgdGhlcmUgY2FuIGJlIG1hbnkgdGhvdXNhbmRzIG9mIG1hcHBpbmdzLCBhbmQgcGFyc2luZ1xuLy8gdGhlbSBpcyBleHBlbnNpdmUsIHNvIHdlIG9ubHkgd2FudCB0byBkbyBpdCBpZiB3ZSBtdXN0LlxuLy9cbi8vIEVhY2ggb2JqZWN0IGluIHRoZSBhcnJheXMgaXMgb2YgdGhlIGZvcm06XG4vL1xuLy8gICAgIHtcbi8vICAgICAgIGdlbmVyYXRlZExpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIGNvZGUsXG4vLyAgICAgICBnZW5lcmF0ZWRDb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgY29kZSxcbi8vICAgICAgIHNvdXJjZTogVGhlIHBhdGggdG8gdGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlIHRoYXQgZ2VuZXJhdGVkIHRoaXNcbi8vICAgICAgICAgICAgICAgY2h1bmsgb2YgY29kZSxcbi8vICAgICAgIG9yaWdpbmFsTGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UgdGhhdFxuLy8gICAgICAgICAgICAgICAgICAgICBjb3JyZXNwb25kcyB0byB0aGlzIGNodW5rIG9mIGdlbmVyYXRlZCBjb2RlLFxuLy8gICAgICAgb3JpZ2luYWxDb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UgdGhhdFxuLy8gICAgICAgICAgICAgICAgICAgICAgIGNvcnJlc3BvbmRzIHRvIHRoaXMgY2h1bmsgb2YgZ2VuZXJhdGVkIGNvZGUsXG4vLyAgICAgICBuYW1lOiBUaGUgbmFtZSBvZiB0aGUgb3JpZ2luYWwgc3ltYm9sIHdoaWNoIGdlbmVyYXRlZCB0aGlzIGNodW5rIG9mXG4vLyAgICAgICAgICAgICBjb2RlLlxuLy8gICAgIH1cbi8vXG4vLyBBbGwgcHJvcGVydGllcyBleGNlcHQgZm9yIGBnZW5lcmF0ZWRMaW5lYCBhbmQgYGdlbmVyYXRlZENvbHVtbmAgY2FuIGJlXG4vLyBgbnVsbGAuXG4vL1xuLy8gYF9nZW5lcmF0ZWRNYXBwaW5nc2AgaXMgb3JkZXJlZCBieSB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9ucy5cbi8vXG4vLyBgX29yaWdpbmFsTWFwcGluZ3NgIGlzIG9yZGVyZWQgYnkgdGhlIG9yaWdpbmFsIHBvc2l0aW9ucy5cblxuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9fZ2VuZXJhdGVkTWFwcGluZ3MgPSBudWxsO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSwgJ19nZW5lcmF0ZWRNYXBwaW5ncycsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MpIHtcbiAgICAgIHRoaXMuX3BhcnNlTWFwcGluZ3ModGhpcy5fbWFwcGluZ3MsIHRoaXMuc291cmNlUm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncztcbiAgfVxufSk7XG5cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fX29yaWdpbmFsTWFwcGluZ3MgPSBudWxsO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSwgJ19vcmlnaW5hbE1hcHBpbmdzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX19vcmlnaW5hbE1hcHBpbmdzKSB7XG4gICAgICB0aGlzLl9wYXJzZU1hcHBpbmdzKHRoaXMuX21hcHBpbmdzLCB0aGlzLnNvdXJjZVJvb3QpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncztcbiAgfVxufSk7XG5cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fY2hhcklzTWFwcGluZ1NlcGFyYXRvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2NoYXJJc01hcHBpbmdTZXBhcmF0b3IoYVN0ciwgaW5kZXgpIHtcbiAgICB2YXIgYyA9IGFTdHIuY2hhckF0KGluZGV4KTtcbiAgICByZXR1cm4gYyA9PT0gXCI7XCIgfHwgYyA9PT0gXCIsXCI7XG4gIH07XG5cbi8qKlxuICogUGFyc2UgdGhlIG1hcHBpbmdzIGluIGEgc3RyaW5nIGluIHRvIGEgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggd2UgY2FuIGVhc2lseVxuICogcXVlcnkgKHRoZSBvcmRlcmVkIGFycmF5cyBpbiB0aGUgYHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4gKiBgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3NgIHByb3BlcnRpZXMpLlxuICovXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX3BhcnNlTWFwcGluZ3MgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9wYXJzZU1hcHBpbmdzKGFTdHIsIGFTb3VyY2VSb290KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU3ViY2xhc3NlcyBtdXN0IGltcGxlbWVudCBfcGFyc2VNYXBwaW5nc1wiKTtcbiAgfTtcblxuU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSID0gMTtcblNvdXJjZU1hcENvbnN1bWVyLk9SSUdJTkFMX09SREVSID0gMjtcblxuU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQgPSAxO1xuU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQgPSAyO1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBlYWNoIG1hcHBpbmcgYmV0d2VlbiBhbiBvcmlnaW5hbCBzb3VyY2UvbGluZS9jb2x1bW4gYW5kIGFcbiAqIGdlbmVyYXRlZCBsaW5lL2NvbHVtbiBpbiB0aGlzIHNvdXJjZSBtYXAuXG4gKlxuICogQHBhcmFtIEZ1bmN0aW9uIGFDYWxsYmFja1xuICogICAgICAgIFRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aXRoIGVhY2ggbWFwcGluZy5cbiAqIEBwYXJhbSBPYmplY3QgYUNvbnRleHRcbiAqICAgICAgICBPcHRpb25hbC4gSWYgc3BlY2lmaWVkLCB0aGlzIG9iamVjdCB3aWxsIGJlIHRoZSB2YWx1ZSBvZiBgdGhpc2AgZXZlcnlcbiAqICAgICAgICB0aW1lIHRoYXQgYGFDYWxsYmFja2AgaXMgY2FsbGVkLlxuICogQHBhcmFtIGFPcmRlclxuICogICAgICAgIEVpdGhlciBgU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSYCBvclxuICogICAgICAgIGBTb3VyY2VNYXBDb25zdW1lci5PUklHSU5BTF9PUkRFUmAuIFNwZWNpZmllcyB3aGV0aGVyIHlvdSB3YW50IHRvXG4gKiAgICAgICAgaXRlcmF0ZSBvdmVyIHRoZSBtYXBwaW5ncyBzb3J0ZWQgYnkgdGhlIGdlbmVyYXRlZCBmaWxlJ3MgbGluZS9jb2x1bW5cbiAqICAgICAgICBvcmRlciBvciB0aGUgb3JpZ2luYWwncyBzb3VyY2UvbGluZS9jb2x1bW4gb3JkZXIsIHJlc3BlY3RpdmVseS4gRGVmYXVsdHMgdG9cbiAqICAgICAgICBgU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSYC5cbiAqL1xuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmVhY2hNYXBwaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfZWFjaE1hcHBpbmcoYUNhbGxiYWNrLCBhQ29udGV4dCwgYU9yZGVyKSB7XG4gICAgdmFyIGNvbnRleHQgPSBhQ29udGV4dCB8fCBudWxsO1xuICAgIHZhciBvcmRlciA9IGFPcmRlciB8fCBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVI7XG5cbiAgICB2YXIgbWFwcGluZ3M7XG4gICAgc3dpdGNoIChvcmRlcikge1xuICAgIGNhc2UgU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSOlxuICAgICAgbWFwcGluZ3MgPSB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU291cmNlTWFwQ29uc3VtZXIuT1JJR0lOQUxfT1JERVI6XG4gICAgICBtYXBwaW5ncyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3M7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBvcmRlciBvZiBpdGVyYXRpb24uXCIpO1xuICAgIH1cblxuICAgIHZhciBzb3VyY2VSb290ID0gdGhpcy5zb3VyY2VSb290O1xuICAgIG1hcHBpbmdzLm1hcChmdW5jdGlvbiAobWFwcGluZykge1xuICAgICAgdmFyIHNvdXJjZSA9IG1hcHBpbmcuc291cmNlID09PSBudWxsID8gbnVsbCA6IHRoaXMuX3NvdXJjZXMuYXQobWFwcGluZy5zb3VyY2UpO1xuICAgICAgaWYgKHNvdXJjZSAhPSBudWxsICYmIHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICBzb3VyY2UgPSB1dGlsLmpvaW4oc291cmNlUm9vdCwgc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICBnZW5lcmF0ZWRMaW5lOiBtYXBwaW5nLmdlbmVyYXRlZExpbmUsXG4gICAgICAgIGdlbmVyYXRlZENvbHVtbjogbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4sXG4gICAgICAgIG9yaWdpbmFsTGluZTogbWFwcGluZy5vcmlnaW5hbExpbmUsXG4gICAgICAgIG9yaWdpbmFsQ29sdW1uOiBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uLFxuICAgICAgICBuYW1lOiBtYXBwaW5nLm5hbWUgPT09IG51bGwgPyBudWxsIDogdGhpcy5fbmFtZXMuYXQobWFwcGluZy5uYW1lKVxuICAgICAgfTtcbiAgICB9LCB0aGlzKS5mb3JFYWNoKGFDYWxsYmFjaywgY29udGV4dCk7XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyBhbGwgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIG9yaWdpbmFsIHNvdXJjZSxcbiAqIGxpbmUsIGFuZCBjb2x1bW4gcHJvdmlkZWQuIElmIG5vIGNvbHVtbiBpcyBwcm92aWRlZCwgcmV0dXJucyBhbGwgbWFwcGluZ3NcbiAqIGNvcnJlc3BvbmRpbmcgdG8gYSBlaXRoZXIgdGhlIGxpbmUgd2UgYXJlIHNlYXJjaGluZyBmb3Igb3IgdGhlIG5leHRcbiAqIGNsb3Nlc3QgbGluZSB0aGF0IGhhcyBhbnkgbWFwcGluZ3MuIE90aGVyd2lzZSwgcmV0dXJucyBhbGwgbWFwcGluZ3NcbiAqIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIGxpbmUgYW5kIGVpdGhlciB0aGUgY29sdW1uIHdlIGFyZSBzZWFyY2hpbmcgZm9yXG4gKiBvciB0aGUgbmV4dCBjbG9zZXN0IGNvbHVtbiB0aGF0IGhhcyBhbnkgb2Zmc2V0cy5cbiAqXG4gKiBUaGUgb25seSBhcmd1bWVudCBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIGZpbGVuYW1lIG9mIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gY29sdW1uOiBPcHRpb25hbC4gdGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqXG4gKiBhbmQgYW4gYXJyYXkgb2Ygb2JqZWN0cyBpcyByZXR1cm5lZCwgZWFjaCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuXG4gKi9cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5hbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3IgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9hbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3IoYUFyZ3MpIHtcbiAgICB2YXIgbGluZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbGluZScpO1xuXG4gICAgLy8gV2hlbiB0aGVyZSBpcyBubyBleGFjdCBtYXRjaCwgQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX2ZpbmRNYXBwaW5nXG4gICAgLy8gcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGNsb3Nlc3QgbWFwcGluZyBsZXNzIHRoYW4gdGhlIG5lZWRsZS4gQnlcbiAgICAvLyBzZXR0aW5nIG5lZWRsZS5vcmlnaW5hbENvbHVtbiB0byAwLCB3ZSB0aHVzIGZpbmQgdGhlIGxhc3QgbWFwcGluZyBmb3JcbiAgICAvLyB0aGUgZ2l2ZW4gbGluZSwgcHJvdmlkZWQgc3VjaCBhIG1hcHBpbmcgZXhpc3RzLlxuICAgIHZhciBuZWVkbGUgPSB7XG4gICAgICBzb3VyY2U6IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJyksXG4gICAgICBvcmlnaW5hbExpbmU6IGxpbmUsXG4gICAgICBvcmlnaW5hbENvbHVtbjogdXRpbC5nZXRBcmcoYUFyZ3MsICdjb2x1bW4nLCAwKVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIG5lZWRsZS5zb3VyY2UgPSB1dGlsLnJlbGF0aXZlKHRoaXMuc291cmNlUm9vdCwgbmVlZGxlLnNvdXJjZSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fc291cmNlcy5oYXMobmVlZGxlLnNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgbmVlZGxlLnNvdXJjZSA9IHRoaXMuX3NvdXJjZXMuaW5kZXhPZihuZWVkbGUuc291cmNlKTtcblxuICAgIHZhciBtYXBwaW5ncyA9IFtdO1xuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZE1hcHBpbmcobmVlZGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsTWFwcGluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvcmlnaW5hbExpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9yaWdpbmFsQ29sdW1uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbC5jb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5hcnlTZWFyY2guTEVBU1RfVVBQRVJfQk9VTkQpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICBpZiAoYUFyZ3MuY29sdW1uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsTGluZSA9IG1hcHBpbmcub3JpZ2luYWxMaW5lO1xuXG4gICAgICAgIC8vIEl0ZXJhdGUgdW50aWwgZWl0aGVyIHdlIHJ1biBvdXQgb2YgbWFwcGluZ3MsIG9yIHdlIHJ1biBpbnRvXG4gICAgICAgIC8vIGEgbWFwcGluZyBmb3IgYSBkaWZmZXJlbnQgbGluZSB0aGFuIHRoZSBvbmUgd2UgZm91bmQuIFNpbmNlXG4gICAgICAgIC8vIG1hcHBpbmdzIGFyZSBzb3J0ZWQsIHRoaXMgaXMgZ3VhcmFudGVlZCB0byBmaW5kIGFsbCBtYXBwaW5ncyBmb3JcbiAgICAgICAgLy8gdGhlIGxpbmUgd2UgZm91bmQuXG4gICAgICAgIHdoaWxlIChtYXBwaW5nICYmIG1hcHBpbmcub3JpZ2luYWxMaW5lID09PSBvcmlnaW5hbExpbmUpIHtcbiAgICAgICAgICBtYXBwaW5ncy5wdXNoKHtcbiAgICAgICAgICAgIGxpbmU6IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRMaW5lJywgbnVsbCksXG4gICAgICAgICAgICBjb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICAgIGxhc3RDb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdsYXN0R2VuZXJhdGVkQ29sdW1uJywgbnVsbClcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG1hcHBpbmcgPSB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzWysraW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgb3JpZ2luYWxDb2x1bW4gPSBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uO1xuXG4gICAgICAgIC8vIEl0ZXJhdGUgdW50aWwgZWl0aGVyIHdlIHJ1biBvdXQgb2YgbWFwcGluZ3MsIG9yIHdlIHJ1biBpbnRvXG4gICAgICAgIC8vIGEgbWFwcGluZyBmb3IgYSBkaWZmZXJlbnQgbGluZSB0aGFuIHRoZSBvbmUgd2Ugd2VyZSBzZWFyY2hpbmcgZm9yLlxuICAgICAgICAvLyBTaW5jZSBtYXBwaW5ncyBhcmUgc29ydGVkLCB0aGlzIGlzIGd1YXJhbnRlZWQgdG8gZmluZCBhbGwgbWFwcGluZ3MgZm9yXG4gICAgICAgIC8vIHRoZSBsaW5lIHdlIGFyZSBzZWFyY2hpbmcgZm9yLlxuICAgICAgICB3aGlsZSAobWFwcGluZyAmJlxuICAgICAgICAgICAgICAgbWFwcGluZy5vcmlnaW5hbExpbmUgPT09IGxpbmUgJiZcbiAgICAgICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxDb2x1bW4gPT0gb3JpZ2luYWxDb2x1bW4pIHtcbiAgICAgICAgICBtYXBwaW5ncy5wdXNoKHtcbiAgICAgICAgICAgIGxpbmU6IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRMaW5lJywgbnVsbCksXG4gICAgICAgICAgICBjb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICAgIGxhc3RDb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdsYXN0R2VuZXJhdGVkQ29sdW1uJywgbnVsbClcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG1hcHBpbmcgPSB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzWysraW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcHBpbmdzO1xuICB9O1xuXG5leHBvcnRzLlNvdXJjZU1hcENvbnN1bWVyID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogQSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyIGluc3RhbmNlIHJlcHJlc2VudHMgYSBwYXJzZWQgc291cmNlIG1hcCB3aGljaCB3ZSBjYW5cbiAqIHF1ZXJ5IGZvciBpbmZvcm1hdGlvbiBhYm91dCB0aGUgb3JpZ2luYWwgZmlsZSBwb3NpdGlvbnMgYnkgZ2l2aW5nIGl0IGEgZmlsZVxuICogcG9zaXRpb24gaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuXG4gKlxuICogVGhlIG9ubHkgcGFyYW1ldGVyIGlzIHRoZSByYXcgc291cmNlIG1hcCAoZWl0aGVyIGFzIGEgSlNPTiBzdHJpbmcsIG9yXG4gKiBhbHJlYWR5IHBhcnNlZCB0byBhbiBvYmplY3QpLiBBY2NvcmRpbmcgdG8gdGhlIHNwZWMsIHNvdXJjZSBtYXBzIGhhdmUgdGhlXG4gKiBmb2xsb3dpbmcgYXR0cmlidXRlczpcbiAqXG4gKiAgIC0gdmVyc2lvbjogV2hpY2ggdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcCBzcGVjIHRoaXMgbWFwIGlzIGZvbGxvd2luZy5cbiAqICAgLSBzb3VyY2VzOiBBbiBhcnJheSBvZiBVUkxzIHRvIHRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZXMuXG4gKiAgIC0gbmFtZXM6IEFuIGFycmF5IG9mIGlkZW50aWZpZXJzIHdoaWNoIGNhbiBiZSByZWZlcnJlbmNlZCBieSBpbmRpdmlkdWFsIG1hcHBpbmdzLlxuICogICAtIHNvdXJjZVJvb3Q6IE9wdGlvbmFsLiBUaGUgVVJMIHJvb3QgZnJvbSB3aGljaCBhbGwgc291cmNlcyBhcmUgcmVsYXRpdmUuXG4gKiAgIC0gc291cmNlc0NvbnRlbnQ6IE9wdGlvbmFsLiBBbiBhcnJheSBvZiBjb250ZW50cyBvZiB0aGUgb3JpZ2luYWwgc291cmNlIGZpbGVzLlxuICogICAtIG1hcHBpbmdzOiBBIHN0cmluZyBvZiBiYXNlNjQgVkxRcyB3aGljaCBjb250YWluIHRoZSBhY3R1YWwgbWFwcGluZ3MuXG4gKiAgIC0gZmlsZTogT3B0aW9uYWwuIFRoZSBnZW5lcmF0ZWQgZmlsZSB0aGlzIHNvdXJjZSBtYXAgaXMgYXNzb2NpYXRlZCB3aXRoLlxuICpcbiAqIEhlcmUgaXMgYW4gZXhhbXBsZSBzb3VyY2UgbWFwLCB0YWtlbiBmcm9tIHRoZSBzb3VyY2UgbWFwIHNwZWNbMF06XG4gKlxuICogICAgIHtcbiAqICAgICAgIHZlcnNpb24gOiAzLFxuICogICAgICAgZmlsZTogXCJvdXQuanNcIixcbiAqICAgICAgIHNvdXJjZVJvb3QgOiBcIlwiLFxuICogICAgICAgc291cmNlczogW1wiZm9vLmpzXCIsIFwiYmFyLmpzXCJdLFxuICogICAgICAgbmFtZXM6IFtcInNyY1wiLCBcIm1hcHNcIiwgXCJhcmVcIiwgXCJmdW5cIl0sXG4gKiAgICAgICBtYXBwaW5nczogXCJBQSxBQjs7QUJDREU7XCJcbiAqICAgICB9XG4gKlxuICogWzBdOiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9kb2N1bWVudC9kLzFVMVJHQWVoUXdSeXBVVG92RjFLUmxwaU9GemUwYi1fMmdjNmZBSDBLWTBrL2VkaXQ/cGxpPTEjXG4gKi9cbmZ1bmN0aW9uIEJhc2ljU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IEpTT04ucGFyc2UoYVNvdXJjZU1hcC5yZXBsYWNlKC9eXFwpXFxdXFx9Jy8sICcnKSk7XG4gIH1cblxuICB2YXIgdmVyc2lvbiA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3ZlcnNpb24nKTtcbiAgdmFyIHNvdXJjZXMgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdzb3VyY2VzJyk7XG4gIC8vIFNhc3MgMy4zIGxlYXZlcyBvdXQgdGhlICduYW1lcycgYXJyYXksIHNvIHdlIGRldmlhdGUgZnJvbSB0aGUgc3BlYyAod2hpY2hcbiAgLy8gcmVxdWlyZXMgdGhlIGFycmF5KSB0byBwbGF5IG5pY2UgaGVyZS5cbiAgdmFyIG5hbWVzID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnbmFtZXMnLCBbXSk7XG4gIHZhciBzb3VyY2VSb290ID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnc291cmNlUm9vdCcsIG51bGwpO1xuICB2YXIgc291cmNlc0NvbnRlbnQgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdzb3VyY2VzQ29udGVudCcsIG51bGwpO1xuICB2YXIgbWFwcGluZ3MgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdtYXBwaW5ncycpO1xuICB2YXIgZmlsZSA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ2ZpbGUnLCBudWxsKTtcblxuICAvLyBPbmNlIGFnYWluLCBTYXNzIGRldmlhdGVzIGZyb20gdGhlIHNwZWMgYW5kIHN1cHBsaWVzIHRoZSB2ZXJzaW9uIGFzIGFcbiAgLy8gc3RyaW5nIHJhdGhlciB0aGFuIGEgbnVtYmVyLCBzbyB3ZSB1c2UgbG9vc2UgZXF1YWxpdHkgY2hlY2tpbmcgaGVyZS5cbiAgaWYgKHZlcnNpb24gIT0gdGhpcy5fdmVyc2lvbikge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgdmVyc2lvbjogJyArIHZlcnNpb24pO1xuICB9XG5cbiAgc291cmNlcyA9IHNvdXJjZXNcbiAgICAubWFwKFN0cmluZylcbiAgICAvLyBTb21lIHNvdXJjZSBtYXBzIHByb2R1Y2UgcmVsYXRpdmUgc291cmNlIHBhdGhzIGxpa2UgXCIuL2Zvby5qc1wiIGluc3RlYWQgb2ZcbiAgICAvLyBcImZvby5qc1wiLiAgTm9ybWFsaXplIHRoZXNlIGZpcnN0IHNvIHRoYXQgZnV0dXJlIGNvbXBhcmlzb25zIHdpbGwgc3VjY2VlZC5cbiAgICAvLyBTZWUgYnVnemlsLmxhLzEwOTA3NjguXG4gICAgLm1hcCh1dGlsLm5vcm1hbGl6ZSlcbiAgICAvLyBBbHdheXMgZW5zdXJlIHRoYXQgYWJzb2x1dGUgc291cmNlcyBhcmUgaW50ZXJuYWxseSBzdG9yZWQgcmVsYXRpdmUgdG9cbiAgICAvLyB0aGUgc291cmNlIHJvb3QsIGlmIHRoZSBzb3VyY2Ugcm9vdCBpcyBhYnNvbHV0ZS4gTm90IGRvaW5nIHRoaXMgd291bGRcbiAgICAvLyBiZSBwYXJ0aWN1bGFybHkgcHJvYmxlbWF0aWMgd2hlbiB0aGUgc291cmNlIHJvb3QgaXMgYSBwcmVmaXggb2YgdGhlXG4gICAgLy8gc291cmNlICh2YWxpZCwgYnV0IHdoeT8/KS4gU2VlIGdpdGh1YiBpc3N1ZSAjMTk5IGFuZCBidWd6aWwubGEvMTE4ODk4Mi5cbiAgICAubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBzb3VyY2VSb290ICYmIHV0aWwuaXNBYnNvbHV0ZShzb3VyY2VSb290KSAmJiB1dGlsLmlzQWJzb2x1dGUoc291cmNlKVxuICAgICAgICA/IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlKVxuICAgICAgICA6IHNvdXJjZTtcbiAgICB9KTtcblxuICAvLyBQYXNzIGB0cnVlYCBiZWxvdyB0byBhbGxvdyBkdXBsaWNhdGUgbmFtZXMgYW5kIHNvdXJjZXMuIFdoaWxlIHNvdXJjZSBtYXBzXG4gIC8vIGFyZSBpbnRlbmRlZCB0byBiZSBjb21wcmVzc2VkIGFuZCBkZWR1cGxpY2F0ZWQsIHRoZSBUeXBlU2NyaXB0IGNvbXBpbGVyXG4gIC8vIHNvbWV0aW1lcyBnZW5lcmF0ZXMgc291cmNlIG1hcHMgd2l0aCBkdXBsaWNhdGVzIGluIHRoZW0uIFNlZSBHaXRodWIgaXNzdWVcbiAgLy8gIzcyIGFuZCBidWd6aWwubGEvODg5NDkyLlxuICB0aGlzLl9uYW1lcyA9IEFycmF5U2V0LmZyb21BcnJheShuYW1lcy5tYXAoU3RyaW5nKSwgdHJ1ZSk7XG4gIHRoaXMuX3NvdXJjZXMgPSBBcnJheVNldC5mcm9tQXJyYXkoc291cmNlcywgdHJ1ZSk7XG5cbiAgdGhpcy5zb3VyY2VSb290ID0gc291cmNlUm9vdDtcbiAgdGhpcy5zb3VyY2VzQ29udGVudCA9IHNvdXJjZXNDb250ZW50O1xuICB0aGlzLl9tYXBwaW5ncyA9IG1hcHBpbmdzO1xuICB0aGlzLmZpbGUgPSBmaWxlO1xufVxuXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlKTtcbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbnN1bWVyID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogQ3JlYXRlIGEgQmFzaWNTb3VyY2VNYXBDb25zdW1lciBmcm9tIGEgU291cmNlTWFwR2VuZXJhdG9yLlxuICpcbiAqIEBwYXJhbSBTb3VyY2VNYXBHZW5lcmF0b3IgYVNvdXJjZU1hcFxuICogICAgICAgIFRoZSBzb3VyY2UgbWFwIHRoYXQgd2lsbCBiZSBjb25zdW1lZC5cbiAqIEByZXR1cm5zIEJhc2ljU291cmNlTWFwQ29uc3VtZXJcbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5mcm9tU291cmNlTWFwID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfZnJvbVNvdXJjZU1hcChhU291cmNlTWFwKSB7XG4gICAgdmFyIHNtYyA9IE9iamVjdC5jcmVhdGUoQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUpO1xuXG4gICAgdmFyIG5hbWVzID0gc21jLl9uYW1lcyA9IEFycmF5U2V0LmZyb21BcnJheShhU291cmNlTWFwLl9uYW1lcy50b0FycmF5KCksIHRydWUpO1xuICAgIHZhciBzb3VyY2VzID0gc21jLl9zb3VyY2VzID0gQXJyYXlTZXQuZnJvbUFycmF5KGFTb3VyY2VNYXAuX3NvdXJjZXMudG9BcnJheSgpLCB0cnVlKTtcbiAgICBzbWMuc291cmNlUm9vdCA9IGFTb3VyY2VNYXAuX3NvdXJjZVJvb3Q7XG4gICAgc21jLnNvdXJjZXNDb250ZW50ID0gYVNvdXJjZU1hcC5fZ2VuZXJhdGVTb3VyY2VzQ29udGVudChzbWMuX3NvdXJjZXMudG9BcnJheSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc21jLnNvdXJjZVJvb3QpO1xuICAgIHNtYy5maWxlID0gYVNvdXJjZU1hcC5fZmlsZTtcblxuICAgIC8vIEJlY2F1c2Ugd2UgYXJlIG1vZGlmeWluZyB0aGUgZW50cmllcyAoYnkgY29udmVydGluZyBzdHJpbmcgc291cmNlcyBhbmRcbiAgICAvLyBuYW1lcyB0byBpbmRpY2VzIGludG8gdGhlIHNvdXJjZXMgYW5kIG5hbWVzIEFycmF5U2V0cyksIHdlIGhhdmUgdG8gbWFrZVxuICAgIC8vIGEgY29weSBvZiB0aGUgZW50cnkgb3IgZWxzZSBiYWQgdGhpbmdzIGhhcHBlbi4gU2hhcmVkIG11dGFibGUgc3RhdGVcbiAgICAvLyBzdHJpa2VzIGFnYWluISBTZWUgZ2l0aHViIGlzc3VlICMxOTEuXG5cbiAgICB2YXIgZ2VuZXJhdGVkTWFwcGluZ3MgPSBhU291cmNlTWFwLl9tYXBwaW5ncy50b0FycmF5KCkuc2xpY2UoKTtcbiAgICB2YXIgZGVzdEdlbmVyYXRlZE1hcHBpbmdzID0gc21jLl9fZ2VuZXJhdGVkTWFwcGluZ3MgPSBbXTtcbiAgICB2YXIgZGVzdE9yaWdpbmFsTWFwcGluZ3MgPSBzbWMuX19vcmlnaW5hbE1hcHBpbmdzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2VuZXJhdGVkTWFwcGluZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzcmNNYXBwaW5nID0gZ2VuZXJhdGVkTWFwcGluZ3NbaV07XG4gICAgICB2YXIgZGVzdE1hcHBpbmcgPSBuZXcgTWFwcGluZztcbiAgICAgIGRlc3RNYXBwaW5nLmdlbmVyYXRlZExpbmUgPSBzcmNNYXBwaW5nLmdlbmVyYXRlZExpbmU7XG4gICAgICBkZXN0TWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gPSBzcmNNYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcblxuICAgICAgaWYgKHNyY01hcHBpbmcuc291cmNlKSB7XG4gICAgICAgIGRlc3RNYXBwaW5nLnNvdXJjZSA9IHNvdXJjZXMuaW5kZXhPZihzcmNNYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIGRlc3RNYXBwaW5nLm9yaWdpbmFsTGluZSA9IHNyY01hcHBpbmcub3JpZ2luYWxMaW5lO1xuICAgICAgICBkZXN0TWFwcGluZy5vcmlnaW5hbENvbHVtbiA9IHNyY01hcHBpbmcub3JpZ2luYWxDb2x1bW47XG5cbiAgICAgICAgaWYgKHNyY01hcHBpbmcubmFtZSkge1xuICAgICAgICAgIGRlc3RNYXBwaW5nLm5hbWUgPSBuYW1lcy5pbmRleE9mKHNyY01hcHBpbmcubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBkZXN0T3JpZ2luYWxNYXBwaW5ncy5wdXNoKGRlc3RNYXBwaW5nKTtcbiAgICAgIH1cblxuICAgICAgZGVzdEdlbmVyYXRlZE1hcHBpbmdzLnB1c2goZGVzdE1hcHBpbmcpO1xuICAgIH1cblxuICAgIHF1aWNrU29ydChzbWMuX19vcmlnaW5hbE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKTtcblxuICAgIHJldHVybiBzbWM7XG4gIH07XG5cbi8qKlxuICogVGhlIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXBwaW5nIHNwZWMgdGhhdCB3ZSBhcmUgY29uc3VtaW5nLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8qKlxuICogVGhlIGxpc3Qgb2Ygb3JpZ2luYWwgc291cmNlcy5cbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLCAnc291cmNlcycsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZXMudG9BcnJheSgpLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlUm9vdCAhPSBudWxsID8gdXRpbC5qb2luKHRoaXMuc291cmNlUm9vdCwgcykgOiBzO1xuICAgIH0sIHRoaXMpO1xuICB9XG59KTtcblxuLyoqXG4gKiBQcm92aWRlIHRoZSBKSVQgd2l0aCBhIG5pY2Ugc2hhcGUgLyBoaWRkZW4gY2xhc3MuXG4gKi9cbmZ1bmN0aW9uIE1hcHBpbmcoKSB7XG4gIHRoaXMuZ2VuZXJhdGVkTGluZSA9IDA7XG4gIHRoaXMuZ2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgdGhpcy5zb3VyY2UgPSBudWxsO1xuICB0aGlzLm9yaWdpbmFsTGluZSA9IG51bGw7XG4gIHRoaXMub3JpZ2luYWxDb2x1bW4gPSBudWxsO1xuICB0aGlzLm5hbWUgPSBudWxsO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBtYXBwaW5ncyBpbiBhIHN0cmluZyBpbiB0byBhIGRhdGEgc3RydWN0dXJlIHdoaWNoIHdlIGNhbiBlYXNpbHlcbiAqIHF1ZXJ5ICh0aGUgb3JkZXJlZCBhcnJheXMgaW4gdGhlIGB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3NgIGFuZFxuICogYHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzYCBwcm9wZXJ0aWVzKS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX3BhcnNlTWFwcGluZ3MgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9wYXJzZU1hcHBpbmdzKGFTdHIsIGFTb3VyY2VSb290KSB7XG4gICAgdmFyIGdlbmVyYXRlZExpbmUgPSAxO1xuICAgIHZhciBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgdmFyIHByZXZpb3VzT3JpZ2luYWxMaW5lID0gMDtcbiAgICB2YXIgcHJldmlvdXNPcmlnaW5hbENvbHVtbiA9IDA7XG4gICAgdmFyIHByZXZpb3VzU291cmNlID0gMDtcbiAgICB2YXIgcHJldmlvdXNOYW1lID0gMDtcbiAgICB2YXIgbGVuZ3RoID0gYVN0ci5sZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgY2FjaGVkU2VnbWVudHMgPSB7fTtcbiAgICB2YXIgdGVtcCA9IHt9O1xuICAgIHZhciBvcmlnaW5hbE1hcHBpbmdzID0gW107XG4gICAgdmFyIGdlbmVyYXRlZE1hcHBpbmdzID0gW107XG4gICAgdmFyIG1hcHBpbmcsIHN0ciwgc2VnbWVudCwgZW5kLCB2YWx1ZTtcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKGFTdHIuY2hhckF0KGluZGV4KSA9PT0gJzsnKSB7XG4gICAgICAgIGdlbmVyYXRlZExpbmUrKztcbiAgICAgICAgaW5kZXgrKztcbiAgICAgICAgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoYVN0ci5jaGFyQXQoaW5kZXgpID09PSAnLCcpIHtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBtYXBwaW5nID0gbmV3IE1hcHBpbmcoKTtcbiAgICAgICAgbWFwcGluZy5nZW5lcmF0ZWRMaW5lID0gZ2VuZXJhdGVkTGluZTtcblxuICAgICAgICAvLyBCZWNhdXNlIGVhY2ggb2Zmc2V0IGlzIGVuY29kZWQgcmVsYXRpdmUgdG8gdGhlIHByZXZpb3VzIG9uZSxcbiAgICAgICAgLy8gbWFueSBzZWdtZW50cyBvZnRlbiBoYXZlIHRoZSBzYW1lIGVuY29kaW5nLiBXZSBjYW4gZXhwbG9pdCB0aGlzXG4gICAgICAgIC8vIGZhY3QgYnkgY2FjaGluZyB0aGUgcGFyc2VkIHZhcmlhYmxlIGxlbmd0aCBmaWVsZHMgb2YgZWFjaCBzZWdtZW50LFxuICAgICAgICAvLyBhbGxvd2luZyB1cyB0byBhdm9pZCBhIHNlY29uZCBwYXJzZSBpZiB3ZSBlbmNvdW50ZXIgdGhlIHNhbWVcbiAgICAgICAgLy8gc2VnbWVudCBhZ2Fpbi5cbiAgICAgICAgZm9yIChlbmQgPSBpbmRleDsgZW5kIDwgbGVuZ3RoOyBlbmQrKykge1xuICAgICAgICAgIGlmICh0aGlzLl9jaGFySXNNYXBwaW5nU2VwYXJhdG9yKGFTdHIsIGVuZCkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdHIgPSBhU3RyLnNsaWNlKGluZGV4LCBlbmQpO1xuXG4gICAgICAgIHNlZ21lbnQgPSBjYWNoZWRTZWdtZW50c1tzdHJdO1xuICAgICAgICBpZiAoc2VnbWVudCkge1xuICAgICAgICAgIGluZGV4ICs9IHN0ci5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VnbWVudCA9IFtdO1xuICAgICAgICAgIHdoaWxlIChpbmRleCA8IGVuZCkge1xuICAgICAgICAgICAgYmFzZTY0VkxRLmRlY29kZShhU3RyLCBpbmRleCwgdGVtcCk7XG4gICAgICAgICAgICB2YWx1ZSA9IHRlbXAudmFsdWU7XG4gICAgICAgICAgICBpbmRleCA9IHRlbXAucmVzdDtcbiAgICAgICAgICAgIHNlZ21lbnQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlZ21lbnQubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIGEgc291cmNlLCBidXQgbm8gbGluZSBhbmQgY29sdW1uJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlZ21lbnQubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIGEgc291cmNlIGFuZCBsaW5lLCBidXQgbm8gY29sdW1uJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2FjaGVkU2VnbWVudHNbc3RyXSA9IHNlZ21lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHZW5lcmF0ZWQgY29sdW1uLlxuICAgICAgICBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbiA9IHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uICsgc2VnbWVudFswXTtcbiAgICAgICAgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcblxuICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgLy8gT3JpZ2luYWwgc291cmNlLlxuICAgICAgICAgIG1hcHBpbmcuc291cmNlID0gcHJldmlvdXNTb3VyY2UgKyBzZWdtZW50WzFdO1xuICAgICAgICAgIHByZXZpb3VzU291cmNlICs9IHNlZ21lbnRbMV07XG5cbiAgICAgICAgICAvLyBPcmlnaW5hbCBsaW5lLlxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxMaW5lID0gcHJldmlvdXNPcmlnaW5hbExpbmUgKyBzZWdtZW50WzJdO1xuICAgICAgICAgIHByZXZpb3VzT3JpZ2luYWxMaW5lID0gbWFwcGluZy5vcmlnaW5hbExpbmU7XG4gICAgICAgICAgLy8gTGluZXMgYXJlIHN0b3JlZCAwLWJhc2VkXG4gICAgICAgICAgbWFwcGluZy5vcmlnaW5hbExpbmUgKz0gMTtcblxuICAgICAgICAgIC8vIE9yaWdpbmFsIGNvbHVtbi5cbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uID0gcHJldmlvdXNPcmlnaW5hbENvbHVtbiArIHNlZ21lbnRbM107XG4gICAgICAgICAgcHJldmlvdXNPcmlnaW5hbENvbHVtbiA9IG1hcHBpbmcub3JpZ2luYWxDb2x1bW47XG5cbiAgICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPiA0KSB7XG4gICAgICAgICAgICAvLyBPcmlnaW5hbCBuYW1lLlxuICAgICAgICAgICAgbWFwcGluZy5uYW1lID0gcHJldmlvdXNOYW1lICsgc2VnbWVudFs0XTtcbiAgICAgICAgICAgIHByZXZpb3VzTmFtZSArPSBzZWdtZW50WzRdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdlbmVyYXRlZE1hcHBpbmdzLnB1c2gobWFwcGluZyk7XG4gICAgICAgIGlmICh0eXBlb2YgbWFwcGluZy5vcmlnaW5hbExpbmUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgb3JpZ2luYWxNYXBwaW5ncy5wdXNoKG1hcHBpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcXVpY2tTb3J0KGdlbmVyYXRlZE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkKTtcbiAgICB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MgPSBnZW5lcmF0ZWRNYXBwaW5ncztcblxuICAgIHF1aWNrU29ydChvcmlnaW5hbE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKTtcbiAgICB0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncyA9IG9yaWdpbmFsTWFwcGluZ3M7XG4gIH07XG5cbi8qKlxuICogRmluZCB0aGUgbWFwcGluZyB0aGF0IGJlc3QgbWF0Y2hlcyB0aGUgaHlwb3RoZXRpY2FsIFwibmVlZGxlXCIgbWFwcGluZyB0aGF0XG4gKiB3ZSBhcmUgc2VhcmNoaW5nIGZvciBpbiB0aGUgZ2l2ZW4gXCJoYXlzdGFja1wiIG9mIG1hcHBpbmdzLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fZmluZE1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9maW5kTWFwcGluZyhhTmVlZGxlLCBhTWFwcGluZ3MsIGFMaW5lTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYUNvbHVtbk5hbWUsIGFDb21wYXJhdG9yLCBhQmlhcykge1xuICAgIC8vIFRvIHJldHVybiB0aGUgcG9zaXRpb24gd2UgYXJlIHNlYXJjaGluZyBmb3IsIHdlIG11c3QgZmlyc3QgZmluZCB0aGVcbiAgICAvLyBtYXBwaW5nIGZvciB0aGUgZ2l2ZW4gcG9zaXRpb24gYW5kIHRoZW4gcmV0dXJuIHRoZSBvcHBvc2l0ZSBwb3NpdGlvbiBpdFxuICAgIC8vIHBvaW50cyB0by4gQmVjYXVzZSB0aGUgbWFwcGluZ3MgYXJlIHNvcnRlZCwgd2UgY2FuIHVzZSBiaW5hcnkgc2VhcmNoIHRvXG4gICAgLy8gZmluZCB0aGUgYmVzdCBtYXBwaW5nLlxuXG4gICAgaWYgKGFOZWVkbGVbYUxpbmVOYW1lXSA8PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdMaW5lIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDEsIGdvdCAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICsgYU5lZWRsZVthTGluZU5hbWVdKTtcbiAgICB9XG4gICAgaWYgKGFOZWVkbGVbYUNvbHVtbk5hbWVdIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ29sdW1uIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDAsIGdvdCAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICsgYU5lZWRsZVthQ29sdW1uTmFtZV0pO1xuICAgIH1cblxuICAgIHJldHVybiBiaW5hcnlTZWFyY2guc2VhcmNoKGFOZWVkbGUsIGFNYXBwaW5ncywgYUNvbXBhcmF0b3IsIGFCaWFzKTtcbiAgfTtcblxuLyoqXG4gKiBDb21wdXRlIHRoZSBsYXN0IGNvbHVtbiBmb3IgZWFjaCBnZW5lcmF0ZWQgbWFwcGluZy4gVGhlIGxhc3QgY29sdW1uIGlzXG4gKiBpbmNsdXNpdmUuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbXB1dGVDb2x1bW5TcGFucyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2NvbXB1dGVDb2x1bW5TcGFucygpIHtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3MubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzW2luZGV4XTtcblxuICAgICAgLy8gTWFwcGluZ3MgZG8gbm90IGNvbnRhaW4gYSBmaWVsZCBmb3IgdGhlIGxhc3QgZ2VuZXJhdGVkIGNvbHVtbnQuIFdlXG4gICAgICAvLyBjYW4gY29tZSB1cCB3aXRoIGFuIG9wdGltaXN0aWMgZXN0aW1hdGUsIGhvd2V2ZXIsIGJ5IGFzc3VtaW5nIHRoYXRcbiAgICAgIC8vIG1hcHBpbmdzIGFyZSBjb250aWd1b3VzIChpLmUuIGdpdmVuIHR3byBjb25zZWN1dGl2ZSBtYXBwaW5ncywgdGhlXG4gICAgICAvLyBmaXJzdCBtYXBwaW5nIGVuZHMgd2hlcmUgdGhlIHNlY29uZCBvbmUgc3RhcnRzKS5cbiAgICAgIGlmIChpbmRleCArIDEgPCB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIG5leHRNYXBwaW5nID0gdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3NbaW5kZXggKyAxXTtcblxuICAgICAgICBpZiAobWFwcGluZy5nZW5lcmF0ZWRMaW5lID09PSBuZXh0TWFwcGluZy5nZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgICAgbWFwcGluZy5sYXN0R2VuZXJhdGVkQ29sdW1uID0gbmV4dE1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uIC0gMTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgbGFzdCBtYXBwaW5nIGZvciBlYWNoIGxpbmUgc3BhbnMgdGhlIGVudGlyZSBsaW5lLlxuICAgICAgbWFwcGluZy5sYXN0R2VuZXJhdGVkQ29sdW1uID0gSW5maW5pdHk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSwgbGluZSwgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGdlbmVyYXRlZFxuICogc291cmNlJ3MgbGluZSBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKiB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuXG4gKiAgIC0gYmlhczogRWl0aGVyICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQnLiBTcGVjaWZpZXMgd2hldGhlciB0byByZXR1cm4gdGhlXG4gKiAgICAgY2xvc2VzdCBlbGVtZW50IHRoYXQgaXMgc21hbGxlciB0aGFuIG9yIGdyZWF0ZXIgdGhhbiB0aGUgb25lIHdlIGFyZVxuICogICAgIHNlYXJjaGluZyBmb3IsIHJlc3BlY3RpdmVseSwgaWYgdGhlIGV4YWN0IGVsZW1lbnQgY2Fubm90IGJlIGZvdW5kLlxuICogICAgIERlZmF1bHRzIHRvICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgb3JpZ2luYWwgc291cmNlIGZpbGUsIG9yIG51bGwuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UsIG9yIG51bGwuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLCBvciBudWxsLlxuICogICAtIG5hbWU6IFRoZSBvcmlnaW5hbCBpZGVudGlmaWVyLCBvciBudWxsLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5vcmlnaW5hbFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfb3JpZ2luYWxQb3NpdGlvbkZvcihhQXJncykge1xuICAgIHZhciBuZWVkbGUgPSB7XG4gICAgICBnZW5lcmF0ZWRMaW5lOiB1dGlsLmdldEFyZyhhQXJncywgJ2xpbmUnKSxcbiAgICAgIGdlbmVyYXRlZENvbHVtbjogdXRpbC5nZXRBcmcoYUFyZ3MsICdjb2x1bW4nKVxuICAgIH07XG5cbiAgICB2YXIgaW5kZXggPSB0aGlzLl9maW5kTWFwcGluZyhcbiAgICAgIG5lZWRsZSxcbiAgICAgIHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzLFxuICAgICAgXCJnZW5lcmF0ZWRMaW5lXCIsXG4gICAgICBcImdlbmVyYXRlZENvbHVtblwiLFxuICAgICAgdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZCxcbiAgICAgIHV0aWwuZ2V0QXJnKGFBcmdzLCAnYmlhcycsIFNvdXJjZU1hcENvbnN1bWVyLkdSRUFURVNUX0xPV0VSX0JPVU5EKVxuICAgICk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5nc1tpbmRleF07XG5cbiAgICAgIGlmIChtYXBwaW5nLmdlbmVyYXRlZExpbmUgPT09IG5lZWRsZS5nZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSB1dGlsLmdldEFyZyhtYXBwaW5nLCAnc291cmNlJywgbnVsbCk7XG4gICAgICAgIGlmIChzb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgICBzb3VyY2UgPSB0aGlzLl9zb3VyY2VzLmF0KHNvdXJjZSk7XG4gICAgICAgICAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBzb3VyY2UgPSB1dGlsLmpvaW4odGhpcy5zb3VyY2VSb290LCBzb3VyY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgbmFtZSA9IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICduYW1lJywgbnVsbCk7XG4gICAgICAgIGlmIChuYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgbmFtZSA9IHRoaXMuX25hbWVzLmF0KG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgbGluZTogdXRpbC5nZXRBcmcobWFwcGluZywgJ29yaWdpbmFsTGluZScsIG51bGwpLFxuICAgICAgICAgIGNvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ29yaWdpbmFsQ29sdW1uJywgbnVsbCksXG4gICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzb3VyY2U6IG51bGwsXG4gICAgICBsaW5lOiBudWxsLFxuICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgbmFtZTogbnVsbFxuICAgIH07XG4gIH07XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgd2UgaGF2ZSB0aGUgc291cmNlIGNvbnRlbnQgZm9yIGV2ZXJ5IHNvdXJjZSBpbiB0aGUgc291cmNlXG4gKiBtYXAsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuaGFzQ29udGVudHNPZkFsbFNvdXJjZXMgPVxuICBmdW5jdGlvbiBCYXNpY1NvdXJjZU1hcENvbnN1bWVyX2hhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzKCkge1xuICAgIGlmICghdGhpcy5zb3VyY2VzQ29udGVudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2VzQ29udGVudC5sZW5ndGggPj0gdGhpcy5fc291cmNlcy5zaXplKCkgJiZcbiAgICAgICF0aGlzLnNvdXJjZXNDb250ZW50LnNvbWUoZnVuY3Rpb24gKHNjKSB7IHJldHVybiBzYyA9PSBudWxsOyB9KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzb3VyY2UgY29udGVudC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgdGhlIHVybCBvZiB0aGVcbiAqIG9yaWdpbmFsIHNvdXJjZSBmaWxlLiBSZXR1cm5zIG51bGwgaWYgbm8gb3JpZ2luYWwgc291cmNlIGNvbnRlbnQgaXNcbiAqIGF2YWlsYWJsZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuc291cmNlQ29udGVudEZvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3NvdXJjZUNvbnRlbnRGb3IoYVNvdXJjZSwgbnVsbE9uTWlzc2luZykge1xuICAgIGlmICghdGhpcy5zb3VyY2VzQ29udGVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICBhU291cmNlID0gdXRpbC5yZWxhdGl2ZSh0aGlzLnNvdXJjZVJvb3QsIGFTb3VyY2UpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zb3VyY2VzLmhhcyhhU291cmNlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlc0NvbnRlbnRbdGhpcy5fc291cmNlcy5pbmRleE9mKGFTb3VyY2UpXTtcbiAgICB9XG5cbiAgICB2YXIgdXJsO1xuICAgIGlmICh0aGlzLnNvdXJjZVJvb3QgIT0gbnVsbFxuICAgICAgICAmJiAodXJsID0gdXRpbC51cmxQYXJzZSh0aGlzLnNvdXJjZVJvb3QpKSkge1xuICAgICAgLy8gWFhYOiBmaWxlOi8vIFVSSXMgYW5kIGFic29sdXRlIHBhdGhzIGxlYWQgdG8gdW5leHBlY3RlZCBiZWhhdmlvciBmb3JcbiAgICAgIC8vIG1hbnkgdXNlcnMuIFdlIGNhbiBoZWxwIHRoZW0gb3V0IHdoZW4gdGhleSBleHBlY3QgZmlsZTovLyBVUklzIHRvXG4gICAgICAvLyBiZWhhdmUgbGlrZSBpdCB3b3VsZCBpZiB0aGV5IHdlcmUgcnVubmluZyBhIGxvY2FsIEhUVFAgc2VydmVyLiBTZWVcbiAgICAgIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTg4NTU5Ny5cbiAgICAgIHZhciBmaWxlVXJpQWJzUGF0aCA9IGFTb3VyY2UucmVwbGFjZSgvXmZpbGU6XFwvXFwvLywgXCJcIik7XG4gICAgICBpZiAodXJsLnNjaGVtZSA9PSBcImZpbGVcIlxuICAgICAgICAgICYmIHRoaXMuX3NvdXJjZXMuaGFzKGZpbGVVcmlBYnNQYXRoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VzQ29udGVudFt0aGlzLl9zb3VyY2VzLmluZGV4T2YoZmlsZVVyaUFic1BhdGgpXVxuICAgICAgfVxuXG4gICAgICBpZiAoKCF1cmwucGF0aCB8fCB1cmwucGF0aCA9PSBcIi9cIilcbiAgICAgICAgICAmJiB0aGlzLl9zb3VyY2VzLmhhcyhcIi9cIiArIGFTb3VyY2UpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZXNDb250ZW50W3RoaXMuX3NvdXJjZXMuaW5kZXhPZihcIi9cIiArIGFTb3VyY2UpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgcmVjdXJzaXZlbHkgZnJvbVxuICAgIC8vIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuc291cmNlQ29udGVudEZvci4gSW4gdGhhdCBjYXNlLCB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gdGhyb3cgaWYgd2UgY2FuJ3QgZmluZCB0aGUgc291cmNlIC0gd2UganVzdCB3YW50IHRvXG4gICAgLy8gcmV0dXJuIG51bGwsIHNvIHdlIHByb3ZpZGUgYSBmbGFnIHRvIGV4aXQgZ3JhY2VmdWxseS5cbiAgICBpZiAobnVsbE9uTWlzc2luZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBhU291cmNlICsgJ1wiIGlzIG5vdCBpbiB0aGUgU291cmNlTWFwLicpO1xuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBnZW5lcmF0ZWQgbGluZSBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgb3JpZ2luYWwgc291cmNlLFxuICogbGluZSwgYW5kIGNvbHVtbiBwb3NpdGlvbnMgcHJvdmlkZWQuIFRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIG9iamVjdCB3aXRoXG4gKiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIGZpbGVuYW1lIG9mIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLlxuICogICAtIGJpYXM6IEVpdGhlciAnU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQnIG9yXG4gKiAgICAgJ1NvdXJjZU1hcENvbnN1bWVyLkxFQVNUX1VQUEVSX0JPVU5EJy4gU3BlY2lmaWVzIHdoZXRoZXIgdG8gcmV0dXJuIHRoZVxuICogICAgIGNsb3Nlc3QgZWxlbWVudCB0aGF0IGlzIHNtYWxsZXIgdGhhbiBvciBncmVhdGVyIHRoYW4gdGhlIG9uZSB3ZSBhcmVcbiAqICAgICBzZWFyY2hpbmcgZm9yLCByZXNwZWN0aXZlbHksIGlmIHRoZSBleGFjdCBlbGVtZW50IGNhbm5vdCBiZSBmb3VuZC5cbiAqICAgICBEZWZhdWx0cyB0byAnU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQnLlxuICpcbiAqIGFuZCBhbiBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5nZW5lcmF0ZWRQb3NpdGlvbkZvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2dlbmVyYXRlZFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgdmFyIHNvdXJjZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJyk7XG4gICAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICBzb3VyY2UgPSB1dGlsLnJlbGF0aXZlKHRoaXMuc291cmNlUm9vdCwgc291cmNlKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9zb3VyY2VzLmhhcyhzb3VyY2UpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaW5lOiBudWxsLFxuICAgICAgICBjb2x1bW46IG51bGwsXG4gICAgICAgIGxhc3RDb2x1bW46IG51bGxcbiAgICAgIH07XG4gICAgfVxuICAgIHNvdXJjZSA9IHRoaXMuX3NvdXJjZXMuaW5kZXhPZihzb3VyY2UpO1xuXG4gICAgdmFyIG5lZWRsZSA9IHtcbiAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgb3JpZ2luYWxMaW5lOiB1dGlsLmdldEFyZyhhQXJncywgJ2xpbmUnKSxcbiAgICAgIG9yaWdpbmFsQ29sdW1uOiB1dGlsLmdldEFyZyhhQXJncywgJ2NvbHVtbicpXG4gICAgfTtcblxuICAgIHZhciBpbmRleCA9IHRoaXMuX2ZpbmRNYXBwaW5nKFxuICAgICAgbmVlZGxlLFxuICAgICAgdGhpcy5fb3JpZ2luYWxNYXBwaW5ncyxcbiAgICAgIFwib3JpZ2luYWxMaW5lXCIsXG4gICAgICBcIm9yaWdpbmFsQ29sdW1uXCIsXG4gICAgICB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zLFxuICAgICAgdXRpbC5nZXRBcmcoYUFyZ3MsICdiaWFzJywgU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQpXG4gICAgKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICBpZiAobWFwcGluZy5zb3VyY2UgPT09IG5lZWRsZS5zb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsaW5lOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnZ2VuZXJhdGVkTGluZScsIG51bGwpLFxuICAgICAgICAgIGNvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZENvbHVtbicsIG51bGwpLFxuICAgICAgICAgIGxhc3RDb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdsYXN0R2VuZXJhdGVkQ29sdW1uJywgbnVsbClcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZTogbnVsbCxcbiAgICAgIGNvbHVtbjogbnVsbCxcbiAgICAgIGxhc3RDb2x1bW46IG51bGxcbiAgICB9O1xuICB9O1xuXG5leHBvcnRzLkJhc2ljU291cmNlTWFwQ29uc3VtZXIgPSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyO1xuXG4vKipcbiAqIEFuIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lciBpbnN0YW5jZSByZXByZXNlbnRzIGEgcGFyc2VkIHNvdXJjZSBtYXAgd2hpY2hcbiAqIHdlIGNhbiBxdWVyeSBmb3IgaW5mb3JtYXRpb24uIEl0IGRpZmZlcnMgZnJvbSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyIGluXG4gKiB0aGF0IGl0IHRha2VzIFwiaW5kZXhlZFwiIHNvdXJjZSBtYXBzIChpLmUuIG9uZXMgd2l0aCBhIFwic2VjdGlvbnNcIiBmaWVsZCkgYXNcbiAqIGlucHV0LlxuICpcbiAqIFRoZSBvbmx5IHBhcmFtZXRlciBpcyBhIHJhdyBzb3VyY2UgbWFwIChlaXRoZXIgYXMgYSBKU09OIHN0cmluZywgb3IgYWxyZWFkeVxuICogcGFyc2VkIHRvIGFuIG9iamVjdCkuIEFjY29yZGluZyB0byB0aGUgc3BlYyBmb3IgaW5kZXhlZCBzb3VyY2UgbWFwcywgdGhleVxuICogaGF2ZSB0aGUgZm9sbG93aW5nIGF0dHJpYnV0ZXM6XG4gKlxuICogICAtIHZlcnNpb246IFdoaWNoIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXAgc3BlYyB0aGlzIG1hcCBpcyBmb2xsb3dpbmcuXG4gKiAgIC0gZmlsZTogT3B0aW9uYWwuIFRoZSBnZW5lcmF0ZWQgZmlsZSB0aGlzIHNvdXJjZSBtYXAgaXMgYXNzb2NpYXRlZCB3aXRoLlxuICogICAtIHNlY3Rpb25zOiBBIGxpc3Qgb2Ygc2VjdGlvbiBkZWZpbml0aW9ucy5cbiAqXG4gKiBFYWNoIHZhbHVlIHVuZGVyIHRoZSBcInNlY3Rpb25zXCIgZmllbGQgaGFzIHR3byBmaWVsZHM6XG4gKiAgIC0gb2Zmc2V0OiBUaGUgb2Zmc2V0IGludG8gdGhlIG9yaWdpbmFsIHNwZWNpZmllZCBhdCB3aGljaCB0aGlzIHNlY3Rpb25cbiAqICAgICAgIGJlZ2lucyB0byBhcHBseSwgZGVmaW5lZCBhcyBhbiBvYmplY3Qgd2l0aCBhIFwibGluZVwiIGFuZCBcImNvbHVtblwiXG4gKiAgICAgICBmaWVsZC5cbiAqICAgLSBtYXA6IEEgc291cmNlIG1hcCBkZWZpbml0aW9uLiBUaGlzIHNvdXJjZSBtYXAgY291bGQgYWxzbyBiZSBpbmRleGVkLFxuICogICAgICAgYnV0IGRvZXNuJ3QgaGF2ZSB0byBiZS5cbiAqXG4gKiBJbnN0ZWFkIG9mIHRoZSBcIm1hcFwiIGZpZWxkLCBpdCdzIGFsc28gcG9zc2libGUgdG8gaGF2ZSBhIFwidXJsXCIgZmllbGRcbiAqIHNwZWNpZnlpbmcgYSBVUkwgdG8gcmV0cmlldmUgYSBzb3VyY2UgbWFwIGZyb20sIGJ1dCB0aGF0J3MgY3VycmVudGx5XG4gKiB1bnN1cHBvcnRlZC5cbiAqXG4gKiBIZXJlJ3MgYW4gZXhhbXBsZSBzb3VyY2UgbWFwLCB0YWtlbiBmcm9tIHRoZSBzb3VyY2UgbWFwIHNwZWNbMF0sIGJ1dFxuICogbW9kaWZpZWQgdG8gb21pdCBhIHNlY3Rpb24gd2hpY2ggdXNlcyB0aGUgXCJ1cmxcIiBmaWVsZC5cbiAqXG4gKiAge1xuICogICAgdmVyc2lvbiA6IDMsXG4gKiAgICBmaWxlOiBcImFwcC5qc1wiLFxuICogICAgc2VjdGlvbnM6IFt7XG4gKiAgICAgIG9mZnNldDoge2xpbmU6MTAwLCBjb2x1bW46MTB9LFxuICogICAgICBtYXA6IHtcbiAqICAgICAgICB2ZXJzaW9uIDogMyxcbiAqICAgICAgICBmaWxlOiBcInNlY3Rpb24uanNcIixcbiAqICAgICAgICBzb3VyY2VzOiBbXCJmb28uanNcIiwgXCJiYXIuanNcIl0sXG4gKiAgICAgICAgbmFtZXM6IFtcInNyY1wiLCBcIm1hcHNcIiwgXCJhcmVcIiwgXCJmdW5cIl0sXG4gKiAgICAgICAgbWFwcGluZ3M6IFwiQUFBQSxFOztBQkNERTtcIlxuICogICAgICB9XG4gKiAgICB9XSxcbiAqICB9XG4gKlxuICogWzBdOiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9kb2N1bWVudC9kLzFVMVJHQWVoUXdSeXBVVG92RjFLUmxwaU9GemUwYi1fMmdjNmZBSDBLWTBrL2VkaXQjaGVhZGluZz1oLjUzNWVzM3hlcHJndFxuICovXG5mdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IEpTT04ucGFyc2UoYVNvdXJjZU1hcC5yZXBsYWNlKC9eXFwpXFxdXFx9Jy8sICcnKSk7XG4gIH1cblxuICB2YXIgdmVyc2lvbiA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3ZlcnNpb24nKTtcbiAgdmFyIHNlY3Rpb25zID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnc2VjdGlvbnMnKTtcblxuICBpZiAodmVyc2lvbiAhPSB0aGlzLl92ZXJzaW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCB2ZXJzaW9uOiAnICsgdmVyc2lvbik7XG4gIH1cblxuICB0aGlzLl9zb3VyY2VzID0gbmV3IEFycmF5U2V0KCk7XG4gIHRoaXMuX25hbWVzID0gbmV3IEFycmF5U2V0KCk7XG5cbiAgdmFyIGxhc3RPZmZzZXQgPSB7XG4gICAgbGluZTogLTEsXG4gICAgY29sdW1uOiAwXG4gIH07XG4gIHRoaXMuX3NlY3Rpb25zID0gc2VjdGlvbnMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgaWYgKHMudXJsKSB7XG4gICAgICAvLyBUaGUgdXJsIGZpZWxkIHdpbGwgcmVxdWlyZSBzdXBwb3J0IGZvciBhc3luY2hyb25pY2l0eS5cbiAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL2lzc3Vlcy8xNlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdXBwb3J0IGZvciB1cmwgZmllbGQgaW4gc2VjdGlvbnMgbm90IGltcGxlbWVudGVkLicpO1xuICAgIH1cbiAgICB2YXIgb2Zmc2V0ID0gdXRpbC5nZXRBcmcocywgJ29mZnNldCcpO1xuICAgIHZhciBvZmZzZXRMaW5lID0gdXRpbC5nZXRBcmcob2Zmc2V0LCAnbGluZScpO1xuICAgIHZhciBvZmZzZXRDb2x1bW4gPSB1dGlsLmdldEFyZyhvZmZzZXQsICdjb2x1bW4nKTtcblxuICAgIGlmIChvZmZzZXRMaW5lIDwgbGFzdE9mZnNldC5saW5lIHx8XG4gICAgICAgIChvZmZzZXRMaW5lID09PSBsYXN0T2Zmc2V0LmxpbmUgJiYgb2Zmc2V0Q29sdW1uIDwgbGFzdE9mZnNldC5jb2x1bW4pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlY3Rpb24gb2Zmc2V0cyBtdXN0IGJlIG9yZGVyZWQgYW5kIG5vbi1vdmVybGFwcGluZy4nKTtcbiAgICB9XG4gICAgbGFzdE9mZnNldCA9IG9mZnNldDtcblxuICAgIHJldHVybiB7XG4gICAgICBnZW5lcmF0ZWRPZmZzZXQ6IHtcbiAgICAgICAgLy8gVGhlIG9mZnNldCBmaWVsZHMgYXJlIDAtYmFzZWQsIGJ1dCB3ZSB1c2UgMS1iYXNlZCBpbmRpY2VzIHdoZW5cbiAgICAgICAgLy8gZW5jb2RpbmcvZGVjb2RpbmcgZnJvbSBWTFEuXG4gICAgICAgIGdlbmVyYXRlZExpbmU6IG9mZnNldExpbmUgKyAxLFxuICAgICAgICBnZW5lcmF0ZWRDb2x1bW46IG9mZnNldENvbHVtbiArIDFcbiAgICAgIH0sXG4gICAgICBjb25zdW1lcjogbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwuZ2V0QXJnKHMsICdtYXAnKSlcbiAgICB9XG4gIH0pO1xufVxuXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUpO1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNvdXJjZU1hcENvbnN1bWVyO1xuXG4vKipcbiAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBzb3VyY2UgbWFwcGluZyBzcGVjIHRoYXQgd2UgYXJlIGNvbnN1bWluZy5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8qKlxuICogVGhlIGxpc3Qgb2Ygb3JpZ2luYWwgc291cmNlcy5cbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUsICdzb3VyY2VzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc291cmNlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5fc2VjdGlvbnNbaV0uY29uc3VtZXIuc291cmNlcy5sZW5ndGg7IGorKykge1xuICAgICAgICBzb3VyY2VzLnB1c2godGhpcy5fc2VjdGlvbnNbaV0uY29uc3VtZXIuc291cmNlc1tqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2VzO1xuICB9XG59KTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzb3VyY2UsIGxpbmUsIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBnZW5lcmF0ZWRcbiAqIHNvdXJjZSdzIGxpbmUgYW5kIGNvbHVtbiBwb3NpdGlvbnMgcHJvdmlkZWQuIFRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIG9iamVjdFxuICogd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLlxuICpcbiAqIGFuZCBhbiBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlLCBvciBudWxsLlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLCBvciBudWxsLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgLSBuYW1lOiBUaGUgb3JpZ2luYWwgaWRlbnRpZmllciwgb3IgbnVsbC5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5vcmlnaW5hbFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX29yaWdpbmFsUG9zaXRpb25Gb3IoYUFyZ3MpIHtcbiAgICB2YXIgbmVlZGxlID0ge1xuICAgICAgZ2VuZXJhdGVkTGluZTogdXRpbC5nZXRBcmcoYUFyZ3MsICdsaW5lJyksXG4gICAgICBnZW5lcmF0ZWRDb2x1bW46IHV0aWwuZ2V0QXJnKGFBcmdzLCAnY29sdW1uJylcbiAgICB9O1xuXG4gICAgLy8gRmluZCB0aGUgc2VjdGlvbiBjb250YWluaW5nIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb24gd2UncmUgdHJ5aW5nIHRvIG1hcFxuICAgIC8vIHRvIGFuIG9yaWdpbmFsIHBvc2l0aW9uLlxuICAgIHZhciBzZWN0aW9uSW5kZXggPSBiaW5hcnlTZWFyY2guc2VhcmNoKG5lZWRsZSwgdGhpcy5fc2VjdGlvbnMsXG4gICAgICBmdW5jdGlvbihuZWVkbGUsIHNlY3Rpb24pIHtcbiAgICAgICAgdmFyIGNtcCA9IG5lZWRsZS5nZW5lcmF0ZWRMaW5lIC0gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZTtcbiAgICAgICAgaWYgKGNtcCkge1xuICAgICAgICAgIHJldHVybiBjbXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKG5lZWRsZS5nZW5lcmF0ZWRDb2x1bW4gLVxuICAgICAgICAgICAgICAgIHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZENvbHVtbik7XG4gICAgICB9KTtcbiAgICB2YXIgc2VjdGlvbiA9IHRoaXMuX3NlY3Rpb25zW3NlY3Rpb25JbmRleF07XG5cbiAgICBpZiAoIXNlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNvdXJjZTogbnVsbCxcbiAgICAgICAgbGluZTogbnVsbCxcbiAgICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgICBuYW1lOiBudWxsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBzZWN0aW9uLmNvbnN1bWVyLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe1xuICAgICAgbGluZTogbmVlZGxlLmdlbmVyYXRlZExpbmUgLVxuICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSAtIDEpLFxuICAgICAgY29sdW1uOiBuZWVkbGUuZ2VuZXJhdGVkQ29sdW1uIC1cbiAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgPT09IG5lZWRsZS5nZW5lcmF0ZWRMaW5lXG4gICAgICAgICA/IHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZENvbHVtbiAtIDFcbiAgICAgICAgIDogMCksXG4gICAgICBiaWFzOiBhQXJncy5iaWFzXG4gICAgfSk7XG4gIH07XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgd2UgaGF2ZSB0aGUgc291cmNlIGNvbnRlbnQgZm9yIGV2ZXJ5IHNvdXJjZSBpbiB0aGUgc291cmNlXG4gKiBtYXAsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5oYXNDb250ZW50c09mQWxsU291cmNlcyA9XG4gIGZ1bmN0aW9uIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcl9oYXNDb250ZW50c09mQWxsU291cmNlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VjdGlvbnMuZXZlcnkoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLmNvbnN1bWVyLmhhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzKCk7XG4gICAgfSk7XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgb3JpZ2luYWwgc291cmNlIGNvbnRlbnQuIFRoZSBvbmx5IGFyZ3VtZW50IGlzIHRoZSB1cmwgb2YgdGhlXG4gKiBvcmlnaW5hbCBzb3VyY2UgZmlsZS4gUmV0dXJucyBudWxsIGlmIG5vIG9yaWdpbmFsIHNvdXJjZSBjb250ZW50IGlzXG4gKiBhdmFpbGFibGUuXG4gKi9cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuc291cmNlQ29udGVudEZvciA9XG4gIGZ1bmN0aW9uIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcl9zb3VyY2VDb250ZW50Rm9yKGFTb3VyY2UsIG51bGxPbk1pc3NpbmcpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3NlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc2VjdGlvbiA9IHRoaXMuX3NlY3Rpb25zW2ldO1xuXG4gICAgICB2YXIgY29udGVudCA9IHNlY3Rpb24uY29uc3VtZXIuc291cmNlQ29udGVudEZvcihhU291cmNlLCB0cnVlKTtcbiAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobnVsbE9uTWlzc2luZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBhU291cmNlICsgJ1wiIGlzIG5vdCBpbiB0aGUgU291cmNlTWFwLicpO1xuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBnZW5lcmF0ZWQgbGluZSBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgb3JpZ2luYWwgc291cmNlLFxuICogbGluZSwgYW5kIGNvbHVtbiBwb3NpdGlvbnMgcHJvdmlkZWQuIFRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIG9iamVjdCB3aXRoXG4gKiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIGZpbGVuYW1lIG9mIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLlxuICpcbiAqIGFuZCBhbiBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmdlbmVyYXRlZFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX2dlbmVyYXRlZFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlY3Rpb24gPSB0aGlzLl9zZWN0aW9uc1tpXTtcblxuICAgICAgLy8gT25seSBjb25zaWRlciB0aGlzIHNlY3Rpb24gaWYgdGhlIHJlcXVlc3RlZCBzb3VyY2UgaXMgaW4gdGhlIGxpc3Qgb2ZcbiAgICAgIC8vIHNvdXJjZXMgb2YgdGhlIGNvbnN1bWVyLlxuICAgICAgaWYgKHNlY3Rpb24uY29uc3VtZXIuc291cmNlcy5pbmRleE9mKHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJykpID09PSAtMSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHZhciBnZW5lcmF0ZWRQb3NpdGlvbiA9IHNlY3Rpb24uY29uc3VtZXIuZ2VuZXJhdGVkUG9zaXRpb25Gb3IoYUFyZ3MpO1xuICAgICAgaWYgKGdlbmVyYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgIHZhciByZXQgPSB7XG4gICAgICAgICAgbGluZTogZ2VuZXJhdGVkUG9zaXRpb24ubGluZSArXG4gICAgICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSAtIDEpLFxuICAgICAgICAgIGNvbHVtbjogZ2VuZXJhdGVkUG9zaXRpb24uY29sdW1uICtcbiAgICAgICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lID09PSBnZW5lcmF0ZWRQb3NpdGlvbi5saW5lXG4gICAgICAgICAgICAgPyBzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRDb2x1bW4gLSAxXG4gICAgICAgICAgICAgOiAwKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBsaW5lOiBudWxsLFxuICAgICAgY29sdW1uOiBudWxsXG4gICAgfTtcbiAgfTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgbWFwcGluZ3MgaW4gYSBzdHJpbmcgaW4gdG8gYSBkYXRhIHN0cnVjdHVyZSB3aGljaCB3ZSBjYW4gZWFzaWx5XG4gKiBxdWVyeSAodGhlIG9yZGVyZWQgYXJyYXlzIGluIHRoZSBgdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzYCBhbmRcbiAqIGB0aGlzLl9fb3JpZ2luYWxNYXBwaW5nc2AgcHJvcGVydGllcykuXG4gKi9cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX3BhcnNlTWFwcGluZ3MgPVxuICBmdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXJfcGFyc2VNYXBwaW5ncyhhU3RyLCBhU291cmNlUm9vdCkge1xuICAgIHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IFtdO1xuICAgIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlY3Rpb24gPSB0aGlzLl9zZWN0aW9uc1tpXTtcbiAgICAgIHZhciBzZWN0aW9uTWFwcGluZ3MgPSBzZWN0aW9uLmNvbnN1bWVyLl9nZW5lcmF0ZWRNYXBwaW5ncztcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2VjdGlvbk1hcHBpbmdzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBtYXBwaW5nID0gc2VjdGlvbk1hcHBpbmdzW2pdO1xuXG4gICAgICAgIHZhciBzb3VyY2UgPSBzZWN0aW9uLmNvbnN1bWVyLl9zb3VyY2VzLmF0KG1hcHBpbmcuc291cmNlKTtcbiAgICAgICAgaWYgKHNlY3Rpb24uY29uc3VtZXIuc291cmNlUm9vdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHNvdXJjZSA9IHV0aWwuam9pbihzZWN0aW9uLmNvbnN1bWVyLnNvdXJjZVJvb3QsIHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgICAgc291cmNlID0gdGhpcy5fc291cmNlcy5pbmRleE9mKHNvdXJjZSk7XG5cbiAgICAgICAgdmFyIG5hbWUgPSBzZWN0aW9uLmNvbnN1bWVyLl9uYW1lcy5hdChtYXBwaW5nLm5hbWUpO1xuICAgICAgICB0aGlzLl9uYW1lcy5hZGQobmFtZSk7XG4gICAgICAgIG5hbWUgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuXG4gICAgICAgIC8vIFRoZSBtYXBwaW5ncyBjb21pbmcgZnJvbSB0aGUgY29uc3VtZXIgZm9yIHRoZSBzZWN0aW9uIGhhdmVcbiAgICAgICAgLy8gZ2VuZXJhdGVkIHBvc2l0aW9ucyByZWxhdGl2ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHNlY3Rpb24sIHNvIHdlXG4gICAgICAgIC8vIG5lZWQgdG8gb2Zmc2V0IHRoZW0gdG8gYmUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IG9mIHRoZSBjb25jYXRlbmF0ZWRcbiAgICAgICAgLy8gZ2VuZXJhdGVkIGZpbGUuXG4gICAgICAgIHZhciBhZGp1c3RlZE1hcHBpbmcgPSB7XG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgZ2VuZXJhdGVkTGluZTogbWFwcGluZy5nZW5lcmF0ZWRMaW5lICtcbiAgICAgICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lIC0gMSksXG4gICAgICAgICAgZ2VuZXJhdGVkQ29sdW1uOiBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbiArXG4gICAgICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSA9PT0gbWFwcGluZy5nZW5lcmF0ZWRMaW5lXG4gICAgICAgICAgICA/IHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZENvbHVtbiAtIDFcbiAgICAgICAgICAgIDogMCksXG4gICAgICAgICAgb3JpZ2luYWxMaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgICBvcmlnaW5hbENvbHVtbjogbWFwcGluZy5vcmlnaW5hbENvbHVtbixcbiAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzLnB1c2goYWRqdXN0ZWRNYXBwaW5nKTtcbiAgICAgICAgaWYgKHR5cGVvZiBhZGp1c3RlZE1hcHBpbmcub3JpZ2luYWxMaW5lID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzLnB1c2goYWRqdXN0ZWRNYXBwaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHF1aWNrU29ydCh0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQpO1xuICAgIHF1aWNrU29ydCh0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncywgdXRpbC5jb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyk7XG4gIH07XG5cbmV4cG9ydHMuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyID0gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyO1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgYmFzZTY0VkxRID0gcmVxdWlyZSgnLi9iYXNlNjQtdmxxJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIEFycmF5U2V0ID0gcmVxdWlyZSgnLi9hcnJheS1zZXQnKS5BcnJheVNldDtcbnZhciBNYXBwaW5nTGlzdCA9IHJlcXVpcmUoJy4vbWFwcGluZy1saXN0JykuTWFwcGluZ0xpc3Q7XG5cbi8qKlxuICogQW4gaW5zdGFuY2Ugb2YgdGhlIFNvdXJjZU1hcEdlbmVyYXRvciByZXByZXNlbnRzIGEgc291cmNlIG1hcCB3aGljaCBpc1xuICogYmVpbmcgYnVpbHQgaW5jcmVtZW50YWxseS4gWW91IG1heSBwYXNzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmdcbiAqIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGZpbGU6IFRoZSBmaWxlbmFtZSBvZiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS5cbiAqICAgLSBzb3VyY2VSb290OiBBIHJvb3QgZm9yIGFsbCByZWxhdGl2ZSBVUkxzIGluIHRoaXMgc291cmNlIG1hcC5cbiAqL1xuZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yKGFBcmdzKSB7XG4gIGlmICghYUFyZ3MpIHtcbiAgICBhQXJncyA9IHt9O1xuICB9XG4gIHRoaXMuX2ZpbGUgPSB1dGlsLmdldEFyZyhhQXJncywgJ2ZpbGUnLCBudWxsKTtcbiAgdGhpcy5fc291cmNlUm9vdCA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlUm9vdCcsIG51bGwpO1xuICB0aGlzLl9za2lwVmFsaWRhdGlvbiA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc2tpcFZhbGlkYXRpb24nLCBmYWxzZSk7XG4gIHRoaXMuX3NvdXJjZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbmFtZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbWFwcGluZ3MgPSBuZXcgTWFwcGluZ0xpc3QoKTtcbiAgdGhpcy5fc291cmNlc0NvbnRlbnRzID0gbnVsbDtcbn1cblxuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IgYmFzZWQgb24gYSBTb3VyY2VNYXBDb25zdW1lclxuICpcbiAqIEBwYXJhbSBhU291cmNlTWFwQ29uc3VtZXIgVGhlIFNvdXJjZU1hcC5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLmZyb21Tb3VyY2VNYXAgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfZnJvbVNvdXJjZU1hcChhU291cmNlTWFwQ29uc3VtZXIpIHtcbiAgICB2YXIgc291cmNlUm9vdCA9IGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VSb290O1xuICAgIHZhciBnZW5lcmF0b3IgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHtcbiAgICAgIGZpbGU6IGFTb3VyY2VNYXBDb25zdW1lci5maWxlLFxuICAgICAgc291cmNlUm9vdDogc291cmNlUm9vdFxuICAgIH0pO1xuICAgIGFTb3VyY2VNYXBDb25zdW1lci5lYWNoTWFwcGluZyhmdW5jdGlvbiAobWFwcGluZykge1xuICAgICAgdmFyIG5ld01hcHBpbmcgPSB7XG4gICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgIGxpbmU6IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSxcbiAgICAgICAgICBjb2x1bW46IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIG5ld01hcHBpbmcuc291cmNlID0gbWFwcGluZy5zb3VyY2U7XG4gICAgICAgIGlmIChzb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgICBuZXdNYXBwaW5nLnNvdXJjZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgbmV3TWFwcGluZy5zb3VyY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3TWFwcGluZy5vcmlnaW5hbCA9IHtcbiAgICAgICAgICBsaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgICBjb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW5cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAobWFwcGluZy5uYW1lICE9IG51bGwpIHtcbiAgICAgICAgICBuZXdNYXBwaW5nLm5hbWUgPSBtYXBwaW5nLm5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2VuZXJhdG9yLmFkZE1hcHBpbmcobmV3TWFwcGluZyk7XG4gICAgfSk7XG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlRmlsZSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlQ29udGVudEZvcihzb3VyY2VGaWxlKTtcbiAgICAgIGlmIChjb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgZ2VuZXJhdG9yLnNldFNvdXJjZUNvbnRlbnQoc291cmNlRmlsZSwgY29udGVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfTtcblxuLyoqXG4gKiBBZGQgYSBzaW5nbGUgbWFwcGluZyBmcm9tIG9yaWdpbmFsIHNvdXJjZSBsaW5lIGFuZCBjb2x1bW4gdG8gdGhlIGdlbmVyYXRlZFxuICogc291cmNlJ3MgbGluZSBhbmQgY29sdW1uIGZvciB0aGlzIHNvdXJjZSBtYXAgYmVpbmcgY3JlYXRlZC4gVGhlIG1hcHBpbmdcbiAqIG9iamVjdCBzaG91bGQgaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGdlbmVyYXRlZDogQW4gb2JqZWN0IHdpdGggdGhlIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4gcG9zaXRpb25zLlxuICogICAtIG9yaWdpbmFsOiBBbiBvYmplY3Qgd2l0aCB0aGUgb3JpZ2luYWwgbGluZSBhbmQgY29sdW1uIHBvc2l0aW9ucy5cbiAqICAgLSBzb3VyY2U6IFRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZSAocmVsYXRpdmUgdG8gdGhlIHNvdXJjZVJvb3QpLlxuICogICAtIG5hbWU6IEFuIG9wdGlvbmFsIG9yaWdpbmFsIHRva2VuIG5hbWUgZm9yIHRoaXMgbWFwcGluZy5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5hZGRNYXBwaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX2FkZE1hcHBpbmcoYUFyZ3MpIHtcbiAgICB2YXIgZ2VuZXJhdGVkID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdnZW5lcmF0ZWQnKTtcbiAgICB2YXIgb3JpZ2luYWwgPSB1dGlsLmdldEFyZyhhQXJncywgJ29yaWdpbmFsJywgbnVsbCk7XG4gICAgdmFyIHNvdXJjZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJywgbnVsbCk7XG4gICAgdmFyIG5hbWUgPSB1dGlsLmdldEFyZyhhQXJncywgJ25hbWUnLCBudWxsKTtcblxuICAgIGlmICghdGhpcy5fc2tpcFZhbGlkYXRpb24pIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlTWFwcGluZyhnZW5lcmF0ZWQsIG9yaWdpbmFsLCBzb3VyY2UsIG5hbWUpO1xuICAgIH1cblxuICAgIGlmIChzb3VyY2UgIT0gbnVsbCkge1xuICAgICAgc291cmNlID0gU3RyaW5nKHNvdXJjZSk7XG4gICAgICBpZiAoIXRoaXMuX3NvdXJjZXMuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgdGhpcy5fc291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICAgICAgaWYgKCF0aGlzLl9uYW1lcy5oYXMobmFtZSkpIHtcbiAgICAgICAgdGhpcy5fbmFtZXMuYWRkKG5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX21hcHBpbmdzLmFkZCh7XG4gICAgICBnZW5lcmF0ZWRMaW5lOiBnZW5lcmF0ZWQubGluZSxcbiAgICAgIGdlbmVyYXRlZENvbHVtbjogZ2VuZXJhdGVkLmNvbHVtbixcbiAgICAgIG9yaWdpbmFsTGluZTogb3JpZ2luYWwgIT0gbnVsbCAmJiBvcmlnaW5hbC5saW5lLFxuICAgICAgb3JpZ2luYWxDb2x1bW46IG9yaWdpbmFsICE9IG51bGwgJiYgb3JpZ2luYWwuY29sdW1uLFxuICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfSk7XG4gIH07XG5cbi8qKlxuICogU2V0IHRoZSBzb3VyY2UgY29udGVudCBmb3IgYSBzb3VyY2UgZmlsZS5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5zZXRTb3VyY2VDb250ZW50ID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3NldFNvdXJjZUNvbnRlbnQoYVNvdXJjZUZpbGUsIGFTb3VyY2VDb250ZW50KSB7XG4gICAgdmFyIHNvdXJjZSA9IGFTb3VyY2VGaWxlO1xuICAgIGlmICh0aGlzLl9zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIHNvdXJjZSA9IHV0aWwucmVsYXRpdmUodGhpcy5fc291cmNlUm9vdCwgc291cmNlKTtcbiAgICB9XG5cbiAgICBpZiAoYVNvdXJjZUNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgLy8gQWRkIHRoZSBzb3VyY2UgY29udGVudCB0byB0aGUgX3NvdXJjZXNDb250ZW50cyBtYXAuXG4gICAgICAvLyBDcmVhdGUgYSBuZXcgX3NvdXJjZXNDb250ZW50cyBtYXAgaWYgdGhlIHByb3BlcnR5IGlzIG51bGwuXG4gICAgICBpZiAoIXRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgICB0aGlzLl9zb3VyY2VzQ29udGVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgfVxuICAgICAgdGhpcy5fc291cmNlc0NvbnRlbnRzW3V0aWwudG9TZXRTdHJpbmcoc291cmNlKV0gPSBhU291cmNlQ29udGVudDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBzb3VyY2UgZmlsZSBmcm9tIHRoZSBfc291cmNlc0NvbnRlbnRzIG1hcC5cbiAgICAgIC8vIElmIHRoZSBfc291cmNlc0NvbnRlbnRzIG1hcCBpcyBlbXB0eSwgc2V0IHRoZSBwcm9wZXJ0eSB0byBudWxsLlxuICAgICAgZGVsZXRlIHRoaXMuX3NvdXJjZXNDb250ZW50c1t1dGlsLnRvU2V0U3RyaW5nKHNvdXJjZSldO1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuX3NvdXJjZXNDb250ZW50cykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX3NvdXJjZXNDb250ZW50cyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIEFwcGxpZXMgdGhlIG1hcHBpbmdzIG9mIGEgc3ViLXNvdXJjZS1tYXAgZm9yIGEgc3BlY2lmaWMgc291cmNlIGZpbGUgdG8gdGhlXG4gKiBzb3VyY2UgbWFwIGJlaW5nIGdlbmVyYXRlZC4gRWFjaCBtYXBwaW5nIHRvIHRoZSBzdXBwbGllZCBzb3VyY2UgZmlsZSBpc1xuICogcmV3cml0dGVuIHVzaW5nIHRoZSBzdXBwbGllZCBzb3VyY2UgbWFwLiBOb3RlOiBUaGUgcmVzb2x1dGlvbiBmb3IgdGhlXG4gKiByZXN1bHRpbmcgbWFwcGluZ3MgaXMgdGhlIG1pbmltaXVtIG9mIHRoaXMgbWFwIGFuZCB0aGUgc3VwcGxpZWQgbWFwLlxuICpcbiAqIEBwYXJhbSBhU291cmNlTWFwQ29uc3VtZXIgVGhlIHNvdXJjZSBtYXAgdG8gYmUgYXBwbGllZC5cbiAqIEBwYXJhbSBhU291cmNlRmlsZSBPcHRpb25hbC4gVGhlIGZpbGVuYW1lIG9mIHRoZSBzb3VyY2UgZmlsZS5cbiAqICAgICAgICBJZiBvbWl0dGVkLCBTb3VyY2VNYXBDb25zdW1lcidzIGZpbGUgcHJvcGVydHkgd2lsbCBiZSB1c2VkLlxuICogQHBhcmFtIGFTb3VyY2VNYXBQYXRoIE9wdGlvbmFsLiBUaGUgZGlybmFtZSBvZiB0aGUgcGF0aCB0byB0aGUgc291cmNlIG1hcFxuICogICAgICAgIHRvIGJlIGFwcGxpZWQuIElmIHJlbGF0aXZlLCBpdCBpcyByZWxhdGl2ZSB0byB0aGUgU291cmNlTWFwQ29uc3VtZXIuXG4gKiAgICAgICAgVGhpcyBwYXJhbWV0ZXIgaXMgbmVlZGVkIHdoZW4gdGhlIHR3byBzb3VyY2UgbWFwcyBhcmVuJ3QgaW4gdGhlIHNhbWVcbiAqICAgICAgICBkaXJlY3RvcnksIGFuZCB0aGUgc291cmNlIG1hcCB0byBiZSBhcHBsaWVkIGNvbnRhaW5zIHJlbGF0aXZlIHNvdXJjZVxuICogICAgICAgIHBhdGhzLiBJZiBzbywgdGhvc2UgcmVsYXRpdmUgc291cmNlIHBhdGhzIG5lZWQgdG8gYmUgcmV3cml0dGVuXG4gKiAgICAgICAgcmVsYXRpdmUgdG8gdGhlIFNvdXJjZU1hcEdlbmVyYXRvci5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5hcHBseVNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl9hcHBseVNvdXJjZU1hcChhU291cmNlTWFwQ29uc3VtZXIsIGFTb3VyY2VGaWxlLCBhU291cmNlTWFwUGF0aCkge1xuICAgIHZhciBzb3VyY2VGaWxlID0gYVNvdXJjZUZpbGU7XG4gICAgLy8gSWYgYVNvdXJjZUZpbGUgaXMgb21pdHRlZCwgd2Ugd2lsbCB1c2UgdGhlIGZpbGUgcHJvcGVydHkgb2YgdGhlIFNvdXJjZU1hcFxuICAgIGlmIChhU291cmNlRmlsZSA9PSBudWxsKSB7XG4gICAgICBpZiAoYVNvdXJjZU1hcENvbnN1bWVyLmZpbGUgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1NvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUuYXBwbHlTb3VyY2VNYXAgcmVxdWlyZXMgZWl0aGVyIGFuIGV4cGxpY2l0IHNvdXJjZSBmaWxlLCAnICtcbiAgICAgICAgICAnb3IgdGhlIHNvdXJjZSBtYXBcXCdzIFwiZmlsZVwiIHByb3BlcnR5LiBCb3RoIHdlcmUgb21pdHRlZC4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBzb3VyY2VGaWxlID0gYVNvdXJjZU1hcENvbnN1bWVyLmZpbGU7XG4gICAgfVxuICAgIHZhciBzb3VyY2VSb290ID0gdGhpcy5fc291cmNlUm9vdDtcbiAgICAvLyBNYWtlIFwic291cmNlRmlsZVwiIHJlbGF0aXZlIGlmIGFuIGFic29sdXRlIFVybCBpcyBwYXNzZWQuXG4gICAgaWYgKHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgc291cmNlRmlsZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlRmlsZSk7XG4gICAgfVxuICAgIC8vIEFwcGx5aW5nIHRoZSBTb3VyY2VNYXAgY2FuIGFkZCBhbmQgcmVtb3ZlIGl0ZW1zIGZyb20gdGhlIHNvdXJjZXMgYW5kXG4gICAgLy8gdGhlIG5hbWVzIGFycmF5LlxuICAgIHZhciBuZXdTb3VyY2VzID0gbmV3IEFycmF5U2V0KCk7XG4gICAgdmFyIG5ld05hbWVzID0gbmV3IEFycmF5U2V0KCk7XG5cbiAgICAvLyBGaW5kIG1hcHBpbmdzIGZvciB0aGUgXCJzb3VyY2VGaWxlXCJcbiAgICB0aGlzLl9tYXBwaW5ncy51bnNvcnRlZEZvckVhY2goZnVuY3Rpb24gKG1hcHBpbmcpIHtcbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSA9PT0gc291cmNlRmlsZSAmJiBtYXBwaW5nLm9yaWdpbmFsTGluZSAhPSBudWxsKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIGl0IGNhbiBiZSBtYXBwZWQgYnkgdGhlIHNvdXJjZSBtYXAsIHRoZW4gdXBkYXRlIHRoZSBtYXBwaW5nLlxuICAgICAgICB2YXIgb3JpZ2luYWwgPSBhU291cmNlTWFwQ29uc3VtZXIub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgICAgICAgbGluZTogbWFwcGluZy5vcmlnaW5hbExpbmUsXG4gICAgICAgICAgY29sdW1uOiBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAob3JpZ2luYWwuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgICAvLyBDb3B5IG1hcHBpbmdcbiAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IG9yaWdpbmFsLnNvdXJjZTtcbiAgICAgICAgICBpZiAoYVNvdXJjZU1hcFBhdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgbWFwcGluZy5zb3VyY2UgPSB1dGlsLmpvaW4oYVNvdXJjZU1hcFBhdGgsIG1hcHBpbmcuc291cmNlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgbWFwcGluZy5zb3VyY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsTGluZSA9IG9yaWdpbmFsLmxpbmU7XG4gICAgICAgICAgbWFwcGluZy5vcmlnaW5hbENvbHVtbiA9IG9yaWdpbmFsLmNvbHVtbjtcbiAgICAgICAgICBpZiAob3JpZ2luYWwubmFtZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXBwaW5nLm5hbWUgPSBvcmlnaW5hbC5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgc291cmNlID0gbWFwcGluZy5zb3VyY2U7XG4gICAgICBpZiAoc291cmNlICE9IG51bGwgJiYgIW5ld1NvdXJjZXMuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgbmV3U291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5hbWUgPSBtYXBwaW5nLm5hbWU7XG4gICAgICBpZiAobmFtZSAhPSBudWxsICYmICFuZXdOYW1lcy5oYXMobmFtZSkpIHtcbiAgICAgICAgbmV3TmFtZXMuYWRkKG5hbWUpO1xuICAgICAgfVxuXG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5fc291cmNlcyA9IG5ld1NvdXJjZXM7XG4gICAgdGhpcy5fbmFtZXMgPSBuZXdOYW1lcztcblxuICAgIC8vIENvcHkgc291cmNlc0NvbnRlbnRzIG9mIGFwcGxpZWQgbWFwLlxuICAgIGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZUZpbGUpIHtcbiAgICAgIHZhciBjb250ZW50ID0gYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZUNvbnRlbnRGb3Ioc291cmNlRmlsZSk7XG4gICAgICBpZiAoY29udGVudCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChhU291cmNlTWFwUGF0aCAhPSBudWxsKSB7XG4gICAgICAgICAgc291cmNlRmlsZSA9IHV0aWwuam9pbihhU291cmNlTWFwUGF0aCwgc291cmNlRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICAgIHNvdXJjZUZpbGUgPSB1dGlsLnJlbGF0aXZlKHNvdXJjZVJvb3QsIHNvdXJjZUZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U291cmNlQ29udGVudChzb3VyY2VGaWxlLCBjb250ZW50KTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuLyoqXG4gKiBBIG1hcHBpbmcgY2FuIGhhdmUgb25lIG9mIHRoZSB0aHJlZSBsZXZlbHMgb2YgZGF0YTpcbiAqXG4gKiAgIDEuIEp1c3QgdGhlIGdlbmVyYXRlZCBwb3NpdGlvbi5cbiAqICAgMi4gVGhlIEdlbmVyYXRlZCBwb3NpdGlvbiwgb3JpZ2luYWwgcG9zaXRpb24sIGFuZCBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIDMuIEdlbmVyYXRlZCBhbmQgb3JpZ2luYWwgcG9zaXRpb24sIG9yaWdpbmFsIHNvdXJjZSwgYXMgd2VsbCBhcyBhIG5hbWVcbiAqICAgICAgdG9rZW4uXG4gKlxuICogVG8gbWFpbnRhaW4gY29uc2lzdGVuY3ksIHdlIHZhbGlkYXRlIHRoYXQgYW55IG5ldyBtYXBwaW5nIGJlaW5nIGFkZGVkIGZhbGxzXG4gKiBpbiB0byBvbmUgb2YgdGhlc2UgY2F0ZWdvcmllcy5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fdmFsaWRhdGVNYXBwaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3ZhbGlkYXRlTWFwcGluZyhhR2VuZXJhdGVkLCBhT3JpZ2luYWwsIGFTb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYU5hbWUpIHtcbiAgICBpZiAoYUdlbmVyYXRlZCAmJiAnbGluZScgaW4gYUdlbmVyYXRlZCAmJiAnY29sdW1uJyBpbiBhR2VuZXJhdGVkXG4gICAgICAgICYmIGFHZW5lcmF0ZWQubGluZSA+IDAgJiYgYUdlbmVyYXRlZC5jb2x1bW4gPj0gMFxuICAgICAgICAmJiAhYU9yaWdpbmFsICYmICFhU291cmNlICYmICFhTmFtZSkge1xuICAgICAgLy8gQ2FzZSAxLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIGlmIChhR2VuZXJhdGVkICYmICdsaW5lJyBpbiBhR2VuZXJhdGVkICYmICdjb2x1bW4nIGluIGFHZW5lcmF0ZWRcbiAgICAgICAgICAgICAmJiBhT3JpZ2luYWwgJiYgJ2xpbmUnIGluIGFPcmlnaW5hbCAmJiAnY29sdW1uJyBpbiBhT3JpZ2luYWxcbiAgICAgICAgICAgICAmJiBhR2VuZXJhdGVkLmxpbmUgPiAwICYmIGFHZW5lcmF0ZWQuY29sdW1uID49IDBcbiAgICAgICAgICAgICAmJiBhT3JpZ2luYWwubGluZSA+IDAgJiYgYU9yaWdpbmFsLmNvbHVtbiA+PSAwXG4gICAgICAgICAgICAgJiYgYVNvdXJjZSkge1xuICAgICAgLy8gQ2FzZXMgMiBhbmQgMy5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbWFwcGluZzogJyArIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgZ2VuZXJhdGVkOiBhR2VuZXJhdGVkLFxuICAgICAgICBzb3VyY2U6IGFTb3VyY2UsXG4gICAgICAgIG9yaWdpbmFsOiBhT3JpZ2luYWwsXG4gICAgICAgIG5hbWU6IGFOYW1lXG4gICAgICB9KSk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFNlcmlhbGl6ZSB0aGUgYWNjdW11bGF0ZWQgbWFwcGluZ3MgaW4gdG8gdGhlIHN0cmVhbSBvZiBiYXNlIDY0IFZMUXNcbiAqIHNwZWNpZmllZCBieSB0aGUgc291cmNlIG1hcCBmb3JtYXQuXG4gKi9cblNvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUuX3NlcmlhbGl6ZU1hcHBpbmdzID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3NlcmlhbGl6ZU1hcHBpbmdzKCkge1xuICAgIHZhciBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgdmFyIHByZXZpb3VzR2VuZXJhdGVkTGluZSA9IDE7XG4gICAgdmFyIHByZXZpb3VzT3JpZ2luYWxDb2x1bW4gPSAwO1xuICAgIHZhciBwcmV2aW91c09yaWdpbmFsTGluZSA9IDA7XG4gICAgdmFyIHByZXZpb3VzTmFtZSA9IDA7XG4gICAgdmFyIHByZXZpb3VzU291cmNlID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIG5leHQ7XG4gICAgdmFyIG1hcHBpbmc7XG4gICAgdmFyIG5hbWVJZHg7XG4gICAgdmFyIHNvdXJjZUlkeDtcblxuICAgIHZhciBtYXBwaW5ncyA9IHRoaXMuX21hcHBpbmdzLnRvQXJyYXkoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbWFwcGluZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG1hcHBpbmcgPSBtYXBwaW5nc1tpXTtcbiAgICAgIG5leHQgPSAnJ1xuXG4gICAgICBpZiAobWFwcGluZy5nZW5lcmF0ZWRMaW5lICE9PSBwcmV2aW91c0dlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICAgICAgICB3aGlsZSAobWFwcGluZy5nZW5lcmF0ZWRMaW5lICE9PSBwcmV2aW91c0dlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgICBuZXh0ICs9ICc7JztcbiAgICAgICAgICBwcmV2aW91c0dlbmVyYXRlZExpbmUrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgIGlmICghdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZChtYXBwaW5nLCBtYXBwaW5nc1tpIC0gMV0pKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dCArPSAnLCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uKTtcbiAgICAgIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uID0gbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW47XG5cbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIHNvdXJjZUlkeCA9IHRoaXMuX3NvdXJjZXMuaW5kZXhPZihtYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIG5leHQgKz0gYmFzZTY0VkxRLmVuY29kZShzb3VyY2VJZHggLSBwcmV2aW91c1NvdXJjZSk7XG4gICAgICAgIHByZXZpb3VzU291cmNlID0gc291cmNlSWR4O1xuXG4gICAgICAgIC8vIGxpbmVzIGFyZSBzdG9yZWQgMC1iYXNlZCBpbiBTb3VyY2VNYXAgc3BlYyB2ZXJzaW9uIDNcbiAgICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKG1hcHBpbmcub3JpZ2luYWxMaW5lIC0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIHByZXZpb3VzT3JpZ2luYWxMaW5lKTtcbiAgICAgICAgcHJldmlvdXNPcmlnaW5hbExpbmUgPSBtYXBwaW5nLm9yaWdpbmFsTGluZSAtIDE7XG5cbiAgICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKG1hcHBpbmcub3JpZ2luYWxDb2x1bW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBwcmV2aW91c09yaWdpbmFsQ29sdW1uKTtcbiAgICAgICAgcHJldmlvdXNPcmlnaW5hbENvbHVtbiA9IG1hcHBpbmcub3JpZ2luYWxDb2x1bW47XG5cbiAgICAgICAgaWYgKG1hcHBpbmcubmFtZSAhPSBudWxsKSB7XG4gICAgICAgICAgbmFtZUlkeCA9IHRoaXMuX25hbWVzLmluZGV4T2YobWFwcGluZy5uYW1lKTtcbiAgICAgICAgICBuZXh0ICs9IGJhc2U2NFZMUS5lbmNvZGUobmFtZUlkeCAtIHByZXZpb3VzTmFtZSk7XG4gICAgICAgICAgcHJldmlvdXNOYW1lID0gbmFtZUlkeDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXN1bHQgKz0gbmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLl9nZW5lcmF0ZVNvdXJjZXNDb250ZW50ID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX2dlbmVyYXRlU291cmNlc0NvbnRlbnQoYVNvdXJjZXMsIGFTb3VyY2VSb290KSB7XG4gICAgcmV0dXJuIGFTb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICBpZiAoIXRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChhU291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgIHNvdXJjZSA9IHV0aWwucmVsYXRpdmUoYVNvdXJjZVJvb3QsIHNvdXJjZSk7XG4gICAgICB9XG4gICAgICB2YXIga2V5ID0gdXRpbC50b1NldFN0cmluZyhzb3VyY2UpO1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLl9zb3VyY2VzQ29udGVudHMsIGtleSlcbiAgICAgICAgPyB0aGlzLl9zb3VyY2VzQ29udGVudHNba2V5XVxuICAgICAgICA6IG51bGw7XG4gICAgfSwgdGhpcyk7XG4gIH07XG5cbi8qKlxuICogRXh0ZXJuYWxpemUgdGhlIHNvdXJjZSBtYXAuXG4gKi9cblNvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUudG9KU09OID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3RvSlNPTigpIHtcbiAgICB2YXIgbWFwID0ge1xuICAgICAgdmVyc2lvbjogdGhpcy5fdmVyc2lvbixcbiAgICAgIHNvdXJjZXM6IHRoaXMuX3NvdXJjZXMudG9BcnJheSgpLFxuICAgICAgbmFtZXM6IHRoaXMuX25hbWVzLnRvQXJyYXkoKSxcbiAgICAgIG1hcHBpbmdzOiB0aGlzLl9zZXJpYWxpemVNYXBwaW5ncygpXG4gICAgfTtcbiAgICBpZiAodGhpcy5fZmlsZSAhPSBudWxsKSB7XG4gICAgICBtYXAuZmlsZSA9IHRoaXMuX2ZpbGU7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIG1hcC5zb3VyY2VSb290ID0gdGhpcy5fc291cmNlUm9vdDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgbWFwLnNvdXJjZXNDb250ZW50ID0gdGhpcy5fZ2VuZXJhdGVTb3VyY2VzQ29udGVudChtYXAuc291cmNlcywgbWFwLnNvdXJjZVJvb3QpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXA7XG4gIH07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBzb3VyY2UgbWFwIGJlaW5nIGdlbmVyYXRlZCB0byBhIHN0cmluZy5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS50b1N0cmluZyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl90b1N0cmluZygpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy50b0pTT04oKSk7XG4gIH07XG5cbmV4cG9ydHMuU291cmNlTWFwR2VuZXJhdG9yID0gU291cmNlTWFwR2VuZXJhdG9yO1xuIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgU291cmNlTWFwR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9zb3VyY2UtbWFwLWdlbmVyYXRvcicpLlNvdXJjZU1hcEdlbmVyYXRvcjtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8vIE1hdGNoZXMgYSBXaW5kb3dzLXN0eWxlIGBcXHJcXG5gIG5ld2xpbmUgb3IgYSBgXFxuYCBuZXdsaW5lIHVzZWQgYnkgYWxsIG90aGVyXG4vLyBvcGVyYXRpbmcgc3lzdGVtcyB0aGVzZSBkYXlzIChjYXB0dXJpbmcgdGhlIHJlc3VsdCkuXG52YXIgUkVHRVhfTkVXTElORSA9IC8oXFxyP1xcbikvO1xuXG4vLyBOZXdsaW5lIGNoYXJhY3RlciBjb2RlIGZvciBjaGFyQ29kZUF0KCkgY29tcGFyaXNvbnNcbnZhciBORVdMSU5FX0NPREUgPSAxMDtcblxuLy8gUHJpdmF0ZSBzeW1ib2wgZm9yIGlkZW50aWZ5aW5nIGBTb3VyY2VOb2RlYHMgd2hlbiBtdWx0aXBsZSB2ZXJzaW9ucyBvZlxuLy8gdGhlIHNvdXJjZS1tYXAgbGlicmFyeSBhcmUgbG9hZGVkLiBUaGlzIE1VU1QgTk9UIENIQU5HRSBhY3Jvc3Ncbi8vIHZlcnNpb25zIVxudmFyIGlzU291cmNlTm9kZSA9IFwiJCQkaXNTb3VyY2VOb2RlJCQkXCI7XG5cbi8qKlxuICogU291cmNlTm9kZXMgcHJvdmlkZSBhIHdheSB0byBhYnN0cmFjdCBvdmVyIGludGVycG9sYXRpbmcvY29uY2F0ZW5hdGluZ1xuICogc25pcHBldHMgb2YgZ2VuZXJhdGVkIEphdmFTY3JpcHQgc291cmNlIGNvZGUgd2hpbGUgbWFpbnRhaW5pbmcgdGhlIGxpbmUgYW5kXG4gKiBjb2x1bW4gaW5mb3JtYXRpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBvcmlnaW5hbCBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcGFyYW0gYUxpbmUgVGhlIG9yaWdpbmFsIGxpbmUgbnVtYmVyLlxuICogQHBhcmFtIGFDb2x1bW4gVGhlIG9yaWdpbmFsIGNvbHVtbiBudW1iZXIuXG4gKiBAcGFyYW0gYVNvdXJjZSBUaGUgb3JpZ2luYWwgc291cmNlJ3MgZmlsZW5hbWUuXG4gKiBAcGFyYW0gYUNodW5rcyBPcHRpb25hbC4gQW4gYXJyYXkgb2Ygc3RyaW5ncyB3aGljaCBhcmUgc25pcHBldHMgb2ZcbiAqICAgICAgICBnZW5lcmF0ZWQgSlMsIG9yIG90aGVyIFNvdXJjZU5vZGVzLlxuICogQHBhcmFtIGFOYW1lIFRoZSBvcmlnaW5hbCBpZGVudGlmaWVyLlxuICovXG5mdW5jdGlvbiBTb3VyY2VOb2RlKGFMaW5lLCBhQ29sdW1uLCBhU291cmNlLCBhQ2h1bmtzLCBhTmFtZSkge1xuICB0aGlzLmNoaWxkcmVuID0gW107XG4gIHRoaXMuc291cmNlQ29udGVudHMgPSB7fTtcbiAgdGhpcy5saW5lID0gYUxpbmUgPT0gbnVsbCA/IG51bGwgOiBhTGluZTtcbiAgdGhpcy5jb2x1bW4gPSBhQ29sdW1uID09IG51bGwgPyBudWxsIDogYUNvbHVtbjtcbiAgdGhpcy5zb3VyY2UgPSBhU291cmNlID09IG51bGwgPyBudWxsIDogYVNvdXJjZTtcbiAgdGhpcy5uYW1lID0gYU5hbWUgPT0gbnVsbCA/IG51bGwgOiBhTmFtZTtcbiAgdGhpc1tpc1NvdXJjZU5vZGVdID0gdHJ1ZTtcbiAgaWYgKGFDaHVua3MgIT0gbnVsbCkgdGhpcy5hZGQoYUNodW5rcyk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIFNvdXJjZU5vZGUgZnJvbSBnZW5lcmF0ZWQgY29kZSBhbmQgYSBTb3VyY2VNYXBDb25zdW1lci5cbiAqXG4gKiBAcGFyYW0gYUdlbmVyYXRlZENvZGUgVGhlIGdlbmVyYXRlZCBjb2RlXG4gKiBAcGFyYW0gYVNvdXJjZU1hcENvbnN1bWVyIFRoZSBTb3VyY2VNYXAgZm9yIHRoZSBnZW5lcmF0ZWQgY29kZVxuICogQHBhcmFtIGFSZWxhdGl2ZVBhdGggT3B0aW9uYWwuIFRoZSBwYXRoIHRoYXQgcmVsYXRpdmUgc291cmNlcyBpbiB0aGVcbiAqICAgICAgICBTb3VyY2VNYXBDb25zdW1lciBzaG91bGQgYmUgcmVsYXRpdmUgdG8uXG4gKi9cblNvdXJjZU5vZGUuZnJvbVN0cmluZ1dpdGhTb3VyY2VNYXAgPVxuICBmdW5jdGlvbiBTb3VyY2VOb2RlX2Zyb21TdHJpbmdXaXRoU291cmNlTWFwKGFHZW5lcmF0ZWRDb2RlLCBhU291cmNlTWFwQ29uc3VtZXIsIGFSZWxhdGl2ZVBhdGgpIHtcbiAgICAvLyBUaGUgU291cmNlTm9kZSB3ZSB3YW50IHRvIGZpbGwgd2l0aCB0aGUgZ2VuZXJhdGVkIGNvZGVcbiAgICAvLyBhbmQgdGhlIFNvdXJjZU1hcFxuICAgIHZhciBub2RlID0gbmV3IFNvdXJjZU5vZGUoKTtcblxuICAgIC8vIEFsbCBldmVuIGluZGljZXMgb2YgdGhpcyBhcnJheSBhcmUgb25lIGxpbmUgb2YgdGhlIGdlbmVyYXRlZCBjb2RlLFxuICAgIC8vIHdoaWxlIGFsbCBvZGQgaW5kaWNlcyBhcmUgdGhlIG5ld2xpbmVzIGJldHdlZW4gdHdvIGFkamFjZW50IGxpbmVzXG4gICAgLy8gKHNpbmNlIGBSRUdFWF9ORVdMSU5FYCBjYXB0dXJlcyBpdHMgbWF0Y2gpLlxuICAgIC8vIFByb2Nlc3NlZCBmcmFnbWVudHMgYXJlIHJlbW92ZWQgZnJvbSB0aGlzIGFycmF5LCBieSBjYWxsaW5nIGBzaGlmdE5leHRMaW5lYC5cbiAgICB2YXIgcmVtYWluaW5nTGluZXMgPSBhR2VuZXJhdGVkQ29kZS5zcGxpdChSRUdFWF9ORVdMSU5FKTtcbiAgICB2YXIgc2hpZnROZXh0TGluZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxpbmVDb250ZW50cyA9IHJlbWFpbmluZ0xpbmVzLnNoaWZ0KCk7XG4gICAgICAvLyBUaGUgbGFzdCBsaW5lIG9mIGEgZmlsZSBtaWdodCBub3QgaGF2ZSBhIG5ld2xpbmUuXG4gICAgICB2YXIgbmV3TGluZSA9IHJlbWFpbmluZ0xpbmVzLnNoaWZ0KCkgfHwgXCJcIjtcbiAgICAgIHJldHVybiBsaW5lQ29udGVudHMgKyBuZXdMaW5lO1xuICAgIH07XG5cbiAgICAvLyBXZSBuZWVkIHRvIHJlbWVtYmVyIHRoZSBwb3NpdGlvbiBvZiBcInJlbWFpbmluZ0xpbmVzXCJcbiAgICB2YXIgbGFzdEdlbmVyYXRlZExpbmUgPSAxLCBsYXN0R2VuZXJhdGVkQ29sdW1uID0gMDtcblxuICAgIC8vIFRoZSBnZW5lcmF0ZSBTb3VyY2VOb2RlcyB3ZSBuZWVkIGEgY29kZSByYW5nZS5cbiAgICAvLyBUbyBleHRyYWN0IGl0IGN1cnJlbnQgYW5kIGxhc3QgbWFwcGluZyBpcyB1c2VkLlxuICAgIC8vIEhlcmUgd2Ugc3RvcmUgdGhlIGxhc3QgbWFwcGluZy5cbiAgICB2YXIgbGFzdE1hcHBpbmcgPSBudWxsO1xuXG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLmVhY2hNYXBwaW5nKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgICBpZiAobGFzdE1hcHBpbmcgIT09IG51bGwpIHtcbiAgICAgICAgLy8gV2UgYWRkIHRoZSBjb2RlIGZyb20gXCJsYXN0TWFwcGluZ1wiIHRvIFwibWFwcGluZ1wiOlxuICAgICAgICAvLyBGaXJzdCBjaGVjayBpZiB0aGVyZSBpcyBhIG5ldyBsaW5lIGluIGJldHdlZW4uXG4gICAgICAgIGlmIChsYXN0R2VuZXJhdGVkTGluZSA8IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSkge1xuICAgICAgICAgIC8vIEFzc29jaWF0ZSBmaXJzdCBsaW5lIHdpdGggXCJsYXN0TWFwcGluZ1wiXG4gICAgICAgICAgYWRkTWFwcGluZ1dpdGhDb2RlKGxhc3RNYXBwaW5nLCBzaGlmdE5leHRMaW5lKCkpO1xuICAgICAgICAgIGxhc3RHZW5lcmF0ZWRMaW5lKys7XG4gICAgICAgICAgbGFzdEdlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgICAgICAgLy8gVGhlIHJlbWFpbmluZyBjb2RlIGlzIGFkZGVkIHdpdGhvdXQgbWFwcGluZ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZXJlIGlzIG5vIG5ldyBsaW5lIGluIGJldHdlZW4uXG4gICAgICAgICAgLy8gQXNzb2NpYXRlIHRoZSBjb2RlIGJldHdlZW4gXCJsYXN0R2VuZXJhdGVkQ29sdW1uXCIgYW5kXG4gICAgICAgICAgLy8gXCJtYXBwaW5nLmdlbmVyYXRlZENvbHVtblwiIHdpdGggXCJsYXN0TWFwcGluZ1wiXG4gICAgICAgICAgdmFyIG5leHRMaW5lID0gcmVtYWluaW5nTGluZXNbMF07XG4gICAgICAgICAgdmFyIGNvZGUgPSBuZXh0TGluZS5zdWJzdHIoMCwgbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgICAgIHJlbWFpbmluZ0xpbmVzWzBdID0gbmV4dExpbmUuc3Vic3RyKG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uIC1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uKTtcbiAgICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uID0gbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW47XG4gICAgICAgICAgYWRkTWFwcGluZ1dpdGhDb2RlKGxhc3RNYXBwaW5nLCBjb2RlKTtcbiAgICAgICAgICAvLyBObyBtb3JlIHJlbWFpbmluZyBjb2RlLCBjb250aW51ZVxuICAgICAgICAgIGxhc3RNYXBwaW5nID0gbWFwcGluZztcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIFdlIGFkZCB0aGUgZ2VuZXJhdGVkIGNvZGUgdW50aWwgdGhlIGZpcnN0IG1hcHBpbmdcbiAgICAgIC8vIHRvIHRoZSBTb3VyY2VOb2RlIHdpdGhvdXQgYW55IG1hcHBpbmcuXG4gICAgICAvLyBFYWNoIGxpbmUgaXMgYWRkZWQgYXMgc2VwYXJhdGUgc3RyaW5nLlxuICAgICAgd2hpbGUgKGxhc3RHZW5lcmF0ZWRMaW5lIDwgbWFwcGluZy5nZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgIG5vZGUuYWRkKHNoaWZ0TmV4dExpbmUoKSk7XG4gICAgICAgIGxhc3RHZW5lcmF0ZWRMaW5lKys7XG4gICAgICB9XG4gICAgICBpZiAobGFzdEdlbmVyYXRlZENvbHVtbiA8IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uKSB7XG4gICAgICAgIHZhciBuZXh0TGluZSA9IHJlbWFpbmluZ0xpbmVzWzBdO1xuICAgICAgICBub2RlLmFkZChuZXh0TGluZS5zdWJzdHIoMCwgbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4pKTtcbiAgICAgICAgcmVtYWluaW5nTGluZXNbMF0gPSBuZXh0TGluZS5zdWJzdHIobWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uID0gbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW47XG4gICAgICB9XG4gICAgICBsYXN0TWFwcGluZyA9IG1hcHBpbmc7XG4gICAgfSwgdGhpcyk7XG4gICAgLy8gV2UgaGF2ZSBwcm9jZXNzZWQgYWxsIG1hcHBpbmdzLlxuICAgIGlmIChyZW1haW5pbmdMaW5lcy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAobGFzdE1hcHBpbmcpIHtcbiAgICAgICAgLy8gQXNzb2NpYXRlIHRoZSByZW1haW5pbmcgY29kZSBpbiB0aGUgY3VycmVudCBsaW5lIHdpdGggXCJsYXN0TWFwcGluZ1wiXG4gICAgICAgIGFkZE1hcHBpbmdXaXRoQ29kZShsYXN0TWFwcGluZywgc2hpZnROZXh0TGluZSgpKTtcbiAgICAgIH1cbiAgICAgIC8vIGFuZCBhZGQgdGhlIHJlbWFpbmluZyBsaW5lcyB3aXRob3V0IGFueSBtYXBwaW5nXG4gICAgICBub2RlLmFkZChyZW1haW5pbmdMaW5lcy5qb2luKFwiXCIpKTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IHNvdXJjZXNDb250ZW50IGludG8gU291cmNlTm9kZVxuICAgIGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZUZpbGUpIHtcbiAgICAgIHZhciBjb250ZW50ID0gYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZUNvbnRlbnRGb3Ioc291cmNlRmlsZSk7XG4gICAgICBpZiAoY29udGVudCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChhUmVsYXRpdmVQYXRoICE9IG51bGwpIHtcbiAgICAgICAgICBzb3VyY2VGaWxlID0gdXRpbC5qb2luKGFSZWxhdGl2ZVBhdGgsIHNvdXJjZUZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUuc2V0U291cmNlQ29udGVudChzb3VyY2VGaWxlLCBjb250ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBub2RlO1xuXG4gICAgZnVuY3Rpb24gYWRkTWFwcGluZ1dpdGhDb2RlKG1hcHBpbmcsIGNvZGUpIHtcbiAgICAgIGlmIChtYXBwaW5nID09PSBudWxsIHx8IG1hcHBpbmcuc291cmNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm9kZS5hZGQoY29kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc291cmNlID0gYVJlbGF0aXZlUGF0aFxuICAgICAgICAgID8gdXRpbC5qb2luKGFSZWxhdGl2ZVBhdGgsIG1hcHBpbmcuc291cmNlKVxuICAgICAgICAgIDogbWFwcGluZy5zb3VyY2U7XG4gICAgICAgIG5vZGUuYWRkKG5ldyBTb3VyY2VOb2RlKG1hcHBpbmcub3JpZ2luYWxMaW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBpbmcubmFtZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBBZGQgYSBjaHVuayBvZiBnZW5lcmF0ZWQgSlMgdG8gdGhpcyBzb3VyY2Ugbm9kZS5cbiAqXG4gKiBAcGFyYW0gYUNodW5rIEEgc3RyaW5nIHNuaXBwZXQgb2YgZ2VuZXJhdGVkIEpTIGNvZGUsIGFub3RoZXIgaW5zdGFuY2Ugb2ZcbiAqICAgICAgICBTb3VyY2VOb2RlLCBvciBhbiBhcnJheSB3aGVyZSBlYWNoIG1lbWJlciBpcyBvbmUgb2YgdGhvc2UgdGhpbmdzLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX2FkZChhQ2h1bmspIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYUNodW5rKSkge1xuICAgIGFDaHVuay5mb3JFYWNoKGZ1bmN0aW9uIChjaHVuaykge1xuICAgICAgdGhpcy5hZGQoY2h1bmspO1xuICAgIH0sIHRoaXMpO1xuICB9XG4gIGVsc2UgaWYgKGFDaHVua1tpc1NvdXJjZU5vZGVdIHx8IHR5cGVvZiBhQ2h1bmsgPT09IFwic3RyaW5nXCIpIHtcbiAgICBpZiAoYUNodW5rKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuLnB1c2goYUNodW5rKTtcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgIFwiRXhwZWN0ZWQgYSBTb3VyY2VOb2RlLCBzdHJpbmcsIG9yIGFuIGFycmF5IG9mIFNvdXJjZU5vZGVzIGFuZCBzdHJpbmdzLiBHb3QgXCIgKyBhQ2h1bmtcbiAgICApO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYSBjaHVuayBvZiBnZW5lcmF0ZWQgSlMgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGlzIHNvdXJjZSBub2RlLlxuICpcbiAqIEBwYXJhbSBhQ2h1bmsgQSBzdHJpbmcgc25pcHBldCBvZiBnZW5lcmF0ZWQgSlMgY29kZSwgYW5vdGhlciBpbnN0YW5jZSBvZlxuICogICAgICAgIFNvdXJjZU5vZGUsIG9yIGFuIGFycmF5IHdoZXJlIGVhY2ggbWVtYmVyIGlzIG9uZSBvZiB0aG9zZSB0aGluZ3MuXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLnByZXBlbmQgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX3ByZXBlbmQoYUNodW5rKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFDaHVuaykpIHtcbiAgICBmb3IgKHZhciBpID0gYUNodW5rLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5wcmVwZW5kKGFDaHVua1tpXSk7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKGFDaHVua1tpc1NvdXJjZU5vZGVdIHx8IHR5cGVvZiBhQ2h1bmsgPT09IFwic3RyaW5nXCIpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnVuc2hpZnQoYUNodW5rKTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgXCJFeHBlY3RlZCBhIFNvdXJjZU5vZGUsIHN0cmluZywgb3IgYW4gYXJyYXkgb2YgU291cmNlTm9kZXMgYW5kIHN0cmluZ3MuIEdvdCBcIiArIGFDaHVua1xuICAgICk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdhbGsgb3ZlciB0aGUgdHJlZSBvZiBKUyBzbmlwcGV0cyBpbiB0aGlzIG5vZGUgYW5kIGl0cyBjaGlsZHJlbi4gVGhlXG4gKiB3YWxraW5nIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbmNlIGZvciBlYWNoIHNuaXBwZXQgb2YgSlMgYW5kIGlzIHBhc3NlZCB0aGF0XG4gKiBzbmlwcGV0IGFuZCB0aGUgaXRzIG9yaWdpbmFsIGFzc29jaWF0ZWQgc291cmNlJ3MgbGluZS9jb2x1bW4gbG9jYXRpb24uXG4gKlxuICogQHBhcmFtIGFGbiBUaGUgdHJhdmVyc2FsIGZ1bmN0aW9uLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS53YWxrID0gZnVuY3Rpb24gU291cmNlTm9kZV93YWxrKGFGbikge1xuICB2YXIgY2h1bms7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY2h1bmsgPSB0aGlzLmNoaWxkcmVuW2ldO1xuICAgIGlmIChjaHVua1tpc1NvdXJjZU5vZGVdKSB7XG4gICAgICBjaHVuay53YWxrKGFGbik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKGNodW5rICE9PSAnJykge1xuICAgICAgICBhRm4oY2h1bmssIHsgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMubGluZSxcbiAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogdGhpcy5jb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIExpa2UgYFN0cmluZy5wcm90b3R5cGUuam9pbmAgZXhjZXB0IGZvciBTb3VyY2VOb2Rlcy4gSW5zZXJ0cyBgYVN0cmAgYmV0d2VlblxuICogZWFjaCBvZiBgdGhpcy5jaGlsZHJlbmAuXG4gKlxuICogQHBhcmFtIGFTZXAgVGhlIHNlcGFyYXRvci5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUuam9pbiA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfam9pbihhU2VwKSB7XG4gIHZhciBuZXdDaGlsZHJlbjtcbiAgdmFyIGk7XG4gIHZhciBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgaWYgKGxlbiA+IDApIHtcbiAgICBuZXdDaGlsZHJlbiA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW4tMTsgaSsrKSB7XG4gICAgICBuZXdDaGlsZHJlbi5wdXNoKHRoaXMuY2hpbGRyZW5baV0pO1xuICAgICAgbmV3Q2hpbGRyZW4ucHVzaChhU2VwKTtcbiAgICB9XG4gICAgbmV3Q2hpbGRyZW4ucHVzaCh0aGlzLmNoaWxkcmVuW2ldKTtcbiAgICB0aGlzLmNoaWxkcmVuID0gbmV3Q2hpbGRyZW47XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENhbGwgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlIG9uIHRoZSB2ZXJ5IHJpZ2h0LW1vc3Qgc291cmNlIHNuaXBwZXQuIFVzZWZ1bFxuICogZm9yIHRyaW1taW5nIHdoaXRlc3BhY2UgZnJvbSB0aGUgZW5kIG9mIGEgc291cmNlIG5vZGUsIGV0Yy5cbiAqXG4gKiBAcGFyYW0gYVBhdHRlcm4gVGhlIHBhdHRlcm4gdG8gcmVwbGFjZS5cbiAqIEBwYXJhbSBhUmVwbGFjZW1lbnQgVGhlIHRoaW5nIHRvIHJlcGxhY2UgdGhlIHBhdHRlcm4gd2l0aC5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUucmVwbGFjZVJpZ2h0ID0gZnVuY3Rpb24gU291cmNlTm9kZV9yZXBsYWNlUmlnaHQoYVBhdHRlcm4sIGFSZXBsYWNlbWVudCkge1xuICB2YXIgbGFzdENoaWxkID0gdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xuICBpZiAobGFzdENoaWxkW2lzU291cmNlTm9kZV0pIHtcbiAgICBsYXN0Q2hpbGQucmVwbGFjZVJpZ2h0KGFQYXR0ZXJuLCBhUmVwbGFjZW1lbnQpO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBsYXN0Q2hpbGQgPT09ICdzdHJpbmcnKSB7XG4gICAgdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdID0gbGFzdENoaWxkLnJlcGxhY2UoYVBhdHRlcm4sIGFSZXBsYWNlbWVudCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKCcnLnJlcGxhY2UoYVBhdHRlcm4sIGFSZXBsYWNlbWVudCkpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIHNvdXJjZSBjb250ZW50IGZvciBhIHNvdXJjZSBmaWxlLiBUaGlzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIFNvdXJjZU1hcEdlbmVyYXRvclxuICogaW4gdGhlIHNvdXJjZXNDb250ZW50IGZpZWxkLlxuICpcbiAqIEBwYXJhbSBhU291cmNlRmlsZSBUaGUgZmlsZW5hbWUgb2YgdGhlIHNvdXJjZSBmaWxlXG4gKiBAcGFyYW0gYVNvdXJjZUNvbnRlbnQgVGhlIGNvbnRlbnQgb2YgdGhlIHNvdXJjZSBmaWxlXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLnNldFNvdXJjZUNvbnRlbnQgPVxuICBmdW5jdGlvbiBTb3VyY2VOb2RlX3NldFNvdXJjZUNvbnRlbnQoYVNvdXJjZUZpbGUsIGFTb3VyY2VDb250ZW50KSB7XG4gICAgdGhpcy5zb3VyY2VDb250ZW50c1t1dGlsLnRvU2V0U3RyaW5nKGFTb3VyY2VGaWxlKV0gPSBhU291cmNlQ29udGVudDtcbiAgfTtcblxuLyoqXG4gKiBXYWxrIG92ZXIgdGhlIHRyZWUgb2YgU291cmNlTm9kZXMuIFRoZSB3YWxraW5nIGZ1bmN0aW9uIGlzIGNhbGxlZCBmb3IgZWFjaFxuICogc291cmNlIGZpbGUgY29udGVudCBhbmQgaXMgcGFzc2VkIHRoZSBmaWxlbmFtZSBhbmQgc291cmNlIGNvbnRlbnQuXG4gKlxuICogQHBhcmFtIGFGbiBUaGUgdHJhdmVyc2FsIGZ1bmN0aW9uLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS53YWxrU291cmNlQ29udGVudHMgPVxuICBmdW5jdGlvbiBTb3VyY2VOb2RlX3dhbGtTb3VyY2VDb250ZW50cyhhRm4pIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHRoaXMuY2hpbGRyZW5baV1baXNTb3VyY2VOb2RlXSkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLndhbGtTb3VyY2VDb250ZW50cyhhRm4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzb3VyY2VzID0gT2JqZWN0LmtleXModGhpcy5zb3VyY2VDb250ZW50cyk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNvdXJjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFGbih1dGlsLmZyb21TZXRTdHJpbmcoc291cmNlc1tpXSksIHRoaXMuc291cmNlQ29udGVudHNbc291cmNlc1tpXV0pO1xuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHNvdXJjZSBub2RlLiBXYWxrcyBvdmVyIHRoZSB0cmVlXG4gKiBhbmQgY29uY2F0ZW5hdGVzIGFsbCB0aGUgdmFyaW91cyBzbmlwcGV0cyB0b2dldGhlciB0byBvbmUgc3RyaW5nLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfdG9TdHJpbmcoKSB7XG4gIHZhciBzdHIgPSBcIlwiO1xuICB0aGlzLndhbGsoZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgc3RyICs9IGNodW5rO1xuICB9KTtcbiAgcmV0dXJuIHN0cjtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgc291cmNlIG5vZGUgYWxvbmcgd2l0aCBhIHNvdXJjZVxuICogbWFwLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS50b1N0cmluZ1dpdGhTb3VyY2VNYXAgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX3RvU3RyaW5nV2l0aFNvdXJjZU1hcChhQXJncykge1xuICB2YXIgZ2VuZXJhdGVkID0ge1xuICAgIGNvZGU6IFwiXCIsXG4gICAgbGluZTogMSxcbiAgICBjb2x1bW46IDBcbiAgfTtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoYUFyZ3MpO1xuICB2YXIgc291cmNlTWFwcGluZ0FjdGl2ZSA9IGZhbHNlO1xuICB2YXIgbGFzdE9yaWdpbmFsU291cmNlID0gbnVsbDtcbiAgdmFyIGxhc3RPcmlnaW5hbExpbmUgPSBudWxsO1xuICB2YXIgbGFzdE9yaWdpbmFsQ29sdW1uID0gbnVsbDtcbiAgdmFyIGxhc3RPcmlnaW5hbE5hbWUgPSBudWxsO1xuICB0aGlzLndhbGsoZnVuY3Rpb24gKGNodW5rLCBvcmlnaW5hbCkge1xuICAgIGdlbmVyYXRlZC5jb2RlICs9IGNodW5rO1xuICAgIGlmIChvcmlnaW5hbC5zb3VyY2UgIT09IG51bGxcbiAgICAgICAgJiYgb3JpZ2luYWwubGluZSAhPT0gbnVsbFxuICAgICAgICAmJiBvcmlnaW5hbC5jb2x1bW4gIT09IG51bGwpIHtcbiAgICAgIGlmKGxhc3RPcmlnaW5hbFNvdXJjZSAhPT0gb3JpZ2luYWwuc291cmNlXG4gICAgICAgICB8fCBsYXN0T3JpZ2luYWxMaW5lICE9PSBvcmlnaW5hbC5saW5lXG4gICAgICAgICB8fCBsYXN0T3JpZ2luYWxDb2x1bW4gIT09IG9yaWdpbmFsLmNvbHVtblxuICAgICAgICAgfHwgbGFzdE9yaWdpbmFsTmFtZSAhPT0gb3JpZ2luYWwubmFtZSkge1xuICAgICAgICBtYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgc291cmNlOiBvcmlnaW5hbC5zb3VyY2UsXG4gICAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgIGxpbmU6IG9yaWdpbmFsLmxpbmUsXG4gICAgICAgICAgICBjb2x1bW46IG9yaWdpbmFsLmNvbHVtblxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgICBsaW5lOiBnZW5lcmF0ZWQubGluZSxcbiAgICAgICAgICAgIGNvbHVtbjogZ2VuZXJhdGVkLmNvbHVtblxuICAgICAgICAgIH0sXG4gICAgICAgICAgbmFtZTogb3JpZ2luYWwubmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGxhc3RPcmlnaW5hbFNvdXJjZSA9IG9yaWdpbmFsLnNvdXJjZTtcbiAgICAgIGxhc3RPcmlnaW5hbExpbmUgPSBvcmlnaW5hbC5saW5lO1xuICAgICAgbGFzdE9yaWdpbmFsQ29sdW1uID0gb3JpZ2luYWwuY29sdW1uO1xuICAgICAgbGFzdE9yaWdpbmFsTmFtZSA9IG9yaWdpbmFsLm5hbWU7XG4gICAgICBzb3VyY2VNYXBwaW5nQWN0aXZlID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHNvdXJjZU1hcHBpbmdBY3RpdmUpIHtcbiAgICAgIG1hcC5hZGRNYXBwaW5nKHtcbiAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgbGluZTogZ2VuZXJhdGVkLmxpbmUsXG4gICAgICAgICAgY29sdW1uOiBnZW5lcmF0ZWQuY29sdW1uXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbGFzdE9yaWdpbmFsU291cmNlID0gbnVsbDtcbiAgICAgIHNvdXJjZU1hcHBpbmdBY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gICAgZm9yICh2YXIgaWR4ID0gMCwgbGVuZ3RoID0gY2h1bmsubGVuZ3RoOyBpZHggPCBsZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoY2h1bmsuY2hhckNvZGVBdChpZHgpID09PSBORVdMSU5FX0NPREUpIHtcbiAgICAgICAgZ2VuZXJhdGVkLmxpbmUrKztcbiAgICAgICAgZ2VuZXJhdGVkLmNvbHVtbiA9IDA7XG4gICAgICAgIC8vIE1hcHBpbmdzIGVuZCBhdCBlb2xcbiAgICAgICAgaWYgKGlkeCArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIGxhc3RPcmlnaW5hbFNvdXJjZSA9IG51bGw7XG4gICAgICAgICAgc291cmNlTWFwcGluZ0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKHNvdXJjZU1hcHBpbmdBY3RpdmUpIHtcbiAgICAgICAgICBtYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICBzb3VyY2U6IG9yaWdpbmFsLnNvdXJjZSxcbiAgICAgICAgICAgIG9yaWdpbmFsOiB7XG4gICAgICAgICAgICAgIGxpbmU6IG9yaWdpbmFsLmxpbmUsXG4gICAgICAgICAgICAgIGNvbHVtbjogb3JpZ2luYWwuY29sdW1uXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgICAgIGxpbmU6IGdlbmVyYXRlZC5saW5lLFxuICAgICAgICAgICAgICBjb2x1bW46IGdlbmVyYXRlZC5jb2x1bW5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiBvcmlnaW5hbC5uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdlbmVyYXRlZC5jb2x1bW4rKztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICB0aGlzLndhbGtTb3VyY2VDb250ZW50cyhmdW5jdGlvbiAoc291cmNlRmlsZSwgc291cmNlQ29udGVudCkge1xuICAgIG1hcC5zZXRTb3VyY2VDb250ZW50KHNvdXJjZUZpbGUsIHNvdXJjZUNvbnRlbnQpO1xuICB9KTtcblxuICByZXR1cm4geyBjb2RlOiBnZW5lcmF0ZWQuY29kZSwgbWFwOiBtYXAgfTtcbn07XG5cbmV4cG9ydHMuU291cmNlTm9kZSA9IFNvdXJjZU5vZGU7XG4iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbi8qKlxuICogVGhpcyBpcyBhIGhlbHBlciBmdW5jdGlvbiBmb3IgZ2V0dGluZyB2YWx1ZXMgZnJvbSBwYXJhbWV0ZXIvb3B0aW9uc1xuICogb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0gYXJncyBUaGUgb2JqZWN0IHdlIGFyZSBleHRyYWN0aW5nIHZhbHVlcyBmcm9tXG4gKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgd2UgYXJlIGdldHRpbmcuXG4gKiBAcGFyYW0gZGVmYXVsdFZhbHVlIEFuIG9wdGlvbmFsIHZhbHVlIHRvIHJldHVybiBpZiB0aGUgcHJvcGVydHkgaXMgbWlzc2luZ1xuICogZnJvbSB0aGUgb2JqZWN0LiBJZiB0aGlzIGlzIG5vdCBzcGVjaWZpZWQgYW5kIHRoZSBwcm9wZXJ0eSBpcyBtaXNzaW5nLCBhblxuICogZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gKi9cbmZ1bmN0aW9uIGdldEFyZyhhQXJncywgYU5hbWUsIGFEZWZhdWx0VmFsdWUpIHtcbiAgaWYgKGFOYW1lIGluIGFBcmdzKSB7XG4gICAgcmV0dXJuIGFBcmdzW2FOYW1lXTtcbiAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgcmV0dXJuIGFEZWZhdWx0VmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBhTmFtZSArICdcIiBpcyBhIHJlcXVpcmVkIGFyZ3VtZW50LicpO1xuICB9XG59XG5leHBvcnRzLmdldEFyZyA9IGdldEFyZztcblxudmFyIHVybFJlZ2V4cCA9IC9eKD86KFtcXHcrXFwtLl0rKTopP1xcL1xcLyg/OihcXHcrOlxcdyspQCk/KFtcXHcuXSopKD86OihcXGQrKSk/KFxcUyopJC87XG52YXIgZGF0YVVybFJlZ2V4cCA9IC9eZGF0YTouK1xcLC4rJC87XG5cbmZ1bmN0aW9uIHVybFBhcnNlKGFVcmwpIHtcbiAgdmFyIG1hdGNoID0gYVVybC5tYXRjaCh1cmxSZWdleHApO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBzY2hlbWU6IG1hdGNoWzFdLFxuICAgIGF1dGg6IG1hdGNoWzJdLFxuICAgIGhvc3Q6IG1hdGNoWzNdLFxuICAgIHBvcnQ6IG1hdGNoWzRdLFxuICAgIHBhdGg6IG1hdGNoWzVdXG4gIH07XG59XG5leHBvcnRzLnVybFBhcnNlID0gdXJsUGFyc2U7XG5cbmZ1bmN0aW9uIHVybEdlbmVyYXRlKGFQYXJzZWRVcmwpIHtcbiAgdmFyIHVybCA9ICcnO1xuICBpZiAoYVBhcnNlZFVybC5zY2hlbWUpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5zY2hlbWUgKyAnOic7XG4gIH1cbiAgdXJsICs9ICcvLyc7XG4gIGlmIChhUGFyc2VkVXJsLmF1dGgpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5hdXRoICsgJ0AnO1xuICB9XG4gIGlmIChhUGFyc2VkVXJsLmhvc3QpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5ob3N0O1xuICB9XG4gIGlmIChhUGFyc2VkVXJsLnBvcnQpIHtcbiAgICB1cmwgKz0gXCI6XCIgKyBhUGFyc2VkVXJsLnBvcnRcbiAgfVxuICBpZiAoYVBhcnNlZFVybC5wYXRoKSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwucGF0aDtcbiAgfVxuICByZXR1cm4gdXJsO1xufVxuZXhwb3J0cy51cmxHZW5lcmF0ZSA9IHVybEdlbmVyYXRlO1xuXG4vKipcbiAqIE5vcm1hbGl6ZXMgYSBwYXRoLCBvciB0aGUgcGF0aCBwb3J0aW9uIG9mIGEgVVJMOlxuICpcbiAqIC0gUmVwbGFjZXMgY29uc2VjdXRpdmUgc2xhc2hlcyB3aXRoIG9uZSBzbGFzaC5cbiAqIC0gUmVtb3ZlcyB1bm5lY2Vzc2FyeSAnLicgcGFydHMuXG4gKiAtIFJlbW92ZXMgdW5uZWNlc3NhcnkgJzxkaXI+Ly4uJyBwYXJ0cy5cbiAqXG4gKiBCYXNlZCBvbiBjb2RlIGluIHRoZSBOb2RlLmpzICdwYXRoJyBjb3JlIG1vZHVsZS5cbiAqXG4gKiBAcGFyYW0gYVBhdGggVGhlIHBhdGggb3IgdXJsIHRvIG5vcm1hbGl6ZS5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplKGFQYXRoKSB7XG4gIHZhciBwYXRoID0gYVBhdGg7XG4gIHZhciB1cmwgPSB1cmxQYXJzZShhUGF0aCk7XG4gIGlmICh1cmwpIHtcbiAgICBpZiAoIXVybC5wYXRoKSB7XG4gICAgICByZXR1cm4gYVBhdGg7XG4gICAgfVxuICAgIHBhdGggPSB1cmwucGF0aDtcbiAgfVxuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKTtcblxuICB2YXIgcGFydHMgPSBwYXRoLnNwbGl0KC9cXC8rLyk7XG4gIGZvciAodmFyIHBhcnQsIHVwID0gMCwgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgcGFydCA9IHBhcnRzW2ldO1xuICAgIGlmIChwYXJ0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKHBhcnQgPT09ICcuLicpIHtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCA+IDApIHtcbiAgICAgIGlmIChwYXJ0ID09PSAnJykge1xuICAgICAgICAvLyBUaGUgZmlyc3QgcGFydCBpcyBibGFuayBpZiB0aGUgcGF0aCBpcyBhYnNvbHV0ZS4gVHJ5aW5nIHRvIGdvXG4gICAgICAgIC8vIGFib3ZlIHRoZSByb290IGlzIGEgbm8tb3AuIFRoZXJlZm9yZSB3ZSBjYW4gcmVtb3ZlIGFsbCAnLi4nIHBhcnRzXG4gICAgICAgIC8vIGRpcmVjdGx5IGFmdGVyIHRoZSByb290LlxuICAgICAgICBwYXJ0cy5zcGxpY2UoaSArIDEsIHVwKTtcbiAgICAgICAgdXAgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFydHMuc3BsaWNlKGksIDIpO1xuICAgICAgICB1cC0tO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBwYXRoID0gcGFydHMuam9pbignLycpO1xuXG4gIGlmIChwYXRoID09PSAnJykge1xuICAgIHBhdGggPSBpc0Fic29sdXRlID8gJy8nIDogJy4nO1xuICB9XG5cbiAgaWYgKHVybCkge1xuICAgIHVybC5wYXRoID0gcGF0aDtcbiAgICByZXR1cm4gdXJsR2VuZXJhdGUodXJsKTtcbiAgfVxuICByZXR1cm4gcGF0aDtcbn1cbmV4cG9ydHMubm9ybWFsaXplID0gbm9ybWFsaXplO1xuXG4vKipcbiAqIEpvaW5zIHR3byBwYXRocy9VUkxzLlxuICpcbiAqIEBwYXJhbSBhUm9vdCBUaGUgcm9vdCBwYXRoIG9yIFVSTC5cbiAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciBVUkwgdG8gYmUgam9pbmVkIHdpdGggdGhlIHJvb3QuXG4gKlxuICogLSBJZiBhUGF0aCBpcyBhIFVSTCBvciBhIGRhdGEgVVJJLCBhUGF0aCBpcyByZXR1cm5lZCwgdW5sZXNzIGFQYXRoIGlzIGFcbiAqICAgc2NoZW1lLXJlbGF0aXZlIFVSTDogVGhlbiB0aGUgc2NoZW1lIG9mIGFSb290LCBpZiBhbnksIGlzIHByZXBlbmRlZFxuICogICBmaXJzdC5cbiAqIC0gT3RoZXJ3aXNlIGFQYXRoIGlzIGEgcGF0aC4gSWYgYVJvb3QgaXMgYSBVUkwsIHRoZW4gaXRzIHBhdGggcG9ydGlvblxuICogICBpcyB1cGRhdGVkIHdpdGggdGhlIHJlc3VsdCBhbmQgYVJvb3QgaXMgcmV0dXJuZWQuIE90aGVyd2lzZSB0aGUgcmVzdWx0XG4gKiAgIGlzIHJldHVybmVkLlxuICogICAtIElmIGFQYXRoIGlzIGFic29sdXRlLCB0aGUgcmVzdWx0IGlzIGFQYXRoLlxuICogICAtIE90aGVyd2lzZSB0aGUgdHdvIHBhdGhzIGFyZSBqb2luZWQgd2l0aCBhIHNsYXNoLlxuICogLSBKb2luaW5nIGZvciBleGFtcGxlICdodHRwOi8vJyBhbmQgJ3d3dy5leGFtcGxlLmNvbScgaXMgYWxzbyBzdXBwb3J0ZWQuXG4gKi9cbmZ1bmN0aW9uIGpvaW4oYVJvb3QsIGFQYXRoKSB7XG4gIGlmIChhUm9vdCA9PT0gXCJcIikge1xuICAgIGFSb290ID0gXCIuXCI7XG4gIH1cbiAgaWYgKGFQYXRoID09PSBcIlwiKSB7XG4gICAgYVBhdGggPSBcIi5cIjtcbiAgfVxuICB2YXIgYVBhdGhVcmwgPSB1cmxQYXJzZShhUGF0aCk7XG4gIHZhciBhUm9vdFVybCA9IHVybFBhcnNlKGFSb290KTtcbiAgaWYgKGFSb290VXJsKSB7XG4gICAgYVJvb3QgPSBhUm9vdFVybC5wYXRoIHx8ICcvJztcbiAgfVxuXG4gIC8vIGBqb2luKGZvbywgJy8vd3d3LmV4YW1wbGUub3JnJylgXG4gIGlmIChhUGF0aFVybCAmJiAhYVBhdGhVcmwuc2NoZW1lKSB7XG4gICAgaWYgKGFSb290VXJsKSB7XG4gICAgICBhUGF0aFVybC5zY2hlbWUgPSBhUm9vdFVybC5zY2hlbWU7XG4gICAgfVxuICAgIHJldHVybiB1cmxHZW5lcmF0ZShhUGF0aFVybCk7XG4gIH1cblxuICBpZiAoYVBhdGhVcmwgfHwgYVBhdGgubWF0Y2goZGF0YVVybFJlZ2V4cCkpIHtcbiAgICByZXR1cm4gYVBhdGg7XG4gIH1cblxuICAvLyBgam9pbignaHR0cDovLycsICd3d3cuZXhhbXBsZS5jb20nKWBcbiAgaWYgKGFSb290VXJsICYmICFhUm9vdFVybC5ob3N0ICYmICFhUm9vdFVybC5wYXRoKSB7XG4gICAgYVJvb3RVcmwuaG9zdCA9IGFQYXRoO1xuICAgIHJldHVybiB1cmxHZW5lcmF0ZShhUm9vdFVybCk7XG4gIH1cblxuICB2YXIgam9pbmVkID0gYVBhdGguY2hhckF0KDApID09PSAnLydcbiAgICA/IGFQYXRoXG4gICAgOiBub3JtYWxpemUoYVJvb3QucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyBhUGF0aCk7XG5cbiAgaWYgKGFSb290VXJsKSB7XG4gICAgYVJvb3RVcmwucGF0aCA9IGpvaW5lZDtcbiAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVJvb3RVcmwpO1xuICB9XG4gIHJldHVybiBqb2luZWQ7XG59XG5leHBvcnRzLmpvaW4gPSBqb2luO1xuXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbiAoYVBhdGgpIHtcbiAgcmV0dXJuIGFQYXRoLmNoYXJBdCgwKSA9PT0gJy8nIHx8ICEhYVBhdGgubWF0Y2godXJsUmVnZXhwKTtcbn07XG5cbi8qKlxuICogTWFrZSBhIHBhdGggcmVsYXRpdmUgdG8gYSBVUkwgb3IgYW5vdGhlciBwYXRoLlxuICpcbiAqIEBwYXJhbSBhUm9vdCBUaGUgcm9vdCBwYXRoIG9yIFVSTC5cbiAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciBVUkwgdG8gYmUgbWFkZSByZWxhdGl2ZSB0byBhUm9vdC5cbiAqL1xuZnVuY3Rpb24gcmVsYXRpdmUoYVJvb3QsIGFQYXRoKSB7XG4gIGlmIChhUm9vdCA9PT0gXCJcIikge1xuICAgIGFSb290ID0gXCIuXCI7XG4gIH1cblxuICBhUm9vdCA9IGFSb290LnJlcGxhY2UoL1xcLyQvLCAnJyk7XG5cbiAgLy8gSXQgaXMgcG9zc2libGUgZm9yIHRoZSBwYXRoIHRvIGJlIGFib3ZlIHRoZSByb290LiBJbiB0aGlzIGNhc2UsIHNpbXBseVxuICAvLyBjaGVja2luZyB3aGV0aGVyIHRoZSByb290IGlzIGEgcHJlZml4IG9mIHRoZSBwYXRoIHdvbid0IHdvcmsuIEluc3RlYWQsIHdlXG4gIC8vIG5lZWQgdG8gcmVtb3ZlIGNvbXBvbmVudHMgZnJvbSB0aGUgcm9vdCBvbmUgYnkgb25lLCB1bnRpbCBlaXRoZXIgd2UgZmluZFxuICAvLyBhIHByZWZpeCB0aGF0IGZpdHMsIG9yIHdlIHJ1biBvdXQgb2YgY29tcG9uZW50cyB0byByZW1vdmUuXG4gIHZhciBsZXZlbCA9IDA7XG4gIHdoaWxlIChhUGF0aC5pbmRleE9mKGFSb290ICsgJy8nKSAhPT0gMCkge1xuICAgIHZhciBpbmRleCA9IGFSb290Lmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICByZXR1cm4gYVBhdGg7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG9ubHkgcGFydCBvZiB0aGUgcm9vdCB0aGF0IGlzIGxlZnQgaXMgdGhlIHNjaGVtZSAoaS5lLiBodHRwOi8vLFxuICAgIC8vIGZpbGU6Ly8vLCBldGMuKSwgb25lIG9yIG1vcmUgc2xhc2hlcyAoLyksIG9yIHNpbXBseSBub3RoaW5nIGF0IGFsbCwgd2VcbiAgICAvLyBoYXZlIGV4aGF1c3RlZCBhbGwgY29tcG9uZW50cywgc28gdGhlIHBhdGggaXMgbm90IHJlbGF0aXZlIHRvIHRoZSByb290LlxuICAgIGFSb290ID0gYVJvb3Quc2xpY2UoMCwgaW5kZXgpO1xuICAgIGlmIChhUm9vdC5tYXRjaCgvXihbXlxcL10rOlxcLyk/XFwvKiQvKSkge1xuICAgICAgcmV0dXJuIGFQYXRoO1xuICAgIH1cblxuICAgICsrbGV2ZWw7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgd2UgYWRkIGEgXCIuLi9cIiBmb3IgZWFjaCBjb21wb25lbnQgd2UgcmVtb3ZlZCBmcm9tIHRoZSByb290LlxuICByZXR1cm4gQXJyYXkobGV2ZWwgKyAxKS5qb2luKFwiLi4vXCIpICsgYVBhdGguc3Vic3RyKGFSb290Lmxlbmd0aCArIDEpO1xufVxuZXhwb3J0cy5yZWxhdGl2ZSA9IHJlbGF0aXZlO1xuXG52YXIgc3VwcG9ydHNOdWxsUHJvdG8gPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgb2JqID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgcmV0dXJuICEoJ19fcHJvdG9fXycgaW4gb2JqKTtcbn0oKSk7XG5cbmZ1bmN0aW9uIGlkZW50aXR5IChzKSB7XG4gIHJldHVybiBzO1xufVxuXG4vKipcbiAqIEJlY2F1c2UgYmVoYXZpb3IgZ29lcyB3YWNreSB3aGVuIHlvdSBzZXQgYF9fcHJvdG9fX2Agb24gb2JqZWN0cywgd2VcbiAqIGhhdmUgdG8gcHJlZml4IGFsbCB0aGUgc3RyaW5ncyBpbiBvdXIgc2V0IHdpdGggYW4gYXJiaXRyYXJ5IGNoYXJhY3Rlci5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvc291cmNlLW1hcC9wdWxsLzMxIGFuZFxuICogaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvc291cmNlLW1hcC9pc3N1ZXMvMzBcbiAqXG4gKiBAcGFyYW0gU3RyaW5nIGFTdHJcbiAqL1xuZnVuY3Rpb24gdG9TZXRTdHJpbmcoYVN0cikge1xuICBpZiAoaXNQcm90b1N0cmluZyhhU3RyKSkge1xuICAgIHJldHVybiAnJCcgKyBhU3RyO1xuICB9XG5cbiAgcmV0dXJuIGFTdHI7XG59XG5leHBvcnRzLnRvU2V0U3RyaW5nID0gc3VwcG9ydHNOdWxsUHJvdG8gPyBpZGVudGl0eSA6IHRvU2V0U3RyaW5nO1xuXG5mdW5jdGlvbiBmcm9tU2V0U3RyaW5nKGFTdHIpIHtcbiAgaWYgKGlzUHJvdG9TdHJpbmcoYVN0cikpIHtcbiAgICByZXR1cm4gYVN0ci5zbGljZSgxKTtcbiAgfVxuXG4gIHJldHVybiBhU3RyO1xufVxuZXhwb3J0cy5mcm9tU2V0U3RyaW5nID0gc3VwcG9ydHNOdWxsUHJvdG8gPyBpZGVudGl0eSA6IGZyb21TZXRTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzUHJvdG9TdHJpbmcocykge1xuICBpZiAoIXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgbGVuZ3RoID0gcy5sZW5ndGg7XG5cbiAgaWYgKGxlbmd0aCA8IDkgLyogXCJfX3Byb3RvX19cIi5sZW5ndGggKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocy5jaGFyQ29kZUF0KGxlbmd0aCAtIDEpICE9PSA5NSAgLyogJ18nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMikgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSAzKSAhPT0gMTExIC8qICdvJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDQpICE9PSAxMTYgLyogJ3QnICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNSkgIT09IDExMSAvKiAnbycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA2KSAhPT0gMTE0IC8qICdyJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDcpICE9PSAxMTIgLyogJ3AnICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gOCkgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA5KSAhPT0gOTUgIC8qICdfJyAqLykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSBsZW5ndGggLSAxMDsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAocy5jaGFyQ29kZUF0KGkpICE9PSAzNiAvKiAnJCcgKi8pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdoZXJlIHRoZSBvcmlnaW5hbCBwb3NpdGlvbnMgYXJlIGNvbXBhcmVkLlxuICpcbiAqIE9wdGlvbmFsbHkgcGFzcyBpbiBgdHJ1ZWAgYXMgYG9ubHlDb21wYXJlR2VuZXJhdGVkYCB0byBjb25zaWRlciB0d29cbiAqIG1hcHBpbmdzIHdpdGggdGhlIHNhbWUgb3JpZ2luYWwgc291cmNlL2xpbmUvY29sdW1uLCBidXQgZGlmZmVyZW50IGdlbmVyYXRlZFxuICogbGluZSBhbmQgY29sdW1uIHRoZSBzYW1lLiBVc2VmdWwgd2hlbiBzZWFyY2hpbmcgZm9yIGEgbWFwcGluZyB3aXRoIGFcbiAqIHN0dWJiZWQgb3V0IG1hcHBpbmcuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKG1hcHBpbmdBLCBtYXBwaW5nQiwgb25seUNvbXBhcmVPcmlnaW5hbCkge1xuICB2YXIgY21wID0gbWFwcGluZ0Euc291cmNlIC0gbWFwcGluZ0Iuc291cmNlO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICBpZiAoY21wICE9PSAwIHx8IG9ubHlDb21wYXJlT3JpZ2luYWwpIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIHJldHVybiBtYXBwaW5nQS5uYW1lIC0gbWFwcGluZ0IubmFtZTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMgPSBjb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucztcblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdpdGggZGVmbGF0ZWQgc291cmNlIGFuZCBuYW1lIGluZGljZXMgd2hlcmVcbiAqIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IHBhc3MgaW4gYHRydWVgIGFzIGBvbmx5Q29tcGFyZUdlbmVyYXRlZGAgdG8gY29uc2lkZXIgdHdvXG4gKiBtYXBwaW5ncyB3aXRoIHRoZSBzYW1lIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4sIGJ1dCBkaWZmZXJlbnRcbiAqIHNvdXJjZS9uYW1lL29yaWdpbmFsIGxpbmUgYW5kIGNvbHVtbiB0aGUgc2FtZS4gVXNlZnVsIHdoZW4gc2VhcmNoaW5nIGZvciBhXG4gKiBtYXBwaW5nIHdpdGggYSBzdHViYmVkIG91dCBtYXBwaW5nLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IsIG9ubHlDb21wYXJlR2VuZXJhdGVkKSB7XG4gIHZhciBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lIC0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVHZW5lcmF0ZWQpIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Euc291cmNlIC0gbWFwcGluZ0Iuc291cmNlO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIHJldHVybiBtYXBwaW5nQS5uYW1lIC0gbWFwcGluZ0IubmFtZTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQgPSBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZDtcblxuZnVuY3Rpb24gc3RyY21wKGFTdHIxLCBhU3RyMikge1xuICBpZiAoYVN0cjEgPT09IGFTdHIyKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoYVN0cjEgPiBhU3RyMikge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIENvbXBhcmF0b3IgYmV0d2VlbiB0d28gbWFwcGluZ3Mgd2l0aCBpbmZsYXRlZCBzb3VyY2UgYW5kIG5hbWUgc3RyaW5ncyB3aGVyZVxuICogdGhlIGdlbmVyYXRlZCBwb3NpdGlvbnMgYXJlIGNvbXBhcmVkLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IpIHtcbiAgdmFyIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZENvbHVtbiAtIG1hcHBpbmdCLmdlbmVyYXRlZENvbHVtbjtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBzdHJjbXAobWFwcGluZ0Euc291cmNlLCBtYXBwaW5nQi5zb3VyY2UpO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIHJldHVybiBzdHJjbXAobWFwcGluZ0EubmFtZSwgbWFwcGluZ0IubmFtZSk7XG59XG5leHBvcnRzLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkID0gY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQ7XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDktMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0UudHh0IG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5leHBvcnRzLlNvdXJjZU1hcEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vbGliL3NvdXJjZS1tYXAtZ2VuZXJhdG9yJykuU291cmNlTWFwR2VuZXJhdG9yO1xuZXhwb3J0cy5Tb3VyY2VNYXBDb25zdW1lciA9IHJlcXVpcmUoJy4vbGliL3NvdXJjZS1tYXAtY29uc3VtZXInKS5Tb3VyY2VNYXBDb25zdW1lcjtcbmV4cG9ydHMuU291cmNlTm9kZSA9IHJlcXVpcmUoJy4vbGliL3NvdXJjZS1ub2RlJykuU291cmNlTm9kZTtcbiJdfQ==
