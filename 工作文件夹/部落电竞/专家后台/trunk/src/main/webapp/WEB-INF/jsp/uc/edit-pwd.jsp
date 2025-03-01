<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Cache-Control" content="no-cache" />
    <title>部落(海南)电竞-编辑专栏</title>
    <link href="" rel="shortcut icon" type="image/x-icon" />
    <link rel="stylesheet" href="/resources/plugins/kindeditor/4.1.11/themes/default/default.css" />
    <link rel="stylesheet" href="/resources/js/datetimepicker/bootstrap-datetimepicker.min.css" />
    <jsp:include page="/WEB-INF/commons/common-file.jsp" />
    <script type="text/javascript" src="/resources/plugins/jquery.cookie/1.4.1/jquery.cookie.js"></script>
<body class="admin_bg">
	<!-- 头部 -->
	<jsp:include page="/WEB-INF/commons/header.jsp" />
	<div class="content clearfix">
	    <!-- 左侧菜单 -->
	    <jsp:include page="/WEB-INF/commons/left.jsp">
	        <jsp:param name="menu" value="" />
	    </jsp:include>
	    <style>
	        .login_form .inputBox{ width:auto;display:table;box-shadow:none;background:none;padding:0;height:auto;} 
			.login_form .inputBox input{width:500px;padding:0 24px;line-height:44px;height:44px;background:#fff;border:1px solid #DDDDDD;box-sizing:border-box;}
	        .login_form .inputBox .tit{ width: 88px;line-height:44px;height:44px;font-size:16px;text-align:left;margin-right:0;}
			.login_form .submit{margin-top:40px;width:250px;line-height:44px;height:44px;font-size:20px;border-radius:2px;} 
	        .addTipTxt{ text-align: left; padding-left: 100px; margin-top: 80px;}
	        .addTipTxt dt{ font-size: 16px; color: #666; margin-bottom: 12px;}
	        .addTipTxt dd{ font-size: 14px; color: #999; line-height:30px;}
	    </style>
	    <div class="aside">
	        <div class="wrap1080 ppd70">
	            <div class="change_title">修改密码：</div>
	            <form action="/user/savepwd" method="post" id="do-login">
		            <div class="login_form tac pt40">
		                <p class="error_txt red mb10" id="error_msg"></p>
		                <div class="inputBox">
		                    <span class="tit">旧密码:</span>
		                    <input type="password" id="oldpwd" name="oldPwd" placeholder="请输入旧密码" maxlength="30">
		                </div>
		                <div class="inputBox">
		                    <span class="tit">新密码:</span>
		                    <input type="password" id="newPwd" name="newPwd" placeholder="6-15位数字、字母组合" maxlength="30">
		                </div>
		                <div class="inputBox">
		                    <span class="tit">确认密码:</span>
		                    <input type="password" id="pwdRepeat" name="pwdRepeat" placeholder="请再次输入新密码" maxlength="30">
		                </div>
		                <a href="javascript:void(0)" class="submit" id="submit">提交</a>
		                <dl class="addTipTxt">
		                    <dt>安全提示：</dt>
		                    <dd>1、密码至少6位，由大小写字母和数字混合而成，安全性最高。</dd>
		                    <dd>2、不要与昵称太相似，容易被人猜到。</dd>
		                    <dd>3、不要使用手机电话号码、生日、学号、车牌号、身份证号、银行卡密码等个人信息。</dd>
		                    <dd>4、不要使用连续或重复的数字、字母，如：123456、abcdef、111111、aaaaaa等。</dd>
		                    <dd>5、定期修改密码以提升账户安全性。</dd>
		                </dl>
		            </div>
	           </form>
	        </div>
			<jsp:include page="/WEB-INF/commons/footer.jsp" />
		</div>
	</div>
<script>

$(document).ready(function(){
    $("#oldpwd,#pwdRepeat,#newPwd").focus(function () {
        $("#error_msg").text('');
    })
    $("#submit").click(function(){
		var _oldPwd = $("#oldpwd").val();
		var _newPwd = $("#newPwd").val();
		var _pwdRepeat = $("#pwdRepeat").val();
		
		if(_oldPwd == '' || _oldPwd == null){
			$("#error_msg").text("请输入旧密码");
            $("#oldpwd").focus();
			return;
		}
		if(_newPwd == '' || _newPwd == null){
			$("#error_msg").text("请输入新密码");
            $("#newPwd").focus();
			return;
		}
		if(_pwdRepeat == '' || _pwdRepeat == null){
			$("#error_msg").text("请输入确认密码");
            $("#pwdRepeat").focus();
			return;
		}
		if(_newPwd != _pwdRepeat) {
            $("#error_msg").text("新密码与旧密码不匹配");
            return;
        }
		if(_newPwd.length < 6){
			$("#error_msg").text("新密码长度小于6位");
			$account.focus();
			return;
		}

        var data = {};
        data.oldPwd = _oldPwd;
        data.newPwd = _newPwd;
        data.pwdRepeat = _pwdRepeat;
        $.ajax({
            type: "POST",
            dataType: "json",
            data: data,
            url: "/user/savepwd",
            success: function (result) {
                if(result.code == 200){
                    alert("密码修改成功");
                    setTimeout(function () {
                    	window.location.href='/login';
                   	}, 1000);
                } else{
                    $("#error_msg").text(result.msg);
                }
            }
        });
	});
})
</script>
</body>
</html>
