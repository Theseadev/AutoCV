export interface Experience {
	id?: number;
	company: string;
	role: string;
	period: string;
	desc: string;
}

export interface CvData {
	name: string;
	title: string;
	phone: string;
	email: string;
	address: string;
	about: string;
	experiences: Experience[];
}

export interface Order {
	id: string;
	date: string;
	name: string;
	template: string;
	templateId?: string;
	cv?: CvData;
	skills?: string;
	status?: string;
}

export interface ParsedSkill {
	title: string;
	desc: string;
}

export const defaultCv: CvData = {
	name: "Budi Santoso",
	title: "Staff Administrasi",
	phone: "0812-3456-7890",
	email: "budi.santoso@email.com",
	address: "Jl. Merdeka No.10, Jakarta",
	about:
		"Seorang profesional muda di bidang administrasi perkantoran dengan pengalaman mengelola kearsipan digital dan koordinasi operasional.",
	experiences: [
		{
			id: 1,
			company: "PT. Maju Mundur",
			role: "Staff Magang Administrasi",
			period: "Jan 2023 - Jun 2023",
			desc: "• Mengelola input data lebih dari 200 dokumen transaksi harian dengan tingkat akurasi 99%.\n• Menyusun jadwal pertemuan manajerial dan menyiapkan berkas presentasi.",
		},
	],
};

export const defaultSkillsText =
	"Microsoft Office: Mahir mengolah data Excel & Word\nKomunikasi: Kerjasama tim & negosiasi\nProblem Solving: Cepat mencari solusi operasional";

// Contoh data lengkap untuk preview template di toko (biar kelihatan "penuh")
export const storeCv: CvData = {
	name: "Budi Santoso",
	title: "Staff Administrasi",
	phone: "0812-3456-7890",
	email: "budi.santoso@email.com",
	address: "Jl. Merdeka No.10, Jakarta",
	about:
		"Seorang profesional muda di bidang administrasi perkantoran dengan pengalaman mengelola kearsipan digital dan koordinasi operasional. Terbiasa bekerja di bawah tenggat waktu yang ketat dan berkolaborasi dengan tim lintas divisi.",
	experiences: [
		{
			id: 1,
			company: "PT. Maju Mundur",
			role: "Staff Administrasi",
			period: "Jan 2023 - Sekarang",
			desc: "• Mengelola input data lebih dari 200 dokumen transaksi harian dengan tingkat akurasi 99%.\n• Menyusun jadwal pertemuan manajerial dan menyiapkan berkas presentasi.\n• Mengoordinasikan komunikasi internal antar 5 divisi.",
		},
		{
			id: 2,
			company: "PT. Karya Bangsa",
			role: "Admin Operasional",
			period: "Jun 2021 - Des 2022",
			desc: "• Mengoptimalkan sistem arsip digital sehingga waktu pencarian dokumen turun 60%.\n• Membantu penyusunan laporan bulanan untuk manajemen.",
		},
		{
			id: 3,
			company: "Toko Buku Nusantara",
			role: "Kasir & Admin",
			period: "Agu 2020 - Mei 2021",
			desc: "• Melayani transaksi dan rekonsiliasi kas harian.\n• Memelihara database stok dan data pelanggan.",
		},
	],
};

export const storeSkillsText =
	"Microsoft Office: Mahir mengolah data Excel & Word\nKomunikasi: Kerjasama tim & negosiasi\nProblem Solving: Cepat mencari solusi operasional\nManajemen Waktu: Terbiasa deadline ketat\nBahasa Inggris: Aktif (TOEIC 750)";

export const esc = (s: unknown): string =>
	String(s ?? "").replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			] as string,
	);

export const parseSkills = (text: string): ParsedSkill[] =>
	(text || "")
		.split("\n")
		.filter((l) => l.trim())
		.map((line) => {
			const parts = line.split(":");
			return parts.length > 1
				? { title: parts[0].trim(), desc: parts.slice(1).join(":").trim() }
				: { title: line.trim(), desc: "Kualifikasi handal" };
		});

// Bangun HTML kertas CV dari data (dipakai untuk PDF bersih tanpa watermark)
export const buildCvHtml = (
	cvData: CvData,
	skillsText: string,
	template = "cv01",
): string => {
	const skills = parseSkills(skillsText);
	const exps = (cvData.experiences || [])
		.map(
			(e) => `
            <div>
                <div class="flex justify-between items-baseline mb-1">
                    <h4 class="font-bold text-gray-900">${esc(e.company) || "Nama Perusahaan"}</h4>
                    <span class="text-xs text-gray-500 font-medium">${esc(e.period)}</span>
                </div>
                <p class="text-sm italic text-gray-600 mb-1">${esc(e.role) || "Jabatan"}</p>
                <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">${esc(e.desc)}</div>
            </div>`,
		)
		.join("");
	const skillLis = skills
		.map((s) => `<li><strong>${esc(s.title)}:</strong> ${esc(s.desc)}</li>`)
		.join("");
	const name = esc(cvData.name) || "Nama Lengkap";
	const title = esc(cvData.title) || "Profesi";
	const about = esc(cvData.about);
	const phone = esc(cvData.phone);
	const email = esc(cvData.email);
	const address = esc(cvData.address);

	if (template === "cv02") {
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;">
            <div style="padding:56px 64px;height:100%;">
                <h1 class="text-4xl font-bold text-gray-900 mb-1">${name}</h1>
                <h2 class="text-lg text-gray-600 mb-2">${title}</h2>
                <p class="text-xs text-gray-500 mb-8">
                    <i class="fa-solid fa-phone mr-1 w-4"></i>${phone || "-"} &nbsp;|&nbsp;
                    <i class="fa-solid fa-envelope mr-1 w-4"></i>${email || "-"} &nbsp;|&nbsp;
                    <i class="fa-solid fa-location-dot mr-1 w-4"></i>${address || "-"}
                </p>
                <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-3">Profil</h3>
                <p class="text-sm text-gray-700 leading-relaxed text-justify mb-8 whitespace-pre-line">${about}</p>
                <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-4">Pengalaman Kerja</h3>
                <div class="space-y-5 mb-8">${exps}</div>
                <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-3">Kemampuan</h3>
                <ul class="text-sm text-gray-700 space-y-1">${skillLis}</ul>
            </div>
        </div>`;
	}

	if (template === "cv03") {
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;">
            <div class="bg-gray-900 px-12 py-10">
                <h1 class="text-4xl font-bold text-white mb-1">${name}</h1>
                <h2 class="text-xl font-light text-gray-300 tracking-wide">${title}</h2>
            </div>
            <div class="flex">
                <div class="w-2/5 p-8 bg-gray-50 border-r border-gray-200">
                    <h3 class="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-4">Kontak</h3>
                    <ul class="text-sm space-y-3 mb-8">
                        <li class="flex items-start"><i class="fa-solid fa-phone mt-1 w-5 text-indigo-600"></i><span>${phone || "-"}</span></li>
                        <li class="flex items-start"><i class="fa-solid fa-envelope mt-1 w-5 text-indigo-600"></i><span style="word-break:break-all;">${email || "-"}</span></li>
                        <li class="flex items-start"><i class="fa-solid fa-location-dot mt-1 w-5 text-indigo-600"></i><span>${address || "-"}</span></li>
                    </ul>
                    <h3 class="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-4">Kemampuan</h3>
                    <ul class="text-sm space-y-2 list-disc pl-4">${skillLis}</ul>
                </div>
                <div class="w-3/5 p-8">
                    <h3 class="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-3">Tentang Saya</h3>
                    <p class="text-sm text-gray-700 leading-relaxed text-justify mb-8 whitespace-pre-line">${about}</p>
                    <h3 class="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-4">Pengalaman Kerja</h3>
                    <div class="space-y-5">${exps}</div>
                </div>
            </div>
        </div>`;
	}

	if (template === "cv04") {
		const skillChips = skills
			.map(
				(s) =>
					`<span class="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1.5"><strong>${esc(s.title)}:</strong> ${esc(s.desc)}</span>`,
			)
			.join("");
		const expTimeline = (cvData.experiences || [])
			.map(
				(e) => `
                    <div class="relative">
                        <span class="absolute -left-[5px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100"></span>
                        <div class="flex justify-between items-baseline mb-1">
                            <h4 class="font-bold text-gray-900">${esc(e.company) || "Nama Perusahaan"}</h4>
                            <span class="text-xs text-gray-500 font-medium">${esc(e.period)}</span>
                        </div>
                        <p class="text-sm italic text-gray-600 mb-1">${esc(e.role) || "Jabatan"}</p>
                        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">${esc(e.desc)}</div>
                    </div>`,
			)
			.join("");
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-12 py-8 flex items-center justify-between">
                <div>
                    <h1 class="text-4xl font-heading font-bold text-white mb-1">${name}</h1>
                    <h2 class="text-lg font-light text-indigo-100 tracking-widest">${title}</h2>
                </div>
                <div class="w-24 h-24 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-user text-4xl text-white"></i>
                </div>
            </div>
            <div class="p-10">
                <p class="text-sm text-gray-700 leading-relaxed text-justify mb-6 whitespace-pre-line">${about}</p>
                <div class="flex flex-wrap gap-4 text-xs text-indigo-700 mb-8">
                    <span class="flex items-center"><i class="fa-solid fa-phone mr-1.5"></i>${phone || "-"}</span>
                    <span class="flex items-center"><i class="fa-solid fa-envelope mr-1.5"></i>${email || "-"}</span>
                    <span class="flex items-center"><i class="fa-solid fa-location-dot mr-1.5"></i>${address || "-"}</span>
                </div>
                <h3 class="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-4 flex items-center">
                    <span class="w-1.5 h-4 bg-indigo-600 rounded-full mr-2 inline-block"></span>Pengalaman Kerja
                </h3>
                <div class="border-l-2 border-indigo-100 pl-6 space-y-6 mb-8 relative">${expTimeline}</div>
                <h3 class="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-3 flex items-center">
                    <span class="w-1.5 h-4 bg-indigo-600 rounded-full mr-2 inline-block"></span>Kemampuan
                </h3>
                <div class="flex flex-wrap gap-2">${skillChips}</div>
            </div>
        </div>`;
	}

	return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;">
            <div class="cv-layout-kreatif">
                <div class="cv-sidebar text-gray-800">
                    <div class="w-40 h-40 rounded-full mx-auto mb-8 bg-gray-300 border-4 border-white shadow-md overflow-hidden relative flex justify-center items-center">
                        <i class="fa-solid fa-user text-5xl text-gray-400"></i>
                    </div>
                    <h4 class="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-800 pb-1 uppercase tracking-widest">Kontak</h4>
                    <ul class="text-sm space-y-3 mb-8">
                        <li class="flex items-start"><i class="fa-solid fa-phone mt-1 w-6 text-gray-600"></i><span>${phone || "-"}</span></li>
                        <li class="flex items-start"><i class="fa-solid fa-envelope mt-1 w-6 text-gray-600"></i><span style="word-break:break-all;">${email || "-"}</span></li>
                        <li class="flex items-start"><i class="fa-solid fa-location-dot mt-1 w-6 text-gray-600"></i><span>${address || "-"}</span></li>
                    </ul>
                    <h4 class="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-800 pb-1 uppercase tracking-widest">Kemampuan</h4>
                    <ul class="text-sm space-y-2 list-disc pl-4 mb-8">${skillLis}</ul>
                </div>
                <div class="cv-main bg-white">
                    <h1 class="text-5xl font-heading font-bold text-gray-800 mb-1" style="color:#5D4037;">${name}</h1>
                    <h2 class="text-2xl font-light text-gray-600 tracking-widest mb-8">${title}</h2>
                    <h3 class="text-xl font-bold text-gray-800 mb-3 inline-block pb-1" style="color:#5D4037;border-bottom:2px solid #5D4037;">Tentang Saya</h3>
                    <p class="text-sm text-gray-700 leading-relaxed text-justify mb-8 whitespace-pre-line">${about}</p>
                    <h3 class="text-xl font-bold text-gray-800 mb-4 inline-block pb-1" style="color:#5D4037;border-bottom:2px solid #5D4037;">Pengalaman Kerja</h3>
                    <div class="space-y-5">${exps}</div>
                </div>
            </div>
        </div>`;
};
