Ext.define('Deck.util.Backend', {
    extend: 'Ext.Mixin',
    singleton: true,

    constructor: function() {
        this.callParent(arguments);
        this.persistNodeBuffered = Ext.Function.createBuffered(this.persistNode, 1000, this);
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

        // Put the URL and query fields together.
        var app = Ext.manifest.name;
        var id = node.data.id;
        var data = Ext.JSON.encode(o);
        var url = 'http://localhost:3000/saveNode?';
        url += 'app=' + app + '&';
        url += 'data=' + data + '&';
        url += 'id=' + id;
        url = encodeURI(url);

        me._send(url);

    },

    // Save content. Content is the .md backing each slide in the deck.
    persistContent: function(node, language) {

    },

    // The routine that actually sends the data to the Node service.
    _send: function(url) {
        Ext.Ajax.request({
            url: url,
        }).then(function(xhr) {
            Ext.toast({
                html: 'Changes Saved',
                title: node.data.text,
                width: 200,
                align: 'tr'
            });
        }, function(xhr) {
            if (xhr.status === 0) {
                Ext.toast('Did you start the Node server?', 'Error Saving');
            } else {
                Ext.toast(xhr.statusText, 'Error Saving ' + node.data.text);
            }
        });
    }

});
