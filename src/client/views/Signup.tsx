import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./../../components/ui/card";
import MagicCard from "./../../components/ui/magicCard";

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
      `username ${userName}, \n ${full_Name}, \n phone ${phone}, \n selected Interests ${selectedInterests}`
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
  });

  // return the signup template
  return (
    <Card>
      <CardHeader>
      <CardTitle>Hello Stanky</CardTitle>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSignup}>
        <label>
          Username:
          <div />
          <input
            type="text"
            placeholder="Create your Username"
            onChange={(e) => setUserName(e.target.value)}
            name="userName"
          />
        </label>
        <div />
        <label>
          Phone-Number:
          <div />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Enter Your Phone Number"
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <div />
        <label>
          Name:
          <div />
          <input
            type="text"
            name="Enter Your Full Name"
            placeholder="Enter Your Full Name!"
            onChange={(e) => setFull_Name(e.target.value)}
          />
        </label>
        <div />
        {interests.map((interest) => (
          <button style={{ display: 'block' }} onClick={hideMe} type="button">
            {interest}
          </button>
        ))}
        <button type="submit" value="Submit">
          {' '}
          Complete{' '}
        </button>
      </form>
      </CardContent>
      <MagicCard><div>Hello</div></MagicCard>
    </Card>
  );
}

export default Signup;
