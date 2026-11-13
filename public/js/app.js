/* ============================================================
   IRONFORM — jQuery + Bootstrap 5 frontend
   Talks to the Express/MongoDB backend under /api/*
   ============================================================ */
$(function () {
  const API = "/api";
  const TOKEN_KEY = "ironform_token";
  const USER_KEY = "ironform_user";

  /* ---------------- Auth helpers ---------------- */
  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); }
    catch (e) { return null; }
  }
  function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    reflectAuthState();
  }
  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    reflectAuthState();
  }
  function authHeader() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  function reflectAuthState() {
    const user = getUser();
    if (user) {
      $(".auth-guest").addClass("d-none");
      $(".auth-user").removeClass("d-none");
      $("#navUserName").text(user.name);
    } else {
      $(".auth-guest").removeClass("d-none");
      $(".auth-user").addClass("d-none");
    }
  }

  /* ---------------- Generic AJAX wrapper ---------------- */
  function api(method, url, data) {
    return $.ajax({
      url: API + url,
      method,
      contentType: "application/json",
      data: data ? JSON.stringify(data) : undefined,
      headers: authHeader(),
    });
  }

  /* ---------------- Render: Programs ---------------- */
  function loadPrograms() {
    const $status = $("#programsStatus");
    const $grid = $("#programsGrid");
    $status.text("Loading programs…");

    api("GET", "/programs").done((programs) => {
      $status.text("");
      $grid.html(programs.map(programCard).join(""));
    }).fail(() => {
      $status.addClass("error").text("Couldn't reach the server — is the backend running with MongoDB connected?");
    });
  }

  function programCard(p) {
    const plates = [1, 2, 3].map(n =>
      `<span class="plate-dot ${n <= p.difficulty ? "filled" : ""}"></span>`
    ).join("");
    return `
      <div class="col-md-6 col-lg-4">
        <div class="program-card reveal">
          <div class="program-icon">${escapeHtml(p.icon)}</div>
          <h3>${escapeHtml(p.name)}</h3>
          <p>${escapeHtml(p.description)}</p>
          <div class="program-meta">
            <span class="duration">${escapeHtml(p.duration)}</span>
            <div class="plates" aria-label="Difficulty ${p.difficulty} of 3">${plates}</div>
          </div>
        </div>
      </div>`;
  }

  /* ---------------- Render: Trainers ---------------- */
  function loadTrainers() {
    const $status = $("#trainersStatus");
    const $grid = $("#trainersGrid");
    $status.text("Loading trainers…");

    api("GET", "/trainers").done((trainers) => {
      $status.text("");
      $grid.html(trainers.map(trainerCard).join(""));
    }).fail(() => {
      $status.addClass("error").text("Couldn't load trainers from the server.");
    });
  }

  function trainerCard(t) {
    return `
      <div class="col-sm-6 col-lg-3">
        <div class="trainer-card reveal">
          <div class="trainer-photo" style="background-image:url('https://picsum.photos/seed/${encodeURIComponent(t.photoSeed)}/400/500')"></div>
          <div class="trainer-body">
            <h3>${escapeHtml(t.name)}</h3>
            <p class="trainer-spec">${escapeHtml(t.specialization)}</p>
            <div class="trainer-stats">
              <div><strong>${escapeHtml(t.experience)}</strong>Experience</div>
              <div><strong>${escapeHtml(t.certification)}</strong>Certified</div>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ---------------- Render: Plans ---------------- */
  function loadPlans() {
    const $status = $("#plansStatus");
    const $row = $("#plansRow");
    $status.text("Loading membership plans…");

    api("GET", "/plans").done((plans) => {
      $status.text("");
      $row.html(plans.map(planCard).join(""));
      $row.find("[data-plan]").on("click", function () {
        document.getElementById("trial").scrollIntoView({ behavior: "smooth" });
      });
    }).fail(() => {
      $status.addClass("error").text("Couldn't load plans from the server.");
    });
  }

  function planCard(pl) {
    return `
      <div class="plan-card ${pl.tier} reveal">
        <div class="plan-plate">
          <span class="plate-weight">${escapeHtml(pl.plateWeight)}</span>
          <span class="plate-price"><sup>$</sup>${pl.price}</span>
          <span class="plate-weight">/ month</span>
        </div>
        <span class="plan-tag">${escapeHtml(pl.tag)}</span>
        <h3>${escapeHtml(pl.name)}</h3>
        <ul class="plan-benefits">
          ${pl.benefits.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>
        <button class="btn btn-volt w-100" data-plan="${escapeHtml(pl.name)}">Join Now</button>
      </div>`;
  }

  /* ---------------- Render: Gallery ---------------- */
  function loadGallery() {
    const $status = $("#galleryStatus");
    const $grid = $("#galleryGrid");
    $status.text("Loading gallery…");

    api("GET", "/gallery").done((images) => {
      $status.text("");
      $grid.html(images.map(galleryItem).join(""));
      $grid.find(".gallery-item").on("click", function () {
        const full = $(this).data("full");
        const label = $(this).data("label");
        $("#lightboxImg").attr("src", full).attr("alt", label);
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("lightboxModal"));
        modal.show();
      });
    }).fail(() => {
      $status.addClass("error").text("Couldn't load the gallery from the server.");
    });
  }

  function galleryItem(g) {
    const thumb = `https://picsum.photos/seed/${encodeURIComponent(g.imageSeed)}/400/400`;
    const full = `https://picsum.photos/seed/${encodeURIComponent(g.imageSeed)}/1000/1000`;
    return `
      <div class="col-6 col-sm-4 col-lg-3">
        <div class="gallery-item reveal" data-full="${full}" data-label="${escapeHtml(g.label)}">
          <img src="${thumb}" alt="${escapeHtml(g.label)}" loading="lazy">
          <span>${escapeHtml(g.label)}</span>
        </div>
      </div>`;
  }

  /* ---------------- Render: Testimonials (Bootstrap Carousel) ---------------- */
  function loadTestimonials() {
    const $status = $("#testimonialsStatus");
    const $inner = $("#testimonialInner");
    const $indicators = $("#testimonialIndicators");
    $status.text("Loading reviews…");

    api("GET", "/testimonials").done((testimonials) => {
      $status.text("");
      $inner.html(testimonials.map((t, i) => testimonialSlide(t, i === 0)).join(""));
      $indicators.html(testimonials.map((_, i) => `
        <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="${i}" ${i === 0 ? 'class="active"' : ""}></button>
      `).join(""));
    }).fail(() => {
      $status.addClass("error").text("Couldn't load reviews from the server.");
    });
  }

  function testimonialSlide(t, active) {
    const stars = "★".repeat(t.stars) + "☆".repeat(5 - t.stars);
    return `
      <div class="carousel-item ${active ? "active" : ""}">
        <div class="t-slide-card">
          <div class="t-stars">${stars}</div>
          <p class="t-quote">&ldquo;${escapeHtml(t.quote)}&rdquo;</p>
          <p class="t-name">&mdash; ${escapeHtml(t.memberName)}</p>
        </div>
      </div>`;
  }

  /* ---------------- Stat counters ---------------- */
  function animateCounters() {
    const els = document.querySelectorAll(".stat-num");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach((el) => observer.observe(el));
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    // Re-run periodically since content is injected asynchronously via AJAX
    const interval = setInterval(() => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => observer.observe(el));
    }, 400);
    setTimeout(() => clearInterval(interval), 8000);
  }

  /* ---------------- Theme toggle ---------------- */
  function initTheme() {
    const saved = localStorage.getItem("ironform-theme");
    if (saved === "light") document.documentElement.setAttribute("data-theme", "light");

    $("#modeToggle").on("click", function () {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      if (isLight) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("ironform-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("ironform-theme", "light");
      }
    });
  }

  /* ---------------- Validation helpers ---------------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function markInvalid($field, message) {
    $field.addClass("is-invalid");
    $field.siblings(".invalid-feedback").text(message);
  }
  function markValid($field) {
    $field.removeClass("is-invalid");
    $field.siblings(".invalid-feedback").text("");
  }
  function validateField($field) {
    const el = $field[0];
    if (el.validity.valueMissing) { markInvalid($field, "This field is required."); return false; }
    if (el.type === "email" && el.validity.typeMismatch) { markInvalid($field, "Enter a valid email address."); return false; }
    if (el.type === "tel" && el.value.replace(/\D/g, "").length < 7) { markInvalid($field, "Enter a valid phone number."); return false; }
    if (el.hasAttribute("minlength") && el.value.length < +el.getAttribute("minlength")) {
      markInvalid($field, `Must be at least ${el.getAttribute("minlength")} characters.`); return false;
    }
    markValid($field);
    return true;
  }

  /* ---------------- Booking + Contact forms (POST to backend) ---------------- */
  function initApiForm({ formId, confirmId, endpoint, fieldMap, successMessage }) {
    const $form = $("#" + formId);
    if (!$form.length) return;
    const $confirm = $("#" + confirmId);

    $form.find("input, select, textarea").on("blur", function () { validateField($(this)); });

    $form.on("submit", function (e) {
      e.preventDefault();
      const $fields = $form.find("input, select, textarea");
      const allValid = $fields.toArray().map(el => validateField($(el))).every(Boolean);
      if (!allValid) return;

      const payload = {};
      Object.entries(fieldMap).forEach(([key, id]) => { payload[key] = $("#" + id).val(); });

      const $btn = $form.find("button[type=submit]").prop("disabled", true);
      api("POST", endpoint, payload)
        .done(() => {
          $confirm.text(successMessage);
          $form[0].reset();
          $fields.removeClass("is-invalid");
        })
        .fail((xhr) => {
          const msg = xhr.responseJSON?.message || "Something went wrong — please try again.";
          $confirm.css("color", "#e1483c").text(msg);
        })
        .always(() => {
          $btn.prop("disabled", false);
          setTimeout(() => { $confirm.text(""); $confirm.css("color", ""); }, 6000);
        });
    });
  }

  function initNewsletter() {
    const $form = $("#newsletterForm");
    const $confirm = $("#newsletterConfirm");
    const $input = $("#newsletterEmail");

    $form.on("submit", function (e) {
      e.preventDefault();
      if (!$input[0].checkValidity()) {
        $confirm.css("color", "#e1483c").text("Enter a valid email address.");
        return;
      }
      $confirm.css("color", "").text("You're on the list.");
      $form[0].reset();
      setTimeout(() => $confirm.text(""), 5000);
    });
  }

  /* ---------------- Auth forms ---------------- */
  function initAuthForms() {
    $("#registerForm").on("submit", function (e) {
      e.preventDefault();
      const $err = $("#registerError").addClass("d-none");
      const body = {
        name: $("#registerName").val(),
        email: $("#registerEmail").val(),
        password: $("#registerPassword").val(),
      };
      api("POST", "/auth/register", body)
        .done((res) => {
          setSession(res.token, res.user);
          bootstrap.Modal.getOrCreateInstance(document.getElementById("registerModal")).hide();
          this.reset();
        })
        .fail((xhr) => {
          $err.removeClass("d-none").text(xhr.responseJSON?.message || "Registration failed.");
        });
    });

    $("#loginForm").on("submit", function (e) {
      e.preventDefault();
      const $err = $("#loginError").addClass("d-none");
      const body = { email: $("#loginEmail").val(), password: $("#loginPassword").val() };
      api("POST", "/auth/login", body)
        .done((res) => {
          setSession(res.token, res.user);
          bootstrap.Modal.getOrCreateInstance(document.getElementById("loginModal")).hide();
          this.reset();
        })
        .fail((xhr) => {
          $err.removeClass("d-none").text(xhr.responseJSON?.message || "Login failed.");
        });
    });

    $("#logoutBtn").on("click", function (e) {
      e.preventDefault();
      clearSession();
    });
  }

  /* ---------------- Init ---------------- */
  reflectAuthState();
  initTheme();
  initAuthForms();
  initNewsletter();
  animateCounters();
  initReveal();

  loadPrograms();
  loadTrainers();
  loadPlans();
  loadGallery();
  loadTestimonials();

  initApiForm({
    formId: "trialForm",
    confirmId: "trialConfirm",
    endpoint: "/bookings",
    fieldMap: { name: "trialName", email: "trialEmail", date: "trialDate", time: "trialTime", goal: "trialGoal" },
    successMessage: "Session reserved — we'll confirm by email shortly.",
  });

  initApiForm({
    formId: "contactForm",
    confirmId: "contactConfirm",
    endpoint: "/contact",
    fieldMap: { name: "contactName", email: "contactEmail", phone: "contactPhone", message: "contactMessage" },
    successMessage: "Message sent — we'll get back to you within a day.",
  });

  // Minimum bookable date is today
  const today = new Date().toISOString().split("T")[0];
  $("#trialDate").attr("min", today);
});
