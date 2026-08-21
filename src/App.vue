<template>
  <nav class="navbar navbar-expand-md bg-body-tertiary border-bottom">
    <div class="container-md">
      <RouterLink class="navbar-brand fw-semibold" to="/">Vue Boilerplate</RouterLink>
      <div class="navbar-nav flex-row gap-1">
        <RouterLink class="btn px-3" to="/">Home</RouterLink>
        <RouterLink class="btn px-3" to="/about">About</RouterLink>
      </div>
    </div>
  </nav>
  <div class="container-md py-4">
    <RouterView />
  </div>
</template>

<style scoped></style>
