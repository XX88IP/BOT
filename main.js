import { EventEmitter } from 'events'
EventEmitter.setMaxListeners(0)

import './config.js'
import './function/settings/settings.js'

import path, { join } from 'path'
import { platform } from 'process'
import chalk from 'chalk'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix
    ? /file:\/\/\//.test(pathURL)
      ? fileURLToPath(pathURL)
      : pathURL
    : pathToFileURL(pathURL).toString()
}

global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true))
}

global.__require = function require(dir = import.meta.url) {
  return createRequire(dir)
}

import * as ws from 'ws'

import {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  readFileSync,
  watch
} from 'fs'

import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import os from 'os'
import Pino from 'pino'
import { format } from 'util'

import {
  makeWASocket,
  protoType,
  serialize
} from './lib/simple.js'

import { Low } from 'lowdb'
import fs from 'fs'
import { JSONFile } from 'lowdb/node'

import storeSys from './lib/store2.js'
const store = storeSys.makeInMemoryStore()

const {
  DisconnectReason,
  useMultiFileAuthState,
  MessageRetryMap,
  jidNormalizedUser
} = await (await import('@adiwajshing/baileys')).default

global.func = (await import('./function/system/function.js'))

import Spinnies from 'spinnies'
const spinnies = new Spinnies()

import readline from 'readline'
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (text) => new Promise((resolve) => rl.question(text, resolve))

import NodeCache from 'node-cache'

const msgRetryCounterCache = new NodeCache()

const { chain } = lodash

protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) =>
  (name in global.APIs ? global.APIs[name] : name) +
  path +
  (query || apikeyqueryname
    ? '?' +
      new URLSearchParams(
        Object.entries({
          ...query,
          ...(apikeyqueryname
            ? {
                [apikeyqueryname]:
                  global.APIKeys[name in global.APIs ? global.APIs[name] : name]
              }
            : {})
        })
      )
    : '')

global.timestamp = {
  start: new Date()
}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(
  yargs(process.argv.slice(2)).exitProcess(false).parse()
)

global.prefix = new RegExp(
  '^[' +
    (opts['prefix'] || '!./#\\').replace(
      /[|\\{}()[\]^$+*?.\-\^]/g,
      '\\$&'
    ) +
    ']'
)

global.db = new Low(
  new JSONFile(
    `${opts._[0] ? opts._[0] + '_' : ''}database.json`
  )
)

global.DATABASE = global.db

global.loadDatabase = async function loadDatabase() {
  if (global.db.READ)
    return new Promise((resolve) =>
      setInterval(async function () {
        if (!global.db.READ) {
          clearInterval(this)
          resolve(
            global.db.data == null
              ? await global.loadDatabase()
              : global.db.data
          )
        }
      }, 1000)
    )

  if (global.db.data !== null) return

  global.db.READ = true

  await global.db.read().catch(console.error)

  global.db.READ = null

  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    menfess: {},
    simulator: {},
    ...(global.db.data || {})
  }

  global.db.chain = chain(global.db.data)
}

loadDatabase()

let { state, saveCreds } = await useMultiFileAuthState(
  path.resolve('./sessions')
)

const connectionOptions = {
  pairingCode: true,

  logger: Pino({
    level: 'silent'
  }),

  auth: state,

  browser: ['EMK', 'Chrome', '1.0.0'],

  getMessage: async (key) => {
    let jid = jidNormalizedUser(key.remoteJid)
    let msg = await store.loadMessage(jid, key.id)
    return msg?.message || ''
  },

  msgRetryCounterCache,

  connectTimeoutMs: 60000,
  defaultQueryTimeoutMs: 0,
  keepAliveIntervalMs: 10000,
  generateHighQualityLinkPreview: true,
  syncFullHistory: true,
  markOnlineOnConnect: true
}

global.conn = makeWASocket(connectionOptions)

conn.isInit = false

if (!conn.authState.creds.registered) {
  let phoneNumber = global.pairingNumber || ''

  phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

  if (!phoneNumber) {
    phoneNumber = await question('Enter your WhatsApp number: ')
  }

  spinnies.add('pair', {
    text: `Pairing Number: ${phoneNumber}`,
    color: 'blue'
  })

  setTimeout(async () => {
    try {
      let code = await conn.requestPairingCode(phoneNumber)

      code = code?.match(/.{1,4}/g)?.join('-') || code

      spinnies.succeed('pair', {
        text: `Your Pairing Code: ${code}`,
        successColor: 'white'
      })
    } catch (e) {
      spinnies.fail('pair', {
        text: `Failed: ${e.message}`,
        failColor: 'red'
      })
    }
  }, 3000)
}

if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data)
        await global.db.write().catch(console.error)
    }, 2000)
  }
}

async function connectionUpdate(update) {
  const {
    connection,
    lastDisconnect,
    isNewLogin
  } = update

  global.stopped = connection

  if (isNewLogin) conn.isInit = true

  const code =
    lastDisconnect?.error?.output?.statusCode ||
    lastDisconnect?.error?.output?.payload?.statusCode

  if (
    code &&
    code !== DisconnectReason.loggedOut &&
    conn?.ws.readyState !== ws.default.CONNECTING
  ) {
    console.log(await global.reloadHandler(true).catch(console.error))
    global.timestamp.connect = new Date()
  }

  if (global.db.data == null) loadDatabase()

  if (connection === 'open') {
    const deviceName = os.hostname()

    const message = `• INFORMATION : THE BOT IS ACTIVE

◦ PLATFORM : ${os.platform()} ${os.release()}
◦ DEVICE : ${deviceName}
◦ BOT NAME : ${global.namebot}
◦ CONNECTED TIME : ${new Date().toLocaleString()}

> WHATSAPP CHANNEL:
https://whatsapp.com/channel/0029VajvgNv30LKQQnapiq02`

    await conn.sendMessage(global.nomerown + '@s.whatsapp.net', {
      text: message
    })

    console.log(
      chalk.bgGreen(chalk.white('The bot is already active'))
    )
  }

  if (connection === 'close') {
    console.log(
      chalk.yellow(
        '📡 Connection lost from server, reconnect again.'
      )
    )
  }
}

process.on('uncaughtException', console.error)

let isInit = true

let handler = await import('./handler.js')

global.reloadHandler = async function (restartConn) {
  try {
    const Handler = await import(
      `./handler.js?update=${Date.now()}`
    ).catch(console.error)

    if (Object.keys(Handler || {}).length)
      handler = Handler
  } catch (e) {
    console.error(e)
  }

  if (restartConn) {
    try {
      global.conn.ws.close()
    } catch {}
  }

  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('group-participants.update', conn.participantsUpdate)
    conn.ev.off('groups.update', conn.groupsUpdate)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  conn.welcome =
    'Welcome @user to @subject'

  conn.bye =
    'Goodbye @user'

  conn.handler = handler.handler.bind(global.conn)
  conn.participantsUpdate =
    handler.participantsUpdate.bind(global.conn)

  conn.groupsUpdate =
    handler.groupsUpdate.bind(global.conn)

  conn.connectionUpdate =
    connectionUpdate.bind(global.conn)

  conn.credsUpdate =
    saveCreds.bind(global.conn)

  conn.ev.on('messages.upsert', conn.handler)

  conn.ev.on(
    'group-participants.update',
    conn.participantsUpdate
  )

  conn.ev.on('groups.update', conn.groupsUpdate)

  conn.ev.on(
    'connection.update',
    conn.connectionUpdate
  )

  conn.ev.on('creds.update', conn.credsUpdate)

  isInit = false

  return true
}

const pluginFolder = global.__dirname(
  join(__dirname, './plugins/index')
)

const pluginFilter = (filename) => /\.js$/.test(filename)

global.plugins = {}

async function filesInit() {
  for (const filename of readdirSync(pluginFolder).filter(
    pluginFilter
  )) {
    try {
      const file = global.__filename(
        join(pluginFolder, filename)
      )

      const module = await import(file)

      global.plugins[filename] =
        module.default || module
    } catch (e) {
      console.error(e)
      delete global.plugins[filename]
    }
  }
}

filesInit().catch(console.error)

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(
      join(pluginFolder, filename),
      true
    )

    if (filename in global.plugins) {
      if (existsSync(dir))
        console.log(`Updated Plugin - '${filename}'`)
      else {
        console.log(`Deleted Plugin - '${filename}'`)
        return delete global.plugins[filename]
      }
    }

    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    })

    if (err)
      console.error(
        `Syntax error while loading '${filename}'\n${format(err)}`
      )
    else {
      try {
        const module = await import(
          `${global.__filename(dir)}?update=${Date.now()}`
        )

        global.plugins[filename] =
          module.default || module
      } catch (e) {
        console.error(e)
      }
    }
  }
}

Object.freeze(global.reload)

watch(pluginFolder, global.reload)

await global.reloadHandler()

function clearTmp() {
  const tmp = [tmpdir(), join(__dirname, './tmp')]
  const filename = []

  tmp.forEach((dirname) =>
    readdirSync(dirname).forEach((file) =>
      filename.push(join(dirname, file))
    )
  )

  return filename.map((file) => {
    const stats = statSync(file)

    if (
      stats.isFile() &&
      Date.now() - stats.mtimeMs >= 300000
    ) {
      return unlinkSync(file)
    }

    return false
  })
}

setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return

  if (setting.clearTmp === true) {
    await clearTmp()

    console.log(
      chalk.cyanBright(
        `Tmp cleared successfully`
      )
    )
  }
}, 120 * 60 * 1000)

(await import('./function/system/schedule.js')).schedule(
  db,
  conn
)
