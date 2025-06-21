import React from 'react'
import { Navbar } from '../Components/navbar'
import AboutBanner from '../Components/behind-the-scene-ui/AboutBanner'
import Moments from '../Components/behind-the-scene-ui/Moments'
import VideoSection from '../Components/behind-the-scene-ui/VideoSection'
import CrewAction from '../Components/behind-the-scene-ui/crewAction'
import Footer from '../Components/Footer'

function page() {
  return (
    <div>
      <Navbar/>
      <AboutBanner/>
      <Moments/>
      <VideoSection/>
      <CrewAction/>
      <Footer/>
    </div>
  )
}

export default page
