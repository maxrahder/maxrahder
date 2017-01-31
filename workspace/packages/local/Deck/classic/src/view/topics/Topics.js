Ext.define('Deck.view.topics.Topics', {
    xtype: 'deck-topics',
    extend: 'Ext.tree.Panel',
    mixins: ['Deck.view.topics.TopicsMethods'],
    requires: ['Deck.view.topics.TopicsViewController', 'Deck.util.Global'],
    controller: 'topicsviewcontroller',
    // viewModel: {},
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
            handler: 'onArrowClick'
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
