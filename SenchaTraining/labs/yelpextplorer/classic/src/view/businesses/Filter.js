Ext.define('YelpExtplorer.view.businesses.Filter', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'businessesfilter',
    defaults: {
        margin: 2
    },
    items: [{
        xtype: 'textfield',
        fieldLabel: 'City',
        bind: {
            value: '{typedCity}'
        },
        labelWidth: 26
    }, {
        xtype: 'tbspacer'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Category',
        bind: {
            value: '{typedCategory}'
        },
        labelWidth: 56
    }],
    padding: 4
});
