<template>
  <div class="flex">
    <div class="col name">{{name}}</div>
    <div class="col time">{{time}}</div>
    <div class="col params">
      <vue-json-pretty
        v-if="params"
        :deep="deep"
        :data="params"
        @click="handleClick"
        >
      </vue-json-pretty>
    </div>
    <div class="col returns">
      <vue-json-pretty
        v-if="returns"
        :deep="deep"
        :data="returns"
        @click="handleClick"
        >
      </vue-json-pretty>
    </div>
  </div>
</template>

<script>
import {format, differenceInMilliseconds} from 'date-fns'
import VueJsonPretty from 'vue-json-pretty'

export default {
  name: 'Log',
  props: {
    log: {
      type: Object,
      default: null
    },
    result: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      deep: 1
    }
  },
  methods: {
    handleClick (e) {
      console.log('handleClick')
      console.log(e)
    }
  },
  computed: {
    params () {
      return this.log.params
    },
    returns () {
      return this.result && this.result.params
    },
    name () {
      let name = this.log.name ? this.log.name + ' (' : this.log.method
      return this.log.name ? name + this.log.method + ')' : name
    },
    time () {
      let time = format(this.log.time, 'HH:mm:ss.SSS')
      if (this.result) {
        var difference = differenceInMilliseconds(
          this.result.time,
          this.log.time
        )
        time += ' (+' + difference + 'ms)'
      }
      return time
    }
  },
  components: {
    VueJsonPretty
  }
}
</script>


<style>

.params, .returns {
  border: 1px solid grey;
  flex-grow: 1;
   word-wrap: break-word;         /* All browsers since IE 5.5+ */
  overflow-wrap: break-word;
}
</style>
