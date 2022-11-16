const PersistentManager = require("../dao/PersistentManager");

/* Reset DB content */
module.exports.clearAll = async () => {
    return Promise.all([
        // TODO: Substitute these names with the real table names and uncomment these lines:
        PersistentManager.deleteAll("Hut"),
        PersistentManager.deleteAll("ParkingLot"),
        PersistentManager.deleteAll("Hike"),
        PersistentManager.deleteAll("Point"),
        // PersistentManager.deleteAll("User"),
        // PersistentManager.deleteAll("sqlite_sequence") 
    ]);
/*     await PersistentManager.deleteAll("Hut");
    await PersistentManager.deleteAll("ParkingLot");
    await PersistentManager.deleteAll("Hike");
    await PersistentManager.deleteAll("Point"); */
};
