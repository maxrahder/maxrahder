/**
	Shows a edit/view panel in the specified DOM element
*/

Ext.define('EditView.view.editview.PreTagEditAndView', {
	extend: 'Ext.panel.Panel',
	requires: [
		'EditView.view.editview.AceEditor',
		'EditView.view.editview.JavaScriptViewWrapper'
	],

	xtype: 'pretageditandview',

	config: {

		pre: null, // required -- a reference to a pre (or any element)
		text: '',
		headHtml: []

	},

	resizable: {
		handles: 's'
	},

	layout: 'card',

	defaultLibrary: 'ext4', // override this in your code for a different default
	
	getSettingsBasedOnTag: function(element) {

		var result = {
			library: this.defaultLibrary,
			editMode: 'javascript', // xml, json, css, sass, html, javascript, text
			allowEditing: true,
			run: false,
			readOnly: false,
			height: 400
		};

		// run implies javascript
		result.run = element.hasCls('run');
		if (result.run) {
			result.editMode = 'javascript';
		}

		result.library = element.hasCls('touch2') ? 'touch2' : result.library;
		result.library = element.hasCls('ext5') ? 'ext5' : result.library;
		result.library = element.hasCls('ext4') ? 'ext4' : result.library;
		result.library = element.hasCls('classic') ? 'classic' : result.library;
		result.library = element.hasCls('modern') ? 'modern' : result.library;

		var modes = ['xml', 'json', 'javascript', 'sass', 'css', 'html', 'text'];
		for (var i = 0; i < modes.length; i++) {
			var mode = modes[i];
			result.editMode = element.hasCls(mode) ? mode : result.editMode;
		}

		// Only javascript can be run
		if (result.editMode === 'javascript') {
			result.run = element.hasCls('run');
			result.library = element.hasCls('touch2') ? 'touch2' : result.library;
			result.library = element.hasCls('ext5') ? 'ext5' : result.library;
			result.library = element.hasCls('ext4') ? 'ext4' : result.library;
			result.library = element.hasCls('classic') ? 'classic' : result.library;
			result.library = element.hasCls('modern') ? 'modern' : result.library;
		} else {
			result.library = '';
			result.run = false;
		}

		result.readOnly = element.hasCls('readonly');

		// Determine height
		var classes = Ext.String.splitWords(element.dom.className);
		for (var i = 0; i < classes.length; i++) {
			var number = Ext.Number.from(classes[i], 0);
			if (number) {
				result.height = number;
				break;
			}
		}

		return result;
	},

	initComponent: function() {

		var me = this;

		me.pre = Ext.get(me.pre);

		var settings = me.getSettingsBasedOnTag(me.pre);

		me.height = settings.height;

		// me.renderTo = me.pre; // Isn't working in DOM element that isn't in the document

		me.setText(Ext.String.htmlDecode(me.pre.dom.innerHTML));
		me.pre.dom.innerHTML = '';

		var viewable = !settings.readOnly && Boolean(settings.library); // specifying library implies it's viewable

		var createToolbar = settings.allowEditing && viewable;
		if (createToolbar) {
			this.tbar = this.getTbarConfig();
			var libraryUrl = EditView.view.editview.JavaScriptViewer[settings.library].scriptUrls[0];
			var config = {
				xtype: 'tbtext',
				style: '{color: #aaaaaa}',
				text: libraryUrl
			};
			this.tbar.push(config);
		}
		me.items = [];
		if (settings.allowEditing) {
			me.items.push({
				xtype: 'aceeditor',
				itemId: 'aceeditor',
				readOnly: settings.readOnly,
				mode: settings.editMode,
				text: me.getText(),
				listeners: {
					change: {
						fn: me.codeChangeHandler,
						scope: me
					}
				}
			});
		}
		if (viewable) {
			me.items.push({
				xtype: 'javascriptviewwrapper',
				itemId: 'viewwrapper',
				library: settings.library,
				headHtml: me.getHeadHtml(),
				code: me.getText()
			});
		}

		me.pre.removeCls('x-hidden');
		me.pre.removeCls('runnable');
		me.pre.addCls('editview');

		this.callParent();

		// The following could go in the afterRender I suppose...

		if (settings.run) {
			me.showView();
		} else {
			me.showCode();
		}

		if (createToolbar) {
			if (settings.run) {
				me.down('button#showview').toggle(true);
			} else {
				me.down('button#showcode').toggle(true);
			}
		}

	},
	codeChangeHandler: function(editor, text) {
		this.setText(text);
	},

	showCode: function(code) {

		if (this.down('toolbar')) {
			this.down('button#showcode').setVisible(false);
			this.down('button#beautify').setVisible(true);
			this.down('button#showview').setVisible(true);
		}

		var editor = this.down('#aceeditor');

		this.getLayout().setActiveItem(editor);
		editor.focusEditor();
	},

	showView: function() {

		if (this.down('toolbar')) {
			this.down('button#showcode').setVisible(true);
			this.down('button#beautify').setVisible(false);
			this.down('button#showview').setVisible(false);
		}

		var view = this.down('#viewwrapper');
		view.setJavaScript(this.getText());
		this.getLayout().setActiveItem(view);
	},

	beautify: function() {
		this.down('aceeditor').beautify();
	},

	getTbarConfig: function() {
		return [{
			xtype: 'button',
			glyph: '110@Pictos',
			itemId: 'showcode',
			allowDepress: false,
			handler: function(button) {
				this.up('pretageditandview').showCode();
			},
			hidden: true
		}, {
			xtype: 'button',
			glyph: '69@Pictos',
			//tooltip: 'Run',
			itemId: 'showview',
			handler: function(button) {
				button.up('pretageditandview').showView();
			},
			hidden: true
		}, {
			xtype: 'button',
			glyph: '104@Pictos',
			//tooltip: 'Beautify',
			itemId: 'beautify',
			handler: function(button) {
				this.up('pretageditandview').beautify();
			},
			hidden: true
		}, '->']
	}

});