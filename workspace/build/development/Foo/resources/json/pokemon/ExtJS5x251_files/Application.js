Ext.Loader.setPath('Docs', '../jsduck/template/app');
Ext.define('Engine.Application', {
	extend: 'Ext.app.Application',

	requires: [

		'Engine.Global', // Must be first

		'Engine.util.String',

		'Engine.view.Viewport',
		'Engine.util.Time',
		'Engine.util.Presentation',
		'Engine.util.String',
		'Engine.controller.Hide',
		'Engine.controller.Sync',
		'Engine.controller.Edit',
		'Engine.controller.BulletHighlighting',
		// 'Engine.controller.SkipSlide', // Comment out to omit Hide features

		'Engine.controller.Tree',
		'Engine.util.MarkedOverrides'
	],

	controllers: [
		'Engine.controller.Sync',
		'Engine.controller.Edit',
		'Engine.controller.Hide', // Must be after edit -- hide no work when editing
		// 'Engine.controller.SkipSlide', // Comment out to omit Hide features
		'Engine.controller.Tree',
		'Engine.controller.BulletHighlighting'
	],

	launch: function() {

		// Prevent default save dialog
		Ext.getBody().on('keydown', function(e) {
			if (e.ctrlKey && e.button == 82) {
				e.preventDefault();
			}
		});

		Engine.Viewport = Ext.create('Engine.view.Viewport'); // For command-line convenience
	}

});
