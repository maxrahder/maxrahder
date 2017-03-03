Ext.define('Shared.view.Map', {
    extend: 'Ext.Component',
    mixins: ['Ext.mixin.Mashup'],
    requiredScripts: [
        'http://maps.googleapis.com/maps/api/js?key=AIzaSyBSkwEjnLJu6JoH2zN9wpaqN4cgCyv4qlc'
    ],
    renderConfig: {
        selection: null,
        location: null,
        store: null
    },
    twoWayBindable: ['selection'],

    padding: 8,

    html: 'Please specify a location and marker coordinates.',

    applyStore: function(store) {
        return Ext.data.StoreManager.lookup(store);
    },
    updateStore: function(store) {
        var me = this;
        if (store.isLoaded()) {
            me.drawMarkers(store);
        } else {
            store.on('load', function(store) {
                me.drawMarkers(store);
            });
        }
    },
    getMap: function() {
        this.map = this.map || new google.maps.Map(this.getEl().dom, {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });
        return this.map;
    },

    updateLocation: function(location) {
        if (location) {
            this.getMap().panTo({
                lat: location.latitude,
                lng: location.longitude
            });
        }
    },

    updateSelection: function(record, oldItem) {
        var me = this,
            markers = me.getMarkers();

        Ext.Array.forEach(markers, function(marker) {
            if (marker.record === record) {
                marker.setIcon(me.getMarker('yellow'));
                marker.setZIndex(1000);
                me.fireEvent('select', this, record);
            } else if (marker.record === oldItem) {
                marker.setIcon(me.getMarker('red'));
                marker.setZIndex(undefined);
            }
        });

    },

    // @private
    getMarkers: function() {
        return (this.markers || []);
    },

    // @private
    drawMarkers: function(store) {

        var me = this,
            markers = me.getMarkers(),
            map = me.getMap(),
            ll,
            marker,
            it;

        // Destroy the current set of markers.
        Ext.Array.forEach(markers, function(marker) {
            marker.setMap(null);
        });

        me.markers = [];

        // For each record, create and show a new marker, and push onto the array.
        store.each(function(record) {
            ll = new google.maps.LatLng(record.data.latitude, record.data.longitude);
            marker = new google.maps.Marker({
                position: ll,
                icon: me.getMarker('red'),
                record: record
            });
            me.markers.push(marker);
            attachListener(marker, record);
            marker.setMap(map);
        });

        function attachListener(marker, record) {
            google.maps.event.addListener(marker, "click", function() {
                me.setSelection(record);
            });
        }

    },

    getMarker: function(color) {
        return {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            strokeColor: 'black',
            strokeWeight: 3,
            fillColor: color,
            fillOpacity: 1.0
        };
    }

});
