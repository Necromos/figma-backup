#! /usr/bin/env node

import * as yargs from "yargs";
import Bot from "./Bot";

void yargs
  .command(
    "$0",
    "Backup figma projects.",
    command =>
      command
        .option("e", {
          alias: "figma-email",
          type: "string",
          describe: "Figma user's email."
        })
        .option("p", {
          alias: "figma-password",
          type: "string",
          describe: "Figma user's password."
        })
        .option("t", {
          alias: "figma-token",
          type: "string",
          describe: "Figma access token."
        })
        .option("projects-ids", {
          type: "array",
          describe: "Figma projects ids."
        })
        .option("team-id", {
          type: "string",
          describe: "Figma team id."
        })
        .option("debug", {
          type: "boolean",
          default: false,
          describe:
            "Opt-in `debug` argument if you want to let the bot to open a local chromium window on your client."
        })
        .option("download-timeout", {
          type: "number",
          default: 5,
          describe:
            "This number indicates the maximum amount of time the bot has to wait for a file to be downloaded. (in minutes)."
        })
        .option("interaction-delay", {
          type: "number",
          default: 2,
          describe:
            "This number indicates the delay between interactions. (in seconds)."
        })
        .option("typing-delay", {
          type: "number",
          default: 100,
          describe:
            "This number indicates the delay to type a new character. (in miliseconds)."
        })
        .demandOption("e", "Argument `-e | --figma-email` is required.")
        .demandOption("p", "Argument `-p | --figma-password` is required.")
        .demandOption("t", "Argument `-t | --figma-token` is required."),
    async argv => {
      const {
        debug,
        "download-timeout": downloadTimeout,
        "interaction-delay": interactionDelay,
        "typing-delay": typingDelay,
        e: authEmail,
        p: authPassword,
        t: authToken,
        "projects-ids": projectsIds,
        "team-id": teamId
      } = argv;

      await new Bot({
        authData: { email: authEmail, password: authPassword },
        projectsIds: projectsIds?.map(String),
        teamId,
        downloadTimeout: downloadTimeout * 60 * 1000,
        interactionDelay: interactionDelay * 1000,
        figmaAccessToken: authToken,
        debug,
        typingDelay,
      }).start();
    }
  )
  .usage(
    [
      "figma-backup",
      '--figma-email "<YOUR_EMAIL>"',
      '--figma-password "<YOUR_PASSWORD>"',
      '--figma-token "<YOUR_TOKEN>"',
      '--projects-ids "ID1" "ID2" ...',
      '--team-id "<TEAM_ID>"'
    ].join(" ")
  )
  .help()
  .strict()
  .version("1.0.3").argv;
