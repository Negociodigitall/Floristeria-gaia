/* ============================================
   FLORISTERÍA Y BISUTERÍA GAIA - JAVASCRIPT
   VERSIÓN COMPLETA
   ============================================ */

'use strict';

/* ===== VARIABLES GLOBALES ===== */
let cart = [];
let currentSlide = 0;
let currentTestimonio = 0;
let currentLightboxIndex = 0;
let lightboxImages = [];
let heroAutoPlay;
let testimonioAutoPlay;
let statsAnimated = false;
let counterAnimated = false;

/* ===== INICIALIZACIÓN PRINCIPAL ===== */
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initParticles();
    initCustomCursor();
    initNavbar();
    initHeroSlider();
    initSmoothScroll();
    initRevealAnimations();
    initCatalogFilter();
    initTestimoniosSlider();
    initLightbox();
    initContactForm();
    initCartSystem();
    initScrollTop();
    initCounterAnimations();
    initLazyLoading();
    loadCartFromStorage();
    detectReducedMotion();
    handleImageErrors();
    console.log('%c🌸 Floristería y Bisutería Gaia', 'color: #e91e8c; font-size: 20px; font-weight: bold;');
    console.log('%cNicoya, Guanacaste | Tel: 8926-5555', 'color: #9c27b0; font-size: 14px;');
});

/* ============================================
   LOADER
   ============================================ */
function initLoader() {
    document.body.classList.add('loading');
    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) {
                loader.classList.add('hidden');
                document.body.classList.remove('loading');
                animateHeroStats();
            }
        }, 2500);
    });

    // Fallback por si la página tarda mucho
    setTimeout(() => {
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
        }
    }, 5000);
}

/* ============================================
   PARTÍCULAS DE FONDO
   ============================================ */
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const emojis = ['🌸', '🌹', '🌺', '💐', '🌷', '✨', '💎', '⭐', '🌿', '🍃'];
    const particleCount = window.innerWidth > 768 ? 20 : 8;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, emojis);
    }
}

function createParticle(container, emojis) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const startX    = Math.random() * 100;
    const duration  = 15 + Math.random() * 20;
    const delay     = Math.random() * 15;
    const size      = 0.8 + Math.random() * 1.2;

    particle.style.cssText = `
        left: ${startX}%;
        animation-duration: ${duration}s;
        animation-delay: -${delay}s;
        font-size: ${size}rem;
    `;

    container.appendChild(particle);
}

/* ============================================
   CURSOR PERSONALIZADO
   ============================================ */
function initCustomCursor() {
    if (window.innerWidth <= 768) return;

    const cursor   = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    // Animación suave del follower con requestAnimationFrame
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top  = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Efecto hover en elementos interactivos
    const hoverElements = document.querySelectorAll(
        'a, button, .producto-card, .servicio-card, .galeria-item, .filter-btn, input, textarea, select'
    );

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });

    // Ocultar cursor al salir de la ventana
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity  = '0';
        follower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity  = '1';
        follower.style.opacity = '0.6';
    });
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');
    const navLinks  = document.querySelectorAll('.nav-link');

    if (!navbar) return;

    // Efecto scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }, { passive: true });

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow =
                navMenu.classList.contains('open') ? 'hidden' : '';
        });
    }

    // Cerrar menú al hacer click en un link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu)   navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('open') && !navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop    = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId     = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* ============================================
   HERO SLIDER
   ============================================ */
function initHeroSlider() {
    const slides  = document.querySelectorAll('.hero-slide');
    const dots    = document.querySelectorAll('#heroDots .dot');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');

    if (!slides.length) return;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    // Botones de navegación
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetHeroAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetHeroAutoPlay(); });

    // Dots de navegación
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => { goToSlide(index); resetHeroAutoPlay(); });
    });

    // Auto play
    function startHeroAutoPlay() {
        heroAutoPlay = setInterval(nextSlide, 5000);
    }

    function resetHeroAutoPlay() {
        clearInterval(heroAutoPlay);
        startHeroAutoPlay();
    }

    startHeroAutoPlay();

    // Soporte Touch / Swipe
    let touchStartX = 0;
    let touchEndX   = 0;
    const heroSection = document.querySelector('.hero');

    if (heroSection) {
        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
                resetHeroAutoPlay();
            }
        }, { passive: true });
    }

    // Pausar al hacer hover
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(heroAutoPlay));
        heroSection.addEventListener('mouseleave', startHeroAutoPlay);
    }
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target   = document.querySelector(targetId);

            if (target) {
                const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
                const targetPos = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   REVEAL ANIMATIONS (Intersection Observer)
   ============================================ */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   CATÁLOGO FILTER
   ============================================ */
function initCatalogFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productos  = document.querySelectorAll('.producto-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botón activo
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            let visibleCount = 0;

            productos.forEach((producto, index) => {
                const category = producto.dataset.category;
                const matches  = filter === 'all' || category === filter;

                if (matches) {
                    producto.classList.remove('hidden');
                    producto.style.animationDelay = `${visibleCount * 0.08}s`;
                    producto.style.animation = 'none';
                    // Forzar reflow para reiniciar animación
                    void producto.offsetWidth;
                    producto.style.animation = 'cardIn 0.5s ease forwards';
                    visibleCount++;
                } else {
                    producto.classList.add('hidden');
                }
            });

            showToast(`Mostrando: ${btn.textContent.trim()}`, 'info', '🔍');
        });
    });
}

/* ============================================
   TESTIMONIOS SLIDER
   ============================================ */
function initTestimoniosSlider() {
    const cards   = document.querySelectorAll('.testimonio-card');
    const dots    = document.querySelectorAll('#testDots .dot');
    const prevBtn = document.getElementById('testPrev');
    const nextBtn = document.getElementById('testNext');

    if (!cards.length) return;

    function goToTestimonio(index) {
        cards[currentTestimonio].classList.remove('active');
        if (dots[currentTestimonio]) dots[currentTestimonio].classList.remove('active');

        currentTestimonio = (index + cards.length) % cards.length;

        cards[currentTestimonio].classList.add('active');
        if (dots[currentTestimonio]) dots[currentTestimonio].classList.add('active');
    }

    function resetTestAutoPlay() {
        clearInterval(testimonioAutoPlay);
        testimonioAutoPlay = setInterval(() => goToTestimonio(currentTestimonio + 1), 4500);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        goToTestimonio(currentTestimonio - 1);
        resetTestAutoPlay();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        goToTestimonio(currentTestimonio + 1);
        resetTestAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToTestimonio(index);
            resetTestAutoPlay();
        });
    });

    // Auto play
    testimonioAutoPlay = setInterval(() => {
        goToTestimonio(currentTestimonio + 1);
    }, 4500);

    // Soporte swipe en móvil
    const slider = document.getElementById('testimoniosSlider');
    if (slider) {
        let touchStartX = 0;
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                diff > 0
                    ? goToTestimonio(currentTestimonio + 1)
                    : goToTestimonio(currentTestimonio - 1);
                resetTestAutoPlay();
            }
        }, { passive: true });
    }
}

/* ============================================
   LIGHTBOX
   ============================================ */
function initLightbox() {
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const prevBtn     = document.getElementById('lightboxPrev');
    const nextBtn     = document.getElementById('lightboxNext');

    // Recopilar todas las imágenes de la galería
    document.querySelectorAll('.galeria-item img').forEach(img => {
        lightboxImages.push(img.src);
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentLightboxIndex =
                (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
            updateLightboxImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentLightboxIndex =
                (currentLightboxIndex + 1) % lightboxImages.length;
            updateLightboxImage();
        });
    }

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                currentLightboxIndex =
                    (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
                updateLightboxImage();
                break;
            case 'ArrowRight':
                currentLightboxIndex =
                    (currentLightboxIndex + 1) % lightboxImages.length;
                updateLightboxImage();
                break;
        }
    });

    // Cerrar al hacer click en el fondo
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
}

function openLightbox(element) {
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const img         = element.querySelector('img');

    if (!img || !lightbox || !lightboxImg) return;

    currentLightboxIndex = lightboxImages.indexOf(img.src);
    if (currentLightboxIndex === -1) currentLightboxIndex = 0;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightboxImg');
    if (!lightboxImg || !lightboxImages[currentLightboxIndex]) return;

    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.95)';

    setTimeout(() => {
        lightboxImg.src = lightboxImages[currentLightboxIndex];
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
        lightboxImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }, 200);
}

/* ============================================
   SISTEMA DE CARRITO
   ============================================ */
function initCartSystem() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
        showToast(`+1 ${name} en el carrito`, 'success', '🛍️');
    } else {
        cart.push({
            id:       Date.now(),
            name:     name,
            price:    price,
            quantity: 1,
            icon:     getProductIcon(name)
        });
        showToast(`¡${name} agregado al carrito!`, 'success', '🌸');
    }

    updateCartUI();
    saveCartToStorage();
    animateCartButton();
}

function getProductIcon(name) {
    const iconMap = {
        'Ramo':       '🌹',
        'Arreglo':    '💐',
        'Collar':     '💎',
        'Aretes':     '✨',
        'Pulsera':    '💫',
        'Caja':       '🎁',
        'Set':        '🎀',
        'Decoración': '🌺',
        'Novia':      '💒',
        'Primaveral': '🌸'
    };

    for (const [key, icon] of Object.entries(iconMap)) {
        if (name.includes(key)) return icon;
    }
    return '🌸';
}

function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        const itemName = cart[index].name;
        cart.splice(index, 1);
        updateCartUI();
        saveCartToStorage();
        showToast(`${itemName} eliminado`, 'error', '🗑️');
    }
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    updateCartUI();
    saveCartToStorage();
}

function clearCart() {
    if (cart.length === 0) {
        showToast('El carrito ya está vacío', 'info', '🛍️');
        return;
    }
    cart = [];
    updateCartUI();
    saveCartToStorage();
    showToast('Carrito vaciado', 'info', '🗑️');
}

function updateCartUI() {
    const cartCount  = document.getElementById('cartCount');
    const cartItems  = document.getElementById('cartItems');
    const cartEmpty  = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    const totalPrice = document.getElementById('totalPrice');

    const totalItems  = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Actualizar contador del botón
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Mostrar/ocultar secciones
    if (cartEmpty)  cartEmpty.style.display  = cart.length === 0 ? 'block' : 'none';
    if (cartFooter) cartFooter.style.display = cart.length > 0  ? 'block' : 'none';

    // Renderizar items del carrito
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" id="cart-item-${item.id}">
                <div class="cart-item-icon">${item.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">
                        ₡${(item.price * item.quantity).toLocaleString('es-CR')}
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)" 
                        aria-label="Reducir cantidad">−</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)"
                        aria-label="Aumentar cantidad">+</button>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})"
                        aria-label="Eliminar producto">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Actualizar precio total
    if (totalPrice) {
        totalPrice.textContent = `₡${totalAmount.toLocaleString('es-CR')}`;
    }
}

function openCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function checkout() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío', 'error', '🛍️');
        return;
    }

    const itemsList = cart.map(item =>
        `• ${item.icon} ${item.name} x${item.quantity} = ₡${(item.price * item.quantity).toLocaleString('es-CR')}`
    ).join('\n');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const message =
        `🌸 *Pedido - Floristería y Bisutería Gaia*\n\n` +
        `${itemsList}\n\n` +
        `💰 *Total: ₡${total.toLocaleString('es-CR')}*\n\n` +
        `¡Hola! Me gustaría confirmar este pedido. 😊`;

    const whatsappUrl = `https://wa.me/50689265555?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeCart();
}

function animateCartButton() {
    const cartBtn = document.getElementById('cartBtn');
    if (!cartBtn) return;

    cartBtn.style.transform = 'scale(1.4) rotate(10deg)';
    cartBtn.style.transition = 'transform 0.2s ease';

    setTimeout(() => {
        cartBtn.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
}

function saveCartToStorage() {
    try {
        localStorage.setItem('gaiaCart', JSON.stringify(cart));
    } catch (e) {
        console.warn('No se pudo guardar el carrito en localStorage:', e);
    }
}

function loadCartFromStorage() {
    try {
        const saved = localStorage.getItem('gaiaCart');
        if (saved) {
            cart = JSON.parse(saved);
            updateCartUI();
        }
    } catch (e) {
        console.warn('No se pudo cargar el carrito:', e);
        cart = [];
    }
}

/* ============================================
   FORMULARIO DE CONTACTO
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Validación en tiempo real
    const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur',  () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) validateField(input);
        });
    });
}

function validateField(field) {
    const errorEl = document.getElementById(`${field.id}Error`);
    let isValid   = true;
    let errorMsg  = '';

    const value = field.value.trim();

    if (!value) {
        isValid  = false;
        errorMsg = '⚠️ Este campo es requerido';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        isValid  = false;
        errorMsg = '⚠️ Ingresa un email válido';
    } else if (field.type === 'tel' && !/^[\d\s\-\+\$\$]{7,15}$/.test(value)) {
        isValid  = false;
        errorMsg = '⚠️ Ingresa un teléfono válido';
    } else if (field.tagName === 'TEXTAREA' && value.length < 10) {
        isValid  = false;
        errorMsg = '⚠️ El mensaje debe tener al menos 10 caracteres';
    }

    if (errorEl) errorEl.textContent = errorMsg;

    field.style.borderColor = isValid ? '' : '#ff6b6b';
    field.classList.toggle('error', !isValid);

    return isValid;
}

function submitForm(e) {
    e.preventDefault();

    const form       = e.target;
    const submitBtn  = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    // Validar todos los campos requeridos
    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
        showToast('Por favor completa todos los campos correctamente', 'error', '⚠️');
        return;
    }

    // Obtener valores del formulario
    const nombre   = document.getElementById('nombre')?.value   || '';
    const telefono = document.getElementById('telefono')?.value || '';
    const email    = document.getElementById('email')?.value    || '';
    const servicio = document.getElementById('servicio')?.value || '';
    const mensaje  = document.getElementById('mensaje')?.value  || '';

    // Estado de carga
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
        submitBtn.disabled = true;
    }

    // Construir mensaje para WhatsApp
    const whatsappMsg =
        `🌸 *Mensaje desde la web - Floristería Gaia*\n\n` +
        `👤 *Nombre:* ${nombre}\n` +
        `📞 *Teléfono:* ${telefono}\n` +
        `📧 *Email:* ${email || 'No proporcionado'}\n` +
        `🌺 *Servicio de interés:* ${servicio || 'No especificado'}\n\n` +
        `💬 *Mensaje:*\n${mensaje}`;

    // Simular envío (2 segundos)
    setTimeout(() => {
        // Restaurar botón
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Enviar Mensaje</span>';
            submitBtn.disabled = false;
        }

        // Mostrar mensaje de éxito
        if (formSuccess) formSuccess.classList.add('show');

        // Limpiar formulario
        form.reset();

        showToast('¡Mensaje enviado exitosamente!', 'success', '✅');

        // Abrir WhatsApp con el mensaje
        setTimeout(() => {
            const url = `https://wa.me/50689265555?text=${encodeURIComponent(whatsappMsg)}`;
            window.open(url, '_blank');
        }, 1500);

        // Ocultar mensaje de éxito después de 6 segundos
        setTimeout(() => {
            if (formSuccess) formSuccess.classList.remove('show');
        }, 6000);

    }, 2000);
}

/* ============================================
   WHATSAPP
   ============================================ */
function openWhatsApp() {
    const message =
        '🌸 ¡Hola! Me interesa conocer más sobre sus productos y servicios ' +
        'de Floristería y Bisutería Gaia. ¿Me pueden ayudar?';
    const url = `https://wa.me/50689265555?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

/* ============================================
   SCROLL TOP
   ============================================ */
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, { passive: true });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================
   ANIMACIONES DE CONTADORES
   ============================================ */
function initCounterAnimations() {
    const counterSection = document.querySelector('.contador');
    if (!counterSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                counterAnimated = true;
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(counterSection);
}

function animateCounters() {
    const counters = document.querySelectorAll('.contador-number');

    counters.forEach(counter => {
        const target   = parseInt(counter.dataset.target) || 0;
        const duration = 2000;
        const steps    = duration / 16;
        const step     = target / steps;
        let current    = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current).toLocaleString('es-CR');
        }, 16);
    });
}

function animateHeroStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    const stats = document.querySelectorAll('.stat-number[data-target]');

    stats.forEach(stat => {
        const target   = parseInt(stat.dataset.target) || 0;
        const duration = 2000;
        const steps    = duration / 16;
        const step     = target / steps;
        let current    = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + '+';
        }, 16);
    });
}

/* ============================================
   TOAST NOTIFICATIONS
   ============================================ */
function showToast(message, type = 'success', icon = '🌸') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Limitar a máximo 3 toasts visibles
    const existingToasts = container.querySelectorAll('.toast');
    if (existingToasts.length >= 3) {
        existingToasts[0].remove();
    }

    const toast = document.createElement('div');
    toast.classList.add('toast', type);

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="removeToast(this)" aria-label="Cerrar">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    // Auto eliminar después de 3.5 segundos
    setTimeout(() => removeToast(toast.querySelector('.toast-close')), 3500);
}

function removeToast(btn) {
    const toast = btn.closest ? btn.closest('.toast') : btn.parentElement;
    if (!toast) return;

    toast.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 400);
}

/* ============================================
   NEWSLETTER
   ============================================ */
function subscribeNewsletter() {
    const input = document.querySelector('.newsletter-form input');
    if (!input) return;

    const email = input.value.trim();

    if (!email) {
        showToast('Por favor ingresa tu email', 'error', '⚠️');
        input.focus();
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Por favor ingresa un email válido', 'error', '⚠️');
        input.focus();
        return;
    }

    // Simular suscripción
    showToast('¡Suscripción exitosa! Gracias 🎉', 'success', '✅');
    input.value = '';

    // Guardar en localStorage
    try {
        const subscribers = JSON.parse(localStorage.getItem('gaiaSubscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('gaiaSubscribers', JSON.stringify(subscribers));
        }
    } catch (e) {
        console.warn('Error guardando suscriptor:', e);
    }
}

/* ============================================
   LAZY LOADING DE IMÁGENES
   ============================================ */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    images.forEach(img => imageObserver.observe(img));
}

/* ============================================
   MANEJO DE ERRORES DE IMÁGENES
   ============================================ */
function handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            this.src =
                'https://via.placeholder.com/400x300/fdf0f8/e91e8c?text=Gaia+🌸';
            this.alt = 'Floristería y Bisutería Gaia';
        });
    });
}

/* ============================================
   DETECTAR MOVIMIENTO REDUCIDO
   ============================================ */
function detectReducedMotion() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReduced.matches) {
        document.documentElement.style.setProperty('--transition', 'none');
        document.documentElement.style.setProperty('--transition-slow', 'none');
        console.log('Modo de movimiento reducido activado');
    }
}

/* ============================================
   EFECTO PARALLAX EN HERO
   ============================================ */
window.addEventListener('scroll', () => {
    if (window.scrollY >= window.innerHeight) return;

    const floatingEls = document.querySelectorAll('.floating-el');
    floatingEls.forEach((el, index) => {
        const speed = 0.08 + (index * 0.04);
        el.style.transform = `translateY(${window.scrollY * speed}px)`;
    });
}, { passive: true });

/* ============================================
   TYPING EFFECT (Utilidad)
   ============================================ */
function typeWriter(elementId, text, speed = 80) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

/* ============================================
   RESIZE HANDLER
   ============================================ */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reiniciar partículas si cambia el tamaño
        const container = document.getElementById('particles-container');
        if (container) {
            container.innerHTML = '';
            initParticles();
        }
    }, 500);
});

/* ============================================
   LOG DE CONSOLA PERSONALIZADO
   ============================================ */
console.log(
    '%c🌸 Floristería y Bisutería Gaia',
    'color: #e91e8c; font-size: 22px; font-weight: bold; font-family: Georgia, serif;'
);
console.log(
    '%c📍 Nicoya, Guanacaste, Costa Rica',
    'color: #9c27b0; font-size: 13px;'
);
console.log(
    '%c📞 Tel: 8926-5555  |  🕐 Abierto hasta las 7:00 PM',
    'color: #666; font-size: 12px;'
);
