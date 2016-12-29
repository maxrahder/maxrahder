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

    initComponent: function() {
        this.callParent(arguments);
        if (Deck.util.Global.editing) {
            this.addDocked({
                xtype: 'toolbar',
                items: [{
                    xtype: 'component',
                    tpl: '<img src={url} />',
                    bind: {
                        data: '{languageIcon}'
                    },
                    height: 48,
                    width: 48
                }, {
                    width: 180,
                    xtype: 'segmentedbutton',
                    value: '_default',
                    bind: {
                        value: '{language}'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        text: 'en-US',
                        value: '_default'
                    }, {
                        text: 'fr-FR',
                        value: 'fr-FR'
                    }, {
                        text: 'jp-JP',
                        value: 'jp-JP'
                    }]
                }, {
                    xtype: 'tbspacer'
                }, {
                    xtype: 'tbspacer'
                }, {
                    xtype: 'textfield',
                    labelWidth: 30,
                    fieldLabel: 'Title',
                    bind: {
                        value: '{node.title}'
                    },
                    dock: 'top'
                }]
            });
        }
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
