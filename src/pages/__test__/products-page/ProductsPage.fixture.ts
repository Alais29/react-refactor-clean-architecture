import { MockWebServer } from "../../../tests/MockWebServer";
import productsResponse from "./data/productsResponse.json";

export function givenAProducts(mockWebServer: MockWebServer) {
  mockWebServer.addRequestHandlers([
    {
      method: "get",
      endpoint: "https://fakestoreapi.com/products",
      httpStatusCode: 200,
      response: productsResponse,
    },
  ]);
}

export function givenThereAreNoProducts(mockWebServer: MockWebServer) {
  mockWebServer.addRequestHandlers([
    {
      method: "get",
      endpoint: "https://fakestoreapi.com/products",
      httpStatusCode: 200,
      response: [],
    },
  ]);
}
