/* eslint-disable no-undef */
(function ($) {


    // genereate unique id
    const groupAccordions = $(".wp-block-aab-group-accordion");
    let id = 0;


    // step
    $.each(groupAccordions, function (index, item) {
        const accordionId = $(item).attr('id');
        const parentDiv = $(`#${accordionId}`);

        const accordionItems = $(parentDiv).children('.wp-block-aab-accordion-item.aagb__accordion_container.step');

        const accordionCompletionStatus = {};
        const accordionStatusCookie = JSON.parse(getCookie(`aab-completion-status-${accordionId}`));

        $.each(accordionItems, function (index, accordionItem) {
            const accordionHead = $(accordionItem).children('.aagb__accordion_head');
            const accordionBody = $(accordionItem).children('.aagb__accordion_body');
            const accordionBodyContinue = $(accordionBody).children('.continue');
            const completeSign = $(accordionHead).find('.complete-sign');
            const aagbIcon = $(accordionHead).find('.aagb__icon');


            /* cookie work's here */
            if (accordionStatusCookie !== null) {
                accordionCompletionStatus[index] = accordionStatusCookie[index] || false;
                if (accordionCompletionStatus[index]) {
                    completeSign.show();
                    aagbIcon.hide();
                    accordionBodyContinue.hide();

                    if (allAccordionsCompleted(accordionCompletionStatus, accordionItems)) {
                        $("#" + accordionId).find('> .step-result').css('display', 'block');
                    } else {
                        $("#" + accordionId).find('> .step-result').hide();
                    }
                }
            } else {
                accordionCompletionStatus[index] = false;
            }

            accordionBodyContinue.on('click', function (e) {
                completeSign.show();
                accordionHead.click();
                accordionCompletionStatus[index] = true;
                aagbIcon.hide();
                accordionBodyContinue.hide();
                setCookie('aab-completion-status-' + accordionId, JSON.stringify(accordionCompletionStatus), 30);

                if (allAccordionsCompleted(accordionCompletionStatus, accordionItems)) {
                    $("#" + accordionId).find('> .step-result').css('display', 'block');
                } else {
                    let nextIndex = index + 1;

                    while (nextIndex < accordionItems.length) {
                        if (!accordionCompletionStatus[nextIndex]) {
                            accordionItems.eq(nextIndex).find("> .aagb__accordion_head").click();
                            break;
                        }
                        nextIndex++;
                    }

                    if (nextIndex >= accordionItems.length) {
                        nextIndex = 0;
                        while (nextIndex < index) {
                            if (!accordionCompletionStatus[nextIndex]) {
                                accordionItems.eq(nextIndex).find('> .aagb__accordion_head').click();
                                break;
                            }
                            nextIndex++;
                        }
                    }
                }
            })
        })

        // Select and modify last accordion item
        const lastAccordionItem = accordionItems.last();
        const lastAccordionItemStepText = lastAccordionItem.find('> .aagb__accordion_body').children('.continue').find('.step-text'); // Select the content of the last accordion item


        if (lastAccordionItemStepText.length > 0) { // Check if the last child element exists
            lastAccordionItemStepText.text("End"); // Change its text content
        }

        // Check list
        const accordionCheckListItems = $(parentDiv).children('.wp-block-aab-accordion-item.aagb__accordion_container.check-list');

        if (accordionCheckListItems.length) {
            let checklistItems = [];
            const checklistItemsCookie = JSON.parse(getCookie(`aab-checklist-status-${accordionId}`));

            if (checklistItemsCookie !== null) {
                checklistItems = checklistItemsCookie;
            }

            $.each(accordionCheckListItems, function (index, item) {

                const checklistBox = $(item).find('> .aagb__accordion_head  .checklist-box');
                const aagb__accordion_title = $(item).find('> .aagb__accordion_head .aagb__accordion_title');
                let isChecked = false;
                if (checklistItemsCookie == null) {
                    const checklistItemsObj = {[`${index}`]: false};
                    checklistItems.push(checklistItemsObj);
                } else {
                    $.each(checklistItems, function (checklistItemsIndex, checklistItem) {

                        if (index === checklistItemsIndex) {
                            if (checklistItem[checklistItemsIndex] === true) {
                                checklistBox.prop('checked', true);
                                aagb__accordion_title.toggleClass('line-through');
                            }
                        }
                    });

                }

                checklistBox.change(function () {
                    aagb__accordion_title.toggleClass('line-through');
                    isChecked = checklistBox.is(':checked');

                    checklistItems[index] = {[`${index}`]: isChecked};

                    setCookie('aab-checklist-status-' + accordionId, JSON.stringify(checklistItems), 30);

                });
            });
        }
        // end of check list


    })


    function allAccordionsCompleted(status, items) {
        for (let i = 0; i < items.length; i++) {
            if (!status[i]) {
                return false;
            }
        }
        return true;
    }


    // Read More button
    // Set the maximum number of characters to display initially


    $(".aagb__accordion_component.read-more-btn").each(function () {
        const textMax = $(this).data('contentcount');
        const paragraph = $(this).find("p:first");
        const fullText = paragraph.text();
        if (paragraph.text().length > textMax) {
            const slicedText = fullText.slice(0, textMax);
            paragraph.text(slicedText + '...').show();

            paragraph.data("full-text", fullText);

            $(this).children().not(paragraph).not('.aagb_overlay').fadeOut();

            $(this).siblings(".aagb_button_toggle").click(function (e) {
                e.preventDefault();
                paragraph.text(fullText).slideDown("slow");
                $(this).closest(".aagb__accordion_body").find(".aagb__accordion_component").children().not(paragraph).not('.aagb_overlay').fadeIn();
                $(this).fadeOut("slow");
                $(this).closest(".aagb__accordion_body").find(".aagb_overlay").fadeOut().removeClass("aagb_overlay");
            });
        } else {
            $(this).siblings(".aagb_button_toggle").remove();
            $(this).closest(".aagb__accordion_body").find(".aagb_overlay").remove();
        }

    });

    //End of Read More button

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }


    if ($('.wp-block-aab-group-accordion').length) {
        $(".wp-block-aab-group-accordion").each(function () {

            var filterButtons = $(this).find("> .aab-filter-button-group button");
            var allButton = $(this).find('> .aab-filter-button-group .cat_all_item'); // Select the "All" button
            var targetItems = $(this).find('> .wp-block-aab-accordion-item');

            filterButtons.on('click', function () {
                let filterValue = $(this).data('filter');

                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    allButton.addClass('active');
                    targetItems.show(); // Show all items
                } else {
                    // Remove active from all buttons and activate clicked button
                    filterButtons.removeClass('active');
                    $(this).addClass('active');

                    // Show/Hide items based on filter
                    targetItems.hide();
                    targetItems.filter('.' + filterValue).show();

                    // Deactivate "All" button when a category is active
                    allButton.removeClass('active');
                }
            });

            // "All" button functionality
            allButton.on('click', function () {
                // Activate "All" and deactivate all category buttons
                filterButtons.removeClass('active');
                $(this).addClass('active');

                // Show all items
                targetItems.show();
            });

            // Initially activate "All" button
            allButton.addClass('active');
        });
    }


})(jQuery);

