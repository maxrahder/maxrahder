Ext.define('EditView.util.SenchaCdnToken', {
    requires: ['Ext.Ajax'],
    singleton: true,
    refresh: function(callback, scope) {
        scope = scope || this;
        Ext.Ajax.request({
            url: '_lib/backend/cdnToken.php',
            success: function(hxr) {
                callback.call(scope);
            },
            failure: function() {
                console.log('SenchaCdnToken failure');
                callback.call(scope);
            }
        });
    }
});