import Sequelize from 'sequelize';
import database from '../index';
import Venue_Tag from "./venue_tags";
import Venue_Image from './venue_images';

const Venue = database.define('Venue', {
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    category: { type: Sequelize.STRING },
    street_address: { type: Sequelize.STRING },
    city_name: { type: Sequelize.STRING },
    state_name: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING },
    website: { type: Sequelize.STRING },
    pricing: { type: Sequelize.STRING },
    rating: { type: Sequelize.INTEGER },
    total_reviews: { type: Sequelize.INTEGER },
    popularTime: { type: Sequelize.DATE },
    wheelchair_accessible: { type: Sequelize.BOOLEAN },
    serves_alcohol: { type: Sequelize.BOOLEAN },
    fsq_id: { type: Sequelize.STRING },
    google_place_id: { type: Sequelize.STRING },
});


Venue.hasMany(Venue_Tag, { foreignKey: 'venue_id' });
Venue_Tag.belongsTo(Venue, { foreignKey: 'venue_id' });
Venue.hasMany(Venue_Image, { foreignKey: 'venue_id' });
Venue_Image.belongsTo(Venue, { foreignKey: 'venue_id' });


export default Venue;