import { Injectable, OnModuleInit } from '@nestjs/common';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { ConfigService } from '../../config/index';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}
  onModuleInit() {
    if (!getApps().length) {
      const firebaseConfig = this.configService.getFirebaseConfig();
      initializeApp({
        credential: cert(firebaseConfig),
      });
    }
  }

  async verifyToken(token: string) {
    return getAuth().verifyIdToken(token);
  }

  getAuth() {
    return getAuth();
  }
}
