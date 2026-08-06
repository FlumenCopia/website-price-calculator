/* ==========================================================================
   FLUMENX SMART WEBSITE PRICING CALCULATOR - LOGIC ENGINE
   Local Digital Agency Pricing Philosophy (TVM, Kerala Rates)
   ========================================================================== */

(function () {
    'use strict';

    /* --------------------------------------------------------------------------
       1. DEFAULT LOCAL AGENCY TVM RATES CONFIGURATION
       -------------------------------------------------------------------------- */
    const DEFAULT_CONFIG = {
        projectTypes: {
            landing_page: { name: 'Landing Page', price: 10000, hours: 25, desc: 'Single high-converting page for marketing & lead gen', icon: 'layout' },
            business_website: { name: 'Business Website', price: 22000, hours: 45, desc: 'Standard multi-page site for local business presentation', icon: 'globe' },
            corporate_website: { name: 'Corporate Website', price: 40000, hours: 70, desc: 'Multi-section corporate portal with compliance pages', icon: 'briefcase' },
            hospital_website: { name: 'Hospital Website', price: 45000, hours: 130, desc: 'Medical clinic / hospital portal with doctor booking', icon: 'users', autoSelect: ['booking', 'notifications'] },
            school_portal: { name: 'School Website', price: 40000, hours: 120, desc: 'Educational institution site with news, staff & notices', icon: 'layers', autoSelect: ['reports', 'notifications'] },
            ecommerce: { name: 'E-commerce Store', price: 60000, hours: 110, desc: 'Online store with catalog, cart & payment gateway', icon: 'shopping-bag', autoSelect: ['payment_gateway', 'store', 'admin_dashboard'] },
            booking_website: { name: 'Booking Platform', price: 50000, hours: 100, desc: 'Appointment scheduling & reservation engine', icon: 'calendar', autoSelect: ['booking', 'payment_gateway', 'notifications'] },
            crm: { name: 'CRM System', price: 100000, hours: 160, desc: 'Lead pipeline management & client CRM portal', icon: 'cpu', autoSelect: ['admin_dashboard', 'reports', 'notifications'] },
            erp: { name: 'ERP System', price: 180000, hours: 220, desc: 'Resource planning for inventory, HR & operations', icon: 'layers', autoSelect: ['admin_dashboard', 'reports', 'notifications'] },
            custom_webapp: { name: 'Custom Web Application', price: 140000, hours: 180, desc: 'Tailor-made web app built to custom business workflow', icon: 'code' }
        },

        businessSizes: {
            individual: { name: 'Individual', price: 0, desc: 'Personal portfolio, freelancer, or solo practitioner' },
            startup: { name: 'Startup', price: 0, desc: 'Early-stage venture or emerging local brand' },
            small_business: { name: 'Small Business', price: 2000, desc: 'Local business, clinic, or service shop (+₹2,000)' },
            medium_business: { name: 'Medium Business', price: 5000, desc: 'Established company with multi-team workflows (+₹5,000)' },
            large_company: { name: 'Large Company', price: 10000, desc: 'Corporate enterprise requiring SLA & scale (+₹10,000)' }
        },

        budgetRanges: {
            b_under_25k: { name: 'Under ₹25,000', target: 25000, desc: 'Economy essential budget' },
            b_25k_50k: { name: '₹25,000 – ₹50,000', target: 50000, desc: 'Standard local business budget' },
            b_50k_75k: { name: '₹50,000 – ₹75,000', target: 75000, desc: 'Growth & e-commerce budget' },
            b_75k_1lakh: { name: '₹75,000 – ₹1 Lakh', target: 100000, desc: 'Advanced portal budget' },
            b_1l_plus: { name: '₹1 Lakh+', target: 150000, desc: 'Custom enterprise budget' }
        },

        pageCounts: {
            p1_5: { name: '1–5 Pages', price: 0, hours: 0, desc: 'Included in base price' },
            p6_10: { name: '6–10 Pages', price: 6000, hours: 10, desc: 'Avg +₹1,200 per page' },
            p11_20: { name: '11–20 Pages', price: 12000, hours: 20, desc: 'Avg +₹1,200 per page' },
            p20_plus: { name: '20+ Pages', price: 25000, hours: 45, desc: 'Custom high-volume architecture' }
        },

        cmsOptions: {
            no: { name: 'No', price: 0, hours: 0, desc: 'Content updated directly in code' },
            occasionally: { name: 'Yes, occasionally', price: 2000, hours: 5, desc: 'Basic CMS for blog or news updates' },
            frequently: { name: 'Yes, frequently', price: 5000, hours: 10, desc: 'Full CMS dashboard for daily team updates' }
        },

        userAccountOptions: {
            none: { name: 'No', price: 0, hours: 0, desc: 'Public website without logins' },
            customers: { name: 'Customers Only', price: 4000, hours: 8, desc: 'Client login & registration portal' },
            staff: { name: 'Staff Only', price: 5000, hours: 10, desc: 'Internal employee login & role rules' },
            both: { name: 'Both Customers & Staff', price: 8000, hours: 18, desc: 'Multi-role authentication system' }
        },

        features: {
            contact_form: { name: 'Contact Form', price: 0, hours: 2, desc: 'Included in base package', icon: 'code' },
            blog: { name: 'Blog', price: 2000, hours: 5, desc: 'Articles & publishing CMS', icon: 'layout' },
            gallery: { name: 'Photo Gallery', price: 2000, hours: 4, desc: 'Lightbox media grid', icon: 'globe' },
            search: { name: 'Instant Search', price: 2000, hours: 4, desc: 'Live instant search filter', icon: 'code' },
            whatsapp: { name: 'WhatsApp Direct', price: 1000, hours: 2, desc: 'Click to chat lead link', icon: 'code' },
            maps: { name: 'Google Maps API', price: 1500, hours: 3, desc: 'Location map pins setup', icon: 'globe' },
            chat: { name: 'Live Chat Support', price: 2000, hours: 4, desc: 'Live chat support widget', icon: 'code' },
            reviews: { name: 'Reviews & Ratings', price: 2500, hours: 4, desc: 'Customer star reviews', icon: 'users' },
            notifications: { name: 'Notifications', price: 3000, hours: 5, desc: 'Email / SMS alert system', icon: 'code' },
            reports: { name: 'Reports & Export', price: 5000, hours: 8, desc: 'PDF / Excel exports & metrics', icon: 'layers' },
            multilang: { name: 'Multi-language (i18n)', price: 6000, hours: 10, desc: 'Multi-lingual content engine', icon: 'globe' },
            payment_gateway: { name: 'Online Payments', price: 8000, hours: 10, desc: 'Razorpay / Stripe / UPI integration', icon: 'shopping-bag' },
            booking: { name: 'Booking Engine', price: 8000, hours: 12, desc: 'Calendar reservation slot engine', icon: 'calendar' },
            api_integration: { name: 'Custom API Integration', price: 8000, hours: 12, desc: 'Connect 3rd-party REST APIs', icon: 'code' },
            admin_dashboard: { name: 'Admin Dashboard', price: 10000, hours: 18, desc: 'Management control panel', icon: 'cpu' },
            store: { name: 'Online Store Engine', price: 10000, hours: 15, desc: 'Product catalog & cart drawer', icon: 'store' }
        },

        designStyles: {
            simple: { name: 'Simple', price: 0, hours: 0, desc: 'Clean, minimal standard UI design (+₹0)' },
            modern: { name: 'Modern', price: 5000, hours: 10, desc: 'Sleek custom component styling (+₹5,000)' },
            premium: { name: 'Premium', price: 10000, hours: 20, desc: 'Linear / Framer level polished UI (+₹10,000)' },
            luxury: { name: 'Luxury', price: 20000, hours: 35, desc: 'Bespoke motion & high-end art direction (+₹20,000)' }
        },

        animations: {
            none: { name: 'None', price: 0, hours: 0, desc: 'Standard static transitions (+₹0)' },
            basic: { name: 'Basic', price: 2000, hours: 3, desc: 'Smooth fade-in & hover effects (+₹2,000)' },
            advanced: { name: 'Advanced', price: 5000, hours: 8, desc: 'Scroll triggers & motion graphics (+₹5,000)' },
            premium: { name: 'Premium', price: 10000, hours: 18, desc: 'Advanced WebGL & interactive motion (+₹10,000)' }
        },

        seoLevels: {
            basic: { name: 'Basic SEO', price: 0, hours: 2, desc: 'Included in base package' },
            advanced: { name: 'Advanced SEO', price: 3000, hours: 6, desc: 'Schema markup & Speed optimization (+₹3,000)' },
            enterprise: { name: 'Enterprise SEO', price: 8000, hours: 15, desc: 'Programmatic SEO & multi-region setup (+₹8,000)' }
        },

        timelines: {
            flexible: { name: 'Flexible', mult: 0.95, desc: 'Economy pace (-5% discount)' },
            normal: { name: 'Normal', mult: 1.0, desc: 'Standard 3–5 weeks delivery' },
            priority: { name: 'Priority', mult: 1.10, desc: 'Fast-track 2–3 weeks (+10%)' },
            urgent: { name: 'Urgent', mult: 1.20, desc: 'Rush 1–2 weeks (+20% surcharge)' }
        },

        deployments: {
            client: { name: 'Client', price: 0, hours: 0, desc: 'Client handles server & hosting (+₹0)' },
            deploy_only: { name: 'Deployment Only', price: 2000, hours: 2, desc: 'Deploy to Vercel / Hostinger / VPS (+₹2,000)' },
            server_setup: { name: 'VPS Setup', price: 5000, hours: 6, desc: 'Linux VPS, SSL & Nginx setup (+₹5,000)' },
            cloud: { name: 'Cloud Infrastructure', price: 10000, hours: 14, desc: 'AWS / GCP cloud setup & CI/CD (+₹10,000)' }
        },

        supportPlans: {
            none: { name: 'No Maintenance', price: 0, hours: 0, desc: 'No monthly maintenance contract' },
            basic: { name: 'Basic Support', price: 1500, hours: 3, desc: '₹1,500/mo - Security updates & bug fixes' },
            standard: { name: 'Standard Support', price: 3000, hours: 8, desc: '₹3,000/mo - Backups, content tweaks & monitoring' },
            premium: { name: 'Premium Support', price: 6000, hours: 16, desc: '₹6,000/mo - 24/7 priority SLA & dedicated support' }
        }
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
        cmsOption: 'occasionally',
        userAccounts: 'none',
        selectedFeatures: ['contact_form'],
        designStyle: 'simple',
        animationLevel: 'none',
        timeline: 'normal',
        deployment: 'deploy_only',
        supportPlan: 'none',
        customNotes: '',
        gstIncluded: true,
        discountPercent: 0,
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
        // Auto-recommend features based on Project Type
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

            let priceText = '';
            if (item.price !== undefined) {
                priceText = item.price > 0 ? `+₹${formatINR(item.price)}` : 'Included';
            } else if (item.mult !== undefined) {
                priceText = item.mult === 1.0 ? '1.0x Rush' : `${item.mult}x Rush`;
            } else if (item.target !== undefined) {
                priceText = 'Target Budget';
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
        'Page Count',
        'Content Management',
        'User Accounts',
        'Online Features',
        'Design Style',
        'Animations',
        'Timeline',
        'Deployment',
        'Support SLA',
        'Executive Estimate'
    ];

    function goToStep(stepNum) {
        if (stepNum < 1) stepNum = 1;
        if (stepNum > 14) stepNum = 14;
        state.currentStep = stepNum;
        updateWizardView();
    }

    function updateWizardView() {
        const step = state.currentStep;

        // Hide all step panels
        document.querySelectorAll('.step-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Show active panel
        const currentPanel = document.getElementById(`step-${step}`);
        if (currentPanel) {
            currentPanel.classList.add('active');
        }

        // Progress bar updates
        if (step === 1) {
            el.progressBarWrapper.style.display = 'none';
        } else {
            el.progressBarWrapper.style.display = 'block';
            const displayStep = step - 1; // 1 to 12
            const maxSteps = 12;
            const percent = Math.min(Math.round((displayStep / maxSteps) * 100), 100);

            el.stepCounterText.textContent = step === 14 ? 'Final Summary' : `Step ${displayStep} of ${maxSteps}`;
            el.stepTitlePeek.textContent = STEP_TITLES[displayStep] || '';
            el.progressPercentText.textContent = `${percent}%`;
            el.progressFill.style.width = `${percent}%`;
        }

        // Footer buttons
        if (step === 1) {
            el.wizardFooter.style.display = 'none';
        } else if (step === 14) {
            el.wizardFooter.style.display = 'flex';
            el.prevStepBtn.disabled = false;
            el.nextStepBtn.style.display = 'none';
            el.footerStepIndicator.textContent = 'Estimate Generated';
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
       7. LOCAL TVM AGENCY PRICING CALCULATOR ENGINE (FIXED ADDITIVE MODEL)
       -------------------------------------------------------------------------- */
    function calculateEstimate() {
        const proj = CONFIG.projectTypes[state.projectType] || CONFIG.projectTypes.business_website;
        const biz = CONFIG.businessSizes[state.businessSize] || CONFIG.businessSizes.small_business;
        const page = CONFIG.pageCounts[state.pageCount] || CONFIG.pageCounts.p1_5;
        const cms = CONFIG.cmsOptions[state.cmsOption] || CONFIG.cmsOptions.no;
        const userAcc = CONFIG.userAccountOptions[state.userAccounts] || CONFIG.userAccountOptions.none;
        const design = CONFIG.designStyles[state.designStyle] || CONFIG.designStyles.simple;
        const anim = CONFIG.animations[state.animationLevel] || CONFIG.animations.none;
        const time = CONFIG.timelines[state.timeline] || CONFIG.timelines.normal;
        const deploy = CONFIG.deployments[state.deployment] || CONFIG.deployments.deploy_only;
        const support = CONFIG.supportPlans[state.supportPlan] || CONFIG.supportPlans.none;
        const budgetObj = CONFIG.budgetRanges[state.budgeRange] || CONFIG.budgetRanges.b_25k_50k;

        // Base Website = Base Project Type + Business Size increment
        let baseWebsiteCost = proj.price + (biz.price || 0);
        let baseHours = proj.hours || 0;

        // Page volume cost
        let pageCost = page.price || 0;

        // Features sum
        let featuresCost = 0;
        let featuresHours = 0;
        state.selectedFeatures.forEach(featKey => {
            const feat = CONFIG.features[featKey];
            if (feat) {
                featuresCost += (feat.price || 0);
                featuresHours += (feat.hours || 0);
            }
        });

        // Additional scope addons (CMS + User Accounts + Features + Animations)
        let totalFeaturesCost = featuresCost + (cms.price || 0) + (userAcc.price || 0) + (anim.price || 0);

        // Fixed Design cost & Deployment cost
        let designCost = design.price || 0;
        let deploymentCost = deploy.price || 0;

        // Subtotal before timeline surcharge and discount
        let rawSubtotal = baseWebsiteCost + pageCost + totalFeaturesCost + designCost + deploymentCost;

        // Apply Timeline Rush multiplier if Priority or Urgent
        let timeMult = time.mult !== undefined ? time.mult : 1.0;
        let timelineSubtotal = Math.round(rawSubtotal * timeMult);

        // Apply Internal Sales Discount
        let discountPercent = state.discountPercent || 0;
        let discountAmount = Math.round(timelineSubtotal * (discountPercent / 100));
        let finalBaseTotal = timelineSubtotal - discountAmount;

        // Dev Hours (strictly internal effort planning - NOT multiplied by rate)
        let totalHours = (baseHours + (page.hours || 0) + (cms.hours || 0) + (userAcc.hours || 0) + featuresHours + (design.hours || 0) + (anim.hours || 0) + (deploy.hours || 0));
        let frontendHours = Math.round(totalHours * 0.50);
        let backendHours = Math.round(totalHours * 0.30);
        let testingHours = Math.round(totalHours * 0.12);
        let deploymentHours = Math.max(Math.round(totalHours * 0.08), 2);

        // GST Tax (18%)
        let gstAmount = state.gstIncluded ? Math.round(finalBaseTotal * 0.18) : 0;
        let grandTotal = finalBaseTotal + gstAmount;

        // Client Target Budget Comparison
        let clientTargetBudget = budgetObj.target || 50000;
        let budgetVariance = grandTotal - clientTargetBudget; // > 0 means exceeds budget

        // Project Complexity Rating (1-10)
        let complexityScore = 2;
        if (state.selectedFeatures.length >= 4) complexityScore += 2;
        if (state.selectedFeatures.length >= 8) complexityScore += 2;
        if (state.userAccounts !== 'none') complexityScore += 1;
        if (state.cmsOption === 'frequently') complexityScore += 1;
        if (['ecommerce', 'crm', 'erp', 'custom_webapp'].includes(state.projectType)) complexityScore += 2;
        complexityScore = Math.min(Math.max(complexityScore, 1), 10);

        // 3 Estimate Quotation Levels
        let economyQuote = Math.round(grandTotal * 0.82); // Economy scope (~18% lower)
        let recommendedQuote = Math.round(grandTotal);
        let premiumQuote = Math.round(grandTotal * 1.25); // Premium scope (+25%)

        // Internal Profit Calculation (Dev Cost vs Selling Price)
        let devCost = Math.round(finalBaseTotal * 0.55); // 55% internal labor cost
        let profitAmount = finalBaseTotal - devCost;
        let marginPercent = finalBaseTotal > 0 ? Math.round((profitAmount / finalBaseTotal) * 100) : 0;

        return {
            baseWebsiteCost,
            pageCost,
            totalFeaturesCost,
            featuresCostOnly: featuresCost,
            cmsCost: cms.price || 0,
            userAccCost: userAcc.price || 0,
            animCost: anim.price || 0,
            designCost,
            deploymentCost,
            rawSubtotal,
            timelineSubtotal,
            discountPercent,
            discountAmount,
            finalBaseTotal,
            gstAmount,
            grandTotal,
            monthlySupport: support.price || 0,
            totalHours,
            frontendHours,
            backendHours,
            testingHours,
            deploymentHours,
            clientTargetBudget,
            budgetVariance,
            complexityScore,
            economyQuote,
            recommendedQuote,
            premiumQuote,
            devCost,
            profitAmount,
            marginPercent
        };
    }

    function updateCalculations() {
        if (!state.hasStarted) {
            el.sidebarTotalAmount.textContent = '0';
            el.sidebarDevHours.textContent = '0 dev hrs';
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
        el.sidebarDevHours.textContent = `${est.totalHours} dev hrs`;

        const timeObj = CONFIG.timelines[state.timeline];
        el.sidebarTimelineTag.textContent = timeObj ? timeObj.name : 'Normal';

        const projObj = CONFIG.projectTypes[state.projectType];
        el.sbSpecProjectType.textContent = projObj ? projObj.name : 'Business Website';

        const budgetObj = CONFIG.budgetRanges[state.budgeRange];
        el.sbSpecBudget.textContent = budgetObj ? budgetObj.name : '₹25K–₹50K';

        const pageObj = CONFIG.pageCounts[state.pageCount];
        el.sbSpecPages.textContent = pageObj ? pageObj.name : '1–5';

        const designObj = CONFIG.designStyles[state.designStyle];
        el.sbSpecDesign.textContent = designObj ? designObj.name : 'Simple';

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

        // Mini Breakdown
        el.sidebarMiniBreakdown.innerHTML = `
            <div class="breakdown-row"><span>Base Website</span> <span class="val">₹${formatINR(est.baseWebsiteCost)}</span></div>
            ${est.pageCost > 0 ? `<div class="breakdown-row"><span>Pages</span> <span class="val">+₹${formatINR(est.pageCost)}</span></div>` : ''}
            ${est.totalFeaturesCost > 0 ? `<div class="breakdown-row"><span>Features</span> <span class="val">+₹${formatINR(est.totalFeaturesCost)}</span></div>` : ''}
            ${est.designCost > 0 ? `<div class="breakdown-row"><span>Design</span> <span class="val">+₹${formatINR(est.designCost)}</span></div>` : ''}
            ${est.deploymentCost > 0 ? `<div class="breakdown-row"><span>Deployment</span> <span class="val">+₹${formatINR(est.deploymentCost)}</span></div>` : ''}
            ${est.discountAmount > 0 ? `<div class="breakdown-row" style="color:var(--success-color)"><span>Discount (-${est.discountPercent}%)</span> <span class="val">-₹${formatINR(est.discountAmount)}</span></div>` : ''}
            ${state.gstIncluded ? `<div class="breakdown-row"><span>GST Tax (18%)</span> <span class="val">+₹${formatINR(est.gstAmount)}</span></div>` : ''}
        `;
    }

    /* --------------------------------------------------------------------------
       8. FINAL ESTIMATE DASHBOARD & PROPOSAL SHEET (STEP 14)
       -------------------------------------------------------------------------- */
    function renderFinalSummary() {
        const est = calculateEstimate();
        const projObj = CONFIG.projectTypes[state.projectType] || CONFIG.projectTypes.business_website;
        const bizObj = CONFIG.businessSizes[state.businessSize] || CONFIG.businessSizes.small_business;
        const budgetObj = CONFIG.budgetRanges[state.budgeRange] || CONFIG.budgetRanges.b_25k_50k;
        const pageObj = CONFIG.pageCounts[state.pageCount] || CONFIG.pageCounts.p1_5;
        const designObj = CONFIG.designStyles[state.designStyle] || CONFIG.designStyles.simple;
        const timeObj = CONFIG.timelines[state.timeline] || CONFIG.timelines.normal;
        const suppObj = CONFIG.supportPlans[state.supportPlan] || CONFIG.supportPlans.none;

        // Smart Suggestions & Budget Trim Tips
        const suggestions = [];

        if (est.budgetVariance > 0) {
            suggestions.push({
                isWarning: true,
                title: `⚠ Estimated cost exceeds client's budget by ₹${formatINR(est.budgetVariance)}`,
                desc: 'Suggestions to reduce scope: (1) Switch to Simple Design (-₹5,000), (2) Keep initial pages to 1–5 (-₹6,000), (3) Use basic CMS instead of full dashboard, (4) Remove optional modules.'
            });
        }

        if (state.projectType === 'ecommerce' && !state.selectedFeatures.includes('admin_dashboard')) {
            suggestions.push({
                isWarning: false,
                title: 'Admin Dashboard Recommended',
                desc: 'E-commerce projects usually require an Admin Dashboard for managing products, inventory & orders.'
            });
        }

        if (state.designStyle === 'simple' && ['corporate_website', 'hospital_website', 'ecommerce'].includes(state.projectType)) {
            suggestions.push({
                isWarning: false,
                title: 'Upgrade to Modern Design',
                desc: 'Modern or Premium Design will significantly improve brand credibility and customer conversions.'
            });
        }

        if (state.supportPlan === 'none') {
            suggestions.push({
                isWarning: false,
                title: 'Monthly Maintenance SLA Recommended',
                desc: 'Monthly maintenance is recommended for security updates, backups & uptime monitoring.'
            });
        }

        let complexityLabel = 'Low Complexity';
        if (est.complexityScore >= 8) complexityLabel = 'High Complexity';
        else if (est.complexityScore >= 5) complexityLabel = 'Medium Complexity';
        suggestions.push({
            isWarning: false,
            title: `Project Complexity Rating: ${est.complexityScore}/10 (${complexityLabel})`,
            desc: `Estimated internal effort: ${est.totalHours} Hours (${est.frontendHours}h Frontend, ${est.backendHours}h Backend, ${est.testingHours}h QA/Testing, ${est.deploymentHours}h Deployment).`
        });

        el.estimateSummaryContainer.innerHTML = `
            <div class="summary-header-banner">
                <div class="banner-left">
                    <h2>FlumenX Client Quotation Summary</h2>
                    <p>Local Agency Quote • ${projObj.name} (${bizObj.name}) • ${pageObj.name}</p>
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

            <!-- 3 Estimate Level Tiers -->
            <div class="quote-tiers-grid">
                <div class="quote-tier-card">
                    <div>
                        <span class="tier-tag">Economy Scope</span>
                        <div class="tier-price">₹${formatINR(est.economyQuote)}</div>
                    </div>
                    <p class="tier-desc">Core website & essential features only (Ideal for budget negotiation).</p>
                </div>
                <div class="quote-tier-card recommended">
                    <div>
                        <span class="tier-tag">Recommended Scope</span>
                        <div class="tier-price">₹${formatINR(est.recommendedQuote)}</div>
                    </div>
                    <p class="tier-desc">Optimal balance of design polish, requested features & speed.</p>
                </div>
                <div class="quote-tier-card">
                    <div>
                        <span class="tier-tag">Premium Scope</span>
                        <div class="tier-price">₹${formatINR(est.premiumQuote)}</div>
                    </div>
                    <p class="tier-desc">Fully loaded with Premium Design, VPS deployment & SLAs.</p>
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
                    <span class="kpi-lbl">Estimated Effort</span>
                    <div class="kpi-val">${est.totalHours} Dev Hrs</div>
                    <div class="kpi-sub">Frontend: ${est.frontendHours}h | Backend: ${est.backendHours}h</div>
                </div>
                <div class="kpi-card">
                    <span class="kpi-lbl">Monthly SLA (Separate)</span>
                    <div class="kpi-val">${est.monthlySupport > 0 ? `₹${formatINR(est.monthlySupport)}/mo` : 'None'}</div>
                    <div class="kpi-sub">${suppObj.name}</div>
                </div>
            </div>

            <div class="complexity-box">
                <div class="complexity-info">
                    <h4>Project Complexity Score</h4>
                    <p>Estimated effort: ${est.frontendHours}h Frontend • ${est.backendHours}h Backend • ${est.testingHours}h Testing • ${est.deploymentHours}h Deployment.</p>
                </div>
                <div class="complexity-meter-container">
                    <div class="complexity-track">
                        <div class="complexity-fill" style="width: ${(est.complexityScore / 10) * 100}%;"></div>
                    </div>
                    <span class="complexity-score-val">${est.complexityScore} / 10</span>
                </div>
            </div>

            <div class="smart-suggestions-box">
                <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <span>Smart Suggestions & Sales Insights</span>
                </h3>
                ${suggestions.map(s => `
                    <div class="suggestion-item ${s.isWarning ? 'warning' : ''}">
                        <span class="bullet" style="color:${s.isWarning ? 'var(--danger-color)' : 'var(--success-color)'}">${s.isWarning ? '⚠' : '✓'}</span>
                        <div>
                            <strong style="color:${s.isWarning ? 'var(--danger-color)' : 'var(--text-primary)'}">${s.title}:</strong> ${s.desc}
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Internal Controls: Discount & Profit Margin (Hidden on Client PDF) -->
            <div class="margin-control-box no-print">
                <div style="flex:1">
                    <span class="margin-title">Internal Sales Discount & Margin</span>
                    <p style="font-size:0.8rem; color:var(--text-muted)">Internal tool only (Hidden from client PDF printouts).</p>
                </div>
                <div class="margin-controls">
                    <span style="font-size:0.85rem; font-weight:600">Discount:</span>
                    <input type="range" min="0" max="20" step="5" value="${state.discountPercent}" class="margin-slider" id="discountSlider">
                    <span class="margin-val-badge" id="discountValBadge">${state.discountPercent}%</span>
                </div>
                <div style="font-family:var(--font-mono); font-size:0.85rem">
                    Dev Cost: ₹${formatINR(est.devCost)} | Profit: <span style="color:var(--success-color); font-weight:700">₹${formatINR(est.profitAmount)} (${est.marginPercent}%)</span>
                </div>
                <div class="gst-toggle-wrapper">
                    <span style="font-size:0.85rem; font-weight:600">GST (18%)</span>
                    <label class="switch">
                        <input type="checkbox" id="gstToggleInput" ${state.gstIncluded ? 'checked' : ''}>
                        <span class="slider-round"></span>
                    </label>
                </div>
            </div>

            <div class="itemized-table-card">
                <div class="table-header">
                    <h3>Itemized Quotation Breakdown</h3>
                    <span class="count-tag">${projObj.name}</span>
                </div>
                <table class="estimate-table">
                    <thead>
                        <tr>
                            <th>Scope Component</th>
                            <th>Configuration Detail</th>
                            <th style="text-align:right">Price (INR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Base Website</strong></td>
                            <td>${projObj.name} (${bizObj.name} package)</td>
                            <td class="col-price">₹${formatINR(est.baseWebsiteCost)}</td>
                        </tr>
                        <tr>
                            <td><strong>Pages Volume</strong></td>
                            <td>${pageObj.name}</td>
                            <td class="col-price">${est.pageCost > 0 ? '₹' + formatINR(est.pageCost) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Content Management</strong></td>
                            <td>${(CONFIG.cmsOptions[state.cmsOption] || {}).name}</td>
                            <td class="col-price">${(CONFIG.cmsOptions[state.cmsOption]?.price || 0) > 0 ? '₹' + formatINR(CONFIG.cmsOptions[state.cmsOption].price) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>User Accounts</strong></td>
                            <td>${(CONFIG.userAccountOptions[state.userAccounts] || {}).name}</td>
                            <td class="col-price">${(CONFIG.userAccountOptions[state.userAccounts]?.price || 0) > 0 ? '₹' + formatINR(CONFIG.userAccountOptions[state.userAccounts].price) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Features & Add-ons</strong></td>
                            <td>${state.selectedFeatures.map(k => CONFIG.features[k]?.name).filter(Boolean).join(', ') || 'Contact Form (Included)'}</td>
                            <td class="col-price">${est.featuresCostOnly > 0 ? '₹' + formatINR(est.featuresCostOnly) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Design Style</strong></td>
                            <td>${designObj.name} style</td>
                            <td class="col-price">${est.designCost > 0 ? '₹' + formatINR(est.designCost) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Animations & Motion</strong></td>
                            <td>${(CONFIG.animations[state.animationLevel] || {}).name}</td>
                            <td class="col-price">${(CONFIG.animations[state.animationLevel]?.price || 0) > 0 ? '₹' + formatINR(CONFIG.animations[state.animationLevel].price) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Deployment & Server</strong></td>
                            <td>${(CONFIG.deployments[state.deployment] || {}).name}</td>
                            <td class="col-price">${est.deploymentCost > 0 ? '₹' + formatINR(est.deploymentCost) : 'Included'}</td>
                        </tr>
                        ${est.discountAmount > 0 ? `
                        <tr style="color:var(--success-color)">
                            <td><strong>Sales Discount (-${est.discountPercent}%)</strong></td>
                            <td>Special internal client concession</td>
                            <td class="col-price">-₹${formatINR(est.discountAmount)}</td>
                        </tr>` : ''}
                        <tr class="total-row">
                            <td colspan="2">Subtotal Project Cost</td>
                            <td class="col-price">₹${formatINR(est.finalBaseTotal)}</td>
                        </tr>
                        ${state.gstIncluded ? `
                        <tr>
                            <td colspan="2">GST Tax (18%)</td>
                            <td class="col-price">₹${formatINR(est.gstAmount)}</td>
                        </tr>` : ''}
                        <tr class="grand-total-row">
                            <td colspan="2">Grand Total Quotation</td>
                            <td class="col-price">₹${formatINR(est.grandTotal)}</td>
                        </tr>
                        ${est.monthlySupport > 0 ? `
                        <tr style="background-color:rgba(99,102,241,0.05)">
                            <td colspan="2"><strong>Monthly Maintenance SLA (Separate)</strong></td>
                            <td class="col-price" style="color:var(--accent-primary)">₹${formatINR(est.monthlySupport)}/month</td>
                        </tr>` : ''}
                    </tbody>
                </table>
            </div>
        `;

        // Event Listeners for Summary Controls
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
            { id: 'cmsOptions', label: 'CMS Content' },
            { id: 'userAccountOptions', label: 'User Accounts' },
            { id: 'features', label: 'Online Features' },
            { id: 'designStyles', label: 'Design Styles' },
            { id: 'animations', label: 'Animations' },
            { id: 'timelines', label: 'Timelines' },
            { id: 'deployments', label: 'Deployment' },
            { id: 'supportPlans', label: 'Support SLA' }
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

            const isMultCategory = (tabCategory === 'timelines');

            row.innerHTML = `
                <div class="setting-label">${item.name}</div>
                <div class="setting-input-group">
                    <label>${isMultCategory ? 'Multiplier' : 'Price (₹)'}</label>
                    <input type="number" step="${isMultCategory ? '0.05' : '100'}" class="setting-input val-input" data-cat="${tabCategory}" data-key="${key}" data-field="${isMultCategory ? 'mult' : 'price'}" value="${isMultCategory ? item.mult : (item.price || 0)}">
                </div>
                <div class="setting-input-group">
                    <label>Hours</label>
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
        alert('Pricing rates updated and saved successfully!');
    }

    function resetToDefaultRates() {
        if (confirm('Reset all rates back to default local TVM agency rates?')) {
            CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            localStorage.removeItem('flumenx_smart_config');
            renderAllGrids();
            updateCalculations();
            renderSettingsTabContent(currentSettingsTab);
            alert('Rates reset to local TVM defaults.');
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
                        cmsOption: 'occasionally',
                        userAccounts: 'none',
                        selectedFeatures: ['contact_form'],
                        designStyle: 'simple',
                        animationLevel: 'none',
                        timeline: 'normal',
                        deployment: 'deploy_only',
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
