import { useState, useEffect } from "react";
import Header from "../components/profile/Header";
import ProfileCard from "../components/profile/ProfileCard";
import ScheduleBanner from "../components/profile/ScheduleBanner";
import AchievementsSlider from "../components/profile/AchievementsSlider";
import NotificationsModal from "../components/profile/NotificationsModal";
import BurgerOverlay from "../components/profile/BurgerOverlay";
import BannersSlider from "../components/profile/BannerSlider.tsx";
import CareerBanner from "../components/profile/banner/CareerBanner.tsx";
import PeopleSearchBanner from "../components/profile/banner/PeopleSearchBanner.tsx";
import ScholarshipBanner from "../components/profile/banner/ScholarshipBanner.tsx";
import OpportunitiesBanner from "../components/profile/banner/OpportunitiesBanner.tsx";
import { ProfileService, type Profile } from "../components/api/service/ProfileService.ts";


const ProfilePage = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showBurgerMenu, setShowBurgerMenu] = useState(false);
    const [profileData, setProfileData] = useState<Profile | null>(null);

    const banners = [
        <CareerBanner key="career" />,
        <PeopleSearchBanner key="people" />,
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

    useEffect(() => {
        console.log(`[PROFILE PAGE] Overflow set to: ${showNotifications || showBurgerMenu ? 'hidden' : 'unset'}`);
        document.body.style.overflow = showNotifications || showBurgerMenu ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
            console.log("[PROFILE PAGE] Overflow reset to 'unset'");
        };
    }, [showNotifications, showBurgerMenu]);

    useEffect(() => {
        const fetchProfile = async () => {
            console.log("[PROFILE PAGE] Fetching profile...");
            try {
                const profile = await ProfileService.getProfile();
                setProfileData(profile);
                console.log("[PROFILE PAGE] Profile loaded successfully:", profile);
            } catch (error) {
                console.error("[PROFILE PAGE] Failed to load profile:", error);
            }
        };
        fetchProfile();
    }, []);

    if (!profileData) {
        console.log("[PROFILE PAGE] Profile data not loaded yet, showing loader");
        return <div>Loading...</div>;
    }

    console.log("[PROFILE PAGE] Rendering ProfilePage");

    return (
        <div className="min-h-screen bg-[#181818] p-4 md:p-6">
            <Header
                setShowNotifications={(value) => {
                    console.log(`[PROFILE PAGE] Set showNotifications: ${value}`);
                    setShowNotifications(value);
                }}
                setShowBurgerMenu={(value) => {
                    console.log(`[PROFILE PAGE] Set showBurgerMenu: ${value}`);
                    setShowBurgerMenu(value);
                }}
            />
            <ProfileCard profileData={profileData} getInitials={getInitials} />
            <BannersSlider banners={banners} />
            <ScheduleBanner />
            <AchievementsSlider achievements={Array.isArray(profileData.achievements) ? profileData.achievements : []} />
            <NotificationsModal
                showNotifications={showNotifications}
                setShowNotifications={(value) => {
                    console.log(`[PROFILE PAGE] Notifications modal set: ${value}`);
                    setShowNotifications(value);
                }}
            />
            <BurgerOverlay
                showBurgerMenu={showBurgerMenu}
                setShowBurgerMenu={(value) => {
                    console.log(`[PROFILE PAGE] Burger overlay set: ${value}`);
                    setShowBurgerMenu(value);
                }}
                getInitials={getInitials}
                profileData={profileData}
                handleLogout={handleLogout}
            />
        </div>
    );
};

export default ProfilePage;
