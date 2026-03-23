/**
 * Slow Mode Utility - Track per-group user message cooldowns
 */

// Map<groupId, Map<userId, lastMessageTimestamp>>
const cooldowns = new Map();

/**
 * Check whether a user is on slow-mode cooldown.
 * If the user is NOT on cooldown, their timestamp is updated automatically.
 *
 * @param {string} groupId   - WhatsApp group JID
 * @param {string} userId    - Sender JID
 * @param {number} cooldownMs - Cooldown duration in milliseconds
 * @returns {{ onCooldown: boolean, remainingSecs?: number }}
 */
const checkSlowMode = (groupId, userId, cooldownMs) => {
  if (!cooldowns.has(groupId)) {
    cooldowns.set(groupId, new Map());
  }

  const groupCooldowns = cooldowns.get(groupId);
  const now = Date.now();
  const lastMessage = groupCooldowns.get(userId) || 0;
  const elapsed = now - lastMessage;

  if (elapsed < cooldownMs) {
    return {
      onCooldown: true,
      remainingSecs: Math.ceil((cooldownMs - elapsed) / 1000)
    };
  }

  // Not on cooldown – record this message timestamp
  groupCooldowns.set(userId, now);
  return { onCooldown: false };
};

/**
 * Remove a single user's cooldown entry (e.g. when they are promoted to admin).
 */
const clearUserCooldown = (groupId, userId) => {
  if (cooldowns.has(groupId)) {
    cooldowns.get(groupId).delete(userId);
  }
};

/**
 * Remove all cooldown entries for a group (e.g. when slowmode is disabled).
 */
const clearGroupCooldowns = (groupId) => {
  cooldowns.delete(groupId);
};

module.exports = { checkSlowMode, clearUserCooldown, clearGroupCooldowns };
