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
            return false
        }
    },

    async getAllAvailableReports(){
      try{
        const path = URL+"/api/reports/lists"
        const options = {method: 'GET', url:path}
        const {data} = await axios.request(options)
        return JSON.parse(data.reports)
      }catch(error){
        console.error('Error fetching data:', error);
        return false
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
        return false
      }
    },

    async getWeeklyReport(){
      try{
        const path = URL+"/api/reports/week_report"
        const options = {method: 'GET', url:path}
        const {data} = await axios.request(options)
        return JSON.parse(data)
      }catch(error){
        console.error('Error fetching data:', error);
        return false
      }
    },

    async getListCompanies(){
      try{
        const path = URL + "/api/list_companies"
        const options = {method: 'GET', url:path}
        const {data} = await axios.request(options)
        return JSON.parse(data)
      }catch(error){
        console.error('Error fetching data:', error);
        return false
      }
    },

    async getDataForComapnies(symbols,from, to){
      try{
        const path = URL+"/api/reports/search"
        const body = { "symbol": symbols, "from": from, "to": to}
        const options = {method: 'POST', data: body, url:path}
        const {data} = await axios.request(options)
        return JSON.parse(data)
      }catch(error){
        console.error('Error fetching data:', error);
        return false
      }
    },
  };

export default httpUtils