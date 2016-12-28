Ext.define('Deck.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.deck-mainviewmodel',
    requires: [
        'Deck.model.Node',
        'Deck.store.Topics'
    ],

    data: {},
    formulas: {},
    stores: {
        topics: {
            type: 'tree',
            model: 'Deck.model.Node',
            root: {
                leaf: true
            }
        }
    }

});
