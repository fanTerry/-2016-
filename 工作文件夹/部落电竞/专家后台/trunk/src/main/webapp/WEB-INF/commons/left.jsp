<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<div class="nav">
    <div  onclick="window.location.href='/publish/index'" class="nav_list <c:if test="${param.menu == 'publish_article'}">cur</c:if>">
    	<i class="article_icon <c:if test="${param.menu == 'publish_article'}">fbwz_ch</c:if>"></i>
    	<a>发布文章</a>
		<span class='link_icon'></span>
    </div>
    <div onclick="window.location.href='/article/list'" class="nav_list <c:if test="${param.menu == 'article_list'}">cur</c:if>">
    	<i class="record_icon <c:if test="${param.menu == 'article_list'}">fbjl_ch</c:if>"></i>
    	<a>发布记录</a>
		<span class='link_icon'></span>
    </div>
    <div onclick="window.location.href='/income/list'" class="nav_list <c:if test="${param.menu == 'my_income'}">cur</c:if>">
		<i class="profit_icon <c:if test="${param.menu == 'my_income'}">lygl_ch</c:if>"></i>
		<a>我的收益</a>
		<span class='link_icon'></span>
    </div>
    <div  onclick="alert('功能开发中，请耐心等待 ')" class="nav_list <c:if test="${param.menu == 'myscore'}">cur</c:if>">
    	<i class="zj_icon"></i>
    	<a>我的战绩</a><!-- href="/score/my" -->
		<span class='link_icon'></span>
    </div>
    <div  onclick="alert('功能开发中，请耐心等待 ')" class="nav_list <c:if test="${param.menu == 'scorerank'}">cur</c:if>">
    	<i class="rank_icon <c:if test="${param.menu == 'scorerank'}">fbwz_ch</c:if>"></i>
    	<a>战绩排行</a><!-- href="/score/rank" -->
		<span class='link_icon'></span>
    </div>
    <div  onclick="alert('功能开发中，请耐心等待 ')" class="nav_list <c:if test="${param.menu == 'comment'}">cur</c:if>">
    	<i class="message_icon  <c:if test="${param.menu == 'comment'}">fbwz_ch</c:if>"></i>
    	<a>留言管理</a><!-- href="/comment/index" -->
		<span class='link_icon'></span>
    </div>
    <div  onclick="alert('功能开发中，请耐心等待 ')" class="nav_list <c:if test="${param.menu == 'news'}">cur</c:if>">
    	<i class="notice_icon  <c:if test="${param.menu == 'news'}">fbwz_ch</c:if>"></i>
    	<a>公告</a><!-- href="/news" -->
		<span class='link_icon'></span>
    </div>
    <c:if test="${!empty expertColumn}">
	<div class="pl50 pr lh42" style="padding-left: 0px; top: 10px; padding-bottom: 10px">
		<div class="sprite icon_fbjd"></div>
		<p class="recommend">专栏管理</p>
		<div class="sprite icon_bottom"></div>
		<ul class="recommend_mt60">
			<li <c:if test="${param.menu == 'column_edit'}">class="active_green"</c:if>><a href="/column/editColumn">我的专栏</a>
			</li>
			<li <c:if test="${param.menu == 'column_article'}">class="active_green"</c:if>><a href="/column/article">文章管理</a>
			</li>
			<li <c:if test="${param.menu == 'column_article_add'}">class="active_green"</c:if>><a href="/column/newArticle">发布文章</a>
			</li>
			<li <c:if test="${param.menu == 'column_reply'}">class="active_green"</c:if>><a href="/column/reply">留言管理</a>
			</li>
		</ul>
	</div>
	</c:if> 
</div>
<div class="advertisement">
	<i class='close'></i>
    <i class='abs'><img src="/resources/images/abs.png" alt=""></i>
    <span>公告:</span>
    <div id="jq_gg" class="scrollis1080" style="display:inline-block;vertical-align:bottom; width:550px;overflow:hidden; white-space:nowrap;">
    		<div id="jq_gg_content" class="scrollWrap1080">
    		</div>
    </div>
    <!-- <a href="" class="fr">更多公告</a> -->
</div>