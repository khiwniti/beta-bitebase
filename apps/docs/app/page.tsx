export default function DocsHomePage() {
  return (
    <div className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BiteBase Documentation
          </h1>
          <p className="text-xl text-gray-600">
            Complete guide to using the BiteBase Geospatial SaaS Platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Getting Started */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
            <p className="text-gray-600 mb-4">
              Learn how to set up and configure BiteBase for your restaurant market research needs.
            </p>
            <a href="#getting-started" className="text-blue-600 hover:text-blue-800 font-medium">
              Read more →
            </a>
          </div>

          {/* API Reference */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">API Reference</h3>
            <p className="text-gray-600 mb-4">
              Complete API documentation for integrating with BiteBase services.
            </p>
            <a href="#api-reference" className="text-blue-600 hover:text-blue-800 font-medium">
              Read more →
            </a>
          </div>

          {/* User Guide */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">📖</div>
            <h3 className="text-lg font-semibold mb-2">User Guide</h3>
            <p className="text-gray-600 mb-4">
              Step-by-step tutorials for using BiteBase features and tools.
            </p>
            <a href="#user-guide" className="text-blue-600 hover:text-blue-800 font-medium">
              Read more →
            </a>
          </div>

          {/* Architecture */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏗️</div>
            <h3 className="text-lg font-semibold mb-2">Architecture</h3>
            <p className="text-gray-600 mb-4">
              Understanding the technical architecture and system design.
            </p>
            <a href="#architecture" className="text-blue-600 hover:text-blue-800 font-medium">
              Read more →
            </a>
          </div>

          {/* Deployment */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold mb-2">Deployment</h3>
            <p className="text-gray-600 mb-4">
              Deploy BiteBase to production environments with confidence.
            </p>
            <a href="#deployment" className="text-blue-600 hover:text-blue-800 font-medium">
              Read more →
            </a>
          </div>

          {/* Support */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🆘</div>
            <h3 className="text-lg font-semibold mb-2">Support</h3>
            <p className="text-gray-600 mb-4">
              Get help, report issues, and connect with the community.
            </p>
            <a href="#support" className="text-blue-600 hover:text-blue-800 font-medium">
              Read more →
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">For Developers</h3>
              <ul className="space-y-1 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">API Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600">SDK Reference</a></li>
                <li><a href="#" className="hover:text-blue-600">Code Examples</a></li>
                <li><a href="#" className="hover:text-blue-600">Contributing Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Users</h3>
              <ul className="space-y-1 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">User Manual</a></li>
                <li><a href="#" className="hover:text-blue-600">Video Tutorials</a></li>
                <li><a href="#" className="hover:text-blue-600">Best Practices</a></li>
                <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
