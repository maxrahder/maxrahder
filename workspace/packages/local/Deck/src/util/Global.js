Ext.define('Deck.util.Global', {
    singleton: true,
    constructor: function() {
        this.language = '_default';
        if (location.search) {
            var q = Ext.Object.fromQueryString(location.search[1]);
            this.language = (q.language || language);
        }
        this.callParent(arguments);

    }
});
