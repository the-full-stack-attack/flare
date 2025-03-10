import User from "../models/users";

type SeedUser = {
  username: string;
  full_name: string;
};

const user1: SeedUser = {
  username: 'gnome_wizard',
  full_name: 'Leeroy Jenkins'
};

const user2: SeedUser = {
  username: 'secret_agent',
  full_name: 'John Smith'
};

const user3: SeedUser = {
  username: 'pinky_brain',
  full_name: 'Susan Bellum'
};

const seedUsers = async () => {
  try {
    await User.create(user1);
    await User.create(user2);
    await User.create(user3);
    console.log('3 users seeded.');
  } catch (error: unknown) {
    console.error('Failed to seed users for showcase:', error);
  }
};

export default seedUsers;