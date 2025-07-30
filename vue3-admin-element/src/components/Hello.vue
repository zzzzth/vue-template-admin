<template>
  <div>
    <h1 class="text-3xl font-bold">Hello World</h1>
    <button @click="count++">Increment:{{ count }}</button>
    <el-button type="success"><i-ep-SuccessFilled />Success</el-button>
  </div>
</template>

<script setup>
const count = ref(0)
</script>

<style></style>
