/* Captain Chuck 4 — The Passage. Enhancement only; all content lives in the HTML. */
(function () {
  "use strict";
  var root = document.documentElement;
  var TOTAL_NM = 2650; // the passage as charted on this page: Alaska down the Pacific coast, through the Canal, up the Atlantic side, home to Newport — roughly Panama to San Diego

  function fmt(n) { return n.toLocaleString("en-US"); }

  var posLabel = document.getElementById("pos-label");
  var nmRun = document.getElementById("nm-run");
  var nmSailed = document.getElementById("nm-sailed");
  var nmSailed2 = document.getElementById("nm-sailed-2");
  var distNote = document.getElementById("dist-note");
  var NOTES = [
    [12, "THE NEWPORT CHANNEL TO CATALINA AND BACK"],
    [90, "NEWPORT BEACH TO SAN DIEGO POINT LOMA"],
    [340, "LOS ANGELES TO SAN FRANCISCO, NONSTOP"],
    [800, "SEATTLE TO NEWPORT BEACH"],
    [1400, "VANCOUVER ISLAND TO ACAPULCO"],
    [1900, "THE INSIDE PASSAGE TWICE OVER"],
    [2650, "ROUGHLY THE DISTANCE FROM PANAMA TO SAN DIEGO"]
  ];

  function progress() {
    var max = root.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, (window.scrollY || root.scrollTop) / max)) : 0;
  }

  var ticking = false;
  function update() {
    ticking = false;
    var p = progress();
    var nm = Math.round(p * TOTAL_NM);
    root.style.setProperty("--sp", p.toFixed(4));
    if (nmRun) nmRun.textContent = fmt(nm);
    if (nmSailed) nmSailed.textContent = fmt(Math.max(nm, 1));
    if (nmSailed2) nmSailed2.textContent = fmt(Math.max(nm, 1));
    if (distNote) {
      for (var i = 0; i < NOTES.length; i++) { if (nm <= NOTES[i][0] || i === NOTES.length - 1) { distNote.textContent = NOTES[i][1]; break; } }
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();

  // Position readout: whichever port owns the middle of the viewport.
  if (posLabel && "IntersectionObserver" in window) {
    var ports = Array.prototype.slice.call(document.querySelectorAll("[data-pos]"));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          posLabel.textContent = e.target.getAttribute("data-pos");
          posLabel.style.color = e.target.classList.contains("arrival") ? "#f0b761" : "";
        }
      });
    }, { rootMargin: "-48% 0px -48% 0px" });
    ports.forEach(function (el) { io.observe(el); });
  }

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  // FAQ: keep single-open accordion behaviour (works with or without motion prefs).
  var all = document.querySelectorAll(".faq details");
  all.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) all.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
})();
