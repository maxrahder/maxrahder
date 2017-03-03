Ext.define('Engine.controller.BulletHighlighting', {
	extend: 'Ext.app.Controller',
	requires: [],

	refs: [{
		ref: 'contentBody',
		selector: 'training_contentbody'
	}],

	config: {
		highlighting: false
	},

	init: function() {

		this.listen({

			global: {
				slidebeforerender: this.slideBeforeRenderHandler,
				slideafterrender: this.slideAfterRenderHandler
			}

		});

	},

	liClickHandler: function(event, target) {
		if (event.ctrlKey) {
			this.toggleHighlighting()
		} else {
			if (this.getHighlighting()) {
				var li = this.getLi();
				this.setOpacity(li, 0.2);
				this.setOpacity(this.flyParent(target, 'LI'), 1.0);
			}
		}
	},

	flyParent: function(target, parentTag) {
		parentTag = parentTag ? parentTag : 'LI';
		if (target.tagName === parentTag) {
			return Ext.fly(target);
		} else {
			return Ext.fly(target).parent('LI');
		}
	},

	toggleHighlighting: function() {
		this.setHighlighting(!this.getHighlighting());
	},
	updateHighlighting: function(highlighting) {
		var li = this.getLi();
		if (highlighting) {
			this.setOpacity(li, 0.2);
		} else {
			this.setOpacity(li, 1.0);
		}
	},

	slideBeforeRenderHandler: function() {
		if (this.getContentBody()) {
			this.getLi().removeAllListeners();
		}
	},
	slideAfterRenderHandler: function() {
		if (this.getContentBody()) {
			this.getLi().on('click', this.liClickHandler, this);
		}
	},

	setOpacity: function(element, opacity) {
		element.setStyle({
			opacity: opacity
		});
	},

	getLi: function() {
		return this.getContentBody().getEl().select('li');
	},


	log: function(message) {
		message = message ? ': ' + message : '';
		console.log(arguments.callee.caller.$name + message);
	}

});