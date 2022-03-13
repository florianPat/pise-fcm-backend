import { FirebaseAdminService } from './firebase-admin/firebase-admin.service';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import ChatQuery from './interfaces/chat-query';

@Controller()
export class AppController {
  constructor(private readonly firebaseService: FirebaseAdminService) {}

  @Post()
  async sendNotification(@Body() chatQuery: ChatQuery) {
    try {
      // TODO: Add auth check. With a key in the header? Think about that!

      const chat = await this.firebaseService.getChat(chatQuery);

      await this.firebaseService.sendNotificationToTokens(
        chat.member_tokens,
        'Neue Nachricht in ' + chat.chat_name + '!',
        chat.message.from_username + ' hat eine neue Nachricht verschickt!',
        'https://pise.vercel.app/img/icons/android-chrome-512x512.png',
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
