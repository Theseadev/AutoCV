import { useEffect, useState } from "react";
import { createOrder, getConfig } from "./api";
import AdminView from "./components/AdminView";
import AtsView from "./components/AtsView";
import BuilderView from "./components/BuilderView";
import StoreView from "./components/StoreView";
import { type CvData, type Order, storeCv, storeSkillsText } from "./cv";

type View = "store" | "builder" | "ats" | "admin";

// Daftar template & harga (satu sumber kebenaran untuk toko & checkout)
const TEMPLATES: Record<string, { label: string; price: number }> = {
	cv01: { label: "Template CV 01 (Minimalist ATS)", price: 25000 },
	cv01_photo: { label: "Template CV 01 (Minimalist ATS)", price: 25000 },
};

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

// Draft otomatis: refresh / keluar browser tidak menghilangkan isian
const DRAFT_KEY = "autocv_draft_v2";
const loadDraft = () => {
	try {
		const raw = localStorage.getItem(DRAFT_KEY) || localStorage.getItem("autocv_draft_v1");
		if (!raw) return null;
		const parsed = JSON.parse(raw) as { cv?: CvData; skillsText?: string; template?: string };
		if (parsed?.cv?.name?.toLowerCase().includes("salva")) {
			localStorage.removeItem(DRAFT_KEY);
			localStorage.removeItem("autocv_draft_v1");
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
};
const draft = loadDraft();

export default function App() {
	const [view, setView] = useState<View>("store");
	const [template, setTemplate] = useState(
		draft?.template && TEMPLATES[draft.template] ? draft.template : "cv01",
	);
	const [cv, setCv] = useState<CvData>({ ...storeCv, ...(draft?.cv ?? {}) });
	const [skillsText, setSkillsText] = useState(draft?.skillsText ?? storeSkillsText);
	// Nomor WA admin dari backend (.env) — ganti tanpa rebuild frontend
	const [waAdmin, setWaAdmin] = useState("628000000000");

	useEffect(() => {
		try {
			localStorage.setItem(DRAFT_KEY, JSON.stringify({ cv, skillsText, template }));
		} catch {
			// kuota penuh (foto besar) — abaikan, draft hanya bonus
		}
	}, [cv, skillsText, template]);

	useEffect(() => {
		getConfig()
			.then((c) => c.waAdmin && setWaAdmin(c.waAdmin))
			.catch((e) => console.error("Gagal memuat konfigurasi:", e));
	}, []);

	const openBuilder = (t: string, color?: string) => {
		setTemplate(t);
		if (color) {
			setCv(prev => ({ ...prev, themeColor: color }));
		}
		setView("builder");
	};

	const processOrder = async () => {
		const orderId = `CV-${Math.floor(10000 + Math.random() * 90000)}`;
		const order: Order = {
			id: orderId,
			date: "Baru Saja",
			name: cv.name || "Pelanggan Baru",
			template: TEMPLATES[template]?.label ?? template,
			templateId: template,
			cv: { ...cv, experiences: cv.experiences.map((e) => ({ ...e })) },
			skills: skillsText,
		};
		try {
			await createOrder(order);
		} catch (e) {
			console.error("Gagal menyimpan order ke backend:", e);
		}

		const msg = `Halo Admin AIGen CV!%0A%0ASaya ingin membeli file CV Asli (Tanpa Watermark).%0A%0AID Transaksi: *#${orderId}*%0ANama di CV: *${cv.name}*%0A%0AMohon info cara pembayarannya. Terima kasih!`;
		alert(
			`Order berhasil dibuat di sistem! (ID: ${orderId}). Anda akan diarahkan ke WhatsApp Admin.`,
		);
		window.open(`https://wa.me/${waAdmin}?text=${msg}`, "_blank");
	};

	const navItem = (v: View, label: string, icon?: string) => (
		<button
			type="button"
			onClick={() => setView(v)}
			className={`px-3 py-2 text-sm transition-colors border-b-2 font-medium ${
				view === v
					? "border-primary text-primary font-bold"
					: "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200"
			}`}
		>
			{icon && <i className={`${icon} mr-1.5`} />}
			{label}
		</button>
	);

	const mobileBottomItem = (v: View, label: string, icon: string) => {
		const active = view === v;
		return (
			<button
				type="button"
				onClick={() => setView(v)}
				className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors relative ${
					active ? "text-primary" : "text-gray-400 hover:text-gray-600"
				}`}
			>
				<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-0.5 transition-all ${
					active ? "bg-primary/10 text-primary font-bold scale-110" : ""
				}`}>
					<i className={icon}></i>
				</div>
				<span className={`text-[10px] leading-tight ${active ? "font-bold text-primary" : "font-medium"}`}>
					{label}
				</span>
			</button>
		);
	};

	return (
		<>
			{/* Top Navbar */}
			<nav className="bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-200 fixed w-full z-40 top-0">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-14 sm:h-16">
						{/* Brand Logo */}
						<button
							type="button"
							className="flex items-center cursor-pointer group"
							onClick={() => setView("store")}
						>
							<div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mr-2.5 group-hover:bg-primary group-hover:text-white transition-all duration-200">
								<i className="fa-solid fa-file-signature text-lg"></i>
							</div>
							<div className="text-left">
								<span className="font-heading font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight block leading-none">
									AIGen <span className="text-primary">CV</span>
								</span>
							</div>
						</button>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-1 lg:space-x-3">
							{navItem("store", "Toko Template", "fa-solid fa-store")}
							{navItem("builder", "CV Builder", "fa-solid fa-pen-nib")}
							{navItem(
								"ats",
								"AI ATS Auditor",
								"fa-solid fa-wand-magic-sparkles text-amber-500",
							)}
							{navItem("admin", "Panel Admin", "fa-solid fa-lock")}
						</div>

						{/* Mobile Header Right Active View Pill */}
						<div className="md:hidden flex items-center">
							<span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
								<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
								{view === "store" && "Toko Template"}
								{view === "builder" && "CV Builder"}
								{view === "ats" && "AI ATS Auditor"}
								{view === "admin" && "Panel Admin"}
							</span>
						</div>
					</div>
				</div>
			</nav>

			{/* Mobile Bottom Navigation Bar */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 flex items-center px-1 shadow-lg pb-[max(env(safe-area-inset-bottom),4px)]">
				{mobileBottomItem("store", "Template", "fa-solid fa-store")}
				{mobileBottomItem("builder", "Builder", "fa-solid fa-pen-nib")}
				{mobileBottomItem("ats", "AI ATS", "fa-solid fa-wand-magic-sparkles")}
				{mobileBottomItem("admin", "Admin", "fa-solid fa-shield-halved")}
			</div>

			<div className={`pt-14 sm:pt-16 ${view === "builder" ? "h-screen pb-14 md:pb-0 overflow-hidden" : "min-h-screen pb-16 md:pb-0"}`}>
				{view === "store" && <StoreView onPick={openBuilder} />}
				{view === "builder" && (
					<BuilderView
						cv={cv}
						setCv={setCv}
						skillsText={skillsText}
						setSkillsText={setSkillsText}
						onBack={() => setView("store")}
						onCheckout={processOrder}
						template={template}
						templateLabel={TEMPLATES[template]?.label ?? template}
						price={rupiah(TEMPLATES[template]?.price ?? 25000)}
					/>
				)}
				{view === "ats" && (
					<AtsView
						cv={cv}
						skillsText={skillsText}
						onApplySummary={(summary) => {
							setCv((prev) => ({ ...prev, about: summary }));
							alert(
								"Ringkasan hasil optimasi ATS berhasil diterapkan ke CV Anda!",
							);
							setView("builder");
						}}
					/>
				)}
				{view === "admin" && <AdminView />}
			</div>
		</>
	);
}
