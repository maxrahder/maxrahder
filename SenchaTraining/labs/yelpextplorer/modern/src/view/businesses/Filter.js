Ext.define('YelpExtplorer.view.businesses.Filter', {
    extend: 'Ext.Toolbar',
    xtype: 'businessesfilter',
    requires: ['Ext.field.Search', 'Ext.SegmentedButton', 'Ext.Button'],

    defaults: {
        xtype: 'searchfield',
        flex: 1,
        listeners: {
            focus: function(search) {
                var thatId = Ext.String.toggle(search.getItemId(), 'city', 'category');
                search.up('businessesfilter').down('#' + thatId).hide();
            },
            blur: function(search) {
                var thatId = Ext.String.toggle(search.getItemId(), 'city', 'category');
                search.up('businessesfilter').down('#' + thatId).show();
            }
        }
    },
    items: [{
        itemId: 'city',
        placeHolder: 'City',
        bind: {
            value: '{city}'
        }
    }, {
        itemId: 'category',
        placeHolder: 'Category',
        bind: {
            value: '{category}'
        }
    }]

});
