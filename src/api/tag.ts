import HttpService from '@/services/http';

export default {
  index(params) {
    return HttpService.get('tags', { params });
  },
  create(data) {
    return HttpService.post('tags', data);
  },
  update(id, data) {
    return HttpService.put(`tags/${id}`, data);
  },
  delete(id) {
    return HttpService.delete(`tags/${id}`);
  }
};
