Ext.define('Deck.view.main.MainViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.maincontroller',
    mixins: ['Deck.view.main.Editing'],
    requires: ['Deck.store.Topics', 'Deck.model.Node'],

    routes: {
        ':id': 'processRoute'
    },
    processRoute: function(id) {
        var me = this;
        if (id) {
            me.route = id;
            me.lookup('tree').goToPage(id);
        }
    },

    init: function(view) {
        this.initComponentEditing(view);
    },

    initViewModel: function(vm) {
        var me = this;
        me.initializeTopics();
        vm.bind('{node}', me.updateRoute, me);
        // Once the topics store actually exists, detect changes
        // to {language} in order to update node text.
        vm.bind('{topics}', function(topics) {
            // Once the tree is created it's safe to go to the route
            if (me.route) {
                //<debug>
                debugger;
                //</debug>
                me.lookup('tree').goToPage(me.route);
            }
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

    updateRoute: function(node) {
        this.redirectTo(node.data.id);
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
        var skippedPages = ["viewmodels", "2016-08-29_17-20_04-916_Z"];
        Deck.store.Topics.loadNodes().then(function(data) {
            var tree = Ext.create('Deck.store.Topics', {
                model: 'Deck.model.Node',
                root: data
            });
            vm.set('topics', tree);
        });
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
                this.lookup('tree').getSelectionModel().selectPrevious();
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
    }

});
