
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  Users,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Plus,
  ChevronRight,
  CreditCard,
  DollarSign,
  Circle,
  ChevronLeft,
  Trash2,
  Edit,
  Upload, 
  ImageIcon, 
  Paperclip,
  Download,
  Link,
  AlbumIcon,
  Image,
  X
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Progress
} from "@/components/ui/progress";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadFile } from "@/api/integrations";
import { Project, ProjectMatch, User } from '@/api/integrations/Database';
import { format } from 'date-fns';

export default function ProjectManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    priority: 'medium',
    status: 'not_started'
  });
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectFiles, setProjectFiles] = useState([]);
  const [showAlbumDialog, setShowAlbumDialog] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const [albums, setAlbums] = useState([]);

  // Dummy project data
  const project = {
    name: "Building whole new floor in building four on right block",
    status: "in_progress",
    progress: 65,
    startDate: "2024-01-01",
    endDate: "2024-12-25",
    budget: 150000,
    spent: 98500,
    team: [
      { name: "John Doe", role: "Lead Contractor", avatar: "JD" },
      { name: "Sarah Smith", role: "Architect", avatar: "SS" },
      { name: "Mike Johnson", role: "Engineer", avatar: "MJ" }
    ],
    tasks: [
      { id: 1, title: "Foundation work", status: "completed", dueDate: "2024-02-15", priority: 'medium' },
      { id: 2, title: "Structural framing", status: "completed", dueDate: "2024-04-01", priority: 'high' },
      { id: 3, title: "Electrical installation", status: "in_progress", dueDate: "2024-06-30", priority: 'urgent' },
      { id: 4, title: "Plumbing work", status: "in_progress", dueDate: "2024-07-15", priority: 'low' },
      { id: 5, title: "Interior finishing", status: "not_started", dueDate: "2024-09-30", priority: 'medium' }
    ],
    milestones: [
      { title: "Foundation Complete", date: "2024-02-15", completed: true },
      { title: "Structure Complete", date: "2024-04-01", completed: true },
      { title: "MEP Installation", date: "2024-07-15", completed: false },
      { title: "Interior Work", date: "2024-09-30", completed: false },
      { title: "Final Inspection", date: "2024-12-01", completed: false }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = () => {
    // In a real app, you'd call an API to add the task
    console.log('Adding new task:', newTask);
    
    if (newTask.id) {
      // Editing existing task
      project.tasks = project.tasks.map(task =>
        task.id === newTask.id ? { ...task, ...newTask } : task
      );
    } else {
      // Adding new task
      project.tasks.push({
        id: project.tasks.length + 1,
        title: newTask.title,
        status: newTask.status,
        dueDate: newTask.dueDate,
        priority: newTask.priority
      });
    }
    
    // Reset form and close dialog
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      assignee: '',
      priority: 'medium',
      status: 'not_started'
    });
    setShowAddTask(false);
  };

  // Add task deletion function
  const handleDeleteTask = (taskId) => {
    project.tasks = project.tasks.filter(task => task.id !== taskId);
    // In a real app, you'd call an API to delete the task
    console.log('Deleted task:', taskId);
  };

  // Add task edit function
  const handleEditTask = (task) => {
    setNewTask({
      id: task.id,
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      assignee: task.assignee || '',
      priority: task.priority || 'medium',
      status: task.status || 'not_started'
    });
    setShowAddTask(true);
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    project.tasks = project.tasks.map(task => 
      task.id === taskId ? { ...task, priority: newPriority } : task
    );
    // In a real app, you'd call an API to update the task priority
    console.log('Updated task priority:', { taskId, newPriority });
  };

  const priorityConfig = {
    urgent: {
      label: 'Urgent',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200'
    },
    high: {
      label: 'High Priority',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-200'
    },
    medium: {
      label: 'Medium Priority',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200'
    },
    low: {
      label: 'Low Priority',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploadingFile(true);
    try {
      const response = await UploadFile({
        file: selectedFile
      });
      
      // Add the new file to projectFiles state
      const newFile = {
        id: Date.now(), // temporary ID for demo
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        uploadDate: new Date().toISOString(),
        url: response.file_url
      };
      
      setProjectFiles(prev => [...prev, newFile]);
      setSelectedFile(null);
      setShowUploadDialog(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleImageSelection = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => ({
        file,
        id: Math.random().toString(36).substring(2),
        preview: URL.createObjectURL(file)
      }));
      setSelectedImages(prev => [...prev, ...filesArray]);
    }
  };

  const handleRemoveImage = (id) => {
    setSelectedImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      return filtered;
    });
  };

  const handleCreateAlbum = async () => {
    if (!albumTitle || selectedImages.length === 0) return;
    
    setCreatingAlbum(true);
    try {
      // Upload all images
      const uploadPromises = selectedImages.map(async img => {
        const response = await UploadFile({ file: img.file });
        return {
          id: img.id,
          url: response.file_url,
          name: img.file.name
        };
      });
      
      const uploadedImages = await Promise.all(uploadPromises);
      
      // Create new album
      const newAlbum = {
        id: Date.now().toString(),
        title: albumTitle,
        date: new Date().toISOString(),
        images: uploadedImages,
        coverImage: uploadedImages[0]?.url || ''
      };
      
      setAlbums(prev => [...prev, newAlbum]);
      
      // Reset form
      setAlbumTitle('');
      setSelectedImages([]);
      setShowAlbumDialog(false);
    } catch (error) {
      console.error('Error creating album:', error);
    } finally {
      setCreatingAlbum(false);
    }
  };

  // Get URL parameters for project ID
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('projectId');
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch project data if we have a projectId
  useEffect(() => {
    const fetchProjectData = async () => {
      if (projectId) {
        try {
          setLoading(true);
          const projects = await Project.filter({ id: projectId });
          if (projects.length > 0) {
            setProjectData(projects[0]);
          }
          
          // Also try to get match data for due date
          const userData = await User.me();
          const matches = await ProjectMatch.filter({
            project_id: projectId,
            contractor_id: userData.id,
            status: 'accepted'
          });
          
          if (matches.length > 0 && matches[0].due_date) {
            // Update project data with due date from match
            setProjectData(prev => ({
              ...prev,
              due_date: matches[0].due_date
            }));
          }
        } catch (error) {
          console.error('Error fetching project data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);

  // Use real project data if available, otherwise fall back to dummy data
  const displayProject = projectData || project;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{displayProject.name || displayProject.project_name || displayProject.type}</h1>
          <div className="flex items-center mt-2">
            <span className={`px-2 py-1 rounded-full text-sm ${
              displayProject.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
              displayProject.status === 'completed' ? 'bg-green-100 text-green-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {displayProject.status?.replace('_', ' ').charAt(0).toUpperCase() + displayProject.status?.slice(1)}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            {displayProject.due_date ? (
              <span className="text-gray-600 text-sm">
                Due {format(new Date(displayProject.due_date), "PPP")}
              </span>
            ) : (
              <span className="text-gray-600 text-sm">
                Due {new Date(displayProject.endDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button onClick={() => setShowAddTask(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayProject.progress}%</div>
            <Progress value={displayProject.progress} className="mt-2" />
            <p className="text-xs text-gray-500 mt-2">
              {Math.floor((new Date(displayProject.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Overview</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${displayProject.spent.toLocaleString()}</div>
            <Progress value={(displayProject.spent / displayProject.budget) * 100} className="mt-2" />
            <p className="text-xs text-gray-500 mt-2">
              of ${displayProject.budget.toLocaleString()} total budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex -space-x-2">
              {displayProject.team.map((member, index) => (
                <Avatar key={index} className="border-2 border-white">
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
              ))}
              <Button variant="outline" className="rounded-full w-8 h-8 ml-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayProject.tasks.filter(task => task.status !== 'completed').map(task => (
                    <div key={task.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {task.status === 'in_progress' ? (
                          <Clock className="h-4 w-4 text-blue-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span>{task.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Key project deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayProject.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {milestone.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-400" />
                        )}
                        <span>{milestone.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(milestone.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Project Tasks</CardTitle>
                  <CardDescription>All tasks and their current status</CardDescription>
                </div>
                <Button onClick={() => setShowAddTask(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayProject.tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-sm ${
                          task.status === 'completed' ? 'text-green-600' :
                          task.status === 'in_progress' ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>
                          {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <span className="text-gray-300">•</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={`h-6 px-2 ${
                                priorityConfig[task.priority || 'medium'].bgColor
                              } ${
                                priorityConfig[task.priority || 'medium'].textColor
                              } border ${
                                priorityConfig[task.priority || 'medium'].borderColor
                              } hover:bg-opacity-80`}
                            >
                              {priorityConfig[task.priority || 'medium'].label}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem 
                              onClick={() => handlePriorityChange(task.id, 'urgent')}
                              className="text-red-600"
                            >
                              <Circle className="mr-2 h-2 w-2 fill-red-600" />
                              Urgent
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handlePriorityChange(task.id, 'high')}
                              className="text-orange-600"
                            >
                              <Circle className="mr-2 h-2 w-2 fill-orange-600" />
                              High Priority
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handlePriorityChange(task.id, 'medium')}
                              className="text-yellow-600"
                            >
                              <Circle className="mr-2 h-2 w-2 fill-yellow-600" />
                              Medium Priority
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handlePriorityChange(task.id, 'low')}
                              className="text-green-600"
                            >
                              <Circle className="mr-2 h-2 w-2 fill-green-600" />
                              Low Priority
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Task Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditTask(task)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark as Complete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Add Comment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            Reassign
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTask(task.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Project Files</CardTitle>
                  <CardDescription>Documents and resources</CardDescription>
                </div>
                <Button onClick={() => setShowUploadDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {projectFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No files uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projectFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        {file.type.includes('image') ? (
                          <ImageIcon className="w-5 h-5 text-blue-500" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-500" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          Download
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link className="mr-2 h-4 w-4" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setProjectFiles(prev => prev.filter(f => f.id !== file.id));
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Upload Dialog */}
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
                <DialogDescription>
                  Upload documents, images, or other files related to this project.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    {selectedFile ? (
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">{selectedFile.name}</p>
                        <p className="text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-700">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          Support for documents, images, and more
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleFileUpload} 
                  disabled={!selectedFile || uploadingFile}
                >
                  {uploadingFile ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Project progress and key events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayProject.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-3 h-3 rounded-full ${
                        milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      {index < displayProject.milestones.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-200" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{milestone.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(milestone.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Project Gallery</CardTitle>
                  <CardDescription>Photos from the construction site</CardDescription>
                </div>
                <Button onClick={() => setShowAlbumDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Album
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {albums.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <span>Image {item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {albums.map((album) => (
                    <div key={album.id} className="rounded-lg overflow-hidden border bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-100 relative">
                        {album.coverImage ? (
                          <img 
                            src={album.coverImage} 
                            alt={album.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <AlbumIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">{album.title}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {new Date(album.date).toLocaleDateString()} • {album.images.length} photos
                          </p>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Album Creation Dialog */}
          <Dialog open={showAlbumDialog} onOpenChange={setShowAlbumDialog}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Album</DialogTitle>
                <DialogDescription>
                  Upload photos and organize them into an album
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="album-title">Album Title</Label>
                  <Input 
                    id="album-title" 
                    placeholder="Enter album title"
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Photos</Label>
                  <div className="border-2 border-dashed rounded-lg p-6">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelection}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2 mb-4"
                    >
                      <Image className="h-8 w-8 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload images
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, GIF up to 10MB
                      </p>
                    </label>
                    
                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {selectedImages.map((img) => (
                          <div key={img.id} className="relative group">
                            <img 
                              src={img.preview} 
                              alt="Preview" 
                              className="h-20 w-full object-cover rounded"
                            />
                            <button 
                              onClick={() => handleRemoveImage(img.id)}
                              className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAlbumDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAlbum} 
                  disabled={!albumTitle || selectedImages.length === 0 || creatingAlbum}
                >
                  {creatingAlbum ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Album'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Track all project payments</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border-b">
                  <div>
                    <p className="font-medium">Initial Deposit</p>
                    <p className="text-xs text-gray-500">Jan 10, 2024</p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-green-600">$45,000</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border-b">
                  <div>
                    <p className="font-medium">Phase 1 Milestone</p>
                    <p className="text-xs text-gray-500">Mar 15, 2024</p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-green-600">$35,000</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border-b">
                  <div>
                    <p className="font-medium">Phase 2 Milestone</p>
                    <p className="text-xs text-gray-500">Jun 22, 2024</p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-blue-600">$25,000</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Pending</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium">Final Payment</p>
                    <p className="text-xs text-gray-500">Dec 10, 2024</p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-500">$45,000</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Scheduled</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Paid</span>
                  <span className="font-bold">$80,000</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium">Remaining</span>
                  <span className="font-bold">$70,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{newTask.id ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            <DialogDescription>
              {newTask.id ? 'Update task details' : 'Create a new task for this project. Add details and assign team members.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Name</Label>
              <Input 
                id="title" 
                name="title" 
                value={newTask.title} 
                onChange={handleInputChange} 
                placeholder="Enter task name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={newTask.description} 
                onChange={handleInputChange}
                placeholder="Enter task description"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  name="dueDate" 
                  type="date" 
                  value={newTask.dueDate} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
              
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assign To</Label>
                <Select
                  value={newTask.assignee}
                  onValueChange={(value) => handleSelectChange('assignee', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {displayProject.team.map((member, index) => (
                      <SelectItem key={index} value={member.name}>
                        {member.name} - {member.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newTask.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="deferred">Deferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTask(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              {newTask.id ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
