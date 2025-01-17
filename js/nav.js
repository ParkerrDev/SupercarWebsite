document.addEventListener('alpine:init', () => {
    Alpine.store('nav', {
        isOpen: false,
        toggle() {
            this.isOpen = !this.isOpen;
            const sideMenu = document.getElementById('side-menu');
            const blurOverlay = document.getElementById('blur-overlay');
            const body = document.body;

            if (sideMenu && blurOverlay) {
                if (this.isOpen) {
                    sideMenu.classList.add('open');
                    blurOverlay.classList.add('active');
                    body.classList.add('no-scroll');
                } else {
                    sideMenu.classList.remove('open');
                    blurOverlay.classList.remove('active');
                    body.classList.remove('no-scroll');
                }
            }
        }
    });
});

function navData() {
    return {
        isOpaque: false,
        get currentPage() {
            const path = window.location.pathname;
            return path.split('/').pop().replace('.html', '');
        },
        get isModelPage() {
            const modelPages = ['nemesis', 'black-widow', 'configurator'];
            return modelPages.includes(this.currentPage);
        },
        init() {
            // Initial check
            this.isOpaque = window.scrollY > 2;

            // Handle scroll opacity
            window.addEventListener('scroll', () => {
                this.isOpaque = window.scrollY > 2;
                const navbar = document.getElementById('navbar');
                if (navbar) {
                    if (this.isOpaque) {
                        navbar.classList.add('opaque');
                    } else {
                        navbar.classList.remove('opaque');
                    }
                }
            });

            // Handle dropdown padding
            const nav = document.querySelector('header nav');
            if (nav) {
                nav.querySelectorAll('ul li').forEach(li => {
                    const subList = li.querySelector('ul');
                    if (subList) {
                        li.addEventListener('mouseenter', () => {
                            if (this.isOpaque) {
                                const itemCount = subList.querySelectorAll('li').length;
                                document.querySelectorAll('.opaque').forEach(element => {
                                    element.style.paddingBottom = `${itemCount * 1.5}rem`;
                                });
                            }
                        });

                        li.addEventListener('mouseleave', () => {
                            if (this.isOpaque) {
                                document.querySelectorAll('.opaque').forEach(element => {
                                    element.style.paddingBottom = '';
                                });
                            }
                        });
                    }
                });
            }

            // Setup blur overlay click handler
            const blurOverlay = document.getElementById('blur-overlay');
            if (blurOverlay) {
                blurOverlay.addEventListener('click', () => Alpine.store('nav').toggle());
            }
        }
    }
}
