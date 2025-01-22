import Sequelize from 'sequelize';
import database from '../index';

const Category = database.define('Category', {
    name: { type: Sequelize.STRING },
});

export default Category;