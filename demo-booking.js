/* =========================================================
   Weflux — Standalone "Book a Demo" Popup
   Triggered by any element with [data-book-demo] or
   links whose visible text includes "Book a demo".
   Collects: Name, Email, Phone → then Date & Time picker.
   Sends to Google Apps Script → creates Google Calendar event
   on hello@weflux.in & emails calendar invite to the lead.
   Reuses lead-capture.css classes for consistent Weflux theme.
   ========================================================= */
(function () {
  'use strict';

  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbw33h-xZdZdkr1XUEYno7eCntwvCmVAefI22th8xyZRGU3JDZ7OsOLUS7YSbYSyWpuo/exec';

  // ---- STATE ----
  var bookState = {
    name: '',
    phone: '',
    dialCode: '+91',
    country: 'India',
    email: '',
    bookingDate: '',
    bookingTime: '',
    bookingTimeLabel: '',
    bookingDateDisplay: '',
    step: 1   // 1 = contact, 2 = calendar, 3 = success
  };

  // ---- UTILITIES ----
  function isMobile() { return window.innerWidth <= 640; }
  function getDevice() { return isMobile() ? 'Mobile' : 'Desktop'; }
  function getUTM() {
    var p = new URLSearchParams(location.search);
    return { s: p.get('utm_source') || '', m: p.get('utm_medium') || '', c: p.get('utm_campaign') || '' };
  }

  // ---- BUILD THE POPUP ----
  function buildDemoPopup() {
    var el = document.createElement('div');
    el.className = 'lc-backdrop';
    el.id = 'bd-backdrop';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Book a demo with Weflux');
    el.innerHTML = [
      '<div class="lc-modal">',
        '<button class="lc-close" id="bdClose" aria-label="Close">',
          '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>',
        '</button>',

        '<div class="lc-header">',
          '<div class="lc-eyebrow" id="bdEyebrow"><span class="lc-dot"></span> Book a Demo</div>',
          '<h3 class="lc-title" id="bdTitle">Schedule your 1-on-1 Demo</h3>',
          '<p class="lc-subtitle" id="bdSubtitle">Pick a convenient 30-minute slot. A calendar invite will be sent to your email.</p>',
        '</div>',

        // Progress
        '<div class="lc-progress-wrap" id="bdProgressWrap">',
          '<div class="lc-progress-info">',
            '<span class="lc-progress-label" id="bdProgressLabel">Step 1 of 2</span>',
            '<span class="lc-progress-pct" id="bdProgressPct">50%</span>',
          '</div>',
          '<div class="lc-progress-bar"><div class="lc-progress-fill" id="bdProgressFill" style="width:50%"></div></div>',
        '</div>',

        '<div class="lc-body">',

          // ===== STEP 1: Contact Details =====
          '<div class="lc-screen active" id="bdStep1">',
            '<div class="lc-form-row">',
              '<label class="lc-label" for="bdName">Name</label>',
              '<input class="lc-input" id="bdName" type="text" placeholder="Full name" autocomplete="name">',
              '<div class="lc-error-msg" id="bdNameErr">Please enter your name.</div>',
            '</div>',
            '<div class="lc-form-row">',
              '<label class="lc-label" for="bdPhone">Mobile number</label>',
              '<div class="lc-phone-group">',
                '<select class="lc-select" id="bdCountry" aria-label="Country code">',
                  '<option value="+91" data-country="India" data-len="10" selected>🇮🇳 +91</option>',
                  '<option value="+1"  data-country="USA"    data-len="10">🇺🇸 +1</option>',
                  '<option value="+1"  data-country="Canada" data-len="10">🇨🇦 +1</option>',
                  '<option value="+44" data-country="UK"     data-len="10">🇬🇧 +44</option>',
                  '<option value="+971" data-country="UAE"   data-len="9">🇦🇪 +971</option>',
                  '<option value="+966" data-country="Saudi Arabia" data-len="9">🇸🇦 +966</option>',
                  '<option value="+65"  data-country="Singapore"   data-len="8">🇸🇬 +65</option>',
                  '<option value="+61"  data-country="Australia"   data-len="9">🇦🇺 +61</option>',
                '</select>',
                '<input class="lc-input" id="bdPhone" type="tel" inputmode="numeric" maxlength="10" placeholder="9876543210">',
              '</div>',
              '<div class="lc-error-msg" id="bdPhoneErr">Please enter a valid phone number.</div>',
            '</div>',
            '<div class="lc-form-row">',
              '<label class="lc-label" for="bdEmail">Work email</label>',
              '<input class="lc-input" id="bdEmail" type="email" placeholder="you@company.com" autocomplete="email">',
              '<div class="lc-error-msg" id="bdEmailErr">Please enter a valid email address.</div>',
            '</div>',
            '<div class="lc-actions">',
              '<span></span>',
              '<button class="lc-btn lc-btn-primary" id="bdContactNext">Continue →</button>',
            '</div>',
          '</div>',

          // ===== STEP 2: Date & Time Picker =====
          '<div class="lc-screen" id="bdStep2">',
            '<span class="lc-q-label">Choose Date & Time</span>',
            '<p style="font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.4">Select a 30-minute slot that works for you.</p>',
            '<div class="lc-calendar-picker">',
              '<label class="lc-label">Select Date</label>',
              '<div class="lc-date-chips" id="bdDateChips"></div>',
              '<div class="lc-time-title">Available Time Slots (IST)</div>',
              '<div class="lc-time-grid" id="bdTimeGrid"></div>',
            '</div>',
            '<div class="lc-actions">',
              '<button class="lc-btn lc-btn-ghost" id="bdBack">← Back</button>',
              '<button class="lc-btn lc-btn-primary" id="bdConfirm" disabled>Confirm Booking →</button>',
            '</div>',
          '</div>',

          // ===== SUCCESS =====
          '<div class="lc-success" id="bdSuccess">',
            '<div class="lc-success-icon">',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
            '</div>',
            '<h3 id="bdSuccessTitle">Demo Scheduled! 🎉</h3>',
            '<p id="bdSuccessDesc"></p>',
            '<div class="lc-success-actions">',
              '<a href="https://app.weflux.in/register" class="lc-btn lc-btn-primary" style="height:44px;padding:0 24px">Start Free Trial →</a>',
            '</div>',
          '</div>',

        '</div>', // end lc-body
      '</div>'  // end lc-modal
    ].join('');

    document.body.appendChild(el);
    return el;
  }

  // ---- BUILD ON DOM READY ----
  var popupEl = null;

  function ensurePopup() {
    if (!popupEl) {
      popupEl = buildDemoPopup();
      bindEvents();
    }
  }

  // ---- COOKIE UTILITIES ----
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  var SUBMIT_COOKIE = 'wf_lc_submitted';

  // ---- OPEN / CLOSE ----
  function openDemoPopup() {
    ensurePopup();

    // If user already submitted any form, show "already received" message
    if (getCookie(SUBMIT_COOKIE)) {
      showStep(1); // reset screens
      // Show success screen with "already received" message
      var step1 = document.getElementById('bdStep1');
      var step2 = document.getElementById('bdStep2');
      var successEl = document.getElementById('bdSuccess');
      var titleEl = document.getElementById('bdTitle');
      var subtitleEl = document.getElementById('bdSubtitle');
      var eyebrowEl = document.getElementById('bdEyebrow');
      var progressWrap = document.getElementById('bdProgressWrap');

      step1.classList.remove('active');
      step2.classList.remove('active');
      successEl.classList.add('active');
      titleEl.style.display = 'none';
      subtitleEl.style.display = 'none';
      eyebrowEl.style.display = 'none';
      progressWrap.style.display = 'none';

      var successTitle = document.getElementById('bdSuccessTitle');
      var successDesc = document.getElementById('bdSuccessDesc');
      if (successTitle) successTitle.textContent = 'We already have your details! ✅';
      if (successDesc) successDesc.innerHTML = 'Our team has received your information and will reach out to you shortly.<br><br>If you need immediate help, email <strong>hello@weflux.in</strong> or call <strong>888-44-06029</strong>.';

      popupEl.classList.add('show');
      document.body.style.overflow = 'hidden';
      return;
    }

    // Normal flow — reset to step 1
    bookState.step = 1;
    bookState.bookingDate = '';
    bookState.bookingTime = '';
    bookState.bookingTimeLabel = '';
    bookState.bookingDateDisplay = '';
    showStep(1);
    popupEl.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var nameInput = document.getElementById('bdName');
      if (nameInput) nameInput.focus();
    }, 400);
  }

  function closeDemoPopup() {
    if (popupEl) {
      popupEl.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  // ---- STEP NAVIGATION ----
  function showStep(step) {
    bookState.step = step;
    var step1 = document.getElementById('bdStep1');
    var step2 = document.getElementById('bdStep2');
    var successEl = document.getElementById('bdSuccess');
    var titleEl = document.getElementById('bdTitle');
    var subtitleEl = document.getElementById('bdSubtitle');
    var eyebrowEl = document.getElementById('bdEyebrow');
    var progressWrap = document.getElementById('bdProgressWrap');
    var progressLabel = document.getElementById('bdProgressLabel');
    var progressPct = document.getElementById('bdProgressPct');
    var progressFill = document.getElementById('bdProgressFill');

    step1.classList.remove('active');
    step2.classList.remove('active');
    successEl.classList.remove('active');

    if (step === 1) {
      step1.classList.add('active');
      titleEl.textContent = 'Schedule your 1-on-1 Demo';
      titleEl.style.display = '';
      subtitleEl.textContent = 'Share your details to book a 30-minute product walkthrough.';
      subtitleEl.style.display = '';
      eyebrowEl.style.display = '';
      progressWrap.style.display = '';
      progressLabel.textContent = 'Step 1 of 2';
      progressPct.textContent = '50%';
      progressFill.style.width = '50%';
    }
    else if (step === 2) {
      step2.classList.add('active');
      titleEl.textContent = 'Pick your Slot';
      titleEl.style.display = '';
      subtitleEl.textContent = 'Select a convenient date and 30-minute time slot.';
      subtitleEl.style.display = '';
      eyebrowEl.style.display = '';
      progressWrap.style.display = '';
      progressLabel.textContent = 'Step 2 of 2';
      progressPct.textContent = '100%';
      progressFill.style.width = '100%';
      renderDates();
    }
    else if (step === 3) {
      successEl.classList.add('active');
      titleEl.style.display = 'none';
      subtitleEl.style.display = 'none';
      eyebrowEl.style.display = 'none';
      progressWrap.style.display = 'none';
    }
  }

  // ---- RENDER CALENDAR ----
  function renderDates() {
    var dateContainer = document.getElementById('bdDateChips');
    var timeContainer = document.getElementById('bdTimeGrid');
    if (!dateContainer || !timeContainer) return;

    var upcoming = [];
    var d = new Date();
    while (upcoming.length < 8) {
      d.setDate(d.getDate() + 1);
      var day = d.getDay();
      if (day !== 0 && day !== 6) { // skip weekends
        var iso = d.toISOString().slice(0, 10);
        var dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        var monthName = d.toLocaleDateString('en-US', { month: 'short' });
        var dateNum = d.getDate();
        upcoming.push({ iso: iso, dayName: dayName, monthName: monthName, dateNum: dateNum, display: dayName + ', ' + monthName + ' ' + dateNum });
      }
    }

    dateContainer.innerHTML = upcoming.map(function(item, idx) {
      return '<div class="lc-date-chip' + (idx === 0 ? ' selected' : '') + '" data-date="' + item.iso + '" data-display="' + item.display + '">' +
        '<span class="lc-day-name">' + item.dayName + '</span>' +
        '<span class="lc-day-num">' + item.dateNum + '</span>' +
      '</div>';
    }).join('');

    bookState.bookingDate = upcoming[0].iso;
    bookState.bookingDateDisplay = upcoming[0].display;

    var times = [
      { label: '10:00 AM', val: '10:00' },
      { label: '11:30 AM', val: '11:30' },
      { label: '02:00 PM', val: '14:00' },
      { label: '03:30 PM', val: '15:30' },
      { label: '05:00 PM', val: '17:00' },
      { label: '06:30 PM', val: '18:30' }
    ];

    timeContainer.innerHTML = times.map(function(t) {
      return '<div class="lc-time-chip" data-time="' + t.val + '" data-label="' + t.label + '">' + t.label + '</div>';
    }).join('');

    bookState.bookingTime = '';
    bookState.bookingTimeLabel = '';
    var confirmBtn = document.getElementById('bdConfirm');
    if (confirmBtn) confirmBtn.disabled = true;
  }

  // ---- VALIDATION ----
  function getPhoneLen() {
    var sel = document.getElementById('bdCountry');
    if (!sel) return 10;
    var opt = sel.options[sel.selectedIndex];
    return parseInt((opt && opt.dataset.len) || '10', 10);
  }

  function clearErrors() {
    if (!popupEl) return;
    popupEl.querySelectorAll('.lc-input.error, .lc-select.error').forEach(function (el) { el.classList.remove('error'); });
    popupEl.querySelectorAll('.lc-error-msg.show').forEach(function (el) { el.classList.remove('show'); });
  }

  function showError(inputId, errId) {
    var inp = document.getElementById(inputId);
    var err = document.getElementById(errId);
    if (inp) inp.classList.add('error');
    if (err) err.classList.add('show');
  }

  // ---- SEND DATA TO GOOGLE APPS SCRIPT ----
  function sendBooking() {
    var utm = getUTM();
    var data = {
      formType:     'demo_booking',
      name:         bookState.name,
      phone:        bookState.dialCode && bookState.phone ? (bookState.dialCode + ' ' + bookState.phone) : bookState.phone,
      email:        bookState.email,
      country:      bookState.country,
      bookingDate:  bookState.bookingDate,
      bookingTime:  bookState.bookingTime,
      status:       'demo_booked',
      intentScore:  '100',
      intentTier:   '🔥 Hot Lead',
      sourcePage:   location.pathname,
      device:       getDevice(),
      utmSource:    utm.s,
      utmMedium:    utm.m,
      utmCampaign:  utm.c,
      submittedAt:  new Date().toISOString()
    };

    if (navigator.sendBeacon) {
      var blob = new Blob([new URLSearchParams(data).toString()], { type: 'application/x-www-form-urlencoded' });
      navigator.sendBeacon(ENDPOINT, blob);
    } else {
      try { fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) }); }
      catch (e) { /* silent */ }
    }
  }

  // ---- BIND ALL EVENTS ----
  function bindEvents() {
    var closeBtn = document.getElementById('bdClose');
    var backdrop = document.getElementById('bd-backdrop');

    // Close
    closeBtn.addEventListener('click', closeDemoPopup);
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeDemoPopup(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && backdrop.classList.contains('show')) closeDemoPopup();
    });

    // Phone: digits only
    var phoneInput = document.getElementById('bdPhone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, getPhoneLen());
      });
    }
    var countrySelect = document.getElementById('bdCountry');
    if (countrySelect) {
      countrySelect.addEventListener('change', function () {
        var len = getPhoneLen();
        phoneInput.maxLength = len;
        if (phoneInput.value.length > len) phoneInput.value = phoneInput.value.slice(0, len);
      });
    }

    // Step 1 → Step 2
    document.getElementById('bdContactNext').addEventListener('click', function () {
      clearErrors();
      var valid = true;
      var nameVal = document.getElementById('bdName').value.trim();
      var phoneVal = document.getElementById('bdPhone').value.trim();
      var emailVal = document.getElementById('bdEmail').value.trim();

      if (!nameVal) { showError('bdName', 'bdNameErr'); valid = false; }
      if (!phoneVal || phoneVal.length < getPhoneLen()) { showError('bdPhone', 'bdPhoneErr'); valid = false; }
      if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { showError('bdEmail', 'bdEmailErr'); valid = false; }
      if (!valid) return;

      bookState.name = nameVal;
      bookState.phone = phoneVal;
      bookState.email = emailVal;
      var opt = countrySelect.options[countrySelect.selectedIndex];
      bookState.dialCode = countrySelect.value;
      bookState.country = opt ? (opt.dataset.country || '') : '';

      showStep(2);
    });

    // Back button
    document.getElementById('bdBack').addEventListener('click', function () {
      showStep(1);
    });

    // Date & Time chip clicks (delegated)
    popupEl.addEventListener('click', function(e) {
      var dateChip = e.target.closest('#bd-backdrop .lc-date-chip');
      if (dateChip) {
        popupEl.querySelectorAll('#bdDateChips .lc-date-chip').forEach(function(c) { c.classList.remove('selected'); });
        dateChip.classList.add('selected');
        bookState.bookingDate = dateChip.dataset.date;
        bookState.bookingDateDisplay = dateChip.dataset.display;
        checkConfirm();
        return;
      }

      var timeChip = e.target.closest('#bd-backdrop .lc-time-chip');
      if (timeChip) {
        popupEl.querySelectorAll('#bdTimeGrid .lc-time-chip').forEach(function(c) { c.classList.remove('selected'); });
        timeChip.classList.add('selected');
        bookState.bookingTime = timeChip.dataset.time;
        bookState.bookingTimeLabel = timeChip.dataset.label;
        checkConfirm();
        return;
      }
    });

    function checkConfirm() {
      var btn = document.getElementById('bdConfirm');
      if (btn) btn.disabled = !(bookState.bookingDate && bookState.bookingTime);
    }

    // Confirm booking
    document.getElementById('bdConfirm').addEventListener('click', function () {
      sendBooking();
      setCookie(SUBMIT_COOKIE, 'submitted', 365); // suppress all popups permanently

      var successDesc = document.getElementById('bdSuccessDesc');
      if (successDesc) {
        successDesc.innerHTML = 'We have reserved <strong>' + (bookState.bookingDateDisplay || '') + ' at ' + (bookState.bookingTimeLabel || '') + ' (IST)</strong> for your 1-on-1 demo.<br><br>A Google Calendar invitation has been sent to <strong>' + bookState.email + '</strong>.';
      }
      showStep(3);
    });
  }

  // ---- INTERCEPT "Book a Demo" LINKS ----
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-book-demo], button[data-book-demo]');

    // Also intercept any link whose text includes "book a demo" (case-insensitive)
    if (!link) {
      var anchor = e.target.closest('a');
      if (anchor) {
        var txt = (anchor.textContent || '').toLowerCase().trim();
        if (txt.indexOf('book a demo') !== -1 || txt.indexOf('book demo') !== -1) {
          link = anchor;
        }
      }
    }

    if (link) {
      e.preventDefault();
      e.stopPropagation();
      openDemoPopup();
    }
  }, true);  // capture phase to beat other handlers

  // ---- EXPOSE GLOBALLY for manual triggering ----
  window.openWefluxDemoBooking = openDemoPopup;

})();
