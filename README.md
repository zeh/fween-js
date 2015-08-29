# Fween

Fween tweens things.

It is a TypeScript project that builds into a JavaScript library.

Its main concept is simplicity. Its syntax uses a chained/stream methodology to construct sequences.

It is under early development.

## Syntax

With a getter/setter function pair:

    Fween.use(getterFunc, setterFunc)
        .from(value) // Optional: set the starting value
        .to(value, durationSeconds = 0, transitionFunction = Easing.none)

With an arbitrary object:

    Fween.use(obj)
        .todo

All Fween instances also include some common methods:

    Fween.use(...)
        .play()
        .pause()
        .call(function)
        .wait(seconds)

## Examples

A getter/setter animation, smooth scrolling in 1 second and then calling a function:

    Fween.use(getScrollY, setScrollY).to(0, 1, Easing.expoOut).call(completeCallback).play();

    function getScrollY() {
        return window.scrollY;
    }
    function setScrollY(value) {
        window.scrollTo(0, value;
    }
    function completeCallback() {
        console.log("Smooth scroll ended.");
    }

