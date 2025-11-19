document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Enhanced hover effects for pricing cards
    const pricingGrid = document.getElementById('pricingGrid');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    // Add mouseenter/mouseleave events for each card
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add a small delay for smoother transition
            setTimeout(() => {
                this.style.zIndex = '20';
            }, 50);
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset z-index after transition
            setTimeout(() => {
                this.style.zIndex = '';
            }, 300);
        });
    });
    
    // Add intersection observer for scroll animations
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
    
    // Observe pricing cards and FAQ items for scroll animations
    document.querySelectorAll('.pricing-card, .faq-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add staggered animation for pricing cards
    document.querySelectorAll('.pricing-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});