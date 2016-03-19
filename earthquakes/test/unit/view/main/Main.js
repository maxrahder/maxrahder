describe("The selection", function() {

    it("updates the view model {selection} property", function() {
        ST.play([{
            type: "tap",
            target: "earthquakesgrid => [data-recordindex=\"0\"]",
            x: 27,
            y: 1
        }, {
            fn: function() {
                var earthquake = Ext.first('main').getViewModel().get('earthquake');
                var expected = {
                    "latitude": 63.945,
                    "longitude": -20.008,
                    "depth": 7.5,
                    "size": -0.2,
                    "quality": 90.01,
                    "humanReadableLocation": "16,0 km SA af \u00c1rnesi"
                };
                expect(earthquake.data.latitude).toEqual(expected.latitude);
                expect(earthquake.data.longitude).toEqual(expected.longitude);
                expect(earthquake.data.depth).toEqual(expected.depth);
                expect(earthquake.data.size).toEqual(expected.size);
                expect(earthquake.data.quality).toEqual(expected.quality);
                expect(earthquake.data.humanReadableLocation).toEqual(expected.humanReadableLocation);
            }
        }]);

    });

});