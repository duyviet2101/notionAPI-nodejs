module.exports = (app) => {
    app.use((req, res, next) => {
        const origin = req.headers.origin;

        if (/^http:\/\/localhost:\d+$/.test(origin) || origin === "https://foliastudy.com/") {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', '*');
        next();
      });
}