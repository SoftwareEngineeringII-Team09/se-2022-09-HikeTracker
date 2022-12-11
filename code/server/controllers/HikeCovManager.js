"use strict";

class CoverageClass {
    testFunction() {
        const x = 2;
        const y = x + 2;
        console.log(y);
    }
}

module.exports = new CoverageClass();