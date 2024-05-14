import { RenderResult, render, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { ProductsPage } from "../../ProductsPage";
import { ReactNode } from "react";
import { AppProvider } from "../../../context/AppProvider";
import { MockWebServer } from "../../../tests/MockWebServer";
import { givenAProducts, givenThereAreNoProducts } from "./ProductsPage.fixture";
import {
  changeToNonAdminUser,
  openDialogToEditPrice,
  savePrice,
  tryOpenDialogToEditPrice,
  typePrice,
  verifyDialog,
  verifyError,
  verifyHeader,
  verifyPriceAndStatusInRow,
  verifyRows,
  verifySaveIsDisabled,
  waitForTableToBeLoaded,
} from "./ProductsPage.helpers";

const mockWebServer = new MockWebServer();

describe("Products page", () => {
  beforeAll(() => mockWebServer.start());
  afterEach(() => mockWebServer.resetHandlers());
  afterAll(() => mockWebServer.close());

  test("Loads and displays title", async () => {
    givenAProducts(mockWebServer);

    renderComponent(<ProductsPage />);

    await screen.findAllByRole("heading", { name: "Product price updater" });
  });

  describe("Table", () => {
    test("should show an empty table if there is no data", async () => {
      givenThereAreNoProducts(mockWebServer);

      renderComponent(<ProductsPage />);

      const rows = await screen.findAllByRole("row");

      expect(rows.length).toBe(1);

      verifyHeader(rows[0]);
    });

    test("should show expected header and rows in the table", async () => {
      const products = givenAProducts(mockWebServer);

      renderComponent(<ProductsPage />);

      await waitForTableToBeLoaded();

      const allRows = await screen.findAllByRole("row");
      const [header, ...rows] = allRows;

      verifyHeader(header);

      verifyRows(rows, products);
    });
  });

  describe("Edit price", () => {
    test("should show a dialog with the product", async () => {
      const products = givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);

      await waitForTableToBeLoaded();

      const dialog = await openDialogToEditPrice(0);
      verifyDialog(dialog, products[0]);
    });

    test("should show error for negative price", async () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);

      await waitForTableToBeLoaded();

      const dialog = await openDialogToEditPrice(0);
      await typePrice(dialog, "-4");
      await verifyError(dialog, "Invalid price format");
      await verifySaveIsDisabled(dialog);
    });

    test("should show error for non number price", async () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);

      await waitForTableToBeLoaded();

      const dialog = await openDialogToEditPrice(0);
      await typePrice(dialog, "non numeric value");
      await verifyError(dialog, "Only numbers are allowed");
      await verifySaveIsDisabled(dialog);
    });

    test("should show error for prices greater than maximum", async () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);

      await waitForTableToBeLoaded();

      const dialog = await openDialogToEditPrice(0);
      await typePrice(dialog, "10000");
      await verifyError(dialog, "The max possible price is 999.99");
      await verifySaveIsDisabled(dialog);
    });

    test("should edit price correctly and mark status as active for a price greater than 0", async () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);

      await waitForTableToBeLoaded();

      const rowToEditIndex = 0;

      const dialog = await openDialogToEditPrice(rowToEditIndex);
      const newPrice = "120.99";
      await typePrice(dialog, newPrice);

      await savePrice(dialog);
      await verifyPriceAndStatusInRow(rowToEditIndex, newPrice, "active");
    });

    test("should edit price correctly and mark status as inactive for a price equal to 0", async () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);

      await waitForTableToBeLoaded();

      const rowToEditIndex = 0;

      const dialog = await openDialogToEditPrice(rowToEditIndex);
      const newPrice = "0";
      await typePrice(dialog, newPrice);

      await savePrice(dialog);
      await verifyPriceAndStatusInRow(rowToEditIndex, newPrice, "inactive");
    });

    test("should show an error if the user is non admin", async () => {
      givenAProducts(mockWebServer);
      renderComponent(<ProductsPage />);

      await waitForTableToBeLoaded();

      const rowToEditIndex = 0;

      await changeToNonAdminUser();
      await tryOpenDialogToEditPrice(rowToEditIndex);

      await screen.findByText(/only admin users can edit the price of a product/i);
    });
  });
});

function renderComponent(component: ReactNode): RenderResult {
  return render(<AppProvider>{component}</AppProvider>);
}
