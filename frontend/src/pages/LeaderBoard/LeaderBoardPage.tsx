import { LeaderCard } from "./LeaderCard";
import { Header } from "@/components/header";

// Мока-данные
export type PlayerScore = {
  rank: number;
  name: string;
  username: string;
  points: number;
};

const MOCK_PLAYERS: PlayerScore[] = [
  { rank: 1, name: "Алексей", username: "@alex", points: 1200 },
  { rank: 2, name: "Юлия", username: "@yulia", points: 1100 },
  { rank: 3, name: "Иван", username: "@ivan", points: 1050 },
  { rank: 4, name: "Марина", username: "@marina", points: 950 },
  { rank: 5, name: "Сергей", username: "@sergey", points: 900 },
  { rank: 6, name: "Иван", username: "@ivan", points: 1050 },
  { rank: 7, name: "Марина", username: "@marina", points: 950 },
  { rank: 8, name: "Сергей", username: "@sergey", points: 900 },
  { rank: 9, name: "Иван", username: "@ivan", points: 1050 },
  { rank: 10, name: "Марина", username: "@marina", points: 950 }  
];
export const LeaderBoardPage = () => {
  return (
    <div className="relative h-screen flex flex-col">
       {/* ===== Фоновое изображение ===== */}
      <img
        src="/images/rooms-bg.webp"
        alt="Фон шашек"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ===== Полупрозрачный градиент сверху ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/40 to-indigo-700/40"></div>

      <Header title="Таблица лидеров" />

      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-700/50 via-purple-700/50 to-indigo-800/50 px-4 md:px-6 pt-6">
        <div className="max-w-4xl mx-auto space-y-4 pb-24">
          {MOCK_PLAYERS.map(player => (
            <LeaderCard key={player.rank} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
};
