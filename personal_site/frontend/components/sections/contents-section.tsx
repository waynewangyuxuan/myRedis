import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import InteractiveCard from "@/components/animations/interactive-card"
import CustomFontText from "@/components/animations/custom-font-text"
import { contentItems } from "@/constants/contents"

export default function ContentsSection() {
  // Map content types to colors
  const typeColors: Record<string, string> = {
    Article: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Video: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Podcast: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Tutorial: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  }

  return (
    <section id="contents" className="py-20">
      <div className="container px-4 md:px-6">
        <CustomFontText
          text="My Contents"
          className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
          interval={1500}
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {contentItems.map((item, index) => (
            <InteractiveCard key={index}>
              <Card className="overflow-hidden h-full border-2 hover:border-primary/50 transition-colors">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={typeColors[item.type] || "bg-gray-100 text-gray-800"}>{item.type}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
                  <p className="mb-4 text-muted-foreground line-clamp-3">{item.description}</p>
                  <Button asChild variant="default" size="sm">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Read More
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </InteractiveCard>
          ))}
        </div>
      </div>
    </section>
  )
}
