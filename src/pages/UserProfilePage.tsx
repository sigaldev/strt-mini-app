import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, UserPlus, UserCheck } from "lucide-react"
import Loader from "../components/Loader"
import RatingService from "../components/api/service/RatingService.ts"
import AchievementsSlider from "../components/userprofile/AchievementsSlider.tsx"
import ConnectService from "../components/api/service/ConnectService.ts";

const UserProfilePage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [requestSent, setRequestSent] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                console.warn("UserProfilePage: No ID in params");
                return;
            }

            console.log("UserProfilePage: fetching user with ID:", id);
            setLoading(true);

            try {
                const data = await RatingService.getUserById(Number(id));
                console.log("UserProfilePage: user data fetched:", data);
                setUser(data.user);
            } catch (err) {
                console.error("UserProfilePage: error loading user profile:", err);
            } finally {
                setLoading(false);
                console.log("UserProfilePage: loading finished");
            }
        };

        fetchUser();
    }, [id]);

    const getInitials = () => {
        if (!user) return ""
        return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`
    }

    if (loading || !user) return <Loader />

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center mb-6 relative mt-2">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-0 left-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-gray-900 mx-auto font-semibold mt-2">Профиль пользователя</h1>
            </div>

            {/* Profile Card */}
            <div className="rounded-2xl p-6 mb-6">
                <div className="flex flex-col items-center gap-4 mb-6 text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
                        {user.avatar ? (
                            <img
                                src={user.avatar.medium?.url || user.avatar.large?.url || user.avatar.thumb?.url}
                                alt={`${user.full_name} avatar`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="bg-[#007AFF] w-full h-full flex items-center justify-center">
                                {getInitials()}
                            </div>
                        )}
                    </div>
                    <h2 className="text-xl text-gray-900">
                        {user.first_name} {user.last_name}
                    </h2>
                    <div className="flex gap-[5px] justify-center text-gray-500 text-sm">
                        <p className="max-w-[200px] truncate">{user.university?.abbreviation || "–"}</p>
                        <p>|</p>
                        <p className="max-w-[120px] truncate">
                            Группа: {user.group?.name || user.group_number || "–"}
                        </p>
                    </div>
                    {user.bio && (
                        <p className="text-gray-700 text-sm max-w-[300px]">{user.bio}</p>
                    )}
                </div>

                {/* Connect button */}
                {user.in_connect ? (
                    <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        В коннекте
                    </div>
                ) : (requestSent || user.is_connect_sent) ? (
                    <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        Запрос отправлен
                    </div>
                ) : (
                    <button
                        onClick={async () => {
                            try {
                                await ConnectService.sendConnectRequest(id);
                                setRequestSent(true);
                            } catch (err) {
                                alert("Не удалось отправить запрос");
                            }
                        }}
                        className="w-full bg-[#007AFF] hover:bg-[#0066dd] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <UserPlus className="w-5 h-5" />
                        Предложить коннект
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 rounded-2xl overflow-hidden mb-6">
                {/* Коннекты */}
                <div
                    onClick={() => navigate(`/user/connects/${user.id}`)}
                    className="text-center p-3 cursor-pointer hover:bg-gray-100 transition flex flex-col items-center"
                >
                    <div className="text-[18px] font-semibold text-gray-900">{user.connects}</div>
                    <div className="text-xs text-gray-400">Коннекты</div>
                </div>

                {/* Рейтинг */}
                <div
                    onClick={() => navigate("/rating")}
                    className="text-center p-3 cursor-pointer hover:bg-gray-100 transition flex flex-col items-center border-l  border-r border-gray-300 "
                >
                    <div className="text-[18px] font-semibold text-[#007AFF]">{user.rank}</div>
                    <div className="text-xs text-gray-400">Рейтинг</div>
                </div>

                {/* Баллы */}
                <div
                    onClick={() => navigate("/rating")}
                    className="text-center p-3 cursor-pointer hover:bg-gray-100 transition flex flex-col items-center"
                >
                    <div className="text-[18px] font-semibold text-gray-900">{user.score}</div>
                    <div className="text-xs text-gray-400">Баллы</div>
                </div>
            </div>



            {/* Achievements */}
            <AchievementsSlider achievements={user.achievements} />
        </div>
    )
}

export default UserProfilePage
