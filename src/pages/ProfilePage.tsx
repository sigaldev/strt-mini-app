import { useState, useEffect } from "react";
import Header from "../components/profile/Header";
import ProfileCard from "../components/profile/ProfileCard";
import ScheduleBanner from "../components/profile/ScheduleBanner";
import AchievementsSlider from "../components/profile/AchievementsSlider";
import NotificationsModal from "../components/profile/NotificationsModal";
import BurgerOverlay from "../components/profile/BurgerOverlay";
import BannersSlider from "../components/profile/BannerSlider.tsx";
import CareerBanner from "../components/profile/banner/CareerBanner.tsx";
import ScholarshipBanner from "../components/profile/banner/ScholarshipBanner.tsx";
import OpportunitiesBanner from "../components/profile/banner/OpportunitiesBanner.tsx";
import { ProfileService, type Profile } from "../components/api/service/ProfileService.ts";
import Loader from "../components/Loader.tsx";

const ProfilePage = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showBurgerMenu, setShowBurgerMenu] = useState(false);
    const [profileData, setProfileData] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const banners = [
        <CareerBanner key="career" />,
        <ScholarshipBanner key="scholarship" />,
        <OpportunitiesBanner key="opportunities" />,
    ];

    const handleLogout = () => {
        console.log("[PROFILE PAGE] Logout clicked, closing burger menu");
        setShowBurgerMenu(false);
    };

    const getInitials = () => {
        if (!profileData) return "";
        const first = profileData.first_name?.[0] || "";
        const last = profileData.last_name?.[0] || "";
        const initials = `${first}${last}`;
        console.log(`[PROFILE PAGE] Computed initials: ${initials}`);
        return initials;
    };

    // Управление overflow при модальных окнах
    useEffect(() => {
        document.body.style.overflow = showNotifications || showBurgerMenu ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [showNotifications, showBurgerMenu]);

    // Fetch profile с ожиданием токена
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await ProfileService.getProfile();
                setProfileData(profile);
            } catch (error) {
                console.error("[PROFILE PAGE] Failed to load profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);


    if (loading || !profileData) {
        console.log("[PROFILE PAGE] Loading profile, showing loader");
        return <Loader />;
    }

    console.log("[PROFILE PAGE] Rendering ProfilePage");

    return (
        <div className="min-h-screen bg-[#181818] p-4 md:p-6">
            <Header
                setShowNotifications={setShowNotifications}
                setShowBurgerMenu={setShowBurgerMenu}
            />
            <ProfileCard profileData={profileData} getInitials={getInitials} />
            <BannersSlider banners={banners} />
            <ScheduleBanner />
            <AchievementsSlider achievements={Array.isArray(profileData.achievements) ? profileData.achievements : []} />
            <NotificationsModal
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
            />
            <BurgerOverlay
                showBurgerMenu={showBurgerMenu}
                setShowBurgerMenu={setShowBurgerMenu}
                getInitials={getInitials}
                profileData={profileData}
                handleLogout={handleLogout}
            />
        </div>
    );
};

export default ProfilePage;
