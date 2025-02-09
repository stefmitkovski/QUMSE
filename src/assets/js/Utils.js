const Utils = {
  transformDataForChart(data) {
    const groupedPrices = {};
    const groupedQuantities = {};
    const dates = new Set();

    data.forEach((item) => {
      const formattedDate = new Date(item.date.$date)
        .toISOString()
        .split("T")[0];
      dates.add(formattedDate);

      if (!groupedPrices[item.symbol]) {
        groupedPrices[item.symbol] = [];
        groupedQuantities[item.symbol] = [];
      }

      groupedPrices[item.symbol].push(item.last_price);
      groupedQuantities[item.symbol].push(item.quantity);
    });

    // console.log("Companies: " + Object.keys(groupedPrices) + "\n")
    // console.log("Last Price: " + Object.keys(groupedPrices).map(
    //   (symbol) => groupedPrices[symbol] || []
    // ) + "\n")
    // console.log("Quantities: " + Object.keys(groupedQuantities).map(
    //   (symbol) => groupedQuantities[symbol] || []
    // ) + "\n")
    // console.log("Dates: " + Array.from(dates) + "\n")
    return {
      companies: Object.keys(groupedPrices),
      last_prices: Object.keys(groupedPrices).map(
        (symbol) => groupedPrices[symbol] || []
      ),
      quantities: Object.keys(groupedQuantities).map(
        (symbol) => groupedQuantities[symbol] || []
      ),
      dates: Array.from(dates),
    };
  },

  transformDataForDownload(selected, data) {
      const groupedData = {};
      const dates = new Set();
    
      data.forEach((item) => {
        const formattedDate = new Date(item.date.$date).toISOString().split("T")[0];
        dates.add(formattedDate);
    
        if (!groupedData[item.symbol]) {
          groupedData[item.symbol] = {};
          selected.forEach((field) => {
            groupedData[item.symbol][field] = [];
          });
        }
    
        selected.forEach((field) => {
          groupedData[item.symbol][field].push(item[field] ?? 0);
        });
      });
    
      const formattedDates = Array.from(dates).sort();
    
      const result = {
        companies: Object.keys(groupedData),
        dates: formattedDates,
      };
    
      selected.forEach((field) => {
        result[field] = Object.keys(groupedData).map((symbol) => groupedData[symbol][field]);
      });
      console.log(result)
      return result;
  },

  hasValue(val) {
    if (val === undefined || val === "") {
      return true;
    } else {
      return false;
    }
  },
};

export default Utils;
