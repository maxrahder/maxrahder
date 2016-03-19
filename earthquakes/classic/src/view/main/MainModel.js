Ext.define('Earthquakes.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',
    data: {},
    formulas: {},
    stores: {
        earthquakes: {
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
    }
});
