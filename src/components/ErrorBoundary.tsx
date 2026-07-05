import { Component, type ErrorInfo, type ReactNode } from "react";
import { Home, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {
        hasError: false,
    };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (import.meta.env.DEV) {
            console.error("Unhandled render error", {
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
            });
        }
    }

    private reset = () => {
        this.setState({ hasError: false });
    };

    private reload = () => {
        window.location.reload();
    };

    private goHome = () => {
        this.reset();
        window.history.pushState(null, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <main className="min-h-screen bg-[#f7f7f8] px-5 py-8 flex items-center justify-center">
                <section className="w-full max-w-sm rounded-[8px] border border-[#e4e4e7] bg-white p-5 shadow-sm">
                    <div className="mb-5">
                        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#71717a]">
                            Ошибка приложения
                        </p>
                        <h1 className="mt-2 text-[22px] font-semibold leading-tight text-[#18181b]">
                            Что-то пошло не так
                        </h1>
                        <p className="mt-3 text-[14px] leading-5 text-[#52525b]">
                            Экран не смог загрузиться. Попробуйте обновить страницу или вернуться на главную.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={this.reload}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#18181b] px-4 text-[14px] font-medium text-white"
                        >
                            <RotateCcw size={18} aria-hidden="true" />
                            Обновить
                        </button>
                        <button
                            type="button"
                            onClick={this.goHome}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#d4d4d8] bg-white px-4 text-[14px] font-medium text-[#18181b]"
                        >
                            <Home size={18} aria-hidden="true" />
                            На главную
                        </button>
                    </div>
                </section>
            </main>
        );
    }
}

export default ErrorBoundary;
