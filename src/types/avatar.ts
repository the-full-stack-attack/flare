import { adventurer } from '@dicebear/collection';
import type { StyleOptions } from '@dicebear/core';

// Define the possible values for each feature
type EyebrowsType =
  | 'variant01' | 'variant02' | 'variant03' | 'variant04' | 'variant05'
  | 'variant06' | 'variant07' | 'variant08' | 'variant09' | 'variant10'
  | 'variant11' | 'variant12' | 'variant13' | 'variant14' | 'variant15';

type EyesType =
  | 'variant01' | 'variant02' | 'variant03' | 'variant04' | 'variant05'
  | 'variant06' | 'variant07' | 'variant08' | 'variant09' | 'variant10'
  | 'variant11' | 'variant12' | 'variant13' | 'variant14' | 'variant15'
  | 'variant16' | 'variant17' | 'variant18' | 'variant19' | 'variant20'
  | 'variant21' | 'variant22' | 'variant23' | 'variant24' | 'variant25'
  | 'variant26';

type MouthType =
  | 'variant01' | 'variant02' | 'variant03' | 'variant04' | 'variant05'
  | 'variant06' | 'variant07' | 'variant08' | 'variant09' | 'variant10'
  | 'variant11' | 'variant12' | 'variant13' | 'variant14' | 'variant15'
  | 'variant16' | 'variant17' | 'variant18' | 'variant19' | 'variant20'
  | 'variant21' | 'variant22' | 'variant23' | 'variant24' | 'variant25'
  | 'variant26' | 'variant27';

type HairType =
  | 'short01' | 'short02' | 'short03' | 'short04' | 'short05'
  | 'short06' | 'short07' | 'short08' | 'short09' | 'short10'
  | 'short11' | 'short12' | 'short13' | 'short14' | 'short15'
  | 'short16' | 'long01' | 'long02' | 'long03' | 'long04'
  | 'long05' | 'long06' | 'long07' | 'long08' | 'long09'
  | 'long10' | 'long11' | 'long12' | 'long13' | 'long14'
  | 'long15' | 'long16' | 'long17' | 'long18' | 'long19'
  | 'long20' | 'long21';

export type UserAvatar = {
  skin: string;
  hair: HairType;
  hair_color: string;
  eyebrows: EyebrowsType;
  eyes: EyesType;
  mouth: MouthType;
};

export type AdventurerOptions = StyleOptions<typeof adventurer.meta>;
export type AvatarConfig = Partial<AdventurerOptions>;
