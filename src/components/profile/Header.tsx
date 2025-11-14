import { Bell, Menu } from 'lucide-react'

interface HeaderProps {
    setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>
    setShowBurgerMenu: React.Dispatch<React.SetStateAction<boolean>>
    requests?: any[]
}

const Header = ({ setShowNotifications, setShowBurgerMenu, requests = [] }: HeaderProps) => {
    const hasNewRequests = Array.isArray(requests) && requests.length > 0;

    return (
        <div className="flex items-center mb-6 relative mt-2">
            <button
                onClick={() => setShowNotifications(prev => !prev)}
                className="absolute top-0 left-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <Bell className="w-6 h-6 text-gray-700" />
                {hasNewRequests && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <h1 className="text-gray-900 mx-auto font-semibold">Мой профиль</h1>
            <button
                onClick={() => setShowBurgerMenu(true)}
                className="absolute top-0 right-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <Menu className="w-6 h-6 text-gray-700" />
            </button>
        </div>
    )
}

export default Header
