Ext.define('YelpExtplorer.view.main.MainController', {
    extend: 'YelpExtplorer.view.main.BaseController',
    alias: 'controller.main-main',
    mixins: ['YelpExtplorer.view.main.Routes'],

    initViewModel: function(vm) {
        var me = this;
        me.callParent(arguments);
        vm.bind('{city}', me.updateHash, me);
        vm.bind('{category}', me.updateHash, me);
    },

    routes: {
        '!:tab/:city/:category': 'processRoute'
    }


});
