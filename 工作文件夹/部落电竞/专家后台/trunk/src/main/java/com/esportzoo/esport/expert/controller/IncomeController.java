package com.esportzoo.esport.expert.controller;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.date.DateUtil;
import com.esportzoo.common.appmodel.domain.result.ModelResult;
import com.esportzoo.common.appmodel.domain.result.PageResult;
import com.esportzoo.common.appmodel.page.DataPage;
import com.esportzoo.esport.client.service.common.SysConfigPropertyServiceClient;
import com.esportzoo.esport.client.service.expert.RecExpertColumnArticleServiceClient;
import com.esportzoo.esport.client.service.expert.RecOrderServiceClient;
import com.esportzoo.esport.constants.PayResultStatus;
import com.esportzoo.esport.constants.SysConfigPropertyKey;
import com.esportzoo.esport.constants.cms.expert.ExpertArticleStatus;
import com.esportzoo.esport.domain.RecExpert;
import com.esportzoo.esport.domain.RecExpertColumnArticle;
import com.esportzoo.esport.domain.RecOrder;
import com.esportzoo.esport.domain.SysConfigProperty;
import com.esportzoo.esport.expert.constant.ArticelIncomeResponse;
import com.esportzoo.esport.expert.result.ReturnResult;
import com.esportzoo.esport.vo.expert.RecExpertColumnArticleQueryVo;
import com.esportzoo.esport.vo.expert.RecOrderQueryVo;
import com.google.common.collect.Lists;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.List;

/**
 * @description: 收入分成比例
 *
 * @author: Haitao.Li
 *
 * @create: 2019-05-29 17:31
 **/
@Controller
@RequestMapping("income")
public class IncomeController extends BaseController {


	@Autowired
	@Qualifier("recExpertColumnArticleServiceClient")
	private RecExpertColumnArticleServiceClient recExpertColumnArticleServiceClient;

	@Autowired
	@Qualifier("recOrderServiceClient")
	private RecOrderServiceClient recOrderServiceClient;

	@Autowired
	private SysConfigPropertyServiceClient sysConfigPropertyServiceClient;

	@RequestMapping(value = "list")
	public String list(Model model, HttpServletRequest request){
		RecExpert expert = getLoginExpert(request);
		if (expert == null) {
			return "";
		}
		model.addAttribute("nickName", expert.getNickName());
		model.addAttribute("statusList", ExpertArticleStatus.getAllList());
		return "/income/income-index";
	}

	@RequestMapping("/articleSum")
	@ResponseBody
	public ReturnResult<DataPage<ArticelIncomeResponse>> articleProfitSum(HttpServletRequest request,RecExpertColumnArticleQueryVo queryVo,
			DataPage<RecExpertColumnArticle> dataPage) {
		DataPage<ArticelIncomeResponse> pageResponse = new DataPage<>();
		BeanUtil.copyProperties(dataPage,pageResponse);

		List<ArticelIncomeResponse> responseList = Lists.newArrayList();
		try {
			RecExpert expert = getLoginExpert(request);
			if (expert==null){
				logger.error("查询统计专家文章盈利数据，未登录");
				return ReturnResult.withSuccessResp(pageResponse);
			}
			queryVo.setUserId(expert.getUserId());
			if (queryVo.getEndCreateTime() != null) {
				queryVo.setEndCreateTime(DateUtil.endOfDay(queryVo.getEndCreateTime()));
			}
			if (queryVo.getStartCreateTime() != null) {
				queryVo.setStartCreateTime(DateUtil.beginOfDay(queryVo.getStartCreateTime()));
			}
			PageResult<RecExpertColumnArticle> pageResult = recExpertColumnArticleServiceClient.queryPage(queryVo, dataPage);
			if (!pageResult.isSuccess()) {
				logger.error("查询统计专家文章盈利数据,出错，错误信息：{}", pageResult.getErrorMsg());
				return ReturnResult.withSuccessResp(pageResponse);
			}

			if (pageResult.getPage().getDataList() != null && pageResult.getPage().getDataList().size() > 0) {

				List<RecExpertColumnArticle> articleList = pageResult.getPage().getDataList();
				SysConfigProperty configPropertyByKey = sysConfigPropertyServiceClient
						.getSysConfigPropertyByKey(SysConfigPropertyKey.EXPERT_ARTICLES_DIVIDED_PROPORTION,0,0L);
				String divideNum = configPropertyByKey.getValue();
				if (StringUtils.isEmpty(divideNum)){
					logger.error("查询统计专家文章盈利数据,没有配置分成比例");
					return ReturnResult.withErrorResp("没有配置分成比例");
				}
				for (RecExpertColumnArticle article : articleList) {
					ArticelIncomeResponse incomeResponse = new ArticelIncomeResponse();
					BeanUtil.copyProperties(article, incomeResponse);
					RecOrderQueryVo recOrderQueryVo = new RecOrderQueryVo();
					recOrderQueryVo.setColumnArticleId(article.getId());
					recOrderQueryVo.setPayStatus(PayResultStatus.PAY_SUCCESS.getIndex());
					ModelResult<List<RecOrder>> listModelResult = recOrderServiceClient.queryList(recOrderQueryVo);
					Integer count = 0;
					if (listModelResult.isSuccess() && listModelResult.getModel() != null) {
						count = listModelResult.getModel().size();
					}
					incomeResponse.setTimes(count);

					if (article.getPrice() != null) {
						/*读取后台配置的分成比例*/
						BigDecimal sum = article.getPrice().multiply(new BigDecimal(count));
						BigDecimal divideSum = sum.multiply(new BigDecimal(divideNum));
						incomeResponse.setPaySumMoney(sum);
						incomeResponse.setPayDividedMoney(divideSum);
					}
					responseList.add(incomeResponse);
				}

			}
			pageResponse.setDataList(responseList);
			pageResponse.setTotalCount(pageResult.getPage().getTotalCount());
		} catch (Exception e) {
			logger.error("查询统计专家文章盈利数据异常，异常信息：{}", e);
			return ReturnResult.withErrorResp("查询统计专家文章盈利数据异常");
		}

		return ReturnResult.withSuccessResp(pageResponse);

	}
}
