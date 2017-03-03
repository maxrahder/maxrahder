Ext.define('Beatles.model.Person', {
    extend : 'Ext.data.Model',
    proxy : {
        type : 'ajax',
        url : 'resources/data/theBeatles.json'
    },
    fields : [ {
        name : 'dob',
        type : 'date',
        dateFormat : 'Y/m/d'
    } ]
});
