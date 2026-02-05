import { useState } from "react";
import Confetti from "react-confetti";
import { type GameMode } from "@/types/rooms.types";
import { GAME_MODES } from "@/constants/gameModes";
import { AppButton } from "@/components/ui/appButton";
import { useSound } from "@/hooks/useSound";

type Props = {
    onCreate: (name: string, mode: GameMode) => void;
    onClose: () => void;
};

export const CreateRoomModal = ({ onCreate, onClose }: Props) => {
    const [name, setName] = useState("");
    const [mode, setMode] = useState<GameMode>("pve");
    const [confetti, setConfetti] = useState(false);

    const playCreateSound = useSound("/sounds/create-room.mp3");

    const handleCreate = () => {
        // запускаем конфетти сразу
        setConfetti(true);
        playCreateSound();

        // через 0.5 секунды создаём комнату и скрываем конфетти
        setTimeout(() => {
            setConfetti(false);
            onCreate(name || "", mode);
        }, 1500);
    };

    return (
        <>
            {confetti && (
                <Confetti
                    numberOfPieces={100}
                    recycle={false}
                    gravity={0.3}
                    tweenDuration={500}
                    initialVelocityX={{ min: -20, max: 20 }}
                    initialVelocityY={{ min: -20, max: 20 }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 9999,
                    }}
                />
            )}

            <div
                className="fixed inset-0 flex items-center justify-center z-50
                   bg-black/45 backdrop-blur-[2px] p-4"
            >
                <div
                    className="bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800
                     rounded-2xl shadow-2xl shadow-black/50
                     w-full max-w-md p-6 flex flex-col gap-6
                     animate-fadeIn"
                >
                    <h2 className="text-3xl font-extrabold text-white text-center drop-shadow-lg">
                        Создать комнату
                    </h2>

                    <input
                        className="w-full mb-3 border-none rounded-lg px-4 py-3
                     text-white bg-white/20 font-medium focus:outline-none
                     focus:ring-1 focus:ring-blue-400 placeholder:text-white/80"
                        placeholder="Название комнаты"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="flex flex-col gap-3">
                        {GAME_MODES.map((m) => (
                            <label
                                key={m.value}
                                className={`block p-3 rounded-xl cursor-pointer 
                            border ${mode === m.value ? "border-blue-400 bg-white/20" : "border-transparent"} 
                            text-white font-medium
                            ${mode === m.value ? "text-blue-800 font-semibold" : "text-white"}`}
                            >
                                <input
                                    type="radio"
                                    className="mr-2 accent-blue-400"
                                    checked={mode === m.value}
                                    onChange={() => setMode(m.value)}
                                />
                                <b>{m.label}</b>
                                <div className="text-sm text-white/80">{m.description}</div>
                            </label>
                        ))}
                    </div>

                    <div className="flex justify-between gap-3 mt-4">
                        <AppButton
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-semibold"
                        >
                            Отмена
                        </AppButton>
                        <AppButton
                            variant="accent"
                            onClick={handleCreate}
                            className="flex-1 px-6 py-3 rounded-xl font-semibold"
                        >
                            Создать
                        </AppButton>
                    </div>
                </div>
            </div>
        </>
    );
};
