import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  userId?: string | undefined;
}

interface NewsletterPayload {
  email: string;
}

const submitContact = async (payload: ContactPayload) => {
  const message = await prisma.contactMessage.create({
    data: {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
      userId: payload.userId || null,
    },
  });

  return message;
};

const subscribeNewsletter = async (payload: NewsletterPayload) => {
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: payload.email },
  });

  if (existing) {
    throw new AppError('This email is already subscribed to our newsletter.', 409);
  }

  const subscriber = await prisma.newsletterSubscriber.create({
    data: { email: payload.email },
  });

  return subscriber;
};

const miscService = {
  submitContact,
  subscribeNewsletter,
};

export default miscService;
