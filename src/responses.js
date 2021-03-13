const _ = require('underscore');
const fs = require('fs');

const games = fs.readFileSync(`${__dirname}/../data/games.json`);
const activities = fs.readFileSync(`${__dirname}/../data/activities.json`);

let gamesJSON = JSON.parse(games);
let activityJSON = JSON.parse(activities);

const getBinarySize = (string) => Buffer.byteLength(string, 'utf8');

const filterArray = (list, filter, filterType) => {
  const items = [];
  list.forEach((item) => {
    const filterItem = item[filterType];
    filterItem.forEach((medium) => {
      if (filter === 'all') items.push(item);
      else if (medium.toLowerCase() === filter) items.push(item);
    });
  });

  return items;
};

const filterJSON = (collection, medium) => {
  let filtered = [];
  if (collection === 'games') {
    filtered = filterArray(gamesJSON, medium, 'platforms');
    return filtered;
  } if (collection === 'activities') {
    filtered = filterArray(activityJSON, medium, 'platforms');
    return filtered;
  }

  return filtered;
};

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

const getRandomGameJSON = (platform = 'all') => {
  let filteredJSON = [];
  gamesJSON = _.shuffle(gamesJSON);

  if (platform !== 'all') filteredJSON = filterJSON('games', platform);

  const responseObj = [];
  if (platform === 'all') {
    responseObj.push(gamesJSON[0]);
  } else {
    responseObj.push(filteredJSON[0]);
  }

  return responseObj;
};

const getRandomActivityJSON = (type = 'all') => {
  let filteredJSON = [];

  activityJSON = _.shuffle(activityJSON);
  if (type !== 'all') filteredJSON = filterJSON('activities', type);

  const responseObj = [];
  if (type === 'all') {
    responseObj.push(activityJSON[0]);
  } else {
    responseObj.push(filteredJSON[0]);
  }

  return responseObj;
};

const getRandomGame = (request, response, acceptedTypes, httpMethod, params) => {
  const responseObj = getRandomGameJSON(params.platform);
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
  const responseObj = getRandomActivityJSON(params.type);
  const { length } = responseObj;

  if (httpMethod === 'GET') {
    if (acceptedTypes[0] === 'text/xml') {
      let responseXML = '<activities>';
      for (let i = 0; i < length; i += 1) {
        responseXML += `
                <activity>
                    <name>Name: ${responseObj[i].name} </name>
                    <description>Description: ${responseObj[i].description} </description>
                    <platforms>Type of Activity: ${responseObj[i].platforms} </platforms>
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
                    <platforms>Type of Activity: ${responseObj[i].platforms} </platforms>
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

const findGame = (gameName) => {
  let gameIndex;
  for (let i = 0; i < Object.keys(gamesJSON).length; i += 1) {
    if (gamesJSON[i].name === gameName) gameIndex = i;
  }

  return gameIndex;
};

const addGame = (request, response, body) => {
  let responseCode = 400;
  const responseJSON = {
    id: 'missingParams',
    message: 'All params are required',
  };

  if (!body.name || !body.description || !body.platform || !body.price || !body.store) {
    return respond(request, response, JSON.stringify(responseJSON), 'application/json', responseCode);
  }
  const foundGame = findGame(body.name);
  if (foundGame) {
    responseCode = 204;
    gamesJSON[foundGame].description = body.description;
    gamesJSON[foundGame].platforms = body.platform.split(',');
    gamesJSON[foundGame].prices = body.price.split(',');
    gamesJSON[foundGame].stores = body.store.split(',');
    return respondMeta(request, response, responseCode, getBinarySize(JSON.stringify(body)), 'application/json');
  }

  const index = Object.keys(gamesJSON).length;

  gamesJSON[index] = {};
  gamesJSON[index].name = body.name;
  gamesJSON[index].description = body.description;
  const platforms = body.platform.split(',');
  gamesJSON[index].platforms = [];
  for (let i = 0; i < platforms.length; i += 1) {
    gamesJSON[index].platforms.push(platforms[i]);
  }
  // gamesJSON[index].platforms = body.platform.split(','); //["pc", "playstation"] "pc,playstation"
  gamesJSON[index].prices = body.price.split(',');
  gamesJSON[index].stores = body.store.split(',');

  responseCode = 201;
  responseJSON.id = gamesJSON[index].name;
  responseJSON.message = 'Created Successfully';
  return respond(request, response, JSON.stringify(responseJSON), 'application/json', responseCode);
};

const printGames = (request, response) => respond(request, response, JSON.stringify(gamesJSON), 'application/json', 200);

const printActivities = (request, response) => respond(request, response, JSON.stringify(activityJSON), 'application/json', 200);

module.exports = {
  printGames, printActivities, getRandomActivity, getRandomGame, addGame,
};
