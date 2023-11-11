import { Locator, Page, expect } from "@playwright/test";

export class LoginPage {
  private page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly submitButton: Locator;
  readonly ShowPasswordButton: Locator;
  readonly HidePasswordButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.passwordField = page.locator('[data-test-id="input-password"]');
    this.ShowPasswordButton = page.getByLabel("Show password");
    this.HidePasswordButton = page.getByLabel("Hide password");
    this.emailField = page.locator('[data-test-id="input-email"]');
    this.submitButton = page.locator('[data-test-id="submit-btn"]');
    this.errorMessage = page.locator('[data-test-id="login-error"]');
  }

  async navigateTo() {
    await this.page.goto("/login");
  }

  async doLogin(email: string, password: string) {
    await this.emailField.fill(email);
    await this.submitButton.click();
    await this.passwordField.fill(password);
    await this.submitButton.click();
  }

  async checkLoggedIn() {
    await expect(this.page).toHaveURL("");
    await expect(this.page).toHaveTitle("My Clusters | ScyllaDB Cloud");
    await expect(this.page.locator('[id="createNewClusterBtn"]')).toBeVisible();
  }

  async validateLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }
}
