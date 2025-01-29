import Sequelize from 'sequelize';
import database from '../index';
import Venue from './venues';

const Venue_Hours = database.define('Venue_Hours', {
    day: { type: Sequelize.INTEGER },
    hour: { type: Sequelize.INTEGER },
    popularity: { type: Sequelize.INTEGER },
});

Venue_Hours.belongsTo(Venue, { foreignKey: 'venue_id' });

export default Venue_Hours;
