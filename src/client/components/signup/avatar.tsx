import React, { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';


function Avatar() {
  const [avatarUri, setAvatarUri] = useState('');
  const [previewUris, setPreviewUris] = useState({
    hair: {},
    skin: {}
  });

  const [avatarItems, setAvatarItems] = useState({
    seed: 'Felix',
    skinColor: ['f2d3b1'],
    hair: ['short04'],
    hairColor: ['0e0e0e'],
    eyebrows: ['variant07'],
    eyes: ['variant04'],
    mouth: ['variant05'],
    earrings: ['variant05']
  });

  const avatarOptions = {
    seed: ['Felix'],
    skinColor: ['9e5622', '763900', 'ecad80', 'f2d3b1'],
    hair: [
      'long01', 'long02', 'long03', 'long04', 'long05', 'long06', 'long07',
      'long08', 'long09', 'long10', 'long11', 'long12', 'long13', 'long14',
      'long15', 'long16', 'long17', 'long18', 'long19', 'long20', 'long21',
      'long22', 'long23', 'long24', 'long25', 'long26',
      'short01', 'short02', 'short03', 'short04', 'short05', 'short06',
      'short07', 'short08', 'short09', 'short10', 'short11', 'short12',
      'short13', 'short14', 'short15', 'short16', 'short17', 'short18', 'short19'
    ],
    hairColor: [
      '0e0e0e', '3eac2c', '6a4e35', '85c2c6', '796a45', '562306',
      '592454', 'ab2a18', 'ac6511', 'afafaf', 'b9a05f', 'cb6820',
      'dba3be', 'e5d7a3'
    ],
    eyebrows: [
      'variant01', 'variant02', 'variant03', 'variant04', 'variant05',
      'variant06', 'variant07', 'variant08', 'variant09', 'variant10',
      'variant11', 'variant12', 'variant13', 'variant14', 'variant15'
    ],
    eyes: [
      'variant01', 'variant02', 'variant03', 'variant04', 'variant05',
      'variant06', 'variant07', 'variant08', 'variant09', 'variant10',
      'variant11', 'variant12', 'variant13', 'variant14', 'variant15',
      'variant16', 'variant17', 'variant18', 'variant19', 'variant20',
      'variant21', 'variant22', 'variant23', 'variant24', 'variant25',
      'variant26'
    ],
    mouth: [
      'variant01', 'variant02', 'variant03', 'variant04', 'variant05',
      'variant06', 'variant07', 'variant08', 'variant09', 'variant10',
      'variant11', 'variant12', 'variant13', 'variant14', 'variant15',
      'variant16', 'variant17', 'variant18', 'variant19', 'variant20',
      'variant21', 'variant22', 'variant23', 'variant24', 'variant25',
      'variant26', 'variant27', 'variant28', 'variant29', 'variant30'
    ],
    earrings: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06']
  };



  const generatePreviews = async () => {
    const previews = {
      hair: {},
      skin: {}
    };

    for (let i = 0; i < avatarOptions.hair.length; i++) {
      const hairStyle = avatarOptions.hair[i];
      const previewAvatar = createAvatar(adventurer, {
        ...avatarItems,
        hair: [hairStyle]
      });
      previews.hair[hairStyle] = await previewAvatar.toDataUri();
    }

    for (let i = 0; i < avatarOptions.skinColor.length; i++) {
      const skinColor = avatarOptions.skinColor[i];
      const previewAvatar = createAvatar(adventurer, {
        ...avatarItems,
        skinColor: [skinColor]
      });
      previews.skin[skinColor] = await previewAvatar.toDataUri();
    }

    setPreviewUris(previews);
  };






  const updateAvatar = async () => {
    try {
      const avatar = createAvatar(adventurer, avatarItems);
      const uri = await avatar.toDataUri();
      setAvatarUri(uri);
    } catch (error) {
      console.error('Error creating avatar: ', error);
    }
  };

  // const updateAvatar = async () => {
  //   try {
  //     const avatar = createAvatar(adventurer, {
  //       seed: avatarItems.seed,
  //       skinColor: avatarItems.skinColor,
  //       hair: avatarItems.hair,
  //       hairColor: avatarItems.hairColor,
  //       eyebrows: avatarItems.eyebrows,
  //       eyes: avatarItems.eyes,
  //       mouth: avatarItems.mouth,
  //       glasses: avatarItems.glasses,
  //       earrings: avatarItems.earrings,
  //     });
  //
  //     const uri = await avatar.toDataUri();
  //     setAvatarUri(uri);
  //   } catch (error) {
  //     console.error('Error creating avatar:', error);
  //   }
  // };

  useEffect(() => {
    updateAvatar();
  }, [avatarItems]);

  useEffect(() => {
    generatePreviews();
  }, [avatarItems.skinColor, avatarItems.hairColor]);

  return (

      <Card className="backdrop-blur-lg bg-white/5 border border-orange-500/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Customize Your Avatar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div className="flex justify-center">
              <img
                  src={avatarUri}
                  className="w-32 h-32 rounded-full border-2 border-orange-500/30"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200 block">Skin Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {avatarOptions.skinColor.map((color) => (
                    <button
                        key={color}
                        onClick={() => setAvatarItems({ ...avatarItems, skinColor: [color] })}
                        className={`
                    p-1 rounded-lg
                    ${avatarItems.skinColor[0] === color
                            ? 'ring-2 ring-orange-500'
                            : 'ring-1 ring-orange-500/30'}
                    hover:ring-orange-500/60
                  `}
                    >
                      <img
                          src={previewUris.skin[color]}
                          className="w-16 h-16"
                      />
                    </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200 block">Hair Style</Label>
              <div className="grid grid-cols-5 gap-2">
                {avatarOptions.hair.map((style) => (
                    <button
                        key={style}
                        onClick={() => setAvatarItems({ ...avatarItems, hair: [style] })}
                        className={`
                    p-1 rounded-lg
                    ${avatarItems.hair[0] === style
                            ? 'ring-2 ring-orange-500'
                            : 'ring-1 ring-orange-500/30'}
                    hover:ring-orange-500/60
                  `}
                    >
                      <img
                          src={previewUris.hair[style]}
                          className="w-16 h-16"
                      />
                    </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      // <Card className="backdrop-blur-lg bg-white/5 border border-orange-500/20">
      //   <CardHeader>
      //     <CardTitle className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
      //       Customize Your Avatar
      //     </CardTitle>
      //   </CardHeader>
      //   <CardContent>
      //     <div className="flex flex-col space-y-6">
      //       <div className="flex justify-center">
      //         <img
      //             src={avatarUri}
      //             className="w-32 h-32 rounded-full border-2 border-orange-500/30"
      //         />
      //       </div>
      //
      //       <div className="space-y-2">
      //         <Label className="text-gray-200 block">Hair Style</Label>
      //         <div className="grid grid-cols-5 gap-2">
      //           {hairOptions.map((style) => (
      //               <button
      //                   key={style}
      //                   onClick={() => setAvatarItems({ ...avatarItems, hair: [style] })}
      //                   className={`
      //               p-1 rounded-lg
      //               ${avatarItems.hair[0] === style
      //                       ? 'ring-2 ring-orange-500'
      //                       : 'ring-1 ring-orange-500/30'}
      //               hover:ring-orange-500/60
      //             `}
      //               >
      //                 <img
      //                     src={previewUris[style]}
      //                     className="w-16 h-16"
      //                 />
      //               </button>
      //           ))}
      //         </div>
      //       </div>
      //     </div>
      //   </CardContent>
      // </Card>
      // <Card className="backdrop-blur-lg bg-white/5 border border-orange-500/20">
      //   <CardHeader>
      //     <CardTitle className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
      //       Customize Your Avatar
      //     </CardTitle>
      //   </CardHeader>
      //   <CardContent>
      //     <div className="flex flex-col space-y-6">
      //       <div className="flex justify-center">
      //         <img
      //             src={avatarUri}
      //             className="w-32 h-32 rounded-full border-2 border-orange-500/30"
      //         />
      //       </div>
      //
      //       <div className="space-y-2">
      //         <Label className="text-gray-200 block">Skin Color</Label>
      //         <div className="flex flex-wrap gap-2">
      //           {avatarOptions.skinColor.map((color) => (
      //               <Button
      //                   key={color}
      //                   onClick={() => setAvatarItems({ ...avatarItems, skinColor: [color] })}
      //                   className={`
      //               ${avatarItems.skinColor[0] === color
      //                       ? 'bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border-orange-500/50'
      //                       : 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border-orange-500/30'}
      //               hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30
      //               border text-sm py-1
      //             `}
      //               >
      //                 {color}
      //               </Button>
      //           ))}
      //         </div>
      //       </div>
      //
      //       <div className="space-y-2">
      //         <Label className="text-gray-200 block">Hair Style</Label>
      //         <div className="flex flex-wrap gap-2">
      //           {avatarOptions.hair.map((style) => (
      //               <Button
      //                   key={style}
      //                   onClick={() => setAvatarItems({ ...avatarItems, hair: [style] })}
      //                   className={`
      //               ${avatarItems.hair[0] === style
      //                       ? 'bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border-orange-500/50'
      //                       : 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border-orange-500/30'}
      //               hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30
      //               border text-sm py-1
      //             `}
      //               >
      //                 {style}
      //               </Button>
      //           ))}
      //         </div>
      //       </div>
      //
      //       <div className="space-y-2">
      //         <Label className="text-gray-200 block">Hair Color</Label>
      //         <div className="flex flex-wrap gap-2">
      //           {avatarOptions.hairColor.map((color) => (
      //               <Button
      //                   key={color}
      //                   onClick={() => setAvatarItems({ ...avatarItems, hairColor: [color] })}
      //                   className={`
      //               ${avatarItems.hairColor[0] === color
      //                       ? 'bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border-orange-500/50'
      //                       : 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border-orange-500/30'}
      //               hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30
      //               border text-sm py-1
      //             `}
      //               >
      //                 {color}
      //               </Button>
      //           ))}
      //         </div>
      //       </div>
      //
      //       <div className="space-y-2">
      //         <Label className="text-gray-200 block">Eyes</Label>
      //         <div className="flex flex-wrap gap-2">
      //           {avatarOptions.eyes.map((style) => (
      //               <Button
      //                   key={style}
      //                   onClick={() => setAvatarItems({ ...avatarItems, eyes: [style] })}
      //                   className={`
      //               ${avatarItems.eyes[0] === style
      //                       ? 'bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border-orange-500/50'
      //                       : 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border-orange-500/30'}
      //               hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30
      //               border text-sm py-1
      //             `}
      //               >
      //                 {style}
      //               </Button>
      //           ))}
      //         </div>
      //       </div>
      //
      //       <div className="space-y-2">
      //         <Label className="text-gray-200 block">Eyebrows</Label>
      //         <div className="flex flex-wrap gap-2">
      //           {avatarOptions.eyebrows.map((style) => (
      //               <Button
      //                   key={style}
      //                   onClick={() => setAvatarItems({ ...avatarItems, eyebrows: [style] })}
      //                   className={`
      //               ${avatarItems.eyebrows[0] === style
      //                       ? 'bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border-orange-500/50'
      //                       : 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border-orange-500/30'}
      //               hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30
      //               border text-sm py-1
      //             `}
      //               >
      //                 {style}
      //               </Button>
      //           ))}
      //         </div>
      //       </div>
      //
      //       <div className="space-y-2">
      //         <Label className="text-gray-200 block">Mouth</Label>
      //         <div className="flex flex-wrap gap-2">
      //           {avatarOptions.mouth.map((style) => (
      //               <Button
      //                   key={style}
      //                   onClick={() => setAvatarItems({ ...avatarItems, mouth: [style] })}
      //                   className={`
      //               ${avatarItems.mouth[0] === style
      //                       ? 'bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border-orange-500/50'
      //                       : 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border-orange-500/30'}
      //               hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30
      //               border text-sm py-1
      //             `}
      //               >
      //                 {style}
      //               </Button>
      //           ))}
      //         </div>
      //       </div>
      //
      //       <div className="space-y-2">
      //         <Label className="text-gray-200 block">Earrings</Label>
      //         <div className="flex flex-wrap gap-2">
      //           {avatarOptions.earrings.map((style) => (
      //               <Button
      //                   key={style}
      //                   onClick={() => setAvatarItems({ ...avatarItems, earrings: [style] })}
      //                   className={`
      //               ${avatarItems.earrings[0] === style
      //                       ? 'bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border-orange-500/50'
      //                       : 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border-orange-500/30'}
      //               hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30
      //               border text-sm py-1
      //             `}
      //               >
      //                 {style}
      //               </Button>
      //           ))}
      //         </div>
      //       </div>
      //     </div>
      //   </CardContent>
      // </Card>
  );
}

export default Avatar;