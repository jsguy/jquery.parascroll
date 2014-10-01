/* 
	jquery ParaScroll - Parallax scrolling with CSS3 acceleration

	Copyright (C) 2014 jsguy

	MIT Licensed http://en.wikipedia.org/wiki/MIT_License
*/
(function ($) {
	$.fn.parascroll = $.fn.parascroll || function(options) {
		//	What selector to use when finding scrollable elements
		options = $.extend({ scrollable: '.scrollable' }, options);

		//	Check user agent for some capabilities
		var ua = navigator.userAgent,
			//	Grab the transform to use
			//	http://stackoverflow.com/questions/7212102/detect-with-javascript-or-jquery-if-css-transform-2d-is-available
			getTransform = function() {
				var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
				for(var i = 0; i < prefixes.length; i++) {
					if(document.createElement('div').style[prefixes[i]] !== undefined) {
						return prefixes[i];
					}
				}
				return false;
			},
			transform = getTransform(),
			//	Force 2d on IE9, no way to feature detect, and run on above IE6 and non-mobile
			force2d = ua.match(/msie 9/i),
			run = !(ua.match(/msie 6/i) || ua.match(/mobile/i));
			scrollItems = [],
			scrollHandler = null,
			
			//	Create a scrollable
			Scrollable = function($el) {
				// set up some vars for caching values throughout
				$el = $($el);
					
				var $para = $el.find(options.scrollable),
					elTop = $el.offset().top,
					maxOffset = [],
					height = $el.height();

				// the actual parallax moving function
				function refresh(docScrollY) {
					$para.each(function (idx, $pEl) {
						var offset, translate;
						$pEl = $($pEl);
						// offset is the document scroll minus the top of the current $el
						// divided by the $el's height multiplied by the maximum offset.
						offset = -Math.round(((docScrollY - elTop) / height) * maxOffset[idx]);
						offset = Math.max(offset, maxOffset[idx]);

						translate = force2d ?
							'translateY(' + offset + 'px)':
							'translate3d(0px,' + offset + 'px, 0px)';

						if (transform && translate) {
							$pEl.css(transform, translate);
							$pEl.css('transform', translate);
						} else {
							$pEl.css('marginTop', offset + 'px');
						}
					});
				};

				//	Maximum offset is the height of the element minus the height of the parallax background + 2px
				$para.each(function (idx, item) {
					maxOffset.push(height - $(item).height() + 2);
				});

				//	Expose refresh
				return { 'refresh': refresh };
			},

			//	Update scrollable items
			updateScrollable = function() {
				var docScrollY = $(window).scrollTop();
				$.each(scrollItems, function(idx, item){
					item.refresh(docScrollY);
				})
			},

			//	Add a parralax item
			addParallax = function(node) {
				scrollItems.push(new Scrollable(node));
				if (!scrollHandler) {
					scrollHandler = true;
					$( window ).scroll(updateScrollable);
				}
			};

		if (run) {
			//  Find all parallax items
			this.each(function (idx, item) {
				addParallax(item);
			});

			// Load in the coordinates of the parallax pieces when the document loads
			updateScrollable();
		}
	};
}(window.jQuery));