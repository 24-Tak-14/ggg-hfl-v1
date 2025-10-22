import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { PLAYERS } from '../src/core/data/PlayerData';
import { MEDICAL_STAFF } from '../src/core/data/MedicalStaffData';
import { Player } from '../types';
import { HeartPulse, Stethoscope, BrainCircuit, Loader2, AlertTriangle, FileText } from 'lucide-react';

// Defines the structure for the AI's diagnostic response.
interface Diagnosis {
    preliminary_diagnosis: string;
    recommended_action_plan: string[];
    estimated_recovery_timeline: string;
}

const MedicalBayView: React.FC = () => {
    const [scenario, setScenario] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    // Memoize the list of injured players to prevent re-filtering on every render.
    const injuredPlayers = useMemo(() => {
        return PLAYERS.filter(p => p.injury && p.injury.duration > 0);
    }, []);

    const handleGetDiagnosis = async () => {
        if (!scenario.trim()) {
            setError("Please describe an injury scenario.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setDiagnosis(null);

        try {
            const prompt = `You are an expert HFL (Heart Football League) Team Physician. You are calm, analytical, and professional. Analyze the following on-field injury report and provide a preliminary assessment.

**Injury Scenario:** "${scenario}"

**Your Task:**
Respond ONLY with a JSON object. Do not include any text or markdown formatting outside of the JSON object. Your response must follow this exact schema.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            preliminary_diagnosis: {
                                type: Type.STRING,
                                description: "A likely preliminary diagnosis based on the scenario. Start with the most probable injury type (e.g., 'Possible ACL Sprain')."
                            },
                            recommended_action_plan: {
                                type: Type.ARRAY,
                                description: "A bulleted list of immediate, concrete next steps for the on-site medical team (e.g., 'Immobilize the joint', 'Apply ice immediately').",
                                items: { type: Type.STRING }
                            },
                            estimated_recovery_timeline: {
                                type: Type.STRING,
                                description: "A cautious, broad estimate of the potential recovery timeline (e.g., '2-4 weeks for minor sprains, up to 9 months if surgery is required')."
                            }
                        },
                        required: ['preliminary_diagnosis', 'recommended_action_plan', 'estimated_recovery_timeline'],
                    },
                },
            });

            setDiagnosis(JSON.parse(response.text));

        } catch (e: any) {
            console.error("Diagnosis failed:", e);
            setError(`Failed to get diagnosis. ${e.message || 'An unknown error occurred.'}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2">Medical Bay</h1>
            <p className="text-stone-400 mb-6">Monitor player health, review medical staff, and analyze injury reports.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Reports and Staff */}
                <div className="space-y-8">
                    {/* Injury Report */}
                    <div className="bg-stone-800/50 p-6 rounded-lg ring-1 ring-stone-700">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><HeartPulse className="text-red-400" /> Injury Report</h2>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {injuredPlayers.length > 0 ? injuredPlayers.map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-stone-900/50 p-3 rounded-md">
                                    <div>
                                        <p className="font-semibold text-stone-200">{p.name} <span className="text-xs text-stone-400">({p.position})</span></p>
                                        <p className="text-sm text-red-400">{p.injury?.type}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-stone-300">Out: {p.injury?.duration} {p.injury?.duration === 1 ? 'week' : 'weeks'}</p>
                                </div>
                            )) : <p className="text-stone-500 italic text-center py-4">No players are currently injured.</p>}
                        </div>
                    </div>

                    {/* Medical Staff */}
                    <div className="bg-stone-800/50 p-6 rounded-lg ring-1 ring-stone-700">
                         <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Stethoscope className="text-cyan-400" /> Medical Staff</h2>
                         <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {MEDICAL_STAFF.map(staff => (
                                <div key={staff.role} className="bg-stone-900/50 p-3 rounded-md">
                                    <h3 className="font-bold text-cyan-300">{staff.role}</h3>
                                    <ul className="list-disc list-inside text-sm text-stone-400 pl-2 mt-1">
                                        {staff.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                                    </ul>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                {/* Right Column: AI Diagnostician */}
                <div className="bg-stone-800/50 p-6 rounded-lg ring-1 ring-stone-700">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><BrainCircuit className="text-amber-400" /> AI Diagnostician</h2>
                    <p className="text-sm text-stone-400 mb-4">Describe a hypothetical injury scenario to get a preliminary analysis from our AI team physician. For informational purposes only.</p>
                    
                    <textarea
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        placeholder="e.g., 'Our star WR planted his foot to cut and his knee buckled. He went down immediately and is holding his knee.'"
                        className="w-full bg-stone-900 border border-stone-700 rounded-md p-3 text-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all h-32"
                    />
                    <button onClick={handleGetDiagnosis} disabled={isLoading} className="mt-4 w-full bg-amber-400 text-stone-900 font-bold py-3 px-6 rounded-lg transition hover:bg-amber-300 disabled:opacity-50 flex items-center justify-center">
                        {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <FileText className="w-5 h-5 mr-2" />}
                        {isLoading ? 'Analyzing...' : 'Get Diagnosis'}
                    </button>

                    {error && (
                        <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-semibold">{error}</span>
                        </div>
                    )}

                    {diagnosis && (
                        <div className="mt-6 space-y-4 animate-fade-in-fast">
                            <div>
                                <h3 className="font-bold text-amber-400">Preliminary Diagnosis:</h3>
                                <p className="text-stone-300">{diagnosis.preliminary_diagnosis}</p>
                            </div>
                             <div>
                                <h3 className="font-bold text-amber-400">Action Plan:</h3>
                                <ul className="list-disc list-inside text-stone-300 pl-2">
                                    {diagnosis.recommended_action_plan.map((action, i) => <li key={i}>{action}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h3 className="font-bold text-amber-400">Recovery Timeline:</h3>
                                <p className="text-stone-300">{diagnosis.estimated_recovery_timeline}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalBayView;