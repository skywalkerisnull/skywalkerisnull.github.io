/* eslint-disable no-undef */
(function ($) {
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
            const $stepResult = $("#" + accordionId).find('> .step-result');


            /* cookie work's here */
            if (accordionStatusCookie !== null) {
                accordionCompletionStatus[index] = accordionStatusCookie[index] || false;
                if (accordionCompletionStatus[index]) {
                    completeSign.show();
                    aagbIcon.hide();
                    accordionBodyContinue.hide();
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
                 updateProgressBasedOnActiveSection(accordionId, parentDiv.find("#progressBarFill"));
                if (allAccordionsCompleted(accordionCompletionStatus, accordionItems)) {
                    $stepResult.css('display', 'block');
                    setTimeout(() => {
                        $stepResult.hide();
                    }, 5000)

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
                    // checklist completion status 
                        const checklistStatus = {};
                        checklistItems.forEach((item, idx) => {
                            checklistStatus[idx] = item[idx];
                        });
                         updateProgressBasedOnActiveSection(accordionId, parentDiv.find("#progressBarFill"));

                });
            });
        }
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
            const $groupAccordion = $(this);
            const $accordionItems = $groupAccordion.find('> .wp-block-aab-accordion-item');
            const $searchContainer = $groupAccordion.find('> .aagb_form_inner');
            const $search = $searchContainer.find('> .aagb_form_group .aagb-search-control');
            const $searchHelp = $searchContainer.find('> .help-block');
            const $searchWrapperBtn = $groupAccordion.find('> .aagb_accordion_wrapper_btn');
            const $showMoreBtn = $groupAccordion.find('> .aab-show-more-btn-container .show-more-btn');
            const $showLessBtn = $groupAccordion.find('> .aab-show-more-btn-container .show-less-btn');

            let itemsPerClick = Number($showMoreBtn.data('items-to-show'));
            let itemsToShow = itemsPerClick;
            let filterClass = '';
            let searchTxt = '';

            $search.on('input', function () {
                searchTxt = $search.val();
                loadAccordions();
            });

            function loadAccordions() {
                let _targetItems = $accordionItems;
                _targetItems.hide();
                
                if (filterClass) _targetItems = _targetItems.filter(`.${filterClass}`);
                
                $searchContainer.removeClass('has-success has-error');
                $groupAccordion?.unmark?.();
                $searchHelp.hide();

                if(searchTxt) {
                    $searchHelp.show();

                    _targetItems = _targetItems.filter(function() {
                        return $(this).text()?.toLowerCase().includes(searchTxt.toLowerCase());
                    });

                    if(_targetItems.length) {
                        $searchHelp.text(`${_targetItems.length} question(s) found.`);
                        $searchContainer.addClass('has-success');
                        _targetItems?.mark?.(searchTxt);
                        $searchWrapperBtn.show();
                    } else {
                        $searchContainer.addClass('has-error');
                        $searchHelp.text('No questions found.');
                        $searchWrapperBtn.hide();
                    }
                }

                $showMoreBtn.parent()?.show();

                // if not greater than zero, all accordions are shown (covers the case of showMoreBtn feature not being activated)
                if (itemsToShow > 0) {
                    let loaded = 0;
                    _targetItems.each(function () {
                        $(this).hide();

                        if (loaded < itemsToShow) {
                            $(this).show();
                            loaded++;
                        }
                    });

                    if(loaded >= _targetItems.length) {
                        $showMoreBtn.hide();

                        $showLessBtn.show(0, function () {
                            $(this).css("display", "flex");
                        });
                        $showLessBtn.parent()?.css("background-color", "#ffffff00");

                        if(loaded <= itemsPerClick) $showMoreBtn.parent()?.hide();
                    } else {
                        $showMoreBtn.show();
                        $showLessBtn.hide();
                    }
                } else { // show-more-btn feature is not activated (or invalid items-per-click value)
                    _targetItems.show();
                    $showMoreBtn?.parent()?.hide();
                }
                
            }

            var filterButtons = $(this).find('> .aab-filter-button-group button');
            var allButton = $(this).find('> .aab-filter-button-group .cat_all_item'); // Select the "All" button

            filterButtons.on('click', function () {
                filterClass = $(this).data('filter');

                filterButtons.removeClass('active');
                allButton.removeClass('active');
                $(this).addClass('active');

                loadAccordions();
            });

            allButton.on('click', function () {
                filterButtons.removeClass('active');
                $(this).addClass('active');
                filterClass = '';
                loadAccordions();
            });

            // Initially activate "All" button, and load accordions
            allButton.click();
            loadAccordions();

            $showMoreBtn.on('click', function () {
                itemsToShow += itemsPerClick;
                loadAccordions();
                $showLessBtn.focus();
            });

            $showLessBtn.on('click', function () {
                itemsToShow = itemsPerClick;
                loadAccordions();
                $showMoreBtn.focus();
            });
        });
    }
   
    // Update progress bar based on active section 
    function updateProgressBasedOnActiveSection(accordionId, $progressBarFill) {
		const $groupAccordion = $('#' + accordionId);
		const $stepAccordionItems = $groupAccordion.children(
			'.wp-block-aab-accordion-item.aagb__accordion_container.step'
		);
		const $checklistAccordionItems = $groupAccordion.children(
			'.wp-block-aab-accordion-item.aagb__accordion_container.check-list'
		);
		const $progressText = $groupAccordion.find('.aab-progress-text');

		let completedCount = 0,
			totalCount = 0,
			percentage = 0;

		if ($stepAccordionItems.length && $stepAccordionItems.is(':visible')) {
			const stepStatus = JSON.parse(
				getCookie(`aab-completion-status-${accordionId}`) || '{}'
			);
			totalCount = $stepAccordionItems.length;
			for (let i = 0; i < totalCount; i++)
				if (stepStatus[i]) completedCount++;
		} else if (
			$checklistAccordionItems.length &&
			$checklistAccordionItems.is(':visible')
		) {
			const checklistStatus = JSON.parse(
				getCookie(`aab-checklist-status-${accordionId}`) || '[]'
			);
			totalCount = $checklistAccordionItems.length;
			for (let i = 0; i < totalCount; i++)
				if (checklistStatus[i] && checklistStatus[i][i])
					completedCount++;
		}

		percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

		// Only update THIS progress bar
		$progressBarFill.css('width', `${percentage}%`);
		$progressText.text(`${Math.round(percentage)}%`);
		setCookie(`aab-progress-${accordionId}`, percentage, 30);
	}

	/* ================================
       INIT ON PAGE LOAD
    ==================================*/
	$(document).ready(function () {
		$('.wp-block-aab-group-accordion').each(function () {
			const accordionId = $(this).attr('id');
			updateProgressBasedOnActiveSection(
				accordionId,
				$(this).find('#progressBarFill')
			);
		});
	});

})(jQuery);