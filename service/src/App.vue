<template>
  <div id="app">
    <keep-alive include="addPage">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body{
  margin: 0;
}
</style>
