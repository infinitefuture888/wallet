<template>
  <div class="home-container">
    <div class="banner">
      <h1>
        {{$t('home.title')}}
      </h1>
      <h4>
        {{$t('home.banner')}}
      </h4>
      <el-button
        style="z-index:999 !important"
        round
        @click="getStarted"
      >{{$t('home.create')}}</el-button>
    </div>
    <div class="home-items">
      <div class="items">
        <div class="item">
          <img :src="icon1" />
          <h4>{{$t('home.itemTitle1')}}</h4>
          <div>{{$t('home.itemText1')}}</div>
        </div>
        <div class="item">
          <img :src="icon2" />
          <h4>{{$t('home.itemTitle2')}}</h4>
          <div>{{$t('home.itemText2')}}</div>
        </div>
        <div class="item">
          <img :src="icon3" />
          <h4>{{$t('home.itemTitle3')}}</h4>
          <div>{{$t('home.itemText3')}}</div>
        </div>
        <div class="item">
          <img :src="icon4" />
          <h4>{{$t('home.itemTitle4')}}</h4>
          <div>{{$t('home.itemText4')}}</div>
        </div>
      </div>
    </div>

    <div class="home-links">
      <a
        class="link"
        href="#"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'telegram-plane']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="#"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'twitter']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="#"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'medium']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="#"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'reddit-alien']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="#"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'linkedin']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="#"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'facebook']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="#"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'weibo']"
          size="2x"
        />
      </a>
      <a
        class="link"
        v-popover:popover
        href="javascript:;"
      >
        <font-awesome-icon
          :icon="['fab', 'weixin']"
          size="2x"
        />
      </a>
      <el-popover
        placement="top"
        ref="popover"
        trigger="hover"
      >
        <!-- <img
          src="@/assets/wx.jpeg"
          width='200'
          height='200'
        /> -->
      </el-popover>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import icon1 from "@/assets/icon-home-1.svg";
import icon2 from "@/assets/icon-home-2.svg";
import icon3 from "@/assets/icon-home-3.svg";
import icon4 from "@/assets/icon-home-4.svg";

import BgEffect from "@/components/BackgroundEffect";
import { isEmpty } from "lodash";
export default {
  components: { BgEffect },
  data() {
    return {
      icon1,
      icon2,
      icon3,
      icon4
    };
  },
  computed: {
    ...mapState("account", ["userMap", "userName", "mathAccount"])
  },
  methods: {
    getStarted() {
      const agree = localStorage.getItem("gard_wallet_agree");
      if (!agree) {
        this.$router.push("/agree");
        return;
      }
      this.$router.push({ path: "/create/pass" });
    }
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  text-align: center;
  .banner {
    padding: 50px 32px 100px 32px;
    margin-top: 80px;
    max-width: $max-width;
    margin: 0 auto;
    overflow: hidden;
    h1 {
      font-size: 32px;
      margin-top: 40px;
    }
    h4 {
      margin-bottom: 30px;
    }
    img {
      width: 90%;
      margin-top: 56px;
      margin-bottom: -140px;
    }
  }

  .banner-img {
    max-width: $max-width;
    margin: 0 auto -100px;
    padding: $padding-large;
    background: transparent;
    position: relative;
    z-index: 9;
    & > img {
      width: 100%;
    }
  }
  .home-items {
    background: white;
    .items {
      display: flex;
      max-width: $max-width;
      padding: 80px $padding-large 60px;
      margin: 0 auto;
      justify-content: space-between;
      flex-wrap: wrap;
      .item {
        flex-basis: 45%;
        background: white;
        box-shadow: 1px 1px 16px 0px rgba(0, 0, 0, 0.06);
        border-radius: 16px;
        padding: $padding-large;
        margin: 16px;
        color: gray;
        font-size: 14px;
        text-align: left;
        img {
          width: 80px;
        }
        h4 {
          font-size: 18px;
          color: rgba(0, 0, 0, 0.85);
          margin-bottom: 16px;
        }
      }
    }
  }

  .home-links {
    padding: 100px 16px 160px;
    margin: 0 auto -110px;
    background-color: #0c4b63;
    .link {
      color: $color-font;
      display: inline-block;
      width: 64px;
      height: 64px;
      padding: 16px;
      margin: 16px;
      border-radius: 32px;
      background: $color-background-card;
      &:hover {
        background: $color-primary-light;
      }
    }
  }
}

@include responsive($sm) {
  .home-container {
    .banner {
      img {
        width: 100%;
        margin-bottom: -80px;
      }
    }
    .banner-img {
      padding: 0;
      margin-bottom: -40px;
    }
    .home-items {
      .items {
        padding: 100px $padding-large 80px;
        flex-direction: column;
      }
    }
    .home-links {
      .link {
        margin: 8px;
      }
    }
  }
}
</style>

