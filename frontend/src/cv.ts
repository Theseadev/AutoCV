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
	foto?: string;
	pendidikans?: Education[];
	penghargaans?: Achievement[];
	hobi?: string;
	organisasis?: Organization[];
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


export interface Education {
	id?: number;
	institusi: string;
	jurusan: string;
	tahun: string;
	kegiatan?: string;
}

export interface Achievement {
	id?: number;
	judul: string;
	tahun: string;
}

export interface Organization {
	id?: number;
	instansi: string;
	posisi: string;
	tanggal: string;
	deskripsi: string;
}

// Bagian form/isi yang dipakai tiap template — form builder menyesuaikan dengannya
export type CvSection =
	| "foto"
	| "kontak"
	| "pendidikan"
	| "kemampuan"
	| "penghargaan"
	| "hobi"
	| "tentang"
	| "pengalaman"
	| "organisasi";

export const TEMPLATE_SECTIONS: Record<string, CvSection[]> = {
	cv01: ["kontak", "kemampuan", "tentang", "pengalaman", "pendidikan"],
	cv02: ["kontak", "kemampuan", "tentang", "pengalaman", "pendidikan"],
	cv03: ["kontak", "kemampuan", "tentang", "pengalaman", "pendidikan"],
	cv04: ["kontak", "kemampuan", "pengalaman", "tentang", "pendidikan"],
	cv05: ["kontak", "kemampuan", "tentang", "pengalaman", "pendidikan"],
	cv06: ["kontak", "kemampuan", "pengalaman", "tentang", "pendidikan"],
	cv07: [
		"foto",
		"kontak",
		"pendidikan",
		"kemampuan",
		"penghargaan",
		"hobi",
		"tentang",
		"pengalaman",
		"organisasi",
	],
};
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
	pendidikans: [
		{
			id: 1,
			institusi: "Universitas Indonesia",
			jurusan: "S1 Ilmu Komunikasi",
			tahun: "2019 - 2023",
		},
		{
			id: 2,
			institusi: "SMAN 3 Jakarta",
			jurusan: "IPA",
			tahun: "2016 - 2019",
		},
	],
	penghargaans: [
		{ id: 1, judul: "Juara 2 Lomba Debat Mahasiswa", tahun: "2022" },
		{ id: 2, judul: "Best Speaker FGD Nasional", tahun: "2021" },
	],
	hobi: "Membaca, Menulis, Fotografi",
	organisasis: [
		{
			id: 1,
			instansi: "BEM Fakultas Ilmu Komunikasi",
			posisi: "Kepala Divisi Humas",
			tanggal: "2021 - 2022",
			deskripsi: "• Mengelola media sosial dan publikasi organisasi.\n• Mengoordinasikan 10 event kampus dengan 30 anggota.",
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
	const pendidikanLis2 = (cvData.pendidikans || [])
		.map(
			(pd) => `
                    <div class="flex justify-between items-baseline">
                        <div><h4 class="font-bold text-gray-900">${esc(pd.institusi) || "-"}</h4><p class="text-sm text-gray-600">${esc(pd.jurusan) || "-"}</p></div>
                        <span class="text-xs text-gray-500 font-medium">${esc(pd.tahun)}</span>
                    </div>
                    ${pd.kegiatan ? `<p class="text-xs text-gray-500 mt-1">${esc(pd.kegiatan)}</p>` : ""}`,
		)
		.join("");
	const pendidikanLis3 = (cvData.pendidikans || [])
		.map(
			(pd) => `
                    <div class="flex justify-between items-baseline">
                        <div><h4 class="font-bold text-gray-900">${esc(pd.institusi) || "-"}</h4><p class="text-sm text-gray-600">${esc(pd.jurusan) || "-"}</p></div>
                        <span class="text-xs text-gray-500">${esc(pd.tahun)}</span>
                    </div>
                    ${pd.kegiatan ? `<p class="text-xs text-gray-500 mt-1">${esc(pd.kegiatan)}</p>` : ""}`,
		)
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
                <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-3">Tentang Saya</h3>
                <p class="text-sm text-gray-700 leading-relaxed text-justify mb-8 whitespace-pre-line">${about}</p>
                <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-3">Riwayat Pendidikan</h3>
                <div class="space-y-4 mb-8">${pendidikanLis2}</div>
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
                </div>
                <div class="w-3/5 p-8">
                    <h3 class="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-3">Tentang Saya</h3>
                    <p class="text-sm text-gray-700 leading-relaxed text-justify mb-8 whitespace-pre-line">${about}</p>
                    <h3 class="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-4">Riwayat Pendidikan</h3>
                    <div class="space-y-4 mb-8">${pendidikanLis3}</div>
                    <h3 class="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-4">Pengalaman Kerja</h3>
                    <div class="space-y-5">${exps}</div>
                    <h3 class="text-sm font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mt-8 mb-4">Kemampuan</h3>
                    <ul class="text-sm space-y-2 list-disc pl-4">${skillLis}</ul>
                </div>
            </div>
        </div>`;
	}

	if (template === "cv04") {
		// Geometric Neo: header navy + pita diagonal, tile kontak, progress bar skill, timeline bernomor
		const skillGeo = skills
			.map(
				(s, i) => `
                    <div style="display:flex;gap:10px;margin-bottom:12px;font-size:11.5px;color:#475569;line-height:1.6;">
                        <span style="color:#4F46E5;font-weight:700;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;flex-shrink:0;">${String(i + 1).padStart(2, "0")}</span>
                        <div><span style="font-weight:600;color:#0F172A;">${esc(s.title)}</span><span style="color:#94A3B8;"> — </span>${esc(s.desc)}</div>
                    </div>`,
			)
			.join("");
		const pendidikanLis4 = (cvData.pendidikans || [])
			.map(
				(pd, i) => `
                    <div style="display:flex;gap:14px;margin-bottom:12px;">
                        <div style="width:26px;height:26px;border-radius:6px;background:#4F46E5;color:white;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${String(i + 1).padStart(2, "0")}</div>
                        <div style="flex:1;border-bottom:1px solid #EEF2FF;padding-bottom:10px;">
                            <div style="display:flex;justify-content:space-between;align-items:baseline;">
                                <span style="font-weight:700;font-size:12.5px;color:#0F172A;">${esc(pd.institusi) || "-"}</span>
                                <span style="font-size:10px;color:#94A3B8;">${esc(pd.tahun)}</span>
                            </div>
                            <div style="font-size:11px;font-weight:600;color:#4F46E5;margin-top:2px;">${esc(pd.jurusan) || "-"}</div>
                            ${pd.kegiatan ? `<div style="font-size:11px;color:#64748B;margin-top:3px;">${esc(pd.kegiatan)}</div>` : ""}
                        </div>
                    </div>`,
			)
			.join("");
		const expNum = (cvData.experiences || [])
			.map(
				(e, i) => `
                    <div style="display:flex;gap:14px;margin-bottom:14px;">
                        <div style="width:26px;height:26px;border-radius:50%;background:#0F172A;color:white;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${String(i + 1).padStart(2, "0")}</div>
                        <div style="flex:1;border-bottom:1px solid #EEF2FF;padding-bottom:14px;">
                            <div style="display:flex;justify-content:space-between;align-items:baseline;">
                                <span style="font-weight:700;font-size:13px;color:#0F172A;">${esc(e.company) || "Nama Perusahaan"}</span>
                                <span style="font-size:10px;color:#94A3B8;">${esc(e.period)}</span>
                            </div>
                            <div style="font-size:11px;font-weight:600;color:#4F46E5;margin:2px 0 4px;">${esc(e.role) || "Jabatan"}</div>
                            <div style="font-size:11.5px;color:#475569;line-height:1.6;white-space:pre-line;">${esc(e.desc)}</div>
                        </div>
                    </div>`,
			)
			.join("");
		const tile = (icon: string, val: string) => `
                    <div style="display:flex;align-items:center;gap:10px;font-size:11.5px;color:#3730A3;font-weight:500;">
                        <span style="width:28px;height:28px;border-radius:8px;background:white;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(15,23,42,.08);">
                            <i class="fa-solid fa-${icon}" style="color:#4F46E5;font-size:12px;"></i>
                        </span>
                        <span style="max-width:190px;word-break:break-all;">${val || "-"}</span>
                    </div>`;
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;">
            <div style="background:#0F172A;padding:36px 56px;position:relative;color:white;overflow:hidden;">
                <div style="position:absolute;top:0;right:-56px;width:208px;height:100%;background:#4F46E5;transform:skewX(-18deg);"></div>
                <div style="position:absolute;top:24px;right:160px;width:16px;height:16px;border-radius:50%;background:#7C3AED;"></div>
                <div style="position:absolute;bottom:20px;right:256px;width:10px;height:10px;background:rgba(255,255,255,.4);border-radius:2px;"></div>
                <div style="position:relative;">
                    <div style="font-family:Poppins,sans-serif;font-size:36px;font-weight:700;line-height:1.15;">${name}</div>
                    <div style="font-size:13px;color:#C7D2FE;margin-top:2px;">${title}</div>
                </div>
            </div>
            <div style="background:#EEF2FF;padding:12px 56px;display:flex;gap:28px;">
                ${tile("phone", phone)}${tile("envelope", email)}${tile("location-dot", address)}
            </div>
            <div style="display:flex;padding:32px 56px;gap:36px;">
                <div style="width:36%;">
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0F172A;margin-bottom:10px;">Tentang Saya</div>
                    <p style="font-size:11.5px;color:#475569;line-height:1.6;text-align:justify;margin-bottom:16px;white-space:pre-line;">${about}</p>
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0F172A;margin-bottom:14px;">Riwayat Pendidikan</div>
                    ${pendidikanLis4}
                </div>
                <div style="flex:1;">
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0F172A;margin-bottom:14px;">Pengalaman Kerja</div>
                    ${expNum}
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0F172A;margin:18px 0 14px;">Kemampuan</div>
                    ${skillGeo}
                </div>
            </div>
        </div>`;
	}

	if (template === "cv05") {
		// Lux Monochrome: tipografi serif, palet hitam-putih, garis ganda
		const skillLux = skills
			.map(
				(s) =>
					`<div style="font-size:12px;color:#374151;margin-bottom:8px;"><strong>${esc(s.title)}</strong><span style="color:#9CA3AF;"> — </span>${esc(s.desc)}</div>`,
			)
			.join("");
		const pendidikanLux = (cvData.pendidikans || [])
			.map(
				(pd) => `
                    <div style="margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #F3F4F6;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <span style="font-family:'Playfair Display',serif;font-weight:700;font-size:13.5px;color:#111827;">${esc(pd.institusi) || "-"}</span>
                            <span style="font-size:9.5px;letter-spacing:2px;text-transform:uppercase;color:#9CA3AF;font-family:Inter,sans-serif;">${esc(pd.tahun)}</span>
                        </div>
                        <div style="font-size:11px;font-style:italic;color:#6B7280;margin-top:3px;font-family:Inter,sans-serif;">${esc(pd.jurusan) || "-"}</div>
                        ${pd.kegiatan ? `<div style="font-size:10.5px;color:#9CA3AF;margin-top:3px;font-family:Inter,sans-serif;">${esc(pd.kegiatan)}</div>` : ""}
                    </div>`,
			)
			.join("");
		const expLux = (cvData.experiences || [])
			.map(
				(e) => `
                    <div style="margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #F3F4F6;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <span style="font-family:'Playfair Display',serif;font-weight:700;font-size:13.5px;color:#111827;">${esc(e.company) || "Nama Perusahaan"}</span>
                            <span style="font-size:9.5px;letter-spacing:2px;text-transform:uppercase;color:#9CA3AF;font-family:Inter,sans-serif;">${esc(e.period)}</span>
                        </div>
                        <div style="font-size:11px;font-style:italic;color:#6B7280;margin:3px 0 6px;">${esc(e.role) || "Jabatan"}</div>
                        <div style="font-size:11.5px;color:#4B5563;line-height:1.65;white-space:pre-line;font-family:Inter,sans-serif;">${esc(e.desc)}</div>
                    </div>`,
			)
			.join("");
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;font-family:'Playfair Display',serif;">
            <div style="text-align:center;padding:44px 60px 20px;">
                <div style="font-size:40px;font-weight:700;color:#111827;letter-spacing:2px;">${name}</div>
                <div style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#6B7280;margin-top:10px;font-family:Inter,sans-serif;font-weight:600;">${title}</div>
                <div style="border-top:1px solid #111827;border-bottom:1px solid #111827;height:5px;margin:22px 0 0;"></div>
            </div>
            <div style="text-align:center;font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:#9CA3AF;font-family:Inter,sans-serif;padding-top:12px;">${phone || "-"} &nbsp;·&nbsp; ${email || "-"} &nbsp;·&nbsp; ${address || "-"}</div>
            <div style="display:flex;padding:28px 60px 40px;gap:36px;">
                <div style="width:40%;padding-right:28px;border-right:1px solid #E5E7EB;">
                    <div style="font-size:17px;font-style:italic;font-weight:700;color:#111827;margin-bottom:10px;">Tentang Saya</div>
                    <div style="height:1px;background:#E5E7EB;margin-bottom:16px;"></div>
                    <div style="font-size:12px;color:#374151;line-height:1.7;text-align:justify;white-space:pre-line;font-family:Inter,sans-serif;">${about}</div>
                </div>
                <div style="flex:1;">
                    <div style="font-size:17px;font-style:italic;font-weight:700;color:#111827;margin-bottom:10px;">Riwayat Pendidikan</div>
                    <div style="height:1px;background:#E5E7EB;margin-bottom:16px;"></div>
                    ${pendidikanLux}
                    <div style="font-size:17px;font-style:italic;font-weight:700;color:#111827;margin:26px 0 10px;">Pengalaman Kerja</div>
                    <div style="height:1px;background:#E5E7EB;margin-bottom:16px;"></div>
                    ${expLux}
                    <div style="font-size:17px;font-style:italic;font-weight:700;color:#111827;margin:26px 0 10px;">Kemampuan</div>
                    <div style="height:1px;background:#E5E7EB;margin-bottom:16px;"></div>
                    ${skillLux}
                </div>
            </div>
        </div>`;
	}

	if (template === "cv06") {
		// Dev Minimal: rail indigo, aksen monospace, chip skill
		const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
		const skillChips = skills
			.map(
				(s) =>
					`<span style="display:inline-block;border:1px solid #C7D2FE;background:#EEF2FF;color:#4338CA;border-radius:999px;padding:4px 10px;font-size:10.5px;font-family:${MONO};margin:0 6px 6px 0;">${esc(s.title)}: ${esc(s.desc)}</span>`,
			)
			.join("");
		const pendidikanDev = (cvData.pendidikans || [])
			.map(
				(pd) => `
                    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:12px 14px;margin-bottom:12px;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <span style="font-weight:700;font-size:13px;color:#111827;">${esc(pd.institusi) || "-"}</span>
                            <span style="font-size:10px;color:#9CA3AF;font-family:${MONO};">${esc(pd.tahun)}</span>
                        </div>
                        <div style="font-size:11px;color:#4F46E5;margin-top:2px;font-family:${MONO};">${esc(pd.jurusan) || "-"}</div>
                        ${pd.kegiatan ? `<div style="font-size:11px;color:#6B7280;margin-top:3px;">${esc(pd.kegiatan)}</div>` : ""}
                    </div>`,
			)
			.join("");
		const expCards = (cvData.experiences || [])
			.map(
				(e) => `
                    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:12px 14px;margin-bottom:12px;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <span style="font-weight:700;font-size:13px;color:#111827;">${esc(e.company) || "Nama Perusahaan"}</span>
                            <span style="font-size:10px;color:#9CA3AF;font-family:${MONO};">${esc(e.period)}</span>
                        </div>
                        <div style="font-size:11px;color:#6B7280;margin:2px 0 5px;">${esc(e.role) || "Jabatan"}</div>
                        <div style="font-size:11.5px;color:#4B5563;line-height:1.6;white-space:pre-line;">${esc(e.desc)}</div>
                    </div>`,
			)
			.join("");
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;">
            <div style="display:flex;height:100%;">
                <div style="width:14px;background:#4F46E5;flex-shrink:0;"></div>
                <div style="flex:1;padding:40px 48px;">
                    <div style="font-size:11px;color:#9CA3AF;font-family:${MONO};">~/cv/${name.toLowerCase().replace(/\s+/g, "-") || "nama"}</div>
                    <div style="font-family:Poppins,sans-serif;font-size:32px;font-weight:700;color:#111827;margin-top:4px;">${name}</div>
                    <div style="font-size:12px;color:#4F46E5;font-weight:500;margin-top:2px;font-family:${MONO};">&gt; ${title}</div>
                    <div style="font-size:10.5px;color:#9CA3AF;margin-top:10px;font-family:${MONO};">${phone || "-"} / ${email || "-"} / ${address || "-"}</div>
                    <div style="font-size:10.5px;color:#4F46E5;font-weight:600;margin:22px 0 10px;font-family:${MONO};">// tentang</div>
                    <p style="font-size:11.5px;color:#4B5563;line-height:1.65;white-space:pre-line;">${about}</p>
                    <div style="font-size:10.5px;color:#4F46E5;font-weight:600;margin:22px 0 10px;font-family:${MONO};">// pendidikan</div>
                    ${pendidikanDev}
                    <div style="font-size:10.5px;color:#4F46E5;font-weight:600;margin:22px 0 10px;font-family:${MONO};">// pengalaman</div>
                    ${expCards}
                    <div style="font-size:10.5px;color:#4F46E5;font-weight:600;margin:22px 0 10px;font-family:${MONO};">// kemampuan</div>
                    <div>${skillChips}</div>
                </div>
            </div>
        </div>`;
	}

	if (template === "cv07") {
		// Classic Fresh: sidebar krem + aksen cokelat (versi PDF dari template-cv07.html)
		const skillLis7 = skills
			.map(
				(s) =>
					`<li style="font-size:12px;color:#1F2937;margin-bottom:6px;"><strong style="color:#664229;">${esc(s.title)}</strong> — ${esc(s.desc)}</li>`,
			)
			.join("");
		const pendidikanLis7 = (cvData.pendidikans || [])
			.map(
				(pd) => `
                    <div style="margin-bottom:12px;">
                        <div style="font-weight:700;color:#664229;font-size:12px;">${esc(pd.institusi) || "-"}</div>
                        <div style="font-size:12px;color:#1F2937;">${esc(pd.jurusan) || "-"}</div>
                        <div style="font-size:11px;color:#6B7280;">${esc(pd.tahun)}</div>
                        ${pd.kegiatan ? `<div style="font-size:11px;color:#6B7280;margin-top:3px;">${esc(pd.kegiatan)}</div>` : ""}
                    </div>`,
			)
			.join("");
		const penghargaanLis7 = (cvData.penghargaans || [])
			.map(
				(a) =>
					`<li style="font-size:12px;color:#1F2937;margin-bottom:6px;"><strong style="color:#664229;">${esc(a.judul)}</strong>${a.tahun ? ` — ${esc(a.tahun)}` : ""}</li>`,
			)
			.join("");
		const organisasiLis7 = (cvData.organisasis || [])
			.map((org) => {
				const bullets = (org.deskripsi || "")
					.split("\n")
					.filter((l) => l.trim())
					.map((l) => `<li>${esc(l.replace(/^•\s*/, ""))}</li>`)
					.join("");
				return `
                    <div style="margin-bottom:22px;">
                        <h4 style="font-weight:700;color:#664229;margin:0;">${esc(org.instansi) || "Nama Instansi"}</h4>
                        <p style="font-size:13px;color:#4B5563;margin:2px 0 8px;">${esc(org.posisi) || ""}${org.tanggal ? ` · ${esc(org.tanggal)}` : ""}</p>
                        <ul style="list-style:disc;padding-left:18px;font-size:13px;color:#374151;line-height:1.6;margin:0;">${bullets}</ul>
                    </div>`;
			})
			.join("");
		const foto7 = cvData.foto
			? `<img src="${esc(cvData.foto)}" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 24px;border:4px solid white;box-shadow:0 2px 8px rgba(0,0,0,.12);display:block;" />`
			: `<div style="width:140px;height:140px;border-radius:50%;background:white;margin:0 auto 24px;border:4px solid white;box-shadow:0 2px 8px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center;"><i class="fa-solid fa-user" style="font-size:44px;color:#C9BBA8;"></i></div>`;
		const asideBlock7 = (label: string, inner: string) => `
                    <div style="font-weight:700;color:#664229;font-size:18px;margin:24px 0 12px;">${label}</div>
                    ${inner}`;
		const penghargaanBlock7 =
			(cvData.penghargaans || []).length > 0
				? asideBlock7("Penghargaan", `<ul style="list-style:disc;padding-left:18px;margin:0;">${penghargaanLis7}</ul>`)
				: "";
		const hobiBlock7 = cvData.hobi ? asideBlock7("Hobi", `<div style="font-size:13px;color:#1F2937;">${esc(cvData.hobi)}</div>`) : "";
		const organisasiBlock7 =
			(cvData.organisasis || []).length > 0
				? `
                    <h3 style="font-weight:700;color:#664229;font-size:22px;margin:28px 0 12px;">Pengalaman Organisasi</h3>
                    ${organisasiLis7}`
				: "";
		const expLis7 = (cvData.experiences || [])
			.map((e) => {
				const bullets = (e.desc || "")
					.split("\n")
					.filter((l) => l.trim())
					.map((l) => `<li>${esc(l.replace(/^•\s*/, ""))}</li>`)
					.join("");
				return `
                    <div style="margin-bottom:22px;">
                        <h4 style="font-weight:700;color:#664229;margin:0;">${esc(e.company) || "Nama Perusahaan"}</h4>
                        <p style="font-size:13px;color:#4B5563;margin:2px 0 8px;">${esc(e.role) || "Jabatan"} · ${esc(e.period)}</p>
                        <ul style="list-style:disc;padding-left:18px;font-size:13px;color:#374151;line-height:1.6;margin:0;">${bullets}</ul>
                    </div>`;
			})
			.join("");
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;">
            <div style="display:flex;height:100%;">
                <aside style="width:35%;background:#EAE2D6;padding:32px;">
                    ${foto7}
                    <div style="font-weight:700;color:#664229;font-size:18px;margin:0 0 12px;">Kontak</div>
                    <ul style="list-style:none;padding:0;margin:0;font-size:13px;color:#1F2937;">
                        <li style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><i class="fa-solid fa-phone" style="width:14px;color:#664229;"></i>${phone || "-"}</li>
                        <li style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><i class="fa-solid fa-envelope" style="width:14px;color:#664229;"></i>${email || "-"}</li>
                        <li style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><i class="fa-solid fa-location-dot" style="width:14px;color:#664229;"></i>${address || "-"}</li>
                    </ul>
                    ${penghargaanBlock7}
                    ${hobiBlock7}
                </aside>
                <section style="flex:1;background:white;padding:40px;">
                    <h1 style="font-weight:800;font-size:40px;color:#664229;text-transform:capitalize;line-height:1.1;margin:0 0 6px;">${name}</h1>
                    <h2 style="font-size:22px;color:#374151;letter-spacing:4px;text-transform:uppercase;margin:0 0 28px;">${title}</h2>
                    <h3 style="font-weight:700;color:#664229;font-size:22px;margin:28px 0 12px;">Tentang Saya</h3>
                    <p style="text-align:justify;color:#374151;font-size:13px;line-height:1.7;white-space:pre-line;">${about}</p>
                    <h3 style="font-weight:700;color:#664229;font-size:22px;margin:28px 0 12px;">Riwayat Pendidikan</h3>
                    ${pendidikanLis7}
                    <h3 style="font-weight:700;color:#664229;font-size:22px;margin:28px 0 12px;">Pengalaman Kerja</h3>
                    ${expLis7}
                    ${organisasiBlock7}
                    <h3 style="font-weight:700;color:#664229;font-size:22px;margin:28px 0 12px;">Kemampuan</h3>
                    <ul style="list-style:disc;padding-left:18px;margin:0;">${skillLis7}</ul>
                </section>
            </div>
        </div>`;
	}


	// cv01 Editorial: kertas hangat + garis emas, kemampuan berupa penjelasan
	const skillEd = skills
		.map(
			(s) =>
				`<div style="font-size:11.5px;color:#4A403A;line-height:1.65;margin-bottom:10px;"><span style="font-weight:600;color:#211A17;">${esc(s.title)}</span><span style="color:#C9A227;"> — </span>${esc(s.desc)}</div>`,
		)
		.join("");
	const pendidikanEd = (cvData.pendidikans || [])
		.map(
			(pd) => `
                    <div style="margin-bottom:12px;border-bottom:1px dashed #E8E0D3;padding-bottom:10px;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <span style="font-weight:700;font-size:12.5px;color:#211A17;">${esc(pd.institusi) || "-"}</span>
                            <span style="font-size:10px;color:#A79A8A;letter-spacing:1px;">${esc(pd.tahun)}</span>
                        </div>
                        <div style="font-size:11px;color:#C9A227;font-weight:600;margin-top:2px;">${esc(pd.jurusan) || "-"}</div>
                        ${pd.kegiatan ? `<div style="font-size:11px;color:#4A403A;margin-top:3px;">${esc(pd.kegiatan)}</div>` : ""}
                    </div>`,
		)
		.join("");
	const expEd = (cvData.experiences || [])
		.map(
			(e) => `
                    <div style="margin-bottom:16px;border-bottom:1px dashed #E8E0D3;padding-bottom:13px;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <span style="font-weight:700;font-size:13.5px;color:#211A17;">${esc(e.company) || "Nama Perusahaan"}</span>
                            <span style="font-size:10px;color:#A79A8A;letter-spacing:1px;">${esc(e.period)}</span>
                        </div>
                        <div style="font-size:11.5px;color:#C9A227;font-weight:600;margin:2px 0 5px;">${esc(e.role) || "Jabatan"}</div>
                        <div style="font-size:11.5px;color:#4A403A;line-height:1.65;white-space:pre-line;">${esc(e.desc)}</div>
                    </div>`,
		)
		.join("");
	const edSection = (label: string, inner: string) => `
                    <div style="margin-bottom:16px;">
                        <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#3B2F2A;">${label}</div>
                        <div style="width:36px;height:2px;background:#C9A227;margin-top:6px;margin-bottom:12px;"></div>
                        ${inner}
                    </div>`;
	return `
        <div class="cv-paper" style="width:794px;height:1123px;background:#FDFBF7;overflow:hidden;">
            <div style="padding:48px 56px 22px;border-bottom:2px solid #C9A227;">
                <div style="font-family:Poppins,sans-serif;font-size:38px;font-weight:700;line-height:1.1;color:#211A17;">${name}</div>
                <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8A6D3B;font-weight:600;margin-top:8px;">${title}</div>
                <div style="display:flex;gap:24px;margin-top:20px;font-size:11px;color:#4A403A;">
                    <div><i class="fa-solid fa-phone" style="color:#C9A227;margin-right:6px;width:12px;"></i>${phone || "-"}</div>
                    <div><i class="fa-solid fa-envelope" style="color:#C9A227;margin-right:6px;width:12px;"></i>${email || "-"}</div>
                    <div><i class="fa-solid fa-location-dot" style="color:#C9A227;margin-right:6px;width:12px;"></i>${address || "-"}</div>
                </div>
            </div>
            <div style="display:flex;padding:36px 56px;gap:40px;">
                <div style="width:42%;">
                    ${edSection("Tentang Saya", `<div style="font-size:12px;color:#4A403A;line-height:1.7;text-align:justify;white-space:pre-line;">${about}</div>`)}
                    ${edSection("Riwayat Pendidikan", pendidikanEd)}
                </div>
                <div style="flex:1;">
                    ${edSection("Pengalaman Kerja", expEd)}
                    ${edSection("Kemampuan", skillEd)}
                </div>
            </div>
        </div>`;
};