<template>
  <Content />
  <Button />
  <UnusedButton />
  <hr />
  <home-images />
  <home-content />
  <home-button />
  <home-element-plus />
  <hr />
  <css-modules-button />
  <hr />
  <common-lib-element />
  <common-lib-counter />
</template>

<script>
import Content from "./components/Content.vue";
import Button from "./components/Button.js";
import UnusedButton from "./components/UnusedButton.vue";
export default {  components: {
    Content,
    Button,
    UnusedButton,
  },};
</script>

<style scoped>
img {
  width: 200px;
}
</style>
