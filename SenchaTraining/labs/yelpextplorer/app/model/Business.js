Ext.define('YelpExtplorer.model.Business', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.proxy.Ajax'],
    fields: [{
        name: 'name',
        validators: [{
            type: 'presence'
        }]
    }, {
        name: 'latitude',
        mapping: 'location.coordinate.latitude'
    }, {
        name: 'longitude',
        mapping: 'location.coordinate.longitude'
    }],
    proxy: {
        type: 'ajax',
        url: 'http://traininglabs.sencha.com/api/yelp/v2/search/',
        reader: {
            type: 'json',
            rootProperty: 'businesses'
        }
    }
});
