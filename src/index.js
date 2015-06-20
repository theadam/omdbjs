import request from 'superagent';

let baseUrl = 'http://www.omdbapi.com';

const oneOf = list => val => list.indexOf(val) >= 0 || `expects one of ${list}.  Got ${val}.`;
const isString = val => typeof val === 'string' || `expects a string. Got ${val}.`;
const isNumber = val => typeof val === 'number' || `expects a number. Got ${val}.`;

// Api function names to url params
const nameToParam = {
  id: 'i',
  title: 't',
  search: 's',
  type: 'type',
  year: 'y',
  format: 'r',
  plot: 'plot',
  tomatoes: 'tomatoes'
};

const assertions = {
  id: isString,
  title: isString,
  search: isString,
  type: oneOf(['movie', 'series', 'episode']),
  year: isNumber,
  format: oneOf(['json', 'xml']),
  plot: oneOf(['short', 'full']),
  tomatoes: oneOf([true, false])
};

const applyParam = (api, metadata, target, val) => {
  const assertion = assertions[target](val);
  if(assertion === true){
    metadata[nameToParam[target]] = val;
    return api;
  }
  else{
    throw new Error(`OMDb function ${target} ${assertion}`);
  }
};

const makeApiFunction = (api, metadata, target) => val => applyParam(api, metadata, target, val);

function makeFluentApi(keys, metadata){
  const api = {};

  keys.forEach(key => api[key] = makeApiFunction(api, metadata, key));

  return api;
}

const makeRequest = query => () => {
  return new Promise((res, rej) => {
    request
      .get(baseUrl)
      .query(query)
      .end((err, data) => {
        if(err) return rej(err);
        else return res(data);
      });
  });
};

const makeApi = (functionKeys, baseParamName, baseParam) => {
  const metadata = {};
  const api = makeFluentApi(functionKeys, metadata);
  applyParam(api, metadata, baseParamName, baseParam);
  api.request = makeRequest(metadata);
  return api;
};

export const setApiUrl = (url) => baseUrl = url;

const staticKeys = ['type', 'year', 'format', 'plot', 'tomatoes'];
const searchKeys = ['type', 'year', 'format'];

export const imdbId = (id) => makeApi(staticKeys, 'id', id);

export const title = (titleVal) => makeApi(staticKeys, 'title', titleVal);

export const searchTitle = (search) => makeApi(searchKeys, 'search', search);
