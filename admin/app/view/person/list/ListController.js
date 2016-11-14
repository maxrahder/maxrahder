Ext.define('Admin.view.person.list.ListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.person-list-list',

    onShowAll: function () {
        this.fireViewEvent('showroster', false);
    },
    onAddPerson: function () {
        var grid = this.getView();
        var store = grid.getStore();
        var record = store.add({
            title: 'Fast Track to Ext JS'
        });
        grid.setSelection(record);
        var cellEditing = grid.getPlugin('cellediting');
        cellEditing.startEditByPosition({
            row: (store.getCount() - 1),
            column: 0
        });
    }

});