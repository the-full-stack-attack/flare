import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/client/contexts/UserContext';
import axios from 'axios';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { FaPencilAlt, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import FlareCard from '../components/flares/FlareCard';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Label } from '@/components/ui/label';

type FlareType = {
  id: number;
  name: string;
  type: string | void;
  icon: string;
  achievement: string;
  milestone: string;
  description: string;
  value: number;
};

type FlareArr = FlareType[];

function AccountSettings() {
  const { user, getUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [avatarId, setAvatarId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userFlares, setUserFlares] = useState<FlareArr>([]);
  
  // avatar states
  const [avatarItems, setAvatarItems] = useState({
    seed: 'Felix',
    skinColor: ['f2d3b1'],
    hair: ['short04'],
    hairColor: ['0e0e0e'],
    eyebrows: ['variant07'],
    eyes: ['variant04'],
    mouth: ['variant05'],
  });
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
  const [openSection, setOpenSection] = useState('skin');

  const avatarOptions = {
    seed: ['Felix'],
    skinColor: ['9e5622', '763900', 'ecad80', 'f2d3b1'],
    hair: [
      'long01', 'long02', 'long03', 'long04', 'long05', 'long06', 'long07', 'long08',
      'long09', 'long10', 'long11', 'long12', 'long13', 'long14', 'long15', 'long16',
      'long17', 'long18', 'long19', 'long20', 'long21', 'long22', 'long23', 'long24',
      'long25', 'long26', 'short01', 'short02', 'short03', 'short04', 'short05',
      'short06', 'short07', 'short08', 'short09', 'short10', 'short11', 'short12',
      'short13', 'short14', 'short15', 'short16', 'short17', 'short18', 'short19',
    ],
    hairColor: [
      '0e0e0e', '3eac2c', '6a4e35', '85c2c6', '796a45', '562306', '592454',
      'ab2a18', 'ac6511', 'afafaf', 'b9a05f', 'cb6820', 'dba3be', 'e5d7a3',
    ],
    eyebrows: [
      'variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06',
      'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12',
      'variant13', 'variant14', 'variant15',
    ],
    eyes: [
      'variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06',
      'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12',
      'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18',
      'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24',
      'variant25', 'variant26',
    ],
    mouth: [
      'variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06',
      'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12',
      'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18',
      'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24',
      'variant25', 'variant26', 'variant27', 'variant28', 'variant29', 'variant30',
    ],
  };

  const phoneDisplay = formatNumber(user.phone_number);

  function formatNumber(number: string | null): string {
    if (!number) return '';
    
    const newNumber: string[] = number.split('');
    newNumber.splice(0, 0, '(');
    newNumber.splice(4, 0, ')');
    newNumber.splice(8, 0, '-');
    return newNumber.join('');
  }

  // load initial avatar data when entering edit mode
  useEffect(() => {
    if (user?.id && isEditing) {
      axios.get(`/api/settings/user/${user.id}/avatar`)
        .then(({ data }) => {
          if (data) {
            setAvatarItems({
              seed: 'Felix',
              skinColor: [data.skin],
              hair: [data.hair],
              hairColor: [data.hair_color],
              eyebrows: [data.eyebrows],
              eyes: [data.eyes],
              mouth: [data.mouth],
            });
          }
        })
        .catch(err => console.error('error getting avatar:', err));
    }
  }, [user?.id, isEditing]);

  useEffect(() => {
    updateAvatar();
  }, [avatarItems]);

  useEffect(() => {
    generatePreviews();
  }, [
    avatarItems.skinColor,
    avatarItems.hair,
    avatarItems.hairColor,
    avatarItems.eyebrows,
    avatarItems.eyes,
    avatarItems.mouth,
  ]);

  const generatePreviews = async (currentItems = avatarItems) => {
    try {
      const previews = {
        skin: {},
        hair: {},
        hairColor: {},
        eyebrows: {},
        eyes: {},
        mouth: {},
        earrings: {},
      };

      // generate previews using current selections for all features
      for (const skinColor of avatarOptions.skinColor) {
        const previewAvatar = createAvatar(adventurer, {
          ...currentItems,
          skinColor: [skinColor],
        });
        previews.skin[skinColor] = await previewAvatar.toDataUri();
      }

      for (const hair of avatarOptions.hair) {
        const previewAvatar = createAvatar(adventurer, {
          ...currentItems,
          hair: [hair],
        });
        previews.hair[hair] = await previewAvatar.toDataUri();
      }

      for (const hairColor of avatarOptions.hairColor) {
        const previewAvatar = createAvatar(adventurer, {
          ...currentItems,
          hairColor: [hairColor],
        });
        previews.hairColor[hairColor] = await previewAvatar.toDataUri();
      }

      for (const eyebrows of avatarOptions.eyebrows) {
        const previewAvatar = createAvatar(adventurer, {
          ...currentItems,
          eyebrows: [eyebrows],
        });
        previews.eyebrows[eyebrows] = await previewAvatar.toDataUri();
      }

      for (const eyes of avatarOptions.eyes) {
        const previewAvatar = createAvatar(adventurer, {
          ...currentItems,
          eyes: [eyes],
        });
        previews.eyes[eyes] = await previewAvatar.toDataUri();
      }

      for (const mouth of avatarOptions.mouth) {
        const previewAvatar = createAvatar(adventurer, {
          ...currentItems,
          mouth: [mouth],
        });
        previews.mouth[mouth] = await previewAvatar.toDataUri();
      }

      setPreviewUris(previews);
    } catch (error) {
      console.error('Error generating previews:', error);
    }
  };

  const updateAvatar = async () => {
    try {
      const avatar = createAvatar(adventurer, avatarItems);
      const uri = await avatar.toDataUri();
      setAvatarUri(uri);
    } catch (error) {
      console.error('error creating avatar:', error);
    }
  };

  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection('');
    } else {
      setOpenSection(section);
    }
  };

  const handleSubmit = async () => {
    const updates = {};
    if (username.length > 0) updates.username = username;
    if (fullName.length > 0) updates.full_name = fullName;
    if (interests.length > 0) updates.interests = selectedInterests;
    if (phoneNumber !== user.phone_number && phoneNumber.length > 0) {
      updates.phone_number = phoneNumber;
    }

    // add selected avatar updates
    updates.avatar = {
      skin: avatarItems.skinColor[0],
      hair: avatarItems.hair[0],
      hair_color: avatarItems.hairColor[0],
      eyebrows: avatarItems.eyebrows[0],
      eyes: avatarItems.eyes[0],
      mouth: avatarItems.mouth[0],
    };
    updates.avatar_uri = avatarUri;

    console.log('Submitting updates:', updates);

    try {
      await axios.put(`/api/settings/user/${user.id}`, updates);
      await getUser();
      setIsEditing(false);
    } catch (error) {
      console.error('error updating user settings:', error);
    }
  };

  const handleRemovePhone = () => {
    setPhoneNumber('');
    axios.put(`/api/settings/user/${user.id}`, { phone_number: null })
      .then(() => getUser())
      .catch((error) => console.error('error removing phone number:', error));
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const getInterests = async () => {
    try {
      const [allInterests, userInterests] = await Promise.all([
        axios.get('/api/signup/interests'),
        axios.get(`/api/settings/user/${user.id}/interests`),
      ]);
      setIsEditing(false);
      setInterests(allInterests.data);
      setSelectedInterests(userInterests.data.map((interest) => interest.name));
    } catch (error) {
      console.error('error getting interests from db:', error);
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPhoneNumber('');
    setFullName('');
    setIsEditing(false);
  };

  const getFlares = () => {
    const { id } = user;
    axios
      .get(`/api/flare/${id}`)
      .then(({ data }) => {
        setUserFlares(data);
      })
      .catch((err) => {
        console.error('error getting user flares on accountsettings: ', err);
      });
  };

  useEffect(() => {
    getInterests();
    getFlares();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20">
      <div className="flex items-center justify-center py-6 px-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text">
        <div className="w-3/4 h-3/4 align-top text-center max-w-4xl">
          <div className="p-8">
            <div className="flex-col justify-center items-center gap-4 mb-8">
              <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent text-4xl font-bold">
                Your Profile
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 w-full sm:w-3/6 p-4 rounded-xl bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white font-bold text-xs sm:text-base whitespace-normal h-auto min-h-[2.5rem] py-2"
                >
                  <FaPencilAlt className="h-4 w-4 mr-2 flex-shrink-0" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={handleSubmit}
                    className="w-[45%] sm:w-[29%] p-4 rounded-xl bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white font-bold text-xs sm:text-base whitespace-normal h-auto min-h-[2.5rem] py-2"
                  >
                    <FaSave className="h-4 w-4 mr-2 flex-shrink-0" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-[45%] sm:w-[29%] p-4 rounded-xl bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white font-bold text-xs sm:text-base whitespace-normal h-auto min-h-[2.5rem] py-2"
                  >
                    <FaTimes className="h-4 w-4 mr-2 flex-shrink-0" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="text-xl my-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Your Username
            </div>
            <div className="mb-6 mt-2 text-md text-color-2 flex justify-center items-center gap-4">
              {isEditing ? (
                <Input
                  className="text-white max-w-md flex justify-center placeholder:text-white/50 bg-white/10 backdrop-blur-lg"
                  type="text"
                  placeholder={user.username}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              ) : (
                <div className="text-white">{user.username}</div>
              )}
            </div>

            <div className="text-xl my-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Your Name
            </div>
            <div className="mb-6 mt-2 text-md text-color-2 flex justify-center items-center gap-4">
              {isEditing ? (
                <Input
                  className="text-white max-w-md flex justify-center placeholder:text-white/50 bg-white/10 backdrop-blur-lg"
                  type="text"
                  placeholder={user.full_name}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              ) : (
                <div className="text-white">{user.full_name}</div>
              )}
            </div>

            <div className="text-xl my-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Your Phone Number
            </div>
            <div className="mb-6 mt-2 text-md text-color-2 flex justify-center items-center gap-4">
              {isEditing ? (
                <div className="flex items-center gap-4">
                  <Input
                    className="text-white max-w-md flex justify-center placeholder:text-white/50 bg-white/10 backdrop-blur-lg"
                    type="tel"
                    placeholder={user.phone_number}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  {user.phone_number && (
                    <Button
                      onClick={handleRemovePhone}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <FaTrash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-white">{phoneDisplay}</div>
              )}
            </div>

            <div className="text-xl my-2 mt-8 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Your Interests
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {isEditing ? (
                interests.map((interest, index) => (
                  <Button
                    key={index}
                    onClick={() => toggleInterest(interest)}
                    className={`w-full text-xs sm:text-sm whitespace-normal h-auto min-h-[2.5rem] py-2 ${
                      selectedInterests.includes(interest)
                        ? "bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border border-orange-500/50 hover:from-yellow-500/50 hover:via-orange-500/50 hover:to-pink-500/50"
                        : "bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border border-orange-500/30 hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30"
                    }`}
                  >
                    {interest}
                  </Button>
                ))
              ) : (
                selectedInterests.map((interest, index) => (
                  <Button
                    key={index}
                    className="w-full pointer-events-none bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border border-orange-500/50 text-xs sm:text-sm whitespace-normal h-auto min-h-[2.5rem] py-2"
                  >
                    {interest}
                  </Button>
                ))
              )}
            </div>

            <div className="text-xl my-2 mt-8 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Your Avatar
            </div>
            {isEditing ? (
              <div className="flex flex-col space-y-4 mb-12">
                <div className="flex justify-center">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.orange.500/0.2)_0%,theme(colors.pink.500/0.1)_50%,transparent_100%)]" />
                    <img
                      src={avatarUri}
                      className="relative w-full h-full rounded-full border-2 border-orange-500/30"
                    />
                  </div>
                </div>

                <Collapsible open={openSection === 'skin'}>
                  <CollapsibleTrigger
                    onClick={() => toggleSection('skin')}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-orange-500/10"
                  >
                    <Label className="text-gray-200 cursor-pointer">Skin Color</Label>
                    {openSection === 'skin' ? 
                      <ChevronUp className="text-orange-500" /> : 
                      <ChevronDown className="text-orange-500" />
                    }
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {avatarOptions.skinColor.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            setAvatarItems({ ...avatarItems, skinColor: [color] })
                          }
                          className={`p-1 rounded-lg flex items-center justify-center ${
                            avatarItems.skinColor[0] === color
                              ? 'ring-2 ring-orange-500'
                              : 'ring-1 ring-orange-500/30'
                          } hover:ring-orange-500/60`}
                        >
                          <img src={previewUris.skin[color]} className="w-12 h-12 sm:w-16 sm:h-16" />
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
                    {openSection === 'hair' ? 
                      <ChevronUp className="text-orange-500" /> : 
                      <ChevronDown className="text-orange-500" />
                    }
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {avatarOptions.hair.map((style) => (
                        <button
                          key={style}
                          onClick={() =>
                            setAvatarItems({ ...avatarItems, hair: [style] })
                          }
                          className={`p-1 rounded-lg flex items-center justify-center ${
                            avatarItems.hair[0] === style
                              ? 'ring-2 ring-orange-500'
                              : 'ring-1 ring-orange-500/30'
                          } hover:ring-orange-500/60`}
                        >
                          <img src={previewUris.hair[style]} className="w-12 h-12 sm:w-16 sm:h-16" />
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
                    {openSection === 'hairColor' ? 
                      <ChevronUp className="text-orange-500" /> : 
                      <ChevronDown className="text-orange-500" />
                    }
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {avatarOptions.hairColor.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            setAvatarItems({ ...avatarItems, hairColor: [color] })
                          }
                          className={`p-1 rounded-lg flex items-center justify-center ${
                            avatarItems.hairColor[0] === color
                              ? 'ring-2 ring-orange-500'
                              : 'ring-1 ring-orange-500/30'
                          } hover:ring-orange-500/60`}
                        >
                          <img src={previewUris.hairColor[color]} className="w-12 h-12 sm:w-16 sm:h-16" />
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
                    {openSection === 'eyebrows' ? 
                      <ChevronUp className="text-orange-500" /> : 
                      <ChevronDown className="text-orange-500" />
                    }
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {avatarOptions.eyebrows.map((style) => (
                        <button
                          key={style}
                          onClick={() =>
                            setAvatarItems({ ...avatarItems, eyebrows: [style] })
                          }
                          className={`p-1 rounded-lg flex items-center justify-center ${
                            avatarItems.eyebrows[0] === style
                              ? 'ring-2 ring-orange-500'
                              : 'ring-1 ring-orange-500/30'
                          } hover:ring-orange-500/60`}
                        >
                          <img src={previewUris.eyebrows[style]} className="w-12 h-12 sm:w-16 sm:h-16" />
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
                    {openSection === 'eyes' ? 
                      <ChevronUp className="text-orange-500" /> : 
                      <ChevronDown className="text-orange-500" />
                    }
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {avatarOptions.eyes.map((style) => (
                        <button
                          key={style}
                          onClick={() =>
                            setAvatarItems({ ...avatarItems, eyes: [style] })
                          }
                          className={`p-1 rounded-lg flex items-center justify-center ${
                            avatarItems.eyes[0] === style
                              ? 'ring-2 ring-orange-500'
                              : 'ring-1 ring-orange-500/30'
                          } hover:ring-orange-500/60`}
                        >
                          <img src={previewUris.eyes[style]} className="w-12 h-12 sm:w-16 sm:h-16" />
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
                    {openSection === 'mouth' ? 
                      <ChevronUp className="text-orange-500" /> : 
                      <ChevronDown className="text-orange-500" />
                    }
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {avatarOptions.mouth.map((style) => (
                        <button
                          key={style}
                          onClick={() =>
                            setAvatarItems({ ...avatarItems, mouth: [style] })
                          }
                          className={`p-1 rounded-lg flex items-center justify-center ${
                            avatarItems.mouth[0] === style
                              ? 'ring-2 ring-orange-500'
                              : 'ring-1 ring-orange-500/30'
                          } hover:ring-orange-500/60`}
                        >
                          <img src={previewUris.mouth[style]} className="w-12 h-12 sm:w-16 sm:h-16" />
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ) : (
              <div className="flex justify-center mb-12">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.orange.500/0.2)_0%,theme(colors.pink.500/0.1)_50%,transparent_100%)]" />
                  <img
                    src={user.avatar_uri}
                    className="relative w-full h-full rounded-full border-2 border-orange-500/30"
                  />
                </div>
              </div>
            )}

            {!isEditing && (
              <>
                <div className="text-xl my-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Your Flares
                </div>
                <div className="smy-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 text-left">
                  {userFlares.map((flare, index) => {
                    return (
                      <FlareCard key={flare.id} flare={flare} index={index} />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;