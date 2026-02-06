import React, { useEffect, useState } from "react";
import { ThankYouModal } from "../thanksModal";

type CloseTabButtonProps = {
    className?: string;
};

export const CloseTabButton: React.FC<CloseTabButtonProps> = ({
    className = "",
}) => {
    const [closePage, setClosePage] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const duration = 5000;

    useEffect(() => {
        const shouldRedirect = localStorage.getItem("shouldRedirect");
        if (closePage && shouldRedirect === "true") {
            localStorage.removeItem("shouldRedirect"); // сразу очищаем
            window.location.href = "https://wtemu.ru"; // редирект
        }
    }, [closePage]);

    const handleClose = () => {
        // Ставим флаг, что нужно сделать редирект
        localStorage.setItem("shouldRedirect", "true");

        setShowModal(true);
        setTimeout(() => {
            setClosePage(true);
        }, duration)

        // Здесь можно выйти из fullscreen, если нужно
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
    };

    return (
        <>
            <button
                onClick={handleClose}
                className={`
        absolute top-5 right-5 sm:top-10 sm:right-10
        flex items-center justify-center
        rounded-full
        cursor-pointer
        bg-gradient-to-br from-blue-400 to-blue-600
        shadow-2xl shadow-black/50
        hover:scale-110 hover:from-blue-300 hover:to-blue-500
        transition-all duration-300
        w-12 h-12 md:w-20 md:h-20
        ${className}
      `}
            >
                <svg className="w-7 h-7 md:w-12 md:h-12 flex-shrink-0 text-white drop-shadow-md transition-transform duration-200">
                    <use xlinkHref={`/sprite/sprite.svg#close`} />
                </svg>
            </button>

            <ThankYouModal show={showModal} duration={duration} />
        </>
    );
};
