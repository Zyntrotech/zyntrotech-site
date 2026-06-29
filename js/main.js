/* =========================================================
   ZYNTROTECH — Logique du site
   - i18n FR/EN avec mémorisation (localStorage)
   - menu mobile
   - animations d'apparition
   - formulaire de contact (mailto)
   ========================================================= */
(function () {
  "use strict";

  var SUPPORTED = ["fr", "en"];
  var DEFAULT_LANG = "fr";
  var CONTACT_EMAIL = "contact@zyntrotech.com"; // ← à adapter si besoin

  /* ---------- Thème (dark par défaut) ---------- */
  function getTheme() {
    var stored = localStorage.getItem("zt-theme");
    return stored === "light" ? "light" : "dark";
  }
  function applyTheme(theme) {
    var t = theme === "light" ? "light" : "dark";
    localStorage.setItem("zt-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }
  // Appliqué immédiatement pour éviter le flash
  applyTheme(getTheme());

  function initThemeToggle() {
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTheme(getTheme() === "light" ? "dark" : "light");
      });
    });
  }

  /* ---------- Langue ---------- */
  function getLang() {
    var stored = localStorage.getItem("zt-lang");
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    var nav = (navigator.language || DEFAULT_LANG).slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(nav) !== -1 ? nav : DEFAULT_LANG;
  }

  function t(key, lang) {
    var dict = window.TRANSLATIONS[lang] || {};
    return dict[key] !== undefined ? dict[key] : key;
  }

  function applyLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    localStorage.setItem("zt-lang", lang);
    document.documentElement.setAttribute("lang", lang);

    // Contenu texte
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"), lang);
    });

    // Attributs (placeholder, aria-label, content de meta, title…)
    var attrs = ["placeholder", "aria-label", "content", "title", "alt"];
    attrs.forEach(function (attr) {
      document.querySelectorAll("[data-i18n-" + attr + "]").forEach(function (el) {
        el.setAttribute(attr, t(el.getAttribute("data-i18n-" + attr), lang));
      });
    });

    // Titre de l'onglet
    var titleKey = document.body.getAttribute("data-title-key");
    if (titleKey) document.title = t(titleKey, lang);

    // État des boutons de langue
    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang);
    });
  }

  /* ---------- Menu mobile ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Sélecteur de langue ---------- */
  function initLangToggle() {
    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });
  }

  /* ---------- Animations d'apparition ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Formulaire de contact (Formspree) ---------- */
  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;
    var status = document.querySelector("#form-status");
    var btn = form.querySelector("button[type=submit]");
    var lang = getLang();

    function showStatus(kind) {
      if (!status) return;
      status.hidden = false;
      status.className = "form-status " + (kind === "ok" ? "ok" : "err");
      status.textContent = t(kind === "ok" ? "contact.form.ok" : "contact.form.err", getLang());
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.action || form.action.indexOf("REPLACE_WITH_YOUR_ID") !== -1) {
        // Pas encore configuré : repli sur l'e-mail direct
        var subj = (form.subject && form.subject.value || "Contact via le site").trim();
        var body = (form.message && form.message.value || "").trim() +
                   "\n\n— " + (form.name && form.name.value || "").trim();
        window.location.href = "mailto:" + CONTACT_EMAIL +
          "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
        return;
      }
      var original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = t("contact.form.sending", getLang()); }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          showStatus("ok");
        } else {
          showStatus("err");
        }
      }).catch(function () {
        showStatus("err");
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = original; }
      });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    applyLang(getLang());
    initNav();
    initLangToggle();
    initThemeToggle();
    initReveal();
    initContactForm();

    // Année du footer
    var y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
