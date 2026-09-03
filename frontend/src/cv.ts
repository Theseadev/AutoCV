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
	photo?: string;
	photoShape?: "round" | "square" | "rounded";
	themeColor?: string;
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
	| "title"
	| "pendidikan"
	| "kemampuan"
	| "penghargaan"
	| "hobi"
	| "tentang"
	| "pengalaman"
	| "organisasi";

export const TEMPLATE_SECTIONS: Record<string, CvSection[]> = {
	cv01: [
		"kontak",
		"tentang",
		"pengalaman",
		"organisasi",
		"pendidikan",
		"kemampuan",
	],
};
export const defaultCv: CvData = {
	name: "MUHAMMAD FAHRUL BAHRI",
	title: "",
	phone: "+62 812 3456 7890",
	email: "fahrulbahri@gmail.com",
	address: "Jalan Merdeka No. 123, Jakarta",
	photo: "",
	themeColor: "#EAEAEA",
	about:
		"Saya lulusan SMK Negeri 1 Jakarta jurusan Teknik Komputer dan Jaringan, berpengalaman mengikuti Praktik Kerja Lapangan (PKL) di bidang IT Support dan Jaringan di PT Teknologi Nusantara. Terbiasa membantu pemeliharaan sistem, dokumentasi inventaris perangkat, dan instalasi infrastruktur jaringan kantor. Mampu bekerja di lapangan dengan menjaga standar prosedur kerja dan berkoordinasi baik bersama tim teknis. Memiliki kemampuan komunikasi yang baik, cepat beradaptasi, serta bertanggung jawab dalam menyelesaikan tugas. Siap memberikan kontribusi terbaik dan berkembang bersama perusahaan.",
	experiences: [
		{
			id: 1,
			company: "PT Teknologi Nusantara",
			role: "IT Support & Network Administrator - Praktik Kerja Lapangan",
			period: "2023 - 2024",
			desc: "Mempelajari penerapan standar pemeliharaan sistem dan infrastruktur jaringan komputer di lingkungan perusahaan. Membantu melakukan inspeksi berkala perangkat kerja, mendokumentasikan troubleshooting hardware, serta menyosialisasikan panduan operasional IT kepada staf. Terlibat dalam konfigurasi perangkat jaringan dan pelaporan performa sistem kepada tim teknis senior.",
		},
	],
	organisasis: [
		{
			id: 1,
			instansi: "Divisi Humas & Media",
			posisi: "Anggota Organisasi",
			tanggal: "2025",
			deskripsi:
				"Berperan aktif mendukung kelancaran kegiatan tahunan melalui pembuatan materi publikasi, pengelolaan media informasi, serta dokumentasi visual. Menjaga koordinasi antara panitia, peserta, dan pihak luar untuk membangun citra kegiatan yang positif serta profesional.",
		},
		{
			id: 2,
			instansi: "Divisi Lapangan & Logistik",
			posisi: "Koordinator Tim",
			tanggal: "2025",
			deskripsi:
				"Mengoordinasikan rangkaian program bakti sosial dan renovasi fasilitas belajar di panti asuhan sebagai bentuk kepedulian masyarakat. Mengatur pembagian penugasan, pengadaan perlengkapan, serta memastikan seluruh kegiatan berjalan tertib dan tepat waktu.",
		},
		{
			id: 3,
			instansi: "Divisi Perlengkapan",
			posisi: "Anggota Organisasi",
			tanggal: "2025",
			deskripsi:
				"Mendukung kelancaran pelaksanaan forum diskusi dan seminar kepemudaan 2024. Menyiapkan sarana teknis, mengelola alur distribusi perlengkapan operasional, serta memastikan seluruh fasilitas pendukung siap digunakan sepanjang acara berlangsung.",
		},
	],
	pendidikans: [
		{
			id: 1,
			institusi: "SMK Negeri 1 Jakarta",
			jurusan: "Teknik Komputer dan Jaringan",
			tahun: "2021 - 2024",
			kegiatan:
				"Mempelajari perancangan sistem jaringan komputer, administrasi server, dan perakitan perangkat keras komputer. Mengikuti praktik simulasi jaringan lokal, pengujian keamanan sistem, dan penyusunan dokumentasi teknis secara terstruktur. Terlibat aktif dalam praktik kerja lapangan (PKL) untuk mendalami implementasi teknologi informasi di dunia industri secara nyata.",
		},
	],
	penghargaans: [],
};

export const defaultSkillsText = `Pribadi:
• Mampu berkomunikasi dengan jelas, sopan, dan efektif.
• Disiplin, bertanggung jawab, serta memiliki etika kerja yang baik.
• Cepat beradaptasi dalam berbagai situasi lingkungan kerja.
• Teliti dalam menyelesaikan tugas dan konsisten menjaga kerapian.
• Memiliki kemauan tinggi untuk terus belajar dan berkembang.

Profesional:
• Terbiasa bekerja sama dalam tim maupun secara mandiri.
• Mampu mengelola waktu dengan baik untuk target yang ditentukan.
• Mampu menangani beberapa tugas secara bersamaan (multitasking).
• Memiliki keterampilan pemecahan masalah yang analitis dan solutif.
• Terbiasa bekerja di bawah tekanan dengan menjaga kualitas hasil kerja.`;

export const storeSkillsText = defaultSkillsText;

// Data referensi untuk tampilan preview etalase
export const storeCv: CvData = { ...defaultCv };

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
				: { title: line.trim(), desc: "" };
		});

// Bangun HTML kertas CV dari data (dipakai untuk PDF bersih tanpa watermark)
export const buildCvHtml = (
	inputCvData: CvData,
	skillsText: string,
	inputTemplate = "cv01",
): string => {
	const isNoPhoto = inputTemplate.endsWith("_no");
	const template = inputTemplate.replace("_no", "").replace("_photo", "");
	const cvData = isNoPhoto ? { ...inputCvData, photo: "" } : inputCvData;
	
	const getRadius = (defaultVal: string) => {
		if (cvData.photoShape === 'round') return '50%';
		if (cvData.photoShape === 'rounded') return '12px';
		if (cvData.photoShape === 'square') return '4px';
		return defaultVal;
	};

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
	// Organisasi pakai gaya item yang sama dengan pengalaman kerja (seragam di semua template)
	const orgs = (cvData.organisasis || [])
		.map(
			(o) => `
            <div>
                <div class="flex justify-between items-baseline mb-1">
                    <h4 class="font-bold text-gray-900">${esc(o.instansi) || "Nama Instansi"}</h4>
                    <span class="text-xs text-gray-500 font-medium">${esc(o.tanggal)}</span>
                </div>
                <p class="text-sm italic text-gray-600 mb-1">${esc(o.posisi) || "Jabatan"}</p>
                <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">${esc(o.deskripsi)}</div>
            </div>`,
		)
		.join("");
	const orgBlock = (cvData.organisasis || []).length
		? `<h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-3">Pengalaman Organisasi</h3><div class="space-y-5 mb-8">${orgs}</div>`
		: "";
	const sertifLis = (cvData.penghargaans || [])
		.map(
			(a) =>
				`<li><strong>${esc(a.judul)}</strong>${a.tahun ? ` — ${esc(a.tahun)}` : ""}</li>`,
		)
		.join("");
	const sertifikatBlock = (cvData.penghargaans || []).length
		? `<h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-3">Sertifikat</h3><ul class="text-sm text-gray-700 space-y-1">${sertifLis}</ul>`
		: "";
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
		const t02 = cvData.themeColor || "#1F2937";
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;position:relative;">
            <div style="padding:56px 64px;height:100%;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
                    <div style="flex:1;padding-right:16px;">
                        <h1 class="text-4xl font-bold text-gray-900 mb-1">${name}</h1>
                        <h2 class="text-lg font-semibold mb-2" style="color:${t02};">${title}</h2>
                        <p class="text-xs text-gray-500">
                            <i class="fa-solid fa-phone mr-1 w-4" style="color:${t02};"></i>${phone || "-"} &nbsp;|&nbsp;
                            <i class="fa-solid fa-envelope mr-1 w-4" style="color:${t02};"></i>${email || "-"} &nbsp;|&nbsp;
                            <i class="fa-solid fa-location-dot mr-1 w-4" style="color:${t02};"></i>${address || "-"}
                        </p>
                    </div>
                    ${cvData.photo ? `<img src="${cvData.photo}" style="width:110px;height:110px;border-radius:${getRadius('8px')};object-fit:cover;border:2px solid #F3F4F6;flex-shrink:0;" />` : ""}
                </div>
                <h3 class="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style="color:${t02};border-color:${t02};">Tentang Saya</h3>
                <p class="text-sm text-gray-700 leading-relaxed text-justify mb-8 whitespace-pre-line">${about}</p>
                <h3 class="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style="color:${t02};border-color:${t02};">Riwayat Pendidikan</h3>
                <div class="space-y-4 mb-8">${pendidikanLis2}</div>
                <h3 class="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-4" style="color:${t02};border-color:${t02};">Pengalaman Kerja</h3>
                <div class="space-y-5 mb-8">${exps}</div>
                ${orgBlock}
                <h3 class="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style="color:${t02};border-color:${t02};">Kemampuan</h3>
                <ul class="text-sm text-gray-700 space-y-1">${skillLis}</ul>
                ${sertifikatBlock}
            </div>
        </div>`;
	}

	if (template === "cv03") {
		const t03 = cvData.themeColor || "#111827";
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;display:flex;flex-direction:column;">
            <div style="background-color:${t03};padding:40px 48px;display:flex;justify-content:space-between;align-items:center;gap:32px;">
                <div style="flex:1;">
                    <h1 class="text-4xl font-bold text-white mb-1">${name}</h1>
                    <h2 class="text-xl font-light text-gray-300 tracking-wide">${title}</h2>
                </div>
                ${cvData.photo ? `<img src="${cvData.photo}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid #374151;flex-shrink:0;" />` : ""}
            </div>
            <div class="flex">
                <div class="w-2/5 p-8 bg-gray-50 border-r border-gray-200">
                    <h3 class="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-4" style="color:${t03};border-color:${t03};">Kontak</h3>
                    <ul class="text-sm space-y-3 mb-8">
                        <li class="flex items-start"><i class="fa-solid fa-phone mt-1 w-5" style="color:${t03};"></i><span>${phone || "-"}</span></li>
                        <li class="flex items-start"><i class="fa-solid fa-envelope mt-1 w-5" style="color:${t03};"></i><span style="word-break:break-all;">${email || "-"}</span></li>
                        <li class="flex items-start"><i class="fa-solid fa-location-dot mt-1 w-5" style="color:${t03};"></i><span>${address || "-"}</span></li>
                    </ul>
                    <h3 class="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-4" style="color:${t03};border-color:${t03};">Riwayat Pendidikan</h3>
                    <div class="space-y-4 mb-8">${pendidikanLis3}</div>
                    <h3 class="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style="color:${t03};border-color:${t03};">Kemampuan</h3>
                    <ul class="text-sm space-y-2 list-disc pl-4">${skillLis}</ul>
                </div>
                <div class="w-3/5 p-8">
                    <h3 class="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style="color:${t03};border-color:${t03};">Tentang Saya</h3>
                    <p class="text-sm text-gray-700 leading-relaxed text-justify mb-8 whitespace-pre-line">${about}</p>
                    <h3 class="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-4" style="color:${t03};border-color:${t03};">Pengalaman Kerja</h3>
                    <div class="space-y-5">${exps}</div>
                    ${(cvData.organisasis || []).length ? `<h3 class="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mt-8 mb-4" style="color:${t03};border-color:${t03};">Pengalaman Organisasi</h3><div class="space-y-5">${orgs}</div>` : ""}
                    ${(cvData.penghargaans || []).length ? `<h3 class="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mt-8 mb-4" style="color:${t03};border-color:${t03};">Sertifikat</h3><ul class="text-sm space-y-2 list-disc pl-4">${sertifLis}</ul>` : ""}
                </div>
            </div>
        </div>`;
	}

	if (template === "cv04") {
		// Geometric Neo: header navy + pita diagonal, tile kontak, progress bar skill, timeline bernomor
		const t04 = cvData.themeColor || "#4F46E5";
		const skillGeo = skills
			.map(
				(s, i) => `
                    <div style="display:flex;gap:10px;margin-bottom:12px;font-size:11.5px;color:#475569;line-height:1.6;">
                        <span style="color:${t04};font-weight:700;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;flex-shrink:0;">${String(i + 1).padStart(2, "0")}</span>
                        <div><span style="font-weight:600;color:#0F172A;">${esc(s.title)}</span><span style="color:#94A3B8;"> — </span>${esc(s.desc)}</div>
                    </div>`,
			)
			.join("");
		const sertifikatGeo = (cvData.penghargaans || [])
			.map(
				(a) =>
					`<div style="font-size:11.5px;color:#475569;line-height:1.6;margin-bottom:10px;"><strong style="color:#0F172A;">${esc(a.judul)}</strong>${a.tahun ? `<span style="color:#94A3B8;"> — ${esc(a.tahun)}</span>` : ""}</div>`,
			)
			.join("");
		const pendidikanLis4 = (cvData.pendidikans || [])
			.map(
				(pd) => `
                    <div style="display:flex;gap:14px;margin-bottom:12px;">
                        <div style="width:2px;background:#EEF2FF;position:relative;top:4px;">
                            <div style="width:6px;height:6px;border-radius:50%;background:${t04};position:absolute;left:-2px;top:0;box-shadow:0 0 0 3px white;"></div>
                        </div>
                        <div style="flex:1;">
                            <div style="font-weight:700;font-size:12.5px;color:#0F172A;margin-bottom:2px;">${esc(pd.institusi) || "-"}</div>
                            <div style="font-size:11px;font-weight:600;color:${t04};margin-bottom:4px;">${esc(pd.jurusan) || "-"}</div>
                            <div style="font-size:10px;color:#94A3B8;letter-spacing:1px;margin-bottom:4px;">${esc(pd.tahun)}</div>
                            ${pd.kegiatan ? `<div style="font-size:11px;color:#475569;line-height:1.6;">${esc(pd.kegiatan)}</div>` : ""}
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
                            <div style="font-size:11px;font-weight:600;color:${t04};margin:2px 0 4px;">${esc(e.role) || "Jabatan"}</div>
                            <div style="font-size:11.5px;color:#475569;line-height:1.6;white-space:pre-line;">${esc(e.desc)}</div>
                        </div>
                    </div>`,
			)
			.join("");
		const orgNum = (cvData.organisasis || [])
			.map(
				(o, i) => `
                    <div style="display:flex;gap:14px;margin-bottom:14px;">
                        <div style="width:26px;height:26px;border-radius:50%;background:#0F172A;color:white;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${String(i + 1).padStart(2, "0")}</div>
                        <div style="flex:1;border-bottom:1px solid #EEF2FF;padding-bottom:14px;">
                            <div style="display:flex;justify-content:space-between;align-items:baseline;">
                                <span style="font-weight:700;font-size:13px;color:#0F172A;">${esc(o.instansi) || "Nama Instansi"}</span>
                                <span style="font-size:10px;color:#94A3B8;">${esc(o.tanggal)}</span>
                            </div>
                            <div style="font-size:11px;font-weight:600;color:${t04};margin:2px 0 4px;">${esc(o.posisi) || "Jabatan"}</div>
                            <div style="font-size:11.5px;color:#475569;line-height:1.6;white-space:pre-line;">${esc(o.deskripsi)}</div>
                        </div>
                    </div>`,
			)
			.join("");
		const tile = (icon: string, val: string) => `
                    <div style="display:flex;align-items:center;gap:10px;font-size:11.5px;color:#3730A3;font-weight:500;">
                        <span style="width:28px;height:28px;border-radius:8px;background:white;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(15,23,42,.08);">
                            <i class="fa-solid fa-${icon}" style="color:${t04};font-size:12px;"></i>
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
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0F172A;margin-bottom:14px;">Riwayat Pendidikan</div>
                    ${pendidikanLis4}
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0F172A;margin:18px 0 14px;">Kemampuan</div>
                    ${skillGeo}
                </div>
                <div style="flex:1;">
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0F172A;margin-bottom:10px;">Tentang Saya</div>
                    <p style="font-size:11.5px;color:#475569;line-height:1.6;text-align:justify;margin-bottom:16px;white-space:pre-line;">${about}</p>
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0F172A;margin:18px 0 14px;">Pengalaman Kerja</div>
                    ${expNum}
                    ${(cvData.organisasis || []).length ? `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0F172A;margin:18px 0 14px;">Pengalaman Organisasi</div>${orgNum}` : ""}
                    ${(cvData.penghargaans || []).length ? `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0F172A;margin:18px 0 14px;">Sertifikat</div>${sertifikatGeo}` : ""}
                </div>
            </div>
        </div>`;
	}

	if (template === "cv05") {
		// Lux Monochrome: tipografi serif, aksen dinamis, garis ganda
		const t05 = cvData.themeColor || "#111827";
		const skillLux = skills
			.map(
				(s) =>
					`<div style="font-size:12px;color:#374151;margin-bottom:8px;"><strong>${esc(s.title)}</strong><span style="color:#9CA3AF;"> — </span>${esc(s.desc)}</div>`,
			)
			.join("");
		const sertifikatLux = (cvData.penghargaans || [])
			.map(
				(a) =>
					`<div style="margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #F3F4F6;font-size:12px;color:#374151;font-family:Inter,sans-serif;"><span style="font-family:'Playfair Display',serif;font-weight:700;font-size:13px;color:#111827;">${esc(a.judul)}</span>${a.tahun ? `<span style="color:#9CA3AF;"> — ${esc(a.tahun)}</span>` : ""}</div>`,
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
		const orgLux = (cvData.organisasis || [])
			.map(
				(o) => `
                    <div style="margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #F3F4F6;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <span style="font-family:'Playfair Display',serif;font-weight:700;font-size:13.5px;color:#111827;">${esc(o.instansi) || "Nama Instansi"}</span>
                            <span style="font-size:9.5px;letter-spacing:2px;text-transform:uppercase;color:#9CA3AF;font-family:Inter,sans-serif;">${esc(o.tanggal)}</span>
                        </div>
                        <div style="font-size:11px;font-style:italic;color:#6B7280;margin:3px 0 6px;">${esc(o.posisi) || "Jabatan"}</div>
                        <div style="font-size:11.5px;color:#4B5563;line-height:1.65;white-space:pre-line;font-family:Inter,sans-serif;">${esc(o.deskripsi)}</div>
                    </div>`,
			)
			.join("");
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;font-family:'Playfair Display',serif;">
            <div style="text-align:center;padding:44px 60px 20px;">
                <div style="font-size:40px;font-weight:700;color:#111827;letter-spacing:2px;">${name}</div>
                <div style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${t05};margin-top:10px;font-family:Inter,sans-serif;font-weight:600;">${title}</div>
                <div style="border-top:1px solid ${t05};border-bottom:1px solid ${t05};height:5px;margin:22px 0 0;"></div>
            </div>
            <div style="text-align:center;font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:#9CA3AF;font-family:Inter,sans-serif;padding-top:12px;">${phone || "-"} &nbsp;·&nbsp; ${email || "-"} &nbsp;·&nbsp; ${address || "-"}</div>
            <div style="display:flex;padding:28px 60px 40px;gap:36px;">
                <div style="width:40%;padding-right:28px;border-right:1px solid #E5E7EB;">
                    <div style="font-size:17px;font-style:italic;font-weight:700;color:${t05};margin-bottom:10px;">Riwayat Pendidikan</div>
                    <div style="height:1px;background:#E5E7EB;margin-bottom:16px;"></div>
                    ${pendidikanLux}
                    <div style="font-size:17px;font-style:italic;font-weight:700;color:${t05};margin:26px 0 10px;">Kemampuan</div>
                    <div style="height:1px;background:#E5E7EB;margin-bottom:16px;"></div>
                    ${skillLux}
                </div>
                <div style="flex:1;">
                    <div style="font-size:17px;font-style:italic;font-weight:700;color:${t05};margin-bottom:10px;">Tentang Saya</div>
                    <div style="height:1px;background:#E5E7EB;margin-bottom:16px;"></div>
                    <div style="font-size:12px;color:#374151;line-height:1.7;text-align:justify;white-space:pre-line;font-family:Inter,sans-serif;">${about}</div>
                    <div style="font-size:17px;font-style:italic;font-weight:700;color:${t05};margin:26px 0 10px;">Pengalaman Kerja</div>
                    <div style="height:1px;background:#E5E7EB;margin-bottom:16px;"></div>
                    ${expLux}
                    ${(cvData.organisasis || []).length ? `<div style="font-size:17px;font-style:italic;font-weight:700;color:${t05};margin:26px 0 10px;">Pengalaman Organisasi</div>
                    <div style="height:1px;background:#E5E7EB;margin-bottom:16px;"></div>
                    ${orgLux}` : ""}
                    ${(cvData.penghargaans || []).length ? `<div style="font-size:17px;font-style:italic;font-weight:700;color:${t05};margin:26px 0 10px;">Sertifikat</div>
                    <div style="height:1px;background:#E5E7EB;margin-bottom:16px;"></div>
                    ${sertifikatLux}` : ""}
                </div>
            </div>
        </div>`;
	}

	if (template === "cv06") {
		// Dev Minimal: rail dinamis, aksen monospace, chip skill
		const t06 = cvData.themeColor || "#4F46E5";
		const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
		const skillChips = skills
			.map(
				(s) =>
					`<span style="display:inline-block;border:1px solid ${t06}40;background:${t06}12;color:${t06};border-radius:999px;padding:4px 10px;font-size:10.5px;font-family:${MONO};margin:0 6px 6px 0;">${esc(s.title)}: ${esc(s.desc)}</span>`,
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
                        <div style="font-size:11px;color:${t06};margin-top:2px;font-family:${MONO};">${esc(pd.jurusan) || "-"}</div>
                        ${pd.kegiatan ? `<div style="font-size:11px;color:#6B7280;margin-top:3px;">${esc(pd.kegiatan)}</div>` : ""}
                    </div>`,
			)
			.join("");
		const sertifikatDev = (cvData.penghargaans || [])
			.map(
				(a) =>
					`<div style="border:1px solid #E5E7EB;border-radius:8px;padding:10px 14px;margin-bottom:8px;font-size:11.5px;color:#4B5563;"><strong style="color:#111827;">${esc(a.judul)}</strong>${a.tahun ? `<span style="color:#9CA3AF;"> — ${esc(a.tahun)}</span>` : ""}</div>`,
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
		const orgCards = (cvData.organisasis || [])
			.map(
				(o) => `
                    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:12px 14px;margin-bottom:12px;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <span style="font-weight:700;font-size:13px;color:#111827;">${esc(o.instansi) || "Nama Instansi"}</span>
                            <span style="font-size:10px;color:#9CA3AF;font-family:${MONO};">${esc(o.tanggal)}</span>
                        </div>
                        <div style="font-size:11px;color:#6B7280;margin:2px 0 5px;">${esc(o.posisi) || "Jabatan"}</div>
                        <div style="font-size:11.5px;color:#4B5563;line-height:1.6;white-space:pre-line;">${esc(o.deskripsi)}</div>
                    </div>`,
			)
			.join("");
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;">
            <div style="display:flex;height:100%;">
                <div style="width:14px;background:${t06};flex-shrink:0;"></div>
                <div style="flex:1;padding:40px 48px;">
                    <div style="font-size:11px;color:#9CA3AF;font-family:${MONO};">~/cv/${name.toLowerCase().replace(/\s+/g, "-") || "nama"}</div>
                    <div style="font-family:Poppins,sans-serif;font-size:32px;font-weight:700;color:#111827;margin-top:4px;">${name}</div>
                    <div style="font-size:12px;color:${t06};font-weight:500;margin-top:2px;font-family:${MONO};">&gt; ${title}</div>
                    <div style="font-size:10.5px;color:#9CA3AF;margin-top:10px;font-family:${MONO};">${phone || "-"} / ${email || "-"} / ${address || "-"}</div>
                    <div style="font-size:10.5px;color:${t06};font-weight:600;margin:22px 0 10px;font-family:${MONO};">// tentang</div>
                    <p style="font-size:11.5px;color:#4B5563;line-height:1.65;white-space:pre-line;">${about}</p>
                    <div style="font-size:10.5px;color:${t06};font-weight:600;margin:22px 0 10px;font-family:${MONO};">// pendidikan</div>
                    ${pendidikanDev}
                    <div style="font-size:10.5px;color:${t06};font-weight:600;margin:22px 0 10px;font-family:${MONO};">// pengalaman</div>
                    ${expCards}
                    ${
											(cvData.organisasis || []).length
												? `<div style="font-size:10.5px;color:${t06};font-weight:600;margin:22px 0 10px;font-family:${MONO};">// organisasi</div>
                    ${orgCards}`
												: ""
										}
                    <div style="font-size:10.5px;color:${t06};font-weight:600;margin:22px 0 10px;font-family:${MONO};">// kemampuan</div>
                    <div>${skillChips}</div>
                    ${
											(cvData.penghargaans || []).length
												? `<div style="font-size:10.5px;color:${t06};font-weight:600;margin:22px 0 10px;font-family:${MONO};">// sertifikat</div>
                    ${sertifikatDev}`
												: ""
										}
                </div>
            </div>
        </div>`;
	}

	if (template === "cv07") {
		// Classic Fresh: sidebar krem + aksen dinamis (versi PDF dari template-cv07.html)
		const t07 = cvData.themeColor || "#664229";
		const skillLis7 = skills
			.map(
				(s) =>
					`<li style="font-size:12px;color:#1F2937;margin-bottom:6px;"><strong style="color:${t07};">${esc(s.title)}</strong> — ${esc(s.desc)}</li>`,
			)
			.join("");
		const pendidikanLis7 = (cvData.pendidikans || [])
			.map(
				(pd) => `
                    <div style="margin-bottom:12px;">
                        <div style="font-weight:700;color:${t07};font-size:12px;">${esc(pd.institusi) || "-"}</div>
                        <div style="font-size:12px;color:#1F2937;">${esc(pd.jurusan) || "-"}</div>
                        <div style="font-size:11px;color:#6B7280;">${esc(pd.tahun)}</div>
                        ${pd.kegiatan ? `<div style="font-size:11px;color:#6B7280;margin-top:3px;">${esc(pd.kegiatan)}</div>` : ""}
                    </div>`,
			)
			.join("");
		const sertifikatLis7 = (cvData.penghargaans || [])
			.map(
				(a) =>
					`<li style="font-size:13px;color:#1F2937;margin-bottom:6px;"><strong style="color:${t07};">${esc(a.judul)}</strong>${a.tahun ? ` — ${esc(a.tahun)}` : ""}</li>`,
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
                        <h4 style="font-weight:700;color:${t07};margin:0;">${esc(org.instansi) || "Nama Instansi"}</h4>
                        <p style="font-size:13px;color:#4B5563;margin:2px 0 8px;">${esc(org.posisi) || ""}${org.tanggal ? ` · ${esc(org.tanggal)}` : ""}</p>
                        <ul style="list-style:disc;padding-left:18px;font-size:13px;color:#374151;line-height:1.6;margin:0;">${bullets}</ul>
                    </div>`;
			})
			.join("");
		const organisasiBlock7 =
			(cvData.organisasis || []).length > 0
				? `
                    <h3 style="font-weight:700;color:${t07};font-size:22px;margin:28px 0 12px;">Pengalaman Organisasi</h3>
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
                        <h4 style="font-weight:700;color:${t07};margin:0;">${esc(e.company) || "Nama Perusahaan"}</h4>
                        <p style="font-size:13px;color:#4B5563;margin:2px 0 8px;">${esc(e.role) || "Jabatan"} · ${esc(e.period)}</p>
                        <ul style="list-style:disc;padding-left:18px;font-size:13px;color:#374151;line-height:1.6;margin:0;">${bullets}</ul>
                    </div>`;
			})
			.join("");
		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;">
            <div style="display:flex;height:100%;">
                <aside style="width:35%;background:#EAE2D6;padding:32px;">
                    <div style="font-weight:700;color:${t07};font-size:18px;margin:0 0 12px;">Kontak</div>
                    <ul style="list-style:none;padding:0;margin:0;font-size:13px;color:#1F2937;">
                        <li style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><i class="fa-solid fa-phone" style="width:14px;color:${t07};"></i>${phone || "-"}</li>
                        <li style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><i class="fa-solid fa-envelope" style="width:14px;color:${t07};"></i>${email || "-"}</li>
                        <li style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><i class="fa-solid fa-location-dot" style="width:14px;color:${t07};"></i>${address || "-"}</li>
                    </ul>
                    <div style="font-weight:700;color:${t07};font-size:18px;margin:24px 0 12px;">Riwayat Pendidikan</div>
                    ${pendidikanLis7}
                    <div style="font-weight:700;color:${t07};font-size:18px;margin:24px 0 12px;">Kemampuan</div>
                    <ul style="list-style:disc;padding-left:18px;margin:0;">${skillLis7}</ul>
                </aside>
                <section style="flex:1;background:white;padding:40px;">
                    <h1 style="font-weight:800;font-size:40px;color:${t07};text-transform:capitalize;line-height:1.1;margin:0 0 6px;">${name}</h1>
                    <h2 style="font-size:22px;color:#374151;letter-spacing:4px;text-transform:uppercase;margin:0 0 28px;">${title}</h2>
                    <h3 style="font-weight:700;color:${t07};font-size:22px;margin:0 0 12px;">Tentang Saya</h3>
                    <p style="text-align:justify;color:#374151;font-size:13px;line-height:1.7;white-space:pre-line;">${about}</p>
                    <h3 style="font-weight:700;color:${t07};font-size:22px;margin:28px 0 12px;">Pengalaman Kerja</h3>
                    ${expLis7}
                    ${organisasiBlock7}
                    ${(cvData.penghargaans || []).length ? `<h3 style="font-weight:700;color:${t07};font-size:22px;margin:28px 0 12px;">Sertifikat</h3><ul style="list-style:disc;padding-left:18px;margin:0;">${sertifikatLis7}</ul>` : ""}
                </section>
            </div>
        </div>`;
	}

	// cv08 Peacock: banner dinamis mengikuti tema warna, sidebar krem
	if (template === "cv08") {
		const BR = cvData.themeColor || "#4A3326"; // Dynamic Main Brand Color
		const SK = "#F8F4ED"; // Warm Cream
		const ACCENT = cvData.themeColor || "#A67B5B";
		
		const skillLis8 = skills
			.map(
				(s) =>
					`<li style="padding:6px 0;border-bottom:1px solid rgba(74,51,38,.1);font-size:11.5px;color:#333;"><strong>${esc(s.title)}</strong> — ${esc(s.desc)}</li>`,
			)
			.join("");
            
		const pendidikanLis8 = (cvData.pendidikans || [])
			.map((pd) => {
				const kegiatan = (pd.kegiatan || "")
					.split("\n")
					.filter((l) => l.trim())
					.map((l) => `<li style="margin-bottom:3px;">${esc(l.replace(/^•\s*/, ""))}</li>`)
					.join("");
				return `
                    <div style="margin-bottom:14px;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <strong style="font-size:12.5px;color:${BR};">${esc(pd.institusi) || "-"}</strong>
                            <span style="font-size:10px;color:${ACCENT};font-weight:600;">${esc(pd.tahun)}</span>
                        </div>
                        <div style="font-size:11.5px;color:#555;font-weight:500;margin-top:2px;">${esc(pd.jurusan) || "-"}</div>
                        ${kegiatan ? `<ul style="list-style:disc;list-style-position:outside;padding-left:14px;margin:6px 0 0;font-size:11px;color:#444;">${kegiatan}</ul>` : ""}
                    </div>`;
			})
			.join("");
            
		const sertifikatLis8 = (cvData.penghargaans || [])
			.map(
				(a) =>
					`<li style="margin-bottom:6px;font-size:11.5px;color:#333;"><strong style="color:${BR}">${esc(a.judul)}</strong>${a.tahun ? ` <span style="color:#777;font-size:10.5px;">(${esc(a.tahun)})</span>` : ""}</li>`,
			)
			.join("");
            
		const orgLis8 = (cvData.organisasis || [])
			.map((o) => {
				const bullets = (o.deskripsi || "")
					.split("\n")
					.filter((l) => l.trim())
					.map((l) => `<li style="margin-bottom:3px;">${esc(l.replace(/^•\s*/, ""))}</li>`)
					.join("");
				return `
                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <strong style="font-size:13.5px;color:${BR};">${esc(o.instansi) || "Nama Instansi"}</strong>
                            <span style="font-size:10.5px;color:${ACCENT};font-weight:600;">${esc(o.tanggal)}</span>
                        </div>
                        <div style="font-size:12px;color:#666;font-style:italic;margin:2px 0 6px;">${esc(o.posisi) || "Jabatan"}</div>
                        ${bullets ? `<ul style="list-style:disc;list-style-position:outside;padding-left:14px;margin:0;font-size:11.5px;color:#444;line-height:1.6;">${bullets}</ul>` : ""}
                    </div>`;
			})
			.join("");
            
		const expLis8 = (cvData.experiences || [])
			.map((e) => {
				const bullets = (e.desc || "")
					.split("\n")
					.filter((l) => l.trim())
					.map((l) => `<li style="margin-bottom:3px;">${esc(l.replace(/^•\s*/, ""))}</li>`)
					.join("");
				return `
                    <div style="margin-bottom:18px;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <strong style="font-size:14px;color:${BR};">${esc(e.company) || "Nama Perusahaan"}</strong>
                            <span style="font-size:10.5px;color:${ACCENT};font-weight:600;letter-spacing:0.5px;">${esc(e.period)}</span>
                        </div>
                        <div style="font-size:12px;color:#555;font-weight:500;margin:3px 0 6px;">${esc(e.role) || "Jabatan"}</div>
                        ${bullets ? `<ul style="list-style:disc;list-style-position:outside;padding-left:14px;margin:0;font-size:11.5px;color:#444;line-height:1.6;">${bullets}</ul>` : ""}
                    </div>`;
			})
			.join("");
            
		const banner8 = (label: string) =>
			`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
                <div style="font-size:14px;font-weight:700;color:${BR};text-transform:uppercase;letter-spacing:1.5px;">${label}</div>
                <div style="flex:1;height:1px;background:${ACCENT};opacity:0.4;"></div>
            </div>`;
            
        const sideBanner8 = (label: string) =>
            `<div style="font-size:13px;font-weight:700;color:${BR};text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;border-bottom:1px solid rgba(74,51,38,.15);padding-bottom:6px;">${label}</div>`;

		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:white;overflow:hidden;font-family: 'Inter', sans-serif;">
            <div style="display:flex;flex-direction:column;height:100%;">
                <header style="background:${BR};padding:40px 48px;position:relative;z-index:10;display:flex;align-items:center;gap:32px;">
                    ${
                        cvData.photo
                        ? `<img src="${cvData.photo}" style="width:110px;height:110px;border-radius:50%;object-fit:cover;border:3px solid ${SK};box-shadow:0 4px 15px rgba(0,0,0,0.2);flex-shrink:0;" />`
                        : ""
                    }
                    <div style="flex:1;">
                        <div style="color:white;font-weight:800;font-size:36px;line-height:1.2;letter-spacing:-0.5px;">${name}</div>
                        <div style="color:${SK};font-size:14px;letter-spacing:3px;text-transform:uppercase;margin-top:8px;font-weight:500;">${title}</div>
                    </div>
                </header>
                
                <div style="display:flex;flex:1;min-height:0;">
                    <aside style="width:32%;background:${SK};padding:32px 24px;display:flex;flex-direction:column;gap:24px;">
                        <div>
                            ${sideBanner8("Kontak")}
                            <ul style="list-style:none;padding:0;margin:0;font-size:11.5px;color:#444;">
                                <li style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
                                    <i class="fa-solid fa-phone" style="width:14px;color:${ACCENT};margin-top:3px;"></i>
                                    <span style="word-break:break-all;line-height:1.4;">${phone || "-"}</span>
                                </li>
                                <li style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
                                    <i class="fa-solid fa-envelope" style="width:14px;color:${ACCENT};margin-top:3px;"></i>
                                    <span style="word-break:break-all;line-height:1.4;">${email || "-"}</span>
                                </li>
                                <li style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
                                    <i class="fa-solid fa-location-dot" style="width:14px;color:${ACCENT};margin-top:3px;"></i>
                                    <span style="line-height:1.4;">${address || "-"}</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            ${sideBanner8("Kemampuan")}
                            <ul style="list-style:none;padding:0;margin:0;">${skillLis8}</ul>
                        </div>
                        
                        <div>
                            ${sideBanner8("Pendidikan")}
                            ${pendidikanLis8}
                        </div>
                    </aside>
                    
                    <section style="flex:1;background:white;padding:36px 40px;overflow-y:auto;">
                        <div style="margin-bottom:28px;">
                            ${banner8("Profil")}
                            <p style="font-size:12px;color:#444;line-height:1.7;text-align:justify;white-space:pre-line;margin:0;">${about}</p>
                        </div>
                        
                        <div style="margin-bottom:28px;">
                            ${banner8("Pengalaman Kerja")}
                            ${expLis8}
                        </div>
                        
                        ${(cvData.organisasis || []).length ? `<div style="margin-bottom:28px;">${banner8("Organisasi")}${orgLis8}</div>` : ""}
                        
                        ${(cvData.penghargaans || []).length ? `<div>${banner8("Sertifikat")}<ul style="list-style:disc;list-style-position:inside;padding-left:4px;margin:0;">${sertifikatLis8}</ul></div>` : ""}
                    </section>
                </div>
            </div>
        </div>`;
	}

	// cv09 Fresh Start Entry: Khusus Fresh Graduate Non-Pengalaman (Nama, Kontak, Tentang Saya, Pendidikan, Kemampuan, Hobi)
	if (template === "cv09") {
		const t09 = cvData.themeColor || "#2563EB";
		const rawHobbies = (cvData.hobi && cvData.hobi.trim())
			? cvData.hobi
			: "Membaca Buku, Desain Grafis, Menulis Artikel, Fotografi";
		const hobbies = rawHobbies
			.split(/[,;\n]+/)
			.map((h) => h.trim())
			.filter(Boolean);

		const hobbyIcons = [
			"fa-book-open",
			"fa-palette",
			"fa-pen-nib",
			"fa-camera",
			"fa-person-running",
			"fa-laptop-code",
			"fa-headphones",
			"fa-mug-hot",
		];

		const hobbiesHtml = hobbies
			.map((h, i) => {
				const icon = hobbyIcons[i % hobbyIcons.length];
				return `
                <div style="display:flex;align-items:center;gap:12px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;padding:10px 14px;margin-bottom:9px;box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                    <div style="width:28px;height:28px;border-radius:8px;background:${t09}15;color:${t09};display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <span style="font-size:12px;font-weight:600;color:#334155;">${esc(h)}</span>
                </div>`;
			})
			.join("");

		const skillsFresh = skills
			.map(
				(s) => `
                <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-left:4px solid ${t09};border-radius:8px;padding:11px 14px;margin-bottom:10px;box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                    <div style="font-weight:700;font-size:12.5px;color:#0F172A;margin-bottom:2px;">${esc(s.title)}</div>
                    ${s.desc ? `<div style="font-size:11.5px;color:#64748B;line-height:1.5;">${esc(s.desc)}</div>` : ""}
                </div>`,
			)
			.join("");

		const eduFresh = (cvData.pendidikans || [])
			.map((pd) => {
				const bullets = (pd.kegiatan || "")
					.split("\n")
					.filter((l) => l.trim())
					.map((l) => `<li style="margin-bottom:4px;">${esc(l.replace(/^•\s*/, ""))}</li>`)
					.join("");
				return `
                <div style="position:relative;padding-left:22px;margin-bottom:22px;border-left:2px solid #E2E8F0;">
                    <div style="position:absolute;left:-6px;top:4px;width:10px;height:10px;border-radius:50%;background:${t09};box-shadow:0 0 0 3px ${t09}25;"></div>
                    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px;">
                        <h4 style="font-weight:800;font-size:15px;color:#0F172A;margin:0;">${esc(pd.institusi) || "-"}</h4>
                        <span style="font-size:11px;font-weight:700;color:${t09};background:${t09}12;padding:2px 8px;border-radius:6px;">${esc(pd.tahun)}</span>
                    </div>
                    <div style="font-weight:600;font-size:13px;color:#334155;margin-bottom:6px;">${esc(pd.jurusan) || "-"}</div>
                    ${bullets ? `<ul style="list-style:disc;padding-left:16px;margin:6px 0 0;font-size:12px;color:#64748B;line-height:1.65;">${bullets}</ul>` : ""}
                </div>`;
			})
			.join("");

		return `
        <div class="cv-paper" style="width:794px;height:1123px;background:#FFFFFF;overflow:hidden;font-family:'Inter',sans-serif;display:flex;flex-direction:column;">
            <!-- Header Atas -->
            <div style="border-top:6px solid ${t09};padding:40px 48px 28px;background:linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%);border-bottom:1px solid #E2E8F0;">
                <div style="display:flex;align-items:center;gap:32px;">
                    ${
                        cvData.photo
                            ? `<img src="${cvData.photo}" style="width:115px;height:115px;border-radius:${getRadius('16px')};object-fit:cover;border:3px solid #FFFFFF;box-shadow:0 6px 18px rgba(0,0,0,0.08);flex-shrink:0;" />`
                            : ""
                    }
                    <div style="flex:1;">
                        <h1 style="font-size:36px;font-weight:900;color:#0F172A;letter-spacing:-0.5px;margin:0 0 4px;line-height:1.15;">${name}</h1>
                        <div style="font-size:14px;font-weight:700;color:${t09};letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">${title}</div>
                        <!-- Kontak Pill Badges -->
                        <div style="display:flex;flex-wrap:wrap;gap:10px;font-size:11.5px;color:#475569;">
                            <div style="display:flex;align-items:center;gap:7px;background:#FFFFFF;border:1px solid #E2E8F0;padding:5px 12px;border-radius:20px;box-shadow:0 1px 2px rgba(0,0,0,0.03);">
                                <i class="fa-brands fa-whatsapp" style="color:#22C55E;font-size:13px;"></i>
                                <span style="font-weight:500;">${phone || "-"}</span>
                            </div>
                            <div style="display:flex;align-items:center;gap:7px;background:#FFFFFF;border:1px solid #E2E8F0;padding:5px 12px;border-radius:20px;box-shadow:0 1px 2px rgba(0,0,0,0.03);">
                                <i class="fa-solid fa-envelope" style="color:${t09};font-size:12px;"></i>
                                <span style="font-weight:500;">${email || "-"}</span>
                            </div>
                            <div style="display:flex;align-items:center;gap:7px;background:#FFFFFF;border:1px solid #E2E8F0;padding:5px 12px;border-radius:20px;box-shadow:0 1px 2px rgba(0,0,0,0.03);">
                                <i class="fa-solid fa-location-dot" style="color:#EF4444;font-size:12px;"></i>
                                <span style="font-weight:500;">${address || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Body 2-Kolom Seimbang -->
            <div style="display:flex;flex:1;min-height:0;">
                <!-- Kolom Kiri: Kemampuan & Hobi -->
                <aside style="width:36%;background:#F8FAFC;border-right:1px solid #E2E8F0;padding:32px 28px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <!-- Section: Kemampuan -->
                        <div style="margin-bottom:28px;">
                            <div style="display:flex;align-items:center;gap:9px;margin-bottom:14px;">
                                <div style="width:28px;height:28px;border-radius:7px;background:${t09};color:white;display:flex;align-items:center;justify-content:center;font-size:12px;">
                                    <i class="fa-solid fa-bolt"></i>
                                </div>
                                <h3 style="font-size:14px;font-weight:800;color:#0F172A;text-transform:uppercase;letter-spacing:0.8px;margin:0;">Kemampuan</h3>
                            </div>
                            <div>${skillsFresh}</div>
                        </div>

                        <!-- Section: Hobi & Minat -->
                        <div>
                            <div style="display:flex;align-items:center;gap:9px;margin-bottom:14px;">
                                <div style="width:28px;height:28px;border-radius:7px;background:${t09};color:white;display:flex;align-items:center;justify-content:center;font-size:12px;">
                                    <i class="fa-solid fa-heart"></i>
                                </div>
                                <h3 style="font-size:14px;font-weight:800;color:#0F172A;text-transform:uppercase;letter-spacing:0.8px;margin:0;">Hobi & Minat</h3>
                            </div>
                            <div>${hobbiesHtml}</div>
                        </div>
                    </div>

                    <!-- Footer Note Kiri -->
                    <div style="padding:14px;border-radius:10px;background:#FFFFFF;border:1px solid #E2E8F0;font-size:11px;color:#64748B;line-height:1.5;">
                        <span style="font-weight:700;color:#0F172A;">Siap Berkembang:</span> Memiliki kemauan tinggi untuk belajar hal baru, beradaptasi cepat, dan bekerja sama dalam tim.
                    </div>
                </aside>

                <!-- Kolom Kanan: Tentang Saya & Riwayat Pendidikan -->
                <main style="flex:1;padding:34px 38px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <!-- Section: Tentang Saya -->
                        <div style="margin-bottom:30px;">
                            <div style="display:flex;align-items:center;gap:9px;margin-bottom:14px;">
                                <div style="width:28px;height:28px;border-radius:7px;background:${t09};color:white;display:flex;align-items:center;justify-content:center;font-size:12px;">
                                    <i class="fa-solid fa-user"></i>
                                </div>
                                <h3 style="font-size:14px;font-weight:800;color:#0F172A;text-transform:uppercase;letter-spacing:0.8px;margin:0;">Tentang Saya</h3>
                            </div>
                            <div style="background:#F8FAFC;border-left:4px solid ${t09};border-radius:0 10px 10px 0;padding:16px 20px;">
                                <p style="font-size:12.5px;color:#334155;line-height:1.75;text-align:justify;margin:0;white-space:pre-line;">${about}</p>
                            </div>
                        </div>

                        <!-- Section: Riwayat Pendidikan -->
                        <div>
                            <div style="display:flex;align-items:center;gap:9px;margin-bottom:16px;">
                                <div style="width:28px;height:28px;border-radius:7px;background:${t09};color:white;display:flex;align-items:center;justify-content:center;font-size:12px;">
                                    <i class="fa-solid fa-graduation-cap"></i>
                                </div>
                                <h3 style="font-size:14px;font-weight:800;color:#0F172A;text-transform:uppercase;letter-spacing:0.8px;margin:0;">Riwayat Pendidikan</h3>
                            </div>
                            <div style="margin-top:8px;">${eduFresh}</div>
                        </div>
                    </div>

                    <!-- Highlight Komitmen Karir -->
                    <div style="background:linear-gradient(135deg, ${t09}10 0%, #FFFFFF 100%);border:1.5px dashed ${t09}50;border-radius:12px;padding:16px 20px;">
                        <div style="font-weight:800;font-size:12.5px;color:${t09};margin-bottom:4px;display:flex;align-items:center;gap:7px;">
                            <i class="fa-solid fa-circle-check"></i>
                            Tujuan & Minat Karir
                        </div>
                        <p style="font-size:11.5px;color:#475569;margin:0;line-height:1.6;">
                            Berkomitmen mendedikasikan kemampuan akademik dan keahlian untuk memberikan kontribusi positif secara profesional bagi kemajuan perusahaan.
                        </p>
                    </div>
                </main>
            </div>
        </div>`;
	}

	// cv01 Salva Jan Ferdino Pangaribuan Layout
	const headerBg01 = cvData.themeColor || "#EAEAEA";

	// Parse Skills into Pribadi and Profesional lists
	const rawSkillLines = (skillsText || "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);

	let pribadiSkills: string[] = [];
	let profesionalSkills: string[] = [];
	let currentCat: "pribadi" | "profesional" = "pribadi";

	for (const line of rawSkillLines) {
		if (line.toLowerCase().startsWith("pribadi")) {
			currentCat = "pribadi";
			const rest = line.replace(/^pribadi[:\-]?\s*/i, "").trim();
			if (rest) pribadiSkills.push(rest.replace(/^[•\-\*]\s*/, ""));
		} else if (line.toLowerCase().startsWith("profesional")) {
			currentCat = "profesional";
			const rest = line.replace(/^profesional[:\-]?\s*/i, "").trim();
			if (rest) profesionalSkills.push(rest.replace(/^[•\-\*]\s*/, ""));
		} else {
			const clean = line.replace(/^[•\-\*]\s*/, "").trim();
			if (clean) {
				if (currentCat === "pribadi") {
					pribadiSkills.push(clean);
				} else {
					profesionalSkills.push(clean);
				}
			}
		}
	}

	if (pribadiSkills.length > 0 && profesionalSkills.length === 0) {
		const half = Math.ceil(pribadiSkills.length / 2);
		profesionalSkills = pribadiSkills.slice(half);
		pribadiSkills = pribadiSkills.slice(0, half);
	}

	const sectionBar01 = (title: string, customWidth?: string) => `
        <div style="background:${headerBg01};padding:5px 12px;margin-bottom:10px;${customWidth ? `width:${customWidth};` : "width:100%;"}box-sizing:border-box;">
            <span style="font-weight:700;font-size:12.5px;color:#111111;text-transform:uppercase;letter-spacing:1px;">${title}</span>
        </div>`;

	const expLis01 = (cvData.experiences || [])
		.map(
			(e) => `
        <div style="display:flex;gap:24px;margin-bottom:12px;font-size:11px;">
            <div style="width:170px;flex-shrink:0;">
                <div style="font-weight:700;color:#111111;line-height:1.2;">${esc(e.company)}</div>
                <div style="color:#555555;font-size:10.5px;margin-top:2px;">${esc(e.period)}</div>
            </div>
            <div style="flex:1;">
                <div style="font-weight:700;color:#111111;line-height:1.2;">${esc(e.role)}</div>
                <div style="color:#333333;font-size:10.5px;line-height:1.5;text-align:justify;margin-top:3px;">${esc(e.desc)}</div>
            </div>
        </div>`,
		)
		.join("");

	const orgLis01 = (cvData.organisasis || [])
		.map(
			(o) => `
        <div style="display:flex;gap:24px;margin-bottom:10px;font-size:11px;">
            <div style="width:170px;flex-shrink:0;">
                <div style="font-weight:700;color:#111111;line-height:1.2;">${esc(o.instansi)}</div>
                <div style="color:#555555;font-size:10.5px;margin-top:2px;">${esc(o.tanggal)}</div>
            </div>
            <div style="flex:1;">
                <div style="font-weight:700;color:#111111;line-height:1.2;">${esc(o.posisi)}</div>
                <div style="color:#333333;font-size:10.5px;line-height:1.5;text-align:justify;margin-top:3px;">${esc(o.deskripsi)}</div>
            </div>
        </div>`,
		)
		.join("");

	const eduLis01 = (cvData.pendidikans || [])
		.map(
			(pd) => `
        <div style="display:flex;gap:24px;margin-bottom:10px;font-size:11px;">
            <div style="width:170px;flex-shrink:0;">
                <div style="font-weight:700;color:#111111;line-height:1.2;">${esc(pd.institusi)}</div>
                <div style="color:#555555;font-size:10.5px;margin-top:2px;">${esc(pd.tahun)}</div>
            </div>
            <div style="flex:1;">
                <div style="font-weight:700;color:#111111;line-height:1.2;">${esc(pd.jurusan)}</div>
                <div style="color:#333333;font-size:10.5px;line-height:1.5;text-align:justify;margin-top:3px;">${esc(pd.kegiatan || "")}</div>
            </div>
        </div>`,
		)
		.join("");

	return `
        <div class="cv-paper" style="width:794px;height:1123px;background:#FFFFFF;color:#222222;font-family:'Inter',sans-serif;position:relative;overflow:hidden;box-sizing:border-box;padding:42px 48px 36px;display:flex;flex-direction:column;justify-content:flex-start;">
            <!-- HEADER -->
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;">
                <div style="max-width:440px;">
                    <h1 style="font-weight:900;font-size:26px;color:#111111;letter-spacing:1.5px;line-height:1.15;margin:0;text-transform:uppercase;">
                        ${name ? esc(name) : "MUHAMMAD FAHRUL<br/>BAHRI"}
                    </h1>
                </div>
                <div style="font-size:11.5px;color:#333333;line-height:1.6;display:flex;flex-direction:column;gap:1px;">
                    ${phone ? `<div>&bull; ${esc(phone)}</div>` : ""}
                    ${email ? `<div>&bull; ${esc(email)}</div>` : ""}
                    ${address ? `<div>&bull; ${esc(address)}</div>` : ""}
                </div>
            </div>

            <!-- TENTANG SAYA -->
            <div style="margin-bottom:18px;">
                ${sectionBar01("TENTANG SAYA")}
                <p style="font-size:10.5px;color:#333333;line-height:1.55;text-align:justify;margin:0;padding:0 2px;">${about}</p>
            </div>

            <!-- PENGALAMAN KERJA -->
            ${(cvData.experiences || []).length ? `
            <div style="margin-bottom:18px;">
                ${sectionBar01("PENGALAMAN KERJA")}
                ${expLis01}
            </div>` : ""}

            <!-- PENGALAMAN ORGANISASI -->
            ${(cvData.organisasis || []).length ? `
            <div style="margin-bottom:18px;">
                ${sectionBar01("PENGALAMAN ORGANISASI")}
                ${orgLis01}
            </div>` : ""}

            <!-- PENDIDIKAN -->
            ${(cvData.pendidikans || []).length ? `
            <div style="margin-bottom:18px;">
                ${sectionBar01("PENDIDIKAN")}
                ${eduLis01}
            </div>` : ""}

            <!-- KEAHLIAN -->
            <div>
                <div style="display:flex;gap:24px;align-items:flex-start;">
                    <div style="width:170px;flex-shrink:0;">
                        ${sectionBar01("KEAHLIAN", "170px")}
                    </div>
                    <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:24px;font-size:10.5px;color:#333333;padding-top:4px;">
                        <div>
                            <div style="font-weight:700;color:#111111;margin-bottom:6px;font-size:11px;">Pribadi</div>
                            <ul style="list-style:disc;padding-left:14px;margin:0;line-height:1.45;">
                                ${pribadiSkills.map((s) => `<li style="margin-bottom:4px;">${esc(s)}</li>`).join("")}
                            </ul>
                        </div>
                        <div>
                            <div style="font-weight:700;color:#111111;margin-bottom:6px;font-size:11px;">Profesional</div>
                            <ul style="list-style:disc;padding-left:14px;margin:0;line-height:1.45;">
                                ${profesionalSkills.map((s) => `<li style="margin-bottom:4px;">${esc(s)}</li>`).join("")}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
};
