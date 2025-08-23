const isPro = !!aagb_local_object.licensing;

/* eslint-disable no-undef */
(function ($) {
	const iconToggleMap = new Map([
		['dashicons-plus-alt2', 'dashicons-minus'],
		['dashicons-minus', 'dashicons-plus-alt2'],
		['dashicons-arrow-down-alt2', 'dashicons-arrow-up-alt2'],
		['dashicons-arrow-up-alt2', 'dashicons-arrow-down-alt2'],
		['dashicons-arrow-down', 'dashicons-arrow-up'],
		['dashicons-arrow-up', 'dashicons-arrow-down'],
		['dashicons-plus-alt', 'dashicons-dismiss'],
		['dashicons-dismiss', 'dashicons-plus-alt'],
		['dashicons-insert', 'dashicons-remove'],
		['dashicons-remove', 'dashicons-insert'],
	]);

	function toggleIcon(element, target = ['expand', 'collapse'][0]) {
		const $icon = $(element);
		const classList = $icon.attr('class').split(/\s+/);

		for (const cls of classList) {
			for (const [collapsedCls, expandedCls] of iconToggleMap) {
				if (collapsedCls === cls || expandedCls === cls) {
					const targetCls = {
						expand: collapsedCls,
						collapse: expandedCls,
					}[target];

					$icon.removeClass(cls);
					$icon.addClass(targetCls);
					return;
				}
			}
		}
	}

	function stickToTheSamePlace($accordion, stopAfter = 500) {
		if (window.innerWidth >= 756) return;

		const accordionPosition =
			$accordion[0]?.getBoundingClientRect().top || 0;

		const intervalId = setInterval(() => {
			const accordionOffset = $accordion.offset().top;
			const scrollTo = accordionOffset - accordionPosition;
			window.scrollTo({ top: scrollTo });
		}, 5);

		setTimeout(() => {
			clearInterval(intervalId);
		}, stopAfter);
	}

	const $groupAccordions = $('.wp-block-aab-group-accordion');
	$groupAccordions.each(function () {
		const $groupAccordion = $(this);
        const autoPlay = isPro && $groupAccordion.hasClass("autoplay");
      
		const $accordions = $groupAccordion.find(
			'> .wp-block-aab-accordion-item'
		);
       
		const autoPlaySpeed = $accordions.data('duration');
		const Vertical = $accordions.data('progress-bar-direction');
        const progressBarOn = isPro && $accordions.data('progress-bar-on');
        const autoPlayWithProgressBar = isPro && autoPlay && progressBarOn;
        
		// const autoPlaySpeed = 6000;
		let currentIndex = 0;
		let interval;

		const $accordionHeads = $accordions.find('> .aagb__accordion_head');
		const $accordionIcons = $accordionHeads.find('.aagb__icon');
		const $accordionBodies = $accordions.find('> .aagb__accordion_body');

		const activatorEvent = $groupAccordion.hasClass('hover')
			? 'mouseenter'
			: 'click';

		function resetAll() {
			$accordions.removeClass('aagb__accordion_active');
			$accordionHeads.removeClass('active');
			$accordionBodies
				.removeClass('aagb__accordion_body--show')
				.stop(true, true)
				.slideUp();

			if (autoPlayWithProgressBar) {
				$accordions
					.find('.aab-progress-bar')
					.stop(true, true)
					.css({ width: '0%' });
			}

			$accordionIcons.each(function () {
				toggleIcon($(this), 'expand');
			});
		}

		function activateAccordion($accordion, index) {
			const $head = $accordion.find('> .aagb__accordion_head');
			const $body = $accordion.find('> .aagb__accordion_body');
			const $icon = $head.find('.aagb__icon');

			resetAll();

			$accordion.addClass('aagb__accordion_active');
			$head.addClass('active');
			$body.addClass('aagb__accordion_body--show').slideDown();
			toggleIcon($icon, 'collapse');
			// ✅ Feature image update
			const imageUrl = $accordion.data('feature-image-url');
            const $accordionContainerClass = $accordion.closest('.aagb__group_accordion_container');
           
            const $featureImg = $($accordionContainerClass).find('.aab-feature-img');
			if (imageUrl) {
				$accordionContainerClass.addClass('has_img');
				$featureImg.show();
				$featureImg.removeAttr('hidden');
				$featureImg.find('img').attr('src', imageUrl);
			} else {
				//$accordionContainerClass.removeClass('has_img');
				$featureImg.hide();

				$featureImg.find('img').attr('src', '');
            }

			if (autoPlayWithProgressBar) {
				const $progress = $accordion.find('.aab-progress-bar');

				const isVertical = Vertical === 'vertical';

				if (isVertical) {
					$progress
						.stop(true, true)
						.css({ height: '0%', width: '100%', top: '0' })
						.animate({ height: '100%' }, autoPlaySpeed, 'linear');
				} else {
					$progress
						.stop(true, true)
						.css({ width: '0%', height: '100%', left: '0' })
						.animate({ width: '100%' }, autoPlaySpeed, 'linear');
				}
			}

			currentIndex = index;
		}

		function startAutoplay() {
			activateAccordion($accordions.eq(currentIndex), currentIndex);
			interval = setInterval(function () {
				currentIndex = (currentIndex + 1) % $accordions.length;
				activateAccordion($accordions.eq(currentIndex), currentIndex);
			}, autoPlaySpeed);
		}

		// Initial active body show
		$accordionBodies.each(function () {
			const $body = $(this);
			if ($body.hasClass('aagb__accordion_body--show')) {
				$body.slideDown();
				// ✅ Feature image update for initially active accordion
				const imageUrl = $accordions.data('feature-image-url');
                const $accordionContainerClass = $accordions.closest('.aagb__group_accordion_container');        
                const $featureImg = $($accordionContainerClass).find('.aab-feature-img');
			if (imageUrl) {
				$accordionContainerClass.addClass('has_img');
				$featureImg.show();
				$featureImg.removeAttr('hidden');
				$featureImg.find('img').attr('src', imageUrl);
			} else {
				//$accordionContainerClass.removeClass('has_img');
				$featureImg.hide();

				$featureImg.find('img').attr('src', '');
            }
			}
		});

		$accordionHeads.on(activatorEvent, function () {
			const $head = $(this);
			const $accordion = $head.parent();
			const index = $accordions.index($accordion);
			const isActive = $accordion.hasClass('aagb__accordion_active');
          
			if (isActive) {
				resetAll();
				if (autoPlay) clearInterval(interval);
			} else {
				activateAccordion($accordion, index);
				if (autoPlay) {
					clearInterval(interval);
					startAutoplay();
				}
			}
		});

		// Accessibility with Keyboard
		$accordions.each(function (index) {
			const $accordion = $(this);
			$accordion.addClass('aagb__accordion_head--keyboard');
			$accordion.on('keydown', function (e) {
				if (!$(document.activeElement).is($accordion)) return;

				if (e.code === 'Enter' || e.code === 'Space') {
					e.preventDefault();
					$accordion
						.find('> .aagb__accordion_head')
						.trigger(activatorEvent);
				} else if (/^Arrow(Up|Down|Left|Right)$/.test(e.code)) {
					e.preventDefault();
					const nextIndex =
						index +
						{
							ArrowUp: -1,
							ArrowLeft: -1,
							ArrowDown: +1,
							ArrowRight: +1,
						}[e.code];
					const $next = $accordions.eq(nextIndex);
					if ($next.length) $next.focus();
				} else if (e.code === 'Home') {
					e.preventDefault();
					$accordions.first().focus();
				} else if (e.code === 'End') {
					e.preventDefault();
					$accordions.last().focus();
				}
			});
		});

		// Start autoplay if applicable
		if (autoPlay) {
			startAutoplay();
		} else {
			// Remove progress bar if no autoplay
			$groupAccordion.find('.aab-progress-bar').remove();
		}
	});

	// accordion autoplay js
    // Show All and Close All buttons functionality
	// $('.content-accordion__show-all').on('click', function (e) {
	// 	e.preventDefault();
	// 	var targetAccordion = $(`.` + $(this).data('opentarget'));
	// 	targetAccordion
	// 		.find($('.aagb__accordion_body'))
	// 		.addClass('aagb__accordion_body--show')
	// 		.slideDown();
	// 	targetAccordion.find('.panel').addClass('aagb__accordion_active');
	// 	targetAccordion.find('.hasSubHeading').addClass('active');

	// 	// icon
	// 	const $icon = targetAccordion.find(
	// 		'.aagb__accordion_heading .aagb__icon'
	// 	);

	// 	if ($icon.hasClass('dashicons-plus-alt2')) {
	// 		$icon.removeClass('dashicons-plus-alt2');
	// 		$icon.addClass('dashicons-minus');
	// 	} else if ($icon.hasClass('dashicons-arrow-down-alt2')) {
	// 		$icon.removeClass('dashicons-arrow-down-alt2');
	// 		$icon.addClass('dashicons-arrow-up-alt2');
	// 	} else if ($icon.hasClass('dashicons-arrow-down')) {
	// 		$icon.removeClass('dashicons-arrow-down');
	// 		$icon.addClass('dashicons-arrow-up');
	// 	} else if ($icon.hasClass('dashicons-plus-alt')) {
	// 		$icon.removeClass('dashicons-plus-alt');
	// 		$icon.addClass('dashicons-dismiss');
	// 	} else if ($icon.hasClass('dashicons-insert')) {
	// 		$icon.removeClass('dashicons-insert');
	// 		$icon.addClass('dashicons-remove');
	// 	}
	// });
	// $('.content-accordion__close-all').on('click', function (e) {
	// 	e.preventDefault();
	// 	var targetAccordion = $(`.` + $(this).data('closetarget'));
	// 	targetAccordion
	// 		.find($('.aagb__accordion_body'))
	// 		.removeClass('aagb__accordion_body--show')
	// 		.slideUp();
	// 	targetAccordion.find('.panel').removeClass('aagb__accordion_active');
	// 	targetAccordion.find('.hasSubHeading').removeClass('active');

	// 	const $icon = targetAccordion.find(
	// 		'.aagb__accordion_heading .aagb__icon'
	// 	);

	// 	if ($icon.hasClass('dashicons-minus')) {
	// 		$icon.removeClass('dashicons-minus');
	// 		$icon.addClass('dashicons-plus-alt2');
	// 	} else if ($icon.hasClass('dashicons-arrow-up-alt2')) {
	// 		$icon.removeClass('dashicons-arrow-up-alt2');
	// 		$icon.addClass('dashicons-arrow-down-alt2');
	// 	} else if ($icon.hasClass('dashicons-arrow-up')) {
	// 		$icon.removeClass('dashicons-arrow-up');
	// 		$icon.addClass('dashicons-arrow-down');
	// 	} else if ($icon.hasClass('dashicons-dismiss')) {
	// 		$icon.removeClass('dashicons-dismiss');
	// 		$icon.addClass('dashicons-plus-alt');
	// 	} else if ($icon.hasClass('dashicons-remove')) {
	// 		$icon.removeClass('dashicons-remove');
	// 		$icon.addClass('dashicons-insert');
	// 	}
	// });
// Show All Click
  $('.content-accordion__show-all').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var targetAccordion = $('.' + $this.data('opentarget'));

    // Accordion expand
    targetAccordion.find('.aagb__accordion_body')
      .addClass('aagb__accordion_body--show')
      .slideDown();
    targetAccordion.find('.panel').addClass('aagb__accordion_active');
    targetAccordion.find('.hasSubHeading').addClass('active');

    // Icon change
    const $icon = targetAccordion.find('.aagb__accordion_heading .aagb__icon');
    updateIcon($icon, 'open');

    // Toggle Buttons
    $this.hide();
    $this.siblings('.content-accordion__close-all').show();
  });

  // Close All Click
  $('.content-accordion__close-all').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var targetAccordion = $('.' + $this.data('closetarget'));

    // Accordion collapse
    targetAccordion.find('.aagb__accordion_body')
      .removeClass('aagb__accordion_body--show')
      .slideUp();
    targetAccordion.find('.panel').removeClass('aagb__accordion_active');
    targetAccordion.find('.hasSubHeading').removeClass('active');

    // Icon change
    const $icon = targetAccordion.find('.aagb__accordion_heading .aagb__icon');
    updateIcon($icon, 'close');

    // Toggle Buttons
    $this.hide();
    $this.siblings('.content-accordion__show-all').show();
  });

  // Initially hide Close All button
  $('.content-accordion__close-all').hide();

  // Icon update function
  function updateIcon($icon, action) {
    $icon.each(function () {
      const $el = $(this);
      if (action === 'open') {
        if ($el.hasClass('dashicons-plus-alt2')) {
          $el.removeClass('dashicons-plus-alt2').addClass('dashicons-minus');
        } else if ($el.hasClass('dashicons-arrow-down-alt2')) {
          $el.removeClass('dashicons-arrow-down-alt2').addClass('dashicons-arrow-up-alt2');
        } else if ($el.hasClass('dashicons-arrow-down')) {
          $el.removeClass('dashicons-arrow-down').addClass('dashicons-arrow-up');
        } else if ($el.hasClass('dashicons-plus-alt')) {
          $el.removeClass('dashicons-plus-alt').addClass('dashicons-dismiss');
        } else if ($el.hasClass('dashicons-insert')) {
          $el.removeClass('dashicons-insert').addClass('dashicons-remove');
        }
      } else {
        if ($el.hasClass('dashicons-minus')) {
          $el.removeClass('dashicons-minus').addClass('dashicons-plus-alt2');
        } else if ($el.hasClass('dashicons-arrow-up-alt2')) {
          $el.removeClass('dashicons-arrow-up-alt2').addClass('dashicons-arrow-down-alt2');
        } else if ($el.hasClass('dashicons-arrow-up')) {
          $el.removeClass('dashicons-arrow-up').addClass('dashicons-arrow-down');
        } else if ($el.hasClass('dashicons-dismiss')) {
          $el.removeClass('dashicons-dismiss').addClass('dashicons-plus-alt');
        } else if ($el.hasClass('dashicons-remove')) {
          $el.removeClass('dashicons-remove').addClass('dashicons-insert');
        }
      }
    });
  }
	$('.noEnterSubmit').keypress(function (e) {
		if (e.which == 13) 
            e.preventDefault();
	});

	// Checklist
	const accordionItemsChecklist = $('.aagb__accordion_container.check-list');

	if (accordionItemsChecklist.length) {
		$.each(accordionItemsChecklist, function (index, item) {
			const accordionHeading = $(item)
				.children('.aagb__accordion_head')
				.find('.aagb__accordion_heading');
			accordionHeading.prepend(
				"<input type='checkbox' class='checklist-box'></input>"
			);
		});
	}
})(jQuery);
