import test from "node:test";
import assert from "node:assert/strict";
import {
  corpusExplorer, heKasrehReview, medicineNameLookup, editDistance,
  sentimentEvidence, poetryStructure, genericNames, moduleSamples
} from "../src/features.mjs";

test("corpus concordance counts occurrences and shows safe bounded contexts",()=>{
  const r=corpusExplorer("زبان فارسی. زبان مادری.", "زبان");
  assert.equal(r.occurrences,2);
  assert.equal(r.contexts.length,2);
  assert.equal(r.totalWords,4);
  assert.equal(corpusExplorer("", "زبان").occurrences,0);
  assert.equal(corpusExplorer("آب آب آب", "آب",1).contexts.length,1);
});
test("corpus bigrams are ranked and there is no remote corpus dependency",()=>{
  const r=corpusExplorer("من فارسی دارم. من فارسی می‌خوانم.","فارسی");
  assert.equal(r.bigrams[0].phrase,"من فارسی");
  assert.equal(r.bigrams[0].occurrences,2);
  assert.throws(()=>corpusExplorer("الف","الف".repeat(101)),RangeError);
});
test("he-kasreh flags variant spellings without silently modifying text",()=>{
  const input="خانه ی ما، خانه‌ی شما و خانهٔ بزرگ";
  const r=heKasrehReview(input);
  assert.equal(r.totalCandidates,2);
  assert.ok(r.candidates.every(x=>x.alternative.endsWith("هٔ")));
  assert.equal(heKasrehReview("خانهٔ ما").totalCandidates,0);
  assert.equal(heKasrehReview("زبان خوب").totalCandidates,0);
});
test("he-kasreh does not silently classify correct prose as incorrect",()=>{
  const r=heKasrehReview("این جمله هیچ شکل خاصی ندارد.");
  assert.equal(r.totalCandidates,0);
});
test("medicine local generic-name list contains only spelling data",()=>{
  assert.ok(genericNames.length>=12);
  for(const x of genericNames)assert.deepEqual(Object.keys(x).sort(),["aliases","en","fa"]);
});
test("medicine exact aliases, Persian and English forms work",()=>{
  assert.equal(medicineNameLookup("Acetaminophen")[0].en,"Paracetamol");
  assert.equal(medicineNameLookup("استامينوفن")[0].fa,"استامینوفن");
  assert.equal(medicineNameLookup("متفورمين")[0].en,"Metformin");
});
test("medicine typo match and limits are cautious",()=>{
  const r=medicineNameLookup("metfornin");
  assert.equal(r[0].en,"Metformin");
  assert.ok(r[0].score<100);
  assert.deepEqual(medicineNameLookup("م"),[]);
  assert.deepEqual(medicineNameLookup("notanevidencedmedicine"),[]);
  assert.throws(()=>medicineNameLookup("a".repeat(101)),RangeError);
  assert.equal(editDistance("abc","adc"),1);
});
test("sentiment evidence shows positive/negative markers without ML claims",()=>{
  const x=sentimentEvidence("فیلم عالی و داستان ضعیف بود");
  assert.equal(x.positive,1);
  assert.equal(x.negative,1);
  assert.equal(x.label,"نشانه‌های آمیخته");
});
test("sentiment aspect filter works and unknown aspects are rejected",()=>{
  const x=sentimentEvidence("داستان عالی بود اما موسیقی ضعیف بود","music");
  assert.equal(x.negative,1);
  assert.equal(sentimentEvidence("فقط داستان خوب بود","music").aspectFound,false);
  assert.throws(()=>sentimentEvidence("متن","unknown"),RangeError);
});
test("negation proximity changes signal instead of hiding it",()=>{
  const x=sentimentEvidence("داستان خوب نیست");
  assert.equal(x.negative,1);
  assert.equal(x.evidence[0].negated,true);
});
test("poetry metrics and tentative repeated endings",()=>{
  const r=poetryStructure("درخت بیدار\nدلم بی‌قرار\nو باز روز روشن");
  assert.equal(r.lines,3);
  assert.equal(r.possibleCouplets,1);
  assert.equal(r.repeatedEndings[0].ending,"ار");
  assert.equal(r.repeatedEndings[0].count,2);
  assert.ok(r.words>5);
});
test("poetry empty input is well-defined",()=>{
  const x=poetryStructure("");
  assert.equal(x.lines,0);
  assert.deepEqual(x.endings,[]);
  assert.deepEqual(x.frequentWords,[]);
});
test("all built-in samples are synthetic, nonempty and within size limits",()=>{
  assert.deepEqual(Object.keys(moduleSamples).sort(),["corpus","hekasreh","medicine","poetry","sentiment"]);
  assert.ok(Object.values(moduleSamples).every(x=>typeof x==="string" && x.length>2 && x.length<=20000));
});
