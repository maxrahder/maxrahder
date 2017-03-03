Ext.define('Engine.util.ExtJSMarkup', {
    constructor: function(el) {
        this.parseMarkup(el);
    },

    /**
     * Recursively converts dom elements with data-xtype attributes to Ext JS components
     */
    parseMarkup: function(el, deferRender) {
        var that = this,
            cmps = [],
            els = Ext.Array.filter(Ext.DomQuery.select('[data-xtype]', el), function(childEl) {
                return !Ext.get(childEl).up('[data-xtype]', el);
            });

        // for every element with a data-xtype attribute that is not itself within an element with a data-xtype attribute (i.e., root level)
        for (var i = 0, len = els.length; i < len; i++) {
            var childEl = Ext.get(els[i]),
                config = this.getConfigFromDomData(childEl),
                hasOnlyItems = (childEl.child('[data-xtype]') && !childEl.child(':not([data-xtype])'));

            // if all direct child nodes have an xtype, set them as xtype items of the parent.
            // otherwise, include the raw html as its content and then, on render, parse it for any embedded components.
            Ext.apply(config, hasOnlyItems ? {
                items: this.parseMarkup(els[i], true)
            } : {
                html: childEl.getHTML()
            });

            // if deferring rendering, set as an xtype
            if (typeof deferRender != 'undefined' && deferRender) {
                var cmp = Ext.merge(config, {
                    listeners: {
                        afterrender: function() {
                            that.parseMarkup(Ext.DomQuery.select('#' + this.getEl().id));
                        }
                    }
                });
            }
            // otherwise, instantiate the component
            else {
                var cmp = Ext.widget(config.xtype, config);
                cmp.on('afterrender', function() {
                    childEl.remove();
                    // TODO: should be a better way to get the data-xtype dom query to work with the existing element reference
                    if (!hasOnlyItems) that.parseMarkup(Ext.DomQuery.select('#' + cmp.getEl().id));
                });
                cmp.render(childEl.parent(), childEl);
            }

            // add component to returned array
            cmps.push(cmp);
        }

        return cmps;
    },

    /**
     * Grabs component configs defined in dom data attributes
     */
    getConfigFromDomData: function(el) {
        // use el.dom.dataset ?
        var data = {},
            dataAttr = /^data-(.+)/i;
        for (var i = 0, len = el.dom.attributes.length; i < len; i++) {
            var attr = dataAttr.exec(el.dom.attributes[i].nodeName);
            if (attr) {
                data[this.camelize(attr[1])] = this.castDataValue(el.dom.attributes[i].nodeValue);
            }
        }
        if (data.config) {
            data = Ext.merge(data, data.config);
            delete data.config;
        }
        return data;
    },

    /**
     * Converts untyped dom data value to proper type
     */
    castDataValue: function(value) {
        var v = Ext.String.trim(value.toLowerCase());
        if (v == 'true' || v == 'false') value = v == 'true' ? true : false;
        else if (v == 'null') value = null;
        else if (/^[0-9]+$/.exec(v)) value = parseInt(v, 10);
        else if (/^[0-9\.]+$/.exec(v)) value = parseFloat(v);
        else if (/^{(.*)}$/.exec(v)) value = Ext.decode(value);
        return value;
    },

    /**
     * Converts dashed words to camel case (e.g., "foo-bar-baz" -> "fooBarBaz")
     */
    camelize: function(string) {
        return string.toLowerCase().replace(/(-.)/ig, function(_, c) {
            return c.slice(1).toUpperCase();
        });
    }
});