Ext.define('Deck.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.deck-mainviewmodel',
    requires: [
        'Deck.model.Node',
    ],

    data: {},
    formulas: {},
    stores: {
        topics: {
            type: 'tree',
            root: {

            }
        }
    }

});