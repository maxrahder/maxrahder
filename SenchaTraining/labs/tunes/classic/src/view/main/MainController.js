Ext.define('Tunes.view.main.MainController', {
    extend: 'Tunes.view.main.BaseController',
    alias: 'controller.main-main',
    requires: ['Tunes.view.Preview'],

    onShowPreview: function(view, record) {
        if (a == 'a') {

        }
        Ext.create('Tunes.view.Preview', {
            title: record.data.title + ', provided courtesy of iTunes',
            data: record.data
        });
    }

});
