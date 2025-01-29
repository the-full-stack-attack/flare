

import database from '../index';
import Interest from '../models/interests';

const allInterests = [
  'Arts & Crafts',
  'Music',
  'Gaming',
  'Movies & TV',
  'Comics & Anime',
  'Books & Reading',
  'Technology',
  'Nature',
  'Food & Cooking',
  'Nightlife',
  'Coffee & Tea',
  'Health & Wellness',
  'Pets & Animals',
  'Sports & Recreation',
  'Community Events',
];

type InterestData = {
  name: string;
};

const interestObjects = allInterests.map((interest) => {
  const interestVal: InterestData = {
    name: interest,
  };

  return interestVal;
});

const seedInterests = async () => {
  try {
    const interests = await Interest.findAll();
    interests.forEach(async (interest: any) => {
      await interest.destroy();
    });

    await Interest.bulkCreate(interestObjects);
    console.log(`\\_(O.o)_/<('i worked!')`);
  } catch (err: unknown) {
    console.error(err, 'It BROKE! (SEEDING INTERESTS) STINKY!');
  }
};

export default seedInterests;
