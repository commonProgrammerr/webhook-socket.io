import Request from '../models/Request';

export default {
  render(request: Request) {
    
    return request;
  },

  renderMany(requests: Request[]) {
    return requests.map((request) => this.render(request));
  },

  feed(requests: Request[]) {
    return requests.map((request) => {
      return {
        id: request.id,
        local: request.local,
        piso: request.piso,
        box: request.box,
        type: request.type
      }
    });
  }
};