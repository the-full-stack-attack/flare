import User from '../models/users';
import Flare from '../models/flares';
import { IntegerDataTypeConstructor } from 'sequelize';

type FlareType = {
  id: number;
  name: string;
  icon: string | null;
  achievement: string;
  value: number;
  type: string | void;
};
type FlareArr = any[];
// Function to create flare achievements and input them into the database

// Use a class to build flares and pass in arrays?
class Flare {
  name: string;
  icon: string | '';
  achievement: string;
  value: number;
  type: string | '';
  constructor(flareInfo: any[]) {
    // Destructure the array
    const [name, icon, achievement, value, type] = flareInfo;
    this.name = name;
    this.icon = icon;
    this.achievement = achievement;
    this.value = value;
    this.type = type;
  }
}

const flares: FlareType[] = [];
const flareArrays: any[] = [];
// Create individual flare arrays and push them onto the flareArrays
const butterFlareEffect: FlareArr = ['Butterflare Effect', '', 'Started your journey with Flare!', 0, ''];
const goGetter: FlareArr = ['Go Getter', '', 'Completed your first ever task!', 0, ''];
const theHost: FlareArr = ['The Host', '', 'Created an event for the first time!', 0, ''];
const chattyCathy: FlareArr = ['Chatty Cathy', '', 'Utilized the AI chatbot for the first time!', 0, ''];
const theSpark: FlareArr = ['The Spark', '', 'Attended your first ever event!', 0, ''];
const multiTasker: FlareArr = ['Multitasker', '', 'You\'ve completed 10 tasks!', 0, ''];
const partyAnimal: FlareArr = ['Party Animal', '', 'You\'ve attended 10 events!', 0, ''];
flareArrays.push(butterFlareEffect, goGetter, theHost, chattyCathy, theSpark, multiTasker, partyAnimal);

console.log(flareArrays);
