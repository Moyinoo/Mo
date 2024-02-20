import * as dotenv from 'dotenv'
import twilio from 'twilio'

// Load environment variables from a .env file if not already loaded
dotenv.config()

const accountSid: string | undefined = process.env.TWILIO_ACCOUNT_SID
const authToken: string | undefined = process.env.TWILIO_AUTH_TOKEN

if (!accountSid || !authToken) {
  console.error(
    'TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is missing in the environment variables.',
  )
  process.exit(1)
}

const sms = twilio(accountSid, authToken)

export { sms }
