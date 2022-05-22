# Twitter Notif

*Connect your Twitter account to Discord easily...*

## Installation

### Way 1 :

```
docker pull vortezz/twitternotif:latest
```

Create API Keys on [Twitter Developer Portal](https://developer.twitter.com/en/apps) and a Discord Webhook.
<br>
Then, fill the command below with your configuration.

```
docker run --env CONSUMER_KEY="Twitter Consumer Key" \
    --env CONSUMER_SECRET="Twitter Consumer Secret" \
    --env ACCESS_TOKEN_KEY="Twitter Access Token Key" \
    --env ACCESS_TOKEN_SECRET="Twitter Access Token Secret" \
    --env WEBHOOK="Discord Webhook URL" \
    --env TWITTER_USERNAME="Username" \
    --env MESSAGE="Custom message using tags below" \
    vortezz/twitternotif:latest
```

### Way 2 :

```
git pull https://github.com/Vortezz/twitter-notif.git
```

Create API Keys on [Twitter Developer Portal](https://developer.twitter.com/en/apps) and a Discord Webhook.
<br>
Copy the `example.env`, rename it to `.env` and fill the file with your configuration.

Then, run the command below.

```
yarn start
```

Enjoy!

## Parameters

| Key       | What it represents              | Required |
|-----------|---------------------------------|----------|
| `CONSUMER_KEY` | Twitter Consumer Key            | Yes      |
| `CONSUMER_SECRET` | Twitter Consumer Secret            | Yes      |
| `ACCESS_TOKEN_KEY` | Twitter Access Token Key            | Yes      |
| `ACCESS_TOKEN_SECRET` | Twitter Access Token Secret            | Yes      |
| `WEBHOOK` | Discord Webhook URL            | Yes      |
| `TWITTER_USERNAME` | Twitter username                | Yes      |
| `MESSAGE` | Custom message using tags below | No       |

## Tags for custom messages

| Key          | What it represents      |
|--------------|-------------------------|
| `{username}` | Username defined in ENV |
| `{mention}`  | Mention of the username |
| `{link}`     | Link of the tweet       |
| `{text}`     | Tweet content           |
| `{date}`     | Tweet sent date         |

## Contributing

Want to suggest a new feature or fix a bug?

Feel free to open an issue or create a pull request!
