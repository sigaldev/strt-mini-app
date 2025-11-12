import { LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Profile } from "../api/service/ProfileService";
import AuthService from "../api/service/AuthService.ts";

interface BurgerOverlayProps {
    showBurgerMenu: boolean;
    setShowBurgerMenu: (val: boolean) => void;
    getInitials: () => string;
    profileData: Profile;
}

const BurgerOverlay: React.FC<BurgerOverlayProps> = ({
                                                         showBurgerMenu,
                                                         setShowBurgerMenu,
                                                         getInitials,
                                                         profileData
                                                     }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();           // удаляем токены
        setShowBurgerMenu(false);       // закрываем меню
        navigate("/login");             // редирект на страницу входа
    };

    return (
        <>
            {/* Затемнение фона */}
            <div
                className={`
                    fixed inset-0 z-40 bg-black bg-opacity-20 transition-opacity duration-300
                    ${showBurgerMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
                onClick={() => setShowBurgerMenu(false)}
            />

            {/* Меню выезжающее справа */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-80 max-w-full bg-white z-50
                    transform transition-transform duration-300 ease-out
                    ${showBurgerMenu ? "translate-x-0" : "translate-x-full"}
                    shadow-2xl
                `}
            >
                {/* Заголовок */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Меню</h3>
                    <button
                        onClick={() => setShowBurgerMenu(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Профиль */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center text-white font-bold">
                            {getInitials()}
                        </div>
                        <div>
                            <h4 className="text-gray-900 font-medium">
                                {profileData.first_name} {profileData.last_name}
                            </h4>
                            <p className="text-gray-500 text-sm">
                                {profileData.university?.abbreviation || "Университет не указан"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Пункты меню */}
                <div className="p-4 space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 hover:bg-red-100 transition-colors text-red-500 rounded-lg group"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Выйти из профиля</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default BurgerOverlay;
