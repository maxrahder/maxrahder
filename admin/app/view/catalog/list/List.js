Ext.define('Admin.view.catalog.list.List', {
    extend: 'Ext.grid.Panel',
    xtype: 'cataloglist',
    requires: [
        'Admin.view.catalog.list.ListController',
        'Admin.view.catalog.list.ListModel'
    ],

    controller: 'catalog-list-list',
    viewModel: {
        type: 'catalog-list-list'
    },

    tbar: [{
        iconCls: 'x-fa fa-plus'
    }],

    columns: [{
        text: 'Title',
        flex: 2,
        dataIndex: 'title'
    }, {
        text: 'Requirements',
        flex: 1,
        dataIndex: 'requirements'
    }, {
        text: 'Active',
        xtype: 'booleancolumn',
        dataIndex: 'active',
        trueText: 'yes',
        falseText: 'no'
    }, {
        xtype: 'actioncolumn',
        align: 'center',
        width: 40,
        items: [{
            iconCls: 'x-fa fa-calendar-plus-o',
            handler: 'onScheduleCourse'
        }]
    }]

});