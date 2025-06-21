import React from "react";
import SeriesBanner from "../Components/series-ui/SeriesBanner";
import AllSeries from "../Components/series-ui/AllSeries";
import Footer from "../Components/Footer";

function page() {
	return (
		<div>
			<SeriesBanner title={"Series"} />
			<AllSeries />
			<Footer />
		</div>
	);
}

export default page;
