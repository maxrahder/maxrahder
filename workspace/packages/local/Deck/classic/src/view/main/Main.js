Ext.define('Deck.view.main.Main', {
    xtype: 'deck-main',
    extend: 'Ext.panel.Panel',
    requires: [
        'Deck.view.main.MainViewController',
        'Deck.view.main.MainViewModel',
        'Deck.view.topics.Topics',
        'Deck.view.content.Content'
    ],
    controller: 'maincontroller',
    viewModel: {
        type: 'deck-mainviewmodel'
    },

    layout: 'border',
    items: [{
        xtype: 'deck-topics',
        region: 'west',
        collapsible: true,
        collapseMode: 'mini',
        titleCollapse: true,
        reference: 'tree',
        split: true,
        width: 200,
        listeners: {
            itemclick: 'onTreeItemClick'
        },
        bind: {
            selection: '{node}',
            store: '{topics}'
        }
    }, {
        xtype: 'deck-content',
        reference: 'content',
        bind: {
            node: '{node}'
        },
        listeners: {
            navigate: 'onNavigate'
        },
        region: 'center'
    }]
});
