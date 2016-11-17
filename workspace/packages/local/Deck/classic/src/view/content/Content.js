Ext.define('Deck.view.content.Content', {
    xtype: 'deck-content',
    extend: 'Ext.panel.Panel',
    mixins: [
        'Deck.view.content.ContentMethods',
        // 'Ext.toolbar.Breadcrumb'
    ],
    renderConfig: {
        node: null
    },
    bodyPadding: 8,
    scrollable: true,
    dockedItems: [{
        //     xtype: 'breadcrumb',
        //     reference: 'breadcrumb',
        //     publishes: 'selection',
        //     bind: {
        //         store: '{topics}'
        //     }
        // }, {
        xtype: 'component',
        dock: 'top',
        itemId: 'title',
        height: 26,
        // html: 'FOO'
        style: 'font-weight: bold; color: #444444; margin: 12px 0 8px 8px; font-size: 2em; ',
        tpl: '{text}',
        data: {
            text: ''
        }
    }]

})