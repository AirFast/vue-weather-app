<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const { isOpen } = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close'])

const target = ref(null)
onClickOutside(target, () => emit('close'))
</script>

<template>
  <div v-if="isOpen" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" ref="target">
        <div class="modal-header">
          <h2>
            <slot name="header" />
          </h2>
        </div>
        <div class="modal-body">
          <slot name="content" />
        </div>
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  display: flex;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.modal-mask::after {
  content: '';
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: var(--main-dark-color);
  opacity: 0.8;
  z-index: -1;
}

.modal-container {
  width: 400px;
  margin: auto;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  text-align: center;
}

.dark .modal-container {
  color: #fff;
  background: var(--main-dark-gray-color);
}

h2 {
  margin: 0;
}

.modal-body {
  margin: 30px 0;
}
</style>
