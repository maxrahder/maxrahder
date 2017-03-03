Ext.define('Engine.view.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: [
		'Engine.view.content.Panel',
		'Engine.view.EditToolbar',
		'Ext.layout.container.Border',
		'Ext.form.Panel',
		'Ext.form.field.Number'
	],
	layout: 'fit',
	cls: 'training',
	border: false,
	items: [{
		xtype: 'panel',
		layout: 'border',
		itemId: 'mainPanel',
		style: 'background-color: #aaa',
		border: false,
		dockedItems: [{
			xtype: 'edittoolbar',
			store: 'Topics'
		}],
		items: [{
			xtype: 'training_tree',
			store: 'Topics',

			collapsible: true,
			hideCollapseTool: true,
			animCollapse: true,
			split: true,
			collapseMode: 'mini',

			title: 'Topics',

			width: 250,
			maxWidth: 250,
			region: 'west'

		}, {
			xtype: 'slide',
			region: 'center'
		}]
	}]
});