/**
 * Slowmode Command - Enable/disable and configure per-group slow mode
 */

const database = require('../../database');
const { clearGroupCooldowns } = require('../../utils/slowMode');

module.exports = {
  name: 'slowmode',
  aliases: ['slow'],
  category: 'admin',
  description: 'Configure slow mode (message cooldown) for the group',
  usage: '.slowmode <on/off/set <seconds>/get>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: false,

  async execute(sock, msg, args, extra) {
    try {
      if (!args[0]) {
        const settings = database.getGroupSettings(extra.from);
        const status = settings.slowmode ? 'ON' : 'OFF';
        const cooldown = settings.slowmodeCooldown || 30;
        return extra.reply(
          `🐢 *Slow Mode Status*\n\n` +
          `Status: *${status}*\n` +
          `Cooldown: *${cooldown} seconds*\n\n` +
          `Usage:\n` +
          `  .slowmode on\n` +
          `  .slowmode off\n` +
          `  .slowmode set <seconds>\n` +
          `  .slowmode get`
        );
      }

      const opt = args[0].toLowerCase();

      if (opt === 'on') {
        if (database.getGroupSettings(extra.from).slowmode) {
          return extra.reply('🐢 *Slow mode is already ON*');
        }
        database.updateGroupSettings(extra.from, { slowmode: true });
        const cooldown = database.getGroupSettings(extra.from).slowmodeCooldown || 30;
        return extra.reply(`🐢 *Slow mode has been turned ON*\n\nCooldown: *${cooldown} seconds* between messages per user.\n\nAdmins and bot owner are exempt.`);
      }

      if (opt === 'off') {
        database.updateGroupSettings(extra.from, { slowmode: false });
        clearGroupCooldowns(extra.from);
        return extra.reply('🐢 *Slow mode has been turned OFF*');
      }

      if (opt === 'set') {
        if (!args[1]) {
          return extra.reply('*Please specify cooldown in seconds: .slowmode set <seconds>*');
        }

        const seconds = parseInt(args[1], 10);
        if (isNaN(seconds) || seconds < 1) {
          return extra.reply('*Invalid value. Cooldown must be a positive number of seconds.*');
        }
        if (seconds > 3600) {
          return extra.reply('*Maximum cooldown is 3600 seconds (1 hour).*');
        }

        database.updateGroupSettings(extra.from, {
          slowmodeCooldown: seconds,
          slowmode: true // Auto-enable when setting cooldown
        });
        clearGroupCooldowns(extra.from); // Reset existing cooldowns for fresh start
        return extra.reply(`🐢 *Slow mode cooldown set to ${seconds} seconds*\nSlow mode has been enabled.`);
      }

      if (opt === 'get') {
        const settings = database.getGroupSettings(extra.from);
        const status = settings.slowmode ? 'ON' : 'OFF';
        const cooldown = settings.slowmodeCooldown || 30;
        return extra.reply(`🐢 *Slow Mode Configuration:*\nStatus: ${status}\nCooldown: ${cooldown} seconds`);
      }

      return extra.reply('*Use .slowmode for usage information.*');

    } catch (error) {
      await extra.reply(`❌ Error: ${error.message}`);
    }
  }
};
