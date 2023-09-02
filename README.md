<p align="center">
  <img src="./chat-gpp.jpeg" alt="Chat GPP">
</p>

<h1 align="center">Chat GPP</h1>

---

<p align="center"> Whatsapp chatbot powered by OpenAI
    <br> 
</p>

## Table of Contents

- [Getting Started](#getting_started)
- [Commands](#commands)
- [Built Using](#built_using)

## Getting Started <a name = "getting_started"></a>

1. Clone this repo and run the following command in your terminal

```bash
git clone https://github.com/inddrrr/chat-gpp.git
```

2. Install all the dependencies

```bash
npm install
```

3. Copy the `.env.example` file to `.env` and fill the required fields

```bash
cp .env.example .env
```

4. Edit the value of OPEN_AI_API in `.env` file with your openai API Key

5. Run the following command to start the server

```bash
npm run bot
```

6. Scan the QR code using your Whatsapp app and start chatting with the bot using [commands](#commands)

## Commands <a name = "commands"></a>

- ### Show help prompt :

Type `.help`

- ### Ask any question :

Type `.ask` then describe the intruction or question what you want to ask

- ### Draw an image :

Type `.draw` then describe a picture what you want to draw

## Built Using <a name = "built_using"></a>

- [NodeJS](https://nodejs.org/en/) - Server Environment
- [Whatsapp-Web.js](https://wwebjs.dev/) - Whatsapp Web API
- [OpenAI](https://openai.com/) - OpenAI API