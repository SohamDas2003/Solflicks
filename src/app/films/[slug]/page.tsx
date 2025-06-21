import FilmSlugBanner from "@/app/Components/films-ui/FilmSlugBanner";
import Recommendation from "@/app/Components/films-ui/Recommendation";
import Footer from "@/app/Components/Footer";
import React from "react";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

function page({ params }: PageProps) {
	const resolvedParams = React.use(params);
	return (
		<>
			<FilmSlugBanner slug={resolvedParams.slug} />
			<Recommendation currentSlug={resolvedParams.slug} />
			<Footer />
		</>
	);
}

export default page;
