import { checkVAT, belgium, austria } from "@accountable/jsvat";
import assert from "assert";

assert.equal(checkVAT("BE0411905847", [belgium]).isValid, true);
assert.equal(checkVAT("BE0411905847", [belgium, austria]).isValid, true);
assert.equal(checkVAT("BE0411905847", [austria]).isValid, false);
