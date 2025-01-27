package com.esportzoo.esport.connect.response.league;

import com.esportzoo.common.util.DateUtil;
import com.esportzoo.esport.constants.VideoGame;

import java.io.Serializable;
import java.util.Date;

/**
 * 赛事详情页返回数据
 * 
 * @author: wujing
 * @date:2019年5月8日上午10:58:24
 */
public class MatchDetailPageResponse implements Serializable {

	private static final long serialVersionUID = -2886355285137325888L;
	/** 赛程编号 */
	private Long matchId;
	/** 赛程名称 */
	private String name;
	/** 联赛id */
	private Long leagueId;
	/** 主队id */
	private Long homeTeamId;
	/** 客队id */
	private Long awayTeamId;
	/** 主队名称 */
	private String homeTeamName;
	/** 主队比分 */
	private Integer homeScore;
	/** 主队logo */
	private String homeTeamLogo;
	/** 客队名称 */
	private String awayTeamName;
	/** 客队比分 */
	private Integer awayScore;
	/** 客队logo */
	private String awayTeamLogo;
	/** 比赛开始时间 */
	private Date beginAt;
	/** 比赛结束 */
	private Date endAt;
	/** 状态 0未开赛，1进行中，2已结束 */
	private Integer status;
	/** 比赛一共多少局 */
	private Integer numberOfGames;
	/** 游戏类型 {@link VideoGame} */
	private Long videogameId;
	/** 聊天室地址 */
	private String chatSocketUrl;
	/** 联赛名称 */
	private String leagueName;
	/** 直播开关标识 */
	private Boolean liveFlag;
	private Long userId;
	private String nickName;

	public Long getMatchId() {
		return matchId;
	}

	public void setMatchId(Long matchId) {
		this.matchId = matchId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getLeagueId() {
		return leagueId;
	}

	public void setLeagueId(Long leagueId) {
		this.leagueId = leagueId;
	}

	public String getHomeTeamName() {
		return homeTeamName;
	}

	public void setHomeTeamName(String homeTeamName) {
		this.homeTeamName = homeTeamName;
	}

	public Integer getHomeScore() {
		return homeScore;
	}

	public void setHomeScore(Integer homeScore) {
		this.homeScore = homeScore;
	}

	public String getHomeTeamLogo() {
		return homeTeamLogo;
	}

	public void setHomeTeamLogo(String homeTeamLogo) {
		this.homeTeamLogo = homeTeamLogo;
	}

	public String getAwayTeamName() {
		return awayTeamName;
	}

	public void setAwayTeamName(String awayTeamName) {
		this.awayTeamName = awayTeamName;
	}

	public Integer getAwayScore() {
		return awayScore;
	}

	public void setAwayScore(Integer awayScore) {
		this.awayScore = awayScore;
	}

	public String getAwayTeamLogo() {
		return awayTeamLogo;
	}

	public void setAwayTeamLogo(String awayTeamLogo) {
		this.awayTeamLogo = awayTeamLogo;
	}

	public Date getBeginAt() {
		return beginAt;
	}

	public void setBeginAt(Date beginAt) {
		this.beginAt = beginAt;
	}

	public Date getEndAt() {
		return endAt;
	}

	public void setEndAt(Date endAt) {
		this.endAt = endAt;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getNumberOfGames() {
		return numberOfGames;
	}

	public void setNumberOfGames(Integer numberOfGames) {
		this.numberOfGames = numberOfGames;
	}

	public Long getVideogameId() {
		return videogameId;
	}

	public void setVideogameId(Long videogameId) {
		this.videogameId = videogameId;
	}

	public String getChatSocketUrl() {
		return chatSocketUrl;
	}

	public void setChatSocketUrl(String chatSocketUrl) {
		this.chatSocketUrl = chatSocketUrl;
	}

	public String getBeginAtStr() {
		if (null != beginAt) {
			return DateUtil.dateToString(beginAt, "yyyy-MM-dd HH:mm:ss");
		}
		return null;
	}

	public String getEndAtStr() {
		if (null != endAt) {
			return DateUtil.dateToString(endAt, "MM月dd日 HH:mm");
		}
		return null;
	}

	public Long getHomeTeamId() {
		return homeTeamId;
	}

	public void setHomeTeamId(Long homeTeamId) {
		this.homeTeamId = homeTeamId;
	}

	public Long getAwayTeamId() {
		return awayTeamId;
	}

	public void setAwayTeamId(Long awayTeamId) {
		this.awayTeamId = awayTeamId;
	}

	public String getLeagueName() {
		return leagueName;
	}

	public void setLeagueName(String leagueName) {
		this.leagueName = leagueName;
	}

	public Boolean getLiveFlag() {
		return liveFlag;
	}

	public void setLiveFlag(Boolean liveFlag) {
		this.liveFlag = liveFlag;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
}
