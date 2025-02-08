import React, {useState, useEffect} from 'react';
import {createAvatar} from '@dicebear/core';
import {adventurer} from '@dicebear/collection';
import {Label} from '@/components/ui/label';
import {ChevronDown, ChevronUp} from 'lucide-react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

function Avatar() {
    const [avatarUri, setAvatarUri] = useState('');
    const [previewUris, setPreviewUris] = useState({
        skin: {},
        hair: {},
        hairColor: {},
        eyebrows: {},
        eyes: {},
        mouth: {},
        earrings: {},
    });
    const [openSection, setOpenSection] = useState('');
    const [avatarItems, setAvatarItems] = useState({
        seed: 'Felix',
        skinColor: ['f2d3b1'],
        hair: ['short04'],
        hairColor: ['0e0e0e'],
        eyebrows: ['variant07'],
        eyes: ['variant04'],
        mouth: ['variant05'],
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
            'short13', 'short14', 'short15', 'short16', 'short17', 'short18', 'short19',
        ],
        hairColor: [
            '0e0e0e', '3eac2c', '6a4e35', '85c2c6', '796a45', '562306',
            '592454', 'ab2a18', 'ac6511', 'afafaf', 'b9a05f', 'cb6820',
            'dba3be', 'e5d7a3',
        ],
        eyebrows: [
            'variant01', 'variant02', 'variant03', 'variant04', 'variant05',
            'variant06', 'variant07', 'variant08', 'variant09', 'variant10',
            'variant11', 'variant12', 'variant13', 'variant14', 'variant15',
        ],
        eyes: [
            'variant01', 'variant02', 'variant03', 'variant04', 'variant05',
            'variant06', 'variant07', 'variant08', 'variant09', 'variant10',
            'variant11', 'variant12', 'variant13', 'variant14', 'variant15',
            'variant16', 'variant17', 'variant18', 'variant19', 'variant20',
            'variant21', 'variant22', 'variant23', 'variant24', 'variant25',
            'variant26',
        ],
        mouth: [
            'variant01', 'variant02', 'variant03', 'variant04', 'variant05',
            'variant06', 'variant07', 'variant08', 'variant09', 'variant10',
            'variant11', 'variant12', 'variant13', 'variant14', 'variant15',
            'variant16', 'variant17', 'variant18', 'variant19', 'variant20',
            'variant21', 'variant22', 'variant23', 'variant24', 'variant25',
            'variant26', 'variant27', 'variant28', 'variant29', 'variant30',
        ],
    };


    const generatePreviews = async () => {
        try {
            const previews = {
                skin: {},
                hair: {},
                hairColor: {},
                eyebrows: {},
                eyes: {},
                mouth: {},
            };

            for (let i = 0; i < avatarOptions.skinColor.length; i++) {
                const skinColor = avatarOptions.skinColor[i];
                const previewAvatar = createAvatar(adventurer, {
                    ...avatarItems,
                    skinColor: [skinColor]
                });
                previews.skin[skinColor] = await previewAvatar.toDataUri();
            }

            for (let i = 0; i < avatarOptions.hair.length; i++) {
                const hair = avatarOptions.hair[i];
                const previewAvatar = createAvatar(adventurer, {
                    ...avatarItems,
                    hair: [hair]
                });
                previews.hair[hair] = await previewAvatar.toDataUri();
            }

            for (let i = 0; i < avatarOptions.hairColor.length; i++) {
                const hairColor = avatarOptions.hairColor[i];
                const previewAvatar = createAvatar(adventurer, {
                    ...avatarItems,
                    hairColor: [hairColor]
                });
                previews.hairColor[hairColor] = await previewAvatar.toDataUri();
            }

            for (let i = 0; i < avatarOptions.eyebrows.length; i++) {
                const eyebrows = avatarOptions.eyebrows[i];
                const previewAvatar = createAvatar(adventurer, {
                    ...avatarItems,
                    eyebrows: [eyebrows]
                });
                previews.eyebrows[eyebrows] = await previewAvatar.toDataUri();
            }

            for (let i = 0; i < avatarOptions.eyes.length; i++) {
                const eyes = avatarOptions.eyes[i];
                const previewAvatar = createAvatar(adventurer, {
                    ...avatarItems,
                    eyes: [eyes]
                });
                previews.eyes[eyes] = await previewAvatar.toDataUri();
            }

            for (let i = 0; i < avatarOptions.mouth.length; i++) {
                const mouth = avatarOptions.mouth[i];
                const previewAvatar = createAvatar(adventurer, {
                    ...avatarItems,
                    mouth: [mouth]
                });
                previews.mouth[mouth] = await previewAvatar.toDataUri();
            }


            setPreviewUris(previews);

        } catch (error) {
            console.error('Error getting avatar previews', error);
        }

    };

    // toggle dropdowns
    const toggleSection = (section) => {
        if (openSection === section) {
            setOpenSection('');
        } else {
            setOpenSection(section);
        }
    };


    // update selection
    const updateAvatar = async () => {
        try {
            const avatar = createAvatar(adventurer, avatarItems);
            const uri = await avatar.toDataUri();
            setAvatarUri(uri);
        } catch (error) {
            console.error('Error creating avatar: ', error);
        }
    };


    useEffect(() => {
        updateAvatar();
    }, [avatarItems]);

    useEffect(() => {
        generatePreviews();
    }, [avatarItems.skinColor, avatarItems.hair, avatarItems.hairColor, avatarItems.eyebrows, avatarItems.eyes, avatarItems.mouth,]);

    return (


                <div className="flex flex-col space-y-4">
                    <div className="flex justify-center">
                        <img
                            src={avatarUri}
                            className="w-32 h-32 rounded-full border-2 border-orange-500/30"
                        />
                    </div>


                    <Collapsible open={openSection === 'skin'}>
                        <CollapsibleTrigger
                            onClick={() => toggleSection('skin')}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-orange-500/10"
                        >
                            <Label className="text-gray-200 cursor-pointer">Skin Color</Label>
                            {openSection === 'skin' ? <ChevronUp/> : <ChevronDown/>}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">

                            <div className="grid grid-cols-4 gap-2">
                                {avatarOptions.skinColor.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setAvatarItems({...avatarItems, skinColor: [color]})}
                                        className={`p-1 rounded-lg ${avatarItems.skinColor[0] === color ? 'ring-2 ring-orange-500' : 'ring-1 ring-orange-500/30'} hover:ring-orange-500/60`}
                                    >
                                        <img src={previewUris.skin[color]} className="w-16 h-16"/>
                                    </button>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>


                    <Collapsible open={openSection === 'hair'}>
                        <CollapsibleTrigger
                            onClick={() => toggleSection('hair')}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-orange-500/10"
                        >
                            <Label className="text-gray-200 cursor-pointer">Hair Style</Label>
                            {openSection === 'hair' ? <ChevronUp/> : <ChevronDown/>}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">

                            <div className="grid grid-cols-5 gap-2">
                                {avatarOptions.hair.map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setAvatarItems({...avatarItems, hair: [style]})}
                                        className={`p-1 rounded-lg ${avatarItems.hair[0] === style ? 'ring-2 ring-orange-500' : 'ring-1 ring-orange-500/30'} hover:ring-orange-500/60`}
                                    >
                                        <img src={previewUris.hair[style]} className="w-16 h-16"/>
                                    </button>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>


                    <Collapsible open={openSection === 'hairColor'}>
                        <CollapsibleTrigger
                            onClick={() => toggleSection('hairColor')}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-orange-500/10"
                        >

                            <Label className="text-gray-200 cursor-pointer">Hair Color</Label>
                            {openSection === 'hairColor' ? <ChevronUp/> : <ChevronDown/>}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">

                            <div className="grid grid-cols-5 gap-2">
                                {avatarOptions.hairColor.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setAvatarItems({...avatarItems, hairColor: [color]})}
                                        className={`p-1 rounded-lg ${avatarItems.hairColor[0] === color ? 'ring-2 ring-orange-500' : 'ring-1 ring-orange-500/30'} hover:ring-orange-500/60`}
                                    >

                                        <img src={previewUris.hairColor[color]} className="w-16 h-16"/>
                                    </button>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>


                    <Collapsible open={openSection === 'eyebrows'}>
                        <CollapsibleTrigger
                            onClick={() => toggleSection('eyebrows')}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-orange-500/10"
                        >

                            <Label className="text-gray-200 cursor-pointer">Eyebrows</Label>
                            {openSection === 'eyebrows' ? <ChevronUp/> : <ChevronDown/>}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">

                            <div className="grid grid-cols-5 gap-2">
                                {avatarOptions.eyebrows.map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setAvatarItems({...avatarItems, eyebrows: [style]})}
                                        className={`p-1 rounded-lg ${avatarItems.eyebrows[0] === style ? 'ring-2 ring-orange-500' : 'ring-1 ring-orange-500/30'} hover:ring-orange-500/60`}
                                    >

                                        <img src={previewUris.eyebrows[style]} className="w-16 h-16"/>
                                    </button>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>


                    <Collapsible open={openSection === 'eyes'}>
                        <CollapsibleTrigger
                            onClick={() => toggleSection('eyes')}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-orange-500/10"
                        >
                            <Label className="text-gray-200 cursor-pointer">Eyes</Label>
                            {openSection === 'eyes' ? <ChevronUp/> : <ChevronDown/>}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">
                            <div className="grid grid-cols-5 gap-2">
                                {avatarOptions.eyes.map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setAvatarItems({...avatarItems, eyes: [style]})}
                                        className={`p-1 rounded-lg ${avatarItems.eyes[0] === style ? 'ring-2 ring-orange-500' : 'ring-1 ring-orange-500/30'} hover:ring-orange-500/60`}
                                    >


                                        <img src={previewUris.eyes[style]} className="w-16 h-16"/>
                                    </button>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>


                    <Collapsible open={openSection === 'mouth'}>
                        <CollapsibleTrigger
                            onClick={() => toggleSection('mouth')}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-orange-500/10"
                        >


                            <Label className="text-gray-200 cursor-pointer">Mouth</Label>
                            {openSection === 'mouth' ? <ChevronUp/> : <ChevronDown/>}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">
                            <div className="grid grid-cols-5 gap-2">
                                {avatarOptions.mouth.map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setAvatarItems({...avatarItems, mouth: [style]})}
                                        className={`p-1 rounded-lg ${avatarItems.mouth[0] === style ? 'ring-2 ring-orange-500' : 'ring-1 ring-orange-500/30'} hover:ring-orange-500/60`}
                                    >


                                        <img src={previewUris.mouth[style]} className="w-16 h-16"/>
                                    </button>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>


                </div>

    );
}

export default Avatar;