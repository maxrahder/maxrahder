Ext.define('Override.mixin.Mashup', {
    override: 'Ext.mixin.Mashup',
    onClassMixedIn: function(targetClass) {
        if (targetClass.$className === 'Ext.ux.google.Map') {
            targetClass.prototype.requiredScripts = [
                '//maps.googleapis.com/maps/api/js?key=AIzaSyDyK7N571msPrlpIJ8kvOMXjYQBxuhlVdw'
            ];
        }
        this.callParent([targetClass]);
    }
});
