Ext.define('Deck.util.Global', {
    singleton: true,
    editing: location.search.match(/\edit\b/),
    constructor: function() {
        this.language = '_default';
        if (location.search) {
            var q = Ext.Object.fromQueryString(location.search[1]);
            this.language = (q.language || this.language);
        }
        this.callParent(arguments);

    },
    rightShift: function(array, shift) {
        shift = (shift % array.length);
        var first = _.first(array, shift);
        var last = _.last(array, (array.length - shift));
        var result = last.concat(first);
        return result;
    },
    testShiftArray: function() {
        var a = [1, 2, 3, 4, 5];
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 0), [1, 2, 3, 4, 5]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 1), [2, 3, 4, 5, 1]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 2), [3, 4, 5, 1, 2]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 3), [4, 5, 1, 2, 3]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 4), [5, 1, 2, 3, 4]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 5), [1, 2, 3, 4, 5]));
        console.log(Ext.Array.equals(Deck.util.Global.rightShift(a, 6), [2, 3, 4, 5, 1]));
    },
    getNext: function(a, item, next) {
        next = Ext.isDefined(next) ? next : true;
        var i = Ext.Array.indexOf(a, item);
        var result = null;
        if (a.length === 0) {
            // Do nothing
        } else if (i === -1) {
            // Do nothing
        } else {
            if (next) {
                // If it's not at the end, get the next item. Else get the first.
                if (i < (a.length - 1)) {
                    result = a[i + 1];
                } else {
                    result = a[0];
                }
            } else {
                // If it's not at the beginning, get the previous. Else get the last.
                if (i > 0) {
                    result = a[i - 1];
                } else {
                    result = a[a.length - 1];
                }
            }
        }
        return result;
    },
    testGetNext: function() {

        var a = [1, 2, 3, 4, 5];

        console.log(Deck.util.Global.getNext(a, 1, true) === 2);
        console.log(Deck.util.Global.getNext(a, 2, true) === 3);
        console.log(Deck.util.Global.getNext(a, 3, true) === 4);
        console.log(Deck.util.Global.getNext(a, 4, true) === 5);
        console.log(Deck.util.Global.getNext(a, 5, true) === 1);
        console.log(Deck.util.Global.getNext(a, 6, true) === null);

        console.log(Deck.util.Global.getNext(a, 1) === 2);
        console.log(Deck.util.Global.getNext(a, 2) === 3);
        console.log(Deck.util.Global.getNext(a, 3) === 4);

        console.log(Deck.util.Global.getNext(a, 1, false) === 5);
        console.log(Deck.util.Global.getNext(a, 2, false) === 1);
        console.log(Deck.util.Global.getNext(a, 3, false) === 2);
        console.log(Deck.util.Global.getNext(a, 4, false) === 3);
        console.log(Deck.util.Global.getNext(a, 5, false) === 4);
        console.log(Deck.util.Global.getNext(a, 6, false) === null);
    }

});
