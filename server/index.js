import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';


const __here = path.dirname(fileURLToPath(import.meta.url));
const __dirname = path.join(__here, '..');

const PORT = process.env.PORT || 5173;

const createServer = async (
    root = process.cwd(),
    isDev = process.env.NODE_ENV === 'development',
    hmrPort
) => {

    console.log(isDev ? 'ENV DEVELOPMENT' : 'ENV PRODUCTION');

    const app = express();

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

            const splits = req.originalUrl.split('?');

            const targetPath = splits[0];

            const filePath = path.join(__dirname, 'dist', targetPath);

            res.status(200).sendFile(filePath);
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

            res
                .status(200)
                .set({ 'Content-Type': 'text/html' })
                .end(transformedHtml);
        }
        catch (e) {

            vite.ssrFixStacktrace(e)
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    });


    return { app, vite };
};

createServer()
    .then(({ app }) => {

        return new Promise(resolve => {

            app.listen(PORT, resolve(PORT));
        });
    })
    .then(port => {

        console.log(`Server running => http://localhost:${port}`);
    });