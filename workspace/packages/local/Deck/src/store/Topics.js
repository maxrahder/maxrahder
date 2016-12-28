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
    }

});
