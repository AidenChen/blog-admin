import HttpService from '@/services/http';

export default {
  login(data) {
    return HttpService.post('auth/login', data);
  }
};
