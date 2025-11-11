import { Button } from "@maxhub/max-ui"

interface NotificationsModalProps {
    showNotifications: boolean
    setShowNotifications: (val: boolean) => void
}

const NotificationsModal = ({ showNotifications, setShowNotifications }: NotificationsModalProps) => {
    if (!showNotifications) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-lg">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Уведомления</h3>
                    <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >✕</button>
                </div>

                <div className="overflow-y-auto max-h-[calc(80vh-60px)] p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Запросы на коннект</h4>
                    <div className="space-y-2 mb-6">
                        <div className="p-3 bg-[#f5f5f5] rounded-lg">
                            <p className="text-sm text-gray-700">Петров Иван хочет добавить вас в коннекты</p>
                            <div className="flex gap-2 mt-2">
                                <Button className="flex-1"><span>Принять</span></Button>
                                <Button className="flex-1" appearance="negative"><span>Отклонить</span></Button>
                            </div>
                        </div>
                    </div>

                    <h4 className="font-medium text-gray-900 mb-3">Системные уведомления</h4>
                    <div className="space-y-2">
                        <div className="p-3 bg-[#f5f5f5] rounded-lg">
                            <p className="text-sm text-gray-700">Новое мероприятие доступно для регистрации</p>
                            <p className="text-xs text-gray-500 mt-1">2 часа назад</p>
                        </div>
                        <div className="p-3 bg-[#f5f5f5] rounded-lg">
                            <p className="text-sm text-gray-700">Вы получили 50 баллов за участие</p>
                            <p className="text-xs text-gray-500 mt-1">5 часов назад</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationsModal
