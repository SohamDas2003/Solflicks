"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	ChevronDown,
	ChevronUp,
	LayoutDashboard,
	Package,
	Tag,
	FolderOpen,
	BookOpen,
	UserCircle,
	Play,
} from "lucide-react";

interface SectionHeaderProps {
	title: string;
	collapsed?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, collapsed }) => {
	if (collapsed) return null;

	return (
		<div className="px-1 py-2 mt-4 mb-2">
			<p className="text-[11px] font-medium text-white/70 uppercase tracking-wider">
				{title}
			</p>
		</div>
	);
};

interface SidebarItemProps {
	title: string;
	icon?: React.ReactNode;
	href?: string;
	subItems?: Array<{
		title: string;
		href?: string;
		subItems?: Array<{ title: string; href: string }>;
	}>;
	level?: number;
	collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
	title,
	icon,
	href,
	subItems,
	level = 0,
	collapsed,
}) => {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const hasSubItems = subItems && subItems.length > 0;

	// Check if current path matches this item's href exactly
	const isActive = pathname === href;

	// Check if any subitem's path matches current path
	const hasActiveChild =
		hasSubItems &&
		subItems.some(
			(item) =>
				pathname === item.href ||
				item.subItems?.some((subItem) => pathname === subItem.href)
		);

	// Open dropdown if child is active on initial render
	React.useEffect(() => {
		if (hasActiveChild) {
			setIsOpen(true);
		}
	}, [hasActiveChild]);

	// When collapsed, only show top-level items with icons
	if (collapsed && level > 0) return null;

	const renderItem = () => {
		if (hasSubItems) {
			return (
				<button
					onClick={() => setIsOpen(!isOpen)}
					className={`flex items-center font-[400] justify-between w-full px-4 py-2 text-left rounded-md transition-all duration-200 ease-in-out text-[14px] group
            ${hasActiveChild ? "bg-[#FE0201]/90" : "hover:bg-[#0D325F]"}`}
					title={collapsed ? title : undefined}>
					<div className="flex items-center space-x-3">
						{level > 0 && (
							<span
								className={`w-1 h-1 rounded-full transition-colors duration-200 ${
									hasActiveChild
										? "bg-white"
										: "bg-white/70 group-hover:bg-white"
								}`}></span>
						)}
						{icon && (
							<span
								className={`transition-colors duration-200 ${
									hasActiveChild
										? "text-white"
										: "text-white/80 group-hover:text-white"
								}`}>
								{icon}
							</span>
						)}
						{!collapsed && (
							<span
								className={`transition-colors duration-200 ${
									hasActiveChild
										? "text-white"
										: "text-white/80 group-hover:text-white"
								}`}>
								{title}
							</span>
						)}
					</div>
					{!collapsed &&
						(isOpen ? (
							<ChevronUp
								size={14}
								className={`transition-colors duration-200 ${
									hasActiveChild
										? "text-white"
										: "text-white/70 group-hover:text-white"
								}`}
							/>
						) : (
							<ChevronDown
								size={14}
								className={`transition-colors duration-200 ${
									hasActiveChild
										? "text-white"
										: "text-white/70 group-hover:text-white"
								}`}
							/>
						))}
				</button>
			);
		} else {
			return (
				<Link
					href={href || "#"}
					className={`flex items-center space-x-3 px-4 py-2 rounded-md transition-colors text-[14px] group
            ${
							isActive && level === 0 ? "bg-[#FE0201]/90" : "hover:bg-[#0D325F]"
						}`}
					title={collapsed ? title : undefined}>
					{level > 0 && !collapsed && (
						<span
							className={`w-1 h-1 rounded-full ${
								isActive ? "bg-white" : "bg-white/70 group-hover:bg-white"
							}`}></span>
					)}
					{icon && (
						<span
							className={`${
								isActive ? "text-white" : "text-white/80 group-hover:text-white"
							}`}>
							{icon}
						</span>
					)}
					{!collapsed && (
						<span
							className={`${
								isActive ? "text-white" : "text-white/80 group-hover:text-white"
							}`}>
							{title}
						</span>
					)}
				</Link>
			);
		}
	};

	return (
		<div className="mb-1">
			{renderItem()}
			{!collapsed && (
				<AnimatePresence>
					{isOpen && hasSubItems && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="overflow-hidden ml-3">
							<div className="pl-1 mt-1">
								{subItems.map((item, index) => (
									<SidebarItem
										key={index}
										title={item.title}
										href={item.href}
										subItems={item.subItems}
										level={level + 1}
										collapsed={collapsed}
									/>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			)}
		</div>
	);
};

interface SidebarProps {
	collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
	return (
		<aside
			className={`h-screen bg-[#163F7A] border-r border-[#0D325F] shadow-sm custom-scrollbar transition-all duration-300 ${
				collapsed ? "w-16" : "w-64"
			}`}>
			<div className="py-10 pt-10 px-2 border-b border-[#0D325F]">
				<div
					className={`flex items-center ${
						collapsed ? "justify-center" : "justify-center"
					}`}>
					{collapsed ? (
						<div className="h-6 w-6 flex items-center justify-center">
							<span className="text-white text-xs font-bold">SF</span>
						</div>
					) : (
						<div className="h-8 flex items-center">
							<span className="text-white font-bold text-lg">
								Solflicks Filmwork
							</span>
						</div>
					)}
				</div>
			</div>

			<nav
				className={`p-3 ${
					collapsed ? "px-2" : "px-3"
				} overflow-y-auto h-[calc(100vh-64px)]`}>
				<SectionHeader
					title="Menu"
					collapsed={collapsed}
				/>
				<SidebarItem
					title="Dashboard"
					icon={<LayoutDashboard size={16} />}
					href="/dashboard"
					collapsed={collapsed}
				/>
				<SectionHeader
					title="Film Management"
					collapsed={collapsed}
				/>{" "}
				<SidebarItem
					title="Films"
					icon={<Package size={16} />}
					subItems={[
						{ title: "All Films", href: "/dashboard/films" },
						{ title: "Add Films", href: "/dashboard/films/add" },
					]}
					collapsed={collapsed}
				/>
				<SectionHeader
					title="Series Management"
					collapsed={collapsed}
				/>
				<SidebarItem
					title="Series"
					icon={<Play size={16} />}
					subItems={[
						{ title: "All Series", href: "/dashboard/series" },
						{ title: "Add Series", href: "/dashboard/series/add" },
					]}
					collapsed={collapsed}
				/>
				{/* Blog Management Section */}
				<SectionHeader
					title="Blog Management"
					collapsed={collapsed}
				/>
				<SidebarItem
					title="Blog Posts"
					icon={<BookOpen size={16} />}
					subItems={[
						{ title: "All Posts", href: "/dashboard/blogs" },
						{ title: "Create New Post", href: "/dashboard/blogs/new" },
					]}
					collapsed={collapsed}
				/>{" "}
				<SidebarItem
					title="Categories"
					icon={<FolderOpen size={16} />}
					href="/dashboard/categories"
					collapsed={collapsed}
				/>
				<SidebarItem
					title="Tags"
					icon={<Tag size={16} />}
					href="/dashboard/tags"
					collapsed={collapsed}
				/>
				<SidebarItem
					title="Authors"
					icon={<UserCircle size={16} />}
					href="/dashboard/authors"
					collapsed={collapsed}
				/>
			</nav>
		</aside>
	);
};

export default Sidebar;
