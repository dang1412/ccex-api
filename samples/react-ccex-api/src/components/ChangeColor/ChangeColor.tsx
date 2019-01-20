import * as React from 'react';
import './ChangeColor.css';

interface IChangeColorProps {
  value: number;
}

interface IChangeColorState {
  stateClass: string;
}

export class ChangeColor extends React.Component<IChangeColorProps, IChangeColorState> {
  private timeout: NodeJS.Timeout;

  public componentDidUpdate(prevProps: IChangeColorProps) {
    if (prevProps.value < this.props.value) {
      this.setState({ stateClass: ' highlight-up' });
    } else if (prevProps.value > this.props.value) {
      this.setState({ stateClass: ' highlight-down' });
    } else {
      return;
    }

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ stateClass: '' });
    }, 1200);
  }

  public render(): JSX.Element {
    const stateClass = this.state ? this.state.stateClass : '';

    return <span className={`element${stateClass}`}>
      {this.props.value}
    </span>;
  }
}
