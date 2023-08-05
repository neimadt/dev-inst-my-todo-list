import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';


const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const PORT = process.env.PORT || 5173;

async function createServer(
    root = process.cwd(),
    isDev = process.env.NODE_ENV === 'development',
    hmrPort
) {

    console.log(isDev ? 'ENV DEVELOPMENT' : 'ENV PRODUCTION');

    const app = express()

    let vite;
    if (isDev) {

        vite = await import('vite');

        vite = await vite.createServer({
            root,
            logLevel: 'error',
            server: {
                middlewareMode: true,
                watch: {
                    // During tests we edit the files too fast and sometimes chokidar
                    // misses change events, so enforce polling for consistency
                    usePolling: true,
                    interval: 100,
                },
                hmr: {
                    port: hmrPort
                },
            },
            appType: 'custom',
        });

        app.use(vite.middlewares);
    }

    app.use(express.static(__dirname + '/public'));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());


    if (!isDev) {

        app.get('/assets/*', async (req, res) => {

            const targetPath = req.originalUrl.split('?')[0];

            res.status(200).sendFile(path.join(__dirname, 'dist', targetPath));
        });
    }

    app.get('/', async (req, res) => {

        try {

            const htmlpath = isDev
                ? path.join(__dirname, 'index.html')
                : path.join(__dirname, 'dist', 'index.html');

            const baseHtml = await fs.readFile(htmlpath, 'utf-8');
            const transformedHtml = vite
                ? await vite.transformIndexHtml(req.originalUrl, baseHtml)
                : baseHtml;

            res.status(200).set({ 'Content-Type': 'text/html' }).end(transformedHtml);
        }
        catch (e) {

            vite.ssrFixStacktrace(e)
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    });


    return { app, vite };
}

createServer()
    .then(({ app }) => {

        return app.listen(PORT);
    })
    .then(() => {

        console.log(`Server running => http://localhost:${PORT}`);
    });