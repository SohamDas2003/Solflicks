import React from "react";
import Banner from "../Components/contact-ui/Banner";
import ContactUs from "../Components/contact-ui/ContactUs";
import { Navbar } from "../Components/navbar";
import Footer from "../Components/Footer";

export default function ContactPage() {
	return (
		<>
			<div>
				<Navbar />
				<Banner>
					<ContactUs />
				</Banner>
				<div className="h-[88vh] m:h-[650px] md:h-[700px] lg:h-[450px] xl:h-[460px] bg-[#FAF7EF]"></div>
			</div>
			<Footer />
		</>
	);
}
