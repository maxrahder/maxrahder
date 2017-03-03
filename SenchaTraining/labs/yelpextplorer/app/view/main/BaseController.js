Ext.define('YelpExtplorer.view.main.BaseController', {
    extend: 'Ext.app.ViewController',
    requires: ['Shared.Geocode'],

    initViewModel: function(vm) {
        var me = this;

        // Typed values should always reflect {city} and {category}.
        vm.bind('{city}', function(city) {
            vm.set('typedCity', city);
        });
        vm.bind('{category}', function(category) {
            vm.set('typedCategory', category);
        });

        // When the user types, wait a second before updating {city} and {category}
        vm.bind('{typedCity}', Ext.Function.createBuffered(function(city) {
            vm.set('city', city);
        }, 1000));
        vm.bind('{typedCategory}', Ext.Function.createBuffered(function(category) {
            vm.set('category', category);
        }, 1000));

        vm.bind('{city}', me.geocodeCity, me);
        vm.bind('{location}', me.load, me);
        vm.bind('{category}', me.load, me);

    },

    geocodeCity: function(city) {
        var me = this;
        Shared.Geocode.geocodeAddress(city, function(coordinates) {
            if (coordinates) {
                me.getViewModel().set('location', coordinates);
            }
        });
    },
    load: function() {
        // Loading the store runs the Yelp URL, passing in a "ll" param, which is set
        // to the location latitide and longitude. Those values are in the '{location}
        // in the view model.

        var vm = this.getViewModel();
        var location = vm.get('location');
        var category = vm.get('category');
        if (!location) return;
        var store = vm.getStore('businesses');

        // Yelp expects something like &ll=43.084,-89.546&term=pizza
        var params = {
            ll: (location.latitude + ',' + location.longitude)
        };
        if (category) {
            params.term = category;
        }
        store.load({
            params: params
        });
        vm.set('business', null);
    }

});
