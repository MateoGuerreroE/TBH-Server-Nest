import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from 'src/modules/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}
  onModuleInit() {
    if (!admin.apps.length) {
      const firebaseConfig = this.configService.getFirebaseConfig();
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      });
    }
  }

  async verifyToken(token: string) {
    return admin.auth().verifyIdToken(token);
  }

  getAuth() {
    return admin.auth();
  }
}
