
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { Project } from '@/api/entities';
import { ProjectMatch } from '@/api/entities';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  PlusCircle, 
  Home, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  DollarSign,
  Calendar,
  Loader2,
  Trash2,
  HardHat,
  Users
} from "lucide-react";

export default function ProjectOwnerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchStats, setMatchStats] = useState({
    totalMatches: 0,
    pendingMatches: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);

        // Check if user is a project owner
        if (userData.role_type !== 'project_owner') {
          navigate(createPageUrl('index'));
          return;
        }

        // Get user's projects
        const projectsData = await Project.list();
        setProjects(projectsData || []);

        // Load matches statistics
        const matches = await ProjectMatch.filter({
          project_id: { $in: projectsData.map(p => p.id) }
        });

        setMatchStats({
          totalMatches: matches.length,
          pendingMatches: matches.filter(m => m.status === 'pending').length
        });

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleStartNewEstimate = () => {
    navigate(createPageUrl('QuestionnaireFlow2'));
  };

  const viewEstimate = (projectId) => {
    navigate(createPageUrl('Estimate', `projectId=${projectId}`));
  };

  const navigateToCRM = () => {
    navigate(createPageUrl('CRM'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const statsCards = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <Card>
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-sm font-medium text-gray-500">Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">{projects.length}</div>
          <p className="text-gray-500 text-xs md:text-sm">Total projects</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-sm font-medium text-gray-500">Estimated Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            ${projects.reduce((sum, p) => sum + (p.total_estimate || 0), 0).toLocaleString()}
          </div>
          <p className="text-gray-500 text-xs md:text-sm">Total estimated value</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-sm font-medium text-gray-500">Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">{matchStats.totalMatches}</div>
          <p className="text-gray-500 text-xs md:text-sm">{matchStats.pendingMatches} pending matches</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-4 md:py-8 px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Project Dashboard</h1>
          <p className="text-gray-500 text-sm md:text-base">Welcome back, {user?.full_name || 'Project Owner'}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button 
            onClick={handleStartNewEstimate}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">Start New Estimax</span>
          </Button>
          {/* "Find Contractors" Button is removed here */}
        </div>
      </div>

      {statsCards}

      <Tabs defaultValue="projects" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="mb-6">
            <TabsTrigger 
              value="projects"
              className="data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600"
            >
              My Projects
            </TabsTrigger>
            <TabsTrigger 
              value="inprogress"
              className="data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600"
            >
              Completed
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="projects">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2 md:pb-4">
                    <CardTitle className="text-base md:text-lg">
                      {project.type?.charAt(0).toUpperCase() + project.type?.slice(1)} - {project.subtype?.replace(/_/g, ' ')}
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Project #{project.id.substring(0, 8)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Estimate:</span>
                        <span className="font-semibold">
                          ${(project.total_estimate || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Timeline:</span>
                        <span className="font-semibold">
                          {project.estimate_timeline || 'N/A'} weeks
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Status:</span>
                        <span className="font-semibold capitalize">
                          {project.status || 'draft'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => viewEstimate(project.id)}
                    >
                      View Estimate
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg">
              <Home className="mx-auto h-10 md:h-12 w-10 md:w-12 text-orange-400" />
              <h3 className="mt-2 text-base md:text-lg font-medium text-gray-900">No Projects Yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first project estimate</p>
              <Button 
                className="mt-4 px-4 md:px-6 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleStartNewEstimate}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Start New Estimax
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="inprogress">
          <div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg">
            <Clock className="mx-auto h-10 md:h-12 w-10 md:w-12 text-orange-400" />
            <h3 className="mt-2 text-base md:text-lg font-medium text-gray-900">No Projects In Progress</h3>
            <p className="mt-1 text-sm text-gray-500">Projects that are underway will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg">
            <CheckCircle2 className="mx-auto h-10 md:h-12 w-10 md:w-12 text-orange-400" />
            <h3 className="mt-2 text-base md:text-lg font-medium text-gray-900">No Completed Projects</h3>
            <p className="mt-1 text-sm text-gray-500">Projects that are finished will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
