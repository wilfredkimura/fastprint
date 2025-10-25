import bcrypt from 'bcryptjs'
import { connectDB } from '../src/utils/db.js'
import { User } from '../src/models/User.js'

async function main() {
  await connectDB()
  const email = 'admin@example.com'
  const password = '12345678'
  const name = 'Admin'

  const existing = await User.findOne({ email })
  if (existing) {
    existing.role = 'admin'
    if (password) {
      const hash = await bcrypt.hash(password, 10)
      existing.password = hash
    }
    await existing.save()
    // eslint-disable-next-line no-console
    console.log('Updated existing admin:', existing.email)
  } else {
    const hash = await bcrypt.hash(password, 10)
    const created = await User.create({ name, email, password: hash, role: 'admin' })
    // eslint-disable-next-line no-console
    console.log('Created admin user:', created.email)
  }
  process.exit(0)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
