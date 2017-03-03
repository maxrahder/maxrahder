Ext.define('Engine.store.Topics', {
    extend: 'Ext.data.TreeStore',
    requires: ['Engine.model.Topic'],

    model: 'Engine.model.Topic',

    //autoLoad : true, // No longer works in 4.2
    proxy: {
        type: 'ajax',
        url: Engine.Global.topicsPath + '_treestore.php'
    },

    initializeTopicsFileId: function() {
        // For conversion to new Nouveau. Visit every node --
        // if it's a topic, then assign a topicId if needed, and
        // save
        var me = this;
        var index = 0;
        this.getRootNode().cascadeBy(function(record) {
            if (!record.isLeaf()) {
                index++;
                record.set('fileId', 'topic-' + index);
            }
        });
        this.getRootNode().cascadeBy(function(record) {
            me.saveTopic(record);
        });
    },
    saveTopic: function(topic) {
        // Save the specified topic.

        var me = this;

        var topicId = topic.get('topicId');

        if (!topicId) {
            return;
        }

        var h = {};
        me.hierarchy(topic, h);

        var s = JSON.stringify(h, null, 2);

        Ext.Ajax.request({
            url: Engine.Global.backendSaveTopicUrl,
            method: 'post',
            params: {
                content: s,
                topicId: topicId
            },
            success: function(response) {
                // Assume we're in sync. Setting the root node
                // was losing the user's place in the tree.
                // me.setRootNode(h);
                me.numberLabs();
            },
            failure: function(response) {
                Ext.Msg.alert(response);
            }
        });


    },

    numberLabs: function() {
        // This is tricky. In the Touch classes, a parent folder holds
        // the hand-coded and Architect versions of the lab. It's the
        // parent folder that needs renaming. In classes without that, 
        // just rename the lab itself.
        // Assume lab titles are of the form Lab x: Some title
        // console.log('numberLabs');
        var me = this;
        var labNumber = 0;

        function isLabText(text) {
            var s = S(text);
            return s.startsWith('Lab') && s.contains(':');
        }
        me.getRootNode().cascadeBy(function(node) {
            // If the node's parent looks like a lab, skip it
            var isLab = isLabText(node.data.text);
            var parent = node.parentNode;
            var isParentLab = (parent && isLabText(parent.data.text));
            if (isLab && !isParentLab) {
                if (!Ext.Array.contains(node.getTopicArray(), 'Appendix')) {
                    labNumber++;
                    var text = node.get('text');
                    var colon = text.indexOf(':');
                    colon = (colon === -1) ? 3 : colon;
                    var s = 'Lab ' + labNumber + text.substr(colon);
                    node.set('text', s);
                }
            }
        });
    },

    getHierarchy: function() {
        var buildNode = {};
        var root = this.getRootNode();
        root.set('leaf', false);
        this.hierarchy(root, buildNode);
        return buildNode;
    },
    hierarchy: function(traverseNode, buildNode) {

        if (traverseNode.get('topicId')) {
            buildNode.topicId = traverseNode.get('topicId');
        }

        buildNode.text = traverseNode.get('text');
        buildNode.fileId = traverseNode.get('fileId');
        buildNode.useShared = traverseNode.get('useShared');
        buildNode.fileType = traverseNode.get('fileType');
        buildNode.leaf = traverseNode.get('leaf');
        var duration = traverseNode.get('duration');
        if (duration) {
            buildNode.duration = duration;
        }

        if (!buildNode.leaf) {
            buildNode.children = [];
        }
        if (traverseNode.childNodes.length > 0) {
            buildNode.children = [];
            for (var i = 0; i < traverseNode.childNodes.length; i++) {
                var buildChild = {};
                buildNode.children.push(buildChild);
                this.hierarchy(traverseNode.childNodes[i], buildChild);
            }
        }
    },
    getRecordArray: function(node) {
        // return an array of nodes starting from the specified node.
        var result = [];
        node = node ? node : this.getRootNode();
        node.cascadeBy(function(node) {
            result.push(node);
        });
        return result;
    },

    /**
    selects the first node matching the specified title, starting
    with start. next=false searches backwards.
    @param {String} is either a node title or a file name
     */
    getNode: function(string, start, reverse) {

        var node = null;
        var i = 0;
        string = string || '';
        start = start || this.getRootNode();
        string = string.toLowerCase();
        var isFileName = false;
        var nodes = this.getRecordArray();
        if (reverse) {
            nodes.reverse();
        }
        var length = nodes.length;

        // Get the index of the starting node
        var startIndex = 0;
        for (i = 0; i < length; i++) {
            node = nodes[i];
            if (node === start) {
                startIndex = i;
                break;
            }
        }
        // Test to make sure we found it should go here.

        var result = null;
        i = startIndex;
        // while(true) is DANGEROUS. Be careful.
        while (true) {
            i++; // Don't look at the current node.
            i = (i % length); // It's a circular search
            node = nodes[i];
            if (i === startIndex) {
                break;
            }
            if (node.get('fileId').toLowerCase() === string) {
                result = node;
                break;
            }
            var text = node.get('text');
            if (text && (node.get('text').toLowerCase().indexOf(string) > -1)) {
                result = node;
                break;
            }
        }
        return result;
    },


    getFileIdArray: function(root) {
        root = root ? root : this.getRootNode();
        var records = this.getRecordArray(root);
        var result = [];
        Ext.Array.forEach(records, function(node) {
            if (node.data.fileId) {
                result.push(node.data.fileId);
            }
        });
        Ext.Array.sort(result);
        return result;
    }
});