import { test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { getAuthData } from "../../utils";

let loginPage: LoginPage;
const authData = getAuthData();

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);

  await loginPage.navigateTo();
});

test("Login to the system", async ({}) => {
  loginPage.doLogin(authData.email, authData.password);
  await loginPage.checkLoggedIn();
});

test("Failing login - invalid username", async () => {
  await loginPage.doLogin(authData.email, "testse");
  await loginPage.validateLoginError();
});

test("Failing login - invalid password", async () => {
  await loginPage.doLogin("test@test.com", authData.password);
  await loginPage.validateLoginError();
});
