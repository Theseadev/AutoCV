import { useEffect, useMemo, useRef, useState } from "react";
import { callGeminiAPI } from "../api";
import {
	type CvData,
	type CvSection,
	type ParsedSkill,
	TEMPLATE_SECTIONS,
	parseSkills,
} from "../cv";

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
	// null = auto-fit; angka = zoom manual (klik % untuk kembali ke auto-fit)
	const [userScale, setUserScale] = useState<number | null>(null);
	const renderScale = userScale ?? scale;
	const zoom = (dir: 1 | -1) =>
		setUserScale((s) =>
			Math.min(1.5, Math.max(0.4, Math.round(((s ?? scale) * (dir > 0 ? 1.2 : 1 / 1.2)) * 100) / 100)),
		);
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
			experiences: (prev.experiences || []).map((e, i) =>
				i === index ? { ...e, ...patch } : e,
			),
		}));

	const addExp = () =>
		setCv((prev) => ({
			...prev,
			experiences: [
				...(prev.experiences || []),
				{ id: Date.now(), company: "", role: "", period: "", desc: "" },
			],
		}));
	const removeExp = (index: number) =>
		setCv((prev) => ({
			...prev,
			experiences: (prev.experiences || []).filter((_, i) => i !== index),
		}));

	const addList = (
		key: "pendidikans" | "penghargaans" | "organisasis",
		empty: Record<string, string>,
	) =>
		setCv((prev) =>
			({
				...prev,
				[key]: [
					...(((prev[key] as Array<Record<string, string | number>> | undefined) ??
						[])),
					{ ...empty, id: Date.now() },
				],
			}) as CvData,
		);
	const updateList = (
		key: "pendidikans" | "penghargaans" | "organisasis",
		index: number,
		patch: Record<string, string>,
	) =>
		setCv((prev) =>
			({
				...prev,
				[key]: (
					(prev[key] as Array<Record<string, string | number>> | undefined) ?? []
				).map((e, i) => (i === index ? { ...e, ...patch } : e)),
			}) as CvData,
		);
	const removeList = (
		key: "pendidikans" | "penghargaans" | "organisasis",
		index: number,
	) =>
		setCv((prev) =>
			({
				...prev,
				[key]: (
					(prev[key] as Array<Record<string, string | number>> | undefined) ?? []
				).filter((_, i) => i !== index),
			}) as CvData,
		);

	const onFotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => set({ foto: String(reader.result) });
		reader.readAsDataURL(file);
	};


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
			alert(e instanceof Error ? e.message : "Terjadi kesalahan saat menghubungi Gemini AI API.");
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
			alert(e instanceof Error ? e.message : "Gagal memoles deskripsi dengan AI.");
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
			alert(e instanceof Error ? e.message : "Gagal mendapatkan rekomendasi skill.");
		} finally {
			setIsSuggestingSkills(false);
		}
	};

	const inputCls =
		"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition";
	const inputSmCls =
		"w-full border border-gray-200 rounded-md p-1.5 focus:ring-primary focus:border-primary transition";

	const sections = TEMPLATE_SECTIONS[template] ?? TEMPLATE_SECTIONS.cv01;
	const has = (sec: CvSection) => sections.includes(sec);
	const [activeSection, setActiveSection] = useState<string | null>("informasi");
	useEffect(() => {
		if (
			(activeSection === "foto" && !has("foto")) ||
			(activeSection === "pendidikan" && !has("pendidikan"))
		)
			setActiveSection("informasi");
	}, [template]);
	return (
		<div className="h-[calc(100dvh-64px)] flex flex-col lg:flex-row overflow-hidden">
			{/* Tab bar khusus HP: Edit / Preview */}
			<div className="lg:hidden shrink-0 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 z-20">
				<div className="flex bg-gray-100 rounded-xl p-1 flex-1">
					<button
						type="button"
						onClick={() => setMtab("edit")}
						aria-pressed={mtab === "edit"}
						className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mtab === "edit" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
					>
						<i className="fa-solid fa-pen mr-1.5 text-xs"></i> Edit
					</button>
					<button
						type="button"
						onClick={() => setMtab("preview")}
						aria-pressed={mtab === "preview"}
						className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mtab === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
					>
						<i className="fa-solid fa-eye mr-1.5 text-xs"></i> Preview
					</button>
				</div>
			</div>

			{/* LEFT PANEL: FORM EDITOR */}
			<div
				className={`flex flex-col flex-1 min-h-0 h-full w-full lg:w-1/2 lg:flex bg-gray-50 border-r border-gray-200 overflow-y-auto editor-scroll p-4 sm:p-6 lg:p-8 pb-32 ${
					mtab === "preview" ? "hidden" : ""
				}`}
			>
				<div className="flex items-center mb-6">
					<button
						type="button"
						onClick={onBack}
						aria-label="Kembali ke daftar template"
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
					<div className="space-y-3">
						<button
							type="button"
							onClick={() => setActiveSection((cur) => (cur === "informasi" ? null : "informasi"))}
							aria-expanded={activeSection === "informasi"}
							className="w-full bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between gap-3 text-left hover:border-gray-300 transition-colors"
						>
							<span className="flex items-center gap-3">
								<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
									<i className="fa-solid fa-user text-[11px]"></i>
								</span>
								<span className="text-base font-bold text-gray-900">Informasi Pribadi</span>
							</span>
							<i className={`fa-solid fa-chevron-down text-gray-400 text-sm transition-transform duration-300 ${activeSection === "informasi" ? "rotate-180" : ""}`}></i>
						</button>
						<div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${activeSection === "informasi" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
							<div className="overflow-hidden">
								<div className="space-y-3 pt-1">
					<div id="sec-informasi" className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
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
					{has("tentang") && (
					<div id="sec-ai" className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 border-l-4 border-l-indigo-500 shadow-sm">
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
					)}
						{has("hobi") && (
						<div id="sec-hobi" className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
							<div className="flex items-center gap-3 mb-4">
								<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
									<i className="fa-solid fa-heart text-[11px]"></i>
								</span>
								<h3 className="text-base font-bold text-gray-900">Hobi</h3>
							</div>
							<input value={cv.hobi ?? ""} onChange={(e) => set({ hobi: e.target.value })} placeholder="Cth: Membaca, Menulis, Fotografi" className={`text-sm text-gray-700 ${inputSmCls}`} />
						</div>
						)}
								</div>
							</div>
						</div>
					</div>

					{has("foto") && (
					<div className="space-y-3">
						<button
							type="button"
							onClick={() => setActiveSection((cur) => (cur === "foto" ? null : "foto"))}
							aria-expanded={activeSection === "foto"}
							className="w-full bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between gap-3 text-left hover:border-gray-300 transition-colors"
						>
							<span className="flex items-center gap-3">
								<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
									<i className="fa-solid fa-camera text-[11px]"></i>
								</span>
								<span className="text-base font-bold text-gray-900">Foto Profil</span>
							</span>
							<i className={`fa-solid fa-chevron-down text-gray-400 text-sm transition-transform duration-300 ${activeSection === "foto" ? "rotate-180" : ""}`}></i>
						</button>
						<div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${activeSection === "foto" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
							<div className="overflow-hidden">
								<div className="space-y-3 pt-1">
						<div id="sec-foto" className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
							<div className="flex items-center gap-3 mb-5">
								<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
									<i className="fa-solid fa-camera text-[11px]"></i>
								</span>
								<h3 className="text-base font-bold text-gray-900">Foto Profil</h3>
							</div>
							<div className="flex items-center gap-4">
								<div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
									{cv.foto ? (
										<img src={cv.foto} alt="Foto profil" className="w-full h-full object-cover" />
									) : (
										<i className="fa-solid fa-user text-gray-300 text-3xl"></i>
									)}
								</div>
								<div>
									<label className="block text-xs font-medium text-gray-700 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg inline-block transition-colors">
										<i className="fa-solid fa-upload mr-1.5"></i>Upload Foto
										<input type="file" accept="image/*" className="hidden" onChange={onFotoFile} />
									</label>
									{cv.foto && (
										<button type="button" onClick={() => set({ foto: "" })} className="block text-xs text-red-500 hover:text-red-700 font-medium mt-2">
											<i className="fa-solid fa-trash mr-1"></i>Hapus Foto
										</button>
									)}
								</div>
							</div>
						</div>
								</div>
							</div>
						</div>
					</div>
					)}

					{has("pendidikan") && (
					<div className="space-y-3">
						<button
							type="button"
							onClick={() => setActiveSection((cur) => (cur === "pendidikan" ? null : "pendidikan"))}
							aria-expanded={activeSection === "pendidikan"}
							className="w-full bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between gap-3 text-left hover:border-gray-300 transition-colors"
						>
							<span className="flex items-center gap-3">
								<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
									<i className="fa-solid fa-graduation-cap text-[11px]"></i>
								</span>
								<span className="text-base font-bold text-gray-900">Pendidikan</span>
							</span>
							<i className={`fa-solid fa-chevron-down text-gray-400 text-sm transition-transform duration-300 ${activeSection === "pendidikan" ? "rotate-180" : ""}`}></i>
						</button>
						<div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${activeSection === "pendidikan" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
							<div className="overflow-hidden">
								<div className="space-y-3 pt-1">
						<div id="sec-lulusan" className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
							<div className="flex items-center justify-between mb-5">
								<div className="flex items-center gap-3">
									<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
										<i className="fa-solid fa-graduation-cap text-[11px]"></i>
									</span>
									<h3 className="text-base font-bold text-gray-900">Pendidikan</h3>
								</div>
								<button type="button" onClick={() => addList("pendidikans", { institusi: "", jurusan: "", tahun: "", kegiatan: "" })} className="text-xs bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium transition-colors active:scale-[0.96]">
									<i className="fa-solid fa-plus mr-1"></i> Tambah
								</button>
							</div>
							{(cv.pendidikans || []).map((it, i) => (
								<div key={it.id ?? i} className="mb-4 bg-gray-50 p-4 border border-gray-200 rounded-xl relative">
									<button type="button" onClick={() => removeList("pendidikans", i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-2">
										<i className="fa-solid fa-trash text-xs"></i>
									</button>
									<div className="grid grid-cols-2 gap-3">
										<div className="col-span-2">
											<label htmlFor={`pendidikans-institusi-${i}`} className="block text-xs font-medium text-gray-500 mb-1">Institusi</label>
											<input id={`pendidikans-institusi-${i}`} value={it.institusi} onChange={(e) => updateList("pendidikans", i, { institusi: e.target.value })} placeholder="Nama Sekolah / Universitas" className={`text-sm text-gray-700 ${inputSmCls}`} />
										</div>
										<div className="">
											<label htmlFor={`pendidikans-jurusan-${i}`} className="block text-xs font-medium text-gray-500 mb-1">Jurusan</label>
											<input id={`pendidikans-jurusan-${i}`} value={it.jurusan} onChange={(e) => updateList("pendidikans", i, { jurusan: e.target.value })} placeholder="Cth: S1 Manajemen" className={`text-sm text-gray-700 ${inputSmCls}`} />
										</div>
										<div className="">
											<label htmlFor={`pendidikans-tahun-${i}`} className="block text-xs font-medium text-gray-500 mb-1">Tahun</label>
											<input id={`pendidikans-tahun-${i}`} value={it.tahun} onChange={(e) => updateList("pendidikans", i, { tahun: e.target.value })} placeholder="Cth: 2019 - 2023" className={`text-xs text-gray-600 ${inputSmCls}`} />
										</div>
										<div className="col-span-2">
											<label htmlFor={`pendidikans-kegiatan-${i}`} className="block text-xs font-medium text-gray-500 mb-1">Kegiatan <span className="text-gray-400 font-normal">(opsional)</span></label>
											<textarea id={`pendidikans-kegiatan-${i}`} value={it.kegiatan ?? ""} onChange={(e) => updateList("pendidikans", i, { kegiatan: e.target.value })} placeholder="Cth: Anggota Himpunan Mahasiswa, Panitia Dies Natalis" rows={2} className={`text-xs text-gray-600 resize-none ${inputSmCls}`} />
										</div>
									</div>
								</div>
							))}
						</div>
						{has("penghargaan") && (
						<div id="sec-penghargaan" className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
							<div className="flex items-center justify-between mb-5">
								<div className="flex items-center gap-3">
									<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
										<i className="fa-solid fa-trophy text-[11px]"></i>
									</span>
									<h3 className="text-base font-bold text-gray-900">Penghargaan</h3>
								</div>
								<button type="button" onClick={() => addList("penghargaans", { judul: "", tahun: "" })} className="text-xs bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium transition-colors active:scale-[0.96]">
									<i className="fa-solid fa-plus mr-1"></i> Tambah
								</button>
							</div>
							{(cv.penghargaans || []).map((it, i) => (
								<div key={it.id ?? i} className="mb-4 bg-gray-50 p-4 border border-gray-200 rounded-xl relative">
									<button type="button" onClick={() => removeList("penghargaans", i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-2">
										<i className="fa-solid fa-trash text-xs"></i>
									</button>
									<div className="grid grid-cols-2 gap-3">
										<div className="">
											<label htmlFor={`pendidikans-judul-${i}`} className="block text-xs font-medium text-gray-500 mb-1">Judul Penghargaan</label>
											<input id={`pendidikans-judul-${i}`} value={it.judul} onChange={(e) => updateList("penghargaans", i, { judul: e.target.value })} placeholder="Cth: Juara 1 Debat" className={`text-sm text-gray-700 ${inputSmCls}`} />
										</div>
										<div className="">
											<label htmlFor={`pendidikans-tahun-${i}`} className="block text-xs font-medium text-gray-500 mb-1">Tahun</label>
											<input id={`pendidikans-tahun-${i}`} value={it.tahun} onChange={(e) => updateList("penghargaans", i, { tahun: e.target.value })} placeholder="Cth: 2022" className={`text-xs text-gray-600 ${inputSmCls}`} />
										</div>
									</div>
								</div>
							))}
						</div>
						)}
								</div>
							</div>
						</div>
					</div>
					)}

					<div className="space-y-3">
						<button
							type="button"
							onClick={() => setActiveSection((cur) => (cur === "pengalaman" ? null : "pengalaman"))}
							aria-expanded={activeSection === "pengalaman"}
							className="w-full bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between gap-3 text-left hover:border-gray-300 transition-colors"
						>
							<span className="flex items-center gap-3">
								<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
									<i className="fa-solid fa-briefcase text-[11px]"></i>
								</span>
								<span className="text-base font-bold text-gray-900">Pengalaman</span>
							</span>
							<i className={`fa-solid fa-chevron-down text-gray-400 text-sm transition-transform duration-300 ${activeSection === "pengalaman" ? "rotate-180" : ""}`}></i>
						</button>
						<div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${activeSection === "pengalaman" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
							<div className="overflow-hidden">
								<div className="space-y-3 pt-1">
					{has("pengalaman") && (
					<div id="sec-pengalaman" className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
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

						{(cv.experiences || []).map((exp, index) => (
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
					)}
						{has("organisasi") && (
						<div id="sec-organisasi" className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
								<div className="flex items-center justify-between mb-5">
								<div className="flex items-center gap-3">
									<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
										<i className="fa-solid fa-users text-[11px]"></i>
									</span>
									<h3 className="text-base font-bold text-gray-900">Pengalaman Organisasi</h3>
								</div>
								<button type="button" onClick={() => addList("organisasis", { instansi: "", posisi: "", tanggal: "", deskripsi: "" })} className="text-xs bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium transition-colors active:scale-[0.96]">
									<i className="fa-solid fa-plus mr-1"></i> Tambah
								</button>
								</div>
								{(cv.organisasis || []).map((it, i) => (
									<div key={it.id ?? i} className="mb-4 bg-gray-50 p-4 border border-gray-200 rounded-xl relative">
										<button type="button" onClick={() => removeList("organisasis", i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-2">
											<i className="fa-solid fa-trash text-xs"></i>
										</button>
										<div className="grid grid-cols-2 gap-3">
											<div className="col-span-2">
												<label htmlFor={`pendidikans-instansi-${i}`} className="block text-xs font-medium text-gray-500 mb-1">Instansi</label>
												<input id={`pendidikans-instansi-${i}`} value={it.instansi} onChange={(e) => updateList("organisasis", i, { instansi: e.target.value })} placeholder="Nama Organisasi / Komunitas" className={`text-sm text-gray-700 ${inputSmCls}`} />
											</div>
											<div className="">
												<label htmlFor={`pendidikans-posisi-${i}`} className="block text-xs font-medium text-gray-500 mb-1">Posisi</label>
												<input id={`pendidikans-posisi-${i}`} value={it.posisi} onChange={(e) => updateList("organisasis", i, { posisi: e.target.value })} placeholder="Cth: Ketua Divisi" className={`text-sm text-gray-700 ${inputSmCls}`} />
											</div>
											<div className="">
												<label htmlFor={`pendidikans-tanggal-${i}`} className="block text-xs font-medium text-gray-500 mb-1">Periode</label>
												<input id={`pendidikans-tanggal-${i}`} value={it.tanggal} onChange={(e) => updateList("organisasis", i, { tanggal: e.target.value })} placeholder="Cth: 2021 - 2022" className={`text-xs text-gray-600 ${inputSmCls}`} />
											</div>
											<div className="col-span-2">
												<label htmlFor={`pendidikans-deskripsi-${i}`} className="block text-xs font-medium text-gray-500 mb-1">Deskripsi / Pencapaian</label>
												<textarea id={`pendidikans-deskripsi-${i}`} value={it.deskripsi} onChange={(e) => updateList("organisasis", i, { deskripsi: e.target.value })} rows={3} placeholder="Tuliskan tugas atau pencapaian, satu baris per poin" className="w-full text-sm border border-gray-200 rounded-md p-2 focus:border-primary focus:ring-0 leading-relaxed" />
											</div>
										</div>
									</div>
								))}
						</div>
						)}
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<button
							type="button"
							onClick={() => setActiveSection((cur) => (cur === "kemampuan" ? null : "kemampuan"))}
							aria-expanded={activeSection === "kemampuan"}
							className="w-full bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between gap-3 text-left hover:border-gray-300 transition-colors"
						>
							<span className="flex items-center gap-3">
								<span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
									<i className="fa-solid fa-bolt text-[11px]"></i>
								</span>
								<span className="text-base font-bold text-gray-900">Kemampuan</span>
							</span>
							<i className={`fa-solid fa-chevron-down text-gray-400 text-sm transition-transform duration-300 ${activeSection === "kemampuan" ? "rotate-180" : ""}`}></i>
						</button>
						<div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${activeSection === "kemampuan" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
							<div className="overflow-hidden">
								<div className="space-y-3 pt-1">
					{has("kemampuan") && (
					<div id="sec-skills" className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
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
					)}
								</div>
							</div>
						</div>
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
					<fieldset
						aria-label="Perbesar atau perkecil pratinjau"
						className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-1 shrink-0 border-0 m-0 min-w-0"
					>
						<button
							type="button"
							onClick={() => zoom(-1)}
							aria-label="Perkecil pratinjau"
							className="w-8 h-8 rounded-md text-gray-600 hover:bg-white hover:text-gray-900 flex items-center justify-center transition-colors"
						>
							<i className="fa-solid fa-minus text-xs"></i>
						</button>
						<button
							type="button"
							onClick={() => setUserScale(null)}
							title="Klik untuk sesuaikan otomatis"
							aria-label={`Perbesaran saat ini ${Math.round(renderScale * 100)} persen. Klik untuk sesuaikan otomatis`}
							className="h-8 px-2 rounded-md text-xs font-bold tabular-nums text-gray-700 hover:bg-white transition-colors"
						>
							{Math.round(renderScale * 100)}%
						</button>
						<button
							type="button"
							onClick={() => zoom(1)}
							aria-label="Perbesar pratinjau"
							className="w-8 h-8 rounded-md text-gray-600 hover:bg-white hover:text-gray-900 flex items-center justify-center transition-colors"
						>
							<i className="fa-solid fa-plus text-xs"></i>
						</button>
					</fieldset>
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

				<section
					ref={areaRef}
					aria-label="Pratinjau CV"
					className="flex-1 min-h-0 overflow-auto p-6 lg:p-8 flex"
				>
					<div
						className="m-auto"
						style={{
							width: 794 * renderScale,
							height: 1123 * renderScale,
							position: "relative",
						}}
					>
						<CvPaper
							cv={cv}
							skills={parsedSkills}
							scale={renderScale}
							template={template}
						/>
					</div>
				</section>
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
				<GeometricLayout cv={cv} skills={skills} />
			) : template === "cv05" ? (
				<LuxLayout cv={cv} skills={skills} />
			) : template === "cv06" ? (
				<DevLayout cv={cv} skills={skills} />
			) : template === "cv07" ? (
				<CreamLayout cv={cv} skills={skills} />
			) : (
				<EditorialLayout cv={cv} skills={skills} />
			)}
		</div>
	);
}

function EditorialLayout({ cv, skills }: { cv: CvData; skills: ParsedSkill[] }) {
	return (
		<div className="h-full bg-[#FDFBF7]">
			{/* Masthead kertas hangat: nama serif + garis emas, kontak inline */}
			<div className="px-14 pt-12 pb-6 border-b-2 border-[#C9A227]">
				<h1 className="font-heading font-bold text-[38px] leading-[1.1] text-[#211A17]">
					{cv.name || "Nama Lengkap"}
				</h1>
				<p className="text-[11px] tracking-[0.3em] uppercase text-[#8A6D3B] font-semibold mt-2">
					{cv.title || "Profesi"}
				</p>
				<div className="flex gap-6 mt-5 text-[11px] text-[#4A403A]">
					<span>
						<i className="fa-solid fa-phone w-3 text-[#C9A227] mr-1.5"></i>
						{cv.phone || "-"}
					</span>
					<span>
						<i className="fa-solid fa-envelope w-3 text-[#C9A227] mr-1.5"></i>
						{cv.email || "-"}
					</span>
					<span>
						<i className="fa-solid fa-location-dot w-3 text-[#C9A227] mr-1.5"></i>
						{cv.address || "-"}
					</span>
				</div>
			</div>
			<div className="flex px-14 py-9 gap-10">
				<div className="w-[42%]">
					<EdSection label="Tentang Saya">
						<p className="text-[12px] text-[#4A403A] leading-relaxed text-justify whitespace-pre-line">
							{cv.about || "Tulis ringkasan tentang diri Anda."}
						</p>
					</EdSection>
					<EdSection label="Riwayat Pendidikan">
						{(cv.pendidikans || []).map((pd, index) => (
							<div
								key={pd.id ?? index}
								className="mb-3.5 pb-3 border-b border-dashed border-[#E8E0D3] last:border-0 last:pb-0"
							>
								<div className="flex justify-between items-baseline">
									<h4 className="font-bold text-[12.5px] text-[#211A17]">
										{pd.institusi || "-"}
									</h4>
									<span className="text-[10px] text-[#A79A8A] tracking-wide">
										{pd.tahun}
									</span>
								</div>
								<p className="text-[11px] font-semibold text-[#C9A227] mt-0.5">
									{pd.jurusan || "-"}
								</p>
								{pd.kegiatan && (
									<p className="text-[11px] text-[#4A403A] mt-1">{pd.kegiatan}</p>
								)}
							</div>
						))}
					</EdSection>
				</div>
				<div className="flex-1">
					<EdSection label="Pengalaman Kerja">
						{(cv.experiences || []).map((exp, index) => (
							<div
								key={exp.id ?? index}
								className="mb-4 pb-3.5 border-b border-dashed border-[#E8E0D3]"
							>
								<div className="flex justify-between items-baseline">
									<h4 className="font-bold text-[13.5px] text-[#211A17]">
										{exp.company || "Nama Perusahaan"}
									</h4>
									<span className="text-[10px] text-[#A79A8A] tracking-wide">
										{exp.period}
									</span>
								</div>
								<p className="text-[11.5px] font-semibold text-[#C9A227] my-0.5">
									{exp.role || "Jabatan"}
								</p>
								<p className="text-[11.5px] text-[#4A403A] leading-relaxed whitespace-pre-line">
									{exp.desc}
								</p>
							</div>
						))}
					</EdSection>
					<EdSection label="Kemampuan">
						{skills.map((s) => (
							<p
								key={s.title}
								className="text-[11.5px] text-[#4A403A] leading-relaxed mb-2.5"
							>
								<span className="font-semibold text-[#211A17]">{s.title}</span>
								<span className="text-[#C9A227]"> — </span>
								{s.desc}
							</p>
						))}
					</EdSection>
				</div>
			</div>
		</div>
	);
}

function EdSection({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="mb-4">
			<h3 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#3B2F2A]">
				{label}
			</h3>
			<div className="w-9 h-0.5 bg-[#C9A227] mt-1.5 mb-3"></div>
			{children}
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

			<h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-3">
				Riwayat Pendidikan
			</h3>
			<div className="space-y-4 mb-8">
				{(cv.pendidikans || []).map((pd, index) => (
					<div key={pd.id ?? index} className="flex justify-between items-baseline">
						<div>
							<h4 className="font-bold text-gray-900">
								{pd.institusi || "-"}
							</h4>
							<p className="text-sm text-gray-600">{pd.jurusan || "-"}</p>
							{pd.kegiatan && <p className="text-xs text-gray-500 mt-1">{pd.kegiatan}</p>}
						</div>
						<span className="text-xs text-gray-500 font-medium">
							{pd.tahun}
						</span>
					</div>
				))}
			</div>

			<h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-4">
				Pengalaman Kerja
			</h3>
			<div className="space-y-5 mb-8">
				{(cv.experiences || []).map((exp, index) => (
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
				</div>
				<div className="w-3/5 p-8">
					<h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-3">
						Tentang Saya
					</h3>
					<p className="text-sm text-gray-700 leading-relaxed text-justify mb-8 whitespace-pre-line">
						{cv.about || "Tulis ringkasan tentang diri Anda."}
					</p>
					<h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-4">
						Riwayat Pendidikan
					</h3>
					<div className="space-y-4 mb-8">
						{(cv.pendidikans || []).map((pd, index) => (
							<div key={pd.id ?? index} className="flex justify-between items-baseline">
								<div>
									<h4 className="font-bold text-gray-900">
										{pd.institusi || "-"}
									</h4>
									<p className="text-sm text-gray-600">{pd.jurusan || "-"}</p>
									{pd.kegiatan && <p className="text-xs text-gray-500 mt-1">{pd.kegiatan}</p>}
								</div>
								<span className="text-xs text-gray-500">{pd.tahun}</span>
							</div>
						))}
					</div>
					<h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-4">
						Pengalaman Kerja
					</h3>
					<div className="space-y-5">
						{(cv.experiences || []).map((exp, index) => (
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
					<h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mt-8 mb-4">
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
			</div>
		</div>
	);
}

function GeometricLayout({ cv, skills }: { cv: CvData; skills: ParsedSkill[] }) {
	return (
		<div className="h-full bg-white">
			{/* Header navy + pita diagonal */}
			<div className="relative bg-[#0F172A] text-white px-14 py-9 overflow-hidden">
				<div className="absolute top-0 -right-14 w-52 h-full bg-[#4F46E5] -skew-x-[18deg]"></div>
				<div className="absolute top-6 right-40 w-4 h-4 rounded-full bg-[#7C3AED]"></div>
				<div className="absolute bottom-5 right-64 w-2.5 h-2.5 rounded-sm bg-white/40"></div>
				<div className="relative">
					<h1 className="font-heading font-bold text-[36px] leading-[1.15]">
						{cv.name || "Nama Lengkap"}
					</h1>
					<p className="text-[13px] text-indigo-200 mt-0.5">{cv.title || "Profesi"}</p>
				</div>
			</div>
			{/* Tile kontak */}
			<div className="bg-indigo-50 px-14 py-3 flex gap-7 text-[11.5px] text-indigo-900 font-medium">
				<span className="flex items-center gap-2.5 max-w-[240px]">
					<span className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 text-[12px] text-indigo-600">
						<i className="fa-solid fa-phone"></i>
					</span>
					<span className="truncate">{cv.phone || "-"}</span>
				</span>
				<span className="flex items-center gap-2.5 max-w-[240px]">
					<span className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 text-[12px] text-indigo-600">
						<i className="fa-solid fa-envelope"></i>
					</span>
					<span className="truncate">{cv.email || "-"}</span>
				</span>
				<span className="flex items-center gap-2.5 max-w-[240px]">
					<span className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 text-[12px] text-indigo-600">
						<i className="fa-solid fa-location-dot"></i>
					</span>
					<span className="truncate">{cv.address || "-"}</span>
				</span>
			</div>
			<div className="flex px-14 py-8 gap-9">
				<div className="w-[36%]">
					<h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-3.5">
						Tentang Saya
					</h3>
					<p className="text-[11.5px] text-slate-600 leading-relaxed text-justify mb-5 whitespace-pre-line">
						{cv.about || "Tulis ringkasan tentang diri Anda."}
					</p>
					<h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-3.5">
						Riwayat Pendidikan
					</h3>
					{(cv.pendidikans || []).map((pd, index) => (
						<div key={pd.id ?? index} className="flex gap-3.5 mb-3.5">
							<div className="w-7 h-7 rounded-md bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
								{String(index + 1).padStart(2, "0")}
							</div>
							<div className="flex-1 border-b border-slate-100 pb-3.5">
								<div className="flex justify-between items-baseline">
									<h4 className="font-bold text-[13px] text-slate-900">
										{pd.institusi || "-"}
									</h4>
									<span className="text-[10px] text-slate-400">{pd.tahun}</span>
								</div>
								<p className="text-[11px] font-semibold text-indigo-600 mt-0.5">
									{pd.jurusan || "-"}
								</p>
								{pd.kegiatan && (
									<p className="text-[11px] text-slate-500 mt-1">{pd.kegiatan}</p>
								)}
							</div>
						</div>
					))}
				</div>
				<div className="flex-1">
					<h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-3.5">
						Pengalaman Kerja
					</h3>
					{(cv.experiences || []).map((exp, index) => (
						<div key={exp.id ?? index} className="flex gap-3.5 mb-3.5">
							<div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
								{String(index + 1).padStart(2, "0")}
							</div>
							<div className="flex-1 border-b border-slate-100 pb-3.5">
								<div className="flex justify-between items-baseline">
									<h4 className="font-bold text-[13px] text-slate-900">
										{exp.company || "Nama Perusahaan"}
									</h4>
									<span className="text-[10px] text-slate-400">{exp.period}</span>
								</div>
								<p className="text-[11px] font-semibold text-indigo-600 mt-0.5 mb-1">
									{exp.role || "Jabatan"}
								</p>
								<p className="text-[11.5px] text-slate-600 leading-relaxed whitespace-pre-line">
									{exp.desc}
								</p>
							</div>
						</div>
					))}
					<h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-3.5 mt-5">
						Kemampuan
					</h3>
					{skills.map((s, i) => (
						<div key={s.title} className="flex gap-2.5 mb-3 text-[11.5px] text-slate-700">
							<span className="text-indigo-500 font-mono font-bold shrink-0">
								{String(i + 1).padStart(2, "0")}
							</span>
							<p className="leading-relaxed">
								<span className="font-semibold text-slate-900">{s.title}</span>
								<span className="text-slate-400"> — </span>
								{s.desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

const serif = { fontFamily: "'Playfair Display', serif" };

function LuxLayout({ cv, skills }: { cv: CvData; skills: ParsedSkill[] }) {
	return (
		<div className="h-full bg-white" style={serif}>
			<div className="text-center px-14 pt-12 pb-5">
				<h1 className="text-[40px] font-bold tracking-wide" style={serif}>
					{cv.name || "Nama Lengkap"}
				</h1>
				<p className="text-[11px] tracking-[0.4em] uppercase text-gray-500 mt-2.5 font-sans font-semibold">
					{cv.title || "Profesi"}
				</p>
				<div className="border-t border-b border-gray-900 h-[5px] mx-auto mt-5"></div>
			</div>
			<p className="text-center text-[10.5px] tracking-[0.2em] uppercase text-gray-400 font-sans">
				{cv.phone || "-"} &nbsp;·&nbsp; {cv.email || "-"} &nbsp;·&nbsp;{" "}
				{cv.address || "-"}
			</p>
			<div className="flex px-14 pt-7 gap-9">
				<div className="w-[40%] pr-7 border-r border-gray-200">
					<LuxSection>Tentang Saya</LuxSection>
					<p className="text-[12px] text-gray-700 leading-relaxed text-justify whitespace-pre-line font-sans">
						{cv.about || "Tulis ringkasan tentang diri Anda."}
					</p>
				</div>
				<div className="flex-1">
					<LuxSection>Riwayat Pendidikan</LuxSection>
					{(cv.pendidikans || []).map((pd, index) => (
						<div key={pd.id ?? index} className="mb-4 pb-3.5 border-b border-gray-100">
							<div className="flex justify-between items-baseline">
								<h4 className="text-[13.5px] font-bold" style={serif}>
									{pd.institusi || "-"}
								</h4>
								<span className="text-[9.5px] tracking-[0.2em] uppercase text-gray-400 font-sans">
									{pd.tahun}
								</span>
							</div>
							<p className="text-[11px] italic text-gray-500 mt-0.5 font-sans">
								{pd.jurusan || "-"}
							</p>
							{pd.kegiatan && (
								<p className="text-[10.5px] text-gray-400 mt-1 font-sans">{pd.kegiatan}</p>
							)}
						</div>
					))}
					<LuxSection>Pengalaman Kerja</LuxSection>
					{(cv.experiences || []).map((exp, index) => (
						<div key={exp.id ?? index} className="mb-4 pb-3.5 border-b border-gray-100">
							<div className="flex justify-between items-baseline">
								<h4 className="text-[13.5px] font-bold" style={serif}>
									{exp.company || "Nama Perusahaan"}
								</h4>
								<span className="text-[9.5px] tracking-[0.2em] uppercase text-gray-400 font-sans">
									{exp.period}
								</span>
							</div>
							<p className="text-[11px] italic text-gray-500 mt-0.5 mb-1.5 font-sans">
								{exp.role || "Jabatan"}
							</p>
							<p className="text-[11.5px] text-gray-600 leading-relaxed whitespace-pre-line font-sans">
								{exp.desc}
							</p>
						</div>
					))}
					<LuxSection>Kemampuan</LuxSection>
					{skills.map((s) => (
						<div key={s.title} className="text-[12px] text-gray-700 mb-2 font-sans">
							<strong>{s.title}</strong>
							<span className="text-gray-400"> — </span>
							{s.desc}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function LuxSection({ children }: { children: React.ReactNode }) {
	return (
		<div className="mb-4">
			<h3 className="text-[17px] italic font-bold" style={serif}>
				{children}
			</h3>
			<div className="w-full h-px bg-gray-200 mt-1.5"></div>
		</div>
	);
}

const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" };

function DevLayout({ cv, skills }: { cv: CvData; skills: ParsedSkill[] }) {
	return (
		<div className="h-full bg-white flex">
			<div className="w-3.5 bg-indigo-600 shrink-0"></div>
			<div className="flex-1 px-12 py-10">
				<p className="text-[11px] text-gray-400" style={mono}>
					~/cv/{cv.name.toLowerCase().replace(/\s+/g, "-") || "nama"}
				</p>
				<h1 className="font-heading font-bold text-[32px] text-gray-900 mt-1">
					{cv.name || "Nama Lengkap"}
				</h1>
				<p className="text-[12px] text-indigo-600 font-medium mt-0.5" style={mono}>
					&gt; {cv.title || "Profesi"}
				</p>
				<p className="text-[10.5px] text-gray-400 mt-2.5" style={mono}>
					{cv.phone || "-"} / {cv.email || "-"} / {cv.address || "-"}
				</p>
				<DevTag>tentang</DevTag>
				<p className="text-[11.5px] text-gray-600 leading-relaxed whitespace-pre-line">
					{cv.about || "Tulis ringkasan tentang diri Anda."}
				</p>
				<DevTag>pendidikan</DevTag>
				{(cv.pendidikans || []).map((pd, index) => (
					<div key={pd.id ?? index} className="border border-gray-200 rounded-lg px-4 py-3 mb-3">
						<div className="flex justify-between items-baseline">
							<h4 className="font-bold text-[13px] text-gray-900">
								{pd.institusi || "-"}
							</h4>
							<span className="text-[10px] text-gray-400" style={mono}>
								{pd.tahun}
							</span>
						</div>
						<p className="text-[11px] text-indigo-600 mt-0.5 font-medium" style={mono}>
							{pd.jurusan || "-"}
						</p>
						{pd.kegiatan && (
							<p className="text-[11px] text-gray-500 mt-1" style={mono}>
								{pd.kegiatan}
							</p>
						)}
					</div>
				))}
				<DevTag>pengalaman</DevTag>
				{(cv.experiences || []).map((exp, index) => (
					<div
						key={exp.id ?? index}
						className="border border-gray-200 rounded-lg px-4 py-3 mb-3"
					>
						<div className="flex justify-between items-baseline">
							<h4 className="font-bold text-[13px] text-gray-900">
								{exp.company || "Nama Perusahaan"}
							</h4>
							<span className="text-[10px] text-gray-400" style={mono}>
								{exp.period}
							</span>
						</div>
						<p className="text-[11px] text-gray-500 mt-0.5 mb-1">
							{exp.role || "Jabatan"}
						</p>
						<p className="text-[11.5px] text-gray-600 leading-relaxed whitespace-pre-line">
							{exp.desc}
						</p>
					</div>
				))}
				<DevTag>kemampuan</DevTag>
				<div className="flex flex-wrap">
					{skills.map((s) => (
						<span
							key={s.title}
							className="border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-[10.5px] mr-1.5 mb-1.5"
							style={mono}
						>
							{s.title}: {s.desc}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

function DevTag({ children }: { children: React.ReactNode }) {
	return (
		<p className="text-[10.5px] text-indigo-600 font-semibold mt-5 mb-2.5" style={mono}>
			{"// "}{children}
		</p>
	);
}

// cv07 Classic Fresh: sidebar krem + aksen cokelat, gaya fresh graduate (spesifikasi template-cv07.html)
function CreamLayout({ cv, skills }: { cv: CvData; skills: ParsedSkill[] }) {
	const pendidikans = cv.pendidikans || [];
	const penghargaans = cv.penghargaans || [];
	const organisasis = cv.organisasis || [];
	return (
		<div className="flex h-full">
			<aside className="w-[35%] bg-[#EAE2D6] p-8 overflow-hidden">
				{cv.foto ? (
					<img
						src={cv.foto}
						alt="Foto profil"
						className="w-40 h-40 rounded-full object-cover mx-auto mb-6 border-4 border-white shadow-md"
					/>
				) : (
					<div className="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-white shadow-md bg-white flex items-center justify-center">
						<i className="fa-solid fa-user text-6xl text-[#C9BBA8]"></i>
					</div>
				)}
				<h3 className="font-bold text-[#664229] text-xl mb-4 mt-6">Kontak</h3>
				<ul className="space-y-3">
					<li className="flex items-center gap-3 text-sm text-gray-800">
						<i className="fa-solid fa-phone w-4 text-[#664229]"></i>
						<span>{cv.phone || "-"}</span>
					</li>
					<li className="flex items-center gap-3 text-sm text-gray-800">
						<i className="fa-solid fa-envelope w-4 text-[#664229]"></i>
						<span className="break-all">{cv.email || "-"}</span>
					</li>
					<li className="flex items-center gap-3 text-sm text-gray-800">
						<i className="fa-solid fa-location-dot w-4 text-[#664229]"></i>
						<span>{cv.address || "-"}</span>
					</li>
				</ul>
				{penghargaans.length > 0 && (
					<>
						<h3 className="font-bold text-[#664229] text-xl mb-4 mt-6">Penghargaan</h3>
						<ul className="list-disc pl-5 space-y-2">
							{penghargaans.map((a) => (
								<li key={a.id} className="text-sm text-gray-800">
									<strong className="text-[#664229]">{a.judul}</strong>
									{a.tahun ? ` — ${a.tahun}` : ""}
								</li>
							))}
						</ul>
					</>
				)}
				{cv.hobi && (
					<>
						<h3 className="font-bold text-[#664229] text-xl mb-4 mt-6">Hobi</h3>
						<p className="text-sm text-gray-800">{cv.hobi}</p>
					</>
				)}
			</aside>
			<section className="w-[65%] bg-white p-10 overflow-hidden">
				<h1 className="font-extrabold text-[40px] text-[#664229] capitalize leading-tight mb-2">
					{cv.name || "Nama Lengkap"}
				</h1>
				<h2 className="text-2xl text-gray-700 tracking-[0.2em] uppercase mb-8">
					{cv.title || "Profesi"}
				</h2>
				<h3 className="font-bold text-2xl text-[#664229] mb-4 mt-8">Tentang Saya</h3>
				<p className="text-justify text-gray-700 text-sm leading-relaxed whitespace-pre-line">
					{cv.about || "Tulis ringkasan tentang diri Anda."}
				</p>
				{pendidikans.length > 0 && (
					<>
						<h3 className="font-bold text-2xl text-[#664229] mb-4 mt-8">
							Riwayat Pendidikan
						</h3>
						{pendidikans.map((pd) => (
							<div key={pd.id} className="mb-5">
								<h4 className="font-bold text-[#664229]">
									{pd.institusi || "-"}
								</h4>
								<p className="text-sm text-gray-600">
									{pd.jurusan || "-"}
									{pd.tahun ? ` · ${pd.tahun}` : ""}
								</p>
								{pd.kegiatan && (
									<p className="text-xs text-gray-500 mt-1">{pd.kegiatan}</p>
								)}
							</div>
						))}
					</>
				)}
				<h3 className="font-bold text-2xl text-[#664229] mb-4 mt-8">Pengalaman Kerja</h3>
				{(cv.experiences || []).map((exp, index) => (
					<div key={exp.id ?? index} className="mb-6">
						<h4 className="font-bold text-[#664229]">
							{exp.company || "Nama Perusahaan"}
						</h4>
						<p className="text-sm text-gray-600 mb-2">
							{exp.role || "Jabatan"} · {exp.period}
						</p>
						<ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
							{(exp.desc || "Deskripsi pekerjaan.")
								.split("\n")
								.filter((line) => line.trim())
								.map((line, i) => (
									<li key={i}>{line.replace(/^\u2022\s*/, "")}</li>
								))}
						</ul>
					</div>
				))}
				{organisasis.length > 0 && (
					<>
						<h3 className="font-bold text-2xl text-[#664229] mb-4 mt-8">
							Pengalaman Organisasi
						</h3>
						{organisasis.map((org) => (
							<div key={org.id} className="mb-6">
								<h4 className="font-bold text-[#664229]">
									{org.instansi || "Nama Instansi"}
								</h4>
								<p className="text-sm text-gray-600 mb-2">
									{org.posisi}
									{org.tanggal ? ` · ${org.tanggal}` : ""}
								</p>
								<ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
									{(org.deskripsi || "")
										.split("\n")
										.filter((line) => line.trim())
										.map((line, i) => (
											<li key={i}>{line.replace(/^\u2022\s*/, "")}</li>
										))}
								</ul>
							</div>
						))}
					</>
				)}
				<h3 className="font-bold text-2xl text-[#664229] mb-4 mt-8">Kemampuan</h3>
				<ul className="list-disc pl-5 space-y-2">
					{skills.map((skill) => (
						<li key={skill.title} className="text-sm text-gray-800">
							<strong className="text-[#664229]">{skill.title}</strong> —{" "}
							{skill.desc}
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
