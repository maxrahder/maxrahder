Ext.define('Deck.view.main.MainViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.maincontroller',
    mixins: ['Deck.view.main.Editing'],
    requires: ['Deck.store.Topics', 'Deck.model.Node'],

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
        me.vm = vm; // Add a convenience property

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
        Deck.util.Global.language = language;
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
                iconCls: 'x-fa fa-clock-o',
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
