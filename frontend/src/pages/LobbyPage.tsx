// src/pages/GameLobby.tsx
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameTile from "@/components/GameTile";
import ProfileModal from "@/components/ProfileModal";
import { games } from "@/constants/gameConfig";

interface UserProfile {
  nickname: string;
  avatarUrl: string;
}

const LOCAL_STORAGE_KEY = "user_profile";

export const LobbyPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      queueMicrotask(() => {
        setProfile(JSON.parse(stored));
        setModalOpen(false);
      });
    } else {
      queueMicrotask(() => setModalOpen(true));
    }
  }, []);

  const handleSaveProfile = (nickname: string, avatarFile: File | null) => {
    let avatarUrl = "";
    if (avatarFile) avatarUrl = URL.createObjectURL(avatarFile);

    const newProfile = { nickname, avatarUrl };
    setProfile(newProfile);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header profile={profile} />

      {/* Flexbox вместо Grid */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 flex flex-wrap gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex-1 min-w-[300px] " 
          >
            <GameTile
              title={game.title}
              description={game.description}
              image={game.image}
              route={game.route}
            />
          </div>
        ))}
      </main>

      <Footer />

      <ProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProfile}
        initialNickname={profile?.nickname}
        initialAvatarUrl={profile?.avatarUrl}
      />
    </div>
  );
};
