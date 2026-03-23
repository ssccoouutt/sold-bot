// commands/fun/quiz.js
// Interactive JEE quiz with no-repeat until pool exhausted.
// Supports: inline question, random JEE bank, auto mode.
const fs = require('fs');
const path = require('path');

const activeQuizzes = new Map(); // `${chat}:${qid}` => { correct, question, options, createdAt }
const autoQuizzes = new Map();   // `${chat}` => { intervalId, createdBy, intervalMs }
const usedQuestions = new Map(); // `${chat}` => Set of used indices to prevent repeats
const BANK_FILE = path.join(__dirname, '../../data/quiz_bank.json');

function ensureBankFile() {
  const dir = path.dirname(BANK_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BANK_FILE)) fs.writeFileSync(BANK_FILE, '[]', 'utf8');
}

function loadBank() {
  try {
    ensureBankFile();
    const raw = fs.readFileSync(BANK_FILE, 'utf8').trim() || '[]';
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error('[quiz.loadBank]', e.message || e);
    return [];
  }
}

function normalizeOptionsArray(options) {
  return options.map((o, idx) => ({ id: String.fromCharCode(65 + idx), title: `${String.fromCharCode(65 + idx)}) ${o}` }));
}

async function sendQuiz(sock, chat, questionObj, quotedMsg) {
  try {
    const qid = Date.now().toString();
    activeQuizzes.set(`${chat}:${qid}`, { correct: questionObj.correct, question: questionObj.question, options: questionObj.options, askedBy: null, createdAt: Date.now() });

    const rows = questionObj.options.map(opt => ({ id: `quiz_${qid}_${opt.id}`, title: opt.title }));
    const sections = [{ title: 'Options', rows }];

    const listMessage = {
      interactive: {
        type: 'list',
        header: { type: 'text', text: 'Quiz (JEE-level)' },
        body: { text: questionObj.question },
        footer: { text: 'Select the correct option' },
        action: { button: 'Choose option', sections }
      }
    };

    await sock.sendMessage(chat, listMessage, quotedMsg ? { quoted: quotedMsg } : {});
    return qid;
  } catch (err) {
    console.error('[quiz.sendQuiz] Error sending quiz:', err);
    try { await sock.sendMessage(chat, { text: '⚠️ Failed to send quiz. Please try again later.' }); } catch (e) {}
    return null;
  }
}

module.exports = {
  name: 'quiz',
  description: 'Sends an interactive JEE quiz with no repeats until pool exhausted. Supports auto mode and inline Qs.',
  ownerOnly: false,
  groupOnly: false,

  execute: async (sock, msg, args, ctx) => {
    const from = ctx.from || msg.key.remoteJid;
    const quoted = msg;

    // Auto mode: .quiz auto start <seconds> | .quiz auto stop
    if (args[0] && args[0].toLowerCase() === 'auto') {
      const sub = (args[1] || '').toLowerCase();
      if (sub === 'start') {
        const allowed = ctx.isOwner || ctx.isAdmin;
        if (!allowed) return sock.sendMessage(from, { text: '🔒 Only owner or admins can start auto-quiz.' }, { quoted });
        const seconds = Math.max(30, parseInt(args[2], 10) || 3600);
        const intervalMs = seconds * 1000;
        if (autoQuizzes.has(from)) return sock.sendMessage(from, { text: 'Auto-quiz already running.' }, { quoted });

        const intervalId = setInterval(async () => {
          try {
            const bank = loadBank();
            if (!bank.length) return;
            // prefer JEE-level
            const jeePool = bank.map((q, i) => ({ q, i })).filter(x => (x.q.level || '').toLowerCase() === 'jee' || (x.q.tags || []).map(t => t.toLowerCase()).includes('jee'));
            const pool = jeePool.length ? jeePool : bank.map((q, i) => ({ q, i }));

            // Use usedQuestions to avoid repeats
            if (!usedQuestions.has(from)) usedQuestions.set(from, new Set());
            const usedSet = usedQuestions.get(from);

            // build available list of indices excluding used
            let available = pool.filter(x => !usedSet.has(x.i));
            if (!available.length) {
              // reset used set if exhausted
              usedSet.clear();
              available = pool;
            }

            const pick = available[Math.floor(Math.random() * available.length)];
            if (!pick) return;

            const pickedQuestion = pick.q;
            const idx = pick.i;
            usedSet.add(idx);

            const opts = normalizeOptionsArray(pickedQuestion.options || []);
            const questionObj = { question: pickedQuestion.question || 'Untitled', options: opts, correct: (pickedQuestion.correct || 'A').toUpperCase() };
            await sendQuiz(sock, from, questionObj, null);
          } catch (e) {
            console.error('[quiz.autoInterval] Error:', e);
          }
        }, intervalMs);

        autoQuizzes.set(from, { intervalId, createdBy: ctx.sender, intervalMs });
        return sock.sendMessage(from, { text: `✅ Auto-quiz started every ${seconds}s.` }, { quoted });
      } else if (sub === 'stop') {
        const entry = autoQuizzes.get(from);
        const allowed = ctx.isOwner || ctx.isAdmin || (entry && entry.createdBy === ctx.sender);
        if (!allowed) return sock.sendMessage(from, { text: '🔒 Not allowed to stop auto-quiz.' }, { quoted });
        if (!entry) return sock.sendMessage(from, { text: 'Auto-quiz not running.' }, { quoted });
        clearInterval(entry.intervalId);
        autoQuizzes.delete(from);
        return sock.sendMessage(from, { text: '⛔ Auto-quiz stopped.' }, { quoted });
      } else {
        return sock.sendMessage(from, { text: 'Usage: .quiz auto start <seconds> | .quiz auto stop' }, { quoted });
      }
    }

    // Inline question
    const joined = args.join(' ').trim();
    let questionObj = null;
    if (joined) {
      const parts = joined.split('|').map(p => p.trim()).filter(p => p);
      if (parts.length >= 3) {
        const last = parts[parts.length - 1].toUpperCase();
        if (/^[A-Z]$/.test(last)) {
          const correct = last;
          const opts = parts.slice(1, parts.length - 1);
          questionObj = { question: parts[0], options: normalizeOptionsArray(opts), correct };
        } else {
          const opts = parts.slice(1);
          questionObj = { question: parts[0], options: normalizeOptionsArray(opts), correct: 'A' };
        }
      } else {
        return sock.sendMessage(from, { text: 'Usage: .quiz Q | optA | optB | ... | <CorrectLetter>' }, { quoted });
      }
    }

    // pick from bank (no repeats)
    if (!questionObj) {
      const bank = loadBank();
      if (!bank.length) {
        questionObj = { question: 'In which case acceleration is zero but velocity is not zero?', options: normalizeOptionsArray(['Free fall','Uniform motion','Circular motion','Projectile motion']), correct: 'B' };
      } else {
        const pool = bank.map((q, i) => ({ q, i })).filter(x => (x.q.level || '').toLowerCase() === 'jee' || (x.q.tags || []).map(t => t.toLowerCase()).includes('jee'));
        const fallbackPool = bank.map((q, i) => ({ q, i }));
        const chosenPool = pool.length ? pool : fallbackPool;

        if (!usedQuestions.has(from)) usedQuestions.set(from, new Set());
        const usedSet = usedQuestions.get(from);
        let available = chosenPool.filter(x => !usedSet.has(x.i));
        if (!available.length) { usedSet.clear(); available = chosenPool; }

        const pick = available[Math.floor(Math.random() * available.length)];
        if (!pick) {
          const first = chosenPool[0];
          questionObj = { question: first.q.question || 'Untitled', options: normalizeOptionsArray(first.q.options || []), correct: (first.q.correct || 'A').toUpperCase() };
        } else {
          usedSet.add(pick.i);
          questionObj = { question: pick.q.question || 'Untitled', options: normalizeOptionsArray(pick.q.options || []), correct: (pick.q.correct || 'A').toUpperCase() };
        }
      }
    }

    await sendQuiz(sock, from, questionObj, quoted);
  },

  handleSelection: async (sock, msg, selectedRowId) => {
    try {
      const m = String(selectedRowId).match(/^quiz_(\d+)_(A|B|C|D|E|F)$/);
      if (!m) return;
      const qid = m[1];
      const choice = m[2];
      const chat = msg.key.remoteJid;
      const key = `${chat}:${qid}`;
      const state = activeQuizzes.get(key);
      if (!state) { await sock.sendMessage(chat, { text: 'This quiz has expired.' }, { quoted: msg }); return; }
      const correct = state.correct;
      const optionText = state.options.find(o => o.id === choice)?.title || choice;
      const correctText = state.options.find(o => o.id === correct)?.title || correct;
      const reply = choice === correct ? `✅ Correct!\nYou selected ${optionText}` : `❌ Wrong.\nYou selected ${optionText}\nCorrect answer: ${correctText}`;
      await sock.sendMessage(chat, { text: reply }, { quoted: msg });
    } catch (err) { console.error('[quiz.handleSelection]', err); }
  },

  __activeQuizzes: activeQuizzes,
  __autoQuizzes: autoQuizzes
};
