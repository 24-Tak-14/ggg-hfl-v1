// FIX: Corrected the import statement to properly import `useState` from React.
import React, { useState } from 'react';
import GameSim from './components/GameSim';
import PressConferenceView from './components/PressConferenceView';
import LeagueView from './components/LeagueView';
import MyTeamView from './components/MyTeamView';
import DraftView from './components/DraftView';
import FrontOfficeView from './components/FrontOfficeView';
import FoundryView from './components/FoundryView';
import DashboardView from './components/DashboardView'; // Import the new DashboardView
import FreeAgencyView from './components/FreeAgencyView'; // Import the new FreeAgencyView
import FantasyView from './components/FantasyView'; // Import the new FantasyView
import TeamDetailView from './components/TeamDetailView'; // Import the new TeamDetailView
import DesignSuiteView from './components/DesignSuiteView'; // Import the new DesignSuiteView
import MedicalBayView from './components/MedicalBayView'; // Import the new MedicalBayView

// Define the different views available in the application.
type View = 'dashboard' | 'game' | 'league' | 'team' | 'draft' | 'freeagency' | 'foundry' | 'medical' | 'fantasy' | 'frontoffice' | 'press' | 'team-detail' | 'design';

// Main application shell with a sidebar for navigation.
const App: React.FC = () => {
    // FIX: Replaced `aistudio.useState` with the standard `useState` hook.
    // Set 'dashboard' as the default view.
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [detailViewTeamId, setDetailViewTeamId] = useState<string | null>(null);

    const handleNavigateToTeamDetail = (teamId: string) => {
        setDetailViewTeamId(teamId);
        setActiveView('team-detail');
    };

    // Renders the active component based on the current view state.
    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardView setActiveView={setActiveView} />;
            case 'game':
                return <GameSim />;
            case 'press':
                return <PressConferenceView />;
            case 'league':
                return <LeagueView onSelectTeam={handleNavigateToTeamDetail} />;
            case 'team':
                return <MyTeamView />;
            case 'draft':
                return <DraftView />;
            case 'frontoffice':
                return <FrontOfficeView />;
            case 'foundry':
                return <FoundryView />;
            case 'freeagency':
                return <FreeAgencyView />;
            case 'fantasy':
                return <FantasyView />;
             case 'design':
                return <DesignSuiteView />;
            case 'medical':
                return <MedicalBayView />;
            case 'team-detail':
                 if (!detailViewTeamId) {
                    // If we somehow get here without an ID, go back to league view
                    return <LeagueView onSelectTeam={handleNavigateToTeamDetail} />;
                }
                return <TeamDetailView teamId={detailViewTeamId} onBack={() => setActiveView('league')} />;
            // Other views mentioned by the user are included as placeholders for future development.
            default:
                return (
                    <div className="p-8 text-center bg-stone-800/50 rounded-lg">
                        <h2 className="text-2xl font-bold text-amber-400">View Not Implemented</h2>
                        <p className="text-stone-400 mt-2">The '{activeView}' view is under construction.</p>
                    </div>
                );
        }
    };

    // Navigation items for the sidebar.
    const navItems: { id: View, label: string }[] = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'game', label: 'Game Sim' },
        { id: 'league', label: 'League' },
        { id: 'team', label: 'My Team' },
        { id: 'press', label: 'Press Conference' },
        { id: 'draft', label: 'Draft' },
        { id: 'frontoffice', label: 'Front Office' },
        { id: 'freeagency', label: 'Free Agency' },
        { id: 'foundry', label: 'Foundry' },
        { id: 'design', label: 'Design Suite' },
        { id: 'medical', label: 'Medical Bay' },
        { id: 'fantasy', label: 'Daily Fantasy' },
    ];
    
    return (
        <div className="flex min-h-screen bg-stone-900 text-stone-200 font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-56 bg-stone-950/50 p-4 flex flex-col border-r border-stone-800">
                <h1 className="text-3xl font-bold text-amber-400 text-center mb-8 tracking-wider">HFL</h1>
                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (
                         <button 
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-md font-semibold transition-colors text-sm ${
                                activeView === item.id 
                                ? 'bg-amber-400 text-stone-900' 
                                : 'text-stone-300 hover:bg-stone-800'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>
            {/* Main Content Area */}
            <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};

export default App;