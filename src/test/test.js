import __polyfill from "babel-polyfill";
import should from 'should';
import http from "http";
import querystring from "querystring";
import promisify from "nodefunc-promisify";
import webappAdapter from "../isotropy-adapter-webapp-browser";

describe("Isotropy Adapter WebApp", () => {

  const makeRequest = (host, port, path, method, headers, _postData) => {
    return new Promise((resolve, reject) => {
      const postData = (typeof _postData === "string") ? _postData : querystring.stringify(_postData);
      const options = { host, port, path, method, headers };

      let result = "";
      const req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(data) { result += data; });
        res.on('end', function() { resolve({ result, res }); });
      });
      req.on('error', function(e) { reject(e); });
      req.write(postData);
      req.end();
    });
  };

  let server, handler;

  beforeEach(async () => {
    server = http.createServer((req, res) => handler(req, res));
    const listen = promisify(server.listen.bind(server));
    await listen(0);
  });

  [false, true].forEach((toHtml) => {
    const desc = `end() a Request${toHtml ? " with an toHtml() wrapper" : ""}`;
    it(desc, async () => {
      handler = (req, res) => {
        const params = {
          req,
          res,
          args: {},
          handler: (req, res, args) => {
            res.end("Hello, world");
          }
        };
        if (toHtml) {
          params.toHtml = (html) => `<html><body>${html}</body></html>`
        }
        webappAdapter.render(params);
      }
      const { result } = await makeRequest("localhost", server.address().port, "/hello", "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, {});
      if (toHtml) {
        result.should.equal("<html><body>Hello, world</body></html>");
      } else {
        result.should.equal("Hello, world");
      }
    });
  });

  [false, true].forEach((toHtml) => {
    const desc = `write() to a Request${toHtml ? " with an toHtml() wrapper" : ""}`;
    it(desc, async () => {
      handler = (req, res) => {
        const params = {
          req,
          res,
          args: {},
          handler: (req, res, args) => {
            res.write("Hello, ");
            res.end("world");
          }
        };
        if (toHtml) {
          params.toHtml = (html) => `<html><body>${html}</body></html>`
        }
        webappAdapter.render(params);
      }
      const { result } = await makeRequest("localhost", server.address().port, "/hello", "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, {});
      if (toHtml) {
        result.should.equal("<html><body>Hello, world</body></html>");
      } else {
        result.should.equal("Hello, world");
      }
    });
  });

});
