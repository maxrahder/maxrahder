Ext.define('Deck.view.content.ContentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.deck-content',
    onKeyMap: function (key, event) {
        this.fireViewEvent('navigate', key);
    }

});