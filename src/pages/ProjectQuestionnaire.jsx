import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Project } from '@/api/entities';
import { createPageUrl } from '@/utils';
import KitchenMeasurements from '@/components/project-types/residential/KitchenMeasurements';
import BathroomRemodel from '@/components/project-types/residential/BathroomRemodel';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function ProjectQuestionnaire() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const projectType = searchParams.get('type') || '';
  const projectSubtype = searchParams.get('subtype') || '';
  const addressParam = searchParams.get('address');
  const [projectAddress, setProjectAddress] = useState({});

  useEffect(() => {
    if (addressParam) {
      try {
        const parsedAddress = JSON.parse(decodeURIComponent(addressParam));
        setProjectAddress(parsedAddress);
      } catch (error) {
        console.error('Error parsing address:', error);
      }
    }
  }, [addressParam]);

  // Get the appropriate question component based on project type
  const getQuestionComponent = () => {
    switch (projectSubtype) {
      case 'kitchen_remodel':
        return KitchenMeasurements;
      case 'bathroom_remodel':
        return BathroomRemodel;
      // Add more cases for other project types
      default:
        return null;
    }
  };

  const QuestionComponent = getQuestionComponent();

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    setCurrentQuestion(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentQuestion(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const projectData = {
        type: projectType,
        subtype: projectSubtype,
        address: projectAddress,
        questionnaire_answers: answers
      };
      
      const project = await Project.create(projectData);
      navigate(createPageUrl('Estimate', `projectId=${project.id}`));
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  if (!QuestionComponent) {
    return <div>Invalid project type</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">

      <QuestionComponent
        currentQuestion={currentQuestion}
        answers={answers}
        onAnswer={handleAnswer}
        zipCode={projectAddress?.zip_code}

      />

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentQuestion < 4 ? ( // Adjust based on total questions
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            Get Estimate
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}