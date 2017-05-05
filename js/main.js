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
	clear: function() {
      this.destroy();
    }
});

var TasksCollection = Backbone.Firebase.Collection.extend({
	model: TaskModel,
	url: 'https://todo-list-app-faabe.firebaseio.com/todos'
});

// var TasksCollection = Backbone.Collection.extend({
// 	model: TaskModel,
// 	localStorage: new Store("todos-backbone")
// });

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
		'click @ui.remove': 'remove:model',
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
		this.collection.fetch();
	},
	onChildviewRemoveModel: function (view) {
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
	region: '#wrapper',
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