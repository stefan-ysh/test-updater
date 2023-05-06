<template>
  <div style="height: 100%">
    <!-- <iframe
      src="http://www.magickeyboard.io/"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe> -->
    <el-calendar class="container" ref="calendar">
      <template #header="{ date }">
        <span :style="{ color: setting.theme === 'dark' ? '#fff' : '' }">{{ date }}</span>
        <el-button-group>
          <!-- <el-button size="small" @click="selectDate('prev-year')">
            上一年
          </el-button> -->
          <el-button size="small" @click="selectDate('prev-month')">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button size="small" @click="selectDate('today')">今天</el-button>
          <el-button size="small" @click="selectDate('next-month')">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
          <!-- <el-button size="small" @click="selectDate('next-year')">
            下一年
          </el-button> -->
        </el-button-group>
      </template>
      <template #date-cell="{ date, data }">
        <div
          :class="data.isSelected ? 'is-selected' : ''"
          style="display: flex; flex-wrap: wrap; width: 90%"
        >
          <div
            style="
              width: 100%;
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              align-items: center;
            "
          >
            <div class="lunar" :class="{ festival: isFestival(date, data) }">
              {{ solarToLunar(date, data) }}
            </div>
            <!-- yyyy-MM-dd -->
            <!-- {{ data.day.split("-").slice(0).join("-") }} -->
            <!-- MM-dd -->
            <!-- {{ data.day.split("-").slice(1).join("-") }} -->
            <!-- dd -->
            <div class="solar">
              {{ data.day.split("-").slice(2).join("-") }}
            </div>
          </div>
          <!-- {{ data.isSelected ? "✔️" : "" }} -->
          <Schedule
            :data="data"
            :curDate="data.day.split('-').slice(0).join('-')"
          />
        </div>
      </template>
    </el-calendar>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue";
import Schedule from "./schedule.vue";
import calendarFormat from "@/utils/calendarFormat.js";
import { settingStore } from "@/stores";
const setting = settingStore();
const calendar = ref();
const selectDate = (val: string) => {
  const t = calendar.value.selectDate(val);
};
// 是否节假日
const isFestival = (slotDate: any, slotData: any) => {
  let solarDayArr: any = slotData.day.split("-");
  let lunarDay: any = calendarFormat.solar2lunar(
    solarDayArr[0],
    solarDayArr[1],
    solarDayArr[2]
  );

  // 公历节日\农历节日\农历节气
  let festAndTerm: any = [];
  festAndTerm.push(lunarDay.festival == null ? "" : " " + lunarDay.festival);
  festAndTerm.push(
    lunarDay.lunarFestival == null ? "" : "" + lunarDay.lunarFestival
  );
  festAndTerm.push(lunarDay.Term == null ? "" : "" + lunarDay.Term);
  festAndTerm = festAndTerm.join("");

  return festAndTerm != "";
};
// 公历转农历
const solarToLunar = (slotDate: any, slotData: any) => {
  // 公历日期，如 2022-09-01 则分解为 ['2022', '09', '01']
  let solarDayArr: string[] = slotData.day.split("-");
  // interface LunarDetail {
  //   Animal:
  //     | "\u9f20"
  //     | "\u725b"
  //     | "\u864e"
  //     | "\u5154"
  //     | "\u9f99"
  //     | "\u86c7"
  //     | "\u9a6c"
  //     | "\u7f8a"
  //     | "\u7334"
  //     | "\u9e21"
  //     | "\u72d7"
  //     | "\u732a";
  //   astro:
  //     | "白羊座"
  //     | "金牛座"
  //     | "双子座"
  //     | "巨蟹座"
  //     | "狮子座"
  //     | "处女座"
  //     | "天秤座"
  //     | "天蝎座"
  //     | "射手座"
  //     | "摩羯座"
  //     | "水瓶座"
  //     | "双鱼座";
  //   cYear: number;
  //   cMonth: number;
  //   cDay: number;
  //   date: string;
  //   festival: string | null;
  //   gzYear: string;
  //   gzMonth: string;
  //   gzDay: string;
  //   IMonthCn:
  //     | "\u6b63"
  //     | "\u4e8c"
  //     | "\u4e09"
  //     | "\u56db"
  //     | "\u4e94"
  //     | "\u516d"
  //     | "\u4e03"
  //     | "\u516b"
  //     | "\u4e5d"
  //     | "\u5341"
  //     | "\u51ac"
  //     | "\u814a";
  //   IDayCn: string;
  //   isToday: boolean;
  //   isLeap: boolean;
  //   isTerm: boolean;
  //   lunarDate: string;
  //   lunarFestival: string | null;
  //   lYear: number;
  //   lMonth: number;
  //   lDay: number;
  //   nWeek: number;
  //   ncWeek:
  //     | "星期一"
  //     | "星期二"
  //     | "星期三"
  //     | "星期四"
  //     | "星期五"
  //     | "星期六"
  //     | "星期日";
  //   Term: string | null;
  // }

  // 日期详情，包括农历日期、节气、节日、星座、生肖等
  let lunarDetail: any = calendarFormat.solar2lunar(
    solarDayArr[0],
    solarDayArr[1],
    solarDayArr[2]
  );

  // 农历月份
  let lunarMon = lunarDetail.IMonthCn;
  // 农历日期
  let lunarDay = lunarDetail.IDayCn;

  // 公历节日\农历节日\农历节气
  let festAndTerm: string[] | string = [];

  // 公历节日 festival，如教师节、国庆节等
  festAndTerm.push(
    lunarDetail.festival == null ? "" : " " + lunarDetail.festival
  );

  // 农历节日 lunarFestival，如春节、元宵节、中秋节等
  festAndTerm.push(
    lunarDetail.lunarFestival == null ? "" : "" + lunarDetail.lunarFestival
  );

  // 节气，如芒种、白露、霜降等
  festAndTerm.push(lunarDetail.Term == null ? "" : "" + lunarDetail.Term);
  festAndTerm = festAndTerm.join("");

  // 如果是初一的话，就显示月份
  lunarDay = lunarDay === "初一" ? lunarMon : lunarDay;
  return festAndTerm == "" ? lunarDay : festAndTerm;
};
</script>
<style lang="scss">
.container {
  height: 100%;
  .el-calendar__header {
    padding-top: 0;
  }
  .el-calendar__body {
    height: calc(100% - 60px);
    padding: 0 10px 10px 10px;
    /**本月周末设置为红色*/
    .el-calendar-table .current:nth-last-child(-n + 2) .solar {
      /* color: red; */
    }
    /**本月农历设置为灰色*/
    .el-calendar-table .current .lunar {
      /* color: #606266; */
    }
    /**本月农历节日设置为红色*/
    .el-calendar-table .current .lunar.festival {
      color: red;
    }
    .el-calendar-table {
      height: 100%;
      .el-calendar-day {
        height: 100%;
        max-height: 500px;
        overflow: auto;
        position: relative;
        .el-button {
          visibility: hidden;
        }
        &:hover {
          .el-button {
            visibility: visible;
          }
        }
      }
    }
  }
}
.is-selected {
  /* color: #1989fa; */
}

/**隐藏上一月、本月、下一月*/
.el-calendar__button-group {
  display: none;
}
/**月份居中*/
.el-calendar__title {
  width: 100%;
  text-align: center;
}
.el-calendar-table {
  td:nth-child(1),
  td:nth-child(7) {
    /* opacity: 0.5; */
    /* background: #f5f5f5; */
  }
}
/**日期div的样式*/
.el-calendar-table tr td:first-child {
  border-left: 0px;
}
.el-calendar-table {
  .td {
    min-height: 110px;
    min-width: 110px;
    border-right: 0px;
    &.is-selected {
      /* background-color: white; */
    }
  }
}

.el-calendar-table .el-calendar-day {
  height: 100%;
  padding: 0px;
  text-align: center;
}
.el-calendar-table .el-calendar-day > div {
  /* height: 104px; */
  text-align: center;
}
/**日期div的样式-公历*/
.el-calendar-table .el-calendar-day > div .solar {
  /* padding-top: 30px; */
  text-align: center;
}
/**日期div的样式-农历*/
.el-calendar-table .el-calendar-day > div .lunar {
  /* padding-top: 10px; */
  text-align: center;
}
/**日期div的样式-选中*/
.el-calendar-table .el-calendar-day > div.selected {
  /* background-color: #fef2f2; */
  /* border: 3px solid #fb0; */
  border-radius: 20px;
  text-align: center;
}

/**本月周末设置为红色*/
.el-calendar-table .current:nth-last-child(-n + 2) .solar {
  color: red;
}
/**本月农历设置为灰色*/
.el-calendar-table .current .lunar {
  color: #606266;
}
/**本月农历节日设置为红色*/
.el-calendar-table .current .lunar.festival {
  color: red;
}
/**禁用点击效果*/
/*.el-calendar-table td {*/
/*pointer-events: none;*/
/*}*/
</style>
