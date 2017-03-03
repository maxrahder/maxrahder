Ext.define('Beatles.view.beatles.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'beatles-grid',
    requires: [
        'Beatles.view.beatles.GridController',
        'Beatles.view.beatles.GridModel',
        'Ext.grid.column.Column',
        'Ext.grid.column.Date',
        'Ext.window.MessageBox'
    ],
    controller: 'beatles-grid',
    viewModel: {
        type: 'beatles-grid'
    },

    bind: {
        store: '{people}'
    },

    title: 'Beatles',
    columns: [{
        text: 'Name',
        dataIndex: 'first'
    }, {
        text: 'Last Name',
        dataIndex: 'last'
    }, {
        text: 'Date Of Birth',
        dataIndex: 'dob',
        xtype: 'datecolumn',
        format: 'j F, Y',
        flex: 1
    }],
    tbar: [{
        text: 'She loves you...',
        itemId: 'sheLovesMe',
        handler: function(button) {
            Ext.Msg.alert(button.getText(), 'Yeah yeah yeah!');
        }
    }]
});
