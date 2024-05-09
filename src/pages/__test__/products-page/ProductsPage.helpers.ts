import { within } from "@testing-library/react";
import { expect } from "vitest";

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
