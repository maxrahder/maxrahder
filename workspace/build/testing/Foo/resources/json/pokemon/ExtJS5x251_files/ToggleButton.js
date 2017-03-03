/* based on: http://proto.io/freebies/onoff/ */
Ext.define('Engine.view.util.ToggleButton', {
	extend: 'Ext.Component',
	xtype: 'togglebutton',
	config: {
		checked: true,
		onText: 'on',
		offText: 'off'
	},
	tpl: ['<div class="onoffswitch">',
		'<input type="checkbox" name="onoffswitch" id="myonoffswitch" class="onoffswitch-checkbox" {checked}>',
		'<label class="onoffswitch-label" for="myonoffswitch">',
		'<span class="onoffswitch-on"></span>',
		'<span class="onoffswitch-inner" data-onText="{onText}" data-offText="{offText}"></span>',
		'<span class="onoffswitch-switch"></span>',
		'</label></div>'
	],
	initComponent: function() {

		this.data = {
			checked: this.getChecked() ? 'checked' : '',
			onText: this.getOnText(),
			offText: this.getOffText()
		};
		this.callParent();

	},
	updateChecked: function(checked) {
		if (this.rendered) {
			this.getEl().down('#myonoffswitch').dom.checked = checked;
		}
		this.fireEvent('toggle', this, checked);
	},
	onRender: function() {
		var me = this;
		me.callParent();
		var cbElement = me.getEl().down('#myonoffswitch');
		cbElement.on('change', function(event, target) {
			me.setChecked(target.checked);
		});
	}
});