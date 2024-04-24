import HttpService from '@/services/http';

export default {
  index(params) {
    return HttpService.get('posts', { params });
  },
  show(id) {
    return HttpService.get(`posts/${id}`);
  },
  create(data) {
    return HttpService.post('posts', data);
  },
  change(id, data) {
    return HttpService.patch(`posts/${id}`, data);
  },
  delete(id) {
    return HttpService.delete(`posts/${id}`);
  }
};
