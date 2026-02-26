res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
res.setHeader("Access-Control-Allow-Credentials", "true");

const http = require("http");

let count = 0;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/api/tutorial/1") {
    if (req.method === "GET") {
      res.writeHead(200);
      res.end(JSON.stringify({ count }));
    } else if (req.method === "PUT") {
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", () => {
        const data = JSON.parse(body);
        count = data.count;
        res.writeHead(200);
        res.end(JSON.stringify({ count }));
      });
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(3000, () => {
  console.log("Mock REM server running at http://localhost:3000");
});
