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
        me.down('#title').setData(node.data);
    },

    updateContent: function(html) {
        var me = this;
        me.suspendEvents();

        // me.removeAll();

        me.setHtml(html);

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

        me.scrollTo(0, 0);
        me.resumeEvents();
    }
});
