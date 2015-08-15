define(["require", "exports"], function (require, exports) {
    /**
     * @author zeh fernando
     */
    var SimpleSignal = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function SimpleSignal() {
            // Super-simple signals class inspired by Robert Penner's AS3Signals:
            // http://github.com/robertpenner/as3-signals
            // Properties
            this.functions = [];
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        SimpleSignal.prototype.add = function (func) {
            if (this.functions.indexOf(func) == -1) {
                this.functions.push(func);
                return true;
            }
            return false;
        };
        SimpleSignal.prototype.remove = function (func) {
            this.ifr = this.functions.indexOf(func);
            if (this.ifr > -1) {
                this.functions.splice(this.ifr, 1);
                return true;
            }
            return false;
        };
        SimpleSignal.prototype.removeAll = function () {
            if (this.functions.length > 0) {
                this.functions.length = 0;
                return true;
            }
            return false;
        };
        SimpleSignal.prototype.dispatch = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var functionsDuplicate = this.functions.concat();
            for (var i = 0; i < functionsDuplicate.length; i++) {
                functionsDuplicate[i].apply(undefined, args);
            }
        };
        Object.defineProperty(SimpleSignal.prototype, "numItems", {
            // ================================================================================================================
            // ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------
            get: function () {
                return this.functions.length;
            },
            enumerable: true,
            configurable: true
        });
        return SimpleSignal;
    })();
    exports.default = SimpleSignal;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpZ25hbHMvU2ltcGxlU2lnbmFsLnRzIl0sIm5hbWVzIjpbIlNpbXBsZVNpZ25hbCIsIlNpbXBsZVNpZ25hbC5jb25zdHJ1Y3RvciIsIlNpbXBsZVNpZ25hbC5hZGQiLCJTaW1wbGVTaWduYWwucmVtb3ZlIiwiU2ltcGxlU2lnbmFsLnJlbW92ZUFsbCIsIlNpbXBsZVNpZ25hbC5kaXNwYXRjaCIsIlNpbXBsZVNpZ25hbC5udW1JdGVtcyJdLCJtYXBwaW5ncyI6IjtJQUFBLEFBR0E7O09BREc7O1FBYUZBLG1IQUFtSEE7UUFDbkhBLG1IQUFtSEE7UUFFbkhBO1lBYkFDLHFFQUFxRUE7WUFDckVBLDZDQUE2Q0E7WUFFN0NBLGFBQWFBO1lBQ0xBLGNBQVNBLEdBQVlBLEVBQUVBLENBQUNBO1FBVWhDQSxDQUFDQTtRQUdERCxtSEFBbUhBO1FBQ25IQSxtSEFBbUhBO1FBRTVHQSwwQkFBR0EsR0FBVkEsVUFBV0EsSUFBTUE7WUFDaEJFLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4Q0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzFCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUNiQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUNkQSxDQUFDQTtRQUVNRiw2QkFBTUEsR0FBYkEsVUFBY0EsSUFBTUE7WUFDbkJHLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ3hDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkJBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDYkEsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDZEEsQ0FBQ0E7UUFFTUgsZ0NBQVNBLEdBQWhCQTtZQUNDSSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDL0JBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO2dCQUMxQkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDYkEsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDZEEsQ0FBQ0E7UUFFTUosK0JBQVFBLEdBQWZBO1lBQWdCSyxjQUFhQTtpQkFBYkEsV0FBYUEsQ0FBYkEsc0JBQWFBLENBQWJBLElBQWFBO2dCQUFiQSw2QkFBYUE7O1lBQzVCQSxJQUFJQSxrQkFBa0JBLEdBQW1CQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtZQUNqRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBVUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0Esa0JBQWtCQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDM0RBLGtCQUFrQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDOUNBLENBQUNBO1FBQ0ZBLENBQUNBO1FBTURMLHNCQUFXQSxrQ0FBUUE7WUFIbkJBLG1IQUFtSEE7WUFDbkhBLG1IQUFtSEE7aUJBRW5IQTtnQkFDQ00sTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDOUJBLENBQUNBOzs7V0FBQU47UUFDRkEsbUJBQUNBO0lBQURBLENBN0RBLEFBNkRDQSxJQUFBO0lBN0RELDhCQTZEQyxDQUFBIiwiZmlsZSI6InNpZ25hbHMvU2ltcGxlU2lnbmFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBhdXRob3IgemVoIGZlcm5hbmRvXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW1wbGVTaWduYWw8RiBleHRlbmRzIEZ1bmN0aW9uPiB7XHJcblxyXG5cdC8vIFN1cGVyLXNpbXBsZSBzaWduYWxzIGNsYXNzIGluc3BpcmVkIGJ5IFJvYmVydCBQZW5uZXIncyBBUzNTaWduYWxzOlxyXG5cdC8vIGh0dHA6Ly9naXRodWIuY29tL3JvYmVydHBlbm5lci9hczMtc2lnbmFsc1xyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSBmdW5jdGlvbnM6QXJyYXk8Rj4gPSBbXTtcclxuXHJcblx0Ly8gVGVtcCB2YXJpYWJsZXNcclxuXHRwcml2YXRlIGlmcjpudW1iZXI7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ09OU1RSVUNUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwdWJsaWMgYWRkKGZ1bmM6Rik6Ym9vbGVhbiB7XHJcblx0XHRpZiAodGhpcy5mdW5jdGlvbnMuaW5kZXhPZihmdW5jKSA9PSAtMSkge1xyXG5cdFx0XHR0aGlzLmZ1bmN0aW9ucy5wdXNoKGZ1bmMpO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZW1vdmUoZnVuYzpGKTpib29sZWFuIHtcclxuXHRcdHRoaXMuaWZyID0gdGhpcy5mdW5jdGlvbnMuaW5kZXhPZihmdW5jKTtcclxuXHRcdGlmICh0aGlzLmlmciA+IC0xKSB7XHJcblx0XHRcdHRoaXMuZnVuY3Rpb25zLnNwbGljZSh0aGlzLmlmciwgMSk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlbW92ZUFsbCgpOmJvb2xlYW4ge1xyXG5cdFx0aWYgKHRoaXMuZnVuY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0dGhpcy5mdW5jdGlvbnMubGVuZ3RoID0gMDtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZGlzcGF0Y2goLi4uYXJnczphbnlbXSk6dm9pZCB7XHJcblx0XHR2YXIgZnVuY3Rpb25zRHVwbGljYXRlOkFycmF5PEZ1bmN0aW9uPiA9IHRoaXMuZnVuY3Rpb25zLmNvbmNhdCgpO1xyXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgZnVuY3Rpb25zRHVwbGljYXRlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGZ1bmN0aW9uc0R1cGxpY2F0ZVtpXS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBQ0NFU1NPUiBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHB1YmxpYyBnZXQgbnVtSXRlbXMoKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuZnVuY3Rpb25zLmxlbmd0aDtcclxuXHR9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9