/* Tables */
DROP TABLE IF EXISTS "User";
CREATE TABLE IF NOT EXISTS "User" (
	"userId" INTEGER NOT NULL UNIQUE CHECK(typeof(userId) == "integer"),
	"email" TEXT NOT NULL UNIQUE CHECK(typeof(email) == "text"),
    "salt" TEXT NOT NULL CHECK(typeof(salt) == "text"),
    "password" TEXT NOT NULL CHECK(typeof(password) == "text"),
    "verificationCode" TEXT CHECK(typeof(verificationCode) == "text" OR typeof(verificationCode) == NULL),
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
    PRIMARY KEY("pointId")
);

DROP TABLE IF EXISTS "ParkingLot";
CREATE TABLE IF NOT EXISTS "ParkingLot" (
    "parkingLotId" INTEGER NOT NULL UNIQUE CHECK(typeof(parkingLotId) == "integer"),
    "parkingLotName" TEXT NOT NULL CHECK(typeof(parkingLotName) == "text"),
    "pointId" INTEGER NOT NULL CHECK(typeof(pointId) == "integer"),
    "writerId" INTEGER NOT NULL CHECK(typeof(writerId) == "integer"),
    "capacity" INTEGER NOT NULL CHECK(typeof(capacity) == "integer"),
    "altitude" REAL CHECK(typeof(altitude) == "real"  OR typeof(altitude) == NULL),
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
    "altitude" REAL NOT NULL CHECK(typeof(altitude) == "real"),
    "phone" TEXT NOT NULL CHECK(typeof(phone) == "text"),
    "email" TEXT NOT NULL CHECK(typeof(email) == "text"),
    "website" TEXT CHECK(typeof(website) == "text" OR typeof(website) == NULL),
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
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (1, "start point", 0, 1, NULL, 44.574250867590308, 6.982689192518592);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (2, "end point", 0,	0, "End point of Trial to Monte Ferra",	44.574263943359256, 6.982647031545639);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (3, "start point", 0 , 0, "Start point of Trial to Rocca Patanua", 45.14908790588379, 7.237061262130737);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (4, "end point", 0, 0, "End point of Trial to Rocca Patanua", 45.17825868912041, 7.219639476388693);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (5, "start point", 0, 1, NULL, 46.147128, 8.534505);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (6, "end point", 0,	0, "End point of Trial to Monte Ziccher", 46.163437, 8.534103);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (7, "start point", 0, 0, "Start point of Trial to Bivacco Gias Nuovo", 45.363406, 7.222457);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (8, "end point", 0, 0, "End point of Trial to Bivacco Gias Nuovo", 45.36339, 7.222483);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (9, "start point", 0, 0, "Start point of Trial to Monte Cristetto", 44.948397, 7.290876);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (10, "end point", 0, 0, "End point of Trial to Monte Cristetto", 44.989283, 7.281253);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (11, "start point", 0, 1, NULL, 44.615494525060058, 7.053166581317782);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (12, "end point", 0, 0, "End point of Trial to Bivacco Berardo", 44.648342952132225, 7.072004824876785);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (13, "reference point", 0, 0, "Max elevation point of Trial to Monte Rocca Patanua", 44.6020830608904, 6.9847284257412);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (14, "reference point", 0, 0, "Max elevation point of Trial to Rocca Patanua", 45.1783776283264, 7.21914410591126);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (15, "reference point", 0, 0, "Max elevation point of Trial to Monte Ziccher", 46.163437, 8.534103);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (16, "reference point", 0, 0, "Max elevation point of Trial to Bivacco Gias Nuovo", 45.339905, 7.18368);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (17, "reference point", 0, 0, "Max elevation point of Trial to Monte Cristetto", 44.989283, 7.281253);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (18, "reference point", 0, 0, "Max elevation point of Trial to Bivacco Berardo", 44.6483261045069, 7.07202368415892);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (19, "parking lot", 1, 0, NULL, 44.5799508675903, 6.98408919299859);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (20, "parking lot", 1, 0, NULL, 44.5749908675903, 6.98998919251859);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")
VALUES (21, "parking lot", 1, 0, NULL, 44.5749939993593, 6.98269703999564);  
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (23, "start point", 0, 0, "Start point of Poggio Tre Croci Ciaspole", 45.079073, 6.695705);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (24, "end point", 0,	0, "Start point of Poggio Tre Croci Ciaspole",	45.079097,6.695723);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (25, "start point", 0, 0,"Start point of San Michele", 45.099076, 7.354971);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (26, "end point", 0,	0, "End point of San Michele",	45.097073, 7.343123);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (27, "start point", 0,  0,"Start point of Punta Nera e Colle della Rho", 45.089292, 6.675187);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (28, "end point", 0,	0, "End point of Punta Nera e Colle della Rho",	45.089308, 6.675215);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (29, "start point", 0, 0, "Start point of Colombardo da Pratobotrile ", 45.1468026638,7.31685161591);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (30, "end point", 0,	0, "End point of Colombardo da Pratobotrile",	45.14682345092, 7.31701573357);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (31, "start point", 0, 0, "Start point of monte musine", 45.107742, 7.477332);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (32, "end point", 0,	0, "End point of monte musine",	45.113762, 7.454839);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (33, "start point", 0, 0, "Start point of anello Rocca sella e monte sapei", 45.134888, 7.343993);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (34, "end point", 0,	0, "End point of anello Rocca sella e monte sapei",	45.134431, 7.344251);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (35, "start point", 0, 0, "Start point of Cima del Bosco", 44.937484078109264373779296875, 6.86268364079296588897705078125);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (36, "end point", 0,	0, "End point of Cima del Bosco",	44.9376612715423107147216796875, 6.8631246127188205718994140625);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (37, "start point", 0, 0," Start point ofAnello Val Servin", 45.302128, 7.221029);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (38, "end point", 0,	0, "End point of  Anello Val Servin",	45.298574, 7.219757);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (39, "start point", 0, 0, "pian dell azaria", 45.539785, 7.534497);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (40, "end point", 0,	0, "End point of pian dell azaria",	45.565481, 7.501388);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (41, "start point", 0, 0, "Start point of  Monte Riba del Gias da Becetto", 44.597067581489682, 7.202494293451309);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (42, "end point", 0,	0, "End point of  Monte Riba del Gias da Becetto",	44.621665952727199, 7.200692351907492);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (43, "start point", 0, 0, "Start point of  Borgata Rua-Cima di Crosa", 44.596613, 7.201825);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (44, "end point", 0,	0, "End point of  Borgata Rua-Cima di Crosa",	44.615185, 7.177367);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (45, "start point", 0, 0, "Start point of Lago Panelatte", 46.172037,8.459393);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (46, "end point", 0,	0, "End point of Lago Panelatte",	46.20274, 8.450575);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (47, "start point", 0, 0, "Start Point of Hike_Zicher", 46.147128, 8.534505);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (48, "end point", 0,	0, "End point of Hike_Zicher",	46.163437, 8.534103);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (49, "start point", 0, 0, "Start point of Laghi Paione", 46.151141, 8.196038);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (50, "end point", 0,	0, "End point of Laghi Paione",	46.173033, 8.192136);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (51, "start point", 0, 0, "Start point rifugio paolo daviso", 45.364377, 7.223178);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (52, "end point", 0,	0, "End point of rifugio paolo daviso",	45.364041,7.222142);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (53, "start point", 0, 0, "Start point pietraborga da piossasco", 44.9941, 7.455977);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (54, "end point", 0,	0, "End point of pietraborga da piossasco",	45.021651, 7.421736);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (55, "start point", 0, 0, "Start point alpe dattia da ala", 45.316959, 7.304834);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (56, "end point", 0,	0, "End point of alpe dattia da ala",	45.331211, 7.298011);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (57, "start point", 0, 0, "Start point rifugio Alagna Valsesia - Sorgenti del Sesia", 45.866059, 7.936636);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (58, "end point", 0,	0, "End point of rifugio Alagna Valsesia - Sorgenti del Sesia",	45.900313, 7.907224);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (59, "start point", 0, 0, "Start point Lago di Afframont ",45.291582019999623, 7.237375248223543);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (60, "end point", 0,	0, "End point of Lago di Afframont ",	45.292359441518784,7.238771421834827);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude") 
VALUES (61, "start point", 0, 0, "Start point Laghetti Verdi e Lago Paschiet", 45.30031, 7.21939);
INSERT INTO "Point"("pointId", "type", "parkingLot", "hut", "nameOfLocation", "latitude", "longitude")  
VALUES (62, "end point", 0,	0, "End point of Laghetti Verdi e Lago Paschiet",	45.30031,7.21939);

/* Hike table data */		
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (1, "Trail to Monte Ferra", 2, "gpx/monte_ferra.gpx", 4017, 4, 1, 13.1, "01:20", 237.7, 3094.14, "Professional hiker", "Leaving the car in the large parking lot, we pass the Melezè Refuge and enter the small group of houses above the church of Sant''Anna, leaving behind the imposing building of the Excelsior holiday home. We take the clearly visible path which, with numerous hairpin bends, climbs rapidly on the grassy side up to a plateau where there are some ruins called Grange Reisassa. Here we find a crossroads with signs for Monte Ferra on the right and the hill of Fiutrusa on the left. We continue towards Monte ferra which now looks majestic in front of us, but still too far away. We gain altitude by reaching Lake Reisassa which can still be frozen at the beginning of the season. At this point we just have to go up the very steep path that winds through the debris until we reach the rocky ridge, where we turn left (westbound) and walk it up to the small iron cross placed to indicate our destination. The return path is the same as that of the ascent. NOTES: Poles are essential especially in the descent from Monte Ferra to Lake Reisassa. The only point of support is the Melezè refuge at the beginning of the itinerary (we recommend that you contact the hotel directly to check days and opening times).", 1, 2); 
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (2, "Trail to Rocca Patanua", 2, "gpx/rocca_patanua.gpx", 1093, 1, 1, 9.2, "03:00", 985.3, 2352.9619286962, "Hiker", "Patanua means naked in Piedmontese and this term probably refers to the characteristic rocky towers of this mountain, well exposed and visible even from afar. Rocca Patanua is a relatively low peak but able to give the hiker the satisfaction of already purely mountaineering conquest. In fact, its rocky crags, which are bypassed by the path, offer a great glance and a guaranteed panorama, clouds permitting. Once in Prarotto, going up from Condove, leave the car in the parking lot in front of the small church of the Madonna della Neve. On the opposite side of the road, the start of the path highlighted by the hiking signs is clearly evident. Then take path 564 following the signs for Rocca Patanua. The first part of the path develops in a wood with a prevalence of conifers and immediately rises. After about 2 km we leave the detour to the left for the town of Maffiotto and continue on the main path. Shortly after, at an altitude now close to 1900 meters, the wood gives way to large expanses of meadows and some old pastures (Alpe Formica). The view begins to open onto the Val di Susa and the panorama becomes more and more interesting. We soon reach the detour (564A) on the right for Alpe Tuluit, which we neglect. Proceeding almost along a very wide ridge, we reach a first knoll at an altitude of 2100 meters and a second at an altitude of 2200, from which another detour to the left branches off (path 532). The path now towards the final part becomes a hillside and goes around the Rocca Patanua towers to the left. In a few minutes, after a few simple steps on rock where you have to place your hands, we have reached the summit cross. Pay attention in the very last stretch, the only EE of the whole route, as it is quite exposed and with snow and ice it can be dangerous. For the return we follow the path of the outward journey. NOTES: Itinerary entirely facing south which normally clears the snow as early as early spring. (the itinerary was carried out in winter, followed by little and almost totally no snow cover).", 3, 4);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (3, "Trail to Monte Ziccher", 2, "gpx/monte_ziccher.gpx", 103024, 103, 1, 6.6, "01:40", 690.5, 1978.786291, "Tourist", "To reach the starting point by car, start from Craveggia, inhabited above Santa Maria Maggiore, and continue by car along the paved road that leads first to the La Doccia refuge, then to the Camoscio Refuge and, finally, to the Blitz Refuge. Park the car at the end of the paved road and take the path. Monte Ziccher is a panoramic mountain that rises between the Vigezzo Valley and the Swiss border of Locarno (Ticino canton, overlooking the northern shores of Lake Maggiore). From the summit you can enjoy a fantastic 360 degree view over the entire Vigezzo Valley, the neighboring mountains of Ticino Switzerland, some peaks of the Valais and even Monte Rosa. It is one of the typical hiking trails of the valley, also suitable for families. This description refers to the main ascent route from the south-west side of the mountain. Park the car and go up along an obvious path towards the Blitz oratory, which can be reached in about 10-15 minutes. After the oratory, cross a short stretch of wood and turn right onto a signposted path that leads to a group of huts well exposed to the sun. Continuing, you cross a group of cottages and a fountain to go up to the right and re-enter the wood. The path continues on a ridge and continues to climb rapidly gaining altitude in the coniferous forest. The trace is always clearly identifiable. Continuing you will come to a detour and turn right. Suddenly the forest ends, the view begins to sweep over the surrounding landscapes and you reach a steep meadow that leads to the ridge of the mountain. Climbing up the meadow, the foremost and, later, the summit ridge begins to become visible. This last section is climbed quickly with a path between the rocks. It requires attention, as the stretch is slightly exposed (especially when accompanied by children and / or dogs, on crowded days). From the summit of the Ziccher, the eye immediately stops on the underlying Val Vigezzo, until it reaches the Domodossola plain and, in perspective, the Rosa massif which rises with its distinguishable profile towards the south-west. The view is splendid and deserves a break of pure contemplation. NOTES: Full telephone coverage is not guaranteed along the itinerary In summer, the final part can be very exposed to the sun and require effort. In strong wind conditions, it is preferable not to continue It is possible to develop a circular itinerary descending from the north side of the mountain towards Bocchetta Sant''Antonio (but beware of a passage on rocks, especially if frozen).", 5, 6);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (4, "Trail to Bivacco Gias Nuovo", 2, "gpx/bivacco_gias_nuovo.gpx", 1118, 1, 1, 14.6, "02:30", 674.4, 1891.73755, "Hiker", "Park the car in Forno Alpi Graie (parking spaces available at the beginning of the village or at the end of the village, before the bridge). After the bridge that passes over the Stura della Val Grande, turn left towards path 308 for Vallone di Sea. The path looks like a wide dirt road that immediately gains altitude, turning into a path surrounded by stones and low vegetation. Along the side walls it is possible to see walls equipped for climbing, while on some large boulders there are plates bearing famous phrases by mountaineers. The route runs along the bottom of the valley and runs along a stream that sometimes has natural pools and small waterfalls. After the bridge near the Gias Balma Massiet (1500 meters), continue to the second bridge near the Alpe di Sea (1792 meters). From here, take the path that passes through the buildings and you will reach the end of the Vallone, where the Gias Nuovo Bivacco is located. NOTES: Along the way there are no water and support points. The path is totally shaded, there are no points exposed to the sun. The bivouac looks like a triangular shaped wooden house, has about 8 beds (few mattresses and blankets available) and a small solar bat. From this area it is possible to leave for other excursions by crossing the Val d''Ala through the Ometto Pass (at the foot of the Uja di Mondrone) or continue in the direction of the Eugenio Ferreri Refuge.", 7, 8);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (5, "Trail to Monte Cristetto", 2, "gpx/monte_cristetto.gpx", 1191, 1, 1, 14.54, "03:30", 802.2, 1525.3, "Hiker", "Leave the car in the square in front of the church of Talucco (a hamlet of Pinerolo), take the path that starts on the right and follows the signs for Rifugio Casa Canada. The itinerary develops in a low mountain context and runs almost in its entirety the path of the ecomuseum of the Val Lemina charcoal burners. After crossing the Empire wood, so called because of its anthropogenic reforestation work, you will reach Colle Ciardonet after a first hour''s walk. From the hill it is possible to reach the Dairin hamlet or the Melano Casa Canada Refuge, which can be considered the only refreshment point of the itinerary. From the hill, go up towards the Sperina-Monte Freidour hill, following the easy path that climbs towards the upper Val Lemina (about another hour or so). Once you reach the top of Colle Sperina, you must then follow the ridge towards Colle Prà l''Abbà and Colle Ceresera (signs present), reaching the wide forest track that reaches Colle del Besso (1,468 m.a.s.l.). From the track it is possible to cut (with some effort) in the direction of the ridge that leads to the top of Monte Cristetto, or alternatively, to reach Colle del Besso and walk the ridge in its entirety. The Monte is located in the watershed between Val Lemina, Vallone del Grandubbione and Val Sangone. The view of the Eagle mountains and Punta della Merla is magnificent, and it is possible to observe the wild environment that stands out in the Vallone del Grandubbione, crossed by the tortuous stream of the same name. NOTES: The only recommendation is the scruple to be careful of possible encounters with shepherd dogs: the area is a place of transhumance in the late spring period.", 9, 10);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (6, "Trail to Bivacco Berardo", 2, "gpx/bivacco_berardo.gpx", 4172, 4, 1, 10.35, "03:00", 1102.3, 2702.88, "Professional hiker", "Leaving the car in the parking lot, we reach the fountain a little further on under the signs with all the information on the various routes that can be taken from the hamlet of Castello. We begin the climb with a very steep first stretch that flanks the artificial bed of the Vallanta stream, before it flows into the Pontechianale lake. Further on, the path softens as it enters the characteristic wood of the Alevè, the largest extension of pine in Italy and one of the largest in Europe. Leaving the wooded area we meet a group of stone ruins called Grange Gheite. At the junction for the Ezio Nicoli Path, turn right, after 100 meters a new junction shows us the path to the Berardo Bivouac on the left (about 2.00 hours) and for the Boarelli Bivouac on the right (about 2.30 hours). We continue to the left (Berardo Bivouac) and immerse ourselves completely in the woods following a narrow path that does not let you take a breath even for a second. We pass from 2000 m (Ezio Nicoli path junction) to 2710 of the Berardo bivouac in about 2km. The path does not present great difficulties except in its steepness especially in the final section where the bottom is a bit slippery and dusty. NOTES: The Berardo bivouac is an excellent base for tackling the climb to the Spire of the Forcioline.", 11, 12);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (7, "Trail to Laghetti Verdi e Lago Paschiet", 2, "gpx/Laghetti Verdi e Lago Paschiet.gpx", 1118,1, 1, 5.6, "02:10", 234.0, 2502.34, "Professional hiker", "Bivacco all'interno del Parco Naturale Orsiera Rocciavrè.", 61, 62);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (8, "Trail to Poggio Tre Croci Ciaspole", 2, "gpx/Poggio Tre Croci Ciaspole.gpx", 1191, 1, 1, 14.3, "01:20", 1067.0, 2344.88, "Tourist", "Da Borgo Vecchio (o in alternativa da les Arnaud) dove si lascia lauto, si attraversa il ponte sulla Rho, percorrendo la strada militare che si addentra nel bel bosco.", 23, 24);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (9, "Trail to sacra di San Michele ", 2, "gpx/sacra di San Michele.gpx",1022, 1, 1, 20.34, "01:30", 404.4, 2102.88, "Hiker", "a Sacra di San Michele evoca bellezza, fascino e mistero. Quel mistero che la avvolge fin dalla sua costruzione.", 25, 26);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (10, "Trail to Punta Nera e Colle della Rho", 2, "gpx/Punta Nera e Colle della Rho.gpx", 1010, 1, 1, 12.43, "02:20", 1007.0, 2202.88, "Hiker", "Dalle Granges della Rho, raggiungibili da Bardonecchia per una discreta carrozzabile, proseguire sulla strada sterrata, passando per la cappelletta della Madonna DI Montserrat", 27, 28);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (11, "Trail to Colombardo da Pratobotrile", 2, "gpx/Colombardo da Pratobotrile.gpx", 1049, 1, 1, 9.4, "01:50", 2300.0, 2102.88, "Professional hiker", "Dal Civrari si propende verso la valle di Susa un profondo e incassato vallone bagnato dal torrente Sessi, solcato da numerosi sentieri di servizio agli alpeggi molti dei quali oggi abbandonati.", 29, 30);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (12, "Trail to monte musine", 2, "gpx/monte musine.gpx", 1010, 1, 1, 5.3, "01:00", 500.0, 1202.88, "Tourist", "Si trova all'inizio della Val di Susa e interessa i comuni di Caselette, Almese e Val della Torre. È la montagna più vicina a Torino, dai 12 ai 25 km in linea d'aria a seconda della posizione in città, ma nonostante la vicinanza a volte a causa della foschia in pianura e nella bassa valle non risulta visibile", 31, 32);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (13, "Trail to anello Rocca sella e monte sapei ", 2, "gpx/anello Rocca sella e monte sapei .gpx", 1056, 1, 1, 6.0, "02:20", 1000.0, 2599.88, "Professional hiker", "Alterna tratti più semplici a tratti più faticosi, per via delle numerose rocce da scavalcare, ma forse è proprio questo che rende il sentiero così avvincente.", 33, 34);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (14, "Trail to Cima del Bosco", 2, "gpx/Cima del Bosco.gpx", 1032, 1, 1, 5.0, "01:12", 1100.0, 2702.88, "Professional hiker", "scursione molto interessante che sale nel bosco principalmente di larici, prima fitto poi via via più rado fino al panettone finale .", 35, 36);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (15, "Trail to Anello Val Servin ", 2, "gpx/Anello Val Servin.gpx", 1001, 1, 1, 4.6, "02:45", 1000.0, 2602.88, "Hiker", "Venite a seguire le tracce di questa epopea montanara percorrendo lAnello di ValServìn nella conca di Balme, il più alto comune delle Valli di Lanzo. ", 37, 38);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (16, "Trail to pian dell azaria ", 2, "gpx/pian dell azaria.gpx", 4172, 4, 1, 10.4, "03:00", 1100.0, 2702.88, "Hiker", "Leave the car in the Piazzale Campiglia Soana, take the dirt road that leads to Pian of Azaria. The route has only some climb to reach the broad plateau of the basin at the bottow of the rocky ridges of Rancio. A typical alpine forest mixed of deciduous and coniferous accompanied along the way to end in Gr. Barmaion only with beautiful specimens of spruce and larch trees. ", 39, 40);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (17, "Trail to Monte Riba del Gias da Becetto ", 2, "gpx/Monte Riba del Gias da Becetto.gpx", 1002, 1, 1, 6.45, "01:34", 1900.0, 2102.88, "Tourist", "E' possibile partire da diverse frazioni a seconda dell'innevamento: Becetto 1387 m, Morelli 1426 m, Ruà di Becetto 1535 m", 41, 42);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (18, "Trail to Borgata Rua-Cima di Crosa ", 2, "gpx/Borgata Rua-Cima di Crosa.gpx", 1013, 1, 1, 10.4, "03:10", 1320.0, 2502.88, "Hiker", "ossibilità di partire anche da Becetto, aggiungendo poco meno di 200 m al dislivello.", 43,44);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (19, "Trail to Lago Panelatte ", 2, "gpx/Lago Panelatte.gpx", 1038, 1, 1, 10.4, "01:32", 600.0, 902.88, "Professional hiker", "a Arvogno si segue in leggera discesa la strada asfaltata fino al ponte sul Melezzo, oltre il quale si prosegue indifferentemente sulla strada, in questo tratto interdetta al traffico privato.", 45, 46);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (20, "Trail to Hike_Zicher ", 2, "gpx/Hike_Zicher.gpx", 1045, 1, 1, 8.5, "02:10", 1000.0, 2502.88, "Hiker", "Hohbalm. Distance: 7.6 - 12.3 miles (Loop) Our favorite hike in Zermatt features magical views of the majestic Matterhorn and stunning panoramas of the 4,000-meter peaks towering above the Zermatt area. Gruben to Jungen via Augstbord Pass", 47,48);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (21, "Trail to Laghi Paione", 2, "gpx/Laghi Paione.gpx", 1023, 1, 1, 9.2, "03:00", 1700.0, 2802.88, "Professional hiker", "I tre laghi del Paione sono posti a livelli differenti e le acque del lago superiore alimentano il lago di mezzo e così in successione, fino a quello inferiore. ", 49,50);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (22, "Trail to rifugio paolo daviso", 2, "gpx/rifugio paolo daviso.gpx", 1022, 1, 1, 8.2, "02:20", 1804.4, 2402.88, "Professional hiker", "Si parte dal paese a fondo valle di Forno Alpi Graie (60 km da Torino), è raggiungibile in 3 ore di marcia per lottimo sentiero n.315, con 1000 metri di dislivetto si attraversano torrenti e vecchi alpeggi.", 51, 52);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (23, "Trail to pietraborga da piossasco ", 2, "gpx/pietraborga da piossasco.gpx", 1023, 1, 1, 10.4, "02:22", 3203.2, 2302.88, "Professional hiker", "Da P.za San Vito (361 m) si parte verso Est per via San Vito, dopo poche centinaia di metri voltare a SX per via Monte Grappa. Si raggiunge così il limitare del Parco Montano dove termina l'asfalto (1 Km).", 53, 54);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (24, "Trail to alpe dattia da ala ", 2, "gpx/alpe dattia da ala.gpx", 1043, 1, 1, 9.4, "02:55", 1003.20, 2402.88, "Tourist", "Itinerario facile e panoramico sulle vette della val d'Ala, specie sull'Uia di Mondrone che domina in primo piano.", 55, 56);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (25, "Trail to Alagna Valsesia - Sorgenti del Sesia ", 2, "gpx/Alagna Valsesia - Sorgenti del Sesia.gpx", 1045, 1, 1, 5.3, "01:11", 1100.0, 2702.88, "Professional hiker", "Alagna Valsesia is a comune and small village high in the Valsesia alpine valley in the province of Vercelli, Piedmont, northern Italy, ", 57, 58);
INSERT INTO "Hike"("hikeId", "title", "writerId", "trackPath", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint")
VALUES (26, "Trail to Lago di Afframont ", 2, "gpx/Lago di Afframont.gpx", 1034, 1, 1, 7.2, "02:40", 1564.2, 2002.88, "Professional hiker", "Bella passeggiata più impegnativa, in presenza di bambini, per via delle pendenze.", 59, 60);

/* Hut table data */
INSERT INTO "Hut"("hutId", "hutName", "pointId", "writerId", "city", "province", "region", "numOfBeds", "cost", "altitude", "phone", "email", "website")
VALUES (1, "Rifugio Meleze'", 1, 1, 4017, 4, 1, 50, 50.0, 1757.43, "0175 956410", "meleze@meleze.it", "www.meleze.it");
INSERT INTO "Hut"("hutId", "hutName", "pointId", "writerId", "city", "province", "region", "numOfBeds", "cost", "altitude", "phone", "email", "website")
VALUES (2, "Rifugio Blitz", 5, 1, 103024, 103, 1, 60, 60.0, 1265.85, "331 457 2614", "rifugiodelblitz@gmail.com", "www.vallevigezzo.eu");
INSERT INTO "Hut"("hutId", "hutName", "pointId", "writerId", "city", "province", "region", "numOfBeds", "cost", "altitude", "phone", "email", "website")
VALUES (3, "Rifugio Aleve'", 11, 1, 4172, 4, 1, 60, 50.0, 1500.76, "347 719 3878", "rifugioaleve2021@gmail.com", "www.facebook.com/rifugioaleve");

/* HikeHut data */
INSERT INTO "HikeHut"("hikeId", "hutId")
VALUES (1, 1);
INSERT INTO "HikeHut"("hikeId", "hutId")
VALUES (3, 2);
INSERT INTO "HikeHut"("hikeId", "hutId")
VALUES (6, 3);

/* ParkingLot table data */
INSERT INTO "ParkingLot"("parkingLotId", "parkingLotName", "pointId", "writerId", "capacity", "altitude")
VALUES (1, "Monte Ferra Parking 1", 19, 1, 150, 1020.12);
INSERT INTO "ParkingLot"("parkingLotId", "parkingLotName", "pointId", "writerId", "capacity", "altitude")
VALUES (2, "Monte Ferra Parking 2", 20, 1, 200, 1015.45);
INSERT INTO "ParkingLot"("parkingLotId", "parkingLotName", "pointId", "writerId", "capacity", "altitude")
VALUES (3, "Monte Ferra Parking 3", 21, 1, 250, NULL);

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





		
		
		
		
		
		
		
		
		
		
				
				
				
				
			
