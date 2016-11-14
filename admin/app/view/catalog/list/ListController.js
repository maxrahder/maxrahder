Ext.define('Admin.view.catalog.list.ListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.catalog-list-list',

    onScheduleCourse: function (view, row, column, item, event, record) {
        this.fireViewEvent('schedulecourse', this.getView(), record);
    }

});