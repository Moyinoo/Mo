import express from 'express'
import { TestimonialController } from '../controllers/testimonial.controller'

const testimonialRouter = express.Router()

testimonialRouter.get(
  '/testimonial/:id',
  TestimonialController.prototype.getTestimonial,
)
testimonialRouter.put(
  '/testimonial/update',
  TestimonialController.prototype.updateTestimonial,
)
testimonialRouter.post(
  '/testimonial/create',
  TestimonialController.prototype.createTestimonial,
)
testimonialRouter.delete(
  '/testimonial/delete/:id',
  TestimonialController.prototype.deleteTestimonial,
)

export { testimonialRouter }
