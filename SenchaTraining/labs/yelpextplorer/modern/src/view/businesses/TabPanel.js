Ext.define('YelpExtplorer.view.businesses.TabPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'businessestabpanel',
    requires: [
        'YelpExtplorer.view.businesses.Map',
        'YelpExtplorer.view.businesses.List'
    ],

    tabBar: {
        docked: 'bottom',
        defaults: {
            iconAlign: 'top'
        }
    },
    defaults: {
        iconAlign: 'top'
    },
    items: [{
        title: 'Map',
        iconCls: 'x-fa fa-map-marker',
        xtype: 'businessesmap',
        bind: {
            location: '{location}',
            store: '{businesses}',
            selection: '{business}'
        }
    }, {
        title: 'List',
        iconCls: 'x-fa fa-list',
        xtype: 'businesseslist'
    }]

});
