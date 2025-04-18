export type ContentItem = {
  title: string
  description: string
  date: string
  type: "Article" | "Video" | "Podcast" | "Tutorial"
  link: string
  image: string
}

export const contentItems: ContentItem[] = [
  {
    title: "Building Responsive Layouts with Tailwind CSS",
    description: "Learn how to create beautiful, responsive layouts using Tailwind CSS utility classes.",
    date: "June 15, 2023",
    type: "Article",
    link: "https://example.com/article1",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Getting Started with React Hooks",
    description: "A comprehensive guide to understanding and implementing React Hooks in your projects.",
    date: "April 22, 2023",
    type: "Tutorial",
    link: "https://example.com/article2",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "The Future of Web Development",
    description: "Exploring emerging technologies and trends that will shape the future of web development.",
    date: "March 10, 2023",
    type: "Podcast",
    link: "https://example.com/podcast1",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Building a Full-Stack App with Next.js",
    description: "Step-by-step tutorial on creating a full-stack application using Next.js, Prisma, and PostgreSQL.",
    date: "February 5, 2023",
    type: "Video",
    link: "https://example.com/video1",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Optimizing Website Performance",
    description: "Tips and techniques to improve your website's loading speed and overall performance.",
    date: "January 18, 2023",
    type: "Article",
    link: "https://example.com/article3",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Mastering CSS Grid Layout",
    description: "Deep dive into CSS Grid and how to create complex layouts with ease.",
    date: "December 7, 2022",
    type: "Tutorial",
    link: "https://example.com/article4",
    image: "/placeholder.svg?height=400&width=600",
  },
]
