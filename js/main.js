$(function() {
	
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
	fetch: function(){
		 ajaxSync: true 
	},
	save: { 
		new: "title", 
		ajaxSync: true 
	}
});	

var TasksCollection = Backbone.Collection.extend({
	model: TaskModel,
	localStorage: new Backbone.LocalStorage("todos-backbone")
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
		"click @ui.toggle": "toggleDone" 
	},
	triggers: {
		'click @ui.remove': 'remove:model'
	},
	initialize: function() {
		// this.model.on('change', _.bind(this.render, this));
	},
	template: function(model) {
		var tmp = _.template('<span> <%= title %> </span><input class="remove" type="button" value="Удалить"><input class="toggle" type="button" value="Чек">');
		return tmp(model)
	},
	onRender: function() {
		this.$el.toggleClass('done', this.model.get('done'));
	},
	editTask: function() {
		var newTaskTitle = prompt('Изменить задачу', this.model.get('title'));
		this.model.save({"title":newTaskTitle},{validate:true});﻿
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
		$('.addtask').on('click', _.bind(this.addTask, this));
	},
	onChildviewRemoveModel (view) {
		this.collection.remove(view.model);
	},
	addTask: function (event) {
		event.preventDefault()
		var newTaskTitle = $('.add').val();
		$('.add').val('');
		if (!newTaskTitle) return;
		this.collection.add({ title: newTaskTitle });
	}
});

var MyApp = Marionette.Application.extend({
	region:  '#wrapper',
	initialize: function() {
		this.tasksCollection = new TasksCollection();

		this.taskCollectionView = new TaskCollectionView({
			collection: this.tasksCollection,
			viewComparator: function(model) {
				return model.get('done')
			}
		});
	},
	start: function() {
		var main = this.getRegion();
		main.show(this.taskCollectionView);
	}
});

var myApp = new MyApp();

myApp.start();

});