const debug = require('debug')('koa-speed');
const path = require('path');
const merge = require('merge');
const events = require('events');

const Koa = require('koa');
const KoaBodyparser = require('koa-bodyparser');
const KoaRouter = require('koa-router');
const koaCompose = require('koa-compose');

const routerLoader = require('./routerLoader');

const healthCheckMiddleware = require('./middleware/healthCheckMiddleware');
const requestEnvMiddleware = require('./middleware/requestEnvMiddleware');
const headResultMiddleware = require('./middleware/headResultMiddleware');
const webLoggerMiddleware = require('./middleware/webLoggerMiddleware');
const ajaxFlagMiddleware = require('./middleware/ajaxFlagMiddleware');
const serverNameMiddleware = require('./middleware/serverNameMiddleware');
const customErrorMiddleware = require('./middleware/customErrorMiddleware');
const robotsMiddleware = require('./middleware/robotsMiddleware');

class KoaServer extends events.EventEmitter {
    constructor() {
        super();

        this.options = {
            host: null,
            port: 30001,
            serverName: true,
            healthCheck: true,
            requestEnv: false,
            headResult: false,
            appRoot: this._appRoot(),
            loggerWrapper: webLoggerMiddleware(),
            allowRobots: false
        };
    }

    _appRoot() {
        var appRoot = (function(_rootPath) {
            var parts = _rootPath.split(path.sep);
            parts.pop(); //get rid of /node_modules from the end of the path
            return parts.join(path.sep);
        })(module.parent.parent ? module.parent.parent.paths[0] : module.parent.paths[0]);

        return appRoot;
    }

    router(option) {
        return new KoaRouter(option);
    }

    optionValue(key, defaultValue) {
        let optionValue = this.options[key];
        if (optionValue != undefined) {
            return optionValue;
        } else {
            return defaultValue;
        }
    }

    start(options) {
        if (options) {
            merge(this.options, options);
        }

        debug('option', this.options);

        this.app = new Koa();
        this.mount();
        this.server();
    }

    mount() {
        debug('mount middleware');

        if (this.optionValue('requestEnv')) {
            this.app.use(requestEnvMiddleware());
        }
        if (this.optionValue('headResult')) {
            this.app.use(headResultMiddleware());
        }

        if (this.optionValue('preMount')) {
            this.optionValue('preMount')(this.app);
        }

        let bodySetting = this.optionValue('bodyParse', {});
        this.app.use(KoaBodyparser(bodySetting));
        this.app.use(ajaxFlagMiddleware());
        this.app.use(customErrorMiddleware(this.optionValue('customError')));

        if (this.optionValue('serverName')) {
            this.app.use(serverNameMiddleware());
        }

        if (this.optionValue('loggerWrapper')) {
            this.app.use(this.optionValue('loggerWrapper'));
        }
        if (this.optionValue('healthCheck')) {
            debug('open healthCheck')
            this.app.use(healthCheckMiddleware());
        }
        if (!this.optionValue('allowRobots', false)) {
            debug('open disable rebots')
            this.app.use(robotsMiddleware());
        }
        if (this.optionValue('preRouter')) {
            this.optionValue('preRouter')(this.app);
        }

        let routeList = routerLoader(this) || [];

        if (this.optionValue('postRouter')) {
            this.optionValue('postRouter')(routeList);
        }

        let routeMiddleware = [];
        routeList.forEach(function(router) {
            routeMiddleware.push(router.routes());
            routeMiddleware.push(router.allowedMethods());
        });
        debug('routeMiddleware', routeMiddleware.length);

        if (routeMiddleware.length) {
            this.app.use(koaCompose(routeMiddleware));
        }

        if (this.optionValue('postMount')) {
            this.optionValue('postMount')(app);
        }

        // Handle uncaught errors
        this.app.on('error', (err, ctx) => {
            this.onError(err, ctx);
        });
    }

    server() {
        let port = this.optionValue('port', 3000);
        let host = this.optionValue('host');
        debug('start server on port %s host %s', port, host);

        let server = this.app.listen(port, host, () => {
            debug('server is listening');
            this.emit('onListening', port, host, this.app, server);
        });

        server.on('error', err => {
            this.onError(err);
        });

        this.server = server;
    }

    onError(err, ctx) {
        debug('onError', err);
        this.emit('onError', err, ctx);
    }
}

module.exports = KoaServer;