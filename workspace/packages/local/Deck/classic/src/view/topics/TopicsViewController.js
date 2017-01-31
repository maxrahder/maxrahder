Ext.define('Deck.view.topics.TopicsViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.topicsviewcontroller',
    requires: ['Deck.store.Topics', 'Deck.model.Node', 'Ext.event.Event'],

    onArrowClick: function(button) {
        var me = this;
        var value = me.lookup('searchfield').getValue();
        var next = (button.getItemId() === 'right');
        me._findPage(value, next);
    },
    onSearchFieldKeyUp: function(field, event) {
        var me = this;
        if (event.getKey() === Ext.event.Event.RETURN) {
            var value = field.getValue();
            var next = !event.shiftKey;
            me._findPage(value, next);
        }
    },
    _findPage: function(value, next) {
        var me = this;
        if (value) {
            var vm = me.getViewModel();
            vm.get('topics').findNode(vm.get('node'), value, next);
        }
    }

});
