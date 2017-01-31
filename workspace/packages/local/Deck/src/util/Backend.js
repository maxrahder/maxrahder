Ext.define('Deck.util.Backend', {
    extend: 'Ext.Mixin',
    singleton: true,

    constructor: function() {
        this.callParent(arguments);
        this.persistNodeBuffered = Ext.Function.createBuffered(this.persistNode, 1000, this);
        this.saveTreeBuffered = Ext.Function.createBuffered(this.saveTree, 1000, this);
    },

    // Serialize the tree
    saveTree: function(treeStore) {
        var me = this;
        var hierarchy = treeStore.getHierarchy();
        var request = {
            url: 'http://localhost:3000/saveTree',
            jsonData: {
                data: Ext.JSON.encode(hierarchy)
            }
        };
        me._send(request, 'Tree hierarchy');
    },

    // Save content. Nodes are the raw .json used for a tree node.
    openInEditor: function(id, language) {
        var me = this;
        var request = {
            url: 'http://localhost:3000/openInEditor',
            jsonData: {
                id: id,
                language: language
            }
        };
        me._send(request, 'Open ' + id);
    },

    // Save content. Nodes are the raw .json used for a tree node.
    persistContent: function(id, language, content) {
        language = (language || '_default');
        content = (content || '');
        var request = {
            url: 'http://localhost:3000/saveContent',
            jsonData: {
                id: id,
                data: content,
                language: language
            }
        };
        me._send(request, 'Content ' + id);

    },

    // Save a node. Nodes are the raw .json used for a tree node.
    persistNode: function(node) {
        var me = this;
        console.log('persistNode');
        if (!node) return;
        var o = {
            "id": node.data.id,
            "i18n": Ext.clone(node.data.i18n),
            "leaf": node.isLeaf()
        };
        if (!node.isLeaf() && node.childNodes) {
            o.children = [];
            Ext.Array.forEach(node.childNodes, function(item) {
                o.children.push(item.data.id);
            });
        }

        var request = {
            url: 'http://localhost:3000/saveNode',
            jsonData: {
                id: node.data.id,
                data: Ext.JSON.encode(o)
            }
        };

        me._send(request, ('Node ' + node.data.id));
    },

    // The routine that actually sends the data to the Node service.
    // text is the human readable description of what is being saved
    // request must hold a URL, and typically also has a data property with the payload
    _send: function(request, text) {
        Ext.apply(request, {
            method: 'POST'
        });
        Ext.apply(request.jsonData, {
            app: Ext.manifest.name
        });
        Ext.Ajax.request(request).then(function(xhr) {
            Ext.toast({
                title: 'Saved',
                html: text + ' was saved.',
                width: 250,
                align: 'tr'
            });
        }, function(xhr) {
            if (xhr.status === 0) {
                Ext.toast('Did you start the Node server?', 'Error Saving');
            } else {
                Ext.toast(xhr.statusText, 'Error Saving ' + text + ' was not saved.');
            }
        });
    }

});
