Ext.define('Deck.view.topics.Topics', {
    extend: 'Ext.tree.Panel',
    xtype: 'deck-topics',
    requires: ['Deck.view.topics.TopicsViewController', 'Deck.util.Global'],
    controller: 'topicsviewcontroller',
    viewModel: {},
    rootVisible: false,
    useArrows: true,
    initComponent: function() {
        this.callParent(arguments);
    },
    tools: [{
        type: 'minus'
    }, {
        type: 'plus'
    }],
    bbar: [{
        xtype: 'textfield',
        flex: 1,
        enableKeyEvents: true,
        reference: 'searchfield',
        emptyText: 'Find topic',
        listeners: {
            keyup: 'onSearchFieldKeyUp'
        }
    }, {
        xtype: 'segmentedbutton',
        allowToggle: false,
        defaults: {
            listeners: {
                click: 'onSearchClick'
            }
        },
        defaults: {
            handler: 'onArrowClick',
            disabled: true,
            bind: {
                disabled: '{!searchfield.value}'
            }
        },
        items: [{
            iconCls: 'x-fa fa-arrow-left',
            itemId: 'left'
        }, {
            iconCls: 'x-fa fa-arrow-right',
            itemId: 'right'
        }]
    }]
});
