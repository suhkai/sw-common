const http = require('http');


module.exports = function serialize(request) {
    const data = [
        `[request-url]`
    ];
    data.push(`url=${request.url}`, '[request-method]', `method=${request.method}`, '[request-headers]');
    for (const [header, headerValue] of Object.entries(request.headers)) {
        const encoded = headerValue.replace(/\n|\r|\t/mg, (code) => {
            switch (code) {
                case '\n':
                    return '\\n';
                case '\r':
                    return '\\r';
                case '\t':
                    return '\\t';
            }
        });
        data.push(`${header}=${encoded}`)
    }
    return data.join('\n');
}