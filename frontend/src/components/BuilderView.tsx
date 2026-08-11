import { useEffect, useMemo, useRef, useState } from "react";
import { callGeminiAPI } from "../api";
import { type CvData, type ParsedSkill, parseSkills } from "../cv";

interface Props {
	cv: CvData;
	setCv: React.Dispatch<React.SetStateAction<CvData>>;
	skillsText: string;
	setSkillsText: (s: string) => void;
	onBack: () => void;
	onCheckout: () => void;
	template: string;
	templateLabel: string;
	price: string;
}

export default function BuilderView({
	cv,
	setCv,
	skillsText,
	setSkillsText,
	onBack,
	onCheckout,
	template,
	templateLabel,
	price,
}: Props) {
	// State AI Profil Writer
	const [aiKeywords, setAiKeywords] = useState(
		"lulusan akuntansi, teliti, menguasai excel & SAP, berpengalaman admin",
	);
	const [aiTone, setAiTone] = useState("Professional & Formal");
	const [aiLanguage, setAiLanguage] = useState("Bahasa Indonesia");
	const [isGenerating, setIsGenerating] = useState(false);

	// State AI Skill Suggester
	const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);

	// Indeks experience yang sedang dipoles AI
	const [enhancingIdx, setEnhancingIdx] = useState<number | null>(null);

	// Tab aktif di HP (desktop menampilkan dua panel sekaligus)
	const [mtab, setMtab] = useState<"edit" | "preview">("edit");

	// Skala preview kertas A4 agar pas muat di area preview (tanpa scroll)
	const areaRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0.6);
	useEffect(() => {
		const update = () => {
			const area = areaRef.current;
			// Di HP saat tab editor aktif, area preview tersembunyi — lewati
			if (
				!area ||
				(mtab === "edit" && !window.matchMedia("(min-width: 1024px)").matches)
			)
				return;
			const availW = area.clientWidth - 64; // padding p-8 (32px kiri + kanan)
			const availH = area.clientHeight - 64; // padding p-8 (32px atas + bawah)
			setScale(Math.max(0.3, Math.min(availW / 794, availH / 1123, 1)));
		};
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, [mtab]);

	const parsedSkills: ParsedSkill[] = useMemo(
		() => parseSkills(skillsText),
		[skillsText],
	);

	const set = (patch: Partial<CvData>) =>
		setCv((prev) => ({ ...prev, ...patch }));
	const updateExp = (
		index: number,
		patch: Partial<CvData["experiences"][number]>,
	) =>
		setCv((prev) => ({
			...prev,
			experiences: prev.experiences.map((e, i) =>
				i === index ? { ...e, ...patch } : e,
			),
		}));

	const addExp = () =>
		setCv((prev) => ({
			...prev,
			experiences: [
				...prev.experiences,
				{ id: Date.now(), company: "", role: "", period: "", desc: "" },
			],
		}));
	const removeExp = (index: number) =>
		setCv((prev) => ({
			...prev,
			experiences: prev.experiences.filter((_, i) => i !== index),
		}));

	// 1. Gemini AI Profile Generator
	const generateProfileAI = async () => {
		if (!aiKeywords.trim()) {
			alert("Masukkan kata kunci latar belakangmu terlebih dahulu!");
			return;
		}
		setIsGenerating(true);
		try {
			const sysPrompt = `Anda adalah pakar penulisan CV profesional dan konsultan karir terkemuka. Tugas Anda adalah membuat 1 paragraf 'Tentang Saya' (Summary) CV yang sangat kuat, menarik, dan ramah ATS berdasarkan informasi pengguna. Gunakan gaya ${aiTone} dan tulis dalam ${aiLanguage}. Jangan sertakan tanda petik pembuka/penutup atau teks pengantar lainnya, langsung paragraf ringkasan saja.`;
			const userQuery = `Nama: ${cv.name}\nProfesi/Target Role: ${cv.title}\nKata kunci/Latar belakang: ${aiKeywords}`;
			const result = await callGeminiAPI(sysPrompt, userQuery);
			const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
			if (text) {
				set({ about: text.trim() });
			} else {
				alert("Gagal memproses respons AI. Silakan coba lagi.");
			}
		} catch (e) {
			console.error("Gemini API Error:", e);
			alert("Terjadi kesalahan saat menghubungi Gemini AI API.");
		} finally {
			setIsGenerating(false);
		}
	};

	// 2. Gemini Experience Bullet Enhancer
	const enhanceExpAI = async (index: number) => {
		const exp = cv.experiences[index];
		if (!exp) return;
		setEnhancingIdx(index);
		try {
			const sysPrompt = `Anda adalah konsultan resume profesional. Poles dan ubah deskripsi pengalaman kerja berikut menjadi 2-3 poin pencapaian berorientasi hasil yang berdampak tinggi (Action Verbs + Metrics Placeholder jika relevan). Tulis dalam Bahasa Indonesia secara profesional. Gunakan format bullet point sederhana (contoh memakai tanda '•'). Langsung berikan poin-poinnya tanpa kata pengantar.`;
			const userQuery = `Perusahaan: ${exp.company || "Perusahaan"}\nJabatan: ${exp.role || "Staff"}\nDeskripsi Asli/Draft: ${exp.desc || "Menjalankan tugas sehari-hari"}`;
			const result = await callGeminiAPI(sysPrompt, userQuery);
			const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
			if (text) updateExp(index, { desc: text.trim() });
		} catch (e) {
			console.error("Gemini Exp Enhance Error:", e);
			alert("Gagal memoles deskripsi dengan AI.");
		} finally {
			setEnhancingIdx(null);
		}
	};

	// 3. Gemini Skill Suggester
	const suggestSkillsAI = async () => {
		setIsSuggestingSkills(true);
		try {
			const sysPrompt = `Anda adalah pakar rekrutmen. Berikan 4-5 daftar kemampuan (hard skill & soft skill) yang paling dicari untuk posisi '${cv.title || "Staff Perkantoran"}'. Format setiap baris persis seperti ini: 'Nama Skill: Penjelasan singkat 3-5 kata'. Langsung output daftar baris tersebut tanpa pengantar.`;
			const userQuery = `Target Profesi: ${cv.title}\nProfil Singkat: ${cv.about}`;
			const result = await callGeminiAPI(sysPrompt, userQuery);
			const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
			if (text) setSkillsText(text.trim());
		} catch (e) {
			console.error("Gemini Skills Suggestion Error:", e);
			alert("Gagal mendapatkan rekomendasi skill.");
		} finally {
			setIsSuggestingSkills(false);
		}
	};

	const inputCls =
		"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition";
	const inputSmCls =
		"w-full border border-gray-200 rounded-md p-1.5 focus:ring-primary focus:border-primary transition";

	return (
		<div className="h-[calc(100dvh-64px)] flex flex-col lg:flex-row overflow-hidden">
			{/* Tab bar khusus HP: Edit / Preview */}
			<div className="lg:hidden shrink-0 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 z-20">
				<div className="flex bg-gray-100 rounded-xl p-1 flex-1">
					<button
						type="button"
						onClick={() => setMtab("edit")}
						className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
							mtab === "edit"
								? "bg-white text-gray-900 shadow-sm"
								: "text-gray-500"
						}`}
					>
						<i className="fa-solid fa-pen mr-1.5 text-xs"></i> Edit
					</button>
					<button
						type="button"
						onClick={() => setMtab("preview")}
						className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
							mtab === "preview"
								? "bg-white text-gray-900 shadow-sm"
								: "text-gray-500"
						}`}
					>
						<i className="fa-solid fa-eye mr-1.5 text-xs"></i> Preview
					</button>
				</div>
			</div>

			{/* LEFT PANEL: FORM EDITOR */}
			<div
				className={`flex flex-1 min-h-0 w-full lg:w-1/2 lg:flex bg-gray-50 border-r border-gray-200 overflow-y-auto editor-scroll p-4 sm:p-6 lg:p-8 pb-32 ${
					mtab === "preview" ? "hidden" : ""
				}`}
			>
				<div className="flex items-center mb-6">
					<button
						type="button"
						onClick={onBack}
						className="text-gray-500 hover:text-gray-900 mr-4 p-2 -ml-2"
					>
						<i className="fa-solid fa-arrow-left"></i>
					</button>
					<div>
						<h2 className="text-2xl font-heading font-bold leading-tight">
							Edit CV Kamu
						</h2>
						<p className="text-sm text-gray-500">{templateLabel}</p>
					</div>
				</div>

				<div className="space-y-6">
					{/* Informasi Pribadi */}
					<div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
						<div className="flex items-center gap-3 mb-5">
							<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
								1
							</span>
							<h3 className="text-base font-bold text-gray-900">
								Informasi Pribadi
							</h3>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="col-span-2">
								<label
									htmlFor="cv-name"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Nama Lengkap
								</label>
								<input
									id="cv-name"
									value={cv.name}
									onChange={(e) => set({ name: e.target.value })}
									type="text"
									className={inputCls}
								/>
							</div>
							<div className="col-span-2">
								<label
									htmlFor="cv-title"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Profesi / Title
								</label>
								<input
									id="cv-title"
									value={cv.title}
									onChange={(e) => set({ title: e.target.value })}
									type="text"
									className={inputCls}
								/>
							</div>
							<div>
								<label
									htmlFor="cv-phone"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									No. WhatsApp
								</label>
								<input
									id="cv-phone"
									value={cv.phone}
									onChange={(e) => set({ phone: e.target.value })}
									type="text"
									className={inputCls}
								/>
							</div>
							<div>
								<label
									htmlFor="cv-email"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Email
								</label>
								<input
									id="cv-email"
									value={cv.email}
									onChange={(e) => set({ email: e.target.value })}
									type="email"
									className={inputCls}
								/>
							</div>
							<div className="col-span-2">
								<label
									htmlFor="cv-address"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Alamat Singkat
								</label>
								<input
									id="cv-address"
									value={cv.address}
									onChange={(e) => set({ address: e.target.value })}
									type="text"
									className={inputCls}
								/>
							</div>
						</div>
					</div>

					{/* Gemini AI Profil Writer */}
					<div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 border-l-4 border-l-indigo-500 shadow-sm">
						<div className="flex items-center justify-between mb-1">
							<div className="flex items-center gap-3">
								<span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
									<i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
								</span>
								<h3 className="text-base font-bold text-gray-900">Profil AI</h3>
							</div>
							<span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
								<i className="fa-brands fa-google mr-1"></i>Gemini
							</span>
						</div>
						<p className="text-xs text-gray-500 ml-10 mb-4">
							Tulis kata kunci latar belakangmu, AI merangkai paragraf profil
							yang menarik & ramah ATS.
						</p>

						<div className="space-y-3 mb-4">
							<div>
								<label
									htmlFor="ai-keywords"
									className="block text-xs font-medium text-gray-700 mb-1"
								>
									Kata Kunci / Pengalaman Utama
								</label>
								<input
									id="ai-keywords"
									value={aiKeywords}
									onChange={(e) => setAiKeywords(e.target.value)}
									type="text"
									placeholder="Cth: Lulusan akuntansi, teliti, menguasai excel, 2 tahun pengalaman"
									className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm transition"
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label
										htmlFor="ai-tone"
										className="block text-xs font-medium text-gray-700 mb-1"
									>
										Gaya Penulisan
									</label>
									<select
										id="ai-tone"
										value={aiTone}
										onChange={(e) => setAiTone(e.target.value)}
										className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:ring-primary focus:border-primary transition"
									>
										<option value="Professional & Formal">
											Professional & Formal
										</option>
										<option value="Creative & Energetic">
											Creative & Dynamic
										</option>
										<option value="Fresh Graduate / Enthusiastic">
											Fresh Graduate
										</option>
										<option value="Executive / Result-Oriented">
											Executive / Senior
										</option>
									</select>
								</div>
								<div>
									<label
										htmlFor="ai-language"
										className="block text-xs font-medium text-gray-700 mb-1"
									>
										Bahasa
									</label>
									<select
										id="ai-language"
										value={aiLanguage}
										onChange={(e) => setAiLanguage(e.target.value)}
										className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:ring-primary focus:border-primary transition"
									>
										<option value="Bahasa Indonesia">Bahasa Indonesia</option>
										<option value="English">English</option>
									</select>
								</div>
							</div>
						</div>

						<button
							type="button"
							onClick={generateProfileAI}
							disabled={isGenerating}
							className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium text-sm transition shadow-sm hover:shadow-md active:scale-[0.96] flex justify-center items-center"
						>
							<i
								className={`${isGenerating ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-sparkles"} mr-2`}
							></i>
							{isGenerating
								? "Gemini AI Sedang Merangkai..."
								: "Generate Paragraf Profil"}
						</button>

						<div className="mt-4">
							<label
								htmlFor="cv-about"
								className="block text-xs font-medium text-gray-700 mb-1"
							>
								Hasil Paragraf Profil (bisa diedit manual)
							</label>
							<textarea
								id="cv-about"
								value={cv.about}
								onChange={(e) => set({ about: e.target.value })}
								rows={4}
								className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm leading-relaxed transition"
							/>
						</div>
					</div>

					{/* Pengalaman Kerja */}
					<div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
						<div className="flex items-center justify-between mb-5">
							<div className="flex items-center gap-3">
								<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
									2
								</span>
								<h3 className="text-base font-bold text-gray-900">
									Pengalaman Kerja
								</h3>
							</div>
							<button
								type="button"
								onClick={addExp}
								className="text-xs bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium transition-colors active:scale-[0.96]"
							>
								<i className="fa-solid fa-plus mr-1"></i> Tambah
							</button>
						</div>

						{cv.experiences.map((exp, index) => (
							<div
								key={exp.id ?? index}
								className="mb-4 bg-gray-50 p-4 border border-gray-200 rounded-xl relative"
							>
								<button
									type="button"
									onClick={() => removeExp(index)}
									className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-2"
								>
									<i className="fa-solid fa-trash text-xs"></i>
								</button>
								<div className="grid grid-cols-2 gap-3 mb-2">
									<div className="col-span-2 sm:col-span-1">
										<label
											htmlFor={`exp-company-${index}`}
											className="block text-xs font-medium text-gray-500 mb-1"
										>
											Perusahaan
										</label>
										<input
											id={`exp-company-${index}`}
											value={exp.company}
											onChange={(e) =>
												updateExp(index, { company: e.target.value })
											}
											placeholder="Nama Perusahaan"
											className={`font-semibold text-sm ${inputSmCls}`}
										/>
									</div>
									<div className="col-span-2 sm:col-span-1">
										<label
											htmlFor={`exp-role-${index}`}
											className="block text-xs font-medium text-gray-500 mb-1"
										>
											Jabatan / Role
										</label>
										<input
											id={`exp-role-${index}`}
											value={exp.role}
											onChange={(e) =>
												updateExp(index, { role: e.target.value })
											}
											placeholder="Cth: Staff Marketing"
											className={`text-sm text-gray-700 ${inputSmCls}`}
										/>
									</div>
								</div>
								<div className="mb-3">
									<label
										htmlFor={`exp-period-${index}`}
										className="block text-xs font-medium text-gray-500 mb-1"
									>
										Periode
									</label>
									<input
										id={`exp-period-${index}`}
										value={exp.period}
										onChange={(e) =>
											updateExp(index, { period: e.target.value })
										}
										placeholder="Tahun (Cth: Jan 2022 - Des 2023)"
										className={`text-xs text-gray-600 ${inputSmCls}`}
									/>
								</div>
								<div className="mb-2">
									<div className="flex justify-between items-center mb-1">
										<label
											htmlFor={`exp-desc-${index}`}
											className="block text-xs font-medium text-gray-700"
										>
											Deskripsi Tugas / Pencapaian
										</label>
										<button
											type="button"
											onClick={() => enhanceExpAI(index)}
											disabled={enhancingIdx !== null}
											className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors active:scale-[0.96]"
										>
											<i
												className={`${
													enhancingIdx === index
														? "fa-solid fa-circle-notch fa-spin"
														: "fa-solid fa-wand-magic-sparkles"
												} mr-1`}
											></i>
											{enhancingIdx === index
												? "Gemini Poles..."
												: "Poles Deskripsi (Gemini AI)"}
										</button>
									</div>
									<textarea
										id={`exp-desc-${index}`}
										value={exp.desc}
										onChange={(e) => updateExp(index, { desc: e.target.value })}
										rows={3}
										placeholder="Tuliskan tugas utama atau kata kunci sederhana, lalu tekan Poles Deskripsi..."
										className="w-full text-sm border border-gray-200 rounded-md p-2 focus:border-primary focus:ring-0 leading-relaxed"
									/>
								</div>
							</div>
						))}
					</div>

					{/* Skills */}
					<div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
									3
								</span>
								<h3 className="text-base font-bold text-gray-900">
									Kemampuan / Skills
								</h3>
							</div>
							<button
								type="button"
								onClick={suggestSkillsAI}
								disabled={isSuggestingSkills}
								className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg transition-colors active:scale-[0.96] flex items-center"
							>
								<i
									className={`${isSuggestingSkills ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-lightbulb"} mr-1`}
								></i>
								Rekomendasi Skill (AI)
							</button>
						</div>
						<p className="text-xs text-gray-500 ml-10 mb-3">
							Satu skill per baris (Format: Nama Skill: Penjelasan singkat)
						</p>
						<textarea
							id="cv-skills"
							value={skillsText}
							onChange={(e) => setSkillsText(e.target.value)}
							rows={4}
							placeholder={
								"Microsoft Office: Mahir mengolah data\nKomunikasi: Kerjasama tim yang solid"
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary leading-relaxed"
						/>
					</div>
				</div>
			</div>

			{/* RIGHT PANEL: LIVE PREVIEW & CHECKOUT */}
			<div
				className={`flex flex-1 min-h-0 w-full lg:w-1/2 lg:flex bg-gray-100 relative flex-col ${
					mtab === "edit" ? "hidden" : ""
				}`}
			>
				<div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 p-3 sm:p-4 flex justify-between items-center gap-3 shadow-sm">
					<div className="min-w-0">
						<p className="text-sm font-bold text-gray-900 flex items-center">
							<span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
							Live Preview
						</p>
						<p className="text-xs text-gray-500 truncate">{templateLabel}</p>
					</div>
					<button
						type="button"
						onClick={onCheckout}
						className="shrink-0 bg-green-500 hover:bg-green-600 text-white px-5 sm:px-6 py-2.5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-shadow active:scale-[0.96] flex items-center"
					>
						<i className="fa-brands fa-whatsapp mr-2 text-lg"></i>
						<span className="hidden sm:inline">Beli PDF Bersih </span>
						<span className="sm:hidden">Beli </span>({price})
					</button>
				</div>

				<div
					ref={areaRef}
					className="flex-1 min-h-0 overflow-hidden p-6 lg:p-8 flex items-center justify-center"
				>
					<div
						style={{
							width: 794 * scale,
							height: 1123 * scale,
							position: "relative",
						}}
					>
						<CvPaper
							cv={cv}
							skills={parsedSkills}
							scale={scale}
							template={template}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export function CvPaper({
	cv,
	skills,
	scale,
	template,
	watermark = true,
}: {
	cv: CvData;
	skills: ParsedSkill[];
	scale: number;
	template: string;
	watermark?: boolean;
}) {
	return (
		<div
			className="cv-paper text-left"
			style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
		>
			{watermark && (
				<div className="watermark-overlay">
					<div className="watermark-text">
						DRAFT PREVIEW
						<br />
						<span className="text-3xl font-medium mt-2 block">
							HUBUNGI ADMIN UNTUK FILE ASLI
						</span>
					</div>
				</div>
			)}

			{template === "cv02" ? (
				<CorporateLayout cv={cv} skills={skills} />
			) : template === "cv03" ? (
				<ModernLayout cv={cv} skills={skills} />
			) : template === "cv04" ? (
				<NeoLayout cv={cv} skills={skills} />
			) : (
				<CreativeLayout cv={cv} skills={skills} />
			)}
		</div>
	);
}

function CreativeLayout({ cv, skills }: { cv: CvData; skills: ParsedSkill[] }) {
	return (
		<div className="cv-layout-kreatif">
			{/* Sidebar Kiri */}
			<div className="cv-sidebar text-gray-800">
				<div className="w-40 h-40 rounded-full mx-auto mb-8 bg-gray-300 border-4 border-white shadow-md overflow-hidden relative flex justify-center items-center">
					<i className="fa-solid fa-user text-5xl text-gray-400"></i>
				</div>

				<h4 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-800 pb-1 uppercase tracking-widest">
					Kontak
				</h4>
				<ul className="text-sm space-y-3 mb-8">
					<li className="flex items-start">
						<i className="fa-solid fa-phone mt-1 w-6 text-gray-600"></i>{" "}
						<span>{cv.phone || "-"}</span>
					</li>
					<li className="flex items-start">
						<i className="fa-solid fa-envelope mt-1 w-6 text-gray-600"></i>{" "}
						<span style={{ wordBreak: "break-all" }}>{cv.email || "-"}</span>
					</li>
					<li className="flex items-start">
						<i className="fa-solid fa-location-dot mt-1 w-6 text-gray-600"></i>{" "}
						<span>{cv.address || "-"}</span>
					</li>
				</ul>

				<h4 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-800 pb-1 uppercase tracking-widest">
					Kemampuan
				</h4>
				<ul className="text-sm space-y-2 list-disc pl-4 mb-8">
					{skills.map((skill) => (
						<li key={skill.title}>
							<strong>{skill.title}:</strong> {skill.desc}
						</li>
					))}
				</ul>
			</div>

			{/* Konten Kanan */}
			<div className="cv-main bg-white">
				<h1
					className="text-5xl font-heading font-bold text-gray-800 mb-1"
					style={{ color: "#5D4037" }}
				>
					{cv.name || "Nama Lengkap"}
				</h1>
				<h2 className="text-2xl font-light text-gray-600 tracking-widest mb-8">
					{cv.title || "Profesi"}
				</h2>

				<h3
					className="text-xl font-bold text-gray-800 mb-3 inline-block pb-1"
					style={{ color: "#5D4037", borderBottom: "2px solid #5D4037" }}
				>
					Tentang Saya
				</h3>
				<p className="text-sm text-gray-700 leading-relaxed text-justify mb-8 whitespace-pre-line">
					{cv.about ||
						"Tulis ringkasan tentang diri Anda, atau gunakan fitur AI di sebelah kiri untuk menghasilkan paragraf profesional secara otomatis."}
				</p>

				<h3
					className="text-xl font-bold text-gray-800 mb-4 inline-block pb-1"
					style={{ color: "#5D4037", borderBottom: "2px solid #5D4037" }}
				>
					Pengalaman Kerja
				</h3>

				<div className="space-y-5">
					{cv.experiences.map((exp, index) => (
						<div key={exp.id ?? index}>
							<div className="flex justify-between items-baseline mb-1">
								<h4 className="font-bold text-gray-900">
									{exp.company || "Nama Perusahaan"}
								</h4>
								<span className="text-xs text-gray-500 font-medium">
									{exp.period}
								</span>
							</div>
							<p className="text-sm italic text-gray-600 mb-1">
								{exp.role || "Jabatan"}
							</p>
							<div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
								{exp.desc || "Deskripsi pekerjaan akan muncul di sini."}
							</div>
						</div>
					))}
					{cv.experiences.length === 0 && (
						<div className="text-sm text-gray-400 italic">
							Belum ada data pengalaman.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function CorporateLayout({
	cv,
	skills,
}: {
	cv: CvData;
	skills: ParsedSkill[];
}) {
	return (
		<div className="p-14 bg-white h-full">
			<h1 className="text-4xl font-bold text-gray-900 mb-1">
				{cv.name || "Nama Lengkap"}
			</h1>
			<h2 className="text-lg text-gray-600 mb-2">{cv.title || "Profesi"}</h2>
			<p className="text-xs text-gray-500 mb-8">
				<i className="fa-solid fa-phone mr-1 w-4"></i> {cv.phone || "-"}{" "}
				&nbsp;|&nbsp;
				<i className="fa-solid fa-envelope mr-1 w-4"></i> {cv.email || "-"}{" "}
				&nbsp;|&nbsp;
				<i className="fa-solid fa-location-dot mr-1 w-4"></i>{" "}
				{cv.address || "-"}
			</p>

			<h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-3">
				Profil
			</h3>
			<p className="text-sm text-gray-700 leading-relaxed text-justify mb-8 whitespace-pre-line">
				{cv.about || "Tulis ringkasan tentang diri Anda."}
			</p>

			<h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-4">
				Pengalaman Kerja
			</h3>
			<div className="space-y-5 mb-8">
				{cv.experiences.map((exp, index) => (
					<div key={exp.id ?? index}>
						<div className="flex justify-between items-baseline mb-1">
							<h4 className="font-bold text-gray-900">
								{exp.company || "Nama Perusahaan"}
							</h4>
							<span className="text-xs text-gray-500 font-medium">
								{exp.period}
							</span>
						</div>
						<p className="text-sm italic text-gray-600 mb-1">
							{exp.role || "Jabatan"}
						</p>
						<div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
							{exp.desc || "Deskripsi pekerjaan."}
						</div>
					</div>
				))}
			</div>

			<h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-3">
				Kemampuan
			</h3>
			<ul className="text-sm text-gray-700 space-y-1">
				{skills.map((s) => (
					<li key={s.title}>
						<strong>{s.title}:</strong> {s.desc}
					</li>
				))}
			</ul>
		</div>
	);
}

function ModernLayout({ cv, skills }: { cv: CvData; skills: ParsedSkill[] }) {
	return (
		<div className="h-full">
			<div className="bg-gray-900 px-12 py-10">
				<h1 className="text-4xl font-bold text-white mb-1">
					{cv.name || "Nama Lengkap"}
				</h1>
				<h2 className="text-xl font-light text-gray-300 tracking-wide">
					{cv.title || "Profesi"}
				</h2>
			</div>
			<div className="flex">
				<div className="w-2/5 p-8 bg-gray-50 border-r border-gray-200">
					<h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-4">
						Kontak
					</h3>
					<ul className="text-sm space-y-3 mb-8">
						<li className="flex items-start">
							<i className="fa-solid fa-phone mt-1 w-5 text-indigo-600"></i>{" "}
							<span>{cv.phone || "-"}</span>
						</li>
						<li className="flex items-start">
							<i className="fa-solid fa-envelope mt-1 w-5 text-indigo-600"></i>{" "}
							<span style={{ wordBreak: "break-all" }}>{cv.email || "-"}</span>
						</li>
						<li className="flex items-start">
							<i className="fa-solid fa-location-dot mt-1 w-5 text-indigo-600"></i>{" "}
							<span>{cv.address || "-"}</span>
						</li>
					</ul>
					<h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-4">
						Kemampuan
					</h3>
					<ul className="text-sm space-y-2 list-disc pl-4">
						{skills.map((s) => (
							<li key={s.title}>
								<strong>{s.title}:</strong> {s.desc}
							</li>
						))}
					</ul>
				</div>
				<div className="w-3/5 p-8">
					<h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-3">
						Tentang Saya
					</h3>
					<p className="text-sm text-gray-700 leading-relaxed text-justify mb-8 whitespace-pre-line">
						{cv.about || "Tulis ringkasan tentang diri Anda."}
					</p>
					<h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-4">
						Pengalaman Kerja
					</h3>
					<div className="space-y-5">
						{cv.experiences.map((exp, index) => (
							<div key={exp.id ?? index}>
								<div className="flex justify-between items-baseline mb-1">
									<h4 className="font-bold text-gray-900">
										{exp.company || "Nama Perusahaan"}
									</h4>
									<span className="text-xs text-gray-500 font-medium">
										{exp.period}
									</span>
								</div>
								<p className="text-sm italic text-gray-600 mb-1">
									{exp.role || "Jabatan"}
								</p>
								<div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
									{exp.desc || "Deskripsi pekerjaan."}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function NeoLayout({ cv, skills }: { cv: CvData; skills: ParsedSkill[] }) {
	return (
		<div className="h-full">
			<div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-12 py-8 flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-heading font-bold text-white mb-1">
						{cv.name || "Nama Lengkap"}
					</h1>
					<h2 className="text-lg font-light text-indigo-100 tracking-widest">
						{cv.title || "Profesi"}
					</h2>
				</div>
				<div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0">
					<i className="fa-solid fa-user text-4xl text-white"></i>
				</div>
			</div>
			<div className="p-10">
				<p className="text-sm text-gray-700 leading-relaxed text-justify mb-6 whitespace-pre-line">
					{cv.about || "Tulis ringkasan tentang diri Anda."}
				</p>

				<div className="flex flex-wrap gap-4 text-xs text-indigo-700 mb-8">
					<span className="flex items-center">
						<i className="fa-solid fa-phone mr-1.5"></i>
						{cv.phone || "-"}
					</span>
					<span className="flex items-center">
						<i className="fa-solid fa-envelope mr-1.5"></i>
						{cv.email || "-"}
					</span>
					<span className="flex items-center">
						<i className="fa-solid fa-location-dot mr-1.5"></i>
						{cv.address || "-"}
					</span>
				</div>

				<h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-4 flex items-center">
					<span className="w-1.5 h-4 bg-indigo-600 rounded-full mr-2 inline-block"></span>
					Pengalaman Kerja
				</h3>
				<div className="border-l-2 border-indigo-100 pl-6 space-y-6 mb-8 relative">
					{cv.experiences.map((exp, index) => (
						<div key={exp.id ?? index} className="relative">
							<span className="absolute -left-[5px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100"></span>
							<div className="flex justify-between items-baseline mb-1">
								<h4 className="font-bold text-gray-900">
									{exp.company || "Nama Perusahaan"}
								</h4>
								<span className="text-xs text-gray-500 font-medium">
									{exp.period}
								</span>
							</div>
							<p className="text-sm italic text-gray-600 mb-1">
								{exp.role || "Jabatan"}
							</p>
							<div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
								{exp.desc || "Deskripsi pekerjaan."}
							</div>
						</div>
					))}
				</div>

				<h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-3 flex items-center">
					<span className="w-1.5 h-4 bg-indigo-600 rounded-full mr-2 inline-block"></span>
					Kemampuan
				</h3>
				<div className="flex flex-wrap gap-2">
					{skills.map((s) => (
						<span
							key={s.title}
							className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1.5"
						>
							<strong>{s.title}:</strong> {s.desc}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
