Ext.define('Earthquakes.Application', {
    extend: 'Ext.app.Application',
    name: 'Earthquakes',
    required: ['Ext.MessageBox'],
    mainView: 'Earthquakes.view.main.Main',

    onAppUpdate: function() {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function(choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});