export type errorT = {
  response: {
    data: {
      context:
        | { data: unknown }
        | Array<Record<string, string> | string>
        | string;
    };
  };
};
