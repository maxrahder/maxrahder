Ext.define('Engine.view.content.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: ['Engine.view.util.ToggleButton'],
    xtype: 'contenttoolbar',
    cls: 'breadcrumbs',
    items: [{

            xtype: 'button',
            hidden: true,
            text: 'Edit',
            itemId: 'editButton',
            editing: false,
            handler: function(button) {
                // If the user clicked on Edit, they are now editing.
                // Put the page content into Ace
                // Else they clicked on Save, so save the data.
                var editing = button.getText() === 'Edit'; // User now entering edit mode

                button.editing = editing; // Other code can determine if we're editing

                var contentBody = button.up('slide').down('training_contentbody');
                var ace = contentBody.down('aceeditor');

                var fileType = contentBody.saveNode.record.data.fileType;
                ace.setMode((fileType === '.md') ? 'markdown' : 'html');

                if (editing) {
                    button.setText('Save');
                    ace.setText(contentBody.saveNode.getSlideText());
                    ace.focusEditor();
                    contentBody.getLayout().setActiveItem(1);
                } else {
                    button.setText('Edit');
                    var aceText = ace.getText();
                    if (aceText !== contentBody.saveNode.getSlideText()) {
                        // Setting slide text results in the slideHtml updating
                        contentBody.saveNode.setSlideText(aceText);
                        contentBody.fireEvent('save', contentBody, contentBody.saveNode);

                        contentBody.refreshContent();
                        
                    }
                    contentBody.getLayout().setActiveItem(0);
                }
            }
        }, '', {
            xtype: 'image',
            itemId: 'transmitting',
            hidden: true,
            src: Engine.sharedRootPath + 'resources/icons/Transmitting.png',
            style: {
                opacity: 0.4
            },
            height: 24
        }, {
            itemId: 'syncWithInstructor',
            checked: false,
            onText: 'sync on',
            offText: 'sync off',
            xtype: 'togglebutton'
        }, '', {
            xtype: 'tbtext',
            itemId: 'breadcrumb'
        },
        '->', {
            cls: 'font-size',
            glyph: '45@Nouveau',
            tooltip: 'Decrease Font Size',
            handler: function(button) {
                button.up('contenttoolbar').changeSize(-10);
            }
        }, {
            cls: 'font-size',
            glyph: '43@Nouveau',
            tooltip: 'Increase Font Size',
            handler: function(button) {
                button.up('contenttoolbar').changeSize(10);
            }
        }
    ],

    initComponent: function() {
        Engine.model.Node.on('change', this.onNodeChange, this);
        this.callParent();
        this.down('#editButton').setVisible(Engine.editing);
    },

    changeSize: function(val) {

        var fontSize = Ext.query('div.slide div.body')[0].style.fontSize;
        var lineHeight = Ext.query('div.slide div.body')[0].style.lineHeight;

        var zoomlevel = '';
        var zoomlevelline = '';
        if (fontSize == "") {
            zoomlevel = "200";
            zoomlevelline = "32";
        } else {
            zoomlevel = (parseInt(fontSize) + val);
            zoomlevelline = (parseInt(lineHeight) + (val / 4));
        }

        if (zoomlevel > 150 && zoomlevel < 400) {
            Ext.query('div.slide div.body')[0].style.fontSize = zoomlevel + '%';
            Ext.query('div.slide div.body')[0].style.lineHeight = zoomlevelline + 'px';
        }

    },
    BREADCRUMB_DELIMITER: ' &gt; ',
    onNodeChange: function(node) {
        var me = this;
        var s = '';
        Ext.Array.forEach(node.getTopicArray(), function(topic) {
            s += topic + me.BREADCRUMB_DELIMITER;
        });
        if (node.isSlide()) {
            var title = node.getTitle();
            if (title) {
                s += title;
            }
        }
        s = Engine.util.String.removeFromEnd(s, me.BREADCRUMB_DELIMITER);
        this.down('#breadcrumb').setText('<div class="holder">' + s + '</div>');
    }

});