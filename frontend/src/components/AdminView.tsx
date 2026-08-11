import { useEffect, useState } from "react";
import { getOrders, loginAdmin } from "../api";
import type { Order } from "../cv";
import { downloadPDF } from "../pdf";

const SESSION_KEY = "aigencv_admin";

export default function AdminView() {
	const [token, setToken] = useState(
		() => sessionStorage.getItem(SESSION_KEY) || "",
	);
	const [pass, setPass] = useState("");
	const [err, setErr] = useState("");
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!token) return;
		setLoading(true);
		getOrders(token)
			.then((res) => {
				if (res.orders) setOrders(res.orders);
			})
			.catch(() => {
				sessionStorage.removeItem(SESSION_KEY);
				setToken("");
				setErr("Sesi berakhir. Silakan login ulang.");
			})
			.finally(() => setLoading(false));
	}, [token]);

	const login = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!pass.trim()) {
			setErr("Masukkan password.");
			return;
		}
		setErr("");
		const res = await loginAdmin(pass);
		if (res.token) {
			sessionStorage.setItem(SESSION_KEY, res.token);
			setToken(res.token);
			setPass("");
		} else {
			setErr(res.error || "Login gagal.");
		}
	};

	const logout = () => {
		sessionStorage.removeItem(SESSION_KEY);
		setToken("");
		setOrders([]);
	};

	if (!token) {
		return (
			<div className="min-h-[70vh] flex items-center justify-center px-4 animate-fade-in">
				<form
					onSubmit={login}
					className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
				>
					<div className="text-center mb-6">
						<div className="w-14 h-14 mx-auto mb-3 bg-primary/10 text-primary rounded-full flex items-center justify-center">
							<i className="fa-solid fa-lock text-xl"></i>
						</div>
						<h2 className="text-xl font-heading font-bold text-gray-900">
							Login Admin
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							Panel khusus admin AIGen CV
						</p>
					</div>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="admin-pass"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Password
							</label>
							<input
								id="admin-pass"
								type="password"
								value={pass}
								onChange={(e) => setPass(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
								placeholder="Password admin"
								autoComplete="current-password"
							/>
						</div>
						{err && (
							<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
								<i className="fa-solid fa-circle-exclamation mr-1"></i>
								{err}
							</p>
						)}
						<button
							type="submit"
							className="w-full bg-primary hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition-colors active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
						>
							<i className="fa-solid fa-right-to-bracket mr-2"></i> Masuk
						</button>
					</div>
				</form>
			</div>
		);
	}

	const handleDownload = async (order: Order) => {
		try {
			await downloadPDF({
				cv: order.cv ?? {
					name: order.name,
					title: "",
					phone: "",
					email: "",
					address: "",
					about: "",
					experiences: [],
				},
				skills: order.skills ?? "",
				template: order.templateId,
			});
		} catch (e) {
			console.error("PDF Error:", e);
			alert(
				"Gagal membuat PDF. Pastikan koneksi internet aktif (html2pdf dimuat dari CDN).",
			);
		}
	};

	return (
		<div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
			<div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
				<div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
					<h2 className="text-white text-xl font-bold">
						<i className="fa-solid fa-user-tie mr-2"></i> Dashboard Admin
					</h2>
					<div className="flex items-center gap-3">
						<span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
							Sistem Aktif
						</span>
						<button
							type="button"
							onClick={logout}
							className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors active:scale-[0.96]"
						>
							<i className="fa-solid fa-sign-out-alt mr-1"></i> Keluar
						</button>
					</div>
				</div>

				<div className="p-6">
					{loading ? (
						<div className="text-center py-12 text-gray-400">
							<i className="fa-solid fa-spinner fa-spin text-2xl mb-3"></i>
							<p className="text-sm">Memuat pesanan...</p>
						</div>
					) : (
						<>
							<p className="text-gray-600 mb-6">
								Berikut adalah daftar pesanan CV yang dibuat oleh pembeli di
								website. Ketika pembeli mentransfer via WhatsApp, Anda bisa
								mengunduh file asli (tanpa watermark) dari sini.
							</p>

							<div className="overflow-x-auto">
								<table className="w-full text-left border-collapse">
									<thead>
										<tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
											<th className="p-4 font-semibold">ID Transaksi</th>
											<th className="p-4 font-semibold">Waktu Pembuatan</th>
											<th className="p-4 font-semibold">Nama Pembeli</th>
											<th className="p-4 font-semibold">Template</th>
											<th className="p-4 font-semibold">Status</th>
											<th className="p-4 font-semibold text-right">
												Aksi Admin
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{orders.map((order) => (
											<tr key={order.id} className="hover:bg-gray-50">
												<td className="p-4 text-sm font-medium text-gray-900">
													#{order.id}
												</td>
												<td className="p-4 text-sm text-gray-500">
													{order.date}
												</td>
												<td className="p-4 text-sm text-gray-800">
													{order.name}
												</td>
												<td className="p-4 text-sm text-gray-500">
													<span className="bg-gray-100 px-2 py-1 rounded border">
														{order.template}
													</span>
												</td>
												<td className="p-4 text-sm">
													<span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-bold border border-yellow-200">
														Menunggu WA
													</span>
												</td>
												<td className="p-4 text-right">
													<button
														type="button"
														onClick={() => handleDownload(order)}
														className="text-primary hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded font-medium text-sm transition-colors active:scale-[0.96]"
													>
														<i className="fa-solid fa-download mr-1"></i> Unduh
														PDF Asli
													</button>
												</td>
											</tr>
										))}
										{orders.length === 0 && (
											<tr>
												<td
													colSpan={6}
													className="p-8 text-center text-gray-400"
												>
													Belum ada pesanan masuk.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
