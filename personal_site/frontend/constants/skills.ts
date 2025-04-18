import { Code, Figma, Database, Globe, Server, Smartphone } from "lucide-react"

export const skillCategories = [
  {
    title: "Frontend",
    icon: Code,
    skills: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Backend",
    icon: Server,
    skills: ["Node.js", "Express", "REST API", "GraphQL", "Authentication"],
  },
  {
    title: "Database",
    icon: Database,
    skills: ["MongoDB", "PostgreSQL", "MySQL", "Prisma", "Supabase"],
  },
  {
    title: "Design",
    icon: Figma,
    skills: ["Figma", "Adobe XD", "UI/UX", "Responsive Design", "Wireframing"],
  },
  {
    title: "Other",
    icon: Globe,
    skills: ["Git", "GitHub", "CI/CD", "Testing", "Performance Optimization"],
  },
  {
    title: "Mobile",
    icon: Smartphone,
    skills: ["React Native", "Progressive Web Apps", "Mobile-First Design"],
  },
]
