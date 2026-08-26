import { Component, type ErrorInfo, type ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "800px", margin: "40px auto", background: "#fff", borderRadius: "12px", border: "2px solid #ef4444", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
					<h1 style={{ color: "#ef4444", fontSize: "24px", marginBottom: "16px" }}>⚠️ Terjadi Kesalahan Tampilan (React Error)</h1>
					<pre style={{ background: "#fef2f2", color: "#991b1b", padding: "16px", borderRadius: "8px", overflow: "auto", fontSize: "14px", lineHeight: "1.5" }}>
						{this.state.error?.message}
						{"\n\n"}
						{this.state.error?.stack}
					</pre>
					<button
						onClick={() => { localStorage.clear(); window.location.reload(); }}
						style={{ marginTop: "20px", background: "#ef4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
					>
						Reset Data Draft Cache & Muat Ulang
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Elemen #root tidak ditemukan");

createRoot(rootEl).render(
	<StrictMode>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	</StrictMode>,
);

