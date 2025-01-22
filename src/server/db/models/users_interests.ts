import Sequelize from 'sequelize';
import database from '../index';
import User from './users';
import Interest from './interests';

const User_Interest = database.define('User_Interest', {
    user_id: { type: Sequelize.INTEGER, },
    interest_id: { type: Sequelize.INTEGER, },
})

User.belongsToMany(Interest, { through: User_Interest });
Interest.belongsToMany(User, { through: User_Interest });

export default User_Interest;
