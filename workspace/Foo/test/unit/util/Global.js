describe("util/Global.js", function() {
    it("rightShift should work", function() {
        var a = [1, 2, 3, 4, 5];
        expect(Deck.util.Global.rightShift(a, 0)).toEqual([1, 2, 3, 4, 5]);
        expect(Deck.util.Global.rightShift(a, 1)).toEqual([2, 3, 4, 5, 1]);
        expect(Deck.util.Global.rightShift(a, 2)).toEqual([3, 4, 5, 1, 2]);
        expect(Deck.util.Global.rightShift(a, 3)).toEqual([4, 5, 1, 2, 3]);
        expect(Deck.util.Global.rightShift(a, 4)).toEqual([5, 1, 2, 3, 4]);
        expect(Deck.util.Global.rightShift(a, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(Deck.util.Global.rightShift(a, 6)).toEqual([2, 3, 4, 5, 1]);
    });
    it("getNext should work", function() {
        expect(1).toBe(1);
    });
});
