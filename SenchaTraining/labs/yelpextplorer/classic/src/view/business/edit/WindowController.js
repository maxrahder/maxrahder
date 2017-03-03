Ext.define('YelpExtplorer.view.business.edit.WindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.business-edit-window',


    init: function() {
        var me = this;
        // this.getView().on('close', me.onCancelClick, me);
        this.getView().on('destroy', function() {
            console.log('destroy');
            me.getViewModel().get('business').reject();
        }, me);
    },

    onSaveClick: function(button) {
        this.getViewModel().get('business').commit();
        this.getView().close();
    },
    onCancelClick: function(button) {
        this.getViewModel().get('business').reject();
        this.getView().close();
    }

});
