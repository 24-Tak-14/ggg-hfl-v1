import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { TEAMS } from '../src/core/data/TeamData';
import { PLAYERS } from '../src/core/data/PlayerData';
import PlayerCard from './PlayerCard';
import { Team, Player } from '../types';
import { ArrowLeft, Newspaper, Users, Shield, Loader2, AlertTriangle, Trophy, Building, Globe } from 'lucide-react';

interface TeamDetailViewProps {
    teamId: string;
    onBack: () => void;
}

const TeamDetailView: React.FC<TeamDetailViewProps> = ({ teamId, onBack }) => {
    const [news, setNews] = useState<string[]>([]);
    const [isLoadingNews, setIsLoadingNews] = useState(true);
    const [newsError, setNewsError] = useState<string | null>(null);
    
    // Find the selected team and their roster from the static data files.
    const team = useMemo(() => TEAMS.find(t => t.id === teamId), [teamId]);
    const roster = useMemo(() => PLAYERS.filter(p => p.teamId === teamId).sort((a,b) => b.overall - a.overall), [teamId]);

    // Fetch dynamic news headlines when the component mounts or the teamId changes.
    useEffect(() => {
        if (!team) return;

        const fetchNews = async () => {
            setIsLoadingNews(true);
            setNewsError(null);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const prompt = `You are a zealous HFL sports reporter. Generate 3 dramatic and engaging news headlines for the ${team.city} ${team.name}. Their current record is ${team.wins}-${team.losses}. They are known for their '${team.offensive_playbook}' offense and '${team.defensive_playbook}' defense. They have won ${team.mega_chalices} championships. Make the headlines short, punchy, and under 15 words.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                headlines: {
                                    type: Type.ARRAY,
                                    description: "A list of 3 short, punchy news headlines about the specified team.",
                                    items: { type: Type.STRING },
                                }
                            },
                            required: ['headlines'],
                        },
                    },
                });

                const content = JSON.parse(response.text);
                setNews(content.headlines);
            } catch (e) {
                console.error(`Failed to fetch news for ${team.name}:`, e);
                setNewsError("Could not fetch the latest team buzz.");
            } finally {
                setIsLoadingNews(false);
            }
        };

        fetchNews();
    }, [team]);

    if (!team) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl text-red-400">Team Not Found</h2>
                <button onClick={onBack} className="mt-4 bg-amber-400 text-stone-900 font-bold py-2 px-6 rounded-md hover:bg-amber-300">
                    Back to League
                </button>
            </div>
        );
    }
    
    // A reusable card component for the detail view layout.
    const InfoCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode, className?: string }> = ({ icon: Icon, title, children, className }) => (
        <div className={`bg-stone-800/50 p-6 rounded-lg ring-1 ring-stone-700 ${className}`}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon className="w-6 h-6 text-amber-400" />
                {title}
            </h2>
            {children}
        </div>
    );

    return (
        <div>
            {/* Header section with back button and team identification */}
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-800 transition-colors mr-4">
                    <ArrowLeft className="w-6 h-6 text-stone-300" />
                </button>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-amber-400">{team.city} {team.name}</h1>
                    <p className="text-stone-400 font-semibold">{team.wins}-{team.losses}-{team.ties}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Team Info & News */}
                <div className="lg:col-span-1 space-y-6">
                    <InfoCard icon={Shield} title="Team Intel">
                        <ul className="space-y-2 text-sm text-stone-300">
                            <li className="flex justify-between"><strong>Conference:</strong> <span className="font-semibold text-white">{team.conference}</span></li>
                            <li className="flex justify-between"><strong>Division:</strong> <span className="font-semibold text-white">{team.division}</span></li>
                            <li className="flex justify-between items-center"><strong>Mega Chalices:</strong> <span className="flex items-center gap-1 font-bold text-amber-300">{team.mega_chalices} <Trophy className="w-4 h-4" /></span></li>
                        </ul>
                    </InfoCard>

                    <InfoCard icon={Building} title="Venue & Market">
                        <ul className="space-y-2 text-sm text-stone-300">
                            <li className="flex justify-between"><strong>Stadium:</strong> <span className="font-semibold text-white">{team.stadium.name}</span></li>
                            <li className="flex justify-between"><strong>Capacity:</strong> <span className="font-semibold text-white">{team.stadium.capacity.toLocaleString()}</span></li>
                            <li className="flex justify-between"><strong>Market:</strong> <span className="font-semibold text-white">{team.media_market}</span></li>
                        </ul>
                    </InfoCard>

                    <InfoCard icon={Newspaper} title="Team News">
                         {isLoadingNews ? (
                            <div className="flex items-center justify-center h-full text-stone-400">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : newsError ? (
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertTriangle className="w-5 h-5" />
                                <p>{newsError}</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {news.map((headline, index) => (
                                    <li key={index} className="text-stone-300 text-sm border-l-2 border-stone-600 pl-3 leading-tight animate-fade-in-fast">{headline}</li>
                                ))}
                            </ul>
                        )}
                    </InfoCard>
                </div>

                {/* Right Column: Team Roster */}
                <div className="lg:col-span-2">
                    <InfoCard icon={Users} title="Roster" className="h-full">
                         {roster.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[80vh] overflow-y-auto pr-2">
                                {roster.map(player => (
                                    <PlayerCard key={player.id} player={player} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-10">
                                <p className="text-stone-500">This team has no players on its roster.</p>
                            </div>
                        )}
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default TeamDetailView;