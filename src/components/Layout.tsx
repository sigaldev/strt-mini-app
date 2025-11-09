import { Outlet, NavLink } from "react-router-dom"
import {User, Calendar, Tag, Briefcase, Moon, Sun} from 'lucide-react'
import { useTheme } from "../contexts/ThemeContext"

const Layout = () => {
    const { theme, toggleTheme } = useTheme()

    const navItems = [
        { path: "/profile", icon: User, label: "Профиль" },
        { path: "/events", icon: Calendar, label: "Мероприятия" },
        { path: "/discounts", icon: Tag, label: "Скидки" },
        { path: "/jobs", icon: Briefcase, label: "Вакансии" },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Desktop Sidebar */}
            <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:flex md:flex-col md:bg-white dark:md:bg-[#1d1d1d] md:border-r md:border-gray-200 dark:md:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Студент РТ</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Студенческий портал</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium"
                                        : "text-[#007AFF] dark:text-[#007AFF] hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        <span>{theme === "light" ? "Темная тема" : "Светлая тема"}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 pb-20 md:pb-0">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1d1d1d] border-t border-gray-200 dark:border-gray-700 px-2 py-2 z-50">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
                                    isActive ? "text-[#007AFF] dark:text-[#007AFF]" : "text-gray-500 dark:text-gray-400"
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-xs">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    )
}

export default Layout
