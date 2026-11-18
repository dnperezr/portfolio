/* Home page: intro loader, pinned hero, scroll-driven split reveals, title blur on hover */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var rPin = $('pin'), rStage = $('stage'), rHeroBg = $('heroBg'), rCycle = $('cycle');
  var rHeroContent = $('heroContent'), rEyebrow = $('eyebrow'), rLockWrap = $('lockWrap');
  var rHeroTitle = $('heroTitle'), rBottomBar = $('bottomBar'), rNav = $('nav');
  var rReveal = $('reveal'), rCur = $('cur'), rNext = $('next');
  var rILT = $('ilt'), rILB = $('ilb'), rIRT = $('irt'), rIRB = $('irb');
  var rEyeCur = $('eyeCur'), rTitleCur = $('titleCur'), rCtaCur = $('ctaCur');
  var rEyeNext = $('eyeNext'), rTitleNext = $('titleNext'), rCtaNext = $('ctaNext');

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var slides = [
    { images: ['img/neon.webp', 'img/portrait.webp'], eyebrow: ['Brand & Identity', 'Content & Marketing', 'Film & Documentary'], title: 'Field<br>Signals', accentColor: 'var(--accent)', status: 'coming-soon', link: '#' },
    { images: ['img/camping.webp', 'img/collective.webp'], eyebrow: ['Brand & Identity', 'Editorial', 'Art Direction'], title: 'The<br>Collective', accentColor: 'var(--accent)', status: 'view-project', link: '#' },
    { images: ['img/azure.webp', 'img/closeup.webp'], eyebrow: ['Web & Digital', 'Content & Marketing', 'Campaign'], title: 'Azure<br>Hours', accentColor: 'var(--accent)', status: 'view-project', link: '#' }
  ];
  var cur = -1;

  /* ---------- slide content ---------- */
  function wrapChars(el) {
    if (!el) return;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          Array.prototype.slice.call(child.textContent).forEach(function (ch) {
            var s = document.createElement('span');
            s.className = 'ch';
            s.style.display = 'inline-block';
            s.style.willChange = 'filter';
            s.textContent = ch === ' ' ? ' ' : ch;
            frag.appendChild(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(el);
  }

  function fill(eye, title, cta, imgL, imgR, s) {
    eye.innerHTML = s.eyebrow.join('<br>'); eye.style.color = s.accentColor;
    title.innerHTML = s.title; title.style.color = s.accentColor; wrapChars(title);
    var v = s.status === 'view-project';
    cta.textContent = v ? 'View Full Project ↗' : 'Coming Soon';
    cta.style.color = v ? 'var(--text-primary)' : 'var(--text-secondary)';
    cta.setAttribute('href', s.link || '#');
    imgL.style.backgroundImage = 'url("' + s.images[0] + '")';
    imgR.style.backgroundImage = 'url("' + s.images[1] + '")';
  }

  function setSlide(i) {
    var N = slides.length;
    var c = slides[i];
    var n = slides[Math.min(i + 1, N - 1)];
    fill(rEyeCur, rTitleCur, rCtaCur, rILT, rIRT, c);
    fill(rEyeNext, rTitleNext, rCtaNext, rILB, rIRB, n);
    cur = i;
  }

  /* ---------- hover blur on titles (desktop only) ---------- */
  function initTitleBlur() {
    var touch = window.matchMedia && window.matchMedia('(hover: none)').matches;
    if (reduced || touch) return;
    var mx = -9999, my = -9999, blurV = { cur: 0, next: 0 };
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    var MAXB = 6, CURVE = 1.9, VWEIGHT = 0.45;
    function step() {
      [['cur', rTitleCur], ['next', rTitleNext]].forEach(function (pair) {
        var key = pair[0], title = pair[1];
        var r = title.getBoundingClientRect();
        var inside = mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom;
        var target = inside ? 1 : 0;
        var v = blurV[key];
        v += (target - v) * (target > v ? 0.20 : 0.085);
        blurV[key] = v;
        var spans = title.querySelectorAll('.ch');
        if (v < 0.001) { spans.forEach(function (ch) { if (ch.style.filter) ch.style.filter = ''; }); return; }
        var focusX = Math.min(Math.max(mx, r.left), r.right);
        var focusY = Math.min(Math.max(my, r.top), r.bottom);
        var halfW = r.width / 2, halfH = r.height / 2;
        spans.forEach(function (ch) {
          var cr = ch.getBoundingClientRect();
          var nx = ((cr.left + cr.width / 2) - focusX) / halfW;
          var ny = (((cr.top + cr.height / 2) - focusY) / halfH) * VWEIGHT;
          var t = Math.min(1, Math.hypot(nx, ny));
          var edge = Math.pow(t, CURVE);
          var b = MAXB * v * edge;
          ch.style.filter = b > 0.15
            ? 'blur(' + b.toFixed(2) + 'px) drop-shadow(0 0 ' + (b * 1.5).toFixed(2) + 'px rgba(255,236,0,' + (0.5 * edge * v).toFixed(3) + '))'
            : 'none';
        });
      });
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- scroll timeline ---------- */
  function applyT(t) {
    var mobile = window.innerWidth < 640;
    var tt = t;
    if (reduced || mobile) tt = t < 0.5 ? 0 : 1;
    var p = tt * 100, q = 100 - p;
    rILT.style.opacity = '1'; rILT.style.clipPath = 'inset(0 0 ' + p + '% 0)';
    rILB.style.opacity = '1'; rILB.style.clipPath = 'inset(' + q + '% 0 0 0)';
    rIRT.style.opacity = '1'; rIRT.style.clipPath = 'inset(' + p + '% 0 0 0)';
    rIRB.style.opacity = '1'; rIRB.style.clipPath = 'inset(0 0 ' + q + '% 0)';
    rCur.style.opacity = '1'; rCur.style.transform = 'none'; rCur.style.clipPath = 'inset(0 0 ' + p + '% 0)';
    rNext.style.opacity = '1'; rNext.style.transform = 'none'; rNext.style.clipPath = 'inset(' + q + '% 0 0 0)';
  }

  function updateAll() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var top = rPin.getBoundingClientRect().top + window.scrollY;
    var N = slides.length;
    var TRAVEL_HERO = 2.0, TRAVEL_SLIDE = 1.0;
    var totalTravel = TRAVEL_HERO + (N - 1) * TRAVEL_SLIDE;
    var g = (window.scrollY - top) / (totalTravel * vh);
    g = Math.max(0, Math.min(1, g));

    var aFrac = TRAVEL_HERO / totalTravel;
    var a = Math.max(0, Math.min(1, g / aFrac));
    var e = a * a * (3 - 2 * a);
    var ph = rHeroBg.firstElementChild;
    if (reduced) {
      rHeroBg.style.clipPath = 'inset(0 0 0 0)';
      if (ph) ph.style.transform = 'none';
    } else {
      var AR = 16 / 9, FRAC = 0.20;
      var Wf = vw * FRAC, Hf = Wf / AR;
      var W = vw + (Wf - vw) * e, H = vh + (Hf - vh) * e;
      var ix = ((vw - W) / 2) / vw * 100, iy = ((vh - H) / 2) / vh * 100;
      rHeroBg.style.clipPath = 'inset(' + iy + '% ' + ix + '% ' + iy + '% ' + ix + '%)';
      var s = Math.max(W / vw, H / vh);
      if (ph) ph.style.transform = 'scale(' + s + ')';
    }
    rReveal.style.transform = 'translate3d(0, ' + ((1 - e) * 100) + '%, 0)';
    var r = (20 * (1 - e)) + 'px';
    rReveal.style.borderTopLeftRadius = r;
    rReveal.style.borderTopRightRadius = r;

    var after = g - aFrac;
    var per = TRAVEL_SLIDE / totalTravel;
    var idx = 0, local = 0;
    if (after > 0) {
      idx = Math.min(Math.floor(after / per + 1e-9), N - 2);
      local = Math.max(0, Math.min(1, (after - idx * per) / per));
    }
    if (reduced || vw < 640) local = local < 0.5 ? 0 : 1;
    if (idx !== cur) setSlide(idx);
    applyT(local);
  }

  var raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; updateAll(); });
  }

  /* ---------- intro loader ---------- */
  var HERO_IMGS = ['img/runner.webp', 'img/lighthouse.webp'];
  var CYCLE_IMGS = ['img/closeup.webp', 'img/neon.webp', 'img/collective.webp', 'img/portrait.webp', 'img/azure.webp'];
  var LK_LINES = [['N', 'I', 'C', 'O', '/', ':'], ['P', 'E', 'R', 'E', 'Z']];
  var GLYPHS = "/\\|:;<>=+*#%&@ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var TL = (function () {
    var TYPE_START = 460, STEP = 132, LAND = 150, N = 11;
    var TYPE_END = TYPE_START + N * STEP + LAND;
    return {
      TYPE_START: TYPE_START, STEP: STEP, LAND: LAND, N: N, TYPE_END: TYPE_END,
      HOLD_END: TYPE_END + 420, DEL_COLON: TYPE_END + 420, DEL_SLASH: TYPE_END + 610, DEL_END: TYPE_END + 800,
      WIN_OPEN_S: 260, WIN_OPEN_D: 1300, WIN_FULL_S: TYPE_END + 560, WIN_FULL_D: 1060,
      GROW_S: TYPE_END + 800, GROW_D: 1200, CHROME_S: TYPE_END + 1900, CHROME_D: 520, END: TYPE_END + 2520
    };
  })();

  function seg(e, s, d) { return Math.max(0, Math.min(1, (e - s) / d)); }
  function expoOut(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function expoInOut(t) { if (t <= 0) return 0; if (t >= 1) return 1; return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2; }
  function smooth(t) { return t * t * (3 - 2 * t); }

  function setChrome(v) {
    var s = String(v);
    rEyebrow.style.opacity = s; rNav.style.opacity = s; rBottomBar.style.opacity = s;
  }

  var FINAL_LOCKUP_HTML = '<span style="display:block;transform:scaleX(.75);transform-origin:center;">NICO</span><span style="display:block;transform:scaleX(.75);transform-origin:center;">PEREZ</span><picture style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36%;height:auto;pointer-events:none;z-index:2;"><source srcset="img/art-director-black.webp" type="image/webp"><img src="img/art-director-black.gif" alt="Art Director" width="720" height="430" style="width:100%;height:auto;display:block;"></picture>';

  var chars = [], carets = [], loadRaf = null, t0 = 0, cyIdx = 0, swapped = false;

  function buildLockup() {
    rHeroTitle.innerHTML = '';
    chars = []; carets = [];
    LK_LINES.forEach(function (chs, li) {
      var line = document.createElement('span');
      line.style.cssText = 'position:relative; display:block; transform:scaleX(.75); transform-origin:center;';
      chs.forEach(function (ch) {
        var s = document.createElement('span');
        s.style.cssText = 'display:inline-block; text-align:center; overflow:hidden; vertical-align:baseline;';
        s.textContent = ch;
        line.appendChild(s);
        chars.push({ el: s, ch: ch, line: li });
      });
      var caret = document.createElement('i');
      caret.style.cssText = 'position:absolute; bottom:0.14em; width:0.085em; height:0.66em; background:var(--accent); display:none;';
      line.appendChild(caret);
      carets.push(caret);
      rHeroTitle.appendChild(line);
    });
    chars.forEach(function (c) { var w = c.el.offsetWidth; c.w = w; c.el.style.width = w + 'px'; c.el.style.visibility = 'hidden'; });
  }

  function gateReady() {
    var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var imgs = HERO_IMGS.concat(CYCLE_IMGS).map(function (u) {
      return new Promise(function (res) { var im = new Image(); im.onload = res; im.onerror = res; im.src = u; if (im.complete) res(); });
    });
    return Promise.race([Promise.all([fonts].concat(imgs)), new Promise(function (r) { setTimeout(r, 1200); })]);
  }

  function loaderTick(now) {
    var e = now - t0, T = TL;
    if (e >= T.END) { finishLoaderFinal(); return; }

    var openE = expoOut(seg(e, T.WIN_OPEN_S, T.WIN_OPEN_D));
    var fullE = expoInOut(seg(e, T.WIN_FULL_S, T.WIN_FULL_D));
    var winProg = Math.max(openE * 0.56, fullE);
    var vw = window.innerWidth, vh = window.innerHeight;
    var w0 = Math.min(240, vw * 0.18), h0 = w0 / 1.53;
    var it0 = ((vh - h0) / 2) / vh * 100, il0 = ((vw - w0) / 2) / vw * 100;
    var it = it0 * (1 - winProg), il = il0 * (1 - winProg);
    rStage.style.clipPath = 'inset(' + it + '% ' + il + '% ' + it + '% ' + il + '%)';

    var pushScale = 'scale(' + (1 + 0.18 * (1 - winProg)) + ')';
    rHeroBg.style.transform = pushScale;

    if (e >= 1545) { if (rCycle.style.display !== 'none') rCycle.style.display = 'none'; }
    else {
      var idx = 0;
      if (e >= 1060) idx = 4; else if (e >= 740) idx = 3; else if (e >= 530) idx = 2; else if (e >= 390) idx = 1;
      if (idx !== cyIdx) { cyIdx = idx; rCycle.style.backgroundImage = 'url("' + CYCLE_IMGS[idx] + '")'; }
      rCycle.style.transform = pushScale;
    }

    if (!swapped) {
      for (var k = 0; k < chars.length; k++) {
        var c = chars[k];
        var st = T.TYPE_START + k * T.STEP;
        if (e < st) { c.el.style.visibility = 'hidden'; if (c.el.textContent !== c.ch) c.el.textContent = c.ch; c._done = false; }
        else if (e < st + T.LAND) {
          c.el.style.visibility = 'visible';
          c.el.textContent = Math.random() < 0.75 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : c.ch;
          c.el.style.opacity = String(0.45 + 0.55 * ((e - st) / T.LAND));
          c._done = false;
        } else if (!c._done) {
          c.el.style.visibility = 'visible'; c.el.textContent = c.ch; c.el.style.opacity = '1'; c._done = true;
        }
      }
      var colon = chars[5], slash = chars[4];
      var dc = smooth(seg(e, T.DEL_COLON, 190));
      colon.el.style.width = (colon.w * (1 - dc)) + 'px';
      if (dc >= 1) colon.el.style.visibility = 'hidden';
      var ds = smooth(seg(e, T.DEL_SLASH, 190));
      slash.el.style.width = (slash.w * (1 - ds)) + 'px';
      if (ds >= 1) slash.el.style.visibility = 'hidden';

      if (e < T.HOLD_END) {
        var lastK = Math.max(0, Math.min(chars.length - 1, Math.floor((e - T.TYPE_START) / T.STEP)));
        if (e >= T.TYPE_START) {
          var cc = chars[lastK];
          carets.forEach(function (ca, i) { ca.style.display = (i === cc.line) ? 'block' : 'none'; });
          var caret = carets[cc.line];
          caret.style.left = (cc.el.offsetLeft + cc.el.offsetWidth) + 'px';
          caret.style.opacity = (e >= T.TYPE_END) ? ((Math.floor((e - T.TYPE_END) / 420) % 2 === 0) ? '1' : '0') : '1';
        }
      } else {
        carets.forEach(function (ca) { ca.style.display = 'none'; });
      }
    }

    if (!swapped && e >= T.GROW_S) {
      swapped = true;
      carets.forEach(function (ca) { ca.style.display = 'none'; });
      carets = [];
      rHeroTitle.innerHTML = FINAL_LOCKUP_HTML;
    }

    var sc = 0.22 + 0.78 * expoOut(seg(e, T.GROW_S, T.GROW_D));
    rLockWrap.style.transform = 'scale(' + sc + ')';
    setChrome(smooth(seg(e, T.CHROME_S, T.CHROME_D)));
    loadRaf = requestAnimationFrame(loaderTick);
  }

  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  function finishLoaderFinal() {
    loadRaf = null;
    rStage.style.clipPath = 'inset(0 0 0 0)';
    rLockWrap.style.transform = '';
    rHeroTitle.innerHTML = FINAL_LOCKUP_HTML;
    carets = [];
    rHeroBg.style.transform = 'scale(1)';
    rCycle.style.display = 'none';
    setChrome(1);
    unlockScroll();
    try { sessionStorage.setItem('siteEntered', 'true'); } catch (e) {}
    updateAll();
  }

  function finishLoader() {
    rStage.style.clipPath = 'inset(0 0 0 0)';
    rLockWrap.style.transform = '';
    rHeroBg.style.transform = 'scale(1)';
    rCycle.style.display = 'none';
    setChrome(1);
    unlockScroll();
  }

  function startLoader() {
    if (loadRaf) cancelAnimationFrame(loadRaf);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    rStage.style.clipPath = 'inset(50% 50% 50% 50%)';
    setChrome(0);
    rHeroBg.style.transform = 'scale(1.18)';
    rCycle.style.display = 'block';
    rCycle.style.backgroundImage = 'url("' + CYCLE_IMGS[0] + '")';
    rCycle.style.transform = 'scale(1.18)';
    cyIdx = 0; swapped = false;
    gateReady().then(function () {
      buildLockup();
      rLockWrap.style.transform = 'scale(0.22)';
      t0 = performance.now();
      loadRaf = requestAnimationFrame(loaderTick);
    });
  }

  /* ---------- init ---------- */
  var N = slides.length;
  rPin.style.height = (100 + (2.0 + (N - 1) * 1.0) * 100) + 'vh';
  setSlide(0);
  applyT(0);
  initTitleBlur();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateAll);
  updateAll();

  // Loader plays on first visit (or when coming back via "Home"), never page-to-page
  var runIt = false;
  try {
    var cameToHome = sessionStorage.getItem('replayLoader') === '1';
    sessionStorage.removeItem('replayLoader');
    if (reduced) runIt = false;
    else if (!sessionStorage.getItem('siteEntered') || cameToHome) runIt = true;
    if (runIt) sessionStorage.setItem('siteEntered', 'true');
  } catch (e) { runIt = false; }
  if (runIt) startLoader(); else finishLoader();
})();
