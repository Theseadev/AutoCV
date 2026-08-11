import { useState } from "react";
import { callGeminiAPI } from "../api";
import type { CvData } from "../cv";

interface AtsResult {
	matchScore: number;
	summaryFeedback: string;
	strengths: string[];
	missingKeywords: string[];
	improvementTips: string[];
	recommendedSummary: string;
}

interface Props {
	cv: CvData;
	skillsText: string;
	onApplySummary: (summary: string) => void;
}

export default function AtsView({ cv, skillsText, onApplySummary }: Props) {
	const [jobTitle, setJobTitle] = useState("Senior Administrative Officer");
	const [jobDesc, setJobDesc] = useState(
		"Kualifikasi:\n- Minimal 2 tahun pengalaman di bidang administrasi kantor.\n- Mampu mengoperasikan Microsoft Excel tingkat lanjut (Pivot, VLOOKUP, Dashboard).\n- Pengalaman mengoperasikan sistem ERP / SAP merupakan nilai tambah.\n- Kemampuan komunikasi interpersonal dan manajemen waktu yang sangat baik.",
	);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [result, setResult] = useState<AtsResult | null>(null);

	const analyze = async () => {
		if (!jobDesc.trim()) {
			alert(
				"Silakan tempel deskripsi lowongan kerja (Job Description) terlebih dahulu!",
			);
			return;
		}
		setIsAnalyzing(true);
		setResult(null);
		try {
			const sysPrompt =
				"Anda adalah mesin Applicant Tracking System (ATS) dan pakar HR Senior. Tugas Anda adalah menganalisis kesesuaian berkas CV dengan deskripsi pekerjaan yang diberikan. Analisis dengan teliti dan kembalikan output persis sesuai JSON Schema yang diminta.";
			const cvContent = `
NAMA: ${cv.name}
TARGET/TITLE: ${cv.title}
SUMMARY: ${cv.about}
PENGALAMAN:
${cv.experiences.map((e) => `- ${e.role} di ${e.company}: ${e.desc}`).join("\n")}
SKILLS:
${skillsText}
                `;
			const userQuery = `TARGET POSISI: ${jobTitle}\n\nDESKRIPSI LOWONGAN:\n${jobDesc}\n\nCONTENT CV USER:\n${cvContent}`;
			const jsonSchema = {
				type: "OBJECT",
				properties: {
					matchScore: { type: "NUMBER" },
					summaryFeedback: { type: "STRING" },
					strengths: { type: "ARRAY", items: { type: "STRING" } },
					missingKeywords: { type: "ARRAY", items: { type: "STRING" } },
					improvementTips: { type: "ARRAY", items: { type: "STRING" } },
					recommendedSummary: { type: "STRING" },
				},
				propertyOrdering: [
					"matchScore",
					"summaryFeedback",
					"strengths",
					"missingKeywords",
					"improvementTips",
					"recommendedSummary",
				],
			};
			const response = await callGeminiAPI(sysPrompt, userQuery, jsonSchema);
			const rawJson =
				response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
			// Bersihkan fenced code (```json ... ```) bila model mengembalikannya
			const clean = rawJson
				.replace(/^```(?:json)?\s*/i, "")
				.replace(/```\s*$/, "")
				.trim();
			setResult(JSON.parse(clean) as AtsResult);
		} catch (e) {
			console.error("Gemini ATS Analysis Error:", e);
			alert("Terjadi kesalahan saat menganalisis CV dengan Gemini AI.");
		} finally {
			setIsAnalyzing(false);
		}
	};

	const scoreCls =
		result && result.matchScore >= 80
			? "bg-emerald-100 text-emerald-700 border-4 border-emerald-400"
			: result && result.matchScore >= 60
				? "bg-amber-100 text-amber-700 border-4 border-amber-400"
				: "bg-red-100 text-red-700 border-4 border-red-400";

	return (
		<div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
			<div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
				<div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 px-8 py-6 text-white flex justify-between items-center">
					<div>
						<h2 className="text-2xl font-heading font-bold flex items-center">
							<i className="fa-solid fa-wand-magic-sparkles text-amber-400 mr-3"></i>{" "}
							Gemini ATS & Job Matcher
						</h2>
						<p className="text-indigo-200 text-sm mt-1">
							Uji kelayakan CV-mu terhadap kualifikasi lowongan kerja dengan
							kecerdasan Gemini.
						</p>
					</div>
					<span className="hidden sm:inline-block bg-indigo-800/80 text-indigo-200 text-xs px-3 py-1.5 rounded-full border border-indigo-600">
						Powered by Gemini API
					</span>
				</div>

				<div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Left: Input Form */}
					<div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-gray-200 pr-0 lg:pr-6 pb-6 lg:pb-0">
						<div>
							<label
								htmlFor="ats-job-title"
								className="block text-sm font-semibold text-gray-900 mb-1"
							>
								Target Posisi / Job Title
							</label>
							<input
								id="ats-job-title"
								value={jobTitle}
								onChange={(e) => setJobTitle(e.target.value)}
								type="text"
								placeholder="Cth: Staff Akuntansi / Senior Frontend Dev"
								className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary text-sm"
							/>
						</div>
						<div>
							<label
								htmlFor="ats-job-desc"
								className="block text-sm font-semibold text-gray-900 mb-1"
							>
								Paste Deskripsi Lowongan Kerja (Job Description)
							</label>
							<textarea
								id="ats-job-desc"
								value={jobDesc}
								onChange={(e) => setJobDesc(e.target.value)}
								rows={8}
								placeholder="Tempel deskripsi pekerjaan, persyaratan teknis, atau kualifikasi dari Glints, JobStreet, LinkedIn di sini..."
								className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary text-sm leading-relaxed"
							/>
						</div>

						<button
							type="button"
							onClick={analyze}
							disabled={isAnalyzing}
							className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex justify-center items-center"
						>
							<i
								className={`${isAnalyzing ? "fa-solid fa-circle-notch fa-spin" : "fa-solid fa-microscope"} mr-2 text-lg`}
							></i>
							{isAnalyzing
								? "Menganalisis CV dengan Gemini AI..."
								: "Audit CV & Analisis ATS Score"}
						</button>
					</div>

					{/* Right: Audit Output */}
					<div className="lg:col-span-7">
						{!result && !isAnalyzing && (
							<div className="h-full min-h-[300px] flex flex-col justify-center items-center text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
								<div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl mb-3">
									<i className="fa-solid fa-chart-line"></i>
								</div>
								<h4 className="text-lg font-bold text-gray-800 mb-1">
									Belum Ada Analisis
								</h4>
								<p className="text-sm text-gray-500 max-w-sm">
									Isi deskripsi lowongan di sebelah kiri dan klik tombol Audit
									untuk melihat skor kelayakan, kata kunci yang kurang, dan
									rekomendasi perbaikan.
								</p>
							</div>
						)}

						{isAnalyzing && (
							<div className="h-full min-h-[300px] flex flex-col justify-center items-center p-6 text-center">
								<div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
								<h4 className="text-lg font-bold text-gray-900 mb-1">
									Gemini AI Sedang Mengurai CV Anda...
								</h4>
								<p className="text-sm text-gray-500">
									Membandingkan kata kunci, kualifikasi teknis, dan gaya bahasa
									dengan persyaratan lowongan.
								</p>
							</div>
						)}

						{result && !isAnalyzing && (
							<div className="space-y-6">
								{/* Score Card */}
								<div className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl flex items-center justify-between">
									<div>
										<span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
											Skor Kelayakan (ATS Match)
										</span>
										<h3 className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">
											{result.matchScore} / 100
										</h3>
										<p className="text-xs text-indigo-900 mt-1 max-w-sm">
											{result.summaryFeedback}
										</p>
									</div>
									<div className="relative flex items-center justify-center">
										<div
											className={`w-20 h-20 rounded-full flex items-center justify-center font-extrabold text-2xl shadow-inner ${scoreCls}`}
										>
											{result.matchScore}%
										</div>
									</div>
								</div>

								{/* Strengths & Missing Keywords */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
										<h4 className="text-sm font-bold text-emerald-900 mb-2 flex items-center">
											<i className="fa-solid fa-circle-check text-emerald-600 mr-2"></i>{" "}
											Keunggulan CV Anda
										</h4>
										<ul className="text-xs text-emerald-800 space-y-1.5 list-disc pl-4">
											{result.strengths.map((str) => (
												<li key={str}>{str}</li>
											))}
										</ul>
									</div>

									<div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
										<h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center">
											<i className="fa-solid fa-triangle-exclamation text-amber-600 mr-2"></i>{" "}
											Kata Kunci yang Perlu Ditambah
										</h4>
										<div className="flex flex-wrap gap-1.5">
											{result.missingKeywords.map((kw) => (
												<span
													key={kw}
													className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md font-medium border border-amber-200"
												>
													+ {kw}
												</span>
											))}
										</div>
									</div>
								</div>

								{/* Improvement Tips */}
								<div className="bg-white p-4 rounded-xl border border-gray-200">
									<h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
										<i className="fa-solid fa-lightbulb text-indigo-600 mr-2"></i>{" "}
										Saran Perbaikan Spesifik
									</h4>
									<ul className="text-xs text-gray-700 space-y-2 list-disc pl-4">
										{result.improvementTips.map((tip) => (
											<li key={tip} className="leading-relaxed">
												{tip}
											</li>
										))}
									</ul>
								</div>

								{/* Recommended Optimized Profile */}
								{result.recommendedSummary && (
									<div className="bg-indigo-900 text-white p-5 rounded-xl">
										<div className="flex justify-between items-center mb-2">
											<h4 className="text-sm font-bold flex items-center text-amber-300">
												<i className="fa-solid fa-sparkles mr-2"></i> Draf
												Ringkasan Teroptimasi ATS
											</h4>
											<button
												type="button"
												onClick={() =>
													onApplySummary(result.recommendedSummary)
												}
												className="text-xs bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-3 py-1 rounded-md transition-colors"
											>
												Terapkan ke CV Saya
											</button>
										</div>
										<p className="text-xs leading-relaxed text-indigo-100 italic">
											{result.recommendedSummary}
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
