import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UserService {
  private readonly UID = 'u-s4t2ud-f875c77cc5375ea27c21260ab3502522a53ce0684c155f50a7f09d44c460da6f';
  private readonly SECRET = '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';
  private readonly apiUrl = 'https://api.intra.42.fr';

  async fetchUserInfo(userId: string) {
    try {
      const response = await axios.post(`${this.apiUrl}/oauth/token`, {
        grant_type: 'client_credentials',
        client_id: this.UID,
        client_secret: this.SECRET,
      });
      const accessToken = response.data.access_token;
      const userResponse = await axios.get(`${this.apiUrl}/v2/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return userResponse.data;
    }
    catch (error) {
      console.error('Error fetching user info:', error.response.data);
      throw error;
    }
  }
}
