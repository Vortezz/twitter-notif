"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const twitter_api_v2_1 = require("twitter-api-v2");
const axios_1 = tslib_1.__importDefault(require("axios"));
require('dotenv').config();
if (!process.env.CONSUMER_KEY || !process.env.CONSUMER_SECRET || !process.env.ACCESS_TOKEN_KEY || !process.env.ACCESS_TOKEN_SECRET || !process.env.WEBHOOK || !process.env.TWITTER_USERNAME) {
    console.error("Please set the following environment variables: CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET, WEBHOOK, TWITTER_USERNAME");
    process.exit(1);
}
const twitterClient = new twitter_api_v2_1.TwitterApi({
    appKey: process.env.CONSUMER_KEY ?? "",
    appSecret: process.env.CONSUMER_SECRET ?? "",
    accessToken: process.env.ACCESS_TOKEN_KEY ?? "",
    accessSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
});
const webhookUrl = process.env.WEBHOOK ?? "";
const username = process.env.TWITTER_USERNAME ?? "";
let userId = "";
const messagePattern = process.env.MESSAGE ?? "{mention} posted a new tweet !\n:arrow_forward: {link}";
const rwClient = twitterClient.readWrite;
const v2Client = rwClient.v2;
async function checkTweets() {
    const tweets = await v2Client.get(`users/${userId}/tweets`);
    if (!tweets.data) {
        return;
    }
    for (const element of tweets.data) {
        const tweet = await v2Client.get(`tweets?ids=${element.id}&tweet.fields=created_at&expansions=author_id&user.fields=created_at`);
        const tweetDate = new Date(tweet.data[0].created_at).getTime();
        const now = Date.now();
        if (now - tweetDate < 60000) {
            let message = messagePattern;
            message = message.replace("{mention}", `@${username}`)
                .replace("{link}", `https://twitter.com/${username}/status/${element.id}`)
                .replace("{date}", new Date(tweet.data[0].created_at).toLocaleString())
                .replace("{username}", username)
                .replace("{text}", tweet.data[0].text)
                .replace(/\\n/g, '\n');
            await axios_1.default.post(webhookUrl, { content: message }).catch(console.error);
        }
    }
    console.info("Checked tweets at " + new Date().toLocaleString());
}
v2Client.userByUsername(username)
    .then(user => {
    userId = user.data.id;
    console.info(`Started checking tweets for @${username}`);
    checkTweets();
})
    .catch(err => {
    console.error(err);
});
setInterval(() => {
    checkTweets();
}, 60000);
