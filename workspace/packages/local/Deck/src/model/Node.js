Ext.define('Deck.model.Node', {
    extend: 'Ext.data.TreeModel',
    requires: ['Deck.util.Global', 'Deck.util.Backend'],
    statics: {
        cache: {},
        getCachedContent: function(fileId) {
            return Deck.model.Node.cache[fileId];
        },
    },
    fields: ['i18n', {
        name: 'text',
        convert: function(value, record) {
            var i18n = record.data.i18n;
            if (!i18n) return '';
            var result;
            var language = record.data.language;
            // Use the entry for the language, if there is one.
            if (i18n[language]) {
                result = i18n[language].title;
            };
            // If there is a value, use it. Else, use the default.
            result = (result || record.data.i18n._default.title);
            if (record.data.id === '2015-06-08_22-34_58-147_Z') {
                console.log(result);
            }
            return result;
        },
        depends: ['language', 'i18n']
    }, {
        name: 'language',
        defaultValue: '_default'
    }, {
        name: 'leaf',
        convert: function(value, record) {
            return record.data.leaf || !record.data.children;
        }
    }],

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
    }

});
