import { parseSkills, storeCv, storeSkillsText } from "../cv";
import { CvPaper } from "./BuilderView";

interface Props {
	onPick: (template: string) => void;
}

const TEMPLATES = [
	{
		id: "cv01",
		name: "Creative Pro 01",
		category: "Kreatif · 2 Kolom",
		price: "Rp 25.000",
		desc: "Sidebar hangat dengan foto profil. Cocok untuk fresh graduate, IT, dan digital marketing.",
	},
	{
		id: "cv02",
		name: "Corporate Standard",
		category: "Formal · ATS Friendly",
		price: "Rp 20.000",
		desc: "Satu kolom, fokus ke kata kunci. Format paling aman untuk menembus seleksi HRD BUMN & korporat.",
	},
	{
		id: "cv03",
		name: "Modern Executive",
		category: "Modern · Eksekutif",
		price: "Rp 30.000",
		desc: "Header gelap dan dua kolom rapi. Untuk profesional, manajer, dan posisi senior.",
	},
	{
		id: "cv04",
		name: "Neo Creative",
		category: "Kreatif · Colorful",
		price: "Rp 35.000",
		desc: "Gradient header, timeline pengalaman, dan skill chip. Buat yang mau tampil beda.",
	},
];

const scrollToTemplates = () =>
	document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });

// Crop bagian atas kertas A4 asli sebagai gambar produk — preview sungguhan, bukan placeholder
function TemplatePreview({ template }: { template: string }) {
	return (
		<div className="w-[238px] h-56 overflow-hidden rounded-lg shadow-sm group-hover:shadow-xl group-hover:scale-[1.02] transition duration-500 pointer-events-none select-none">
			<CvPaper
				cv={storeCv}
				skills={parseSkills(storeSkillsText)}
				scale={0.3}
				template={template}
				watermark={false}
			/>
		</div>
	);
}

export default function StoreView({ onPick }: Props) {
	return (
		<div className="animate-fade-in">
			{/* HERO */}
			<section className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-14 items-center">
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
								className="bg-primary hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
							>
								Pilih Template
							</button>
							<button
								type="button"
								onClick={() => onPick("cv01")}
								className="text-gray-700 hover:text-gray-900 font-semibold px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors active:scale-[0.96]"
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
						<div className="absolute w-[254px] h-80 overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 -rotate-2 translate-x-8 translate-y-5 opacity-70">
							<CvPaper
								cv={storeCv}
								skills={parseSkills(storeSkillsText)}
								scale={0.32}
								template="cv01"
								watermark={false}
							/>
						</div>
						<div className="relative w-[254px] h-80 overflow-hidden rounded-lg shadow-xl ring-1 ring-black/10 rotate-[1.5deg] transition-transform duration-500 hover:rotate-0">
							<CvPaper
								cv={storeCv}
								skills={parseSkills(storeSkillsText)}
								scale={0.32}
								template="cv04"
								watermark={false}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* TEMPLATE LIST */}
			<section
				id="templates"
				className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-24"
			>
				<div className="mb-12 animate-fade-up">
					<p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
						Template
					</p>
					<h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900">
						Empat desain, empat karakter.
					</h2>
					<p className="text-gray-600 mt-3 max-w-xl">
						Semua template bisa diedit bebas di builder — ganti warna, tulis
						ulang, tambah pengalaman sesukamu.
					</p>
				</div>

				<div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200 shadow-sm">
					{TEMPLATES.map((t, i) => (
						<div
							key={t.id}
							className="flex flex-col sm:flex-row group transition-colors hover:bg-gray-50/70 animate-fade-up"
							style={{ animationDelay: `${i * 70}ms` }}
						>
							<div className="sm:w-72 shrink-0 bg-gray-50 sm:border-r border-gray-200 p-5 flex justify-center transition-colors group-hover:bg-gray-100/70">
								<TemplatePreview template={t.id} />
							</div>
							<div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
								<div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
									{t.category}
								</div>
								<h3 className="text-2xl font-heading font-bold text-gray-900 mt-1 mb-2">
									{t.name}
								</h3>
								<p className="text-gray-600 text-sm max-w-lg mb-6">{t.desc}</p>
								<div className="flex items-center justify-between gap-4">
									<span className="text-2xl font-bold text-gray-900 tabular-nums">
										{t.price}
									</span>
									<button
										type="button"
										onClick={() => onPick(t.id)}
										className="group/btn bg-gray-900 hover:bg-primary text-white px-6 py-2.5 rounded-lg font-semibold transition-colors active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
									>
										Pakai Template
										<i className="fa-solid fa-arrow-right ml-2 text-sm inline-block transition-transform group-hover/btn:translate-x-0.5"></i>
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* CTA */}
			<section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
				<div className="bg-gray-900 rounded-2xl px-8 py-14 text-center relative overflow-hidden">
					<div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
					<div className="absolute -bottom-24 -right-16 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
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
							className="bg-white hover:bg-gray-100 text-gray-900 px-7 py-3 rounded-xl font-semibold transition-colors active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
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
					<i className="fa-solid fa-heart text-rose-400 mx-0.5"></i> untuk
					pencari kerja.
				</div>
			</footer>
		</div>
	);
}
