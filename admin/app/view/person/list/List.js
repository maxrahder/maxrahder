Ext.define('Admin.view.person.list.List', {
    extend: 'Ext.grid.Panel',
    xtype: 'personlist',
    requires: [
        'Admin.view.person.list.ListController',
        'Admin.view.person.list.ListModel',
        'Ext.grid.feature.Summary'
    ],

    controller: 'person-list-list',
    viewModel: {
        type: 'person-list-list'
    },

    features: [{
        ftype: 'summary',
        dock: 'bottom'
    }],
    plugins: {
        ptype: 'cellediting',
        id: 'cellediting',
        clicksToEdit: 1
    },


    bind: {
        title: '{title}'
    },

    tbar: [{
        xtype: 'textfield',
        fieldLabel: 'Filter',
        labelWidth: 38
    }, {
        text: 'Show All People',
        handler: 'onShowAll'
    }, {
        xtype: 'tbfill'
    }, {
        iconCls: 'x-fa fa-user-plus',
        handler: 'onAddPerson'
    }],

    columns: [{
        text: 'e-mail',
        dataIndex: 'email',
        flex: 1,
        editor: {
            xtype: 'textfield',
            vtype: 'email'
        },
        summaryType: 'count',
        summaryRenderer: function (value, summaryData, dataIndex) {
            return value + ' student' + ((value == 1) ? '' : 's');
        }
    }, {
        text: 'Name',
        dataIndex: 'name',
        flex: 2,
        editor: {
            xtype: 'textfield'
        }
    }, {
        text: 'Phone',
        dataIndex: 'phone',
        width: 120,
        editor: {
            xtype: 'textfield'
        },
    }]

});