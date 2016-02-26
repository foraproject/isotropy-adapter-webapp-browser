/* @flow */
import type { IncomingMessage, ServerResponse } from "./flow/http";;
import Response from "./response";

export type RenderArgsType = {
  args: Object,
  handler: (req: IncomingMessage, res: ServerResponse, args: Object) => Promise,
  toHtml?: (html: string, props: Object) => string,
  elementSelector: string;
  onRender: Function;
}

const render = async function(params: RenderArgsType) : Promise {
  const { req, args, handler, toHtml, elementSelector, onRender } = params;
  const dummyResponse = new Response({ args, toHtml, elementSelector, onRender });
  return handler(req, dummyResponse, args);
};

export default {
  render
};
