Ext.define('Engine.util.String', {
    singleton: true,
    endsWith: function(s, suffix) {
        if (s) {
            return (s.indexOf(suffix, s.length - suffix.length) !== -1);
        } else {
            return false;
        }
    },
    removeFromEnd: function(s, suffix) {
        if (Engine.util.String.endsWith(s, suffix)) {
            return s.substr(0, s.length - suffix.length);
        } else {
            return s;
        }
    },
    beginsWith: function(s, prefix) {
        if (s) {
            return s.indexOf(prefix) === 0;
        } else {
            return false;
        }
    },
    getLoremIpsum: function(random) {
        if (random) {
            return this.loremIpsum[Ext.Number.randomInt(0, this.loremIpsum.length - 1)];
        } else {
            return this.loremIpsum.join(' ');
        }
    },
    loremIpsum: ['Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ]
});