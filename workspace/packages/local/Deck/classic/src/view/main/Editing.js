Ext.define('Deck.view.main.Editing', {
    extend: 'Ext.Mixin',
    requires: ['Ext.tree.plugin.TreeViewDragDrop', 'Deck.util.Backend'],

    initComponentEditing: function(view) {
        if (!Deck.util.Global.editing) return;
        var me = this;

        view.addDocked({
            xtype: 'edittoolbar',
            listeners: {
                refresh: 'onRefresh',
                editpage: 'onEditPage',
                createleaf: 'onCreateLeaf',
                createtopic: 'onCreateTopic'
            }
        });

        var treePanel = this.lookup('treePanel');
        treePanel.getView().addPlugin({
            ptype: 'treeviewdragdrop'
        });
        treePanel.on('itemmove', me.onItemMove, me);

    },

    onRefresh: function() {
        var node = this.getViewModel().get('node');
        if (node) {
            console.log('refresh');
            this.lookup('content').updateNode(node);
        }
    },

    initViewModelEditing: function(vm) {
        if (!Deck.util.Global.editing) return;
        // The first time it's loaded, save it.
        // TODO: When editing, it should delete it to ensure a new tree is created.
        vm.bind('{topics}', function(topics) {
            Deck.util.Backend.saveTreeBuffered(topics);
        });
    },
    onEditPage: function() {
        var vm = this.getViewModel();
        var node = vm.get('node');
        var language = vm.get('language') || '_default';
        if (node) {
            if (node.isLeaf()) {
                Deck.util.Backend.openInEditor(node.data.id, language);
            } else {
                Ext.toast('Editing pages only applies to leaves.', 'Warning');
            }
        }

    },
    onCreateLeaf: function() {
        // If we're on a leaf, add a new node as a sibling.
        // Else if we're on a topic, add a new node as a last child.
        console.log('onCreateLeaf');
        var me = this;
        var vm = this.getViewModel();
        var node = vm.get('node');
        if (node) {
            if (node.isLeaf()) {
                var newNode = Ext.create('Deck.model.Node', {
                    "i18n": {
                        "_default": {
                            "title": "New Node",
                            "translated": true
                        }
                    }
                });
                var index = node.parentNode.indexOf(node);
                node.parentNode.insertChild((index + 1), newNode);
                Deck.util.Backend.persistNode(newNode.parentNode);
                Deck.util.Backend.persistNode(newNode);
                me.getViewModel().set('node', newNode);

            }
        }
    },
    onCreateTopic: function() {
        console.log('onCreateTopic');
    },

    onItemMove: function(node, oldParent, newParent, index, eOpts) {
        // Moving node means changing some parent node's children:[]
        // o Node moded within a parent -- one parent involved.
        // o Node moved to a new parent -- two parents involved.

        if (oldParent === newParent) {
            Deck.util.Backend.persistNode(oldParent);
        } else {
            Deck.util.Backend.persistNode(oldParent);
            Deck.util.Backend.persistNode(newParent);
        }
        Deck.util.Backend.saveTreeBuffered(this.getViewModel().get('topics'));

        // Recalculate the node array.
        this.getViewModel().get('topics').getNodeArray(true);

    }

});
