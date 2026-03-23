// commands/fun/quiz.js
// Simple interactive quiz command using WhatsApp List messages.
// Usage: .quiz  (sends a sample 4-option quiz to the chat)

const activeQuizzes = new Map(); // key: `${chatJid}:${qid}` => { correct, question, options }

module.exports = {
  name: 'quiz',
  description: 'Sends an interactive quiz (list) and handles answers',
  ownerOnly: false,
  groupOnly: false,

  // Called when user runs the command: .quiz
  execute: async (sock, msg, args, ctx) => {
    const from = ctx.from;
    const qid = Date.now().toString();

    // Example question (you can later modify to accept custom questions)
    const question = 'In which case acceleration is zero but velocity is not zero?';
    const options = [
      { id: 'A', title: 'A) Free fall' },
      { id: 'B', title: 'B) Uniform motion' },
      { id: 'C', title: 'C) Circular motion' },
      { id: 'D', title: 'D) Projectile motion' }
    ];

    const correct = 'B'; // Uniform motion

    // Store active quiz state (keeps multiple quizzes per chat if needed)
    activeQuizzes.set(`${from}:${qid}`, { correct, question, options, askedBy: ctx.sender, createdAt: Date.now() });

    // Build list message sections/rows
    const rows = options.map(opt => ({ id: `quiz_${qid}_${opt.id}`, title: opt.title }));
    const sections = [{ title: 'Options', rows }];

    const listMessage = {
      interactive: {
        type: 'list',
        header: { type: 'text', text: 'Question (JEE Main 2023)' },
        body: { text: question },
        footer: { text: 'Anonymous Quiz' },
        action: {
          button: 'Choose option',
          sections
        }
      }
    };

    try {
      await sock.sendMessage(from, listMessage);
    } catch (err) {
      console.error('[quiz.execute] Failed to send list message:', err);
      await sock.sendMessage(from, { text: 'Failed to send quiz. Try again later.' });
    }
  },

  // Called by handler when a list selection arrives
  handleSelection: async (sock, msg, selectedRowId) => {
    try {
      // selectedRowId format: quiz_<qid>_<choice>
      const m = String(selectedRowId).match(/^quiz_(\d+)_(A|B|C|D)$/);
      if (!m) return; // Not a quiz selection

      const qid = m[1];
      const choice = m[2];
      const chat = msg.key.remoteJid;
      const key = `${chat}:${qid}`;
      const state = activeQuizzes.get(key);

      if (!state) {
        await sock.sendMessage(chat, { text: 'This quiz has expired or is not recognized.' }, { quoted: msg });
        return;
      }

      const correct = state.correct;
      const optionText = state.options.find(o => o.id === choice)?.title || choice;
      const correctText = state.options.find(o => o.id === correct)?.title || correct;

      let reply;
      if (choice === correct) {
        reply = `✅ Correct!\nYou selected ${optionText}`;
      } else {
        reply = `❌ Wrong.\nYou selected ${optionText}\nCorrect answer: ${correctText}`;
      }

      // Reply to the user who selected (quote their selection message)
      await sock.sendMessage(chat, { text: reply }, { quoted: msg });

      // Optionally keep quiz active to let others answer. If you want one-answer-per-user
      // or disable after first answer, uncomment the following line to remove active quiz:
      // activeQuizzes.delete(key);

    } catch (err) {
      console.error('[quiz.handleSelection] Error handling selection:', err);
    }
  },

  // expose map for debugging/testing if needed
  __activeQuizzes: activeQuizzes
};