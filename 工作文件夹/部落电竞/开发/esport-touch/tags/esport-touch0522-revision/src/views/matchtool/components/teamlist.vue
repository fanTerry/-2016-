<template>
  <ul class="team_list">
    <li class="team_item" v-for="(team,teamIndex) in teamList" :key="teamIndex">
      <p class="team_name">队伍{{teamIndex+1}}</p>
      <!-- 和平精英只有4个，王者荣耀有5个 -->
      <div class="player" v-for="(player,index) in 5" :key="index">
        <!-- 主办方在更多队伍页面中才显示这个删除按钮 -->
        <template v-if="team.playerInfo&&team.playerInfo[index]">
          <a class="delete_player" v-if="showDeleteIcon"
            @click="deletePlayer(team.playerInfo[index].userId,team.teamId)"></a>
          <img
            :src="team.playerInfo[index].icon?team.playerInfo[index].icon:'https://rs.esportzoo.com/svn/esport-res/mini/images/icon/avatar.png'"
            alt="">
          <p class="player_name">{{team.playerInfo[index].name}}</p>
        </template>
        <template v-else>
          <template v-if="currPosition==(team.teamId+'_'+(index+1))">
            <a class="delete_player" v-if="showDeleteIcon" @click="deletePlayer(userInfo.userId,team.teamId)"></a>
            <img :src="userInfo.icon" alt="">
            <p class="player_name">{{userInfo.nickName}}</p>
          </template>
          <!-- <img src="../../../assets/images/matchtool/default.png" alt="" @click="userApply(team.teamId,matchId,$event)">
          <p class="player_name">{{index+1}}</p> -->
          <template v-else>
            <img src="../../../assets/images/matchtool/default.png" alt=""
              @click="fillpositionByUser(team.teamId,index+1,matchId,userTeamId)">
            <!-- <p class="player_name">{{index+1}}</p> -->
          </template>

        </template>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  components: {},
  props: ["teamList", "showDeleteIcon", "matchId", "userTeamId"],
  data() {
    return {
      userInfo: {},
      currChooseEl: null, //选中的空格子
      defaultPng: null, //空格子默认图片
      event: null,
      currPosition: ""
    };
  },
  mounted() {
    console.log("用户信息", this.userInfo);
  },
  methods: {
    deletePlayer(deleteUserId, teamId) {
      console.log(deleteUserId, teamId);
      this.$emit("deletePlayer", deleteUserId, teamId);
    },

    /**
     * 用户申请报名
     */
    fillpositionByUser(teamId, position, matchId, userTeamId) {
      if (teamId == userTeamId) {
        this.$toast("当前队伍已报名");
        return;
      }
      let popStr = teamId + "_" + position;
      console.log(popStr);
      let param = {};
      param.teamId = teamId;
      param.matchId = matchId;
      param.position = position;
      console.log(teamId, matchId);
      return this.$post("/api/matchtool/matchRoom/join", param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == "200") {
            const teamNum = dataResponse.data;
            this.$emit("applySuccess", teamId, teamNum);
            this.currPosition = popStr;
            console.log(this.currPosition);
          } else if (dataResponse.code == "4444") {
            this.$toast(dataResponse.message);
            // this.$emit("applyFailed");
          } else {
            this.$toast(dataResponse.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    /**
     * 用户申请报名
     */
    userApply(teamId, matchId, event) {
      let param = {};
      param.teamId = teamId;
      param.matchId = matchId;

      console.log(teamId, matchId);
      let currentTarget = event.currentTarget;
      // this.operateUser(event);
      console.log(param);
      return this.$post("/api/matchtool/matchRoom/join", param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == "200") {
            this.$emit("applySuccess", teamId);
            console.log(currentTarget, "currentTarget");
            this.operateUser(currentTarget);
          } else if (dataResponse.code == "4444") {
            this.$toast(dataResponse.message);
            this.$emit("applyFailed");
          } else {
            this.$toast("报名异常");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    operateUser(currentTarget) {
      if (this.currChooseEl) {
        this.currChooseEl.src = this.defaultPng;
      }
      this.currChooseEl = currentTarget;
      if (!this.defaultPng) {
        console.log("2222", this.currChooseEl.src);
        this.defaultPng = this.currChooseEl.src;
      }
      console.log(this.currChooseEl);
      this.currChooseEl.src = this.userInfo.icon;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../../assets/common/_mixin";
@import "../../../assets/common/_base";

.team_item {
  position: relative;
  @extend .flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  width: 94.6667vw;
  height: 23.6vw;
  margin: 0 auto;
  padding: 5.6vw 2.6667vw 0;
  margin-bottom: 1.3333vw;
  @include getBgImg("../../../assets/images/matchtool/team_bg.png");
  background-size: 100% auto;
  background-clip: padding-box;
}
.team_name {
  position: absolute;
  top: 1.0667vw;
  left: 1.4667vw;
  font-size: 2.4vw;
  color: #00b4ff;
}
.player {
  position: relative;
  width: 15.7333vw;
  height: 15.7333vw;
  padding: 1px;
  @include getBgImg("../../../assets/images/matchtool/player_bg.png");
  background-size: 100% 100%;
  @extend .flex_v_h;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.delete_player {
  position: absolute;
  right: 0.2667vw;
  top: 0.2667vw;
  width: 4.5333vw;
  height: 4.5333vw;
  @include getBgImg("../../../assets/images/matchtool/delete_player.png");
}
.player_name {
  position: absolute;
  bottom: 0.2667vw;
  left: 0.2667vw;
  @include t_nowrap(15.2vw);
  width: 15.2vw;
  height: 3.2vw;
  line-height: 3.2vw;
  font-size: 2.6667vw;
  color: #fff;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
