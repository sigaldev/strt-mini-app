import { Button } from "@maxhub/max-ui"
import ConnectService from "../api/service/ConnectService"

interface NotificationsModalProps {
    showNotifications: boolean
    setShowNotifications: (val: boolean) => void
    requests?: any[]               // optional
    setRequests?: React.Dispatch<React.SetStateAction<any[]>> // optional
    loading?: boolean              // optional
}

const NotificationsModal = ({
                                showNotifications,
                                setShowNotifications,
                                requests = [],
                                setRequests = () => {},
                                loading = false
                            }: NotificationsModalProps) => {

    const handleAccept = async (id: number) => {
        try {
            await ConnectService.acceptConnectRequest(id)
            setRequests(prev => prev.filter(r => r.connect_request_id !== id))
        } catch {
            alert("Не удалось принять запрос")
        }
    }

    const handleReject = async (id: number) => {
        try {
            await ConnectService.rejectConnectRequest(id)
            setRequests(prev => prev.filter(r => r.connect_request_id !== id))
        } catch {
            alert("Не удалось отклонить запрос")
        }
    }

    if (!showNotifications) return null

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNotifications(false)} // клик на фон закрывает модалку
        >
            <div
                className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-lg"
                onClick={e => e.stopPropagation()} // предотвращаем закрытие при клике на саму модалку
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Уведомления</h3>
                    <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ✕
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(80vh-60px)] p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Запросы на коннект</h4>
                    <div className="space-y-2 mb-6">
                        {loading ? (
                            <p>Загрузка...</p>
                        ) : requests.length === 0 ? (
                            <p className="text-sm text-gray-500">Нет новых запросов</p>
                        ) : (
                            requests.map(r => (
                                <div key={r.connect_request_id} className="p-3 bg-[#f5f5f5] rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        {r.from_user.first_name} {r.from_user.last_name} хочет добавить вас в коннекты
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <Button className="flex-1" onClick={() => handleAccept(r.connect_request_id)}>Принять</Button>
                                        <Button className="flex-1" appearance="negative" onClick={() => handleReject(r.connect_request_id)}>Отклонить</Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationsModal
