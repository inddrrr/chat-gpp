client.on("message", async msg => {
    console.log("MESSAGE RECEIVED", msg);

    if (msg.body.startsWith(PREFIX) && !msg.getChat().isGroup) {
        const message = msg.body.replace(`${PREFIX} `, "");
    
        response = await bot(message);
        msg.reply(response);
      }
});

client.on("message_create", async (msg) => {
    if (msg.body.startsWith(PREFIX)) {
      const message = msg.body.split(`${PREFIX}`)[1];
  
      response = await bot(message);
      msg.reply(response);
    }
});

async function bot(message) {
    let prompt_template =
      "Saya adalah kecerdasan buatan bernama " +
      BOT_NAME +
      "\n" +
      BOT_NAME +
      "Ada yang bisa saya bantu?\nHuman: " +
      message +
      "\n" +
      BOT_NAME +
      ": ";
  
    try {
      const response = await openai.completions.create({
        model: "text-davinci-003",
        prompt: prompt_template,
        temperature: 0.9,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [" Human:", " " + BOT_NAME + ":"],
      });
      console.log(response.choices[0].text);
  
      return response.choices[0].text;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        console.error(error.status);
        console.error(error);
        return "Maaf, saya tidak mengerti maksud anda.";
      } else {
        console.error(error.message);
        return "Maaf, saya tidak mengerti maksud anda.";
      }
    }
  }