(function(){
var Q=[
["brick","How many bricks do I need?","A standard brick wall needs about 7 bricks per square foot. Enter wall length and height, add 10% waste, and the calculator gives the count."],
["concrete","How much concrete do I need?","Enter length, width and thickness. Volume in cubic yards = length x width x (thickness in inches / 12) / 27. Add 10% waste."],
["paint","How much paint do I need?","Paint covers about 350 square feet per gallon. Enter wall area, and the calculator gives gallons. Two coats need double."],
["waste","How much waste should I add?","Add 10% for straight areas and 15% for areas with many cuts, corners and openings."],
["price","Are the prices accurate?","Prices are editable estimates, not quotes. Your local price can be higher or lower. Get 2 to 3 local quotes before you buy."],
["contact","How do I contact BuildCalc?","Contact page par email hai: armanzaheer808@gmail.com. Calculator ka naam aur values likh kar bhejo, taake math check ho sake."],
["use","How do I use a calculator?","Apni measurements daalo, result foran update hota hai. Copy result se result copy karo, Print se print karo, Download se result text file me save karo."],
];
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!==undefined)e.innerHTML=h;return e;}
var btn=el("button","chatbtn","Ask BuildCalc");
var panel=el("div","chatpanel"); panel.style.display="none";
panel.appendChild(el("div","chathead","BuildCalc Help <span>FAQ bot — AI chat nahi, koi data bahar nahi jata</span>"));
var body=el("div","chatbody"); var quick=el("div","chatquick");
Q.forEach(function(q){var b=el("button",null,q[1]); b.type="button"; b.onclick=function(){ask(q);}; quick.appendChild(b);});
body.appendChild(quick); var log=el("div","chatlog"); body.appendChild(log);
var inp=el("input"); inp.placeholder="Apna sawal likho..."; inp.setAttribute("aria-label","Apna sawal likho");
var send=el("button",null,"Bhejo"); send.type="button";
function say(who,txt){var d=el("div","chatmsg"); d.innerHTML="<b>"+who+":</b> "+txt; log.appendChild(d); log.scrollTop=log.scrollHeight;}
function ask(q){say("Tum",q[1]); say("Bot",q[2]+"<br><em>Ye estimates hain, personal advice nahi hai.</em>");}
function answerFree(t){
  t=t.toLowerCase();
  for(var i=0;i<Q.length;i++){ if(t.indexOf(Q[i][0])>-1){ ask(Q[i]); return; } }
  if(t.indexOf("hello")>-1||t.indexOf("salam")>-1){ say("Tum",inp.value); say("Bot","Assalam-o-Alaikum! Upar se ek sawal chuno."); return; }
  say("Tum",inp.value); say("Bot","Is sawal ka jawab is FAQ bot me nahi hai. Brick, concrete, paint, waste, price, contact ya use likh kar try karo, ya Contact page par mail karo.");
}
send.onclick=function(){ if(!inp.value.trim()) return; answerFree(inp.value); inp.value=""; };
inp.addEventListener("keydown",function(e){ if(e.key==="Enter"){ send.click(); } });
body.appendChild(inp); body.appendChild(send); panel.appendChild(body);
btn.onclick=function(){ panel.style.display = panel.style.display==="none" ? "block" : "none"; };
document.body.appendChild(btn); document.body.appendChild(panel);
say("Bot","Assalam-o-Alaikum! Main BuildCalc ka FAQ bot hun. Upar se ek sawal chuno.");
})();
