
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function ContractorOTPVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [phone, setPhone] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Reference for input fields to allow auto-focus
  const inputRefs = [
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef()
  ];

  useEffect(() => {
    // In a real app, fetch user phone number from backend
    const fetchUserData = async () => {
      try {
        const userData = await User.me();
        // Format phone for display
        const phoneNumber = userData.phone || '';
        const formattedPhone = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        setPhone(formattedPhone);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (value, index) => {
    // Validate input is a digit
    if (!/^\d*$/.test(value)) return;

    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    if (!/^\d+$/.test(pastedData)) return;
    
    const digits = pastedData.slice(0, 4).split('');
    const newOtp = [...otp];
    
    digits.forEach((digit, index) => {
      if (index < 4) {
        newOtp[index] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus on appropriate input after paste
    if (digits.length < 4 && digits.length > 0) {
      inputRefs[digits.length].current.focus();
    }
  };

  const resendOtp = () => {
    setCountdown(60);
    setError('');
    // In a real app, you would call an API to resend OTP
    console.log('Resending OTP');
  };

  const verifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate OTP verification with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success modal instead of immediately navigating
      setShowSuccessModal(true);
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDone = () => {
    setShowSuccessModal(false);
    // Direct to profile builder instead of language selection
    navigate(createPageUrl('ContractorProfileBuilder'));
  };

  return (
    <div className="max-w-md mx-auto pt-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify Your Number</CardTitle>
          <CardDescription>
            We've sent a 4-digit code to {phone || 'your phone'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <Input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-14 h-14 text-center text-xl"
              />
            ))}
          </div>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend code in <span className="font-semibold">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={resendOtp}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Resend Code
              </button>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={verifyOtp}
            disabled={loading || otp.some(digit => digit === '')}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-xs mx-auto p-0 border-0">
          <div className="flex flex-col items-center text-center p-6">
            {/* Orange circle with check icon */}
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              
              {/* Decorative dots */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
              <div className="absolute -bottom-2 -left-1 w-2 h-2 bg-orange-500 rounded-full" />
              <div className="absolute top-2 -right-3 w-2 h-2 bg-orange-500 rounded-full" />
            </div>

            <h2 className="text-xl font-semibold mb-2">Verification Complete!</h2>
            <p className="text-gray-600 text-sm mb-6">
              Thanks for your patience. Enjoy the Estimax experience.
            </p>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleSuccessDone}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
