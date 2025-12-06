import catchAsync from '@/utils/catchAsync';

import { sendSuccessResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { Webhook } from 'svix';
import AppError from '@/app/errors/handlers/AppError';
import UserModel from '../user/user.model';
import { userConstant } from '../user/user.constant';

interface WebhookEvent {
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
  type: string;
}

const handleClerkWebhook = catchAsync(async (req, res) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET not configured');
    res.status(500).json({ error: 'Webhook secret not configured' });
    return;
  }

  // Get webhook headers
  const svixId = req.headers['svix-id'] as string;
  const svixTimestamp = req.headers['svix-timestamp'] as string;
  const svixSignature = req.headers['svix-signature'] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new AppError('Missing webhook headers', StatusCodes.BAD_REQUEST);
  }

  // Create webhook instance
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    // Verify webhook signature
    evt = wh.verify(JSON.stringify(req.body), {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err: any) {
    console.error('Webhook verification failed:', err.message);
    throw new AppError('Invalid webhook signature', StatusCodes.UNAUTHORIZED);
  }

  const { id, email_addresses, first_name, last_name, image_url } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook received: ${eventType} for user ${id}`);

  // Handle different event types
  switch (eventType) {
    case 'user.created':
      await handleUserCreated(id, email_addresses, first_name, last_name, image_url);
      break;

    case 'user.updated':
      await handleUserUpdated(id, email_addresses, first_name, last_name, image_url);
      break;

    case 'user.deleted':
      await handleUserDeleted(id);
      break;

    default:
      console.log(`Unhandled event type: ${eventType}`);
  }

  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Webhook processed successfully',
  });
});

const handleUserCreated = async (
  clerkId: string,
  emailAddresses: Array<{ email_address: string }>,
  firstName?: string,
  lastName?: string,
  imageUrl?: string
): Promise<void> => {
  try {
    const newUser = new UserModel({
      clerkId,
      email: emailAddresses[0].email_address,
      firstName,
      lastName,
      imageUrl,

      role: userConstant.USER_ROLES.USER,
    });

    await newUser.save();
    console.log(`✅ User created in MongoDB: ${clerkId}`);
  } catch (error: any) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};

const handleUserUpdated = async (
  clerkId: string,
  emailAddresses: Array<{ email_address: string }>,
  firstName?: string,
  lastName?: string,
  imageUrl?: string
): Promise<void> => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { clerkId },
      {
        email: emailAddresses[0].email_address,
        firstName,
        lastName,
        imageUrl,
      },
      { new: true }
    );

    if (updatedUser) {
      console.log(`✅ User updated in MongoDB: ${clerkId}`);
    } else {
      console.warn(`⚠️ User not found for update: ${clerkId}`);
    }
  } catch (error: any) {
    console.error('Error updating user:', error.message);
    throw error;
  }
};

const handleUserDeleted = async (clerkId: string): Promise<void> => {
  try {
    const deletedUser = await UserModel.findOneAndDelete({ clerkId });

    if (deletedUser) {
      console.log(`✅ User deleted from MongoDB: ${clerkId}`);
    } else {
      console.warn(`⚠️ User not found for deletion: ${clerkId}`);
    }
  } catch (error: any) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
};

const protectedHandler = catchAsync(async (_req, res) => {
  sendSuccessResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Access to protected route granted',
    data: { info: 'This is protected data' },
  });
});

export const authController = {
  handleClerkWebhook,
  protectedHandler,
};
