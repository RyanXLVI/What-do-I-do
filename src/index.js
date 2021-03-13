const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses');
const responseHandler = require('./responses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/activity': responseHandler.getRandomActivity,
  '/game': responseHandler.getRandomGame,
  '/default-styles.css': htmlHandler.getCSS,
  '/admin': htmlHandler.getAdmin,
  '/': htmlHandler.getIndex,
  '/app': htmlHandler.getApp,
  '/suggest': htmlHandler.getSuggest,
  '/image.png': htmlHandler.getImage,
  '/all-games': responseHandler.printGames,
  '/all-activities': responseHandler.printActivities,
  notFound: htmlHandler.get404Response,
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/add-game') {
    const body = [];

    // https://nodejs.org/api/http.html
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString(); // name=tony&age=35
      const bodyParams = query.parse(bodyString); // turn into an object with .name & .age
      responseHandler.addGame(request, response, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const acceptedTypes = request.headers.accept.split(',');
  const { pathname } = parsedUrl;
  const params = query.parse(parsedUrl.query);
  const httpMethod = request.method;

  if (httpMethod === 'POST') {
    handlePost(request, response, parsedUrl);
    return;
  }

  if (urlStruct[pathname]) {
    urlStruct[pathname](request, response, acceptedTypes, httpMethod, params);
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
