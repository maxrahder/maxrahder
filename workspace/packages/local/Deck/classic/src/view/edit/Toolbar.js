Ext.define('Deck.view.edit.Toolbar', {
    xtype: 'edittoolbar',
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'Deck.view.edit.ToolbarController',
        'Deck.view.edit.ToolbarModel'
    ],
    controller: 'edit-toolbar',
    viewModel: {
        type: 'edit-toolbar'
    },

    renderConfig: {
        language: '_default'
    },
    publishes: ['language'],

    items: [{
        xtype: 'segmentedbutton',
        value: '_default',
        bind: {
            value: '{language}'
        },
        items: [{
            text: 'US',
            value: '_default'
        }, {
            text: 'FR',
            value: 'fr-FR'
        }, {
            text: 'JP',
            value: 'jp-JP'
        }],
        margin: 1
    }, {
        xtype: 'tbspacer'
    }, {
        xtype: 'tbspacer'
    }, {
        xtype: 'textfield',
        width: 300,
        labelWidth: 30,
        fieldLabel: 'Title',
        reference: 'nodeTitle',
        bind: {
            value: '{node.title}'
        },
        listeners: {
            change: {
                fn: 'onTitleChange',
                // buffer: 1000
            }
        }
    }]


});
