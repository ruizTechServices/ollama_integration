import TodoList from "../components/app/landing_page/TodoList"


export default function Home() {
  return (
    <div className="overflow-hidden flex flex-col items-center justify-center">
      {/* TODO: This is to become 24hour-ai.com but with ollama and chatbot integrations. */}
      <TodoList />
    </div>
  )
}
