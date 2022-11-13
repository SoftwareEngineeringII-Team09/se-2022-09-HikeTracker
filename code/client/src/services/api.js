import users from './users';
import hikes from './hikes'
import huts from './huts'

const api = {
    ...users,
    ...hikes,
    ...huts
};

export default api;