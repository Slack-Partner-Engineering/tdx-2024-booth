import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const SampleFunctionDefinition = DefineFunction({
  callback_id: "sample_function",
  title: "Create ticket",
  source_file: "functions/sample_function.ts",
  input_parameters: {
    properties: {
      title: {
        type: Schema.types.string,
        description: "Title of the ticket",
      },
      description: {
        type: Schema.types.string,
        description: "Description of the ticket",
      },
      severity: {
        type: Schema.types.string,
        description: "Severity of the ticket",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel to alert",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "User who has submitted the ticket",
      },
    },
    required: ["title", "description", "severity", "channel", "user"],
  },
  output_parameters: {
    properties: {
      title: {
        type: Schema.types.string,
        description: "Title of the ticket",
      },
      description: {
        type: Schema.types.string,
        description: "Description of the ticket",
      },
      severity: {
        type: Schema.types.string,
        description: "Severity of the ticket",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel to alert",
      },
    },
    required: ["message", "user"],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  SampleFunctionDefinition,
  async ({ inputs, client }) => {
    const { title, description, severity, channel, user } = inputs;

    const formattedMessage = `:wave: Ticket has been submitted\n\n` +
      `Title: ${title}\n\n`+
      `Severity: ${severity}\n\n`+
      `Created by: <@${user}>`;

    await client.chat.postMessage({
      channel: channel,
      text: formattedMessage,
    });

    // Outputs are made available as variables for use in subsequent functions
    return { outputs: { title, description, severity, channel, user } };
  },
);
