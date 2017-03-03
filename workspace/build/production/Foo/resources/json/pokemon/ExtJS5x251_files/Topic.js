/**
 * A presentation node can be a topic, sub-topic or slide. Topics are
 * first-level folders, sub-topics are second- level folders and slides are
 * leaves. Therefore, each node has three properties: topic, subTopic and slide.
 * Each of these getters returns a node. Not all slides have a parent sub-topic.
 * In theory, a slide can be right off the root, in which case it could have
 * neither topic nor subTopic. Each of these also has a corresponding text
 * getter. For a topic node, this is its text property, and the other node text
 * properties are empty strings. For sub-topic nodes, the topic text is the
 * parent's topic text, the sub-topic text is the node's text property, and the
 * title text is the empty string. For slides, the topic and sub-topic (if any)
 * text values are the values for its parents.
 *
 * This code sort of breaks if there is more than two levels deep -- i.e., it's
 * undefined for anything other than slides within topics or subtopics.
 */
Ext.define('Engine.model.Topic', {
    extend: 'Ext.data.Model',

    statics: {
        persistableFields: [
            'text',
            'leaf',
            'fileId',
            'html',
            'children',
            'duration'
        ]
    },

    fields: [{
            name: 'text',
            defaultValue: 'New Slide'
        }, 'topicId', {
            name: 'leaf',
            type: 'boolean',
            defaultValue: true
        },

        {
            name: 'checked',
            type: 'boolean',
            defaultValue: true
        },

        {
            name: 'useShared',
            defaultValue: false
        }, {
            name: 'fileType',
            defaultValue: '.html'
        }, {
            name: 'fileId'
        }
    ],

    isTopic: function() {
        return !this.isLeaf();
    },
    isTitle: function() {
        return (this.isLeaf() && this.parentNode.isRoot());
    },
    isLab: function() {
        if (this.isSlide()) {
            var s = S(this.get('text'));
            return (s.startsWith('Lab') && s.contains(':'));
        } else {
            return false;
        }
    },
    isSubTopic: function() {
        return this.getLevel() === 1;
    },
    isSlide: function() {
        return this.isLeaf();
    },
    getLevel: function() {
        // return 0, 1 or 2 depending on whether
        // this is a topic, sub-topic, or slide.
        // It's un-cool, but this also corresponds
        // to the card being shown in the view.
        if (this.isLeaf()) {
            return 2;
        } else {
            return this.getDepth() - 1;
        }
    },

    getDuration: function() {
        // Duration is either the duration on the node, or if
        // that's missing, the sum of child durations.

        function recurse(node) {
            var duration = node.get('duration');
            if (!duration) {
                Ext.Array.forEach(node.childNodes, function(n) {
                    duration += recurse(n);
                });
            }
            return duration;
        }

        return recurse(this);


    },

    getTopic: function() {
        // The topic is the highest node with a topicId.
        // This should always be the second level nodes:
        // The top level is the groupings, which are hard-
        // coded in the treestore.php file. 
        // If there is a topic, it's one node below the root.
        if (this.isRoot() || !(this.parentNode)) {
            return null;
        }
        var node = this;
        while (true) {
            // Traverse up until we find the node with the topicId
            if (!node) {
                // We never found it, return null.
                break;
            } else if (node.get('topicId')) {
                // We found it! Break out of the loop.
                break;
            }
            node = node.parentNode;
        }
        return node;
    },

    getTopicArray: function() {
        // Returns an array of strings, which are the topic titles up the
        // hierarchy.
        result = [];
        var node = this;
        while (!node.isRoot()) {
            if (!node.isLeaf()) {
                result.push(node.get('text'));
            }
            node = node.parentNode;
        }
        return result.reverse();
    },

    set: function(name, value) {
        if (Ext.Array.contains(Engine.model.Topic.persistableFields, name)) {
            var changed = (this.get(name) !== value);
            if (changed) {
                // console.log(name + ' : ' + value);
                var topicsStore = this.getRoot().topicsStore;
                var oldValue = this.get(name);
                Ext.getStore('Topics').fireEvent('textchanged', topicsStore, this, oldValue, value);
            }
        }
        this.callParent(arguments);
    },

    getRoot: function() {
        var result = this;
        while (!result.isRoot()) {
            result = result.parentNode;
        }
        return result;
    },

    getTopicText: function() {
        var node = this.getTopic();
        return (node) ? node.get('text') : '';
    },

    getSubTopicText: function() {
        // Comma-delimited list of sub-topic titles
        var a = this.getTopicArray();
        var result = '';
        for (var i = 1; i < a.length; i++) {
            result += a[i];
            result += ((i + 1) === a.length) ? '' : ', ';
        }
        return result;
    },
    getSlide: function() {
        if (this.isSlide()) {
            return this;
        } else {
            return null;
        }
    },
    getSlideText: function() {
        var n = this.getSlide();
        return n ? n.get('text') : '';
    },

    isMarkdown: function() {
        return this.get('fileType') === '.md';
    },

    getFilePathAndName: function() {
        return this.getFilePath() + this.getFileName();
    },

    getFileName: function() {
        return this.data.fileId + this.data.fileType
    },

    getFilePath: function() {
        return this.get('useShared') ? Engine.Global.sharedPagesPath : Engine.Global.pagesPath;
    }
});