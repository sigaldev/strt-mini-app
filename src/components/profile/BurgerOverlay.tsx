import { LogOut, X } from "lucide-react";
import type { Profile } from "../api/service/ProfileService"; // путь поправь под свой проект

interface BurgerOverlayProps {
    showBurgerMenu: boolean;
    setShowBurgerMenu: (val: boolean) => void;
    getInitials: () => string;
    profileData: Profile;
    handleLogout: () => void;
}

const BurgerOverlay: React.FC<BurgerOverlayProps> = ({
                                                         showBurgerMenu,
                                                         setShowBurgerMenu,
                                                         getInitials,
                                                         profileData,
                                                         handleLogout
                                                     }) => {
    return (
        <>
            {/* Затемнение фона */}
            <div
                className={`
                    fixed inset-0 z-40 bg-black transition-opacity duration-300
                    ${showBurgerMenu ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
                onClick={() => setShowBurgerMenu(false)}
            />

            {/* Меню выезжающее справа */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-80 max-w-full bg-[#1d1d1d] z-50
                    transform transition-transform duration-300 ease-out
                    ${showBurgerMenu ? "translate-x-0" : "translate-x-full"}
                    shadow-2xl
                `}
            >
                {/* Заголовок */}
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Меню</h3>
                    <button
                        onClick={() => setShowBurgerMenu(false)}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Профиль */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#007aff] rounded-full flex items-center justify-center text-white font-bold">
                            {getInitials()}
                        </div>
                        <div>
                            <h4 className="text-white font-medium">
                                {profileData.first_name} {profileData.last_name}
                            </h4>

                            <p className="text-gray-400 text-sm">
                                {profileData.university?.name || "Университет не указан"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Пункты меню */}
                <div className="p-4 space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 hover:bg-red-500/10 transition-colors text-red-400 rounded-lg group"
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
