Ext.define('Deck.view.content.ContentMethods', {
    extend: 'Ext.Mixin',
    updateNode: function (node) {
        var me = this;
        node.getContent().then(function (html) {
            me.updateContent(html);

        });
        me.down('#title').setData(node.data);
    },
    updateContent: function (html) {
        var me = this;
        me.setHtml(html);
        me.el.select('pre').each(function (element) {

            console.dir(element);

            Ext.create('EditView.view.editview.PreTagEditAndView', {
                style: 'border: thin solid #eeeeee',
                pre: element.dom,
                renderTo: element.dom
            });

        });

        me.scrollTo(0, 0);

    }
});