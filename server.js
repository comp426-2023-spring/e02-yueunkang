// https://nodejs.org/docs/latest-v18.x/api/module.html#modulecreaterequirefilename
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// https://www.npmjs.com/package/minimist
const minimist = require('minimist')
const args = minimist(process.argv.slice(2))
if (args.debug) {
    console.info('Minimist parsed and created the following `args` object:')
    console.info(args)
}

if (args.h || args.help) {
    console.log(`
usage: node server.js --port=5000

This package serves the static HTML, CSS, and JS files in a /public directory.
It also creates logs in a common log format (CLF) so that you can better.

  --stat,  -s    Specify the directory for static files to be served
                    Default: ./public/
  --port, -p    Specify the port for the HTTP server to listen on
                    Default: 8080
  --log,  -l    Specify the directory for the log files
                    Default: ./log/
  --help, -h    Displays this help message and exit 0 
                    (Does not work when run with nodemon)
  --debug       Echos more information to STDOUT so that you can see what is
                    stored in internal variables, etc.
    `)
    process.exit(0)
} 
import express from 'express'
// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fs = require('fs')
const morgan = require('morgan')
const logpath = args.log || args.l || process.env.LOGPATH || path.join(__dirname, 'log')
if (!fs.existsSync(logpath)){
    fs.mkdirSync(logpath);
}
if (args.debug) {
    console.info('HTTP server is logging to this directory:')
    console.info(logpath)
}
const app = express()
const port = args.port || args.p || process.env.PORT || 8080
app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    {stream: fs.createWriteStream(path.join(logpath, 'access.log')), flags: 'a' }
))

const staticpath = args.stat || args.s || process.env.STATICPATH || path.join(__dirname, 'public')
app.use('/', express.static(staticpath))


import {rps, rpsls} from "./lib/rpsls.js";
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/app', (req, res) => {
    res.status(200).send('200 OK').end();
});

/**
 * Random rps shot
 */
app.get('/app/rps', (req, res) => {
    res.status(200).send(JSON.stringify(rps(req.body.shot))).end();
})

/**
 * Random rpsls shot
 */
app.get('/app/rpsls', (req, res) => {
    res.status(200).send(JSON.stringify(rpsls(req.body.shot))).end();
})

/**
 * URLEncoded
 * Note: This is a GET
 * Example: http://localhost:5000/app/rps/play?shot=rock
 */
app.get('/app/rps/play', (req, res) => {
    res.status(200).send(JSON.stringify(rps(req.query.shot))).end();
})

/**
 * URLEncoded
 * Note: This is a GET
 * Example: http://localhost:5000/app/rps/play?shot=spock
 */
app.get('/app/rpsls/play', (req, res) => {
    res.status(200).send(JSON.stringify(rpsls(req.query.shot))).end();
})

/**
 * JSON
 * Note: This is a POST
 */
app.post('/app/rps/play', (req, res) => {
    res.status(200).send(JSON.stringify(rps(req.body.shot))).end();
})

/**
 * JSON
 * Note: This is a POST
 */
app.post('/app/rpsls/play', (req, res) => {
    res.status(200).send(JSON.stringify(rpsls(req.body.shot))).end();
})

/**
 * /:shot syntax allows for that field to be parsed
 */
app.get('/app/rps/play/:shot', (req, res) => {
    res.status(200).send(JSON.stringify(rps(req.params.shot))).end();
})

/**
 * /:shot syntax allows for that field to be parsed
 */
app.get('/app/rpsls/play/:shot', (req, res) => {
    res.status(200).send(JSON.stringify(rpsls(req.params.shot))).end();
})

/**
 * Default (non-existent) endpoint
 */
app.all('*', (req, res) => {
    res.status(404).send('404 NOT FOUND').end();
})

const server = app.listen(port)
let startlog = new Date().toISOString() + ' HTTP server started on port ' + port + '\n'
if (args.debug) {
    console.info(startlog)
} 
fs.appendFileSync(path.join(logpath, 'server.log'), startlog)
process.on('SIGINT', () => {
    let stoppinglog =  new Date().toISOString() + ' SIGINT signal received: stopping HTTP server\n'
    fs.appendFileSync(path.join(logpath, 'server.log'), stoppinglog)
    if (args.debug) {
        console.info('\n' + stoppinglog)
    }
    server.close(() => {
        let stoppedlog = new Date().toISOString() + ' HTTP server stopped\n'
        fs.appendFileSync(path.join(logpath, 'server.log'), stoppedlog)
        if (args.debug) {
            console.info('\n' + stoppedlog)
        }    
    })
})