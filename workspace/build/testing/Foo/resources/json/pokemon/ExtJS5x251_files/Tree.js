Ext.define('Engine.controller.Tree', {
    extend: 'Ext.app.Controller',

    views: ['Tree', 'LinkWindow'],
    stores: ['Topics'],
    models: ['Topic', 'Node'],

    requires: [
        'Ext.state.LocalStorageProvider',
        'Ext.util.History',
        'Engine.util.File'
    ],

    refs: [{
        ref: 'treeView',
        selector: 'training_tree treeview'
    }, {
        ref: 'filePathLabel',
        selector: '#filePathLabel'
    }, {
        ref: 'slide',
        selector: 'slide'
    }, {
        ref: 'contentBody',
        selector: 'training_contentbody'
    }, {
        ref: 'tree',
        selector: 'training_tree'
    }],

    init: function() {

        var me = this;

        Engine.Tree = me; // For debugging convenience

        this.control({

            'training_tree': {
                select: this.nodeSelected,
                collapse: this.treeCollapsedHandler,
                expand: this.treeExpandHandler
            }

        });

        this.getTopicsStore().on('load', this.onTopicsStoreLoad, me);

        this.getTopicsStore().load();
    },

    onTopicsStoreLoad: function(store) {
        var me = this;
        store.numberLabs();
        Ext.util.History.init(function() {
            Ext.util.History.on('change', me.onHistoryChange, me);
            me.onHistoryChange(Ext.util.History.getToken());
        });
    },
    onHistoryChange: function(token) {
        if (token) {
            if (token !== Engine.model.Node.getFileId()) {
                this.getTree().search(token, false);
            }
        } else {

            var root = this.getTree().getRootNode();
            this.getTree().getSelectionModel().select(root.firstChild);
        }
    },

    onLaunch: function(application) {
        this.addKeyNav();

        // for unpinned tree: show when mousing over tree or splitter, hide when
        // mousing over main content
        this.getTree().getEl().on('mouseover', function(e, target) {
            this.getTree().expandIfNeeded();
        }, this);
        this.getTree().splitter.getEl().on('mouseover', function(e, target) {
            this.getTree().expandIfNeeded();
        }, this);
        this.getSlide().getEl().on('mouseover', function(e, target) {
            this.getTree().collapseIfNeeded();
        }, this);
    },

    treeCollapsedHandler: function(treePanel) {
        this.keyNav.enable();
    },
    treeExpandHandler: function(treePanel) {
        this.keyNav.disable();
    },

    addKeyNav: function() {
        var that = this;

        this.keyNav = new Ext.util.KeyNav({
            target: Ext.getDoc(),
            disabled: true,
            ignoreInputFields: true,
            left: prev,
            right: next,
            space: next
        });

        function prev() {
            if (Engine.util.Presentation.showPrevSlide()) {
                return;
            }

            // Only works if the nodes are expanded. So this won't
            // work right if you collapse all, go to some group node,
            // and press back.

            // If on first child, go to parent.
            // If previous node is a folder, then select its last child.
            // If previous node is another leaf, then select it.

            var sm = that.getTree().getSelectionModel();
            var current = sm.getSelection()[0];
            var previous = current.previousSibling;
            if (previous && !previous.isExpanded()) {
                previous.expand();
            }
            sm.selectPrevious();
        }

        function getNextUncle(node) {
            // Gets the next parent node's next sibling. If that
            // doesn't have a sibling, go up again. Hitting root
            // returns null.
            if (node.isRoot()) {
                return null;
            } else {
                if (node.parentNode.nextSibling) {
                    return node.parentNode.nextSibling;
                } else {
                    return getNextUncle(node.parentNode);
                }
            }
        }

        function getNext(node) {
            // returns the next node from the specified node
            // This should probably be a method on the tree.
            var result = null;
            if (node) {
                if (node.hasChildNodes()) {
                    result = node.firstChild;
                } else if (node.nextSibling) {
                    result = node.nextSibling;
                } else if (node.parentNode) {
                    // No next siblings or kids -- must be the last child
                    return getNextUncle(node);
                }
            }
            return result;
        }

        function next() {
            if (Engine.util.Presentation.showNextSlide()) return;

            var r = that.getRecord();
            var nextRecord = getNext(r);
            if (nextRecord) {
                nextRecord.parentNode.expand();
                that.getTree().getSelectionModel().select(nextRecord);
            } else {
                // Assert: nextRecord is falsey
                that.getTree().getSelectionModel().select(that.getTree().getRootNode());
            }
        }
    },


    trace: function(message) {
        function trace(message) {
                console.log(message);
            }
            // Usage : this.trace('In method foo')';
        return Ext.Function.bind(trace, this, [message]);
    },

    getRecord: function() {
        return this.getTree().getSelection();
    },

    nodeSelected: function(selectionModel, record) {

        //console.log('nodeSelected');

        Ext.util.History.add(record.get('fileId'));

        var me = this;

        record = this.getRecord();
        Engine.model.Node.setRecord(record);

    },

    getUnreferencedFiles: function(callback) {
        // Returns an array of file names of unreferenced files.
        // This is a utility routine to detect possible garbage.
        // Look at the resulting file names -- they are time stamps,
        // so if you think you lost some new nodes, run the routine
        // and see if the time stamps match when you created them,
        // them open them up and inspect their contents.
        var me = this;
        var file = Ext.create('Engine.util.File', {
            path: Engine.Global.pagesPath
        });
        file.getChildren(function(files) {
            console.dir(files);

            var allInTree = me.getTopicsStore().getFileIdArray();
            var result = Ext.Array.difference(files, allInTree);
            if (callback) {
                callback(result);
            } else {
                console.dir(result);
            }
        });
    }

});