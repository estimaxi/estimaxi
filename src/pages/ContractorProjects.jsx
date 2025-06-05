import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { Project } from '@/api/entities';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Input
} from "@/components/ui/input";
import { 
  FileText, 
  Search,
  CheckCircle2, 
  Clock, 
  Filter,
  ArrowRight,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContractorProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    price: 'all'
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const allProjects = await Project.list();
        setProjects(allProjects || []);
        setFilteredProjects(allProjects || []);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filter, projects]);

  const applyFilters = () => {
    let results = [...projects];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(project => 
        project.type?.toLowerCase().includes(term) || 
        project.subtype?.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (filter.type !== 'all') {
      results = results.filter(project => project.type === filter.type);
    }

    // Apply status filter
    if (filter.status !== 'all') {
      results = results.filter(project => project.status === filter.status);
    }

    // Apply price filter
    if (filter.price !== 'all') {
      switch (filter.price) {
        case 'less_than_10k':
          results = results.filter(project => project.total_estimate < 10000);
          break;
        case '10k_to_50k':
          results = results.filter(project => project.total_estimate >= 10000 && project.total_estimate < 50000);
          break;
        case '50k_to_100k':
          results = results.filter(project => project.total_estimate >= 50000 && project.total_estimate < 100000);
          break;
        case 'more_than_100k':
          results = results.filter(project => project.total_estimate >= 100000);
          break;
      }
    }

    setFilteredProjects(results);
  };

  const handleProjectClick = (projectId) => {
    navigate(createPageUrl('Estimate', `projectId=${projectId}`));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
          <p className="text-gray-500">Browse and find projects that match your expertise</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects by type..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={filter.type}
            onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filter.status}
            onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="estimated">Estimated</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filter.price}
            onValueChange={(value) => setFilter(prev => ({ ...prev, price: value }))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="less_than_10k">Under $10K</SelectItem>
              <SelectItem value="10k_to_50k">$10K - $50K</SelectItem>
              <SelectItem value="50k_to_100k">$50K - $100K</SelectItem>
              <SelectItem value="more_than_100k">Over $100K</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="capitalize text-lg">
                  {project.type} - {project.subtype?.replace(/_/g, ' ')}
                </CardTitle>
                <CardDescription>
                  Project #{project.id.substring(0, 8)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      Estimate:
                    </span>
                    <span className="font-semibold">
                      ${project.total_estimate?.toLocaleString() || 'Not estimated'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      Timeline:
                    </span>
                    <span className="font-semibold">
                      {project.estimate_timeline || 'N/A'} weeks
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      Status:
                    </span>
                    <span className={`capitalize font-semibold ${
                      project.status === 'completed' ? 'text-green-600' : 
                      project.status === 'in_progress' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {project.status || 'Draft'}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Projects Found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search filters or check back later for new projects
          </p>
        </div>
      )}
    </div>
  );
}