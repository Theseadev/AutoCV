import { useEffect, useRef, useState } from "react";
import { parseSkills, storeCv, storeSkillsText } from "../cv";
import { CvPaper } from "./BuilderView";

interface Props {
	onPick: (template: string, color?: string) => void;
}

type ExperienceCategory = "fresh_no_exp" | "fresh_org" | "professional" | "internship";

interface TemplateItem {
	id: string;
	name: string;
	photo: boolean;
	columns: 1 | 2;
	style: "Traditional" | "Creative" | "Contemporary";
	category: ExperienceCategory[];
	recommended?: boolean;
	palettes: string[];
}

const TEMPLATES: TemplateItem[] = [
	{
		id: "cv01_photo",
		name: "Template CV 01 (With Photo)",
		photo: true,
		columns: 2,
		style: "Creative",
		category: ["fresh_no_exp", "fresh_org", "professional", "internship"],
		recommended: true,
		palettes: ["#2563EB", "#00ACC1", "#1E88E5", "#1565C0", "#2E7D32"],
	},
	{
		id: "cv01_no",
		name: "Template CV 01 (No Photo)",
		photo: false,
		columns: 2,
		style: "Creative",
		category: ["fresh_no_exp", "fresh_org", "professional", "internship"],
		recommended: false,
		palettes: ["#2563EB", "#00ACC1", "#1E88E5", "#1565C0", "#2E7D32"],
	},
];

const scrollToTemplates = () =>
	document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });

// Tumpukan CV interaktif untuk Hero Section
const HERO_TEMPLATES = ["cv01_photo"];
const FAN_ANGLES = [0];

function TemplateStack() {
	const [order, setOrder] = useState(HERO_TEMPLATES);
	const bringToFront = (id: string) =>
		setOrder((o) => [...o.filter((x) => x !== id), id]);

	return (
		<div className="relative w-[520px] h-[360px] select-none">
			{order.map((t, i) => {
				const dist = order.length - 1 - i;
				const front = dist === 0;
				return (
					<button
						key={t}
						type="button"
						aria-label={`Lihat preview template ${t}`}
						onClick={() => bringToFront(t)}
						className={`absolute left-1/2 bottom-0 w-[238px] aspect-[1/1.414] rounded-lg overflow-hidden ring-1 ring-black/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
							front ? "shadow-xl" : "shadow-md hover:shadow-lg"
						}`}
						style={{
							transformOrigin: "50% 100%",
							transform: `translateX(-50%) rotate(${FAN_ANGLES[dist]}deg)`,
							zIndex: i,
							transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
						}}
					>
						<CvPaper
							cv={storeCv}
							skills={parseSkills(storeSkillsText)}
							scale={0.3}
							template={t}
							watermark={false}
						/>
					</button>
				);
			})}
		</div>
	);
}

// Latar hero: grid kertas grafik indigo yang elegan
function HeroBackground() {
	return (
		<div
			aria-hidden
			className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none select-none animate-fade-in"
		>
			<svg
				role="img"
				aria-label="Latar dekoratif: grid kertas grafik"
				className="h-full w-full"
				viewBox="0 0 1440 900"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<pattern
						id="hero-grid"
						width="44"
						height="44"
						patternUnits="userSpaceOnUse"
					>
						<path
							d="M44 0H0V44"
							fill="none"
							stroke="#4F46E5"
							strokeWidth="1"
							opacity="0.16"
						/>
					</pattern>
					<radialGradient id="hero-mask" cx="50%" cy="44%" r="72%">
						<stop offset="0" stopColor="#FFFFFF" stopOpacity="0.92" />
						<stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
					</radialGradient>
				</defs>
				<rect width="1440" height="900" fill="url(#hero-grid)" />
				<rect width="1440" height="900" fill="url(#hero-mask)" />
			</svg>
		</div>
	);
}

// Preview kartu yang responsif & mengisi container A4 tanpa border ganda
function ResponsiveCvPreview({ template, color }: { template: string; color?: string }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0.35);

	useEffect(() => {
		if (!containerRef.current) return;
		const updateScale = () => {
			if (containerRef.current) {
				const width = containerRef.current.clientWidth;
				if (width > 0) {
					setScale(width / 794);
				}
			}
		};
		updateScale();
		const ro = new ResizeObserver(updateScale);
		ro.observe(containerRef.current);
		return () => ro.disconnect();
	}, []);

	const cardCv = color ? { ...storeCv, themeColor: color } : storeCv;

	return (
		<div ref={containerRef} className="w-full h-full relative overflow-hidden pointer-events-none select-none bg-white">
			<div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: "794px", height: "1123px" }}>
				<CvPaper
					cv={cardCv}
					skills={parseSkills(storeSkillsText)}
					scale={1}
					template={template}
					watermark={false}
				/>
			</div>
		</div>
	);
}

export default function StoreView({ onPick }: Props) {
	// State warna yang dipilih untuk setiap template
	const [selectedColors, setSelectedColors] = useState<Record<string, string>>({
		cv01_photo: "#2563EB",
	});

	// Filter state
	const [filters, setFilters] = useState({
		freshNoExp: false,
		freshOrg: false,
		professional: false,
		internship: false,
		withPhoto: false,
		withoutPhoto: false,
		col1: false,
		col2: false,
		traditional: false,
		creative: false,
		contemporary: false,
	});

	const handleClearFilters = () => {
		setFilters({
			freshNoExp: false,
			freshOrg: false,
			professional: false,
			internship: false,
			withPhoto: false,
			withoutPhoto: false,
			col1: false,
			col2: false,
			traditional: false,
			creative: false,
			contemporary: false,
		});
	};

	// Filter logic
	const filteredTemplates = TEMPLATES.filter((t) => {
		// Category / Experience filter
		const catFilterActive =
			filters.freshNoExp ||
			filters.freshOrg ||
			filters.professional ||
			filters.internship;
		if (catFilterActive) {
			const matchesCategory =
				(filters.freshNoExp && t.category.includes("fresh_no_exp")) ||
				(filters.freshOrg && t.category.includes("fresh_org")) ||
				(filters.professional && t.category.includes("professional")) ||
				(filters.internship && t.category.includes("internship"));
			if (!matchesCategory) return false;
		}

		// Headshot filter
		const photoFilterActive = filters.withPhoto || filters.withoutPhoto;
		if (photoFilterActive) {
			if (filters.withPhoto && !t.photo) return false;
			if (filters.withoutPhoto && t.photo) return false;
		}

		// Columns filter
		const colFilterActive = filters.col1 || filters.col2;
		if (colFilterActive) {
			if (filters.col1 && t.columns !== 1) return false;
			if (filters.col2 && t.columns !== 2) return false;
		}

		// Style filter
		const styleFilterActive = filters.traditional || filters.creative || filters.contemporary;
		if (styleFilterActive) {
			if (filters.traditional && t.style !== "Traditional") return false;
			if (filters.creative && t.style !== "Creative") return false;
			if (filters.contemporary && t.style !== "Contemporary") return false;
		}

		return true;
	});

	return (
		<div className="animate-fade-in bg-white">
			{/* HERO SECTION */}
			<section className="relative bg-white border-b border-gray-200 overflow-hidden">
				<HeroBackground />

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-14 items-center">
					<div>
						<p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 animate-fade-up">
							AIGen CV · Resume Builder
						</p>

						<h1
							className="text-4xl sm:text-5xl font-heading font-bold text-gray-900 leading-[1.15] mb-6 animate-fade-up"
							style={{ animationDelay: "80ms" }}
						>
							CV yang bikin kamu dilirik, bukan cuma dibaca sistem.
						</h1>

						<p
							className="text-lg text-gray-600 max-w-xl leading-relaxed mb-8 animate-fade-up"
							style={{ animationDelay: "160ms" }}
						>
							Tulis datamu, biarkan AI merapikan kalimatnya. Pilih template,
							lihat preview A4 langsung, unduh PDF bersih tanpa watermark.
						</p>

						<div
							className="flex flex-col sm:flex-row items-start gap-4 animate-fade-up"
							style={{ animationDelay: "240ms" }}
						>
							<button
								type="button"
								onClick={scrollToTemplates}
								className="bg-primary hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer"
							>
								Pilih Template
							</button>

							<button
								type="button"
								onClick={() => onPick("cv01_photo")}
								className="text-gray-700 hover:text-gray-900 font-semibold px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors active:scale-[0.96] cursor-pointer"
							>
								Langsung coba builder →
							</button>
						</div>

						<p
							className="mt-6 text-sm text-gray-500 animate-fade-up"
							style={{ animationDelay: "320ms" }}
						>
							Tanpa akun · Tanpa kartu kredit · PDF langsung terunduh
						</p>
					</div>

					<div
						className="hidden lg:flex justify-center relative animate-fade-up"
						style={{ animationDelay: "200ms" }}
					>
						<TemplateStack />
					</div>
				</div>
			</section>

			{/* SHOW TEMPLATES SECTION (Sesuai Referensi Gambar) */}
			<section
				id="templates"
				className="max-w-[1400px] mx-auto px-6 sm:px-8 py-16 scroll-mt-16"
			>
				{/* Header referensi: "You can always change your template later." */}
				<div className="pb-12 text-center">
					<h2 className="text-xl sm:text-2xl font-normal text-slate-700 tracking-tight font-sans">
						You can always change your template later.
					</h2>
				</div>

				<div className="flex flex-col md:flex-row gap-12 items-start">
					{/* Left Sidebar Filters */}
					<aside className="w-full md:w-56 shrink-0">
						<div className="flex items-center justify-between mb-8">
							<h3 className="text-2xl font-bold text-gray-900 tracking-tight">Filters</h3>
							<button
								type="button"
								onClick={handleClearFilters}
								className="text-[13px] font-medium text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
							>
								Clear Filters
							</button>
						</div>

						<div className="space-y-8">
							{/* Kategori / Pengalaman */}
							<div>
								<h4 className="text-base font-bold text-gray-900 mb-3.5">Kategori / Level</h4>
								<div className="space-y-2.5">
									<label className="flex items-center gap-3 cursor-pointer select-none group">
										<input
											type="checkbox"
											checked={filters.freshNoExp}
											onChange={(e) => setFilters((f) => ({ ...f, freshNoExp: e.target.checked }))}
											className="w-[18px] h-[18px] rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
										/>
										<span className="text-[14px] text-gray-700 group-hover:text-gray-900">Fresh Grad (Nol Pengalaman)</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer select-none group">
										<input
											type="checkbox"
											checked={filters.freshOrg}
											onChange={(e) => setFilters((f) => ({ ...f, freshOrg: e.target.checked }))}
											className="w-[18px] h-[18px] rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
										/>
										<span className="text-[14px] text-gray-700 group-hover:text-gray-900">Fresh Grad (Aktif Organisasi)</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer select-none group">
										<input
											type="checkbox"
											checked={filters.professional}
											onChange={(e) => setFilters((f) => ({ ...f, professional: e.target.checked }))}
											className="w-[18px] h-[18px] rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
										/>
										<span className="text-[14px] text-gray-700 group-hover:text-gray-900">Profesional / Berpengalaman</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer select-none group">
										<input
											type="checkbox"
											checked={filters.internship}
											onChange={(e) => setFilters((f) => ({ ...f, internship: e.target.checked }))}
											className="w-[18px] h-[18px] rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
										/>
										<span className="text-[14px] text-gray-700 group-hover:text-gray-900">Magang / Mahasiswa / SMK</span>
									</label>
								</div>
							</div>

							{/* Headshot */}
							<div>
								<h4 className="text-base font-bold text-gray-900 mb-3.5">Headshot</h4>
								<div className="space-y-2.5">
									<label className="flex items-center gap-3 cursor-pointer select-none group">
										<input
											type="checkbox"
											checked={filters.withPhoto}
											onChange={(e) => setFilters((f) => ({ ...f, withPhoto: e.target.checked }))}
											className="w-[18px] h-[18px] rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
										/>
										<span className="text-[14px] text-gray-700 group-hover:text-gray-900">With photo</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer select-none group">
										<input
											type="checkbox"
											checked={filters.withoutPhoto}
											onChange={(e) => setFilters((f) => ({ ...f, withoutPhoto: e.target.checked }))}
											className="w-[18px] h-[18px] rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
										/>
										<span className="text-[14px] text-gray-700 group-hover:text-gray-900">Without photo</span>
									</label>
								</div>
							</div>

							{/* Columns */}
							<div>
								<h4 className="text-base font-bold text-gray-900 mb-3.5">Columns</h4>
								<div className="space-y-2.5">
									<label className="flex items-center gap-3 cursor-pointer select-none group">
										<input
											type="checkbox"
											checked={filters.col1}
											onChange={(e) => setFilters((f) => ({ ...f, col1: e.target.checked }))}
											className="w-[18px] h-[18px] rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
										/>
										<span className="text-[14px] text-gray-700 group-hover:text-gray-900">1 Column</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer select-none group">
										<input
											type="checkbox"
											checked={filters.col2}
											onChange={(e) => setFilters((f) => ({ ...f, col2: e.target.checked }))}
											className="w-[18px] h-[18px] rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
										/>
										<span className="text-[14px] text-gray-700 group-hover:text-gray-900">2 Columns</span>
									</label>
								</div>
							</div>

							{/* Style */}
							<div>
								<h4 className="text-base font-bold text-gray-900 mb-3.5">Style</h4>
								<div className="space-y-2.5">
									<label className="flex items-center gap-3 cursor-pointer select-none group">
										<input
											type="checkbox"
											checked={filters.traditional}
											onChange={(e) => setFilters((f) => ({ ...f, traditional: e.target.checked }))}
											className="w-[18px] h-[18px] rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
										/>
										<span className="text-[14px] text-gray-700 group-hover:text-gray-900">Traditional</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer select-none group">
										<input
											type="checkbox"
											checked={filters.creative}
											onChange={(e) => setFilters((f) => ({ ...f, creative: e.target.checked }))}
											className="w-[18px] h-[18px] rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
										/>
										<span className="text-[14px] text-gray-700 group-hover:text-gray-900">Creative</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer select-none group">
										<input
											type="checkbox"
											checked={filters.contemporary}
											onChange={(e) => setFilters((f) => ({ ...f, contemporary: e.target.checked }))}
											className="w-[18px] h-[18px] rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
										/>
										<span className="text-[14px] text-gray-700 group-hover:text-gray-900">Contemporary</span>
									</label>
								</div>
							</div>
						</div>
					</aside>

					{/* Right Templates Grid */}
					<main className="flex-1 w-full">
						{filteredTemplates.length === 0 ? (
							<div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
								<p className="text-gray-500 text-base mb-3">Tidak ada template yang cocok dengan filter yang dipilih.</p>
								<button
									type="button"
									onClick={handleClearFilters}
									className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
								>
									Reset Semua Filter
								</button>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
								{filteredTemplates.map((t) => {
									const activeColor = selectedColors[t.id] || t.palettes[0];
									return (
										<div key={t.id} className="flex flex-col items-center">
											{/* A4 Resume Card */}
											<div
												onClick={() => onPick(t.id, selectedColors[t.id])}
												className="w-full aspect-[1/1.414] bg-white border border-gray-300 hover:border-gray-400 rounded-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative cursor-pointer group overflow-hidden"
											>
												<ResponsiveCvPreview template={t.id} color={selectedColors[t.id]} />

												{/* RECOMMENDED badge at bottom right */}
												{t.recommended && (
													<div className="absolute bottom-4 right-4 bg-[#ffccd2] text-[#991b1b] text-[11px] font-extrabold px-3 py-1 uppercase tracking-wider rounded shadow-sm border border-[#fda4af] pointer-events-none z-10">
														RECOMMENDED
													</div>
												)}
											</div>

											{/* Color swatches directly underneath the card */}
											<div className="w-full flex items-center justify-start gap-2.5 pt-3.5 px-1">
												{t.palettes.map((color) => {
													const isSelected = activeColor.toLowerCase() === color.toLowerCase();
													return (
														<button
															key={color}
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																setSelectedColors((prev) => ({ ...prev, [t.id]: color }));
															}}
															style={{ backgroundColor: color }}
															className={`w-6 h-6 rounded-full transition-transform hover:scale-110 cursor-pointer ${
																isSelected
																	? "ring-2 ring-offset-2 ring-gray-400 scale-105"
																	: "border border-black/15"
															}`}
															title={`Ganti warna: ${color}`}
														/>
													);
												})}

												{/* Rainbow/gradient circle for custom color picker */}
												<label
													title="Pilih warna kustom"
													onClick={(e) => e.stopPropagation()}
													className="w-6 h-6 rounded-full transition-transform hover:scale-110 cursor-pointer bg-[conic-gradient(at_center,_#ef4444,_#f97316,_#eab308,_#22c55e,_#06b6d4,_#3b82f6,_#a855f7,_#ef4444)] border border-black/15 relative overflow-hidden flex items-center justify-center shadow-xs"
												>
													<input
														type="color"
														value={activeColor.startsWith("#") ? activeColor : "#4F46E5"}
														onChange={(e) => {
															e.stopPropagation();
															setSelectedColors((prev) => ({ ...prev, [t.id]: e.target.value }));
														}}
														className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
													/>
												</label>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</main>
				</div>
			</section>

			{/* CTA SECTION */}
			<section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8">
				<div className="bg-gray-900 rounded-2xl px-8 py-14 text-center relative overflow-hidden">
					<svg
						role="img"
						aria-label="Pola titik dekoratif"
						className="absolute inset-0 h-full w-full pointer-events-none"
						viewBox="0 0 800 400"
						preserveAspectRatio="xMidYMid slice"
					>
						<defs>
							<pattern
								id="cta-dots"
								width="28"
								height="28"
								patternUnits="userSpaceOnUse"
							>
								<circle cx="1.5" cy="1.5" r="1.5" fill="white" opacity="0.06" />
							</pattern>
						</defs>

						<rect width="800" height="400" fill="url(#cta-dots)" />
					</svg>

					<h2 className="relative text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
						Mulai dari CV-mu yang sekarang.
					</h2>

					<p className="relative text-gray-400 max-w-md mx-auto mb-8">
						Butuh waktu kurang dari lima menit — hasilnya langsung terlihat.
					</p>

					<div className="relative">
						<button
							type="button"
							onClick={scrollToTemplates}
							className="bg-white hover:bg-gray-100 text-gray-900 px-7 py-3 rounded-xl font-semibold transition-colors active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
						>
							Pilih Template
						</button>
					</div>
				</div>
			</section>

			{/* FOOTER */}
			<footer className="border-t border-gray-200 py-8">
				<div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
					© 2025 AIGen CV — Resume Builder. Dibuat dengan{" "}
					<i className="fa-solid fa-heart text-rose-400 mx-0.5"></i> untuk pencari kerja.
				</div>
			</footer>
		</div>
	);
}
