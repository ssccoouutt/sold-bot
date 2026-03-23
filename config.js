/**
 * Global Configuration for WhatsApp MD Bot
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['91xxxxxxxxxxx','917023951514'], // Add your number without + or spaces (e.g., 919876543210)
    ownerName: ['Knight Bot Mini', 'Professor'], // Owner names corresponding to ownerNumber array
    
    // Bot Configuration
    botName: 'Knight Bot Mini',
    prefix: '.',
    sessionName: 'session',
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VU2bKiSBT8l3rVaGVRlogb0YAbIAKu4EQ/lFBCKZtFoUKH/z6B9r23H2Z67rwVh4o8eTLz1E+Q5bhEJqqB/BMUBF8hRe2R1gUCMlCr4xER0AUhpBDIwBqz8C44o8VWFxeXIdb6yDlvFleP2yBh5wfeadS5OpSR+v4beHRBUR0SHPwBcH3kqmaZbG98Yg+wjkVmabh9jvdq1+dG/jkOivuINe85vr2BR4sIMcFZNC5ilCICExPVDsTka/T7VsbZi/vRIk0nx5eFNhKOHp33e4aL6vtenR4blxqH6447f40+Ejwc7OOlX7oHszwkdbJk51ljeQVkmkoL9naQ3i1XZ2r3Rb/EUYZCPUQZxbT+su78xKpPNI2HuYEr1xDYwyXlocr5h95eSpXRrR9qV9zLoln5NeJU2EoDw5dqOGQaOLsXdba54vM06BtNhz1Ayw5MdW+pHjP+nbhD3rNy/j+6Ww6y1emN32YHgbBukZvjubcIwwaeQzU2yCqL7d2YSevzF3UverNLSpUTj6QJw2qTeakMBpRreMe1GS8azI7bsp6ayX2mfNKHtCJ/YmmONGvi9k/6fBuVmZSy/Fpz1X6dWFzMiHquQNE3/NAuoRBcFnFn1Ujz1Wq0isypuLNjbnLu3/aSna90+2QTnFgjXtKit+dEZ1TrIZCZRxcQFOGSEkhxnrU1adAFMLyuUEAQfaoL4pnvbW1e9PCaNN5qf9kvXTYiBXSXUmcblOc7kzpk3NsE1hvogoLkASpLFM5wSXNSW6gsYYRKIP/1owsydKcv39puHNMFR0xKusmqIslh+G7q+08YBHmV0VWdBVp7QATI/c8yohRnUdnKWGWQBDG+Ii2GtATyESYl+hgQERQCmZIKfSytloet7jPf8YamOAVdkD79wCGQAcuwwlAc8qwgSjLzvfx2a1FhUXzLEAVdkLxu8dxAZJgBw0mMKIgy872tPz74tXAhohAnJZCBZqG8EXJ1rEM+DvjpVBlHihYp4HOe91y8hKdrSwiKkSDZ5WpxNG+K1PC6uyt7uXE9m8O85zNebSi+rfJv/wACZOBIrjohqr3ZTu6WOceaU90cJ+SQ2LCptItdL9gk4kUwTovzytVHbm8yWeCTs1g0t3XlSjrH38cuNEwrdJOTivY91XuGqAtCdMUB+r0ZjNeOtN+MSYe/MvfjyN4mRbLx9SnpmPEqSNe3zfTCmxyuivF8dTUyB/OGPnRH8VJdRaq39K+s4uKdv5n3cLbj3LXLKMorsc+NSX69VPgZptap9vOI0XPxM9j695/OvXi3+eo/ur9B/HpJ/mUb1cOmsTnT7fTWZHzy6lJxgo42nhBnqB0GWnVx2MVWxO50FCHwePzogiKB9JiTtBUmC0mOQ9AFJK/awOrZMf9DM03Z6OMoWrSDJ7CkyucSrHGKSgrTAsiMIPCsIA2l/uuWQ/JiBssYyIAx+XjGg8ffgYKaOFEHAAA=',
    newsletterJid: '120363161513685998@newsletter', // Newsletter JID for menu forwarding
    updateZipUrl: 'https://github.com/mruniquehacker/KnightBot-Mini/archive/refs/heads/main.zip', // URL to latest code zip for .update command
    
    // Sticker Configuration
    packname: 'Knight Bot Mini',
    
    // Bot Behavior
    selfMode: false, // Private mode - only owner can use commands
    autoRead: false,
    autoTyping: false,
    autoBio: false,
    autoSticker: false,
    autoReact: false,
    autoReactMode: 'bot', // set bot or all via cmd
    autoDownload: false,
    
    // Group Settings Defaults
    defaultGroupSettings: {
      antilink: false,
      antilinkAction: 'delete', // 'delete', 'kick', 'warn'
      antitag: false,
      antitagAction: 'delete',
      antiall: false, // Owner only - blocks all messages from non-admins
      antiviewonce: false,
      antibot: false,
      anticall: false, // Anti-call feature
      antigroupmention: false, // Anti-group mention feature
      antigroupmentionAction: 'delete', // 'delete', 'kick'
      welcome: false,
      welcomeMessage: '╭╼━≪•𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁•≫━╾╮\n┃𝚆𝙴𝙻𝙲𝙾𝙼𝙴: @user 👋\n┃Member count: #memberCount\n┃𝚃𝙸𝙼𝙴: time⏰\n╰━━━━━━━━━━━━━━━╯\n\n*@user* Welcome to *@group*! 🎉\n*Group 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽*\ngroupDesc\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ botName*',
      goodbye: false,
      goodbyeMessage: 'Goodbye @user 👋 We will never miss you!',
      antiSpam: false,
      antidelete: false,
      nsfw: false,
      detect: false,
      chatbot: false,
      autosticker: false // Auto-convert images/videos to stickers
    },
    
    // API Keys (add your own)
    apiKeys: {
      // Add API keys here if needed
      openai: '',
      deepai: '',
      remove_bg: ''
    },
    
    // Message Configuration
    messages: {
      wait: '⏳ Please wait...',
      success: '✅ Success!',
      error: '❌ Error occurred!',
      ownerOnly: '👑 This command is only for bot owner!',
      adminOnly: '🛡️ This command is only for group admins!',
      groupOnly: '👥 This command can only be used in groups!',
      privateOnly: '💬 This command can only be used in private chat!',
      botAdminNeeded: '🤖 Bot needs to be admin to execute this command!',
      invalidCommand: '❓ Invalid command! Type .menu for help'
    },
    
    // Timezone
    timezone: 'Asia/Kolkata',
    
    // Limits
    maxWarnings: 3,
    
    // Social Links (optional)
    social: {
      github: 'https://github.com/mruniquehacker',
      instagram: 'https://instagram.com/yourusername',
      youtube: 'http://youtube.com/@mr_unique_hacker'
    }
};
  
