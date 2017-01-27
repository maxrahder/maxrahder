Ext.define('Deck.view.main.Editing', {
    extend: 'Ext.Mixin',
    requires: ['Ext.tree.plugin.TreeViewDragDrop', 'Deck.util.Backend'],

    initComponentEditing: function(view) {
        if (!Deck.util.Global.editing) return;
        var me = this;

        view.addDocked({
            xtype: 'edittoolbar'
        });

        var tree = this.lookup('tree');
        tree.getView().addPlugin({
            ptype: 'treeviewdragdrop'
        });
        tree.on('itemmove', me.onItemMove, me);

    },

    initViewModelEditing: function(vm) {
        if (!Deck.util.Global.editing) return;
        // The first time it's loaded, save it.
        // TODO: When editing, it should delete it to ensure a new tree is created.
        vm.bind('{topics}', function(topics) {
            Deck.util.Backend.saveTreeBuffered(topics);
        });
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
