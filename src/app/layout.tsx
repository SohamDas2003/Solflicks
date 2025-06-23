import ScrollManager from "./utils/ScrollManager";
import CustomCursor from "./Components/CustomCursor";
import "./globals.css";
import { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import NavbarWrapper from "./Components/NavbarWrapper";

export const metadata: Metadata = {
	title: "Solflicks Filmwork",
	description: "Professional filmmaking and video production services",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link
					rel="stylesheet"
					href="https://api.fontshare.com/v2/css?f[]=clash-display@300,400,500&display=swap"
				/>
			</head>
			<body>
				{" "}
				<AuthProvider>
					<ScrollManager>
						{/* <CustomCursor /> */}
						<NavbarWrapper />
						<main>{children}</main>
					</ScrollManager>
					<ToastContainer />
					<Toaster />
				</AuthProvider>
			</body>
		</html>
	);
}
