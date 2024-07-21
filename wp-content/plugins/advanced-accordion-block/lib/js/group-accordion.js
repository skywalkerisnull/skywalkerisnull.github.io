/* eslint-disable no-undef */
(function ($) {
	// Accordion
	const groupAccordions = $('.wp-block-aab-group-accordion.click');
	groupAccordions.each(function () {
		// accordion head
		const accordionHeads = $(this).find('.aagb__accordion_head');
		const accordionContents = $(this).find('.aagb__accordion_body');
		const accordionIcons = $(this).find('.aagb__icon');

		// active accordion
		const activeAccordion = $(this).find('.aagb__accordion_body--show');
		// all accordions
		const accordions = $(this).find('.wp-block-aab-accordion-item');

		// show active accrodion on load
		if (activeAccordion.length) {
			activeAccordion.slideDown();
		}

		// each btn click
		accordionHeads.each(function () {
			// click event
			$(this).click(function () {
				// get parent
				const parent = $(this).parent();
				// get panel
				const panel = parent.children('.aagb__accordion_body');
				// console.log("this is panel selector: ", panel);
				// icon
				const $icon = $(this).find('.aagb__icon');

				if (panel.hasClass('aagb__accordion_body--show')) {
					// active class to parent
					parent.removeClass('aagb__accordion_active');
					panel.removeClass('aagb__accordion_body--show');
					panel.slideUp();
					// icons
					if ($icon.hasClass('dashicons-plus-alt2')) {
						$icon.removeClass('dashicons-plus-alt2');
						$icon.addClass('dashicons-minus');
					} else if ($icon.hasClass('dashicons-minus')) {
						$icon.removeClass('dashicons-minus');
						$icon.addClass('dashicons-plus-alt2');
					} else if ($icon.hasClass('dashicons-arrow-down-alt2')) {
						$icon.removeClass('dashicons-arrow-down-alt2');
						$icon.addClass('dashicons-arrow-up-alt2');
					} else if ($icon.hasClass('dashicons-arrow-up-alt2')) {
						$icon.removeClass('dashicons-arrow-up-alt2');
						$icon.addClass('dashicons-arrow-down-alt2');
					} else if ($icon.hasClass('dashicons-arrow-down')) {
						$icon.removeClass('dashicons-arrow-down');
						$icon.addClass('dashicons-arrow-up');
					} else if ($icon.hasClass('dashicons-arrow-up')) {
						$icon.removeClass('dashicons-arrow-up');
						$icon.addClass('dashicons-arrow-down');
					} else if ($icon.hasClass('dashicons-plus-alt')) {
						$icon.removeClass('dashicons-plus-alt');
						$icon.addClass('dashicons-dismiss');
					} else if ($icon.hasClass('dashicons-dismiss')) {
						$icon.removeClass('dashicons-dismiss');
						$icon.addClass('dashicons-plus-alt');
					} else if ($icon.hasClass('dashicons-insert')) {
						$icon.removeClass('dashicons-insert');
						$icon.addClass('dashicons-remove');
					} else if ($icon.hasClass('dashicons-remove')) {
						$icon.removeClass('dashicons-remove');
						$icon.addClass('dashicons-insert');
					}
				} else {
					accordionContents.each(function () {
						if ($(this).hasClass('aagb__accordion_body--show')) {
							$(this).removeClass('aagb__accordion_body--show');
							$(this).slideUp();
						}
					});

					// accordions
					accordions.each(function () {
						if ($(this).hasClass('aagb__accordion_active')) {
							$(this).removeClass('aagb__accordion_active');
						}
					});

					// icons
					accordionIcons.each(function () {
						if ($(this).hasClass('dashicons-minus')) {
							$(this).removeClass('dashicons-minus');
							$(this).addClass('dashicons-plus-alt2');
						} else if ($(this).hasClass('dashicons-arrow-up')) {
							$(this).removeClass('dashicons-arrow-up');
							$(this).addClass('dashicons-arrow-down');
						} else if (
							$(this).hasClass('dashicons-arrow-up-alt2')
						) {
							$(this).removeClass('dashicons-arrow-up-alt2');
							$(this).addClass('dashicons-arrow-down-alt2');
						} else if ($(this).hasClass('dashicons-dismiss')) {
							$(this).removeClass('dashicons-dismiss');
							$(this).addClass('dashicons-plus-alt');
						} else if ($(this).hasClass('dashicons-remove')) {
							$(this).removeClass('dashicons-remove');
							$(this).addClass('dashicons-insert');
						}
					});
					parent.addClass('aagb__accordion_active');
					panel.addClass('aagb__accordion_body--show');
					panel.slideDown();
					// icons
					if ($icon.hasClass('dashicons-plus-alt2')) {
						$icon.removeClass('dashicons-plus-alt2');
						$icon.addClass('dashicons-minus');
					} else if ($icon.hasClass('dashicons-minus')) {
						$icon.removeClass('dashicons-minus');
						$icon.addClass('dashicons-plus-alt2');
					} else if ($icon.hasClass('dashicons-arrow-down-alt2')) {
						$icon.removeClass('dashicons-arrow-down-alt2');
						$icon.addClass('dashicons-arrow-up-alt2');
					} else if ($icon.hasClass('dashicons-arrow-up-alt2')) {
						$icon.removeClass('dashicons-arrow-up-alt2');
						$icon.addClass('dashicons-arrow-down-alt2');
					} else if ($icon.hasClass('dashicons-arrow-down')) {
						$icon.removeClass('dashicons-arrow-down');
						$icon.addClass('dashicons-arrow-up');
					} else if ($icon.hasClass('dashicons-arrow-up')) {
						$icon.removeClass('dashicons-arrow-up');
						$icon.addClass('dashicons-arrow-down');
					} else if ($icon.hasClass('dashicons-plus-alt')) {
						$icon.removeClass('dashicons-plus-alt');
						$icon.addClass('dashicons-dismiss');
					} else if ($icon.hasClass('dashicons-dismiss')) {
						$icon.removeClass('dashicons-dismiss');
						$icon.addClass('dashicons-plus-alt');
					} else if ($icon.hasClass('dashicons-insert')) {
						$icon.removeClass('dashicons-insert');
						$icon.addClass('dashicons-remove');
					} else if ($icon.hasClass('dashicons-remove')) {
						$icon.removeClass('dashicons-remove');
						$icon.addClass('dashicons-insert');
					}
				}
			});
		});
	});

	// Separate Accordion
	const separateAccordions = $('.aab__accordion_container');
	// console.log(separateAccordions)

	// Keyboard Navigation for Accordion
	separateAccordions.each(function () {
		accordionHead = $(this).find(".aab__accordion_head");

		// Ensure the element is focusable
		accordionHead.attr('tabindex', '0');

		accordionHead.on('keydown', function (e) {
			if (e.key === 'Enter' || e.key === ' '){
				e.preventDefault();
				$(this).click();
			}
		});


	});

	// Keyboard Navigation for Accordion
	groupAccordions.each(function () {
		const accordionHeads = $(this).find('.aagb__accordion_head');

		accordionHeads.each(function(index) {
			const accordionHead = $(this);

			accordionHead.attr('tabindex', '0');
			accordionHead.addClass('aagb__accordion_head--keyboard');

			accordionHead.on('keydown', function (e) {

				if (e.key === 'Enter' || e.key === ' ') {  // Enter or Spacebar
					e.preventDefault();
					accordionHead.click(); // Trigger the click event
				} else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
					e.preventDefault();
					const nextIndex = e.key === 'ArrowUp' ? index - 1 : index + 1;

					const nextHead = accordionHeads.eq(nextIndex);

					if (nextHead.length) {
						nextHead.focus();
					}
				} else if (e.key === 'Home') {
					e.preventDefault();
					accordionHeads.first().focus();
				} else if (e.key === 'End') {
					e.preventDefault();
					accordionHeads.last().focus();
				}
			});


		});
	});

	// hover function js
	if ($('.wp-block-aab-group-accordion.hover').length) {
		const groupAccordions = $('.wp-block-aab-group-accordion.hover');
		groupAccordions.each(function () {
			// accordion head

			const accordionHead = $(this).find('.aagb__accordion_container');
			const accordionContents = $(this).find('.aagb__accordion_body');
			const accordionIcons = $(this).find('.aagb__icon');

			// active accordion
			const activeAccordion = $(this).find('.aagb__accordion_body--show');
			// all accordions
			const accordions = $(this).find('.wp-block-aab-accordion-item');

			// show active accrodion on load
			if (activeAccordion.length) {
				activeAccordion.slideDown();
			}

			// each btn click
			accordionHead.each(function () {
				// click event
				$(this).hover(function () {
					// get parent
					const parent = $(this);
					// get panel
					const panel = parent.children('.aagb__accordion_body');
					// icon
					const $icon = $(this).find('.aagb__icon');

					if (panel.hasClass('aagb__accordion_body--show')) {
						// active class to parent
						parent.removeClass('aagb__accordion_active');
						panel.removeClass('aagb__accordion_body--show');
						panel.slideUp();
						// icons
						if ($icon.hasClass('dashicons-plus-alt2')) {
							$icon.removeClass('dashicons-plus-alt2');
							$icon.addClass('dashicons-minus');
						} else if ($icon.hasClass('dashicons-minus')) {
							$icon.removeClass('dashicons-minus');
							$icon.addClass('dashicons-plus-alt2');
						} else if (
							$icon.hasClass('dashicons-arrow-down-alt2')
						) {
							$icon.removeClass('dashicons-arrow-down-alt2');
							$icon.addClass('dashicons-arrow-up-alt2');
						} else if ($icon.hasClass('dashicons-arrow-up-alt2')) {
							$icon.removeClass('dashicons-arrow-up-alt2');
							$icon.addClass('dashicons-arrow-down-alt2');
						} else if ($icon.hasClass('dashicons-arrow-down')) {
							$icon.removeClass('dashicons-arrow-down');
							$icon.addClass('dashicons-arrow-up');
						} else if ($icon.hasClass('dashicons-arrow-up')) {
							$icon.removeClass('dashicons-arrow-up');
							$icon.addClass('dashicons-arrow-down');
						} else if ($icon.hasClass('dashicons-plus-alt')) {
							$icon.removeClass('dashicons-plus-alt');
							$icon.addClass('dashicons-dismiss');
						} else if ($icon.hasClass('dashicons-dismiss')) {
							$icon.removeClass('dashicons-dismiss');
							$icon.addClass('dashicons-plus-alt');
						} else if ($icon.hasClass('dashicons-insert')) {
							$icon.removeClass('dashicons-insert');
							$icon.addClass('dashicons-remove');
						} else if ($icon.hasClass('dashicons-remove')) {
							$icon.removeClass('dashicons-remove');
							$icon.addClass('dashicons-insert');
						}
					} else {
						accordionContents.each(function () {
							if (
								$(this).hasClass('aagb__accordion_body--show')
							) {
								$(this).removeClass(
									'aagb__accordion_body--show'
								);
								$(this).slideUp();
							}
						});

						// accordions
						accordions.each(function () {
							if ($(this).hasClass('aagb__accordion_active')) {
								$(this).removeClass('aagb__accordion_active');
							}
						});

						// icons
						accordionIcons.each(function () {
							if ($(this).hasClass('dashicons-minus')) {
								$(this).removeClass('dashicons-minus');
								$(this).addClass('dashicons-plus-alt2');
							} else if ($(this).hasClass('dashicons-arrow-up')) {
								$(this).removeClass('dashicons-arrow-up');
								$(this).addClass('dashicons-arrow-down');
							} else if (
								$(this).hasClass('dashicons-arrow-up-alt2')
							) {
								$(this).removeClass('dashicons-arrow-up-alt2');
								$(this).addClass('dashicons-arrow-down-alt2');
							} else if ($(this).hasClass('dashicons-dismiss')) {
								$(this).removeClass('dashicons-dismiss');
								$(this).addClass('dashicons-plus-alt');
							} else if ($(this).hasClass('dashicons-remove')) {
								$(this).removeClass('dashicons-remove');
								$(this).addClass('dashicons-insert');
							}
						});
						parent.addClass('aagb__accordion_active');
						panel.addClass('aagb__accordion_body--show');
						panel.slideDown();
						// icons
						if ($icon.hasClass('dashicons-plus-alt2')) {
							$icon.removeClass('dashicons-plus-alt2');
							$icon.addClass('dashicons-minus');
						} else if ($icon.hasClass('dashicons-minus')) {
							$icon.removeClass('dashicons-minus');
							$icon.addClass('dashicons-plus-alt2');
						} else if (
							$icon.hasClass('dashicons-arrow-down-alt2')
						) {
							$icon.removeClass('dashicons-arrow-down-alt2');
							$icon.addClass('dashicons-arrow-up-alt2');
						} else if ($icon.hasClass('dashicons-arrow-up-alt2')) {
							$icon.removeClass('dashicons-arrow-up-alt2');
							$icon.addClass('dashicons-arrow-down-alt2');
						} else if ($icon.hasClass('dashicons-arrow-down')) {
							$icon.removeClass('dashicons-arrow-down');
							$icon.addClass('dashicons-arrow-up');
						} else if ($icon.hasClass('dashicons-arrow-up')) {
							$icon.removeClass('dashicons-arrow-up');
							$icon.addClass('dashicons-arrow-down');
						} else if ($icon.hasClass('dashicons-plus-alt')) {
							$icon.removeClass('dashicons-plus-alt');
							$icon.addClass('dashicons-dismiss');
						} else if ($icon.hasClass('dashicons-dismiss')) {
							$icon.removeClass('dashicons-dismiss');
							$icon.addClass('dashicons-plus-alt');
						} else if ($icon.hasClass('dashicons-insert')) {
							$icon.removeClass('dashicons-insert');
							$icon.addClass('dashicons-remove');
						} else if ($icon.hasClass('dashicons-remove')) {
							$icon.removeClass('dashicons-remove');
							$icon.addClass('dashicons-insert');
						}
					}
				});
			});
		});
	}

	// accordion autoplay js
	$(document).ready(function () {
		var $item = 0,
			$itemNo = $('.wp-block-aab-group-accordion.autoplay .panel').length;

		function transitionSlide() {
			$item++;
			if ($item >= $itemNo) {
				$item = 0;
			}

			// Reset all panels to initial state
			$('.wp-block-aab-group-accordion.autoplay .panel')
				.removeClass('aagb__accordion_active')
				.find('.aagb__accordion_body')
				.removeClass('aagb__accordion_body--show')
				.slideUp();

			// Activate the current panel
			var $currentPanel = $(
				'.wp-block-aab-group-accordion.autoplay .panel'
			).eq($item);
			$currentPanel.addClass('aagb__accordion_active');
			$currentPanel
				.find('.aagb__accordion_body')
				.addClass('aagb__accordion_body--show')
				.slideDown();

			// Toggle icon classes based on panel state
			// $('.aagb__icon').removeClass('dashicons-minus').addClass('dashicons-plus-alt2');

			if ($currentPanel.hasClass('aagb__accordion_active')) {
				$currentPanel
					.find('.aagb__icon')
					.removeClass('dashicons-plus-alt2')
					.addClass('dashicons-minus');
			}
		}

		var $autoTransition = setInterval(transitionSlide, 2000);

		$('.wp-block-aab-group-accordion.autoplay .panel').click(function () {
			clearInterval($autoTransition);
			$item = $(this).index();
			$('.wp-block-aab-group-accordion.autoplay .panel').removeClass(
				'aagb__accordion_active'
			);
			$(this).addClass('aagb__accordion_active');
			$('.aagb__accordion_body')
				.removeClass('aagb__accordion_body--show')
				.slideUp();
			$(this)
				.find('.aagb__accordion_body')
				.addClass('aagb__accordion_body--show')
				.slideDown();
			$autoTransition = setInterval(transitionSlide, 3500);
		});
	});

	// accordion autoplay js

	$('.content-accordion__show-all').on('click', function (e) {
		e.preventDefault();
		$('.aagb__accordion_body')
			.addClass('aagb__accordion_body--show')
			.slideDown();
		$('.aagb__icon')
			.removeClass('dashicons-plus-alt2')
			.addClass('dashicons-minus');
		$('.panel').addClass('aagb__accordion_active');
	});
	$('.content-accordion__close-all').on('click', function (e) {
		e.preventDefault();
		$('.aagb__accordion_body')
			.removeClass('aagb__accordion_body--show')
			.slideUp();
		$('.aagb__icon')
			.removeClass('dashicons-minus')
			.addClass('dashicons-plus-alt2');
		$('.panel').removeClass('aagb__accordion_active');
	});

	$('.noEnterSubmit').keypress(function (e) {
		if (e.which == 13) e.preventDefault();
	});

	var $form = $('#aagb-search-form');
	var $helpBlock = $('#aagb-search-help-block');

	//Watch for user typing to refresh the filter
	$('#aagb-search-id').keyup(function () {
		var filter = $(this).val();
		$form.removeClass('has-success has-error');

		if (filter == '') {
			$helpBlock.text('Nothing found');
			$('.searchable .panel').show();
		} else {
			//Close any open panels
			$('.collapse.in').removeClass('in');

			//Hide questions, will show result later
			$('.searchable .panel').hide();

			var regex = new RegExp(filter, 'i');

			var filterResult = $('.searchable .panel').filter(function () {
				return regex.test($(this).text());
			});

			if (filterResult) {
				if (filterResult.length != 0) {
					$form.addClass('has-success');
					$helpBlock.text(
						filterResult.length + ' question(s) found.'
					);
					filterResult.show();
				} else {
					$form.addClass('has-error').removeClass('has-success');
					$helpBlock.text('No questions found.');
				}
			} else {
				$form.addClass('has-error').removeClass('has-success');
				$helpBlock.text('No questions found.');
			}
		}
	});




})(jQuery);




