// Is this dead code?

Ext.define('Engine.view.content.page.Topic', {
	extend: 'Ext.Component',

	requires: ['Engine.util.Time', 'Ext.XTemplate'],

	xtype: 'training_contenttopic',

	tpl: Ext.create('Ext.XTemplate',

		'<div class="topic">',
		'<div class="head">',

		'<tpl for="topics">',
		'{[this.topicLine(xindex, values)]}',
		'</tpl>',

		'</div>',

		'<div class="footer">',
		Engine.Global.copyrightNotice,
		'<br/>',
		'{classInfo}',
		'</div>', {
			topicLine: function(count, topic) {
				var tag = (count === 1) ? 'h1>' : 'h2>';
				var result = '<' + tag + topic + '</' + tag;
				return result;
			}
		}),

	updateContent: function(node, data) {
		//console.log('updateContent');
		var o = {
			topics: []
		};
		if (node.isTopic()) {
			o.topics = node.getTopicArray();
		}
		var classInfo = 'Class ID: ' + Engine.classId;
		if (Engine.courseEdition) {
			classInfo += ' &mdash; ' + 'Course Edition: ' + Engine.courseEdition;
		}
		o.classInfo = classInfo;
		this.update(o);


	}


});