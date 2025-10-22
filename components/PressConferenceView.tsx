import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { TEAMS } from '../src/core/data/TeamData';
import { Team } from '../types';
import { Mic, Newspaper, Zap, AlertTriangle, ChevronDown, Loader2 } from 'lucide-react';

// Define the structure for a single turn in the conversation.
interface ConversationTurn {
    question: string;
    answer?: string;
}

// Define the possible personalities for the AI journalist.
type JournalistPersonality = 'Analytical' | 'Sensationalist' | 'Investigative' | 'Standard';

// Define the structure for the AI journalist's profile.
interface JournalistProfile {
    name: string;
    publication: string;
    personality: JournalistPersonality;
}

// Define the structure for the generated media day content.
interface MediaDayContent {
    slogans: string[];
    headlines: string[];
    player_introductions: string[];
}

const PressConferenceView: React.FC = () => {
    // State management for the component
    const [isStarting, setIsStarting] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);
    const [isLoadingMedia, setIsLoadingMedia] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [activeConferenceTeam, setActiveConferenceTeam] = useState<Team | null>(null);
    const [conversation, setConversation] = useState<ConversationTurn[]>([]);
    const [userResponse, setUserResponse] = useState('');
    const [mediaContent, setMediaContent] = useState<MediaDayContent | null>(null);
    const [journalist, setJournalist] = useState<JournalistProfile | null>(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    /**
     * Handles API call errors, providing more specific feedback to the user.
     * @param e The error object caught.
     * @param context A string describing the action that failed (e.g., "start conference").
     */
    const handleApiError = (e: any, context: string) => {
        console.error(`Error during ${context}:`, e);
        let errorMessage = `Failed to ${context}. An unknown error occurred.`;
        if (e instanceof Error) {
            if (e.message.includes('API key not valid')) {
                errorMessage = `API Key is invalid. Please check your configuration.`;
            } else if (e.message.includes('fetch')) {
                errorMessage = `Network error. Could not connect to the AI service. Please check your internet connection.`;
            } else {
                errorMessage = `An unexpected error occurred while trying to ${context}. Please try again.`
            }
        }
        setError(errorMessage);
        setTimeout(() => setError(null), 7000); // Clear error after 7 seconds
    };
    
    /**
     * Starts a new press conference with the selected team.
     */
    const handleStartConference = async () => {
        if (!selectedTeamId) {
            setError("Please select a team to begin.");
            return;
        }

        setIsStarting(true);
        setError(null);
        setConversation([]);
        setMediaContent(null);
        setUserResponse('');

        const selectedTeam = TEAMS.find(t => t.id === selectedTeamId);
        if (!selectedTeam) {
            setError("Selected team not found.");
            setIsStarting(false);
            return;
        }
        setActiveConferenceTeam(selectedTeam);

        try {
            const personalities: JournalistPersonality[] = ['Analytical', 'Sensationalist', 'Investigative', 'Standard'];
            const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
            const newJournalist = { name: 'Ace Armstrong', publication: 'HFL Insider', personality: randomPersonality };
            setJournalist(newJournalist);

            const prompt = `You are ${newJournalist.name}, a sports journalist for ${newJournalist.publication} with an '${newJournalist.personality}' persona. Your questioning style MUST reflect this persona:
- **Analytical**: Focus on stats, strategy, playbooks, data, and efficiency. Be precise and logical.
- **Sensationalist**: Look for drama, controversy, emotional angles, and create bold headlines. Be provocative.
- **Investigative**: Dig for accountability, hidden details, challenge past decisions, and question authority. Be persistent.
- **Standard**: Ask balanced, fair, and conventional questions about the team's performance and outlook.

You are starting a press conference for the ${selectedTeam.city} ${selectedTeam.name}.
**Team Background:**
- **Media Market**: ${selectedTeam.media_market}
- **Championships (Mega Chalices)**: ${selectedTeam.mega_chalices}
- **Offensive Playbook**: ${selectedTeam.offensive_playbook}
- **Defensive Playbook**: ${selectedTeam.defensive_playbook}
            
Ask a single, challenging, and insightful opening question to the team's representative that perfectly embodies your persona.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setConversation([{ question: response.text }]);

        } catch (e) {
            handleApiError(e, 'start conference');
            setActiveConferenceTeam(null); // Reset on failure
        } finally {
            setIsStarting(false);
        }
    };
    
    /**
     * Submits the user's response and generates a context-aware follow-up question.
     */
    const handleSubmitResponse = async () => {
        if (!userResponse.trim()) return;

        setIsAnswering(true);
        setError(null);

        try {
            const currentTurn = conversation[conversation.length - 1];
            const updatedConversation: ConversationTurn[] = [...conversation.slice(0, -1), { ...currentTurn, answer: userResponse }];
            setConversation(updatedConversation);
            
            const history = updatedConversation.map(turn => `Journalist: ${turn.question}\nRepresentative: ${turn.answer ?? ''}`).join('\n\n');

            const prompt = `You are ${journalist?.name}, an '${journalist?.personality}' journalist, continuing your press conference with the ${activeConferenceTeam?.city} ${activeConferenceTeam?.name}.
**Your Persona**: Your questions MUST remain consistent with your '${journalist?.personality}' personality.
**Team Background**:
- Media Market: ${activeConferenceTeam?.media_market}
- Championships: ${activeConferenceTeam?.mega_chalices}
- Offense: ${activeConferenceTeam?.offensive_playbook}
- Defense: ${activeConferenceTeam?.defensive_playbook}

**Full Conversation History:**
${history}

**Your Task**: Based on the representative's LAST answer, the full conversation history, and the team's background, ask a single, sharp, and relevant follow-up question. Your question must stay in character and dig deeper into the topic.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setConversation(prev => [...prev, { question: response.text }]);
            setUserResponse('');

        } catch(e) {
            handleApiError(e, 'get follow-up question');
        } finally {
            setIsAnswering(false);
        }
    };

    /**
     * Generates team-specific media day content using a structured JSON response from the AI.
     */
    const handleGenerateMediaContent = async () => {
        if (!activeConferenceTeam) return;

        setIsLoadingMedia(true);
        setMediaContent(null);
        setError(null);
        
        try {
            const prompt = `Generate creative and engaging media day content for the '${activeConferenceTeam.name}', a professional football team from ${activeConferenceTeam.city}. 
            **Team Profile:**
            - **Colors**: ${activeConferenceTeam.colors.join(', ')}
            - **Championships (Mega Chalices)**: ${activeConferenceTeam.mega_chalices}
            - **Offensive Style**: '${activeConferenceTeam.offensive_playbook}'
            - **Defensive Style**: '${activeConferenceTeam.defensive_playbook}'
            - **Media Market**: '${activeConferenceTeam.media_market}'
            
            The tone must reflect their history and style. A team with many championships and an aggressive defense should have confident, powerful slogans. A struggling team in a small market might have underdog-themed content. Create a diverse and fitting set of content.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            slogans: {
                                type: Type.ARRAY,
                                description: "A list of 3 short, punchy team slogans that fit the team's profile.",
                                items: { type: Type.STRING },
                            },
                            headlines: {
                                type: Type.ARRAY,
                                description: "A list of 3 catchy newspaper headlines for a local paper, reflecting potential team stories.",
                                items: { type: Type.STRING },
                            },
                            player_introductions: {
                                type: Type.ARRAY,
                                description: "A list of 2 exciting, energetic stadium announcer-style introductions for key players.",
                                items: { type: Type.STRING },
                            },
                        },
                        required: ['slogans', 'headlines', 'player_introductions'],
                    },
                },
            });
            
            const content = JSON.parse(response.text);
            setMediaContent(content);

        } catch(e) {
            handleApiError(e, 'generate media content');
        } finally {
            setIsLoadingMedia(false);
        }
    };

    const isConferenceActive = activeConferenceTeam !== null;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2">Press Conference</h1>
            <p className="text-stone-400 mb-6">Face the media, represent your team, and control the narrative.</p>

            {/* Error Display Area */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg flex items-center gap-3 animate-fade-in-fast">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">{error}</span>
                </div>
            )}

            {!isConferenceActive ? (
                <div className="text-center p-8 bg-stone-800/50 rounded-lg space-y-4">
                    <h2 className="text-xl font-bold text-white">Select a Team to Begin</h2>
                    <div className="relative inline-block">
                         <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="appearance-none bg-stone-700 text-white font-semibold py-2.5 px-4 pr-8 rounded-lg cursor-pointer focus:ring-2 focus:ring-amber-400 focus:outline-none"
                        >
                            <option value="" disabled>-- Choose a Team --</option>
                            {TEAMS.map(team => (
                                <option key={team.id} value={team.id}>{team.city} {team.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-5 h-5 text-stone-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <button onClick={handleStartConference} disabled={isStarting || !selectedTeamId} className="bg-amber-400 text-stone-900 font-bold py-3 px-8 rounded-lg transition hover:bg-amber-300 disabled:opacity-50 flex items-center justify-center mx-auto">
                        {isStarting && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        {isStarting ? 'Starting...' : 'Start Press Conference'}
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Conference Section */}
                    <div className="p-6 bg-stone-800/50 rounded-lg ring-1 ring-stone-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Live with {journalist?.name}</h2>
                                <p className="text-sm text-amber-400">{journalist?.publication} ({journalist?.personality})</p>
                            </div>
                            <button onClick={() => setActiveConferenceTeam(null)} className="text-sm text-stone-400 hover:text-white transition">End Conference</button>
                        </div>

                        <div className="space-y-4 mb-6 min-h-[100px] border-l-2 border-amber-400/30 pl-4">
                            {conversation.map((turn, index) => (
                                <div key={index} className="animate-fade-in-fast">
                                    <p className="font-bold text-stone-300">Q: {turn.question}</p>
                                    {turn.answer && <p className="text-amber-300 pl-4">A: <span className="text-stone-200 italic">{turn.answer}</span></p>}
                                </div>
                            ))}
                        </div>

                        {isAnswering && (
                            <div className="flex items-center space-x-2 my-4 text-stone-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Journalist is preparing a follow-up...</span>
                            </div>
                        )}

                        {!isAnswering && conversation.length > 0 && conversation[conversation.length - 1]?.answer === undefined && (
                             <div className="mt-4">
                                <textarea
                                    value={userResponse}
                                    onChange={(e) => setUserResponse(e.target.value)}
                                    placeholder="Your response..."
                                    className="w-full bg-stone-900 border border-stone-700 rounded-md p-3 text-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
                                    rows={3}
                                />
                                <button onClick={handleSubmitResponse} disabled={isAnswering} className="mt-3 bg-amber-400 text-stone-900 font-semibold py-2 px-6 rounded-md hover:bg-amber-300 flex items-center">
                                    {isAnswering && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Submit Response
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Media Day Content Section */}
                    <div className="p-6 bg-stone-800/50 rounded-lg ring-1 ring-stone-700">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Newspaper /> Media Day Content</h2>
                            <button onClick={handleGenerateMediaContent} disabled={isLoadingMedia} className="bg-stone-700 text-white font-semibold py-2 px-5 rounded-md hover:bg-stone-600 disabled:opacity-50 flex items-center gap-2">
                                {isLoadingMedia ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                {isLoadingMedia ? 'Generating...' : 'Generate'}
                            </button>
                        </div>

                        {mediaContent ? (
                            <div className="space-y-4 animate-fade-in-fast">
                                <div>
                                    <h3 className="font-bold text-amber-400">Slogans:</h3>
                                    <ul className="list-disc list-inside text-stone-300 pl-2">
                                        {mediaContent.slogans.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                 <div>
                                    <h3 className="font-bold text-amber-400">Headlines:</h3>
                                     <ul className="list-disc list-inside text-stone-300 pl-2">
                                        {mediaContent.headlines.map((h, i) => <li key={i}>{h}</li>)}
                                    </ul>
                                </div>
                                 <div>
                                    <h3 className="font-bold text-amber-400">Player Intros:</h3>
                                     <ul className="list-disc list-inside text-stone-300 pl-2">
                                        {mediaContent.player_introductions.map((p, i) => <li key={i}>{p}</li>)}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <p className="text-stone-500 text-center py-4">Click "Generate" to create media content for the {activeConferenceTeam.name}.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeInFast {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-fast {
        animation: fadeInFast 0.5s ease-out forwards;
    }
`;
document.head.appendChild(style);

export default PressConferenceView;