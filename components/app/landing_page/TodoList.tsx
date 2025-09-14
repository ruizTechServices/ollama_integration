// todo: create a todo list component that is stateless, uses Supabase as the database, and a table in Supabase to store the todo items. This todo list component must be a radio button with the list items from the database table. the table items must be inputted from this component, as well. This component will be displayed in the frontend, code accordingly. This is a component so this component can be called anywhere throughout the app. This is a checklist component that "darkens" checked off items and displays items from the todo list table. items can be added to the table from this component from the frontend. This component is being displayed in `page.tsx` the main page.

"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/clients/supabase/client"
import { Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Todo = {
  id: string
  title: string
  completed: boolean
  created_at: string
}

export default function TodoList() {
  const supabase = createClient()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState("")
  const [adding, setAdding] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 4
  const [totalCount, setTotalCount] = useState(0)

  const fetchTodos = async () => {
    setLoading(true)
    setError(null)
    const offset = (page - 1) * pageSize
    const { data, error, count } = await supabase
      .from("todos")
      .select("id, title, completed, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1)
    if (error) {
      setError(error.message)
    } else {
      setTodos((data || []) as Todo[])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTodos()
  }, [page])

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setAdding(true)
    setError(null)
    const { data, error } = await supabase
      .from("todos")
      .insert({ title: newTitle.trim() })
      .select()
      .single()
    if (error) {
      setError(error.message)
    } else if (data) {
      setNewTitle("")
      await fetchTodos()
    }
    setAdding(false)
  }

  const toggleCompleted = async (todo: Todo, checked: boolean | "indeterminate") => {
    const next = typeof checked === "boolean" ? checked : false
    setUpdatingId(todo.id)
    setError(null)
    // optimistic update
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, completed: next } : t)))
    const { error } = await supabase
      .from("todos")
      .update({ completed: next })
      .eq("id", todo.id)
    if (error) {
      setError(error.message)
      // rollback
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, completed: todo.completed } : t)))
    }
    setUpdatingId(null)
  }

  const deleteTodo = async (todo: Todo) => {
    setUpdatingId(todo.id)
    setError(null)
    // optimistic remove
    const prev = todos
    setTodos((p) => p.filter((t) => t.id !== todo.id))
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", todo.id)
    if (error) {
      setError(error.message)
      setTodos(prev)
    } else {
      await fetchTodos()
    }
    setUpdatingId(null)
  }

  // Realtime sync for inserts/updates/deletes
  useEffect(() => {
    const channel = supabase
      .channel("todos-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "todos" }, () => {
        // Re-fetch current page to keep list and count in sync
        fetchTodos()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <div className="w-full max-w-xl mx-auto p-4 border rounded-lg shadow">
      <form onSubmit={addTodo} className="flex gap-2">
        <Input
          placeholder="Add a task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Button type="submit" disabled={adding}>
          {adding ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" /> Adding
            </span>
          ) : (
            "Add"
          )}
        </Button>
      </form>

      {error && (
        <div className="text-sm text-destructive mt-3" role="alert">
          {error}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading...
          </div>
        ) : todos.length === 0 ? (
          <div className="text-sm text-muted-foreground">No tasks yet.</div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={(c) => toggleCompleted(todo, c)}
                  disabled={updatingId === todo.id}
                  aria-label={todo.title}
                />
                <span className={cn("text-sm", todo.completed && "line-through opacity-50")}> 
                  {todo.title}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-auto"
                  onClick={() => deleteTodo(todo)}
                  disabled={updatingId === todo.id}
                  aria-label={`Delete ${todo.title}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
        >
          Next
        </Button>
      </div>
    </div>
  )
}