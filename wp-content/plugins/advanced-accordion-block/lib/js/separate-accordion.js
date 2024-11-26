(function ($) {
	'use strict';

	$(document).ready(function () {
		// Initialize counters based on stored cookies
		$('.feedback-btn-wrap').each(function () {
			const $wrap = $(this);
			const feedbackId = $wrap.data('id');
			const yesCount = getCookie(`voted_${feedbackId}_yes`) || 0;
			const noCount = getCookie(`voted_${feedbackId}_no`) || 0;
			const userVote = getCookie(`voted_${feedbackId}`);

			$wrap.find('button[data-value="yes"] .count').text(yesCount);
			$wrap.find('button[data-value="no"] .count').text(noCount);

			if (userVote) {
				$wrap.find(`button[data-value="${userVote}"]`).addClass('active');
			}
		});
	
		// Handle feedback button click
		$('.feedback-btn').on('click', function () {
			const $button = $(this);
			const $feedbackWrap = $button.closest('.feedback-btn-wrap');
			const feedbackId = $feedbackWrap.data('id');
			const voteValue = $button.data('value');
			const cookieName = `voted_${feedbackId}`;
			const countCookieName = `voted_${feedbackId}_${voteValue}`;
			
	
			// Check if user has already voted
			const existingVote = getCookie(cookieName);
			if (existingVote) {
				$('body').append(
					'<div class="aagb-feedback-thankyou">You have already voted.</div>'
				);
				setTimeout(function () {
					$('.aagb-feedback-thankyou').hide();
				}, 1000);
				return;
			}
			// add class active
			$button.addClass('active');
            // Remove active class from other buttons
            $feedbackWrap.find('.feedback-btn').not($button).removeClass('active');
	
			// Set cookie for the vote
			setCookie(cookieName, voteValue); // Vote valid for 7 days
	
			// Update the count and store it in a cookie
			const $countSpan = $button.find('.count');
			const currentCount = parseInt($countSpan.text(), 10) || 0;
			const newCount = currentCount + 1;
			$countSpan.text(newCount);
			setCookie(countCookieName, newCount); // Store the updated count
	
			// Disable other buttons
			// $feedbackWrap.find('.feedback-btn').prop('disabled', true);
	
			$('body').append(
				'<div class="aagb-feedback-thankyou">Thank you for your feedback!</div>'
			);
			setTimeout(function () {
				$('.aagb-feedback-thankyou').hide();
			}, 1000);

		});
	
		// Cookie utility functions
		function getCookie(name) {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i].trim();
				if (cookie.startsWith(name + '=')) {
					return cookie.substring(name.length + 1);
				}
			}
			return null;
		}
	
		function setCookie(name, value) {
			// Permanent cookie with no expiration (lasts until manually deleted)
			document.cookie = name + '=' + value + '; path=/';
		}
	});	

	// show body on click head
	$(document).on('click', '.aab__accordion_head', function () {
		const $this = $(this);
		const $parent = $this.parent();
		const $icon = $this
			.children('.aab__accordion_icon')
			.children('.aab__icon');
		const $body = $parent.children('.aab__accordion_body');

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
		// toggle body
		$body.slideToggle();

		// adding active class
		$($this).toggleClass('active');
	});


	// Keyboard Navigation for Accordion
	$('.aab__accordion_container.separate-accordion').each(function() {
		const accordionContainer = $(this);
		const accordionHeads = accordionContainer.find('.aab__accordion_head');

		accordionHeads.each(function(index) {
			const accordionHead = $(this);

			// Add tabindex and class for keyboard accessibility
			accordionHead.attr('tabindex', '0');
			accordionHead.addClass('aab__accordion_head--keyboard');

			// Handle keydown events for keyboard navigation and interaction
			accordionHead.on('keydown', function(e) {
				switch (e.key) {
					case 'Enter':
					case ' ':
						e.preventDefault();
						accordionHead.click(); // Trigger the click event
						break;
				}
			});

			// Add class to the container when focus is on the accordion head
			accordionHead.on('focus', function() {
				accordionContainer.addClass('keyboard-active');
			});

			// Remove class from the container when focus is lost
			accordionHead.on('blur', function() {
				accordionContainer.removeClass('keyboard-active');
			});
		});
	});

})(jQuery);