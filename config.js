/**
 * Global Configuration for WhatsApp MD Bot
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['923401809397'], // Add your number without + or spaces (e.g., 919876543210)
    ownerName: ['Anonymous'], // Owner names corresponding to ownerNumber array
    
    // Bot Configuration
    botName: 'Tech Zone',
    prefix: '.',
    sessionName: 'session',
    sessionID: 'KnightBot!H4sIAAAAAAAAA5VUXZOiOhT8L3kda0UBEaum6kZw/MAPGETBW/sQSYAoEicJIm7537dwd2b34e7W3LeQhNN9uvvkGygYFcQhNRh8A2dOL0iSZinrMwEDMCyThHDQAhhJBAbgbeQFh/GwP878XVYR19WNbZZt9u2908NhfcARo6tpdbl2q2dwb4Fzuc9p/JeC1VZ9xeHTRahXmbLdbBfr7W0dTfSSOyfLW0zIzsZbw9nU4hncm4qIclqko3NGToSj3CG1iyj/HP3UZnO7yruj8UU4w8mKHC9HsQ9ExdZVZAaK684LeHjR54H3Ofp53LPC2KHtzVPv5aTKt7drUh3U4aQmnSLSj8EEYuu839F08YO+oGlB8BSTQlJZf1r3aNU1bEZP1kue4p1z6SOHTde9S/v16bqFWTTFXsmOmPmn6HPEbyeT8bW8hH4IvRBHbSp3Uy4yphvaTE13joi2q4hw3gl+J+7y96wc/4/uo4WyKO2oQqleDKtRXew2Jp7bNjeitq+P42Wky7I2y3rLPkefd8buJK9W3SkZ5/AIl2Jy0KucLW2vwpYoOmGPKof56+6U/qKPZMn/xrIauXs4O85edSX153WF9rWmtb2FSdbmNjafSm2VSY8u655H5Nx5a3e35XCTzsKVPR6iIdRDZ6zaxeqF0GF1OFwty9hY3vOjoyOppxgMOvcW4CSlQnIkKSsee6reAghffBJzIh/yguNImyrwzbgRZ5TPyDw5WbrpLDehjLFmFplRO9w3xn1osGfQAmfOYiIEwRMqJOP1ggiBUiLA4N+vLVCQq/xhXAPX76gtkFAuZFCU55wh/G7rxymKY1YW0q+L2GoWhIOB8mubSEmLVDRKlgXicUYvxMqQFGCQoFyQjx4JJxgMJC/Jx9xaDDfSzztRx93tVNACp4clFIMBMLuqpnT6iqmaxqCv/CO+VE1ZdD5/KYgELZA/rnU1o69raldXNLWr9JubzcH9g2FTEBOJaC7AAFhL3z+ogZeJrXpLowjWEDoQNrq9d/Qejh/iF2SIVfR6zVajtnJ0g3Qy9DZumJLJMlJsVtCLXt6Yjj0r+K8iYADwOI3KujfxvbDkKiSj1I/7I1q62slzE+X22vdWjq3t3dwTcLVOLilnSCabLp0mN2+9WR1He2sx3/gLQdxwZsDrC7Hgc4OGyYXG5HewdPxii70dhz5+XZmwnopcg/55JxI5zKxbLwk2WoqetKO5d8o2FAHy4fWw5G5ldQwmjLOyvuhGmiYl3hLKgmSyaMOfsX2MTf7zuaKPQDVeNZ8JJY/pL1Dj4J9MeSfcZEu5t3779+c78odZHO7UNMTdYxytM9ec2Z3psApe1h1tkt22S9ibafxpL3qrMIA5uN+/tsA5RzJh/AQGABWYswc4Z2WT1WmRsL+AWTDw4BXCpuMcCQl/5X9NT0RIdDqDQccw9I6i6Lpx/w7lo3ePNwcAAA==',
    newsletterJid: '120363304414452603@newsletter', // Newsletter JID for menu forwarding
    
    // Sticker Configuration
    packname: 'Tech Zone',
    
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
};
  
