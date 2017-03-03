Ext.define('YelpExtplorer.view.businesses.TabPanel', {
    extend: 'Ext.tab.Panel',
    mixins: ['Ext.mixin.Responsive'],
    xtype: 'businessestabpanel',
    requires: [
        'YelpExtplorer.view.businesses.Map',
        'YelpExtplorer.view.businesses.View',
        'YelpExtplorer.view.businesses.Grid'
    ],

    responsiveConfig: {
        wide: {
            tabPosition: 'top'
        },
        tall: {
            tabPosition: 'left'
        }
    },
    items: [{
        title: 'Map',
        xtype: 'businessesmap',
        itemId: 'map',
        bind: {
            location: '{location}',
            store: '{businesses}',
            selection: '{business}'
        }
    }, {
        title: 'View',
        xtype: 'businessesview',
        itemId: 'view',
        bind: {
            store: '{businesses}',
            selection: '{business}'
        }
    }, {
        title: 'Grid',
        xtype: 'businessesgrid',
        itemId: 'grid',
        bind: {
            store: '{sortableBusinesses}',
            selection: '{business}'
        }
    }]

});
