Ext.define('Tunes.view.main.MainModel', {
    extend: 'Tunes.view.main.BaseModel',
    alias: 'viewmodel.main-main',

    stores: {
        tunesGrouped: {
            source: '{tunes}',
            grouper: {
                groupFn: function(record) {
                    return record.data.sortArtist[0].toUpperCase();
                }
            }
        }
    }
});
