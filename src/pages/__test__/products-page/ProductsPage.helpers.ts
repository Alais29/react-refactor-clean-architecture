import { screen, waitFor, within } from "@testing-library/react";
import { expect } from "vitest";
import { RemoteProduct } from "../../../api/StoreApi";

export function verifyHeader(headerRow: HTMLElement) {
  // We can't directly look for an HTML element with react testing library so we turn it into a scope
  // this way instead of looking for elements in the whole page, we'll look for them only in the scope
  const headerScope = within(headerRow);

  const cells = headerScope.getAllByRole("columnheader");

  expect(cells.length).toBe(6);

  within(cells[0]).getByText("ID");
  within(cells[1]).getByText("Title");
  within(cells[2]).getByText("Image");
  within(cells[3]).getByText("Price");
  within(cells[4]).getByText("Status");
}

export async function waitForTableToBeLoaded() {
  await waitFor(async () => expect((await screen.findAllByRole("row")).length).toBeGreaterThan(1));
}

export function verifyRows(rows: HTMLElement[], products: RemoteProduct[]) {
  expect(rows.length).toBe(products.length);

  rows.forEach((row, index) => {
    const rowScope = within(row);
    const cells = rowScope.getAllByRole("cell");

    expect(cells.length).toBe(6);

    const product = products[index];

    within(cells[0]).getByText(product.id);
    within(cells[1]).getByText(product.title);

    const image: HTMLImageElement = within(cells[2]).getByRole("img");
    expect(image.src).toBe(product.image);

    within(cells[3]).getByText(`$${product.price.toFixed(2)}`);
    within(cells[4]).getByText(product.price === 0 ? "inactive" : "active");
  });
}
