import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AppButton } from "@/components/ui/appButton";

type HeaderProps = {
  title: string;
  rightContent?: ReactNode;
};

export const Header = ({ title, rightContent }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-gradient-to-br from-blue-700/50 via-purple-700/50 to-indigo-800/50 sm:shadow-2xl sm:shadow-black/50 px-3 sm:px-6">
      {/* ===== Верхняя строка ===== */}
      <div className="flex items-center gap-5 max-w-5xl mx-auto py-3 sm:py-5">
        {/* Левая часть */}
        <div className="flex gap-2 shrink-0">
          <AppButton
            variant="secondary"
            onClick={() => navigate("/welcome")}
            className="p-2 !text-base rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
          >
            <svg className="w-5 h-5 flex-shrink-0 text-white drop-shadow-md transition-transform duration-200">
              <use xlinkHref={`/sprite/sprite.svg#home`} />
            </svg>
          </AppButton>
        </div>

        {/* Заголовок */}
        <h1 className="flex-1 text-2xl md:text-3xl font-extrabold text-white drop-shadow-md text-center sm:text-left truncate">
          {title}
        </h1>

        {/* Правая часть — desktop */}
        {rightContent && (
          <div className="hidden sm:block shrink-0">
            {rightContent}
          </div>
        )}
      </div>

      {/* Нижняя строка — mobile */}
      {rightContent && <div className="sm:hidden pb-3">{rightContent}</div>}
    </div>
  );
};
