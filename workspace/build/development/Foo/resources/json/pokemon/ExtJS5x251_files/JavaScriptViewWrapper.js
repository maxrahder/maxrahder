/*

A wrapper around the JavaScriptView that provides the library URLs. 
The calling routine specifies library URLs, which are then read-only. 

The calling routine can then use setJavaScript(code) to see the code 
run within the context of the library.

Passing "touch" or "ext" in the library config will use the static 
defaults for those. Otherwise, pass cssUrls, libraryUrl, otherScriptUrls 
and wrapTheCode.

*/
Ext.define('EditView.view.editview.JavaScriptViewWrapper', {

	extend: 'Ext.Container',
	requires: ['EditView.view.editview.JavaScriptViewer'],

	xtype: 'javascriptviewwrapper',

	config: {

		javaScript: '', // This is the only writable config -- calling setJavaScript(code) runs the code
		headHtml: [],
		library: 'ext4'

	},

	updateJavaScript: function(js) {
		this.removeAll();
		this.add({
			xtype: 'javascriptviewer',
			javaScript: js,
			library: this.getLibrary(),
			headHtml: this.getHeadHtml()
		});
	},

	layout: 'fit',
	items: []

});