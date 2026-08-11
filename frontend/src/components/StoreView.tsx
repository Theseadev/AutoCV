import { useState } from "react";

import { parseSkills, storeCv, storeSkillsText } from "../cv";

import { CvPaper } from "./BuilderView";

interface Props {
	onPick: (template: string) => void;
}

const TEMPLATES = [
	{
		id: "cv01",

		name: "Creative Pro 01",

		category: "Kreatif · Editorial",

		price: "Rp 25.000",

		desc: "Masthead cokelat gaya majalah dengan aksen emas dan skill dots. Untuk yang mau tampil beda tapi tetap rapi.",
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

		category: "Kreatif · Geometris",

		price: "Rp 35.000",

		desc: "Header navy dengan pita diagonal, tile kontak, timeline bernomor, dan progress bar skill.",
	},
	{
		id: "cv05",

		name: "Lux Monochrome",

		category: "Elegant · Monokrom",

		price: "Rp 25.000",

		desc: "Tipografi serif mewah dengan palet hitam-putih dan garis ganda. Untuk profesional senior dan konsultan.",
	},

	{
		id: "cv06",

		name: "Dev Minimal",

		category: "Tech · Developer",

		price: "Rp 30.000",

		desc: "Gaya developer: rail indigo, aksen monospace, chip skill. Cocok untuk IT, programmer, dan data analyst.",
	},
	{

		id: "cv07",

		name: "Classic Fresh",

		category: "Klasik · Fresh Graduate",

		price: "Rp 20.000",

		desc: "Sidebar krem hangat dengan aksen cokelat. Dirancang khusus untuk fresh graduate dan lulusan baru.",
	},
];

const scrollToTemplates = () =>
	document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });

// Tumpukan CV interaktif: klik lembar belakang untuk membawanya ke depan

const HERO_TEMPLATES = ["cv01", "cv07", "cv06", "cv03", "cv04"];

// Sudut lembar berdasarkan jarak dari depan (0 = lembar paling depan)

const FAN_ANGLES = [0, 17, -17, 24, -24];

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
						className={`absolute left-1/2 bottom-0 w-[238px] aspect-[1/1.414] rounded-lg overflow-hidden ring-1 ring-black/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${front ? "shadow-xl" : "shadow-md hover:shadow-lg"}`}
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

// Latar hero: dot grid + outline lembar CV tersebar (kesan "meja penuh dokumen"),

// bukan blob gradient khas AI slop.

function HeroBackground() {
	return (
		<div
			aria-hidden
			className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none select-none animate-fade-in"
		>
			<svg
				role="img"
				aria-label="Latar dekoratif: tumpukan lembar CV dan pola titik halus"
				className="h-full w-full"
				viewBox="0 0 1440 900"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<pattern
						id="hero-dots"
						width="26"
						height="26"
						patternUnits="userSpaceOnUse"
					>
						<circle cx="1.5" cy="1.5" r="1.5" fill="#4F46E5" opacity="0.07" />
					</pattern>
				</defs>

				<rect width="1440" height="900" fill="url(#hero-dots)" />

				{/* Outline lembar CV tersebar */}

				<g fill="none" stroke="#9CA3AF" strokeLinecap="round">
					{/* Lembar besar di belakang kartu preview */}

					<g transform="rotate(-5 1100 360)" opacity="0.5">
						<rect
							x="1030"
							y="180"
							width="150"
							height="205"
							rx="4"
							strokeWidth="1.2"
						/>

						<g strokeWidth="0.8" opacity="0.55">
							<path d="M1050 206h112M1050 224h84M1050 242h112M1050 260h60M1050 284h112M1050 302h96M1050 320h112" />
						</g>
					</g>

					{/* Lembar kecil dengan sudut terlipat */}

					<g transform="rotate(9 235 285)" opacity="0.4">
						<path d="M180 220h80l30 30v100h-110z" strokeWidth="1.2" />

						<path d="M260 220v30h30" strokeWidth="0.9" opacity="0.6" />

						<path d="M195 252h70M195 268h46" strokeWidth="0.8" opacity="0.5" />
					</g>

					{/* Lembar kanan bawah */}

					<g transform="rotate(-7 1275 630)" opacity="0.35">
						<rect
							x="1210"
							y="540"
							width="130"
							height="180"
							rx="4"
							strokeWidth="1.2"
						/>

						<g strokeWidth="0.8" opacity="0.55">
							<path d="M1230 566h92M1230 584h70M1230 602h92M1230 626h92M1230 644h78M1230 662h92" />
						</g>
					</g>

					{/* Lembar kiri bawah */}

					<g transform="rotate(6 290 705)" opacity="0.3">
						<rect
							x="220"
							y="610"
							width="140"
							height="190"
							rx="4"
							strokeWidth="1.2"
						/>

						<g strokeWidth="0.8" opacity="0.55">
							<path d="M240 636h100M240 654h76M240 672h100M240 696h100M240 714h84M240 732h100" />
						</g>
					</g>
				</g>

				{/* Tanda teknis kecil: crosshair & kotak (kesan presisi) */}

				<g stroke="#4F46E5" strokeWidth="1.1" opacity="0.22">
					<g>
						<path d="M96 196v12M90 202h12" />

						<circle cx="108" cy="202" r="3.5" fill="none" />
					</g>

					<g>
						<path d="M1338 130v12M1332 136h12" />

						<circle cx="1350" cy="136" r="3.5" fill="none" />
					</g>

					<g>
						<path d="M150 470v10M145 475h10" />
					</g>

					<g>
						<rect x="700" y="56" width="10" height="10" rx="1.5" />

						<rect x="720" y="52" width="18" height="18" rx="2" opacity="0.6" />
					</g>

					<g>
						<circle
							cx="1260"
							cy="300"
							r="5"
							fill="#4F46E5"
							opacity="0.35"
							stroke="none"
						/>

						<circle cx="1260" cy="300" r="11" strokeWidth="0.8" opacity="0.5" />
					</g>
				</g>
			</svg>
		</div>
	);
}

// Ilustrasi "Empat desain, empat karakter" — empat lembar mini fanned, warna khas tiap template
function TemplateFan() {
	const sheets = [
		{ n: "01", band: "#4E342E", rule: "#C9A227", badge: "#C9A227", rot: -6 },
		{ n: "02", band: "#E5E7EB", rule: "#111827", badge: "#111827", rot: -3 },
		{ n: "03", band: "#111827", rule: "#4F46E5", badge: "#4F46E5", rot: 0 },
		{ n: "04", band: "#0F172A", rule: "#4F46E5", badge: "#4F46E5", rot: 3 },
		{ n: "05", band: "#D4D4D8", rule: "#111827", badge: "#111827", rot: 6 },
	];
	return (
		<svg
			role="img"
			aria-label="Tujuh kartu template dengan warna khas masing-masing"
			viewBox="0 0 635 235"
			className="w-full max-w-[635px] mx-auto lg:mx-0 select-none"
		>
			<defs>
				<linearGradient id="neo-grad" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#4F46E5" />
					<stop offset="1" stopColor="#7C3AED" />
				</linearGradient>
			</defs>
			{sheets.map((s, i) => {
				const x = 40 + i * 112;
				const y = 55;
				return (
					<g key={s.n} transform={`rotate(${s.rot} ${x + 52} ${y + 145})`}>
						<rect
							x={x + 3}
							y={y + 6}
							width="105"
							height="145"
							rx="3"
							fill="#111827"
							opacity="0.08"
						/>
						<rect
							x={x}
							y={y}
							width="105"
							height="145"
							rx="3"
							fill="#FFFFFF"
							stroke="#E5E7EB"
						/>
						<path
							d={`M${x} ${y + 3} Q${x} ${y} ${x + 3} ${y} H${x + 102} Q${x + 105} ${y} ${x + 105} ${y + 3} V${y + 30} H${x} Z`}
							fill={s.band}
						/>
						<rect x={x} y={y + 30} width="105" height="2" fill={s.rule} />
						<rect
							x={x + 12}
							y={y + 42}
							width="52"
							height="5"
							rx="2.5"
							fill="#9CA3AF"
						/>
						<g fill="#E5E7EB">
							<rect x={x + 12} y={y + 56} width="81" height="5" rx="2.5" />
							<rect x={x + 12} y={y + 68} width="67" height="5" rx="2.5" />
							<rect x={x + 12} y={y + 80} width="50" height="5" rx="2.5" />
							<rect x={x + 12} y={y + 94} width="72" height="5" rx="2.5" />
							<rect x={x + 12} y={y + 106} width="60" height="5" rx="2.5" />
						</g>
						<circle cx={x + 88} cy={y + 128} r="11" fill={s.badge} />
						<text
							x={x + 88}
							y={y + 132}
							textAnchor="middle"
							fontFamily="Poppins, sans-serif"
							fontWeight="700"
							fontSize="11"
							fill="#FFFFFF"
						>
							{s.n}
						</text>
					</g>
				);
			})}
		</svg>
	);
}

// Crop bagian atas kertas A4 asli sebagai gambar produk — preview sungguhan, bukan placeholder

function TemplatePreview({ template }: { template: string }) {
	return (
		<div className="w-[238px] aspect-[1/1.414] overflow-hidden rounded-lg shadow-sm group-hover:shadow-xl group-hover:scale-[1.02] transition duration-500 pointer-events-none select-none">
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
						<TemplateStack />
					</div>
				</div>
			</section>

			{/* TEMPLATE LIST */}

			<section
				id="templates"
				className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-24"
			>
				<div className="mb-12 grid lg:grid-cols-2 gap-10 items-center animate-fade-up">
					<div>
						<p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
							Template
						</p>

						<h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900">
							Tujuh desain, tujuh karakter.
						</h2>

						<p className="text-gray-600 mt-3 max-w-xl">
							Semua template bisa diedit bebas di builder \x97 ganti warna,
							tulis ulang, tambah pengalaman sesukamu.
						</p>
					</div>

					<TemplateFan />
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
