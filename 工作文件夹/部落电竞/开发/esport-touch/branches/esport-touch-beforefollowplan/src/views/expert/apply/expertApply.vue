<template>
  <div class="Page expertApply_Page">
    <header class="mod_header">
      <navBar :pageTitle="'达人申请'"></navBar>
    </header>

    <div class="main">
      <section class="draw_info">
        <p class="warnings">请填写开通账号所需资料，同一申请无需填写多次。申请结果和账号信息将会以邮件方式发送给您。</p>
        <div class="draw_input">
          <span class="name">达人号名称:</span>
          <input v-model="applyParam.expertName" type="text" @blur="bindBlur()">
        </div>
        <div class="draw_input draw_textarea">
          <span class="name">达人号简介:</span>
          <textarea v-model="applyParam.introduction" name="" id="" cols="20" rows="10" maxlength="100" placeholder="不超过100个字符，请勿包含政治，色情，广告等违规信息 " @blur="bindBlur()"></textarea>
        </div>
      </section>

      <section class="draw_reason">
        <div class="draw_input draw_textarea">
          <span class="name">申请理由:</span>
          <textarea v-model="applyParam.reason" name="" id="" cols="20" rows="10" maxlength="100" placeholder="不超过100个字符，请勿包含政治，色情，广告等违规信息" @blur="bindBlur()"></textarea>
        </div>
      </section>

      <section class="draw_user_info">
        <div class="draw_input">
          <span class="name">运营者姓名:</span>
          <input v-model="applyParam.realName" type="text" placeholder="请填写真实姓名" @blur="bindBlur()">
        </div>
        <div class="draw_input">
          <span class="name">身份证号:</span>
          <input v-model="applyParam.cardNo" type="text" placeholder="请填写身份证号" @blur="bindBlur()">
        </div>
        <div class="draw_input draw_textarea">
          <span class="name">图片上传:</span>
          <div class="pull_file">
            <input style="position:absolute;opacity:0;" type="file" @change="changeImage($event)" ref="input" accept="image/*">
            <img src="../../../assets/images/expert/expert_apply.jpg" ref="img" style="width: 100%; height: 100%;" />

          </div>
          <!-- <vue-core-image-upload
                :class="['btn', 'btn-primary']"
                :crop="false"
                @imageuploaded="imageuploaded"
                :data="applyParam"
                :max-file-size="5242880"
                url="http://101.198.151.190/api/upload.php" >
          </vue-core-image-upload> -->

        </div>
        <p class="tips">请上传手持身份证正面照，要求图片信息可见，大小不超过5M，点击<a @click="showImg = true">查看示例照片</a>
        </p>

        <div class="ui_pop" v-show="showImg" @click="showImg = false">
          <img class="imgExample"
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557726538856&di=5e1d5684f1dc2c7d423a04163cadb57a&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180928%2F497ed60f31e944a6a2d003403314ee9d.png"
            alt="">
        </div>
      </section>
    </div>

    <footer class="mod_footer">
      <a class="commit_btn" @click="submitData()">提交申请</a>
    </footer>
  </div>
</template>

<script>
import { getCheck } from '../../../libs/utils';
import navBar from '../../../components/header/nav_bar/index';
export default {
  data() {
    return {
      applyParam: {
        expertName: '',
        introduction: '',
        reason: '',
        realName: '',
        cardNo: ''
      },
      userId: Number,
      maxPicSize: 5,
      showImg: false
    };
  },
  created() {
    this.userId = this.$route.query.id;
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    /**图片预览 */
    changeImage(event) {
      const refs = this.$refs;
      const elInput = refs.input;
      const elImg = refs.img;

      if (window.FileReader) {
        const reader = new FileReader();
        reader.onload = e => {
          const src = e.target.result;
          elImg.src = src;
        };
        if (elInput.files && elInput.files[0]) {
          reader.readAsDataURL(elInput.files[0]);
        }
      }
    },

    /**提交申请 */
    submitData() {
      if (!this.checkForm()) {
        return;
      }
      if (!this.userId) {
        let user = JSON.parse(window.localStorage.getItem('user'));
        this.userId = user.userId;
      }
      let form = new FormData();
      form.append('expertName', this.applyParam.expertName);
      form.append('introduction', this.applyParam.introduction);
      form.append('reason', this.applyParam.reason);
      form.append('realName', this.applyParam.realName);
      form.append('cardNo', this.applyParam.cardNo);
      form.append('file', this.$refs.input.files[0]);
      form.append('userId', this.userId);
      return this.$post('/api/expert/apply', form)
        .then(rsp => {
          let response = rsp;
          console.log('返货', response);
          if (response.code == '200') {
            this.$toast('提交申请成功');
            setTimeout(() => {
              this.gotoUserCenter();
            }, 2000);
          } else {
            this.$toast('提交申请失败，原因：' + response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    checkForm() {
      if (!this.applyParam.expertName) {
        this.$toast('请填写达人号名称');
        return false;
      }
      if (!this.applyParam.introduction) {
        this.$toast('请填写简介');
        return false;
      }
      if (!this.applyParam.reason) {
        this.$toast('请填写申请理由');
        return false;
      }
      if (!this.applyParam.realName) {
        this.$toast('请填写运营者姓名');
        return false;
      }
      if (!this.applyParam.cardNo) {
        this.$toast('请填写身份证号');
        return false;
      }

      if (this.applyParam.expertName.length > 8) {
        this.$toast('名称不可超过8个字符');
        return false;
      }
      if (!getCheck.checkIdCard(this.applyParam.cardNo)) {
        this.$toast('请填写正确身份证号');
        return false;
      }
      if (this.applyParam.introduction.length > 100) {
        this.$toast('简介不可超过100个字符');
        return false;
      }
      if (this.applyParam.reason.length > 100) {
        this.$toast('理由不可超过100个字符');
        return false;
      }
      var limitSize = this.maxPicSize * 1024 * 1024;
      if (this.$refs.input.files[0] && this.$refs.input.files[0].size > limitSize) {
        this.$toast('图片不能大于5M，请重新选择');
      }
      console.log('通过');
      return true;
    },
    goBack() {
      this.$router.back(-1);
    },
    gotoUserCenter() {
      this.$router.push('/userCenter');
    },
    getUserInfo() {
      let param = {};
      this.$post('/api/usercenter/ucIndexdata', param)
        .then(rsp => {
          const dataResponse = rsp;
          if (dataResponse.code == '200') {
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    bindBlur() {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 100);
    }
  },
  components: {
    navBar
  }
};
</script>


<style lang='scss' scoped>
@import '../../../assets/common/_mixin.scss';
@import '../../../assets/common/_base.scss';
@import '../../../assets/common/_var.scss';

.main {
  margin: 10px 5px 0;
  section {
    background-color: #fff;
  }
}

.warnings {
  color: $color_main;
  line-height: 18px;
  padding: 10px 30px;
  margin-bottom: 5px;
  background-color: #f3e9c3;
}

.draw_info {
  .name {
    font-weight: bold;
  }
}

.draw_input {
  height: 35px;
  margin: 0 10px;
  line-height: 35px;
  @include getBorder(bottom, #dfdfdf);
  &:last-child {
    background: none;
  }
  .name {
    font-size: 14px;
    margin-right: 5px;
    color: #0e1a4e;
  }
  input,
  textarea {
    width: auto;
    height: 100%;
    border: none;
  }
  textarea {
    display: block;
    width: 100%;
    height: 50px;
    line-height: 16px;
    margin-top: 8px;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
  }
}

.draw_textarea {
  height: auto;
  line-height: initial;
  padding: 10px 0;
}

.draw_reason {
  margin-top: 10px;
  .name {
    font-weight: bold;
  }
}

.draw_user_info {
  margin-top: 10px;
  .draw_input {
    input {
      width: 60%;
    }
  }
  .pull_file {
    position: relative;
    z-index: 1;
    width: 90px;
    height: 56px;
    margin-top: 10px;
    input {
      display: block;
      position: relative;
      z-index: 3;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    img {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      object-fit: cover;
      // @include getBgImg("../../../assets/images/expert/expert_apply.jpg");
    }
  }
  .tips {
    padding: 10px 10px 25px;
    line-height: 18px;
    color: #b7b7b7;
    a {
      color: #74c588;
    }
  }
}

.commit_btn {
  display: block;
  margin: 15px;
  padding: 15px;
  font-size: 18px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
  background-color: #d13840;
}

.imgExample {
  width: 300px;
}
</style>
