import {
  Container,
  Graphics,
  Sprite,
  Texture,
  Assets,
  NineSliceSprite,
  Text,
  TextStyle,
  Spritesheet,
  AnimatedSprite,
  Loader,
} from 'pixi.js';
  import owl from './spritesheetimages/Owlet_Monster_Jump_8.png'
   await Assets.load(owl)
// src/client/assets/chatroom/spritesheets
const testJumper = {
  frames: {
    enemy1: {
      frame: { x: 0, y: 0, w: 32, h: 32 },
      sourceSize: { w: 32, h: 32 },
      spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
    },
    enemy2: {
      frame: { x: 32, y: 0, w: 32, h: 32 },
      sourceSize: { w: 32, h: 32 },
      spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
    },
    enemy3: {
      frame: { x: 64, y: 0, w: 32, h: 32 },
      sourceSize: { w: 32, h: 32 },
      spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
    },
    enemy4: {
      frame: { x: 96, y: 0, w: 32, h: 32 },
      sourceSize: { w: 32, h: 32 },
      spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
    },
    enemy5: {
      frame: { x: 128, y: 0, w: 32, h: 32 },
      sourceSize: { w: 32, h: 32 },
      spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
    },
    enemy6: {
      frame: { x: 160, y: 0, w: 32, h: 32 },
      sourceSize: { w: 32, h: 32 },
      spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
    },
    enemy7: {
      frame: { x: 192, y: 0, w: 32, h: 32 },
      sourceSize: { w: 32, h: 32 },
      spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
    },
    enemy8: {
      frame: { x: 224, y: 0, w: 32, h: 32 },
      sourceSize: { w: 32, h: 32 },
      spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
    },
  },
  meta: {
    image: owl,
    format: 'RGBA8888',
    size: { w: 256, h: 32 },
    scale: 1,
  },
  animations: {
    enemy: [
      'enemy1',
      'enemy2',
      'enemy3',
      'enemy4',
      'enemy5',
      'enemy6',
      'enemy7',
      'enemy8',
    ], //array of frames by name
  },
};

    // Create the SpriteSheet from data and image
    const spritesheet = new Spritesheet(
      Texture.from(testJumper.meta.image),
      testJumper
    );


export { testJumper, spritesheet };