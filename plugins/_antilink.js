const isLinkHttp = /https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{22}/i
const isWhatsAppChannel = /https:\/\/whatsapp\.com\/channel\/[A-Za-z0-9?=._-]+/i

export async function before(
  m,
  { conn, isAdmin, isBotAdmin },
) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !1

  let chat = global.db.data.chats[m.chat]

  const isGroupLink = isLinkHttp.test(m.text)
  const isChannelLink = isWhatsAppChannel.test(m.text)

  function cek(grup1, grup2) {
    const regex = /^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9]{22}$/
    return regex.test(grup1) && regex.test(grup2) && grup1 === grup2
  }

  if (chat.antiLink && (isGroupLink || isChannelLink)) {

    let grup = await conn.groupInviteCode(m.chat)

    let gc = await cek(
      m.text,
      "https://chat.whatsapp.com/" + grup
    )

    await m.reply(
      gc
        ? "You sent this group link. You are safe!"
        : !isAdmin
          ? "*❗ Group or channel link detected*\n*Your message will be deleted and you will be removed from the group*"
          : "*📣 You are an admin, you are safe*",
    )

    await conn.delay(1000)

    if (!gc && isBotAdmin && !isAdmin) {

      await conn.sendMessage(
        m.chat,
        {
          delete: m.key,
        }
      )

      await conn.groupParticipantsUpdate(
        m.chat,
        [m.sender],
        'remove'
      )
    }
  }

  return !1
}
