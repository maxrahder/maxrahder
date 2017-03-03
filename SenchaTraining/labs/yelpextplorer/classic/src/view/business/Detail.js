Ext.define('YelpExtplorer.view.business.Detail', {
    extend: 'Ext.panel.Panel',
    xtype: 'businessdetail',
    requires: [
        'YelpExtplorer.view.business.DetailController',
        'YelpExtplorer.view.business.DetailModel'
    ],

    controller: 'business-detail',
    viewModel: {
        type: 'business-detail'
    },


    tbar: [{
        xtype: 'button',
        text: 'Edit',
        disabled: true,
        handler: 'onEditClick',
        bind: {
            disabled: '{!business}'
        }
    }],
    bbar: [{
        xtype: 'component',
        height: 25,
        width: 155,
        html: [
            '<a href="http://www.yelp.com" target="_blank">',
            '<img src="resources/images/Powered_By_Yelp_Red.png"/></a>'
        ]
    }],
    setRegion: function(region) {
        this.callParent(arguments);
        this.setData(this.getData());
    },
    bodyPadding: 8,
    tpl: [
        '<tpl if="this.isData(values)">',
        '<div><table><tr><td>',
        '<b>{name}</b><br/>',
        '{[Ext.Array.map(values.categories, function(item){return item[0];}).join("<br/>")]}<br/><br/>',
        '<img src="resources/images/stars_{rating}.png" /><br/>',
        '<tpl if="this.isPortrait()"></td><td></tpl>',
        '<img src="{image_url}" style="margin: 8px 4px 0 4px;" /><br/><br/>',
        '<tpl if="this.isPortrait()"></td><td></tpl>',
        'Reviews: {review_count}<br/><br/>',
        '{[values.location.display_address.join("<br/>")]}<br/><br/>',
        '<a href="{url}" target="_blank">Review at Yelp</a>',
        '</td></tr></table></div>',
        '</tpl>', {
            isData: function(data) {
                return !Ext.Object.isEmpty(data);
            },
            isPortrait: function() {
                return (Ext.dom.Element.getOrientation() === 'portrait');
            }
        }
    ]

});
