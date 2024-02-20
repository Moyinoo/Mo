import rateLimit from 'express-rate-limit'
// Rate limiting settings
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Maximum number of requests allowed in 1 minute
  message: 'Too many requests from this IP, please try again later.',
})

export default limiter
