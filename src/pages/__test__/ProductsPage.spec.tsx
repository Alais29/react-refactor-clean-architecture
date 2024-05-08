import { RenderResult, render, screen } from "@testing-library/react";
import { test } from "vitest";
import { ProductsPage } from "../ProductsPage";
import { ReactNode } from "react";
import { AppProvider } from "../../context/AppProvider";

test("Loads and displays title", async () => {
  renderComponent(<ProductsPage />);

  await screen.findAllByRole("heading", { name: "Product price updater" });
});

function renderComponent(component: ReactNode): RenderResult {
  return render(<AppProvider>{component}</AppProvider>);
}
