import Sequelize from 'sequelize';
import database from '../index';
import User from './users';
import Flare from './flares';

const User_Flare = database.define('User_Flare', {
    user_id: { type: Sequelize.INTEGER, },
    flare_id: { type: Sequelize.INTEGER, },
});

User.belongsToMany(Flare, { through: User_Flare });
Flare.belongsToMany(User, { through: User_Flare });

export default User_Flare;