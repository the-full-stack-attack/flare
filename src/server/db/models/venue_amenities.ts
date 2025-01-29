import Sequelize from 'sequelize';
import database from '../index';
import Venue from './venues';

const Venue_Amenities = database.define('Venue_Amenities', {
    outdoor_seating: { type: Sequelize.BOOLEAN },
    wheelchair_accessible: { type: Sequelize.BOOLEAN },
    restroom: { type: Sequelize.BOOLEAN },
    private_parking: { type: Sequelize.BOOLEAN },
    street_parking: { type: Sequelize.BOOLEAN },
    serves_alcohol: { type: Sequelize.BOOLEAN },
});

Venue_Amenities.belongsTo(Venue, { foreignKey: 'venue_id' });

export default Venue_Amenities;
