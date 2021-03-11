const fs = require('fs');

const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);
const CSS = fs.readFileSync(`${__dirname}/../client/default-styles.css`);
const admin = fs.readFileSync(`${__dirname}/../client/admin.html`);
const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const app = fs.readFileSync(`${__dirname}/../client/app.html`);
const suggest = fs.readFileSync(`${__dirname}/../client/suggest.html`);
const image = fs.readFileSync(`${__dirname}/../client/image.png`);

const get404Response = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.write(errorPage);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/CSS' });
  response.write(CSS);
  response.end();
};

const getAdmin = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(admin);
  response.end();
};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getApp = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(app);
  response.end();
};

const getSuggest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(suggest);
  response.end();
};

const getImage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(image);
  response.end();
};

module.exports = {
  get404Response, getCSS, getAdmin, getIndex, getApp, getSuggest, getImage,
};
