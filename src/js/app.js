import Alpine from 'alpinejs';

// Modules
import {bodyOverflowHidden, bodyOverflowVisible} from "./modules/utilities.js";

document.documentElement.classList.remove('no-js');

// Alpine init
document.addEventListener('alpine:init', () => {
    Alpine.store('page', {
        mobileMode: false,
        showHamburgerMenu: false,
        pagedScrolled: false,

        init() {
            this.mobileMode = window.innerWidth < 1024;
        },
        resized() {
            this.mobileMode = window.innerWidth < 1024;

            if (!this.mobileMode && this.showHamburgerMenu)
                this.toggleHamburgerMenu();
        },
        scrolled() {
            this.pagedScrolled = window.scrollY >= 50;
        },
        toggleHamburgerMenu() {
            this.showHamburgerMenu = !this.showHamburgerMenu;

            if (this.showHamburgerMenu)
                bodyOverflowHidden();
            else
                bodyOverflowVisible();
        }
    });

    Alpine.data('nav', () => ({
        init() {

        }
    }));
});

window.addEventListener('load', function () {
    document.querySelector('#page-preload').classList.remove('active');
});

// Start alpine
window.Alpine = Alpine;
Alpine.start();
