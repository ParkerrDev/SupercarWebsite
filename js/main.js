document.addEventListener('alpine:init', () => {
    Alpine.directive('include', (el, { expression }) => {
        const templatePath = expression.replace(/['"]/g, ''); // Remove quotes if present
        fetch(templatePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load template: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                el.outerHTML = html;
            })
            .catch(error => {
                console.error('Template loading error:', error);
                el.outerHTML = `<div class="error">Failed to load template</div>`;
            });
    });
}); 

// Audio Functionality
let hasPlayed = false;
function playAudioOnce() {
    if (!hasPlayed) {
        const audio = document.getElementById("audio");
        if (audio) {
            audio.currentTime = 30;
            audio.play();
            hasPlayed = true;
        }
    }
}

// Button Animation Function
function initializeButtonAnimations() {
    const handleMouseMove = (ev) => {
        // Query for buttons on each move to ensure we catch all of them
        const all = document.querySelectorAll(".button-red");
        if (all.length > 0) {
            all.forEach((e) => {
                // Check if button is in viewport
                const rect = e.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const blob = e.querySelector(".blob");
                    const fblob = e.querySelector(".fakeblob");
                    if (blob && fblob) {
                        const rec = fblob.getBoundingClientRect();
                        blob.style.opacity = "1";

                        blob.animate(
                            [{
                                transform: `translate(${(ev.clientX - rec.left) - (rec.width / 2)}px,${(ev.clientY - rec.top) - (rec.height / 2)}px)`
                            }],
                            {
                                duration: 300,
                                fill: "forwards"
                            }
                        );
                    }
                }
            });
        }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", () => {
        handleMouseMove({ clientX: 0, clientY: 0 }); // Reset positions
    });
}

// Listen for Alpine navigation events
document.addEventListener('alpine:navigated', () => {
    initializeButtonAnimations();
});

document.addEventListener('DOMContentLoaded', () => {
    initializeButtonAnimations();
});

// Wait for Alpine to initialize
document.addEventListener('alpine:init', () => {
    // Initialize cart store globally
    Alpine.store('cart', {
        cartOpen: false,
        cartItems: JSON.parse(localStorage.getItem('cartItems')) || {
            men: [],
            women: [],
            children: []
        },

        addToCart(name, price, image, type) {
            const existingItem = this.cartItems[type].find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.cartItems[type].push({
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }
            this.cartOpen = true;
            this.saveToLocalStorage();
        },

        removeFromCart(type, index) {
            this.cartItems[type].splice(index, 1);
            this.saveToLocalStorage();
        },

        updateQuantity(type, index, change) {
            this.cartItems[type][index].quantity = Math.max(1, this.cartItems[type][index].quantity + change);
            this.saveToLocalStorage();
        },

        clearCart() {
            this.cartItems = {
                men: [],
                women: [],
                children: []
            };
            this.saveToLocalStorage();
        },

        getTotal() {
            return Object.values(this.cartItems).reduce((total, typeItems) => {
                return total + typeItems.reduce((typeTotal, item) => typeTotal + (item.price * item.quantity), 0);
            }, 0).toFixed(2);
        },

        getCategoryTotal(type) {
            return this.cartItems[type].reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
        },

        hasItems() {
            return Object.values(this.cartItems).some(typeItems => typeItems.length > 0);
        },

        saveToLocalStorage() {
            localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        }
    });

    // Initialize Alpine data and stores
    Alpine.data('mainData', () => ({
        init() {
            // Dropdown Menu Handling
            let dropdowns = document.querySelectorAll("a:has(~ ul.dropdown)");
            if (dropdowns.length > 0) {
                dropdowns.forEach(function (elem) {
                    elem.addEventListener("mouseleave", unfocus);
                });
            }

            // Expandable List Handling
            const itemHeaders = document.querySelectorAll('.item-header');
            if (itemHeaders.length > 0) {
                itemHeaders.forEach(header => {
                    header.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const listItem = header.closest('.list-item');
                        if (!listItem) return;

                        const isTopLevel = listItem.parentElement?.classList.contains('expandable-list');

                        if (isTopLevel) {
                            // Close other top-level items
                            document.querySelectorAll('.expandable-list > .list-item').forEach(item => {
                                if (item !== listItem) {
                                    item.classList.remove('active');
                                    const itemHeader = item.querySelector('.item-header');
                                    if (itemHeader) itemHeader.classList.remove('expanded');
                                    const subList = item.querySelector('.sub-list');
                                    if (subList) {
                                        subList.classList.remove('expanded');
                                        subList.style.display = 'none';
                                    }
                                }
                            });

                            // Toggle current item
                            listItem.classList.toggle('active');
                            if (listItem.classList.contains('active')) {
                                header.classList.remove('expanded');
                            } else {
                                header.classList.add('expanded');
                            }
                        }

                        // Handle sub-items
                        const subList = header.nextElementSibling;
                        if (subList) {
                            header.classList.toggle('expanded');
                            subList.classList.toggle('expanded');
                            subList.style.display = subList.classList.contains('expanded') ? 'block' : 'none';
                        }
                    });
                });
            }
        },
        scrollCarousel(direction) {
            const carousel = document.querySelector('.carousel');
            const scrollAmount = 300; // Width of one product card
            
            if (direction === 'left') {
                carousel.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    }));
});

function unfocus(event) {
    event.target.blur();
}

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