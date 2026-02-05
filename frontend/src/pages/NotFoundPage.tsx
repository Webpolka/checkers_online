import { useNavigate } from "react-router-dom";
import { AppButton } from "@/components/ui/appButton";
import { useFullscreen } from "@/hooks/useFullScreen";

export const NotFoundPage = () => {
    const navigate = useNavigate();
    const { openFullscreen } = useFullscreen();

    const back = () => {
        openFullscreen();
        navigate("/welcome")
    }

    return (
        <div className="relative h-screen w-screen flex flex-col items-center justify-center text-white px-6 text-center">

            {/* ===== Фоновое изображение ===== */}
            <img
                src="/images/rooms-bg.webp"
                alt="Фон шашек"
                className="absolute inset-0 w-full h-full object-cover -z-10"
            />

            {/* ===== Полупрозрачный градиент сверху ===== */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/40 to-indigo-700/40 -z-9"></div>


            <h1 className="text-[140px] leading-[1.1] tracking-[0.3em] font-extrabold mb-0">404</h1>
            <p className="text-2xl font-semibold mb-8">Страница не найдена</p>
            <AppButton variant="primary" onClick={back}>
                Вернуться на главную
            </AppButton>
        </div>
    );
};
