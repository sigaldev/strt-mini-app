import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Camera } from "lucide-react";
import { Input, Button } from "@maxhub/max-ui";
import AuthService from "../components/api/service/AuthService";

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

interface RegisterFormData {
    phone_number: string;
    password: string;
    first_name: string;
    last_name: string;
    group_number: string;
    avatar: File | null;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<RegisterFormData>({
        phone_number: "",
        password: "",
        first_name: "",
        last_name: "",
        group_number: "",
        avatar: null
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === "avatar" && files && files.length > 0) {
            setFormData(prev => ({ ...prev, avatar: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = (): string[] => {
        const errs: string[] = [];
        if (!formData.first_name.match(/^[A-Za-zА-Яа-яЁё]+$/)) errs.push("Имя должно содержать только буквы");
        if (!formData.last_name.match(/^[A-Za-zА-Яа-яЁё]+$/)) errs.push("Фамилия должна содержать только буквы");
        if (!formData.phone_number.match(/^\+7\d{10}$/)) errs.push("Телефон должен быть в формате +7XXXXXXXXXX");
        if (formData.password.length < 6) errs.push("Пароль должен быть не менее 6 символов");
        if (!formData.group_number) errs.push("Введите номер группы");
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        logger.info("Form submitted", formData);

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            logger.warn("Validation failed", validationErrors);
            setLoading(false);
            return;
        }

        try {
            await AuthService.registerProfile(
                formData.phone_number,
                formData.password,
                formData.first_name,
                formData.last_name,
                formData.group_number,
                formData.avatar || undefined
            );
            logger.info("Registration successful, navigating to login page");
            navigate("/login");
        } catch (err: unknown) {
            logger.error("Registration failed", err);
            setErrors(["Ошибка регистрации. Попробуйте снова."]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Студент РТ</h1>
                    <p className="text-gray-500">Создайте новый аккаунт</p>
                </div>

                {errors.length > 0 && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {errors.map((err, idx) => (
                            <p key={idx}>{err}</p>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Имя"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="bg-white border-gray-300 text-gray-900"
                        mode="secondary"
                    />
                    <Input
                        placeholder="Фамилия"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="bg-white border-gray-300 text-gray-900"
                        mode="secondary"
                    />
                    <Input
                        placeholder="Номер телефона"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="bg-white border-gray-300 text-gray-900"
                        mode="secondary"
                        type="tel"
                    />
                    <Input
                        placeholder="Группа"
                        name="group_number"
                        value={formData.group_number}
                        onChange={handleChange}
                        className="bg-white border-gray-300 text-gray-900"
                        mode="secondary"
                    />
                    <div className="relative">
                        <Input
                            placeholder="Пароль"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-white border-gray-300 text-gray-900 pr-12"
                            mode="secondary"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                            <Camera className="w-5 h-5" />
                            <span>Загрузить аватар (необязательно)</span>
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-[1.02] transition-transform text-white"
                        loading={loading}
                    >
                        Зарегистрироваться
                    </Button>
                </form>

                <div className="flex items-center justify-center gap-1 text-center mt-4 text-gray-500">
                    Уже есть аккаунт?{" "}
                    <Button
                        appearance="themed"
                        mode="link"
                        size="medium"
                        onClick={() => {
                            logger.info("Navigation to login page via link");
                            navigate("/login");
                        }}
                    >
                        Войти
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
