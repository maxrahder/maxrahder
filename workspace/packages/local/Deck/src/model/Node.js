Ext.define('Deck.model.Node', {
    extend: 'Ext.data.TreeModel',
    requires: ['Deck.util.Global', 'Deck.util.Backend'],
    statics: {
        cache: {},
        getCachedContent: function(fileId) {
            return Deck.model.Node.cache[fileId];
        },
    },
    i18nProperty: function(property) {
        var me = this;
        if (!me.data.i18n) return '';
        var language = Deck.util.Global.language;
        var i18n = me.data.i18n[language];
        var result;
        if (i18n) {
            result = (i18n[property] || me.data.i18n._default[property]);
        } else {
            result = me.data.i18n._default[property];
        }
        return result;
    },
    fields: ['i18n', {
        name: 'text',
        convert: function(value, record) {
            return record.i18nProperty('title');
        }
    }, {
        name: 'leaf',
        convert: function(value, record) {
            return record.data.leaf || !record.data.children;
        }
    }],
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
            console.log(i18n);
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
        // Call the web service and persist chages to the node.
    },

    cacheContent: function(text) {
        if (this.data.id) {
            Deck.model.Node.cache[this.data.id] = text;
        }
    },
    next: function() {
        // If on a leaf, find sibling or next uncle
        // If on a parent, get first child
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

});
