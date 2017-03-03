Ext.define('Engine.util.Presentation', {
		singleton: true,
		requires: ['Engine.util.ExtJSMarkup'],
		slides: [],
		builds: [],
		currentSlide: 0,
		currentBuild: 0,
		options: [{
			name: 'delivery',
			matcher: ['all', 'individually'],
			defaultValue: 'all'
		}, {
			name: 'duration',
			matcher: /^(\d+)m?s?$/i
		}],
		enterSlide: function(slide) {
			var extMarkup = new Engine.util.ExtJSMarkup(slide);
				var els = Ext.DomQuery.select('[data-effect]', slide),
					effects = [];
				for (var i = 0, len = els.length; i < len; i++) {
					var el = Ext.get(els[i]),
						elEffects = this.parseEffects(el.dom.getAttribute('data-effect'));

					for (var j = 0, elEffectsLen = elEffects.length; j < elEffectsLen; j++) {
						elEffects[j].el = el;
					}
					effects = effects.concat(elEffects);
				}

				this.currentBuild = 0; this.builds = this.generateBuilds(effects);
			},
				showPrevSlide: function() {
					return this.showPrevBuild();
				},
				showNextSlide: function() {
					var nextBuild = this.getNextBuild();
					//if(nextBuild && nextBuild)
					return this.showNextBuild();
				},
				getPrevBuild: function() {
					return this.currentBuild > 0 ? this.builds[this.currentBuild - 1] : false;
				},
				getNextBuild: function() {
					return this.currentBuild < this.builds.length ? this.builds[this.currentBuild + 1] : false;
				},
				showPrevBuild: function() {
					if (this.currentBuild === 0) {
						return false;
					}

					var build = this.builds[this.currentBuild--];
					if (build.config.delivery == 'individually' && !build.el.parent().isVisible()) {
						build.el.parent().show();
					}
					this.effects[build.effect](build.el, build.config);
					return true;
				},
				showNextBuild: function() {
					if (this.currentBuild == this.builds.length) {
						return false;
					}

					var build = this.builds[this.currentBuild++];
					if (build.config.delivery == 'individually' && !build.el.parent().isVisible()) {
						build.el.parent().show();
					}
					this.effects[build.effect](build.el, build.config);
					return true;
				},
				parseEffects: function(val) {
					var effects = val.split(',');
					for (var i = 0, len = effects.length; i < len; i++) {
						var options = Ext.String.trim(effects[i]).split(' ');
						effects[i] = {
							effect: options.shift(),
							config: this.parseEffectConfig(options)
						};
					}
					return effects;
				},
				parseEffectConfig: function(options) {
					var config = {};
					for (var i = 0, len = this.options.length; i < len; i++) {
						var option = this.options[i],
							optionValue = null;
						if (Ext.isArray(option.matcher)) {
							optionValue = Ext.Array.intersect(option.matcher, options)[0];
						} else if (option.matcher instanceof RegExp) {
							for (var j = 0, optionsLen = options.length; j < optionsLen; j++) {
								var match = option.matcher.exec(options[j]);
								if (match) {
									optionValue = options[j].match(/^\d+s$/) ? +match[1] * 1000 : (options[j].match(/^\d+m?s?$/) ? +match[1] : match[1]);
								}
							}
						}

						if (typeof optionValue != 'undefined' && optionValue !== null) {
							config[option.name] = optionValue;
						} else if (option.defaultValue) {
							config[option.name] = option.defaultValue;
						}
					}
					return config;
				},
				splitSlides: function() {

				},
				generateBuilds: function(effects) {
					var builds = [];
					for (var i = 0, len = effects.length; i < len; i++) {
						effects[i].el.enableDisplayMode().hide();

						if (effects[i].config.delivery == 'individually') {
							var children = effects[i].el.query('> *');
							for (var j = 0, childrenLen = children.length; j < childrenLen; j++) {
								var effect = Ext.clone(effects[i]);
								effect.el = Ext.get(children[j]);
								effect.el.hide();
								builds.push(effect);
							}
						} else {
							builds.push(effects[i]);
						}
					}
					return builds;
				},
				effects: {
					appear: function(el, config) {
						el.show();
					},
					disappear: function(el, config) {
						el.hide();
					},
					fadeIn: function(el, config) {
						config = Ext.merge({
							from: {
								opacity: 0
							},
							duration: 1500
						}, config);
						el.fadeIn(config);
					},
					fadeOut: function(el, config) {
						config = Ext.merge({
							duration: 1500
						}, config);
						el.fadeOut(config);
					}
				},
				uis: {

				}
		});