import { Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import ProfilePage from "../pages/ProfilePage.tsx";
import SchedulePage from "../pages/SchedulePage.tsx";
import EventsPage from "../pages/EventsPage.tsx";
import DiscountsPage from "../pages/DiscountsPage.tsx";
import DiscountDetailPage from "../pages/DiscountDetailPage.tsx";
import JobsPage from "../pages/JobsPage.tsx";
import EventDetailPage from "../pages/EventDetailPage.tsx";
import RatingPage from "../pages/RatingPage.tsx";
import UserProfilePage from "../pages/UserProfilePage.tsx";
import ConnectsPage from "../pages/ConnectsPage.tsx";
import ForumsPage from "../pages/ForumsPage.tsx";
import ScholarshipPage from "../pages/ScholarshipPage.tsx";

export const ROUTES = {
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile",
    SCHEDULE: "/schedule",
    EVENTS: "/events",
    EVENT_DETAIL: "/events/:id",
    DISCOUNTS: "/discounts",
    DISCOUNT_DETAIL: "/discounts/:id",
    JOBS: "/jobs",
    RATING: "/rating",
    USERPROFILE: "/user/:id",
    USER_CONNECT: "/user/connects/:id",
    FORUM: "/forum",
    SCHOLARSHIP: "/scholarship"
};

export const routesConfig = [
        { path: ROUTES.LOGIN, element: LoginPage },
        { path: ROUTES.REGISTER, element: RegisterPage },

        {
            path: "/",
            layout: true,
            children: [
                { path: "", element: () => <Navigate to={ROUTES.PROFILE} replace /> },
                { path: ROUTES.PROFILE, element: ProfilePage },
                { path: ROUTES.SCHEDULE, element: SchedulePage },
                { path: ROUTES.EVENTS, element: EventsPage },
                { path: ROUTES.EVENT_DETAIL, element: EventDetailPage },
                { path: ROUTES.DISCOUNTS, element: DiscountsPage },
                { path: ROUTES.DISCOUNT_DETAIL, element: DiscountDetailPage },
                { path: ROUTES.JOBS, element: JobsPage },
                { path: ROUTES.RATING, element: RatingPage },
                { path: ROUTES.USERPROFILE, element: UserProfilePage },
                { path: ROUTES.USER_CONNECT, element: ConnectsPage },
                { path: ROUTES.FORUM, element: ForumsPage },
                { path: ROUTES.SCHOLARSHIP, element: ScholarshipPage },
            ],
        },

        { path: "*", element: () => <Navigate to={ROUTES.LOGIN} replace /> },
];
