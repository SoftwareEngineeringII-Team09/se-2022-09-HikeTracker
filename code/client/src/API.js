import { Hike } from './model/Hike';
import { Hut } from './model/Hut';

const SERVER_URL = 'http://localhost:3001/api/';

/**
 * A utility function for parsing the HTTP response.
 */
 function getJson(httpResponsePromise) {
    // server API always return JSON, in case of error the format is the following { error: <message> } 
    return new Promise((resolve, reject) => {
      httpResponsePromise
        .then((response) => {
          if (response.ok) {
  
           // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
           response.json()
              .then( json => resolve(json) )
              .catch( err => reject({ error: "Cannot parse server response" }))
  
          } else {
            // analyzing the cause of error
            response.json()
              .then(obj => 
                reject(obj)
                ) // error msg in the response body
              .catch(err => reject({ error: "Cannot parse server response" })) // something else
          }
        })
        .catch(err => 
          reject({ error: "Cannot communicate"  })
        ) // connection error
    });
  }

/**
 * Getting from the server side and returning the list of hikes.
 * The list of hikes could be filtered in the server-side through the optional parameter: filter.
 */
const getHikes = async (filter) => {
  return getJson(
    filter 
      ? fetch(SERVER_URL + 'hikes?filter=' + filter, { credentials: 'include' })
      : fetch(SERVER_URL + 'hikes', { credentials: 'include' })
  ).then( json => {
    return json.map((hike) => new Hike(hike))
  })
}


/** 
 * Getting and returning the definition of the filters from the server-side.
 * This functionality allows to dinamically change the filters without modifying the front-end.
 */ 
const getFilters = async () => {
  return getJson(
    fetch(SERVER_URL + 'filters', { credentials: 'include' })
  ).then( json => {
    return json;
  })
}

/**
 * Getting and returing a hike, specifying its hikeId.
 */
const getHike = async (hikeId) => {
  return getJson( fetch(SERVER_URL + 'hikes/' + hikeId, { credentials: 'include' }))
    .then( hike => new Hike(hike) )
}

/**
 * This function wants a hike object as parameter. If the hikeId exists, it updates the hike in the server side.
 */
function updateHike(hike) {
  return getJson(
    fetch(SERVER_URL + "hikes/" + hike.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(hike)
    })
  )
}

/**
 * This funciton adds a new hike in the back-end library.
 */
function addHike(hike) {
  return getJson(
    fetch(SERVER_URL + "hikes/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(hike) 
    })
  )
}

/**
 * This function deletes a hike from the back-end library.
 */
function deleteHike(hike) {
  return getJson(
    fetch(SERVER_URL + "hikes/" + hike.id, {
      method: 'DELETE',
      credentials: 'include'
    })
  )
}

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
  return getJson(fetch(SERVER_URL + 'sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  })
  )
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    credentials: 'include',
  })
  )
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
const logOut = async() => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  })
  )
}


const API = {logIn, getUserInfo, logOut, getHikes, updateHike, deleteHike, addHike, getHike, getFilters};
export default API;
