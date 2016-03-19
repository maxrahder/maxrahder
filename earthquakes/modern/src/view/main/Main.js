Ext.define('Earthquakes.view.main.Main', {
    extend: 'Ext.Container',
    xtype: 'main',
    requires: [
        'Earthquakes.view.main.MainModel',
        'Earthquakes.view.main.MainController'
    ],
    viewModel: {
        type: 'main'
    },
    controller: 'main',
    layout: 'fit',
    html: 'Modern view'
});