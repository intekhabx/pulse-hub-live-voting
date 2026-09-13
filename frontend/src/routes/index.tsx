import { createFileRoute } from '@tanstack/react-router'
import Hero from '../components/HeroSection'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import { Pricing } from '../components/Pricing'
import AboutUs from '../components/AboutUs'
import Contact from '../components/Contact'


export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {

  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <AboutUs />
      <Contact />
    </div>
  )
}