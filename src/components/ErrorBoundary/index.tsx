import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "../ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReturnHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <h1 className="text-2xl font-bold">Oops! An error happened</h1>

            {this.state.error && (
              <div className="bg-gray-100 p-4 rounded text-left">
                <pre className="text-sm text-red-600 whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <Button onClick={this.handleReturnHome} className="w-full">
              Return to Homepage
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
