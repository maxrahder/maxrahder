Ext.define('YelpExtplorer.view.main.BaseModel', {
    extend: 'Ext.app.ViewModel',
    requires: ['YelpExtplorer.model.Business'],
    data: {
        city: 'Nuremberg',
        category: 'beer',
        business: null
    },
    stores: {
        businesses: {
            model: 'YelpExtplorer.model.Business',
            sorters: ['name'],
            pageSize: 20 // Yelp limits results to 20 at a time
        }
    }

});
