import clui from "clui";
import { Page } from "puppeteer";
import { log, wait } from ".";
import chalk from "chalk";
import fs from 'fs/promises';

const { Spinner } = clui;

interface Options {
  interactionDelay: number;
  typingDelay: number;
  downloadTimeout: number;
  path: string;
}

const saveLocalCopy = async (
  page: Page,
  file: { name: string; id: string },
  options: Options
) => {
  const { interactionDelay, typingDelay, downloadTimeout, path } = options;

  await fs.mkdir(path, { recursive: true });
  const expectedFilesCount = (await fs.readdir(path)).length + 1;
  let counter = expectedFilesCount - 1;

  log(
    chalk.red("\t.") + chalk.bold(` Opening up the figma command pallete...`)
  );
  await wait(interactionDelay);
  await page.keyboard.down("Meta");
  await page.keyboard.press("KeyP");
  await page.keyboard.up("Meta");

  log(chalk.red("\t.") + chalk.bold(` Typing down the download command...`));
  await wait(interactionDelay);
  await page.keyboard.type("save local copy", { delay: typingDelay });

  log(chalk.red("\t.") + chalk.bold(` Execute the download command...`));
  await wait(interactionDelay);
  await page.keyboard.press("Enter");

  const spinner = new Spinner("\t. Waiting for the file to be downloaded...");

  try {
    spinner.start();

    await wait(interactionDelay);

    const beginning = Date.now();
    while (counter !== expectedFilesCount) {
      counter = (await fs.readdir(path)).length;
      if (Date.now() - beginning > downloadTimeout) throw Error('Timeout');
    }

    spinner.stop();
    log(`\t. File (${file.name}) successfully downloaded.`);
  } catch {
    spinner.stop();
    log(
      chalk.bold.red(
        `\tERR. Download aborted | Timeout of ${Math.round(
          downloadTimeout / 1000
        )}s exceeded.`
      )
    );
  } finally {
    setTimeout(() => {
      void page.close();
    }, interactionDelay * 2);
  }
};

export default saveLocalCopy;
