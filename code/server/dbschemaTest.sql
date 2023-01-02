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
    PRIMARY KEY("pointId")
);

DROP TABLE IF EXISTS "ParkingLot";
CREATE TABLE IF NOT EXISTS "ParkingLot" (
    "parkingLotId" INTEGER NOT NULL UNIQUE CHECK(typeof(parkingLotId) == "integer"),
    "parkingLotName" TEXT NOT NULL CHECK(typeof(parkingLotName) == "text"),
    "pointId" INTEGER NOT NULL CHECK(typeof(pointId) == "integer"),
    "writerId" INTEGER NOT NULL CHECK(typeof(writerId) == "integer"),
    "capacity" INTEGER NOT NULL CHECK(typeof(capacity) == "integer"),
    "altitude" REAL NOT NULL CHECK(typeof(altitude) == "real"),
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
    "altitude" REAL CHECK(typeof(altitude) == "real" OR typeof(altitude) == NULL),
    "phone" TEXT NOT NULL CHECK(typeof(phone) == "text"),
    "email" TEXT NOT NULL CHECK(typeof(email) == "text"),
    "website" TEXT CHECK(typeof(website) == "text" OR typeof(website) == NULL),
    "hutImage" TEXT CHECK(typeof(hutImage) == "text" OR typeof(hutImage) == NULL),
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
    "hikeImage" TEXT CHECK(typeof(hikeImage) == "text" OR typeof(hikeImage) == NULL),
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

DROP TABLE IF EXISTS "HikeStatus";
CREATE TABLE IF NOT EXISTS "HikeStatus" (
    "statusId" INTEGER NOT NULL UNIQUE CHECK(typeof(statusId) == "integer"),
    "hikeId" TEXT NOT NULL CHECK(typeof(hikeId) == "integer"),
    "status" INTEGER NOT NULL CHECK(typeof(status) == "text"),
    "startTime" INTEGER NOT NULL CHECK(typeof(startTime) == "text"),
    "endTime" INTEGER NOT NULL CHECK(typeof(endTime) == "text"),
    PRIMARY KEY("statusId"),
    FOREIGN KEY("hikeId") REFERENCES "Hike"("hikeId")
   
);		
		
		
		
		
		
		
		
		
		
				
				
				
				
			
