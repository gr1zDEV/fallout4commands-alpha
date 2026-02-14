// script.js

// Keep these local for now (you can JSON-ify them later too)
const items = {
  caps: "0000000f",
  "fusion core": "0001f66c",
  stimpak: "0001f276",
  "rad-x": "000fd11b",
  radaway: "00023742",
  "mini nuke": "00058ab4",
  "nuka cola": "0004835d",
  ".308 ammo": "0001f278",
  "5mm ammo": "0001f66a",
  ".45 ammo": "0001f279",
  "10mm ammo": "0001f276",
  "shotgun shells": "0001f66b",
  adhesive: "001bf72d",
  aluminum: "0006907a",
  copper: "0006907c",
  steel: "000731a3",
  "nuclear material": "00069086",
};

// Perks now loaded from JSON at runtime
let perks = [];

// JSON datasets (arrays like: [{name, id, ...}, ...])
let weapons = {};
let weaponMods = {};
let materials = {};
let ammo = {};
let consumables = {};

const locations = {
  sanctuary: "sanctuaryext",
  "diamond city": "diamondcityext",
  goodneighbor: "goodneighborext",
  "vault 111": "vault111ext",
  "red rocket": "redrocketext",
  "bunker hill": "bunkerhillext",
  "the prydwen": "prydwenext",
  institute: "instituteconcourse",
};

const creatures = {
  deathclaw: "000df55c",
  "super mutant": "00020593",
  radroach: "00023ab5",
  bloatfly: "00023ab9",
  mirelurk: "00024012",
  synth: "00000ac2",
};

const data = [
  { n: "tgm", d: "God mode. Infinite health, AP, ammo, no fall damage.", e: "tgm", c: "player" },
  { n: "tcl", d: "No clip. Walk through walls and fly.", e: "tcl", c: "world" },
  { n: "player.setlevel [level]", d: "Set your level instantly.", e: "player.setlevel 50", c: "player", builder: "level" },
  { n: "player.additem [id] [qty]", d: "Spawn items. Use item IDs from help command.", e: "player.additem 0000000f 5000", c: "items", builder: "item" },
  { n: "killall", d: "Kill everything nearby except essentials.", e: "killall", c: "combat" },
  { n: "kill", d: "Kill whatever you click on.", e: "kill", c: "combat" },
  { n: "resurrect", d: "Bring dead NPCs back. Click them first.", e: "resurrect", c: "npc" },
  { n: "player.setav health [value]", d: "Set max health.", e: "player.setav health 9999", c: "player", builder: "stat" },
  { n: "player.modav carryweight [value]", d: "Add carry weight.", e: "player.modav carryweight 10000", c: "player", builder: "number" },
  { n: "tm", d: "Toggle UI visibility. Good for screenshots.", e: "tm", c: "misc" },
  { n: "tfc", d: "Free camera mode.", e: "tfc", c: "misc" },
  { n: "caqs", d: "Complete ALL quests. Don't use on first playthrough.", e: "caqs", c: "quest" },
  { n: "player.addperk [id]", d: "Add any perk regardless of level/stats.", e: "player.addperk 0004a0a6", c: "player", builder: "perk" },
  { n: "player.removeperk [id]", d: "Remove a perk.", e: "player.removeperk 0004a0a6", c: "player", builder: "perk" },
  { n: "setgs fJumpHeightMin [value]", d: "Change jump height.", e: "setgs fJumpHeightMin 200", c: "player", builder: "number" },
  { n: "sexchange", d: "Swap gender.", e: "sexchange", c: "player" },
  { n: "showlooksmenu player 1", d: "Reopen character creator.", e: "showlooksmenu player 1", c: "player" },
  { n: "unlock", d: "Unlock doors/containers. Click first.", e: "unlock", c: "world" },
  { n: "coc [location]", d: "Teleport anywhere.", e: "coc sanctuaryext", c: "world", builder: "location" },
  { n: "tmm 1", d: "Reveal all map markers.", e: "tmm 1", c: "world" },
  { n: "tdetect", d: "Toggle AI detection. Become invisible.", e: "tdetect", c: "combat" },
  { n: "tai", d: "Freeze all AI.", e: "tai", c: "npc" },
  { n: "tcai", d: "Disable combat AI.", e: "tcai", c: "combat" },
  { n: "setav speedmult [value]", d: "Movement speed multiplier.", e: "setav speedmult 300", c: "player", builder: "number" },
  { n: "player.placeatme [id]", d: "Spawn NPCs/creatures.", e: "player.placeatme 000df55c", c: "world", builder: "creature" },
  { n: "set timescale to [value]", d: "Speed up/slow time. Default 20.", e: "set timescale to 5", c: "world", builder: "number" },
  { n: "fw [id]", d: "Force weather.", e: "fw 10e1ec", c: "world" },
  { n: "csb", d: "Clear blood from screen.", e: "csb", c: "misc" },
  { n: "player.setav ActionPoints [value]", d: "Set max AP.", e: "player.setav ActionPoints 999", c: "player", builder: "number" },
  { n: "player.resethealth", d: "Instant full heal.", e: "player.resethealth", c: "player" },
  { n: "scrapall", d: "Scrap all junk in settlement. Workshop mode only.", e: "scrapall", c: "building" },
  { n: "player.setav strength [value]", d: "Set SPECIAL stats.", e: "player.setav strength 10", c: "player", builder: "special" },
  { n: "getav [attribute]", d: "Check any stat value.", e: "getav health", c: "misc" },
  { n: "removefromallfactions", d: "Leave all factions.", e: "removefromallfactions", c: "npc" },
  { n: "help '[term]' 0", d: "Search for item codes.", e: "help 'nuka cola' 0", c: "misc" },
  { n: "setstage [questid] [stage]", d: "Advance/fix quests.", e: "setstage 00019cfa 10", c: "quest" },
  { n: "completequest [questid]", d: "Complete a quest.", e: "completequest 00019cfa", c: "quest" },
  { n: "resetquest [questid]", d: "Reset a quest.", e: "resetquest 00019cfa", c: "quest" },
  { n: "sqt", d: "Show active quest IDs.", e: "sqt", c: "quest" },
  { n: "movetoqt", d: "Teleport to quest marker.", e: "movetoqt", c: "quest" },
  { n: "player.moveto [refid]", d: "Teleport to NPC.", e: "player.moveto 00002f24", c: "world" },
  { n: "setownership", d: "Make items yours. Click first.", e: "setownership", c: "misc" },
  { n: "bat [filename]", d: "Run batch file of commands.", e: "bat mods", c: "misc" },
  { n: "disable", d: "Remove object from world. Click first.", e: "disable", c: "world" },
  { n: "enable", d: "Re-enable disabled object.", e: "enable", c: "world" },
  { n: "markfordelete", d: "Permanent delete. Can't undo.", e: "markfordelete", c: "world" },
  { n: "setscale [value]", d: "Change size. 1=normal, 2=double.", e: "setscale 0.5", c: "misc", builder: "number" },
  { n: "player.setav Rads [value]", d: "Set radiation level.", e: "player.setav Rads 0", c: "player", builder: "number" },
  { n: "rimod", d: "Toggle damage numbers.", e: "rimod", c: "misc" },
  { n: "tgp", d: "Toggle grass.", e: "tgp", c: "world" },
  { n: "twf", d: "Toggle wireframe mode.", e: "twf", c: "misc" },
];

const cats = {
  all: "All",
  player: "Player",
  items: "Items",
  world: "World",
  combat: "Combat",
  npc: "NPCs",
  quest: "Quests",
  building: "Building",
  misc: "Misc",
};

let active = "all";
let query = "";

const filters = document.getElementById("filters");
const cmds = document.getElementById("cmds");
const empty = document.getElementById("empty");
const search = document.getElementById("search");

Object.entries(cats).forEach(([k, v]) => {
  const btn = document.createElement("button");
  btn.className = "filter" + (k === "all" ? " active" : "");
  btn.textContent = v;
  btn.onclick = () => {
    active = k;
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  };
  filters.appendChild(btn);
});

search.oninput = (e) => {
  query = e.target.value.toLowerCase();
  render();
};

// ---------- JSON LOADING ----------
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

function perksToOptions(perksData) {
  if (Array.isArray(perksData)) {
    return perksData
      .slice()
      .sort((a, b) => (a.name || "").localeCompare(b.name || "") || (a.rank || 0) - (b.rank || 0))
      .map((p) => `<option value="${p.id}">${p.name}${p.rank ? ` (Rank ${p.rank})` : ""}</option>`)
      .join("");
  }

  if (perksData && typeof perksData === "object") {
    return Object.entries(perksData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, id]) => `<option value="${id}">${name}</option>`)
      .join("");
  }

  return "";
}

// array like: [{name, id, ...}, ...]
function arrayToMapByNameId(arr) {
  const out = {};
  if (!Array.isArray(arr)) return out;
  for (const row of arr) {
    if (row && row.name && row.id) out[row.name] = row.id;
  }
  return out;
}

function optionsFromMap(mapObj) {
  return Object.entries(mapObj)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, id]) => `<option value="${id}">${name}</option>`)
    .join("");
}
// ---------- /JSON LOADING ----------

function createBuilder(cmd, idx) {
  if (!cmd.builder) return "";

  if (cmd.builder === "item") {
    return `
      <div class="builder">
        <div class="builder-label">Command Builder:</div>
        <div class="builder-inputs">
          <select class="builder-select" id="item-${idx}">
            <option value="">Select item...</option>

            <optgroup label="Items">
              ${optionsFromMap(items)}
            </optgroup>

            <optgroup label="Weapons">
              ${optionsFromMap(weapons)}
            </optgroup>

            <optgroup label="Weapon Mods">
              ${optionsFromMap(weaponMods)}
            </optgroup>

            <optgroup label="Materials">
              ${optionsFromMap(materials)}
            </optgroup>

            <optgroup label="Ammo">
              ${optionsFromMap(ammo)}
            </optgroup>

            <optgroup label="Consumables">
              ${optionsFromMap(consumables)}
            </optgroup>
          </select>

          <input type="number" class="builder-input" id="qty-${idx}" placeholder="Quantity" value="100" style="width: 120px;">
        </div>
        <div class="builder-output" id="output-${idx}">
          player.additem [id] [qty]
          <button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>
        </div>
      </div>
    `;
  }

  if (cmd.builder === "perk") {
    return `
      <div class="builder">
        <div class="builder-label">Command Builder:</div>
        <select class="builder-select" id="perk-${idx}" style="width: 100%;">
          <option value="">Select perk...</option>
          ${perksToOptions(perks)}
        </select>
        <div class="builder-output" id="output-${idx}">
          player.addperk [id]
          <button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>
        </div>
      </div>
    `;
  }

  if (cmd.builder === "location") {
    return `
      <div class="builder">
        <div class="builder-label">Command Builder:</div>
        <select class="builder-select" id="loc-${idx}" style="width: 100%;">
          <option value="">Select location...</option>
          ${Object.entries(locations)
            .map(([name, code]) => `<option value="${code}">${name}</option>`)
            .join("")}
        </select>
        <div class="builder-output" id="output-${idx}">
          coc [location]
          <button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>
        </div>
      </div>
    `;
  }

  if (cmd.builder === "creature") {
    return `
      <div class="builder">
        <div class="builder-label">Command Builder:</div>
        <select class="builder-select" id="creature-${idx}" style="width: 100%;">
          <option value="">Select creature...</option>
          ${Object.entries(creatures)
            .map(([name, id]) => `<option value="${id}">${name}</option>`)
            .join("")}
        </select>
        <div class="builder-output" id="output-${idx}">
          player.placeatme [id]
          <button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>
        </div>
      </div>
    `;
  }

  if (cmd.builder === "level") {
    return `
      <div class="builder">
        <div class="builder-label">Command Builder:</div>
        <input type="number" class="builder-input" id="level-${idx}" placeholder="Level" value="50" style="width: 150px;">
        <div class="builder-output" id="output-${idx}">
          player.setlevel [level]
          <button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>
        </div>
      </div>
    `;
  }

  if (cmd.builder === "special") {
    return `
      <div class="builder">
        <div class="builder-label">Command Builder:</div>
        <div class="builder-inputs">
          <select class="builder-select" id="special-${idx}">
            <option value="strength">Strength</option>
            <option value="perception">Perception</option>
            <option value="endurance">Endurance</option>
            <option value="charisma">Charisma</option>
            <option value="intelligence">Intelligence</option>
            <option value="agility">Agility</option>
            <option value="luck">Luck</option>
          </select>
          <input type="number" class="builder-input" id="val-${idx}" placeholder="Value" value="10" style="width: 100px;">
        </div>
        <div class="builder-output" id="output-${idx}">
          player.setav strength [value]
          <button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>
        </div>
      </div>
    `;
  }

  if (cmd.builder === "stat") {
    return `
      <div class="builder">
        <div class="builder-label">Command Builder:</div>
        <input type="number" class="builder-input" id="stat-${idx}" placeholder="Value" value="9999" style="width: 150px;">
        <div class="builder-output" id="output-${idx}">
          player.setav health [value]
          <button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>
        </div>
      </div>
    `;
  }

  if (cmd.builder === "number") {
    const defaultVal = cmd.n.includes("speed") ? "300" : cmd.n.includes("jump") ? "200" : "100";
    return `
      <div class="builder">
        <div class="builder-label">Command Builder:</div>
        <input type="number" class="builder-input" id="num-${idx}" placeholder="Value" value="${defaultVal}" style="width: 150px;">
        <div class="builder-output" id="output-${idx}">
          ${cmd.e}
          <button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>
        </div>
      </div>
    `;
  }

  return "";
}

function attachBuilderListeners(cmd, idx) {
  if (!cmd.builder) return;

  const output = document.getElementById(`output-${idx}`);

  if (cmd.builder === "item") {
    const itemSelect = document.getElementById(`item-${idx}`);
    const qtyInput = document.getElementById(`qty-${idx}`);

    const update = () => {
      const id = itemSelect.value;
      const qty = qtyInput.value || "100";
      if (id) {
        const text = `player.additem ${id} ${qty}`;
        output.innerHTML = `${text}<button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>`;
      }
    };

    itemSelect.onchange = update;
    qtyInput.oninput = update;
  }

  if (cmd.builder === "perk") {
    const perkSelect = document.getElementById(`perk-${idx}`);
    perkSelect.onchange = () => {
      const id = perkSelect.value;
      if (id) {
        const text = `player.addperk ${id}`;
        output.innerHTML = `${text}<button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>`;
      }
    };
  }

  if (cmd.builder === "location") {
    const locSelect = document.getElementById(`loc-${idx}`);
    locSelect.onchange = () => {
      const code = locSelect.value;
      if (code) {
        const text = `coc ${code}`;
        output.innerHTML = `${text}<button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>`;
      }
    };
  }

  if (cmd.builder === "creature") {
    const creatureSelect = document.getElementById(`creature-${idx}`);
    creatureSelect.onchange = () => {
      const id = creatureSelect.value;
      if (id) {
        const text = `player.placeatme ${id}`;
        output.innerHTML = `${text}<button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>`;
      }
    };
  }

  if (cmd.builder === "level") {
    const levelInput = document.getElementById(`level-${idx}`);
    levelInput.oninput = () => {
      const val = levelInput.value || "50";
      const text = `player.setlevel ${val}`;
      output.innerHTML = `${text}<button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>`;
    };
  }

  if (cmd.builder === "special") {
    const specialSelect = document.getElementById(`special-${idx}`);
    const valInput = document.getElementById(`val-${idx}`);

    const update = () => {
      const stat = specialSelect.value;
      const val = valInput.value || "10";
      const text = `player.setav ${stat} ${val}`;
      output.innerHTML = `${text}<button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>`;
    };

    specialSelect.onchange = update;
    valInput.oninput = update;
  }

  if (cmd.builder === "stat") {
    const statInput = document.getElementById(`stat-${idx}`);
    statInput.oninput = () => {
      const val = statInput.value || "9999";
      const text = `player.setav health ${val}`;
      output.innerHTML = `${text}<button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>`;
    };
  }

  if (cmd.builder === "number") {
    const numInput = document.getElementById(`num-${idx}`);
    numInput.oninput = () => {
      const val = numInput.value;
      if (val) {
        const base = cmd.e.split(" ");
        base[base.length - 1] = val;
        const text = base.join(" ");
        output.innerHTML = `${text}<button class="copy-btn" onclick="copyBuilderOutput(${idx}, this)">Copy</button>`;
      }
    };
  }
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 2000);
  });
}

function copyBuilderOutput(idx, btn) {
  const output = document.getElementById(`output-${idx}`);
  const text = output.childNodes[0].textContent.trim();
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 2000);
  });
}

function render() {
  const filtered = data.filter((cmd) => {
    const cat = active === "all" || cmd.c === active;
    const q = !query || cmd.n.toLowerCase().includes(query) || cmd.d.toLowerCase().includes(query);
    return cat && q;
  });

  if (!filtered.length) {
    cmds.style.display = "none";
    empty.style.display = "block";
    return;
  }

  cmds.style.display = "grid";
  empty.style.display = "none";

  cmds.innerHTML = filtered
    .map(
      (cmd, idx) => `
      <div class="cmd">
        <div class="cmd-top">
          <code class="cmd-name">${cmd.n}</code>
          <span class="tag">${cmd.c}</span>
        </div>
        <div class="cmd-desc">${cmd.d}</div>
        <div class="example">
          ${cmd.e}
          <button class="copy-btn" onclick="copyToClipboard('${cmd.e}', this)">Copy</button>
        </div>
        ${createBuilder(cmd, idx)}
      </div>
    `
    )
    .join("");

  filtered.forEach((cmd, idx) => attachBuilderListeners(cmd, idx));
}

// Load perks.json + weapons.json + weapon-mods.json + materials.json + ammo.json + consumables.json THEN render
async function init() {
  try {
    cmds.innerHTML = `<div class="empty">Loading...</div>`;

    const [perksData, weaponsData, weaponModsData, materialsData, ammoData, consumablesData] = await Promise.all([
      loadJSON("./data/perks.json"),
      loadJSON("./data/weapons.json"),
      loadJSON("./data/weapon-mods.json"),
      loadJSON("./data/materials.json"),
      loadJSON("./data/ammo.json"),
      loadJSON("./data/consumables.json"),
    ]);

    perks = perksData;
    weapons = arrayToMapByNameId(weaponsData);
    weaponMods = arrayToMapByNameId(weaponModsData);
    materials = arrayToMapByNameId(materialsData);
    ammo = arrayToMapByNameId(ammoData);
    consumables = arrayToMapByNameId(consumablesData);
  } catch (err) {
    console.error(err);
    cmds.innerHTML = `<div class="empty">Failed to load JSON (check console)</div>`;
  }

  render();
}

init();
