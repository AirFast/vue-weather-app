<template>
  <div class="loader-container">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.loader {
  border: 6px solid var(--main-gray-color);
  border-top: 6px solid #f3f3f3;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
