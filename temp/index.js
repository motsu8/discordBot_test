const DISCORD_GUILD_ID = "1029144547571282053";
const DISCORD_CHANNEL_ID = "1115179542164811776";
const MESSAGE = "hogehogehoge";

// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
const { Client, Events, GatewayIntentBits } = require("discord.js");
const express = require("express");
const app = express();

// 設定ファイルからトークン情報を呼び出し、変数に保存します
const { token } = require("../config.json");
const { default: Undici } = require("undici");

// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(Events.ClientReady, async (c) => {
  console.log(`準備OKです! ${c.user.tag}がログインします。`);

  //サーバーのユーザー取得
  console.log("---サーバーメンバー---");
  const guild = await client.guilds.fetch(DISCORD_GUILD_ID);
  const members = await guild.members.list({limit: 50, cache: true})
  members.each(member => console.log(member.user.username))
  
  // サーバーの特定のテキストチャンネルに参加しているメンバー取得
  console.log("---テトリスチャンネルユーザー---");
  const tetrisChannel = await guild.channels.fetch("1103934213490753566") // tetris
  const tetrisUser = await tetrisChannel.members
  tetrisUser.each(member => console.log(member.user.username))
  

  // roles
  // const roles = guild.roles.cache.filter(role => role.name === "admin")
  // roles.each(role => console.log(role))
  // member.roles.cache.has('役職ID')
});

client.on("messageCreate", async (message) => {
  console.log(message);
  if (message.content === "!getUsers") {
    // サーバーのテキストチャンネルを取得
    const textChannels = client.channels.cache.filter(
      (channel) => channel.type === "text"
    );

    // テキストチャンネルごとにユーザーリストを取得
    textChannels.forEach(async (channel) => {
      const guild = channel.guild;
      const memberList = guild.members.cache.filter(
        (member) => !member.user.bot
      );

      // ユーザーリストをコンソールに表示（ここでは表示のみですが、適宜他の処理を行うこともできます）
      console.log(`チャンネル「${channel.name}」のユーザーリスト:`);
      memberList.forEach((member) => {
        console.log(`- ${member.user.username}`);
      });
    });
  }
});

app.use(express.json());

function createCodeBlock(code) {
  return "```" + code + "```";
}

app.post("/send-message", (req, res) => {
  const message = `${req.body.message} \n ${createCodeBlock(
    'console.log("ok")'
  )}`;
  console.log(req.body);
  console.log(`Received message: ${message}`);

  // ここでメッセージを処理するための任意の操作を実行できます
  const guild = client.guilds.cache.get(DISCORD_GUILD_ID);
  const channel = guild.channels.cache.get(DISCORD_CHANNEL_ID);
  if (!channel) return res.status(400).json({ error: "Invalid channel ID." });
  res.status(200).json({ message: "Message sent successfully." });

  channel.send(message);
});

// 静的ファイルの提供
app.use(express.static("public"));

// ルートエンドポイントの設定
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); // HTMLファイルのパス
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} url: http://localhost:${PORT}`
  );
});

// ログインします
client.login(token);
