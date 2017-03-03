Ext.define('YelpExtplorer.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',

        'YelpExtplorer.view.main.MainController',
        'YelpExtplorer.view.main.MainModel',
        'YelpExtplorer.view.Banner',
        'YelpExtplorer.view.businesses.Filter',
        'YelpExtplorer.view.businesses.TabPanel',
        'YelpExtplorer.view.business.Detail'
    ],

    controller: 'main-main',
    viewModel: {
        type: 'main-main'
    },

    dockedItems: [{
        xtype: 'banner',
        dock: 'top'
    }, {
        dock: 'top',
        xtype: 'businessesfilter'
    }],
    layout: 'border',
    items: [{
        region: 'center',
        xtype: 'businessestabpanel',
        reference: 'businessestabpanel',
        listeners: {
            tabchange: 'updateHash'
        }
    }, {
        region: 'east',
        xtype: 'businessdetail',
        plugins: ['responsive'],
        responsiveConfig: {
            wide: {
                region: 'east'
            },
            tall: {
                region: 'south'
            }
        },
        bind: {
            // data: '{business}'
            data: {
                bindTo: '{business}',
                deep: true
            }
        },
        width: 130
    }]

});
