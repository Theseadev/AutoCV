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
	cv01_photo: { label: "CV Kreatif 01 (Dengan Foto)", price: 25000 },
	cv01_no: { label: "CV Kreatif 01 (Tanpa Foto)", price: 25000 },
	cv02_photo: { label: "CV Corporate Standard (Dengan Foto)", price: 20000 },
	cv02_no: { label: "CV Corporate Standard (Tanpa Foto)", price: 20000 },
	cv03_photo: { label: "CV Modern Executive (Dengan Foto)", price: 30000 },
	cv03_no: { label: "CV Modern Executive (Tanpa Foto)", price: 30000 },
	cv04_photo: { label: "CV Neo Creative (Dengan Foto)", price: 35000 },
	cv04_no: { label: "CV Neo Creative (Tanpa Foto)", price: 35000 },
	cv05_photo: { label: "CV Lux Monochrome (Dengan Foto)", price: 25000 },
	cv05_no: { label: "CV Lux Monochrome (Tanpa Foto)", price: 25000 },
	cv06_photo: { label: "CV Dev Minimal (Dengan Foto)", price: 30000 },
	cv06_no: { label: "CV Dev Minimal (Tanpa Foto)", price: 30000 },
	cv07_photo: { label: "CV Classic Fresh (Dengan Foto)", price: 20000 },
	cv07_no: { label: "CV Classic Fresh (Tanpa Foto)", price: 20000 },
	cv08_photo: { label: "CV Peacock Brown (Dengan Foto)", price: 30000 },
	cv08_no: { label: "CV Peacock Brown (Tanpa Foto)", price: 30000 },
};

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

// Draft otomatis: refresh / keluar browser tidak menghilangkan isian
const DRAFT_KEY = "autocv_draft_v1";
const loadDraft = () => {
	try {
		const raw = localStorage.getItem(DRAFT_KEY);
		return raw ? (JSON.parse(raw) as { cv?: CvData; skillsText?: string; template?: string }) : null;
	} catch {
		return null;
	}
};
const draft = loadDraft();

export default function App() {
	const [view, setView] = useState<View>("store");
	const [template, setTemplate] = useState(
		draft?.template && TEMPLATES[draft.template] ? draft.template : "cv01_photo",
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
			className={`px-3 py-2 text-sm transition-colors border-b-2 ${
				view === v
					? "border-primary text-primary font-semibold"
					: "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200"
			}`}
		>
			{icon && <i className={`${icon} mr-1.5`} />}
			{label}
		</button>
	);

	return (
		<>
			<nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-40 top-0">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<button
							type="button"
							className="flex items-center cursor-pointer"
							onClick={() => setView("store")}
						>
							<i className="fa-solid fa-file-signature text-primary text-2xl mr-2"></i>
							<span className="font-heading font-bold text-xl text-gray-900">
								AIGen CV
							</span>
						</button>
						<div className="flex items-center space-x-2 sm:space-x-4">
							{navItem("store", "Toko Template")}
							{navItem("builder", "CV Builder")}
							{navItem(
								"ats",
								"AI ATS Auditor",
								"fa-solid fa-wand-magic-sparkles text-amber-500",
							)}
							{navItem("admin", "Panel Admin", "fa-solid fa-lock")}
						</div>
					</div>
				</div>
			</nav>

			<div className="pt-16 min-h-screen">
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
