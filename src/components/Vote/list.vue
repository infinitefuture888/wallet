<template>
  <div class="create-container">
    <VotePage :voteList="proposalList"></VotePage>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import VotePage from "@/views/VoteMain.vue";
export default {
  name: "voteList",
  computed: {
    ...mapState("gov", ["proposalList"])
  },
  components: {
    VotePage
  },
  methods: {},
  mounted() {
    this.$store.dispatch("gov/list", {});
  }
};
</script>

<style lang="scss" scoped>
.create-container {
  width: 100%;
}
</style>