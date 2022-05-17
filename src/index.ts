import {TwitterApi, TwitterApiReadWrite} from "twitter-api-v2";
import axios from "axios";

require('dotenv').config();

if (!process.env.CONSUMER_KEY || !process.env.CONSUMER_SECRET || !process.env.ACCESS_TOKEN_KEY || !process.env.ACCESS_TOKEN_SECRET || !process.env.WEBHOOK || !process.env.TWITTER_USERNAME) {
    console.error("Please set the following environment variables: CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET, WEBHOOK, TWITTER_USERNAME");
    process.exit(1);
}

const twitterClient: TwitterApi = new TwitterApi({
    appKey: process.env.CONSUMER_KEY ?? "",
    appSecret: process.env.CONSUMER_SECRET ?? "",
    accessToken: process.env.ACCESS_TOKEN_KEY ?? "",
    accessSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
});

const webhookUrl: string = process.env.WEBHOOK ?? "";

const username = process.env.TWITTER_USERNAME ?? "";
let userId = "";

const messagePattern = process.env.MESSAGE ?? "{mention} posted a new tweet !\n:arrow_forward: {link}";

const rwClient: TwitterApi["readWrite"] = twitterClient.readWrite;

const v2Client: TwitterApiReadWrite["v2"] = rwClient.v2;

async function checkTweets(): Promise<void> {
    const tweets: any = await v2Client.get(`users/${userId}/tweets`);

    if (!tweets.data) {
        return;
    }

    for (const element of tweets.data) {
        const tweet: any = await v2Client.get(`tweets?ids=${element.id}&tweet.fields=created_at&expansions=author_id&user.fields=created_at`);

        const tweetDate: number = new Date(tweet.data[0].created_at).getTime();
        const now: number = Date.now();

        if (now - tweetDate < 60000) {
            let message: string = messagePattern;

            message = message.replace("{mention}", `@${username}`)
                .replace("{link}", `https://twitter.com/${username}/status/${element.id}`)
                .replace("{date}", new Date(tweet.data[0].created_at).toLocaleString())
                .replace("{username}", username)
                .replace("{text}", tweet.data[0].text)
                .replace(/\\n/g, '\n');

            await axios.post(webhookUrl, {content: message}).catch(console.error);
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