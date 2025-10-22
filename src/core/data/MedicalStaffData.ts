// Defines the structure for a single medical staff member.
export interface MedicalStaffMember {
  role: string;
  responsibilities: string[];
}

// Contains the data for the team's medical staff, extracted from user-provided documentation.
export const MEDICAL_STAFF: MedicalStaffMember[] = [
  {
    role: "Team Physician",
    responsibilities: [
      "Manage player care: routine, preventative, and urgent medical issues.",
      "Specialize in sports medicine and coordinate with other medical staff.",
    ],
  },
  {
    role: "Athletic Trainer",
    responsibilities: [
      "Provide on-field and in-clinic injury care and rehabilitation.",
      "Implement comprehensive injury prevention protocols.",
    ],
  },
  {
    role: "Physical Therapist",
    responsibilities: [
      "Develop and supervise individualized rehabilitation plans post-injury.",
      "Tailor recovery exercises to specific player and positional needs.",
    ],
  },
  {
    role: "Sports Scientist",
    responsibilities: [
      "Research performance optimization and injury prevention.",
      "Analyze training data to refine workout and recovery regimens.",
    ],
  },
  {
    role: "Behavioral Health Clinician",
    responsibilities: [
      "Provide mental health support and counseling to players.",
      "Address performance anxiety and build mental resilience.",
    ],
  },
  {
    role: "Nutritionist",
    responsibilities: [
      "Create personalized nutrition plans for peak performance and recovery.",
      "Adjust dietary strategies based on positional demands and player goals.",
    ],
  },
  {
    role: "Strength & Conditioning Coach",
    responsibilities: [
      "Design and implement strength and conditioning programs.",
      "Focus on developing power, endurance, and injury resilience.",
    ],
  },
];
