import { Application, extend, useAssets } from '@pixi/react';
import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
  ref,
  useId,
  lazy,
  Suspense,
  useMemo,
} from 'react';

import {
  Container,
  Graphics,
  Sprite,
  Texture,
  Assets,
  NineSliceSprite, // failing
  Text,
  TextStyle,
  AnimatedSprite,
} from 'pixi.js';
import { UserContext } from '../../contexts/UserContext';
import TILES from '../../assets/chatroom/tiles/index';
import IDLE from '../../assets/chatroom/idle/index';
import WALK from '../../assets/chatroom/walk/index';
import SNAP from '../../assets/chatroom/snap/index';
import WAVE from '../../assets/chatroom/wave/index';
import EMOJIS from '../../assets/chatroom/emojis';
import speechbubble from '../../assets/images/speechbubble.png';
import loading from '../../assets/chatroom/loading.gif';
import ENERGYWAVE from '../../assets/chatroom/energy/index';
import mapPack from '../../assets/chatroom/mapPack';
import nightClubTileSet from '../../assets/chatroom/tileSet';
import DecoyText from './decoyText';
import {
  ChatroomContext,
  DataContext,
} from '@/client/contexts/ChatroomContext';
import { VelocityScroll } from '../../../components/ui/scroll-based-velocity';
extend({
  Container,
  Graphics,
  Sprite,
  Texture,
  NineSliceSprite,
  Text,
  TextStyle,
  AnimatedSprite,
  Texture, // not worth it w/ useAssets...?
});

const MainChat = ({ onKeyboard, chatSetOnKeyboard, avatarTextures }) => {
  // LOAD ASSETS
  console.log('MainChat rendered');
  let adds = avatarTextures.flat();
  const { user } = useContext(UserContext);
  const eventId = useContext(ChatroomContext);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [texturesToLoad, setTexturesToLoad] = useState([
    { alias: 'testImg', src: TILES['1'] },
    {
      alias: 'speech',
      src: speechbubble,
    },
    { alias: 'joint', src: EMOJIS['7'] }, // joint,
    { alias: '1', src: TILES['1'] },
    { alias: '2', src: TILES['2'] },
    { alias: '3', src: TILES['3'] },
    { alias: '4', src: TILES['4'] },
    { alias: '5', src: TILES['5'] },
    { alias: '6', src: TILES['6'] },
    { alias: '7', src: TILES['7'] },
    { alias: '8', src: TILES['8'] },
    { alias: '9', src: TILES['9'] },
    { alias: '10', src: TILES['10'] },
    { alias: '11', src: TILES['11'] },
    { alias: '12', src: TILES['12'] },
    { alias: '13', src: TILES['13'] },
    { alias: '14', src: TILES['14'] },
    { alias: '15', src: TILES['15'] },
    { alias: '16', src: TILES['16'] },
    { alias: '17', src: TILES['17'] },
    { alias: '18', src: TILES['18'] },
    { alias: '19', src: TILES['19'] },
    { alias: '20', src: TILES['20'] },
    { alias: '21', src: TILES['21'] },
    { alias: '22', src: TILES['22'] },
    { alias: '23', src: TILES['23'] },
    { alias: '24', src: TILES['24'] },
    { alias: '25', src: TILES['25'] },
    { alias: '26', src: TILES['26'] },
    { alias: '27', src: TILES['27'] },
    { alias: '28', src: TILES['28'] },
    { alias: '29', src: TILES['29'] },
    { alias: '30', src: TILES['30'] },
    { alias: '31', src: TILES['31'] },
    { alias: '32', src: TILES['32'] },
    { alias: '33', src: TILES['33'] },
    { alias: '34', src: TILES['34'] },
    { alias: '35', src: TILES['35'] },
    { alias: '36', src: TILES['36'] },
    { alias: '37', src: TILES['37'] },
    { alias: '38', src: TILES['38'] },
    { alias: '39', src: TILES['39'] },
    { alias: '40', src: TILES['40'] },
    { alias: '41', src: TILES['41'] },
    { alias: '42', src: TILES['42'] },
    { alias: '43', src: TILES['43'] },
    { alias: '44', src: TILES['44'] },
    { alias: '45', src: TILES['45'] },
    { alias: '46', src: TILES['46'] },
    { alias: '47', src: TILES['47'] },
    { alias: '48', src: TILES['48'] },
    { alias: '49', src: TILES['49'] },
    { alias: '50', src: TILES['50'] },
    { alias: '51', src: TILES['51'] },
    { alias: '52', src: TILES['52'] },
    { alias: '53', src: TILES['53'] },
    { alias: '54', src: TILES['54'] },
    { alias: '55', src: TILES['55'] },
    { alias: '56', src: TILES['56'] },
    { alias: '57', src: TILES['57'] },
    { alias: '58', src: TILES['58'] },
    { alias: '59', src: TILES['59'] },
    { alias: '60', src: TILES['60'] },
    { alias: '61', src: TILES['61'] },
    { alias: '62', src: TILES['62'] },
    { alias: '63', src: TILES['63'] },
    { alias: '64', src: TILES['64'] },
    { alias: '65', src: TILES['65'] },
    { alias: '66', src: TILES['66'] },
    { alias: '67', src: TILES['67'] },
    { alias: '68', src: TILES['68'] },
    { alias: '69', src: TILES['69'] },
    { alias: '70', src: TILES['70'] },
    { alias: '71', src: TILES['71'] },
    { alias: '72', src: TILES['72'] },
    { alias: '73', src: TILES['73'] },
    { alias: '74', src: TILES['74'] },
    { alias: '75', src: TILES['75'] },
    { alias: '76', src: TILES['76'] },
    { alias: '77', src: TILES['77'] },
    { alias: '78', src: TILES['78'] },
    { alias: '79', src: TILES['79'] },
    { alias: '80', src: TILES['80'] },
    { alias: '81', src: TILES['81'] },
    { alias: '82', src: TILES['82'] },
    { alias: '83', src: TILES['83'] },
    { alias: '84', src: TILES['84'] },
    { alias: '85', src: TILES['85'] },
    { alias: '86', src: TILES['86'] },
    { alias: '87', src: TILES['87'] },
    { alias: '88', src: TILES['88'] },
    { alias: '89', src: TILES['89'] },
    { alias: '90', src: TILES['90'] },
    { alias: '91', src: TILES['91'] },
    { alias: '92', src: TILES['92'] },
    { alias: '93', src: TILES['93'] },
    { alias: '94', src: TILES['94'] },
    { alias: '95', src: TILES['95'] },
    { alias: '96', src: TILES['96'] },
    { alias: '97', src: TILES['97'] },
    { alias: '98', src: TILES['98'] },
    { alias: '99', src: TILES['99'] },
    { alias: '100', src: TILES['100'] },
    { alias: '101', src: TILES['101'] },
    { alias: '102', src: TILES['102'] },
    { alias: '103', src: TILES['103'] },
    { alias: '104', src: TILES['104'] },
    { alias: '105', src: IDLE['105'] },
    { alias: '106', src: IDLE['106'] },
    { alias: '107', src: IDLE['107'] },
    { alias: '108', src: IDLE['108'] },
    { alias: '109', src: IDLE['109'] },
    { alias: '110', src: WALK['110'] },
    { alias: '111', src: WALK['111'] },
    { alias: '112', src: WALK['112'] },
    { alias: '113', src: WALK['113'] },
    { alias: '114', src: WALK['114'] },
    { alias: '115', src: WALK['115'] },
    { alias: '116', src: SNAP['1'] },
    { alias: '117', src: SNAP['2'] },
    { alias: '118', src: SNAP['3'] },
    { alias: '119', src: SNAP['4'] },
    { alias: '120', src: SNAP['5'] },
    { alias: '121', src: WAVE['1'] },
    { alias: '122', src: WAVE['2'] },
    { alias: '123', src: WAVE['3'] },
    { alias: '124', src: WAVE['4'] },
    { alias: '125', src: WAVE['5'] },
    { alias: '126', src: ENERGYWAVE['1'] },
    { alias: '127', src: ENERGYWAVE['2'] },
    { alias: '128', src: ENERGYWAVE['3'] },
    { alias: '129', src: ENERGYWAVE['4'] },
    { alias: '130', src: ENERGYWAVE['5'] },
    { alias: '131', src: ENERGYWAVE['6'] },
    { alias: '132', src: ENERGYWAVE['7'] },
    { alias: '133', src: ENERGYWAVE['8'] },
    { alias: '134', src: EMOJIS['1'] },
    { alias: '135', src: EMOJIS['2'] },
    { alias: '136', src: EMOJIS['3'] },
    { alias: '137', src: EMOJIS['4'] },
    { alias: 'sad', src: EMOJIS['5'] }, //sad
    { alias: 'shades', src: EMOJIS['6'] }, ///shades
    { alias: 'beer', src: EMOJIS['8'] }, // beer
  ]);
  const { assets, isSuccess } = useAssets([
    ...texturesToLoad,
    ...avatarTextures,
  ]);
  const appRef = useRef(null);
  const [gameRatio, setGameRatio] = useState(
    window.innerWidth / window.innerHeight
  );
  const [scaleFactor, setScaleFactor] = useState(gameRatio > 1.5 ? 0.8 : 1);
  const spriteRef = useRef(null);
  const spriteRef2 = useRef(null);
  const [textures, setTextures] = useState([]);
  const [walkTextures, setWalkTextures] = useState([]);
  const [snapTextures, setSnapTextures] = useState([]);
  const [waveTextures, setWaveTextures] = useState([]);
  const [heartTextures, setHeartTextures] = useState([]);
  const [energyWaveTextures, setEnergyWaveTextures] = useState([]);

  useEffect(() => {
    console.log('mounting');
    return () => {
      // Component unmounting, unload assets
      if (assets) {
        console.log('unmounting');
        Object.keys(assets).forEach((key) => {
          console.log(key, ' the key');
          if (assets[key] instanceof Texture) {
            console.log('condition met');
            Assets.unload(key).then(() => {
              console.log('unloaded');
              assets[key].destroy();
            });
          }
        });
      }
      setIsReady(false); 
      setTextures([]); 
      setWalkTextures([]); 
      setSnapTextures([]); // Reset Textures
      setWaveTextures([]); 
      setHeartTextures([]); 
      setEnergyWaveTextures([]);
    };
  }, []);

  useEffect(() => {
    if (spriteRef.current && isReady) {
      spriteRef.current.play(); // Explicitly start animation
    }
  }, []);

  useEffect(() => {
    console.log('hey');

    if (isSuccess) {
      console.log('loaded');
      const loadedTextures = [
        assets['107'],
        assets['108'],
        assets['109'],
        assets['110'],
        assets['111'],
      ];
      const loadedWalkTextures = [
        assets['112'],
        assets['113'],
        assets['114'],
        assets['115'],
        assets['116'],
        assets['117'],
      ];
      const loadedSnapTextures = [
        assets['118'],
        assets['119'],
        assets['120'],
        assets['121'],
        assets['122'],
      ];
      const loadedWaveTextures = [
        assets['123'],
        assets['124'],
        assets['125'],
        assets['126'],
        assets['127'],
      ];
      const loadedEnergyWaveTextures = [
        assets['128'],
        assets['129'],
        assets['130'],
        assets['131'],
        assets['132'],
        assets['133'],
        assets['134'],
        assets['135'],
      ];
      const loadedHeartTextures = [
        assets['136'],
        assets['137'],
        assets['138'],
        assets['139'],
      ];
      setHeartTextures(loadedHeartTextures);
      setEnergyWaveTextures(loadedEnergyWaveTextures);
      setTextures(loadedTextures);
      setWalkTextures(loadedWalkTextures);
      setSnapTextures(loadedSnapTextures);
      setWaveTextures(loadedWaveTextures);
      setIsReady(true);
      // Once textures are ready, set the state to true
    }
  }, [isSuccess, assets]); // Re-run when assets load

  // WINDOW SIZING
  const handleResize = () => {
    setGameRatio(window.innerWidth / window.innerHeight);
    setScaleFactor(gameRatio > 1.3 ? 0.75 : 1);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    (!isSuccess && !isReady && (
      <div>
        <div>
          <VelocityScroll>LOADING GAME</VelocityScroll>
        </div>
        <div>
          <VelocityScroll>LOADING GAME</VelocityScroll>
        </div>
        <div className="flex justify-center">
          <img id="loading-image" src={loading} alt="Loading..."></img>
        </div>
        <div>
          <VelocityScroll>LOADING GAME</VelocityScroll>
        </div>
      </div>
    )) ||
    (isSuccess && isReady && (
      <Application
        resizeTo={appRef}
        width={640}
        height={360}
        backgroundColor={' #FFFFFF'}
        resolution={2.5}
      >
        {mapPack.layers.map((objLay, layerIndex) => (
          <pixiContainer key={layerIndex}>
            {objLay.tiles.map((objTiles, index) => (
              <pixiSprite
                texture={Assets.get(
                  nightClubTileSet[Math.floor(objTiles.id / 8)][objTiles.id % 8]
                )}
                ref={spriteRef2}
                x={32 * objTiles.x * 1.25}
                y={32 * objTiles.y * 1.25}
                scale={1.25}
                key={index}
              />
            ))}
          </pixiContainer>
        ))}
        {
          <DataContext.Provider
            value={{
              scaleFactor,
              isReady,
              heartTextures,
              onKeyboard,
              chatSetOnKeyboard,
            }}
          >
            <DecoyText
              snapTextures={snapTextures}
              walkTextures={walkTextures}
              energyWaveTextures={energyWaveTextures}
              waveTextures={waveTextures}
              textures={textures}
              heartTextures={heartTextures}
            />
          </DataContext.Provider>
        }
      </Application>
    ))
  );
};

export default MainChat;
