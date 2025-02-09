import Sequelize from 'sequelize';
import database from '../index';

const User_Avatar = database.define('User_Avatar', {
    skin: { type: Sequelize.STRING, },
    hair: { type: Sequelize.STRING, },
    hair_color: { type: Sequelize.STRING, },
    eyebrows: { type: Sequelize.STRING, },
    eyes: { type: Sequelize.STRING, },
    mouth: { type: Sequelize.STRING, },
});

export default User_Avatar;