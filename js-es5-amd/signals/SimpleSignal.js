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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimpleSignal;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpZ25hbHMvU2ltcGxlU2lnbmFsLnRzIl0sIm5hbWVzIjpbIlNpbXBsZVNpZ25hbCIsIlNpbXBsZVNpZ25hbC5jb25zdHJ1Y3RvciIsIlNpbXBsZVNpZ25hbC5hZGQiLCJTaW1wbGVTaWduYWwucmVtb3ZlIiwiU2ltcGxlU2lnbmFsLnJlbW92ZUFsbCIsIlNpbXBsZVNpZ25hbC5kaXNwYXRjaCIsIlNpbXBsZVNpZ25hbC5udW1JdGVtcyJdLCJtYXBwaW5ncyI6IjtJQUFBOztPQUVHO0lBQ0g7UUFZQ0EsbUhBQW1IQTtRQUNuSEEsbUhBQW1IQTtRQUVuSEE7WUFiQUMscUVBQXFFQTtZQUNyRUEsNkNBQTZDQTtZQUU3Q0EsYUFBYUE7WUFDTEEsY0FBU0EsR0FBWUEsRUFBRUEsQ0FBQ0E7UUFVaENBLENBQUNBO1FBR0RELG1IQUFtSEE7UUFDbkhBLG1IQUFtSEE7UUFFNUdBLDBCQUFHQSxHQUFWQSxVQUFXQSxJQUFNQTtZQUNoQkUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDMUJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1lBQ2JBLENBQUNBO1lBQ0RBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1FBQ2RBLENBQUNBO1FBRU1GLDZCQUFNQSxHQUFiQSxVQUFjQSxJQUFNQTtZQUNuQkcsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDeENBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25DQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUNiQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUNkQSxDQUFDQTtRQUVNSCxnQ0FBU0EsR0FBaEJBO1lBQ0NJLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUNiQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUNkQSxDQUFDQTtRQUVNSiwrQkFBUUEsR0FBZkE7WUFBZ0JLLGNBQWFBO2lCQUFiQSxXQUFhQSxDQUFiQSxzQkFBYUEsQ0FBYkEsSUFBYUE7Z0JBQWJBLDZCQUFhQTs7WUFDNUJBLElBQUlBLGtCQUFrQkEsR0FBbUJBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1lBQ2pFQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxrQkFBa0JBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUMzREEsa0JBQWtCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxTQUFTQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUM5Q0EsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFNREwsc0JBQVdBLGtDQUFRQTtZQUhuQkEsbUhBQW1IQTtZQUNuSEEsbUhBQW1IQTtpQkFFbkhBO2dCQUNDTSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUM5QkEsQ0FBQ0E7OztXQUFBTjtRQUNGQSxtQkFBQ0E7SUFBREEsQ0E3REEsQUE2RENBLElBQUE7SUE3REQ7a0NBNkRDLENBQUEiLCJmaWxlIjoic2lnbmFscy9TaW1wbGVTaWduYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGF1dGhvciB6ZWggZmVybmFuZG9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZVNpZ25hbDxGIGV4dGVuZHMgRnVuY3Rpb24+IHtcclxuXHJcblx0Ly8gU3VwZXItc2ltcGxlIHNpZ25hbHMgY2xhc3MgaW5zcGlyZWQgYnkgUm9iZXJ0IFBlbm5lcidzIEFTM1NpZ25hbHM6XHJcblx0Ly8gaHR0cDovL2dpdGh1Yi5jb20vcm9iZXJ0cGVubmVyL2FzMy1zaWduYWxzXHJcblxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwcml2YXRlIGZ1bmN0aW9uczpBcnJheTxGPiA9IFtdO1xyXG5cclxuXHQvLyBUZW1wIHZhcmlhYmxlc1xyXG5cdHByaXZhdGUgaWZyOm51bWJlcjtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDT05TVFJVQ1RPUiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQVUJMSUMgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHB1YmxpYyBhZGQoZnVuYzpGKTpib29sZWFuIHtcclxuXHRcdGlmICh0aGlzLmZ1bmN0aW9ucy5pbmRleE9mKGZ1bmMpID09IC0xKSB7XHJcblx0XHRcdHRoaXMuZnVuY3Rpb25zLnB1c2goZnVuYyk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlbW92ZShmdW5jOkYpOmJvb2xlYW4ge1xyXG5cdFx0dGhpcy5pZnIgPSB0aGlzLmZ1bmN0aW9ucy5pbmRleE9mKGZ1bmMpO1xyXG5cdFx0aWYgKHRoaXMuaWZyID4gLTEpIHtcclxuXHRcdFx0dGhpcy5mdW5jdGlvbnMuc3BsaWNlKHRoaXMuaWZyLCAxKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVtb3ZlQWxsKCk6Ym9vbGVhbiB7XHJcblx0XHRpZiAodGhpcy5mdW5jdGlvbnMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHR0aGlzLmZ1bmN0aW9ucy5sZW5ndGggPSAwO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkaXNwYXRjaCguLi5hcmdzOmFueVtdKTp2b2lkIHtcclxuXHRcdHZhciBmdW5jdGlvbnNEdXBsaWNhdGU6QXJyYXk8RnVuY3Rpb24+ID0gdGhpcy5mdW5jdGlvbnMuY29uY2F0KCk7XHJcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBmdW5jdGlvbnNEdXBsaWNhdGUubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0ZnVuY3Rpb25zRHVwbGljYXRlW2ldLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEFDQ0VTU09SIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHVibGljIGdldCBudW1JdGVtcygpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5mdW5jdGlvbnMubGVuZ3RoO1xyXG5cdH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=