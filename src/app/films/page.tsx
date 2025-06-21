import React from 'react'
import FilmBanner from '../Components/films-ui/FilmBanner'
import AllFilms from '../Components/films-ui/AllFilms'
import Footer from '../Components/Footer'

function page() {
  return (
    <div>
      <FilmBanner title={"Films"} />
      <AllFilms />
      <Footer />
    </div>
  )
}

export default page
