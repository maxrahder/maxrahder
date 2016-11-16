// Ext.Loader.setConfig({
// 	disableCaching: false
// });

Ext.application({

	requires: ['EditView.view.editview.PreTagEditAndView'],

	name: 'CodeMirrorTest',


	launch: function () {

		Ext.select('pre').each(function (element) {

			console.dir(element);

			Ext.create('EditView.view.editview.PreTagEditAndView', {
				pre: element.dom,
				renderTo: element.dom
			});



		});
		console.log('removeCls()');
		Ext.getBody().removeCls('x-hidden');

	}
});