
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function ContractorExplainerVideo() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10); // 10-second countdown
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
        setProgress(prev => prev + 10);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">How Contractors Use Estimax</h1>
      <p className="text-gray-600 mb-6">
        Watch this short video to understand how to find projects, verify estimates, and connect with clients.
      </p>

      <div className="aspect-w-16 aspect-h-9 mb-6">
        <iframe
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/jNQXAC9IVRw?autoplay=1"
          title="Contractor Guide Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="rounded-lg w-full"
        ></iframe>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-green-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-center">
        <Button
          onClick={() => navigate(createPageUrl('ContractorDashboard'))}
          disabled={countdown > 0}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
        >
          {countdown > 0 ? `Continue in ${countdown}s` : 'Go to Dashboard'}
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl('ContractorDashboard'))}
          className="w-full md:w-auto"
        >
          Skip
        </Button>
      </div>
    </div>
  );
}
