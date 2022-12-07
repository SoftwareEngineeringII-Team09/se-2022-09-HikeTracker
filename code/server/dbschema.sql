/* Tables */
DROP TABLE IF EXISTS "User";
CREATE TABLE IF NOT EXISTS "User" (
	"userId" INTEGER NOT NULL UNIQUE CHECK(typeof(userId) == "integer"),
	"email" TEXT NOT NULL UNIQUE CHECK(typeof(email) == "text"),
    "salt" TEXT NOT NULL CHECK(typeof(salt) == "text"),
    "password" TEXT NOT NULL CHECK(typeof(password) == "text"),
    "verificationCode" TEXT CHECK(typeof(verificationCode) == "text" OR (verificationCode) == NULL),
    "firstname" TEXT CHECK(typeof(firstname) == "text" OR typeof(firstname) == NULL),
    "lastname" TEXT CHECK(typeof(lastname) == "text" OR typeof(lastname) == NULL),
    "mobile" TEXT CHECK(typeof(mobile) == "text" OR typeof(mobile) == NULL),
    "role" TEXT NOT NULL CHECK(typeof(role) == "text"),
    "active" INTEGER NOT NULL CHECK(typeof(active) == "integer"),
    PRIMARY KEY("userId")
);

DROP TABLE IF EXISTS "Point";
CREATE TABLE IF NOT EXISTS "Point" (
	"pointId" INTEGER NOT NULL UNIQUE CHECK(typeof(pointId) == "integer"),
	"type" TEXT NOT NULL CHECK(typeof(type) == "text"),
    "parkingLot" INTEGER NOT NULL CHECK(typeof(parkingLot) == "integer"),
    "hut" INTEGER NOT NULL CHECK(typeof(hut) == "integer"),
    "nameOfLocation" TEXT CHECK(typeof(nameOfLocation) == "text" OR typeof(nameOfLocation) == NULL),
    "latitude" REAL NOT NULL CHECK(typeof(latitude) == "real"),
    "longitude" REAL NOT NULL CHECK(typeof(longitude) == "real"),
    "altitude" REAL NOT NULL CHECK(typeof(altitude) == "real"),
    PRIMARY KEY("pointId")
);

DROP TABLE IF EXISTS "ParkingLot";
CREATE TABLE IF NOT EXISTS "ParkingLot" (
    "parkingLotId" INTEGER NOT NULL UNIQUE CHECK(typeof(parkingLotId) == "integer"),
    "parkingLotName" TEXT NOT NULL CHECK(typeof(parkingLotName) == "text"),
    "pointId" INTEGER NOT NULL CHECK(typeof(pointId) == "integer"),
    "writerId" INTEGER NOT NULL CHECK(typeof(writerId) == "integer"),
    PRIMARY KEY("parkingLotId"),
    FOREIGN KEY("pointId") REFERENCES "Point"("pointId"),
    FOREIGN KEY("writerId") REFERENCES "User"("userId")
);

DROP TABLE IF EXISTS "Hut";
CREATE TABLE IF NOT EXISTS "Hut" (
    "hutId" INTEGER NOT NULL UNIQUE CHECK(typeof(hutId) == "integer"),
    "hutName" TEXT NOT NULL CHECK(typeof(hutName) == "text"),
    "pointId" INTEGER NOT NULL CHECK(typeof(pointId) == "integer"),
    "writerId" INTEGER NOT NULL CHECK(typeof(writerId) == "integer"),
    "city" INTEGER NOT NULL CHECK(typeof(city) == "integer"),
    "province" INTEGER NOT NULL CHECK(typeof(province) == "integer"),
    "region" INTEGER NOT NULL CHECK(typeof(region) == "integer"),
    "numOfBeds" INTEGER NOT NULL CHECK(typeof(numOfBeds) == "integer"),
    "cost" REAL NOT NULL CHECK(typeof(cost) == "real"),
    PRIMARY KEY("hutId"),
    FOREIGN KEY("pointId") REFERENCES "Point"("pointId"),
    FOREIGN KEY("writerId") REFERENCES "User"("userId")
);

DROP TABLE IF EXISTS "HutDailySchedule";
CREATE TABLE IF NOT EXISTS "HutDailySchedule" (
    "hutId" INTEGER NOT NULL CHECK(typeof(hutId) == "integer"),
    "day" INTEGER NOT NULL CHECK(typeof(day) == "integer"),
    "openTime" TEXT NOT NULL CHECK(typeof(openTime) == "text"), 
    "closeTime" TEXT NOT NULL CHECK(typeof(closeTime) == "text"),
    PRIMARY KEY("hutId", "day"),
    FOREIGN KEY("hutId") REFERENCES "Hut"("hutId")
);

DROP TABLE IF EXISTS "Hike";
CREATE TABLE IF NOT EXISTS "Hike" (
    "hikeId" INTEGER NOT NULL UNIQUE CHECK(typeof(hikeId) == "integer"),
    "title" TEXT NOT NULL CHECK(typeof(title) == "text"),
    "writerId" INTEGER NOT NULL CHECK(typeof(writerId) == "integer"),
    "trackPath" TEXT NOT NULL CHECK(typeof(trackPath) == "text"),
    "city" INTEGER NOT NULL CHECK(typeof(city) == "integer"),
    "province" INTEGER NOT NULL CHECK(typeof(province) == "integer"),
    "region" INTEGER NOT NULL CHECK(typeof(region) == "integer"),
    "length" REAL NOT NULL CHECK(typeof(length) == "real"),
    "expectedTime" TEXT NOT NULL CHECK(typeof(expectedTime) == "text"),
    "ascent" REAL NOT NULL CHECK(typeof(ascent) == "real"),
    "maxElevation" REAL NOT NULL CHECK(typeof(maxElevation) == "real"),
    "difficulty" TEXT NOT NULL CHECK(typeof(difficulty) == "text"),
    "description" TEXT NOT NULL CHECK(typeof(description) == "text"),
    "startPoint" INTEGER NOT NULL CHECK(typeof(startPoint) == "integer"),
    "endPoint" INTEGER NOT NULL CHECK(typeof(endPoint) == "integer"),
    PRIMARY KEY("hikeId"),
    FOREIGN KEY("writerId") REFERENCES "User"("userId"),
    FOREIGN KEY("startPoint") REFERENCES "Point"("pointId"),
    FOREIGN KEY("endPoint") REFERENCES "Point"("pointId")
);

DROP TABLE IF EXISTS "HikeHut";
CREATE TABLE IF NOT EXISTS "HikeHut" (
    "hikeId" INTEGER NOT NULL CHECK(typeof(hikeId) == "integer"),
    "hutId" INTEGER NOT NULL CHECK(typeof(hutId) == "integer"),
    PRIMARY KEY("hikeId", "hutId"),
    FOREIGN KEY("hikeId") REFERENCES "Hike"("hikeId"),
    FOREIGN KEY("hutId") REFERENCES "Hut"("hutId")
);

DROP TABLE IF EXISTS "HikeParkingLot";
CREATE TABLE IF NOT EXISTS "HikeParkingLot" (
    "hikeId" INTEGER NOT NULL CHECK(typeof(hikeId) == "integer"),
    "parkingLotId" INTEGER NOT NULL CHECK(typeof(parkingLotId) == "integer"),
    PRIMARY KEY("hikeId", "parkingLotId"),
    FOREIGN KEY("hikeId") REFERENCES "Hike"("hikeId"),
    FOREIGN KEY("parkingLotId") REFERENCES "ParkingLot"("parkingLotId")
);

DROP TABLE IF EXISTS "HikeRefPoint";
CREATE TABLE IF NOT EXISTS "HikeRefPoint" (
    "hikeId" INTEGER NOT NULL CHECK(typeof(hikeId) == "integer"),
    "pointId" INTEGER NOT NULL CHECK(typeof(pointId) == "integer"),
    PRIMARY KEY("hikeId", "pointId"),
    FOREIGN KEY("hikeId") REFERENCES "Hike"("hikeId"),
    FOREIGN KEY("pointId") REFERENCES "Point"("pointId")
);


/* Default data */
/* User table data */
INSERT INTO "User"("userId", "email", "salt", "password", "verificationCode", "firstname", "lastname", "mobile", "role", "active")
VALUES (1, "testHiker@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", NULL, NULL, NULL, NULL, "Hiker", 1);
INSERT INTO "User"("userId", "email", "salt", "password", "verificationCode", "firstname", "lastname", "mobile", "role", "active")
VALUES (2, "testLocalGuide@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", NULL, "Mario", "Rossi", "390123456789", "Local Guide", 1);
INSERT INTO "User"("userId", "email", "salt", "password", "verificationCode", "firstname", "lastname", "mobile", "role", "active")
VALUES (3, "testHutWorker@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", NULL, "Sara", "Rossi", "399876543210", "Hut Worker", 1);
INSERT INTO "User"("userId", "email", "salt", "password", "verificationCode", "firstname", "lastname", "mobile", "role", "active")
VALUES (4, "testEmergencyOperator@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", NULL, NULL, NULL, NULL, "Emergency Operator", 1);

/* Point table data */
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (1, "start point", 0, 1, NULL, 44.574250867590308, 6.982689192518592, 1757.43);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (2, "end point", 0,	0, "End point of Trial to Monte Ferra",	44.574263943359256, 6.982647031545639, 1809.34);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (3, "start point", 0 , 0, "Start point of Trial to Rocca Patanua", 45.14908790588379, 7.237061262130737, 1429.33806852415);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (4, "end point", 0, 0, "End point of Trial to Rocca Patanua", 45.17825868912041, 7.219639476388693, 2345.60486124045);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (5, "start point", 0, 1, NULL, 46.147128, 8.534505, 1265.850139);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (6, "end point", 0,	0, "End point of Trial to Monte Ziccher", 46.163437, 8.534103, 1978.786291);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (7, "start point", 0, 0, "Start point of Trial to Bivacco Gias Nuovo", 45.363406, 7.222457, 1209.93591);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (8, "end point", 0, 0, "End point of Trial to Bivacco Gias Nuovo", 45.36339, 7.222483, 1227.83801);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (9, "start point", 0, 0, "Start point of Trial to Monte Cristetto", 44.948397, 7.290876, 781.2);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (10, "end point", 0, 0, "End point of Trial to Monte Cristetto", 44.989283, 7.281253, 1525.3);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (11, "start point", 0, 1, NULL, 44.615494525060058, 7.053166581317782, 1500.76);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (12, "end point", 0, 0, "End point of Trial to Bivacco Berardo", 44.648342952132225, 7.072004824876785, 2702.88);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (13, "reference point", 0, 0, "Max elevation point of Trial to Monte Rocca Patanua", 44.6020830608904, 6.9847284257412, 3094.14);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (14, "reference point", 0, 0, "Max elevation point of Trial to Rocca Patanua", 45.1783776283264, 7.21914410591126, 2352.9619286962);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (15, "reference point", 0, 0, "Max elevation point of Trial to Monte Ziccher", 46.163437, 8.534103, 1978.786291);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (16, "reference point", 0, 0, "Max elevation point of Trial to Bivacco Gias Nuovo", 45.339905, 7.18368, 1891.73755);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (17, "reference point", 0, 0, "Max elevation point of Trial to Monte Cristetto", 44.989283, 7.281253, 1525.3);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (18, "reference point", 0, 0, "Max elevation point of Trial to Bivacco Berardo", 44.6483261045069, 7.07202368415892, 2702.88);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (19, "parking lot", 1, 0, NULL, 44.5799508675903, 6.98408919299859, 1757.43);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (20, "parking lot", 1, 0, NULL, 44.5749908675903, 6.98998919251859, 1757.43);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (21, "parking lot", 1, 0, NULL, 44.5749939993593, 6.98269703999564, 1809.34); 
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")
VALUES (22, "hut", 0, 1, NULL, 44.5799639433993, 6.98994703154964, 1809.34); 
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (23, "start point", 0, 0, "Start point of Poggio Tre Croci Ciaspole", 45.079073, 6.695705, 1318.7);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (24, "end point", 0,	0, "Start point of Poggio Tre Croci Ciaspole",	45.079097,6.695723, 1331.6);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (25, "start point", 0, 0,"Start point of San Michele", 45.099076, 7.354971, 390.667053);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (26, "end point", 0,	0, "End point of San Michele",	45.097073, 7.343123, 870.661011);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (27, "start point", 0,  0,"Start point of Punta Nera e Colle della Rho", 45.089292, 6.675187, 1683.9);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (28, "end point", 0,	0, "End point of Punta Nera e Colle della Rho",	45.089308, 6.675215, 1717.7);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (29, "start point", 0, 0, "Start point of Colombardo da Pratobotrile ", 45.1468026638,7.31685161591, 1018.02104731782);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (30, "end point", 0,	0, "End point of Colombardo da Pratobotrile",	45.14682345092, 7.31701573357, 1025.49197508288);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (31, "start point", 0, 0, "Start point of monte musine", 45.107742, 7.477332, 409.245361);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (32, "end point", 0,	0, "End point of monte musine",	45.113762,7.454839,1091.795166);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (33, "start point", 0, 0, "Start point of anello Rocca sella e monte sapei", 45.134888, 7.343993, 1071.106812);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (34, "end point", 0,	0, "End point of anello Rocca sella e monte sapei",	45.134431, 7.344251, 1058.459229);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (35, "start point", 0, 0, "Start point of Cima del Bosco", 44.937484078109264373779296875, 6.86268364079296588897705078125, 1554.5999755859375);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (36, "end point", 0,	0, "End point of Cima del Bosco",	44.9376612715423107147216796875, 6.8631246127188205718994140625, 1614.4000244140625);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (37, "start point", 0, 0," Start point ofAnello Val Servin", 45.302128, 7.221029, 1417.160889);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (38, "end point", 0,	0, "End point of  Anello Val Servin",	45.298574,7.219757, 1463.802734);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (39, "start point", 0, 0, "pian dell azaria", 45.539785, 7.534497, 1343.054443);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (40, "end point", 0,	0, "End point of pian dell azaria",	45.565481, 7.501388, 1658.425659);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (41, "start point", 0, 0, "Start point of  Monte Riba del Gias da Becetto", 44.597067581489682, 7.202494293451309,1545.460000000000036);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (42, "end point", 0,	0, "End point of  Monte Riba del Gias da Becetto",	44.621665952727199, 7.200692351907492, 2380.840000000000146);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (43, "start point", 0, 0, "Start point of  Borgata Rua-Cima di Crosa", 44.596613, 7.201825, 1506.479970);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (44, "end point", 0,	0, "End point of  Borgata Rua-Cima di Crosa",	44.615185, 7.177367, 2455.995572);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (45, "start point", 0, 0, "Start point of Lago Panelatte", 46.172037,8.459393, 1251.1);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (46, "end point", 0,	0, "End point of Lago Panelatte",	46.20274, 8.450575, 2149.2);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (47, "start point", 0, 0, "Start Point of Hike_Zicher", 46.147128, 8.534505,1265.850139);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (48, "end point", 0,	0, "End point of Hike_Zicher",	46.163437, 8.534103, 1978.786291);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (49, "start point", 0, 0, "Start point of Laghi Paione", 46.151141, 8.196038, 1621.6);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (50, "end point", 0,	0, "End point of Laghi Paione",	46.173033, 8.192136, 2159);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (51, "start point", 0, 0, "Start point rifugio paolo daviso", 45.364377, 7.223178, 1266.13171);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (52, "end point", 0,	0, "End point of rifugio paolo daviso",	45.364041,7.222142, 1273.87671);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (53, "start point", 0, 0, "Start point pietraborga da piossasco", 44.9941, 7.455977, 424.7);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (54, "end point", 0,	0, "End point of pietraborga da piossasco",	45.021651,7.421736, 885.9);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (55, "start point", 0, 0, "Start point alpe dattia da ala", 45.316959,7.304834, 1131.50122);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (56, "end point", 0,	0, "End point of alpe dattia da ala",	45.331211,7.298011, 1789.4397);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (57, "start point", 0, 0, "Start point rifugio Alagna Valsesia - Sorgenti del Sesia", 45.866059, 7.936636, 1258.5);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (58, "end point", 0,	0, "End point of rifugio Alagna Valsesia - Sorgenti del Sesia",	45.900313,7.907224, 2066.6);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (59, "start point", 0, 0, "Start point Lago di Afframont ",45.291582019999623, 7.237375248223543, 1410.3900000000001);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (60, "end point", 0,	0, "End point of Lago di Afframont ",	45.292359441518784,7.238771421834827, 2000.1600000000001);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude") 
VALUES (61, "start point", 0, 0, "Start point Laghetti Verdi e Lago Paschiet", 45.30031, 7.21939, 1446.4);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude", "altitude")  
VALUES (62, "end point", 0,	0, "End point of Laghetti Verdi e Lago Paschiet",	45.30031,7.21939, 1446.4);



/* Hike table data */		
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (1, "Trail to Monte Ferra", 2, "gpx/Monte_Ferra.gpx", 4017, 4, 1, 13.1, "01:20", 237.7, 3094.14, "Professional hiker", "Leaving the car in the large parking lot, we pass the Melezè Refuge and enter the small group of houses above the church of Sant''Anna, leaving behind the imposing building of the Excelsior holiday home. We take the clearly visible path which, with numerous hairpin bends, climbs rapidly on the grassy side up to a plateau where there are some ruins called Grange Reisassa. Here we find a crossroads with signs for Monte Ferra on the right and the hill of Fiutrusa on the left. We continue towards Monte ferra which now looks majestic in front of us, but still too far away. We gain altitude by reaching Lake Reisassa which can still be frozen at the beginning of the season. At this point we just have to go up the very steep path that winds through the debris until we reach the rocky ridge, where we turn left (westbound) and walk it up to the small iron cross placed to indicate our destination. The return path is the same as that of the ascent. NOTES: Poles are essential especially in the descent from Monte Ferra to Lake Reisassa. The only point of support is the Melezè refuge at the beginning of the itinerary (we recommend that you contact the hotel directly to check days and opening times).", 1, 2); 
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (2, "Trail to Rocca Patanua", 2, "gpx/Rocca_Patanua.gpx", 1093, 1, 1, 9.2, "03:00", 985.3, 2352.9619286962, "Hiker", "Patanua means naked in Piedmontese and this term probably refers to the characteristic rocky towers of this mountain, well exposed and visible even from afar. Rocca Patanua is a relatively low peak but able to give the hiker the satisfaction of already purely mountaineering conquest. In fact, its rocky crags, which are bypassed by the path, offer a great glance and a guaranteed panorama, clouds permitting. Once in Prarotto, going up from Condove, leave the car in the parking lot in front of the small church of the Madonna della Neve. On the opposite side of the road, the start of the path highlighted by the hiking signs is clearly evident. Then take path 564 following the signs for Rocca Patanua. The first part of the path develops in a wood with a prevalence of conifers and immediately rises. After about 2 km we leave the detour to the left for the town of Maffiotto and continue on the main path. Shortly after, at an altitude now close to 1900 meters, the wood gives way to large expanses of meadows and some old pastures (Alpe Formica). The view begins to open onto the Val di Susa and the panorama becomes more and more interesting. We soon reach the detour (564A) on the right for Alpe Tuluit, which we neglect. Proceeding almost along a very wide ridge, we reach a first knoll at an altitude of 2100 meters and a second at an altitude of 2200, from which another detour to the left branches off (path 532). The path now towards the final part becomes a hillside and goes around the Rocca Patanua towers to the left. In a few minutes, after a few simple steps on rock where you have to place your hands, we have reached the summit cross. Pay attention in the very last stretch, the only EE of the whole route, as it is quite exposed and with snow and ice it can be dangerous. For the return we follow the path of the outward journey. NOTES: Itinerary entirely facing south which normally clears the snow as early as early spring. (the itinerary was carried out in winter, followed by little and almost totally no snow cover).", 3, 4);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (3, "Trail to Monte Ziccher", 2, "gpx/Monte_Ziccher.gpx", 103024, 103, 1, 6.6, "01:40", 690.5, 1978.786291, "Tourist", "To reach the starting point by car, start from Craveggia, inhabited above Santa Maria Maggiore, and continue by car along the paved road that leads first to the La Doccia refuge, then to the Camoscio Refuge and, finally, to the Blitz Refuge. Park the car at the end of the paved road and take the path. Monte Ziccher is a panoramic mountain that rises between the Vigezzo Valley and the Swiss border of Locarno (Ticino canton, overlooking the northern shores of Lake Maggiore). From the summit you can enjoy a fantastic 360 degree view over the entire Vigezzo Valley, the neighboring mountains of Ticino Switzerland, some peaks of the Valais and even Monte Rosa. It is one of the typical hiking trails of the valley, also suitable for families. This description refers to the main ascent route from the south-west side of the mountain. Park the car and go up along an obvious path towards the Blitz oratory, which can be reached in about 10-15 minutes. After the oratory, cross a short stretch of wood and turn right onto a signposted path that leads to a group of huts well exposed to the sun. Continuing, you cross a group of cottages and a fountain to go up to the right and re-enter the wood. The path continues on a ridge and continues to climb rapidly gaining altitude in the coniferous forest. The trace is always clearly identifiable. Continuing you will come to a detour and turn right. Suddenly the forest ends, the view begins to sweep over the surrounding landscapes and you reach a steep meadow that leads to the ridge of the mountain. Climbing up the meadow, the foremost and, later, the summit ridge begins to become visible. This last section is climbed quickly with a path between the rocks. It requires attention, as the stretch is slightly exposed (especially when accompanied by children and / or dogs, on crowded days). From the summit of the Ziccher, the eye immediately stops on the underlying Val Vigezzo, until it reaches the Domodossola plain and, in perspective, the Rosa massif which rises with its distinguishable profile towards the south-west. The view is splendid and deserves a break of pure contemplation. NOTES: Full telephone coverage is not guaranteed along the itinerary In summer, the final part can be very exposed to the sun and require effort. In strong wind conditions, it is preferable not to continue It is possible to develop a circular itinerary descending from the north side of the mountain towards Bocchetta Sant''Antonio (but beware of a passage on rocks, especially if frozen).", 5, 6);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (4, "Trail to Bivacco Gias Nuovo", 2, "gpx/Bivacco_gias_nuovo.gpx", 1118, 1, 1, 14.6, "02:30", 674.4, 1891.73755, "Hiker", "Park the car in Forno Alpi Graie (parking spaces available at the beginning of the village or at the end of the village, before the bridge). After the bridge that passes over the Stura della Val Grande, turn left towards path 308 for Vallone di Sea. The path looks like a wide dirt road that immediately gains altitude, turning into a path surrounded by stones and low vegetation. Along the side walls it is possible to see walls equipped for climbing, while on some large boulders there are plates bearing famous phrases by mountaineers. The route runs along the bottom of the valley and runs along a stream that sometimes has natural pools and small waterfalls. After the bridge near the Gias Balma Massiet (1500 meters), continue to the second bridge near the Alpe di Sea (1792 meters). From here, take the path that passes through the buildings and you will reach the end of the Vallone, where the Gias Nuovo Bivacco is located. NOTES: Along the way there are no water and support points. The path is totally shaded, there are no points exposed to the sun. The bivouac looks like a triangular shaped wooden house, has about 8 beds (few mattresses and blankets available) and a small solar bat. From this area it is possible to leave for other excursions by crossing the Val d''Ala through the Ometto Pass (at the foot of the Uja di Mondrone) or continue in the direction of the Eugenio Ferreri Refuge.", 7, 8);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (5, "Trail to Monte Cristetto", 2, "gpx/Monte_Cristetto.gpx", 1191, 1, 1, 14.54, "03:30", 802.2, 1525.3, "Hiker", "Leave the car in the square in front of the church of Talucco (a hamlet of Pinerolo), take the path that starts on the right and follows the signs for Rifugio Casa Canada. The itinerary develops in a low mountain context and runs almost in its entirety the path of the ecomuseum of the Val Lemina charcoal burners. After crossing the Empire wood, so called because of its anthropogenic reforestation work, you will reach Colle Ciardonet after a first hour''s walk. From the hill it is possible to reach the Dairin hamlet or the Melano Casa Canada Refuge, which can be considered the only refreshment point of the itinerary. From the hill, go up towards the Sperina-Monte Freidour hill, following the easy path that climbs towards the upper Val Lemina (about another hour or so). Once you reach the top of Colle Sperina, you must then follow the ridge towards Colle Prà l''Abbà and Colle Ceresera (signs present), reaching the wide forest track that reaches Colle del Besso (1,468 m.a.s.l.). From the track it is possible to cut (with some effort) in the direction of the ridge that leads to the top of Monte Cristetto, or alternatively, to reach Colle del Besso and walk the ridge in its entirety. The Monte is located in the watershed between Val Lemina, Vallone del Grandubbione and Val Sangone. The view of the Eagle mountains and Punta della Merla is magnificent, and it is possible to observe the wild environment that stands out in the Vallone del Grandubbione, crossed by the tortuous stream of the same name. NOTES: The only recommendation is the scruple to be careful of possible encounters with shepherd dogs: the area is a place of transhumance in the late spring period.", 9, 10);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (6, "Trail to Bivacco Berardo", 2, "gpx/Bivacco_Berardo.gpx", 4172, 4, 1, 10.35, "03:00", 1102.3, 2702.88, "Professional hiker", "Leaving the car in the parking lot, we reach the fountain a little further on under the signs with all the information on the various routes that can be taken from the hamlet of Castello. We begin the climb with a very steep first stretch that flanks the artificial bed of the Vallanta stream, before it flows into the Pontechianale lake. Further on, the path softens as it enters the characteristic wood of the Alevè, the largest extension of pine in Italy and one of the largest in Europe. Leaving the wooded area we meet a group of stone ruins called Grange Gheite. At the junction for the Ezio Nicoli Path, turn right, after 100 meters a new junction shows us the path to the Berardo Bivouac on the left (about 2.00 hours) and for the Boarelli Bivouac on the right (about 2.30 hours). We continue to the left (Berardo Bivouac) and immerse ourselves completely in the woods following a narrow path that does not let you take a breath even for a second. We pass from 2000 m (Ezio Nicoli path junction) to 2710 of the Berardo bivouac in about 2km. The path does not present great difficulties except in its steepness especially in the final section where the bottom is a bit slippery and dusty. NOTES: The Berardo bivouac is an excellent base for tackling the climb to the Spire of the Forcioline.", 11, 12);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (7, "Trail to Laghetti Verdi e Lago Paschiet", 2, "gpx/Laghetti_Verdi_e_Lago_Paschiet.gpx", 1118,1, 1, 5.6, "02:10", 234.0, 2502.34, "Professional hiker", "Bivouac inside the Orsiera Rocciavrè Natural Park.", 61, 62);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (8, "Trail to Poggio Tre Croci Ciaspole", 2, "gpx/Poggio_Tre_Croci_Ciaspole.gpx", 1191, 1, 1, 14.3, "01:20", 1067.0, 2344.88, "Tourist", "From Borgo Vecchio (or alternatively from les Arnaud) where you leave your car, cross the bridge over the Rho, taking the military road that enters the beautiful wood.", 23, 24);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (9, "Trail to sacra di San Michele ", 2, "gpx/Sacra_di_San_Michele.gpx",1022, 1, 1, 20.34, "01:30", 404.4, 2102.88, "Hiker", "The Sacra di San Michele evokes beauty, charm and mystery. That mystery that surrounds it since its construction.", 25, 26);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (10, "Trail to Punta Nera e Colle della Rho", 2, "gpx/Punta_Nera_e_Colle_della_Rho.gpx", 1010, 1, 1, 12.43, "02:20", 1007.0, 2202.88, "Hiker", "From the Granges della Rho, which can be reached from Bardonecchia by a moderate road, continue on the dirt road, passing by the chapel of the Madonna of Montserrato", 27, 28);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (11, "Trail to Colombardo da Pratobotrile", 2, "gpx/Colombardo_da_Pratobotrile.gpx", 1049, 1, 1, 9.4, "01:50", 2300.0, 2102.88, "Professional hiker", "From the Civrari a deep and sunken valley leans towards the Susa valley, bathed by the Sessi stream, crossed by numerous service paths to the mountain pastures, many of which are now abandoned.", 29, 30);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (12, "Trail to monte musine", 2, "gpx/Monte_Musine.gpx", 1010, 1, 1, 5.3, "01:00", 500.0, 1202.88, "Tourist", "It is located at the beginning of the Val di Susa and affects the municipalities of Caselette, Almese and Val della Torre. It is the closest mountain to Turin, from 12 to 25 km as the crow flies depending on the location in the city, but despite its proximity, sometimes due to the haze in the plains and in the lower valley it is not visible", 31, 32);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (13, "Trail to anello Rocca sella e monte sapei ", 2, "gpx/Anello_Rocca_sella_e_monte_sapei.gpx", 1056, 1, 1, 6.0, "02:20", 1000.0, 2599.88, "Professional hiker", "It alternates simpler sections with more strenuous sections, due to the numerous rocks to climb over, but perhaps this is precisely what makes the path so captivating.", 33, 34);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (14, "Trail to Cima del Bosco", 2, "gpx/Cima_del_Bosco.gpx", 1032, 1, 1, 5.0, "01:12", 1100.0, 2702.88, "Professional hiker", "Very interesting excursion that goes up in the mainly larch wood, at first thick then gradually more sparse up to the final panettone.", 35, 36);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (15, "Trail to Anello Val Servin ", 2, "gpx/Anello_Val_Servin.gpx", 1001, 1, 1, 4.6, "02:45", 1000.0, 2602.88, "Hiker", "Come and follow in the footsteps of this mountain epic along the ring of ValServìn in the Balme basin, the highest municipality in the Valli di Lanzo.", 37, 38);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (16, "Trail to pian dell azaria ", 2, "gpx/Pian_dell_Azaria.gpx", 4172, 4, 1, 10.4, "03:00", 1100.0, 2702.88, "Hiker", "Leave the car in the Piazzale Campiglia Soana, take the dirt road that leads to Pian of Azaria. The route has only some climb to reach the broad plateau of the basin at the bottow of the rocky ridges of Rancio. A typical alpine forest mixed of deciduous and coniferous accompanied along the way to end in Gr. Barmaion only with beautiful specimens of spruce and larch trees. ", 39, 40);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (17, "Trail to Monte Riba del Gias da Becetto ", 2, "gpx/Monte_Riba_del_Gias_da_Becetto.gpx", 1002, 1, 1, 6.45, "01:34", 1900.0, 2102.88, "Tourist", "It is possible to start from different hamlets depending on the snow: Becetto 1387 m, Morelli 1426 m, Ruà di Becetto 1535 m", 41, 42);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (18, "Trail to Borgata Rua-Cima di Crosa ", 2, "gpx/Borgata_Rua-Cima_di_Crosa.gpx", 1013, 1, 1, 10.4, "03:10", 1320.0, 2502.88, "Hiker", "Possibility to start also from Becetto, adding just under 200 m to the altitude difference.", 43,44);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (19, "Trail to Lago Panelatte ", 2, "gpx/Lago_Panelatte.gpx", 1038, 1, 1, 10.4, "01:32", 600.0, 902.88, "Professional hiker", "in Arvogno, follow the paved road slightly downhill as far as the bridge over the Melezzo, beyond which you continue on either side of the road, which is closed to private traffic in this section.", 45, 46);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (20, "Trail to Hike_Zicher ", 2, "gpx/Hike_Zicher.gpx", 1045, 1, 1, 8.5, "02:10", 1000.0, 2502.88, "Hiker", "Hohbalm. Distance: 7.6 - 12.3 miles (Loop) Our favorite hike in Zermatt features magical views of the majestic Matterhorn and stunning panoramas of the 4,000-meter peaks towering above the Zermatt area. Gruben to Jungen via Augstbord Pass", 47,48);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (21, "Trail to Laghi Paione", 2, "gpx/Laghi_Paione.gpx", 1023, 1, 1, 9.2, "03:00", 1700.0, 2802.88, "Professional hiker", "The three Paione lakes are located at different levels and the waters of the upper lake feed the middle lake and so on, up to the lower one.", 49,50);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (22, "Trail to rifugio paolo daviso", 2, "gpx/Rifugio_Paolo_Daviso.gpx", 1022, 1, 1, 8.2, "02:20", 1804.4, 2402.88, "Professional hiker", "It starts from the village at the bottom of the valley of Forno Alpi Graie (60 km from Turin), it can be reached in 3 hours of walking along the excellent path n.315, with 1000 meters of elevation gain you cross streams and old pastures.", 51, 52);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (23, "Trail to pietraborga da piossasco ", 2, "gpx/Pietraborga_da_Piossasco.gpx", 1023, 1, 1, 10.4, "02:22", 3203.2, 2302.88, "Professional hiker", "From P.za San Vito (361 m) head east along via San Vito, after a few hundred meters turn left into via Monte Grappa. In this way you reach the edge of the Montano Park where the asphalt ends (1 km).", 53, 54);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (24, "Trail to alpe dattia da ala ", 2, "gpx/Alpe_dattia_da_ala.gpx", 1043, 1, 1, 9.4, "02:55", 1003.20, 2402.88, "Tourist", "Easy and panoramic itinerary on the peaks of the Val d'Ala, especially on the Uia di Mondrone which dominates in the foreground.", 55, 56);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (25, "Trail to Alagna Valsesia - Sorgenti del Sesia ", 2, "gpx/Alagna_Valsesia-Sorgenti_del_Sesia.gpx", 1045, 1, 1, 5.3, "01:11", 1100.0, 2702.88, "Professional hiker", "Alagna Valsesia is a comune and small village high in the Valsesia alpine valley in the province of Vercelli, Piedmont, northern Italy, ", 57, 58);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (26, "Trail to Lago di Afframont ", 2, "gpx/Lago_di_Afframont.gpx", 1034, 1, 1, 7.2, "02:40", 1564.2, 2002.88, "Professional hiker", "Beautiful walk, more demanding, in the presence of children, due to the slopes.", 59, 60);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (27, "Trail to the Bergerie di Valloncrò", 2, "gpx/Vallone_di_massello.gpx", 1145, 1, 1, 11.2, "02:40", 803.7, 2150.9, "Tourist", "Trail 216 starts among the houses before the bridge and begins to climb the valley on the orographic left of the stream. Going up the valley you find yourself in front of a beautiful basin, dominated by the imposing Pis waterfall, already visible from afar. The trail heads straight at first towards the base of the waterfall; then it begins to go up the rocky slope to the right, passing near the Lausoun mountain huts.", 61, 62);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (28, "Path to Monte Chaberton", 2, "gpx/Chaberton.gpx", 1270, 1, 1, 15002, "05:50", 1280, 1850, "Professional hiker", "Take the road to the right, immediately after the French border, leave your car in one of the many spaces on the right. The walking itinerary starts from a mule track on the left, equipped with a barrier, near a wooden sign illustrating the history of the Chaberton.", 63, 64);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (29, "Path to Bivacco Boarelli e laghi delle Forcioline", 2, "gpx/Sentiero_per_Bivacco_Boarelli_e_laghi_delle_Forcioline.gpx", 4172, 4, 1, 15006, "06:30", 1200, 2820, "Professional hiker", "We turn right entering the Forciolline valley and after about 50m we meet a second crossroads where we keep right in the direction of the Boarelli shelter which is about 2.30 hours from here.", 65, 66);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (30, "Path to Rocche San Martino and Monte Soffietto", 2, "gpx/Rocche_di_san_martino.gpx", 1007, 1, 1, 6500, "02:55", 460, 1448, "Tourist", "Reach the bottom of the Nero hamlet and park the car in the square that marks the end of the road. Take the path that descends to your right and continue along the wide roadway. Characteristic of this stretch is the beech forest.", 67, 68);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (31, "Path to Monte Freidour", 2, "gpx/Anello_monte_freidour.gpx", 1272, 1, 1, 8500, "05:00", 596, 1445, "Hiker", "Following the trail and the indications on the signs, you reach Colle Ciardonet (about 1080 meters above sea level), from which you continue along the forest road that develops to the right, in the direction of the Melano refuge (Casa Canada).", 69, 70);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (32, "Path to Roc d'le Masche", 2, "gpx/Roc_dle_masche.gpx", 1075, 1, 1, 990, "01:15", 340, 1570, "Tourist", "The route begins by crossing a pasture area, and then climbs the slopes in the woods. The path is easily identifiable thanks to the numerous white-red signs and trail markers. Gradually the forest thins out and you reach a rocky ledge, a panoramic point", 71, 72);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (33, "Path to Bric Costa Rossa", 2, "gpx/Sentiero_per_Bric_Costa_Rossa.gpx", 4110, 4, 1, 14003, "08:30", 1350, 2403, "Professional hiker", "The Bisalta, Cuneo's symbol mountain, is clearly distinguishable along the plain towards the city by its characteristic profile with two peaks: Cima Besimauda 2230m and Bric Costa Rossa 2403m.", 73, 74);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (34, "Path to Rifugio Quintino Sella and Viso Mozzo", 2, "gpx/Sentiero_per_Rifugio_Quintino_Sella_e_Viso_Mozzo.gpx", 4078, 4, 1, 14500, "07:30", 600, 2020, "Hiker", "After leaving the car in the large Pian del Re car park, we walk along the path that heads towards the source of the Po and then pass it by continuing along an initial short uphill stretch that allows us to reach Lake Fiorenza at an altitude of approximately 2113m. (25 min from Pian del Re)", 75, 76);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (35, "Path to Rifugio Giacoletti", 2, "gpx/Sentiero_per_il_Rifugio_Giacoletti.gpx", 4078, 4, 1, 8004, "04:30", 700, 2741, "Tourist", "Leave the car in the Pian del Re car park (cost €10 per day), walk along path V16 with indications for Colle delle Traversette for about 700m as far as the crossroads where we turn left continuing on path V17 to the Giacoletti refuge.", 77, 78);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (36, "Path to Stagno del Prè", 2, "gpx/Stagno_del_prè.gpx", 1177, 1, 1, 12008, "03:20", 160, 700, "Tourist", "A pleasant and quiet path, particularly suitable when you don't want to practice great differences in altitude. The path to the Stagno di Prè extends over a stretch of the Cammino di Oropa, at the foot of the Serra di Ivrea.", 79, 80);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (37, "Path to Rifugio Bertorello", 2, "gpx/Bertorello.gpx", 4157, 4, 1, 5009, "01:45", 205, 1375, "Tourist", "The starting point can be reached by taking the road to Pian Munè from Paesana. After about 7km you reach San Lorenzo at 1080m above sea level, continue by car for about 1200m until you reach a hairpin bend, from which the dirt road branches off to the left   for Rifugio Bertorello.", 81, 82);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (38, "Path to Rifugio Pontese", 2, "gpx/Rifugio_Pontese.gpx", 1134, 1, 1, 6006, "01:25", 370, 2217, "Hiker", "Once you arrive at the level of the dam you will immediately find the signs indicating the path to the Rifugio Pontese. The route initially runs along the lake, then a steep climb will follow, which will allow you to admire the splendid panorama from above.", 83, 84);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (39, "Path to Croce del faggio", 2, "gpx/Croce_del_faggio.gpx", 1134, 1, 1, 5007, "01:10", 340, 1400, "Hiker", "The Path to the Croce del Beech is really simple and easily identifiable. It's short, which makes it perfect for beginners and to be ridden all year round.", 85, 86);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (40, "Path to Fondo and Tallorno", 2, "gpx/Fondo_e_tallorno.gpx", 1278, 1, 1, 4600, "01:10", 200, 1222, "Tourist", "The path to the Fondo and Tallorno waterfall starts on the left of the bar over the bridge and runs alongside the river on a clearly visible mule track.", 87, 88);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (41, "Path to Rifugio Arlaud", 2, "gpx/Rifugio_Arlaud.gpx", 1175, 1, 1, 10007, "03:20", 250, 1800, "Tourist", "The route develops within the Gran Bosco di Salbertrand Natural Park, it is truly suggestive in winter because the snow that covers the trees is a unique spectacle.", 89, 90);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (42, "Path to Rifugio Amprimo", 2, "gpx/Amprimo.gpx", 1245, 1, 1, 4538, "01:25", 120, 1385, "Tourist", "The path to the Amprimo Hut from the town of Cortavetto is an easy destination for everyone, even those approaching the mountain for the first time, but no less fascinating for this.", 91, 92);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (43, "Anello Augusto Monti", 2, "gpx/Sentiero_Augusto_Monti.gpx", 1115, 1, 1, 8500, "02:30", 270, 814, "Tourist", "The start of the itinerary is in the immediate vicinity of the hamlet, there are panels that intend to show the origin of the itinerary.", 93, 94);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (44, "Path to Monte Muretto", 2, "gpx/Monte_Muretto.gpx", 1191, 1, 1, 4300, "01:40", 270, 820, "Tourist", "Particularly easy excursion and suitable for the whole family, also for the beautiful panorama visible from the top, obviously if the weather permits.", 95, 96);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (45, "Path to Lago Fauri", 2, "gpx/Lago_Fauri.gpx", 1201, 1, 1, 22500, "07:30", 1273, 2857, "Hiker", "ou reach the locality of Pattemouche, shortly after the main town of Pragelato, and continue by car along the road until you reach a large dirt clearing, before a bridge over the Chisone stream.", 97, 98);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (46, "Path to Colle della Croce Intror", 2, "gpx/Sentiero_per_Croce_Intror.gpx", 1272, 1, 1, 13500, "08:00", 1100, 1947, "Hiker", "The path climbs in a beautiful wood of hazelnut and chestnut trees and gradually gives way to majestic beech trees, where in spring we will be surrounded by the melodious song of birds and in autumn by carpets of dry leaves.", 99, 100);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (47, "Path to Cima di Bard", 2, "gpx/Cima_di_Bard.gpx", 1157, 1, 1, 14010, "05:30", 1442, 3168, "Professional hiker", "Traveling along the SS25 from Susa in the direction of the Moncenisio pass, you pass through the hamlet of Bar Cenisio where, once you have passed the few houses present, on the left, near a concrete house, an easy-to-travel dirt road begins with an even surface , which in a short time will take you to Lake Arpone (or Lake Arpon), where this excursion begins.", 101, 102);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (48, "Path for Colle della Crocetta", 2, "gpx/Colle_della_crocetta.gpx", 1073, 1, 1, 10400, "05:15", 1020, 2641, "Professional hiker", "Reach the starting point of the Path for Colle della Crocetta by  setting the navigator to 'Ceresole Reale'. At this point you can decide whether to park near the dam, cross it and head towards Villa Poma on foot, or you can continue to the end of the lake, turning left behind the Massimo Mila refuge, thus lengthening the itinerary.", 103, 104);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (49, "Red lake from Cortavetto", 2, "gpx/Lago_Rosso_passando_da_rifugi_Toesca_e_Valgravio.gpx.gpx", 1245, 1, 1, 20500, "07:30", 1100, 2280, "Professional hiker", "This loop excursion immersed in the Orsiera-Rocciavrè Nature Park offers beautiful landscape views and a route that is always very varied and never monotonous.", 105, 106);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (50, "Path to lake Mongioia and Monte Mongioia", 2, "gpx/Lago_e_Monte_Mongioia.gpx", 4017, 4, 1, 15030, "08:00", 1250, 3340, "Hiker", "After Chiazale, follow the signs for Sant'Anna di Bellino and once you get there, continue for another 500m following the signs for the Melezè refuge.", 107, 108);





/* Hut table data */
INSERT INTO "Hut"("hutId", "hutName", "pointId", "writerId", "city", "province", "region", "numOfBeds", "cost")
VALUES (1, "Rifugio Meleze'", 1, 1, 4017, 4, 1, 50, 50.0);
INSERT INTO "Hut"("hutId", "hutName", "pointId", "writerId", "city", "province", "region", "numOfBeds", "cost")
VALUES (2, "Rifugio Blitz", 5, 1, 103024, 103, 1, 60, 60.0);
INSERT INTO "Hut"("hutId", "hutName", "pointId", "writerId", "city", "province", "region", "numOfBeds", "cost")
VALUES (3, "Rifugio Aleve'", 11, 1, 4172, 4, 1, 60, 50.0);
INSERT INTO "Hut"("hutId", "hutName", "pointId", "writerId", "city", "province", "region", "numOfBeds", "cost")
VALUES (4, "Monte Ferra Hut'", 22, 1, 4172, 4, 1, 60, 50.0);

/* HikeHut data */
INSERT INTO "HikeHut"("hikeId", "hutId")
VALUES (1, 1);
INSERT INTO "HikeHut"("hikeId", "hutId")
VALUES (3, 2);
INSERT INTO "HikeHut"("hikeId", "hutId")
VALUES (6, 3);
INSERT INTO "HikeHut"("hikeId", "hutId")
VALUES (1, 4);

/* ParkingLot table data */
INSERT INTO "ParkingLot"("parkingLotId", "parkingLotName", "pointId", "writerId")
VALUES (1, "Monte Ferra Parking 1", 19, 1);
INSERT INTO "ParkingLot"("parkingLotId", "parkingLotName", "pointId", "writerId")
VALUES (2, "Monte Ferra Parking 2", 20, 1);
INSERT INTO "ParkingLot"("parkingLotId", "parkingLotName", "pointId", "writerId")
VALUES (3, "Monte Ferra Parking 3", 21, 1);

/* HikeParkingLot data */
INSERT INTO "HikeParkingLot"("hikeId", "parkingLotId")
VALUES (1, 1);
INSERT INTO "HikeParkingLot"("hikeId", "parkingLotId")
VALUES (1, 2);
INSERT INTO "HikeParkingLot"("hikeId", "parkingLotId")
VALUES (1, 3);

/* HikeRefPoint data */
INSERT INTO "HikeRefPoint"("hikeId", "pointId")
VALUES(1, 13);
INSERT INTO "HikeRefPoint"("hikeId", "pointId")
VALUES(2, 14);
INSERT INTO "HikeRefPoint"("hikeId", "pointId")
VALUES(3, 15);
INSERT INTO "HikeRefPoint"("hikeId", "pointId")
VALUES(4, 16);
INSERT INTO "HikeRefPoint"("hikeId", "pointId")
VALUES(5, 17);
INSERT INTO "HikeRefPoint"("hikeId", "pointId")
VALUES(6, 18);

/* HutDailySchedule data */
INSERT INTO "HutDailySchedule"("hutId", "day","openTime","closeTime")
VALUES(1, 1,"9:00","18:00");
INSERT INTO "HutDailySchedule"("hutId", "day","openTime","closeTime")
VALUES(1, 2,"9:00","18:00");
INSERT INTO "HutDailySchedule"("hutId", "day","openTime","closeTime")
VALUES(1, 7,"9:00","13:00");
INSERT INTO "HutDailySchedule"("hutId", "day","openTime","closeTime")
VALUES(2, 2,"9:00","18:00");
INSERT INTO "HutDailySchedule"("hutId", "day","openTime","closeTime")
VALUES(3, 2,"10:00","21:00");
INSERT INTO "HutDailySchedule"("hutId", "day","openTime","closeTime")
VALUES(3, 5,"8:15","18:00");





		
		
		
		
		
		
		
		
		
		
				
				
				
				
			
