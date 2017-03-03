Ext.define('Engine.view.content.page.Body', {
    extend: 'Ext.panel.Panel',
    xtype: 'training_contentbody',

    requires: [

        'Ext.tab.Panel',
        'Engine.view.util.ExpandingContent',

        'EditView.view.editview.AceEditor',

        'Engine.util.String',

        'EditView.view.editview.PreTagEditAndView'

    ],

    cls: 'body',

    layout: 'card',

    items: [{
        autoScroll: true,
        xtype: 'panel',
        itemId: 'content',
        layout: 'fit',
        expanders: [],
        preTagEditAndViews: []
    }, {
        xtype: 'aceeditor',
        margins: '32 0 0 0'
    }],

    editButton: null,

    initComponent: function() {

        var me = this;

        // I forget why this is ignored
        this.firePageRendered = Ext.Function.createDelayed(function() {
            Ext.globalEvents.fireEvent('slideafterrender', me);
        }, 500);

        this.callParent();

    },

    refreshContent: function(data, node) {
        this.saveData.body = this.saveNode.slideHtml;
        this.updateContent(this.saveData, this.saveNode, 1);
    },

    updateContent: function(data, node, defer) {

        var me = this;

        me.saveData = data; // Refresh
        me.saveNode = node; // Used to populate Ace

        var contentPanel = me.down('#content');

        me.getLayout().setActiveItem(contentPanel);


        // TODO: I suspect this is rife with memory leaks. We
        // create expanders, but do we ever really clean them up?


        // 1. Destroy previously created Expander and EditView components
        // 2. In memory, create the dom, and update it.
        // 3. Inject the DOM into the page. This avoid "flicker" as the
        //    raw HTML is rendered, then filled with Expanders and EditView

        Ext.Array.forEach(contentPanel.expanders, function(expander) {
            expander.destroy();
        });
        contentPanel.expanders = [];
        Ext.Array.forEach(contentPanel.preTagEditAndViews, function(p) {
            p.destroy();
        });
        contentPanel.preTagEditAndViews = [];

        Ext.Array.forEach(contentPanel.getDockedItems('#topcode'), function(item) {
            contentPanel.removeDocked(item, true);
        });

        var isLab = node.getRecord().isLab();

        // And now for some low-level DOM manipulation. :-/

        // Put together the skeleton of the slide content
        var slideDiv = document.createElement('div');
        var slideBody = document.createElement('div');
        var slideHeader = document.createElement('div');
        Ext.fly(slideDiv).appendChild(slideHeader);
        Ext.fly(slideDiv).appendChild(slideBody);


        // Set the parent cls
        var slideDivElement = Ext.get(slideDiv);
        slideDivElement.addCls(isLab ? 'lab' : 'slide');

        // Set the body cls
        var slideBodyElement = Ext.get(slideBody);
        slideBodyElement.addCls('body');

        // Put the content into the body
        slideBody.innerHTML = data.body;

        // Set the slide header cls, and initialize it
        var slideHeaderElement = Ext.get(slideHeader);
        slideHeaderElement.addCls('head');

        var titleCls = isLab ? 'lab' : 'slide';

        // If the content contains an <h1>, use it as the slide title
        var slideTitle = data.title;
        if (!isLab) {
            var h1Elements = slideBody.getElementsByTagName('h1');
            if (h1Elements.length !== 0) {
                slideTitle = h1Elements[0].innerHTML;
                h1Element = h1Elements[0];
                h1Element.parentNode.removeChild(h1Element);
            }
        }

        slideHeader.innerHTML = [
            '<span class="logo"></span>',
            '<h3>',
            data.topics.join(', '),
            '</h3>',
            '<h2 class="' + titleCls + '">',
            slideTitle,
            '</h2>'
        ].join('');

        var dlp = contentPanel.down('#dockedLivePreview');
        if (dlp) {
            dlp.removeAll();
            dlp.hide();
        }

        var contentElement = Ext.get(slideBody);

        var nodes = contentElement.dom.childNodes;
        //console.clear(); //NOTE THE CLEAR, IT CLEARS THE FULL CONSOLE
        //NOT SURE IF THIS IS IDEAL.
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            if ((el.nodeName === "#comment" || el.nodeType === 8)) {
                console.info(el.data);
            }
        }

        var docked;

        // Content element is the body div.
        // Lab steps are immediate ol chilren

        var blankParagraphs = [];
        contentElement.select('p').each(function(p) {
            if (!p.getHTML()) {
                blankParagraphs.push(Ext.get(p));
            }
        });
        Ext.Array.forEach(blankParagraphs, function(p) {
            p.destroy();
        })

        // Steps are always followed by <div class="step">
        // The </div> is added before the following ol, or
        // the following <h1>
        if (isLab) {
            labSteps = contentElement.select('ol[start]').addCls('step');

            var labSteps = contentElement.select('ol[start]');
            labSteps.each(function(ol) {
                ol = Ext.get(ol);
                var div = Ext.DomHelper.insertAfter(ol, '<div class="step">', true);
                var expanded = ol.hasCls('expanded');
                div.addCls(expanded ? 'expanded' : 'collapsed');
                ol.addCls(expanded ? 'expanded' : 'collapsed');
                ol.on('click', function() {
                    div.toggleCls('expanded');
                    div.toggleCls('collapsed');
                    ol.toggleCls('expanded');
                    ol.toggleCls('collapsed');
                });
                var element = div.next();
                while (element) {
                    if (element.hasCls('step') || (element.dom.tagName === 'H1')) {
                        break;
                    }
                    var next = element.next(); // Do this first, before appending it
                    div.appendChild(element);
                    element = next;
                }
            });

        }

        Ext.Array.each(contentElement.query('pre.runnable, pre.javascript'), function(domElement) {

            var pre = Ext.get(domElement);

            if (pre.hasCls('docked')) {

                docked = Ext.create('EditView.view.editview.PreTagEditAndView', {
                    pre: domElement,
                    dock: 'top',
                    itemId: 'topcode',
                    headHtml: Engine.Global.javaScriptViewerHeadHtml,
                    listeners: {
                        'afterrender': function(w) {
                            var e = w.down('aceeditor');
                            if (e) {
                                e.focusEditor();
                            }
                        }
                    }
                });
                contentPanel.addDocked(docked);

                pre.addCls('x-hidden');


            } else {

                var editAndView = Ext.create('EditView.view.editview.PreTagEditAndView', {
                    pre: domElement,
                    cls: 'code',
                    headHtml: Engine.Global.javaScriptViewerHeadHtml
                });

                // Remember we created it, so we can destroy it later
                contentPanel.preTagEditAndViews.push(editAndView);

            }


        });

        Ext.Array.each(contentElement.query('div[type=expander]'), function(element) {
            var expander = Ext.create('Engine.view.util.ExpandingContent', {
                expanderElement: Ext.get(element),
                titleTag: 'h1',
                contentTag: 'div',
                cls: 'expander'
            });
            expander.on('toggle', me.manageExpanders, contentPanel);

            // Remember the expanders so they can be removed later.
            contentPanel.expanders.push(expander);
        });

        contentPanel.removeAll(); // Get rid of previous slide content

        function addIt() {
            contentPanel.add({
                xtype: 'component',
                contentEl: slideDiv
            });
            // Put the insertion point for all editors on the first character,
            // but go backwards so the first editor is the one with focus.
            var i = contentPanel.preTagEditAndViews.length;

            while (i--) {
                var editView = contentPanel.preTagEditAndViews[i];
                editView.render(editView.pre); // YUCK!
                var editor = editView.down('aceeditor');
                if (editor) {
                    editor.focusEditor();
                }
            }
            if (docked) {
                docked.down('aceeditor').focusEditor();
            }

            me.firePageRendered();
        }
        defer = defer || 1;
        Ext.Function.defer(addIt, defer);



    },
    manageExpanders: function(expander, event) {
        var me = this;
        if (event.ctrlKey) {
            return;
        }
        // debugger;
        Ext.Array.forEach(me.expanders, function(ex) {
            if (ex !== expander) {
                ex.setExpanded(false);
            }
        })
    }

});