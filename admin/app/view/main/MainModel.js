Ext.define('Admin.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main-main',
    requires: ['Admin.model.ScheduledCourse'],

    data: {
        name: 'Admin',
        roster: false
    },

    formulas: {
        selectedCourseTitle: {
            bind: {
                bindTo: '{selectedCourse}',
                deep: true
            },
            get: function (course) {
                return course.data.title
            }
        }
    },

    stores: {
        people: {
            filters: [{
                roster: '{roster}', // This is a binding -- the value is available in filterFn
                id: 1, // A constant will reuse this filter rather than adding a new one 
                filterFn: function (person) {
                    if (this.roster) {
                        return (person.data.title === 'Fast Track to Ext JS');
                    } else {
                        return true;
                    }
                }
            }],
            data: [{
                "name": "Jeromy Sobus",
                "email": "stone@meekness.com",
                "phone": "(358) 144-0455",
                "title": 'Fast Track to Ext JS'
            }, {
                "name": "Blanche Hosmer",
                "email": "ca-tech@dps.centrin.net.id",
                "phone": "(471) 438-2802"
            }, {
                "name": "Miki Sword",
                "email": "trinanda_lestyowati@telkomsel.co.id",
                "phone": "(195) 978-6434"
            }, {
                "name": "Nikki Schillaci",
                "email": "asst_dos@astonrasuna.com",
                "phone": "(931) 440-0645",
                "title": 'Fast Track to Ext JS'
            }, {
                "name": "Karleen Autin",
                "email": "amartabali@dps.centrin.net.id",
                "phone": "(770) 748-9256"
            }, {
                "name": "Sueann Ashcroft",
                "email": "achatv@cbn.net.id",
                "phone": "(550) 936-6704"
            }, {
                "name": "Milagros Mcdavid",
                "email": "bali@tuguhotels.com",
                "phone": "(756) 268-3503"
            }, {
                "name": "Vesta Boss",
                "email": "baliminimalist@yahoo.com",
                "title": 'Fast Track to Ext JS',
                "phone": "(546) 632-7542"
            }, {
                "name": "Hilda Victorian",
                "email": "bliss@thebale.com",
                "phone": "(273) 442-3637"
            }, {
                "name": "Kayleigh Grissett",
                "email": "adhidharma@denpasar.wasantara.net.id",
                "phone": "(725) 386-7495"
            }, {
                "name": "Clarine Leard",
                "email": "centralreservation@ramayanahotel.com",
                "title": 'Fast Track to Ext JS',
                "phone": "(230) 282-1969"
            }, {
                "name": "Selene Knoll",
                "email": "apribadi@balimandira.com",
                "phone": "(282) 387-2224"
            }, {
                "name": "Rafaela Mcniff",
                "email": "cdagenhart@ifc.org",
                "phone": "(784) 202-2361"
            }, {
                "name": "Frankie Replogle",
                "email": "dana_supriyanto@interconti.com",
                "title": 'Fast Track to Ext JS',
                "phone": "(269) 943-6077"
            }, {
                "name": "Nicolette Harley",
                "email": "dos@novotelbali.com",
                "phone": "(782) 215-9798"
            }, {
                "name": "Leanna Arebalo",
                "email": "daniel@hotelpadma.com",
                "phone": "(705) 212-3107"
            }, {
                "name": "Roxy Kina",
                "email": "daniel@balibless.com",
                "phone": "(942) 621-5793"
            }, {
                "name": "Jacalyn Sherron",
                "email": "djoko_p@jayakartahotelsresorts.com",
                "title": 'Fast Track to Ext JS',
                "phone": "(280) 576-9862"
            }, {
                "name": "Soo Journey",
                "email": "expdepot@indosat.net.id",
                "title": 'Fast Track to Ext JS',
                "phone": "(274) 146-5847"
            }, {
                "name": "Moriah Sweitzer",
                "email": "feby.adamsyah@idn.xerox.com",
                "phone": "(421) 935-5668"
            }, {
                "name": "Keshia Denver",
                "email": "christian_rizal@interconti.com",
                "phone": "(454) 904-4837"
            }, {
                "name": "Carman Ghoston",
                "email": "singgih93@mailcity.com",
                "phone": "(528) 484-2240"
            }, {
                "name": "Lloyd Cray",
                "email": "idonk_gebhoy@yahoo.com",
                "phone": "(123) 804-3591"
            }, {
                "name": "Kareen Riese",
                "email": "info@houseofbali.com",
                "phone": "(179) 618-6927"
            }, {
                "name": "Shella Kozak",
                "email": "kyohana@toureast.net",
                "title": 'Fast Track to Ext JS',
                "phone": "(271) 284-2546"
            }, {
                "name": "Barry Bastin",
                "email": "sales@nusaduahotel.com",
                "phone": "(562) 220-3486"
            }, {
                "name": "Audrie Scioneaux",
                "email": "jayakarta@mataram.wasantara.net.id",
                "phone": "(463) 728-7638"
            }]
        },
        instructors: {
            data: [{
                email: 'mars@sencha.com'
            }, {
                email: 'max@sencha.com'
            }, {
                email: 'ron.baily@sencha.com'
            }]
        },
        scheduledCourses: {
            model: 'Admin.model.ScheduledCourse'
        },
        catalog: {
            sorters: [{
                property: 'active',
                direction: 'DESC'
            }, 'title'],
            data: [{
                title: 'Fast Track to Ext JS',
                requirements: 'extjs 6.2',
                active: true,
                modules: ['FastTrackExtJS6']
            }, {
                title: 'Sencha Test for Developers',
                requirements: 'extjs6.2',
                active: true,
                modules: ['ST for developers']
            }, {
                title: 'Sencha Test for Developers',
                requirements: 'extjs6.2',
                active: true,
                modules: ['ST for developers']
            }, {
                title: 'Fast Track to Ext JS 5.x',
                requirements: 'extjs5.1',
                active: false,
                modules: ['ST for developers']
            }, {
                title: 'Fast Track to Senha Touch',
                requirements: 'touch 2.1',
                active: false,
                modules: ['ST for developers']
            }]
        }
    }

});