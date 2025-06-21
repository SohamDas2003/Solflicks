import React from 'react'
import FeaturedBanner from '../Components/blog-ui/BlogBanner'
import AllBlogs from '../Components/blog-ui/AllBlogs'
import Footer from '../Components/Footer'

function page() {
  return (
    <div>
      <FeaturedBanner/>
      <AllBlogs/>
      <Footer/>
    </div>
  )
}

export default page

