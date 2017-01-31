Ext.define('Engine.view.EditToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: ['Ext.toolbar.TextItem'],
    xtype: 'edittoolbar',
    requires: ['Ext.button.Split', 'Ext.toolbar.TextItem'],
    config: {
        store: ''
    },

    initComponent: function() {
        var store = this.getStore();
        if (Ext.isString(store)) {
            store = Ext.getStore(store);
            this.setStore(store);
        }
        Engine.model.Node.on('change', this.onNodeChange, this);
        this.callParent();
    },

    onNodeChange: function(node) {
        this.down('#nodeText').setValue(node.getTitle());

        var c = this.down('#filePath');
        if (node.isSlide()) {
            c.setValue(node.getRecord().getFilePathAndName());
            c.show();
            c.selectText();
        } else {
            c.setValue('');
            c.hide();
        }
    },


    dock: 'top',
    editor: true, // tags that this is used for editing
    hidden: true,
    bodyPadding: 2,
    items: [{
            xtype: 'textfield',
            fieldLabel: 'Title',
            labelWidth: 30,
            itemId: 'nodeText',
            width: 220,
            validateOnChange: true
        },
        //  {
        //     xtype: 'numberfield',
        //     fieldLabel: 'Duration',
        //     labelWidth: 48,
        //     width: 84,
        //     itemId: 'nodeDuration',
        //     minValue: 0,
        //     hideTrigger: true,
        //     validateOnChange: true
        // },
        '', '-', '', {
            glyph: '110@Nouveau',
            itemId: 'addFolder',
            tooltip: 'Add a new folder as the sibling of the selected folder',
            scale: 'small'
        }, {
            glyph: '78@Nouveau',
            itemId: 'addPage',
            xtype: 'splitbutton',
            tooltip: 'Add a new page as the sibling of the selected page',
            scale: 'small',
            useShared: false,
            text: 'Not shared',
            menu: {
                defaults: {
                    handler: function(menuItem) {
                        var splitButton = menuItem.up('splitbutton');
                        splitButton.setText(menuItem.text);
                        splitButton.useShared = menuItem.useShared;
                    }
                },
                items: [{
                    text: 'Shared',
                    useShared: true
                }, {
                    text: 'Not shared',
                    useShared: false
                }]
            }
        }, '', '-', '', {
            glyph: '68@Nouveau',
            itemId: 'deleteNode',
            tooltip: 'Delete the selected item',
            scale: 'small'
        }, '->', {
            xtype: 'textfield',
            fieldLabel: 'Sublime ⌘-P',
            labelWidth: 72,
            width: 400,
            enableKeyEvents: true,
            readOnly: true,
            hidden: true,
            emptyText: 'Path to slide source',
            itemId: 'filePath'
        }, '', {
            xtype: 'button',
            glyph: '114@Nouveau',
            tooltip: 'Refresh slide'
        }, ''
    ]
});