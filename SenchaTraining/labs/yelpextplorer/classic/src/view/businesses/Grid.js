Ext.define('YelpExtplorer.view.businesses.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'businessesgrid',
    requires: [
        'Ext.grid.column.Column',
        'Ext.grid.column.Widget',
        'Ext.ux.rating.Picker',
        'Ext.grid.column.Template'
    ],
    columns: [{
        text: 'Name',
        dataIndex: 'name',
        width: 120
    }, {
        xtype: 'templatecolumn',
        text: 'Rating',
        dataIndex: 'rating',
        tpl: '<img src="resources/images/stars_{rating}.png">'
    }, {
        xtype: 'widgetcolumn',
        text: 'Rating',
        dataIndex: 'rating',
        widget: {
            xtype: 'rating',
            rounding: 0.5,
            minimum: 1, // Yelp ratings go from 1 - 5
            maximum: 5,
            selectedStyle: 'color: #ff4444', // Pale red
            overStyle: 'color: #ff0000' // Red
        }
    }, {
        text: 'Reviews',
        dataIndex: 'review_count',
        width: 60,
        align: 'right'
    }, {
        xtype: 'templatecolumn',
        text: 'Address',
        tpl: '{[values.location.display_address.join(", ")]}',
        flex: 1
    }]

});
