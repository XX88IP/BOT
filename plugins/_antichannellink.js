let before = async function (m, { conn, isAdmin, isBotAdmin }) {

  const regex = /https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+|https:\/\/whatsapp\.com\/channel\/[A-Za-z0-9]{22}/

  if (regex.test(m.text)) {

    if (isAdmin) return

    if (!isBotAdmin) return

    await conn.sendMessage(
      m.chat,
      {
        text: `⚠️ *Channel or group link detected!*\n\nMember *@${m.sender.split('@')[0]}* has been removed for violating the group rules by sending links.\n\n🚫 This action is strictly prohibited.`,
        mentions: [m.sender]
      },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      {
        delete: m.key
      }
    )

    await conn.groupParticipantsUpdate(
      m.chat,
      [m.sender],
      "remove"
    )
  }
}

export default { before }
