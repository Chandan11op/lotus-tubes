import React from 'react';

/**
 * Robust Error Boundary to completely protect the app against blank white screens.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#home';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            maxWidth: '680px',
            margin: '60px auto',
            padding: '32px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1.5px solid #E3E8EF',
            boxShadow: '0 8px 24px rgba(16, 38, 61, 0.08)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚙️</div>
          <h2 style={{ color: '#10263D', marginBottom: '10px', fontSize: '1.4rem' }}>
            Component Display Interrupted
          </h2>
          <p style={{ color: '#667085', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6 }}>
            An unexpected display exception occurred while loading this view. The rest of the website remains active.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="btn btn--primary"
            style={{ padding: '10px 24px', fontWeight: 600 }}
          >
            Return to Catalogue Home &rarr;
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
