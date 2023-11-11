import { NewClusterPage } from "../pages/newClusterPage";
import { test } from "../fixtures/apiStorageStateFixture";
import priceAndRegion from "../data/clusterRegionAndPrice";

test.use({});
let newClusterPage: NewClusterPage;

test.beforeEach(async ({ page }) => {
  newClusterPage = new NewClusterPage(page);

  await newClusterPage.navigateTo();
  await newClusterPage.dedicatedClusterButton.click();
});

test("Verify price per region", async ({}) => {
  for (const { region, price } of priceAndRegion) {
    await newClusterPage.validatePricePerRegion(region, price);
  }
});

test("Cluster name should contain a maximum of 30 characters", async ({}) => {
  await newClusterPage.serverNameInput.fill("ClusterNameShouldContainMaximum");
  await newClusterPage.validateNameError(newClusterPage.nameIsTooBigError);
});

test("Cluster name should start and end with an alphanumeric character", async ({}) => {
  const serverNames = ["@test", "test#"];

  for (const name of serverNames) {
    await newClusterPage.clearAndTypeServerName(name);
    await newClusterPage.validateNameError(
      newClusterPage.alphanumericCharacterError
    );
  }
});

test("Empty Cluster name validation", async ({}) => {
  await newClusterPage.fillInClusterNameAndClickNext("");
  await newClusterPage.validateNameError(newClusterPage.requiredFieldMessage);
});

test("Redirection to Network page", async ({}) => {
  const clusterName = "Tes@_&t";

  await newClusterPage.fillInClusterNameAndClickNext(clusterName);
  await newClusterPage.validateNetworkPageIsOpened(clusterName);
});
