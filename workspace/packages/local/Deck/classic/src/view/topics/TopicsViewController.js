Ext.define('Deck.view.topics.TopicsViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.topicsviewcontroller',
    requires: ['Deck.store.Topics', 'Deck.model.Node', 'Ext.event.Event'],

    onArrowClick: function(button) {
        var me = this;
        var value = me.lookup('searchfield').getValue();
        if (value) {
            var forward = (button.itemId === 'right');
            me.goToPage(value, forward);
        }
    },
    onSearchFieldKeyUp: function(field, event) {
        var me = this;
        if (event.getKey() === Ext.event.Event.RETURN) {
            var value = field.getValue();
            if (value) {
                // Pressing enter searches forward, shift-enter searhces backwards.
                var forward = event.shiftKey;
                me.goToPage(value, forward);
            }
        }
    },
    goToPage: function(value, forward) {
        var me = this;
        if (value) {
            // Pressing enter searches forward, shift-enter searhces backwards.
            var vm = me.getViewModel();
            var store = vm.get('topics');
            var node = vm.get('node');
            var found = store.findNode(node, value, forward);
            if (found) {
                me.getView().setSelection(found);
                var parent = found.parentNode;
                while (parent) {
                    parent.expand();
                    parent = parent.parentNode;
                }
            }
        }
    }

});
