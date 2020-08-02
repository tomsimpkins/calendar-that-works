import Bundler from "parcel-bundler";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(
  createProxyMiddleware("/foo", {
    target: "http://localhost:3000",
  })
);

const bundler = new Bundler("index.html");
app.use(bundler.middleware());

app.listen(Number(process.env.PORT || 1234));
