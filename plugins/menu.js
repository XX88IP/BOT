import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, args }) => {

  const cmd = args[0] || 'list'
  let type = (args[0] || '').toLowerCase()
  let _menu = global.db.data.settings[conn.user.jid]

  let d = new Date(new Date() + 3600000)
  let locale = 'id'

  let week = d.toLocaleDateString(locale, {
    weekday: 'long'
  })

  let date = d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const tagCount = {}
  const tagHelpMapping = {}

  Object.keys(global.plugins)
    .filter(plugin => !global.plugins[plugin].disabled)
    .forEach(plugin => {

      const tagsArray = Array.isArray(global.plugins[plugin].tags)
        ? global.plugins[plugin].tags
        : []

      if (tagsArray.length > 0) {

        const helpArray = Array.isArray(global.plugins[plugin].help)
          ? global.plugins[plugin].help
          : [global.plugins[plugin].help]

        tagsArray.forEach(tag => {

          if (tag) {

            if (tagCount[tag]) {

              tagCount[tag]++
              tagHelpMapping[tag].push(...helpArray)

            } else {

              tagCount[tag] = 1
              tagHelpMapping[tag] = [...helpArray]

            }

          }

        })

      }

    })

  let isiMenu = []

  Object.entries(tagCount).map(([key, value]) =>
    isiMenu.push({
      header: `${key.toUpperCase()} MENU`,
      title: `special commands ${key.toLowerCase()}`,
      description: `${value} commands`,
      id: `.menu ${key}`,
    })
  )

  const datas = {
    title: "ℂ𝕃𝕀ℂ𝕂 ℍ𝔼ℝ𝔼",
    sections: [
      {
        title: "ALL COMMANDS",
        highlight_label: "FEATURES",
        rows: [
          {
            header: "MAIN MENU",
            title: "show all commands",
            description: "display all bot features",
            id: ".menu all",
          }
        ],
      },
      {
        title: "COMMAND LIST",
        highlight_label: "MENU",
        rows: [...isiMenu]
      },
      {
        title: "BOT INFO",
        highlight_label: "INFO",
        rows: [
          {
            header: "SCRIPT",
            title: "bot script",
            description: "",
            id: ".sc",
          },
          {
            header: "OWNER",
            title: "bot owner",
            description: "",
            id: ".owner",
          },
          {
            header: "FEATURES",
            title: "total features",
            description: "",
            id: ".totalfitur",
          },
          {
            header: "SPEED",
            title: "response speed",
            description: "",
            id: ".os",
          }
        ]
      }
    ]
  }

  let objek = Object.values(db.data.stats).map(v => v.success)

  let totalHit = 0

  for (let b of objek) {
    totalHit += b
  }

  let help = Object.values(global.plugins)
    .filter(plugin => !plugin.disabled)
    .map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })

  let data = db.data.users[m.sender]
  let fitur = Object.values(plugins).filter(v => v.help).map(v => v.help).flat(1)
  let tUser = Object.keys(db.data.users).length
  let userReg = Object.values(global.db.data.users).filter(user => user.registered == true).length

  let headers = `_~👋🏻 I'M EMK, YOUR SMART WHATSAPP BOT~_\n`

  if (cmd === 'list') {

    const daftarTag = Object.keys(tagCount)
      .sort()
      .join('\n│※ ' + usedPrefix + command + '  ')

    const more = String.fromCharCode(8206)
    const readMore = more.repeat(4001)

    let _mpt

    if (process.send) {

      process.send('uptime')

      _mpt = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000

    }

    let mpt = clockString(_mpt)

    let name = m.pushName || conn.getName(m.sender)

    let list = `${headers}${readMore}
╭──「 LIST MENU 」
│※ ${usedPrefix + command} all
│※ ${daftarTag}
╰──────────•`

    if (_menu.image) {

      conn.sendMessage(m.chat, {
        image: fs.readFileSync('./menu.jpg'),
        caption: list
      }, { quoted: m })

    } else if (_menu.gif) {

      conn.sendMessage(m.chat, {
        video: {
          url: "https://telegra.ph/file/ca2d038b71ff86e2c70d3.mp4"
        },
        gifPlayback: true,
        caption: list,
        jpegThumbnail: fs.readFileSync('./menu.jpg'),
        contextInfo: {
          externalAdReply: {
            title: namebot,
            body: 'M E N U',
            sourceUrl: sgc,
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnail: fs.readFileSync('./menu.jpg')
          }
        }
      }, { quoted: m })

    } else if (_menu.teks) {

      conn.reply(m.chat, list, m)

    } else if (_menu.doc) {

      conn.sendMessage(m.chat, {
        document: fs.readFileSync("./package.json"),
        fileName: namebot,
        fileLength: new Date(),
        pageCount: "2024",
        caption: list,
        jpegThumbnail: fs.readFileSync('./menu.jpg'),
        contextInfo: {
          externalAdReply: {
            containsAutoReply: true,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: sgc,
            thumbnail: fs.readFileSync('./menu.jpg'),
            title: `${date}`,
            body: '',
          },
        },
      }, { quoted: m })

    } else if (_menu.button) {

      conn.sendListImageButton(
        m.chat,
        `${headers}`,
        datas,
        '_BY KIM SUN OO_',
        './menu.jpg'
      )

    }

  }

}

handler.help = ['menu']
handler.command = ['menu']
handler.register = false

export default handler

function clockString(ms) {

  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60

  return [h, m, s]
    .map(v => v.toString().padStart(2, 0))
    .join(':')

}
