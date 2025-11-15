import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Input, Button } from "@maxhub/max-ui";
import AuthService, { hasRefreshToken } from "../components/api/service/AuthService";
import UniversityService, { type StudentGroup, type University } from "../components/api/service/UniversityService.ts";
import CustomSelect from "../components/ui/CustomSelect.tsx";
import AvatarInput from "../components/ui/AvatarInput.tsx";

interface RegisterFormData {
    phone_number: string;
    password: string;
    first_name: string;
    last_name: string;
    university_id: number | null;
    group_id: number | null;
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
        university_id: null,
        group_id: null,
        group_number: "",
        avatar: null
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [universities, setUniversities] = useState<University[]>([]);
    const [groups, setGroups] = useState<StudentGroup[]>([]);
    const [groupQuery, setGroupQuery] = useState("");
    const [loadingGroups, setLoadingGroups] = useState(false);

    // Загружаем университеты
    useEffect(() => {
        UniversityService.getUniversities().then(setUniversities);
    }, []);

    // Если есть refresh token — редирект
    useEffect(() => {
        if (hasRefreshToken()) navigate("/profile");
    }, []);

    // Загружаем группы по запросу (2+ символа)
    useEffect(() => {
        if (!formData.university_id) {
            setGroups([]);
            return;
        }

        setLoadingGroups(true);

        const timeout = setTimeout(() => {
            UniversityService.getGroups(formData.university_id!, groupQuery)
                .then(resp => {
                    // Если есть текст поиска — фильтруем, иначе показываем все
                    const allGroups = resp.groups || [];
                    if (groupQuery.trim() === "") {
                        setGroups(allGroups);
                    } else {
                        const filtered = allGroups.filter(g =>
                            g.name.toLowerCase().includes(groupQuery.toLowerCase())
                        );
                        setGroups(filtered);
                    }
                })
                .finally(() => setLoadingGroups(false));
        }, 200);

        return () => clearTimeout(timeout);
    }, [formData.university_id, groupQuery]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === "avatar" && files?.length) {
            setFormData(prev => ({ ...prev, avatar: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = (): string[] => {
        const errs: string[] = [];

        if (!formData.first_name.match(/^[A-Za-zА-Яа-яЁё]+$/))
            errs.push("Имя должно содержать только буквы");

        if (!formData.last_name.match(/^[A-Za-zА-Яа-яЁё]+$/))
            errs.push("Фамилия должна содержать только буквы");

        if (!formData.phone_number.match(/^\+7\d{10}$/))
            errs.push("Телефон должен быть в формате +7XXXXXXXXXX");

        if (!formData.password || formData.password.length < 6)
            errs.push("Пароль должен быть не менее 6 символов");

        if (!formData.university_id)
            errs.push("Выберите университет");

        // 👉 главное изменение:
        if (groups.length > 0) {
            // если группы есть — обязателен group_id
            if (!formData.group_id) errs.push("Выберите группу");
        } else {
            // если групп нет — обязателен ручной ввод
            if (!formData.group_number.trim()) errs.push("Введите номер группы вручную");
        }

        return errs;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);
        window.scrollTo(0, 0);

        const validationErrors = validateForm();
        if (validationErrors.length) {
            setErrors(validationErrors);
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
                String(formData.university_id),
                String(formData.group_id),
                formData.avatar || undefined
            );
            navigate("/profile");
        } catch (err: any) {
            const message = err?.message || "Неизвестная ошибка";
            setErrors([message]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Студент РТ</h1>
                <p className="text-gray-500 text-center mb-4">Создайте новый аккаунт</p>

                {errors.length > 0 && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {errors.map((err, idx) => <p key={idx}>{err}</p>)}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Имя" name="first_name" value={formData.first_name} onChange={handleChange} mode="secondary"/>
                    <Input placeholder="Фамилия" name="last_name" value={formData.last_name} onChange={handleChange} mode="secondary"/>
                    <Input placeholder="Номер телефона" name="phone_number" value={formData.phone_number} onChange={handleChange} mode="secondary" type="tel"/>
                    <div className="relative">
                        <Input
                            iconAfter={
                                <button type="button" onClick={() => setShowPassword(!showPassword)} >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            }
                            placeholder="Пароль" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} mode="secondary" className="pr-12"/>

                    </div>

                    <CustomSelect
                        placeholder="Выберите университет"
                        options={universities.map(u => ({ value: u.id, label: `${u.name} (${u.city.name})` }))}
                        value={universities.find(u => u.id === formData.university_id) ? { value: formData.university_id!, label: universities.find(u => u.id === formData.university_id)!.name } : null}
                        onChange={(opt) => setFormData(prev => ({ ...prev, university_id: Number(opt.value), group_id: null, group_number: "" }))}
                    />

                    {formData.university_id && !loadingGroups && groups.length === 0 ? (
                        <Input
                            placeholder="Введите номер группы вручную"
                            name="group_number"
                            value={formData.group_number}
                            onChange={(e) =>
                                setFormData(prev => ({ ...prev, group_number: e.target.value }))
                            }
                            mode="secondary"
                        />
                    ) : (
                        <CustomSelect
                            placeholder="Выберите группу"
                            options={groups.map(g => ({ value: g.id, label: g.name }))}
                            value={
                                groups.find(g => g.id === formData.group_id)
                                    ? { value: formData.group_id!, label: groups.find(g => g.id === formData.group_id)!.name }
                                    : null
                            }
                            searchable
                            onSearch={(value) => setGroupQuery(value)}
                            onChange={(opt) => {
                                const selectedGroup = groups.find(g => g.id === Number(opt.value));
                                setFormData(prev => ({
                                    ...prev,
                                    group_id: Number(opt.value),
                                    group_number: selectedGroup?.name || ""
                                }));
                            }}
                        />
                    )}

                    {loadingGroups && <p className="text-gray-400 text-sm mt-1">Загрузка групп…</p>}

                    <div className="flex flex-col items-center mb-4">
                        <AvatarInput
                            avatar={formData.avatar}
                            onChange={(file) => setFormData(prev => ({ ...prev, avatar: file }))}
                        />
                    </div>

                    <Button type="submit" size="large" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white" loading={loading}>Зарегистрироваться</Button>
                </form>

                <div className="flex items-center justify-center gap-1 text-center mt-4 text-gray-500">
                    Уже есть аккаунт?{" "}
                    <Button appearance="themed" mode="link" size="medium" onClick={() => navigate("/login")}>Войти</Button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
