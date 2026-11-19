import zlib from "node:zlib";

export function simpleCompression(req, res, next) {
  const accept = req.headers["accept-encoding"] || "";
  if (!accept.includes("gzip") || req.method === "HEAD") return next();

  const originalSend = res.send.bind(res);
  res.send = (body) => {
    if (typeof body === "string" && body.length > 1024) {
      zlib.gzip(Buffer.from(body), (err, compressed) => {
        if (!err) {
          res.setHeader("Content-Encoding", "gzip");
          res.setHeader("Content-Length", compressed.length);
          return originalSend(compressed);
        }
        originalSend(body);
      });
      return res;
    }
    return originalSend(body);
  };
  next();
}
