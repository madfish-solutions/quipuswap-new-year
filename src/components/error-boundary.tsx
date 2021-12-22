import { Component, ErrorInfo } from 'react';

export class ErrorBoundary extends Component {
  state: { hasError: boolean } = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('O_O', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>O_O Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
