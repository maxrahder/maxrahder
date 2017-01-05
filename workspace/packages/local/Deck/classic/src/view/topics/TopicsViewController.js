Ext.define('Deck.view.topics.TopicsViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.topicsviewcontroller',
    requires: ['Deck.store.Topics', 'Deck.model.Node', 'Ext.event.Event'],

    onSaveToolClick: function(panel, tool) {
        this.getViewModel().get('node').persistNode();
    },
    onSearchFieldKeyUp: function(field, event) {
        var me = this;
        if (event.getKey() === Ext.event.Event.RETURN) {
            var value = field.getValue();
            if (value) {
                // Pressing enter searches forward, shift-enter searhces backwards.
                var forward = event.shiftKey;
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
    }

});
