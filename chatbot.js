(function(){
var Q=[
["brick","How many bricks do I need?","A standard brick wall needs about 7 bricks per square foot. Enter wall length and height, add 10% waste, and the calculator gives the count."],
["concrete","How much concrete do I need?","Enter length, width and thickness. Volume in cubic yards = length x width x (thickness in inches / 12) / 27. Add 10% waste."],
["paint","How much paint do I need?","Paint covers about 350 square feet per gallon. Enter wall area, and the calculator gives gallons. Two coats need double."],
["waste","How much waste should I add?","Add 10% for straight areas and 15% for areas with many cuts, corners and openings."],
["price","Are the prices accurate?","Prices are editable estimates, not quotes. Your local price can be higher or lower. Get 2 to 3 local quotes before you buy."],
["contact","How do I contact BuildCalc?","Our email is on the Contact page: armanzaheer808@gmail.com. Send the calculator name and your values so we can check the math."],
["use","How do I use a calculator?","Enter your measurements and the result updates instantly. Use Copy result to copy it, Print to print it, and Download to save it as a text file."],
];
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!==undefined)e.innerHTML=h;return e;}
var btn=el("button","chatbtn","BuildCalc Bot");
var panel=el("div","chatpanel"); panel.style.display="none";
panel.appendChild(el("div","chathead","BuildCalc Help <span>FAQ bot, not AI chat. Nothing you type leaves your browser</span>"));
var body=el("div","chatbody"); var quick=el("div","chatquick");
Q.forEach(function(q){var b=el("button",null,q[1]); b.type="button"; b.onclick=function(){ask(q);}; quick.appendChild(b);});
body.appendChild(quick); var log=el("div","chatlog"); body.appendChild(log);
var inp=el("input"); inp.placeholder="Type your question..."; inp.setAttribute("aria-label","Type your question");
var send=el("button",null,"Send"); send.type="button";
function say(who,txt){var d=el("div","chatmsg"); var b=document.createElement("b"); b.textContent=who+": "; d.appendChild(b); d.appendChild(document.createTextNode(txt)); log.appendChild(d); log.scrollTop=log.scrollHeight;}
function ask(q){say("You",q[1]); say("Bot",q[2]+"<br><em>These are estimates, not professional advice.</em>");}
function answerFree(t){
  t=t.toLowerCase();
  for(var i=0;i<Q.length;i++){ if(t.indexOf(Q[i][0])>-1){ ask(Q[i]); return; } }
  if(t.indexOf("hello")>-1){ say("You",inp.value); say("Bot","Hello! Pick a question from the list above."); return; }
  say("You",inp.value); say("Bot","This question is not covered by the FAQ bot. Try typing brick, concrete, paint, waste, price, contact or use, or email us from the Contact page.");
}
send.onclick=function(){ if(!inp.value.trim()) return; answerFree(inp.value); inp.value=""; };
inp.addEventListener("keydown",function(e){ if(e.key==="Enter"){ send.click(); } });
body.appendChild(inp); body.appendChild(send); panel.appendChild(body);
btn.onclick=function(){ panel.style.display = panel.style.display==="none" ? "block" : "none"; };
document.body.appendChild(btn); document.body.appendChild(panel);
say("Bot","Hello! I am BuildCalc's FAQ bot. Pick a question from the list above.");
})();
