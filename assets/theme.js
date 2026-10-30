/* BuildCalc color mode: green only. Persists via localStorage. */
(function () {
  var KEY = 'buildcalc-theme';
  function current() {
    return 'green';
  }
  function apply(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    try { localStorage.setItem(KEY, mode); } catch (e) {}
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      var isWhite = mode === 'white';
      btn.textContent = isWhite ? 'Black mode' : 'White mode';
      btn.setAttribute('aria-pressed', isWhite ? 'true' : 'false');
      btn.setAttribute('aria-label', isWhite ? 'Switch to black colour mode' : 'Switch to white colour mode');
    });
  }
  document.documentElement.setAttribute('data-theme', current());
  document.addEventListener('DOMContentLoaded', function () {
    // Universe background replaces the old bg-lighting/bg-stars divs: do not create them.
    apply(current());
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        apply(current() === 'white' ? 'red' : 'white');
      });
    });
  });
})();

// Load the BuildCalc FAQ chatbox on every page (chatbot.js lives at site root).
(function(){
  if (document.querySelector('script[src*="chatbot.js"]')) return;
  var scripts=document.getElementsByTagName('script'), src='';
  for (var i=0;i<scripts.length;i++){ if (scripts[i].src && scripts[i].src.indexOf('theme.js')>-1){ src=scripts[i].src; break; } }
  var chatSrc = src ? src.replace('assets/theme.js','chatbot.js') : 'chatbot.js';
  var s=document.createElement('script'); s.src=chatSrc; s.defer=true; document.body.appendChild(s);
})();

// Load the Universe background animation on every page (universe.js lives in assets/).
(function(){
  if (document.querySelector('script[src*="universe.js"]')) return;
  var scripts=document.getElementsByTagName('script'), src='';
  for (var i=0;i<scripts.length;i++){ if (scripts[i].src && scripts[i].src.indexOf('theme.js')>-1){ src=scripts[i].src; break; } }
  var s=document.createElement('script'); s.src = src ? src.replace('theme.js','universe.js') : 'assets/universe.js'; document.body.appendChild(s);
})();
