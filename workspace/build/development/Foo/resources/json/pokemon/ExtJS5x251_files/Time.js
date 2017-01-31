Ext.define('Engine.util.Time', {
    singleton : true,

    // Usage: 
    // Engine.util.Time.minutesToHoursString(64) returns 1:04
    minutesToHoursString : function(minutes, delimiter){
        delimiter = delimiter || ':';
        var hours = Math.floor(minutes/60);
        var m = Ext.String.leftPad((minutes%60), 2, '0');
        return hours + delimiter + m;
    }
});