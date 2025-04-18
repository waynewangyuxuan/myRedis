import { Card, CardContent } from "@/components/ui/card"
import { Code, Figma, Database, Globe, Server, Smartphone } from "lucide-react"
import CustomScrambleText from "./custom-scramble-text"
import InteractiveCard from "./interactive-card"

export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      icon: <Code className="h-8 w-8 mb-2 text-primary" />,
      skills: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
    },
    {
      title: "Backend",
      icon: <Server className="h-8 w-8 mb-2 text-primary" />,
      skills: ["Node.js", "Express", "REST API", "GraphQL", "Authentication"],
    },
    {
      title: "Database",
      icon: <Database className="h-8 w-8 mb-2 text-primary" />,
      skills: ["MongoDB", "PostgreSQL", "MySQL", "Prisma", "Supabase"],
    },
    {
      title: "Design",
      icon: <Figma className="h-8 w-8 mb-2 text-primary" />,
      skills: ["Figma", "Adobe XD", "UI/UX", "Responsive Design", "Wireframing"],
    },
    {
      title: "Other",
      icon: <Globe className="h-8 w-8 mb-2 text-primary" />,
      skills: ["Git", "GitHub", "CI/CD", "Testing", "Performance Optimization"],
    },
    {
      title: "Mobile",
      icon: <Smartphone className="h-8 w-8 mb-2 text-primary" />,
      skills: ["React Native", "Progressive Web Apps", "Mobile-First Design"],
    },
  ]

  return (
    <section id="skills" className="py-20">
      <div className="container px-4 md:px-6">
        <CustomScrambleText
          text="My Skills"
          className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
          hoverToLoop={true}
          loopDelay={2}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => (
            <InteractiveCard key={index}>
              <Card className="overflow-hidden h-full border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    {category.icon}
                    <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.skills.map((skill, skillIndex) => (
                        <li key={skillIndex}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </InteractiveCard>
          ))}
        </div>
      </div>
    </section>
  )
}
