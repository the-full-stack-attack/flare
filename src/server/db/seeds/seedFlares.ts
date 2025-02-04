import User from '../models/users';
import Flares from '../models/flares';

type FlareType = {
  id?: number;
  name: string;
  type: string | void;
  icon: string | null;
  achievement: string;
  value: number;
  milestone: number | null
};
type FlareArr = any[];
// Function to create flare achievements and input them into the database

// Use a class to build flares and pass in arrays?
class Flare {
  name: string;
  type: string | '';
  icon: string | '';
  achievement: string;
  value: number;
  milestone: number;
  constructor(flareInfo: any[]) {
    // Destructure the array
    const [name, type, icon, achievement, value, milestone,] = flareInfo;
    this.name = name;
    this.type = type;
    this.icon = icon;
    this.achievement = achievement;
    this.value = value;
    this.milestone = milestone;
  }
}

const flares: FlareType[] = [];
const flareArrays: any[] = [];
// Create individual flare arrays and push them onto the flareArrays
const butterFlareEffect: FlareArr = ['Butterflare Effect', 'Special Flare', '', 'Started your journey with Flare!', 0, null];
const goGetter: FlareArr = ['Go Getter', 'Task Flare', '', 'Completed your first ever task!', 0, null];
const theHost: FlareArr = ['The Host', 'Event Flare', '', 'Created an event for the first time!', 0, null];
const chattyCathy: FlareArr = ['Chatty Cathy', 'AI Flare', '', 'Utilized the AI chatbot for the first time!', 0, null];
const theSpark: FlareArr = ['The Spark', 'Event Flare', '', 'Attended your first ever event!', 0, null];
const multiTasker: FlareArr = ['Multitasker', 'Task Flare', '', 'You\'ve completed 5 tasks!', 0, 5];
const partyAnimal: FlareArr = ['Party Animal', 'Event Flare', '', 'You\'ve attended 5 events!', 0, 5];
flareArrays.push(butterFlareEffect, goGetter, theHost, chattyCathy, theSpark, multiTasker, partyAnimal);

// Create an object using the arrays above and push the object onto the flares array
flareArrays.forEach((flareInfo) => {
  flares.push(new Flare(flareInfo));
});

const seedFlares = async () => {
  try {
  const foundFlares = await Flares.findAll();
  if (foundFlares) {
    console.log('Destroying the existing flares');
    await Flares.destroy( { where: { value: 0 } });
  }
   await Flares.bulkCreate(flares);
   console.log('Flares created');
  } catch (err) {
    console.error('Error seeding flares in the database: ', err);
  }
};

export default seedFlares;
