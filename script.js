// ============================================================
// AIMES - AI-based Manufacturing Execution System
// Interactive Script (Three.js + GSAP + i18n)
// ============================================================

// ==================== Three.js Background ====================
(function initThreeBackground() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create particle system - industrial/manufacturing theme
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
        new THREE.Color(0x0ea5e9), // primary
        new THREE.Color(0x8b5cf6), // accent
        new THREE.Color(0x10b981), // success
        new THREE.Color(0xf472b6), // companion
        new THREE.Color(0xf59e0b), // warning
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Create connection lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(200 * 6);
    let lineIndex = 0;

    for (let i = 0; i < particleCount && lineIndex < 200; i++) {
        for (let j = i + 1; j < particleCount && lineIndex < 200; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < 1.5) {
                linePositions[lineIndex * 6] = positions[i * 3];
                linePositions[lineIndex * 6 + 1] = positions[i * 3 + 1];
                linePositions[lineIndex * 6 + 2] = positions[i * 3 + 2];
                linePositions[lineIndex * 6 + 3] = positions[j * 3];
                linePositions[lineIndex * 6 + 4] = positions[j * 3 + 1];
                linePositions[lineIndex * 6 + 5] = positions[j * 3 + 2];
                lineIndex++;
            }
        }
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.08,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 8;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);

        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
        lines.rotation.y += 0.0005;
        lines.rotation.x += 0.0002;

        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    } catch (e) {
        console.warn('WebGL not available, skipping 3D background:', e.message);
    }
})();

// ==================== Scroll Animations (enhancement only, never hides content) ====================
(function initScrollAnimations() {
    // If GSAP is available, use subtle slide-up on scroll (content stays visible if GSAP fails)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        try {
            gsap.registerPlugin(ScrollTrigger);

            // Subtle slide-up for sections on scroll
            gsap.utils.toArray('.fade-in').forEach(el => {
                gsap.from(el, {
                    y: 30,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    },
                });
            });

            // Hero content slide-up
            gsap.from('.content-fade-up', {
                y: 40, duration: 0.8, delay: 0.2, ease: 'power3.out',
            });

            // Hero architecture visual slide-in
            gsap.from('.hero-arch-visual', {
                x: 40, duration: 0.8, delay: 0.4, ease: 'power3.out',
            });
        } catch (e) {
            console.warn('GSAP animation error:', e);
        }
    }
})();

// ==================== Counter Animation ====================
(function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    function animateCounter(el) {
        if (el.dataset.animated) return;
        el.dataset.animated = 'true';
        const target = parseInt(el.getAttribute('data-count'));
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 25);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => observer.observe(counter));

    // Safety: animate counters after 2 seconds regardless
    setTimeout(() => {
        counters.forEach(counter => animateCounter(counter));
    }, 2000);
})();

// ==================== Smooth Scroll ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });

            // Close mobile nav
            const navCollapse = document.getElementById('navbarNav');
            if (navCollapse && navCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        }
    });
});

// ==================== Navbar scroll behavior ====================
(function initNavbar() {
    const nav = document.querySelector('.glass-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'rgba(5, 6, 8, 0.9)';
            nav.style.padding = '0.5rem 0';
        } else {
            nav.style.background = 'rgba(5, 6, 8, 0.7)';
            nav.style.padding = '1rem 0';
        }

        lastScroll = currentScroll;
    });
})();

// ==================== Language Toggle (KR/EN) ====================
const translations = {
    en: {
        // Navigation
        nav_arch: 'Architecture',
        nav_modules: 'Core Modules',
        nav_services: 'Microservices',
        nav_ai: 'AI/ML',
        nav_workflow: 'Workflow',
        nav_roi: 'ROI',
        nav_roadmap: 'Roadmap',

        // Hero
        hero_title_1: 'Beyond Traditional MES',
        hero_title_2: 'AI Transforms Manufacturing',
        hero_subtitle: 'AIMES is a next-generation Manufacturing Execution System that implements AI/ML-based predictive quality control, real-time process optimization, and autonomous decision-making. It aims to be the standard platform for AX (AI Transformation) of mid-sized food manufacturing enterprises in South Korea.',
        hero_btn_arch: 'Explore Architecture',
        hero_btn_modules: 'Core Modules',
        stat_services: 'Microservices',
        stat_api: 'API Endpoints',
        stat_ai: 'AI/ML Models',
        stat_pages: 'Dashboard Pages',

        // Background
        bg_tag: 'BACKGROUND',
        bg_title: 'The Need for AX in Food Manufacturing',
        bg_desc: 'Among 70,000+ food manufacturing businesses in South Korea, smart factory adoption rate is only 19.5%, with 75.5% at the basic level.',
        bg_target_title: 'Target Market',
        bg_target_desc: 'KSIC Category 10 (Food Products), 11 (Beverages)',
        bg_size_title: 'Target Enterprise Size',
        bg_size_desc: 'Mid-sized enterprises with revenue of 10B~500B KRW',
        bg_diff_title: 'Differentiation Strategy',
        bg_diff_desc: 'Combining A3 Security expertise + AI technology capabilities',

        // Architecture
        arch_tag: 'ARCHITECTURE',
        arch_title: '8-Layer System Architecture',
        arch_desc: 'Designed based on ISA-95 standard, Purdue Model OT/IT separation, and microservices architecture.',

        // Modules
        mod_tag: 'CORE MODULES',
        mod_title: 'AIMES Core Application Areas',
        mod_desc: 'Integrating AI/ML capabilities with traditional MES functions to solve critical challenges in food manufacturing.',
        mod_quality_title: 'AI Predictive Quality',
        mod_quality_desc: 'Real-time process variable analysis for early quality anomaly detection. SPC automation and AI-based outlier detection for defect prevention.',
        mod_quality_kpi1: 'Defect Reduction',
        mod_quality_kpi2: 'Inspection Accuracy',
        mod_process_title: 'AI Process Optimization',
        mod_process_desc: 'Automatic optimal process parameter settings. Adaptive control for raw material variations. Digital twin-based simulation.',
        mod_process_kpi1: 'Yield Improvement',
        mod_process_kpi2: 'Energy Savings',
        mod_maint_title: 'AI Predictive Maintenance',
        mod_maint_desc: 'IoT sensor-based equipment failure prediction. Optimal maintenance cycle calculation. Equipment life prediction to minimize unplanned downtime.',
        mod_maint_kpi1: 'Downtime Reduction',
        mod_maint_kpi2: 'OEE Target',
        mod_vision_title: 'AI Vision Inspection',
        mod_vision_desc: 'Automatic defect detection (color, shape, foreign objects). Packaging inspection. Label verification for significant labor savings.',
        mod_vision_kpi1: 'Inspection Accuracy',
        mod_vision_kpi2: 'Labor Savings',
        mod_haccp_title: 'HACCP Automation',
        mod_haccp_desc: 'Real-time CCP monitoring and automatic recording. Automatic alerts/actions on deviations. Automated regulatory reports for MFDS.',
        mod_haccp_kpi1: 'Compliance Time Savings',
        mod_haccp_kpi2: 'Real-time Monitoring',
        mod_sec_title: 'Security Module',
        mod_sec_desc: 'On-premises OT/IT integrated security management. Purdue Model-based network separation. Zero Trust architecture.',
        mod_sec_kpi1: 'Security Incident Target',
        mod_sec_kpi2: 'Compliance',

        // Services
        svc_tag: 'MICROSERVICES',
        svc_title: '9 Microservices',
        svc_desc: 'Modular architecture enables flexible deployment for various food manufacturing environments. 143 API endpoints available.',
        svc_prod_desc: 'Production planning, work orders, recipe management, state machine',
        svc_quality_desc: 'Quality inspection, defect management, corrective action workflow',
        svc_inv_desc: 'Inventory management, cold chain management, expiry date calculation',
        svc_maint_desc: 'Equipment management, CIP/SIP cleaning, preventive maintenance',
        svc_haccp_desc: 'Real-time CCP monitoring, MFDS report auto-generation',
        svc_trace_desc: 'Bi-directional LOT tracking, allergen tracking, recall management',
        svc_noti_desc: 'Instant CCP deviation alerts, SMS/KakaoTalk integration',
        svc_data_desc: 'Real-time sensor data collection, Edge communication',

        // AI/ML
        ai_tag: 'AI/ML PIPELINE',
        ai_title: '6 AI/ML Models & MLOps',
        ai_desc: 'Hybrid AI strategy combining Edge AI real-time inference with server-side advanced analytics.',
        ai_edge_title: 'Edge AI (NVIDIA Jetson)',
        ai_edge_desc: 'Real-time inference < 100ms. Independent operation during IT network disconnection. Instant CCP deviation alerts.',
        ai_server_title: 'GPU Server (NVIDIA L40S)',
        ai_server_desc: 'Advanced analytics and model training. Batch inference < 500ms. MLflow automated deployment for model version management.',

        // Workflow
        wf_tag: 'PRODUCTION WORKFLOW',
        wf_title: 'End-to-End Production Process',
        wf_desc: 'An intelligent production process with AI integrated across all 8 stages from demand forecasting to post-management.',
        wf_s1: 'Demand Forecasting / Production Planning',
        wf_s1_desc: 'AI demand forecast model → Production plan → Automatic material ordering',
        wf_s2: 'Material Receiving / Inspection',
        wf_s2_desc: 'Material LOT registration → Quality inspection → Allergen check → Cold chain monitoring start',
        wf_s3: 'Mixing / Pre-processing',
        wf_s3_desc: 'Auto recipe calculation → AI material variance correction → CCP monitoring (temp/pH)',
        wf_s4: 'Processing / Cooking',
        wf_s4_desc: 'AI process parameter optimization → Real-time quality prediction → Predictive maintenance',
        wf_s5: 'Quality Inspection',
        wf_s5_desc: 'Vision AI inspection → Automatic defect classification → Pass/Fail decision',
        wf_s6: 'Packaging / Labeling',
        wf_s6_desc: 'Weight check → Label verification (allergen, expiry) → Metal detection → LOT tracking complete',
        wf_s7: 'Shipping / Distribution',
        wf_s7_desc: 'Final cold chain check → Shipping approval → Forward LOT tracking activated',
        wf_s8: 'Post Management',
        wf_s8_desc: 'Auto HACCP report → MFDS reporting → AI model retraining',

        // Domain
        domain_tag: 'FOOD DOMAIN',
        domain_title: 'Food Manufacturing Domain Model',
        domain_desc: 'Complete support for HACCP, cold chain, allergen, CIP/SIP and other food-specific domains.',

        // Security
        sec_tag: 'SECURITY',
        sec_title: 'Purdue Model Security Architecture',
        sec_desc: 'OT/IT separation and Zero Trust architecture built on A3 Security expertise.',

        // ROI
        roi_tag: 'ROI ANALYSIS',
        roi_title: 'Before & After Comprehensive Analysis',
        roi_desc: 'AIMES delivers annual cost savings of 215M~580M KRW.',
        roi_invest: 'Billion KRW Investment',
        roi_save: 'Billion KRW/Year Savings',
        roi_payback: 'Year Payback Period',
        roi_5yr: '5-Year Cumulative ROI',

        // Roadmap
        rm_tag: 'ROADMAP',
        rm_title: 'Implementation Roadmap',
        rm_desc: 'Targeting 12-18 month prototype completion with Agile + Domain expertise hybrid methodology.',
        rm_p0_title: 'Planning & Preparation',
        rm_p0_dur: '1-2 months',
        rm_p0_desc: 'Market research, pilot company selection, As-Is analysis, ROI target setting',
        rm_p1_title: 'Prototype Design',
        rm_p1_dur: '2-3 months',
        rm_p1_desc: 'System architecture design, AI model selection, IoT/sensor installation planning, security architecture design',
        rm_p2_title: 'Prototype Development',
        rm_p2_dur: '4-6 months',
        rm_p2_desc: 'AIMES Core development, IoT infrastructure, AI model development/training, dashboard, pilot line deployment',
        rm_p3_title: 'Validation & Verification',
        rm_p3_dur: '3-4 months',
        rm_p3_desc: 'Pilot line 24/7 operation, AI model tuning, ROI measurement and verification',
        rm_p4_title: 'Commercialization & Expansion',
        rm_p4_dur: '6 months+',
        rm_p4_desc: 'Commercial release, additional customer acquisition, module expansion, government program integration',

        // Footer
        footer_sub: 'AI-based MES for Food Manufacturing',
        footer_by: 'Designed by Brian Lee / A3-AI Working Group',
        footer_links: 'Quick Links',
        footer_arch: 'Architecture',
        footer_modules: 'Core Modules',
        footer_services: 'Microservices',
        footer_ai: 'AI/ML Pipeline',
        footer_roi: 'ROI Analysis',
        footer_tech: 'Tech Stack',

        // ===== Card Detail Panels =====

        // Module: AI Quality
        mod_quality_d1: 'Key Features',
        mod_quality_d1_1: 'Process variable time-series analysis (30+ variables: temp, pressure, pH, humidity)',
        mod_quality_d1_2: 'SPC control chart auto-generation with anomaly pattern detection (Nelson Rules)',
        mod_quality_d1_3: 'Real-time quality deviation probability prediction with early alerts',
        mod_quality_d1_4: 'Automatic root cause analysis (Top-5 contributing variables)',
        mod_quality_d2: 'Technical Details',
        mod_quality_d2_1: 'LSTM time-series prediction + XGBoost ensemble model',
        mod_quality_d2_2: 'Isolation Forest / Autoencoder outlier detection',
        mod_quality_d2_3: 'SHAP-based prediction explainability',

        // Module: AI Process Optimization
        mod_process_d1: 'Key Features',
        mod_process_d1_1: 'Automatic recipe optimization (real-time raw material variance correction)',
        mod_process_d1_2: 'Sterilization temperature/time profile optimization',
        mod_process_d1_3: 'Energy minimization scheduling (peak-time avoidance)',
        mod_process_d1_4: 'Digital twin simulation (What-if analysis)',
        mod_process_d2: 'Technical Details',
        mod_process_d2_1: 'RL PPO agent-based process parameter exploration',
        mod_process_d2_2: 'Bayesian Optimization for fast convergence',
        mod_process_d2_3: 'Process simulator (Python SimPy) integration',

        // Module: AI Predictive Maintenance
        mod_maint_d1: 'Key Features',
        mod_maint_d1_1: 'Real-time vibration/temperature/current sensor data collection & analysis',
        mod_maint_d1_2: 'Equipment RUL prediction and failure probability calculation',
        mod_maint_d1_3: 'Automatic optimal maintenance schedule generation (cost optimization)',
        mod_maint_d1_4: 'CIP/SIP cleaning cycle optimization and validation',
        mod_maint_d2: 'Technical Details',
        mod_maint_d2_1: 'LSTM time-series prediction + Weibull Survival Analysis',
        mod_maint_d2_2: 'FFT frequency analysis for bearing/motor anomaly detection',
        mod_maint_d2_3: 'Edge AI real-time inference (NVIDIA Jetson)',

        // Module: AI Vision Inspection
        mod_vision_d1: 'Key Features',
        mod_vision_d1_1: 'Automatic defect detection (color variance, shape anomaly, foreign objects)',
        mod_vision_d1_2: 'Packaging inspection (seal, fill level, damage)',
        mod_vision_d1_3: 'Label OCR verification (allergen labeling, expiry date, barcode)',
        mod_vision_d1_4: 'Automatic defect image archival and classification (MinIO S3)',
        mod_vision_d2: 'Technical Details',
        mod_vision_d2_1: 'YOLOv8 object detection + EfficientNet classification model',
        mod_vision_d2_2: 'Edge AI inference < 50ms (NVIDIA Jetson + TensorRT FP16)',
        mod_vision_d2_3: 'Active Learning for continuous model improvement',

        // Module: HACCP Automation
        mod_haccp_d1: 'Key Features',
        mod_haccp_d1_1: 'CCP (Critical Control Point) real-time monitoring & auto-recording',
        mod_haccp_d1_2: '3-level auto-alert on limit deviation (Caution→Warning→Critical)',
        mod_haccp_d1_3: 'Corrective action workflow automation (assignee, deadline management)',
        mod_haccp_d1_4: 'MFDS HACCP report auto-generation (PDF/Excel)',
        mod_haccp_d2: 'Monitoring Items',
        mod_haccp_d2_1: 'Sterilization temp/time, cooling temp, metal detection',
        mod_haccp_d2_2: 'pH, water activity (Aw), microbial limits',
        mod_haccp_d2_3: 'CIP/SIP cleaning temp/concentration/time verification',

        // Module: Security
        mod_sec_d1: 'Key Features',
        mod_sec_d1_1: 'Purdue Model OT/IT network separation (DMZ, Data Diode)',
        mod_sec_d1_2: 'Zero Trust: mTLS mutual authentication, service mesh security',
        mod_sec_d1_3: 'RBAC + ABAC hybrid access control',
        mod_sec_d1_4: 'Security event integrated monitoring (SIEM integration)',
        mod_sec_d2: 'Security Framework',
        mod_sec_d2_1: 'AES-256 data encryption (at rest / in transit)',
        mod_sec_d2_2: 'HashiCorp Vault secret management',
        mod_sec_d2_3: 'Container image signing and scanning (Harbor + Trivy)',

        // Service: API Gateway
        svc_gw_d1: 'Key Features',
        svc_gw_d1_1: 'JWT-based authentication/authorization + automatic token refresh',
        svc_gw_d1_2: 'RBAC: Admin / Operator / Quality Manager / Maintenance Engineer',
        svc_gw_d1_3: 'Rate Limiting (per IP/user) + Circuit Breaker pattern',
        svc_gw_d1_4: 'Request logging, distributed tracing (Correlation ID), WAF rules',
        svc_gw_d2: 'Key Endpoints',

        // Service: Production
        svc_prod_d1: 'Key Features',
        svc_prod_d1_1: 'Production plan CRUD (daily/weekly/monthly)',
        svc_prod_d1_2: 'Work order creation and state machine (Pending→Running→Done→Verified)',
        svc_prod_d1_3: 'Recipe management with version history tracking',
        svc_prod_d1_4: 'Production performance auto-aggregation and KPI dashboard',
        svc_prod_d2: 'Key Endpoints',

        // Service: Quality
        svc_quality_d1: 'Key Features',
        svc_quality_d1_1: 'Incoming/in-process/outgoing quality inspection recording & pass/fail',
        svc_quality_d1_2: 'SPC control chart auto-generation (X-bar, R, p, c chart)',
        svc_quality_d1_3: 'Defect classification by type and Pareto analysis',
        svc_quality_d1_4: 'CAPA workflow: Issue→Investigate→Correct→Verify→Close',
        svc_quality_d2: 'Key Endpoints',

        // Service: Inventory
        svc_inv_d1: 'Key Features',
        svc_inv_d1_1: 'Raw/semi-finished/finished goods real-time tracking (LOT-based)',
        svc_inv_d1_2: 'Cold chain zone temperature/humidity monitoring with deviation alerts',
        svc_inv_d1_3: 'Automatic expiry date calculation (manufacturing date + storage conditions)',
        svc_inv_d1_4: 'FIFO/FEFO shipping strategy auto-application',
        svc_inv_d2: 'Key Endpoints',

        // Service: Maintenance
        svc_maint_d1: 'Key Features',
        svc_maint_d1_1: 'Equipment registry management (asset registration, specs, history)',
        svc_maint_d1_2: 'CIP/SIP cleaning process management and validation',
        svc_maint_d1_3: 'Preventive Maintenance (PM) schedule auto-generation',
        svc_maint_d1_4: 'Maintenance work order management (Create→Assign→Complete→Verify)',
        svc_maint_d2: 'Key Endpoints',

        // Service: HACCP
        svc_haccp_d1: 'Key Features',
        svc_haccp_d1_1: 'HACCP plan registration and CCP point configuration',
        svc_haccp_d1_2: 'CCP real-time monitoring (automatic critical limit evaluation)',
        svc_haccp_d1_3: 'Auto-trigger corrective action workflow on deviation',
        svc_haccp_d1_4: 'MFDS-compliant HACCP report auto-generation (PDF)',
        svc_haccp_d2: 'Key Endpoints',

        // Service: Traceability
        svc_trace_d1: 'Key Features',
        svc_trace_d1_1: 'Material→Product forward / Product→Material backward LOT tracking',
        svc_trace_d1_2: 'Allergen cross-contamination tracking (line clearing history)',
        svc_trace_d1_3: 'Recall simulation and auto impact scope calculation',
        svc_trace_d1_4: 'MFDS traceability report automation',
        svc_trace_d2: 'Key Endpoints',

        // Service: Notification
        svc_noti_d1: 'Key Features',
        svc_noti_d1_1: 'Instant CCP deviation alerts (WebSocket + Push)',
        svc_noti_d1_2: 'SMS / KakaoTalk notification integration',
        svc_noti_d1_3: 'Notification priority and escalation rules management',
        svc_noti_d1_4: 'Notification history and acknowledgement (ACK) management',
        svc_noti_d2: 'Key Endpoints',

        // Service: Data Ingestion
        svc_data_d1: 'Key Features',
        svc_data_d1_1: 'Edge Gateway → Kafka real-time sensor data collection',
        svc_data_d1_2: 'Protocol conversion (OPC-UA, Modbus, MQTT → Kafka)',
        svc_data_d1_3: 'Data validation and anomalous value filtering',
        svc_data_d1_4: 'Local buffering on network disconnection with auto-resend',
        svc_data_d2: 'Key Endpoints',

        // AI Model: Quality Prediction
        ai_m1_d1: 'Input/Output Data',
        ai_m1_d1_1: 'Input: 30+ process variable time-series (temp, pressure, pH, humidity)',
        ai_m1_d1_2: 'Output: Quality anomaly probability (0~1), Top-5 contributing variables, confidence interval',
        ai_m1_d2: 'Model Specs',
        ai_m1_d2_1: 'LSTM 2-layer (hidden 128) + XGBoost ensemble',
        ai_m1_d2_2: 'Training: Weekly / Inference latency: < 200ms',
        ai_m1_d2_3: 'Target: F1-Score ≥ 0.92, AUC ≥ 0.95',

        // AI Model: Anomaly Detection
        ai_m2_d1: 'Input/Output Data',
        ai_m2_d1_1: 'Input: Multi-variate sensor time-series (vibration, temp, current, pressure)',
        ai_m2_d1_2: 'Output: Anomaly score (0~1), contributing variable ranking, anomaly type',
        ai_m2_d2: 'Model Specs',
        ai_m2_d2_1: 'Isolation Forest (unsupervised) + LSTM Autoencoder (semi-supervised)',
        ai_m2_d2_2: 'Training: Daily / Edge inference: < 10ms',
        ai_m2_d2_3: 'Target: Precision ≥ 0.90, Recall ≥ 0.95',

        // AI Model: Process Optimization
        ai_m3_d1: 'Input/Output Data',
        ai_m3_d1_1: 'Input: Process parameters + raw material properties + environmental conditions',
        ai_m3_d1_2: 'Output: Optimal parameter set, expected yield, energy savings estimate',
        ai_m3_d2: 'Model Specs',
        ai_m3_d2_1: 'PPO Agent (Actor-Critic) + Bayesian Optimization',
        ai_m3_d2_2: 'Training: Monthly / Inference: < 500ms',
        ai_m3_d2_3: 'Target: Yield +5~10%, Energy -15%',

        // AI Model: Vision Inspection
        ai_m4_d1: 'Input/Output Data',
        ai_m4_d1_1: 'Input: Industrial camera images (640x640, 30fps)',
        ai_m4_d1_2: 'Output: Defect type, bounding box coordinates, confidence score',
        ai_m4_d2: 'Model Specs',
        ai_m4_d2_1: 'YOLOv8m object detection + EfficientNet-B3 classification',
        ai_m4_d2_2: 'Edge inference: < 50ms (NVIDIA Jetson + TensorRT FP16)',
        ai_m4_d2_3: 'Target: mAP@0.5 ≥ 0.95, Classification accuracy ≥ 0.97',

        // AI Model: Demand Forecasting
        ai_m5_d1: 'Input/Output Data',
        ai_m5_d1_1: 'Input: Sales history, seasonality, promotions, weather, holidays',
        ai_m5_d1_2: 'Output: Daily/weekly SKU-level demand, confidence intervals (80/95%)',
        ai_m5_d2: 'Model Specs',
        ai_m5_d2_1: 'Prophet (seasonality) + Temporal Fusion Transformer (multi-factor)',
        ai_m5_d2_2: 'Training: Weekly / Inference: < 1s (batch)',
        ai_m5_d2_3: 'Target: MAPE ≤ 15%, RMSE minimization',

        // AI Model: Equipment RUL
        ai_m6_d1: 'Input/Output Data',
        ai_m6_d1_1: 'Input: Vibration, temperature, current, pressure time-series (per equipment)',
        ai_m6_d1_2: 'Output: Remaining Useful Life (days), failure probability, maintenance recommendation',
        ai_m6_d2: 'Model Specs',
        ai_m6_d2_1: 'LSTM time-series + Weibull/Cox Survival Analysis',
        ai_m6_d2_2: 'Training: Monthly / Inference: < 300ms',
        ai_m6_d2_3: 'Target: RUL prediction error ≤ ±20%, C-Index ≥ 0.85',

        // Domain: HACCP/CCP
        domain_haccp_d1: 'Detailed Features',
        domain_haccp_d1_1: 'HACCP plan automation based on 7 principles, 12 procedures',
        domain_haccp_d1_2: 'CCP critical limit (CL) setup and real-time monitoring',
        domain_haccp_d1_3: '3-level escalation on deviation (Caution→Warning→Critical)',
        domain_haccp_d1_4: 'MFDS HACCP certification report auto-generation',
        domain_haccp_d2: 'Regulatory Compliance',
        domain_haccp_d2_1: 'Food Sanitation Act, Livestock Products Sanitary Control Act',
        domain_haccp_d2_2: 'Codex Alimentarius international standards',

        // Domain: Cold Chain
        domain_cold_d1: 'Monitoring Items',
        domain_cold_d1_1: 'Zone-level temperature/humidity real-time collection (1s~1min intervals)',
        domain_cold_d1_2: 'Refrigeration (0~10°C), Freezing (below -18°C) auto-evaluation',
        domain_cold_d1_3: 'Door open detection, defrost cycle monitoring',
        domain_cold_d2: 'Key Features',
        domain_cold_d2_1: 'Instant SMS/Push alert on deviation',
        domain_cold_d2_2: 'Cold chain integrity certificate auto-issuance',
        domain_cold_d2_3: 'Historical data-based energy efficiency analysis',

        // Domain: Allergen
        domain_allergen_d1: 'Management Items',
        domain_allergen_d1_1: '22-allergen database per Food Sanitation Act',
        domain_allergen_d1_2: 'Line-level cleaning procedure management for cross-contamination prevention',
        domain_allergen_d1_3: 'Auto-alert on allergen-containing ingredient changes',
        domain_allergen_d2: 'Key Features',
        domain_allergen_d2_1: 'Line Clearance checklist automation',
        domain_allergen_d2_2: 'Vision AI-based allergen label auto-verification',
        domain_allergen_d2_3: 'Allergen traceability and recall impact scope calculation',

        // Domain: CIP/SIP
        domain_cip_d1: 'Process Management',
        domain_cip_d1_1: 'CIP (Clean-in-Place): Alkali→Acid→Rinse step-by-step auto control',
        domain_cip_d1_2: 'SIP (Sterilize-in-Place): Steam temp/pressure/time monitoring',
        domain_cip_d1_3: 'Cleaning solution concentration, flow rate, temperature real-time verification',
        domain_cip_d2: 'Validation',
        domain_cip_d2_1: 'Microbial test result integration (ATP, culture test)',
        domain_cip_d2_2: 'Cleaning validation record auto-generation and archival',
        domain_cip_d2_3: 'Cleaning cycle optimization (AI-based contamination prediction)',

        // Domain: LOT Traceability
        domain_lot_d1: 'Tracking System',
        domain_lot_d1_1: 'Raw material LOT → Semi-finished LOT → Finished LOT forward tracking',
        domain_lot_d1_2: 'Finished → Raw material backward tracking (recall response)',
        domain_lot_d1_3: 'Process parameter/operator/equipment history linked per step',
        domain_lot_d2: 'Key Features',
        domain_lot_d2_1: 'Recall simulation: Auto-calculate affected LOTs/distributors',
        domain_lot_d2_2: 'MFDS traceability report auto-generation',
        domain_lot_d2_3: 'QR/barcode scan-based on-site instant lookup',

        // Domain: Shelf Life
        domain_shelf_d1: 'Prediction Model',
        domain_shelf_d1_1: 'Arrhenius model-based shelf life prediction per temperature',
        domain_shelf_d1_2: 'Accelerated test data management and regression analysis',
        domain_shelf_d1_3: 'Remaining shelf life recalculation on storage condition changes',
        domain_shelf_d2: 'Key Features',
        domain_shelf_d2_1: 'FEFO (First Expiry, First Out) shipping strategy auto-application',
        domain_shelf_d2_2: 'Auto-alert for near-expiry products (D-7, D-3, D-1)',
        domain_shelf_d2_3: 'Quality change prediction-based optimal shipment timing recommendation',
    }
};

(function initLanguageToggle() {
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = 'ko';

    // Store original Korean text
    const originalTexts = {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
        originalTexts[el.getAttribute('data-i18n')] = el.textContent;
    });

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang === currentLang) return;

            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = lang;

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (lang === 'en' && translations.en[key]) {
                    el.textContent = translations.en[key];
                } else if (lang === 'ko' && originalTexts[key]) {
                    el.textContent = originalTexts[key];
                }
            });
        });
    });
})();

// ==================== Card Detail Modal ====================
(function initCardModal() {
    const overlay = document.getElementById('card-modal-overlay');
    if (!overlay) return;

    const modalHeader = overlay.querySelector('.card-modal-header');
    const modalBody = overlay.querySelector('.card-modal-body');
    const closeBtn = overlay.querySelector('.card-modal-close');
    const cardSelectors = '.module-card, .service-card, .ai-model-card, .domain-card';

    document.querySelectorAll(cardSelectors).forEach(card => {
        const detail = card.querySelector('.card-detail');
        if (!detail) return;

        card.addEventListener('click', (e) => {
            if (e.target.closest('a, button')) return;

            // Clone card content for header (exclude .card-detail)
            const clone = card.cloneNode(true);
            const cloneDetail = clone.querySelector('.card-detail');
            if (cloneDetail) cloneDetail.remove();
            modalHeader.innerHTML = clone.innerHTML;

            // Populate body from detail panel
            modalBody.innerHTML = detail.innerHTML;

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });
})();
