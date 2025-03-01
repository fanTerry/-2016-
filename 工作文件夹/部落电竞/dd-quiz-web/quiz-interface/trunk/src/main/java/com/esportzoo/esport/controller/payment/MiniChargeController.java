package com.esportzoo.esport.controller.payment;

import com.alibaba.fastjson.JSON;
import com.esportzoo.common.appmodel.domain.result.ModelResult;
import com.esportzoo.esport.client.service.charge.UserChargeOrderServiceClient;
import com.esportzoo.esport.connect.request.charge.ChargeRequst;
import com.esportzoo.esport.connect.response.CommonResponse;
import com.esportzoo.esport.connect.response.charge.ChargeResponse;
import com.esportzoo.esport.constants.ChannelProxy;
import com.esportzoo.esport.constants.EsportPayway;
import com.esportzoo.esport.constants.SysConfigPropertyKey;
import com.esportzoo.esport.constants.UserOperationParam;
import com.esportzoo.esport.controller.BaseController;
import com.esportzoo.esport.domain.SysConfigProperty;
import com.esportzoo.esport.domain.UserConsumer;
import com.esportzoo.esport.domain.charge.UserThirdOrder;
import com.esportzoo.esport.util.RequestUtil;
import com.esportzoo.esport.util.WxpayUtil;
import com.esportzoo.esport.vo.ChargePayRequest;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 新版小程序充值相关接口
 * @author wujing
 * @date 2019年8月15日 上午11:03:25
 */
@Controller
@RequestMapping("minicharge")
@Api(value = "新版小程序充值相关接口", tags = { "新版小程序充值相关接口" })
public class MiniChargeController extends BaseController {

	@Autowired
	private UserChargeOrderServiceClient userChargeOrderServiceClient;

	@Value("${appId}")
	private String appId;
	@Value("${signKey}")
	private String signKey;
	public static final String logPrefix = "新版小程序充值:";

	@RequestMapping(value = "/toCharge", produces = "application/json; charset=utf-8", method = RequestMethod.POST)
	@ApiOperation(value = "小程序充值", httpMethod = "POST", consumes = "application/x-www-form-urlencoded", produces = "application/json")
	@ApiResponse(code = 200, message = "充值", response = CommonResponse.class)
	@ResponseBody
	public CommonResponse<ChargeResponse> chargeRecScore(ChargeRequst chargeRequst, HttpServletRequest request) {
		try {
			UserConsumer userConsumer = getLoginUsr(request);
			if (userConsumer == null) {
				logger.info(logPrefix+"充值,未获取到登录用户信息");
				return CommonResponse.withErrorResp("未获取到登录用户信息");
			}
			logger.info(logPrefix+"用户【{}】在小程序发起充值,接收到的参数chargeRequst={}", userConsumer.getId(),JSON.toJSONString(chargeRequst));
			String chargeAmountStr = chargeRequst.getChargeAmount();
			if (chargeAmountStr.isEmpty()) {
				return CommonResponse.withErrorResp("充值金额不能为空");
			}
			SysConfigProperty sysConfigProperty = getSysConfigByKey(SysConfigPropertyKey.WXXCY_CHARGE_AMOUNT_LIST,chargeRequst.getClientType(),chargeRequst.getAgentId());
			List<String> chargeAmountList = Arrays.asList(sysConfigProperty.getValue().split(";"));
			if (!chargeAmountList.contains(chargeAmountStr)) {
				return CommonResponse.withErrorResp("充值金额不在充值列表项");
			}
			if (chargeRequst.getChargeWay()==null || !EsportPayway.getAllList().contains(EsportPayway.valueOf(chargeRequst.getChargeWay().intValue()))) {
				return CommonResponse.withErrorResp("充值方式参数错误");
			}
			UserThirdOrder order = new UserThirdOrder();
			order.setUserId(userConsumer.getId());
			order.setUserName(userConsumer.getNickName());
			order.setupFeature("propName", "充值" + chargeAmountStr + "元");
			order.setAmount(new BigDecimal(chargeAmountStr).multiply(new BigDecimal(100)).intValue());
			order.setBizSystem(chargeRequst.getBiz());
			order.setChannelIndex(EsportPayway.valueOf(chargeRequst.getChargeWay()).getChannelProxy().getIndex());
			order.setChargeWayIndex(chargeRequst.getChargeWay());
			logger.info(logPrefix+"充值,调用接口参数param={}", JSON.toJSONString(order));
			UserOperationParam userOperationParm = new UserOperationParam();
			userOperationParm.setSellChannel(chargeRequst.getAgentId());
			userOperationParm.setClientType(chargeRequst.getClientType());
			userOperationParm.setOperIp(RequestUtil.getClientIp(request));
			ModelResult<ChargePayRequest> modelResult = userChargeOrderServiceClient.insertUsrChargeOrder(order, userOperationParm);
			if (!modelResult.isSuccess()) {
				logger.info(logPrefix+"充值,调用接口返回错误,errorMsg={},param={}", modelResult.getErrorMsg(), JSON.toJSONString(order));
				return CommonResponse.withErrorResp("调用接口返回错误,errorMsg=" + modelResult.getErrorMsg());
			}
			ChargePayRequest chargePayRequest = modelResult.getModel();

			if (chargePayRequest == null) {
				logger.info(logPrefix+"充值,调用接口返回错误,chargePayRequest == null");
				return CommonResponse.withErrorResp("调用接口返回错误,chargePayRequest == null");
			}
			logger.info(logPrefix+"充值,调用接口返回值chargePayRequest={}", JSON.toJSONString(chargePayRequest));

			ChargeResponse chargeResponse = new ChargeResponse();
			chargeResponse.setChargeWay(chargeRequst.getChargeWay());

			if ( ChannelProxy.weixin_pay.getIndex()==chargeRequst.getChargeWay()){
				String prepayId = chargePayRequest.getPrepayId();
				if (StringUtils.isBlank(prepayId)) {
					logger.info(logPrefix+"充值,调用接口返回错误,prepayId == null");
					return CommonResponse.withErrorResp("调用接口返回错误,prepayId == null");
				}
				getWeixinPayRespParam(prepayId, chargeResponse);
				logger.info(logPrefix+"用户【{}】，微信支付返回参数param 【{}】",userConsumer.getId(),JSON.toJSONString(chargeResponse));
			}else {
				//其他支付,暂无其他参数需要返回
				logger.info(logPrefix+"用户：{}】发起充值金额[{}]成功",userConsumer.getId(),chargeRequst.getChargeAmount());
			}
			return CommonResponse.withSuccessResp(chargeResponse);


		} catch (Exception e) {
			logger.info(logPrefix+"充值发生异常,exception={}", e.getMessage(), e);
			return CommonResponse.withErrorResp(e.getMessage());
		}
	}

	private void getWeixinPayRespParam(String prepayId, ChargeResponse chargeResponse) {
		/** 微信支付返回参数组装 */
		String timeStamp = WxpayUtil.getTimeStampStr();
		String nonceStr = WxpayUtil.getRandomNonceStr(32);
		chargeResponse.setTimeStamp(timeStamp);
		chargeResponse.setNonceStr(nonceStr);
		chargeResponse.setPrepayId(prepayId);
		chargeResponse.setPaySign(getSign(timeStamp, nonceStr, prepayId));
	}

	private String getSign(String timeStamp, String nonceStr, String prepayId) {
		Map<String, String> params = new HashMap<String, String>();
		params.put("appId", appId);
		params.put("timeStamp", timeStamp);
		params.put("nonceStr", nonceStr);
		params.put("package", "prepay_id=" + prepayId);
		params.put("signType", "MD5");
		String sign = WxpayUtil.createMd5Sign(params, signKey);
		logger.info("唤起微信支付参数timeStamp={},nonceStr={},prepayId={},appId={},signKey={},sign={}",
				timeStamp, nonceStr, prepayId, appId, signKey, sign);
		return sign;
	}
}
