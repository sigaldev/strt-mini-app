import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@maxhub/max-ui";
import AuthService, {hasRefreshToken} from "../components/api/service/AuthService";

type Logger = {
    info: (message: string, data?: unknown) => void;
    error: (message: string, data?: unknown) => void;
    warn: (message: string, data?: unknown) => void;
    debug: (message: string, data?: unknown) => void;
};

const logger: Logger = {
    info: (message, data) => console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data || ''),
    error: (message, data) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, data || ''),
    warn: (message, data) => console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data || ''),
    debug: (message, data) => console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, data || '')
};

interface LoginForm {
    phone_number: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginForm>({ phone_number: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (hasRefreshToken()) {
            navigate("/profile");
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        logger.debug("Input changed", { field: name, value: name === "password" ? "***" : value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        logger.info("Login form submitted", { phone_number: formData.phone_number });

        try {
            const response = await AuthService.login(formData.phone_number, formData.password);

            logger.info("Login successful", { phone_number: formData.phone_number, hasAccessToken: !!response.access });

            navigate("/profile");
        } catch (err: unknown) {
            logger.error("Login failed", err);

            const message =
                typeof err === "object" && err !== null && "response" in err
                    ? (err as any).response?.data?.errors?.[0]?.error?.[0] || "Произошла ошибка при входе"
                    : "Произошла ошибка при входе";

            setError(message);

            logger.warn("Displayed login error", { message });
        } finally {
            setLoading(false);
            logger.debug("Login process finished, loading state reset");
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Студент РТ</h1>
                    <p className="text-gray-500">Войдите в свой аккаунт</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        placeholder="Номер телефона"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        type="tel"
                        mode="secondary"
                    />
                    <Input
                        placeholder="Пароль"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        mode="secondary"
                    />

                    {error && (
                        <div className="bg-red-100 border border-red-500 text-red-700 p-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-[1.02] transition-transform text-white"
                        loading={loading}
                    >
                        Войти
                    </Button>
                </form>


                <div className="flex items-center justify-center gap-1 text-center mt-4 text-gray-500">
                    Нет аккаунта?{" "}
                    <Button
                        appearance="themed"
                        mode="link"
                        size="medium"
                        onClick={() => {
                            logger.info("Navigation to register page via link");
                            navigate("/register");
                        }}
                    >
                        Зарегистрироваться
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
