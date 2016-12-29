Ext.define('Deck.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.deck-mainviewmodel',
    requires: [
        'Deck.model.Node',
        'Deck.store.Topics'
    ],

    data: {
        language: '_default'
    },
    formulas: {
        languageIcon: {
            bind: '{language}',
            get: function(language) {
                return (this.flagIcons[language] || this.flagIcons._default);
            }
        },
        inches: {
            bind: '{centimeters}',
            get: function(centimeters) {
                // This is run to get the value of inches
                return (centimeters * 0.393701);
            }
        }
    },
    stores: {
        topics: {
            type: 'tree',
            model: 'Deck.model.Node',
            root: {
                text: 'Topics',
                leaf: true
            }
        }
    },
    flagIcons: {
        "_default": {
            url: 'data:image/png;base64,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'
        },
        "fr-FR": {
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFTUlEQVRo3u2ZvY4dRRCFv6qei9aSBSkpSMhvwCtAQkjMC/ASBAjJEQEhbwEPQAwpgQUxggDxJ9Ze7+2qQ9A9PXPn7tp4fywZtqTZ+6e9W2dO1alTvXAXd3EXd3EX/+cwzCbee7i/6hc8+vyDayXw10cfXvl33/32+90EnID44uP3Oa9JqONyZ1ec13YTZjAVx80wM8zAzQB48OCtawE4/+QzkNoLJYoAidzvIQIhMkVKCEgzbLfjx4efApxMwITEH6dPeVqTlIE5ZgZmmJ03qswAu/ESyJ9/OnpPgDooSe25Gog0h92ObJ9P04z81z+fcFZFzADcR9JmS8XddOj3345BrT/vAFKNiXAndzuif94BiLN95fG5CBwzYZYwABgrFDcL4OnZBY25sKBBSUIK3JFEdIammbQaIgUhYS4MA/W8JTDdjoxkXoKs890TNSUmoQRFoC0DqQYwUhjCesLjxt8OAc8AsOqB/lqZmDcwuWUgsrEQ8p5ru+t2ywgUcUn+GkA0iiCRQDmr5WAgW4OsGJgL0W7rzs9xCYA1E7ZqZjOGvB4ACCURELJW/9alU7pdAJeVEIwkZwqUiVxkJrlloIaoCTWFaZ4BvlHnl8eA1n9PQtlmgSRU60aFJGokNaDKMGUfZrHU/m3JaNSLBOiAeCmh175KQR5UadsDSSbUbIPLfJ6+/ZsO2HiZKtTqP+klBKjkdpC1EtqHGgDvLMxDDMDypZSQ1mUzg5ibOJsKZcTxIMtMlBAJjjoL1r9k08w3WU6ZzxEhLVcEiaGjJs7g7OwxT87hPMC9YO5o1D+bhl7mwunp6bXyP33y5EIGUlpMKlAzqClqKexT2x4IIkQNSFmzHJoz7/OAC9yowdT94FWjrJhd65xJTYvUzJ1nsxKWBnFBE0cmkRDyYV2H/+nN3OyFHZSS+/Wa2zO2fYsAn8sHtRvYAbR23PZAxkpGhazl7qbhSGcVOgRxA7Mh8lj3R+2395t9CBDNMZQ4thIRQQ1jn3QVgmha2gFopUqLx2jj/RpNvZkDMwylBiilSCWRAi+QSW6txL4GEVDTMQXW0dsyFKDvCqM3YCR/ZRBHk7g372ziZkmNXFzz0STO6IPMiEhs+CHve0E3d5YgW3aEm3Co3WEe3P2xA/Q9OBP6DMCajNZjL9R6IHJOupeNbVmw1aamg5q9CguqcSDM6uKdqWU3ntfKPomPS2jsA1AjsNJLxJZHm1/jB65infRVANhahfqPkTTzotWncibC2kA72gfUQaThtM2n3fU8fCSHWwW7VhPPSc0SqpUWjSbWYiNaKeci86zcaGQ/f0n1xA7UE7wlP2z2M5r4hQCt9ts1kP5kJKrMdpmjPNqJ+0aW7VwoO3qzXHUWCyLLcVIxM7Bm4kVY0WDg2P/PQDqW5oEiWg8clFBvmkiI6DT1jWyIjdgkfziBzexfs7BO1lYMjJJZlVDOZ0IzGxZtJz5q4t7lkYvQaDTxWnxs9ALPuPOXsaDtipo5BLT5np5sl89hpWdWzBdJXZfQ5Mb9k8Lr7kxlYpoKXgqRUJNmY3GyT/9QQ7Xf7/F+ire+tizkxjbPAOPePeROmiM3ZE4IspR2CaLuiVrJWtu88nI8ie/tjF0KN9jtwF1MRZSp4OaU4rg7pRTMC2BMU2G/32MrU+fjSPLy0lk/xtvvkFGHVEY0RcxaiUxqrYQ7UQrVC5GBvGzcaAaPvvuG5VRycxZkrOqIg2H25Rs/XHrXnyuhwOOvvh7lkCxHibONGGZu3W8sp+OG2X3gTeA+r1b8DfzS/sEBJ2tFekWiAmevWM53cRd38Z+LfwCSC3QgR5wrTwAAAABJRU5ErkJggg=='
        },
        "jp-JP": {
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEOklEQVRo3u1ZT0gUYRR/OzujphuZsRll65IhCZIdOmVEQVS3okN0LerUvSDPBZ0TugV1syDIghI8RBR4CAovSmCkpvmHQmU3dXedad7KW968/WZ2ZgdbpHnw/HbH+b75vf/vzQJEFFFEEUX0P1MMYjF9fGwsvx3BH+nqMnR7bbAsC1Kp1KZEsRhomlZi/E7X+bpVhFjkappmien61NQULg2a/UfnN3iaa4vB+3mGwKqjALCxsQGFQqEkXS2A+30mYkSsiBlJI6nkZnnAvxRC9Wx5jQTQSSpkulFyzTIMezbHwmOhZIFagw0S4IiTvEaXLhRWkPUf87D08QtkRr+CldvMzrE6AxJHO6G59xjUt7WGAq50IfoSxuetwgbMPxuCxRfDYJnlySA79g0Wng9B8vJZaL1yHmJ6PJArSSHKLEBxwPMv1gFfWp9ZgMkHj2F1ctZbSFtP8wNvYWVkFNrvXIf6A3t9aZ5/53WhFAPSAm7pVEWF5QxM9D2EPxPTRSv4YbwX9+DeIOC5EGVplGs/iCAzjwZg/eeib/DEuAf3VgOeaoHDAvImaTal60zPwe/hETygKsa9eIbf1oJ/dliAqjDPrypBJP168yGw5iXjGW7aV2meMJIFdNUmXthoVaWzlc/jdsYxQ+V2PGN/BQuo2JGF8vk8ZDIZMAwDdF0vcjwed3SgMiPhteXpWcitroYSoGCfkc1my7QuvQE1jjhxzeVyTguQC8lWmrfT/DMRCqmZVigB8AxUmPQEnljws8TjEAADghcLOqxSb1TXvBPWv8+GEqC+ZVfJurIGcVfhz8bVEcRoGspEvEjIIUIGdpPdHli4LwQ3dR/2LFqqAYfaf0caJaCyKkuh+GF7LpwEK29rIgS3nDtRMefLwOWtRCmN4gUShJgLpurPmzrbbSF6wcQYqoJxb6LrkKuLuqVRwlZWB9ykddMIUvruDTCSu4vpNAjjnnTfTdc5mKdrVTFVupAcniVYVXU27CDsfnIPdnQc9O02jR0p6H56v7iXny0TiWoe5mm2bKRUmUklmMwICL7nVT+03bqKp7gGLP4P7+l53V/co3Id6UKyT1MWMrfAJY24uQ/XnGbo0H77GiQvnYHFl+9g6f0nMNdym1pqqIPmU8chefE0NHamXdsGFVC3Xsx1oPEDWDW90YoA07YggBxg4pLtSiU8ZTOxVxsra4LbAFTNPOFX49KVHC7Eo176GFVplba8Xn14jaRegSsxyKQiXUhTNVBSwxTQldzLjxW8rCNBq3BIi+t8oFFpW87HstnjjZ5XRlHVFaltrizKgNQ20Ns4Wh0uRBuIi12mDQpX+oyMPRNvtXmHKIXx++JWCsBTd4EwMQFI2Y5uFIENDg46Oj+5clZpPOjba1WDqErnKlflCsMnJ+x1n82JbfbzAL7SmCv+wIHv2cka24jQh9ai36giiiii2tJf92p+I3Q6ikoAAAAASUVORK5CYII='
        }
    }

});
