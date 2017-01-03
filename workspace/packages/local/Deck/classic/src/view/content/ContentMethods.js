Ext.define('Deck.view.content.ContentMethods', {
    extend: 'Ext.Mixin',
    requires: ['EditView.view.editview.PreTagEditAndView'],

    updateNode: function(node) {
        var me = this;
        node.getContent().then(function(html) {
            me.updateContent(html);
        }, function() {
            console.log('Failure reading ' + node.id);
            console.log(arguments);
        });
        // me.down('#title').setData(node.data);
    },

    updateContent: function(html) {
        var me = this;

        // Any time you do a batch of updates, you'd want to turn off events.
        // In this case, I'm not sure there's anything being fired, so this
        // may not be necessary.
        me.suspendEvents();

        // me.removeAll();

        me.setHtml(html);

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
    }
});
