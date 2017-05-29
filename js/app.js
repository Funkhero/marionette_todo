$(function() {

	"use strict";

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
	initialize: function() {
		if (!this.get("title")) {
			this.set({"title": this.defaults.title});
		}
	},
	validate: function(attrs) {
		if ( !$.trim(attrs.title) ) {
			return 'Ошибка!';
		}
	},
	defaults: function() {
		return{
			title: 'Новая задача',
			done: false
		}
	},
	toggle: function() {
		this.save({ done:!this.get("done")});
	},
	clear: function() {
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
	initialize: function() {

	},
	removeModel: function(event){
		this.model.clear();
	},
	onRender: function() {
		this.$el.toggleClass('done', this.model.get('done'));
	},
	editTask: function() {
		var newTaskTitle = prompt('Изменить задачу', this.model.get('title'));
		this.model.save({"title": _.escape(newTaskTitle)},{validate:true});﻿
	},
	toggleDone: function(event) {
		this.model.toggle();
	}
});

var TaskCollectionView = Marionette.CollectionView.extend({
	tagName: 'ul',
	className: 'tasks',
	childView: Task,
	initialize: function(){
		this.collection.on('change', _.bind(this.render, this));
	},
	onChildviewRemoveModel: function (view) {
		this.collection.remove(view.model);
	},
	viewComparator: function(model) {
		return model.get('done')
	}
});

var MainView = Marionette.View.extend({
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
	template: function () {
		return '<div class="autorization"><h4 class="autorization__title">Добро пожаловать в приложение ToDo</h4> <input type="email" class="form-control email__input" placeholder="Email"><input type="password" class="form-control pass__input" placeholder="Password"><button class="authorization__btn btn btn-success btn-lg"> Войти </button> <button class="registration__btn btn btn-default btn-lg"> Зарегистрироватся </button> </div> <div class="container"> <div class="row"> <div class="col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12 "> <div id="application"> <h1>Список задач</h1><p>Пользоваетль: <span class="user-name">Неизвестный пользователь</span> <button class="logout__btn btn btn-default btn-md"> Выход </button></p> <form action="" id="addTask" method="get"> <input type="text" class="add form-control" placeholder="Ваша новая задача"> <button type="submit" class="addtask btn btn-default">Добавить</button> </form> <div id="wrapper"></div> </div> </div> </div> </div>';
	},
	initialize: function () {

		var _this = this;

		firebase.auth().onAuthStateChanged(function (firebaseUser) {
			if (firebaseUser) {
				var email = firebaseUser.email;
				var userNickname = email.substring(0, email.indexOf('@'));
				$('.autorization').addClass('hide');
				$('#application').fadeIn();
				$('.user-name').html(userNickname);
				console.log('User '+ userNickname +' logged In');
				_this.initCurrentUser(firebaseUser, userNickname);
			} else {
				console.log('Not logged In');
				$('.autorization').removeClass('hide');
				$('#application').fadeOut();
			}
		});

	},
	initCurrentUser: function (firebaseUser, userNickname) {

		var TasksCollection = Backbone.Firebase.Collection.extend({
			model: TaskModel,
			url: 'https://marionette-todo-app.firebaseio.com/Users/'+ userNickname +''
		});

		this.tasksCollection = new TasksCollection();
		this.taskCollectionView = new TaskCollectionView({
			collection: this.tasksCollection
		});

		this.showChildView('list', this.taskCollectionView);
	},
	authorizeUser: function (event) {
		var email = this.$('.email__input').val(),
			pass = this.$('.pass__input').val();

		var auth = firebase.auth();
		var promise = auth.signInWithEmailAndPassword(email, pass);
		promise.catch(function (e) {
			alert(e.message);
		})
	},
	registerUser: function () {
		var email = this.$('.email__input').val(),
			pass = this.$('.pass__input').val();

		var auth = firebase.auth();
		var promise = auth.createUserWithEmailAndPassword(email, pass);

		promise.catch(function (e) {
			alert(e.message);
		});
	},
	logOut: function () {
		firebase.auth().signOut()
	},
	addTask: function (event) {
		event.preventDefault();
		var $input = $('.add');
		var newTaskTitle = $input.val();
		newTaskTitle = _.escape(newTaskTitle);
		$input.val('');
		if (!newTaskTitle) return;
		if (newTaskTitle.length > 100) return;
		this.tasksCollection.add({title: newTaskTitle});
	}
});

var MyApp = Marionette.Application.extend({
	region: '.main-app',
	initialize: function() {

	},
	start: function() {
		this.showView(new MainView());
	}
});

var myApp = new MyApp();

myApp.start();

});