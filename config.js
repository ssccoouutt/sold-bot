/**
 * Global Configuration for WhatsApp MD Bot
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['212 768-49828,'917023951514'], // Add your number without + or spaces (e.g., 919876543210)
    ownerName: ['99iv.e', 'amin'], // Owner names corresponding to ownerNumber array
    
    // Bot Configuration
    botName: '99ive bot',
    prefix: '.',
    sessionName: 'session',
    sessionID: "KnightBot!H4sIAAAAAAAAA5VUTZOiSBD9L3XVGEAQ0IiOWAQUm0ZFUIGNPZRSQCECVhUqTvjfN2inp+ewO9t7q4+Mly9fvszvoKwwRTZqwfg7qAm+QIa6I2trBMZg0iQJIqAPYsggGAPVOYbEi84h0yZ1OVqavSVFUoPOMtfglX+ahlvsk5U2FOgLePRB3ewLfPgN4HQruNnNS/kJm4tnj5N8Qz5CTPxc0Raakl/cbGqvN9xKu76AR4cIMcFlatYZOiECCxu1K4jJ1+hj64JEg0Nte4u4OHM38X0UJNay5kNun0mccJwk920QRwH/NfoqeqM0khQPrU9NcD0lUcWICcnC4l5doqy1NSdyy7C57MInfYrTEsXzGJUMs/bLusuGGcJhadzjvFWiApnQNWxrGqTYu5Y1zZVqEELEOxzvfo04TL3FNt7awYKPtzvVmvXy3mblqvsoNzK1DXqFt1lI88EFb34lviIfXjn+H90dnSkVFyVmoTnrzSysaJSow3NSoMP6QrfZVZ3nVxxU4u76Nfo4KlGvcXV1LtnybQe1g+mEqcW7E9MStvJ2uz4aotNulEL7pA9ZQ37HcnhDxmm9vdvUSV65tooW8t7Zc4629+uFKhs0VPNbLb6mNpp6eGR56/hycweZNr+egyxMlKt1zu7aQOD3t7Z61Qsmn/D15b2iI2rnMRgLjz4gKMWUEchwVXZvCt8HML546EAQe1cXFCPPsPdrp56lOq7uUb1fc/HboBlZC9GdRktOnobT05t92R1fQB/UpDogSlFsYcoq0jqIUpgiCsZ//tUHJbqxZ9+6bKLQBwkmlG3Kpi4qGH809eMTHg5VUzKvLQ96d0AEjPnPZ8QYLlPaydiUkBwyfEF6BhkF4wQWFP0sEBEUgzEjDfo5tHoVd7or9kJ0DUkHfXB67weOwRgMhIEiq7I0UNTRWOD/oN+uHSys628lYqAPimeYJA5VQRgK4khQFbWL7D4ePxl2gDFiEBcUjIG+0Ku7Uk3MxaqHqTSbaWaq6akGPiv6cMZTeuY7yqE2lNGSeovEvmqjuzR3d5SrXi9HW664UAjaVy1cTqSXfwABY3Bz7q5ssliWZ6Vpbd92au5RONvLlSOWoyupe8wd+C0yS3wrda83n2f8+tY0x50mD2c2mxZvCj213ryJdYfLitTTbUN76bLF6IIP6Ndkqs6L6uS8hEJwP+p+osjnuBWnVlDerrw/DJIdHJ7RXjSnuybY9HY726d4gkdWrxDc24jP/ddkk+dYO7Iisttp6h96efr07PvMFD92FX63U9er7ppg9D76Jew6+N+9exLvLMY/+r9g/Fgm/zKQk/3mvhRtt8f5xMyDlmqrQ083p2Ql6/uh3pxXg8VWxe7MSBF4PP7qg7qALKnIqdtwZUwqHIM+IFXTeXZeJtVvkunaZm6m6aKrvICUaZ9z4OMTogyeajAWFEUSFV6WlGfUilS1BWkGxkA8FULugcffMFegRFQHAAA=",
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
      ownerOnly: 'Sir awa t7wa 😆😆',
      adminOnly: 'n3yt 3la 99ive y7wik?🙂‍↕️',
      groupOnly: '👥 This command can only be used in groups!',
      privateOnly: '💬 This command can only be used in private chat!',
      botAdminNeeded: '🤖 pass admin t7wa',
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
  
