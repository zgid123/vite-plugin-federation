<template>
  <div>
    <h3>router-remote App</h3>
    <ElementPlus/>
  </div>
</template>

<script>
import {ref} from "vue";
import ElementPlus from "./components/ElementPlus.vue";

export default {
  components: {
    ElementPlus
  },
  setup() {
    const count = ref(0);
    const inc = () => {
      count.value++;
    };

    return {
      count,
      inc,
    };
  },
};
</script>

<style scoped>
h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
