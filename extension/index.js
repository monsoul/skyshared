Array.prototype.asyncEach = async function(action) {
    let isAsync = Object.prototype.toString.call(action) === '[object AsyncFunction]';
    for (let i = 0; i < this.length; i++) {
        let item = this[i];
        isAsync ? await action(item) : action(item);
    }
}