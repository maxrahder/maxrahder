Ext.define('Tunes.view.View', {

    extend: 'Ext.view.View',
    xtype: 'tunesview',

    getController: function() {

    },

    scrollable: true,
    cls: 'mycls',
    initComponent: function() {
        this.callParent(arguments);
    },
    itemCls: 'video',
    overItemCls: 'overvideo',
    itemTpl: [
        '<figure>',
        '<img src="{image}">',
        '<figcaption><b>{title}</b><br>{artist}</figcaption><br>',
        '</figure>'
    ]
});
