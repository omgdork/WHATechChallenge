# The Enterprise

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)

### How to Use
1. Clone the repository on your machine.
   1.1 On your command prompt, type: `git clone https://github.com/omgdork/WHATechChallenge.git`.
   1.2 Run `npm install` to install dependencies.
   1.3 Run `gulp serve` to start the server. `Go to http://localhost:3000`.

1. Download the CSV files included in the project (`Settled.csv`, `Unsettled.csv`).

2. Upload the `Settled.csv` file to the Settled Bets file upload control.

3. The Settled Bets table will be populated as well as the Unusual Winning Rate table if any.

4. Upload the `Unsettled.csv` file to the Unsettled Bets file upload control.

5. The Unsettled Bets table will be populated with the data from the file. Risky bets will be highlighted and will have notes.
