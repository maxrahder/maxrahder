Ext.define('Earthquakes.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    requires: ['Ext.window.Toast'],

    onSelect: function(map, record) {
        var data = record.data;
        var time = Ext.Date.format(data.timestamp, 'F j, g:i a');
        var s = 'A magnitude ' + data.size + ' earthquake occured ' + data.humanReadableLocation + '.';
        Ext.toast(s, time, 't');
    }

});