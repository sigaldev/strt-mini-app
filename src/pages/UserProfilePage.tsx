import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, UserPlus, UserCheck } from "lucide-react"
import Loader from "../components/Loader"

import AchievementsSlider from "../components/userprofile/AchievementsSlider.tsx";

const UserProfilePage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [requestSent, setRequestSent] = useState(false)

    // Mock data — замени на ProfileService.getUserById(id)
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)

            await new Promise(res => setTimeout(res, 500))

            const mock = {
                first_name: "Алексей",
                last_name: "Иванов",
                avatar: "АИ",
                university: { name: "МГУ им. Ломоносова" },
                group: { name: "ПМ-301" },
                connects: 24,
                score: 1180,
                level: { scores_count: 2450 },
                bio: "Студент 3 курса факультета прикладной математики.",
                achievements: [
                    // {
                    //     id: 1,
                    //     icon: notAchiveImg,
                    //     name: "Лучший студент"
                    // }
                ]
            }

            setUser(mock)
            setLoading(false)
        }

        fetchUser()
    }, [id])

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
                <h1 className="text-gray-900 mx-auto font-semibold">Профиль пользователя</h1>
            </div>

            {/* Profile Card */}
            <div className="rounded-2xl p-6 mb-6">
                <div className="flex flex-col items-center gap-4 mb-6 text-center">
                    <div className="w-20 h-20 bg-[#007AFF] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {getInitials()}
                    </div>
                    <h2 className="text-xl text-gray-900">
                        {user.first_name} {user.last_name}
                    </h2>
                    <div className="flex gap-[5px] justify-center text-gray-500 text-sm">
                        <p>{user.university?.name || "–"}</p>
                        <p>|</p>
                        <p>Группа: {user.group?.name || "–"}</p>
                    </div>
                    {user.bio && (
                        <p className="text-gray-700 text-sm max-w-[300px]">{user.bio}</p>
                    )}
                </div>

                {/* Connect button */}
                {!requestSent ? (
                    <button
                        onClick={() => setRequestSent(true)}
                        className="w-full bg-[#007AFF] hover:bg-[#0066dd] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <UserPlus className="w-5 h-5" />
                        Предложить коннект
                    </button>
                ) : (
                    <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        Запрос отправлен
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{user.connects}</div>
                    <div className="text-xs text-gray-600">Коннекты</div>
                </div>

                <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-[#007AFF]">{user.score}</div>
                    <div className="text-xs text-gray-600">Рейтинг</div>
                </div>

                <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{user.level?.scores_count}</div>
                    <div className="text-xs text-gray-600">Баллы</div>
                </div>
            </div>

            {/* Achievements */}
            <AchievementsSlider achievements={user.achievements} />
        </div>
    )
}

export default UserProfilePage
