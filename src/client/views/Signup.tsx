import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { ShinyButton } from "../../components/ui/shiny-button";
import { RainbowButton } from '../../components/ui/rainbowbutton';
import MagicCard from '../../components/ui/magicCard';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { SparklesText } from '../../components/ui/sparkletext';
import { InteractiveHoverButton } from '../../components/ui/interactive-hover-button';

function Signup() {
  const [userName, setUserName] = useState('');
  const [full_Name, setFull_Name] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState<string[]>([
    'Arts & Crafts',
    'Music',
    'Gaming',
    'Movies & TV',
    'Comics & Anime',
    'Books & Reading',
    'Technology',
    'Nature',
    'Food & Cooking',
    'Nightlife',
    'Coffee & Tea',
    'Health & Wellness',
    'Pets & Animals',
    'Sports & Recreation',
    'Community Events',
  ]);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // when the user clicks submit, we handle the signup
  const handleSignup = (e: any) => {
    e.preventDefault();
    console.log(
      `username ${userName}, \n full name ${full_Name}, \n phone ${phone}, \n selected Interests ${selectedInterests}`
    );
    axios
      .post('signup/', { userName, phone, selectedInterests, full_Name })
      .then(() => {
        console.log('successful post');
      })
      .catch((err) => {
        console.error('error', err);
      });
  };

  const hideMe = (e: any) => {
    console.log(e);
    e.target.style.display = 'none';
    const value = e.target.innerText;
    e.remove();
    setSelectedInterests([...selectedInterests, value]);
  };

  useEffect(() => {
    console.log('use effect triggered');
    /* 
   * Gets all interests from `Interests` table: but 'Interests' table is empty 
    axios.get('signup/interests')
    .then((interestNames: any) => {
      console.log(interestNames, 'this is it')
      setInterests( [...interests, ...interestNames] );
      console.log('grabbed interests')
    })
    .catch((err: Error) => {
      console.error('error', err)
    })
    */
  }, [selectedInterests]);

  // return the signup template
  return (
    <div
    style={{
      'margin-left': 'auto',
      'margin-right': 'auto',
      'maxWidth': 'fit-content',
    }}
    >
   
      <div style={{ display: 'inline-flex' }}>
        <div style={{ 'maxWidth': 'fit-content', 'marginLeft': 'auto', 'marginRight': 'auto' }}>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Welcome To Flare</CardTitle>
              <CardDescription>
                Setup your account with Flare in one-click.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Username</Label>
                    <Input
                      id="name"
                      type="text"
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Create your username"
                    />
                  </div>
                  <div />
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Phone-Number</Label>
                    <Input
                      id="name"
                      placeholder="9 digits no dashes"
                      type="text"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div />
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      onChange={(e) => setFull_Name(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div />
                  <div>
                  {interests.map((interest) => (
                    <Button
                      style={{ display: 'inline-block', float: 'left', maxWidth: 'fit-content' }}
                      onClick={hideMe}
                      type="button"
                    >
                      {interest}
                    </Button>
                  ))}
                  </div>
                  <CardHeader>
                    <CardTitle>Your Selected Interests</CardTitle>
                    <CardDescription>
                  <div>
                  {selectedInterests.map((interest) => (
                    <Button
                      style={{ display: 'inline-block', float: 'left', 'maxWidth': 'fit-content' }}
                      onClick={hideMe}
                      type="button"
                    >
                      {interest}
                    </Button>
                  ))}
                  </div>
                  </CardDescription>
                  </CardHeader>
                  <RainbowButton type="submit" value="Submit">
                    {' '}
                    Complete{' '}
                  </RainbowButton>
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
/*

//////////////////////////////////////////




*/
