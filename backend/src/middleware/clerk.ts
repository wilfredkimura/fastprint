import type { Request, Response, NextFunction } from 'express'
import { User } from '../models/User.js'

// This middleware verifies a Clerk JWT and upserts the user in MongoDB.
// Requires env: CLERK_SECRET_KEY
export async function clerkAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
  const token = auth.slice(7)
  try {
    const { verifyToken } = await import('@clerk/clerk-sdk-node')
    const secretKey = process.env.CLERK_SECRET_KEY as string | undefined
    if (!secretKey) return res.status(500).json({ message: 'CLERK_SECRET_KEY missing' })
    // Derive issuer from JWT payload to avoid extra env
    const [, payloadB64] = token.split('.')
    if (!payloadB64) return res.status(401).json({ message: 'Invalid token' })
    const json = Buffer.from(payloadB64.replace(/-/g,'+').replace(/_/g,'/'), 'base64').toString('utf8')
    const rawClaims = JSON.parse(json)
    const issuer = rawClaims?.iss as string | undefined
    if (!issuer) return res.status(401).json({ message: 'Invalid token (issuer missing)' })
    const payload: any = await verifyToken(token, { secretKey, issuer })

    // payload.sub is the Clerk user id; payload.claims may include email
    const sub = payload?.sub
    const claims = payload?.claims || payload
    const email = claims?.email || claims?.primary_email_address?.email_address
    const name = [claims?.first_name, claims?.last_name].filter(Boolean).join(' ') || claims?.name || ''

    // Upsert user by email if available; otherwise, keep a synthetic email based on sub
    const finalEmail = email || (sub ? `${sub}@users.clerk.dev` : undefined)
    if (!finalEmail) return res.status(401).json({ message: 'Invalid token' })

    const user = await User.findOneAndUpdate(
      { email: finalEmail },
      { name: name || finalEmail, email: finalEmail },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    ;(req as any).user = { id: user.id, role: user.role }
    ;(req as any).clerk = payload
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
