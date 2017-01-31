Ext.define('Deck.view.main.Main', {
    xtype: 'deck-main',
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.plugin.Viewport',
        'Deck.view.main.MainViewController',
        'Deck.view.main.MainViewModel',
        'Deck.view.topics.Topics',
        'Deck.view.content.Content',
        'Deck.view.edit.Toolbar'
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
        reference: 'treePanel',
        split: true,
        width: 200,
        listeners: {
            itemclick: 'onTreeItemClick',
            // selec: 'onNodeSelect'
        },
        bind: {
            store: '{topics}',
            selection: '{node}'
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
