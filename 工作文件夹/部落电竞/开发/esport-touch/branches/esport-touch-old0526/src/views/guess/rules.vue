<template>
  <div class="Page guessRules">
    <header class="mod_header">
      <navBar :pageTitle="'预测规则'"></navBar>
    </header>
    <div class="main">
      <section>
        <h3>枫叶电竞<span>(枫叶电竞是什么?)</span></h3>
        <p>
          枫叶电竞是一款有趣专业的电竞赛事平台，这里有丰富的电竞赛事内容，覆盖LOL，王者，DOTA2，CSGO，守望先锋等多款游戏；有全球电竞赛事过往比赛视频及对战信息；有业余赛事可供参赛圆你职业电竞梦想；也有互动赛事预测满你单车变摩托的心愿。
        </p>
      </section>
      <!-- <section>
        <h3>枫叶电竞为您提供多元预测渠道，满足您的体验需求。</h3>
        <p>
          ① PC预测页面：http://quiz.esportzoo.com<br>
          ② 微信预测页面：https://m.esportzoo.com/guess/home?agentId=10006&biz=1&clientType=7<br>
          ③ 微信小程序：枫叶电竞-预测<br>
          ④ 微信公众号：枫叶电竞服务号-预测
        </p>
      </section> -->
      <section>
        <h3>预测星星<span>(星星是什么？如何使用?)</span></h3>
        <p>预测星星为枫叶电竞中的虚拟积分，是官方唯一可用来参与电竞赛事预测娱乐的平台积分。预测星星仅可通过平台每日签到，或通过微信支付系统赠送获得。其中预测星星仅可用来赛事预测，不可赠送他人，不可转让他人，不可兑换现金。</p>
      </section>
      <!-- <section>
        <h3>每日签到<span>(如何签到获取官方赠送的预测星星？)</span></h3>
        <p>
          每日签到采取“自然周连续签到”奖励规则：首日领取星星为100，第二日200，第三日300，第四日400，第五日500，第六日600，第七日随机金豆（700及以上随机)，用户按自然周进行累计统计，累积日为用户签到天数的累积，积累签到越多后续签到获得星星数量越多。
        </p>
        <p>
          例：星期一至星期日一个自然周的7天时间内，玩家小明共在周二，周四到访并成功签到，若周日再来签到，周日为该用户累积签到第三天，则周日小明应可一次性领取300星星，用户当周三天签到所得星星数为：100（周二）+200（周四）+300（周日）=600（当周总共领取）。时间到了下周一，则重新开启自然周累积统计。
        </p>
        <p>因此最有效的领取方式是从周一到周日每天都来签到领取，最高单周可领取2800+以上星星总额。</p>
        <p>每日签到获取的预测星星具备使用有效期，7天内不消耗使用即会清空，请玩家领取后尽快使用。</p>
      </section> -->
      <section>
        <h3>椰子分<span>(椰子分有何用？如何兑换椰子分？)</span></h3>
        <p>
          椰子分为官方唯一预测兑奖积分，玩家可通过预测星星1：1等值兑换（即1星星=1椰子分），星星一经兑换为椰子分后不可回退，请玩家根据所需使用数量合理进行兑换。椰子分可用于兑换椰子分平台所提供的各项服务，包括“黄金兑换，话费充值，加油卡充值，超市购物，生活缴费，卡券兑换，海南旅游，海南特产，信用卡还款”等，服务内容和椰子分产品体验均归属椰子积分平台负责，如对积分使用有任何疑问及兑换跟踪问题请在椰子分页面内联系客服进行处理。
        </p>
      </section>
      <section>
        <h3>椰子分商城兑换规则</h3>
        <p>
          ① 椰子分商城兑换仅可使用椰子分一次性全额兑换，不可使用椰子分+现金的形式兑换。<br>
          ② 椰子分商城的兑换将在3个工作日内发货。<br>
          ③ 兑换过程中的实名认证是根据相关规定进行纳税申报使用。<br>
          ④ 成功兑换商品或服务的用户，可在商城查看“我的椰子分”，纳税申报将在次月20日前进行。<br>
          ⑤
          椰子分可在“椰子竞技积分”平台的“兑换商城”兑换商品或服务，兑换的商品或服务自商家发货之日起，大部分兑换的商品支持7天无理由退换货服务（兑换的服务或生鲜易腐定制商品等不支持退换货，详情查看以下内容），特殊商品除外。<br>
          ⑥ 发生退货时支持部分自动退回椰子分余额，可以并仅限未超过7天无理由退货时限的商品或服务；特殊情况下的退款，已缴纳的税款将不予退还。<br>
        </p>
      </section>
      <section>
        <h3>预测规则<span>(如何进行星星预测？结果如何判定？)</span></h3>
        <p>
          1.我方提供的电子竞技赛事的开赛日期及时间仅作参考，不保证一定准确。这意味着如果一场比赛提供的日期和/或时间不正确，投注仍然成立。<br>
          如果一场比赛确实遭到了暂停或延期，而且未在实际确定的开赛时间之后12小时内继续，那么这场比赛上的投注无效并予以退款。<br>
          本规则的例外情况：不管比赛是否暂停或延期，有关一支队伍/选手能否在锦标赛中晋级或夺冠的投注始终有效。<br>
        </p>
        <p>
          2.在一个联赛中，如果一名选手或队伍的名字被错误拼写，只要能清楚地知道是在哪个游戏或哪场比赛上进行了投注，所有投注都将有效。如果一名选手更改了他们的名称，只要能清楚地知道是在哪个游戏或哪场比赛上进行了投注，使用他们之前的名称提供的盘口都将有效。如果一支队伍更改名字但是阵容一样，那么比赛期间，所有投注于新队名称以及旧队名均有效，但如果一支队伍被全新的阵容以及每个玩家都不同于原来队伍的参赛队取代，则所有的投注将被视为无效（超过一个队员不一样则视为无效）。
        </p>
        <p>
          3.如果正式比赛中选手使用错误的昵称或小号参加比赛，结果仍会有效，但该选手明显不是原应参加比赛选手的情形除外。对于替补问题，无论参赛队伍有多少个替补上场，只要代表的队伍没有变更，都不影响预测，预测结算正常进行。
        </p>
        <p>
          4.所有投注都使用相关竞赛主管部门公布的官方结果进行结算。
        </p>
        <p>
          5.如果没有平局选项，加时赛（若有）也计算在内。
        </p>
        <p>
          6.让分盘投注：根据具体比赛，电子竞技比赛的让分可采用轮/赛局/击杀数或其他计算方式。让分在本网站仅以“让分”表示。（例如，在CS:GO中是指获胜的一轮比赛，而在Starcraft2中则指获胜的一场赛局。）<br>
          让分的目的是让体育赛事双方更加对等，让博彩更加有趣。在电子竞技投注中，让分的方式是让给弱势方球队/选手某些赛局/轮/击杀数或其他。<br>
          例如：<br>
          让分盘 赔率<br>
          选手A -1.5 2.00<br>
          选手B +1.5 1.85<br>
          如果选手A赢比赛两赛局或以上，则投注选手A的玩家胜出，投注选手B的玩家落败。如果选手A只多赢了一局或选手B获胜，则投注选手B的玩家胜出，投注选手A的玩家落败。<br>
        </p>
        <p>
          7.总分盘投注：电子竞技比赛的总分盘可采用轮/局/击杀数或其他赛况或是基于比赛的其他计分方式。<br>
          总分仅以“总分”表示。 <br>
          Starcraft2 BO3举例：<br>
          大盘 2.5 1.93<br>
          小盘 2.5 1.93<br>
          若一方队员以2-0比分获胜，则所有小盘2.5投注为赢，大盘投注为输。若一方队员以2-1比分获胜，则所有大盘投注为赢，小盘投注为输。<br>
        </p>
        <p>
          8.在比赛进行的时候，出现赛事方判负，弃权，队伍/选手退赛，会按不同情况进行结算处理，具体如下(此条同时适用于DOTA2以及CSGO的比赛,比赛开始以DOTA/LOL中BP阶段结束为准，CSGO以第一局手枪局造成伤害为准)：<br>
          (1) BO1 的比赛中，如 A 在比赛开始之后的比赛中被判负，弃权，队伍/选手退赛，则取消所有未结算的相关预测。<br>
          (2)
          在比赛中（除BO1的比赛），出现其中一局被判负，弃权，队伍/选手退赛；若后续比赛正常进行，则保留后续比赛预测，仅取消当局未结算的相关预测与总局让分大小分玩法；若后续比赛一并判负，则取消所有未结算的相关预测。<br>
        </p>
        <p>
          9.如果某选手/赛队在赛事开始前退赛，或在赛中退赛，则有关该选手夺冠或赛事晋级的投注将被取消，并退还投注金。<br>
          如果被列为“必须参赛”的相应选手/赛队在赛事开始前退赛，则有关该选手/赛队晋级或夺冠的投注无效，并退还投注金 – 此项规定适用于参赛的所有选手/赛队。<br>
        </p>
        <p>
          10.在比赛中，如果选手在游戏进行期间中断连线且无法重新连线，并在剩下的游戏进行期间被更换，该地图与总局未结算的的所有投注将会被取消。
        </p>
        <p>
          11.如果之前公布的地图数/局数发生改变或者比赛的地图/赛局格式不正确，那么让分盘和总分盘上的所有投注都会取消。有关胜负盘（比赛结果）的投注将继续有效。
        </p>
        <p>
          12.如果选手或战队在至少一张地图上不战而胜（非地图优势）或由组委会决定获胜，或如果至少一张地图被推迟超过12小时，系列赛的所有投注（胜负盘、让分盘和总分盘）将被取消并退还投注金。
          在CS:GO中，如果有一支战队在一张地图上所有计划轮次开赛前退赛或被取消资格，系列赛的所有投注（胜负盘、让分盘和总分盘）也将被取消并退还投注金。
        </p>
        <p>
          13.对于已经结算完的比赛，由于不可抗因素造成造成赛后对该比赛进行重新判罚，将不做参考，按照已经完成的比赛事实进行结算。
        </p>
        <p>
          14.即场投注：
          在即场投注中，如果因平局、掉线或类似原因导致某一局比赛重赛，若重赛开赛时间在12小时内，那么有关这一局比赛的所有即场投注仍将有效，但已经结算的玩法如FBL,HS玩法不会取消；若重赛开赛时间在12小时外，那么有关这一局比赛的所有即场投注将被取消。
        </p>
        <p>
          15.特别投注：<br>
          分钟：在地图比赛时间上提供的总分盘（以分钟计）。如果地图比赛时间短于提供的分钟总数，那么“小盘”上的投注将获胜，“大盘”上的投注将输掉。如果地图比赛时间长于提供的分钟总数，那么“大盘”上的投注将获胜，“小盘”上的投注将输掉。如果地图比赛时间和总分盘上提供的分钟总数相同，那么投注将算作平手，投注金额将被返还。
          <br>
          例子：Dota2的分钟特别投注上的分钟总数为36。<br>
          如果地图在36:02结束，那么“大盘”上的投注将获胜，“小盘”上的投注将输掉。<br>
          如果地图在35:45结束，那么“小盘”上的投注将获胜，“大盘”上的投注将输掉。<br>
          如果地图正好在36:00结束，那么投注将算作平手，投注金额将被返还。<br>
          第一座防御塔：第一个被毁掉一座防御塔的队伍在该投注中落败。<br>
          第一滴血：DOTA2和LOL比赛中，以游戏内提示一方获得“第一滴血”的标语为准，CSGO比赛中指两队比分得分计分板为依据，先拿下第一分便是一血，而非第一个击杀。<br>
          第一个获得10杀：在游戏中的计分板中首先得到10杀的队伍是该项投注中的胜出者。<br>
          第一轮：赢得第一轮的队伍是该项投注中的胜出者。<br>
          第一个赢得前5轮：赢得前5轮的队伍是该项投注中的胜出者。<br>
          在Dota2和LOL中，任何杀敌数特别投注将使用游戏中的计分板派彩，计分板显示在游戏屏幕的顶部。<br>
          首Roshan/大龙玩法：率先击杀第一个大龙/roshan的队伍获胜，如果在DOTA2中出现抢盾的情况，以击杀Roshan的队伍为准。<br>
        </p>
        <p>
          16.如果5v5队比赛开场时选手数低于10名，或6v6队比赛开场时选手数低于12名，将取消该局和系列上的所有投注。在Dota2和LOL中，如果有选手在最初10分钟断线并无法重新连接，或在剩下的比赛中被替换，将取消该局和系列上的所有投注。在CS:GO中，如果至少有5轮由不到10名选手完成，将取消该局和系列上的所有投注。一个或多个选手在进入Dota2或LOL比赛10分钟后断开或退出，不构成在该局（以及该局相关的特别投注）取消下注的有效理由。
        </p>
        <p>
          17.如果某张地图在部分完成后重置，任何已确定的特别投注（第一滴血、第一座防御塔、第一个10杀等）将按部分完成的局的结果进行派彩。任何尚未确定的特别投注将以重制的结果进行派彩。
        </p>
        <p>
          18.针对CS:GO即场盘：当投注在标有“全枪全弹”的盘口时，比如Natus Vincere（第4局，全枪全弹）对Virtus
          Pro（第4局，全枪全弹），您的投注对象是谁将赢得本局。为了让设在本局上的投注成立，“全枪全弹”是一个必须满足的条件。<br>
          例如，当投注在Natus Vincere（第4局，全枪全弹）对Virtus Pro（第4局，全枪全弹），您投注的对象是哪支队伍将赢得第四局。然而，如果两支队伍中的一支未能达成“全枪全弹”，该局的所有投注将取消。<br>
          “全枪全弹”的定义如下：<br>
          每支队伍最多只有一名选手以一把价值不到$1000的主要武器开局。 武器不一定为选手本人购买，也可以是由一名队友给予。<br>
          例子：<br>
          NaVi对Virtus Pro：<br>
          NaVi属于T方，4名选手买入一把AK47，一名选手没有足够的钱，只买入一把Tec-9。Virtus Pro的所有选手都用步枪开局。因为只有一名选手以一把价值不到$1000的主要武器开局， 所以投注仍成立。<br>
          NaVi对Virtus Pro：<br>
          NaVi属于T方，4名选手买入一把AK47，一名选手只买入一把沙漠之鹰。Virtus
          Pro有四名选手以M4A1开局，一名选手以一支Five-Seven手枪开局。因为两队中各只有一名选手以一把价值不到$1000的主要武器开局， 所以投注仍成立。<br>
          NaVi对Virtus Pro：<br>
          NaVi属于T方，3名选手以一把AK47开局，2名选手只买入一把Tec-9。无论Virtus
          Pro队的选手购买什么，因同一队中有两名或更多选手以价值不到$1000的主武器开始了本轮比赛，本轮的所有投注都将被取消。<br>
        </p>
        <p>
          19.在一场比赛中，当一支队伍/选手有一张或者一张以上的地图优势时，我们提供的“地图 1”始终指游戏中实际使用的第一张地图，“地图 2”指游戏中实际使用的第二张地图，以此类推。该规则与获取优势的原因无关。
        </p>
        <p>
          20.在绝地求生中，一局游戏中存活的最后一支队伍或玩家被视为该局的胜者。即使给定游戏局中有另外的队伍或玩家累积了更多的分数，该局的胜者仍然照此判定。
        </p>
      </section>
      <section>
        <h3>开奖结算<span>(何时开奖？何时派奖？)</span></h3>
        <p>
          系统会根据单局比赛赛果，单局比赛内事件结果进行开奖，开奖时间取决于游戏赛事官方记分板、广播或游戏API结算周期。系统会产生“待开奖”“开奖中”“派奖中”等状态，请玩家耐心等待。单场比赛胜负项会在比赛结束后15分钟内完成派奖；其他预测项会在比赛结束30分钟内完成派奖；
        </p>
      </section>
      <section>
        <h3>处罚声明<span>(做什么会被处罚？)</span></h3>
        <p>用户在参与并平台服务过程中如有以下行为，平台将视情节严重程度，对用户对出做出暂时或永久性禁止登陆，删除注册账户及服务数据，删除相关信息，追缴损失等处理。情节严重将移交有关行政管理部门予以行政处罚或追究刑事责任：</p>
        <p>
          1，使用非法外挂的行为；<br>
          2，盗取他人注册账号的行为；<br>
          3，私自进行注册账号交易的行为；<br>
          4，利用平台系统漏洞获利的行为；<br>
          5，私自进行货币交易的行为；
        </p>
      </section>
      <section>
        <h3>信息联络<span>(如何联系我们？)</span></h3>
        <p>客服QQ号①：2943894994
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客服QQ号②：2732470865<br>
          <!-- 微信公众号：枫叶电竞服务号<br>微信小程序：枫叶电竞<br>玩家可以绑定关注枫叶电竞微信号，绑定账号之后，可实时收到即时结算信息。<br> -->
        </p>
      </section>
      <section>
        <p>请各位玩家珍惜枫叶电竞这样一个轻松的娱乐互动平台，共同维护平台的健康成长!</p>
        <p>枫叶电竞保留对规则的最终解释权以及随时修改规则的必要权利。感谢大家的监督与喜爱，你们的支持驱动我们不断前行。</p>
      </section>
    </div>
  </div>
</template>

<script>
import navBar from "../../components/header/nav_bar/index";

export default {
  components: {
    navBar
  },
  props: [],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
.guessRules {
  background: #1f1212;
  .mod_header {
    background-color: #321919;
  }
  .nav_bar {
    color: #fedcd7 !important;
  }
  .back {
    &::before,
    &::after {
      background-color: #a26767 !important;
    }
  }
}
</style>


<style lang='scss' scoped>
.main {
  padding: 0 5.3333vw 10.6667vw;
  p {
    padding-top: 1.3333vw;
    font-size: 3.73vw;
    line-height: 5.6vw;
    text-align: justify;
    word-break: break-all;
  }
}

section {
  margin-top: 5.3333vw;
  color: #c08c85;
}

h3 {
  font-size: 4vw;
  line-height: 6.9333vw;
  span {
    color: #fe5049;
  }
}
</style>
