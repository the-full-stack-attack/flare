import Sequelize from 'sequelize';
import database from '../index';
import Venue from './venues';

const Venue_Attributes = database.define('Venue_Attributes', {
    cleanliness: { type: Sequelize.STRING },
    crowded: { type: Sequelize.STRING },
    noise_level: { type: Sequelize.STRING },
    service_quality: { type: Sequelize.STRING },
});

Venue_Attributes.belongsTo(Venue, { foreignKey: 'venue_id' });

export default Venue_Attributes;
