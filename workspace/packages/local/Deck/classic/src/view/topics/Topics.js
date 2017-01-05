Ext.define('Deck.view.topics.Topics', {
    extend: 'Ext.tree.Panel',
    xtype: 'deck-topics',
    requires: ['Deck.view.topics.TopicsViewController', 'Deck.util.Global'],
    controller: 'topicsviewcontroller',
    rootVisible: false,
    useArrows: true,
    initComponent: function() {
        this.callParent(arguments);
    },
    tools: [{
        type: 'save',
        callback: 'onSaveToolClick'
    }, {
        type: 'minus'
    }, {
        type: 'plus'
    }],
    bbar: [{
        xtype: 'textfield',
        flex: 1,
        enableKeyEvents: true,
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
        items: [{
            iconCls: 'x-fa fa-arrow-left'
        }, {
            iconCls: 'x-fa fa-arrow-right'
        }]
    }]
});
