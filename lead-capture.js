/* =========================================================
   Weflux — Lead Capture Popup v2
   Phase 1: Contact details → saved immediately
   Phase 2: 8 qualification questions (one per screen)
   Progressive intent scoring, session deduplication.
   ========================================================= */
(function () {
  'use strict';

  // ---- CONFIG ----
  var CONFIG = {
    enabledPages: [
      '', 'home', 'features', 'platform', 'broadcasts',
      'automations', 'shared-inbox', 'whatsapp-crm', 'use-cases', 'pricing'
    ],
    triggerDelayMs: 15000,
    triggerScrollPct: 40,
    cookieName: 'wf_lc_seen',
    cookieDays: 7,
    endpoint: 'PASTE_YOUR_LEAD_CAPTURE_ENDPOINT_HERE'
  };

  // ---- GUARD: page check ----
  var page = (document.body.dataset.page || '').toLowerCase();
  var pathPage = location.pathname.replace(/^\//, '').replace(/\.html$/, '').toLowerCase();
  if (pathPage === '' || pathPage === 'index') pathPage = '';
  var currentPage = page || pathPage;
  if (CONFIG.enabledPages.indexOf(currentPage) === -1 && CONFIG.enabledPages.indexOf(page) === -1) return;

  // ---- GUARD: cookie check ----
  if (getCookie(CONFIG.cookieName)) return;

  // ---- STATE ----
  var state = {
    sessionId: generateId(),
    phase: 1,          // 1 = contact, 2 = qualification
    qualStep: 0,       // 0-based index of current qualification step (0-7)
    score: 0,
    pageLoadedAt: Date.now(),
    popupOpenedAt: null,
    contactSaved: false,
    submitted: false,
    // Phase 1
    name: '',
    phone: '',
    dialCode: '+91',
    country: 'India',
    email: '',
    // Phase 2 qualification
    businessType: '',
    whatsappUsage: '',
    currentProvider: '',
    monthlyConversations: '',
    teamSize: '',
    whatsappNumbers: '',
    features: [],       // multi-select
    timeline: '',
    budget: '',
    // Scoring flags
    scored: {}
  };

  // ---- TOTAL SCREENS: Phase 1 (1) + Phase 2 (8) + Thank You = 10 screens ----
  // Progress: Phase 1 = 0%, Steps 1-8 = 10%..90%, Thank You = 100%
  var TOTAL_QUAL_STEPS = 8;

  // ---- SCORING ----
  var SCORE_MAP = {
    whatsapp_api:          30,
    conv_10k:              25,
    budget_2500_plus:      20,
    budget_5000_plus:      20,
    needs_automation:      10,
    needs_api:             10,
    start_today:           30,
    start_week:            20,
    team_6_plus:           15,
    team_20_plus:          15,
    numbers_2_plus:        10,
    numbers_4_plus:        10
  };

  function addScore(key) {
    if (state.scored[key]) return;
    state.scored[key] = true;
    state.score += (SCORE_MAP[key] || 0);
  }

  function getIntentTier() {
    var s = state.score;
    if (s >= 61) return { tier: 'hot', label: '🔥 Hot Lead' };
    if (s >= 31) return { tier: 'warm', label: '🟡 Warm Lead' };
    return { tier: 'cold', label: '🔵 Cold Lead' };
  }

  // ---- UTILITIES ----
  function generateId() {
    return 'lc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }
  function isMobile() { return window.innerWidth <= 640; }
  function getDevice() { return isMobile() ? 'Mobile' : 'Desktop'; }
  function getUTM() {
    var p = new URLSearchParams(location.search);
    return { s: p.get('utm_source') || '', m: p.get('utm_medium') || '', c: p.get('utm_campaign') || '' };
  }

  // ---- BUILD POPUP HTML ----
  function buildPopup() {
    var el = document.createElement('div');
    el.className = 'lc-backdrop';
    el.id = 'lc-backdrop';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Get started with Weflux');
    el.innerHTML = [
      '<div class="lc-modal">',
        '<button class="lc-close" id="lcClose" aria-label="Close">',
          '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>',
        '</button>',

        '<div class="lc-header">',
          '<div class="lc-eyebrow"><span class="lc-dot"></span> Quick Setup</div>',
          '<h3 class="lc-title" id="lcTitle">Get started with Weflux</h3>',
          '<p class="lc-subtitle" id="lcSubtitle">Share your details and we\'ll set up the perfect plan for you.</p>',
        '</div>',

        // Progress bar
        '<div class="lc-progress-wrap" id="lcProgressWrap" style="display:none">',
          '<div class="lc-progress-info">',
            '<span class="lc-progress-label" id="lcProgressLabel">Step 1 of 8</span>',
            '<span class="lc-progress-pct" id="lcProgressPct">10%</span>',
          '</div>',
          '<div class="lc-progress-bar"><div class="lc-progress-fill" id="lcProgressFill"></div></div>',
        '</div>',

        '<div class="lc-body">',

          // ========== PHASE 1: Contact Details ==========
          '<div class="lc-screen active" id="lcPhase1">',
            '<div class="lc-form-row">',
              '<label class="lc-label" for="lcName">Name</label>',
              '<input class="lc-input" id="lcName" type="text" placeholder="Full name" autocomplete="name">',
              '<div class="lc-error-msg" id="lcNameErr">Please enter your name.</div>',
            '</div>',
            '<div class="lc-form-row">',
              '<label class="lc-label" for="lcPhone">Mobile number</label>',
              '<div class="lc-phone-group">',
                '<select class="lc-select" id="lcCountry" aria-label="Country code">',
                  '<option value="+91" data-country="India" data-len="10" selected>🇮🇳 +91</option>',
                  '<option value="+1"  data-country="USA"    data-len="10">🇺🇸 +1</option>',
                  '<option value="+1"  data-country="Canada" data-len="10">🇨🇦 +1</option>',
                  '<option value="+44" data-country="UK"     data-len="10">🇬🇧 +44</option>',
                  '<option value="+971" data-country="UAE"   data-len="9">🇦🇪 +971</option>',
                  '<option value="+966" data-country="Saudi Arabia" data-len="9">🇸🇦 +966</option>',
                  '<option value="+65"  data-country="Singapore"   data-len="8">🇸🇬 +65</option>',
                  '<option value="+61"  data-country="Australia"   data-len="9">🇦🇺 +61</option>',
                '</select>',
                '<input class="lc-input" id="lcPhone" type="tel" inputmode="numeric" maxlength="10" placeholder="9876543210">',
              '</div>',
              '<div class="lc-error-msg" id="lcPhoneErr">Please enter a valid phone number.</div>',
            '</div>',
            '<div class="lc-form-row">',
              '<label class="lc-label" for="lcEmail">Work email</label>',
              '<input class="lc-input" id="lcEmail" type="email" placeholder="you@company.com" autocomplete="email">',
              '<div class="lc-error-msg" id="lcEmailErr">Please enter a valid email address.</div>',
            '</div>',
            '<div class="lc-actions">',
              '<span></span>',
              '<button class="lc-btn lc-btn-primary" id="lcContactSubmit">Continue →</button>',
            '</div>',
          '</div>',

          // ========== PHASE 2: Qualification Steps ==========

          // Step 1: Business Type (20%)
          buildOptionScreen('lcQ1', 'What best describes your business?', [
            'B2B Services', 'Ecommerce', 'Retail Store', 'Education',
            'Healthcare', 'Real Estate', 'Agency', 'Manufacturing', 'Other'
          ], false, 1),

          // Step 2: WhatsApp Usage (30%) — with conditional sub-field
          '<div class="lc-screen" id="lcQ2">',
            '<span class="lc-q-label">Have you used WhatsApp Business before?</span>',
            '<div class="lc-options" data-key="whatsappUsage">',
              buildOption('Never used', false),
              buildOption('WhatsApp Business App', false),
              buildOption('WhatsApp Business API', false),
            '</div>',
            '<div class="lc-subfield" id="lcProviderField">',
              '<label class="lc-label" for="lcProvider">Which provider?</label>',
              '<select class="lc-select" id="lcProvider">',
                '<option value="">Select…</option>',
                '<option value="AiSensy">AiSensy</option>',
                '<option value="Interakt">Interakt</option>',
                '<option value="Gallabox">Gallabox</option>',
                '<option value="WATI">WATI</option>',
                '<option value="Zoko">Zoko</option>',
                '<option value="DoubleTick">DoubleTick</option>',
                '<option value="Respond.io">Respond.io</option>',
                '<option value="Other">Other</option>',
              '</select>',
            '</div>',
            buildNav(2),
          '</div>',

          // Step 3: Monthly Conversations (40%)
          buildOptionScreen('lcQ3', 'Approximately how many conversations do you handle each month?', [
            'Under 500', '500–2,000', '2,000–10,000', '10,000+'
          ], false, 3),

          // Step 4: Team Size (50%)
          buildOptionScreen('lcQ4', 'How many team members will use Weflux?', [
            'Just me', '2–5', '6–20', '20+'
          ], false, 4),

          // Step 5: WhatsApp Numbers (60%)
          buildOptionScreen('lcQ5', 'How many WhatsApp numbers do you want to connect?', [
            '1', '2–3', '4–10', 'More than 10'
          ], false, 5),

          // Step 6: Features — MULTI-SELECT (70%)
          buildOptionScreen('lcQ6', 'Which features are most important?', [
            'Shared Team Inbox', 'Automation', 'Broadcast', 'CRM Integration',
            'API Access', 'Chatbot', 'Analytics', 'AI Replies'
          ], true, 6),

          // Step 7: Timeline (80%)
          buildOptionScreen('lcQ7', 'When are you planning to start?', [
            'Today', 'Within a week', 'This month', 'Just exploring'
          ], false, 7),

          // Step 8: Budget (90%)
          buildOptionScreen('lcQ8', 'Monthly budget', [
            'Under ₹1,000', '₹1,000–2,500', '₹2,500–5,000', '₹5,000+'
          ], false, 8),

          // ========== SUCCESS ==========
          '<div class="lc-success" id="lcSuccess">',
            '<div class="lc-success-icon">',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
            '</div>',
            '<h3>Thank you!</h3>',
            '<p>One of our specialists will contact you shortly.</p>',
            '<div class="lc-success-actions">',
              '<a href="/contact?topic=scale" class="lc-btn lc-btn-primary">Book a Demo</a>',
              '<a href="https://app.weflux.in/register" class="lc-btn lc-btn-ghost" style="border:1.5px solid var(--line)">Start Free Trial</a>',
            '</div>',
          '</div>',

        '</div>', // end lc-body
      '</div>'  // end lc-modal
    ].join('');

    document.body.appendChild(el);
    return el;
  }

  function buildOption(label, isMulti) {
    var indicator = isMulti
      ? '<span class="lc-option-check"></span>'
      : '<span class="lc-option-radio"></span>';
    return '<label class="lc-option" data-value="' + label + '">' + indicator + label + '</label>';
  }

  function buildOptionScreen(id, question, options, isMulti, stepNum) {
    var key = getDataKeyForStep(stepNum);
    var html = '<div class="lc-screen" id="' + id + '">';
    html += '<span class="lc-q-label">' + question + '</span>';
    html += '<div class="lc-options" data-key="' + key + '"' + (isMulti ? ' data-multi="true"' : '') + '>';
    for (var i = 0; i < options.length; i++) {
      html += buildOption(options[i], isMulti);
    }
    html += '</div>';
    html += buildNav(stepNum);
    html += '</div>';
    return html;
  }

  function buildNav(stepNum) {
    return '<div class="lc-actions">' +
      '<button class="lc-btn lc-btn-ghost lc-back">← Back</button>' +
      (stepNum < TOTAL_QUAL_STEPS
        ? '<div style="display:flex;gap:8px;align-items:center"><button class="lc-btn lc-btn-skip lc-skip-rest">Skip for now</button><button class="lc-btn lc-btn-primary lc-next">Next →</button></div>'
        : '<div style="display:flex;gap:8px;align-items:center"><button class="lc-btn lc-btn-skip lc-skip-rest">Skip for now</button><button class="lc-btn lc-btn-primary lc-finish">Submit →</button></div>'
      ) +
      '</div>';
  }

  function getDataKeyForStep(stepNum) {
    return ['businessType', 'whatsappUsage', 'monthlyConversations', 'teamSize', 'whatsappNumbers', 'features', 'timeline', 'budget'][stepNum - 1] || '';
  }

  // ---- INJECT POPUP ----
  var popup = buildPopup();
  var backdrop = document.getElementById('lc-backdrop');
  var closeBtn = document.getElementById('lcClose');

  // Phase 1 elements
  var nameInput = document.getElementById('lcName');
  var phoneInput = document.getElementById('lcPhone');
  var emailInput = document.getElementById('lcEmail');
  var countrySelect = document.getElementById('lcCountry');
  var contactSubmitBtn = document.getElementById('lcContactSubmit');

  // Progress elements
  var progressWrap = document.getElementById('lcProgressWrap');
  var progressLabel = document.getElementById('lcProgressLabel');
  var progressPct = document.getElementById('lcProgressPct');
  var progressFill = document.getElementById('lcProgressFill');

  // Header elements
  var titleEl = document.getElementById('lcTitle');
  var subtitleEl = document.getElementById('lcSubtitle');
  var eyebrowEl = popup.querySelector('.lc-eyebrow');

  // All screens
  var phase1Screen = document.getElementById('lcPhase1');
  var qualScreens = [];
  for (var i = 1; i <= TOTAL_QUAL_STEPS; i++) {
    qualScreens.push(document.getElementById('lcQ' + i));
  }
  var successEl = document.getElementById('lcSuccess');

  // ---- PHONE INPUT: digits only ----
  function getPhoneLen() {
    if (!countrySelect) return 10;
    var opt = countrySelect.options[countrySelect.selectedIndex];
    return parseInt((opt && opt.dataset.len) || '10', 10);
  }
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, getPhoneLen());
    });
  }
  if (countrySelect) {
    countrySelect.addEventListener('change', function () {
      var len = getPhoneLen();
      phoneInput.maxLength = len;
      if (phoneInput.value.length > len) phoneInput.value = phoneInput.value.slice(0, len);
    });
  }

  // ---- PHASE 1: Contact Submit ----
  contactSubmitBtn.addEventListener('click', function () {
    // Clear previous errors
    clearErrors();

    // Validate
    var valid = true;
    var nameVal = nameInput.value.trim();
    var phoneVal = phoneInput.value.trim();
    var emailVal = emailInput.value.trim();

    if (!nameVal) {
      showError('lcName', 'lcNameErr'); valid = false;
    }
    if (!phoneVal || phoneVal.length < getPhoneLen()) {
      showError('lcPhone', 'lcPhoneErr'); valid = false;
    }
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      showError('lcEmail', 'lcEmailErr'); valid = false;
    }
    if (!valid) return;

    // Save to state
    state.name = nameVal;
    state.phone = phoneVal;
    state.email = emailVal;
    var opt = countrySelect.options[countrySelect.selectedIndex];
    state.dialCode = countrySelect.value;
    state.country = opt ? (opt.dataset.country || '') : '';

    // IMMEDIATELY save contact to Google Sheet
    state.contactSaved = true;
    saveData('contact_captured');

    // Move to Phase 2
    state.phase = 2;
    state.qualStep = 0;
    showQualScreen(0);
  });

  function showError(inputId, errId) {
    var inp = document.getElementById(inputId);
    var err = document.getElementById(errId);
    if (inp) inp.classList.add('error');
    if (err) err.classList.add('show');
  }
  function clearErrors() {
    popup.querySelectorAll('.lc-input.error, .lc-select.error').forEach(function (el) { el.classList.remove('error'); });
    popup.querySelectorAll('.lc-error-msg.show').forEach(function (el) { el.classList.remove('show'); });
  }

  // ---- PHASE 2: Qualification Navigation ----
  function showQualScreen(idx) {
    // Hide all screens
    phase1Screen.classList.remove('active');
    qualScreens.forEach(function (s) { s.classList.remove('active'); });
    successEl.classList.remove('active');

    // Show progress bar
    progressWrap.style.display = '';

    // Show target screen
    if (idx >= 0 && idx < TOTAL_QUAL_STEPS) {
      qualScreens[idx].classList.add('active');
      state.qualStep = idx;

      // Update progress
      var pct = Math.round(((idx + 1) / (TOTAL_QUAL_STEPS + 1)) * 100);
      progressLabel.textContent = 'Step ' + (idx + 1) + ' of ' + TOTAL_QUAL_STEPS;
      progressPct.textContent = pct + '%';
      progressFill.style.width = pct + '%';

      // Update header
      titleEl.textContent = getStepTitle(idx);
      subtitleEl.textContent = 'Help us tailor Weflux for your needs.';

      // Scroll body to top
      var body = popup.querySelector('.lc-body');
      if (body) body.scrollTop = 0;
    }
  }

  function getStepTitle(idx) {
    return [
      'Your Business', 'WhatsApp Experience', 'Conversation Volume',
      'Team Size', 'WhatsApp Numbers', 'Key Features',
      'Timeline', 'Budget'
    ][idx] || 'Qualification';
  }

  function showSuccess() {
    phase1Screen.classList.remove('active');
    qualScreens.forEach(function (s) { s.classList.remove('active'); });
    successEl.classList.add('active');

    // Update progress to 100%
    progressLabel.textContent = 'Complete';
    progressPct.textContent = '100%';
    progressFill.style.width = '100%';

    // Hide header
    titleEl.style.display = 'none';
    subtitleEl.style.display = 'none';
    eyebrowEl.style.display = 'none';
    progressWrap.style.display = 'none';
  }

  // ---- OPTION CLICK HANDLING (single + multi select) ----
  popup.addEventListener('click', function (e) {
    var opt = e.target.closest('.lc-option');
    if (!opt) return;

    var container = opt.closest('.lc-options');
    if (!container) return;

    var isMulti = container.dataset.multi === 'true';
    var key = container.dataset.key;

    if (isMulti) {
      // Toggle selection
      opt.classList.toggle('selected');
      // Collect all selected values
      var selected = [];
      container.querySelectorAll('.lc-option.selected').forEach(function (o) {
        selected.push(o.dataset.value);
      });
      state[key] = selected;
    } else {
      // Single select
      container.querySelectorAll('.lc-option').forEach(function (o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      state[key] = opt.dataset.value;
    }

    // Step 2 conditional: show provider field when "WhatsApp Business API" selected
    if (key === 'whatsappUsage') {
      var providerField = document.getElementById('lcProviderField');
      if (state.whatsappUsage === 'WhatsApp Business API') {
        providerField.classList.add('show');
      } else {
        providerField.classList.remove('show');
        state.currentProvider = '';
        var provSel = document.getElementById('lcProvider');
        if (provSel) provSel.value = '';
      }
    }
  });

  // Provider dropdown
  var providerSelect = document.getElementById('lcProvider');
  if (providerSelect) {
    providerSelect.addEventListener('change', function () {
      state.currentProvider = providerSelect.value;
    });
  }

  // ---- NAV BUTTON HANDLING (delegated) ----
  popup.addEventListener('click', function (e) {
    var btn = e.target.closest('.lc-next, .lc-back, .lc-finish, .lc-skip-rest');
    if (!btn) return;

    if (btn.classList.contains('lc-next')) {
      // Score current step before moving
      scoreCurrentStep();
      // Save progress
      saveData('qualification_in_progress');
      // Next step
      showQualScreen(state.qualStep + 1);
    }
    else if (btn.classList.contains('lc-back')) {
      if (state.qualStep === 0) {
        // Go back to Phase 1
        state.phase = 1;
        qualScreens.forEach(function (s) { s.classList.remove('active'); });
        phase1Screen.classList.add('active');
        progressWrap.style.display = 'none';
        titleEl.textContent = 'Get started with Weflux';
        subtitleEl.textContent = 'Share your details and we\'ll set up the perfect plan for you.';
      } else {
        showQualScreen(state.qualStep - 1);
      }
    }
    else if (btn.classList.contains('lc-finish')) {
      scoreCurrentStep();
      state.submitted = true;
      saveData('completed');
      setCookie(CONFIG.cookieName, 'submitted', CONFIG.cookieDays);
      showSuccess();
    }
    else if (btn.classList.contains('lc-skip-rest')) {
      // Score whatever they've answered so far
      scoreCurrentStep();
      state.submitted = true;
      saveData('skipped_qualification');
      setCookie(CONFIG.cookieName, 'submitted', CONFIG.cookieDays);
      showSuccess();
    }
  });

  // ---- SCORING LOGIC ----
  function scoreCurrentStep() {
    // Score based on current answers
    if (state.whatsappUsage === 'WhatsApp Business API') addScore('whatsapp_api');
    if (state.monthlyConversations === '10,000+') addScore('conv_10k');
    if (state.budget === '₹2,500–5,000') addScore('budget_2500_plus');
    if (state.budget === '₹5,000+') { addScore('budget_2500_plus'); addScore('budget_5000_plus'); }
    if (Array.isArray(state.features)) {
      if (state.features.indexOf('Automation') !== -1) addScore('needs_automation');
      if (state.features.indexOf('API Access') !== -1) addScore('needs_api');
    }
    if (state.timeline === 'Today') addScore('start_today');
    if (state.timeline === 'Within a week') addScore('start_week');
    if (state.teamSize === '6–20' || state.teamSize === '20+') addScore('team_6_plus');
    if (state.teamSize === '20+') addScore('team_20_plus');
    if (state.whatsappNumbers === '2–3' || state.whatsappNumbers === '4–10' || state.whatsappNumbers === 'More than 10') addScore('numbers_2_plus');
    if (state.whatsappNumbers === '4–10' || state.whatsappNumbers === 'More than 10') addScore('numbers_4_plus');
  }

  // ---- SAVE DATA ----
  function saveData(status) {
    var intentInfo = getIntentTier();
    var utm = getUTM();
    var timeOnPage = Math.round((Date.now() - state.pageLoadedAt) / 1000);

    var data = {
      sessionId:              state.sessionId,
      status:                 status,
      abandonedAtStep:        state.submitted ? '' : (state.phase === 1 ? 'contact' : 'step_' + (state.qualStep + 1)),
      intentScore:            String(state.score),
      intentTier:             intentInfo.label,
      // Phase 1
      name:                   state.name,
      phone:                  state.dialCode && state.phone ? (state.dialCode + ' ' + state.phone) : state.phone,
      email:                  state.email,
      country:                state.country,
      // Phase 2
      businessType:           state.businessType,
      whatsappUsage:          state.whatsappUsage,
      currentProvider:        state.currentProvider,
      monthlyConversations:   state.monthlyConversations,
      teamSize:               state.teamSize,
      whatsappNumbers:        state.whatsappNumbers,
      features:               Array.isArray(state.features) ? state.features.join(', ') : state.features,
      timeline:               state.timeline,
      budget:                 state.budget,
      // Meta
      sourcePage:             location.pathname,
      timeOnPage:             String(timeOnPage),
      device:                 getDevice(),
      utmSource:              utm.s,
      utmMedium:              utm.m,
      utmCampaign:            utm.c,
      submittedAt:            new Date().toISOString()
    };

    var endpoint = CONFIG.endpoint;
    if (!endpoint || /PASTE_YOUR/.test(endpoint)) {
      console.log('[Weflux Lead Capture]', status, data);
      return;
    }

    if (navigator.sendBeacon) {
      var blob = new Blob([new URLSearchParams(data).toString()], { type: 'application/x-www-form-urlencoded' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      try { fetch(endpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) }); }
      catch (e) { /* silent */ }
    }
  }

  // ---- OPEN / CLOSE ----
  function openPopup() {
    backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
    state.popupOpenedAt = Date.now();
    setTimeout(function () { if (nameInput) nameInput.focus(); }, 400);
  }

  function closePopup() {
    backdrop.classList.remove('show');
    document.body.style.overflow = '';
    // Save whatever we have
    if (!state.submitted) {
      if (state.contactSaved) {
        scoreCurrentStep();
        saveData('abandoned_qualification');
      }
      // If they haven't even submitted contact, don't save (no lead)
    }
    if (!getCookie(CONFIG.cookieName)) {
      setCookie(CONFIG.cookieName, 'dismissed', CONFIG.cookieDays);
    }
  }

  closeBtn.addEventListener('click', closePopup);
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closePopup(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdrop.classList.contains('show')) closePopup();
  });

  // ---- TRIGGERS ----
  var triggered = false;
  function triggerPopup() {
    if (triggered) return;
    triggered = true;
    openPopup();
  }

  var timerHandle = setTimeout(triggerPopup, CONFIG.triggerDelayMs);

  function onScroll() {
    if (triggered) return;
    var pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (pct >= CONFIG.triggerScrollPct) triggerPopup();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!isMobile()) {
    document.addEventListener('mouseout', function (e) {
      if (triggered) return;
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth) triggerPopup();
    });
  }

  // ---- BEFOREUNLOAD: save on tab close ----
  window.addEventListener('beforeunload', function () {
    if (state.submitted) return;
    if (state.contactSaved) {
      scoreCurrentStep();
      saveData('abandoned_qualification');
    }
  });

})();
