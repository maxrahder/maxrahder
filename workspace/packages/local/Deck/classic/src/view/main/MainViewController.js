Ext.define('Deck.view.main.MainViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.maincontroller',
    requires: ['Deck.store.Topics', 'Deck.model.Node'],

    routes: {
        ':id': 'processRoute'
    },
    processRoute: function(id) {
        if (id) {
            // console.log(id);
        }
    },

    initViewModel: function(vm) {
        var me = this;

        me.initializeTopics();

        vm.bind('{node}', me.updateRoute, me);

    },
    updateRoute: function(node) {
        this.redirectTo(node.data.id);
    },

    onTreeItemClick: function(tree, record) {
        if (record.isExpanded()) {
            record.collapse();
        } else {
            record.expand();
        }
    },

    initializeTopics: function() {
        var vm = this.getViewModel();
        Deck.store.Topics.loadNodes().then(function(data) {
            var tree = Ext.create('Deck.store.Topics', {
                model: 'Deck.model.Node',
                root: data
            });
            vm.set('topics', tree);
        });
    },

    getTestData: function() {
        return {
            "fileId": "_root",
            "i18n": {
                "_default": {
                    "title": "Root"
                }
            },
            "leaf": false,
            "children": [{
                "fileId": "1",
                "i18n": {
                    "_default": {
                        "title": "One",
                        "translated": true
                    },
                    "fr": {
                        "title": "Un"
                    }
                },
                "leaf": true,
                "hidden": false
            }, {
                "fileId": "2",
                "i18n": {
                    "_default": {
                        "title": "Two",
                        "translated": true
                    },
                    "fr": {
                        "title": "Deux"
                    }
                },
                "leaf": true,
                "hidden": false
            }],
            "hidden": false
        };
    },
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
