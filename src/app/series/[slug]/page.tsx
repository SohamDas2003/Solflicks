import SeriesSlugBanner from "@/app/Components/series-ui/SeriesSlugBanner";
import SeriesRecommendation from "@/app/Components/series-ui/SeriesRecommendation";
import Footer from "@/app/Components/Footer";
import React from "react";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

function Page({ params }: PageProps) {
	const resolvedParams = React.use(params);
	return (
		<>
			<SeriesSlugBanner slug={resolvedParams.slug} />
			<SeriesRecommendation currentSlug={resolvedParams.slug} />
			<Footer />
		</>
	);
}

export default Page;
