<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<!doctype html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<meta http-equiv="Cache-Control" content="no-cache" />
	<title>部落(海南)电竞</title>
	<link href="" rel="shortcut icon" type="image/x-icon" />
	<jsp:include page="/WEB-INF/commons/common-file.jsp" />
	<link rel="stylesheet" href="/resources/js/datetimepicker/bootstrap-datetimepicker.min.css" />
	<script type="text/javascript" src="/resources/js/datetimepicker/bootstrap-datetimepicker.min.js"></script>

<body class="admin_bg">
	<!-- 头部 -->
	<jsp:include page="/WEB-INF/commons/header.jsp" />

	<div class="content clearfix">
		<!-- 左侧菜单 -->
		<jsp:include page="/WEB-INF/commons/left.jsp">
			<jsp:param name="menu" value="article_list" />
		</jsp:include>
		<div class="aside">
			<div class="wrap1080 ppd70 fz14">
				<div class='change_title'>发布记录</div>
				<div class="clearfix fb_title ">
					<div class="fl pr pdr110">
						<span class="fl">创建时间:</span>
						<input type="text" id="startCreateTime1" class="input01" placeholder="起始时间">
						<i>—</i>
						<input type="text" id="endCreateTime1" class="input01 input02" placeholder="结束时间">
						<span class='pl16 pr8'>状态:</span>
						<select id="status">
							<option value="">全部</option>
							<c:forEach items="${statusList}" var="articleStatus">
								<option value="${articleStatus.index}">${articleStatus.description}</option>
							</c:forEach>
						</select>
						<span class='right_arrow'></span>
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
			<jsp:include page="/WEB-INF/commons/footer.jsp" />
		</div>
	</div>


	<jsp:include page="/WEB-INF/dot/dot-page.jsp" />
	<jsp:include page="/WEB-INF/dot/dot-articlelist.jsp" />

	<script type="text/javascript" src="/resources/plugins/jquery.ui/1.11.4/jquery-ui.min.js"></script>
	<script type="text/javascript" src="/resources/plugins/doT/doT.min.js"></script>
	<script type="text/javascript" src="/resources/js/jiedu.page.js"></script>
	<script type="text/javascript">
		var jieduPage = $.fn.JieDuPage({
			url: "/article/listData",
			dotList: { containerId: "listContainer", dotId: "dot-articleList" },
			dotPage: { containerId: "pageContainer", dotId: "dot-page" },
		});
		jieduPage.render();
		var queryJieDu = function () {
			jieduPage.render({
				data: {
					startCreateTime: $("#startCreateTime1").val(),
					endCreateTime: $("#endCreateTime1").val(),
					status: $("#status").val()
				}
			});
		}

		$(document).ready(function () {
			$("#startCreateTime1, #endCreateTime1").datepicker();
			$("#query").click(function () {
				queryJieDu();
			})
		})
	</script>
</body>
</html>
