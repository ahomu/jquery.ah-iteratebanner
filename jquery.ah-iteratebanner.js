/*
 * jQuery ah-iteratebanner plugin 0.1.2
 *
 * https://github.com/ahomu/jquery.ah-iteratebanner
 *
 * Copyright (c) 2012 Ayumu Sato ( http://havelog.ayumusato.com )
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
// @todo issue: キャプション検知
// @todo issue: Transitionに変更（タイマーアニメーションはfallback用）
(function($, win, doc) {

    // 強いられてるんだ
    'use strict';

$.fn.ahIterateBanner = function(options)
{
    // settings
    var defaults = {
            width        : 660,
            height       : 334,
            effectType   : 'fade', // fade | slide
            effectSpeed  : 300,
            iterateTime  : 5000,
            iterateMove  : 1,
            showControls : true,
            pauseOnHover : true,
            randomStart  : false
        },
        settings = $.extend({}, defaults, options);

    // shared
    var SELECTOR_DETECT_ITEMS = 'img',

        CLASS_CURRENT_IMAGE   = 'js_aibCurrent',
        CLASS_STAGE           = 'js_aibStage',
        CLASS_WRAPPER         = 'js_aibWrapper',
        CLASS_EFFECTER        = 'js_aibEffecter',
        CLASS_CTRL_NEXT       = 'js_aibCtrlNext',
        CLASS_CTRL_PREV       = 'js_aibCtrlPrev',

        EVENT_POINTER         =  ('ontouchend' in document.documentElement) ? 'touchend.aib' : 'click.aib'
    ;


    // construct
    /**
     * @Constructor
     *
     * @property {Boolean} running   timer runnning
     * @property {Number}  timer     interval timer
     * @property {Number}  pointer   position
     * @property {Number}  total     number of total IMG elments
     * @property {jQuery}  $wrapper  wrapper DIV
     * @property {jQuery}  $effecter effecter DIV
     * @property {jQuery}  $stage    staging IMG
     * @property {jQuery}  $imgs     collection of IMG elements
     * @property {jQuery}  $next     control
     * @property {jQuery}  $prev     control
     *
     * @param elm
     */
    function AhIterateBanner(elm) {
        var $first, that = this, $self = $(elm), t;

        // collection
        this.$imgs = $self.find(SELECTOR_DETECT_ITEMS);

        // save number of imgs
        this.total = this.$imgs.length;

        // remove content
        $self.find('> *').remove();

        // detect current
        if (settings.randomStart) {
            this.pointer = (Math.floor(Math.random() * this.$imgs.length)+1);
        } else {
            this.pointer = 1;
        }
        $first = this.getPointerImage();
        $first.addClass(CLASS_CURRENT_IMAGE);

        // create & insert wrapper
        this.$wrapper = this.createWrapper();
        this.$wrapper.prependTo(elm);
        this.$wrapper.css({
            width : settings.width,
            height: settings.height
        });

        // create & insert effecter
        this.$effecter = this.createEffecter();
        this.$effecter.appendTo(this.$wrapper);

        // create & insert stage
        this.$stage = this.createStage();
        this.$stage.appendTo(this.$wrapper);

        // create & insert controls
        if (!!settings.showControls) {
            this.$next  = this.createControl('next');
            this.$prev  = this.createControl('prev');

            // bind events
            this.$next.bind(EVENT_POINTER, function() {
                that.timerReset();
                that.moveNextItem();
            }).appendTo(this.$wrapper);
            this.$prev.bind(EVENT_POINTER, function() {
                that.timerReset();
                that.movePrevItem();
            }).appendTo(this.$wrapper);
            this.$wrapper.bind('mouseover.aibControl', function() {
                clearInterval(t);
                that.$next.fadeIn(150);
                that.$prev.fadeIn(150);
            });
            this.$wrapper.bind('mouseout.aibControl', function() {
                t = setTimeout(function() {
                    that.$next.hide();
                    that.$prev.hide();
                }, 100);
            });
        }

        // pasue when onmouseover
        if (!!settings.pauseOnHover) {
            this.$wrapper.bind('mouseover.aibPause', function() {
                that.running = false;
                that.timerStop();
            });
            this.$wrapper.bind('mouseout.aibPause', function() {
                that.running = true;
                that.timerStart();
            });
        }

        // start
        this.applyPointerToStage();
        this.timerStart();
        this.running = true;
    }

    /**
     * methods
     */
    $.extend(AhIterateBanner.prototype, {
        movePointer         : _movePointer,
        applyPointerToStage : _applyPointerToStage,
        getPointerImage     : _getPointerImage,
        createControl       : _createControl,
        createStage         : _createStage,
        createWrapper       : _createWrapper,
        createEffecter      : _createEffecter,
        showEffectLayer     : _showEffectLayer,
        movePrevItem        : _movePrevItem,
        moveNextItem        : _moveNextItem,
        timerStart          : _timerStart,
        timerStop           : _timerStop,
        timerReset          : _timerReset
    });

    function _applyPointerToStage() {
        var $current = this.getPointerImage(), $a, $b, a;

        this.$imgs.removeClass(CLASS_CURRENT_IMAGE);
        $current.addClass(CLASS_CURRENT_IMAGE);

        this.$stage.attr('src', $current.attr('src'));

        if (($a = $current.closest('a')) && $a.length) {
            if (($b = this.$stage.closest('a')) && $b.length) {
                a = $b.get(0);
                a.href = $a.attr('href');
            } else {
                a = doc.createElement('a');
                a.href = $a.attr('href');
                this.$stage.wrap(a);
            }
        }
    }

    function _movePointer(moveLength) {
        this.pointer += moveLength;

        if (this.pointer > this.total) {
            this.pointer -= this.total;
        }
        else if (this.pointer < 1) {
            this.pointer += this.total;
        }
    }

    function _getPointerImage(moveLength) {
        var p = (moveLength !== void 0) ? this.pointer + moveLength
                                        : this.pointer;

        if (p > this.total) {
            p -= this.total;
        }
        else if (p < 1) {
            p += this.total;
        }

        return this.$imgs.eq((p-1));
    }

    function _createControl(type) {
        var ctrl    = doc.createElement('button');
        switch(type) {
            case 'next':
                ctrl.className  = CLASS_CTRL_NEXT;
                $(ctrl).css({
                    display  : 'none',
                    position : 'absolute',
                    top      : '50%',
                    right    : '0',
                    height   : '50px',
                    marginTop: '-25px',
                    zIndex   : 20
                }).text('NEXT');
                break;
            case 'prev':
                ctrl.className  = CLASS_CTRL_PREV;
                $(ctrl).css({
                    display  : 'none',
                    position : 'absolute',
                    top      : '50%',
                    left     : '0',
                    height   : '50px',
                    marginTop: '-25px',
                    zIndex   : 20
                }).text('PREV');
                break;
        }
        return $(ctrl);
    }

    function _createStage() {
        var stage   = doc.createElement('img');
        stage.className = CLASS_STAGE;
        return $(stage);
    }

    function _createWrapper() {
        var wrapper = doc.createElement('div');
        wrapper.className = CLASS_WRAPPER;

        $(wrapper).css({
            position : 'relative',
            margin   : '0 auto'
        });
        return $(wrapper);
    }

    function _createEffecter() {
        var effecter = doc.createElement('div');
        effecter.className = CLASS_EFFECTER;

        $(effecter).css({
            display  : 'none',
            position : 'absolute',
            width    : settings.effectType === 'slide' ? settings.width * 2 : settings.width,
            top      : 0,
            left     : 0,
            zIndex   : 10
        });
        return $(effecter).hide();
    }

    function _showEffectLayer(moveLength) {
        switch(settings.effectType) {
            case 'fade':
                this.$effecter.empty().show();
                this.$effecter.append(this.getPointerImage().clone());
                this.$effecter.fadeOut(settings.effectSpeed);
                
                this.$stage.hide();
                this.movePointer(moveLength);
                this.applyPointerToStage();
                this.$stage.fadeIn(settings.effectSpeed);
                break;
            case 'slide' :
                var props = {},
                    reset = {left: '', right: ''},
                    that = this,
                    direction, left, right;

                if (moveLength > 0) {
                    direction = 'left';
                    left      = this.getPointerImage(  ).clone();
                    right     = this.getPointerImage(+1).clone();
                } else {
                    direction = 'right';
                    left      = this.getPointerImage(-1).clone();
                    right     = this.getPointerImage(  ).clone();
                }

                this.movePointer(moveLength);
                this.applyPointerToStage();
                this.$stage.hide();

                props[direction] = -settings.width;
                reset[direction] = 0;

                this.$effecter
                    .empty()
                    .append(left.add(right))
                    .css(reset)
                    .show()
                    .animate(props, settings.effectSpeed, 'linear', function() {
                        that.$stage.show();
                        $(this).hide();
                    })
                ;

                break;
        }
    }

    function _movePrevItem() {
        this.showEffectLayer(-1*settings.iterateMove);
    }

    function _moveNextItem() {
        this.showEffectLayer(settings.iterateMove);
    }

    function _timerStart() {
        var that = this;
        this.timer = win.setInterval(function() {
            that.moveNextItem();
        }, settings.iterateTime);
    }

    function _timerStop() {
        win.clearInterval(this.timer);
    }

    function _timerReset() {
        this.timerStop();
        if (this.running) {
            this.timerStart();
        }
    }

    this.each(function() {
        new AhIterateBanner(this);
    });

    return this;
}
})(jQuery, window, document);