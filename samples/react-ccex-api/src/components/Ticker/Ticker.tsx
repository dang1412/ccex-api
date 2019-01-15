// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import Typography from '@material-ui/core/Typography';

import { Ticker } from 'ccex-api';
import * as React from 'react';

export interface ITickerProps {
  tickerData: Ticker;
  classes: {
    card: string;
    tableTd: string;
    tableTh: string;
  };
}

const styles = {
  card: {
    minWidth: 275,
  },
  tableTd: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold' as 'bold',
    padding: 5,
    textAlign: 'right' as 'right',
  },
  tableTh: {
    color: '#aaa',
    fontSize: 12,
    padding: 5,
    textAlign: 'left' as 'left',
  },
};

export const TickerComp: React.SFC<ITickerProps> = (props) => {
  const { classes } = props;
  const ticker = props.tickerData;

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <table>
            <tbody>
              <tr>
                <th className={classes.tableTh}>Price {displayPercent(ticker.change24Perc)}</th>
                <td className={classes.tableTd}>{ticker.last}</td>
                <th className={classes.tableTh}>Volume 24</th>
                <td className={classes.tableTd}>{ticker.vol}</td>
              </tr>
              <tr>
                <th className={classes.tableTh}>Bid</th>
                <td className={classes.tableTd}>{ticker.bid}</td>
                <th className={classes.tableTh}>Ask</th>
                <td className={classes.tableTd}>{ticker.ask}</td>
              </tr>
              <tr>
                <th className={classes.tableTh}>Low 24h</th>
                <td className={classes.tableTd}>{ticker.low}</td>
                <th className={classes.tableTh}>High 24h</th>
                <td className={classes.tableTd}>{ticker.high}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
          <Button variant="contained" color="primary">Hello World</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export const TickerCompWithStyles = withStyles(styles)(TickerComp);

function displayPercent(change24Perc: number | undefined): string {
  if (!change24Perc) {
    return '';
  }

  return `(${(change24Perc * 100).toFixed(2)}%)`;
}
