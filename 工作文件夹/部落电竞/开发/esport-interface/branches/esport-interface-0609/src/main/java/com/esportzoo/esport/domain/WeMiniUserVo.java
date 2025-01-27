package com.esportzoo.esport.domain;

import java.io.Serializable;

import com.alibaba.fastjson.JSONObject;
import com.esportzoo.esport.util.RegexUtils;

public class WeMiniUserVo implements Serializable {

	private static final long serialVersionUID = 6051420534399959885L;

	/**用户openId*/
	private String openId;
	/**用户unionId*/
	private String unionId;
	/**用户昵称*/
	private String nickName;
	/**用户头像*/
	private String avatarUrl;
	/**用户性别*/
	private Integer gender;
	/**所在城市*/
	private String city;
	/**所在国家*/
	private String country;
	/**所在省份*/
	private String province;
	
	public String getOpenId() {
		return openId;
	}
	
	public void setOpenId(String openId) {
		this.openId = openId;
	}
	
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getNickName() {
		return RegexUtils.filterEmoji(nickName, "").trim();
	}
	
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
	
	public String getAvatarUrl() {
		return avatarUrl;
	}
	
	public void setAvatarUrl(String avatarUrl) {
		this.avatarUrl = avatarUrl;
	}
	
	public Integer getGender() {
		return gender;
	}
	
	public void setGender(Integer gender) {
		this.gender = gender;
	}
	
	public String getCity() {
		return city;
	}
	
	public void setCity(String city) {
		this.city = city;
	}
	
	public String getCountry() {
		return country;
	}
	
	public void setCountry(String country) {
		this.country = country;
	}
	
	public String getProvince() {
		return province;
	}
	
	public void setProvince(String province) {
		this.province = province;
	}

	public static WeMiniUserVo convertByJson(JSONObject userInfoData) {
		WeMiniUserVo userVo = new WeMiniUserVo();
		userVo.setNickName(userInfoData.getString("nickName"));
		userVo.setAvatarUrl(userInfoData.getString("avatarUrl"));
		userVo.setGender(userInfoData.getInteger("gender"));
		userVo.setCity(userInfoData.getString("city"));
		userVo.setCountry(userInfoData.getString("country"));
		userVo.setProvince(userInfoData.getString("province"));
		userVo.setOpenId(userInfoData.getString("openId"));
		userVo.setUnionId(userInfoData.getString("unionId"));
    	return userVo;
    }
}