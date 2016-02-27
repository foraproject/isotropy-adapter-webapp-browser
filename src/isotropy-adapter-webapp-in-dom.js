/* @flow */
import type { IncomingMessage, ServerResponse } from "./flow/http";;

export type RenderArgsType = {
  req: IncomingMessage,
  res: ServerResponse,
  args: Object,
  handler: (req: IncomingMessage, res: ServerResponse, args: Object) => Promise,
  toHtml?: (html: string, props?: Object) => string,
  elementSelector: string;
  onRender: Function;
}

const render = async function(params: RenderArgsType) : Promise {
  const { req, res, args, handler, toHtml, elementSelector, onRender } = params;
  res.on("end", (html) => {
    if (onRender) {
      onRender(html);
    } else {
      const domNode = document.querySelector(elementSelector);
      domNode.innerHTML = toHtml ? toHtml(html) : html;
    }
  });
  return handler(req, res, args);
};

export default {
  render
};
