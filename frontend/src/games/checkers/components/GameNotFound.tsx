import { useNavigate } from "react-router-dom";
import { AppButton } from "@/components/AppButton";

type Props = {
    message: string;
};

export const GameNotFound = ({ message }: Props) => {
    const navigate = useNavigate();

    const back = () =>{
        navigate("/checkers/rooms");
    }

    return (
        <div className="relative h-screen w-screen flex flex-col items-center justify-center text-white text-center">

            {/* ===== Фоновое изображение ===== */}
            <img
                src="/images/rooms-bg.webp"
                alt="Фон шашек"
                className="absolute inset-0 w-full h-full object-cover -z-10"
            />

            {/* ===== Полупрозрачный градиент сверху ===== */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/40 to-indigo-700/40 -z-9"></div>

            <h1 className="text-4xl md:text-5xl font-semibold mb-10">{message}</h1>

            <AppButton variant="primary" onClick={back}>
                Вернуться назад
            </AppButton>
        </div>
    );
};
