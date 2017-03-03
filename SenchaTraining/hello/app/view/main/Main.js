Ext.define('Earthquakes.view.main.Main', {
    extend: 'Ext.panel.Panel',
    requires: ['Earthquakes.view.Grid'],
    layout: 'border',
    title: 'Earthquakes in Iceland',
    items: [{
        xtype: 'earthquakesgrid',
        region: 'center',
        store: {
            type: 'store',
            model: 'Ext.data.Model',
            fields: [{
                name: 'timestamp',
                convert: function(timestamp) {
                    return new Date(timestamp);
                }
            }],
            sorters: ['timestamp'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '//apis.is/earthquake/is',
                reader: {
                    rootProperty: 'results'
                }
            }
        }
    }]
});
