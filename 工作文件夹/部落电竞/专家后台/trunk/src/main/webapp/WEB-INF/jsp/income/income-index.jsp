<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Cache-Control" content="no-cache"/>
    <title>部落(海南)电竞</title>
    <link href="" rel="shortcut icon" type="image/x-icon" />
    <jsp:include page="/WEB-INF/commons/common-file.jsp"/>
    <link rel="stylesheet" href="/resources/js/datetimepicker/bootstrap-datetimepicker.min.css" />
    <script type="text/javascript" src="/resources/js/datetimepicker/bootstrap-datetimepicker.min.js"></script>

<body class="admin_bg">
<!-- 头部 -->
<jsp:include page="/WEB-INF/commons/header.jsp"/>
<div class="content clearfix">
    <!-- 左侧菜单 -->
    <jsp:include page="/WEB-INF/commons/left.jsp">
        <jsp:param name="menu" value="my_income"/>
    </jsp:include>
    <div class="aside">
        <div class="wrap1080 ppd70 fz14">
			<div class='change_title'>我的收益</div>
            <div class="clearfix fb_title ">
                <div class="fl pr pdr110">
                    <span class="fl">创建时间:</span>
                    <input type="text" id="startCreateTime" data-for="boxBeginTime" class="input01" placeholder="起始时间" readonly>
                    <i>—</i>
                    <input type="text" id="endCreateTime" data-for="boxEndTime" class="input01 input02" placeholder="结束时间" readonly>

                </div>
                <a href="javascript:;" id="query" class="fl">查询</a>
            </div>
            <div class=" fb_table">
                <table id="listContainer" width="100%">
                </table>
            </div>
            <div id="pageContainer" class="paging clearfix">
            </div>
        </div>
		<!-- 尾部 -->
		<jsp:include page="/WEB-INF/commons/footer.jsp"/>
    </div>
</div>


<jsp:include page="/WEB-INF/dot/dot-page.jsp"/>
<jsp:include page="/WEB-INF/jsp/income/dot-income.jsp"/>

<script type="text/javascript" src="/resources/plugins/jquery.ui/1.11.4/jquery-ui.min.js"></script>
<script type="text/javascript" src="/resources/plugins/doT/doT.min.js"></script>
<script type="text/javascript" src="/resources/js/jiedu.page.js"></script>
<script type="text/javascript" src="/resources/laydate/laydate.js"></script>

<script type="text/javascript">
    var jieduPage = $.fn.JieDuPage({
        url: "/income/articleSum",
        dotList : {containerId : "listContainer", dotId : "dot-incomelist"},
        dotPage : {containerId : "pageContainer", dotId : "dot-page"},
    });

    laydate.render({
        elem: '#startCreateTime' //指定元素
    });
    laydate.render({
        elem: '#endCreateTime' //指定元素
    });

    jieduPage.render();
    var queryJieDu = function(){
        jieduPage.render({
            data : {
                startCreateTime: $("#startCreateTime").val(),
                endCreateTime: $("#endCreateTime").val(),
            }
        });
    }

    $(document).ready(function(){
        // $("#startCreateTime, #endCreateTime").datepicker();
        $("#query").click(function() {
            queryJieDu();
        })
    })
</script>
</body>
</html>
