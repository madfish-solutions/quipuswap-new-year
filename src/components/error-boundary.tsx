import { Component, ErrorInfo } from 'react';

import { ErrorBox } from './error-box';

export class ErrorBoundary extends Component {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('O_O', error, errorInfo);
    this.setState({
      error
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBox error={this.state.error || new Error('Something went wrong :(')} />;
    }

    return this.props.children;
  }
}
