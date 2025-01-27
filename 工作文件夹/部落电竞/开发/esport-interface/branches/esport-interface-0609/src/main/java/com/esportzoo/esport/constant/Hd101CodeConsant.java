package com.esportzoo.esport.constant;

/**
 * @description: 前端活动弹窗返回码
 *
 * @author: Haitao.Li
 *
 * @create: 2019-09-22 10:07
 **/
public class Hd101CodeConsant {

	/** 返回可续命弹窗*/
	public static final String PAY_CONTIBUE_GAME = "2111", PAY_CONTIBUE_GAME_MESG = "支付1毛，再次挑战";

	/** 返回可续命弹窗*/
	public static final String NO_JOIN_CHANCE_TODAY = "1607",NO_JOIN_CHANCE_TODAY_MESG = "今天没有参与资格";

	/** 答案出错，并结束游戏，返回礼品弹窗*/
	public static final String GAME_OVER_BY_ANSWER_WRONG = "3222", GAME_OVER_BY_ANSWER_WRONG_MESG = "答题出错，不可续命，游戏结束";

	/** 答对所有题目，并获得头奖*/
	public static final String GAME_WIN_BY_FIRST_PRIZE = "3333", GAME_WIN_BY_FIRST_PRIZE_MESG = "答对所有题目，并获得头奖，游戏结束";

	/** 答对所有题目，没有获得头奖*/
	public static final String GAME_WIN_BYNO_NO_FIRST_PRIZE = "3111", GAME_WIN_BY_FIRST_NO_PRIZE_MESG = "答对所有题目，没有获得头奖，游戏结束";

	/** 返回可续命弹窗*/
	public static final String CAN_CONTINUE = "3444", CAN_CONTINUE_MESG = "当前可进行续命";

	/** 看视频，继续挑战弹窗*/
	public static final String WATCH_VOIDE_CONTIBUE_GAME = "4111", WATCH_VOIDE_CONTIBUE_GAME_MESG = "看视频，再次挑战";
}
