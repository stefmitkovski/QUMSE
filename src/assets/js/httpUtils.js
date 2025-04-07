import axios from "axios";
import Utils from "./Utils";

// const URL = "http://localhost:5000";
const IP = "localhost";

const httpUtils = {

  setIPAddreess(val){
    if(Utils.isLocalhost(val) || Utils.isValidIP(val)){
      this.URL = `http://${val}:5000`
    }else{
      this.URL = val
    }
    console.log("URL: " + this.URL)
  },

  getIPAddress(){
    return IP
  },

    async getLatestTradedStocksReport() {
        try {
            const path = this.URL+"/api/reports/current";
            const options = { method: 'GET', url: path, timeout: 5000};
            const {data} = await axios.request(options)
            return JSON.parse(data)
          } catch (error) {
            console.error('getLatestTradedStocksReport(Error fetching data):', error);
            return false
        }
    },

    async getAllAvailableReports(){
      try{
        const path = this.URL+"/api/reports/lists"
        const options = {method: 'GET', url:path, timeout: 5000}
        const {data} = await axios.request(options)
        return JSON.parse(data.reports)
      }catch(error){
        console.error('getAllAvailableReports(Error fetching data):', error);
        return false
      }
    },

    async getSpecificReport(date){
      try{
        const path = this.URL+"/api/reports/search"
        const body = { "from": date, "to": date, }
        const options = {method: 'POST', data: body, url:path, timeout: 5000}
        const {data} = await axios.request(options)
        return JSON.parse(data)
      }catch(error){
        console.error('getSpecificReport(Error fetching data):', error);
        return false
      }
    },

    async getDataForComapnies(symbol, from, to){
      try{
        const path = this.URL+"/api/reports/search"
        const body = { "symbol":symbol, "from": from, "to": to }
        const options = {method: 'POST', data: body, url:path, timeout: 5000}
        const {data} = await axios.request(options)
        return JSON.parse(data)
      }catch(error){
        console.error('getSpecificReport(Error fetching data):', error);
        return false
      }
    },

    async getWeeklyReport(){
      try{
        const path = this.URL+"/api/reports/week_report"
        const options = {method: 'GET', url:path, timeout: 5000}
        const {data} = await axios.request(options)
        return JSON.parse(data)
      }catch(error){
        console.error('getWeeklyReport(Error fetching data):', error);
        return false
      }
    },

    async getListCompanies(){
      try{
        const path = this.URL + "/api/list_companies"
        const options = {method: 'GET', url:path, timeout: 5000}
        const {data} = await axios.request(options)
        return JSON.parse(data)
      }catch(error){
        console.error('getListCompanies(Error fetching data):', error);
        return false
      }
    },

    async getLiveInformations(){
      try{
        const path = this.URL + "/api/reports/latest"
        const options = {method: 'GET', url: path, timeout: 5000}
        const {data} = await axios.request(options)
        return data
      }catch(error){
        console.error('getLiveInformations(Error fetching data):',error)
        return false
      }
    }

    // async pingServer() {
    //   try {
    //     const options = {
    //       method: 'GET',
    //       url: this.URL,
    //       timeout: 5000,
    //     };
    
    //     const { data } = await axios.request(options);
    //     console.log('Server response:', data);
    //     return true;
    //   } catch (error) {
    //     console.error('Error pinging server:', error);
    //     return false;
    //   }
    // },
  };

export default httpUtils