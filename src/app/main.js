class MainController {
  constructor($scope) {
    this.$scope = $scope;
    this.bets = {
      settled: [],
      unsettled: [],
      unusualWinningRates: []
    };
  }

  parseData(e) {
    const $ctrl = this.$ctrl;
    const file = e.target.files[0];
    const betType = e.target.attributes['bet-type'].value;

    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const data = event.target.result;
        const allRows = data.split(/\r\n|\n/);
        const headers = allRows[0].split(',');
        const entries = [];
        const setEntryKey = function (header) {
          switch (header.toLowerCase()) {
            case 'customer':
              return 'customerId';
            case 'event':
              return 'eventId';
            case 'participant':
              return 'participantId';
            case 'stake':
              return 'stake';
            case 'win':
              return 'win';
            case 'to win':
              return 'toWin';
          }
        };

        for (let i = 1, length = allRows.length; i < length; i += 1) {
          if (!allRows[i].length) { // if row is blank, skip.
            continue;
          }

          const rowData = allRows[i].split(',');
          const entry = {};

          for (let j = 0; j < headers.length; j += 1) {
            entry[setEntryKey(headers[j])] = parseFloat(rowData[j]);
          }

          entries.push(entry);
        }

        if (betType === 'settled') {
          $ctrl.bets.settled = entries;
          $ctrl.analyzeWinningRates();
        } else {
          $ctrl.bets.unsettled = entries;
        }

        $ctrl.$scope.$apply();
      };

      reader.readAsText(file);
    }
  }

  analyzeWinningRates() {
    const unusualWinningRates = [];
    const userBets = {};

    // create customer betting history
    this.bets.settled.forEach((bet) => {
      if (!(bet.customerId in userBets)) {
        userBets[bet.customerId] = [];
      }

      userBets[bet.customerId].push(bet);
    });

    // calculate each customer's winning rate
    Object.keys(userBets).forEach((customer) => {
      const customerBets = userBets[customer];
      const winningBets = customerBets.filter((bet) => {
        return bet.win > 0;
      }).length;
      const winningRate = winningBets / customerBets.length;

      console.log(winningRate, customer);

      if (winningRate > 0.6) {
        unusualWinningRates.push({
          customerId: customer,
          winningRate: winningRate
        });
      }
    });

    this.bets.unusualWinningRates = unusualWinningRates;
  }
}

export const main = {
  template: require('./main.html'),
  controller: MainController
};
