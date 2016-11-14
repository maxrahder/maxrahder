Ext.define('Admin.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'main',
    requires: [
        'Admin.view.main.MainController',
        'Admin.view.main.MainModel',

        'Admin.view.person.list.List',
        'Admin.view.scheduled.list.List',
        'Admin.view.catalog.list.List'
    ],

    controller: 'main-main',
    viewModel: {
        type: 'main-main'
    },

    layout: 'border',
    defaults: {
        border: true
    },
    items: [{
        xtype: 'cataloglist',
        region: 'west',
        title: 'Catalog of Courses',
        iconCls: 'x-fa fa-book',
        titleCollapse: true,
        flex: 1,
        collapsible: true,
        bind: {
            store: '{catalog}',
            selection: '{course}'
        },
        listeners: {
            schedulecourse: 'onScheduleCourse'
        }
    }, {
        xtype: 'personlist',
        region: 'east',
        title: 'People',
        iconCls: 'x-fa fa-users',
        titleCollapse: true,
        flex: 1,
        collapsible: true,
        listeners: {
            showroster: 'onShowRoster'
        },
        bind: {
            store: '{people}',
            title: '{title}',
            selection: '{person}'
        }
    }, {
        xtype: 'scheduledlist',
        region: 'center',
        iconCls: 'x-fa fa-calendar',
        title: 'Scheduled Courses',
        listeners: {
            showroster: 'onShowRoster'
        },
        bind: {
            store: '{scheduledCourses}',
            selection: '{scheduledCourse}'
        }
    }]
});