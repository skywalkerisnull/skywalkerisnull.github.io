(function ($) {
    'use strict';

    $(document).ready(function () {


        $('.feedback-btn-wrap').each(function () {
            const $feedbackWrap = $(this);
            const feedbackId = $feedbackWrap.data('id');


            $.ajax({
                url: feedbackAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'get_votes',
                    feedbackId: feedbackId,
                    nonce: feedbackAjax.nonce
                },
                success: function (response) {
                    if (response.success) {
                        $feedbackWrap.find('button[data-value="yes"] .count').text(response.data.yes);
                        $feedbackWrap.find('button[data-value="no"] .count').text(response.data.no);

                        // Update button states if user has voted
                        if (response.data.userVote) {
                            $feedbackWrap.find('.feedback-btn').removeClass('active');
                            $feedbackWrap.find(`button[data-value="${response.data.userVote}"]`).addClass('active');
                        }
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX test failed:', {
                        status: status,
                        error: error,
                        response: xhr.responseText
                    });
                }
            });
        });

        // Handle feedback button click
        $('.feedback-btn').on('click', function () {
            const $button = $(this);
            const $feedbackWrap = $button.closest('.feedback-btn-wrap');
            const feedbackId = $feedbackWrap.data('id');
            const voteValue = $button.data('value');
            // Get the vote identifier (either user ID or the cookie-based identifier)
            var voteIdentifier = getVoteIdentifier(); // Function to get the identifier


            $.ajax({
                url: feedbackAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'handle_vote',
                    feedbackId: feedbackId,
                    voteValue: voteValue,
                    uniqueIdentifier: voteIdentifier, // Send the unique identifier
                    nonce: feedbackAjax.nonce
                },
                success: function (response) {
                    if (response.success) {
                        // Update vote counts
                        $('body').append(
                            '<div class="aab-feedback-thankyou">Thank you for your feedback!</div>'
                        );
                        setTimeout(function () {
                            $('.aab-feedback-thankyou').hide();
                        }, 1000);

                        $feedbackWrap.find('button[data-value="yes"] .count').text(response.data.counts.yes);
                        $feedbackWrap.find('button[data-value="no"] .count').text(response.data.counts.no);

                        // Update button states
                        $feedbackWrap.find('.feedback-btn').removeClass('active');
                        $button.addClass('active');
                    } else {
                        $('body').append(
                            '<div class="aab-feedback-thankyou">You have already voted.</div>'
                        );
                        setTimeout(function () {
                            $('.aab-feedback-thankyou').hide();
                        }, 1000);
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr.responseText);
                },
                complete: function () {
                    // Re-enable buttons
                    $feedbackWrap.find('.feedback-btn').prop('disabled', false);
                }
            });

        });

// Helper function to get the vote identifier
        function getVoteIdentifier() {
            // If the user is logged in, the identifier could be the user ID (set it in PHP and localized in js)
            if (typeof feedbackAjax.user_id !== 'undefined' && feedbackAjax.user_id !== 0) {
                return feedbackAjax.user_id;
            }
            // Otherwise, if not logged in, use the cookie value
            var voteIdentifier = getCookie('aab_vote_identifier');
            return voteIdentifier;
        }

// Function to get cookie value
        function getCookie(name) {
            var value = '; ' + document.cookie;
            var parts = value.split('; ' + name + '=');
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
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
    $('.aab__accordion_container.separate-accordion').each(function () {
        const accordionContainer = $(this);
        const accordionHeads = accordionContainer.find('.aab__accordion_head');

        accordionHeads.each(function (index) {
            const accordionHead = $(this);

            // Add tabindex and class for keyboard accessibility
            accordionHead.attr('tabindex', '0');
            accordionHead.addClass('aab__accordion_head--keyboard');

            // Handle keydown events for keyboard navigation and interaction
            accordionHead.on('keydown', function (e) {
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        accordionHead.click(); // Trigger the click event
                        break;
                }
            });

            // Add class to the container when focus is on the accordion head
            accordionHead.on('focus', function () {
                accordionContainer.addClass('keyboard-active');
            });

            // Remove class from the container when focus is lost
            accordionHead.on('blur', function () {
                accordionContainer.removeClass('keyboard-active');
            });
        });
    });

})(jQuery);