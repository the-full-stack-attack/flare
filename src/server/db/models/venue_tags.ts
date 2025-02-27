import Sequelize from 'sequelize';
import database from '../index';


const Venue_Tag = database.define('Venue_Tag', {
    tag: { type: Sequelize.STRING },
    source: { type: Sequelize.STRING },
    count: { type: Sequelize.INTEGER },
})

export default Venue_Tag;
