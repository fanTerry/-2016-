<template>
  <div>
    <div class="loading" ></div>
  </div>


</template>

<script>
  export default{
  }
</script>

<style scoped>
  .loading {
    top: 0;
    left: 0;
    z-index: 1000002;
    background-color: rgba(255, 255, 255, .6);
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: hidden;
  }

  .loading:before {
    content: "";
    background: url('./loading.png') no-repeat center center;
    height: .64rem;
    width: .64rem;
    top: 50%;
    left: 50%;
    position: fixed;
    margin: -20px 0 0 -20px;
  }

  .loading:after {
    content: "Loading...";
    top: 59%;
    left: 53%;
    transform: translate(-44%, -50%);
    -ms-transform: translate(-44%, -50%);
    -webkit-transform: translate(-44%, -50%);
    -moz-transform: translate(-44%, -50%);
    -o-transform: translate(-44%, -50%);
    position: fixed;
    color: #1581cc;
    font-size: 14px
  }
</style>
