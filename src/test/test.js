import __polyfill from "babel-polyfill";
import setupJSDOM from "./__jsdom_setup";
import should from 'should';
import http from "http";
import querystring from "querystring";
import promisify from "nodefunc-promisify";
import webappAdapter from "../isotropy-adapter-webapp-in-dom";
import httpModule from "isotropy-http-in-app";

const { IncomingMessage, ServerResponse } = httpModule;

describe("Isotropy Adapter WebApp", () => {

  [false, true].forEach((toHtml) => {
    const desc = `end() a Request${toHtml ? " with an toHtml() wrapper" : ""}`;
    it(desc, async () => {
      setupJSDOM();
      const handler = async (req, res) => {
        const params = {
          req,
          res,
          args: {},
          handler: (req, res, args) => {
            res.end("Hello, world");
          },
          elementSelector: "#isotropy-container"
        };
        if (toHtml) {
          params.toHtml = (html) => `<div>${html}</div>`
        }
        await webappAdapter.render(params);
      }

      const req = new IncomingMessage();
      const res = new ServerResponse();
      await handler(req, res);

      const result = document.querySelector("#isotropy-container").innerHTML;
      if (toHtml) {
        result.should.equal("<div>Hello, world</div>");
      } else {
        result.should.equal("Hello, world");
      }
    });
  });

  [false, true].forEach((toHtml) => {
    const desc = `write() to a Request${toHtml ? " with an toHtml() wrapper" : ""}`;
    it(desc, async () => {
      setupJSDOM();
      const handler = async (req, res) => {
        const params = {
          req,
          res,
          args: {},
          handler: (req, res, args) => {
            res.write("Hello, ");
            res.end("world");
          },
          elementSelector: "#isotropy-container"
        };
        if (toHtml) {
          params.toHtml = (html) => `<div>${html}</div>`
        }
        await webappAdapter.render(params);
      }

      const req = new IncomingMessage();
      const res = new ServerResponse();
      await handler(req, res);

      const result = document.querySelector("#isotropy-container").innerHTML;
      if (toHtml) {
        result.should.equal("<div>Hello, world</div>");
      } else {
        result.should.equal("Hello, world");
      }
    });
  });

});
