(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _layout = require('./views/layout');

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Marionette.Application.extend({
	region: '.app',
	initialize: function initialize() {},
	start: function start() {
		this.showView(new _layout2.default());
	}
});

},{"./views/layout":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
        var tmp = handlebars.compile(template);
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

},{}],3:[function(require,module,exports){
'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
    window.App = new _app2.default();
    App.start();
});

},{"./app":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hbs = require("../behaviors/hbs");

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
    template: _.template('<span class="text"> <%= title %> </span><div class="btns"><button class="toggle btn btn-success" type="button"><i class="glyphicon glyphicon-ok"></i></button><button type="button" class="remove btn btn-danger"><i class="glyphicon glyphicon-remove"></i></button></div>'),
    initialize: function initialize() {},
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

exports.default = Marionette.View.extend({
    template: function template(data) {
        return 'main view';
    },
    behaviors: [_hbs2.default],
    HBTemplate: '../templates/layout.hbs',
    className: 'main-app',
    regions: {
        list: {
            el: '#wrapper'
        }
    },
    ui: {
        addtask: '.addtask',
        logOut: '.logout__btn',
        authorize: '.authorization__btn',
        register: '.registration__btn'
    },
    events: {
        'click @ui.addtask': 'addTask',
        'click @ui.logOut': 'logOut',
        'click @ui.authorize': 'authorizeUser',
        'click @ui.register': 'registerUser'
    },
    initialize: function initialize() {

        var _this = this;

        firebase.auth().onAuthStateChanged(function (firebaseUser) {
            if (firebaseUser) {
                var email = firebaseUser.email;
                var userNickname = email.substring(0, email.indexOf('@'));
                $('.autorization').addClass('hide');
                $('#application').fadeIn();
                $('.user-name').html(userNickname);
                console.log('User ' + userNickname + ' logged In');
                _this.initCurrentUser(firebaseUser, userNickname);
            } else {
                console.log('Not logged In');
                $('.autorization').removeClass('hide');
                $('#application').fadeOut();
            }
        });
    },
    initCurrentUser: function initCurrentUser(firebaseUser, userNickname) {

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
    logOut: function logOut() {
        firebase.auth().signOut();
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
    }
});

},{"../behaviors/hbs":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2pzL2FwcC5qcyIsImRpc3QvanMvYmVoYXZpb3JzL2hicy5qcyIsImRpc3QvanMvaW5pdGlhbGl6ZS5qcyIsImRpc3QvanMvdmlld3MvbGF5b3V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUE7Ozs7OztrQkFHZSxXQUFXLFdBQVgsQ0FBdUIsTUFBdkIsQ0FBOEI7QUFDNUMsU0FBUSxNQURvQztBQUU1QyxhQUFZLHNCQUFXLENBRXRCLENBSjJDO0FBSzVDLFFBQU8saUJBQVc7QUFDakIsT0FBSyxRQUFMLENBQWMsc0JBQWQ7QUFDQTtBQVAyQyxDQUE5QixDOzs7Ozs7OztBQ0hmLElBQU0sU0FBUyxXQUFXLFFBQVgsQ0FBb0IsTUFBcEIsQ0FBMkI7QUFDdEMsWUFBUSxLQUQ4QjtBQUV0QyxjQUZzQyxzQkFFMUIsT0FGMEIsRUFFakI7QUFBQTs7QUFDakIsWUFBSSxhQUFhLEtBQUssSUFBTCxDQUFVLFVBQTNCOztBQUVBLGFBQUssSUFBTCxDQUFVLGFBQVYsR0FBMEIsS0FBMUI7O0FBRUE7QUFDQSxZQUFHLENBQUMsVUFBSixFQUFnQixPQUFPLFFBQVEsSUFBUixDQUFhLDJCQUFiLENBQVA7O0FBRWhCO0FBQ0EsWUFBRyxJQUFJLFFBQUosQ0FBYSxVQUFiLEtBQTRCLFNBQS9CLEVBQTBDO0FBQ3RDLG1CQUFPLElBQUksUUFBSixDQUFhLFVBQWIsSUFBMkIsSUFBSSxJQUFKLENBQVM7QUFDbkMsc0JBQU0sS0FENkI7QUFFbkMscUJBQUssVUFGOEI7QUFHbkMsMEJBQVU7QUFIeUIsYUFBVCxFQUkzQixJQUoyQixDQUl0QixnQkFBUTtBQUNaO0FBQ0Esb0JBQUcsQ0FBQyxNQUFLLElBQUwsQ0FBVSxXQUFWLEVBQUosRUFBNkI7QUFDakMsd0JBQUksUUFBSixDQUFhLFVBQWIsSUFBMkIsSUFBM0I7QUFDQSwwQkFBSyxXQUFMLENBQWlCLElBQUksUUFB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RkQ7QUFHSCxLQWxFa0M7QUFtRW5DLGtCQUFjLHdCQUFZO0FBQ3RCLFlBQUksUUFBUSxLQUFLLENBQUwsQ0FBTyxlQUFQLEVBQXdCLEdBQXhCLEVBQVo7QUFBQSxZQUNJLE9BQU8sS0FBSyxDQUFMLENBQU8sY0FBUCxFQUF1QixHQUF2QixFQURYOztBQUdBLFlBQUksT0FBTyxTQUFTLElBQVQsRUFBWDtBQUNBLFlBQUksVUFBVSxLQUFLLDhCQUFMLENBQW9DLEtBQXBDLEVBQTJDLElBQTNDLENBQWQ7O0FBRUEsZ0JBQVEsS0FBUixDQUFjLFVBQVUsQ0FBVixFQUFhO0FBQ3ZCLGtCQUFNLEVBQUUsT0FBUjtBQUNILFNBRkQ7QUFHSCxLQTdFa0M7QUE4RW5DLFlBQVEsa0JBQVk7QUFDaEIsaUJBQVMsSUFBVCxHQUFnQixPQUFoQjtBQUNILEtBaEZrQztBQWlGbkMsYUFBUyxpQkFBVSxLQUFWLEVBQWlCO0FBQ3RCLGNBQU0sY0FBTjtBQUNBLFlBQUksU0FBUyxFQUFFLE1BQUYsQ0FBYjtBQUNBLFlBQUksZUFBZSxPQUFPLEdBQVAsRUFBbkI7QUFDQSx1QkFBZSxFQUFFLE1BQUYsQ0FBUyxZQUFULENBQWY7QUFDQSxlQUFPLEdBQVAsQ0FBVyxFQUFYO0FBQ0EsWUFBSSxDQUFDLFlBQUwsRUFBbUI7QUFDbkIsWUFBSSxhQUFhLE1BQWIsR0FBc0IsR0FBMUIsRUFBK0I7QUFDL0IsYUFBSyxlQUFMLENBQXFCLEdBQXJCLENBQXlCLEVBQUMsT0FBTyxZQUFSLEVBQXpCO0FBQ0g7QUExRmtDLENBQXZCLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IExheW91dCBmcm9tICcuL3ZpZXdzL2xheW91dCc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWFyaW9uZXR0ZS5BcHBsaWNhdGlvbi5leHRlbmQoe1xyXG5cdHJlZ2lvbjogJy5hcHAnLFxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR9LFxyXG5cdHN0YXJ0OiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2hvd1ZpZXcobmV3IExheW91dCgpKTtcclxuXHR9XHJcbn0pOyIsImNvbnN0IEhiVmlldyA9IE1hcmlvbmV0dGUuQmVoYXZpb3IuZXh0ZW5kKHtcbiAgICBsb2FkZWQ6IGZhbHNlLFxuICAgIGluaXRpYWxpemUgKG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IEhCVGVtcGxhdGUgPSB0aGlzLnZpZXcuSEJUZW1wbGF0ZTtcblxuICAgICAgICB0aGlzLnZpZXcuX2xvYWRUZW1wbGF0ZSA9IGZhbHNlO1xuXG4gICAgICAgIC8vR2V0IHBhdGggdGVtcGxhdGVcbiAgICAgICAgaWYoIUhCVGVtcGxhdGUpIHJldHVybiBjb25zb2xlLndhcm4oXCJIQlRlbXBsYXRlIGlzIG5vdCBkZWZpbmVkXCIpO1xuXG4gICAgICAgIC8vQ2hlY2sgY2FjaGUgb2JqXG4gICAgICAgIGlmKEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0gPSBBcHAuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IEhCVGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAndGV4dCdcbiAgICAgICAgICAgICAgICB9KS50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL0FkZCB0byBjYWNoZVxuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy52aWV3LmlzRGVzdHJveWVkKCkpIHtcbiAgICAgICAgICAgICAgICBBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0gPSByZXNwO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VGVtcGxhdGUoQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdKTtcbiAgICAgICAgICAgICAgICBpZihfLmlzRnVuY3Rpb24odGhpcy52aWV3Lm9uTG9hZFRlbXBsYXRlKSkgdGhpcy52aWV3Lm9uTG9hZFRlbXBsYXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gcmVzb2x2ZShyZXNwKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vQ2hlY2sgY3VycmVudCBydW5uaW5nIFByb21pc2VcbiAgICAgICAgaWYoXy5pc0Z1bmN0aW9uKEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXS50aGVuKSkge1xuICAgICAgICAgICAgQXBwLnRtcENhY2hlW0hCVGVtcGxhdGVdLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgICAgICAgICAgLy9BZGQgdG8gY2FjaGVcbiAgICAgICAgICAgICAgICBBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0gPSByZXNwO1xuICAgICAgICAgICAgdGhpcy5zZXRUZW1wbGF0ZShBcHAudG1wQ2FjaGVbSEJUZW1wbGF0ZV0pO1xuICAgICAgICAgICAgaWYoXy5pc0Z1bmN0aW9uKHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSkpIHRoaXMudmlldy5vbkxvYWRUZW1wbGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLy9UZW1wbGF0ZSBsb2FkZWQsIGp1c3Qgc2V0IHRlbXBsYXRlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNldFRlbXBsYXRlKEFwcC50bXBDYWNoZVtIQlRlbXBsYXRlXSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldFRlbXBsYXRlICh0ZW1wbGF0ZSkge1xuICAgICAgICBsZXQgdG1wID0gaGFuZGxlYmFycy5jb21waWxlKHRlbXBsYXRlKVxuICAgICAgICB0aGlzLnZpZXcudGVtcGxhdGUgPSBkYXRhID0+IHRtcChkYXRhKTtcbiAgICAgICAgdGhpcy52aWV3Ll9sb2FkVGVtcGxhdGUgPSB0cnVlO1xuICAgIH0sXG4gICAgb25BdHRhY2ggKCkge1xuICAgICAgICBpZihfLmlzRnVuY3Rpb24odGhpcy52aWV3Lm9uTG9hZFRlbXBsYXRlKSAmJiB0aGlzLmxvYWRlZCA9PT0gdHJ1ZSkgdGhpcy52aWV3Lm9uTG9hZFRlbXBsYXRlKCk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEhiVmlldyIsImltcG9ydCBUb2RvYXBwIGZyb20gJy4vYXBwJztcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICB3aW5kb3cuQXBwID0gbmV3IFRvZG9hcHAoKTtcbiAgICBBcHAuc3RhcnQoKTtcbn0pO1xuIiwiaW1wb3J0IGhicyBmcm9tICcuLi9iZWhhdmlvcnMvaGJzJztcblxudmFyIGNvbmZpZyA9IHtcbiAgICBhcGlLZXk6IFwiQUl6YVN5QkYyaEVCTWJHS2VRTTNqa25Gc3RBTjBXNmVCN08zeTJNXCIsXG4gICAgYXV0aERvbWFpbjogXCJtYXJpb25ldHRlLXRvZG8tYXBwLmZpcmViYXNlYXBwLmNvbVwiLFxuICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vbWFyaW9uZXR0ZS10b2RvLWFwcC5maXJlYmFzZWlvLmNvbVwiLFxuICAgIHByb2plY3RJZDogXCJtYXJpb25ldHRlLXRvZG8tYXBwXCIsXG4gICAgc3RvcmFnZUJ1Y2tldDogXCJtYXJpb25ldHRlLXRvZG8tYXBwLmFwcHNwb3QuY29tXCIsXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMjY5MDMwNjI3Nzc2XCJcbn07XG5maXJlYmFzZS5pbml0aWFsaXplQXBwKGNvbmZpZyk7XG5cbnZhciBUYXNrTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2V0KFwidGl0bGVcIikpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KHtcInRpdGxlXCI6IHRoaXMuZGVmYXVsdHMudGl0bGV9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgICAgIGlmICggISQudHJpbShhdHRycy50aXRsZSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gJ9Ce0YjQuNCx0LrQsCEnO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBkZWZhdWx0czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIHRpdGxlOiAn0J3QvtCy0LDRjyDQt9Cw0LTQsNGH0LAnLFxuICAgICAgICAgICAgZG9uZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zYXZlKHsgZG9uZTohdGhpcy5nZXQoXCJkb25lXCIpfSk7XG4gICAgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH1cbn0pO1xuXG52YXIgVGFzayA9IE1hcmlvbmV0dGUuVmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6ICdsaScsXG4gICAgdWk6IHtcbiAgICAgICAgXCJlZGl0XCI6IFwic3BhblwiLFxuICAgICAgICBcInJlbW92ZVwiOiBcIi5yZW1vdmVcIixcbiAgICAgICAgXCJ0b2dnbGVcIjogXCIudG9nZ2xlXCJcbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgICBcImNsaWNrIEB1aS5lZGl0XCI6IFwiZWRpdFRhc2tcIixcbiAgICAgICAgXCJjbGljayBAdWkudG9nZ2xlXCI6IFwidG9nZ2xlRG9uZVwiLFxuICAgICAgICAnY2xpY2sgQHVpLnJlbW92ZSc6ICdyZW1vdmVNb2RlbCdcbiAgICB9LFxuICAgIHRyaWdnZXJzOiB7XG4gICAgICAgICdjbGljayBAdWkucmVtb3ZlJzogJ3JlbW92ZTptb2RlbCdcbiAgICB9LFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCc8c3BhbiBjbGFzcz1cInRleHRcIj4gPCU9IHRpdGxlICU+IDwvc3Bhbj48ZGl2IGNsYXNzPVwiYnRuc1wiPjxidXR0b24gY2xhc3M9XCJ0b2dnbGUgYnRuIGJ0bi1zdWNjZXNzXCIgdHlwZT1cImJ1dHRvblwiPjxpIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1va1wiPjwvaT48L2J1dHRvbj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInJlbW92ZSBidG4gYnRuLWRhbmdlclwiPjxpIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L2k+PC9idXR0b24+PC9kaXY+JyksXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cbiAgICB9LFxuICAgIHJlbW92ZU1vZGVsOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHRoaXMubW9kZWwuY2xlYXIoKTtcbiAgICB9LFxuICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ2RvbmUnLCB0aGlzLm1vZGVsLmdldCgnZG9uZScpKTtcbiAgICB9LFxuICAgIGVkaXRUYXNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG5ld1Rhc2tUaXRsZSA9IHByb21wdCgn0JjQt9C80LXQvdC40YLRjCDQt9Cw0LTQsNGH0YMnLCB0aGlzLm1vZGVsLmdldCgndGl0bGUnKSk7XG4gICAgICAgIHRoaXMubW9kZWwuc2F2ZSh7XCJ0aXRsZVwiOiBfLmVzY2FwZShuZXdUYXNrVGl0bGUpfSx7dmFsaWRhdGU6dHJ1ZX0pO++7v1xuICAgIH0sXG4gICAgdG9nZ2xlRG9uZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdGhpcy5tb2RlbC50b2dnbGUoKTtcbiAgICB9XG59KTtcblxudmFyIFRhc2tDb2xsZWN0aW9uVmlldyA9IE1hcmlvbmV0dGUuQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAndWwnLFxuICAgIGNsYXNzTmFtZTogJ3Rhc2tzJyxcbiAgICBjaGlsZFZpZXc6IFRhc2ssXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLm9uKCdjaGFuZ2UnLCBfLmJpbmQodGhpcy5yZW5kZXIsIHRoaXMpKTtcbiAgICB9LFxuICAgIG9uQ2hpbGR2aWV3UmVtb3ZlTW9kZWw6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5yZW1vdmUodmlldy5tb2RlbCk7XG4gICAgfSxcbiAgICB2aWV3Q29tcGFyYXRvcjogZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIG1vZGVsLmdldCgnZG9uZScpXG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0ICBNYXJpb25ldHRlLlZpZXcuZXh0ZW5kKHtcbiAgICB0ZW1wbGF0ZTogZGF0YSA9PiAnbWFpbiB2aWV3JyxcbiAgICBiZWhhdmlvcnM6IFtoYnNdLFxuICAgIEhCVGVtcGxhdGU6ICcvdGVtcGxhdGVzL2xheW91dC5oYnMnLFxuICAgIGNsYXNzTmFtZTogJ21haW4tYXBwJyxcbiAgICByZWdpb25zOiB7XG4gICAgICAgIGxpc3Q6IHtcbiAgICAgICAgICAgIGVsOiAnI3dyYXBwZXInXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVpOiB7XG4gICAgICAgIGFkZHRhc2s6ICcuYWRkdGFzaycsXG4gICAgICAgIGxvZ091dDogJy5sb2dvdXRfX2J0bicsXG4gICAgICAgIGF1dGhvcml6ZTogJy5hdXRob3JpemF0aW9uX19idG4nLFxuICAgICAgICByZWdpc3RlcjogJy5yZWdpc3RyYXRpb25fX2J0bidcbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgQHVpLmFkZHRhc2snOiAnYWRkVGFzaycsXG4gICAgICAgICdjbGljayBAdWkubG9nT3V0JzogJ2xvZ091dCcsXG4gICAgICAgICdjbGljayBAdWkuYXV0aG9yaXplJzogJ2F1dGhvcml6ZVVzZXInLFxuICAgICAgICAnY2xpY2sgQHVpLnJlZ2lzdGVyJzogJ3JlZ2lzdGVyVXNlcidcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGZpcmViYXNlLmF1dGgoKS5vbkF1dGhTdGF0ZUNoYW5nZWQoZnVuY3Rpb24gKGZpcmViYXNlVXNlcikge1xuICAgICAgICAgICAgaWYgKGZpcmViYXNlVXNlcikge1xuICAgICAgICAgICAgICAgIHZhciBlbWFpbCA9IGZpcmViYXNlVXNlci5lbWFpbDtcbiAgICAgICAgICAgICAgICB2YXIgdXNlck5pY2tuYW1lID0gZW1haWwuc3Vic3RyaW5nKDAsIGVtYWlsLmluZGV4T2YoJ0AnKSk7XG4gICAgICAgICAgICAgICAgJCgnLmF1dG9yaXphdGlvbicpLmFkZENsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgJCgnI2FwcGxpY2F0aW9uJykuZmFkZUluKCk7XG4gICAgICAgICAgICAgICAgJCgnLnVzZXItbmFtZScpLmh0bWwodXNlck5pY2tuYW1lKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVXNlciAnKyB1c2VyTmlja25hbWUgKycgbG9nZ2VkIEluJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuaW5pdEN1cnJlbnRVc2VyKGZpcmViYXNlVXNlciwgdXNlck5pY2tuYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vdCBsb2dnZWQgSW4nKTtcbiAgICAgICAgICAgICAgICAkKCcuYXV0b3JpemF0aW9uJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAkKCcjYXBwbGljYXRpb24nKS5mYWRlT3V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSxcbiAgICBpbml0Q3VycmVudFVzZXI6IGZ1bmN0aW9uIChmaXJlYmFzZVVzZXIsIHVzZXJOaWNrbmFtZSkge1xuXG4gICAgICAgIHZhciBUYXNrc0NvbGxlY3Rpb24gPSBCYWNrYm9uZS5GaXJlYmFzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgICAgICAgICBtb2RlbDogVGFza01vZGVsLFxuICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9tYXJpb25ldHRlLXRvZG8tYXBwLmZpcmViYXNlaW8uY29tL1VzZXJzLycrIHVzZXJOaWNrbmFtZSArJydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50YXNrc0NvbGxlY3Rpb24gPSBuZXcgVGFza3NDb2xsZWN0aW9uKCk7XG4gICAgICAgIHRoaXMudGFza0NvbGxlY3Rpb25WaWV3ID0gbmV3IFRhc2tDb2xsZWN0aW9uVmlldyh7XG4gICAgICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLnRhc2tzQ29sbGVjdGlvblxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNob3dDaGlsZFZpZXcoJ2xpc3QnLCB0aGlzLnRhc2tDb2xsZWN0aW9uVmlldyk7XG4gICAgfSxcbiAgICBhdXRob3JpemVVc2VyOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGVtYWlsID0gdGhpcy4kKCcuZW1haWxfX2lucHV0JykudmFsKCksXG4gICAgICAgICAgICBwYXNzID0gdGhpcy4kKCcucGFzc19faW5wdXQnKS52YWwoKTtcblxuICAgICAgICB2YXIgYXV0aCA9IGZpcmViYXNlLmF1dGgoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBhdXRoLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKGVtYWlsLCBwYXNzKTtcbiAgICAgICAgcHJvbWlzZS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgYWxlcnQoZS5tZXNzYWdlKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIHJlZ2lzdGVyVXNlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZW1haWwgPSB0aGlzLiQoJy5lbWFpbF9faW5wdXQnKS52YWwoKSxcbiAgICAgICAgICAgIHBhc3MgPSB0aGlzLiQoJy5wYXNzX19pbnB1dCcpLnZhbCgpO1xuXG4gICAgICAgIHZhciBhdXRoID0gZmlyZWJhc2UuYXV0aCgpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGF1dGguY3JlYXRlVXNlcldpdGhFbWFpbEFuZFBhc3N3b3JkKGVtYWlsLCBwYXNzKTtcblxuICAgICAgICBwcm9taXNlLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBhbGVydChlLm1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGxvZ091dDogZnVuY3Rpb24gKCkge1xuICAgICAgICBmaXJlYmFzZS5hdXRoKCkuc2lnbk91dCgpXG4gICAgfSxcbiAgICBhZGRUYXNrOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyICRpbnB1dCA9ICQoJy5hZGQnKTtcbiAgICAgICAgdmFyIG5ld1Rhc2tUaXRsZSA9ICRpbnB1dC52YWwoKTtcbiAgICAgICAgbmV3VGFza1RpdGxlID0gXy5lc2NhcGUobmV3VGFza1RpdGxlKTtcbiAgICAgICAgJGlucHV0LnZhbCgnJyk7XG4gICAgICAgIGlmICghbmV3VGFza1RpdGxlKSByZXR1cm47XG4gICAgICAgIGlmIChuZXdUYXNrVGl0bGUubGVuZ3RoID4gMTAwKSByZXR1cm47XG4gICAgICAgIHRoaXMudGFza3NDb2xsZWN0aW9uLmFkZCh7dGl0bGU6IG5ld1Rhc2tUaXRsZX0pO1xuICAgIH1cbn0pO1xuIl19
