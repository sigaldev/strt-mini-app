import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routesConfig } from "./routesConfig.tsx";
import Layout from "../components/Layout.tsx";
import ScrollToTop from "../components/ScrollToTop.tsx";

const AppRouter = () => {
    const renderRoutes = (config: typeof routesConfig) =>
        config.map((route, idx) => {
            if (route.layout && route.children) {
                return (
                    <Route path={route.path} element={<Layout />} key={idx}>
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
        <Router>
            <ScrollToTop />
            <Routes>{renderRoutes(routesConfig)}</Routes>
        </Router>
    );
};

export default AppRouter;
