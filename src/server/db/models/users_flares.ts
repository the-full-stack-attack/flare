import Sequelize from 'sequelize';
import database from '../index';
import User from './users';
import Flare from './flares';

const User_Flare = database.define('User_Flare', {
  earned: { type: Sequelize.BOOLEAN },
});

User.belongsToMany(Flare, { through: User_Flare });
Flare.belongsToMany(User, { through: User_Flare });

User_Flare.belongsTo(User);
User_Flare.belongsTo(Flare);

export default User_Flare;
