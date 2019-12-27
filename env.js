const envs = require('./constant').envs;
let env = process.env.NODE_ENV;

let name = null;
if (env === 'production' || env == "prd") {
    name = envs.prd;
}
else if (!env || env == 'development') {
    name = envs.dev;
} else {
    name = env;
}

module.exports = name;

