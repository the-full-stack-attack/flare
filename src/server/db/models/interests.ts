import Sequelize from 'sequelize';
import database from '../index';

const Interest = database.define('Interest', {
    name: { type: Sequelize.STRING },
})

export default Interest;