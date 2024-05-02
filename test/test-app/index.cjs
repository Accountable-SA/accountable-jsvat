const { checkVAT, belgium, austria } = require("@accountable/jsvat");
const assert = require("assert");

assert.equal(checkVAT("BE0411905847", [belgium]).isValid, true);
assert.equal(checkVAT("BE0411905847", [belgium, austria]).isValid, true);
assert.equal(checkVAT("BE0411905847", [austria]).isValid, false);
