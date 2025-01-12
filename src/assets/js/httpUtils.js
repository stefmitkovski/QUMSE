import axios from "axios";

const URL = "http://localhost:5000";

const httpUtils = {
    async getLatestTradedStocks() {
        try {
            const path = URL+"/api/reports/latest";
            const options = { method: 'GET', url: path };
            const {data} = await axios.request(options)
            return JSON.parse(data)
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    },

    async getAllAvailableReports(){
      try{
        const path = URL+"/api/reports/lists"
        const options = {method: 'GET', url:path}
        const {data} = await axios.request(options)
        return data.reports
      }catch(error){
        console.error('Error fetching data:', error);
      }
    },

    async getSpecificReport(date){
      try{
        const path = URL+"/api/reports/search"
        const body = { "from": date, "to": date}
        const options = {method: 'POST', data: body, url:path}
        const {data} = await axios.request(options)
        return JSON.parse(data)
      }catch(error){
        console.error('Error fetching data:', error);
      }
    }
  };

export default httpUtils