import './function/settings/settings.js'
import { watchFile, unwatchFile } from 'fs'
import fs from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

// Owner
global.owner = [
  ['212773608927', 'KIM SUN OO', true]
]

global.mods = []
global.prems = []
global.multiplier = 69

global.rpg = {
  emoticon(string) {
    string = string.toLowerCase()

    const emot = {
      agility: '🤸‍♂️',
      arc: '🏹',
      armor: '🥼',
      bank: '🏦',
      bibitanggur: '🍇',
      bibitapel: '🍎',
      bibitjeruk: '🍊',
      bibitmangga: '🥭',
      bibitpisang: '🍌',
      bow: '🏹',
      bull: '🐃',
      cat: '🐈',
      chicken: '🐓',
      common: '📦',
      cow: '🐄',
      crystal: '🔮',
      darkcrystal: '♠️',
      diamond: '💎',
      dog: '🐕',
      dragon: '🐉',
      elephant: '🐘',
      emerald: '💚',
      exp: '✉️',
      fishingrod: '🎣',
      fox: '🦊',
      gems: '🍀',
      giraffe: '🦒',
      gold: '👑',
      health: '❤️',
      horse: '🐎',
      intelligence: '🧠',
      iron: '⛓️',
      keygold: '🔑',
      keyiron: '🗝️',
      knife: '🔪',
      legendary: '🗃️',
      level: '🧬',
      limit: '🌌',
      lion: '🦁',
      magicwand: '⚕️',
      mana: '🪄',
      money: '💵',
      mythic: '🗳️',
      pet: '🎁',
      petFood: '🍖',
      pickaxe: '⛏️',
      pointxp: '📧',
      potion: '🥤',
      rock: '🪨',
      snake: '🐍',
      stamina: '⚡',
      strength: '🦹‍♀️',
      string: '🕸️',
      superior: '💼',
      sword: '⚔️',
      tiger: '🐅',
      trash: '🗑️',
      uncommon: '🎁',
      upgrader: '🧰',
      wood: '🪵'
    }

    const results = Object.keys(emot)
      .map(v => [v, new RegExp(v, 'gi')])
      .filter(v => v[1].test(string))

    if (!results.length) return ''
    return emot[results[0][0]]
  }
}

// =========================
// INFORMATION
// =========================

global.info = {
  nomerbot: '212000000000',
  pairingNumber: '212000000000',
  nomorwa: '212000000000',
  nameown: 'KIM SUN OO',
  nomerown: '212773608927',
  packname: 'EMK',
  author: 'EMK Bot',
  namebot: 'EMK',
  wm: 'EMK WhatsApp Bot',
  stickpack: 'EMK',
  stickauth: 'KIM SUN OO'
}

// =========================
// MEDIA
// =========================

global.media = {
  ppKosong: '',
  didyou: '',
  rulesBot: '',
  thumbnail: '',
  thumb: '',
  logo: '',
  unReg: '',
  registrasi: '',
  confess: '',
  access: '',
  tqto: '',
  spotify: '',
  weather: '',
  gempaUrl: '',
  akses: '',
  wel: '',
  good: ''
}

// =========================
// URL
// =========================

global.url = {
  sig: '',
  sgh: '',
  sgc: ''
}

// =========================
// PAYMENT
// =========================

global.payment = {
  pdana: '08123456789'
}

// =========================
// MESSAGE
// =========================

global.msg = {
  wait: '⏳ Please wait...',
  eror: '❌ An error occurred'
}

// =========================
// API
// =========================

global.api = {
  uptime: 'https://example.com',
  xyro: 'https://example.com',
  lol: 'https://example.com'
}

// =========================
// GLOBAL ASSIGN
// =========================

global.nomerbot = global.info.nomerbot
global.pairingNumber = global.info.pairingNumber
global.nomorwa = global.info.nomorwa
global.nameown = global.info.nameown
global.nomerown = global.info.nomerown
global.packname = global.info.packname
global.author = global.info.author
global.namebot = global.info.namebot
global.wm = global.info.wm
global.stickpack = global.info.stickpack
global.stickauth = global.info.stickauth

global.ppKosong = global.media.ppKosong
global.didyou = global.media.didyou
global.rulesBot = global.media.rulesBot
global.thumbnail = global.media.thumbnail
global.thumb = global.media.thumb
global.logo = global.media.logo
global.unReg = global.media.unReg
global.registrasi = global.media.registrasi
global.confess = global.media.confess
global.access = global.media.access
global.tqto = global.media.tqto
global.spotify = global.media.spotify
global.weather = global.media.weather
global.gempaUrl = global.media.gempaUrl
global.akses = global.media.akses
global.wel = global.media.wel
global.good = global.media.good

global.sig = global.url.sig
global.sgh = global.url.sgh
global.sgc = global.url.sgc

global.pdana = global.payment.pdana

global.wait = global.msg.wait
global.eror = global.msg.eror

global.uptime = global.api.uptime
global.xyro = global.api.xyro
global.lol = global.api.lol

// =========================
// AUTO RELOAD
// =========================

const file = fileURLToPath(import.meta.url)

watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Updated 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
