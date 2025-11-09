import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@maxhub/max-ui";

const LoginPage = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("Login:", { phone, password });
        // здесь будет логика авторизации по номеру
        navigate("/profile"); // после успешного входа
    };

    return (
        <div className="min-h-screen bg-[#181818] flex items-center justify-center p-4">
            <div className="bg-[#1d1d1d] rounded-2xl shadow-sm p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Вход</h1>

                <div className="space-y-4 mb-6">
                    <Input
                        placeholder="Номер телефона"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-[#181818] border-gray-600 text-white"
                        type="tel"
                    />
                    <Input
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-[#181818] border-gray-600 text-white"
                        type="password"
                    />
                </div>

                <Button className="w-full py-3" onClick={handleLogin}>
                    Войти
                </Button>

                <div className="mt-4 text-center text-gray-400 text-sm">
                    Нет аккаунта?{" "}
                    <button
                        className="text-emerald-500 font-semibold hover:underline"
                        onClick={() => navigate("/register")}
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
