Ext.define('Admin.view.scheduled.list.ListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.scheduled-list-list',
    data: {
        name: 'Admin'
    },
    formulas: {
        title: {
            bind: '{course}',
            get: function (course) {
                var result = (course ? ('Schedule for ' + course.data.title) : 'All Scheduled Classes')
                return result;
            }
        }
    }

});