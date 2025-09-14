import TodoList from "../components/app/landing_page/TodoList"


export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto p-6 md:max-h-screen">
      {/* Main article - spans 2 columns on larger screens */}
      <article className="md:col-span-2 lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden ">
        <div className="h-64 bg-gray-200"></div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Featured Story</h1>
          <p className="text-gray-600">Main article content goes here...</p>
        </div>
      </article>

      {/* Sidebar articles */}
      <aside className="md:col-span-1 lg:col-span-1 space-y-4">
        <article className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-2">Breaking News</h3>
          <p className="text-sm text-gray-600">Latest updates...</p>
        </article>
        <article className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-2">Trending</h3>
          <p className="text-sm text-gray-600">Popular stories...</p>
        </article>
      </aside>

      {/* Additional content area */}
      <section className="md:col-span-3 lg:col-span-1 bg-white rounded-lg shadow-md p-4">
        <h2 className="font-bold mb-4">More Stories</h2>
        <div className="space-y-3">
          <div className="border-b pb-2">
            <h4 className="text-sm font-medium">Article Title</h4>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
          <div className="border-b pb-2">
            <h4 className="text-sm font-medium">Another Article</h4>
            <p className="text-xs text-gray-500">4 hours ago</p>
          </div>
        </div>
          {/* TODO: This is to become 24hour-ai.com but with ollama and chatbot integrations. */}
          <TodoList />
      </section>
    </div>
  )
}
