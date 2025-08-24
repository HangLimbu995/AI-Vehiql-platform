"use client";

import { cn } from "@/lib/utils";
import { Calendar, Car, Cog, LayoutDashboard, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";

// Nabigation items
const routes = [
	{
		label: "Dashboard",
		icon: LayoutDashboard,
		href: "/admin",
	},
	{
		label: "Cars",
		icon: Car,
		href: "/admin/cars",
	},
	{
		label: "Test Drives",
		icon: Calendar,
		href: "/admin/test-drives",
	},
	{
		label: "Settings",
		icon: Cog,
		href: "/admin/settings",
	},
];

const Sidebar = ({ mobile = false }) => {
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(false);

	const items = useMemo(() => routes, []);

	// determine the best (longest) matching route so parent routes ("/admin")
	// are not incorrectly marked active when a deeper child route matches.
	const activeHref = useMemo(() => {
		if (!pathname) return null;
		let best = null;
		for (const r of items) {
			const href = r.href;
			if (pathname === href || pathname.startsWith(href + "/")) {
				if (!best || href.length > best.length) best = href;
			}
		}
		return best;
	}, [items, pathname]);

	// Mobile bottom bar
	if (mobile) {
		return (
			<nav
				role="navigation"
				aria-label="Admin bottom navigation"
				data-component="admin-bottom-nav"
				className="fixed inset-x-4 bottom-4 z-50 md:hidden"
			>
				<ul
					className="flex items-center justify-between bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 px-3 py-2"
					data-ai="admin-bottom-list"
				>
					{items.map((route) => {
						// use best-match instead of naive startsWith to avoid multiple active items
						const active = activeHref === route.href;

						return (
							<li key={route.href} className="flex-1 text-center">
								<Link
									href={route.href}
									title={route.label}
									aria-current={active ? "page" : undefined}
									className={cn(
										"inline-flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-colors",
										active
											? "text-blue-600"
											: "text-slate-600 hover:text-slate-800"
									)}
									data-route={route.href}
								>
									<route.icon
										className={cn(
											"h-5 w-5 transition-colors",
											active ? "text-blue-600" : "text-slate-500"
										)}
										aria-hidden="true"
									/>
									<span
										className={cn(
											"text-[10px] leading-none mt-0.5",
											"sr-only"
										)}
									>
										{route.label}
									</span>

									{/* active dot */}
									<span
										aria-hidden="true"
										className={cn(
											"mt-1 h-1.5 w-1.5 rounded-full transition-opacity",
											active
												? "bg-blue-500 opacity-100"
												: "bg-transparent opacity-0"
										)}
									/>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		);
	}

	// Desktop / sidebar
	return (
		<>
			<nav
				role="navigation"
				aria-label="Admin sidebar"
				className={cn(
					"flex flex-col bg-white border-r border-slate-100 shadow-sm transition-all h-full",
					collapsed ? "w-16" : "w-64"
				)}
				data-component="admin-sidebar"
			>
				<div className="flex items-center justify-between px-3 py-3 border-b border-slate-100">
					<div className="flex items-center gap-2">
						<span
							className={cn(
								"text-lg font-bold tracking-tight",
								collapsed ? "sr-only" : "text-slate-800"
							)}
						>
							Admin
						</span>
					</div>

					<button
						type="button"
						aria-pressed={collapsed}
						aria-label={
							collapsed ? "Expand sidebar" : "Collapse sidebar"
						}
						onClick={() => setCollapsed((s) => !s)}
						className="p-2 rounded-md hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
						title={collapsed ? "Expand" : "Collapse"}
					>
						<Menu className="h-4 w-4 text-slate-600" />
					</button>
				</div>

				<ul className="flex-1 overflow-auto py-4 px-2 space-y-1">
					{items.map((route) => {
						// only the best matching href is active
						const active = activeHref === route.href;

						return (
							<li key={route.href} className="px-1">
								<Link
									href={route.href}
									title={route.label}
									data-ai="sidebar-link"
									data-route={route.href}
									aria-current={active ? "page" : undefined}
									className={cn(
										"group flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
										active
											? "bg-gradient-to-r from-blue-50 to-white text-blue-700 shadow-sm"
											: "text-slate-600 hover:bg-slate-100"
									)}
								>
									<route.icon
										className={cn(
											"h-4 w-4 flex-none transition-colors",
											active
												? "text-blue-600"
												: "text-slate-500 group-hover:text-slate-700"
										)}
										aria-hidden="true"
									/>
									<span
										className={cn(
											"truncate",
											collapsed ? "sr-only" : "block"
										)}
									>
										{route.label}
									</span>

									{/* Visual active indicator for quick scanning */}
									<span
										aria-hidden="true"
										className={cn(
											"ml-auto h-2 w-2 rounded-full",
											active ? "bg-blue-500" : "bg-transparent"
										)}
									/>
								</Link>
							</li>
						);
					})}
				</ul>

				<div className="px-3 py-3 border-t border-slate-100">
					{/* Helper / status block */}
					<div
						className={cn(
							"text-xs text-slate-500",
							collapsed ? "sr-only" : ""
						)}
					>
						Signed in as{" "}
						<span className="font-medium text-slate-700">Admin</span>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Sidebar;
