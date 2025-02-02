const Utils = {
  transformDataForChart(data) {
    const groupedData = {};
    const dates = new Set();

    data.forEach((item) => {
      const formattedDate = new Date(item.date.$date)
        .toISOString()
        .split("T")[0];
      dates.add(formattedDate);
      if (!groupedData[item.symbol]) {
        groupedData[item.symbol] = [];
      }

      groupedData[item.symbol].push(item.last_price);
    });

    return {
      companies: Object.keys(groupedData),
      data: Object.values(groupedData),
      dates: Array.from(dates),
    };
  },

  hasValue(val){
    if(val === undefined || val === '' ){
      return true
    }else{
      return false
    }
  }
};

export default Utils;
