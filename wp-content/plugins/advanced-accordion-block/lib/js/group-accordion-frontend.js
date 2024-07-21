/* eslint-disable no-undef */
(function ($) {
// Steps
    const accordionItems = $('.wp-block-aab-accordion-item.aagb__accordion_container.step');
    if(accordionItems.length){

        const accordionCompletionStatus= {};
        const accordionStatusCookie = JSON.parse( getCookie('aab-accordion-completion-status') );


        // every accordion item
        $.each(accordionItems, function(index, item){
            const accordionHead = $(item).find('.aagb__accordion_head');
            const accordionBody = $(item).find('.aagb__accordion_body');
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
                }

                if(allAccordionsCompleted(accordionCompletionStatus, accordionItems)) {
                    $(".wp-block-aab-group-accordion").append('<span class="step-result">Congratulations, you are done!</span>');
                }

            }else{
                accordionCompletionStatus[index] = false;
            }


            accordionBodyContinue.on('click', function(){
                completeSign.show();
                accordionHead.click();
                accordionCompletionStatus[index] = true;
                aagbIcon.hide();
                accordionBodyContinue.hide();

                setCookie('aab-accordion-completion-status', JSON.stringify(accordionCompletionStatus), 30);

                if(allAccordionsCompleted(accordionCompletionStatus, accordionItems)) {
                    $(".wp-block-aab-group-accordion").append('<span class="step-result">Congratulations, you are done!</span>');
                }else{

                    let nextIndex = index + 1;

                    while (nextIndex < accordionItems.length) {
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
            });

        })

    }


    // Select and modify last accordion item
    const lastAccordionItem = accordionItems.last();
    const lastAccordionItemStepText = lastAccordionItem.find('.step-text'); // Select the content of the last accordion item



    if (lastAccordionItemStepText.length > 0) { // Check if the last child element exists
        lastAccordionItemStepText.text("End"); // Change its text content
    }


    function allAccordionsCompleted(status, items) {
        for (let i = 0; i < items.length; i++) {
            if (!status[i]) {
                return false;
            }
        }
        return true;
    }

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

