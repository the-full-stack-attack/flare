import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState(['bowling', 'clubs', 'concerts', 'festivals']);
  const [selectedInterests, setSelectedInterests] = useState([]);

  // when the user clicks submit, we handle the signup
  const handleSignup = (e: any) => {
    e.preventDefault();
    console.log(`username ${userName}, \n phone ${phone}, \n selected Interests ${selectedInterests}`)
  }
  
  const hideMe = (e: any) => {
    console.log(e)
    e.target.style.display = 'none'
  }
  // return the signup template
  return (
    <div>
      <h4>Hello Stanky</h4>
    <form onSubmit={handleSignup}>
  <label>
    Username:
    <div/>
    <input 
    type="text" 
    placeholder="Create your Username" 
    onChange={(e) => setUserName(e.target.value)} 
    name="userName" 
    />
  </label>
  <div/>
  <label>
    Phone-Number:
    <div/>
    <input 
    type="text" 
    name="phoneNumber" 
    placeholder="Enter Your Phone Number" 
    onChange={(e) => setUserName(e.target.value)} 
    />
  </label>
  <div/>
  { interests.map((interest) => (
    <button style={{ display: 'block' }} onClick={hideMe} type="button">{interest}</button>
  ))}
  <button type="submit" value="Submit" > Complete </button>
    </form>
    </div>
)
};

export default Signup;
