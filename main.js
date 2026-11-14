/* =========================================================
   BA. Arquitectos & Desarrolladores — main.js
   Vanilla JS, patrón IIFE, sin dependencias.
   ========================================================= */
(function () {
  "use strict";

  var WHATSAPP = "5493816402751";
  document.documentElement.classList.remove("no-js");

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[BA] " + name + " falló:", e); }
  }

  /* ---------- Splash + entrada del hero ---------- */
  function initSplash() {
    var splash = document.querySelector("[data-splash]");
    var done = false;
    function hide() {
      if (done) return; done = true;
      if (splash) splash.classList.add("is-out");
      document.body.classList.add("is-loaded");
    }
    if (document.readyState === "complete") setTimeout(hide, 1300);
    else window.addEventListener("load", function () { setTimeout(hide, 900); });
    setTimeout(hide, 3200); // red de seguridad
  }

  /* ---------- Nav: sólida al bajar, se oculta al scrollear hacia abajo ---------- */
  function initNav() {
    var nav = document.querySelector("[data-nav]");
    var toggle = document.querySelector("[data-toggle]");
    if (!nav) return;
    var lastY = 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      nav.classList.toggle("is-solid", y > 40);
      if (!nav.classList.contains("is-open")) nav.classList.toggle("is-hidden", y > lastY && y > 500);
      lastY = y;
    }, { passive: true });

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    if (toggle) toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      nav.classList.remove("is-hidden");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) { a.addEventListener("click", close); });
  }

  /* ---------- Reveal genérico ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.01, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* ---------- Manifiesto: las palabras se encienden con el scroll ---------- */
  function initWords() {
    var el = document.querySelector("[data-words]");
    if (!el || el.dataset.bound) return;
    el.dataset.bound = "1";
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    function wrap(text) {
      return text.split(/(\s+)/).map(function (w) {
        return /^\s+$/.test(w) || !w ? w : '<span class="w" aria-hidden="true">' + w + "</span>";
      }).join("");
    }
    el.innerHTML = Array.prototype.map.call(el.childNodes, function (n) {
      if (n.nodeType === 3) return wrap(n.textContent);
      if (n.nodeType === 1) { var t = n.tagName.toLowerCase(); return "<" + t + ">" + wrap(n.textContent) + "</" + t + ">"; }
      return "";
    }).join("");
    var words = el.querySelectorAll(".w");
    var ticking = false;
    function update() {
      ticking = false;
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      p = Math.max(0, Math.min(1, p));
      var n = Math.round(p * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle("on", i < n);
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Proyectos: acordeón + preview que sigue al cursor ---------- */
  function initProjects() {
    var list = document.querySelector("[data-plist]");
    if (!list) return;
    var items = list.querySelectorAll(".pitem");
    items.forEach(function (item) {
      var btn = item.querySelector(".prow");
      btn.addEventListener("click", function () {
        var open = !item.classList.contains("is-open");
        items.forEach(function (o) { o.classList.remove("is-open"); o.querySelector(".prow").setAttribute("aria-expanded", "false"); });
        if (open) { item.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); }
        if (preview) preview.classList.remove("is-on");
      });
    });

    var preview = document.querySelector("[data-preview]");
    if (!preview || matchMedia("(hover: none)").matches) return;
    var img = preview.querySelector("img");
    var x = 0, y = 0, cx = 0, cy = 0, raf = null;
    function loop() {
      cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
      preview.style.transform = "translate3d(" + (cx + 40) + "px," + (cy - 140) + "px,0)";
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.5 ? requestAnimationFrame(loop) : null;
    }
    items.forEach(function (item) {
      var row = item.querySelector(".prow");
      row.addEventListener("mouseover", function (e) {
        if (row.contains(e.relatedTarget) || item.classList.contains("is-open")) return;
        img.src = item.getAttribute("data-img");
        cx = x = e.clientX; cy = y = e.clientY;
        preview.classList.add("is-on");
        loop();
      });
      row.addEventListener("mouseout", function (e) {
        if (!row.contains(e.relatedTarget)) preview.classList.remove("is-on");
      });
    });
    list.addEventListener("mousemove", function (e) {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  }

  /* ---------- Contadores ---------- */
  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, to = +el.getAttribute("data-count"), t0 = null;
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / 1600), k = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(to * k).toLocaleString("es-AR");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.01 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Proceso: imagen fija que cambia por etapa ---------- */
  function initProcess() {
    var steps = document.querySelectorAll("[data-step]");
    var imgs = document.querySelectorAll("[data-step-img]");
    var num = document.querySelector("[data-step-num]");
    if (!steps.length || !("IntersectionObserver" in window)) return;
    function activate(i) {
      steps.forEach(function (s) { s.classList.toggle("is-active", s.getAttribute("data-step") === i); });
      imgs.forEach(function (im) { im.classList.toggle("is-on", im.getAttribute("data-step-img") === i); });
      var on = document.querySelector('[data-step-img="' + i + '"]'), fr = document.querySelector("[data-frame]");
      if (on && fr) fr.style.setProperty("--frame-img", "url(" + on.getAttribute("src") + ")");
      if (num) num.textContent = "0" + (+i + 1);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) activate(e.target.getAttribute("data-step")); });
    }, { rootMargin: window.innerWidth <= 860 ? "-62% 0px -30% 0px" : "-45% 0px -45% 0px", threshold: 0 });
    steps.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Formulario → WhatsApp ---------- */
  function initForm() {
    var form = document.querySelector("[data-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = form.nombre.value.trim();
      if (!nombre) { form.nombre.classList.add("is-error"); form.nombre.focus(); return; }
      form.nombre.classList.remove("is-error");
      var interes = (form.querySelector("input[name=interes]:checked") || {}).value || "hacer una consulta";
      var msg = form.mensaje.value.trim();
      var text = "Hola BA, soy " + nombre + ". Me interesa " + interes + "." + (msg ? "\n\n" + msg : "");
      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }

  function boot() {
    safe(initSplash, "splash");
    safe(initNav, "nav");
    safe(initReveal, "reveal");
    safe(initWords, "words");
    safe(initProjects, "projects");
    safe(initCounters, "counters");
    safe(initProcess, "process");
    safe(initForm, "form");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
