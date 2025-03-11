import React, { useState } from 'react';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function UserInfoStep({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState([]);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (value.length > 15) {
      if (!errors.includes('Username cannot exceed 15 characters')) {
        setErrors([...errors, 'Username cannot exceed 15 characters']);
      }
    } else {
      setErrors(errors.filter((error) => !error.includes('Username')));
    }
    setFormData((prev) => ({ ...prev, userName: value }));
  };

  const handleFullNameChange = (e) => {
    const value = e.target.value;
    if (value.length > 20) {
      if (!errors.includes('Full name cannot exceed 20 characters')) {
        setErrors([...errors, 'Full name cannot exceed 20 characters']);
      }
    } else {
      setErrors(errors.filter((error) => !error.includes('Full name')));
    }
    setFormData((prev) => ({ ...prev, full_Name: value }));
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
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errors.length === 0) {
      onSubmit(formData);
    }
  };

  // checks for errors on this current step
  const handleContinue = () => {
    if (!formData.userName) {
      const newErrors = [];
      if (!formData.userName) {
        newErrors.push('Username is required');
      }
      setErrors(newErrors);
      return;
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
          Welcome To Flare
        </CardTitle>
        <CardDescription className="text-gray-400">
          Let's start with your basic information.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
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
                value={formData.userName}
                onChange={handleUsernameChange}
                placeholder="Create your username"
                className="bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-200">
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
                className="bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
              />
              <p className="text-sm text-gray-400 mt-1.5 flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>
                  We use SMS for event notifications and updates. You can manage this in settings anytime. Message rates may apply.
                </span>
              </p>
            </div>

            <div>
              <Label htmlFor="fullname" className="text-gray-200">
                Full Name
              </Label>
              <Input
                id="fullname"
                type="text"
                value={formData.full_Name}
                onChange={handleFullNameChange}
                placeholder="Enter your full name"
                className="bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
              />
            </div>

            <Button
              type="submit"
              disabled={errors.length > 0}
              onClick={handleContinue}
              className={`w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white font-semibold ${
                errors.length > 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600'
              }`}
            >
              Continue to Select Interests
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}

export default UserInfoStep;
