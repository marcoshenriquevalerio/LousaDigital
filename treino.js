/* treino.js — Treino em casa: botão + assistente (sexo → parte do corpo → exercícios) + widget animado.
   Carregue DEPOIS dos scripts do index.html:  <script src="treino.js"></script>  (antes do firebase.js)
   A animação É o temporizador: faz o exercício durante o "Exercício", fica de pé no "Descanso" e repete até acabar as séries. */
(function () {
  if (window.__treino) return; window.__treino = 1;
  const D2R = Math.PI / 180, $ = (i) => document.getElementById(i);

  /* ---------- poses (lado direito = frente do boneco; y para cima, chão = 0) ---------- */
  const f = (hx, hy, tor, lh, rh, lf, rf, hd) => ({ p: [hx, hy, tor, hd || 0], lh, rh, lf, rf });
  const DEF = { s: { lh: [2, -30, 1], rh: [4, -30, 1], lf: [-3, 0], rf: [4, 0] }, f: { lh: [-3, -30, 1], rh: [3, -30, 1], lf: [-7, 0], rf: [7, 0] } };
  const BD = { s: [-1, -1, 1, 1], f: [-1, 1, -1, 1] };   // sentido de dobra: cotovelo E, cotovelo D, joelho E, joelho D
  const ST = f(0, 43, 0);
  const HP = [6, -14, 1];                                   // mãos na cintura
  const PU = f(0, 20, 66, [28, 0], [30, 0], [-40, 2], [-38, 2]), PD = f(4, 7, 84, [30, 0], [32, 0], [-40, 2], [-38, 2]);
  const EX = {}, x = (id, n, v, ms, fr, b) => (EX[id] = { id, n, v, ms, fr, b: b || BD[v] });

  x('flexao', 'Flexão de braço', 's', 1800, [PU, PD]);
  x('palmas', 'Pressão de palmas', 'f', 1600, [f(0, 43, 0, [-14, -4, 1], [14, -4, 1]), f(0, 43, 0, [-2, -6, 1], [2, -6, 1])], [1, -1, -1, 1]);
  x('remada', 'Remada curvada (mochila)', 's', 1800, [f(-8, 40, 65, [6, -30, 1], [8, -30, 1], [-3, 0], [4, 0]), f(-8, 40, 65, [-8, -8, 1], [-6, -8, 1], [-3, 0], [4, 0])]);
  x('super', 'Superman', 's', 2400, [f(-12, 6, 90, [24, -2, 1], [24, -2, 1], [-56, 3], [-56, 3]), f(-12, 8, 78, [24, 8, 1], [24, 8, 1], [-56, 16], [-56, 16])]);
  x('superalt', 'Superman alternado', 's', 2400, [f(-12, 8, 80, [24, 8, 1], [22, 0, 1], [-56, 3], [-56, 16]), f(-12, 8, 80, [22, 0, 1], [24, 8, 1], [-56, 16], [-56, 3])]);
  x('ponte', 'Ponte de glúteos', 's', 2400, [f(0, 7, -90, [-30, 1], [-32, 1], [20, 0], [22, 0]), f(0, 22, -125, [-30, 1], [-32, 1], [20, 0], [22, 0])]);
  x('pontuni', 'Ponte com uma perna', 's', 2600, [f(0, 7, -90, [-30, 1], [-32, 1], [20, 0], [22, 0]), f(0, 22, -125, [-30, 1], [-32, 1], [20, 0], [44, 28])]);
  x('lateral', 'Elevação lateral (garrafas)', 'f', 2000, [f(0, 43, 0, [-3, -30, 1], [3, -30, 1], [-7, 0], [7, 0]), f(0, 43, 0, [-33, -2, 1], [33, -2, 1], [-7, 0], [7, 0])]);
  x('press', 'Desenvolvimento (garrafas)', 'f', 2200, [f(0, 43, 0, [-12, 8, 1], [12, 8, 1], [-7, 0], [7, 0]), f(0, 43, 0, [-6, 32, 1], [6, 32, 1], [-7, 0], [7, 0])], [1, -1, -1, 1]);
  x('rosca', 'Rosca direta (garrafas)', 's', 2000, [f(0, 43, 0, [2, -30, 1], [4, -30, 1]), f(0, 43, 0, [12, -8, 1], [14, -8, 1])]);
  x('roscaalt', 'Rosca alternada', 's', 2400, [f(0, 43, 0, [12, -8, 1], [4, -30, 1]), f(0, 43, 0, [2, -30, 1], [14, -8, 1])]);
  x('triover', 'Tríceps acima da cabeça', 's', 2200, [f(0, 43, 0, [-8, 12, 1], [-6, 12, 1]), f(0, 43, 0, [0, 32, 1], [2, 32, 1])]);
  x('coice', 'Tríceps coice', 's', 2000, [f(-8, 40, 65, [0, -16, 1], [2, -16, 1], [-3, 0], [4, 0]), f(-8, 40, 65, [-26, -6, 1], [-24, -6, 1], [-3, 0], [4, 0])]);
  x('flexfech', 'Flexão fechada (tríceps)', 's', 1800, [PU, PD]);
  x('punho', 'Rosca de punho', 's', 1200, [f(0, 43, 0, [18, -2, 1], [18, -2, 1]), f(0, 43, 0, [18, 7, 1], [18, 7, 1])]);
  x('abdominal', 'Abdominal', 's', 2000, [f(0, 6, -90, [-4, 8, 1], [-4, 8, 1], [18, 0], [20, 0]), f(0, 6, -50, [-4, 8, 1], [-4, 8, 1], [18, 0], [20, 0])]);
  x('legraise', 'Elevação de pernas', 's', 2600, [f(0, 6, -90, [-12, 2], [-14, 2], [44, 2], [44, 2]), f(0, 6, -90, [-12, 2], [-14, 2], [2, 48], [3, 47])]);
  x('prancha', 'Prancha', 's', 3000, [f(0, 14, 80, [42, 2], [44, 2], [-40, 2], [-38, 2]), f(0, 15, 80, [42, 2], [44, 2], [-40, 2], [-38, 2])]);
  x('escalador', 'Escalador', 's', 700, [f(0, 20, 66, [28, 0], [30, 0], [-12, 16], [-38, 2]), f(0, 20, 66, [28, 0], [30, 0], [-40, 2], [-12, 16])]);
  x('bike', 'Bicicleta (oblíquos)', 's', 1400, [f(0, 6, -55, [-3, 8, 1], [-3, 8, 1], [22, 16], [40, 6]), f(0, 6, -55, [-3, 8, 1], [-3, 8, 1], [40, 6], [22, 16])]);
  x('inclina', 'Inclinação lateral', 'f', 2400, [f(0, 43, -18, [-4, -30, 1], [8, 26, 1], [-7, 0], [7, 0]), f(0, 43, 18, [-8, 26, 1], [4, -30, 1], [-7, 0], [7, 0])]);
  x('agacha', 'Agachamento', 's', 2200, [f(0, 43, 5, [18, 0, 1], [18, 0, 1], [-3, 0], [4, 0]), f(-12, 22, 40, [18, 0, 1], [18, 0, 1], [-3, 0], [4, 0])]);
  const LG = (a, b) => f(0, 26, 0, [8, -18, 1], [8, -18, 1], a, b);
  x('afundo', 'Afundo', 's', 3600, [ST, LG([-24, 2], [14, 0]), ST, LG([14, 0], [-24, 2])]);
  x('parede', 'Cadeirinha na parede', 's', 3000, [f(-14, 23, 0, [4, -4, 1], [6, -4, 1], [8, 1], [10, 1]), f(-14, 24, 0, [4, -4, 1], [6, -4, 1], [8, 1], [10, 1])]);
  x('bomdia', 'Stiff (bom-dia)', 's', 2600, [f(0, 43, 0, [2, -30, 1], [4, -30, 1]), f(-14, 40, 75, [0, -30, 1], [2, -30, 1])]);
  x('coicepe', 'Coice em pé (glúteo)', 's', 3200, [f(0, 43, 0, HP, HP), f(0, 43, 0, HP, HP, [-3, 0], [-18, 26]), f(0, 43, 0, HP, HP), f(0, 43, 0, HP, HP, [-18, 26], [4, 0])]);
  x('panturrilha', 'Elevação de panturrilha', 's', 1400, [f(0, 43, 0, HP, HP), f(0, 47, 0, HP, HP, [-3, 3], [4, 3])]);
  x('legside', 'Abdução de perna', 'f', 3600, [ST, f(-3, 43, -6, [-6, -14, 1], [6, -14, 1], [-7, 0], [36, 16]), ST, f(3, 43, 6, [-6, -14, 1], [6, -14, 1], [-36, 16], [7, 0])]);
  x('sumo', 'Agachamento sumô', 'f', 2400, [f(0, 43, 0, [-3, -6, 1], [3, -6, 1], [-20, 0], [20, 0]), f(0, 27, 0, [-3, -6, 1], [3, -6, 1], [-20, 0], [20, 0])]);
  x('remalta', 'Remada alta', 'f', 2000, [f(0, 43, 0, [-3, -30, 1], [3, -30, 1], [-7, 0], [7, 0]), f(0, 43, 0, [-5, -8, 1], [5, -8, 1], [-7, 0], [7, 0])]);
  x('pescoco', 'Inclinação do pescoço', 'f', 3200, [f(0, 43, 0, null, null, null, null, -25), f(0, 43, 0, null, null, null, null, 25)]);
  x('polichinelo', 'Polichinelo', 'f', 800, [ST, f(0, 44, 0, [-8, 32, 1], [8, 32, 1], [-17, 0], [17, 0])]);
  x('joelho', 'Joelho alto', 's', 800, [f(0, 43, 0, [10, -8, 1], [-6, -10, 1], [-3, 0], [14, 24]), f(0, 43, 0, [-6, -10, 1], [10, -8, 1], [14, 24], [4, 0])]);
  const BQ = f(-14, 22, 45, [14, 0], [14, 0], [-3, 0], [3, 0]);
  x('burpee', 'Burpee', 's', 4200, [ST, BQ, PU, BQ, f(0, 52, 0, [4, 30, 1], [6, 30, 1], [-3, 6], [4, 6])]);
  x('along1', 'Alongar quadríceps', 's', 3000, [f(0, 43, 0, [2, -30, 1], [4, -30, 1], [-3, 0], [-10, 26]), f(0, 43, 0, [2, -30, 1], [4, -30, 1], [-3, 0], [-10, 27])].map(o => (o.lh = [-10, 26], o)));
  x('along2', 'Tocar os pés', 's', 3600, [ST, f(-10, 42, 160, [5, 3], [7, 3])]);
  x('along3', 'Alongar lateral (braços)', 'f', 3600, [f(0, 43, -15, [-6, 32, 1], [6, 32, 1]), f(0, 43, 15, [-6, 32, 1], [6, 32, 1])]);

  const PARTS = [
    ['Peito', '💪', ['flexao', 'palmas']], ['Costas', '🔙', ['remada', 'superalt']], ['Lombar', '🧍', ['super', 'ponte']],
    ['Ombros', '🏋️', ['lateral', 'press']], ['Bíceps', '💪', ['rosca', 'roscaalt']], ['Tríceps', '🦾', ['triover', 'coice', 'flexfech']],
    ['Antebraço', '✊', ['punho']], ['Abdômen', '🔥', ['abdominal', 'legraise', 'prancha', 'escalador', 'bike']], ['Oblíquos', '🌀', ['bike', 'inclina']],
    ['Glúteos', '🍑', ['ponte', 'pontuni', 'coicepe', 'sumo']], ['Quadríceps', '🦵', ['agacha', 'afundo', 'parede']], ['Posterior de coxa', '🦿', ['bomdia', 'coicepe']],
    ['Panturrilha', '🦶', ['panturrilha']], ['Coxa interna/externa', '↔️', ['legside', 'sumo']], ['Trapézio e pescoço', '🧣', ['remalta', 'pescoco']],
    ['Corpo todo / Cardio', '🏃', ['polichinelo', 'joelho', 'escalador', 'burpee']], ['Alongamento', '🧘', ['along1', 'along2', 'along3']]
  ];

  /* ---------- rig: cinemática inversa de 2 ossos ---------- */
  function res(fr, v, g) {
    const [hx, hy, tor, hd] = fr.p, r = tor * D2R, nx = hx + 30 * Math.sin(r), ny = hy + 30 * Math.cos(r), m = g === 'm', d = DEF[v];
    const sw = v === 'f' ? (m ? 10 : 8) : 0, hw = v === 'f' ? (m ? 5 : 6.5) : 0, T = (a, dd, ox, oy) => { a = a || dd; return a[2] ? [a[0] + ox, a[1] + oy] : [a[0], a[1]]; };
    return [hx, hy, tor, hd, ...T(fr.lh, d.lh, nx - sw, ny), ...T(fr.rh, d.rh, nx + sw, ny), ...T(fr.lf, d.lf, hx - hw, hy), ...T(fr.rf, d.rf, hx + hw, hy)];
  }
  function ik(p, t, l1, l2, s) {
    const dx = t[0] - p[0], dy = t[1] - p[1], d = Math.hypot(dx, dy) || .01, m = Math.min(d, l1 + l2 - .01), a = Math.atan2(dy, dx);
    const A = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + m * m - l2 * l2) / (2 * l1 * m))));
    return [[p[0] + l1 * Math.cos(a + s * A), p[1] + l1 * Math.sin(a + s * A)], [p[0] + dx / d * m, p[1] + dy / d * m]];
  }
  function fig(V, v, g, b) {
    const m = g === 'm', SK = '#f1c27d', SH = m ? '#38bdf8' : '#f472b6', SO = m ? '#1e3a8a' : '#7c3aed', HR = m ? '#3b2a1a' : '#a16207', aw = m ? 6.5 : 5.5;
    const [hx, hy, tor, hd] = V, r = tor * D2R, nx = hx + 30 * Math.sin(r), ny = hy + 30 * Math.cos(r), sw = v === 'f' ? (m ? 10 : 8) : 0, hw = v === 'f' ? (m ? 5 : 6.5) : 0;
    const X = (p) => p[0].toFixed(1), Y = (p) => (108 - p[1]).toFixed(1);
    const L = (a, c, w, o) => `<line x1="${X(a)}" y1="${Y(a)}" x2="${X(c)}" y2="${Y(c)}" stroke="#0f172a" stroke-opacity=".55" stroke-width="${w + 2.4}" stroke-linecap="round"/><line x1="${X(a)}" y1="${Y(a)}" x2="${X(c)}" y2="${Y(c)}" stroke="${o}" stroke-width="${w}" stroke-linecap="round"/>`;
    const C = (p, rr, c) => `<circle cx="${X(p)}" cy="${Y(p)}" r="${rr}" fill="${c}" stroke="#0f172a" stroke-opacity=".55" stroke-width="1"/>`;
    const leg = (rt, t, s) => { const [k, e] = ik(rt, t, 22, 22, s); return L(rt, k, aw + 1.5, SO) + L(k, e, aw, SK) + C([e[0] + (v === 's' ? 2.5 : 0), e[1] + 1], 3.4, '#f8fafc'); };
    const arm = (rt, t, s) => { const [k, e] = ik(rt, t, 17, 16, s); return L(rt, k, aw, SH) + L(k, e, aw - .8, SK) + C(e, 3, SK); };
    const hp = [hx, hy], nk = [nx, ny], hc = [nx + 10 * Math.sin(r + hd * D2R), ny + 10 * Math.cos(r + hd * D2R)], face = v === 's' ? [hc[0] + 2, hc[1] - 1] : [hc[0], hc[1] - .5];
    let o = `<g opacity=".82">${leg([hx - hw, hy], [V[10], V[11]], b[2])}${arm([nx - sw, ny], [V[4], V[5]], b[0])}</g>`;
    o += L(hp, nk, m ? 12 : 10, SH) + L(hp, [hx + (nx - hx) * .25, hy + (ny - hy) * .25], m ? 12 : 10, SO);
    o += leg([hx + hw, hy], [V[12], V[13]], b[3]) + arm([nx + sw, ny], [V[6], V[7]], b[1]);
    if (!m) o += v === 's' ? L([hc[0] - 6, hc[1] + 1], [hc[0] - 13, hc[1] - 6], 4, HR) : C([hc[0], hc[1] + 8], 3.4, HR);
    o += C(hc, 7.8, HR) + C(face, 6.6, SK);
    if (v === 's') o += C([hc[0] + 5, hc[1] + .5], 1, '#0f172a'); else o += C([hc[0] - 2.5, hc[1]], .9, '#0f172a') + C([hc[0] + 2.5, hc[1]], .9, '#0f172a');
    return o;
  }
  const build = (ex, g) => ex.fr.map((fr) => res(fr, ex.v, g));
  function at(vs, p) { const N = vs.length, q = p * N, k = Math.floor(q) % N, e = .5 - .5 * Math.cos(Math.PI * (q - Math.floor(q))), a = vs[k], b = vs[(k + 1) % N]; return a.map((v, i) => v + (b[i] - v) * e); }

  /* ---------- widget "Treino" ---------- */
  Object.defineProperty(WG_KINDS, 'workout', { value: { name: 'Treino', icon: 'fa-dumbbell', w: 260, styles: ['Treino'] }, enumerable: false });   // fora do menu de widgets: nasce pelo botão Treino
  const WO = {};
  function tick(s, c, now) {
    if (s.paused) return;
    for (let g = 0; g < 60 && (s.ph === 'work' || s.ph === 'rest') && now >= s.end; g++) {
      if (s.ph === 'work') {
        if (s.i >= c.r) { s.ph = 'done'; tmAlarm(); }
        else if (c.d > 0) { s.ph = 'rest'; s.t0 = s.end; s.end += c.d * 1000; tmBip(); }
        else { s.i++; s.t0 = s.end; s.end += c.t * 1000; }
      } else { s.ph = 'work'; s.i++; s.t0 = s.end; s.end += c.t * 1000; tmBip(); }
    }
  }
  WG_MOUNT.workout = function (b, n) {
    const c = n.wo || (n.wo = { g: 'm', ex: 'polichinelo', t: 40, d: 20, r: 3 }), ex = EX[c.ex] || EX.polichinelo, ink = wgInk();
    const s = WO[n.id] || (WO[n.id] = { ph: 'idle', i: 0, p: 0 }), vs = build(ex, c.g), stand = res(ST, ex.v, c.g); let cur = stand.slice();
    b.innerHTML = `<div class="tm font-chalk"><div style="font-size:7cqw;line-height:1.1;text-align:center">${c.g === 'm' ? '♂' : '♀'} ${ex.n}</div><div class="tm-vis"><svg viewBox="-60 0 120 116" style="width:80%;display:block"><line x1="-58" x2="58" y1="108.5" y2="108.5" stroke="${ink}" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="4 3"/><g class="wo-g"></g></svg></div><div class="tm-time"></div><div class="tm-msg"></div>
      <div class="tm-ctl"><button data-a="pause"><i class="fa-solid fa-pause"></i> Pausa</button><button data-a="play"><i class="fa-solid fa-play"></i> Play</button><button data-a="stop"><i class="fa-solid fa-stop"></i> Parar</button></div>
      <div class="tm-cfg">${[['t', 'Exercício'], ['d', 'Descanso'], ['r', 'Séries']].map(([k, l]) => `<button data-k="${k}"><small>${l}</small><b></b></button>`).join('')}</div></div>`;
    const q = (z) => b.querySelector(z), G = q('.wo-g'), T = q('.tm-time'), M = q('.tm-msg'), C = q('.tm-cfg'), bp = q('[data-a=pause]'), bl = q('[data-a=play]'), bs = q('[data-a=stop]');
    const run = () => (s.ph === 'work' || s.ph === 'rest') && !s.paused;
    const upd = () => {
      const now = Date.now(); tick(s, c, now); let tgt = stand;
      if (s.ph === 'work') { if (!s.paused) s.p = ((now - s.t0) % ex.ms) / ex.ms; tgt = at(vs, s.p); }
      cur = cur.map((v, i) => v + (tgt[i] - v) * .3); G.innerHTML = fig(cur, ex.v, c.g, ex.b);
      const rem = s.ph === 'idle' ? c.t * 1000 : s.ph === 'done' ? 0 : (s.paused ? s.end - s.pa : s.end - now), tx = tmFmt(Math.ceil(rem / 1000));
      if (T.textContent !== tx) T.textContent = tx; T.style.fontSize = '13cqw';
      const ms = s.ph === 'done' ? 'Treino concluído!' : s.ph === 'idle' ? '' : (s.paused ? 'Pausado · ' : s.ph === 'work' ? 'Exercício · ' : 'Descanso · ') + 'série ' + s.i + '/' + c.r;
      if (M.textContent !== ms) M.textContent = ms; M.classList.toggle('tm-blink', s.ph === 'done');
      C.style.display = (s.ph === 'idle' || s.ph === 'done') ? '' : 'none';
      C.querySelectorAll('[data-k]').forEach((z) => { const t2 = z.dataset.k === 'r' ? c.r + 'x' : tmFmt(c[z.dataset.k]); if (z.lastChild.textContent !== t2) z.lastChild.textContent = t2; });
      bp.disabled = !run(); bl.disabled = run(); bs.disabled = s.ph === 'idle';
    };
    b.onclick = (e) => {
      const kb = e.target.closest('[data-k]');
      if (kb) { if (s.ph === 'idle' || s.ph === 'done') { const k = kb.dataset.k; if (k === 'r') { c.r = c.r % 20 + 1; saveData(); } else tmPicker(k === 't' ? 'Exercício' : 'Descanso', c[k] || 0, (v) => { c[k] = v; saveData(); }); } return; }
      const a = e.target.closest('[data-a]'); if (!a) return; const now = Date.now();
      if (a.dataset.a === 'play') {
        tmAudio();
        if (s.ph === 'idle' || s.ph === 'done') { if (!(c.t > 0)) { tmPicker('Exercício', 0, (v) => { c.t = v; saveData(); }); return; } tmStopAlarm(); s.ph = 'work'; s.i = 1; s.t0 = now; s.end = now + c.t * 1000; s.paused = false; s.p = 0; }
        else if (s.paused) { const dt = now - s.pa; s.t0 += dt; s.end += dt; s.paused = false; }
      } else if (a.dataset.a === 'pause') { if (run()) { s.paused = true; s.pa = now; } }
      else { tmStopAlarm(); s.ph = 'idle'; s.paused = false; }
    };
    return wgLoop(upd);
  };

  /* ---------- assistente: sexo → parte do corpo → exercícios ---------- */
  const st = { g: null, part: null }; let raf = 0, prev = [];
  const box = () => $('woModal') || (() => { const d = document.createElement('div'); d.id = 'woModal'; d.style.cssText = 'position:fixed;inset:0;z-index:9991;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:8px'; d.onclick = (e) => { if (e.target === d) closeW(); }; document.body.appendChild(d); return d; })();
  function closeW() { cancelAnimationFrame(raf); const m = $('woModal'); if (m) m.remove(); }
  function add(ids) {
    const bd = getActiveBoard(), bw = (byId('boardCanvas') || {}).offsetWidth || 800;
    ids.forEach((e, i) => { const id = 'note_' + Date.now() + '_' + i; bd.nextZIndex += 1; bd.notes.push({ id, type: 'widget', wk: 'workout', ws: 0, wo: { g: st.g, ex: e, t: 40, d: 20, r: 3 }, x: Math.max(10, Math.min(20 + (i % 4) * 270, bw - 270)), y: 70 + Math.floor(i / 4) * 330 + Math.random() * 30, width: 260, zIndex: bd.nextZIndex }); });
    saveData(); renderNotes();
  }
  const BTN = 'class="bg-stone-700 hover:bg-stone-600 rounded-xl p-3 text-stone-100 font-bold" style="cursor:pointer"';
  function render() {
    cancelAnimationFrame(raf); prev = []; const m = box(); let h = '<div class="bg-stone-800 text-stone-100 rounded-2xl p-4" style="width:min(760px,100%);max-height:92vh;overflow:auto"><div class="flex items-center justify-between mb-3"><b class="text-lg"><i class="fa-solid fa-dumbbell text-orange-300"></i> Treino em casa</b><button data-w="x" class="text-stone-300 hover:text-white p-1"><i class="fa-solid fa-xmark text-lg"></i></button></div>';
    if (!st.g) h += `<div class="mb-2 text-sm">Para quem é o treino?</div><div class="grid grid-cols-2 gap-3"><button data-g="m" ${BTN} style="font-size:22px;padding:22px">♂ Homem</button><button data-g="f" ${BTN} style="font-size:22px;padding:22px">♀ Mulher</button></div>`;
    else if (!st.part) h += `<button data-w="back" class="text-sm text-stone-300 mb-2">← Voltar</button><div class="mb-2 text-sm">Qual parte do corpo?</div><div class="grid grid-cols-2 sm:grid-cols-3 gap-2">${PARTS.map((p, i) => `<button data-p="${i}" ${BTN}><div style="font-size:22px">${p[1]}</div>${p[0]}</button>`).join('')}</div>`;
    else { const P = PARTS[st.part]; h += `<div class="flex items-center justify-between mb-2"><button data-w="back" class="text-sm text-stone-300">← ${P[0]}</button><button data-w="all" class="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg px-3 py-1 text-sm">Adicionar todos</button></div><div class="grid grid-cols-2 sm:grid-cols-3 gap-2">${P[2].map((id) => `<button data-e="${id}" ${BTN}><svg viewBox="-60 0 120 116" style="width:100%;height:130px" data-pv="${id}"><g></g></svg><div class="text-sm">${EX[id].n}</div><div class="text-xs text-amber-300">+ Adicionar à lousa</div></button>`).join('')}</div>`; }
    m.innerHTML = h + '</div>';
    m.querySelectorAll('[data-pv]').forEach((sv) => { const e = EX[sv.dataset.pv]; prev.push({ g: sv.firstChild, e, vs: build(e, st.g) }); });
    const loop = () => { const t = Date.now(); prev.forEach((p) => { p.g.innerHTML = fig(at(p.vs, (t % p.e.ms) / p.e.ms), p.e.v, st.g, p.e.b); }); raf = requestAnimationFrame(loop); }; if (prev.length) loop();
  }
  window.openTreino = function () { st.g = null; st.part = null; render(); };
  document.addEventListener('click', (e) => {
    const m = $('woModal'); if (!m || !m.contains(e.target)) return; const t = e.target.closest('[data-g],[data-p],[data-e],[data-w]'); if (!t) return;
    if (t.dataset.g) st.g = t.dataset.g; else if (t.dataset.p) st.part = +t.dataset.p;
    else if (t.dataset.e) { add([t.dataset.e]); t.style.outline = '2px solid #fbbf24'; return; }
    else if (t.dataset.w === 'x') return closeW(); else if (t.dataset.w === 'all') { add(PARTS[st.part][2]); closeW(); return; }
    else if (t.dataset.w === 'back') { if (st.part !== null) st.part = null; else st.g = null; }
    render();
  });

  /* ---------- botão na barra (antes do botão de Widgets) ---------- */
  const wb = document.querySelector('button[onclick^="toggleWidgetMenu"]');
  if (wb) { const nb = document.createElement('button'); nb.className = 'tb bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300'; nb.title = 'Treino em casa'; nb.setAttribute('onclick', 'openTreino()'); nb.innerHTML = '<i class="fa-solid fa-dumbbell"></i><span class="tb-label"></span>'; wb.parentNode.insertBefore(nb, wb); }
})();
