
// Preloader

window.addEventListener('load', function(){
    document.querySelector('.preloader').classList.add('opacity-0');
    setTimeout(function(){
        document.querySelector('.preloader').style.display = 'none';
    }, 1000);
});

// iTyped with fallback

const iTypedElement = document.querySelector('.iTyped');
if (iTypedElement && typeof window.ityped !== 'undefined') {
    try {
        window.ityped.init(iTypedElement, {
            strings: ["Data Science", 'AI', 'Machine Learning'],
            loop: true
        });
    } catch (error) {
        console.warn('iTyped initialization failed, using fallback text');
        // Fallback text is already in HTML
    }
} else if (iTypedElement) {
    // If iTyped library is not loaded, ensure fallback text is visible
    if (!iTypedElement.textContent.trim()) {
        iTypedElement.textContent = 'Data Science';
    }
}

// Portfolio Item Filter

const filterContainer = document.querySelector('.portfolio-filter');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterContainer && portfolioItems.length) {
    const filterBtns = Array.from(filterContainer.children);

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', function(){
            const activeBtn = filterContainer.querySelector('.active');
            if (activeBtn) {
                activeBtn.classList.remove('active');
            }
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');
            portfolioItems.forEach((item) => {
                const matchesCategory = filterValue === item.getAttribute('data-category') || filterValue === 'all';
                item.classList.toggle('show', matchesCategory);
                item.classList.toggle('hide', !matchesCategory);
            });
        });
    });
}

// Portfolio Lighbox

const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
const lightboxText = lightbox ? lightbox.querySelector('.caption-text') : null;
const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
const lightboxCounter = lightbox ? lightbox.querySelector('.caption-counter') : null;

let itemIndex = 0;

if (lightbox && lightboxImg && lightboxText && lightboxCounter && portfolioItems.length) {
    portfolioItems.forEach((item, index) => {
        item.addEventListener('click', function(){
            itemIndex = index;
            changeItem();
            toggleLightbox();
        });
    });

    function toggleLightbox() {
        lightbox.classList.toggle('open');
    }

    function changeItem() {
        const portfolioImage = portfolioItems[itemIndex].querySelector('.portfolio-img img');
        if (!portfolioImage) {
            return;
        }

        const imgSrc = portfolioImage.getAttribute('src');
        lightboxImg.src = imgSrc;
        lightboxText.innerHTML = portfolioItems[itemIndex].querySelector('h4').innerHTML;
        lightboxCounter.innerHTML = (itemIndex + 1) + " of " + portfolioItems.length;
    }

    function prevItem() {
        if (itemIndex === 0) {
            itemIndex = portfolioItems.length - 1;
        } else {
            itemIndex--;
        }
        changeItem();
    }

    function nextItem() {
        if (itemIndex === portfolioItems.length - 1) {
            itemIndex = 0;
        } else {
            itemIndex++;
        }
        changeItem();
    }

    // close lightbox

    lightbox.addEventListener('click', function(event){
        if(event.target === lightboxClose || event.target === lightbox){
            toggleLightbox();
        }
    });

    // Expose navigation functions if needed elsewhere
    window.prevItem = prevItem;
    window.nextItem = nextItem;
}

// Aside Navbar

const nav = document.querySelector('.nav');
const navList = nav ? Array.from(nav.querySelectorAll('li')) : [];
const allSection = document.querySelectorAll('.section');

if (nav && navList.length && allSection.length) {
    const totalSection = allSection.length;

    navList.forEach((item) => {
        const link = item.querySelector('a');
        if (!link) return;

        link.addEventListener('click', function(){
            // remove back section class
            removeBackSectionClass();

            navList.forEach((navItem, index) => {
                const navLink = navItem.querySelector('a');
                if (!navLink) return;
                if (navLink.classList.contains('active')) {
                    // add back section class
                    addBackSectionClass(index);
                }
                navLink.classList.remove('active');
            });

            this.classList.add('active');

            showSection(this);

            // Save current section to localStorage
            const target = this.getAttribute('href').split('#')[1];
            localStorage.setItem('currentSection', target);

            if (window.innerWidth < 1200) {
                asideSectionTogglerBtn();
            }

        });
    });

    function addBackSectionClass(num)
    {
        allSection[num].classList.add('back-section');
    }

    function removeBackSectionClass()
    {
        allSection.forEach((section) => section.classList.remove('back-section'));
    }

    function showSection(element)
    {
        allSection.forEach((section) => section.classList.remove('active'));

        const target = element.getAttribute('href').split('#')[1];
        const section = document.querySelector('#' + target);
        if (section) {
            section.classList.add('active');
        }
    }

    // Restore last viewed section on page load
    function restoreLastSection() {
        const savedSection = localStorage.getItem('currentSection');
        if (savedSection) {
            const targetSection = document.querySelector('#' + savedSection);
            const targetNavLink = document.querySelector(`.nav a[href="#${savedSection}"]`);

            if (targetSection && targetNavLink) {
                // Remove active from all sections and nav links
                allSection.forEach(section => section.classList.remove('active'));
                navList.forEach(item => {
                    const navLink = item.querySelector('a');
                    if (navLink) {
                        navLink.classList.remove('active');
                    }
                });

                // Activate saved section and nav link
                targetSection.classList.add('active');
                targetNavLink.classList.add('active');
            }
        }
    }

    // Call restore function when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        restoreLastSection();
    });

    const navTogglerBtn = document.querySelector('.nav-toggler'),
        aside = document.querySelector('.aside');

    if (navTogglerBtn && aside) {
        navTogglerBtn.addEventListener('click', asideSectionTogglerBtn);
    }

    function asideSectionTogglerBtn()
    {
        aside.classList.toggle('open');
        navTogglerBtn.classList.toggle('open');
        for (let i = 0; i < totalSection; i++) {
            allSection[i].classList.toggle('open');
        }
    }
}

// Blog loading is now handled by blog-manager.js
