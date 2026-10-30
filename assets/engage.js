// BuildCalc engagement: sticky header nav, recent, favourites, share, print, tool of day, popular searches. No login, browser only.
(function(){
  function esc(t){return String(t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  var isHome = /index\.html$/.test(location.pathname) || location.pathname.endsWith('/');
  var prefix = location.pathname.indexOf('/calculators/')>=0 || location.pathname.indexOf('/tools/')>=0 || location.pathname.indexOf('/categories/')>=0 ? '../' : '';
  // Record recent (not on home itself)
  try{
    if(!isHome){
      var rec = JSON.parse(localStorage.getItem('bc_recent')||'[]');
      var title = document.title.replace(' - BuildCalc','');
      rec = rec.filter(function(x){return x.url!==location.href;});
      rec.unshift({title:title, url:location.href});
      localStorage.setItem('bc_recent', JSON.stringify(rec.slice(0,6)));
    }
  }catch(e){}
  // Toolbar on calculator/tool pages: favourite, share, print
  var main = document.querySelector('main');
  if(main && !isHome && !document.querySelector('.bc-toolbar')){
    var tb = document.createElement('div'); tb.className='bc-toolbar';
    tb.innerHTML = '<button id="bcFav">★ Favourite</button> <button id="bcShare">Share</button> <button id="bcPrint">Print result</button>';
    main.insertBefore(tb, main.firstChild);
    var favBtn = document.getElementById('bcFav');
    try{
      var favs = JSON.parse(localStorage.getItem('bc_fav')||'[]');
      if(favs.some(function(x){return x.url===location.href;})) favBtn.textContent='★ Saved';
    }catch(e){}
    favBtn.onclick = function(){
      try{
        var favs = JSON.parse(localStorage.getItem('bc_fav')||'[]');
        var i = favs.findIndex(function(x){return x.url===location.href;});
        if(i>=0){ favs.splice(i,1); favBtn.textContent='★ Favourite'; }
        else { favs.unshift({title:document.title.replace(' - BuildCalc',''), url:location.href}); favBtn.textContent='★ Saved'; }
        localStorage.setItem('bc_fav', JSON.stringify(favs.slice(0,20)));
      }catch(e){}
    };
    document.getElementById('bcShare').onclick = function(){
      var url = location.href;
      if(navigator.share){ navigator.share({title:document.title, url:url}).catch(function(){}); }
      else { window.open('https://wa.me/?text='+encodeURIComponent(document.title+' '+url), '_blank'); }
    };
    document.getElementById('bcPrint').onclick = function(){ window.print(); };
  }
  // Home sections
  if(isHome){
    try{
      var rec = JSON.parse(localStorage.getItem('bc_recent')||'[]');
      var favs = JSON.parse(localStorage.getItem('bc_fav')||'[]');
      var recEl = document.getElementById('bcRecentList');
      if(recEl && rec.length){ recEl.innerHTML = rec.map(function(x){return '<a href="'+esc(x.url)+'">'+esc(x.title)+'</a>';}).join(' • '); document.getElementById('bcRecent').style.display='block'; }
      var favEl = document.getElementById('bcFavList');
      if(favEl && favs.length){ favEl.innerHTML = favs.map(function(x){return '<a href="'+esc(x.url)+'">★ '+esc(x.title)+'</a>';}).join(' • '); document.getElementById('bcFavs').style.display='block'; }
    }catch(e){}
    // Tool of the day: date-based pick
    var tools = [
      ['calculators/mortgage-payment-calculator.html','Mortgage Payment Calculator'],
      ['calculators/compound-interest-calculator.html','Compound Interest Calculator'],
      ['calculators/bmi-calculator.html','BMI Calculator'],
      ['calculators/percentage-calculator.html','Percentage Calculator'],
      ['calculators/loan-monthly-payment-calculator.html','Loan Monthly Payment Calculator'],
      ['calculators/concrete-calculator.html','Concrete Calculator'],
      ['tools/finance-loan-amortization-schedule.html','Loan Amortization Schedule']
    ];
    var tod = document.getElementById('bcTod');
    if(tod){
      var d = new Date(); var idx = (d.getFullYear()*366 + d.getMonth()*31 + d.getDate()) % tools.length;
      tod.innerHTML = 'Tool of the Day: <a href="'+tools[idx][0]+'">'+tools[idx][1]+'</a>';
    }
  }

  // Return-visitor extras: Tip of Day, Continue, Progress
  if(isHome){
    try{
      var tips=['Save a little every month, even a small amount grows with time.','Check your loan interest before you sign, small rate changes matter a lot.','Drink water regularly, small habits add up.','Measure twice before you buy building material, it saves money.','Write your monthly expenses once, you will see where money goes.'];
      var d2=new Date(); var tipEl=document.getElementById('bcTip');
      if(tipEl) tipEl.innerHTML='Tip of the Day: '+tips[(d2.getFullYear()*366+d2.getMonth()*31+d2.getDate())%tips.length];
      var rec2=JSON.parse(localStorage.getItem('bc_recent')||'[]');
      var favs2=JSON.parse(localStorage.getItem('bc_fav')||'[]');
      if(rec2.length){ var c=document.getElementById('bcContinue'); if(c){ c.style.display='block'; document.getElementById('bcContinueLink').innerHTML='<a href="'+esc(rec2[0].url)+'">'+esc(rec2[0].title)+'</a>'; } }
      var total=rec2.length+favs2.length;
      if(total>0){ var p=document.getElementById('bcProgress'); if(p){ p.style.display='block'; document.getElementById('bcProgressText').textContent='You have used '+rec2.length+' calculators and saved '+favs2.length+' favourites on this device.'; } }
    }catch(err){}
  }

  var lastY = window.scrollY;
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    var hdr = document.querySelector('header');
    if(!hdr) return;
    if(document.querySelector('.nav-links.open')){ lastY=y; return; }
    if(y > lastY && y > 120){ hdr.style.animation='none'; hdr.style.transform='translateY(-110%)'; hdr.style.top='-120px'; hdr.classList.add('bc-hide'); }
    else { hdr.style.animation=''; hdr.style.transform=''; hdr.style.top=''; hdr.classList.remove('bc-hide'); }
    lastY = y;
  }, {passive:true});
})();

// Mobile menu button (nav links are hidden under 700px otherwise)
(function(){
  var w=document.querySelector('header .wrap'), n=document.querySelector('header .nav-links');
  if(!w||!n||document.querySelector('.menu-btn')) return;
  var b=document.createElement('button'); b.type='button'; b.className='menu-btn'; b.setAttribute('aria-label','Open menu'); b.setAttribute('aria-expanded','false'); b.textContent='Menu';
  w.insertBefore(b,n);
  b.addEventListener('click',function(){ var o=n.classList.toggle('open'); b.setAttribute('aria-expanded',o?'true':'false'); });
})();
