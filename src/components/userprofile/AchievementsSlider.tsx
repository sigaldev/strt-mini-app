interface AchievementsSliderProps {
    achievements: {
        id: number
        icon: string
        name: string
    }[]
}

const AchievementsSlider = ({ achievements }: AchievementsSliderProps) => {
    const hasAchievements = achievements && achievements.length > 0

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Достижения
            </h3>

            {hasAchievements ? (
                <div className="grid grid-cols-3 gap-4">
                    {achievements.map((ach) => (
                        <div
                            key={ach.id}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                                <img
                                    src={ach.icon}
                                    alt={ach.name}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <p className="text-xs text-gray-700 mt-2">{ach.name}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 text-gray-500 text-sm">
                    У пользователя пока нет достижений
                </div>
            )}
        </div>
    )
}

export default AchievementsSlider
