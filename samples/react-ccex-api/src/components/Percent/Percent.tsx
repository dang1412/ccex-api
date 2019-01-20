import * as React from 'react';
import './Percent.css';

interface IPerscentProps {
  change: number | undefined;
}

export const Percent: React.SFC<IPerscentProps> = (props) => {
  const change = props.change;
  if (change === undefined) {
    return <span />;
  }

  const className = change >= 0 ? 'percent-up' : 'percent-down'; 

  return <span className={className}>({(change * 100).toFixed(2)}%)</span>;
}
