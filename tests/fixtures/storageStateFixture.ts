import { test as base } from "@playwright/test";
import fs from "fs";
import { getAuthData } from "../../utils";

// Declare the types of your fixtures.
type MyFixtures = {
  userToLogin?: string;
};

export const test = base.extend<MyFixtures>({
  userToLogin: undefined,

  //!! this fixture is executed before the test
  storageState: async ({ browser, userToLogin }, use) => {
    // check if the user is specified
    if (userToLogin) {
      const fileName = `./.auth/${userToLogin}.json` as string;

      // check if the cookies already exists for the user
      if (!fs.existsSync(fileName)) {
        // create a new page if the cookies doesn't exist
        const page = await browser.newPage({ storageState: undefined });
        //!! do login
        const authData = getAuthData();
        await page.goto("/account/login");
        await page.locator(`[data-test-id="input-email"]`).fill(authData.email);
        await page.locator('[data-test-id="submit-btn"]').click();
        await page
          .locator(`[data-test-id="input-password"]`)
          .fill(authData.password);
        await page.locator('[data-test-id="submit-btn"]').click();
        // wait for page to load
        await page.waitForLoadState("networkidle");
        //!! save the cookies
        await page.context().storageState({ path: fileName });
        //!! close the page
        await page.close();
      }
      //use saved cookies
      await use(fileName);
    } else {
      // do not use cookies if the user is not specified
      await use(undefined);
    }
  },
});

export { expect } from "@playwright/test";
