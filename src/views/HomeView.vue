<script setup>
import DemoCounter from "@/components/DemoCounter.vue";
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h1 class="mb-2">Vue 3 Boilerplate</h1>
      <p class="text-muted mb-4">A starter template with Vue 3, Vue Router, Bootstrap 5, Sass, PWA support, and Vitest.</p>

      <DemoCounter class="mb-4" />

      <div class="card">
        <div class="card-body">
          <h6 class="card-title">Patterns in this template</h6>
          <ul class="mb-0 ps-3">
            <li><strong>Dexie + IndexedDB persistence</strong> — reactive counter state survives page reloads and browser restarts</li>
            <li><strong>Lazy-loaded routes</strong> — <code>AboutView</code> is loaded on demand via dynamic <code>import()</code></li>
            <li><strong>Bootstrap 5 via Sass</strong> — full Bootstrap imported through <code>src/scss/styles.scss</code> using the <code>~bootstrap</code> alias</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
