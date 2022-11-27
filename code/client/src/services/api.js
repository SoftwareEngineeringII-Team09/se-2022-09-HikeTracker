import users from './users';
import hikes from './hikes'
import huts from './huts'
import parkingLots from './parkingLots'

const api = {
    hikes,
    users,
    parkingLots,
    ...huts
};

export default api;