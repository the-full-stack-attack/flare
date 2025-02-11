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
import { Alert, AlertDescription } from '@/components/ui/alert';

import { AlertCircle } from 'lucide-react';
import cn from '@/lib/utils';

import { BackgroundGlow } from '@/components/ui/background-glow';

function Signup() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [full_Name, setFull_Name] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState([]);
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

  // restrict usernames to be less than 15 chars
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (value.length > 15) {
      // if error isnt already set add it
      if (!errors.includes('Username cannot exceed 15 characters')) {
        setErrors([...errors, 'Username cannot exceed 15 characters']);
      }
    } else {
      // remove error if it is set
      setErrors(
        errors.filter(
          (error) => !error.includes('Username cannot exceed 15 characters')
        )
      );
    }
    setUserName(value);
  };

  // same logic for full name
  const handleFullNameChange = (e) => {
    const value = e.target.value;
    if (value.length > 20) {
      if (!errors.includes('Full name cannot exceed 20 characters')) {
        setErrors([...errors, 'Full name cannot exceed 20 characters']);
      }
    } else {
      setErrors(errors.filter((error) => !error.includes('Full name')));
    }
    setFull_Name(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 0 && value.length !== 10) {
      if (!errors.includes('Phone number must be exactly 10 digits')) {
        setErrors([...errors, 'Phone number must be exactly 10 digits']);
      }
    } else {
      setErrors(errors.filter((error) => !error.includes('Phone')));
    }
    setPhone(value);
  };

  // when the user clicks submit, we handle the signup
  const handleSignup = (e: any) => {
    e.preventDefault();
    console.log(
      `username ${userName}, \n full name ${full_Name}, \n phone ${phone}, \n selected Interests ${selectedInterests}`
    );
    axios
      .post('api/signup/', {
        userName,
        phone,
        selectedInterests,
        full_Name,
        avatarItems,
        avatarUri,
      })
      .then(() => {
        navigate('/Dashboard');
      })
      .catch((err) => {
        console.error('error', err);
      });
  };

  const addToSelectedInterests = (value: string) => {
    setSelectedInterests([...selectedInterests, value]);
    setInterests(interests.filter((interest) => interest !== value));
  };

  const removeSelectedInterests = (value: string) => {
    setSelectedInterests(
      selectedInterests.filter((interest) => interest !== value)
    );
    setInterests([...interests, value]);
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
    console.log('Alert:', Alert, 'AlertDescription:', AlertDescription);

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
    console.log(x);
  };

  // return the signup template
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20">
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="backdrop-blur-lg bg-white/5 border border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
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
                  {errors.length > 0 && (
                    <Alert
                      variant="destructive"
                      className="border-red-500/50 bg-red-500/10"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <ul className="list-disc pl-4 space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                  <div>
                    <Label htmlFor="username" className="text-gray-200">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      onChange={handleUsernameChange}
                      placeholder="Create your username"
                      className="bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-200">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="text"
                      onChange={handlePhoneChange}
                      placeholder="Please enter your phone number"
                      className="bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fullname" className="text-gray-200">
                      Full Name
                    </Label>
                    <Input
                      id="fullname"
                      type="text"
                      onChange={handleFullNameChange}
                      placeholder="Enter your full name"
                      className="bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-200 mb-2 block">
                      Select Your Interests
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest, index) => (
                        <Button
                          key={`interest-${index}`}
                          onClick={() => addToSelectedInterests(interest)}
                          type="button"
                          className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border border-orange-500/30 hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30"
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-200 mb-2 block">
                      Selected Interests
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedInterests.map((interest, index) => (
                        <Button
                          key={`selected-${index}`}
                          name="selectedInterest"
                          onClick={() => removeSelectedInterests(interest)}
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
                    disabled={errors.length > 0}
                    className={`w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white font-semibold ${
                      errors.length > 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600'
                    }`}
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
