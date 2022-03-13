import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';
import ChatQuery from '../interfaces/chat-query';
import ChatQueryResult from '../interfaces/chat-query-result';

@Injectable()
export class FirebaseAdminService {
  constructor(protected configService: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: configService.get<string>('FIREBASE_PROJECT_ID', ''),
        clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL', ''),
        privateKey: configService
          .get<string>('FIREBASE_PRIVATE_KEY', '')
          .replace(/\\n/g, '\n'),
      }),
      databaseURL: configService.get<string>('FIREBASE_DATABASE_URL', ''),
    });
  }

  async sendNotificationToToken(
    token: string,
    title: string,
    body: string,
    imageUrl?: string,
  ) {
    return admin.messaging().send({
      token,
      notification: {
        title,
        body,
        imageUrl,
      },
    });
  }

  async sendNotificationToTokens(
    tokens: string[],
    title: string,
    body: string,
    imageUrl?: string,
  ) {
    return admin.messaging().sendMulticast({
      tokens,
      notification: {
        title,
        body,
        imageUrl,
      },
    });
  }

  async sendNotificationToTopic(
    topic: string,
    title: string,
    body: string,
    imageUrl?: string,
  ) {
    return admin.messaging().send({
      topic,
      notification: {
        title,
        body,
        imageUrl,
      },
    });
  }

  async databaseGet(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = admin.database().ref(path);

      ref.once(
        'value',
        (snapshot) => {
          if (!snapshot.exists()) {
            reject('no value at location ' + path);
            return;
          }

          resolve(snapshot.val());
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  async getChat(chatQuery: ChatQuery): Promise<ChatQueryResult> {
    const chat = await this.databaseGet('api/chats/' + chatQuery.chatUid);
    if (undefined === chat.messages[chatQuery.messageUid]) {
      throw new Error(
        'message with requested id ' +
          chatQuery.messageUid +
          ' does not exist in chat ' +
          chatQuery.chatUid,
      );
    }
    const message = chat.messages[chatQuery.messageUid];
    const member_tokens = [];
    for (const memberUid of chat.member_uids) {
      if (memberUid === message.from_uid) {
        continue;
      }

      try {
        member_tokens.push(
          await this.databaseGet(
            'api/users/' + memberUid + '/notificationToken',
          ),
        );
      } catch (error) {
        console.log('No notification token set for ' + memberUid);
      }
    }

    message.from_username = await this.databaseGet(
      'api/users/' + message.from_uid + '/username',
    );
    delete message.from_uid;

    let chat_name = chat.chat_name;
    if (undefined === chat_name) {
      chat_name = message.from_username;
    }

    return {
      chat_name,
      member_tokens,
      message,
    };
  }
}
