<template>
  <!-- <div
    id="switch"
    @click="changeTheme"
    :class="curTheme === 'dark' ? 'checkLight' : ''"
  >
    <div class="icon"></div>
  </div> -->

  <!-- <div class="switch-wrapper">
    <input
      v-if="curTheme === 'dark'"
      id="switchCheckbox"
      type="checkbox"
      checked
    />
    <input v-else id="switchCheckbox" type="checkbox" />
    <label for="switchCheckbox" @click="changeTheme" class="switch"></label>
  </div> -->
  <div class="switch" @click.prevent="changeTheme">
    <label for="toggle">
      <input
        id="toggle"
        class="toggle-switch"
        type="checkbox"
        :checked="curTheme === 'light'"
      />
      <div class="sun-moon"><div class="dots"></div></div>
      <div class="background">
        <div class="stars1"></div>
        <div class="stars2"></div>
      </div>
    </label>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { settingStore } from "@/stores";
const setting = settingStore();
const curTheme = ref("");

curTheme.value = setting.theme;

const changeTheme = () => {
  const t = curTheme.value === "light" ? "dark" : "light";
  setting.changeTheme(t);
  curTheme.value = t;
};
</script>
<!-- <style scoped lang="less">
#switch {
  position: relative;
  cursor: pointer;
  width: 100px;
  height: 50px;
  zoom: 0.4;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  background-color: #ffffff;
  box-shadow: 1px 2px 3px rgba(13, 215, 23, 0.5);
  transition: all 0.5s ease-in;
  //   transform: scale(0.5);
  &.checkLight {
    background-color: var(--el-fill-color-blank);
    // moon
    .icon {
      position: absolute;
      top: 5px;
      left: 50px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 1);
      &:before {
        position: absolute;
        top: 5px;
        left: -4px;
        opacity: 1;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background-color: rgb(176, 60, 60);
        content: "";
        transition-timing-function: ease-out;
        animation-name: leftTo;
        animation-duration: 0.5s;
        animation-delay: 0.9;
      }
    }
    &::before {
      position: absolute;
      left: 10px;
      top: 5px;
      color: #fff;
      content: "Dark";
      text-align: left;
      line-height: 40px;
      opacity: 1;
      transition: all 0.7s ease-in; /* Standard */
      transition-delay: 0.2s;
    }
    &::after {
      content: "";
      opacity: 0;
    }
  }
  // sun
  .icon {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e6a555;
    transition: left 0.4s ease-out;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
  &::after {
    position: absolute;
    left: 55px;
    top: 5px;
    color: rgba(51, 51, 51, 1);
    opacity: 1;
    content: "Light";
    text-align: right;
    line-height: 40px;
    transition: all 0.7s ease-in-out;
  }
  &::before {
    content: "";
    opacity: 0;
  }
}

@keyframes leftTo {
  0% {
    left: -20px;
    opacity: 0;
  }
  50% {
    left: -15px;
    opacity: 0;
  }
  100% {
    left: -4px;
    opacity: 1;
  }
}
</style> -->
<!-- <style scoped lang="scss">
$switch-width: 100px;
$switch-height: 40px;
$switchToggle-width: $switch-height;

$sky-day: #2196f3;
$sky-night: #023660;
$sun: #ffeb3b;
$sun-center: #ffc107;
$sun-light: rgba(255, 235, 255, 0.4);
$moon: #ddd;
$moon-light: rgba(255, 255, 255, 0.2);
$star: #fff;
$cloud: #fefefe;

.switch-wrapper {
  /* margin: 30px 0; */
  font-size: 0;
  zoom: 0.4;
}
.switch-wrapper input {
  display: none;
}

.switch-label {
  font-size: 1rem;
  display: inline-block;
  line-height: $switch-height;
  vertical-align: top;
  padding: 5px 10px;
  transition: transform ease-in 0.2s;
  font-weight: bold;
  opacity: 0.6;
}
.switch {
  position: relative;
  display: inline-block;
  width: $switch-width;
  height: $switch-height;
  cursor: pointer;
  border-radius: calc($switch-width / 2);
  border: 2px solid #eee;
  background-color: $sky-day;
  background-image: radial-gradient(circle, $cloud 20%, transparent 30%),
    radial-gradient(circle, $cloud 20%, transparent 30%),
    radial-gradient(circle, $cloud 20%, transparent 30%),
    radial-gradient(circle, $cloud 20%, transparent 30%),
    radial-gradient(circle, $cloud 20%, transparent 30%),
    radial-gradient(circle, $cloud 20%, transparent 30%);
  background-size: 50% 50%, 60% 60%, 40% 40%, 40% 40%, 50% 50%, 40% 40%;
  background-position: 60% 82%, 80% 80%, 82% 80%, 110% 20%, 134% 12%, 130% 20%;
  background-repeat: no-repeat;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  overflow: hidden;
}

.switch:before {
  position: absolute;
  content: "";
  height: $switch-height - 5;
  width: $switch-height - 5;
  top: 50%;
  left: 2px;
  cursor: pointer;
  transform: translateY(-50%);
  background-color: $sun;
  background-image: radial-gradient(circle, $sun-center 15%, $sun 100%);
  box-shadow: 0px 0px 20px 10px $sun-light;
  transition: transform ease-in 0.2s;
  border-radius: 50%;
  background-repeat: no-repeat;
}

.switch-label.day {
  transform: scale(1.1);
  opacity: 1;
}

input:checked ~ .switch {
  background-color: $sky-night;
  background-image: radial-gradient(circle, $star 10%, transparent 30%),
    radial-gradient(circle, $star 10%, transparent 30%),
    radial-gradient(circle, $star 10%, transparent 30%),
    radial-gradient(circle, $star 10%, transparent 30%),
    radial-gradient(circle, $star 10%, transparent 30%),
    radial-gradient(circle, $star 10%, transparent 30%),
    radial-gradient(circle, $star 10%, transparent 30%),
    radial-gradient(circle, $star 10%, transparent 30%),
    radial-gradient(circle, $star 10%, transparent 30%);
  background-size: 8% 8%, 7% 7%, 6% 6%, 8% 8%, 8% 8%, 6% 6%, 6% 6%, 8% 8%, 7% 7%;
  background-position: 20% 20%, 45% 30%, 25% 55%, 20% 90%, 40% 60%, 5% 50%,
    58% 10%, 58% 60%, 50% 80%;
  background-repeat: no-repeat;

  &:before {
    background-color: $moon;
    background-image: radial-gradient(
        circle,
        darken($moon, 10%) 50%,
        transparent 50%
      ),
      radial-gradient(circle, darken($moon, 8%) 50%, transparent 50%),
      radial-gradient(circle, darken($moon, 8%) 50%, transparent 50%),
      radial-gradient(circle, darken($moon, 8%) 50%, transparent 50%);
    background-size: 40% 40%, 25% 25%, 50% 50%, 30% 30%;
    background-position: 20% 20%, 65% 30%, 120% 100%, 20% 80%;
    box-shadow: 0px 0px 20px 10px $moon-light;
  }
}

.switch-wrapper input:checked {
  ~ .switch-label.day {
    transform: scale(1);
    opacity: 0.6;
  }
  ~ .switch-label.night {
    transform: scale(1.1);
    opacity: 1;
  }
}

.switch-wrapper input:checked ~ .switch:before {
  transform: translate($switch-width - $switchToggle-width, -50%);
}
</style> -->
<style scoped>
.switch {
  -webkit-app-region: no-drag;
  position: relative;
  /* overflow: hidden; */
  width: 7.5rem;
  height: 4rem;
  zoom: 0.3;
}

.switch input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  opacity: 0;
}

.switch label {
  cursor: pointer;
}

.background {
  z-index: 1;
  position: absolute;
  width: 7.5rem;
  height: 4rem;
  border-radius: 2.5rem;
  border: 0.25rem solid #202020;
  background: linear-gradient(to right, #484848 0%, #202020 100%);
  transition: all 0.3s;
}

.stars1,
.stars2 {
  position: absolute;
  height: 0.4rem;
  width: 0.4rem;
  background: #ffffff;
  border-radius: 50%;
  transition: 0.3s all ease;
}

.stars1 {
  top: 6px;
  right: 23px;
}

.stars2 {
  top: 40px;
  right: 48px;
}

.stars1:after,
.stars1:before,
.stars2:after,
.stars2:before {
  position: absolute;
  content: "";
  display: block;
  height: 0.25rem;
  width: 0.25rem;
  background: #ffffff;
  border-radius: 50%;
  transition: 0.2s all ease;
}

.stars1:after {
  top: 8px;
  right: 20px;
}

.stars1:before {
  top: 18px;
  right: -12px;
}

.stars2:after {
  top: -8px;
  right: -16px;
}

.stars2:before {
  top: 6px;
  right: -26px;
}

.sun-moon {
  z-index: 2;
  position: absolute;
  left: 0;
  display: inline-block;
  height: 3rem;
  width: 3rem;
  margin: 0.5rem;
  background: #fffdf2;
  border-radius: 50%;
  transition: all 0.5s ease;

  /* Default to Moon */
  border: 0.25rem solid #dee2c6;
}

.sun-moon .dots {
  position: absolute;
  top: 3px;
  left: 23px;
  height: 1rem;
  width: 1rem;
  background: #efeedb;
  border: 0.25rem solid #dee2c6;
  border-radius: 50%;
  transition: 0.4s all ease;
}

.sun-moon .dots:after,
.sun-moon .dots:before {
  position: absolute;
  content: "";
  display: block;
  height: 0.25rem;
  width: 0.25rem;
  background: #efeedb;
  border: 0.25rem solid #dee2c6;
  border-radius: 50%;
  transition: 0.4s all ease;
}

.sun-moon .dots:after {
  top: -4px;
  left: -26px;
}

.sun-moon .dots:before {
  top: 18px;
  left: -10px;
}

/* Transition to Sun */

.switch input:checked ~ .sun-moon {
  left: calc(100% - 4rem);
  background: #f5ec59;
  border-color: #e7c65c;
  transform: rotate(-25deg);
}

.switch input:checked ~ .sun-moon .dots,
.switch input:checked ~ .sun-moon .dots:after,
.switch input:checked ~ .sun-moon .dots:before {
  background: #ffffff;
  border-color: #ffffff;
}

.switch input:checked ~ .sun-moon .dots {
  height: 1.5rem;
  width: 1.5rem;
  top: 0px;
  left: -20px;
  transform: rotate(25deg);
}

.switch input:checked ~ .sun-moon .dots:after {
  height: 0.65rem;
  width: 0.65rem;
  top: 2px;
  left: -12px;
}

.switch input:checked ~ .sun-moon .dots:before {
  height: 0.4rem;
  width: 0.4rem;
  top: 6px;
  left: 14px;
}

.switch input:checked ~ .background .stars1,
.switch input:checked ~ .background .stars2 {
  opacity: 0;
  transform: translateY(2rem);
}

.switch input:checked ~ .background {
  border: 0.25rem solid #78c1d5;
  background: linear-gradient(to right, #78c1d5 0%, #bbe7f5 100%);
}
</style>
