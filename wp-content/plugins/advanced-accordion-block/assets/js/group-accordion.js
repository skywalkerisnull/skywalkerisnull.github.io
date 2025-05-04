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

    for(const cls of classList) {
        for(const [collapsedCls, expandedCls] of iconToggleMap) {
            if(collapsedCls === cls || expandedCls === cls) {
                const targetCls = {
                    expand: collapsedCls,
                    collapse: expandedCls
                }[target];

                $icon.removeClass(cls);
                $icon.addClass(targetCls)
                return;
            }
        }
    }
}

function stickToTheSamePlace ($accordion, stopAfter = 500) {
    if(window.innerWidth >= 756) return;

    const accordionPosition = $accordion[0]?.getBoundingClientRect().top || 0;

    const intervalId = setInterval(() => {
        const accordionOffset = $accordion.offset().top;
        const scrollTo = accordionOffset - accordionPosition;
        window.scrollTo({ top: scrollTo });
    }, 5)

    setTimeout(() => {
        clearInterval(intervalId);
    }, stopAfter)
}

const $groupAccordions = $('.wp-block-aab-group-accordion');

$groupAccordions.each(function () {
    const $groupAccordion = $(this);
    const $accordions = $groupAccordion.find('> .wp-block-aab-accordion-item');
    const $accordionHeads = $accordions.find('> .aagb__accordion_head');
    const $accordionIcons = $accordionHeads.find('.aagb__icon');
    const $accordionBodies = $accordions.find('> .aagb__accordion_body');

    const activatorEvent = $groupAccordion.hasClass('hover') ? 'mouseenter' : 'click';

    $accordionBodies.each(function() {
        const $accordionBody = $(this);
        const isActive = $accordionBody.hasClass('aagb__accordion_body--show');
        if(isActive) $accordionBody.slideDown();
    })

    $accordionHeads.on(activatorEvent, function () {
        const $accordionHead = $(this);
        const $accordion = $accordionHead.parent();
        const $accordionBody = $accordion.find('.aagb__accordion_body');
        const $accordionIcon = $accordionHead.find('.aagb__icon');

        const isActive = $accordionBody.hasClass('aagb__accordion_body--show');
        stickToTheSamePlace($accordion);

        if (isActive) {
            $accordion.removeClass('aagb__accordion_active');
            $accordionHead.removeClass('active');
            $accordionBody.removeClass('aagb__accordion_body--show')
            toggleIcon($accordionIcon, 'expand');

            $accordionBody.slideUp();
        } else {
            $accordionHeads.removeClass('active');
            $accordionBodies.removeClass('aagb__accordion_body--show');
            $accordionBodies.slideUp();
            $accordions.removeClass('aagb__accordion_active');

            $accordionIcons.each(function() {
                toggleIcon($(this), 'expand');
            })
            toggleIcon($accordionIcon, 'collapse');

            $accordionHead.addClass('active');
            $accordion.addClass('aagb__accordion_active');
            $accordionBody.addClass('aagb__accordion_body--show');
            $accordionBody.slideDown();
        }
    });

    $accordions.each(function (index) {
        const $accordion = $(this);

        $accordion.addClass('aagb__accordion_head--keyboard');
        $accordion.on('keydown', function (e) {
            const $accordion = $(this);
            const $focused = $(document.activeElement);
            if(!$focused.is($accordion)) return;

            if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault();
                $accordion.find('> .aagb__accordion_head').trigger(activatorEvent)
            } else if (/^Arrow(Up|Down|Left|Right)$/.test(e.code)) {
                e.preventDefault();
                const nextIndex = index + {
                    ArrowUp: -1,
                    ArrowLeft: -1,
                    ArrowDown: +1,
                    ArrowRight: +1,
                }[e.code];
                const nextHead = $accordions.eq(nextIndex);

                if (nextHead.length) {
                    nextHead.focus();
                }
            } else if (e.code === 'Home') {
                e.preventDefault();
                $accordions.first().focus();
            } else if (e.code === 'End') {
                e.preventDefault();
                $accordions.last().focus();
            }
        });
    });
});

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
    var targetAccordion = $(`.` + $(this).data("opentarget"));
    targetAccordion.find($('.aagb__accordion_body'))
        .addClass('aagb__accordion_body--show')
        .slideDown();
    targetAccordion.find('.panel').addClass('aagb__accordion_active');
    targetAccordion.find('.hasSubHeading').addClass('active');

    // icon
    const $icon = targetAccordion.find('.aagb__accordion_heading .aagb__icon');

    if ($icon.hasClass('dashicons-plus-alt2')) {
        $icon.removeClass('dashicons-plus-alt2');
        $icon.addClass('dashicons-minus');
    } else if ($icon.hasClass('dashicons-arrow-down-alt2')) {
        $icon.removeClass('dashicons-arrow-down-alt2');
        $icon.addClass('dashicons-arrow-up-alt2');
    } else if ($icon.hasClass('dashicons-arrow-down')) {
        $icon.removeClass('dashicons-arrow-down');
        $icon.addClass('dashicons-arrow-up');
    } else if ($icon.hasClass('dashicons-plus-alt')) {
        $icon.removeClass('dashicons-plus-alt');
        $icon.addClass('dashicons-dismiss');
    } else if ($icon.hasClass('dashicons-insert')) {
        $icon.removeClass('dashicons-insert');
        $icon.addClass('dashicons-remove');
    }
});
$('.content-accordion__close-all').on('click', function (e) {
    e.preventDefault();
    var targetAccordion = $(`.` + $(this).data("closetarget"));
    targetAccordion.find($('.aagb__accordion_body'))
        .removeClass('aagb__accordion_body--show')
        .slideUp();
    targetAccordion.find('.panel').removeClass('aagb__accordion_active');
    targetAccordion.find('.hasSubHeading').removeClass('active');


    const $icon = targetAccordion.find('.aagb__accordion_heading .aagb__icon');

    if ($icon.hasClass('dashicons-minus')) {
        $icon.removeClass('dashicons-minus');
        $icon.addClass('dashicons-plus-alt2');
    } else if ($icon.hasClass('dashicons-arrow-up-alt2')) {
        $icon.removeClass('dashicons-arrow-up-alt2');
        $icon.addClass('dashicons-arrow-down-alt2');
    } else if ($icon.hasClass('dashicons-arrow-up')) {
        $icon.removeClass('dashicons-arrow-up');
        $icon.addClass('dashicons-arrow-down');
    } else if ($icon.hasClass('dashicons-dismiss')) {
        $icon.removeClass('dashicons-dismiss');
        $icon.addClass('dashicons-plus-alt');
    } else if ($icon.hasClass('dashicons-remove')) {
        $icon.removeClass('dashicons-remove');
        $icon.addClass('dashicons-insert');
    }
});

$('.noEnterSubmit').keypress(function (e) {
    if (e.which == 13) e.preventDefault();
});

// Checklist
const accordionItemsChecklist = $('.aagb__accordion_container.check-list');

if (accordionItemsChecklist.length) {
    $.each(accordionItemsChecklist, function (index, item) {
        const accordionHeading = $(item).children('.aagb__accordion_head').find('.aagb__accordion_heading');
        accordionHeading.prepend("<input type='checkbox' class='checklist-box'></input>")
    });
}

})(jQuery);