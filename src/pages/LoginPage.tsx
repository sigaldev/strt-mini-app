import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@maxhub/max-ui";
import AuthService, {hasRefreshToken} from "../components/api/service/AuthService";

const getLoginErrorMessage = (err: unknown) => {
    if (typeof err === "object" && err !== null && "response" in err) {
        const data = (err as { response?: { data?: { errors?: { error?: string[] }[] } } }).response?.data;
        return data?.errors?.[0]?.error?.[0] || "Произошла ошибка при входе";
    }

    return "Произошла ошибка при входе";
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
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await AuthService.login(formData.phone_number, formData.password);
            navigate("/profile");
        } catch (err: unknown) {
            const message = getLoginErrorMessage(err);

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">СТРТ</h1>
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
                        size="large"
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
