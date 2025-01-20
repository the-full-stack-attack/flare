import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  // when the user clicks submit, we handle the signup
  const handleSignup = (e: string) => {
    e.preventDefault();
    console.log(`username ${userName}, \n phone ${phone}, \n selected Interests ${selectedInterests}`)
  }
  
  // return the signup template
  return (
    <div>
      <h4>Hello Stanky</h4>
    <form onSubmit={handleSignup}>
  <label>
    Username:
    <input 
    type="text" 
    placeholder="Create your Username" 
    onChange={(e) => setUserName(e.target.value)} 
    name="userName" 
    />
  </label>
  <label>
    Phone-Number:
    <input 
    type="text" 
    name="phoneNumber" 
    placeholder="Enter Your Phone Number" 
    onChange={(e) => setUserName(e.target.value)} 
    />
  </label>
  <button type="submit" value="Submit" > Complete </button>
    </form>
    </div>
)
};

export default Signup;
