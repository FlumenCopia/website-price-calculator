/* ==========================================================================
   FLUMENX SMART WEBSITE PRICING CALCULATOR - LOGIC ENGINE
   Senior JavaScript Architect & Pricing Consultant Refactor
   Thiruvananthapuram (TVM, Kerala) Digital Agency Pricing Model
   ========================================================================== */

(function () {
    'use strict';

    /* --------------------------------------------------------------------------
       1. CONSTANTS & CONFIGURATION (TVM MID-TO-LOW MARKET PRICING)
       -------------------------------------------------------------------------- */
    const DEFAULT_CONFIG = {
        // Step 1: Project Types (Base Prices)
        projectTypes: {
            landing_page:      { name: 'Landing Page', price: 10000, hours: 25, desc: 'Single high-converting page for marketing & lead gen', icon: 'layout' },
            business_website:  { name: 'Business Website', price: 22000, hours: 45, desc: 'Standard multi-page site for local business presentation', icon: 'globe' },
            portfolio:         { name: 'Portfolio Website', price: 18000, hours: 35, desc: 'Personal or agency work showcase website', icon: 'layout' },
            corporate_website: { name: 'Corporate Website', price: 40000, hours: 70, desc: 'Multi-section corporate portal with compliance pages', icon: 'briefcase' },
            hospital_website:  { name: 'Hospital Website', price: 45000, hours: 130, desc: 'Medical clinic / hospital portal with doctor booking', icon: 'users', autoSelect: ['booking', 'notifications'] },
            school_portal:     { name: 'School Website', price: 40000, hours: 120, desc: 'Educational institution site with news, staff & notices', icon: 'layers', autoSelect: ['reports', 'notifications'] },
            booking_website:   { name: 'Booking Platform', price: 55000, hours: 100, desc: 'Appointment scheduling & reservation engine', icon: 'calendar', autoSelect: ['booking', 'payment_gateway', 'notifications'] },
            ecommerce:         { name: 'E-commerce Store', price: 60000, hours: 110, desc: 'Online store with catalog, cart & payment gateway', icon: 'shopping-bag', autoSelect: ['payment_gateway', 'cart', 'admin_dashboard'] },
            crm:               { name: 'CRM System', price: 100000, hours: 160, desc: 'Lead pipeline management & client CRM portal', icon: 'cpu', autoSelect: ['admin_dashboard', 'reports', 'notifications'] },
            erp:               { name: 'ERP System', price: 180000, hours: 220, desc: 'Resource planning for inventory, HR & operations', icon: 'layers', autoSelect: ['admin_dashboard', 'reports', 'notifications'] },
            marketplace:       { name: 'Marketplace', price: 150000, hours: 230, desc: 'Multi-vendor e-commerce or booking marketplace', icon: 'store', autoSelect: ['payment_gateway', 'cart', 'admin_dashboard'] },
            custom_webapp:     { name: 'Custom Web Application', price: 120000, hours: 180, desc: 'Tailor-made web app built to custom business workflow', icon: 'code' }
        },

        // Business Size (Informational / Scope Scale)
        businessSizes: {
            individual: { name: 'Individual', price: 0, desc: 'Personal portfolio, freelancer, or solo practitioner' },
            startup: { name: 'Startup', price: 0, desc: 'Early-stage venture or emerging local brand' },
            small_business: { name: 'Small Business', price: 0, desc: 'Local business, clinic, or service shop' },
            medium_business: { name: 'Medium Business', price: 5000, desc: 'Established company with multi-team workflows (+₹5,000)' },
            large_company: { name: 'Large Company', price: 10000, desc: 'Corporate enterprise requiring SLA & scale (+₹10,000)' }
        },

        // Client Expected Budget (For Budget Matching Validation)
        budgetRanges: {
            b_under_25k: { name: 'Under ₹25,000', target: 25000, desc: 'Economy essential budget' },
            b_25k_50k: { name: '₹25,000 – ₹50,000', target: 50000, desc: 'Standard local business budget' },
            b_50k_75k: { name: '₹50,000 – ₹75,000', target: 75000, desc: 'Growth & e-commerce budget' },
            b_75k_1lakh: { name: '₹75,000 – ₹1 Lakh', target: 100000, desc: 'Advanced portal budget' },
            b_1l_plus: { name: '₹1 Lakh+', target: 150000, desc: 'Custom enterprise budget' }
        },

        // Step 4: Page Volumes
        pageCounts: {
            p1_5: { name: '1–5 Pages', price: 0, hours: 0, desc: 'Included in base price' },
            p6_10: { name: '6–10 Pages', price: 5000, hours: 10, desc: '+₹5,000 for extra layouts' },
            p11_15: { name: '11–15 Pages', price: 10000, hours: 20, desc: '+₹10,000 for multi-section layouts' },
            p16_20: { name: '16–20 Pages', price: 15000, hours: 30, desc: '+₹15,000 for high-volume content' },
            p20_plus: { name: '20+ Pages', price: 20000, hours: 45, desc: '+₹20,000 for enterprise volume' }
        },

        // Step 5: Admin Panel & CMS Options
        cmsOptions: {
            none: { name: 'None', price: 0, hours: 0, desc: 'Static site updated in source code (₹0)' },
            basic: { name: 'Basic Admin', price: 5000, hours: 5, desc: 'Basic CMS for news, blogs & basic pages (+₹5,000)' },
            advanced: { name: 'Advanced Admin', price: 10000, hours: 12, desc: 'Multi-module admin panel with media manager (+₹10,000)' },
            custom_dashboard: { name: 'Custom Dashboard', price: 20000, hours: 25, desc: 'Full custom control panel & business analytics (+₹20,000)' }
        },

        // Step 6: Authentication & User Accounts
        userAccountOptions: {
            none: { name: 'None', price: 0, hours: 0, desc: 'Public website without logins (₹0)' },
            login: { name: 'Login Only', price: 3000, hours: 5, desc: 'Existing user login & session auth (+₹3,000)' },
            login_register: { name: 'Login + Register', price: 5000, hours: 8, desc: 'User registration, login & password reset (+₹5,000)' },
            rbac: { name: 'RBAC (Role-Based)', price: 12000, hours: 18, desc: 'Multi-role permission matrix & staff logins (+₹12,000)' }
        },

        // Step 7: Granular Features List
        features: {
            // Features Included by Default in Every Package (₹0)
            responsive_design: { name: 'Responsive Design', price: 0, hours: 0, desc: 'Included in base package', icon: 'layout', defaultIncluded: true },
            contact_form:      { name: 'Contact Form', price: 0, hours: 0, desc: 'Included in base package', icon: 'code', defaultIncluded: true },
            mobile_opt:        { name: 'Mobile Optimization', price: 0, hours: 0, desc: 'Included in base package', icon: 'globe', defaultIncluded: true },
            ssl_cert:          { name: 'SSL Security', price: 0, hours: 0, desc: 'Included in base package', icon: 'code', defaultIncluded: true },
            basic_seo_feat:    { name: 'Basic SEO & Sitemap', price: 0, hours: 0, desc: 'Included in base package', icon: 'code', defaultIncluded: true },
            whatsapp_btn:      { name: 'WhatsApp Button', price: 0, hours: 0, desc: 'Included in base package', icon: 'code', defaultIncluded: true },
            analytics:         { name: 'Analytics Setup', price: 0, hours: 0, desc: 'Included in base package', icon: 'layers', defaultIncluded: true },

            // Incremental Add-on Features
            blog:            { name: 'Blog', price: 2000, hours: 5, desc: 'Articles & publishing CMS (+₹2,000)', icon: 'layout' },
            portfolio_feat:  { name: 'Portfolio Showcase', price: 2000, hours: 4, desc: 'Filterable work showcase (+₹2,000)', icon: 'layout' },
            gallery:         { name: 'Photo Gallery', price: 1500, hours: 3, desc: 'Lightbox media grid (+₹1,500)', icon: 'globe' },
            search:          { name: 'Instant Search', price: 2000, hours: 4, desc: 'Live instant search filter (+₹2,000)', icon: 'code' },
            whatsapp:        { name: 'WhatsApp Direct Chat', price: 1000, hours: 2, desc: 'Smart WhatsApp lead link (+₹1,000)', icon: 'code' },
            google_maps:     { name: 'Google Maps API', price: 1000, hours: 2, desc: 'Interactive Google map location (+₹1,000)', icon: 'globe' },
            email:           { name: 'Email Notifications', price: 2000, hours: 3, desc: 'Automated email alerts (+₹2,000)', icon: 'code' },
            live_chat:       { name: 'Live Chat Widget', price: 2000, hours: 4, desc: 'Live chat support widget (+₹2,000)', icon: 'code' },
            reviews:         { name: 'Reviews & Ratings', price: 2000, hours: 4, desc: 'Customer star reviews (+₹2,000)', icon: 'users' },
            dark_mode:       { name: 'Dark Mode Toggle', price: 2000, hours: 3, desc: 'Theme toggle & dark mode (+₹2,000)', icon: 'code' },
            wishlist:        { name: 'Wishlist Feature', price: 2000, hours: 4, desc: 'Saved favorites wishlist (+₹2,000)', icon: 'shopping-bag' },
            notifications:   { name: 'Push / SMS Alerts', price: 3000, hours: 5, desc: 'SMS / Push alert system (+₹3,000)', icon: 'code' },
            file_upload:     { name: 'File Upload System', price: 3000, hours: 5, desc: 'Document & media attachment upload (+₹3,000)', icon: 'layers' },
            cart:            { name: 'Shopping Cart', price: 5000, hours: 8, desc: 'Shopping cart drawer & checkout (+₹5,000)', icon: 'shopping-bag' },
            reports:         { name: 'Reports & Export', price: 5000, hours: 8, desc: 'PDF / Excel exports & metrics (+₹5,000)', icon: 'layers' },
            multilingual:    { name: 'Multilingual (i18n)', price: 6000, hours: 10, desc: 'Multi-language content engine (+₹6,000)', icon: 'globe' },
            payment_gateway: { name: 'Payment Gateway', price: 8000, hours: 10, desc: 'Razorpay / UPI / Stripe checkout (+₹8,000)', icon: 'shopping-bag' },
            booking:         { name: 'Booking Engine', price: 8000, hours: 12, desc: 'Calendar reservation slot engine (+₹8,000)', icon: 'calendar' },
            api_integration: { name: 'API Integration', price: 8000, hours: 12, desc: 'Connect 3rd-party REST APIs (+₹8,000)', icon: 'code' }
        },

        // Step 8: Fixed Design Pricing (Additive, NO Multipliers!)
        designStyles: {
            basic: { name: 'Basic Design', price: 0, hours: 0, desc: 'Clean, minimal standard UI design (+₹0)' },
            modern: { name: 'Modern Design', price: 5000, hours: 10, desc: 'Sleek custom component styling (+₹5,000)' },
            premium: { name: 'Premium Design', price: 10000, hours: 20, desc: 'Linear / Framer level polished UI (+₹10,000)' },
            luxury: { name: 'Luxury Design', price: 20000, hours: 35, desc: 'Bespoke motion & high-end art direction (+₹20,000)' }
        },

        // Step 9: Fixed Animation Pricing (Additive, NO Multipliers!)
        animations: {
            none: { name: 'None', price: 0, hours: 0, desc: 'Standard static transitions (+₹0)' },
            basic: { name: 'Basic Motion', price: 2000, hours: 3, desc: 'Smooth fade-in & hover effects (+₹2,000)' },
            advanced: { name: 'Advanced Motion', price: 5000, hours: 8, desc: 'Scroll triggers & motion graphics (+₹5,000)' },
            premium: { name: 'Premium Motion', price: 10000, hours: 18, desc: 'Advanced WebGL & interactive motion (+₹10,000)' }
        },

        // Step 10: Fixed SEO Scope
        seoLevels: {
            basic: { name: 'Basic SEO', price: 0, hours: 2, desc: 'Included in base package (+₹0)' },
            advanced: { name: 'Advanced SEO', price: 3000, hours: 6, desc: 'Schema markup & Speed optimization (+₹3,000)' },
            enterprise: { name: 'Enterprise SEO', price: 8000, hours: 15, desc: 'Programmatic SEO & multi-region setup (+₹8,000)' }
        },

        // Step 11: Timelines & Urgency (Informational / Delivery Pace)
        timelines: {
            flexible: { name: 'Flexible', mult: 1.0, desc: 'Standard relaxed pace' },
            normal: { name: 'Normal', mult: 1.0, desc: 'Standard 3–5 weeks delivery' },
            priority: { name: 'Priority', mult: 1.0, desc: 'Fast-track delivery (Priority queue)' },
            urgent: { name: 'Urgent', mult: 1.0, desc: 'Rush delivery timeline' }
        },

        // Step 12: Deployment & Server Hosting
        deployments: {
            none: { name: 'None', price: 0, hours: 0, desc: 'Client handles server & hosting (+₹0)' },
            deployment: { name: 'Deployment', price: 2000, hours: 2, desc: 'Deploy to Vercel / Hostinger / CPanel (+₹2,000)' },
            vps_setup: { name: 'VPS Setup', price: 5000, hours: 6, desc: 'Linux VPS, SSL & Nginx setup (+₹5,000)' },
            cloud_infra: { name: 'Cloud Infrastructure', price: 10000, hours: 14, desc: 'AWS / GCP cloud setup & CI/CD (+₹10,000)' }
        },

        // Step 13: Maintenance SLA (DISPLAYED SEPARATELY, NOT INCLUDED IN PROJECT COST)
        supportPlans: {
            none: { name: 'No Maintenance', price: 0, hours: 0, desc: 'No monthly maintenance contract' },
            basic: { name: 'Basic Support', price: 1500, hours: 3, desc: '₹1,500/mo - Security updates & bug fixes' },
            standard: { name: 'Standard Support', price: 3000, hours: 8, desc: '₹3,000/mo - Backups, content tweaks & monitoring' },
            premium: { name: 'Premium Support', price: 6000, hours: 16, desc: '₹6,000/mo - 24/7 priority SLA & dedicated support' }
        }
    };

    // Realistic TVM Market Upper Ceilings (Prevents Unrealistic Pricing Explosions)
    const MARKET_CAPS = {
        landing_page: 18000,
        portfolio: 35000,
        business_website: 55000,
        hospital_website: 75000,
        school_portal: 70000,
        corporate_website: 90000,
        booking_website: 80000,
        ecommerce: 100000,
        crm: 200000,
        marketplace: 250000,
        custom_webapp: 220000,
        erp: 350000
    };

    let CONFIG = loadActiveConfig();

    function loadActiveConfig() {
        try {
            const stored = localStorage.getItem('flumenx_smart_config');
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to load custom config:', e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }

    /* --------------------------------------------------------------------------
       2. APP STATE
       -------------------------------------------------------------------------- */
    let state = {
        hasStarted: false,
        currentStep: 1,
        totalSteps: 12,
        projectType: 'business_website',
        businessSize: 'small_business',
        budgeRange: 'b_25k_50k',
        pageCount: 'p1_5',
        cmsOption: 'basic',
        userAccounts: 'none',
        selectedFeatures: ['contact_form', 'responsive_design', 'whatsapp'],
        designStyle: 'basic',
        animationLevel: 'none',
        seoLevel: 'basic',
        timeline: 'normal',
        deployment: 'deployment',
        supportPlan: 'none',
        customNotes: '',
        gstIncluded: true,
        discountPercent: 0, // Manual Discount (0% to 30%)
        profitMarginPercent: 30
    };

    /* SVG Icon Library */
    const ICONS = {
        layout: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',
        globe: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
        briefcase: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
        'shopping-bag': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',
        calendar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
        users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        cpu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>',
        layers: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polygon points="2 17 12 22 22 17 12 12 2 17"></polygon><polygon points="2 12 12 17 22 12 12 7 2 12"></polygon></svg>',
        store: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
        code: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
        check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    };

    /* --------------------------------------------------------------------------
       3. DOM ELEMENTS
       -------------------------------------------------------------------------- */
    const el = {
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        resetBtn: document.getElementById('resetBtn'),
        savedQuotesBtn: document.getElementById('savedQuotesBtn'),
        savedCountBadge: document.getElementById('savedCountBadge'),
        pricingSettingsBtn: document.getElementById('pricingSettingsBtn'),

        progressBarWrapper: document.getElementById('progressBarWrapper'),
        stepCounterText: document.getElementById('stepCounterText'),
        stepTitlePeek: document.getElementById('stepTitlePeek'),
        progressPercentText: document.getElementById('progressPercentText'),
        progressFill: document.getElementById('progressFill'),

        startEstimateBtn: document.getElementById('startEstimateBtn'),
        prevStepBtn: document.getElementById('prevStepBtn'),
        nextStepBtn: document.getElementById('nextStepBtn'),
        footerStepIndicator: document.getElementById('footerStepIndicator'),
        wizardFooter: document.getElementById('wizardFooter'),

        // Step Grids
        projectTypeGrid: document.getElementById('projectTypeGrid'),
        businessSizeGrid: document.getElementById('businessSizeGrid'),
        budgetRangeGrid: document.getElementById('budgetRangeGrid'),
        pageCountGrid: document.getElementById('pageCountGrid'),
        cmsNeedGrid: document.getElementById('cmsNeedGrid'),
        userAccountsGrid: document.getElementById('userAccountsGrid'),
        featuresGrid: document.getElementById('featuresGrid'),
        designStyleGrid: document.getElementById('designStyleGrid'),
        animationsGrid: document.getElementById('animationsGrid'),
        timelineGrid: document.getElementById('timelineGrid'),
        deploymentGrid: document.getElementById('deploymentGrid'),
        supportGrid: document.getElementById('supportGrid'),
        estimateSummaryContainer: document.getElementById('estimateSummaryContainer'),

        // Sidebar
        sidebarTotalAmount: document.getElementById('sidebarTotalAmount'),
        sidebarDevHours: document.getElementById('sidebarDevHours'),
        sidebarTimelineTag: document.getElementById('sidebarTimelineTag'),
        sbSpecProjectType: document.getElementById('sbSpecProjectType'),
        sbSpecBudget: document.getElementById('sbSpecBudget'),
        sbSpecPages: document.getElementById('sbSpecPages'),
        sbSpecDesign: document.getElementById('sbSpecDesign'),
        sidebarFeatureCount: document.getElementById('sidebarFeatureCount'),
        sidebarFeaturesCloud: document.getElementById('sidebarFeaturesCloud'),
        sidebarMiniBreakdown: document.getElementById('sidebarMiniBreakdown'),

        // Modals
        savedQuotesModal: document.getElementById('savedQuotesModal'),
        closeSavedModalBtn: document.getElementById('closeSavedModalBtn'),
        savedQuotesList: document.getElementById('savedQuotesList'),

        pricingSettingsModal: document.getElementById('pricingSettingsModal'),
        closeSettingsModalBtn: document.getElementById('closeSettingsModalBtn'),
        settingsTabs: document.getElementById('settingsTabs'),
        settingsTabContent: document.getElementById('settingsTabContent'),
        saveRatesBtn: document.getElementById('saveRatesBtn'),
        resetDefaultRatesBtn: document.getElementById('resetDefaultRatesBtn')
    };

    /* --------------------------------------------------------------------------
       4. INITIALIZATION & RENDER PIPELINE
       -------------------------------------------------------------------------- */
    function init() {
        initTheme();
        renderAllGrids();
        attachEventListeners();
        updateWizardView();
        updateCalculations();
        updateSavedCount();
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('flumenx_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function formatINR(val) {
        return new Intl.NumberFormat('en-IN').format(Math.round(val));
    }

    /* --------------------------------------------------------------------------
       5. GRID RENDERERS
       -------------------------------------------------------------------------- */
    function renderAllGrids() {
        renderSingleSelectGrid(el.projectTypeGrid, CONFIG.projectTypes, 'projectType', (key) => state.projectType === key, onProjectTypeSelect);
        renderSingleSelectGrid(el.businessSizeGrid, CONFIG.businessSizes, 'businessSize', (key) => state.businessSize === key);
        renderSingleSelectGrid(el.budgetRangeGrid, CONFIG.budgetRanges, 'budgeRange', (key) => state.budgeRange === key);
        renderSingleSelectGrid(el.pageCountGrid, CONFIG.pageCounts, 'pageCount', (key) => state.pageCount === key);
        renderSingleSelectGrid(el.cmsNeedGrid, CONFIG.cmsOptions, 'cmsOption', (key) => state.cmsOption === key);
        renderSingleSelectGrid(el.userAccountsGrid, CONFIG.userAccountOptions, 'userAccounts', (key) => state.userAccounts === key);
        renderMultiSelectGrid(el.featuresGrid, CONFIG.features, 'selectedFeatures', (key) => state.selectedFeatures.includes(key));
        renderSingleSelectGrid(el.designStyleGrid, CONFIG.designStyles, 'designStyle', (key) => state.designStyle === key);
        renderSingleSelectGrid(el.animationsGrid, CONFIG.animations, 'animationLevel', (key) => state.animationLevel === key);
        renderSingleSelectGrid(el.timelineGrid, CONFIG.timelines, 'timeline', (key) => state.timeline === key);
        renderSingleSelectGrid(el.deploymentGrid, CONFIG.deployments, 'deployment', (key) => state.deployment === key);
        renderSingleSelectGrid(el.supportGrid, CONFIG.supportPlans, 'supportPlan', (key) => state.supportPlan === key);
    }

    function onProjectTypeSelect(selectedTypeKey) {
        const item = CONFIG.projectTypes[selectedTypeKey];
        if (item && item.autoSelect) {
            item.autoSelect.forEach(featKey => {
                if (!state.selectedFeatures.includes(featKey)) {
                    state.selectedFeatures.push(featKey);
                }
            });
            renderMultiSelectGrid(el.featuresGrid, CONFIG.features, 'selectedFeatures', (key) => state.selectedFeatures.includes(key));
        }
    }

    function renderSingleSelectGrid(container, items, stateKey, isSelectedFn, extraCallback) {
        if (!container) return;
        container.innerHTML = '';
        Object.keys(items).forEach(key => {
            const item = items[key];
            const isSel = isSelectedFn(key);

            let priceText = 'Included';
            if (item.price !== undefined && item.price > 0) {
                priceText = `+₹${formatINR(item.price)}`;
            }

            const iconHtml = item.icon ? ICONS[item.icon] : ICONS.layout;

            const card = document.createElement('div');
            card.className = `option-card ${isSel ? 'selected' : ''}`;
            card.dataset.key = key;

            card.innerHTML = `
                <div class="card-top">
                    <div class="card-icon">${iconHtml}</div>
                    <div class="card-check">${ICONS.check}</div>
                </div>
                <div>
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-desc">${item.desc || ''}</p>
                </div>
                <span class="card-price-badge">${priceText}</span>
            `;

            card.addEventListener('click', () => {
                state.hasStarted = true;
                state[stateKey] = key;
                renderSingleSelectGrid(container, items, stateKey, isSelectedFn, extraCallback);
                if (extraCallback) extraCallback(key);
                updateCalculations();
            });

            container.appendChild(card);
        });
    }

    function renderMultiSelectGrid(container, items, stateKey, isSelectedFn) {
        if (!container) return;
        container.innerHTML = '';
        Object.keys(items).forEach(key => {
            const item = items[key];
            const isSel = isSelectedFn(key);
            const priceText = item.price > 0 ? `+₹${formatINR(item.price)}` : 'Included';
            const iconHtml = item.icon ? ICONS[item.icon] : ICONS.code;

            const card = document.createElement('div');
            card.className = `option-card ${isSel ? 'selected' : ''}`;
            card.dataset.key = key;

            card.innerHTML = `
                <div class="card-top">
                    <div class="card-icon">${iconHtml}</div>
                    <div class="card-check">${ICONS.check}</div>
                </div>
                <div>
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-desc">${item.desc || ''}</p>
                </div>
                <span class="card-price-badge">${priceText}</span>
            `;

            card.addEventListener('click', () => {
                state.hasStarted = true;
                const list = state[stateKey];
                const idx = list.indexOf(key);
                if (idx > -1) {
                    list.splice(idx, 1);
                } else {
                    list.push(key);
                }
                renderMultiSelectGrid(container, items, stateKey, isSelectedFn);
                updateCalculations();
            });

            container.appendChild(card);
        });
    }

    /* --------------------------------------------------------------------------
       6. WIZARD STEP NAVIGATION
       -------------------------------------------------------------------------- */
    const STEP_TITLES = [
        'Welcome',
        'Project Type',
        'Business Size',
        'Client Budget',
        'Page Volume',
        'Admin Panel',
        'Authentication',
        'Selected Features',
        'Design Upgrade',
        'Animations',
        'Timeline',
        'Hosting & Deployment',
        'Maintenance SLA',
        'Final Executive Estimate'
    ];

    function goToStep(stepNum) {
        if (stepNum < 1) stepNum = 1;
        if (stepNum > 14) stepNum = 14;
        state.currentStep = stepNum;
        updateWizardView();
    }

    function updateWizardView() {
        const step = state.currentStep;

        document.querySelectorAll('.step-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        const currentPanel = document.getElementById(`step-${step}`);
        if (currentPanel) {
            currentPanel.classList.add('active');
        }

        if (step === 1) {
            el.progressBarWrapper.style.display = 'none';
        } else {
            el.progressBarWrapper.style.display = 'block';
            const displayStep = step - 1;
            const maxSteps = 12;
            const percent = Math.min(Math.round((displayStep / maxSteps) * 100), 100);

            el.stepCounterText.textContent = step === 14 ? 'Final Summary' : `Step ${displayStep} of ${maxSteps}`;
            el.stepTitlePeek.textContent = STEP_TITLES[displayStep] || '';
            el.progressPercentText.textContent = `${percent}%`;
            el.progressFill.style.width = `${percent}%`;
        }

        if (step === 1) {
            el.wizardFooter.style.display = 'none';
        } else if (step === 14) {
            el.wizardFooter.style.display = 'flex';
            el.prevStepBtn.disabled = false;
            el.nextStepBtn.style.display = 'none';
            el.footerStepIndicator.textContent = 'Quotation Generated';
            renderFinalSummary();
        } else {
            el.wizardFooter.style.display = 'flex';
            el.prevStepBtn.disabled = false;
            el.nextStepBtn.style.display = 'inline-flex';
            el.footerStepIndicator.textContent = `Step ${step - 1} of 12`;

            if (step === 13) {
                el.nextStepBtn.querySelector('span').textContent = 'Generate Estimate';
            } else {
                el.nextStepBtn.querySelector('span').textContent = 'Next Step';
            }
        }
    }

    /* --------------------------------------------------------------------------
       7. REFACTORED PRICING ENGINE (PURE ADDITIVE MODEL WITH SMART BUNDLES & MARKET CAPS)
       -------------------------------------------------------------------------- */
    function calculateEstimate() {
        const proj = CONFIG.projectTypes[state.projectType] || CONFIG.projectTypes.business_website;
        const biz = CONFIG.businessSizes[state.businessSize] || CONFIG.businessSizes.small_business;
        const page = CONFIG.pageCounts[state.pageCount] || CONFIG.pageCounts.p1_5;
        const cms = CONFIG.cmsOptions[state.cmsOption] || CONFIG.cmsOptions.basic;
        const userAcc = CONFIG.userAccountOptions[state.userAccounts] || CONFIG.userAccountOptions.none;
        const design = CONFIG.designStyles[state.designStyle] || CONFIG.designStyles.basic;
        const anim = CONFIG.animations[state.animationLevel] || CONFIG.animations.none;
        const seo = CONFIG.seoLevels[state.seoLevel] || CONFIG.seoLevels.basic;
        const deploy = CONFIG.deployments[state.deployment] || CONFIG.deployments.deployment;
        const support = CONFIG.supportPlans[state.supportPlan] || CONFIG.supportPlans.none;
        const budgetObj = CONFIG.budgetRanges[state.budgeRange] || CONFIG.budgetRanges.b_25k_50k;

        // 1. Base Project Price (+ Business Size add-on if enterprise)
        let baseWebsiteCost = proj.price + (biz.price || 0);

        // 2. Extra Pages Cost
        let extraPagesCost = page.price || 0;

        // 3. Admin Panel Cost
        let adminPanelCost = cms.price || 0;

        // 4. Authentication Cost
        let authCost = userAcc.price || 0;

        // 5. Features Pricing & Smart Bundles Rule Engine
        const selected = state.selectedFeatures || [];

        // Check Content Management Bundle (Blog + Portfolio + Gallery)
        const cmsModules = ['blog', 'portfolio_feat', 'gallery'];
        const selectedCmsModules = selected.filter(k => cmsModules.includes(k));
        const isCmsBundleApplied = selectedCmsModules.length >= 2;

        // Check E-commerce Bundle (Cart + Wishlist + Payment Gateway)
        const ecomModules = ['cart', 'wishlist', 'payment_gateway'];
        const selectedEcomModules = selected.filter(k => ecomModules.includes(k));
        const isEcomBundleApplied = selectedEcomModules.length >= 2;

        let rawFeaturesSum = 0;
        let bundledFeaturesCost = 0;
        let bundleSavings = 0;
        let featureBreakdownLabels = [];

        selected.forEach(featKey => {
            const feat = CONFIG.features[featKey];
            if (!feat) return;

            // Skip default included features from price sum
            if (feat.defaultIncluded || feat.price === 0) {
                return;
            }

            rawFeaturesSum += feat.price;

            // Apply Smart Bundles logic
            if (isCmsBundleApplied && cmsModules.includes(featKey)) {
                // Handled in bundle sum
            } else if (isEcomBundleApplied && ecomModules.includes(featKey)) {
                // Handled in bundle sum
            } else {
                bundledFeaturesCost += feat.price;
                featureBreakdownLabels.push(`${feat.name} (+₹${formatINR(feat.price)})`);
            }
        });

        if (isCmsBundleApplied) {
            bundledFeaturesCost += 5000;
            featureBreakdownLabels.push('Content Management Package (+₹5,000)');
        }

        if (isEcomBundleApplied) {
            bundledFeaturesCost += 12000;
            featureBreakdownLabels.push('E-commerce Package (+₹12,000)');
        }

        bundleSavings = Math.max(rawFeaturesSum - bundledFeaturesCost, 0);

        // 6. Fixed Design Upgrade
        let designCost = design.price || 0;

        // 7. Fixed Animation Upgrade
        let animationCost = anim.price || 0;

        // 8. Fixed SEO Upgrade
        let seoCost = seo.price || 0;

        // 9. Hosting & Deployment
        let hostingCost = deploy.price || 0;

        // Dev Hours (INFORMATIONAL EFFORT PLANNING ONLY - NEVER MULTIPLIES PRICE)
        let totalHours = (proj.hours || 0) + (page.hours || 0) + (cms.hours || 0) + (userAcc.hours || 0) + (design.hours || 0) + (anim.hours || 0) + (seo.hours || 0) + (deploy.hours || 0);
        selected.forEach(k => {
            if (CONFIG.features[k]) totalHours += (CONFIG.features[k].hours || 0);
        });

        // 10. Raw Additive Subtotal
        let rawAdditiveTotal = baseWebsiteCost + extraPagesCost + adminPanelCost + authCost + bundledFeaturesCost + designCost + animationCost + seoCost + hostingCost;

        // Market Cap Ceiling Enforcement
        let maxAllowedCap = MARKET_CAPS[state.projectType] || 250000;
        let isMarketCapExceeded = rawAdditiveTotal > maxAllowedCap;
        let finalUnDiscountedTotal = isMarketCapExceeded ? maxAllowedCap : rawAdditiveTotal;

        // 11. Manual Discount Slider (0% to 30%)
        let discountPercent = Math.min(Math.max(state.discountPercent || 0, 0), 30);
        let discountAmount = Math.round(finalUnDiscountedTotal * (discountPercent / 100));
        let finalBaseTotal = finalUnDiscountedTotal - discountAmount;

        // 12. Optional GST Tax (18%)
        let gstAmount = state.gstIncluded ? Math.round(finalBaseTotal * 0.18) : 0;
        let grandTotal = finalBaseTotal + gstAmount;

        // Client Target Budget Validation
        let clientTargetBudget = budgetObj.target || 50000;
        let budgetVariance = grandTotal - clientTargetBudget; // > 0 means exceeds budget

        // Internal Profit Calculation (Labor Cost vs Selling Price)
        let devLaborCost = Math.round(finalBaseTotal * 0.50); // 50% internal labor allocation
        let internalProfitAmount = finalBaseTotal - devLaborCost;
        let marginPercent = finalBaseTotal > 0 ? Math.round((internalProfitAmount / finalBaseTotal) * 100) : 0;

        return {
            baseWebsiteCost,
            extraPagesCost,
            adminPanelCost,
            authCost,
            bundledFeaturesCost,
            rawFeaturesSum,
            bundleSavings,
            isCmsBundleApplied,
            isEcomBundleApplied,
            featureBreakdownLabels,
            designCost,
            animationCost,
            seoCost,
            hostingCost,
            rawAdditiveTotal,
            maxAllowedCap,
            isMarketCapExceeded,
            finalUnDiscountedTotal,
            discountPercent,
            discountAmount,
            finalBaseTotal,
            gstAmount,
            grandTotal,
            monthlySupport: support.price || 0,
            totalHours,
            clientTargetBudget,
            budgetVariance,
            devLaborCost,
            internalProfitAmount,
            marginPercent
        };
    }

    function updateCalculations() {
        if (!state.hasStarted) {
            el.sidebarTotalAmount.textContent = '0';
            el.sidebarDevHours.textContent = '0 Hours';
            el.sidebarTimelineTag.textContent = 'Ready';
            el.sbSpecProjectType.textContent = 'Not selected';
            el.sbSpecBudget.textContent = 'Not selected';
            el.sbSpecPages.textContent = 'Not selected';
            el.sbSpecDesign.textContent = 'Not selected';
            el.sidebarFeatureCount.textContent = '0';
            el.sidebarFeaturesCloud.innerHTML = '<span class="empty-cloud-text">No add-on features selected</span>';
            el.sidebarMiniBreakdown.innerHTML = '<span class="empty-cloud-text" style="font-size:0.8rem">Start estimation to see price breakdown</span>';
            return;
        }

        const est = calculateEstimate();

        // Sidebar updates
        el.sidebarTotalAmount.textContent = formatINR(est.grandTotal);
        el.sidebarDevHours.textContent = `Estimated Time: ${est.totalHours} Hours`;

        const timeObj = CONFIG.timelines[state.timeline];
        el.sidebarTimelineTag.textContent = timeObj ? timeObj.name : 'Normal';

        const projObj = CONFIG.projectTypes[state.projectType];
        el.sbSpecProjectType.textContent = projObj ? projObj.name : 'Business Website';

        const budgetObj = CONFIG.budgetRanges[state.budgeRange];
        el.sbSpecBudget.textContent = budgetObj ? budgetObj.name : '₹25K–₹50K';

        const pageObj = CONFIG.pageCounts[state.pageCount];
        el.sbSpecPages.textContent = pageObj ? pageObj.name : '1–5';

        const designObj = CONFIG.designStyles[state.designStyle];
        el.sbSpecDesign.textContent = designObj ? designObj.name : 'Basic';

        // Features Cloud
        el.sidebarFeatureCount.textContent = state.selectedFeatures.length;
        if (state.selectedFeatures.length === 0) {
            el.sidebarFeaturesCloud.innerHTML = '<span class="empty-cloud-text">No add-on features selected</span>';
        } else {
            el.sidebarFeaturesCloud.innerHTML = state.selectedFeatures.map(k => {
                const item = CONFIG.features[k];
                return `<span class="feat-tag">${item ? item.name : k}</span>`;
            }).join('');
        }

        // Mini Sidebar Breakdown Output
        el.sidebarMiniBreakdown.innerHTML = `
            <div class="breakdown-row"><span>Base Website</span> <span class="val">₹${formatINR(est.baseWebsiteCost)}</span></div>
            ${est.extraPagesCost > 0 ? `<div class="breakdown-row"><span>Extra Pages</span> <span class="val">+₹${formatINR(est.extraPagesCost)}</span></div>` : ''}
            ${est.adminPanelCost > 0 ? `<div class="breakdown-row"><span>Admin Panel</span> <span class="val">+₹${formatINR(est.adminPanelCost)}</span></div>` : ''}
            ${est.authCost > 0 ? `<div class="breakdown-row"><span>Authentication</span> <span class="val">+₹${formatINR(est.authCost)}</span></div>` : ''}
            ${est.bundledFeaturesCost > 0 ? `<div class="breakdown-row"><span>Features / Bundle</span> <span class="val">+₹${formatINR(est.bundledFeaturesCost)}</span></div>` : ''}
            ${est.designCost > 0 ? `<div class="breakdown-row"><span>Design</span> <span class="val">+₹${formatINR(est.designCost)}</span></div>` : ''}
            ${est.seoCost > 0 ? `<div class="breakdown-row"><span>SEO</span> <span class="val">+₹${formatINR(est.seoCost)}</span></div>` : ''}
            ${est.hostingCost > 0 ? `<div class="breakdown-row"><span>Hosting</span> <span class="val">+₹${formatINR(est.hostingCost)}</span></div>` : ''}
            ${est.discountAmount > 0 ? `<div class="breakdown-row" style="color:var(--success-color)"><span>Discount (-${est.discountPercent}%)</span> <span class="val">-₹${formatINR(est.discountAmount)}</span></div>` : ''}
            ${state.gstIncluded ? `<div class="breakdown-row"><span>GST Tax (18%)</span> <span class="val">+₹${formatINR(est.gstAmount)}</span></div>` : ''}
        `;
    }

    /* --------------------------------------------------------------------------
       8. FINAL EXECUTIVE ESTIMATE SUMMARY DASHBOARD (STEP 14)
       -------------------------------------------------------------------------- */
    function renderFinalSummary() {
        const est = calculateEstimate();
        const projObj = CONFIG.projectTypes[state.projectType] || CONFIG.projectTypes.business_website;
        const bizObj = CONFIG.businessSizes[state.businessSize] || CONFIG.businessSizes.small_business;
        const budgetObj = CONFIG.budgetRanges[state.budgeRange] || CONFIG.budgetRanges.b_25k_50k;
        const pageObj = CONFIG.pageCounts[state.pageCount] || CONFIG.pageCounts.p1_5;
        const designObj = CONFIG.designStyles[state.designStyle] || CONFIG.designStyles.basic;
        const cmsObj = CONFIG.cmsOptions[state.cmsOption] || CONFIG.cmsOptions.none;
        const userAccObj = CONFIG.userAccountOptions[state.userAccounts] || CONFIG.userAccountOptions.none;
        const seoObj = CONFIG.seoLevels[state.seoLevel] || CONFIG.seoLevels.basic;
        const deployObj = CONFIG.deployments[state.deployment] || CONFIG.deployments.deployment;
        const suppObj = CONFIG.supportPlans[state.supportPlan] || CONFIG.supportPlans.none;

        // Intelligent Validation Callouts
        const validationCallouts = [];

        if (est.isMarketCapExceeded) {
            validationCallouts.push({
                isWarning: true,
                title: '⚠ Price appears higher than typical market value',
                desc: `Uncapped estimate was ₹${formatINR(est.rawAdditiveTotal)}. Applied TVM local market ceiling cap of ₹${formatINR(est.maxAllowedCap)} for ${projObj.name}. Recommended optimizations: (1) Use Modern Design instead of Premium, (2) Remove unnecessary modules, (3) Use Basic Admin, (4) Reduce page count.`
            });
        }

        if (est.budgetVariance > 0) {
            validationCallouts.push({
                isWarning: true,
                title: `⚠ Estimated cost exceeds client's budget by ₹${formatINR(est.budgetVariance)}`,
                desc: `Client budget is ${budgetObj.name}. Consider trimming optional design upgrades or bundling features to fit client budget.`
            });
        }

        if (est.isCmsBundleApplied) {
            validationCallouts.push({
                isWarning: false,
                title: 'Content Management Package Applied',
                desc: `Multiple content modules selected. Auto-applied bundle savings of ₹${formatINR(est.bundleSavings)} (Package Cost: ₹5,000).`
            });
        }

        if (est.isEcomBundleApplied) {
            validationCallouts.push({
                isWarning: false,
                title: 'E-commerce Package Applied',
                desc: 'Shopping Cart, Wishlist & Payment Gateway bundled into E-commerce Package (Package Cost: ₹12,000).'
            });
        }

        validationCallouts.push({
            isWarning: false,
            title: `Estimated Development Time: ${est.totalHours} Hours`,
            desc: 'Internal effort estimate for project scheduling. (Hours do NOT affect client quotation pricing).'
        });

        el.estimateSummaryContainer.innerHTML = `
            <div class="summary-header-banner">
                <div class="banner-left">
                    <h2>FlumenX Client Quotation Summary</h2>
                    <p>TVM Agency Quote • ${projObj.name} (${bizObj.name}) • ${pageObj.name}</p>
                </div>
                <div class="banner-actions">
                    <button type="button" class="btn-secondary" id="saveEstimateTriggerBtn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        <span>Save Quote</span>
                    </button>
                    <button type="button" class="btn-primary" id="printQuoteBtn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        <span>Print / Export PDF</span>
                    </button>
                </div>
            </div>

            <div class="summary-cards-grid">
                <div class="kpi-card">
                    <span class="kpi-lbl">Final Quotation</span>
                    <div class="kpi-val">₹${formatINR(est.grandTotal)}</div>
                    <div class="kpi-sub">${state.gstIncluded ? 'Includes 18% GST' : 'Excludes Tax'}</div>
                </div>
                <div class="kpi-card">
                    <span class="kpi-lbl">Client Budget Match</span>
                    <div class="kpi-val">${budgetObj.name}</div>
                    <div class="kpi-sub" style="color:${est.budgetVariance > 0 ? 'var(--warning-color)' : 'var(--success-color)'}">${est.budgetVariance <= 0 ? '✓ Within Target Budget' : `+₹${formatINR(est.budgetVariance)} Over Target`}</div>
                </div>
                <div class="kpi-card">
                    <span class="kpi-lbl">Estimated Time</span>
                    <div class="kpi-val">${est.totalHours} Hours</div>
                    <div class="kpi-sub">Informational Effort Only</div>
                </div>
                <div class="kpi-card">
                    <span class="kpi-lbl">Maintenance SLA (Separate)</span>
                    <div class="kpi-val">${est.monthlySupport > 0 ? `₹${formatINR(est.monthlySupport)}/mo` : 'None'}</div>
                    <div class="kpi-sub">${suppObj.name}</div>
                </div>
            </div>

            <div class="smart-suggestions-box">
                <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <span>Intelligent Market Validation & Sales Insights</span>
                </h3>
                ${validationCallouts.map(s => `
                    <div class="suggestion-item ${s.isWarning ? 'warning' : ''}">
                        <span class="bullet" style="color:${s.isWarning ? 'var(--danger-color)' : 'var(--success-color)'}">${s.isWarning ? '⚠' : '✓'}</span>
                        <div>
                            <strong style="color:${s.isWarning ? 'var(--danger-color)' : 'var(--text-primary)'}">${s.title}:</strong> ${s.desc}
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Internal Tools: Discount Slider & Profit Margin Calculator (Hidden from Client PDF) -->
            <div class="margin-control-box no-print">
                <div style="flex:1">
                    <span class="margin-title">Internal Sales Discount & Margin Calculator</span>
                    <p style="font-size:0.8rem; color:var(--text-muted)">Internal sales tool only (Hidden from client PDF printouts).</p>
                </div>
                <div class="margin-controls">
                    <span style="font-size:0.85rem; font-weight:600">Manual Discount (0–30%):</span>
                    <input type="range" min="0" max="30" step="5" value="${state.discountPercent}" class="margin-slider" id="discountSlider">
                    <span class="margin-val-badge" id="discountValBadge">${state.discountPercent}%</span>
                </div>
                <div style="font-family:var(--font-mono); font-size:0.85rem">
                    Dev Labor Cost: ₹${formatINR(est.devLaborCost)} | Internal Profit: <span style="color:var(--success-color); font-weight:700">₹${formatINR(est.internalProfitAmount)} (${est.marginPercent}%)</span>
                </div>
                <div class="gst-toggle-wrapper">
                    <span style="font-size:0.85rem; font-weight:600">GST (18%)</span>
                    <label class="switch">
                        <input type="checkbox" id="gstToggleInput" ${state.gstIncluded ? 'checked' : ''}>
                        <span class="slider-round"></span>
                    </label>
                </div>
            </div>

            <!-- Itemized Client Quotation Breakdown Table -->
            <div class="itemized-table-card">
                <div class="table-header">
                    <h3>Itemized Quotation Output</h3>
                    <span class="count-tag">${projObj.name}</span>
                </div>
                <table class="estimate-table">
                    <thead>
                        <tr>
                            <th>Scope Item</th>
                            <th>Detail</th>
                            <th style="text-align:right">Amount (INR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Base Website</strong></td>
                            <td>${projObj.name} (${bizObj.name})</td>
                            <td class="col-price">₹${formatINR(est.baseWebsiteCost)}</td>
                        </tr>
                        <tr>
                            <td><strong>Extra Pages</strong></td>
                            <td>${pageObj.name}</td>
                            <td class="col-price">${est.extraPagesCost > 0 ? '₹' + formatINR(est.extraPagesCost) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Admin Panel</strong></td>
                            <td>${cmsObj.name}</td>
                            <td class="col-price">${est.adminPanelCost > 0 ? '₹' + formatINR(est.adminPanelCost) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Authentication</strong></td>
                            <td>${userAccObj.name}</td>
                            <td class="col-price">${est.authCost > 0 ? '₹' + formatINR(est.authCost) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Features / Smart Package</strong></td>
                            <td>${est.featureBreakdownLabels.length > 0 ? est.featureBreakdownLabels.join(' + ') : 'Contact Form, Responsive Design, SSL, Basic SEO (Included)'}</td>
                            <td class="col-price">${est.bundledFeaturesCost > 0 ? '₹' + formatINR(est.bundledFeaturesCost) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Design Upgrade</strong></td>
                            <td>${designObj.name}</td>
                            <td class="col-price">${est.designCost > 0 ? '₹' + formatINR(est.designCost) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Animations</strong></td>
                            <td>${(CONFIG.animations[state.animationLevel] || {}).name}</td>
                            <td class="col-price">${est.animationCost > 0 ? '₹' + formatINR(est.animationCost) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>SEO Scope</strong></td>
                            <td>${seoObj.name}</td>
                            <td class="col-price">${est.seoCost > 0 ? '₹' + formatINR(est.seoCost) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Hosting & Deployment</strong></td>
                            <td>${deployObj.name}</td>
                            <td class="col-price">${est.hostingCost > 0 ? '₹' + formatINR(est.hostingCost) : 'Included'}</td>
                        </tr>
                        ${est.discountAmount > 0 ? `
                        <tr style="color:var(--success-color)">
                            <td><strong>Manual Discount (-${est.discountPercent}%)</strong></td>
                            <td>Special client concession</td>
                            <td class="col-price">-₹${formatINR(est.discountAmount)}</td>
                        </tr>` : ''}
                        <tr class="total-row">
                            <td colspan="2">Subtotal Project Price</td>
                            <td class="col-price">₹${formatINR(est.finalBaseTotal)}</td>
                        </tr>
                        ${state.gstIncluded ? `
                        <tr>
                            <td colspan="2">GST Tax (18%)</td>
                            <td class="col-price">₹${formatINR(est.gstAmount)}</td>
                        </tr>` : ''}
                        <tr class="grand-total-row">
                            <td colspan="2">Final Estimate</td>
                            <td class="col-price">₹${formatINR(est.grandTotal)}</td>
                        </tr>
                        ${est.monthlySupport > 0 ? `
                        <tr style="background-color:rgba(99,102,241,0.05)">
                            <td colspan="2"><strong>Maintenance SLA (Displayed Separately)</strong></td>
                            <td class="col-price" style="color:var(--accent-primary)">₹${formatINR(est.monthlySupport)}/month</td>
                        </tr>` : ''}
                    </tbody>
                </table>
            </div>
        `;

        // Attach listeners for internal controls
        const discountSlider = document.getElementById('discountSlider');
        const gstToggleInput = document.getElementById('gstToggleInput');
        const saveEstimateTriggerBtn = document.getElementById('saveEstimateTriggerBtn');
        const printQuoteBtn = document.getElementById('printQuoteBtn');

        if (discountSlider) {
            discountSlider.addEventListener('input', (e) => {
                state.discountPercent = parseInt(e.target.value, 10);
                renderFinalSummary();
            });
        }

        if (gstToggleInput) {
            gstToggleInput.addEventListener('change', (e) => {
                state.gstIncluded = e.target.checked;
                renderFinalSummary();
            });
        }

        if (saveEstimateTriggerBtn) {
            saveEstimateTriggerBtn.addEventListener('click', saveCurrentEstimatePrompt);
        }

        if (printQuoteBtn) {
            printQuoteBtn.addEventListener('click', () => window.print());
        }
    }

    /* --------------------------------------------------------------------------
       9. DYNAMIC RATE MANAGER SETTINGS EDITOR
       -------------------------------------------------------------------------- */
    let currentSettingsTab = 'projectTypes';

    function openPricingSettingsModal() {
        renderSettingsTabs();
        renderSettingsTabContent(currentSettingsTab);
        el.pricingSettingsModal.classList.remove('hidden');
    }

    function renderSettingsTabs() {
        if (!el.settingsTabs) return;
        const tabs = [
            { id: 'projectTypes', label: 'Project Types' },
            { id: 'businessSizes', label: 'Business Sizes' },
            { id: 'pageCounts', label: 'Page Volume' },
            { id: 'cmsOptions', label: 'Admin Panel' },
            { id: 'userAccountOptions', label: 'Authentication' },
            { id: 'features', label: 'Features' },
            { id: 'designStyles', label: 'Design Styles' },
            { id: 'animations', label: 'Animations' },
            { id: 'seoLevels', label: 'SEO' },
            { id: 'deployments', label: 'Hosting' },
            { id: 'supportPlans', label: 'Maintenance' }
        ];

        el.settingsTabs.innerHTML = tabs.map(t => `
            <button type="button" class="tab-btn ${t.id === currentSettingsTab ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>
        `).join('');

        el.settingsTabs.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentSettingsTab = btn.dataset.tab;
                renderSettingsTabs();
                renderSettingsTabContent(currentSettingsTab);
            });
        });
    }

    function renderSettingsTabContent(tabCategory) {
        if (!el.settingsTabContent) return;
        const items = CONFIG[tabCategory] || {};
        el.settingsTabContent.innerHTML = '';

        Object.keys(items).forEach(key => {
            const item = items[key];
            const row = document.createElement('div');
            row.className = 'setting-row';

            row.innerHTML = `
                <div class="setting-label">${item.name}</div>
                <div class="setting-input-group">
                    <label>Price (₹)</label>
                    <input type="number" step="100" class="setting-input val-input" data-cat="${tabCategory}" data-key="${key}" data-field="price" value="${item.price || 0}">
                </div>
                <div class="setting-input-group">
                    <label>Hours (Informational)</label>
                    <input type="number" step="1" class="setting-input hrs-input" data-cat="${tabCategory}" data-key="${key}" data-field="hours" value="${item.hours !== undefined ? item.hours : 0}">
                </div>
            `;

            el.settingsTabContent.appendChild(row);
        });
    }

    function saveAllSettingsFromModal() {
        if (!el.settingsTabContent) return;
        const inputs = el.pricingSettingsModal.querySelectorAll('.setting-input');
        inputs.forEach(input => {
            const cat = input.dataset.cat;
            const key = input.dataset.key;
            const field = input.dataset.field;
            const val = parseFloat(input.value) || 0;

            if (CONFIG[cat] && CONFIG[cat][key]) {
                CONFIG[cat][key][field] = val;
            }
        });

        localStorage.setItem('flumenx_smart_config', JSON.stringify(CONFIG));
        renderAllGrids();
        updateCalculations();
        el.pricingSettingsModal.classList.add('hidden');
        alert('Pricing configuration updated and saved successfully!');
    }

    function resetToDefaultRates() {
        if (confirm('Reset all rates back to default TVM agency rates?')) {
            CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            localStorage.removeItem('flumenx_smart_config');
            renderAllGrids();
            updateCalculations();
            renderSettingsTabContent(currentSettingsTab);
            alert('Rates reset to default TVM agency rates.');
        }
    }

    /* --------------------------------------------------------------------------
       10. LOCAL STORAGE & SAVED QUOTES MANAGER
       -------------------------------------------------------------------------- */
    function getSavedQuotes() {
        try {
            return JSON.parse(localStorage.getItem('flumenx_saved_quotes') || '[]');
        } catch (e) {
            return [];
        }
    }

    function updateSavedCount() {
        const quotes = getSavedQuotes();
        if (el.savedCountBadge) {
            el.savedCountBadge.textContent = quotes.length;
        }
    }

    function saveCurrentEstimatePrompt() {
        const est = calculateEstimate();
        const projObj = CONFIG.projectTypes[state.projectType] || CONFIG.projectTypes.business_website;
        const defaultName = `Quote - ${projObj.name} (₹${formatINR(est.grandTotal)})`;

        const name = prompt('Enter a client or project identifier for this estimate:', defaultName);
        if (!name) return;

        const record = {
            id: 'quote_' + Date.now(),
            name: name.trim(),
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            state: JSON.parse(JSON.stringify(state)),
            grandTotal: est.grandTotal
        };

        const quotes = getSavedQuotes();
        quotes.unshift(record);
        localStorage.setItem('flumenx_saved_quotes', JSON.stringify(quotes));

        updateSavedCount();
        alert('Estimate saved successfully!');
    }

    function openSavedQuotesModal() {
        const quotes = getSavedQuotes();
        if (!el.savedQuotesList) return;

        if (quotes.length === 0) {
            el.savedQuotesList.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:2rem 0">No saved quotes found.</p>';
        } else {
            el.savedQuotesList.innerHTML = quotes.map(q => `
                <div class="saved-quote-item">
                    <div class="saved-quote-info">
                        <h4>${escapeHtml(q.name)}</h4>
                        <p>Saved on ${q.date} • Total: ₹${formatINR(q.grandTotal)}</p>
                    </div>
                    <div class="saved-quote-actions">
                        <button type="button" class="btn-secondary load-quote-btn" data-id="${q.id}">Load</button>
                        <button type="button" class="btn-secondary delete-quote-btn" data-id="${q.id}" style="color:var(--danger-color)">&times;</button>
                    </div>
                </div>
            `).join('');

            el.savedQuotesList.querySelectorAll('.load-quote-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const qId = btn.dataset.id;
                    const found = quotes.find(item => item.id === qId);
                    if (found) {
                        state = JSON.parse(JSON.stringify(found.state));
                        state.hasStarted = true;
                        renderAllGrids();
                        updateCalculations();
                        goToStep(14);
                        el.savedQuotesModal.classList.add('hidden');
                    }
                });
            });

            el.savedQuotesList.querySelectorAll('.delete-quote-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const qId = btn.dataset.id;
                    const updated = getSavedQuotes().filter(item => item.id !== qId);
                    localStorage.setItem('flumenx_saved_quotes', JSON.stringify(updated));
                    updateSavedCount();
                    openSavedQuotesModal();
                });
            });
        }

        el.savedQuotesModal.classList.remove('hidden');
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    /* --------------------------------------------------------------------------
       11. EVENT LISTENERS
       -------------------------------------------------------------------------- */
    function attachEventListeners() {
        // Theme toggle
        if (el.themeToggleBtn) {
            el.themeToggleBtn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme') || 'dark';
                const next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('flumenx_theme', next);
            });
        }

        // Start Estimate
        if (el.startEstimateBtn) {
            el.startEstimateBtn.addEventListener('click', () => {
                state.hasStarted = true;
                updateCalculations();
                goToStep(2);
            });
        }

        // Step Navigation
        if (el.nextStepBtn) {
            el.nextStepBtn.addEventListener('click', () => {
                if (state.currentStep < 14) {
                    goToStep(state.currentStep + 1);
                }
            });
        }

        if (el.prevStepBtn) {
            el.prevStepBtn.addEventListener('click', () => {
                if (state.currentStep > 1) {
                    goToStep(state.currentStep - 1);
                }
            });
        }

        // Saved Quotes Modal
        if (el.savedQuotesBtn) {
            el.savedQuotesBtn.addEventListener('click', openSavedQuotesModal);
        }

        if (el.closeSavedModalBtn) {
            el.closeSavedModalBtn.addEventListener('click', () => {
                el.savedQuotesModal.classList.add('hidden');
            });
        }

        // Pricing Settings Modal & Rate Editor
        if (el.pricingSettingsBtn) {
            el.pricingSettingsBtn.addEventListener('click', openPricingSettingsModal);
        }

        if (el.closeSettingsModalBtn) {
            el.closeSettingsModalBtn.addEventListener('click', () => {
                el.pricingSettingsModal.classList.add('hidden');
            });
        }

        if (el.saveRatesBtn) {
            el.saveRatesBtn.addEventListener('click', saveAllSettingsFromModal);
        }

        if (el.resetDefaultRatesBtn) {
            el.resetDefaultRatesBtn.addEventListener('click', resetToDefaultRates);
        }

        // Reset Estimator
        if (el.resetBtn) {
            el.resetBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset the calculator?')) {
                    state = {
                        hasStarted: false,
                        currentStep: 1,
                        totalSteps: 12,
                        projectType: 'business_website',
                        businessSize: 'small_business',
                        budgeRange: 'b_25k_50k',
                        pageCount: 'p1_5',
                        cmsOption: 'basic',
                        userAccounts: 'none',
                        selectedFeatures: ['contact_form', 'responsive_design', 'whatsapp'],
                        designStyle: 'basic',
                        animationLevel: 'none',
                        seoLevel: 'basic',
                        timeline: 'normal',
                        deployment: 'deployment',
                        supportPlan: 'none',
                        customNotes: '',
                        gstIncluded: true,
                        discountPercent: 0,
                        profitMarginPercent: 30
                    };

                    renderAllGrids();
                    updateCalculations();
                    goToStep(1);
                }
            });
        }
    }

    // Run Initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
