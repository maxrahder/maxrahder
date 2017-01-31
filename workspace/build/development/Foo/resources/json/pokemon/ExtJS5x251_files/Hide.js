Ext.define('Engine.controller.Hide', {
    extend: 'Ext.app.Controller',

    views: ['Tree', 'LinkWindow'],
    stores: ['Topics'],
    models: ['Topic', 'Node'],

    requires: [],

    init: function() {

        // This won't work if you're editing, or the tree will get
        // overwritten with the modified tree.
        if (Engine.editing) {
            return;
        }

        Engine.hideMode = Ext.Object.fromQueryString(location.search.substring(1)).hideMode;

        var me = this;

        Engine.Hide = me; // For debugging convenience

        if (Engine.hideMode) {
            Ext.getStore('Topics').on('update', this.onTopicsUpdate, this);
            this.bufferedSaveHidden = Ext.Function.createBuffered(this.saveHidden, 1000, this);

        } else {
            Ext.getStore('Topics').on({
                load: {
                    fn: this.onTopicsLoadFirstTime,
                    scope: me,
                    single: true
                }
            });
        }

    },
    onTopicsLoadFirstTime: function(store) {
        Ext.Ajax.request({
            url: Engine.Global.hiddenPath,
            success: function(response) {
                var hidden = Ext.JSON.decode(response.responseText);
                store.suspendEvents();
                var root = store.getRootNode();
                Ext.Array.forEach(hidden, function(hide) {
                    var record = root.findChild('fileId', hide, true);
                    if (record) {
                        record.remove();
                    }
                });
                store.resumeEvents();
                store.numberLabs();
            }
        });
    },
    onTopicsUpdate: function(store, record) {
        var me = this;
        me.hidden = me.hidden || [];
        if (record.data.hidden) {
            Ext.Array.include(me.hidden, record.data.fileId);
        } else {
            Ext.Array.remove(me.hidden, record.data.fileId);
        }
        me.bufferedSaveHidden();
    },
    saveHidden: function() {
        var me = this;
        if (Engine.editing) {
            return;
        }
        me.hidden = me.hidden || [];
        var s = Ext.JSON.encode(me.hidden);
        Ext.Ajax.request({
            url: Engine.Global.backendSaveHiddenUrl,
            method: 'post',
            params: {
                content: s
            },
            success: function(response) {},
            failure: function(response) {
                Ext.Msg.alert('Error', 'Engine.Hidden.saveHidden');
                console.log(response);
            }
        });
    }

});