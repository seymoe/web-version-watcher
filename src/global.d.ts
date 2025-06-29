declare namespace NodeJS {
  interface Global {
    fetch: jest.Mock;
  }
}

declare const global: NodeJS.Global; 