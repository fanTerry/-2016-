<template>
  <div class="Page">
    <header class="mod_header">
      <navBar pageTitle="发布短文" v-if="type==3">
        <a class="publish_btn" @click="publishEssay">发布</a>
      </navBar>
      <navBar pageTitle="发布视频" v-if="type==5">
        <a class="publish_btn" @click="publishEssay">发布</a>
      </navBar>
    </header>
    <div class="main mescroll-touch-y">
      <div class="select_topic">
        <span>选择话题</span>
        <span class="topic" :class="{'active':topicName}"
          @click="showTopicList = true">{{topicName?topicName:"选择相关话题,可获取更多曝光哦"}}</span>
      </div>
      <section class="mod_publish">
        <!-- 发布短文 -->
        <div :class="type==3?'publish_essays':'publish_img'" @click="bindFocus()">
          <div class="publish_txt">
            <div class="essays_con" :class="switchTabType==1?'active':''" v-html="contentHtml">
            </div>
            <textarea class="essays" v-model="content" @input="handleInput" @focus="bindFocus($event)"
              @blur="scrollToTop" name="" id="" maxlength="200" placeholder="来叨叨两句吧~（200个字符以内）"
              ref="focusTextarea"></textarea>
            <!-- <span class="txt_num">200</span> -->
          </div>
          <div class="add_container" v-if="type==3">
            <!--发布短文-->
            <div class="add_item" style="display:none">
              <img :src="test">
            </div>
            <template v-if='imgs.length>0'>
              <div class="add_item" v-for="(item, i) in imgs" :key='i'>
                <img :src="item">
                <span class="close" @click="del(i,3)"></span>
                <span class="edit">编辑</span>
                <input style="position:absolute;opacity:0;" type="file" @change="fileUpdate(i,$event)" accept="image/*">
              </div>
            </template>
            <div class="add_item" v-if="imgs.length<maxSize">
              <span class="add_icon"></span>
              <img src="" alt="" ref="img">
              <input style="position:absolute;opacity:0;" type="file" multiple id='files' @change="fileChange($event)"
                ref="input" accept="image/*">
            </div>

          </div>
          <div class="add_container" v-if="type==5">
            <!--发布视频-->
            <div class="add_item">
              <span class="close" @click="del(0,5)" v-if="showVideo"></span>
              <span class="add_icon"></span>
              <img src="" alt="" ref="img">
              <video id="videoId" autoplay controls v-show="showVideo" />
              <input style="position:absolute;opacity:0;" type="file" id='pop_video' @change="uploadVideo($event)"
                ref="file" accept="video/*" v-if='!showVideo'>
              <!--capture="camcorder" -->
            </div>
            <textarea class="note_txt" placeholder="上传的视频不超过300M"></textarea>
          </div>
        </div>
      </section>
      <section class="ui_pop mod_project" v-if="showTopicList">
        <div class="project_con">
          <h3 ref="selectTopic">选择话题<a class='close' @click="showTopicList = false"></a></h3>
          <div class="search">
            <span class="search_icon"></span>
            <input @blur="scrollToTop" type="text" name="" id="" v-model="searchVal" placeholder="搜索话题">
            <span class="close" @click="clearSearch"></span>
          </div>
          <div class="topic_talk">
            <template v-if="searchVal!=''">
              <topic-list v-for="(value,index) in searchList" :value='value' :key="index" @selectTopic='selectTopic'>
              </topic-list>
            </template>
            <template v-else>
              <div class="cms_topic">
                <topic-list v-for="(value,index) in followList" :value='value' :key="index" @selectTopic='selectTopic'>
                </topic-list>
              </div>
              <div class="top_cms_topic">
                <topic-list v-for="(value,index) in topCmsTopicList" :value='value' :key="index"
                  @selectTopic='selectTopic'>
                </topic-list>
              </div>
              <div v-for="(item,index) in topicList" :key="index">
                <h2 :id="index">{{index}}</h2>
                <topic-list v-for="(value,index) in item" :value='value' :key="index" @selectTopic='selectTopic'>
                </topic-list>
              </div>
            </template>
          </div>
          <!-- 侧边栏 -->
          <aside class="sidebar">
            <i class="iconfont icon-sousuo"></i>
            <a class="letter" :class="index == sideBarFlag?'active':''" @click="sideBarFlag = index"
              v-for="(item,index) in letterList" :key="index" :href="'#'+item">{{item}}</a>
          </aside>
        </div>
      </section>
    </div>

    <div class="mask" v-if="loadingFlag"></div>
    <loading v-if="loadingFlag" :text='loadingText'></loading>
  </div>
</template>

<script>
import navBar from "components/header/nav_bar/index";
import loading from "components/common/loading";
import topicList from "./components/topic.vue";
import {isNum} from '../../../libs/utils';

export default {
  components: {
    navBar,
    loading,
    topicList
  },
  props: [],
  data() {
    return {
      topicList: [],
      followList: [],
      topCmsTopicList: [],
      searchVal: "", //默认输入为空
      selectTopicName: [],
      content: "",
      imgs: [], // 图片预览地址
      imgfiles: [], // 图片原文件，上传到后台的数据
      maxSize: 6, // 限制上传数量
      currPicNum: 0, //记录当前上传的预览图片数
      test: "",
      switchTabType: 1, //切换tab
      type: 3, //用户发布的类型:3:短文,5视频
      showVideo: false,
      textAreaFocus: true,
      contentHtml: "",
      maxContentLength: 200,
      maxPicSize: 30,
      maxVideoSize: 300,
      repeatClickFlag: false,
      videoMaxMinute: 600,
      loadingFlag: false,
      loadingText: "",
      urlTopicName: "",
      topicName: "",
      letterList: [],
      showTopicList: false,
      sideBarFlag: Number,
      topicId: ""
    };
  },
  mounted() {
    this.type = this.$route.query.type || 3;
    this.topicId = this.$route.query.topicId;
    console.log(this.type);
    this.urlTopicName = this.$route.query.topicName || "";
    if (this.urlTopicName) {
      this.selectTopic(this.urlTopicName);
    }
    //this.$refs.focusTextarea.focus();
    this.getCmsTopicList();
  },
  computed: {
    searchList() {
      let _self = this,
        resultList = [];
      if (!this.searchVal) {
        return resultList;
      }
      for (var key in _self.topicList) {
        let array = _self.topicList[key];
        array.forEach(el => {
          if (el.name.search(_self.searchVal) != -1) {
            resultList.push(el);
          }
        });
      }
      console.log(resultList);
      return resultList;
    }
  },
  methods: {
    switchType(switchTabType) {
      this.switchTabType = switchTabType;
      if (this.switchTabType == 1) {
        this.$refs.focusTextarea.focus();
      }
    },
    fileUpdate(index, event) {
      //修改图片
      var _this = this;
      var event = event || window.event;
      var file = event.target.files;
      var leng = file.length;
      for (var i = 0; i < leng; i++) {
        if (this.judgeFileSize(file[i])) {
          return;
        }
        var reader = new FileReader(); // 使用 FileReader 来获取图片路径及预览效果
        _this.imgfiles[index] = file[i];
        reader.readAsDataURL(file[i]);
        reader.onload = function(e) {
          _this.imgs[index] = e.target.result; // base 64 图片地址形成预览
          _this.test = e.target.result;
        };
      }
    },
    fileChange() {
      // 添加图片
      console.log("this.currPicNum", this.currPicNum);
      var _this = this;
      var event = event || window.event;
      var file = event.target.files;
      var leng = file.length;
      console.log("leng", leng);
      if (this.currPicNum + leng > this.maxSize) {
        this.$toast("上传图片不可超过6张");
        return;
      }
      if (leng > this.maxSize) {
        this.$toast("上传图片不可超过6张");
        return;
      }
      for (var i = 0; i < leng; i++) {
        if (this.judgeFileSize(file[i])) {
          return;
        }
        var reader = new FileReader(); // 使用 FileReader 来获取图片路径及预览效果
        _this.imgfiles.push(file[i]);
        reader.readAsDataURL(file[i]);
        reader.onload = function(e) {
          _this.imgs.push(e.target.result); // base 64 图片地址形成预览
        };
        this.currPicNum = this.currPicNum + 1;
      }
    },
    del(i, type) {
      // 根据下标删除
      this.imgfiles.splice(i, 1);
      this.imgs.splice(i, 1);
      console.log(this.imgs);
      console.log(this.imgfiles);
      if (type == 5) {
        this.showVideo = false;
      }
      this.currPicNum = this.currPicNum - 1;
    },
    publishEssay() {
      let _self = this;
      if (_self.content == "") {
        _self.$toast("请输入要发布的内容");
        return;
      }
      if (_self.content.length > _self.maxContentLength) {
        _self.$toast("发布的内容在" + _self.maxContentLength + "字以内");
        return;
      }
      if (_self.type == 5 && _self.imgfiles.length == 0) {
        _self.$toast("请选择要发布的视频");
        return;
      }
      if (_self.repeatClickFlag) {
        //正在发布,不能重复点击
        _self.$toast("正在发布中,请稍等~");
        return;
      }
      let form = new FormData();
      _self.content = _self.topicName + _self.content;
      form.append("content", _self.content);
      for (var i = 0; i < _self.imgfiles.length; i++) {
        var filePath = _self.imgfiles[i].name;
        console.log("filePath", filePath);
        if (filePath.split(".")[1]) {
          var fileFormat = filePath.split(".")[1].toLowerCase();
        }
        console.log("filePath", filePath.split(".")[1]);

        if (this.type == 5 && fileFormat.match(/png|jpg|jpeg/)) {
          this.$toast("请上传正确的视频格式");
          return;
        }
        form.append("files", _self.imgfiles[i]);
      }
      form.append("isForm", true);
      form.append("typeId", this.type);
      _self.repeatClickFlag = true;
      // if (_self.type == 5) {
      _self.loadingFlag = true;
      _self.loadingText = "发布中请稍后...";
      // }
      _self
        .$post("/api/userContent/publish", form)
        .then(res => {
          _self.repeatClickFlag = false;
          if (res.code == "200") {
            console.log(res);
            _self.$toast("发布成功");
            if (_self.type == 5) {
              _self.updateVideoTitleImg(res.data.uploadImage, res.data.cmsId);
            }
            _self.loadingFlag = false;
            if (isNum(this.topicId+"")) {
              this.$router.push({
                name: "detailTopic",
                params: {
                  id: this.topicId
                }
              });
            } else {
              _self.$router.push({
                name: this.topicId
              });
            }
          } else {
            _self.loadingFlag = false;
            _self.$toast(res.message);
          }
        })
        .catch(error => {
          _self.loadingFlag = false;
          _self.repeatClickFlag = false;
          console.log(error);
        });
    },
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
    selectTopic(name) {
      // if (this.content.length > this.maxContentLength) {
      //   this.$toast("发布的内容在" + this.maxContentLength + "字以内");
      //   return;
      // }
      console.log(name);
      this.topicName = "#" + name + "#";
      // this.content = this.content + "#" + name + "#";
      // this.contentHtml = this.applyHighlights(this.content);
      this.$refs.focusTextarea.focus();
      this.showTopicList = false;
    },
    getCmsTopicList() {
      let _self = this;
      _self
        .$post("/api/cmsTopic/listCmsTopic")
        .then(res => {
          console.log(res, "get topics");
          if (res.code == "200" && res.data) {
            _self.topicList = res.data.cmsTopicLits;
            this.letterList = res.data.letterList;
            this.followList = res.data.followList;
            this.topCmsTopicList = res.data.topCmsTopicList;
          } else {
            _self.$toast(res.message, 2);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleInput() {
      this.contentHtml = this.applyHighlights(this.content);
      if (this.content.length > this.maxContentLength) {
        this.$toast("发布的内容在" + this.maxContentLength + "字以内");
      }
    },
    bindFocus(e) {
      this.$refs.focusTextarea.focus();
    },
    judgeFileSize(file) {
      var limitSize = this.maxPicSize * 1024 * 1024;
      if (this.type == 5) {
        limitSize = this.maxVideoSize * 1024 * 1024;
      }
      const isLt5M = file.size > limitSize;
      console.log(file.size);
      if (isLt5M && this.type == 3) {
        this.$toast("上传图片大小不能超过" + this.maxPicSize + "MB!");
        return true;
      }
      if (isLt5M && this.type == 5) {
        this.$toast("上传视频大小不能超过" + this.maxVideoSize + "MB!");
        return true;
      }
    },
    scrollToTop: function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 100);
    },
    uploadVideo: function(event) {
      var _self = this;
      var event = event || window.event;
      var file = event.target.files[0];
      if (this.judgeFileSize(file)) {
        return;
      }
      _self.loadingFlag = true;
      _self.loadingText = "视频上传中...";
      var filesId = document.getElementById("pop_video"); //获取上传文件标签
      var videoId = document.getElementById("videoId"); //获取音频标签
      var url = this.getFileURL(filesId.files[0]); //把当前的 files[0]传给 getFileURL方法，getFileURL方法对其做一些处理
      videoId.src = url; //给video 标签设置src
      setTimeout(() => {
        var dura = videoId.duration;
        console.log(dura);
        if (Math.floor(dura) > this.videoMaxMinute) {
          this.$toast("上传的视频不能超过" + this.videoMaxMinute + "秒");
          return;
        }
        _self.imgfiles.push(filesId.files[0]);
        if (url) {
          _self.loadingFlag = false;
          this.showVideo = true;
        }
      }, 1.5 * 1000);
      this.getVideoPoster();
    },
    getFileURL: function(file) {
      //getFileURL方法接收数据并做一些处理。
      var getUrl = null;
      if (window.createObjectURL != undefined) {
        // basic
        getUrl = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // window.URL 标准定义
        // mozilla(firefox)
        getUrl = window.URL.createObjectURL(file); //获得一个http格式的url路径，这个时候就可以设置到<img>中显不了。
      } else if (window.webkitURL != undefined) {
        //window.webkitURL是webkit内核的实现 // webkit or chrome
        getUrl = window.webkitURL.createObjectURL(file);
      }
      return getUrl;
    },
    applyHighlights: function(text) {
      text = text
        .replace(/\n/g, "</br>")
        .replace(/<mark>/g, "")
        .replace(/<\/mark>/g, "")
        .replace(/#(.*?)#/g, "<mark>$&</mark>");
      return text;
    },
    clearSearch: function() {
      this.searchVal = "";
    },
    updateVideoTitleImg: function(videoUrl, cmsId) {
      console.log(videoUrl, cmsId);
      if (!videoUrl || !cmsId) {
        return;
      }
      let _self = this;
      let param = {};
      param.cmsId = cmsId;
      param.videoUrl = videoUrl;
      _self
        .$post("/api/userContent/updateVideoTitleImg", param)
        .then(res => {
          if (res.code == "200") {
            console.log("处理成功");
          } else {
            // _self.$toast(res.message, 2);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
<style lang="scss">
mark {
  color: #0f87ff;
  background-color: initial;
}
</style>

<style lang='scss' scoped>
@import "../../../assets/common/_base";
@import "../../../assets/common/_mixin";
@import "../../../assets/common/_var";

.publish_btn {
  @extend .g_v_mid;
  right: 3.3333vw;
  padding: 1.3333vw 2.9333vw;
  font-size: 4.2667vw;
  border-radius: 1.3333vw;
  color: #fff;
  background-color: #ff7e00;
}

.select_topic {
  @extend .flex_v_justify;
  padding: 0 4vw 3.3333vw 2.6667vw;
  font-size: 4vw;
  .topic {
    @extend .flex_hc;
    position: relative;
    font-size: 3.7333vw;
    color: #ccc;
    &.active {
      color: #3d85f6;
    }
    &::after {
      content: "";
      width: 2.4vw;
      height: 2.4vw;
      margin-left: 1.3333vw;
      border-width: 0 1px 1px 0;
      border-style: solid;
      border-color: #bbb;
      transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
    }
  }
}

.main {
  padding: 10px 0;
}
.mod_publish {
  padding: 10px 0;
  background-color: #fbfbfb;
}
.publish_txt {
  position: relative;
  height: 190px;
  textarea,
  .essays_con {
    width: 100%;
    height: 190px;
    padding: 0 15px;
    border: none;
    color: transparent;
    caret-color: #333;
    word-break: break-all;
    font: 14px/18px "Open Sans", sans-serif;
    @media (max-width: 320px) {
      font-size: 12px;
    }
    &::-webkit-input-placeholder {
      color: #c0c0c0;
    }
  }
  .title {
    height: 70px;
  }
  .essays {
    position: absolute;
  }
  .essays_con {
    position: absolute;
    word-wrap: break-word;
    color: #333;
  }
  .txt_num {
    position: absolute;
    bottom: 10px;
    left: 15px;
    font-size: 13px;
    color: #c0c0c0;
  }
}
.add_container {
  position: relative;
  @extend .flex_hc;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
}

.add_item {
  position: relative;
  width: 27.4%;
  padding-top: 26.9%;
  margin: 0 0 10px 10px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  input {
    @extend .g_v_c_mid;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  img,
  video {
    @extend .g_v_c_mid;
    width: 102%;
    height: 102%;
    border-radius: 8px;
    object-fit: cover;
  }
  .close {
    @include getClose(12px, #fff);
    right: 3px;
    top: 3px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  }
  .edit {
    position: absolute;
    bottom: 3px;
    left: 3px;
    z-index: 100;
    padding: 0 5px;
    font-size: 13px;
    line-height: 18px;
    color: #fff;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.7);
  }
}
.publish_img {
  .add_item {
    width: 95%;
    margin: 0 auto;
    padding-top: 36.8%;
    img,
    video {
      width: 102%;
      height: 102%;
      border-radius: 4px;
      object-fit: cover;
    }
    input {
      height: 140px;
    }
  }
  // .essays {
  //   height: 50px;
  // }
  .note_txt {
    height: 100px;
    margin-top: 5px;
    font-size: 13px;
    line-height: 25px;
    &::-webkit-input-placeholder {
      text-align: center;
    }
  }
}
.add_icon {
  @extend .g_v_c_mid;
  width: 24px;
  height: 24px;
  &::before {
    content: "";
    @extend .g_v_mid;
    left: 0;
    width: 100%;
    height: 3px;
    border-radius: 5px;
    background-color: #ddd;
  }
  &::after {
    content: "";
    @extend .g_c_mid;
    top: 0;
    width: 3px;
    height: 100%;
    border-radius: 5px;
    background-color: #ddd;
  }
}
.mod_project {
  top: initial;
  bottom: 0;
}
.project_con {
  @extend .flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  position: absolute;
  left: 0;
  top: 15.4667vw;
  width: 100%;
  height: calc(100% - 15.4667vw);
  background-color: #f0efee;
  h2 {
    padding-left: 15px;
  }
  h3 {
    position: relative;
    font-size: 16px;
    line-height: 36px;
    color: #333;
    text-align: center;
    font-weight: normal;
    background-color: #fff;
    .close {
      @extend .g_v_mid;
      right: 20px;
      width: 14px;
      height: 14px;
      @include getBgImg("../../../assets/images/matchtool/close.png");
    }
  }
  .search {
    @extend .flex_hc;
    height: 24px;
    margin: 12px;
    padding: 0 10px;
    background-color: #fff;
    border-radius: 24px;
    .search_icon {
      width: 18px;
      height: 18px;
      @include getBgImg("../../../assets/images/home/search.png");
    }
    input {
      flex: 1;
      height: 100%;
      padding-left: 10px;
      font-size: 14px;
    }
    .close {
      @include getClose(9px, #ddd);
      position: relative;
      border: 1px solid #ddd;
      border-radius: 50%;
    }
  }
}
.topic_talk {
  flex: 1;
  -webkit-flex: 1;
  background-color: #fff;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.sidebar {
  position: absolute;
  z-index: 99;
  top: 26.6667vw;
  right: 10px;
  height: 109.3333vw;
  overflow-y: auto;
  color: #c2c2c2;
  text-align: center;
  .icon-sousuo {
    font-size: 12px;
    color: currentColor;
  }
  a {
    display: block;
    margin: 10px 0;
    font-size: 15px;
    color: currentColor;
    &.active {
      color: #fff;
      background-color: #c2c2c2;
      border-radius: 50%;
    }
  }
}

.cms_topic,
.top_cms_topic {
  position: relative;
  &::after {
    content: "";
    @extend .g_c_mid;
    bottom: 0;
    width: 80%;
    height: 1px;
    background-color: #ddd;
  }
}
</style>
