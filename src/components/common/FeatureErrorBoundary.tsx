import { Component, ReactNode, ErrorInfo } from "react";
import ErrorMessage from "./ErrorMessage";

interface Props {
    children: ReactNode;
    featureName: string;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class FeatureErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Error in ${this.props.featureName}:`, error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ErrorMessage
                    title={`Error in ${this.props.featureName}`}
                    message={this.state.error?.message || "Something went wrong"}
                    action={{
                        label: "Try again",
                        onClick: this.handleReset,
                    }}
                />
            );
        }

        return this.props.children;
    }
}

export default FeatureErrorBoundary;
