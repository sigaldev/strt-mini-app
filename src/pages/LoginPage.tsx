import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@maxhub/max-ui";
import AuthService from "../components/api/service/AuthService";

const logger = {
    info: (message: string, data?: any) => {
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data || '');
    },
    error: (message: string, error?: any) => {
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error || '');
    },
    warn: (message: string, data?: any) => {
        console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data || '');
    },
    debug: (message: string, data?: any) => {
        console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, data || '');
    }
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phone_number: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        logger.debug('Input changed', { field: name, value: name === 'password' ? '***' : value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        logger.info('Login form submitted', { phone_number: formData.phone_number });

        try {
            const response = await AuthService.login(formData.phone_number, formData.password);

            logger.info('Login successful', { phone_number: formData.phone_number, hasAccessToken: !!response.access });

            navigate("/profile");
        } catch (err: any) {
            logger.error('Login failed', err);

            const message =
                err?.response?.data?.errors?.[0]?.error?.[0] ||
                "Произошла ошибка при входе";
            setError(message);

            logger.warn('Displayed login error', { message });
        } finally {
            setLoading(false);
            logger.debug('Login process finished, loading state reset');
        }
    };

    return (
        <div className="min-h-screen bg-[#181818] flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-md bg-[#1d1d1d] rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Студент РТ</h1>
                    <p className="text-gray-400">Войдите в свой аккаунт</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        placeholder="Номер телефона"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="bg-[#181818] border-gray-600 text-white"
                        type="tel"
                    />
                    <Input
                        placeholder="Пароль"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-[#181818] border-gray-600 text-white"
                        type="password"
                    />

                    {error && (
                        <div className="bg-red-600/30 border border-red-500 text-red-100 p-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#007aff] to-blue-600 hover:scale-[1.02] transition-transform"
                        loading={loading}
                    >
                        Войти
                    </Button>
                </form>

                <div className="text-center mt-4 text-gray-400">
                    Нет аккаунта?{" "}
                    <button
                        onClick={() => {
                            logger.info('Navigation to register page via link');
                            navigate("/register");
                        }}
                        className="text-[#007aff] font-semibold hover:underline"
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
