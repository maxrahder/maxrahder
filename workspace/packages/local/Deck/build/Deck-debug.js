/**
 *     Ext.define('MyApp.data.MyModel', {
 *         extend: 'Ext.data.Model',
 *         identifier: {
 *             type: 'fileid'
 *         }
 *     });
 *     // Assign id's of like "2017-01-28T20-58-26-790Z", meaning, January 28, at 20:50 and 26.790 seconds, UTC.
 *
 */
Ext.define('Deck.model.IdGenerator', {
    extend: 'Ext.data.identifier.Generator',
    alias: 'data.identifier.fileid',
    suffix: 0,
    generate: function() {
        // If two are created within a millisecond, you'd have duplicate IDs. Therefore,
        // check and add an incremented suffix if needed.
        var result = Ext.Date.format(new Date(), 'C').replace(/\.|\:/g, '-');
        if (result === this.previous) {
            result += ('-' + ++this.suffix);
        } else {
            // They aren't the same, so set the suffix back to zero.
            this.suffix = 0;
            this.previous = result;
        }
        return result;
    }
});

Ext.define('Deck.model.MarkedOverrides', {
    requires: [],
    singleton: true,
    constructor: function() {
        var me = this;
        // var callouts = [
        // 	/^ *(TIP:) *([^\n]+?) *#* *(?:\n+|$)/,
        // 	/^ *(NOTE:) *([^\n]+?) *#* *(?:\n+|$)/,
        // 	/^ *(WARNING:) *([^\n]+?) *#* *(?:\n+|$)/,
        // 	/^ *(STOP:) *([^\n]+?) *#* *(?:\n+|$)/,
        // 	/^ *(EXPERIMENT:) *([^\n]+?) *#* *(?:\n+|$)/
        // ];
        // var domString = '<div class="block"><span class="{0} content">{1}</div>';
        // marked.InlineLexer.prototype.outputOriginal = marked.InlineLexer.prototype.output;
        // marked.InlineLexer.prototype.output = function(src) {
        // 	var result;
        // 	for (var i = 0; i < callouts.length; i++) {
        // 		var cap = callouts[i].exec(src);
        // 		if (cap) {
        // 			var cls = cap[1];
        // 			cls = cls.substr(0, cls.length - 1).toLowerCase();
        // 			result = Ext.String.format(domString, cls, cap[2]);
        // 			break;
        // 		}
        // 	}
        // 	return result || this.outputOriginal(src);
        // };
        marked.InlineLexer.prototype.outputSave = marked.InlineLexer.prototype.output;
        var tasks = [
                'doCallouts'
            ];
        marked.InlineLexer.prototype.output = function(line) {
            for (var i = 0; i < tasks.length; i++) {
                line = me[tasks[i]](line);
            }
            // "this" is the lexer.
            return this.outputSave(line);
        };
    },
    calloutCss: {
        'TIP:': 'tip',
        'NOTE:': 'note',
        'WARNING:': 'warning',
        'STOP:': 'caution',
        'EXPERIMENT:': 'experiment'
    },
    callouts: [
        'TIP:',
        'NOTE:',
        'WARNING:',
        'STOP:',
        'EXPERIMENT:'
    ],
    calloutHtml: '<div class="block"><span class="{0} content">{1}</span></div>',
    doCallouts: function(line) {
        for (var i = 0; i < this.callouts.length; i++) {
            var c = this.callouts[i];
            if (line.startsWith(c)) {
                var cls = this.calloutCss[c].toLowerCase();
                return Ext.String.format(this.calloutHtml, cls, line.substr(c.length));
            }
        }
        return line;
    },
    expanderRe: /<div.*expander.*caption="(.*)".*>/,
    olStep: /(^\?\?)(.*)(\n\.\n)([^]*)/,
    olEndStep: /(.*)(\n\.\.$)/,
    doOlStep: function(line) {
        var result = line;
        // result = result.replace(this.expanderRe, function(match, s1) {
        //     debugger;
        //     return '<div class="expander"><span class="expandertitle">' + s1 + '</span>';
        // });
        result = result.replace(this.olStep, function(match, s1, s2, s3, s4) {
            return '<div class="expander collapsed"><span class="expandertitle">' + s2 + '</span><div class="content"><p>' + s4 + '</p>';
        });
        result = result.replace(this.olEndStep, function(match, s1, s2) {
            return s1 + '</div></div>';
        });
        return result;
    }
});

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
    persistContent: function(id, content, language) {
        var me = this;
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

Ext.define('Deck.model.Node', {
    extend: 'Ext.data.TreeModel',
    requires: [
        'Deck.model.IdGenerator',
        'Deck.util.Global',
        'Deck.util.Backend'
    ],
    statics: {
        cache: {},
        getCachedContent: function(fileId) {
            return Deck.model.Node.cache[fileId];
        }
    },
    identifier: {
        type: 'fileid'
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
        if (me.data.language) {
            // There is a language property. If the text is unchangd, bail out.
            if (me.data.i18n[language].title === text) {
                return;
            }
        } else {
            // No language property is there yet. If the text matches the default, bail out.
            if (me.data.i18n._default.title === text) {
                return;
            }
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
            var text = '';
            // Deck.model.Node.getCachedContent(fileId);
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
    },
    isLab: function() {
        return (this.data.text.substr(0, 4) === 'Lab:');
    },
    getParentTitles: function() {
        var result = [];
        var node = this;
        while (node) {
            result.push(node.getText());
            node = node.parentNode;
        }
        return result;
    }
});

Ext.define('Deck.store.Topics', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.deck-topics',
    requires: [
        'Deck.util.Backend'
    ],
    model: 'Deck.model.Node',
    statics: {
        loadNodes: function(skippedPages) {
            var me = this;
            var deferred = new Ext.Deferred();
            me._loadNodes(skippedPages).then(function(data, dangling) {
                console.log('tree.json does not exist. Building tree.');
                deferred.resolve(data, dangling);
            }, function() {
                console.log('Failure creating tree from _loadNotes');
                deferred.reject();
            });
            return deferred;
        },
        _loadNodes: function(skippedPages) {
            var me = this;
            // skippedPages is an array of page IDs that should be skipped.
            skippedPages = (skippedPages || []);
            var deferred = new Ext.Deferred();
            // create the Ext.Deferred object
            var loadNodesRoot = {};
            var danglingReferences = [];
            var readCount = 0;
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
                        if (response.status === 404) {
                            danglingReferences.push(id);
                        }
                        console.log('Dangling reference. Failed to read ' + id + ' under ' + node.fileId);
                        console.log(node);
                        console.log(response);
                        decrementReadCount();
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
    // Find the next or previous node, circular.
    findNextOrPrevious: function(node, next) {
        next = Ext.isBoolean(next) ? next : true;
        var i = Ext.Array.indexOf(this.getNodeArray(), node);
        if (i === -1) {
            return null;
        } else {
            var a = this.getNodeArray();
            if (next) {
                // One more, or if we're already at the last, return the first.
                result = ((i === (a.length - 1)) ? a[0] : a[i + 1]);
            } else {
                // One less, or if we're already at the first, return the last.
                result = ((i === 0) ? a[a.length - 1] : a[i - 1]);
            }
        }
        return result;
    },
    // Starting with node following node, look for the node matching the id or text.
    findNode: function(currentNode, s, forward) {
        forward = Ext.isDefined(forward) ? forward : true;
        // forward defaults to true
        var array = forward ? this.getNodeArray() : this.getNodeArray().slice().reverse();
        // backwards? Reverse the array.
        var index = array.indexOf(currentNode);
        array = Deck.util.Global.rightShift(array, index + 1);
        // The next node is now in position 0
        var re = new RegExp(s.trim(), 'i');
        // i means case insentitive
        var result = Ext.Array.findBy(array, function(item) {
                return (item.data.id.match(re) || item.data.text.match(re));
            });
        return result;
    },
    // Get next when next is true, else prev.
    getNext: function(node, next) {
        var a = this.getNodeArray();
        var result = Deck.util.Global.getNext(a, node, next);
        return result;
    },
    getHierarchy: function() {
        var root = this.getRoot();
        var result = {};
        hierarchy(root, result);
        return result;
        function hierarchy(node, object) {
            // node is a NodeInterface record, object should always be a new empty object
            // that will be overlaid with serializable version of node:
            // {
            //     "id": "123",
            //     "i18n": {},
            //     children:[
            //         {"id": "345", "i18n":{}: children:[{},{}]},
            //         {"id", "789", "i18n":{}: children:[{},{}]}
            //     ]
            // }
            object.id = node.data.id;
            object.i18n = Ext.clone(node.data.i18n);
            if (!node.isLeaf()) {
                object.children = [];
                // In theory, any node not a leaf must have childNodes:[].
                for (var i = 0; i < node.childNodes.length; i++) {
                    var childNode = node.childNodes[i];
                    var childObject = {};
                    object.children.push(childObject);
                    hierarchy(childNode, childObject);
                }
            }
        }
    }
});
// Recurse

Ext.define('Deck.view.content.ContentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.deck-content',
    onKeyMap: function(key, event) {
        this.fireViewEvent('navigate', key);
    }
});

Ext.define('Deck.view.content.ContentMethods', {
    extend: 'Ext.Mixin',
    requires: [
        'EditView.view.editview.PreTagEditAndView'
    ],
    updateNode: function(node) {
        var me = this;
        if (!node)  {
            return;
        }
        
        if (node.isLeaf()) {
            node.getContent().then(function(html) {
                me.updateContent(html, node);
            }, function() {
                console.log('Failure reading ' + node.id);
                console.log(arguments);
            });
        } else {
            var html = [
                    "<img style='height: 60%; display: block; margin: 3em auto 0 auto; ' src='resources/images/senchaleaf.svg'></img>"
                ];
            me.update(html.join(''), node);
        }
        me.lookup('breadcrumb').setSelection(node);
    },
    updateContent: function(html, node) {
        var me = this;
        // Any time you do a batch of updates, you'd want to turn off events.
        // In this case, I'm not sure there's anything being fired, so this
        // may not be necessary.
        me.suspendEvents();
        // Clean up old HTML
        me.getEl().select('div.expander', true).clearListeners();
        // I wonder if it would be faster to create an un-attached DOM object, update it,
        // then use it as the panel's child.
        me.setHtml(html);
        if (node.isLab()) {
            me.getEl().down('div.x-panel-body').addCls('lab');
        }
        // debugger;
        // TODO: In the past, if there was an <h1> at the top of the page, it would
        // override the title. Now the title is bound to the node's text, so the
        // idea of overriding it doesn't fit in so well. How *do* we implement the notion
        // of a short title, and longer title. Like a node title and page title. Maybe
        // the best thing is to have two properties in the node json.
        // var firstChild = el.down('.x-panel-body').getFirstChild()
        // if (firstChild.dom.tagName === 'H1'){
        //     me.lookup('title').
        // }
        me.setupExpanders(me, node);
        // The code saves references to the <pre> tags.
        // TODO: Make sure those are deleted from the DOM
        // as the user goes from page to page.
        me.preTags = me.preTags || [];
        me.preTags = [];
        var a = me.getEl().query('pre.runnable');
        Ext.Array.forEach(a, function(element) {
            var preTag = Ext.create('EditView.view.editview.PreTagEditAndView', {
                    style: 'border: thin solid #eeeeee',
                    pre: element,
                    renderTo: element
                });
            me.preTags.push(preTag);
        });
        // The idea is to make sure the user always sees the start of a given
        // page, but I'm not sure it does anything.
        me.scrollTo(0, 0);
        me.resumeEvents();
    },
    setupExpanders: function(me, node) {
        var a = me.getEl().query('div[type="expander"]');
        if (node.isLab()) {
            var lab = true;
            var step = 0;
        }
        Ext.Array.forEach(a, function(div) {
            // debugger;
            // Create a new ideal <div> with a child <span> caption, and <div class="content">
            // Then replace the old div with the new one.
            var expander = document.createElement('div');
            var expanderEl = Ext.get(expander);
            expanderEl.addCls('expander collapsed');
            var attributes = Ext.fly(div).getAttributes();
            var caption = document.createElement('span');
            Ext.fly(caption).addCls('expandertitle');
            caption.innerHTML = (lab ? (++step + '.&nbsp;') : '') + attributes.caption;
            var newDiv = document.createElement('div');
            Ext.fly(newDiv).addCls('content');
            newDiv.innerHTML = div.innerHTML;
            expander.append(caption);
            expander.append(newDiv);
            Ext.get(caption).on('click', function() {
                if (expanderEl.hasCls('collapsed')) {
                    expanderEl.removeCls('collapsed');
                    expanderEl.addCls('expanded');
                } else {
                    expanderEl.addCls('collapsed');
                    expanderEl.removeCls('expanded');
                }
            });
            div.parentNode.replaceChild(expander, div);
        });
    }
});

Ext.define('Deck.view.content.Content', {
    xtype: 'deck-content',
    extend: 'Ext.panel.Panel',
    requires: [
        'Deck.view.content.ContentController'
    ],
    mixins: [
        'Deck.view.content.ContentMethods'
    ],
    // 'Ext.toolbar.Breadcrumb' // Leaving this in breaks things.
    controller: 'deck-content',
    renderConfig: {
        node: null
    },
    cls: 'deckcontentview',
    bodyPadding: 8,
    scrollable: true,
    layout: 'fit',
    dockedItems: [
        {
            xtype: 'toolbar',
            items: [
                {
                    xtype: 'breadcrumb',
                    reference: 'breadcrumb',
                    bind: {
                        store: '{topics}'
                    }
                },
                // selection: '{node}' // This is setting node to the root accidentally, so set its selection procedurally
                '->',
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-arrows-h',
                    tooltip: 'Focus for arrow key navigation',
                    keyMap: {
                        // Add shifted versions too
                        "RIGHT": 'onKeyMap',
                        "LEFT": 'onKeyMap',
                        "UP": 'onKeyMap',
                        "DOWN": 'onKeyMap'
                    }
                }
            ]
        },
        {
            xtype: 'component',
            dock: 'top',
            itemId: 'title',
            reference: 'title',
            cls: 'title',
            tpl: '{text}',
            height: 48,
            bind: {
                data: '{node.text}'
            }
        }
    ]
});

Ext.define('Deck.view.edit.ToolbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.edit-toolbar',
    requires: [
        'Deck.util.Backend'
    ],
    init: function() {
        var me = this;
    },
    initViewModel: function(vm) {
        var me = this;
        vm.bind('{node.text}', function(text) {
            me.lookup('nodeTitle').setValue(text);
        });
        vm.bind('{topics}', function(topics) {
            topics.on('update', me.onTopicsUpdate, me);
        });
    },
    onTopicsUpdate: function(store, record, operation, modifiedFieldNames) {
        if (!modifiedFieldNames)  {
            return;
        }
        
        if (Ext.Array.contains(modifiedFieldNames, 'children')) {
            console.log('children changed');
        } else if (Ext.Array.contains(modifiedFieldNames, 'i18n')) {
            Deck.util.Backend.persistNodeBuffered(record);
            Deck.util.Backend.saveTreeBuffered(this.getViewModel().get('topics'));
        }
    },
    onTitleChange: function(field, value) {
        var me = this;
        node = me.getViewModel().get('node');
        node.updateText(value);
    },
    onCreateLeaf: function(button) {
        this.fireViewEvent('createleaf');
    },
    onCreateTopic: function(button) {
        this.fireViewEvent('createtopic');
    },
    onEditPage: function(button) {
        this.fireViewEvent('editpage');
    },
    onRefresh: function(button) {
        this.fireViewEvent('refresh');
    }
});

Ext.define('Deck.view.edit.ToolbarModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.edit-toolbar',
    data: {
        name: 'Foo'
    }
});

Ext.define('Deck.view.edit.Toolbar', {
    xtype: 'edittoolbar',
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'Deck.view.edit.ToolbarController',
        'Deck.view.edit.ToolbarModel'
    ],
    controller: 'edit-toolbar',
    viewModel: {
        type: 'edit-toolbar'
    },
    renderConfig: {
        language: '_default'
    },
    publishes: [
        'language'
    ],
    items: [
        {
            xtype: 'segmentedbutton',
            value: '_default',
            bind: {
                value: '{language}'
            },
            items: [
                {
                    text: 'US',
                    value: '_default'
                },
                {
                    text: 'FR',
                    value: 'fr-FR'
                },
                {
                    text: 'JP',
                    value: 'jp-JP'
                }
            ],
            margin: 1
        },
        {
            xtype: 'tbspacer',
            width: 16
        },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-folder-o',
            text: 'Add Topic',
            handler: 'onCreateTopic'
        },
        {
            xtype: 'textfield',
            width: 300,
            labelWidth: 60,
            fieldLabel: 'Topic title',
            reference: 'nodeTitle',
            bind: {
                value: '{node.title}'
            },
            listeners: {
                change: 'onTitleChange'
            }
        },
        {
            xtype: 'tbspacer',
            width: 16
        },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-file-o',
            text: 'Add Page',
            handler: 'onCreateLeaf'
        },
        {
            text: 'Edit Page',
            iconCls: 'x-fa fa-external-link',
            handler: 'onEditPage'
        },
        {
            text: 'Refresh Page',
            iconCls: 'x-fa fa-refresh',
            handler: 'onRefresh'
        }
    ]
});

Ext.define('Deck.view.main.Editing', {
    extend: 'Ext.Mixin',
    requires: [
        'Ext.tree.plugin.TreeViewDragDrop',
        'Deck.util.Backend'
    ],
    initComponentEditing: function(view) {
        if (!Deck.util.Global.editing)  {
            return;
        }
        
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
        if (!Deck.util.Global.editing)  {
            return;
        }
        
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
    _createNode: function(config) {
        // This is used by onCreateLeaf and onCreateTopic
        console.log('createNode');
        var me = this;
        var vm = this.getViewModel();
        var node = vm.get('node');
        if (node) {
            var newNode = Ext.create('Deck.model.Node', config);
            var index = node.parentNode.indexOf(node);
            if (node.isLeaf()) {
                // If we're on a leaf, add the new node as a sibling.
                node.parentNode.insertChild((index + 1), newNode);
            } else {
                // If we're on a topic, add the new node as a last child.
                node.appendChild(newNode);
            }
            Deck.util.Backend.persistNode(newNode.parentNode);
            Deck.util.Backend.persistNode(newNode);
            // me.getViewModel().set('node', newNode); // I haven't decided if it's best to take the user on the new node -- probably not.
            return newNode;
        }
    },
    onCreateLeaf: function() {
        var newNode = this._createNode({
                "i18n": {
                    "_default": {
                        "title": "New Node",
                        "translated": true
                    }
                }
            });
        Deck.util.Backend.persistContent(newNode.data.id);
    },
    onCreateTopic: function() {
        this._createNode({
            "i18n": {
                "_default": {
                    "title": "New Topic"
                }
            },
            children: []
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

Ext.define('Deck.view.main.MainViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.maincontroller',
    mixins: [
        'Deck.view.main.Editing'
    ],
    requires: [
        'Deck.store.Topics',
        'Deck.model.Node'
    ],
    routes: {
        ':id': 'processRoute'
    },
    processRoute: function(id) {
        // The route information has changed. There are two awkward cases:
        // The route changed because the user clicked a node on the tree
        // The app just launched with a route in the URL
        // In the first case, only go to the page if the ID != the current node
        // In the second, there won't be a store yet, so nothing can happen yet (see initViewModel)
        var me = this;
        if (id) {
            var node = me.getNode();
            if (node && (node.data.id !== id)) {
                me.goToPage(me.getViewModel().get('topics'), id);
            }
        }
    },
    getNode: function() {
        // Convenience function that returns the node, or undefined
        if (this.vm) {
            if (this.vm.get('node')) {
                return this.vm.get('node');
            }
        }
    },
    init: function(view) {
        // Do editing init, if any
        this.initComponentEditing(view);
    },
    initViewModel: function(vm) {
        var me = this;
        me.vm = vm;
        // Add a convenience property
        // Do editing init, if any
        me.initViewModelEditing(vm);
        me.initializeTopics();
        vm.bind('{node}', me.nodeChange, me);
        // Once the topics store actually exists, detect changes
        // to {language} in order to update node text.
        vm.bind('{topics}', function(topics) {
            // This is the first time the tree has been loaded -- set the
            // selection to whatever is in the route.
            // For reasons I don't understand, the VM doesn't have topics yet. So pass it in.
            me.goToPage(topics, Ext.util.History.getHash());
            vm.bind('{language}', me.updateLanguage, me);
        });
    },
    updateLanguage: function(language) {
        var me = this;
        var store = me.getViewModel().get('topics');
        var root = store.getRootNode();
        root.cascadeBy(function(node) {
            node.set('language', language);
        });
    },
    nodeChange: function(node) {
        var me = this;
        me.lookup('treePanel').setSelection(node);
        me.updateRoute(node);
        var parent = node.parentNode;
        while (parent) {
            parent.expand();
            parent = parent.parentNode;
        }
    },
    updateRoute: function(node) {
        // The node has changed, so update the route in the URL to reflect the new page ID.
        if (node) {
            this.redirectTo(node.data.id);
        }
    },
    onTreeItemClick: function(tree, record) {
        // By default, trees only expand and collapse using the icon at the left
        // of the node. This method expands node when the node itself is selected.
        if (record.isExpanded()) {
            record.collapse();
        } else {
            record.expand();
        }
    },
    initializeTopics: function() {
        var me = this;
        // Ideally, the store would be there, empty, and we'd fetch the data and
        // update it. But I couldn't get that to work. Instead, the store doesn't
        // exist at all, the this code fetches the data then creates the store.
        var vm = this.getViewModel();
        if (Deck.util.Global.editing) {
            Ext.toast({
                title: 'Edit Mode',
                html: 'In edit mode, all nodes are read individually<br>to create the tree. Please be patient. :-)',
                width: 300
            });
            Ext.Function.defer(loadTopics, 1, me);
        } else {
            Ext.Ajax.request({
                url: 'resources/pages/tree.json',
                success: function(xhr) {
                    // The saved tree is there -- use it
                    console.log('Using tree.json');
                    var data = Ext.JSON.decode(xhr.responseText);
                    createStore(data);
                },
                failure: function() {
                    console.log('tree.json does not exist-- loading individual nodes');
                    loadTopics();
                }
            });
        }
        function loadTopics() {
            me.getHiddenArray(function(skippedPages) {
                Deck.store.Topics.loadNodes(skippedPages).then(function(data) {
                    createStore(data);
                });
            }, me);
        }
        function createStore(data) {
            var store = Ext.create('Deck.store.Topics', {
                    model: 'Deck.model.Node',
                    root: data
                });
            vm.set('topics', store);
        }
    },
    // Called when the user uses arrow keys to navigate. The method changes {node}
    // to the prev or next node, moving up or down the hierarchy if needed. This
    // method is not well tested.
    onNavigate: function(content, key) {
        var vm = this.getViewModel();
        var node = vm.get('node');
        var newNode;
        var parent;
        if (node) {
            if (key.keyCode === Ext.event.Event.LEFT) {
                this.lookup('treepanel').getSelectionModel().selectPrevious();
            } else if (key.keyCode === Ext.event.Event.RIGHT) {
                if (node.isLeaf()) {
                    newNode = node.nextSibling;
                } else {
                    newNode = node.firstChild;
                    node.expand();
                }
                // If there isn't a child or sibling, up up and get the uncle
                if (!newNode) {
                    parent = node.parentNode;
                    if (parent && !parent.isRoot()) {
                        newNode = parent.nextSibling;
                    }
                }
            }
        }
        // If we never did find a next node, then get the first node.
        if (!newNode) {
            newNode = vm.get('topics').getRoot().firstChild;
        }
        vm.set('node', newNode);
    },
    getHiddenArray: function(callback, scope) {
        scope = scope || this;
        Ext.Ajax.request({
            url: 'resources/pages/hidden/hidden.json',
            success: function(response) {
                var hidden = Ext.JSON.decode(response.responseText);
                callback.call(scope, hidden);
            },
            failure: function() {
                callback.call(scope, null);
            }
        });
    },
    goToPage: function(topics, value) {
        var me = this;
        if (topics) {
            var found = topics.findNode(topics.getRoot(), value);
            if (found) {
                var treePanel = me.lookup('treePanel');
                treePanel.suspendEvents();
                me.getViewModel().set('node', found);
                treePanel.resumeEvents();
            }
        }
    }
});

Ext.define('Deck.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.deck-mainviewmodel',
    requires: [
        'Deck.model.Node',
        'Deck.store.Topics'
    ],
    data: {
        language: '_default'
    },
    formulas: {},
    stores: {}
});

Ext.define('Deck.view.topics.TopicsMethods', {});

Ext.define('Deck.view.topics.TopicsViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.topicsviewcontroller',
    requires: [
        'Deck.store.Topics',
        'Deck.model.Node',
        'Ext.event.Event'
    ],
    onArrowClick: function(button) {
        var me = this;
        var value = me.lookup('searchfield').getValue();
        var next = (button.getItemId() === 'right');
        me._findPage(value, next);
    },
    onSearchFieldKeyUp: function(field, event) {
        var me = this;
        if (event.getKey() === Ext.event.Event.RETURN) {
            var value = field.getValue();
            var next = !event.shiftKey;
            me._findPage(value, next);
        }
    },
    _findPage: function(value, next) {
        var me = this;
        if (value) {
            var vm = me.getViewModel();
            var node = vm.get('topics').findNode(vm.get('node'), value, next);
            vm.set('node', node);
        }
    }
});

Ext.define('Deck.view.topics.Topics', {
    xtype: 'deck-topics',
    extend: 'Ext.tree.Panel',
    mixins: [
        'Deck.view.topics.TopicsMethods'
    ],
    requires: [
        'Deck.view.topics.TopicsViewController',
        'Deck.util.Global'
    ],
    controller: 'topicsviewcontroller',
    // viewModel: {},
    rootVisible: false,
    useArrows: true,
    initComponent: function() {
        this.callParent(arguments);
    },
    tools: [
        {
            type: 'minus'
        },
        {
            type: 'plus'
        }
    ],
    bbar: [
        {
            xtype: 'textfield',
            flex: 1,
            enableKeyEvents: true,
            reference: 'searchfield',
            emptyText: 'Find topic',
            listeners: {
                keyup: 'onSearchFieldKeyUp'
            }
        },
        {
            xtype: 'segmentedbutton',
            allowToggle: false,
            defaults: {
                handler: 'onArrowClick'
            },
            items: [
                {
                    iconCls: 'x-fa fa-arrow-left',
                    itemId: 'left'
                },
                {
                    iconCls: 'x-fa fa-arrow-right',
                    itemId: 'right'
                }
            ]
        }
    ]
});

Ext.define('Deck.view.main.Main', {
    xtype: 'deck-main',
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.plugin.Viewport',
        'Deck.view.main.MainViewController',
        'Deck.view.main.MainViewModel',
        'Deck.view.topics.Topics',
        'Deck.view.content.Content',
        'Deck.view.edit.Toolbar'
    ],
    controller: 'maincontroller',
    viewModel: {
        type: 'deck-mainviewmodel'
    },
    layout: 'border',
    items: [
        {
            xtype: 'deck-topics',
            region: 'west',
            collapsible: true,
            collapseMode: 'mini',
            titleCollapse: true,
            reference: 'treePanel',
            split: true,
            width: 200,
            listeners: {
                itemclick: 'onTreeItemClick'
            },
            // selec: 'onNodeSelect'
            bind: {
                store: '{topics}',
                selection: '{node}'
            }
        },
        {
            xtype: 'deck-content',
            reference: 'content',
            bind: {
                node: '{node}'
            },
            listeners: {
                navigate: 'onNavigate'
            },
            region: 'center'
        }
    ]
});

