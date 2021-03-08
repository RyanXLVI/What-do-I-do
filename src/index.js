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
  notFound: htmlHandler.get404Response,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const acceptedTypes = request.headers.accept.split(',');
  const { pathname } = parsedUrl;
  const params = query.parse(parsedUrl.query);
  const httpMethod = request.method;

  if (urlStruct[pathname]) {
    urlStruct[pathname](request, response, acceptedTypes, httpMethod, params);
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
