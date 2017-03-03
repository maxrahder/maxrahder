Ext.define('YelpExtplorer.view.main.MainController', {
    extend: 'YelpExtplorer.view.main.BaseController',
    alias: 'controller.main-main',
    requires: ['YelpExtplorer.view.business.Detail'],
    initViewModel: function(vm) {
        var me = this;
        me.callParent(arguments);
        vm.bind('{business}', me.onBusinessSelect, me);
    },
    onBusinessSelect: function(business) {
        if (business) {
            this.getView().push({
                xtype: 'businessdetail',
                data: business.data,
                title: business.data.name
            });
        }
    }

});
