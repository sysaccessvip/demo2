// Espera a que la ventana completa se cargue
window.addEventListener('load', () => {

    // --- 1. Lógica de la Pantalla de Carga (Intro "Flash") ---
    
    const loader = document.getElementById('loader');
    const appWrapper = document.getElementById('app-wrapper');
    const heroTitle = document.querySelector('.typing-effect');

    // Simula un tiempo de carga (2.5 segundos)
    setTimeout(() => {
        loader.style.opacity = '0'; // Desvanece el loader

        // Espera a que termine la transición de opacidad
        loader.addEventListener('transitionend', () => {
            loader.style.display = 'none';
        });

        // Muestra el contenido principal
        appWrapper.classList.remove('hidden');

        // Activa la animación de máquina de escribir AHORA
        if (heroTitle) {
            heroTitle.classList.add('typing-active');
        }

    }, 2500); // 2500ms = 2.5 segundos


    // --- 2. Lógica de la Ventana Modal (¡Mejorada!) ---

    const modal = document.getElementById('contactModal');
    const openBtn1 = document.getElementById('openModalBtn');
    const openBtn2 = document.getElementById('openModalBtnSecondary');
    const closeBtn = document.querySelector('.close-btn');

    const openModal = () => {
        modal.style.display = 'block';
        // Un pequeño timeout para asegurar que el 'display: block' se aplica
        // antes de que comience la transición de opacidad.
        setTimeout(() => {
            modal.classList.add('is-open');
        }, 10);
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
    };

    if (openBtn1) openBtn1.addEventListener('click', openModal);
    if (openBtn2) openBtn2.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Oculta el modal (display: none) DESPUÉS de que termine la animación
    modal.addEventListener('transitionend', (event) => {
        if (!modal.classList.contains('is-open') && event.propertyName === 'opacity') {
            modal.style.display = 'none';
        }
    });

    // Cerrar el modal si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Cerrar con la tecla "Escape"
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });


    // --- 3. Lógica de Navegación Activa (ScrollSpy) (¡Actualizada!) ---

    const mainContent = document.getElementById('main-content');
    const sections = document.querySelectorAll('.content-section');
    // ¡IMPORTANTE! Solo seleccionamos los '.scroll-link'
    const navLinks = document.querySelectorAll('.scroll-link'); 

    const activateNavLink = () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset
            const sectionHeight = section.clientHeight;
            
            if (mainContent.scrollTop >= sectionTop && mainContent.scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (mainContent.scrollTop < sections[0].offsetTop - 100) {
             currentSectionId = sections[0].getAttribute('id');
        }

        // Esto ahora ignora el link "Sistema Orlando"
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    if (mainContent) {
        mainContent.addEventListener('scroll', activateNavLink);
    }
    activateNavLink(); // Ejecutar al cargar


    // --- 4. ¡NUEVO! Animaciones al Hacer Scroll (Intersection Observer) ---

    // Selecciona todos los elementos que quieres animar
    const animatedItems = document.querySelectorAll('.animated-item, .chat-message');

    const observerOptions = {
        root: mainContent, // Observa el scroll dentro de main-content
        rootMargin: '0px',
        threshold: 0.2 // El item debe estar 20% visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Opcional: deja de observar el elemento una vez animado
                observer.unobserve(entry.target); 
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Observa cada elemento
    animatedItems.forEach(item => {
        scrollObserver.observe(item);
    });

});