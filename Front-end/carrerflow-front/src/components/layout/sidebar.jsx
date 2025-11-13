import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Briefcase, PieChart, User, Settings, ChevronLeft, ChevronRight, LogOut, Menu, Search } from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/useAuth";

const links = [
	{ to: "/", label: "Dashboard", icon: Home },
	{ to: "/candidaturas", label: "Candidaturas", icon: Briefcase },
	{ to: "/analytics", label: "Analytics", icon: PieChart },
	{ to: "/profile", label: "Perfil", icon: User },
	{ to: "/settings", label: "Configurações", icon: Settings }
];

export default function Sidebar({ mobileOpen = false, onClose, collapsed = false, onToggleCollapsed }) {
	const { logout } = useAuth();

	React.useEffect(() => {
		if (!mobileOpen) return;
		function onKeyDown(e) {
			if (e.key === "Escape") {
				onClose && onClose();
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [mobileOpen, onClose]);

	return (
		<>
		{mobileOpen && (
			<div
				className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] transition-opacity duration-200 md:hidden"
				onClick={onClose}
			/>
		)}
		<aside 
			className={`
				relative z-40 flex-none w-0 ${collapsed ? 'md:w-20' : 'md:w-64'} md:static md:h-auto
			`}
		>
			<div
				className={`
					bg-[#f5f6f8] border-r border-gray-100 h-full flex flex-col
					fixed top-0 left-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-out w-[75vw] sm:w-[65vw] max-w-[360px] shadow-2xl rounded-r-2xl
					md:static md:translate-x-0 md:w-auto md:shadow-none md:rounded-none
				`}
			>
				<div className="p-4 border-b border-gray-200 relative min-h-[72px]">
					<div className="flex items-center gap-3 w-full px-2 md:hidden">
						<img src={logo} alt="Logo" className="w-16 h-16 object-contain"/>
					</div>
					<div className="hidden md:flex items-center w-full">
						{collapsed ? (
							<button
								onClick={onToggleCollapsed}
								className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/60 transition-colors"
								aria-label="Expandir menu"
								title="Expandir menu"
							>
								<Menu className="w-6 h-6 text-gray-700" />
							</button>
						) : (
							<div className="flex items-center gap-3 w-full px-2">
								<img src={logo} alt="Logo" className="w-16 h-16 object-contain"/>
							</div>
						)}
					</div>
				</div>

				<div className="px-4 pt-4">
					<div className="md:hidden relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar candidaturas, empresas..."
							aria-label="Buscar"
							className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-transparent"
						/>
					</div>
					<div className="hidden md:block">
						{collapsed ? (
							<button
								onClick={onToggleCollapsed}
								className="w-full flex items-center justify-center py-3 px-3 rounded-lg text-gray-600 hover:bg-white transition-colors"
								aria-label="Expandir busca"
								title="Buscar"
							>
								<Search className="w-5 h-5" />
							</button>
						) : (
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="text"
									placeholder="Buscar candidaturas, empresas..."
									aria-label="Buscar"
									className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-transparent"
								/>
							</div>
						)}
					</div>
				</div>

				<div className="hidden md:block">
					<button
						onClick={onToggleCollapsed}
						className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors shadow-md"
						aria-label="Alternar largura do menu"
						title="Alternar menu"
					>
						{collapsed ? (
							<ChevronRight className="w-4 h-4 text-gray-600" />
						) : (
							<ChevronLeft className="w-4 h-4 text-gray-600" />
						)}
					</button>
				</div>

				<nav className="flex-1 p-4 space-y-1">
					{links.map((link) => (
						<NavLink
							key={link.to}
							to={link.to}
							className={({ isActive }) =>
								`flex items-center ${collapsed ? 'md:justify-center' : 'md:gap-3'} gap-3 py-3 px-3 rounded-lg transition-all duration-200 group ${
									isActive 
										? "bg-white text-gray-900 shadow-sm" 
										: "text-gray-600 hover:bg-white"
								}`
							}
							title={collapsed ? link.label : ""}
						>
							<link.icon className="w-5 h-5 flex-shrink-0" />
							<span className={`font-medium text-sm tracking-tight ${collapsed ? 'md:hidden' : ''}`}>{link.label}</span>
						</NavLink>
					))}
				</nav>

				<div className="p-4 border-t border-gray-100">
					<button
						onClick={logout}
						className={`w-full flex items-center ${collapsed ? 'md:justify-center' : 'md:gap-3'} gap-3 py-3 px-3 rounded-lg text-gray-600 hover:bg-white hover:text-red-500 transition-all duration-200 group`}
						title={collapsed ? "Sair" : ""}
					>
						<LogOut className="w-5 h-5 flex-shrink-0" />
						<span className={`font-medium text-sm tracking-tight ${collapsed ? 'md:hidden' : ''}`}>Sair</span>
					</button>
				</div>
			</div>
		</aside>
		</>
	);
}
