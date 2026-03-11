/**
 * Global Configuration for WhatsApp MD Bot
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['255743140476','917023951514'], // Add your number without + or spaces (e.g., 919876543210)
    ownerName: ['Byte0XFF', 'Professor'], // Owner names corresponding to ownerNumber array
    
    // Bot Configuration
    botName: 'Knight Bot Mini',
    prefix: '.',
    sessionName: 'session',
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VUyZKjOBD9F11xtNnBjqiIAWy84t14mZiDDALLxgIkYcAd/vcJXF1dfZjpqbkJicx8+d7L/A5IihmaoBp0v4OM4jvkqDnyOkOgC+wiihAFLRBCDkEXTBYPC/qOKVSl5yB6IXu/GBzc3NgJ+74fCVLmTbPjLJCU+A08WyArTgkOfpMwDUeBANX67kkrYxQMjB3XbTX28uFcI1Ynt0JhokSXfO9ab+DZZISYYhL3szO6IQqTCaoXENOvwZenUej3zJ2g67uqXeTtNvGUg2jH/Aq5tRMn25yIKTowMvoafEoy3/Q8OxwfTIMoG7Mf1II/iW7jGKWyOXcCmvPzMofl9h0+wzFB4ShEhGNef5l31ZsGj2RYGGURIkXuBG3tEeeWE+rXbdJ27nm+ELQ5sYi0/RrwSgsfa1MdloT2sVcOa9mx1jQSrrRqb3p5OtX2NmmPd4+h9yvwBf3wyvX/8L72lmaV9TxhdNZMZb9xhFHUmS5WJiu5lLuGhIb3gh60ze3wNfgLVK16y7UklVnHVzExq/0RCv1prO1Z6B/6G6f0Q7w93PvBJ3zIC/o7lCh3/WN9v5aKa/P6uiUpFGXdFgd2gB7bxb5TmGR50cXK7O+CpdNG4+LiF+nYVe/TMo7tjnw0QynSSFnOQnaZq6o5vSzfXh1dUT0KQVd6tgBFMWacQo5T0tzJktYCMLyvUUARf9ELHqceZX0yeuxOtaYW+n2/Ps5WvBoc5fn4YCsslblck8VJst5AC2Q0DRBjKBxixlNae4gxGCMGun/+1QIEVfxduKacIrVAhCnjW1JkSQrDD1U/HmEQpAXh65oETnNAFHTFz2vEOSYxa3gsCKTBGd+Rc4acgW4EE4Z+dogoCkGX0wL9nFonDRvi95KhumrfBS1wewmCw2Y4Nc1QFUkVVUPvauYf7FvZpIVZ9o0gDlqAwNtLtpojsXKb6OQ9UDQ0xdAlU1REXZeb2Obh+RNzUyJEHOKEgS5wFs6mXFwH/QXmlScOBr1lbDmxBT57/DDLuxhH33bb6axT6BO/EtoXp3ZVifTn+5UvjDvFgLgze7mdt/Ute/uHJKALTm5+YV5fzIi+IyYcY+Tg2EWmcHQvUGaX4jA0loyFXjxJFGVA83jj3Lw6RDRzFLpaqf1bpYhiYewO6WQ7Ga2oeHOst6ZaiO44QL8Wm/a2Lqz28SZeuqUrwwvSdm2miJdOPLKvRbleEGEwTaaRIN6jLA9deWxbQyVZKwmE6JiLk+suF6/XvRTavd1pENGZja13G7/GKPmxvvDLYI16zWeE0Wsb/FDpP9V8B96YTny2fsnxY7/8y4zaO3+5ivRedCpwEkR3tWRnNDtWvUT0Ixydzlm1WW7d3l1IpuD5/KsFsgTyKKU30AXsdoKgBWhaNBYekSj9TSXHGo16y3jUtJ1Axq3PsdjgG2Ic3jLQlQxDkSVFVfT3vxY0zYaQnRsGBqp1K8Dzb6uLaZhkBwAA',
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
      error: ' Error occurred!',
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
  
