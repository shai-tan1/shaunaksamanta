(function () {
  "use strict";
  var root = document.documentElement;

  /* ---------- dark-mode toggle + click sound ---------- */
  var clickSound = new Audio("toggle-click.mp3");
  clickSound.preload = "auto";

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      try { clickSound.currentTime = 0; clickSound.play().catch(function () {}); } catch (e) {}
    });
  }

  /* ---------- nav border on scroll ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    window.addEventListener("scroll", function () {
      nav.classList.toggle("scrolled", window.scrollY > 8);
    });
  }

  /* ---------- mobile menu ---------- */
  var btn = document.getElementById("menuBtn");
  var links = document.getElementById("navLinks");
  if (btn && links) {
    btn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      btn.textContent = open ? "Close" : "Menu";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        btn.textContent = "Menu";
        btn.setAttribute("aria-expanded", false);
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el, i) {
    el.style.transitionDelay = (Math.min(i, 6) * 60) + "ms";
    io.observe(el);
  });

  /* ---------- current year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- contact form ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var status = document.getElementById("formStatus");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute("action") || "";
      if (endpoint.indexOf("your-form-id") !== -1) {
        status.textContent = "Add your Formspree endpoint to the form to enable sending.";
        status.className = "form-status err";
        return;
      }
      var submit = form.querySelector(".c-submit");
      var label = submit.textContent;
      submit.disabled = true; submit.textContent = "Sending\u2026";
      status.textContent = ""; status.className = "form-status";

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            status.textContent = "Thanks \u2014 your message is on its way.";
            status.className = "form-status ok";
            form.reset();
          } else {
            throw new Error("bad response");
          }
        })
        .catch(function () {
          status.textContent = "Something went wrong. Please email me directly.";
          status.className = "form-status err";
        })
        .finally(function () {
          submit.disabled = false; submit.textContent = label;
        });
    });
  }
})();
