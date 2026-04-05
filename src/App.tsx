import React, { useState, useEffect } from "react";
import { 
  Shield, 
  FileText, 
  Users, 
  LayoutDashboard, 
  Search, 
  Plus, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Calendar,
  User,
  BadgeCheck,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import { FIR, Officer, FIRStatus } from "./types";

// Mock Data
const INITIAL_FIRS: FIR[] = [
  {
    id: "FIR-2024-001",
    complainantName: "John Doe",
    incidentDate: "2024-03-15",
    incidentLocation: "Downtown Street",
    description: "Theft of a bicycle from the front porch.",
    status: "In-Progress",
    assignedOfficerId: "OFF-001",
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "FIR-2024-002",
    complainantName: "Jane Smith",
    incidentDate: "2024-03-20",
    incidentLocation: "Westside Park",
    description: "Public disturbance and noise complaint.",
    status: "Closed",
    assignedOfficerId: "OFF-002",
    createdAt: "2024-03-20T14:30:00Z",
  },
  {
    id: "FIR-2024-003",
    complainantName: "Robert Brown",
    incidentDate: "2024-04-01",
    incidentLocation: "Oak Avenue",
    description: "Vandalism on commercial property.",
    status: "Pending",
    createdAt: "2024-04-01T09:15:00Z",
  }
];

const INITIAL_OFFICERS: Officer[] = [
  {
    id: "OFF-001",
    name: "Officer Sarah Connor",
    rank: "Sergeant",
    station: "Central Station",
    badgeNumber: "B-1024",
  },
  {
    id: "OFF-002",
    name: "Officer James Bond",
    rank: "Inspector",
    station: "North Division",
    badgeNumber: "B-007",
  },
  {
    id: "OFF-003",
    name: "Officer Ellen Ripley",
    rank: "Lieutenant",
    station: "Central Station",
    badgeNumber: "B-2179",
  }
];

type View = "dashboard" | "firs" | "officers" | "cases";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [firs, setFirs] = useState<FIR[]>(INITIAL_FIRS);
  const [officers, setOfficers] = useState<Officer[]>(INITIAL_OFFICERS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isFIRModalOpen, setIsFIRModalOpen] = useState(false);
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [newFIR, setNewFIR] = useState<Partial<FIR>>({
    complainantName: "",
    incidentDate: new Date().toISOString().split('T')[0],
    incidentLocation: "",
    description: "",
    status: "Pending"
  });
  const [newOfficer, setNewOfficer] = useState<Partial<Officer>>({
    name: "",
    rank: "Constable",
    station: "Central Station",
    badgeNumber: ""
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const stats = {
    totalFirs: firs.length,
    activeCases: firs.filter(f => f.status !== "Closed").length,
    totalOfficers: officers.length,
    pendingFirs: firs.filter(f => f.status === "Pending").length,
  };

  const handleAddFIR = (e: React.FormEvent) => {
    e.preventDefault();
    const fir: FIR = {
      ...newFIR as FIR,
      id: `FIR-${new Date().getFullYear()}-${String(firs.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    setFirs([fir, ...firs]);
    setIsFIRModalOpen(false);
    setNewFIR({
      complainantName: "",
      incidentDate: new Date().toISOString().split('T')[0],
      incidentLocation: "",
      description: "",
      status: "Pending"
    });
  };

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    const officer: Officer = {
      ...newOfficer as Officer,
      id: `OFF-${String(officers.length + 1).padStart(3, '0')}`,
    };
    setOfficers([...officers, officer]);
    setIsOfficerModalOpen(false);
    setNewOfficer({
      name: "",
      rank: "Constable",
      station: "Central Station",
      badgeNumber: ""
    });
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        if (isMobile) setIsSidebarOpen(false);
      }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left",
        currentView === view 
          ? "bg-police-600 text-white shadow-lg shadow-police-600/20" 
          : "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col",
              isMobile && "shadow-2xl"
            )}
          >
            <div className="p-6 flex items-center gap-3 border-b border-slate-100">
              <div className="w-10 h-10 bg-police-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-police-600/30">
                <Shield size={24} />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 leading-tight">PoliceMS</h1>
                <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Management System</p>
              </div>
              {isMobile && (
                <button onClick={() => setIsSidebarOpen(false)} className="ml-auto p-2 text-slate-400 hover:text-slate-900">
                  <X size={20} />
                </button>
              )}
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem view="firs" icon={FileText} label="FIR Records" />
              <NavItem view="officers" icon={Users} label="Officers" />
              <NavItem view="cases" icon={Search} label="Case Tracking" />
            </nav>

            <div className="p-4 border-t border-slate-100">
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-police-100 flex items-center justify-center text-police-600">
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">Admin User</p>
                  <p className="text-xs text-slate-500 truncate">mubsharajmal088@gmail.com</p>
                </div>
                <button className="text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen && !isMobile ? "ml-72" : "ml-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
              >
                <Menu size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold text-slate-900 capitalize">{currentView}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search cases, officers..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-police-500 rounded-xl text-sm w-64 transition-all outline-none"
              />
            </div>
            <button 
              onClick={() => setIsFIRModalOpen(true)}
              className="bg-police-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-police-700 transition-colors shadow-lg shadow-police-600/20"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New FIR</span>
            </button>
          </div>
        </header>

        {/* Modals */}
        <AnimatePresence>
          {isFIRModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-police-900 text-white">
                  <h3 className="text-xl font-bold">Register New FIR</h3>
                  <button onClick={() => setIsFIRModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleAddFIR} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Complainant Name</label>
                      <input 
                        required
                        type="text" 
                        value={newFIR.complainantName}
                        onChange={(e) => setNewFIR({...newFIR, complainantName: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-police-500 focus:bg-white outline-none transition-all"
                        placeholder="Full name of complainant"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Incident Date</label>
                        <input 
                          required
                          type="date" 
                          value={newFIR.incidentDate}
                          onChange={(e) => setNewFIR({...newFIR, incidentDate: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-police-500 focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
                        <input 
                          required
                          type="text" 
                          value={newFIR.incidentLocation}
                          onChange={(e) => setNewFIR({...newFIR, incidentLocation: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-police-500 focus:bg-white outline-none transition-all"
                          placeholder="Area/Street"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                      <textarea 
                        required
                        rows={4}
                        value={newFIR.description}
                        onChange={(e) => setNewFIR({...newFIR, description: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-police-500 focus:bg-white outline-none transition-all resize-none"
                        placeholder="Detailed description of the incident..."
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsFIRModalOpen(false)}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 bg-police-600 text-white rounded-xl font-bold hover:bg-police-700 transition-colors shadow-lg shadow-police-600/20"
                    >
                      Register FIR
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {isOfficerModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-police-900 text-white">
                  <h3 className="text-xl font-bold">Add New Officer</h3>
                  <button onClick={() => setIsOfficerModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleAddOfficer} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={newOfficer.name}
                      onChange={(e) => setNewOfficer({...newOfficer, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-police-500 focus:bg-white outline-none transition-all"
                      placeholder="Officer's full name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</label>
                      <select 
                        value={newOfficer.rank}
                        onChange={(e) => setNewOfficer({...newOfficer, rank: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-police-500 focus:bg-white outline-none transition-all"
                      >
                        <option>Constable</option>
                        <option>Sergeant</option>
                        <option>Inspector</option>
                        <option>Lieutenant</option>
                        <option>Captain</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Badge Number</label>
                      <input 
                        required
                        type="text" 
                        value={newOfficer.badgeNumber}
                        onChange={(e) => setNewOfficer({...newOfficer, badgeNumber: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-police-500 focus:bg-white outline-none transition-all"
                        placeholder="e.g. B-1234"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Station</label>
                    <input 
                      required
                      type="text" 
                      value={newOfficer.station}
                      onChange={(e) => setNewOfficer({...newOfficer, station: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-police-500 focus:bg-white outline-none transition-all"
                      placeholder="Assigned station"
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsOfficerModalOpen(false)}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 bg-police-600 text-white rounded-xl font-bold hover:bg-police-700 transition-colors shadow-lg shadow-police-600/20"
                    >
                      Add Officer
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* View Content */}
        <div className="p-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentView === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    label="Total FIRs" 
                    value={stats.totalFirs} 
                    icon={FileText} 
                    color="blue" 
                    trend="+12% from last month"
                  />
                  <StatCard 
                    label="Active Cases" 
                    value={stats.activeCases} 
                    icon={Clock} 
                    color="amber" 
                    trend="5 pending review"
                  />
                  <StatCard 
                    label="Total Officers" 
                    value={stats.totalOfficers} 
                    icon={Users} 
                    color="indigo" 
                    trend="All stations active"
                  />
                  <StatCard 
                    label="Pending FIRs" 
                    value={stats.pendingFirs} 
                    icon={AlertCircle} 
                    color="rose" 
                    trend="Requires attention"
                  />
                </div>

                {/* Recent Activity & Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-slate-900">Recent FIR Records</h3>
                      <button className="text-police-600 text-sm font-semibold hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                      {firs.slice(0, 3).map((fir) => (
                        <div key={fir.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-police-200 hover:bg-police-50/30 transition-all group">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            fir.status === "Closed" ? "bg-emerald-100 text-emerald-600" : 
                            fir.status === "In-Progress" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                          )}>
                            <FileText size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 truncate">{fir.complainantName}</h4>
                            <p className="text-sm text-slate-500 truncate">{fir.description}</p>
                          </div>
                          <div className="text-right hidden sm:block">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                              fir.status === "Closed" ? "bg-emerald-100 text-emerald-700" : 
                              fir.status === "In-Progress" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                            )}>
                              {fir.status}
                            </span>
                            <p className="text-xs text-slate-400 mt-1">{new Date(fir.createdAt).toLocaleDateString()}</p>
                          </div>
                          <ChevronRight className="text-slate-300 group-hover:text-police-500 transition-colors" size={20} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Officer Availability</h3>
                    <div className="space-y-6">
                      {officers.slice(0, 4).map((officer) => (
                        <div key={officer.id} className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                              <User size={20} />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{officer.name}</p>
                            <p className="text-xs text-slate-500 truncate">{officer.rank} • {officer.station}</p>
                          </div>
                          <BadgeCheck size={18} className="text-police-500" />
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-8 py-3 rounded-2xl bg-slate-50 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-colors">
                      Manage Personnel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === "firs" && (
              <motion.div
                key="firs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">FIR Records</h3>
                    <p className="text-slate-500">Manage and register First Information Reports</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                      Export CSV
                    </button>
                    <button 
                      onClick={() => setIsFIRModalOpen(true)}
                      className="px-4 py-2 bg-police-600 text-white rounded-xl text-sm font-semibold hover:bg-police-700 transition-colors shadow-lg shadow-police-600/20"
                    >
                      New Registration
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Complainant</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {firs.map((fir) => (
                          <tr key={fir.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                              <span className="font-mono text-xs font-bold text-police-600 bg-police-50 px-2 py-1 rounded">{fir.id}</span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-slate-900">{fir.complainantName}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin size={14} />
                                <span>{fir.incidentLocation}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Calendar size={14} />
                                <span>{new Date(fir.incidentDate).toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                fir.status === "Closed" ? "bg-emerald-100 text-emerald-700" : 
                                fir.status === "In-Progress" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                              )}>
                                {fir.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button className="p-2 text-slate-400 hover:text-police-600 hover:bg-police-50 rounded-lg transition-all">
                                <FileText size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === "officers" && (
              <motion.div
                key="officers"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Officers Directory</h3>
                    <p className="text-slate-500">Manage police personnel and assignments</p>
                  </div>
                  <button 
                    onClick={() => setIsOfficerModalOpen(true)}
                    className="bg-police-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-police-700 transition-colors shadow-lg shadow-police-600/20"
                  >
                    Add Officer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {officers.map((officer) => (
                    <div key={officer.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-police-50 flex items-center justify-center text-police-600">
                          <User size={32} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{officer.badgeNumber}</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{officer.name}</h4>
                      <p className="text-police-600 font-semibold text-sm mb-4">{officer.rank}</p>
                      
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <Shield size={16} className="text-slate-400" />
                          <span>{officer.station}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Active Duty</span>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-2">
                        <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                          View Profile
                        </button>
                        <button className="flex-1 py-2 bg-police-50 text-police-600 rounded-xl text-xs font-bold hover:bg-police-100 transition-colors">
                          Assign Case
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentView === "cases" && (
              <motion.div
                key="cases"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-police-900 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-2">Case Tracking System</h3>
                    <p className="text-police-200 max-w-md">Monitor real-time progress and status updates for all active investigations.</p>
                    <div className="mt-8 flex gap-4">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1">
                        <p className="text-police-300 text-xs font-bold uppercase mb-1">Active</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1">
                        <p className="text-police-300 text-xs font-bold uppercase mb-1">Resolved</p>
                        <p className="text-2xl font-bold">156</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1">
                        <p className="text-police-300 text-xs font-bold uppercase mb-1">Avg. Time</p>
                        <p className="text-2xl font-bold">12d</p>
                      </div>
                    </div>
                  </div>
                  <Shield className="absolute -right-12 -bottom-12 text-white/5 w-64 h-64" />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {firs.filter(f => f.status === "In-Progress").map((fir) => (
                    <div key={fir.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Clock size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{fir.id}: {fir.description}</h4>
                            <p className="text-sm text-slate-500">Assigned to: {officers.find(o => o.id === fir.assignedOfficerId)?.name || "Unassigned"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                                {String.fromCharCode(64 + i)}
                              </div>
                            ))}
                          </div>
                          <button className="px-4 py-2 bg-police-50 text-police-600 rounded-xl text-xs font-bold hover:bg-police-100 transition-colors">
                            Update Status
                          </button>
                        </div>
                      </div>

                      <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        <TimelineItem 
                          title="Investigation Started" 
                          date="March 16, 2024" 
                          note="Initial evidence collected at the scene. Witness statements recorded."
                          status="completed"
                        />
                        <TimelineItem 
                          title="Evidence Analysis" 
                          date="March 18, 2024" 
                          note="Forensic team analyzing fingerprints and CCTV footage from nearby cameras."
                          status="completed"
                        />
                        <TimelineItem 
                          title="Suspect Identification" 
                          date="March 22, 2024" 
                          note="Potential suspect identified from database. Verification in progress."
                          status="active"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, trend }: { label: string, value: number, icon: any, color: string, trend: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-indigo-50 text-indigo-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", colors[color])}>
          <Icon size={24} />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
      <p className="text-sm font-bold text-slate-500 mb-1">{label}</p>
      <p className="text-xs text-slate-400 font-medium">{trend}</p>
    </div>
  );
}

function TimelineItem({ title, date, note, status }: { title: string, date: string, note: string, status: "completed" | "active" | "pending" }) {
  return (
    <div className="relative">
      <div className={cn(
        "absolute -left-[29px] top-1.5 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center z-10",
        status === "completed" ? "bg-emerald-500" : status === "active" ? "bg-police-600 animate-pulse" : "bg-slate-200"
      )}>
        {status === "completed" && <CheckCircle2 size={12} className="text-white" />}
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <h5 className="font-bold text-slate-900">{title}</h5>
          <span className="text-xs font-medium text-slate-400">{date}</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">{note}</p>
      </div>
    </div>
  );
}
