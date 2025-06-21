import React from 'react'
import { Navbar } from '../Components/navbar'
import AboutBanner from '../Components/about-ui/AboutBanner'
import OurStory from '../Components/about-ui/OurStory'
import { CounterSection } from '../Components/about-ui/CounterSection'
import VideoSection from '../Components/about-ui/VideoSection'
import OurTeam from '../Components/about-ui/OurTeam'
import AboutContact from '../Components/about-ui/aboutContact'
import Footer from '../Components/Footer'


function page() {
  return (
    <div>
      <Navbar/>
      <AboutBanner/>
      <OurStory/>
      <CounterSection/>
      <VideoSection />
      <OurTeam />
     <AboutContact/>
     <Footer/>
    </div>
  )
}

export default page
