// services-timeline.js - Enhanced Orbital timeline for services
class ServicesOrbitalTimeline {
    constructor(containerId, servicesData) {
        this.container = document.getElementById(containerId);
        this.servicesData = servicesData;
        this.state = {
            expandedItems: {},
            rotationAngle: 0,
            autoRotate: true,
            pulseEffect: {},
            centerOffset: { x: 0, y: 0 },
            activeNodeId: null
        };
        this.nodeRefs = {};
        this.animationFrameId = null;
        
        this.init();
    }

    init() {
        this.render();
        this.startAutoRotation();
        // Lucide icons are already initialized globally
    }

    render() {
        this.container.innerHTML = '';
        
        const mainDiv = document.createElement('div');
        mainDiv.className = 'orbital-timeline';
        mainDiv.addEventListener('click', (e) => this.handleContainerClick(e));

        // Create center element with text
        const centerDiv = document.createElement('div');
        centerDiv.className = 'timeline-center';
        const centerText = document.createElement('div');
        centerText.className = 'timeline-center-text';
        centerText.innerHTML = 'Services<br>we offer';
        centerDiv.appendChild(centerText);

        // Create nodes container
        const nodesContainer = document.createElement('div');
        nodesContainer.className = 'timeline-nodes';

        // Create service nodes
        this.servicesData.forEach((service, index) => {
            const node = this.createServiceNode(service, index);
            nodesContainer.appendChild(node);
        });

        mainDiv.appendChild(centerDiv);
        mainDiv.appendChild(nodesContainer);
        this.container.appendChild(mainDiv);
    }

    createServiceNode(service, index) {
        const position = this.calculateNodePosition(index, this.servicesData.length);
        const isExpanded = this.state.expandedItems[service.id];
        const isRelated = this.isRelatedToActive(service.id);
        const isPulsing = this.state.pulseEffect[service.id];

        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'timeline-node';
        nodeDiv.style.transform = `translate(${position.x}px, ${position.y}px)`;
        nodeDiv.style.zIndex = isExpanded ? '200' : position.zIndex;
        nodeDiv.style.opacity = isExpanded ? '1' : position.opacity;

        this.nodeRefs[service.id] = nodeDiv;

        // Pulse effect background for active nodes
        if (isPulsing) {
            const pulseBg = document.createElement('div');
            pulseBg.className = 'pulse-effect';
            pulseBg.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(64, 146, 239, 0.4) 0%, rgba(64, 146, 239, 0) 70%);
                width: 90px;
                height: 90px;
                left: -15px;
                top: -15px;
            `;
            nodeDiv.appendChild(pulseBg);
        }

        const nodeContent = document.createElement('div');
        nodeContent.className = 'timeline-node-content';

        // Service icon
        const iconDiv = document.createElement('div');
        iconDiv.className = `timeline-node-icon ${isExpanded ? 'expanded' : ''} ${isRelated ? 'related' : ''}`;
        iconDiv.style.borderColor = isExpanded ? '#4092ef' : (isRelated ? '#4092ef' : 'rgba(255, 255, 255, 0.4)');
        iconDiv.style.color = isExpanded ? '#4092ef' : (isRelated ? '#4092ef' : 'rgba(255, 255, 255, 0.9)');

        const iconSvg = document.createElement('i');
        iconSvg.setAttribute('data-lucide', service.icon);
        iconDiv.appendChild(iconSvg);

        // Service title
        const titleDiv = document.createElement('div');
        titleDiv.className = `timeline-node-title ${isExpanded ? 'expanded' : ''}`;
        titleDiv.textContent = service.title;

        nodeContent.appendChild(iconDiv);
        nodeContent.appendChild(titleDiv);

        // Expanded service card
        if (isExpanded) {
            const card = this.createServiceCard(service);
            nodeContent.appendChild(card);
        }

        nodeDiv.appendChild(nodeContent);

        // Event listeners
        nodeDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleService(service.id);
        });

        return nodeDiv;
    }

    createServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'service-card';

        const cardHeader = document.createElement('div');
        cardHeader.className = 'service-card-header';

        const headerTop = document.createElement('div');
        headerTop.className = 'service-card-header-top';

        // Service badge
        const badge = document.createElement('span');
        badge.className = `service-badge ${service.status}`;
        badge.textContent = service.status === 'active' ? 'ACTIVE' : 'COMING SOON';

        headerTop.appendChild(badge);

        // Service title
        const title = document.createElement('h3');
        title.className = 'service-card-title';
        title.textContent = service.title;

        cardHeader.appendChild(headerTop);
        cardHeader.appendChild(title);

        const cardContent = document.createElement('div');
        cardContent.className = 'service-card-content';

        // Service description
        const description = document.createElement('p');
        description.textContent = service.description;
        cardContent.appendChild(description);

        // Service features
        if (service.features && service.features.length > 0) {
            const featuresList = document.createElement('ul');
            featuresList.className = 'service-features';

            service.features.forEach(feature => {
                const featureItem = document.createElement('li');
                featureItem.textContent = feature;
                featuresList.appendChild(featureItem);
            });

            cardContent.appendChild(featuresList);
        }

        // Action buttons
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'service-btn-group';

        if (service.actions && service.actions.length > 0) {
            service.actions.forEach(action => {
                const button = document.createElement('button');
                button.className = 'service-btn';
                button.textContent = action.label;
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (action.url) {
                        window.location.href = action.url;
                    }
                });
                buttonGroup.appendChild(button);
            });
        }

        cardContent.appendChild(buttonGroup);

        card.appendChild(cardHeader);
        card.appendChild(cardContent);

        return card;
    }

    calculateNodePosition(index, total) {
        const angle = ((index / total) * 360 + this.state.rotationAngle) % 360;
        const radius = 240; // Increased radius for 1.5x scale (from 160)
        const radian = (angle * Math.PI) / 180;

        const x = radius * Math.cos(radian) + this.state.centerOffset.x;
        const y = radius * Math.sin(radian) + this.state.centerOffset.y;

        const zIndex = Math.round(100 + 50 * Math.cos(radian));
        const opacity = Math.max(0.7, Math.min(1, 0.7 + 0.3 * ((1 + Math.sin(radian)) / 2)));

        return { x, y, angle, zIndex, opacity };
    }

    toggleService(id) {
        const newExpandedItems = { ...this.state.expandedItems };
        
        // Close all other services
        Object.keys(newExpandedItems).forEach(key => {
            if (parseInt(key) !== id) {
                newExpandedItems[parseInt(key)] = false;
            }
        });

        // Toggle current service
        newExpandedItems[id] = !this.state.expandedItems[id];

        if (!this.state.expandedItems[id]) {
            this.state.activeNodeId = id;
            this.state.autoRotate = false;

            // Set pulse effect for related services
            const relatedServices = this.getRelatedServices(id);
            const newPulseEffect = {};
            relatedServices.forEach(relId => {
                newPulseEffect[relId] = true;
            });
            this.state.pulseEffect = newPulseEffect;

            this.centerViewOnService(id);
        } else {
            this.state.activeNodeId = null;
            this.state.autoRotate = true;
            this.state.pulseEffect = {};
        }

        this.state.expandedItems = newExpandedItems;
        this.render();
        // Re-initialize Lucide icons for new SVG elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    getRelatedServices(serviceId) {
        const currentService = this.servicesData.find(service => service.id === serviceId);
        return currentService ? currentService.relatedIds : [];
    }

    isRelatedToActive(serviceId) {
        if (!this.state.activeNodeId) return false;
        const relatedServices = this.getRelatedServices(this.state.activeNodeId);
        return relatedServices.includes(serviceId);
    }

    centerViewOnService(serviceId) {
        const serviceIndex = this.servicesData.findIndex(service => service.id === serviceId);
        const totalServices = this.servicesData.length;
        const targetAngle = (serviceIndex / totalServices) * 360;
        this.state.rotationAngle = 270 - targetAngle;
    }

    handleContainerClick(e) {
        if (e.target === this.container || e.target.className.includes('orbital-timeline')) {
            this.state.expandedItems = {};
            this.state.activeNodeId = null;
            this.state.pulseEffect = {};
            this.state.autoRotate = true;
            this.render();
        }
    }

    startAutoRotation() {
        const rotate = () => {
            if (this.state.autoRotate) {
                this.state.rotationAngle = (this.state.rotationAngle + 0.15) % 360; // Slower rotation for larger scale
                this.render();
                // Re-initialize Lucide icons if needed
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
            this.animationFrameId = requestAnimationFrame(() => rotate());
        };
        rotate();
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

// Enhanced Services data for Icycon with Multilingual SEO
const routes = window.icyconRoutes || {};
const signupUrl = routes.signup || '#';

const servicesData = [
    {
        id: 1,
        title: "SEO",
        description: "Boost your website's visibility in search engines with comprehensive SEO strategies. Drive organic traffic and dominate search results.",
        icon: "search",
        status: "active",
        features: [
            "Keyword research & strategy",
            "On-page optimization",
            "Technical SEO audits",
            "Link building & authority"
        ],
        relatedIds: [2, 3, 4, 5],
        actions: [
            { label: "Learn More", url: "#seo" },
            { label: "Get Started", url: signupUrl }
        ]
    },
    {
        id: 2,
        title: "Social Media",
        description: "Engage your audience and build brand presence across social platforms. Drive awareness, engagement, and conversions.",
        icon: "share-2",
        status: "active",
        features: [
            "Content strategy & creation",
            "Community management",
            "Paid social advertising",
            "Analytics & performance tracking"
        ],
        relatedIds: [1, 3],
        actions: [
            { label: "Learn More", url: "#social" },
            { label: "Get Started", url: signupUrl }
        ]
    },
    {
        id: 3,
        title: "Email Marketing",
        description: "Nurture leads and retain customers with targeted email campaigns. Drive conversions and build lasting customer relationships.",
        icon: "mail",
        status: "active",
        features: [
            "Automated email sequences",
            "Segmentation & personalization",
            "A/B testing & optimization",
            "Performance analytics"
        ],
        relatedIds: [1, 2, 4, 5],
        actions: [
            { label: "Learn More", url: "#email" },
            { label: "Get Started", url: signupUrl }
        ]
    },
    {
        id: 4,
        title: "App Store",
        description: "Boost your app visibility and downloads with comprehensive App Store Optimization strategies.",
        icon: "smartphone",
        status: "active",
        features: [
            "Keyword optimization",
            "App store listing optimization",
            "Review management",
            "Performance analytics"
        ],
        relatedIds: [1, 3, 5],
        actions: [
            { label: "Learn More", url: "#aso" },
            { label: "Get Started", url: signupUrl }
        ]
    },
    {
        id: 5,
        title: "Multilingual SEO",
        description: "Expand your reach globally with multilingual SEO strategies. Optimize your content for different languages and regions.",
        icon: "globe",
        status: "active",
        features: [
            "Multilingual keyword research",
            "Localized content optimization",
            "Hreflang implementation",
            "International link building"
        ],
        relatedIds: [1, 3, 4],
        actions: [
            { label: "Learn More", url: "#multilingual" },
            { label: "Get Started", url: signupUrl }
        ]
    }
];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('servicesOrbitalTimeline')) {
        new ServicesOrbitalTimeline('servicesOrbitalTimeline', servicesData);
    }
});
