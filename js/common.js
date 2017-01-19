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
			return {	
				title: 'Новая задача',
		 		done: false
			};
		},
		toggle: function() {
	      	this.set({ done:!this.get("done")});
	    }
	})


var TasksCollectionView = Backbone.View.extend({
		el: '.tasks',
		initialize: function() {
			this.collection.on('add', this.addOne, this);
			
		},
		render: function() {
			this.collection.each(this.addOne, this);
			return this;
		},
		addOne: function(task) {
			//Создать новый дочерний вид
			var taskView = new TaskItem({ model: task });
			//Добавить его в родителький элемент
			this.$el.append( taskView.render().el );
		}
	});

	//
	var TaskItem = Backbone.View.extend({
		tagName: 'li',
		initialize: function() {
			this.model.on('change', _.bind(this.render, this));
			this.model.on('destroy', this.remove, this);
		},
		template: function(model) {
			var tmp = _.template('<span> <%= title %> </span><input class="remove" type="button" value="Удалить"><input class="toggle" type="button" value="Чек">');
			return tmp(model)
		},
		render: function(model) {
			this.$el.toggleClass('done', this.model.get('done'));
			this.$el.html(this.template(this.model.attributes))
			return this;
		},
		events: {
			'click span': 'editTask',
			'click .remove': 'destroy',
			'click .toggle': "toggleDone"
		},
		destroy: function() {
			this.$el.remove();
		},
		editTask: function() {
			var newTaskTitle = prompt('Изменить задачу', this.model.get('title'));
			this.model.set({"title":newTaskTitle},{validate:true});﻿
		},
		toggleDone: function() {
	      this.model.toggle();
	    }
	});


	var TasksCollection = Backbone.Collection.extend({
				model: TaskModel
			});

		var App = Backbone.View.extend({
		el: '#addTask',
		initialize: function() {
			//main collection

			this.tasksCollection = new TasksCollection();

			//view main collection
			this.tasksCollectionView = new TasksCollectionView({
				collection: this.tasksCollection
			});
		},
		events: {
			'click .addtask': 'addTask'
		},
		addTask: function (event) {
			event.preventDefault()
			var newTaskTitle = this.$el.find('.add').val();
			this.$el.find('.add').val('');
			if (!newTaskTitle) return;
			this.tasksCollection.add({ title: newTaskTitle });
		},


	})


	window.App = new App();

})


// view = new Mn.CollectionView({
// 	collection: ...
// 	childView: TaskItemView,
// 	emptyView: 
// })