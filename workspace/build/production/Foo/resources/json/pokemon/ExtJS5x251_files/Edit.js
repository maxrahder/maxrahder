Ext.define('Engine.controller.Edit', {
    extend: 'Ext.app.Controller',

    requires: ['Engine.view.EditToolbar', 'Engine.model.Topic'],

    views: ['Tree'],

    stores: ['Topics'],

    refs: [{
        ref: 'editToolbar',
        selector: 'edittoolbar'
    }, {
        ref: 'tree',
        selector: 'training_tree'
    }, {
        ref: 'nodeText',
        selector: '#nodeText'
    }, {
        ref: 'nodeDuration',
        selector: '#nodeDuration'
    }, {
        ref: 'editButton',
        selector: '#editButton'
    }],

    appDataPath: Ext.course + 'resources/Data/',

    init: function() {

        Engine.EditController = this; // Debugging convenience

        var me = this;

        Engine.instructor = false;

        Engine.editing = Ext.Object.fromQueryString(location.search.substring(1)).edit;

        if (!Engine.editing) {
            return;
        }


        // Post changes as they occur. Since it's buffered, even operations
        // that fire multiple changes, like moving nodes, will only be saved
        // once.
        this.bufferedSaveTopic = Ext.Function.createBuffered(this.saveTopic, 1000, this);

        this.getTopicsStore().on('load', function(store) {
            // treestore nodes don't keep accurate track of the store.
            // Therefore, manually put a reference onto the root. This
            // is used by the Topic.js model to have the tree fire
            // 'textchanged'. This is a bit ugly :-/

            store.getRootNode().topicsStore = store;

            // This is run BEFORE being moved, so the old parent is updated
            // if it's going between topics.
            me.getTopicsStore().on('beforeremove', me.beforeRemoveHandler, me);

            me.getTopicsStore().on('insert', me.insertHandler, me);

            me.getTopicsStore().on('beforemove', me.beforeMoveHandler, me);

            me.getTopicsStore().on('move', me.moveHandler, me);

            me.getTopicsStore().on('textchanged', me.textChangedHandler, me);

        });

        this.control({

            'training_contentbody': {
                save: this.savePage
            },
            'toolbar #addPage': {
                click: this.toolbarAddPage
            },
            'toolbar #dumpJson': {
                click: this.toolbarDumpJsonHandler
            },
            'toolbar #addFolder': {
                click: this.toolbarAddFolder
            },
            'toolbar #deleteNode': {
                click: this.toolbarDeleteNode
            },
            'toolbar #nodeText': {
                change: this.toolbarNodeTextChange
            },
            'viewport #mainPanel': {
                afterrender: this.viewportOnAfterRender
            },
            'training_tree': {
                beforeselect: this.beforeNodeSelected
            }


        });

        // Save on ctrlKey+S (CTRL-S for PC or CMD-S for Mac)
        me = this;
        Ext.getBody().on('keydown', function(e) {
            if (e.ctrlKey && (e.button == 82 || e.button == 68)) {
                // if (me.getEditButton().getText() == 'Save') {
                me.getEditButton().handler(me.getEditButton());
                // }
            }
        });

    },

    beforeNodeSelected: function(tree) {
        //console.log('beforeNodeSelected');
        if (this.getEditButton().editing) {
            Ext.Msg.show({
                title: 'Stop',
                msg: 'You cannot change pages when editing.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
            return false;
        }
    },

    getRecord: function() {
        return this.getTree().getSelection();
    },

    beforeMoveHandler: function(store, oldParent, newParent) {
        // Moved trigger insert and remove -- this handler
        // simply disallowed moved between topics. It turns out
        // that detecting that kind of operation was too hard
        // because we couldn't differentiate between an insert
        // of a new record, versus an insert due to being moved.
        var t1 = oldParent.getTopic();
        var t2 = newParent.getTopic();
        // Neither can be false, and they can't be equal.
        if (!t1 || !t2 || !(t1 === t2)) {
            Ext.Msg.alert('Ignored', 'You may only move nodes within a sub-topic.');
            return false;
        }
    },

    moveHandler: function(store, oldParent, newParent) {
        this.bufferedSaveTopic(newParent);
    },

    beforeRemoveHandler: function(store, record, isMove) {
        // If it's a move, then insert is run. Let that trigger the save
        if (isMove) {
            return; // Do nothing
        }
        // Get the topic -- by the time the buffered handler is run, the
        // parent pointer will be null.
        this.bufferedSaveTopic(record.getTopic());
    },

    insertHandler: function(store, record) {
        //console.log('insertHandler');
        this.bufferedSaveTopic(record);
    },

    textChangedHandler: function(store, record) {
        this.bufferedSaveTopic(record);
    },

    saveTopic: function(record) {
        if (Engine.editing) {
            var t = record.getTopic();
            if (t) {
                this.getTopicsStore().saveTopic(t);
            }
        }
    },

    viewportOnAfterRender: function(panel) {
        this.getEditToolbar().setVisible(Engine.editing);
    },

    toolbarAddFolder: function() {
        var record = this.getRecord();
        var recordConfig = {
            text: 'New Topic',
            fileId: Engine.model.Node.generateFileId(),
            leaf: false,
            children: []
        };
        this.insertNode(record, recordConfig);
        this.getNodeText().focus(true);
    },

    toolbarAddPage: function(button) {

        var me = this;
        var parent = me.getRecord();

        if (!parent) {
            return;
        }

        var fileId = Engine.model.Node.generateFileId();
        var fileType = '.md';
        var useShared = button.useShared;

        var newRecord = Ext.create('Engine.model.Topic', {
            fileId: fileId,
            fileType: fileType,
            useShared: useShared
        });

        var filePath = newRecord.getFilePath();

        var callback = function() {
            me.insertNode(parent, newRecord);
        }

        this.savePagePrivate(fileId, '.md', filePath, '', callback);

        this.getNodeText().focus(true);
    },

    savePage: function(contentPanel, node) {
        var r = node.getRecord();
        this.savePagePrivate(r.data.fileId, r.data.fileType, r.getFilePath(), node.getSlideText());
    },

    savePagePrivate: function(fileId, fileType, filePath, text, callback) {

        callback = callback || Ext.emptyFn;

        // Insert a new page, and fire off Ajax to
        // add the new empty source page.
        Ext.Ajax.request({
            url: Engine.Global.backendSavePageUrl,
            method: 'post',
            params: {
                fileId: fileId,
                fileType: fileType,
                filePath: filePath,
                content: text
            },
            success: function(response) {
                callback();
            },
            failure: function(response) {
                callback(response.responseText);
                Ext.Msg.alert(response);
            }
        });
    },

    toolbarDeleteNode: function() {
        var me = this;
        var r = this.getRecord();
        if (r) {
            Ext.Msg.confirm('Delete', 'Are you sure you want to delete "' + r.get('text') + '"?', function(choice) {
                if (choice === 'yes') {
                    //debugger;
                    var n = r.nextSibling || r.parentNode;
                    me.getTree().getSelectionModel().select(n);
                    var fileType = r.get('fileType');
                    r.remove();
                    var kids = r.isLeaf() ? [r.get('fileId')] : me.getTopicsStore().getFileIdArray(r);
                    Ext.Array.forEach(kids, function(fileId) {
                        var oldName = Engine.Global.contentPath + 'Pages/' + fileId + fileType;
                        var newName = Engine.Global.contentPath + 'Archive/' + fileId + fileType;

                        me.renameFile(oldName, newName);

                    });
                }
            });
        }
    },

    renameFile: function(oldName, newName) {
        //console.log('renameFile(' + oldName + ',' + newName + ')');
        Ext.Ajax.request({
            params: {
                oldName: oldName,
                newName: newName
            },
            url: Engine.Global.backendRenameFileUrl,
            success: function(response) {},
            failure: function(response) {
                Ext.Msg.alert('Error renaming ' + fileId, response.responseText);
            }
        });
    },

    insertNode: function(node, recordConfig) {
        // Insert as a sibling, unless node is a topic,
        // in which case insert as a child.
        if (node.isTopic()) {
            var n = node.appendChild(recordConfig);
            this.getTree().getSelectionModel().select(n);
        } else {
            var parent = node.parentNode;
            var n = parent.insertChild(parent.indexOf(node) + 1, recordConfig);
            this.getTree().getSelectionModel().select(n);
        }
    },

    toolbarNodeTextChange: function(field) {

        var record = this.getRecord();
        if (record) {
            var value = field.getValue();
            if (value !== record.get('text')) {
                record.set('text', value);
            }
        }
    },

    toolbarNodeDurationChange: function(field) {

        var record = this.getRecord();
        if (record) {
            // if (record && (record.get('text') != fieldGetValue())) {
            record.set('duration', field.getValue());
        }
    },

    toolbarDumpJsonHandler: function() {
        console.log(Ext.JSON.encode(this.getTopicsStore().getHierarchy()));
    }

});