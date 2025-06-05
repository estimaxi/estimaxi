
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Project } from '@/api/entities';
import { ProjectMatch } from '@/api/entities';
import { User } from '@/api/entities';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  X, 
  Check, 
  MapPin, 
  DollarSign, 
  Hammer, 
  Bell, 
  FileText, 
  MessageSquare, 
  User as UserIcon,
  Users,
  Circle,
  ImageIcon,
  Paperclip,
  CreditCard,
  Calendar
} from 'lucide-react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as UICalendar } from "@/components/ui/calendar";

const HANDSHAKE_IMAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld2JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMTFsLTYgNiIvPjxwYXRoIGQ9Ik0xOCA2bC02IDUiLz48cGF0aCBkPSJNOCA5bDMtMyIvPjxwYXRoIGQ9Ik0xNiAxN2wzLTMiLz48L3N2Zz4=";
const SAD_FACE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld2JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZkNzAwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNOCAxNXMxLjUgMiA0IDIgNC0yIDQtMiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIxLjUiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjkiIHI9IjEuNSIvPjwvc3ZnPg==";

export default function ContractorDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [showMatch, setShowMatch] = useState(false);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [proposedPrice, setProposedPrice] = useState('');
  // Add these new states at the component level
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const [loadingAccepted, setLoadingAccepted] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  // Add new useEffect for accepted projects
  useEffect(() => {
    if (activeTab === 'accepted') {
      loadAcceptedProjects();
    }
  }, [activeTab]);

  const loadAcceptedProjects = async () => {
    setLoadingAccepted(true);
    try {
      const userData = await User.me();
      
      // Get matches where this contractor accepted projects
      const matches = await ProjectMatch.filter({
        contractor_id: userData.id,
        status: 'accepted'
      });
      
      if (matches.length === 0) {
        setAcceptedProjects([]);
        setLoadingAccepted(false);
        return;
      }
      
      // Get the actual project details for each match
      const projectIds = matches.map(match => match.project_id);
      const projectsData = await Promise.all(
        projectIds.map(id => Project.filter({ id: id }))
      );
      
      // Flatten and filter out any empty results
      const flattenedProjects = projectsData
        .flat()
        .filter(project => project !== null && project !== undefined);
      
      setAcceptedProjects(flattenedProjects);
    } catch (error) {
      console.error('Error loading accepted projects:', error);
    } finally {
      setLoadingAccepted(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const loadProjects = async () => {
    try {
      const userData = await User.me();
      const projectsData = await Project.filter({
        status: 'available'
      });

      // Get existing matches to filter out already acted upon projects
      const matches = await ProjectMatch.filter({
        contractor_id: userData.id
      });
      const matchedProjectIds = matches.map(m => m.project_id);

      const availableProjects = projectsData.filter(p => 
        !matchedProjectIds.includes(p.id)
      );

      setProjects(availableProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleSwipe = async (direction) => {
    setSwipeDirection(direction);
    
    if (direction === 'right') {
      try {
        // Get current user data to include contractor ID
        const userData = await User.me();
        
        // Create the match with contractor_id
        await ProjectMatch.create({
          project_id: projects[currentIndex].id,
          contractor_id: userData.id,
          status: 'accepted',
          matched_at: new Date().toISOString()
        });
        
        setShowMatch(true);
      } catch (error) {
        console.error('Error accepting project:', error);
      }
    } else {
      setShowRejectDialog(true);
    }
  };

  const handleReject = async () => {
    try {
      await ProjectMatch.create({
        project_id: projects[currentIndex].id,
        status: 'rejected',
        rejection_reason: rejectReason
      });
    } catch (error) {
      console.error('Error rejecting project:', error);
    }
    setRejectReason('');
    setShowRejectDialog(false);
    nextProject();
  };

  const handleSetPrice = async () => {
    try {
      await ProjectMatch.create({
        project_id: projects[currentIndex].id,
        status: 'rejected',
        proposed_price: parseFloat(proposedPrice.replace(/[^0-9.]/g, '')),
        rejection_reason: "Price mismatch - contractor proposed alternative price"
      });
      setShowPriceInput(false);
      setShowRejectDialog(false);
      setProposedPrice('');
      nextProject();
    } catch (error) {
      console.error('Error saving price proposal:', error);
    }
  };

  const nextProject = () => {
    setCurrentIndex(prev => prev + 1);
    setSwipeDirection(null);
  };

  const renderProjectsTab = () => {
    if (projects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Hammer className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">No Projects Available</h2>
          <p className="text-gray-500 text-center mt-2">
            We'll notify you when new projects match your skills.
          </p>
        </div>
      );
    }

    const currentProject = projects[currentIndex];
    if (!currentProject) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Hammer className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">All Caught Up!</h2>
          <p className="text-gray-500 text-center mt-2">
            You've reviewed all available projects.
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto pt-4 pb-20 px-4">
        <h1 className="text-2xl font-bold mb-6">Find Projects</h1>
        
        <div className="relative">
          <motion.div
            animate={{
              x: swipeDirection === 'left' ? -500 : swipeDirection === 'right' ? 500 : 0,
              opacity: swipeDirection ? 0 : 1,
              rotateZ: swipeDirection === 'left' ? -10 : swipeDirection === 'right' ? 10 : 0
            }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => {
              if (swipeDirection) {
                nextProject();
              }
            }}
            className="bg-white rounded-xl overflow-hidden shadow-lg"
          >
            <div className="relative">
              <img 
                src={currentProject.image_url} 
                alt={currentProject.project_name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h2 className="text-2xl font-bold text-white mb-1">{currentProject.project_name}</h2>
                <div className="flex items-center text-white/90">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{currentProject.location}</span>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <p className="text-gray-600 mb-4">{currentProject.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{currentProject.location}</span>
                </div>
                <div className="flex items-center text-green-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">
                    ${currentProject.total_estimate?.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                className="text-blue-600 p-0 underline mt-4"
                onClick={() => setShowProjectDetails(true)}
              >
                View Details
              </Button>
            </div>
          </motion.div>
        </div>
        
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-red-300 hover:border-red-500 hover:bg-red-50"
            onClick={() => handleSwipe('left')}
          >
            <X className="w-8 h-8 text-red-500" />
          </Button>
          
          <Button
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-green-300 hover:border-green-500 hover:bg-green-50"
            onClick={() => handleSwipe('right')}
          >
            <Check className="w-8 h-8 text-green-500" />
          </Button>
        </div>
        
        <p className="text-center text-gray-500 mt-4 text-sm">
          {currentIndex + 1} of {projects.length} projects available
        </p>
      </div>
    );
  };

  const handleProjectClick = (projectId) => {
    navigate(createPageUrl('ProjectManagement'));
  };

  const handleDueDateChange = async (projectId, newDate) => {
    try {
      // Update the project in the accepted projects list
      setAcceptedProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, due_date: newDate } 
            : project
        )
      );

      // Update the project match
      const userData = await User.me();
      const matches = await ProjectMatch.filter({
        project_id: projectId,
        contractor_id: userData.id,
        status: 'accepted'
      });

      if (matches.length > 0) {
        await ProjectMatch.update(matches[0].id, {
          due_date: newDate
        });
      }
    } catch (error) {
      console.error('Error updating due date:', error);
    }
  };

  const renderAcceptedTab = () => {
    if (loadingAccepted) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-md mx-auto pt-4 px-4">
          <h1 className="text-2xl font-bold mb-4">Accepted Projects</h1>
          
          {/* Tab navigation - simplified */}
          <div className="flex border-b mb-4">
            <button className="py-2 px-4 font-medium text-orange-500 border-b-2 border-orange-500">
              Ongoing
            </button>
            <button className="py-2 px-4 font-medium text-gray-500">
              Over Due
            </button>
            <button className="py-2 px-4 font-medium text-gray-500">
              Completed
            </button>
          </div>
          
          {/* Project cards */}
          <div className="space-y-4">
            {acceptedProjects.length > 0 ? (
              acceptedProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <h2 className="text-lg font-semibold">{project.project_name || project.type}</h2>
                  <p className="text-gray-500 mt-1 text-sm">
                    {project.description || `A ${project.type} project located in ${project.location || 'your area'}`}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {project.due_date ? format(new Date(project.due_date), "PPP") : 'Schedule TBD'}
                      </div>
                      <div className="flex items-center text-green-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${project.total_estimate?.toLocaleString() || 'TBD'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Due Date Section */}
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-9">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {project.due_date ? (
                            format(new Date(project.due_date), "PPP")
                          ) : (
                            "Set due date"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <UICalendar
                          mode="single"
                          selected={project.due_date ? new Date(project.due_date) : undefined}
                          onSelect={(date) => handleDueDateChange(project.id, date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="mt-4">
                    <Button 
                      className="w-full"
                      onClick={() => navigate(createPageUrl('ProjectManagement'))}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Accepted Projects</h3>
                <p className="mt-1 text-gray-500">
                  Projects you accept will appear here. Swipe right on projects you're interested in.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'projects':
        return renderProjectsTab();
      case 'notifications':
        return (
          <div className="flex flex-col items-center justify-center py-20">
            <Bell className="w-12 h-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-700">Notifications</h2>
            <p className="text-gray-500 text-center mt-2">No new notifications</p>
          </div>
        );
      case 'accepted':
        return renderAcceptedTab();
      case 'messages':
        return (
          <div className="flex flex-col items-center justify-center py-20">
            <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-700">Messages</h2>
            <p className="text-gray-500 text-center mt-2">No messages yet</p>
          </div>
        );
      case 'profile':
        navigate(createPageUrl('ContractorProfile')); 
        return null; 
      default:
        return renderProjectsTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {renderTabContent()}

      {/* Project Details Dialog */}
      <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{projects[currentIndex]?.project_name}</DialogTitle>
            <DialogDescription>
              {projects[currentIndex]?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <img 
              src={projects[currentIndex]?.image_url} 
              alt={projects[currentIndex]?.project_name}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-gray-600">{projects[currentIndex]?.location}</p>
              </div>
              <div>
                <h3 className="font-semibold">Budget</h3>
                <p className="text-gray-600">${projects[currentIndex]?.total_estimate.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Type</h3>
                <p className="text-gray-600">{projects[currentIndex]?.type} - {projects[currentIndex]?.subtype.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <h3 className="font-semibold">Distance</h3>
                <p className="text-gray-600">{projects[currentIndex]?.distance}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProjectDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="flex flex-col items-center text-center p-6">
            <img 
              src={SAD_FACE} 
              alt="Sad Face" 
              className="w-16 h-16 mb-4"
            />
            <h2 className="text-xl font-bold mb-4">Opps!</h2>
            <p className="text-gray-600 mb-6">
              How much would you charge for this project?
            </p>
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  setShowRejectDialog(false);
                  setShowPriceInput(true);
                }}
              >
                Set Price
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Price Input Dialog */}
      <Dialog open={showPriceInput} onOpenChange={setShowPriceInput}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="flex flex-col items-center text-center p-6">
            <h2 className="text-xl font-bold mb-2">
              How much would you charge for this project?
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Offer your own price to the client. The client will review your company and will decide if they want to invite you to a real life estimate. Once they do it, we will notify you!
            </p>
            <div className="relative w-full mb-6">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <Input
                type="text"
                value={proposedPrice}
                onChange={(e) => {
                  // Only allow numbers and format with commas
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setProposedPrice(Number(value).toLocaleString());
                }}
                className="pl-7 text-center text-xl"
                placeholder="0"
              />
            </div>
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleSetPrice}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Match Dialog */}
      <Dialog open={showMatch} onOpenChange={setShowMatch}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="flex flex-col items-center text-center p-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={HANDSHAKE_IMAGE} 
                alt="Handshake" 
                className="w-24 h-24 mb-4"
              />
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">It's a Match!</h2>
            <p className="text-gray-600 mb-6">
              The client will review your company and will decide if he wants to invite you to a real life estimate. Once they do it, we will notify you
            </p>
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => {
                setShowMatch(false);
                navigate(createPageUrl('PricingPlans'));
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center py-3">
          <button 
            className={`flex flex-col items-center p-2 ${activeTab === 'projects' ? 'text-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabChange('projects')}
          >
            <Hammer className="h-6 w-6" />
            <span className="text-xs mt-1">Projects</span>
          </button>
          <button 
            className={`flex flex-col items-center p-2 ${activeTab === 'notifications' ? 'text-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabChange('notifications')}
          >
            <Bell className="h-6 w-6" />
            <span className="text-xs mt-1">Alerts</span>
          </button>
          <button 
            className={`flex flex-col items-center p-2 ${activeTab === 'accepted' ? 'text-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabChange('accepted')}
          >
            <FileText className="h-6 w-6" />
            <span className="text-xs mt-1">Accepted</span>
          </button>
          <button 
            className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabChange('profile')}
          >
            <UserIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
