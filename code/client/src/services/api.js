import users from './users';
import hikes from './hikes'
import huts from './huts'

const api = {
    hikes: hikes,
    ...users,
    ...huts
};

export default api;