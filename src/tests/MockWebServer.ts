import { DefaultBodyType, http, HttpResponse } from "msw";
import { SetupServer, setupServer } from "msw/node";

export type Method = "get" | "post" | "put";

export interface MockHandler<T extends DefaultBodyType> {
  method: Method;
  endpoint: string;
  httpStatusCode: number;
  response: T;
}

export interface Request {
  headers: Headers;
  params: URLSearchParams;
}

export class MockWebServer {
  server: SetupServer;

  lastRequest?: Request;
  allRequests?: Request[] = [];

  constructor() {
    this.server = setupServer();

    this.server.events.on("request:start", req => {
      const request = this.mapRequest(req.request);

      this.lastRequest = request;
      this.allRequests?.push(request);
    });
  }

  start(): void {
    this.server.listen();
  }

  resetHandlers(): void {
    this.server.resetHandlers();
  }

  close(): void {
    this.server.close();
  }

  addRequestHandlers<T extends DefaultBodyType>(handlers: MockHandler<T>[]) {
    const mwsHandlers = handlers.map(handler => this.createMwsHandler(handler));
    this.server.use(...mwsHandlers);
  }

  addVerificationListener(assertion: (req: globalThis.Request) => void) {
    this.server.events.on("request:start", req => {
      const request = req.request;

      assertion(request);
    });
  }

  createMwsHandler<T extends DefaultBodyType>(handler: MockHandler<T>) {
    switch (handler.method) {
      case "get":
        return http.get(handler.endpoint, () => {
          return HttpResponse.json(handler.response, { status: handler.httpStatusCode });
        });
      case "post":
        return http.post(handler.endpoint, () => {
          return HttpResponse.json(handler.response, { status: handler.httpStatusCode });
        });
      case "put":
        return http.put(handler.endpoint, () => {
          return HttpResponse.json(handler.response, { status: handler.httpStatusCode });
        });
    }
  }

  private mapRequest(req: globalThis.Request): Request {
    return {
      headers: req.headers,
      params: new URL(req.url).searchParams,
    };
  }
}
