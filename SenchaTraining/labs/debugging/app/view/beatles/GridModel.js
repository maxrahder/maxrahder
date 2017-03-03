Ext.define('Beatles.view.beatles.GridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.beatles-grid',

    requires: ['Beatles.model.Person'],

    stores: {
        people: {
            model: 'Beatles.model.Person',
            autoLoad: true
        }
    }

});
