Ext.define('Deck.view.content.ContentMethods', {
    extend: 'Ext.Mixin',
    requires: ['EditView.view.editview.PreTagEditAndView'],

    updateNode: function(node) {
        var me = this;
        if (node.isLeaf()) {
            node.getContent().then(function(html) {
                me.updateContent(html, node);
            }, function() {
                console.log('Failure reading ' + node.id);
                console.log(arguments);
            });
        } else {
            var html = [
                "<img style='height: 60%; display: block; margin: 3em auto 0 auto; ' src='resources/images/senchaleaf.svg'></img>"
            ];
            me.update(html.join(''), node);
        }
    },

    updateContent: function(html, node) {
        var me = this;

        // Any time you do a batch of updates, you'd want to turn off events.
        // In this case, I'm not sure there's anything being fired, so this
        // may not be necessary.
        me.suspendEvents();

        // Clean up old HTML
        me.getEl().select('div.expander', true).clearListeners();

        // I wonder if it would be faster to create an un-attached DOM object, update it,
        // then use it as the panel's child.

        me.setHtml(html);

        if (node.isLab()) {
            me.getEl().down('div.x-panel-body').addCls('lab');
            // debugger;
        }

        // TODO: In the past, if there was an <h1> at the top of the page, it would
        // override the title. Now the title is bound to the node's text, so the
        // idea of overriding it doesn't fit in so well. How *do* we implement the notion
        // of a short title, and longer title. Like a node title and page title. Maybe
        // the best thing is to have two properties in the node json.
        // var firstChild = el.down('.x-panel-body').getFirstChild()
        // if (firstChild.dom.tagName === 'H1'){
        //     me.lookup('title').
        // }

        me.setupExpanders(me, node);

        // The code saves references to the <pre> tags.
        // TODO: Make sure those are deleted from the DOM
        // as the user goes from page to page.
        me.preTags = me.preTags || [];
        me.preTags = [];
        var a = me.getEl().query('pre.runnable');
        Ext.Array.forEach(a, function(element) {
            var preTag = Ext.create('EditView.view.editview.PreTagEditAndView', {
                style: 'border: thin solid #eeeeee',
                pre: element,
                renderTo: element
            });
            me.preTags.push(preTag);
        });

        // The idea is to make sure the user always sees the start of a given
        // page, but I'm not sure it does anything.
        me.scrollTo(0, 0);

        me.resumeEvents();
    },

    setupExpanders: function(me, node) {
        var a = me.getEl().query('div[type="expander"]');
        if (node.isLab()) {
            var lab = true;
            var step = 0;
        }
        Ext.Array.forEach(a, function(div) {
            // debugger;
            // Create a new ideal <div> with a child <span> caption, and <div class="content">
            // Then replace the old div with the new one.

            var expander = document.createElement('div');
            var expanderEl = Ext.get(expander);
            expanderEl.addCls('expander collapsed');

            var attributes = Ext.fly(div).getAttributes();
            var caption = document.createElement('span');
            Ext.fly(caption).addCls('expandertitle');
            caption.innerHTML = (lab ? (++step + '.&nbsp;') : '') + attributes.caption;

            var newDiv = document.createElement('div');
            Ext.fly(newDiv).addCls('content');
            newDiv.innerHTML = div.innerHTML;
            expander.append(caption);
            expander.append(newDiv);
            Ext.get(caption).on('click', function() {
                if (expanderEl.hasCls('collapsed')) {
                    expanderEl.removeCls('collapsed');
                    expanderEl.addCls('expanded');
                } else {
                    expanderEl.addCls('collapsed');
                    expanderEl.removeCls('expanded');
                }
            });
            div.parentNode.replaceChild(expander, div);
        });

    }



});
