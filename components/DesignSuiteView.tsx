import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Loader2, AlertTriangle } from 'lucide-react';

// --- Data for the Design Suite ---
// This data is specifically crafted for this component with detailed image generation prompts.

interface DesignSuiteTeam {
    id: string;
    name: string;
    city: string;
    colors: string[];
    allegiance: string;
    playbook: string;
    logo_primary_prompt: string;
    logo_secondary_prompt: string;
    helmet_home_prompt: string;
    helmet_spirit_chief_prompt: string;
    uniform_home_prompt: string;
    uniform_away_prompt: string;
    uniform_alt1_prompt: string;
    uniform_alt2_prompt: string;
    merch_caps_prompt: string;
    merch_jackets_prompt: string;
    merch_tees_prompt: string;
    venue_stadium_prompt: string;
    venue_city_map_prompt: string;
    venue_jumbotron_prompt: (message: string) => string;
}

const DESIGN_SUITE_TEAMS: DesignSuiteTeam[] = [
    {
        id: "gu_bare_giants",
        name: "Gu'Bare Giants",
        city: "Gu'Bare",
        colors: ["Matte Orange", "Black", "Off-White"],
        allegiance: "NorthEastern/Soul",
        playbook: "4-3 Balanced Run",
        logo_primary_prompt: "A colossal, metallic giant's fist crushing a digital orb, set against a matte black background with matte orange lightning bolts. The colors are Matte Orange, Black, and Off-White. Incorporate subtle Pha/Wee'lng geometric patterns. Highly detailed, modern, intimidating, professional sports logo, photorealistic, 8k.",
        logo_secondary_prompt: "A geometric, stylized letter 'G' shield logo for the Gu'Bare Giants. The design uses interlocking Matte Orange and Black lines, with a single Off-White accent border. Minimalist, modern, suitable for helmet decal, professional sports logo, 8k.",
        helmet_home_prompt: "A professional football helmet for the Gu'Bare Giants. The shell is **Matte Orange** with a single bold Black center stripe. The facemask is Black. The primary team logo is prominently displayed on both sides. Cinematic studio shot, high detail, photorealistic.",
        helmet_spirit_chief_prompt: "A special edition 'Spirit Chief Doctrine' football helmet for the Gu'Bare Giants. The shell is a deep **Electric Blue** with a flowing Matte Orange flame pattern rising from the back. The facemask is Black. It features a glowing, subtle **Spirit Chief Doctrine** decal on one side. High contrast, neon lighting, cinematic studio shot, photorealistic.",
        uniform_home_prompt: "A highly detailed professional football uniform for the Gu'Bare Giants. **HOME UNIFORM**. Dominant color Black, secondary Matte Orange, accents Off-White. The **JERSEY** is Black with bold Matte Orange sleeve stripes and Off-White numbers. The **PANTS** are Matte Orange. Sci-fi elements: Incorporate subtle Pha/Wee'lng geometric patterns. Isolated on a futuristic sports studio background, 8k.",
        uniform_away_prompt: "A highly detailed professional football uniform for the Gu'Bare Giants. **AWAY UNIFORM**. Dominant color Off-White, secondary Matte Orange, accents Black. The **JERSEY** is Off-White with Matte Orange shoulder yokes and Black numbers. The **PANTS** are Black. Sci-fi elements: Subtle Pha/Wee'lng patterns. Isolated on a futuristic sports studio background, 8k.",
        uniform_alt1_prompt: "A highly detailed professional football uniform for the Gu'Bare Giants. **ALTERNATE UNIFORM 1**. Full **Matte Orange** color rush look. The jersey and pants are all Matte Orange with Black numbers and trim. The design is sleek and minimalist. Isolated on a dark sports studio background, 8k.",
        uniform_alt2_prompt: "A highly detailed professional football uniform for the Gu'Bare Giants. **ALTERNATE UNIFORM 2 (THROWBACK/LEGACY)**. Dominant color **Gray/Steel**, secondary Black, accents Off-White. Features classic, thick shoulder stripes. Isolated on a dark sports studio background, 8k.",
        merch_caps_prompt: "A display featuring two premium hats for the Gu'Bare Giants. One is a thick, cuffed **Knit Cap** in Black with a Matte Orange stripe and a small, embroidered primary logo. The second is a structured **Baseball Cap** in Matte Orange with the secondary 'G' logo embroidered in Off-White. Apparel product shot, high detail, studio lighting, 8k.",
        merch_jackets_prompt: "A display featuring two jackets for the Gu'Bare Giants. One is a sleek, Black **Bomber Jacket** with Matte Orange interior lining and the primary logo patch. The second is a technical, Black **Parker Jacket** with minimalist Matte Orange accents and the secondary logo on the sleeve. Apparel product shot, high detail, studio lighting, 8k.",
        merch_tees_prompt: "A collection of three different graphic t-shirts for the Gu'Bare Giants. Tee 1: A Black tee with a large, stylized 'GIANTS' wordmark. Tee 2: An Off-White tee featuring a vintage-inspired sketch of the giant's fist. Tee 3: A Matte Orange tee with a geometric Pha/Wee'lng pattern print. Apparel product shots, high detail, studio lighting, 8k.",
        venue_stadium_prompt: "A massive, futuristic sports stadium for the Gu'Bare Giants called 'The Soul Nexus'. The stadium is built into a cliff face and features glowing Matte Orange light ribbons that wrap around a matte black superstructure. The roof is retractable and made of smart glass. Architectural rendering, cinematic lighting, photorealistic.",
        venue_city_map_prompt: "A stylized, futuristic, top-down city map of Gu'Bare, the home city of the Giants. The map should highlight the location of 'The Soul Nexus' stadium with a glowing Matte Orange marker. The map uses Black, Gray, and Matte Orange colors. Sci-fi aesthetic, detailed rendering, 8k.",
        venue_jumbotron_prompt: (message) => `A highly detailed, massive Jumbotron screen inside 'The Soul Nexus' stadium showing the Gu'Bare Giants playing a football game. The screen must prominently display the text: "${message}". The surrounding stadium is lit with Matte Orange and Black lights. Cinematic view from the stands, photorealistic, 8k.`
    },
    {
        id: "brandontolia_barristers",
        name: "Brandontolia Barristers",
        city: "Brandontolia",
        colors: ["Gold", "Matte Black", "White"],
        allegiance: "SouthWestern/Power",
        playbook: "Power I Offense, 2-4 Defense",
        logo_primary_prompt: "A sophisticated and powerful professional sports logo for the Brandontolia Barristers. The design features a stylized, sharp 'B' integrated with a powerful, golden gavel. The colors are Gold, Matte Black, and White. The logo evokes law, precision, and power. Modern, geometric, intimidating, professional sports logo, photorealistic, 8k.",
        logo_secondary_prompt: "An icon logo for the Brandontolia Barristers featuring a stylized, minimalist Gold scale of justice symbol. The design is clean, geometric, and modern, suitable for helmet decal. Colors: Gold, Matte Black, and White. Professional sports logo, 8k.",
        helmet_home_prompt: "A professional football helmet for the Brandontolia Barristers. The shell is **Gloss Black** with a bold Gold center stripe. The facemask is Matte Black. The secondary scale of justice logo is prominently displayed on both sides. Cinematic studio shot, high detail, photorealistic.",
        helmet_spirit_chief_prompt: "A special edition 'Spirit Chief Doctrine' football helmet for the Brandontolia Barristers. The shell is a shimmering **Matte White** with Gold metallic accents that form sharp, angular lines. The facemask is Gold. It features a unique, powerful **Spirit Chief Doctrine** decal on one side. High contrast, sharp lighting, cinematic studio shot, photorealistic.",
        uniform_home_prompt: "A professional football uniform for the Brandontolia Barristers. **HOME UNIFORM**. Dominant color Matte Black, secondary Gold, accents White. The **JERSEY** is Matte Black with Gold sleeve stripes and White numbers. The **PANTS** are Gold. Sci-fi elements: Incorporate subtle legal codex script patterns. Isolated on a futuristic sports studio background, 8k.",
        uniform_away_prompt: "A professional football uniform for the Brandontolia Barristers. **AWAY UNIFORM**. Dominant color White, secondary Gold, accents Matte Black. The **JERSEY** is White with Gold shoulder stripes and Matte Black numbers. The **PANTS** are White. Sci-fi elements: Subtle legal codex script patterns. Isolated on a futuristic sports studio background, 8k.",
        uniform_alt1_prompt: "A professional football uniform for the Brandontolia Barristers. **ALTERNATE UNIFORM 1**. Full **Gold** color rush look. The jersey and pants are all Gold with Matte Black numbers and trim. Isolated on a dark sports studio background, 8k.",
        uniform_alt2_prompt: "A professional football uniform for the Brandontolia Barristers. **ALTERNATE UNIFORM 2 (THROWBACK/LEGACY)**. Dominant color **Gray/Charcoal**, secondary Matte Black, accents Gold. Features classic, thick horizontal striping on the sleeves. Isolated on a dark sports studio background, 8k.",
        merch_caps_prompt: "A display featuring two premium hats for the Brandontolia Barristers. One is a thick, cuffed **Knit Cap** in Matte Black with a Gold stripe and a small, embroidered secondary logo. The second is a structured **Baseball Cap** in White with the primary 'Gavel B' logo embroidered in Gold and Black. Apparel product shot, high detail, studio lighting, 8k.",
        merch_jackets_prompt: "A display featuring two jackets for the Brandontolia Barristers. One is a light, Gold **Bomber Jacket** with Matte Black accents and the secondary logo patch. The second is a heavy, White **Parker Jacket** with minimalist Gold piping and the primary logo on the chest. Apparel product shot, high detail, studio lighting, 8k.",
        merch_tees_prompt: "A collection of three different graphic t-shirts for the Brandontolia Barristers. Tee 1: A Matte Black tee with a large, stylized 'BARRISTERS' wordmark. Tee 2: A White tee featuring a geometric design based on the scale of justice. Tee 3: A Gold tee with an abstract legal codex script print. Apparel product shots, high detail, studio lighting, 8k.",
        venue_stadium_prompt: "A modernist, sleek sports stadium for the Brandontolia Barristers called 'The Legal Citadel'. The structure is primarily White and Gold, resembling a powerful, stylized courthouse with sharp, precise angles. Architectural rendering, exterior view at sunset, photorealistic.",
        venue_city_map_prompt: "A highly precise, organized, grid-like city map of Brandontolia, the home city of the Barristers. The map should highlight 'The Legal Citadel' stadium with a powerful Gold marker. The map uses White, Gray, and Gold colors. Architectural, clean aesthetic, detailed rendering, 8k.",
        venue_jumbotron_prompt: (message) => `A highly detailed, massive Jumbotron screen inside 'The Legal Citadel' stadium showing the Brandontolia Barristers playing a football game. The screen must prominently display the text: "${message}". The surrounding stadium is lit with Gold and Matte Black lights. Cinematic view from the stands, photorealistic, 8k.`
    }
];

type Tab = 'core-identity' | 'uniforms' | 'merch' | 'venue-doctrine';

const DesignSuiteView: React.FC = () => {
    const [selectedTeamId, setSelectedTeamId] = useState<string>(DESIGN_SUITE_TEAMS[0].id);
    const [activeTab, setActiveTab] = useState<Tab>('core-identity');
    const [jumbotronText, setJumbotronText] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('Select a team and a tab to access concept generation features.');
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    const selectedTeam = useMemo(() => DESIGN_SUITE_TEAMS.find(t => t.id === selectedTeamId)!, [selectedTeamId]);

    const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTeamId(e.target.value);
        setGeneratedImage(null);
        setError(null);
        setStatusMessage('Ready to generate concepts across the ZORI Nexus Doctrine tabs.');
    };

    const generateImage = async (conceptType: keyof DesignSuiteTeam) => {
        if (!selectedTeam) return;

        let prompt: string;
        const conceptName = conceptType.replace(/_/g, ' ').toUpperCase();

        if (conceptType === 'venue_jumbotron_prompt') {
            if (!jumbotronText.trim()) {
                setStatusMessage("INPUT REQUIRED: Please enter the message/score for the Jumbotron before generating.");
                setError("Jumbotron text cannot be empty.");
                return;
            }
            prompt = selectedTeam.venue_jumbotron_prompt(jumbotronText);
        } else {
             const promptOrFn = selectedTeam[conceptType];
             if (typeof promptOrFn !== 'string') {
                 setError(`Error: No prompt defined for ${conceptType}.`);
                 return;
             }
             prompt = promptOrFn;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        setStatusMessage(`Processing ZORI Doctrine Concept: ${conceptName} for ${selectedTeam.name}...`);

        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: '1:1', // Default, can be customized per-prompt if needed
                },
            });

            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setGeneratedImage(imageUrl);
            setStatusMessage('');
        } catch (e: any) {
            console.error("Image generation failed:", e);
            const errorMessage = `Image generation failed. Error: ${e.message}. Check console for details.`;
            setError(errorMessage);
            setStatusMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getHexColor = (colorName: string) => {
        const lowerCaseColor = colorName.toLowerCase();
        const COLOR_MAP: { [key: string]: string } = {
          'black': '#1E1E1E', 'white': '#FFFFFF', 'off-white': '#F5F5F5', 'gold': '#FFD700',
          'matte black': '#242424', 'matte orange': '#F97316', 'electric blue': '#7DF9FF',
        };
        return COLOR_MAP[lowerCaseColor] || '#CCCCCC'; // Default gray
    };

    const TabButton: React.FC<{ tabId: Tab; label: string }> = ({ tabId, label }) => (
         <button 
            className={`tab-btn ${activeTab === tabId ? 'active' : ''}`} 
            onClick={() => setActiveTab(tabId)}
        >
            {label}
        </button>
    );

    const GeneratorButton: React.FC<{ concept: keyof DesignSuiteTeam; label: string }> = ({ concept, label }) => (
        <button
            onClick={() => generateImage(concept)}
            className="generator-btn p-4 text-lg"
            disabled={isLoading}
        >
            {label}
        </button>
    );

    return (
        <div className="nexus-bg -m-6 sm:-m-8 lg:-m-10 p-4 sm:p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-6xl header-text mb-2">HFL Design Suite // ZORI NEXUS</h1>
                    <p className="text-xl text-gray-400">Spirit Chief Foundry Debut Edition (Imagen 4.0)</p>
                </header>

                <div className="card p-6 rounded-xl mb-6">
                    <h3 className="text-2xl font-bold mb-4 text-white">1. Select HFL Team Data Hub</h3>
                    <select id="team-select" value={selectedTeamId} onChange={handleTeamChange} className="w-full p-3 rounded-lg bg-[#0d0a27] border border-[#00ffff] text-white focus:ring-[#00ffff] focus:border-[#00ffff]">
                        {DESIGN_SUITE_TEAMS.map(team => (
                            <option key={team.id} value={team.id}>{team.city} {team.name}</option>
                        ))}
                    </select>
                    
                    <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                        <h4 className="text-3xl font-bold mb-2 text-white">{selectedTeam.city} {selectedTeam.name}</h4>
                        <p className="text-lg mb-1 flex items-center">
                            {selectedTeam.colors.map(color => (
                                <span key={color} className="color-swatch" style={{ backgroundColor: getHexColor(color) }} title={color}></span>
                            ))}
                            {selectedTeam.colors.join(' / ')}
                        </p>
                        <p className="text-md mb-1"><strong className="text-gray-400">Allegiance:</strong> {selectedTeam.allegiance}</p>
                        <p className="text-md"><strong className="text-gray-400">Playbook:</strong> {selectedTeam.playbook}</p>
                    </div>
                </div>

                <div className="card rounded-xl mb-6">
                    <div className="flex border-b border-[#00ffff]">
                        <TabButton tabId="core-identity" label="I. Core Identity" />
                        <TabButton tabId="uniforms" label="II. Uniforms" />
                        <TabButton tabId="merch" label="III. Merch" />
                        <TabButton tabId="venue-doctrine" label="IV. Venue & Doctrine" />
                    </div>
                    <div className="p-6">
                        {activeTab === 'core-identity' && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <GeneratorButton concept="logo_primary_prompt" label="1. Primary Logo" />
                                <GeneratorButton concept="logo_secondary_prompt" label="2. Secondary Logo" />
                                <GeneratorButton concept="helmet_home_prompt" label="3. Home Helmet" />
                                <GeneratorButton concept="helmet_spirit_chief_prompt" label="4. Spirit Chief Helmet" />
                            </div>
                        )}
                        {activeTab === 'uniforms' && (
                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <GeneratorButton concept="uniform_home_prompt" label="1. Home Uniform" />
                                <GeneratorButton concept="uniform_away_prompt" label="2. Away Uniform" />
                                <GeneratorButton concept="uniform_alt1_prompt" label="3. Alternate 1" />
                                <GeneratorButton concept="uniform_alt2_prompt" label="4. Alternate 2" />
                            </div>
                        )}
                        {activeTab === 'merch' && (
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <GeneratorButton concept="merch_caps_prompt" label="1. Caps (Knit & Base)" />
                                <GeneratorButton concept="merch_jackets_prompt" label="2. Jackets" />
                                <GeneratorButton concept="merch_tees_prompt" label="3. Graphic T-Shirts (x3)" />
                            </div>
                        )}
                        {activeTab === 'venue-doctrine' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <GeneratorButton concept="venue_stadium_prompt" label="1. Stadium Design" />
                                    <GeneratorButton concept="venue_city_map_prompt" label="2. Team City Map" />
                                </div>
                                <h4 className="text-xl font-bold mt-4 text-white border-t border-gray-700 pt-4">Jumbotron Creator (ZORI Doctrine)</h4>
                                <input type="text" value={jumbotronText} onChange={e => setJumbotronText(e.target.value)} placeholder="Enter Jumbotron message (e.g., GIANT'S WIN! SCORE: 44-17)" className="w-full p-3 rounded-lg bg-[#0d0a27] border border-[#00ffff] text-white focus:ring-[#00ffff] focus:border-[#00ffff]" />
                                <button onClick={() => generateImage('venue_jumbotron_prompt')} className="generator-btn p-4 w-full text-lg" disabled={isLoading}>3. Generate Jumbotron Concept</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card p-6 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4 text-white">2. Generated Output</h3>
                    <div className="min-h-[400px] flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden relative aspect-square">
                        {isLoading && (
                            <div className="text-center text-gray-300">
                                <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#00ffff]" />
                                <p className="mt-4 font-semibold">Generating Concept...</p>
                                <p className="text-sm text-gray-400 max-w-sm mx-auto">{statusMessage}</p>
                            </div>
                        )}
                        {error && !isLoading && (
                            <div className="text-center text-red-400 p-4">
                                <AlertTriangle className="w-12 h-12 mx-auto" />
                                <p className="mt-4 font-semibold">Generation Failed</p>
                                <p className="text-xs text-red-300 mt-1">{statusMessage}</p>
                            </div>
                        )}
                        {generatedImage && !isLoading && (
                            <img src={generatedImage} className="w-full h-full object-contain" alt="Generated Concept" />
                        )}
                        {!isLoading && !error && !generatedImage && (
                            <p className="text-gray-500">{statusMessage}</p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Inject component-specific styles */}
            <StyleInjector />
        </div>
    );
};

// A helper component to inject styles into the document head.
const StyleInjector: React.FC = () => {
    useEffect(() => {
        const styleId = 'design-suite-styles';
        if (document.getElementById(styleId)) return; // Avoid adding styles multiple times

        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .header-text { color: #00ffff; text-shadow: 0 0 8px rgba(0, 255, 255, 0.5); }
            .card {
                background-color: rgba(26, 27, 95, 0.7);
                border: 2px solid #00ffff;
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
                backdrop-filter: blur(5px);
            }
            .color-swatch {
                width: 20px; height: 20px; border-radius: 9999px; border: 2px solid #ffffff;
                display: inline-block; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); margin-right: 8px;
            }
            .generator-btn {
                background-image: linear-gradient(45deg, #00ffff, #00bfff); color: #0d0a27;
                font-weight: 700; transition: all 0.15s ease-in-out; border-radius: 0.75rem;
            }
            .generator-btn:hover:not(:disabled) {
                transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 255, 255, 0.5);
            }
            .generator-btn:disabled {
                background-image: linear-gradient(45deg, #4b5563, #374151); cursor: not-allowed;
                opacity: 0.7; transform: none; box-shadow: none;
            }
            .tab-btn {
                padding: 1rem 1.5rem; font-weight: 700; transition: background-color 0.2s, color 0.2s, border-color 0.2s;
                border-bottom: 4px solid transparent;
            }
            .tab-btn.active {
                color: #00ffff; border-color: #00ffff; background-color: rgba(0, 255, 255, 0.05);
                text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
            }
            .tab-btn:hover { color: #ffffff; }
            .nexus-bg {
                background: linear-gradient(135deg, #1A1B5F 0%, #0d0a27 50%, #1A1B5F 100%);
                box-shadow: inset 0 0 100px rgba(0, 255, 255, 0.1);
            }
        `;
        document.head.appendChild(style);

        return () => {
            // Cleanup styles when the component unmounts
            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, []);

    return null;
};

export default DesignSuiteView;