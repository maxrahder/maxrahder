Ext.define('Deck.store.Topics', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.deck-topics',
    model: 'Deck.model.Node',
    statics: {

        loadNodes: function(skippedPages) {
            var me = this;

            // skippedPages is an array of page IDs that should be skipped.

            skippedPages = (skippedPages || []);

            var deferred = new Ext.Deferred(); // create the Ext.Deferred object

            var loadNodesRoot = {};
            var danglingReferences = [];
            var readCount = 0;

            // Traverse all children, but skipping children in skip:[]
            readFile(loadNodesRoot, '_root', skippedPages);

            return deferred;

            function readFile(node, id, skippedPages) {
                // This method overlays the passed node (an object) with the contents of id.json
                var me = this;
                // if (Ext.Array.contains(hiddens, id)) {
                //     return;
                // }
                readCount++;
                var url = 'resources/pages/nodes/' + id + '.json';

                Ext.Ajax.request({
                    url: url,
                    node: node,
                    success: function(response, options) {
                        var newNode = Ext.JSON.decode(response.responseText);
                        var node = options.node;
                        Ext.apply(node, newNode);

                        // Assert: node holds what was in id.json

                        node.hidden = Ext.Array.contains(skippedPages, node.fileId);

                        // The node's children:[] starts out as an array of strings
                        // (node IDs), but it needs to be an array of child nodes.
                        // So copy and save the array into a local variable, then
                        // overwrite node.children with an empty array, and push new
                        // child nodes onto it.

                        if (node.children) {
                            var childIDs = Ext.Array.clone(node.children);
                            node.children = [];
                            for (var i = 0; i < childIDs.length; i++) {
                                var childId = childIDs[i];
                                if (Ext.Array.contains(skippedPages, childId)) {
                                    console.log('Skipping ' + childId);
                                } else {
                                    var child = {};
                                    node.children.push(child);
                                    readFile(child, childId, skippedPages); // Recurse
                                }
                            }
                        }
                        decrementReadCount();
                    },
                    failure: function(response, options) {
                        decrementReadCount();
                        if (response.status === 404) {
                            danglingReferences.push(id);
                        }
                        console.log('Dangling reference. Failed to read ' + id + ' under ' + node.fileId);
                        console.log(node);
                        console.log(response);
                    }
                });

            }

            function decrementReadCount() {
                var me = this;
                readCount--;
                if (readCount === 0) {
                    // s = Ext.JSON.encode(loadNodesRoot);
                    // if (window.sessionStorage) {
                    //     window.sessionStorage.setItem(me._storageId, s);
                    // }
                    // debugger;
                    deferred.resolve(loadNodesRoot, danglingReferences);
                }
            }
        }
    },
    // Return an array of node IDs in traversal order starting with the root.
    getNodeArray: function(recalculate) {
        var me = this;
        recalculate = !!recalculate;
        if (recalculate || !me._nodeArray) {
            me._nodeArray = [];
            var root = me.getRoot();
            root.cascadeBy(function(node) {
                if (!node.isRoot()) {
                    me._nodeArray.push(node);
                }
            });
        }
        return me._nodeArray;
    },

    // We need a few similar things:
    // Find the next node matching an id or text, circular.
    // Find the previous node matching an id or text, circular.
    // Find the next node
    // Find the previous node
    findNextOrPrevious: function(node, previous) {
        previous = !!previous;
        var i = Ext.Array.indexOf(this.getNodeArray(), node);
        if (i === -1) {
            return null;
        } else {
            var a = this.getNodeArray();
            if (previous) {
                // One less, or if we're already at the first, return the last.
                result = ((i === 0) ? a[a.length - 1] : a[i - 1]);
            } else {
                // One more, or if we're already at the last, return the first.
                result = ((i === (a.length - 1)) ? a[0] : a[i + 1]);
            }
        }
        return result;
    },
    // Starting with node, look for the node matching the id or text.
    findNode: function(node, s, forward) {
        forward = Ext.isDefined(forward) ? forward : true;
        var re = new RegExp(s.trim(), 'i');
        var array = this.getNodeArray();
        if (!forward) {
            // Clone the array then referce the items. We want a Clone
            // because referse() changes the array itself.
            array = array.slice().reverse(); // Clone the array, then reverse the items
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i].data.id.match(re) || array[i].data.text.match(re)) {
                break;
            }
        }
        if (i >= array.length) {
            // Not found
            result = node;
        } else {
            result = array[i];
        }
        return result;
    },

    // Get next when next is true, else prev.
    getNext: function(node, next) {
        var a = this.getNodeArray();
        var result = Deck.util.Global.getNext(a, node, next);
        return result;
    }

});
