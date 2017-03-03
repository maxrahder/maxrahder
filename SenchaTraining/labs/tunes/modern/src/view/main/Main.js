Ext.define('Tunes.view.main.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'main',
    requires: [
        'Tunes.view.main.MainController',
        'Tunes.view.main.MainModel',
        'Tunes.view.View'
    ],

    controller: 'main-main',
    viewModel: {
        type: 'main-main'
    },

    items: [{
        xtype: 'tunesview',
        bind: {
            store: '{tunesGrouped}'
        },
        listeners: {
            itemtap: 'onShowPreview'
        }
    }]

});
