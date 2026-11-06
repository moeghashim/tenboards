import { Component, type ReactNode } from "react";

export class ResponseBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p role="status">This response could not be displayed. Try another example.</p>
    ) : (
      this.props.children
    );
  }
}
