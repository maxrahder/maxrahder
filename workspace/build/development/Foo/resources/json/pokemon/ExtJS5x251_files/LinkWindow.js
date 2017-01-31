Ext.define('Engine.view.LinkWindow', {
    extend : 'Ext.window.Window',
    singleton : true,
    closeAction : 'hide',
    title : 'Press your keyboard copy shortcut, then press Enter to dismiss the window',
    items : [ {
        xtype : 'form',
        items : [ {
            xtype : 'textfield',
            link : true,
            enableKeyEvents : true,
            margin : 4,
            width : 460,
            selectOnFocus : true,
            listeners : {
                keypress : function(field, event){
                    if (event.getKey() === event.ENTER){
                        field.up('window').close();
                    }
                }
            }
        } ]
    } ],
    listeners : {
        show : function(window) {
            var f = window.down('textfield');
            f.selectText();
            f.focus(true, 100);
        }
    },
    show : function(s) {
        var f = this.down('textfield');
        f.setValue(s);
        this.callParent();
    }
});