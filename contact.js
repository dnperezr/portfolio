/* Contact page: cursor-following image trail + Bogotá clock */
(function () {
  var zones = [
    { img: 'img/blacksea.webp', caption: '[ CREATIVE DIRECTION ]' },
    { img: 'img/collective.webp', caption: '[ ART DIRECTION ]' },
    { img: 'img/neon.webp', caption: '[ FILM & DOCUMENTARY ]' },
    { img: 'img/portrait.webp', caption: '[ HIGH-IMPACT CONTENT ]' },
    { img: 'img/closeup.webp', caption: '[ AI VIDEO PRODUCTION ]' },
    { img: 'img/azure.webp', caption: '[ AI-NATIVE ]' }
  ];
  var stage = document.getElementById('stage');
  var hLine = document.getElementById('hLine');
  var vLine = document.getElementById('vLine');
  var imgWrap = document.getElementById('imgWrap');
  var imgEl = document.getElementById('trailImg');
  var capEl = document.getElementById('trailCaption');
  var clock = document.getElementById('clock');

  function tickClock() {
    if (!clock) return;
    clock.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Bogota' });
  }
  tickClock();
  setInterval(tickClock, 30000);

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia && window.matchMedia('(hover: none)').matches;
  if (reduced || touch) { if (stage) stage.style.display = 'none'; return; }

  zones.forEach(function (z) { var im = new Image(); im.src = z.img; });

  var cur = -1, travel = 0, entered = false, lastX = 0, lastY = 0, lastT = 0, fadeTimer = null;

  function setImg(i) {
    if (i === cur) return;
    cur = i;
    var z = zones[i] || zones[0];
    imgEl.setAttribute('src', z.img);
    capEl.textContent = z.caption;
  }
  function showStage() {
    if (fadeTimer) { clearTimeout(fadeTimer); fadeTimer = null; }
    stage.style.opacity = '1';
  }
  function hideStage() {
    if (fadeTimer) clearTimeout(fadeTimer);
    fadeTimer = setTimeout(function () { stage.style.opacity = '0'; }, 500);
  }

  setImg(0);

  document.addEventListener('mousemove', function (e) {
    var now = performance.now();
    if (!entered) { entered = true; lastX = e.clientX; lastY = e.clientY; lastT = now; }
    var dx = e.clientX - lastX, dy = e.clientY - lastY;
    var dist = Math.hypot(dx, dy);
    var dt = Math.max(1, now - lastT);
    var vel = dist / dt;
    lastX = e.clientX; lastY = e.clientY; lastT = now;
    var threshold = Math.max(40, 250 - vel * 400);
    travel += dist;
    if (travel > threshold) { travel = 0; setImg((cur + 1) % zones.length); }
    imgWrap.style.transform = 'translate(' + (e.clientX - imgWrap.offsetWidth / 2) + 'px, ' + (e.clientY - imgWrap.offsetHeight / 2) + 'px)';
    hLine.style.transform = 'translateY(' + e.clientY + 'px)';
    vLine.style.transform = 'translateX(' + e.clientX + 'px)';
    showStage();
  });
  document.addEventListener('mouseleave', function (e) {
    if (e.relatedTarget === null) hideStage();
  });
  window.addEventListener('blur', hideStage);
})();
