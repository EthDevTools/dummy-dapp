<template>
  <div >
      <div class="flex">
        <div class="col name">Name</div>
        <div class="col time">Time</div>
        <div class="col grow-1">Parameters</div>
        <div class="col grow-1">Returns</div>
      </div>
      <log :key="log.id"  v-for="log in logs" :log="log" :result="results[log.id]" />
  </div>
</template>

<script>
  import Log from '@/components/Log'
  export default {
    name: 'Logs',
    props: {
      logs: {
        type: Array,
        default: []
      },
      results: {
        type: Object,
        default: {}
      }
    },
    components: {
      Log
    }
  }
</script>

<style >
.col {
  padding:10px;
}
.name, .time {
  flex-grow: 0;
}
.name {
  width: 150px;
}
.time {
    width: 100px;
}
 .horizontal {

 }
 .grow-1 {
   flex-grow: 1;
 }
</style>