let env = process.env.NODE_ENV;

let name = null;
if (env === 'production') {
    name = 'prd';
}
else if (!env || env == 'development') {
    name = 'dev';
} else {
    name = env;
}

module.exports = name;

