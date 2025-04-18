import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import CustomScrambleText from "./custom-scramble-text"
import InteractiveCard from "./interactive-card"

export default function Projects() {
  const projects = [
    {
      title: "Project One",
      description: "A responsive e-commerce website built with Next.js and Tailwind CSS.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Next.js", "React", "Tailwind CSS", "Stripe"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      title: "Project Two",
      description: "A social media dashboard with dark mode toggle and data visualization.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["React", "Chart.js", "CSS Modules", "REST API"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      title: "Project Three",
      description: "A task management application with drag and drop functionality.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["TypeScript", "React", "Redux", "Firebase"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
  ]

  return (
    <section id="projects" className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <CustomScrambleText
          text="My Projects"
          className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
          hoverToLoop={true}
          loopDelay={2}
        />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <InteractiveCard key={index}>
              <Card className="overflow-hidden h-full border-2 hover:border-primary/50 transition-colors">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="mb-4 text-muted-foreground">{project.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </a>
                    </Button>
                    <Button asChild size="sm">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
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
