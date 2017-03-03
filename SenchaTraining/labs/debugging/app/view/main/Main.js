Ext.define('Beatles.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: ['Beatles.view.beatles.Grid'],

    layout: {
        type: 'fit'
    },

    items: [{xtype: 'beatles-grid',padding: 8}]
});
