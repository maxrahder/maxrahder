Ext.define('Tunes.view.main.BaseModel', {
    extend: 'Ext.app.ViewModel',
    requires: ['Tunes.model.Tune'],
    stores: {
        tunes: {
            model: 'Tunes.model.Tune',
            sorters: ['sortArtist', 'title'],
            autoLoad: true
        }
    }
});
