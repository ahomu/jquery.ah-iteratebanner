#jQuery ah-iteratebanner Plugin

*A plugin provide function of iterate banner images.*

なんとかの再発明品。シンプルな切り替わりイメージバナーです。

##使い方 - Usage

サンプルコード:

    <script src="./js/jquery.ah-iteratebanner.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
    $(function()
    {
        $('#js_iterateBanner').ahIterateBanner({
            width        : 660,     // バナーステージのwidth
            height       : 334,     // バナーステージのheight
            effectType   : 'fade',  // エフェクトの種類 fade | slide
            effectSpeed  : 300,     // エフェクトの速度(ms)
            iterateTime  : 5000,    // 切り替わりの間隔(ms)
            iterateMove  : 1,       // 切り替わり時に何枚分動くか
            showControls : true,    // next, prevのコントローラ表示
            pauseOnHover : true,    // ホバー時に一時停止する
            randomStart  : false    // ランダム表示
        });
    });
    </script>

    <div id="js_iterateBanner">
        <div>
            <a href="/path/to"><img src="/archives/01.jpg" alt="banner1" /></a>
        </div>
        <div>
            <a href="/path/to"><img src="/archives/02.jpg" alt="banner2" /></a>
        </div>
        <div>
            <a href="/path/to"><img src="/archives/03.jpg" alt="banner3" /></a>
        </div>
    </div>

##クレジット - Credit

Copyright 2012, Ayumu Sato ( http://havelog.ayumusato.com )