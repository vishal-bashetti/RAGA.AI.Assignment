import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Raga AI SaaS Monorepo
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-[600px] mx-auto">
          Host application successfully scaffolded with Vite, React, TypeScript, Tailwind CSS v4, and shadcn/ui.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Button>Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
        </div>
      </div>
    </div>
  )
}

export default App
