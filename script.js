/* ==========================================================================
   FLUMENX SMART WEBSITE PRICING CALCULATOR - LOGIC ENGINE
   Business-Focused Questionnaire Engine + TVM Low-Based Rates
   ========================================================================== */

(function () {
    'use strict';

    /* --------------------------------------------------------------------------
       1. DEFAULT CONFIGURATION & TVM RATES
       -------------------------------------------------------------------------- */
    const DEFAULT_CONFIG = {
        projectTypes: {
            landing_page: { name: 'Landing Page', price: 12000, hours: 25, desc: 'Single high-converting page for marketing & leads', icon: 'layout' },
            business_website: { name: 'Business Website', price: 25000, hours: 45, desc: 'Standard multi-page site for business presentation', icon: 'globe' },
            corporate_website: { name: 'Corporate Website', price: 45000, hours: 70, desc: 'Multi-section enterprise portal with compliance pages', icon: 'briefcase' },
            ecommerce: { name: 'E-commerce Store', price: 70000, hours: 110, desc: 'Online store with catalog, shopping cart & payments', icon: 'shopping-bag', autoSelect: ['payment_gateway', 'store', 'admin_dashboard'] },
            booking_website: { name: 'Booking Website', price: 60000, hours: 100, desc: 'Appointment scheduling & reservation system', icon: 'calendar', autoSelect: ['booking', 'payment_gateway', 'notifications'] },
            school_portal: { name: 'School / College Portal', price: 75000, hours: 120, desc: 'Educational institution site with news, staff & notices', icon: 'layers', autoSelect: ['reports', 'notifications'] },
            hospital_website: { name: 'Hospital Website', price: 80000, hours: 130, desc: 'Medical clinic / hospital portal with doctor booking', icon: 'users', autoSelect: ['booking', 'notifications'] },
            crm_erp: { name: 'CRM / ERP System', price: 150000, hours: 220, desc: 'Internal business management & operational workflow platform', icon: 'cpu', autoSelect: ['admin_dashboard', 'reports', 'notifications'] },
            custom_webapp: { name: 'Custom Web Application', price: 120000, hours: 180, desc: 'Tailor-made web app built to custom workflow specs', icon: 'code' }
        },

        businessSizes: {
            individual: { name: 'Individual', mult: 1.0, desc: 'Personal portfolio, freelancer, or solo practitioner' },
            startup: { name: 'Startup', mult: 1.0, desc: 'Early-stage venture or emerging brand' },
            small_business: { name: 'Small Business', mult: 1.05, desc: 'Local business, clinic, or service shop' },
            medium_business: { name: 'Medium Business', mult: 1.15, desc: 'Established company with multi-team workflows' },
            large_company: { name: 'Large Company', mult: 1.25, desc: 'Corporate enterprise requiring SLA & scale' }
        },

        budgetRanges: {
            b_under_30k: { name: 'Under ₹30,000', target: 30000, desc: 'Economy essential budget' },
            b_30k_60k: { name: '₹30,000 – ₹60,000', target: 60000, desc: 'Standard business budget' },
            b_60k_1lakh: { name: '₹60,000 – ₹1 Lakh', target: 100000, desc: 'Growth & e-commerce budget' },
            b_1l_3l: { name: '₹1–3 Lakhs', target: 300000, desc: 'Advanced platform budget' },
            b_3l_plus: { name: '₹3 Lakhs+', target: 500000, desc: 'Custom enterprise budget' }
        },

        pageCounts: {
            p1_5: { name: '1–5 Pages', price: 0, hours: 0, desc: 'Included in base price' },
            p6_10: { name: '6–10 Pages', price: 10000, hours: 10, desc: 'Avg +₹2,000 per page' },
            p11_20: { name: '11–20 Pages', price: 20000, hours: 20, desc: 'Avg +₹2,000 per page' },
            p20_plus: { name: '20+ Pages', price: 45000, hours: 45, desc: 'Custom high-volume architecture' }
        },

        cmsOptions: {
            no: { name: 'No', price: 0, hours: 0, desc: 'Content updated directly in source code' },
            occasionally: { name: 'Yes, occasionally', price: 4000, hours: 5, desc: 'Basic CMS for blog or news updates' },
            frequently: { name: 'Yes, frequently', price: 8000, hours: 10, desc: 'Full CMS dashboard for daily team updates' }
        },

        userAccountOptions: {
            none: { name: 'No', price: 0, hours: 0, desc: 'Public website without logins' },
            customers: { name: 'Customers Only', price: 6000, hours: 8, desc: 'Client portal & user sign up' },
            staff: { name: 'Staff Only', price: 8000, hours: 10, desc: 'Internal employee login & role rules' },
            both: { name: 'Both Customers & Staff', price: 15000, hours: 18, desc: 'Multi-role authentication system' }
        },

        features: {
            contact_form: { name: 'Contact Form', price: 1500, hours: 2, desc: 'Lead inquiry form with email notifications', icon: 'code' },
            blog: { name: 'Blog', price: 4000, hours: 5, desc: 'Articles & publishing CMS', icon: 'layout' },
            gallery: { name: 'Photo Gallery', price: 3000, hours: 4, desc: 'Lightbox media grid', icon: 'globe' },
            payment_gateway: { name: 'Online Payments', price: 8000, hours: 10, desc: 'Razorpay, Stripe, or UPI integration', icon: 'shopping-bag' },
            booking: { name: 'Booking / Appointments', price: 12000, hours: 12, desc: 'Calendar reservation slot engine', icon: 'calendar' },
            store: { name: 'Online Store', price: 15000, hours: 15, desc: 'Product catalog & cart drawer', icon: 'store' },
            customer_dashboard: { name: 'Customer Dashboard', price: 12000, hours: 14, desc: 'My Orders / Profile portal', icon: 'users' },
            admin_dashboard: { name: 'Admin Dashboard', price: 15000, hours: 18, desc: 'Management control panel', icon: 'cpu' },
            reports: { name: 'Reports & Analytics', price: 8000, hours: 8, desc: 'Sales & user activity metrics', icon: 'layers' },
            notifications: { name: 'Notifications', price: 5000, hours: 5, desc: 'Email / SMS alert system', icon: 'code' },
            multilang: { name: 'Multi-language', price: 10000, hours: 10, desc: 'Multi-lingual content support', icon: 'globe' },
            chat: { name: 'Live Chat', price: 4000, hours: 4, desc: 'WhatsApp or Intercom widget', icon: 'code' }
        },

        designStyles: {
            simple: { name: 'Simple', mult: 1.0, hours: 0, desc: 'Clean, minimal standard UI design' },
            modern: { name: 'Modern', mult: 1.10, hours: 10, desc: 'Sleek custom component styling & layout polish' },
            premium: { name: 'Premium', mult: 1.20, hours: 20, desc: 'Framer / Linear level micro-interactions' },
            luxury: { name: 'Luxury', mult: 1.35, hours: 35, desc: 'Bespoke high-end motion & luxury art direction' }
        },

        animations: {
            minimal: { name: 'Minimal', price: 0, hours: 0, desc: 'Standard subtle hover transitions' },
            standard: { name: 'Standard', price: 3000, hours: 4, desc: 'Smooth fade-in & scroll triggers' },
            premium: { name: 'Premium', price: 8000, hours: 8, desc: 'Advanced motion graphics & parallax' }
        },

        timelines: {
            flexible: { name: 'Flexible', mult: 0.95, desc: 'Economy pace (-5% discount)' },
            normal: { name: 'Normal', mult: 1.0, desc: 'Standard 4–6 weeks delivery' },
            priority: { name: 'Priority', mult: 1.10, desc: 'Fast-track 2–3 weeks (+10%)' },
            urgent: { name: 'Urgent', mult: 1.20, desc: 'Rush 1–2 weeks (+20% surcharge)' }
        },

        deployments: {
            client: { name: 'Client', price: 0, hours: 0, desc: 'Client handles server & hosting' },
            flumenx: { name: 'FlumenX Managed', price: 3000, hours: 3, desc: 'Deploy to Vercel / Hostinger / VPS' },
            cloud: { name: 'Cloud Infrastructure', price: 15000, hours: 15, desc: 'AWS / GCP cloud setup & CI/CD' }
        },

        supportPlans: {
            none: { name: 'No', price: 0, hours: 0, desc: 'No monthly maintenance contract' },
            basic: { name: 'Basic Support', price: 2000, hours: 3, desc: '₹2,000/mo - Security updates & bug fixes' },
            standard: { name: 'Standard Support', price: 5000, hours: 8, desc: '₹5,000/mo - Backups, content tweaks & monitoring' },
            premium: { name: 'Premium Support', price: 10000, hours: 16, desc: '₹10,000/mo - 24/7 priority SLA & dedicated support' }
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
        budgeRange: 'b_30k_60k',
        pageCount: 'p1_5',
        cmsOption: 'occasionally',
        userAccounts: 'none',
        selectedFeatures: ['contact_form'],
        designStyle: 'simple',
        animationLevel: 'minimal',
        timeline: 'normal',
        deployment: 'flumenx',
        supportPlan: 'none',
        customNotes: '',
        gstIncluded: true,
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
                priceText = item.mult === 1.0 ? '1.0x Base' : `${item.mult}x Multiplier`;
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
        'Support & SLA',
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
       7. PRICING CALCULATOR ENGINE & COMPLEXITY ALGORITHM
       -------------------------------------------------------------------------- */
    function calculateEstimate() {
        const proj = CONFIG.projectTypes[state.projectType] || CONFIG.projectTypes.business_website;
        const biz = CONFIG.businessSizes[state.businessSize] || CONFIG.businessSizes.small_business;
        const page = CONFIG.pageCounts[state.pageCount] || CONFIG.pageCounts.p1_5;
        const cms = CONFIG.cmsOptions[state.cmsOption] || CONFIG.cmsOptions.no;
        const userAcc = CONFIG.userAccountOptions[state.userAccounts] || CONFIG.userAccountOptions.none;
        const design = CONFIG.designStyles[state.designStyle] || CONFIG.designStyles.simple;
        const anim = CONFIG.animations[state.animationLevel] || CONFIG.animations.minimal;
        const time = CONFIG.timelines[state.timeline] || CONFIG.timelines.normal;
        const deploy = CONFIG.deployments[state.deployment] || CONFIG.deployments.client;
        const support = CONFIG.supportPlans[state.supportPlan] || CONFIG.supportPlans.none;
        const budgetObj = CONFIG.budgetRanges[state.budgeRange] || CONFIG.budgetRanges.b_30k_60k;

        let basePrice = proj.price;
        let baseHours = proj.hours || 0;

        // Features sum
        let featuresPrice = 0;
        let featuresHours = 0;
        state.selectedFeatures.forEach(featKey => {
            const feat = CONFIG.features[featKey];
            if (feat) {
                featuresPrice += (feat.price || 0);
                featuresHours += (feat.hours || 0);
            }
        });

        // Sum of additional features & scope addons
        let additionalFeaturesCost = featuresPrice + (cms.price || 0) + (userAcc.price || 0) + (anim.price || 0);
        let scopeAddons = (page.price || 0) + additionalFeaturesCost;

        // Unmultiplied Subtotal
        let rawSubtotal = basePrice + scopeAddons;

        // Multipliers: Business Size, Design Style, Timeline
        let bizMult = biz.mult !== undefined ? biz.mult : 1.0;
        let designMult = design.mult !== undefined ? design.mult : 1.0;
        let timeMult = time.mult !== undefined ? time.mult : 1.0;

        let designCost = (rawSubtotal * designMult) - rawSubtotal;
        let deploymentCost = deploy.price || 0;

        let multipliedSubtotal = (rawSubtotal * bizMult * designMult * timeMult) + deploymentCost;
        let finalBaseTotal = multipliedSubtotal;

        // Dev Hours Discipline Breakdown
        let totalHours = (baseHours + (page.hours || 0) + (cms.hours || 0) + (userAcc.hours || 0) + featuresHours + (design.hours || 0) + (anim.hours || 0) + (deploy.hours || 0));
        let frontendHours = Math.round(totalHours * 0.50);
        let backendHours = Math.round(totalHours * 0.30);
        let testingHours = Math.round(totalHours * 0.12);
        let deploymentHours = Math.max(Math.round(totalHours * 0.08), 2);

        // GST Tax (18%)
        let gstAmount = state.gstIncluded ? (finalBaseTotal * 0.18) : 0;
        let grandTotal = finalBaseTotal + gstAmount;

        // Target Budget Match Analysis
        let clientTargetBudget = budgetObj.target || 60000;
        let budgetVariance = grandTotal - clientTargetBudget; // positive means exceeds budget

        // Project Complexity Score (1 to 10 scale)
        let complexityScore = 2; // base
        if (state.selectedFeatures.length >= 4) complexityScore += 2;
        if (state.selectedFeatures.length >= 8) complexityScore += 2;
        if (state.userAccounts !== 'none') complexityScore += 1;
        if (state.cmsOption === 'frequently') complexityScore += 1;
        if (['ecommerce', 'crm_erp', 'custom_webapp'].includes(state.projectType)) complexityScore += 2;
        complexityScore = Math.min(Math.max(complexityScore, 1), 10);

        // 3 Quote Tiers: Minimum (-20%), Recommended (Selected), Premium (+25%)
        let minQuote = Math.round(grandTotal * 0.80);
        let recQuote = Math.round(grandTotal);
        let premQuote = Math.round(grandTotal * 1.25);

        // Internal Profit Calculation
        let devCost = Math.round(finalBaseTotal * 0.60); // 60% internal labor cost
        let profitAmount = finalBaseTotal - devCost;
        let marginPercent = Math.round((profitAmount / finalBaseTotal) * 100);

        return {
            basePrice,
            pagePrice: page.price || 0,
            featuresPrice,
            additionalFeaturesCost,
            designCost,
            deploymentCost,
            rawSubtotal,
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
            minQuote,
            recQuote,
            premQuote,
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
        el.sbSpecBudget.textContent = budgetObj ? budgetObj.name : '₹30K–₹60K';

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
            <div class="breakdown-row"><span>Base Cost</span> <span class="val">₹${formatINR(est.basePrice)}</span></div>
            ${est.pagePrice > 0 ? `<div class="breakdown-row"><span>Pages Volume</span> <span class="val">+₹${formatINR(est.pagePrice)}</span></div>` : ''}
            ${est.additionalFeaturesCost > 0 ? `<div class="breakdown-row"><span>Features Cost</span> <span class="val">+₹${formatINR(est.additionalFeaturesCost)}</span></div>` : ''}
            ${est.designCost > 0 ? `<div class="breakdown-row"><span>Design Style</span> <span class="val">+₹${formatINR(est.designCost)}</span></div>` : ''}
            ${est.deploymentCost > 0 ? `<div class="breakdown-row"><span>Deployment</span> <span class="val">+₹${formatINR(est.deploymentCost)}</span></div>` : ''}
            ${state.gstIncluded ? `<div class="breakdown-row"><span>GST Tax (18%)</span> <span class="val">+₹${formatINR(est.gstAmount)}</span></div>` : ''}
        `;
    }

    /* --------------------------------------------------------------------------
       8. FINAL ESTIMATE DASHBOARD (STEP 14)
       -------------------------------------------------------------------------- */
    function renderFinalSummary() {
        const est = calculateEstimate();
        const projObj = CONFIG.projectTypes[state.projectType] || CONFIG.projectTypes.business_website;
        const bizObj = CONFIG.businessSizes[state.businessSize] || CONFIG.businessSizes.small_business;
        const budgetObj = CONFIG.budgetRanges[state.budgeRange] || CONFIG.budgetRanges.b_30k_60k;
        const pageObj = CONFIG.pageCounts[state.pageCount] || CONFIG.pageCounts.p1_5;
        const designObj = CONFIG.designStyles[state.designStyle] || CONFIG.designStyles.simple;
        const timeObj = CONFIG.timelines[state.timeline] || CONFIG.timelines.normal;
        const suppObj = CONFIG.supportPlans[state.supportPlan] || CONFIG.supportPlans.none;

        // Generate Smart Suggestions
        const suggestions = [];
        if (state.projectType === 'ecommerce' && !state.selectedFeatures.includes('admin_dashboard')) {
            suggestions.push({ title: 'Admin Dashboard Recommended', desc: 'Since this is an E-commerce project, we strongly recommend adding an Admin Dashboard for managing products and order status.' });
        }
        if (state.designStyle === 'simple' && ['corporate_website', 'saas', 'ecommerce'].includes(state.projectType)) {
            suggestions.push({ title: 'Upgrade to Premium Design', desc: 'Upgrading to Modern or Premium Design will improve overall brand credibility and user conversion.' });
        }
        if (state.supportPlan === 'none') {
            suggestions.push({ title: 'Monthly Maintenance SLA', desc: 'Ongoing monthly support is recommended to handle security patches, content tweaks, and backups.' });
        }

        let complexityLabel = 'Low Complexity';
        if (est.complexityScore >= 8) complexityLabel = 'High Complexity';
        else if (est.complexityScore >= 5) complexityLabel = 'Medium Complexity';
        suggestions.push({ title: `Project Complexity Rating: ${est.complexityScore}/10`, desc: `Based on your selected features, user authentication, and CMS rules, this project is rated ${complexityLabel}.` });

        // Check if budget variance exceeds client budget
        let budgetMatchHtml = '';
        if (est.budgetVariance > 0) {
            suggestions.push({
                title: `Estimate exceeds client target by ₹${formatINR(est.budgetVariance)}`,
                desc: 'Suggestions to trim scope: (1) Switch to Simple Design, (2) Reduce non-essential features like Live Chat or Animations, (3) Keep initial page volume to 1–5 pages.'
            });
        }

        el.estimateSummaryContainer.innerHTML = `
            <div class="summary-header-banner">
                <div class="banner-left">
                    <h2>Project Estimate & Proposal</h2>
                    <p>Prepared for FlumenX Sales Team • ${projObj.name} (${bizObj.name} Scope)</p>
                </div>
                <div class="banner-actions">
                    <button type="button" class="btn-secondary" id="saveEstimateTriggerBtn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        <span>Save Estimate</span>
                    </button>
                    <button type="button" class="btn-primary" id="printQuoteBtn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        <span>Print / Export PDF</span>
                    </button>
                </div>
            </div>

            <!-- 3 Quote Tiers for Sales Negotiation -->
            <div class="quote-tiers-grid">
                <div class="quote-tier-card">
                    <div>
                        <span class="tier-tag">Minimum Scope</span>
                        <div class="tier-price">₹${formatINR(est.minQuote)}</div>
                    </div>
                    <p class="tier-desc">Essential features & core pages only (-20% trimmed scope).</p>
                </div>
                <div class="quote-tier-card recommended">
                    <div>
                        <span class="tier-tag">Recommended Scope</span>
                        <div class="tier-price">₹${formatINR(est.recQuote)}</div>
                    </div>
                    <p class="tier-desc">Optimal balance of features, design quality, and speed.</p>
                </div>
                <div class="quote-tier-card">
                    <div>
                        <span class="tier-tag">Premium Scope</span>
                        <div class="tier-price">₹${formatINR(est.premQuote)}</div>
                    </div>
                    <p class="tier-desc">Fully loaded with premium motion, SLAs & cloud deployment.</p>
                </div>
            </div>

            <div class="summary-cards-grid">
                <div class="kpi-card">
                    <span class="kpi-lbl">Grand Total</span>
                    <div class="kpi-val">₹${formatINR(est.grandTotal)}</div>
                    <div class="kpi-sub">${state.gstIncluded ? 'Includes 18% GST' : 'Excludes Tax'}</div>
                </div>
                <div class="kpi-card">
                    <span class="kpi-lbl">Target Budget</span>
                    <div class="kpi-val">${budgetObj.name}</div>
                    <div class="kpi-sub">${est.budgetVariance <= 0 ? '✓ Within Target Budget' : `+₹${formatINR(est.budgetVariance)} Over Target`}</div>
                </div>
                <div class="kpi-card">
                    <span class="kpi-lbl">Est. Development Hours</span>
                    <div class="kpi-val">${est.totalHours} Hours</div>
                    <div class="kpi-sub">Frontend: ${est.frontendHours}h | Backend: ${est.backendHours}h</div>
                </div>
                <div class="kpi-card">
                    <span class="kpi-lbl">Ongoing Support</span>
                    <div class="kpi-val">₹${formatINR(est.monthlySupport)}/mo</div>
                    <div class="kpi-sub">${suppObj.name}</div>
                </div>
            </div>

            <div class="complexity-box">
                <div class="complexity-info">
                    <h4>Project Complexity Score</h4>
                    <p>Calculated based on user auth, CMS frequency, APIs, and functional modules.</p>
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
                    <div class="suggestion-item">
                        <span class="bullet">✓</span>
                        <div>
                            <strong>${s.title}:</strong> ${s.desc}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="margin-control-box no-print">
                <div style="flex:1">
                    <span class="margin-title">Internal Profitability Calculator</span>
                    <p style="font-size:0.8rem; color:var(--text-muted)">Internal view only (Hidden from client proposal printouts).</p>
                </div>
                <div style="font-family:var(--font-mono); font-size:0.9rem">
                    Labor Cost: ₹${formatINR(est.devCost)} | Margin: <span style="color:var(--success-color); font-weight:700">${est.marginPercent}%</span> (₹${formatINR(est.profitAmount)})
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
                    <h3>Itemized Cost & Scope Breakdown</h3>
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
                            <td><strong>Base Project Cost</strong></td>
                            <td>${projObj.name} (${projObj.hours || 0} base hrs)</td>
                            <td class="col-price">₹${formatINR(est.basePrice)}</td>
                        </tr>
                        <tr>
                            <td><strong>Page Volume</strong></td>
                            <td>${pageObj.name}</td>
                            <td class="col-price">${est.pagePrice > 0 ? '₹' + formatINR(est.pagePrice) : 'Included'}</td>
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
                            <td><strong>Selected Features</strong></td>
                            <td>${state.selectedFeatures.map(k => CONFIG.features[k]?.name).filter(Boolean).join(', ') || 'None selected'}</td>
                            <td class="col-price">${est.featuresPrice > 0 ? '₹' + formatINR(est.featuresPrice) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Design Style</strong></td>
                            <td>${designObj.name} (${designObj.mult}x multiplier)</td>
                            <td class="col-price">${est.designCost > 0 ? '₹' + formatINR(est.designCost) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Animations & Motion</strong></td>
                            <td>${(CONFIG.animations[state.animationLevel] || {}).name}</td>
                            <td class="col-price">${(CONFIG.animations[state.animationLevel]?.price || 0) > 0 ? '₹' + formatINR(CONFIG.animations[state.animationLevel].price) : 'Included'}</td>
                        </tr>
                        <tr>
                            <td><strong>Deployment Setup</strong></td>
                            <td>${(CONFIG.deployments[state.deployment] || {}).name}</td>
                            <td class="col-price">${est.deploymentCost > 0 ? '₹' + formatINR(est.deploymentCost) : 'Included'}</td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="2">Subtotal Base Cost</td>
                            <td class="col-price">₹${formatINR(est.finalBaseTotal)}</td>
                        </tr>
                        ${state.gstIncluded ? `
                        <tr>
                            <td colspan="2">GST Tax (18%)</td>
                            <td class="col-price">₹${formatINR(est.gstAmount)}</td>
                        </tr>` : ''}
                        <tr class="grand-total-row">
                            <td colspan="2">Grand Total Estimate</td>
                            <td class="col-price">₹${formatINR(est.grandTotal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        // Attach event listeners
        const gstToggleInput = document.getElementById('gstToggleInput');
        const saveEstimateTriggerBtn = document.getElementById('saveEstimateTriggerBtn');
        const printQuoteBtn = document.getElementById('printQuoteBtn');

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

            const isMultCategory = (tabCategory === 'designStyles' || tabCategory === 'timelines' || tabCategory === 'businessSizes');

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
        if (confirm('Reset all rates back to default TVM low-based pricing?')) {
            CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            localStorage.removeItem('flumenx_smart_config');
            renderAllGrids();
            updateCalculations();
            renderSettingsTabContent(currentSettingsTab);
            alert('Rates reset to TVM defaults.');
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

            // Attach click actions
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
                        budgeRange: 'b_30k_60k',
                        pageCount: 'p1_5',
                        cmsOption: 'occasionally',
                        userAccounts: 'none',
                        selectedFeatures: ['contact_form'],
                        designStyle: 'simple',
                        animationLevel: 'minimal',
                        timeline: 'normal',
                        deployment: 'flumenx',
                        supportPlan: 'none',
                        customNotes: '',
                        gstIncluded: true,
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
