import { Request, Response } from "express"
import { loginService, refreshService } from "./auth.service.js";

export const loginController = (req: Request, res: Response) => {
  const { tokens } = loginService()

  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax"
  })

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    sameSite: "lax"
  })

  res.json({ ok: true })
}

export const refreshController = (req: Request, res: Response) => {
  try {
    const refresh = req.cookies.refreshToken
    if (!refresh) return res.sendStatus(401)

    const tokens = refreshService(refresh)

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      sameSite: "lax"
    })
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax"
    })

    res.json({ ok: true })
  } catch {
    res.sendStatus(401)
  }
}

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("accessToken")
  res.clearCookie("refreshToken")
  res.json({ ok: true })
}
