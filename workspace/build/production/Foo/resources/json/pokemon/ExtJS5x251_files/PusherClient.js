// Events: slidechange
Ext.define('Engine.util.PusherClient', {
	extend: 'Ext.util.Observable',
	singleton: true,
	requires: ['Ext.Ajax'],

	config: {
		scheduledClassId: ''
	},

	connected: false,


	updateScheduledClassId: function(classId) {
		
		if (Pusher && classId) {
			var me = this;
			var pusherKey = '9f7625c09d92f0854c74';
			me.pusher = new Pusher(pusherKey);
			me.pusher.connection.bind('connected', function() {
				me.connected = true;
				me.fireEvent('connected', me);
				me.listenToPusherPageSyncEvent();
			}, this);
		}
	},
	broadcastPageId: function(pageId) {
		var me = this;
		var scheduledClassId = me.getScheduledClassId();
		if (scheduledClassId) {
			Ext.Ajax.request({
				url: Engine.Global.backendSyncPusherUrl,
				params: {
					pageId: pageId,
					uuid: scheduledClassId,
					event: 'slideChange'
				}
			});
		}
	},
	listenToPusherPageSyncEvent: function() {
		var me = this;
		var channelId = 'nouveau_' + me.getScheduledClassId();
		me.channel = me.pusher.subscribe(channelId);
		me.channel.bind('slideChange', function(data) {
			me.fireEvent('slidechange', me, data.id);
		});
	}
});