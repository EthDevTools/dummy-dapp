<template>
  <div >
      <div class="flex">
        <div class="col name">Name</div>
        <div class="col time">Time</div>
        <div class="col grow-1 mx2">Parameters</div>
        <div class="col grow-1 mx2">Returns</div>
      </div>
      <template v-for="(log, i) in logs">
        <log
        :i="i"
        :logs="logs"
        :results="results"
        :isRepeat="repeat"
        :key="log.id"
        :log="log"
        :result="results[log.id]"
        :nextIsRepeat="repeat(i + 1)"
        v-if="!repeat(i)" />
      </template>
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
    methods: {
      repeat (i) {

        let curr = this.logs[i]
        if (!curr) return false
        let prev = this.logs.length >= i ? this.logs[i -1] : null

        if (!prev) return false
        return prev.method === curr.method
          && JSON.stringify(prev.params) === JSON.stringify(curr.params)
          && this.results[curr.id]
          && this.results[prev.id]
          && JSON.stringify(this.results[curr.id].params) === JSON.stringify(this.results[prev.id].params)
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
  font-size: 14px;
}
.name, .time {
  flex-grow: 0;
}
.name {
  width: 200px;
}
.time {
    width: 200px;
}
 .horizontal {

 }
 .grow-1 {
   flex-grow: 1;
 }
</style>