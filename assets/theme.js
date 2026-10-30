/* BuildCalc color mode: light only (V49 Navy+Gold). Persists via localStorage. */
(function () {
  var KEY = 'buildcalc-theme';
  function current() {
    return 'light';
  }
  function apply(mode) {
    document.documentElement.setAttribute('data-theme', 'light');
    try { localStorage.setItem(KEY, 'light'); } catch (e) {}
  }
  document.documentElement.setAttribute('data-theme', current());
  document.addEventListener('DOMContentLoaded', function () {
    apply(current());
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
