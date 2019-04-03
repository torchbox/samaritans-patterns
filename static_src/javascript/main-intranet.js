import 'babel-polyfill';

import MobileMenu from './components/mobile-menu';
import MobileSubMenu from './components/mobile-sub-menu';
import CookieWarning from './components/cookie-message';
import Accordion from './components/accordion';
import Carousel from './components/carousel';
import ProgressBar from './components/progress-bar';
import HeaderMenu from './components/header-menu';
import Feedback from './components/feedback';
import SearchToggle from './components/search-toggle';

document.addEventListener('DOMContentLoaded', function() {
    const cookie = document.querySelector(CookieWarning.selector());
    new CookieWarning(cookie);

    for (const accordion of document.querySelectorAll(Accordion.selector())) {
        new Accordion(accordion);
    }

    for (const carousel of document.querySelectorAll(Carousel.selector())) {
        new Carousel(carousel);
    }

    for (const mobilemenu of document.querySelectorAll(MobileMenu.selector())) {
        new MobileMenu(mobilemenu);
    }

    for (const mobilesubmenu of document.querySelectorAll(MobileSubMenu.selector())) {
        new MobileSubMenu(mobilesubmenu);
    }

    for (const feedback of document.querySelectorAll(Feedback.selector())) {
        new Feedback(feedback);
    }

    // Toggle subnav visibility
    for (const subnavBack of document.querySelectorAll('.js-subnav-back')) {
        subnavBack.addEventListener('click', () => {
            subnavBack.parentNode.classList.remove('is-visible');
        });
    }

    for (const progressbar of document.querySelectorAll(ProgressBar.selector())) {
        new ProgressBar(progressbar);
    }

    for (const headermenu of document.querySelectorAll(HeaderMenu.selector())) {
        new HeaderMenu(headermenu);
    }

    for (const searchtoggle of document.querySelectorAll(SearchToggle.selector())) {
        new SearchToggle(searchtoggle);
    }

});
