Ext.define('Shared.Geocode', {
    singleton: true,
    getGeocoder: function() {
        this.geoCoder = this.geoCoder || new google.maps.Geocoder();
        return this.geoCoder;
    },
    geocodeAddress: function(address, callback, scope) {
        var me = this;
        if (address) {
            me.getGeocoder().geocode({
                address: address
            }, function(result, status) {
                if (status === 'OK') {
                    var latLng = result[0].geometry.location;
                    var location = {
                        latitude: latLng.lat(),
                        longitude: latLng.lng()
                    };
                    scope = scope || me;
                    callback.call(scope, location);
                } else {
                    callback();
                    Ext.Error.raise('The Google Geocoder responded with status ' + status);
                }
            });
        } else {
            me.getCurrentPosition(callback, scope);
        } 
    },
    getCurrentPosition: function(callback, scope) {
        if (!callback) {
            Ext.Error.raise('A callback function is required.');
        }
        if (!Ext.isFunction(callback)) {
            Ext.Error.raise('The first parameter must be a callback function.');
        }
        var me = this;
        scope = scope || me;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var ll = position.coords;
                callback.call(scope, {
                    latitude: ll.latitude,
                    longitude: ll.longitude
                });
            });
        } else {
            console.log('Your browser does not provide your position.');
        }
    }

});