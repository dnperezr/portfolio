/* Shared behaviour: grain toggle (press G), footer bars, "go home replays loader" flag */
(function () {
  var grain = document.getElementById('grain');
  function setGrain(on) {
    if (grain) grain.style.display = on ? 'block' : 'none';
    try { localStorage.setItem('grainOn', on ? '1' : '0'); } catch (e) {}
  }
  var on = true;
  try { on = localStorage.getItem('grainOn') !== '0'; } catch (e) {}
  setGrain(on);
  window.addEventListener('keydown', function (e) {
    if (e.key === 'g' || e.key === 'G') setGrain(!grain || grain.style.display === 'none');
  });

  // Links with data-home replay the intro loader on the Home page
  document.querySelectorAll('[data-home]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { sessionStorage.setItem('replayLoader', '1'); } catch (e) {}
    });
  });

  // Footer yellow bars crossing animation
  var box = document.getElementById('footBarsBox');
  var grp = document.getElementById('footBarsGrp');
  function measureBars() {
    if (!box || !grp) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var bw = box.clientWidth, gw = grp.scrollWidth;
    if (reduced) { grp.style.transform = 'translateX(' + ((bw - gw) / 2) + 'px)'; }
    else { grp.style.setProperty('--enter', (-gw) + 'px'); grp.style.setProperty('--exit', bw + 'px'); }
  }
  measureBars();
  window.addEventListener('resize', measureBars);
  window.addEventListener('load', measureBars);
})();
