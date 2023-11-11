import { Locator, Page, expect } from "@playwright/test";

export class NewClusterPage {
  private page: Page;
  readonly dedicatedClusterButton: Locator;
  readonly regionDropDown: Locator;
  readonly totalCostPerHour: Locator;
  readonly serverNameInput: Locator;
  readonly serverNameErrorMessage: Locator;
  readonly nextNetworkSettingsButton: Locator;
  readonly nameIsTooBigError: string;
  readonly alphanumericCharacterError: string;
  readonly requiredFieldMessage: string;

  constructor(page: Page) {
    this.page = page;
    this.dedicatedClusterButton = page.locator('[id="createNewClusterBtn"]');
    this.regionDropDown = page.locator('[data-testid="region"]');
    this.totalCostPerHour = page.locator("[id=totalCostPerHour]");
    this.serverNameInput = page.locator('[id="clusterNameInp"]');
    this.serverNameErrorMessage = page.locator(
      '[id="clusterNameInp-helper-text"]'
    );
    this.nextNetworkSettingsButton = page.locator('[id="launchClusterBtn"]');
    this.nameIsTooBigError =
      "Cluster name should contain a maximum of 30 characters";
    this.alphanumericCharacterError =
      "Cluster name should start and end with an alphanumeric character and can contain @ _ & # -";
    this.requiredFieldMessage = "This field is required";
  }

  async navigateTo() {
    await this.page.goto("");
  }

  async clearAndTypeServerName(text: string) {
    await this.serverNameInput.fill("");
    await this.serverNameInput.fill(text);
  }

  async fillInClusterNameAndClickNext(name: string) {
    await this.serverNameInput.fill(name);
    await this.nextNetworkSettingsButton.click();
  }

  async validateNameError(text: string) {
    await expect(this.serverNameErrorMessage).toContainText(text);
  }

  async validateNetworkPageIsOpened(clusterName: string) {
    await expect(this.page).toHaveTitle(
      "Network Settings | New Cluster | ScyllaDB Cloud"
    );
    await expect(this.page).toHaveURL("clusters/new/network");
    await expect(
      this.page.locator('[id="instanceDescription-clusterName"]')
    ).toHaveText(`Cluster ${clusterName}`);
  }

  async validatePricePerRegion(region: string, price: string) {
    await this.regionDropDown.click();
    await this.page.getByRole("option", { name: `${region}` }).click();
    await expect(this.totalCostPerHour).toContainText(price);
  }
}
