Ext.define('Engine.view.Tree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.training_tree',
    requires: [
        'Ext.tree.plugin.TreeViewDragDrop',
        'Ext.grid.column.CheckColumn'
    ],
    rootVisible: false,
    bodyPadding: 4,
    lines: false,
    border: false,
    style: {
        borderRight: '1px solid #d0d0d0'
    },
    // selModel: {
    //   // enableKeyNav: false
    // },

    hideHeaders: true,

    cls: 'tree',
    expandIfNeeded: function() {
        if (this.getAutoCollapse() && this.collapsed) {
            this.expand();
        }
    },
    collapseIfNeeded: function() {
        if (this.getAutoCollapse() && !this.collapsed) {
            this.collapse();
        }
    },

    toggleAutoCollapse: function() {
        this.setAutoCollapse(!this.getAutoCollapse());
    },

    updateAutoCollapse: function(newValue, oldValue) {
        // Setting to true means it's un-pinned.
        var tool = this.getPinTool();
        if (tool) {
            tool.setType(newValue ? 'unpin' : 'pin');
            this.saveState();
        }
    },

    getPinTool: function() {
        return this.down('header #pinTool');
    },

    findHandler: function(previous) {
        var text = this.down('textfield#findField').getValue();
        if (text) {
            this.search(text, previous);
        }
    },

    bbar: [{
        xtype: 'textfield',
        fieldLabel: 'Find topic',
        itemId: 'findField',
        labelWidth: 56,
        enableKeyEvents: true,
        listeners: {
            keypress: function(textField, event) {
                if (event.getKey() === Ext.EventObject.ENTER) {
                    textField.up('training_tree').findHandler(false);
                }
            }
        },
        width: 150
    }, {
        xtype: 'button',
        scale: 'small',
        glyph: '91@Nouveau',
        handler: function(button) {
            button.up('training_tree').findHandler(true);
        }
    }, {
        xtype: 'button',
        scale: 'small',
        glyph: '93@Nouveau',
        handler: function(button) {
            button.up('training_tree').findHandler(false);
        }
    }],

    config: {
        autoCollapse: false,
        topic: '',
        viewConfig: {
            getRowClass: function(record, rowIndex, rowParams, store) {
                //debugger;
                var result = '';
                if (record.isLeaf()) {
                    result = 'nofolder';
                }

                if (record.isLab()) {
                    result = result + ' lab';
                } else if (record.isSlide()) {
                    result = result + ' customleaf'
                }
                return result;
            }
        }
    },

    initComponent: function() {

        var me = this;

        me.columns = [];
        if (Engine.hideMode) {
            me.columns.push({
                xtype: 'checkcolumn',
                width: 24,
                dataIndex: 'hidden'
            });
        }
        me.columns.push({
            xtype: 'treecolumn',
            flex: 1,
            dataIndex: 'text',
            sortable: false,
            text: '',
            renderer: function(value, td, record, row, column, nodeStore, treeView) {
                if ((!record.isLeaf()) && (value !== 'Appendix') && (record.getLevel() === 0)) {
                    // IMPORTANT: Assume every course has an initial title page.
                    var offset = (treeView.getTreeStore().getRootNode().firstChild.isLeaf() ? 0 : 1);
                    var i = treeView.getTreeStore().getRootNode().indexOf(record) + offset;
                    return i + '. ' + value;
                } else {
                    return value;
                }
            }
        });

        if (Engine.editing) {

            Ext.apply(this.viewConfig, {
                plugins: {
                    ptype: 'treeviewdragdrop'
                },
                listeners: {
                    itemkeydown: function(view, record, domElement, number, even) {
                        if (view.tree) {
                            view.tree.fireEvent('itemkeydown', view, record, domElement, number, even);
                        }
                    }
                }
            });
        }
        this.callParent();
        // For view event handling convenience put
        // a reference to the tree on the view.
        this.getView().tree = this;
    },

    getSelection: function() {
        return this.getSelectionModel().getSelection()[0];
    },

    listeners: {
        itemclick: function(view, node) {
            node[node.isExpanded() ? 'collapse' : 'expand']();
        }
    },

    // tooltips not being property dismissed in v5, so ocommenting out

    tools: [{
        type: 'next',
        //tooltip: 'Play the slideshow from the selected slide',
        handler: function(event, element, header, tool) {
            var slide = Ext.ComponentQuery.query('viewport')[0].el.dom;
            if (slide) {
                if (Ext.isWebKit)
                    slide.webkitRequestFullScreen();
                else if (Ext.isGecko)
                    slide.mozRequestFullScreen();
                else if (slide.el.requestFullScreen)
                    slide.requestFullScreen();
            }
        }
    }, {
        type: 'pin',
        itemId: 'pinTool',
        //tooltip: 'Pinned toolbar does not auto-collapse (click to toggle)',
        handler: function(event, element, header, tool) {
            header.up('training_tree').toggleAutoCollapse();
        }

    }, {
        type: 'plus',
        //tooltip: 'Expand the selected topic',
        handler: function(event, element, header, tool) {
            var tree = header.up('training_tree');
            var selection = tree.getSelection();
            if (selection && !selection.isLeaf()) {
                tree.expandNode(selection, true);
            }
        }
    }, {
        type: 'minus',
        //tooltip: 'Collapse all topics',
        handler: function(event, element, header, tool) {
            header.up('training_tree').collapseAll();
        }
    }],

    // Run expand() on all parents of node
    expandParents: function(node) {
        var parent = node.parentNode;
        while (parent) {
            parent.expand();
            parent = parent.parentNode;
        }
    },

    search: function(search, previous) {
        var store = this.getStore();
        var node = store.getNode(search, this.getSelection(), previous);
        if (node) {
            this.getSelectionModel().select(node);
            this.expandParents(node);
        }
    }

});