/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ElementHandle, Page } from "puppeteer";
import random from "./random";

const click = async (
  page: Page,
  elementHandle: ElementHandle
): Promise<void> => {
  const clientRect = await page.evaluate((element) => {
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x, y, width, height };
  }, elementHandle);

  await page.mouse.click(
    clientRect.x + random(0, clientRect.width),
    clientRect.y + random(0, clientRect.height)
  );
};

export default click;
