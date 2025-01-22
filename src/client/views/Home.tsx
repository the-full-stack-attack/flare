import React from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';

function Home() {
  const googleLogin = () => {
    axios.get('/auth');
  };

  return (
    <div>
      <h4>Hello Stanky</h4>
      <Button>
        <a href="/auth">Login With Google</a>
      </Button>
    </div>
  );
}

export default Home;
