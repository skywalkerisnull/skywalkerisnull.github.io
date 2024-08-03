/* eslint-disable no-undef */
(function ($) {
    // genereate unique id
    const groupAccordions=  $(".wp-block-aab-group-accordion");
    let id = 0;

   $.each(groupAccordions, function(index, item) {
       id++;
       $(item).attr('id', 'group-accordion-' + id)
    })

    // step
    $.each(groupAccordions, function(index, item) {
        const accordionId = $(item).attr('id');
        const parentDiv = $(`#${accordionId}`)
        const accordionItems = $(parentDiv).find('.wp-block-aab-accordion-item.aagb__accordion_container.step');

        const accordionCompletionStatus= {};
        const accordionStatusCookie = JSON.parse( getCookie(`aab-accordion-completion-status-${accordionId}`) );


        $.each(accordionItems, function (index, accordionItem){
            const accordionHead = $(accordionItem).find('.aagb__accordion_head');
            const accordionBody = $(accordionItem).find('.aagb__accordion_body');
            const accordionBodyContinue = $(accordionBody).find('.continue');
            const completeSign = $(accordionHead).find('#complete-sign');
            const aagbIcon = $(accordionHead).find('.aagb__icon');


            /* cookie work's here */
            if(accordionStatusCookie !== null){
                accordionCompletionStatus[index] = accordionStatusCookie[index] || false;

                if(accordionCompletionStatus[index]){
                    completeSign.show();
                    aagbIcon.hide();
                    accordionBodyContinue.hide();


                    if(allAccordionsCompleted(accordionCompletionStatus, accordionItems)) {
                         $("#" + accordionId).append('<span class="step-result">Congratulations, you are done!</span>');
                    }
                }
            }else{
                accordionCompletionStatus[index] = false;
            }

            accordionBodyContinue.on('click', function(e){
                completeSign.show();
                accordionHead.click();
                accordionCompletionStatus[index] = true;
                aagbIcon.hide();
                accordionBodyContinue.hide();

                setCookie('aab-accordion-completion-status-' + accordionId , JSON.stringify(accordionCompletionStatus), 30);

                if(allAccordionsCompleted(accordionCompletionStatus, accordionItems)) {
                    $("#" + accordionId).append('<span class="step-result">Congratulations, you are done!</span>');
                }else{
                    let nextIndex = index + 1;
                    console.log(index, nextIndex)

                    while(nextIndex < accordionItems.length){
                        if (!accordionCompletionStatus[nextIndex]) {
                            accordionItems.eq(nextIndex).find(".aagb__accordion_head").click();
                            break;
                        }
                        nextIndex++;
                    }

                    if (nextIndex >= accordionItems.length) {
                        nextIndex = 0;
                        while (nextIndex < index) {
                            if (!accordionCompletionStatus[nextIndex]) {
                                accordionItems.eq(nextIndex).find('.aagb__accordion_head').click();
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
        const lastAccordionItemStepText = lastAccordionItem.find('.step-text'); // Select the content of the last accordion item



        if (lastAccordionItemStepText.length > 0) { // Check if the last child element exists
            lastAccordionItemStepText.text("End"); // Change its text content
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


    // Check list
    const accordionCheckListItems = $('.wp-block-aab-accordion-item.aagb__accordion_container.check-list');

    if(accordionCheckListItems.length) {

        let checklistItems = [];
        const checklistItemsCookie = JSON.parse( getCookie('aab-accordion-check-list-status') );


        if(checklistItemsCookie !== null){
            checklistItems = checklistItemsCookie;
        }

        $.each(accordionCheckListItems, function(index, item) {
            const aagb__accordion_head = $(item).find('.aagb__accordion_head');
            const aagb__accordion_heading = $(item).find('.aagb__accordion_heading');
            const checklistBox = $(item).find('.checklist-box');
            const aagb__accordion_title = $(item).find('.aagb__accordion_title');
            let isChecked = false;


            if(checklistItemsCookie == null){
                const checklistItemsObj = {[`${index}`]: false};
                checklistItems.push(checklistItemsObj);
            }else{
                $.each(checklistItems, function(checklistItemsIndex, checklistItem) {

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

                setCookie('aab-accordion-check-list-status', JSON.stringify(checklistItems), 30);



            });

        });


    }


    // end of check list

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');

        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
})(jQuery);

