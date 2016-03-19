Ext.define('Earthquakes.view.Map', {
    extend: 'Ext.Component',
    xtype: 'earthquakesmap',

    renderConfig: {
        selection: null,
        location: null,
        store: null
    },
    publishes: ['selection'],

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
                zoom: 6,
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
                marker.setIcon(me.yellowIcon);
                marker.setZIndex(1000);
                me.fireEvent('select', this, record);
            } else if (marker.record === oldItem) {
                marker.setIcon(me.redIcon);
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
                icon: me.redIcon,
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

    redIcon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        strokeColor: 'black',
        strokeWeight: 3,
        fillColor: 'red',
        fillOpacity: 1.0
    },
    yellowIcon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        strokeColor: 'black',
        strokeWeight: 3,
        fillColor: 'yellow',
        fillOpacity: 1.0
    }


});