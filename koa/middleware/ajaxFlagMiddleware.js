module.exports = function ajaxFlagMiddleware() {

    function setAjaxFlag(ctx) {
		let contentType = ctx.headers['content-type'] || '';
		contentType = contentType.toLowerCase();

		let flag = ctx.headers['x-requested-with'] || '';
		flag = flag.toLowerCase();

        ctx.isAjaxRequest = flag === 'xmlhttprequest' || contentType.indexOf('application/json') == 0;
    }

    return async function(ctx, next) {
        setAjaxFlag(ctx);

        return next();
    };
};