/**
 
 
 */
Ext.define('EditView.view.editview.AceEditor', {
	extend: 'Ext.Component',
	xtype: 'aceeditor',

	config: {
		text: '',
		mode: 'javascript', // See ace install folder for list of modes
		readOnly: false,
		tabSize: 4,
		fontSize: 14,
		theme: 'ace/theme/chrome'
	},

	updateMode: function(mode) {
		if (this.rendered) {
			var modePath = 'ace/mode/' + mode;
			this.editor.getSession().setMode(modePath);
		}
	},

	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
	},
	onRender: function() {
		var me = this;

		me.callParent();

		me.editor = ace.edit(me.getEl().dom);

		me.editor.setTheme(me.getTheme());

		var modePath = 'ace/mode/' + me.getMode();
		me.editor.getSession().setMode(modePath);

		me.editor.setFontSize(me.getFontSize());
		me.editor.setDisplayIndentGuides(true);
		me.editor.renderer.setShowPrintMargin(false);
		me.editor.session.setTabSize(me.getTabSize());
		me.editor.setValue(me.getText());
		me.editor.setReadOnly(me.getReadOnly());
		me.editor.setHighlightActiveLine(false);

		me.editor.on('change', function() {
			me.setText(me.editor.getValue());
		}, me)

		me.focusEditor();

	},

	beautify: function() {
		this.editor.setValue(js_beautify(this.editor.getValue()));
		this.focusEditor();
	},

	focusEditor: function() {
		if (this.rendered) {
			this.editor.resize(true); // This is required when the editor isn't initially being shown
			this.editor.clearSelection();
			this.editor.gotoLine(0, 0);
			if (this.getReadOnly()) {
				this.editor.focus();
			} else {
				this.editor.blur();
			}
		}
	},
	applyText: function(text) {
		if (Ext.isString(text)) {
			return text;
		}
	},
	updateText: function(text) {
		var me = this;
		if (me.rendered && (text !== me.editor.getValue())) {
			me.editor.setValue(text);
		}
		me.fireEvent('change', this, text);
	}

});