import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { routesConfig } from "./routesConfig.tsx";
import Layout from "../components/Layout.tsx";
import ScrollToTop from "../components/ScrollToTop.tsx";
import {setupInterceptors} from "../components/api/setupInterceptors.ts";
import RequireAuth from "../components/RequireAuth.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";

const InnerAppRouter = () => {
    const navigate = useNavigate();

    useEffect(() => {
        return setupInterceptors(navigate);
    }, [navigate]);

    const renderRoutes = (config: typeof routesConfig) =>
        config.map((route, idx) => {
            if (route.layout && route.children) {
                return (
                    <Route path={route.path} element={<RequireAuth><Layout /></RequireAuth>} key={idx}>
                        {route.children.map((child, childIdx) => (
                            <Route
                                key={childIdx}
                                path={child.path}
                                element={typeof child.element === "function" ? <child.element /> : child.element}
                            />
                        ))}
                    </Route>
                );
            }

            return (
                <Route
                    key={idx}
                    path={route.path}
                    element={typeof route.element === "function" ? <route.element /> : route.element}
                />
            );
        });

    return (
        <>
            <ScrollToTop />
            <Routes>{renderRoutes(routesConfig)}</Routes>
        </>
    );
};

const AppRouter = () => (
    <Router>
        <ErrorBoundary>
            <InnerAppRouter />
        </ErrorBoundary>
    </Router>
);

export default AppRouter;
