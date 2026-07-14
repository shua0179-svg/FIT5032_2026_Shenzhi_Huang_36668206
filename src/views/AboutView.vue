<template>
  <div class="about container mt-5">
    <h1>About This Library Application</h1>
    <p class="lead">
      This is a protected page. You can only see it after logging in, thanks to
      conditional (secure) routing implemented with a Vue Router navigation guard.
    </p>
    <p>
      The FIT5032 Library web application lets users submit their information
      through a validated form and displays submitted users in a PrimeVue
      DataTable.
    </p>
  </div>
</template>

<style>
.about {
  min-height: 60vh;
}
</style>
