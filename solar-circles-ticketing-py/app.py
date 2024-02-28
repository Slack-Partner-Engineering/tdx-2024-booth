import logging
import os

from slack_bolt import App, Complete, Fail, Say
from slack_bolt.adapter.socket_mode import SocketModeHandler

app = App(token=os.environ.get("SLACK_BOT_TOKEN"))
logging.basicConfig(level=logging.INFO)


@app.function("sample_function")
def handle_sample_function_event(inputs: dict, say: Say, fail: Fail, complete: Complete, logger: logging.Logger):
    channel = inputs["channel"]
    title = inputs["title"]
    severity = inputs["severity"]
    user = inputs["user"]

    formatted_message = f":wave: Ticket has been submitted\n\n\
        Title: {title}\n\n\
        Severity: {severity}\n\n\
        Created by: <@{user}>"
    try:
        say(
            channel=channel,
            text=formatted_message,
            blocks=[
                {
                    "type": "section",
                    "text": {"type": "mrkdwn", "text": formatted_message},
                }
            ],
        )
        complete(
            outputs={
                "title": title,
                "description": inputs["description"],
                "severity": severity,
                "channel": channel,
                "user": user,
            }
        )
    except Exception as e:
        logger.exception(e)
        fail(f"Failed to handle a function request (error: {e})")


if __name__ == "__main__":
    SocketModeHandler(app, os.environ.get("SLACK_APP_TOKEN")).start()
