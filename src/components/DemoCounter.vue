<script setup>
import { useCounter } from "@/composables/useCounter";

const { count, increment, decrement, reset } = useCounter();
</script>

<template>
  <div class="card">
    <div class="card-body text-center">
      <h5 class="card-title mb-3">Counter Demo</h5>
      <p class="display-4 mb-4">{{ count }}</p>
      <div class="d-flex justify-content-center gap-2">
        <button class="btn btn-outline-secondary" @click="decrement">−</button>
        <button class="btn btn-primary" @click="increment">+</button>
        <button class="btn btn-outline-danger" @click="reset">Reset</button>
      </div>
      <p class="text-muted mt-3 small">Count is persisted to IndexedDB with Dexie.</p>
    </div>
  </div>
</template>
