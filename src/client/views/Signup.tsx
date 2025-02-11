import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { BackgroundGlow } from '@/components/ui/background-glow';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserInfoStep from '@/client/components/signup/UserInfoStep';
import InterestsStep from '@/client/components/signup/InterestsStep';
import AvatarStep from '@/client/components/signup/AvatarStep';

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: '',
    full_Name: '',
    phone: '',
    interests: [],
    selectedInterests: [],
    avatarItems: {
      seed: 'Felix',
      skinColor: ['f2d3b1'],
      hair: ['short04'],
      hairColor: ['0e0e0e'],
      eyebrows: ['variant07'],
      eyes: ['variant04'],
      mouth: ['variant05'],
    },
    avatarUri: '',
  });

  const handleUserInfo = (userInfo) => {
    setFormData((prev) => ({
      ...prev,
      ...userInfo,
    }));
    setStep(2);
  };

  const handleInterests = (selectedInterests) => {
    setFormData((prev) => ({
      ...prev,
      selectedInterests,
    }));
    setStep(3);
  };

  const handleComplete = (avatarData) => {
    axios
      .post('api/signup/', {
        userName: formData.userName,
        phone: formData.phone,
        selectedInterests: formData.selectedInterests,
        full_Name: formData.full_Name,
        avatarItems: avatarData.avatarItems,
        avatarUri: avatarData.avatarUri,
      })
      .then(() => {
        navigate('/Dashboard');
      })
      .catch((err) => {
        console.error('error', err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20">
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="backdrop-blur-lg bg-white/5 border border-orange-500/20">
            {step === 1 && (
              <UserInfoStep
                initialData={{
                  userName: formData.userName,
                  full_Name: formData.full_Name,
                  phone: formData.phone,
                }}
                onSubmit={handleUserInfo}
              />
            )}
            {step === 2 && (
              <InterestsStep
                initialData={formData.selectedInterests}
                onSubmit={handleInterests}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <AvatarStep
                initialData={{
                  avatarItems: formData.avatarItems,
                  avatarUri: formData.avatarUri,
                }}
                onSubmit={handleComplete}
                onBack={() => setStep(2)}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Signup;
