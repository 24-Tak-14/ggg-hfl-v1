// Defines the structure for a single staff member role.
export interface StaffMember {
  department: 'Front Office' | 'Scouting';
  role: string;
  description: string;
}

// Contains the data for the team's front office and scouting personnel.
export const FRONT_OFFICE_STAFF: StaffMember[] = [
  {
    department: 'Front Office',
    role: 'General Manager (GM)',
    description: 'Oversees the entire Front Office. Has the final say on all player personnel decisions, including draft picks, free agent acquisitions, and contract negotiations. Sets long-term roster strategy and talent pipeline development.',
  },
  {
    department: 'Front Office',
    role: 'Assistant Manager (AM)',
    description: 'Assists the GM by working closely with the Scouting Department. Gathers and compiles info that helps the GM\'s player personnel decisions.',
  },
  {
    department: 'Front Office',
    role: 'Executive VP of Football Operations',
    description: 'Supervisor and liaison for player development, coaching oversight, and scouting departments. Implements and maintains team alignment with league-wide policies to avoid penalization and maintain high morale.',
  },
  {
    department: 'Front Office',
    role: 'Football Operational Administrative Lawyer (F.O.A.L.)',
    description: 'Manages administrative functions across football operations and coordinates cross-functional support (legal, HR, finance) for football initiatives.',
  },
   {
    department: 'Front Office',
    role: 'Senior VP of Football Business Strategy',
    description: 'Develops and executes business strategies for revenue growth and brand expansion. Oversees sponsorship, partnerships, and business analytics initiatives.',
  },
  {
    department: 'Front Office',
    role: 'VP of Player Engagement',
    description: 'Enhances player relations through programs focusing on wellness, community outreach, and professional development. Acts as a liaison between players and the front office.',
  },
  {
    department: 'Front Office',
    role: 'VP of Game Operations',
    description: 'Oversees logistics and execution of game-day operations, including staffing, facilities, and event coordination.',
  },
  {
    department: 'Front Office',
    role: 'Chief Marketing Officer (CMO)',
    description: 'Leads team branding, marketing campaigns, and promotional activities. Develops merchandising strategies and digital engagement initiatives.',
  },
   {
    department: 'Front Office',
    role: 'Sales Manager',
    description: 'Drives ticket sales, corporate partnerships, and sponsorship revenue. Manages sales teams and implements revenue optimization tactics.',
  },
  {
    department: 'Scouting',
    role: 'Director of Player Personnel',
    description: 'Manages current HFL player contracts, extensions, and free agency. Scouts opposing rosters for potential acquisitions and trade targets.',
  },
  {
    department: 'Scouting',
    role: 'Director of College Scouting',
    description: 'Leads the college scouting team. Responsible for creating a reliable draft board according to the GM\'s strategy, evaluating collegiate talent, and finalizing draft rankings.',
  },
];