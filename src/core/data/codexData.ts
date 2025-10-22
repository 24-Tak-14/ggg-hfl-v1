import { CodexEntry } from '../../types';

// This file contains the lore and mechanical explanations for the ZORI Codex.
export const CODEX_DATA: CodexEntry[] = [
    {
        id: 'enuma-elish',
        title: 'The Enuma Elish Doctrine',
        description: 'The foundational myth of the HFL. It posits that every play is a reenactment of the cosmic battle between Tiamat (primordial chaos) and Marduk (divine order). The outcome is never certain, merely a temporary victory for one force over the other.',
        relatedConcepts: ['Apzu & Tiama\'at', 'Marduk\'s Order']
    },
    {
        id: 'apzu-tiamaat',
        title: 'Apzu & Tiama\'at: The Duality',
        description: 'Apzu represents pure, calculated execution and order. Tiama\'at represents raw, unpredictable chaos and potential. A player\'s Apzu Execution Score reflects their consistency, while their Tiama\'at Chaos Rating reflects their ability to create game-changing, unpredictable plays.',
        relatedConcepts: ['Tiamat\'s Chaos', 'Marduk\'s Order']
    },
    {
        id: 'tiamat-chaos',
        title: 'Tiamat\'s Chaos Dice',
        description: 'A gameplay mechanic where a high Tiama\'at rating can cause dice to "split" or "erupt," creating additional rolls or unpredictable modifiers. This represents the abyssal, untamable nature of chaos, capable of both catastrophic failure and miraculous success.',
        relatedConcepts: ['Enuma Elish Doctrine', 'Apzu & Tiama\'at']
    },
    {
        id: 'marduk-order',
        title: 'Marduk\'s Order',
        description: 'Represents the imposition of divine will upon chaos. In gameplay, this translates to a player\'s ability to execute a play as designed. A high Apzu score reflects Marduk\'s influence, leading to consistent and reliable outcomes.',
        relatedConcepts: ['Enuma Elish Doctrine', 'Apzu & Tiama\'at']
    },
    {
        id: 'anu-sky',
        title: 'Anu\'s Sky Events',
        description: 'Random, league-wide events that can affect a game\'s conditions. These "heavenly decrees" from the Sky-Father Anu can grant temporary buffs or introduce new challenges, forcing teams to adapt their strategies on the fly.',
        relatedConcepts: ['Enuma Elish Doctrine']
    },
    {
        id: 'zori-tier',
        title: 'The ZORI Tier',
        description: 'The highest and most mysterious tier of rarity. ZORI-tier players are said to have transcended the duality of Apzu and Tiama\'at, embodying a perfect, harmonious synthesis of order and chaos. They are the Übermenschen of the HFL.',
        relatedConcepts: ['Apzu & Tiama\'at']
    }
];
