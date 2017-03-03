Ext.define('YelpExtplorer.view.businesses.Map', {
    extend: 'Ext.Map',
    xtype: 'businessesmap',
    config: {
        store: null,
        selection: null,
        locations: null,
        location: null
    },
    twoWayBindable: ['selection'],
    // @private
    getMarkers: function() {
        return this.markers || [];
    },
    updateSelection: function(business) {
        var markers = this.getMarkers();
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            if (marker.coordinate.record === business) {
                marker.setIcon(this.yellowMarker);
            } else {
                marker.setIcon(this.redMarker);
            }
        }
    },
    updateLocation: function(location) {
        if (location) {
            this.getMap().setCenter({
                lat: location.latitude,
                lng: location.longitude
            });
        }
    },
    // @private
    updateLocations: function(locations) {
        var me = this;

        // Remove the old markers from the map
        var markers = this.getMarkers();
        Ext.Array.forEach(markers, function(marker) {
            marker.setMap(null);
        });
        me.markers = []; // Let the gc have the markers

        locations = locations || [];

        var map = me.getMap();
        Ext.Array.forEach(locations, function(coordinate) {
            var ll = new google.maps.LatLng(coordinate.latitude, coordinate.longitude);
            var marker = new google.maps.Marker({
                position: ll,
                map: map,
                icon: me.redMarker,
                coordinate: coordinate
            });
            me.markers.push(marker);
            google.maps.event.addListener(marker, "click", function() {
                me.fireEvent('itemtap', me, marker.coordinate, coordinate.record);
                me.setSelection(coordinate.record);
            });
        });
    },
    applyStore: function(store) {
        if (Ext.isString(store)) {
            store = Ext.getStore(store);
        }
        return store;
    },
    updateStore: function(store) {
        if (store) {
            var me = this;
            this.getStore().on('load', function(store) {
                me.calculateMarkers(store);
            }, me);
            me.calculateMarkers(store);
        }
    },
    calculateMarkers: function(store) {
        var locations = [];
        store.each(function(record) {
            var coordinate = {
                latitude: record.data.latitude,
                longitude: record.data.longitude,
                record: record
            };
            locations.push(coordinate);
        });
        this.setLocations(locations);
    },
    redMarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAYAAAASYli2AAADDklEQVRIS7WVS0wTQRjHv9k+t4W2yCsWQkExlYehNARMKlIPFY41Go2eROPBi9FE48UoeNKD0XjQqInGGDFEEjGRg0B8JPIMihJAIQRKAoSAWGxtd/vaNbN2yWZpuy2Nc5z55jf/b75v/oMg8bADQAMAGKJh6wDwAQA+xtuG4iy0KBC6pJPLwJatk5s0pBLHzfupYN+aJ+yPMH8ohrkHAK3i/WKgQU2gQaNaVXS9rJisy9LFPG/I7YGr313UAhWYC7KsDQCwcm4IgQYlQhNN+Vk5typLOUWJhicUhtYpV7B7xT1HM+xeHroBVCLosm3TOx5WmxVSMOF6Y/8YtUwHn/oZ5qxQoZ0kiJ5P9Ra5TiFPhQcLVACaBsaCAYZtxAXjFJIyNHjNXFx32JibEowPvju7CI/nl3p8EfYgBuKWcH9usEKq6nggVnmg7xuXMQbaTaTqTa+tSrsledFNe96NhGiGqeWAlZnazld1Ffp0gIeGJn6Pe33O/wPMUcq7BvZbNeko3NU7jLdX833IvrdVQSGp2hJz0uuDI8OTVIhlNRxQK0Pdp0xGx7kdBVsCXhyfCb1dWe+gGeYEr9CuJojuvnqLItXWEbRMCQC4Np4ebu7mou2WCzsLU8pbqE5sDsUAMJfKXWLXaf4yhe+uHKsTA0FDEPd3Z5An22sr1MlcZmP/GD3rp28CQEss+8JzBhWBftyuLM135GUlZOL3+8i1NE0zrFkYGMuxnSRBvEzkPIJCVAPAVykgYG/cl613PLDE9sbTo1PUiNu74YGSQJy6AqGlJ1bzpm9AUAij0Prj3aHwsBarTntZXKCjwxOBUY/vhrAQySjkCoRVdtSWk+WZ/5xN8MRiqtvUNuKyqgmi7VhB7vErZhO3hJv49fIv/H2ej9cC8f5lPt6Zo5Q/552IN1FxZZNNmYvTyoifbTVl2d5wBM6MTq9SDJOXqEGlFAKfNoa0L66+wI6SFhAAnCWk6pknHJGthcIY1pkukPsVoxDJjCQDMChDRswghNa94UiNlGkkBQSAO1FQ3HbhD/oLrfMvEERE9GkAAAAASUVORK5CYII=',
    yellowMarker: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAYAAAASYli2AAADGklEQVRIS7WWXUhTYRjHn3Pc1zke27C2PtWWhqJWmwtTLLYkk4JkERFKRNFNQlTQJ95kF0VKYEUkXYRUaIReyHAXqUSjAu0DnLZQW81ERmilG9vO3NwW72lHDsftzDl6L8/7PL/9n/d53v87DISXAQD0AKCIhs0BwGsAsMRLw+JsNErE2GW5Ig0q9XJRrlomQXHfHP7AK4trwesNe3y+8EMAuMHP5wMVBIENZG2UZt+7oyb2VKyK+Xtv3rnh/CUHPTE57wgEIhUAgJQziwtUSCSY7XBN5prHrXmMIqE151qAi9cmAibzHwdNR8pY6CJQKgHzXr28qqujQJwIxt0vKbfSTmfgiccXrucqNJAk3jc+rBUp5KJkePBjch50FdaA3x+pRg1jFKJza2lS7zpeq0wKxgbfap6C+60/+zye0H4ERCMxO2XXQbLqWCBSWaQbYipGQEPeFmnP0KAmfUXyoknK7A9Bmg6XMkDNjvTut/3F8lSAu/d9dg1Zvcb/A1QpRebvX3RkKgop5SBK17JzGLF90kBOtnRFzOERL+irbXQwGCEZIEWl9Z6rX1fVcGXTioCn6+1BU89sF+0P17EKDQSB934d0YqTHR3OyKgBYGLx6qHhPntmveZ6Q1ZSdXPV8c1hMwA4kjlL5Do1R0fR2RUidXwgUCTeWlxMnuw3F8mWc5gl5Vb/uN3fBACNsewLfVPIZNho26O8tYcOZgoy0f1teeAcp+lIPjcwlmMbSRLvFHIeTiO0AMBc4ngKme/IGysNiqrO9vyY3mg8NkYPDLgXPTAhEJUuFmNOU2fBkmeA04gNXOsXVBjdbCwrpa7yG1R5wDb//qPnNrcRy1HINAiptLwsIrZv++dsnCsWU92SseG3lZDhHadOqGqbb+YwW2iIX3T9Rs/nhXgjEO9dZuONKqWonXUi1kT5nV1uyUwcReG/ek2Fq13uEBypG5vx+cIqoQFNpBDYshGk7en0c+QoKQEBwLg1V/rM5Q6lTc8sIFh3qkDmVYxCElaUMACBMjJwO4Zhc253aKfgBef9txGKvRvdjDsubPJf1ngvEAc21SMAAAAASUVORK5CYII='
});
