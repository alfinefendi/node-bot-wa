const path = require('path');
const express = require('express')
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express()

app.use(express.static(path.join(__dirname, 'public')))


let data = []

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  }
});

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
    data.push(
      message = {
        body: message.body,
        timestamp: message.timestamp
      }
    )
})

client.initialize();

app.get('/api/data', (req, res) => {
  res.json({
    message: 'ok',
    data: data,
  })
})

app.listen(5001, () => {
   console.log(`Server running at http://localhost:5001`);
})