/**
 * This file ensures that all components use the same instance of React.
 * It's a workaround for the "Invalid hook call" error in Next.js apps
 * that can happen due to multiple React instances.
 */
const React = require('react');

// Check if React is properly initialized
if (!React || typeof React !== 'object') {
  throw new Error('React is not properly initialized in react-shim.js');
}

// Ensure all the necessary APIs are present
if (!React.useReducer || !React.useState || !React.useEffect) {
  throw new Error('React hooks APIs are missing in react-shim.js');
}

// Export the same React instance to be imported by other files
module.exports = React; 