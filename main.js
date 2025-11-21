import { LANGUAGE_DATA } from './language_data.js';

// Global variable declarations
const html = document.documentElement;

const carouselControlLeft = document.querySelector('#slide-carousel-left');
const carouselControlRight = document.querySelector('#slide-carousel-right');
const homepage = document.querySelector('#homepage');
const homepageHeading = document.querySelector('#homepage-heading');
const languageButtons = document.querySelectorAll('.lang-button');
const languageDropdown = document.querySelector('#lang-dropdown');
const languageDropdownToggle = document.querySelector('#lang-dropdown-toggle');
const languageToggleWrapper = document.querySelector('.lang-toggle-wrapper');
const modifiableTextElements = document.querySelectorAll('[data-i18n]');
const navbar = document.querySelector('#navbar');
const navDropdownToggle = document.querySelector('.nav-dropdown-toggle');
const navLinks = document.querySelectorAll('.nav-menu a');
const navMenu = document.querySelector('.nav-menu');
const projectCarousel = document.querySelector('#project-carousel');

const mql = window.matchMedia('(min-aspect-ratio: 14/10)');

let siteLang;

// Function declarations
function init() {
    const savedLang = localStorage.getItem('lang') || 'en';
    const initialLang = savedLang || (navigator.language.startsWith('ja') ? 'jp' : 'en');

    updateSiteLanguage(initialLang);
    updateHomepageFormatting(mql);

    html.classList.remove('hidden');
    html.style.setProperty('--navbar-height', navbar.offsetHeight + 'px');
}

function updateSiteLanguage(lang) {
    siteLang = lang;

    updateTextContent(lang);
    updateSiteFonts(lang);
    updateLanguageButtons(lang);
    updateHomepageFormatting(mql);

    html.style.setProperty('--navbar-height', navbar.offsetHeight + 'px');
}

function updateTextContent(lang) {
    modifiableTextElements.forEach(el => {
        const newValue = getNestedValue(LANGUAGE_DATA[lang], el.dataset.i18n);

        if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
            if (el.hasAttribute('data-has-inner-html')) {
                el.innerHTML = newValue;
            } else {
                el.textContent = newValue;
            }
        }

        if (el.hasAttribute('placeholder')) {
            el.setAttribute('placeholder', newValue)
        }
    });
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function updateSiteFonts(lang) {
    html.style.setProperty('--font-family-base', lang === 'jp' ? '"Noto Sans JP", sans-serif' : '"Raleway", sans-serif');
    html.style.setProperty('--font-family-heading', lang === 'jp' ? '"Noto Sans JP", sans-serif' : '"Lexend Deca", sans-serif');
    html.style.setProperty('--font-family-homepage-subheading', lang === 'jp' ? '"Noto Sans JP", sans-serif' : '"JetBrains Mono", monospace');

    html.style.setProperty('--font-size-homepage-subheading', lang === 'jp' ? '0.27em' : '0.168em');
    
    html.style.setProperty('--font-weight-regular', lang === 'jp' ? '325' : '400');
    html.style.setProperty('--font-weight-heavy', lang === 'jp' ? '400' : '500');
    html.style.setProperty('--font-weight-heading', lang === 'jp' ? '400' : '300');

    homepage.classList.toggle('jp', lang === 'jp');
    homepage.classList.toggle('en', lang !== 'jp');
}

function updateHomepageFormatting(event) {
    if (event.matches) {
        homepage.classList.add('wide');
        homepageHeading.innerHTML = siteLang === 'jp' ? 'サム・マクレーネン' : 'Sam McLennan';
    } else {
        homepage.classList.remove('wide');
        homepageHeading.innerHTML = siteLang === 'jp' ? 'サム・<br>マクレーネン' : 'Sam<br>McLennan';
    }
}

function updateLanguageButtons(lang) {
    languageButtons.forEach(button => {
        const checkIcon = button.querySelector('.checkmark');
        checkIcon.classList.toggle('invisible', button.dataset.lang !== lang);
    });
}

function getScrollAmount() {
    const carouselSlide = document.querySelector('.carousel-slide');
    const gap = parseFloat(window.getComputedStyle(projectCarousel).gap);

    return carouselSlide.getBoundingClientRect().width + gap;
}

// Event listeners
window.addEventListener('click', (event) => {
    if (!languageToggleWrapper.contains(event.target)) {
        languageDropdownToggle.classList.remove('active');
        languageDropdown.classList.add('hidden');
    }

    if (!navbar.contains(event.target)) {
        navMenu.classList.remove('show');
        navDropdownToggle.classList.remove('active');
    }
});

languageDropdownToggle.addEventListener('click', () => {
    languageDropdownToggle.classList.toggle('active');
    languageDropdown.classList.toggle('hidden');
});

languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.dataset.lang;
        updateSiteLanguage(lang);
        localStorage.setItem('lang', lang);
        languageDropdownToggle.classList.remove('active');
        languageDropdown.classList.add('hidden');
    });
});

navDropdownToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    navDropdownToggle.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        navDropdownToggle.classList.remove('active');
    });
});

carouselControlLeft.addEventListener('click', () => {
    projectCarousel.scrollBy({
        left: -getScrollAmount(),
        behavior: 'smooth',
    });
});

carouselControlRight.addEventListener('click', () => {
    projectCarousel.scrollBy({
        left: getScrollAmount(),
        behavior: 'smooth',
    });
});

mql.addEventListener('change', updateHomepageFormatting);

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('load', () => {
    alert(`Aspect ratio: ${window.innerWidth / window.innerHeight}`);
});