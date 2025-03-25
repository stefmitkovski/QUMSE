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
      const formattedDate = new Date(item.date.$date)
        .toISOString()
        .split("T")[0];
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
      result[field] = Object.keys(groupedData).map(
        (symbol) => groupedData[symbol][field]
      );
    });
    console.log(result);
    return result;
  },

  hasValue(val) {
    if (val === undefined || val === "" || val === null) {
      return false;
    } else {
      return true;
    }
  },

  isValidIPOrDomainOrLocalhost(val){
    return this.isValidIP(val) || this.isValidDomain(val) || this.isLocalhost(val)
  },

  isValidIP(val) {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
    return ipRegex.test(val);
  },

  isValidDomain(val) {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/;
    return domainRegex.test(val);
  },

  isLocalhost(val) {
    const localhostRegex = /^(localhost|localhost:\d{1,5})$/;
    return localhostRegex.test(val);
  },
};

export default Utils;
