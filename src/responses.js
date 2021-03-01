const _ = require('underscore');
const fs = require('fs');

const games = fs.readFileSync(`${__dirname}/../data/games.json`);
const activities = fs.readFileSync(`${__dirname}/../data/activities.json`);

let gamesJSON = JSON.parse(games);
let activityJSON = JSON.parse(activities);

const getBinarySize = (string) => Buffer.byteLength(string, 'utf8');

const respond = (request, response, content, type, status) => {
  const headers = {
    'Content-Type': type,
  };
  response.writeHead(status, headers);
  response.write(content);
  response.end();
};

const respondMeta = (request, response, status, size, type) => {
  const headers = {
    'Content-Type': type,
    'Content-Length': size,
  };
  response.writeHead(status, headers);
  response.end();
};

const notFound = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.write('<p>ERROR!</p>');
  response.end();
};

const getRandomGameJSON = (platform = 'all', number = 1) => {
  let limit = Number(number);
  limit = !limit ? 1 : limit;
  limit = limit < 1 ? 1 : limit;
  limit = limit > 5 ? 5 : limit;

  gamesJSON = _.shuffle(gamesJSON);

  const responseObj = [];
  for (let i = 0; i < limit; i += 1) {
    if (platform === 'all') responseObj.push(gamesJSON[i]);
  }
  return responseObj;
};

const getRandomActivityJSON = (type = 'any', number = 1) => {
  let limit = Number(number);
  limit = !limit ? 1 : limit;
  limit = limit < 1 ? 1 : limit;
  limit = limit > 5 ? 5 : limit;

  activityJSON = _.shuffle(activityJSON);

  const responseObj = [];
  for (let i = 0; i < limit; i += 1) {
    if (type === 'all') responseObj.push(gamesJSON[i]);
  }
  return responseObj;
};

const getRandomGame = (request, response, acceptedTypes, httpMethod, params) => {
  const responseObj = getRandomGameJSON(params.type, params.number);
  const { length } = responseObj;

  if (httpMethod === 'GET') {
    if (acceptedTypes[0] === 'text/xml') {
      let responseXML = '<games>';
      for (let i = 0; i < length; i += 1) {
        responseXML += `
                <game>
                    <name>Name: ${responseObj[i].name} </name>
                    <description>Description: ${responseObj[i].description} </description>
                    <platforms>Where to play: ${responseObj[i].platforms} </platforms>
                    <price>Cost: ${responseObj[i].price} </price>
                    <stores>Where to buy: ${responseObj[i].stores}</stores>
                </game>`;
      }
      responseXML += '</games>';
      return respond(request, response, responseXML, 'text/xml', 200);
    }

    const gamesString = JSON.stringify(responseObj);
    return respond(request, response, gamesString, 'application/json', 200);
  } if (httpMethod === 'HEAD') {
    if (acceptedTypes[0] === 'text/xml') {
      let responseXML = '<games>';
      for (let i = 0; i < length; i += 1) {
        responseXML += `
                <game>
                    <name>Name: ${responseObj[i].name} </name>
                    <description>Description: ${responseObj[i].description} </description>
                    <platforms>Where to play: ${responseObj[i].platforms} </platforms>
                    <price>Cost: ${responseObj[i].price} </price>
                    <stores>Where to buy: ${responseObj[i].stores}</stores>
                </game>`;
      }
      responseXML += '</games>';
      const size = getBinarySize(responseXML);
      return respondMeta(request, response, 200, size, 'text/xml');
    }

    const size = getBinarySize(JSON.stringify(responseObj));

    return respondMeta(request, response, 200, size, 'application/json');
  }

  return notFound(request, response);
};

const getRandomActivity = (request, response, acceptedTypes, httpMethod, params) => {
  const responseObj = getRandomActivityJSON(params.platform, params.number);
  const { length } = responseObj;

  if (httpMethod === 'GET') {
    if (acceptedTypes[0] === 'text/xml') {
      let responseXML = '<activities>';
      for (let i = 0; i < length; i += 1) {
        responseXML += `
                <activity>
                    <name>Name: ${responseObj[i].name} </name>
                    <description>Description: ${responseObj[i].description} </description>
                    <platforms>Where to play: ${responseObj[i].platforms} </platforms>
                    <price>Cost: ${responseObj[i].price} </price>
                </activity>`;
      }
      responseXML += '</activities>';
      return respond(request, response, responseXML, 'text/xml', 200);
    }

    const activityString = JSON.stringify(responseObj);
    return respond(request, response, activityString, 'application/json', 200);
  } if (httpMethod === 'HEAD') {
    if (acceptedTypes[0] === 'text/xml') {
      let responseXML = '<activities>';
      for (let i = 0; i < length; i += 1) {
        responseXML += `
                <activity>
                    <name>Name: ${responseObj[i].name} </name>
                    <description>Description: ${responseObj[i].description} </description>
                    <platforms>Where to play: ${responseObj[i].platforms} </platforms>
                    <price>Cost: ${responseObj[i].price} </price>
                </activity>`;
      }
      responseXML += '</activities>';
      const size = getBinarySize(responseXML);
      return respondMeta(request, response, 200, size, 'text/xml');
    }

    const size = getBinarySize(JSON.stringify(responseObj));

    return respondMeta(request, response, 200, size, 'application/json');
  }

  return notFound(request, response);
};

const printGames = (request, response) => respond(request, response, JSON.stringify(gamesJSON), 'application/json', 200);

const printActivities = (request, response) => respond(request, response, JSON.stringify(activityJSON), 'application/json', 200);

module.exports = {
  printGames, printActivities, getRandomActivity, getRandomGame,
};
