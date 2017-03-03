Ext.define('Tunes.view.Preview', {
    extend: 'Ext.window.Window',
    xtype: 'preview',
    autoShow: true,
    modal: true,
    resizable: false,
    bodyPadding: 16,
    height: 396,
    tpl: [
        '<video autoplay="" style="height: 300px; width: 572px; " preload="auto">',
        '<source src="{preview}" type="video/mp4">',
        '</video>',
        '<a href="{itunesstore}" target="itunes_store">',
        '<img src="resources/images/get-it-itunes.svg" style="display: block; margin-left: auto; margin-right: auto; width: 75px;">',
        '</a>'
    ]
});
