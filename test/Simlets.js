Ext.define('Earthquakes.test.Simlets', {
    extend: 'Ext.Base',
    requires: ['Ext.ux.ajax.SimManager'],
    singleton: true,
    constructor: function() {
        this.callParent(arguments);

        var register = {
            "//apis.is/earthquake/is": {
                type: 'json',
                data: this.earthquakesData
            }
        };
        Ext.ux.ajax.SimManager.register(register);

    },

    earthquakesData: {
        "results": [{
            "timestamp": "2016-03-17T23:28:01.000Z",
            "latitude": 64.679,
            "longitude": -16.574,
            "depth": 1.1,
            "size": 0.7,
            "quality": 55.87,
            "humanReadableLocation": "5,2 km NNA af Kverkfjöllum"
        }, {
            "timestamp": "2016-03-17T23:25:05.000Z",
            "latitude": 64.017,
            "longitude": -21.407,
            "depth": 5.6,
            "size": 0.2,
            "quality": 82.8,
            "humanReadableLocation": "0,5 km SSV af Hveradölum"
        }, {
            "timestamp": "2016-03-17T22:23:36.000Z",
            "latitude": 64.019,
            "longitude": -21.407,
            "depth": 4.6,
            "size": 1,
            "quality": 90.02,
            "humanReadableLocation": "0,4 km SV af Hveradölum"
        }, {
            "timestamp": "2016-03-17T21:50:28.000Z",
            "latitude": 64.014,
            "longitude": -21.413,
            "depth": 4.7,
            "size": -0.3,
            "quality": 38.14,
            "humanReadableLocation": "1,0 km SV af Hveradölum"
        }, {
            "timestamp": "2016-03-17T21:48:07.000Z",
            "latitude": 64.018,
            "longitude": -21.427,
            "depth": 5.2,
            "size": 1.7,
            "quality": 90.04,
            "humanReadableLocation": "1,3 km VSV af Hveradölum"
        }, {
            "timestamp": "2016-03-17T21:26:04.000Z",
            "latitude": 64.653,
            "longitude": -17.449,
            "depth": 3.7,
            "size": 0.9,
            "quality": 46.02,
            "humanReadableLocation": "4,0 km ANA af Bárðarbungu"
        }, {
            "timestamp": "2016-03-17T20:23:43.000Z",
            "latitude": 65.032,
            "longitude": -16.65,
            "depth": 5.1,
            "size": 1,
            "quality": 31.31,
            "humanReadableLocation": "2,2 km VSV af Dreka"
        }, {
            "timestamp": "2016-03-17T19:56:49.000Z",
            "latitude": 64.058,
            "longitude": -21.261,
            "depth": 5.1,
            "size": 0.2,
            "quality": 30.57,
            "humanReadableLocation": "3,7 km SV af Hrómundartindi"
        }, {
            "timestamp": "2016-03-17T18:03:20.000Z",
            "latitude": 66.39,
            "longitude": -17.917,
            "depth": 7.1,
            "size": 0.4,
            "quality": 90.01,
            "humanReadableLocation": "17,3 km SSA af Grímsey"
        }, {
            "timestamp": "2016-03-17T18:01:38.000Z",
            "latitude": 64.05,
            "longitude": -21.359,
            "depth": 3.2,
            "size": 0.3,
            "quality": 81.1,
            "humanReadableLocation": "2,4 km NA af Hellisheiðarvirkjun"
        }, {
            "timestamp": "2016-03-17T16:08:41.000Z",
            "latitude": 66.292,
            "longitude": -18.647,
            "depth": 6.4,
            "size": -0.2,
            "quality": 40.41,
            "humanReadableLocation": "21,3 km NA af Siglufirði"
        }, {
            "timestamp": "2016-03-17T14:44:09.000Z",
            "latitude": 63.795,
            "longitude": -20.603,
            "depth": 9.5,
            "size": 0.3,
            "quality": 90.01,
            "humanReadableLocation": "10,8 km VSV af Hellu"
        }, {
            "timestamp": "2016-03-17T14:38:10.000Z",
            "latitude": 64.649,
            "longitude": -17.4,
            "depth": 2,
            "size": 0.9,
            "quality": 90.01,
            "humanReadableLocation": "6,2 km A af Bárðarbungu"
        }, {
            "timestamp": "2016-03-17T14:00:55.000Z",
            "latitude": 66.425,
            "longitude": -17.423,
            "depth": 5.1,
            "size": 0,
            "quality": 78.77,
            "humanReadableLocation": "29,0 km ASA af Grímsey"
        }, {
            "timestamp": "2016-03-17T12:57:16.000Z",
            "latitude": 64.055,
            "longitude": -21.262,
            "depth": 3.2,
            "size": 1.3,
            "quality": 90.03,
            "humanReadableLocation": "4,0 km SV af Hrómundartindi"
        }, {
            "timestamp": "2016-03-17T12:46:07.000Z",
            "latitude": 65.143,
            "longitude": -16.318,
            "depth": 5.7,
            "size": 1.3,
            "quality": 90.01,
            "humanReadableLocation": "3,7 km SSA af Herðubreið"
        }, {
            "timestamp": "2016-03-17T12:13:35.000Z",
            "latitude": 65.647,
            "longitude": -16.903,
            "depth": 4.1,
            "size": -0.6,
            "quality": 86.02,
            "humanReadableLocation": "9,9 km SV af Kröfluvirkjun"
        }, {
            "timestamp": "2016-03-17T10:44:03.000Z",
            "latitude": 64.635,
            "longitude": -17.396,
            "depth": 1,
            "size": 0.7,
            "quality": 71.65,
            "humanReadableLocation": "6,3 km A af Bárðarbungu"
        }, {
            "timestamp": "2016-03-17T09:03:25.000Z",
            "latitude": 66.276,
            "longitude": -16.693,
            "depth": 11.1,
            "size": 0.1,
            "quality": 80.53,
            "humanReadableLocation": "11,1 km VSV af Kópaskeri"
        }, {
            "timestamp": "2016-03-17T08:07:14.000Z",
            "latitude": 66.32,
            "longitude": -17.037,
            "depth": 1.1,
            "size": 0,
            "quality": 41.81,
            "humanReadableLocation": "26,2 km V af Kópaskeri"
        }, {
            "timestamp": "2016-03-17T07:23:19.000Z",
            "latitude": 66.238,
            "longitude": -16.66,
            "depth": 7.9,
            "size": -0.1,
            "quality": 40.53,
            "humanReadableLocation": "11,7 km SV af Kópaskeri"
        }, {
            "timestamp": "2016-03-17T06:42:49.000Z",
            "latitude": 66.257,
            "longitude": -16.702,
            "depth": 6,
            "size": 0,
            "quality": 72.62,
            "humanReadableLocation": "12,2 km VSV af Kópaskeri"
        }, {
            "timestamp": "2016-03-17T06:36:50.000Z",
            "latitude": 66.261,
            "longitude": -16.688,
            "depth": 9.2,
            "size": 0,
            "quality": 85.72,
            "humanReadableLocation": "11,5 km VSV af Kópaskeri"
        }, {
            "timestamp": "2016-03-17T00:33:26.000Z",
            "latitude": 64.624,
            "longitude": -17.531,
            "depth": 1.1,
            "size": 0.6,
            "quality": 90.01,
            "humanReadableLocation": "1,8 km S af Bárðarbungu"
        }, {
            "timestamp": "2016-03-17T00:15:47.000Z",
            "latitude": 67.988,
            "longitude": -18.19,
            "depth": 4.8,
            "size": 1.4,
            "quality": 30.15,
            "humanReadableLocation": "95,6 km NNA af Kolbeinsey"
        }, {
            "timestamp": "2016-03-16T23:50:44.000Z",
            "latitude": 67.006,
            "longitude": -17.596,
            "depth": 5.4,
            "size": 0.8,
            "quality": 48.35,
            "humanReadableLocation": "49,5 km ASA af Kolbeinsey"
        }, {
            "timestamp": "2016-03-16T23:42:47.000Z",
            "latitude": 67.004,
            "longitude": -17.571,
            "depth": 1.1,
            "size": 1.5,
            "quality": 72.92,
            "humanReadableLocation": "50,6 km ASA af Kolbeinsey"
        }, {
            "timestamp": "2016-03-16T23:36:35.000Z",
            "latitude": 64.626,
            "longitude": -17.529,
            "depth": 1.1,
            "size": 0.8,
            "quality": 90.01,
            "humanReadableLocation": "1,6 km S af Bárðarbungu"
        }, {
            "timestamp": "2016-03-16T23:33:21.000Z",
            "latitude": 64.599,
            "longitude": -17.431,
            "depth": 1.1,
            "size": 1.8,
            "quality": 90.07,
            "humanReadableLocation": "6,5 km SA af Bárðarbungu"
        }, {
            "timestamp": "2016-03-16T19:41:22.000Z",
            "latitude": 64.635,
            "longitude": -17.406,
            "depth": 2.7,
            "size": 0.3,
            "quality": 38.39,
            "humanReadableLocation": "5,8 km A af Bárðarbungu"
        }, {
            "timestamp": "2016-03-16T16:56:52.000Z",
            "latitude": 64.664,
            "longitude": -17.429,
            "depth": 8.2,
            "size": 0.9,
            "quality": 69.12,
            "humanReadableLocation": "5,4 km ANA af Bárðarbungu"
        }, {
            "timestamp": "2016-03-16T16:25:34.000Z",
            "latitude": 64.689,
            "longitude": -17.475,
            "depth": 9.5,
            "size": 0.3,
            "quality": 81.21,
            "humanReadableLocation": "6,0 km NNA af Bárðarbungu"
        }, {
            "timestamp": "2016-03-16T16:19:20.000Z",
            "latitude": 64.666,
            "longitude": -17.406,
            "depth": 1.1,
            "size": 1,
            "quality": 90.01,
            "humanReadableLocation": "6,5 km ANA af Bárðarbungu"
        }, {
            "timestamp": "2016-03-16T10:53:27.000Z",
            "latitude": 65.222,
            "longitude": -16.309,
            "depth": 5.4,
            "size": 1.2,
            "quality": 73.78,
            "humanReadableLocation": "5,0 km NV af Herðubreiðarlindum"
        }, {
            "timestamp": "2016-03-16T08:58:26.000Z",
            "latitude": 64.496,
            "longitude": -17.507,
            "depth": 1.1,
            "size": -0.3,
            "quality": 83.36,
            "humanReadableLocation": "14,5 km A af Hamrinum"
        }, {
            "timestamp": "2016-03-16T08:54:16.000Z",
            "latitude": 64.484,
            "longitude": -17.46,
            "depth": 3.7,
            "size": 0.2,
            "quality": 90.01,
            "humanReadableLocation": "12,6 km NV af Grímsfjalli"
        }, {
            "timestamp": "2016-03-16T07:33:32.000Z",
            "latitude": 63.648,
            "longitude": -19.159,
            "depth": 0.8,
            "size": -0.7,
            "quality": 35.67,
            "humanReadableLocation": "4,6 km A af Goðabungu"
        }, {
            "timestamp": "2016-03-16T07:09:38.000Z",
            "latitude": 67.3,
            "longitude": -17.821,
            "depth": 12.7,
            "size": 2,
            "quality": 90.01,
            "humanReadableLocation": "40,6 km ANA af Kolbeinsey"
        }, {
            "timestamp": "2016-03-16T06:54:39.000Z",
            "latitude": 66.268,
            "longitude": -16.686,
            "depth": 10.4,
            "size": 0.1,
            "quality": 82.36,
            "humanReadableLocation": "11,1 km VSV af Kópaskeri"
        }, {
            "timestamp": "2016-03-16T04:53:08.000Z",
            "latitude": 64.057,
            "longitude": -17.228,
            "depth": 3,
            "size": 0.3,
            "quality": 38.52,
            "humanReadableLocation": "12,7 km VNV af Skaftafelli"
        }, {
            "timestamp": "2016-03-16T04:22:40.000Z",
            "latitude": 67.708,
            "longitude": -17.922,
            "depth": 5.2,
            "size": 1.2,
            "quality": 31.97,
            "humanReadableLocation": "70,1 km NNA af Kolbeinsey"
        }, {
            "timestamp": "2016-03-16T04:03:59.000Z",
            "latitude": 67.148,
            "longitude": -17.79,
            "depth": 4.8,
            "size": 1.4,
            "quality": 52.94,
            "humanReadableLocation": "38,4 km A af Kolbeinsey"
        }, {
            "timestamp": "2016-03-16T03:27:47.000Z",
            "latitude": 68.124,
            "longitude": -18.256,
            "depth": 5.2,
            "size": 2.3,
            "quality": 66.97,
            "humanReadableLocation": "109,9 km N af Kolbeinsey"
        }, {
            "timestamp": "2016-03-16T01:55:09.000Z",
            "latitude": 63.941,
            "longitude": -20.008,
            "depth": 8.2,
            "size": 0.6,
            "quality": 90.01,
            "humanReadableLocation": "16,3 km SA af Árnesi"
        }, {
            "timestamp": "2016-03-16T01:54:27.000Z",
            "latitude": 63.945,
            "longitude": -20.008,
            "depth": 7.5,
            "size": -0.2,
            "quality": 90.01,
            "humanReadableLocation": "16,0 km SA af Árnesi"
        }]
    }

});