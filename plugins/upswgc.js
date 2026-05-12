import { prepareWAMessageMedia } from '@adiwajshing/baileys'

const handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text && !m.quoted) {
        return m.reply(
            `Example:\n${usedPrefix + command} Hello\n\n` +
            `or reply to image / video / audio`
        )
    }

    try {

        // Text Status
        if (text) {

            await conn.relayMessage(
                m.chat,
                {
                    groupStatusMessageV2: {
                        message: {
                            extendedTextMessage: {
                                text
                            }
                        }
                    }
                },
                {}
            )

            return m.reply('Text status uploaded successfully')
        }

        // Media Status
        if (m.quoted) {

            const mime = m.quoted.mimetype || ''

            const buffer = await m.quoted.download()

            if (!buffer) {
                return m.reply('Failed to download media')
            }

            let media = {}

            // Image
            if (/image/.test(mime)) {

                media = await prepareWAMessageMedia(
                    {
                        image: buffer
                    },
                    {
                        upload: conn.waUploadToServer
                    }
                )
            }

            // Video
            else if (/video/.test(mime)) {

                media = await prepareWAMessageMedia(
                    {
                        video: buffer
                    },
                    {
                        upload: conn.waUploadToServer
                    }
                )
            }

            // Audio
            else if (/audio/.test(mime)) {

                media = await prepareWAMessageMedia(
                    {
                        audio: buffer,
                        mimetype: 'audio/mpeg',
                        ptt: false
                    },
                    {
                        upload: conn.waUploadToServer
                    }
                )
            }

            // Unsupported
            else {
                return m.reply('Unsupported media type')
            }

            // Send Status
            await conn.relayMessage(
                m.chat,
                {
                    groupStatusMessageV2: {
                        message: {
                            ...media
                        }
                    }
                },
                {}
            )

            return m.reply('Media status uploaded successfully')
        }

    } catch (err) {

        console.error(err)

        return m.reply('Failed to upload status')
    }
}

handler.command = /^upswgc$/i

handler.owner = true

handler.group = true

handler.help = ['upswgc']

handler.tags = ['owner']

export default handler
