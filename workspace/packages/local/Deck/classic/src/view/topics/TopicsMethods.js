Ext.define('Deck.view.topics.TopicsMethods', {

    goToPage: function(value, forward) {
        var me = this;
        forward = Ext.isDefined(forward) ? !!forward : true;
        if (value) {
            // Pressing enter searches forward, shift-enter searhces backwards.
            var vm = me.getViewModel();
            if (!vm) {
                return;
            }
            var store = vm.get('topics');
            if (!store) {
                return;
            }
            var node = vm.get('node');
            var found = store.findNode(node, value, forward);
            if (found) {
                me.getView().setSelection(found);
                var parent = found.parentNode;
                while (parent) {
                    parent.expand();
                    parent = parent.parentNode;
                }
            }
        }
    }

});
