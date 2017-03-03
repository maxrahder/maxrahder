Ext.define('YelpExtplorer.view.business.Detail', {
    extend: 'Ext.Container',
    xtype: 'businessdetail',

    cls: 'businessesdetail',
    padding: 8,
    tpl: [
        '<b>{name}</b>',
        '<br>',
        '{[values.location.display_address.join("<br>")]}',
        '<br><br>',
        '<tpl if="image_url"><img src="{image_url}"></tpl>',
        '<br><br>',
        '<tpl if="is_closed"><i style="color: red;" class="fa fa-times-circle"></i> This business is permanently closed.<br><br></tpl>',
        'Web site: {url}',
        '<br><br>',
        '<img src="resources/images/stars_{rating}.png">',
        '<br><br>',
        '<img src="{snippet_image_url}" style="float: left;margin: 2px 2px 0 0; height: 40px">{snippet_text}'
    ]
});
