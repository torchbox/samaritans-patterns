import 'babel-polyfill';
import './polyfills/foreach-polyfill';
import './polyfills/remove-polyfill';

import Autocomplete from './components/autocomplete';
import MobileMenu from './components/mobile-menu';
import MobileSubMenu from './components/mobile-sub-menu';
import Accordion from './components/accordion';
import Carousel from './components/carousel';
import GoogleMap from './components/map';
import Modal from './components/modal';
import ProgressBar from './components/progress-bar';
import RegionField from './components/region-field';
import StickyCTA from './components/sticky-cta';
import Tabccordion from './components/tabccordion';
import Toggle from './components/toggle';
import HeaderMenu from './components/header-menu';
import Gallery from './components/gallery';
import VideoModal from './components/video-modal';
import SelectAllCheckboxToggle from './components/select-all-checkbox-toggle';
import sendTagManagerEvents from './components/tag-manager';
import Beta from './components/beta';
import DonateUsage from './components/donate-usage';
import GiftAid from './components/gift-aid';
import Reveal from './components/reveal';
import Considerations from './components/considerations';
import './components/browser-polyfills';
import './components/smooth-scroll';
import './components/branch-finder';
import './components/volunteering-branch-finder';
import initiMobileNumberAutocomplete from './components/mobile-number-autocomplete';
import initMobileNumberField from './components/mobile-number-field';
import initDonationSliders from './components/donate-slider';
import { initInterviewPicker } from './components/InterviewPicker/InterviewPicker';
import initialiseHideIfCheckedElement from './components/hide-if-checked';
import TrainingCourse from './components/training-course';
import { disableFormAfterSubmit } from './components/disable-button-after-submit';
import './components/referee-details';
import GenderReveal from './components/gender-reveal';
import GdprFields from './components/gdpr-fields';
import { formErrorScroll } from './components/form-error-scroll';
import DonateDynamicButton from './components/donate-dynamic-button';
import Totaliser from './components/totaliser/totaliser';
import { toggleLeaderboard } from './components/leaderboard';


document.addEventListener('DOMContentLoaded', function () {
    for (const accordion of document.querySelectorAll(Accordion.selector())) {
        new Accordion(accordion);
    }

    for (const autocomplete of document.querySelectorAll(
        Autocomplete.selector(),
    )) {
        new Autocomplete(autocomplete);
    }

    for (const carousel of document.querySelectorAll(Carousel.selector())) {
        new Carousel(carousel);
    }

    for (const trainingcourse of document.querySelectorAll(
        TrainingCourse.selector(),
    )) {
        new TrainingCourse(trainingcourse);
    }

    for (const googlemap of document.querySelectorAll(GoogleMap.selector())) {
        new GoogleMap(googlemap);
    }

    for (const mobilemenu of document.querySelectorAll(MobileMenu.selector())) {
        new MobileMenu(mobilemenu);
    }

    for (const modal of document.querySelectorAll(Modal.selector())) {
        new Modal(modal);
    }

    for (const mobilesubmenu of document.querySelectorAll(
        MobileSubMenu.selector(),
    )) {
        new MobileSubMenu(mobilesubmenu);
    }

    for (const progressbar of document.querySelectorAll(
        ProgressBar.selector(),
    )) {
        new ProgressBar(progressbar);
    }

    for (const regionfield of document.querySelectorAll(
        RegionField.selector(),
    )) {
        new RegionField(regionfield);
    }

    for (const stickycta of document.querySelectorAll(StickyCTA.selector())) {
        new StickyCTA(stickycta);
    }

    for (const tabccordion of document.querySelectorAll(
        Tabccordion.selector(),
    )) {
        new Tabccordion(tabccordion);
    }

    for (const toggle of document.querySelectorAll(Toggle.selector())) {
        new Toggle(toggle);
    }

    for (const headermenu of document.querySelectorAll(HeaderMenu.selector())) {
        new HeaderMenu(headermenu);
    }

    for (const gallery of document.querySelectorAll(Gallery.selector())) {
        new Gallery(gallery);
    }

    for (const gdprField of document.querySelectorAll(GdprFields.selector())) {
        new GdprFields(gdprField);
    }

    for (const inputblock of document.querySelectorAll(
        SelectAllCheckboxToggle.selector(),
    )) {
        new SelectAllCheckboxToggle(inputblock);
    }

    for (const beta of document.querySelectorAll(Beta.selector())) {
        new Beta(beta);
    }

    for (const donateusage of document.querySelectorAll(
        DonateUsage.selector(),
    )) {
        new DonateUsage(donateusage);
    }

    for (const giftaid of document.querySelectorAll(GiftAid.selector())) {
        new GiftAid(giftaid);
    }

    for (const videomodal of document.querySelectorAll(VideoModal.selector())) {
        new VideoModal(videomodal);
    }

    initiMobileNumberAutocomplete();
    initMobileNumberField();

    for (const reveal of document.querySelectorAll(Reveal.selector())) {
        new Reveal(reveal);
    }

    for (const considerations of document.querySelectorAll(
        Considerations.selector(),
    )) {
        new Considerations(considerations);
    }

    // Initialise and configure donation amount sliders.
    initDonationSliders();

    sendTagManagerEvents();

    for (const hideIfCheckedElement of document.querySelectorAll(
        '.js-hide-if-checked',
    )) {
        const hideCheckbox = document.querySelector(
            hideIfCheckedElement.dataset.targetToWatchForHiding,
        );
        const showCheckbox = document.querySelector(
            hideIfCheckedElement.dataset.targetToWatchForShowing,
        );
        initialiseHideIfCheckedElement({
            element: hideIfCheckedElement,
            hideCheckbox,
            showCheckbox,
        });
    }

    for (const genderreveal of document.querySelectorAll(
        GenderReveal.selector(),
    )) {
        new GenderReveal(genderreveal);
    }
    initInterviewPicker();

    formErrorScroll();

    Array.from(
        document.querySelectorAll('form[data-js-disable-button-after-submit]'),
    ).forEach((formElement) => disableFormAfterSubmit(formElement));

    for (const donatedynamicbutton of document.querySelectorAll(
        DonateDynamicButton.selector(),
    )) {
        new DonateDynamicButton(donatedynamicbutton);
    }

    for (const totaliser of document.querySelectorAll(
        Totaliser.selector(),
    )) {
        new Totaliser(totaliser);
    }

    toggleLeaderboard(document.querySelector('[data-leaderboard-toggle]'))
});
