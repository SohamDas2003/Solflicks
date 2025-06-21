import React from 'react'
import { Navbar } from './Components/navbar';
import HeroSection from './Components/hero-section';
import AboutSection from './Components/about';
import FeaturedShow from './Components/FeaturedShow';
import BehindScene from './Components/behindScene';
import BehindSceneAbout from './Components/behindSceneAbout';
import OurTeams from './Components/OurTeams';
import ScrollingStrip from './Components/ScrollingStrip';
import star2 from "../../public/image/Star2.svg"
import Lastestblog from './Components/Lastestblog';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
function page() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturedShow />
      <BehindScene />
      <BehindSceneAbout />
      <ScrollingStrip starIcon={star2} />
      <OurTeams />
      <Lastestblog />
      <Contact/>
      <Footer/>
    </div>
  )
}
export default page
