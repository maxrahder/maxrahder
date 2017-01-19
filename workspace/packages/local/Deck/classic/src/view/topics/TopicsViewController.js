Ext.define('Deck.view.topics.TopicsViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.topicsviewcontroller',
    requires: ['Deck.store.Topics', 'Deck.model.Node', 'Ext.event.Event'],

    onArrowClick: function(button) {
        var me = this;
        var value = me.lookup('searchfield').getValue();
        if (value) {
            var forward = (button.getItemId() === 'right');
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
    }

});
