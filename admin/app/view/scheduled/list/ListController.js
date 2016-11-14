Ext.define('Admin.view.scheduled.list.ListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.scheduled-list-list',

    onCellSelect: function (grid, selection) {
        if (selection.endCell && (selection.endCell.column.text === 'Roster')) {
            this.fireViewEvent('showroster', true);
        }
    }

});