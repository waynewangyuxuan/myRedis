import { Card, CardContent } from "@/components/ui/card"
import InteractiveCard from "@/components/animations/interactive-card"
import { skillCategories } from "@/constants/skills"
import CustomFontText from "@/components/animations/custom-font-text"

export default function SkillsSection() {
  return (
    <section id="skills" className="py-20">
      <div className="container px-4 md:px-6">
        <CustomFontText
          text="My Skills"
          className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
          interval={1500}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => (
            <InteractiveCard key={index}>
              <Card className="overflow-hidden h-full border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <category.icon className="h-8 w-8 mb-2 text-primary" />
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
