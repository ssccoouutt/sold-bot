/**
 * Global Configuration for WhatsApp MD Bot
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['2347079629658'], // Add your number without + or spaces (e.g., 919876543210)
    ownerName: ['✟ЄМРЄЯФЯ♆ИЦЄL҉✟'], // Owner names corresponding to ownerNumber array
    
    // Bot Configuration
    botName: '❈ℕ𝕦𝕖𝕝✡𝕊𝕖𝕟𝕥𝕚𝕟𝕖𝕝❈',
    prefix: '?',
    sessionName: 'session',
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VUa4+iSBT9L/VVM81LEJNOlocKreITRTf7oYQCS6HAqgKFif99gz09PZvsTnq/1ePm3nPPOfd+ByTHDE1QDQbfQUFxBTlqj7wuEBgAs4xjREEXRJBDMADh+OwVvm/fYjmTtMMSV5U0g2oj+HJMeuOVUUVZ47uzcBS+gkcXFOUxxeFvEr5hO5h7+Qs3Ir6YahhyxTJWPiHwXtSXs1lupmOTBFcjEF7Bo80IMcUkGRYnlCEK0wmqFxDTr8F33fXo+pYy3xsemtORzJ27efMu045CO1XNqTtG821GnU16+xp8sohKKy32sbjuOItb3MyQY/b28VuzwZul4Hh77Oqd8JTfknf4DCcERW6ECMe8/jLvroONnGZ5RhzH4cF1r06UaxA0ki6uCEFpNRZO3pHoXEq+Blw6JwaTtmTZcRUojlV1d9G212yqhHbcob5tLqD4Vt6PI/MfwBf0wyuX/8O7b5+O/fVYi1yhPu9cbVMcrwRPS3cSO5YHGRoVxzsbu9Ns9kXe529MfNv6J62Gw/5qO1tj93jDhX5KmyyYatpYKUvFb4qV+wkf8pL+DuW0CNKtJCTYDOu1XQXl+i5Dt+Bq1FyS3DqM9LNa6xFVwpUV929sreaNgWoNJ29ndjWvd+aXJ7nX2fZ9L2xsPQ7nEl6+Pju6oNqNwEB8dAFFCWacQo5z0r5JstIFMKrWKKSIP+kFhb0dLUf5Llh5lCg7FpWOJFd6ObdNYtvnSbjTgtFlPhf18BV0QUHzEDGGIgczntN6hhiDCWJg8OdfXUDQnb8L15aTxS6IMWXcJ2WR5jD6UPXjE4ZhXhK+rklotQdEwUD4fEacY5KwlseSQBqecIWsE+QMDGKYMvSzQ0RRBAaclujn1Fp51BK/Hlrj6U7dgS7InoLgqLWkrPRFSVdltS/qA1n4g327tXlhUXwjiIMuSJ9xoiz3VVWS+qqgi5LURrYfj58Q24wR4hCnDAyA5c1zPLmYw3n5IjFhPDbcxLASA3y29OGNd+6rRDSd9AVLXoCU2623mUO1KY17c/a4LZlidlILafsi9+7u678kAQOwCKvtlqS7UeE2deXuN3S5CUPDjjw0VRrU7HR/U18ncNfc9UNqzATXPRDfl53rZJwcdwsWoH5vUk14PRqP6FmVtTizWyN1QYQqHKJfi6H7voNFIVD6Lm6cgyKF6/is9m/BUJ3YeYC8w3RDWeM2kXUfXtUwkJrhUKHG3M6yg2FRbZvtfOEw82tfMfLGrPr5/mS8u/Y5NemPbYWffmrFaq8xRs/hJ7CV8AvivSNvTSY8ur8k+bFP/mMmzaPiLVe9WOHnrVzOZnO/yUqmJbNQaY5LPYkOObpGaax3wjV4PP7qgiKFPM5pBgYAkojmOAJdQPOyda1L4vw3xSzTdY0kcdvWU8i48TkJG5whxmFWgIGoaXJPU0VNfY9a0LxwIDu1aymTzSN4/A22CqtWVgcAAA==',
    newsletterJid: '120363161513685998@newsletter', // Newsletter JID for menu forwarding
    updateZipUrl: 'https://github.com/mruniquehacker/KnightBot-Mini/archive/refs/heads/main.zip', // URL to latest code zip for .update command
    
    // Sticker Configuration
    packname: 'Knight Bot Mini',
    
    // Bot Behavior
    selfMode: true, // Private mode - only owner can use commands
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
  
