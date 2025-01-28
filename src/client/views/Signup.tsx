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
import { RainbowButton } from '../../components/ui/rainbowbutton';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';


function Signup() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [full_Name, setFull_Name] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // when the user clicks submit, we handle the signup
  const handleSignup = (e: any) => {
    e.preventDefault();
    console.log(
      `username ${userName}, \n full name ${full_Name}, \n phone ${phone}, \n selected Interests ${selectedInterests}`
    );
    axios
      .post('api/signup/', { userName, phone, selectedInterests, full_Name })
      .then(() => {
        navigate('/Dashboard');
      })
      .catch((err) => {
        console.error('error', err);
      });
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
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: 'fit-content',
      }}
    >
      <div style={{ display: 'inline-flex' }}>
        <div
          style={{
            maxWidth: 'fit-content',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
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
                        style={{
                          display: 'inline-block',
                          float: 'left',
                          maxWidth: 'fit-content',
                        }}
                        onClick={hideMe}
                        type="button"
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                  <CardHeader>
                    <CardTitle>Your Selected Interests</CardTitle>
                    <CardFooter>
                      <div>
                        {selectedInterests.map((interest, i) => (
                          <Button
                            style={{
                              display: 'inline-block',
                              float: 'left',
                              maxWidth: 'fit-content',
                            }}
                            key={Math.random()}
                            name="selectedInterest"
                            onClick={hideMe}
                            type="button"
                          >
                            {interest}
                          </Button>
                        ))}
                      </div>
                    </CardFooter>
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
