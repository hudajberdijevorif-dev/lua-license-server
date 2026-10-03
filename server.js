const http = require("http");

const PORT = process.env.PORT || 3000;

const KEYS = {
  "DEMO-1-DAY": 1,
  "DEMO-3-DAYS": 3,
  "DEMO-7-DAYS": 7
};

const activated = new Map();

function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/") {
    return send(res, 200, {
      ok: true,
      message: "License server ishlayapti!"
    });
  }

  if (req.method === "POST" && url.pathname === "/activate") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
      if (body.length > 4096) req.destroy();
    });

    req.on("end", () => {
      try {
        const { key } = JSON.parse(body);
        const days = KEYS[key];

        if (!days) {
          return send(res, 400, {
            ok: false,
            message: "Kalit noto'g'ri"
          });
        }

        if (!activated.has(key)) {
          activated.set(
            key,
            Date.now() + days * 24 * 60 * 60 * 1000
          );
        }

        return send(res, 200, {
          ok: true,
          expiresAt: new Date(activated.get(key)).toISOString()
        });
      } catch {
        return send(res, 400, {
          ok: false,
          message: "So'rov noto'g'ri"
        });
      }
    });

    return;
  }

  if (req.method === "GET" && url.pathname === "/check") {
    const key = url.searchParams.get("key");
    const expiry = activated.get(key);

    if (!expiry || Date.now() >= expiry) {
      return send(res, 200, {
        ok: false,
        message: "Kalit yaroqsiz yoki muddati tugagan"
      });
    }

    return send(res, 200, {
      ok: true,
      expiresAt: new Date(expiry).toISOString()
    });
  }

  return send(res, 404, {
    ok: false,
    message: "Topilmadi"
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server ${PORT} portda ishlayapti`);
});
