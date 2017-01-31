Ext.define('Engine.controller.Sync', {
	extend: 'Ext.app.Controller',
	requires: ['Engine.util.PusherClient', 'Engine.util.Cookies'],
	views: ['content.Toolbar'],
	refs: [{
		ref: 'syncWithInstructorButton',
		selector: '#syncWithInstructor'
	}, {
		ref: 'transmittingIcon',
		selector: 'contenttoolbar #transmitting'
	}, {
		ref: 'tree',
		selector: 'training_tree'
	}],
	config: {
		sync: false,
		slideId: null // Flag that it has never been set
	},
	init: function() {
		var me = this;

		Engine.Sync = this;

		this.control({

			'#syncWithInstructor': {
				toggle: this.toggleButtonHandler,
				render: this.initializeSyncButton
			},
			'training_tree': {
				itemdblclick: this.itemdblclickHandler,
				itemclick: this.itemClickHandler
			}

		});

		Engine.courseEdition = Engine.Global.getCookie('_nouveau_course_version');
		Engine.classId = Engine.Global.getCookie('_nouveau_section_id', '000');

		Engine.util.PusherClient.setScheduledClassId(Engine.classId);


		Engine.model.Node.on('change', this.onNodeChange, this);

		Engine.util.PusherClient.on('slidechange', this.slideChangeHandler, this);
		Engine.util.PusherClient.on('connected', function(pusher) {
			this.initializeSyncButton;
		}, this);

	},
	itemdblclickHandler: function(tree, record, element, index, event) {
		// Turn on instructor syncing via pressing Command-shift double click
		// on any tree node.
		if (event.ctrlKey && event.shiftKey) {
			Engine.instructor = !Engine.instructor;
			if (Engine.instructor) {
				this.getTransmittingIcon().show();
			} else {
				this.getTransmittingIcon().hide();
			}
		}
	},

	determineScheduledClassId: function(callback) {
		var result = '';
		var cookieName = '_nouveau_section_id=';
		var cookieIndex = document.cookie.indexOf(cookieName);
		if (cookieIndex > -1) {
			var s = document.cookie.substr(cookieIndex + cookieName.length);
			var endIndex = s.indexOf(';');
			var result = (endIndex > -1) ? s.substr(0, endIndex) : s;
		} else {
			result = new Date().getTime();
		}
		callback(result);
	},

	itemClickHandler: function(tree, record) {
		this.setSync(false);
	},

	onNodeChange: function(node) {
		if (Engine.instructor) {
			Engine.util.PusherClient.broadcastPageId(node.getRecord().get('fileId'));
		}
	},
	goToSlide: function() {
		if (this.getSlideId()) {
			this.getTree().search(this.getSlideId(), false);
		}
	},
	updateSlideId: function(slideId) {
		if (this.getSync()) {
			this.goToSlide();
		}
	},
	updateSync: function(sync) {
		if (this.getSyncWithInstructorButton()) {
			this.getSyncWithInstructorButton().setChecked(sync);
		}
		if (sync) {
			this.goToSlide();
		}
	},
	toggleButtonHandler: function(button, pressed) {
		this.setSync(pressed);
	},

	slideChangeHandler: function(pusher, id) {
		this.setSlideId(id);
	},

	initializeSyncButton: function() {
		var button = this.getSyncWithInstructorButton();
		if (button) {
			if (Engine.util.PusherClient.connected) {
				button.show();
				this.setSync(true);
			}
		}
	}
});