import { useState } from "react";
import { useJobs, useCreateJob } from "@/hooks/use-jobs";
import { useApplications, useApplyForJob } from "@/hooks/use-applications";
import { useUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, DollarSign, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function JobsPage() {
  const { data: user } = useUser();
  const { data: jobs, isLoading } = useJobs();
  const { data: myApplications } = useApplications();
  const { mutate: apply, isPending: isApplying } = useApplyForJob();
  const { mutate: createJob, isPending: isCreating } = useCreateJob();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
  });

  const filteredJobs = jobs?.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) || 
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  const hasApplied = (jobId: number) => {
    return myApplications?.some(app => app.jobId === jobId);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    createJob(newJob, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewJob({ title: "", description: "", requirements: "", location: "", salary: "" });
      }
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Jobs</h1>
          <p className="text-muted-foreground mt-1">Find your next opportunity</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search jobs..." 
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {user.role === 'employer' && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                  <Plus className="mr-2 h-4 w-4" /> Post Job
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Post a New Job</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateJob} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input 
                      required 
                      value={newJob.title}
                      onChange={e => setNewJob({...newJob, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input 
                        required 
                        value={newJob.location}
                        onChange={e => setNewJob({...newJob, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Salary Range</Label>
                      <Input 
                        required 
                        value={newJob.salary}
                        onChange={e => setNewJob({...newJob, salary: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      required 
                      value={newJob.description}
                      onChange={e => setNewJob({...newJob, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Requirements</Label>
                    <Textarea 
                      required 
                      value={newJob.requirements}
                      onChange={e => setNewJob({...newJob, requirements: e.target.value})}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-indigo-600" disabled={isCreating}>
                    {isCreating ? "Posting..." : "Post Job"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs?.map((job) => (
            <Card key={job.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                    {job.employer?.name || "Company"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {job.postedAt && new Date(job.postedAt).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </CardTitle>
                <div className="flex flex-col gap-2 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" /> {job.salary}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.split(',').slice(0, 3).map((req, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">
                      {req.trim()}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t bg-slate-50/50 rounded-b-2xl">
                {user.role === 'student' ? (
                  <Button 
                    className={`w-full ${hasApplied(job.id) ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    disabled={hasApplied(job.id) || isApplying}
                    onClick={() => apply(job.id)}
                  >
                    {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     hasApplied(job.id) ? "Applied" : "Apply Now"}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
          
          {filteredJobs?.length === 0 && (
             <div className="col-span-full text-center py-12">
               <p className="text-muted-foreground">No jobs found matching your criteria.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
