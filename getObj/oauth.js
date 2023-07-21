const { request } = require("undici");
const express = require("express");
const { clientId, clientSecret, port } = require("../config.json");

const app = express();

let userObject;

app.get("/user", ({ query }, response) => {
  console.log(userObject);
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
        const oauthData = await tokenResponseData.body.json();
        const userResult = await request("https://discord.com/api/users/@me", {
          headers: {
            authorization: `${oauthData.token_type} ${oauthData.access_token}`,
          },
        });
        userObject = await userResult.body.json();
        return response.send("http://127.0.0.1:5500/getObj/oauth.html");
      } catch (error) {
        // NOTE: An unauthorized token will not throw an error
        // tokenResponseData.statusCode will be 401
        console.error(error);
      }
    }
  });
  response.setHeader('Content-Type', 'application/json');
  if(userObject) response.send(userObject);
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
