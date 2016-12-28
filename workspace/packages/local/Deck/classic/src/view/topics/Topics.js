Ext.define('Deck.view.topics.Topics', {
    extend: 'Ext.tree.Panel',
    xtype: 'deck-topics',
    rootVisible: false,
    useArrows: true,
    tools: [{
        type: 'minus'
    }, {
        type: 'plus'
    }]
});
