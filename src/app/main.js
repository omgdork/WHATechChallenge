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
          $ctrl.analyzeUnsettledBets();
        }

        $ctrl.$scope.$apply();
      };

      reader.readAsText(file);
    }
  }

  getUserBets() {
    const userBets = {};

    // create customer betting history.
    this.bets.settled.forEach((bet) => {
      if (!(bet.customerId in userBets)) {
        userBets[bet.customerId] = [];
      }

      userBets[bet.customerId].push(bet);
    });

    return userBets;
  }

  analyzeWinningRates() {
    const unusualWinningRates = [];
    const userBets = this.getUserBets();

    // calculate each customer's winning rate.
    Object.keys(userBets).forEach((customer) => {
      const customerBets = userBets[customer];
      const winningBets = customerBets.filter((bet) => {
        return bet.win > 0;
      }).length;
      const winningRate = winningBets / customerBets.length;

      // flag customer's winning rate as unusual if greater than 60%.
      if (winningRate > 0.6) {
        unusualWinningRates.push({
          customerId: parseInt(customer, 10),
          winningRate: winningRate
        });
      }
    });

    this.bets.unusualWinningRates = unusualWinningRates;

    // re-analyze unsettled bets notes.
    if (this.bets.unsettled.length) {
      this.analyzeUnsettledBets();
    }
  }

  analyzeUnsettledBets() {
    const userBets = this.getUserBets();
    const customersWithUnusualWinningRates = this.bets.unusualWinningRates.map((customer) => {
      return customer.customerId;
    });

    // get customers' average bets.
    const customerAverageBets = {};
    Object.keys(userBets).forEach((customer) => {
      const customerBets = userBets[customer];
      let totalStake = 0;

      customerBets.forEach((bet) => {
        totalStake += bet.stake;
      });

      customerAverageBets[customer] = totalStake / customerBets.length;
    });

    // flag unsettled bets as risky.
    this.bets.unsettled.forEach((bet) => {
      bet.isRisky = false;
      bet.notes = [];

      // check if customer winning rate is unusual.
      if (customersWithUnusualWinningRates.indexOf(bet.customerId) > -1) {
        bet.isRisky = true;
        bet.notes.push('Customer with unusual winning rate.');
      }

      // check if bet is more than 10 times the customer's average bet
      // or 30 times the average bet and would win $1000 or more.
      if (bet.customerId.toString() in customerAverageBets
          && bet.stake > customerAverageBets[bet.customerId.toString()] * 10) {
        bet.isRisky = true;

        if (bet.stake > customerAverageBets[bet.customerId.toString()] * 30 && bet.toWin > 1000) {
          bet.notes.push('Stake is 30 times higher than the customer\'s average bet and amount to be won is more than $1000.');
        } else {
          bet.notes.push('Stake is 10 times higher than the customer\'s average bet.');
        }
      }
    });
  }
}

export const main = {
  template: require('./main.html'),
  controller: MainController
};
