import { buildCvHtml, type CvData, defaultCv } from "./cv";

interface PdfData {
	cv: CvData;
	skills: string;
	template?: string;
}

// html2pdf.js dimuat dari CDN (lihat index.html)
interface Html2PdfChain {
	set: (opts: object) => Html2PdfChain;
	from: (el: Element | null) => Html2PdfChain;
	save: () => Promise<void>;
}

// Render PDF bersih (tanpa watermark) dari data CV via html2pdf.js
export async function downloadPDF(data: PdfData): Promise<void> {
	const host = document.getElementById("pdf-host") as HTMLDivElement;
	host.innerHTML = buildCvHtml(
		data.cv || defaultCv,
		data.skills || "",
		data.template,
	);
	// Tunggu font webfont & Tailwind runtime memproses DOM baru
	await Promise.all([
		document.fonts.ready,
		new Promise((r) => setTimeout(r, 400)),
	]);

	const filename = `CV_${(data.cv.name || "Pro").replace(/\s+/g, "_")}.pdf`;
	const html2pdf = (
		window as unknown as { html2pdf: (opts?: unknown) => Html2PdfChain }
	).html2pdf;
	await html2pdf()
		.set({
			margin: 0,
			filename,
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
			jsPDF: { unit: "px", format: [794, 1123] },
			pagebreak: { mode: ["avoid-all"] },
		})
		.from(host.firstElementChild)
		.save();
	host.innerHTML = "";
}
