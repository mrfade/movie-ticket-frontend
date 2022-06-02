<template>
  <div class="w-full max-w-screen-xl mx-auto px-8 py-16">
    <slot name="title"></slot>

    <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
      <slot></slot>
    </div>
  </div>
</template>
