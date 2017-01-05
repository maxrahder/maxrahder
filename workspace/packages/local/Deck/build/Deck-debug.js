Ext.define('Deck.util.Global', {
    singleton: true,
    editing: location.search.match(/\edit\b/),
    constructor: function() {
        this.language = '_default';
        if (location.search) {
            var q = Ext.Object.fromQueryString(location.search[1]);
            this.language = (q.language || this.language);
        }
        this.callParent(arguments);
    },
    rightShift: function(array, shift) {
        shift = (shift % array.length);
        var first = _.first(array, shift);
        var last = _.last(array, (array.length - shift));
        var result = last.concat(first);
        return result;
    },
    testShiftArray: function() {
        var a = [
                1,
                2,
                3,
                4,
                5
            ];
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 0), [
            1,
            2,
            3,
            4,
            5
        ]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 1), [
            2,
            3,
            4,
            5,
            1
        ]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 2), [
            3,
            4,
            5,
            1,
            2
        ]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 3), [
            4,
            5,
            1,
            2,
            3
        ]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 4), [
            5,
            1,
            2,
            3,
            4
        ]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 5), [
            1,
            2,
            3,
            4,
            5
        ]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 6), [
            2,
            3,
            4,
            5,
            1
        ]));
    },
    getNext: function(a, item, next) {
        next = Ext.isDefined(next) ? next : true;
        var i = Ext.Array.indexOf(a, item);
        var result = null;
        if (a.length === 0) {}
        // Do nothing
        else if (i === -1) {} else // Do nothing
        {
            if (next) {
                // If it's not at the end, get the next item. Else get the first.
                if (i < (a.length - 1)) {
                    result = a[i + 1];
                } else {
                    result = a[0];
                }
            } else {
                // If it's not at the beginning, get the previous. Else get the last.
                if (i > 0) {
                    result = a[i - 1];
                } else {
                    result = a[a.length - 1];
                }
            }
        }
        return result;
    },
    testGetNext: function() {
        var a = [
                1,
                2,
                3,
                4,
                5
            ];
        console.log(Deck.util.Global.getNext(a, 1, true) === 2);
        console.log(Deck.util.Global.getNext(a, 2, true) === 3);
        console.log(Deck.util.Global.getNext(a, 3, true) === 4);
        console.log(Deck.util.Global.getNext(a, 4, true) === 5);
        console.log(Deck.util.Global.getNext(a, 5, true) === 1);
        console.log(Deck.util.Global.getNext(a, 6, true) === null);
        console.log(Deck.util.Global.getNext(a, 1) === 2);
        console.log(Deck.util.Global.getNext(a, 2) === 3);
        console.log(Deck.util.Global.getNext(a, 3) === 4);
        console.log(Deck.util.Global.getNext(a, 1, false) === 5);
        console.log(Deck.util.Global.getNext(a, 2, false) === 1);
        console.log(Deck.util.Global.getNext(a, 3, false) === 2);
        console.log(Deck.util.Global.getNext(a, 4, false) === 3);
        console.log(Deck.util.Global.getNext(a, 5, false) === 4);
        console.log(Deck.util.Global.getNext(a, 6, false) === null);
    }
});

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
        if (!node)  {
            return;
        }
        
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
    persistContent: function(node, language) {},
    // The routine that actually sends the data to the Node service.
    _send: function(url) {
        Ext.Ajax.request({
            url: url
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

Ext.define('Deck.model.Node', {
    extend: 'Ext.data.TreeModel',
    extend: 'Ext.data.TreeModel',
    requires: [
        'Deck.util.Global',
        'Deck.util.Backend'
    ],
    statics: {
        cache: {},
        getCachedContent: function(fileId) {
            return Deck.model.Node.cache[fileId];
        }
    },
    fields: [
        'i18n',
        {
            name: 'text',
            convert: function(value, record) {
                var i18n = record.data.i18n;
                if (!i18n)  {
                    return '';
                }
                
                var result;
                var language = record.data.language;
                // Use the entry for the language, if there is one.
                if (i18n[language]) {
                    result = i18n[language].title;
                }
                
                // If there is a value, use it. Else, use the default.
                result = (result || record.data.i18n._default.title);
                if (record.data.id === '2015-06-08_22-34_58-147_Z') {
                    console.log(result);
                }
                return result;
            },
            depends: [
                'language',
                'i18n'
            ]
        },
        {
            name: 'language',
            defaultValue: '_default'
        },
        {
            name: 'leaf',
            convert: function(value, record) {
                return record.data.leaf || !record.data.children;
            }
        }
    ],
    // Updates the i18n node language entry with the specified text.
    updateText: function(text) {
        var me = this;
        var language = me.data.language;
        // Bail out if the text isn't any different.
        if (me.data.i18n[language] && (me.data.i18n[language].title === text))  {
            return;
        }
        
        // Get the current value of i18n. If there is no entry for the
        // language, create it. Then update the language entry's title.
        // Finally, replace the i18n item, which is a depends, which will
        // cause the text to be recalculated. If there is a way to simply
        // update the text (and have stores know about it), that would
        // work too.
        var i18n = Ext.clone(me.data.i18n);
        i18n[language] = i18n[language] || {
            persisted: false,
            title: ''
        };
        i18n[language].title = text;
        me.set('i18n', i18n);
    },
    // TODO: Finish this method
    getPersistableNode: function() {
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
    },
    getContent: function() {
        var me = this;
        var deferred = Ext.create('Ext.Deferred');
        // The initial store only has a single node -- the root, which is a leaf.
        // That node has no text. Any other leaf *does* have content to fetch.
        if (!me.isRoot() && me.isLeaf()) {
            doIt();
        } else {
            deferred.resolve(me.data.text);
        }
        return deferred.promise;
        function doIt() {
            var language = Deck.util.Global.language;
            var i18n = me.data.i18n;
            var fileId = me.data.id;
            // console.log(i18n);
            var text = Deck.model.Node.getCachedContent(fileId);
            if (text) {
                deferred.resolve(text);
            } else {
                if (fileId) {
                    Ext.Ajax.request({
                        url: ('resources/pages/content/_default/' + fileId + '.md')
                    }).then(function(xhr) {
                        text = xhr.responseText;
                        text = marked(text);
                        me.cacheContent(text);
                        deferred.resolve(text);
                    }, function(xhr) {
                        deferred.reject(xhr);
                    });
                } else {
                    deferred.resolve('');
                }
            }
        }
    },
    persistNode: function() {
        // Call the web service and persist chages to the node.
        Deck.util.Backend.persistNode(this);
    },
    persistContent: function(language) {
        lanuage = language || '_default';
    },
    // Call the web service and persist chages to the node.
    cacheContent: function(text) {
        if (this.data.id) {
            Deck.model.Node.cache[this.data.id] = text;
        }
    }
});

Ext.define('Deck.store.Topics', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.deck-topics',
    model: 'Deck.model.Node',
    statics: {
        loadNodes: function(skippedPages) {
            var me = this;
            // skippedPages is an array of page IDs that should be skipped.
            skippedPages = (skippedPages || []);
            var deferred = new Ext.Deferred();
            // create the Ext.Deferred object
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
                                    readFile(child, childId, skippedPages);
                                }
                            }
                        }
                        // Recurse
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
            array = array.slice().reverse();
        }
        // Clone the array, then reverse the items
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

Ext.define('Deck.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.maincontroller'
});

Ext.define('Deck.view.main.Main', {
    xtype: 'deck-main',
    extend: 'Ext.Container',
    requires: [
        'Deck.view.main.MainController'
    ],
    controller: 'maincontroller',
    html: 'modern'
});

