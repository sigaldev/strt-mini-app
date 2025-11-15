import { useState, useEffect } from "react";
import Header from "../components/profile/Header";
import ProfileCard from "../components/profile/ProfileCard";
import ScheduleBanner from "../components/profile/ScheduleBanner";
import AchievementsSlider from "../components/profile/AchievementsSlider";
import NotificationsModal from "../components/profile/NotificationsModal";
import BurgerOverlay from "../components/profile/BurgerOverlay";
import BannersSlider from "../components/profile/BannerSlider.tsx";
import DiscountsBanner from "../components/profile/banner/DiscountsBanner.tsx";
import ScholarshipBanner from "../components/profile/banner/ScholarshipBanner.tsx";
import ForumsBanner from "../components/profile/banner/ForumsBanner.tsx";
import { ProfileService, type Profile } from "../components/api/service/ProfileService.ts";
import ConnectService from "../components/api/service/ConnectService";
import Loader from "../components/Loader.tsx";

const ProfilePage = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showBurgerMenu, setShowBurgerMenu] = useState(false);
    const [profileData, setProfileData] = useState<Profile | null>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const banners = [
        <DiscountsBanner key="career" />,
        <ScholarshipBanner key="scholarship" />,
        <ForumsBanner key="opportunities" />,
    ];

    const getInitials = () => {
        if (!profileData) return "";
        return `${profileData.first_name?.[0] || ""}${profileData.last_name?.[0] || ""}`;
    };

    useEffect(() => {
        console.log("Show Notifications:", showNotifications, "Show Burger Menu:", showBurgerMenu);
        document.body.style.overflow = showNotifications || showBurgerMenu ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [showNotifications, showBurgerMenu]);

    const handleAcceptRequest = async (id: number) => {
        try {
            await ConnectService.acceptConnectRequest(id)
            setRequests(prev => prev.filter(r => r.connect_request_id !== id))
            setProfileData(prev => prev ? { ...prev, connects: (prev.connects || 0) + 1 } : prev)
        } catch (err) {
            console.error("Accept error:", err)
            alert("Не удалось принять запрос")
        }
    }

    const handleRejectRequest = async (id: number) => {
        try {
            await ConnectService.rejectConnectRequest(id)
            setRequests(prev => prev.filter(r => r.connect_request_id !== id))
        } catch (err) {
            console.error("Reject error:", err)
            alert("Не удалось отклонить запрос")
        }
    }


    useEffect(() => {
        const fetchProfile = async () => {
            console.log("Fetching profile...");
            try {
                const profile = await ProfileService.getProfile();
                console.log("Profile fetched:", profile);
                setProfileData(profile);
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setLoading(false);
                console.log("Profile loading finished");
            }
        };
        fetchProfile();
    }, []);

    // Загрузка connect-запросов
    useEffect(() => {
        const fetchRequests = async () => {
            console.log("Fetching connect requests...");
            try {
                const data = await ConnectService.getConnectRequests();
                console.log("Connect requests fetched:", data);
                setRequests(data);
            } catch (err) {
                console.error("Failed to load connect requests:", err);
            }
        };

        fetchRequests();
    }, []);

    if (loading || !profileData) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-1 xs:p-4 md:p-6 overflow-hidden">
            <Header
                setShowNotifications={setShowNotifications}
                setShowBurgerMenu={setShowBurgerMenu}
                requests={requests}
            />
            <ProfileCard profileData={profileData} getInitials={getInitials} />
            <BannersSlider banners={banners} />
            <ScheduleBanner />
            <AchievementsSlider achievements={Array.isArray(profileData.achievements) ? profileData.achievements : []} />
            <NotificationsModal
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                requests={requests}
                setRequests={setRequests}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
            />
            <BurgerOverlay
                showBurgerMenu={showBurgerMenu}
                setShowBurgerMenu={setShowBurgerMenu}
                getInitials={getInitials}
                profileData={profileData}
            />
        </div>
    );
};

export default ProfilePage;
