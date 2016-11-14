Ext.define('Admin.view.person.list.ListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.person-list-list',
    data: {
        name: 'Admin'
    },
    formulas: {
        title: {
            bind: ['{scheduledCourse}', '{roster}'],
            get: function (values) {
                var scheduledCourse = values[0];
                var roster = values[1];
                if (scheduledCourse && roster) {
                    var date = Ext.Date.format(scheduledCourse.data.start, 'F j');
                    var result = ('Roster for ' + date + ' ' + scheduledCourse.data.title);
                    return result;
                } else {
                    return 'All Students';
                }
            }
        }
    }


});