Ext.define('Deck.view.topics.Topics', {
    xtype: 'deck-topics',
    extend: 'Ext.tree.Panel',
    mixins: ['Deck.view.topics.TopicsMethods'],
    requires: ['Deck.view.topics.TopicsViewController', 'Deck.util.Global', 'Ext.tree.Column'],
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
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'text',
        flex: 1,
        renderer: function(value, cell, record) {
            // TODO: This isn't doing anything special -- we don't need the columns:[] at all, but
            // I was trying out trying to figure out the text from the title, rather than using a
            // text property on the record. We can remove it once things look ok.
            return record.data.text;
        }
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
