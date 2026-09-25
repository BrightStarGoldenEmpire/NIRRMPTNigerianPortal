export interface LeadershipMember {
  id: string;
  name: string;
  title: string;
  directorate: string;
  bio: string;
  image: string;
}

export const leadershipData: LeadershipMember[] = [
  {
    id: "dir-01",
    name: "Dr. Emmanuel Okafor",
    title: "Director General & CEO",
    directorate: "Executive Directorate",
    bio: "Leading statutory resource management policies, regional development frameworks, and strategic technological alignment nationwide.",
    image: "/assets/images/placeholder.jpg",
  },
  {
    id: "dir-02",
    name: "Engr. Amina Abubakar",
    title: "Director of Environmental Protection Tech",
    directorate: "Resource Protection",
    bio: "Overseeing deployment of real-time monitoring technology and eco-restoration protocols across federal zones.",
    image: "/assets/images/placeholder.jpg",
  },
];