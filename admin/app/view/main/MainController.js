Ext.define('Admin.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-main',

    onShowRoster: function (view, show) {
        console.log('onShowRoster');
        var vm = this.getViewModel();
        vm.set('roster', show);
        vm.set('scheduledCourse', null);
    },
    onScheduleCourse: function (view, record) {
        var store = this.getViewModel().getStore('scheduledCourses');
        var todayString = Ext.Date.format(new Date(), 'Y-m-d');
        store.add({
            title: record.get('title'),
            instructor: 'ron.bailey@sencha.com',
            start: todayString,
            end: todayString
        });
    }

});