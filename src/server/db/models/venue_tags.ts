import Sequelize from 'sequelize';
import database from '../index';
import Venue from './venues';

const Venue_Tags = database.define('Venue_Tags', {
    tag: { type: Sequelize.STRING },
    count: { type: Sequelize.INTEGER },
})

Venue_Tags.belongsTo(Venue, { foreignKey: 'venue_id' });

export default Venue_Tags;
