/* eslint-disable @typescript-eslint/ban-ts-comment */
const fs = require('fs');
const path = require('path');
const express = require('express');
const axios = require('axios');

axios.defaults.adapter = require('axios/lib/adapters/http');

async function createServer(root = process.cwd(), isProd = false) {
  const resolve = (p) => path.resolve(__dirname, p);
  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : '';
  // @ts-ignore
  const manifest = isProd ? require('./dist/client/ssr-manifest.json') : {};  
  const app = express();
  let vite;

    vite = await require('vite').createServer({
      root,
      logLevel: 'info',
      server: {
        middlewareMode: true
      }
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      let template, render;
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render;

      const [appHtml, state, links] = await render(url, manifest);

      const html = template
        .replace(`<!--preload-links-->`, links)
        .replace(`'<vuex-state>'`, state)
        .replace(`<!--app-html-->`, appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });
  return { app, vite };    
}

  createServer().then(({ app }) =>
    app.listen(3000, () => {
      console.log('http://localhost:3000');
    })
  );
exports.createServer = createServer;