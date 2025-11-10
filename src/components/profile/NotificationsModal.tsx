import { Button } from "@maxhub/max-ui"

interface NotificationsModalProps {
    showNotifications: boolean
    setShowNotifications: (val: boolean) => void
}

const NotificationsModal = ({ showNotifications, setShowNotifications }: NotificationsModalProps) => {
    if (!showNotifications) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#181818] rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Уведомления</h3>
                    <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-300"
                    >✕</button>
                </div>

                <div className="overflow-y-auto max-h-[calc(80vh-60px)] p-4">
                    <h4 className="font-medium text-white mb-3">Запросы на коннект</h4>
                    <div className="space-y-2 mb-6">
                        <div className="p-3  bg-[#1d1d1d] rounded-lg">
                            <p className="text-sm text-white">Петров Иван хочет добавить вас в коннекты</p>
                            <div className="flex gap-2 mt-2">
                                <Button className="flex-1"><span>Принять</span></Button>
                                <Button className="flex-1" appearance="negative"><span>Отклонить</span></Button>
                            </div>
                        </div>
                    </div>

                    <h4 className="font-medium text-white mb-3">Системные уведомления</h4>
                    <div className="space-y-2">
                        <div className="p-3 bg-[#1d1d1d] rounded-lg">
                            <p className="text-sm text-white">Новое мероприятие доступно для регистрации</p>
                            <p className="text-xs text-gray-400 mt-1">2 часа назад</p>
                        </div>
                        <div className="p-3 bg-[#1d1d1d]  rounded-lg">
                            <p className="text-sm text-white">Вы получили 50 баллов за участие</p>
                            <p className="text-xs text-gray-400 mt-1">5 часов назад</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationsModal
