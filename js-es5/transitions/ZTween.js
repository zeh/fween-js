/// <reference path='../signals/SimpleSignal.ts'/>
/// <reference path='Easing.ts'/>
define(["require", "exports", '../signals/SimpleSignal', 'Easing'], function (require, exports, SimpleSignal_1, Easing_1) {
    var zehfernando;
    (function (zehfernando) {
        var transitions;
        (function (transitions) {
            /**
             * @author Zeh Fernando
             */
            var ZTween = (function () {
                // ================================================================================================================
                // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
                /**
                 * Creates a new Tween.
                 *
                 * @param	p_scope				Object		Object that this tweening refers to.
                 */
                function ZTween(target, properties, parameters) {
                    if (properties === void 0) { properties = null; }
                    if (parameters === void 0) { parameters = null; }
                    this._target = target;
                    this.properties = new Array();
                    for (var pName in properties) {
                        this.properties.push(new ZTweenProperty(pName, properties[pName]));
                    }
                    this.timeCreated = ZTween.currentTime;
                    this.timeStart = this.timeCreated;
                    // Parameters
                    this.time = 0;
                    this.delay = 0;
                    this.transition = Easing_1.default.none;
                    this._onStart = new SimpleSignal_1.default();
                    this._onUpdate = new SimpleSignal_1.default();
                    this._onComplete = new SimpleSignal_1.default();
                    // Read parameters
                    if (parameters != null) {
                        if (parameters.hasOwnProperty("time"))
                            this.time = parameters["time"];
                        if (parameters.hasOwnProperty("delay"))
                            this.delay = parameters["delay"];
                        if (parameters.hasOwnProperty("transition"))
                            this.transition = parameters["transition"];
                        if (parameters.hasOwnProperty("onStart"))
                            this._onStart.add(parameters["onStart"]); // , parameters["onStartParams"]
                        if (parameters.hasOwnProperty("onUpdate"))
                            this._onUpdate.add(parameters["onUpdate"]);
                        if (parameters.hasOwnProperty("onComplete"))
                            this._onComplete.add(parameters["onComplete"]);
                    }
                    //transitionParams	=	new Array();
                    this._useFrames = false;
                    this._paused = false;
                    //skipUpdates		=	0;
                    //updatesSkipped	=	0;
                    this.started = false;
                }
                // ================================================================================================================
                // STATIC PSEUDO-CONSTRUCTOR --------------------------------------------------------------------------------------
                ZTween._init = function () {
                    // Starts the engine
                    this.currentTimeFrame = 0;
                    this.currentTime = 0;
                    this.frameTick();
                };
                // ================================================================================================================
                // INTERNAL functions ---------------------------------------------------------------------------------------------
                ZTween.prototype.updateCache = function () {
                    this.timeDuration = this.timeComplete - this.timeStart;
                };
                // ==================================================================================================================================
                // ENGINE functions -----------------------------------------------------------------------------------------------------------------
                /**
                 * Updates all existing tweenings.
                 */
                ZTween.updateTweens = function () {
                    //trace ("updateTweens");
                    this.l = this.tweens.length;
                    for (this.i = 0; this.i < this.l; this.i++) {
                        if (this.tweens[this.i] == null || !this.tweens[this.i].update(this.currentTime, this.currentTimeFrame)) {
                            // Old tween, remove
                            this.tweens.splice(this.i, 1);
                            this.i--;
                            this.l--;
                        }
                    }
                };
                /**
                 * Ran once every frame. It's the main engine; updates all existing tweenings.
                 */
                ZTween.frameTick = function () {
                    // Update time
                    this.currentTime = (new Date()).getTime();
                    // Update frame
                    this.currentTimeFrame++;
                    // Update all tweens
                    this.updateTweens();
                    window.requestAnimationFrame(this.frameTick.bind(this));
                };
                // ================================================================================================================
                // PUBLIC STATIC functions ----------------------------------------------------------------------------------------
                /**
                 * Create a new tweening for an object and starts it.
                 */
                ZTween.add = function (target, properties, parameters) {
                    if (properties === void 0) { properties = null; }
                    if (parameters === void 0) { parameters = null; }
                    var t = new ZTween(target, properties, parameters);
                    this.tweens.push(t);
                    return t;
                };
                /**
                 * Remove tweenings for a given object from the active tweening list.
                 */
                /*
                public static function remove(__target:Object, ...__args):boolean {
                    // Create the list of valid property list
                    //var properties:Vector.<String> = new Vector.<String>();
                    //l = args["length"];
                    //for (i = 0; i < l; i++) {
                    //	properties.push(args[i]);
                    //}
        
                    // Call the affect function on the specified properties
                    return affectTweens(removeTweenByIndex, __target, __args);
                }
                */
                ZTween.updateTime = function () {
                    // Force a time update - should only be used after complex calculations that take a lot more than a frame
                    this.currentTime = (new Date()).getTime();
                };
                ZTween.remove = function (target) {
                    var props = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        props[_i - 1] = arguments[_i];
                    }
                    var tl = [];
                    var l = this.tweens.length;
                    var i;
                    var j;
                    // TODO: use filter?
                    for (i = 0; i < l; i++) {
                        if (this.tweens[i] != null && this.tweens[i]._target == target) {
                            if (props.length > 0) {
                                for (j = 0; j < this.tweens[i].properties.length; j++) {
                                    if (props.indexOf(this.tweens[i].properties[j].name) > -1) {
                                        this.tweens[i].properties.splice(j, 1);
                                        j--;
                                    }
                                }
                                if (this.tweens[i].properties.length == 0)
                                    tl.push(this.tweens[i]);
                            }
                            else {
                                tl.push(this.tweens[i]);
                            }
                        }
                    }
                    var removedAny = false;
                    l = tl.length;
                    for (i = 0; i < l; i++) {
                        j = this.tweens.indexOf(tl[i]);
                        this.removeTweenByIndex(j);
                        removedAny = true;
                    }
                    return removedAny;
                };
                ZTween.hasTween = function (target) {
                    //return (getTweens.apply(([__target] as Array).concat(__props)) as Vector.<ZTween>).length > 0;
                    var props = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        props[_i - 1] = arguments[_i];
                    }
                    var l = this.tweens.length;
                    var i;
                    var j;
                    // TODO: use filter?
                    for (i = 0; i < l; i++) {
                        if (this.tweens[i] != null && this.tweens[i]._target == target) {
                            if (props.length > 0) {
                                for (j = 0; j < this.tweens[i].properties.length; j++) {
                                    if (props.indexOf(this.tweens[i].properties[j].name) > -1) {
                                        return true;
                                    }
                                }
                            }
                            else {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                ZTween.getTweens = function (target) {
                    var props = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        props[_i - 1] = arguments[_i];
                    }
                    var tl = [];
                    var l = this.tweens.length;
                    var i;
                    var j;
                    var found;
                    // TODO: use filter?
                    //trace ("ZTween :: getTweens() :: getting tweens for "+__target+", "+__props+" ("+__props.length+" properties)");
                    for (i = 0; i < l; i++) {
                        if (this.tweens[i] != null && this.tweens[i]._target == target) {
                            if (props.length > 0) {
                                found = false;
                                for (j = 0; j < this.tweens[i].properties.length; j++) {
                                    if (props.indexOf(this.tweens[i].properties[j].name) > -1) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (found)
                                    tl.push(this.tweens[i]);
                            }
                            else {
                                tl.push(this.tweens[i]);
                            }
                        }
                    }
                    return tl;
                };
                ZTween.pause = function (target) {
                    var props = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        props[_i - 1] = arguments[_i];
                    }
                    var pausedAny = false;
                    var ftweens = this.getTweens.apply(null, ([target]).concat(props));
                    var i;
                    //trace ("ZTween :: pause() :: pausing tweens for " + __target + ": " + ftweens.length + " actual tweens");
                    // TODO: use filter/apply?
                    for (i = 0; i < ftweens.length; i++) {
                        if (!ftweens[i].paused) {
                            ftweens[i].pause();
                            pausedAny = true;
                        }
                    }
                    return pausedAny;
                };
                ZTween.resume = function (target) {
                    var props = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        props[_i - 1] = arguments[_i];
                    }
                    var resumedAny = false;
                    var ftweens = this.getTweens.apply(null, ([target]).concat(props));
                    var i;
                    // TODO: use filter/apply?
                    for (i = 0; i < ftweens.length; i++) {
                        if (ftweens[i].paused) {
                            ftweens[i].resume();
                            resumedAny = true;
                        }
                    }
                    return resumedAny;
                };
                /**
                 * Remove a specific tweening from the tweening list.
                 *
                 * @param		p_tween				Number		Index of the tween to be removed on the tweenings list
                 * @return							boolean		Whether or not it successfully removed this tweening
                 */
                ZTween.removeTweenByIndex = function (i) {
                    //__finalRemoval:boolean = false
                    this.tweens[i] = null;
                    //if (__finalRemoval) tweens.splice(__i, 1);
                    //tweens.splice(__i, 1);
                    //return true;
                };
                /**
                 * Do some generic action on specific tweenings (pause, resume, remove, more?)
                 *
                 * @param		__function			Function	Function to run on the tweenings that match
                 * @param		__target			Object		Object that must have its tweens affected by the function
                 * @param		__properties		Array		Array of strings that must be affected
                 * @return							boolean		Whether or not it successfully affected something
                 */
                /*
                private static function affectTweens (__affectFunction:Function, __target:Object, __properties:Array):boolean {
                    var affected:boolean = false;
        
                    l = tweens.length;
        
                    for (i = 0; i < l; i++) {
                        if (tweens[i].target == __target) {
                            if (__properties.length == 0) {
                                // Can affect everything
                                __affectFunction(i);
                                affected = true;
                            } else {
                                // Must check whether this tween must have specific properties affected
                                var affectedProperties:Array = new Array();
                                var j:uint;
                                for (j = 0; j < p_properties.length; j++) {
                                    if (boolean(_tweenList[i].properties[p_properties[j]])) {
                                        affectedProperties.push(p_properties[j]);
                                    }
                                }
                                if (affectedProperties.length > 0) {
                                    // This tween has some properties that need to be affected
                                    var objectProperties:uint = AuxFunctions.getObjectLength(_tweenList[i].properties);
                                    if (objectProperties == affectedProperties.length) {
                                        // The list of properties is the same as all properties, so affect it all
                                        p_affectFunction(i);
                                        affected = true;
                                    } else {
                                        // The properties are mixed, so split the tween and affect only certain specific properties
                                        var slicedTweenIndex:uint = splitTweens(i, affectedProperties);
                                        p_affectFunction(slicedTweenIndex);
                                        affected = true;
                                    }
                                }
                            }
                        }
                    }
                    return affected;
                }
                */
                // ================================================================================================================
                // PUBLIC INSTANCE functions --------------------------------------------------------------------------------------
                // Event interceptors for caching
                ZTween.prototype.update = function (currentTime, currentTimeFrame) {
                    if (this._paused)
                        return true;
                    this.cTime = this._useFrames ? currentTimeFrame : currentTime;
                    if (this.started || this.cTime >= this.timeStart) {
                        if (!this.started) {
                            this._onStart.dispatch();
                            for (this.i = 0; this.i < this.properties.length; this.i++) {
                                // Property value not initialized yet
                                this.tProperty = this.properties[this.i];
                                // Directly read property
                                this.pv = this._target[this.tProperty.name];
                                this.tProperty.valueStart = isNaN(this.pv) ? this.tProperty.valueComplete : this.pv; // If the property has no value, use the final value as the default
                                this.tProperty.valueChange = this.tProperty.valueComplete - this.tProperty.valueStart;
                            }
                            this.started = true;
                        }
                        if (this.cTime >= this.timeComplete) {
                            // Tweening time has finished, just set it to the final value
                            for (this.i = 0; this.i < this.properties.length; this.i++) {
                                this.tProperty = this.properties[this.i];
                                this._target[this.tProperty.name] = this.tProperty.valueComplete;
                            }
                            this._onUpdate.dispatch();
                            this._onComplete.dispatch();
                            return false;
                        }
                        else {
                            // Tweening must continue
                            this.t = this.transition((this.cTime - this.timeStart) / this.timeDuration);
                            for (this.i = 0; this.i < this.properties.length; this.i++) {
                                this.tProperty = this.properties[this.i];
                                this._target[this.tProperty.name] = this.tProperty.valueStart + this.t * this.tProperty.valueChange;
                            }
                            this._onUpdate.dispatch();
                        }
                    }
                    return true;
                };
                ZTween.prototype.pause = function () {
                    if (!this._paused) {
                        this._paused = true;
                        this.timePaused = this._useFrames ? ZTween.currentTimeFrame : ZTween.currentTime;
                    }
                };
                ZTween.prototype.resume = function () {
                    if (this._paused) {
                        this._paused = false;
                        var timeNow = this._useFrames ? ZTween.currentTimeFrame : ZTween.currentTime;
                        this.timeStart += timeNow - this.timePaused;
                        this.timeComplete += timeNow - this.timePaused;
                    }
                };
                Object.defineProperty(ZTween.prototype, "delay", {
                    // ==================================================================================================================================
                    // ACESSOR functions ----------------------------------------------------------------------------------------------------------------
                    get: function () {
                        return (this.timeStart - this.timeCreated) / (this._useFrames ? 1 : 1000);
                    },
                    set: function (value) {
                        this.timeStart = this.timeCreated + (value * (this._useFrames ? 1 : 1000));
                        this.timeComplete = this.timeStart + this.timeDuration;
                        //updateCache();
                        // TODO: take pause into consideration!
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZTween.prototype, "time", {
                    get: function () {
                        return (this.timeComplete - this.timeStart) / (this._useFrames ? 1 : 1000);
                    },
                    set: function (value) {
                        this.timeComplete = this.timeStart + (value * (this._useFrames ? 1 : 1000));
                        this.updateCache();
                        // TODO: take pause into consideration!
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZTween.prototype, "paused", {
                    get: function () {
                        return this._paused;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZTween.prototype, "useFrames", {
                    /*
                    public function set paused(p_value:boolean):void {
                        if (p_value == _paused) return;
                        _paused = p_value;
                        if (paused) {
                            // pause
                        } else {
                            // resume
                        }
                    }
                    */
                    get: function () {
                        return this._useFrames;
                    },
                    set: function (value) {
                        var tDelay = this.delay;
                        var tTime = this.time;
                        this._useFrames = value;
                        this.timeStart = this._useFrames ? ZTween.currentTimeFrame : ZTween.currentTime;
                        this.delay = tDelay;
                        this.time = tTime;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZTween.prototype, "target", {
                    get: function () {
                        return this._target;
                    },
                    set: function (target) {
                        this._target = target;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZTween.prototype, "onStart", {
                    get: function () {
                        return this._onStart;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZTween.prototype, "onUpdate", {
                    get: function () {
                        return this._onUpdate;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ZTween.prototype, "onComplete", {
                    get: function () {
                        return this._onComplete;
                    },
                    enumerable: true,
                    configurable: true
                });
                ZTween.tweens = []; // List of active tweens
                return ZTween;
            })();
            transitions.ZTween = ZTween;
            var ZTweenProperty = (function () {
                function ZTweenProperty(name, valueComplete) {
                    this.name = name;
                    this.valueComplete = valueComplete;
                    //hasModifier			=	boolean(p_modifierFunction);
                    //modifierFunction 	=	p_modifierFunction;
                    //modifierParameters	=	p_modifierParameters;
                }
                return ZTweenProperty;
            })();
            ZTween._init();
        })(transitions = zehfernando.transitions || (zehfernando.transitions = {}));
    })(zehfernando || (zehfernando = {}));
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zaXRpb25zL1pUd2Vlbi50cyJdLCJuYW1lcyI6WyJ6ZWhmZXJuYW5kbyIsInplaGZlcm5hbmRvLnRyYW5zaXRpb25zIiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuIiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuLmNvbnN0cnVjdG9yIiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuLl9pbml0IiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuLnVwZGF0ZUNhY2hlIiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuLnVwZGF0ZVR3ZWVucyIsInplaGZlcm5hbmRvLnRyYW5zaXRpb25zLlpUd2Vlbi5mcmFtZVRpY2siLCJ6ZWhmZXJuYW5kby50cmFuc2l0aW9ucy5aVHdlZW4uYWRkIiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuLnVwZGF0ZVRpbWUiLCJ6ZWhmZXJuYW5kby50cmFuc2l0aW9ucy5aVHdlZW4ucmVtb3ZlIiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuLmhhc1R3ZWVuIiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuLmdldFR3ZWVucyIsInplaGZlcm5hbmRvLnRyYW5zaXRpb25zLlpUd2Vlbi5wYXVzZSIsInplaGZlcm5hbmRvLnRyYW5zaXRpb25zLlpUd2Vlbi5yZXN1bWUiLCJ6ZWhmZXJuYW5kby50cmFuc2l0aW9ucy5aVHdlZW4ucmVtb3ZlVHdlZW5CeUluZGV4IiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuLnVwZGF0ZSIsInplaGZlcm5hbmRvLnRyYW5zaXRpb25zLlpUd2Vlbi5kZWxheSIsInplaGZlcm5hbmRvLnRyYW5zaXRpb25zLlpUd2Vlbi50aW1lIiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuLnBhdXNlZCIsInplaGZlcm5hbmRvLnRyYW5zaXRpb25zLlpUd2Vlbi51c2VGcmFtZXMiLCJ6ZWhmZXJuYW5kby50cmFuc2l0aW9ucy5aVHdlZW4udGFyZ2V0IiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuLm9uU3RhcnQiLCJ6ZWhmZXJuYW5kby50cmFuc2l0aW9ucy5aVHdlZW4ub25VcGRhdGUiLCJ6ZWhmZXJuYW5kby50cmFuc2l0aW9ucy5aVHdlZW4ub25Db21wbGV0ZSIsInplaGZlcm5hbmRvLnRyYW5zaXRpb25zLlpUd2VlblByb3BlcnR5IiwiemVoZmVybmFuZG8udHJhbnNpdGlvbnMuWlR3ZWVuUHJvcGVydHkuY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiJBQUFBLGtEQUFrRDtBQUNsRCxpQ0FBaUM7O0lBS2pDLElBQU8sV0FBVyxDQW1pQmpCO0lBbmlCRCxXQUFPLFdBQVc7UUFBQ0EsSUFBQUEsV0FBV0EsQ0FtaUI3QkE7UUFuaUJrQkEsV0FBQUEsV0FBV0EsRUFBQ0EsQ0FBQ0E7WUFFL0JDLEFBR0FBOztlQURHQTs7Z0JBd0RGQyxtSEFBbUhBO2dCQUNuSEEsbUhBQW1IQTtnQkFFbkhBOzs7O21CQUlHQTtnQkFDSEEsZ0JBQVlBLE1BQVVBLEVBQUVBLFVBQXFCQSxFQUFFQSxVQUFxQkE7b0JBQTVDQywwQkFBcUJBLEdBQXJCQSxpQkFBcUJBO29CQUFFQSwwQkFBcUJBLEdBQXJCQSxpQkFBcUJBO29CQUVuRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBSUEsTUFBTUEsQ0FBQ0E7b0JBRXZCQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFJQSxJQUFJQSxLQUFLQSxFQUFrQkEsQ0FBQ0E7b0JBQy9DQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxJQUFJQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDOUJBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLGNBQWNBLENBQUNBLEtBQUtBLEVBQUVBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUVwRUEsQ0FBQ0E7b0JBRURBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdB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QSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxJQUFJQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDckNBLEFBQ0FBLDZEQUQ2REE7NEJBQzdEQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQ0FDNURBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dDQUN6Q0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsYUFBYUEsQ0FBQ0E7NEJBQ2xFQSxDQUFDQTs0QkFFREEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7NEJBQzFCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTs0QkFFNUJBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO3dCQUVkQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ1BBLEFBQ0FBLHlCQUR5QkE7NEJBQ3pCQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTs0QkFDNUVBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVB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aW9ucy9aVHdlZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPScuLi9zaWduYWxzL1NpbXBsZVNpZ25hbC50cycvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPSdFYXNpbmcudHMnLz5cclxuXHJcbmltcG9ydCBTaW1wbGVTaWduYWwgZnJvbSAnLi4vc2lnbmFscy9TaW1wbGVTaWduYWwnO1xyXG5pbXBvcnQgRWFzaW5nIGZyb20gJ0Vhc2luZyc7XHJcblxyXG5tb2R1bGUgemVoZmVybmFuZG8udHJhbnNpdGlvbnMge1xyXG5cclxuXHQvKipcclxuXHQgKiBAYXV0aG9yIFplaCBGZXJuYW5kb1xyXG5cdCAqL1xyXG5cdGV4cG9ydCBjbGFzcyBaVHdlZW4ge1xyXG5cclxuXHRcdC8vIFN0YXRpYyBwcm9wZXJ0aWVzXHJcblx0XHRwdWJsaWMgc3RhdGljIGN1cnJlbnRUaW1lOm51bWJlcjtcdFx0XHRcdFx0Ly8gVGhlIGN1cnJlbnQgdGltZS4gVGhpcyBpcyBnZW5lcmljIGZvciBhbGwgdHdlZW5pbmdzIGZvciBhIFwidGltZSBncmlkXCIgYmFzZWQgdXBkYXRlXHJcblx0XHRwdWJsaWMgc3RhdGljIGN1cnJlbnRUaW1lRnJhbWU6bnVtYmVyO1x0XHRcdFx0Ly8gVGhlIGN1cnJlbnQgZnJhbWUuIFVzZWQgb24gZnJhbWUtYmFzZWQgdHdlZW5pbmdzXHJcblxyXG5cdFx0cHJpdmF0ZSBzdGF0aWMgdHdlZW5zOkFycmF5PFpUd2Vlbj4gPSBbXTtcdFx0XHQvLyBMaXN0IG9mIGFjdGl2ZSB0d2VlbnNcclxuLy9cdFx0cHJvdGVjdGVkIHN0YXRpYyB2YXIgdHQ6VmVjdG9yLjxaVHdlZW4+O1x0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBUZW1wIHR3ZWVuIGxpc3RcclxuXHJcblx0XHQvLyBQcm9wZXJ0aWVzXHJcblx0XHRwcml2YXRlIF90YXJnZXRcdFx0XHRcdFx0OmFueTtcdFx0XHRcdFx0Ly8gT2JqZWN0IGFmZmVjdGVkIGJ5IHRoaXMgdHdlZW5pbmdcclxuXHRcdHByaXZhdGUgcHJvcGVydGllc1x0XHRcdFx0OkFycmF5PFpUd2VlblByb3BlcnR5PjtcdFx0Ly8gTGlzdCBvZiBwcm9wZXJ0aWVzIHRoYXQgYXJlIHR3ZWVuZWRcclxuXHJcblx0XHRwcml2YXRlIHRpbWVTdGFydFx0XHRcdFx0Om51bWJlcjtcdFx0XHQvLyBUaW1lIHdoZW4gdGhpcyB0d2VlbmluZyBzaG91bGQgc3RhcnRcclxuXHRcdHByaXZhdGUgdGltZUNyZWF0ZWRcdFx0XHRcdDpudW1iZXI7XHRcdFx0Ly8gVGltZSB3aGVuIHRoaXMgdHdlZW5pbmcgd2FzIGNyZWF0ZWRcclxuXHRcdHByaXZhdGUgdGltZUNvbXBsZXRlXHRcdFx0Om51bWJlcjtcdFx0XHQvLyBUaW1lIHdoZW4gdGhpcyB0d2VlbmluZyBzaG91bGQgZW5kXHJcblx0XHRwcml2YXRlIHRpbWVEdXJhdGlvblx0XHRcdDpudW1iZXI7XHRcdFx0Ly8gVGltZSB0aGlzIHR3ZWVuIHRha2VzIChjYWNoZSlcclxuXHRcdHByaXZhdGUgdHJhbnNpdGlvblx0XHRcdFx0OkZ1bmN0aW9uO1x0XHRcdC8vIEVxdWF0aW9uIHRvIGNvbnRyb2wgdGhlIHRyYW5zaXRpb24gYW5pbWF0aW9uXHJcblx0XHQvL3ByaXZhdGUgdHJhbnNpdGlvblBhcmFtc1x0XHRcdDpPYmplY3Q7XHRcdC8vIEFkZGl0aW9uYWwgcGFyYW1ldGVycyBmb3IgdGhlIHRyYW5zaXRpb25cclxuXHRcdC8vcHJpdmF0ZSByb3VuZGVkXHRcdFx0XHRcdDpib29sZWFuO1x0XHQvLyBVc2Ugcm91bmRlZCB2YWx1ZXMgd2hlbiB1cGRhdGluZ1xyXG5cdFx0cHJpdmF0ZSB0aW1lUGF1c2VkXHRcdFx0XHQ6bnVtYmVyO1x0XHRcdC8vIFRpbWUgd2hlbiB0aGlzIHR3ZWVuIHdhcyBwYXVzZWRcclxuXHRcdC8vcHJpdmF0ZSBza2lwVXBkYXRlc1x0XHRcdFx0OnVpbnQ7XHRcdFx0Ly8gSG93IG1hbnkgdXBkYXRlcyBzaG91bGQgYmUgc2tpcHBlZCAoZGVmYXVsdCA9IDA7IDEgPSB1cGRhdGUtc2tpcC11cGRhdGUtc2tpcC4uLilcclxuXHRcdC8vcHJpdmF0ZSB1cGRhdGVzU2tpcHBlZFx0XHRcdDp1aW50O1x0XHRcdC8vIEhvdyBtYW55IHVwZGF0ZXMgaGF2ZSBhbHJlYWR5IGJlZW4gc2tpcHBlZFxyXG5cdFx0cHJpdmF0ZSBzdGFydGVkXHRcdFx0XHRcdDpib29sZWFuO1x0XHRcdC8vIFdoZXRoZXIgb3Igbm90IHRoaXMgdHdlZW4gaGFzIGFscmVhZHkgc3RhcnRlZCBleGVjdXRpbmdcclxuXHJcblx0XHRwcml2YXRlIF9vblN0YXJ0XHRcdFx0XHQ6U2ltcGxlU2lnbmFsPEZ1bmN0aW9uPjtcclxuXHRcdHByaXZhdGUgX29uVXBkYXRlXHRcdFx0XHQ6U2ltcGxlU2lnbmFsPEZ1bmN0aW9uPjtcclxuXHRcdHByaXZhdGUgX29uQ29tcGxldGVcdFx0XHRcdDpTaW1wbGVTaWduYWw8RnVuY3Rpb24+O1xyXG5cclxuXHRcdC8vIEV4dGVybmFsIHByb3BlcnRpZXNcclxuXHRcdHByaXZhdGUgX3BhdXNlZDogYm9vbGVhbjtcdFx0XHQvLyBXaGV0aGVyIG9yIG5vdCB0aGlzIHR3ZWVuIGlzIGN1cnJlbnRseSBwYXVzZWRcclxuXHRcdHByaXZhdGUgX3VzZUZyYW1lczogYm9vbGVhbjtcdFx0Ly8gV2hldGhlciBvciBub3QgdG8gdXNlIGZyYW1lcyBpbnN0ZWFkIG9mIHNlY29uZHNcclxuXHJcblx0XHQvLyBUZW1wb3JhcnkgdmFyaWFibGVzIHRvIGF2b2lkIGRpc3Bvc2FsXHJcblx0XHRwcml2YXRlIHQ6IG51bWJlcjtcdFx0Ly8gQ3VycmVudCB0aW1lICgwLTEpXHJcblx0XHRwcml2YXRlIHRQcm9wZXJ0eTogWlR3ZWVuUHJvcGVydHk7XHQvLyBQcm9wZXJ0eSBiZWluZyBjaGVja2VkXHJcblx0XHRwcml2YXRlIHB2OiBudW1iZXI7XHJcblx0XHRwcml2YXRlIGk6IG51bWJlcjtcdFx0XHQvLyBMb29wIGl0ZXJhdG9yXHJcblx0XHRwcml2YXRlIGNUaW1lOiBudW1iZXI7XHRcdFx0Ly8gQ3VycmVudCBlbmdpbmUgdGltZSAoaW4gZnJhbWVzIG9yIHNlY29uZHMpXHJcblxyXG5cdFx0Ly8gVGVtcCB2YXJzXHJcblx0XHRwcm90ZWN0ZWQgc3RhdGljIGk6IG51bWJlcjtcclxuXHRcdHByb3RlY3RlZCBzdGF0aWMgbDogbnVtYmVyO1xyXG5cclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdC8vIFNUQVRJQyBQU0VVRE8tQ09OU1RSVUNUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0XHRwdWJsaWMgc3RhdGljIF9pbml0KCk6dm9pZCB7XHJcblx0XHRcdC8vIFN0YXJ0cyB0aGUgZW5naW5lXHJcblx0XHRcdHRoaXMuY3VycmVudFRpbWVGcmFtZSA9IDA7XHJcblx0XHRcdHRoaXMuY3VycmVudFRpbWUgPSAwO1xyXG5cclxuXHRcdFx0dGhpcy5mcmFtZVRpY2soKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLyBDT05TVFJVQ1RPUiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDcmVhdGVzIGEgbmV3IFR3ZWVuLlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbVx0cF9zY29wZVx0XHRcdFx0T2JqZWN0XHRcdE9iamVjdCB0aGF0IHRoaXMgdHdlZW5pbmcgcmVmZXJzIHRvLlxyXG5cdFx0ICovXHJcblx0XHRjb25zdHJ1Y3Rvcih0YXJnZXQ6YW55LCBwcm9wZXJ0aWVzOmFueSA9IG51bGwsIHBhcmFtZXRlcnM6YW55ID0gbnVsbCkge1xyXG5cclxuXHRcdFx0dGhpcy5fdGFyZ2V0XHRcdD1cdHRhcmdldDtcclxuXHJcblx0XHRcdHRoaXMucHJvcGVydGllc1x0XHQ9XHRuZXcgQXJyYXk8WlR3ZWVuUHJvcGVydHk+KCk7XHJcblx0XHRcdGZvciAodmFyIHBOYW1lIGluIHByb3BlcnRpZXMpIHtcclxuXHRcdFx0XHR0aGlzLnByb3BlcnRpZXMucHVzaChuZXcgWlR3ZWVuUHJvcGVydHkocE5hbWUsIHByb3BlcnRpZXNbcE5hbWVdKSk7XHJcblx0XHRcdFx0Ly9hZGRQcm9wZXJ0eShwTmFtZSwgX19wcm9wZXJ0aWVzW3BOYW1lXSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMudGltZUNyZWF0ZWRcdD0gWlR3ZWVuLmN1cnJlbnRUaW1lO1xyXG5cdFx0XHR0aGlzLnRpbWVTdGFydFx0XHQ9IHRoaXMudGltZUNyZWF0ZWQ7XHJcblxyXG5cdFx0XHQvLyBQYXJhbWV0ZXJzXHJcblx0XHRcdHRoaXMudGltZVx0XHRcdD0gMDtcclxuXHRcdFx0dGhpcy5kZWxheVx0XHRcdD0gMDtcclxuXHRcdFx0dGhpcy50cmFuc2l0aW9uXHRcdD0gRWFzaW5nLm5vbmU7XHJcblxyXG5cdFx0XHR0aGlzLl9vblN0YXJ0XHRcdD0gbmV3IFNpbXBsZVNpZ25hbCgpO1xyXG5cdFx0XHR0aGlzLl9vblVwZGF0ZVx0XHQ9IG5ldyBTaW1wbGVTaWduYWwoKTtcclxuXHRcdFx0dGhpcy5fb25Db21wbGV0ZVx0PSBuZXcgU2ltcGxlU2lnbmFsKCk7XHJcblxyXG5cdFx0XHQvLyBSZWFkIHBhcmFtZXRlcnNcclxuXHRcdFx0aWYgKHBhcmFtZXRlcnMgIT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChwYXJhbWV0ZXJzLmhhc093blByb3BlcnR5KFwidGltZVwiKSkgdGhpcy50aW1lID0gcGFyYW1ldGVyc1tcInRpbWVcIl07XHJcblx0XHRcdFx0aWYgKHBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkoXCJkZWxheVwiKSkgdGhpcy5kZWxheSA9IHBhcmFtZXRlcnNbXCJkZWxheVwiXTtcclxuXHJcblx0XHRcdFx0aWYgKHBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkoXCJ0cmFuc2l0aW9uXCIpKSB0aGlzLnRyYW5zaXRpb24gPSBwYXJhbWV0ZXJzW1widHJhbnNpdGlvblwiXTtcclxuXHJcblx0XHRcdFx0aWYgKHBhcmFtZXRlcnMuaGFzT3duUHJvcGVydHkoXCJvblN0YXJ0XCIpKSB0aGlzLl9vblN0YXJ0LmFkZChwYXJhbWV0ZXJzW1wib25TdGFydFwiXSk7IC8vICwgcGFyYW1ldGVyc1tcIm9uU3RhcnRQYXJhbXNcIl1cclxuXHRcdFx0XHRpZiAocGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcIm9uVXBkYXRlXCIpKSB0aGlzLl9vblVwZGF0ZS5hZGQocGFyYW1ldGVyc1tcIm9uVXBkYXRlXCJdKTtcclxuXHRcdFx0XHRpZiAocGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShcIm9uQ29tcGxldGVcIikpIHRoaXMuX29uQ29tcGxldGUuYWRkKHBhcmFtZXRlcnNbXCJvbkNvbXBsZXRlXCJdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvL3RyYW5zaXRpb25QYXJhbXNcdD1cdG5ldyBBcnJheSgpO1xyXG5cclxuXHRcdFx0dGhpcy5fdXNlRnJhbWVzID0gZmFsc2U7XHJcblxyXG5cdFx0XHR0aGlzLl9wYXVzZWRcdFx0PVx0ZmFsc2U7XHJcblx0XHRcdC8vc2tpcFVwZGF0ZXNcdFx0PVx0MDtcclxuXHRcdFx0Ly91cGRhdGVzU2tpcHBlZFx0PVx0MDtcclxuXHRcdFx0dGhpcy5zdGFydGVkID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdC8vIElOVEVSTkFMIGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0XHRwcml2YXRlIHVwZGF0ZUNhY2hlKCk6dm9pZCB7XHJcblx0XHRcdHRoaXMudGltZUR1cmF0aW9uID0gdGhpcy50aW1lQ29tcGxldGUgLSB0aGlzLnRpbWVTdGFydDtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Ly8gRU5HSU5FIGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVXBkYXRlcyBhbGwgZXhpc3RpbmcgdHdlZW5pbmdzLlxyXG5cdFx0ICovXHJcblx0XHRwcml2YXRlIHN0YXRpYyB1cGRhdGVUd2VlbnMoKTp2b2lkIHtcclxuXHRcdFx0Ly90cmFjZSAoXCJ1cGRhdGVUd2VlbnNcIik7XHJcblxyXG5cdFx0XHR0aGlzLmwgPSB0aGlzLnR3ZWVucy5sZW5ndGg7XHJcblx0XHRcdGZvciAodGhpcy5pID0gMDsgdGhpcy5pIDwgdGhpcy5sOyB0aGlzLmkrKykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnR3ZWVuc1t0aGlzLmldID09IG51bGwgfHwgIXRoaXMudHdlZW5zW3RoaXMuaV0udXBkYXRlKHRoaXMuY3VycmVudFRpbWUsIHRoaXMuY3VycmVudFRpbWVGcmFtZSkpIHtcclxuXHRcdFx0XHRcdC8vIE9sZCB0d2VlbiwgcmVtb3ZlXHJcblx0XHRcdFx0XHR0aGlzLnR3ZWVucy5zcGxpY2UodGhpcy5pLCAxKTtcclxuXHRcdFx0XHRcdHRoaXMuaS0tO1xyXG5cdFx0XHRcdFx0dGhpcy5sLS07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSYW4gb25jZSBldmVyeSBmcmFtZS4gSXQncyB0aGUgbWFpbiBlbmdpbmU7IHVwZGF0ZXMgYWxsIGV4aXN0aW5nIHR3ZWVuaW5ncy5cclxuXHRcdCAqL1xyXG5cdFx0cHJpdmF0ZSBzdGF0aWMgZnJhbWVUaWNrKCk6dm9pZCB7XHJcblx0XHRcdC8vIFVwZGF0ZSB0aW1lXHJcblx0XHRcdHRoaXMuY3VycmVudFRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xyXG5cclxuXHRcdFx0Ly8gVXBkYXRlIGZyYW1lXHJcblx0XHRcdHRoaXMuY3VycmVudFRpbWVGcmFtZSsrO1xyXG5cclxuXHRcdFx0Ly8gVXBkYXRlIGFsbCB0d2VlbnNcclxuXHRcdFx0dGhpcy51cGRhdGVUd2VlbnMoKTtcclxuXHJcblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5mcmFtZVRpY2suYmluZCh0aGlzKSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdC8vIFBVQkxJQyBTVEFUSUMgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENyZWF0ZSBhIG5ldyB0d2VlbmluZyBmb3IgYW4gb2JqZWN0IGFuZCBzdGFydHMgaXQuXHJcblx0XHQgKi9cclxuXHRcdHB1YmxpYyBzdGF0aWMgYWRkKHRhcmdldDphbnksIHByb3BlcnRpZXM6YW55ID0gbnVsbCwgcGFyYW1ldGVyczphbnkgPSBudWxsKTogWlR3ZWVuIHtcclxuXHRcdFx0dmFyIHQ6WlR3ZWVuID0gbmV3IFpUd2Vlbih0YXJnZXQsIHByb3BlcnRpZXMsIHBhcmFtZXRlcnMpO1xyXG5cdFx0XHR0aGlzLnR3ZWVucy5wdXNoKHQpO1xyXG5cdFx0XHRyZXR1cm4gdDtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJlbW92ZSB0d2VlbmluZ3MgZm9yIGEgZ2l2ZW4gb2JqZWN0IGZyb20gdGhlIGFjdGl2ZSB0d2VlbmluZyBsaXN0LlxyXG5cdFx0ICovXHJcblx0XHQvKlxyXG5cdFx0cHVibGljIHN0YXRpYyBmdW5jdGlvbiByZW1vdmUoX190YXJnZXQ6T2JqZWN0LCAuLi5fX2FyZ3MpOmJvb2xlYW4ge1xyXG5cdFx0XHQvLyBDcmVhdGUgdGhlIGxpc3Qgb2YgdmFsaWQgcHJvcGVydHkgbGlzdFxyXG5cdFx0XHQvL3ZhciBwcm9wZXJ0aWVzOlZlY3Rvci48U3RyaW5nPiA9IG5ldyBWZWN0b3IuPFN0cmluZz4oKTtcclxuXHRcdFx0Ly9sID0gYXJnc1tcImxlbmd0aFwiXTtcclxuXHRcdFx0Ly9mb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcblx0XHRcdC8vXHRwcm9wZXJ0aWVzLnB1c2goYXJnc1tpXSk7XHJcblx0XHRcdC8vfVxyXG5cclxuXHRcdFx0Ly8gQ2FsbCB0aGUgYWZmZWN0IGZ1bmN0aW9uIG9uIHRoZSBzcGVjaWZpZWQgcHJvcGVydGllc1xyXG5cdFx0XHRyZXR1cm4gYWZmZWN0VHdlZW5zKHJlbW92ZVR3ZWVuQnlJbmRleCwgX190YXJnZXQsIF9fYXJncyk7XHJcblx0XHR9XHJcblx0XHQqL1xyXG5cclxuXHRcdHB1YmxpYyBzdGF0aWMgdXBkYXRlVGltZSgpOnZvaWQge1xyXG5cdFx0XHQvLyBGb3JjZSBhIHRpbWUgdXBkYXRlIC0gc2hvdWxkIG9ubHkgYmUgdXNlZCBhZnRlciBjb21wbGV4IGNhbGN1bGF0aW9ucyB0aGF0IHRha2UgYSBsb3QgbW9yZSB0aGFuIGEgZnJhbWVcclxuXHRcdFx0dGhpcy5jdXJyZW50VGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHN0YXRpYyByZW1vdmUodGFyZ2V0OmFueSwgLi4ucHJvcHMpOmJvb2xlYW4ge1xyXG5cdFx0XHR2YXIgdGw6QXJyYXk8WlR3ZWVuPiA9IFtdO1xyXG5cclxuXHRcdFx0dmFyIGw6bnVtYmVyID0gdGhpcy50d2VlbnMubGVuZ3RoO1xyXG5cdFx0XHR2YXIgaTogbnVtYmVyO1xyXG5cdFx0XHR2YXIgajogbnVtYmVyO1xyXG5cdFx0XHQvLyBUT0RPOiB1c2UgZmlsdGVyP1xyXG5cclxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnR3ZWVuc1tpXSAhPSBudWxsICYmIHRoaXMudHdlZW5zW2ldLl90YXJnZXQgPT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRpZiAocHJvcHMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgdGhpcy50d2VlbnNbaV0ucHJvcGVydGllcy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChwcm9wcy5pbmRleE9mKHRoaXMudHdlZW5zW2ldLnByb3BlcnRpZXNbal0ubmFtZSkgPiAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy50d2VlbnNbaV0ucHJvcGVydGllcy5zcGxpY2UoaiwgMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRqLS07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLnR3ZWVuc1tpXS5wcm9wZXJ0aWVzLmxlbmd0aCA9PSAwKSB0bC5wdXNoKHRoaXMudHdlZW5zW2ldKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRsLnB1c2godGhpcy50d2VlbnNbaV0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHJlbW92ZWRBbnk6Ym9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRcdFx0bCA9IHRsLmxlbmd0aDtcclxuXHJcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuXHRcdFx0XHRqID0gdGhpcy50d2VlbnMuaW5kZXhPZih0bFtpXSk7XHJcblx0XHRcdFx0dGhpcy5yZW1vdmVUd2VlbkJ5SW5kZXgoaik7XHJcblx0XHRcdFx0cmVtb3ZlZEFueSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiByZW1vdmVkQW55O1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzdGF0aWMgaGFzVHdlZW4odGFyZ2V0OmFueSwgLi4ucHJvcHMpOmJvb2xlYW4ge1xyXG5cdFx0XHQvL3JldHVybiAoZ2V0VHdlZW5zLmFwcGx5KChbX190YXJnZXRdIGFzIEFycmF5KS5jb25jYXQoX19wcm9wcykpIGFzIFZlY3Rvci48WlR3ZWVuPikubGVuZ3RoID4gMDtcclxuXHJcblx0XHRcdHZhciBsOm51bWJlciA9IHRoaXMudHdlZW5zLmxlbmd0aDtcclxuXHRcdFx0dmFyIGk6bnVtYmVyO1xyXG5cdFx0XHR2YXIgajpudW1iZXI7XHJcblx0XHRcdC8vIFRPRE86IHVzZSBmaWx0ZXI/XHJcblxyXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMudHdlZW5zW2ldICE9IG51bGwgJiYgdGhpcy50d2VlbnNbaV0uX3RhcmdldCA9PSB0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGlmIChwcm9wcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCB0aGlzLnR3ZWVuc1tpXS5wcm9wZXJ0aWVzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHByb3BzLmluZGV4T2YodGhpcy50d2VlbnNbaV0ucHJvcGVydGllc1tqXS5uYW1lKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc3RhdGljIGdldFR3ZWVucyh0YXJnZXQ6YW55LCAuLi5wcm9wcyk6QXJyYXk8WlR3ZWVuPiB7XHJcblx0XHRcdHZhciB0bDpBcnJheTxaVHdlZW4+ID0gW107XHJcblxyXG5cdFx0XHR2YXIgbDpudW1iZXIgPSB0aGlzLnR3ZWVucy5sZW5ndGg7XHJcblx0XHRcdHZhciBpOm51bWJlcjtcclxuXHRcdFx0dmFyIGo6bnVtYmVyO1xyXG5cdFx0XHR2YXIgZm91bmQ6Ym9vbGVhbjtcclxuXHRcdFx0Ly8gVE9ETzogdXNlIGZpbHRlcj9cclxuXHJcblx0XHRcdC8vdHJhY2UgKFwiWlR3ZWVuIDo6IGdldFR3ZWVucygpIDo6IGdldHRpbmcgdHdlZW5zIGZvciBcIitfX3RhcmdldCtcIiwgXCIrX19wcm9wcytcIiAoXCIrX19wcm9wcy5sZW5ndGgrXCIgcHJvcGVydGllcylcIik7XHJcblxyXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMudHdlZW5zW2ldICE9IG51bGwgJiYgdGhpcy50d2VlbnNbaV0uX3RhcmdldCA9PSB0YXJnZXQpIHtcclxuXHRcdFx0XHRcdGlmIChwcm9wcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdGZvdW5kID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCB0aGlzLnR3ZWVuc1tpXS5wcm9wZXJ0aWVzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHByb3BzLmluZGV4T2YodGhpcy50d2VlbnNbaV0ucHJvcGVydGllc1tqXS5uYW1lKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3VuZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGZvdW5kKSB0bC5wdXNoKHRoaXMudHdlZW5zW2ldKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRsLnB1c2godGhpcy50d2VlbnNbaV0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzdGF0aWMgcGF1c2UodGFyZ2V0OmFueSwgLi4ucHJvcHMpOmJvb2xlYW4ge1xyXG5cdFx0XHR2YXIgcGF1c2VkQW55OmJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBmdHdlZW5zOkFycmF5PFpUd2Vlbj4gPSB0aGlzLmdldFR3ZWVucy5hcHBseShudWxsLCAoW3RhcmdldF0pLmNvbmNhdChwcm9wcykpO1xyXG5cdFx0XHR2YXIgaTpudW1iZXI7XHJcblxyXG5cdFx0XHQvL3RyYWNlIChcIlpUd2VlbiA6OiBwYXVzZSgpIDo6IHBhdXNpbmcgdHdlZW5zIGZvciBcIiArIF9fdGFyZ2V0ICsgXCI6IFwiICsgZnR3ZWVucy5sZW5ndGggKyBcIiBhY3R1YWwgdHdlZW5zXCIpO1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogdXNlIGZpbHRlci9hcHBseT9cclxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGZ0d2VlbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoIWZ0d2VlbnNbaV0ucGF1c2VkKSB7XHJcblx0XHRcdFx0XHRmdHdlZW5zW2ldLnBhdXNlKCk7XHJcblx0XHRcdFx0XHRwYXVzZWRBbnkgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHBhdXNlZEFueTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc3RhdGljIHJlc3VtZSh0YXJnZXQ6YW55LCAuLi5wcm9wcyk6Ym9vbGVhbiB7XHJcblx0XHRcdHZhciByZXN1bWVkQW55OmJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBmdHdlZW5zOkFycmF5PFpUd2Vlbj4gPSB0aGlzLmdldFR3ZWVucy5hcHBseShudWxsLCAoW3RhcmdldF0pLmNvbmNhdChwcm9wcykpO1xyXG5cdFx0XHR2YXIgaTpudW1iZXI7XHJcblxyXG5cdFx0XHQvLyBUT0RPOiB1c2UgZmlsdGVyL2FwcGx5P1xyXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgZnR3ZWVucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChmdHdlZW5zW2ldLnBhdXNlZCkge1xyXG5cdFx0XHRcdFx0ZnR3ZWVuc1tpXS5yZXN1bWUoKTtcclxuXHRcdFx0XHRcdHJlc3VtZWRBbnkgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHJlc3VtZWRBbnk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZW1vdmUgYSBzcGVjaWZpYyB0d2VlbmluZyBmcm9tIHRoZSB0d2VlbmluZyBsaXN0LlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbVx0XHRwX3R3ZWVuXHRcdFx0XHROdW1iZXJcdFx0SW5kZXggb2YgdGhlIHR3ZWVuIHRvIGJlIHJlbW92ZWQgb24gdGhlIHR3ZWVuaW5ncyBsaXN0XHJcblx0XHQgKiBAcmV0dXJuXHRcdFx0XHRcdFx0XHRib29sZWFuXHRcdFdoZXRoZXIgb3Igbm90IGl0IHN1Y2Nlc3NmdWxseSByZW1vdmVkIHRoaXMgdHdlZW5pbmdcclxuXHRcdCAqL1xyXG5cdFx0cHVibGljIHN0YXRpYyByZW1vdmVUd2VlbkJ5SW5kZXgoaTpudW1iZXIpOnZvaWQge1xyXG5cdFx0XHQvL19fZmluYWxSZW1vdmFsOmJvb2xlYW4gPSBmYWxzZVxyXG5cdFx0XHR0aGlzLnR3ZWVuc1tpXSA9IG51bGw7XHJcblx0XHRcdC8vaWYgKF9fZmluYWxSZW1vdmFsKSB0d2VlbnMuc3BsaWNlKF9faSwgMSk7XHJcblx0XHRcdC8vdHdlZW5zLnNwbGljZShfX2ksIDEpO1xyXG5cdFx0XHQvL3JldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRG8gc29tZSBnZW5lcmljIGFjdGlvbiBvbiBzcGVjaWZpYyB0d2VlbmluZ3MgKHBhdXNlLCByZXN1bWUsIHJlbW92ZSwgbW9yZT8pXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtXHRcdF9fZnVuY3Rpb25cdFx0XHRGdW5jdGlvblx0RnVuY3Rpb24gdG8gcnVuIG9uIHRoZSB0d2VlbmluZ3MgdGhhdCBtYXRjaFxyXG5cdFx0ICogQHBhcmFtXHRcdF9fdGFyZ2V0XHRcdFx0T2JqZWN0XHRcdE9iamVjdCB0aGF0IG11c3QgaGF2ZSBpdHMgdHdlZW5zIGFmZmVjdGVkIGJ5IHRoZSBmdW5jdGlvblxyXG5cdFx0ICogQHBhcmFtXHRcdF9fcHJvcGVydGllc1x0XHRBcnJheVx0XHRBcnJheSBvZiBzdHJpbmdzIHRoYXQgbXVzdCBiZSBhZmZlY3RlZFxyXG5cdFx0ICogQHJldHVyblx0XHRcdFx0XHRcdFx0Ym9vbGVhblx0XHRXaGV0aGVyIG9yIG5vdCBpdCBzdWNjZXNzZnVsbHkgYWZmZWN0ZWQgc29tZXRoaW5nXHJcblx0XHQgKi9cclxuXHRcdC8qXHJcblx0XHRwcml2YXRlIHN0YXRpYyBmdW5jdGlvbiBhZmZlY3RUd2VlbnMgKF9fYWZmZWN0RnVuY3Rpb246RnVuY3Rpb24sIF9fdGFyZ2V0Ok9iamVjdCwgX19wcm9wZXJ0aWVzOkFycmF5KTpib29sZWFuIHtcclxuXHRcdFx0dmFyIGFmZmVjdGVkOmJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0XHRcdGwgPSB0d2VlbnMubGVuZ3RoO1xyXG5cclxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xyXG5cdFx0XHRcdGlmICh0d2VlbnNbaV0udGFyZ2V0ID09IF9fdGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRpZiAoX19wcm9wZXJ0aWVzLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdC8vIENhbiBhZmZlY3QgZXZlcnl0aGluZ1xyXG5cdFx0XHRcdFx0XHRfX2FmZmVjdEZ1bmN0aW9uKGkpO1xyXG5cdFx0XHRcdFx0XHRhZmZlY3RlZCA9IHRydWU7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvLyBNdXN0IGNoZWNrIHdoZXRoZXIgdGhpcyB0d2VlbiBtdXN0IGhhdmUgc3BlY2lmaWMgcHJvcGVydGllcyBhZmZlY3RlZFxyXG5cdFx0XHRcdFx0XHR2YXIgYWZmZWN0ZWRQcm9wZXJ0aWVzOkFycmF5ID0gbmV3IEFycmF5KCk7XHJcblx0XHRcdFx0XHRcdHZhciBqOnVpbnQ7XHJcblx0XHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBwX3Byb3BlcnRpZXMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoYm9vbGVhbihfdHdlZW5MaXN0W2ldLnByb3BlcnRpZXNbcF9wcm9wZXJ0aWVzW2pdXSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGFmZmVjdGVkUHJvcGVydGllcy5wdXNoKHBfcHJvcGVydGllc1tqXSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChhZmZlY3RlZFByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFRoaXMgdHdlZW4gaGFzIHNvbWUgcHJvcGVydGllcyB0aGF0IG5lZWQgdG8gYmUgYWZmZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHR2YXIgb2JqZWN0UHJvcGVydGllczp1aW50ID0gQXV4RnVuY3Rpb25zLmdldE9iamVjdExlbmd0aChfdHdlZW5MaXN0W2ldLnByb3BlcnRpZXMpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChvYmplY3RQcm9wZXJ0aWVzID09IGFmZmVjdGVkUHJvcGVydGllcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFRoZSBsaXN0IG9mIHByb3BlcnRpZXMgaXMgdGhlIHNhbWUgYXMgYWxsIHByb3BlcnRpZXMsIHNvIGFmZmVjdCBpdCBhbGxcclxuXHRcdFx0XHRcdFx0XHRcdHBfYWZmZWN0RnVuY3Rpb24oaSk7XHJcblx0XHRcdFx0XHRcdFx0XHRhZmZlY3RlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFRoZSBwcm9wZXJ0aWVzIGFyZSBtaXhlZCwgc28gc3BsaXQgdGhlIHR3ZWVuIGFuZCBhZmZlY3Qgb25seSBjZXJ0YWluIHNwZWNpZmljIHByb3BlcnRpZXNcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBzbGljZWRUd2VlbkluZGV4OnVpbnQgPSBzcGxpdFR3ZWVucyhpLCBhZmZlY3RlZFByb3BlcnRpZXMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0cF9hZmZlY3RGdW5jdGlvbihzbGljZWRUd2VlbkluZGV4KTtcclxuXHRcdFx0XHRcdFx0XHRcdGFmZmVjdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGFmZmVjdGVkO1xyXG5cdFx0fVxyXG5cdFx0Ki9cclxuXHJcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLyBQVUJMSUMgSU5TVEFOQ0UgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdFx0Ly8gRXZlbnQgaW50ZXJjZXB0b3JzIGZvciBjYWNoaW5nXHJcblx0XHRwdWJsaWMgdXBkYXRlKGN1cnJlbnRUaW1lOiBudW1iZXIsIGN1cnJlbnRUaW1lRnJhbWU6IG51bWJlcik6Ym9vbGVhbiB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fcGF1c2VkKSByZXR1cm4gdHJ1ZTtcclxuXHJcblx0XHRcdHRoaXMuY1RpbWUgPSB0aGlzLl91c2VGcmFtZXMgPyBjdXJyZW50VGltZUZyYW1lIDogY3VycmVudFRpbWU7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5zdGFydGVkIHx8IHRoaXMuY1RpbWUgPj0gdGhpcy50aW1lU3RhcnQpIHtcclxuXHRcdFx0XHRpZiAoIXRoaXMuc3RhcnRlZCkge1xyXG5cdFx0XHRcdFx0dGhpcy5fb25TdGFydC5kaXNwYXRjaCgpO1xyXG5cclxuXHRcdFx0XHRcdGZvciAodGhpcy5pID0gMDsgdGhpcy5pIDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgdGhpcy5pKyspIHtcclxuXHRcdFx0XHRcdFx0Ly8gUHJvcGVydHkgdmFsdWUgbm90IGluaXRpYWxpemVkIHlldFxyXG5cdFx0XHRcdFx0XHR0aGlzLnRQcm9wZXJ0eSA9IHRoaXMucHJvcGVydGllc1t0aGlzLmldO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gRGlyZWN0bHkgcmVhZCBwcm9wZXJ0eVxyXG5cdFx0XHRcdFx0XHR0aGlzLnB2ID0gdGhpcy5fdGFyZ2V0W3RoaXMudFByb3BlcnR5Lm5hbWVdO1xyXG5cclxuXHRcdFx0XHRcdFx0dGhpcy50UHJvcGVydHkudmFsdWVTdGFydCA9IGlzTmFOKHRoaXMucHYpID8gdGhpcy50UHJvcGVydHkudmFsdWVDb21wbGV0ZSA6IHRoaXMucHY7IC8vIElmIHRoZSBwcm9wZXJ0eSBoYXMgbm8gdmFsdWUsIHVzZSB0aGUgZmluYWwgdmFsdWUgYXMgdGhlIGRlZmF1bHRcclxuXHRcdFx0XHRcdFx0dGhpcy50UHJvcGVydHkudmFsdWVDaGFuZ2UgPSB0aGlzLnRQcm9wZXJ0eS52YWx1ZUNvbXBsZXRlIC0gdGhpcy50UHJvcGVydHkudmFsdWVTdGFydDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMuc3RhcnRlZCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5jVGltZSA+PSB0aGlzLnRpbWVDb21wbGV0ZSkge1xyXG5cdFx0XHRcdFx0Ly8gVHdlZW5pbmcgdGltZSBoYXMgZmluaXNoZWQsIGp1c3Qgc2V0IGl0IHRvIHRoZSBmaW5hbCB2YWx1ZVxyXG5cdFx0XHRcdFx0Zm9yICh0aGlzLmkgPSAwOyB0aGlzLmkgPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyB0aGlzLmkrKykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnRQcm9wZXJ0eSA9IHRoaXMucHJvcGVydGllc1t0aGlzLmldO1xyXG5cdFx0XHRcdFx0XHR0aGlzLl90YXJnZXRbdGhpcy50UHJvcGVydHkubmFtZV0gPSB0aGlzLnRQcm9wZXJ0eS52YWx1ZUNvbXBsZXRlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRoaXMuX29uVXBkYXRlLmRpc3BhdGNoKCk7XHJcblx0XHRcdFx0XHR0aGlzLl9vbkNvbXBsZXRlLmRpc3BhdGNoKCk7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gVHdlZW5pbmcgbXVzdCBjb250aW51ZVxyXG5cdFx0XHRcdFx0dGhpcy50ID0gdGhpcy50cmFuc2l0aW9uKCh0aGlzLmNUaW1lIC0gdGhpcy50aW1lU3RhcnQpIC8gdGhpcy50aW1lRHVyYXRpb24pO1xyXG5cdFx0XHRcdFx0Zm9yICh0aGlzLmkgPSAwOyB0aGlzLmkgPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyB0aGlzLmkrKykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnRQcm9wZXJ0eSA9IHRoaXMucHJvcGVydGllc1t0aGlzLmldO1xyXG5cdFx0XHRcdFx0XHR0aGlzLl90YXJnZXRbdGhpcy50UHJvcGVydHkubmFtZV0gPSB0aGlzLnRQcm9wZXJ0eS52YWx1ZVN0YXJ0ICsgdGhpcy50ICogdGhpcy50UHJvcGVydHkudmFsdWVDaGFuZ2U7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5fb25VcGRhdGUuZGlzcGF0Y2goKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHBhdXNlKCk6dm9pZCB7XHJcblx0XHRcdGlmICghdGhpcy5fcGF1c2VkKSB7XHJcblx0XHRcdFx0dGhpcy5fcGF1c2VkID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLnRpbWVQYXVzZWQgPSB0aGlzLl91c2VGcmFtZXMgPyBaVHdlZW4uY3VycmVudFRpbWVGcmFtZSA6IFpUd2Vlbi5jdXJyZW50VGltZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyByZXN1bWUoKTp2b2lkIHtcclxuXHRcdFx0aWYgKHRoaXMuX3BhdXNlZCkge1xyXG5cdFx0XHRcdHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHZhciB0aW1lTm93OiBudW1iZXIgPSB0aGlzLl91c2VGcmFtZXMgPyBaVHdlZW4uY3VycmVudFRpbWVGcmFtZSA6IFpUd2Vlbi5jdXJyZW50VGltZTtcclxuXHRcdFx0XHR0aGlzLnRpbWVTdGFydCArPSB0aW1lTm93IC0gdGhpcy50aW1lUGF1c2VkO1xyXG5cdFx0XHRcdHRoaXMudGltZUNvbXBsZXRlICs9IHRpbWVOb3cgLSB0aGlzLnRpbWVQYXVzZWQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Ly8gQUNFU1NPUiBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgZGVsYXkoKTpudW1iZXIge1xyXG5cdFx0XHRyZXR1cm4gKHRoaXMudGltZVN0YXJ0IC0gdGhpcy50aW1lQ3JlYXRlZCkgLyAodGhpcy5fdXNlRnJhbWVzID8gMSA6IDEwMDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzZXQgZGVsYXkodmFsdWU6bnVtYmVyKSB7XHJcblx0XHRcdHRoaXMudGltZVN0YXJ0ID0gdGhpcy50aW1lQ3JlYXRlZCArICh2YWx1ZSAqICh0aGlzLl91c2VGcmFtZXMgPyAxIDogMTAwMCkpO1xyXG5cdFx0XHR0aGlzLnRpbWVDb21wbGV0ZSA9IHRoaXMudGltZVN0YXJ0ICsgdGhpcy50aW1lRHVyYXRpb247XHJcblx0XHRcdC8vdXBkYXRlQ2FjaGUoKTtcclxuXHRcdFx0Ly8gVE9ETzogdGFrZSBwYXVzZSBpbnRvIGNvbnNpZGVyYXRpb24hXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGdldCB0aW1lKCk6bnVtYmVyIHtcclxuXHRcdFx0cmV0dXJuICh0aGlzLnRpbWVDb21wbGV0ZSAtIHRoaXMudGltZVN0YXJ0KSAvICh0aGlzLl91c2VGcmFtZXMgPyAxIDogMTAwMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHNldCB0aW1lKHZhbHVlOm51bWJlcikge1xyXG5cdFx0XHR0aGlzLnRpbWVDb21wbGV0ZSA9IHRoaXMudGltZVN0YXJ0ICsgKHZhbHVlICogKHRoaXMuX3VzZUZyYW1lcyA/IDEgOiAxMDAwKSk7XHJcblx0XHRcdHRoaXMudXBkYXRlQ2FjaGUoKTtcclxuXHRcdFx0Ly8gVE9ETzogdGFrZSBwYXVzZSBpbnRvIGNvbnNpZGVyYXRpb24hXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGdldCBwYXVzZWQoKTpib29sZWFuIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuX3BhdXNlZDtcclxuXHRcdH1cclxuXHJcblx0XHQvKlxyXG5cdFx0cHVibGljIGZ1bmN0aW9uIHNldCBwYXVzZWQocF92YWx1ZTpib29sZWFuKTp2b2lkIHtcclxuXHRcdFx0aWYgKHBfdmFsdWUgPT0gX3BhdXNlZCkgcmV0dXJuO1xyXG5cdFx0XHRfcGF1c2VkID0gcF92YWx1ZTtcclxuXHRcdFx0aWYgKHBhdXNlZCkge1xyXG5cdFx0XHRcdC8vIHBhdXNlXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gcmVzdW1lXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCovXHJcblxyXG5cdFx0cHVibGljIGdldCB1c2VGcmFtZXMoKTpib29sZWFuIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuX3VzZUZyYW1lcztcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0IHVzZUZyYW1lcyh2YWx1ZTpib29sZWFuKSB7XHJcblx0XHRcdHZhciB0RGVsYXk6bnVtYmVyID0gdGhpcy5kZWxheTtcclxuXHRcdFx0dmFyIHRUaW1lOm51bWJlciA9IHRoaXMudGltZTtcclxuXHRcdFx0dGhpcy5fdXNlRnJhbWVzID0gdmFsdWU7XHJcblx0XHRcdHRoaXMudGltZVN0YXJ0ID0gdGhpcy5fdXNlRnJhbWVzID8gWlR3ZWVuLmN1cnJlbnRUaW1lRnJhbWUgOiBaVHdlZW4uY3VycmVudFRpbWU7XHJcblx0XHRcdHRoaXMuZGVsYXkgPSB0RGVsYXk7XHJcblx0XHRcdHRoaXMudGltZSA9IHRUaW1lO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgdGFyZ2V0KCk6YW55IHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuX3RhcmdldDtcclxuXHRcdH1cclxuXHRcdHB1YmxpYyBzZXQgdGFyZ2V0KHRhcmdldDphbnkpIHtcclxuXHRcdFx0dGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgb25TdGFydCgpOlNpbXBsZVNpZ25hbDxGdW5jdGlvbj4ge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5fb25TdGFydDtcclxuXHRcdH1cclxuXHRcdHB1YmxpYyBnZXQgb25VcGRhdGUoKTpTaW1wbGVTaWduYWw8RnVuY3Rpb24+IHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuX29uVXBkYXRlO1xyXG5cdFx0fVxyXG5cdFx0cHVibGljIGdldCBvbkNvbXBsZXRlKCk6U2ltcGxlU2lnbmFsPEZ1bmN0aW9uPiB7XHJcblx0XHRcdHJldHVybiB0aGlzLl9vbkNvbXBsZXRlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y2xhc3MgWlR3ZWVuUHJvcGVydHkge1xyXG5cclxuXHRcdHB1YmxpYyB2YWx1ZVN0YXJ0OiBudW1iZXI7XHRcdFx0XHRcdC8vIFN0YXJ0aW5nIHZhbHVlIG9mIHRoZSB0d2VlbmluZyAoTmFOIGlmIG5vdCBzdGFydGVkIHlldClcclxuXHRcdHB1YmxpYyB2YWx1ZUNvbXBsZXRlOiBudW1iZXI7XHRcdFx0XHQvLyBGaW5hbCBkZXNpcmVkIHZhbHVlXHJcblx0XHRwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuXHRcdHB1YmxpYyB2YWx1ZUNoYW5nZTogbnVtYmVyO1x0XHRcdFx0XHQvLyBDaGFuZ2UgbmVlZGVkIGluIHZhbHVlIChjYWNoZSlcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihuYW1lOnN0cmluZywgdmFsdWVDb21wbGV0ZTpudW1iZXIpIHtcclxuXHRcdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHRcdFx0dGhpcy52YWx1ZUNvbXBsZXRlID0gdmFsdWVDb21wbGV0ZTtcclxuXHRcdFx0Ly9oYXNNb2RpZmllclx0XHRcdD1cdGJvb2xlYW4ocF9tb2RpZmllckZ1bmN0aW9uKTtcclxuXHRcdFx0Ly9tb2RpZmllckZ1bmN0aW9uIFx0PVx0cF9tb2RpZmllckZ1bmN0aW9uO1xyXG5cdFx0XHQvL21vZGlmaWVyUGFyYW1ldGVyc1x0PVx0cF9tb2RpZmllclBhcmFtZXRlcnM7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRaVHdlZW4uX2luaXQoKTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=