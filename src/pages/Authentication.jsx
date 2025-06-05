import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";

export default function Authentication() {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.userType || 'contractor';

  const handleLogin = () => {
    // Redirect to login page
    navigate(createPageUrl('Login'), { state: { userType } });
  };

  const handleEmailSignup = () => {
    // Redirect to appropriate signup page based on user type
    if (userType === 'contractor') {
      navigate(createPageUrl('ContractorSignup'));
    } else {
      navigate(createPageUrl('ProjectOwnerSignup'));
    }
  };

  const handleSocialSignup = (provider) => {
    // In a real app, this would integrate with social sign-in APIs
    // For now, we'll just simulate by redirecting to the signup page
    console.log(`Signing up with ${provider}`);
    
    // Redirect to appropriate signup page based on user type after social auth
    if (userType === 'contractor') {
      navigate(createPageUrl('ContractorSignup'));
    } else {
      navigate(createPageUrl('ProjectOwnerSignup'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-end p-4 pb-8">
      <div className="space-y-4 w-full">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-14 text-base font-medium"
            onClick={handleLogin}
          >
            Log in
          </Button>
          <Button
            className="h-14 text-base font-medium bg-orange-500 hover:bg-orange-600"
            onClick={handleEmailSignup}
          >
            Sign up with email
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full h-14 text-base font-medium flex items-center justify-center"
          onClick={() => handleSocialSignup('google')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full h-14 text-base font-medium flex items-center justify-center"
          onClick={() => handleSocialSignup('facebook')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2 text-blue-600" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continue with Facebook
        </Button>

        <Button
          variant="outline"
          className="w-full h-14 text-base font-medium flex items-center justify-center"
          onClick={() => handleSocialSignup('apple')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2" fill="currentColor">
            <path d="M16.498 0c.326 0 .662.018.998.057.968.114 1.707.393 2.275.811.579.425 1.013.912 1.321 1.487.308.567.49 1.199.576 1.882.06.46.078.937.048 1.429-.074 1.137-.377 2.135-.883 2.98-.478.792-1.036 1.401-1.654 1.798-.7.451-1.407.663-2.101.663-.461 0-.945-.112-1.456-.32-.51-.209-.954-.313-1.309-.313-.343 0-.792.104-1.321.32-.53.208-.954.312-1.255.312-.947 0-1.867-.46-2.752-1.398-.898-.954-1.497-2.156-1.78-3.621-.297-1.509-.193-2.922.315-4.248.512-1.317 1.245-2.33 2.22-3.045.97-.704 1.999-1.067 3.093-1.067.485 0 .999.09 1.538.267.525.175.936.267 1.232.267.284 0 .663-.085 1.152-.244.512-.168 1.036-.258 1.565-.258h.173zm-3.028 3.923c-.783.771-1.147 1.67-1.085 2.736.031.542.171 1.05.417 1.525.246.471.545.843.883 1.099.35.255.705.382 1.061.382.143 0 .228-.013.244-.026-.05-.15-.098-.323-.141-.518-.126-.565-.144-1.129-.05-1.683.102-.6.306-1.15.614-1.65.405-.65.998-1.184 1.763-1.574-.252-.384-.618-.705-1.084-.951-.459-.243-.991-.368-1.585-.368-.762 0-1.435.343-2.037 1.028z"/>
          </svg>
          Continue with Apple
        </Button>
      </div>
    </div>
  );
}