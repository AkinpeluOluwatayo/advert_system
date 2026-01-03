import React from "react";
import { RefreshCcw, AlertTriangle } from "lucide-react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {

        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-red-100 dark:border-red-900/20 max-w-sm">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Connection Lost</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                            We couldn't load this part of the app. This usually happens due to a slow internet connection.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <RefreshCcw size={18} /> Retry Connection
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;