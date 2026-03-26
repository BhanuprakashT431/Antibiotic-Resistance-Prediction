import React, { useState, useEffect } from 'react';
import { Pill, Activity, Dna, ShieldAlert, Sparkles, CheckCircle, ShieldCheck, ArrowRight, Bug } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

import { fetchPrediction, fetchAnalytics } from './api';
import type { PredictRequest, PredictResponse, AnalyticsResponse } from './api';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Label } from './components/ui/label';
import { Select } from './components/ui/select';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';

const speciesOptions = [
  "S. aureus",
  "E. coli",
  "K. pneumoniae"
];

const originOptions = [
  "Clinical",
  "Environmental"
];

const geneOptions = [
  "blaCTX-M",
  "mecA",
  "vanA",
  "NDM-1"
];

type AppStep = 'landing' | 'input' | 'results';

function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [formData, setFormData] = useState<PredictRequest>({
    species: speciesOptions[0],
    origin: originOptions[0],
    genes: [],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    fetchAnalytics("All").then(setAnalytics).catch(console.error);
  }, []);

  const toggleGene = (gene: string) => {
    setFormData(prev => ({
      ...prev,
      genes: prev.genes.includes(gene) 
        ? prev.genes.filter(g => g !== gene)
        : [...prev.genes, gene]
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const pred = await fetchPrediction(formData);
      setResult(pred);
      const stats = await fetchAnalytics(formData.species);
      setAnalytics(stats);
      setStep('results');
    } catch (error) {
      console.error("Failed to fetch prediction:", error);
      alert("Error connecting to the backend. Is FastAPI running?");
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setResult(null);
    setStep('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 overflow-x-hidden">
      
      {/* Header Pipeline */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 text-primary cursor-pointer hover:opacity-80 transition-opacity"
            onClick={resetFlow}
          >
            <Dna className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-500">
              AMR-Predict
            </span>
          </div>
          <div className="text-sm font-medium text-slate-500 hidden sm:block">
            Clinical Decision Support Tool
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: LANDING PAGE */}
          {step === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-5xl flex flex-col items-center text-center gap-12"
            >
              
              <div className="space-y-6 max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800 shadow-sm"
                >
                  <Sparkles className="mr-2 h-4 w-4" /> Discover the Future of AMR Prediction
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900"
                >
                   Combat Resistance with <br/>
                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-500">
                     Precision Intelligence
                   </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-slate-600 leading-relaxed"
                >
                  Input pathogen profiles, detect resistance genes, and receive real-time predictive 
                  antimicrobial recommendations powered by advanced machine learning models.
                </motion.p>
              </div>

              {/* Animated Hover Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
              >
                {[
                  { icon: Activity, title: "Rapid Analysis", desc: "Instant evaluation of complex resistance isolates.", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: Dna, title: "Genomic Profiling", desc: "Correlate mecA, vanA, and NDM-1 with historic treatment outcomes.", color: "text-emerald-500", bg: "bg-emerald-50" },
                  { icon: ShieldCheck, title: "Clinical Support", desc: "Receive immediate drug susceptibility profiles.", color: "text-purple-500", bg: "bg-purple-50" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10, scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="p-6 rounded-2xl border bg-white shadow-sm flex flex-col items-center text-center cursor-default relative overflow-hidden group"
                  >
                    <div className={`p-4 rounded-full ${item.bg} ${item.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                    
                    {/* Decorative hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-slate-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => setStep('input')}
                  className="bg-slate-900 text-white rounded-full px-8 py-6 text-lg hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20 group"
                >
                  Start Prediction <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

            </motion.div>
          )}

          {/* STEP 2: INPUT PAGE */}
          {step === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-lg"
            >
              <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden relative">
                
                {/* Decorative background circle */}
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl -z-10 animate-pulse delay-700"></div>
                <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl -z-10 animate-pulse"></div>
                
                <CardHeader className="text-center pb-2 pt-8">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", delay: 0.1 }}
                    className="mx-auto bg-blue-100 text-blue-600 p-3 rounded-2xl w-14 h-14 flex items-center justify-center mb-4"
                  >
                    <Activity className="w-8 h-8" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold">Isolate Parameters</CardTitle>
                  <p className="text-slate-500 text-sm mt-2">Enter the clinical data to generate the susceptibility profile.</p>
                </CardHeader>

                <CardContent className="space-y-6 pt-4 pb-8 px-8">
                  
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Bacterial Species</Label>
                    <Select 
                      value={formData.species}
                      onChange={(e) => setFormData({...formData, species: e.target.value})}
                      className="rounded-xl border-slate-200 focus:ring-blue-500 bg-white"
                    >
                      {speciesOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Sample Origin</Label>
                    <Select 
                      value={formData.origin}
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      className="rounded-xl border-slate-200 focus:ring-blue-500 bg-white"
                    >
                      {originOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
                    <Label className="text-slate-700 font-semibold">Resistance Genes Detected</Label>
                    <div className="flex flex-wrap gap-2">
                      {geneOptions.map(gene => {
                        const isSelected = formData.genes.includes(gene);
                        return (
                          <motion.div 
                            key={gene}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleGene(gene)}
                            className="cursor-pointer"
                          >
                            <Badge 
                              variant={isSelected ? "default" : "outline"}
                              className={isSelected ? "bg-blue-600 text-white shadow-md border-transparent py-1 px-3 text-sm" : "bg-white text-slate-600 border-slate-200 py-1 px-3 text-sm hover:border-blue-400"}
                            >
                              {gene}
                            </Badge>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-4 flex gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl h-12"
                      onClick={() => setStep('landing')}
                    >
                      Back
                    </Button>
                    <Button 
                      className="flex-[2] rounded-xl h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all realtive overflow-hidden" 
                      onClick={handlePredict}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                          <span>Computing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Sparkles className="mr-2 h-5 w-5" /> Run Prediction
                        </div>
                      )}
                    </Button>
                  </motion.div>

                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: RESULTS PAGE */}
          {step === 'results' && result && analytics && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="w-full max-w-6xl space-y-6"
            >
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                  Analysis Results
                </h2>
                <Button variant="outline" onClick={() => setStep('input')} className="rounded-full shadow-sm">
                  New Prediction
                </Button>
              </div>

              {/* Status Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              >
                <Alert 
                  variant={result.susceptibility_status.includes("High") || result.susceptibility_status.includes("Critical") ? "destructive" : "success"}
                  className="shadow-md border-0 p-6 rounded-2xl items-center flex gap-4 my-6"
                >
                  <div className={`p-4 rounded-full ${result.susceptibility_status.includes("High") ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                    {result.susceptibility_status.includes("High") || result.susceptibility_status.includes("Critical") ? (
                      <ShieldAlert className="h-8 w-8" />
                    ) : (
                      <ShieldCheck className="h-8 w-8" />
                    )}
                  </div>
                  <div>
                    <AlertTitle className="text-xl font-bold mb-1">{result.susceptibility_status}</AlertTitle>
                    <AlertDescription className="text-base opacity-90">
                      Based on the input {formData.species} profile with selected factors, the machine learning model has evaluated the risk of antimicrobial resistance.
                    </AlertDescription>
                  </div>
                </Alert>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Column 1: Predicted Resistances & Recommended */}
                <div className="space-y-6">
                  
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-l-4 border-l-red-500 shadow-lg rounded-2xl overflow-hidden">
                      <div className="bg-red-50/50 p-4 border-b border-red-100 flex items-center font-bold text-red-700">
                        <ShieldAlert className="w-5 h-5 mr-2" /> Predicted Resistant
                      </div>
                      <CardContent className="p-6">
                        <ul className="space-y-3">
                          {result.predicted_resistant.map((med, i) => (
                            <motion.li 
                              key={i} 
                              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (i * 0.1) }}
                              className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100"
                            >
                              <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
                              {med}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="border-l-4 border-l-emerald-500 shadow-lg rounded-2xl overflow-hidden">
                      <div className="bg-emerald-50/50 p-4 border-b border-emerald-100 flex items-center font-bold text-emerald-700">
                        <CheckCircle className="w-5 h-5 mr-2" /> Recommended Agents
                      </div>
                      <CardContent className="p-6">
                        <ul className="space-y-3">
                          {result.recommended_susceptible.map((med, i) => (
                            <motion.li 
                              key={i} 
                              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (i * 0.1) }}
                              className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100"
                            >
                              <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                              {med}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>

                </div>

                {/* Column 2: Visualizations */}
                <div className="space-y-6">
                  
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                     <Card className="shadow-lg rounded-2xl">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                        <CardTitle className="text-lg">Key Resistance Drivers</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[260px] w-full pt-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.feature_importance} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={100} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20} animationDuration={1500}>
                              {analytics.feature_importance.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#94a3b8'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                     <Card className="shadow-lg rounded-2xl relative overflow-hidden">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                        <CardTitle className="text-lg">Resistance Network</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[280px] w-full flex items-center justify-center relative bg-slate-50/30">
                        <div className="relative w-full h-full max-w-sm mx-auto flex items-center justify-center">
                          
                          {/* Center Node */}
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.6 }}
                            className="absolute z-20"
                          >
                            <div className="h-24 w-24 rounded-full bg-blue-100 border-4 border-white shadow-[0_0_20px_rgba(59,130,246,0.2)] flex flex-col items-center justify-center text-center p-2 text-xs font-bold text-blue-900 relative">
                               <Bug className="w-8 h-8 text-blue-500 mb-1" />
                               <span className="truncate w-full">{analytics.network.nodes[0].label}</span>
                            </div>
                          </motion.div>

                          {/* Edges and Outer Nodes */}
                          <div className="absolute inset-0">
                            {analytics.network.edges.map((edge, index) => {
                                const isResistant = edge.value === "resistant";
                                const totalEdges = analytics.network.edges.length;
                                const angle = (index * (360 / totalEdges)) * (Math.PI / 180);
                                const radius = 100; // px
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;
                                const targetNode = analytics.network.nodes.find(n => n.id === edge.target);

                                return (
                                  <React.Fragment key={index}>
                                    <motion.svg 
                                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + (index * 0.1) }}
                                      className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: 0 }}
                                    >
                                      <line 
                                        x1="50%" y1="50%" x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`} 
                                        stroke={isResistant ? "#ef4444" : "#10b981"} strokeWidth="2" strokeDasharray={isResistant ? "0" : "4 4"} className="opacity-40"
                                      />
                                    </motion.svg>

                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 1 + (index * 0.1) }}
                                      className="absolute"
                                      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)', zIndex: 10 }}
                                    >
                                      <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md border ${
                                        isResistant ? "bg-white text-red-700 border-red-200" : "bg-white text-emerald-700 border-emerald-200"
                                      }`}>
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                          <Pill className={`w-3.5 h-3.5 ${isResistant ? "text-red-500" : "text-emerald-500"}`} />
                                          {targetNode?.label}
                                        </div>
                                      </div>
                                    </motion.div>
                                  </React.Fragment>
                                )
                            })}
                          </div>

                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}

export default App;
