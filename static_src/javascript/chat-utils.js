document.addEventListener('DOMContentLoaded', function() {
    var api_url = JSON.parse(document.getElementById('webchat_api_url').textContent);
    if(!api_url) {
        // Bail if we don't have an API URL. The default template content for CTAs will
        // report that the service is not available.
        return;
    }

    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === window.XMLHttpRequest.DONE) {
            if(xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if(data['active']) {

                    let waitMinutes = data['wait_time']/60;
                    let status = 'Estimated wait time: ';
                    if (waitMinutes <= 10 ) {
                        status += 'up to 10 minutes';
                    } else {
                        let baseTime = Math.ceil(waitMinutes/5) * 5;
                        status += `${(baseTime - 5)} - ${(baseTime + 5)} minutes`;
                    }

                    // There can be several chat CTAs on the same page - primary, sticky, and tabccordion
                    var ctas = document.querySelectorAll('.listening-cta--type-chat__dynamic, .tabccordion__cta--type-chat, .service-block--sticky__type-chat');
                    for (var cta of ctas) {
                        for(var waitTimeNode of cta.querySelectorAll('.listening-cta__wait-time')) {
                            waitTimeNode.innerText = status;
                        }

                        if (cta.tagName === 'A') {
                            let href = cta.getAttribute('data-href');
                            if(href) {
                                cta.setAttribute('href', href);
                            }
                        }
                        for(var chevron of cta.querySelectorAll('.listening-cta__chevron')) {
                            chevron.style.display = 'inline-block';
                        }

                        // Add hrefs to all links, populating from data-href attributes
                        for(var anchor of cta.querySelectorAll('a')) {
                            let href = anchor.getAttribute('data-href');
                            if(href) {
                                anchor.setAttribute('href', href);
                            }
                        }
                    }
                }
            }
        }
    };
    xhr.open('GET', api_url);
    xhr.timeout = 2000;
    xhr.send();
});
