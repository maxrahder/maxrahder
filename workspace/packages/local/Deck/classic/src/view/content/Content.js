Ext.define('Deck.view.content.Content', {
    xtype: 'deck-content',
    extend: 'Ext.panel.Panel',
    requires: [
        'Deck.view.content.ContentController'
    ],
    mixins: [
        'Deck.view.content.ContentMethods',
        // 'Ext.toolbar.Breadcrumb'
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
                    selection: '{node}'
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
        cls: 'title',
        tpl: '{text}',
        height: 38,
        bind: {
            data: '{node.text}'
        }
        // data: {
        //     text: ''
        // }
    }]

});
