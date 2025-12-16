import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to an error reporting service (e.g., Sentry)
        console.error("Uncaught Error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        // Opsiyonel: Sayfayı yenilemek için
        // window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                    <div className="max-w-md w-full bg-gray-800 border border-red-500/30 rounded-xl shadow-2xl p-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Beklenmedik Bir Hata Oluştu</h1>
                        <p className="text-gray-400 text-sm mb-6">
                            Sistem kritik bir hata ile karşılaştı. Teknik ekip bilgilendirildi.
                        </p>

                        {import.meta.env.DEV && (
                            <div className="text-left bg-black/50 p-3 rounded-lg text-xs font-mono text-red-300 mb-6 overflow-auto max-h-32">
                                {this.state.error && this.state.error.toString()}
                            </div>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-indigo-500/20"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Sistemi Yeniden Başlat</span>
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
