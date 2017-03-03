Ext.define('YelpExtplorer.view.businesses.View', {
    extend: 'Ext.view.View',
    xtype: 'businessesview',
    scrollable: true,
    itemTpl: '<figure><img src="{image_url}"><figcaption>{name}</figcaption></figure>',
    itemCls: 'businessesview',
    overItemCls: 'over',
    selectedItemCls: 'selected'
});
