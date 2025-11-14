import type { Profile } from "../api/service/ProfileService.ts";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
    profileData: Profile;
    getInitials: () => string;
}

const ProfileCard = ({ profileData, getInitials }: ProfileCardProps) => {
    const navigate = useNavigate();

    // Функция для выбора лучшего доступного аватара
    const getAvatarUrl = () => {
        if (!profileData.avatar) return null;

        return profileData.avatar.medium?.url
            || profileData.avatar.large?.url
            || profileData.avatar.thumb?.url
            || null;
    };

    const avatarUrl = getAvatarUrl();

    return (
        <div className="rounded-2xl p-6 mb-6">
            <div className="flex flex-col items-center gap-4 mb-6 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={`${profileData.full_name} avatar`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="bg-[#007AFF] w-full h-full flex items-center justify-center">
                            {getInitials()}
                        </div>

                    )}
                </div>
                <h2 className="text-xl text-gray-900">{profileData.first_name} {profileData.last_name}</h2>
                <div className="flex gap-[5px] justify-center text-gray-500 text-sm">
                    <p>{profileData.university?.abbreviation || "–"}</p>
                    <p>|</p>
                    <p>Группа: {profileData.group?.name || profileData.group_number || "–"}</p>
                </div>
            </div>

            <div className="grid grid-cols-3">
                {/* Коннекты */}
                <div
                    onClick={() => navigate(`/user/connects/${profileData.id}`)}
                    className="text-center p-3 rounded-lg">
                    <div className="text-[18px] text-gray-900">{profileData.connects}</div>
                    <div className="text-xs text-gray-400">Коннекты</div>
                </div>

                {/* Рейтинг */}
                <div
                    onClick={() => navigate("/rating")}
                    className="text-center p-3 border-l border-gray-300 cursor-pointer active:scale-[0.97] transition"
                >
                    <div className="text-[18px] text-[#007AFF]">{profileData.rank}</div>
                    <div className="text-xs text-gray-400">Рейтинг</div>
                </div>

                {/* Баллы */}
                <div
                    onClick={() => navigate("/rating")}
                    className="text-center p-3 border-l border-gray-300">
                    <div className="text-[18px] text-gray-900">{profileData.score || 0}</div>
                    <div className="text-xs text-gray-400">Баллы</div>
                </div>
            </div>
        </div>
    );
};


export default ProfileCard;
