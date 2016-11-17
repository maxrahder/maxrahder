Ext.define('Deck.model.Node', {
    extend: 'Ext.data.TreeModel',

    constructor: function () {
        this.callParent(arguments);
        console.log('node created');
    },

    getTitle: function () {

    },
    getContent: function () {
        var deferred = Ext.create('Ext.Deferred');
        doIt();
        return deferred.promise;

        function doIt() {
            Ext.Ajax.request({
                url: 'resources/pages/content/_default/test.html'
            }).then(function (xhr) {
                var text = xhr.responseText;
                deferred.resolve(text);
            }, function (xhr) {
                deferred.reject(xhr);
            });


        }

    }

})