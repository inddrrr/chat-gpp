const { Client, LocalAuth } = require("whatsapp-web.js");
require("dotenv").config();
const qrcode = require("qrcode-terminal");
const puppeteer = require("puppeteer");
const PREFIX = process.env.PREFIX_BOT;
const BOT_NAME = process.env.BOT_NAME;

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

const client = new Client({
  authStrategy: new LocalAuth(),
  // proxyAuthentication: { username: 'username', password: 'password' },
  puppeteer: { 
      // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
      headless: false
  }
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});


//message

client.on("message", async msg => {
  console.log("MESSAGE RECEIVED", msg);

  if(msg.body === '.hai') {
	  msg.reply('halo');

  } else if (msg.body === '.gmn') {
    // Send a new message to the same chat
    client.sendMessage(msg.from, 'gpp');
  } 
});

client.on("disconnected", (reason) => {
  console.log("disconnected chat-gpp", reason);
});

