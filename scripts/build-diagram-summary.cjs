// Build the static, no-script companion from the same authored default examples.
const fs=require('node:fs');
const source=fs.readFileSync('docs/visual-study.html','utf8');
const style=source.match(/<style>([\s\S]*?)<\/style>/)[1];
const sections=[...source.matchAll(/<section class="lesson" id="(binary|grid|lis)"[\s\S]*?<div class="interactive"/g)].map(m=>m[0].slice(0,m[0].lastIndexOf('<div class="interactive"'))+'</section>');
if(sections.length!==3)throw Error('Expected all three static summaries');
fs.writeFileSync('docs/visual-study-summary.html','<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AlgoBook · 세 가지 시각화 요약</title><style>'+style+'</style></head><body><main><header class="page-header"><p class="eyebrow">ALGOBOOK / VISUAL SUMMARY</p><h1>조건과 상태, 세 장의 요약</h1><p class="intro">문서의 기본 예제입니다. 실험에서 변경한 입력을 반영한 인쇄 결과는 아닙니다.</p></header>'+sections.join('\n')+'<footer>설계 참고: cathrynlavery/diagram-design · AlgoBook의 기존 색상과 시스템 글꼴 사용</footer></main></body></html>\n');
