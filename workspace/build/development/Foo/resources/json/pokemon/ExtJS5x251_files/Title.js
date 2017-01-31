Ext.define('Engine.view.content.page.Title', {
	extend: 'Ext.Component',

	xtype: 'training_titlepage',

	cls: 'title topic',

	tpl: [
		'<div class="head">',

		'<h1>{title}</h1>',
		'{body}',
		'</div>',
		'<div class="footer">',
		Engine.Global.copyrightNotice,
		'<tpl if=version>',
		'<br>{version}',
		'</tpl>',
		'</div>'	],

	updateContent: function(node, data) {
		this.update(data);
	}

});