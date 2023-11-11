import { test as base } from "@playwright/test";
import { getAuthData } from "../../utils";

type MyFixtures = {};

export const test = base.extend<MyFixtures>({
  storageState: async ({ request }, use) => {
    const authData = getAuthData();
    await request.post(
      "https://auth.cloud.scylladb.com/frontegg/identity/resources/auth/v1/user",
      {
        form: {
          email: authData.email,
          ivitationtoken: "",
          password: authData.password,
        },
      }
    );
    const cookies = await request.storageState();

    await request.dispose();
    await use(cookies);
  },
});

export { expect } from "@playwright/test";
