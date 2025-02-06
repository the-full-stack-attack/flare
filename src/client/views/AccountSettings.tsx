import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/client/contexts/UserContext';
import axios from 'axios';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { FaPencilAlt, FaSave, FaTimes } from 'react-icons/fa';
import FlareCard from '../components/flares/FlareCard';

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

  const phoneDisplay = formatNumber(user.phone_number);

  function formatNumber(number: string): string {
    const newNumber: string[] = number.split('');
    newNumber.splice(0, 0, '(');
    newNumber.splice(4, 0, ')');
    newNumber.splice(8, 0, '-');
    return newNumber.join('');
  }
  // submit handler
  const handleSubmit = async () => {
    // obj to store data that will be updated on user
    const updates = {};
    // if user adds input, update obj with data
    if (username.length > 0) updates.username = username;
    // if (avatar.length > 0) updates.avatar_id = avatarId;
    if (fullName.length > 0) updates.full_name = fullName;
    if (interests.length > 0) updates.interests = selectedInterests;
    if (phoneNumber.length > 0) updates.phone_number = phoneNumber;

    try {
      // update user record
      await axios.put(`/api/settings/user/${user.id}`, updates);
      await getUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user settings', error);
    }
  };

  // handling toggle selection for interests
  const toggleInterest = (interest: string) => {
    // filter through interests to see which one is checked
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  // get interests from db
  const getInterests = async () => {
    try {
      // gets all interests from DB and user's interests from User_Interests
      const [allInterests, userInterests] = await Promise.all([
        axios.get('/api/signup/interests'),
        axios.get(`/api/settings/user/${user.id}/interests`),
      ]);
      // set states to update view
      setIsEditing(false);
      setInterests(allInterests.data);
      setSelectedInterests(userInterests.data.map((interest) => interest.name));
    } catch (error) {
      console.error('Error getting interests from DB', error);
    }
  };

  // clear inputs if user clicks cancel btn
  const handleCancel = () => {
    setUsername('');
    setPhoneNumber('');
    setFullName('');
    setIsEditing(false);
  };

  // Get the user's flares
  const getFlares = () => {
    const { id } = user;
    axios.get(`/api/flare/${id}`)
    .then(({ data }) => {
        setUserFlares(data);
    })
    .catch((err) => {
        console.error('Error GETing user flares on AccountSettings: ', err);
    })
  }

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
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 w-3/6 p-4 rounded-xl bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white font-bold"
                >
                  <FaPencilAlt className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
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
              Your Phone Number
            </div>
            <div className="mb-6 mt-2 text-md text-color-2 flex justify-center items-center gap-4">
              {isEditing ? (
                <Input
                  className="text-white max-w-md flex justify-center placeholder:text-white/50 bg-white/10 backdrop-blur-lg"
                  type="text"
                  placeholder={user.phone_number}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              ) : (
                <div className="text-white">{phoneDisplay}</div>
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
              Your Interests
            </div>
            <div className="my-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {interests.map((interest, index) => (
                <Toggle
                  key={index}
                  pressed={selectedInterests.includes(interest)}
                  onPressedChange={() => isEditing && toggleInterest(interest)}
                  variant="outline"
                  size="lg"
                  disabled={!isEditing}
                  className="h-12 w-26 text-color-4"
                >
                  {interest}
                </Toggle>
              ))}
            </div>
            <div className="text-xl my-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Your Flares
            </div>
            <div className="my-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4  text-left">
                {userFlares.map((flare, index) => {
                    return <FlareCard key={flare.id} flare={flare} index={index}/>
                })}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-xl"
              >
                <FaSave className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-xl"
              >
                <FaTimes className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
