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
    }]
});
