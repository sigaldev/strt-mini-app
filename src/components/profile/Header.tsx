import { Bell, Menu } from 'lucide-react'

interface HeaderProps {
    setShowNotifications: (val: boolean) => void
    setShowBurgerMenu: (val: boolean) => void
}

const Header = ({ setShowNotifications, setShowBurgerMenu }: HeaderProps) => {
    return (
        <div className="flex items-center mb-6 relative mt-2">
            <button
                onClick={() => setShowNotifications(prev => !prev)}
                className="absolute top-0 left-0 p-2 hover:bg-[#1d1d1d] rounded-lg transition-colors"
            >
                <Bell className="w-6 h-6 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <h1 className="text-white mx-auto">Мой профиль</h1>
            <button
                onClick={() => setShowBurgerMenu(true)}
                className="absolute top-0 right-0 p-2 hover:bg-[#1d1d1d] rounded-lg transition-colors"
            >
                <Menu className="w-6 h-6 text-gray-400" />
            </button>
        </div>
    )
}

export default Header
