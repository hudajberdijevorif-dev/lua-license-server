const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      ok: true,
      message: "License server ishlayapti!"
    }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ ok: false, message: "Topilmadi" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server ${PORT} portda ishlayapti`);
});
