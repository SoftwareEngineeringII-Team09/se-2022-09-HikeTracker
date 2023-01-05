"use strict";

const fs = require("fs");
const gpxParser = require("gpxparser");
const geodist = require('geodist')
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const {lastIndexOfRegex } = require('index-of-regex');
const Hike = require("../dao/model/Hike");
const Point = require("../dao/model/Point");
const User = require("../dao/model/User");
const PersistentManager = require("../dao/PersistentManager");
const UserManager = require("./UserManager");
const PointManager = require("./PointManager");
const ParkingLotManager = require("./ParkingLotManager");
const HutManager = require("./HutManager");
const HikeRefPointManager = require("./HikeRefPointManager");
const HikeHutManager = require("./HikeHutManager");

dayjs.extend(duration);
const gpx = new gpxParser();

class HikeManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new hike
   * @param {Hike} newHike
   * @returns a Promise with the hikeId value of the stored hike
   */
  async storeHike(newHike) {
    // Check if foreign key writerId exists
    const writerExists = await PersistentManager.exists(User.tableName, "userId", newHike.writerId);
    if (!writerExists) {
      return Promise.reject({
        code: 404,
        result: `No available writer with userId = ${newHike.writerId}`,
      });
    }
    // Check if foreign key startPoint exists
    const startPointExists = await PersistentManager.exists(Point.tableName, "pointId", newHike.startPoint);
    if (!startPointExists) {
      return Promise.reject({
        code: 404,
        result: `No available startPoint with pointId = ${newHike.startPoint}`,
      });
    }
    // Check if foreign key endPoint exists
    const endPointExists = await PersistentManager.exists(Point.tableName, "pointId", newHike.endPoint);
    if (!endPointExists) {
      return Promise.reject({
        code: 404,
        result: `No available endPoint with pointId = ${newHike.endPoint}`,
      });
    }

    return PersistentManager.store(Hike.tableName, newHike);
  }

  /**
   * Update a hike
   * @param {Hike} newHike
   * @param {String} attributeName
   * @param {any} value
   * @returns a Promise without any value if the hike exists, a rejected Promise with an object containing code and result otherwise
   */
  async updateHike(newHike, attributeName, value) {
    const exists = await this.existsHike(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with ${attributeName} = ${value}`,
      });
    }
    // Check if foreign key writerId exists
    const writerExists = await PersistentManager.exists(User.tableName, "userId", newHike.writerId);
    if (!writerExists) {
      return Promise.reject({
        code: 404,
        result: `No available writer with userId = ${newHike.writerId}`,
      });
    }
    // Check if foreign key startPoint exists
    const startPointExists = await PersistentManager.exists(Point.tableName, "pointId", newHike.startPoint);
    if (!startPointExists) {
      return Promise.reject({
        code: 404,
        result: `No available startPoint with pointId = ${newHike.startPoint}`,
      });
    }
    // Check if foreign key endPoint exists
    const endPointExists = await PersistentManager.exists(Point.tableName, "pointId", newHike.endPoint);
    if (!endPointExists) {
      return Promise.reject({
        code: 404,
        result: `No available endPoint with pointId = ${newHike.startPoint}`,
      });
    }

    return PersistentManager.update(
      Hike.tableName,
      newHike,
      attributeName,
      value
    );
  }

  /**
   * Delete a hike
   * @param {String} attributeName
   * @param {any} value
   * @returns a Promise without any value
   */
  async deleteHike(attributeName, value) {
    return PersistentManager.delete(Hike.tableName, attributeName, value);
  }

  /**
   * Delete all hikes
   * @returns a Promise without any value
   */
  async deleteAllHike() {
    return PersistentManager.deleteAll(Hike.tableName);
  }

  /**
   * Load all hikes
   * @returns a Promise with the list of all hikes
   */
  async loadAllHike() {
    return PersistentManager.loadAll(Hike.tableName);
  }

  /**
   * Check if the hike exists
   * @param {String} attributeName
   * @param {any} value
   * @returns a resolved Promise with true value in case the hike exists, a resolved Promise with false value otherwise
   */
  async existsHike(attributeName, value) {
    return PersistentManager.exists(Hike.tableName, attributeName, value);
  }

  /**
   * Load one hike by attribute
   * @param {String} attributeName
   * @param {any} value
   * @returns a resolved Promise with the hike in case there is one, a rejected Promise with an object containing code and result otherwise
   */
  async loadOneByAttributeHike(attributeName, value) {
    const exists = await this.existsHike(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with ${attributeName} = ${value}`,
      });
    }

    return PersistentManager.loadOneByAttribute(
      Hike.tableName,
      attributeName,
      value
    );
  }

  /**
   * Load all hikes by attribute
   * @param {String} attributeName
   * @param {any} value
   * @returns a Promise with the list of hikes that satisfy the condition
   */
  async loadAllByAttributeHike(attributeName, value) {
    return PersistentManager.loadAllByAttribute(
      Hike.tableName,
      attributeName,
      value
    );
  }
  /* ------------------------------------------------------------------------------------------------------------------- */

  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  // Define a new hike
  async defineHike(
    hikeData
  ) {
    // Parse the gpx to extract: length, ascent, maxElevation, startPoint, endPoint
    
    let gpxString = fs.readFileSync(`gpx/${hikeData.fileName}`).toString();

    gpx.parse(gpxString);
    const track = gpx.tracks[0];
    
    const ascent = track.elevation.max - track.elevation.min;
    const length = track.distance.total / 1000;
    const startPoint = track.points[0];
    const endPoint = track.points[track.points.length - 1];
    const maxElevation = track.elevation.max;
    const trackPath = `gpx/${hikeData.fileName}`;
    const imagePath = `hikeImage/${hikeData.hikeImageName}`;
    
    // Store the startPoint and retrieve the startPointId
    const startPointId = await PointManager.storePoint(
      new Point(
        null,
        "start point",
        0,
        0,
        `Start point of ${hikeData.title}`,
        startPoint.lat,
        startPoint.lon
      )
    );

    // Store the endPoint and retrieve the startPointId
    const endPointId = await PointManager.storePoint(
      new Point(
        null,
        "end point",
        0,
        0,
        `End point of ${hikeData.title}`,
        endPoint.lat,
        endPoint.lon
      )
    );

    return this.storeHike(
      new Hike(
        null,
        hikeData.title,
        hikeData.writerId,
        trackPath,
        hikeData.city,
        hikeData.province,
        hikeData.region,
        length,
        hikeData.expectedTime,
        ascent,
        maxElevation,
        hikeData.difficulty,
        hikeData.description,
        startPointId,
        endPointId,
        imagePath
      )
    );
  }

  // Return the list of all the hikes
  async getAllHikes() {
    let hikes = await this.loadAllHike();

    hikes = await Promise.all(
      hikes.map(async (h) => {
        const writer = await UserManager.loadOneByAttributeUser(
          "userId",
          h.writerId
        );
        const startPoint = await PointManager.loadOneByAttributePoint(
          "pointId",
          h.startPoint
        );
        const expectedTime = h.expectedTime.split(":");
        const hours = expectedTime[0];
        const minutes = expectedTime[1];

        const hike = {
          hikeId: h.hikeId,
          title: h.title,
          writer: {
            writerId: writer.userId,
            writerName: `${writer.firstname} ${writer.lastname}`, 
          },
          city: h.city,
          province: h.province,
          region: h.region,
          length: h.length,
          expectedTime: {
            hours: hours,
            minutes: minutes,
          },
          ascent: h.ascent,
          maxElevation: h.maxElevation,
          difficulty: h.difficulty,
          description: h.description,
          startPoint: {
            coords: [startPoint.latitude, startPoint.longitude]
          },
          hikeImage: h.hikeImage,
        };

        return hike;
      })
    );

    return Promise.resolve(hikes);
  }

  // Load a hike by hikeId
  async getHikeById(hikeId) {
    let hike = await this.loadOneByAttributeHike("hikeId", hikeId);
   
    const writer = await UserManager.loadOneByAttributeUser(
      "userId",
      hike.writerId
    );
    let startPoint = await PointManager.loadOneByAttributePoint(
      "pointId",
      hike.startPoint
    );
    let endPoint = await PointManager.loadOneByAttributePoint(
      "pointId",
      hike.endPoint
    );
    
    if (startPoint.hut) {
      const hutName = await HutManager.loadOneByAttributeHut(
        "pointId",
        startPoint.pointId
      ).then((hut) => hut.hutName);
      startPoint.nameOfLocation = hutName;
    } else if (startPoint.parkingLot) {
      const parkingName = await ParkingLotManager.loadOneByAttributeParkingLot(
        "pointId",
        startPoint.pointId
      ).then((parking) => parking.parkingLotName);
      startPoint.nameOfLocation = parkingName;
    }

    if (endPoint.hut) {
      const hutName = await HutManager.loadOneByAttributeHut(
        "pointId",
        endPoint.pointId
      ).then((hut) => hut.hutName);
      endPoint.nameOfLocation = hutName;
    } else if (endPoint.parkingLot) {
      const parkingName = await ParkingLotManager.loadOneByAttributeParkingLot(
        "pointId",
        endPoint.pointId
      ).then((parking) => parking.parkingLotName);
      endPoint.nameOfLocation = parkingName;
    }

    // Retrieving reference points
    let referencePoints =
      await HikeRefPointManager.loadAllByAttributeHikeRefPoint(
        "hikeId",
        hike.hikeId
      );
    if (referencePoints.length !== 0) {
      referencePoints = await Promise.all(
        referencePoints.map(async (rp) => {
          const point = await PointManager.loadOneByAttributePoint(
            "pointId",
            rp.pointId
          );
          return {
            name: point.nameOfLocation,
            coords: [point.latitude, point.longitude]
          };
        })
      );
    }

    // Retrieving huts linked to the hike
    let huts = await HikeHutManager.loadAllByAttributeHikeHut("hikeId", hikeId);
    huts = await Promise.all(
      huts.map(async (h) => {
        const hut = await HutManager.loadOneByAttributeHut("hutId", h.hutId);
        const hutPoint = await PointManager.loadOneByAttributePoint("pointId", hut.pointId);
        return {
          hutId: hut.hutId,
          hutName: hut.hutName,
          coords: [hutPoint.latitude, hutPoint.longitude] 
        };
      })
    ); 

    // Retrieving expected time
    const expectedTime = hike.expectedTime.split(":");
    const hours = expectedTime[0];
    const minutes = expectedTime[1];

    // Retrieving track points
    const gpx = new gpxParser();
    const gpxString = fs.readFileSync(hike.trackPath).toString();
    gpx.parse(gpxString);
    let track = gpx.tracks[0].points.map((p) => [p.lat, p.lon]);
    track[0] = [startPoint.latitude, startPoint.longitude];
    track[track.length - 1] = [endPoint.latitude, endPoint.longitude];

    hike = {
      hikeId: hike.hikeId,
      title: hike.title,
      writer: {
        writerId: writer.userId,
        writerName: `${writer.firstname} ${writer.lastname}`, 
      },
      city: hike.city,
      province: hike.province,
      region: hike.region,
      length: hike.length,
      expectedTime: {
        hours: hours,
        minutes: minutes
      },
      ascent: hike.ascent,
      maxElevation: hike.maxElevation,
      difficulty: hike.difficulty,
      description: hike.description,
      startPoint: {
        name: startPoint.nameOfLocation,
        coords: [startPoint.latitude, startPoint.longitude]
      },
      endPoint: {
        name: endPoint.nameOfLocation,
        coords: [endPoint.latitude, endPoint.longitude]
      },
      hikeImage:hike.hikeImage,
      huts: huts,
      referencePoints: referencePoints,
      track: track
    };

    return Promise.resolve(hike);
  }

  // Return path of a gpx file by hikeId
  async getGpxPath(hikeId) {
    const gpxPath = await this.loadOneByAttributeHike("hikeId", hikeId).then(
      (hike) => hike.trackPath
    );

    return Promise.resolve(gpxPath);
  }

  //Return the list of potential huts info for a given hike
  async getPotentialHuts(hikeId){
    const maxDiameter = 5;
    // get all coor in file
    let hike = await this.loadOneByAttributeHike("hikeId", hikeId);
    const gpx = new gpxParser();
    const gpxString = fs.readFileSync(hike.trackPath).toString();
    gpx.parse(gpxString);
    let tracks = gpx.tracks[0].points.map((p) => [p.lat, p.lon]);
   
    //get all huts coordinate
    let hutsInfo = await PointManager.loadAllByAttributePoint("hut",1);
  

    //calculate and add all possible huts in list
    let HutPointInfo = new Set();
    let res =[] ;
  
    function rad(d){
      return d * Math.PI / 180.0;
    }

    tracks.map((tr) => {
      let lon1 = tr[1];
      let lat1 = tr[0];
     
      hutsInfo.map(async (h) =>{
        let R = 6371;
        let dLat = rad(h.latitude - lat1);
        let dLon = rad(h.longitude - lon1);

        let radlat1 = rad(lat1);
        let radlat2 = rad(h.latitude);  
       
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(radlat1 ) * Math.cos(radlat2 ) * Math.sin(dLon/2) * Math.sin(dLon/2);
	      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	      let d = R * c;    
        if(!HutPointInfo.has(h) && d < maxDiameter){          
          HutPointInfo.add(h);
        }
      }) 
            
    }) 

  
  
   let candiArray = Array.from(HutPointInfo);
    await Promise.all(candiArray.map(async(h) =>{
      let hutAllInfo = await HutManager.getHutByPointId(h.pointId);   
      res.push(hutAllInfo);
      
    }) )
    let potentialHuts = {
      potentialHuts: res
      
    };   
    return potentialHuts;
    
  }

  // Return the list of potential start and end points for a given hike
  async getPotentialStartEndPoints(hikeId) {
    const maxDistance = 5.0;
    const hike = await this.loadOneByAttributeHike("hikeId", hikeId);
    const startPoint = await PointManager.loadOneByAttributePoint("pointId", hike.startPoint);
    const endPoint = await PointManager.loadOneByAttributePoint("pointId", hike.endPoint);
    let potentialStartEndPointHuts = await HutManager.loadAllHut();
    let potentialStartEndPointParkingLots = await ParkingLotManager.loadAllParkingLot();

    // Asynchronous filter use to filter huts and parking lots  
    const asyncFilter = async (array, predicate) => {
      const results = await Promise.all(array.map(predicate));
      return array.filter((_v, index) => results[index]);
    }

    // Filtering huts that have pointId = startPoint.pointId or pointId = endPoint.pointId
    potentialStartEndPointHuts = await asyncFilter(potentialStartEndPointHuts, async (psph) => {
      const hutPointId = await HutManager.loadOneByAttributeHut("hutId", psph.hutId).then(h => h.pointId);
      return hutPointId !== startPoint.pointId && hutPointId !== endPoint.pointId;
    });

    // Filtering parkingLots that have pointId = startPoint.pointId or pointId = startPoint.pointId
    potentialStartEndPointParkingLots = await asyncFilter(potentialStartEndPointParkingLots, async (psppl) => {
      const parkingLotPointId = await ParkingLotManager.loadOneByAttributeParkingLot("parkingLotId", psppl.parkingLotId).then(pl => pl.pointId);
      return parkingLotPointId !== startPoint.pointId && parkingLotPointId !== endPoint.pointId;
    });

    // Retrieving the list of potential start-end point huts with coordinates 
    potentialStartEndPointHuts = await Promise.all(
      potentialStartEndPointHuts.map(async (psph) => {
        const hut = await HutManager.loadOneByAttributeHut("hutId", psph.hutId);
        const hutPoint = await PointManager.loadOneByAttributePoint("pointId", hut.pointId);

        return {
          type: "hut",
          id: hut.hutId,
          name: hut.hutName,
          coords: [hutPoint.latitude, hutPoint.longitude]
        };
      })
    );

    // Retrieving the list of potential start-end point parking lots with coordinates
    potentialStartEndPointParkingLots = await Promise.all(
      potentialStartEndPointParkingLots.map(async (psppl) => {
        const parkingLot = await ParkingLotManager.loadOneByAttributeParkingLot("parkingLotId", psppl.parkingLotId);
        const parkingLotPoint = await PointManager.loadOneByAttributePoint("pointId", parkingLot.pointId);

        return {
          type: "parking lot",
          id: parkingLot.parkingLotId,
          name: parkingLot.parkingLotName,
          coords: [parkingLotPoint.latitude, parkingLotPoint.longitude]
        };
      })
    );

    let potentialStartPointHuts = potentialStartEndPointHuts;
    let potentialEndPointHuts = potentialStartEndPointHuts;
    let potentialStartPointParkingLots = potentialStartEndPointParkingLots;
    let potentialEndPointParkingLots = potentialStartEndPointParkingLots;

    // Filtering start point huts by distance from start point and selecting between huts that are close to both the start point and the end point 
    potentialStartPointHuts = potentialStartPointHuts.filter(psph => {
      const distanceFromStartPoint = geodist({ lat: psph.coords[0], lon: psph.coords[1] }, { lat: startPoint.latitude, lon: startPoint.longitude }, { exact: true, unit: 'km' });
      const distanceFromEndPoint = potentialEndPointHuts.some(peph => peph.id === psph.id) && geodist({ lat: psph.coords[0], lon: psph.coords[1] }, { lat: endPoint.latitude, lon: endPoint.longitude }, { exact: true, unit: 'km' });
      if (distanceFromStartPoint > maxDistance) {
        return false;
      } else if (distanceFromEndPoint !== false) {
        if (distanceFromStartPoint <= distanceFromEndPoint) {
          potentialEndPointHuts = potentialEndPointHuts.filter(peph => peph.id !== psph.id);
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });

    // Filtering end point huts by distance from end point
    potentialEndPointHuts = potentialEndPointHuts.filter(peph => {
      const distanceFromEndPoint = geodist({ lat: peph.coords[0], lon: peph.coords[1] }, { lat: endPoint.latitude, lon: endPoint.longitude }, { exact: true, unit: 'km' });
      return distanceFromEndPoint <= maxDistance;
    });

    // Filtering start point parking lots by distance from start point and selecting between parking lots that are close to both the start point and the end point
    potentialStartPointParkingLots = potentialStartPointParkingLots.filter(psppl => {
      const distanceFromStartPoint = geodist({ lat: psppl.coords[0], lon: psppl.coords[1] }, { lat: startPoint.latitude, lon: startPoint.longitude }, { exact: true, unit: 'km' });
      const distanceFromEndPoint = potentialEndPointParkingLots.some(peppl => peppl.id === psppl.id) && geodist({ lat: psppl.coords[0], lon: psppl.coords[1] }, { lat: endPoint.latitude, lon: endPoint.longitude }, { exact: true, unit: 'km' });
      if (distanceFromStartPoint > maxDistance) {
        return false;
      }
      else if (distanceFromEndPoint !== false) {
        if (distanceFromStartPoint <= distanceFromEndPoint) {
          potentialEndPointParkingLots = potentialEndPointParkingLots.filter(peppl => peppl.id !== psppl.id);
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });

    // Filtering end point parking lots by distance from end point
    potentialEndPointParkingLots = potentialEndPointParkingLots.filter(peppl => {
      const distanceFromEndPoint = geodist({ lat: peppl.coords[0], lon: peppl.coords[1] }, { lat: endPoint.latitude, lon: endPoint.longitude }, { exact: true, unit: 'km' });
      return distanceFromEndPoint <= maxDistance;
    });

    let potentialStartEndPoints = {
      potentialStartPoints: [...potentialStartPointHuts, ...potentialStartPointParkingLots],
      potentialEndPoints: [...potentialEndPointHuts, ...potentialEndPointParkingLots],
    };

    return Promise.resolve(potentialStartEndPoints);
  }

  // Update the start point of a hike by hikeId
  async updateStartPoint(hikeId, newStartPoint) {
    const hike = await this.loadOneByAttributeHike("hikeId", hikeId);
    const oldStartPoint = await PointManager.loadOneByAttributePoint("pointId", hike.startPoint);

    // Check if the start point is a hut or a parking lot and update the hike
    if (newStartPoint.type === "hut") {
      const hut = await HutManager.loadOneByAttributeHut("hutId", newStartPoint.id);
      const hutPoint = await PointManager.loadOneByAttributePoint("pointId", hut.pointId);
      await PointManager.updatePoint({ ...hutPoint, type: "start point" }, "pointId", hutPoint.pointId);
      await this.updateHike({ ...hike, startPoint: hutPoint.pointId }, "hikeId", hike.hikeId);
    } else if (newStartPoint.type === "parking lot") {
      const parkingLot = await ParkingLotManager.loadOneByAttributeParkingLot("parkingLotId", newStartPoint.id);
      const parkingLotPoint = await PointManager.loadOneByAttributePoint("pointId", parkingLot.pointId);
      await PointManager.updatePoint({ ...parkingLotPoint, type: "start point" }, "pointId", parkingLotPoint.pointId);
      await this.updateHike({ ...hike, startPoint: parkingLotPoint.pointId }, "hikeId", hike.hikeId)
    }

    // Update the old start point
    if (!oldStartPoint.parkingLot && !oldStartPoint.hut) {
      await PointManager.deletePoint("pointId", oldStartPoint.pointId);
    } else if (oldStartPoint.parkingLot) {
      await PointManager.updatePoint({ ...oldStartPoint, type: "parking lot" }, "pointId", oldStartPoint.pointId);
    } else if (oldStartPoint.hut) {
      await PointManager.updatePoint({ ...oldStartPoint, type: "hut" }, "pointId", oldStartPoint.pointId);
    }

    return Promise.resolve();
  }

  // Update the end point of a hike by hikeId
  async updateEndPoint(hikeId, newEndPoint) {
    const hike = await this.loadOneByAttributeHike("hikeId", hikeId);
    const oldEndPoint = await PointManager.loadOneByAttributePoint("pointId", hike.endPoint);
    
    // Check if the end point is a hut or a parking lot and update the hike
    if (newEndPoint.type === "hut") {
      const hut = await HutManager.loadOneByAttributeHut("hutId", newEndPoint.id);
      const hutPoint = await PointManager.loadOneByAttributePoint("pointId", hut.pointId);
      await PointManager.updatePoint({ ...hutPoint, type: "end point" }, "pointId", hutPoint.pointId);
      await this.updateHike({ ...hike, endPoint: hutPoint.pointId }, "hikeId", hike.hikeId);
    } else if (newEndPoint.type === "parking lot") {
      const parkingLot = await ParkingLotManager.loadOneByAttributeParkingLot("parkingLotId", newEndPoint.id);
      const parkingLotPoint = await PointManager.loadOneByAttributePoint("pointId", parkingLot.pointId);
      await PointManager.updatePoint({ ...parkingLotPoint, type: "end point" }, "pointId", parkingLotPoint.pointId);
      await this.updateHike({ ...hike, endPoint: parkingLotPoint.pointId }, "hikeId", hike.hikeId)
    }

    // Update the old end point
    if (!oldEndPoint.parkingLot && !oldEndPoint.hut) {
      await PointManager.deletePoint("pointId", oldEndPoint.pointId);
    } else if (oldEndPoint.parkingLot) {
      await PointManager.updatePoint({ ...oldEndPoint, type: "parking lot" }, "pointId", oldEndPoint.pointId);
    } else if (oldEndPoint.hut) {
      await PointManager.updatePoint({ ...oldEndPoint, type: "hut" }, "pointId", oldEndPoint.pointId);
    }

    return Promise.resolve();
  }
}

module.exports = new HikeManager();
