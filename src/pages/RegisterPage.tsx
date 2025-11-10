import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Camera } from "lucide-react";
import { Input, Button } from "@maxhub/max-ui";
import AuthService from "../components/api/service/AuthService.ts";

const logger = {
    info: (message: string, data?: any) => console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data || ''),
    error: (message: string, error?: any) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error || ''),
    warn: (message: string, data?: any) => console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data || ''),
    debug: (message: string, data?: any) => console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, data || '')
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        phone_number: "",
        password: "",
        first_name: "",
        last_name: "",
        group_number: "",
        phone: "",
        avatar: null as File | null,
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === "avatar" && files) {
            setFormData({ ...formData, avatar: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
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
            logger.info("Starting registration process");
            await AuthService.registerProfile(
                formData.phone_number,
                formData.password,
                formData.first_name,
                formData.last_name,
                formData.group_number,
                formData.phone || undefined,
                formData.avatar || undefined
            );
            logger.info("Registration successful, navigating to login page");
            navigate("/login");
        } catch (err) {
            logger.error("Registration failed", err);
            setErrors(["Ошибка регистрации. Попробуйте снова."]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#181818] flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-md bg-[#1d1d1d] rounded-2xl shadow-lg p-8">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-white mb-2">Студент РТ</h1>
                    <p className="text-gray-400">Создайте новый аккаунт</p>
                </div>

                {/* Ошибки */}
                {errors.length > 0 && (
                    <div className="bg-red-600 text-white p-3 rounded mb-4">
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
                        className="bg-[#181818] border-gray-600 text-white"
                    />
                    <Input
                        placeholder="Фамилия"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="bg-[#181818] border-gray-600 text-white"
                    />
                    <Input
                        placeholder="Номер телефона"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="bg-[#181818] border-gray-600 text-white"
                    />
                    <Input
                        placeholder="Группа"
                        name="group_number"
                        value={formData.group_number}
                        onChange={handleChange}
                        className="bg-[#181818] border-gray-600 text-white"
                    />
                    <div className="relative">
                        <Input
                            placeholder="Пароль"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-[#181818] border-gray-600 text-white pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer text-gray-400">
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
                        className="w-full bg-gradient-to-r from-[#007aff] to-blue-600 hover:scale-[1.02] transition-transform"
                        loading={loading}
                    >
                        Зарегистрироваться
                    </Button>
                </form>

                <div className="text-center mt-4 text-gray-400">
                    Уже есть аккаунт?{" "}
                    <a
                        href="/login"
                        className="text-[#007aff] hover:underline"
                        onClick={() => logger.info("Navigation to login page via link")}
                    >
                        Войти
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
