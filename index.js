const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
require("dotenv").config();
const qrcode = require("qrcode-terminal");
const puppeteer = require("puppeteer");
const OpenAI = require("openai");
const BOT_NAME = process.env.BOT_NAME;
const GPP_PREFIX = process.env.GPP_PREFIX;
const DRAW_PREFIX = process.env.DRAW_PREFIX;

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

client.on('loading_screen', (percent, message) => {
  console.log('LOADING SCREEN', percent, message);
});


client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
  console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
  // Fired if session restore was unsuccessful
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on("ready", () => {
  console.log("Client is ready!");
});

//reject incoming call
client.on("call", async call => {
  await call.reject();
  await client.sendMessage(call.from, "Nomer ini hanya bisa menerima pesan teks 🙏🤧")
});

//message responses
client.on("message", async msg => {

  const chat = await msg.getChat();

  console.log("MESSAGE RECEIVED", msg);

  if(msg.body === '.hai') {
	  msg.reply('halo');

  } else if (msg.body === '.help') {
    // Help Promt
    client.sendMessage(msg.from, "Saya adalah bot bernama " + BOT_NAME + 
    "\nSilahkan ketik chat dengan diawali dengan kata berikut: \n\n" +
    "*.ask* => untuk menanyakan apapun \n" +
    "*.draw* => untuk membuat suatu gambar");

  } else if (msg.body.startsWith(GPP_PREFIX) && !msg.getChat().isGroup) {
    const message = msg.body.replace(`${GPP_PREFIX} `, "");

    chat.sendStateTyping();
    response = await gpp(message);
    msg.reply(response);
    chat.clearState();

  } else if (msg.body.startsWith(DRAW_PREFIX) && !msg.getChat().isGroup) {
    const message = msg.body.replace(`${DRAW_PREFIX} `, "");

    msg.react('🫡');
    response = await draw(message);
    await client.sendMessage(msg.from, response, {caption: "nyoh!"});

  } else {
    client.sendMessage(msg.from, "Gpp 🤧\n\nKetik *.help* untuk bantuan");
  }
});

//.ask
async function gpp(message) {
  try {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: message,
      temperature: 0.2,
      max_tokens: 3000,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
    });
    console.log(response.choices[0].text);

    return response.choices[0].text;

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status); // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code); // e.g. 'invalid_api_key'
      console.error(error.type);
      return "Maaf, tolong ulangi.";
    } else {
      console.log(error);
      return "Maaf, saya tidak mengerti maksud anda.";
    }
  }
}

//.draw
async function draw(message) {
  try {
    const response = await openai.images.generate({
      prompt: message,
      n: 1,
      size: "512x512",

    })

    const media = await MessageMedia.fromUrl(response.data[0].url);
    return media;


  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status); // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code); // e.g. 'invalid_api_key'
      console.error(error.type);
      return "Maaf, tolong ulangi.";
    } else {
      console.log(error);
      return "Maaf, saya tidak mengerti maksud anda.";
    }
  }
}

client.on("disconnected", (reason) => {
  console.log("disconnected chat-gpp", reason);
});