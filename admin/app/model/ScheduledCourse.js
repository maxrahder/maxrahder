Ext.define('Admin.model.ScheduledCourse', {
    extend: 'Ext.data.Model',
    fields: ['title', 'instructor', {
        type: 'date',
        name: 'start',
        dateFormat: 'Y-m-d'
    }, {
        type: 'date',
        name: 'end',
        dateFormat: 'Y-m-d'
    }]
})