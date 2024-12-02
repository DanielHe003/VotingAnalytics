import axios from 'axios';

class ApiService {
  constructor(baseUrl = 'http://localhost:8080') {
    this.baseUrl = baseUrl;
  }

  async fetchData(endpoint) {
    try {
      const { data } = await axios.get(`${this.baseUrl}/${endpoint}`);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async fetchMapData(stateId) {
    return this.fetchData(`states/${stateId}/districtmaps`);
  }

  async fetchStateSummary(state) {
    return this.fetchData(`states/${state}`);
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;
