import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import miscService from './misc.service';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const miscController = {
  submitContact: catchAsync(async (req: Request, res: Response) => {
    const validated = contactSchema.parse(req.body);
    const message = await miscService.submitContact({
      ...validated,
      userId: req.user?.id,
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Your message has been received. We will get back to you shortly.',
      data: { id: message.id },
    });
  }),

  subscribeNewsletter: catchAsync(async (req: Request, res: Response) => {
    const validated = newsletterSchema.parse(req.body);
    const subscriber = await miscService.subscribeNewsletter(validated);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Successfully subscribed to the newsletter!',
      data: { id: subscriber.id, email: subscriber.email },
    });
  }),
};

export default miscController;
