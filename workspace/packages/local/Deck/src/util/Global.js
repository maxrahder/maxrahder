Ext.define('Deck.util.Global', {
    singleton: true,
    editing: location.search.match(/\edit\b/),
    constructor: function() {
        this.language = '_default';
        if (location.search) {
            var q = Ext.Object.fromQueryString(location.search[1]);
            this.language = (q.language || this.language);
        }
        this.callParent(arguments);

    }
});
