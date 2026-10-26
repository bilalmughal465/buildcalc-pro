// BuildCalc AI chatbot backend — Cloudflare Worker.
// DEPLOY (Bilal ke Cloudflare account se):
// 1. Cloudflare dashboard > Workers > Create Worker, is file ka code paste karo.
// 2. Settings > Variables > Add variable: GEMINI_API_KEY = tumhari Gemini key.
//    Key KABHI is file me ya website ke page me mat likhna, warna koi bhi chura kar use kar lega.
// 3. Deploy karo, Worker ka URL milega (jaise https://buildcalc-chatbot.<tumhara>.workers.dev).
// 4. Wo URL chatbot-widget.html wali snippet me daal kar pages me lagao.
// COST: har message par Gemini ka thoda kharcha hota hai (flash-lite sasta hai).
// NOTE: ye widget live pages me ABHI inject nahi kiya gaya, taake toota hua button na dikhe.

const CALCULATORS = [
  ["Concrete Slab", "https://buildcalc-pro.pages.dev/concrete-slab-calculator.html"],
  ["Concrete Footing", "https://buildcalc-pro.pages.dev/concrete-footing-calculator.html"],
  ["Gravel Driveway", "https://buildcalc-pro.pages.dev/gravel-driveway-calculator.html"],
  ["Mulch", "https://buildcalc-pro.pages.dev/mulch-calculator.html"],
  ["Paint", "https://buildcalc-pro.pages.dev/paint-calculator.html"],
  ["Tile", "https://buildcalc-pro.pages.dev/tile-calculator.html"],
  ["Laminate Flooring", "https://buildcalc-pro.pages.dev/flooring-calculator.html"],
  ["Drywall", "https://buildcalc-pro.pages.dev/drywall-calculator.html"],
  ["Roofing", "https://buildcalc-pro.pages.dev/roofing-calculator.html"],
  ["Deck Board", "https://buildcalc-pro.pages.dev/deck-calculator.html"],
  ["Fence", "https://buildcalc-pro.pages.dev/fence-calculator.html"],
  ["Brick", "https://buildcalc-pro.pages.dev/brick-calculator.html"],
  ["Concrete Block", "https://buildcalc-pro.pages.dev/block-calculator.html"],
  ["Sand", "https://buildcalc-pro.pages.dev/sand-calculator.html"],
  ["Topsoil", "https://buildcalc-pro.pages.dev/topsoil-calculator.html"],
  ["Paver", "https://buildcalc-pro.pages.dev/paver-calculator.html"],
  ["Asphalt", "https://buildcalc-pro.pages.dev/asphalt-calculator.html"],
  ["Stair", "https://buildcalc-pro.pages.dev/stair-calculator.html"],
  ["Wallpaper", "https://buildcalc-pro.pages.dev/wallpaper-calculator.html"],
  ["Carpet", "https://buildcalc-pro.pages.dev/carpet-calculator.html"],
  ["Insulation", "https://buildcalc-pro.pages.dev/insulation-calculator.html"],
  ["Siding", "https://buildcalc-pro.pages.dev/siding-calculator.html"],
  ["Gutter", "https://buildcalc-pro.pages.dev/gutter-calculator.html"],
  ["Concrete Pier", "https://buildcalc-pro.pages.dev/pier-calculator.html"],
  ["Mortar", "https://buildcalc-pro.pages.dev/mortar-calculator.html"],
  ["Plywood Sheathing", "https://buildcalc-pro.pages.dev/sheathing-calculator.html"],
  ["Wall Stud", "https://buildcalc-pro.pages.dev/stud-calculator.html"],
  ["Grass Seed", "https://buildcalc-pro.pages.dev/lawn-seed-calculator.html"],
  ["Fence Stain", "https://buildcalc-pro.pages.dev/fence-stain-calculator.html"],
  ["Driveway Sealer", "https://buildcalc-pro.pages.dev/driveway-sealer-calculator.html"],
  ["Firewood", "https://buildcalc-pro.pages.dev/firewood-calculator.html"],
];

const SYSTEM = "You are BuildCalc helper on a free home-improvement calculator website. "
  + "Answer briefly in simple English. If a calculator from this list fits the question, name it and give its exact link. "
  + "Never invent prices, quantities or facts. If unsure, say so and point to the matching calculator. "
  + "Calculators: " + CALCULATORS.map((c) => c[0] + " " + c[1]).join(", ");

export default {
  async fetch(request, env) {
    const headers = {
      "Access-Control-Allow-Origin": "https://buildcalc-pro.pages.dev",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers });
    }
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Bad request" }), { status: 400, headers });
    }
    const message = String(body.message || "").trim().slice(0, 500);
    if (!message) {
      return new Response(JSON.stringify({ error: "Empty message" }), { status: 400, headers });
    }
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=" + env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );
    if (!res.ok) {
      return new Response(JSON.stringify({ reply: "Sorry, the chatbot is not available right now. Please try the calculators above." }), { headers });
    }
    const data = await res.json();
    const reply =
      (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts.map((p) => p.text || "").join("")) || "Sorry, I could not answer that.";
    return new Response(JSON.stringify({ reply }), { headers });
  },
};
