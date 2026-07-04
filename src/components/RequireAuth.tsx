import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasRefreshToken } from "./api/service/AuthService";

interface RequireAuthProps {
    children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
    const location = useLocation();

    if (!hasRefreshToken()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

export default RequireAuth;
