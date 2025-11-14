import { Button } from "@maxhub/max-ui"

interface NotificationsModalProps {
    showNotifications: boolean
    setShowNotifications: (val: boolean) => void
    requests?: any[]
    setRequests?: React.Dispatch<React.SetStateAction<any[]>>
    onAcceptRequest?: (id: number) => void // новый пропс
    onRejectRequest?: (id: number) => void // новый пропс
    loading?: boolean
}

const NotificationsModal = ({
                                showNotifications,
                                setShowNotifications,
                                requests = [],
                                onAcceptRequest = () => {},
                                onRejectRequest = () => {},
                                loading = false
                            }: NotificationsModalProps) => {

    if (!showNotifications) return null

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNotifications(false)}
        >
            <div
                className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Уведомления</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700 transition-colors">✕</button>
                </div>

                <div className="overflow-y-auto max-h-[calc(80vh-60px)] p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Запросы на коннект</h4>
                    <div className="space-y-2 mb-6">
                        {loading ? (
                            <p>Загрузка...</p>
                        ) : !Array.isArray(requests) || requests.length === 0 ? (
                            <p className="text-sm text-gray-500">Нет новых запросов</p>
                        ) : (
                            requests.map(r => (
                                <div key={r.connect_request_id} className="p-3 bg-[#f5f5f5] rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        {r.from_user.first_name} {r.from_user.last_name} хочет добавить вас в коннекты
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <Button className="flex-1" onClick={() => onAcceptRequest(r.connect_request_id)}>Принять</Button>
                                        <Button className="flex-1" appearance="negative" onClick={() => onRejectRequest(r.connect_request_id)}>Отклонить</Button>
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
