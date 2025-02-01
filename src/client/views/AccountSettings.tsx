import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from "@/client/contexts/UserContext";
import axios from 'axios';
import {Toggle} from "@/components/ui/toggle";


function AccountSettings() {
    const {user} = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [avatarId, setAvatarId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [interests, setInterests] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);

    const handleSubmit = async () => {
        const updates = {};
        console.log(user);

        if (username.length > 0) updates.username = username;
        // if (avatar.length > 0) updates.avatar_id = avatarId;
        if (fullName.length > 0) updates.full_name = fullName;
        if (interests.length > 0) updates.interests = selectedInterests;
        if (phoneNumber.length > 0) updates.phone_number = phoneNumber;

        try {
            await axios.put(`/api/settings/user/${user.id}`, updates);
            console.log('great sucesss', updates);
        } catch (error) {
            console.error('Error updating user settings', error);
        }
    }


    // handling toggle selection for interests
    const toggleInterest = (interest: string) => {
        // filter through interests to see which one is checked
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };


    // get interests from db
    const getInterests = async () => {
        try {
            const allInterests = await axios.get('/api/signup/interests');
            setInterests(allInterests.data);
        } catch (error) {
            console.error('Error getting interests from DB', error);
        }
    };

    useEffect(() => {
        getInterests();
    }, [])




    return (
        <div className='min-h-screen flex items-center justify-center py-6 px-4 bg-color-4'>
            <div className='bg-color-1 w-3/4 h-3/4 align-top text-center'>
                <div className='p-8'>

                    <div className='text-4xl'>Account Settings</div>
                    <div className='grid-cols-5 py-8'>
                        <div className='my-6 text-2xl'>Change Username

                            <div className='text-lg'>
                                Current Username: {user.username}
                            </div>

                            <input
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                        </div>
                        <div className='my-6'>Change Avatar
                        </div>

                        <div className='my-6'>Change Phone Number
                            <input
                                type='text'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            /></div>
                        <div className='my-6'>Change Name
                            <input
                                type='text'
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />

                        </div>
                        <div className='my-6'>Change Interests

                            <div className="my-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                {interests.map((interest, index) => (
                                    <Toggle
                                        key={index}
                                        pressed={selectedInterests.includes(interest)}
                                        onPressedChange={() => toggleInterest(interest)}
                                        variant="outline"
                                        size="lg"
                                        className='h-12 w-26'
                                    >
                                        {interest}
                                    </Toggle>
                                ))}
                            </div>


                        </div>
                    </div>
                    <div className='bg-color-3 w-32 py-4 px-2 mx-auto flex items-center justify-center'>
                        <button
                            onClick={handleSubmit}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AccountSettings;