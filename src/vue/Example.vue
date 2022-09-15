<template>
  <div>
    <button @click="increment()">Click me</button>
    <span>{{count}}</span>
  </div>
</template>

<script>
export default {
  name: "Example",
  data(){
    return {
      count: 0
    }
  },
  methods: {
    increment(){
      this.count++;
    }
  }
}
</script>

<style scoped>

</style>