import { RenderResult, render, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { ProductsPage } from "../../ProductsPage";
import { ReactNode } from "react";
import { AppProvider } from "../../../context/AppProvider";
import { MockWebServer } from "../../../tests/MockWebServer";
import { givenAProducts, givenThereAreNoProducts } from "./ProductsPage.fixture";
import {
  openDialogToEditPrice,
  verifyDialog,
  verifyHeader,
  verifyRows,
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
  });
});

function renderComponent(component: ReactNode): RenderResult {
  return render(<AppProvider>{component}</AppProvider>);
}
