const { App, LogLevel } = require('@slack/bolt');

/** Initialization */
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

/** Sample Function Listener */
app.function('create_ticket', async ({ client, inputs, complete, fail }) => {
  try {
    const { title, description, severity, channel, user } = inputs;

    const formattedMessage = ':wave: Ticket has been submitted\n\n'
      + `Title: ${title}\n\n`
      + `Severity: ${severity}\n\n`
      + `Created by: <@${user}>`;

    const response = await client.chat.postMessage({
      channel,
      text: formattedMessage,
    });

    if (!response.ok) {
      throw new Error(`Failed to post message: ${response.error}`);
    }
    complete({ outputs: { title, description, severity, channel } });
  } catch (error) {
    console.error(error);
    fail({ error: `Failed to handle a function request: ${error}` });
  }
});

/** Start Bolt App */
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running! ⚡️');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();
