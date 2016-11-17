Ext.define('Deck.view.main.MainViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.maincontroller',

    initViewModel: function (vm) {
        console.log('initViewModel');
        var tree = Ext.create('Ext.data.TreeStore', {
            model: 'Deck.model.Node'
        });
        tree.setRoot({
            "text": 'Foo',
            "children": [{
                "leaf": true,
                "text": 'One',
                "title": '',
                "pageId": 'test.html',
                "i18n": {

                }
            }, {
                "leaf": true,
                "text": 'One',
                "title": '',
                "pageId": 'test.html',
                "i18n": {

                }
            }]
        });
        vm.set('topics', tree);

    }

});