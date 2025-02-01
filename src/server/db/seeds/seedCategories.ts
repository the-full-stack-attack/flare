import Category from '../models/categories';

const allCategories = [
  'Casual Meetups',
  'Learning & Workshops',
  'Active & Sports',
  'Arts & Culture',
  'Food & Drink',
  'Outdoor Adventures',
  'Gaming & Entertainment',
  'Community Service',
  'Professional & Career',
  'Wellness & Personal Growth',
];

type CategoryData = {
  name: string;
};

const categoryObjects = allCategories.map((category) => {
  const categoryVal: CategoryData = {
    name: category,
  };

  return categoryVal;
});

const seedCategories = async () => {
  try {
    const categories = await Category.findAll();
    for (const category of categories) {
      await category.destroy();
    }
    await Category.bulkCreate(categoryObjects);
    console.log('Seeding Categories... ╭∩╮(◣_◢)╭∩╮');
  } catch (error: unknown) {
    console.error('SEEDING CATEGORIES FAILED: ', error);
  }
};

export default seedCategories;
