Ext.define('Deck.view.content.Content', {
    xtype: 'deck-content',
    extend: 'Ext.panel.Panel',
    requires: [
        'Deck.view.content.ContentController'
    ],
    mixins: [
        'Deck.view.content.ContentMethods'
        // 'Ext.toolbar.Breadcrumb' // Leaving this in breaks things.
    ],
    controller: 'deck-content',
    renderConfig: {
        node: null
    },
    cls: 'deckcontentview',
    bodyPadding: 8,
    scrollable: true,
    layout: 'fit',
    dockedItems: [{
        xtype: 'toolbar',
        items: [{
                xtype: 'breadcrumb',
                reference: 'breadcrumb',
                bind: {
                    store: '{topics}',
                    // selection: '{node}' // This is setting node to the root accidentally, so set its selection procedurally
                }
            },
            '->', {
                xtype: 'button',
                iconCls: 'x-fa fa-arrows-h',
                tooltip: 'Focus for arrow key navigation',
                keyMap: {
                    // Add shifted versions too
                    "RIGHT": 'onKeyMap',
                    "LEFT": 'onKeyMap',
                    "UP": 'onKeyMap',
                    "DOWN": 'onKeyMap'
                }
            }
        ]
    }, {
        xtype: 'component',
        dock: 'top',
        itemId: 'title',
        reference: 'title',
        cls: 'title',
        tpl: '{text}',
        height: 48,
        bind: {
            data: '{node.text}'
        }
    }]

});
