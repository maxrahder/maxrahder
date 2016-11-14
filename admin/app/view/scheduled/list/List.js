Ext.define('Admin.view.scheduled.list.List', {
    extend: 'Ext.grid.Panel',
    xtype: 'scheduledlist',
    requires: [
        'Admin.view.scheduled.list.ListController',
        'Admin.view.scheduled.list.ListModel',
        'Ext.form.field.Date',
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.selection.SpreadsheetModel'
    ],

    controller: 'scheduled-list-list',
    viewModel: {
        type: 'scheduled-list-list'
    },

    selModel: {
        type: 'spreadsheet',
        cellSelect: true,
        rowNumbererHeaderWidth: 0
    },
    listeners: {
        selectionchange: 'onCellSelect'
    },

    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },

    dockedItems: [{
        xtype: 'toolbar',
        layout: {
            pack: 'center'
        },
        items: [{
            text: 'Show All Scheduled Courses'
        }]
    }],

    columns: [{
        text: 'Course Title',
        dataIndex: 'title',
        flex: 2,
        editor: {
            xtype: 'combobox',
            bind: {
                store: '{courses}'
            },
            displayField: 'title'
        }
    }, {
        text: 'Instructor',
        dataIndex: 'instructor',
        flex: 1,
        editor: {
            xtype: 'combobox',
            bind: {
                store: '{instructors}'
            },
            displayField: 'email'
        }
    }, {
        text: 'Start',
        flex: 1,
        dataIndex: 'start',
        format: 'F j, Y',
        editor: {
            xtype: 'datefield'
        }
    }, {
        text: 'End',
        dataIndex: 'end',
        flex: 1,
        format: 'F j, Y',
        editor: {
            xtype: 'datefield'
        }
    }, {
        text: 'Roster',
        align: 'center',
        xtype: 'templatecolumn',
        tpl: '<div class="x-fa fa-users"/>',
        width: 60
    }]

});