const DISCORD_GUILD_ID = "1029144547571282053";
const DISCORD_CHANNEL_ID = "1115179542164811776";
const MESSAGE = "hogehogehoge";

// curl \
// -X POST \
// -H "Content-Type: application/json" \
// -H "Authorization: Bot $DISCORD_BOT_TOKEN" \
// -d "{\"content\": \"$MESSAGE\"}" \
// "https://discordapp.com/api/channels/$DISCORD_CHANNEL_ID/messages"

// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
const { Client, Events, GatewayIntentBits } = require("discord.js");
const express = require("express");
const app = express();

// 設定ファイルからトークン情報を呼び出し、変数に保存します
const { token } = require("../config.json");

// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(Events.ClientReady, (c) => {
  console.log(`準備OKです! ${c.user.tag}がログインします。`);

  // // サーバーのテキストチャンネルリストを取得
  // console.log("---サーバーのテキストチャンネルリスト---");
  // const guild = client.guilds.cache.get(DISCORD_GUILD_ID);
  // console.log(guild.members.cache);
  // const textChannels = guild.channels.cache.filter(
  //   (channel) => channel.type === 0
  // );
  // textChannels.each((channel) => console.log(channel.name));
  // console.log("------");

  // // サーバーの特定のテキストチャンネルに参加しているメンバー取得
  // const members = textChannels.first().members;
  // console.log(members)
  // members.each((member) => console.log(member.displayName));

  // roles
  // const roles = guild.roles.cache.filter(role => role.name === "admin")
  // roles.each(role => console.log(role))
  // member.roles.cache.has('役職ID')
});

app.use(express.json());

app.post("/send-message", (req, res) => {
  const message = req.body.message;
  console.log(req.body)
  console.log(`Received message: ${message}`);

  // ここでメッセージを処理するための任意の操作を実行できます
  const guild = client.guilds.cache.get(DISCORD_GUILD_ID);
  const channel = guild.channels.cache.get(DISCORD_CHANNEL_ID);
  if (!channel) return res.status(400).json({ error: "Invalid channel ID." });
  res.send("Message received successfully.");

  channel.send(message);
  res.status(200).json({ message: "Message sent successfully." });
});

// 静的ファイルの提供
app.use(express.static("public"));

// ルートエンドポイントの設定
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); // HTMLファイルのパス
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} url: http://localhost:${PORT}`);
});

// ログインします
client.login(token);
