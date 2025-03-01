package com.esportzoo.esport.controller.cms;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.esportzoo.common.appmodel.domain.result.ModelResult;
import com.esportzoo.common.appmodel.domain.result.PageResult;
import com.esportzoo.common.appmodel.page.DataPage;
import com.esportzoo.common.util.RandomUtil;
import com.esportzoo.esport.connect.request.FollowRequest;
import com.esportzoo.esport.connect.request.cms.CmsTopicListRequest;
import com.esportzoo.esport.connect.response.CommonResponse;
import com.esportzoo.esport.constants.cms.CmsTopicStatus;
import com.esportzoo.esport.constants.cms.CmsTopicUpClickEnum;
import com.esportzoo.esport.constants.cms.FollowObjectType;
import com.esportzoo.esport.constants.cms.FollowStatus;
import com.esportzoo.esport.controller.BaseController;
import com.esportzoo.esport.domain.CmsTopic;
import com.esportzoo.esport.domain.NewsListVo;
import com.esportzoo.esport.domain.UserConsumer;
import com.esportzoo.esport.domain.UserFollow;
import com.esportzoo.esport.manager.CmsContentManager;
import com.esportzoo.esport.service.cms.CmsTopicService;
import com.esportzoo.esport.service.cms.UserFollowService;
import com.esportzoo.esport.vo.cms.CmsTopicQueryParam;
import com.esportzoo.esport.vo.cms.CmsTopicResponse;
import com.esportzoo.esport.vo.cms.CmsTopicVo;
import com.esportzoo.esport.vo.cms.UserFollowQueryVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * @ClassName CmsTopicController
 * @Description 话题
 * @Author jiajing.he
 * @Date 2019/8/27  14:35
 * @Version 1.0
 **/
@Controller
@RequestMapping("cmsTopic")
@Api(value = "话题相关接口", tags={"话题相关接口"})
public class CmsTopicController extends BaseController {

    private transient final Logger logger = LoggerFactory.getLogger(CmsTopicController.class);

    @Autowired
    private CmsTopicService cmsTopicService;
    @Autowired
    private UserFollowService userFollowService;

    @Autowired
    private CmsContentManager cmsContentManager;

    public static final String logPrefix ="话题相关接口";

    @RequestMapping("listCmsTopic")
    @ApiOperation(value = "话题页列表", httpMethod = "POST", consumes = "application/x-www-form-urlencoded", produces = "application/json")
    @ApiResponse(code = 200, message = "话题页列表", response = CommonResponse.class)
    @ResponseBody
    public CommonResponse<JSONObject> listCmsTopic(HttpServletRequest request, CmsTopicListRequest cmsTopicListRequest){
        ModelResult<CmsTopicResponse> cmsTopicResponseModelResult = null;

			JSONObject jsonObject = new JSONObject();
			//获取当前用户
			UserConsumer loginUsr = getLoginUsr(request);
//			if (loginUsr==null){
//				return CommonResponse.withSuccessResp("");
//			}
			//未登录
			try {

				if (null == loginUsr || null == loginUsr.getId()) {
					cmsTopicResponseModelResult = cmsTopicService.queryOrderByOrderTag(null);
				} else {
					cmsTopicResponseModelResult = cmsTopicService.queryOrderByOrderTag(loginUsr.getId());
				}
				if (!cmsTopicResponseModelResult.isSuccess() ||cmsTopicResponseModelResult.getModel()==null) {
					logger.error(logPrefix+"用户：【{}】，接口参数param 【{}】",loginUsr.getId(), JSON.toJSONString(cmsTopicListRequest));
					return CommonResponse.withErrorResp("获取数据异常");
				}
				CmsTopicResponse model = cmsTopicResponseModelResult.getModel();
				if (null != model) {
					LinkedHashMap<String, LinkedHashSet<CmsTopicVo>> cmsTopicLits = model.getCmsTopicLits();
					Set<String> letterList = cmsTopicLits.keySet();
					LinkedHashSet<CmsTopicVo> followList = model.getAttentionCmsTopicList();
					jsonObject.put("followList", followList);
					/*只保留8个*/
//					if (followList != null && followList.size() >8) {
//						List<CmsTopicVo> topicVos = CollectionUtil.sub(followList, 0, 8);
//						jsonObject.put("followList", topicVos);
//					}

					jsonObject.put("cmsTopicLits", model.getCmsTopicLits());
					//字母列表
					jsonObject.put("letterList", letterList);
					jsonObject.put("topCmsTopicList",model.getTopCmsTopicList());
					return CommonResponse.withSuccessResp(jsonObject);
				}
			} catch (Exception e) {
				logger.error("查询话题列表页出现异常,错误信息：{}", e.getMessage());
				e.printStackTrace();
				return CommonResponse.withErrorResp("查询话题列表页出现异常");

			}
			return CommonResponse.withErrorResp("查询话题列表页出现异常");
    }

    @ApiOperation(value = "获取话题列表接口", httpMethod = "POST", consumes = "application/x-www-form-urlencoded", produces = "application/json")
    @ApiResponse(code = 200, message = "", response = CommonResponse.class)
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    @ResponseBody
    public CommonResponse<PageResult<CmsTopic>> getCmsContentDetailById(HttpServletRequest request, CmsTopicListRequest cmsTopicListRequest) {
        try {
            DataPage<CmsTopic> dataPage = new DataPage<CmsTopic>(cmsTopicListRequest.getPageNo(), 50);
            CmsTopicQueryParam param = new CmsTopicQueryParam();
            param.setStatus(CmsTopicStatus.USE.getIndex());
            ModelResult<PageResult<CmsTopic>> modelResult = cmsTopicService.queryPage(param, dataPage);
            if (null == modelResult || !modelResult.isSuccess()) {
                return CommonResponse.withErrorResp("查询话题列表异常");
            }
            return CommonResponse.withSuccessResp(modelResult.getModel());
        } catch (Exception e) {
            logger.info("获取话题列表接口，发生异常，exception={}", e.getMessage(), e);
            return CommonResponse.withErrorResp(e.getMessage());
        }
    }

    @RequestMapping("followCmsTopic/{cmsTopicId}")
    @ApiOperation(value = "关注或取关话题", httpMethod = "POST", consumes = "application/x-www-form-urlencoded", produces = "application/json")
    @ApiResponse(code = 200, message = "关注或取关话题", response = CommonResponse.class)
    @ResponseBody
    public CommonResponse<Boolean> followCmsTopic(HttpServletRequest request, @PathVariable("cmsTopicId") Long cmsTopicId, Integer status) {
        UserConsumer loginUsr = null;

        try {
            loginUsr = getLoginUsr(request);
            if (null == loginUsr || null == loginUsr.getId()) {
                logger.error("话题关注异常 用户能不为空！");
                return CommonResponse.withErrorResp("请先登录！");
            }

            UserFollow userFollow = new UserFollow();
            userFollow.setUserId(loginUsr.getId());
            userFollow.setObjectType(FollowObjectType.TOPIC.getIndex());
            userFollow.setObjectId(cmsTopicId);
            /**1是关注 0是取消 @see{@link FollowStatus} */
            FollowStatus followStatus = FollowStatus.valueOf(status);
            UserFollowQueryVo userFollowQueryVo = new UserFollowQueryVo();
            BeanUtils.copyProperties(userFollow,userFollowQueryVo);
            ModelResult<List<UserFollow>> queryList = userFollowService.queryList(userFollowQueryVo);
            if ( queryList.isSuccess() && queryList.getModel()!=null && queryList.getModel().size()>0) {
                /*更新*/
                List<UserFollow> listModel = queryList.getModel();
                UserFollow follow = listModel.get(0);
                if (followStatus!=null ) {
                    follow.setStatus(status);
                }
                Calendar time = Calendar.getInstance();
                userFollow.setUpdateTime(time);
                ModelResult<Integer> update = userFollowService.update(follow);
                if (FollowStatus.FOLLOW.getIndex()==status.intValue()){
                    cmsTopicService.upClick(CmsTopicUpClickEnum.FANS.getVal(), 1, cmsTopicId);
                }
                else {
                    cmsTopicService.upClick(CmsTopicUpClickEnum.FANS.getVal(), -1, cmsTopicId);
                }
                if (!update.isSuccess() || 1 != update.getModel().intValue()) {
                    logger.error("用户【{}】关注话题【{}】异常 【{}】！", loginUsr.getId(), cmsTopicId, update.getErrorMsg());
                    return CommonResponse.withErrorResp("服务器开小差啦");
                }
            }else {
                /*增加记录*/
                Calendar time = Calendar.getInstance();
                userFollow.setCreateTime(time);
                userFollow.setUpdateTime(time);
                ModelResult<Long> save = userFollowService.save(userFollow);
                cmsTopicService.upClick(CmsTopicUpClickEnum.FANS.getVal(), 1, cmsTopicId);
                if (!save.isSuccess() || 1 != save.getModel().intValue()) {
                    logger.error("用户【{}】关注话题【{}】异常 【{}】！", loginUsr.getId(), cmsTopicId, save.getErrorMsg());
                    return CommonResponse.withErrorResp("服务器开小差啦");
                }
            }

            return CommonResponse.withSuccessResp(followStatus.getDescription());
        } catch (Exception e) {
            logger.error("用户【{}】关注话题【{}】异常 【{}】！", loginUsr.getId(), cmsTopicId, e.getMessage(), e);
            return CommonResponse.withErrorResp("服务器开小差啦");
        }

    }

    @RequestMapping("showCmsTopicDetails/{cmsTopicId}")
    @ApiOperation(value = "进入话题独立页", httpMethod = "POST", consumes = "application/x-www-form-urlencoded", produces = "application/json")
    @ApiResponse(code = 200, message = "进入话题独立页", response = CommonResponse.class)
    @ResponseBody
    public CommonResponse<CmsTopicResponse> showCmsTopicDetails(HttpServletRequest request,@PathVariable("cmsTopicId") Long cmsTopicId, CmsTopicListRequest cmsTopicListRequest){
        if (null==cmsTopicId){
            logger.error("话题id为null！");
            return CommonResponse.withErrorResp("服务器开小差啦");
        }
        //增加话题观看量
        cmsTopicService.upClick(CmsTopicUpClickEnum.VIEW.getVal(), 1, cmsTopicId);
        CmsTopicResponse cmsTopicResponse = new CmsTopicResponse();

        try {
            UserConsumer loginUsr = getLoginUsr(request);
            ModelResult<CmsTopic> cmsTopicModelResult = cmsTopicService.queryCmsTopicById(cmsTopicId);
            //目标话题
            CmsTopic cmsTopic = cmsTopicModelResult.getModel();
            if (!cmsTopicModelResult.isSuccess() || null==cmsTopic){
                logger.error("进入话题独立页失败【{}】异常 【{}】！",cmsTopicId,cmsTopicModelResult.getErrorMsg());
                return CommonResponse.withErrorResp("服务器开小差啦");
            }

            //封装话题相关内容
            CmsTopicVo cmsTopicVo = new CmsTopicVo();
            BeanUtil.copyProperties(cmsTopic, cmsTopicVo, CopyOptions.create().setIgnoreNullValue(true));
            cmsTopicVo.setFans(0>cmsTopicVo.getFans().intValue()?0:cmsTopicVo.getFans());
            LinkedHashSet<String> icons = new LinkedHashSet<>();
            //目前话题页中用户关注头像
            for (int i = 0; i < 6; i++) {
                int random = RandomUtil.getRandom(10000, 10506);
                String randomAvartar = "https://rs.esportzoo.com/upload/schedule/user_icon/user_icon_" + random + ".jpg";
                icons.add(randomAvartar);
            }
            //随机头像
            cmsTopicVo.setIcons(icons);
            //设置观看数
            int idNum = cmsTopicVo.getId().intValue() % 100;
            cmsTopicVo.setViews(cmsTopicVo.getComments()*2+cmsTopicVo.getViews().intValue()+idNum);
            //未登录进入详情页
            if (null==loginUsr || null==loginUsr.getId()){
                cmsTopicResponse.setCmsTopicVo(cmsTopicVo);
            }else {
                Long userId=loginUsr.getId();
                cmsTopicService.updateCmsNumRedis(userId, cmsTopicId);
                //用户是否关注话题
                UserFollowQueryVo userFollowQueryVo = new UserFollowQueryVo();
                userFollowQueryVo.setUserId(userId);
                userFollowQueryVo.setObjectType(FollowObjectType.TOPIC.getIndex());
                userFollowQueryVo.setObjectId(cmsTopicId);
                userFollowQueryVo.setStatus(FollowStatus.FOLLOW.getIndex());
                ModelResult<List<Long>> folloResult = userFollowService.queryObjectIdList(userFollowQueryVo);
                List<Long> model = folloResult.getModel();
                if (!folloResult.isSuccess()){
                    logger.error("查询话题【{}】 用户是否关注出现异常【{}】",cmsTopicId,folloResult.getErrorMsg());
                    return CommonResponse.withErrorResp("服务器开小差啦");
                }
                //未关注
                if (null==model || 0>=model.size()){
                    cmsTopicResponse.setCmsTopicVo(cmsTopicVo);
                }else {
                    cmsTopicVo.setAttention(true);
                    cmsTopicResponse.setCmsTopicVo(cmsTopicVo);
                }

            }
            return CommonResponse.withSuccessResp(cmsTopicResponse);
        } catch (Exception e) {
            logger.error("进入话题独立页【{}】异常 【{}】！",cmsTopicId,e.getMessage(),e);
            return CommonResponse.withErrorResp("服务器开小差啦");
        }
    }

    @RequestMapping("showCmsTopicContent")
    @ApiOperation(value = "话题资讯信息", httpMethod = "POST", consumes = "application/x-www-form-urlencoded", produces = "application/json")
    @ApiResponse(code = 200, message = "话题资讯信息", response = CommonResponse.class)
    @ResponseBody
    public CommonResponse showCmsTopicContent(HttpServletRequest request,CmsTopicListRequest cmsTopicListRequest){
        logger.info(logPrefix+"话题资讯信息 接收到参数【{}】",JSONObject.toJSONString(cmsTopicListRequest));
        try {
            UserConsumer loginUsr = getLoginUsr(request);
            Long cmsTopicId = cmsTopicListRequest.getId();
            if (null==loginUsr || null ==loginUsr.getId()){
                return CommonResponse.withErrorResp("请先登录！");
            }
            if (null==cmsTopicId){
                return CommonResponse.withErrorResp("请稍后再试！");
            }
            //资讯类型 如果为null 则是全部
            Integer contentType = cmsTopicListRequest.getContentType();
//            if (contentType==100){
//            	contentType=null;
//			}
            //用户id
            Long userId = loginUsr.getId();
            //Long userId=145630L;
            //话题id 如果没有 则查用户关注的话题id
            //只展示查询单个话题资讯列表
 /*           if (null==cmsTopicId){
                UserFollowQueryVo userFollowQueryVo = new UserFollowQueryVo();
                userFollowQueryVo.setUserId(userId);
                userFollowQueryVo.setObjectType(FollowObjectType.TOPIC.getIndex());
                userFollowQueryVo.setStatus(FollowStatus.FOLLOW.getIndex());
                ModelResult<List<UserFollow>> listModelResult = userFollowService.queryList(userFollowQueryVo);
                if (!listModelResult.isSuccess()){
                    logger.error("查询用户【{}】关注话题异常【{}】",userId,listModelResult.getErrorMsg());
                    return CommonResponse.withErrorResp("服务器开小差啦！");
                }
                List<UserFollow> follows = listModelResult.getModel();
                if (null==follows || 0>=follows.size()){
                    //没有关注话题 返回空
                    return CommonResponse.withSuccessResp(null);
                }
                //用户关注话题列表
                List<Long> topicIds = follows.stream().map(UserFollow::getObjectId).collect(Collectors.toList());
                cmsTopicIds.addAll(topicIds);
            }else {
            }*/
            FollowRequest followRequest = new FollowRequest();
            followRequest.setCmsTopicId(cmsTopicId);
            followRequest.setContentType(contentType);
            followRequest.setUserId(userId);
            followRequest.setPageNo(cmsTopicListRequest.getPageNo());
            followRequest.setPageSize(cmsTopicListRequest.getPageSize());
            followRequest.setAgentId(cmsTopicListRequest.getAgentId());
            followRequest.setBiz(cmsTopicListRequest.getBiz());
            followRequest.setClientType(cmsTopicListRequest.getClientType());
            List<NewsListVo> followerCmsContentList = cmsContentManager.getFollowerCmsContentList(followRequest);
            return CommonResponse.withSuccessResp(followerCmsContentList);
        } catch (Exception e) {
            logger.error("查看话题资讯异常 【{}】！",e.getMessage(),e);
            return CommonResponse.withErrorResp("服务器开小差啦");
        }
    }
}
