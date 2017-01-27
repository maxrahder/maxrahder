Ext.define('Deck.view.edit.ToolbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.edit-toolbar',
    requires: ['Deck.util.Backend'],

    init: function() {
        var me = this;
    },

    initViewModel: function(vm) {
        var me = this;
        vm.bind('{node.text}', function(text) {
            me.lookup('nodeTitle').setValue(text);
        });

        vm.bind('{topics}', function(topics) {
            topics.on('update', me.onTopicsUpdate, me);
        });

    },

    onTopicsUpdate: function(store, record, operation, modifiedFieldNames) {
        if (!modifiedFieldNames) return;
        if (Ext.Array.contains(modifiedFieldNames, 'children')) {
            console.log('children changed');
        } else if (Ext.Array.contains(modifiedFieldNames, 'i18n')) {
            Deck.util.Backend.persistNodeBuffered(record);
            Deck.util.Backend.saveTreeBuffered(this.getViewModel().get('topics'));
        }
    },

    onTitleChange: function(field, value) {
        var me = this;
        node = me.getViewModel().get('node');
        node.updateText(value);
    },

    onCreateLeaf: function(button) {
        var selection = this.getViewModel().get('node');
        if (selection) {

        }
    },
    onCreateTopic: function(button) {

    }



});
