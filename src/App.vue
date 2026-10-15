<script setup>
import { Utensils } from "@lucide/vue";
import { Button } from "@/components/ui/button";
</script>

<template>
  <header class="border-b bg-card">
    <div
      class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8"
    >
      <RouterLink to="/" class="flex items-center gap-2 font-semibold">
        <Utensils class="size-5 text-primary" aria-hidden="true" />
        Meal Planner
      </RouterLink>
      <nav aria-label="Main navigation" class="flex gap-1">
        <Button as-child variant="ghost">
          <RouterLink
            to="/"
            exact-active-class="bg-accent text-accent-foreground"
            >Home</RouterLink
          >
        </Button>
        <Button as-child variant="ghost">
          <RouterLink
            to="/about"
            exact-active-class="bg-accent text-accent-foreground"
            >About</RouterLink
          >
        </Button>
      </nav>
    </div>
  </header>
  <main class="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
    <RouterView />
  </main>
</template>
