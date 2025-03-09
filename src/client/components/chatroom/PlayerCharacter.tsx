import React, { useEffect, useState, useContext, useRef } from 'react';
import { extend } from '@pixi/react';
import {
  Container,
  Graphics,
  Sprite,
  Texture,
  Assets,
  Text,
  TextStyle,
  AnimatedSprite,
} from 'pixi.js';
import { UserContext } from '../../contexts/UserContext';
import {
  ChatroomContext,
  DataContext,
} from '@/client/contexts/ChatroomContext';
import { SocketContext } from '@/client/contexts/SocketContext';
import { PlayerData } from '@/types/Players';
extend({
  Container,
  Graphics,
  Sprite,
  Texture,
  Text,
  TextStyle,
  AnimatedSprite,
});

const styleMessage = new TextStyle({
  align: 'center',
  fontFamily: 'sans-serif',
  fontSize: 10,
  fontWeight: 'bold',
  fill: '#000000',
  stroke: '#eef1f5',
  letterSpacing: 2,
  wordWrap: true,
  wordWrapWidth: 80,
});

const styleUserName = new TextStyle({
  align: 'center',
  fontFamily: 'sans-serif',
  fontSize: 15,
  fontWeight: 'bold',
  fill: '#000000',
  stroke: '#eef1f5',
  letterSpacing: 5,
  wordWrap: true,
  wordWrapWidth: 250,
});

interface PlayerCharacterProps {
  snapTextures?: Texture[],
  walkTextures?: Texture[],
  energyWaveTextures?: Texture[],
  waveTextures?: Texture[],
  textures?: Texture[],
  heartTextures?: Texture[],
}
const PlayerCharacter = ({ 
  snapTextures,
  walkTextures,
  energyWaveTextures,
  waveTextures,
  textures,
  heartTextures,
   }: PlayerCharacterProps) => {
  const {
    onKeyboard,
    chatSetOnKeyboard,
    isReady,
    scaleFactor,
  } = useContext(DataContext);
  const socket = useContext(SocketContext);
  const [allPlayers, setAllPlayers] = useState<PlayerData[]>([]);
  const eventId = useContext(ChatroomContext);
  const { user } = useContext(UserContext);
  const spriteRef = useRef(null);
  const spriteRef2 = useRef(null);

  useEffect(() => {
    const updatePos = (data) => {
      let allPlayerInfo = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].room === eventId) {
          allPlayerInfo.push({
            id: data[i].id,
            avatar: data[i].avatar,
            x: data[i].x,
            y: data[i].y,
            username: data[i].username,
            sentMessage: data[i].sentMessage,
            currentMessage: data[i].currentMessage,
            room: data[i].room,
            isWalking: data[i].isWalking,
            isSnapping: data[i].isSnapping,
            isWaving: data[i].isWaving,
            isEnergyWaving: data[i].isEnergyWaving,
            isHearting: data[i].isHearting,
            equipShades: data[i].equipShades,
            equip420: data[i].equip420,
            equipBeer: data[i].equipBeer,
            isSad: data[i].isSad,
          });
          if (data[i].username === user.username) {
            if (
              data[i].x < 466 &&
              data[i].x > 412 &&
              data[i].y > 112 &&
              data[i].y < 150 &&
              !onKeyboard
            ) {
              chatSetOnKeyboard(true);
            }
            if (
              data[i].x > 466 ||
              data[i].x < 412 ||
              ((data[i].y < 112 || data[i].y > 150) && onKeyboard)
            ) {
                chatSetOnKeyboard(false);
            }
          }
        }
      }
      setAllPlayers(allPlayerInfo);
    };
    socket?.off('newPositions');
    socket?.on('newPositions', updatePos);
    return () => {
      socket?.removeAllListeners('newPositions');
      socket?.off('newPositions');
    };
  }, [eventId, user, socket]);

  useEffect(() => {
    if (spriteRef.current && isReady) {
      spriteRef.current.play();
    }
    return () => {
      if (spriteRef2.current) {
         spriteRef2.current.texture?.destroy(true);
         spriteRef2.current = null;
      }
      if (spriteRef.current) {
         spriteRef.current.texture?.destroy(true);
         spriteRef.current = null;
      }
    };
  }, [isReady]);

  return isReady && allPlayers.map((player) => {
    if (!player) return null;
    const getPlayerAnimation = () => {
      if (player.isSnapping && snapTextures) return snapTextures;
      if (player.isWalking && walkTextures) return walkTextures;
      if (player.isEnergyWaving && energyWaveTextures) return energyWaveTextures;
      if (player.isWaving && waveTextures) return waveTextures;
      return textures;
    };
    if (!isReady || !textures || !walkTextures || !snapTextures || !waveTextures || !heartTextures || !energyWaveTextures) {
      return null; // Skip rendering if textures are not ready
    }
    return (
      <pixiContainer x={player.x} y={player.y} key={player.id} scale={1.24}>
        {player.sentMessage && (
          <>
            <pixiSprite
              texture={Assets.get('speech')}
              anchor={0.5}
              x={70}
              y={-30}
              scale={1.1}
              width={player.currentMessage.length >= 70 ? 125 : 110}
              height={
                player.currentMessage.length >= 70
                  ? player.currentMessage.length >= 90
                    ? 140
                    : 110
                  : 70
              }
            />
            <pixiText
              text={player.currentMessage}
              anchor={0.5}
              x={70}
              y={-40}
              scale={1.1}
              style={styleMessage}
            />
          </>
        )}
        <pixiText
          text={player.username}
          anchor={0.5}
          x={10}
          y={40}
          style={styleUserName}
        />
        <pixiSprite
          texture={Assets.get(player.username)}
          ref={spriteRef2}
          x={0}
          y={-13}
          scale={1.2}
          width={25}
          height={25}
        />
        {isReady && (
          <pixiAnimatedSprite
            textures={getPlayerAnimation()}
            x={-18.6}
            y={-21}
            ref={(ref) => ref?.play()}
            initialFrame={0}
            animationSpeed={player.isSnapping ? 0.27 : 0.1}
            loop={true}
            scale={1.2}
            width={64}
            height={64}
          />
        )}
        {isReady && player.isHearting && (
          <pixiAnimatedSprite
            textures={heartTextures}
            x={11}
            y={-48}
            rotation={0.5}
            ref={(ref) => ref?.play()}
            initialFrame={0}
            animationSpeed={0.2}
            loop={true}
            scale={{ x: 0.1, y: 0.1 }}
          />
        )}
        {isReady && (
          <>
            {player.equip420 && (
              <pixiSprite
                texture={Assets.get('joint')}
                x={-1}
                y={5}
                width={10}
                height={10}
              />
            )}
            {player.equipBeer && (
              <pixiSprite
                texture={Assets.get('beer')}
                x={-5}
                y={5}
                width={15}
                height={15}
              />
            )}
            {player.equipShades && (
              <pixiSprite
                texture={Assets.get('shades')}
                x={2}
                y={-9}
                width={20}
                height={20}
              />
            )}
            {player.isSad && (
              <pixiSprite
                texture={Assets.get('sad')}
                x={2}
                y={-33}
                width={20}
                height={20}
              />
            )}
          </>
        )}
      </pixiContainer>
    );
  });
};

export default PlayerCharacter;