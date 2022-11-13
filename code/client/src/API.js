import { Hike } from './model/Hike';
import { Hut } from './model/Hut';
import axios from "axios";

const SERVER_URL = 'http://localhost:3001/api/';

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


//ANCORA DA IMPLEMENTARE

const API = {

    browseHike: (hikeId) => {
      return new Promise((resolve, reject) => {
        axios.put(`${SERVER_URL}/hikes`)
              .then(res => resolve(res.data))
              .catch(err => reject(err));
      })
    },

    getHikeDetails: (hikeId) => {
        return new Promise((resolve, reject) => {
          axios.get(`${SERVER_URL}/hikes`)
                .then(res => resolve(res.data))
                .catch(err => reject(err));
        })
    },

    describeHut: (hutId) => {
      return new Promise((resolve, reject) => {
        axios.post(`${SERVER_URL}/huts`)
              .then(res => resolve(res.data))
              .catch(err => reject(err));
      })
    },
};

export default API;
