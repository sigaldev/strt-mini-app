import { Outlet, NavLink } from "react-router-dom"
import { User, Calendar, Tag, Briefcase } from 'lucide-react'

const Layout = () => {
    const navItems = [
        { path: "/profile", icon: User, label: "Профиль" },
        { path: "/events", icon: Calendar, label: "Мероприятия" },
        { path: "/discounts", icon: Tag, label: "Скидки" },
        { path: "/jobs", icon: Briefcase, label: "Вакансии" },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:flex md:flex-col md:bg-white md:border-r md:border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Студент РТ</h1>
                    <p className="text-sm text-gray-500 mt-1">Студенческий портал</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 pb-20 md:pb-0">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
                                    isActive ? "text-blue-600" : "text-gray-500"
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
