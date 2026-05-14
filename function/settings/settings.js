import { watchFile, unwatchFile } from 'fs'
import fs from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

/*
Setting
*/

global.setting = {
  clearSesi: false,
  clearTmp: true,
  addReply: true,
  idgc: '120363372717705714@g.us'
}

global.info = {
  nomerbot: '212786946506',
  pairingNumber: '212786946506',
  figlet: 'EMK',
  nomorwa: '212786946506',
  nameown: 'KIM SUN OO',
  nomerown: '212773608927',
  packname: 'sticker by',
  author: 'EMK',
  namebot: 'EMK',
  wm: 'EMK',
  stickpack: 'Whatsapp',
  stickauth: 'EMK',
  jid: '@s.whatsapp.net'
}

// Thumbnail

global.media = {
  ppKosong: 'https://i.ibb.co/3Fh9V6p/avatar-contact.png',
  didyou: 'https://telegra.ph/file/e40219cc8d472025f18b6.jpg',
  rulesBot: 'https://telegra.ph/file/7cd8985216ffd3c376238.jpg',
  thumbnail: 'https://i.postimg.cc/pLCHkHvm/0fc2b09b645e3f878ce39232ec3e552e.jpg',
  thumb: 'https://i.postimg.cc/pLCHkHvm/0fc2b09b645e3f878ce39232ec3e552e.jpg',
  logo: 'https://i.postimg.cc/pLCHkHvm/0fc2b09b645e3f878ce39232ec3e552e.jpg',
  unReg: 'https://telegra.ph/file/ef02d1fdd59082d05f08d.jpg',
  registrasi: 'https://i.postimg.cc/pLCHkHvm/0fc2b09b645e3f878ce39232ec3e552e.jpg',
  confess: 'https://telegra.ph/file/bfef7e33bc60dd2608ac6.jpg',
  access: 'https://telegra.ph/file/5c35d4a180b9074a9f11b.jpg',
  tqto: 'https://telegra.ph/file/221aba241e6ededad0fd5.jpg',
  spotify: 'https://telegra.ph/file/d888041549c7444f1212b.jpg',
  weather: 'https://telegra.ph/file/5b35ba4babe5e31595516.jpg',
  gempaUrl: 'https://telegra.ph/file/03e70dd45a9dc628d84c9.jpg',
  akses: 'https://telegra.ph/file/6c7b9ffbdfb0096e1db3e.jpg',
  wel: 'https://telegra.ph/file/9dbc9c39084df8691ebdd.mp4',
  good: 'https://telegra.ph/file/1c05b8c019fa525567d01.mp4',
  sound: 'https://pomf2.lain.la/f/ymca9u8.opus'
}

// Social Media

global.url = {
  sig: 'https://instagram.com/sunoovvv',
  sgh: 'https://instagram.com/sunoovvv',
  sgc: 'https://whatsapp.com/channel/0029VajvgNv30LKQQnapiq02'
}

// Donation

global.payment = {
  psaweria: 'https://saweria.co/mamad',
  ptrakterr: '-',
  pdana: '0823427570'
}

// Message Info

global.msg = {
  wait: '⏱️ PLEASE BE PATIENT\nWE ARE PROCESSING YOUR REQUEST...',
  eror: '🤖 BOT INFORMATION\nSORRY, AN ERROR OCCURRED WHILE EXECUTING THE COMMAND.'
}

// API ID

global.apiId = {
  smm: '4524',
  lapak: '300672'
}

// API KEY

global.api = {
  user: '-',
  screet: '-',
  uptime: '-',
  xyro: '-',
  lol: 'GataDiosV2',
  smm: '-',
  lapak: '-',
  prodia: '-',
  bing: 'YOUR_BING_API_KEY'
}

global.APIs = {
  xyro: 'https://api.xyroinee.xyz',
  nightTeam: 'https://api.tioxy.my.id',
  lol: 'https://api.lolhumaan.xyz',
  smm: 'https://smmnusantara.id',
  lapak: 'https://panel.lapaksosmed.com'
}

// API KEYS

global.APIKeys = {
  'https://api.xyroinee.xyz': 'vRFLiyLPWu',
  'https://api.lolhumaan.xyz': 'GataDiosV2'
}

// AUTO RELOAD

let file = fileURLToPath(import.meta.url)

watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Updated 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
