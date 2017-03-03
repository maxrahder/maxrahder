/**
 * A wrapper around a Google map.
 * Use setLocation() to center the map
 * Use setSelection() to highlight a marker
 */
Ext.define('Shared.view.Map', {
    extend: 'Ext.Component',
    requires: ['Shared.Geocode'],

    renderConfig: {
        store: null,
        selection: null,
        location: null
    },
    publishes: ['selection'],

    statics: {
        geocodeAddress: function(address, callback, scope) {
            Shared.Geocode.geocodeAddress(address, callback, scope);
        }
    },

    padding: 8,

    html: '<p>PLEASE enter search criteria.</p>',

    applyStore: function(store) {
        if (Ext.isString(store)) {
            store = Ext.getStore(store);
        }
        return store;
    },
    updateStore: function(store) {
        if (store) {
            var me = this;
            this.getStore().on('datachanged', function(store) {
                me.setMarkers(store);
            }, me);
            this.getStore().on('load', function(store) {
                me.setMarkers(store);
            }, me);
            if (store.isLoaded) {
                me.setMarkers(store);
            }
        }
    },

    updateLocation: function(location) {
        if (!location) {
            return;
        }
        // If we're visible, render the map right away. Else
        // wait until someone clicks on the tab.
        if (this.isVisible()) {
            this.renderMap();
        } else {
            this.on('show', this.renderMap, this, {
                single: true
            });
        }
    },

    updateSelection: function(business) {
        var markers = this.getMarkers();
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            if (marker.business === business) {
                marker.setIcon('resources/images/yellow-dot.png');
                this.fireEvent('select', this, business);
            } else {
                marker.setIcon('resources/images/red-dot.png');
            }
        }
    },

    // @private
    renderMap: function() {
        // Assert : centerMap() has been run, and therefore,
        // this.latitude and this.longitude are set.
        var p = this.getLocation();
        this.map = this.map || new google.maps.Map(this.getEl().dom, {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this.map.panTo({
            lat: p.latitude,
            lng: p.longitude
        });
        this.renderMarkers();
    },
    // @private
    getMarkers: function() {
        return (this.markers || []);
    },
    // @private
    setMarkers: function(businesses) {
        // Hide the previously saved markers
        var markers = this.getMarkers();
        Ext.Array.forEach(markers, function(marker) {
            marker.setMap(null);
        });

        this.markers = [];

        // For each business, push a new marker onto the array
        var me = this;
        businesses.each(function(business) {
            var ll = new google.maps.LatLng(business.data.location.coordinate.latitude, business.data.location.coordinate.longitude);
            var marker = new google.maps.Marker({
                position: ll,
                title: business.data.name,
                icon: 'resources/images/red-dot.png',
                business: business
            });
            me.markers.push(marker);
            google.maps.event.addListener(marker, "click", function() {
                me.fireEvent('select', me, business);
                me.setSelection(business);
            });
        });

        // If we're visible, render the markers right away. Else
        // wait until someone clicks on the tab.
        if (this.isVisible()) {
            this.renderMarkers();
        } else {
            this.on('show', this.renderMarkers, this, {
                single: true
            });
        }

    },
    // @private
    renderMarkers: function() {
        // This method must always be run after setMarkers()
        // Assert: this.map is set.
        var me = this;
        Ext.Array.forEach(this.getMarkers(), function(marker) {
            marker.setMap(me.map);
        });
    }

});
