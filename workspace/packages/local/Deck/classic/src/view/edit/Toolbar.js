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
        xtype: 'tbspacer',
        width: 16
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-folder-o',
        text: 'Add Topic',
        handler: 'onCreateTopic'
    }, {
        xtype: 'textfield',
        width: 300,
        labelWidth: 60,
        fieldLabel: 'Topic title',
        reference: 'nodeTitle',
        bind: {
            value: '{node.title}'
        },
        listeners: {
            change: 'onTitleChange'
        }
    }, {
        xtype: 'tbspacer',
        width: 16
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-file-o',
        text: 'Add Page',
        handler: 'onCreateLeaf'
    }, {
        text: 'Edit Page',
        iconCls: 'x-fa fa-external-link',
        handler: 'onEditPage'
    }, {
        text: 'Refresh Page',
        iconCls: 'x-fa fa-refresh',
        handler: 'onRefresh'
    }]


});
