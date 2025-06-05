import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Project } from '@/api/entities';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Save, Home, Loader2 } from "lucide-react";

// Import project type-specific question components
import KitchenQuestions from '@/components/project-types/residential/KitchenQuestions';
import BathroomQuestions from '@/components/project-types/residential/BathroomQuestions';

export default function ProjectQuestionnaire2() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get project type and subtype from URL params
  const projectType = searchParams.get('type');
  const projectSubtype = searchParams.get('subtype');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(searchParams.get('projectId'));
  const [totalQuestions, setTotalQuestions] = useState(0);
  
  useEffect(() => {
    // Determine total questions based on project type
    switch (projectSubtype) {
      case 'kitchen_remodel':
        setTotalQuestions(3); // Example: update with actual count
        break;
      case 'bathroom_remodel':
        setTotalQuestions(3); // Example: update with actual count
        break;
      // Add cases for other project types
      default:
        setTotalQuestions(5);
    }
    
    // If projectId exists, load existing project data
    const loadProject = async () => {
      if (projectId) {
        try {
          setLoading(true);
          const project = await Project.get(projectId);
          if (project && project.questionnaire_answers) {
            setAnswers(project.questionnaire_answers);
          }
        } catch (error) {
          console.error('Error loading project:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadProject();
  }, [projectId, projectSubtype]);
  
  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNext = () => {
    // If last question, save and proceed to estimate
    if (currentQuestion >= totalQuestions - 1) {
      handleSave();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const handleSave = async () => {
    setLoading(true);
    try {
      const projectData = {
        type: projectType,
        subtype: projectSubtype,
        questionnaire_answers: answers
      };
      
      let navigateToId;
      
      if (projectId) {
        await Project.update(projectId, projectData);
        navigateToId = projectId;
      } else {
        const newProject = await Project.create(projectData);
        setProjectId(newProject.id);
        navigateToId = newProject.id;
      }
      
      // Navigate to estimate page
      navigate(createPageUrl('Estimate', `projectId=${navigateToId}`));
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Determine which question component to use based on project type
  const renderQuestionComponent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      );
    }
    
    switch (projectSubtype) {
      case 'kitchen_remodel':
        return (
          <KitchenQuestions
            currentQuestion={currentQuestion}
            answers={answers}
            onAnswer={handleAnswer}
          />
        );
      case 'bathroom_remodel':
        return (
          <BathroomQuestions
            currentQuestion={currentQuestion}
            answers={answers}
            onAnswer={handleAnswer}
          />
        );
      // Add cases for other project types
      default:
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <p>Questions for this project type are not available.</p>
            </CardContent>
          </Card>
        );
    }
  };
  
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(createPageUrl('QuestionnaireFlow2'))}>
          <Home className="mr-2 h-4 w-4" />
          Back to project selection
        </Button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {projectSubtype ? projectSubtype.replace(/_/g, ' ') : 'Project Questionnaire'}
        </h1>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>
      
      {renderQuestionComponent()}
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0 || loading}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={loading}
        >
          {currentQuestion >= totalQuestions - 1 ? (
            <>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Finish & Get Estimate
            </>
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}