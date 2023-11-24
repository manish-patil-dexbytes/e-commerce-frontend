import axios from 'axios';
import {API_URL} from './config';


class Request {
  
  constructor(api_url, params) {
    this.url = `${API_URL}${api_url}`;
    this.params = params;
    this.header = {};
  }
  
  async makeRequest(method) {
    try {
      const response = await axios[method](this.url, this.params, this.header);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async get() {
    return this.makeRequest('get');
  }

  async post() {
    return this.makeRequest('post');
  }

  async patch() {
    return this.makeRequest('patch');
  }

  async put() {
    return this.makeRequest('put');
  }

  async delete() {
    return this.makeRequest('delete');
  }
}

export default Request;