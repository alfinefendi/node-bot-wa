const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

// Using async/await
async function generateQr(qr) {
  try {
    qrcode.generate(qr,{small: true})
  } catch (err) {
    console.error(err);
  }
}

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    generateQr(qr)

});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on("message_create", message => {
    console.log(message.body)
})

client.initialize();