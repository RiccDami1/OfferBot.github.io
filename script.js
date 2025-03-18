// Aggiungi questo codice alla fine del file script.js esistente

document.addEventListener('DOMContentLoaded', function() {
    // Controlla se siamo nella home page
    const homeStatusIndicator = document.getElementById('home-status-indicator');
    const homeStatusText = document.getElementById('home-status-text');
    const homeStatusDescription = document.getElementById('home-status-description');
    const homeOffersToday = document.getElementById('home-offers-today');
    const homeUptime = document.getElementById('home-uptime');
    
    // Funzione per aggiornare lo stato nella home page
    function updateHomeStatus() {
        if (homeStatusIndicator && homeStatusText && homeStatusDescription) {
            // Carica lo stato dal localStorage
            const savedStatus = localStorage.getItem('offerbot_status');
            if (savedStatus) {
                const currentStatus = JSON.parse(savedStatus);
                
                // Aggiorna l'indicatore di stato
                homeStatusIndicator.className = 'status-badge ' + currentStatus.status;
                
                // Aggiorna il testo dello stato
                switch(currentStatus.status) {
                    case 'online':
                        homeStatusText.textContent = 'Online';
                        break;
                    case 'maintenance':
                        homeStatusText.textContent = 'In Manutenzione';
                        break;
                    case 'partial':
                        homeStatusText.textContent = 'Parzialmente Operativo';
                        break;
                    case 'offline':
                        homeStatusText.textContent = 'Offline';
                        break;
                }
                
                // Aggiorna il messaggio di stato
                homeStatusDescription.textContent = currentStatus.message;
            }
            
            // Carica il conteggio delle offerte
            const savedCount = localStorage.getItem('offerbot_offers_count') || '0';
            if (homeOffersToday) {
                homeOffersToday.textContent = savedCount;
            }
            
            // Carica l'uptime
            if (homeUptime) {
                const savedUptime = localStorage.getItem('offerbot_uptime') || '99.8%';
                homeUptime.textContent = savedUptime;
            }
        }
    }
    
    // Esegui l'aggiornamento all'avvio
    updateHomeStatus();
    
    // Imposta un intervallo per controllare gli aggiornamenti ogni 5 secondi
    setInterval(updateHomeStatus, 5000);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.style.padding = '10px 0';
            header.style.backgroundColor = 'rgba(32, 34, 37, 0.95)';
        } else {
            header.style.padding = '20px 0';
            header.style.backgroundColor = 'rgba(32, 34, 37, 0.8)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Fade-in animation on scroll
    const fadeElements = document.querySelectorAll('.feature-card, .step, .testimonial');
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Add pulse animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.primary-button, .discord-button');
    ctaButtons.forEach(button => {
        button.classList.add('pulse');
    });
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    // Testimonial slider auto-scroll
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonials = document.querySelectorAll('.testimonial');
    
    if (testimonialSlider && testimonials.length > 0) {
        let currentIndex = 0;
        const testimonialWidth = testimonials[0].offsetWidth + 30; // Width + gap
        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            testimonialSlider.scrollTo({
                left: currentIndex * testimonialWidth,
                behavior: 'smooth'
            });
        }, 5000);
    }
    
    // Create folder for images if it doesn't exist
    function createImagesFolder() {
        // This is just a placeholder - in a real website, you'd handle this server-side
        console.log('Images folder should be created on the server');
    }
    
    // Initialize the website
    function init() {
        createImagesFolder();
        console.log('OfferBot website initialized successfully!');
    }
    
    init();
});