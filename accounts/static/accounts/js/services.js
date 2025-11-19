document.addEventListener('DOMContentLoaded', function() {
    // Service cards hover effects
    const servicesGrid = document.getElementById('servicesGrid');
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceModal = document.getElementById('serviceModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    const modalOverlay = document.querySelector('.modal-overlay');
    const routes = window.icyconRoutes || {};
    const signupUrl = routes.signup || '#';
    const pricingUrl = routes.pricing || '#';

    // Enhanced hover effects for service cards
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add a small delay for smoother transition
            setTimeout(() => {
                this.style.zIndex = '25';
            }, 50);
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset z-index after transition
            setTimeout(() => {
                if (!this.matches(':hover')) {
                    this.style.zIndex = '';
                }
            }, 300);
        });

        // Click event for service details
        const learnMoreBtn = this.querySelector('.service-btn.outline');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const serviceType = this.getAttribute('data-service');
                showServiceDetails(serviceType);
            });
        }

        // Also make the entire card clickable for mobile
        this.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const serviceType = this.getAttribute('data-service');
                showServiceDetails(serviceType);
            }
        });
    });

    // Service details data
    const serviceDetails = {
        'seo-platform': {
            title: 'SEO Platform',
            description: 'Comprehensive technical, content, and local SEO with Search Console orchestration',
            fullDescription: 'Our SEO Platform provides a complete solution for dominating search engine results. We combine technical excellence with strategic content optimization and local search dominance.',
            features: [
                'Comprehensive website crawl analysis and technical audits',
                'Site speed optimization and Core Web Vitals monitoring',
                'XML sitemap generation and management',
                'Structured data markup implementation',
                'Content optimization strategy and gap analysis',
                'Local SEO and Google Business Profile optimization',
                'Search Console integration and performance monitoring',
                'Mobile-first optimization and indexing'
            ],
            benefits: [
                'Increase organic traffic by 200%+ within 6 months',
                'Improve search rankings for competitive keywords',
                'Enhance user experience and site performance',
                'Dominate local search results and map pack',
                'Gain comprehensive visibility into search performance'
            ]
        },
        'aeo': {
            title: 'Answer Engine Optimization',
            description: 'SEO for LLMs and AI search engines - future-proof your content strategy',
            fullDescription: 'Prepare your content for the future of search with our AEO services. We optimize for AI answer engines, voice search, and conversational interfaces.',
            features: [
                'LLM-friendly content structuring and optimization',
                'Entity-based optimization for knowledge graphs',
                'Conversational query targeting and optimization',
                'FAQ schema and structured data implementation',
                'Voice search optimization strategies',
                'AI response analysis and performance tracking',
                'Natural language processing optimization',
                'Featured snippet and "People Also Ask" targeting'
            ],
            benefits: [
                'Future-proof your content against AI search disruption',
                'Capture traffic from voice assistants and smart devices',
                'Improve visibility in AI-generated answer boxes',
                'Stay ahead of competitors in emerging search technologies',
                'Build authority with comprehensive, entity-rich content'
            ]
        }
        // Add similar detailed objects for all 11 services...
    };

    // Function to show service details in modal
    function showServiceDetails(serviceType) {
        const service = serviceDetails[serviceType];
        if (!service) return;

        const modalHTML = `
            <div class="service-detail">
                <h2 class="detail-title">${service.title}</h2>
                <p class="detail-description">${service.fullDescription}</p>
                
                <div class="detail-features">
                    <h3>Key Features</h3>
                    <ul>
                        ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-benefits">
                    <h3>Key Benefits</h3>
                    <ul>
                        ${service.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-actions">
                    <a href="${signupUrl}" class="btn-primary">Start Free Trial</a>
                    <a href="${pricingUrl}" class="btn-outline">View Pricing</a>
                </div>
            </div>
        `;

        modalBody.innerHTML = modalHTML;
        serviceModal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal functionality
    function closeModal() {
        serviceModal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards for scroll animations
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Prevent hover effects on touch devices
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }
});
