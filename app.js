// ============================================================
// FIFA WC 2026 BRACKET APP — MAIN LOGIC
// ============================================================

let state = {
  playerName: '',
  currentGroup: 0,
  groupPredictions: {}, 
  selectedThirds:[],   
  knockoutResults: {},  
  currentKOStage: 'r32',
};

// ── SCREEN MANAGEMENT ──────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    el.classList.add('screen-enter');
    setTimeout(() => el.classList.remove('screen-enter'), 600);
  }
}

// ── WELCOME ────────────────────────────────────────────────
function startBracket() {
  const nameInput = document.getElementById('playerName');
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.classList.add('shake');
    nameInput.placeholder = 'Please enter your name!';
    setTimeout(() => { nameInput.classList.remove('shake'); nameInput.placeholder = 'Enter your name...'; }, 800);
    return;
  }
  state.playerName = name;
  document.getElementById('headerPlayerName').textContent = name;
  document.getElementById('thirdsPlayerName').textContent = name;
  document.getElementById('knockoutPlayerName').textContent = name;
  document.getElementById('champPlayerLabel').textContent = `${name}'s Prediction`;
  state.currentGroup = 0;
  buildGroupTabs();
  renderCurrentGroup();
  showScreen('screen-groups');
}

// ── GROUP TABS & NAVIGATION ────────────────────────────────
function buildGroupTabs() {
  const tabs = document.getElementById('groupTabs');
  tabs.innerHTML = GROUP_NAMES.map((g, i) => `
    <button class="group-tab ${i === 0 ? 'active' : ''} ${state.groupPredictions[g] ? 'done' : ''}"
      id="gtab-${g}" onclick="jumpToGroup(${i})">${g}</button>
  `).join('');
}

function updateGroupTabs() {
  GROUP_NAMES.forEach((g, i) => {
    const tab = document.getElementById(`gtab-${g}`);
    if (!tab) return;
    tab.classList.toggle('active', i === state.currentGroup);
    tab.classList.toggle('done', !!state.groupPredictions[g]);
  });
}

function jumpToGroup(i) {
  state.currentGroup = i;
  renderCurrentGroup();
  updateGroupTabs();
}

// ── GROUP RENDERING ────────────────────────────────────────
function renderCurrentGroup() {
  const groupKey = GROUP_NAMES[state.currentGroup];
  const group = GROUPS[groupKey];
  const pred = state.groupPredictions[groupKey] || null;

  document.getElementById('groupCounter').textContent = `Group ${groupKey} of 12`;
  document.getElementById('groupProgressBar').style.width =
    `${Math.round((Object.keys(state.groupPredictions).length / 12) * 100)}%`;

  const nextBtn = document.getElementById('nextGroupBtn');
  if (state.currentGroup === 11) {
    const allDone = GROUP_NAMES.every(g => state.groupPredictions[g]);
    nextBtn.textContent = allDone ? 'SELECT BEST 3RDS →' : 'COMPLETE ALL GROUPS FIRST';
    nextBtn.disabled = !allDone;
  } else {
    nextBtn.textContent = 'NEXT GROUP →';
    nextBtn.disabled = false;
  }

  const content = document.getElementById('groupContent');
  content.innerHTML = `
    <div class="group-panel">
      <div class="group-header-row">
        <div class="group-title-badge">GROUP ${groupKey}</div>
        <div class="group-instruction">Drag or click to rank all 4 teams (1st → 4th)</div>
      </div>
      <div class="ranking-area">
        <div class="rank-labels">
          <div class="rank-label rank-1st">🥇 1ST</div>
          <div class="rank-label rank-2nd">🥈 2ND</div>
          <div class="rank-label rank-3rd">🥉 3RD</div>
          <div class="rank-label rank-4th">💀 4TH</div>
        </div>
        <div class="ranked-slots" id="rankedSlots"></div>
      </div>
      <div class="unranked-pool-label">TEAMS — click to assign position</div>
      <div class="unranked-pool" id="unrankedPool"></div>
    </div>
  `;

  const ranked = pred ? [...pred] : [null, null, null, null];
  const unranked = group.teams.filter(t => !ranked.find(r => r && r.name === t.name));

  renderRankedSlots(ranked, unranked, group.teams);
  renderUnrankedPool(unranked, ranked);
}

function renderRankedSlots(ranked, unranked, allTeams) {
  const container = document.getElementById('rankedSlots');
  const labels =['1st', '2nd', '3rd', '4th'];
  container.innerHTML = ranked.map((team, i) => `
    <div class="ranked-slot ${team ? 'filled' : 'empty'} slot-${labels[i]}"
         data-slot="${i}" onclick="clickSlot(${i})">
      ${team ? `
        <span class="team-flag">${team.flag}</span>
        <span class="team-name-sm">${team.name}</span>
        <button class="remove-btn" onclick="removeFromSlot(event,${i})">✕</button>
      ` : `<span class="slot-placeholder">#${i+1}</span>`}
    </div>
  `).join('');
}

function renderUnrankedPool(unranked, ranked) {
  const container = document.getElementById('unrankedPool');
  const groupKey = GROUP_NAMES[state.currentGroup];
  const allTeams = GROUPS[groupKey].teams;
  container.innerHTML = allTeams.map(team => {
    const isRanked = ranked.find(r => r && r.name === team.name);
    const rankIdx = ranked.findIndex(r => r && r.name === team.name);
    return `
      <div class="team-card ${isRanked ? 'ranked' : ''}" onclick="clickTeamCard('${team.name}')">
        <span class="team-flag-big">${team.flag}</span>
        <span class="team-name">${team.name}</span>
        ${isRanked ? `<span class="rank-badge">#${rankIdx+1}</span>` : ''}
      </div>
    `;
  }).join('');
}

let pendingSlot = null;

function clickSlot(slotIdx) {
  const groupKey = GROUP_NAMES[state.currentGroup];
  const pred = state.groupPredictions[groupKey] ? [...state.groupPredictions[groupKey]] : [null,null,null,null];
  if (pred[slotIdx]) return; 
  pendingSlot = slotIdx;
  document.querySelectorAll('.ranked-slot').forEach((el, i) => {
    el.classList.toggle('awaiting', i === slotIdx);
  });
}

function clickTeamCard(teamName) {
  const groupKey = GROUP_NAMES[state.currentGroup];
  const group = GROUPS[groupKey];
  const team = group.teams.find(t => t.name === teamName);
  const pred = state.groupPredictions[groupKey] ? [...state.groupPredictions[groupKey]] : [null,null,null,null];

  const existingIdx = pred.findIndex(r => r && r.name === teamName);
  if (existingIdx !== -1) pred[existingIdx] = null;

  if (pendingSlot !== null) {
    pred[pendingSlot] = team;
    pendingSlot = null;
  } else {
    const emptyIdx = pred.findIndex(r => !r);
    if (emptyIdx !== -1) pred[emptyIdx] = team;
  }

  state.groupPredictions[groupKey] = pred;

  const unranked = group.teams.filter(t => !pred.find(r => r && r.name === t.name));
  renderRankedSlots(pred, unranked, group.teams);
  renderUnrankedPool(unranked, pred);
  updateGroupTabs();
  updateNextBtn();
}

function removeFromSlot(e, slotIdx) {
  e.stopPropagation();
  const groupKey = GROUP_NAMES[state.currentGroup];
  const group = GROUPS[groupKey];
  const pred = state.groupPredictions[groupKey] ?[...state.groupPredictions[groupKey]] : [null,null,null,null];
  pred[slotIdx] = null;
  state.groupPredictions[groupKey] = pred;
  const unranked = group.teams.filter(t => !pred.find(r => r && r.name === t.name));
  renderRankedSlots(pred, unranked, group.teams);
  renderUnrankedPool(unranked, pred);
  updateGroupTabs();
  updateNextBtn();
}

function updateNextBtn() {
  const nextBtn = document.getElementById('nextGroupBtn');
  if (state.currentGroup === 11) {
    const allDone = GROUP_NAMES.every(g => state.groupPredictions[g] && state.groupPredictions[g].every(Boolean));
    nextBtn.textContent = allDone ? 'SELECT BEST 3RDS →' : 'COMPLETE ALL GROUPS FIRST';
    nextBtn.disabled = !allDone;
  }
}

function prevGroup() {
  if (state.currentGroup > 0) {
    state.currentGroup--;
    renderCurrentGroup();
    updateGroupTabs();
  }
}

function nextGroupOrAdvance() {
  const groupKey = GROUP_NAMES[state.currentGroup];
  const pred = state.groupPredictions[groupKey];
  if (!pred || !pred.every(Boolean)) {
    alert(`Please rank all 4 teams in Group ${groupKey} before continuing.`);
    return;
  }
  if (state.currentGroup < 11) {
    state.currentGroup++;
    renderCurrentGroup();
    updateGroupTabs();
  } else {
    const allDone = GROUP_NAMES.every(g => state.groupPredictions[g] && state.groupPredictions[g].every(Boolean));
    if (!allDone) {
      alert('Please complete all 12 groups before proceeding.');
      return;
    }
    buildThirdsScreen();
    showScreen('screen-thirds');
  }
}

// ── THIRD PLACE SELECTION ───────────────────────────────────
function buildThirdsScreen() {
  const grid = document.getElementById('thirdsGrid');
  grid.innerHTML = GROUP_NAMES.map(g => {
    const team = state.groupPredictions[g][2]; 
    const isSelected = state.selectedThirds.includes(g);
    return `
      <div class="third-card ${isSelected ? 'selected' : ''}" id="tc-${g}" onclick="toggleThird('${g}')">
        <div class="third-card-group">GROUP ${g}</div>
        <div class="third-card-flag">${team.flag}</div>
        <div class="third-card-name">${team.name}</div>
        ${isSelected ? '<div class="third-card-check">✓ ADVANCES</div>' : ''}
      </div>
    `;
  }).join('');
  updateThirdsCount();
}

function toggleThird(groupKey) {
  const idx = state.selectedThirds.indexOf(groupKey);
  if (idx !== -1) {
    state.selectedThirds.splice(idx, 1);
  } else {
    if (state.selectedThirds.length >= 8) {
      document.getElementById('thirdsSelected').parentElement.classList.add('shake');
      setTimeout(() => document.getElementById('thirdsSelected').parentElement.classList.remove('shake'), 500);
      return;
    }
    state.selectedThirds.push(groupKey);
  }
  buildThirdsScreen(); // Re-render to reflect checks
}

function updateThirdsCount() {
  document.getElementById('thirdsSelected').textContent = state.selectedThirds.length;
  document.getElementById('thirdsAdvanceBtn').disabled = state.selectedThirds.length !== 8;
}

// ── KNOCKOUT STAGE PREPARATION ──────────────────────────────
function advanceToKnockout() {
  if (state.selectedThirds.length !== 8) return;
  buildKnockoutMatches();
  showScreen('screen-knockout');
  showKOStage('r32');
}

function getTeamFromPosition(group, pos) {
  if (!group) return null;
  const pred = state.groupPredictions[group];
  if (!pred) return null;
  const posMap = { '1st': 0, '2nd': 1, '3rd': 2, '4th': 3 };
  return pred[posMap[pos]] || null;
}

/**
 * BEST PRACTICE ALGORITHM: Bipartite Matching via Backtracking.
 * FIFA uses a matrix of 495 combinations to slot 3rd-place teams.
 * This dynamically assigns the 8 chosen teams to their 8 R32 allowed pools, 
 * guaranteeing zero duplicates or dead-ends.
 */
function solveThirdPlaceMapping(selectedThirds, pools) {
  let result = new Array(8).fill(null);
  let used = new Array(8).fill(false);
  
  function backtrack(matchIndex) {
    if (matchIndex === 8) return true; // Found perfect distribution
    
    for (let i = 0; i < 8; i++) {
      // If team is untouched and is part of the pool designated for this specific match
      if (!used[i] && pools[matchIndex].includes(selectedThirds[i])) {
        used[i] = true;
        result[matchIndex] = selectedThirds[i];
        if (backtrack(matchIndex + 1)) return true;
        
        // If the path failed, reset and try next configuration (backtracking)
        used[i] = false; 
        result[matchIndex] = null;
      }
    }
    return false;
  }
  
  if (backtrack(0)) return result;
  return null;
}

function resolveR32Matches() {
  // Extract all 8 matchups that need a 3rd place team
  const thirdMatchesInfo = R32_FIXED.filter(m => m.teamB.pos === '3rd' || m.teamA.pos === '3rd');
  const pools = thirdMatchesInfo.map(m => (m.teamA.pos === '3rd' ? m.teamA.pool : m.teamB.pool).split('/'));
  
  // Get perfect distribution of group letters
  let assignment = solveThirdPlaceMapping(state.selectedThirds, pools) || state.selectedThirds;
  let tIdx = 0;

  return R32_FIXED.map(m => {
    let teamA = m.teamA.pos === '3rd'
      ? getTeamFromPosition(assignment[tIdx++], '3rd')
      : getTeamFromPosition(m.teamA.group, m.teamA.pos);

    let teamB = m.teamB.pos === '3rd'
      ? getTeamFromPosition(assignment[tIdx++], '3rd')
      : getTeamFromPosition(m.teamB.group, m.teamB.pos);

    return { ...m, teamA, teamB };
  });
}

let r32Matches = [];
let r16Matches = [];
let qfMatches  =[];
let sfMatches  =[];
let finalMatch = null;
let thirdMatch = null;

function buildKnockoutMatches() {
  r32Matches = resolveR32Matches();
  
  r16Matches = Array.from({length: 8}, (_,i) => ({
    id: `r16_${i}`, teamA: null, teamB: null,
    label: `Round of 16 Match ${i+1}`,
    srcA: R16_PAIRS[i][0], srcB: R16_PAIRS[i][1]
  }));
  qfMatches = Array.from({length: 4}, (_,i) => ({
    id: `qf_${i}`, teamA: null, teamB: null,
    label: `Quarter-Final ${i+1}`,
    srcA: QF_PAIRS[i][0], srcB: QF_PAIRS[i][1]
  }));
  sfMatches = Array.from({length: 2}, (_,i) => ({
    id: `sf_${i}`, teamA: null, teamB: null,
    label: `Semi-Final ${i+1}`,
    srcA: SF_PAIRS[i][0], srcB: SF_PAIRS[i][1]
  }));
  
  finalMatch = { id: 'final', teamA: null, teamB: null, label: 'THE FINAL' };
  thirdMatch = { id: 'third', teamA: null, teamB: null, label: '3rd Place Match' };
  
  propagateWinners();
}

function propagateWinners() {
  const resolveLayer = (matches, sources) => matches.forEach(m => {
    const srcA = sources.find(r => r.id === m.srcA);
    const srcB = sources.find(r => r.id === m.srcB);
    m.teamA = srcA ? (state.knockoutResults[srcA.id] || null) : null;
    m.teamB = srcB ? (state.knockoutResults[srcB.id] || null) : null;
  });

  resolveLayer(r16Matches, r32Matches);
  resolveLayer(qfMatches, r16Matches);
  resolveLayer(sfMatches, qfMatches);

  finalMatch.teamA = state.knockoutResults['sf_0'] || null;
  finalMatch.teamB = state.knockoutResults['sf_1'] || null;
  
  // 3rd place match: losers of SF
  thirdMatch.teamA = sfMatches[0] && state.knockoutResults['sf_0'] 
    ? (state.knockoutResults['sf_0'].name === sfMatches[0].teamA.name ? sfMatches[0].teamB : sfMatches[0].teamA) : null;
  thirdMatch.teamB = sfMatches[1] && state.knockoutResults['sf_1'] 
    ? (state.knockoutResults['sf_1'].name === sfMatches[1].teamA.name ? sfMatches[1].teamB : sfMatches[1].teamA) : null;
}

// ── KNOCKOUT STAGE NAVIGATION & PICKS ───────────────────────
function showKOStage(stage) {
  state.currentKOStage = stage;
  propagateWinners();
  
  document.querySelectorAll('.ko-nav-btn').forEach(btn => btn.classList.remove('active'));
  const stageMap = { r32:'R32', r16:'R16', qf:'QF', sf:'SF', final:'F' };
  document.getElementById(`koNav${stageMap[stage] || stage.toUpperCase()}`).classList.add('active');

  document.getElementById('knockoutStageName').textContent = {
    r32: 'ROUND OF 32', r16: 'ROUND OF 16', qf: 'QUARTER-FINALS', sf: 'SEMI-FINALS', final: 'FINAL'
  }[stage];

  const doneCount = Object.keys(state.knockoutResults).length;
  document.getElementById('knockoutProgressBar').style.width = `${Math.round((doneCount/31)*100)}%`;

  let matches = {
    r32: r32Matches, r16: r16Matches, qf: qfMatches, sf: sfMatches, final:[finalMatch, thirdMatch]
  }[stage];

  document.getElementById('knockoutContent').innerHTML = `
    <div class="matches-grid ${stage === 'final' ? 'final-grid' : ''}">
      ${matches.map(m => renderMatchCard(m, stage)).join('')}
    </div>
  `;
}

function renderMatchCard(m) {
  const winner = state.knockoutResults[m.id];
  return `
    <div class="match-card ${m.id === 'final' ? 'match-final' : ''} ${m.id === 'third' ? 'match-third' : ''}">
      <div class="match-label">${m.label}</div>
      ${m.teamA ? `
        <button class="team-pick-btn ${winner && winner.name === m.teamA.name ? 'winner' : ''}"
          onclick="pickWinner('${m.id}', 'A')" ${!m.teamB ? 'disabled' : ''}>
          <span class="pick-flag">${m.teamA.flag}</span>
          <span class="pick-name">${m.teamA.name}</span>
          ${winner && winner.name === m.teamA.name ? '<span class="winner-badge">✓</span>' : ''}
        </button>
      ` : `<div class="team-pick-btn tbd">TBD</div>`}
      <div class="vs-divider">VS</div>
      ${m.teamB ? `
        <button class="team-pick-btn ${winner && winner.name === m.teamB.name ? 'winner' : ''}"
          onclick="pickWinner('${m.id}', 'B')" ${!m.teamA ? 'disabled' : ''}>
          <span class="pick-flag">${m.teamB.flag}</span>
          <span class="pick-name">${m.teamB.name}</span>
          ${winner && winner.name === m.teamB.name ? '<span class="winner-badge">✓</span>' : ''}
        </button>
      ` : `<div class="team-pick-btn tbd">TBD</div>`}
    </div>
  `;
}

function pickWinner(matchId, side) {
  propagateWinners();
  const all =[...r32Matches, ...r16Matches, ...qfMatches, ...sfMatches, finalMatch, thirdMatch];
  const match = all.find(m => m.id === matchId);
  const team = side === 'A' ? match.teamA : match.teamB;
  
  if (!team) return;

  state.knockoutResults[matchId] = team;
  clearDownstreamResults(matchId);

  if (matchId === 'final') {
    setTimeout(() => {
      document.getElementById('championFlag').textContent = team.flag;
      document.getElementById('championName').textContent = team.name;
      showScreen('screen-champion');
      spawnConfetti();
    }, 400);
    return;
  }

  propagateWinners();
  showKOStage(state.currentKOStage);

  // Auto-advance
  const stageMatches = { r32: r32Matches, r16: r16Matches, qf: qfMatches, sf: sfMatches }[state.currentKOStage];
  if (stageMatches && stageMatches.every(m => state.knockoutResults[m.id])) {
    const nextStage = { r32: 'r16', r16: 'qf', qf: 'sf', sf: 'final' }[state.currentKOStage];
    if (nextStage) setTimeout(() => showKOStage(nextStage), 500);
  }
}

function clearDownstreamResults(matchId) {
  const mapPairings = (pairs) => pairs.reduce((acc, [a, b], i) => ({ ...acc, [a]: i, [b]: i }), {});
  const r32ToR16 = mapPairings(R16_PAIRS);
  const r16ToQF = mapPairings(QF_PAIRS);
  const qfToSF = mapPairings(SF_PAIRS);

  if (matchId.startsWith('m')) {
    const r16Idx = r32ToR16[matchId];
    if (r16Idx !== undefined) {
      delete state.knockoutResults[`r16_${r16Idx}`];
      clearDownstreamResults(`r16_${r16Idx}`);
    }
  } else if (matchId.startsWith('r16_')) {
    const qfIdx = r16ToQF[matchId];
    if (qfIdx !== undefined) {
      delete state.knockoutResults[`qf_${qfIdx}`];
      clearDownstreamResults(`qf_${qfIdx}`);
    }
  } else if (matchId.startsWith('qf_')) {
    const sfIdx = qfToSF[matchId];
    if (sfIdx !== undefined) {
      delete state.knockoutResults[`sf_${sfIdx}`];
      clearDownstreamResults(`sf_${sfIdx}`);
    }
  } else if (matchId.startsWith('sf_')) {
    delete state.knockoutResults['final'];
    delete state.knockoutResults['third']; // Ensure 3rd place match cleans up too!
  }
}

// ── IMAGE EXPORT ────────────────────────────────────────────
function exportGroupStage() {
  const el = document.getElementById('exportGroupStageEl');
  el.style.display = 'block';
  el.innerHTML = buildGroupStageExportHTML();
  setTimeout(() => {
    html2canvas(el, { scale: 2, backgroundColor: '#0a0e1a', useCORS: true }).then(canvas => {
      downloadCanvas(canvas, `WC2026_GroupStage_${state.playerName.replace(/\s/g,'_')}.png`);
      el.style.display = 'none';
    });
  }, 200);
}

function exportKnockout() {
  const el = document.getElementById('exportKnockoutEl');
  el.style.display = 'block';
  el.innerHTML = buildKnockoutExportHTML();
  setTimeout(() => {
    html2canvas(el, { scale: 2, backgroundColor: '#0a0e1a', useCORS: true }).then(canvas => {
      downloadCanvas(canvas, `WC2026_Knockout_${state.playerName.replace(/\s/g,'_')}.png`);
      el.style.display = 'none';
    });
  }, 200);
}

function downloadCanvas(canvas, filename) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = canvas.toDataURL('image/png');
  a.click();
}

function buildGroupStageExportHTML() {
  const groupsHTML = GROUP_NAMES.map(g => {
    const pred = state.groupPredictions[g] ||[];
    return `
      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#FFD700;letter-spacing:2px;margin-bottom:10px;">GROUP ${g}</div>
        ${pred.map((t, i) => t ? `
          <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="font-size:16px;">${['🥇','🥈','🥉','💀'][i]}</span>
            <span style="font-size:20px;">${t.flag}</span>
            <span style="font-family:'Barlow Condensed',sans-serif;font-size:14px;color:#fff;font-weight:600;">${t.name}</span>
          </div>
        ` : '').join('')}
      </div>
    `;
  }).join('');
  return `
    <div style="width:1200px;padding:40px;background:#0a0e1a;font-family:'Barlow Condensed',sans-serif;color:#fff;">
      <div style="text-align:center;margin-bottom:30px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;color:#FFD700;letter-spacing:4px;">FIFA WORLD CUP 2026</div>
        <div style="font-size:20px;color:#aaa;letter-spacing:2px;">GROUP STAGE PREDICTIONS — ${state.playerName.toUpperCase()}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">${groupsHTML}</div>
    </div>
  `;
}

function buildKnockoutExportHTML() {
  function matchRow(m) {
    const w = state.knockoutResults[m.id];
    const a = m.teamA, b = m.teamB;
    return `
      <div style="background:rgba(255,255,255,0.05);border:1px solid ${w ? '#FFD700' : 'rgba(255,255,255,0.1)'};border-radius:10px;padding:12px;margin-bottom:8px;">
        <div style="font-size:11px;color:#aaa;letter-spacing:1px;margin-bottom:8px;">${m.label}</div>
        <div style="display:flex;align-items:center;gap:8px;padding:4px 0;${w && a && w.name===a.name ? 'font-weight:700;color:#FFD700;' : 'color:rgba(255,255,255,0.7);'}">
          <span style="font-size:18px;">${a ? a.flag : '❓'}</span>
          <span style="font-size:13px;">${a ? a.name : 'TBD'}</span>
          ${w && a && w.name===a.name ? '<span>✓</span>' : ''}
        </div>
        <div style="font-size:10px;color:#555;text-align:center;">vs</div>
        <div style="display:flex;align-items:center;gap:8px;padding:4px 0;${w && b && w.name===b.name ? 'font-weight:700;color:#FFD700;' : 'color:rgba(255,255,255,0.7);'}">
          <span style="font-size:18px;">${b ? b.flag : '❓'}</span>
          <span style="font-size:13px;">${b ? b.name : 'TBD'}</span>
          ${w && b && w.name===b.name ? '<span>✓</span>' : ''}
        </div>
      </div>
    `;
  }

  const champion = state.knockoutResults['final'];

  return `
    <div style="width:1400px;padding:40px;background:#0a0e1a;font-family:'Barlow Condensed',sans-serif;color:#fff;">
      <div style="text-align:center;margin-bottom:30px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;color:#FFD700;letter-spacing:4px;">FIFA WORLD CUP 2026</div>
        <div style="font-size:20px;color:#aaa;letter-spacing:2px;">KNOCKOUT BRACKET — ${state.playerName.toUpperCase()}</div>
        ${champion ? `<div style="font-size:28px;margin-top:10px;">🏆 ${champion.flag} ${champion.name}</div>` : ''}
      </div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;align-items:start;">
        <div><div style="text-align:center;color:#FFD700;margin-bottom:12px;">ROUND OF 32</div>${r32Matches.map(m => matchRow(m)).join('')}</div>
        <div><div style="text-align:center;color:#FFD700;margin-bottom:12px;">ROUND OF 16</div>${r16Matches.map(m => matchRow(m)).join('')}</div>
        <div><div style="text-align:center;color:#FFD700;margin-bottom:12px;">QUARTER-FINALS</div>${qfMatches.map(m => matchRow(m)).join('')}
             <div style="text-align:center;color:#aaa;margin:16px 0 8px;">3RD PLACE</div>${matchRow(thirdMatch)}</div>
        <div><div style="text-align:center;color:#FFD700;margin-bottom:12px;">SEMI-FINALS</div>${sfMatches.map(m => matchRow(m)).join('')}</div>
        <div><div style="text-align:center;color:#FFD700;margin-bottom:12px;">THE FINAL</div>${matchRow(finalMatch)}</div>
      </div>
    </div>
  `;
}

// ── CONFETTI & RESTART ──────────────────────────────────────
function spawnConfetti() {
  const container = document.getElementById('confetti');
  container.innerHTML = '';
  for (let i = 0; i < 80; i++) {
    const div = document.createElement('div');
    div.className = 'confetti-piece';
    div.style.cssText = `
      left:${Math.random()*100}%; animation-delay:${Math.random()*3}s;
      background:${['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#FFA07A'][Math.floor(Math.random()*5)]};
      width:${6+Math.random()*10}px; height:${6+Math.random()*10}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    container.appendChild(div);
  }
}

function restartApp() {
  state = {
    playerName: '',
    currentGroup: 0,
    groupPredictions: {},
    selectedThirds:
