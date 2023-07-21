const { request } = require("undici");
const express = require("express");
const { clientId, clientSecret, port, extensionUrl } = require("../config.json");

const app = express();

let userObject;

app.get("/get-discord-user", ({ query }, response) => {
  console.log("----User");
  console.log(userObject)
  response.send(userObject);
});

app.get("/", async ({ query }, response) => {
  const { code } = query;

  if (code) {
    try {
      const tokenResponseData = await request(
        "https://discord.com/api/oauth2/token",
        {
          method: "POST",
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: "authorization_code",
            redirect_uri: `http://localhost:${port}`,
            scope: "identify",
          }).toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

      const oauthData = await tokenResponseData.body.json();

      const userResult = await request("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });

      userObject = await userResult.body.json();
      console.log(userObject);
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error
      // tokenResponseData.statusCode will be 401
      console.error(error);
    }
  }

  return response.redirect(extensionUrl);
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
