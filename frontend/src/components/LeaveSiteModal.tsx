import { type FC } from "react";
import Confetti from "react-confetti";

type LeaveSiteModalProps = {
    show: boolean; 
    duration?: number; // миллисекунды перед редиректом
};

export const LeaveSiteModal: FC<LeaveSiteModalProps> = ({
    show, duration = 1000
}) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 
                    bg-black/45 backdrop-blur-[2px] p-2">
            <div className="bg-gradient-to-br from-indigo-300 via-purple-700 to-blue-800
                      rounded-2xl shadow-2xl shadow-black/50
                      w-full max-w-[400px] px-6 py-10 flex flex-col items-center gap-6
                      animate-fadeIn">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center drop-shadow-lg">
                    🎉 Спасибо за игру!
                </h2>
                <p className="text-xl text-white text-center drop-shadow-md">
                    Мы надеемся, вам понравились игры! Вы будете перенаправлены на наш блог о веб-разработке через {duration / 1000} секунд…
                </p>

                <Confetti
                    numberOfPieces={150}
                    recycle={false}
                    gravity={0.3}
                    tweenDuration={5000}
                    initialVelocityX={{ min: -10, max: 10 }}
                    initialVelocityY={{ min: -10, max: 10 }}
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
            </div>
        </div>
    );
};
