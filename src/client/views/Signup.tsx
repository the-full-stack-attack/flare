import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import Avatar from '../components/signup/avatar';

import { BackgroundGlow } from '@/components/ui/background-glow';

function Signup() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [full_Name, setFull_Name] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [avatarUri, setAvatarUri] = useState('');

  const [avatarItems, setAvatarItems] = useState({
    seed: 'Felix',
    skinColor: ['f2d3b1'],
    hair: ['short04'],
    hairColor: ['0e0e0e'],
    eyebrows: ['variant07'],
    eyes: ['variant04'],
    mouth: ['variant05'],
  });



  // when the user clicks submit, we handle the signup
  const handleSignup = (e: any) => {
    e.preventDefault();
    console.log(
      `username ${userName}, \n full name ${full_Name}, \n phone ${phone}, \n selected Interests ${selectedInterests}`
    );
    axios
      .post('api/signup/', { userName, phone, selectedInterests, full_Name, avatarItems,  })
      .then(() => {
        navigate('/Dashboard');
      })
      .catch((err) => {
        console.error('error', err);
      });
  };

  const handleInterestClick = (e) => {
    const value = e.target.innerText;
    e.target.name !== 'selectedInterest'
        ? addToSelectedInterests(value)
        : removeSelectedInterests(value);
  };


  const addToSelectedInterests = (value: string) => {
    setSelectedInterests([...selectedInterests, value]);
  };

  const removeSelectedInterests = async (value: string) => {
    let backToInterests;
    const updatedInterests = selectedInterests.filter((item, i) => {
      if (item === value) {
        backToInterests = value;
      }
      return item !== value;
    });
    setInterests([...interests, backToInterests]);
    await setSelectedInterests(updatedInterests);
  };

  // Hides components (Does not work with animated buttons sadly)
  const hideMe = (e: any) => {
    e.target.style.display = 'none';
    const value = e.target.innerText;
    e.target.name !== 'selectedInterest'
      ? addToSelectedInterests(value)
      : removeSelectedInterests(value);
  };

  // Gets all interests
  useEffect(() => {
    axios
      .get('api/signup/interests')
      .then((interestNames: any) => {
        setInterests([...interests, ...interestNames.data]);
      })
      .catch((err: Error) => {
        console.error('error', err);
      });
  }, []);

  
  const chosenAlias = (x) => {
    console.log(x)
  }

  // return the signup template
  return (
      <div
          className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20">
        <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none"/>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="backdrop-blur-lg bg-white/5 border border-orange-500/20">
              <CardHeader>
                <CardTitle
                    className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Welcome To Flare
                </CardTitle>

                <CardDescription className="text-gray-400">
                  Setup your account with Flare in one-click.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Avatar
                avatarItems={avatarItems}
                setAvatarItems={setAvatarItems}
                setAvatarUri={setAvatarUri}
                avatarUri={avatarUri}
                  />
              </CardContent>

              <CardContent>
                <form onSubmit={handleSignup}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-gray-200">Username</Label>
                      <Input
                          id="username"
                          type="text"
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Create your username"
                          className="bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-200">Phone Number</Label>
                      <Input
                          id="phone"
                          type="text"
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9 digits no dashes"
                          className="bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fullname" className="text-gray-200">Full Name</Label>
                      <Input
                          id="fullname"
                          type="text"
                          onChange={(e) => setFull_Name(e.target.value)}
                          placeholder="Enter your full name"
                          className="bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-200 mb-2 block">Select Your Interests</Label>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest, index) => (
                            <Button
                                key={`interest-${index}`}
                                onClick={handleInterestClick}
                                type="button"
                                className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border border-orange-500/30 hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30"
                            >
                              {interest}
                            </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-200 mb-2 block">Selected Interests</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedInterests.map((interest, index) => (
                            <Button
                                key={`selected-${index}`}
                                name="selectedInterest"
                                onClick={handleInterestClick}
                                type="button"
                                className="bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border border-orange-500/50 hover:from-yellow-500/50 hover:via-orange-500/50 hover:to-pink-500/50"
                            >
                              {interest}
                            </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white font-semibold"
                    >
                      Complete Signup
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>


      </div>
  );
}

export default Signup;
