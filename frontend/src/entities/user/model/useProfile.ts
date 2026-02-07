import { useEffect, useState } from "react"
import { api } from "@/shared/api/axios"
import type { Profile } from "./types"
import { mapUserToProfile } from "./adapter"

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const { data } = await api.get("/user/me")
      setProfile(mapUserToProfile(data))
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (payload: {
    username?: string
    photo_url?: string
  }) => {
    const { data } = await api.post("/user/update", payload)
    setProfile(mapUserToProfile(data))
  }

  useEffect(() => {
    load()
  }, [])

  return {
    profile,
    loading,
    updateProfile,
    reload: load
  }
}
